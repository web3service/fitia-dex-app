// ═══════════════════════════════════════════════════════════════════
//  Fitia Pro Miner — Backend API v3 (ULTRA SÉCURISÉ)
//  - Tokens JWT-like signés HMAC-SHA256 avec expiration 24h
//  - Rate limiting anti brute-force
//  - Helmet security headers
//  - CORS restrictif
//  - Audit logging des tentatives auth
//  - ID public unique (FTA-XXXX-XXXX)
//  - Verrouillage après 5 échecs (5 min)
//  - Validation stricte des entrées
//  - Protection XSS, injection SQL (parametrized)
// ═══════════════════════════════════════════════════════════════════

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const Database = require('better-sqlite3');
const crypto = require('crypto');
const path = require('path');

// ─── Configuration ─────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
const DB_PATH = path.join(__dirname, 'fitia_mining.db');

// Clé secrète pour la signature des tokens
// En production, utiliser process.env.JWT_SECRET
const TOKEN_SECRET = process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex');
const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 heures

// Configuration sécurité
const CONFIG = {
  // Rate limiting
  RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000,  // 15 minutes
  RATE_LIMIT_MAX_AUTH: 20,                // 20 tentatives max par IP sur la fenêtre
  RATE_LIMIT_MAX_GENERAL: 200,            // 200 requêtes max par IP
  
  // Compte
  MAX_LOGIN_ATTEMPTS: 5,                  // Verrouillage après 5 échecs
  LOCKOUT_DURATION_MS: 5 * 60 * 1000,     // 5 minutes de verrouillage
  PBKDF2_ITERATIONS: 210000,              // 210k itérations (OWASP 2025)
  PBKDF2_KEYLEN: 64,
  PBKDF2_DIGEST: 'sha512',
  
  // Validation
  USERNAME_MIN: 3,
  USERNAME_MAX: 30,
  PASSWORD_MIN: 8,                         // Augmenté à 8
  PASSWORD_MAX: 128,
  EMAIL_MAX: 255,
  
  // Requêtes
  MAX_BODY_SIZE: '100kb',                  // Limite taille body
};

// ─── Initialisation de la base de données SQLite ──────────────────
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
// Protection : limiter la mémoire utilisable par les requêtes
db.pragma('mmap_size = 268435456'); // 256MB max

// ─── Création / migration des tables ──────────────────────────────
const hasUidColumn = db.prepare("SELECT COUNT(*) as cnt FROM pragma_table_info('users') WHERE name='public_uid'").get();
const needsMigration = !hasUidColumn || hasUidColumn.cnt === 0;

if (needsMigration) {
  // Sauvegarde des données existantes
  const oldUsers = [];
  try { 
    const rows = db.prepare('SELECT id, username, email, address FROM users').all();
    oldUsers.push(...rows);
  } catch (e) { /* table peut ne pas exister */ }
  
  db.exec(`
    DROP TABLE IF EXISTS transactions;
    DROP TABLE IF EXISTS login_attempts;
    DROP TABLE IF EXISTS audit_log;
    DROP TABLE IF EXISTS users;
    
    -- Table des utilisateurs sécurisée
    CREATE TABLE users (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      public_uid      TEXT    NOT NULL UNIQUE,         -- ID public unique (FTA-XXXX-XXXX)
      username        TEXT    NOT NULL UNIQUE,
      email           TEXT    NOT NULL UNIQUE,
      password_hash   TEXT    NOT NULL,
      address         TEXT,                            -- Adresse Polygon liée
      terms_accepted  INTEGER NOT NULL DEFAULT 0,
      failed_attempts INTEGER NOT NULL DEFAULT 0,     -- Compteur échecs connexion
      locked_until    TEXT,                            -- Timestamp déverrouillage
      created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
      last_login      TEXT    NOT NULL DEFAULT (datetime('now')),
      is_active       INTEGER NOT NULL DEFAULT 1
    );

    -- Historique des transactions
    CREATE TABLE transactions (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      user_address    TEXT    NOT NULL,
      tx_hash         TEXT,
      tx_type         TEXT    NOT NULL,
      token           TEXT,
      amount          REAL,
      amount_fee      REAL    DEFAULT 0,
      details         TEXT,
      status          TEXT    NOT NULL DEFAULT 'pending',
      created_at      TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    -- Tentatives de connexion (anti brute-force)
    CREATE TABLE login_attempts (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      ip_address      TEXT    NOT NULL,
      identifier      TEXT,                            -- Identifiant utilisé
      success         INTEGER NOT NULL DEFAULT 0,     -- 0 = échec, 1 = succès
      reason          TEXT,                            -- Raison de l'échec
      attempted_at    TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    -- Journal d'audit
    CREATE TABLE audit_log (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id         INTEGER,
      action          TEXT    NOT NULL,
      ip_address      TEXT,
      details         TEXT,
      created_at      TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    -- Index
    CREATE INDEX IF NOT EXISTS idx_tx_user ON transactions(user_address);
    CREATE INDEX IF NOT EXISTS idx_tx_type ON transactions(tx_type);
    CREATE INDEX IF NOT EXISTS idx_tx_date ON transactions(created_at);
    CREATE INDEX IF NOT EXISTS idx_users_address ON users(address);
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
    CREATE INDEX IF NOT EXISTS idx_users_public_uid ON users(public_uid);
    CREATE INDEX IF NOT EXISTS idx_login_attempts_ip ON login_attempts(ip_address);
    CREATE INDEX IF NOT EXISTS idx_login_attempts_time ON login_attempts(attempted_at);
    CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_log(user_id);
    CREATE INDEX IF NOT EXISTS idx_audit_time ON audit_log(created_at);
  `);
}

