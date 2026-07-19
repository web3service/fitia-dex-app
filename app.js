// Détection environnement APK (Capacitor)
const IS_APK = !!window.Capacitor?.isNativePlatform;
if (IS_APK) document.documentElement.classList.add('native-app');

// ─── Configuration ─────────────────────────────────────────────────
const CONFIG = {
  // ⚠️ À REMPLACER avec les adresses réelles déployées sur Polygon
  CORE: "0xAaba9Ae712d501474351C252C931f95189895126",
  MINE: "0x9eEaBEf8369812932B5f846949861fEBcFC37E73",
  USDT: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
  FTA:  "0x5c418b12c7e9c2A8e9A71A68c6d9b319E7B1d1fd",
  CHAIN_ID: 137,
  // 🔑 Web3Auth : crée un compte sur https://dashboard.web3auth.io
  // Plug and Play Auth Network -> copie le clientId
  WEB3AUTH_CLIENT_ID: "BB8-sW8_NENPty92A-Mx0_yXq2MVZUK9yg3Y8RpuClJO8x-L_N7n_IlXR5b230lFeEJaIGSEV1i2q8HoK3dTEwA",
  WHATSAPP_GROUP: "https://chat.whatsapp.com/BDsvPCB6xp8H8X0YaRmPFP",
  WHATSAPP_CHANNEL: "https://whatsapp.com/channel/0029VbCQhI38PgsPLbBJdV1e"
};

