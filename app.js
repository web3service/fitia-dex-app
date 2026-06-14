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

// ===== i18n ===================================================================
const i18n = {
  en: {
    connect:"Connect",refTitle:"👥 Referral System",refDesc:"Enter your referrer's address to link.",bindRef:"BIND",power:"POWER",ftaSec:"Hashrate",pending:"PENDING",fta:"FTA",miningActive:"MINING ACTIVE",noMachine:"NO MACHINE",claim:"CLAIM",shopTitle:"⛏️ Shop",machines:"Machines",batteries:"Batteries",buy:"BUY",myAssets:"⚙️ Wallet & Assets",walletBal:"💰 Balances",plugMachine:"🔌 Plug in a machine",plugDesc:"Enter your offline machine ID and choose a battery.",machineId:"Machine ID (0, 1...)",plug:"PLUG IN ⚡",swapTitle:"💱 Swap",youPay:"You pay",balance:"Balance:",youReceive:"You receive",swap:"SWAP",loading:"Loading...",currentRate:"1 FTA = ",home:"Home",shop:"Shop",assets:"Wallet",swapNav:"Swap",connWallet:"Connecting...",errConn:"Connection Error",linking:"Linking...",wcIdMissing:"WalletConnect ID missing!",refLinked:"Referrer linked!",connFirst:"Connect first",enterRefAddr:"Referrer address (0x...)",buyingMachine:"Buying Machine",approveUsdt:"Approving USDT...",approveFta:"Approving FTA...",confirming:"Confirming...",calcFta:"Calculating price...",machineBought:"Machine purchased!",buyingBattery:"Buying Battery",batteryBought:"Battery purchased!",invalidId:"Invalid Machine ID",pluggingIn:"Plugging in...",pluggedIn:"Machine plugged in! ⚡",invalidAmount:"Invalid amount",swapping:"Swapping...",swapSuccess:"Swap successful!",claiming:"Claiming...",claimed:"Rewards claimed!",error:"Error",days:"Days",rig:"RIG",send:"Send",receive:"Receive",recipientAddr:"Recipient address (0x...)",amount:"Amount",confirmSend:"CONFIRM SEND",sending:"Sending...",sentSuccess:"Sent successfully!",addrCopied:"Address copied!",invalidAddr:"Invalid address",totalBal:"Total Balance",activeMachines:"⛏️ Active Machines",myMachines:"⛏️ My Machines",myBatteries:"🔋 My Batteries",active:"Active",expired:"Expired",inactive:"Inactive",available:"Available",plugged:"Plugged",notPlugged:"Not Plugged",timeRemaining:"Remaining",noMachines:"No machines yet",noBatteries:"No batteries yet",batteryLabel:"Battery",usdtPerFta:" USDT",noActiveMachines:"No active machines",exchangeRate:"Exchange Rate",priceImpact:"Price Impact",swapFee:"Swap Fee (4%)",minimumReceived:"Minimum Received",slippageTolerance:"Slippage Tolerance",networkFee:"Network Fee",
    // ── NEW liquidity / error keys ──
    errRejected:"Transaction cancelled",errInsufficientFunds:"Insufficient balance",errNetwork:"Network error. Please try again.",errTimeout:"Transaction timed out. Please try again.",errContract:"Transaction failed. Please try again.",errGeneric:"An error occurred. Please try again.",errAlreadyPending:"A transaction is already pending. Please wait.",errNonce:"Transaction nonce error. Please restart the app.",
    errLowLiquidity:"Liquidity too low. Swap USDT→FTA first to build the pool, then retry.",
    errNoFtaLiquidity:"No FTA liquidity in the pool yet. Someone must swap USDT→FTA first before FTA purchases work. Try buying with USDT instead.",
    errMaxFtaSell:"Cannot sell more than {max} FTA — the pool limit is netFtaSold. Swap USDT→FTA first to increase the limit.",
    netFtaSoldLabel:"Pool (netFtaSold):",
    errSwapRejected:"Swap rejected by contract. Check if pool has enough liquidity (netFtaSold > 0).",
    errApprovalFailed:"Token approval failed. Check your wallet balance and try again.",
    useUsdtInstead:"Try paying with USDT instead — USDT purchases always work."
  },
  fr: {
    connect:"Connecter",refTitle:"👥 Parrainage",refDesc:"Entrez l'adresse de votre parrain.",bindRef:"LIER",power:"PUISSANCE",ftaSec:"Hashrate",pending:"EN ATTENTE",fta:"FTA",miningActive:"MINAGE ACTIF",noMachine:"AUCUNE MACHINE",claim:"RÉCLAMER",shopTitle:"⛏️ Boutique",machines:"Machines",batteries:"Batteries",buy:"ACHETER",myAssets:"⚙️ Wallet & Actifs",walletBal:"💰 Soldes",plugMachine:"🔌 Brancher une machine",plugDesc:"Entrez l'ID de votre machine.",machineId:"ID Machine (0, 1...)",plug:"BRANCHER ⚡",swapTitle:"💱 Échange",youPay:"Vous payez",balance:"Solde:",youReceive:"Vous recevez",swap:"ÉCHANGER",loading:"Chargement...",currentRate:"1 FTA = ",home:"Accueil",shop:"Boutique",assets:"Wallet",swapNav:"Swap",connWallet:"Connexion...",errConn:"Erreur connexion",linking:"Liaison...",wcIdMissing:"ID WalletConnect manquant!",refLinked:"Parrain lié!",connFirst:"Connectez-vous d'abord",enterRefAddr:"Adresse parrain (0x...)",buyingMachine:"Achat Machine",approveUsdt:"Approbation USDT...",approveFta:"Approbation FTA...",confirming:"Confirmation...",calcFta:"Calcul prix...",machineBought:"Machine achetée!",buyingBattery:"Achat Batterie",batteryBought:"Batterie achetée!",invalidId:"ID Machine invalide",pluggingIn:"Branchement...",pluggedIn:"Machine branchée! ⚡",invalidAmount:"Montant invalide",swapping:"Swap...",swapSuccess:"Échange réussi!",claiming:"Claim...",claimed:"Gains réclamés!",error:"Erreur",days:"Jours",rig:"RIG",send:"Envoyer",receive:"Recevoir",recipientAddr:"Adresse destinataire (0x...)",amount:"Montant",confirmSend:"CONFIRMER ENVOI",sending:"Envoi...",sentSuccess:"Envoi réussi!",addrCopied:"Adresse copiée!",invalidAddr:"Adresse invalide",totalBal:"Solde Total",activeMachines:"⛏️ Machines Actives",myMachines:"⛏️ Mes Machines",myBatteries:"🔋 Mes Batteries",active:"Actif",expired:"Expiré",inactive:"Inactif",available:"Disponible",plugged:"Branché",notPlugged:"Non branché",timeRemaining:"Restant",noMachines:"Aucune machine",noBatteries:"Aucune batterie",batteryLabel:"Batterie",usdtPerFta:" USDT",noActiveMachines:"Aucune machine active",exchangeRate:"Taux de change",priceImpact:"Impact prix",swapFee:"Frais swap (4%)",minimumReceived:"Minimum reçu",slippageTolerance:"Tolérance slippage",networkFee:"Frais réseau",
    errRejected:"Transaction annulée",errInsufficientFunds:"Solde insuffisant",errNetwork:"Erreur réseau. Réessayez.",errTimeout:"Délai expiré. Réessayez.",errContract:"Transaction échouée. Réessayez.",errGeneric:"Une erreur est survenue. Réessayez.",errAlreadyPending:"Transaction en cours. Patientez.",errNonce:"Erreur de nonce. Redémarrez l'app.",
    errLowLiquidity:"Liquidité trop faible. Échangez USDT→FTA d'abord pour remplir le pool, puis réessayez.",
    errNoFtaLiquidity:"Pas de liquidité FTA. Quelqu'un doit échanger USDT→FTA d'abord. Essayez d'acheter avec USDT.",
    errMaxFtaSell:"Vous ne pouvez pas vendre plus de {max} FTA. Échangez USDT→FTA d'abord.",
    netFtaSoldLabel:"Pool (netFtaSold):",
    errSwapRejected:"Échange rejeté. Vérifiez la liquidité du pool (netFtaSold > 0).",
    errApprovalFailed:"Approbation échouée. Vérifiez votre solde.",
    useUsdtInstead:"Essayez de payer en USDT — les achats USDT fonctionnent toujours."
  },
  de: {
    connect:"Verbinden",refTitle:"👥 Empfehlung",refDesc:"Empfehler-Adresse eingeben.",bindRef:"BINDEN",power:"LEISTUNG",ftaSec:"Hashrate",pending:"AUSSTEHEND",fta:"FTA",miningActive:"MINING AKTIV",noMachine:"KEINE MASCHINE",claim:"EINFORDERN",shopTitle:"⛏️ Shop",machines:"Maschinen",batteries:"Batterien",buy:"KAUFEN",myAssets:"⚙️ Wallet & Assets",walletBal:"💰 Guthaben",plugMachine:"🔌 Maschine anschließen",plugDesc:"Offline-Maschine ID eingeben.",machineId:"Maschinen-ID (0, 1...)",plug:"ANSCHLIESSEN ⚡",swapTitle:"💱 Tausch",youPay:"Sie zahlen",balance:"Guthaben:",youReceive:"Sie erhalten",swap:"TAUSCHEN",loading:"Laden...",currentRate:"1 FTA = ",home:"Home",shop:"Shop",assets:"Wallet",swapNav:"Swap",connWallet:"Verbindung...",errConn:"Verbindungsfehler",linking:"Verknüpfung...",wcIdMissing:"WalletConnect-ID fehlt!",refLinked:"Empfehler verknüpft!",connFirst:"Zuerst verbinden",enterRefAddr:"Empfehler-Adresse (0x...)",buyingMachine:"Kaufe Maschine",approveUsdt:"USDT genehmigen...",approveFta:"FTA genehmigen...",confirming:"Bestätigung...",calcFta:"Preis berechnen...",machineBought:"Maschine gekauft!",buyingBattery:"Kaufe Batterie",batteryBought:"Batterie gekauft!",invalidId:"Ungültige ID",pluggingIn:"Anschließen...",pluggedIn:"Maschine angeschlossen! ⚡",invalidAmount:"Ungültiger Betrag",swapping:"Tauschen...",swapSuccess:"Tausch erfolgreich!",claiming:"Einforderung...",claimed:"Eingefordert!",error:"Fehler",days:"Tage",rig:"RIG",send:"Senden",receive:"Empfangen",recipientAddr:"Empfängeradresse (0x...)",amount:"Betrag",confirmSend:"SENDUNG BESTÄTIGEN",sending:"Senden...",sentSuccess:"Gesendet!",addrCopied:"Kopiert!",invalidAddr:"Ungültige Adresse",totalBal:"Gesamtguthaben",activeMachines:"⛏️ Aktive Maschinen",myMachines:"⛏️ Meine Maschinen",myBatteries:"🔋 Meine Batterien",active:"Aktiv",expired:"Abgelaufen",inactive:"Inaktiv",available:"Verfügbar",plugged:"Angeschlossen",notPlugged:"Nicht angeschlossen",timeRemaining:"Verbleibend",noMachines:"Keine Maschinen",noBatteries:"Keine Batterien",batteryLabel:"Batterie",usdtPerFta:" USDT",noActiveMachines:"Keine aktive Maschinen",exchangeRate:"Wechselkurs",priceImpact:"Preisauswirkung",swapFee:"Swapgebühr (4%)",minimumReceived:"Mindestbetrag",slippageTolerance:"Slippage-Toleranz",networkFee:"Netzwerkgebühr",
    errRejected:"Transaktion abgebrochen",errInsufficientFunds:"Unzureichendes Guthaben",errNetwork:"Netzwerkfehler.",errTimeout:"Zeitüberschreitung.",errContract:"Transaktion fehlgeschlagen.",errGeneric:"Ein Fehler ist aufgetreten.",errAlreadyPending:"Transaktion ausstehend.",errNonce:"Nonce-Fehler.",
    errLowLiquidity:"Liquidität zu niedrig. USDT→FTA tauschen, dann erneut versuchen.",
    errNoFtaLiquidity:"Keine FTA-Liquidität. USDT→FTA zuerst tauschen. Mit USDT kaufen.",
    errMaxFtaSell:"Maximal {max} FTA verkaufbar. USDT→FTA zuerst tauschen.",
    netFtaSoldLabel:"Pool (netFtaSold):",
    errSwapRejected:"Tausch abgelehnt. Pool-Liquidität prüfen.",
    errApprovalFailed:"Genehmigung fehlgeschlagen. Guthaben prüfen.",
    useUsdtInstead:"Mit USDT bezahlen — USDT-Käufe funktionieren immer."
  },
  zh: {
    connect:"连接",refTitle:"👥 推荐系统",refDesc:"输入推荐人地址进行绑定。",bindRef:"绑定",power:"算力",ftaSec:"Hashrate",pending:"待领取",fta:"FTA",miningActive:"挖矿中",noMachine:"无机器",claim:"领取",shopTitle:"⛏️ 商店",machines:"矿机",batteries:"电池",buy:"购买",myAssets:"⚙️ 钱包与资产",walletBal:"💰 余额",plugMachine:"🔌 插入机器",plugDesc:"输入离线机器ID并选择电池。",machineId:"机器ID (0, 1...)",plug:"插入 ⚡",swapTitle:"💱 兑换",youPay:"您支付",balance:"余额:",youReceive:"您收到",swap:"兑换",loading:"加载中...",currentRate:"1 FTA = ",home:"首页",shop:"商店",assets:"钱包",swapNav:"兑换",connWallet:"连接中...",errConn:"连接错误",linking:"绑定中...",wcIdMissing:"缺少 WalletConnect ID！",refLinked:"推荐人绑定成功！",connFirst:"请先连接",enterRefAddr:"推荐人地址 (0x...)",buyingMachine:"购买机器",approveUsdt:"授权 USDT...",approveFta:"授权 FTA...",confirming:"确认中...",calcFta:"计算价格...",machineBought:"机器购买成功！",buyingBattery:"购买电池",batteryBought:"电池购买成功！",invalidId:"无效ID",pluggingIn:"插入中...",pluggedIn:"机器插入成功！ ⚡",invalidAmount:"无效金额",swapping:"兑换中...",swapSuccess:"兑换成功！",claiming:"领取中...",claimed:"奖励已领取！",error:"错误",days:"天",rig:"矿机",send:"发送",receive:"接收",recipientAddr:"接收方地址 (0x...)",amount:"金额",confirmSend:"确认发送",sending:"发送中...",sentSuccess:"发送成功！",addrCopied:"地址已复制！",invalidAddr:"无效地址",totalBal:"总余额",activeMachines:"⛏️ 运行中矿机",myMachines:"⛏️ 我的矿机",myBatteries:"🔋 我的电池",active:"运行中",expired:"已过期",inactive:"未激活",available:"可用",plugged:"已插入",notPlugged:"未插入",timeRemaining:"剩余",noMachines:"暂无矿机",noBatteries:"暂无电池",batteryLabel:"电池",usdtPerFta:" USDT",noActiveMachines:"无运行中矿机",exchangeRate:"汇率",priceImpact:"价格影响",swapFee:"手续费 (4%)",minimumReceived:"最低收到",slippageTolerance:"滑点容忍度",networkFee:"网络费",
    errRejected:"交易已取消",errInsufficientFunds:"余额不足",errNetwork:"网络错误，请重试。",errTimeout:"交易超时，请重试。",errContract:"交易失败，请重试。",errGeneric:"发生错误，请重试。",errAlreadyPending:"已有交易待处理，请稍候。",errNonce:"Nonce错误，请重启应用。",
    errLowLiquidity:"流动性不足。请先兑换USDT→FTA建立资金池，然后重试。",
    errNoFtaLiquidity:"FTA资金池为空。需要有人先兑换USDT→FTA。请尝试用USDT购买。",
    errMaxFtaSell:"最多可卖出 {max} FTA（受netFtaSold限制）。请先兑换USDT→FTA。",
    netFtaSoldLabel:"池子 (netFtaSold):",
    errSwapRejected:"兑换被拒绝。请检查资金池流动性。",
    errApprovalFailed:"授权失败。请检查钱包余额。",
    useUsdtInstead:"请尝试用USDT支付 — USDT购买始终可用。"
  },
  sg: {
    connect:"Connect",refTitle:"👥 Referral System",refDesc:"Enter your referrer's address to link.",bindRef:"BIND",power:"POWER",ftaSec:"Hashrate",pending:"PENDING",fta:"FTA",miningActive:"MINING ACTIVE",noMachine:"NO MACHINE",claim:"CLAIM",shopTitle:"⛏️ Shop",machines:"Machines",batteries:"Batteries",buy:"BUY",myAssets:"⚙️ Wallet & Assets",walletBal:"💰 Balances",plugMachine:"🔌 Plug in a machine",plugDesc:"Enter your offline machine ID and choose a battery.",machineId:"Machine ID (0, 1...)",plug:"PLUG IN ⚡",swapTitle:"💱 Swap",youPay:"You pay",balance:"Balance:",youReceive:"You receive",swap:"SWAP",loading:"Loading...",currentRate:"1 FTA = ",home:"Home",shop:"Shop",assets:"Wallet",swapNav:"Swap",connWallet:"Connecting...",errConn:"Connection Error",linking:"Linking...",wcIdMissing:"WalletConnect ID missing!",refLinked:"Referrer linked!",connFirst:"Connect first",enterRefAddr:"Referrer address (0x...)",buyingMachine:"Buying Machine",approveUsdt:"Approving USDT...",approveFta:"Approving FTA...",confirming:"Confirming...",calcFta:"Calculating price...",machineBought:"Machine purchased!",buyingBattery:"Buying Battery",batteryBought:"Battery purchased!",invalidId:"Invalid Machine ID",pluggingIn:"Plugging in...",pluggedIn:"Machine plugged in! ⚡",invalidAmount:"Invalid amount",swapping:"Swapping...",swapSuccess:"Swap successful!",claiming:"Claiming...",claimed:"Rewards claimed!",error:"Error",days:"Days",rig:"RIG",send:"Send",receive:"Receive",recipientAddr:"Recipient address (0x...)",amount:"Amount",confirmSend:"CONFIRM SEND",sending:"Sending...",sentSuccess:"Sent successfully!",addrCopied:"Address copied!",invalidAddr:"Invalid address",totalBal:"Total Balance",activeMachines:"⛏️ Active Machines",myMachines:"⛏️ My Machines",myBatteries:"🔋 My Batteries",active:"Active",expired:"Expired",inactive:"Inactive",available:"Available",plugged:"Plugged",notPlugged:"Not Plugged",timeRemaining:"Remaining",noMachines:"No machines yet",noBatteries:"No batteries yet",batteryLabel:"Battery",usdtPerFta:" USDT",noActiveMachines:"No active machines",exchangeRate:"Exchange Rate",priceImpact:"Price Impact",swapFee:"Swap Fee (4%)",minimumReceived:"Minimum Received",slippageTolerance:"Slippage Tolerance",networkFee:"Network Fee",
    errRejected:"Transaction cancelled",errInsufficientFunds:"Insufficient balance",errNetwork:"Network error.",errTimeout:"Transaction timed out.",errContract:"Transaction failed.",errGeneric:"An error occurred.",errAlreadyPending:"A transaction is already pending.",errNonce:"Nonce error.",
    errLowLiquidity:"Liquidity too low. Swap USDT→FTA first, then retry.",
    errNoFtaLiquidity:"No FTA liquidity yet. Swap USDT→FTA first. Or buy with USDT.",
    errMaxFtaSell:"Max sellable: {max} FTA. Swap USDT→FTA to increase.",
    netFtaSoldLabel:"Pool (netFtaSold):",
    errSwapRejected:"Swap rejected. Check pool liquidity.",
    errApprovalFailed:"Approval failed. Check wallet balance.",
    useUsdtInstead:"Try USDT instead — always works."
  }
};

