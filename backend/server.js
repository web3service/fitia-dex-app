// ═══════════════════════════════════════════════════════════════════
//  Fitia Pro Miner — Backend Wallet Interne V2
//  - L'APP A SON PROPRE WALLET : le backend signe les transactions
//  - Chaque utilisateur inscrit reçoit une clé privée chiffrée
//  - TOUTES les actions blockchain passent par le serveur
//  - ZÉRO besoin de MetaMask/WalletConnect côté utilisateur
// ═══════════════════════════════════════════════════════════════════

const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');
const crypto = require('crypto');
const { ethers } = require('ethers');

// ─── Configuration ─────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
const DB_PATH = path.join(__dirname, 'fitia_mining.db');

// ⚠️ CONTRATS : mets ici les vraies adresses déployées sur Polygon
const CONTRACTS = {
  CORE: "0x........................................",
  MINE: "0x........................................",
  USDT: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
  FTA:  "0x........................................",
  CHAIN_ID: 137,
  // RPCs multiples avec fallback automatique (essayés dans l'ordre)
  RPC_URLS: [
    "https://polygon-rpc.com",
    "https://rpc-mainnet.maticvigil.com",
    "https://rpc-mainnet.matic.network",
    "https://rpc-mainnet.matic.quiknode.pro",
    "https://polygon.llamarpc.com",
    "https://polygon-mainnet.g.alchemy.com/v2/demo",
    "https://1rpc.io/matic"
  ]
};

// ⚠️ CLÉ PRIVÉE DU RELAYER (compte qui paye le gas pour les utilisateurs)
// Ce compte doit avoir du POL pour payer les frais de gas
const RELAYER_KEY = process.env.RELAYER_PRIVATE_KEY || "";

// Vérifie que la clé du relayer est configurée
if (!RELAYER_KEY || RELAYER_KEY.length < 64) {
  console.error('❌ ERREUR CRITIQUE : RELAYER_PRIVATE_KEY non configurée !');
  console.error('   Le financement gas et les transactions seront désactivés.');
  console.error('   Configurez la variable d\'environnement RELAYER_PRIVATE_KEY.');
}

// Initialisation de la base de données SQLite
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    address      TEXT    NOT NULL UNIQUE,
    private_key  TEXT    NOT NULL,            -- Clé privée chiffrée ou en clair ⚠️
    username     TEXT,
    created_at   TEXT    NOT NULL DEFAULT (datetime('now')),
    last_login   TEXT    NOT NULL DEFAULT (datetime('now')),
    is_active    INTEGER NOT NULL DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    user_address TEXT    NOT NULL,
    tx_hash      TEXT,
    tx_type      TEXT    NOT NULL,
    token        TEXT,
    amount       REAL,
    amount_fee   REAL    DEFAULT 0,
    details      TEXT,
    status       TEXT    NOT NULL DEFAULT 'pending',
    created_at   TEXT    NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_address) REFERENCES users(address)
  );

  CREATE INDEX IF NOT EXISTS idx_tx_user ON transactions(user_address);
  CREATE INDEX IF NOT EXISTS idx_tx_type ON transactions(tx_type);
  CREATE INDEX IF NOT EXISTS idx_tx_date ON transactions(created_at);
  CREATE INDEX IF NOT EXISTS idx_users_address ON users(address);
