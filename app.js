/**
 * FITIA PRO MINER — app.js v4
/* ═════════════════════════════════════════════════════════════
   CONFIG
   ═════════════════════════════════════════════════════════════ */
const CONFIG = {
  MINING:          "0xa70147A41F10e84D25A97997d7e2507096F86BAD",
  USDT:            "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
  FTA:             "0x5c418b12c7e9c2A8e9A71A68c6d9b319E7B1d1fd",
  CHAIN_ID:        137,
  WC_PROJECT_ID:   "2c10ee910a836551fbabbf7c8cc4542a",
  WHATSAPP_GROUP:   "https://chat.whatsapp.com/BDsvPCB6xp8H8X0YaRmPFP",
  WHATSAPP_CHANNEL: "https://whatsapp.com/channel/0029VbCQhI38PgsPLbBJdV1e"
};

/* ═════════════════════════════════════════════════════════════
   i18n — 5 languages
   ═════════════════════════════════════════════════════════════ */
const i18n = {

en: {
  // ── Navigation ──
  connect:"Connect",home:"Home",shop:"Shop",assets:"Wallet",swapNav:"Swap",
  // ── Dashboard ──
  refTitle:"👥 Referral System",refDesc:"Enter your referrer's address to link.",bindRef:"BIND",
  power:"POWER",ftaSec:"Hashrate",pending:"PENDING",fta:"FTA",miningActive:"MINING ACTIVE",
  noMachine:"NO MACHINE",claim:"CLAIM",totalBal:"Total Balance",
  // ── Shop ──
  shopTitle:"⛏️ Shop",machines:"Machines",batteries:"Batteries",buy:"BUY",
  // ── Assets ──
  myAssets:"⚙️ Wallet & Assets",walletBal:"💰 Balances",
  plugMachine:"🔌 Plug in a machine",plugDesc:"Enter your offline machine ID and choose a battery.",
  machineId:"Machine ID (0, 1...)",plug:"PLUG IN ⚡",
  activeMachines:"⛏️ Active Machines",myMachines:"⛏️ My Machines",myBatteries:"🔋 My Batteries",
  active:"Active",expired:"Expired",inactive:"Inactive",available:"Available",
  plugged:"Plugged",notPlugged:"Not Plugged",timeRemaining:"Remaining",
  noMachines:"No machines yet",noBatteries:"No batteries yet",batteryLabel:"Battery",
  noActiveMachines:"No active machines",
  // ── Swap ──
  swapTitle:"💱 Swap",youPay:"You pay",balance:"Balance:",youReceive:"You receive",swap:"SWAP",
  currentRate:"1 FTA = ",usdtPerFta:" USDT",
  exchangeRate:"Exchange Rate",priceImpact:"Price Impact",swapFee:"Swap Fee (4%)",
  minimumReceived:"Minimum Received",slippageTolerance:"Slippage Tolerance",networkFee:"Network Fee",
  liquidityReserve:"Protocol Liquidity (FTA)",liquidityHint:"Backed by smart contract reserves on Polygon",
  // ── Wallet ──
  send:"Send",receive:"Receive",recipientAddr:"Recipient address (0x...)",amount:"Amount",
  confirmSend:"CONFIRM SEND",receiveHint:"Send only POL, USDT or FTA to this address on Polygon.",
  tapToCopy:"Tap to copy",
  // ── Status ──
  loading:"Loading...",connWallet:"Connecting...",linking:"Linking...",
  buyingMachine:"Buying Machine",approveUsdt:"Approving USDT...",approveFta:"Approving FTA...",
  confirming:"Confirming...",calcFta:"Calculating price...",
  buyingBattery:"Buying Battery",pluggingIn:"Plugging in...",swapping:"Swapping...",
  claiming:"Claiming...",sending:"Sending...",
  // ── Success ──
  machineBought:"Machine purchased!",batteryBought:"Battery purchased!",
  pluggedIn:"Machine plugged in! ⚡",swapSuccess:"Swap successful!",
  claimed:"Rewards claimed!",sentSuccess:"Sent successfully!",
  addrCopied:"Address copied!",refLinked:"Referrer linked!",
  // ── Errors ──
  error:"Error",connFirst:"Connect first",invalidId:"Invalid Machine ID",
  invalidAmount:"Invalid amount",invalidAddr:"Invalid address",
  wcIdMissing:"WalletConnect ID missing!",days:"Days",rig:"RIG",
  errRejected:"Transaction cancelled",errInsufficientFunds:"Insufficient balance",
  errNetwork:"Network error. Please try again.",errTimeout:"Transaction timed out.",
  errContract:"Transaction failed. Please try again.",errGeneric:"An error occurred. Please try again.",
  errAlreadyPending:"A transaction is already pending. Please wait.",
  errNonce:"Transaction nonce error. Please restart the app.",
  errLowLiquidity:"Liquidity too low. Swap USDT→FTA first to build the pool, then retry.",
  errNoFtaLiquidity:"No FTA liquidity in the pool yet. Someone must swap USDT→FTA first before FTA purchases work. Try buying with USDT instead.",
  errMaxFtaSell:"Cannot sell more than {max} FTA — the pool limit is netFtaSold. Swap USDT→FTA first to increase the limit.",
  errSwapRejected:"Swap rejected by contract. Check if pool has enough liquidity.",
  errApprovalFailed:"Token approval failed. Check your wallet balance and try again.",
  useUsdtInstead:"Try paying with USDT instead — USDT purchases always work.",
},

fr: {
  connect:"Connecter",home:"Accueil",shop:"Boutique",assets:"Wallet",swapNav:"Swap",
  refTitle:"👥 Parrainage",refDesc:"Entrez l'adresse de votre parrain.",bindRef:"LIER",
  power:"PUISSANCE",ftaSec:"Hashrate",pending:"EN ATTENTE",fta:"FTA",miningActive:"MINAGE ACTIF",
  noMachine:"AUCUNE MACHINE",claim:"RÉCLAMER",totalBal:"Solde Total",
  shopTitle:"⛏️ Boutique",machines:"Machines",batteries:"Batteries",buy:"ACHETER",
  myAssets:"⚙️ Wallet & Actifs",walletBal:"💰 Soldes",
  plugMachine:"🔌 Brancher une machine",plugDesc:"Entrez l'ID de votre machine.",machineId:"ID Machine (0, 1...)",plug:"BRANCHER ⚡",
  activeMachines:"⛏️ Machines Actives",myMachines:"⛏️ Mes Machines",myBatteries:"🔋 Mes Batteries",
  active:"Actif",expired:"Expiré",inactive:"Inactif",available:"Disponible",
  plugged:"Branché",notPlugged:"Non branché",timeRemaining:"Restant",
  noMachines:"Aucune machine",noBatteries:"Aucune batterie",batteryLabel:"Batterie",
  noActiveMachines:"Aucune machine active",
  swapTitle:"💱 Échange",youPay:"Vous payez",balance:"Solde:",youReceive:"Vous recevez",swap:"ÉCHANGER",
  currentRate:"1 FTA = ",usdtPerFta:" USDT",
  exchangeRate:"Taux de change",priceImpact:"Impact prix",swapFee:"Frais swap (4%)",
  minimumReceived:"Minimum reçu",slippageTolerance:"Tolérance slippage",networkFee:"Frais réseau",
  liquidityReserve:"Liquidité du Protocole (FTA)",liquidityHint:"Garanti par les réserves du smart contract sur Polygon",
  send:"Envoyer",receive:"Recevoir",recipientAddr:"Adresse destinataire (0x...)",amount:"Montant",
  confirmSend:"CONFIRMER ENVOI",receiveHint:"Envoyez uniquement POL, USDT ou FTA à cette adresse sur Polygon.",
  tapToCopy:"Appuyez pour copier",
  loading:"Chargement...",connWallet:"Connexion...",linking:"Liaison...",
  buyingMachine:"Achat Machine",approveUsdt:"Approbation USDT...",approveFta:"Approbation FTA...",
  confirming:"Confirmation...",calcFta:"Calcul prix...",
  buyingBattery:"Achat Batterie",pluggingIn:"Branchement...",swapping:"Swap...",
  claiming:"Claim...",sending:"Envoi...",
  machineBought:"Machine achetée!",batteryBought:"Batterie achetée!",
  pluggedIn:"Machine branchée! ⚡",swapSuccess:"Échange réussi!",
  claimed:"Gains réclamés!",sentSuccess:"Envoi réussi!",
  addrCopied:"Adresse copiée!",refLinked:"Parrain lié!",
  error:"Erreur",connFirst:"Connectez-vous d'abord",invalidId:"ID Machine invalide",
  invalidAmount:"Montant invalide",invalidAddr:"Adresse invalide",
  wcIdMissing:"ID WalletConnect manquant!",days:"Jours",rig:"RIG",
  errRejected:"Transaction annulée",errInsufficientFunds:"Solde insuffisant",
  errNetwork:"Erreur réseau. Réessayez.",errTimeout:"Délai expiré.",
  errContract:"Transaction échouée. Réessayez.",errGeneric:"Une erreur est survenue.",
  errAlreadyPending:"Transaction en cours. Patientez.",errNonce:"Erreur de nonce. Redémarrez l'app.",
  errLowLiquidity:"Liquidité trop faible. Échangez USDT→FTA d'abord, puis réessayez.",
  errNoFtaLiquidity:"Pas de liquidité FTA. Quelqu'un doit échanger USDT→FTA d'abord. Essayez d'acheter avec USDT.",
  errMaxFtaSell:"Vous ne pouvez pas vendre plus de {max} FTA. Échangez USDT→FTA d'abord.",
  errSwapRejected:"Échange rejeté. Vérifiez la liquidité du pool.",
  errApprovalFailed:"Approbation échouée. Vérifiez votre solde.",
  useUsdtInstead:"Essayez de payer en USDT — les achats USDT fonctionnent toujours.",
},

de: {
  connect:"Verbinden",home:"Home",shop:"Shop",assets:"Wallet",swapNav:"Swap",
  refTitle:"👥 Empfehlung",refDesc:"Empfehler-Adresse eingeben.",bindRef:"BINDEN",
  power:"LEISTUNG",ftaSec:"Hashrate",pending:"AUSSTEHEND",fta:"FTA",miningActive:"MINING AKTIV",
  noMachine:"KEINE MASCHINE",claim:"EINFORDERN",totalBal:"Gesamtguthaben",
  shopTitle:"⛏️ Shop",machines:"Maschinen",batteries:"Batterien",buy:"KAUFEN",
  myAssets:"⚙️ Wallet & Assets",walletBal:"💰 Guthaben",
  plugMachine:"🔌 Maschine anschließen",plugDesc:"Offline-Maschine ID eingeben.",machineId:"Maschinen-ID (0, 1...)",plug:"ANSCHLIESSEN ⚡",
  activeMachines:"⛏️ Aktive Maschinen",myMachines:"⛏️ Meine Maschinen",myBatteries:"🔋 Meine Batterien",
  active:"Aktiv",expired:"Abgelaufen",inactive:"Inaktiv",available:"Verfügbar",
  plugged:"Angeschlossen",notPlugged:"Nicht angeschlossen",timeRemaining:"Verbleibend",
  noMachines:"Keine Maschinen",noBatteries:"Keine Batterien",batteryLabel:"Batterie",
  noActiveMachines:"Keine aktive Maschinen",
  swapTitle:"💱 Tausch",youPay:"Sie zahlen",balance:"Guthaben:",youReceive:"Sie erhalten",swap:"TAUSCHEN",
  currentRate:"1 FTA = ",usdtPerFta:" USDT",
  exchangeRate:"Wechselkurs",priceImpact:"Preisauswirkung",swapFee:"Swapgebühr (4%)",
  minimumReceived:"Mindestbetrag",slippageTolerance:"Slippage-Toleranz",networkFee:"Netzwerkgebühr",
  liquidityReserve:"Protokoll-Liquidität (FTA)",liquidityHint:"Durch Smart-Contract-Reserven auf Polygon abgesichert",
  send:"Senden",receive:"Empfangen",recipientAddr:"Empfängeradresse (0x...)",amount:"Betrag",
  confirmSend:"SENDUNG BESTÄTIGEN",receiveHint:"Nur POL, USDT oder FTA an diese Adresse auf Polygon senden.",
  tapToCopy:"Zum Kopieren tippen",
  loading:"Laden...",connWallet:"Verbindung...",linking:"Verknüpfung...",
  buyingMachine:"Kaufe Maschine",approveUsdt:"USDT genehmigen...",approveFta:"FTA genehmigen...",
  confirming:"Bestätigung...",calcFta:"Preis berechnen...",
  buyingBattery:"Kaufe Batterie",pluggingIn:"Anschließen...",swapping:"Tauschen...",
  claiming:"Einforderung...",sending:"Senden...",
  machineBought:"Maschine gekauft!",batteryBought:"Batterie gekauft!",
  pluggedIn:"Maschine angeschlossen! ⚡",swapSuccess:"Tausch erfolgreich!",
  claimed:"Eingefordert!",sentSuccess:"Gesendet!",
  addrCopied:"Kopiert!",refLinked:"Empfehler verknüpft!",
  error:"Fehler",connFirst:"Zuerst verbinden",invalidId:"Ungültige ID",
  invalidAmount:"Ungültiger Betrag",invalidAddr:"Ungültige Adresse",
  wcIdMissing:"WalletConnect-ID fehlt!",days:"Tage",rig:"RIG",
  errRejected:"Transaktion abgebrochen",errInsufficientFunds:"Unzureichendes Guthaben",
  errNetwork:"Netzwerkfehler.",errTimeout:"Zeitüberschreitung.",
  errContract:"Transaktion fehlgeschlagen.",errGeneric:"Ein Fehler ist aufgetreten.",
  errAlreadyPending:"Transaktion ausstehend.",errNonce:"Nonce-Fehler.",
  errLowLiquidity:"Liquidität zu niedrig. USDT→FTA tauschen, dann erneut versuchen.",
  errNoFtaLiquidity:"Keine FTA-Liquidität. USDT→FTA zuerst tauschen. Mit USDT kaufen.",
  errMaxFtaSell:"Maximal {max} FTA verkaufbar. USDT→FTA zuerst tauschen.",
  errSwapRejected:"Tausch abgelehnt. Pool-Liquidität prüfen.",
  errApprovalFailed:"Genehmigung fehlgeschlagen. Guthaben prüfen.",
  useUsdtInstead:"Mit USDT bezahlen — USDT-Käufe funktionieren immer.",
},

zh: {
  connect:"连接",home:"首页",shop:"商店",assets:"钱包",swapNav:"兑换",
  refTitle:"👥 推荐系统",refDesc:"输入推荐人地址进行绑定。",bindRef:"绑定",
  power:"算力",ftaSec:"Hashrate",pending:"待领取",fta:"FTA",miningActive:"挖矿中",
  noMachine:"无机器",claim:"领取",totalBal:"总余额",
  shopTitle:"⛏️ 商店",machines:"矿机",batteries:"电池",buy:"购买",
  myAssets:"⚙️ 钱包与资产",walletBal:"💰 余额",
  plugMachine:"🔌 插入机器",plugDesc:"输入离线机器ID并选择电池。",machineId:"机器ID (0, 1...)",plug:"插入 ⚡",
  activeMachines:"⛏️ 运行中矿机",myMachines:"⛏️ 我的矿机",myBatteries:"🔋 我的电池",
  active:"运行中",expired:"已过期",inactive:"未激活",available:"可用",
  plugged:"已插入",notPlugged:"未插入",timeRemaining:"剩余",
  noMachines:"暂无矿机",noBatteries:"暂无电池",batteryLabel:"电池",
  noActiveMachines:"无运行中矿机",
  swapTitle:"💱 兑换",youPay:"您支付",balance:"余额:",youReceive:"您收到",swap:"兑换",
  currentRate:"1 FTA = ",usdtPerFta:" USDT",
  exchangeRate:"汇率",priceImpact:"价格影响",swapFee:"手续费 (4%)",
  minimumReceived:"最低收到",slippageTolerance:"滑点容忍度",networkFee:"网络费",
  liquidityReserve:"协议流动性 (FTA)",liquidityHint:"由Polygon上的智能合约储备保障",
  send:"发送",receive:"接收",recipientAddr:"接收方地址 (0x...)",amount:"金额",
  confirmSend:"确认发送",receiveHint:"仅发送POL、USDT或FTA到此Polygon地址。",
  tapToCopy:"点击复制",
  loading:"加载中...",connWallet:"连接中...",linking:"绑定中...",
  buyingMachine:"购买机器",approveUsdt:"授权 USDT...",approveFta:"授权 FTA...",
  confirming:"确认中...",calcFta:"计算价格...",
  buyingBattery:"购买电池",pluggingIn:"插入中...",swapping:"兑换中...",
  claiming:"领取中...",sending:"发送中...",
  machineBought:"机器购买成功！",batteryBought:"电池购买成功！",
  pluggedIn:"机器插入成功！ ⚡",swapSuccess:"兑换成功！",
  claimed:"奖励已领取！",sentSuccess:"发送成功！",
  addrCopied:"地址已复制！",refLinked:"推荐人绑定成功！",
  error:"错误",connFirst:"请先连接",invalidId:"无效ID",
  invalidAmount:"无效金额",invalidAddr:"无效地址",
  wcIdMissing:"缺少 WalletConnect ID！",days:"天",rig:"矿机",
  errRejected:"交易已取消",errInsufficientFunds:"余额不足",
  errNetwork:"网络错误，请重试。",errTimeout:"交易超时，请重试。",
  errContract:"交易失败，请重试。",errGeneric:"发生错误，请重试。",
  errAlreadyPending:"已有交易待处理，请稍候。",errNonce:"Nonce错误，请重启应用。",
  errLowLiquidity:"流动性不足。请先兑换USDT→FTA建立资金池，然后重试。",
  errNoFtaLiquidity:"FTA资金池为空。需要有人先兑换USDT→FTA。请尝试用USDT购买。",
  errMaxFtaSell:"最多可卖出 {max} FTA（受netFtaSold限制）。请先兑换USDT→FTA。",
  errSwapRejected:"兑换被拒绝。请检查资金池流动性。",
  errApprovalFailed:"授权失败。请检查钱包余额。",
  useUsdtInstead:"请尝试用USDT支付 — USDT购买始终可用。",
},

sg: {
  connect:"Connect",home:"Home",shop:"Shop",assets:"Wallet",swapNav:"Swap",
  refTitle:"👥 Referral System",refDesc:"Enter your referrer's address to link.",bindRef:"BIND",
  power:"POWER",ftaSec:"Hashrate",pending:"PENDING",fta:"FTA",miningActive:"MINING ACTIVE",
  noMachine:"NO MACHINE",claim:"CLAIM",totalBal:"Total Balance",
  shopTitle:"⛏️ Shop",machines:"Machines",batteries:"Batteries",buy:"BUY",
  myAssets:"⚙️ Wallet & Assets",walletBal:"💰 Balances",
  plugMachine:"🔌 Plug in a machine",plugDesc:"Enter your offline machine ID and choose a battery.",machineId:"Machine ID (0, 1...)",plug:"PLUG IN ⚡",
  activeMachines:"⛏️ Active Machines",myMachines:"⛏️ My Machines",myBatteries:"🔋 My Batteries",
  active:"Active",expired:"Expired",inactive:"Inactive",available:"Available",
  plugged:"Plugged",notPlugged:"Not Plugged",timeRemaining:"Remaining",
  noMachines:"No machines yet",noBatteries:"No batteries yet",batteryLabel:"Battery",
  noActiveMachines:"No active machines",
  swapTitle:"💱 Swap",youPay:"You pay",balance:"Balance:",youReceive:"You receive",swap:"SWAP",
  currentRate:"1 FTA = ",usdtPerFta:" USDT",
  exchangeRate:"Exchange Rate",priceImpact:"Price Impact",swapFee:"Swap Fee (4%)",
  minimumReceived:"Minimum Received",slippageTolerance:"Slippage Tolerance",networkFee:"Network Fee",
  liquidityReserve:"Protocol Liquidity (FTA)",liquidityHint:"Backed by smart contract reserves on Polygon",
  send:"Send",receive:"Receive",recipientAddr:"Recipient address (0x...)",amount:"Amount",
  confirmSend:"CONFIRM SEND",receiveHint:"Send only POL, USDT or FTA to this address on Polygon.",
  tapToCopy:"Tap to copy",
  loading:"Loading...",connWallet:"Connecting...",linking:"Linking...",
  buyingMachine:"Buying Machine",approveUsdt:"Approving USDT...",approveFta:"Approving FTA...",
  confirming:"Confirming...",calcFta:"Calculating price...",
  buyingBattery:"Buying Battery",pluggingIn:"Plugging in...",swapping:"Swapping...",
  claiming:"Claiming...",sending:"Sending...",
  machineBought:"Machine purchased!",batteryBought:"Battery purchased!",
  pluggedIn:"Machine plugged in! ⚡",swapSuccess:"Swap successful!",
  claimed:"Rewards claimed!",sentSuccess:"Sent successfully!",
  addrCopied:"Address copied!",refLinked:"Referrer linked!",
  error:"Error",connFirst:"Connect first",invalidId:"Invalid Machine ID",
  invalidAmount:"Invalid amount",invalidAddr:"Invalid address",
  wcIdMissing:"WalletConnect ID missing!",days:"Days",rig:"RIG",
  errRejected:"Transaction cancelled",errInsufficientFunds:"Insufficient balance",
  errNetwork:"Network error.",errTimeout:"Transaction timed out.",
  errContract:"Transaction failed.",errGeneric:"An error occurred.",
  errAlreadyPending:"A transaction is already pending.",errNonce:"Nonce error.",
  errLowLiquidity:"Liquidity too low. Swap USDT→FTA first, then retry.",
  errNoFtaLiquidity:"No FTA liquidity yet. Swap USDT→FTA first. Or buy with USDT.",
  errMaxFtaSell:"Max sellable: {max} FTA. Swap USDT→FTA to increase.",
  errSwapRejected:"Swap rejected. Check pool liquidity.",
  errApprovalFailed:"Approval failed. Check wallet balance.",
  useUsdtInstead:"Try USDT instead — always works.",
}
};