// ─── Traductions i18n ──────────────────────────────────────────────
const i18n = {
  en: { connect: "Connect", refTitle: "👥 Referral System", refDesc: "Enter referrer address or ID to link.", bindRef: "BIND", power: "POWER", ftaSec: "Hashrate", pending: "PENDING", fta: "FTA", miningActive: "MINING ACTIVE", noMachine: "NO MACHINE", claim: "CLAIM", shopTitle: "⛏️ Shop", machines: "Machines", batteries: "Batteries", buy: "BUY", myAssets: "⚙️ Wallet & Assets", walletBal: "💰 Balances", plugMachine: "🔌 Plug in a machine", plugDesc: "Select a machine index and battery type.", machineId: "Machine Index (0, 1...)", plug: "PLUG IN ⚡", swapTitle: "💱 Swap", youPay: "You pay", balance: "Balance:", youReceive: "You receive", swap: "SWAP", loading: "Loading...", currentRate: "1 FTA = ", home: "Home", shop: "Shop", assets: "Wallet", swapNav: "Swap", connWallet: "Connecting...", errConn: "Connection Error", linking: "Linking...", refLinked: "Referrer linked!", connFirst: "Connect first", enterRefAddr: "Referrer address or ID (0x...)", buyingMachine: "Buying Machine", buyingBattery: "Buying Battery", confirming: "Confirming...", calcFta: "Calculating price...", machineBought: "Machine purchased!", batteryBought: "Battery purchased!", invalidId: "Invalid Machine Index", pluggingIn: "Plugging in...", pluggedIn: "Machine plugged in! ⚡", invalidAmount: "Invalid amount", swapping: "Swapping...", swapSuccess: "Swap successful!", claiming: "Claiming...", claimed: "Rewards claimed!", error: "Error", days: "Days", rig: "RIG", totalBal: "Total Balance", activeMachines: "⛏️ Active Machines", myMachines: "⛏️ My Machines", myBatteries: "🔋 My Batteries", active: "Active", expired: "Expired", inactive: "Inactive", available: "Available", plugged: "Plugged", notPlugged: "Not Plugged", timeRemaining: "Remaining", noMachines: "No machines yet", noBatteries: "No batteries yet", batteryLabel: "Battery", usdtPerFta: " USDT", noActiveMachines: "No active machines", exchangeRate: "Exchange Rate", priceImpact: "Price Impact", swapFee: "Swap Fee (4%)", minimumReceived: "Minimum Received", slippageTolerance: "Slippage Tolerance", networkFee: "Network Fee", depositBtn: "DEPOSIT", withdrawBtn: "WITHDRAW", depositing: "Depositing...", depositSuccess: "Deposit successful!", withdrawing: "Withdrawing...", withdrawSuccess: "Withdrawal successful!", send: "Send", receive: "Receive", sending: "Sending...", sentSuccess: "Sent successfully!", addrCopied: "Address copied!", confirmSend: "CONFIRM SEND", invalidAddr: "Invalid address", recipientAddr: "Recipient address (0x...)", amount: "Amount", errRejected: "Transaction cancelled", errInsufficientFunds: "Insufficient balance", errNetwork: "Network error. Please try again.", errTimeout: "Transaction timed out.", errContract: "Transaction failed. Please try again.", errGeneric: "An error occurred.", errAlreadyPending: "Transaction pending. Please wait.", errNonce: "Nonce error. Restart the app.", errNoMachine: "No machine", errRunning: "Machine already running", errNoBattery: "No battery of this type", errMaxMachine: "Max machines reached" },
  fr: { connect: "Connecter", refTitle: "👥 Parrainage", refDesc: "Entrez l'adresse ou l'ID du parrain.", bindRef: "LIER", power: "PUISSANCE", ftaSec: "Hashrate", pending: "EN ATTENTE", fta: "FTA", miningActive: "MINAGE ACTIF", noMachine: "AUCUNE MACHINE", claim: "RÉCLAMER", shopTitle: "⛏️ Boutique", machines: "Machines", batteries: "Batteries", buy: "ACHETER", myAssets: "⚙️ Wallet & Actifs", walletBal: "💰 Soldes", plugMachine: "🔌 Brancher une machine", plugDesc: "Choisissez l'index d'une machine et le type de batterie.", machineId: "Index Machine (0, 1...)", plug: "BRANCHER ⚡", swapTitle: "💱 Échange", youPay: "Vous payez", balance: "Solde:", youReceive: "Vous recevez", swap: "ÉCHANGER", loading: "Chargement...", currentRate: "1 FTA = ", home: "Accueil", shop: "Boutique", assets: "Wallet", swapNav: "Swap", connWallet: "Connexion...", errConn: "Erreur connexion", linking: "Liaison...", refLinked: "Parrain lié!", connFirst: "Connectez-vous d'abord", enterRefAddr: "Adresse ou ID parrain (0x...)", buyingMachine: "Achat Machine", buyingBattery: "Achat Batterie", confirming: "Confirmation...", calcFta: "Calcul du prix...", machineBought: "Machine achetée!", batteryBought: "Batterie achetée!", invalidId: "Index Machine invalide", pluggingIn: "Branchement...", pluggedIn: "Machine branchée! ⚡", invalidAmount: "Montant invalide", swapping: "Échange...", swapSuccess: "Échange réussi!", claiming: "Récupération...", claimed: "Gains réclamés!", error: "Erreur", days: "Jours", rig: "RIG", totalBal: "Solde Total", activeMachines: "⛏️ Machines Actives", myMachines: "⛏️ Mes Machines", myBatteries: "🔋 Mes Batteries", active: "Actif", expired: "Expiré", inactive: "Inactif", available: "Disponible", plugged: "Branché", notPlugged: "Non branché", timeRemaining: "Restant", noMachines: "Aucune machine", noBatteries: "Aucune batterie", batteryLabel: "Batterie", usdtPerFta: " USDT", noActiveMachines: "Aucune machine active", exchangeRate: "Taux de change", priceImpact: "Impact prix", swapFee: "Frais swap (4%)", minimumReceived: "Minimum reçu", slippageTolerance: "Tolérance slippage", networkFee: "Frais réseau", depositBtn: "DÉPOSER", withdrawBtn: "RETIRER", depositing: "Dépôt...", depositSuccess: "Dépôt réussi!", withdrawing: "Retrait...", withdrawSuccess: "Retrait réussi!", send: "Envoyer", receive: "Recevoir", sending: "Envoi...", sentSuccess: "Envoi réussi!", addrCopied: "Adresse copiée!", confirmSend: "CONFIRMER L'ENVOI", invalidAddr: "Adresse invalide", recipientAddr: "Adresse destinataire (0x...)", amount: "Montant", errRejected: "Transaction annulée", errInsufficientFunds: "Solde insuffisant", errNetwork: "Erreur réseau. Réessayez.", errTimeout: "Délai expiré.", errContract: "Transaction échouée. Réessayez.", errGeneric: "Une erreur est survenue.", errAlreadyPending: "Transaction en cours. Patientez.", errNonce: "Erreur nonce. Redémarrez l'app.", errNoMachine: "Aucune machine", errRunning: "Machine déjà en marche", errNoBattery: "Pas de batterie de ce type", errMaxMachine: "Maximum de machines atteint" },
  de: { connect: "Verbinden", refTitle: "👥 Empfehlung", refDesc: "Empfehler-Adresse oder ID eingeben.", bindRef: "BINDEN", power: "LEISTUNG", ftaSec: "Hashrate", pending: "AUSSTEHEND", fta: "FTA", miningActive: "MINING AKTIV", noMachine: "KEINE MASCHINE", claim: "EINFORDERN", shopTitle: "⛏️ Shop", machines: "Maschinen", batteries: "Batterien", buy: "KAUFEN", myAssets: "⚙️ Wallet & Assets", walletBal: "💰 Guthaben", plugMachine: "🔌 Maschine anschließen", plugDesc: "Wähle Maschinen-Index und Batterietyp.", machineId: "Maschinen-Index (0, 1...)", plug: "ANSCHLIESSEN ⚡", swapTitle: "💱 Tausch", youPay: "Sie zahlen", balance: "Guthaben:", youReceive: "Sie erhalten", swap: "TAUSCHEN", loading: "Laden...", currentRate: "1 FTA = ", home: "Home", shop: "Shop", assets: "Wallet", swapNav: "Swap", connWallet: "Verbindung...", errConn: "Verbindungsfehler", linking: "Verknüpfung...", refLinked: "Empfehler verknüpft!", connFirst: "Zuerst verbinden", enterRefAddr: "Empfehler-Adresse oder ID (0x...)", buyingMachine: "Kaufe Maschine", buyingBattery: "Kaufe Batterie", confirming: "Bestätigung...", calcFta: "Preis berechnen...", machineBought: "Maschine gekauft!", batteryBought: "Batterie gekauft!", invalidId: "Ungültiger Index", pluggingIn: "Anschließen...", pluggedIn: "Angeschlossen! ⚡", invalidAmount: "Ungültiger Betrag", swapping: "Tauschen...", swapSuccess: "Tausch erfolgreich!", claiming: "Einforderung...", claimed: "Eingefordert!", error: "Fehler", days: "Tage", rig: "RIG", totalBal: "Gesamtguthaben", activeMachines: "⛏️ Aktive Maschinen", myMachines: "⛏️ Meine Maschinen", myBatteries: "🔋 Meine Batterien", active: "Aktiv", expired: "Abgelaufen", inactive: "Inaktiv", available: "Verfügbar", plugged: "Angeschlossen", notPlugged: "Nicht angeschlossen", timeRemaining: "Verbleibend", noMachines: "Keine Maschinen", noBatteries: "Keine Batterien", batteryLabel: "Batterie", usdtPerFta: " USDT", noActiveMachines: "Keine aktive Maschinen", exchangeRate: "Wechselkurs", priceImpact: "Preisauswirkung", swapFee: "Swapgebühr (4%)", minimumReceived: "Mindestbetrag", slippageTolerance: "Slippage-Toleranz", networkFee: "Netzwerkgebühr", depositBtn: "EINZAHLEN", depositing: "Einzahlung...", depositSuccess: "Einzahlung erfolgreich!", errRejected: "Transaktion abgebrochen", errInsufficientFunds: "Unzureichendes Guthaben", errNetwork: "Netzwerkfehler. Bitte versuchen Sie es erneut.", errTimeout: "Zeitüberschreitung.", errContract: "Transaktion fehlgeschlagen.", errGeneric: "Ein Fehler ist aufgetreten.", errAlreadyPending: "Transaktion ausstehend.", errNonce: "Nonce-Fehler. App neustarten.", errNoMachine: "Keine Maschine", errRunning: "Maschine läuft bereits", errNoBattery: "Keine Batterie dieses Typs", errMaxMachine: "Maximale Maschinen erreicht" },
  zh: { connect: "连接", refTitle: "👥 推荐系统", refDesc: "输入推荐人地址或ID进行绑定。", bindRef: "绑定", power: "算力", ftaSec: "Hashrate", pending: "待领取", fta: "FTA", miningActive: "挖矿中", noMachine: "无机器", claim: "领取", shopTitle: "⛏️ 商店", machines: "矿机", batteries: "电池", buy: "购买", myAssets: "⚙️ 钱包与资产", walletBal: "💰 余额", plugMachine: "🔌 插入机器", plugDesc: "选择机器索引和电池类型。", machineId: "机器索引 (0, 1...)", plug: "插入 ⚡", swapTitle: "💱 兑换", youPay: "您支付", balance: "余额:", youReceive: "您收到", swap: "兑换", loading: "加载中...", currentRate: "1 FTA = ", home: "首页", shop: "商店", assets: "钱包", swapNav: "兑换", connWallet: "连接中...", errConn: "连接错误", linking: "绑定中...", refLinked: "推荐人绑定成功!", connFirst: "请先连接", enterRefAddr: "推荐人地址或ID (0x...)", buyingMachine: "购买矿机", buyingBattery: "购买电池", confirming: "确认中...", calcFta: "计算价格...", machineBought: "矿机购买成功!", batteryBought: "电池购买成功!", invalidId: "无效索引", pluggingIn: "插入中...", pluggedIn: "插入成功! ⚡", invalidAmount: "无效金额", swapping: "兑换中...", swapSuccess: "兑换成功!", claiming: "领取中...", claimed: "奖励已领取!", error: "错误", days: "天", rig: "矿机", totalBal: "总余额", activeMachines: "⛏️ 运行中矿机", myMachines: "⛏️ 我的矿机", myBatteries: "🔋 我的电池", active: "运行中", expired: "已过期", inactive: "未激活", available: "可用", plugged: "已插入", notPlugged: "未插入", timeRemaining: "剩余", noMachines: "暂无矿机", noBatteries: "暂无电池", batteryLabel: "电池", usdtPerFta: " USDT", noActiveMachines: "无运行中矿机", exchangeRate: "汇率", priceImpact: "价格影响", swapFee: "手续费 (4%)", minimumReceived: "最低收到", slippageTolerance: "滑点容忍度", networkFee: "网络费", depositBtn: "存入", depositing: "存入中...", depositSuccess: "存入成功!", errRejected: "交易已取消", errInsufficientFunds: "余额不足", errNetwork: "网络错误，请重试。", errTimeout: "交易超时。", errContract: "交易失败，请重试。", errGeneric: "发生错误。", errAlreadyPending: "交易待处理。", errNonce: "Nonce错误，请重启应用。", errNoMachine: "没有矿机", errRunning: "矿机已在运行", errNoBattery: "没有此类型电池", errMaxMachine: "矿机数量已达上限" },
  sg: { connect: "Connect", refTitle: "👥 Referral System", refDesc: "Enter referrer address or ID to link.", bindRef: "BIND", power: "POWER", ftaSec: "Hashrate", pending: "PENDING", fta: "FTA", miningActive: "MINING ACTIVE", noMachine: "NO MACHINE", claim: "CLAIM", shopTitle: "⛏️ Shop", machines: "Machines", batteries: "Batteries", buy: "BUY", myAssets: "⚙️ Wallet & Assets", walletBal: "💰 Balances", plugMachine: "🔌 Plug in a machine", plugDesc: "Select a machine index and battery type.", machineId: "Machine Index (0, 1...)", plug: "PLUG IN ⚡", swapTitle: "💱 Swap", youPay: "You pay", balance: "Balance:", youReceive: "You receive", swap: "SWAP", loading: "Loading...", currentRate: "1 FTA = ", home: "Home", shop: "Shop", assets: "Wallet", swapNav: "Swap", connWallet: "Connecting...", errConn: "Connection Error", linking: "Linking...", refLinked: "Referrer linked!", connFirst: "Connect first", enterRefAddr: "Referrer address or ID (0x...)", buyingMachine: "Buying Machine", buyingBattery: "Buying Battery", confirming: "Confirming...", calcFta: "Calculating price...", machineBought: "Machine purchased!", batteryBought: "Battery purchased!", invalidId: "Invalid Machine Index", pluggingIn: "Plugging in...", pluggedIn: "Machine plugged in! ⚡", invalidAmount: "Invalid amount", swapping: "Swapping...", swapSuccess: "Swap successful!", claiming: "Claiming...", claimed: "Rewards claimed!", error: "Error", days: "Days", rig: "RIG", totalBal: "Total Balance", activeMachines: "⛏️ Active Machines", myMachines: "⛏️ My Machines", myBatteries: "🔋 My Batteries", active: "Active", expired: "Expired", inactive: "Inactive", available: "Available", plugged: "Plugged", notPlugged: "Not Plugged", timeRemaining: "Remaining", noMachines: "No machines yet", noBatteries: "No batteries yet", batteryLabel: "Battery", usdtPerFta: " USDT", noActiveMachines: "No active machines", exchangeRate: "Exchange Rate", priceImpact: "Price Impact", swapFee: "Swap Fee (4%)", minimumReceived: "Minimum Received", slippageTolerance: "Slippage Tolerance", networkFee: "Network Fee", depositBtn: "DEPOSIT", depositing: "Depositing...", depositSuccess: "Deposit successful!", errRejected: "Transaction cancelled", errInsufficientFunds: "Insufficient balance", errNetwork: "Network error. Please try again.", errTimeout: "Transaction timed out.", errContract: "Transaction failed.", errGeneric: "An error occurred.", errAlreadyPending: "Transaction pending.", errNonce: "Nonce error. Restart app.", errNoMachine: "No machine", errRunning: "Machine already running", errNoBattery: "No battery of this type", errMaxMachine: "Max machines reached" }
};

