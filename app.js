/* ═══════════════════════════════════════════════════════════════════
   FITIA MINING V3 - Application 100% locale (3 fichiers)
   index.html + style.css + app.js
   • Base de données SQLite embarquée (sql.js - WebAssembly)
   • Inscription / connexion des utilisateurs (mots de passe hachés PBKDF2)
   • Compte lié à l'adresse Polygon (signature EIP-191 vérifiée)
   • Interactions avec FitiaMiningV3_Core / FitiaMiningV3_Mine (MetaMask)
   • Historique des transactions dans la base SQLite
   • Export / import du fichier .db (portable, ouvrable dans VS Code)
   ═══════════════════════════════════════════════════════════════════ */
'use strict';

/* ═══════════════════════════════════════════════════════════════════
   CONFIGURATION - À MODIFIER ICI
   Remplacez les adresses 0x000...0 par celles de VOS contrats
   déployés sur Polygon. Sans elles, l'application fonctionne
   (comptes, base de données, historique) mais les actions
   blockchain sont désactivées.
   ═══════════════════════════════════════════════════════════════════ */
const CFG = {
  contracts: {
    core: '0x1b8EdFb91168Fb233F8CA7cf1631038AC193D743', // FitiaMiningV3_Core
    mine: '0xBd9FA9801eDA247b28B3BB9dDBf1CF52cA563Bc6', // FitiaMiningV3_Mine
    usdt: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', // Token USDT
    fta:  '0x5c418b12c7e9c2A8e9A71A68c6d9b319E7B1d1fd'  // Token FTA
  },
  decimals: { usdt: 6, fta: 6 },   // décimales des tokens
  polygon: {
    chainId: '0x89',               // 137
    chainName: 'Polygon Mainnet',
    nativeCurrency: { name: 'POL', symbol: 'POL', decimals: 18 },
    rpc: ['https://polygon-rpc.com', 'https://rpc-mainnet.maticvigil.com', 'https://1rpc.io/matic'],
    explorer: 'https://polygonscan.com'
  }
};

const ZERO_ADDR = '0x0000000000000000000000000000000000000000';

/* ─── Icônes SVG (trait 1.8px, couleur courante) - remplacement des emojis ─── */
const svg = (p) => `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;

const ICONS = {
  grid: svg('<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>'),
  bag: svg('<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>'),
  pick: svg('<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>'),
  repeat: svg('<polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>'),
  clock: svg('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>'),
  wallet: svg('<path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4z"/>'),
  coin: svg('<path d="M12 2l8.66 5v10L12 22l-8.66-5V7z"/>'),
  fuel: svg('<line x1="3" y1="22" x2="15" y2="22"/><line x1="4" y1="9" x2="14" y2="9"/><path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18"/><path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5"/>'),
  bolt: svg('<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>'),
  cpu: svg('<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/>'),
  gift: svg('<polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>'),
  hash: svg('<line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/>'),
  battery: svg('<rect x="1" y="6" width="18" height="12" rx="2"/><line x1="23" y1="13" x2="23" y2="11"/>'),
  plug: svg('<path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8z"/>'),
  arrowDown: svg('<line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>'),
  deposit: svg('<line x1="17" y1="7" x2="7" y2="17"/><polyline points="17 17 7 17 7 7"/>'),
  withdraw: svg('<line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>'),
  users: svg('<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>'),
  check: svg('<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>'),
  alert: svg('<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'),
  info: svg('<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>'),
  warn: svg('<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>'),
  logout: svg('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>'),
  x: svg('<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'),
  refresh: svg('<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>'),
  download: svg('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>'),
  upload: svg('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>'),
  package: svg('<line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>'),
  file: svg('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>'),
  shield: svg('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>'),
  link: svg('<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>')
};

/* ─── État global de l'application ─── */
const State = {
  db: null,                        // instance SQLite (sql.js)
  user: null,                      // utilisateur connecté
  wallet: null,                    // adresse connectée via MetaMask (minuscules)
  readProvider: null,
  signer: null,
  contracts: { core: null, mine: null, usdt: null, fta: null },
  mTypes: [], bTypes: [],
  ftaCostsM: [], ftaCostsB: [],
  machineCount: 0, batteryCount: 0,
  balances: { uBal: 0n, fBal: 0n, pol: 0n, wUsdt: null, wFta: null, wPol: null },
  mining: { power: 0n, machines: 0n, lc: 0n, pending: 0n, difficulty: 0n, baseRate: 0n },
  fees: { swapFee: 0n, wFee: 0n, claimFee: 0n, devFee: 0n, coms: [0n, 0n, 0n], tfp: 0n },
  myRef: null,
  myId: null,
  swapDir: 'u2f',
  confirmCb: null,
  refreshTimer: null,
  shopLoaded: false
};

/* ─── ABI des contrats (dérivées des fichiers .sol) ─── */

// FitiaMiningV3_Core - tokens, dépôts/retraits, swaps, parrainage
const CORE_ABI = [
  'function usdt() view returns (address)',
  'function fta() view returns (address)',
  'function miner() view returns (address)',
  'function owner() view returns (address)',
  'function difficulty() view returns (uint256)',
  'function baseRate() view returns (uint256)',
  'function slope() view returns (uint256)',
  'function netFta() view returns (uint256)',
  'function devFee() view returns (uint256)',
  'function comRates(uint256) view returns (uint256)',
  'function swapFee() view returns (uint256)',
  'function claimFee() view returns (uint256)',
  'function wFee() view returns (uint256)',
  'function gasFee() view returns (uint256)',
  'function feeRecv() view returns (address)',
  'function uid(address) view returns (uint256)',
  'function aToId(uint256) view returns (address)',
  'function refr(address) view returns (address)',
  'function pol(address) view returns (uint256)',
  'function uBal(address) view returns (uint256)',
  'function fBal(address) view returns (uint256)',
  'function paused() view returns (bool)',
  'function rate() view returns (uint256)',
  'function sellFta(uint256) view returns (uint256)',
  'function buyFta(uint256) view returns (uint256)',
  'function costFta(uint256) view returns (uint256)',
  'function myInfo() view returns (uint256 id, uint256 p, uint256 ub, uint256 fb)',
  'function depositPol() payable',
  'function depositUsdt(uint256 a)',
  'function depositFta(uint256 a)',
  'function withdrawPol(uint256 a)',
  'function withdrawUsdt(uint256 a)',
  'function withdrawFta(uint256 a)',
  'function setReferrer(address r)',
  'function setReferrerById(uint256 rid)',
  'function swapUForF(uint256 a, uint256 m, uint256 d)',
  'function swapFForU(uint256 a, uint256 m, uint256 d)',
  'function executeMetaTx(address from, bytes data, uint256 dl, bytes sig)'
];

// FitiaMiningV3_Mine - machines, batteries, minage, récompenses
const MINE_ABI = [
  'function core() view returns (address)',
  'function mCount() view returns (uint256)',
  'function bCount() view returns (uint256)',
  'function getMType(uint256 id) view returns (uint256 price, uint256 power, uint256 shopExpiry)',
  'function getBType(uint256 id) view returns (uint256 price, uint256 dur)',
  'function powerOf(address u) view returns (uint256)',
  'function myMachines(address u) view returns ((uint256 tid, uint256 exp)[] machines)',
  'function myBattery(address u, uint256 t) view returns (uint256)',
  'function myInfo(address u) view returns (uint256 mc, uint256 ap, uint256 lc)',
  'function buyMachine(uint256 t)',
  'function buyMachineFTA(uint256 t)',
  'function buyBattery(uint256 t)',
  'function buyBatteryFTA(uint256 t)',
  'function plugInMachine(uint256 mi, uint256 bi)',
  'function claimRewards()'
];

// ERC20 standard (USDT / FTA)
const ERC20_ABI = [
  'function balanceOf(address) view returns (uint256)',
  'function allowance(address, address) view returns (uint256)',
  'function approve(address, uint256) returns (bool)',
  'function transfer(address, uint256) returns (bool)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)'
];

/* ═══════════════════════════════════════════════════════════════════
   BASE DE DONNÉES SQLITE (sql.js - WebAssembly)
   Le fichier .db est conservé dans le navigateur et sauvegardé
   automatiquement. Boutons « Exporter » / « Importer » en bas de page.
   ═══════════════════════════════════════════════════════════════════ */

const DB_SCHEMA = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    address TEXT UNIQUE,
    wallet_message TEXT,
    wallet_signature TEXT,
    created_at INTEGER NOT NULL,
    last_login INTEGER
  );
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    type TEXT NOT NULL,
    tx_hash TEXT,
    asset TEXT,
    amount TEXT,
    status TEXT NOT NULL DEFAULT 'confirmed',
    details TEXT,
    created_at INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_tx_user ON transactions(user_id, created_at);
`;

