// ═══════════════════════════════════════════════════════════════════
//  FITIA PRO MINER — app.js (Web3Auth Edition)
//  Remplace MetaMask/WalletConnect par Web3Auth (Email / Google)
// ═══════════════════════════════════════════════════════════════════

// ─── Configuration ─────────────────────────────────────────────────
const CONFIG = {
  CORE: "0xAaba9Ae712d501474351C252C931f95189895126",   // ← REMPLACER : adresse déployée FitiaMiningV3_Core
  MINE: "0x9eEaBEf8369812932B5f846949861fEBcFC37E73",   // ← REMPLACER : adresse déployée FitiaMiningV3_Mine
  USDT: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", // USDT Polygon officiel
  FTA:  "0x5c418b12c7e9c2A8e9A71A68c6d9b319E7B1d1fd",   // ← REMPLACER : adresse déployée Token FTA
  CHAIN_ID: 137,
  // ═══ Web3Auth — REMPLACE ton CLIENT_ID gratuit ═══
  // Obtenu sur https://dashboard.web3auth.io (Plan Base = gratuit, 500 MAU)
  WEB3AUTH_CLIENT_ID: "BB8-sW8_NENPty92A-Mx0_yXq2MVZUK9yg3Y8RpuClJO8x-L_N7n_IlXR5b230lFeEJaIGSEV1i2q8HoK3dTEwA",
  WEB3AUTH_NETWORK: "sapphire_mainnet", // "sapphire_devnet" pour tests
  RPC_URL: "https://polygon-rpc.com",
  EXPLORER: "https://polygonscan.com",
  WHATSAPP_GROUP: "https://chat.whatsapp.com/BDsvPCB6xp8H8X0YaRmPFP",
  WHATSAPP_CHANNEL: "https://whatsapp.com/channel/0029VbCQhI38PgsPLbBJdV1e",
  REFRESH_INTERVAL: 15000, // ms entre chaque refresh automatique
};