// ===== CHAT INTENTS (unchanged) ===============================================
const CHAT_INTENTS = {
  greeting:{weight:2,keywords:{all:['hello','hi','hey','hola'],en:['good morning','sup','whats up'],fr:['bonjour','salut','coucou'],de:['hallo','guten tag','moin'],zh:['你好','您好','嗨']}},
  goodbye:{weight:2,keywords:{all:['bye','goodbye','see you'],fr:['au revoir','adieu'],de:['tschüss'],zh:['再见','拜拜']}},
  thanks:{weight:2,keywords:{all:['thanks','thank you','thx','ty','merci','danke','谢谢']}},
  help:{weight:3,keywords:{all:['help','aide','hilfe','帮助','guide'],en:['assist','confused']}},
  mining:{weight:2,keywords:{all:['mining','mine','miner','minage','挖矿','hashrate','power','算力']}},
  buy_machine:{weight:3,keywords:{all:['buy machine','rig','购买矿机','shop machine']}},
  buy_battery:{weight:3,keywords:{all:['battery','batterie','电池']}},
  plug_in:{weight:3,keywords:{all:['plug','activate','brancher','插入','connect machine']}},
  claim:{weight:3,keywords:{all:['claim','reward','réclamer','领取','harvest']}},
  swap:{weight:3,keywords:{all:['swap','exchange','échange','tausch','兑换','trade']}},
  wallet:{weight:2,keywords:{all:['wallet','balance','solde','钱包','余额','send','receive']}},
  referral:{weight:2,keywords:{all:['referral','parrain','推荐','invite','referrer']}},
  connect:{weight:3,keywords:{all:['connect','connexion','连接','metamask','walletconnect']}},
  what_is_fta:{weight:2,keywords:{all:['what is fta','fta是什么','about fta','fta token']}},
  how_it_works:{weight:2,keywords:{all:['how it works','getting started','beginner']}},
  earn_more:{weight:2,keywords:{all:['earn more','profit','strategy']}},
  price:{weight:2,keywords:{all:['price','prix','preis','价格','rate','cost']}},
  error:{weight:3,keywords:{all:['error','erreur','fehler','错误','problem','not working']}},
  status:{weight:2,keywords:{all:['status','état','状态','my mining']}},
  network:{weight:2,keywords:{all:['polygon','matic','pol','network','chain','网络']}},
  whatsapp:{weight:3,keywords:{all:['whatsapp','community','group','社群','群']}},
  crypto_basics:{weight:2,keywords:{all:['crypto','blockchain','加密','区块链']}},
  metamask_help:{weight:3,keywords:{all:['metamask','trust wallet','wallet setup']}},
  security:{weight:3,keywords:{all:['security','safe','scam','安全','seed phrase']}},
  deposit:{weight:3,keywords:{all:['deposit','add funds','fund','充值','入金']}},
  withdraw:{weight:3,keywords:{all:['withdraw','cash out','提现']}},
  profit:{weight:2,keywords:{all:['profit','roi','return','收益','回报']}},
  machine_comparison:{weight:2,keywords:{all:['compare','difference','vs','better','比较','区别']}},
  battery_duration:{weight:2,keywords:{all:['duration','how long','last','多久','有效期']}},
  app_navigation:{weight:2,keywords:{all:['navigate','where is','find','在哪','找不到']}},
  transaction_speed:{weight:2,keywords:{all:['slow','fast','speed','pending transaction','速度']}},
  fta_problems:{weight:4,keywords:{all:['fta not working','fta rejected','fta failed','buy with fta','swap fta','cannot buy','cannot swap','refuse','rejected','doesnt work']}}
};