// ─── ABIs ──────────────────────────────────────────────────────────
const CORE_ABI = [ "function usdt() view returns (address)", "function fta() view returns (address)", "function myInfo() view returns (uint256, uint256, uint256, uint256)", "function depositUsdt(uint256 a)", "function depositFta(uint256 a)", "function depositPol() payable", "function withdrawUsdt(uint256 a)", "function withdrawFta(uint256 a)", "function withdrawPol(uint256 a)", "function setReferrer(address r)", "function setReferrerById(uint256 rid)", "function rate() view returns (uint256)", "function swapUForF(uint256 a, uint256 m, uint256 d)", "function swapFForU(uint256 a, uint256 m, uint256 d)", "function buyFta(uint256 a) view returns (uint256)", "function sellFta(uint256 a) view returns (uint256)", "function costFta(uint256 a) view returns (uint256)", "function swapFee() view returns (uint256)", "function uid(address) view returns (uint256)", "function aToId(uint256) view returns (address)", "function uBal(address) view returns (uint256)", "function fBal(address) view returns (uint256)", "function pol(address) view returns (uint256)" ];
const MINE_ABI = [ "function buyMachine(uint256 t)", "function buyMachineFTA(uint256 t)", "function buyBattery(uint256 t)", "function buyBatteryFTA(uint256 t)", "function plugInMachine(uint256 mi, uint256 bi)", "function claimRewards()", "function powerOf(address u) view returns (uint256)", "function mCount() view returns (uint256)", "function bCount() view returns (uint256)", "function mTypes(uint256) view returns (uint256 price, uint256 power)", "function bTypes(uint256) view returns (uint256 price, uint256 dur)", "function myMachines(address u) view returns (tuple(uint256 tid, uint256 exp)[])", "function myBattery(address u, uint256 t) view returns (uint256)", "function myInfo(address u) view returns (uint256 mc, uint256 ap, uint256 lc)" ];

const SWAP_FEE_RATE = 0.04;
const SLIPPAGE = 0.005;
const ONE_18 = 10n ** 18n;

class Application {
  constructor() {
    this.provider = null; this.signer = null; this.user = null;
    this.core = null; this.mine = null;
    this.web3auth = null; this.w3aProvider = null;
    this.payMode = 'USDT'; this.shopViewMode = 'machines'; this.swapDirection = 'USDT_TO_FTA';
    this.usdtDecimals = 6; this.ftaDecimals = 18;
    this.polPriceUsd = 0; this.ftaPriceUsd = 0; this.currentRealPower = 0; this.pendingBalance = 0;
    this.shopMachinesData = []; this.shopBatteriesData = []; this.isLoadingShop = false;
    this.userMachines = []; this.batteryInventory = {}; this.batteryTypeDurations = {};
    this.miningTimer = null; this.lastClaimTimestamp = 0; this.storageKey = "fitia_v3_last_claim";
    this.vizContext = null; this.vizBars = [];
    const savedLang = localStorage.getItem('fitia_lang');
    this.currentLang = savedLang && i18n[savedLang] ? savedLang : 'fr';
    this.chatInitialized = false; this.chatHistory = [];
    this.previousPrices = {};
  }