// ─── i18n — 5 langues ─────────────────────────────────────────────
const i18n = {
  fr: {
    connect:"Se connecter",refTitle:"👥 Parrainage",refDesc:"Entrez l'adresse ou l'ID du parrain.",bindRef:"LIER",
    power:"PUISSANCE",ftaSec:"Hashrate",pending:"EN ATTENTE",fta:"FTA",miningActive:"MINAGE ACTIF",noMachine:"AUCUNE MACHINE",claim:"RÉCLAMER",
    shopTitle:"⛏️ Boutique",machines:"Machines",batteries:"Batteries",buy:"ACHETER",
    myAssets:"⚙️ Wallet & Actifs",walletBal:"💰 Soldes",plugMachine:"🔌 Brancher une machine",plugDesc:"Choisissez l'index d'une machine et le type de batterie.",
    machineId:"Index Machine (0, 1...)",plug:"BRANCHER ⚡",
    swapTitle:"💱 Échange",youPay:"Vous payez",balance:"Solde:",youReceive:"Vous recevez",swap:"ÉCHANGER",
    loading:"Chargement...",currentRate:"1 FTA = ",
    home:"Accueil",shop:"Boutique",assets:"Wallet",swapNav:"Swap",
    connWallet:"Connexion Web3Auth...",errConn:"Erreur de connexion",
    linking:"Liaison...",refLinked:"Parrain lié !",connFirst:"Connectez-vous d'abord",
    enterRefAddr:"Adresse ou ID parrain (0x...)",enterRefId:"ID Parrain (nombre)",
    buyingMachine:"Achat Machine",buyingBattery:"Achat Batterie",
    confirming:"Confirmation...",calcFta:"Calcul du prix...",
    machineBought:"Machine achetée !",batteryBought:"Batterie achetée !",
    invalidId:"Index Machine invalide",pluggingIn:"Branchement...",pluggedIn:"Machine branchée ! ⚡",
    invalidAmount:"Montant invalide",swapping:"Échange...",swapSuccess:"Échange réussi !",
    claiming:"Récupération...",claimed:"Gains réclamés !",
    error:"Erreur",days:"Jours",rig:"RIG",
    totalBal:"Solde Total",activeMachines:"⛏️ Machines Actives",
    myMachines:"⛏️ Mes Machines",myBatteries:"🔋 Mes Batteries",
    active:"Actif",expired:"Expiré",inactive:"Inactif",available:"Disponible",
    plugged:"Branché",notPlugged:"Non branché",timeRemaining:"Restant",
    noMachines:"Aucune machine",noBatteries:"Aucune batterie",
    batteryLabel:"Batterie",usdtPerFta:" USDT",noActiveMachines:"Aucune machine active",
    exchangeRate:"Taux de change",priceImpact:"Impact prix",
    swapFee:"Frais swap (4%)",minimumReceived:"Minimum reçu",
    slippageTolerance:"Tolérance slippage",networkFee:"Frais réseau",
    depositBtn:"DÉPOSER",withdrawBtn:"RETIRER",depositing:"Dépôt en cours...",depositSuccess:"Dépôt réussi !",withdrawing:"Retrait en cours...",withdrawSuccess:"Retrait réussi !",
    send:"Envoyer",receive:"Recevoir",sending:"Envoi en cours...",sentSuccess:"Envoi réussi !",addrCopied:"Adresse copiée !",confirmSend:"CONFIRMER L'ENVOI",invalidAddr:"Adresse invalide",recipientAddr:"Adresse destinataire (0x...)",amount:"Montant",
    errRejected:"Transaction annulée par l'utilisateur",errInsufficientFunds:"Solde insuffisant (tokens ou gaz POL)",
    errNetwork:"Erreur réseau. Vérifiez votre connexion.",errTimeout:"Transaction trop longue — vérifiez sur Polygonscan.",
    errContract:"Transaction rejetée par le contrat",errGeneric:"Une erreur est survenue",
    errAlreadyPending:"Transaction en attente. Patientez.",errNonce:"Erreur de nonce. Rechargez l'app.",
    errNoMachine:"Vous ne possédez pas cette machine",errRunning:"Cette machine mine déjà",
    errNoBattery:"Pas de batterie de ce type",errMaxMachine:"Limite de machines atteinte",
    disconnected:"Déconnecté",welcome:"Bienvenue sur Fitia Pro !",
    needPol:"Vous avez besoin de POL pour les frais de gaz. Envoyez-en à votre adresse.",
  },
  en: {
    connect:"Connect",refTitle:"👥 Referral",refDesc:"Enter referrer address or ID.",bindRef:"BIND",
    power:"POWER",ftaSec:"Hashrate",pending:"PENDING",fta:"FTA",miningActive:"MINING ACTIVE",noMachine:"NO MACHINE",claim:"CLAIM",
    shopTitle:"⛏️ Shop",machines:"Machines",batteries:"Batteries",buy:"BUY",
    myAssets:"⚙️ Wallet & Assets",walletBal:"💰 Balances",plugMachine:"🔌 Plug in a machine",plugDesc:"Select machine index and battery type.",
    machineId:"Machine Index (0, 1...)",plug:"PLUG IN ⚡",
    swapTitle:"💱 Swap",youPay:"You pay",balance:"Balance:",youReceive:"You receive",swap:"SWAP",
    loading:"Loading...",currentRate:"1 FTA = ",
    home:"Home",shop:"Shop",assets:"Wallet",swapNav:"Swap",
    connWallet:"Connecting...",errConn:"Connection Error",
    linking:"Linking...",refLinked:"Referrer linked!",connFirst:"Connect first",
    enterRefAddr:"Referrer address or ID (0x...)",enterRefId:"Referrer ID (number)",
    buyingMachine:"Buying Machine",buyingBattery:"Buying Battery",
    confirming:"Confirming...",calcFta:"Calculating price...",
    machineBought:"Machine purchased!",batteryBought:"Battery purchased!",
    invalidId:"Invalid Machine Index",pluggingIn:"Plugging in...",pluggedIn:"Machine plugged in! ⚡",
    invalidAmount:"Invalid amount",swapping:"Swapping...",swapSuccess:"Swap successful!",
    claiming:"Claiming...",claimed:"Rewards claimed!",
    error:"Error",days:"Days",rig:"RIG",
    totalBal:"Total Balance",activeMachines:"⛏️ Active Machines",
    myMachines:"⛏️ My Machines",myBatteries:"🔋 My Batteries",
    active:"Active",expired:"Expired",inactive:"Inactive",available:"Available",
    plugged:"Plugged",notPlugged:"Not Plugged",timeRemaining:"Remaining",
    noMachines:"No machines yet",noBatteries:"No batteries yet",
    batteryLabel:"Battery",usdtPerFta:" USDT",noActiveMachines:"No active machines",
    exchangeRate:"Exchange Rate",priceImpact:"Price Impact",
    swapFee:"Swap Fee (4%)",minimumReceived:"Minimum Received",
    slippageTolerance:"Slippage Tolerance",networkFee:"Network Fee",
    depositBtn:"DEPOSIT",withdrawBtn:"WITHDRAW",depositing:"Depositing...",depositSuccess:"Deposit successful!",withdrawing:"Withdrawing...",withdrawSuccess:"Withdrawal successful!",
    send:"Send",receive:"Receive",sending:"Sending...",sentSuccess:"Sent successfully!",addrCopied:"Address copied!",confirmSend:"CONFIRM SEND",invalidAddr:"Invalid address",recipientAddr:"Recipient address (0x...)",amount:"Amount",
    errRejected:"Transaction cancelled",errInsufficientFunds:"Insufficient balance (tokens or POL gas)",
    errNetwork:"Network error. Check your connection.",errTimeout:"Transaction timed out — check Polygonscan.",
    errContract:"Transaction rejected by contract",errGeneric:"An error occurred",
    errAlreadyPending:"Transaction pending. Please wait.",errNonce:"Nonce error. Reload the app.",
    errNoMachine:"You don't own this machine",errRunning:"Machine already running",
    errNoBattery:"No battery of this type",errMaxMachine:"Max machines reached",
    disconnected:"Disconnected",welcome:"Welcome to Fitia Pro!",
    needPol:"You need POL for gas fees. Send some to your address.",
  },
  de: {
    connect:"Verbinden",refTitle:"👥 Empfehlung",refDesc:"Empfehler-Adresse oder ID eingeben.",bindRef:"BINDEN",
    power:"LEISTUNG",ftaSec:"Hashrate",pending:"AUSSTEHEND",fta:"FTA",miningActive:"MINING AKTIV",noMachine:"KEINE MASCHINE",claim:"ABHOLEN",
    shopTitle:"⛏️ Shop",machines:"Maschinen",batteries:"Batterien",buy:"KAUFEN",
    myAssets:"⚙️ Wallet & Assets",walletBal:"💰 Guthaben",plugMachine:"🔌 Maschine anschließen",plugDesc:"Maschinen-Index und Batterietyp wählen.",
    machineId:"Maschinen-Index (0, 1...)",plug:"ANSCHLIESSEN ⚡",
    swapTitle:"💱 Tausch",youPay:"Sie zahlen",balance:"Guthaben:",youReceive:"Sie erhalten",swap:"TAUSCHEN",
    loading:"Laden...",currentRate:"1 FTA = ",
    home:"Start",shop:"Shop",assets:"Wallet",swapNav:"Swap",
    connWallet:"Verbindung...",errConn:"Verbindungsfehler",
    linking:"Verknüpfung...",refLinked:"Empfehler verknüpft!",connFirst:"Zuerst verbinden",
    enterRefAddr:"Empfehler-Adresse oder ID (0x...)",enterRefId:"Empfehler-ID (Nummer)",
    buyingMachine:"Maschinenkauf",buyingBattery:"Batteriekauf",
    confirming:"Bestätigung...",calcFta:"Preisberechnung...",
    machineBought:"Maschine gekauft!",batteryBought:"Batterie gekauft!",
    invalidId:"Ungültiger Maschinen-Index",pluggingIn:"Anschließen...",pluggedIn:"Maschine angeschlossen! ⚡",
    invalidAmount:"Ungültiger Betrag",swapping:"Tauschen...",swapSuccess:"Tausch erfolgreich!",
    claiming:"Abholung...",claimed:"Belohnungen abgeholt!",
    error:"Fehler",days:"Tage",rig:"RIG",
    totalBal:"Gesamtguthaben",activeMachines:"⛏️ Aktive Maschinen",
    myMachines:"⛏️ Meine Maschinen",myBatteries:"🔋 Meine Batterien",
    active:"Aktiv",expired:"Abgelaufen",inactive:"Inaktiv",available:"Verfügbar",
    plugged:"Angeschlossen",notPlugged:"Nicht angeschlossen",timeRemaining:"Verbleibend",
    noMachines:"Keine Maschinen",noBatteries:"Keine Batterien",
    batteryLabel:"Batterie",usdtPerFta:" USDT",noActiveMachines:"Keine aktiven Maschinen",
    exchangeRate:"Wechselkurs",priceImpact:"Preiseinfluss",
    swapFee:"Swap-Gebühr (4%)",minimumReceived:"Minimum erhalten",
    slippageTolerance:"Slippage-Toleranz",networkFee:"Netzwerkgebühr",
    depositBtn:"EINZAHLEN",withdrawBtn:"AUSZAHLEN",depositing:"Einzahlung...",depositSuccess:"Einzahlung erfolgreich!",withdrawing:"Auszahlung...",withdrawSuccess:"Auszahlung erfolgreich!",
    send:"Senden",receive:"Empfangen",sending:"Senden...",sentSuccess:"Erfolgreich gesendet!",addrCopied:"Adresse kopiert!",confirmSend:"SENDEN BESTÄTIGEN",invalidAddr:"Ungültige Adresse",recipientAddr:"Empfängeradresse (0x...)",amount:"Betrag",
    errRejected:"Transaktion abgebrochen",errInsufficientFunds:"Unzureichendes Guthaben (Tokens oder POL-Gas)",
    errNetwork:"Netzwerkfehler",errTimeout:"Zeitüberschreitung — Polygonscan prüfen.",
    errContract:"Transaktion vom Vertrag abgelehnt",errGeneric:"Ein Fehler ist aufgetreten",
    errAlreadyPending:"Transaktion ausstehend.",errNonce:"Nonce-Fehler. App neu laden.",
    errNoMachine:"Sie besitzen diese Maschine nicht",errRunning:"Maschine läuft bereits",
    errNoBattery:"Keine Batterie dieses Typs",errMaxMachine:"Max. Maschinen erreicht",
    disconnected:"Getrennt",welcome:"Willkommen bei Fitia Pro!",
    needPol:"Sie benötigen POL für Gasgebühren.",
  },
  zh: {
    connect:"连接",refTitle:"👥 推荐",refDesc:"输入推荐人地址或ID。",bindRef:"绑定",
    power:"算力",ftaSec:"哈希率",pending:"待领取",fta:"FTA",miningActive:"挖矿中",noMachine:"无矿机",claim:"领取",
    shopTitle:"⛏️ 商店",machines:"矿机",batteries:"电池",buy:"购买",
    myAssets:"⚙️ 钱包与资产",walletBal:"💰 余额",plugMachine:"🔌 连接矿机",plugDesc:"选择矿机索引和电池类型。",
    machineId:"矿机索引 (0, 1...)",plug:"连接 ⚡",
    swapTitle:"💱 兑换",youPay:"您支付",balance:"余额:",youReceive:"您收到",swap:"兑换",
    loading:"加载中...",currentRate:"1 FTA = ",
    home:"首页",shop:"商店",assets:"钱包",swapNav:"兑换",
    connWallet:"连接中...",errConn:"连接错误",
    linking:"绑定中...",refLinked:"推荐人已绑定！",connFirst:"请先连接",
    enterRefAddr:"推荐人地址或ID (0x...)",enterRefId:"推荐人ID (数字)",
    buyingMachine:"购买矿机",buyingBattery:"购买电池",
    confirming:"确认中...",calcFta:"计算价格...",
    machineBought:"矿机购买成功！",batteryBought:"电池购买成功！",
    invalidId:"无效的矿机索引",pluggingIn:"连接中...",pluggedIn:"矿机已连接！ ⚡",
    invalidAmount:"无效金额",swapping:"兑换中...",swapSuccess:"兑换成功！",
    claiming:"领取中...",claimed:"奖励已领取！",
    error:"错误",days:"天",rig:"RIG",
    totalBal:"总余额",activeMachines:"⛏️ 活跃矿机",
    myMachines:"⛏️ 我的矿机",myBatteries:"🔋 我的电池",
    active:"活跃",expired:"已过期",inactive:"未激活",available:"可用",
    plugged:"已连接",notPlugged:"未连接",timeRemaining:"剩余",
    noMachines:"暂无矿机",noBatteries:"暂无电池",
    batteryLabel:"电池",usdtPerFta:" USDT",noActiveMachines:"无活跃矿机",
    exchangeRate:"汇率",priceImpact:"价格影响",
    swapFee:"兑换费 (4%)",minimumReceived:"最少收到",
    slippageTolerance:"滑点容忍度",networkFee:"网络费",
    depositBtn:"存款",withdrawBtn:"提款",depositing:"存款中...",depositSuccess:"存款成功！",withdrawing:"提款中...",withdrawSuccess:"提款成功！",
    send:"发送",receive:"接收",sending:"发送中...",sentSuccess:"发送成功！",addrCopied:"地址已复制！",confirmSend:"确认发送",invalidAddr:"无效地址",recipientAddr:"收款地址 (0x...)",amount:"金额",
    errRejected:"交易已取消",errInsufficientFunds:"余额不足（代币或POL矿工费）",
    errNetwork:"网络错误",errTimeout:"交易超时 — 请查看Polygonscan。",
    errContract:"合约拒绝交易",errGeneric:"发生错误",
    errAlreadyPending:"交易处理中，请等待。",errNonce:"Nonce错误，请刷新应用。",
    errNoMachine:"您不拥有此矿机",errRunning:"矿机已在运行",
    errNoBattery:"没有此类型的电池",errMaxMachine:"已达矿机上限",
    disconnected:"已断开",welcome:"欢迎来到 Fitia Pro！",
    needPol:"您需要POL作为矿工费。",
  },
  sg: {
    connect:"Connect",refTitle:"👥 Referral",refDesc:"Enter referrer address or ID.",bindRef:"BIND",
    power:"POWER",ftaSec:"Hashrate",pending:"PENDING",fta:"FTA",miningActive:"MINING ACTIVE",noMachine:"NO MACHINE",claim:"CLAIM",
    shopTitle:"⛏️ Shop",machines:"Machines",batteries:"Batteries",buy:"BUY",
    myAssets:"⚙️ Wallet & Assets",walletBal:"💰 Balances",plugMachine:"🔌 Plug in a machine",plugDesc:"Select machine index and battery type.",
    machineId:"Machine Index (0, 1...)",plug:"PLUG IN ⚡",
    swapTitle:"💱 Swap",youPay:"You pay",balance:"Balance:",youReceive:"You receive",swap:"SWAP",
    loading:"Loading...",currentRate:"1 FTA = ",
    home:"Home",shop:"Shop",assets:"Wallet",swapNav:"Swap",
    connWallet:"Connecting...",errConn:"Connection Error",
    linking:"Linking...",refLinked:"Referrer linked!",connFirst:"Connect first",
    enterRefAddr:"Referrer address or ID (0x...)",enterRefId:"Referrer ID (number)",
    buyingMachine:"Buying Machine",buyingBattery:"Buying Battery",
    confirming:"Confirming...",calcFta:"Calculating price...",
    machineBought:"Machine purchased!",batteryBought:"Battery purchased!",
    invalidId:"Invalid Machine Index",pluggingIn:"Plugging in...",pluggedIn:"Machine plugged in! ⚡",
    invalidAmount:"Invalid amount",swapping:"Swapping...",swapSuccess:"Swap successful!",
    claiming:"Claiming...",claimed:"Rewards claimed!",
    error:"Error",days:"Days",rig:"RIG",
    totalBal:"Total Balance",activeMachines:"⛏️ Active Machines",
    myMachines:"⛏️ My Machines",myBatteries:"🔋 My Batteries",
    active:"Active",expired:"Expired",inactive:"Inactive",available:"Available",
    plugged:"Plugged",notPlugged:"Not Plugged",timeRemaining:"Remaining",
    noMachines:"No machines yet",noBatteries:"No batteries yet",
    batteryLabel:"Battery",usdtPerFta:" USDT",noActiveMachines:"No active machines",
    exchangeRate:"Exchange Rate",priceImpact:"Price Impact",
    swapFee:"Swap Fee (4%)",minimumReceived:"Minimum Received",
    slippageTolerance:"Slippage Tolerance",networkFee:"Network Fee",
    depositBtn:"DEPOSIT",withdrawBtn:"WITHDRAW",depositing:"Depositing...",depositSuccess:"Deposit successful!",withdrawing:"Withdrawing...",withdrawSuccess:"Withdrawal successful!",
    send:"Send",receive:"Receive",sending:"Sending...",sentSuccess:"Sent successfully!",addrCopied:"Address copied!",confirmSend:"CONFIRM SEND",invalidAddr:"Invalid address",recipientAddr:"Recipient address (0x...)",amount:"Amount",
    errRejected:"Transaction cancelled",errInsufficientFunds:"Insufficient balance (tokens or POL gas)",
    errNetwork:"Network error.",errTimeout:"Transaction timed out — check Polygonscan.",
    errContract:"Transaction rejected by contract",errGeneric:"An error occurred",
    errAlreadyPending:"Transaction pending. Please wait.",errNonce:"Nonce error. Reload the app.",
    errNoMachine:"You don't own this machine",errRunning:"Machine already running",
    errNoBattery:"No battery of this type",errMaxMachine:"Max machines reached",
    disconnected:"Disconnected",welcome:"Welcome to Fitia Pro!",
    needPol:"You need POL for gas fees.",
  },
};