/* ═════════════════════════════════════════════════════════════
   CHAT INTENTS — comprehensive Fitia Pro knowledge base
   ═════════════════════════════════════════════════════════════ */
const CHAT_INTENTS = {
  // ── Core Fitia Pro / Project Overview ──
  what_is_fitia: { weight:5, keywords:{
    all:['what is fitia','c quoi fitia','fitia c quoi','about fitia','explain fitia','fitia pro','fitia project','fitia project','présente fitia','present fitia','介绍','fitia是什么'],
    en:['tell me about fitia','what is this app','what is this project','overview','what does fitia do'],
    fr:['c est quoi fitia','parle moi de fitia','présentation fitia','fitia projet','explique fitia'],
    de:['was ist fitia','erzähl mir von fitia','fitia projekt'],
    zh:['fitia是什么','fitia项目','介绍一下fitia']
  }},
  four_visions: { weight:5, keywords:{
    all:['4 vision','4 visions','four vision','four visions','fitia mining','fitia finance','fitia shop','fitia store','quatre vision','4 piliers','4 pillars','quatre piliers','四大愿景','四大支柱'],
    en:['four pillars','ecosystem','fitia ecosystem','project pillars'],
    fr:['écosystème fitia','piliers du projet','quatre piliers','les 4 visions'],
    de:['vier säulen','fitia ökosystem'],
    zh:['四大板块','fitia生态']
  }},

  // ── Mining ──
  how_mining_works: { weight:4, keywords:{
    all:['how mining works','how does mining work','explain mining','mine','mining','minage','挖矿','miner','how to mine','how to start mining','comment miner','wie mining funktioniert','comment ça marche le minage'],
    en:['mining explained','start mining','begin mining'],
    fr:['comment miner','explique le minage','fonctionnement minage'],
    de:['mining erklärt'],
    zh:['挖矿怎么','如何挖矿']
  }},
  machine_info: { weight:3, keywords:{
    all:['machine','rig','machine type','which machine','which rig','best machine','machine tier','quelle machine','quelle rig','哪个矿机','机器','矿机类型','compare machine','compare rig'],
    en:['machine comparison','machine specs','what machine should i buy'],
    fr:['quelle machine acheter','comparer machines'],
    de:['welche maschine','maschinen vergleich'],
    zh:['哪种矿机好','机器对比']
  }},
  battery_info: { weight:3, keywords:{
    all:['battery','batterie','电池','battery duration','how long battery','quel batterie','which battery'],
    en:['battery life','battery info','what battery','best battery'],
    fr:['durée batterie','quelle batterie','meilleure batterie'],
    de:['batterie dauer','welche batterie'],
    zh:['电池多久','电池选择']
  }},
  plug_and_activate: { weight:3, keywords:{
    all:['plug in','plug','activate','activer','插入','激活','how to plug','how to activate','brancher'],
    en:['activate machine','start machine','plug machine','turn on machine'],
    fr:['brancher machine','activer machine','démarrer machine'],
    de:['maschine aktivieren','anschließen'],
    zh:['怎么启动机器','插入机器']
  }},
  claim_rewards: { weight:3, keywords:{
    all:['claim','reward','réclamer','领取','harvest','collect','claim rewards','how to claim'],
    en:['get rewards','collect fta'],
    fr:['récupérer gains','réclamer fta'],
    de:['belohnungen','einfodern'],
    zh:['领取奖励','提现']
  }},

  // ── Finance / Swap / Token ──
  how_swap_works: { weight:4, keywords:{
    all:['swap','exchange','échanger','tausch','兑换','how to swap','swap fta','swap usdt','échange','trade'],
    en:['swap tokens','token swap','convert','how to trade'],
    fr:['échanger tokens','convertir','comment échanger'],
    de:['tauschen','token tausch','umtauschen'],
    zh:['怎么兑换','兑换教程']
  }},
  tokenomics: { weight:4, keywords:{
    all:['tokenomics','fta token','fta是什么','token fta','what is fta','what is fta token','écu fta','fta prix','fta price','fta value','valeur fta','token supply','supply','max supply','total supply'],
    en:['fta economics','fta tokenomics','fta explained','what is fta token'],
    fr:['token fta c est quoi','économie fta','valeur du fta'],
    de:['fta token erklärt','fta wert'],
    zh:['fta代币','fta价值','fta经济']
  }},
  liquidity_explanation: { weight:4, keywords:{
    all:['liquidity','liquidité','liquidity pool','netftasold','netFtaSold','protocol liquidity','pool','why fta rejected','why swap rejected','pourquoi refusé','为什么被拒绝'],
    en:['why cannot swap','fta not working','liquidity issue','why blocked'],
    fr:['pourquoi bloqué','problème liquidité','pourquoi fta marche pas'],
    de:['warum abgelehnt','liquidity problem'],
    zh:['为什么兑换不了','流动性问题']
  }},

  // ── Shop & Store ──
  fitia_shop: { weight:3, keywords:{
    all:['fitia shop','boutique fitia','商店','marketplace','buy machine','acheter machine','acheter batterie','buy battery','achat','purchase'],
    en:['how to buy machine','how to buy battery','purchase machine','fitia marketplace'],
    fr:['comment acheter','achat machine','achat batterie'],
    de:['maschine kaufen','batterie kaufen'],
    zh:['购买矿机','购买电池']
  }},
  fitia_store: { weight:3, keywords:{
    all:['fitia store','magasin fitia','电商','ecommerce','merchandise','products','produits','goods'],
    en:['online store','fitia products','merch'],fr:['magasin en ligne','produits fitia'],
    de:['online shop','fitia produkte'],zh:['网上商城','fitia产品']
  }},

  // ── Beginner / How to start ──
  beginner_guide: { weight:4, keywords:{
    all:['beginner','débutant','新手','how to start','getting started','commencer','开始','first time','new user','nouveau','i dont know','je sais pas','我不知道','je comprends rien','first step','premier pas','première fois'],
    en:['new to crypto','never used crypto','how do i start','step by step','guide for beginners'],
    fr:['débuter','première fois','comment commencer','guide débutant','je débute'],
    de:['anfänger','erste schritte','wie anfangen'],
    zh:['新手入门','第一次','怎么开始']
  }},
  what_is_crypto: { weight:4, keywords:{
    all:['what is crypto','crypto','blockchain','什么是加密','什么是区块链','qu est ce que la crypto','c est quoi la crypto','was ist crypto'],
    en:['cryptocurrency explained','what is blockchain','explain blockchain','crypto basics'],
    fr:['crypto c est quoi','blockchain explication','base crypto'],
    de:['was ist blockchain','krypto erklärt'],
    zh:['加密货币是什么','区块链是什么']
  }},
  wallet_setup: { weight:4, keywords:{
    all:['wallet','metamask','trust wallet','钱包','portefeuille','how to connect','connecter','连接','create wallet','install wallet','setup wallet'],
    en:['how to use metamask','set up wallet','get a wallet','wallet guide'],
    fr:['comment installer metamask','créer un wallet','configurer wallet'],
    de:['metamask einrichten','wallet erstellen'],
    zh:['metamask教程','如何创建钱包']
  }},

  // ── Investment / Strategy ──
  investment_advice: { weight:3, keywords:{
    all:['invest','investment','investir','投资','roi','profit','gain','earn','earning','strategy','stratégie','收益','回报','return','best strategy','how to earn more','gagner plus'],
    en:['maximize profit','earning potential','investment strategy'],
    fr:['stratégie investissement','maximiser gains','comment gagner plus'],
    de:['investition','gewinn maximieren'],
    zh:['投资策略','收益最大化']
  }},

  // ── Security ──
  security: { weight:4, keywords:{
    all:['security','safe','sécurité','安全','scam','arnaque','escroquerie','is it safe','est ce que c est sur','hack','protect','seed phrase','private key'],
    en:['is fitia safe','is it legit','trust','safe?','legit?'],
    fr:['c est sûr','sécurisé','est ce fiable','arnaque?'],
    de:['ist es sicher','betrug','sicherheit'],
    zh:['安全吗','可靠吗','是不是骗局']
  }},

  // ── Vision / Revolution ──
  fitia_revolution: { weight:4, keywords:{
    all:['revolution','révolution','革命','vision','mission','why fitia','pourquoi fitia','objective','objectif','goal','but','fitia goal','fitia mission'],
    en:['what makes fitia special','fitia vision','project vision','fitia revolution'],
    fr:['révolution fitia','pourquoi fitia est special','objectif fitia'],
    de:['fitia revolution','fitia vision','warum fitia'],
    zh:['fitia愿景','fitia目标','为什么选择fitia']
  }},

  // ── Practical Help ──
  deposit_funds: { weight:3, keywords:{
    all:['deposit','add funds','fund','充值','入金','how to deposit','send funds','transfer','envoyer','send money'],
    en:['how to add money','fund wallet','top up','add usdt'],
    fr:['déposer','ajouter fonds','recharger'],
    de:['einzahlen','guthaben aufladen'],
    zh:['充值','入金','怎么充值']
  }},
  withdraw_earnings: { weight:3, keywords:{
    all:['withdraw','cash out','提现','retirer','retrait','take profit','how to withdraw','withdraw fta','withdraw usdt','convert to cash'],
    en:['how to cash out','take out money','withdraw funds','how to get money out'],
    fr:['retirer argent','convertir en cash','retrait gains'],
    de:['auszahlen','geld abheben'],
    zh:['提现','怎么提现','取出收益']
  }},
  network_polygon: { weight:3, keywords:{
    all:['polygon','matic','pol','network','chain','网络','réseau','why polygon','gas fee','frais','gas'],
    en:['which network','polygon network','chain info','what chain','gas fees'],
    fr:['quel réseau','frais de gas','pourquoi polygon'],
    de:['welches netzwerk','gas gebühren'],
    zh:['什么网络','gas费']
  }},

  // ── Generic ──
  greeting: { weight:1, keywords:{all:['hello','hi','hey','hola','bonjour','salut','coucou','hallo','guten tag','你好']} },
  goodbye: { weight:1, keywords:{all:['bye','goodbye','see you','au revoir','tschüss','再见','adieu']} },
  thanks: { weight:1, keywords:{all:['thanks','thank you','thx','ty','merci','danke','谢谢']} },
  help: { weight:2, keywords:{all:['help','aide','hilfe','帮助','guide','assist','confused','commands']} },
  referral: { weight:2, keywords:{all:['referral','parrain','推荐','invite','referrer','parrainage']} },
  whatsapp: { weight:2, keywords:{all:['whatsapp','community','group','社群','群','contact','support']} },
  roadmap: { weight:2, keywords:{all:['roadmap','future','upcoming','next','plan','路线图','futur','avenir','when','quand']} },
  price: { weight:2, keywords:{all:['price','prix','preis','价格','rate','cost','combien','valeur']} },
  contact_dev: { weight:2, keywords:{all:['contact','support team','admin','developer','dev','équipe','团队','founder','owner']} },
  fta_problems: { weight:4, keywords:{all:['fta not working','fta rejected','fta failed','cannot buy','cannot swap','refuse','rejected','doesnt work','error','problem','bug','broken','marche pas','不工作','失败','报错']} }
};