const DB = {
  key: 'fitia_db',
  sessionKey: 'fitia_session',

  // Initialise la base : charge depuis le stockage local ou crée une base neuve
  async init() {
    if (typeof initSqlJs === 'undefined') throw new Error('sql.js non chargé');
    const SQL = await initSqlJs({
      locateFile: f => 'https://cdn.jsdelivr.net/npm/sql.js@1.13.0/dist/' + f
    });
    const saved = localStorage.getItem(this.key);
    if (saved) {
      try {
        const bytes = Uint8Array.from(atob(saved), c => c.charCodeAt(0));
        this.db = new SQL.Database(bytes);
      } catch {
        this.db = new SQL.Database();
      }
    } else {
      this.db = new SQL.Database();
    }
    this.db.run(DB_SCHEMA);
    this.persist();
  },

  // Sauvegarde la base en base64 dans localStorage
  persist() {
    try {
      const bytes = this.db.export();
      let bin = '';
      const CHUNK = 0x8000;
      for (let i = 0; i < bytes.length; i += CHUNK) {
        bin += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK));
      }
      localStorage.setItem(this.key, btoa(bin));
    } catch (e) {
      console.warn('Persistance SQLite impossible :', e);
    }
  },

  // Requêtes utilitaires (paramétrées)
  get(sql, params = []) {
    const st = this.db.prepare(sql);
    st.bind(params);
    let row = null;
    if (st.step()) row = st.getAsObject();
    st.free();
    return row;
  },
  all(sql, params = []) {
    const st = this.db.prepare(sql);
    st.bind(params);
    const rows = [];
    while (st.step()) rows.push(st.getAsObject());
    st.free();
    return rows;
  },
  run(sql, params = []) {
    this.db.run(sql, params);
    this.persist();
  },

  // Statistiques globales (page d'accueil)
  stats() {
    return {
      users: this.get('SELECT COUNT(*) AS n FROM users').n,
      transactions: this.get('SELECT COUNT(*) AS n FROM transactions').n
    };
  },

  // Export du fichier .db (ouvrable avec l'extension SQLite de VS Code)
  exportFile() {
    const bytes = this.db.export();
    const blob = new Blob([bytes], { type: 'application/x-sqlite3' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'fitia.db';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  },

  // Import d'un fichier .db (remplace la base actuelle)
  importFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const SQL = await initSqlJs({
            locateFile: f => 'https://cdn.jsdelivr.net/npm/sql.js@1.13.0/dist/' + f
          });
          this.db = new SQL.Database(new Uint8Array(reader.result));
          this.db.run(DB_SCHEMA); // s'assure que les tables existent
          this.persist();
          resolve();
        } catch (e) { reject(e); }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
    });
  },

  // Session : utilisateur actuellement connecté
  loadSession() {
    try {
      const s = JSON.parse(localStorage.getItem(this.sessionKey));
      if (!s || !s.userId) return null;
      const u = this.get('SELECT * FROM users WHERE id = ?', [s.userId]);
      return u || null;
    } catch { return null; }
  },
  saveSession(user) {
    localStorage.setItem(this.sessionKey, JSON.stringify({ userId: user.id, username: user.username }));
  },
  clearSession() { localStorage.removeItem(this.sessionKey); }
};

/* ─── Hachage des mots de passe (PBKDF2 via Web Crypto) ─── */
const enc = new TextEncoder();

function newSalt() {
  const b = new Uint8Array(16);
  crypto.getRandomValues(b);
  return Array.from(b, x => x.toString(16).padStart(2, '0')).join('');
}

async function hashPassword(password, salt) {
  const key = await crypto.subtle.importKey('raw', enc.encode(String(password)), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: enc.encode(salt), iterations: 150000, hash: 'SHA-256' },
    key, 256
  );
  return Array.from(new Uint8Array(bits), b => b.toString(16).padStart(2, '0')).join('');
}

/* ─── Petits utilitaires DOM ─── */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

function fmtNum(v, dec = 2) {
  return Number(v).toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: dec });
}

function shortAddr(a) {
  if (!a) return '-';
  return a.slice(0, 6) + '...' + a.slice(-4);
}

function fmtDate(ts) {
  if (!ts) return '-';
  return new Date(ts).toLocaleString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

function fmtDur(seconds) {
  const d = Number(seconds) / 86400;
  if (d >= 1) return d % 1 === 0 ? `${d} jour${d > 1 ? 's' : ''}` : `${d.toFixed(1)} jours`;
  const h = Number(seconds) / 3600;
  if (h >= 1) return `${h.toFixed(1)} h`;
  return `${Math.round(Number(seconds) / 60)} min`;
}

/* ─── Messages d'erreur blockchain traduits ─── */
function decodeErr(e) {
  if (!e) return 'Erreur inconnue';
  if (e.code === 4001) return 'Opération annulée dans MetaMask.';
  if (e.code === 'INSUFFICIENT_FUNDS' || /insufficient funds/i.test(e.message || '')) {
    return 'Solde POL insuffisant pour les frais de gaz.';
  }
  const raw = (e.shortMessage || e.reason || e.message || '');
  const map = [
    [/unknown custom error/, 'Transaction rejetée par le contrat (voir détails).'],
    [/InsF/, 'Solde insuffisant dans la DApp.'],
    [/Slip/, 'Glissement de prix trop élevé - réessayez.'],
    [/Expired/, 'Opération expirée - réessayez.'],
    [/MaxM/, 'Nombre maximum de machines atteint (100).'],
    [/NoBat/, "Vous n'avez pas de batterie de ce type."],
    [/Running/, 'Cette machine est déjà en cours de minage.'],
    [/NoM/, 'Vous ne possédez aucune machine.'],
    [/NoLiq/, 'Pas de liquidité disponible.'],
    [/FtaLiq/, 'Liquidité FTA insuffisante.'],
    [/NoPol/, 'POL insuffisant dans la DApp (déposez du POL).'],
    [/RefSelf/, "Impossible d'être son propre parrain."],
    [/RefSet/, 'Parrain déjà défini (opération unique).'],
    [/FeesH/, 'Frais invalides côté contrat.'],
    [/rejected/i, 'Transaction rejetée par le portefeuille.']
  ];
  for (const [re, msg] of map) if (re.test(raw)) return msg;
  return raw || 'Erreur de transaction.';
}

/* ─── Toasts ─── */
function toast(msg, type = 'info', ms = 4500) {
  const icons = { success: ICONS.check, error: ICONS.alert, info: ICONS.info };
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<span class="t-ic">${icons[type] || ICONS.info}</span><span>${msg}</span>`;
  $('#toasts').appendChild(el);
  setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 350); }, ms);
}

/* ─── Modales ─── */
function openModal(id) { $(`#${id}`).classList.remove('hidden'); }
function closeModal(id) { $(`#${id}`).classList.add('hidden'); }

$$('[data-close]').forEach(b => b.addEventListener('click', () => closeModal(b.dataset.close)));
document.querySelectorAll('.modal-backdrop').forEach(bd => {
  bd.addEventListener('click', (e) => { if (e.target === bd) bd.classList.add('hidden'); });
});

/* ─── Attente de transaction ─── */
function showTxWait(title, sub) {
  $('#txWaitTitle').textContent = title;
  $('#txWaitSub').textContent = sub;
  $('#txWait').classList.remove('hidden');
}
function hideTxWait() { $('#txWait').classList.add('hidden'); }

/* ─── Écran de démarrage ─── */
function hideBoot() { $('#bootScreen').classList.add('hidden'); }
function showBootError(title, msg) {
  const b = $('#bootScreen');
  b.innerHTML = `<div class="boot-logo" style="background:linear-gradient(135deg,#F6465D,#B3233E);color:#fff">${ICONS.alert}</div><h1>${title}</h1><p style="max-width:320px;text-align:center">${msg}</p>`;
}

/* ═══════════════════════════════════════════════════════════════════
   AUTHENTIFICATION (base SQLite locale)
   ═══════════════════════════════════════════════════════════════════ */

async function handleRegister(e) {
  e.preventDefault();
  const username = $('#regUsername').value.trim();
  const password = $('#regPassword').value;
  const password2 = $('#regPassword2').value;
  $('#registerError').textContent = '';
  if (!/^[a-zA-Z0-9_]{3,24}$/.test(username)) {
    $('#registerError').textContent = "Nom d'utilisateur : 3 à 24 caractères (lettres, chiffres, _).";
    return;
  }
  if (password.length < 6) {
    $('#registerError').textContent = 'Mot de passe : 6 caractères minimum.';
    return;
  }
  if (password !== password2) {
    $('#registerError').textContent = 'Les mots de passe ne correspondent pas.';
    return;
  }
  if (DB.get('SELECT id FROM users WHERE username = ?', [username])) {
    $('#registerError').textContent = "Ce nom d'utilisateur est déjà pris.";
    return;
  }
  $('#btnRegisterSubmit').disabled = true;
  $('#btnRegisterSubmit').textContent = 'Création du compte...';
  try {
    const salt = newSalt();
    const hash = await hashPassword(password, salt);
    DB.run(
      'INSERT INTO users (username, password_hash, salt, created_at) VALUES (?, ?, ?, ?)',
      [username, hash, salt, Date.now()]
    );
    // Récupère l'ID via l'username (UNIQUE) : plus fiable que last_insert_rowid,
    // que sql.js réinitialise à 0 lors de l'export/persistance de la base
    const row = DB.get('SELECT id FROM users WHERE username = ?', [username]);
    const user = { id: row.id, username, address: null, created_at: Date.now() };
    DB.saveSession(user);
    State.user = user;
    toast(`Compte « ${username} » créé !`, 'success');
    showApp();
    refreshDbStatus();
  } catch (err) {
    $('#registerError').textContent = err.message || 'Erreur lors de la création du compte.';
  } finally {
    $('#btnRegisterSubmit').disabled = false;
    $('#btnRegisterSubmit').textContent = 'Créer mon compte';
  }
}

async function handleLogin(e) {
  e.preventDefault();
  const username = $('#loginUsername').value.trim();
  const password = $('#loginPassword').value;
  $('#loginError').textContent = '';
  $('#btnLoginSubmit').disabled = true;
  $('#btnLoginSubmit').textContent = 'Connexion...';
  try {
    const user = DB.get('SELECT * FROM users WHERE username = ?', [username]);
    if (!user) throw new Error('Identifiants incorrects');
    const hash = await hashPassword(password, user.salt);
    if (hash !== user.password_hash) throw new Error('Identifiants incorrects');
    DB.run('UPDATE users SET last_login = ? WHERE id = ?', [Date.now(), user.id]);
    const clean = { id: user.id, username: user.username, address: user.address, created_at: user.created_at };
    DB.saveSession(clean);
    State.user = clean;
    toast(`Bienvenue ${user.username} !`, 'success');
    showApp();
    refreshDbStatus();
  } catch (err) {
    $('#loginError').textContent = err.message;
  } finally {
    $('#btnLoginSubmit').disabled = false;
    $('#btnLoginSubmit').textContent = 'Se connecter';
  }
}

function handleLogout() {
  DB.clearSession();
  State.user = null;
  if (State.refreshTimer) clearInterval(State.refreshTimer);
  $('#viewApp').classList.add('hidden');
  showAuth();
  updateWalletUI();
  toast('Vous êtes déconnecté.', 'info');
}

/* ═══════════════════════════════════════════════════════════════════
   INITIALISATION
   ═══════════════════════════════════════════════════════════════════ */

async function init() {
  if (typeof ethers === 'undefined') {
    showBootError('Bibliothèque manquante', 'Impossible de charger ethers.js - vérifiez votre connexion Internet puis actualisez la page.');
    return;
  }
  if (typeof initSqlJs === 'undefined') {
    showBootError('Bibliothèque manquante', 'Impossible de charger sql.js (SQLite) - vérifiez votre connexion Internet puis actualisez la page.');
    return;
  }
  try {
    await DB.init();
  } catch (e) {
    showBootError('Erreur de base de données', (e && e.message) || 'Impossible d\'initialiser la base SQLite.');
    return;
  }

  // Fournisseur de lecture (RPC publics Polygon) pour les données sans portefeuille
  State.readProvider = new ethers.FallbackProvider(
    CFG.polygon.rpc.map(u => new ethers.JsonRpcProvider(u)), 1
  );

  const configured = CFG.contracts.core !== ZERO_ADDR && CFG.contracts.mine !== ZERO_ADDR;
  if (configured) initContracts(null);

  // Statistiques locales
  const st = DB.stats();
  $('#statUsers').textContent = fmtNum(st.users, 0);
  $('#statTxs').textContent = fmtNum(st.transactions, 0);
  refreshDbStatus();

  // Réseau affiché dans le footer
  $('#footNetwork').textContent = `${CFG.polygon.chainName} (${parseInt(CFG.polygon.chainId, 16)})`;

  if (!configured) {
    toast('Adresses des contrats non configurées : ouvrez app.js et renseignez le bloc CFG.contracts', 'error', 8000);
  }

  // Connexion au portefeuille si déjà autorisé
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts && accounts.length) State.wallet = accounts[0].toLowerCase();
    } catch { /* silencieux */ }
    window.ethereum.on('accountsChanged', (accs) => {
      State.wallet = accs && accs.length ? accs[0].toLowerCase() : null;
      State.signer = null;
      onWalletChanged();
    });
    window.ethereum.on('chainChanged', () => setTimeout(onWalletChanged, 600));
  }

  // Restaurer la session
  const sess = DB.loadSession();
  if (sess) {
    State.user = { id: sess.id, username: sess.username, address: sess.address, created_at: sess.created_at };
    showApp();
  } else {
    showAuth();
  }

  wireEvents();
  wireAuthTabs();
  updateWalletUI();
  hideBoot();
}

