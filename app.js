// ═══════════════════════════════════════════════════════════════════
//  FITIA PRO MINER V4.2 — app.js
//  - Authentification v2 : pseudo/email + mot de passe
//  - Wallet Polygon lié séparément
//  - Onglet Mon Compte (profil + historique)
//  - Toute la logique blockchain V3 préservée
// ═══════════════════════════════════════════════════════════════════

// ─── Configuration ─────────────────────────────────────────────────
const CONFIG = {
  CORE: "0x1b8EdFb91168Fb233F8CA7cf1631038AC193D743",
  MINE: "0xBd9FA9801eDA247b28B3BB9dDBf1CF52cA563Bc6",
  USDT: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
  FTA:  "0x5c418b12c7e9c2A8e9A71A68c6d9b319E7B1d1fd",
  CHAIN_ID: 137,
  WC_PROJECT_ID: "2c10ee910a836551fbabbf7c8cc4542a",
  WHATSAPP_GROUP: "https://chat.whatsapp.com/BDsvPCB6xp8H8X0YaRmPFP",
  WHATSAPP_CHANNEL: "https://whatsapp.com/channel/0029VbCQhI38PgsPLbBJdV1e",
  API_BASE: "https://fitia-dex-app-production.up.railway.app",
  // RPC fallbacks (Polygon)
  RPC_URLS: [
    "https://polygon-rpc.com",
    "https://rpc-mainnet.maticvigil.com",
    "https://polygon-mainnet.g.alchemy.com/v2/demo",
    "https://rpc.ankr.com/polygon"
  ]
};