/* ═════════════════════════════════════════════════════════════
   CHAT RESPONSES — comprehensive, multi-language
   ═════════════════════════════════════════════════════════════ */
const CHAT_RESPONSES = {
  what_is_fitia: {
    en:`🪙 *Fitia Pro* is a revolutionary Web3 ecosystem built on Polygon — combining crypto mining, decentralized finance (DeFi), and e-commerce into one unified platform.

✨ *4 Core Visions:*
① *Fitia Mining* — Purchase NFT mining machines, earn FTA tokens passively
② *Fitia Finance* — Swap, trade & earn through our DeFi protocol on Polygon
③ *Fitia Shop* — Marketplace for digital goods & mining gear
④ *Fitia Store* — E-commerce store accepting FTA & crypto payments

🔒 Built on Polygon Mainnet for low fees, high speed & full transparency.

❓ Ask me about any vision or how to get started!`,
    fr:`🪙 *Fitia Pro* est un écosystème Web3 révolutionnaire construit sur Polygon — combinant mining crypto, finance décentralisée (DeFi) et e-commerce dans une plateforme unifiée.

✨ *4 Visions Fondamentales :*
① *Fitia Mining* — Achetez des machines de mining NFT, gagnez des tokens FTA passivement
② *Fitia Finance* — Échangez, tradez et gagnez via notre protocole DeFi sur Polygon
③ *Fitia Shop* — Marketplace de biens numériques et équipement de mining
④ *Fitia Store* — Boutique e-commerce acceptant les paiements FTA & crypto

🔒 Construit sur Polygon Mainnet : frais bas, rapidité, transparence totale.

❓ Demandez-moi sur n'importe quelle vision ou comment commencer !`,
    de:`🪙 *Fitia Pro* ist ein revolutionäres Web3-Ökosystem auf Polygon — Mining, DeFi & E-Commerce in einer Plattform.

✨ *4 Kernvisionen:*
① Fitia Mining — NFT-Mining-Maschinen kaufen, passiv FTA verdienen
② Fitia Finance — Swaps & Trading via DeFi-Protokoll auf Polygon
③ Fitia Shop — Marktplatz für digitale Güter & Mining-Ausrüstung
④ Fitia Store — E-Commerce-Shop mit FTA & Krypto-Zahlungen

🔒 Auf Polygon Mainnet — niedrige Gebühren, hohe Geschwindigkeit, volle Transparenz.`,
    zh:`🪙 *Fitia Pro* 是构建在Polygon上的革命性Web3生态系统——将加密货币挖矿、去中心化金融（DeFi）和电子商务整合到一个统一平台中。

✨ *4大核心愿景：*
① *Fitia Mining（挖矿）* — 购买NFT矿机，被动赚取FTA代币
② *Fitia Finance（金融）* — 通过Polygon上的DeFi协议进行兑换、交易和收益
③ *Fitia Shop（商城）* — 数字商品和挖矿设备市场
④ *Fitia Store（商店）* — 接受FTA和加密货币支付的电商平台

🔒 构建在Polygon主网上：低费用、高速度、完全透明。

❓ 问我任何关于愿景或如何开始的问题！`,
    sg:`🪙 *Fitia Pro* is a revolutionary Web3 ecosystem on Polygon — combining mining, DeFi, and e-commerce.

✨ *4 Core Visions:*
① Fitia Mining — Buy NFT mining machines, earn FTA passively
② Fitia Finance — Swap, trade & earn through our DeFi protocol
③ Fitia Shop — Marketplace for digital goods & mining gear
④ Fitia Store — E-commerce accepting FTA & crypto payments

🔒 Built on Polygon Mainnet — low fees, transparency, speed.`
  },

  four_visions: {
    en:`🏗️ *Fitia Pro's 4 Pillars:*

⛏️ *① Fitia Mining*
The core engine. Purchase NFT mining machines (MK-I to MK-VIII), power them with batteries (3 to 365 days), and earn FTA tokens every second. Powered by smart contracts on Polygon — fully automated, transparent, and unstoppable.

💱 *② Fitia Finance*
Our DeFi protocol. Swap USDT ↔ FTA through a bonding curve mechanism. Protocol liquidity grows organically with every swap. Staking and yield features coming in future updates.

🛒 *③ Fitia Shop*
Digital marketplace for mining equipment, NFT upgrades, and power-ups. Trade your mining rigs, batteries, and exclusive items within the Fitia ecosystem.

🏪 *④ Fitia Store*
Real-world e-commerce integration. Pay with FTA tokens for physical products, merchandise, and services. Bridging crypto utility with everyday shopping.

🌐 Together, these 4 pillars create a self-sustaining circular economy where every activity feeds into the others.`,
    fr:`🏗️ *Les 4 Piliers de Fitia Pro :*

⛏️ *① Fitia Mining*
Le moteur principal. Achetez des machines de mining NFT (MK-I à MK-VIII), alimentez-les avec des batteries (3 à 365 jours), et gagnez des tokens FTA chaque seconde. Alimenté par des smart contracts sur Polygon — entièrement automatisé, transparent et inarrêtable.

💱 *② Fitia Finance*
Notre protocole DeFi. Échangez USDT ↔ FTA via un mécanisme de bonding curve. La liquidité du protocole croît avec chaque swap. Staking et yield à venir.

🛒 *③ Fitia Shop*
Marketplace numérique pour équipement de mining, upgrades NFT et power-ups. Échangez vos rigs, batteries et objets exclusifs dans l'écosystème Fitia.

🏪 *④ Fitia Store*
Intégration e-commerce réelle. Payez en FTA pour des produits physiques, du merchandising et des services. Pont entre l'utilité crypto et le shopping quotidien.

🌐 Ces 4 piliers créent une économie circulaire auto-entretenue.`,
    zh:`🏗️ *Fitia Pro 四大支柱：*

⛏️ *① Fitia Mining（挖矿）*
核心引擎。购买NFT矿机（MK-I到MK-VIII），用电池供电（3到365天），每秒赚取FTA代币。由Polygon上的智能合约驱动——全自动、透明、不可停止。

💱 *② Fitia Finance（金融）*
我们的DeFi协议。通过bonding curve机制兑换USDT↔FTA。协议流动性随着每次兑换而增长。质押和收益功能即将推出。

🛒 *③ Fitia Shop（商城）*
数字市场，用于挖矿设备、NFT升级和强化道具。在Fitia生态系统内交易矿机、电池和独家物品。

🏪 *④ Fitia Store（商店）*
真实世界的电商集成。用FTA代币支付实体产品、周边商品和服务。连接加密实用性与日常购物。

🌐 这四大支柱共同创建一个自我维持的循环经济。`
  },

  how_mining_works: {
    en:`⛏️ *How Fitia Mining Works (simple):*

1️⃣ *Buy a Mining Rig* — Go to the Shop tab, choose a machine (MK-I to MK-VIII), pay with USDT (recommended) or FTA
2️⃣ *Buy a Battery* — Machines need batteries to run. Choose 3 to 365 days
3️⃣ *Plug it In* — Go to Wallet tab → "Plug in a machine" section → enter your machine ID + battery type → Confirm
4️⃣ *Mine* — Your machine starts generating FTA tokens every second! Watch your hashrate on the Home tab
5️⃣ *Claim* — Click the gold CLAIM button on Home to collect your earned FTA to your wallet

⚡ Higher tier machines = more Hashrate = more FTA/second
🔋 Longer batteries = better value per day

💡 *Tip:* Pay with USDT for purchases — it always works instantly. FTA payments need the protocol to have some liquidity first.`,
    fr:`⛏️ *Comment fonctionne le Minage Fitia :*

1️⃣ *Achetez une machine* — Allez dans la Boutique, choisissez une machine (MK-I à MK-VIII), payez en USDT (recommandé) ou FTA
2️⃣ *Achetez une batterie* — Les machines ont besoin de batteries. Choisissez 3 à 365 jours
3️⃣ *Branchez-la* — Allez dans Wallet → "Brancher une machine" → entrez l'ID + type de batterie → Confirmez
4️⃣ *Minage* — Votre machine génère des FTA chaque seconde ! Surveillez votre hashrate sur l'onglet Accueil
5️⃣ *Réclamez* — Cliquez sur le bouton doré RÉCLAMER pour collecter vos FTA dans votre wallet

⚡ Machines de niveau supérieur = plus de Hashrate = plus de FTA/seconde
🔋 Batteries plus longues = meilleur rapport qualité/prix

💡 *Astuce:* Payez en USDT — ça marche toujours instantanément.`,
    zh:`⛏️ *Fitia挖矿如何运作：*

1️⃣ *购买矿机* — 进入商店，选择矿机（MK-I到MK-VIII），用USDT（推荐）或FTA支付
2️⃣ *购买电池* — 矿机需要电池运行。选择3到365天
3️⃣ *插入矿机* — 进入钱包→"插入机器"→输入机器ID+电池类型→确认
4️⃣ *挖矿* — 您的机器每秒产生FTA代币！在首页监控您的算力
5️⃣ *领取* — 点击金色领取按钮将赚取的FTA收入钱包

⚡ 更高等级的机器 = 更多算力 = 更多FTA/秒
🔋 更长的电池 = 更好的性价比`
  },

  how_swap_works: {
    en:`💱 *Swap: Convert USDT ↔ FTA*

🔹 *USDT → FTA:* Pay USDT, receive FTA. This adds FTA to the protocol liquidity pool — great for the ecosystem!

🔹 *FTA → USDT:* Sell FTA, receive USDT. Requires protocol liquidity to be available (someone must have swapped USDT→FTA first).

📊 *What is "Protocol Liquidity"?*
The swap uses a bonding curve — the price adjusts based on supply & demand. The more FTA in the protocol reserves, the more stable the price.

⚠️ *Important:* If the liquidity display shows "—" or 0, you cannot yet swap FTA→USDT or buy with FTA. Do a USDT→FTA swap first to build the pool, or simply buy machines/batteries with USDT.

🔒 All swaps execute on-chain via audited smart contracts on Polygon.`,
    fr:`💱 *Swap : Convertissez USDT ↔ FTA*

🔹 *USDT → FTA :* Payez en USDT, recevez du FTA. Cela ajoute du FTA à la réserve de liquidité du protocole — excellent pour l'écosystème !

🔹 *FTA → USDT :* Vendez du FTA, recevez de l'USDT. Nécessite que la liquidité du protocole soit disponible.

📊 *Qu'est-ce que la "Liquidité du Protocole" ?*
Le swap utilise une bonding curve — le prix s'ajuste selon l'offre et la demande. Plus il y a de FTA dans les réserves, plus le prix est stable.

⚠️ *Important:* Si l'affichage de liquidité montre "—" ou 0, vous ne pouvez pas encore échanger FTA→USDT ni acheter avec FTA. Faites d'abord un swap USDT→FTA, ou achetez simplement en USDT.`,
    zh:`💱 *兑换：转换USDT↔FTA*

🔹 *USDT→FTA：* 支付USDT，获得FTA。这将FTA添加到协议流动性池中——对生态系统有益！

🔹 *FTA→USDT：* 卖出FTA，获得USDT。需要协议流动性可用。

📊 *什么是"协议流动性"？*
兑换使用bonding curve——价格根据供需调整。协议储备中的FTA越多，价格越稳定。

⚠️ *重要：* 如果流动性显示为"—"或0，还不能兑换FTA→USDT或用FTA购买。请先做USDT→FTA兑换，或直接用USDT购买。`
  },

  beginner_guide: {
    en:`🚀 *Getting Started with Fitia Pro (0 to Mining in 5 min)*

Even if you've never used crypto before, here's exactly what to do:

📱 *Step 1: Get a Wallet*
Install MetaMask on your phone or computer. Write down your secret recovery phrase on paper — NEVER share it with anyone.

💰 *Step 2: Add Funds*
Buy POL (MATIC) and USDT from an exchange (Binance, Coinbase, etc.), then send them to your MetaMask wallet address on the *Polygon network*.

🔗 *Step 3: Connect*
Open the Fitia app, tap "Connect" and approve the MetaMask connection. Make sure you're on Polygon network (chain 137).

⛏️ *Step 4: Buy a Machine*
Go to Shop → choose a Starter machine (MK-I) → pay with USDT → Confirm.

🔋 *Step 5: Buy a Battery & Plug In*
Buy a 30-day battery → Go to Wallet → Plug in your machine.

🎉 *That's it!* Your machine is now mining FTA every second. Tap CLAIM to collect your earnings.

💡 *Need help at any step?* I'm here! Just ask.`,
    fr:`🚀 *Débuter avec Fitia Pro (0 au Minage en 5 min)*

Même si vous n'avez jamais utilisé la crypto, voici exactement quoi faire :

📱 *Étape 1 : Obtenez un Wallet*
Installez MetaMask sur votre téléphone ou PC. Notez votre phrase de récupération sur papier — ne la partagez JAMAIS.

💰 *Étape 2 : Ajoutez des Fonds*
Achetez du POL (MATIC) et de l'USDT depuis un exchange (Binance, Coinbase...), puis envoyez-les à votre adresse MetaMask sur le réseau *Polygon*.

🔗 *Étape 3 : Connectez-vous*
Ouvrez l'app Fitia, appuyez sur "Connecter" et approuvez la connexion MetaMask. Vérifiez d'être sur le réseau Polygon (chain 137).

⛏️ *Étape 4 : Achetez une Machine*
Allez dans la Boutique → choisissez une machine Starter (MK-I) → payez en USDT → Confirmez.

🔋 *Étape 5 : Achetez une Batterie et Branchez*
Achetez une batterie 30 jours → Allez dans Wallet → Branchez votre machine.

🎉 *C'est tout !* Votre machine mine des FTA chaque seconde. Cliquez sur RÉCLAMER pour collecter vos gains.

💡 *Besoin d'aide ?* Je suis là ! Demandez-moi.`,
    zh:`🚀 *Fitia Pro新手入门（5分钟从零到挖矿）*

即使从未使用过加密货币，以下是确切步骤：

📱 *第1步：获取钱包*
在手机或电脑上安装MetaMask。将助记词写在纸上——绝不分享给任何人。

💰 *第2步：充值*
从交易所（币安、Coinbase等）购买POL（MATIC）和USDT，发送到您在*Polygon网络*上的MetaMask地址。

🔗 *第3步：连接*
打开Fitia应用，点击"连接"并批准MetaMask连接。确保在Polygon网络上（链ID 137）。

⛏️ *第4步：购买矿机*
进入商店→选择入门矿机（MK-I）→用USDT支付→确认。

🔋 *第5步：购买电池并插入*
购买30天电池→进入钱包→插入您的矿机。

🎉 *完成！* 您的矿机现在每秒都在挖FTA。点击领取收集您的收益。

💡 *需要帮助？* 我随时在这里！`
  },

  tokenomics: {
    en:`🪙 *FTA Token Economics*

*FTA (Fitia Token Asset)* is the native utility token of the Fitia ecosystem.

⚡ *Utility:*
• Mining reward — earned every second from active machines
• Payment currency — buy machines, batteries, shop items
• Swap asset — trade USDT ↔ FTA through the DeFi protocol
• Governance — future DAO voting rights

📊 *Supply:*
• No pre-mine — every FTA is earned through mining
• Capped by protocol parameters & bonding curve mechanics
• Circulating supply grows organically with ecosystem activity

💹 *Value Drivers:*
• Mining demand (machines need FTA for purchases)
• Protocol liquidity growth
• Ecosystem expansion (Shop & Store)
• Growing user base

🔒 *Transparency:* All token flows are on-chain on Polygon. 100% auditable.`,
    fr:`🪙 *Économie du Token FTA*

*FTA (Fitia Token Asset)* est le token utilitaire natif de l'écosystème Fitia.

⚡ *Utilité :*
• Récompense de mining — gagné chaque seconde des machines actives
• Monnaie de paiement — achetez machines, batteries, articles shop
• Actif d'échange — tradez USDT ↔ FTA via le protocole DeFi
• Gouvernance — futurs droits de vote DAO

📊 *Supply :*
• Pas de pré-mine — chaque FTA est gagné par le mining
• Plafonné par les paramètres du protocole
• L'offre en circulation croît avec l'activité de l'écosystème

🔒 *Transparence :* Tous les flux sont on-chain sur Polygon. 100% auditable.`,
    zh:`🪙 *FTA代币经济学*

*FTA（Fitia Token Asset）* 是Fitia生态系统的原生实用代币。

⚡ *用途：*
• 挖矿奖励——从活跃矿机每秒赚取
• 支付货币——购买矿机、电池、商店物品
• 兑换资产——通过DeFi协议交易USDT↔FTA
• 治理——未来DAO投票权

📊 *供应：*
• 无预挖——每个FTA都通过挖矿获得
• 由协议参数和bonding curve机制限制
• 流通供应随生态系统活动有机增长

🔒 *透明度：* 所有代币流在Polygon链上。100%可审计。`
  },

  liquidity_explanation: {
    en:`💧 *Protocol Liquidity (FTA)*

This value shows how much FTA is available in the *protocol's bonding curve reserves*. Think of it as the pool's depth.

🔹 *Why does it matter?*
• FTA purchases & FTA→USDT swaps need this reserve to be > 0
• The bonding curve adjusts the FTA price based on this reserve level
• More liquidity = more stable prices = better for everyone

🟢 *Green:* Healthy liquidity — all operations work
🟡 *Yellow:* Low liquidity — some operations may be limited
🔴 *Zero:* Pool being built — use USDT for purchases, or swap USDT→FTA first to add liquidity

💡 *Every USDT→FTA swap increases the protocol's liquidity, making the ecosystem stronger for all users.*`,
    fr:`💧 *Liquidité du Protocole (FTA)*

Cette valeur indique combien de FTA est disponible dans les réserves du protocole. Pensez-y comme la profondeur du pool.

🔹 *Pourquoi c'est important ?*
• Les achats FTA et swaps FTA→USDT nécessitent cette réserve > 0
• La bonding curve ajuste le prix du FTA selon ce niveau
• Plus de liquidité = prix plus stables = meilleur pour tous

🟢 *Vert :* Liquidité saine — toutes les opérations fonctionnent
🟡 *Jaune :* Liquidité faible — certaines opérations peuvent être limitées
🔴 *Zéro :* Pool en construction — utilisez USDT ou échangez USDT→FTA d'abord

💡 *Chaque swap USDT→FTA augmente la liquidité du protocole, renforçant l'écosystème pour tous.*`,
    zh:`💧 *协议流动性（FTA）*

该值显示协议bonding curve储备中可用的FTA数量。可将其视为池子的深度。

🔹 *为什么重要？*
• FTA购买和FTA→USDT兑换需要此储备 > 0
• Bonding curve根据此储备水平调整FTA价格
• 更多流动性 = 更稳定的价格 = 对所有人更好

💡 *每次USDT→FTA兑换都会增加协议流动性，使生态系统对所有人更强大。*`
  },

  security: {
    en:`🛡️ *Is Fitia Pro Safe?*

✅ *Yes — Here's why:*

🔒 *Smart Contract:* Deployed on Polygon Mainnet with auditable, open-source code. All logic is on-chain — no hidden tricks.

🌐 *Polygon Blockchain:* A top-tier Layer 2 network secured by Ethereum. Millions of users, billions in TVL.

📜 *Transparency:* Every transaction, swap, and mining reward is visible on-chain via Polygonscan.

💼 *Your Funds:* Always in YOUR wallet. Fitia is non-custodial — you control your keys, you control your crypto.

⚠️ *Standard Risks:*
• Crypto is volatile — never invest more than you can afford to lose
• Always double-check contract addresses
• NEVER share your seed phrase with anyone, including "support"

🤝 *Community:* Join our WhatsApp groups to verify everything with real users.`,
    fr:`🛡️ *Fitia Pro est-il Sûr?*

✅ *Oui — Voici pourquoi :*

🔒 *Smart Contract :* Déployé sur Polygon Mainnet. Code open-source et auditable. Toute la logique est on-chain — pas de piège caché.

🌐 *Blockchain Polygon :* Un réseau Layer 2 de premier plan sécurisé par Ethereum. Des millions d'utilisateurs, des milliards en TVL.

📜 *Transparence :* Chaque transaction, swap et récompense est visible on-chain via Polygonscan.

💼 *Vos Fonds :* Toujours dans VOTRE wallet. Fitia est non-custodial — vous contrôlez vos clés, vous contrôlez votre crypto.

⚠️ *Risques Standards :*
• La crypto est volatile — n'investissez que ce que vous pouvez perdre
• Vérifiez toujours les adresses des contrats
• Ne partagez JAMAIS votre phrase seed avec quiconque

🤝 *Communauté :* Rejoignez nos groupes WhatsApp pour vérifier avec de vrais utilisateurs.`
  },

  wallet_setup: {
    en:`🦊 *Setting Up Your Wallet*

1️⃣ Go to metamask.io — Install the browser extension or mobile app
2️⃣ Click "Create a new wallet" — Follow the steps
3️⃣ ✍️ *Critical:* Write down the 12-word Secret Recovery Phrase on paper. Store it safely offline. NEVER share it or take a screenshot.
4️⃣ Confirm your phrase — Done!

🔗 *Connecting to Polygon:*
• MetaMask usually auto-detects Polygon. If not:
• Tap the network dropdown → "Add network" → enter:
  - Network: Polygon Mainnet
  - RPC: https://polygon-rpc.com
  - Chain ID: 137
  - Symbol: POL

💰 *Getting Funds:*
• Buy POL (for gas) and USDT from Binance, Coinbase, or any exchange
• Withdraw to your MetaMask address — ALWAYS select Polygon network
• Wait 1-2 minutes for confirmation

✅ Then come back to Fitia, tap Connect, and start mining!`,
    fr:`🦊 *Configurer Votre Wallet*

1️⃣ Allez sur metamask.io — Installez l'extension ou l'app mobile
2️⃣ Cliquez "Créer un portefeuille" — Suivez les étapes
3️⃣ ✍️ *Critique :* Notez la phrase de récupération de 12 mots sur papier. Gardez-la en lieu sûr. Ne la partagez JAMAIS.
4️⃣ Confirmez — Terminé !

🔗 *Connexion à Polygon :*
• MetaMask détecte généralement Polygon automatiquement
• Sinon : menu réseaux → "Ajouter un réseau" → entrez :
  - Réseau : Polygon Mainnet / RPC : https://polygon-rpc.com
  - Chain ID : 137 / Symbole : POL

💡 *Astuce:* Achetez du POL (pour le gas) et de l'USDT sur Binance ou autre exchange, puis retirez vers votre adresse MetaMask sur Polygon.`
  },

  what_is_crypto: {
    en:`🔰 *Crypto Made Simple*

*Blockchain* = a digital ledger (like a notebook) shared across thousands of computers. Once something is written, it cannot be changed or deleted. This makes it secure and transparent.

*Cryptocurrency* = digital money that lives on a blockchain. No bank needed — you control it with your wallet.

*Wallet* = your personal keychain. It holds your crypto and lets you send/receive funds. Think of it like a bank account that only YOU can access.

*Smart Contract* = automated rules running on the blockchain. Fitia's mining, swaps, and rewards all run through smart contracts — no human intervention needed.

*Polygon* = a fast, cheap blockchain network built on top of Ethereum. Fitia uses Polygon so you pay pennies in fees instead of dollars.

💡 *In short:* Fitia lets you earn crypto by running mining machines, trade tokens, and shop — all secured by blockchain technology. No trust required, just code.`,
    fr:`🔰 *La Crypto Expliquée Simplement*

*Blockchain* = un registre numérique partagé entre des milliers d'ordinateurs. Une fois écrit, c'est immuable. Cela rend le système sécurisé et transparent.

*Cryptomonnaie* = de l'argent numérique qui vit sur une blockchain. Pas de banque nécessaire — vous le contrôlez avec votre wallet.

*Wallet* = votre trousseau de clés personnel. Il contient vos cryptos et vous permet d'envoyer/recevoir. Comme un compte bancaire accessible UNIQUEMENT par vous.

*Smart Contract* = des règles automatisées sur la blockchain. Le mining, les swaps et les récompenses de Fitia fonctionnent via des smart contracts — aucune intervention humaine.

*Polygon* = un réseau blockchain rapide et économique construit sur Ethereum. Fitia utilise Polygon pour que vous payiez des centimes en frais au lieu de dollars.

💡 *En bref :* Fitia vous permet de gagner de la crypto avec des machines, d'échanger des tokens et de faire du shopping — tout sécurisé par la blockchain. Pas de confiance nécessaire, juste du code.`
  },

  investment_advice: {
    en:`📈 *Maximizing Your Fitia Earnings*

⚡ *Strategy Tips:*
• Start with MK-I or MK-II to learn the system
• Reinvest your first FTA earnings into better machines
• Longer batteries (90-365 days) = lower cost per day
• Run multiple machines simultaneously for compound hashrate
• Claim rewards regularly to compound your FTA balance

💎 *Long-term View:*
• FTA token value grows with ecosystem adoption
• Early miners benefit most from protocol growth
• The 4 visions create multiple revenue streams
• Referral system adds passive bonus income

🔍 *ROI depends on:* Machine tier, FTA market price, your strategy, and ecosystem growth.

⚠️ *Disclaimer:* This is not financial advice. Crypto is volatile. Do your own research.`,
    fr:`📈 *Maximiser vos Gains Fitia*

⚡ *Conseils :*
• Commencez avec MK-I ou MK-II pour apprendre le système
• Réinvestissez vos premiers gains FTA dans de meilleures machines
• Batteries plus longues (90-365 jours) = coût par jour réduit
• Faites tourner plusieurs machines simultanément
• Réclamez régulièrement vos récompenses

💎 *Vision long-terme :*
• La valeur du FTA croît avec l'adoption de l'écosystème
• Les premiers mineurs bénéficient le plus de la croissance
• Les 4 visions créent de multiples sources de revenus
• Le système de parrainage ajoute un bonus passif

⚠️ *Avertissement :* Ceci n'est pas un conseil financier. Faites vos propres recherches.`
  },

  fitia_revolution: {
    en:`⚡ *Why Fitia Pro is Revolutionary*

🌍 *Democratizing Crypto Mining:* Unlike traditional mining that requires expensive hardware and electricity, Fitia makes mining accessible to anyone with a smartphone and a small investment.

🔄 *Circular Economy:* The 4 visions feed into each other:
Mining → earns FTA → used in Finance, Shop & Store → drives demand → grows ecosystem → attracts more miners → cycle repeats

🔓 *Non-Custodial:* Your funds are always in YOUR wallet. No company holds your crypto. Pure DeFi.

📊 *Transparent:* Every transaction on-chain. No hidden fees, no black boxes. The smart contract is the law.

🌱 *Organic Growth:* No pre-mine. Every token is earned. The ecosystem grows with its community.

🚀 *We're building more than an app — we're building a new digital economy.*`,
    fr:`⚡ *Pourquoi Fitia Pro est Révolutionnaire*

🌍 *Démocratiser le Mining Crypto:* Contrairement au mining traditionnel qui nécessite du matériel coûteux et de l'électricité, Fitia rend le mining accessible à tous avec un smartphone et un petit investissement.

🔄 *Économie Circulaire:* Les 4 visions se nourrissent mutuellement :
Mining → génère du FTA → utilisé dans Finance, Shop & Store → stimule la demande → développe l'écosystème → attire plus de mineurs → le cycle continue

🔓 *Non-Custodial:* Vos fonds sont toujours dans VOTRE wallet. Aucune entreprise ne détient votre crypto. Pure DeFi.

🌱 *Croissance Organique:* Pas de pré-mine. Chaque token est gagné. L'écosystème grandit avec sa communauté.

🚀 *Nous construisons plus qu'une app — nous construisons une nouvelle économie numérique.*`,
    zh:`⚡ *为什么Fitia Pro是革命性的*

🌍 *民主化加密货币挖矿:* 与传统挖矿需要昂贵硬件和电力不同，Fitia让任何拥有智能手机和小额投资的人都能参与挖矿。

🔄 *循环经济:* 四大愿景相互促进：挖矿→赚取FTA→用于金融、商城和商店→推动需求→发展生态系统→吸引更多矿工→循环继续

🔓 *非托管:* 您的资金始终在您的钱包中。没有公司持有您的加密货币。纯粹的DeFi。

🌱 *有机增长:* 无预挖。每个代币都是赚来的。生态系统与社区共同成长。

🚀 *我们正在构建的不仅是一个应用——而是一个新的数字经济。*`
  },

  beginner_guide: {
    en:`🚀 *Getting Started with Fitia Pro (0 to Mining in 5 min)*

Even if you've never used crypto before, here's exactly what to do:

📱 *Step 1: Get a Wallet*
Install MetaMask on your phone or computer. Write down your secret recovery phrase on paper — NEVER share it with anyone.

💰 *Step 2: Add Funds*
Buy POL (MATIC) and USDT from an exchange (Binance, Coinbase, etc.), then send them to your MetaMask wallet address on the *Polygon network*.

🔗 *Step 3: Connect*
Open the Fitia app, tap "Connect" and approve the MetaMask connection. Make sure you're on Polygon network (chain 137).

⛏️ *Step 4: Buy a Machine*
Go to Shop → choose a Starter machine (MK-I) → pay with USDT → Confirm.

🔋 *Step 5: Buy a Battery & Plug In*
Buy a 30-day battery → Go to Wallet → Plug in your machine.

🎉 *That's it!* Your machine is now mining FTA every second. Tap CLAIM to collect your earnings.

💡 *Need help at any step?* I'm here! Just ask.`,
    fr:`🚀 *Débuter avec Fitia Pro (0 au Minage en 5 min)*

Même si vous n'avez jamais utilisé la crypto, voici exactement quoi faire :

📱 *Étape 1 : Obtenez un Wallet*
Installez MetaMask sur votre téléphone ou PC. Notez votre phrase de récupération sur papier — ne la partagez JAMAIS.

💰 *Étape 2 : Ajoutez des Fonds*
Achetez du POL (MATIC) et de l'USDT depuis Binance, Coinbase, etc., puis envoyez-les à votre adresse MetaMask sur le réseau *Polygon*.

🔗 *Étape 3 : Connectez-vous*
Ouvrez l'app Fitia, appuyez sur "Connecter" et approuvez. Vérifiez d'être sur Polygon (chain 137).

⛏️ *Étape 4 : Achetez une Machine*
Boutique → MK-I → payez en USDT → Confirmez.

🔋 *Étape 5 : Achetez une Batterie et Branchez*
Achetez une batterie 30 jours → Wallet → Branchez la machine.

🎉 *C'est tout !* Votre machine mine des FTA. Cliquez RÉCLAMER pour collecter.

💡 *Besoin d'aide ?* Je suis là !`
  },

  deposit_funds: {
    en:`💰 *How to Add Funds to Fitia*

1️⃣ Buy POL and USDT from an exchange (Binance, Coinbase, Kraken, etc.)
2️⃣ In the exchange, go to Withdraw / Send
3️⃣ Paste your MetaMask wallet address
4️⃣ *IMPORTANT:* Select *Polygon* as the withdrawal network
5️⃣ Confirm — funds arrive in 1-3 minutes

📋 *Your address:* Open Fitia → Wallet tab → tap "Receive" to see/copy your address

💡 *Why POL?* You need a small amount of POL (~$0.01-0.10) for gas fees on each transaction.
💡 *Why USDT?* It's the easiest way to buy machines — always works, no liquidity needed.`,
    fr:`💰 *Comment Ajouter des Fonds sur Fitia*

1️⃣ Achetez du POL et USDT sur un exchange (Binance, Coinbase...)
2️⃣ Sur l'exchange, allez dans Retrait / Envoyer
3️⃣ Collez votre adresse MetaMask
4️⃣ *IMPORTANT :* Sélectionnez *Polygon* comme réseau de retrait
5️⃣ Confirmez — les fonds arrivent en 1-3 minutes

📋 *Votre adresse :* Fitia → Wallet → appuyez sur "Recevoir"

💡 *Pourquoi POL ?* Pour les frais de gas (~0.01-0.10$ par transaction).
💡 *Pourquoi USDT ?* Le moyen le plus simple pour acheter des machines.`
  },

  withdraw_earnings: {
    en:`💸 *Withdrawing Your Earnings*

1️⃣ *Claim First:* On the Home tab, tap the CLAIM button to move earned FTA to your wallet
2️⃣ *Swap to USDT:* Go to Swap tab, select FTA → USDT, enter amount, confirm
3️⃣ *Send to Exchange:* Wallet tab → Send → enter your exchange's USDT deposit address (Polygon network!) → Confirm
4️⃣ *Cash Out:* On the exchange, sell USDT for your local currency, withdraw to bank

⚠️ *Important:*
• Always use Polygon network for transfers
• FTA→USDT swap needs protocol liquidity (green value in swap tab)
• Minimum withdrawal amounts may apply on exchanges

💡 *Alternative:* Use FTA directly in the Fitia ecosystem — reinvest in better machines for compound growth.`,
    fr:`💸 *Retirer vos Gains*

1️⃣ *Réclamez d'abord:* Onglet Accueil → RÉCLAMER pour envoyer le FTA dans votre wallet
2️⃣ *Échangez en USDT:* Onglet Swap → FTA → USDT → confirmez
3️⃣ *Envoyez vers l'Exchange:* Wallet → Envoyer → adresse USDT de l'exchange (réseau Polygon !)
4️⃣ *Retirez:* Sur l'exchange, vendez USDT → retirez vers votre banque

⚠️ *Important:* Utilisez toujours le réseau Polygon. Le swap FTA→USDT nécessite de la liquidité.`
  },

  network_polygon: {
    en:`🌐 *Why Polygon?*

Fitia Pro is built on *Polygon (formerly Matic)* — a Layer 2 blockchain on Ethereum.

✅ *Benefits:*
• ⚡ Fast: 2-5 second transaction confirmations
• 💰 Cheap: Gas fees ~$0.01-0.10 per transaction
• 🔒 Secure: Backed by Ethereum's security
• 🌍 Eco-friendly: Proof-of-Stake, energy efficient
• 📊 Battle-tested: Billions in volume, millions of users

🔗 *Chain ID: 137* | Explorer: polygonscan.com`,
    fr:`🌐 *Pourquoi Polygon?*

Fitia Pro est construit sur *Polygon (ex-Matic)* — une blockchain Layer 2 sur Ethereum.

✅ *Avantages:*
• ⚡ Rapide : confirmations en 2-5 secondes
• 💰 Économique : frais ~0.01-0.10$ par transaction
• 🔒 Sécurisé : adossé à la sécurité d'Ethereum
• 🌍 Écologique : Proof-of-Stake, efficace énergétiquement

🔗 *Chain ID: 137* | Explorer: polygonscan.com`
  },

  whatsapp: {
    en:`📱 *Fitia Community*

Join our official channels to connect with other miners:

💬 *WhatsApp Group:* ${CONFIG.WHATSAPP_GROUP}
📢 *WhatsApp Channel:* ${CONFIG.WHATSAPP_CHANNEL}

Get updates, ask questions, and be part of the Fitia family!`,
    fr:`📱 *Communauté Fitia*

💬 *Groupe WhatsApp:* ${CONFIG.WHATSAPP_GROUP}
📢 *Chaîne WhatsApp:* ${CONFIG.WHATSAPP_CHANNEL}

Rejoignez-nous pour des mises à jour, des questions et l'entraide !`
  },

  referral: {
    en:`👥 *Fitia Referral System*

Earn bonus rewards by inviting others to Fitia Pro!

🔗 *How it Works:*
1. Your wallet address IS your referral code
2. Share your address with friends
3. They enter your address in the "Referral System" section on Home
4. You earn commission when they make purchases

📋 *Your referral address:* ${"Connect wallet to see"} (connect wallet to view)

💡 Both you AND your referrals benefit from the growing ecosystem.`,
    fr:`👥 *Système de Parrainage Fitia*

Gagnez des bonus en invitant d'autres personnes sur Fitia Pro.

🔗 *Comment ça marche :*
1. Votre adresse wallet EST votre code de parrainage
2. Partagez votre adresse avec vos amis
3. Ils entrent votre adresse dans "Parrainage" sur l'Accueil
4. Vous gagnez une commission sur leurs achats

💡 Vous ET vos filleuls bénéficiez de la croissance de l'écosystème.`
  },

  roadmap: {
    en:`🗺️ *Fitia Pro Roadmap*

✅ *Phase 1 — Foundation (LIVE)*
• Mining protocol on Polygon
• Machine & battery NFT system
• USDT ↔ FTA swap (bonding curve)
• Referral system

🔜 *Phase 2 — Expansion (Coming)*
• Fitia Shop marketplace launch
• Staking & yield features
• Advanced machine tiers
• Mobile app

🔜 *Phase 3 — Ecosystem*
• Fitia Store e-commerce
• DAO governance
• Cross-chain bridges
• Institutional partnerships

🚀 *We're just getting started. The best is yet to come.*`,
    fr:`🗺️ *Roadmap Fitia Pro*

✅ *Phase 1 — Fondation (EN LIGNE)*
• Protocole de mining sur Polygon
• Système NFT machines & batteries
• Swap USDT ↔ FTA (bonding curve)
• Parrainage

🔜 *Phase 2 — Expansion*
• Lancement Fitia Shop
• Staking & yield
• Nouvelles machines
• App mobile

🚀 *Ce n'est que le début.*`
  },

  default: {
    en:`🤔 I'm the Fitia Assistant — here to help with everything about Fitia Pro!

I can explain:
⛏️ How mining works & how to earn FTA
💱 How to swap USDT ↔ FTA
🛒 How to buy machines & batteries
🏗️ The 4 visions: Mining, Finance, Shop, Store
🚀 How to get started (even as a beginner)
🔒 Security, wallets & crypto basics
💰 Investment strategies

💡 *Just ask me anything!* I'm here to help in English, French, German, Chinese or Singapore English.`,
    fr:`🤔 Je suis l'Assistant Fitia — là pour vous aider avec tout sur Fitia Pro !

Je peux expliquer :
⛏️ Le mining et comment gagner des FTA
💱 Comment échanger USDT ↔ FTA
🛒 Comment acheter machines & batteries
🏗️ Les 4 visions : Mining, Finance, Shop, Store
🚀 Comment débuter (même pour les débutants)
🔒 Sécurité, wallets et bases crypto
💰 Stratégies d'investissement

💡 *Posez-moi n'importe quelle question !*`,
    de:`🤔 Ich bin der Fitia-Assistent — hier, um zu helfen!

Ich kann erklären: Mining, Swaps, Kauf von Maschinen, die 4 Visionen, Anfängerhilfe, Sicherheit, Investitionen.

💡 *Frag mich einfach!*`,
    zh:`🤔 我是Fitia助手——随时为您解答关于Fitia Pro的一切问题！

我可以解释：挖矿、兑换、购买矿机、四大愿景、新手入门、安全、投资等。

💡 *尽管问我！*`
  }
};

