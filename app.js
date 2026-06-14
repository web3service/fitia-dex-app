/**
 * FITIA PRO MINER — app.js v6
 * ==============================================================
   ═════════════════════════════════════════════════════════════ */
const CONFIG = {
  MINING:          "0xa70147A41F10e84D25A97997d7e2507096F86BAD",
  USDT:            "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
  FTA:             "0x5c418b12c7e9c2A8e9A71A68c6d9b319E7B1d1fd",
  CHAIN_ID:        137,
  WC_PROJECT_ID:   "2c10ee910a836551fbabbf7c8cc4542a",
  // ⬇⬇⬇ À REMPLACER avec tes clés Supabase ⬇⬇⬇
  SUPABASE_URL:    "https://zjnwawxwwfsyrrgbkpxm.supabase.co",
  SUPABASE_KEY:    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpqbndhd3h3d2ZzeXJyZ2JrcHhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0Njg4MTMsImV4cCI6MjA5NzA0NDgxM30.xskbUnOx9u38vZunZGq7ermqBpJJGwziJqrl60jeXtI",
  WHATSAPP_GROUP:   "https://chat.whatsapp.com/BDsvPCB6xp8H8X0YaRmPFP",
  WHATSAPP_CHANNEL: "https://whatsapp.com/channel/0029VbCQhI38PgsPLbBJdV1e"
};

/* ═════════════════════════════════════════════════════════════
   i18n (compact — all languages preserved)
   ═════════════════════════════════════════════════════════════ */
const i18n = {
en:{connect:"Connect",home:"Home",shop:"Shop",assets:"Wallet",swapNav:"Swap",historyNav:"History",
  refTitle:"👥 Referral System",refDesc:"Enter referrer's address.",bindRef:"BIND",
  power:"POWER",ftaSec:"Hashrate",pending:"PENDING",fta:"FTA",miningActive:"MINING ACTIVE",
  noMachine:"NO MACHINE",claim:"CLAIM",totalBal:"Total Balance",
  shopTitle:"⛏️ Shop",machines:"Machines",batteries:"Batteries",buy:"BUY",
  myAssets:"⚙️ Wallet & Assets",walletBal:"💰 Balances",
  plugMachine:"🔌 Plug in a machine",plugDesc:"Enter machine ID.",machineId:"ID (0,1...)",plug:"PLUG IN ⚡",
  activeMachines:"⛏️ Active",myMachines:"⛏️ My Machines",myBatteries:"🔋 My Batteries",
  active:"Active",expired:"Expired",inactive:"Inactive",available:"Available",
  plugged:"Plugged",notPlugged:"Not Plugged",timeRemaining:"Remaining",
  noMachines:"No machines",noBatteries:"No batteries",batteryLabel:"Battery",
  noActiveMachines:"No active machines",
  saveProfile:"💾 Save",invested:"Invested",earned:"Earned",txCount:"Tx",
  swapTitle:"💱 Swap",youPay:"You pay",balance:"Balance:",youReceive:"You receive",swap:"SWAP",
  currentRate:"1 FTA = ",usdtPerFta:" USDT",
  exchangeRate:"Rate",priceImpact:"Impact",swapFee:"Fee (4%)",
  minimumReceived:"Min Received",slippageTolerance:"Slippage",networkFee:"Network Fee",
  liquidityReserve:"Protocol Liquidity (FTA)",liquidityHint:"Backed by smart contract reserves on Polygon",
  totalTx:"Total",swaps:"Swaps",claims:"Claims",all:"All",
  noHistory:"No transactions yet.",noActivity:"No recent activity",
  viewOnPolygon:"View on Polygonscan",
  send:"Send",receive:"Receive",recipientAddr:"Recipient (0x...)",amount:"Amount",
  confirmSend:"CONFIRM SEND",receiveHint:"Send POL/USDT/FTA on Polygon.",tapToCopy:"Tap to copy",
  loading:"Loading...",connWallet:"Connecting...",linking:"Linking...",
  buyingMachine:"Buying Machine",approveUsdt:"Approving USDT...",approveFta:"Approving FTA...",
  confirming:"Confirming...",calcFta:"Calculating...",
  buyingBattery:"Buying Battery",pluggingIn:"Plugging in...",swapping:"Swapping...",
  claiming:"Claiming...",sending:"Sending...",
  machineBought:"Machine purchased!",batteryBought:"Battery purchased!",
  pluggedIn:"Machine plugged in! ⚡",swapSuccess:"Swap successful!",
  claimed:"Rewards claimed!",sentSuccess:"Sent successfully!",
  addrCopied:"Address copied!",refLinked:"Referrer linked!",profileUpdated:"Profile updated!",
  error:"Error",connFirst:"Connect first",invalidId:"Invalid ID",
  invalidAmount:"Invalid amount",invalidAddr:"Invalid address",
  wcIdMissing:"WalletConnect ID missing!",days:"Days",rig:"RIG",
  errRejected:"Transaction cancelled",errInsufficientFunds:"Insufficient balance",
  errNetwork:"Network error.",errTimeout:"Transaction timed out.",
  errContract:"Transaction failed.",errGeneric:"An error occurred.",
  errAlreadyPending:"Transaction pending.",errNonce:"Nonce error.",
  errLowLiquidity:"Liquidity too low. Swap USDT→FTA first.",
  errNoFtaLiquidity:"No FTA liquidity. Use USDT or swap USDT→FTA first.",
  errMaxFtaSell:"Max {max} FTA sellable. Swap USDT→FTA first.",
  errSwapRejected:"Swap rejected.",errApprovalFailed:"Approval failed.",
  useUsdtInstead:"Use USDT — always works.",supabaseOffline:"📡 Supabase not connected — using offline mode."},
fr:{connect:"Connecter",home:"Accueil",shop:"Boutique",assets:"Wallet",swapNav:"Swap",historyNav:"Historique",
  refTitle:"👥 Parrainage",refDesc:"Entrez l'adresse du parrain.",bindRef:"LIER",
  power:"PUISSANCE",ftaSec:"Hashrate",pending:"EN ATTENTE",fta:"FTA",miningActive:"MINAGE ACTIF",
  noMachine:"AUCUNE MACHINE",claim:"RÉCLAMER",totalBal:"Solde Total",
  shopTitle:"⛏️ Boutique",machines:"Machines",batteries:"Batteries",buy:"ACHETER",
  myAssets:"⚙️ Wallet & Actifs",walletBal:"💰 Soldes",
  plugMachine:"🔌 Brancher",plugDesc:"Entrez l'ID.",machineId:"ID (0,1...)",plug:"BRANCHER ⚡",
  activeMachines:"⛏️ Actives",myMachines:"⛏️ Mes Machines",myBatteries:"🔋 Mes Batteries",
  active:"Actif",expired:"Expiré",inactive:"Inactif",available:"Disponible",
  plugged:"Branché",notPlugged:"Non branché",timeRemaining:"Restant",
  noMachines:"Aucune machine",noBatteries:"Aucune batterie",batteryLabel:"Batterie",
  noActiveMachines:"Aucune machine active",
  saveProfile:"💾 Sauvegarder",invested:"Investi",earned:"Gagné",txCount:"Tx",
  swapTitle:"💱 Échange",youPay:"Vous payez",balance:"Solde:",youReceive:"Vous recevez",swap:"ÉCHANGER",
  currentRate:"1 FTA = ",usdtPerFta:" USDT",
  exchangeRate:"Taux",priceImpact:"Impact",swapFee:"Frais (4%)",
  minimumReceived:"Min reçu",slippageTolerance:"Slippage",networkFee:"Frais réseau",
  liquidityReserve:"Liquidité Protocole (FTA)",liquidityHint:"Garanti par smart contract Polygon",
  totalTx:"Total",swaps:"Swaps",claims:"Réclamations",all:"Tout",
  noHistory:"Aucune transaction.",noActivity:"Aucune activité",
  viewOnPolygon:"Voir sur Polygonscan",
  send:"Envoyer",receive:"Recevoir",recipientAddr:"Destinataire (0x...)",amount:"Montant",
  confirmSend:"CONFIRMER",receiveHint:"POL/USDT/FTA sur Polygon.",tapToCopy:"Appuyez pour copier",
  loading:"Chargement...",connWallet:"Connexion...",linking:"Liaison...",
  buyingMachine:"Achat Machine",approveUsdt:"Approbation USDT...",approveFta:"Approbation FTA...",
  confirming:"Confirmation...",calcFta:"Calcul...",
  buyingBattery:"Achat Batterie",pluggingIn:"Branchement...",swapping:"Swap...",
  claiming:"Claim...",sending:"Envoi...",
  machineBought:"Machine achetée!",batteryBought:"Batterie achetée!",
  pluggedIn:"Machine branchée! ⚡",swapSuccess:"Échange réussi!",
  claimed:"Gains réclamés!",sentSuccess:"Envoi réussi!",
  addrCopied:"Adresse copiée!",refLinked:"Parrain lié!",profileUpdated:"Profil mis à jour!",
  error:"Erreur",connFirst:"Connectez-vous",invalidId:"ID invalide",
  invalidAmount:"Montant invalide",invalidAddr:"Adresse invalide",wcIdMissing:"ID WalletConnect manquant!",
  days:"Jours",rig:"RIG",errRejected:"Transaction annulée",errInsufficientFunds:"Solde insuffisant",
  errNetwork:"Erreur réseau.",errTimeout:"Délai expiré.",errContract:"Transaction échouée.",
  errGeneric:"Une erreur est survenue.",errAlreadyPending:"Transaction en cours.",
  errNonce:"Erreur de nonce.",errLowLiquidity:"Liquidité trop faible.",
  errNoFtaLiquidity:"Pas de liquidité FTA.",errMaxFtaSell:"Max {max} FTA.",
  errSwapRejected:"Échange rejeté.",errApprovalFailed:"Approbation échouée.",
  useUsdtInstead:"Utilisez USDT.",supabaseOffline:"📡 Supabase non connecté — mode hors ligne."},
de:{connect:"Verbinden",home:"Home",shop:"Shop",assets:"Wallet",swapNav:"Swap",historyNav:"Verlauf",
  totalBal:"Gesamt",shopTitle:"⛏️ Shop",swapTitle:"💱 Tausch",myAssets:"⚙️ Wallet",
  loading:"Laden...",connWallet:"Verbindung...",error:"Fehler",connFirst:"Verbinden",
  noHistory:"Keine Transaktionen.",all:"Alle"},
zh:{connect:"连接",home:"首页",shop:"商店",assets:"钱包",swapNav:"兑换",historyNav:"历史",
  totalBal:"总余额",shopTitle:"⛏️ 商店",swapTitle:"💱 兑换",myAssets:"⚙️ 钱包",
  loading:"加载中...",connWallet:"连接中...",error:"错误",connFirst:"请连接",
  noHistory:"暂无记录。",all:"全部"},
sg:{connect:"Connect",home:"Home",shop:"Shop",assets:"Wallet",swapNav:"Swap",historyNav:"History",
  totalBal:"Balance",shopTitle:"⛏️ Shop",swapTitle:"💱 Swap",myAssets:"⚙️ Wallet",
  loading:"Loading...",connWallet:"Connecting...",error:"Error",connFirst:"Connect",
  noHistory:"No transactions.",all:"All"}
};

/* ═════════════════════════════════════════════════════════════
   CHAT INTENTS + RESPONSES (compact)
   ═════════════════════════════════════════════════════════════ */
const CHAT_INTENTS = {
  what_is_fitia:{weight:5,keywords:{all:['what is fitia','c quoi fitia','fitia pro','about fitia','介绍','fitia是什么']}},
  four_visions:{weight:5,keywords:{all:['4 vision','four vision','fitia mining','fitia finance','fitia shop','fitia store','四大愿景']}},
  how_mining_works:{weight:4,keywords:{all:['how mining works','explain mining','mine','mining','minage','挖矿','how to mine','comment miner']}},
  how_swap_works:{weight:4,keywords:{all:['swap','exchange','échanger','兑换','how to swap','swap fta','swap usdt']}},
  tokenomics:{weight:4,keywords:{all:['tokenomics','fta token','what is fta','fta price','token supply']}},
  liquidity_explanation:{weight:4,keywords:{all:['liquidity','liquidité','liquidity pool','protocol liquidity','netftasold']}},
  beginner_guide:{weight:5,keywords:{all:['beginner','débutant','新手','how to start','getting started','first time','premier pas']}},
  what_is_crypto:{weight:4,keywords:{all:['what is crypto','blockchain','什么是加密','qu est ce que la crypto']}},
  wallet_setup:{weight:4,keywords:{all:['wallet','metamask','钱包','how to connect','create wallet']}},
  investment_advice:{weight:3,keywords:{all:['invest','roi','profit','strategy','收益','gagner plus']}},
  security:{weight:4,keywords:{all:['security','safe','sécurité','安全','scam','is it safe']}},
  fitia_revolution:{weight:4,keywords:{all:['revolution','révolution','vision','mission','objective','革命']}},
  deposit_funds:{weight:3,keywords:{all:['deposit','add funds','充值','how to deposit']}},
  withdraw_earnings:{weight:3,keywords:{all:['withdraw','cash out','提现','how to withdraw']}},
  history_related:{weight:3,keywords:{all:['history','historique','历史','transactions','leaderboard','classement']}},
  greeting:{weight:1,keywords:{all:['hello','hi','hey','bonjour','salut','hallo','你好']}},
  thanks:{weight:1,keywords:{all:['thanks','merci','danke','谢谢']}},
  help:{weight:2,keywords:{all:['help','aide','hilfe','帮助']}},
  fta_problems:{weight:4,keywords:{all:['fta not working','fta rejected','cannot buy','cannot swap','refuse','marche pas']}}
};

const CHAT_RESPONSES = {
  what_is_fitia:{en:`🪙 *Fitia Pro* — Revolutionary Web3 ecosystem on Polygon.\n\n✨ 4 Visions: ① Fitia Mining ② Fitia Finance ③ Fitia Shop ④ Fitia Store\n\n🔒 Smart contracts on Polygon Mainnet — low fees, full transparency.`},
  four_visions:{en:`🏗️ *4 Pillars*\n⛏️ Mining — NFT machines, earn FTA every second\n💱 Finance — USDT↔FTA swaps via bonding curve\n🛒 Shop — Digital marketplace\n🏪 Store — E-commerce with FTA payments\n🌐 A self-sustaining circular economy.`},
  how_mining_works:{en:`⛏️ 1️⃣ Buy Machine (Shop) 2️⃣ Buy Battery 3️⃣ Plug In (Wallet) 4️⃣ Earn FTA/sec 5️⃣ Claim\n⚡ Higher tier = more power | 🔋 Longer battery = better value\n💡 Use USDT — always works!`},
  how_swap_works:{en:`💱 USDT→FTA adds liquidity. FTA→USDT needs liquidity > 0. Bonding curve adjusts prices automatically.`},
  beginner_guide:{en:`🚀 1. MetaMask 2. Buy POL+USDT (Polygon!) 3. Connect 4. Buy MK-I 5. Battery+Plug In 6. CLAIM! — That's it!`},
  security:{en:`🛡️ Smart contracts on Polygon. Non-custodial — your keys, your crypto. NEVER share seed phrase.`},
  liquidity_explanation:{en:`💧 Protocol Liquidity shows FTA in reserves. 🟢 Healthy 🟡 Low 🔴 Zero. Swap USDT→FTA to build it.`},
  history_related:{en:`📋 History tab shows all your transactions — swaps, purchases, claims. Filter by type. Each tx links to Polygonscan.`},
  default:{en:`🤔 I'm the Fitia Assistant — ask me about: Mining, Swaps, 4 Visions, Getting Started, Security, or anything Fitia Pro!`}
};

/* ═════════════════════════════════════════════════════════════
   ABIs
   ═════════════════════════════════════════════════════════════ */
const MINING_ABI = [
  "function getMachineCount() view returns (uint256)",
  "function getBatteryCount() view returns (uint256)",
  "function machineTypes(uint256) view returns (uint256 price, uint256 power)",
  "function batteryTypes(uint256) view returns (uint256 price, uint256 duration)",
  "function getActivePower(address) view returns (uint256)",
  "function getCurrentRate() view returns (uint256)",
  "function getFtaCostForUsdtSell(uint256) view returns (uint256)",
  "function difficultyMultiplier() view returns (uint256)",
  "function netFtaSold() view returns (uint256)",
  "function buyMachine(uint256 typeId)",
  "function buyMachineWithFTA(uint256 typeId)",
  "function buyBattery(uint256 typeId)",
  "function buyBatteryWithFTA(uint256 typeId)",
  "function plugInMachine(uint256 machineIndex, uint256 batteryTypeId)",
  "function claimRewards()",
  "function setReferrer(address)",
  "function swapUsdtForFta(uint256 amount)",
  "function swapFtaForUsdt(uint256 amount)"
];
const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function approve(address, uint256) returns (bool)",
  "function allowance(address, address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)"
];
const SWAP_FEE_RATE = 0.04;
const SLIPPAGE = 0.005;