`);

// Migration : ajoute la colonne gas_funded si elle n'existe pas (financement unique par utilisateur)
try {
  db.exec('ALTER TABLE users ADD COLUMN gas_funded INTEGER NOT NULL DEFAULT 0');
  console.log('📌 Migration : colonne gas_funded ajoutée');
} catch (e) {
  // Colonne déjà existante, on ignore
}

// Migration : ajoute les colonnes email et password_hash pour l'auth classique
try {
  db.exec('ALTER TABLE users ADD COLUMN email TEXT');
  console.log('📌 Migration : colonne email ajoutée');
} catch (e) { /* déjà existante */ }
try {
  db.exec('ALTER TABLE users ADD COLUMN password_hash TEXT');
  console.log('📌 Migration : colonne password_hash ajoutée');
} catch (e) { /* déjà existante */ }
try {
  db.exec('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
} catch (e) { /* ignore */ }
try {
  db.exec('CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)');
} catch (e) { /* ignore */ }

// ─── Fournisseur Blockchain multi-RPC avec fallback automatique ────
let currentRpcIndex = 0;
let provider = null;
let relayer = null;
let core = null;
let mine = null;

/** Crée un provider sur un RPC spécifique */
function createProvider(rpcUrl) {
  return new ethers.JsonRpcProvider(rpcUrl, CONTRACTS.CHAIN_ID, {
    staticNetwork: true,
    batchMaxCount: 3,
    cacheTimeout: 2000
  });
}

/** Teste si un RPC répond */
async function testRpc(rpcUrl) {
  try {
    const p = createProvider(rpcUrl);
    const code = await Promise.race([
      p.getCode(CONTRACTS.USDT),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000))
    ]);
    if (code === '0x' || !code) throw new Error('no code');
    return p;
  } catch (e) { return null; }
}

/** Initialise ou bascule vers le prochain RPC fonctionnel */
async function initProvider() {
  for (let i = 0; i < CONTRACTS.RPC_URLS.length; i++) {
    const idx = (currentRpcIndex + i) % CONTRACTS.RPC_URLS.length;
    const url = CONTRACTS.RPC_URLS[idx];
    const p = await testRpc(url);
    if (p) {
      currentRpcIndex = idx;
      provider = p;
      relayer = new ethers.Wallet(RELAYER_KEY, provider);
      core = new ethers.Contract(CONTRACTS.CORE, CORE_ABI, provider);
      mine = new ethers.Contract(CONTRACTS.MINE, MINE_ABI, provider);
      console.log(`🔗 RPC: ${url}`);
      return true;
    }
    console.warn(`  ⚠️ ${url.split('//')[1]?.slice(0, 35)}... : échec`);
  }
  console.error('❌ Aucun RPC Polygon disponible !');
  return false;
}

/** Appel contrat avec retry automatique (change de RPC si nécessaire) */
async function callWithRetry(fn, maxRetries = 3) {
  let lastError = null;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      if (!provider) await initProvider();
      if (!provider) throw new Error('Provider indisponible');
      return await fn();
    } catch (e) {
      lastError = e;
      const msg = e?.shortMessage || e?.message || '';
      const isRpcError = msg.includes('network') || msg.includes('timeout') ||
        msg.includes('rate limit') || msg.includes('429') || msg.includes('503') ||
        msg.includes('disconnected') || msg.includes('ETIMEDOUT');
      if (isRpcError && attempt < maxRetries - 1) {
        console.warn(`🔄 RPC bascule (essai ${attempt + 1}/${maxRetries})...`);
        await initProvider();
        await new Promise(r => setTimeout(r, 500 * (attempt + 1)));
      } else {
        throw lastError;
      }
    }
  }
  throw lastError;
}

// ─── ABIs ──────────────────────────────────────────────────────────
const CORE_ABI = [
  "function usdt() view returns (address)",
  "function fta() view returns (address)",
  "function depositUsdt(uint256 a)",
  "function depositFta(uint256 a)",
  "function depositPol() payable",
  "function withdrawUsdt(uint256 a)",
  "function withdrawFta(uint256 a)",
  "function withdrawPol(uint256 a)",
  "function setReferrer(address r)",
  "function setReferrerById(uint256 rid)",
  "function rate() view returns (uint256)",
  "function swapUForF(uint256 a, uint256 m, uint256 d)",
  "function swapFForU(uint256 a, uint256 m, uint256 d)",
  "function buyFta(uint256 a) view returns (uint256)",
  "function sellFta(uint256 a) view returns (uint256)",
  "function costFta(uint256 a) view returns (uint256)",
  "function swapFee() view returns (uint256)",
  "function difficulty() view returns (uint256)",
  "function uid(address) view returns (uint256)",
  "function uBal(address) view returns (uint256)",
  "function fBal(address) view returns (uint256)",
  "function pol(address) view returns (uint256)"
];

const MINE_ABI = [
  "function buyMachine(uint256 t)",
  "function buyMachineFTA(uint256 t)",
  "function buyBattery(uint256 t)",
  "function buyBatteryFTA(uint256 t)",
  "function plugInMachine(uint256 mi, uint256 bi)",
  "function claimRewards()",
  "function powerOf(address u) view returns (uint256)",
  "function mCount() view returns (uint256)",
  "function bCount() view returns (uint256)",
  "function getMType(uint256) view returns (uint256 price, uint256 power, uint256 shopExpiry)",
  "function getBType(uint256) view returns (uint256 price, uint256 dur)",
  "function myMachines(address u) view returns (tuple(uint256 tid, uint256 exp)[])",
  "function myBattery(address u, uint256 t) view returns (uint256)",
  "function myInfo(address u) view returns (uint256 mc, uint256 ap, uint256 lc)",
  "function core() view returns (address)"
];

const ERC20_ABI = [
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function transfer(address to, uint256 amount) returns (bool)"
];

// Configuration hachage mot de passe (PBKDF2 intégré à Node.js, pas de dépendance externe)
const PW_CONFIG = { iterations: 100000, keylen: 64, digest: 'sha512', saltBytes: 16 };

/** Hache un mot de passe avec PBKDF2 + sel aléatoire */
function hashPassword(password) {
  const salt = crypto.randomBytes(PW_CONFIG.saltBytes).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, PW_CONFIG.iterations, PW_CONFIG.keylen, PW_CONFIG.digest).toString('hex');
  return `${salt}:${hash}`;
}

/** Vérifie un mot de passe contre un hash stocké (format "salt:hash") */
function verifyPassword(password, storedHash) {
  if (!storedHash || !storedHash.includes(':')) return false;
  const [salt, hash] = storedHash.split(':');
  const computed = crypto.pbkdf2Sync(password, salt, PW_CONFIG.iterations, PW_CONFIG.keylen, PW_CONFIG.digest).toString('hex');
  return computed === hash;
}

/** Valide un email basique */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Récupère le wallet d'un utilisateur depuis la DB */
function getUserWallet(address) {
  const user = db.prepare('SELECT address, private_key FROM users WHERE address = ? AND is_active = 1').get(address);
  if (!user || !user.private_key) return null;
  return new ethers.Wallet(user.private_key, provider);
}

/** Enregistre une transaction en base */
function recordTx(userAddress, txHash, txType, token, amount, details, status = 'pending') {
  db.prepare(`
    INSERT INTO transactions (user_address, tx_hash, tx_type, token, amount, details, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(userAddress, txHash || null, txType, token || null, amount || null, details ? JSON.stringify(details) : null, status);
}

/** Met à jour le statut d'une transaction */
function updateTx(txId, status, txHash = null) {
  const updates = ['status = ?'];
  const params = [status];
  if (txHash) { updates.push('tx_hash = ?'); params.push(txHash); }
  params.push(txId);
  db.prepare(`UPDATE transactions SET ${updates.join(', ')} WHERE id = ?`).run(...params);
}

