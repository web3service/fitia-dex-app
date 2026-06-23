/**
 * FITIA PRO MINER v3 — app.js
 * Dual-contract architecture: FitiaMiningV3_Core + FitiaMiningV3_Mine
 * Internal balances (deposit → use → withdraw)
 * ============================================================== */
const CONFIG = {
  CORE:           "0xAaba9Ae712d501474351C252C931f95189895126",  // FitiaMiningV3_Core
  MINE:           "0x9eEaBEf8369812932B5f846949861fEBcFC37E73",  // FitiaMiningV3_Mine
  USDT:           "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
  FTA:            "0x5c418b12c7e9c2A8e9A71A68c6d9b319E7B1d1fd",  // FTA token
  CHAIN_ID:       137,
  WC_PROJECT_ID:  "2c10ee910a836551fbabbf7c8cc4542a",
  SUPABASE_URL:   "https://........................",
  SUPABASE_KEY:   "ey.............................................",
  WHATSAPP_GROUP:  "https://chat.whatsapp.com/BDsvPCB6xp8H8X0YaRmPFP",
  WHATSAPP_CHANNEL:"https://whatsapp.com/channel/0029VbCQhI38PgsPLbBJdV1e"
};

/* ═════════════════════════════════════════════════════════════
   i18n (compact)
   ═════════════════════════════════════════════════════════════ */
const i18n = {
en:{connect:"Connect",home:"Home",shop:"Shop",assets:"Wallet",swapNav:"Swap",historyNav:"History",
  refTitle:"👥 Referral System",refDesc:"Enter referrer's address.",bindRef:"BIND",
  power:"POWER",ftaSec:"Hashrate",pending:"PENDING",fta:"FTA",miningActive:"MINING ACTIVE",
  noMachine:"NO MACHINE",claim:"CLAIM",totalBal:"Total Balance",
  shopTitle:"⛏️ Shop",machines:"Machines",batteries:"Batteries",buy:"BUY",
  myAssets:"⚙️ Wallet & Assets",balances:"💰 Balances",
  protocol:"Protocol",wallet:"Wallet",protocolBal:"Protocol",walletBal:"Wallet",
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
  deposit:"Deposit",withdraw:"Withdraw",depositFirst:"Deposit tokens into the protocol to start mining & swapping.",
  depositHint:"Deposit USDT first in the Wallet tab to start buying.",
  confirmDeposit:"Deposit",confirmWithdraw:"Withdraw",approve:"Approve",
  withdrawFeeInfo:"3% withdrawal fee applies",
  loading:"Loading...",connWallet:"Connecting...",linking:"Linking...",
  buyingMachine:"Buying Machine",approvingUsdt:"Approving USDT...",approvingFta:"Approving FTA...",
  approving:"Approving...",confirming:"Confirming...",calcFta:"Calculating...",
  buyingBattery:"Buying Battery",pluggingIn:"Plugging in...",swapping:"Swapping...",
  claiming:"Claiming...",sending:"Sending...",depositing:"Depositing...",withdrawing:"Withdrawing...",
  machineBought:"Machine purchased!",batteryBought:"Battery purchased!",
  pluggedIn:"Machine plugged in! ⚡",swapSuccess:"Swap successful!",
  claimed:"Rewards claimed!",sentSuccess:"Sent successfully!",
  deposited:"Deposit successful!",withdrawn:"Withdrawal successful!",
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
  useUsdtInstead:"Use USDT — always works.",supabaseOffline:"📡 Supabase not connected — using offline mode.",
  depositSuggestion:"💡 Deposit USDT to the Core contract first (Wallet tab).",
  createWallet:"Create Wallet",loginWallet:"Login",useMetamask:"Use MetaMask",
  newWallet:"New Wallet",setPin:"Set your 6-digit PIN",enterPin:"Enter your PIN",
  confirmPin:"Confirm PIN",pinMismatch:"PINs don't match",pinTooShort:"PIN must be at least 4 characters",
  creatingWallet:"Creating wallet...",walletCreated:"Wallet created!",
  wrongPin:"Wrong PIN",importWallet:"Import Wallet",
  importPrivateKey:"Paste your private key",importKeyHint:"12-word phrase or hex key",
  logout:"Logout",logoutConfirm:"Logout? Make sure you have your PIN.",
  embeddedWallet:"Embedded Wallet",myWallet:"My Wallet",
  backupWarning:"⚠️ Save your private key! Lost PIN = lost funds.",
  revealKey:"Reveal Key",hideKey:"Hide Key",copiedKey:"Private key copied!",
  changePin:"Change PIN",currentPin:"Current PIN",newPin:"New PIN",pinChanged:"PIN changed!"},
fr:{connect:"Connecter",home:"Accueil",shop:"Boutique",assets:"Wallet",swapNav:"Swap",historyNav:"Historique",
  refTitle:"👥 Parrainage",refDesc:"Entrez l'adresse du parrain.",bindRef:"LIER",
  power:"PUISSANCE",ftaSec:"Hashrate",pending:"EN ATTENTE",fta:"FTA",miningActive:"MINAGE ACTIF",
  noMachine:"AUCUNE MACHINE",claim:"RÉCLAMER",totalBal:"Solde Total",
  shopTitle:"⛏️ Boutique",machines:"Machines",batteries:"Batteries",buy:"ACHETER",
  myAssets:"⚙️ Wallet & Actifs",balances:"💰 Soldes",
  protocol:"Protocole",wallet:"Portefeuille",protocolBal:"Protocole",walletBal:"Portefeuille",
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
  deposit:"Déposer",withdraw:"Retirer",depositFirst:"Déposez des tokens dans le protocole pour commencer.",
  depositHint:"Déposez d'abord de l'USDT dans Wallet pour acheter.",
  confirmDeposit:"Déposer",confirmWithdraw:"Retirer",approve:"Approuver",
  withdrawFeeInfo:"3% de frais de retrait",
  loading:"Chargement...",connWallet:"Connexion...",linking:"Liaison...",
  buyingMachine:"Achat Machine",approvingUsdt:"Approbation USDT...",approvingFta:"Approbation FTA...",
  approving:"Approbation...",confirming:"Confirmation...",calcFta:"Calcul...",
  buyingBattery:"Achat Batterie",pluggingIn:"Branchement...",swapping:"Swap...",
  claiming:"Claim...",sending:"Envoi...",depositing:"Dépôt...",withdrawing:"Retrait...",
  machineBought:"Machine achetée!",batteryBought:"Batterie achetée!",
  pluggedIn:"Machine branchée! ⚡",swapSuccess:"Échange réussi!",
  claimed:"Gains réclamés!",sentSuccess:"Envoi réussi!",
  deposited:"Dépôt réussi!",withdrawn:"Retrait réussi!",
  addrCopied:"Adresse copiée!",refLinked:"Parrain lié!",profileUpdated:"Profil mis à jour!",
  error:"Erreur",connFirst:"Connectez-vous",invalidId:"ID invalide",
  invalidAmount:"Montant invalide",invalidAddr:"Adresse invalide",wcIdMissing:"ID WalletConnect manquant!",
  days:"Jours",rig:"RIG",errRejected:"Transaction annulée",errInsufficientFunds:"Solde insuffisant",
  errNetwork:"Erreur réseau.",errTimeout:"Délai expiré.",errContract:"Transaction échouée.",
  errGeneric:"Une erreur est survenue.",errAlreadyPending:"Transaction en cours.",
  errNonce:"Erreur de nonce.",errLowLiquidity:"Liquidité trop faible.",
  errNoFtaLiquidity:"Pas de liquidité FTA.",errMaxFtaSell:"Max {max} FTA.",
  errSwapRejected:"Échange rejeté.",errApprovalFailed:"Approbation échouée.",
  useUsdtInstead:"Utilisez USDT.",supabaseOffline:"📡 Supabase non connecté — mode hors ligne.",
  depositSuggestion:"💡 Déposez de l'USDT dans le contrat Core (onglet Wallet).",
  createWallet:"Créer Wallet",loginWallet:"Connexion",useMetamask:"Utiliser MetaMask",
  newWallet:"Nouveau Wallet",setPin:"Définissez votre code PIN",enterPin:"Entrez votre PIN",
  confirmPin:"Confirmer PIN",pinMismatch:"Les PIN ne correspondent pas",pinTooShort:"PIN de 4 caractères minimum",
  creatingWallet:"Création du wallet...",walletCreated:"Wallet créé !",
  wrongPin:"PIN incorrect",importWallet:"Importer Wallet",
  importPrivateKey:"Collez votre clé privée",importKeyHint:"Phrase de 12 mots ou clé hex",
  logout:"Déconnexion",logoutConfirm:"Se déconnecter ? Gardez votre PIN.",
  embeddedWallet:"Wallet Intégré",myWallet:"Mon Wallet",
  backupWarning:"⚠️ Sauvegardez votre clé privée ! PIN perdu = fonds perdus.",
  revealKey:"Afficher Clé",hideKey:"Cacher Clé",copiedKey:"Clé copiée !",
  changePin:"Changer PIN",currentPin:"PIN actuel",newPin:"Nouveau PIN",pinChanged:"PIN changé !"},
de:{connect:"Verbinden",home:"Home",shop:"Shop",assets:"Wallet",swapNav:"Swap",historyNav:"Verlauf",
  totalBal:"Gesamt",shopTitle:"⛏️ Shop",swapTitle:"💱 Tausch",myAssets:"⚙️ Wallet",
  loading:"Laden...",connWallet:"Verbindung...",error:"Fehler",connFirst:"Verbinden",
  noHistory:"Keine Transaktionen.",all:"Alle",deposit:"Einzahlen",withdraw:"Abheben"},
zh:{connect:"连接",home:"首页",shop:"商店",assets:"钱包",swapNav:"兑换",historyNav:"历史",
  totalBal:"总余额",shopTitle:"⛏️ 商店",swapTitle:"💱 兑换",myAssets:"⚙️ 钱包",
  loading:"加载中...",connWallet:"连接中...",error:"错误",connFirst:"请连接",
  noHistory:"暂无记录。",all:"全部",deposit:"存入",withdraw:"提取"},
sg:{connect:"Connect",home:"Home",shop:"Shop",assets:"Wallet",swapNav:"Swap",historyNav:"History",
  totalBal:"Balance",shopTitle:"⛏️ Shop",swapTitle:"💱 Swap",myAssets:"⚙️ Wallet",
  loading:"Loading...",connWallet:"Connecting...",error:"Error",connFirst:"Connect",
  noHistory:"No transactions.",all:"All",deposit:"Deposit",withdraw:"Withdraw"}
};

/* ═════════════════════════════════════════════════════════════
   CHAT INTENTS + RESPONSES
   ═════════════════════════════════════════════════════════════ */
const CHAT_INTENTS = {
  what_is_fitia:{weight:5,keywords:{all:['what is fitia','c quoi fitia','fitia pro','about fitia','介绍','fitia是什么']}},
  four_visions:{weight:5,keywords:{all:['4 vision','four vision','fitia mining','fitia finance','fitia shop','fitia store','四大愿景']}},
  how_mining_works:{weight:4,keywords:{all:['how mining works','explain mining','mine','mining','minage','挖矿','how to mine','comment miner']}},
  how_swap_works:{weight:4,keywords:{all:['swap','exchange','échanger','兑换','how to swap','swap fta','swap usdt']}},
  tokenomics:{weight:4,keywords:{all:['tokenomics','fta token','what is fta','fta price','token supply']}},
  liquidity:{weight:4,keywords:{all:['liquidity','liquidité','liquidity pool','protocol liquidity','netfta']}},
  beginner_guide:{weight:5,keywords:{all:['beginner','débutant','新手','how to start','getting started','first time','premier pas']}},
  deposit_help:{weight:4,keywords:{all:['deposit','déposer','存入','how to deposit','comment déposer','add funds','recharger']}},
  wallet_setup:{weight:4,keywords:{all:['wallet','metamask','钱包','how to connect','create wallet']}},
  security:{weight:4,keywords:{all:['security','safe','sécurité','安全','scam','is it safe']}},
  history_related:{weight:3,keywords:{all:['history','historique','历史','transactions','leaderboard','classement']}},
  greeting:{weight:1,keywords:{all:['hello','hi','hey','bonjour','salut','hallo','你好']}},
  thanks:{weight:1,keywords:{all:['thanks','merci','danke','谢谢']}},
  help:{weight:2,keywords:{all:['help','aide','hilfe','帮助']}},
  fta_problems:{weight:4,keywords:{all:['fta not working','fta rejected','cannot buy','cannot swap','refuse','marche pas']}}
};

const CHAT_RESPONSES = {
  what_is_fitia:{en:`🪙 *Fitia Pro v3* — Revolutionary Web3 ecosystem on Polygon.\n\n✨ 4 Visions + Dual-contract architecture (Core + Mine).\n🔒 Deposit tokens → use protocol → withdraw anytime.`},
  four_visions:{en:`🏗️ *4 Pillars*\n⛏️ Mining — NFT machines, earn FTA every second\n💱 Finance — USDT↔FTA swaps via bonding curve\n🛒 Shop — Digital marketplace\n🏪 Store — E-commerce with FTA payments`},
  how_mining_works:{en:`⛏️ 1️⃣ Deposit USDT (Wallet → Deposit) 2️⃣ Buy Machine (Shop) 3️⃣ Buy Battery 4️⃣ Plug In (Wallet) 5️⃣ Earn FTA/sec 6️⃣ Claim\n⚡ Higher tier = more power | 🔋 Longer battery = better value\n💡 Deposit USDT to Core first — it's your protocol balance!`},
  deposit_help:{en:`📥 *How to Deposit*\n1️⃣ Go to Wallet tab\n2️⃣ Tap "Deposit" on the token you want\n3️⃣ Approve the token if needed\n4️⃣ Enter amount & confirm\n\nYour tokens are held in the Core contract — secure and ready to use for mining & swaps. Withdraw anytime (3% fee).`},
  how_swap_works:{en:`💱 Swaps use your *protocol balance* (not wallet).\nUSDT→FTA adds liquidity. FTA→USDT needs liquidity > 0.\nBonding curve adjusts prices automatically.`},
  default:{en:`🤔 I'm the Fitia Assistant — ask me about: Mining, Swaps, Deposits, 4 Visions, Getting Started, or anything Fitia Pro v3!`}
};

/* ═════════════════════════════════════════════════════════════
   ABIs — FitiaMiningV3
   ═════════════════════════════════════════════════════════════ */