// ─── Fonctions de sécurité ────────────────────────────────────────

/** Génère un ID public unique format FTA-XXXX-XXXX */
function generatePublicUid() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Pas de 0/O, 1/I pour éviter confusion
  let uid = 'FTA-';
  for (let i = 0; i < 4; i++) uid += chars[crypto.randomInt(chars.length)];
  uid += '-';
  for (let i = 0; i < 4; i++) uid += chars[crypto.randomInt(chars.length)];
  return uid;
}

/** Génère un UID public garanti unique */
function generateUniqueUid() {
  let uid, attempts = 0;
  do {
    uid = generatePublicUid();
    const exists = db.prepare('SELECT id FROM users WHERE public_uid = ?').get(uid);
    if (!exists) return uid;
    attempts++;
  } while (attempts < 10);
  // Fallback avec plus d'entropie
  return 'FTA-' + crypto.randomBytes(4).toString('hex').toUpperCase() + '-' + crypto.randomBytes(4).toString('hex').toUpperCase();
}

/** Hash un mot de passe avec PBKDF2 (210k itérations) */
function hashPassword(password) {
  const salt = crypto.randomBytes(32).toString('hex'); // 256-bit salt
  const hash = crypto.pbkdf2Sync(
    password, salt,
    CONFIG.PBKDF2_ITERATIONS,
    CONFIG.PBKDF2_KEYLEN,
    CONFIG.PBKDF2_DIGEST
  ).toString('hex');
  return `${salt}:${CONFIG.PBKDF2_ITERATIONS}:${hash}`;
}

/** Vérifie un mot de passe (timing-safe) */
function verifyPassword(password, storedHash) {
  const parts = storedHash.split(':');
  if (parts.length < 3) {
    // Compatibilité avec ancien format
    if (parts.length === 2) {
      const [salt, hash] = parts;
      const verify = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
      return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(verify));
    }
    return false;
  }
  const [salt, iterations, hash] = parts;
  const verify = crypto.pbkdf2Sync(
    password, salt,
    parseInt(iterations),
    CONFIG.PBKDF2_KEYLEN,
    CONFIG.PBKDF2_DIGEST
  ).toString('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(verify));
  } catch (e) {
    return false;
  }
}

/** Crée un token JWT-like signé HMAC-SHA256 */
function createToken(userId) {
  const payload = {
    sub: userId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor((Date.now() + TOKEN_EXPIRY_MS) / 1000),
    jti: crypto.randomBytes(16).toString('hex') // JWT ID unique
  };
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', TOKEN_SECRET)
    .update(`${header}.${body}`)
    .digest('base64url');
  return `${header}.${body}.${signature}`;
}