/** Vérifie le solde du relayer et log un avertissement si bas */
async function checkRelayerBalance() {
  try {
    if (!provider || !relayer) {
      console.warn('⚡ Relayer non initialisé');
      return null;
    }
    const bal = await provider.getBalance(relayer.address);
    const balPol = parseFloat(ethers.formatEther(bal));
    if (balPol < 1) {
      console.error(`⚠️ ALERTE RELAYER : solde = ${balPol.toFixed(4)} POL — RISQUE DE PANNE SÈCHE !`);
    } else if (balPol < 10) {
      console.warn(`⚡ Relayer : ${balPol.toFixed(2)} POL — pensez à recharger`);
    } else {
      console.log(`✅ Relayer : ${balPol.toFixed(2)} POL`);
    }
    return balPol;
  } catch (e) {
    console.error('❌ Impossible de vérifier le solde du relayer:', e.message);
    return null;
  }
}

/**
 * Finance un wallet utilisateur avec 0.1 POL (une seule fois par utilisateur).
 * - Vérifie gas_funded dans la DB (évite les doublons)
 * - Vérifie le solde on-chain (évite de financer un wallet déjà plein)
 * - Vérifie le solde du relayer avant d'envoyer
 * - Retourne { funded: true/false, alreadyFunded: true/false, amount, txHash? }
 */
async function fundUserGas(address) {
  // 1. Vérifie si déjà financé dans la DB
  const user = db.prepare('SELECT gas_funded FROM users WHERE address = ?').get(address);
  if (!user) return { funded: false, reason: 'user_not_found' };
  if (user.gas_funded === 1) {
    return { funded: false, alreadyFunded: true, reason: 'already_funded_in_db' };
  }

  // 2. Vérifie le solde on-chain du wallet utilisateur
  try {
    const balance = await provider.getBalance(address);
    if (balance > ethers.parseEther('0.02')) {
      // Le wallet a déjà du POL (peut-être envoyé manuellement), on marque comme financé
      db.prepare('UPDATE users SET gas_funded = 1 WHERE address = ?').run(address);
      return { funded: false, alreadyFunded: true, reason: 'already_has_pol', balance: ethers.formatEther(balance) };
    }
  } catch (e) {
    console.error(`Erreur vérification solde ${address}:`, e.message);
    return { funded: false, reason: 'balance_check_error' };
  }

  // 3. Vérifie le solde du relayer avant d'envoyer
  const relayerBal = await checkRelayerBalance();
  if (relayerBal !== null && relayerBal < 0.1) {
    console.error(`❌ Relayer à sec (${relayerBal} POL) — financement impossible pour ${address}`);
    return { funded: false, reason: 'relayer_empty' };
  }

  // 4. Envoi des 0.1 POL
  try {
    const tx = await relayer.sendTransaction({
      to: address,
      value: ethers.parseEther('0.1')
    });
    const receipt = await tx.wait();

    // Marque comme financé dans la DB
    db.prepare('UPDATE users SET gas_funded = 1 WHERE address = ?').run(address);

    // Enregistre la transaction
    recordTx(address, receipt.hash, 'gas_funded', 'POL', 0.1, null, 'confirmed');

    console.log(`✅ Gas financé : ${address.slice(0, 8)}... a reçu 0.1 POL (tx: ${receipt.hash.slice(0, 10)}...)`);
    return { funded: true, amount: 0.1, txHash: receipt.hash };
  } catch (e) {
    console.error(`❌ Échec financement ${address}:`, e?.shortMessage || e?.message);
    return { funded: false, reason: 'tx_failed', error: e?.shortMessage || e?.message };
  }
}

// ═══════════════════════════════════════════════════════════════════
//  APPLICATION EXPRESS
// ═══════════════════════════════════════════════════════════════════
const app = express();

// ─── Sécurité : CORS restreint à l'app uniquement ──────────────────
const ALLOWED_ORIGINS = [
  'https://fitia-dex-app-production.up.railway.app',
  'http://localhost:3001',
  'http://localhost:3000',
  'http://127.0.0.1:3001',
  'http://127.0.0.1:3000'
];
app.use(cors({
  origin: (origin, cb) => {
    // Autorise les requêtes sans origin (curl, Postman, apps mobiles)
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    console.warn(`CORS bloqué: ${origin}`);
    cb(new Error('Origine non autorisée'));
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// ─── Sécurité : headers HTTP ──────────────────────────────────────
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

app.use(express.json({ limit: '100kb' })); // Anti-payload bombing

// ─── Rate limiting simple (anti brute-force connexion) ────────────
const loginAttempts = new Map(); // Map<ip, { count, lastAttempt }>
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function checkLoginRateLimit(ip) {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry || now - entry.lastAttempt > LOGIN_WINDOW_MS) {
    loginAttempts.set(ip, { count: 1, lastAttempt: now });
    return true;
  }
  if (entry.count >= MAX_LOGIN_ATTEMPTS) {
    return false; // Bloqué
  }
  entry.count++;
  entry.lastAttempt = now;
  return true;
}

// Nettoyage périodique des entrées expirées
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of loginAttempts) {
    if (now - entry.lastAttempt > LOGIN_WINDOW_MS) loginAttempts.delete(ip);
  }
}, 5 * 60 * 1000);

/** Vérifie qu'une adresse existe dans la DB (protection endpoints sensibles) */
function userExists(address) {
  return !!db.prepare('SELECT id FROM users WHERE address = ? AND is_active = 1').get(address);
}