/* ═════════════════════════════════════════════════════════════
   SUPABASE CLIENT (lightweight — no SDK needed)
   ═════════════════════════════════════════════════════════════ */
class SupabaseClient {
  constructor(url, key) {
    this.url = url.replace(/\/$/, '');
    this.key = key;
    this.headers = {
      'apikey': key,
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json'
    };
  }

  async _fetch(method, path, body = null) {
    const opts = { method, headers: { ...this.headers } };
    if (body) opts.body = JSON.stringify(body);

    // For GET with query string
    let url = `${this.url}/rest/v1/${path}`;
    if (method === 'GET' && body && body.query) {
      const params = new URLSearchParams(body.query).toString();
      url += '?' + params;
      delete opts.body;
    }
    if (method === 'GET' && body && body.select) {
      const params = new URLSearchParams({ select: body.select });
      if (body.order) params.append('order', body.order);
      if (body.limit) params.append('limit', body.limit);
      if (body.offset) params.append('offset', body.offset);
      if (body.filter) {
        for (const [col, val] of Object.entries(body.filter)) {
          params.append(col, `eq.${val}`);
        }
      }
      url += '?' + params.toString();
      delete opts.body;
    }

    try {
      const res = await fetch(url, opts);
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Supabase ${res.status}: ${errText}`);
      }
      return res.status === 204 ? null : await res.json();
    } catch (e) {
      console.warn('[Supabase]', e.message);
      return null;
    }
  }

  // ── Users ──
  async getUser(walletAddress) {
    const addr = walletAddress.toLowerCase();
    const data = await this._fetch('GET', 'users', {
      select: '*',
      filter: { wallet_address: addr },
      limit: 1
    });
    return data && data.length ? data[0] : null;
  }

  async createUser(walletAddress, username, email) {
    const addr = walletAddress.toLowerCase();
    const existing = await this.getUser(addr);
    if (existing) return existing;
    const data = await this._fetch('POST', 'users', {
      wallet_address: addr,
      username: username || null,
      email: email || null
    });
    return data;
  }

  async updateUser(walletAddress, updates) {
    const addr = walletAddress.toLowerCase();
    // Supabase REST PATCH requires filtering via query string
    const qs = `wallet_address=eq.${encodeURIComponent(addr)}`;
    const url = `${this.url}/rest/v1/users?${qs}`;
    try {
      const res = await fetch(url, {
        method: 'PATCH',
        headers: this.headers,
        body: JSON.stringify(updates)
      });
      return res.ok;
    } catch (e) {
      console.warn('[Supabase] updateUser:', e.message);
      return false;
    }
  }

  async getAllUsers(limit = 100) {
    return await this._fetch('GET', 'users', {
      select: 'wallet_address,username,level,total_earned,total_invested,machines_count',
      order: 'total_earned.desc',
      limit
    });
  }

  // ── Transactions ──
  async getTransactions(walletAddress, limit = 50, offset = 0, typeFilter = null) {
    const addr = walletAddress.toLowerCase();
    const params = {
      select: '*',
      filter: { wallet_address: addr },
      order: 'created_at.desc',
      limit,
      offset
    };
    if (typeFilter) params.filter.tx_type = typeFilter;
    return await this._fetch('GET', 'transactions', params) || [];
  }

  async createTransaction(tx) {
    const data = await this._fetch('POST', 'transactions', {
      wallet_address: (tx.walletAddress || '').toLowerCase(),
      tx_type: tx.type,
      token_from: tx.tokenFrom || null,
      token_to: tx.tokenTo || null,
      amount_from: tx.amountFrom || null,
      amount_to: tx.amountTo || null,
      tx_hash: tx.txHash || null,
      status: tx.status || 'pending',
      metadata: tx.metadata ? JSON.stringify(tx.metadata) : null
    });
    return data;
  }

  async updateTransactionStatus(txHash, status) {
    const qs = `tx_hash=eq.${encodeURIComponent(txHash)}`;
    const url = `${this.url}/rest/v1/transactions?${qs}`;
    try {
      const res = await fetch(url, {
        method: 'PATCH',
        headers: this.headers,
        body: JSON.stringify({ status })
      });
      return res.ok;
    } catch (e) { return false; }
  }

  // ── Activity Log ──
  async logActivity(walletAddress, action, details) {
    await this._fetch('POST', 'activity_log', {
      wallet_address: walletAddress.toLowerCase(),
      action,
      details: details || null
    });
  }

  async getActivityLog(walletAddress, limit = 20) {
    const addr = walletAddress.toLowerCase();
    return await this._fetch('GET', 'activity_log', {
      select: '*',
      filter: { wallet_address: addr },
      order: 'created_at.desc',
      limit
    }) || [];
  }

  // ── Leaderboard ──
  async getLeaderboard(limit = 20) {
    return await this._fetch('GET', 'users', {
      select: 'wallet_address,username,level,total_earned,total_invested,machines_count',
      order: 'total_earned.desc',
      limit
    }) || [];
  }
}

/* ═════════════════════════════════════════════════════════════
   APPLICATION
   ═════════════════════════════════════════════════════════════ */
class Application {
  constructor() {
    this.provider = null; this.signer = null; this.contracts = {}; this.user = null;
    this.payMode = 'USDT'; this.shopViewMode = 'machines'; this.swapDirection = 'USDT_TO_FTA';
    this.ftaDecimals = 18; this.usdtDecimals = 6;
    this.currentDifficulty = 1n; this.currentRealPower = 0; this.pendingBalance = 0; this.miningTimer = null;
    this.STORAGE_CLAIM = "fitia_claim_v6";
    this.STORAGE_MACHINES = "fitia_machines_v3";
    this.STORAGE_BATTERIES = "fitia_batteries_v3";
    this.shopMachinesData = []; this.shopBatteriesData = []; this.isLoadingShop = false;
    this.polPriceUsd = 0; this.ftaPriceUsd = 0;
    this.userMachines = []; this.userBatteries = {}; this.userLastClaimTime = 0; this.batteryTypeDurations = {};
    this.vizContext = null; this.vizBars = []; this.sendTokenSymbol = 'POL';
    this.chatInitialized = false; this.chatHistory = [];
    this.netFtaSold = 0n;

    // Supabase
    this.db = null;
    this.dbOnline = false;
    this.profileData = null;

    // History
    this.historyFilter = 'all';
    this.historyData = [];
    this.historyStats = null;
    this.activityData = [];
    this.leaderboardData = [];

    // Local fallback
    this.localTxLog = JSON.parse(localStorage.getItem('fitia_tx_log_v2') || '[]');

    const savedLang = localStorage.getItem('fitia_lang');
    this.currentLang = savedLang && i18n[savedLang] ? savedLang : 'en';
  }

  /* ── Helpers ──────────────────────────────────────────────── */
  t(key) { return i18n[this.currentLang]?.[key] || i18n['en'][key] || key; }
  formatUsd(v) { return '$' + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  formatHashrate(h) { if (h <= 0) return '0 H/s'; const u = ['H/s', 'KH/s', 'MH/s', 'GH/s', 'TH/s', 'PH/s']; let v = h, i = 0; while (v >= 1000 && i < u.length - 1) { v /= 1000; i++; } return v.toFixed(2) + ' ' + u[i]; }
  formatTimeRemaining(s) { if (s <= 0) return this.t('expired'); const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60); if (d > 1) return `${d}d ${h}h`; if (d === 1) return `1d ${h}h`; if (h > 0) return `${h}h ${m}m`; return `${m}m`; }
  getBatteryDuration(id) { if (this.batteryTypeDurations[id] !== undefined) return this.batteryTypeDurations[id]; return { 0: 3, 1: 7, 2: 15, 3: 30, 4: 90, 5: 180, 6: 270, 7: 365 }[id] || 30; }
  _loadLocalAssets() { try { this.userMachines = JSON.parse(localStorage.getItem(this.STORAGE_MACHINES)) || []; } catch (e) { this.userMachines = []; } try { this.userBatteries = JSON.parse(localStorage.getItem(this.STORAGE_BATTERIES)) || {}; } catch (e) { this.userBatteries = {}; } try { this.userLastClaimTime = parseInt(localStorage.getItem(this.STORAGE_CLAIM)) || Math.floor(Date.now() / 1000); } catch (e) { this.userLastClaimTime = Math.floor(Date.now() / 1000); } }
  _saveLocalAssets() { localStorage.setItem(this.STORAGE_MACHINES, JSON.stringify(this.userMachines)); localStorage.setItem(this.STORAGE_BATTERIES, JSON.stringify(this.userBatteries)); localStorage.setItem(this.STORAGE_CLAIM, String(this.userLastClaimTime || Math.floor(Date.now() / 1000))); }

  _logLocalTx(tx) {
    this.localTxLog.unshift({ ...tx, timestamp: Date.now() });
    if (this.localTxLog.length > 300) this.localTxLog.length = 300;
    localStorage.setItem('fitia_tx_log_v2', JSON.stringify(this.localTxLog));
  }

  async _recordTx(type, tokenFrom, tokenTo, amountFrom, amountTo, txHash, metadata) {
    this._logLocalTx({ type, tokenFrom, tokenTo, amountFrom, amountTo, txHash, metadata });
    if (this.dbOnline) {
      try {
        await this.db.createTransaction({ walletAddress: this.user, type, tokenFrom, tokenTo, amountFrom, amountTo, txHash, status: txHash ? 'pending' : 'confirmed', metadata });
      } catch (e) { /* ignore */ }
    }
  }

  async _logActivity(action, details) {
    if (this.dbOnline) {
      try { await this.db.logActivity(this.user, action, details); } catch (e) { /* ignore */ }
    }
  }

  // ── Supabase Init ────────────────────────────────────────────
  async initSupabase() {
    if (!CONFIG.SUPABASE_URL || CONFIG.SUPABASE_URL.includes('xxxxxxxxxxxx')) {
      console.log('[Supabase] Not configured — using offline mode');
      return;
    }
    try {
      this.db = new SupabaseClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
      // Quick health check
      const test = await this.db._fetch('GET', 'users', { select: 'wallet_address', limit: 1 });
      if (test !== null) {
        this.dbOnline = true;
        console.log('[Supabase] Connected successfully');
      } else {
        console.log('[Supabase] Connection failed — using offline mode');
      }
    } catch (e) {
      console.log('[Supabase] Error — using offline mode:', e.message);
    }
  }

  /* ── Language ──────────────────────────────────────────────── */
  setLanguage(lang) { if (!i18n[lang]) return; this.currentLang = lang; localStorage.setItem('fitia_lang', lang); const f = { en: '🇬🇧', fr: '🇫🇷', de: '🇩🇪', zh: '🇨🇳', sg: '🇸🇬' }; document.getElementById('lang-btn-display').innerText = `${f[lang]} ${lang.toUpperCase()}`; this.applyTranslations(); this.renderShop(); }
  applyTranslations() {
    const st = (s, k) => { const e = document.querySelector(s); if (e) e.innerText = this.t(k); };
    st('#btn-connect', 'connect'); st('.total-balance-card small', 'totalBal');
    st('.liquidity-reserve-box .liquidity-label span:last-child', 'liquidityReserve');
    st('.liquidity-info-hint', 'liquidityHint');
    document.querySelectorAll('.nav-item span').forEach((s, i) => s.innerText = this.t(['home', 'shop', 'assets', 'swapNav', 'historyNav'][i]));
  }
  async init() { this.setLanguage(this.currentLang); await this.initSupabase(); }

  /* ── Prices ────────────────────────────────────────────────── */
  async fetchMarketPrices() {
    this.polPriceUsd = 0;
    try { const r = await fetch('https://api.dexscreener.com/latest/dex/tokens/0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0'); const d = await r.json(); if (d.pairs?.length) this.polPriceUsd = parseFloat(d.pairs[0].priceUsd) || 0; } catch (e) { }
    if (!this.polPriceUsd) { try { const r = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd'); const d = await r.json(); this.polPriceUsd = d['matic-network']?.usd || 0; } catch (e2) { } }
    if (!this.polPriceUsd) this.polPriceUsd = 0.70;
  }

  /* ── Connect ───────────────────────────────────────────────── */
  async connect() {
    if (window.ethereum) {
      this.setLoader(true, this.t('connWallet'));
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        this.provider = new ethers.BrowserProvider(window.ethereum);
        this.signer = await this.provider.getSigner();
        this.user = await this.signer.getAddress();
        const n = await this.provider.getNetwork();
        if (Number(n.chainId) !== CONFIG.CHAIN_ID) await this.switchNetwork();
        await this.initContracts();
        window.ethereum.on('accountsChanged', () => window.location.reload());
        window.ethereum.on('chainChanged', () => window.location.reload());
      } catch (e) { this.showError(e); } finally { this.setLoader(false); }
    } else if (typeof EthereumProvider !== 'undefined' && CONFIG.WC_PROJECT_ID && !CONFIG.WC_PROJECT_ID.includes("...")) {
      this.setLoader(true, this.t('connWallet'));
      try {
        const wc = await EthereumProvider.init({ projectId: CONFIG.WC_PROJECT_ID, chains: [CONFIG.CHAIN_ID], showQrModal: true, methods: ['eth_sendTransaction', 'personal_sign'], metadata: { name: 'FITIA PRO MINER', description: 'Mining DApp', url: window.location.origin, icons: [window.location.origin + '/logo.png'] } });
        await wc.enable(); this.provider = new ethers.BrowserProvider(wc); this.signer = await this.provider.getSigner();
        this.user = await this.signer.getAddress(); await this.initContracts();
        wc.on("disconnect", () => window.location.reload());
      } catch (e) { this.showError(e); } finally { this.setLoader(false); }
    } else { this.showToast(CONFIG.WC_PROJECT_ID?.includes("...") ? this.t('wcIdMissing') : "Please install MetaMask.", true); }
  }

  async initContracts() {
    this.contracts.usdt = new ethers.Contract(CONFIG.USDT, ERC20_ABI, this.signer);
    this.contracts.fta = new ethers.Contract(CONFIG.FTA, ERC20_ABI, this.signer);
    this.contracts.mining = new ethers.Contract(CONFIG.MINING, MINING_ABI, this.signer);
    try { this.ftaDecimals = Number(await this.contracts.fta.decimals()); } catch (e) { this.ftaDecimals = 18; }
    try { this.usdtDecimals = Number(await this.contracts.usdt.decimals()); } catch (e) { this.usdtDecimals = 6; }
    document.getElementById('btn-connect').classList.add('hidden');
    document.getElementById('wallet-status').classList.remove('hidden');
    document.getElementById('addr-display').innerText = this.user.slice(0, 6) + "..." + this.user.slice(-4);
    this._loadLocalAssets();
    if (!localStorage.getItem(this.STORAGE_CLAIM)) { this.userLastClaimTime = Math.floor(Date.now() / 1000); this._saveLocalAssets(); }
    try { const lp = JSON.parse(localStorage.getItem('fitia_profile')); if (lp) this.profileData = lp; } catch (e) { }
    await this.fetchMarketPrices(); await this.cacheBatteryDurations(); await this.updateData();
    setInterval(() => this.updateData(), 15000);
    this.initVisualizer(); window.addEventListener('resize', () => this.resizeCanvas());
    // Init Supabase and sync
    setTimeout(() => this.syncProfile(), 500);
    setTimeout(() => this.refreshHistory(), 2000);
    setInterval(() => this.refreshHistory(), 60000);
  }

  async switchNetwork() { try { await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x89' }] }); } catch (e) { if (e.code === 4902) { await window.ethereum.request({ method: 'wallet_addEthereumChain', params: [{ chainId: '0x89', chainName: 'Polygon Mainnet', nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 }, rpcUrls: ['https://polygon-rpc.com/'], blockExplorerUrls: ['https://polygonscan.com/'] }] }); } } }
  async cacheBatteryDurations() { try { const c = Number(await this.contracts.mining.getBatteryCount()); for (let i = 0; i < c; i++) { try { const b = await this.contracts.mining.batteryTypes(i); this.batteryTypeDurations[i] = Number(b.duration) / 86400; } catch (e) { } } } catch (e) { } }

  // ── Supabase Profile Sync ────────────────────────────────────
  async syncProfile() {
    // ⚡ ALWAYS show wallet info first (even without Supabase)
    this._ensureProfileVisible();

    // Then try Supabase for richer profile
    if (!this.dbOnline || !this.user) return;
    try {
      let user = await this.db.getUser(this.user);
      if (!user) {
        user = await this.db.createUser(this.user, null, null);
        await this._logActivity('register', 'New user registered via Supabase');
      } else {
        await this.db.updateUser(this.user, { last_login: new Date().toISOString() });
        await this._logActivity('login', 'User logged in');
      }
      this.profileData = user;
      this.updateProfileUI();
    } catch (e) { console.warn('syncProfile:', e.message); }
  }

  // ⚡ Always render basic profile from wallet + localStorage
  _ensureProfileVisible() {
    if (!this.user) return;
    // Build minimal profile from local data
    const localProfile = this.profileData || {};
    try {
      const lp = JSON.parse(localStorage.getItem('fitia_profile'));
      if (lp) Object.assign(localProfile, lp);
    } catch (e) {}
    const p = {
      wallet_address: this.user,
      username: localProfile.username || null,
      email: localProfile.email || null,
      level: localProfile.level || 0,
      total_invested: localProfile.total_invested || 0,
      total_earned: localProfile.total_earned || 0,
      machines_count: this.userMachines ? this.userMachines.length : 0
    };
    this.profileData = p;
    this.updateProfileUI();
  }

  updateProfileUI() {
    const p = this.profileData;
    if (!p && !this.user) return; // nothing to show

    const addr = this.user || (p && p.wallet_address) || '';
    const username = (p && p.username) || '';
    const level = (p && p.level) || 0;
    const invested = Number((p && p.total_invested) || 0);
    const earned = Number((p && p.total_earned) || 0);
    const machines = (p && p.machines_count) || this.userMachines.length || 0;
    const txs = this.historyStats?.total || this.localTxLog.length || 0;

    // Update DOM safely
    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val; };
    const showEl = (id) => { const el = document.getElementById(id); if (el) el.style.display = ''; };

    setEl('profile-name', username || 'Miner');
    setEl('profile-level', `Level ${level}`);
    setEl('profile-addr', addr ? addr.slice(0, 8) + '...' : '');
    setEl('ps-invested', this.formatUsd(invested));
    setEl('ps-earned', this.formatUsd(earned));
    setEl('ps-machines', String(machines));
    setEl('ps-txs', String(txs));
    // Show edit button and update avatar
    try { document.getElementById('btn-profile-edit').style.display = 'flex'; } catch (e) {}
    try { document.getElementById('profile-avatar').innerText = username ? '🔷' : '👤'; } catch (e) {}
  }

  toggleProfileEdit() {
    const form = document.getElementById('profile-edit-form');
    if (!form) return;
    form.classList.toggle('hidden');
    if (!form.classList.contains('hidden')) {
      document.getElementById('edit-username').value = this.profileData?.username || '';
      document.getElementById('edit-email').value = this.profileData?.email || '';
    }
  }

  async saveProfile() {
    const username = document.getElementById('edit-username').value.trim();
    const email = document.getElementById('edit-email').value.trim();
    if (!username) return this.showToast('Username required', true);

    if (this.dbOnline) {
      await this.db.updateUser(this.user, { username, email });
      const updated = await this.db.getUser(this.user);
      if (updated) this.profileData = updated;
    } else {
      this.profileData = { ...(this.profileData || {}), username, email };
      localStorage.setItem('fitia_profile', JSON.stringify({ username, email }));
    }
    this.updateProfileUI();
    this.showToast(this.t('profileUpdated'));
    document.getElementById('profile-edit-form').classList.add('hidden');
  }

  /* ═══════════ DATA REFRESH ══════════════════════════════════ */
  async updateData() {
    if (!this.user) return;
    try {
      const rawPower = await this.contracts.mining.getActivePower(this.user); this.currentRealPower = Number(rawPower);
      try { this.currentDifficulty = BigInt(await this.contracts.mining.difficultyMultiplier()); } catch (e) { }
      try { this.netFtaSold = BigInt(await this.contracts.mining.netFtaSold()); } catch (e) { }

      const now = Math.floor(Date.now() / 1000), elapsed = now - this.userLastClaimTime;
      if (this.currentRealPower > 0 && elapsed > 0) {
        const rps = (this.currentRealPower * Number(this.currentDifficulty)) / 1e18; this.pendingBalance = rps * elapsed;
        document.getElementById('val-pending').innerText = this.pendingBalance.toFixed(5);
        document.getElementById('viz-status').innerText = this.t('miningActive'); document.getElementById('viz-status').style.color = "var(--primary)";
      } else { this.pendingBalance = 0; document.getElementById('val-pending').innerText = "0.00000"; document.getElementById('viz-status').innerText = this.t('noMachine'); document.getElementById('viz-status').style.color = "#666"; }
      this.updateVisualizerIntensity(this.currentRealPower);
      if (this.currentRealPower > 0) { if (!this.miningTimer) this.startMiningCounter(); } else { this.stopMiningCounter(); }
      document.getElementById('val-power').innerText = this.formatHashrate(this.currentRealPower);

      const polBal = await this.provider.getBalance(this.user);
      const usdtBal = await this.contracts.usdt.balanceOf(this.user);
      const ftaBal = await this.contracts.fta.balanceOf(this.user);
      const pB = parseFloat(ethers.formatUnits(polBal, 18)), uB = parseFloat(ethers.formatUnits(usdtBal, this.usdtDecimals)), fB = parseFloat(ethers.formatUnits(ftaBal, this.ftaDecimals));
      document.getElementById('bal-pol-2').innerText = pB.toFixed(4); document.getElementById('bal-usdt-2').innerText = uB.toFixed(2); document.getElementById('bal-fta-2').innerText = fB.toFixed(4);
      const rate = await this.contracts.mining.getCurrentRate(); this.ftaPriceUsd = parseFloat(ethers.formatUnits(rate, this.ftaDecimals));
      document.getElementById('price-pol').innerText = this.formatUsd(this.polPriceUsd); document.getElementById('price-usdt').innerText = this.formatUsd(1); document.getElementById('price-fta').innerText = this.formatUsd(this.ftaPriceUsd);
      document.getElementById('bal-pol-2-usd').innerText = '≈ ' + this.formatUsd(pB * this.polPriceUsd); document.getElementById('bal-usdt-2-usd').innerText = '≈ ' + this.formatUsd(uB); document.getElementById('bal-fta-2-usd').innerText = '≈ ' + this.formatUsd(fB * this.ftaPriceUsd);
      document.getElementById('val-total-usd').innerText = this.formatUsd(pB * this.polPriceUsd + uB + fB * this.ftaPriceUsd);
      document.getElementById('swap-rate').innerText = this.t('currentRate') + this.ftaPriceUsd.toFixed(6) + this.t('usdtPerFta');

      const nfsEl = document.getElementById('net-fta-sold-display');
      if (nfsEl) { const nfsHuman = parseFloat(ethers.formatUnits(this.netFtaSold, this.ftaDecimals)); nfsEl.innerText = nfsHuman.toFixed(4) + ' FTA'; nfsEl.className = 'liquidity-value'; if (this.netFtaSold === 0n) nfsEl.classList.add('none'); else if (nfsHuman < 100) nfsEl.classList.add('low'); else nfsEl.classList.add('high'); }

      const fromDec = this.swapDirection === 'USDT_TO_FTA' ? this.usdtDecimals : this.ftaDecimals, toDec = this.swapDirection === 'USDT_TO_FTA' ? this.ftaDecimals : this.usdtDecimals;
      document.getElementById('swap-bal-from').innerText = parseFloat(ethers.formatUnits(this.swapDirection === 'USDT_TO_FTA' ? usdtBal : ftaBal, fromDec)).toFixed(4);
      document.getElementById('swap-bal-to').innerText = parseFloat(ethers.formatUnits(this.swapDirection === 'USDT_TO_FTA' ? ftaBal : usdtBal, toDec)).toFixed(4);

      await this.renderShop(); this.renderActiveMachines(); this.renderUserMachines(); this.renderUserBatteries();
      if (document.getElementById('swap-from-in').value) this.calcSwap();
    } catch (e) { console.error("Refresh Error", e); }
  }

  startMiningCounter() { if (this.miningTimer) return; this.miningTimer = setInterval(() => { if (this.currentRealPower > 0) { const rps = (this.currentRealPower * Number(this.currentDifficulty)) / 1e18; this.pendingBalance += rps; document.getElementById('val-pending').innerText = this.pendingBalance.toFixed(5); } }, 1000); }
  stopMiningCounter() { if (this.miningTimer) { clearInterval(this.miningTimer); this.miningTimer = null; } }

  // ── Referral ─────────────────────────────────────────────────
  async bindReferrer() { const a = document.getElementById('ref-address-input').value.trim(); if (!ethers.isAddress(a)) return this.showToast(this.t('invalidAddr'), true); this.setLoader(true, this.t('linking')); try { const tx = await this.contracts.mining.setReferrer(a); await tx.wait(); this.showToast(this.t('refLinked')); document.getElementById('ref-address-input').value = ''; this._recordTx('referral', '', '', '', '', tx.hash, {}); } catch (e) { this.showError(e); } this.setLoader(false); }

  // ── Shop ─────────────────────────────────────────────────────
  setPayMode(m) { this.payMode = m; document.getElementById('btn-pay-usdt').classList.toggle('active', m === 'USDT'); document.getElementById('btn-pay-fta').classList.toggle('active', m === 'FTA'); this.renderShop(); }
  setShopView(v) { this.shopViewMode = v; document.querySelectorAll('.shop-tab').forEach(t => t.classList.remove('active')); if (event?.currentTarget) event.currentTarget.classList.add('active'); this.renderShop(); }
  async renderShop() { if (this.isLoadingShop) return; const c = document.getElementById('shop-list'); if (this.shopViewMode === 'machines') { if (!this.shopMachinesData.length) await this.fetchMachines(); this._renderShopMachinesHTML(c); } else { if (!this.shopBatteriesData.length) await this.fetchBatteries(); this._renderShopBatteriesHTML(c); } }
  async fetchMachines() { this.isLoadingShop = true; try { const cnt = Number(await this.contracts.mining.getMachineCount()); const p = []; for (let i = 0; i < cnt; i++) p.push(this.contracts.mining.machineTypes(i)); const r = await Promise.all(p); this.shopMachinesData = []; for (let i = 0; i < cnt; i++) { const d = r[i]; this.shopMachinesData.push({ price: parseFloat(ethers.formatUnits(d.price, this.usdtDecimals)), power: Number(d.power), priceRaw: d.price }); } } catch (e) { console.error("fetchMachines", e); } this.isLoadingShop = false; }
  async fetchBatteries() { this.isLoadingShop = true; try { const cnt = Number(await this.contracts.mining.getBatteryCount()); const p = []; for (let i = 0; i < cnt; i++) p.push(this.contracts.mining.batteryTypes(i)); const r = await Promise.all(p); this.shopBatteriesData = []; for (let i = 0; i < cnt; i++) { const d = r[i]; this.shopBatteriesData.push({ price: parseFloat(ethers.formatUnits(d.price, this.usdtDecimals)), days: Number(d.duration) / 86400, priceRaw: d.price }); } } catch (e) { console.error("fetchBatteries", e); } this.isLoadingShop = false; }

  /* ═══════════ BUY MACHINE ═══════════════════════════════════ */
  async buyMachine(id) {
    if (!this.user) return this.connect();
    const m = this.shopMachinesData[id];
    this.setLoader(true, `${this.t('buyingMachine')} (${this.payMode})...`);
    try {
      let tx;
      if (this.payMode === 'USDT') {
        const al = await this.contracts.usdt.allowance(this.user, CONFIG.MINING);
        if (al < m.priceRaw) { this.setLoader(true, this.t('approveUsdt')); await (await this.contracts.usdt.approve(CONFIG.MINING, m.priceRaw)).wait(); }
        this.setLoader(true, this.t('confirming')); tx = await this.contracts.mining.buyMachine(id); await tx.wait();
        this._recordTx('buy_machine', 'USDT', '', m.price, '', tx.hash, { machineTypeId: id, machineTier: id + 1 });
      } else {
        if (this.netFtaSold === 0n) { this.showToast(this.t('errNoFtaLiquidity') + ' ' + this.t('useUsdtInstead'), true); this.setLoader(false); return; }
        let fc; try { fc = await this.contracts.mining.getFtaCostForUsdtSell(m.priceRaw); } catch (e) { this.showToast(this.t('errLowLiquidity'), true); this.setLoader(false); return; }
        if (fc === 0n) { this.showToast(this.t('errLowLiquidity'), true); this.setLoader(false); return; }
        const ftExact = Number(ethers.formatUnits(fc * 100n / 89n, this.ftaDecimals));
        const al = await this.contracts.fta.allowance(this.user, CONFIG.MINING);
        if (al < fc * 13n / 10n) { this.setLoader(true, this.t('approveFta')); try { await (await this.contracts.fta.approve(CONFIG.MINING, fc * 13n / 10n)).wait(); } catch (e) { this.showToast(this.t('errApprovalFailed'), true); this.setLoader(false); return; } }
        this.setLoader(true, this.t('confirming')); tx = await this.contracts.mining.buyMachineWithFTA(id); await tx.wait();
        try { this.netFtaSold = BigInt(await this.contracts.mining.netFtaSold()); } catch (e) { }
        this._recordTx('buy_machine', 'FTA', '', ftExact, '', tx.hash, { machineTypeId: id, machineTier: id + 1, ftaCost: ftExact });
      }
      this.userMachines.push({ typeId: id, expiresAt: 0, pluggedBatteryType: null, boughtAt: Math.floor(Date.now() / 1000) });
      this._saveLocalAssets(); this.showToast(this.t('machineBought')); this.shopMachinesData = []; this.updateData();
    } catch (e) { this.showError(e); } this.setLoader(false);
  }

  /* ═══════════ BUY BATTERY ═══════════════════════════════════ */
  async buyBattery(id) {
    if (!this.user) return this.connect();
    const b = this.shopBatteriesData[id];
    this.setLoader(true, `${this.t('buyingBattery')} (${this.payMode})...`);
    try {
      let tx;
      if (this.payMode === 'USDT') {
        const al = await this.contracts.usdt.allowance(this.user, CONFIG.MINING);
        if (al < b.priceRaw) { this.setLoader(true, this.t('approveUsdt')); await (await this.contracts.usdt.approve(CONFIG.MINING, b.priceRaw)).wait(); }
        this.setLoader(true, this.t('confirming')); tx = await this.contracts.mining.buyBattery(id); await tx.wait();
        this._recordTx('buy_battery', 'USDT', '', b.price, '', tx.hash, { batteryTypeId: id, duration: b.days });
      } else {
        if (this.netFtaSold === 0n) { this.showToast(this.t('errNoFtaLiquidity') + ' ' + this.t('useUsdtInstead'), true); this.setLoader(false); return; }
        let fc; try { fc = await this.contracts.mining.getFtaCostForUsdtSell(b.priceRaw); } catch (e) { this.showToast(this.t('errLowLiquidity'), true); this.setLoader(false); return; }
        if (fc === 0n) { this.showToast(this.t('errLowLiquidity'), true); this.setLoader(false); return; }
        const ftExact = Number(ethers.formatUnits(fc * 100n / 89n, this.ftaDecimals));
        const al = await this.contracts.fta.allowance(this.user, CONFIG.MINING);
        if (al < fc * 13n / 10n) { this.setLoader(true, this.t('approveFta')); try { await (await this.contracts.fta.approve(CONFIG.MINING, fc * 13n / 10n)).wait(); } catch (e) { this.showToast(this.t('errApprovalFailed'), true); this.setLoader(false); return; } }
        this.setLoader(true, this.t('confirming')); tx = await this.contracts.mining.buyBatteryWithFTA(id); await tx.wait();
        try { this.netFtaSold = BigInt(await this.contracts.mining.netFtaSold()); } catch (e) { }
        this._recordTx('buy_battery', 'FTA', '', ftExact, '', tx.hash, { batteryTypeId: id, duration: b.days, ftaCost: ftExact });
      }
      this.userBatteries[id] = (this.userBatteries[id] || 0) + 1; this._saveLocalAssets();
      this.showToast(this.t('batteryBought')); this.shopBatteriesData = []; this.updateData();
    } catch (e) { this.showError(e); } this.setLoader(false);
  }

  // ── Plug In ──────────────────────────────────────────────────
  async plugInMachine() {
    const mIdx = document.getElementById('plug-machine-id').value, bT = document.getElementById('plug-battery-type').value;
    if (mIdx === "" || mIdx < 0) return this.showToast(this.t('invalidId'), true);
    const idx = Number(mIdx); if (idx >= this.userMachines.length) return this.showToast(this.t('invalidId'), true);
    if (!this.userBatteries[bT] || this.userBatteries[bT] <= 0) return this.showToast("No battery of this type available", true);
    this.setLoader(true, this.t('pluggingIn'));
    try {
      const tx = await this.contracts.mining.plugInMachine(idx, bT); await tx.wait();
      this.pendingBalance = 0; this.userLastClaimTime = Math.floor(Date.now() / 1000);
      const durSec = this.batteryTypeDurations[bT] ? this.batteryTypeDurations[bT] * 86400 : 2592000;
      this.userMachines[idx].expiresAt = Math.floor(Date.now() / 1000) + durSec;
      this.userMachines[idx].pluggedBatteryType = Number(bT);
      this.userBatteries[bT] = Math.max(0, (this.userBatteries[bT] || 0) - 1);
      this._saveLocalAssets(); this.showToast(this.t('pluggedIn'));
      this._recordTx('plug_in', '', '', '', '', tx.hash, { machineIndex: idx, batteryTypeId: Number(bT), duration: this.getBatteryDuration(Number(bT)) });
      this.updateData();
    } catch (e) { this.showError(e); } this.setLoader(false);
  }

  // ── Claim ────────────────────────────────────────────────────
  async claim() { if (!this.user) return; this.stopMiningCounter(); this.setLoader(true, this.t('claiming')); try { const tx = await this.contracts.mining.claimRewards(); await tx.wait(); const pending = this.pendingBalance; this.pendingBalance = 0; this.userLastClaimTime = Math.floor(Date.now() / 1000); this._saveLocalAssets(); this.showToast(this.t('claimed')); this._recordTx('claim', '', 'FTA', '', pending, tx.hash, { amountFTA: pending }); this.updateData(); if (this.currentRealPower > 0) this.startMiningCounter(); } catch (e) { this.showError(e); this.startMiningCounter(); } this.setLoader(false); }

  /* ═══════════ SWAP ══════════════════════════════════════════ */
  toggleSwap() { this.swapDirection = this.swapDirection === 'USDT_TO_FTA' ? 'FTA_TO_USDT' : 'USDT_TO_FTA'; document.getElementById('token-from-display').innerText = this.swapDirection === 'USDT_TO_FTA' ? 'USDT' : 'FTA'; document.getElementById('token-to-display').innerText = this.swapDirection === 'USDT_TO_FTA' ? 'FTA' : 'USDT'; document.getElementById('swap-to-in').value = ''; document.getElementById('swap-from-in').value = ''; document.getElementById('swap-details').classList.add('hidden'); this.updateData(); }
  calcSwap() {
    const val = document.getElementById('swap-from-in').value;
    if (!val || val <= 0) { document.getElementById('swap-to-in').value = ''; document.getElementById('swap-details').classList.add('hidden'); return; }
    const inputVal = parseFloat(val), isUsdtTo = this.swapDirection === 'USDT_TO_FTA';
    const fee = inputVal * SWAP_FEE_RATE, netInput = inputVal - fee;
    let netOutput = 0; if (this.ftaPriceUsd > 0) netOutput = isUsdtTo ? (netInput / this.ftaPriceUsd) : (netInput * this.ftaPriceUsd);
    document.getElementById('swap-to-in').value = netOutput > 0 ? netOutput.toFixed(6) : '';
    const detailsEl = document.getElementById('swap-details'); detailsEl.classList.remove('hidden');
    const fromT = isUsdtTo ? 'USDT' : 'FTA', toT = isUsdtTo ? 'FTA' : 'USDT';
    document.getElementById('swap-detail-rate').innerText = isUsdtTo ? `1 USDT = ${(1 / this.ftaPriceUsd).toFixed(2)} FTA` : `1 FTA = ${this.ftaPriceUsd.toFixed(6)} USDT`;
    document.getElementById('swap-detail-fee').innerText = `${fee.toFixed(6)} ${fromT}`;
    document.getElementById('swap-detail-min').innerText = `${(netOutput * (1 - SLIPPAGE)).toFixed(6)} ${toT}`;
    document.getElementById('swap-detail-network').innerText = `≈ 0.015 POL (${this.formatUsd(0.015 * this.polPriceUsd)})`;
  }
  async executeSwap() {
    const val = document.getElementById('swap-from-in').value;
    if (!val || val <= 0) return this.showToast(this.t('invalidAmount'), true);
    this.setLoader(true, this.t('swapping'));
    const isUsdtTo = this.swapDirection === 'USDT_TO_FTA';
    const decimals = isUsdtTo ? this.usdtDecimals : this.ftaDecimals;
    const amount = ethers.parseUnits(val, decimals);
    try {
      let tx; let received = 0;
      if (isUsdtTo) {
        const al = await this.contracts.usdt.allowance(this.user, CONFIG.MINING);
        if (al < amount) { this.setLoader(true, this.t('approveUsdt')); await (await this.contracts.usdt.approve(CONFIG.MINING, amount)).wait(); }
        this.setLoader(true, this.t('confirming')); tx = await this.contracts.mining.swapUsdtForFta(amount); await tx.wait();
        try { this.netFtaSold = BigInt(await this.contracts.mining.netFtaSold()); } catch (e) { }
        received = parseFloat(val) - parseFloat(val) * SWAP_FEE_RATE;
        this._recordTx('swap', 'USDT', 'FTA', parseFloat(val), received, tx.hash, { direction: 'USDT→FTA' });
      } else {
        if (this.netFtaSold === 0n) { this.showToast(this.t('errNoFtaLiquidity'), true); this.setLoader(false); return; }
        if (amount > this.netFtaSold) { const maxSell = parseFloat(ethers.formatUnits(this.netFtaSold, this.ftaDecimals)); this.showToast(this.t('errMaxFtaSell').replace('{max}', maxSell.toFixed(4)), true); this.setLoader(false); return; }
        const al = await this.contracts.fta.allowance(this.user, CONFIG.MINING);
        if (al < amount) { this.setLoader(true, this.t('approveFta')); await (await this.contracts.fta.approve(CONFIG.MINING, amount)).wait(); }
        this.setLoader(true, this.t('confirming')); tx = await this.contracts.mining.swapFtaForUsdt(amount); await tx.wait();
        try { this.netFtaSold = BigInt(await this.contracts.mining.netFtaSold()); } catch (e) { }
        received = (parseFloat(val) * (1 - SWAP_FEE_RATE)) * this.ftaPriceUsd;
        this._recordTx('swap', 'FTA', 'USDT', parseFloat(val), received, tx.hash, { direction: 'FTA→USDT' });
      }
      this.showToast(this.t('swapSuccess'));
      document.getElementById('swap-from-in').value = ''; document.getElementById('swap-to-in').value = '';
      document.getElementById('swap-details').classList.add('hidden'); this.updateData();
    } catch (e) {
      const em = (e?.message || '').toLowerCase();
      if (em.includes('insufficient liquidity') || em.includes('invalid amount')) this.showToast(this.t('errSwapRejected'), true);
      else this.showError(e);
    }
    this.setLoader(false);
  }

  // ── Send / Receive ───────────────────────────────────────────
  openSend(ts) { this.sendTokenSymbol = ts; document.getElementById('send-token-name').innerText = ts; document.getElementById('send-to-address').value = ''; document.getElementById('send-amount').value = ''; let bid = 'bal-pol-2'; if (ts === 'USDT') bid = 'bal-usdt-2'; if (ts === 'FTA') bid = 'bal-fta-2'; document.getElementById('send-bal').innerText = document.getElementById(bid)?.innerText || '0'; document.getElementById('modal-send').classList.add('active'); }
  openReceive() { if (!this.user) return this.showToast(this.t('connFirst'), true); document.getElementById('receive-addr-display').innerText = this.user; document.getElementById('modal-receive').classList.add('active'); }
  closeModals() { document.getElementById('modal-send').classList.remove('active'); document.getElementById('modal-receive').classList.remove('active'); }
  copyReceiveAddress() { navigator.clipboard.writeText(this.user); this.showToast(this.t('addrCopied')); }
  async executeSend() {
    const to = document.getElementById('send-to-address').value.trim(), amt = document.getElementById('send-amount').value;
    if (!ethers.isAddress(to)) return this.showToast(this.t('invalidAddr'), true);
    if (!amt || Number(amt) <= 0) return this.showToast(this.t('invalidAmount'), true);
    this.setLoader(true, this.t('sending'));
    try {
      let tx;
      if (this.sendTokenSymbol === 'POL') { tx = await this.signer.sendTransaction({ to, value: ethers.parseEther(amt) }); }
      else { let ct, dc; if (this.sendTokenSymbol === 'USDT') { ct = this.contracts.usdt; dc = this.usdtDecimals; } if (this.sendTokenSymbol === 'FTA') { ct = this.contracts.fta; dc = this.ftaDecimals; } tx = await ct.transfer(to, ethers.parseUnits(amt, dc)); }
      await tx.wait(); this.showToast(this.t('sentSuccess'));
      this._recordTx('send', this.sendTokenSymbol, '', parseFloat(amt), '', tx.hash, { recipient: to });
      this.closeModals(); this.updateData();
    } catch (e) { this.showError(e); } this.setLoader(false);
  }

  // ── Nav ──────────────────────────────────────────────────────
  nav(viewId) {
    document.querySelectorAll('.view').forEach(el => { el.classList.remove('active'); el.style.display = 'none'; });
    const av = document.getElementById('view-' + viewId); if (av) { av.classList.add('active'); av.style.display = 'block'; }
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    if (event?.currentTarget) event.currentTarget.classList.add('active');
    if (viewId === 'history') this.refreshHistory();
  }

  /* ═══════════ HISTORY ═══════════════════════════════════════ */
  async refreshHistory() {
    if (!this.user) return;
    try {
      let apiTxs = []; let apiStats = null;
      if (this.dbOnline) {
        apiTxs = await this.db.getTransactions(this.user, 100, 0, this.historyFilter !== 'all' ? this.historyFilter : null);
        // Build stats from all
        const allTxs = this.historyFilter !== 'all' ? await this.db.getTransactions(this.user, 1000) : apiTxs;
        apiStats = {
          total: allTxs.length,
          swaps: allTxs.filter(tx => tx.tx_type === 'swap').length,
          machines: allTxs.filter(tx => tx.tx_type === 'buy_machine').length,
          batteries: allTxs.filter(tx => tx.tx_type === 'buy_battery').length,
          claims: allTxs.filter(tx => tx.tx_type === 'claim').length,
          confirmed: allTxs.filter(tx => tx.status === 'confirmed').length
        };
        // Get activity
        this.activityData = await this.db.getActivityLog(this.user, 20);
        // Leaderboard
        this.leaderboardData = await this.db.getLeaderboard(20);
      }

      if (apiTxs.length > 0) {
        this.historyData = apiTxs;
        this.historyStats = apiStats;
      } else {
        // Fallback
        this.historyData = this.historyFilter === 'all'
          ? this.localTxLog
          : this.localTxLog.filter(tx => tx.type === this.historyFilter);
        this.historyStats = {
          total: this.localTxLog.length,
          swaps: this.localTxLog.filter(tx => tx.type === 'swap').length,
          machines: this.localTxLog.filter(tx => tx.type === 'buy_machine').length,
          batteries: this.localTxLog.filter(tx => tx.type === 'buy_battery').length,
          claims: this.localTxLog.filter(tx => tx.type === 'claim').length,
          confirmed: this.localTxLog.length
        };
      }
      this.renderHistory();
      this.renderActivityFeed();
      this.renderLeaderboard();
      this.updateProfileUI();
    } catch (e) { console.error('refreshHistory', e); }
  }

  filterHistory(filter) {
    this.historyFilter = filter;
    document.querySelectorAll('.tx-filter-tab').forEach(t => t.classList.remove('active'));
    const tabs = document.querySelectorAll('.tx-filter-tab');
    const idx = ['all', 'swap', 'buy_machine', 'buy_battery', 'claim'].indexOf(filter);
    if (idx >= 0 && tabs[idx]) tabs[idx].classList.add('active');
    this.refreshHistory();
  }

  renderHistory() {
    const c = document.getElementById('history-list');
    if (!c) return;
    const s = this.historyStats || {};
    document.getElementById('txs-total').innerText = s.total || 0;
    document.getElementById('txs-swaps').innerText = s.swaps || 0;
    document.getElementById('txs-machines').innerText = s.machines || 0;
    document.getElementById('txs-batteries').innerText = s.batteries || 0;
    document.getElementById('txs-claims').innerText = s.claims || 0;

    if (!this.historyData.length) {
      c.innerHTML = `<div class="history-empty"><span class="history-empty-icon">📭</span><p>${this.t('noHistory')}</p></div>`;
      return;
    }
    const typeIcons = { swap: '💱', buy_machine: '⛏️', buy_battery: '🔋', claim: '🎁', send: '📤', receive: '📥', plug_in: '⚡', referral: '👥' };
    const typeLabels = { swap: 'Swap', buy_machine: 'Machine', buy_battery: 'Battery', claim: 'Claim', send: 'Send', receive: 'Receive', plug_in: 'Plug In', referral: 'Referral' };

    c.innerHTML = this.historyData.slice(0, 50).map(tx => {
      const type = tx.tx_type || tx.type;
      const icon = typeIcons[type] || '📋';
      const label = typeLabels[type] || type;
      const time = tx.created_at ? new Date(tx.created_at).toLocaleString() : (tx.timestamp ? new Date(tx.timestamp).toLocaleString() : '');
      const hash = tx.tx_hash || tx.txHash;
      const hasHash = hash && hash !== 'local';
      const status = tx.status || (hash ? 'confirmed' : 'pending');
      const amountIn = tx.amount_from || tx.amountFrom || '';
      const amountOut = tx.amount_to || tx.amountTo || '';
      const tokenIn = tx.token_from || tx.tokenFrom || '';
      const tokenOut = tx.token_to || tx.tokenTo || '';

      return `<div class="tx-item">
        <div class="tx-item-header">
          <span class="tx-type-badge ${type}">${icon} ${label}</span>
          <div style="display:flex;align-items:center;gap:8px;">
            <span class="tx-time">${time}</span>
            <span class="tx-status ${status}">${status}</span>
          </div>
        </div>
        <div class="tx-item-detail">
          <div class="tx-amount">
            ${amountIn ? `<span class="tx-amount-in">${amountIn} ${tokenIn}</span>` : ''}
            ${amountOut ? `<span class="tx-amount-out">→ ${amountOut} ${tokenOut}</span>` : ''}
          </div>
          <div style="text-align:right;">
            ${hasHash ? `<a class="tx-hash-link" href="https://polygonscan.com/tx/${hash}" target="_blank" rel="noopener">${hash.slice(0, 10)}... ↗</a>` : ''}
          </div>
        </div>
      </div>`;
    }).join('');
  }

  renderActivityFeed() {
    const c = document.getElementById('activity-feed');
    if (!c) return;
    if (!this.activityData || !this.activityData.length) {
      c.innerHTML = `<p class="small-text" style="text-align:center;">${this.t('noActivity')}</p>`;
      return;
    }
    const dotClass = (action) => {
      if (['login', 'register', 'logout'].includes(action)) return action;
      if (['swap', 'buy_machine', 'buy_battery'].includes(action)) return action;
      if (action === 'claim') return 'claim';
      return 'default';
    };
    c.innerHTML = this.activityData.slice(0, 15).map(a => `
      <div class="activity-item">
        <div class="activity-dot ${dotClass(a.action)}"></div>
        <div class="activity-text">${a.details || a.action}</div>
        <div class="activity-time">${a.created_at ? new Date(a.created_at).toLocaleTimeString() : ''}</div>
      </div>`).join('');
  }

  renderLeaderboard() {
    const c = document.getElementById('leaderboard-list');
    if (!c) return;
    const lb = this.leaderboardData;
    if (!lb || !lb.length) {
      c.innerHTML = `<p class="small-text" style="text-align:center;">Connect Supabase for live leaderboard</p>`;
      return;
    }
    c.innerHTML = lb.slice(0, 15).map((u, i) => {
      const rank = i + 1;
      const rankClass = rank === 1 ? 'gold' : (rank === 2 ? 'silver' : (rank === 3 ? 'bronze' : ''));
      return `<div class="lb-item">
        <div class="lb-rank ${rankClass}">${rank}</div>
        <div class="lb-info"><div class="lb-name">${u.username || 'Anonymous Miner'}</div><div class="lb-addr">${(u.wallet_address || '').slice(0, 8)}...</div></div>
        <div class="lb-earned"><span class="lb-earned-val">${this.formatUsd(Number(u.total_earned || 0))}</span><span class="lb-earned-label">earned</span></div>
      </div>`;
    }).join('');
  }

  // ── Visualizer ───────────────────────────────────────────────
  resizeCanvas() { if (this.vizContext) { const c = this.vizContext.canvas; c.width = c.offsetWidth * 2; c.height = c.offsetHeight * 2; } }
  initVisualizer() { const c = document.getElementById('mining-canvas'); if (!c) return; this.resizeCanvas(); this.vizContext = c.getContext('2d'); this.vizBars = []; for (let i = 0; i < 20; i++) this.vizBars.push({ height: 0, targetHeight: 0 }); this.animateVisualizer(); }
  updateVisualizerIntensity(p) { const maxP = 100000, level = Math.min(Math.max(p / maxP, 0.02), 1); this.vizBars.forEach(b => { b.targetHeight = (this.vizContext.canvas.height * level) * (0.6 + Math.random() * 0.4); }); }
  animateVisualizer() { if (!this.vizContext) return; const ctx = this.vizContext; ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); ctx.fillStyle = "#F0B90B"; const w = ctx.canvas.width / 20; this.vizBars.forEach((b, i) => { b.height += (b.targetHeight - b.height) * 0.1; ctx.fillRect(i * w + 2, ctx.canvas.height - b.height, w - 4, b.height); b.targetHeight += (Math.random() - 0.5) * 10; if (b.targetHeight < 0) b.targetHeight = 2; if (b.targetHeight > ctx.canvas.height) b.targetHeight = ctx.canvas.height; }); requestAnimationFrame(() => this.animateVisualizer()); }

  // ── Loader / Toast / Errors ──────────────────────────────────
  setLoader(show, msg = "Processing...") { const l = document.getElementById('loader'); document.getElementById('loader-text').innerText = msg; if (show) l.classList.remove('hidden'); else l.classList.add('hidden'); }
  showToast(msg, isError = false) { const div = document.createElement('div'); div.className = 'toast' + (isError ? ' toast-error' : ' toast-success'); div.innerText = msg; document.getElementById('toast-container').appendChild(div); setTimeout(() => div.remove(), 5000); }
  getErrorMessage(e) { const es = (e?.message || '').toLowerCase() + ' ' + (e?.code || '').toLowerCase() + ' ' + (e?.reason || '').toLowerCase() + ' ' + (e?.shortMessage || '').toLowerCase(); const ie = (e?.info?.error?.message || '').toLowerCase(); const c = es + ' ' + ie; if (c.includes('user rejected') || c.includes('user denied') || c.includes('cancelled by user') || c.includes('action_rejected') || e?.code === 'ACTION_REJECTED' || e?.code === 4001 || e?.code === -32000 || (e?.info?.error?.code === 4001)) return this.t('errRejected'); if (c.includes('insufficient liquidity')) return this.t('errLowLiquidity'); if (c.includes('insufficient funds') || c.includes('insufficient balance') || c.includes('not enough') || c.includes('underpriced') || c.includes('exceeds allowance') || c.includes('erc20: insufficient') || c.includes('transfer amount exceeds')) return this.t('errInsufficientFunds'); if (c.includes('nonce') || c.includes('already known')) return this.t('errNonce'); if (c.includes('already pending')) return this.t('errAlreadyPending'); if (c.includes('timeout') || c.includes('timed out')) return this.t('errTimeout'); if (c.includes('network') || c.includes('fetch') || c.includes('failed to fetch') || c.includes('connection') || c.includes('could not decode') || c.includes('missing revert data') || c.includes('call revert exception')) return this.t('errNetwork'); if (c.includes('invalid amount')) return this.t('errSwapRejected'); if (c.includes('revert') || c.includes('execution reverted') || c.includes('vm execution error') || c.includes('gas required exceeds allowance') || c.includes('transaction failed')) return this.t('errContract'); return this.t('errGeneric'); }
  showError(e) { console.error("Transaction Error:", e); this.showToast(this.getErrorMessage(e), true); }

  // ── Render UI ────────────────────────────────────────────────
  renderActiveMachines() { const c = document.getElementById('active-machines-list'); if (!c) return; const now = Math.floor(Date.now() / 1000); const active = this.userMachines.filter(m => m.expiresAt > now); if (!active.length) { c.innerHTML = `<p class="small-text" style="text-align:center;">${this.t('noActiveMachines')}</p>`; return; } const tn = ['MK-I', 'MK-II', 'MK-III', 'MK-IV', 'MK-V', 'MK-VI', 'MK-VII', 'MK-VIII']; c.innerHTML = active.map(m => { const rem = m.expiresAt - now, dur = this.getBatteryDuration(m.pluggedBatteryType), tot = dur * 86400, el = tot - rem, pr = Math.min(Math.max((el / tot) * 100, 0), 100), bc = pr < 60 ? 'green' : (pr < 85 ? 'yellow' : 'red'); return `<div class="asset-row">${this.getMachineMiniSVG(m.typeId)}<div class="asset-info"><div class="asset-name">${tn[m.typeId % 8]} <span class="status-pill active">● ${this.t('active')}</span></div><div class="asset-detail">${this.t('batteryLabel')}: ${dur} ${this.t('days')}</div><div class="battery-bar-wrap"><div class="battery-bar-header"><span class="battery-bar-label">${this.t('timeRemaining')}</span><span class="battery-bar-time ${bc}">${this.formatTimeRemaining(rem)}</span></div><div class="battery-bar"><div class="battery-bar-fill ${bc}" style="width:${pr.toFixed(1)}%"></div></div></div></div></div>`; }).join(''); }
  renderUserMachines() { const c = document.getElementById('my-machines-list'); if (!c) return; if (!this.userMachines.length) { c.innerHTML = `<p class="small-text" style="text-align:center;">${this.t('noMachines')}</p>`; return; } const now = Math.floor(Date.now() / 1000), tn = ['MK-I', 'MK-II', 'MK-III', 'MK-IV', 'MK-V', 'MK-VI', 'MK-VII', 'MK-VIII']; c.innerHTML = this.userMachines.map((m, i) => { let sc, st; if (m.expiresAt > now) { sc = 'active'; st = this.t('active'); } else if (m.expiresAt > 0) { sc = 'expired'; st = this.t('expired'); } else { sc = 'inactive'; st = this.t('inactive'); } const dur = this.getBatteryDuration(m.pluggedBatteryType); let bh = ''; if (m.expiresAt > 0) { const rem = m.expiresAt - now, tot = dur * 86400, el = tot - rem, pr = Math.min(Math.max((el / tot) * 100, 0), 100), bc = rem <= 0 ? 'red' : (pr < 60 ? 'green' : (pr < 85 ? 'yellow' : 'red')); bh = `<div class="battery-bar-wrap"><div class="battery-bar-header"><span class="battery-bar-label">${this.t('batteryLabel')}: ${dur} ${this.t('days')}</span><span class="battery-bar-time ${bc}">${rem > 0 ? this.formatTimeRemaining(rem) : this.t('expired')}</span></div><div class="battery-bar"><div class="battery-bar-fill ${rem <= 0 ? 'gray' : bc}" style="width:${rem <= 0 ? 100 : pr.toFixed(1)}%"></div></div></div>`; } return `<div class="asset-row">${this.getMachineMiniSVG(m.typeId)}<div class="asset-info"><div class="asset-name">#${i} ${tn[m.typeId % 8]} <span class="status-pill ${sc}">● ${st}</span></div><div class="asset-detail">${m.expiresAt > 0 ? this.t('plugged') : this.t('notPlugged')}</div>${bh}</div></div>`; }).join(''); }
  renderUserBatteries() { const c = document.getElementById('my-batteries-list'); if (!c) return; const types = Object.entries(this.userBatteries).filter(([, cnt]) => cnt > 0); if (!types.length) { c.innerHTML = `<p class="small-text" style="text-align:center;">${this.t('noBatteries')}</p>`; return; } c.innerHTML = types.map(([tid, cnt]) => { const dur = this.getBatteryDuration(Number(tid)), cl = Math.floor(Math.random() * 40) + 60, lc = cl > 60 ? '' : (cl > 20 ? 'medium' : (cl > 0 ? 'low' : 'empty')); return `<div class="asset-row"><div class="real-battery"><div class="battery-cap"></div><div class="battery-body"><div class="battery-level ${lc}" style="width:${cl}%"></div><div class="battery-charge-indicator">${cnt}×</div></div></div><div class="asset-info"><div class="asset-name">${dur} ${this.t('days')} <span class="status-pill available">● ${cnt} ${this.t('available')}</span></div></div></div>`; }).join(''); }

  // ── SVG ──────────────────────────────────────────────────────
  getMachineSVG(tier) { const t = [{ n: 'MK-I', g: 1, c: '#64748b', a: '#94a3b8', f: 1 }, { n: 'MK-II', g: 2, c: '#3b82f6', a: '#60a5fa', f: 1 }, { n: 'MK-III', g: 3, c: '#8b5cf6', a: '#a78bfa', f: 2 }, { n: 'MK-IV', g: 4, c: '#F0B90B', a: '#FFD43B', f: 2 }, { n: 'MK-V', g: 5, c: '#f97316', a: '#fb923c', f: 2 }, { n: 'MK-VI', g: 6, c: '#ef4444', a: '#f87171', f: 3 }, { n: 'MK-VII', g: 8, c: '#06b6d4', a: '#22d3ee', f: 3 }, { n: 'MK-VIII', g: 8, c: '#eab308', a: '#facc15', f: 4 }][tier % 8]; const W = 260, H = 170; let gH = '', fH = '', lH = '', vH = ''; const gw = 24, gh = 48, gG = 3, mW = W - 40; let eg = gw; let tW = t.g * eg + (t.g - 1) * gG; if (tW > mW) { eg = Math.floor((mW - (t.g - 1) * gG) / t.g); tW = t.g * eg + (t.g - 1) * gG; } const gS = (W - tW) / 2, gY = 22; for (let i = 0; i < t.g; i++) { const x = gS + i * (eg + gG); gH += `<rect x="${x}" y="${gY}" width="${eg}" height="${gh}" rx="2" fill="#080c18" stroke="${t.a}" stroke-width="0.6" opacity="0.85"/>`; const fC = Math.max(3, Math.floor(eg / 4)), fS = eg - 6; for (let j = 0; j < 9; j++) { const fy = gY + 5 + j * 4.5; if (fy + 2 < gY + gh - 10) { for (let f = 0; f < fC; f++) { gH += `<rect x="${x + 3 + f * (fS / fC)}" y="${fy}" width="${Math.max(1, (fS / fC) - 1.5)}" height="2" rx="0.5" fill="${t.a}" opacity="0.12"/>`; } } } const cW = Math.min(10, eg - 6); gH += `<rect x="${x + (eg - cW) / 2}" y="${gY + gh - 11}" width="${cW}" height="7" rx="1.5" fill="${t.c}" opacity="0.35"/><circle cx="${x + eg / 2}" cy="${gY + 3}" r="1" fill="${t.a}" class="led-pulse" style="animation-delay:${i * 0.3}s"/>`; } const fR = 14, fS2 = 14, tFW = t.f * fR * 2 + (t.f - 1) * fS2, fSX = (W - tFW) / 2, fY = 100; for (let i = 0; i < t.f; i++) { const cx = fSX + i * (fR * 2 + fS2) + fR, cy = fY; fH += `<circle cx="${cx}" cy="${cy}" r="${fR + 2}" fill="#060a14" stroke="#2a2a3e" stroke-width="1"/><circle cx="${cx}" cy="${cy}" r="${fR}" fill="#0a0e1a" stroke="#333" stroke-width="0.8"/><g class="fan-blades" style="transform-origin:${cx}px ${cy}px">`; for (let b = 0; b < 5; b++) fH += `<rect x="${cx - 1.5}" y="${cy - fR + 3}" width="3" height="${fR - 4}" rx="1.5" fill="#1e293b" transform="rotate(${b * 72},${cx},${cy})"/>`; fH += `</g><circle cx="${cx}" cy="${cy}" r="3.5" fill="${t.a}" opacity="0.4"/><circle cx="${cx}" cy="${cy}" r="1.5" fill="${t.a}" opacity="0.7"/>`; } for (let i = 0; i < 6; i++) { const lx = 25 + i * 9; lH += `<circle cx="${lx}" cy="148" r="1.8" fill="${i === 0 ? '#10b981' : (i < 3 ? t.a : '#334155')}" class="led-pulse" style="animation-delay:${i * 0.4}s"/>`; } for (let v = 0; v < 3; v++) vH += `<rect x="30" y="${138 + v * 5}" width="${W - 60}" height="2" rx="1" fill="#060a14" opacity="0.8"/>`; return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" class="machine-svg"><defs><linearGradient id="bG${tier}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1e293b"/><stop offset="50%" stop-color="#162032"/><stop offset="100%" stop-color="#0f172a"/></linearGradient><linearGradient id="tB${tier}" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="${t.c}" stop-opacity="0.8"/><stop offset="50%" stop-color="${t.a}" stop-opacity="1"/><stop offset="100%" stop-color="${t.c}" stop-opacity="0.8"/></linearGradient></defs><ellipse cx="${W / 2}" cy="${H - 3}" rx="${W / 2 - 30}" ry="10" fill="${t.a}" opacity="0.06"/><rect x="12" y="10" width="${W - 24}" height="${H - 22}" rx="8" fill="url(#bG${tier})" stroke="#2a3550" stroke-width="1.2"/><rect x="12" y="10" width="${W - 24}" height="4" rx="2" fill="url(#tB${tier})"/><circle cx="20" cy="18" r="1.5" fill="#334155"/><circle cx="${W - 20}" cy="18" r="1.5" fill="#334155"/><text x="${W - 22}" y="20" font-family="monospace" font-size="7" font-weight="700" fill="${t.a}" text-anchor="end" opacity="0.7">${t.n}</text><text x="24" y="20" font-family="sans-serif" font-size="6" font-weight="800" fill="#475569" letter-spacing="1.5">FITIA</text>${gH}<line x1="28" y1="${gY + gh + 6}" x2="${W - 28}" y2="${gY + gh + 6}" stroke="#1e293b" stroke-width="0.8" stroke-dasharray="2,2"/>${fH}${vH}${lH}<circle cx="${W - 25}" cy="148" r="3.5" fill="none" stroke="${t.a}" stroke-width="0.8" opacity="0.5"/><line x1="${W - 25}" y1="143.5" x2="${W - 25}" y2="146" stroke="${t.a}" stroke-width="0.8" opacity="0.5"/></svg>`; }
  getMachineMiniSVG(tier) { const c = ['#64748b', '#3b82f6', '#8b5cf6', '#F0B90B', '#f97316', '#ef4444', '#06b6d4', '#eab308'][tier % 8], a = ['#94a3b8', '#60a5fa', '#a78bfa', '#FFD43B', '#fb923c', '#f87171', '#22d3ee', '#facc15'][tier % 8]; return `<svg viewBox="0 0 50 50" class="machine-svg-mini"><rect x="2" y="2" width="46" height="46" rx="6" fill="#1e293b" stroke="${c}" stroke-width="1"/><rect x="2" y="2" width="46" height="3" rx="1.5" fill="${c}" opacity="0.6"/><rect x="8" y="10" width="14" height="20" rx="2" fill="#080c18" stroke="${a}" stroke-width="0.5"/><rect x="28" y="10" width="14" height="20" rx="2" fill="#080c18" stroke="${a}" stroke-width="0.5"/><circle cx="21" cy="40" r="6" fill="#0a0e1a" stroke="#333" stroke-width="0.5"/><g class="fan-blades" style="transform-origin:21px 40px">${[0, 72, 144, 216, 288].map(r => `<rect x="19.5" y="34.5" width="3" height="5" rx="1.5" fill="#1e293b" transform="rotate(${r},21,40)"/>`).join('')}</g><circle cx="21" cy="40" r="2" fill="${a}" opacity="0.6"/><circle cx="37" cy="40" r="6" fill="#0a0e1a" stroke="#333" stroke-width="0.5"/><g class="fan-blades" style="transform-origin:37px 40px">${[0, 72, 144, 216, 288].map(r => `<rect x="35.5" y="34.5" width="3" height="5" rx="1.5" fill="#1e293b" transform="rotate(${r},37,40)"/>`).join('')}</g><circle cx="37" cy="40" r="2" fill="${a}" opacity="0.6"/></svg>`; }

  _renderShopMachinesHTML(c) { c.innerHTML = ''; c.style.gridTemplateColumns = '1fr 1fr'; const bc = ['background:#64748b;color:#fff', 'background:#3b82f6;color:#fff', 'background:#8b5cf6;color:#fff', 'background:#F0B90B;color:#000', 'background:#f97316;color:#fff', 'background:#ef4444;color:#fff', 'background:#06b6d4;color:#000', 'background:#eab308;color:#000']; const bn = ['STARTER', 'STANDARD', 'ADVANCED', 'PRO', 'ELITE', 'ULTRA', 'SUPREME', 'LEGEND']; for (let i = 0; i < this.shopMachinesData.length; i++) { const d = this.shopMachinesData[i], div = document.createElement('div'); div.className = 'rig-item'; div.innerHTML = `<span class="tier-badge" style="${bc[i % 8]}">${bn[i % 8]}</span>${this.getMachineSVG(i)}<span class="rig-name" style="font-size:0.85rem;">${this.t('rig')} ${i + 1}</span><span class="rig-power" style="font-size:0.75rem;">${this.formatHashrate(d.power)}</span><span class="rig-price" style="font-size:1rem;">${d.price.toFixed(2)} $</span><button class="btn-primary" style="padding:8px;font-size:0.75rem;margin-top:6px;" onclick="App.buyMachine(${i})">${this.t('buy')} (${this.payMode})</button>`; c.appendChild(div); } }
  _renderShopBatteriesHTML(c) { c.innerHTML = ''; c.style.gridTemplateColumns = '1fr 1fr'; for (let i = 0; i < this.shopBatteriesData.length; i++) { const d = this.shopBatteriesData[i], div = document.createElement('div'), cl = Math.floor(Math.random() * 40) + 60; div.className = 'battery-shop-item'; div.innerHTML = `<div class="real-battery"><div class="battery-cap"></div><div class="battery-body"><div class="battery-level" style="width:${cl}%"></div><div class="battery-charge-indicator">${d.days}D</div></div></div><div class="battery-name">${d.days} ${this.t('days')}</div><div class="battery-price">${d.price.toFixed(2)} $</div><button class="btn-primary" style="padding:6px;font-size:0.75rem" onclick="App.buyBattery(${i})">${this.t('buy')} (${this.payMode})</button>`; c.appendChild(div); } }

  /* ═══════════ INTELLIGENT CHAT ASSISTANT ═══════════════════ */
  toggleChat() {
    const p = document.getElementById('chat-panel');
    const active = p.classList.toggle('active');
    if (active && !this.chatInitialized) {
      this.chatInitialized = true;
      setTimeout(() => this.addChatBubble('assistant', this.getWelcomeMessage()), 400);
    }
    if (active) setTimeout(() => document.getElementById('chat-input').focus(), 350);
  }

  sendChatMessage() {
    const i = document.getElementById('chat-input'), msg = i.value.trim();
    if (!msg) return;
    i.value = '';
    this.addChatBubble('user', msg);
    this.chatHistory.push({ role: 'user', text: msg });
    // Keep last 20 messages for context
    if (this.chatHistory.length > 20) this.chatHistory = this.chatHistory.slice(-20);
    const tid = this.showTyping();
    const delay = 400 + Math.min(msg.length * 20, 1500) + Math.random() * 600;
    setTimeout(() => {
      this.removeTyping(tid);
      const response = this.think(msg);
      this.addChatBubble('assistant', response);
      this.chatHistory.push({ role: 'assistant', text: response });
    }, delay);
  }

  addChatBubble(role, text) {
    const c = document.getElementById('chat-messages'), b = document.createElement('div');
    b.className = `chat-bubble ${role}`;
    b.textContent = text;
    c.appendChild(b);
    requestAnimationFrame(() => c.scrollTop = c.scrollHeight);
  }

  showTyping() {
    const c = document.getElementById('chat-messages'), t = document.createElement('div');
    const id = 'typing-' + Date.now();
    t.id = id; t.className = 'chat-bubble assistant';
    t.innerHTML = '<span style="letter-spacing:3px;animation:loaderTextPulse 1s infinite">● ● ●</span>';
    c.appendChild(t); c.scrollTop = c.scrollHeight;
    return id;
  }

  removeTyping(id) { const e = document.getElementById(id); if (e) e.remove(); }

  getWelcomeMessage() {
    const conn = !!this.user;
    const username = (this.profileData && this.profileData.username) || '';
    const greeting = username ? `, ${username}` : '';
    const nfsHuman = parseFloat(ethers.formatUnits(this.netFtaSold, this.ftaDecimals));
    const liqMsg = this.netFtaSold === 0n
      ? '\n\n⚠️ Protocol liquidity is currently building. Use USDT for purchases — it always works!'
      : `\n\n💧 Protocol Liquidity: ${nfsHuman.toFixed(2)} FTA — all operations available.`;

    if (conn) {
      const active = this.userMachines.filter(m => m.expiresAt > Math.floor(Date.now() / 1000)).length;
      return `👋 Welcome back${greeting}!\n\n⚡ You have ${active} active machine(s) mining at ${this.formatHashrate(this.currentRealPower)}.\n💎 Pending rewards: ${this.pendingBalance.toFixed(5)} FTA${liqMsg}\n\n💬 I can help you with:\n• Mining strategy & machine selection\n• Swaps & liquidity explained\n• The 4 visions of Fitia Pro\n• Getting started guides for beginners\n• Account, history & troubleshooting\n\nJust ask me anything! 🚀`;
    }

    const msgs = {
      en: `👋 Welcome to Fitia Pro! I'm your personal AI assistant.\n\n🏗️ Fitia Pro is built on 4 revolutionary visions:\n⛏️ Mining  •  💱 Finance  •  🛒 Shop  •  🏪 Store\n\n🔗 To get started, connect your wallet first!\n💬 Then ask me anything — I'm here to guide you.\n\n💡 I can explain mining, swaps, strategy, security, and help beginners step by step.`,
      fr: `👋 Bienvenue sur Fitia Pro ! Je suis votre assistant IA personnel.\n\n🏗️ Fitia Pro repose sur 4 visions révolutionnaires :\n⛏️ Mining  •  💱 Finance  •  🛒 Shop  •  🏪 Store\n\n🔗 Connectez votre wallet pour commencer !\n💬 Posez-moi vos questions — je suis là pour vous guider.\n\n💡 Je peux expliquer le mining, les swaps, la stratégie, la sécurité, et aider les débutants pas à pas.`
    };
    return msgs[this.currentLang] || msgs.en;
  }

  /* ── Think: main AI engine ───────────────────────────────── */
  think(msg) {
    const m = msg.toLowerCase().replace(/[?!.,;:'"]/g, '').trim();
    const L = this.currentLang;
    const conn = !!this.user;

    // Build rich context
    const ctx = {
      ftaPrice: this.ftaPriceUsd > 0 ? this.ftaPriceUsd.toFixed(6) : '...',
      ftaPriceUsd: this.formatUsd(this.ftaPriceUsd),
      nfs: parseFloat(ethers.formatUnits(this.netFtaSold, this.ftaDecimals)),
      liquidity: this.netFtaSold === 0n ? '0 (building)' : parseFloat(ethers.formatUnits(this.netFtaSold, this.ftaDecimals)).toFixed(2) + ' FTA',
      power: this.formatHashrate(this.currentRealPower),
      pending: this.pendingBalance.toFixed(5),
      active: this.userMachines ? this.userMachines.filter(x => x.expiresAt > Math.floor(Date.now() / 1000)).length : 0,
      totalMachines: this.userMachines ? this.userMachines.length : 0,
      username: (this.profileData && this.profileData.username) || 'Miner',
      wallet: this.user ? this.user.slice(0, 6) + '...' + this.user.slice(-4) : '',
      polPrice: this.formatUsd(this.polPriceUsd),
      machines: this.shopMachinesData,
      batteries: this.shopBatteriesData,
      isFr: L === 'fr', isZh: L === 'zh', isDe: L === 'de',
      // Conversation context from last 3 messages
      lastTopic: this.chatHistory.length >= 2 ? this._guessTopic(this.chatHistory[this.chatHistory.length - 2].text) : null
    };

    // ── Routing ──────────────────────────────────────────
    if (this._isGreeting(m)) return this._respondGreeting(ctx, L);
    if (this._isThanks(m)) return this._respondThanks(L);
    if (this._isGoodbye(m)) return this._respondGoodbye(L);

    // Detect primary intent
    const intent = this._detectIntent(m, ctx);

    switch (intent) {
      case 'what_is_fitia': return this._rWhatIsFitia(ctx, L);
      case 'four_visions': return this._rFourVisions(ctx, L);
      case 'fitia_revolution': return this._rRevolution(ctx, L);
      case 'how_mining_works': return this._rMiningHow(ctx, L);
      case 'buy_machine': return this._rBuyMachine(ctx, L);
      case 'buy_battery': return this._rBuyBattery(ctx, L);
      case 'plug_in': return this._rPlugIn(ctx, L);
      case 'claim': return this._rClaim(ctx, L);
      case 'how_swap_works': return this._rSwapHow(ctx, L);
      case 'liquidity': return this._rLiquidity(ctx, L);
      case 'tokenomics': return this._rTokenomics(ctx, L);
      case 'beginner': return this._rBeginner(ctx, L);
      case 'wallet_setup': return this._rWalletSetup(L);
      case 'what_is_crypto': return this._rCryptoBasics(L);
      case 'deposit': return this._rDeposit(ctx, L);
      case 'withdraw': return this._rWithdraw(ctx, L);
      case 'security': return this._rSecurity(L);
      case 'investment': return this._rInvestment(ctx, L);
      case 'strategy': return this._rStrategy(ctx, L);
      case 'machine_comparison': return this._rCompare(ctx, L);
      case 'price': return this._rPrice(ctx, L);
      case 'referral': return this._rReferral(ctx, L);
      case 'network': return this._rNetwork(L);
      case 'history': return this._rHistory(ctx, L);
      case 'profile': return this._rProfile(ctx, L);
      case 'roadmap': return this._rRoadmap(L);
      case 'whatsapp': return this._rWhatsapp(L);
      case 'fta_problems': return this._rProblems(ctx, L);
      case 'help': return this._rHelp(ctx, L);
      default: return this._rFallback(ctx, L, m);
    }
  }

  /* ── Intent Detection (enhanced) ─────────────────────────── */
  _detectIntent(m, ctx) {
    // Quick keyword scoring across all topics
    const topics = {
      what_is_fitia: ['what is fitia','c quoi fitia','fitia c\'est quoi','about fitia','explain fitia','presente fitia','介绍','fitia是什么','tell me about fitia','overview','fitia project','what is this','c\'est quoi ce projet','was ist fitia','quel est ce projet'],
      four_visions: ['4 vision','four vision','fitia mining','fitia finance','fitia shop','fitia store','quatre vision','4 piliers','four pillars','四大愿景','4 pillars','ecosystem','ecosysteme','生态系统'],
      fitia_revolution: ['revolution','revolutionnaire','革命','vision','mission','objective','goal','but','pourquoi fitia','why fitia','what makes fitia special','special','unique','different'],
      how_mining_works: ['how does mining work','how mining works','explain mining','comment miner','comment ca marche le minage','挖矿怎么','how to mine','how to start mining','mining explained','understand mining','comprendre le minage'],
      buy_machine: ['buy machine','best machine','which machine','quelle machine','哪个矿机','acheter machine','machine a acheter','recommend machine','machine price','prix machine','machine cost'],
      buy_battery: ['buy battery','best battery','which battery','quelle batterie','哪个电池','acheter batterie','battery price','prix batterie','battery duration','duree batterie','电池多久'],
      plug_in: ['plug in','plug','brancher','插入','activate','activer','start machine','demarrer machine','turn on','how to plug','how to activate','comment activer'],
      claim: ['claim','reward','reclamer','领取','harvest','collect','claim rewards','how to claim','comment reclamer','recuperer gains','get rewards'],
      how_swap_works: ['how swap works','how does swap work','explain swap','comment echanger','兑换怎么','how to swap','how to trade','swap explain','swap tutorial','convert','conversion'],
      liquidity: ['liquidity','liquidite','liquidity pool','protocol liquidity','netFtaSold','pool','reserve','why fta rejected','why swap rejected','pourquoi refuse','为什么被拒绝','not enough liquidity','pas assez de liquidite'],
      tokenomics: ['tokenomics','fta token','what is fta','c\'est quoi le fta','fta是什么','token fta','fta price','fta value','valeur fta','token supply','max supply','fta explained'],
      beginner: ['beginner','debutant','新手','how to start','getting started','commencer','开始','first time','new user','nouveau','je sais pas','我不知道','je comprends rien','i don\'t know','no idea','first step','premier pas','new to crypto','never used','jamais utilise','step by step','pas a pas','guide','tutorial','tuto'],
      wallet_setup: ['wallet','metamask','trust wallet','钱包','portefeuille','how to connect','comment connecter','create wallet','install wallet','setup wallet','installer metamask','creer un portefeuille','configurer wallet'],
      what_is_crypto: ['what is crypto','what is cryptocurrency','what is blockchain','c\'est quoi la crypto','什么是加密','什么是区块链','explain blockchain','crypto explained','crypto basics','base crypto','crypto pour les nuls'],
      deposit: ['deposit','add funds','fund','充值','入金','how to deposit','add money','send funds','transfer to','top up','recharger','deposer des fonds','ajouter argent'],
      withdraw: ['withdraw','cash out','提现','retirer','retrait','take profit','how to withdraw','convert to cash','withdraw fta','withdraw usdt','how to cash out','retirer argent'],
      security: ['security','safe','secure','securite','安全','scam','arnaque','escroquerie','is it safe','est ce sur','hack','protect','seed phrase','private key','is it legit','trust','fiable','danger','risk','risque'],
      investment: ['invest','investment','investir','投资','roi','return','profit','gain','earn','earning','收益','回报','profitable','rentable','is it worth','ca vaut le coup','worth it'],
      strategy: ['strategy','strategie','策略','best way','meilleure facon','how to maximize','maximiser','optimize','optimiser','tips','astuce','conseil','advice','recommendation'],
      machine_comparison: ['compare','comparison','which is better','différence','区别','vs','versus','mk-i','mk-ii','mk-iii','which rig','which tier','best tier','quelle machine est la meilleure'],
      price: ['price','prix','preis','价格','rate','cost','combien','valeur','how much','current rate','current price','what is the price'],
      referral: ['referral','referrer','parrain','parrainage','推荐','invite','inviter','affiliate','commission','bonus','sponsor'],
      network: ['network','polygon','matic','pol','chain','网络','réseau','gas fee','frais','gas','why polygon','which network','what chain'],
      history: ['history','historique','历史','transactions','transaction','activity','activite','leaderboard','classement','排名','my transactions','my history','past transactions','recent activity'],
      profile: ['profile','profil','account','compte','username','email','my account','mon compte','edit profile','modifier profil','save profile','change name'],
      roadmap: ['roadmap','future','upcoming','next','plan','路线图','futur','avenir','when','quand','phase','timeline','coming soon','bientot','what\'s next'],
      whatsapp: ['whatsapp','community','group','社群','群','contact','support','join','rejoindre','telegram','discord','social'],
      fta_problems: ['not working','doesn\'t work','rejected','refuse','failed','error','problem','bug','broken','marche pas','不工作','失败','报错','issue','cannot buy','cannot swap','impossible','blocked','bloque'],
      help: ['help','aide','hilfe','帮助','commands','what can you do','que peux tu faire','capabilities','features','fonctionnalites','options']
    };

    let best = null, bestScore = 0;
    for (const [topic, keywords] of Object.entries(topics)) {
      let score = 0;
      for (const kw of keywords) {
        if (m.includes(kw)) score += kw.length >= 8 ? 3 : (kw.length >= 5 ? 2 : 1);
      }
      // Boost if topic matches conversation context
      if (ctx.lastTopic === topic) score += 2;
      if (score > bestScore) { bestScore = score; best = topic; }
    }

    // Also check CHAT_INTENTS for backward compatibility
    if (bestScore < 2) {
      for (const [intent, data] of Object.entries(CHAT_INTENTS)) {
        let sc = 0;
        for (const lk of ['all', this.currentLang, 'en']) {
          if (!data.keywords[lk]) continue;
          for (const kw of data.keywords[lk]) {
            if (m.includes(kw)) sc += (data.weight || 1);
          }
        }
        if (sc > bestScore) { bestScore = sc; best = intent; }
      }
    }

    return bestScore >= 2 ? best : 'default';
  }

  _guessTopic(text) {
    const topics = ['mining','swap','beginner','price','security','tokenomics','liquidity','investment','strategy'];
    const m = text.toLowerCase();
    for (const t of topics) {
      const kw = this._getTopicKeywords(t);
      for (const k of kw) { if (m.includes(k)) return t; }
    }
    return null;
  }
  _getTopicKeywords(t) {
    const map = {
      mining: ['mine','mining','machine','rig','battery','power','hashrate','miner','claim','reward'],
      swap: ['swap','exchange','trade','convert','usdt','fta'],
      beginner: ['beginner','start','new','first','guide','how to','dont know'],
      price: ['price','cost','rate','value','worth'],
      security: ['safe','secure','scam','hack','trust','seed'],
      liquidity: ['liquidity','pool','reserve','netfta'],
      investment: ['invest','roi','profit','earn','gain','return'],
      strategy: ['strategy','best','tips','optimize','maximize']
    };
    return map[t] || [];
  }

  /* ── Basic detection helpers ──────────────────────────────── */
  _isGreeting(m) {
    const g = ['hello','hi','hey','hola','bonjour','salut','coucou','bonsoir','hallo','guten tag','moin','你好','您好','yo','sup','what\'s up','wassup','good morning','good evening','good afternoon','ola'];
    return g.some(w => m.includes(w)) || m.length <= 4;
  }
  _isThanks(m) {
    return ['thanks','thank you','thx','ty','merci','danke','谢谢','cheers','gracias','appreciate'].some(w => m.includes(w));
  }
  _isGoodbye(m) {
    return ['bye','goodbye','see you','au revoir','adieu','tschüss','再见','later','ciao','a plus','a bientot'].some(w => m.includes(w));
  }

  /* ═══════════ RESPONSE GENERATORS ══════════════════════════ */

  _respondGreeting(ctx, L) {
    if (!this.user) {
      const msgs = {
        en: `👋 Hello! Welcome to Fitia Pro.\n\nI'm your AI assistant — I can help you understand mining, swapping, the 4 visions, and guide you step by step.\n\n🔗 To get started, connect your wallet using the button at the top!\n💬 Then ask me anything.`,
        fr: `👋 Bonjour ! Bienvenue sur Fitia Pro.\n\nJe suis votre assistant IA — je peux vous expliquer le mining, les swaps, les 4 visions, et vous guider pas à pas.\n\n🔗 Commencez par connecter votre wallet en haut !\n💬 Ensuite, posez-moi vos questions.`
      };
      return msgs[L] || msgs.en;
    }
    const tips = [
      `💡 Want to buy your first machine? Just ask: "Which machine should I buy?"`,
      `💡 Curious about the 4 visions? Say: "Tell me about Fitia's 4 visions"`,
      `💡 Having issues with FTA purchases? Ask: "Why can't I swap FTA?"`,
      `💡 Want to maximize earnings? Say: "Best mining strategy"`,
      `💡 New to crypto? Say: "I'm a beginner, help me start"`
    ];
    const tip = tips[Math.floor(Math.random() * tips.length)];
    const msgs = {
      en: `👋 Welcome back${ctx.username !== 'Miner' ? ', ' + ctx.username : ''}!\n\n⚡ ${ctx.active} active machine(s) | ⛏️ ${ctx.power} | 💎 ${ctx.pending} FTA pending\n\n${tip}`,
      fr: `👋 Bon retour${ctx.username !== 'Miner' ? ', ' + ctx.username : ''}!\n\n⚡ ${ctx.active} machine(s) active(s) | ⛏️ ${ctx.power} | 💎 ${ctx.pending} FTA en attente\n\n${tip}`
    };
    return msgs[L] || msgs.en;
  }

  _respondThanks(L) {
    const msgs = {
      en: ["You're welcome! 😊 Happy mining! ⛏️", "Glad I could help! 🚀 Need anything else?", "Anytime! 💎 Keep earning that FTA!"],
      fr: ["De rien ! 😊 Bon minage ! ⛏️", "Avec plaisir ! 🚀 Besoin d'autre chose ?", "Tout le plaisir est pour moi ! 💎"]
    };
    const arr = msgs[L] || msgs.en;
    return arr[Math.floor(Math.random() * arr.length)];
  }

  _respondGoodbye(L) {
    const msgs = {
      en: ["👋 See you soon! Keep mining! ⛏️", "Bye! Come back anytime. 🚀", "Happy mining! 👋💎"],
      fr: ["👋 À bientôt ! Bon minage ! ⛏️", "Au revoir ! Revenez quand vous voulez. 🚀"]
    };
    const arr = msgs[L] || msgs.en;
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /* ── Topic-specific responses ────────────────────────────── */

  _rWhatIsFitia(ctx, L) {
    if (L === 'fr') {
      return `🪙 *Fitia Pro* est un écosystème Web3 révolutionnaire construit sur Polygon — combinant mining crypto, finance décentralisée (DeFi) et e-commerce.\n\n✨ *4 Visions Fondamentales :*\n① *Fitia Mining* — Achetez des machines NFT, gagnez des FTA passivement\n② *Fitia Finance* — Protocole DeFi : swap USDT ↔ FTA via bonding curve\n③ *Fitia Shop* — Marketplace de biens numériques et équipement\n④ *Fitia Store* — Boutique e-commerce acceptant FTA & crypto\n\n🔒 Sur Polygon Mainnet : frais bas (~0.01$), rapidité, transparence totale.\n\n💬 Dites-moi "explique les 4 visions" pour plus de détails !`;
    }
    return `🪙 *Fitia Pro* is a revolutionary Web3 ecosystem built on Polygon — combining crypto mining, decentralized finance (DeFi), and e-commerce into one unified platform.\n\n✨ *4 Core Visions:*\n① *Fitia Mining* — Purchase NFT mining machines, earn FTA tokens passively\n② *Fitia Finance* — DeFi protocol: swap USDT ↔ FTA via bonding curve\n③ *Fitia Shop* — Marketplace for digital goods & mining gear\n④ *Fitia Store* — E-commerce accepting FTA & crypto payments\n\n🔒 Built on Polygon Mainnet: low fees (~$0.01/tx), high speed, full transparency.\n\n💬 Say "tell me about the 4 visions" for more details!`;
  }

  _rFourVisions(ctx, L) {
    if (L === 'fr') {
      return `🏗️ *Les 4 Piliers de Fitia Pro*\n\n⛏️ *① Fitia Mining* — Le moteur. Achetez des machines NFT (MK-I à MK-VIII), alimentez-les avec des batteries (3-365 jours), gagnez du FTA chaque seconde.\n\n💱 *② Fitia Finance* — Notre protocole DeFi. Swap USDT ↔ FTA via bonding curve. La liquidité croît avec chaque transaction.\n\n🛒 *③ Fitia Shop* — Marketplace numérique. Équipement, upgrades, objets exclusifs dans l'écosystème.\n\n🏪 *④ Fitia Store* — E-commerce réel. Payez en FTA pour des produits physiques et services.\n\n🌐 Ces 4 piliers créent une économie circulaire auto-entretenue.`;
    }
    return `🏗️ *Fitia Pro's 4 Pillars*\n\n⛏️ *① Fitia Mining* — The engine. Buy NFT machines (MK-I to MK-VIII), power them with batteries (3-365 days), earn FTA every second.\n\n💱 *② Fitia Finance* — Our DeFi protocol. Swap USDT ↔ FTA via bonding curve. Liquidity grows with every trade.\n\n🛒 *③ Fitia Shop* — Digital marketplace for equipment, upgrades, exclusive items.\n\n🏪 *④ Fitia Store* — Real-world e-commerce. Pay with FTA for physical products & services.\n\n🌐 These 4 pillars create a self-sustaining circular economy where every activity feeds the others.`;
  }

  _rRevolution(ctx, L) {
    if (L === 'fr') {
      return `⚡ *Pourquoi Fitia Pro est Révolutionnaire*\n\n🌍 *Démocratise le mining* — Pas de matériel coûteux, juste un smartphone\n🔄 *Économie circulaire* — Les 4 visions se nourrissent mutuellement\n🔓 *Non-custodial* — Vos fonds sont TOUJOURS dans votre wallet\n📊 *Transparent* — 100% on-chain, auditable sur Polygonscan\n🌱 *Croissance organique* — Pas de pré-mine, chaque token est gagné\n\n🚀 Nous construisons une nouvelle économie numérique.`;
    }
    return `⚡ *Why Fitia Pro is Revolutionary*\n\n🌍 *Democratizes mining* — No expensive hardware, just a smartphone\n🔄 *Circular economy* — The 4 visions feed into each other\n🔓 *Non-custodial* — Your funds ALWAYS in your wallet\n📊 *Transparent* — 100% on-chain, auditable on Polygonscan\n🌱 *Organic growth* — No pre-mine, every token is earned\n\n🚀 We're building a new digital economy.`;
  }

  _rMiningHow(ctx, L) {
    if (L === 'fr') {
      return `⛏️ *Comment fonctionne le Mining Fitia*\n\n1️⃣ *Achetez une Machine* → Onglet Shop → Choisissez (MK-I à MK-VIII) → Payez en USDT (recommandé)\n2️⃣ *Achetez une Batterie* → Les machines ont besoin de batteries (3 à 365 jours)\n3️⃣ *Branchez-la* → Onglet Wallet → "Brancher une machine" → ID + type de batterie\n4️⃣ *Minage automatique* → Votre machine génère des FTA chaque seconde\n5️⃣ *Réclamez* → Bouton doré RÉCLAMER sur l'Accueil\n\n⚡ Niveau supérieur = plus de puissance\n🔋 Batterie plus longue = meilleur rapport qualité/prix\n💡 *Astuce :* Payez en USDT — ça marche toujours !`;
    }
    return `⛏️ *How Fitia Mining Works*\n\n1️⃣ *Buy a Machine* → Shop tab → Choose tier (MK-I to MK-VIII) → Pay in USDT (recommended)\n2️⃣ *Buy a Battery* → Machines need batteries to run (3 to 365 days)\n3️⃣ *Plug It In* → Wallet tab → "Plug in a machine" → Machine ID + battery type\n4️⃣ *Auto-Mining* → Your machine generates FTA every second\n5️⃣ *Claim* → Gold CLAIM button on Home to collect earnings\n\n⚡ Higher tier = more hashrate = more FTA/sec\n🔋 Longer battery = better value per day\n💡 *Tip:* Use USDT for purchases — it always works instantly!`;
  }

  _rBuyMachine(ctx, L) {
    const machines = ctx.machines.slice(0, 5);
    if (!machines.length) return ctx.isFr ? "📡 Chargement des machines... Revenez dans un instant." : "📡 Loading machine data... Check back in a moment.";

    const list = machines.map((m, i) => {
      const name = ['MK-I STARTER','MK-II STANDARD','MK-III ADVANCED','MK-IV PRO','MK-V ELITE'][i] || `MK-${String.fromCharCode(73+i)}`;
      return `${name}: ${this.formatHashrate(m.power)} — ${m.price.toFixed(2)} USDT`;
    }).join('\n');

    if (L === 'fr') {
      return `⛏️ *Machines disponibles dans le Shop :*\n\n${list}\n\n💡 *Recommandation :* Commencez avec la MK-I STARTER pour tester le système.\n💳 Payez en USDT (recommendé) — les achats FTA nécessitent de la liquidité.\n\nAllez dans l'onglet Shop pour acheter !`;
    }
    return `⛏️ *Available Machines in Shop:*\n\n${list}\n\n💡 *Recommendation:* Start with MK-I STARTER to learn the system.\n💳 Pay in USDT (recommended) — FTA purchases require liquidity.\n\nGo to the Shop tab to buy!`;
  }

  _rSwapHow(ctx, L) {
    const liq = ctx.nfs;
    const liqStatus = ctx.netFtaSold === 0n
      ? '🔴 Protocol liquidity is currently 0 — USDT→FTA swaps build the pool. Use USDT for purchases.'
      : `🟢 Protocol liquidity: ${liq.toFixed(2)} FTA — all swap operations available.`;

    if (L === 'fr') {
      return `💱 *Comment fonctionne le Swap*\n\n🔹 *USDT → FTA :* Vous payez en USDT, recevez du FTA. Ceci alimente la liquidité du protocole.\n🔹 *FTA → USDT :* Vous vendez du FTA, recevez de l'USDT. Nécessite que la liquidité soit disponible.\n\n📊 Le swap utilise une *bonding curve* — le prix s'ajuste selon l'offre et la demande.\n💰 Frais de swap : 4%\n\n${liqStatus}\n\n💡 Allez dans l'onglet Swap pour échanger !`;
    }
    return `💱 *How the Swap Works*\n\n🔹 *USDT → FTA:* Pay USDT, receive FTA. This adds to protocol liquidity — great for the ecosystem!\n🔹 *FTA → USDT:* Sell FTA, receive USDT. Requires protocol liquidity to be available.\n\n📊 The swap uses a *bonding curve* — price adjusts based on supply & demand.\n💰 Swap fee: 4%\n\n${liqStatus}\n\n💡 Go to the Swap tab to exchange!`;
  }

  _rLiquidity(ctx, L) {
    if (L === 'fr') {
      return `💧 *Liquidité du Protocole*\n\nLa liquidité affichée (${ctx.liquidity}) représente les réserves FTA dans la bonding curve du protocole.\n\n🟢 *Élevée :* Toutes les opérations fonctionnent\n🟡 *Faible :* Certaines limites\n🔴 *Zéro :* Utilisez USDT ou swap USDT→FTA d'abord\n\n💡 Chaque swap USDT→FTA augmente la liquidité pour tous les utilisateurs.`;
    }
    return `💧 *Protocol Liquidity*\n\nThe displayed liquidity (${ctx.liquidity}) represents the FTA reserves in the protocol's bonding curve.\n\n🟢 *High:* All operations work\n🟡 *Low:* Some limits apply\n🔴 *Zero:* Use USDT or swap USDT→FTA first\n\n💡 Every USDT→FTA swap increases liquidity for all users.`;
  }

  _rTokenomics(ctx, L) {
    if (L === 'fr') {
      return `🪙 *Économie du Token FTA*\n\n⚡ *Utilité :*\n• Récompense de mining — gagné chaque seconde\n• Paiement — machines, batteries, shop\n• Swap — trade USDT ↔ FTA\n• Gouvernance — futurs droits DAO\n\n📊 *Supply :*\n• Pas de pré-mine — chaque FTA est gagné par le mining\n• Plafonné par le protocole\n• Croissance organique avec l'écosystème\n\n💹 *Facteurs de valeur :* Demande de mining, liquidité, expansion de l'écosystème, base d'utilisateurs.`;
    }
    return `🪙 *FTA Token Economics*\n\n⚡ *Utility:*\n• Mining reward — earned every second from active machines\n• Payment — buy machines, batteries, shop items\n• Swap — trade USDT ↔ FTA via DeFi protocol\n• Governance — future DAO voting rights\n\n📊 *Supply:*\n• No pre-mine — every FTA is earned through mining\n• Capped by protocol parameters & bonding curve\n• Supply grows organically with ecosystem activity\n\n💹 *Value Drivers:* Mining demand, liquidity growth, ecosystem expansion, user base.`;
  }

  _rBeginner(ctx, L) {
    if (L === 'fr') {
      return `🚀 *Guide Débutant Fitia Pro*\n\nMême sans connaître la crypto, suivez ces étapes :\n\n📱 *1. Installez MetaMask* — Sur votre téléphone ou PC. Notez votre phrase de récupération sur PAPIER.\n\n💰 *2. Achetez des fonds* — Achetez du POL et USDT sur Binance ou Coinbase → envoyez à votre adresse MetaMask sur le réseau *Polygon*.\n\n🔗 *3. Connectez-vous* — Ouvrez Fitia, appuyez sur Connecter, approuvez.\n\n⛏️ *4. Achetez une Machine* — Shop → MK-I STARTER → payez en USDT.\n\n🔋 *5. Batterie + Branchez* — Achetez une batterie 30 jours, puis Wallet → Brancher.\n\n🎉 *C'est tout !* Votre machine mine du FTA automatiquement. Cliquez RÉCLAMER pour collecter.\n\n💬 Besoin d'aide à n'importe quelle étape ? Demandez-moi !`;
    }
    return `🚀 *Beginner's Guide to Fitia Pro*\n\nEven if you've never used crypto, follow these steps:\n\n📱 *1. Install MetaMask* — On your phone or computer. WRITE DOWN your recovery phrase on paper.\n\n💰 *2. Get Funds* — Buy POL and USDT on Binance or Coinbase → send to your MetaMask address on the *Polygon network*.\n\n🔗 *3. Connect* — Open Fitia, tap Connect, approve.\n\n⛏️ *4. Buy a Machine* — Shop → MK-I STARTER → pay in USDT.\n\n🔋 *5. Battery + Plug In* — Buy a 30-day battery, then Wallet → Plug In.\n\n🎉 *Done!* Your machine mines FTA automatically. Tap CLAIM to collect.\n\n💬 Need help at any step? Just ask me!`;
  }

  _rSecurity(L) {
    if (L === 'fr') {
      return `🛡️ *Fitia Pro est-il sûr ?*\n\n✅ *OUI — Voici pourquoi :*\n\n🔒 *Smart Contract* sur Polygon Mainnet — code open-source, auditable\n🔓 *Non-custodial* — vos fonds sont TOUJOURS dans votre wallet\n📊 *Transparent* — chaque transaction visible sur Polygonscan\n\n⚠️ *Règles de sécurité essentielles :*\n• NE PARTAGEZ JAMAIS votre phrase de récupération\n• Vérifiez toujours les adresses des contrats\n• La crypto est volatile — investissez raisonnablement\n• Personne de l'équipe ne vous demandera vos clés privées\n\n🤝 Rejoignez notre communauté WhatsApp pour vérifier avec de vrais utilisateurs.`;
    }
    return `🛡️ *Is Fitia Pro Safe?*\n\n✅ *YES — Here's why:*\n\n🔒 *Smart Contract* on Polygon Mainnet — open-source, auditable code\n🔓 *Non-custodial* — your funds are ALWAYS in your wallet\n📊 *Transparent* — every transaction visible on Polygonscan\n\n⚠️ *Essential Security Rules:*\n• NEVER share your recovery phrase with anyone\n• Always verify contract addresses\n• Crypto is volatile — invest responsibly\n• No team member will ever ask for your private keys\n\n🤝 Join our WhatsApp community to verify with real users.`;
  }

  _rInvestment(ctx, L) {
    const pending = ctx.pending;
    const rate = ctx.ftaPrice;
    if (L === 'fr') {
      return `📈 *Vue d'ensemble de votre investissement*\n\n⚡ Machines actives : ${ctx.active}\n💎 Récompenses en attente : ${pending} FTA\n💹 Taux actuel : 1 FTA = ${ctx.ftaPriceUsd}\n\n💡 *Conseils :*\n• Commencez avec MK-I et réinvestissez vos gains\n• Les batteries longues (90-365 jours) = meilleur rapport\n• Faites tourner plusieurs machines en parallèle\n• Réclamez régulièrement vos récompenses\n\n⚠️ Ceci n'est pas un conseil financier. Faites vos propres recherches.`;
    }
    return `📈 *Your Investment Overview*\n\n⚡ Active Machines: ${ctx.active}\n💎 Pending Rewards: ${pending} FTA\n💹 Current Rate: ${ctx.ftaPriceUsd} per FTA\n🪙 Protocol Liquidity: ${ctx.liquidity}\n\n💡 *Tips:*\n• Start with MK-I and reinvest earnings\n• Longer batteries (90-365 days) = best value/day\n• Run multiple machines in parallel\n• Claim rewards regularly to compound\n\n⚠️ This is not financial advice. Do your own research.`;
  }

  _rStrategy(ctx, L) {
    if (L === 'fr') {
      return `💎 *Stratégie pour Maximiser vos Gains*\n\n1️⃣ *Commencez petit* — Achetez MK-I, comprenez le système\n2️⃣ *Réinvestissez* — Utilisez vos premiers FTA pour une meilleure machine\n3️⃣ *Batteries longues* — 90 ou 365 jours = coût par jour minimal\n4️⃣ *Multi-machines* — Faites tourner plusieurs rigs en parallèle\n5️⃣ *Timing* — Surveillez le taux FTA/USDT pour optimiser vos swaps\n6️⃣ *Parrainage* — Invitez des amis pour des commissions passives\n\n💡 La clé : patience et réinvestissement.`;
    }
    return `💎 *Strategy to Maximize Earnings*\n\n1️⃣ *Start small* — Buy MK-I, learn the system\n2️⃣ *Reinvest* — Use your first FTA earnings for better machines\n3️⃣ *Long batteries* — 90 or 365-day = lowest cost per day\n4️⃣ *Multi-machine* — Run multiple rigs in parallel for compound hashrate\n5️⃣ *Timing* — Watch FTA/USDT rate to optimize swap timing\n6️⃣ *Referrals* — Invite friends for passive commissions\n\n💡 The key: patience + reinvestment = compound growth.`;
  }

  _rWalletSetup(L) {
    if (L === 'fr') {
      return `🦊 *Configurer votre Wallet*\n\n1️⃣ Allez sur metamask.io → Installez\n2️⃣ Créez un wallet → ✍️ NOTEZ la phrase de 12 mots sur PAPIER\n3️⃣ Ne la partagez JAMAIS. Pas de screenshot.\n4️⃣ Ajoutez Polygon : RPC https://polygon-rpc.com, Chain ID 137, Symbole POL\n\n💰 Achetez du POL (pour le gas) et USDT sur un exchange, retirez vers MetaMask sur Polygon.\n\n⚠️ JAMAIS de seed phrase à quiconque. Même pas au "support".`;
    }
    return `🦊 *Setting Up Your Wallet*\n\n1️⃣ Go to metamask.io → Install\n2️⃣ Create wallet → ✍️ WRITE DOWN the 12-word phrase on PAPER\n3️⃣ NEVER share it. No screenshots.\n4️⃣ Add Polygon: RPC https://polygon-rpc.com, Chain ID 137, Symbol POL\n\n💰 Buy POL (for gas) and USDT on an exchange, withdraw to MetaMask on Polygon.\n\n⚠️ NEVER give your seed phrase to anyone. Not even "support".`;
  }

  _rCryptoBasics(L) {
    if (L === 'fr') {
      return `🔰 *La Crypto Expliquée Simplement*\n\n📒 *Blockchain* = un registre numérique partagé. Une fois écrit, c'est immuable.\n💰 *Cryptomonnaie* = argent numérique. Pas de banque — vous contrôlez tout.\n🔑 *Wallet* = votre trousseau de clés. Comme un compte bancaire que VOUS SEUL contrôlez.\n📜 *Smart Contract* = règles automatisées sur la blockchain. Le mining et les swaps Fitia fonctionnent via smart contracts.\n🌐 *Polygon* = réseau rapide et économique (~0.01$ par transaction).\n\n💡 Fitia utilise ces technologies pour vous permettre de miner, échanger et dépenser — de façon transparente et sécurisée.`;
    }
    return `🔰 *Crypto Made Simple*\n\n📒 *Blockchain* = a shared digital ledger. Once written, it can't be changed.\n💰 *Cryptocurrency* = digital money. No bank — you control everything.\n🔑 *Wallet* = your keychain. Like a bank account that ONLY you can access.\n📜 *Smart Contract* = automated rules on the blockchain. Fitia's mining & swaps run on smart contracts.\n🌐 *Polygon* = a fast, cheap network (~$0.01 per transaction).\n\n💡 Fitia uses these technologies to let you mine, trade, and spend — transparently and securely.`;
  }

  _rDeposit(ctx, L) { return ctx.isFr ? `💰 *Ajouter des Fonds*\n1. Achetez POL+USDT sur Binance/Coinbase\n2. Retirez vers votre adresse MetaMask\n3. *Sélectionnez POLYGON !*\n4. Votre adresse : ${ctx.wallet} (Wallet → Recevoir)` : `💰 *Add Funds*\n1. Buy POL+USDT on Binance/Coinbase\n2. Withdraw to your MetaMask address\n3. *SELECT POLYGON NETWORK!*\n4. Your address: ${ctx.wallet} (Wallet → Receive)`; }
  _rWithdraw(ctx, L) { return ctx.isFr ? `💸 *Retirer vos Gains*\n1. Réclamez FTA (Accueil → RÉCLAMER)\n2. Swap FTA→USDT (Swap)\n3. Envoyez USDT vers exchange (sur Polygon !)\n4. Vendez → retirez en banque` : `💸 *Cash Out*\n1. Claim FTA (Home → CLAIM)\n2. Swap FTA→USDT (Swap tab)\n3. Send USDT to exchange (on Polygon!)\n4. Sell USDT → withdraw to bank`; }
  _rNetwork(L) { return ctx.isFr ? `🌐 Fitia sur *Polygon* (Chain ID 137).\n✅ Rapide (2-5s) | 💰 Frais ~0.01$ | 🔒 Sécurisé par Ethereum.` : `🌐 Fitia on *Polygon* (Chain ID 137).\n✅ Fast (2-5s) | 💰 ~$0.01 fees | 🔒 Secured by Ethereum.`; }
  _rWhatsapp(L) { return ctx.isFr ? `📱 Groupe: ${CONFIG.WHATSAPP_GROUP}\n📢 Chaîne: ${CONFIG.WHATSAPP_CHANNEL}` : `📱 Group: ${CONFIG.WHATSAPP_GROUP}\n📢 Channel: ${CONFIG.WHATSAPP_CHANNEL}`; }
  _rRoadmap(L) { return ctx.isFr ? `🗺️ Phase 1 ✅ (mining, swaps, parrainage) → Phase 2 🔜 (Shop, staking) → Phase 3 (Store, DAO, bridges).` : `🗺️ Phase 1 ✅ (mining, swaps, referrals) → Phase 2 🔜 (Shop, staking) → Phase 3 (Store, DAO, bridges).`; }
  _rReferral(ctx, L) { return ctx.isFr ? `👥 Votre code de parrainage = ${ctx.wallet}\n\nPartagez-le ! Vous gagnez des commissions sur les achats de vos filleuls.` : `👥 Your referral code = ${ctx.wallet}\n\nShare it! You earn commissions on your referrals' purchases.`; }

  _rBuyBattery(ctx, L) {
    const batteries = ctx.batteries.slice(0, 5);
    if (!batteries.length) return ctx.isFr ? "📡 Données batteries en cours de chargement..." : "📡 Battery data loading...";
    const list = batteries.map(b => `${b.days} days: ${b.price.toFixed(2)} USDT`).join('\n');
    return ctx.isFr
      ? `🔋 *Batteries disponibles:*\n${list}\n\n💡 Les batteries 30+ jours offrent le meilleur rapport qualité/prix. Payez en USDT.`
      : `🔋 *Available Batteries:*\n${list}\n\n💡 30+ day batteries offer best value. Pay in USDT.`;
  }

  _rPlugIn(ctx, L) {
    return ctx.isFr
      ? `🔌 *Brancher une Machine*\n1. Allez dans Wallet\n2. Section "Brancher une machine"\n3. Entrez l'ID (0, 1, 2...)\n4. Choisissez le type de batterie\n5. Cliquez BRANCHER\n\n⚡ La machine commence à miner immédiatement !`
      : `🔌 *Plug In a Machine*\n1. Go to Wallet tab\n2. "Plug in a machine" section\n3. Enter machine ID (0, 1, 2...)\n4. Choose battery type\n5. Click PLUG IN\n\n⚡ Machine starts mining immediately!`;
  }

  _rClaim(ctx, L) {
    return ctx.isFr
      ? `🎁 ${ctx.active > 0 ? `Vous avez ${ctx.pending} FTA en attente. Cliquez le bouton RÉCLAMER sur l'Accueil pour les collecter !` : "Vous n'avez pas de machine active. Achetez-en une d'abord !"}`
      : `🎁 ${ctx.active > 0 ? `You have ${ctx.pending} FTA pending. Click the CLAIM button on Home to collect!` : "You have no active machines. Buy one first!"}`;
  }

  _rPrice(ctx, L) {
    if (!this.user) return L==='fr' ? '🔗 Connectez votre wallet pour voir les prix en direct.' : '🔗 Connect your wallet to see live prices.';
    return L==='fr'
      ? `📊 *Prix en direct*\n• FTA : ${ctx.ftaPriceUsd}\n• USDT : $1.00\n• POL : ${ctx.polPrice}\n💧 Liquidité : ${ctx.liquidity}`
      : `📊 *Live Prices*\n• FTA: ${ctx.ftaPriceUsd}\n• USDT: $1.00\n• POL: ${ctx.polPrice}\n💧 Liquidity: ${ctx.liquidity}`;
  }

  _rHistory(ctx, L) {
    return L==='fr'
      ? `📋 *Historique & Activité*\n\n📊 ${ctx.totalMachines} machines | 📝 ${ctx.pending} FTA pending\n\nL'onglet History affiche :\n• Toutes vos transactions (swaps, achats, claims)\n• Filtres par type\n• Liens Polygonscan\n• Classement leaderboard\n\n💡 Cliquez sur History dans la barre du bas !`
      : `📋 *History & Activity*\n\n📊 ${ctx.totalMachines} machines | 📝 ${ctx.pending} FTA pending\n\nThe History tab shows:\n• All your transactions (swaps, purchases, claims)\n• Filter by type\n• Polygonscan links\n• Leaderboard rankings\n\n💡 Tap History in the bottom nav!`;
  }

  _rProfile(ctx, L) {
    return L==='fr'
      ? `👤 *Votre Profil*\n\n🔷 ${ctx.username}\n📊 Level ${0} | ${ctx.totalMachines} machines\n💰 Investi: $${0} | Gagné: $${0}\n\nPour modifier votre profil, allez dans Wallet → cliquez ✏️.`
      : `👤 *Your Profile*\n\n🔷 ${ctx.username}\n📊 Level ${0} | ${ctx.totalMachines} machines\n💰 Invested: $${0} | Earned: $${0}\n\nTo edit your profile, go to Wallet → tap ✏️.`;
  }

  _rProblems(ctx, L) {
    if (!this.user) return L==='fr' ? "🔗 Connectez d'abord votre wallet." : "🔗 Connect your wallet first.";
    if (ctx.netFtaSold === 0n) {
      return L==='fr'
        ? `⚠️ *Problème FTA détecté*\n\nLa liquidité du protocole est actuellement à 0.\n\n✅ *Solution :* Utilisez USDT pour les achats — ça marche toujours !\n✅ Ou faites un swap USDT→FTA d'abord pour créer la liquidité.`
        : `⚠️ *FTA Issue Detected*\n\nProtocol liquidity is currently 0.\n\n✅ *Solution:* Use USDT for purchases — always works!\n✅ Or swap USDT→FTA first to build liquidity.`;
    }
    return L==='fr'
      ? `🔍 Liquidité actuelle : ${ctx.liquidity}\n\nSi vos transactions FTA échouent :\n• Vérifiez votre solde FTA\n• Assurez-vous d'avoir assez de POL pour le gas\n• Rafraîchissez la page et réessayez`
      : `🔍 Current liquidity: ${ctx.liquidity}\n\nIf FTA transactions fail:\n• Check your FTA balance\n• Make sure you have POL for gas\n• Refresh and retry`;
  }

  _rCompare(ctx, L) {
    const machines = ctx.machines.slice(0, 5);
    if (!machines.length) return ctx.isFr ? "📡 Chargement..." : "📡 Loading...";
    const list = machines.map((m, i) => {
      const name = ['MK-I','MK-II','MK-III','MK-IV','MK-V'][i];
      return `${name}: ${this.formatHashrate(m.power)} — $${m.price.toFixed(2)}`;
    }).join('\n');
    return L === 'fr'
      ? `⚖️ *Comparaison des Machines*\n\n${list}\n\n💡 MK-I pour débuter, MK-III+ pour des gains sérieux.`
      : `⚖️ *Machine Comparison*\n\n${list}\n\n💡 MK-I to start, MK-III+ for serious earnings.`;
  }

  _rHelp(ctx, L) {
    const topics = L==='fr'
      ? '⛏️ Mining • 💱 Swap • 🏗️ 4 Visions • 🚀 Débutant • 🔒 Sécurité\n💰 Investissement • 📊 Prix • 🦊 Wallet • 📋 Historique\n💡 Dites "explique les 4 visions" ou "comment miner" !'
      : '⛏️ Mining • 💱 Swap • 🏗️ 4 Visions • 🚀 Beginner • 🔒 Security\n💰 Investment • 📊 Prices • 🦊 Wallet • 📋 History\n💡 Try "explain the 4 visions" or "how do I mine"!';
    return `${L==='fr' ? '🛠️ *Que puis-je expliquer ?*' : '🛠️ *What can I explain?*'}\n\n${topics}`;
  }

  _rFallback(ctx, L, msg) {
    // Smart fallback — analyze what the user might be asking
    const hasKeywords = (words) => words.some(w => msg.includes(w));

    if (hasKeywords(['earn','gagner','money','argent','income','revenue'])) return this._rStrategy(ctx, L);
    if (hasKeywords(['buy','acheter','purchase'])) return this._rBuyMachine(ctx, L);
    if (hasKeywords(['swap','exchange','trade','echange','convert'])) return this._rSwapHow(ctx, L);
    if (hasKeywords(['connect','link','metamask'])) return ctx.isFr ? '🔗 Cliquez sur Connecter en haut à droite.' : '🔗 Click Connect at the top right.';
    if (hasKeywords(['where','ou','find','trouver'])) return this._rHelp(ctx, L);
    if (hasKeywords(['how','comment','explain','explique','what','pourquoi','why'])) return this._rHelp(ctx, L);

    // Generic but helpful fallback
    const suggestions = L === 'fr'
      ? "💡 Essayez :\n• \"Comment fonctionne le mining ?\"\n• \"Quelles sont les 4 visions ?\"\n• \"Je suis débutant, aide-moi\"\n• \"Quelle machine acheter ?\"\n• \"Pourquoi le swap FTA ne marche pas ?\""
      : "💡 Try asking:\n• \"How does mining work?\"\n• \"What are the 4 visions?\"\n• \"I'm a beginner, help me start\"\n• \"Which machine should I buy?\"\n• \"Why isn't my FTA swap working?\"";

    return `${L === 'fr' ? "🤔 Je n'ai pas bien compris. Je suis là pour vous aider avec tout sur Fitia Pro !\n\n" : "🤔 I didn't quite catch that. I'm here to help with everything Fitia Pro!\n\n"}${suggestions}`;
  }
}

const App = new Application();
window.onload = () => App.init();