// ─── ABIs ──────────────────────────────────────────────────────────
// ⚠️ INFERÉ depuis l'interface HTML — VÉRIFIE contre ton contrat.sol
const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function allowance(address,address) view returns (uint256)",
  "function approve(address,uint256) returns (bool)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function transfer(address,uint256) returns (bool)",
];

// ═══ REMPLACE CET ABI par celle générée depuis ton contrat.sol ═══
const CORE_ABI = [
  // Lecture
  "function getPower(address) view returns (uint256)",
  "function getPendingRewards(address) view returns (uint256)",
  "function getUserMachineCount(address) view returns (uint256)",
  "function getUserMachine(address,uint256) view returns (uint256 power, uint256 purchaseTime, bool isActive, uint256 batteryType, uint256 batteryEndTime)",
  "function getUserBatteryCount(address,uint8) view returns (uint256)",
  "function getReferrer(address) view returns (address)",
  "function getSwapRate() view returns (uint256)",        // prix en USDT pour 1 FTA (18 décimales)
  "function getMachinePriceUSDT(uint256) view returns (uint256)",
  "function getMachinePriceFTA(uint256) view returns (uint256)",
  "function getBatteryPriceUSDT(uint8) view returns (uint256)",
  "function getBatteryPriceFTA(uint8) view returns (uint256)",
  "function getBatteryDuration(uint8) view returns (uint256)", // en secondes
  // Écriture
  "function claimRewards()",
  "function bindReferrer(address)",
  "function buyMachineWithUSDT(uint256 machineId)",
  "function buyMachineWithFTA(uint256 machineId)",
  "function buyBatteryWithUSDT(uint8 batteryType)",
  "function buyBatteryWithFTA(uint8 batteryType)",
  "function plugInMachine(uint256 machineIndex, uint8 batteryType)",
  "function swapUSDTtoFTA(uint256 usdtAmount)",
  "function swapFTAtoUSDT(uint256 ftaAmount)",
  "function depositUSDT(uint256 amount)",
  "function depositFTA(uint256 amount)",
  "function withdrawUSDT(uint256 amount)",
  "function withdrawFTA(uint256 amount)",
  // Événements
  "event Claimed(address indexed user, uint256 amount)",
  "event MachineBought(address indexed user, uint256 machineId, string paymentMethod)",
  "event BatteryBought(address indexed user, uint8 batteryType, string paymentMethod)",
  "event MachinePlugged(address indexed user, uint256 machineIndex, uint8 batteryType)",
  "event Swapped(address indexed user, string fromToken, string toToken, uint256 amountIn, uint256 amountOut)",
  "event Deposited(address indexed user, string token, uint256 amount)",
  "event Withdrawn(address indexed user, string token, uint256 amount)",
  "event ReferrerBound(address indexed user, address indexed referrer)",
];

const MINE_ABI = [
  "function getActiveMachines(address) view returns (uint256[] memory indices, uint256[] memory powers, uint256[] memory endTimes)",
];

// ─── Données machines / batteries (UI uniquement) ─────────────────
// ⚠️ Les prix réels viennent du contrat via getMachinePriceXxx / getBatteryPriceXxx
const MACHINES_UI = [
  { id:0, name:"Starter",   icon:"🔧", color:"#94a3b8", tier:"T1" },
  { id:1, name:"Basic",     icon:"⛏️", color:"#3b82f6", tier:"T2" },
  { id:2, name:"Standard",  icon:"⚙️", color:"#10b981", tier:"T3" },
  { id:3, name:"Pro",       icon:"🔧", color:"#f59e0b", tier:"T4" },
  { id:4, name:"Elite",     icon:"⚡", color:"#ef4444", tier:"T5" },
  { id:5, name:"Legendary", icon:"👑", color:"#a855f7", tier:"T6" },
];

const BATTERIES_UI = [
  { type:0, days:3 },
  { type:1, days:7 },
  { type:2, days:15 },
  { type:3, days:30 },
  { type:4, days:90 },
  { type:5, days:180 },
  { type:6, days:270 },
  { type:7, days:365 },
];