// ─── Traductions i18n (5 langues, étendues v2) ────────────────────
const i18n = {
  en: {
    // Auth v2
    authLogin: "SIGN IN", authRegister: "REGISTER",
    authIdentifier: "Username or Email", authPassword: "Password",
    authLoginBtn: "SIGN IN", authRegisterBtn: "CREATE ACCOUNT",
    authEmail: "Email *", authConfirmPassword: "Confirm Password *",
    authAcceptTerms: "I accept the <a>Terms of Use</a> and <a>Privacy Policy</a>",
    authUsername: "Nickname *", authExistingAccount: "Welcome back!",
    authNewAccount: "Create your account",
    // Account
    accountEdit: "Edit", accountEditProfile: "Edit Profile",
    accountSave: "SAVE", accountChangePassword: "Change Password",
    accountCurrentPassword: "Current Password", accountNewPassword: "New Password",
    accountUpdatePassword: "UPDATE PASSWORD",
    accountLogout: "Sign Out", accountLinkWallet: "Link / Change Wallet",
    walletNotLinked: "Wallet not linked. Connect to use blockchain features.",
    connectWalletBtn: "Connect Wallet",
    // App (existing)
    connect: "Connect", refTitle: "👥 Referral System", refDesc: "Enter referrer address or ID to link.", bindRef: "BIND",
    power: "POWER", ftaSec: "Hashrate", pending: "PENDING", fta: "FTA", miningActive: "MINING ACTIVE", noMachine: "NO MACHINE", claim: "CLAIM",
    shopTitle: "⛏️ Shop", machines: "Machines", batteries: "Batteries", buy: "BUY",
    myAssets: "⚙️ Wallet & Assets", walletBal: "💰 Balances", plugMachine: "🔌 Plug in a machine", plugDesc: "Select a machine index and battery type.",
    machineId: "Machine Index (0, 1...)", plug: "PLUG IN ⚡",
    swapTitle: "💱 Swap", youPay: "You pay", balance: "Balance:", youReceive: "You receive", swap: "SWAP",
    loading: "Loading...", currentRate: "1 FTA = ",
    home: "Home", shop: "Shop", assets: "Wallet", swapNav: "Swap", historyNav: "History",
    historyTitle: "📜 History", historyAllTypes: "All types", historyLoading: "Loading history...",
    connWallet: "Connecting...", errConn: "Connection Error",
    linking: "Linking...", refLinked: "Referrer linked!", connFirst: "Connect first",
    enterRefAddr: "Referrer address or ID (0x...)", enterRefId: "Referrer ID (number)",
    buyingMachine: "Buying Machine", buyingBattery: "Buying Battery",
    confirming: "Confirming...", calcFta: "Calculating price...",
    machineBought: "Machine purchased!", batteryBought: "Battery purchased!",
    invalidId: "Invalid Machine Index", pluggingIn: "Plugging in...", pluggedIn: "Machine plugged in! ⚡",
    invalidAmount: "Invalid amount", swapping: "Swapping...", swapSuccess: "Swap successful!",
    claiming: "Claiming...", claimed: "Rewards claimed!",
    error: "Error", days: "Days", rig: "RIG",
    totalBal: "Total Balance", activeMachines: "⛏️ Active Machines",
    myMachines: "⛏️ My Machines", myBatteries: "🔋 My Batteries",
    active: "Active", expired: "Expired", inactive: "Inactive", available: "Available",
    plugged: "Plugged", notPlugged: "Not Plugged", timeRemaining: "Remaining",
    noMachines: "No machines yet", noBatteries: "No batteries yet",
    batteryLabel: "Battery", usdtPerFta: " USDT", noActiveMachines: "No active machines",
    exchangeRate: "Exchange Rate", priceImpact: "Price Impact",
    swapFee: "Swap Fee (4%)", minimumReceived: "Minimum Received",
    slippageTolerance: "Slippage Tolerance", networkFee: "Network Fee",
    depositBtn: "DEPOSIT", withdrawBtn: "WITHDRAW", depositing: "Depositing...", depositSuccess: "Deposit successful!", withdrawing: "Withdrawing...", withdrawSuccess: "Withdrawal successful!",
    send: "Send", receive: "Receive", sending: "Sending...", sentSuccess: "Sent successfully!", addrCopied: "Address copied!", confirmSend: "CONFIRM SEND", invalidAddr: "Invalid address", recipientAddr: "Recipient address (0x...)", amount: "Amount",
    errRejected: "Transaction cancelled", errInsufficientFunds: "Insufficient balance",
    errNetwork: "Network error. Please try again.", errTimeout: "Transaction timed out.",
    errContract: "Transaction failed. Please try again.", errGeneric: "An error occurred.",
    errAlreadyPending: "Transaction pending. Please wait.", errNonce: "Nonce error. Restart the app.",
    errNoMachine: "No machine", errRunning: "Machine already running",
    errNoBattery: "No battery of this type", errMaxMachine: "Max machines reached",
    logout: "↪",
    txBuyMachine: "Buy Machine", txBuyBattery: "Buy Battery", txDeposit: "Deposit", txWithdraw: "Withdraw",
    txClaim: "Claim", txSwap: "Swap", txPlug: "Plug", txReferral: "Referral", txSend: "Send", txReceive: "Receive",
    prev: "← Previous", next: "Next →",
    authDisconnect: "Disconnect",
  },
  fr: {
    // Auth v2
    authLogin: "CONNEXION", authRegister: "INSCRIPTION",
    authIdentifier: "Pseudo ou Email", authPassword: "Mot de passe",
    authLoginBtn: "SE CONNECTER", authRegisterBtn: "CRÉER MON COMPTE",
    authEmail: "Email *", authConfirmPassword: "Confirmer le mot de passe *",
    authAcceptTerms: "J'accepte les <a>Conditions d'utilisation</a> et la <a>Politique de confidentialité</a>",
    authUsername: "Pseudo *", authExistingAccount: "Bon retour !",
    authNewAccount: "Créez votre compte",
    // Account
    accountEdit: "Modifier", accountEditProfile: "Modifier le profil",
    accountSave: "ENREGISTRER", accountChangePassword: "Changer le mot de passe",
    accountCurrentPassword: "Mot de passe actuel", accountNewPassword: "Nouveau mot de passe",
    accountUpdatePassword: "METTRE À JOUR",
    accountLogout: "Déconnexion", accountLinkWallet: "Lier / Changer Wallet",
    walletNotLinked: "Wallet non lié. Connectez pour utiliser les fonctionnalités blockchain.",
    connectWalletBtn: "Connecter Wallet",
    // App (existing)
    connect: "Connecter", refTitle: "👥 Parrainage", refDesc: "Entrez l'adresse ou l'ID du parrain.", bindRef: "LIER",
    power: "PUISSANCE", ftaSec: "Hashrate", pending: "EN ATTENTE", fta: "FTA", miningActive: "MINAGE ACTIF", noMachine: "AUCUNE MACHINE", claim: "RÉCLAMER",
    shopTitle: "⛏️ Boutique", machines: "Machines", batteries: "Batteries", buy: "ACHETER",
    myAssets: "⚙️ Wallet & Actifs", walletBal: "💰 Soldes", plugMachine: "🔌 Brancher une machine", plugDesc: "Choisissez l'index d'une machine et le type de batterie.",
    machineId: "Index Machine (0, 1...)", plug: "BRANCHER ⚡",
    swapTitle: "💱 Échange", youPay: "Vous payez", balance: "Solde:", youReceive: "Vous recevez", swap: "ÉCHANGER",
    loading: "Chargement...", currentRate: "1 FTA = ",
    home: "Accueil", shop: "Boutique", assets: "Wallet", swapNav: "Swap", historyNav: "Historique",
    historyTitle: "📜 Historique", historyAllTypes: "Tous les types", historyLoading: "Chargement de l'historique...",
    connWallet: "Connexion...", errConn: "Erreur connexion",
    linking: "Liaison...", refLinked: "Parrain lié!", connFirst: "Connectez-vous d'abord",
    enterRefAddr: "Adresse ou ID parrain (0x...)", enterRefId: "ID Parrain (nombre)",
    buyingMachine: "Achat Machine", buyingBattery: "Achat Batterie",
    confirming: "Confirmation...", calcFta: "Calcul du prix...",
    machineBought: "Machine achetée!", batteryBought: "Batterie achetée!",
    invalidId: "Index Machine invalide", pluggingIn: "Branchement...", pluggedIn: "Machine branchée! ⚡",
    invalidAmount: "Montant invalide", swapping: "Échange...", swapSuccess: "Échange réussi!",
    claiming: "Récupération...", claimed: "Gains réclamés!",
    error: "Erreur", days: "Jours", rig: "RIG",
    totalBal: "Solde Total", activeMachines: "⛏️ Machines Actives",
    myMachines: "⛏️ Mes Machines", myBatteries: "🔋 Mes Batteries",
    active: "Actif", expired: "Expiré", inactive: "Inactif", available: "Disponible",
    plugged: "Branché", notPlugged: "Non branché", timeRemaining: "Restant",
    noMachines: "Aucune machine", noBatteries: "Aucune batterie",
    batteryLabel: "Batterie", usdtPerFta: " USDT", noActiveMachines: "Aucune machine active",
    exchangeRate: "Taux de change", priceImpact: "Impact prix",
    swapFee: "Frais swap (4%)", minimumReceived: "Minimum reçu",
    slippageTolerance: "Tolérance slippage", networkFee: "Frais réseau",
    depositBtn: "DÉPOSER", withdrawBtn: "RETIRER", depositing: "Dépôt...", depositSuccess: "Dépôt réussi!", withdrawing: "Retrait...", withdrawSuccess: "Retrait réussi!",
    send: "Envoyer", receive: "Recevoir", sending: "Envoi...", sentSuccess: "Envoi réussi!", addrCopied: "Adresse copiée!", confirmSend: "CONFIRMER L'ENVOI", invalidAddr: "Adresse invalide", recipientAddr: "Adresse destinataire (0x...)", amount: "Montant",
    errRejected: "Transaction annulée", errInsufficientFunds: "Solde insuffisant",
    errNetwork: "Erreur réseau. Réessayez.", errTimeout: "Délai expiré.",
    errContract: "Transaction échouée. Réessayez.", errGeneric: "Une erreur est survenue.",
    errAlreadyPending: "Transaction en cours. Patientez.", errNonce: "Erreur nonce. Redémarrez l'app.",
    errNoMachine: "Aucune machine", errRunning: "Machine déjà en marche",
    errNoBattery: "Pas de batterie de ce type", errMaxMachine: "Maximum de machines atteint",
    logout: "↪",
    txBuyMachine: "Achat Machine", txBuyBattery: "Achat Batterie", txDeposit: "Dépôt", txWithdraw: "Retrait",
    txClaim: "Claim", txSwap: "Swap", txPlug: "Branchement", txReferral: "Parrainage", txSend: "Envoi", txReceive: "Réception",
    prev: "← Précédent", next: "Suivant →",
    authDisconnect: "Déconnecter",
  },
  de: {
    authLogin: "ANMELDEN", authRegister: "REGISTRIEREN",
    authIdentifier: "Benutzername oder Email", authPassword: "Passwort",
    authLoginBtn: "ANMELDEN", authRegisterBtn: "KONTO ERSTELLEN",
    authEmail: "Email *", authConfirmPassword: "Passwort bestätigen *",
    authAcceptTerms: "Ich akzeptiere die <a>Nutzungsbedingungen</a> und <a>Datenschutzrichtlinie</a>",
    authUsername: "Spitzname *",
    accountEdit: "Bearbeiten", accountEditProfile: "Profil bearbeiten",
    accountSave: "SPEICHERN", accountChangePassword: "Passwort ändern",
    accountCurrentPassword: "Aktuelles Passwort", accountNewPassword: "Neues Passwort",
    accountUpdatePassword: "PASSWORT AKTUALISIEREN",
    accountLogout: "Abmelden", accountLinkWallet: "Wallet verknüpfen / ändern",
    walletNotLinked: "Wallet nicht verknüpft. Verbinden für Blockchain-Funktionen.",
    connectWalletBtn: "Wallet verbinden",
    connect: "Verbinden", refTitle: "👥 Empfehlung", refDesc: "Empfehler-Adresse oder ID eingeben.", bindRef: "BINDEN",
    power: "LEISTUNG", ftaSec: "Hashrate", pending: "AUSSTEHEND", fta: "FTA", miningActive: "MINING AKTIV", noMachine: "KEINE MASCHINE", claim: "EINFORDERN",
    shopTitle: "⛏️ Shop", machines: "Maschinen", batteries: "Batterien", buy: "KAUFEN",
    myAssets: "⚙️ Wallet & Assets", walletBal: "💰 Guthaben", plugMachine: "🔌 Maschine anschließen", plugDesc: "Wähle Maschinen-Index und Batterietyp.",
    machineId: "Maschinen-Index (0, 1...)", plug: "ANSCHLIESSEN ⚡",
    swapTitle: "💱 Tausch", youPay: "Sie zahlen", balance: "Guthaben:", youReceive: "Sie erhalten", swap: "TAUSCHEN",
    loading: "Laden...", currentRate: "1 FTA = ",
    home: "Home", shop: "Shop", assets: "Wallet", swapNav: "Swap", historyNav: "Verlauf",
    historyTitle: "📜 Verlauf", historyAllTypes: "Alle Typen", historyLoading: "Lade Verlauf...",
    connWallet: "Verbindung...", errConn: "Verbindungsfehler",
    linking: "Verknüpfung...", refLinked: "Empfehler verknüpft!", connFirst: "Zuerst verbinden",
    enterRefAddr: "Empfehler-Adresse oder ID (0x...)", enterRefId: "Empfehler-ID (Zahl)",
    buyingMachine: "Kaufe Maschine", buyingBattery: "Kaufe Batterie",
    confirming: "Bestätigung...", calcFta: "Preis berechnen...",
    machineBought: "Maschine gekauft!", batteryBought: "Batterie gekauft!",
    invalidId: "Ungültiger Index", pluggingIn: "Anschließen...", pluggedIn: "Angeschlossen! ⚡",
    invalidAmount: "Ungültiger Betrag", swapping: "Tauschen...", swapSuccess: "Tausch erfolgreich!",
    claiming: "Einforderung...", claimed: "Eingefordert!",
    error: "Fehler", days: "Tage", rig: "RIG",
    totalBal: "Gesamtguthaben", activeMachines: "⛏️ Aktive Maschinen",
    myMachines: "⛏️ Meine Maschinen", myBatteries: "🔋 Meine Batterien",
    active: "Aktiv", expired: "Abgelaufen", inactive: "Inaktiv", available: "Verfügbar",
    plugged: "Angeschlossen", notPlugged: "Nicht angeschlossen", timeRemaining: "Verbleibend",
    noMachines: "Keine Maschinen", noBatteries: "Keine Batterien",
    batteryLabel: "Batterie", usdtPerFta: " USDT", noActiveMachines: "Keine aktive Maschinen",
    exchangeRate: "Wechselkurs", priceImpact: "Preisauswirkung",
    swapFee: "Swapgebühr (4%)", minimumReceived: "Mindestbetrag",
    slippageTolerance: "Slippage-Toleranz", networkFee: "Netzwerkgebühr",
    depositBtn: "EINZAHLEN", depositing: "Einzahlung...", depositSuccess: "Einzahlung erfolgreich!",
    errRejected: "Transaktion abgebrochen", errInsufficientFunds: "Unzureichendes Guthaben",
    errNetwork: "Netzwerkfehler.", errTimeout: "Zeitüberschreitung.",
    errContract: "Transaktion fehlgeschlagen.", errGeneric: "Ein Fehler ist aufgetreten.",
    errAlreadyPending: "Transaktion ausstehend.", errNonce: "Nonce-Fehler. App neustarten.",
    errNoMachine: "Keine Maschine", errRunning: "Maschine läuft bereits",
    errNoBattery: "Keine Batterie dieses Typs", errMaxMachine: "Maximale Maschinen erreicht",
    logout: "↪",
    txBuyMachine: "Maschine kaufen", txBuyBattery: "Batterie kaufen", txDeposit: "Einzahlung", txWithdraw: "Auszahlung",
    txClaim: "Claim", txSwap: "Tausch", txPlug: "Anschluss", txReferral: "Empfehlung", txSend: "Senden", txReceive: "Empfang",
    prev: "← Zurück", next: "Weiter →",
    authDisconnect: "Trennen",
  },
  zh: {
    authLogin: "登录", authRegister: "注册",
    authIdentifier: "用户名或邮箱", authPassword: "密码",
    authLoginBtn: "登录", authRegisterBtn: "创建账户",
    authEmail: "邮箱 *", authConfirmPassword: "确认密码 *",
    authAcceptTerms: "我接受<a>使用条款</a>和<a>隐私政策</a>",
    authUsername: "昵称 *",
    accountEdit: "编辑", accountEditProfile: "编辑资料",
    accountSave: "保存", accountChangePassword: "修改密码",
    accountCurrentPassword: "当前密码", accountNewPassword: "新密码",
    accountUpdatePassword: "更新密码",
    accountLogout: "退出登录", accountLinkWallet: "链接/更换钱包",
    walletNotLinked: "钱包未链接。请连接以使用区块链功能。",
    connectWalletBtn: "连接钱包",
    connect: "连接", refTitle: "👥 推荐系统", refDesc: "输入推荐人地址或ID进行绑定。", bindRef: "绑定",
    power: "算力", ftaSec: "Hashrate", pending: "待领取", fta: "FTA", miningActive: "挖矿中", noMachine: "无机器", claim: "领取",
    shopTitle: "⛏️ 商店", machines: "矿机", batteries: "电池", buy: "购买",
    myAssets: "⚙️ 钱包与资产", walletBal: "💰 余额", plugMachine: "🔌 插入机器", plugDesc: "选择机器索引和电池类型。",
    machineId: "机器索引 (0, 1...)", plug: "插入 ⚡",
    swapTitle: "💱 兑换", youPay: "您支付", balance: "余额:", youReceive: "您收到", swap: "兑换",
    loading: "加载中...", currentRate: "1 FTA = ",
    home: "首页", shop: "商店", assets: "钱包", swapNav: "兑换", historyNav: "历史",
    historyTitle: "📜 历史", historyAllTypes: "全部类型", historyLoading: "加载历史...",
    connWallet: "连接中...", errConn: "连接错误",
    linking: "绑定中...", refLinked: "推荐人绑定成功!", connFirst: "请先连接",
    enterRefAddr: "推荐人地址或ID (0x...)", enterRefId: "推荐人ID (数字)",
    buyingMachine: "购买矿机", buyingBattery: "购买电池",
    confirming: "确认中...", calcFta: "计算价格...",
    machineBought: "矿机购买成功!", batteryBought: "电池购买成功!",
    invalidId: "无效索引", pluggingIn: "插入中...", pluggedIn: "插入成功! ⚡",
    invalidAmount: "无效金额", swapping: "兑换中...", swapSuccess: "兑换成功!",
    claiming: "领取中...", claimed: "奖励已领取!",
    error: "错误", days: "天", rig: "矿机",
    totalBal: "总余额", activeMachines: "⛏️ 运行中矿机",
    myMachines: "⛏️ 我的矿机", myBatteries: "🔋 我的电池",
    active: "运行中", expired: "已过期", inactive: "未激活", available: "可用",
    plugged: "已插入", notPlugged: "未插入", timeRemaining: "剩余",
    noMachines: "暂无矿机", noBatteries: "暂无电池",
    batteryLabel: "电池", usdtPerFta: " USDT", noActiveMachines: "无运行中矿机",
    exchangeRate: "汇率", priceImpact: "价格影响",
    swapFee: "手续费 (4%)", minimumReceived: "最低收到",
    slippageTolerance: "滑点容忍度", networkFee: "网络费",
    depositBtn: "存入", depositing: "存入中...", depositSuccess: "存入成功!",
    errRejected: "交易已取消", errInsufficientFunds: "余额不足",
    errNetwork: "网络错误，请重试。", errTimeout: "交易超时。",
    errContract: "交易失败，请重试。", errGeneric: "发生错误。",
    errAlreadyPending: "交易待处理。", errNonce: "Nonce错误，请重启应用。",
    errNoMachine: "没有矿机", errRunning: "矿机已在运行",
    errNoBattery: "没有此类型电池", errMaxMachine: "矿机数量已达上限",
    logout: "↪",
    txBuyMachine: "购买矿机", txBuyBattery: "购买电池", txDeposit: "存入", txWithdraw: "提取",
    txClaim: "领取", txSwap: "兑换", txPlug: "插入", txReferral: "推荐", txSend: "发送", txReceive: "接收",
    prev: "← 上一页", next: "下一页 →",
    authDisconnect: "断开连接",
  },
  sg: {
    authLogin: "SIGN IN", authRegister: "REGISTER",
    authIdentifier: "Username or Email", authPassword: "Password",
    authLoginBtn: "SIGN IN", authRegisterBtn: "CREATE ACCOUNT",
    authEmail: "Email *", authConfirmPassword: "Confirm Password *",
    authAcceptTerms: "I accept the <a>Terms of Use</a> and <a>Privacy Policy</a>",
    authUsername: "Nickname *",
    accountEdit: "Edit", accountEditProfile: "Edit Profile",
    accountSave: "SAVE", accountChangePassword: "Change Password",
    accountCurrentPassword: "Current Password", accountNewPassword: "New Password",
    accountUpdatePassword: "UPDATE PASSWORD",
    accountLogout: "Sign Out", accountLinkWallet: "Link / Change Wallet",
    walletNotLinked: "Wallet not linked. Connect to use blockchain features.",
    connectWalletBtn: "Connect Wallet",
    connect: "Connect", refTitle: "👥 Referral System", refDesc: "Enter referrer address or ID to link.", bindRef: "BIND",
    power: "POWER", ftaSec: "Hashrate", pending: "PENDING", fta: "FTA", miningActive: "MINING ACTIVE", noMachine: "NO MACHINE", claim: "CLAIM",
    shopTitle: "⛏️ Shop", machines: "Machines", batteries: "Batteries", buy: "BUY",
    myAssets: "⚙️ Wallet & Assets", walletBal: "💰 Balances", plugMachine: "🔌 Plug in a machine", plugDesc: "Select a machine index and battery type.",
    machineId: "Machine Index (0, 1...)", plug: "PLUG IN ⚡",
    swapTitle: "💱 Swap", youPay: "You pay", balance: "Balance:", youReceive: "You receive", swap: "SWAP",
    loading: "Loading...", currentRate: "1 FTA = ",
    home: "Home", shop: "Shop", assets: "Wallet", swapNav: "Swap", historyNav: "History",
    historyTitle: "📜 History", historyAllTypes: "All types", historyLoading: "Loading history...",
    connWallet: "Connecting...", errConn: "Connection Error",
    linking: "Linking...", refLinked: "Referrer linked!", connFirst: "Connect first",
    enterRefAddr: "Referrer address or ID (0x...)", enterRefId: "Referrer ID (number)",
    buyingMachine: "Buying Machine", buyingBattery: "Buying Battery",
    confirming: "Confirming...", calcFta: "Calculating price...",
    machineBought: "Machine purchased!", batteryBought: "Battery purchased!",
    invalidId: "Invalid Machine Index", pluggingIn: "Plugging in...", pluggedIn: "Machine plugged in! ⚡",
    invalidAmount: "Invalid amount", swapping: "Swapping...", swapSuccess: "Swap successful!",
    claiming: "Claiming...", claimed: "Rewards claimed!",
    error: "Error", days: "Days", rig: "RIG",
    totalBal: "Total Balance", activeMachines: "⛏️ Active Machines",
    myMachines: "⛏️ My Machines", myBatteries: "🔋 My Batteries",
    active: "Active", expired: "Expired", inactive: "Inactive", available: "Available",
    plugged: "Plugged", notPlugged: "Not Plugged", timeRemaining: "Remaining",
    noMachines: "No machines yet", noBatteries: "No batteries yet",
    batteryLabel: "Battery", usdtPerFta: " USDT", noActiveMachines: "No active machines",
    exchangeRate: "Exchange Rate", priceImpact: "Price Impact",
    swapFee: "Swap Fee (4%)", minimumReceived: "Minimum Received",
    slippageTolerance: "Slippage Tolerance", networkFee: "Network Fee",
    depositBtn: "DEPOSIT", depositing: "Depositing...", depositSuccess: "Deposit successful!",
    errRejected: "Transaction cancelled", errInsufficientFunds: "Insufficient balance",
    errNetwork: "Network error. Please try again.", errTimeout: "Transaction timed out.",
    errContract: "Transaction failed.", errGeneric: "An error occurred.",
    errAlreadyPending: "Transaction pending.", errNonce: "Nonce error. Restart app.",
    errNoMachine: "No machine", errRunning: "Machine already running",
    errNoBattery: "No battery of this type", errMaxMachine: "Max machines reached",
    logout: "↪",
    txBuyMachine: "Buy Machine", txBuyBattery: "Buy Battery", txDeposit: "Deposit", txWithdraw: "Withdraw",
    txClaim: "Claim", txSwap: "Swap", txPlug: "Plug", txReferral: "Referral", txSend: "Send", txReceive: "Receive",
    prev: "← Previous", next: "Next →",
    authDisconnect: "Disconnect",
  }
};