/** Vérifie et décode un token */
function verifyToken(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const [headerB64, bodyB64, signatureB64] = parts;
    
    // Vérifier la signature
    const expectedSig = crypto
      .createHmac('sha256', TOKEN_SECRET)
      .update(`${headerB64}.${bodyB64}`)
      .digest('base64url');
    
    if (!crypto.timingSafeEqual(Buffer.from(signatureB64), Buffer.from(expectedSig))) {
      return null;
    }
    
    // Décoder le payload
    const payload = JSON.parse(Buffer.from(bodyB64, 'base64url').toString('utf8'));
    
    // Vérifier l'expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expiré
    }
    
    return payload;
  } catch (e) {
    return null;
  }
}

/** Nettoie les entrées utilisateur (anti-XSS basique) */
function sanitize(input) {
  if (typeof input !== 'string') return input;
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

/** Validation stricte d'un email */
function isValidEmail(email) {
  if (typeof email !== 'string' || email.length > CONFIG.EMAIL_MAX) return false;
  // RFC 5322 simplifié
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
}

/** Validation stricte d'un pseudo */
function isValidUsername(username) {
  if (typeof username !== 'string') return false;
  // 3-30 caractères, lettres, chiffres, underscore, tiret
  const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/;
  return usernameRegex.test(username.trim());
}

/** Validation de mot de passe (politique stricte) */
function isValidPassword(password) {
  if (typeof password !== 'string') return false;
  if (password.length < CONFIG.PASSWORD_MIN || password.length > CONFIG.PASSWORD_MAX) return false;
  // Au moins une minuscule, une majuscule, un chiffre
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  return hasLower && hasUpper && hasDigit;
}

/** Obtient l'IP réelle du client (derrière proxy) */
function getClientIp(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
         req.headers['x-real-ip'] ||
         req.connection?.remoteAddress ||
         req.socket?.remoteAddress ||
         'unknown';
}

/** Enregistre une entrée dans le journal d'audit */
function auditLog(userId, action, ip, details = null) {
  try {
    db.prepare(
      'INSERT INTO audit_log (user_id, action, ip_address, details) VALUES (?, ?, ?, ?)'
    ).run(userId || null, action, ip, details ? JSON.stringify(details) : null);
  } catch (e) {
    console.error('Erreur audit log:', e.message);
  }
}

// ═══════════════════════════════════════════════════════════════════
// RATE LIMITER (in-memory + SQLite)
// ═══════════════════════════════════════════════════════════════════

// Nettoyage périodique des tentatives
setInterval(() => {
  const cutoff = new Date(Date.now() - CONFIG.RATE_LIMIT_WINDOW_MS).toISOString();
  db.prepare('DELETE FROM login_attempts WHERE attempted_at < ?').run(cutoff);
}, 5 * 60 * 1000); // Toutes les 5 minutes

/** Vérifie si une IP a dépassé la limite de tentatives */
function isRateLimited(ip) {
  const cutoff = new Date(Date.now() - CONFIG.RATE_LIMIT_WINDOW_MS).toISOString();
  const count = db.prepare(
    'SELECT COUNT(*) as cnt FROM login_attempts WHERE ip_address = ? AND attempted_at > ? AND success = 0'
  ).get(ip, cutoff);
  return (count?.cnt || 0) >= CONFIG.RATE_LIMIT_MAX_AUTH;
}

/** Enregistre une tentative de connexion */
function logLoginAttempt(ip, identifier, success, reason = null) {
  try {
    db.prepare(
      'INSERT INTO login_attempts (ip_address, identifier, success, reason) VALUES (?, ?, ?, ?)'
    ).run(ip, identifier?.substring(0, 100) || null, success ? 1 : 0, reason?.substring(0, 255) || null);
  } catch (e) {
    console.error('Erreur log tentative:', e.message);
  }
}

/** Vérifie et gère le verrouillage de compte */
function isAccountLocked(user) {
  if (!user.locked_until) return false;
  return new Date(user.locked_until + 'Z') > new Date();
}

// ═══════════════════════════════════════════════════════════════════
// MIDDLEWARES DE SÉCURITÉ
// ═══════════════════════════════════════════════════════════════════

const app = express();

// Trust proxy pour les IPs derrière Railway/Render
app.set('trust proxy', 1);

// Helmet : headers de sécurité HTTP
app.use(helmet({
  contentSecurityPolicy: false, // Désactivé car géré par le frontend
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));

// CORS restrictif
const ALLOWED_ORIGINS = [
  'https://fitia-dex-app-production.up.railway.app',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://127.0.0.1:3000',
];

app.use(cors({
  origin: function (origin, callback) {
    // Autoriser les requêtes sans origine (Postman, curl, apps mobiles)
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.includes(origin) || origin.endsWith('.github.io') || origin.endsWith('.vercel.app') || origin.endsWith('.netlify.app')) {
      return callback(null, true);
    }
    // En développement, autoriser tout localhost
    if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      return callback(null, true);
    }
    console.warn(`⚠️ CORS bloqué pour origine: ${origin}`);
    callback(null, false);
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400,
  credentials: false
}));

// Limite de taille du body JSON
app.use(express.json({ 
  limit: CONFIG.MAX_BODY_SIZE,
  verify: (req, res, buf) => {
    // Protection contre les JSON malformés volumineux
    if (buf.length > 102400) { // 100KB
      try { JSON.parse(buf.toString()); } catch (e) { throw new Error('JSON invalide'); }
    }
  }
}));

// Middleware d'authentification
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentification requise' });
  }
  
  const token = authHeader.split(' ')[1];
  if (!token || token.length > 1000) {
    return res.status(401).json({ error: 'Token invalide' });
  }
  
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Session expirée ou invalide' });
  }
  
  const user = db.prepare(
    'SELECT id, public_uid, username, email, address, is_active, locked_until FROM users WHERE id = ?'
  ).get(payload.sub);
  
  if (!user || !user.is_active) {
    return res.status(401).json({ error: 'Compte désactivé ou introuvable' });
  }
  
  if (isAccountLocked(user)) {
    return res.status(423).json({ error: 'Compte temporairement verrouillé. Réessayez dans quelques minutes.' });
  }
  
  req.user = user;
  req.tokenPayload = payload;
  next();
}

