/**
 * FITIA PRO MINER — app.js v5
 * ==============================================================
/* ═════════════════════════════════════════════════════════════
   CONFIG
   ═════════════════════════════════════════════════════════════ */
const CONFIG = {
  MINING:          "0xa70147A41F10e84D25A97997d7e2507096F86BAD",
  USDT:            "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
  FTA:             "0x5c418b12c7e9c2A8e9A71A68c6d9b319E7B1d1fd",
  CHAIN_ID:        137,
  WC_PROJECT_ID:   "2c10ee910a836551fbabbf7c8cc4542a",
  API_BASE:        "http://localhost:3001",  // Backend server URL
  WHATSAPP_GROUP:   "https://chat.whatsapp.com/BDsvPCB6xp8H8X0YaRmPFP",
  WHATSAPP_CHANNEL: "https://whatsapp.com/channel/0029VbCQhI38PgsPLbBJdV1e"
};

/* ═════════════════════════════════════════════════════════════
   i18n
   ═════════════════════════════════════════════════════════════ */
const i18n = {
en: {
  // Nav
  connect:"Connect",home:"Home",shop:"Shop",assets:"Wallet",swapNav:"Swap",historyNav:"History",
  // Dashboard
  refTitle:"👥 Referral System",refDesc:"Enter your referrer's address to link.",bindRef:"BIND",
  power:"POWER",ftaSec:"Hashrate",pending:"PENDING",fta:"FTA",miningActive:"MINING ACTIVE",
  noMachine:"NO MACHINE",claim:"CLAIM",totalBal:"Total Balance",
  // Shop
  shopTitle:"⛏️ Shop",machines:"Machines",batteries:"Batteries",buy:"BUY",
  // Assets
  myAssets:"⚙️ Wallet & Assets",walletBal:"💰 Balances",
  plugMachine:"🔌 Plug in a machine",plugDesc:"Enter your offline machine ID and choose a battery.",
  machineId:"Machine ID (0, 1...)",plug:"PLUG IN ⚡",
  activeMachines:"⛏️ Active Machines",myMachines:"⛏️ My Machines",myBatteries:"🔋 My Batteries",
  active:"Active",expired:"Expired",inactive:"Inactive",available:"Available",
  plugged:"Plugged",notPlugged:"Not Plugged",timeRemaining:"Remaining",
  noMachines:"No machines yet",noBatteries:"No batteries yet",batteryLabel:"Battery",
  noActiveMachines:"No active machines",
  // Profile
  saveProfile:"💾 Save Profile",invested:"Invested",earned:"Earned",txCount:"Tx",
  // Swap
  swapTitle:"💱 Swap",youPay:"You pay",balance:"Balance:",youReceive:"You receive",swap:"SWAP",
  currentRate:"1 FTA = ",usdtPerFta:" USDT",
  exchangeRate:"Exchange Rate",priceImpact:"Price Impact",swapFee:"Swap Fee (4%)",
  minimumReceived:"Minimum Received",slippageTolerance:"Slippage Tolerance",networkFee:"Network Fee",
  liquidityReserve:"Protocol Liquidity (FTA)",liquidityHint:"Backed by smart contract reserves on Polygon",
  // History
  totalTx:"Total",swaps:"Swaps",claims:"Claims",all:"All",
  noHistory:"No transactions yet. Start mining!",noActivity:"No recent activity",
  viewOnPolygon:"View on Polygonscan",
  // Wallet
  send:"Send",receive:"Receive",recipientAddr:"Recipient address (0x...)",amount:"Amount",
  confirmSend:"CONFIRM SEND",receiveHint:"Send only POL, USDT or FTA to this address on Polygon.",
  tapToCopy:"Tap to copy",
  // Loading
  loading:"Loading...",connWallet:"Connecting...",linking:"Linking...",
  buyingMachine:"Buying Machine",approveUsdt:"Approving USDT...",approveFta:"Approving FTA...",
  confirming:"Confirming...",calcFta:"Calculating price...",
  buyingBattery:"Buying Battery",pluggingIn:"Plugging in...",swapping:"Swapping...",
  claiming:"Claiming...",sending:"Sending...",
  // Success
  machineBought:"Machine purchased!",batteryBought:"Battery purchased!",
  pluggedIn:"Machine plugged in! ⚡",swapSuccess:"Swap successful!",
  claimed:"Rewards claimed!",sentSuccess:"Sent successfully!",
  addrCopied:"Address copied!",refLinked:"Referrer linked!",
  profileUpdated:"Profile updated!",
  // Errors
  error:"Error",connFirst:"Connect first",invalidId:"Invalid Machine ID",
  invalidAmount:"Invalid amount",invalidAddr:"Invalid address",
  wcIdMissing:"WalletConnect ID missing!",days:"Days",rig:"RIG",
  errRejected:"Transaction cancelled",errInsufficientFunds:"Insufficient balance",
  errNetwork:"Network error. Please try again.",errTimeout:"Transaction timed out.",
  errContract:"Transaction failed. Please try again.",errGeneric:"An error occurred. Please try again.",
  errAlreadyPending:"A transaction is already pending. Please wait.",
  errNonce:"Transaction nonce error. Please restart the app.",
  errLowLiquidity:"Liquidity too low. Swap USDT→FTA first, then retry.",
  errNoFtaLiquidity:"No FTA liquidity yet. Use USDT or swap USDT→FTA first.",
  errMaxFtaSell:"Cannot sell more than {max} FTA. Swap USDT→FTA first.",
  errSwapRejected:"Swap rejected. Check pool liquidity.",
  errApprovalFailed:"Approval failed. Check wallet balance.",
  useUsdtInstead:"Try USDT — always works.",
},
fr: {
  connect:"Connecter",home:"Accueil",shop:"Boutique",assets:"Wallet",swapNav:"Swap",historyNav:"Historique",
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
  saveProfile:"💾 Sauvegarder",invested:"Investi",earned:"Gagné",txCount:"Tx",
  swapTitle:"💱 Échange",youPay:"Vous payez",balance:"Solde:",youReceive:"Vous recevez",swap:"ÉCHANGER",
  currentRate:"1 FTA = ",usdtPerFta:" USDT",
  exchangeRate:"Taux de change",priceImpact:"Impact prix",swapFee:"Frais (4%)",
  minimumReceived:"Minimum reçu",slippageTolerance:"Tolérance slippage",networkFee:"Frais réseau",
  liquidityReserve:"Liquidité du Protocole (FTA)",liquidityHint:"Garanti par les réserves smart contract sur Polygon",
  totalTx:"Total",swaps:"Swaps",claims:"Réclamations",all:"Tout",
  noHistory:"Aucune transaction. Commencez à miner!",noActivity:"Aucune activité",
  viewOnPolygon:"Voir sur Polygonscan",
  send:"Envoyer",receive:"Recevoir",recipientAddr:"Destinataire (0x...)",amount:"Montant",
  confirmSend:"CONFIRMER ENVOI",receiveHint:"Envoyez POL, USDT ou FTA sur Polygon.",
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
  profileUpdated:"Profil mis à jour!",
  error:"Erreur",connFirst:"Connectez-vous",invalidId:"ID invalide",
  invalidAmount:"Montant invalide",invalidAddr:"Adresse invalide",
  wcIdMissing:"ID WalletConnect manquant!",days:"Jours",rig:"RIG",
  errRejected:"Transaction annulée",errInsufficientFunds:"Solde insuffisant",
  errNetwork:"Erreur réseau.",errTimeout:"Délai expiré.",
  errContract:"Transaction échouée.",errGeneric:"Une erreur est survenue.",
  errAlreadyPending:"Transaction en cours.",errNonce:"Erreur de nonce.",
  errLowLiquidity:"Liquidité trop faible. USDT→FTA d'abord.",
  errNoFtaLiquidity:"Pas de liquidité FTA. Utilisez USDT.",
  errMaxFtaSell:"Max {max} FTA. Swap USDT→FTA d'abord.",
  errSwapRejected:"Échange rejeté.",errApprovalFailed:"Approbation échouée.",
  useUsdtInstead:"Utilisez USDT.",
},
de: {
  connect:"Verbinden",home:"Home",shop:"Shop",assets:"Wallet",swapNav:"Swap",historyNav:"Verlauf",
  refTitle:"👥 Empfehlung",refDesc:"Empfehler-Adresse eingeben.",bindRef:"BINDEN",
  power:"LEISTUNG",ftaSec:"Hashrate",pending:"AUSSTEHEND",fta:"FTA",miningActive:"MINING AKTIV",
  noMachine:"KEINE MASCHINE",claim:"EINFORDERN",totalBal:"Gesamtguthaben",
  shopTitle:"⛏️ Shop",machines:"Maschinen",batteries:"Batterien",buy:"KAUFEN",
  myAssets:"⚙️ Wallet & Assets",walletBal:"💰 Guthaben",
  plugMachine:"🔌 Maschine anschließen",plugDesc:"Offline-Maschine ID.",machineId:"ID (0,1...)",plug:"ANSCHLIESSEN ⚡",
  activeMachines:"⛏️ Aktive Maschinen",myMachines:"⛏️ Meine Maschinen",myBatteries:"🔋 Meine Batterien",
  active:"Aktiv",expired:"Abgelaufen",inactive:"Inaktiv",available:"Verfügbar",
  plugged:"Angeschlossen",notPlugged:"Nicht angeschlossen",timeRemaining:"Verbleibend",
  noMachines:"Keine Maschinen",noBatteries:"Keine Batterien",batteryLabel:"Batterie",
  noActiveMachines:"Keine aktiven Maschinen",
  saveProfile:"💾 Speichern",invested:"Investiert",earned:"Verdient",txCount:"Tx",
  swapTitle:"💱 Tausch",youPay:"Sie zahlen",balance:"Guthaben:",youReceive:"Sie erhalten",swap:"TAUSCHEN",
  currentRate:"1 FTA = ",usdtPerFta:" USDT",
  exchangeRate:"Wechselkurs",priceImpact:"Preisauswirkung",swapFee:"Gebühr (4%)",
  minimumReceived:"Mindestbetrag",slippageTolerance:"Slippage",networkFee:"Netzwerkgebühr",
  liquidityReserve:"Protokoll-Liquidität (FTA)",liquidityHint:"Durch Smart-Contract-Reserven gesichert",
  totalTx:"Gesamt",swaps:"Swaps",claims:"Claims",all:"Alle",
  noHistory:"Keine Transaktionen.",noActivity:"Keine Aktivität",
  viewOnPolygon:"Auf Polygonscan",
  send:"Senden",receive:"Empfangen",recipientAddr:"Empfänger (0x...)",amount:"Betrag",
  confirmSend:"SENDUNG BESTÄTIGEN",receiveHint:"POL, USDT oder FTA auf Polygon.",
  tapToCopy:"Zum Kopieren tippen",
  loading:"Laden...",connWallet:"Verbindung...",linking:"Verknüpfung...",
  buyingMachine:"Maschine kaufen",approveUsdt:"USDT genehmigen...",approveFta:"FTA genehmigen...",
  confirming:"Bestätigung...",calcFta:"Preis berechnen...",
  buyingBattery:"Batterie kaufen",pluggingIn:"Anschließen...",swapping:"Tauschen...",
  claiming:"Einforderung...",sending:"Senden...",
  machineBought:"Maschine gekauft!",batteryBought:"Batterie gekauft!",
  pluggedIn:"Angeschlossen! ⚡",swapSuccess:"Tausch erfolgreich!",
  claimed:"Eingefordert!",sentSuccess:"Gesendet!",
  addrCopied:"Kopiert!",refLinked:"Empfehler verknüpft!",
  profileUpdated:"Profil aktualisiert!",
  error:"Fehler",connFirst:"Zuerst verbinden",invalidId:"Ungültige ID",
  invalidAmount:"Ungültiger Betrag",invalidAddr:"Ungültige Adresse",
  wcIdMissing:"WalletConnect-ID fehlt!",days:"Tage",rig:"RIG",
  errRejected:"Transaktion abgebrochen",errInsufficientFunds:"Unzureichendes Guthaben",
  errNetwork:"Netzwerkfehler.",errTimeout:"Zeitüberschreitung.",
  errContract:"Transaktion fehlgeschlagen.",errGeneric:"Ein Fehler.",
  errAlreadyPending:"Transaktion ausstehend.",errNonce:"Nonce-Fehler.",
  errLowLiquidity:"Liquidität zu niedrig.",errNoFtaLiquidity:"Keine FTA-Liquidität.",
  errMaxFtaSell:"Max {max} FTA.",errSwapRejected:"Tausch abgelehnt.",
  errApprovalFailed:"Genehmigung fehlgeschlagen.",useUsdtInstead:"USDT verwenden.",
},
zh: {
  connect:"连接",home:"首页",shop:"商店",assets:"钱包",swapNav:"兑换",historyNav:"历史",
  refTitle:"👥 推荐系统",refDesc:"输入推荐人地址。",bindRef:"绑定",
  power:"算力",ftaSec:"Hashrate",pending:"待领取",fta:"FTA",miningActive:"挖矿中",
  noMachine:"无机器",claim:"领取",totalBal:"总余额",
  shopTitle:"⛏️ 商店",machines:"矿机",batteries:"电池",buy:"购买",
  myAssets:"⚙️ 钱包与资产",walletBal:"💰 余额",
  plugMachine:"🔌 插入机器",plugDesc:"输入机器ID。",machineId:"ID (0,1...)",plug:"插入 ⚡",
  activeMachines:"⛏️ 运行中",myMachines:"⛏️ 我的矿机",myBatteries:"🔋 我的电池",
  active:"运行中",expired:"已过期",inactive:"未激活",available:"可用",
  plugged:"已插入",notPlugged:"未插入",timeRemaining:"剩余",
  noMachines:"暂无矿机",noBatteries:"暂无电池",batteryLabel:"电池",
  noActiveMachines:"无运行中矿机",
  saveProfile:"💾 保存",invested:"投资",earned:"收益",txCount:"交易",
  swapTitle:"💱 兑换",youPay:"支付",balance:"余额:",youReceive:"收到",swap:"兑换",
  currentRate:"1 FTA = ",usdtPerFta:" USDT",
  exchangeRate:"汇率",priceImpact:"价格影响",swapFee:"手续费 (4%)",
  minimumReceived:"最低收到",slippageTolerance:"滑点容忍度",networkFee:"网络费",
  liquidityReserve:"协议流动性 (FTA)",liquidityHint:"由Polygon智能合约储备保障",
  totalTx:"总计",swaps:"兑换",claims:"领取",all:"全部",
  noHistory:"暂无交易记录。",noActivity:"暂无活动",
  viewOnPolygon:"查看交易",
  send:"发送",receive:"接收",recipientAddr:"接收方 (0x...)",amount:"金额",
  confirmSend:"确认发送",receiveHint:"仅发送POL/USDT/FTA到Polygon地址。",
  tapToCopy:"点击复制",
  loading:"加载中...",connWallet:"连接中...",linking:"绑定中...",
  buyingMachine:"购买机器",approveUsdt:"授权USDT...",approveFta:"授权FTA...",
  confirming:"确认中...",calcFta:"计算价格...",
  buyingBattery:"购买电池",pluggingIn:"插入中...",swapping:"兑换中...",
  claiming:"领取中...",sending:"发送中...",
  machineBought:"购买成功！",batteryBought:"电池购买成功！",
  pluggedIn:"插入成功！⚡",swapSuccess:"兑换成功！",
  claimed:"奖励已领取！",sentSuccess:"发送成功！",
  addrCopied:"已复制！",refLinked:"绑定成功！",
  profileUpdated:"资料已更新！",
  error:"错误",connFirst:"请先连接",invalidId:"无效ID",
  invalidAmount:"无效金额",invalidAddr:"无效地址",
  wcIdMissing:"缺少WalletConnect ID！",days:"天",rig:"矿机",
  errRejected:"交易已取消",errInsufficientFunds:"余额不足",
  errNetwork:"网络错误。",errTimeout:"超时。",
  errContract:"交易失败。",errGeneric:"发生错误。",
  errAlreadyPending:"交易待处理。",errNonce:"Nonce错误。",
  errLowLiquidity:"流动性不足。",errNoFtaLiquidity:"无FTA流动性。",
  errMaxFtaSell:"最多{max}FTA。",errSwapRejected:"兑换被拒绝。",
  errApprovalFailed:"授权失败。",useUsdtInstead:"请用USDT。",
},
sg: {
  connect:"Connect",home:"Home",shop:"Shop",assets:"Wallet",swapNav:"Swap",historyNav:"History",
  refTitle:"👥 Referral System",refDesc:"Enter referrer's address.",bindRef:"BIND",
  power:"POWER",ftaSec:"Hashrate",pending:"PENDING",fta:"FTA",miningActive:"MINING ACTIVE",
  noMachine:"NO MACHINE",claim:"CLAIM",totalBal:"Total Balance",
  shopTitle:"⛏️ Shop",machines:"Machines",batteries:"Batteries",buy:"BUY",
  myAssets:"⚙️ Wallet & Assets",walletBal:"💰 Balances",
  plugMachine:"🔌 Plug in",plugDesc:"Enter offline machine ID.",machineId:"ID (0,1...)",plug:"PLUG IN ⚡",
  activeMachines:"⛏️ Active",myMachines:"⛏️ My Machines",myBatteries:"🔋 My Batteries",
  active:"Active",expired:"Expired",inactive:"Inactive",available:"Available",
  plugged:"Plugged",notPlugged:"Not Plugged",timeRemaining:"Remaining",
  noMachines:"No machines",noBatteries:"No batteries",batteryLabel:"Battery",
  noActiveMachines:"No active machines",
  saveProfile:"💾 Save",invested:"Invested",earned:"Earned",txCount:"Tx",
  swapTitle:"💱 Swap",youPay:"You pay",balance:"Balance:",youReceive:"You receive",swap:"SWAP",
  currentRate:"1 FTA = ",usdtPerFta:" USDT",
  exchangeRate:"Exchange Rate",swapFee:"Swap Fee (4%)",
  minimumReceived:"Min Received",slippageTolerance:"Slippage",networkFee:"Network Fee",
  liquidityReserve:"Protocol Liquidity (FTA)",liquidityHint:"Backed by smart contract reserves",
  totalTx:"Total",swaps:"Swaps",claims:"Claims",all:"All",
  noHistory:"No transactions yet.",noActivity:"No activity",
  viewOnPolygon:"View on Polygonscan",
  send:"Send",receive:"Receive",recipientAddr:"Recipient (0x...)",amount:"Amount",
  confirmSend:"CONFIRM SEND",receiveHint:"Only POL/USDT/FTA on Polygon.",
  tapToCopy:"Tap to copy",
  loading:"Loading...",connWallet:"Connecting...",linking:"Linking...",
  buyingMachine:"Buying",approveUsdt:"Approving USDT...",approveFta:"Approving FTA...",
  confirming:"Confirming...",calcFta:"Calculating...",
  buyingBattery:"Buying Battery",pluggingIn:"Plugging...",swapping:"Swapping...",
  claiming:"Claiming...",sending:"Sending...",
  machineBought:"Machine bought!",batteryBought:"Battery bought!",
  pluggedIn:"Plugged in! ⚡",swapSuccess:"Swap success!",
  claimed:"Rewards claimed!",sentSuccess:"Sent!",
  addrCopied:"Copied!",refLinked:"Linked!",
  profileUpdated:"Profile updated!",
  error:"Error",connFirst:"Connect first",invalidId:"Invalid ID",
  invalidAmount:"Invalid amount",invalidAddr:"Invalid address",
  wcIdMissing:"WC ID missing!",days:"Days",rig:"RIG",
  errRejected:"Cancelled",errInsufficientFunds:"Insufficient balance",
  errNetwork:"Network error.",errTimeout:"Timeout.",
  errContract:"Transaction failed.",errGeneric:"An error occurred.",
  errAlreadyPending:"Pending.",errNonce:"Nonce error.",
  errLowLiquidity:"Low liquidity.",errNoFtaLiquidity:"No FTA liquidity.",
  errMaxFtaSell:"Max {max} FTA.",errSwapRejected:"Swap rejected.",
  errApprovalFailed:"Approval failed.",useUsdtInstead:"Try USDT.",
}
};