/** Sanitize un message d'erreur pour le client (pas de fuite d'internes) */
function safeError(e, fallback = 'Erreur interne') {
  const msg = e?.shortMessage || e?.message || '';
  // Filtre les messages sensibles
  if (msg.includes('insufficient funds')) return 'Solde insuffisant pour payer les frais de gas';
  if (msg.includes('call revert') || msg.includes('execution reverted')) return 'Transaction rejetée par le contrat';
  if (msg.includes('nonce')) return 'Erreur de séquence. Réessayez.';
  if (msg.includes('network') || msg.includes('timeout') || msg.includes('disconnected')) return 'Réseau Polygon momentanément indisponible';
  if (msg.includes('rate limit') || msg.includes('429')) return 'Trop de requêtes. Patientez quelques secondes.';
  // Tronque tout message inconnu
  return fallback;
}

// ═══ AUTHENTIFICATION ══════════════════════════════════════════════

/**
 * POST /api/auth/register
 * Inscription classique : pseudo + email + mot de passe
 * Le backend crée un wallet interne automatiquement (invisible pour l'utilisateur)
 * Body: { username, email, password }
 */
app.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Validation
  if (!username || !username.trim()) {
    return res.status(400).json({ error: 'Pseudo requis' });
  }
  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ error: 'Email invalide' });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Mot de passe : minimum 6 caractères' });
  }

  const pseudo = username.trim().toLowerCase();
  const emailLower = email.trim().toLowerCase();

  try {
    // Vérifie l'unicité du pseudo
    const existingUser = db.prepare('SELECT id FROM users WHERE username = ? AND is_active = 1').get(pseudo);
    if (existingUser) {
      return res.status(409).json({ error: 'Ce pseudo est déjà pris' });
    }

    // Vérifie l'unicité de l'email
    const existingEmail = db.prepare('SELECT id FROM users WHERE email = ? AND is_active = 1').get(emailLower);
    if (existingEmail) {
      return res.status(409).json({ error: 'Cet email est déjà utilisé' });
    }

    // Génère un wallet frais pour cet utilisateur (invisible)
    const wallet = ethers.Wallet.createRandom();
    const address = wallet.address;
    const privateKey = wallet.privateKey;

    // Hache le mot de passe
    const pwHash = hashPassword(password);

    const result = db.prepare(
      'INSERT INTO users (address, private_key, username, email, password_hash) VALUES (?, ?, ?, ?, ?)'
    ).run(address, privateKey, pseudo, emailLower, pwHash);

    // Enregistre la transaction de création
    recordTx(address, null, 'wallet_created', null, null, { username: pseudo });

    // Finance automatiquement le wallet avec 0.1 POL
    const fundResult = await fundUserGas(address);
    if (!fundResult.funded && !fundResult.alreadyFunded) {
      console.warn(`⚠️ Financement gas échoué pour ${address}: ${fundResult.reason}`);
    }

    res.status(201).json({
      success: true,
      user: {
        id: result.lastInsertRowid,
        username: pseudo,
        email: emailLower,
        address: address
      },
      gasFunded: fundResult.funded || fundResult.alreadyFunded
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Erreur création du compte' });
  }
});

/**
 * POST /api/auth/login
 * Connexion par pseudo OU email + mot de passe
 * Body: { identifier, password }
 */
app.post('/api/auth/login', async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !identifier.trim()) {
    return res.status(400).json({ error: 'Pseudo ou email requis' });
  }
  if (!password) {
    return res.status(400).json({ error: 'Mot de passe requis' });
  }

  const idLower = identifier.trim().toLowerCase();

  // Rate limiting : max 5 tentatives / 15 min par IP
  const clientIp = req.ip || req.connection?.remoteAddress || 'unknown';
  if (!checkLoginRateLimit(clientIp)) {
    return res.status(429).json({ error: 'Trop de tentatives. Réessayez dans 15 minutes.' });
  }

  try {
    // Cherche par email OU par pseudo
    let user = db.prepare(
      'SELECT id, address, username, email, password_hash, created_at, gas_funded FROM users WHERE (email = ? OR username = ?) AND is_active = 1'
    ).get(idLower, idLower);

    if (!user) {
      return res.status(401).json({ error: 'Identifiant ou mot de passe incorrect' });
    }

    // Vérifie le mot de passe
    if (!verifyPassword(password, user.password_hash)) {
      return res.status(401).json({ error: 'Identifiant ou mot de passe incorrect' });
    }

    // Met à jour last_login
    db.prepare('UPDATE users SET last_login = datetime(\'now\') WHERE id = ?').run(user.id);

    // Si pas encore financé, on essaie de financer
    let gasFunded = user.gas_funded === 1;
    if (!gasFunded) {
      const fundResult = await fundUserGas(user.address);
      gasFunded = fundResult.funded || fundResult.alreadyFunded;
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        address: user.address,
        gas_funded: gasFunded ? 1 : 0
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Erreur connexion' });
  }
});

/** GET /api/auth/me/:address — infos publiques uniquement (pas de clé privée) */
app.get('/api/auth/me/:address', (req, res) => {
  const addr = req.params.address;
  if (!/^0x[a-fA-F0-9]{40}$/.test(addr)) return res.status(400).json({ error: 'Format adresse invalide' });
  const user = db.prepare('SELECT id, username, created_at FROM users WHERE address = ?').get(addr);
  if (!user) return res.status(404).json({ error: 'Non trouvé' });
  res.json({ user });
});

// ═══ DONNÉES BLOCKCHAIN ═══════════════════════════════════════════