// ===== ABI — only functions that EXIST on FitiaMiningV2 =======================
const MINING_ABI = [
  "function getMachineCount() view returns (uint256)",
  "function getBatteryCount() view returns (uint256)",
  "function machineTypes(uint256) view returns (uint256 price, uint256 power)",
  "function batteryTypes(uint256) view returns (uint256 price, uint256 duration)",
  "function getActivePower(address) view returns (uint256)",
  "function getCurrentRate() view returns (uint256)",
  "function getUsdtOutForFtaSell(uint256) view returns (uint256)",
  "function getFtaOutForUsdtBuy(uint256) view returns (uint256)",
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

const SWAP_FEE_RATE = 0.04;   // 4 %
const SLIPPAGE      = 0.005;

// ===== APPLICATION ============================================================
class Application {
  constructor() {
    this.provider=null;this.signer=null;this.contracts={};this.user=null;
    this.payMode='USDT';this.shopViewMode='machines';this.swapDirection='USDT_TO_FTA';
    this.ftaDecimals=18;this.usdtDecimals=6;
    this.currentDifficulty=1n;this.currentRealPower=0;this.pendingBalance=0;this.miningTimer=null;
    this.STORAGE_CLAIM="fitia_last_claim_time_v4";
    this.STORAGE_MACHINES="fitia_machines_v2";
    this.STORAGE_BATTERIES="fitia_batteries_v2";
    this.shopMachinesData=[];this.shopBatteriesData=[];this.isLoadingShop=false;
    this.polPriceUsd=0;this.ftaPriceUsd=0;
    this.userMachines=[];this.userBatteries={};this.userLastClaimTime=0;this.batteryTypeDurations={};
    this.vizContext=null;this.vizBars=[];this.sendTokenSymbol='POL';
    this.chatInitialized=false;this.chatHistory=[];
    this.netFtaSold=0n;
    const savedLang=localStorage.getItem('fitia_lang');
    this.currentLang=savedLang&&i18n[savedLang]?savedLang:'en';
  }
  t(key){return i18n[this.currentLang]?.[key]||i18n['en'][key]||key;}
  formatUsd(v){return'$'+v.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});}
  formatHashrate(h){if(h<=0)return'0 H/s';const u=['H/s','KH/s','MH/s','GH/s','TH/s','PH/s'];let v=h,i=0;while(v>=1000&&i<u.length-1){v/=1000;i++;}return v.toFixed(2)+' '+u[i];}
  formatTimeRemaining(s){if(s<=0)return this.t('expired');const d=Math.floor(s/86400),h=Math.floor((s%86400)/3600),m=Math.floor((s%3600)/60);if(d>1)return`${d}d ${h}h`;if(d===1)return`1d ${h}h`;if(h>0)return`${h}h ${m}m`;return`${m}m`;}
  getBatteryDuration(id){if(this.batteryTypeDurations[id]!==undefined)return this.batteryTypeDurations[id];return{0:3,1:7,2:15,3:30,4:90,5:180,6:270,7:365}[id]||30;}
  _loadLocalAssets(){try{this.userMachines=JSON.parse(localStorage.getItem(this.STORAGE_MACHINES))||[];}catch(e){this.userMachines=[];}try{this.userBatteries=JSON.parse(localStorage.getItem(this.STORAGE_BATTERIES))||{};}catch(e){this.userBatteries={};}try{this.userLastClaimTime=parseInt(localStorage.getItem(this.STORAGE_CLAIM))||Math.floor(Date.now()/1000);}catch(e){this.userLastClaimTime=Math.floor(Date.now()/1000);}}
  _saveLocalAssets(){localStorage.setItem(this.STORAGE_MACHINES,JSON.stringify(this.userMachines));localStorage.setItem(this.STORAGE_BATTERIES,JSON.stringify(this.userBatteries));localStorage.setItem(this.STORAGE_CLAIM,String(this.userLastClaimTime||Math.floor(Date.now()/1000)));}

  // ── Lang ────────────────────────────────────────────────────────────────
  setLanguage(lang){if(!i18n[lang])return;this.currentLang=lang;localStorage.setItem('fitia_lang',lang);const f={en:'🇬🇧',fr:'🇫🇷',de:'🇩🇪',zh:'🇨🇳',sg:'🇸🇬'};document.getElementById('lang-btn-display').innerText=`${f[lang]} ${lang.toUpperCase()}`;this.applyTranslations();this.renderShop();}
  applyTranslations(){const st=(s,k)=>{const e=document.querySelector(s);if(e)e.innerText=this.t(k);};const sp=(s,k)=>{const e=document.querySelector(s);if(e)e.placeholder=this.t(k);};st('#btn-connect','connect');st('.total-balance-card small','totalBal');st('.referral-card h3','refTitle');st('.referral-card p.small-text','refDesc');sp('#ref-address-input','enterRefAddr');st('.referral-card .btn-full','bindRef');const ss=document.querySelectorAll('.stat-card');if(ss[0]){ss[0].querySelector('small:first-child').innerText=this.t('power');ss[0].querySelector('small:last-child').innerText=this.t('ftaSec');}if(ss[1]){ss[1].querySelector('small:first-child').innerText=this.t('pending');ss[1].querySelector('small:last-child').innerText=this.t('fta');}const mb=document.querySelector('.btn-mega span:last-child');if(mb)mb.textContent=this.t('claim');st('#view-shop .view-title','shopTitle');const tb=document.querySelectorAll('.shop-tab');if(tb[0])tb[0].innerText=this.t('machines');if(tb[1])tb[1].innerText=this.t('batteries');st('#view-my-rigs .view-title','myAssets');st('#active-machines-section .section-title','activeMachines');const wc=document.querySelectorAll('#view-my-rigs .card');if(wc[1])wc[1].querySelector('.section-title').innerText=this.t('myMachines');if(wc[2])wc[2].querySelector('.section-title').innerText=this.t('myBatteries');st('#view-swap .view-title','swapTitle');const sh=document.querySelectorAll('.swap-header span:first-child');if(sh[0])sh[0].innerText=this.t('youPay');if(sh[1])sh[1].innerText=this.t('youReceive');st('#view-swap .btn-primary','swap');document.querySelectorAll('.nav-item span').forEach((s,i)=>s.innerText=this.t(['home','shop','assets','swapNav'][i]));}
  async init(){this.setLanguage(this.currentLang);}

  // ── Prices ──────────────────────────────────────────────────────────────
  async fetchMarketPrices(){this.polPriceUsd=0;try{const r=await fetch('https://api.dexscreener.com/latest/dex/tokens/0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0');const d=await r.json();if(d.pairs?.length)this.polPriceUsd=parseFloat(d.pairs[0].priceUsd)||0;}catch(e){}if(!this.polPriceUsd){try{const r=await fetch('https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd');const d=await r.json();this.polPriceUsd=d['matic-network']?.usd||0;}catch(e2){}}if(!this.polPriceUsd)this.polPriceUsd=0.70;}

  // ── Connect ─────────────────────────────────────────────────────────────
  async connect(){if(window.ethereum){this.setLoader(true,this.t('connWallet'));try{await window.ethereum.request({method:'eth_requestAccounts'});this.provider=new ethers.BrowserProvider(window.ethereum);this.signer=await this.provider.getSigner();this.user=await this.signer.getAddress();const n=await this.provider.getNetwork();if(Number(n.chainId)!==CONFIG.CHAIN_ID)await this.switchNetwork();this.initContracts();window.ethereum.on('accountsChanged',()=>window.location.reload());window.ethereum.on('chainChanged',()=>window.location.reload());}catch(e){this.showError(e);}finally{this.setLoader(false);}}else if(typeof EthereumProvider!=='undefined'&&CONFIG.WC_PROJECT_ID&&!CONFIG.WC_PROJECT_ID.includes("...")){this.setLoader(true,this.t('connWallet'));try{const wc=await EthereumProvider.init({projectId:CONFIG.WC_PROJECT_ID,chains:[CONFIG.CHAIN_ID],showQrModal:true,methods:['eth_sendTransaction','personal_sign'],metadata:{name:'FITIA PRO MINER',description:'Mining DApp',url:window.location.origin,icons:[window.location.origin+'/logo.png']}});await wc.enable();this.provider=new ethers.BrowserProvider(wc);this.signer=await this.provider.getSigner();this.user=await this.signer.getAddress();this.initContracts();wc.on("disconnect",()=>window.location.reload());}catch(e){this.showError(e);}finally{this.setLoader(false);}}else{this.showToast(CONFIG.WC_PROJECT_ID?.includes("...")?this.t('wcIdMissing'):"Please install MetaMask or use a Web3 browser.",true);}}
  async initContracts(){this.contracts.usdt=new ethers.Contract(CONFIG.USDT,ERC20_ABI,this.signer);this.contracts.fta=new ethers.Contract(CONFIG.FTA,ERC20_ABI,this.signer);this.contracts.mining=new ethers.Contract(CONFIG.MINING,MINING_ABI,this.signer);try{this.ftaDecimals=Number(await this.contracts.fta.decimals());}catch(e){this.ftaDecimals=18;}try{this.usdtDecimals=Number(await this.contracts.usdt.decimals());}catch(e){this.usdtDecimals=6;}document.getElementById('btn-connect').classList.add('hidden');document.getElementById('wallet-status').classList.remove('hidden');document.getElementById('addr-display').innerText=this.user.slice(0,6)+"..."+this.user.slice(-4);this._loadLocalAssets();if(!localStorage.getItem(this.STORAGE_CLAIM)){this.userLastClaimTime=Math.floor(Date.now()/1000);this._saveLocalAssets();}await this.fetchMarketPrices();await this.cacheBatteryDurations();await this.updateData();setInterval(()=>this.updateData(),15000);this.initVisualizer();window.addEventListener('resize',()=>this.resizeCanvas());}
  async cacheBatteryDurations(){try{const c=Number(await this.contracts.mining.getBatteryCount());for(let i=0;i<c;i++){try{const b=await this.contracts.mining.batteryTypes(i);this.batteryTypeDurations[i]=Number(b.duration)/86400;}catch(e){}}}catch(e){}}
  async switchNetwork(){try{await window.ethereum.request({method:'wallet_switchEthereumChain',params:[{chainId:'0x89'}]});}catch(e){if(e.code===4902){await window.ethereum.request({method:'wallet_addEthereumChain',params:[{chainId:'0x89',chainName:'Polygon',nativeCurrency:{name:'MATIC',symbol:'MATIC',decimals:18},rpcUrls:['https://polygon-rpc.com/'],blockExplorerUrls:['https://polygonscan.com/']}]});}}}

  // ═══════════ DATA REFRESH ═══════════════════════════════════════════════
  async updateData(){
    if(!this.user)return;
    try{
      const rawPower=await this.contracts.mining.getActivePower(this.user);
      this.currentRealPower=Number(rawPower);
      try{this.currentDifficulty=BigInt(await this.contracts.mining.difficultyMultiplier());}catch(e){}
      try{this.netFtaSold=BigInt(await this.contracts.mining.netFtaSold());}catch(e){}

      const now=Math.floor(Date.now()/1000),elapsed=now-this.userLastClaimTime;
      if(this.currentRealPower>0&&elapsed>0){
        const rps=(this.currentRealPower*Number(this.currentDifficulty))/1e18;
        this.pendingBalance=rps*elapsed;
        document.getElementById('val-pending').innerText=this.pendingBalance.toFixed(5);
        document.getElementById('viz-status').innerText=this.t('miningActive');
        document.getElementById('viz-status').style.color="var(--primary)";
      }else{
        this.pendingBalance=0;
        document.getElementById('val-pending').innerText="0.00000";
        document.getElementById('viz-status').innerText=this.t('noMachine');
        document.getElementById('viz-status').style.color="#666";
      }
      this.updateVisualizerIntensity(this.currentRealPower);
      if(this.currentRealPower>0){if(!this.miningTimer)this.startMiningCounter();}else{this.stopMiningCounter();}
      document.getElementById('val-power').innerText=this.formatHashrate(this.currentRealPower);

      const polBal=await this.provider.getBalance(this.user);
      const usdtBal=await this.contracts.usdt.balanceOf(this.user);
      const ftaBal=await this.contracts.fta.balanceOf(this.user);
      const pB=parseFloat(ethers.formatUnits(polBal,18));
      const uB=parseFloat(ethers.formatUnits(usdtBal,this.usdtDecimals));
      const fB=parseFloat(ethers.formatUnits(ftaBal,this.ftaDecimals));
      document.getElementById('bal-pol-2').innerText=pB.toFixed(4);
      document.getElementById('bal-usdt-2').innerText=uB.toFixed(2);
      document.getElementById('bal-fta-2').innerText=fB.toFixed(4);

      const rate=await this.contracts.mining.getCurrentRate();
      this.ftaPriceUsd=parseFloat(ethers.formatUnits(rate,this.ftaDecimals));
      document.getElementById('price-pol').innerText=this.formatUsd(this.polPriceUsd);
      document.getElementById('price-usdt').innerText=this.formatUsd(1);
      document.getElementById('price-fta').innerText=this.formatUsd(this.ftaPriceUsd);
      document.getElementById('bal-pol-2-usd').innerText='≈ '+this.formatUsd(pB*this.polPriceUsd);
      document.getElementById('bal-usdt-2-usd').innerText='≈ '+this.formatUsd(uB);
      document.getElementById('bal-fta-2-usd').innerText='≈ '+this.formatUsd(fB*this.ftaPriceUsd);
      document.getElementById('val-total-usd').innerText=this.formatUsd(pB*this.polPriceUsd+uB+fB*this.ftaPriceUsd);
      document.getElementById('swap-rate').innerText=this.t('currentRate')+this.ftaPriceUsd.toFixed(6)+this.t('usdtPerFta');

      // ── netFtaSold info for swap tab ──
      const nfsEl=document.getElementById('net-fta-sold-display');
      if(nfsEl){
        const nfsHuman=parseFloat(ethers.formatUnits(this.netFtaSold,this.ftaDecimals));
        nfsEl.innerText=nfsHuman.toFixed(4)+' FTA';
        nfsEl.style.color=this.netFtaSold===0n?'#ef4444':'#10b981';
      }

      const fromDec=this.swapDirection==='USDT_TO_FTA'?this.usdtDecimals:this.ftaDecimals;
      const toDec=this.swapDirection==='USDT_TO_FTA'?this.ftaDecimals:this.usdtDecimals;
      document.getElementById('swap-bal-from').innerText=parseFloat(ethers.formatUnits(this.swapDirection==='USDT_TO_FTA'?usdtBal:ftaBal,fromDec)).toFixed(4);
      document.getElementById('swap-bal-to').innerText=parseFloat(ethers.formatUnits(this.swapDirection==='USDT_TO_FTA'?ftaBal:usdtBal,toDec)).toFixed(4);

      await this.renderShop();
      this.renderActiveMachines();this.renderUserMachines();this.renderUserBatteries();
      if(document.getElementById('swap-from-in').value)this.calcSwap();
    }catch(e){console.error("Refresh Error",e);}
  }

  startMiningCounter(){if(this.miningTimer)return;this.miningTimer=setInterval(()=>{if(this.currentRealPower>0){const rps=(this.currentRealPower*Number(this.currentDifficulty))/1e18;this.pendingBalance+=rps;document.getElementById('val-pending').innerText=this.pendingBalance.toFixed(5);document.getElementById('val-pending').style.color='var(--primary)';setTimeout(()=>{document.getElementById('val-pending').style.color='var(--text)';},500);}},1000);}
  stopMiningCounter(){if(this.miningTimer){clearInterval(this.miningTimer);this.miningTimer=null;}}

  // ── Referral ────────────────────────────────────────────────────────────
  async bindReferrer(){const a=document.getElementById('ref-address-input').value.trim();if(!ethers.isAddress(a))return this.showToast(this.t('invalidAddr'),true);this.setLoader(true,this.t('linking'));try{const tx=await this.contracts.mining.setReferrer(a);await tx.wait();this.showToast(this.t('refLinked'));document.getElementById('ref-address-input').value='';}catch(e){this.showError(e);}this.setLoader(false);}

  // ── Shop ────────────────────────────────────────────────────────────────
  setPayMode(m){this.payMode=m;document.getElementById('btn-pay-usdt').classList.toggle('active',m==='USDT');document.getElementById('btn-pay-fta').classList.toggle('active',m==='FTA');this.renderShop();}
  setShopView(v){this.shopViewMode=v;document.querySelectorAll('.shop-tab').forEach(t=>t.classList.remove('active'));if(event?.currentTarget)event.currentTarget.classList.add('active');this.renderShop();}
  async renderShop(){if(this.isLoadingShop)return;const c=document.getElementById('shop-list');if(this.shopViewMode==='machines'){if(!this.shopMachinesData.length)await this.fetchMachines();this._renderShopMachinesHTML(c);}else{if(!this.shopBatteriesData.length)await this.fetchBatteries();this._renderShopBatteriesHTML(c);}}
  async fetchMachines(){this.isLoadingShop=true;try{const cnt=Number(await this.contracts.mining.getMachineCount());const p=[];for(let i=0;i<cnt;i++)p.push(this.contracts.mining.machineTypes(i));const r=await Promise.all(p);this.shopMachinesData=[];for(let i=0;i<cnt;i++){const d=r[i];this.shopMachinesData.push({price:parseFloat(ethers.formatUnits(d.price,this.usdtDecimals)),power:Number(d.power),priceRaw:d.price});}}catch(e){console.error("fetchMachines",e);}this.isLoadingShop=false;}
  async fetchBatteries(){this.isLoadingShop=true;try{const cnt=Number(await this.contracts.mining.getBatteryCount());const p=[];for(let i=0;i<cnt;i++)p.push(this.contracts.mining.batteryTypes(i));const r=await Promise.all(p);this.shopBatteriesData=[];for(let i=0;i<cnt;i++){const d=r[i];this.shopBatteriesData.push({price:parseFloat(ethers.formatUnits(d.price,this.usdtDecimals)),days:Number(d.duration)/86400,priceRaw:d.price});}}catch(e){console.error("fetchBatteries",e);}this.isLoadingShop=false;}

  // ═══════════ BUY MACHINE (with FTA liquidity check) ═════════════════════
  async buyMachine(id){
    if(!this.user)return this.connect();
    this.setLoader(true,`${this.t('buyingMachine')} (${this.payMode})...`);
    try{
      const m=this.shopMachinesData[id];
      if(this.payMode==='USDT'){
        const al=await this.contracts.usdt.allowance(this.user,CONFIG.MINING);
        if(al<m.priceRaw){this.setLoader(true,this.t('approveUsdt'));await(await this.contracts.usdt.approve(CONFIG.MINING,m.priceRaw)).wait();}
        this.setLoader(true,this.t('confirming'));
        await(await this.contracts.mining.buyMachine(id)).wait();
      }else{
        // ── FTA PAYMENT: require netFtaSold > 0 ──
        if(this.netFtaSold===0n){
          this.showToast(this.t('errNoFtaLiquidity')+'\n'+this.t('useUsdtInstead'),true);
          this.setLoader(false);return;
        }
        let fc;
        try{
          fc=await this.contracts.mining.getFtaCostForUsdtSell(m.priceRaw);
        }catch(viewErr){
          this.showToast(this.t('errLowLiquidity'),true);
          this.setLoader(false);return;
        }
        if(fc===0n){this.showToast(this.t('errLowLiquidity'),true);this.setLoader(false);return;}
        const ftExact=fc*100n/89n;         // exact fee-included
        const ftApprove=ftExact*13n/10n;    // +30% buffer
        const al=await this.contracts.fta.allowance(this.user,CONFIG.MINING);
        if(al<ftApprove){
          this.setLoader(true,this.t('approveFta'));
          try{await(await this.contracts.fta.approve(CONFIG.MINING,ftApprove)).wait();}
          catch(apErr){this.showToast(this.t('errApprovalFailed'),true);this.setLoader(false);return;}
        }
        this.setLoader(true,this.t('confirming'));
        await(await this.contracts.mining.buyMachineWithFTA(id)).wait();
        // refresh netFtaSold after purchase
        try{this.netFtaSold=BigInt(await this.contracts.mining.netFtaSold());}catch(e){}
      }
      this.userMachines.push({typeId:id,expiresAt:0,pluggedBatteryType:null,boughtAt:Math.floor(Date.now()/1000)});
      this._saveLocalAssets();
      this.showToast(this.t('machineBought'));
      this.shopMachinesData=[];this.updateData();
    }catch(e){this.showError(e);}
    this.setLoader(false);
  }

  // ═══════════ BUY BATTERY (with FTA liquidity check) ═════════════════════
  async buyBattery(id){
    if(!this.user)return this.connect();
    this.setLoader(true,`${this.t('buyingBattery')} (${this.payMode})...`);
    try{
      const b=this.shopBatteriesData[id];
      if(this.payMode==='USDT'){
        const al=await this.contracts.usdt.allowance(this.user,CONFIG.MINING);
        if(al<b.priceRaw){this.setLoader(true,this.t('approveUsdt'));await(await this.contracts.usdt.approve(CONFIG.MINING,b.priceRaw)).wait();}
        this.setLoader(true,this.t('confirming'));
        await(await this.contracts.mining.buyBattery(id)).wait();
      }else{
        if(this.netFtaSold===0n){
          this.showToast(this.t('errNoFtaLiquidity')+'\n'+this.t('useUsdtInstead'),true);
          this.setLoader(false);return;
        }
        let fc;
        try{fc=await this.contracts.mining.getFtaCostForUsdtSell(b.priceRaw);}
        catch(viewErr){this.showToast(this.t('errLowLiquidity'),true);this.setLoader(false);return;}
        if(fc===0n){this.showToast(this.t('errLowLiquidity'),true);this.setLoader(false);return;}
        const ftExact=fc*100n/89n,ftApprove=ftExact*13n/10n;
        const al=await this.contracts.fta.allowance(this.user,CONFIG.MINING);
        if(al<ftApprove){
          this.setLoader(true,this.t('approveFta'));
          try{await(await this.contracts.fta.approve(CONFIG.MINING,ftApprove)).wait();}
          catch(apErr){this.showToast(this.t('errApprovalFailed'),true);this.setLoader(false);return;}
        }
        this.setLoader(true,this.t('confirming'));
        await(await this.contracts.mining.buyBatteryWithFTA(id)).wait();
        try{this.netFtaSold=BigInt(await this.contracts.mining.netFtaSold());}catch(e){}
      }
      this.userBatteries[id]=(this.userBatteries[id]||0)+1;
      this._saveLocalAssets();
      this.showToast(this.t('batteryBought'));
      this.shopBatteriesData=[];this.updateData();
    }catch(e){this.showError(e);}
    this.setLoader(false);
  }

  // ── Plug In ─────────────────────────────────────────────────────────────
  async plugInMachine(){
    const mIdx=document.getElementById('plug-machine-id').value,bT=document.getElementById('plug-battery-type').value;
    if(mIdx===""||mIdx<0)return this.showToast(this.t('invalidId'),true);
    const idx=Number(mIdx);
    if(idx>=this.userMachines.length)return this.showToast(this.t('invalidId'),true);
    if(!this.userBatteries[bT]||this.userBatteries[bT]<=0)return this.showToast("No battery of this type available",true);
    this.setLoader(true,this.t('pluggingIn'));
    try{
      await(await this.contracts.mining.plugInMachine(idx,bT)).wait();
      this.pendingBalance=0;this.userLastClaimTime=Math.floor(Date.now()/1000);
      const durSec=this.batteryTypeDurations[bT]?this.batteryTypeDurations[bT]*86400:2592000;
      this.userMachines[idx].expiresAt=Math.floor(Date.now()/1000)+durSec;
      this.userMachines[idx].pluggedBatteryType=Number(bT);
      this.userBatteries[bT]=Math.max(0,(this.userBatteries[bT]||0)-1);
      this._saveLocalAssets();
      this.showToast(this.t('pluggedIn'));this.updateData();
    }catch(e){this.showError(e);}
    this.setLoader(false);
  }

  // ── Claim ──────────────────────────────────────────────────────────────
  async claim(){if(!this.user)return;this.stopMiningCounter();this.setLoader(true,this.t('claiming'));try{await(await this.contracts.mining.claimRewards()).wait();this.pendingBalance=0;this.userLastClaimTime=Math.floor(Date.now()/1000);this._saveLocalAssets();this.showToast(this.t('claimed'));this.updateData();if(this.currentRealPower>0)this.startMiningCounter();}catch(e){this.showError(e);this.startMiningCounter();}this.setLoader(false);}

  // ═══════════ SWAP (with liquidity checks) ═══════════════════════════════
  toggleSwap(){
    this.swapDirection=this.swapDirection==='USDT_TO_FTA'?'FTA_TO_USDT':'USDT_TO_FTA';
    document.getElementById('token-from-display').innerText=this.swapDirection==='USDT_TO_FTA'?'USDT':'FTA';
    document.getElementById('token-to-display').innerText=this.swapDirection==='USDT_TO_FTA'?'FTA':'USDT';
    document.getElementById('swap-to-in').value='';document.getElementById('swap-from-in').value='';
    document.getElementById('swap-details').classList.add('hidden');this.updateData();
  }

  calcSwap(){
    const val=document.getElementById('swap-from-in').value;
    if(!val||val<=0){document.getElementById('swap-to-in').value='';document.getElementById('swap-details').classList.add('hidden');return;}
    const inputVal=parseFloat(val),isUsdtTo=this.swapDirection==='USDT_TO_FTA';
    const fee=inputVal*SWAP_FEE_RATE,netInput=inputVal-fee;
    let netOutput=0;
    if(this.ftaPriceUsd>0)netOutput=isUsdtTo?(netInput/this.ftaPriceUsd):(netInput*this.ftaPriceUsd);
    const minReceived=netOutput*(1-SLIPPAGE);
    document.getElementById('swap-to-in').value=netOutput>0?netOutput.toFixed(6):'';

    const detailsEl=document.getElementById('swap-details');detailsEl.classList.remove('hidden');
    const fromT=isUsdtTo?'USDT':'FTA',toT=isUsdtTo?'FTA':'USDT';
    document.getElementById('swap-detail-rate').innerText=isUsdtTo?`1 USDT = ${(1/this.ftaPriceUsd).toFixed(2)} FTA`:`1 FTA = ${this.ftaPriceUsd.toFixed(6)} USDT`;
    document.getElementById('swap-detail-fee').innerText=`${fee.toFixed(6)} ${fromT}`;
    document.getElementById('swap-detail-min').innerText=`${minReceived.toFixed(6)} ${toT}`;
    const gasPol=0.015;
    document.getElementById('swap-detail-network').innerText=`≈ ${gasPol.toFixed(3)} POL (${this.formatUsd(gasPol*this.polPriceUsd)})`;

    // ── netFtaSold warning for FTA→USDT ──
    const nfsWarn=document.getElementById('swap-nfta-warning');
    if(!isUsdtTo&&this.netFtaSold===0n){
      if(nfsWarn){nfsWarn.style.display='block';nfsWarn.innerText='⚠ '+this.t('errNoFtaLiquidity');}
    }else if(nfsWarn){nfsWarn.style.display='none';}
  }

  async executeSwap(){
    const val=document.getElementById('swap-from-in').value;
    if(!val||val<=0)return this.showToast(this.t('invalidAmount'),true);
    this.setLoader(true,this.t('swapping'));

    const isUsdtTo=this.swapDirection==='USDT_TO_FTA';
    const decimals=isUsdtTo?this.usdtDecimals:this.ftaDecimals;
    const amount=ethers.parseUnits(val,decimals);

    try{
      if(isUsdtTo){
        // USDT → FTA
        const al=await this.contracts.usdt.allowance(this.user,CONFIG.MINING);
        if(al<amount){this.setLoader(true,this.t('approveUsdt'));await(await this.contracts.usdt.approve(CONFIG.MINING,amount)).wait();}
        this.setLoader(true,this.t('confirming'));
        await(await this.contracts.mining.swapUsdtForFta(amount)).wait();
        // netFtaSold increased → refresh
        try{this.netFtaSold=BigInt(await this.contracts.mining.netFtaSold());}catch(e){}
      }else{
        // FTA → USDT — MUST have netFtaSold >= amount
        if(this.netFtaSold===0n){
          this.showToast(this.t('errNoFtaLiquidity'),true);this.setLoader(false);return;
        }
        if(BigInt(amount)>this.netFtaSold){
          const maxSell=parseFloat(ethers.formatUnits(this.netFtaSold,this.ftaDecimals));
          this.showToast(this.t('errMaxFtaSell').replace('{max}',maxSell.toFixed(4)),true);
          this.setLoader(false);return;
        }
        const al=await this.contracts.fta.allowance(this.user,CONFIG.MINING);
        if(al<amount){this.setLoader(true,this.t('approveFta'));await(await this.contracts.fta.approve(CONFIG.MINING,amount)).wait();}
        this.setLoader(true,this.t('confirming'));
        await(await this.contracts.mining.swapFtaForUsdt(amount)).wait();
        try{this.netFtaSold=BigInt(await this.contracts.mining.netFtaSold());}catch(e){}
      }
      this.showToast(this.t('swapSuccess'));
      document.getElementById('swap-from-in').value='';document.getElementById('swap-to-in').value='';
      document.getElementById('swap-details').classList.add('hidden');this.updateData();
    }catch(e){
      const em=(e?.message||'').toLowerCase();
      if(em.includes('insufficient liquidity')||em.includes('invalid amount')){
        this.showToast(this.t('errSwapRejected'),true);
      }else{this.showError(e);}
    }
    this.setLoader(false);
  }

  // ── Send / Receive ──────────────────────────────────────────────────────
  openSend(ts){this.sendTokenSymbol=ts;document.getElementById('send-token-name').innerText=ts;document.getElementById('send-to-address').value='';document.getElementById('send-amount').value='';let bid='bal-pol-2';if(ts==='USDT')bid='bal-usdt-2';if(ts==='FTA')bid='bal-fta-2';document.getElementById('send-bal').innerText=document.getElementById(bid)?.innerText||'0';document.getElementById('modal-send').classList.add('active');}
  openReceive(){if(!this.user)return this.showToast(this.t('connFirst'),true);document.getElementById('receive-addr-display').innerText=this.user;document.getElementById('modal-receive').classList.add('active');}
  closeModals(){document.getElementById('modal-send').classList.remove('active');document.getElementById('modal-receive').classList.remove('active');}
  copyReceiveAddress(){navigator.clipboard.writeText(this.user);this.showToast(this.t('addrCopied'));}
  async executeSend(){const to=document.getElementById('send-to-address').value.trim(),amt=document.getElementById('send-amount').value;if(!ethers.isAddress(to))return this.showToast(this.t('invalidAddr'),true);if(!amt||Number(amt)<=0)return this.showToast(this.t('invalidAmount'),true);this.setLoader(true,this.t('sending'));try{let tx;if(this.sendTokenSymbol==='POL'){tx=await this.signer.sendTransaction({to,value:ethers.parseEther(amt)});}else{let ct,dc;if(this.sendTokenSymbol==='USDT'){ct=this.contracts.usdt;dc=this.usdtDecimals;}if(this.sendTokenSymbol==='FTA'){ct=this.contracts.fta;dc=this.ftaDecimals;}tx=await ct.transfer(to,ethers.parseUnits(amt,dc));}await tx.wait();this.showToast(this.t('sentSuccess'));this.closeModals();this.updateData();}catch(e){this.showError(e);}this.setLoader(false);}

  // ── Nav ─────────────────────────────────────────────────────────────────
  nav(viewId){document.querySelectorAll('.view').forEach(el=>{el.classList.remove('active');el.style.display='none';});const av=document.getElementById('view-'+viewId);if(av){av.classList.add('active');av.style.display='block';}document.querySelectorAll('.nav-item').forEach(el=>el.classList.remove('active'));if(event?.currentTarget)event.currentTarget.classList.add('active');}

  // ── Visualizer ──────────────────────────────────────────────────────────
  resizeCanvas(){if(this.vizContext){const c=this.vizContext.canvas;c.width=c.offsetWidth*2;c.height=c.offsetHeight*2;}}
  initVisualizer(){const c=document.getElementById('mining-canvas');if(!c)return;this.resizeCanvas();this.vizContext=c.getContext('2d');this.vizBars=[];for(let i=0;i<20;i++)this.vizBars.push({height:0,targetHeight:0});this.animateVisualizer();}
  updateVisualizerIntensity(p){const maxP=100000,level=Math.min(Math.max(p/maxP,0.02),1);this.vizBars.forEach(b=>{b.targetHeight=(this.vizContext.canvas.height*level)*(0.6+Math.random()*0.4);});}
  animateVisualizer(){if(!this.vizContext)return;const ctx=this.vizContext;ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);ctx.fillStyle="#F0B90B";const w=ctx.canvas.width/20;this.vizBars.forEach((b,i)=>{b.height+=(b.targetHeight-b.height)*0.1;ctx.fillRect(i*w+2,ctx.canvas.height-b.height,w-4,b.height);b.targetHeight+=(Math.random()-0.5)*10;if(b.targetHeight<0)b.targetHeight=2;if(b.targetHeight>ctx.canvas.height)b.targetHeight=ctx.canvas.height;});requestAnimationFrame(()=>this.animateVisualizer());}

  // ── Loader / Toast / Errors ─────────────────────────────────────────────
  setLoader(show,msg="Processing..."){const l=document.getElementById('loader');document.getElementById('loader-text').innerText=msg;if(show)l.classList.remove('hidden');else l.classList.add('hidden');}
  showToast(msg,isError=false){const div=document.createElement('div');div.className='toast'+(isError?' toast-error':' toast-success');div.innerText=msg;document.getElementById('toast-container').appendChild(div);setTimeout(()=>div.remove(),5000);}
  getErrorMessage(e){const es=(e?.message||'').toLowerCase()+' '+(e?.code||'').toLowerCase()+' '+(e?.reason||'').toLowerCase()+' '+(e?.shortMessage||'').toLowerCase();const ie=(e?.info?.error?.message||'').toLowerCase();const c=es+' '+ie;if(c.includes('user rejected')||c.includes('user denied')||c.includes('cancelled by user')||c.includes('action_rejected')||e?.code==='ACTION_REJECTED'||e?.code===4001||e?.code===-32000||(e?.info?.error?.code===4001))return this.t('errRejected');if(c.includes('insufficient liquidity')||c.includes('insufficient fta liquidity')||c.includes('insufficient usdt liquidity'))return this.t('errLowLiquidity');if(c.includes('insufficient funds')||c.includes('insufficient balance')||c.includes('not enough')||c.includes('underpriced')||c.includes('exceeds allowance')||c.includes('erc20: insufficient')||c.includes('transfer amount exceeds'))return this.t('errInsufficientFunds');if(c.includes('nonce')||c.includes('already known')||c.includes('replacement fee too low'))return this.t('errNonce');if(c.includes('already pending')||c.includes('pending transaction'))return this.t('errAlreadyPending');if(c.includes('timeout')||c.includes('timed out')||c.includes('deadline'))return this.t('errTimeout');if(c.includes('network')||c.includes('fetch')||c.includes('failed to fetch')||c.includes('connection')||c.includes('could not decode')||c.includes('missing revert data')||c.includes('call revert exception'))return this.t('errNetwork');if(c.includes('invalid amount'))return this.t('errSwapRejected');if(c.includes('revert')||c.includes('execution reverted')||c.includes('vm execution error')||c.includes('gas required exceeds allowance')||c.includes('transaction failed'))return this.t('errContract');return this.t('errGeneric');}
  showError(e){console.error("Transaction Error:",e);this.showToast(this.getErrorMessage(e),true);}

  // ── Render UI ───────────────────────────────────────────────────────────
  renderActiveMachines(){const c=document.getElementById('active-machines-list');if(!c)return;const now=Math.floor(Date.now()/1000);const active=this.userMachines.filter(m=>m.expiresAt>now);if(!active.length){c.innerHTML=`<p class="small-text" style="text-align:center;">${this.t('noActiveMachines')}</p>`;return;}const tn=['MK-I','MK-II','MK-III','MK-IV','MK-V','MK-VI','MK-VII','MK-VIII'];c.innerHTML=active.map(m=>{const rem=m.expiresAt-now,dur=this.getBatteryDuration(m.pluggedBatteryType),tot=dur*86400,el=tot-rem,pr=Math.min(Math.max((el/tot)*100,0),100),bc=pr<60?'green':(pr<85?'yellow':'red');return`<div class="asset-row">${this.getMachineMiniSVG(m.typeId)}<div class="asset-info"><div class="asset-name">${tn[m.typeId%8]} <span class="status-pill active">● ${this.t('active')}</span></div><div class="asset-detail">${this.t('batteryLabel')}: ${dur} ${this.t('days')}</div><div class="battery-bar-wrap"><div class="battery-bar-header"><span class="battery-bar-label">${this.t('timeRemaining')}</span><span class="battery-bar-time ${bc}">${this.formatTimeRemaining(rem)}</span></div><div class="battery-bar"><div class="battery-bar-fill ${bc}" style="width:${pr.toFixed(1)}%"></div></div></div></div></div>`;}).join('');}

  renderUserMachines(){const c=document.getElementById('my-machines-list');if(!c)return;if(!this.userMachines.length){c.innerHTML=`<p class="small-text" style="text-align:center;">${this.t('noMachines')}</p>`;return;}const now=Math.floor(Date.now()/1000),tn=['MK-I','MK-II','MK-III','MK-IV','MK-V','MK-VI','MK-VII','MK-VIII'];c.innerHTML=this.userMachines.map((m,i)=>{let sc,st;if(m.expiresAt>now){sc='active';st=this.t('active');}else if(m.expiresAt>0){sc='expired';st=this.t('expired');}else{sc='inactive';st=this.t('inactive');}const dur=this.getBatteryDuration(m.pluggedBatteryType);let bh='';if(m.expiresAt>0){const rem=m.expiresAt-now,tot=dur*86400,el=tot-rem,pr=Math.min(Math.max((el/tot)*100,0),100),bc=rem<=0?'red':(pr<60?'green':(pr<85?'yellow':'red'));bh=`<div class="battery-bar-wrap"><div class="battery-bar-header"><span class="battery-bar-label">${this.t('batteryLabel')}: ${dur} ${this.t('days')}</span><span class="battery-bar-time ${bc}">${rem>0?this.formatTimeRemaining(rem):this.t('expired')}</span></div><div class="battery-bar"><div class="battery-bar-fill ${rem<=0?'gray':bc}" style="width:${rem<=0?100:pr.toFixed(1)}%"></div></div></div>`;}return`<div class="asset-row">${this.getMachineMiniSVG(m.typeId)}<div class="asset-info"><div class="asset-name">#${i} ${tn[m.typeId%8]} <span class="status-pill ${sc}">● ${st}</span></div><div class="asset-detail">${m.expiresAt>0?this.t('plugged'):this.t('notPlugged')}</div>${bh}</div></div>`;}).join('');}

  renderUserBatteries(){const c=document.getElementById('my-batteries-list');if(!c)return;const types=Object.entries(this.userBatteries).filter(([,cnt])=>cnt>0);if(!types.length){c.innerHTML=`<p class="small-text" style="text-align:center;">${this.t('noBatteries')}</p>`;return;}c.innerHTML=types.map(([tid,cnt])=>{const dur=this.getBatteryDuration(Number(tid)),cl=Math.floor(Math.random()*40)+60,lc=cl>60?'':(cl>20?'medium':(cl>0?'low':'empty'));return`<div class="asset-row"><div class="real-battery"><div class="battery-cap"></div><div class="battery-body"><div class="battery-level ${lc}" style="width:${cl}%"></div><div class="battery-charge-indicator">${cnt}×</div></div></div><div class="asset-info"><div class="asset-name">${dur} ${this.t('days')} <span class="status-pill available">● ${cnt} ${this.t('available')}</span></div></div></div>`;}).join('');}

  // ── SVG ─────────────────────────────────────────────────────────────────
  getMachineSVG(tier){const t=[{n:'MK-I',g:1,c:'#64748b',a:'#94a3b8',f:1},{n:'MK-II',g:2,c:'#3b82f6',a:'#60a5fa',f:1},{n:'MK-III',g:3,c:'#8b5cf6',a:'#a78bfa',f:2},{n:'MK-IV',g:4,c:'#F0B90B',a:'#FFD43B',f:2},{n:'MK-V',g:5,c:'#f97316',a:'#fb923c',f:2},{n:'MK-VI',g:6,c:'#ef4444',a:'#f87171',f:3},{n:'MK-VII',g:8,c:'#06b6d4',a:'#22d3ee',f:3},{n:'MK-VIII',g:8,c:'#eab308',a:'#facc15',f:4}][tier%8];const W=260,H=170;let gH='',fH='',lH='',vH='';const gw=24,gh=48,gG=3,mW=W-40;let eg=gw;let tW=t.g*eg+(t.g-1)*gG;if(tW>mW){eg=Math.floor((mW-(t.g-1)*gG)/t.g);tW=t.g*eg+(t.g-1)*gG;}const gS=(W-tW)/2,gY=22;for(let i=0;i<t.g;i++){const x=gS+i*(eg+gG);gH+=`<rect x="${x}" y="${gY}" width="${eg}" height="${gh}" rx="2" fill="#080c18" stroke="${t.a}" stroke-width="0.6" opacity="0.85"/>`;const fC=Math.max(3,Math.floor(eg/4)),fS=eg-6;for(let j=0;j<9;j++){const fy=gY+5+j*4.5;if(fy+2<gY+gh-10){for(let f=0;f<fC;f++){gH+=`<rect x="${x+3+f*(fS/fC)}" y="${fy}" width="${Math.max(1,(fS/fC)-1.5)}" height="2" rx="0.5" fill="${t.a}" opacity="0.12"/>`;}}}const cW=Math.min(10,eg-6);gH+=`<rect x="${x+(eg-cW)/2}" y="${gY+gh-11}" width="${cW}" height="7" rx="1.5" fill="${t.c}" opacity="0.35"/><circle cx="${x+eg/2}" cy="${gY+3}" r="1" fill="${t.a}" class="led-pulse" style="animation-delay:${i*0.3}s"/>`;}const fR=14,fS2=14,tFW=t.f*fR*2+(t.f-1)*fS2,fSX=(W-tFW)/2,fY=100;for(let i=0;i<t.f;i++){const cx=fSX+i*(fR*2+fS2)+fR,cy=fY;fH+=`<circle cx="${cx}" cy="${cy}" r="${fR+2}" fill="#060a14" stroke="#2a2a3e" stroke-width="1"/><circle cx="${cx}" cy="${cy}" r="${fR}" fill="#0a0e1a" stroke="#333" stroke-width="0.8"/><g class="fan-blades" style="transform-origin:${cx}px ${cy}px">`;for(let b=0;b<5;b++)fH+=`<rect x="${cx-1.5}" y="${cy-fR+3}" width="3" height="${fR-4}" rx="1.5" fill="#1e293b" transform="rotate(${b*72},${cx},${cy})"/>`;fH+=`</g><circle cx="${cx}" cy="${cy}" r="3.5" fill="${t.a}" opacity="0.4"/><circle cx="${cx}" cy="${cy}" r="1.5" fill="${t.a}" opacity="0.7"/>`;}for(let i=0;i<6;i++){const lx=25+i*9;lH+=`<circle cx="${lx}" cy="148" r="1.8" fill="${i===0?'#10b981':(i<3?t.a:'#334155')}" class="led-pulse" style="animation-delay:${i*0.4}s"/>`;}for(let v=0;v<3;v++)vH+=`<rect x="30" y="${138+v*5}" width="${W-60}" height="2" rx="1" fill="#060a14" opacity="0.8"/>`;return`<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" class="machine-svg"><defs><linearGradient id="bG${tier}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1e293b"/><stop offset="50%" stop-color="#162032"/><stop offset="100%" stop-color="#0f172a"/></linearGradient><linearGradient id="tB${tier}" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="${t.c}" stop-opacity="0.8"/><stop offset="50%" stop-color="${t.a}" stop-opacity="1"/><stop offset="100%" stop-color="${t.c}" stop-opacity="0.8"/></linearGradient></defs><ellipse cx="${W/2}" cy="${H-3}" rx="${W/2-30}" ry="10" fill="${t.a}" opacity="0.06"/><rect x="12" y="10" width="${W-24}" height="${H-22}" rx="8" fill="url(#bG${tier})" stroke="#2a3550" stroke-width="1.2"/><rect x="12" y="10" width="${W-24}" height="4" rx="2" fill="url(#tB${tier})"/><circle cx="20" cy="18" r="1.5" fill="#334155"/><circle cx="${W-20}" cy="18" r="1.5" fill="#334155"/><text x="${W-22}" y="20" font-family="monospace" font-size="7" font-weight="700" fill="${t.a}" text-anchor="end" opacity="0.7">${t.n}</text><text x="24" y="20" font-family="sans-serif" font-size="6" font-weight="800" fill="#475569" letter-spacing="1.5">FITIA</text>${gH}<line x1="28" y1="${gY+gh+6}" x2="${W-28}" y2="${gY+gh+6}" stroke="#1e293b" stroke-width="0.8" stroke-dasharray="2,2"/>${fH}${vH}${lH}<circle cx="${W-25}" cy="148" r="3.5" fill="none" stroke="${t.a}" stroke-width="0.8" opacity="0.5"/><line x1="${W-25}" y1="143.5" x2="${W-25}" y2="146" stroke="${t.a}" stroke-width="0.8" opacity="0.5"/></svg>`;}
  getMachineMiniSVG(tier){const c=['#64748b','#3b82f6','#8b5cf6','#F0B90B','#f97316','#ef4444','#06b6d4','#eab308'][tier%8],a=['#94a3b8','#60a5fa','#a78bfa','#FFD43B','#fb923c','#f87171','#22d3ee','#facc15'][tier%8];return`<svg viewBox="0 0 50 50" class="machine-svg-mini"><rect x="2" y="2" width="46" height="46" rx="6" fill="#1e293b" stroke="${c}" stroke-width="1"/><rect x="2" y="2" width="46" height="3" rx="1.5" fill="${c}" opacity="0.6"/><rect x="8" y="10" width="14" height="20" rx="2" fill="#080c18" stroke="${a}" stroke-width="0.5"/><rect x="28" y="10" width="14" height="20" rx="2" fill="#080c18" stroke="${a}" stroke-width="0.5"/><circle cx="21" cy="40" r="6" fill="#0a0e1a" stroke="#333" stroke-width="0.5"/><g class="fan-blades" style="transform-origin:21px 40px">${[0,72,144,216,288].map(r=>`<rect x="19.5" y="34.5" width="3" height="5" rx="1.5" fill="#1e293b" transform="rotate(${r},21,40)"/>`).join('')}</g><circle cx="21" cy="40" r="2" fill="${a}" opacity="0.6"/><circle cx="37" cy="40" r="6" fill="#0a0e1a" stroke="#333" stroke-width="0.5"/><g class="fan-blades" style="transform-origin:37px 40px">${[0,72,144,216,288].map(r=>`<rect x="35.5" y="34.5" width="3" height="5" rx="1.5" fill="#1e293b" transform="rotate(${r},37,40)"/>`).join('')}</g><circle cx="37" cy="40" r="2" fill="${a}" opacity="0.6"/></svg>`;}

  _renderShopMachinesHTML(c){c.innerHTML='';c.style.gridTemplateColumns='1fr 1fr';const bc=['background:#64748b;color:#fff','background:#3b82f6;color:#fff','background:#8b5cf6;color:#fff','background:#F0B90B;color:#000','background:#f97316;color:#fff','background:#ef4444;color:#fff','background:#06b6d4;color:#000','background:#eab308;color:#000'];const bn=['STARTER','STANDARD','ADVANCED','PRO','ELITE','ULTRA','SUPREME','LEGEND'];for(let i=0;i<this.shopMachinesData.length;i++){const d=this.shopMachinesData[i],div=document.createElement('div');div.className='rig-item';div.innerHTML=`<span class="tier-badge" style="${bc[i%8]}">${bn[i%8]}</span>${this.getMachineSVG(i)}<span class="rig-name" style="font-size:0.85rem;">${this.t('rig')} ${i+1}</span><span class="rig-power" style="font-size:0.75rem;">${this.formatHashrate(d.power)}</span><span class="rig-price" style="font-size:1rem;">${d.price.toFixed(2)} $</span><button class="btn-primary" style="padding:8px;font-size:0.75rem;margin-top:6px;" onclick="App.buyMachine(${i})">${this.t('buy')} (${this.payMode})</button>`;c.appendChild(div);}}
  _renderShopBatteriesHTML(c){c.innerHTML='';c.style.gridTemplateColumns='1fr 1fr';for(let i=0;i<this.shopBatteriesData.length;i++){const d=this.shopBatteriesData[i],div=document.createElement('div'),cl=Math.floor(Math.random()*40)+60;div.className='battery-shop-item';div.innerHTML=`<div class="real-battery"><div class="battery-cap"></div><div class="battery-body"><div class="battery-level" style="width:${cl}%"></div><div class="battery-charge-indicator">${d.days}D</div></div></div><div class="battery-name">${d.days} ${this.t('days')}</div><div class="battery-price">${d.price.toFixed(2)} $</div><button class="btn-primary" style="padding:6px;font-size:0.75rem" onclick="App.buyBattery(${i})">${this.t('buy')} (${this.payMode})</button>`;c.appendChild(div);}}

  // ═══════════ CHAT ═══════════════════════════════════════════════════════
  toggleChat(){const p=document.getElementById('chat-panel');const a=p.classList.toggle('active');if(a&&!this.chatInitialized){this.chatInitialized=true;setTimeout(()=>this.addChatBubble('assistant',this.getWelcomeMessage()),400);}if(a)setTimeout(()=>document.getElementById('chat-input').focus(),350);}
  sendChatMessage(){const i=document.getElementById('chat-input'),m=i.value.trim();if(!m)return;i.value='';this.addChatBubble('user',m);this.chatHistory.push({role:'user',text:m});const tid=this.showTyping();setTimeout(()=>{this.removeTyping(tid);const r=this.generateLocalResponse(m);this.addChatBubble('assistant',r);this.chatHistory.push({role:'assistant',text:r});},400+Math.min(m.length*25,1200)+Math.random()*400);}
  addChatBubble(role,text){const c=document.getElementById('chat-messages'),b=document.createElement('div');b.className=`chat-bubble ${role}`;b.textContent=text;c.appendChild(b);requestAnimationFrame(()=>c.scrollTop=c.scrollHeight);}
  showTyping(){const c=document.getElementById('chat-messages'),t=document.createElement('div'),id='typing-'+Date.now();t.id=id;t.className='chat-bubble assistant';t.innerHTML='<span style="letter-spacing:3px;animation:loaderTextPulse 1s infinite">● ● ●</span>';c.appendChild(t);c.scrollTop=c.scrollHeight;return id;}
  removeTyping(id){const e=document.getElementById(id);if(e)e.remove();}
  getWelcomeMessage(){const m={en:"👋 Welcome to FITIA PRO! I'm your crypto assistant.\n⚠️ Important: to buy with FTA or swap FTA→USDT, someone must first swap USDT→FTA to build the liquidity pool.\n💡 In the meantime, use USDT for purchases — it always works!",fr:"👋 Bienvenue sur FITIA PRO !\n⚠️ Pour acheter avec FTA ou échanger FTA→USDT, quelqu'un doit d'abord échanger USDT→FTA.\n💡 Utilisez USDT pour les achats — ça marche toujours !",de:"👋 Willkommen! ⚠️ Für FTA-Käufe muss zuerst USDT→FTA getauscht werden.",zh:"👋 欢迎！⚠️ 用FTA购买或兑换FTA→USDT前，需要先兑换USDT→FTA建立流动性。💡 用USDT购买始终可用！",sg:"👋 Welcome! ⚠️ FTA purchases & FTA→USDT swaps require USDT→FTA first."};return m[this.currentLang]||m.en;}
  generateLocalResponse(msg){const m=msg.toLowerCase().replace(/[?!.,;:'"]/g,'').trim();const intents=this.detectIntents(m);return this.craftResponse(intents.length>0?intents[0].intent:'unknown');}
  detectIntents(m){const s=[];for(const[intent,data]of Object.entries(CHAT_INTENTS)){let sc=0;for(const lk of['all',this.currentLang,'en']){if(!data.keywords[lk])continue;for(const kw of data.keywords[lk]){if(m.includes(kw))sc+=(data.weight||1);}}if(sc>0)s.push({intent,score:sc});}s.sort((a,b)=>b.score-a.score);return s;}
  craftResponse(intent){const L=this.currentLang,conn=!!this.user,ac=this.userMachines.filter(m=>m.expiresAt>Math.floor(Date.now()/1000)).length,pick=a=>a[Math.floor(Math.random()*a.length)];const R={greeting:{en:conn?[`👋 Power: ${this.formatHashrate(this.currentRealPower)}. ${ac} active.`]:["👋 Welcome! Connect wallet."]},goodbye:{en:["👋 See you! Happy mining!"]},thanks:{en:["You're welcome! 😊"]},help:{en:["🛠️ I can help with: Mining, Shop, Swap, Wallet, Security, Community. Just ask!"]},whatsapp:{en:[`📱 WhatsApp: ${CONFIG.WHATSAPP_GROUP}`]},crypto_basics:{en:["🏁 Blockchain = digital ledger. Wallet = stores crypto. Ask me about setup!"]},metamask_help:{en:["🦊 Download MetaMask → Create wallet → Save seed phrase → Polygon. NEVER share seed phrase!"]},security:{en:["🛡️ NEVER share seed phrase. Double-check addresses."]},deposit:{en:["💰 Copy address → Send USDT/POL on POLYGON → Confirm."]},withdraw:{en:["💸 Mine → Claim → Swap FTA→USDT → Send to exchange."]},mining:{en:conn?[`⛏️ Buy machine → Battery → Plug in → Mine! Power: ${this.formatHashrate(this.currentRealPower)}`]:["⛏️ Connect wallet!"]},buy_machine:{en:conn?["🛒 Shop → Choose USDT or FTA → BUY. 💡 USDT always works; FTA needs liquidity."]:["🛒 Connect wallet!"]},buy_battery:{en:conn?["🔋 Shop → Batteries → BUY. Longer = better value!"]:["🔋 Connect wallet!"]},plug_in:{en:conn?["🔌 Wallet → Plug in → Machine ID → Battery → PLUG IN."]:["🔌 Connect!"]},claim:{en:conn?[`🎁 Home → CLAIM. Pending: ${this.pendingBalance.toFixed(5)} FTA`]:["🎁 Connect!"]},swap:{en:[`💱 Swap tab. Rate: ${this.ftaPriceUsd>0?this.ftaPriceUsd.toFixed(6):'...'} USDT/FTA. ⚠️ FTA→USDT requires netFtaSold>0.`]},wallet:{en:conn?[`💰 ${this.user?.slice(0,6)}...${this.user?.slice(-4)}. Polygon only!`]:["💰 Connect!"]},referral:{en:["👥 Your address = referral code. Share it!"]},connect:{en:conn?["✅ Connected!"]:["🔗 Click Connect → Approve → Polygon."]},what_is_fta:{en:[`🪙 FTA = mining reward token. Price: ${this.ftaPriceUsd>0?'$'+this.ftaPriceUsd.toFixed(6):'...'}`]},how_it_works:{en:["📖 Connect → Deposit → Buy → Plug in → Mine → Claim → Swap."]},earn_more:{en:["📈 Upgrade machines, run multiple, reinvest."]},price:{en:conn?[`📊 FTA: ${this.ftaPriceUsd>0?'$'+this.ftaPriceUsd.toFixed(6):'...'} | USDT: $1.00`]:["📊 Connect!"]},error:{en:["🔧 Try: use USDT instead of FTA for purchases. FTA needs liquidity pool (swap USDT→FTA first)."]},status:{en:conn?[`📊 Power: ${this.formatHashrate(this.currentRealPower)} | Active: ${ac} | Pending: ${this.pendingBalance.toFixed(5)} FTA`]:["📊 Connect!"]},network:{en:["🌐 Polygon. Low gas. ⚠️ Make sure wallet is on Polygon!"]},profit:{en:["💸 Higher tiers = more FTA/sec. Longer batteries = better value/day."]},machine_comparison:{en:["⚖️ MK-I → MK-VIII. Higher = more FTA/sec!"]},battery_duration:{en:["🔋 3 to 365 days. Popular: 30 days."]},app_navigation:{en:["📱 Home → Shop → Wallet → Swap."]},transaction_speed:{en:["⏱️ Polygon: 2-5 sec."]},fta_problems:{en:conn?[`⚠️ FTA purchases & swaps require liquidity.\n\n🔍 Current netFtaSold: ${parseFloat(ethers.formatUnits(this.netFtaSold,this.ftaDecimals)).toFixed(4)} FTA\n\n✅ SOLUTION: Use USDT to buy machines/batteries.\n✅ Or: Swap USDT→FTA first to build the pool, then retry.`]:["⚠️ Connect wallet first!"]},unknown:{en:["🤔 Try: 'mining', 'buy', 'swap', 'help'. If FTA issues: use USDT instead!"]}};const res=R[intent]||R.unknown,lr=res[L]||res.en||res;return Array.isArray(lr)?pick(lr):lr;}
}

const App=new Application();
window.onload=()=>App.init();