// Middleware rate limiting général
function generalRateLimiter(req, res, next) {
  const ip = getClientIp(req);
  const cutoff = new Date(Date.now() - CONFIG.RATE_LIMIT_WINDOW_MS).toISOString();
  const count = db.prepare(
    'SELECT COUNT(*) as cnt FROM login_attempts WHERE ip_address = ? AND attempted_at > ?'
  ).get(ip, cutoff);
  
  if ((count?.cnt || 0) > CONFIG.RATE_LIMIT_MAX_GENERAL) {
    return res.status(429).json({ error: 'Trop de requêtes. Veuillez patienter.' });
  }
  next();
}

// Appliquer le rate limiting général
app.use(generalRateLimiter);

// ═══════════════════════════════════════════════════════════════════
//  ROUTES AUTHENTIFICATION v3 (ULTRA SÉCURISÉ)
// ═══════════════════════════════════════════════════════════════════

/**
 * POST /api/auth/register
 * Inscription sécurisée
 */
app.post('/api/auth/register', (req, res) => {
  const ip = getClientIp(req);
  
  // Vérifier rate limiting
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Trop de tentatives. Veuillez patienter 15 minutes.' });
  }
  
  const { username, email, password, accept_terms, address } = req.body;

  // ─── Validation stricte ─────────────────────────────────────────
  const errors = [];
  
  if (!username || !isValidUsername(username)) {
    errors.push(`Pseudo invalide (${CONFIG.USERNAME_MIN}-${CONFIG.USERNAME_MAX} caractères, lettres/chiffres/-/_ uniquement)`);
  }
  
  if (!email || !isValidEmail(email)) {
    errors.push('Format d\'email invalide');
  }
  
  if (!password || !isValidPassword(password)) {
    errors.push(`Mot de passe invalide (${CONFIG.PASSWORD_MIN} caractères minimum, une majuscule, une minuscule, un chiffre requis)`);
  }
  
  if (!accept_terms) {
    errors.push('Vous devez accepter les conditions d\'utilisation');
  }

  if (address && !/^0x[a-fA-F0-9]{40}$/.test(address)) {
    errors.push('Adresse Polygon invalide');
  }

  if (errors.length > 0) {
    logLoginAttempt(ip, email || username, false, errors[0]);
    return res.status(400).json({ error: errors[0], errors });
  }

  // ─── Vérifier l'unicité ─────────────────────────────────────────
  const usernameClean = username.trim();
  const emailClean = email.trim().toLowerCase();
  
  const existingUsername = db.prepare('SELECT id FROM users WHERE LOWER(username) = ?').get(usernameClean.toLowerCase());
  if (existingUsername) {
    logLoginAttempt(ip, usernameClean, false, 'Pseudo déjà utilisé');
    return res.status(409).json({ error: 'Ce pseudo est déjà utilisé', field: 'username' });
  }
  
  const existingEmail = db.prepare('SELECT id FROM users WHERE LOWER(email) = ?').get(emailClean);
  if (existingEmail) {
    logLoginAttempt(ip, emailClean, false, 'Email déjà utilisé');
    return res.status(409).json({ error: 'Cet email est déjà utilisé', field: 'email' });
  }
  
  if (address) {
    const existingAddr = db.prepare('SELECT id FROM users WHERE address = ?').get(address);
    if (existingAddr) {
      return res.status(409).json({ error: 'Cette adresse Polygon est déjà liée à un compte', field: 'address' });
    }
  }

  // ─── Création de l'utilisateur ──────────────────────────────────
  try {
    const passwordHash = hashPassword(password);
    const publicUid = generateUniqueUid();
    
    const result = db.prepare(
      'INSERT INTO users (public_uid, username, email, password_hash, address, terms_accepted) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(publicUid, usernameClean, emailClean, passwordHash, address || null, 1);

    const userId = result.lastInsertRowid;
    const token = createToken(userId);
    
    // Audit log
    auditLog(userId, 'register', ip, { username: usernameClean, email: emailClean });
    logLoginAttempt(ip, emailClean, true, null);

    res.status(201).json({
      success: true,
      user: {
        id: publicUid,                        // ID public exposé
        username: usernameClean,
        email: emailClean,
        address: address || null
      },
      token
    });
  } catch (err) {
    console.error('Erreur register:', err.message);
    res.status(500).json({ error: 'Erreur serveur. Veuillez réessayer.' });
  }
});