/** GET /api/blockchain/info/:address — toutes les infos utilisateur */
app.get('/api/blockchain/info/:address', async (req, res) => {
  const addr = req.params.address;
  console.log(`[INFO] Requête info pour ${addr.slice(0, 8)}...`);

  try {
    // Chaque appel contrat est isolé : si un échoue, les autres continuent
    const results = {};
    const errors = [];

    const safeCall = async (name, fn, fallback) => {
      try {
        results[name] = await fn();
      } catch (e) {
        errors.push(`${name}: ${e?.shortMessage || e?.message?.slice(0, 80)}`);
        results[name] = fallback;
      }
    };

    await Promise.all([
      safeCall('uBal', () => core.uBal(addr), 0n),
      safeCall('fBal', () => core.fBal(addr), 0n),
      safeCall('polBal', () => core.pol(addr), 0n),
      safeCall('polNative', () => provider.getBalance(addr), 0n),
      safeCall('rate', () => core.rate(), 0n),
      safeCall('difficulty', () => core.difficulty(), 0n),
      safeCall('power', () => mine.powerOf(addr), 0n),
      safeCall('myMachines', () => mine.myMachines(addr), []),
      safeCall('bCount', () => mine.bCount(), 0n),
      safeCall('mCount', () => mine.mCount(), 0n),
    ]);

    if (errors.length > 0) {
      console.error(`[INFO] ${errors.length} erreur(s) contrat pour ${addr.slice(0, 8)}... :`, errors.join(' | '));
    }

    // Batteries par type
    const batteries = {};
    const bCountNum = Number(results.bCount);
    for (let i = 0; i < bCountNum; i++) {
      try {
        const qty = await mine.myBattery(addr, i);
        if (qty > 0n) batteries[i] = Number(qty);
      } catch (e) {}
    }

    // Types de machines & batteries
    const mTypes = [];
    const mCountNum = Number(results.mCount);
    for (let i = 0; i < mCountNum; i++) {
      try {
        const m = await mine.getMType(i);
        mTypes.push({ price: m.price.toString(), power: Number(m.power), shopExpiry: Number(m.shopExpiry) });
      } catch (e) {}
    }
    const bTypes = [];
    for (let i = 0; i < bCountNum; i++) {
      try {
        const b = await mine.getBType(i);
        bTypes.push({ price: b.price.toString(), dur: Number(b.dur) });
      } catch (e) {}
    }

    // Machines de l'utilisateur
    const machines = [];
    const rawMachines = results.myMachines;
    if (rawMachines && typeof rawMachines[Symbol.iterator] === 'function') {
      for (const m of rawMachines) {
        machines.push({ tid: Number(m.tid), exp: Number(m.exp) });
      }
    }

    // Conversion sécurisée BigInt → string
    const toStr = (v) => (typeof v === 'bigint' ? v : BigInt(v || 0)).toString();

    res.json({
      balances: {
        usdt: toStr(results.uBal),
        fta: toStr(results.fBal),
        pol: (BigInt(toStr(results.polBal)) + BigInt(toStr(results.polNative))).toString(),
        polNative: toStr(results.polNative)
      },
      rate: toStr(results.rate),
      difficulty: toStr(results.difficulty),
      power: toStr(results.power),
      machines,
      batteries,
      mTypes,
      bTypes
    });
    console.log(`[INFO] OK pour ${addr.slice(0, 8)}... (machines:${machines.length}, shop:${mTypes.length}M/${bTypes.length}B)`);
  } catch (e) {
    console.error('[INFO] Erreur globale:', e?.shortMessage || e?.message);
    res.status(500).json({ error: safeError(e) });
  }
});

/** GET /api/blockchain/rate — taux actuel FTA/USDT */
app.get('/api/blockchain/rate', async (req, res) => {
  try {
    const rate = await callWithRetry(() => core.rate());
    console.log(`[RATE] ${ethers.formatUnits(rate, 6)} USDT/FTA`);
    res.json({ rate: rate.toString() });
  } catch (e) {
    console.error('[RATE] Erreur:', e?.shortMessage || e?.message);
    res.status(500).json({ error: safeError(e) });
  }
});

/** GET /api/blockchain/shop — liste complète boutique */
app.get('/api/blockchain/shop', async (req, res) => {
  try {
    const [mCount, bCount] = await callWithRetry(() => Promise.all([mine.mCount(), mine.bCount()]));
    console.log(`[SHOP] ${mCount} machines, ${bCount} batteries`);
    const mTypes = [], bTypes = [];
    for (let i = 0; i < Number(mCount); i++) {
      try { const m = await callWithRetry(() => mine.getMType(i)); mTypes.push({ price: m.price.toString(), power: Number(m.power), shopExpiry: Number(m.shopExpiry) }); } catch (e) { console.error(`[SHOP] getMType(${i}) erreur:`, e?.shortMessage); }
    }
    for (let i = 0; i < Number(bCount); i++) {
      try { const b = await callWithRetry(() => mine.getBType(i)); bTypes.push({ price: b.price.toString(), dur: Number(b.dur) }); } catch (e) { console.error(`[SHOP] getBType(${i}) erreur:`, e?.shortMessage); }
    }
    res.json({ mTypes, bTypes });
  } catch (e) {
    console.error('[SHOP] Erreur:', e?.shortMessage || e?.message);
    res.status(500).json({ error: safeError(e) });
  }
});

// ═══ ACTIONS BLOCKCHAIN (signées par le wallet interne) ════════════