/* ═════════════════════════════════════════════════════════════
   ABIs (only functions that EXIST on FitiaMiningV2)
   ═════════════════════════════════════════════════════════════ */
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

const SWAP_FEE_RATE = 0.04;
const SLIPPAGE      = 0.005;

/* ═════════════════════════════════════════════════════════════
   APPLICATION
   ═════════════════════════════════════════════════════════════ */
class Application {
  constructor(){
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

  /* ── Helpers ───────────────────────────────────────────────── */
  t(key){return i18n[this.currentLang]?.[key]||i18n['en'][key]||key;}
  formatUsd(v){return'$'+v.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});}
  formatHashrate(h){if(h<=0)return'0 H/s';const u=['H/s','KH/s','MH/s','GH/s','TH/s','PH/s'];let v=h,i=0;while(v>=1000&&i<u.length-1){v/=1000;i++;}return v.toFixed(2)+' '+u[i];}
  formatTimeRemaining(s){if(s<=0)return this.t('expired');const d=Math.floor(s/86400),h=Math.floor((s%86400)/3600),m=Math.floor((s%3600)/60);if(d>1)return`${d}d ${h}h`;if(d===1)return`1d ${h}h`;if(h>0)return`${h}h ${m}m`;return`${m}m`;}
  getBatteryDuration(id){if(this.batteryTypeDurations[id]!==undefined)return this.batteryTypeDurations[id];return{0:3,1:7,2:15,3:30,4:90,5:180,6:270,7:365}[id]||30;}
  _loadLocalAssets(){try{this.userMachines=JSON.parse(localStorage.getItem(this.STORAGE_MACHINES))||[];}catch(e){this.userMachines=[];}try{this.userBatteries=JSON.parse(localStorage.getItem(this.STORAGE_BATTERIES))||{};}catch(e){this.userBatteries={};}try{this.userLastClaimTime=parseInt(localStorage.getItem(this.STORAGE_CLAIM))||Math.floor(Date.now()/1000);}catch(e){this.userLastClaimTime=Math.floor(Date.now()/1000);}}
  _saveLocalAssets(){localStorage.setItem(this.STORAGE_MACHINES,JSON.stringify(this.userMachines));localStorage.setItem(this.STORAGE_BATTERIES,JSON.stringify(this.userBatteries));localStorage.setItem(this.STORAGE_CLAIM,String(this.userLastClaimTime||Math.floor(Date.now()/1000)));}

  /* ── Language ───────────────────────────────────────────────── */
  setLanguage(lang){if(!i18n[lang])return;this.currentLang=lang;localStorage.setItem('fitia_lang',lang);const f={en:'🇬🇧',fr:'🇫🇷',de:'🇩🇪',zh:'🇨🇳',sg:'🇸🇬'};document.getElementById('lang-btn-display').innerText=`${f[lang]} ${lang.toUpperCase()}`;this.applyTranslations();this.renderShop();}
  applyTranslations(){
    const st=(s,k)=>{const e=document.querySelector(s);if(e)e.innerText=this.t(k);};
    const sp=(s,k)=>{const e=document.querySelector(s);if(e)e.placeholder=this.t(k);};
    st('#btn-connect','connect');st('.total-balance-card small','totalBal');
    st('.referral-card h3','refTitle');st('.referral-card p.small-text','refDesc');
    sp('#ref-address-input','enterRefAddr');st('.referral-card .btn-full','bindRef');
    const ss=document.querySelectorAll('.stat-card');
    if(ss[0]){ss[0].querySelector('small:first-child').innerText=this.t('power');ss[0].querySelector('small:last-child').innerText=this.t('ftaSec');}
    if(ss[1]){ss[1].querySelector('small:first-child').innerText=this.t('pending');ss[1].querySelector('small:last-child').innerText=this.t('fta');}
    const mb=document.querySelector('.btn-mega span:last-child');if(mb)mb.textContent=this.t('claim');
    st('#view-shop .view-title','shopTitle');
    const tb=document.querySelectorAll('.shop-tab');if(tb[0])tb[0].innerText=this.t('machines');if(tb[1])tb[1].innerText=this.t('batteries');
    st('#view-my-rigs .view-title','myAssets');
    st('#active-machines-section .section-title','activeMachines');
    const wc=document.querySelectorAll('#view-my-rigs .card');
    if(wc[1])wc[1].querySelector('.section-title').innerText=this.t('myMachines');
    if(wc[2])wc[2].querySelector('.section-title').innerText=this.t('myBatteries');
    st('#view-swap .view-title','swapTitle');
    const sh=document.querySelectorAll('.swap-header span:first-child');
    if(sh[0])sh[0].innerText=this.t('youPay');if(sh[1])sh[1].innerText=this.t('youReceive');
    st('.liquidity-reserve-box .liquidity-label span:last-child','liquidityReserve');
    st('.liquidity-info-hint','liquidityHint');
    st('#view-swap .btn-primary','swap');
    document.querySelectorAll('.nav-item span').forEach((s,i)=>s.innerText=this.t(['home','shop','assets','swapNav'][i]));
  }
  async init(){this.setLanguage(this.currentLang);}

  /* ── Prices ─────────────────────────────────────────────────── */
  async fetchMarketPrices(){
    this.polPriceUsd=0;
    try{
      const r=await fetch('https://api.dexscreener.com/latest/dex/tokens/0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0');
      const d=await r.json();if(d.pairs?.length)this.polPriceUsd=parseFloat(d.pairs[0].priceUsd)||0;
    }catch(e){}
    if(!this.polPriceUsd){
      try{
        const r=await fetch('https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd');
        const d=await r.json();this.polPriceUsd=d['matic-network']?.usd||0;
      }catch(e2){}
    }
    if(!this.polPriceUsd)this.polPriceUsd=0.70;
  }

  /* ── Connect ────────────────────────────────────────────────── */
  async connect(){
    if(window.ethereum){
      this.setLoader(true,this.t('connWallet'));
      try{
        await window.ethereum.request({method:'eth_requestAccounts'});
        this.provider=new ethers.BrowserProvider(window.ethereum);
        this.signer=await this.provider.getSigner();
        this.user=await this.signer.getAddress();
        const n=await this.provider.getNetwork();
        if(Number(n.chainId)!==CONFIG.CHAIN_ID)await this.switchNetwork();
        this.initContracts();
        window.ethereum.on('accountsChanged',()=>window.location.reload());
        window.ethereum.on('chainChanged',()=>window.location.reload());
      }catch(e){this.showError(e);}finally{this.setLoader(false);}
    }else if(typeof EthereumProvider!=='undefined'&&CONFIG.WC_PROJECT_ID&&!CONFIG.WC_PROJECT_ID.includes("...")){
      this.setLoader(true,this.t('connWallet'));
      try{
        const wc=await EthereumProvider.init({projectId:CONFIG.WC_PROJECT_ID,chains:[CONFIG.CHAIN_ID],showQrModal:true,methods:['eth_sendTransaction','personal_sign'],metadata:{name:'FITIA PRO MINER',description:'Mining DApp',url:window.location.origin,icons:[window.location.origin+'/logo.png']}});
        await wc.enable();this.provider=new ethers.BrowserProvider(wc);this.signer=await this.provider.getSigner();
        this.user=await this.signer.getAddress();this.initContracts();
        wc.on("disconnect",()=>window.location.reload());
      }catch(e){this.showError(e);}finally{this.setLoader(false);}
    }else{
      this.showToast(CONFIG.WC_PROJECT_ID?.includes("...")?this.t('wcIdMissing'):"Please install MetaMask or use a Web3 browser.",true);
    }
  }
  async initContracts(){
    this.contracts.usdt=new ethers.Contract(CONFIG.USDT,ERC20_ABI,this.signer);
    this.contracts.fta=new ethers.Contract(CONFIG.FTA,ERC20_ABI,this.signer);
    this.contracts.mining=new ethers.Contract(CONFIG.MINING,MINING_ABI,this.signer);
    try{this.ftaDecimals=Number(await this.contracts.fta.decimals());}catch(e){this.ftaDecimals=18;}
    try{this.usdtDecimals=Number(await this.contracts.usdt.decimals());}catch(e){this.usdtDecimals=6;}
    document.getElementById('btn-connect').classList.add('hidden');
    document.getElementById('wallet-status').classList.remove('hidden');
    document.getElementById('addr-display').innerText=this.user.slice(0,6)+"..."+this.user.slice(-4);
    this._loadLocalAssets();
    if(!localStorage.getItem(this.STORAGE_CLAIM)){this.userLastClaimTime=Math.floor(Date.now()/1000);this._saveLocalAssets();}
    await this.fetchMarketPrices();await this.cacheBatteryDurations();await this.updateData();
    setInterval(()=>this.updateData(),15000);
    this.initVisualizer();window.addEventListener('resize',()=>this.resizeCanvas());
  }
  async cacheBatteryDurations(){try{const c=Number(await this.contracts.mining.getBatteryCount());for(let i=0;i<c;i++){try{const b=await this.contracts.mining.batteryTypes(i);this.batteryTypeDurations[i]=Number(b.duration)/86400;}catch(e){}}}catch(e){}}
  async switchNetwork(){try{await window.ethereum.request({method:'wallet_switchEthereumChain',params:[{chainId:'0x89'}]});}catch(e){if(e.code===4902){await window.ethereum.request({method:'wallet_addEthereumChain',params:[{chainId:'0x89',chainName:'Polygon',nativeCurrency:{name:'MATIC',symbol:'MATIC',decimals:18},rpcUrls:['https://polygon-rpc.com/'],blockExplorerUrls:['https://polygonscan.com/']}]});}}}

  /* ═══════════ DATA REFRESH ═══════════════════════════════════ */
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
        this.pendingBalance=0;document.getElementById('val-pending').innerText="0.00000";
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

      // ── Professional Liquidity Display ──
      const nfsEl=document.getElementById('net-fta-sold-display');
      if(nfsEl){
        const nfsHuman=parseFloat(ethers.formatUnits(this.netFtaSold,this.ftaDecimals));
        nfsEl.innerText=nfsHuman.toFixed(4)+' FTA';
        nfsEl.className='liquidity-value';
        if(this.netFtaSold===0n)nfsEl.classList.add('none');
        else if(nfsHuman<100)nfsEl.classList.add('low');
        else nfsEl.classList.add('high');
      }

      const fromDec=this.swapDirection==='USDT_TO_FTA'?this.usdtDecimals:this.ftaDecimals;
      const toDec=this.swapDirection==='USDT_TO_FTA'?this.ftaDecimals:this.usdtDecimals;
      document.getElementById('swap-bal-from').innerText=parseFloat(ethers.formatUnits(this.swapDirection==='USDT_TO_FTA'?usdtBal:ftaBal,fromDec)).toFixed(4);
      document.getElementById('swap-bal-to').innerText=parseFloat(ethers.formatUnits(this.swapDirection==='USDT_TO_FTA'?ftaBal:usdtBal,toDec)).toFixed(4);

      await this.renderShop();this.renderActiveMachines();this.renderUserMachines();this.renderUserBatteries();
      if(document.getElementById('swap-from-in').value)this.calcSwap();
    }catch(e){console.error("Refresh Error",e);}
  }

  startMiningCounter(){if(this.miningTimer)return;this.miningTimer=setInterval(()=>{if(this.currentRealPower>0){const rps=(this.currentRealPower*Number(this.currentDifficulty))/1e18;this.pendingBalance+=rps;document.getElementById('val-pending').innerText=this.pendingBalance.toFixed(5);}},1000);}
  stopMiningCounter(){if(this.miningTimer){clearInterval(this.miningTimer);this.miningTimer=null;}}

  /* ── Referral ───────────────────────────────────────────────── */
  async bindReferrer(){const a=document.getElementById('ref-address-input').value.trim();if(!ethers.isAddress(a))return this.showToast(this.t('invalidAddr'),true);this.setLoader(true,this.t('linking'));try{const tx=await this.contracts.mining.setReferrer(a);await tx.wait();this.showToast(this.t('refLinked'));document.getElementById('ref-address-input').value='';}catch(e){this.showError(e);}this.setLoader(false);}

  /* ── Shop ───────────────────────────────────────────────────── */
  setPayMode(m){this.payMode=m;document.getElementById('btn-pay-usdt').classList.toggle('active',m==='USDT');document.getElementById('btn-pay-fta').classList.toggle('active',m==='FTA');this.renderShop();}
  setShopView(v){this.shopViewMode=v;document.querySelectorAll('.shop-tab').forEach(t=>t.classList.remove('active'));if(event?.currentTarget)event.currentTarget.classList.add('active');this.renderShop();}
  async renderShop(){if(this.isLoadingShop)return;const c=document.getElementById('shop-list');if(this.shopViewMode==='machines'){if(!this.shopMachinesData.length)await this.fetchMachines();this._renderShopMachinesHTML(c);}else{if(!this.shopBatteriesData.length)await this.fetchBatteries();this._renderShopBatteriesHTML(c);}}
  async fetchMachines(){this.isLoadingShop=true;try{const cnt=Number(await this.contracts.mining.getMachineCount());const p=[];for(let i=0;i<cnt;i++)p.push(this.contracts.mining.machineTypes(i));const r=await Promise.all(p);this.shopMachinesData=[];for(let i=0;i<cnt;i++){const d=r[i];this.shopMachinesData.push({price:parseFloat(ethers.formatUnits(d.price,this.usdtDecimals)),power:Number(d.power),priceRaw:d.price});}}catch(e){console.error("fetchMachines",e);}this.isLoadingShop=false;}
  async fetchBatteries(){this.isLoadingShop=true;try{const cnt=Number(await this.contracts.mining.getBatteryCount());const p=[];for(let i=0;i<cnt;i++)p.push(this.contracts.mining.batteryTypes(i));const r=await Promise.all(p);this.shopBatteriesData=[];for(let i=0;i<cnt;i++){const d=r[i];this.shopBatteriesData.push({price:parseFloat(ethers.formatUnits(d.price,this.usdtDecimals)),days:Number(d.duration)/86400,priceRaw:d.price});}}catch(e){console.error("fetchBatteries",e);}this.isLoadingShop=false;}

  /* ═══════════ BUY MACHINE ════════════════════════════════════ */
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
        if(this.netFtaSold===0n){this.showToast(this.t('errNoFtaLiquidity')+' '+this.t('useUsdtInstead'),true);this.setLoader(false);return;}
        let fc;
        try{fc=await this.contracts.mining.getFtaCostForUsdtSell(m.priceRaw);}catch(viewErr){this.showToast(this.t('errLowLiquidity'),true);this.setLoader(false);return;}
        if(fc===0n){this.showToast(this.t('errLowLiquidity'),true);this.setLoader(false);return;}
        const ftExact=fc*100n/89n,ftApprove=ftExact*13n/10n;
        const al=await this.contracts.fta.allowance(this.user,CONFIG.MINING);
        if(al<ftApprove){this.setLoader(true,this.t('approveFta'));try{await(await this.contracts.fta.approve(CONFIG.MINING,ftApprove)).wait();}catch(apErr){this.showToast(this.t('errApprovalFailed'),true);this.setLoader(false);return;}}
        this.setLoader(true,this.t('confirming'));
        await(await this.contracts.mining.buyMachineWithFTA(id)).wait();
        try{this.netFtaSold=BigInt(await this.contracts.mining.netFtaSold());}catch(e){}
      }
      this.userMachines.push({typeId:id,expiresAt:0,pluggedBatteryType:null,boughtAt:Math.floor(Date.now()/1000)});
      this._saveLocalAssets();this.showToast(this.t('machineBought'));this.shopMachinesData=[];this.updateData();
    }catch(e){this.showError(e);}this.setLoader(false);
  }

  /* ═══════════ BUY BATTERY ════════════════════════════════════ */
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
        if(this.netFtaSold===0n){this.showToast(this.t('errNoFtaLiquidity')+' '+this.t('useUsdtInstead'),true);this.setLoader(false);return;}
        let fc;
        try{fc=await this.contracts.mining.getFtaCostForUsdtSell(b.priceRaw);}catch(viewErr){this.showToast(this.t('errLowLiquidity'),true);this.setLoader(false);return;}
        if(fc===0n){this.showToast(this.t('errLowLiquidity'),true);this.setLoader(false);return;}
        const ftExact=fc*100n/89n,ftApprove=ftExact*13n/10n;
        const al=await this.contracts.fta.allowance(this.user,CONFIG.MINING);
        if(al<ftApprove){this.setLoader(true,this.t('approveFta'));try{await(await this.contracts.fta.approve(CONFIG.MINING,ftApprove)).wait();}catch(apErr){this.showToast(this.t('errApprovalFailed'),true);this.setLoader(false);return;}}
        this.setLoader(true,this.t('confirming'));
        await(await this.contracts.mining.buyBatteryWithFTA(id)).wait();
        try{this.netFtaSold=BigInt(await this.contracts.mining.netFtaSold());}catch(e){}
      }
      this.userBatteries[id]=(this.userBatteries[id]||0)+1;this._saveLocalAssets();
      this.showToast(this.t('batteryBought'));this.shopBatteriesData=[];this.updateData();
    }catch(e){this.showError(e);}this.setLoader(false);
  }

  /* ── Plug In ────────────────────────────────────────────────── */
  async plugInMachine(){
    const mIdx=document.getElementById('plug-machine-id').value,bT=document.getElementById('plug-battery-type').value;
    if(mIdx===""||mIdx<0)return this.showToast(this.t('invalidId'),true);
    const idx=Number(mIdx);if(idx>=this.userMachines.length)return this.showToast(this.t('invalidId'),true);
    if(!this.userBatteries[bT]||this.userBatteries[bT]<=0)return this.showToast("No battery of this type available",true);
    this.setLoader(true,this.t('pluggingIn'));
    try{
      await(await this.contracts.mining.plugInMachine(idx,bT)).wait();
      this.pendingBalance=0;this.userLastClaimTime=Math.floor(Date.now()/1000);
      const durSec=this.batteryTypeDurations[bT]?this.batteryTypeDurations[bT]*86400:2592000;
      this.userMachines[idx].expiresAt=Math.floor(Date.now()/1000)+durSec;
      this.userMachines[idx].pluggedBatteryType=Number(bT);
      this.userBatteries[bT]=Math.max(0,(this.userBatteries[bT]||0)-1);
      this._saveLocalAssets();this.showToast(this.t('pluggedIn'));this.updateData();
    }catch(e){this.showError(e);}this.setLoader(false);
  }

  /* ── Claim ──────────────────────────────────────────────────── */
  async claim(){if(!this.user)return;this.stopMiningCounter();this.setLoader(true,this.t('claiming'));try{await(await this.contracts.mining.claimRewards()).wait();this.pendingBalance=0;this.userLastClaimTime=Math.floor(Date.now()/1000);this._saveLocalAssets();this.showToast(this.t('claimed'));this.updateData();if(this.currentRealPower>0)this.startMiningCounter();}catch(e){this.showError(e);this.startMiningCounter();}this.setLoader(false);}

  /* ═══════════ SWAP ═══════════════════════════════════════════ */
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
        const al=await this.contracts.usdt.allowance(this.user,CONFIG.MINING);
        if(al<amount){this.setLoader(true,this.t('approveUsdt'));await(await this.contracts.usdt.approve(CONFIG.MINING,amount)).wait();}
        this.setLoader(true,this.t('confirming'));
        await(await this.contracts.mining.swapUsdtForFta(amount)).wait();
        try{this.netFtaSold=BigInt(await this.contracts.mining.netFtaSold());}catch(e){}
      }else{
        if(this.netFtaSold===0n){this.showToast(this.t('errNoFtaLiquidity'),true);this.setLoader(false);return;}
        if(amount>this.netFtaSold){const maxSell=parseFloat(ethers.formatUnits(this.netFtaSold,this.ftaDecimals));this.showToast(this.t('errMaxFtaSell').replace('{max}',maxSell.toFixed(4)),true);this.setLoader(false);return;}
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
      if(em.includes('insufficient liquidity')||em.includes('invalid amount'))this.showToast(this.t('errSwapRejected'),true);
      else this.showError(e);
    }
    this.setLoader(false);
  }

  /* ── Send / Receive ─────────────────────────────────────────── */
  openSend(ts){this.sendTokenSymbol=ts;document.getElementById('send-token-name').innerText=ts;document.getElementById('send-to-address').value='';document.getElementById('send-amount').value='';let bid='bal-pol-2';if(ts==='USDT')bid='bal-usdt-2';if(ts==='FTA')bid='bal-fta-2';document.getElementById('send-bal').innerText=document.getElementById(bid)?.innerText||'0';document.getElementById('modal-send').classList.add('active');}
  openReceive(){if(!this.user)return this.showToast(this.t('connFirst'),true);document.getElementById('receive-addr-display').innerText=this.user;document.getElementById('modal-receive').classList.add('active');}
  closeModals(){document.getElementById('modal-send').classList.remove('active');document.getElementById('modal-receive').classList.remove('active');}
  copyReceiveAddress(){navigator.clipboard.writeText(this.user);this.showToast(this.t('addrCopied'));}
  async executeSend(){const to=document.getElementById('send-to-address').value.trim(),amt=document.getElementById('send-amount').value;if(!ethers.isAddress(to))return this.showToast(this.t('invalidAddr'),true);if(!amt||Number(amt)<=0)return this.showToast(this.t('invalidAmount'),true);this.setLoader(true,this.t('sending'));try{let tx;if(this.sendTokenSymbol==='POL'){tx=await this.signer.sendTransaction({to,value:ethers.parseEther(amt)});}else{let ct,dc;if(this.sendTokenSymbol==='USDT'){ct=this.contracts.usdt;dc=this.usdtDecimals;}if(this.sendTokenSymbol==='FTA'){ct=this.contracts.fta;dc=this.ftaDecimals;}tx=await ct.transfer(to,ethers.parseUnits(amt,dc));}await tx.wait();this.showToast(this.t('sentSuccess'));this.closeModals();this.updateData();}catch(e){this.showError(e);}this.setLoader(false);}

  /* ── Nav ────────────────────────────────────────────────────── */
  nav(viewId){document.querySelectorAll('.view').forEach(el=>{el.classList.remove('active');el.style.display='none';});const av=document.getElementById('view-'+viewId);if(av){av.classList.add('active');av.style.display='block';}document.querySelectorAll('.nav-item').forEach(el=>el.classList.remove('active'));if(event?.currentTarget)event.currentTarget.classList.add('active');}

  /* ── Visualizer ─────────────────────────────────────────────── */
  resizeCanvas(){if(this.vizContext){const c=this.vizContext.canvas;c.width=c.offsetWidth*2;c.height=c.offsetHeight*2;}}
  initVisualizer(){const c=document.getElementById('mining-canvas');if(!c)return;this.resizeCanvas();this.vizContext=c.getContext('2d');this.vizBars=[];for(let i=0;i<20;i++)this.vizBars.push({height:0,targetHeight:0});this.animateVisualizer();}
  updateVisualizerIntensity(p){const maxP=100000,level=Math.min(Math.max(p/maxP,0.02),1);this.vizBars.forEach(b=>{b.targetHeight=(this.vizContext.canvas.height*level)*(0.6+Math.random()*0.4);});}
  animateVisualizer(){if(!this.vizContext)return;const ctx=this.vizContext;ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);ctx.fillStyle="#F0B90B";const w=ctx.canvas.width/20;this.vizBars.forEach((b,i)=>{b.height+=(b.targetHeight-b.height)*0.1;ctx.fillRect(i*w+2,ctx.canvas.height-b.height,w-4,b.height);b.targetHeight+=(Math.random()-0.5)*10;if(b.targetHeight<0)b.targetHeight=2;if(b.targetHeight>ctx.canvas.height)b.targetHeight=ctx.canvas.height;});requestAnimationFrame(()=>this.animateVisualizer());}

  /* ── Loader / Toast / Errors ────────────────────────────────── */
  setLoader(show,msg="Processing..."){const l=document.getElementById('loader');document.getElementById('loader-text').innerText=msg;if(show)l.classList.remove('hidden');else l.classList.add('hidden');}
  showToast(msg,isError=false){const div=document.createElement('div');div.className='toast'+(isError?' toast-error':' toast-success');div.innerText=msg;document.getElementById('toast-container').appendChild(div);setTimeout(()=>div.remove(),5000);}
  getErrorMessage(e){const es=(e?.message||'').toLowerCase()+' '+(e?.code||'').toLowerCase()+' '+(e?.reason||'').toLowerCase()+' '+(e?.shortMessage||'').toLowerCase();const ie=(e?.info?.error?.message||'').toLowerCase();const c=es+' '+ie;if(c.includes('user rejected')||c.includes('user denied')||c.includes('cancelled by user')||c.includes('action_rejected')||e?.code==='ACTION_REJECTED'||e?.code===4001||e?.code===-32000||(e?.info?.error?.code===4001))return this.t('errRejected');if(c.includes('insufficient liquidity')||c.includes('insufficient fta liquidity')||c.includes('insufficient usdt liquidity'))return this.t('errLowLiquidity');if(c.includes('insufficient funds')||c.includes('insufficient balance')||c.includes('not enough')||c.includes('underpriced')||c.includes('exceeds allowance')||c.includes('erc20: insufficient')||c.includes('transfer amount exceeds'))return this.t('errInsufficientFunds');if(c.includes('nonce')||c.includes('already known')||c.includes('replacement fee too low'))return this.t('errNonce');if(c.includes('already pending')||c.includes('pending transaction'))return this.t('errAlreadyPending');if(c.includes('timeout')||c.includes('timed out')||c.includes('deadline'))return this.t('errTimeout');if(c.includes('network')||c.includes('fetch')||c.includes('failed to fetch')||c.includes('connection')||c.includes('could not decode')||c.includes('missing revert data')||c.includes('call revert exception'))return this.t('errNetwork');if(c.includes('invalid amount'))return this.t('errSwapRejected');if(c.includes('revert')||c.includes('execution reverted')||c.includes('vm execution error')||c.includes('gas required exceeds allowance')||c.includes('transaction failed'))return this.t('errContract');return this.t('errGeneric');}
  showError(e){console.error("Transaction Error:",e);this.showToast(this.getErrorMessage(e),true);}

  /* ── Render UI ──────────────────────────────────────────────── */
  renderActiveMachines(){const c=document.getElementById('active-machines-list');if(!c)return;const now=Math.floor(Date.now()/1000);const active=this.userMachines.filter(m=>m.expiresAt>now);if(!active.length){c.innerHTML=`<p class="small-text" style="text-align:center;">${this.t('noActiveMachines')}</p>`;return;}const tn=['MK-I','MK-II','MK-III','MK-IV','MK-V','MK-VI','MK-VII','MK-VIII'];c.innerHTML=active.map(m=>{const rem=m.expiresAt-now,dur=this.getBatteryDuration(m.pluggedBatteryType),tot=dur*86400,el=tot-rem,pr=Math.min(Math.max((el/tot)*100,0),100),bc=pr<60?'green':(pr<85?'yellow':'red');return`<div class="asset-row">${this.getMachineMiniSVG(m.typeId)}<div class="asset-info"><div class="asset-name">${tn[m.typeId%8]} <span class="status-pill active">● ${this.t('active')}</span></div><div class="asset-detail">${this.t('batteryLabel')}: ${dur} ${this.t('days')}</div><div class="battery-bar-wrap"><div class="battery-bar-header"><span class="battery-bar-label">${this.t('timeRemaining')}</span><span class="battery-bar-time ${bc}">${this.formatTimeRemaining(rem)}</span></div><div class="battery-bar"><div class="battery-bar-fill ${bc}" style="width:${pr.toFixed(1)}%"></div></div></div></div></div>`;}).join('');}
  renderUserMachines(){const c=document.getElementById('my-machines-list');if(!c)return;if(!this.userMachines.length){c.innerHTML=`<p class="small-text" style="text-align:center;">${this.t('noMachines')}</p>`;return;}const now=Math.floor(Date.now()/1000),tn=['MK-I','MK-II','MK-III','MK-IV','MK-V','MK-VI','MK-VII','MK-VIII'];c.innerHTML=this.userMachines.map((m,i)=>{let sc,st;if(m.expiresAt>now){sc='active';st=this.t('active');}else if(m.expiresAt>0){sc='expired';st=this.t('expired');}else{sc='inactive';st=this.t('inactive');}const dur=this.getBatteryDuration(m.pluggedBatteryType);let bh='';if(m.expiresAt>0){const rem=m.expiresAt-now,tot=dur*86400,el=tot-rem,pr=Math.min(Math.max((el/tot)*100,0),100),bc=rem<=0?'red':(pr<60?'green':(pr<85?'yellow':'red'));bh=`<div class="battery-bar-wrap"><div class="battery-bar-header"><span class="battery-bar-label">${this.t('batteryLabel')}: ${dur} ${this.t('days')}</span><span class="battery-bar-time ${bc}">${rem>0?this.formatTimeRemaining(rem):this.t('expired')}</span></div><div class="battery-bar"><div class="battery-bar-fill ${rem<=0?'gray':bc}" style="width:${rem<=0?100:pr.toFixed(1)}%"></div></div></div>`;}return`<div class="asset-row">${this.getMachineMiniSVG(m.typeId)}<div class="asset-info"><div class="asset-name">#${i} ${tn[m.typeId%8]} <span class="status-pill ${sc}">● ${st}</span></div><div class="asset-detail">${m.expiresAt>0?this.t('plugged'):this.t('notPlugged')}</div>${bh}</div></div>`;}).join('');}
  renderUserBatteries(){const c=document.getElementById('my-batteries-list');if(!c)return;const types=Object.entries(this.userBatteries).filter(([,cnt])=>cnt>0);if(!types.length){c.innerHTML=`<p class="small-text" style="text-align:center;">${this.t('noBatteries')}</p>`;return;}c.innerHTML=types.map(([tid,cnt])=>{const dur=this.getBatteryDuration(Number(tid)),cl=Math.floor(Math.random()*40)+60,lc=cl>60?'':(cl>20?'medium':(cl>0?'low':'empty'));return`<div class="asset-row"><div class="real-battery"><div class="battery-cap"></div><div class="battery-body"><div class="battery-level ${lc}" style="width:${cl}%"></div><div class="battery-charge-indicator">${cnt}×</div></div></div><div class="asset-info"><div class="asset-name">${dur} ${this.t('days')} <span class="status-pill available">● ${cnt} ${this.t('available')}</span></div></div></div>`;}).join('');}

  /* ── SVG ────────────────────────────────────────────────────── */
  getMachineSVG(tier){const t=[{n:'MK-I',g:1,c:'#64748b',a:'#94a3b8',f:1},{n:'MK-II',g:2,c:'#3b82f6',a:'#60a5fa',f:1},{n:'MK-III',g:3,c:'#8b5cf6',a:'#a78bfa',f:2},{n:'MK-IV',g:4,c:'#F0B90B',a:'#FFD43B',f:2},{n:'MK-V',g:5,c:'#f97316',a:'#fb923c',f:2},{n:'MK-VI',g:6,c:'#ef4444',a:'#f87171',f:3},{n:'MK-VII',g:8,c:'#06b6d4',a:'#22d3ee',f:3},{n:'MK-VIII',g:8,c:'#eab308',a:'#facc15',f:4}][tier%8];const W=260,H=170;let gH='',fH='',lH='',vH='';const gw=24,gh=48,gG=3,mW=W-40;let eg=gw;let tW=t.g*eg+(t.g-1)*gG;if(tW>mW){eg=Math.floor((mW-(t.g-1)*gG)/t.g);tW=t.g*eg+(t.g-1)*gG;}const gS=(W-tW)/2,gY=22;for(let i=0;i<t.g;i++){const x=gS+i*(eg+gG);gH+=`<rect x="${x}" y="${gY}" width="${eg}" height="${gh}" rx="2" fill="#080c18" stroke="${t.a}" stroke-width="0.6" opacity="0.85"/>`;const fC=Math.max(3,Math.floor(eg/4)),fS=eg-6;for(let j=0;j<9;j++){const fy=gY+5+j*4.5;if(fy+2<gY+gh-10){for(let f=0;f<fC;f++){gH+=`<rect x="${x+3+f*(fS/fC)}" y="${fy}" width="${Math.max(1,(fS/fC)-1.5)}" height="2" rx="0.5" fill="${t.a}" opacity="0.12"/>`;}}}const cW=Math.min(10,eg-6);gH+=`<rect x="${x+(eg-cW)/2}" y="${gY+gh-11}" width="${cW}" height="7" rx="1.5" fill="${t.c}" opacity="0.35"/><circle cx="${x+eg/2}" cy="${gY+3}" r="1" fill="${t.a}" class="led-pulse" style="animation-delay:${i*0.3}s"/>`;}const fR=14,fS2=14,tFW=t.f*fR*2+(t.f-1)*fS2,fSX=(W-tFW)/2,fY=100;for(let i=0;i<t.f;i++){const cx=fSX+i*(fR*2+fS2)+fR,cy=fY;fH+=`<circle cx="${cx}" cy="${cy}" r="${fR+2}" fill="#060a14" stroke="#2a2a3e" stroke-width="1"/><circle cx="${cx}" cy="${cy}" r="${fR}" fill="#0a0e1a" stroke="#333" stroke-width="0.8"/><g class="fan-blades" style="transform-origin:${cx}px ${cy}px">`;for(let b=0;b<5;b++)fH+=`<rect x="${cx-1.5}" y="${cy-fR+3}" width="3" height="${fR-4}" rx="1.5" fill="#1e293b" transform="rotate(${b*72},${cx},${cy})"/>`;fH+=`</g><circle cx="${cx}" cy="${cy}" r="3.5" fill="${t.a}" opacity="0.4"/><circle cx="${cx}" cy="${cy}" r="1.5" fill="${t.a}" opacity="0.7"/>`;}for(let i=0;i<6;i++){const lx=25+i*9;lH+=`<circle cx="${lx}" cy="148" r="1.8" fill="${i===0?'#10b981':(i<3?t.a:'#334155')}" class="led-pulse" style="animation-delay:${i*0.4}s"/>`;}for(let v=0;v<3;v++)vH+=`<rect x="30" y="${138+v*5}" width="${W-60}" height="2" rx="1" fill="#060a14" opacity="0.8"/>`;return`<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" class="machine-svg"><defs><linearGradient id="bG${tier}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1e293b"/><stop offset="50%" stop-color="#162032"/><stop offset="100%" stop-color="#0f172a"/></linearGradient><linearGradient id="tB${tier}" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="${t.c}" stop-opacity="0.8"/><stop offset="50%" stop-color="${t.a}" stop-opacity="1"/><stop offset="100%" stop-color="${t.c}" stop-opacity="0.8"/></linearGradient></defs><ellipse cx="${W/2}" cy="${H-3}" rx="${W/2-30}" ry="10" fill="${t.a}" opacity="0.06"/><rect x="12" y="10" width="${W-24}" height="${H-22}" rx="8" fill="url(#bG${tier})" stroke="#2a3550" stroke-width="1.2"/><rect x="12" y="10" width="${W-24}" height="4" rx="2" fill="url(#tB${tier})"/><circle cx="20" cy="18" r="1.5" fill="#334155"/><circle cx="${W-20}" cy="18" r="1.5" fill="#334155"/><text x="${W-22}" y="20" font-family="monospace" font-size="7" font-weight="700" fill="${t.a}" text-anchor="end" opacity="0.7">${t.n}</text><text x="24" y="20" font-family="sans-serif" font-size="6" font-weight="800" fill="#475569" letter-spacing="1.5">FITIA</text>${gH}<line x1="28" y1="${gY+gh+6}" x2="${W-28}" y2="${gY+gh+6}" stroke="#1e293b" stroke-width="0.8" stroke-dasharray="2,2"/>${fH}${vH}${lH}<circle cx="${W-25}" cy="148" r="3.5" fill="none" stroke="${t.a}" stroke-width="0.8" opacity="0.5"/><line x1="${W-25}" y1="143.5" x2="${W-25}" y2="146" stroke="${t.a}" stroke-width="0.8" opacity="0.5"/></svg>`;}
  getMachineMiniSVG(tier){const c=['#64748b','#3b82f6','#8b5cf6','#F0B90B','#f97316','#ef4444','#06b6d4','#eab308'][tier%8],a=['#94a3b8','#60a5fa','#a78bfa','#FFD43B','#fb923c','#f87171','#22d3ee','#facc15'][tier%8];return`<svg viewBox="0 0 50 50" class="machine-svg-mini"><rect x="2" y="2" width="46" height="46" rx="6" fill="#1e293b" stroke="${c}" stroke-width="1"/><rect x="2" y="2" width="46" height="3" rx="1.5" fill="${c}" opacity="0.6"/><rect x="8" y="10" width="14" height="20" rx="2" fill="#080c18" stroke="${a}" stroke-width="0.5"/><rect x="28" y="10" width="14" height="20" rx="2" fill="#080c18" stroke="${a}" stroke-width="0.5"/><circle cx="21" cy="40" r="6" fill="#0a0e1a" stroke="#333" stroke-width="0.5"/><g class="fan-blades" style="transform-origin:21px 40px">${[0,72,144,216,288].map(r=>`<rect x="19.5" y="34.5" width="3" height="5" rx="1.5" fill="#1e293b" transform="rotate(${r},21,40)"/>`).join('')}</g><circle cx="21" cy="40" r="2" fill="${a}" opacity="0.6"/><circle cx="37" cy="40" r="6" fill="#0a0e1a" stroke="#333" stroke-width="0.5"/><g class="fan-blades" style="transform-origin:37px 40px">${[0,72,144,216,288].map(r=>`<rect x="35.5" y="34.5" width="3" height="5" rx="1.5" fill="#1e293b" transform="rotate(${r},37,40)"/>`).join('')}</g><circle cx="37" cy="40" r="2" fill="${a}" opacity="0.6"/></svg>`;}

  _renderShopMachinesHTML(c){c.innerHTML='';c.style.gridTemplateColumns='1fr 1fr';const bc=['background:#64748b;color:#fff','background:#3b82f6;color:#fff','background:#8b5cf6;color:#fff','background:#F0B90B;color:#000','background:#f97316;color:#fff','background:#ef4444;color:#fff','background:#06b6d4;color:#000','background:#eab308;color:#000'];const bn=['STARTER','STANDARD','ADVANCED','PRO','ELITE','ULTRA','SUPREME','LEGEND'];for(let i=0;i<this.shopMachinesData.length;i++){const d=this.shopMachinesData[i],div=document.createElement('div');div.className='rig-item';div.innerHTML=`<span class="tier-badge" style="${bc[i%8]}">${bn[i%8]}</span>${this.getMachineSVG(i)}<span class="rig-name" style="font-size:0.85rem;">${this.t('rig')} ${i+1}</span><span class="rig-power" style="font-size:0.75rem;">${this.formatHashrate(d.power)}</span><span class="rig-price" style="font-size:1rem;">${d.price.toFixed(2)} $</span><button class="btn-primary" style="padding:8px;font-size:0.75rem;margin-top:6px;" onclick="App.buyMachine(${i})">${this.t('buy')} (${this.payMode})</button>`;c.appendChild(div);}}
  _renderShopBatteriesHTML(c){c.innerHTML='';c.style.gridTemplateColumns='1fr 1fr';for(let i=0;i<this.shopBatteriesData.length;i++){const d=this.shopBatteriesData[i],div=document.createElement('div'),cl=Math.floor(Math.random()*40)+60;div.className='battery-shop-item';div.innerHTML=`<div class="real-battery"><div class="battery-cap"></div><div class="battery-body"><div class="battery-level" style="width:${cl}%"></div><div class="battery-charge-indicator">${d.days}D</div></div></div><div class="battery-name">${d.days} ${this.t('days')}</div><div class="battery-price">${d.price.toFixed(2)} $</div><button class="btn-primary" style="padding:6px;font-size:0.75rem" onclick="App.buyBattery(${i})">${this.t('buy')} (${this.payMode})</button>`;c.appendChild(div);}}

  /* ═══════════ COMPREHENSIVE CHAT ASSISTANT ═══════════════════ */
  toggleChat(){const p=document.getElementById('chat-panel');const a=p.classList.toggle('active');if(a&&!this.chatInitialized){this.chatInitialized=true;setTimeout(()=>this.addChatBubble('assistant',this.getWelcomeMessage()),400);}if(a)setTimeout(()=>document.getElementById('chat-input').focus(),350);}
  sendChatMessage(){const i=document.getElementById('chat-input'),m=i.value.trim();if(!m)return;i.value='';this.addChatBubble('user',m);this.chatHistory.push({role:'user',text:m});const tid=this.showTyping();setTimeout(()=>{this.removeTyping(tid);const r=this.generateLocalResponse(m);this.addChatBubble('assistant',r);this.chatHistory.push({role:'assistant',text:r});},400+Math.min(m.length*25,1200)+Math.random()*400);}
  addChatBubble(role,text){const c=document.getElementById('chat-messages'),b=document.createElement('div');b.className=`chat-bubble ${role}`;b.textContent=text;c.appendChild(b);requestAnimationFrame(()=>c.scrollTop=c.scrollHeight);}
  showTyping(){const c=document.getElementById('chat-messages'),t=document.createElement('div'),id='typing-'+Date.now();t.id=id;t.className='chat-bubble assistant';t.innerHTML='<span style="letter-spacing:3px;animation:loaderTextPulse 1s infinite">● ● ●</span>';c.appendChild(t);c.scrollTop=c.scrollHeight;return id;}
  removeTyping(id){const e=document.getElementById(id);if(e)e.remove();}

  getWelcomeMessage(){
    const conn=!!this.user;
    const liquidityInfo=this.netFtaSold===0n
      ?`\n⚠️ Protocol liquidity is currently being built. Use USDT for purchases — it always works!`
      :`\n💧 Protocol Liquidity: ${parseFloat(ethers.formatUnits(this.netFtaSold,this.ftaDecimals)).toFixed(2)} FTA`;
    const msgs={
      en:`👋 Welcome to Fitia Pro! I'm your AI assistant — here to help with everything.\n\n🏗️ Fitia Pro is built on 4 revolutionary visions:\n⛏️ Mining • 💱 Finance • 🛒 Shop • 🏪 Store\n\n💬 Ask me anything:\n• How to start mining FTA\n• How swaps & liquidity work\n• Which machine to buy\n• What are the 4 visions\n• Crypto basics for beginners${liquidityInfo}\n\n🚀 Let's build the future of Web3 together!`,
      fr:`👋 Bienvenue sur Fitia Pro ! Je suis votre assistant IA.\n\n🏗️ Fitia Pro repose sur 4 visions révolutionnaires :\n⛏️ Mining • 💱 Finance • 🛒 Shop • 🏪 Store\n\n💬 Demandez-moi :\n• Comment miner des FTA\n• Comment fonctionnent les swaps\n• Quelle machine acheter\n• Les 4 visions\n• Bases crypto pour débutants${liquidityInfo}\n\n🚀 Construisons le futur du Web3 ensemble !`,
      de:`👋 Willkommen bei Fitia Pro! Ich bin Ihr KI-Assistent.\n\n🏗️ 4 revolutionäre Visionen: Mining • Finance • Shop • Store\n\n💬 Fragen Sie mich alles — Mining, Swaps, Strategie, Anfängerhilfe.${liquidityInfo}`,
      zh:`👋 欢迎来到Fitia Pro！我是您的AI助手。\n\n🏗️ 4大愿景：挖矿 • 金融 • 商城 • 商店\n\n💬 随时问我任何问题！${liquidityInfo}`,
      sg:`👋 Welcome to Fitia Pro! I'm your AI assistant.\n\n🏗️ 4 revolutionary visions: Mining • Finance • Shop • Store\n\n💬 Ask me anything!${liquidityInfo}`
    };
    return msgs[this.currentLang]||msgs.en;
  }

  generateLocalResponse(msg){
    const m=msg.toLowerCase().replace(/[?!.,;:'"]/g,'').trim();
    const intents=this.detectIntents(m);
    if(intents.length>0)return this.craftResponse(intents[0].intent);
    return this.craftResponse('default');
  }

  detectIntents(m){
    const s=[];
    for(const[intent,data]of Object.entries(CHAT_INTENTS)){
      let sc=0;
      for(const lk of['all',this.currentLang,'en']){
        if(!data.keywords[lk])continue;
        for(const kw of data.keywords[lk]){
          if(m.includes(kw))sc+=(data.weight||1);
        }
      }
      if(sc>0)s.push({intent,score:sc});
    }
    s.sort((a,b)=>b.score-a.score);
    return s;
  }

  craftResponse(intent){
    const L=this.currentLang;
    const conn=!!this.user;
    const ac=this.userMachines?.filter(m=>m.expiresAt>Math.floor(Date.now()/1000)).length||0;
    const nfsHuman=parseFloat(ethers.formatUnits(this.netFtaSold,this.ftaDecimals))||0;

    // Dynamic context for responses
    const ctx={
      power: this.formatHashrate(this.currentRealPower),
      activeCount: ac,
      pending: this.pendingBalance.toFixed(5),
      ftaPrice: this.ftaPriceUsd>0?this.ftaPriceUsd.toFixed(6):'...',
      liquidity: this.netFtaSold===0n?'0 (building)':nfsHuman.toFixed(2)+' FTA',
      wallet: this.user?(this.user.slice(0,6)+'...'+this.user.slice(-4)):'not connected',
      wg: CONFIG.WHATSAPP_GROUP,
      wc: CONFIG.WHATSAPP_CHANNEL
    };

    // ── Dynamic responses (context-aware) ──
    const pick=a=>a[Math.floor(Math.random()*a.length)];

    const R = {
      greeting: {
        en:[`👋 Hello! Welcome to Fitia Pro. ${conn?`You're connected as ${ctx.wallet}. You have ${ctx.activeCount} active machine(s) mining at ${ctx.power}.`:"Connect your wallet to start mining!"} How can I help you today?`],
        fr:[`👋 Bonjour! Bienvenue sur Fitia Pro. ${conn?`Connecté en tant que ${ctx.wallet}. ${ctx.activeCount} machine(s) active(s) à ${ctx.power}.`:"Connectez votre wallet!"} Comment puis-je vous aider?`],
        de:[`👋 Willkommen! ${conn?`Verbunden als ${ctx.wallet}. ${ctx.activeCount} aktive Maschine(n).`:""}`],
        zh:[`👋 你好！欢迎来到Fitia Pro。${conn?`已连接 ${ctx.wallet}。${ctx.activeCount}台活跃矿机，算力${ctx.power}。`:"请连接钱包！"}有什么可以帮您的？`],
        sg:[`👋 Hello! ${conn?`Connected: ${ctx.wallet}. ${ctx.activeCount} active.`:""}`]
      },
      thanks: {
        en:["You're welcome! 😊 Happy mining! If you need anything else, I'm here.", "Glad to help! ⛏️ Keep mining!"],
        fr:["De rien ! 😊 Bon minage !", "Avec plaisir ! ⛏️"]
      },
      goodbye: {
        en:["👋 See you soon! Keep mining! ⛏️", "Bye! Come back anytime. 🚀"],
        fr:["👋 À bientôt ! Bon minage ! ⛏️", "Au revoir ! Revenez quand vous voulez. 🚀"]
      },
      help: {
        en:[`🛠️ *I can help you with:*

⛏️ *Mining:* How to buy machines, batteries, plug in, claim rewards
💱 *Swap:* USDT↔FTA exchange, liquidity, rates
🏗️ *Project:* The 4 visions, tokenomics, roadmap
🚀 *Getting Started:* Step-by-step guide for beginners
🔒 *Security:* Wallet safety, smart contract transparency
💰 *Strategy:* Investment tips, ROI optimization
🌐 *Network:* Polygon info, gas fees, wallet setup

💡 Just type your question — I understand English, French, German, Chinese, and Singapore English!`],
        fr:[`🛠️ *Je peux vous aider avec :*

⛏️ Mining • 💱 Swap • 🏗️ Les 4 visions • 🚀 Guide débutant • 🔒 Sécurité • 💰 Stratégie

💡 Posez votre question — je comprends 5 langues !`]
      },
      price: {
        en:conn?[`📊 *Current Rates:*\n• FTA: ${ctx.ftaPrice} USDT\n• USDT: $1.00\n• POL: ${this.formatUsd(this.polPriceUsd)}\n\n💱 Swap rate updates in real-time via the protocol's bonding curve. Protocol Liquidity: ${ctx.liquidity}`]:["📊 Connect your wallet to see live rates!"],
        fr:conn?[`📊 FTA: ${ctx.ftaPrice} USDT | Liquidité: ${ctx.liquidity}`]:["📊 Connectez-vous!"]
      },
      fta_problems: {
        en:conn?[`⚠️ *FTA Issue Detected*

🔍 Current Protocol Liquidity: *${ctx.liquidity}*

💡 *Solution:*
✅ Use *USDT* to buy machines & batteries — always works
✅ Swap *USDT→FTA* first to build protocol liquidity, then FTA operations will work

The protocol uses a bonding curve — liquidity must be built by the community. Each USDT→FTA swap strengthens the ecosystem for everyone!`]:["⚠️ Connect first to diagnose."],
        fr:conn?[`⚠️ Liquidité actuelle: ${ctx.liquidity}\n\n💡 Utilisez USDT pour les achats, ou faites un swap USDT→FTA d'abord.`]:["⚠️ Connectez-vous."]
      },
      referral: {
        en:[`👥 *Referral System*\n\nYour address IS your referral code: ${ctx.wallet}\n\nShare it with friends. When they enter it in the Referral section and make purchases, you earn commissions!\n\n💡 Both of you benefit from the growing ecosystem.`],
        fr:[`👥 Votre code de parrainage: ${ctx.wallet}\n\nPartagez-le !`]
      }
    };

    // Return dynamic response if available
    if(R[intent]&&R[intent][L])return pick(R[intent][L]);
    if(R[intent]&&R[intent]['en'])return pick(R[intent]['en']);

    // ── Static comprehensive responses ──
    if(CHAT_RESPONSES[intent]){
      const resp=CHAT_RESPONSES[intent];
      return resp[L]||resp['en']||resp;
    }

    // ── Fallback ──
    const def=CHAT_RESPONSES['default'];
    return def[L]||def['en']||"I'm here to help with Fitia Pro! Ask me about mining, swap, the 4 visions, or how to get started.";
  }
}

const App=new Application();
window.onload=()=>App.init();
