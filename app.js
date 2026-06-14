const CONFIG = {
  MINING:    "0xa70147A41F10e84D25A97997d7e2507096F86BAD",   // <-- YOUR DEPLOYED CONTRACT
  USDT:      "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",  // Polygon USDT
  FTA:       "0x5c418b12c7e9c2A8e9A71A68c6d9b319E7B1d1fd",   // <-- YOUR FTA TOKEN
  CHAIN_ID:  137,
  WC_PROJECT_ID: "2c10ee910a836551fbabbf7c8cc4542a",
  OPENAI_API_KEY: "",
  WHATSAPP_GROUP:   "https://chat.whatsapp.com/BDsvPCB6xp8H8X0YaRmPFP",
  WHATSAPP_CHANNEL: "https://whatsapp.com/channel/0029VbCQhI38PgsPLbBJdV1e"
};

// --- i18n (unchanged) --------------------------------------------------------
const i18n = {
  en: { connect: "Connect", refTitle: "👥 Referral System", refDesc: "Enter your referrer's address to link.", bindRef: "BIND", power: "POWER", ftaSec: "Hashrate", pending: "PENDING", fta: "FTA", miningActive: "MINING ACTIVE", noMachine: "NO MACHINE", claim: "CLAIM", shopTitle: "⛏️ Shop", machines: "Machines", batteries: "Batteries", buy: "BUY", myAssets: "⚙️ Wallet & Assets", walletBal: "💰 Balances", plugMachine: "🔌 Plug in a machine", plugDesc: "Enter your offline machine ID and choose a battery.", machineId: "Machine ID (0, 1...)", plug: "PLUG IN ⚡", swapTitle: "💱 Swap", youPay: "You pay", balance: "Balance:", youReceive: "You receive", swap: "SWAP", loading: "Loading...", currentRate: "1 FTA = ", home: "Home", shop: "Shop", assets: "Wallet", swapNav: "Swap", connWallet: "Connecting...", errConn: "Connection Error", linking: "Linking...", wcIdMissing: "WalletConnect ID missing!", refLinked: "Referrer linked!", connFirst: "Connect first", enterRefAddr: "Referrer address (0x...)", buyingMachine: "Buying Machine", approveUsdt: "Approving USDT...", approveFta: "Approving FTA...", confirming: "Confirming...", calcFta: "Calculating price...", machineBought: "Machine purchased!", buyingBattery: "Buying Battery", batteryBought: "Battery purchased!", invalidId: "Invalid Machine ID", pluggingIn: "Plugging in...", pluggedIn: "Machine plugged in! ⚡", invalidAmount: "Invalid amount", swapping: "Swapping...", swapSuccess: "Swap successful!", claiming: "Claiming...", claimed: "Rewards claimed!", error: "Error", days: "Days", rig: "RIG", send: "Send", receive: "Receive", recipientAddr: "Recipient address (0x...)", amount: "Amount", confirmSend: "CONFIRM SEND", sending: "Sending...", sentSuccess: "Sent successfully!", addrCopied: "Address copied!", invalidAddr: "Invalid address", totalBal: "Total Balance", activeMachines: "⛏️ Active Machines", myMachines: "⛏️ My Machines", myBatteries: "🔋 My Batteries", active: "Active", expired: "Expired", inactive: "Inactive", available: "Available", plugged: "Plugged", notPlugged: "Not Plugged", timeRemaining: "Remaining", noMachines: "No machines yet", noBatteries: "No batteries yet", batteryLabel: "Battery", usdtPerFta: " USDT", noActiveMachines: "No active machines", exchangeRate: "Exchange Rate", priceImpact: "Price Impact", swapFee: "Swap Fee (4%)", minimumReceived: "Minimum Received", slippageTolerance: "Slippage Tolerance", networkFee: "Network Fee", errRejected: "Transaction cancelled", errInsufficientFunds: "Insufficient balance", errNetwork: "Network error. Please try again.", errTimeout: "Transaction timed out. Please try again.", errContract: "Transaction failed. Please try again.", errGeneric: "An error occurred. Please try again.", errAlreadyPending: "A transaction is already pending. Please wait.", errNonce: "Transaction nonce error. Please restart the app.", errNoLiquidity: "Not enough liquidity. Try a smaller amount or swap USDT→FTA first.", syncNote: "Asset data is stored locally. If you clear browser data, your machine/battery list will reset (funds are always safe on-chain)." },
  fr: { connect: "Connecter", refTitle: "👥 Parrainage", refDesc: "Entrez l'adresse de votre parrain.", bindRef: "LIER", power: "PUISSANCE", ftaSec: "Hashrate", pending: "EN ATTENTE", fta: "FTA", miningActive: "MINAGE ACTIF", noMachine: "AUCUNE MACHINE", claim: "RÉCLAMER", shopTitle: "⛏️ Boutique", machines: "Machines", batteries: "Batteries", buy: "ACHETER", myAssets: "⚙️ Wallet & Actifs", walletBal: "💰 Soldes", plugMachine: "🔌 Brancher une machine", plugDesc: "Entrez l'ID de votre machine.", machineId: "ID Machine (0, 1...)", plug: "BRANCHER ⚡", swapTitle: "💱 Échange", youPay: "Vous payez", balance: "Solde:", youReceive: "Vous recevez", swap: "ÉCHANGER", loading: "Chargement...", currentRate: "1 FTA = ", home: "Accueil", shop: "Boutique", assets: "Wallet", swapNav: "Swap", connWallet: "Connexion...", errConn: "Erreur connexion", linking: "Liaison...", wcIdMissing: "ID WalletConnect manquant!", refLinked: "Parrain lié!", connFirst: "Connectez-vous d'abord", enterRefAddr: "Adresse parrain (0x...)", buyingMachine: "Achat Machine", approveUsdt: "Approbation USDT...", approveFta: "Approbation FTA...", confirming: "Confirmation...", calcFta: "Calcul prix...", machineBought: "Machine achetée!", buyingBattery: "Achat Batterie", batteryBought: "Batterie achetée!", invalidId: "ID Machine invalide", pluggingIn: "Branchement...", pluggedIn: "Machine branchée! ⚡", invalidAmount: "Montant invalide", swapping: "Swap...", swapSuccess: "Échange réussi!", claiming: "Claim...", claimed: "Gains réclamés!", error: "Erreur", days: "Jours", rig: "RIG", send: "Envoyer", receive: "Recevoir", recipientAddr: "Adresse destinataire (0x...)", amount: "Montant", confirmSend: "CONFIRMER ENVOI", sending: "Envoi...", sentSuccess: "Envoi réussi!", addrCopied: "Adresse copiée!", invalidAddr: "Adresse invalide", totalBal: "Solde Total", activeMachines: "⛏️ Machines Actives", myMachines: "⛏️ Mes Machines", myBatteries: "🔋 Mes Batteries", active: "Actif", expired: "Expiré", inactive: "Inactif", available: "Disponible", plugged: "Branché", notPlugged: "Non branché", timeRemaining: "Restant", noMachines: "Aucune machine", noBatteries: "Aucune batterie", batteryLabel: "Batterie", usdtPerFta: " USDT", noActiveMachines: "Aucune machine active", exchangeRate: "Taux de change", priceImpact: "Impact prix", swapFee: "Frais swap (4%)", minimumReceived: "Minimum reçu", slippageTolerance: "Tolérance slippage", networkFee: "Frais réseau", errRejected: "Transaction annulée", errInsufficientFunds: "Solde insuffisant", errNetwork: "Erreur réseau. Veuillez réessayer.", errTimeout: "Délai expiré. Veuillez réessayer.", errContract: "Transaction échouée. Veuillez réessayer.", errGeneric: "Une erreur est survenue. Veuillez réessayer.", errAlreadyPending: "Une transaction est en cours. Veuillez patienter.", errNonce: "Erreur de nonce. Veuillez redémarrer l'application.", errNoLiquidity: "Liquidité insuffisante. Essayez un montant plus petit ou swap USDT→FTA d'abord.", syncNote: "Les données sont stockées localement. Si vous effacez le navigateur, la liste machines/batteries sera réinitialisée (les fonds restent sur la blockchain)." },
  de: { connect: "Verbinden", refTitle: "👥 Empfehlung", refDesc: "Empfehler-Adresse eingeben.", bindRef: "BINDEN", power: "LEISTUNG", ftaSec: "Hashrate", pending: "AUSSTEHEND", fta: "FTA", miningActive: "MINING AKTIV", noMachine: "KEINE MASCHINE", claim: "EINFORDERN", shopTitle: "⛏️ Shop", machines: "Maschinen", batteries: "Batterien", buy: "KAUFEN", myAssets: "⚙️ Wallet & Assets", walletBal: "💰 Guthaben", plugMachine: "🔌 Maschine anschließen", plugDesc: "Offline-Maschine ID eingeben.", machineId: "Maschinen-ID (0, 1...)", plug: "ANSCHLIESSEN ⚡", swapTitle: "💱 Tausch", youPay: "Sie zahlen", balance: "Guthaben:", youReceive: "Sie erhalten", swap: "TAUSCHEN", loading: "Laden...", currentRate: "1 FTA = ", home: "Home", shop: "Shop", assets: "Wallet", swapNav: "Swap", connWallet: "Verbindung...", errConn: "Verbindungsfehler", linking: "Verknüpfung...", wcIdMissing: "WalletConnect-ID fehlt!", refLinked: "Empfehler verknüpft!", connFirst: "Zuerst verbinden", enterRefAddr: "Empfehler-Adresse (0x...)", buyingMachine: "Kaufe Maschine", approveUsdt: "USDT genehmigen...", approveFta: "FTA genehmigen...", confirming: "Bestätigung...", calcFta: "Preis berechnen...", machineBought: "Maschine gekauft!", buyingBattery: "Kaufe Batterie", batteryBought: "Batterie gekauft!", invalidId: "Ungültige ID", pluggingIn: "Anschließen...", pluggedIn: "Maschine angeschlossen! ⚡", invalidAmount: "Ungültiger Betrag", swapping: "Tauschen...", swapSuccess: "Tausch erfolgreich!", claiming: "Einforderung...", claimed: "Eingefordert!", error: "Fehler", days: "Tage", rig: "RIG", send: "Senden", receive: "Empfangen", recipientAddr: "Empfängeradresse (0x...)", amount: "Betrag", confirmSend: "SENDUNG BESTÄTIGEN", sending: "Senden...", sentSuccess: "Gesendet!", addrCopied: "Kopiert!", invalidAddr: "Ungültige Adresse", totalBal: "Gesamtguthaben", activeMachines: "⛏️ Aktive Maschinen", myMachines: "⛏️ Meine Maschinen", myBatteries: "🔋 Meine Batterien", active: "Aktiv", expired: "Abgelaufen", inactive: "Inaktiv", available: "Verfügbar", plugged: "Angeschlossen", notPlugged: "Nicht angeschlossen", timeRemaining: "Verbleibend", noMachines: "Keine Maschinen", noBatteries: "Keine Batterien", batteryLabel: "Batterie", usdtPerFta: " USDT", noActiveMachines: "Keine aktive Maschinen", exchangeRate: "Wechselkurs", priceImpact: "Preisauswirkung", swapFee: "Swapgebühr (4%)", minimumReceived: "Mindestbetrag", slippageTolerance: "Slippage-Toleranz", networkFee: "Netzwerkgebühr", errRejected: "Transaktion abgebrochen", errInsufficientFunds: "Unzureichendes Guthaben", errNetwork: "Netzwerkfehler. Bitte versuchen Sie es erneut.", errTimeout: "Zeitüberschreitung. Bitte versuchen Sie es erneut.", errContract: "Transaktion fehlgeschlagen. Bitte versuchen Sie es erneut.", errGeneric: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.", errAlreadyPending: "Eine Transaktion ist bereits ausstehend. Bitte warten Sie.", errNonce: "Nonce-Fehler. Bitte starten Sie die App neu.", errNoLiquidity: "Nicht genug Liquidität. Kleinere Menge versuchen oder zuerst USDT→FTA tauschen.", syncNote: "Anlagendaten sind lokal gespeichert. Browserdaten löschen setzt Maschinen-/Batterieliste zurück (Guthaben bleiben on-chain)." },
  zh: { connect: "连接", refTitle: "👥 推荐系统", refDesc: "输入推荐人地址进行绑定。", bindRef: "绑定", power: "算力", ftaSec: "Hashrate", pending: "待领取", fta: "FTA", miningActive: "挖矿中", noMachine: "无机器", claim: "领取", shopTitle: "⛏️ 商店", machines: "矿机", batteries: "电池", buy: "购买", myAssets: "⚙️ 钱包与资产", walletBal: "💰 余额", plugMachine: "🔌 插入机器", plugDesc: "输入离线机器ID并选择电池。", machineId: "机器ID (0, 1...)", plug: "插入 ⚡", swapTitle: "💱 兑换", youPay: "您支付", balance: "余额:", youReceive: "您收到", swap: "兑换", loading: "加载中...", currentRate: "1 FTA = ", home: "首页", shop: "商店", assets: "钱包", swapNav: "兑换", connWallet: "连接中...", errConn: "连接错误", linking: "绑定中...", wcIdMissing: "缺少 WalletConnect ID！", refLinked: "推荐人绑定成功！", connFirst: "请先连接", enterRefAddr: "推荐人地址 (0x...)", buyingMachine: "购买机器", approveUsdt: "授权 USDT...", approveFta: "授权 FTA...", confirming: "确认中...", calcFta: "计算价格...", machineBought: "机器购买成功！", buyingBattery: "购买电池", batteryBought: "电池购买成功！", invalidId: "无效ID", pluggingIn: "插入中...", pluggedIn: "机器插入成功！ ⚡", invalidAmount: "无效金额", swapping: "兑换中...", swapSuccess: "兑换成功！", claiming: "领取中...", claimed: "奖励已领取！", error: "错误", days: "天", rig: "矿机", send: "发送", receive: "接收", recipientAddr: "接收方地址 (0x...)", amount: "金额", confirmSend: "确认发送", sending: "发送中...", sentSuccess: "发送成功！", addrCopied: "地址已复制！", invalidAddr: "无效地址", totalBal: "总余额", activeMachines: "⛏️ 运行中矿机", myMachines: "⛏️ 我的矿机", myBatteries: "🔋 我的电池", active: "运行中", expired: "已过期", inactive: "未激活", available: "可用", plugged: "已插入", notPlugged: "未插入", timeRemaining: "剩余", noMachines: "暂无矿机", noBatteries: "暂无电池", batteryLabel: "电池", usdtPerFta: " USDT", noActiveMachines: "无运行中矿机", exchangeRate: "汇率", priceImpact: "价格影响", swapFee: "手续费 (4%)", minimumReceived: "最低收到", slippageTolerance: "滑点容忍度", networkFee: "网络费", errRejected: "交易已取消", errInsufficientFunds: "余额不足", errNetwork: "网络错误，请重试。", errTimeout: "交易超时，请重试。", errContract: "交易失败，请重试。", errGeneric: "发生错误，请重试。", errAlreadyPending: "已有交易待处理，请稍候。", errNonce: "Nonce错误，请重启应用。", errNoLiquidity: "流动性不足。请尝试较小金额或先兑换USDT→FTA。", syncNote: "资产数据存储在本地。清除浏览器数据会重置机器/电池列表（资金始终在链上安全）。" },
  sg: { connect: "Connect", refTitle: "👥 Referral System", refDesc: "Enter your referrer's address to link.", bindRef: "BIND", power: "POWER", ftaSec: "Hashrate", pending: "PENDING", fta: "FTA", miningActive: "MINING ACTIVE", noMachine: "NO MACHINE", claim: "CLAIM", shopTitle: "⛏️ Shop", machines: "Machines", batteries: "Batteries", buy: "BUY", myAssets: "⚙️ Wallet & Assets", walletBal: "💰 Balances", plugMachine: "🔌 Plug in a machine", plugDesc: "Enter your offline machine ID and choose a battery.", machineId: "Machine ID (0, 1...)", plug: "PLUG IN ⚡", swapTitle: "💱 Swap", youPay: "You pay", balance: "Balance:", youReceive: "You receive", swap: "SWAP", loading: "Loading...", currentRate: "1 FTA = ", home: "Home", shop: "Shop", assets: "Wallet", swapNav: "Swap", connWallet: "Connecting...", errConn: "Connection Error", linking: "Linking...", wcIdMissing: "WalletConnect ID missing!", refLinked: "Referrer linked!", connFirst: "Connect first", enterRefAddr: "Referrer address (0x...)", buyingMachine: "Buying Machine", approveUsdt: "Approving USDT...", approveFta: "Approving FTA...", confirming: "Confirming...", calcFta: "Calculating price...", machineBought: "Machine purchased!", buyingBattery: "Buying Battery", batteryBought: "Battery purchased!", invalidId: "Invalid Machine ID", pluggingIn: "Plugging in...", pluggedIn: "Machine plugged in! ⚡", invalidAmount: "Invalid amount", swapping: "Swapping...", swapSuccess: "Swap successful!", claiming: "Claiming...", claimed: "Rewards claimed!", error: "Error", days: "Days", rig: "RIG", send: "Send", receive: "Receive", recipientAddr: "Recipient address (0x...)", amount: "Amount", confirmSend: "CONFIRM SEND", sending: "Sending...", sentSuccess: "Sent successfully!", addrCopied: "Address copied!", invalidAddr: "Invalid address", totalBal: "Total Balance", activeMachines: "⛏️ Active Machines", myMachines: "⛏️ My Machines", myBatteries: "🔋 My Batteries", active: "Active", expired: "Expired", inactive: "Inactive", available: "Available", plugged: "Plugged", notPlugged: "Not Plugged", timeRemaining: "Remaining", noMachines: "No machines yet", noBatteries: "No batteries yet", batteryLabel: "Battery", usdtPerFta: " USDT", noActiveMachines: "No active machines", exchangeRate: "Exchange Rate", priceImpact: "Price Impact", swapFee: "Swap Fee (4%)", minimumReceived: "Minimum Received", slippageTolerance: "Slippage Tolerance", networkFee: "Network Fee", errRejected: "Transaction cancelled", errInsufficientFunds: "Insufficient balance", errNetwork: "Network error. Please try again.", errTimeout: "Transaction timed out. Please try again.", errContract: "Transaction failed. Please try again.", errGeneric: "An error occurred. Please try again.", errAlreadyPending: "A transaction is already pending. Please wait.", errNonce: "Transaction nonce error. Please restart the app.", errNoLiquidity: "Not enough liquidity. Try a smaller amount or swap USDT→FTA first.", syncNote: "Asset data is stored locally. If you clear browser data, your machine/battery list will reset (funds are always safe on-chain)." }
};

// --- Chat intents (unchanged) -------------------------------------------------
const CHAT_INTENTS = {
  greeting: { weight: 2, keywords: { all: ['hello','hi','hey','hola'], en: ['good morning','good evening','howdy','greetings','sup','whats up'], fr: ['bonjour','salut','coucou','bonsoir','yo'], de: ['hallo','guten tag','moin','servus'], zh: ['你好','您好','嗨','早上好','晚上好'] } },
  goodbye: { weight: 2, keywords: { all: ['bye','goodbye','see you'], fr: ['au revoir','à bientôt','adieu'], de: ['tschüss','auf wiedersehen'], zh: ['再见','拜拜'] } },
  thanks: { weight: 2, keywords: { all: ['thanks','thank you','thx','ty','merci','danke','谢谢'] } },
  help: { weight: 3, keywords: { all: ['help','aide','hilfe','帮助','guide','how to use','what can you do'], en: ['assist','support','lost','confused'], fr: ['aider','perdu','confus'], de: ['anleitung','verloren'], zh: ['帮忙','指导','不懂'] } },
  mining: { weight: 2, keywords: { all: ['mining','mine','miner','minage','挖矿','hashrate','power','算力'], en: ['how to mine','start mining','mining reward'], fr: ['comment miner','démarrer minage'], de: ['mining starten','mining belohnung'], zh: ['如何挖矿','开始挖矿'] } },
  buy_machine: { weight: 3, keywords: { all: ['buy machine','acheter machine','kaufen maschine','购买矿机','shop machine','rig'], en: ['buy rig','get machine','machine price','best machine','which machine'], fr: ['quelle machine','prix machine'], de: ['maschine kaufen','maschinenpreis'], zh: ['买矿机','矿机价格','哪个矿机'] } },
  buy_battery: { weight: 3, keywords: { all: ['battery','batterie','电池'], en: ['buy battery','battery price','battery duration','which battery'], fr: ['acheter batterie','durée batterie'], de: ['batterie kaufen','batteriedauer'], zh: ['买电池','电池价格','哪个电池'] } },
  plug_in: { weight: 3, keywords: { all: ['plug','activate','brancher','anschließen','插入','connect machine','start machine'], en: ['plug in','activate machine','how to start mining','turn on'], fr: ['brancher machine','activer machine'], de: ['maschine aktivieren'], zh: ['插入机器','激活矿机','启动机器'] } },
  claim: { weight: 3, keywords: { all: ['claim','reward','réclamer','领取','harvest','withdraw reward'], en: ['claim rewards','pending rewards','collect'], fr: ['récompenses en attente'], de: ['belohnung beanspruchen'], zh: ['领取奖励','待领取'] } },
  swap: { weight: 3, keywords: { all: ['swap','exchange','échange','tausch','兑换','trade','convert'], en: ['swap tokens','exchange rate','swap usdt','how to swap'], fr: ['échanger tokens','taux de change'], de: ['token tauschen','wechselkurs'], zh: ['兑换代币','汇率','如何兑换'] } },
  wallet: { weight: 2, keywords: { all: ['wallet','balance','solde','guthaben','钱包','余额','send','receive'], en: ['my balance','send tokens','withdraw','transfer'], fr: ['mon solde','envoyer tokens'], de: ['mein guthaben','tokens senden'], zh: ['我的余额','转账'] } },
  referral: { weight: 2, keywords: { all: ['referral','parrain','empfehlung','推荐','invite','referrer'], en: ['how to refer','referral bonus','invite friend'], fr: ['comment parrainer'], de: ['wie empfehlen'], zh: ['如何推荐','邀请'] } },
  connect: { weight: 3, keywords: { all: ['connect','connexion','verbinden','连接','metamask','walletconnect','login'], en: ['connect wallet','link wallet','sign in'], fr: ['connecter wallet'], de: ['wallet verbinden'], zh: ['连接钱包','登录'] } },
  what_is_fta: { weight: 2, keywords: { all: ['what is fta','was ist fta','fta是什么','about fta','fta token'] } },
  how_it_works: { weight: 2, keywords: { all: ['how it works','comment ça marche','wie funktioniert','怎么运作','getting started','beginner'] } },
  earn_more: { weight: 2, keywords: { all: ['earn more','gagner plus','mehr verdienen','赚更多','profit','strategy','passive income'] } },
  price: { weight: 2, keywords: { all: ['price','prix','preis','价格','rate','cost'] } },
  error: { weight: 3, keywords: { all: ['error','erreur','fehler','错误','problem','issue','not working','failed'] } },
  status: { weight: 2, keywords: { all: ['status','état','状态','my mining','current power','my progress'] } },
  network: { weight: 2, keywords: { all: ['polygon','matic','pol','network','chain','réseau','netzwerk','网络','gas fee'] } },
  whatsapp: { weight: 3, keywords: { all: ['whatsapp','community','group','telegram','discord','社群','群','社区','contact','support team'] } },
  crypto_basics: { weight: 2, keywords: { all: ['crypto','cryptocurrency','blockchain','加密','区块链','what is blockchain','what is crypto'] } },
  metamask_help: { weight: 3, keywords: { all: ['metamask','trust wallet','wallet setup','install wallet','create wallet'] } },
  security: { weight: 3, keywords: { all: ['security','safe','scam','hack','secure','安全','骗局','seed phrase','private key'] } },
  deposit: { weight: 3, keywords: { all: ['deposit','add funds','fund wallet','top up','充值','入金','存入','转入'] } },
  withdraw: { weight: 3, keywords: { all: ['withdraw','cash out','提现','取出','转出'] } },
  profit: { weight: 2, keywords: { all: ['profit','roi','return','profitable','收益','回报','划算'] } },
  machine_comparison: { weight: 2, keywords: { all: ['compare','difference','which one','vs','better','比较','区别','哪个好'] } },
  battery_duration: { weight: 2, keywords: { all: ['duration','how long','last','lifetime','持续时间','多久','有效期'] } },
  app_navigation: { weight: 2, keywords: { all: ['navigate','where is','find','location','menu','tab','导航','在哪','找不到','页面'] } },
  transaction_speed: { weight: 2, keywords: { all: ['slow','fast','speed','pending transaction','confirm time','速度','慢','确认时间'] } }
};

// --- Match actual contract signatures ONLY ------------------------------------
const MINING_ABI = [
  // View – machine/battery types (global catalogue)
  "function getMachineCount() view returns (uint256)",
  "function getBatteryCount() view returns (uint256)",
  "function machineTypes(uint256) view returns (uint256 price, uint256 power)",
  "function batteryTypes(uint256) view returns (uint256 price, uint256 duration)",

  // View – user
  "function getActivePower(address) view returns (uint256)",
  "function users(address,uint256) view returns (uint256 typeId, uint256 expiresAt)",

  // View – rates & pricing
  "function getCurrentRate() view returns (uint256)",
  "function getUsdtOutForFtaSell(uint256) view returns (uint256)",
  "function getFtaOutForUsdtBuy(uint256) view returns (uint256)",
  "function getFtaCostForUsdtSell(uint256) view returns (uint256)",
  "function difficultyMultiplier() view returns (uint256)",
  "function netFtaSold() view returns (uint256)",

  // State-changing
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

// --- Constants matched to contract --------------------------------------------
const SWAP_FEE_RATE   = 0.04;   // Contract: swapFee = 4  → 4 %     (was 0.003)
const SLIPPAGE        = 0.005;  // 0.5 % display tolerance
const DEV_FEE_MACHINE = 5;      // Contract: devFeeMachine = 5
const COMMISSION      = [3,2,1];// Contract: commissionRates
const TOTAL_FEES_PCT  = 5+3+2+1; // 11 % – used for FTA payment buffer

// --- Application class --------------------------------------------------------
class Application {
  constructor() {
    this.provider          = null;
    this.signer            = null;
    this.contracts         = {};
    this.user              = null;
    this.payMode           = 'USDT';
    this.shopViewMode      = 'machines';
    this.swapDirection     = 'USDT_TO_FTA';
    this.ftaDecimals       = 18;
    this.usdtDecimals      = 6;
    this.currentDifficulty = 1n;         // raw from contract difficultyMultiplier()
    this.currentRealPower  = 0;          // raw power sum from getActivePower
    this.pendingBalance    = 0;
    this.miningTimer       = null;

    // localStorage keys
    this.STORAGE_CLAIM     = "fitia_last_claim_time_v4";
    this.STORAGE_MACHINES  = "fitia_machines_v2";
    this.STORAGE_BATTERIES = "fitia_batteries_v2";

    // local cache
    this.shopMachinesData    = [];
    this.shopBatteriesData   = [];
    this.isLoadingShop       = false;
    this.polPriceUsd         = 0;
    this.ftaPriceUsd         = 0;

    // local user asset state (from localStorage; contract does not expose arrays)
    this.userMachines        = [];   // {typeId, expiresAt, pluggedBatteryType, boughtAt}
    this.userBatteries       = {};   // {typeId: count}
    this.userLastClaimTime   = 0;
    this.batteryTypeDurations= {};

    // UI
    this.vizContext          = null;
    this.vizBars             = [];
    this.sendTokenSymbol     = 'POL';
    this.chatInitialized     = false;
    this.chatHistory         = [];
    this.netFtaSold          = 0n;   // cached from contract

    const savedLang = localStorage.getItem('fitia_lang');
    this.currentLang = savedLang && i18n[savedLang] ? savedLang : 'en';
  }

  // ========= i18n helpers =====================================================
  t(key) { return i18n[this.currentLang]?.[key] || i18n['en'][key] || key; }
  formatUsd(v) { return '$' + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

  formatHashrate(h) {
    if (h <= 0) return '0 H/s';
    // h is the raw integer from getActivePower (e.g. 5000, 1000000)
    const units = ['H/s', 'KH/s', 'MH/s', 'GH/s', 'TH/s', 'PH/s'];
    let value = h, unitIndex = 0;
    while (value >= 1000 && unitIndex < units.length - 1) { value /= 1000; unitIndex++; }
    return value.toFixed(2) + ' ' + units[unitIndex];
  }

  formatTimeRemaining(s) {
    if (s <= 0) return this.t('expired');
    const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60);
    if (d > 1) return `${d}d ${h}h`; if (d === 1) return `1d ${h}h`; if (h > 0) return `${h}h ${m}m`; return `${m}m`;
  }

  getBatteryDuration(typeId) {
    if (this.batteryTypeDurations[typeId] !== undefined) return this.batteryTypeDurations[typeId];
    return { 0:3,1:7,2:15,3:30,4:90,5:180,6:270,7:365 }[typeId] || 30;
  }

  // ========= localStorage asset persistence ====================================
  _loadLocalAssets() {
    try {
      const m = localStorage.getItem(this.STORAGE_MACHINES);
      this.userMachines = m ? JSON.parse(m) : [];
    } catch(e) { this.userMachines = []; }
    try {
      const b = localStorage.getItem(this.STORAGE_BATTERIES);
      this.userBatteries = b ? JSON.parse(b) : {};
    } catch(e) { this.userBatteries = {}; }
    try {
      this.userLastClaimTime = parseInt(localStorage.getItem(this.STORAGE_CLAIM)) || Math.floor(Date.now()/1000);
    } catch(e) { this.userLastClaimTime = Math.floor(Date.now()/1000); }
  }

  _saveLocalAssets() {
    localStorage.setItem(this.STORAGE_MACHINES,  JSON.stringify(this.userMachines));
    localStorage.setItem(this.STORAGE_BATTERIES, JSON.stringify(this.userBatteries));
    localStorage.setItem(this.STORAGE_CLAIM,     String(this.userLastClaimTime || Math.floor(Date.now()/1000)));
  }

  // ========= language & init ==================================================
  setLanguage(lang) {
    if (!i18n[lang]) return;
    this.currentLang = lang; localStorage.setItem('fitia_lang', lang);
    const flags = { en:'🇬🇧', fr:'🇫🇷', de:'🇩🇪', zh:'🇨🇳', sg:'🇸🇬' };
    document.getElementById('lang-btn-display').innerText = `${flags[lang]} ${lang.toUpperCase()}`;
    this.applyTranslations(); this.renderShop();
  }

  applyTranslations() {
    const setText = (sel, key) => { const el = document.querySelector(sel); if (el) el.innerText = this.t(key); };
    const setPH   = (sel, key) => { const el = document.querySelector(sel); if (el) el.placeholder = this.t(key); };
    setText('#btn-connect', 'connect');
    setText('.total-balance-card small', 'totalBal');
    setText('.referral-card h3', 'refTitle');
    setText('.referral-card p.small-text', 'refDesc');
    setPH('#ref-address-input', 'enterRefAddr');
    setText('.referral-card .btn-full', 'bindRef');
    const stats = document.querySelectorAll('.stat-card');
    if (stats[0]) { stats[0].querySelector('small:first-child').innerText = this.t('power'); stats[0].querySelector('small:last-child').innerText = this.t('ftaSec'); }
    if (stats[1]) { stats[1].querySelector('small:first-child').innerText = this.t('pending'); stats[1].querySelector('small:last-child').innerText = this.t('fta'); }
    const megaBtn = document.querySelector('.btn-mega span:last-child');
    if (megaBtn) megaBtn.textContent = this.t('claim');
    setText('#view-shop .view-title', 'shopTitle');
    const tabs = document.querySelectorAll('.shop-tab');
    if (tabs[0]) tabs[0].innerText = this.t('machines');
    if (tabs[1]) tabs[1].innerText = this.t('batteries');
    setText('#view-my-rigs .view-title', 'myAssets');
    setText('#active-machines-section .section-title', 'activeMachines');
    const wc = document.querySelectorAll('#view-my-rigs .card');
    if (wc[1]) wc[1].querySelector('.section-title').innerText = this.t('myMachines');
    if (wc[2]) wc[2].querySelector('.section-title').innerText = this.t('myBatteries');
    setText('#view-swap .view-title', 'swapTitle');
    const sh = document.querySelectorAll('.swap-header span:first-child');
    if (sh[0]) sh[0].innerText = this.t('youPay');
    if (sh[1]) sh[1].innerText = this.t('youReceive');
    setText('#view-swap .btn-primary', 'swap');
    document.querySelectorAll('.nav-item span').forEach((s, i) => s.innerText = this.t(['home','shop','assets','swapNav'][i]));
  }

  async init() { this.setLanguage(this.currentLang); }

  // ========= market prices ====================================================
  async fetchMarketPrices() {
    this.polPriceUsd = 0;
    try {
      const r = await fetch('https://api.dexscreener.com/latest/dex/tokens/0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0');
      const d = await r.json(); if (d.pairs?.length) this.polPriceUsd = parseFloat(d.pairs[0].priceUsd) || 0;
    } catch(e) {}
    if (!this.polPriceUsd) {
      try {
        const r = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd');
        const d = await r.json(); this.polPriceUsd = d['matic-network']?.usd || 0;
      } catch(e2) {}
    }
    if (!this.polPriceUsd) this.polPriceUsd = 0.70;
  }

  // ========= wallet connect ===================================================
  async connect() {
    if (window.ethereum) {
      this.setLoader(true, this.t('connWallet'));
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        this.provider = new ethers.BrowserProvider(window.ethereum);
        this.signer   = await this.provider.getSigner();
        this.user     = await this.signer.getAddress();
        const network = await this.provider.getNetwork();
        if (Number(network.chainId) !== CONFIG.CHAIN_ID) await this.switchNetwork();
        this.initContracts();
        window.ethereum.on('accountsChanged', () => window.location.reload());
        window.ethereum.on('chainChanged',    () => window.location.reload());
      } catch(e) { this.showError(e); } finally { this.setLoader(false); }
    } else if (typeof EthereumProvider !== 'undefined' && CONFIG.WC_PROJECT_ID && !CONFIG.WC_PROJECT_ID.includes("...")) {
      this.setLoader(true, this.t('connWallet'));
      try {
        const wc = await EthereumProvider.init({
          projectId: CONFIG.WC_PROJECT_ID, chains: [CONFIG.CHAIN_ID], showQrModal: true,
          methods: ['eth_sendTransaction','personal_sign'],
          metadata: { name: 'FITIA PRO MINER', description: 'Mining DApp', url: window.location.origin, icons: [window.location.origin + '/logo.png'] }
        });
        await wc.enable();
        this.provider = new ethers.BrowserProvider(wc);
        this.signer   = await this.provider.getSigner();
        this.user     = await this.signer.getAddress();
        this.initContracts();
        wc.on("disconnect", () => window.location.reload());
      } catch(e) { this.showError(e); } finally { this.setLoader(false); }
    } else {
      this.showToast(CONFIG.WC_PROJECT_ID?.includes("...") ? this.t('wcIdMissing') : "Please install MetaMask or use a Web3 browser.", true);
    }
  }

  async initContracts() {
    this.contracts.usdt   = new ethers.Contract(CONFIG.USDT,   ERC20_ABI,   this.signer);
    this.contracts.fta    = new ethers.Contract(CONFIG.FTA,    ERC20_ABI,   this.signer);
    this.contracts.mining = new ethers.Contract(CONFIG.MINING, MINING_ABI,  this.signer);
    try { this.ftaDecimals  = Number(await this.contracts.fta.decimals()); }  catch(e) { this.ftaDecimals  = 18; }
    try { this.usdtDecimals = Number(await this.contracts.usdt.decimals()); } catch(e) { this.usdtDecimals = 6;  }
    document.getElementById('btn-connect').classList.add('hidden');
    document.getElementById('wallet-status').classList.remove('hidden');
    document.getElementById('addr-display').innerText = this.user.slice(0,6) + "..." + this.user.slice(-4);
    // Load local asset state & initialise claim time
    this._loadLocalAssets();
    if (!localStorage.getItem(this.STORAGE_CLAIM)) {
      this.userLastClaimTime = Math.floor(Date.now()/1000);
      this._saveLocalAssets();
    }
    await this.fetchMarketPrices();
    await this.cacheBatteryDurations();
    await this.updateData();
    // Refresh every 15 s
    setInterval(() => this.updateData(), 15000);
    this.initVisualizer();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  async cacheBatteryDurations() {
    try {
      const c = Number(await this.contracts.mining.getBatteryCount());
      for (let i = 0; i < c; i++) {
        try {
          const b = await this.contracts.mining.batteryTypes(i);
          this.batteryTypeDurations[i] = Number(b.duration) / 86400;
        } catch(e) {}
      }
    } catch(e) {}
  }

  async switchNetwork() {
    try {
      await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x89' }] });
    } catch(e) {
      if (e.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{ chainId: '0x89', chainName: 'Polygon', nativeCurrency: { name:'MATIC', symbol:'MATIC', decimals:18 }, rpcUrls: ['https://polygon-rpc.com/'], blockExplorerUrls: ['https://polygonscan.com/'] }]
        });
      }
    }
  }

  // ========= main data refresh ================================================
  async updateData() {
    if (!this.user) return;
    try {
      // ----- read on-chain power & difficulty -----
      const rawPower = await this.contracts.mining.getActivePower(this.user);
      // getActivePower returns a raw uint256 (sum of machine powers), NOT 18-decimal token amount
      this.currentRealPower = Number(rawPower);

      try { this.currentDifficulty = BigInt(await this.contracts.mining.difficultyMultiplier()); } catch(e) {}
      try { this.netFtaSold = BigInt(await this.contracts.mining.netFtaSold()); } catch(e) {}

      // ----- pending rewards (local calculation) -----
      const now = Math.floor(Date.now() / 1000);
      const elapsed = now - this.userLastClaimTime;
      if (this.currentRealPower > 0 && elapsed > 0) {
        // Contract formula: (timeDelta * power * difficultyMultiplier) / 1e18
        // power = raw integer, difficulty = uint256 (default 2*10^12)
        // Rewards per second = (power * difficulty) / 1e18
        const rewardPerSec = (this.currentRealPower * Number(this.currentDifficulty)) / 1e18;
        this.pendingBalance = rewardPerSec * elapsed;
        document.getElementById('val-pending').innerText = this.pendingBalance.toFixed(5);
        document.getElementById('viz-status').innerText = this.t('miningActive');
        document.getElementById('viz-status').style.color = "var(--primary)";
      } else {
        this.pendingBalance = 0;
        document.getElementById('val-pending').innerText = "0.00000";
        document.getElementById('viz-status').innerText = this.t('noMachine');
        document.getElementById('viz-status').style.color = "#666";
      }

      // ----- visualiser -----
      this.updateVisualizerIntensity(this.currentRealPower);

      // start or stop the local counter
      if (this.currentRealPower > 0) {
        if (!this.miningTimer) this.startMiningCounter();
      } else {
        this.stopMiningCounter();
      }

      // ----- hashrate display -----
      document.getElementById('val-power').innerText = this.formatHashrate(this.currentRealPower);

      // ----- token balances (on-chain) -----
      const polBal  = await this.provider.getBalance(this.user);
      const usdtBal = await this.contracts.usdt.balanceOf(this.user);
      const ftaBal  = await this.contracts.fta.balanceOf(this.user);

      const pB = parseFloat(ethers.formatUnits(polBal, 18));
      const uB = parseFloat(ethers.formatUnits(usdtBal, this.usdtDecimals));
      const fB = parseFloat(ethers.formatUnits(ftaBal, this.ftaDecimals));

      document.getElementById('bal-pol-2').innerText  = pB.toFixed(4);
      document.getElementById('bal-usdt-2').innerText = uB.toFixed(2);
      document.getElementById('bal-fta-2').innerText  = fB.toFixed(4);

      // ----- FTA price (from contract getCurrentRate) -----
      const rate = await this.contracts.mining.getCurrentRate();
      this.ftaPriceUsd = parseFloat(ethers.formatUnits(rate, this.ftaDecimals));

      // price displays
      document.getElementById('price-pol').innerText  = this.formatUsd(this.polPriceUsd);
      document.getElementById('price-usdt').innerText = this.formatUsd(1);
      document.getElementById('price-fta').innerText  = this.formatUsd(this.ftaPriceUsd);
      document.getElementById('bal-pol-2-usd').innerText  = '≈ ' + this.formatUsd(pB * this.polPriceUsd);
      document.getElementById('bal-usdt-2-usd').innerText = '≈ ' + this.formatUsd(uB);
      document.getElementById('bal-fta-2-usd').innerText  = '≈ ' + this.formatUsd(fB * this.ftaPriceUsd);
      document.getElementById('val-total-usd').innerText = this.formatUsd(pB * this.polPriceUsd + uB + fB * this.ftaPriceUsd);

      // swap rate text
      document.getElementById('swap-rate').innerText = this.t('currentRate') + this.ftaPriceUsd.toFixed(6) + this.t('usdtPerFta');

      // swap balance display
      const fromDec = this.swapDirection === 'USDT_TO_FTA' ? this.usdtDecimals : this.ftaDecimals;
      const toDec   = this.swapDirection === 'USDT_TO_FTA' ? this.ftaDecimals : this.usdtDecimals;
      document.getElementById('swap-bal-from').innerText = parseFloat(ethers.formatUnits(this.swapDirection === 'USDT_TO_FTA' ? usdtBal : ftaBal, fromDec)).toFixed(4);
      document.getElementById('swap-bal-to').innerText   = parseFloat(ethers.formatUnits(this.swapDirection === 'USDT_TO_FTA' ? ftaBal : usdtBal, toDec)).toFixed(4);

      // ----- shop catalogue -----
      await this.renderShop();

      // ----- render asset UIs from localStorage -----
      this.renderActiveMachines();
      this.renderUserMachines();
      this.renderUserBatteries();

      if (document.getElementById('swap-from-in').value) this.calcSwap();
    } catch(e) { console.error("Refresh Error", e); }
  }

  // ========= mining counter ===================================================
  startMiningCounter() {
    if (this.miningTimer) return;
    this.miningTimer = setInterval(() => {
      if (this.currentRealPower > 0) {
        // per-second reward (matches contract formula)
        const rewardPerSec = (this.currentRealPower * Number(this.currentDifficulty)) / 1e18;
        this.pendingBalance += rewardPerSec;
        document.getElementById('val-pending').innerText = this.pendingBalance.toFixed(5);
        document.getElementById('val-pending').style.color = 'var(--primary)';
        setTimeout(() => { document.getElementById('val-pending').style.color = 'var(--text)'; }, 500);
      }
    }, 1000);
  }

  stopMiningCounter() {
    if (this.miningTimer) { clearInterval(this.miningTimer); this.miningTimer = null; }
  }

  // ========= referral =========================================================
  async bindReferrer() {
    const a = document.getElementById('ref-address-input').value.trim();
    if (!ethers.isAddress(a)) return this.showToast(this.t('invalidAddr'), true);
    this.setLoader(true, this.t('linking'));
    try {
      const tx = await this.contracts.mining.setReferrer(a);
      await tx.wait();
      this.showToast(this.t('refLinked'));
      document.getElementById('ref-address-input').value = '';
    } catch(e) { this.showError(e); }
    this.setLoader(false);
  }

  // ========= shop =============================================================
  setPayMode(m) {
    this.payMode = m;
    document.getElementById('btn-pay-usdt').classList.toggle('active', m === 'USDT');
    document.getElementById('btn-pay-fta').classList.toggle('active',  m === 'FTA');
    this.renderShop();
  }

  setShopView(v) {
    this.shopViewMode = v;
    document.querySelectorAll('.shop-tab').forEach(t => t.classList.remove('active'));
    if (event?.currentTarget) event.currentTarget.classList.add('active');
    this.renderShop();
  }

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
      const cnt = Number(await this.contracts.mining.getMachineCount());
      const promises = [];
      for (let i = 0; i < cnt; i++) promises.push(this.contracts.mining.machineTypes(i));
      const results = await Promise.all(promises);
      this.shopMachinesData = [];
      for (let i = 0; i < cnt; i++) {
        const d = results[i];
        // price: raw USDT units (6 decimals)
        const priceUsdt = parseFloat(ethers.formatUnits(d.price, this.usdtDecimals));
        // power: raw integer (NOT 18-decimal)
        const power = Number(d.power);
        this.shopMachinesData.push({ price: priceUsdt, power, priceRaw: d.price, powerRaw: d.power });
      }
    } catch(e) { console.error("fetchMachines error", e); }
    this.isLoadingShop = false;
  }

  async fetchBatteries() {
    this.isLoadingShop = true;
    try {
      const cnt = Number(await this.contracts.mining.getBatteryCount());
      const promises = [];
      for (let i = 0; i < cnt; i++) promises.push(this.contracts.mining.batteryTypes(i));
      const results = await Promise.all(promises);
      this.shopBatteriesData = [];
      for (let i = 0; i < cnt; i++) {
        const d = results[i];
        const priceUsdt = parseFloat(ethers.formatUnits(d.price, this.usdtDecimals));
        const days = Number(d.duration) / 86400;
        this.shopBatteriesData.push({ price: priceUsdt, days, priceRaw: d.price, durationRaw: d.duration });
      }
    } catch(e) { console.error("fetchBatteries error", e); }
    this.isLoadingShop = false;
  }

  // ========= buy machine / battery =============================================

  async buyMachine(id) {
    if (!this.user) return this.connect();
    this.setLoader(true, `${this.t('buyingMachine')} (${this.payMode})...`);
    try {
      const m = this.shopMachinesData[id];
      if (this.payMode === 'USDT') {
        // approve + call buyMachine
        const al = await this.contracts.usdt.allowance(this.user, CONFIG.MINING);
        if (al < m.priceRaw) {
          this.setLoader(true, this.t('approveUsdt'));
          const tx = await this.contracts.usdt.approve(CONFIG.MINING, m.priceRaw);
          await tx.wait();
        }
        this.setLoader(true, this.t('confirming'));
        const tx = await this.contracts.mining.buyMachine(id);
        await tx.wait();
      } else {
        // FTA payment: contract formula = ftaNeeded * 100n / 89n (+~12.36 % fees)
        // Approve with 30 % buffer to be safe
        const fc       = await this.contracts.mining.getFtaCostForUsdtSell(m.priceRaw);
        const ftExact  = fc * 100n / 89n;   // exact fee-included amount
        const ftApprove = ftExact * 13n / 10n; // 30 % buffer
        const al = await this.contracts.fta.allowance(this.user, CONFIG.MINING);
        if (al < ftApprove) {
          this.setLoader(true, this.t('approveFta'));
          const tx = await this.contracts.fta.approve(CONFIG.MINING, ftApprove);
          await tx.wait();
        }
        this.setLoader(true, this.t('confirming'));
        const tx = await this.contracts.mining.buyMachineWithFTA(id);
        await tx.wait();
      }
      // ---- persist locally ----
      this.userMachines.push({
        typeId: id,
        expiresAt: 0,
        pluggedBatteryType: null,
        boughtAt: Math.floor(Date.now() / 1000)
      });
      this._saveLocalAssets();
      this.showToast(this.t('machineBought'));
      this.shopMachinesData = []; // invalidate cache
      this.updateData();
    } catch(e) { this.showError(e); }
    this.setLoader(false);
  }

  async buyBattery(id) {
    if (!this.user) return this.connect();
    this.setLoader(true, `${this.t('buyingBattery')} (${this.payMode})...`);
    try {
      const b = this.shopBatteriesData[id];
      if (this.payMode === 'USDT') {
        const al = await this.contracts.usdt.allowance(this.user, CONFIG.MINING);
        if (al < b.priceRaw) {
          this.setLoader(true, this.t('approveUsdt'));
          const tx = await this.contracts.usdt.approve(CONFIG.MINING, b.priceRaw);
          await tx.wait();
        }
        this.setLoader(true, this.t('confirming'));
        const tx = await this.contracts.mining.buyBattery(id);
        await tx.wait();
      } else {
        const fc       = await this.contracts.mining.getFtaCostForUsdtSell(b.priceRaw);
        const ftExact  = fc * 100n / 89n;
        const ftApprove = ftExact * 13n / 10n;
        const al = await this.contracts.fta.allowance(this.user, CONFIG.MINING);
        if (al < ftApprove) {
          this.setLoader(true, this.t('approveFta'));
          const tx = await this.contracts.fta.approve(CONFIG.MINING, ftApprove);
          await tx.wait();
        }
        this.setLoader(true, this.t('confirming'));
        const tx = await this.contracts.mining.buyBatteryWithFTA(id);
        await tx.wait();
      }
      // ---- persist locally ----
      this.userBatteries[id] = (this.userBatteries[id] || 0) + 1;
      this._saveLocalAssets();
      this.showToast(this.t('batteryBought'));
      this.shopBatteriesData = []; // invalidate cache
      this.updateData();
    } catch(e) { this.showError(e); }
    this.setLoader(false);
  }

  // ========= plug in machine ==================================================
  async plugInMachine() {
    const mIdx = document.getElementById('plug-machine-id').value;
    const bT   = document.getElementById('plug-battery-type').value;
    if (mIdx === "" || mIdx < 0) return this.showToast(this.t('invalidId'), true);
    const idx = Number(mIdx);
    if (idx >= this.userMachines.length) return this.showToast(this.t('invalidId'), true);

    // check local battery inventory
    if (!this.userBatteries[bT] || this.userBatteries[bT] <= 0) {
      return this.showToast("No battery of this type available", true);
    }

    this.setLoader(true, this.t('pluggingIn'));
    try {
      const tx = await this.contracts.mining.plugInMachine(idx, bT);
      await tx.wait();

      // The contract auto-claims pending rewards and resets lastClaimTime
      // → sync our local state
      this.pendingBalance = 0;
      this.userLastClaimTime = Math.floor(Date.now() / 1000);

      // update local machine
      const durSec = this.batteryTypeDurations[bT] ? this.batteryTypeDurations[bT] * 86400 : 2592000; // fallback 30 days
      this.userMachines[idx].expiresAt         = Math.floor(Date.now()/1000) + durSec;
      this.userMachines[idx].pluggedBatteryType = Number(bT);

      // decrement battery inventory
      this.userBatteries[bT] = Math.max(0, (this.userBatteries[bT] || 0) - 1);
      this._saveLocalAssets();

      this.showToast(this.t('pluggedIn'));
      this.updateData();
    } catch(e) { this.showError(e); }
    this.setLoader(false);
  }

  // ========= claim ============================================================
  async claim() {
    if (!this.user) return;
    this.stopMiningCounter();
    this.setLoader(true, this.t('claiming'));
    try {
      const tx = await this.contracts.mining.claimRewards();
      await tx.wait();
      this.pendingBalance = 0;
      this.userLastClaimTime = Math.floor(Date.now() / 1000);
      this._saveLocalAssets();
      this.showToast(this.t('claimed'));
      this.updateData();
      if (this.currentRealPower > 0) this.startMiningCounter();
    } catch(e) {
      this.showError(e);
      this.startMiningCounter();
    }
    this.setLoader(false);
  }

  // ========= swap =============================================================
  toggleSwap() {
    this.swapDirection = this.swapDirection === 'USDT_TO_FTA' ? 'FTA_TO_USDT' : 'USDT_TO_FTA';
    document.getElementById('token-from-display').innerText = this.swapDirection === 'USDT_TO_FTA' ? 'USDT' : 'FTA';
    document.getElementById('token-to-display').innerText   = this.swapDirection === 'USDT_TO_FTA' ? 'FTA' : 'USDT';
    document.getElementById('swap-to-in').value   = '';
    document.getElementById('swap-from-in').value = '';
    document.getElementById('swap-details').classList.add('hidden');
    this.updateData();
  }

  calcSwap() {
    const val = document.getElementById('swap-from-in').value;
    if (!val || val <= 0) {
      document.getElementById('swap-to-in').value = '';
      document.getElementById('swap-details').classList.add('hidden');
      return;
    }
    const inputVal   = parseFloat(val);
    const isUsdtTo   = this.swapDirection === 'USDT_TO_FTA';
    const fee        = inputVal * SWAP_FEE_RATE;          // 4 %
    const netInput   = inputVal - fee;

    let netOutput = 0;
    if (this.ftaPriceUsd > 0) {
      netOutput = isUsdtTo ? (netInput / this.ftaPriceUsd) : (netInput * this.ftaPriceUsd);
    }
    const minReceived = netOutput * (1 - SLIPPAGE);
    document.getElementById('swap-to-in').value = netOutput > 0 ? netOutput.toFixed(6) : '';

    const detailsEl = document.getElementById('swap-details');
    detailsEl.classList.remove('hidden');
    const fromToken = isUsdtTo ? 'USDT' : 'FTA';
    const toToken   = isUsdtTo ? 'FTA' : 'USDT';

    document.getElementById('swap-detail-rate').innerText =
      isUsdtTo ? `1 USDT = ${(1/this.ftaPriceUsd).toFixed(2)} FTA` : `1 FTA = ${this.ftaPriceUsd.toFixed(6)} USDT`;
    document.getElementById('swap-detail-fee').innerText  = `${fee.toFixed(6)} ${fromToken}`;
    document.getElementById('swap-detail-min').innerText  = `${minReceived.toFixed(6)} ${toToken}`;
    const gasPol = 0.015;
    document.getElementById('swap-detail-network').innerText = `≈ ${gasPol.toFixed(3)} POL (${this.formatUsd(gasPol * this.polPriceUsd)})`;
  }

  async executeSwap() {
    const val = document.getElementById('swap-from-in').value;
    if (!val || val <= 0) return this.showToast(this.t('invalidAmount'), true);
    this.setLoader(true, this.t('swapping'));

    const isUsdtTo = this.swapDirection === 'USDT_TO_FTA';
    const decimals = isUsdtTo ? this.usdtDecimals : this.ftaDecimals;
    const amount   = ethers.parseUnits(val, decimals);

    try {
      if (isUsdtTo) {
        const tokenContract = this.contracts.usdt;
        const allowance = await tokenContract.allowance(this.user, CONFIG.MINING);
        if (allowance < amount) {
          this.setLoader(true, this.t('approveUsdt'));
          const tx = await tokenContract.approve(CONFIG.MINING, amount);
          await tx.wait();
        }
        this.setLoader(true, this.t('confirming'));
        const tx = await this.contracts.mining.swapUsdtForFta(amount);
        await tx.wait();
      } else {
        // swapFtaForUsdt: contract requires _ftaAmount <= netFtaSold
        // netFtaSold is the total FTA bought via swapUsdtForFta (minus sold)
        const tokenContract = this.contracts.fta;
        const allowance = await tokenContract.allowance(this.user, CONFIG.MINING);
        if (allowance < amount) {
          this.setLoader(true, this.t('approveFta'));
          const tx = await tokenContract.approve(CONFIG.MINING, amount);
          await tx.wait();
        }
        this.setLoader(true, this.t('confirming'));
        const tx = await this.contracts.mining.swapFtaForUsdt(amount);
        await tx.wait();
      }
      this.showToast(this.t('swapSuccess'));
      document.getElementById('swap-from-in').value = '';
      document.getElementById('swap-to-in').value   = '';
      document.getElementById('swap-details').classList.add('hidden');
      this.updateData();
    } catch(e) {
      // detect liquidity errors for FTA→USDT
      const errMsg = (e?.message || '').toLowerCase();
      if (errMsg.includes('invalid amount') && !isUsdtTo) {
        this.showToast(this.t('errNoLiquidity'), true);
      } else {
        this.showError(e);
      }
    }
    this.setLoader(false);
  }

  // ========= send / receive ===================================================
  openSend(ts) {
    this.sendTokenSymbol = ts;
    document.getElementById('send-token-name').innerText = ts;
    document.getElementById('send-to-address').value = '';
    document.getElementById('send-amount').value     = '';
    let bid = 'bal-pol-2';
    if (ts === 'USDT') bid = 'bal-usdt-2';
    if (ts === 'FTA')  bid = 'bal-fta-2';
    document.getElementById('send-bal').innerText = document.getElementById(bid)?.innerText || '0';
    document.getElementById('modal-send').classList.add('active');
  }

  openReceive() {
    if (!this.user) return this.showToast(this.t('connFirst'), true);
    document.getElementById('receive-addr-display').innerText = this.user;
    document.getElementById('modal-receive').classList.add('active');
  }

  closeModals() {
    document.getElementById('modal-send').classList.remove('active');
    document.getElementById('modal-receive').classList.remove('active');
  }

  copyReceiveAddress() {
    navigator.clipboard.writeText(this.user);
    this.showToast(this.t('addrCopied'));
  }

  async executeSend() {
    const to  = document.getElementById('send-to-address').value.trim();
    const amt = document.getElementById('send-amount').value;
    if (!ethers.isAddress(to)) return this.showToast(this.t('invalidAddr'), true);
    if (!amt || Number(amt) <= 0) return this.showToast(this.t('invalidAmount'), true);
    this.setLoader(true, this.t('sending'));
    try {
      let tx;
      if (this.sendTokenSymbol === 'POL') {
        tx = await this.signer.sendTransaction({ to, value: ethers.parseEther(amt) });
      } else {
        let ct, dc;
        if (this.sendTokenSymbol === 'USDT') { ct = this.contracts.usdt; dc = this.usdtDecimals; }
        if (this.sendTokenSymbol === 'FTA')  { ct = this.contracts.fta;  dc = this.ftaDecimals;  }
        tx = await ct.transfer(to, ethers.parseUnits(amt, dc));
      }
      await tx.wait();
      this.showToast(this.t('sentSuccess'));
      this.closeModals();
      this.updateData();
    } catch(e) { this.showError(e); }
    this.setLoader(false);
  }

  // ========= navigation =======================================================
  nav(viewId) {
    document.querySelectorAll('.view').forEach(el => { el.classList.remove('active'); el.style.display = 'none'; });
    const av = document.getElementById('view-' + viewId);
    if (av) { av.classList.add('active'); av.style.display = 'block'; }
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    if (event?.currentTarget) event.currentTarget.classList.add('active');
  }

  // ========= visualiser =======================================================
  resizeCanvas() {
    if (this.vizContext) { const c = this.vizContext.canvas; c.width = c.offsetWidth * 2; c.height = c.offsetHeight * 2; }
  }

  initVisualizer() {
    const c = document.getElementById('mining-canvas');
    if (!c) return;
    this.resizeCanvas();
    this.vizContext = c.getContext('2d');
    this.vizBars = [];
    for (let i = 0; i < 20; i++) this.vizBars.push({ height: 0, targetHeight: 0 });
    this.animateVisualizer();
  }

  updateVisualizerIntensity(p) {
    // p = raw power integer (e.g. 5000). Map to 0-100% intensity.
    const maxP  = 100000; // cap for full intensity
    const level = Math.min(Math.max(p / maxP, 0.02), 1);
    this.vizBars.forEach(b => { b.targetHeight = (this.vizContext.canvas.height * level) * (0.6 + Math.random() * 0.4); });
  }

  animateVisualizer() {
    if (!this.vizContext) return;
    const ctx = this.vizContext;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "#F0B90B";
    const w = ctx.canvas.width / 20;
    this.vizBars.forEach((b, i) => {
      b.height += (b.targetHeight - b.height) * 0.1;
      ctx.fillRect(i * w + 2, ctx.canvas.height - b.height, w - 4, b.height);
      b.targetHeight += (Math.random() - 0.5) * 10;
      if (b.targetHeight < 0) b.targetHeight = 2;
      if (b.targetHeight > ctx.canvas.height) b.targetHeight = ctx.canvas.height;
    });
    requestAnimationFrame(() => this.animateVisualizer());
  }

  // ========= loader / toast / errors ==========================================
  setLoader(show, msg = "Processing...") {
    const l = document.getElementById('loader');
    document.getElementById('loader-text').innerText = msg;
    if (show) { l.classList.remove('hidden'); } else { l.classList.add('hidden'); }
  }

  showToast(msg, isError = false) {
    const div = document.createElement('div');
    div.className = 'toast' + (isError ? ' toast-error' : ' toast-success');
    div.innerText = msg;
    document.getElementById('toast-container').appendChild(div);
    setTimeout(() => div.remove(), 4000);
  }

  getErrorMessage(e) {
    const errStr = (e?.message || '').toLowerCase() + ' ' + (e?.code || '').toLowerCase() + ' ' + (e?.reason || '').toLowerCase() + ' ' + (e?.shortMessage || '').toLowerCase();
    const infoErr = (e?.info?.error?.message || '').toLowerCase();
    const combined = errStr + ' ' + infoErr;
    if (combined.includes('user rejected') || combined.includes('user denied') || combined.includes('cancelled by user') || combined.includes('action_rejected') || e?.code === 'ACTION_REJECTED' || e?.code === 4001 || e?.code === -32000 || (e?.info?.error?.code === 4001)) return this.t('errRejected');
    if (combined.includes('insufficient funds') || combined.includes('insufficient balance') || combined.includes('not enough') || combined.includes('underpriced') || combined.includes('exceeds allowance') || combined.includes('erc20: insufficient') || combined.includes('transfer amount exceeds')) return this.t('errInsufficientFunds');
    if (combined.includes('nonce') || combined.includes('already known') || combined.includes('replacement fee too low')) return this.t('errNonce');
    if (combined.includes('already pending') || combined.includes('pending transaction')) return this.t('errAlreadyPending');
    if (combined.includes('timeout') || combined.includes('timed out') || combined.includes('deadline')) return this.t('errTimeout');
    if (combined.includes('network') || combined.includes('fetch') || combined.includes('failed to fetch') || combined.includes('connection') || combined.includes('could not decode') || combined.includes('missing revert data') || combined.includes('call revert exception')) return this.t('errNetwork');
    if (combined.includes('revert') || combined.includes('execution reverted') || combined.includes('vm execution error') || combined.includes('gas required exceeds allowance') || combined.includes('transaction failed')) return this.t('errContract');
    return this.t('errGeneric');
  }

  showError(e) { console.error("Transaction Error:", e); this.showToast(this.getErrorMessage(e), true); }

  // ========= render UI helpers =================================================

  renderActiveMachines() {
    const c = document.getElementById('active-machines-list'); if (!c) return;
    const now = Math.floor(Date.now() / 1000);
    const active = this.userMachines.filter(m => m.expiresAt > now);
    if (!active.length) { c.innerHTML = `<p class="small-text" style="text-align:center;">${this.t('noActiveMachines')}</p>`; return; }
    const tierNames = ['MK-I','MK-II','MK-III','MK-IV','MK-V','MK-VI','MK-VII','MK-VIII'];
    c.innerHTML = active.map((m, i) => {
      const rem = m.expiresAt - now;
      const dur = this.getBatteryDuration(m.pluggedBatteryType);
      const tot = dur * 86400;
      const el  = tot - rem;
      const pr  = Math.min(Math.max((el / tot) * 100, 0), 100);
      const bc  = pr < 60 ? 'green' : (pr < 85 ? 'yellow' : 'red');
      return `<div class="asset-row">${this.getMachineMiniSVG(m.typeId)}
        <div class="asset-info">
          <div class="asset-name">${tierNames[m.typeId % 8]} <span class="status-pill active">● ${this.t('active')}</span></div>
          <div class="asset-detail">${this.t('batteryLabel')}: ${dur} ${this.t('days')}</div>
          <div class="battery-bar-wrap">
            <div class="battery-bar-header"><span class="battery-bar-label">${this.t('timeRemaining')}</span><span class="battery-bar-time ${bc}">${this.formatTimeRemaining(rem)}</span></div>
            <div class="battery-bar"><div class="battery-bar-fill ${bc}" style="width:${pr.toFixed(1)}%"></div></div>
          </div>
        </div></div>`;
    }).join('');
  }

  renderUserMachines() {
    const c = document.getElementById('my-machines-list'); if (!c) return;
    if (!this.userMachines.length) { c.innerHTML = `<p class="small-text" style="text-align:center;">${this.t('noMachines')}</p>`; return; }
    const now = Math.floor(Date.now() / 1000);
    const tierNames = ['MK-I','MK-II','MK-III','MK-IV','MK-V','MK-VI','MK-VII','MK-VIII'];
    c.innerHTML = this.userMachines.map((m, i) => {
      let sc, st;
      if (m.expiresAt > now)       { sc = 'active';   st = this.t('active');   }
      else if (m.expiresAt > 0)    { sc = 'expired';  st = this.t('expired');  }
      else                         { sc = 'inactive'; st = this.t('inactive'); }
      const dur = this.getBatteryDuration(m.pluggedBatteryType);
      let bh = '';
      if (m.expiresAt > 0) {
        const rem = m.expiresAt - now;
        const tot = dur * 86400;
        const el  = tot - rem;
        const pr  = Math.min(Math.max((el / tot) * 100, 0), 100);
        const bc  = rem <= 0 ? 'red' : (pr < 60 ? 'green' : (pr < 85 ? 'yellow' : 'red'));
        bh = `<div class="battery-bar-wrap"><div class="battery-bar-header"><span class="battery-bar-label">${this.t('batteryLabel')}: ${dur} ${this.t('days')}</span><span class="battery-bar-time ${bc}">${rem > 0 ? this.formatTimeRemaining(rem) : this.t('expired')}</span></div><div class="battery-bar"><div class="battery-bar-fill ${rem <= 0 ? 'gray' : bc}" style="width:${rem <= 0 ? 100 : pr.toFixed(1)}%"></div></div></div>`;
      }
      return `<div class="asset-row">${this.getMachineMiniSVG(m.typeId)}
        <div class="asset-info">
          <div class="asset-name">#${i} ${tierNames[m.typeId % 8]} <span class="status-pill ${sc}">● ${st}</span></div>
          <div class="asset-detail">${m.expiresAt > 0 ? this.t('plugged') : this.t('notPlugged')}</div>${bh}
        </div></div>`;
    }).join('');
  }

  renderUserBatteries() {
    const c = document.getElementById('my-batteries-list'); if (!c) return;
    const types = Object.entries(this.userBatteries).filter(([_,cnt]) => cnt > 0);
    if (!types.length) { c.innerHTML = `<p class="small-text" style="text-align:center;">${this.t('noBatteries')}</p>`; return; }
    c.innerHTML = types.map(([typeId, count]) => {
      const dur  = this.getBatteryDuration(Number(typeId));
      const chargeLevel = Math.floor(Math.random() * 40) + 60; // decorative
      let levelClass = chargeLevel > 60 ? '' : (chargeLevel > 20 ? 'medium' : (chargeLevel > 0 ? 'low' : 'empty'));
      return `<div class="asset-row">
        <div class="real-battery">
          <div class="battery-cap"></div>
          <div class="battery-body">
            <div class="battery-level ${levelClass}" style="width:${chargeLevel}%"></div>
            <div class="battery-charge-indicator">${count}×</div>
          </div>
        </div>
        <div class="asset-info">
          <div class="asset-name">${dur} ${this.t('days')} <span class="status-pill available">● ${count} ${this.t('available')}</span></div>
        </div></div>`;
    }).join('');
  }

  // ========= SVG helpers ======================================================
  getMachineSVG(tier) {
    const tiers = [
      { name:'MK-I',    gpus:1, color:'#64748b', accent:'#94a3b8', fans:1 },
      { name:'MK-II',   gpus:2, color:'#3b82f6', accent:'#60a5fa', fans:1 },
      { name:'MK-III',  gpus:3, color:'#8b5cf6', accent:'#a78bfa', fans:2 },
      { name:'MK-IV',   gpus:4, color:'#F0B90B', accent:'#FFD43B', fans:2 },
      { name:'MK-V',    gpus:5, color:'#f97316', accent:'#fb923c', fans:2 },
      { name:'MK-VI',   gpus:6, color:'#ef4444', accent:'#f87171', fans:3 },
      { name:'MK-VII',  gpus:8, color:'#06b6d4', accent:'#22d3ee', fans:3 },
      { name:'MK-VIII', gpus:8, color:'#eab308', accent:'#facc15', fans:4 }
    ];
    const t = tiers[tier % tiers.length];
    const W = 260, H = 170;
    let gpuH = '', fanH = '', ledH = '', ventH = '';
    const gpuW = 24, gpuH2 = 48, gG = 3, mGW = W - 40;
    let eGW = gpuW, eG = gG;
    let tGW = t.gpus * eGW + (t.gpus - 1) * eG;
    if (tGW > mGW) { eGW = Math.floor((mGW - (t.gpus - 1) * eG) / t.gpus); tGW = t.gpus * eGW + (t.gpus - 1) * eG; }
    const gSX = (W - tGW) / 2, gY = 22;
    for (let i = 0; i < t.gpus; i++) {
      const x = gSX + i * (eGW + eG);
      gpuH += `<rect x="${x}" y="${gY}" width="${eGW}" height="${gpuH2}" rx="2" fill="#080c18" stroke="${t.accent}" stroke-width="0.6" opacity="0.85"/>`;
      const fC = Math.max(3, Math.floor(eGW / 4)), fG2 = (eGW - 6) / fC;
      for (let j = 0; j < 9; j++) {
        const fy = gY + 5 + j * 4.5;
        if (fy + 2 < gY + gpuH2 - 10) {
          for (let f = 0; f < fC; f++) {
            gpuH += `<rect x="${x + 3 + f * fG2}" y="${fy}" width="${Math.max(1, fG2 - 1.5)}" height="2" rx="0.5" fill="${t.accent}" opacity="0.12"/>`;
          }
        }
      }
      const cW = Math.min(10, eGW - 6);
      gpuH += `<rect x="${x + (eGW - cW) / 2}" y="${gY + gpuH2 - 11}" width="${cW}" height="7" rx="1.5" fill="${t.color}" opacity="0.35"/><circle cx="${x + eGW / 2}" cy="${gY + 3}" r="1" fill="${t.accent}" class="led-pulse" style="animation-delay:${i * 0.3}s"/>`;
    }
    const fR = 14, fG2 = 14;
    const tFW = t.fans * fR * 2 + (t.fans - 1) * fG2;
    const fSX = (W - tFW) / 2, fY = 100;
    for (let i = 0; i < t.fans; i++) {
      const cx = fSX + i * (fR * 2 + fG2) + fR, cy = fY;
      fanH += `<circle cx="${cx}" cy="${cy}" r="${fR + 2}" fill="#060a14" stroke="#2a2a3e" stroke-width="1"/><circle cx="${cx}" cy="${cy}" r="${fR}" fill="#0a0e1a" stroke="#333" stroke-width="0.8"/><g class="fan-blades" style="transform-origin:${cx}px ${cy}px">`;
      for (let b = 0; b < 5; b++) {
        fanH += `<rect x="${cx - 1.5}" y="${cy - fR + 3}" width="3" height="${fR - 4}" rx="1.5" fill="#1e293b" transform="rotate(${b * 72},${cx},${cy})"/>`;
      }
      fanH += `</g><circle cx="${cx}" cy="${cy}" r="3.5" fill="${t.accent}" opacity="0.4"/><circle cx="${cx}" cy="${cy}" r="1.5" fill="${t.accent}" opacity="0.7"/>`;
    }
    for (let i = 0; i < 6; i++) {
      const lx = 25 + i * 9;
      ledH += `<circle cx="${lx}" cy="148" r="1.8" fill="${i === 0 ? '#10b981' : (i < 3 ? t.accent : '#334155')}" class="led-pulse" style="animation-delay:${i * 0.4}s"/>`;
    }
    for (let v = 0; v < 3; v++) {
      ventH += `<rect x="30" y="${138 + v * 5}" width="${W - 60}" height="2" rx="1" fill="#060a14" opacity="0.8"/>`;
    }
    return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" class="machine-svg"><defs><linearGradient id="bG${tier}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1e293b"/><stop offset="50%" stop-color="#162032"/><stop offset="100%" stop-color="#0f172a"/></linearGradient><linearGradient id="tB${tier}" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="${t.color}" stop-opacity="0.8"/><stop offset="50%" stop-color="${t.accent}" stop-opacity="1"/><stop offset="100%" stop-color="${t.color}" stop-opacity="0.8"/></linearGradient></defs><ellipse cx="${W/2}" cy="${H-3}" rx="${W/2-30}" ry="10" fill="${t.accent}" opacity="0.06"/><rect x="12" y="10" width="${W-24}" height="${H-22}" rx="8" fill="url(#bG${tier})" stroke="#2a3550" stroke-width="1.2"/><rect x="12" y="10" width="${W-24}" height="4" rx="2" fill="url(#tB${tier})"/><circle cx="20" cy="18" r="1.5" fill="#334155"/><circle cx="${W-20}" cy="18" r="1.5" fill="#334155"/><circle cx="20" cy="${H-20}" r="1.5" fill="#334155"/><circle cx="${W-20}" cy="${H-20}" r="1.5" fill="#334155"/><text x="${W-22}" y="20" font-family="monospace" font-size="7" font-weight="700" fill="${t.accent}" text-anchor="end" opacity="0.7">${t.name}</text><text x="24" y="20" font-family="sans-serif" font-size="6" font-weight="800" fill="#475569" letter-spacing="1.5">FITIA</text>${gpuH}<line x1="28" y1="${gY+gpuH2+6}" x2="${W-28}" y2="${gY+gpuH2+6}" stroke="#1e293b" stroke-width="0.8" stroke-dasharray="2,2"/>${fanH}${ventH}${ledH}<circle cx="${W-25}" cy="148" r="3.5" fill="none" stroke="${t.accent}" stroke-width="0.8" opacity="0.5"/><line x1="${W-25}" y1="143.5" x2="${W-25}" y2="146" stroke="${t.accent}" stroke-width="0.8" opacity="0.5"/><rect x="12" y="30" width="3" height="50" rx="1.5" fill="${t.color}" opacity="0.15"/><rect x="${W-15}" y="30" width="3" height="50" rx="1.5" fill="${t.color}" opacity="0.15"/></svg>`;
  }

  getMachineMiniSVG(tier) {
    const c = ['#64748b','#3b82f6','#8b5cf6','#F0B90B','#f97316','#ef4444','#06b6d4','#eab308'][tier % 8];
    const a = ['#94a3b8','#60a5fa','#a78bfa','#FFD43B','#fb923c','#f87171','#22d3ee','#facc15'][tier % 8];
    return `<svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" class="machine-svg-mini"><rect x="2" y="2" width="46" height="46" rx="6" fill="#1e293b" stroke="${c}" stroke-width="1"/><rect x="2" y="2" width="46" height="3" rx="1.5" fill="${c}" opacity="0.6"/><rect x="8" y="10" width="14" height="20" rx="2" fill="#080c18" stroke="${a}" stroke-width="0.5"/><rect x="28" y="10" width="14" height="20" rx="2" fill="#080c18" stroke="${a}" stroke-width="0.5"/><circle cx="21" cy="40" r="6" fill="#0a0e1a" stroke="#333" stroke-width="0.5"/><g class="fan-blades" style="transform-origin:21px 40px">${[0,72,144,216,288].map(r => `<rect x="19.5" y="34.5" width="3" height="5" rx="1.5" fill="#1e293b" transform="rotate(${r},21,40)"/>`).join('')}</g><circle cx="21" cy="40" r="2" fill="${a}" opacity="0.6"/><circle cx="37" cy="40" r="6" fill="#0a0e1a" stroke="#333" stroke-width="0.5"/><g class="fan-blades" style="transform-origin:37px 40px">${[0,72,144,216,288].map(r => `<rect x="35.5" y="34.5" width="3" height="5" rx="1.5" fill="#1e293b" transform="rotate(${r},37,40)"/>`).join('')}</g><circle cx="37" cy="40" r="2" fill="${a}" opacity="0.6"/></svg>`;
  }

  _renderShopMachinesHTML(c) {
    c.innerHTML = '';
    c.style.gridTemplateColumns = '1fr 1fr';
    const bc = ['background:#64748b;color:#fff','background:#3b82f6;color:#fff','background:#8b5cf6;color:#fff','background:#F0B90B;color:#000','background:#f97316;color:#fff','background:#ef4444;color:#fff','background:#06b6d4;color:#000','background:#eab308;color:#000'];
    const bn = ['STARTER','STANDARD','ADVANCED','PRO','ELITE','ULTRA','SUPREME','LEGEND'];
    for (let i = 0; i < this.shopMachinesData.length; i++) {
      const d = this.shopMachinesData[i];
      const div = document.createElement('div');
      div.className = 'rig-item';
      div.innerHTML = `<span class="tier-badge" style="${bc[i % 8]}">${bn[i % 8]}</span>${this.getMachineSVG(i)}<span class="rig-name" style="font-size:0.85rem;">${this.t('rig')} ${i + 1}</span><span class="rig-power" style="font-size:0.75rem;">${this.formatHashrate(d.power)}</span><span class="rig-price" style="font-size:1rem;">${d.price.toFixed(2)} $</span><button class="btn-primary" style="padding:8px;font-size:0.75rem;margin-top:6px;" onclick="App.buyMachine(${i})">${this.t('buy')} (${this.payMode})</button>`;
      c.appendChild(div);
    }
  }

  _renderShopBatteriesHTML(c) {
    c.innerHTML = '';
    c.style.gridTemplateColumns = '1fr 1fr';
    for (let i = 0; i < this.shopBatteriesData.length; i++) {
      const d = this.shopBatteriesData[i];
      const div = document.createElement('div');
      div.className = 'battery-shop-item';
      const chargeLevel = Math.floor(Math.random() * 40) + 60;
      div.innerHTML = `
        <div class="real-battery">
          <div class="battery-cap"></div>
          <div class="battery-body">
            <div class="battery-level" style="width:${chargeLevel}%"></div>
            <div class="battery-charge-indicator">${d.days}D</div>
          </div>
        </div>
        <div class="battery-name">${d.days} ${this.t('days')}</div>
        <div class="battery-price">${d.price.toFixed(2)} $</div>
        <button class="btn-primary" style="padding:6px;font-size:0.75rem" onclick="App.buyBattery(${i})">${this.t('buy')} (${this.payMode})</button>`;
      c.appendChild(div);
    }
  }

  // ===== CHAT ASSISTANT ======================================================
  toggleChat() {
    const panel = document.getElementById('chat-panel');
    const isActive = panel.classList.toggle('active');
    if (isActive && !this.chatInitialized) {
      this.chatInitialized = true;
      setTimeout(() => this.addChatBubble('assistant', this.getWelcomeMessage()), 400);
    }
    if (isActive) setTimeout(() => document.getElementById('chat-input').focus(), 350);
  }

  sendChatMessage() {
    const input = document.getElementById('chat-input');
    const msg = input.value.trim();
    if (!msg) return;
    input.value = '';
    this.addChatBubble('user', msg);
    this.chatHistory.push({ role: 'user', text: msg });
    const typingId = this.showTyping();
    const delay = 400 + Math.min(msg.length * 25, 1200) + Math.random() * 400;
    setTimeout(() => {
      this.removeTyping(typingId);
      const response = this.generateLocalResponse(msg);
      this.addChatBubble('assistant', response);
      this.chatHistory.push({ role: 'assistant', text: response });
    }, delay);
  }

  addChatBubble(role, text) {
    const container = document.getElementById('chat-messages');
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${role}`;
    bubble.textContent = text;
    container.appendChild(bubble);
    requestAnimationFrame(() => { container.scrollTop = container.scrollHeight; });
  }

  showTyping() {
    const container = document.getElementById('chat-messages');
    const typing = document.createElement('div');
    const id = 'typing-' + Date.now();
    typing.id = id;
    typing.className = 'chat-bubble assistant';
    typing.innerHTML = '<span style="letter-spacing:3px;animation:loaderTextPulse 1s infinite">● ● ●</span>';
    container.appendChild(typing);
    container.scrollTop = container.scrollHeight;
    return id;
  }

  removeTyping(id) { const el = document.getElementById(id); if (el) el.remove(); }

  getWelcomeMessage() {
    const m = {
      en: "👋 Welcome to FITIA PRO! I'm your crypto assistant.\nI can help you with:\n• 🏁 Getting started (wallet, crypto basics)\n• ⛏️ Mining & machines\n• 💱 Swapping tokens\n• 💰 Wallet operations\n• 🛡️ Security tips\n• 📱 Community links\nJust ask me anything!",
      fr: "👋 Bienvenue sur FITIA PRO ! Je suis votre assistant crypto.\nJe peux vous aider avec :\n• 🏁 Démarrage (wallet, bases crypto)\n• ⛏️ Minage & machines\n• 💱 Échange de tokens\n• 💰 Opérations wallet\n• 🛡️ Conseils sécurité\n• 📱 Liens communauté\nDemandez-moi !",
      de: "👋 Willkommen bei FITIA PRO! Ich bin dein Krypto-Assistent.\nIch helfe bei:\n• 🏁 Einstieg (Wallet, Krypto-Basics)\n• ⛏️ Mining & Maschinen\n• 💱 Token-Tausch\n• 💰 Wallet-Operationen\n• 🛡️ Sicherheitstipps\n• 📱 Community-Links\nFrag mich alles!",
      zh: "👋 欢迎使用 FITIA PRO！我是你的加密助手。\n我可以帮你：\n• 🏁 入门（钱包、加密基础）\n• ⛏️ 挖矿与矿机\n• 💱 代币兑换\n• 💰 钱包操作\n• 🛡️ 安全提示\n• 📱 社群链接\n有任何问题尽管问我！",
      sg: "👋 Welcome to FITIA PRO! I'm your crypto assistant.\nI can help with: Getting started, Mining, Swapping, Wallet, Security, Community.\nAsk me anything!"
    };
    return m[this.currentLang] || m.en;
  }

  generateLocalResponse(msg) {
    const m = msg.toLowerCase().replace(/[?!.,;:'"]/g, '').trim();
    const intents = this.detectIntents(m);
    const topIntent = intents.length > 0 ? intents[0].intent : 'unknown';
    return this.craftResponse(topIntent, m);
  }

  detectIntents(m) {
    const scored = [];
    for (const [intent, data] of Object.entries(CHAT_INTENTS)) {
      let score = 0;
      const langKeys = ['all', this.currentLang, 'en'];
      for (const lk of langKeys) {
        if (!data.keywords[lk]) continue;
        for (const kw of data.keywords[lk]) {
          if (m.includes(kw)) score += (data.weight || 1);
        }
      }
      if (score > 0) scored.push({ intent, score });
    }
    scored.sort((a, b) => b.score - a.score);
    return scored;
  }

  craftResponse(intent) {
    const L = this.currentLang;
    const conn = !!this.user;
    const activeCount = this.userMachines.filter(m => m.expiresAt > Math.floor(Date.now() / 1000)).length;
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const R = {
      greeting: {
        en: conn ? [`👋 Hey! Power: ${this.formatHashrate(this.currentRealPower)}. ${activeCount} active machine(s). How can I help?`] : ["👋 Welcome! Connect your wallet to start. Need help?"],
        fr: conn ? [`👋 Salut ! Puissance : ${this.formatHashrate(this.currentRealPower)}.`] : ["👋 Bienvenue ! Connectez votre wallet."],
        de: conn ? [`👋 Hey! Leistung: ${this.formatHashrate(this.currentRealPower)}.`] : ["👋 Willkommen!"],
        zh: conn ? [`👋 你好！算力：${this.formatHashrate(this.currentRealPower)}。`] : ["👋 欢迎！连接钱包开始。"],
        sg: conn ? [`👋 Power: ${this.formatHashrate(this.currentRealPower)}.`] : ["👋 Welcome! Connect wallet."]
      },
      goodbye: { en: ["👋 See you! Happy mining!"], fr: ["👋 À bientôt !"], de: ["👋 Bis bald!"], zh: ["👋 再见！"], sg: ["👋 See you!"] },
      thanks: { en: ["You're welcome! 😊"], fr: ["De rien ! 😊"], de: ["Gerne! 😊"], zh: ["不客气！😊"], sg: ["You're welcome! 😊"] },
      help: {
        en: ["🛠️ I can help with: Mining, Shop, Plug In, Swap, Wallet, Referral, Security, Crypto Basics, Community, Troubleshooting. Just ask!"],
        fr: ["🛠️ Je peux aider avec : Minage, Boutique, Branchement, Échange, Wallet, Parrainage."],
        de: ["🛠️ Ich helfe bei: Mining, Shop, Anschließen, Tausch, Wallet."],
        zh: ["🛠️ 我可以帮助：挖矿、商店、插入、兑换、钱包、推荐、安全。"],
        sg: ["🛠️ I can help with: Mining, Shop, Plug In, Swap, Wallet, Community."]
      },
      whatsapp: {
        en: [`📱 Official communities:\n👥 WhatsApp Group:\n${CONFIG.WHATSAPP_GROUP}\n📢 WhatsApp Channel:\n${CONFIG.WHATSAPP_CHANNEL}`],
        fr: [`📱 Communautés :\n${CONFIG.WHATSAPP_GROUP}\n${CONFIG.WHATSAPP_CHANNEL}`],
        de: [`📱 Communities:\n${CONFIG.WHATSAPP_GROUP}`],
        zh: [`📱 官方社群：\n${CONFIG.WHATSAPP_GROUP}`],
        sg: [`📱 Communities:\n${CONFIG.WHATSAPP_GROUP}`]
      },
      crypto_basics: {
        en: ["🏁 Blockchain = digital ledger. Wallet = stores your crypto. Token = digital currency. Gas = transaction fee. Polygon = our network."],
        fr: ["🏁 Blockchain = registre numérique. Wallet = stocke crypto. Token = monnaie numérique."],
        de: ["🏁 Blockchain = digitales Hauptbuch. Wallet = speichert Krypto."],
        zh: ["🏁 区块链=数字账本，钱包=存储加密资产，代币=数字货币。"],
        sg: ["🏁 Blockchain = digital ledger. Wallet = stores crypto."]
      },
      metamask_help: {
        en: ["🦊 Download MetaMask → Create wallet → Save seed phrase (SECRET!) → Switch to Polygon → Connect on FITIA PRO. NEVER share your seed phrase!"],
        fr: ["🦊 Téléchargez MetaMask → Créez wallet → Notez phrase (SECRÈTE !) → Polygon → Connectez. JAMAIS partager !"],
        de: ["🦊 MetaMask → Wallet → Seed (GEHEIM!) → Polygon. NIEMALS teilen!"],
        zh: ["🦊 下载MetaMask→创建钱包→保存助记词（保密！）→Polygon→连接。绝不分享助记词！"],
        sg: ["🦊 Download MetaMask → Create wallet → Save seed phrase → Polygon → Connect. NEVER share seed phrase!"]
      },
      security: {
        en: ["🛡️ NEVER share your seed phrase. Nobody from FITIA will ask for it. Double-check addresses before sending. Use only official links."],
        fr: ["🛡️ JAMAIS partager votre phrase de récupération. Vérifiez les adresses."],
        de: ["🛡️ Seed-Phrase NIEMALS teilen. Adressen prüfen."],
        zh: ["🛡️ 绝不分享助记词。发送前核对地址。只用官方链接。"],
        sg: ["🛡️ NEVER share seed phrase. Double-check addresses."]
      },
      deposit: {
        en: ["💰 Copy your address (Wallet → Receive). Send USDT/POL on POLYGON network. Wait for confirmation. Buy USDT from exchanges like Binance."],
        fr: ["💰 Copiez adresse → Envoyez USDT/POL sur POLYGON → Confirmation."],
        de: ["💰 Adresse kopieren → USDT/POL auf POLYGON senden."],
        zh: ["💰 复制地址→发送USDT/POL到Polygon→等待确认。"],
        sg: ["💰 Copy address → Send USDT/POL on POLYGON → Confirm."]
      },
      withdraw: {
        en: ["💸 Mine FTA → Claim → Swap FTA→USDT → Send to exchange → Sell. Swap fee: 4%."],
        fr: ["💸 Minez → Réclamez → Swap FTA→USDT → Exchange."],
        de: ["💸 Minen → Abholen → Tauschen FTA→USDT → Exchange."],
        zh: ["💸 挖矿→领取→兑换FTA→USDT→交易所。手续费：4%"],
        sg: ["💸 Mine → Claim → Swap FTA→USDT → Exchange."]
      },
      mining: {
        en: conn ? [`⛏️ Buy machine → Buy battery → Plug in → Mine FTA! Power: ${this.formatHashrate(this.currentRealPower)} | Active: ${activeCount} | Pending: ${this.pendingBalance.toFixed(5)} FTA`] : ["⛏️ Connect wallet to start!"],
        fr: conn ? [`⛏️ Achetez → Batterie → Branchez → Minez ! Puissance : ${this.formatHashrate(this.currentRealPower)}`] : ["⛏️ Connectez-vous !"],
        de: conn ? [`⛏️ Kaufen → Batterie → Anschließen → Minen! Leistung: ${this.formatHashrate(this.currentRealPower)}`] : ["⛏️ Verbinde Wallet!"],
        zh: conn ? [`⛏️ 购买→电池→插入→挖矿！算力：${this.formatHashrate(this.currentRealPower)}`] : ["⛏️ 连接钱包！"],
        sg: conn ? [`⛏️ Buy → Battery → Plug in → Mine! Power: ${this.formatHashrate(this.currentRealPower)}`] : ["⛏️ Connect wallet!"]
      },
      buy_machine: {
        en: conn ? ["🛒 Shop tab → Choose payment → BUY. Higher tiers = more FTA/sec!"] : ["🛒 Connect wallet first!"],
        fr: ["🛒 Boutique → Paiement → ACHETER."], de: ["🛒 Shop → Bezahlung → KAUFEN."], zh: ["🛒 商店→选择支付→购买。"], sg: ["🛒 Shop → Payment → BUY."]
      },
      buy_battery: {
        en: conn ? ["🔋 Shop → Batteries tab → BUY. Longer = better value! Each battery powers ONE machine."] : ["🔋 Connect wallet!"],
        fr: ["🔋 Batteries → ACHETER."], de: ["🔋 Batterien → KAUFEN."], zh: ["🔋 电池→购买。"], sg: ["🔋 Batteries → BUY."]
      },
      plug_in: {
        en: conn ? [`🔌 Wallet tab → "Plug in a machine" → Machine ID → Battery → PLUG IN. Unused batteries: ${Object.values(this.userBatteries).reduce((a,b)=>a+b,0)}`] : ["🔌 Connect wallet!"],
        fr: ["🔌 Wallet → ID → Batterie → BRANCHER."], de: ["🔌 Wallet → ID → Batterie → ANSCHLIESSEN."], zh: ["🔌 钱包→ID→电池→插入。"], sg: ["🔌 Wallet → ID → Battery → PLUG IN."]
      },
      claim: {
        en: conn ? [`🎁 Home → CLAIM. Pending: ${this.pendingBalance.toFixed(5)} FTA`] : ["🎁 Connect wallet!"],
        fr: [`🎁 Accueil → RÉCLAMER.`], de: ["🎁 Startseite → EINFORDERN."], zh: [`🎁 首页→领取。`], sg: [`🎁 Home → CLAIM.`]
      },
      swap: {
        en: [`💱 Swap tab → Direction → Amount → SWAP. Rate: 1 FTA = ${this.ftaPriceUsd > 0 ? this.ftaPriceUsd.toFixed(6) : '...'} USDT. Fee: 4%.`],
        fr: [`💱 Swap → Direction → Montant → ÉCHANGER. Frais: 4%.`],
        de: [`💱 Swap → Richtung → Betrag → TAUSCHEN. Gebühr: 4%.`],
        zh: [`💱 兑换→方向→金额→兑换。费率：4%。`],
        sg: [`💱 Swap → Direction → Amount → SWAP. Fee: 4%.`]
      },
      wallet: {
        en: conn ? [`💰 ${this.user?.slice(0,6)}...${this.user?.slice(-4)}. Check balances in Wallet tab. Polygon only!`] : ["💰 Connect wallet!"],
        fr: [`💰 ${conn ? this.user?.slice(0,6)+'...'+this.user?.slice(-4) : 'Connectez-vous'}`],
        de: ["💰 Wallet-Tab → Guthaben."], zh: ["💰 钱包标签→余额。"], sg: ["💰 Wallet tab → Balances."]
      },
      referral: { en: ["👥 Your address = referral code. Share it! They enter it on Home → BIND."], fr: ["👥 Votre adresse = code parrainage."], de: ["👥 Adresse = Empfehlungscode."], zh: ["👥 地址=推荐码。分享！"], sg: ["👥 Address = referral code."] },
      connect: {
        en: conn ? ["✅ Connected!"] : ["🔗 Click 'Connect' → Approve → Make sure you're on Polygon."],
        fr: conn ? ["✅ Connecté !"] : ["🔗 'Connecter' → Approuver → Polygon."],
        de: conn ? ["✅ Verbunden!"] : ["🔗 'Verbinden' → Genehmigen."],
        zh: conn ? ["✅ 已连接！"] : ["🔗 点击'连接'→批准→Polygon。"],
        sg: conn ? ["✅ Connected!"] : ["🔗 Click 'Connect' → Approve → Polygon."]
      },
      what_is_fta: { en: [`🪙 FTA = mining reward token. Price: ${this.ftaPriceUsd>0?'$'+this.ftaPriceUsd.toFixed(6):'Loading...'}. Swap to USDT anytime.`] },
      how_it_works: { en: ["📖 Connect → Deposit → Buy → Plug in → Mine → Claim → Swap. Pro tip: reinvest earnings!"], fr: ["📖 Connecter → Déposer → Acheter → Brancher → Miner → Réclamer."], de: ["📖 Verbinden → Einzahlen → Kaufen → Minen → Abholen."], zh: ["📖 连接→充值→购买→插入→挖矿→领取→兑换。"], sg: ["📖 Connect → Deposit → Buy → Plug in → Mine → Claim → Swap."] },
      earn_more: { en: ["📈 Upgrade machines, run multiple, use longer batteries, reinvest, invite friends via referral!"] },
      price: { en: conn ? [`📊 FTA: ${this.ftaPriceUsd>0?'$'+this.ftaPriceUsd.toFixed(6):'...'} | USDT: $1.00 | POL: $${this.polPriceUsd.toFixed(4)}`] : ["📊 Connect wallet!"] },
      error: { en: ["🔧 Errors: Cancelled → approve in wallet. Insufficient → add funds. Network → check Polygon. Failed → check details."] },
      status: { en: conn ? [`📊 Power: ${this.formatHashrate(this.currentRealPower)} | Active: ${activeCount}/${this.userMachines.length} | Pending: ${this.pendingBalance.toFixed(5)} FTA`] : ["📊 Connect wallet!"] },
      network: { en: ["🌐 Polygon (Chain ID: 137). Low gas fees. ⚠️ Make sure your wallet is on Polygon!"] },
      profit: { en: ["💸 Higher tiers = more FTA/sec. Longer batteries = better value/day. Reinvest to compound!"] },
      machine_comparison: { en: ["⚖️ MK-I (STARTER) → MK-VIII (LEGEND). Higher tier = more FTA per second!"] },
      battery_duration: { en: ["🔋 3 to 365 days. Longer = lower cost per day. Popular: 30 days."] },
      app_navigation: { en: ["📱 Bottom nav: Home → Shop → Wallet → Swap."], fr: ["📱 Navigation : Accueil → Boutique → Wallet → Swap."] },
      transaction_speed: { en: ["⏱️ Polygon: 2-5 sec confirmations. If pending, wait 30 sec and refresh."] },
      unknown: { en: ["🤔 Try: 'mining', 'buy', 'status', 'whatsapp', 'swap', 'help'"], fr: ["🤔 Essayez : 'minage', 'acheter', 'aide'"], de: ["🤔 Frag: 'Mining', 'Kaufen', 'Hilfe'"], zh: ["🤔 试试：'挖矿'，'购买'，'帮助'"], sg: ["🤔 Try: 'mining', 'buy', 'status', 'help'"] }
    };
    const responses = R[intent] || R.unknown;
    const langResponses = responses[L] || responses.en || responses;
    if (Array.isArray(langResponses)) return pick(langResponses);
    return langResponses;
  }
}

// ===== bootstrap ============================================================
const App = new Application();
window.onload = () => App.init();