// Indicateur d'état de la base dans le footer
function refreshDbStatus() {
  const st = DB.stats();
  const size = (localStorage.getItem(DB.key) || '').length;
  $('#dbStatus').textContent = `SQLite locale · ${fmtNum(st.users, 0)} utilisateur(s) · ${fmtNum(st.transactions, 0)} transaction(s) · ${fmtNum(size / 1024, 1)} Ko`;
  // Compteurs de la page d'accueil (mise à jour en temps réel)
  $('#statUsers').textContent = fmtNum(st.users, 0);
  $('#statTxs').textContent = fmtNum(st.transactions, 0);
}

/* ─── Création des instances de contrats ─── */
function initContracts(signerOrProvider) {
  const p = signerOrProvider || State.readProvider;
  const c = CFG.contracts;
  State.contracts.core = new ethers.Contract(c.core, CORE_ABI, p);
  State.contracts.mine = new ethers.Contract(c.mine, MINE_ABI, p);
  State.contracts.usdt = new ethers.Contract(c.usdt, ERC20_ABI, p);
  State.contracts.fta = new ethers.Contract(c.fta, ERC20_ABI, p);
}

function contractsReady() {
  return State.contracts.core && State.contracts.mine && CFG.contracts.core !== ZERO_ADDR;
}

/* ─── Navigation par onglets ─── */
const TABS = ['dashboard', 'shop', 'mining', 'swap', 'history'];

function renderNav() {
  const labels = {
    dashboard: { ic: ICONS.grid, t: 'Accueil' },
    shop: { ic: ICONS.bag, t: 'Boutique' },
    mining: { ic: ICONS.pick, t: 'Minage' },
    swap: { ic: ICONS.repeat, t: 'Échange' },
    history: { ic: ICONS.clock, t: 'Historique' }
  };
  // Double rendu : nav haute (desktop) + barre basse (mobile)
  ['#navLinks', '#bottomNav'].forEach(sel => {
    const nav = $(sel);
    if (!nav) return;
    nav.innerHTML = '';
    TABS.forEach(t => {
      const b = document.createElement('button');
      b.className = 'nav-link' + (t === 'dashboard' ? ' active' : '');
      b.type = 'button';
      b.innerHTML = `<span class="nav-ic">${labels[t].ic}</span><span class="nav-txt">${labels[t].t}</span>`;
      b.addEventListener('click', () => switchTab(t));
      nav.appendChild(b);
    });
    nav.classList.remove('hidden');
  });
}

function switchTab(name) {
  $$('.tab-page').forEach(p => p.classList.add('hidden'));
  const page = $(`#tab-${name}`);
  if (page) page.classList.remove('hidden');
  $$('.nav-link').forEach(b => b.classList.remove('active'));
  const map = { dashboard: 'Accueil', shop: 'Boutique', mining: 'Minage', swap: 'Échange', history: 'Historique' };
  // L'onglet actif est marqué dans LES DEUX navs (haute + basse) :
  // sur mobile, seule la barre basse est visible ; sur desktop, seule la nav haute.
  ['#navLinks', '#bottomNav'].forEach(sel => {
    const btn = $$(sel + ' .nav-link').find(b => b.textContent.includes(map[name]));
    if (btn) btn.classList.add('active');
  });
  if (name === 'shop' && !State.shopLoaded) loadShop();
  if (name === 'mining') { loadMyMachines(); loadMyBatteries(); }
  if (name === 'swap') updateSwapEstimate();
  if (name === 'history') loadHistory();
  if (name === 'dashboard') { loadRecent(); refreshAll(); }
}

/* ─── Vues authentification / application ─── */
function showAuth() {
  $('#viewAuth').classList.remove('hidden');
  $('#viewApp').classList.add('hidden');
  $('#footer').classList.add('hidden');
  $('#userChip').classList.add('hidden');
  $('#navLinks').classList.add('hidden');
}