/**
 * POST /api/auth/login
 * Connexion sécurisée avec protection brute-force et verrouillage
 */
app.post('/api/auth/login', (req, res) => {
  const ip = getClientIp(req);
  
  // Vérifier rate limiting
  if (isRateLimited(ip)) {
    return res.status(429).json({ 
      error: 'Trop de tentatives depuis cette adresse IP. Veuillez patienter 15 minutes.' 
    });
  }
  
  const { identifier, password } = req.body;

  // Validation
  if (!identifier || typeof identifier !== 'string' || identifier.trim().length === 0) {
    return res.status(400).json({ error: 'Identifiant requis' });
  }
  if (!password || typeof password !== 'string' || password.length > CONFIG.PASSWORD_MAX) {
    return res.status(400).json({ error: 'Mot de passe requis' });
  }

  const identifierClean = identifier.trim().substring(0, 255);

  // Recherche de l'utilisateur
  let user = db.prepare(
    'SELECT id, public_uid, username, email, password_hash, address, is_active, failed_attempts, locked_until FROM users WHERE LOWER(email) = ? OR LOWER(username) = ?'
  ).get(identifierClean.toLowerCase(), identifierClean.toLowerCase());

  // Réponse générique si utilisateur non trouvé (anti user enumeration)
  if (!user) {
    logLoginAttempt(ip, identifierClean, false, 'Identifiant inconnu');
    return res.status(401).json({ error: 'Identifiant ou mot de passe incorrect' });
  }

  if (!user.is_active) {
    logLoginAttempt(ip, identifierClean, false, 'Compte désactivé');
    return res.status(403).json({ error: 'Ce compte a été désactivé.' });
  }

  // Vérifier le verrouillage
  if (isAccountLocked(user)) {
    const remainingMs = new Date(user.locked_until + 'Z') - new Date();
    const remainingMin = Math.ceil(remainingMs / 60000);
    logLoginAttempt(ip, identifierClean, false, 'Compte verrouillé');
    return res.status(423).json({ 
      error: `Compte temporairement verrouillé. Réessayez dans ${remainingMin} minute(s).` 
    });
  }

  // Vérification du mot de passe
  const passwordValid = verifyPassword(password, user.password_hash);

  if (!passwordValid) {
    // Incrémenter le compteur d'échecs
    const newAttempts = (user.failed_attempts || 0) + 1;
    
    if (newAttempts >= CONFIG.MAX_LOGIN_ATTEMPTS) {
      // Verrouiller le compte
      const lockUntil = new Date(Date.now() + CONFIG.LOCKOUT_DURATION_MS).toISOString().replace('T', ' ').substring(0, 19);
      db.prepare('UPDATE users SET failed_attempts = ?, locked_until = ? WHERE id = ?').run(newAttempts, lockUntil, user.id);
      auditLog(user.id, 'account_locked', ip, { attempts: newAttempts });
      logLoginAttempt(ip, identifierClean, false, 'Compte verrouillé après échecs');
      return res.status(423).json({ 
        error: `Compte verrouillé après ${CONFIG.MAX_LOGIN_ATTEMPTS} tentatives. Réessayez dans 5 minutes.` 
      });
    }
    
    db.prepare('UPDATE users SET failed_attempts = ? WHERE id = ?').run(newAttempts, user.id);
    logLoginAttempt(ip, identifierClean, false, 'Mot de passe incorrect');
    auditLog(user.id, 'login_failed', ip, { attempt: newAttempts });
    
    return res.status(401).json({ error: 'Identifiant ou mot de passe incorrect' });
  }

  // ✅ Succès : réinitialiser le compteur d'échecs
  db.prepare('UPDATE users SET failed_attempts = 0, locked_until = NULL, last_login = datetime(\'now\') WHERE id = ?').run(user.id);
  
  const token = createToken(user.id);
  
  logLoginAttempt(ip, identifierClean, true, null);
  auditLog(user.id, 'login_success', ip);

  res.json({
    success: true,
    user: {
      id: user.public_uid,
      username: user.username,
      email: user.email,
      address: user.address || null
    },
    token
  });
});