/* ═════════════════════════════════════════════════════════════
   CHAT INTENTS + RESPONSES (abbreviated for space — kept intact)
   ═════════════════════════════════════════════════════════════ */
const CHAT_INTENTS = {
  what_is_fitia:{weight:5,keywords:{all:['what is fitia','c quoi fitia','fitia c quoi','about fitia','explain fitia','fitia pro','fitia project','présente fitia','介绍','fitia是什么']}},
  four_visions:{weight:5,keywords:{all:['4 vision','4 visions','four vision','four visions','fitia mining','fitia finance','fitia shop','fitia store','quatre vision','4 piliers','4 pillars','四大愿景']}},
  how_mining_works:{weight:4,keywords:{all:['how mining works','explain mining','mine','mining','minage','挖矿','how to mine','how to start mining','comment miner']}},
  machine_info:{weight:3,keywords:{all:['machine','rig','which machine','best machine','quelle machine','哪个矿机','compare machine']}},
  battery_info:{weight:3,keywords:{all:['battery','batterie','电池','battery duration','how long battery','which battery']}},
  plug_and_activate:{weight:3,keywords:{all:['plug in','plug','activate','activer','插入','激活','how to plug','how to activate','brancher']}},
  claim_rewards:{weight:3,keywords:{all:['claim','reward','réclamer','领取','harvest','collect','claim rewards']}},
  how_swap_works:{weight:4,keywords:{all:['swap','exchange','échanger','tausch','兑换','how to swap','swap fta','swap usdt']}},
  tokenomics:{weight:4,keywords:{all:['tokenomics','fta token','fta是什么','what is fta','fta price','fta value','token supply']}},
  liquidity_explanation:{weight:4,keywords:{all:['liquidity','liquidité','liquidity pool','netftasold','protocol liquidity','pool','why fta rejected','pourquoi refusé']}},
  fitia_shop:{weight:3,keywords:{all:['fitia shop','boutique fitia','商店','marketplace','buy machine','acheter machine']}},
  fitia_store:{weight:3,keywords:{all:['fitia store','magasin fitia','电商','ecommerce','merchandise','products']}},
  beginner_guide:{weight:5,keywords:{all:['beginner','débutant','新手','how to start','getting started','commencer','first time','je sais pas','我不知道','premier pas']}},
  what_is_crypto:{weight:4,keywords:{all:['what is crypto','crypto','blockchain','什么是加密','qu est ce que la crypto','c est quoi la crypto']}},
  wallet_setup:{weight:4,keywords:{all:['wallet','metamask','trust wallet','钱包','portefeuille','how to connect','create wallet']}},
  investment_advice:{weight:3,keywords:{all:['invest','investment','investir','投资','roi','profit','gain','strategy','收益','how to earn more']}},
  security:{weight:4,keywords:{all:['security','safe','sécurité','安全','scam','arnaque','is it safe','is it legit']}},
  fitia_revolution:{weight:4,keywords:{all:['revolution','révolution','革命','vision','mission','objective','objectif','fitia goal']}},
  deposit_funds:{weight:3,keywords:{all:['deposit','add funds','fund','充值','how to deposit']}},
  withdraw_earnings:{weight:3,keywords:{all:['withdraw','cash out','提现','retirer','how to withdraw']}},
  network_polygon:{weight:3,keywords:{all:['polygon','matic','pol','network','chain','网络','gas fee','frais']}},
  history_related:{weight:3,keywords:{all:['history','historique','历史','transactions','activity','leaderboard','classement','排名']}},
  greeting:{weight:1,keywords:{all:['hello','hi','hey','hola','bonjour','salut','hallo','你好']}},
  goodbye:{weight:1,keywords:{all:['bye','goodbye','see you','au revoir','tschüss','再见']}},
  thanks:{weight:1,keywords:{all:['thanks','thank you','thx','ty','merci','danke','谢谢']}},
  help:{weight:2,keywords:{all:['help','aide','hilfe','帮助','guide']}},
  referral:{weight:2,keywords:{all:['referral','parrain','推荐','invite']}},
  whatsapp:{weight:2,keywords:{all:['whatsapp','community','group','社群','群']}},
  roadmap:{weight:2,keywords:{all:['roadmap','future','upcoming','plan','路线图']}},
  price:{weight:2,keywords:{all:['price','prix','preis','价格','rate']}},
  fta_problems:{weight:4,keywords:{all:['fta not working','fta rejected','fta failed','cannot buy','cannot swap','refuse','rejected','doesnt work','marche pas','不工作']}}
};