// ─── FAQ Chat Bot ──────────────────────────────────────────────────
const FAQ_RULES = [
  { kw:["connect","connexion","login","connecter","se connecter","log in","sign in"],
    a:{fr:"Cliquez sur **Se connecter** en haut à droite. Vous pouvez utiliser **Google** ou **Email** pour vous connecter sans installer MetaMask.",en:"Click **Connect** in the top right. Use **Google** or **Email** to log in — no MetaMask needed.",de:"Klicken Sie auf **Verbinden**. Nutzen Sie **Google** oder **E-Mail**.",zh:"点击右上角**连接**，使用**Google**或**邮箱**登录。"}},
  { kw:["buy","acheter","machine","rig","miner","矿机","kaufen"],
    a:{fr:"Allez dans **Boutique** → onglet **Machines**. Choisissez votre machine et le mode de paiement (USDT ou FTA).",en:"Go to **Shop** → **Machines** tab. Pick a machine and payment method (USDT or FTA).",de:"Gehen Sie zum **Shop** → **Maschinen**.",zh:"前往**商店** → **矿机**标签页。"}},
  { kw:["battery","batterie","plug","brancher","连接","电池","anschließen"],
    a:{fr:"1. Achetez des batteries dans la **Boutique** → **Batteries**.\n2. Allez dans **Wallet** → section *Brancher une machine*.\n3. Entrez l'index de la machine et le type de batterie.",en:"1. Buy batteries in **Shop** → **Batteries**.\n2. Go to **Wallet** → *Plug in a machine* section.\n3. Enter machine index and battery type.",de:"1. Batterien im **Shop** kaufen.\n2. Unter **Wallet** → *Maschine anschließen*.",zh:"1. 在**商店**购买电池。\n2. 在**钱包**中连接矿机。"}},
  { kw:["claim","récupérer","réclamer","gains","reward","领取","abholen"],
    a:{fr:"Le bouton jaune **RÉCLAMER** sur le tableau de bord récolte vos FTA minés. Les récompenses sont calculées en continu.",en:"The yellow **CLAIM** button on the dashboard collects your mined FTA.",de:"Der gelbe **ABHOLEN** Button sammelt Ihre geminten FTA.",zh:"仪表盘上的黄色**领取**按钮收取挖矿的FTA。"}},
  { kw:["swap","échange","changer","兑换","tauschen","exchange"],
    a:{fr:"Utilisez l'onglet **Swap** pour échanger USDT ↔ FTA. Des frais de 4% s'appliquent.",en:"Use the **Swap** tab to exchange USDT ↔ FTA. A 4% fee applies.",de:"Nutzen Sie **Swap** für USDT ↔ FTA. 4% Gebühr.",zh:"使用**兑换**标签页交换USDT和FTA。手续费4%。"}},
  { kw:["deposit","dépôt","déposer","存款","einzahlen"],
    a:{fr:"Dans **Wallet**, choisissez le token (USDT/FTA), entrez le montant et cliquez **DÉPOSER**. Vous devez d'abord approuver le token.",en:"In **Wallet**, select token, enter amount, click **DEPOSIT**. Token approval is required first.",de:"In **Wallet**, Token wählen, Betrag eingeben, **EINZAHLEN**.",zh:"在**钱包**中选择代币，输入金额，点击**存款**。"}},
  { kw:["withdraw","retrait","retirer","提款","auszahlen"],
    a:{fr:"Dans **Wallet**, choisissez le token, entrez le montant et cliquez **RETIRER**.",en:"In **Wallet**, select token, enter amount, click **WITHDRAW**.",de:"In **Wallet**, Token wählen, **AUSZAHLEN**.",zh:"在**钱包**中选择代币，点击**提款**。"}},
  { kw:["referral","parrain","parrainage","推荐","empfehlung"],
    a:{fr:"Entrez l'adresse ou l'ID de votre parrain dans la section **Parrainage** du tableau de bord, puis cliquez **LIER**.",en:"Enter your referrer's address or ID in the **Referral** section, then click **BIND**.",de:"Empfehler-Adresse im **Empfehlung**-Bereich eingeben.",zh:"在**推荐**区域输入推荐人地址或ID。"}},
  { kw:["gas","gaz","fee","frais","矿工费","gebühr","pol","matic"],
    a:{fr:"Chaque transaction nécessite du **POL** pour les frais de gaz. Envoyez un peu de POL à votre adresse depuis un échange.",en:"Every transaction needs **POL** for gas fees. Send some POL to your address from an exchange.",de:"Jede Transaktion benötigt **POL** für Gasgebühren.",zh:"每笔交易需要**POL**作为矿工费。"}},
  { kw:["help","aide","assistant","帮助","hilfe"],
    a:{fr:"Je suis l'assistant Fitia ! Posez-moi une question sur :\n• Connexion\n• Achat de machines/batteries\n• Swap, Dépôt, Retrait\n• Parrainage\n• Frais de gaz",en:"I'm the Fitia assistant! Ask me about:\n• Connection\n• Buying machines/batteries\n• Swap, Deposit, Withdraw\n• Referral\n• Gas fees",de:"Ich bin der Fitia-Assistent!",zh:"我是Fitia助手！"}},
];

// ═══════════════════════════════════════════════════════════════════
//  ÉTAT GLOBAL
// ═══════════════════════════════════════════════════════════════════
let web3AuthModalPack = null;
let ethersProvider = null;
let signer = null;
let coreContract = null;
let mineContract = null;
let usdtContract = null;
let ftaContract = null;
let currentAddress = null;
let isConnected = false;
let refreshTimer = null;
let canvasAnimId = null;
let particles = [];
let swapRate = null; // uint256 du contrat
let usdtDecimals = 6;
let ftaDecimals = 18;