function showApp() {
  $('#viewAuth').classList.add('hidden');
  $('#viewApp').classList.remove('hidden');
  $('#footer').classList.remove('hidden');
  $('#userChip').classList.remove('hidden');
  $('#chipUsername').textContent = State.user.username;
  $('#chipAvatar').textContent = State.user.username[0].toUpperCase();
  $('#chipAddress').textContent = State.user.address ? shortAddr(State.user.address) : 'portefeuille non lié';
  $('#dashGreeting').textContent = `Bonjour ${State.user.username} ! Voici votre espace de minage.`;
  renderNav();
  switchTab('dashboard');
  if (State.refreshTimer) clearInterval(State.refreshTimer);
  State.refreshTimer = setInterval(() => {
    if (contractsReady() && !document.hidden) refreshAll();
  }, 25000);
}

function showAuthTab(which) {
  const login = which === 'login';
  $('#formLogin').classList.toggle('hidden', !login);
  $('#formRegister').classList.toggle('hidden', login);
  $('#tabLoginBtn').classList.toggle('active', login);
  $('#tabRegisterBtn').classList.toggle('active', !login);
  $('#loginError').textContent = '';
  $('#registerError').textContent = '';
}

function wireAuthTabs() {
  $('#tabLoginBtn').addEventListener('click', () => showAuthTab('login'));
  $('#tabRegisterBtn').addEventListener('click', () => showAuthTab('register'));
  $('#goRegister').addEventListener('click', (e) => { e.preventDefault(); showAuthTab('register'); });
  $('#goLogin').addEventListener('click', (e) => { e.preventDefault(); showAuthTab('login'); });
}

/* ═══════════════════════════════════════════════════════════════════
   PORTEFEUILLE (MetaMask + Polygon)
   ═══════════════════════════════════════════════════════════════════ */

async function connectWallet() {
  if (!window.ethereum) {
    toast('MetaMask n\'est pas installé. Installez-le sur metamask.io', 'error', 6000);
    window.open('https://metamask.io/download/', '_blank');
    return;
  }
  if (!State.user) {
    toast('Connectez-vous d\'abord à votre compte.', 'info');
    return;
  }
  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    if (!accounts || !accounts.length) return;
    State.wallet = accounts[0].toLowerCase();
    State.signer = null;
    const ok = await ensurePolygonChain();
    if (!ok) return;
    toast(`Portefeuille connecté : ${shortAddr(State.wallet)}`, 'success');
    await refreshAll();
    onWalletChanged();
  } catch (e) {
    toast(decodeErr(e), 'error');
  }
}

async function ensurePolygonChain() {
  const p = CFG.polygon;
  try {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    if (chainId === p.chainId) return true;
    try {
      await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: p.chainId }] });
      return true;
    } catch (err) {
      if (err.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: p.chainId, chainName: p.chainName,
            nativeCurrency: p.nativeCurrency, rpcUrls: p.rpc
          }]
        });
        return true;
      }
      return false;
    }
  } catch {
    return false;
  }
}

async function getSigner() {
  if (!State.wallet) return null;
  if (!State.signer) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    await ensurePolygonChain();
    State.signer = await provider.getSigner();
    initContracts(State.signer);
  }
  return State.signer;
}

async function linkWallet() {
  if (!State.user) return;
  await connectWallet();
  if (!State.wallet) return;
  try {
    const signer = await getSigner();
    const message = `Fitia Mining V3 - Lier mon portefeuille (${State.user.username}) - ${Date.now()}`;
    showTxWait('Signature demandée...', 'Signez le message dans MetaMask pour lier votre adresse.');
    const signature = await signer.signMessage(message);
    hideTxWait();
    // Vérification locale de la signature (EIP-191)
    const recovered = ethers.verifyMessage(message, signature);
    if (recovered.toLowerCase() !== State.wallet) throw new Error('La signature ne correspond pas à l\'adresse.');
    // Une adresse ne peut être liée qu'à UN SEUL compte
    const taken = DB.get('SELECT id, username FROM users WHERE address = ? AND id != ?', [State.wallet, State.user.id]);
    if (taken) throw new Error(`Cette adresse est déjà liée au compte « ${taken.username} ».`);
    DB.run('UPDATE users SET address = ?, wallet_message = ?, wallet_signature = ? WHERE id = ?',
      [State.wallet, message, signature, State.user.id]);
    State.user.address = State.wallet;
    $('#chipAddress').textContent = shortAddr(State.wallet);
    toast(`Adresse liée à votre compte : ${shortAddr(State.wallet)}`, 'success');
    onWalletChanged();
    refreshDbStatus();
  } catch (e) {
    hideTxWait();
    toast(e.message || decodeErr(e), 'error');
  }
}

function onWalletChanged() {
  updateWalletUI();
  if (!State.user) return;
  const linked = State.user.address;
  const warn = $('#walletMismatch');
  const banner = $('#walletBanner');
  if (!linked && State.wallet) {
    banner.classList.remove('hidden');
    warn.classList.add('hidden');
  } else if (linked && State.wallet && State.wallet !== linked) {
    warn.classList.remove('hidden');
    banner.classList.add('hidden');
  } else {
    banner.classList.add('hidden');
    warn.classList.add('hidden');
  }
  if (State.wallet) refreshAll();
}

function updateWalletUI() {
  const btn = $('#btnConnectWallet');
  const label = $('#walletBtnLabel');
  if (State.wallet) {
    btn.classList.add('connected');
    label.textContent = shortAddr(State.wallet);
    $('#footNetwork').textContent = `${CFG.polygon.chainName} (${parseInt(CFG.polygon.chainId, 16)})`;
  } else {
    btn.classList.remove('connected');
    label.textContent = 'Connecter le portefeuille';
    $('#footNetwork').textContent = `${CFG.polygon.chainName} (${parseInt(CFG.polygon.chainId, 16)})`;
  }
}

/* ═══════════════════════════════════════════════════════════════════
   DONNÉES ON-CHAIN - soldes, minage, frais
   ═══════════════════════════════════════════════════════════════════ */

async function refreshAll() {
  if (!contractsReady()) return;
  try {
    await Promise.all([refreshBalances(), refreshMining(), refreshFees(), refreshMyRef()]);
  } catch (e) {
    toast(decodeErr(e), 'error');
  }
}

async function refreshFees() {
  const core = State.contracts.core;
  const [swapFee, wFee, claimFee, devFee, c0, c1, c2] = await Promise.all([
    core.swapFee(), core.wFee(), core.claimFee(), core.devFee(), core.comRates(0), core.comRates(1), core.comRates(2)
  ]);
  State.fees.swapFee = swapFee;
  State.fees.wFee = wFee;
  State.fees.claimFee = claimFee;
  State.fees.devFee = devFee;
  State.fees.coms = [c0, c1, c2];
  State.fees.tfp = devFee + c0 + c1 + c2;
}

async function refreshBalances() {
  const core = State.contracts.core;
  const read = State.signer || State.readProvider;
  const addr = State.wallet || ZERO_ADDR;
  const [uBal, fBal, pol, wUsdt, wFta, wPol] = await Promise.all([
    core.uBal(addr), core.fBal(addr), core.pol(addr),
    core.usdt().then(t => new ethers.Contract(t, ERC20_ABI, read).balanceOf(addr)),
    core.fta().then(t => new ethers.Contract(t, ERC20_ABI, read).balanceOf(addr)),
    read.getBalance(addr)
  ]);
  State.balances = { uBal, fBal, pol, wUsdt, wFta, wPol };
  const du = CFG.decimals.usdt;
  const df = CFG.decimals.fta;
  $('#balUsdt').textContent = fmtNum(ethers.formatUnits(uBal, du));
  $('#balFta').textContent = fmtNum(ethers.formatUnits(fBal, df));
  $('#balPol').textContent = fmtNum(ethers.formatUnits(pol, 18));
  $('#balUsdtWallet').textContent = `Portefeuille : ${State.wallet ? fmtNum(ethers.formatUnits(wUsdt, du)) + ' USDT' : '-'}`;
  $('#balFtaWallet').textContent = `Portefeuille : ${State.wallet ? fmtNum(ethers.formatUnits(wFta, df)) + ' FTA' : '-'}`;
  $('#balPolWallet').textContent = `Portefeuille : ${State.wallet ? fmtNum(ethers.formatUnits(wPol, 18)) + ' POL' : '-'}`;
}

async function refreshMining() {
  const core = State.contracts.core;
  const mine = State.contracts.mine;
  const addr = State.wallet || ZERO_ADDR;
  const [power, info, difficulty, baseRate] = await Promise.all([
    mine.powerOf(addr), mine.myInfo(addr), core.difficulty(), core.baseRate()
  ]);
  const lc = BigInt(info.lc);
  const nowS = BigInt(Math.floor(Date.now() / 1000));
  let pending = 0n;
  if (power > 0n && lc > 0n && nowS > lc) {
    pending = (nowS - lc) * power * difficulty / 10n ** 18n;
  }
  State.mining = { power, machines: BigInt(info.mc), lc, pending, difficulty, baseRate };
  const df = CFG.decimals.fta;
  // Les stats de l'Accueil ne dupliquent plus celles de l'onglet Minage :
  // puissance, récompenses et dernier claim ne sont affichées qu'ici.
  $('#minePower').textContent = power.toString();
  $('#minePending').textContent = `${fmtNum(ethers.formatUnits(pending, df))} FTA`;
  $('#mineLc').textContent = lc > 0n ? fmtDate(Number(lc) * 1000) : '-';
}

