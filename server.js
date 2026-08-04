// ═══════════════════════════════════════════════════════════════════
//  Fitia Pro Miner — Backend API
//  Authentification + Historique transactions
//  Base de données SQLite portable
// ═══════════════════════════════════════════════════════════════════

const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

// ─── Configuration ─────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
const DB_PATH = path.join(__dirname, 'fitia_mining.db');

// ─── Initialisation de la base de données SQLite ──────────────────
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');          // Meilleure performance
db.pragma('foreign_keys = ON');           // Intégrité référentielle

// ─── Création des tables ──────────────────────────────────────────
db.exec(`
  -- Table des utilisateurs (liés à leur adresse Polygon)
  CREATE TABLE IF NOT EXISTS users (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    address      TEXT    NOT NULL UNIQUE,  -- Adresse publique Polygon (0x...)
    username     TEXT,                     -- Pseudo optionnel
    created_at   TEXT    NOT NULL DEFAULT (datetime('now')),
    last_login   TEXT    NOT NULL DEFAULT (datetime('now')),
    is_active    INTEGER NOT NULL DEFAULT 1
  );

  -- Historique des transactions (achats, dépôts, retraits, claims, swaps)
  CREATE TABLE IF NOT EXISTS transactions (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    user_address TEXT    NOT NULL,          -- Adresse Polygon de l'utilisateur
    tx_hash      TEXT,                      -- Hash de la transaction blockchain
    tx_type      TEXT    NOT NULL,          -- 'buy_machine', 'buy_battery', 'deposit', 'withdraw', 'claim', 'swap', 'plug', 'referral', 'send', 'receive'
    token        TEXT,                      -- 'USDT', 'FTA', 'POL'
    amount       REAL,                      -- Montant (en unités humaines)
    amount_fee   REAL    DEFAULT 0,        -- Frais éventuels
    details      TEXT,                      -- Détails supplémentaires (JSON stringifié)
    status       TEXT    NOT NULL DEFAULT 'pending', -- 'pending', 'confirmed', 'failed'
    created_at   TEXT    NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_address) REFERENCES users(address)
  );

  -- Index pour les recherches rapides
  CREATE INDEX IF NOT EXISTS idx_tx_user ON transactions(user_address);
  CREATE INDEX IF NOT EXISTS idx_tx_type ON transactions(tx_type);
  CREATE INDEX IF NOT EXISTS idx_tx_date ON transactions(created_at);
  CREATE INDEX IF NOT EXISTS idx_users_address ON users(address);
`);

// ─── Application Express ──────────────────────────────────────────
const app = express();
app.use(cors());
app.use(express.json());

// ═══════════════════════════════════════════════════════════════════
//  ROUTES AUTHENTIFICATION
// ═══════════════════════════════════════════════════════════════════

/**
 * POST /api/auth/register
 * Inscription d'un nouvel utilisateur
 * Body: { address, username? }
 */
app.post('/api/auth/register', (req, res) => {
  const { address, username } = req.body;

  // Validation
  if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return res.status(400).json({ error: 'Adresse Polygon invalide' });
  }

  try {
    // Vérifier si l'utilisateur existe déjà
    const existing = db.prepare('SELECT id, username FROM users WHERE address = ?').get(address);
    if (existing) {
      // Mise à jour du last_login et renvoi
      db.prepare('UPDATE users SET last_login = datetime(\'now\') WHERE address = ?').run(address);
      return res.json({ success: true, user: { id: existing.id, address, username: existing.username }, isNew: false });
    }

    // Création du nouvel utilisateur
    const result = db.prepare(
      'INSERT INTO users (address, username) VALUES (?, ?)'
    ).run(address, username || null);

    res.status(201).json({
      success: true,
      user: { id: result.lastInsertRowid, address, username: username || null },
      isNew: true
    });
  } catch (err) {
    console.error('Erreur register:', err);
    res.status(500).json({ error: 'Erreur serveur lors de l\'inscription' });
  }
});

/**
 * POST /api/auth/login
 * Connexion d'un utilisateur existant
 * Body: { address }
 */
app.post('/api/auth/login', (req, res) => {
  const { address } = req.body;

  if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return res.status(400).json({ error: 'Adresse Polygon invalide' });
  }

  const user = db.prepare('SELECT id, address, username, created_at FROM users WHERE address = ? AND is_active = 1').get(address);

  if (!user) {
    return res.status(404).json({ error: 'Utilisateur non trouvé. Veuillez vous inscrire.' });
  }

  // Mise à jour du last_login
  db.prepare('UPDATE users SET last_login = datetime(\'now\') WHERE address = ?').run(address);

  res.json({ success: true, user });
});

/**
 * GET /api/auth/me/:address
 * Infos de l'utilisateur connecté
 */
app.get('/api/auth/me/:address', (req, res) => {
  const { address } = req.params;
  const user = db.prepare('SELECT id, address, username, created_at, last_login FROM users WHERE address = ?').get(address);
  if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
  res.json({ user });
});

// ═══════════════════════════════════════════════════════════════════
//  ROUTES TRANSACTIONS
// ═══════════════════════════════════════════════════════════════════