/** POST /api/blockchain/deposit — Dépôt USDT ou FTA (depuis wallet externe vers le Core) */
app.post('/api/blockchain/deposit', async (req, res) => {
  const { address, token, amount } = req.body;
  if (!address || !token || !amount) return res.status(400).json({ error: 'Paramètres requis: address, token, amount' });
  try {
    const wallet = getUserWallet(address);
    if (!wallet) return res.status(404).json({ error: 'Wallet non trouvé' });

    if (token === 'USDT') {
      const usdtContract = new ethers.Contract(CONTRACTS.USDT, ERC20_ABI, wallet);
      const tokenDec = 6;
      const amountBN = ethers.parseUnits(amount.toString(), tokenDec);
      const walletBal = await usdtContract.balanceOf(address);
      if (walletBal < amountBN) return res.status(400).json({ error: 'Solde USDT insuffisant dans votre wallet' });
      const allowance = await usdtContract.allowance(address, CONTRACTS.CORE);
      if (allowance < amountBN) {
        const approveTx = await usdtContract.approve(CONTRACTS.CORE, amountBN);
        await approveTx.wait();
      }
      const tx = await core.connect(wallet).depositUsdt(amountBN);
      const receipt = await tx.wait();
      recordTx(address, receipt.hash, 'deposit', 'USDT', Number(amount), null, 'confirmed');
      return res.json({ success: true, txHash: receipt.hash });
    } else {
      const ftaContract = new ethers.Contract(CONTRACTS.FTA, ERC20_ABI, wallet);
      const tokenDec = 8;
      const amountBN = ethers.parseUnits(amount.toString(), tokenDec);
      const walletBal = await ftaContract.balanceOf(address);
      if (walletBal < amountBN) return res.status(400).json({ error: 'Solde FTA insuffisant dans votre wallet' });
      const allowance = await ftaContract.allowance(address, CONTRACTS.CORE);
      if (allowance < amountBN) {
        const approveTx = await ftaContract.approve(CONTRACTS.CORE, amountBN);
        await approveTx.wait();
      }
      const tx = await core.connect(wallet).depositFta(amountBN);
      const receipt = await tx.wait();
      recordTx(address, receipt.hash, 'deposit', 'FTA', Number(amount), null, 'confirmed');
      return res.json({ success: true, txHash: receipt.hash });
    }
  } catch (e) {
    console.error('Deposit error:', e);
    res.status(500).json({ error: safeError(e) });
  }
});

/** POST /api/blockchain/withdraw — Retrait */
app.post('/api/blockchain/withdraw', async (req, res) => {
  const { address, token, amount } = req.body;
  if (!address || !token || !amount) return res.status(400).json({ error: 'Paramètres requis' });
  try {
    const wallet = getUserWallet(address);
    if (!wallet) return res.status(404).json({ error: 'Wallet non trouvé' });
    let tx;
    if (token === 'USDT') {
      tx = await core.connect(wallet).withdrawUsdt(ethers.parseUnits(amount.toString(), 6));
    } else {
      tx = await core.connect(wallet).withdrawFta(ethers.parseUnits(amount.toString(), 8));
    }
    const receipt = await tx.wait();
    recordTx(address, receipt.hash, 'withdraw', token, Number(amount), null, 'confirmed');
    res.json({ success: true, txHash: receipt.hash });
  } catch (e) {
    res.status(500).json({ error: safeError(e) });
  }
});

/** POST /api/blockchain/buy-machine */
app.post('/api/blockchain/buy-machine', async (req, res) => {
  const { address, typeId, payMode } = req.body;
  if (!address || typeId === undefined) return res.status(400).json({ error: 'Paramètres requis' });
  try {
    const wallet = getUserWallet(address);
    if (!wallet) return res.status(404).json({ error: 'Wallet non trouvé' });
    let tx;
    if (payMode === 'FTA') {
      tx = await mine.connect(wallet).buyMachineFTA(typeId);
    } else {
      tx = await mine.connect(wallet).buyMachine(typeId);
    }
    const receipt = await tx.wait();
    recordTx(address, receipt.hash, 'buy_machine', payMode || 'USDT', null, { machineType: typeId }, 'confirmed');
    res.json({ success: true, txHash: receipt.hash });
  } catch (e) {
    res.status(500).json({ error: safeError(e) });
  }
});

/** POST /api/blockchain/buy-battery */
app.post('/api/blockchain/buy-battery', async (req, res) => {
  const { address, typeId, payMode } = req.body;
  if (!address || typeId === undefined) return res.status(400).json({ error: 'Paramètres requis' });
  try {
    const wallet = getUserWallet(address);
    if (!wallet) return res.status(404).json({ error: 'Wallet non trouvé' });
    let tx;
    if (payMode === 'FTA') {
      tx = await mine.connect(wallet).buyBatteryFTA(typeId);
    } else {
      tx = await mine.connect(wallet).buyBattery(typeId);
    }
    const receipt = await tx.wait();
    recordTx(address, receipt.hash, 'buy_battery', payMode || 'USDT', null, { batteryType: typeId }, 'confirmed');
    res.json({ success: true, txHash: receipt.hash });
  } catch (e) {
    res.status(500).json({ error: safeError(e) });
  }
});

/** POST /api/blockchain/plug */
app.post('/api/blockchain/plug', async (req, res) => {
  const { address, machineIndex, batteryTypeId } = req.body;
  if (!address || machineIndex === undefined || batteryTypeId === undefined) return res.status(400).json({ error: 'Paramètres requis' });
  try {
    const wallet = getUserWallet(address);
    if (!wallet) return res.status(404).json({ error: 'Wallet non trouvé' });
    const tx = await mine.connect(wallet).plugInMachine(machineIndex, batteryTypeId);
    const receipt = await tx.wait();
    recordTx(address, receipt.hash, 'plug', null, null, { machineIndex, batteryTypeId }, 'confirmed');
    res.json({ success: true, txHash: receipt.hash });
  } catch (e) {
    res.status(500).json({ error: safeError(e) });
  }
});

/** POST /api/blockchain/claim */
app.post('/api/blockchain/claim', async (req, res) => {
  const { address } = req.body;
  if (!address) return res.status(400).json({ error: 'Adresse requise' });
  try {
    const wallet = getUserWallet(address);
    if (!wallet) return res.status(404).json({ error: 'Wallet non trouvé' });
    const tx = await mine.connect(wallet).claimRewards();
    const receipt = await tx.wait();
    recordTx(address, receipt.hash, 'claim', 'FTA', null, null, 'confirmed');
    res.json({ success: true, txHash: receipt.hash });
  } catch (e) {
    res.status(500).json({ error: safeError(e) });
  }
});