async function refreshMyRef() {
  if (!State.wallet) { State.myRef = null; State.myId = null; return; }
  const r = await State.contracts.core.refr(State.wallet);
  State.myRef = r === ZERO_ADDR ? null : r;
  State.myId = (await State.contracts.core.uid(State.wallet)).toString();
}

/* ═══════════════════════════════════════════════════════════════════
   BOUTIQUE
   ═══════════════════════════════════════════════════════════════════ */

async function loadShop() {
  if (!contractsReady()) { renderNotConfigured('#machinesGrid'); renderNotConfigured('#batteriesGrid'); return; }
  try {
    const mine = State.contracts.mine;
    const core = State.contracts.core;
    if (State.fees.tfp === 0n) await refreshFees();
    const [mc, bc] = await Promise.all([mine.mCount(), mine.bCount()]);
    State.machineCount = Number(mc);
    State.batteryCount = Number(bc);
    const mTypes = [];
    for (let i = 0; i < State.machineCount; i++) mTypes.push(await mine.getMType(i));
    const bTypes = [];
    for (let i = 0; i < State.batteryCount; i++) bTypes.push(await mine.getBType(i));
    // Coûts FTA bruts (bonding curve) pour l'affichage des prix en FTA
    const mCosts = [];
    for (const m of mTypes) mCosts.push(await core.costFta(m.price));
    const bCosts = [];
    for (const b of bTypes) bCosts.push(await core.costFta(b.price));
    State.mTypes = mTypes;
    State.bTypes = bTypes;
    State.ftaCostsM = mCosts;
    State.ftaCostsB = bCosts;
    State.shopLoaded = true;
    renderMachines();
    renderBatteries();
  } catch (e) {
    toast('Impossible de charger la boutique : ' + decodeErr(e), 'error');
  }
}

function renderNotConfigured(sel) {
  $(sel).innerHTML = '<p class="empty-hint">Adresses des contrats non configurées (bloc CFG.contracts dans app.js).</p>';
}

function renderMachines() {
  const grid = $('#machinesGrid');
  if (!State.mTypes.length) {
    grid.innerHTML = '<p class="empty-hint">Aucune machine dans la boutique.</p>';
    return;
  }
  const du = CFG.decimals.usdt;
  const df = CFG.decimals.fta;
  const now = Math.floor(Date.now() / 1000);
  grid.innerHTML = State.mTypes.map((m, i) => {
    const priceU = ethers.formatUnits(m.price, du);
    const expired = m.shopExpiry > 0n && now > Number(m.shopExpiry);
    const ftaCost = State.ftaCostsM && State.ftaCostsM[i] != null
      ? ethers.formatUnits(ftaCostFor(State.ftaCostsM[i]), df) : '-';
    return `
      <article class="card shop-card">
        <div class="m-pic">${ICONS.cpu}</div>
        <h3>Machine ${i + 1}</h3>
        <div class="m-meta"><span>Puissance</span><b>${ICONS.bolt} ${m.power.toString()}</b></div>
        <div class="m-meta"><span>Disponible</span><b>${expired ? 'Non' : 'Oui'}</b></div>
        <div class="m-badges">
          ${m.shopExpiry > 0n ? `<span class="badge ${expired ? 'badge-red' : 'badge-violet'}">${expired ? 'Expirée' : 'Jusqu\'au ' + fmtDate(Number(m.shopExpiry) * 1000)}</span>` : '<span class="badge badge-green">Illimitée</span>'}
        </div>
        <div class="m-price">${ICONS.coin} ${fmtNum(priceU)} USDT</div>
        <div class="shop-btns">
          <button class="btn btn-green btn-sm" data-buy="machine" data-id="${i}" data-mode="usdt" ${expired ? 'disabled' : ''}>USDT</button>
          <button class="btn btn-violet btn-sm" data-buy="machine" data-id="${i}" data-mode="fta" ${expired ? 'disabled' : ''}>FTA ≈ ${ftaCost}</button>
        </div>
      </article>`;
  }).join('');
}

function renderBatteries() {
  const grid = $('#batteriesGrid');
  if (!State.bTypes.length) {
    grid.innerHTML = '<p class="empty-hint">Aucune batterie dans la boutique.</p>';
    return;
  }
  const du = CFG.decimals.usdt;
  const df = CFG.decimals.fta;
  grid.innerHTML = State.bTypes.map((b, i) => {
    const priceU = ethers.formatUnits(b.price, du);
    const ftaCost = State.ftaCostsB && State.ftaCostsB[i] != null
      ? ethers.formatUnits(ftaCostFor(State.ftaCostsB[i]), df) : '-';
    return `
      <article class="card shop-card battery">
        <div class="m-pic">${ICONS.battery}</div>
        <h3>Batterie ${i + 1}</h3>
        <div class="m-meta"><span>Durée</span><b>${ICONS.clock} ${fmtDur(b.dur)}</b></div>
        <div class="m-price">${ICONS.coin} ${fmtNum(priceU)} USDT</div>
        <div class="shop-btns">
          <button class="btn btn-green btn-sm" data-buy="battery" data-id="${i}" data-mode="usdt">USDT</button>
          <button class="btn btn-violet btn-sm" data-buy="battery" data-id="${i}" data-mode="fta">FTA ≈ ${ftaCost}</button>
        </div>
      </article>`;
  }).join('');
}

// Coût FTA total à payer (coût bonding curve + frais, comme dans _pay du contrat)
function ftaCostFor(costRaw) {
  const tfp = State.fees.tfp;
  if (tfp <= 0n) return costRaw;
  return costRaw + (costRaw * tfp) / (100n - tfp);
}

/* ═══════════════════════════════════════════════════════════════════
   MINAGE - mes machines & batteries
   ═══════════════════════════════════════════════════════════════════ */

async function loadMyMachines() {
  const list = $('#myMachinesList');
  if (!contractsReady()) { list.innerHTML = '<p class="empty-hint">Adresses des contrats non configurées.</p>'; return; }
  if (!State.wallet) { list.innerHTML = '<p class="empty-hint">Connectez votre portefeuille pour voir vos machines.</p>'; return; }
  try {
    const machines = await State.contracts.mine.myMachines(State.wallet);
    const now = Math.floor(Date.now() / 1000);
    if (!machines.length) {
      list.innerHTML = '<p class="empty-hint">Vous ne possédez aucune machine. Achetez-en une dans la Boutique !</p>';
      return;
    }
    list.innerHTML = machines.map((m, i) => {
      const type = State.mTypes[Number(m.tid)];
      const active = m.exp > 0n && now < Number(m.exp);
      const status = m.exp === 0n
        ? '<span class="badge badge-green">Active (illimitée)</span>'
        : (active
            ? `<span class="badge badge-gold">${ICONS.pick} Jusqu\'au ${fmtDate(Number(m.exp) * 1000)}</span>`
            : '<span class="badge badge-red">Expirée - rebrancher</span>');
      return `
        <article class="card machine-card">
          <div class="m-head">
            <h3>Machine ${i + 1} <small style="color:var(--text-dim)">(type ${Number(m.tid) + 1})</small></h3>
            <span class="m-power">${ICONS.bolt} ${type ? type.power.toString() : '?'} de puissance</span>
          </div>
          <div>${status}</div>
          <button class="btn btn-violet btn-sm" data-plug="${i}" ${active || !type ? 'disabled' : ''}>${ICONS.plug} Brancher une batterie</button>
        </article>`;
    }).join('');
  } catch (e) {
    list.innerHTML = `<p class="empty-hint">Erreur : ${decodeErr(e)}</p>`;
  }
}

async function loadMyBatteries() {
  const list = $('#myBatteriesList');
  if (!contractsReady()) { list.innerHTML = '<p class="empty-hint">Adresses des contrats non configurées.</p>'; return; }
  if (!State.wallet) { list.innerHTML = '<p class="empty-hint">Connectez votre portefeuille.</p>'; return; }
  try {
    const rows = [];
    for (let i = 0; i < State.batteryCount; i++) {
      const count = await State.contracts.mine.myBattery(State.wallet, i);
      if (count > 0n) rows.push({ i, count, type: State.bTypes[i] });
    }
    if (!rows.length) {
      list.innerHTML = '<p class="empty-hint">Aucune batterie en stock. Achetez-en dans la Boutique !</p>';
      return;
    }
    list.innerHTML = rows.map(({ i, count, type }) => `
      <div class="battery-row">
        <span class="b-ic">${ICONS.battery}</span>
        <div class="b-info">
          <strong>Batterie ${i + 1} - ${fmtDur(type.dur)}</strong>
          <small>Durée de minage : ${fmtDur(type.dur)}</small>
        </div>
        <span class="b-count">× ${count.toString()}</span>
      </div>`).join('');
  } catch (e) {
    list.innerHTML = `<p class="empty-hint">Erreur : ${decodeErr(e)}</p>`;
  }
}