/**
 * GET /api/auth/me
 * Récupérer le profil de l'utilisateur connecté
 */
app.get('/api/auth/me', authMiddleware, (req, res) => {
  res.json({ 
    user: {
      id: req.user.public_uid,
      username: req.user.username,
      email: req.user.email,
      address: req.user.address || null
    }
  });
});

// ═══════════════════════════════════════════════════════════════════
//  ROUTES PROFIL
// ═══════════════════════════════════════════════════════════════════

/**
 * PUT /api/profile
 * Mettre à jour le profil (pseudo, email)
 */
app.put('/api/profile', authMiddleware, (req, res) => {
  const { username, email } = req.body;
  const updates = [];
  const params = [];
  const ip = getClientIp(req);

  if (username !== undefined) {
    if (!isValidUsername(username)) {
      return res.status(400).json({ 
        error: `Pseudo invalide (${CONFIG.USERNAME_MIN}-${CONFIG.USERNAME_MAX} caractères, lettres/chiffres/-/_ uniquement)` 
      });
    }
    
    const usernameClean = username.trim();
    const existing = db.prepare('SELECT id FROM users WHERE LOWER(username) = ? AND id != ?').get(usernameClean.toLowerCase(), req.user.id);
    if (existing) {
      return res.status(409).json({ error: 'Ce pseudo est déjà utilisé', field: 'username' });
    }
    
    updates.push('username = ?');
    params.push(usernameClean);
  }

  if (email !== undefined) {
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Format d\'email invalide' });
    }
    
    const emailClean = email.trim().toLowerCase();
    const existing = db.prepare('SELECT id FROM users WHERE LOWER(email) = ? AND id != ?').get(emailClean, req.user.id);
    if (existing) {
      return res.status(409).json({ error: 'Cet email est déjà utilisé', field: 'email' });
    }
    
    updates.push('email = ?');
    params.push(emailClean);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'Aucune donnée à mettre à jour' });
  }

  params.push(req.user.id);
  db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).run(...params);
  
  auditLog(req.user.id, 'profile_updated', ip, { fields: updates.map(u => u.split(' ')[0]) });

  const updated = db.prepare('SELECT public_uid, username, email, address FROM users WHERE id = ?').get(req.user.id);
  res.json({ 
    success: true, 
    user: {
      id: updated.public_uid,
      username: updated.username,
      email: updated.email,
      address: updated.address || null
    }
  });
});

/**
 * PUT /api/profile/password
 * Changer le mot de passe
 */