/** POST /api/blockchain/swap */
app.post('/api/blockchain/swap', async (req, res) => {
  const { address, amount, direction } = req.body;
  if (!address || !amount) return res.status(400).json({ error: 'Paramètres requis' });
  try {
    const wallet = getUserWallet(address);
    if (!wallet) return res.status(404).json({ error: 'Wallet non trouvé' });

    const isUsdtTo = direction === 'USDT_TO_FTA';
    const decimals = isUsdtTo ? 6 : 8;
    const amountBN = ethers.parseUnits(amount.toString(), decimals);
    const deadline = Math.floor(Date.now() / 1000) + 1200;
    const minOut = 0n;

    let tx;
    if (isUsdtTo) {
      tx = await core.connect(wallet).swapUForF(amountBN, minOut, deadline);
    } else {
      tx = await core.connect(wallet).swapFForU(amountBN, minOut, deadline);
    }
    const receipt = await tx.wait();
    recordTx(address, receipt.hash, 'swap', isUsdtTo ? 'USDT' : 'FTA', Number(amount), { direction }, 'confirmed');
    res.json({ success: true, txHash: receipt.hash });
  } catch (e) {
    res.status(500).json({ error: safeError(e) });
  }
});

/** POST /api/blockchain/set-referrer */
app.post('/api/blockchain/set-referrer', async (req, res) => {
  const { address, referrer } = req.body;
  if (!address || !referrer) return res.status(400).json({ error: 'Paramètres requis' });
  try {
    const wallet = getUserWallet(address);
    if (!wallet) return res.status(404).json({ error: 'Wallet non trouvé' });
    let tx;
    if (referrer.startsWith('0x') && referrer.length === 42) {
      tx = await core.connect(wallet).setReferrer(referrer);
    } else {
      tx = await core.connect(wallet).setReferrerById(Number(referrer));
    }
    const receipt = await tx.wait();
    recordTx(address, receipt.hash, 'referral', null, null, { referrer }, 'confirmed');
    res.json({ success: true, txHash: receipt.hash });
  } catch (e) {
    res.status(500).json({ error: safeError(e) });
  }
});

// ═══ FINANCEMENT (le relayer envoie du POL aux utilisateurs pour le gas) ═══

// ═══ ENVOI DE FONDS (wallet interne → destinataire externe) ═════

/** POST /api/blockchain/send-pol — envoie du POL depuis le wallet interne vers une adresse externe */
app.post('/api/blockchain/send-pol', async (req, res) => {
  const { address, to, amount } = req.body;
  if (!address || !to || !amount) return res.status(400).json({ error: 'Paramètres requis: address, to, amount' });
  if (amount <= 0) return res.status(400).json({ error: 'Montant invalide' });
  try {
    const wallet = getUserWallet(address);
    if (!wallet) return res.status(404).json({ error: 'Wallet non trouvé' });

    // Vérifier le solde du wallet utilisateur
    const balance = await provider.getBalance(address);
    const amountWei = ethers.parseEther(amount.toString());
    // Garder ~0.01 POL pour le gas des prochaines transactions
    const reserve = ethers.parseEther('0.01');
    if (balance < amountWei + reserve) {
      const maxSend = parseFloat(ethers.formatEther(balance - reserve));
      return res.status(400).json({ error: `Solde POL insuffisant. Maximum envoyable : ${maxSend.toFixed(4)} POL (réserve gas: 0.01 POL)` });
    }

    const tx = await wallet.sendTransaction({ to, value: amountWei });
    const receipt = await tx.wait();
    recordTx(address, receipt.hash, 'send', 'POL', amount, { to }, 'confirmed');
    res.json({ success: true, txHash: receipt.hash });
  } catch (e) {
    res.status(500).json({ error: safeError(e) });
  }
});

/** POST /api/blockchain/send-token — envoie des tokens (USDT/FTA) depuis le wallet interne */
app.post('/api/blockchain/send-token', async (req, res) => {
  const { address, to, token, amount } = req.body;
  if (!address || !to || !token || !amount) return res.status(400).json({ error: 'Paramètres requis' });
  if (amount <= 0) return res.status(400).json({ error: 'Montant invalide' });
  try {
    const wallet = getUserWallet(address);
    if (!wallet) return res.status(404).json({ error: 'Wallet non trouvé' });

    const tokenAddr = token === 'USDT' ? CONTRACTS.USDT : CONTRACTS.FTA;
    const decimals = token === 'USDT' ? 6 : 8;
    const tokenContract = new ethers.Contract(tokenAddr, ERC20_ABI, wallet);
    const amountBN = ethers.parseUnits(amount.toString(), decimals);

    // Vérifier le solde du wallet
    const balance = await tokenContract.balanceOf(address);
    if (balance < amountBN) {
      const balFormatted = parseFloat(ethers.formatUnits(balance, decimals));
      return res.status(400).json({ error: `Solde ${token} insuffisant. Disponible : ${balFormatted.toFixed(4)} ${token}` });
    }

    const tx = await tokenContract.transfer(to, amountBN);
    const receipt = await tx.wait();
    recordTx(address, receipt.hash, 'send', token, amount, { to }, 'confirmed');
    res.json({ success: true, txHash: receipt.hash });
  } catch (e) {
    res.status(500).json({ error: safeError(e, 'Erreur envoi token') });
  }
});