const CORE_ABI = [
  // Token refs
  "function usdt() view returns (address)",
  "function fta() view returns (address)",
  "function miner() view returns (address)",
  // Params
  "function difficulty() view returns (uint256)",
  "function baseRate() view returns (uint256)",
  "function slope() view returns (uint256)",
  "function netFta() view returns (uint256)",
  "function devFee() view returns (uint256)",
  "function comRates(uint256) view returns (uint256)",
  "function swapFee() view returns (uint256)",
  "function claimFee() view returns (uint256)",
  "function wFee() view returns (uint256)",
  "function gasFee() view returns (uint256)",
  "function feeRecv() view returns (address)",
  // Balances
  "function uBal(address) view returns (uint256)",
  "function fBal(address) view returns (uint256)",
  "function pol(address) view returns (uint256)",
  "function tU() view returns (uint256)",
  "function tF() view returns (uint256)",
  "function tPol() view returns (uint256)",
  // Referral
  "function refr(address) view returns (address)",
  "function uid(address) view returns (uint256)",
  "function aToId(uint256) view returns (address)",
  // Rates
  "function rate() view returns (uint256)",
  "function buyFta(uint256) view returns (uint256)",
  "function sellFta(uint256) view returns (uint256)",
  "function costFta(uint256) view returns (uint256)",
  // User info
  "function myInfo() view returns (uint256 id, uint256 p, uint256 ub, uint256 fb)",
  // Deposits
  "function depositPol() payable",
  "function depositUsdt(uint256 a)",
  "function depositFta(uint256 a)",
  // Withdrawals
  "function withdrawPol(uint256 a)",
  "function withdrawUsdt(uint256 a)",
  "function withdrawFta(uint256 a)",
  // Referral setters
  "function setReferrer(address)",
  "function setReferrerById(uint256)",
  // Swaps (v3: amount, minOut, deadline)
  "function swapUForF(uint256 a, uint256 m, uint256 d)",
  "function swapFForU(uint256 a, uint256 m, uint256 d)",
  // MetaTx
  "function nonce(address) view returns (uint256)"
];