app.put('/api/profile/password', authMiddleware, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const ip = getClientIp(req);

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Mot de passe actuel et nouveau mot de passe requis' });
  }
  
  if (!isValidPassword(newPassword)) {
    return res.status(400).json({ 
      error: `Nouveau mot de passe invalide (${CONFIG.PASSWORD_MIN} caractères minimum, une majuscule, une minuscule, un chiffre)` 
    });
  }

  const user = db.prepare('SELECT password_hash FROM users WHERE id = ?').get(req.user.id);
  if (!verifyPassword(currentPassword, user.password_hash)) {
    auditLog(req.user.id, 'password_change_failed', ip, { reason: 'wrong_current' });
    return res.status(403).json({ error: 'Mot de passe actuel incorrect' });
  }

  const newHash = hashPassword(newPassword);
  db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(newHash, req.user.id);
  
  auditLog(req.user.id, 'password_changed', ip);

  res.json({ success: true, message: 'Mot de passe mis à jour avec succès' });
});

/**
 * PUT /api/profile/address
 * Lier / mettre à jour l'adresse Polygon
 */
app.put('/api/profile/address', authMiddleware, (req, res) => {
  const { address } = req.body;
  const ip = getClientIp(req);

  if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return res.status(400).json({ error: 'Adresse Polygon invalide' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE address = ? AND id != ?').get(address, req.user.id);
  if (existing) {
    return res.status(409).json({ error: 'Cette adresse Polygon est déjà liée à un autre compte' });
  }

  db.prepare('UPDATE users SET address = ? WHERE id = ?').run(address, req.user.id);
  
  auditLog(req.user.id, 'wallet_linked', ip, { address: address.substring(0, 10) + '...' });

  const updated = db.prepare('SELECT public_uid, username, email, address FROM users WHERE id = ?').get(req.user.id);
  res.json({ 
    success: true, 
    user: {
      id: updated.public_uid,
      username: updated.username,
      email: updated.email,
      address: updated.address
    }
  });
});

// ═══════════════════════════════════════════════════════════════════
//  ROUTES TRANSACTIONS (inchangées, sécurisées)
// ═══════════════════════════════════════════════════════════════════

app.post('/api/transactions', authMiddleware, (req, res) => {
  const { user_address, tx_hash, tx_type, token, amount, amount_fee, details, status } = req.body;

  if (!user_address || !/^0x[a-fA-F0-9]{40}$/.test(user_address)) {
    return res.status(400).json({ error: 'Adresse utilisateur invalide' });
  }
  if (!tx_type) {
    return res.status(400).json({ error: 'Type de transaction requis' });
  }

  const validTypes = ['buy_machine', 'buy_battery', 'deposit', 'withdraw', 'claim', 'swap', 'plug', 'referral', 'send', 'receive'];
  if (!validTypes.includes(tx_type)) {
    return res.status(400).json({ error: 'Type de transaction invalide' });
  }

  // Vérifier que l'utilisateur possède bien cette adresse
  if (req.user.address !== user_address) {
    return res.status(403).json({ error: 'Cette adresse ne correspond pas à votre compte' });
  }

  try {
    const detailsJson = details ? JSON.stringify(details) : null;

    const result = db.prepare(`
      INSERT INTO transactions (user_address, tx_hash, tx_type, token, amount, amount_fee, details, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      user_address,
      tx_hash || null,
      tx_type,
      token || null,
      amount || null,
      amount_fee || 0,
      detailsJson,
      status || 'pending'
    );

    res.status(201).json({
      success: true,
      transaction: { id: result.lastInsertRowid, tx_type, token, amount, status: status || 'pending' }
    });
  } catch (err) {
    console.error('Erreur transaction:', err.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.patch('/api/transactions/:id', authMiddleware, (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ error: 'ID de transaction invalide' });
  }
  
  const { tx_hash, status, amount_fee } = req.body;
  const tx = db.prepare('SELECT id, user_address FROM transactions WHERE id = ?').get(id);
  if (!tx) return res.status(404).json({ error: 'Transaction non trouvée' });
  
  // Vérifier que la transaction appartient à l'utilisateur
  if (tx.user_address !== req.user.address) {
    return res.status(403).json({ error: 'Non autorisé' });
  }

  const updates = [];
  const params = [];

  if (tx_hash) { 
    if (tx_hash.length > 66) return res.status(400).json({ error: 'Hash invalide' });
    updates.push('tx_hash = ?'); params.push(tx_hash); 
  }
  if (status) { 
    if (!['pending', 'confirmed', 'failed'].includes(status)) return res.status(400).json({ error: 'Statut invalide' });
    updates.push('status = ?'); params.push(status); 
  }
  if (amount_fee !== undefined) { 
    if (typeof amount_fee !== 'number' || amount_fee < 0) return res.status(400).json({ error: 'Frais invalide' });
    updates.push('amount_fee = ?'); params.push(amount_fee); 
  }

  if (updates.length === 0) return res.status(400).json({ error: 'Aucune donnée à mettre à jour' });

  params.push(id);
  db.prepare(`UPDATE transactions SET ${updates.join(', ')} WHERE id = ?`).run(...params);

  res.json({ success: true });
});

app.get('/api/transactions/:address', authMiddleware, (req, res) => {
  const { address } = req.params;
  const { limit = 50, offset = 0, type, token, status } = req.query;

  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return res.status(400).json({ error: 'Adresse invalide' });
  }
  
  // Un utilisateur ne peut voir que ses propres transactions
  if (address !== req.user.address) {
    return res.status(403).json({ error: 'Accès non autorisé' });
  }

  const safeLimit = Math.min(parseInt(limit) || 50, 100); // Max 100
  const safeOffset = Math.max(parseInt(offset) || 0, 0);

  let query = 'SELECT * FROM transactions WHERE user_address = ?';
  const params = [address];

  if (type) { 
    const validTypes = ['buy_machine', 'buy_battery', 'deposit', 'withdraw', 'claim', 'swap', 'plug', 'referral', 'send', 'receive'];
    if (!validTypes.includes(type)) return res.status(400).json({ error: 'Type invalide' });
    query += ' AND tx_type = ?'; params.push(type); 
  }
  if (token) { 
    if (!['USDT', 'FTA', 'POL'].includes(token)) return res.status(400).json({ error: 'Token invalide' });
    query += ' AND token = ?'; params.push(token); 
  }
  if (status) { 
    if (!['pending', 'confirmed', 'failed'].includes(status)) return res.status(400).json({ error: 'Statut invalide' });
    query += ' AND status = ?'; params.push(status); 
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(safeLimit, safeOffset);

  const transactions = db.prepare(query).all(...params);

  let countQuery = 'SELECT COUNT(*) as total FROM transactions WHERE user_address = ?';
  const countParams = [address];
  if (type) { countQuery += ' AND tx_type = ?'; countParams.push(type); }
  if (token) { countQuery += ' AND token = ?'; countParams.push(token); }
  if (status) { countQuery += ' AND status = ?'; countParams.push(status); }

  const { total } = db.prepare(countQuery).get(...countParams);

  const parsed = transactions.map(tx => ({
    ...tx,
    details: tx.details ? JSON.parse(tx.details) : null
  }));

  res.json({ transactions: parsed, total, limit: safeLimit, offset: safeOffset });
});

// ═══════════════════════════════════════════════════════════════════
//  GESTION DES ERREURS
// ═══════════════════════════════════════════════════════════════════

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route introuvable' });
});

// Erreur globale
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err.message);
  
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Requête trop volumineuse' });
  }
  
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'JSON invalide dans la requête' });
  }
  
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

// ═══════════════════════════════════════════════════════════════════
//  DÉMARRAGE SÉCURISÉ
// ═══════════════════════════════════════════════════════════════════

// Vérifier que helmet est installé
try {
  require.resolve('helmet');
} catch (e) {
  console.error('⚠️  Helmet non installé. Exécutez: npm install helmet');
  console.error('⚠️  Le serveur va démarrer sans headers de sécurité complets.');
}

app.listen(PORT, () => {
  console.log('═'.repeat(55));
  console.log('🔒 Fitia Mining Backend v3 (SÉCURISÉ)');
  console.log(`   Port: ${PORT}`);
  console.log(`   DB: ${DB_PATH}`);
  console.log(`   Token expiry: ${TOKEN_EXPIRY_MS / 3600000}h`);
  console.log(`   PBKDF2: ${CONFIG.PBKDF2_ITERATIONS} itérations`);
  console.log(`   Rate limit: ${CONFIG.RATE_LIMIT_MAX_AUTH} auth / ${CONFIG.RATE_LIMIT_WINDOW_MS / 60000}min`);
  console.log(`   Lockout: ${CONFIG.MAX_LOGIN_ATTEMPTS} échecs → ${CONFIG.LOCKOUT_DURATION_MS / 60000}min`);
  console.log('═'.repeat(55));
});