async function openPlugModal(mi) {
  if (!State.wallet) { toast('Connectez d\'abord votre portefeuille.', 'info'); return; }
  const box = $('#plugOptions');
  box.innerHTML = '';
  let any = false;
  for (let i = 0; i < State.batteryCount; i++) {
    const count = await State.contracts.mine.myBattery(State.wallet, i);
    if (count > 0n) {
      any = true;
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'plug-opt';
      b.innerHTML = `<span>${ICONS.battery} Batterie ${i + 1} - ${fmtDur(State.bTypes[i].dur)}</span><b>× ${count.toString()}</b>`;
      b.addEventListener('click', () => {
        closeModal('modalPlug');
        openConfirm(
          'Brancher la machine',
          `Brancher la machine ${mi + 1} sur la batterie ${i + 1} (${fmtDur(State.bTypes[i].dur)}) ? Les récompenses accumulées seront réclamées automatiquement.`,
          () => plugMachine(mi, i)
        );
      });
      box.appendChild(b);
    }
  }
  if (!any) {
    box.innerHTML = '<p class="empty-hint">Aucune batterie en stock. Achetez-en dans la Boutique !</p>';
  }
  openModal('modalPlug');
}

async function plugMachine(mi, bi) {
  if (!(await ensureSigned())) return;
  try {
    const mine = State.contracts.mine.connect(await getSigner());
    const tx = await mine.plugInMachine(mi, bi);
    showTxWait('Branchement en cours...', `Confirmation de la transaction ${shortAddr(tx.hash)}...`);
    const receipt = await tx.wait();
    hideTxWait();
    if (receipt.status === 0) throw new Error('Transaction échouée (revert)');
    recordTx('plug', tx.hash, 'Batterie', '', { machine: mi, battery: bi });
    toast('Machine branchée ! Le minage est actif.', 'success');
    refreshAll();
    loadMyMachines();
    loadMyBatteries();
  } catch (e) {
    hideTxWait();
    toast(decodeErr(e), 'error');
  }
}

async function claimRewards() {
  if (!(await ensureSigned())) return;
  try {
    const mine = State.contracts.mine.connect(await getSigner());
    const tx = await mine.claimRewards();
    showTxWait('Réclamation en cours...', `Confirmation de la transaction ${shortAddr(tx.hash)}...`);
    const receipt = await tx.wait();
    hideTxWait();
    if (receipt.status === 0) throw new Error('Transaction échouée (revert)');
    recordTx('claim', tx.hash, 'FTA', `${fmtNum(ethers.formatUnits(State.mining.pending, CFG.decimals.fta))} FTA`, {});
    toast('Récompenses réclamées !', 'success');
    refreshAll();
    loadMyMachines();
  } catch (e) {
    hideTxWait();
    toast(decodeErr(e), 'error');
  }
}

/* ═══════════════════════════════════════════════════════════════════
   SWAP USDT ↔ FTA
   ═══════════════════════════════════════════════════════════════════ */

async function updateSwapEstimate() {
  const info = $('#swapInfo');
  if (!contractsReady()) {
    $('#swapOut').value = '';
    info.innerHTML = '<span>Adresses des contrats non configurées.</span>';
    return;
  }
  if (State.fees.swapFee === 0n) { try { await refreshFees(); } catch { /* silencieux */ } }
  const val = $('#swapIn').value.trim();
  if (!val || Number(val) <= 0) { $('#swapOut').value = ''; return; }
  try {
    const core = State.contracts.core;
    const du = CFG.decimals.usdt;
    const df = CFG.decimals.fta;
    if (State.swapDir === 'u2f') {
      const amount = ethers.parseUnits(val, du);
      const net = amount - (amount * State.fees.swapFee) / 100n;
      const out = await core.buyFta(net);
      $('#swapOut').value = fmtNum(ethers.formatUnits(out, df), 4);
      info.innerHTML = `<span>Frais de swap : ${State.fees.swapFee.toString()}%</span><span>≈ ${fmtNum(ethers.formatUnits(out, df), 4)} FTA</span>`;
    } else {
      const amount = ethers.parseUnits(val, df);
      const net = amount - (amount * State.fees.swapFee) / 100n;
      const out = await core.sellFta(net);
      $('#swapOut').value = fmtNum(ethers.formatUnits(out, du), 4);
      info.innerHTML = `<span>Frais de swap : ${State.fees.swapFee.toString()}%</span><span>≈ ${fmtNum(ethers.formatUnits(out, du), 4)} USDT</span>`;
    }
  } catch {
    $('#swapOut').value = '';
    info.innerHTML = '<span>Calcul de l\'estimation...</span>';
  }
}

async function doSwap() {
  const val = $('#swapIn').value.trim();
  $('#swapError').textContent = '';
  if (!val || Number(val) <= 0) { $('#swapError').textContent = 'Saisissez un montant valide.'; return; }
  if (!(await ensureSigned())) return;
  try {
    const core = State.contracts.core.connect(await getSigner());
    const du = CFG.decimals.usdt;
    const df = CFG.decimals.fta;
    const deadline = Math.floor(Date.now() / 1000) + 900;
    let tx, asset, amount;
    if (State.swapDir === 'u2f') {
      const amountRaw = ethers.parseUnits(val, du);
      const net = amountRaw - (amountRaw * State.fees.swapFee) / 100n;
      const out = await core.buyFta(net);
      const minOut = (out * 98n) / 100n;
      tx = await core.swapUForF(amountRaw, minOut, deadline);
      asset = 'USDT → FTA';
      amount = `${fmtNum(val)} USDT`;
    } else {
      const amountRaw = ethers.parseUnits(val, df);
      const net = amountRaw - (amountRaw * State.fees.swapFee) / 100n;
      const out = await core.sellFta(net);
      const minOut = (out * 98n) / 100n;
      tx = await core.swapFForU(amountRaw, minOut, deadline);
      asset = 'FTA → USDT';
      amount = `${fmtNum(val)} FTA`;
    }
    showTxWait('Échange en cours...', `Confirmation de la transaction ${shortAddr(tx.hash)}...`);
    const receipt = await tx.wait();
    hideTxWait();
    if (receipt.status === 0) throw new Error('Transaction échouée (revert)');
    recordTx('swap', tx.hash, asset, amount, {});
    toast('Échange réussi !', 'success');
    refreshAll();
  } catch (e) {
    hideTxWait();
    $('#swapError').textContent = decodeErr(e);
  }
}

/* ═══════════════════════════════════════════════════════════════════
   DÉPÔTS & RETRAITS
   ═══════════════════════════════════════════════════════════════════ */

const ASSETS = {
  usdt: { symbol: 'USDT', decimals: 'usdt' },
  fta: { symbol: 'FTA', decimals: 'fta' },
  pol: { symbol: 'POL', decimals: 18 }
};

function decFor(asset) {
  return asset === 'pol' ? 18 : CFG.decimals[ASSETS[asset].decimals];
}

function openDeposit(asset) {
  if (!State.wallet) { toast('Connectez d\'abord votre portefeuille.', 'info'); return; }
  const a = ASSETS[asset];
  $('#depositSymbol').textContent = a.symbol;
  $('#depositHint').textContent = `Déposez vos ${a.symbol} dans la DApp pour acheter, échanger et miner.`;
  $('#depositAmount').value = '';
  $('#depositError').textContent = '';
  $('#depositAllowBox').classList.add('hidden');
  $('#depositAmount').dataset.asset = asset;
  openModal('modalDeposit');
}

function openWithdraw(asset) {
  if (!State.wallet) { toast('Connectez d\'abord votre portefeuille.', 'info'); return; }
  const a = ASSETS[asset];
  $('#withdrawSymbol').textContent = a.symbol;
  $('#withdrawHint').textContent = `Frais de retrait : ${State.fees.wFee.toString()}%. Le solde net sera envoyé sur votre portefeuille.`;
  $('#withdrawAmount').value = '';
  $('#withdrawError').textContent = '';
  $('#withdrawAmount').dataset.asset = asset;
  openModal('modalWithdraw');
}