const MINE_ABI = [
  // Core ref
  "function core() view returns (address)",
  // Counts
  "function mCount() view returns (uint256)",
  "function bCount() view returns (uint256)",
  // Types
  "function mTypes(uint256) view returns (uint256 price, uint256 power)",
  "function bTypes(uint256) view returns (uint256 price, uint256 dur)",
  // Power
  "function powerOf(address) view returns (uint256)",
  // User data
  "function myMachines(address) view returns (tuple(uint256 tid, uint256 exp)[])",
  "function myBattery(address, uint256) view returns (uint256)",
  "function myInfo(address) view returns (uint256 mc, uint256 ap, uint256 lc)",
  // Purchases
  "function buyMachine(uint256 t)",
  "function buyMachineFTA(uint256 t)",
  "function buyBattery(uint256 t)",
  "function buyBatteryFTA(uint256 t)",
  // Mining
  "function plugInMachine(uint256 mi, uint256 bi)",
  "function claimRewards()"
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
const DEADLINE_MINUTES = 20;

/* ═════════════════════════════════════════════════════════════
   SUPABASE CLIENT
   ═════════════════════════════════════════════════════════════ */
class SupabaseClient {
  constructor(url, key) {
    this.url = url.replace(/\/$/, '');
    this.key = key;
    this.headers = { 'apikey': key, 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' };
  }
  async _fetch(method, path, body = null) {
    const opts = { method, headers: { ...this.headers } };
    if (body) opts.body = JSON.stringify(body);
    let url = `${this.url}/rest/v1/${path}`;
    if (method === 'GET' && body) {
      const params = new URLSearchParams();
      if (body.select) params.append('select', body.select);
      if (body.order) params.append('order', body.order);
      if (body.limit) params.append('limit', body.limit);
      if (body.offset) params.append('offset', body.offset);
      if (body.filter) for (const [col, val] of Object.entries(body.filter)) params.append(col, `eq.${val}`);
      const qs = params.toString(); if (qs) url += '?' + qs;
      delete opts.body;
    }
    try {
      const res = await fetch(url, opts);
      if (!res.ok) { const et = await res.text(); throw new Error(`Supabase ${res.status}: ${et}`); }
      return res.status === 204 ? null : await res.json();
    } catch (e) { console.warn('[Supabase]', e.message); return null; }
  }
  async getUser(walletAddress) {
    const data = await this._fetch('GET', 'users', { select: '*', filter: { wallet_address: walletAddress.toLowerCase() }, limit: 1 });
    return data && data.length ? data[0] : null;
  }
  async createUser(walletAddress, username, email) {
    const existing = await this.getUser(walletAddress);
    if (existing) return existing;
    return await this._fetch('POST', 'users', { wallet_address: walletAddress.toLowerCase(), username: username || null, email: email || null });
  }
  async updateUser(walletAddress, updates) {
    const qs = `wallet_address=eq.${encodeURIComponent(walletAddress.toLowerCase())}`;
    try { const res = await fetch(`${this.url}/rest/v1/users?${qs}`, { method: 'PATCH', headers: this.headers, body: JSON.stringify(updates) }); return res.ok; } catch (e) { return false; }
  }
  async getAllUsers(limit = 100) {
    return await this._fetch('GET', 'users', { select: 'wallet_address,username,level,total_earned,total_invested,machines_count', order: 'total_earned.desc', limit }) || [];
  }
  async getTransactions(walletAddress, limit = 50, offset = 0, typeFilter = null) {
    const params = { select: '*', filter: { wallet_address: walletAddress.toLowerCase() }, order: 'created_at.desc', limit, offset };
    if (typeFilter) params.filter.tx_type = typeFilter;
    return await this._fetch('GET', 'transactions', params) || [];
  }
  async createTransaction(tx) {
    return await this._fetch('POST', 'transactions', { wallet_address: (tx.walletAddress || '').toLowerCase(), tx_type: tx.type, token_from: tx.tokenFrom || null, token_to: tx.tokenTo || null, amount_from: tx.amountFrom || null, amount_to: tx.amountTo || null, tx_hash: tx.txHash || null, status: tx.status || 'pending', metadata: tx.metadata ? JSON.stringify(tx.metadata) : null });
  }
  async logActivity(walletAddress, action, details) {
    try { await this._fetch('POST', 'activity_log', { wallet_address: walletAddress.toLowerCase(), action, details: details || null }); } catch (e) {}
  }
  async getActivityLog(walletAddress, limit = 20) {
    return await this._fetch('GET', 'activity_log', { select: '*', filter: { wallet_address: walletAddress.toLowerCase() }, order: 'created_at.desc', limit }) || [];
  }
  async getLeaderboard(limit = 20) {
    return await this._fetch('GET', 'users', { select: 'wallet_address,username,level,total_earned,total_invested,machines_count', order: 'total_earned.desc', limit }) || [];
  }
}

/* ═════════════════════════════════════════════════════════════
   EMBEDDED WALLET (zero dependency, works in APK)
   PBKDF2 + AES-GCM encrypted private key in localStorage
   ═════════════════════════════════════════════════════════════ */
class EmbeddedWallet {
  static STORAGE_KEY = 'fitia_ew_v1';
  static SALT_KEY = 'fitia_ew_salt_v1';

  // Check if an embedded wallet exists
  static exists() {
    return !!localStorage.getItem(this.STORAGE_KEY);
  }

  // Create a new wallet, encrypt with PIN, return address
  static async create(pin) {
    if (!pin || pin.length < 4) throw new Error('PIN must be at least 4 characters');
    const wallet = ethers.Wallet.createRandom();
    const encrypted = await this._encrypt(wallet.privateKey, pin);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(encrypted));
    return wallet.address;
  }

  // Import existing private key
  static async importKey(privateKey, pin) {
    if (!pin || pin.length < 4) throw new Error('PIN must be at least 4 characters');
    const wallet = new ethers.Wallet(privateKey);
    const encrypted = await this._encrypt(wallet.privateKey, pin);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(encrypted));
    return wallet.address;
  }

  // Decrypt wallet and return signer
  static async getSigner(provider, pin) {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (!raw) throw new Error('No wallet found');
    const encrypted = JSON.parse(raw);
    const privateKey = await this._decrypt(encrypted, pin);
    if (!privateKey) throw new Error('Invalid PIN');
    const wallet = new ethers.Wallet(privateKey, provider);
    return wallet;
  }

  // Export private key (for backup)
  static async exportPrivateKey(pin) {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (!raw) throw new Error('No wallet found');
    const encrypted = JSON.parse(raw);
    const privateKey = await this._decrypt(encrypted, pin);
    if (!privateKey) throw new Error('Invalid PIN');
    return privateKey;
  }

  // Delete wallet
  static delete() {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.SALT_KEY);
  }

  // Change PIN
  static async changePin(oldPin, newPin) {
    const pk = await this.exportPrivateKey(oldPin);
    const encrypted = await this._encrypt(pk, newPin);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(encrypted));
  }

  // ── Crypto internals ────────────────────────────────────
  static async _encrypt(plaintext, pin) {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await this._deriveKey(pin, salt);
    const encoded = new TextEncoder().encode(plaintext);
    const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);
    return {
      salt: Array.from(salt),
      iv: Array.from(iv),
      ct: Array.from(new Uint8Array(ciphertext))
    };
  }

  static async _decrypt(encrypted, pin) {
    try {
      const salt = new Uint8Array(encrypted.salt);
      const iv = new Uint8Array(encrypted.iv);
      const ct = new Uint8Array(encrypted.ct);
      const key = await this._deriveKey(pin, salt);
      const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ct);
      return new TextDecoder().decode(plaintext);
    } catch (e) {
      return null; // Wrong PIN
    }
  }

  static async _deriveKey(pin, salt) {
    const keyMaterial = await crypto.subtle.importKey(
      'raw', new TextEncoder().encode(pin), 'PBKDF2', false, ['deriveKey']
    );
    return crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt, iterations: 600000, hash: 'SHA-256' },
      keyMaterial, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']
    );
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
    this.STORAGE_CLAIM = "fitia_claim_v3";
    this.STORAGE_MACHINES = "fitia_machines_v4";
    this.STORAGE_BATTERIES = "fitia_batteries_v4";
    this.shopMachinesData = []; this.shopBatteriesData = []; this.isLoadingShop = false;
    this.polPriceUsd = 0; this.ftaPriceUsd = 0;
    this.userMachines = []; this.userBatteries = {}; this.userLastClaimTime = 0; this.batteryTypeDurations = {};
    this.vizContext = null; this.vizBars = []; this.sendTokenSymbol = 'POL';
    this.chatInitialized = false; this.chatHistory = [];
    this.netFtaVal = 0n;
    // Internal balances
    this.balCorePol = 0n; this.balCoreUsdt = 0n; this.balCoreFta = 0n;
    this.balWalletPol = 0n; this.balWalletUsdt = 0n; this.balWalletFta = 0n;
    // Contract params
    this.swapFeePct = 4; this.claimFeePct = 3; this.wFeePct = 3; this.devFeePct = 5;
    // Wallet mode: 'embedded' | 'metamask' | null
    this.walletMode = null; this.embeddedPin = null;
    // Deposit / Withdraw state
    this.depositToken = null; this.withdrawToken = null;
    // Supabase
    this.db = null; this.dbOnline = false; this.profileData = null;
    // History
    this.historyFilter = 'all'; this.historyData = []; this.historyStats = null;
    this.activityData = []; this.leaderboardData = [];
    this.localTxLog = JSON.parse(localStorage.getItem('fitia_tx_log_v3') || '[]');
    const savedLang = localStorage.getItem('fitia_lang');
    this.currentLang = savedLang && i18n[savedLang] ? savedLang : 'en';
  }

  /* ── Helpers ──────────────────────────────────────────────── */
  t(key) { return i18n[this.currentLang]?.[key] || i18n['en'][key] || key; }
  formatUsd(v) { return '$' + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  formatHashrate(h) { if (h <= 0) return '0 H/s'; const u = ['H/s', 'KH/s', 'MH/s', 'GH/s', 'TH/s', 'PH/s']; let v = h, i = 0; while (v >= 1000 && i < u.length - 1) { v /= 1000; i++; } return v.toFixed(2) + ' ' + u[i]; }
  formatTimeRemaining(s) { if (s <= 0) return this.t('expired'); const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60); if (d > 1) return `${d}d ${h}h`; if (d === 1) return `1d ${h}h`; if (h > 0) return `${h}h ${m}m`; return `${m}m`; }
  getBatteryDurationDays(id) { if (this.batteryTypeDurations[id] !== undefined) return this.batteryTypeDurations[id]; return { 0: 3, 1: 7, 2: 15, 3: 30, 4: 90, 5: 180, 6: 270, 7: 365 }[id] || 30; }
  _loadLocalAssets() { try { this.userMachines = JSON.parse(localStorage.getItem(this.STORAGE_MACHINES)) || []; } catch (e) { this.userMachines = []; } try { this.userBatteries = JSON.parse(localStorage.getItem(this.STORAGE_BATTERIES)) || {}; } catch (e) { this.userBatteries = {}; } try { this.userLastClaimTime = parseInt(localStorage.getItem(this.STORAGE_CLAIM)) || Math.floor(Date.now() / 1000); } catch (e) { this.userLastClaimTime = Math.floor(Date.now() / 1000); } }
  _saveLocalAssets() { localStorage.setItem(this.STORAGE_MACHINES, JSON.stringify(this.userMachines)); localStorage.setItem(this.STORAGE_BATTERIES, JSON.stringify(this.userBatteries)); localStorage.setItem(this.STORAGE_CLAIM, String(this.userLastClaimTime || Math.floor(Date.now() / 1000))); }
  _logLocalTx(tx) { this.localTxLog.unshift({ ...tx, timestamp: Date.now() }); if (this.localTxLog.length > 300) this.localTxLog.length = 300; localStorage.setItem('fitia_tx_log_v3', JSON.stringify(this.localTxLog)); }
  async _recordTx(type, tokenFrom, tokenTo, amountFrom, amountTo, txHash, metadata) {
    this._logLocalTx({ type, tokenFrom, tokenTo, amountFrom, amountTo, txHash, metadata });
    if (this.dbOnline) {
      try { await this.db.createTransaction({ walletAddress: this.user, type, tokenFrom, tokenTo, amountFrom, amountTo, txHash, status: txHash ? 'pending' : 'confirmed', metadata }); } catch (e) {}
    }
  }
  async _logActivity(action, details) {
    if (this.dbOnline) { try { await this.db.logActivity(this.user, action, details); } catch (e) {} }
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
  async init() {
    this.setLanguage(this.currentLang);
    await this.initSupabase();
    // Auto-prompt login if embedded wallet exists
    if (EmbeddedWallet.exists()) {
      setTimeout(() => this.connect(), 600);
    }
  }

  /* ── Supabase Init ──────────────────────────────────────────── */
  async initSupabase() {
    if (!CONFIG.SUPABASE_URL || CONFIG.SUPABASE_URL.includes('................')) { console.log('[Supabase] Not configured — offline mode'); return; }
    try {
      this.db = new SupabaseClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
      const test = await this.db._fetch('GET', 'users', { select: 'wallet_address', limit: 1 });
      this.dbOnline = test !== null;
      console.log('[Supabase]', this.dbOnline ? 'Connected' : 'Offline');
    } catch (e) { console.log('[Supabase] Error:', e.message); }
  }

  /* ── Prices ────────────────────────────────────────────────── */
  async fetchMarketPrices() {
    this.polPriceUsd = 0;
    try { const r = await fetch('https://api.dexscreener.com/latest/dex/tokens/0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0'); const d = await r.json(); if (d.pairs?.length) this.polPriceUsd = parseFloat(d.pairs[0].priceUsd) || 0; } catch (e) {}
    if (!this.polPriceUsd) { try { const r = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd'); const d = await r.json(); this.polPriceUsd = d['matic-network']?.usd || 0; } catch (e2) {} }
    if (!this.polPriceUsd) this.polPriceUsd = 0.70;
  }

  /* ── Connect (v3: wallet modal) ────────────────────────────── */
  async connect() {
    const ewExists = EmbeddedWallet.exists();
    if (ewExists) {
      // Show login modal (PIN or MetaMask choice)
      this.showWalletModal('login');
    } else {
      // Show create/import modal
      this.showWalletModal('create');
    }
  }

  showWalletModal(mode) {
    // Remove existing modal if any
    const ex = document.getElementById('wallet-modal-overlay');
    if (ex) ex.remove();

    const hasMetaMask = !!window.ethereum;
    const hasWC = typeof EthereumProvider !== 'undefined' && CONFIG.WC_PROJECT_ID && !CONFIG.WC_PROJECT_ID.includes('...');
    const hasExternal = hasMetaMask || hasWC;
    const ewExists = EmbeddedWallet.exists();

    const overlay = document.createElement('div');
    overlay.id = 'wallet-modal-overlay';
    overlay.className = 'wallet-modal-overlay';

    let content = '';
    if (mode === 'login') {
      content = `
        <div class="wallet-modal">
          <div class="wallet-modal-header">
            <div class="wallet-modal-logo">⚡</div>
            <h2>FITIA PRO</h2>
            <p>${this.t('enterPin')}</p>
          </div>
          <input type="password" id="ew-pin" class="game-input" placeholder="PIN" maxlength="6" inputmode="numeric" pattern="[0-9]*" autocomplete="off" style="text-align:center;font-size:1.5rem;letter-spacing:12px;">
          <button class="btn-primary" onclick="App.loginEmbedded()">${this.t('loginWallet')}</button>
          ${ewExists ? `<button class="btn-wallet-modal-secondary" onclick="App.showWalletModal('forgot')">Forgot PIN?</button>` : ''}
          ${hasExternal ? `<div class="wallet-modal-divider"><span>OR</span></div><button class="btn-wallet-modal-secondary" onclick="App.connectMetamask()">
            <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" style="width:20px;height:20px;">
            ${this.t('useMetamask')}
          </button>` : ''}
        </div>`;
    } else if (mode === 'create') {
      content = `
        <div class="wallet-modal">
          <div class="wallet-modal-header">
            <div class="wallet-modal-logo">🔐</div>
            <h2>${this.t('newWallet')}</h2>
            <p>${this.t('setPin')}</p>
          </div>
          <input type="password" id="ew-pin-new" class="game-input" placeholder="PIN" maxlength="6" inputmode="numeric" pattern="[0-9]*" autocomplete="off" style="text-align:center;font-size:1.5rem;letter-spacing:12px;">
          <input type="password" id="ew-pin-confirm" class="game-input" placeholder="${this.t('confirmPin')}" maxlength="6" inputmode="numeric" pattern="[0-9]*" autocomplete="off" style="text-align:center;font-size:1.5rem;letter-spacing:12px;">
          <p class="backup-warning">⚠️ ${this.t('backupWarning')}</p>
          <button class="btn-primary" onclick="App.createEmbeddedAccount()">${this.t('createWallet')}</button>
          ${ewExists ? `<button class="btn-wallet-modal-secondary" onclick="App.showWalletModal('login')">← ${this.t('loginWallet')}</button>` : ''}
          ${hasExternal ? `<div class="wallet-modal-divider"><span>OR</span></div><button class="btn-wallet-modal-secondary" onclick="App.connectMetamask()">
            <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" style="width:20px;height:20px;">
            ${this.t('useMetamask')}
          </button>` : ''}
          <button class="btn-wallet-modal-secondary" onclick="App.showWalletModal('import')" style="margin-top:8px;">📥 ${this.t('importWallet')}</button>
        </div>`;
    } else if (mode === 'import') {
      content = `
        <div class="wallet-modal">
          <div class="wallet-modal-header">
            <div class="wallet-modal-logo">📥</div>
            <h2>${this.t('importWallet')}</h2>
            <p>${this.t('importKeyHint')}</p>
          </div>
          <textarea id="ew-import-key" class="game-input" placeholder="${this.t('importPrivateKey')}" style="height:80px;text-align:left;font-size:0.8rem;resize:none;"></textarea>
          <input type="password" id="ew-pin-new" class="game-input" placeholder="${this.t('setPin')}" maxlength="6" inputmode="numeric" pattern="[0-9]*" autocomplete="off" style="text-align:center;font-size:1.5rem;letter-spacing:12px;">
          <input type="password" id="ew-pin-confirm" class="game-input" placeholder="${this.t('confirmPin')}" maxlength="6" inputmode="numeric" pattern="[0-9]*" autocomplete="off" style="text-align:center;font-size:1.5rem;letter-spacing:12px;">
          <button class="btn-primary" onclick="App.importEmbeddedAccount()">${this.t('importWallet')}</button>
          <button class="btn-wallet-modal-secondary" onclick="App.showWalletModal('create')">← Back</button>
        </div>`;
    } else if (mode === 'forgot') {
      content = `
        <div class="wallet-modal">
          <div class="wallet-modal-header">
            <div class="wallet-modal-logo">🆘</div>
            <h2>Lost PIN?</h2>
            <p style="font-size:0.8rem;color:var(--text-muted);">Your wallet is encrypted with your PIN. Without it, you cannot recover your funds. You can:</p>
          </div>
          <button class="btn-wallet-modal-secondary" onclick="App.showWalletModal('import')">📥 Import wallet with private key</button>
          <button class="btn-danger-outline" onclick="App.resetEmbeddedWallet()">🗑️ Reset & create new wallet (funds lost)</button>
          <button class="btn-wallet-modal-secondary" onclick="App.showWalletModal('login')">← Try again</button>
          ${hasExternal ? `<div class="wallet-modal-divider"><span>OR</span></div><button class="btn-wallet-modal-secondary" onclick="App.connectMetamask()">${this.t('useMetamask')}</button>` : ''}
        </div>`;
    }

    overlay.innerHTML = content;
    document.body.appendChild(overlay);

    // Focus PIN input
    setTimeout(() => {
      const input = overlay.querySelector('input');
      if (input) input.focus();
      // Enter key to submit
      overlay.onkeydown = (e) => {
        if (e.key === 'Enter') {
          if (mode === 'login') this.loginEmbedded();
          else if (mode === 'create') this.createEmbeddedAccount();
          else if (mode === 'import') this.importEmbeddedAccount();
        }
      };
    }, 100);
  }

  closeWalletModal() {
    const overlay = document.getElementById('wallet-modal-overlay');
    if (overlay) overlay.remove();
  }

  async createEmbeddedAccount() {
    const pin = document.getElementById('ew-pin-new')?.value;
    const confirm = document.getElementById('ew-pin-confirm')?.value;
    if (!pin || pin.length < 4) return this.showToast(this.t('pinTooShort'), true);
    if (pin !== confirm) return this.showToast(this.t('pinMismatch'), true);

    this.setLoader(true, this.t('creatingWallet'));
    try {
      const address = await EmbeddedWallet.create(pin);
      this.embeddedPin = pin;
      this.walletMode = 'embedded';
      this.closeWalletModal();
      await this.initEmbeddedWallet(address);
      // Show backup modal after creation
      setTimeout(() => this.showBackupModal(), 1000);
    } catch (e) { this.showError(e); }
    this.setLoader(false);
  }

  async importEmbeddedAccount() {
    const key = document.getElementById('ew-import-key')?.value.trim();
    if (!key) return this.showToast('Paste your private key or 12-word phrase', true);
    const pin = document.getElementById('ew-pin-new')?.value;
    const confirm = document.getElementById('ew-pin-confirm')?.value;
    if (!pin || pin.length < 4) return this.showToast(this.t('pinTooShort'), true);
    if (pin !== confirm) return this.showToast(this.t('pinMismatch'), true);

    this.setLoader(true, 'Importing...');
    try {
      // Support both private key hex and mnemonic
      let address;
      if (key.startsWith('0x') && key.length === 66) {
        address = await EmbeddedWallet.importKey(key, pin);
      } else {
        // Assume mnemonic
        const wallet = ethers.Wallet.fromPhrase(key);
        address = await EmbeddedWallet.importKey(wallet.privateKey, pin);
      }
      this.embeddedPin = pin;
      this.walletMode = 'embedded';
      this.closeWalletModal();
      await this.initEmbeddedWallet(address);
    } catch (e) { this.showToast('Invalid key format', true); }
    this.setLoader(false);
  }

  async loginEmbedded() {
    const pin = document.getElementById('ew-pin')?.value;
    if (!pin) return;

    this.setLoader(true, 'Decrypting...');
    try {
      // Try decrypting with provided PIN
      const pk = await EmbeddedWallet.exportPrivateKey(pin);
      if (!pk) { this.showToast(this.t('wrongPin'), true); this.setLoader(false); return; }
      const wallet = new ethers.Wallet(pk);
      this.embeddedPin = pin;
      this.walletMode = 'embedded';
      this.closeWalletModal();
      await this.initEmbeddedWallet(wallet.address);
    } catch (e) { this.showToast(this.t('wrongPin'), true); }
    this.setLoader(false);
  }

  async initEmbeddedWallet(address) {
    // Use public RPC for Polygon (no MetaMask needed)
    this.provider = new ethers.JsonRpcProvider('https://polygon-rpc.com', CONFIG.CHAIN_ID, { staticNetwork: true });
    this.signer = new ethers.Wallet(await EmbeddedWallet.exportPrivateKey(this.embeddedPin), this.provider);
    this.user = address;
    await this.initContracts();
  }

  async connectMetamask() {
    this.closeWalletModal();
    if (window.ethereum) {
      this.setLoader(true, this.t('connWallet'));
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        this.provider = new ethers.BrowserProvider(window.ethereum);
        this.signer = await this.provider.getSigner();
        this.user = await this.signer.getAddress();
        this.walletMode = 'metamask';
        const n = await this.provider.getNetwork();
        if (Number(n.chainId) !== CONFIG.CHAIN_ID) await this.switchNetwork();
        await this.initContracts();
        window.ethereum.on('accountsChanged', () => window.location.reload());
        window.ethereum.on('chainChanged', () => window.location.reload());
      } catch (e) { this.showError(e); } finally { this.setLoader(false); }
    } else if (typeof EthereumProvider !== 'undefined' && CONFIG.WC_PROJECT_ID && !CONFIG.WC_PROJECT_ID.includes('...')) {
      this.setLoader(true, this.t('connWallet'));
      try {
        const wc = await EthereumProvider.init({ projectId: CONFIG.WC_PROJECT_ID, chains: [CONFIG.CHAIN_ID], showQrModal: true, methods: ['eth_sendTransaction', 'personal_sign'], metadata: { name: 'FITIA PRO MINER v3', description: 'Mining DApp', url: window.location.origin, icons: [window.location.origin + '/logo.png'] } });
        await wc.enable(); this.provider = new ethers.BrowserProvider(wc); this.signer = await this.provider.getSigner();
        this.user = await this.signer.getAddress(); this.walletMode = 'metamask';
        await this.initContracts();
        wc.on('disconnect', () => window.location.reload());
      } catch (e) { this.showError(e); } finally { this.setLoader(false); }
    } else { this.showToast(CONFIG.WC_PROJECT_ID?.includes('...') ? this.t('wcIdMissing') : 'Please install MetaMask.', true); }
  }

  // ── Backup / Security ────────────────────────────────────
  showBackupModal() {
    this.closeWalletModal();
    const overlay = document.createElement('div');
    overlay.id = 'wallet-modal-overlay';
    overlay.className = 'wallet-modal-overlay';
    overlay.innerHTML = `
      <div class="wallet-modal">
        <div class="wallet-modal-header">
          <div class="wallet-modal-logo">🔑</div>
          <h2>${this.t('backupWarning')}</h2>
          <p style="font-size:0.8rem;color:var(--text-muted);">Save this now. Without it + your PIN, funds are lost forever.</p>
        </div>
        <div class="backup-key-box" id="backup-key-display" style="display:none;"></div>
        <button class="btn-primary" onclick="App.revealPrivateKey()">${this.t('revealKey')}</button>
        <button class="btn-wallet-modal-secondary" id="btn-copy-key" style="display:none;margin-top:8px;" onclick="App.copyPrivateKey()">📋 ${this.t('copiedKey')}</button>
        <button class="btn-wallet-modal-secondary" style="margin-top:12px;" onclick="App.closeWalletModal()">✅ I've saved it</button>
      </div>`;
    document.body.appendChild(overlay);
  }

  async revealPrivateKey() {
    try {
      const pk = await EmbeddedWallet.exportPrivateKey(this.embeddedPin);
      const box = document.getElementById('backup-key-display');
      const btn = document.getElementById('btn-copy-key');
      if (box) { box.style.display = 'block'; box.innerText = pk; }
      if (btn) btn.style.display = '';
      // Hide reveal button
      const revealBtn = document.querySelector('#wallet-modal-overlay .btn-primary');
      if (revealBtn) revealBtn.style.display = 'none';
    } catch (e) { this.showToast(this.t('wrongPin'), true); }
  }

  copyPrivateKey() {
    const box = document.getElementById('backup-key-display');
    if (box) { navigator.clipboard.writeText(box.innerText); this.showToast(this.t('copiedKey')); }
  }

  resetEmbeddedWallet() {
    EmbeddedWallet.delete();
    this.logoutEmbedded();
    this.closeWalletModal();
    this.showWalletModal('create');
  }

  async logoutEmbedded() {
    this.walletMode = null; this.embeddedPin = null; this.user = null;
    this.provider = null; this.signer = null; this.contracts = {};
    this.stopMiningCounter();
    this.currentRealPower = 0; this.pendingBalance = 0;
    document.getElementById('btn-connect').classList.remove('hidden');
    document.getElementById('wallet-status').classList.add('hidden');
    document.getElementById('balance-tabs').style.display = 'none';
    // Reset UI
    document.getElementById('val-power').innerText = '0 H/s';
    document.getElementById('val-pending').innerText = '0.00000';
    document.getElementById('val-total-usd').innerText = '$0.00';
    document.getElementById('viz-status').innerText = 'WAITING';
    document.getElementById('viz-status').style.color = '#666';
    // Also reset embedded status
    document.getElementById('embedded-status').classList.add('hidden');
  }

  showEmbeddedMenu() {
    const items = [
      { label: `💰 ${this.t('myWallet')}: ${this.user ? this.user.slice(0,8)+'...'+this.user.slice(-4) : ''}`, action: null },
      { label: `🔑 ${this.t('revealKey')}`, action: () => this.showBackupModal() },
      { label: `🔐 ${this.t('changePin')}`, action: () => this.showChangePinModal() },
      { label: `🚪 ${this.t('logout')}`, action: () => this.confirmLogout() },
    ];
    this.showActionSheet('Embedded Wallet', items);
  }

  showChangePinModal() {
    const overlay = document.createElement('div');
    overlay.id = 'wallet-modal-overlay';
    overlay.className = 'wallet-modal-overlay';
    overlay.innerHTML = `
      <div class="wallet-modal">
        <div class="wallet-modal-header">
          <div class="wallet-modal-logo">🔐</div>
          <h2>${this.t('changePin')}</h2>
        </div>
        <input type="password" id="ew-old-pin" class="game-input" placeholder="${this.t('currentPin')}" maxlength="6" inputmode="numeric" pattern="[0-9]*" autocomplete="off" style="text-align:center;font-size:1.5rem;letter-spacing:12px;">
        <input type="password" id="ew-new-pin-1" class="game-input" placeholder="${this.t('newPin')}" maxlength="6" inputmode="numeric" pattern="[0-9]*" autocomplete="off" style="text-align:center;font-size:1.5rem;letter-spacing:12px;">
        <input type="password" id="ew-new-pin-2" class="game-input" placeholder="${this.t('confirmPin')}" maxlength="6" inputmode="numeric" pattern="[0-9]*" autocomplete="off" style="text-align:center;font-size:1.5rem;letter-spacing:12px;">
        <button class="btn-primary" onclick="App.changeEmbeddedPin()">${this.t('changePin')}</button>
        <button class="btn-wallet-modal-secondary" onclick="document.getElementById('wallet-modal-overlay').remove()">Cancel</button>
      </div>`;
    document.body.appendChild(overlay);
  }

  async changeEmbeddedPin() {
    const oldPin = document.getElementById('ew-old-pin')?.value;
    const new1 = document.getElementById('ew-new-pin-1')?.value;
    const new2 = document.getElementById('ew-new-pin-2')?.value;
    if (!oldPin || !new1 || new1.length < 4) return this.showToast(this.t('pinTooShort'), true);
    if (new1 !== new2) return this.showToast(this.t('pinMismatch'), true);
    try {
      await EmbeddedWallet.changePin(oldPin, new1);
      this.embeddedPin = new1;
      this.showToast(this.t('pinChanged'));
      document.getElementById('wallet-modal-overlay')?.remove();
    } catch (e) { this.showToast(this.t('wrongPin'), true); }
  }

  confirmLogout() {
    const overlay = document.createElement('div');
    overlay.id = 'wallet-modal-overlay';
    overlay.className = 'wallet-modal-overlay';
    overlay.innerHTML = `
      <div class="wallet-modal">
        <div class="wallet-modal-header">
          <div class="wallet-modal-logo">🚪</div>
          <h2>${this.t('logout')}?</h2>
          <p style="font-size:0.8rem;color:var(--text-muted);">${this.t('logoutConfirm')}</p>
        </div>
        <button class="btn-primary" onclick="App.logoutEmbedded();document.getElementById('wallet-modal-overlay').remove()">${this.t('logout')}</button>
        <button class="btn-wallet-modal-secondary" onclick="document.getElementById('wallet-modal-overlay').remove()">Cancel</button>
      </div>`;
    document.body.appendChild(overlay);
  }

  showActionSheet(title, items) {
    const overlay = document.createElement('div');
    overlay.className = 'wallet-modal-overlay';
    overlay.id = 'action-sheet-overlay';
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
    const sheet = document.createElement('div');
    sheet.style.cssText = 'background:var(--card-bg);border-radius:20px 20px 0 0;padding:20px;width:100%;max-width:420px;position:fixed;bottom:0;left:50%;transform:translateX(-50%);animation:slideUp 0.3s ease;z-index:2600;';
    sheet.innerHTML = `<h3 style="margin:0 0 15px 0;text-align:center;">${title}</h3>${items.map((it, i) => `
      <button style="display:block;width:100%;padding:14px;margin-bottom:8px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);border-radius:12px;color:var(--text);font-weight:600;cursor:pointer;font-size:0.9rem;text-align:left;transition:0.2s;"
        onmousedown="this.style.background='rgba(255,255,255,0.12)'"
        onmouseup="this.style.background='rgba(255,255,255,0.05)'"
        onclick="${it.action ? `(${it.action.toString()})();document.getElementById('action-sheet-overlay').remove()` : ''}">${it.label}</button>`).join('')}
      <button style="display:block;width:100%;padding:14px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.05);border-radius:12px;color:var(--text-muted);font-weight:600;cursor:pointer;font-size:0.9rem;text-align:center;margin-top:4px;"
        onclick="document.getElementById('action-sheet-overlay').remove()">Cancel</button>`;
    overlay.appendChild(sheet);
    document.body.appendChild(overlay);
  }

  async initContracts() {
    this.contracts.usdt = new ethers.Contract(CONFIG.USDT, ERC20_ABI, this.signer);
    this.contracts.fta = new ethers.Contract(CONFIG.FTA, ERC20_ABI, this.signer);
    this.contracts.core = new ethers.Contract(CONFIG.CORE, CORE_ABI, this.signer);
    this.contracts.mine = new ethers.Contract(CONFIG.MINE, MINE_ABI, this.signer);

    try { this.ftaDecimals = Number(await this.contracts.fta.decimals()); } catch (e) { this.ftaDecimals = 18; }
    try { this.usdtDecimals = Number(await this.contracts.usdt.decimals()); } catch (e) { this.usdtDecimals = 6; }

    // Load contract params
    try { this.swapFeePct = Number(await this.contracts.core.swapFee()); } catch (e) {}
    try { this.claimFeePct = Number(await this.contracts.core.claimFee()); } catch (e) {}
    try { this.wFeePct = Number(await this.contracts.core.wFee()); } catch (e) {}
    try { this.devFeePct = Number(await this.contracts.core.devFee()); } catch (e) {}

    document.getElementById('btn-connect').classList.add('hidden');
    // Show correct header status based on wallet mode
    if (this.walletMode === 'embedded') {
      document.getElementById('embedded-status').classList.remove('hidden');
      document.getElementById('wallet-status').classList.add('hidden');
      document.getElementById('embedded-addr').innerText = this.user.slice(0, 6) + '...' + this.user.slice(-4);
    } else {
      document.getElementById('wallet-status').classList.remove('hidden');
      document.getElementById('embedded-status').classList.add('hidden');
      document.getElementById('addr-display').innerText = this.user.slice(0, 6) + '...' + this.user.slice(-4);
    }
    document.getElementById('balance-tabs').style.display = 'flex';

    this._loadLocalAssets();
    if (!localStorage.getItem(this.STORAGE_CLAIM)) { this.userLastClaimTime = Math.floor(Date.now() / 1000); this._saveLocalAssets(); }
    try { const lp = JSON.parse(localStorage.getItem('fitia_profile')); if (lp) this.profileData = lp; } catch (e) {}

    await this.fetchMarketPrices();
    await this.cacheBatteryDurations();
    await this.updateData();

    setInterval(() => this.updateData(), 15000);
    this.initVisualizer();
    window.addEventListener('resize', () => this.resizeCanvas());

    setTimeout(() => this.syncProfile(), 500);
    setTimeout(() => this.refreshHistory(), 2000);
    setInterval(() => this.refreshHistory(), 60000);
  }

  async switchNetwork() { try { await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x89' }] }); } catch (e) { if (e.code === 4902) { await window.ethereum.request({ method: 'wallet_addEthereumChain', params: [{ chainId: '0x89', chainName: 'Polygon Mainnet', nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 }, rpcUrls: ['https://polygon-rpc.com/'], blockExplorerUrls: ['https://polygonscan.com/'] }] }); } } }

  async cacheBatteryDurations() {
    try {
      const c = Number(await this.contracts.mine.bCount());
      for (let i = 0; i < c; i++) {
        try {
          const b = await this.contracts.mine.bTypes(i);
          this.batteryTypeDurations[i] = Number(b.dur) / 86400; // dur is in seconds
        } catch (e) {}
      }
    } catch (e) {}
  }

  /* ═══════════ DATA REFRESH ══════════════════════════════════ */
  async updateData() {
    if (!this.user) return;
    try {
      // ── Internal balances (Core) ──────────────────────────
      const [corePol, coreUsdt, coreFta] = await Promise.all([
        this.contracts.core.pol(this.user),
        this.contracts.core.uBal(this.user),
        this.contracts.core.fBal(this.user)
      ]);
      this.balCorePol = corePol; this.balCoreUsdt = coreUsdt; this.balCoreFta = coreFta;

      // ── Wallet balances (ERC20) ───────────────────────────
      const [walletPol, walletUsdt, walletFta] = await Promise.all([
        this.provider.getBalance(this.user),
        this.contracts.usdt.balanceOf(this.user),
        this.contracts.fta.balanceOf(this.user)
      ]);
      this.balWalletPol = walletPol; this.balWalletUsdt = walletUsdt; this.balWalletFta = walletFta;

      // ── Power & Difficulty ────────────────────────────────
      try { this.currentRealPower = Number(await this.contracts.mine.powerOf(this.user)); } catch (e) { this.currentRealPower = 0; }
      try { this.currentDifficulty = BigInt(await this.contracts.core.difficulty()); } catch (e) {}
      try { this.netFtaVal = BigInt(await this.contracts.core.netFta()); } catch (e) {}

      // ── Pending balance ────────────────────────────────────
      const now = Math.floor(Date.now() / 1000), elapsed = now - this.userLastClaimTime;
      if (this.currentRealPower > 0 && elapsed > 0) {
        const rps = (this.currentRealPower * Number(this.currentDifficulty)) / 1e18;
        this.pendingBalance = rps * elapsed;
        document.getElementById('val-pending').innerText = this.pendingBalance.toFixed(5);
        document.getElementById('viz-status').innerText = this.t('miningActive');
        document.getElementById('viz-status').style.color = "var(--primary)";
      } else {
        this.pendingBalance = 0;
        document.getElementById('val-pending').innerText = "0.00000";
        document.getElementById('viz-status').innerText = this.t('noMachine');
        document.getElementById('viz-status').style.color = "#666";
      }
      this.updateVisualizerIntensity(this.currentRealPower);
      if (this.currentRealPower > 0) { if (!this.miningTimer) this.startMiningCounter(); }
      else { this.stopMiningCounter(); }
      document.getElementById('val-power').innerText = this.formatHashrate(this.currentRealPower);

      // ── Human-readable values ─────────────────────────────
      const pCore = parseFloat(ethers.formatEther(corePol));
      const uCore = parseFloat(ethers.formatUnits(coreUsdt, this.usdtDecimals));
      const fCore = parseFloat(ethers.formatUnits(coreFta, this.ftaDecimals));
      const pWallet = parseFloat(ethers.formatEther(walletPol));
      const uWallet = parseFloat(ethers.formatUnits(walletUsdt, this.usdtDecimals));
      const fWallet = parseFloat(ethers.formatUnits(walletFta, this.ftaDecimals));

      // ── Rate ──────────────────────────────────────────────
      try { this.ftaPriceUsd = parseFloat(ethers.formatUnits(await this.contracts.core.rate(), this.ftaDecimals)); } catch (e) {}

      // ── Update DOM balances ────────────────────────────────
      document.getElementById('bal-pol-core').innerText = pCore.toFixed(4);
      document.getElementById('bal-pol-wallet').innerText = pWallet.toFixed(4);
      document.getElementById('bal-usdt-core').innerText = uCore.toFixed(2);
      document.getElementById('bal-usdt-wallet').innerText = uWallet.toFixed(2);
      document.getElementById('bal-fta-core').innerText = fCore.toFixed(4);
      document.getElementById('bal-fta-wallet').innerText = fWallet.toFixed(4);

      document.getElementById('price-pol').innerText = this.formatUsd(this.polPriceUsd);
      document.getElementById('price-usdt').innerText = this.formatUsd(1);
      document.getElementById('price-fta').innerText = this.formatUsd(this.ftaPriceUsd);

      document.getElementById('bal-pol-usd').innerText = '≈ ' + this.formatUsd(pCore * this.polPriceUsd + pWallet * this.polPriceUsd);
      document.getElementById('bal-usdt-usd').innerText = '≈ ' + this.formatUsd(uCore + uWallet);
      document.getElementById('bal-fta-usd').innerText = '≈ ' + this.formatUsd((fCore + fWallet) * this.ftaPriceUsd);

      // Total (protocol + wallet)
      const totalUsd = (pCore + pWallet) * this.polPriceUsd + uCore + uWallet + (fCore + fWallet) * this.ftaPriceUsd;
      document.getElementById('val-total-usd').innerText = this.formatUsd(totalUsd);

      document.getElementById('swap-rate').innerText = this.t('currentRate') + this.ftaPriceUsd.toFixed(6) + this.t('usdtPerFta');

      // ── Liquidity display ─────────────────────────────────
      const nfsEl = document.getElementById('net-fta-display');
      if (nfsEl) {
        const nfsHuman = parseFloat(ethers.formatUnits(this.netFtaVal, this.ftaDecimals));
        nfsEl.innerText = nfsHuman.toFixed(4) + ' FTA';
        nfsEl.className = 'liquidity-value';
        if (this.netFtaVal === 0n) nfsEl.classList.add('none');
        else if (nfsHuman < 100) nfsEl.classList.add('low');
        else nfsEl.classList.add('high');
      }

      // ── Swap balance displays (protocol balances) ─────────
      const isUsdtTo = this.swapDirection === 'USDT_TO_FTA';
      document.getElementById('swap-bal-from').innerText = isUsdtTo ? uCore.toFixed(2) : fCore.toFixed(4);
      document.getElementById('swap-bal-to').innerText = isUsdtTo ? fCore.toFixed(4) : uCore.toFixed(2);

      // ── Deposit hints ─────────────────────────────────────
      const needsDeposit = uCore < 1; // Show hint if protocol USDT is low
      document.getElementById('deposit-hint-shop').classList.toggle('hidden', !needsDeposit || this.payMode !== 'USDT');
      document.getElementById('deposit-hint-wallet').classList.toggle('hidden', uCore >= 1);

      // ── Render ────────────────────────────────────────────
      await this.renderShop();
      this.renderActiveMachines();
      this.renderUserMachines();
      this.renderUserBatteries();
      if (document.getElementById('swap-from-in').value) this.calcSwap();

    } catch (e) { console.error("Refresh Error", e); }
  }

  startMiningCounter() { if (this.miningTimer) return; this.miningTimer = setInterval(() => { if (this.currentRealPower > 0) { const rps = (this.currentRealPower * Number(this.currentDifficulty)) / 1e18; this.pendingBalance += rps; document.getElementById('val-pending').innerText = this.pendingBalance.toFixed(5); } }, 1000); }
  stopMiningCounter() { if (this.miningTimer) { clearInterval(this.miningTimer); this.miningTimer = null; } }

  /* ═══════════ DEPOSIT / WITHDRAW ═════════════════════════════ */
  openDeposit(token) {
    this.depositToken = token;
    this.withdrawToken = null;
    document.getElementById('deposit-panel-title').innerText = `Deposit ${token}`;
    document.getElementById('deposit-amount').value = '';
    document.getElementById('btn-deposit-confirm').disabled = true;

    let walletBal = '0', coreBal = '0';
    if (token === 'POL') { walletBal = parseFloat(ethers.formatEther(this.balWalletPol)).toFixed(4); coreBal = parseFloat(ethers.formatEther(this.balCorePol)).toFixed(4); }
    else if (token === 'USDT') { walletBal = parseFloat(ethers.formatUnits(this.balWalletUsdt, this.usdtDecimals)).toFixed(2); coreBal = parseFloat(ethers.formatUnits(this.balCoreUsdt, this.usdtDecimals)).toFixed(2); }
    else if (token === 'FTA') { walletBal = parseFloat(ethers.formatUnits(this.balWalletFta, this.ftaDecimals)).toFixed(4); coreBal = parseFloat(ethers.formatUnits(this.balCoreFta, this.ftaDecimals)).toFixed(4); }
    document.getElementById('deposit-wallet-bal').innerText = walletBal;
    document.getElementById('deposit-protocol-bal').innerText = coreBal;
    document.getElementById('btn-deposit-approve').style.display = token === 'POL' ? 'none' : '';
    document.getElementById('deposit-panel').classList.add('active');
    document.getElementById('withdraw-panel').classList.remove('active');

    // Enable confirm if amount entered
    document.getElementById('deposit-amount').oninput = () => {
      const v = document.getElementById('deposit-amount').value;
      document.getElementById('btn-deposit-confirm').disabled = !v || parseFloat(v) <= 0;
    };
  }

  closeDeposit() {
    document.getElementById('deposit-panel').classList.remove('active');
    this.depositToken = null;
  }

  openWithdraw(token) {
    this.withdrawToken = token;
    this.depositToken = null;
    document.getElementById('withdraw-panel-title').innerText = `Withdraw ${token}`;
    document.getElementById('withdraw-amount').value = '';
    document.getElementById('btn-withdraw-confirm').disabled = true;

    let coreBal = '0';
    if (token === 'POL') coreBal = parseFloat(ethers.formatEther(this.balCorePol)).toFixed(4);
    else if (token === 'USDT') coreBal = parseFloat(ethers.formatUnits(this.balCoreUsdt, this.usdtDecimals)).toFixed(2);
    else if (token === 'FTA') coreBal = parseFloat(ethers.formatUnits(this.balCoreFta, this.ftaDecimals)).toFixed(4);
    document.getElementById('withdraw-protocol-bal').innerText = coreBal;
    document.getElementById('withdraw-panel').classList.add('active');
    document.getElementById('deposit-panel').classList.remove('active');

    document.getElementById('withdraw-amount').oninput = () => {
      const v = document.getElementById('withdraw-amount').value;
      document.getElementById('btn-withdraw-confirm').disabled = !v || parseFloat(v) <= 0;
    };
  }

  closeWithdraw() {
    document.getElementById('withdraw-panel').classList.remove('active');
    this.withdrawToken = null;
  }

  async approveDeposit() {
    if (!this.depositToken || this.depositToken === 'POL') return;
    const amtVal = document.getElementById('deposit-amount').value;
    if (!amtVal || parseFloat(amtVal) <= 0) return this.showToast(this.t('invalidAmount'), true);

    const token = this.depositToken === 'USDT' ? this.contracts.usdt : this.contracts.fta;
    const decimals = this.depositToken === 'USDT' ? this.usdtDecimals : this.ftaDecimals;
    const amount = ethers.parseUnits(amtVal, decimals);

    this.setLoader(true, this.t('approving'));
    try {
      const tx = await token.approve(CONFIG.CORE, amount);
      await tx.wait();
      this.showToast('Approved! ✅');
    } catch (e) { this.showError(e); }
    this.setLoader(false);
  }

  async executeDeposit() {
    if (!this.depositToken) return;
    const amtVal = document.getElementById('deposit-amount').value;
    if (!amtVal || parseFloat(amtVal) <= 0) return this.showToast(this.t('invalidAmount'), true);

    this.setLoader(true, this.t('depositing'));
    try {
      let tx;
      if (this.depositToken === 'POL') {
        tx = await this.contracts.core.depositPol({ value: ethers.parseEther(amtVal) });
      } else if (this.depositToken === 'USDT') {
        tx = await this.contracts.core.depositUsdt(ethers.parseUnits(amtVal, this.usdtDecimals));
      } else if (this.depositToken === 'FTA') {
        tx = await this.contracts.core.depositFta(ethers.parseUnits(amtVal, this.ftaDecimals));
      }
      await tx.wait();
      this.showToast(this.t('deposited'));
      this._recordTx('deposit', this.depositToken, '', parseFloat(amtVal), '', tx.hash, {});
      this.closeDeposit();
      this.updateData();
    } catch (e) { this.showError(e); }
    this.setLoader(false);
  }

  async executeWithdraw() {
    if (!this.withdrawToken) return;
    const amtVal = document.getElementById('withdraw-amount').value;
    if (!amtVal || parseFloat(amtVal) <= 0) return this.showToast(this.t('invalidAmount'), true);

    this.setLoader(true, this.t('withdrawing'));
    try {
      let tx;
      if (this.withdrawToken === 'POL') {
        tx = await this.contracts.core.withdrawPol(ethers.parseEther(amtVal));
      } else if (this.withdrawToken === 'USDT') {
        tx = await this.contracts.core.withdrawUsdt(ethers.parseUnits(amtVal, this.usdtDecimals));
      } else if (this.withdrawToken === 'FTA') {
        tx = await this.contracts.core.withdrawFta(ethers.parseUnits(amtVal, this.ftaDecimals));
      }
      await tx.wait();
      this.showToast(this.t('withdrawn'));
      this._recordTx('withdraw', '', this.withdrawToken, '', parseFloat(amtVal), tx.hash, {});
      this.closeWithdraw();
      this.updateData();
    } catch (e) { this.showError(e); }
    this.setLoader(false);
  }

  /* ═══════════ REFERRAL ══════════════════════════════════════ */
  async bindReferrer() {
    const a = document.getElementById('ref-address-input').value.trim();
    if (!ethers.isAddress(a)) return this.showToast(this.t('invalidAddr'), true);
    this.setLoader(true, this.t('linking'));
    try {
      const tx = await this.contracts.core.setReferrer(a);
      await tx.wait();
      this.showToast(this.t('refLinked'));
      document.getElementById('ref-address-input').value = '';
      this._recordTx('referral', '', '', '', '', tx.hash, {});
    } catch (e) { this.showError(e); }
    this.setLoader(false);
  }

  /* ═══════════ SHOP ══════════════════════════════════════════ */
  setPayMode(m) { this.payMode = m; document.getElementById('btn-pay-usdt').classList.toggle('active', m === 'USDT'); document.getElementById('btn-pay-fta').classList.toggle('active', m === 'FTA'); this.renderShop(); }
  setShopView(v) { this.shopViewMode = v; document.querySelectorAll('.shop-tab').forEach(t => t.classList.remove('active')); if (event?.currentTarget) event.currentTarget.classList.add('active'); this.renderShop(); }

  async renderShop() {
    if (this.isLoadingShop) return;
    const c = document.getElementById('shop-list');
    if (this.shopViewMode === 'machines') {
      if (!this.shopMachinesData.length) await this.fetchMachines();
      this._renderShopMachinesHTML(c);
    } else {
      if (!this.shopBatteriesData.length) await this.fetchBatteries();
      this._renderShopBatteriesHTML(c);
    }
  }

  async fetchMachines() {
    this.isLoadingShop = true;
    try {
      const cnt = Number(await this.contracts.mine.mCount());
      const p = []; for (let i = 0; i < cnt; i++) p.push(this.contracts.mine.mTypes(i));
      const r = await Promise.all(p);
      this.shopMachinesData = [];
      for (let i = 0; i < cnt; i++) {
        const d = r[i];
        this.shopMachinesData.push({ price: parseFloat(ethers.formatUnits(d.price, this.usdtDecimals)), power: Number(d.power), priceRaw: d.price });
      }
    } catch (e) { console.error("fetchMachines", e); }
    this.isLoadingShop = false;
  }

  async fetchBatteries() {
    this.isLoadingShop = true;
    try {
      const cnt = Number(await this.contracts.mine.bCount());
      const p = []; for (let i = 0; i < cnt; i++) p.push(this.contracts.mine.bTypes(i));
      const r = await Promise.all(p);
      this.shopBatteriesData = [];
      for (let i = 0; i < cnt; i++) {
        const d = r[i];
        const durDays = Number(d.dur) / 86400;
        this.shopBatteriesData.push({ price: parseFloat(ethers.formatUnits(d.price, this.usdtDecimals)), days: durDays, priceRaw: d.price, durSec: Number(d.dur) });
        this.batteryTypeDurations[i] = durDays;
      }
    } catch (e) { console.error("fetchBatteries", e); }
    this.isLoadingShop = false;
  }

  /* ═══════════ BUY MACHINE ═══════════════════════════════════ */
  async buyMachine(id) {
    if (!this.user) return this.connect();
    const m = this.shopMachinesData[id];
    const isFta = this.payMode === 'FTA';

    if (!isFta && this.balCoreUsdt < m.priceRaw) {
      return this.showToast(this.t('errInsufficientFunds') + ' ' + this.t('depositSuggestion'), true);
    }

    this.setLoader(true, `${this.t('buyingMachine')} (${this.payMode})...`);
    try {
      let tx;
      if (isFta) {
        // Calculate FTA cost via bonding curve
        let ftaCost;
        try { ftaCost = await this.contracts.core.costFta(m.priceRaw); } catch (e) { this.showToast(this.t('errLowLiquidity'), true); this.setLoader(false); return; }
        if (ftaCost === 0n) { this.showToast(this.t('errLowLiquidity'), true); this.setLoader(false); return; }
        // Need to add fee buffer
        const tfp = this.devFeePct + 3 + 2 + 1; // devFee + 3 commission levels
        const tp = ftaCost + ((ftaCost * BigInt(tfp)) / (100n - BigInt(tfp)));
        if (this.balCoreFta < tp) {
          const need = parseFloat(ethers.formatUnits(tp, this.ftaDecimals));
          return this.showToast(`Need ${need.toFixed(4)} FTA protocol balance. ${this.t('depositSuggestion')}`, true);
        }
        tx = await this.contracts.mine.buyMachineFTA(id);
      } else {
        tx = await this.contracts.mine.buyMachine(id);
      }
      await tx.wait();
      const ftExact = isFta ? parseFloat(ethers.formatUnits(await this.contracts.core.costFta(m.priceRaw), this.ftaDecimals)) : 0;
      this.userMachines.push({ typeId: id, expiresAt: 0, pluggedBatteryType: null, boughtAt: Math.floor(Date.now() / 1000) });
      this._saveLocalAssets();
      this.showToast(this.t('machineBought'));
      this._recordTx('buy_machine', isFta ? 'FTA' : 'USDT', '', isFta ? ftExact : m.price, '', tx.hash, { machineTypeId: id });
      this.shopMachinesData = [];
      this.updateData();
    } catch (e) { this.showError(e); }
    this.setLoader(false);
  }

  /* ═══════════ BUY BATTERY ═══════════════════════════════════ */
  async buyBattery(id) {
    if (!this.user) return this.connect();
    const b = this.shopBatteriesData[id];
    const isFta = this.payMode === 'FTA';

    if (!isFta && this.balCoreUsdt < b.priceRaw) {
      return this.showToast(this.t('errInsufficientFunds') + ' ' + this.t('depositSuggestion'), true);
    }

    this.setLoader(true, `${this.t('buyingBattery')} (${this.payMode})...`);
    try {
      let tx;
      if (isFta) {
        let ftaCost;
        try { ftaCost = await this.contracts.core.costFta(b.priceRaw); } catch (e) { this.showToast(this.t('errLowLiquidity'), true); this.setLoader(false); return; }
        if (ftaCost === 0n) { this.showToast(this.t('errLowLiquidity'), true); this.setLoader(false); return; }
        const tfp = this.devFeePct + 3 + 2 + 1;
        const tp = ftaCost + ((ftaCost * BigInt(tfp)) / (100n - BigInt(tfp)));
        if (this.balCoreFta < tp) {
          const need = parseFloat(ethers.formatUnits(tp, this.ftaDecimals));
          return this.showToast(`Need ${need.toFixed(4)} FTA protocol balance. ${this.t('depositSuggestion')}`, true);
        }
        tx = await this.contracts.mine.buyBatteryFTA(id);
      } else {
        tx = await this.contracts.mine.buyBattery(id);
      }
      await tx.wait();
      this.userBatteries[id] = (this.userBatteries[id] || 0) + 1;
      this._saveLocalAssets();
      this.showToast(this.t('batteryBought'));
      this._recordTx('buy_battery', isFta ? 'FTA' : 'USDT', '', isFta ? 0 : b.price, '', tx.hash, { batteryTypeId: id, duration: b.days });
      this.shopBatteriesData = [];
      this.updateData();
    } catch (e) { this.showError(e); }
    this.setLoader(false);
  }

  /* ═══════════ PLUG IN ═══════════════════════════════════════ */
  async plugInMachine() {
    const mIdx = document.getElementById('plug-machine-id').value, bT = document.getElementById('plug-battery-type').value;
    if (mIdx === "" || mIdx < 0) return this.showToast(this.t('invalidId'), true);
    const idx = Number(mIdx);
    if (idx >= this.userMachines.length) return this.showToast(this.t('invalidId'), true);
    if (!this.userBatteries[bT] || this.userBatteries[bT] <= 0) return this.showToast("No battery of this type available", true);
    this.setLoader(true, this.t('pluggingIn'));
    try {
      const tx = await this.contracts.mine.plugInMachine(idx, bT);
      await tx.wait();
      this.pendingBalance = 0;
      this.userLastClaimTime = Math.floor(Date.now() / 1000);
      const durSec = this.batteryTypeDurations[bT] ? this.batteryTypeDurations[bT] * 86400 : (this.shopBatteriesData[bT]?.durSec || 2592000);
      this.userMachines[idx].expiresAt = Math.floor(Date.now() / 1000) + durSec;
      this.userMachines[idx].pluggedBatteryType = Number(bT);
      this.userBatteries[bT] = Math.max(0, (this.userBatteries[bT] || 0) - 1);
      this._saveLocalAssets();
      this.showToast(this.t('pluggedIn'));
      this._recordTx('plug_in', '', '', '', '', tx.hash, { machineIndex: idx, batteryTypeId: Number(bT), duration: this.getBatteryDurationDays(Number(bT)) });
      this.updateData();
    } catch (e) { this.showError(e); }
    this.setLoader(false);
  }

  /* ═══════════ CLAIM ═════════════════════════════════════════ */
  async claim() {
    if (!this.user) return;
    this.stopMiningCounter();
    this.setLoader(true, this.t('claiming'));
    try {
      const tx = await this.contracts.mine.claimRewards();
      await tx.wait();
      const pending = this.pendingBalance;
      this.pendingBalance = 0;
      this.userLastClaimTime = Math.floor(Date.now() / 1000);
      this._saveLocalAssets();
      this.showToast(this.t('claimed'));
      this._recordTx('claim', '', 'FTA', '', pending, tx.hash, { amountFTA: pending });
      this.updateData();
      if (this.currentRealPower > 0) this.startMiningCounter();
    } catch (e) { this.showError(e); this.startMiningCounter(); }
    this.setLoader(false);
  }

  /* ═══════════ SWAP (v3: amount, minOut, deadline) ═══════════ */
  toggleSwap() {
    this.swapDirection = this.swapDirection === 'USDT_TO_FTA' ? 'FTA_TO_USDT' : 'USDT_TO_FTA';
    document.getElementById('token-from-display').innerText = this.swapDirection === 'USDT_TO_FTA' ? 'USDT' : 'FTA';
    document.getElementById('token-to-display').innerText = this.swapDirection === 'USDT_TO_FTA' ? 'FTA' : 'USDT';
    document.getElementById('swap-to-in').value = '';
    document.getElementById('swap-from-in').value = '';
    document.getElementById('swap-details').classList.add('hidden');
    this.updateData();
  }

  calcSwap() {
    const val = document.getElementById('swap-from-in').value;
    if (!val || val <= 0) { document.getElementById('swap-to-in').value = ''; document.getElementById('swap-details').classList.add('hidden'); return; }
    const inputVal = parseFloat(val), isUsdtTo = this.swapDirection === 'USDT_TO_FTA';
    const fee = inputVal * SWAP_FEE_RATE, netInput = inputVal - fee;
    let netOutput = 0;
    if (this.ftaPriceUsd > 0) netOutput = isUsdtTo ? (netInput / this.ftaPriceUsd) : (netInput * this.ftaPriceUsd);
    document.getElementById('swap-to-in').value = netOutput > 0 ? netOutput.toFixed(6) : '';
    const detailsEl = document.getElementById('swap-details');
    detailsEl.classList.remove('hidden');
    const fromT = isUsdtTo ? 'USDT' : 'FTA', toT = isUsdtTo ? 'FTA' : 'USDT';
    document.getElementById('swap-detail-rate').innerText = isUsdtTo ? `1 USDT = ${(1 / this.ftaPriceUsd).toFixed(2)} FTA` : `1 FTA = ${this.ftaPriceUsd.toFixed(6)} USDT`;
    document.getElementById('swap-detail-fee').innerText = `${fee.toFixed(6)} ${fromT}`;
    document.getElementById('swap-detail-min').innerText = `${(netOutput * (1 - SLIPPAGE)).toFixed(6)} ${toT}`;
    document.getElementById('swap-detail-network').innerText = `≈ 0.02 POL (${this.formatUsd(0.02 * this.polPriceUsd)})`;
  }

  async executeSwap() {
    const val = document.getElementById('swap-from-in').value;
    if (!val || val <= 0) return this.showToast(this.t('invalidAmount'), true);
    const isUsdtTo = this.swapDirection === 'USDT_TO_FTA';
    const decimals = isUsdtTo ? this.usdtDecimals : this.ftaDecimals;
    const amount = ethers.parseUnits(val, decimals);
    const fee = parseFloat(val) * SWAP_FEE_RATE;
    const netIn = parseFloat(val) - fee;
    let minOut;
    if (this.ftaPriceUsd > 0) {
      minOut = isUsdtTo ? (netIn / this.ftaPriceUsd) : (netIn * this.ftaPriceUsd);
    } else { minOut = 0; }
    const minOutSlipped = Math.floor(minOut * (1 - SLIPPAGE) * 1e6) / 1e6;
    const deadline = Math.floor(Date.now() / 1000) + DEADLINE_MINUTES * 60;

    // Check protocol balance
    if (isUsdtTo && this.balCoreUsdt < amount) {
      return this.showToast(this.t('errInsufficientFunds') + ' ' + this.t('depositSuggestion'), true);
    }
    if (!isUsdtTo && this.balCoreFta < amount) {
      return this.showToast(this.t('errInsufficientFunds') + ' ' + this.t('depositSuggestion'), true);
    }

    this.setLoader(true, this.t('swapping'));
    const toDec = isUsdtTo ? this.ftaDecimals : this.usdtDecimals;
    const minOutParsed = ethers.parseUnits(String(minOutSlipped), toDec);

    try {
      let tx;
      if (isUsdtTo) {
        tx = await this.contracts.core.swapUForF(amount, minOutParsed, deadline);
      } else {
        if (this.netFtaVal === 0n) { this.showToast(this.t('errNoFtaLiquidity'), true); this.setLoader(false); return; }
        if (amount > this.netFtaVal) {
          const maxSell = parseFloat(ethers.formatUnits(this.netFtaVal, this.ftaDecimals));
          return this.showToast(this.t('errMaxFtaSell').replace('{max}', maxSell.toFixed(4)), true);
        }
        tx = await this.contracts.core.swapFForU(amount, minOutParsed, deadline);
      }
      await tx.wait();
      this.showToast(this.t('swapSuccess'));
      document.getElementById('swap-from-in').value = '';
      document.getElementById('swap-to-in').value = '';
      document.getElementById('swap-details').classList.add('hidden');
      this._recordTx('swap', isUsdtTo ? 'USDT' : 'FTA', isUsdtTo ? 'FTA' : 'USDT', parseFloat(val), minOut, tx.hash, { direction: isUsdtTo ? 'USDT→FTA' : 'FTA→USDT' });
      this.updateData();
    } catch (e) {
      const em = (e?.message || '').toLowerCase();
      if (em.includes('insufficient') || em.includes('slip') || em.includes('invalid')) this.showToast(this.t('errSwapRejected'), true);
      else this.showError(e);
    }
    this.setLoader(false);
  }

  /* ═══════════ SEND / RECEIVE ════════════════════════════════ */
  openSend(ts) { this.sendTokenSymbol = ts; document.getElementById('send-token-name').innerText = ts; document.getElementById('send-to-address').value = ''; document.getElementById('send-amount').value = ''; let bid = 'bal-pol-wallet'; if (ts === 'USDT') bid = 'bal-usdt-wallet'; if (ts === 'FTA') bid = 'bal-fta-wallet'; document.getElementById('send-bal').innerText = document.getElementById(bid)?.innerText || '0'; document.getElementById('modal-send').classList.add('active'); }
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

  /* ═══════════ NAV ═══════════════════════════════════════════ */
  nav(viewId) {
    document.querySelectorAll('.view').forEach(el => { el.classList.remove('active'); el.style.display = 'none'; });
    const av = document.getElementById('view-' + viewId); if (av) { av.classList.add('active'); av.style.display = 'block'; }
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    if (event?.currentTarget) event.currentTarget.classList.add('active');
    if (viewId === 'history') this.refreshHistory();
  }

  /* ═══════════ PROFILE ═══════════════════════════════════════ */
  async syncProfile() {
    this._ensureProfileVisible();
    if (!this.dbOnline || !this.user) return;
    try {
      let user = await this.db.getUser(this.user);
      if (!user) { user = await this.db.createUser(this.user, null, null); await this._logActivity('register', 'New user'); }
      else { await this.db.updateUser(this.user, { last_login: new Date().toISOString() }); await this._logActivity('login', 'Login'); }
      this.profileData = user;
      this.updateProfileUI();
    } catch (e) { console.warn('syncProfile:', e.message); }
  }
  _ensureProfileVisible() {
    if (!this.user) return;
    const localProfile = this.profileData || {};
    try { const lp = JSON.parse(localStorage.getItem('fitia_profile')); if (lp) Object.assign(localProfile, lp); } catch (e) {}
    this.profileData = {
      wallet_address: this.user, username: localProfile.username || null, email: localProfile.email || null,
      level: localProfile.level || 0, total_invested: localProfile.total_invested || 0,
      total_earned: localProfile.total_earned || 0, machines_count: this.userMachines ? this.userMachines.length : 0
    };
    this.updateProfileUI();
  }
  updateProfileUI() {
    const p = this.profileData; if (!p && !this.user) return;
    const addr = this.user || (p && p.wallet_address) || '';
    const username = (p && p.username) || ''; const level = (p && p.level) || 0;
    const invested = Number((p && p.total_invested) || 0); const earned = Number((p && p.total_earned) || 0);
    const machines = (p && p.machines_count) || this.userMachines.length || 0;
    const txs = this.historyStats?.total || this.localTxLog.length || 0;
    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val; };
    setEl('profile-name', username || 'Miner'); setEl('profile-level', `Level ${level}`);
    setEl('profile-addr', addr ? addr.slice(0, 8) + '...' : '');
    setEl('ps-invested', this.formatUsd(invested)); setEl('ps-earned', this.formatUsd(earned));
    setEl('ps-machines', String(machines)); setEl('ps-txs', String(txs));
    try { document.getElementById('btn-profile-edit').style.display = 'flex'; document.getElementById('profile-avatar').innerText = username ? '🔷' : '👤'; } catch (e) {}
  }
  toggleProfileEdit() {
    const form = document.getElementById('profile-edit-form'); if (!form) return;
    form.classList.toggle('hidden');
    if (!form.classList.contains('hidden')) { document.getElementById('edit-username').value = this.profileData?.username || ''; document.getElementById('edit-email').value = this.profileData?.email || ''; }
  }
  async saveProfile() {
    const username = document.getElementById('edit-username').value.trim();
    const email = document.getElementById('edit-email').value.trim();
    if (!username) return this.showToast('Username required', true);
    if (this.dbOnline) {
      await this.db.updateUser(this.user, { username, email });
      const updated = await this.db.getUser(this.user); if (updated) this.profileData = updated;
    } else { this.profileData = { ...(this.profileData || {}), username, email }; localStorage.setItem('fitia_profile', JSON.stringify({ username, email })); }
    this.updateProfileUI(); this.showToast(this.t('profileUpdated'));
    document.getElementById('profile-edit-form').classList.add('hidden');
  }

  /* ═══════════ BALANCE VIEW TAB ═════════════════════════════ */
  setBalanceView(view) {
    document.querySelectorAll('.balance-tab').forEach(t => t.classList.remove('active'));
    if (event?.currentTarget) event.currentTarget.classList.add('active');
    // Highlight relevant balance rows
    const isProtocol = view === 'protocol';
    document.querySelectorAll('.token-bal-internal').forEach(el => el.style.opacity = isProtocol ? '1' : '0.5');
    document.querySelectorAll('.token-bal-wallet').forEach(el => el.style.opacity = isProtocol ? '0.5' : '1');
  }

  /* ═══════════ HISTORY ═══════════════════════════════════════ */
  async refreshHistory() {
    if (!this.user) return;
    try {
      let apiTxs = [], apiStats = null;
      if (this.dbOnline) {
        apiTxs = await this.db.getTransactions(this.user, 100, 0, this.historyFilter !== 'all' ? this.historyFilter : null);
        const allTxs = this.historyFilter !== 'all' ? await this.db.getTransactions(this.user, 1000) : apiTxs;
        apiStats = {
          total: allTxs.length, swaps: allTxs.filter(tx => tx.tx_type === 'swap').length,
          machines: allTxs.filter(tx => tx.tx_type === 'buy_machine').length,
          batteries: allTxs.filter(tx => tx.tx_type === 'buy_battery').length,
          claims: allTxs.filter(tx => tx.tx_type === 'claim').length
        };
        this.activityData = await this.db.getActivityLog(this.user, 20);
        this.leaderboardData = await this.db.getLeaderboard(20);
      }
      if (apiTxs.length > 0) { this.historyData = apiTxs; this.historyStats = apiStats; }
      else {
        this.historyData = this.historyFilter === 'all' ? this.localTxLog : this.localTxLog.filter(tx => tx.type === this.historyFilter);
        this.historyStats = {
          total: this.localTxLog.length, swaps: this.localTxLog.filter(tx => tx.type === 'swap').length,
          machines: this.localTxLog.filter(tx => tx.type === 'buy_machine').length,
          batteries: this.localTxLog.filter(tx => tx.type === 'buy_battery').length,
          claims: this.localTxLog.filter(tx => tx.type === 'claim').length
        };
      }
      this.renderHistory(); this.renderActivityFeed(); this.renderLeaderboard(); this.updateProfileUI();
    } catch (e) { console.error('refreshHistory', e); }
  }
  filterHistory(filter) {
    this.historyFilter = filter;
    document.querySelectorAll('.tx-filter-tab').forEach(t => t.classList.remove('active'));
    const idx = ['all', 'swap', 'buy_machine', 'buy_battery', 'claim'].indexOf(filter);
    const tabs = document.querySelectorAll('.tx-filter-tab'); if (idx >= 0 && tabs[idx]) tabs[idx].classList.add('active');
    this.refreshHistory();
  }
  renderHistory() {
    const c = document.getElementById('history-list'); if (!c) return;
    const s = this.historyStats || {};
    ['txs-total','txs-swaps','txs-machines','txs-batteries','txs-claims'].forEach((id, i) => { const el = document.getElementById(id); if (el) el.innerText = s[['total','swaps','machines','batteries','claims'][i]] || 0; });
    if (!this.historyData.length) { c.innerHTML = `<div class="history-empty"><span class="history-empty-icon">📭</span><p>${this.t('noHistory')}</p></div>`; return; }
    const typeIcons = { swap: '💱', buy_machine: '⛏️', buy_battery: '🔋', claim: '🎁', send: '📤', receive: '📥', plug_in: '⚡', referral: '👥', deposit: '📥', withdraw: '📤' };
    const typeLabels = { swap: 'Swap', buy_machine: 'Machine', buy_battery: 'Battery', claim: 'Claim', send: 'Send', receive: 'Receive', plug_in: 'Plug In', referral: 'Referral', deposit: 'Deposit', withdraw: 'Withdraw' };
    c.innerHTML = this.historyData.slice(0, 50).map(tx => {
      const type = tx.tx_type || tx.type, icon = typeIcons[type] || '📋', label = typeLabels[type] || type;
      const time = tx.created_at ? new Date(tx.created_at).toLocaleString() : (tx.timestamp ? new Date(tx.timestamp).toLocaleString() : '');
      const hash = tx.tx_hash || tx.txHash; const hasHash = hash && hash !== 'local';
      const status = tx.status || (hash ? 'confirmed' : 'pending');
      const amountIn = tx.amount_from || tx.amountFrom || '', amountOut = tx.amount_to || tx.amountTo || '';
      const tokenIn = tx.token_from || tx.tokenFrom || '', tokenOut = tx.token_to || tx.tokenTo || '';
      return `<div class="tx-item"><div class="tx-item-header"><span class="tx-type-badge ${type}">${icon} ${label}</span><div style="display:flex;align-items:center;gap:8px;"><span class="tx-time">${time}</span><span class="tx-status ${status}">${status}</span></div></div><div class="tx-item-detail"><div class="tx-amount">${amountIn ? `<span class="tx-amount-in">${amountIn} ${tokenIn}</span>` : ''}${amountOut ? `<span class="tx-amount-out">→ ${amountOut} ${tokenOut}</span>` : ''}</div><div style="text-align:right;">${hasHash ? `<a class="tx-hash-link" href="https://polygonscan.com/tx/${hash}" target="_blank" rel="noopener">${hash.slice(0, 10)}... ↗</a>` : ''}</div></div></div>`;
    }).join('');
  }
  renderActivityFeed() {
    const c = document.getElementById('activity-feed'); if (!c) return;
    if (!this.activityData || !this.activityData.length) { c.innerHTML = `<p class="small-text" style="text-align:center;">${this.t('noActivity')}</p>`; return; }
    const dotClass = (action) => { if (['login','register','logout','deposit','withdraw','swap','buy_machine','buy_battery','claim'].includes(action)) return action; return 'default'; };
    c.innerHTML = this.activityData.slice(0, 15).map(a => `<div class="activity-item"><div class="activity-dot ${dotClass(a.action)}"></div><div class="activity-text">${a.details || a.action}</div><div class="activity-time">${a.created_at ? new Date(a.created_at).toLocaleTimeString() : ''}</div></div>`).join('');
  }
  renderLeaderboard() {
    const c = document.getElementById('leaderboard-list'); if (!c) return;
    const lb = this.leaderboardData;
    if (!lb || !lb.length) { c.innerHTML = `<p class="small-text" style="text-align:center;">Connect Supabase for live leaderboard</p>`; return; }
    c.innerHTML = lb.slice(0, 15).map((u, i) => {
      const rank = i + 1, rankClass = rank === 1 ? 'gold' : (rank === 2 ? 'silver' : (rank === 3 ? 'bronze' : ''));
      return `<div class="lb-item"><div class="lb-rank ${rankClass}">${rank}</div><div class="lb-info"><div class="lb-name">${u.username || 'Anonymous Miner'}</div><div class="lb-addr">${(u.wallet_address || '').slice(0, 8)}...</div></div><div class="lb-earned"><span class="lb-earned-val">${this.formatUsd(Number(u.total_earned || 0))}</span><span class="lb-earned-label">earned</span></div></div>`;
    }).join('');
  }

  /* ═══════════ RENDER UI ═════════════════════════════════════ */
  renderActiveMachines() {
    const c = document.getElementById('active-machines-list'); if (!c) return;
    const now = Math.floor(Date.now() / 1000), active = this.userMachines.filter(m => m.expiresAt > now);
    if (!active.length) { c.innerHTML = `<p class="small-text" style="text-align:center;">${this.t('noActiveMachines')}</p>`; return; }
    const tn = ['MK-I','MK-II','MK-III','MK-IV','MK-V','MK-VI','MK-VII','MK-VIII'];
    c.innerHTML = active.map(m => {
      const rem = m.expiresAt - now, dur = this.getBatteryDurationDays(m.pluggedBatteryType), tot = dur * 86400;
      const el = tot - rem, pr = Math.min(Math.max((el / tot) * 100, 0), 100);
      const bc = pr < 60 ? 'green' : (pr < 85 ? 'yellow' : 'red');
      return `<div class="asset-row">${this.getMachineMiniSVG(m.typeId)}<div class="asset-info"><div class="asset-name">${tn[m.typeId % 8]} <span class="status-pill active">● ${this.t('active')}</span></div><div class="asset-detail">${this.t('batteryLabel')}: ${dur} ${this.t('days')}</div><div class="battery-bar-wrap"><div class="battery-bar-header"><span class="battery-bar-label">${this.t('timeRemaining')}</span><span class="battery-bar-time ${bc}">${this.formatTimeRemaining(rem)}</span></div><div class="battery-bar"><div class="battery-bar-fill ${bc}" style="width:${pr.toFixed(1)}%"></div></div></div></div></div>`;
    }).join('');
  }
  renderUserMachines() {
    const c = document.getElementById('my-machines-list'); if (!c) return;
    if (!this.userMachines.length) { c.innerHTML = `<p class="small-text" style="text-align:center;">${this.t('noMachines')}</p>`; return; }
    const now = Math.floor(Date.now() / 1000), tn = ['MK-I','MK-II','MK-III','MK-IV','MK-V','MK-VI','MK-VII','MK-VIII'];
    c.innerHTML = this.userMachines.map((m, i) => {
      let sc, st;
      if (m.expiresAt > now) { sc = 'active'; st = this.t('active'); }
      else if (m.expiresAt > 0) { sc = 'expired'; st = this.t('expired'); }
      else { sc = 'inactive'; st = this.t('inactive'); }
      const dur = this.getBatteryDurationDays(m.pluggedBatteryType);
      let bh = '';
      if (m.expiresAt > 0) {
        const rem = m.expiresAt - now, tot = dur * 86400, el = tot - rem;
        const pr = Math.min(Math.max((el / tot) * 100, 0), 100);
        const bc = rem <= 0 ? 'red' : (pr < 60 ? 'green' : (pr < 85 ? 'yellow' : 'red'));
        bh = `<div class="battery-bar-wrap"><div class="battery-bar-header"><span class="battery-bar-label">${this.t('batteryLabel')}: ${dur} ${this.t('days')}</span><span class="battery-bar-time ${bc}">${rem > 0 ? this.formatTimeRemaining(rem) : this.t('expired')}</span></div><div class="battery-bar"><div class="battery-bar-fill ${rem <= 0 ? 'gray' : bc}" style="width:${rem <= 0 ? 100 : pr.toFixed(1)}%"></div></div></div>`;
      }
      return `<div class="asset-row">${this.getMachineMiniSVG(m.typeId)}<div class="asset-info"><div class="asset-name">#${i} ${tn[m.typeId % 8]} <span class="status-pill ${sc}">● ${st}</span></div><div class="asset-detail">${m.expiresAt > 0 ? this.t('plugged') : this.t('notPlugged')}</div>${bh}</div></div>`;
    }).join('');
  }
  renderUserBatteries() {
    const c = document.getElementById('my-batteries-list'); if (!c) return;
    const types = Object.entries(this.userBatteries).filter(([, cnt]) => cnt > 0);
    if (!types.length) { c.innerHTML = `<p class="small-text" style="text-align:center;">${this.t('noBatteries')}</p>`; return; }
    c.innerHTML = types.map(([tid, cnt]) => {
      const dur = this.getBatteryDurationDays(Number(tid)), cl = Math.floor(Math.random() * 40) + 60;
      const lc = cl > 60 ? '' : (cl > 20 ? 'medium' : (cl > 0 ? 'low' : 'empty'));
      return `<div class="asset-row"><div class="real-battery"><div class="battery-cap"></div><div class="battery-body"><div class="battery-level ${lc}" style="width:${cl}%"></div><div class="battery-charge-indicator">${cnt}×</div></div></div><div class="asset-info"><div class="asset-name">${dur} ${this.t('days')} <span class="status-pill available">● ${cnt} ${this.t('available')}</span></div></div></div>`;
    }).join('');
  }

  /* ═══════════ SVG MACHINES ═════════════════════════════════ */
  getMachineSVG(tier) {
    const t = [{ n: 'MK-I', g: 1, c: '#64748b', a: '#94a3b8', f: 1 }, { n: 'MK-II', g: 2, c: '#3b82f6', a: '#60a5fa', f: 1 }, { n: 'MK-III', g: 3, c: '#8b5cf6', a: '#a78bfa', f: 2 }, { n: 'MK-IV', g: 4, c: '#F0B90B', a: '#FFD43B', f: 2 }, { n: 'MK-V', g: 5, c: '#f97316', a: '#fb923c', f: 2 }, { n: 'MK-VI', g: 6, c: '#ef4444', a: '#f87171', f: 3 }, { n: 'MK-VII', g: 8, c: '#06b6d4', a: '#22d3ee', f: 3 }, { n: 'MK-VIII', g: 8, c: '#eab308', a: '#facc15', f: 4 }][tier % 8];
    const W = 260, H = 170; let gH = '', fH = '', lH = '', vH = '';
    const gw = 24, gh = 48, gG = 3, mW = W - 40; let eg = gw;
    let tW = t.g * eg + (t.g - 1) * gG;
    if (tW > mW) { eg = Math.floor((mW - (t.g - 1) * gG) / t.g); tW = t.g * eg + (t.g - 1) * gG; }
    const gS = (W - tW) / 2, gY = 22;
    for (let i = 0; i < t.g; i++) {
      const x = gS + i * (eg + gG);
      gH += `<rect x="${x}" y="${gY}" width="${eg}" height="${gh}" rx="2" fill="#080c18" stroke="${t.a}" stroke-width="0.6" opacity="0.85"/>`;
      const fC = Math.max(3, Math.floor(eg / 4)), fS = eg - 6;
      for (let j = 0; j < 9; j++) { const fy = gY + 5 + j * 4.5; if (fy + 2 < gY + gh - 10) { for (let f = 0; f < fC; f++) { gH += `<rect x="${x + 3 + f * (fS / fC)}" y="${fy}" width="${Math.max(1, (fS / fC) - 1.5)}" height="2" rx="0.5" fill="${t.a}" opacity="0.12"/>`; } } }
      const cW = Math.min(10, eg - 6); gH += `<rect x="${x + (eg - cW) / 2}" y="${gY + gh - 11}" width="${cW}" height="7" rx="1.5" fill="${t.c}" opacity="0.35"/><circle cx="${x + eg / 2}" cy="${gY + 3}" r="1" fill="${t.a}" class="led-pulse" style="animation-delay:${i * 0.3}s"/>`;
    }
    const fR = 14, fS2 = 14, tFW2 = t.f * fR * 2 + (t.f - 1) * fS2, fSX = (W - tFW2) / 2, fY = 100;
    for (let i = 0; i < t.f; i++) {
      const cx = fSX + i * (fR * 2 + fS2) + fR, cy = fY;
      fH += `<circle cx="${cx}" cy="${cy}" r="${fR + 2}" fill="#060a14" stroke="#2a2a3e" stroke-width="1"/><circle cx="${cx}" cy="${cy}" r="${fR}" fill="#0a0e1a" stroke="#333" stroke-width="0.8"/><g class="fan-blades" style="transform-origin:${cx}px ${cy}px">`;
      for (let b = 0; b < 5; b++) fH += `<rect x="${cx - 1.5}" y="${cy - fR + 3}" width="3" height="${fR - 4}" rx="1.5" fill="#1e293b" transform="rotate(${b * 72},${cx},${cy})"/>`;
      fH += `</g><circle cx="${cx}" cy="${cy}" r="3.5" fill="${t.a}" opacity="0.4"/><circle cx="${cx}" cy="${cy}" r="1.5" fill="${t.a}" opacity="0.7"/>`;
    }
    for (let i = 0; i < 6; i++) { const lx = 25 + i * 9; lH += `<circle cx="${lx}" cy="148" r="1.8" fill="${i === 0 ? '#10b981' : (i < 3 ? t.a : '#334155')}" class="led-pulse" style="animation-delay:${i * 0.4}s"/>`; }
    for (let v = 0; v < 3; v++) vH += `<rect x="30" y="${138 + v * 5}" width="${W - 60}" height="2" rx="1" fill="#060a14" opacity="0.8"/>`;
    return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" class="machine-svg"><defs><linearGradient id="bG${tier}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1e293b"/><stop offset="50%" stop-color="#162032"/><stop offset="100%" stop-color="#0f172a"/></linearGradient><linearGradient id="tB${tier}" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="${t.c}" stop-opacity="0.8"/><stop offset="50%" stop-color="${t.a}" stop-opacity="1"/><stop offset="100%" stop-color="${t.c}" stop-opacity="0.8"/></linearGradient></defs><ellipse cx="${W / 2}" cy="${H - 3}" rx="${W / 2 - 30}" ry="10" fill="${t.a}" opacity="0.06"/><rect x="12" y="10" width="${W - 24}" height="${H - 22}" rx="8" fill="url(#bG${tier})" stroke="#2a3550" stroke-width="1.2"/><rect x="12" y="10" width="${W - 24}" height="4" rx="2" fill="url(#tB${tier})"/><circle cx="20" cy="18" r="1.5" fill="#334155"/><circle cx="${W - 20}" cy="18" r="1.5" fill="#334155"/><text x="${W - 22}" y="20" font-family="monospace" font-size="7" font-weight="700" fill="${t.a}" text-anchor="end" opacity="0.7">${t.n}</text><text x="24" y="20" font-family="sans-serif" font-size="6" font-weight="800" fill="#475569" letter-spacing="1.5">FITIA</text>${gH}<line x1="28" y1="${gY + gh + 6}" x2="${W - 28}" y2="${gY + gh + 6}" stroke="#1e293b" stroke-width="0.8" stroke-dasharray="2,2"/>${fH}${vH}${lH}<circle cx="${W - 25}" cy="148" r="3.5" fill="none" stroke="${t.a}" stroke-width="0.8" opacity="0.5"/><line x1="${W - 25}" y1="143.5" x2="${W - 25}" y2="146" stroke="${t.a}" stroke-width="0.8" opacity="0.5"/></svg>`;
  }
  getMachineMiniSVG(tier) {
    const c = ['#64748b','#3b82f6','#8b5cf6','#F0B90B','#f97316','#ef4444','#06b6d4','#eab308'][tier % 8];
    const a = ['#94a3b8','#60a5fa','#a78bfa','#FFD43B','#fb923c','#f87171','#22d3ee','#facc15'][tier % 8];
    return `<svg viewBox="0 0 50 50" class="machine-svg-mini"><rect x="2" y="2" width="46" height="46" rx="6" fill="#1e293b" stroke="${c}" stroke-width="1"/><rect x="2" y="2" width="46" height="3" rx="1.5" fill="${c}" opacity="0.6"/><rect x="8" y="10" width="14" height="20" rx="2" fill="#080c18" stroke="${a}" stroke-width="0.5"/><rect x="28" y="10" width="14" height="20" rx="2" fill="#080c18" stroke="${a}" stroke-width="0.5"/><circle cx="21" cy="40" r="6" fill="#0a0e1a" stroke="#333" stroke-width="0.5"/><g class="fan-blades" style="transform-origin:21px 40px">${[0,72,144,216,288].map(r => `<rect x="19.5" y="34.5" width="3" height="5" rx="1.5" fill="#1e293b" transform="rotate(${r},21,40)"/>`).join('')}</g><circle cx="21" cy="40" r="2" fill="${a}" opacity="0.6"/><circle cx="37" cy="40" r="6" fill="#0a0e1a" stroke="#333" stroke-width="0.5"/><g class="fan-blades" style="transform-origin:37px 40px">${[0,72,144,216,288].map(r => `<rect x="35.5" y="34.5" width="3" height="5" rx="1.5" fill="#1e293b" transform="rotate(${r},37,40)"/>`).join('')}</g><circle cx="37" cy="40" r="2" fill="${a}" opacity="0.6"/></svg>`;
  }

  _renderShopMachinesHTML(c) {
    c.innerHTML = ''; c.style.gridTemplateColumns = '1fr 1fr';
    const bc = ['background:#64748b;color:#fff','background:#3b82f6;color:#fff','background:#8b5cf6;color:#fff','background:#F0B90B;color:#000','background:#f97316;color:#fff','background:#ef4444;color:#fff','background:#06b6d4;color:#000','background:#eab308;color:#000'];
    const bn = ['STARTER','STANDARD','ADVANCED','PRO','ELITE','ULTRA','SUPREME','LEGEND'];
    for (let i = 0; i < this.shopMachinesData.length; i++) {
      const d = this.shopMachinesData[i], div = document.createElement('div');
      div.className = 'rig-item';
      div.innerHTML = `<span class="tier-badge" style="${bc[i % 8]}">${bn[i % 8]}</span>${this.getMachineSVG(i)}<span class="rig-name" style="font-size:0.85rem;">${this.t('rig')} ${i + 1}</span><span class="rig-power" style="font-size:0.75rem;">${this.formatHashrate(d.power)}</span><span class="rig-price" style="font-size:1rem;">${d.price.toFixed(2)} $</span><button class="btn-primary" style="padding:8px;font-size:0.75rem;margin-top:6px;" onclick="App.buyMachine(${i})">${this.t('buy')} (${this.payMode})</button>`;
      c.appendChild(div);
    }
  }
  _renderShopBatteriesHTML(c) {
    c.innerHTML = ''; c.style.gridTemplateColumns = '1fr 1fr';
    for (let i = 0; i < this.shopBatteriesData.length; i++) {
      const d = this.shopBatteriesData[i], div = document.createElement('div'), cl = Math.floor(Math.random() * 40) + 60;
      div.className = 'battery-shop-item';
      div.innerHTML = `<div class="real-battery"><div class="battery-cap"></div><div class="battery-body"><div class="battery-level" style="width:${cl}%"></div><div class="battery-charge-indicator">${d.days}D</div></div></div><div class="battery-name">${d.days} ${this.t('days')}</div><div class="battery-price">${d.price.toFixed(2)} $</div><button class="btn-primary" style="padding:6px;font-size:0.75rem" onclick="App.buyBattery(${i})">${this.t('buy')} (${this.payMode})</button>`;
      c.appendChild(div);
    }
  }

  /* ═══════════ VISUALIZER ═══════════════════════════════════ */
  resizeCanvas() { if (this.vizContext) { const c = this.vizContext.canvas; c.width = c.offsetWidth * 2; c.height = c.offsetHeight * 2; } }
  initVisualizer() { const c = document.getElementById('mining-canvas'); if (!c) return; this.resizeCanvas(); this.vizContext = c.getContext('2d'); this.vizBars = []; for (let i = 0; i < 20; i++) this.vizBars.push({ height: 0, targetHeight: 0 }); this.animateVisualizer(); }
  updateVisualizerIntensity(p) { const maxP = 100000, level = Math.min(Math.max(p / maxP, 0.02), 1); this.vizBars.forEach(b => { b.targetHeight = (this.vizContext.canvas.height * level) * (0.6 + Math.random() * 0.4); }); }
  animateVisualizer() { if (!this.vizContext) return; const ctx = this.vizContext; ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); ctx.fillStyle = "#F0B90B"; const w = ctx.canvas.width / 20; this.vizBars.forEach((b, i) => { b.height += (b.targetHeight - b.height) * 0.1; ctx.fillRect(i * w + 2, ctx.canvas.height - b.height, w - 4, b.height); b.targetHeight += (Math.random() - 0.5) * 10; if (b.targetHeight < 0) b.targetHeight = 2; if (b.targetHeight > ctx.canvas.height) b.targetHeight = ctx.canvas.height; }); requestAnimationFrame(() => this.animateVisualizer()); }

  /* ═══════════ LOADER / TOAST / ERRORS ══════════════════════ */
  setLoader(show, msg = "Processing...") { const l = document.getElementById('loader'); document.getElementById('loader-text').innerText = msg; if (show) l.classList.remove('hidden'); else l.classList.add('hidden'); }
  showToast(msg, isError = false) { const div = document.createElement('div'); div.className = 'toast' + (isError ? ' toast-error' : ' toast-success'); div.innerText = msg; document.getElementById('toast-container').appendChild(div); setTimeout(() => div.remove(), 5000); }
  getErrorMessage(e) {
    const es = (e?.message || '').toLowerCase() + ' ' + (e?.code || '').toLowerCase() + ' ' + (e?.reason || '').toLowerCase() + ' ' + (e?.shortMessage || '').toLowerCase();
    const ie = (e?.info?.error?.message || '').toLowerCase(); const c = es + ' ' + ie;
    if (c.includes('user rejected') || c.includes('user denied') || c.includes('cancelled by user') || c.includes('action_rejected') || e?.code === 'ACTION_REJECTED' || e?.code === 4001 || e?.code === -32000 || (e?.info?.error?.code === 4001)) return this.t('errRejected');
    if (c.includes('insufficient liquidity')) return this.t('errLowLiquidity');
    if (c.includes('insufficient funds') || c.includes('insufficient balance') || c.includes('not enough') || c.includes('underpriced') || c.includes('exceeds allowance') || c.includes('erc20: insufficient') || c.includes('transfer amount exceeds')) return this.t('errInsufficientFunds');
    if (c.includes('nonce') || c.includes('already known')) return this.t('errNonce');
    if (c.includes('already pending')) return this.t('errAlreadyPending');
    if (c.includes('timeout') || c.includes('timed out')) return this.t('errTimeout');
    if (c.includes('network') || c.includes('fetch') || c.includes('failed to fetch') || c.includes('connection') || c.includes('could not decode') || c.includes('missing revert data') || c.includes('call revert exception')) return this.t('errNetwork');
    if (c.includes('invalid amount')) return this.t('errSwapRejected');
    if (c.includes('revert') || c.includes('execution reverted') || c.includes('vm execution error') || c.includes('gas required exceeds allowance') || c.includes('transaction failed')) return this.t('errContract');
    return this.t('errGeneric');
  }
  showError(e) { console.error("Transaction Error:", e); this.showToast(this.getErrorMessage(e), true); }

  /* ═══════════ INTELLIGENT CHAT ASSISTANT ═══════════════════ */
  toggleChat() {
    const p = document.getElementById('chat-panel'); const active = p.classList.toggle('active');
    if (active && !this.chatInitialized) { this.chatInitialized = true; setTimeout(() => this.addChatBubble('assistant', this.getWelcomeMessage()), 400); }
    if (active) setTimeout(() => document.getElementById('chat-input').focus(), 350);
  }
  sendChatMessage() {
    const i = document.getElementById('chat-input'), msg = i.value.trim(); if (!msg) return; i.value = '';
    this.addChatBubble('user', msg); this.chatHistory.push({ role: 'user', text: msg });
    if (this.chatHistory.length > 20) this.chatHistory = this.chatHistory.slice(-20);
    const tid = this.showTyping();
    setTimeout(() => { this.removeTyping(tid); const response = this.think(msg); this.addChatBubble('assistant', response); this.chatHistory.push({ role: 'assistant', text: response }); }, 400 + Math.min(msg.length * 20, 1500) + Math.random() * 600);
  }
  addChatBubble(role, text) { const c = document.getElementById('chat-messages'), b = document.createElement('div'); b.className = `chat-bubble ${role}`; b.textContent = text; c.appendChild(b); requestAnimationFrame(() => c.scrollTop = c.scrollHeight); }
  showTyping() { const c = document.getElementById('chat-messages'), t = document.createElement('div'); const id = 'typing-' + Date.now(); t.id = id; t.className = 'chat-bubble assistant'; t.innerHTML = '<span style="letter-spacing:3px;animation:loaderTextPulse 1s infinite">● ● ●</span>'; c.appendChild(t); c.scrollTop = c.scrollHeight; return id; }
  removeTyping(id) { const e = document.getElementById(id); if (e) e.remove(); }

  getWelcomeMessage() {
    const conn = !!this.user;
    const username = (this.profileData && this.profileData.username) || '';
    const greeting = username ? `, ${username}` : '';
    const nfsHuman = parseFloat(ethers.formatUnits(this.netFtaVal, this.ftaDecimals));
    const liqMsg = this.netFtaVal === 0n
      ? '\n\n⚠️ Protocol liquidity is building. Deposit USDT first — it always works!'
      : `\n\n💧 Liquidity: ${nfsHuman.toFixed(2)} FTA`;
    if (conn) {
      const active = this.userMachines.filter(m => m.expiresAt > Math.floor(Date.now() / 1000)).length;
      return `👋 Welcome back${greeting}!\n\n⚡ ${active} active machine(s) at ${this.formatHashrate(this.currentRealPower)}.\n💎 Pending: ${this.pendingBalance.toFixed(5)} FTA${liqMsg}\n\n💬 Ask me about mining, deposits, swaps, strategy — I'm here to help! 🚀`;
    }
    const msgs = { en: `👋 Welcome to Fitia Pro v3!\n\n⚡ Dual-contract (Core + Mine).\n🔐 Embedded wallet — no MetaMask needed.\n📥 Set your PIN to create a wallet → use protocol → withdraw anytime.\n\n💬 Tap Connect to get started!` };
    return msgs[this.currentLang] || msgs.en;
  }

  think(msg) {
    const m = msg.toLowerCase().replace(/[?!.,;:'"]/g, '').trim(); const L = this.currentLang; const conn = !!this.user;
    const ctx = {
      ftaPrice: this.ftaPriceUsd > 0 ? this.ftaPriceUsd.toFixed(6) : '...',
      ftaPriceUsd: this.formatUsd(this.ftaPriceUsd),
      nfs: parseFloat(ethers.formatUnits(this.netFtaVal, this.ftaDecimals)),
      liquidity: this.netFtaVal === 0n ? '0' : parseFloat(ethers.formatUnits(this.netFtaVal, this.ftaDecimals)).toFixed(2) + ' FTA',
      power: this.formatHashrate(this.currentRealPower),
      pending: this.pendingBalance.toFixed(5),
      active: this.userMachines ? this.userMachines.filter(x => x.expiresAt > Math.floor(Date.now() / 1000)).length : 0,
      totalMachines: this.userMachines ? this.userMachines.length : 0,
      username: (this.profileData && this.profileData.username) || 'Miner',
      wallet: this.user ? this.user.slice(0, 6) + '...' + this.user.slice(-4) : '',
      isFr: L === 'fr',
      machines: this.shopMachinesData,
      batteries: this.shopBatteriesData
    };
    if (this._isGreeting(m)) return this._respondGreeting(ctx, L);
    if (this._isThanks(m)) return this._respondThanks(L);
    const intent = this._detectIntent(m);
    switch (intent) {
      case 'what_is_fitia': return ctx.isFr ? `🪙 Fitia Pro v3 — Écosystème Web3 sur Polygon.\n\n⚡ Dual-contract (Core + Mine).\n📥 Déposez → utilisez → retirez.` : `🪙 Fitia Pro v3 — Web3 ecosystem on Polygon.\n\n⚡ Dual-contract (Core + Mine).\n📥 Deposit → use protocol → withdraw anytime.`;
      case 'deposit_help': return ctx.isFr ? `📥 Allez dans Wallet → Déposer sur le token souhaité.\n\nApprouvez si besoin → entrez le montant → confirmez.\n\nVos tokens sont dans le contrat Core — sécurisés. Retrait avec 3% de frais.` : `📥 Go to Wallet → Deposit on your token.\n\nApprove if needed → enter amount → confirm.\n\nTokens held in Core contract — secure. 3% withdrawal fee.`;
      case 'how_mining_works': return ctx.isFr ? `⛏️ 1️⃣ Déposez USDT 2️⃣ Achetez Machine 3️⃣ Batterie 4️⃣ Branchez 5️⃣ Minez → RÉCLAMEZ` : `⛏️ 1️⃣ Deposit USDT 2️⃣ Buy Machine 3️⃣ Get Battery 4️⃣ Plug In 5️⃣ Mine → CLAIM`;
      case 'beginner_guide': return ctx.isFr ? `🚀 1. Créez un wallet (PIN) 2. Achetez POL+USDT (Polygon!) 3. Déposez USDT (Wallet) 4. Achetez MK-I 5. Batterie + Branchez 6. RÉCLAMEZ!` : `🚀 1. Create wallet (set PIN) 2. Buy POL+USDT (Polygon!) 3. Deposit USDT (Wallet) 4. Buy MK-I 5. Battery + Plug In 6. CLAIM!`;
      case 'how_swap_works': return ctx.isFr ? `💱 Les swaps utilisent votre *solde protocole* (pas wallet).\nUSDT→FTA ajoute de la liquidité.\nFTA→USDT nécessite liquidité > 0.` : `💱 Swaps use your *protocol balance* (not wallet).\nUSDT→FTA adds liquidity.\nFTA→USDT needs liquidity > 0.`;
      case 'help': return ctx.isFr ? `🛠️ Demandez-moi : Mining • Swap • Dépôt • 4 Visions • Débutant • Sécurité` : `🛠️ Ask me: Mining • Swap • Deposit • 4 Visions • Beginner • Security`;
      default: return ctx.isFr ? `💡 Essayez "comment miner", "comment déposer", "explique les swaps", ou "je suis débutant"!` : `💡 Try "how to mine", "how to deposit", "explain swaps", or "I'm a beginner"!`;
    }
  }

  _detectIntent(m) {
    const topics = {
      what_is_fitia: ['what is fitia','c quoi fitia','about fitia','explain fitia','介绍','fitia是什么','overview','fitia project'],
      deposit_help: ['deposit','déposer','存入','how to deposit','add funds','recharger','fund','top up'],
      how_mining_works: ['how mining','how to mine','comment miner','mining work','explain mining','minage','mine','mining','挖矿'],
      beginner_guide: ['beginner','débutant','新手','how to start','getting started','commencer','first time','new user','step by step','guide','start'],
      how_swap_works: ['how swap','swap work','exchange','échanger','兑换','how to swap','comment échanger'],
      help: ['help','aide','帮助','what can you','commands','features','options']
    };
    let best = null, bestScore = 0;
    for (const [topic, keywords] of Object.entries(topics)) {
      let score = 0;
      for (const kw of keywords) { if (m.includes(kw)) score += kw.length >= 8 ? 3 : (kw.length >= 5 ? 2 : 1); }
      if (score > bestScore) { bestScore = score; best = topic; }
    }
    return bestScore >= 2 ? best : 'default';
  }

  _isGreeting(m) { const g = ['hello','hi','hey','bonjour','salut','coucou','bonsoir','hallo','你好','您好','yo','sup']; return g.some(w => m.includes(w)) || m.length <= 4; }
  _isThanks(m) { return ['thanks','thank you','thx','ty','merci','danke','谢谢','cheers'].some(w => m.includes(w)); }
  _respondGreeting(ctx, L) {
    if (!this.user) return L==='fr' ? `👋 Bonjour ! Créez votre wallet pour commencer.\n\n⚡ Fitia Pro v3 — Dual-contract (Core + Mine).\n🔐 Wallet intégré — pas besoin de MetaMask.` : `👋 Hello! Create your wallet to start.\n\n⚡ Fitia Pro v3 — Dual-contract (Core + Mine).\n🔐 Embedded wallet — no MetaMask needed.`;
    return L==='fr' ? `👋 Bon retour${ctx.username !== 'Miner' ? ', ' + ctx.username : ''}!\n⚡ ${ctx.active} machine(s) | ⛏️ ${ctx.power}` : `👋 Welcome back${ctx.username !== 'Miner' ? ', ' + ctx.username : ''}!\n⚡ ${ctx.active} machine(s) | ⛏️ ${ctx.power}`;
  }
  _respondThanks(L) { const arr = L==='fr' ? ["De rien ! 😊","Avec plaisir ! 🚀"] : ["You're welcome! 😊","Anytime! 🚀"]; return arr[Math.floor(Math.random() * arr.length)]; }
}

const App = new Application();
window.onload = () => App.init();