// ═══════════════════════════════════════════════════════════════════
//  APPLICATION
// ═══════════════════════════════════════════════════════════════════
const App = {
  lang: "fr",
  payMode: "USDT",
  shopView: "machines",
  swapFrom: "USDT",
  chatOpen: false,

  // ─── Traduction ────────────────────────────────────────────────
  t(key) {
    return (i18n[this.lang] && i18n[this.lang][key]) || key;
  },

  setLanguage(lang) {
    this.lang = lang;
    document.getElementById("lang-btn-display").textContent =
      {fr:"🇫🇷 FR",en:"🇬🇧 EN",de:"🇩🇪 DE",zh:"🇨🇳 中文",sg:"🇸🇬 SG"}[lang] || lang;
    // Met à jour tous les data-i18n
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const k = el.getAttribute("data-i18n");
      if (i18n[this.lang] && i18n[this.lang][k]) el.textContent = i18n[this.lang][k];
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
      const k = el.getAttribute("data-i18n-placeholder");
      if (i18n[this.lang] && i18n[this.lang][k]) el.placeholder = i18n[this.lang][k];
    });
    this.renderShop();
  },

  // ─── Initialisation Web3Auth ───────────────────────────────────
  async init() {
    try {
      const Web3AuthModalPack = window.Web3AuthModal?.Web3AuthModalPack;
      if (!Web3AuthModalPack) {
        console.error("Web3Auth SDK non chargé. Vérifiez le script CDN.");
        this.toast("SDK Web3Auth introuvable. Rechargez la page.", "error");
        return;
      }

      web3AuthModalPack = new Web3AuthModalPack({
        web3AuthConfig: {
          clientId: CONFIG.WEB3AUTH_CLIENT_ID,
          web3AuthNetwork: CONFIG.WEB3AUTH_NETWORK,
          chainConfig: {
            chainNamespace: "eip155",
            chainId: "0x" + CONFIG.CHAIN_ID.toString(16),
            rpcTarget: CONFIG.RPC_URL,
            displayName: "Polygon Mainnet",
            blockExplorer: CONFIG.EXPLORER,
            currency: { name: "POL", symbol: "POL", decimals: 18 },
          },
        },
        uiConfig: {
          theme: "dark",
          loginMethodsOrder: ["google", "email_passwordless"],
          defaultLanguage: "fr",
          appLogo: "https://i.ibb.co/CKc7wbNr/IMG-20260226-152843-512-x-512-pixel.webp",
          appName: "FITIA PRO MINER",
          modalZIndex: "9999",
        },
      });

      await web3AuthModalPack.init();

      // Vérifie si une session existe déjà
      if (web3AuthModalPack.isConnected()) {
        await this.setupProvider();
        this.onConnected();
      }

      // Initialise le canvas
      this.initCanvas();
      // Applique la langue
      this.setLanguage(this.lang);

    } catch (err) {
      console.error("Init error:", err);
      this.toast(this.t("errConn") + " " + err.message, "error");
    }
  },

  // ─── Connexion ─────────────────────────────────────────────────
  async connect() {
    if (isConnected) return;
    this.showLoader(this.t("connWallet"));
    try {
      await web3AuthModalPack.connect();
      await this.setupProvider();
      this.onConnected();
      this.hideLoader();
      this.toast(this.t("welcome"), "success");
    } catch (err) {
      this.hideLoader();
      // L'utilisateur a fermé la modal sans se connecter — pas d'erreur
      if (err.message?.includes("User cancelled") || err.code === 4001 || err.message?.includes("popup")) {
        return; // silencieux
      }
      this.handleTxError(err, this.t("errConn"));
    }
  },

  async disconnect() {
    try {
      if (web3AuthModalPack) await web3AuthModalPack.disconnect();
    } catch(e) { console.warn("disconnect err", e); }
    isConnected = false;
    currentAddress = null;
    ethersProvider = null;
    signer = null;
    coreContract = null;
    mineContract = null;
    usdtContract = null;
    ftaContract = null;
    if (refreshTimer) { clearInterval(refreshTimer); refreshTimer = null; }

    document.getElementById("btn-connect").classList.remove("hidden");
    document.getElementById("wallet-status").classList.add("hidden");
    this.toast(this.t("disconnected"), "success");
  },

  async setupProvider() {
    const w3aProvider = web3AuthModalPack.provider;
    ethersProvider = new ethers.BrowserProvider(w3aProvider);
    signer = await ethersProvider.getSigner();
    currentAddress = await signer.getAddress();

    // Initialise les contrats
    coreContract = new ethers.Contract(CONFIG.CORE, CORE_ABI, signer);
    mineContract = new ethers.Contract(CONFIG.MINE, MINE_ABI, signer);
    usdtContract = new ethers.Contract(CONFIG.USDT, ERC20_ABI, signer);
    ftaContract  = new ethers.Contract(CONFIG.FTA,  ERC20_ABI, signer);

    // Récupère les décimales
    try { usdtDecimals = await usdtContract.decimals(); } catch(e) { usdtDecimals = 6; }
    try { ftaDecimals  = await ftaContract.decimals();  } catch(e) { ftaDecimals = 18; }
  },

  onConnected() {
    isConnected = true;
    document.getElementById("btn-connect").classList.add("hidden");
    document.getElementById("wallet-status").classList.remove("hidden");
    document.getElementById("addr-display").textContent = this.shortAddr(currentAddress);

    // Refresh automatique
    this.refreshAll();
    if (refreshTimer) clearInterval(refreshTimer);
    refreshTimer = setInterval(() => this.refreshAll(), CONFIG.REFRESH_INTERVAL);
  },

  // ─── Navigation ────────────────────────────────────────────────
  nav(view) {
    document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
    document.getElementById("view-" + view)?.classList.add("active");
    document.querySelectorAll(".nav-item").forEach((b, i) => {
      b.classList.toggle("active", ["dashboard","shop","my-rigs","swap"][i] === view);
    });
    if (view === "shop") this.renderShop();
    if (view === "my-rigs") this.refreshMyAssets();
    if (view === "swap") this.refreshSwapBalances();
  },

  // ─── Refresh global ────────────────────────────────────────────
  async refreshAll() {
    if (!isConnected) return;
    try {
      await Promise.allSettled([
        this.refreshDashboard(),
        this.refreshWallet(),
      ]);
    } catch(e) { /* silencieux en background */ }
  },

  // ─── Dashboard ─────────────────────────────────────────────────
  async refreshDashboard() {
    if (!coreContract) return;
    try {
      const [power, pending, totalUSD] = await Promise.all([
        coreContract.getPower(currentAddress),
        coreContract.getPendingRewards(currentAddress),
        this.calcTotalUSD(),
      ]);

      document.getElementById("val-power").textContent = this.formatPower(power);
      document.getElementById("val-pending").textContent = this.formatToken(pending, ftaDecimals, 6);
      document.getElementById("val-total-usd").textContent = "$" + totalUSD;

      // Statut minier
      const vizStatus = document.getElementById("viz-status");
      if (power > 0n) {
        vizStatus.textContent = this.t("miningActive");
        vizStatus.style.color = "#10b981";
      } else {
        vizStatus.textContent = this.t("noMachine");
        vizStatus.style.color = "#666";
      }

      // Machines actives
      await this.refreshActiveMachines();

      // Taux de swap
      try {
        swapRate = await coreContract.getSwapRate();
        const rateNum = Number(ethers.formatUnits(swapRate, usdtDecimals));
        document.getElementById("swap-rate").textContent = this.t("currentRate") + rateNum.toFixed(6) + " USDT";
      } catch(e) {
        document.getElementById("swap-rate").textContent = this.t("loading");
      }
    } catch(e) {
      console.warn("refreshDashboard:", e);
    }
  },

  async refreshActiveMachines() {
    const container = document.getElementById("active-machines-list");
    if (!mineContract) { container.innerHTML = `<p class="small-text" style="text-align:center">${this.t("noActiveMachines")}</p>`; return; }
    try {
      const { indices, powers, endTimes } = await mineContract.getActiveMachines(currentAddress);
      if (!indices || indices.length === 0) {
        container.innerHTML = `<p class="small-text" style="text-align:center">${this.t("noActiveMachines")}</p>`;
        return;
      }
      let html = "";
      const now = Math.floor(Date.now() / 1000);
      for (let i = 0; i < indices.length; i++) {
        const idx = Number(indices[i]);
        const pwr = Number(powers[i]);
        const end = Number(endTimes[i]);
        const remaining = Math.max(0, end - now);
        const hrs = Math.floor(remaining / 3600);
        const mins = Math.floor((remaining % 3600) / 60);
        const timeStr = remaining > 0 ? `${hrs}h ${mins}m` : this.t("expired");
        const statusClass = remaining > 0 ? "active" : "expired";
        const mInfo = MACHINES_UI[idx] || { name: `RIG #${idx}`, icon: "🔧", color: "#888" };
        html += `
          <div class="asset-row">
            <div class="machine-svg-mini" style="font-size:1.6rem;color:${mInfo.color}">${mInfo.icon}</div>
            <div class="asset-info">
              <div class="asset-name">${mInfo.name} <span class="status-pill ${statusClass}">${remaining > 0 ? this.t("active") : this.t("expired")}</span></div>
              <div class="asset-detail">${this.formatPower(powers[i])} · ${this.t("timeRemaining")}: ${timeStr}</div>
            </div>
          </div>`;
      }
      container.innerHTML = html;
    } catch(e) {
      container.innerHTML = `<p class="small-text" style="text-align:center">${this.t("noActiveMachines")}</p>`;
    }
  },

  // ─── Claim ─────────────────────────────────────────────────────
  async claim() {
    if (!this.ensureConnected()) return;
    await this.safeTx(
      () => coreContract.claimRewards(),
      { loading: this.t("claiming"), success: this.t("claimed") },
      () => this.refreshDashboard()
    );
  },

  // ─── Parrainage ────────────────────────────────────────────────
  async bindReferrer() {
    if (!this.ensureConnected()) return;
    const input = document.getElementById("ref-address-input").value.trim();
    if (!input) { this.toast(this.t("enterRefAddr"), "error"); return; }

    let refAddr = input;
    // Si c'est un nombre, on ne peut pas le résoudre sans une fonction contract appropriée
    // On suppose que c'est une adresse
    if (!ethers.isAddress(refAddr)) {
      this.toast(this.t("invalidAddr"), "error");
      return;
    }

    await this.safeTx(
      () => coreContract.bindReferrer(refAddr),
      { loading: this.t("linking"), success: this.t("refLinked") }
    );
  },

  // ─── Boutique ──────────────────────────────────────────────────
  setPayMode(mode) {
    this.payMode = mode;
    document.getElementById("btn-pay-usdt").classList.toggle("active", mode === "USDT");
    document.getElementById("btn-pay-fta").classList.toggle("active", mode === "FTA");
    this.renderShop();
  },

  setShopView(view) {
    this.shopView = view;
    document.querySelectorAll(".shop-tab").forEach((t, i) => {
      t.classList.toggle("active", ["machines","batteries"][i] === view);
    });
    this.renderShop();
  },

  async renderShop() {
    const list = document.getElementById("shop-list");
    if (!isConnected || !coreContract) {
      list.innerHTML = `<p class="small-text" style="grid-column:1/-1;text-align:center;padding:30px 0">${this.t("connFirst")}</p>`;
      return;
    }

    if (this.shopView === "machines") {
      let html = "";
      for (const m of MACHINES_UI) {
        let priceUSDT = 0, priceFTA = 0, power = 0;
        try {
          [priceUSDT, priceFTA] = await Promise.all([
            coreContract.getMachinePriceUSDT(m.id),
            coreContract.getMachinePriceFTA(m.id),
          ]);
          // Essayer de lire la puissance depuis le contrat ou utiliser les données UI
          try { power = Number(await coreContract.getPower(currentAddress)); } catch(e) {}
        } catch(e) {
          priceUSDT = m.id * 10 + 5;
          priceFTA = priceUSDT * 10;
        }
        const price = this.payMode === "USDT"
          ? "$" + this.formatToken(priceUSDT, usdtDecimals, 2)
          : this.formatToken(priceFTA, ftaDecimals, 2) + " FTA";
        html += `
          <div class="rig-item" onclick="App.buyMachine(${m.id})">
            <span class="tier-badge" style="background:${m.color}">${m.tier}</span>
            <div style="font-size:2.2rem;margin-bottom:6px">${m.icon}</div>
            <div class="rig-name">${m.name}</div>
            <div class="rig-power">⚡ ${this.payMode === "USDT" ? "$" + this.formatToken(priceUSDT, usdtDecimals, 2) : this.formatToken(priceFTA, ftaDecimals, 2) + " FTA"}</div>
            <div class="rig-price">${price}</div>
            <button class="btn-primary" style="font-size:0.8rem;padding:8px">${this.t("buy")}</button>
          </div>`;
      }
      list.innerHTML = html;
    } else {
      let html = "";
      for (const b of BATTERIES_UI) {
        let priceUSDT = 0, priceFTA = 0;
        try {
          [priceUSDT, priceFTA] = await Promise.all([
            coreContract.getBatteryPriceUSDT(b.type),
            coreContract.getBatteryPriceFTA(b.type),
          ]);
        } catch(e) {
          priceUSDT = b.days / 3;
          priceFTA = priceUSDT * 10;
        }
        const price = this.payMode === "USDT"
          ? "$" + this.formatToken(priceUSDT, usdtDecimals, 2)
          : this.formatToken(priceFTA, ftaDecimals, 2) + " FTA";
        const pct = Math.min(100, (b.days / 365) * 100);
        const lvlClass = pct > 60 ? "" : pct > 30 ? "medium" : "low";
        html += `
          <div class="battery-shop-item" onclick="App.buyBattery(${b.type})">
            <div class="real-battery">
              <div class="battery-body">
                <div class="battery-level ${lvlClass}" style="width:${pct}%"></div>
                <div class="battery-charge-indicator">${b.days}d</div>
              </div>
              <div class="battery-cap"></div>
            </div>
            <div style="font-weight:bold;font-size:0.9rem">${b.days} ${this.t("days")}</div>
            <div style="color:var(--primary);font-weight:bold;font-size:1rem">${price}</div>
            <button class="btn-primary" style="font-size:0.75rem;padding:6px">${this.t("buy")}</button>
          </div>`;
      }
      list.innerHTML = html;
    }
  },

  async buyMachine(id) {
    if (!this.ensureConnected()) return;
    const useUSDT = this.payMode === "USDT";
    let txFn;
    if (useUSDT) {
      // Approve d'abord
      const price = await coreContract.getMachinePriceUSDT(id);
      await this.safeTx(
        () => usdtContract.approve(CONFIG.CORE, price),
        { loading: this.t("confirming"), success: "USDT " + this.t("confirming") + " ✓" }
      );
      txFn = () => coreContract.buyMachineWithUSDT(id);
    } else {
      const price = await coreContract.getMachinePriceFTA(id);
      await this.safeTx(
        () => ftaContract.approve(CONFIG.CORE, price),
        { loading: this.t("confirming"), success: "FTA " + this.t("confirming") + " ✓" }
      );
      txFn = () => coreContract.buyMachineWithFTA(id);
    }
    await this.safeTx(
      txFn,
      { loading: this.t("buyingMachine"), success: this.t("machineBought") },
      () => { this.refreshDashboard(); this.refreshMyAssets(); this.renderShop(); }
    );
  },

  async buyBattery(type) {
    if (!this.ensureConnected()) return;
    const useUSDT = this.payMode === "USDT";
    let txFn;
    if (useUSDT) {
      const price = await coreContract.getBatteryPriceUSDT(type);
      await this.safeTx(
        () => usdtContract.approve(CONFIG.CORE, price),
        { loading: this.t("confirming"), success: "USDT " + this.t("confirming") + " ✓" }
      );
      txFn = () => coreContract.buyBatteryWithUSDT(type);
    } else {
      const price = await coreContract.getBatteryPriceFTA(type);
      await this.safeTx(
        () => ftaContract.approve(CONFIG.CORE, price),
        { loading: this.t("confirming"), success: "FTA " + this.t("confirming") + " ✓" }
      );
      txFn = () => coreContract.buyBatteryWithFTA(type);
    }
    await this.safeTx(
      txFn,
      { loading: this.t("buyingBattery"), success: this.t("batteryBought") },
      () => { this.refreshMyAssets(); this.renderShop(); }
    );
  },

  // ─── Wallet & Soldes ───────────────────────────────────────────
  async refreshWallet() {
    if (!isConnected || !ethersProvider) return;
    try {
      const [polBal, usdtBal, ftaBal] = await Promise.all([
        ethersProvider.getBalance(currentAddress),
        usdtContract.balanceOf(currentAddress),
        ftaContract.balanceOf(currentAddress),
      ]);

      const polNum = Number(ethers.formatEther(polBal));
      const usdtNum = Number(ethers.formatUnits(usdtBal, usdtDecimals));
      const ftaNum = Number(ethers.formatUnits(ftaBal, ftaDecimals));

      // Prix approximatifs (à remplacer par un oracle si disponible)
      const polPrice = 0.25;
      const ftaPriceUSD = swapRate ? Number(ethers.formatUnits(swapRate, usdtDecimals)) : 0;

      document.getElementById("bal-pol").textContent = polNum.toFixed(4);
      document.getElementById("bal-pol-usd").textContent = "≈ $" + (polNum * polPrice).toFixed(2);
      document.getElementById("price-pol").textContent = "$" + polPrice.toFixed(2);
      this.setChange("change-pol", 0);

      document.getElementById("bal-usdt").textContent = usdtNum.toFixed(2);
      document.getElementById("bal-usdt-usd").textContent = "≈ $" + usdtNum.toFixed(2);
      document.getElementById("price-usdt").textContent = "$1.00";
      this.setChange("change-usdt", 0);

      document.getElementById("bal-fta").textContent = ftaNum.toFixed(4);
      document.getElementById("bal-fta-usd").textContent = "≈ $" + (ftaNum * ftaPriceUSD).toFixed(2);
      document.getElementById("price-fta").textContent = "$" + ftaPriceUSD.toFixed(6);
      this.setChange("change-fta", 0);
    } catch(e) {
      console.warn("refreshWallet:", e);
    }
  },

  setChange(elId, val) {
    const el = document.getElementById(elId);
    if (!el) return;
    el.textContent = (val >= 0 ? "+" : "") + val.toFixed(2) + "%";
    el.className = "token-change " + (val > 0 ? "up" : val < 0 ? "down" : "flat");
  },

  async calcTotalUSD() {
    try {
      const [polBal, usdtBal, ftaBal, pendingRewards] = await Promise.all([
        ethersProvider.getBalance(currentAddress),
        usdtContract.balanceOf(currentAddress),
        ftaContract.balanceOf(currentAddress),
        coreContract.getPendingRewards(currentAddress),
      ]);
      const polUSD = Number(ethers.formatEther(polBal)) * 0.25;
      const usdtUSD = Number(ethers.formatUnits(usdtBal, usdtDecimals));
      const ftaPrice = swapRate ? Number(ethers.formatUnits(swapRate, usdtDecimals)) : 0;
      const ftaUSD = Number(ethers.formatUnits(ftaBal, ftaDecimals)) * ftaPrice;
      const pendingUSD = Number(ethers.formatUnits(pendingRewards, ftaDecimals)) * ftaPrice;
      return (polUSD + usdtUSD + ftaUSD + pendingUSD).toFixed(2);
    } catch(e) {
      return "0.00";
    }
  },

  // ─── Dépôt / Retrait ──────────────────────────────────────────
  async deposit() {
    if (!this.ensureConnected()) return;
    const token = document.getElementById("deposit-token-select").value;
    const amountRaw = document.getElementById("deposit-amount").value;
    if (!amountRaw || Number(amountRaw) <= 0) { this.toast(this.t("invalidAmount"), "error"); return; }

    const tokenContract = token === "USDT" ? usdtContract : ftaContract;
    const decimals = token === "USDT" ? usdtDecimals : ftaDecimals;
    const amount = ethers.parseUnits(amountRaw, decimals);

    // Approve
    await this.safeTx(
      () => tokenContract.approve(CONFIG.CORE, amount),
      { loading: `${token} ${this.t("confirming")}`, success: `${token} approve ✓` }
    );

    // Deposit
    const txFn = token === "USDT"
      ? () => coreContract.depositUSDT(amount)
      : () => coreContract.depositFTA(amount);

    await this.safeTx(
      txFn,
      { loading: this.t("depositing"), success: this.t("depositSuccess") },
      () => this.refreshWallet()
    );
    document.getElementById("deposit-amount").value = "";
  },

  async withdraw() {
    if (!this.ensureConnected()) return;
    const token = document.getElementById("deposit-token-select").value;
    const amountRaw = document.getElementById("deposit-amount").value;
    if (!amountRaw || Number(amountRaw) <= 0) { this.toast(this.t("invalidAmount"), "error"); return; }

    const decimals = token === "USDT" ? usdtDecimals : ftaDecimals;
    const amount = ethers.parseUnits(amountRaw, decimals);

    const txFn = token === "USDT"
      ? () => coreContract.withdrawUSDT(amount)
      : () => coreContract.withdrawFTA(amount);

    await this.safeTx(
      txFn,
      { loading: this.t("withdrawing"), success: this.t("withdrawSuccess") },
      () => this.refreshWallet()
    );
    document.getElementById("deposit-amount").value = "";
  },

  // ─── Mes Actifs ────────────────────────────────────────────────
  async refreshMyAssets() {
    if (!isConnected || !coreContract) return;
    await this.renderMyMachines();
    await this.renderMyBatteries();
  },

  async renderMyMachines() {
    const container = document.getElementById("my-machines-list");
    try {
      const count = Number(await coreContract.getUserMachineCount(currentAddress));
      if (count === 0) {
        container.innerHTML = `<p class="small-text" style="text-align:center">${this.t("noMachines")}</p>`;
        return;
      }
      let html = "";
      for (let i = 0; i < count; i++) {
        const m = await coreContract.getUserMachine(currentAddress, i);
        const mInfo = MACHINES_UI[i] || { name: `RIG #${i}`, icon: "🔧", color: "#888" };
        const statusClass = m.isActive ? "active" : "inactive";
        const statusText = m.isActive ? this.t("plugged") : this.t("notPlugged");
        html += `
          <div class="asset-row">
            <div style="font-size:1.5rem;color:${mInfo.color};width:40px;text-align:center">${mInfo.icon}</div>
            <div class="asset-info">
              <div class="asset-name">#${i} ${mInfo.name} <span class="status-pill ${statusClass}">${statusText}</span></div>
              <div class="asset-detail">${this.t("power")}: ${this.formatPower(m.power)}</div>
            </div>
          </div>`;
      }
      container.innerHTML = html;
    } catch(e) {
      container.innerHTML = `<p class="small-text" style="text-align:center">${this.t("noMachines")}</p>`;
    }
  },

  async renderMyBatteries() {
    const container = document.getElementById("my-batteries-list");
    try {
      let html = "";
      let hasAny = false;
      for (const b of BATTERIES_UI) {
        const count = Number(await coreContract.getUserBatteryCount(currentAddress, b.type));
        if (count > 0) {
          hasAny = true;
          html += `
            <div class="asset-row">
              <div class="real-battery" style="margin:0;flex-shrink:0">
                <div class="battery-body">
                  <div class="battery-level" style="width:${Math.min(100, b.days/365*100)}%"></div>
                  <div class="battery-charge-indicator">${b.days}d</div>
                </div>
                <div class="battery-cap"></div>
              </div>
              <div class="asset-info">
                <div class="asset-name">${b.days} ${this.t("days")} <span class="status-pill available">×${count}</span></div>
                <div class="asset-detail">${this.t("batteryLabel")} T${b.type + 1}</div>
              </div>
            </div>`;
        }
      }
      container.innerHTML = hasAny ? html : `<p class="small-text" style="text-align:center">${this.t("noBatteries")}</p>`;
    } catch(e) {
      container.innerHTML = `<p class="small-text" style="text-align:center">${this.t("noBatteries")}</p>`;
    }
  },

  // ─── Brancher une machine ─────────────────────────────────────
  async plugInMachine() {
    if (!this.ensureConnected()) return;
    const machineId = parseInt(document.getElementById("plug-machine-id").value);
    const batteryType = parseInt(document.getElementById("plug-battery-type").value);

    if (isNaN(machineId) || machineId < 0) {
      this.toast(this.t("invalidId"), "error");
      return;
    }

    await this.safeTx(
      () => coreContract.plugInMachine(machineId, batteryType),
      { loading: this.t("pluggingIn"), success: this.t("pluggedIn") },
      () => { this.refreshDashboard(); this.refreshMyAssets(); }
    );
  },

  // ─── Swap ──────────────────────────────────────────────────────
  async refreshSwapBalances() {
    if (!isConnected) return;
    try {
      const usdtBal = await usdtContract.balanceOf(currentAddress);
      const ftaBal = await ftaContract.balanceOf(currentAddress);
      document.getElementById("swap-bal-from").textContent =
        this.swapFrom === "USDT"
          ? this.formatToken(usdtBal, usdtDecimals, 4)
          : this.formatToken(ftaBal, ftaDecimals, 4);
      document.getElementById("swap-bal-to").textContent =
        this.swapFrom === "USDT"
          ? this.formatToken(ftaBal, ftaDecimals, 4)
          : this.formatToken(usdtBal, usdtDecimals, 4);
    } catch(e) {}
  },

  toggleSwap() {
    this.swapFrom = this.swapFrom === "USDT" ? "FTA" : "USDT";
    document.getElementById("token-from-display").textContent = this.swapFrom;
    document.getElementById("token-to-display").textContent = this.swapFrom === "USDT" ? "FTA" : "USDT";
    document.getElementById("swap-from-in").value = "";
    document.getElementById("swap-to-in").value = "";
    document.getElementById("swap-details").classList.add("hidden");
    this.refreshSwapBalances();
  },

  async calcSwap() {
    if (!swapRate || !isConnected) return;
    const amountRaw = document.getElementById("swap-from-in").value;
    if (!amountRaw || Number(amountRaw) <= 0) {
      document.getElementById("swap-to-in").value = "";
      document.getElementById("swap-details").classList.add("hidden");
      return;
    }

    const rateNum = Number(ethers.formatUnits(swapRate, usdtDecimals));
    const fee = 0.04; // 4%
    let output;
    if (this.swapFrom === "USDT") {
      const input = Number(amountRaw);
      output = (input * (1 - fee)) / rateNum;
    } else {
      const input = Number(amountRaw);
      output = input * rateNum * (1 - fee);
    }

    document.getElementById("swap-to-in").value = output.toFixed(6);
    document.getElementById("swap-details").classList.remove("hidden");
    document.getElementById("swap-detail-rate").textContent = "1 FTA = " + rateNum.toFixed(6) + " USDT";
    document.getElementById("swap-detail-impact").textContent = "< 2%";
    document.getElementById("swap-detail-fee").textContent = (Number(amountRaw) * fee).toFixed(6) + (this.swapFrom === "USDT" ? " USDT" : " FTA");
    document.getElementById("swap-detail-min").textContent = (output * 0.995).toFixed(6) + (this.swapFrom === "USDT" ? " FTA" : " USDT");
  },

  async executeSwap() {
    if (!this.ensureConnected()) return;
    const amountRaw = document.getElementById("swap-from-in").value;
    if (!amountRaw || Number(amountRaw) <= 0) { this.toast(this.t("invalidAmount"), "error"); return; }

    let txFn;
    if (this.swapFrom === "USDT") {
      const amount = ethers.parseUnits(amountRaw, usdtDecimals);
      await this.safeTx(
        () => usdtContract.approve(CONFIG.CORE, amount),
        { loading: this.t("confirming"), success: "USDT approve ✓" }
      );
      txFn = () => coreContract.swapUSDTtoFTA(amount);
    } else {
      const amount = ethers.parseUnits(amountRaw, ftaDecimals);
      await this.safeTx(
        () => ftaContract.approve(CONFIG.CORE, amount),
        { loading: this.t("confirming"), success: "FTA approve ✓" }
      );
      txFn = () => coreContract.swapFTAtoUSDT(amount);
    }

    await this.safeTx(
      txFn,
      { loading: this.t("swapping"), success: this.t("swapSuccess") },
      () => {
        this.refreshWallet();
        this.refreshDashboard();
        this.refreshSwapBalances();
        document.getElementById("swap-from-in").value = "";
        document.getElementById("swap-to-in").value = "";
        document.getElementById("swap-details").classList.add("hidden");
      }
    );
  },

  // ─── Envoyer / Recevoir ───────────────────────────────────────
  openSend() {
    document.getElementById("modal-send").classList.add("active");
    this.updateSendBalance();
  },
  openReceive() {
    document.getElementById("modal-receive").classList.add("active");
    document.getElementById("receive-addr-display").textContent = currentAddress;
  },
  closeModals() {
    document.querySelectorAll(".modal").forEach(m => m.classList.remove("active"));
  },

  async updateSendBalance() {
    if (!isConnected) return;
    const token = document.getElementById("send-token-select").value;
    try {
      let bal;
      if (token === "POL") {
        bal = await ethersProvider.getBalance(currentAddress);
        document.getElementById("send-bal").textContent = this.formatToken(bal, 18, 6);
      } else if (token === "USDT") {
        bal = await usdtContract.balanceOf(currentAddress);
        document.getElementById("send-bal").textContent = this.formatToken(bal, usdtDecimals, 4);
      } else {
        bal = await ftaContract.balanceOf(currentAddress);
        document.getElementById("send-bal").textContent = this.formatToken(bal, ftaDecimals, 4);
      }
    } catch(e) {}
  },

  async executeSend() {
    if (!this.ensureConnected()) return;
    const token = document.getElementById("send-token-select").value;
    const toAddr = document.getElementById("send-to-address").value.trim();
    const amountRaw = document.getElementById("send-amount").value;

    if (!ethers.isAddress(toAddr)) { this.toast(this.t("invalidAddr"), "error"); return; }
    if (!amountRaw || Number(amountRaw) <= 0) { this.toast(this.t("invalidAmount"), "error"); return; }

    let txFn;
    if (token === "POL") {
      const amount = ethers.parseEther(amountRaw);
      txFn = () => signer.sendTransaction({ to: toAddr, value: amount });
    } else if (token === "USDT") {
      const amount = ethers.parseUnits(amountRaw, usdtDecimals);
      txFn = () => usdtContract.transfer(toAddr, amount);
    } else {
      const amount = ethers.parseUnits(amountRaw, ftaDecimals);
      txFn = () => ftaContract.transfer(toAddr, amount);
    }

    await this.safeTx(
      txFn,
      { loading: this.t("sending"), success: this.t("sentSuccess") },
      () => { this.refreshWallet(); this.closeModals(); }
    );
  },

  async copyReceiveAddress() {
    try {
      await navigator.clipboard.writeText(currentAddress);
      this.toast(this.t("addrCopied"), "success");
    } catch(e) {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = currentAddress;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      this.toast(this.t("addrCopied"), "success");
    }
  },

  async copyAddress() {
    this.copyReceiveAddress();
  },

  // ─── Chat Assistant ────────────────────────────────────────────
  toggleChat() {
    this.chatOpen = !this.chatOpen;
    document.getElementById("chat-panel").classList.toggle("active", this.chatOpen);
    if (this.chatOpen && document.getElementById("chat-messages").children.length === 0) {
      this.addChatBubble("assistant", this.t("welcome") + "\n\n" + i18n[this.lang]?.help?.a?.[this.lang] || "Posez-moi une question !");
    }
  },

  async sendChatMessage() {
    const input = document.getElementById("chat-input");
    const msg = input.value.trim();
    if (!msg) return;
    input.value = "";

    this.addChatBubble("user", msg);

    // Recherche dans la FAQ
    const lower = msg.toLowerCase();
    let answer = null;
    for (const rule of FAQ_RULES) {
      if (rule.kw.some(kw => lower.includes(kw))) {
        answer = rule.a[this.lang] || rule.a["en"] || rule.a["fr"];
        break;
      }
    }

    if (!answer) {
      // Réponses génériques
      if (lower.includes("bonjour") || lower.includes("hello") || lower.includes("hi") || lower.includes("salut")) {
        answer = {fr:"Bonjour ! 👋 Comment puis-je vous aider ?",en:"Hello! 👋 How can I help you?"}[this.lang] || "Hello!";
      } else if (lower.includes("merci") || lower.includes("thank")) {
        answer = {fr:"De rien ! 😊",en:"You're welcome! 😊"}[this.lang] || "You're welcome!";
      } else if (lower.includes("whatsapp") || lower.includes("groupe") || lower.includes("group")) {
        answer = `Rejoignez notre communauté :\n👥 ${CONFIG.WHATSAPP_GROUP}\n📢 ${CONFIG.WHATSAPP_CHANNEL}`;
      } else {
        answer = {fr:"Je ne suis pas sûr de comprendre. Essayez de demander sur :\n• Connexion\n• Machines\n• Batteries\n• Swap\n• Dépôt/Retrait\n• Parrainage\n• Gaz/Frais\n\nOu rejoignez notre WhatsApp pour de l'aide humaine !",en:"I'm not sure I understand. Try asking about:\n• Connection\n• Machines\n• Batteries\n• Swap\n• Deposit/Withdraw\n• Referral\n• Gas fees\n\nOr join our WhatsApp for human help!"}[this.lang] || "Try asking about: connection, machines, swap, deposit, referral...";
      }
    }

    // Simule un délai de frappe
    setTimeout(() => this.addChatBubble("assistant", answer), 500 + Math.random() * 500);
  },

  addChatBubble(role, text) {
    const container = document.getElementById("chat-messages");
    const div = document.createElement("div");
    div.className = "chat-bubble " + role;
    div.textContent = text;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  },

  // ─── Canvas Mining Visualizer ──────────────────────────────────
  initCanvas() {
    const canvas = document.getElementById("mining-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const resize = () => {
      canvas.width = canvas.offsetWidth * (window.devicePixelRatio || 1);
      canvas.height = canvas.offsetHeight * (window.devicePixelRatio || 1);
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    };
    resize();
    window.addEventListener("resize", resize);

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    // Particules
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * 400,
        y: Math.random() * 100,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 0.8,
        r: Math.random() * 2 + 0.5,
        a: Math.random(),
      });
    }

    const animate = () => {
      canvasAnimId = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, W(), H());

      // Fond
      const grad = ctx.createLinearGradient(0, 0, W(), H());
      grad.addColorStop(0, "#000000");
      grad.addColorStop(1, "#0a0a0a");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W(), H());

      const active = isConnected;
      const speed = active ? 1 : 0.1;
      const alpha = active ? 1 : 0.15;

      for (const p of particles) {
        p.x += p.vx * speed;
        p.y += p.vy * speed;
        if (p.x < 0 || p.x > W()) p.vx *= -1;
        if (p.y < 0 || p.y > H()) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(240, 185, 11, ${p.a * alpha})`;
        ctx.fill();

        // Lignes de connexion
        for (const q of particles) {
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 60) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(240, 185, 11, ${(1 - dist / 60) * 0.3 * alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    };
    animate();
  },

  // ─── Gestion d'erreurs transactionnelles ───────────────────────
  /**
   * Wrapper sécurisé pour toute transaction on-chain.
   * Gère : rejet utilisateur, gaz insuffisant, revert contrat, timeout, réseau, nonce.
   */
  async safeTx(txFn, opts = {}, onFinally) {
    const { loading = "Traitement...", success, error: errMsg } = opts;
    this.showLoader(loading);
    try {
      // 1. Estimer le gaz d'abord pour détecter les erreurs précocement
      let tx;
      try {
        tx = await txFn();
      } catch (preErr) {
        this.hideLoader();
        this.handleTxError(preErr, errMsg);
        return null;
      }

      // 2. Attendre la confirmation avec timeout (120s)
      const receipt = await Promise.race([
        tx.wait(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("TIMEOUT")), 120000)
        ),
      ]);

      // 3. Vérifier le statut
      if (receipt && receipt.status === 0) {
        throw new Error("REVERTED_ONCHAIN");
      }

      this.hideLoader();
      if (success) this.toast(success, "success");
      if (onFinally) await onFinally(receipt);
      return receipt;

    } catch (err) {
      this.hideLoader();
      this.handleTxError(err, errMsg);
      return null;
    }
  },

  /**
   * Analyse une erreur et affiche le message approprié dans la langue de l'utilisateur.
   */
  handleTxError(err, context) {
    const msg = (err.message || "").toLowerCase();
    const code = err.code;
    const data = err.data || err.info?.error?.data || err.error?.data;

    // — Utilisateur a annulé —
    if (code === "ACTION_REJECTED" || code === 4001 ||
        msg.includes("user rejected") || msg.includes("user denied") ||
        msg.includes("user cancelled") || msg.includes("popup closed")) {
      this.toast(this.t("errRejected"), "error");
      return;
    }

    // — Fonds insuffisants (gaz ou tokens) —
    if (msg.includes("insufficient funds") || code === "INSUFFICIENT_FUNDS" ||
        msg.includes("not enough balance") || msg.includes("exceeds the balance")) {
      this.toast(this.t("errInsufficientFunds"), "error");
      return;
    }

    // — Timeout —
    if (msg === "timeout" || msg.includes("timeout")) {
      this.toast(this.t("errTimeout"), "error");
      return;
    }

    // — Erreur réseau —
    if (code === "NETWORK_ERROR" || code === "SERVER_ERROR" ||
        msg.includes("network") || msg.includes("fetch failed") ||
        msg.includes("could not decode result") || msg.includes("could not coalesce error")) {
      this.toast(this.t("errNetwork"), "error");
      return;
    }

    // — Erreur de nonce —
    if (msg.includes("nonce") || msg.includes("replacement fee too low")) {
      this.toast(this.t("errNonce"), "error");
      return;
    }

    // — Transaction déjà en attente —
    if (msg.includes("pending") || msg.includes("already known")) {
      this.toast(this.t("errAlreadyPending"), "error");
      return;
    }

    // — Revert on-chain (statut 0) —
    if (msg.includes("reverted onchain")) {
      this.toast(this.t("errContract"), "error");
      return;
    }

    // — Tentative de décodage du motif de revert —
    const revertReason = this.decodeRevertReason(data || err.data);
    if (revertReason) {
      this.toast(`${this.t("error")}: ${revertReason}`, "error");
      return;
    }

    // — Erreurs spécifiques au contrat (mot-clés) —
    if (msg.includes("no machine") || msg.includes("invalid machine")) {
      this.toast(this.t("errNoMachine"), "error"); return;
    }
    if (msg.includes("already running") || msg.includes("already active")) {
      this.toast(this.t("errRunning"), "error"); return;
    }
    if (msg.includes("no battery") || msg.includes("not enough battery")) {
      this.toast(this.t("errNoBattery"), "error"); return;
    }
    if (msg.includes("max machine") || msg.includes("limit reached")) {
      this.toast(this.t("errMaxMachine"), "error"); return;
    }

    // — Execution reverted générique —
    if (msg.includes("execution reverted")) {
      this.toast(context || this.t("errContract"), "error");
      return;
    }

    // — Gaz imprévisible —
    if (code === "UNPREDICTABLE_GAS_LIMIT" || msg.includes("gas")) {
      this.toast(this.t("errContract"), "error");
      return;
    }

    // — Fallback —
    console.error("Unhandled TX error:", err);
    this.toast(context || errMsg || this.t("errGeneric"), "error");
  },

  /**
   * Tente de décoder un reason string depuis les données d'erreur d'un revert.
   */
  decodeRevertReason(data) {
    if (!data) return null;
    // Si c'est déjà une string
    if (typeof data === "string" && data.length > 0 && !data.startsWith("0x")) {
      return data.length < 200 ? data : null;
    }
    // Si c'est des bytes hex
    if (typeof data === "string" && data.startsWith("0x")) {
      try {
        // Le selector de Error(string) est 0x08c379a0
        if (data.startsWith("0x08c379a0")) {
          const abiCoder = new ethers.AbiCoder();
          const decoded = abiCoder.decode(["string"], "0x" + data.slice(10));
          return decoded[0];
        }
        // Custom error sans décodage connu
        return null;
      } catch (e) {
        return null;
      }
    }
    return null;
  },

  // ─── Utilitaires ───────────────────────────────────────────────
  ensureConnected() {
    if (!isConnected) {
      this.toast(this.t("connFirst"), "error");
      return false;
    }
    return true;
  },

  showLoader(text) {
    document.getElementById("loader-text").textContent = text || "Traitement...";
    document.getElementById("loader").classList.remove("hidden");
  },

  hideLoader() {
    document.getElementById("loader").classList.add("hidden");
  },

  toast(msg, type = "") {
    const container = document.getElementById("toast-container");
    const div = document.createElement("div");
    div.className = "toast" + (type ? " toast-" + type : "");
    div.textContent = msg;
    container.appendChild(div);
    setTimeout(() => { if (div.parentNode) div.parentNode.removeChild(div); }, 4200);
  },

  shortAddr(addr) {
    if (!addr) return "0x...";
    return addr.slice(0, 6) + "..." + addr.slice(-4);
  },

  formatToken(val, decimals, displayDecimals) {
    if (!val) return "0";
    const num = Number(ethers.formatUnits(val, decimals || 18));
    return num.toFixed(displayDecimals !== undefined ? displayDecimals : 4);
  },

  formatPower(power) {
    if (!power) return "0 H/s";
    const p = Number(power);
    if (p >= 1e9) return (p / 1e9).toFixed(2) + " GH/s";
    if (p >= 1e6) return (p / 1e6).toFixed(2) + " MH/s";
    if (p >= 1e3) return (p / 1e3).toFixed(2) + " KH/s";
    return p + " H/s";
  },
};

// ═══════════════════════════════════════════════════════════════════
//  DÉMARRAGE
// ═══════════════════════════════════════════════════════════════════
document.addEventListener("DOMContentLoaded", () => App.init());

// Fermer les modales en cliquant le fond
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal") && e.target.classList.contains("active")) {
    App.closeModals();
  }
});