async function doDeposit() {
  const asset = $('#depositAmount').dataset.asset;
  const val = $('#depositAmount').value.trim();
  $('#depositError').textContent = '';
  if (!val || Number(val) <= 0) { $('#depositError').textContent = 'Montant invalide.'; return; }
  if (!(await ensureSigned())) return;
  try {
    const core = State.contracts.core.connect(await getSigner());
    const amount = ethers.parseUnits(val, decFor(asset));
    let tx;
    if (asset === 'pol') {
      tx = await core.depositPol({ value: amount });
    } else {
      const token = asset === 'usdt' ? State.contracts.usdt : State.contracts.fta;
      const tokenSigned = token.connect(await getSigner());
      await ensureAllowance(tokenSigned, CFG.contracts.core, amount);
      tx = asset === 'usdt' ? await core.depositUsdt(amount) : await core.depositFta(amount);
    }
    showTxWait('Dépôt en cours...', `Confirmation de la transaction ${shortAddr(tx.hash)}...`);
    const receipt = await tx.wait();
    hideTxWait();
    if (receipt.status === 0) throw new Error('Transaction échouée (revert)');
    recordTx('deposit', tx.hash, ASSETS[asset].symbol, `${fmtNum(val)} ${ASSETS[asset].symbol}`, {});
    toast(`Dépôt de ${fmtNum(val)} ${ASSETS[asset].symbol} effectué !`, 'success');
    closeModal('modalDeposit');
    refreshAll();
  } catch (e) {
    hideTxWait();
    $('#depositError').textContent = decodeErr(e);
  }
}

async function doWithdraw() {
  const asset = $('#withdrawAmount').dataset.asset;
  const val = $('#withdrawAmount').value.trim();
  $('#withdrawError').textContent = '';
  if (!val || Number(val) <= 0) { $('#withdrawError').textContent = 'Montant invalide.'; return; }
  if (!(await ensureSigned())) return;
  try {
    const core = State.contracts.core.connect(await getSigner());
    const amount = ethers.parseUnits(val, decFor(asset));
    const tx = asset === 'pol' ? await core.withdrawPol(amount)
      : asset === 'usdt' ? await core.withdrawUsdt(amount)
      : await core.withdrawFta(amount);
    showTxWait('Retrait en cours...', `Confirmation de la transaction ${shortAddr(tx.hash)}...`);
    const receipt = await tx.wait();
    hideTxWait();
    if (receipt.status === 0) throw new Error('Transaction échouée (revert)');
    recordTx('withdraw', tx.hash, ASSETS[asset].symbol, `${fmtNum(val)} ${ASSETS[asset].symbol}`, {});
    toast(`Retrait de ${fmtNum(val)} ${ASSETS[asset].symbol} envoyé !`, 'success');
    closeModal('modalWithdraw');
    refreshAll();
  } catch (e) {
    hideTxWait();
    $('#withdrawError').textContent = decodeErr(e);
  }
}

async function ensureAllowance(token, spender, amount) {
  const owner = State.wallet;
  const allowance = await token.allowance(owner, spender);
  if (allowance >= amount) return;
  toast('Approbation du token en cours... (2e étape dans MetaMask)', 'info');
  showTxWait('Approbation en cours...', 'Autorisez le contrat à utiliser vos tokens.');
  try {
    // Sécurité : on approuve le MONTANT EXACT de l'opération (jamais MaxUint256).
    // Comme on sort plus tôt si allowance >= amount, définir l'allocation à `amount`
    // est toujours une AUGMENTATION (jamais une diminution) : compatible avec les
    // tokens non standards (USDT) qui refusent les baisses d'allocation.
    // Résultat : après l'achat, l'allocation résiduelle est nulle — si le contrat
    // était un jour compromis, il ne pourrait rien dépenser sans nouvelle permission.
    const tx = await token.approve(spender, amount);
    await tx.wait();
  } finally {
    hideTxWait();
  }
  toast('Token approuvé (montant exact).', 'success');
}

/* ═══════════════════════════════════════════════════════════════════
   ACHATS (machines & batteries)
   ═══════════════════════════════════════════════════════════════════ */

async function buyItem(kind, id, mode) {
  if (!(await ensureSigned())) return;
  const mine = State.contracts.mine.connect(await getSigner());
  const label = kind === 'machine' ? `Machine ${id + 1}` : `Batterie ${id + 1}`;
  try {
    let tx;
    if (kind === 'machine') {
      tx = mode === 'usdt' ? await mine.buyMachine(id) : await mine.buyMachineFTA(id);
    } else {
      tx = mode === 'usdt' ? await mine.buyBattery(id) : await mine.buyBatteryFTA(id);
    }
    showTxWait(`Achat en cours... (${label})`, `Confirmation de la transaction ${shortAddr(tx.hash)}...`);
    const receipt = await tx.wait();
    hideTxWait();
    if (receipt.status === 0) throw new Error('Transaction échouée (revert)');
    recordTx(kind === 'machine' ? 'buy_machine' : 'buy_battery', tx.hash,
      mode === 'usdt' ? 'USDT' : 'FTA', label, { id, mode });
    toast(`${label} achetée avec succès !`, 'success');
    refreshAll();
    if (kind === 'machine') loadMyMachines();
    else loadMyBatteries();
  } catch (e) {
    hideTxWait();
    toast(decodeErr(e), 'error');
  }
}

/* ═══════════════════════════════════════════════════════════════════
   PARRAINAGE
   ═══════════════════════════════════════════════════════════════════ */

async function openReferrerModal() {
  if (!State.wallet) { toast('Connectez d\'abord votre portefeuille.', 'info'); return; }
  // L'ID utilisateur (visible ici, dans la modale Parrain) sert à être parrainé par un autre utilisateur
  const idPart = State.myId ? `Votre ID : ${State.myId}. ` : '';
  $('#referrerCurrent').textContent = idPart + (State.myRef
    ? `Parrain actuel : ${shortAddr(State.myRef)}`
    : 'Parrain actuel : aucun. Vous pouvez enregistrer un parrain (opération unique).');
  $('#referrerId').value = '';
  $('#referrerError').textContent = '';
  openModal('modalReferrer');
}

async function saveReferrer() {
  const id = $('#referrerId').value.trim();
  $('#referrerError').textContent = '';
  if (!id || Number(id) < 1) { $('#referrerError').textContent = 'Saisissez un ID valide.'; return; }
  if (!(await ensureSigned())) return;
  try {
    const core = State.contracts.core.connect(await getSigner());
    const tx = await core.setReferrerById(BigInt(id));
    showTxWait('Enregistrement du parrain...', `Confirmation de la transaction ${shortAddr(tx.hash)}...`);
    const receipt = await tx.wait();
    hideTxWait();
    if (receipt.status === 0) throw new Error('Transaction échouée (revert)');
    recordTx('set_referrer', tx.hash, 'Parrain', `ID ${id}`, {});
    toast('Parrain enregistré !', 'success');
    closeModal('modalReferrer');
    refreshMyRef();
  } catch (e) {
    hideTxWait();
    $('#referrerError').textContent = decodeErr(e);
  }
}

/* ═══════════════════════════════════════════════════════════════════
   HISTORIQUE (base SQLite locale)
   ═══════════════════════════════════════════════════════════════════ */

function recordTx(type, txHash, asset, amount, details) {
  try {
    DB.run(
      'INSERT INTO transactions (user_id, type, tx_hash, asset, amount, status, details, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [State.user.id, type, txHash || null, asset || null,
       amount != null ? String(amount) : null, 'confirmed',
       details ? JSON.stringify(details) : null, Date.now()]
    );
    refreshDbStatus();
  } catch { /* l'historique ne bloque jamais l'action */ }
}

const TX_LABELS = {
  deposit: { ic: ICONS.deposit, label: 'Dépôt' },
  withdraw: { ic: ICONS.withdraw, label: 'Retrait' },
  swap: { ic: ICONS.repeat, label: 'Échange' },
  buy_machine: { ic: ICONS.cpu, label: 'Achat machine' },
  buy_battery: { ic: ICONS.battery, label: 'Achat batterie' },
  plug: { ic: ICONS.plug, label: 'Branchement' },
  claim: { ic: ICONS.gift, label: 'Réclamation' },
  set_referrer: { ic: ICONS.users, label: 'Parrainage' }
};

function loadHistory() {
  const body = $('#txBody');
  try {
    const rows = State.txFilter
      ? DB.all('SELECT * FROM transactions WHERE user_id = ? AND type = ? ORDER BY created_at DESC LIMIT 300', [State.user.id, State.txFilter])
      : DB.all('SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 300', [State.user.id]);
    if (!rows.length) {
      body.innerHTML = '<tr><td colspan="5" class="empty-hint">Aucune transaction pour le moment.</td></tr>';
      return;
    }
    body.innerHTML = rows.map(r => {
      const meta = TX_LABELS[r.type] || { ic: ICONS.file, label: r.type };
      const statusCls = { confirmed: 'status-confirmed', pending: 'status-pending', failed: 'status-failed' }[r.status] || 'status-confirmed';
      const statusTxt = { confirmed: 'Confirmée', pending: 'En attente', failed: 'Échouée' }[r.status] || r.status;
      const hashCell = r.tx_hash
        ? `<a class="hash" href="${CFG.polygon.explorer}/tx/${r.tx_hash}" target="_blank" rel="noopener">${shortAddr(r.tx_hash)} ↗</a>`
        : '<span class="hash">-</span>';
      return `<tr>
        <td>${fmtDate(r.created_at)}</td>
        <td>${meta.ic} ${meta.label}</td>
        <td>${r.amount ? r.amount : '-'}</td>
        <td><span class="status-pill ${statusCls}">${statusTxt}</span></td>
        <td>${hashCell}</td>
      </tr>`;
    }).join('');
  } catch (e) {
    body.innerHTML = `<tr><td colspan="5" class="empty-hint">Erreur : ${e.message}</td></tr>`;
  }
}