const CHAT_RESPONSES = {
  what_is_fitia:{en:`🪙 *Fitia Pro* is a revolutionary Web3 ecosystem on Polygon — combining crypto mining, DeFi, and e-commerce.\n\n✨ *4 Core Visions:*\n① Fitia Mining — NFT mining machines, earn FTA passively\n② Fitia Finance — DeFi swaps, bonding curve protocol\n③ Fitia Shop — Digital goods marketplace\n④ Fitia Store — E-commerce with FTA payments\n\n🔒 Built on Polygon Mainnet — low fees, transparency, speed.`,fr:`🪙 *Fitia Pro* est un écosystème Web3 révolutionnaire sur Polygon.\n\n✨ *4 Visions:* ① Fitia Mining ② Fitia Finance ③ Fitia Shop ④ Fitia Store\n\n🔒 Polygon Mainnet — frais bas, transparence.`,zh:`🪙 *Fitia Pro* 是Polygon上的革命性Web3生态。✨ 4大愿景：①挖矿 ②金融 ③商城 ④商店。🔒 低费用、透明。`},
  four_visions:{en:`🏗️ *Fitia Pro's 4 Pillars*\n\n⛏️ *① Mining* — NFT machines, earn FTA every second\n💱 *② Finance* — USDT↔FTA swaps via bonding curve\n🛒 *③ Shop* — Digital marketplace for mining gear\n🏪 *④ Store* — E-commerce with FTA payments\n\n🌐 A self-sustaining circular economy where every activity feeds the others.`},
  how_mining_works:{en:`⛏️ *How Mining Works:*\n\n1️⃣ Buy a Machine (Shop tab, USDT recommended)\n2️⃣ Buy a Battery (3-365 days)\n3️⃣ Plug it In (Wallet tab)\n4️⃣ Earn FTA every second\n5️⃣ Claim rewards (gold CLAIM button)\n\n⚡ Higher tier = more power | 🔋 Longer battery = better value/day`,fr:`⛏️ 1️⃣ Achetez Machine 2️⃣ Achetez Batterie 3️⃣ Branchez 4️⃣ Gagnez FTA 5️⃣ Réclamez`},
  how_swap_works:{en:`💱 *Swap USDT↔FTA*\n\n🔹 USDT→FTA: Pay USDT, get FTA. Builds protocol liquidity!\n🔹 FTA→USDT: Sell FTA, get USDT. Needs liquidity > 0.\n\n📊 Protocol uses bonding curve — price adjusts with supply/demand.\n⚠️ If liquidity is 0, swap USDT→FTA first or use USDT to buy machines.`},
  beginner_guide:{en:`🚀 *0 to Mining in 5 min*\n\n📱 1. Install MetaMask → save seed phrase on PAPER\n💰 2. Buy POL + USDT on exchange → send to MetaMask (Polygon!)\n🔗 3. Open Fitia → Connect → approve\n⛏️ 4. Shop → buy Starter MK-I → pay USDT\n🔋 5. Buy 30-day battery → Wallet → Plug in\n🎉 DONE! Mining FTA every second. Tap CLAIM to collect.`,fr:`🚀 1. MetaMask 2. Achetez POL/USDT 3. Connectez 4. Achetez MK-I 5. Batterie+Branchez 🎉`},
  tokenomics:{en:`🪙 *FTA Token*\n\n• Mining reward — earned every second\n• Payment — buy machines, batteries, shop items\n• Swap — trade USDT↔FTA\n• No pre-mine — every FTA is earned\n• Supply grows organically with ecosystem`},
  liquidity_explanation:{en:`💧 *Protocol Liquidity*\n\nShows FTA available in the protocol's bonding curve.\n\n🟢 Green: Healthy — all operations work\n🟡 Yellow: Low — some limits\n🔴 Zero: Building — use USDT or swap USDT→FTA first\n\nEach USDT→FTA swap increases liquidity for everyone.`},
  security:{en:`🛡️ *Is Fitia Safe?*\n\n✅ Smart contract on Polygon — auditable, open-source\n✅ Non-custodial — your funds ALWAYS in your wallet\n✅ All transactions visible on Polygonscan\n⚠️ NEVER share your seed phrase\n⚠️ Crypto is volatile — invest responsibly`},
  fitia_revolution:{en:`⚡ *Why Revolutionary*\n\n🌍 Democratizes mining — no expensive hardware\n🔄 Circular economy — 4 visions feed each other\n🔓 Non-custodial — you control your crypto\n🌱 Organic growth — no pre-mine, community-driven\n\n🚀 Building a new digital economy.`},
  wallet_setup:{en:`🦊 *Wallet Setup*\n\n1. metamask.io → install\n2. Create wallet → WRITE DOWN seed phrase on paper\n3. Never share it!\n4. Add Polygon: RPC polygonal-rpc.com, Chain ID 137, Symbol POL\n5. Buy POL + USDT → withdraw to MetaMask on Polygon`},
  history_related:{en:`📋 *Transaction History*\n\nAll your transactions and activity are tracked in the History tab.\n\n• View all swaps, purchases, claims, sends\n• Filter by type\n• Check status (pending/confirmed)\n• See leaderboard rankings\n• Activity log tracks logins & profile changes\n\n💡 Your history is stored securely — ask me to show you!`},
  deposit_funds:{en:`💰 *Add Funds*\n1. Buy POL+USDT on Binance/Coinbase\n2. Withdraw to your MetaMask address\n3. SELECT POLYGON NETWORK!\n4. Wait 1-3 min\n5. Your address: Wallet tab → Receive`},
  withdraw_earnings:{en:`💸 *Cash Out*\n1. Claim FTA on Home\n2. Swap FTA→USDT (needs liquidity)\n3. Send USDT to exchange on Polygon\n4. Sell USDT → withdraw to bank`},
  whatsapp:{en:`📱 Community: ${CONFIG.WHATSAPP_GROUP}`},
  referral:{en:`👥 Your referral code = your wallet address. Share it!`},
  roadmap:{en:`🗺️ Phase 1 LIVE (mining, swaps, referrals) → Phase 2 (Shop, staking) → Phase 3 (Store, DAO, bridges)`},
  default:{en:`🤔 I'm the Fitia Assistant — ask me about: Mining, Swaps, the 4 Visions, Getting Started, Security, or anything Fitia!`}
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
   API CLIENT
   ═════════════════════════════════════════════════════════════ */
class ApiClient {
  constructor(baseUrl) { this.base = baseUrl; this.token = null; }
  setToken(t) { this.token = t; }

  async call(method, path, body = null) {
    const opts = { method, headers: { 'Content-Type': 'application/json' } };
    if (this.token) opts.headers['Authorization'] = `Bearer ${this.token}`;
    if (body) opts.body = JSON.stringify(body);
    try {
      const res = await fetch(`${this.base}${path}`, opts);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      return data;
    } catch (e) {
      console.warn(`[API] ${method} ${path}:`, e.message);
      return null;
    }
  }

  get(path) { return this.call('GET', path); }
  post(path, body) { return this.call('POST', path, body); }
  put(path, body) { return this.call('PUT', path, body); }
}

/* ═════════════════════════════════════════════════════════════
   APPLICATION
   ═════════════════════════════════════════════════════════════ */
class Application {
  constructor(){
    this.provider=null;this.signer=null;this.contracts={};this.user=null;
    this.payMode='USDT';this.shopViewMode='machines';this.swapDirection='USDT_TO_FTA';
    this.ftaDecimals=18;this.usdtDecimals=6;
    this.currentDifficulty=1n;this.currentRealPower=0;this.pendingBalance=0;this.miningTimer=null;
    this.STORAGE_CLAIM="fitia_last_claim_time_v5";
    this.STORAGE_MACHINES="fitia_machines_v3";
    this.STORAGE_BATTERIES="fitia_batteries_v3";
    this.shopMachinesData=[];this.shopBatteriesData=[];this.isLoadingShop=false;
    this.polPriceUsd=0;this.ftaPriceUsd=0;
    this.userMachines=[];this.userBatteries={};this.userLastClaimTime=0;this.batteryTypeDurations={};
    this.vizContext=null;this.vizBars=[];this.sendTokenSymbol='POL';
    this.chatInitialized=false;this.chatHistory=[];
    this.netFtaSold=0n;
    // API & Auth
    this.api = new ApiClient(CONFIG.API_BASE);
    this.authToken = null;
    this.authSession = null;
    this.profileData = null;
    // History state
    this.historyFilter = 'all';
    this.historyData = [];
    this.historyStats = null;
    this.activityData = [];
    this.leaderboardData = [];
    // Fallback: local tx log
    this.localTxLog = JSON.parse(localStorage.getItem('fitia_tx_log_v1') || '[]');

    const savedLang=localStorage.getItem('fitia_lang');
    this.currentLang=savedLang&&i18n[savedLang]?savedLang:'en';
  }

  /* ── Helpers ──────────────────────────────────────────────── */
  t(key){return i18n[this.currentLang]?.[key]||i18n['en'][key]||key;}
  formatUsd(v){return'$'+v.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});}
  formatHashrate(h){if(h<=0)return'0 H/s';const u=['H/s','KH/s','MH/s','GH/s','TH/s','PH/s'];let v=h,i=0;while(v>=1000&&i<u.length-1){v/=1000;i++;}return v.toFixed(2)+' '+u[i];}
  formatTimeRemaining(s){if(s<=0)return this.t('expired');const d=Math.floor(s/86400),h=Math.floor((s%86400)/3600),m=Math.floor((s%3600)/60);if(d>1)return`${d}d ${h}h`;if(d===1)return`1d ${h}h`;if(h>0)return`${h}h ${m}m`;return`${m}m`;}
  getBatteryDuration(id){if(this.batteryTypeDurations[id]!==undefined)return this.batteryTypeDurations[id];return{0:3,1:7,2:15,3:30,4:90,5:180,6:270,7:365}[id]||30;}
  _loadLocalAssets(){try{this.userMachines=JSON.parse(localStorage.getItem(this.STORAGE_MACHINES))||[];}catch(e){this.userMachines=[];}try{this.userBatteries=JSON.parse(localStorage.getItem(this.STORAGE_BATTERIES))||{};}catch(e){this.userBatteries={};}try{this.userLastClaimTime=parseInt(localStorage.getItem(this.STORAGE_CLAIM))||Math.floor(Date.now()/1000);}catch(e){this.userLastClaimTime=Math.floor(Date.now()/1000);}}
  _saveLocalAssets(){localStorage.setItem(this.STORAGE_MACHINES,JSON.stringify(this.userMachines));localStorage.setItem(this.STORAGE_BATTERIES,JSON.stringify(this.userBatteries));localStorage.setItem(this.STORAGE_CLAIM,String(this.userLastClaimTime||Math.floor(Date.now()/1000)));}

  // ── Local Tx Log ───────────────────────────────────────────
  _logLocalTx(tx) {
    this.localTxLog.unshift({ ...tx, timestamp: Date.now() });
    if (this.localTxLog.length > 200) this.localTxLog.length = 200;
    localStorage.setItem('fitia_tx_log_v1', JSON.stringify(this.localTxLog));
  }

  // ── API: Record Transaction ────────────────────────────────
  async recordTransaction(type, tokenFrom, tokenTo, amountFrom, amountTo, txHash, metadata) {
    // Local fallback always works
    this._logLocalTx({ type, tokenFrom, tokenTo, amountFrom, amountTo, txHash, metadata });
    // Try API
    if (this.authToken) {
      await this.api.post('/api/transactions', { type, tokenFrom, tokenTo, amountFrom, amountTo, txHash, metadata });
    }
  }

  // ── API: Record Activity ───────────────────────────────────
  async recordActivity(action, details) {
    if (this.authToken) {
      await this.api.post('/api/activity', { action, details });
    }
  }

  // ── Auth: Wallet Signature ──────────────────────────────────
  async authenticate() {
    if (!this.user || !this.signer) return;
    try {
      // Check existing session first
      const savedToken = localStorage.getItem('fitia_auth_token');
      if (savedToken) {
        this.api.setToken(savedToken);
        const check = await this.api.get('/api/auth/session');
        if (check && check.valid) {
          this.authToken = savedToken;
          this.authSession = check;
          this.profileData = check.user;
          this.updateProfileUI();
          console.log('[Auth] Session restored');
          return;
        }
        localStorage.removeItem('fitia_auth_token');
      }

      // Request challenge
      const challengeRes = await this.api.post('/api/auth/challenge', { walletAddress: this.user });
      if (!challengeRes) return;

      // Sign challenge
      const signature = await this.signer.signMessage(challengeRes.challenge);

      // Login
      const loginRes = await this.api.post('/api/auth/login', {
        walletAddress: this.user,
        signature,
        challenge: challengeRes.challenge
      });

      if (loginRes && loginRes.token) {
        this.authToken = loginRes.token;
        this.authSession = loginRes;
        this.profileData = loginRes.user;
        this.api.setToken(this.authToken);
        localStorage.setItem('fitia_auth_token', this.authToken);
        this.updateProfileUI();
        console.log('[Auth] Logged in', loginRes.isNewUser ? '(new user)' : '');
        this.recordActivity(loginRes.isNewUser ? 'register' : 'login', 'Wallet authenticated');
      }
    } catch (e) {
      console.warn('[Auth] Authentication skipped:', e.message);
    }
  }

  updateProfileUI() {
    const p = this.profileData;
    if (!p) return;
    document.getElementById('profile-name').innerText = p.username || 'Miner';
    document.getElementById('profile-level').innerText = `Level ${p.level || 0}`;
    document.getElementById('profile-addr').innerText = (p.walletAddress || '').slice(0,8)+'...';
    document.getElementById('ps-invested').innerText = this.formatUsd(p.totalInvested || 0);
    document.getElementById('ps-earned').innerText = this.formatUsd(p.totalEarned || 0);
    document.getElementById('ps-machines').innerText = p.machinesCount || 0;
    document.getElementById('ps-txs').innerText = this.historyStats?.total || this.localTxLog.length;
    document.getElementById('btn-profile-edit').style.display = 'flex';
    document.getElementById('profile-avatar').innerText = '🔷';
  }

  toggleProfileEdit() {
    const form = document.getElementById('profile-edit-form');
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

    const apiRes = await this.api.put('/api/user/profile', { username, email });
    if (apiRes && apiRes.user) {
      this.profileData = apiRes.user;
      this.updateProfileUI();
      this.showToast(this.t('profileUpdated'));
      document.getElementById('profile-edit-form').classList.add('hidden');
    } else {
      // Offline mode: save locally
      localStorage.setItem('fitia_profile', JSON.stringify({ username, email }));
      this.profileData = { ...(this.profileData||{}), username, email };
      this.updateProfileUI();
      this.showToast(this.t('profileUpdated'));
      document.getElementById('profile-edit-form').classList.add('hidden');
    }
  }

  /* ── Language ──────────────────────────────────────────────── */
  setLanguage(lang){if(!i18n[lang])return;this.currentLang=lang;localStorage.setItem('fitia_lang',lang);const f={en:'🇬🇧',fr:'🇫🇷',de:'🇩🇪',zh:'🇨🇳',sg:'🇸🇬'};document.getElementById('lang-btn-display').innerText=`${f[lang]} ${lang.toUpperCase()}`;this.applyTranslations();this.renderShop();}
  applyTranslations(){
    const st=(s,k)=>{const e=document.querySelector(s);if(e)e.innerText=this.t(k);};
    st('#btn-connect','connect');st('.total-balance-card small','totalBal');
    st('#view-swap .view-title','swapTitle');
    st('.liquidity-reserve-box .liquidity-label span:last-child','liquidityReserve');
    st('.liquidity-info-hint','liquidityHint');
    document.querySelectorAll('.nav-item span').forEach((s,i)=>s.innerText=this.t(['home','shop','assets','swapNav','historyNav'][i]));
    // Apply data-i18n-placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{
      const k=el.getAttribute('data-i18n-placeholder');el.placeholder=this.t(k);
    });
  }
  async init(){this.setLanguage(this.currentLang);}

  /* ── Prices ────────────────────────────────────────────────── */
  async fetchMarketPrices(){
    this.polPriceUsd=0;
    try{const r=await fetch('https://api.dexscreener.com/latest/dex/tokens/0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0');const d=await r.json();if(d.pairs?.length)this.polPriceUsd=parseFloat(d.pairs[0].priceUsd)||0;}catch(e){}
    if(!this.polPriceUsd){try{const r=await fetch('https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd');const d=await r.json();this.polPriceUsd=d['matic-network']?.usd||0;}catch(e2){}}
    if(!this.polPriceUsd)this.polPriceUsd=0.70;
  }

  /* ── Connect ───────────────────────────────────────────────── */
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
        await this.initContracts();
        window.ethereum.on('accountsChanged',()=>window.location.reload());
        window.ethereum.on('chainChanged',()=>window.location.reload());
      }catch(e){this.showError(e);}finally{this.setLoader(false);}
    }else if(typeof EthereumProvider!=='undefined'&&CONFIG.WC_PROJECT_ID&&!CONFIG.WC_PROJECT_ID.includes("...")){
      this.setLoader(true,this.t('connWallet'));
      try{
        const wc=await EthereumProvider.init({projectId:CONFIG.WC_PROJECT_ID,chains:[CONFIG.CHAIN_ID],showQrModal:true,methods:['eth_sendTransaction','personal_sign'],metadata:{name:'FITIA PRO MINER',description:'Mining DApp',url:window.location.origin,icons:[window.location.origin+'/logo.png']}});
        await wc.enable();this.provider=new ethers.BrowserProvider(wc);this.signer=await this.provider.getSigner();
        this.user=await this.signer.getAddress();await this.initContracts();
        wc.on("disconnect",()=>window.location.reload());
      }catch(e){this.showError(e);}finally{this.setLoader(false);}
    }else{this.showToast(CONFIG.WC_PROJECT_ID?.includes("...")?this.t('wcIdMissing'):"Please install MetaMask or use a Web3 browser.",true);}
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

    // Load offline profile
    try{const lp=JSON.parse(localStorage.getItem('fitia_profile'));if(lp)this.profileData=lp;}catch(e){}

    await this.fetchMarketPrices();await this.cacheBatteryDurations();await this.updateData();
    setInterval(()=>this.updateData(),15000);
    this.initVisualizer();window.addEventListener('resize',()=>this.resizeCanvas());

    // Authenticate with backend (non-blocking)
    setTimeout(()=>this.authenticate(),500);
    // Refresh history in background
    setTimeout(()=>this.refreshHistory(),2000);
    setInterval(()=>this.refreshHistory(),60000);
  }

  async switchNetwork(){try{await window.ethereum.request({method:'wallet_switchEthereumChain',params:[{chainId:'0x89'}]});}catch(e){if(e.code===4902){await window.ethereum.request({method:'wallet_addEthereumChain',params:[{chainId:'0x89',chainName:'Polygon',nativeCurrency:{name:'MATIC',symbol:'MATIC',decimals:18},rpcUrls:['https://polygon-rpc.com/'],blockExplorerUrls:['https://polygonscan.com/']}]});}}}
  async cacheBatteryDurations(){try{const c=Number(await this.contracts.mining.getBatteryCount());for(let i=0;i<c;i++){try{const b=await this.contracts.mining.batteryTypes(i);this.batteryTypeDurations[i]=Number(b.duration)/86400;}catch(e){}}}catch(e){}}

  /* ═══════════ DATA REFRESH ══════════════════════════════════ */
  async updateData(){
    if(!this.user)return;
    try{
      const rawPower=await this.contracts.mining.getActivePower(this.user);this.currentRealPower=Number(rawPower);
      try{this.currentDifficulty=BigInt(await this.contracts.mining.difficultyMultiplier());}catch(e){}
      try{this.netFtaSold=BigInt(await this.contracts.mining.netFtaSold());}catch(e){}

      const now=Math.floor(Date.now()/1000),elapsed=now-this.userLastClaimTime;
      if(this.currentRealPower>0&&elapsed>0){
        const rps=(this.currentRealPower*Number(this.currentDifficulty))/1e18;this.pendingBalance=rps*elapsed;
        document.getElementById('val-pending').innerText=this.pendingBalance.toFixed(5);
        document.getElementById('viz-status').innerText=this.t('miningActive');document.getElementById('viz-status').style.color="var(--primary)";
      }else{this.pendingBalance=0;document.getElementById('val-pending').innerText="0.00000";document.getElementById('viz-status').innerText=this.t('noMachine');document.getElementById('viz-status').style.color="#666";}
      this.updateVisualizerIntensity(this.currentRealPower);
      if(this.currentRealPower>0){if(!this.miningTimer)this.startMiningCounter();}else{this.stopMiningCounter();}
      document.getElementById('val-power').innerText=this.formatHashrate(this.currentRealPower);

      const polBal=await this.provider.getBalance(this.user);
      const usdtBal=await this.contracts.usdt.balanceOf(this.user);
      const ftaBal=await this.contracts.fta.balanceOf(this.user);
      const pB=parseFloat(ethers.formatUnits(polBal,18)),uB=parseFloat(ethers.formatUnits(usdtBal,this.usdtDecimals)),fB=parseFloat(ethers.formatUnits(ftaBal,this.ftaDecimals));
      document.getElementById('bal-pol-2').innerText=pB.toFixed(4);document.getElementById('bal-usdt-2').innerText=uB.toFixed(2);document.getElementById('bal-fta-2').innerText=fB.toFixed(4);
      const rate=await this.contracts.mining.getCurrentRate();this.ftaPriceUsd=parseFloat(ethers.formatUnits(rate,this.ftaDecimals));
      document.getElementById('price-pol').innerText=this.formatUsd(this.polPriceUsd);document.getElementById('price-usdt').innerText=this.formatUsd(1);document.getElementById('price-fta').innerText=this.formatUsd(this.ftaPriceUsd);
      document.getElementById('bal-pol-2-usd').innerText='≈ '+this.formatUsd(pB*this.polPriceUsd);document.getElementById('bal-usdt-2-usd').innerText='≈ '+this.formatUsd(uB);document.getElementById('bal-fta-2-usd').innerText='≈ '+this.formatUsd(fB*this.ftaPriceUsd);
      document.getElementById('val-total-usd').innerText=this.formatUsd(pB*this.polPriceUsd+uB+fB*this.ftaPriceUsd);
      document.getElementById('swap-rate').innerText=this.t('currentRate')+this.ftaPriceUsd.toFixed(6)+this.t('usdtPerFta');

      const nfsEl=document.getElementById('net-fta-sold-display');
      if(nfsEl){const nfsHuman=parseFloat(ethers.formatUnits(this.netFtaSold,this.ftaDecimals));nfsEl.innerText=nfsHuman.toFixed(4)+' FTA';nfsEl.className='liquidity-value';if(this.netFtaSold===0n)nfsEl.classList.add('none');else if(nfsHuman<100)nfsEl.classList.add('low');else nfsEl.classList.add('high');}

      const fromDec=this.swapDirection==='USDT_TO_FTA'?this.usdtDecimals:this.ftaDecimals,toDec=this.swapDirection==='USDT_TO_FTA'?this.ftaDecimals:this.usdtDecimals;
      document.getElementById('swap-bal-from').innerText=parseFloat(ethers.formatUnits(this.swapDirection==='USDT_TO_FTA'?usdtBal:ftaBal,fromDec)).toFixed(4);
      document.getElementById('swap-bal-to').innerText=parseFloat(ethers.formatUnits(this.swapDirection==='USDT_TO_FTA'?ftaBal:usdtBal,toDec)).toFixed(4);

      await this.renderShop();this.renderActiveMachines();this.renderUserMachines();this.renderUserBatteries();
      if(document.getElementById('swap-from-in').value)this.calcSwap();
    }catch(e){console.error("Refresh Error",e);}
  }

  startMiningCounter(){if(this.miningTimer)return;this.miningTimer=setInterval(()=>{if(this.currentRealPower>0){const rps=(this.currentRealPower*Number(this.currentDifficulty))/1e18;this.pendingBalance+=rps;document.getElementById('val-pending').innerText=this.pendingBalance.toFixed(5);}},1000);}
  stopMiningCounter(){if(this.miningTimer){clearInterval(this.miningTimer);this.miningTimer=null;}}

  /* ── Referral ──────────────────────────────────────────────── */
  async bindReferrer(){const a=document.getElementById('ref-address-input').value.trim();if(!ethers.isAddress(a))return this.showToast(this.t('invalidAddr'),true);this.setLoader(true,this.t('linking'));try{const tx=await this.contracts.mining.setReferrer(a);await tx.wait();this.showToast(this.t('refLinked'));document.getElementById('ref-address-input').value='';this.recordTransaction('referral','','','','',tx.hash,{});}catch(e){this.showError(e);}this.setLoader(false);}

  /* ── Shop ──────────────────────────────────────────────────── */
  setPayMode(m){this.payMode=m;document.getElementById('btn-pay-usdt').classList.toggle('active',m==='USDT');document.getElementById('btn-pay-fta').classList.toggle('active',m==='FTA');this.renderShop();}
  setShopView(v){this.shopViewMode=v;document.querySelectorAll('.shop-tab').forEach(t=>t.classList.remove('active'));if(event?.currentTarget)event.currentTarget.classList.add('active');this.renderShop();}
  async renderShop(){if(this.isLoadingShop)return;const c=document.getElementById('shop-list');if(this.shopViewMode==='machines'){if(!this.shopMachinesData.length)await this.fetchMachines();this._renderShopMachinesHTML(c);}else{if(!this.shopBatteriesData.length)await this.fetchBatteries();this._renderShopBatteriesHTML(c);}}
  async fetchMachines(){this.isLoadingShop=true;try{const cnt=Number(await this.contracts.mining.getMachineCount());const p=[];for(let i=0;i<cnt;i++)p.push(this.contracts.mining.machineTypes(i));const r=await Promise.all(p);this.shopMachinesData=[];for(let i=0;i<cnt;i++){const d=r[i];this.shopMachinesData.push({price:parseFloat(ethers.formatUnits(d.price,this.usdtDecimals)),power:Number(d.power),priceRaw:d.price});}}catch(e){console.error("fetchMachines",e);}this.isLoadingShop=false;}
  async fetchBatteries(){this.isLoadingShop=true;try{const cnt=Number(await this.contracts.mining.getBatteryCount());const p=[];for(let i=0;i<cnt;i++)p.push(this.contracts.mining.batteryTypes(i));const r=await Promise.all(p);this.shopBatteriesData=[];for(let i=0;i<cnt;i++){const d=r[i];this.shopBatteriesData.push({price:parseFloat(ethers.formatUnits(d.price,this.usdtDecimals)),days:Number(d.duration)/86400,priceRaw:d.price});}}catch(e){console.error("fetchBatteries",e);}this.isLoadingShop=false;}

  /* ═══════════ BUY MACHINE ═══════════════════════════════════ */
  async buyMachine(id){
    if(!this.user)return this.connect();
    const m=this.shopMachinesData[id];
    this.setLoader(true,`${this.t('buyingMachine')} (${this.payMode})...`);
    try{
      let tx;
      if(this.payMode==='USDT'){
        const al=await this.contracts.usdt.allowance(this.user,CONFIG.MINING);
        if(al<m.priceRaw){this.setLoader(true,this.t('approveUsdt'));await(await this.contracts.usdt.approve(CONFIG.MINING,m.priceRaw)).wait();}
        this.setLoader(true,this.t('confirming'));tx=await this.contracts.mining.buyMachine(id);await tx.wait();
        this.recordTransaction('buy_machine','USDT','',m.price,'',tx.hash,{machineTypeId:id,machineTier:id+1});
      }else{
        if(this.netFtaSold===0n){this.showToast(this.t('errNoFtaLiquidity')+' '+this.t('useUsdtInstead'),true);this.setLoader(false);return;}
        let fc;try{fc=await this.contracts.mining.getFtaCostForUsdtSell(m.priceRaw);}catch(viewErr){this.showToast(this.t('errLowLiquidity'),true);this.setLoader(false);return;}
        if(fc===0n){this.showToast(this.t('errLowLiquidity'),true);this.setLoader(false);return;}
        const ftExact=Number(ethers.formatUnits(fc*100n/89n,this.ftaDecimals)),ftApprove=Number(ethers.formatUnits(fc*13n/10n,this.ftaDecimals));
        const al=await this.contracts.fta.allowance(this.user,CONFIG.MINING);
        if(al<fc*13n/10n){this.setLoader(true,this.t('approveFta'));try{await(await this.contracts.fta.approve(CONFIG.MINING,fc*13n/10n)).wait();}catch(apErr){this.showToast(this.t('errApprovalFailed'),true);this.setLoader(false);return;}}
        this.setLoader(true,this.t('confirming'));tx=await this.contracts.mining.buyMachineWithFTA(id);await tx.wait();
        try{this.netFtaSold=BigInt(await this.contracts.mining.netFtaSold());}catch(e){}
        this.recordTransaction('buy_machine','FTA','',ftExact,'',tx.hash,{machineTypeId:id,machineTier:id+1,ftaCost:ftExact});
      }
      this.userMachines.push({typeId:id,expiresAt:0,pluggedBatteryType:null,boughtAt:Math.floor(Date.now()/1000)});
      this._saveLocalAssets();this.showToast(this.t('machineBought'));this.shopMachinesData=[];this.updateData();
    }catch(e){this.showError(e);}this.setLoader(false);
  }

  /* ═══════════ BUY BATTERY ═══════════════════════════════════ */
  async buyBattery(id){
    if(!this.user)return this.connect();
    const b=this.shopBatteriesData[id];
    this.setLoader(true,`${this.t('buyingBattery')} (${this.payMode})...`);
    try{
      let tx;
      if(this.payMode==='USDT'){
        const al=await this.contracts.usdt.allowance(this.user,CONFIG.MINING);
        if(al<b.priceRaw){this.setLoader(true,this.t('approveUsdt'));await(await this.contracts.usdt.approve(CONFIG.MINING,b.priceRaw)).wait();}
        this.setLoader(true,this.t('confirming'));tx=await this.contracts.mining.buyBattery(id);await tx.wait();
        this.recordTransaction('buy_battery','USDT','',b.price,'',tx.hash,{batteryTypeId:id,duration:b.days});
      }else{
        if(this.netFtaSold===0n){this.showToast(this.t('errNoFtaLiquidity')+' '+this.t('useUsdtInstead'),true);this.setLoader(false);return;}
        let fc;try{fc=await this.contracts.mining.getFtaCostForUsdtSell(b.priceRaw);}catch(viewErr){this.showToast(this.t('errLowLiquidity'),true);this.setLoader(false);return;}
        if(fc===0n){this.showToast(this.t('errLowLiquidity'),true);this.setLoader(false);return;}
        const ftExact=Number(ethers.formatUnits(fc*100n/89n,this.ftaDecimals));
        const al=await this.contracts.fta.allowance(this.user,CONFIG.MINING);
        if(al<fc*13n/10n){this.setLoader(true,this.t('approveFta'));try{await(await this.contracts.fta.approve(CONFIG.MINING,fc*13n/10n)).wait();}catch(apErr){this.showToast(this.t('errApprovalFailed'),true);this.setLoader(false);return;}}
        this.setLoader(true,this.t('confirming'));tx=await this.contracts.mining.buyBatteryWithFTA(id);await tx.wait();
        try{this.netFtaSold=BigInt(await this.contracts.mining.netFtaSold());}catch(e){}
        this.recordTransaction('buy_battery','FTA','',ftExact,'',tx.hash,{batteryTypeId:id,duration:b.days,ftaCost:ftExact});
      }
      this.userBatteries[id]=(this.userBatteries[id]||0)+1;this._saveLocalAssets();
      this.showToast(this.t('batteryBought'));this.shopBatteriesData=[];this.updateData();
    }catch(e){this.showError(e);}this.setLoader(false);
  }

  /* ── Plug In ───────────────────────────────────────────────── */
  async plugInMachine(){
    const mIdx=document.getElementById('plug-machine-id').value,bT=document.getElementById('plug-battery-type').value;
    if(mIdx===""||mIdx<0)return this.showToast(this.t('invalidId'),true);
    const idx=Number(mIdx);if(idx>=this.userMachines.length)return this.showToast(this.t('invalidId'),true);
    if(!this.userBatteries[bT]||this.userBatteries[bT]<=0)return this.showToast("No battery of this type available",true);
    this.setLoader(true,this.t('pluggingIn'));
    try{
      const tx=await this.contracts.mining.plugInMachine(idx,bT);await tx.wait();
      this.pendingBalance=0;this.userLastClaimTime=Math.floor(Date.now()/1000);
      const durSec=this.batteryTypeDurations[bT]?this.batteryTypeDurations[bT]*86400:2592000;
      this.userMachines[idx].expiresAt=Math.floor(Date.now()/1000)+durSec;
      this.userMachines[idx].pluggedBatteryType=Number(bT);
      this.userBatteries[bT]=Math.max(0,(this.userBatteries[bT]||0)-1);
      this._saveLocalAssets();this.showToast(this.t('pluggedIn'));
      this.recordTransaction('plug_in','','','','',tx.hash,{machineIndex:idx,batteryTypeId:Number(bT),duration:this.getBatteryDuration(Number(bT))});
      this.updateData();
    }catch(e){this.showError(e);}this.setLoader(false);
  }

  /* ── Claim ─────────────────────────────────────────────────── */
  async claim(){if(!this.user)return;this.stopMiningCounter();this.setLoader(true,this.t('claiming'));try{const tx=await this.contracts.mining.claimRewards();await tx.wait();const pending=this.pendingBalance;this.pendingBalance=0;this.userLastClaimTime=Math.floor(Date.now()/1000);this._saveLocalAssets();this.showToast(this.t('claimed'));this.recordTransaction('claim','','FTA','',pending,tx.hash,{amountFTA:pending});this.updateData();if(this.currentRealPower>0)this.startMiningCounter();}catch(e){this.showError(e);this.startMiningCounter();}this.setLoader(false);}

  /* ═══════════ SWAP ══════════════════════════════════════════ */
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
    let netOutput=0;if(this.ftaPriceUsd>0)netOutput=isUsdtTo?(netInput/this.ftaPriceUsd):(netInput*this.ftaPriceUsd);
    document.getElementById('swap-to-in').value=netOutput>0?netOutput.toFixed(6):'';
    const detailsEl=document.getElementById('swap-details');detailsEl.classList.remove('hidden');
    const fromT=isUsdtTo?'USDT':'FTA',toT=isUsdtTo?'FTA':'USDT';
    document.getElementById('swap-detail-rate').innerText=isUsdtTo?`1 USDT = ${(1/this.ftaPriceUsd).toFixed(2)} FTA`:`1 FTA = ${this.ftaPriceUsd.toFixed(6)} USDT`;
    document.getElementById('swap-detail-fee').innerText=`${fee.toFixed(6)} ${fromT}`;
    document.getElementById('swap-detail-min').innerText=`${(netOutput*(1-SLIPPAGE)).toFixed(6)} ${toT}`;
    document.getElementById('swap-detail-network').innerText=`≈ 0.015 POL (${this.formatUsd(0.015*this.polPriceUsd)})`;
  }
  async executeSwap(){
    const val=document.getElementById('swap-from-in').value;
    if(!val||val<=0)return this.showToast(this.t('invalidAmount'),true);
    this.setLoader(true,this.t('swapping'));
    const isUsdtTo=this.swapDirection==='USDT_TO_FTA';
    const decimals=isUsdtTo?this.usdtDecimals:this.ftaDecimals;
    const amount=ethers.parseUnits(val,decimals);
    try{
      let tx;let received=0;
      if(isUsdtTo){
        const al=await this.contracts.usdt.allowance(this.user,CONFIG.MINING);
        if(al<amount){this.setLoader(true,this.t('approveUsdt'));await(await this.contracts.usdt.approve(CONFIG.MINING,amount)).wait();}
        this.setLoader(true,this.t('confirming'));tx=await this.contracts.mining.swapUsdtForFta(amount);await tx.wait();
        try{this.netFtaSold=BigInt(await this.contracts.mining.netFtaSold());}catch(e){}
        const fee=parseFloat(val)*SWAP_FEE_RATE;received=parseFloat(val)-fee;
        this.recordTransaction('swap','USDT','FTA',parseFloat(val),received,tx.hash,{direction:'USDT→FTA'});
      }else{
        if(this.netFtaSold===0n){this.showToast(this.t('errNoFtaLiquidity'),true);this.setLoader(false);return;}
        if(amount>this.netFtaSold){const maxSell=parseFloat(ethers.formatUnits(this.netFtaSold,this.ftaDecimals));this.showToast(this.t('errMaxFtaSell').replace('{max}',maxSell.toFixed(4)),true);this.setLoader(false);return;}
        const al=await this.contracts.fta.allowance(this.user,CONFIG.MINING);
        if(al<amount){this.setLoader(true,this.t('approveFta'));await(await this.contracts.fta.approve(CONFIG.MINING,amount)).wait();}
        this.setLoader(true,this.t('confirming'));tx=await this.contracts.mining.swapFtaForUsdt(amount);await tx.wait();
        try{this.netFtaSold=BigInt(await this.contracts.mining.netFtaSold());}catch(e){}
        received=(parseFloat(val)*(1-SWAP_FEE_RATE))*this.ftaPriceUsd;
        this.recordTransaction('swap','FTA','USDT',parseFloat(val),received,tx.hash,{direction:'FTA→USDT'});
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

  /* ── Send / Receive ────────────────────────────────────────── */
  openSend(ts){this.sendTokenSymbol=ts;document.getElementById('send-token-name').innerText=ts;document.getElementById('send-to-address').value='';document.getElementById('send-amount').value='';let bid='bal-pol-2';if(ts==='USDT')bid='bal-usdt-2';if(ts==='FTA')bid='bal-fta-2';document.getElementById('send-bal').innerText=document.getElementById(bid)?.innerText||'0';document.getElementById('modal-send').classList.add('active');}
  openReceive(){if(!this.user)return this.showToast(this.t('connFirst'),true);document.getElementById('receive-addr-display').innerText=this.user;document.getElementById('modal-receive').classList.add('active');}
  closeModals(){document.getElementById('modal-send').classList.remove('active');document.getElementById('modal-receive').classList.remove('active');}
  copyReceiveAddress(){navigator.clipboard.writeText(this.user);this.showToast(this.t('addrCopied'));}
  async executeSend(){const to=document.getElementById('send-to-address').value.trim(),amt=document.getElementById('send-amount').value;if(!ethers.isAddress(to))return this.showToast(this.t('invalidAddr'),true);if(!amt||Number(amt)<=0)return this.showToast(this.t('invalidAmount'),true);this.setLoader(true,this.t('sending'));try{let tx;if(this.sendTokenSymbol==='POL'){tx=await this.signer.sendTransaction({to,value:ethers.parseEther(amt)});}else{let ct,dc;if(this.sendTokenSymbol==='USDT'){ct=this.contracts.usdt;dc=this.usdtDecimals;}if(this.sendTokenSymbol==='FTA'){ct=this.contracts.fta;dc=this.ftaDecimals;}tx=await ct.transfer(to,ethers.parseUnits(amt,dc));}await tx.wait();this.showToast(this.t('sentSuccess'));this.recordTransaction('send',this.sendTokenSymbol,'',parseFloat(amt),'',tx.hash,{recipient:to});this.closeModals();this.updateData();}catch(e){this.showError(e);}this.setLoader(false);}

  /* ── Nav (5 items) ─────────────────────────────────────────── */
  nav(viewId){
    document.querySelectorAll('.view').forEach(el=>{el.classList.remove('active');el.style.display='none';});
    const av=document.getElementById('view-'+viewId);if(av){av.classList.add('active');av.style.display='block';}
    document.querySelectorAll('.nav-item').forEach(el=>el.classList.remove('active'));
    if(event?.currentTarget)event.currentTarget.classList.add('active');
    if(viewId==='history')this.refreshHistory();
  }

  /* ═══════════ HISTORY ═══════════════════════════════════════ */
  async refreshHistory() {
    if (!this.user) return;
    try {
      let apiData = null;
      if (this.authToken) {
        const typeFilter = this.historyFilter !== 'all' ? this.historyFilter : null;
        const path = typeFilter ? `/api/transactions?type=${typeFilter}&limit=100` : '/api/transactions?limit=100';
        apiData = await this.api.get(path);
        // Get activity
        const actData = await this.api.get('/api/activity?limit=20');
        if (actData) this.activityData = actData.activities || [];
        // Get leaderboard
        const lbData = await this.api.get('/api/leaderboard?limit=20');
        if (lbData) this.leaderboardData = lbData.leaderboard || [];
      }

      if (apiData && apiData.transactions && apiData.transactions.length > 0) {
        this.historyData = apiData.transactions;
        this.historyStats = apiData.stats;
      } else {
        // Fallback: use local tx log
        this.historyData = this.historyFilter === 'all'
          ? this.localTxLog
          : this.localTxLog.filter(tx => tx.type === this.historyFilter);
        this.historyStats = {
          total: this.localTxLog.length,
          swaps: this.localTxLog.filter(tx=>tx.type==='swap').length,
          machines: this.localTxLog.filter(tx=>tx.type==='buy_machine').length,
          batteries: this.localTxLog.filter(tx=>tx.type==='buy_battery').length,
          claims: this.localTxLog.filter(tx=>tx.type==='claim').length,
          confirmed: this.localTxLog.length
        };
        this.activityData = [];
      }
      this.renderHistory();
      this.renderActivityFeed();
      this.renderLeaderboard();
      this.updateProfileUI();
    } catch (e) {
      console.error('refreshHistory', e);
    }
  }

  filterHistory(filter) {
    this.historyFilter = filter;
    document.querySelectorAll('.tx-filter-tab').forEach(t => t.classList.remove('active'));
    const tabs = document.querySelectorAll('.tx-filter-tab');
    const idx = ['all','swap','buy_machine','buy_battery','claim'].indexOf(filter);
    if (idx >= 0 && tabs[idx]) tabs[idx].classList.add('active');
    this.refreshHistory();
  }

  renderHistory() {
    const c = document.getElementById('history-list');
    if (!c) return;

    // Update summary
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

    const typeIcons = { swap:'💱', buy_machine:'⛏️', buy_battery:'🔋', claim:'🎁', send:'📤', receive:'📥', plug_in:'⚡', approve:'🔐', referral:'👥' };
    const typeLabels = { swap:'Swap', buy_machine:'Machine', buy_battery:'Battery', claim:'Claim', send:'Send', receive:'Receive', plug_in:'Plug In', approve:'Approve', referral:'Referral' };

    c.innerHTML = this.historyData.slice(0, 50).map(tx => {
      const icon = typeIcons[tx.type] || '📋';
      const label = typeLabels[tx.type] || tx.type;
      const time = tx.created_at ? new Date(tx.created_at).toLocaleString() : (tx.timestamp ? new Date(tx.timestamp).toLocaleString() : '');
      const hasHash = tx.tx_hash && tx.tx_hash !== 'local';
      const status = tx.status || (tx.tx_hash ? 'confirmed' : 'pending');
      const amountIn = tx.amount_from || tx.amountFrom || '';
      const amountOut = tx.amount_to || tx.amountTo || '';
      const tokenIn = tx.token_from || tx.tokenFrom || '';
      const tokenOut = tx.token_to || tx.tokenTo || '';

      return `<div class="tx-item">
        <div class="tx-item-header">
          <span class="tx-type-badge ${tx.type||tx.tx_type}">${icon} ${label}</span>
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
            ${hasHash ? `<a class="tx-hash-link" href="https://polygonscan.com/tx/${tx.tx_hash||tx.txHash}" target="_blank" rel="noopener">${(tx.tx_hash||tx.txHash||'').slice(0,10)}... ↗</a>` : ''}
          </div>
        </div>
      </div>`;
    }).join('');
  }

  renderActivityFeed() {
    const c = document.getElementById('activity-feed');
    if (!c) return;
    const activities = this.activityData;
    if (!activities || !activities.length) {
      c.innerHTML = `<p class="small-text" style="text-align:center;">${this.t('noActivity')}</p>`;
      return;
    }
    const dotClass = (action) => {
      if (['login','register','logout','profile_update'].includes(action)) return action==='register'?'register':(action==='login'?'login':'default');
      if (['swap','buy_machine','buy_battery'].includes(action)) return action;
      if (action==='claim') return 'claim';
      return 'default';
    };
    c.innerHTML = activities.slice(0, 15).map(a => `
      <div class="activity-item">
        <div class="activity-dot ${dotClass(a.action)}"></div>
        <div class="activity-text">${a.details||a.action}</div>
        <div class="activity-time">${new Date(a.created_at).toLocaleTimeString()}</div>
      </div>
    `).join('');
  }

  renderLeaderboard() {
    const c = document.getElementById('leaderboard-list');
    if (!c) return;
    const lb = this.leaderboardData;
    if (!lb || !lb.length) {
      // Fallback: show local stats
      c.innerHTML = `<p class="small-text" style="text-align:center;">Connect to server for live leaderboard</p>`;
      return;
    }
    c.innerHTML = lb.slice(0, 15).map((u,i) => {
      const rank = i+1;
      const rankClass = rank===1?'gold':(rank===2?'silver':(rank===3?'bronze':''));
      return `<div class="lb-item">
        <div class="lb-rank ${rankClass}">${rank}</div>
        <div class="lb-info">
          <div class="lb-name">${u.username||'Anonymous Miner'}</div>
          <div class="lb-addr">${(u.wallet_address||'').slice(0,8)}...</div>
        </div>
        <div class="lb-earned">
          <span class="lb-earned-val">${this.formatUsd(u.total_earned)}</span>
          <span class="lb-earned-label">earned</span>
        </div>
      </div>`;
    }).join('');
  }

  /* ── Visualizer ────────────────────────────────────────────── */
  resizeCanvas(){if(this.vizContext){const c=this.vizContext.canvas;c.width=c.offsetWidth*2;c.height=c.offsetHeight*2;}}
  initVisualizer(){const c=document.getElementById('mining-canvas');if(!c)return;this.resizeCanvas();this.vizContext=c.getContext('2d');this.vizBars=[];for(let i=0;i<20;i++)this.vizBars.push({height:0,targetHeight:0});this.animateVisualizer();}
  updateVisualizerIntensity(p){const maxP=100000,level=Math.min(Math.max(p/maxP,0.02),1);this.vizBars.forEach(b=>{b.targetHeight=(this.vizContext.canvas.height*level)*(0.6+Math.random()*0.4);});}
  animateVisualizer(){if(!this.vizContext)return;const ctx=this.vizContext;ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);ctx.fillStyle="#F0B90B";const w=ctx.canvas.width/20;this.vizBars.forEach((b,i)=>{b.height+=(b.targetHeight-b.height)*0.1;ctx.fillRect(i*w+2,ctx.canvas.height-b.height,w-4,b.height);b.targetHeight+=(Math.random()-0.5)*10;if(b.targetHeight<0)b.targetHeight=2;if(b.targetHeight>ctx.canvas.height)b.targetHeight=ctx.canvas.height;});requestAnimationFrame(()=>this.animateVisualizer());}

  /* ── Loader / Toast / Errors ───────────────────────────────── */
  setLoader(show,msg="Processing..."){const l=document.getElementById('loader');document.getElementById('loader-text').innerText=msg;if(show)l.classList.remove('hidden');else l.classList.add('hidden');}
  showToast(msg,isError=false){const div=document.createElement('div');div.className='toast'+(isError?' toast-error':' toast-success');div.innerText=msg;document.getElementById('toast-container').appendChild(div);setTimeout(()=>div.remove(),5000);}
  getErrorMessage(e){const es=(e?.message||'').toLowerCase()+' '+(e?.code||'').toLowerCase()+' '+(e?.reason||'').toLowerCase()+' '+(e?.shortMessage||'').toLowerCase();const ie=(e?.info?.error?.message||'').toLowerCase();const c=es+' '+ie;if(c.includes('user rejected')||c.includes('user denied')||c.includes('cancelled by user')||c.includes('action_rejected')||e?.code==='ACTION_REJECTED'||e?.code===4001||e?.code===-32000||(e?.info?.error?.code===4001))return this.t('errRejected');if(c.includes('insufficient liquidity')||c.includes('insufficient fta liquidity')||c.includes('insufficient usdt liquidity'))return this.t('errLowLiquidity');if(c.includes('insufficient funds')||c.includes('insufficient balance')||c.includes('not enough')||c.includes('underpriced')||c.includes('exceeds allowance')||c.includes('erc20: insufficient')||c.includes('transfer amount exceeds'))return this.t('errInsufficientFunds');if(c.includes('nonce')||c.includes('already known')||c.includes('replacement fee too low'))return this.t('errNonce');if(c.includes('already pending')||c.includes('pending transaction'))return this.t('errAlreadyPending');if(c.includes('timeout')||c.includes('timed out')||c.includes('deadline'))return this.t('errTimeout');if(c.includes('network')||c.includes('fetch')||c.includes('failed to fetch')||c.includes('connection')||c.includes('could not decode')||c.includes('missing revert data')||c.includes('call revert exception'))return this.t('errNetwork');if(c.includes('invalid amount'))return this.t('errSwapRejected');if(c.includes('revert')||c.includes('execution reverted')||c.includes('vm execution error')||c.includes('gas required exceeds allowance')||c.includes('transaction failed'))return this.t('errContract');return this.t('errGeneric');}
  showError(e){console.error("Transaction Error:",e);this.showToast(this.getErrorMessage(e),true);}

  /* ── Render UI (machines, batteries) ───────────────────────── */
  renderActiveMachines(){const c=document.getElementById('active-machines-list');if(!c)return;const now=Math.floor(Date.now()/1000);const active=this.userMachines.filter(m=>m.expiresAt>now);if(!active.length){c.innerHTML=`<p class="small-text" style="text-align:center;">${this.t('noActiveMachines')}</p>`;return;}const tn=['MK-I','MK-II','MK-III','MK-IV','MK-V','MK-VI','MK-VII','MK-VIII'];c.innerHTML=active.map(m=>{const rem=m.expiresAt-now,dur=this.getBatteryDuration(m.pluggedBatteryType),tot=dur*86400,el=tot-rem,pr=Math.min(Math.max((el/tot)*100,0),100),bc=pr<60?'green':(pr<85?'yellow':'red');return`<div class="asset-row">${this.getMachineMiniSVG(m.typeId)}<div class="asset-info"><div class="asset-name">${tn[m.typeId%8]} <span class="status-pill active">● ${this.t('active')}</span></div><div class="asset-detail">${this.t('batteryLabel')}: ${dur} ${this.t('days')}</div><div class="battery-bar-wrap"><div class="battery-bar-header"><span class="battery-bar-label">${this.t('timeRemaining')}</span><span class="battery-bar-time ${bc}">${this.formatTimeRemaining(rem)}</span></div><div class="battery-bar"><div class="battery-bar-fill ${bc}" style="width:${pr.toFixed(1)}%"></div></div></div></div></div>`;}).join('');}
  renderUserMachines(){const c=document.getElementById('my-machines-list');if(!c)return;if(!this.userMachines.length){c.innerHTML=`<p class="small-text" style="text-align:center;">${this.t('noMachines')}</p>`;return;}const now=Math.floor(Date.now()/1000),tn=['MK-I','MK-II','MK-III','MK-IV','MK-V','MK-VI','MK-VII','MK-VIII'];c.innerHTML=this.userMachines.map((m,i)=>{let sc,st;if(m.expiresAt>now){sc='active';st=this.t('active');}else if(m.expiresAt>0){sc='expired';st=this.t('expired');}else{sc='inactive';st=this.t('inactive');}const dur=this.getBatteryDuration(m.pluggedBatteryType);let bh='';if(m.expiresAt>0){const rem=m.expiresAt-now,tot=dur*86400,el=tot-rem,pr=Math.min(Math.max((el/tot)*100,0),100),bc=rem<=0?'red':(pr<60?'green':(pr<85?'yellow':'red'));bh=`<div class="battery-bar-wrap"><div class="battery-bar-header"><span class="battery-bar-label">${this.t('batteryLabel')}: ${dur} ${this.t('days')}</span><span class="battery-bar-time ${bc}">${rem>0?this.formatTimeRemaining(rem):this.t('expired')}</span></div><div class="battery-bar"><div class="battery-bar-fill ${rem<=0?'gray':bc}" style="width:${rem<=0?100:pr.toFixed(1)}%"></div></div></div>`;}return`<div class="asset-row">${this.getMachineMiniSVG(m.typeId)}<div class="asset-info"><div class="asset-name">#${i} ${tn[m.typeId%8]} <span class="status-pill ${sc}">● ${st}</span></div><div class="asset-detail">${m.expiresAt>0?this.t('plugged'):this.t('notPlugged')}</div>${bh}</div></div>`;}).join('');}
  renderUserBatteries(){const c=document.getElementById('my-batteries-list');if(!c)return;const types=Object.entries(this.userBatteries).filter(([,cnt])=>cnt>0);if(!types.length){c.innerHTML=`<p class="small-text" style="text-align:center;">${this.t('noBatteries')}</p>`;return;}c.innerHTML=types.map(([tid,cnt])=>{const dur=this.getBatteryDuration(Number(tid)),cl=Math.floor(Math.random()*40)+60,lc=cl>60?'':(cl>20?'medium':(cl>0?'low':'empty'));return`<div class="asset-row"><div class="real-battery"><div class="battery-cap"></div><div class="battery-body"><div class="battery-level ${lc}" style="width:${cl}%"></div><div class="battery-charge-indicator">${cnt}×</div></div></div><div class="asset-info"><div class="asset-name">${dur} ${this.t('days')} <span class="status-pill available">● ${cnt} ${this.t('available')}</span></div></div></div>`;}).join('');}

  /* ── SVG ───────────────────────────────────────────────────── */
  getMachineSVG(tier){const t=[{n:'MK-I',g:1,c:'#64748b',a:'#94a3b8',f:1},{n:'MK-II',g:2,c:'#3b82f6',a:'#60a5fa',f:1},{n:'MK-III',g:3,c:'#8b5cf6',a:'#a78bfa',f:2},{n:'MK-IV',g:4,c:'#F0B90B',a:'#FFD43B',f:2},{n:'MK-V',g:5,c:'#f97316',a:'#fb923c',f:2},{n:'MK-VI',g:6,c:'#ef4444',a:'#f87171',f:3},{n:'MK-VII',g:8,c:'#06b6d4',a:'#22d3ee',f:3},{n:'MK-VIII',g:8,c:'#eab308',a:'#facc15',f:4}][tier%8];const W=260,H=170;let gH='',fH='',lH='',vH='';const gw=24,gh=48,gG=3,mW=W-40;let eg=gw;let tW=t.g*eg+(t.g-1)*gG;if(tW>mW){eg=Math.floor((mW-(t.g-1)*gG)/t.g);tW=t.g*eg+(t.g-1)*gG;}const gS=(W-tW)/2,gY=22;for(let i=0;i<t.g;i++){const x=gS+i*(eg+gG);gH+=`<rect x="${x}" y="${gY}" width="${eg}" height="${gh}" rx="2" fill="#080c18" stroke="${t.a}" stroke-width="0.6" opacity="0.85"/>`;const fC=Math.max(3,Math.floor(eg/4)),fS=eg-6;for(let j=0;j<9;j++){const fy=gY+5+j*4.5;if(fy+2<gY+gh-10){for(let f=0;f<fC;f++){gH+=`<rect x="${x+3+f*(fS/fC)}" y="${fy}" width="${Math.max(1,(fS/fC)-1.5)}" height="2" rx="0.5" fill="${t.a}" opacity="0.12"/>`;}}}const cW=Math.min(10,eg-6);gH+=`<rect x="${x+(eg-cW)/2}" y="${gY+gh-11}" width="${cW}" height="7" rx="1.5" fill="${t.c}" opacity="0.35"/><circle cx="${x+eg/2}" cy="${gY+3}" r="1" fill="${t.a}" class="led-pulse" style="animation-delay:${i*0.3}s"/>`;}const fR=14,fS2=14,tFW=t.f*fR*2+(t.f-1)*fS2,fSX=(W-tFW)/2,fY=100;for(let i=0;i<t.f;i++){const cx=fSX+i*(fR*2+fS2)+fR,cy=fY;fH+=`<circle cx="${cx}" cy="${cy}" r="${fR+2}" fill="#060a14" stroke="#2a2a3e" stroke-width="1"/><circle cx="${cx}" cy="${cy}" r="${fR}" fill="#0a0e1a" stroke="#333" stroke-width="0.8"/><g class="fan-blades" style="transform-origin:${cx}px ${cy}px">`;for(let b=0;b<5;b++)fH+=`<rect x="${cx-1.5}" y="${cy-fR+3}" width="3" height="${fR-4}" rx="1.5" fill="#1e293b" transform="rotate(${b*72},${cx},${cy})"/>`;fH+=`</g><circle cx="${cx}" cy="${cy}" r="3.5" fill="${t.a}" opacity="0.4"/><circle cx="${cx}" cy="${cy}" r="1.5" fill="${t.a}" opacity="0.7"/>`;}for(let i=0;i<6;i++){const lx=25+i*9;lH+=`<circle cx="${lx}" cy="148" r="1.8" fill="${i===0?'#10b981':(i<3?t.a:'#334155')}" class="led-pulse" style="animation-delay:${i*0.4}s"/>`;}for(let v=0;v<3;v++)vH+=`<rect x="30" y="${138+v*5}" width="${W-60}" height="2" rx="1" fill="#060a14" opacity="0.8"/>`;return`<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" class="machine-svg"><defs><linearGradient id="bG${tier}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1e293b"/><stop offset="50%" stop-color="#162032"/><stop offset="100%" stop-color="#0f172a"/></linearGradient><linearGradient id="tB${tier}" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="${t.c}" stop-opacity="0.8"/><stop offset="50%" stop-color="${t.a}" stop-opacity="1"/><stop offset="100%" stop-color="${t.c}" stop-opacity="0.8"/></linearGradient></defs><ellipse cx="${W/2}" cy="${H-3}" rx="${W/2-30}" ry="10" fill="${t.a}" opacity="0.06"/><rect x="12" y="10" width="${W-24}" height="${H-22}" rx="8" fill="url(#bG${tier})" stroke="#2a3550" stroke-width="1.2"/><rect x="12" y="10" width="${W-24}" height="4" rx="2" fill="url(#tB${tier})"/><circle cx="20" cy="18" r="1.5" fill="#334155"/><circle cx="${W-20}" cy="18" r="1.5" fill="#334155"/><text x="${W-22}" y="20" font-family="monospace" font-size="7" font-weight="700" fill="${t.a}" text-anchor="end" opacity="0.7">${t.n}</text><text x="24" y="20" font-family="sans-serif" font-size="6" font-weight="800" fill="#475569" letter-spacing="1.5">FITIA</text>${gH}<line x1="28" y1="${gY+gh+6}" x2="${W-28}" y2="${gY+gh+6}" stroke="#1e293b" stroke-width="0.8" stroke-dasharray="2,2"/>${fH}${vH}${lH}<circle cx="${W-25}" cy="148" r="3.5" fill="none" stroke="${t.a}" stroke-width="0.8" opacity="0.5"/><line x1="${W-25}" y1="143.5" x2="${W-25}" y2="146" stroke="${t.a}" stroke-width="0.8" opacity="0.5"/></svg>`;}
  getMachineMiniSVG(tier){const c=['#64748b','#3b82f6','#8b5cf6','#F0B90B','#f97316','#ef4444','#06b6d4','#eab308'][tier%8],a=['#94a3b8','#60a5fa','#a78bfa','#FFD43B','#fb923c','#f87171','#22d3ee','#facc15'][tier%8];return`<svg viewBox="0 0 50 50" class="machine-svg-mini"><rect x="2" y="2" width="46" height="46" rx="6" fill="#1e293b" stroke="${c}" stroke-width="1"/><rect x="2" y="2" width="46" height="3" rx="1.5" fill="${c}" opacity="0.6"/><rect x="8" y="10" width="14" height="20" rx="2" fill="#080c18" stroke="${a}" stroke-width="0.5"/><rect x="28" y="10" width="14" height="20" rx="2" fill="#080c18" stroke="${a}" stroke-width="0.5"/><circle cx="21" cy="40" r="6" fill="#0a0e1a" stroke="#333" stroke-width="0.5"/><g class="fan-blades" style="transform-origin:21px 40px">${[0,72,144,216,288].map(r=>`<rect x="19.5" y="34.5" width="3" height="5" rx="1.5" fill="#1e293b" transform="rotate(${r},21,40)"/>`).join('')}</g><circle cx="21" cy="40" r="2" fill="${a}" opacity="0.6"/><circle cx="37" cy="40" r="6" fill="#0a0e1a" stroke="#333" stroke-width="0.5"/><g class="fan-blades" style="transform-origin:37px 40px">${[0,72,144,216,288].map(r=>`<rect x="35.5" y="34.5" width="3" height="5" rx="1.5" fill="#1e293b" transform="rotate(${r},37,40)"/>`).join('')}</g><circle cx="37" cy="40" r="2" fill="${a}" opacity="0.6"/></svg>`;}

  _renderShopMachinesHTML(c){c.innerHTML='';c.style.gridTemplateColumns='1fr 1fr';const bc=['background:#64748b;color:#fff','background:#3b82f6;color:#fff','background:#8b5cf6;color:#fff','background:#F0B90B;color:#000','background:#f97316;color:#fff','background:#ef4444;color:#fff','background:#06b6d4;color:#000','background:#eab308;color:#000'];const bn=['STARTER','STANDARD','ADVANCED','PRO','ELITE','ULTRA','SUPREME','LEGEND'];for(let i=0;i<this.shopMachinesData.length;i++){const d=this.shopMachinesData[i],div=document.createElement('div');div.className='rig-item';div.innerHTML=`<span class="tier-badge" style="${bc[i%8]}">${bn[i%8]}</span>${this.getMachineSVG(i)}<span class="rig-name" style="font-size:0.85rem;">${this.t('rig')} ${i+1}</span><span class="rig-power" style="font-size:0.75rem;">${this.formatHashrate(d.power)}</span><span class="rig-price" style="font-size:1rem;">${d.price.toFixed(2)} $</span><button class="btn-primary" style="padding:8px;font-size:0.75rem;margin-top:6px;" onclick="App.buyMachine(${i})">${this.t('buy')} (${this.payMode})</button>`;c.appendChild(div);}}
  _renderShopBatteriesHTML(c){c.innerHTML='';c.style.gridTemplateColumns='1fr 1fr';for(let i=0;i<this.shopBatteriesData.length;i++){const d=this.shopBatteriesData[i],div=document.createElement('div'),cl=Math.floor(Math.random()*40)+60;div.className='battery-shop-item';div.innerHTML=`<div class="real-battery"><div class="battery-cap"></div><div class="battery-body"><div class="battery-level" style="width:${cl}%"></div><div class="battery-charge-indicator">${d.days}D</div></div></div><div class="battery-name">${d.days} ${this.t('days')}</div><div class="battery-price">${d.price.toFixed(2)} $</div><button class="btn-primary" style="padding:6px;font-size:0.75rem" onclick="App.buyBattery(${i})">${this.t('buy')} (${this.payMode})</button>`;c.appendChild(div);}}

  /* ═══════════ CHAT ASSISTANT ═════════════════════════════════ */
  toggleChat(){const p=document.getElementById('chat-panel');const a=p.classList.toggle('active');if(a&&!this.chatInitialized){this.chatInitialized=true;setTimeout(()=>this.addChatBubble('assistant',this.getWelcomeMessage()),400);}if(a)setTimeout(()=>document.getElementById('chat-input').focus(),350);}
  sendChatMessage(){const i=document.getElementById('chat-input'),m=i.value.trim();if(!m)return;i.value='';this.addChatBubble('user',m);this.chatHistory.push({role:'user',text:m});const tid=this.showTyping();setTimeout(()=>{this.removeTyping(tid);const r=this.generateLocalResponse(m);this.addChatBubble('assistant',r);this.chatHistory.push({role:'assistant',text:r});},400+Math.min(m.length*25,1200)+Math.random()*400);}
  addChatBubble(role,text){const c=document.getElementById('chat-messages'),b=document.createElement('div');b.className=`chat-bubble ${role}`;b.textContent=text;c.appendChild(b);requestAnimationFrame(()=>c.scrollTop=c.scrollHeight);}
  showTyping(){const c=document.getElementById('chat-messages'),t=document.createElement('div'),id='typing-'+Date.now();t.id=id;t.className='chat-bubble assistant';t.innerHTML='<span style="letter-spacing:3px;animation:loaderTextPulse 1s infinite">● ● ●</span>';c.appendChild(t);c.scrollTop=c.scrollHeight;return id;}
  removeTyping(id){const e=document.getElementById(id);if(e)e.remove();}
  getWelcomeMessage(){
    const liquidityInfo=this.netFtaSold===0n?`\n⚠️ Protocol liquidity is currently being built. Use USDT for purchases!`:`\n💧 Protocol Liquidity: ${parseFloat(ethers.formatUnits(this.netFtaSold,this.ftaDecimals)).toFixed(2)} FTA`;
    const msgs={en:`👋 Welcome to Fitia Pro! I'm your AI assistant.\n\n🏗️ 4 revolutionary visions: Mining • Finance • Shop • Store\n💬 Ask me anything about mining, swaps, strategy, or getting started!\n📋 Check the new History tab for your transactions & leaderboard.${liquidityInfo}`};
    return msgs[this.currentLang]||msgs.en;
  }
  generateLocalResponse(msg){
    const m=msg.toLowerCase().replace(/[?!.,;:'"]/g,'').trim();
    const intents=this.detectIntents(m);
    if(intents.length>0)return this.craftResponse(intents[0].intent);
    return this.pickResponse('default');
  }
  detectIntents(m){const s=[];for(const[intent,data]of Object.entries(CHAT_INTENTS)){let sc=0;for(const lk of['all',this.currentLang,'en']){if(!data.keywords[lk])continue;for(const kw of data.keywords[lk]){if(m.includes(kw))sc+=(data.weight||1);}}if(sc>0)s.push({intent,score:sc});}s.sort((a,b)=>b.score-a.score);return s;}
  craftResponse(intent){
    const L=this.currentLang;const ctx={ftaPrice:this.ftaPriceUsd>0?this.ftaPriceUsd.toFixed(6):'...',liquidity:this.netFtaSold===0n?'0':parseFloat(ethers.formatUnits(this.netFtaSold,this.ftaDecimals)).toFixed(2)+' FTA',power:this.formatHashrate(this.currentRealPower),active:this.userMachines.filter(m=>m.expiresAt>Math.floor(Date.now()/1000)).length,pending:this.pendingBalance.toFixed(5)};
    // Dynamic responses
    if(intent==='greeting')return this.user?`👋 Hello! Connected. ${ctx.active} active machine(s) at ${ctx.power}. How can I help?`:`👋 Welcome! Connect your wallet to start mining!`;
    if(intent==='price'&&this.user)return`📊 FTA: $${ctx.ftaPrice} | Liquidity: ${ctx.liquidity} | Pending: ${ctx.pending} FTA`;
    if(intent==='fta_problems'&&this.user)return`⚠️ Liquidity: ${ctx.liquidity}\n\n💡 Use USDT for purchases, or swap USDT→FTA first.`;
    return this.pickResponse(intent);
  }
  pickResponse(intent){
    const L=this.currentLang;const resp=CHAT_RESPONSES[intent]||CHAT_RESPONSES['default'];
    const text=resp[L]||resp['en']||resp;
    return typeof text==='string'?text:text;
  }
}

const App=new Application();
window.onload=()=>App.init();