// ─── ABIs des contrats V3 ──────────────────────────────────────────
const CORE_ABI = [
  "function usdt() view returns (address)", "function fta() view returns (address)",
  "function myInfo() view returns (uint256, uint256, uint256, uint256)",
  "function depositUsdt(uint256 a)", "function depositFta(uint256 a)", "function depositPol() payable",
  "function withdrawUsdt(uint256 a)", "function withdrawFta(uint256 a)", "function withdrawPol(uint256 a)",
  "function setReferrer(address r)", "function setReferrerById(uint256 rid)",
  "function rate() view returns (uint256)", "function swapUForF(uint256 a, uint256 m, uint256 d)",
  "function swapFForU(uint256 a, uint256 m, uint256 d)",
  "function buyFta(uint256 a) view returns (uint256)", "function sellFta(uint256 a) view returns (uint256)",
  "function costFta(uint256 a) view returns (uint256)", "function swapFee() view returns (uint256)",
  "function difficulty() view returns (uint256)", "function uid(address) view returns (uint256)",
  "function aToId(uint256) view returns (address)", "function uBal(address) view returns (uint256)",
  "function fBal(address) view returns (uint256)", "function pol(address) view returns (uint256)"
];

const MINE_ABI = [
  "function buyMachine(uint256 t)", "function buyMachineFTA(uint256 t)",
  "function buyBattery(uint256 t)", "function buyBatteryFTA(uint256 t)",
  "function plugInMachine(uint256 mi, uint256 bi)", "function claimRewards()",
  "function powerOf(address u) view returns (uint256)", "function mCount() view returns (uint256)",
  "function bCount() view returns (uint256)",
  "function getMType(uint256) view returns (uint256 price, uint256 power, uint256 shopExpiry)",
  "function getBType(uint256) view returns (uint256 price, uint256 dur)",
  "function myMachines(address u) view returns (tuple(uint256 tid, uint256 exp)[])",
  "function myBattery(address u, uint256 t) view returns (uint256)",
  "function myInfo(address u) view returns (uint256 mc, uint256 ap, uint256 lc)"
];

// ─── Constantes ────────────────────────────────────────────────────
const SWAP_FEE_RATE = 0.04;
const SLIPPAGE = 0.005;

// ═══════════════════════════════════════════════════════════════════
//  CLASSE PRINCIPALE : Application V4.2
// ═══════════════════════════════════════════════════════════════════
class Application {
  constructor() {
    // ─── Fournisseur blockchain ───
    this.provider = null;
    this.signer = null;
    this.user = null; // Adresse Polygon

    // ─── Contrats ───
    this.core = null;
    this.mine = null;

    // ─── Authentification v2 ───
    this.authToken = null;
    this.profile = null; // { id, username, email, address }

    // ─── Mode de paiement ───
    this.payMode = 'USDT';
    this.shopViewMode = 'machines';
    this.swapDirection = 'USDT_TO_FTA';

    // ─── Décimales des tokens ───
    this.usdtDecimals = 6;
    this.ftaDecimals = 8;

    // ─── Données en cache ───
    this.polPriceUsd = 0;
    this.ftaPriceUsd = 0;
    this.currentRealPower = 0;
    this.pendingBalance = 0;
    this.shopMachinesData = [];
    this.shopBatteriesData = [];
    this.isLoadingShop = false;
    this.userMachines = [];
    this.batteryInventory = {};
    this.batteryTypeDurations = {};
    this.miningTimer = null;
    this.lastClaimTimestamp = 0;
    this.storageKey = "fitia_v4_last_claim";
    this.vizContext = null;
    this.vizBars = [];

    // ─── Historique ───
    this.historyPage = 0;
    this.historyTotal = 0;
    this.historyLimit = 20;
    this.historyFilter = '';

    // ─── Langue ───
    const savedLang = localStorage.getItem('fitia_lang');
    this.currentLang = savedLang && i18n[savedLang] ? savedLang : 'fr';

    // ─── Chat assistant ───
    this.chatInitialized = false;
    this.chatHistory = [];
    this.prevPriceCheckpoint = {};
    this.priceCheckpointTime = 0;
    
    // Compteur d'erreurs blockchain (une seule notification)
    this._blockchainErrorCount = 0;
    this._rpcIndex = 0; // Index RPC actif
  }

  // ─── Traduction ──────────────────────────────────────────────────
  t(key) { return i18n[this.currentLang]?.[key] || i18n['en'][key] || key; }

  // ─── Formatage ───────────────────────────────────────────────────
  formatUsd(v) {
    if (isNaN(v) || v === null) return '$0.00';
    return '$' + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  formatHashrate(h) {
    if (h <= 0) return '0 H/s';
    const units = ['nH/s', 'µH/s', 'mH/s', 'H/s', 'KH/s', 'MH/s', 'GH/s', 'TH/s', 'PH/s'];
    let value = h, unitIndex = 3;
    while (value < 1 && unitIndex > 0) { value *= 1000; unitIndex--; }
    while (value >= 1000 && unitIndex < units.length - 1) { value /= 1000; unitIndex++; }
    return value.toFixed(2) + ' ' + units[unitIndex];
  }

  formatTimeRemaining(s) {
    if (s <= 0) return this.t('expired');
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60);
    if (d > 1) return `${d}j ${h}h`;
    if (d === 1) return `1j ${h}h`;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  }

  getBatteryDuration(typeId) {
    if (this.batteryTypeDurations[typeId] !== undefined) return this.batteryTypeDurations[typeId];
    const fallback = { 0: 3, 1: 7, 2: 15, 3: 30, 4: 90, 5: 180, 6: 270, 7: 365 };
    return fallback[typeId] || 30;
  }

  // ═══ API Backend v2 (avec token auth) ═══════════════════════════

  /** Appel générique à l'API backend */
  async apiCall(endpoint, method = 'GET', body = null) {
    const opts = { method, headers: { 'Content-Type': 'application/json' } };
    if (this.authToken) {
      opts.headers['Authorization'] = `Bearer ${this.authToken}`;
    }
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(`${CONFIG.API_BASE}${endpoint}`, opts);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur API');
    return data;
  }

  // ═══ AUTHENTIFICATION v2 ════════════════════════════════════════

  /** Bascule entre les onglets connexion/inscription */
  switchAuthTab(tab) {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    
    if (tab === 'login') {
      document.querySelector('.auth-tab:first-child').classList.add('active');
      document.getElementById('auth-form-login').classList.add('active');
    } else {
      document.querySelector('.auth-tab:last-child').classList.add('active');
      document.getElementById('auth-form-register').classList.add('active');
    }
  }

  /** Inscription */
  async register() {
    const username = document.getElementById('reg-username').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const passwordConfirm = document.getElementById('reg-password-confirm').value;
    const acceptTerms = document.getElementById('reg-accept-terms').checked;

    // ─── Validation ────────────────────────────────────────────────
    if (!username || username.length < 3) return this.showToast('Pseudo : 3 caractères minimum', true);
    if (!email) return this.showToast('Email requis', true);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return this.showToast('Format d\'email invalide', true);
    if (!password || password.length < 6) return this.showToast('Mot de passe : 6 caractères minimum', true);
    if (password !== passwordConfirm) return this.showToast('Les mots de passe ne correspondent pas', true);
    if (!acceptTerms) return this.showToast('Vous devez accepter les conditions d\'utilisation', true);

    this.setLoader(true, 'Inscription en cours...');
    try {
      const data = await this.apiCall('/api/auth/register', 'POST', {
        username, email, password, accept_terms: true
      });

      this.authToken = data.token;
      this.profile = data.user;
      localStorage.setItem('fitia_auth_token', data.token);
      localStorage.setItem('fitia_profile', JSON.stringify(data.user));

      this.showToast('✅ Compte créé avec succès !');
      await this.enterApp();
    } catch (e) {
      this.showToast(e.message, true);
      this.setLoader(false);
    }
  }

  /** Connexion */
  async login() {
    const identifier = document.getElementById('login-identifier').value.trim();
    const password = document.getElementById('login-password').value;

    if (!identifier) return this.showToast('Pseudo ou email requis', true);
    if (!password) return this.showToast('Mot de passe requis', true);

    this.setLoader(true, 'Connexion...');
    try {
      const data = await this.apiCall('/api/auth/login', 'POST', { identifier, password });

      this.authToken = data.token;
      this.profile = data.user;
      localStorage.setItem('fitia_auth_token', data.token);
      localStorage.setItem('fitia_profile', JSON.stringify(data.user));

      this.showToast('✅ Connecté !');
      await this.enterApp();
    } catch (e) {
      this.showToast(e.message, true);
      this.setLoader(false);
    }
  }

  /** Déconnexion complète */
  logout() {
    this.stopMiningCounter();
    if (this._updateInterval) { clearInterval(this._updateInterval); this._updateInterval = null; }
    this.authToken = null;
    this.profile = null;
    this.user = null;
    this.signer = null;
    this.provider = null;
    this.core = null;
    this.mine = null;
    localStorage.removeItem('fitia_auth_token');
    localStorage.removeItem('fitia_profile');
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem('fitia_connected_address');

    document.getElementById('app-screen').classList.add('hidden');
    document.getElementById('auth-screen').classList.remove('hidden');
    document.getElementById('auth-form-login').classList.add('active');
    document.getElementById('auth-form-register').classList.remove('active');
    document.querySelector('.auth-tab:first-child').classList.add('active');
    document.querySelector('.auth-tab:last-child').classList.remove('active');

    // Réinitialiser les champs
    document.getElementById('login-identifier').value = '';
    document.getElementById('login-password').value = '';
    document.getElementById('reg-username').value = '';
    document.getElementById('reg-email').value = '';
    document.getElementById('reg-password').value = '';
    document.getElementById('reg-password-confirm').value = '';
    document.getElementById('reg-accept-terms').checked = false;

    this.showToast("Déconnecté");
  }