/**
 * POST /api/transactions
 * Enregistrer une nouvelle transaction
 * Body: { user_address, tx_hash?, tx_type, token?, amount?, amount_fee?, details?, status? }
 */
app.post('/api/transactions', (req, res) => {
  const { user_address, tx_hash, tx_type, token, amount, amount_fee, details, status } = req.body;

  // Validation
  if (!user_address || !/^0x[a-fA-F0-9]{40}$/.test(user_address)) {
    return res.status(400).json({ error: 'Adresse utilisateur invalide' });
  }
  if (!tx_type) {
    return res.status(400).json({ error: 'Type de transaction requis' });
  }

  const validTypes = ['buy_machine', 'buy_battery', 'deposit', 'withdraw', 'claim', 'swap', 'plug', 'referral', 'send', 'receive'];
  if (!validTypes.includes(tx_type)) {
    return res.status(400).json({ error: 'Type de transaction invalide. Types valides: ' + validTypes.join(', ') });
  }

  try {
    // Vérifier que l'utilisateur existe, sinon le créer automatiquement
    const user = db.prepare('SELECT address FROM users WHERE address = ?').get(user_address);
    if (!user) {
      db.prepare('INSERT INTO users (address) VALUES (?)').run(user_address);
    }

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
    console.error('Erreur enregistrement transaction:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * PATCH /api/transactions/:id
 * Mettre à jour le statut d'une transaction (pending → confirmed/failed)
 */
app.patch('/api/transactions/:id', (req, res) => {
  const { id } = req.params;
  const { tx_hash, status, amount_fee } = req.body;

  const tx = db.prepare('SELECT id FROM transactions WHERE id = ?').get(id);
  if (!tx) return res.status(404).json({ error: 'Transaction non trouvée' });

  const updates = [];
  const params = [];

  if (tx_hash) { updates.push('tx_hash = ?'); params.push(tx_hash); }
  if (status) { updates.push('status = ?'); params.push(status); }
  if (amount_fee !== undefined) { updates.push('amount_fee = ?'); params.push(amount_fee); }

  if (updates.length === 0) return res.status(400).json({ error: 'Aucune donnée à mettre à jour' });

  params.push(id);
  db.prepare(`UPDATE transactions SET ${updates.join(', ')} WHERE id = ?`).run(...params);

  res.json({ success: true });
});

/**
 * GET /api/transactions/:address
 * Récupérer l'historique des transactions d'un utilisateur
 * Query params: limit, offset, type, token, status
 */
app.get('/api/transactions/:address', (req, res) => {
  const { address } = req.params;
  const { limit = 50, offset = 0, type, token, status } = req.query;

  let query = 'SELECT * FROM transactions WHERE user_address = ?';
  const params = [address];

  if (type) { query += ' AND tx_type = ?'; params.push(type); }
  if (token) { query += ' AND token = ?'; params.push(token); }
  if (status) { query += ' AND status = ?'; params.push(status); }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(Number(limit), Number(offset));

  const transactions = db.prepare(query).all(...params);

  // Compter le total pour la pagination
  let countQuery = 'SELECT COUNT(*) as total FROM transactions WHERE user_address = ?';
  const countParams = [address];
  if (type) { countQuery += ' AND tx_type = ?'; countParams.push(type); }
  if (token) { countQuery += ' AND token = ?'; countParams.push(token); }
  if (status) { countQuery += ' AND status = ?'; countParams.push(status); }

  const { total } = db.prepare(countQuery).get(...countParams);

  // Parser les détails JSON
  const parsed = transactions.map(tx => ({
    ...tx,
    details: tx.details ? JSON.parse(tx.details) : null
  }));

  res.json({ transactions: parsed, total, limit: Number(limit), offset: Number(offset) });
});

/**
 * GET /api/transactions/:address/stats
 * Statistiques des transactions d'un utilisateur
 */
app.get('/api/transactions/:address/stats', (req, res) => {
  const { address } = req.params;

  // Total par type
  const byType = db.prepare(`
    SELECT tx_type, COUNT(*) as count, COALESCE(SUM(amount), 0) as total_amount
    FROM transactions WHERE user_address = ? AND status = 'confirmed'
    GROUP BY tx_type
  `).all(address);

  // Dernière transaction
  const lastTx = db.prepare(
    'SELECT * FROM transactions WHERE user_address = ? ORDER BY created_at DESC LIMIT 1'
  ).get(address);

  // Nombre total
  const { total } = db.prepare(
    'SELECT COUNT(*) as total FROM transactions WHERE user_address = ?'
  ).get(address);

  res.json({ byType, lastTx, total });
});

// ═══════════════════════════════════════════════════════════════════
//  DÉMARRAGE DU SERVEUR
// ═══════════════════════════════════════════════════════════════════
app.listen(PORT, () => {
  console.log(`🚀 Fitia Mining Backend lancé sur http://localhost:${PORT}`);
  console.log(`📁 Base de données: ${DB_PATH}`);
  console.log(`✅ Tables: users, transactions`);
});