function loadRecent() {
  const list = $('#recentList');
  try {
    const rows = DB.all('SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 6', [State.user.id]);
    if (!rows.length) {
      list.innerHTML = '<p class="empty-hint">Aucune transaction pour le moment. Lancez vos premières opérations !</p>';
      return;
    }
    list.innerHTML = rows.map(r => {
      const meta = TX_LABELS[r.type] || { ic: ICONS.file, label: r.type };
      return `
        <div class="tx-item">
          <span class="tx-ic">${meta.ic}</span>
          <div class="tx-main">
            <strong>${meta.label}</strong>
            <small>${fmtDate(r.created_at)}${r.tx_hash ? ' · ' + shortAddr(r.tx_hash) : ''}</small>
          </div>
          <span class="tx-amt ${r.type === 'withdraw' || r.type === 'swap' ? 'neg' : 'pos'}">${r.amount || '-'}</span>
        </div>`;
    }).join('');
  } catch { /* silencieux */ }
}

/* ═══════════════════════════════════════════════════════════════════
   MODALE DE CONFIRMATION
   ═══════════════════════════════════════════════════════════════════ */

function openConfirm(title, text, cb) {
  $('#confirmTitle').textContent = title;
  $('#confirmText').textContent = text;
  State.confirmCb = cb;
  openModal('modalConfirm');
}

/* ═══════════════════════════════════════════════════════════════════
   GARDE-FOUS - portefeuille connecté & configuré
   ═══════════════════════════════════════════════════════════════════ */

async function ensureSigned() {
  if (!contractsReady()) {
    toast('Adresses des contrats non configurées (bloc CFG.contracts dans app.js).', 'error');
    return false;
  }
  if (!State.user) { toast('Connectez-vous d\'abord.', 'info'); return false; }
  if (!State.wallet) { toast('Connectez votre portefeuille MetaMask.', 'info'); return false; }
  if (State.user.address && State.wallet !== State.user.address) {
    toast('Le portefeuille connecté ne correspond pas à l\'adresse liée à votre compte.', 'error');
    return false;
  }
  if (!State.user.address) {
    toast('Liez d\'abord votre adresse Polygon à votre compte (bannière en haut).', 'info');
    return false;
  }
  try { await getSigner(); } catch (e) { toast(decodeErr(e), 'error'); return false; }
  return true;
}

/* ═══════════════════════════════════════════════════════════════════
   ÉVÉNEMENTS
   ═══════════════════════════════════════════════════════════════════ */

function wireEvents() {
  // Installation de l'application (PWA - Android)
  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const b = $('#btnInstall');
    if (b) b.classList.remove('hidden');
  });
  $('#btnInstall').addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    try { await deferredPrompt.userChoice; } catch { /* silencieux */ }
    deferredPrompt = null;
    $('#btnInstall').classList.add('hidden');
  });

  // Authentification
  $('#formLogin').addEventListener('submit', handleLogin);
  $('#formRegister').addEventListener('submit', handleRegister);
  $('#btnLogout').addEventListener('click', handleLogout);

  // Portefeuille
  // Change de compte dans MetaMask puis synchronise l'application (logique unique, plus de doublon)
  async function switchWalletAccount() {
    if (!window.ethereum) return;
    await window.ethereum.request({ method: 'wallet_requestPermissions', params: [{ eth_accounts: {} }] });
    const accs = await window.ethereum.request({ method: 'eth_requestAccounts' });
    if (accs && accs.length) {
      State.wallet = accs[0].toLowerCase();
      State.signer = null;
      onWalletChanged();
    }
  }

  $('#btnConnectWallet').addEventListener('click', () => {
    if (State.wallet) {
      openConfirm('Changer de portefeuille ?', 'Si vous changez de compte dans MetaMask, l\'application utilisera le nouveau portefeuille connecté.', async () => {
        try { await switchWalletAccount(); } catch (e) { toast(decodeErr(e), 'error'); }
      });
    } else {
      connectWallet();
    }
  });
  $('#btnLinkWallet').addEventListener('click', linkWallet);
  $('#btnSwitchWallet').addEventListener('click', () => {
    switchWalletAccount().catch(e => toast(decodeErr(e), 'error'));
  });

  // Base de données : export / import (.db portable)
  $('#btnExportDb').addEventListener('click', () => DB.exportFile());
  $('#btnImportDb').addEventListener('click', () => $('#fileImportDb').click());
  $('#fileImportDb').addEventListener('change', async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;
    openConfirm('Importer une base ?', 'La base actuelle (comptes et historique) sera remplacée par le contenu du fichier .db sélectionné. Continuer ?', async () => {
      try {
        toast('Import de la base en cours...', 'info');
        await DB.importFile(file);
        const st = DB.stats();
        $('#statUsers').textContent = fmtNum(st.users, 0);
        $('#statTxs').textContent = fmtNum(st.transactions, 0);
        refreshDbStatus();
        // Re-vérifie la session (l'utilisateur connecté doit exister dans la nouvelle base)
        const sess = DB.loadSession();
        State.user = null;
        DB.clearSession();
        $('#viewApp').classList.add('hidden');
        if (sess) {
          State.user = { id: sess.id, username: sess.username, address: sess.address, created_at: sess.created_at };
          DB.saveSession(State.user);
          showApp();
        } else {
          showAuth();
        }
        toast('Base importée avec succès !', 'success');
      } catch (err) {
        toast('Import impossible : ' + (err.message || err), 'error', 6000);
      }
    });
  });

  // Actions de l'accueil & du minage (les boutons redondants ont été supprimés)
  $('#btnRefresh').addEventListener('click', () => { refreshAll(); loadRecent(); toast('Données actualisées.', 'success'); });
  $('#btnClaimMining').addEventListener('click', claimRewards);
  $('#btnGoHistory').addEventListener('click', (e) => { e.preventDefault(); switchTab('history'); });
  $('#btnOpenReferrer').addEventListener('click', openReferrerModal);
  $('#btnSaveReferrer').addEventListener('click', saveReferrer);

  // Dépôts / retraits / achats / branchements (délégation sur les boutons data-*)
  document.addEventListener('click', (e) => {
    const dep = e.target.closest('[data-deposit]');
    if (dep) { openDeposit(dep.dataset.deposit); return; }
    const wd = e.target.closest('[data-withdraw]');
    if (wd) { openWithdraw(wd.dataset.withdraw); return; }
    const buy = e.target.closest('[data-buy]');
    if (buy) {
      const kind = buy.dataset.buy;
      const id = Number(buy.dataset.id);
      const mode = buy.dataset.mode;
      const label = kind === 'machine' ? `Machine ${id + 1}` : `Batterie ${id + 1}`;
      openConfirm(`Acheter ${label}`, `Confirmer l'achat de ${label} en ${mode.toUpperCase()} ?`, () => buyItem(kind, id, mode));
      return;
    }
    const plug = e.target.closest('[data-plug]');
    if (plug) { openPlugModal(Number(plug.dataset.plug)); }
  });

  // Modales dépôt / retrait
  $('#btnDeposit').addEventListener('click', doDeposit);
  $('#btnWithdraw').addEventListener('click', doWithdraw);

  // Swap
  $('#swapIn').addEventListener('input', updateSwapEstimate);
  $('#btnSwap').addEventListener('click', doSwap);
  $$('.swap-dir').forEach(b => b.addEventListener('click', () => {
    $$('.swap-dir').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    State.swapDir = b.dataset.dir;
    $('#swapInSymbol').textContent = State.swapDir === 'u2f' ? 'USDT' : 'FTA';
    $('#swapOutSymbol').textContent = State.swapDir === 'u2f' ? 'FTA' : 'USDT';
    $('#swapIn').value = '';
    $('#swapOut').value = '';
    updateSwapEstimate();
  }));

  // Historique
  $('#txFilter').addEventListener('change', (e) => { State.txFilter = e.target.value; loadHistory(); });
  $('#btnTxRefresh').addEventListener('click', loadHistory);

  // Confirmation
  $('#btnConfirmOk').addEventListener('click', () => {
    closeModal('modalConfirm');
    if (State.confirmCb) { const cb = State.confirmCb; State.confirmCb = null; cb(); }
  });
}

/* ─── Démarrage ─── */
init();