  t(key) { return i18n[this.currentLang]?.[key] || i18n['en'][key] || key; }
  formatUsd(v) { return '$' + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  formatHashrate(h) { if (h <= 0) return '0 H/s'; const u = ['nH/s','µH/s','mH/s','H/s','KH/s','MH/s','GH/s','TH/s','PH/s']; let v=h,i=3; while(v<1&&i>0){v*=1000;i--;} while(v>=1000&&i<u.length-1){v/=1000;i++;} return v.toFixed(2)+' '+u[i]; }
  formatTimeRemaining(s) { if (s <= 0) return this.t('expired'); const d=Math.floor(s/86400),h=Math.floor((s%86400)/3600),m=Math.floor((s%3600)/60); if(d>1)return`${d}j ${h}h`; if(d===1)return`1j ${h}h`; if(h>0)return`${h}h ${m}m`; return`${m}m`; }
  getBatteryDuration(t) { if(this.batteryTypeDurations[t]!==undefined)return this.batteryTypeDurations[t]; return {0:3,1:7,2:15,3:30,4:90,5:180,6:270,7:365}[t]||30; }

  setLanguage(lang) { if(!i18n[lang])return; this.currentLang=lang; localStorage.setItem('fitia_lang',lang); const f={en:'🇬🇧',fr:'🇫🇷',de:'🇩🇪',zh:'🇨🇳',sg:'🇸🇬'}; document.getElementById('lang-btn-display').innerText=`${f[lang]} ${lang.toUpperCase()}`; this.applyTranslations(); this.renderShop(); }
  applyTranslations() {
    document.getElementById('btn-connect').innerText = this.t('connect');
    document.querySelector('.total-balance-card small').innerText = this.t('totalBal');
    document.querySelector('.referral-card h3').innerText = this.t('refTitle');
    document.querySelector('.referral-card p.small-text').innerText = this.t('refDesc');
    document.querySelector('#ref-address-input').placeholder = this.t('enterRefAddr');
    document.querySelector('.referral-card .btn-full').innerText = this.t('bindRef');
    const s=document.querySelectorAll('.stat-card'); if(s[0]){s[0].querySelector('small:first-child').innerText=this.t('power');s[0].querySelector('small:last-child').innerText=this.t('ftaSec');} if(s[1]){s[1].querySelector('small:first-child').innerText=this.t('pending');s[1].querySelector('small:last-child').innerText=this.t('fta');}
    const m=document.querySelector('.btn-mega'); if(m){const sp=m.querySelectorAll('span')[1]; if(sp)sp.textContent=this.t('claim');}
    const st=document.querySelector('#view-shop .view-title'); if(st)st.innerText=this.t('shopTitle');
    const tabs=document.querySelectorAll('.shop-tab'); if(tabs[0])tabs[0].innerText=this.t('machines'); if(tabs[1])tabs[1].innerText=this.t('batteries');
    const at=document.querySelector('#view-my-rigs .view-title'); if(at)at.innerText=this.t('myAssets');
    const wh=document.querySelector('#view-my-rigs .card:first-child h3'); if(wh)wh.innerText=this.t('walletBal');
    const am=document.querySelector('#active-machines-section .section-title'); if(am)am.innerText=this.t('activeMachines');
    const wc=document.querySelectorAll('#view-my-rigs .card'); if(wc[1])wc[1].querySelector('.section-title').innerText=this.t('myMachines'); if(wc[2])wc[2].querySelector('.section-title').innerText=this.t('myBatteries');
    const swt=document.querySelector('#view-swap .view-title'); if(swt)swt.innerText=this.t('swapTitle');
    const sh=document.querySelectorAll('.swap-header span:first-child'); if(sh[0])sh[0].innerText=this.t('youPay'); if(sh[1])sh[1].innerText=this.t('youReceive');
    const swb=document.querySelector('#view-swap .btn-primary'); if(swb)swb.innerText=this.t('swap');
    document.querySelectorAll('.nav-item span').forEach((s,i)=>s.innerText=this.t(['home','shop','assets','swapNav'][i]));
  }

  async init() { this.setLanguage(this.currentLang); }

  async fetchMarketPrices() {
    this.polPriceUsd = 0;
    try { const r=await fetch('https://api.dexscreener.com/latest/dex/tokens/0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0'); const d=await r.json(); if(d.pairs?.length)this.polPriceUsd=parseFloat(d.pairs[0].priceUsd)||0; } catch(e){}
    if(!this.polPriceUsd){ try { const r=await fetch('https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd'); const d=await r.json(); this.polPriceUsd=d['matic-network']?.usd||0; } catch(e2){} }
    if(!this.polPriceUsd)this.polPriceUsd=0.70;
  }

  // ═══ CONNEXION WEB3AUTH ═══
  async connect() {
    if (!this.web3auth) {
      if (!window.Modal || !window.Modal.Web3Auth) return this.showToast("Web3Auth introuvable. Recharge la page.", true);
      this.web3auth = new window.Modal.Web3Auth({
        clientId: CONFIG.WEB3AUTH_CLIENT_ID,
        web3AuthNetwork: "sapphire_mainnet",
        chainConfig: { chainNamespace: "eip155", chainId: "0x89", rpcTarget: "https://polygon-rpc.com", displayName: "Polygon Mainnet", blockExplorer: "https://polygonscan.com", ticker: "POL", tickerName: "Polygon" },
        uiConfig: { theme: "dark", appName: "FITIA PRO MINER", appLogo: "https://i.ibb.co/CKc7wbNr/IMG-20260226-152843-512-x-512-pixel.webp", loginMethodsOrder: ["google", "email_passwordless", "facebook"], defaultLanguage: "fr" }
      });
      await this.web3auth.initModal();
    }
    this.setLoader(true, this.t('connWallet'));
    try {
      this.w3aProvider = await this.web3auth.connect();
      if (!this.w3aProvider) throw new Error("Connexion annulée");
      this.provider = new ethers.BrowserProvider(this.w3aProvider);
      this.signer = await this.provider.getSigner();
      this.user = await this.signer.getAddress();
      const net = await this.provider.getNetwork();
      if (Number(net.chainId) !== CONFIG.CHAIN_ID) this.showToast("Mauvais réseau.", true);
      await this.initContracts();
      this.web3auth.on("disconnect", () => window.location.reload());
    } catch (e) { this.showError(e); } finally { this.setLoader(false); }
  }

  async disconnect() {
    try { if (this.web3auth?.connected) await this.web3auth.logout(); } catch(_) {}
    this.user=null; this.signer=null;
    document.getElementById('btn-connect').classList.remove('hidden');
    document.getElementById('wallet-status').classList.add('hidden');
  }

  async initContracts() {
    this.core = new ethers.Contract(CONFIG.CORE, CORE_ABI, this.signer);
    this.mine = new ethers.Contract(CONFIG.MINE, MINE_ABI, this.signer);
    document.getElementById('btn-connect').classList.add('hidden');
    document.getElementById('wallet-status').classList.remove('hidden');
    document.getElementById('addr-display').innerText = this.user.slice(0, 6) + "..." + this.user.slice(38);
    if (!localStorage.getItem(this.storageKey)) localStorage.setItem(this.storageKey, Math.floor(Date.now() / 1000));
    await this.fetchMarketPrices();
    await this.cacheBatteryDurations();
    await this.updateData();
    setInterval(() => this.updateData(), 15000);
    this.initVisualizer();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  async cacheBatteryDurations() {
    try { const c=Number(await this.mine.bCount()); for(let i=0;i<c;i++){ try { const b=await this.mine.bTypes(i); this.batteryTypeDurations[i]=Number(b.dur)/86400; } catch(e){} } } catch(e){}
  }

  setShopView(v) { this.shopViewMode=v; document.querySelectorAll('.shop-tab').forEach(t=>t.classList.remove('active')); event.currentTarget.classList.add('active'); this.renderShop(); }

  async fetchUserAssets() {
    if (!this.user) return;
    this.userMachines = []; this.batteryInventory = {};
    try { const r=await this.mine.myMachines(this.user); for(const m of r){ this.userMachines.push({tid:Number(m.tid??m[0]),exp:Number(m.exp??m[1])}); } } catch(e){ try { const i=await this.mine.myInfo(this.user); const mc=Number(i.mc??i[0]); for(let j=0;j<mc;j++)this.userMachines.push({tid:0,exp:0}); } catch(e2){} }
    try { const c=Number(await this.mine.bCount()); for(let t=0;t<c;t++){ try { const q=Number(await this.mine.myBattery(this.user,t)); if(q>0)this.batteryInventory[t]=q; } catch(e){} } } catch(e){}
  }

  renderActiveMachines() {
    const c=document.getElementById('active-machines-list'); if(!c)return; const now=Math.floor(Date.now()/1000); const a=this.userMachines.filter(m=>m.exp>now);
    if(!a.length){ c.innerHTML=`<p class="small-text" style="text-align:center;">${this.t('noActiveMachines')}</p>`; return; }
    const n=['MK-I','MK-II','MK-III','MK-IV','MK-V','MK-VI','MK-VII','MK-VIII'];
    c.innerHTML=a.map(m=>{ const r=m.exp-now; return `<div class="asset-row">${this.getMachineMiniSVG(m.tid)}<div class="asset-info"><div class="asset-name">${n[m.tid%8]} <span class="status-pill active">● ${this.t('active')}</span></div><div class="asset-detail">${this.t('batteryLabel')}</div><div class="battery-bar-wrap"><div class="battery-bar-header"><span class="battery-bar-label">${this.t('timeRemaining')}</span><span class="battery-bar-time green">${this.formatTimeRemaining(r)}</span></div><div class="battery-bar"><div class="battery-bar-fill green" style="width:50%"></div></div></div></div></div>`; }).join('');
  }

  renderUserMachines() {
    const c=document.getElementById('my-machines-list'); if(!c)return;
    if(!this.userMachines.length){ c.innerHTML=`<p class="small-text" style="text-align:center;">${this.t('noMachines')}</p>`; return; }
    const now=Math.floor(Date.now()/1000); const n=['MK-I','MK-II','MK-III','MK-IV','MK-V','MK-VI','MK-VII','MK-VIII'];
    c.innerHTML=this.userMachines.map((m,i)=>{ let sc,st; if(m.exp>now){sc='active';st=this.t('active');} else if(m.exp>0&&m.exp<=now){sc='expired';st=this.t('expired');} else {sc='inactive';st=this.t('inactive');} let ex=''; if(m.exp>now){const r=m.exp-now;ex=`<div class="battery-bar-wrap"><div class="battery-bar-header"><span class="battery-bar-label">${this.t('timeRemaining')}</span><span class="battery-bar-time green">${this.formatTimeRemaining(r)}</span></div><div class="battery-bar"><div class="battery-bar-fill green" style="width:50%"></div></div></div>`;} return `<div class="asset-row">${this.getMachineMiniSVG(m.tid)}<div class="asset-info"><div class="asset-name">#${i} ${n[m.tid%8]} <span class="status-pill ${sc}">● ${st}</span></div><div class="asset-detail">${m.exp>now?this.t('plugged'):this.t('notPlugged')}</div>${ex}</div></div>`; }).join('');
  }

  renderUserBatteries() {
    const c=document.getElementById('my-batteries-list'); if(!c)return; const e=Object.entries(this.batteryInventory).filter(([,q])=>q>0);
    if(!e.length){ c.innerHTML=`<p class="small-text" style="text-align:center;">${this.t('noBatteries')}</p>`; return; }
    c.innerHTML=e.map(([t,q])=>{ const d=this.getBatteryDuration(Number(t)); return `<div class="asset-row"><div class="real-battery"><div class="battery-cap"></div><div class="battery-body"><div class="battery-level" style="width:80%"></div><div class="battery-charge-indicator">80%</div></div></div><div class="asset-info"><div class="asset-name">${d} ${this.t('days')} <span class="status-pill available">● ${this.t('available')}</span></div><div class="asset-detail">Quantité: ${q}</div></div></div>`; }).join('');
  }

  async updateData() {
    if (!this.user) return;
    try {
      const rp=await this.mine.powerOf(this.user); this.currentRealPower=parseFloat(ethers.formatUnits(rp,this.ftaDecimals));
      try { const rr=await this.core.rate(); this.ftaPriceUsd=parseFloat(ethers.formatUnits(rr,this.usdtDecimals)); } catch(e){}
      const ub=await this.core.uBal(this.user), fb=await this.core.fBal(this.user), pb=await this.core.pol(this.user), nb=await this.provider.getBalance(this.user);
      const u=parseFloat(ethers.formatUnits(ub,6)), f=parseFloat(ethers.formatUnits(fb,18)), p=parseFloat(ethers.formatUnits(pb,18)), n=parseFloat(ethers.formatUnits(nb,18));
      document.getElementById('val-power').innerText=this.formatHashrate(this.currentRealPower);
      document.getElementById('bal-pol').innerText=(p+n).toFixed(4);
      document.getElementById('bal-usdt').innerText=u.toFixed(2);
      document.getElementById('bal-fta').innerText=f.toFixed(4);
      document.getElementById('price-pol').innerText=this.formatUsd(this.polPriceUsd);
      document.getElementById('price-usdt').innerText=this.formatUsd(1);
      document.getElementById('price-fta').innerText=this.formatUsd(this.ftaPriceUsd);
      this.updatePriceChange('pol',this.polPriceUsd); this.updatePriceChange('usdt',1); this.updatePriceChange('fta',this.ftaPriceUsd);
      document.getElementById('bal-pol-usd').innerText='≈ '+this.formatUsd((p+n)*this.polPriceUsd);
      document.getElementById('bal-usdt-usd').innerText='≈ '+this.formatUsd(u);
      document.getElementById('bal-fta-usd').innerText='≈ '+this.formatUsd(f*this.ftaPriceUsd);
      document.getElementById('val-total-usd').innerText=this.formatUsd((p+n)*this.polPriceUsd+u+f*this.ftaPriceUsd);
      document.getElementById('swap-rate').innerText=this.t('currentRate')+this.ftaPriceUsd.toFixed(6)+this.t('usdtPerFta');
      document.getElementById('swap-bal-from').innerText=(this.swapDirection==='USDT_TO_FTA'?u:f).toFixed(4);
      document.getElementById('swap-bal-to').innerText=(this.swapDirection==='USDT_TO_FTA'?f:u).toFixed(4);
      this.lastClaimTimestamp=parseInt(localStorage.getItem(this.storageKey)||'0'); const el=Math.floor(Date.now()/1000)-this.lastClaimTimestamp;
      if(this.currentRealPower>0){ if(!this.miningTimer){this.pendingBalance=this.currentRealPower*el; document.getElementById('val-pending').innerText=this.pendingBalance.toFixed(5); this.startMiningCounter();} document.getElementById('viz-status').innerText=this.t('miningActive'); document.getElementById('viz-status').style.color="var(--primary)"; this.updateVisualizerIntensity(this.currentRealPower); }
      else { this.stopMiningCounter(); document.getElementById('viz-status').innerText=this.t('noMachine'); document.getElementById('viz-status').style.color="#666"; this.pendingBalance=0; document.getElementById('val-pending').innerText="0.00000"; }
      await this.renderShop(); await this.fetchUserAssets(); this.renderActiveMachines(); this.renderUserMachines(); this.renderUserBatteries();
      if(document.getElementById('swap-from-in').value)this.calcSwap();
    } catch (e) { console.error("Err update:", e); }
  }

  startMiningCounter() { if(this.miningTimer)return; this.miningTimer=setInterval(()=>{ if(this.currentRealPower>0){this.pendingBalance+=this.currentRealPower; document.getElementById('val-pending').innerText=this.pendingBalance.toFixed(5); document.getElementById('val-pending').style.color='var(--primary)'; setTimeout(()=>document.getElementById('val-pending').style.color='var(--text)',500);}},1000); }
  stopMiningCounter() { if(this.miningTimer){clearInterval(this.miningTimer); this.miningTimer=null;} }

  // ═══ TRANSACTIONS SÉCURISÉES ═══
  async safeTx(fn, ctxLabel = "Transaction") {
    if (!this.signer) return this.connect();
    try {
      const pop = await fn.populateTransaction();
      let gl;
      try { const est=await this.provider.estimateGas({...pop, from:this.user}); gl=(est*120n)/100n; }
      catch(estErr) {
        try { await this.provider.call({...pop, from:this.user}); } catch(c) { const r=this._extractRevertReason(c); return this.showToast(`${ctxLabel} : ${r||this.t('errContract')}`, true); }
        return this.showToast(`${ctxLabel} : ${this.t('errContract')}`, true);
      }
      const gp=(await this.provider.getFeeData()).gasPrice||0n; const gc=gl*gp; const nb=await this.provider.getBalance(this.user);
      if(nb<gc) return this.showToast(`${ctxLabel} : ${this.t('errInsufficientFunds')} (POL pour le gaz)`, true);
      this.setLoader(true, this.t('confirming'));
      const tx=await this.signer.sendTransaction({...pop, gasLimit:gl}); const rc=await tx.wait();
      if(rc.status===0) return this.showToast(`${ctxLabel} : ${this.t('errContract')}`, true);
      return rc;
    } catch(e) { this.showError(e); throw e; } finally { this.setLoader(false); }
  }

  _extractRevertReason(err) {
    const s=(err?.message||'')+' '+JSON.stringify(err?.data||err?.error||{}); const m=s.match(/revert(?:ed)?:?\s*(?:0x[0-9a-fA-F]+)?\s*["']?([^"']{1,200})["']?/i);
    if(m)return m[1];
    if(s.includes('InsF'))return 'Solde interne insuffisant'; if(s.includes('NoBat'))return this.t('errNoBattery'); if(s.includes('Running'))return this.t('errRunning');
    if(s.includes('MaxM'))return this.t('errMaxMachine'); if(s.includes('NoM'))return this.t('errNoMachine'); if(s.includes('Slip'))return 'Slippage trop élevé';
    if(s.includes('Expired'))return this.t('errTimeout'); if(s.includes('RefSet'))return 'Parrain déjà défini'; if(s.includes('RefSelf'))return 'Parrainage interdit';
    return null;
  }

  async deposit() {
    if(!this.user)return this.connect();
    const tt=document.getElementById('deposit-token-select').value; const a=parseFloat(document.getElementById('deposit-amount').value);
    if(!a||a<=0)return this.showToast(this.t('invalidAmount'),true);
    this.setLoader(true, this.t('depositing'));
    try {
      if(tt==='USDT'){
        const c=new ethers.Contract(CONFIG.USDT,["function approve(address,uint256) returns (bool)","function allowance(address,address) view returns (uint256)"],this.signer);
        const aBN=ethers.parseUnits(a.toString(),6); const al=await c.allowance(this.user,CONFIG.CORE);
        if(al<aBN){ this.setLoader(true,"Approbation USDT..."); await (await c.approve(CONFIG.CORE,aBN)).wait(); }
        await this.safeTx(this.core.depositUsdt(aBN), this.t('confirming'));
      } else {
        const c=new ethers.Contract(CONFIG.FTA,["function approve(address,uint256) returns (bool)","function allowance(address,address) view returns (uint256)"],this.signer);
        const aBN=ethers.parseUnits(a.toString(),18); const al=await c.allowance(this.user,CONFIG.CORE);
        if(al<aBN){ this.setLoader(true,"Approbation FTA..."); await (await c.approve(CONFIG.CORE,aBN)).wait(); }
        await this.safeTx(this.core.depositFta(aBN), this.t('confirming'));
      }
      this.showToast(this.t('depositSuccess')); document.getElementById('deposit-amount').value=''; this.updateData();
    } catch(_) {} this.setLoader(false);
  }

  async withdraw() {
    if(!this.user)return this.connect();
    const tt=document.getElementById('deposit-token-select').value; const a=parseFloat(document.getElementById('deposit-amount').value);
    if(!a||a<=0)return this.showToast(this.t('invalidAmount'),true);
    try {
      if(tt==='USDT'){ await this.safeTx(this.core.withdrawUsdt(ethers.parseUnits(a.toString(),6)), this.t('withdrawing')); }
      else { await this.safeTx(this.core.withdrawFta(ethers.parseUnits(a.toString(),18)), this.t('withdrawing')); }
      this.showToast(this.t('withdrawSuccess')); document.getElementById('deposit-amount').value=''; this.updateData();
    } catch(_) {}
  }

  openSend() { document.getElementById('send-to-address').value=''; document.getElementById('send-amount').value=''; document.getElementById('modal-send').classList.add('active'); this.updateSendBalance(); }
  updateSendBalance() { const t=document.getElementById('send-token-select').value; this.sendTokenSymbol=t; let id='bal-pol'; if(t==='USDT')id='bal-usdt'; if(t==='FTA')id='bal-fta'; document.getElementById('send-bal').innerText=document.getElementById(id)?.innerText||'0'; }
  openReceive() { if(!this.user)return this.showToast(this.t('connFirst'),true); document.getElementById('receive-addr-display').innerText=this.user; document.getElementById('modal-receive').classList.add('active'); }
  closeModals() { document.getElementById('modal-send').classList.remove('active'); document.getElementById('modal-receive').classList.remove('active'); }
  copyReceiveAddress() { navigator.clipboard.writeText(this.user); this.showToast(this.t('addrCopied')); }

  async executeSend() {
    const to=document.getElementById('send-to-address').value; const amt=document.getElementById('send-amount').value;
    if(!ethers.isAddress(to))return this.showToast(this.t('invalidAddr'),true);
    if(!amt||Number(amt)<=0)return this.showToast(this.t('invalidAmount'),true);
    try {
      const t=document.getElementById('send-token-select').value;
      if(t==='POL'){ await this.safeTx(this.signer.sendTransaction({to, value:ethers.parseEther(amt)}), this.t('sending')); }
      else { const ta=t==='USDT'?CONFIG.USDT:CONFIG.FTA; const dc=t==='USDT'?6:18; const c=new ethers.Contract(ta,["function transfer(address,uint256) returns (bool)"],this.signer); await this.safeTx(c.transfer(to, ethers.parseUnits(amt,dc)), this.t('sending')); }
      this.showToast(this.t('sentSuccess')); this.closeModals(); this.updateData();
    } catch(_) {}
  }

  async buyMachine(t) {
    if(!this.user)return this.connect();
    const fn = this.payMode==='USDT' ? this.mine.buyMachine(t) : this.mine.buyMachineFTA(t);
    try { await this.safeTx(fn, this.t('buyingMachine')); this.showToast(this.t('machineBought')); this.shopMachinesData=[]; this.updateData(); } catch(_){}
  }

  async buyBattery(t) {
    if(!this.user)return this.connect();
    const fn = this.payMode==='USDT' ? this.mine.buyBattery(t) : this.mine.buyBatteryFTA(t);
    try { await this.safeTx(fn, this.t('buyingBattery')); this.showToast(this.t('batteryBought')); this.shopBatteriesData=[]; this.updateData(); } catch(_){}
  }

  async plugInMachine() {
    const mi=document.getElementById('plug-machine-id').value; const bi=document.getElementById('plug-battery-type').value;
    if(mi===""||mi<0)return this.showToast(this.t('invalidId'),true);
    if(!this.batteryInventory?.[Number(bi)])return this.showToast(this.t('errNoBattery'),true);
    try { await this.safeTx(this.mine.plugInMachine(mi,bi), this.t('pluggingIn')); this.showToast(this.t('pluggedIn')); this.updateData(); } catch(_){}
  }

  async claim() {
    if(!this.user)return; this.stopMiningCounter();
    try { await this.safeTx(this.mine.claimRewards(), this.t('claiming')); this.pendingBalance=0; localStorage.setItem(this.storageKey,Math.floor(Date.now()/1000)); this.showToast(this.t('claimed')); this.updateData(); if(this.currentRealPower>0)this.startMiningCounter(); }
    catch(_) { if(this.currentRealPower>0)this.startMiningCounter(); }
  }

  async bindReferrer() {
    const i=document.getElementById('ref-address-input').value.trim(); if(!i)return this.showToast(this.t('invalidAddr'),true); if(!this.user)return this.showToast(this.t('connFirst'),true);
    try {
      if(i.startsWith('0x')&&i.length===42){ await this.safeTx(this.core.setReferrer(i), this.t('linking')); }
      else { const r=parseInt(i); if(isNaN(r))throw new Error("Format invalide"); await this.safeTx(this.core.setReferrerById(r), this.t('linking')); }
      this.showToast(this.t('refLinked')); document.getElementById('ref-address-input').value='';
    } catch(_){}
  }

  setPayMode(m) { this.payMode=m; document.getElementById('btn-pay-usdt').classList.toggle('active',m==='USDT'); document.getElementById('btn-pay-fta').classList.toggle('active',m==='FTA'); this.renderShop(); }

  async renderShop() { if(this.isLoadingShop)return; const c=document.getElementById('shop-list'); if(this.shopViewMode==='machines'){ if(!this.shopMachinesData.length)await this.fetchMachines(); this._renderShopMachinesHTML(c); } else { if(!this.shopBatteriesData.length)await this.fetchBatteries(); this._renderShopBatteriesHTML(c); } }
  async fetchMachines() { this.isLoadingShop=true; try { const c=Number(await this.mine.mCount()); const p=[]; for(let i=0;i<c;i++)p.push(this.mine.mTypes(i)); const r=await Promise.all(p); this.shopMachinesData=[]; for(let i=0;i<c;i++){const d=r[i]; this.shopMachinesData.push({price:parseFloat(ethers.formatUnits(d.price,6)),power:parseFloat(ethers.formatUnits(d.power,18))});} } catch(e){} this.isLoadingShop=false; }
  async fetchBatteries() { this.isLoadingShop=true; try { const c=Number(await this.mine.bCount()); const p=[]; for(let i=0;i<c;i++)p.push(this.mine.bTypes(i)); const r=await Promise.all(p); this.shopBatteriesData=[]; for(let i=0;i<c;i++){const d=r[i]; this.shopBatteriesData.push({price:parseFloat(ethers.formatUnits(d.price,6)),days:Number(d.dur)/86400});} } catch(e){} this.isLoadingShop=false; }

  getMachineMiniSVG(t) { const c=['#64748b','#3b82f6','#8b5cf6','#F0B90B','#f97316','#ef4444','#06b6d4','#eab308']; const a=['#94a3b8','#60a5fa','#a78bfa','#FFD43B','#fb923c','#f87171','#22d3ee','#facc15']; const tc=c[t%8],ta=a[t%8]; return `<svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" class="machine-svg-mini"><rect x="2" y="2" width="46" height="46" rx="6" fill="#1e293b" stroke="${tc}" stroke-width="1"/><rect x="2" y="2" width="46" height="3" rx="1.5" fill="${tc}" opacity="0.6"/><rect x="8" y="10" width="14" height="20" rx="2" fill="#080c18" stroke="${ta}" stroke-width="0.5"/><rect x="28" y="10" width="14" height="20" rx="2" fill="#080c18" stroke="${ta}" stroke-width="0.5"/><circle cx="21" cy="40" r="6" fill="#0a0e1a" stroke="#333" stroke-width="0.5"/><circle cx="37" cy="40" r="6" fill="#0a0e1a" stroke="#333" stroke-width="0.5"/></svg>`; }
  _renderShopMachinesHTML(c) { c.innerHTML=''; c.style.gridTemplateColumns='1fr 1fr'; const b=['background:#64748b;color:#fff','background:#3b82f6;color:#fff','background:#8b5cf6;color:#fff','background:#F0B90B;color:#000','background:#f97316;color:#fff','background:#ef4444;color:#fff','background:#06b6d4;color:#000','background:#eab308;color:#000']; const n=['STARTER','STANDARD','ADVANCED','PRO','ELITE','ULTRA','SUPREME','LEGEND']; for(let i=0;i<this.shopMachinesData.length;i++){const d=this.shopMachinesData[i]; const div=document.createElement('div'); div.className='rig-item'; div.innerHTML=`<span class="tier-badge" style="${b[i%8]}">${n[i%8]}</span>${this.getMachineMiniSVG(i)}<span class="rig-name" style="font-size:0.85rem;">${this.t('rig')} ${i+1}</span><span class="rig-power" style="font-size:0.75rem;">${this.formatHashrate(d.power)}</span><span class="rig-price" style="font-size:1rem;">${d.price.toFixed(2)} $</span><button class="btn-primary" style="padding:8px;font-size:0.75rem;margin-top:6px;" onclick="App.buyMachine(${i})">${this.t('buy')} (${this.payMode})</button>`; c.appendChild(div);} }
  _renderShopBatteriesHTML(c) { c.innerHTML=''; c.style.gridTemplateColumns='1fr 1fr'; for(let i=0;i<this.shopBatteriesData.length;i++){const d=this.shopBatteriesData[i]; const cl=Math.floor(Math.random()*40)+60; const div=document.createElement('div'); div.className='battery-shop-item'; div.innerHTML=`<div class="real-battery"><div class="battery-cap"></div><div class="battery-body"><div class="battery-level" style="width:${cl}%"></div><div class="battery-charge-indicator">${d.days}J</div></div></div><div class="battery-name">${d.days} ${this.t('days')}</div><div class="battery-price">${d.price.toFixed(2)} $</div><button class="btn-primary" style="padding:6px;font-size:0.75rem" onclick="App.buyBattery(${i})">${this.t('buy')} (${this.payMode})</button>`; c.appendChild(div);} }

  toggleSwap() { this.swapDirection=this.swapDirection==='USDT_TO_FTA'?'FTA_TO_USDT':'USDT_TO_FTA'; document.getElementById('token-from-display').innerText=this.swapDirection==='USDT_TO_FTA'?'USDT':'FTA'; document.getElementById('token-to-display').innerText=this.swapDirection==='USDT_TO_FTA'?'FTA':'USDT'; document.getElementById('swap-to-in').value=''; document.getElementById('swap-from-in').value=''; document.getElementById('swap-details').classList.add('hidden'); this.updateData(); }
  calcSwap() { const v=document.getElementById('swap-from-in').value; if(!v||v<=0){document.getElementById('swap-to-in').value=''; document.getElementById('swap-details').classList.add('hidden'); return;} const iv=parseFloat(v); const isU=this.swapDirection==='USDT_TO_FTA'; const f=iv*SWAP_FEE_RATE; const ni=iv-f; let no=0; if(this.ftaPriceUsd>0)no=isU?ni/this.ftaPriceUsd:ni*this.ftaPriceUsd; const mr=no*(1-SLIPPAGE); document.getElementById('swap-to-in').value=no>0?no.toFixed(6):''; document.getElementById('swap-details').classList.remove('hidden'); const ft=isU?'USDT':'FTA', tt=isU?'FTA':'USDT'; document.getElementById('swap-detail-rate').innerText=isU?`1 USDT = ${(1/this.ftaPriceUsd).toFixed(2)} FTA`:`1 FTA = ${this.ftaPriceUsd.toFixed(6)} USDT`; document.getElementById('swap-detail-fee').innerText=`${f.toFixed(6)} ${ft}`; document.getElementById('swap-detail-min').innerText=`${mr.toFixed(6)} ${tt}`; }

  async executeSwap() {
    const v=document.getElementById('swap-from-in').value; if(!v||v<=0)return this.showToast(this.t('invalidAmount'),true);
    const isU=this.swapDirection==='USDT_TO_FTA'; const dc=isU?6:18; const a=ethers.parseUnits(v,dc); const ni=parseFloat(v)*(1-SWAP_FEE_RATE); const eo=isU?ni/this.ftaPriceUsd:ni*this.ftaPriceUsd; const mo=ethers.parseUnits((eo*(1-SLIPPAGE)).toFixed(6),isU?18:6); const dl=Math.floor(Date.now()/1000)+1200;
    const fn=isU?this.core.swapUForF(a,mo,dl):this.core.swapFForU(a,mo,dl);
    try { await this.safeTx(fn, this.t('swapping')); this.showToast(this.t('swapSuccess')); document.getElementById('swap-from-in').value=''; document.getElementById('swap-to-in').value=''; document.getElementById('swap-details').classList.add('hidden'); this.updateData(); } catch(_){}
  }

  resizeCanvas() { if(this.vizContext){const c=this.vizContext.canvas; c.width=c.offsetWidth*2; c.height=c.offsetHeight*2;} }
  initVisualizer() { const c=document.getElementById('mining-canvas'); if(!c)return; this.resizeCanvas(); this.vizContext=c.getContext('2d'); this.vizBars=[]; for(let i=0;i<20;i++)this.vizBars.push({height:0,targetHeight:0}); this.animateVisualizer(); }
  updateVisualizerIntensity(p) { const i=p>0?Math.min((p*500)+10,100):0; this.vizBars.forEach(b=>b.targetHeight=(this.vizContext.canvas.height*(i/100))*Math.random()); }
  animateVisualizer() { if(!this.vizContext)return; const c=this.vizContext; c.clearRect(0,0,c.canvas.width,c.canvas.height); c.fillStyle="#F0B90B"; const w=c.canvas.width/20; this.vizBars.forEach((b,i)=>{ b.height+=(b.targetHeight-b.height)*0.1; c.fillRect(i*w+2,c.canvas.height-b.height,w-4,b.height); b.targetHeight+=(Math.random()-0.5)*10; }); requestAnimationFrame(()=>this.animateVisualizer()); }

  nav(v) { document.querySelectorAll('.view').forEach(e=>{e.classList.remove('active'); e.style.display='none';}); const a=document.getElementById('view-'+v); if(a){a.classList.add('active'); a.style.display='block';} document.querySelectorAll('.nav-item').forEach(e=>e.classList.remove('active')); if(event?.currentTarget)event.currentTarget.classList.add('active'); }
  setLoader(s,m="Traitement...") { document.getElementById('loader-text').innerText=m; if(s)document.getElementById('loader').classList.remove('hidden'); else document.getElementById('loader').classList.add('hidden'); }

  getErrorMessage(e) {
    const s=((e?.message||'')+' '+(e?.code||'')+' '+(e?.reason||'')+' '+(e?.data||'')).toLowerCase();
    if(s.includes('user rejected')||s.includes('user denied')||e?.code===4001||e?.code==='ACTION_REJECTED')return this.t('errRejected');
    if(s.includes('insufficient funds for gas')||s.includes('gas required exceeds allowance')||s.includes('max fee per gas'))return 'Fonds insuffisants pour le gaz';
    if(s.includes('insufficient')||s.includes('not enough')||s.includes('insf'))return this.t('errInsufficientFunds');
    if(s.includes('nonce'))return this.t('errNonce'); if(s.includes('pending'))return this.t('errAlreadyPending'); if(s.includes('timeout')||s.includes('deadline')||s.includes('expired'))return this.t('errTimeout');
    if(s.includes('network')||s.includes('fetch')||s.includes('call revert'))return this.t('errNetwork'); if(s.includes('revert')||s.includes('execution')||s.includes('unpredictablegaslimit'))return this.t('errContract');
    if(s.includes('nom')||s.includes('no machine'))return this.t('errNoMachine'); if(s.includes('running'))return this.t('errRunning'); if(s.includes('nobat')||s.includes('no battery'))return this.t('errNoBattery'); if(s.includes('maxm')||s.includes('max machine'))return this.t('errMaxMachine');
    return this.t('errGeneric');
  }
  showError(e) { console.error("Err:",e); this.showToast(this.getErrorMessage(e),true); }
  showToast(m,e=false) { const d=document.createElement('div'); d.className='toast'+(e?' toast-error':' toast-success'); d.innerText=m; document.getElementById('toast-container').appendChild(d); setTimeout(()=>d.remove(),4000); }
  updatePriceChange(t,n) { const el=document.getElementById('change-'+t); if(!el)return; const p=this.previousPrices[t]; if(p===undefined||p===null||p===0){this.previousPrices[t]=n; el.textContent='0.00%'; el.className='token-change flat'; return;} const c=((n-p)/p)*100; const a=Math.abs(c); let s,cl; if(a<0.01){s='';cl='flat';} else if(c>0){s='+';cl='up';} else {s='';cl='down';} el.textContent=s+c.toFixed(2)+'%'; el.className='token-change '+cl; this.previousPrices[t]=n; }

  toggleChat() { const p=document.getElementById('chat-panel'); const a=p.classList.toggle('active'); if(a&&!this.chatInitialized){this.chatInitialized=true; setTimeout(()=>this.addChatBubble('assistant',this.getWelcomeMessage()),400);} if(a)setTimeout(()=>document.getElementById('chat-input').focus(),350); }
  sendChatMessage() { const i=document.getElementById('chat-input'); const m=i.value.trim(); if(!m)return; i.value=''; this.addChatBubble('user',m); this.chatHistory.push({role:'user',text:m}); const t=this.showTyping(); const d=400+Math.min(m.length*25,1200)+Math.random()*400; setTimeout(()=>{this.removeTyping(t); const r=this.generateLocalResponse(m); this.addChatBubble('assistant',r); this.chatHistory.push({role:'assistant',text:r});},d); }
  addChatBubble(r,t) { const c=document.getElementById('chat-messages'); const b=document.createElement('div'); b.className=`chat-bubble ${r}`; b.textContent=t; c.appendChild(b); requestAnimationFrame(()=>c.scrollTop=c.scrollHeight); }
  showTyping() { const c=document.getElementById('chat-messages'); const t=document.createElement('div'); const id='typing-'+Date.now(); t.id=id; t.className='chat-bubble assistant'; t.innerHTML='<span style="letter-spacing:3px;animation:loaderTextPulse 1s infinite">● ● ●</span>'; c.appendChild(t); c.scrollTop=c.scrollHeight; return id; }
  removeTyping(id) { const e=document.getElementById(id); if(e)e.remove(); }
  getWelcomeMessage() { const m={en:"👋 Welcome to FITIA PRO! I'm your crypto assistant.\nAsk me about: Mining, Swap, Wallet, Security, Community!",fr:"👋 Bienvenue sur FITIA PRO ! Je suis votre assistant crypto.\nDemandez-moi : Minage, Échange, Wallet, Sécurité, Communauté !",de:"👋 Willkommen bei FITIA PRO! Dein Krypto-Assistent.\nFrag mich zu: Mining, Tausch, Wallet, Sicherheit!",zh:"👋 欢迎使用 FITIA PRO！你的加密助手。\n问我：挖矿、兑换、钱包、安全！",sg:"👋 Welcome to FITIA PRO! Your crypto assistant.\nAsk about: Mining, Swap, Wallet, Security!"}; return m[this.currentLang]||m.en; }
  generateLocalResponse(msg) {
    const m=msg.toLowerCase().replace(/[?!.,;:'"]/g,'').trim(); const c=!!this.user; const p=this.currentRealPower||0; const pe=this.pendingBalance||0; const fp=this.ftaPriceUsd||0;
    if(m.includes('salut')||m.includes('bonjour')||m.includes('hello')||m.includes('hi')||m.includes('你好')) return c?`👋 Salut ! Puissance : ${this.formatHashrate(p)}. ${this.userMachines.filter(m=>m.exp>Math.floor(Date.now()/1000)).length} machine(s) active(s).`:"👋 Bienvenue ! Connectez votre wallet pour commencer.";
    if(m.includes('merci')||m.includes('thanks')||m.includes('谢谢')) return "De rien ! 😊";
    if(m.includes('aide')||m.includes('help')||m.includes('帮助')) return "🛠️ Je peux aider avec :\n⛏️ Minage\n💱 Échange\n💰 Wallet\n👥 Parrainage\n🛡️ Sécurité\n📱 Communauté";
    if(m.includes('minage')||m.includes('mine')||m.includes('挖矿')) return c?`⛏️ Minage FITIA :\n1️⃣ Achetez machine (Boutique)\n2️⃣ Achetez batterie\n3️⃣ Branchez (Wallet)\n4️⃣ Réclamez gains\nPuissance : ${this.formatHashrate(p)}\nEn attente : ${pe.toFixed(5)} FTA`:"⛏️ Connectez votre wallet pour miner !";
    if(m.includes('swap')||m.includes('échange')||m.includes('兑换')) return `💱 Échange USDT ↔ FTA\nTaux : 1 FTA = ${fp>0?fp.toFixed(6):'...'} USDT\nFrais : 4%`;
    if(m.includes('wallet')||m.includes('solde')||m.includes('余额')) return "💰 Wallet :\n• Dépôt/Retrait USDT, FTA, POL\n• Frais réseau très bas sur Polygon";
    if(m.includes('sécurité')||m.includes('security')||m.includes('安全')) return "🛡️ Sécurité :\n✅ Ne partagez JAMAIS votre phrase\n✅ Vérifiez les adresses";
    if(m.includes('communauté')||m.includes('whatsapp')||m.includes('社群')) return `📱 Communauté :\n${CONFIG.WHATSAPP_GROUP}`;
    if(m.includes('parrain')||m.includes('推荐')) return c?`👥 Parrainage : ${this.user.slice(0,6)}...${this.user.slice(-4)}`:"👥 Connectez-vous pour voir votre code";
    return "Je ne suis pas sûr de comprendre. Essayez : 'minage', 'swap', 'wallet', 'sécurité', 'communauté'.";
  }
}

const App = new Application();
App.init();