// ═══ FINANCEMENT (le relayer envoie du POL aux utilisateurs pour le gas) ═══

/** POST /api/blockchain/fund-gas — le relayer envoie 0.1 POL au wallet de l'utilisateur (une seule fois, appel automatique ou manuel) */
app.post('/api/blockchain/fund-gas', async (req, res) => {
  const { address } = req.body;
  if (!address) return res.status(400).json({ error: 'Adresse requise' });
  try {
    const result = await fundUserGas(address);
    if (result.funded) {
      return res.json({ success: true, txHash: result.txHash, amount: result.amount });
    } else if (result.alreadyFunded) {
      return res.json({ success: true, alreadyFunded: true, reason: result.reason });
    } else {
      return res.status(400).json({ error: 'Financement impossible', reason: result.reason });
    }
  } catch (e) {
    res.status(500).json({ error: safeError(e) });
  }
});

/** GET /api/status — état du relayer et stats globales */
app.get('/api/status', async (req, res) => {
  try {
    const relayerBal = await checkRelayerBalance();
    const userCount = db.prepare('SELECT COUNT(*) as count FROM users WHERE is_active = 1').get().count;
    const fundedCount = db.prepare('SELECT COUNT(*) as count FROM users WHERE gas_funded = 1 AND is_active = 1').get().count;
    const txCount = db.prepare('SELECT COUNT(*) as count FROM transactions').get().count;
    res.json({
      relayer: {
        address: relayer.address,
        balance: relayerBal !== null ? relayerBal.toFixed(4) + ' POL' : 'indisponible',
        status: relayerBal === null ? 'unknown' : relayerBal < 0.1 ? 'critical' : relayerBal < 1 ? 'low' : relayerBal < 10 ? 'warning' : 'ok'
      },
      stats: { users: userCount, funded: fundedCount, transactions: txCount },
      uptime: process.uptime()
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/** GET /api/diag — diagnostic des connexions contrat */
app.get('/api/diag', async (req, res) => {
  const results = {};
  const test = async (name, fn) => {
    try { const v = await fn(); results[name] = { ok: true, value: v.toString() }; }
    catch (e) { results[name] = { ok: false, error: e?.shortMessage || e?.message?.slice(0, 120) }; }
  };

  await Promise.all([
    test('rpc_chainId', () => provider.getNetwork().then(n => n.chainId)),
    test('rpc_blockNumber', () => provider.getBlockNumber()),
    test('core_exists', () => provider.getCode(CONTRACTS.CORE)),
    test('mine_exists', () => provider.getCode(CONTRACTS.MINE)),
    test('core_rate', () => core.rate()),
    test('core_difficulty', () => core.difficulty()),
    test('mine_mCount', () => mine.mCount()),
    test('mine_bCount', () => mine.bCount()),
    test('relayer_balance', () => provider.getBalance(relayer.address)),
  ]);

  // Vérifie aussi si le Mine pointe vers le bon Core
  try {
    const mineCore = await mine.core();
    results.mine_core_link = {
      ok: mineCore.toLowerCase() === CONTRACTS.CORE.toLowerCase(),
      mineCore: mineCore,
      configured: CONTRACTS.CORE
    };
  } catch (e) {
    results.mine_core_link = { ok: false, error: e?.shortMessage };
  }

  res.json({
    contracts: {
      CORE: CONTRACTS.CORE,
      MINE: CONTRACTS.MINE,
      USDT: CONTRACTS.USDT,
      FTA: CONTRACTS.FTA,
      RPC: CONTRACTS.RPC_URLS[currentRpcIndex] || 'none'
    },
    tests: results
  });
});

// ═══ HISTORIQUE ════════════════════════════════════════════════════

app.get('/api/transactions/:address', (req, res) => {
  const { address } = req.params;
  // Validation : l'adresse doit exister dans la DB
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) return res.status(400).json({ error: 'Format adresse invalide' });
  if (!userExists(address)) return res.status(404).json({ error: 'Utilisateur non trouvé' });

  const limit = Math.min(Math.max(parseInt(req.query.limit) || 50, 1), 100);
  const offset = Math.max(parseInt(req.query.offset) || 0, 0);
  const { type, status } = req.query;
  let query = 'SELECT * FROM transactions WHERE user_address = ?';
  let countQuery = 'SELECT COUNT(*) as total FROM transactions WHERE user_address = ?';
  const params = [address], countParams = [address];

  if (type) { query += ' AND tx_type = ?'; countQuery += ' AND tx_type = ?'; params.push(type); countParams.push(type); }
  if (status) { query += ' AND status = ?'; countQuery += ' AND status = ?'; params.push(status); countParams.push(status); }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const transactions = db.prepare(query).all(...params).map(tx => ({
    ...tx,
    details: tx.details ? JSON.parse(tx.details) : null
  }));
  const { total } = db.prepare(countQuery).get(...countParams);

  res.json({ transactions, total, limit, offset });
});

// ═══ DÉMARRAGE ════════════════════════════════════════════════════

// Health check — fonctionne même sans blockchain
app.get('/health', (req, res) => {
  res.json({ status: 'ok', provider: !!provider, time: Date.now() });
});

app.listen(PORT, async () => {
  console.log(`🚀 Fitia Mining lancé sur le port ${PORT}`);
  console.log(`📁 DB: ${DB_PATH}`);

  try {
    const connected = await initProvider();
    if (connected) {
      console.log(`👛 Relayer: ${relayer?.address || 'non configuré'}`);
      await checkRelayerBalance();
    } else {
      console.error('❌ Aucune connexion blockchain. Le serveur fonctionne mais sans blockchain.');
    }
  } catch (e) {
    console.error('❌ Erreur init provider:', e.message);
  }
});