  /** Entrée dans l'application principale */
  async enterApp() {
    document.getElementById('auth-screen').classList.add('hidden');
    document.getElementById('app-screen').classList.remove('hidden');

    // Afficher le pseudo dans le header
    document.getElementById('addr-display').innerText = this.profile.username;
    document.getElementById('account-username').innerText = this.profile.username;
    document.getElementById('account-email').innerText = this.profile.email;
    document.getElementById('account-uid').innerText = 'ID: ' + (this.profile.id || '—');
    document.getElementById('account-avatar').innerText = this.profile.username.charAt(0).toUpperCase();
    
    // Mettre à jour l'UI wallet
    this.updateWalletUI();

    // Tenter de connecter le wallet silencieusement (si déjà lié)
    const walletOk = this.profile.address ? await this.connectWalletSilent() : false;

    // Initialiser le visualiseur (marche sans wallet)
    this.initVisualizer();
    window.addEventListener('resize', () => this.resizeCanvas());
    
    // Initialiser la blockchain UNIQUEMENT si le wallet est vraiment connecté
    if (walletOk && this.user) {
      await this.cacheBatteryDurations();
      if (this._updateInterval) clearInterval(this._updateInterval);
      this._updateInterval = setInterval(() => this.updateData(), 15000);
      await this.fetchMarketPrices();
      await this.updateData();
      console.log('✅ Blockchain initialisée — wallet connecté:', this.user.slice(0,10)+'...');
    } else if (this.profile.address) {
      console.log('⚠️ Wallet lié mais non connecté (MetaMask absent ou verrouillé)');
    }

    this.setLoader(false);
  }

  /** Mettre à jour l'affichage wallet (lié ou non) */
  updateWalletUI() {
    const banner = document.getElementById('wallet-connect-banner');
    const actions = document.getElementById('wallet-actions-section');
    const walletAddr = document.getElementById('account-wallet-addr');
    const headerAddr = document.getElementById('addr-display');

    if (this.profile.address && this.user) {
      // Wallet lié et connecté
      if (banner) banner.classList.add('hidden');
      if (actions) actions.style.display = 'flex';
      if (walletAddr) {
        walletAddr.innerText = this.profile.address.slice(0, 6) + '...' + this.profile.address.slice(-4);
        walletAddr.style.color = 'var(--success)';
      }
      if (headerAddr) {
        headerAddr.innerText = this.profile.username + ' | ' + this.profile.address.slice(0, 6) + '...' + this.profile.address.slice(-4);
      }
      document.getElementById('account-address').innerText = 'Wallet: ' + this.profile.address.slice(0, 6) + '...' + this.profile.address.slice(-4);
    } else {
      // Wallet non lié
      if (banner) banner.classList.remove('hidden');
      if (actions) actions.style.display = 'none';
      if (walletAddr) {
        walletAddr.innerText = 'Aucun wallet lié';
        walletAddr.style.color = 'var(--text-muted)';
      }
      if (headerAddr) {
        headerAddr.innerText = this.profile ? this.profile.username : '0x...';
      }
      document.getElementById('account-address').innerText = 'Wallet: Non lié';
    }
  }

  /** Connexion silencieuse du wallet (déjà lié au compte). Retourne true si connecté. */
  async connectWalletSilent() {
    if (!window.ethereum) return false;
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0 && accounts[0].toLowerCase() === this.profile.address.toLowerCase()) {
        this.provider = new ethers.BrowserProvider(window.ethereum);
        this.signer = await this.provider.getSigner();
        this.user = accounts[0];
        const network = await this.provider.getNetwork();
        if (Number(network.chainId) !== CONFIG.CHAIN_ID) await this.switchNetwork();
        await this.initContracts();
        window.ethereum.on('accountsChanged', () => this.handleWalletDisconnect());
        window.ethereum.on('chainChanged', () => this.handleWalletDisconnect());
        this.updateWalletUI();
        return true;
      }
      return false;
    } catch (e) { return false; }
  }

  /** Connexion wallet depuis la page compte */
  async connectWalletForAccount() {
    if (!window.ethereum) return this.showToast("Installez MetaMask !", true);
    this.setLoader(true, this.t('connWallet'));
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
      this.user = await this.signer.getAddress();
      const network = await this.provider.getNetwork();
      if (Number(network.chainId) !== CONFIG.CHAIN_ID) await this.switchNetwork();

      // Lier l'adresse au compte via l'API
      await this.apiCall('/api/profile/address', 'PUT', { address: this.user });
      
      // Mettre à jour le profil local
      this.profile.address = this.user;
      localStorage.setItem('fitia_profile', JSON.stringify(this.profile));

      window.ethereum.on('accountsChanged', () => this.handleWalletDisconnect());
      window.ethereum.on('chainChanged', () => this.handleWalletDisconnect());

      // Initialiser les contrats et les données blockchain
      await this.initContracts();
      await this.cacheBatteryDurations();
      
      // Toujours recréer l'intervalle pour éviter les doublons
      if (this._updateInterval) clearInterval(this._updateInterval);
      this._updateInterval = setInterval(() => this.updateData(), 15000);
      
      await this.fetchMarketPrices();
      await this.updateData();
      this.updateWalletUI();

      // Mettre à jour l'affichage header et compte
      document.getElementById('addr-display').innerText = this.profile.username + ' | ' + this.user.slice(0, 6) + '...' + this.user.slice(-4);
      document.getElementById('account-address').innerText = 'Wallet: ' + this.user.slice(0, 6) + '...' + this.user.slice(-4);
      document.getElementById('account-wallet-addr').innerText = this.user.slice(0, 6) + '...' + this.user.slice(-4);
      document.getElementById('account-wallet-addr').style.color = 'var(--success)';

      // Forcer le rendu de la boutique
      this.renderShop();

      this.showToast('✅ Wallet lié avec succès !');
      console.log('✅ Wallet connecté avec succès:', this.user.slice(0,10)+'...');
    } catch (e) { this.showError(e); }
    this.setLoader(false);
  }

  handleWalletDisconnect() {
    // Déconnecte le wallet mais garde la session auth
    this.user = null;
    this.signer = null;
    this.provider = null;
    this.core = null;
    this.mine = null;
    this.stopMiningCounter();
    // Nettoyer l'intervalle de mise à jour blockchain
    if (this._updateInterval) {
      clearInterval(this._updateInterval);
      this._updateInterval = null;
    }
    // Réinitialiser l'affichage
    document.getElementById('val-power').innerText = '0 H/s';
    document.getElementById('val-pending').innerText = '0.00000000';
    document.getElementById('viz-status').innerText = this.t('noMachine');
    document.getElementById('viz-status').style.color = '#666';
    this.currentRealPower = 0;
    this.updateWalletUI();
    document.getElementById('addr-display').innerText = this.profile.username;
    this.showToast("Wallet déconnecté. Reconnectez pour les transactions.");
  }

  // ═══ PROFIL (Mon Compte) ════════════════════════════════════════

  /** Affiche/masque le formulaire d'édition */
  toggleEditProfile() {
    const form = document.getElementById('account-edit-form');
    form.classList.toggle('hidden');
    if (!form.classList.contains('hidden')) {
      document.getElementById('edit-username').value = this.profile.username;
      document.getElementById('edit-email').value = this.profile.email;
      document.getElementById('edit-current-password').value = '';
      document.getElementById('edit-new-password').value = '';
    }
  }

  /** Sauvegarde les modifications du profil */
  async saveProfile() {
    const username = document.getElementById('edit-username').value.trim();
    const email = document.getElementById('edit-email').value.trim();

    if (!username || username.length < 3) return this.showToast('Pseudo : 3 caractères minimum', true);
    if (!email) return this.showToast('Email requis', true);

    this.setLoader(true, 'Mise à jour...');
    try {
      const data = await this.apiCall('/api/profile', 'PUT', { username, email });
      this.profile = data.user;
      localStorage.setItem('fitia_profile', JSON.stringify(data.user));

      // Mettre à jour l'affichage
      document.getElementById('account-username').innerText = data.user.username;
      document.getElementById('account-email').innerText = data.user.email;
      document.getElementById('account-uid').innerText = 'ID: ' + (data.user.id || '—');
      document.getElementById('account-avatar').innerText = data.user.username.charAt(0).toUpperCase();
      if (this.profile.address) {
        document.getElementById('addr-display').innerText = data.user.username + ' | ' + this.profile.address.slice(0, 6) + '...' + this.profile.address.slice(-4);
      } else {
        document.getElementById('addr-display').innerText = data.user.username;
      }

      document.getElementById('account-edit-form').classList.add('hidden');
      this.showToast('✅ Profil mis à jour !');
    } catch (e) { this.showToast(e.message, true); }
    this.setLoader(false);
  }

  /** Change le mot de passe */
  async changePassword() {
    const currentPassword = document.getElementById('edit-current-password').value;
    const newPassword = document.getElementById('edit-new-password').value;

    if (!currentPassword) return this.showToast('Mot de passe actuel requis', true);
    if (!newPassword || newPassword.length < 6) return this.showToast('Nouveau mot de passe : 6 caractères minimum', true);

    this.setLoader(true, 'Changement du mot de passe...');
    try {
      await this.apiCall('/api/profile/password', 'PUT', { currentPassword, newPassword });
      document.getElementById('edit-current-password').value = '';
      document.getElementById('edit-new-password').value = '';
      this.showToast('✅ Mot de passe mis à jour !');
    } catch (e) { this.showToast(e.message, true); }
    this.setLoader(false);
  }

  // ═══ BLOCKCHAIN / CONTRACTS ══════════════════════════════════════

  async switchNetwork() {
    try {
      await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x89' }] });
    } catch (e) {
      if (e.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{ chainId: '0x89', chainName: 'Polygon', nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 }, rpcUrls: ['https://polygon-rpc.com/'], blockExplorerUrls: ['https://polygonscan.com/'] }]
        });
      }
    }
  }

  async initContracts() {
    // Utiliser un JsonRpcProvider fallback si le provider MetaMask échoue
    let provider = this.provider;
    try {
      // Tester si le provider MetaMask répond
      await this.provider.getBlockNumber();
    } catch (e) {
      console.warn('⚠️ Provider MetaMask injoignable, fallback RPC public');
      // Fallback : utiliser un RPC public pour les lectures
      const rpcUrl = CONFIG.RPC_URLS[this._rpcIndex] || CONFIG.RPC_URLS[0];
      provider = new ethers.JsonRpcProvider(rpcUrl);
      // Garder le signer MetaMask pour les transactions
    }
    
    // Contrat Core : utiliser le signer pour les écritures, provider pour les lectures
    this.core = new ethers.Contract(CONFIG.CORE, CORE_ABI, this.signer || provider);
    this.mine = new ethers.Contract(CONFIG.MINE, MINE_ABI, this.signer || provider);
    
    // Ajouter une connexion provider-only pour les lectures si le provider MetaMask est lent
    this._readProvider = provider !== this.provider ? provider : null;
    
    try {
      const ftaReadProvider = this._readProvider || this.provider;
      const ftaContract = new ethers.Contract(CONFIG.FTA, ["function decimals() view returns (uint8)"], ftaReadProvider);
      this.ftaDecimals = Number(await ftaContract.decimals());
    } catch (e) { /* garde 8 */ }
    if (!localStorage.getItem(this.storageKey)) localStorage.setItem(this.storageKey, Math.floor(Date.now() / 1000));
    
    // Vérification rapide que les contrats sont accessibles
    try {
      await this.mine.mCount();
      console.log('✅ Contrats blockchain accessibles');
    } catch (e) {
      console.error('❌ Contrats inaccessibles:', e.message);
      this._rpcIndex = (this._rpcIndex + 1) % CONFIG.RPC_URLS.length;
      throw new Error('Impossible de contacter les contrats sur Polygon. Vérifiez votre connexion RPC.');
    }
  }

  async cacheBatteryDurations() {
    try {
      const count = Number(await this.mine.bCount());
      for (let i = 0; i < count; i++) {
        try { const b = await this.mine.getBType(i); this.batteryTypeDurations[i] = Number(b.dur) / 86400; } catch (e) {}
      }
    } catch (e) {}
  }

  async fetchUserAssets() {
    if (!this.user) return;
    this.userMachines = [];
    this.batteryInventory = {};
    try {
      const machinesRaw = await this.mine.myMachines(this.user);
      for (const m of machinesRaw) { this.userMachines.push({ tid: Number(m.tid ?? m[0]), exp: Number(m.exp ?? m[1]) }); }
    } catch (e) {
      try { const info = await this.mine.myInfo(this.user); for (let i = 0; i < Number(info.mc ?? info[0]); i++) this.userMachines.push({ tid: 0, exp: 0 }); } catch (e2) {}
    }
    try {
      const bCount = Number(await this.mine.bCount());
      for (let t = 0; t < bCount; t++) {
        try { const qty = Number(await this.mine.myBattery(this.user, t)); if (qty > 0) this.batteryInventory[t] = qty; } catch (e) {}
      }
    } catch (e) {}
  }

  renderActiveMachines() {
    const container = document.getElementById('active-machines-list');
    if (!container) return;
    const now = Math.floor(Date.now() / 1000);
    const active = this.userMachines.filter(m => m.exp > now);
    if (!active.length) { container.innerHTML = `<p class="small-text" style="text-align:center;">${this.t('noActiveMachines')}</p>`; return; }
    const tierNames = ['MK-I', 'MK-II', 'MK-III', 'MK-IV', 'MK-V', 'MK-VI', 'MK-VII', 'MK-VIII'];
    container.innerHTML = active.map(m => {
      const rem = m.exp - now;
      return `<div class="asset-row">${this.getMachineMiniSVG(m.tid)}<div class="asset-info"><div class="asset-name">${tierNames[m.tid % 8]} <span class="status-pill active">● ${this.t('active')}</span></div><div class="asset-detail">${this.t('batteryLabel')}</div><div class="battery-bar-wrap"><div class="battery-bar-header"><span class="battery-bar-label">${this.t('timeRemaining')}</span><span class="battery-bar-time green">${this.formatTimeRemaining(rem)}</span></div><div class="battery-bar"><div class="battery-bar-fill green" style="width:50%"></div></div></div></div></div>`;
    }).join('');
  }

  renderUserMachines() {
    const container = document.getElementById('my-machines-list');
    if (!container) return;
    if (!this.userMachines.length) { container.innerHTML = `<p class="small-text" style="text-align:center;">${this.t('noMachines')}</p>`; return; }
    const now = Math.floor(Date.now() / 1000);
    const tierNames = ['MK-I', 'MK-II', 'MK-III', 'MK-IV', 'MK-V', 'MK-VI', 'MK-VII', 'MK-VIII'];
    container.innerHTML = this.userMachines.map((m, i) => {
      let statusClass, statusText;
      if (m.exp > now) { statusClass = 'active'; statusText = this.t('active'); }
      else if (m.exp > 0 && m.exp <= now) { statusClass = 'expired'; statusText = this.t('expired'); }
      else { statusClass = 'inactive'; statusText = this.t('inactive'); }
      let extra = '';
      if (m.exp > now) { extra = `<div class="battery-bar-wrap"><div class="battery-bar-header"><span class="battery-bar-label">${this.t('timeRemaining')}</span><span class="battery-bar-time green">${this.formatTimeRemaining(m.exp - now)}</span></div><div class="battery-bar"><div class="battery-bar-fill green" style="width:50%"></div></div></div>`; }
      return `<div class="asset-row">${this.getMachineMiniSVG(m.tid)}<div class="asset-info"><div class="asset-name">#${i} ${tierNames[m.tid % 8]} <span class="status-pill ${statusClass}">● ${statusText}</span></div><div class="asset-detail">${m.exp > now ? this.t('plugged') : this.t('notPlugged')}</div>${extra}</div></div>`;
    }).join('');
  }

  renderUserBatteries() {
    const container = document.getElementById('my-batteries-list');
    if (!container) return;
    const entries = Object.entries(this.batteryInventory).filter(([,qty]) => qty > 0);
    if (!entries.length) { container.innerHTML = `<p class="small-text" style="text-align:center;">${this.t('noBatteries')}</p>`; return; }
    container.innerHTML = entries.map(([typeId, qty]) => {
      const dur = this.getBatteryDuration(Number(typeId));
      return `<div class="asset-row"><div class="real-battery"><div class="battery-cap"></div><div class="battery-body"><div class="battery-level" style="width:80%"></div><div class="battery-charge-indicator">${Math.round(80)}%</div></div></div><div class="asset-info"><div class="asset-name">${dur} ${this.t('days')} <span class="status-pill available">● ${this.t('available')}</span></div><div class="asset-detail">Quantité: ${qty}</div></div></div>`;
    }).join('');
  }

  async updateData() {
    if (!this.user) return;
    try {
      // Essayer de lire les données blockchain
      let rawPower = 0, diffNum = 2e12, uBal = 0n, fBal = 0n, polBal = 0n, nativePol = 0n;
      
      try {
        rawPower = await this.mine.powerOf(this.user);
        const powNum = Number(rawPower);
        try { diffNum = Number(await this.core.difficulty()); } catch (e) {}
        this.currentRealPower = powNum > 0 ? (powNum * diffNum) / 1e18 : 0;
      } catch (e) {
        console.warn('⚠️ Erreur lecture powerOf:', e.message);
        // Réessayer avec le provider fallback si dispo
        if (this._readProvider) {
          try {
            const mineRead = new ethers.Contract(CONFIG.MINE, MINE_ABI, this._readProvider);
            const coreRead = new ethers.Contract(CONFIG.CORE, CORE_ABI, this._readProvider);
            rawPower = await mineRead.powerOf(this.user);
            const powNum = Number(rawPower);
            try { diffNum = Number(await coreRead.difficulty()); } catch (e2) {}
            this.currentRealPower = powNum > 0 ? (powNum * diffNum) / 1e18 : 0;
          } catch (e2) {
            console.error('❌ Fallback RPC aussi en échec:', e2.message);
          }
        }
      }
      
      try { const rateRaw = await this.core.rate(); this.ftaPriceUsd = parseFloat(ethers.formatUnits(rateRaw, this.usdtDecimals)); } catch (e) {}
      
      try { uBal = await this.core.uBal(this.user); } catch (e) { console.warn('⚠️ uBal:', e.message); }
      try { fBal = await this.core.fBal(this.user); } catch (e) { console.warn('⚠️ fBal:', e.message); }
      try { polBal = await this.core.pol(this.user); } catch (e) { console.warn('⚠️ pol:', e.message); }
      try { nativePol = await this.provider.getBalance(this.user); } catch (e) { console.warn('⚠️ getBalance:', e.message); }
      
      const uB = parseFloat(ethers.formatUnits(uBal, this.usdtDecimals));
      const fB = parseFloat(ethers.formatUnits(fBal, this.ftaDecimals));
      const pB = parseFloat(ethers.formatUnits(polBal, 18));
      const nB = parseFloat(ethers.formatUnits(nativePol, 18));

      // Mise à jour UI (seulement si les éléments existent)
      const safeSet = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val; };
      safeSet('val-power', this.formatHashrate(this.currentRealPower));
      safeSet('bal-pol', (pB + nB).toFixed(4));
      safeSet('bal-usdt', uB.toFixed(2));
      safeSet('bal-fta', fB.toFixed(4));
      safeSet('price-pol', this.formatUsd(this.polPriceUsd));
      safeSet('price-usdt', this.formatUsd(1));
      safeSet('price-fta', this.formatUsd(this.ftaPriceUsd));
      this.updatePriceChange('pol', this.polPriceUsd);
      this.updatePriceChange('usdt', 1);
      this.updatePriceChange('fta', this.ftaPriceUsd);
      safeSet('bal-pol-usd', '≈ ' + this.formatUsd((pB + nB) * this.polPriceUsd));
      safeSet('bal-usdt-usd', '≈ ' + this.formatUsd(uB));
      safeSet('bal-fta-usd', '≈ ' + this.formatUsd(fB * this.ftaPriceUsd));
      safeSet('val-total-usd', this.formatUsd((pB + nB) * this.polPriceUsd + uB + fB * this.ftaPriceUsd));
      safeSet('swap-rate', this.t('currentRate') + this.ftaPriceUsd.toFixed(6) + this.t('usdtPerFta'));
      safeSet('swap-bal-from', (this.swapDirection === 'USDT_TO_FTA' ? uB : fB).toFixed(4));
      safeSet('swap-bal-to', (this.swapDirection === 'USDT_TO_FTA' ? fB : uB).toFixed(4));

      this.lastClaimTimestamp = parseInt(localStorage.getItem(this.storageKey) || '0');
      const elapsed = Math.floor(Date.now() / 1000) - this.lastClaimTimestamp;
      if (this.currentRealPower > 0) {
        if (!this.miningTimer) { const pendingFtaRaw = this.currentRealPower * elapsed; safeSet('val-pending', (pendingFtaRaw / 1e8).toFixed(8)); this.startMiningCounter(); }
        const viz = document.getElementById('viz-status'); if (viz) { viz.innerText = this.t('miningActive'); viz.style.color = "var(--primary)"; }
        this.updateVisualizerIntensity(this.currentRealPower);
      } else {
        this.stopMiningCounter();
        const viz = document.getElementById('viz-status'); if (viz) { viz.innerText = this.t('noMachine'); viz.style.color = "#666"; }
        safeSet('val-pending', "0.00000000");
      }
      
      try { await this.renderShop(); } catch (e) { console.warn('⚠️ renderShop:', e.message); }
      try { await this.fetchUserAssets(); } catch (e) { console.warn('⚠️ fetchUserAssets:', e.message); }
      this.renderActiveMachines();
      this.renderUserMachines();
      this.renderUserBatteries();
      if (document.getElementById('swap-from-in')?.value) this.calcSwap();
      
      // Réinitialiser le compteur d'erreurs si succès
      this._blockchainErrorCount = 0;
    } catch (e) {
      this._blockchainErrorCount++;
      console.error("Erreur updateData (#" + this._blockchainErrorCount + "):", e.message);
      // Afficher l'erreur une seule fois pour ne pas spammer
      if (this._blockchainErrorCount === 1) {
        this.showToast('⚠️ Erreur connexion blockchain. Vérifiez votre wallet et le réseau Polygon.', true);
      }
      // Après 3 échecs, réessayer avec un autre RPC
      if (this._blockchainErrorCount >= 3) {
        this._rpcIndex = (this._rpcIndex + 1) % CONFIG.RPC_URLS.length;
        const rpcUrl = CONFIG.RPC_URLS[this._rpcIndex];
        console.log('🔄 Basculement RPC:', rpcUrl);
        try {
          this._readProvider = new ethers.JsonRpcProvider(rpcUrl);
          this._blockchainErrorCount = 0;
        } catch (e2) {}
      }
    }
  }

  startMiningCounter() {
    if (this.miningTimer) return;
    this.pendingBalance = parseFloat(document.getElementById('val-pending').innerText) * 1e8 || 0;
    this.miningTimer = setInterval(() => { if (this.currentRealPower > 0) { this.pendingBalance += this.currentRealPower; document.getElementById('val-pending').innerText = (this.pendingBalance / 1e8).toFixed(8); } }, 1000);
  }

  stopMiningCounter() { if (this.miningTimer) { clearInterval(this.miningTimer); this.miningTimer = null; } }

  async fetchMarketPrices() {
    this.polPriceUsd = 0;
    try { const r = await fetch('https://api.dexscreener.com/latest/dex/tokens/0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0'); const d = await r.json(); if (d.pairs?.length) this.polPriceUsd = parseFloat(d.pairs[0].priceUsd) || 0; } catch (e) {}
    if (!this.polPriceUsd) this.polPriceUsd = 0.70;
  }

  // ═══ TRANSACTIONS (mêmes fonctions, vérification wallet) ════════

  async recordTransaction(txType, options = {}) {
    if (!this.user) return;
    try {
      await this.apiCall('/api/transactions', 'POST', {
        user_address: this.user, tx_hash: options.txHash || null, tx_type: txType,
        token: options.token || null, amount: options.amount || null,
        amount_fee: options.amountFee || 0, details: options.details || null, status: 'pending'
      });
    } catch (e) { console.error("Erreur enregistrement transaction:", e); }
  }

  async deposit() {
    if (!this.user) return this.showToast('Connectez votre wallet d\'abord', true);
    const tokenType = document.getElementById('deposit-token-select').value;
    const amount = parseFloat(document.getElementById('deposit-amount').value);
    if (!amount || amount <= 0) return this.showToast(this.t('invalidAmount'), true);
    this.setLoader(true, this.t('depositing'));
    try {
      let tx;
      if (tokenType === 'USDT') {
        const usdtContract = new ethers.Contract(CONFIG.USDT, ["function approve(address,uint256) returns (bool)", "function allowance(address,address) view returns (uint256)", "function balanceOf(address) view returns (uint256)"], this.provider);
        const amountBN = ethers.parseUnits(amount.toString(), this.usdtDecimals);
        const walletBal = await usdtContract.balanceOf(this.user);
        if (walletBal < amountBN) return this.showToast(`❌ Solde USDT insuffisant`, true);
        const allowance = await usdtContract.allowance(this.user, CONFIG.CORE);
        if (allowance < amountBN) { this.setLoader(true, "Approbation USDT..."); await (await usdtContract.connect(this.signer).approve(CONFIG.CORE, amountBN)).wait(); }
        this.setLoader(true, this.t('confirming'));
        tx = await this.core.depositUsdt(amountBN);
      } else {
        const ftaContract = new ethers.Contract(CONFIG.FTA, ["function approve(address,uint256) returns (bool)", "function allowance(address,address) view returns (uint256)", "function balanceOf(address) view returns (uint256)"], this.provider);
        const amountBN = ethers.parseUnits(amount.toString(), this.ftaDecimals);
        const walletBal = await ftaContract.balanceOf(this.user);
        if (walletBal < amountBN) return this.showToast(`❌ Solde FTA insuffisant`, true);
        const allowance = await ftaContract.allowance(this.user, CONFIG.CORE);
        if (allowance < amountBN) { this.setLoader(true, "Approbation FTA..."); await (await ftaContract.connect(this.signer).approve(CONFIG.CORE, amountBN)).wait(); }
        this.setLoader(true, this.t('confirming'));
        tx = await this.core.depositFta(amountBN);
      }
      await tx.wait();
      this.showToast(this.t('depositSuccess'));
      document.getElementById('deposit-amount').value = '';
      await this.recordTransaction('deposit', { txHash: tx.hash, token: tokenType, amount, status: 'confirmed' });
      this.updateData();
    } catch (e) { this.showError(e); }
    this.setLoader(false);
  }

  async withdraw() {
    if (!this.user) return this.showToast('Connectez votre wallet d\'abord', true);
    const tokenType = document.getElementById('deposit-token-select').value;
    const amount = parseFloat(document.getElementById('deposit-amount').value);
    if (!amount || amount <= 0) return this.showToast(this.t('invalidAmount'), true);
    this.setLoader(true, this.t('withdrawing'));
    try {
      let tx = tokenType === 'USDT' ? await this.core.withdrawUsdt(ethers.parseUnits(amount.toString(), this.usdtDecimals)) : await this.core.withdrawFta(ethers.parseUnits(amount.toString(), this.ftaDecimals));
      await tx.wait();
      this.showToast(this.t('withdrawSuccess'));
      document.getElementById('deposit-amount').value = '';
      await this.recordTransaction('withdraw', { txHash: tx.hash, token: tokenType, amount, status: 'confirmed' });
      this.updateData();
    } catch (e) { this.showError(e); }
    this.setLoader(false);
  }

  openSend() { document.getElementById('send-to-address').value = ''; document.getElementById('send-amount').value = ''; document.getElementById('modal-send').classList.add('active'); this.updateSendBalance(); }
  updateSendBalance() { const token = document.getElementById('send-token-select').value; let balId = token === 'USDT' ? 'bal-usdt' : token === 'FTA' ? 'bal-fta' : 'bal-pol'; document.getElementById('send-bal').innerText = document.getElementById(balId)?.innerText || '0'; }
  openReceive() { if (!this.user) return this.showToast('Connectez votre wallet', true); document.getElementById('receive-addr-display').innerText = this.user; document.getElementById('modal-receive').classList.add('active'); }
  closeModals() { document.getElementById('modal-send').classList.remove('active'); document.getElementById('modal-receive').classList.remove('active'); }
  copyReceiveAddress() { navigator.clipboard.writeText(this.user); this.showToast(this.t('addrCopied')); }

  async executeSend() {
    const to = document.getElementById('send-to-address').value;
    const amt = document.getElementById('send-amount').value;
    if (!ethers.isAddress(to)) return this.showToast(this.t('invalidAddr'), true);
    if (!amt || Number(amt) <= 0) return this.showToast(this.t('invalidAmount'), true);
    this.setLoader(true, this.t('sending'));
    try {
      const token = document.getElementById('send-token-select').value;
      let tx;
      if (token === 'POL') tx = await this.signer.sendTransaction({ to, value: ethers.parseEther(amt) });
      else { const tokenAddr = token === 'USDT' ? CONFIG.USDT : CONFIG.FTA; const dec = token === 'USDT' ? this.usdtDecimals : this.ftaDecimals; const tokenContract = new ethers.Contract(tokenAddr, ["function transfer(address,uint256) returns (bool)"], this.signer); tx = await tokenContract.transfer(to, ethers.parseUnits(amt, dec)); }
      await tx.wait();
      this.showToast(this.t('sentSuccess'));
      this.closeModals();
      await this.recordTransaction('send', { txHash: tx.hash, token, amount: Number(amt), details: { to }, status: 'confirmed' });
      this.updateData();
    } catch (e) { this.showError(e); }
    this.setLoader(false);
  }

  // ═══ BOUTIQUE ════════════════════════════════════════════════════

  setShopView(v) { this.shopViewMode = v; document.querySelectorAll('.shop-tab').forEach(t => t.classList.remove('active')); event.currentTarget.classList.add('active'); this.renderShop(); }
  setPayMode(mode) { this.payMode = mode; document.getElementById('btn-pay-usdt').classList.toggle('active', mode === 'USDT'); document.getElementById('btn-pay-fta').classList.toggle('active', mode === 'FTA'); this.renderShop(); }

  async buyMachine(typeId) {
    if (!this.user) return this.showToast('Connectez votre wallet', true);
    const mData = this.shopMachinesData[typeId];
    if (!mData) return this.showToast("Machine indisponible", true);
    if (mData.shopExpiry > 0 && Math.floor(Date.now() / 1000) > mData.shopExpiry) return this.showToast("Cette machine n'est plus disponible", true);
    this.setLoader(true, `${this.t('buyingMachine')} (${this.payMode})...`);
    try {
      let tx = this.payMode === 'USDT' ? await this.mine.buyMachine(typeId) : await this.mine.buyMachineFTA(typeId);
      await tx.wait();
      this.showToast(this.t('machineBought'));
      this.shopMachinesData = [];
      await this.recordTransaction('buy_machine', { txHash: tx.hash, token: this.payMode, amount: mData.price, details: { machineType: typeId, power: mData.power }, status: 'confirmed' });
      this.updateData();
    } catch (e) { this.showError(e); }
    this.setLoader(false);
  }

  async buyBattery(typeId) {
    if (!this.user) return this.showToast('Connectez votre wallet', true);
    this.setLoader(true, `${this.t('buyingBattery')} (${this.payMode})...`);
    try {
      let tx = this.payMode === 'USDT' ? await this.mine.buyBattery(typeId) : await this.mine.buyBatteryFTA(typeId);
      await tx.wait();
      const bData = this.shopBatteriesData[typeId] || {};
      this.showToast(this.t('batteryBought'));
      this.shopBatteriesData = [];
      await this.recordTransaction('buy_battery', { txHash: tx.hash, token: this.payMode, amount: bData.price || 0, details: { batteryType: typeId, days: bData.days || 0 }, status: 'confirmed' });
      this.updateData();
    } catch (e) { this.showError(e); }
    this.setLoader(false);
  }

  async plugInMachine() {
    if (!this.user) return this.showToast('Connectez votre wallet', true);
    const machineIndex = document.getElementById('plug-machine-id').value;
    const batteryTypeId = document.getElementById('plug-battery-type').value;
    if (machineIndex === "" || machineIndex < 0) return this.showToast(this.t('invalidId'), true);
    if (!this.batteryInventory[Number(batteryTypeId)] || this.batteryInventory[Number(batteryTypeId)] <= 0) return this.showToast(this.t('errNoBattery'), true);
    this.setLoader(true, this.t('pluggingIn'));
    try {
      const tx = await this.mine.plugInMachine(machineIndex, batteryTypeId);
      await tx.wait();
      this.showToast(this.t('pluggedIn'));
      await this.recordTransaction('plug', { txHash: tx.hash, details: { machineIndex, batteryTypeId }, status: 'confirmed' });
      this.updateData();
    } catch (e) { this.showError(e); }
    this.setLoader(false);
  }

  async claim() {
    if (!this.user) return this.showToast('Connectez votre wallet', true);
    this.stopMiningCounter();
    this.setLoader(true, this.t('claiming'));
    try {
      const tx = await this.mine.claimRewards();
      await tx.wait();
      const claimedAmount = this.pendingBalance / 1e8;
      this.pendingBalance = 0;
      document.getElementById('val-pending').innerText = "0.00000000";
      localStorage.setItem(this.storageKey, Math.floor(Date.now() / 1000));
      this.showToast(this.t('claimed'));
      await this.recordTransaction('claim', { txHash: tx.hash, token: 'FTA', amount: claimedAmount, status: 'confirmed' });
      await this.updateData();
      if (this.currentRealPower > 0) this.startMiningCounter();
    } catch (e) {
      const errStr = (e?.message || '').toLowerCase();
      if (errStr.includes('tfee')) this.showToast('⚠️ Pas assez de liquidité FTA. Contactez l\'admin.', true);
      else if (errStr.includes('nom')) this.showToast('⚠️ Aucune machine. Achetez une machine.', true);
      else this.showError(e);
      if (this.currentRealPower > 0) this.startMiningCounter();
    }
    this.setLoader(false);
  }

  async bindReferrer() {
    const input = document.getElementById('ref-address-input').value.trim();
    if (!input) return this.showToast(this.t('invalidAddr'), true);
    if (!this.user) return this.showToast('Connectez votre wallet', true);
    this.setLoader(true, this.t('linking'));
    try {
      let tx = input.startsWith('0x') && input.length === 42 ? await this.core.setReferrer(input) : await this.core.setReferrerById(parseInt(input));
      await tx.wait();
      this.showToast(this.t('refLinked'));
      document.getElementById('ref-address-input').value = '';
      await this.recordTransaction('referral', { txHash: tx.hash, details: { referrer: input }, status: 'confirmed' });
    } catch (e) { this.showError(e); }
    this.setLoader(false);
  }

  // ═══ SWAP ════════════════════════════════════════════════════════

  toggleSwap() {
    this.swapDirection = this.swapDirection === 'USDT_TO_FTA' ? 'FTA_TO_USDT' : 'USDT_TO_FTA';
    document.getElementById('token-from-display').innerText = this.swapDirection === 'USDT_TO_FTA' ? 'USDT' : 'FTA';
    document.getElementById('token-to-display').innerText = this.swapDirection === 'USDT_TO_FTA' ? 'FTA' : 'USDT';
    document.getElementById('swap-to-in').value = ''; document.getElementById('swap-from-in').value = '';
    document.getElementById('swap-details').classList.add('hidden');
    this.updateData();
  }

  calcSwap() {
    const val = document.getElementById('swap-from-in').value;
    if (!val || val <= 0) { document.getElementById('swap-to-in').value = ''; document.getElementById('swap-details').classList.add('hidden'); return; }
    const inputVal = parseFloat(val);
    const isUsdtTo = this.swapDirection === 'USDT_TO_FTA';
    const fee = inputVal * SWAP_FEE_RATE;
    const netInput = inputVal - fee;
    let netOutput = 0;
    if (this.ftaPriceUsd > 0) netOutput = isUsdtTo ? (netInput / this.ftaPriceUsd) : (netInput * this.ftaPriceUsd);
    const minReceived = netOutput * (1 - SLIPPAGE);
    document.getElementById('swap-to-in').value = netOutput > 0 ? netOutput.toFixed(6) : '';
    const el = document.getElementById('swap-details');
    el.classList.remove('hidden');
    document.getElementById('swap-detail-rate').innerText = isUsdtTo ? `1 USDT = ${(1 / this.ftaPriceUsd).toFixed(2)} FTA` : `1 FTA = ${this.ftaPriceUsd.toFixed(6)} USDT`;
    document.getElementById('swap-detail-fee').innerText = `${fee.toFixed(6)} ${isUsdtTo ? 'USDT' : 'FTA'}`;
    document.getElementById('swap-detail-min').innerText = `${minReceived.toFixed(6)} ${isUsdtTo ? 'FTA' : 'USDT'}`;
  }

  async executeSwap() {
    if (!this.user) return this.showToast('Connectez votre wallet', true);
    const val = document.getElementById('swap-from-in').value;
    if (!val || val <= 0) return this.showToast(this.t('invalidAmount'), true);
    this.setLoader(true, this.t('swapping'));
    const isUsdtTo = this.swapDirection === 'USDT_TO_FTA';
    try {
      const decimals = isUsdtTo ? this.usdtDecimals : this.ftaDecimals;
      const amount = ethers.parseUnits(val, decimals);
      const netInput = parseFloat(val) * (1 - SWAP_FEE_RATE);
      const expectedOut = isUsdtTo ? (netInput / this.ftaPriceUsd) : (netInput * this.ftaPriceUsd);
      const outDec = isUsdtTo ? this.ftaDecimals : this.usdtDecimals;
      const minOut = ethers.parseUnits((expectedOut * (1 - SLIPPAGE)).toFixed(outDec), outDec);
      const deadline = Math.floor(Date.now() / 1000) + 1200;
      let tx = isUsdtTo ? await this.core.swapUForF(amount, minOut, deadline) : await this.core.swapFForU(amount, minOut, deadline);
      await tx.wait();
      this.showToast(this.t('swapSuccess'));
      document.getElementById('swap-from-in').value = ''; document.getElementById('swap-to-in').value = '';
      document.getElementById('swap-details').classList.add('hidden');
      const inAmount = Number(val);
      await this.recordTransaction('swap', { txHash: tx.hash, token: isUsdtTo ? 'USDT' : 'FTA', amount: inAmount, details: { direction: this.swapDirection, expectedOutput: expectedOut, fee: inAmount * SWAP_FEE_RATE }, amountFee: inAmount * SWAP_FEE_RATE, status: 'confirmed' });
      this.updateData();
    } catch (e) { this.showError(e); }
    this.setLoader(false);
  }

  // ═══ VISUALISEUR ═════════════════════════════════════════════════

  resizeCanvas() { if (this.vizContext) { const c = this.vizContext.canvas; c.width = c.offsetWidth * 2; c.height = c.offsetHeight * 2; } }
  initVisualizer() { const c = document.getElementById('mining-canvas'); if (!c) return; this.resizeCanvas(); this.vizContext = c.getContext('2d'); this.vizBars = []; for (let i = 0; i < 20; i++) this.vizBars.push({ height: 0, targetHeight: 0 }); this.animateVisualizer(); }
  updateVisualizerIntensity(p) { const intensity = p > 0 ? Math.min((p * 500) + 10, 100) : 0; this.vizBars.forEach(b => b.targetHeight = (this.vizContext.canvas.height * (intensity / 100)) * Math.random()); }
  animateVisualizer() {
    if (!this.vizContext) return;
    const ctx = this.vizContext; ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); ctx.fillStyle = "#F0B90B"; const w = ctx.canvas.width / 20;
    this.vizBars.forEach((b, i) => { b.height += (b.targetHeight - b.height) * 0.1; ctx.fillRect(i * w + 2, ctx.canvas.height - b.height, w - 4, b.height); b.targetHeight += (Math.random() - 0.5) * 10; });
    requestAnimationFrame(() => this.animateVisualizer());
  }

  // ═══ BOUTIQUE RENDER ═════════════════════════════════════════════

  async fetchMachines() {
    this.isLoadingShop = true;
    try { const count = Number(await this.mine.mCount()); const promises = []; for (let i = 0; i < count; i++) promises.push(this.mine.getMType(i)); const results = await Promise.all(promises); this.shopMachinesData = []; for (let i = 0; i < count; i++) { const d = results[i]; this.shopMachinesData.push({ price: parseFloat(ethers.formatUnits(d.price, this.usdtDecimals)), power: Number(d.power), priceRaw: d.price, shopExpiry: Number(d.shopExpiry ?? 0) }); } } catch (e) { console.error("Erreur fetchMachines:", e); }
    this.isLoadingShop = false;
  }

  async fetchBatteries() {
    this.isLoadingShop = true;
    try { const count = Number(await this.mine.bCount()); const promises = []; for (let i = 0; i < count; i++) promises.push(this.mine.getBType(i)); const results = await Promise.all(promises); this.shopBatteriesData = []; for (let i = 0; i < count; i++) { const d = results[i]; this.shopBatteriesData.push({ price: parseFloat(ethers.formatUnits(d.price, this.usdtDecimals)), days: Number(d.dur) / 86400, priceRaw: d.price }); } } catch (e) { console.error("Erreur fetchBatteries:", e); }
    this.isLoadingShop = false;
  }

  getMachineMiniSVG(tier) {
    const c = ['#64748b', '#3b82f6', '#8b5cf6', '#F0B90B', '#f97316', '#ef4444', '#06b6d4', '#eab308'];
    const a = ['#94a3b8', '#60a5fa', '#a78bfa', '#FFD43B', '#fb923c', '#f87171', '#22d3ee', '#facc15'];
    const tc = c[tier % 8], ta = a[tier % 8];
    return `<svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" class="machine-svg-mini"><rect x="2" y="2" width="46" height="46" rx="6" fill="#1e293b" stroke="${tc}" stroke-width="1"/><rect x="2" y="2" width="46" height="3" rx="1.5" fill="${tc}" opacity="0.6"/><rect x="8" y="10" width="14" height="20" rx="2" fill="#080c18" stroke="${ta}" stroke-width="0.5"/><rect x="28" y="10" width="14" height="20" rx="2" fill="#080c18" stroke="${ta}" stroke-width="0.5"/><circle cx="21" cy="40" r="6" fill="#0a0e1a" stroke="#333" stroke-width="0.5"/><circle cx="37" cy="40" r="6" fill="#0a0e1a" stroke="#333" stroke-width="0.5"/></svg>`;
  }

  async renderShop() {
    if (this.isLoadingShop) return;
    const container = document.getElementById('shop-list');
    if (this.shopViewMode === 'machines') { if (!this.shopMachinesData.length) await this.fetchMachines(); this._renderShopMachinesHTML(container); }
    else { if (!this.shopBatteriesData.length) await this.fetchBatteries(); this._renderShopBatteriesHTML(container); }
  }

  _renderShopMachinesHTML(container) {
    container.innerHTML = ''; container.style.gridTemplateColumns = '1fr 1fr';
    const badges = ['background:#64748b;color:#fff','background:#3b82f6;color:#fff','background:#8b5cf6;color:#fff','background:#F0B90B;color:#000','background:#f97316;color:#fff','background:#ef4444;color:#fff','background:#06b6d4;color:#000','background:#eab308;color:#000'];
    const names = ['STARTER','STANDARD','ADVANCED','PRO','ELITE','ULTRA','SUPREME','LEGEND'];
    for (let i = 0; i < this.shopMachinesData.length; i++) {
      const d = this.shopMachinesData[i];
      const div = document.createElement('div'); div.className = 'rig-item';
      div.innerHTML = `<span class="tier-badge" style="${badges[i % 8]}">${names[i % 8]}</span>${this.getMachineMiniSVG(i)}<span class="rig-name" style="font-size:0.85rem;">${this.t('rig')} ${i + 1}</span><span class="rig-power" style="font-size:0.75rem;">${this.formatHashrate(d.power)}</span><span class="rig-price" style="font-size:1rem;">${d.price.toFixed(2)} $</span><button class="btn-primary" style="padding:8px;font-size:0.75rem;margin-top:6px;" onclick="App.buyMachine(${i})">${this.t('buy')} (${this.payMode})</button>`;
      container.appendChild(div);
    }
  }

  _renderShopBatteriesHTML(container) {
    container.innerHTML = ''; container.style.gridTemplateColumns = '1fr 1fr';
    for (let i = 0; i < this.shopBatteriesData.length; i++) {
      const d = this.shopBatteriesData[i]; const chargeLevel = Math.floor(Math.random() * 40) + 60;
      const div = document.createElement('div'); div.className = 'battery-shop-item';
      div.innerHTML = `<div class="real-battery"><div class="battery-cap"></div><div class="battery-body"><div class="battery-level" style="width:${chargeLevel}%"></div><div class="battery-charge-indicator">${d.days}J</div></div></div><div class="battery-name">${d.days} ${this.t('days')}</div><div class="battery-price">${d.price.toFixed(2)} $</div><button class="btn-primary" style="padding:6px;font-size:0.75rem" onclick="App.buyBattery(${i})">${this.t('buy')} (${this.payMode})</button>`;
      container.appendChild(div);
    }
  }

  // ═══ HISTORIQUE (intégré dans Mon Compte) ═══════════════════════

  async loadHistory() {
    if (!this.user) {
      document.getElementById('history-list').innerHTML = '<p class="small-text" style="text-align:center;padding:20px;">Connectez votre wallet pour voir l\'historique.</p>';
      return;
    }
    document.getElementById('history-list').innerHTML = `<p class="small-text" style="text-align:center;padding:20px;">${this.t('historyLoading')}</p>`;
    try {
      let url = `/api/transactions/${this.user}?limit=${this.historyLimit}&offset=${this.historyPage * this.historyLimit}`;
      if (this.historyFilter) url += `&type=${this.historyFilter}`;
      const data = await this.apiCall(url);
      this.historyTotal = data.total;
      this.renderHistory(data.transactions);
    } catch (e) { document.getElementById('history-list').innerHTML = '<p class="small-text" style="text-align:center;padding:20px;">Erreur chargement historique</p>'; }
  }

  renderHistory(transactions) {
    const container = document.getElementById('history-list');
    if (!transactions || transactions.length === 0) { container.innerHTML = '<p class="small-text" style="text-align:center;padding:20px;">Aucune transaction</p>'; }
    else {
      const typeIcons = { buy_machine:'⛏️',buy_battery:'🔋',deposit:'📥',withdraw:'📤',claim:'🎁',swap:'💱',plug:'🔌',referral:'👥',send:'📤',receive:'📥' };
      const typeLabels = { buy_machine:'txBuyMachine',buy_battery:'txBuyBattery',deposit:'txDeposit',withdraw:'txWithdraw',claim:'txClaim',swap:'txSwap',plug:'txPlug',referral:'txReferral',send:'txSend',receive:'txReceive' };
      const positiveTypes = ['deposit','claim','receive'];
      container.innerHTML = transactions.map(tx => {
        const dt = new Date(tx.created_at + 'Z'); const dateStr = dt.toLocaleDateString('fr') + ' ' + dt.toLocaleTimeString('fr', { hour:'2-digit',minute:'2-digit' });
        const isPositive = positiveTypes.includes(tx.tx_type); const amtClass = isPositive ? 'positive' : 'negative';
        const amtPrefix = isPositive ? '+' : (tx.amount ? '-' : '');
        let amountStr = ''; if (tx.amount !== null) amountStr = `${amtPrefix}${tx.amount.toFixed(tx.token==='USDT'?2:4)} ${tx.token||''}`;
        return `<div class="history-item"><div class="history-item-left"><div class="history-icon">${typeIcons[tx.tx_type]||'📋'}</div><div class="history-details"><div class="history-detail-type">${this.t(typeLabels[tx.tx_type]||'')||tx.tx_type}</div><div class="history-detail-date">${dateStr}</div><span class="status-pill ${tx.status}">● ${tx.status}</span></div></div><div class="history-item-right"><div class="history-amount ${amtClass}">${amountStr}</div></div></div>`;
      }).join('');
    }
    const pag = document.getElementById('history-pagination');
    const totalPages = Math.ceil(this.historyTotal / this.historyLimit);
    if (totalPages > 1) { pag.classList.remove('hidden'); pag.innerHTML = `<button class="btn-page" onclick="App.goHistoryPage(${this.historyPage - 1})" ${this.historyPage===0?'disabled':''}>${this.t('prev')}</button><span style="align-self:center;font-size:0.8rem;color:var(--text-muted);">${this.historyPage+1}/${totalPages}</span><button class="btn-page" onclick="App.goHistoryPage(${this.historyPage + 1})" ${this.historyPage>=totalPages-1?'disabled':''}>${this.t('next')}</button>`; }
    else pag.classList.add('hidden');
  }

  goHistoryPage(page) { if (page < 0 || page >= Math.ceil(this.historyTotal / this.historyLimit)) return; this.historyPage = page; this.loadHistory(); }
  filterHistory() { this.historyFilter = document.getElementById('history-filter-type').value; this.historyPage = 0; this.loadHistory(); }

  // ═══ NAVIGATION ══════════════════════════════════════════════════

  nav(viewId) {
    document.querySelectorAll('.view').forEach(el => { el.classList.remove('active'); el.style.display = 'none'; });
    const activeView = document.getElementById('view-' + viewId);
    if (activeView) { activeView.classList.add('active'); activeView.style.display = 'block'; }
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    const navMap = { dashboard: 0, shop: 1, 'my-rigs': 2, swap: 3, account: 4 };
    const idx = navMap[viewId];
    if (idx !== undefined) { const items = document.querySelectorAll('.nav-item'); if (items[idx]) items[idx].classList.add('active'); }
    // Charger l'historique dans Mon Compte
    if (viewId === 'account') this.loadHistory();
    // Rafraîchir les données blockchain si wallet connecté
    if (this.user && ['dashboard','shop','my-rigs','swap'].includes(viewId)) {
      this.updateData().catch(e => console.error('Erreur updateData nav:', e.message));
    }
  }

  // ═══ TERMS & PRIVACY ════════════════════════════════════════════

  showTerms() { document.getElementById('modal-terms').classList.add('active'); }
  closeTerms() { document.getElementById('modal-terms').classList.remove('active'); }
  showPrivacy() { this.showToast('Politique de confidentialité : Vos données ne sont jamais partagées. Seuls votre pseudo, email et adresse Polygon sont stockés.'); }

  // ═══ LOADER / ERREURS / TOASTS ═══════════════════════════════════

  setLoader(show, msg = "Traitement...") { const loader = document.getElementById('loader'); document.getElementById('loader-text').innerText = msg; if (show) loader.classList.remove('hidden'); else loader.classList.add('hidden'); }

  getErrorMessage(e) {
    const shortMsg = e?.shortMessage || e?.reason || '';
    const errStr = ((e?.message || '') + ' ' + shortMsg + ' ' + (e?.code || '') + ' ' + (e?.reason || '')).toLowerCase();
    if (errStr.includes('user rejected') || errStr.includes('user denied') || errStr.includes('action_rejected') || e?.code === 4001) return this.t('errRejected');
    if (errStr.includes('insufficient') || errStr.includes('not enough') || errStr.includes('insf')) return this.t('errInsufficientFunds');
    if (errStr.includes('tff') || errStr.includes('transferfrom')) return '❌ Transfert échoué. Vérifiez l\'approbation et votre solde wallet.';
    if (errStr.includes('nonce')) return this.t('errNonce');
    if (errStr.includes('reentrant')) return '⚠️ Transaction déjà en cours. Patientez.';
    if (errStr.includes('pending')) return this.t('errAlreadyPending');
    if (errStr.includes('timeout') || errStr.includes('deadline')) return this.t('errTimeout');
    if (errStr.includes('network') || errStr.includes('fetch') || errStr.includes('call revert')) return this.t('errNetwork');
    if (errStr.includes('revert') || errStr.includes('execution')) return this.t('errContract');
    if (errStr.includes('nom') || errStr.includes('no machine')) return this.t('errNoMachine');
    if (errStr.includes('running')) return this.t('errRunning');
    if (errStr.includes('nobat') || errStr.includes('no battery')) return this.t('errNoBattery');
    if (errStr.includes('maxm') || errStr.includes('max machine')) return this.t('errMaxMachine');
    if (shortMsg) return 'Erreur contrat : ' + shortMsg;
    return this.t('errGeneric');
  }

  showError(e) { console.error("═══ Transaction Error ═══", e?.message, e?.shortMessage, e?.code); this.showToast(this.getErrorMessage(e), true); }

  showToast(msg, isError = false) {
    const div = document.createElement('div'); div.className = 'toast' + (isError ? ' toast-error' : ' toast-success'); div.innerText = msg;
    document.getElementById('toast-container').appendChild(div); setTimeout(() => div.remove(), 4000);
  }

  // ═══ LANGUE ══════════════════════════════════════════════════════

  setLanguage(lang) {
    if (!i18n[lang]) return; this.currentLang = lang; localStorage.setItem('fitia_lang', lang);
    const flags = { en:'🇬🇧',fr:'🇫🇷',de:'🇩🇪',zh:'🇨🇳',sg:'🇸🇬' };
    document.getElementById('lang-btn-display').innerText = `${flags[lang]} ${lang.toUpperCase()}`;
    this.applyTranslations(); this.renderShop();
  }

  applyTranslations() {
    const t = (k) => this.t(k);
    // Navigation
    document.querySelectorAll('.nav-item span').forEach((s, i) => { const labels = ['home','shop','assets','swapNav',null]; if (labels[i]) s.innerText = t(labels[i]); });
    // Nav account
    const accountSpan = document.querySelector('.nav-item:last-child span');
    if (accountSpan) accountSpan.innerText = 'Compte';
    // Stats
    const stats = document.querySelectorAll('.stat-card');
    if (stats[0]) { stats[0].querySelector('small:first-child').innerText = t('power'); stats[0].querySelector('small:last-child').innerText = t('ftaSec'); }
    if (stats[1]) { stats[1].querySelector('small:first-child').innerText = t('pending'); stats[1].querySelector('small:last-child').innerText = t('fta'); }
    const megaBtn = document.querySelector('.btn-mega'); if (megaBtn) { const span = megaBtn.querySelectorAll('span')[1]; if (span) span.textContent = t('claim'); }
    // Auth tabs
    const authTabs = document.querySelectorAll('.auth-tab');
    if (authTabs[0]) authTabs[0].innerText = t('authLogin');
    if (authTabs[1]) authTabs[1].innerText = t('authRegister');
    // Login form
    const loginLabels = document.querySelectorAll('#auth-form-login .auth-field label');
    if (loginLabels[0]) loginLabels[0].innerText = t('authIdentifier');
    if (loginLabels[1]) loginLabels[1].innerText = t('authPassword');
    const loginBtn = document.querySelector('#auth-form-login .btn-login-full');
    if (loginBtn) loginBtn.innerText = t('authLoginBtn');
    // Register form
    const regLabels = document.querySelectorAll('#auth-form-register .auth-field label');
    if (regLabels[0]) regLabels[0].innerText = t('authUsername');
    if (regLabels[1]) regLabels[1].innerText = t('authEmail');
    if (regLabels[2]) regLabels[2].innerText = t('authPassword');
    if (regLabels[3]) regLabels[3].innerText = t('authConfirmPassword');
    const regBtn = document.querySelector('#auth-form-register .btn-register-full');
    if (regBtn) regBtn.innerText = t('authRegisterBtn');
  }

  updatePriceChange(token, newPrice) {
    const el = document.getElementById('change-' + token); if (!el) return;
    const now = Date.now(); const interval = 5 * 60 * 1000;
    const checkpoint = this.prevPriceCheckpoint[token];
    if (checkpoint === undefined || checkpoint === null || checkpoint === 0 || now - this.priceCheckpointTime > interval) { this.prevPriceCheckpoint[token] = newPrice; if (this.priceCheckpointTime === 0 || now - this.priceCheckpointTime > interval * 2) this.priceCheckpointTime = now; el.textContent = '0.00%'; el.className = 'token-change flat'; return; }
    const change = ((newPrice - checkpoint) / checkpoint) * 100; const abs = Math.abs(change);
    let sign = '', cls = 'flat';
    if (abs < 0.01) cls = 'flat'; else if (change > 0) { sign = '+'; cls = 'up'; } else cls = 'down';
    el.textContent = sign + change.toFixed(2) + '%'; el.className = 'token-change ' + cls;
  }

  // ═══ CHAT ASSISTANT ══════════════════════════════════════════════

  toggleChat() { const panel = document.getElementById('chat-panel'); const isActive = panel.classList.toggle('active'); if (isActive && !this.chatInitialized) { this.chatInitialized = true; setTimeout(() => this.addChatBubble('assistant', this.getWelcomeMessage()), 400); } if (isActive) setTimeout(() => document.getElementById('chat-input').focus(), 350); }
  sendChatMessage() { const input = document.getElementById('chat-input'); const msg = input.value.trim(); if (!msg) return; input.value = ''; this.addChatBubble('user', msg); const typingId = this.showTyping(); setTimeout(() => { this.removeTyping(typingId); this.addChatBubble('assistant', this.generateLocalResponse(msg)); }, 400 + Math.min(msg.length * 25, 1200) + Math.random() * 400); }
  addChatBubble(role, text) { const container = document.getElementById('chat-messages'); const bubble = document.createElement('div'); bubble.className = `chat-bubble ${role}`; bubble.textContent = text; container.appendChild(bubble); requestAnimationFrame(() => container.scrollTop = container.scrollHeight); }
  showTyping() { const container = document.getElementById('chat-messages'); const typing = document.createElement('div'); const id = 'typing-' + Date.now(); typing.id = id; typing.className = 'chat-bubble assistant'; typing.innerHTML = '<span style="letter-spacing:3px;animation:loaderTextPulse 1s infinite">● ● ●</span>'; container.appendChild(typing); container.scrollTop = container.scrollHeight; return id; }
  removeTyping(id) { const el = document.getElementById(id); if (el) el.remove(); }

  getWelcomeMessage() {
    const m = { en: "👋 Welcome! Connected ✅\nAsk me about: Mining, Swap, Wallet, Account!", fr: "👋 Bienvenue ! Connecté ✅\nDemandez-moi : Minage, Échange, Wallet, Mon Compte !", de: "👋 Willkommen! Frag mich zu: Mining, Tausch, Wallet!", zh: "👋 欢迎！问我：挖矿、兑换、钱包！", sg: "👋 Welcome! Ask about: Mining, Swap, Wallet!" };
    return m[this.currentLang] || m.en;
  }

  generateLocalResponse(msg) {
    const m = msg.toLowerCase().replace(/[?!.,;:'"]/g, '').trim();
    const conn = !!this.user; const power = this.currentRealPower || 0; const ftaP = this.ftaPriceUsd || 0;
    if (m.includes('salut') || m.includes('bonjour') || m.includes('hello') || m.includes('hi') || m.includes('你好')) return conn ? `👋 Salut ${this.profile?.username||''} ! Puissance : ${this.formatHashrate(power)}. ${this.userMachines.filter(x => x.exp > Math.floor(Date.now()/1000)).length} machine(s) active(s).` : "👋 Bienvenue ! Connectez votre wallet pour miner.";
    if (m.includes('merci') || m.includes('thanks')) return "De rien ! 😊";
    if (m.includes('aide') || m.includes('help')) return "🛠️ Aide :\n⛏️ Minage • 💱 Swap • 💰 Wallet • 👤 Mon Compte • 👥 Parrainage";
    if (m.includes('compte') || m.includes('profil') || m.includes('profile')) return "👤 Mon Compte (5e onglet) : gérez votre profil, historique, wallet et mot de passe.";
    if (m.includes('minage') || m.includes('mine') || m.includes('miner')) return conn ? `⛏️ Minage : Achetez machine → Batterie → Branchez → Réclamez ! Puissance : ${this.formatHashrate(power)}` : "⛏️ Connectez votre wallet d'abord !";
    if (m.includes('swap') || m.includes('échange') || m.includes('echange')) return `💱 Taux : 1 FTA = ${ftaP > 0 ? ftaP.toFixed(6) : '...'} USDT | Frais : 4%`;
    if (m.includes('sécurité') || m.includes('security')) return "🛡️ Ne partagez JAMAIS votre mot de passe ou phrase de récupération.";
    return "Essayez : 'minage', 'swap', 'wallet', 'compte', 'parrainage'.";
  }

  // ═══ INIT ════════════════════════════════════════════════════════

  async init() {
    this.setLanguage(this.currentLang);

    // Vérifier si l'utilisateur a une session sauvegardée
    const savedToken = localStorage.getItem('fitia_auth_token');
    const savedProfile = localStorage.getItem('fitia_profile');

    if (savedToken && savedProfile) {
      this.authToken = savedToken;
      try {
        this.profile = JSON.parse(savedProfile);
        // Vérifier que le token est toujours valide
        const data = await this.apiCall('/api/auth/me');
        if (data.user) {
          this.profile = data.user;
          localStorage.setItem('fitia_profile', JSON.stringify(data.user));
          await this.enterApp();
          return;
        }
      } catch (e) {
        // Token expiré, on efface et on affiche la page de connexion
        localStorage.removeItem('fitia_auth_token');
        localStorage.removeItem('fitia_profile');
        this.authToken = null;
        this.profile = null;
      }
    }
  }
}

// ─── Démarrage de l'application ────────────────────────────────────
const App = new Application();
App.init();
