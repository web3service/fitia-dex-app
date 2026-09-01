// ═══════════════════════════════════════════════════════════════════
//  Fitia-Game — Hub des 3 jeux (chargé après app.js et finance.js)
//  Dépend des globales : App, CONFIG, i18n, ethers (v6)
//  Contrat : game/FitiaGameV1.sol (boosts, tickets, cagnottes)
//  Runner 3D façon Temple Run : Three.js (CDN cdnjs, autorisé par la CSP)
//  SANS contrat déployé : les 3 jeux sont jouables en « mode entraînement ».
// ═══════════════════════════════════════════════════════════════════
(function () {
  'use strict';

  // ─── ABI minimale de FitiaGameV1 ─────────────────────────────────
  const GAME_ABI = [
    "function boostTierCount() view returns (uint256)",
    "function boostTierInfo(uint256) view returns (uint256 multBps, uint64 dur, uint256 price, bool active)",
    "function buyBoost(uint256 tierId)",
    "function roundCount() view returns (uint256)",
    "function roundInfo(uint256) view returns (uint8 game, uint256 entryPrice, uint16 burnBps, uint256 pool, bool open, uint256 entryCount)",
    "function buyEntry(uint256 roundId)",
    "function stats() view returns (uint256 pool, uint256 burned, uint256 spent)"
  ];

  // ─── Traductions du module (fusionnées dans i18n) ────────────────
  const GAME_I18N = {
    fr: {
      gameNav: "Game", gameTitle: "🎮 Fitia Game", gameHub: "Choisis ton jeu",
      tapName: "⚡ Tap Miner", tapDesc: "Tape pour surcadençer ton minage réel",
      runnerName: "🏃 Fitia Runner 3D", runnerDesc: "Temple Run 3D : cours, collecte, esquive",
      predictName: "🧠 Fitia Predict", predictDesc: "Quiz crypto et pronostics quotidiens",
      tapTitle: "⚡ Tap Miner", tapInfo: "Chaque tape charge ton overclocking. Énergie max 100, +1 toutes les 10 s.",
      tapEnergy: "Énergie", tapScore: "Score", tapTap: "TAPE !", tapBoostShop: "🚀 BOUTIQUE DE BOOSTS",
      tapCharges: "Charges", runnerTitle: "🏃 Fitia Runner 3D",
      runnerInfo: "Glisse à gauche/droite pour changer de couloir, glisse vers le haut (ou espace) pour sauter, vers le bas pour glisser. Collecte les pièces 🟡, évite les troncs et les dalles.",
      runnerControls: "👉 Glisse ←→ = couloir · Haut = saut · Bas = glissade",
      runnerPlay: "JOUER", runnerBest: "Meilleur score", runnerLast: "Dernier score", runnerOver: "Partie terminée !",
      runnerReplay: "REJOUER", runnerBack: "← Hub", predictTitle: "🧠 Fitia Predict", predictQuiz: "Quiz", predictPrognosis: "Pronostic",
      quizStart: "DÉMARRER LE QUIZ", quizNext: "SUIVANT", quizScoreLbl: "Score", quizStreak: "Série",
      quizFinish: "Quiz terminé !", quizAgain: "REJOUER", quizGood: "✅ Correct !", quizBad: "❌ Raté !",
      progDesc: "Le FTA va-t-il monter ou descendre dans les prochaines 24 h ?", progUp: "📈 MONTE",
      progDown: "📉 DESCEND", progPick: "Ton pronostic :", progHistory: "Historique", progNone: "Aucun pronostic pour l'instant.",
      progRecorded: "Pronostic enregistré ! Résolution à venir.", progStaked: "Mise",
      training: "Mode entraînement — déploie FitiaGameV1 pour activer les achats en FTA.",
      buyBoost: "ACHETER", boostBought: "Boost activé sur ton minage ! ⚡", errFta: "Solde FTA insuffisant.",
      activeBoost: "Boost actif", noBoost: "Aucun boost actif", price: "Prix", duration: "Durée",
      ticketBuy: "ACHETER L'ENTRÉE", entryBought: "Entrée enregistrée ! 🎟️", loadErr: "Impossible de charger le Game.",
      combo: "COMBO", fallback2d: "3D indisponible (hors ligne) — version 2D de secours."
    },
    en: {
      gameNav: "Game", gameTitle: "🎮 Fitia Game", gameHub: "Pick your game",
      tapName: "⚡ Tap Miner", tapDesc: "Tap to overclock your real mining",
      runnerName: "🏃 Fitia Runner 3D", runnerDesc: "Temple Run 3D: run, collect, dodge",
      predictName: "🧠 Fitia Predict", predictDesc: "Crypto quiz and daily predictions",
      tapTitle: "⚡ Tap Miner", tapInfo: "Each tap charges your overclocking. Max 100 energy, +1 every 10 s.",
      tapEnergy: "Energy", tapScore: "Score", tapTap: "TAP!", tapBoostShop: "🚀 BOOST SHOP",
      tapCharges: "Charges", runnerTitle: "🏃 Fitia Runner 3D",
      runnerInfo: "Swipe left/right to switch lanes, swipe up (or space) to jump, swipe down to slide. Collect 🟡 coins, avoid logs and stone slabs.",
      runnerControls: "👉 Swipe ←→ = lane · Up = jump · Down = slide",
      runnerPlay: "PLAY", runnerBest: "Best score", runnerLast: "Last score", runnerOver: "Game over!",
      runnerReplay: "PLAY AGAIN", runnerBack: "← Hub", predictTitle: "🧠 Fitia Predict", predictQuiz: "Quiz", predictPrognosis: "Prediction",
      quizStart: "START QUIZ", quizNext: "NEXT", quizScoreLbl: "Score", quizStreak: "Streak",
      quizFinish: "Quiz finished!", quizAgain: "PLAY AGAIN", quizGood: "✅ Correct!", quizBad: "❌ Wrong!",
      progDesc: "Will FTA go up or down in the next 24 h?", progUp: "📈 UP",
      progDown: "📉 DOWN", progPick: "Your prediction:", progHistory: "History", progNone: "No prediction yet.",
      progRecorded: "Prediction recorded! Resolution coming.", progStaked: "Stake",
      training: "Training mode — deploy FitiaGameV1 to enable FTA purchases.",
      buyBoost: "BUY", boostBought: "Boost activated on your mining! ⚡", errFta: "Insufficient FTA balance.",
      activeBoost: "Active boost", noBoost: "No active boost", price: "Price", duration: "Duration",
      ticketBuy: "BUY ENTRY", entryBought: "Entry recorded! 🎟️", loadErr: "Unable to load the Game.",
      combo: "COMBO", fallback2d: "3D unavailable (offline) — 2D fallback version."
    },
    de: {
      gameNav: "Game", gameTitle: "🎮 Fitia Game", gameHub: "Wähle dein Spiel",
      tapName: "⚡ Tap Miner", tapDesc: "Tippe, um dein echtes Mining zu übertakten",
      runnerName: "🏃 Fitia Runner 3D", runnerDesc: "Temple Run 3D: laufen, sammeln, ausweichen",
      predictName: "🧠 Fitia Predict", predictDesc: "Crypto-Quiz und tägliche Prognosen",
      tapTitle: "⚡ Tap Miner", tapInfo: "Jeder Tipp lädt dein Overclocking. Max 100 Energie, +1 alle 10 s.",
      tapEnergy: "Energie", tapScore: "Punkte", tapTap: "TIPP!", tapBoostShop: "🚀 BOOST-SHOP",
      tapCharges: "Ladungen", runnerTitle: "🏃 Fitia Runner 3D",
      runnerInfo: "Wische links/rechts für die Spur, nach oben (oder Leertaste) zum Springen, nach unten zum Rutschen. Sammle 🟡 Münzen, weiche Stämmen und Steinplatten aus.",
      runnerControls: "👉 Wischen ←→ = Spur · Hoch = Sprung · Runter = Rutschen",
      runnerPlay: "SPIELEN", runnerBest: "Bestwert", runnerLast: "Letztes Ergebnis", runnerOver: "Spiel vorbei!",
      runnerReplay: "NOCHMAL", runnerBack: "← Hub", predictTitle: "🧠 Fitia Predict", predictQuiz: "Quiz", predictPrognosis: "Prognose",
      quizStart: "QUIZ STARTEN", quizNext: "WEITER", quizScoreLbl: "Punkte", quizStreak: "Serie",
      quizFinish: "Quiz beendet!", quizAgain: "NOCHMAL", quizGood: "✅ Richtig!", quizBad: "❌ Falsch!",
      progDesc: "Steigt der FTA in den nächsten 24 h oder fällt er?", progUp: "📈 STEIGT",
      progDown: "📉 FÄLLT", progPick: "Deine Prognose:", progHistory: "Verlauf", progNone: "Noch keine Prognose.",
      progRecorded: "Prognose gespeichert! Auflösung kommt.", progStaked: "Einsatz",
      training: "Trainingsmodus — setze FitiaGameV1 ein, um FTA-Käufe zu aktivieren.",
      buyBoost: "KAUFEN", boostBought: "Boost auf deinem Mining aktiviert! ⚡", errFta: "Unzureichender FTA-Saldo.",
      activeBoost: "Aktiver Boost", noBoost: "Kein aktiver Boost", price: "Preis", duration: "Dauer",
      ticketBuy: "EINTRITT KAUFEN", entryBought: "Eintritt gespeichert! 🎟️", loadErr: "Game konnte nicht geladen werden.",
      combo: "COMBO", fallback2d: "3D nicht verfügbar (offline) — 2D-Ersatzversion."
    },
    zh: {
      gameNav: "游戏", gameTitle: "🎮 Fitia Game", gameHub: "选择你的游戏",
      tapName: "⚡ 点击矿工", tapDesc: "点击以超频你的真实挖矿",
      runnerName: "🏃 Fitia 跑酷 3D", runnerDesc: "神庙逃亡 3D：奔跑、收集、躲避",
      predictName: "🧠 Fitia 预测", predictDesc: "加密问答与每日预测",
      tapTitle: "⚡ 点击矿工", tapInfo: "每次点击为超频充能。能量上限 100，每 10 秒 +1。",
      tapEnergy: "能量", tapScore: "分数", tapTap: "点！", tapBoostShop: "🚀 强化商店",
      tapCharges: "充能", runnerTitle: "🏃 Fitia 跑酷 3D",
      runnerInfo: "左右滑动切换跑道，上滑（或空格）跳跃，下滑滑铲。收集 🟡 金币，避开原木和石板。",
      runnerControls: "👉 滑动 ←→ = 跑道 · 上 = 跳 · 下 = 滑铲",
      runnerPlay: "开始", runnerBest: "最高分", runnerLast: "上次得分", runnerOver: "游戏结束！",
      runnerReplay: "再来一次", runnerBack: "← 中心", predictTitle: "🧠 Fitia 预测", predictQuiz: "问答", predictPrognosis: "预测",
      quizStart: "开始问答", quizNext: "下一题", quizScoreLbl: "得分", quizStreak: "连胜",
      quizFinish: "问答结束！", quizAgain: "再来一次", quizGood: "✅ 正确！", quizBad: "❌ 错误！",
      progDesc: "未来 24 小时 FTA 会涨还是跌？", progUp: "📈 涨",
      progDown: "📉 跌", progPick: "你的预测：", progHistory: "历史", progNone: "暂无预测。",
      progRecorded: "预测已记录！即将开奖。", progStaked: "投入",
      training: "训练模式 — 部署 FitiaGameV1 后即可使用 FTA 购买。",
      buyBoost: "购买", boostBought: "挖矿强化已激活！⚡", errFta: "FTA 余额不足。",
      activeBoost: "强化中", noBoost: "无激活强化", price: "价格", duration: "时长",
      ticketBuy: "购买入场券", entryBought: "入场成功！🎟️", loadErr: "游戏加载失败。",
      combo: "连击", fallback2d: "3D 不可用（离线）— 备用 2D 版本。"
    },
    sg: {
      gameNav: "Game", gameTitle: "🎮 Fitia Game", gameHub: "Pick your game",
      tapName: "⚡ Tap Miner", tapDesc: "Tap to overclock your real mining",
      runnerName: "🏃 Fitia Runner 3D", runnerDesc: "Temple Run 3D: run, collect, dodge",
      predictName: "🧠 Fitia Predict", predictDesc: "Crypto quiz and daily predictions",
      tapTitle: "⚡ Tap Miner", tapInfo: "Each tap charges your overclocking. Max 100 energy, +1 every 10 s.",
      tapEnergy: "Energy", tapScore: "Score", tapTap: "TAP!", tapBoostShop: "🚀 BOOST SHOP",
      tapCharges: "Charges", runnerTitle: "🏃 Fitia Runner 3D",
      runnerInfo: "Swipe left/right to switch lanes, swipe up (or space) to jump, swipe down to slide. Collect 🟡 coins, avoid logs and stone slabs.",
      runnerControls: "👉 Swipe ←→ = lane · Up = jump · Down = slide",
      runnerPlay: "PLAY", runnerBest: "Best score", runnerLast: "Last score", runnerOver: "Game over!",
      runnerReplay: "PLAY AGAIN", runnerBack: "← Hub", predictTitle: "🧠 Fitia Predict", predictQuiz: "Quiz", predictPrognosis: "Prediction",
      quizStart: "START QUIZ", quizNext: "NEXT", quizScoreLbl: "Score", quizStreak: "Streak",
      quizFinish: "Quiz finished!", quizAgain: "PLAY AGAIN", quizGood: "✅ Correct!", quizBad: "❌ Wrong!",
      progDesc: "Will FTA go up or down in the next 24 h?", progUp: "📈 UP",
      progDown: "📉 DOWN", progPick: "Your prediction:", progHistory: "History", progNone: "No prediction yet.",
      progRecorded: "Prediction recorded! Resolution coming.", progStaked: "Stake",
      training: "Training mode — deploy FitiaGameV1 to enable FTA purchases.",
      buyBoost: "BUY", boostBought: "Boost activated on your mining! ⚡", errFta: "Insufficient FTA balance.",
      activeBoost: "Active boost", noBoost: "No active boost", price: "Price", duration: "Duration",
      ticketBuy: "BUY ENTRY", entryBought: "Entry recorded! 🎟️", loadErr: "Unable to load the Game.",
      combo: "COMBO", fallback2d: "3D unavailable (offline) — 2D fallback version."
    }
  };
  for (const lang in GAME_I18N) {
    if (i18n[lang]) Object.assign(i18n[lang], GAME_I18N[lang]);
    else i18n[lang] = { ...GAME_I18N[lang] };
  }

  // ─── Vague 2 de traductions : Memory, Roue de la Chance, Crash ───
  const GAME_I18N2 = {
    fr: {
      memName: "🃏 Memory FTA", memDesc: "Retrouve les paires contre le chrono", memTitle: "🃏 Memory FTA",
      memMoves: "Coups", memTime: "Temps", memBest: "Record", memAgain: "RECOMMENCER", memWin: "🎉 Toutes les paires trouvées !",
      wheelName: "🎡 Roue de la Chance", wheelDesc: "Un spin gratuit chaque jour", wheelTitle: "🎡 Roue de la Chance",
      wheelSpin: "TOURNER (1 gratuit / jour)", wheelFree: "Spins restants aujourd'hui", wheelNoSpin: "Déjà utilisé aujourd'hui — reviens demain !",
      wheelWin: "Gagné :", wheelLose: "Pas de chance cette fois…", wheelSoon: "Spins payants en FTA : bientôt on-chain.",
      crashName: "✈️ Fitia Crash", crashDesc: "Encaisse avant le crash, style Aviator", crashTitle: "✈️ Fitia Crash",
      crashBalance: "Crédits", crashLaunch: "🚀 LANÇER", crashCash: "💰 ENCAISSER", crashWin: "Encaissé ! +",
      crashCrashed: "💥 Crash ! Mise perdue.", crashRefill: "♻️ Recharger les crédits (entraînement)", crashStakeMin: "Mise minimum : 10 crédits."
    },
    en: {
      memName: "🃏 FTA Memory", memDesc: "Find the pairs against the clock", memTitle: "🃏 FTA Memory",
      memMoves: "Moves", memTime: "Time", memBest: "Best", memAgain: "PLAY AGAIN", memWin: "🎉 All pairs found!",
      wheelName: "🎡 Lucky Wheel", wheelDesc: "One free spin every day", wheelTitle: "🎡 Lucky Wheel",
      wheelSpin: "SPIN (1 free / day)", wheelFree: "Spins left today", wheelNoSpin: "Already used today — come back tomorrow!",
      wheelWin: "Won:", wheelLose: "No luck this time…", wheelSoon: "Paid FTA spins: coming on-chain.",
      crashName: "✈️ Fitia Crash", crashDesc: "Cash out before the crash, Aviator style", crashTitle: "✈️ Fitia Crash",
      crashBalance: "Credits", crashLaunch: "🚀 LAUNCH", crashCash: "💰 CASH OUT", crashWin: "Cashed out! +",
      crashCrashed: "💥 Crash! Stake lost.", crashRefill: "♻️ Refill credits (training)", crashStakeMin: "Minimum stake: 10 credits."
    },
    de: {
      memName: "🃏 FTA Memory", memDesc: "Finde die Paare gegen die Zeit", memTitle: "🃏 FTA Memory",
      memMoves: "Züge", memTime: "Zeit", memBest: "Rekord", memAgain: "NOCHMAL", memWin: "🎉 Alle Paare gefunden!",
      wheelName: "🎡 Glücksrad", wheelDesc: "Ein Gratis-Dreh pro Tag", wheelTitle: "🎡 Glücksrad",
      wheelSpin: "DREHEN (1 gratis / Tag)", wheelFree: "Spins heute übrig", wheelNoSpin: "Heute schon genutzt — komm morgen wieder!",
      wheelWin: "Gewonnen:", wheelLose: "Diesmal kein Glück…", wheelSoon: "Bezahlte FTA-Spins: bald on-chain.",
      crashName: "✈️ Fitia Crash", crashDesc: "Ziehe dich zurück, bevor es crasht — Aviator-Stil", crashTitle: "✈️ Fitia Crash",
      crashBalance: "Guthaben", crashLaunch: "🚀 START", crashCash: "💰 AUSZAHLEN", crashWin: "Ausgezahlt! +",
      crashCrashed: "💥 Crash! Einsatz verloren.", crashRefill: "♻️ Guthaben aufladen (Training)", crashStakeMin: "Mindesteinsatz: 10 Credits."
    },
    zh: {
      memName: "🃏 FTA 翻牌记忆", memDesc: "限时找出所有配对", memTitle: "🃏 FTA 翻牌记忆",
      memMoves: "步数", memTime: "时间", memBest: "纪录", memAgain: "再来一次", memWin: "🎉 全部配对成功！",
      wheelName: "🎡 幸运转盘", wheelDesc: "每天一次免费旋转", wheelTitle: "🎡 幸运转盘",
      wheelSpin: "旋转（每天 1 次免费）", wheelFree: "今日剩余次数", wheelNoSpin: "今天已用过 — 明天再来！",
      wheelWin: "中奖：", wheelLose: "这次运气不佳…", wheelSoon: "付费 FTA 旋转：即将上线链上版本。",
      crashName: "✈️ Fitia Crash", crashDesc: "在坠毁前套现，Aviator 风格", crashTitle: "✈️ Fitia Crash",
      crashBalance: "积分", crashLaunch: "🚀 起飞", crashCash: "💰 套现", crashWin: "已套现！+",
      crashCrashed: "💥 坠毁！本金损失。", crashRefill: "♻️ 充值积分（训练）", crashStakeMin: "最低投入：10 积分。"
    },
    sg: {
      memName: "🃏 FTA Memory", memDesc: "Find the pairs against the clock", memTitle: "🃏 FTA Memory",
      memMoves: "Moves", memTime: "Time", memBest: "Best", memAgain: "PLAY AGAIN", memWin: "🎉 All pairs found!",
      wheelName: "🎡 Lucky Wheel", wheelDesc: "One free spin every day", wheelTitle: "🎡 Lucky Wheel",
      wheelSpin: "SPIN (1 free / day)", wheelFree: "Spins left today", wheelNoSpin: "Already used today — come back tomorrow!",
      wheelWin: "Won:", wheelLose: "No luck this time…", wheelSoon: "Paid FTA spins: coming on-chain.",
      crashName: "✈️ Fitia Crash", crashDesc: "Cash out before the crash, Aviator style", crashTitle: "✈️ Fitia Crash",
      crashBalance: "Credits", crashLaunch: "🚀 LAUNCH", crashCash: "💰 CASH OUT", crashWin: "Cashed out! +",
      crashCrashed: "💥 Crash! Stake lost.", crashRefill: "♻️ Refill credits (training)", crashStakeMin: "Minimum stake: 10 credits."
    }
  };
  for (const lang in GAME_I18N2) {
    if (i18n[lang]) Object.assign(i18n[lang], GAME_I18N2[lang]);
    else i18n[lang] = { ...GAME_I18N2[lang] };
  }

  // Banque de questions du quiz (6 par langue)
  const QUIZ = {
    fr: [
      { q: "Que signifie « H/s » dans le minage ?", c: ["Hashes par seconde", "Hertz solides", "Hosts serveur"], a: 0 },
      { q: "Quel token sert de paiement stable dans l'app ?", c: ["USDT", "POL", "FTA"], a: 0 },
      { q: "Le staking FTA sert surtout à…", c: ["Verrouiller l'offre et gagner des récompenses", "Payer le gaz", "Créer des NFT"], a: 0 },
      { q: "Polygon est une solution de…", c: ["Layer 2 pour Ethereum", "Portefeuille froid", "Exchange centralisé"], a: 0 },
      { q: "Que fait un boost de puissance ?", c: ["Augmente temporairement ton minage", "Brûle tes machines", "Change ton adresse"], a: 0 },
      { q: "Pourquoi brûler une part des dépenses de jeu ?", c: ["Réduire l'offre en circulation", "Augmenter les frais", "Ralentir le réseau"], a: 0 }
    ],
    en: [
      { q: "What does « H/s » mean in mining?", c: ["Hashes per second", "Solid hertz", "Server hosts"], a: 0 },
      { q: "Which stable token is used for payment in the app?", c: ["USDT", "POL", "FTA"], a: 0 },
      { q: "FTA staking mainly serves to…", c: ["Lock supply and earn rewards", "Pay gas", "Create NFTs"], a: 0 },
      { q: "Polygon is a…", c: ["Layer 2 for Ethereum", "Cold wallet", "Centralized exchange"], a: 0 },
      { q: "What does a power boost do?", c: ["Temporarily increases your mining", "Burns your machines", "Changes your address"], a: 0 },
      { q: "Why burn part of game spending?", c: ["Reduce circulating supply", "Increase fees", "Slow the network"], a: 0 }
    ],
    de: [
      { q: "Was bedeutet « H/s » beim Mining?", c: ["Hashes pro Sekunde", "Hertz solide", "Server-Hosts"], a: 0 },
      { q: "Welcher Stablecoin dient in der App als Zahlungsmittel?", c: ["USDT", "POL", "FTA"], a: 0 },
      { q: "Das FTA-Staking dient vor allem dazu…", c: ["das Angebot zu sperren und Belohnungen zu verdienen", "Gas zu zahlen", "NFTs zu erstellen"], a: 0 },
      { q: "Polygon ist eine…", c: ["Layer 2 für Ethereum", "Cold Wallet", "zentralisierte Börse"], a: 0 },
      { q: "Was macht ein Power-Boost?", c: ["erhöht vorübergehend dein Mining", "verbrennt deine Maschinen", "ändert deine Adresse"], a: 0 },
      { q: "Warum einen Teil der Spielausgaben verbrennen?", c: ["Umlaufmenge reduzieren", "Gebühren erhöhen", "Netzwerk verlangsamen"], a: 0 }
    ],
    zh: [
      { q: "挖矿中的「H/s」是什么意思？", c: ["每秒哈希数", "固体赫兹", "服务器主机"], a: 0 },
      { q: "应用中用于支付的稳定币是？", c: ["USDT", "POL", "FTA"], a: 0 },
      { q: "FTA 质押的主要作用是…", c: ["锁定供应并获得奖励", "支付 gas", "创建 NFT"], a: 0 },
      { q: "Polygon 是以太坊的…", c: ["Layer 2 方案", "冷钱包", "中心化交易所"], a: 0 },
      { q: "算力强化的作用是？", c: ["临时提升你的挖矿", "烧掉你的机器", "更换地址"], a: 0 },
      { q: "为什么燃烧一部分游戏支出？", c: ["减少流通供应量", "提高费用", "拖慢网络"], a: 0 }
    ],
    sg: [
      { q: "What does « H/s » mean in mining?", c: ["Hashes per second", "Solid hertz", "Server hosts"], a: 0 },
      { q: "Which stable token is used for payment in the app?", c: ["USDT", "POL", "FTA"], a: 0 },
      { q: "FTA staking mainly serves to…", c: ["Lock supply and earn rewards", "Pay gas", "Create NFTs"], a: 0 },
      { q: "Polygon is a…", c: ["Layer 2 for Ethereum", "Cold wallet", "Centralized exchange"], a: 0 },
      { q: "What does a power boost do?", c: ["Temporarily increases your mining", "Burns your machines", "Changes your address"], a: 0 },
      { q: "Why burn part of game spending?", c: ["Reduce circulating supply", "Increase fees", "Slow the network"], a: 0 }
    ]
  };

  // ─── Utilitaires ─────────────────────────────────────────────────
  function ready() {
    const a = (CONFIG.GAME || '').trim();
    return /^0x[a-fA-F0-9]{40}$/.test(a);
  }
  function c() {
    if (!GAME.contract) GAME.contract = new ethers.Contract(CONFIG.GAME, GAME_ABI, App.signer || App.provider);
    return GAME.contract;
  }
  function fmtFta(raw) { return Number(ethers.formatUnits(raw, 8)); }
  function lsGet(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function show(id) {
    ['game-hub', 'game-tap', 'game-runner', 'game-predict', 'game-memory', 'game-wheel', 'game-crash'].forEach(p => {
      const el = document.getElementById(p);
      if (el) el.classList.toggle('hidden', p !== id);
    });
    // Économie de batterie : stoppe les rendus/chrono quand on quitte un jeu
    if (id !== 'game-runner') Runner3D.stop();
    if (id !== 'game-memory') Memory.stopTimer();
    if (id !== 'game-crash') Crash.abort();
  }

  // ═══════════════ JEU A — TAP MINER (juteux : ripples, combo, vibration) ═══════════════
  const Tap = {
    score: 0, charges: 0, timer: null, combo: 0, comboUntil: 0,
    energy() { return lsGet('fitia_tap_energy', 100); },
    setEnergy(v) { lsSet('fitia_tap_energy', Math.max(0, Math.min(100, v))); },
    lastTick() { return lsGet('fitia_tap_tick', Date.now()); },
    regen() {
      const now = Date.now(), last = this.lastTick();
      const gained = Math.floor((now - last) / 10000);
      if (gained > 0) { this.setEnergy(this.energy() + gained); lsSet('fitia_tap_tick', last + gained * 10000); }
      if (this.energy() >= 100) lsSet('fitia_tap_tick', now);
    },
    open() {
      show('game-tap');
      this.regen(); this.score = 0; this.charges = 0; this.combo = 0;
      this.render(); this.startRegenTick();
    },
    startRegenTick() {
      clearInterval(this.timer);
      this.timer = setInterval(() => { this.regen(); const e = document.getElementById('tap-energy-bar'); if (e) { e.style.width = this.energy() + '%'; const t = document.getElementById('tap-energy-txt'); if (t) t.innerText = this.energy() + ' / 100'; } }, 2000);
    },
    tap(evt) {
      if (this.energy() <= 0) return;
      this.setEnergy(this.energy() - 1);
      // Combo : tapes enchaînées à moins de 450 ms → ×2 points
      const now = Date.now();
      if (now - this.comboUntil < 450) this.combo++; else this.combo = 1;
      this.comboUntil = now;
      const mult = this.combo >= 10 ? 2 : 1;
      this.score += mult;
      if (this.score % 25 === 0) this.charges++;
      // Effets visuels : ripple + texte flottant + vibration
      const zone = document.getElementById('tap-zone');
      if (zone) {
        const r = document.createElement('span');
        r.className = 'tap-ripple';
        zone.appendChild(r);
        setTimeout(() => r.remove(), 500);
        const f = document.createElement('span');
        f.className = 'tap-float';
        f.innerText = mult > 1 ? '+2' : '+1';
        f.style.left = (20 + Math.random() * 60) + '%';
        zone.appendChild(f);
        setTimeout(() => f.remove(), 700);
      }
      if (navigator.vibrate) { try { navigator.vibrate(mult > 1 ? 18 : 8); } catch (e) {} }
      const cb = document.getElementById('tap-combo');
      if (cb) {
        if (mult > 1) { cb.innerText = `${App.t('combo')} ×2 🔥`; cb.classList.add('on'); }
        else { cb.classList.remove('on'); cb.innerText = ''; }
      }
      this.render();
    },
    render() {
      const s = document.getElementById('tap-score'); if (s) s.innerText = this.score;
      const ch = document.getElementById('tap-charges'); if (ch) ch.innerText = '⚡'.repeat(Math.min(this.charges, 10));
      const e = document.getElementById('tap-energy-bar'); if (e) e.style.width = this.energy() + '%';
      const t = document.getElementById('tap-energy-txt'); if (t) t.innerText = this.energy() + ' / 100';
    },
    async openBoostShop() {
      if (!ready()) { App.showToast(App.t('training'), true); return; }
      if (!App.user) { App.showToast(App.t('finConnect'), true); return; }
      try {
        App.setLoader(true, 'Game...');
        const n = Number(await c().boostTierCount());
        const reads = []; for (let i = 0; i < n; i++) reads.push(c().boostTierInfo(i));
        const tiers = await Promise.all(reads);
        App.setLoader(false);
        const html = tiers.map((t, i) => {
          const mult = (Number(t.multBps) / 10000).toFixed(2);
          const hrs = (Number(t.dur) / 3600).toFixed(1);
          return `<div class="asset-row">
            <div class="asset-info">
              <div class="asset-name">⚡ ×${mult}</div>
              <div class="asset-detail">${App.t('duration')} : ${hrs} h</div>
            </div>
            <button class="btn-sm btn-full" style="padding:7px 12px;font-size:0.7rem;max-width:110px;" onclick="App.gameBuyBoost(${i})">${App.t('buyBoost')} · ${fmtFta(t.price).toFixed(1)} FTA</button>
          </div>`;
        }).join('');
        document.getElementById('tap-boost-list').innerHTML = html + `<p class="small-text" style="margin-top:8px;">🔥 30 % burn · 70 % cagnotte</p>`;
        document.getElementById('modal-boost').classList.add('active');
      } catch (e) { App.setLoader(false); App.showError(e); }
    },
    async buyBoost(tierId) {
      try {
        App.setLoader(true, 'Boost...');
        const tx = await c().buyBoost(tierId);
        await tx.wait();
        App.setLoader(false);
        App.closeModals();
        App.showToast(App.t('boostBought'));
      } catch (e) { App.setLoader(false); App.showError(e); }
    }
  };

  // ═══════════════ JEU B — RUNNER 3D (façon Temple Run, Three.js) ═══════════════
  const Runner3D = {
    renderer: null, scene: null, camera: null, avatar: null, parts: {},
    lanes: [-1.7, 0, 1.7], lane: 1,
    y: 0, vy: 0, speed: 10, running: false, dead: false,
    dist: 0, score: 0, coinsRun: 0, best: 0,
    obst: [], coins: [], deco: [], slideT: 0, sliding: false, nextSpawn: 14, nextCoin: 8,
    raf: null, t: 0, keys: {},
    LANE_T: 0.18,

    ok() { return typeof THREE !== 'undefined'; },

    // Détection réelle de WebGL (certains téléphones/WebView le désactivent)
    webglOK() {
      try {
        const t = document.createElement('canvas');
        return !!(t.getContext('webgl') || t.getContext('experimental-webgl'));
      } catch (e) { return false; }
    },

    init() {
      if (!this.ok() || !this.webglOK()) return false;
      const wrap = document.getElementById('runner-3d');
      if (!wrap) return false;
      if (!this.renderer) {
        try {
        // Réglages doux pour téléphone : pas d'antialias, DPR ≤ 1, préférence GPU neutre
        this.renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'default', failIfMajorPerformanceCaveat: false });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1));
        this.renderer.setSize(wrap.clientWidth || 358, 300);
        wrap.appendChild(this.renderer.domElement);
        // Perte de contexte WebGL (fréquente en arrière-plan sur mobile) → repli 2D
        this.renderer.domElement.addEventListener('webglcontextlost', (e) => { e.preventDefault(); this.fallback2D(); }, false);

        this.scene = new THREE.Scene();
        // Ciel brumeux de jungle (vert-bleu clair) + brouillard assorti, façon Temple Run 2
        this.scene.background = new THREE.Color(0xa8c8c0);
        this.scene.fog = new THREE.Fog(0xa8c8c0, 16, 58);

        this.camera = new THREE.PerspectiveCamera(62, (wrap.clientWidth || 358) / 300, 0.1, 120);
        this.camera.position.set(0, 4.6, 6.8);
        this.camera.lookAt(0, 1.5, -8);

        // Lumières jungle : ciel clair + soleil chaud
        this.scene.add(new THREE.HemisphereLight(0xd8efe6, 0x2f4a3a, 1.05));
        const dir = new THREE.DirectionalLight(0xfff2c8, 0.95);
        dir.position.set(4, 10, 3);
        this.scene.add(dir);

        const PATH_W = 6.6;
        // Eau turquoise de part et d'autre du pont de pierre
        const waterMat = new THREE.MeshBasicMaterial({ color: 0x2e8f8a });
        const waterL = new THREE.Mesh(new THREE.PlaneGeometry(40, 130), waterMat);
        waterL.rotation.x = -Math.PI / 2; waterL.position.set(-PATH_W / 2 - 20, -0.6, -45);
        this.scene.add(waterL);
        const waterR = waterL.clone(); waterR.position.x = PATH_W / 2 + 20;
        this.scene.add(waterR);

        // Pont de pierre : tablier + joints sombres défilants (illusion cobblestone)
        const deck = new THREE.Mesh(new THREE.BoxGeometry(PATH_W, 0.5, 130), new THREE.MeshLambertMaterial({ color: 0xb9a27b }));
        deck.position.set(0, -0.25, -45);
        this.scene.add(deck);
        const seamMat = new THREE.MeshLambertMaterial({ color: 0x8f7a58 });
        for (let i = 0; i < 30; i++) {
          const seam = new THREE.Mesh(new THREE.BoxGeometry(PATH_W, 0.52, 0.18), seamMat);
          seam.position.set(0, -0.24, -i * 4);
          this.scene.add(seam);
          this.deco.push({ m: seam, span: 120 });
        }
        // Garde-corps en pierre + piliers dorés + buissons de jungle (2 côtés)
        const railMat = new THREE.MeshLambertMaterial({ color: 0xa8916a });
        const pilMat = new THREE.MeshLambertMaterial({ color: 0xc7b28a });
        const capMat = new THREE.MeshBasicMaterial({ color: 0xF0B90B });
        const bushMat = new THREE.MeshLambertMaterial({ color: 0x2e6b45 });
        for (let i = 0; i < 10; i++) {
          const z = -i * 6;
          for (const side of [-1, 1]) {
            const rail = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.7, 5.6), railMat);
            rail.position.set(side * (PATH_W / 2 + 0.2), 0.55, z - 2.8);
            this.scene.add(rail);
            const pil = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.6, 0.5), pilMat);
            pil.position.set(side * (PATH_W / 2 + 0.2), 0.8, z);
            this.scene.add(pil);
            const cap = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.12, 0.58), capMat);
            cap.position.set(side * (PATH_W / 2 + 0.2), 1.66, z);
            this.scene.add(cap);
            const bush = new THREE.Mesh(new THREE.SphereGeometry(0.55, 7, 6), bushMat);
            bush.position.set(side * (PATH_W / 2 + 0.25), 2.15, z);
            this.scene.add(bush);
            this.deco.push({ m: rail, span: 60 }, { m: pil, span: 60 }, { m: cap, span: 60 }, { m: bush, span: 60 });
          }
        }
        // Lianes suspendues (canopée au-dessus du pont)
        const vineMat = new THREE.MeshLambertMaterial({ color: 0x24502f });
        for (let i = 0; i < 6; i++) {
          const vine = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.09, 2.2, 5), vineMat);
          vine.position.set(-2.4 + i * 1.0, 4.6, -10 - i * 7);
          this.scene.add(vine);
          this.deco.push({ m: vine, span: 42 });
        }

        this.buildAvatar();

        // Géométries/matériaux partagés (évite d'en recréer à chaque spawn)
        this.geoLow = new THREE.CylinderGeometry(0.42, 0.42, 1.5, 10);  // tronc d'arbre à sauter
        this.matLow = new THREE.MeshLambertMaterial({ color: 0x6e4a2a });
        this.geoHigh = new THREE.BoxGeometry(1.35, 2.5, 0.4);           // dalle de pierre à esquiver/glisser
        this.matHigh = new THREE.MeshLambertMaterial({ color: 0xc7b28a });
        this.matTrim = new THREE.MeshBasicMaterial({ color: 0xF0B90B });
        this.geoCoin = new THREE.CylinderGeometry(0.36, 0.36, 0.09, 14);
        this.matCoin = new THREE.MeshBasicMaterial({ color: 0xF0B90B });

        this.bindControls(wrap);
        } catch (e) {
          // Échec de création WebGL (téléphones modestes / WebView) → repli 2D propre
          console.warn('Runner3D init:', e);
          if (this.renderer) { try { this.renderer.dispose(); } catch (e2) {} }
          this.renderer = null;
          return false;
        }
      }
      return true;
    },

    // Avatar « exploratrice » vu de dos, façon Temple Run (ponytail, débardeur blanc, kaki, bottes)
    buildAvatar() {
      const g = new THREE.Group();
      const skin = new THREE.MeshLambertMaterial({ color: 0xd9a06b });
      const hair = new THREE.MeshLambertMaterial({ color: 0x6b3a1f });
      const top = new THREE.MeshLambertMaterial({ color: 0xf5f5f0 });
      const pants = new THREE.MeshLambertMaterial({ color: 0x5a6b3c });
      const boots = new THREE.MeshLambertMaterial({ color: 0x2a2320 });
      const sashM = new THREE.MeshLambertMaterial({ color: 0xc0392b });

      const torso = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.55, 0.26), top);
      torso.position.y = 1.02; g.add(torso);
      const sash = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.08, 0.28), sashM);
      sash.position.y = 0.8; g.add(sash);
      const hips = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.2, 0.26), pants);
      hips.position.y = 0.66; g.add(hips);
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), skin);
      head.position.y = 1.5; g.add(head);
      const hairM = new THREE.Mesh(new THREE.BoxGeometry(0.33, 0.14, 0.33), hair);
      hairM.position.y = 1.67; g.add(hairM);
      const pony = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.32, 0.1), hair);
      pony.position.set(0, 1.48, 0.19); g.add(pony);   // queue de cheval (visible de dos)

      // Membres : pivots aux épaules/hanches pour l'animation de course
      const mkLimb = (w, h, x, y, mat, footMat) => {
        const pivot = new THREE.Group();
        pivot.position.set(x, y, 0);
        const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, w), mat);
        m.position.y = -h / 2;
        pivot.add(m);
        if (footMat) {
          const f = new THREE.Mesh(new THREE.BoxGeometry(w + 0.05, 0.12, w + 0.12), footMat);
          f.position.y = -h - 0.04;
          pivot.add(f);
        }
        g.add(pivot);
        return pivot;
      };
      this.parts.armL = mkLimb(0.11, 0.46, -0.3, 1.26, skin);
      this.parts.armR = mkLimb(0.11, 0.46, 0.3, 1.26, skin);
      this.parts.legL = mkLimb(0.14, 0.42, -0.11, 0.58, pants, boots);
      this.parts.legR = mkLimb(0.14, 0.42, 0.11, 0.58, pants, boots);

      g.position.set(0, 0, 0);
      this.avatar = g;
      this.scene.add(g);

      // Ombre portée simple au sol (suit le joueur, s'amincit en saut)
      const shadow = new THREE.Mesh(new THREE.CircleGeometry(0.42, 12), new THREE.MeshBasicMaterial({ color: 0x1a2a20, transparent: true, opacity: 0.35 }));
      shadow.rotation.x = -Math.PI / 2;
      shadow.position.y = 0.03;
      this.shadow = shadow;
      this.scene.add(shadow);
    },

    bindControls(wrap) {
      // Glisser = changer de couloir · Tap = saut (tactile + clavier)
      let sx = 0, sy = 0, moved = false;
      const el = this.renderer.domElement;
      el.style.touchAction = 'none';
      el.addEventListener('touchstart', e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; moved = false; }, { passive: true });
      el.addEventListener('touchmove', e => {
        if (moved) return;
        const dx = e.touches[0].clientX - sx, dy = e.touches[0].clientY - sy;
        if (Math.abs(dx) > 28 && Math.abs(dx) > Math.abs(dy)) { this.move(dx > 0 ? 1 : -1); moved = true; }
        else if (dy < -30) { this.jump(); moved = true; }
        else if (dy > 30) { this.slide(); moved = true; }
      }, { passive: true });
      el.addEventListener('touchend', () => { if (!moved) this.jump(); }, { passive: true });
      el.addEventListener('mousedown', () => this.jump());
      window.addEventListener('keydown', e => {
        if (e.code === 'ArrowLeft' || e.code === 'KeyA') this.move(-1);
        else if (e.code === 'ArrowRight' || e.code === 'KeyD') this.move(1);
        else if (e.code === 'Space' || e.code === 'ArrowUp') this.jump();
        else if (e.code === 'ArrowDown' || e.code === 'KeyS') this.slide();
      });
    },

    move(dir) {
      if (!this.running) return;
      this.lane = Math.max(0, Math.min(2, this.lane + dir));
    },
    jump() {
      if (!this.running) { this.start(); return; }
      if (this.y <= 0.01) { this.vy = 7.4; if (navigator.vibrate) { try { navigator.vibrate(12); } catch (e) {} } }
    },
    slide() {
      if (!this.running) return;
      if (this.y <= 0.01) { this.slideT = 0.75; if (navigator.vibrate) { try { navigator.vibrate(10); } catch (e) {} } }
    },

    open() {
      show('game-runner');
      if (this.ok() && this.webglOK()) {
        // 3D : affiche le conteneur WebGL, masque le repli 2D
        const w3 = document.getElementById('runner-3d');
        const c2 = document.getElementById('runner-canvas');
        w3.classList.remove('hidden'); c2.style.display = 'none';
        if (!this.init()) { this.fallback2D(); return; }
        // Redimensionne maintenant que le panneau est visible
        const wrap = document.getElementById('runner-3d');
        const w = wrap.clientWidth || 358;
        this.renderer.setSize(w, 300);
        this.camera.aspect = w / 300;
        this.camera.updateProjectionMatrix();
      } else {
        // Filet de sécurité : Three.js pas chargé (hors ligne) → version 2D
        const w = document.getElementById('runner-3d'); if (w) w.classList.add('hidden');
        const c2 = document.getElementById('runner-canvas'); if (c2) c2.style.display = 'block';
        App.showToast(App.t('fallback2d'), true);
        Runner2D.open();
        return;
      }
      this.best = lsGet('fitia_runner_best', 0);
      const b = document.getElementById('runner-best'); if (b) b.innerText = this.best;
      const scores = lsGet('fitia_runner_scores', []);
      const l = document.getElementById('runner-last'); if (l) l.innerText = scores.length ? scores[0].s : 0;
      this.resetWorld(); this.renderFrame();
    },

    resetWorld() {
      this.lane = 1; this.y = 0; this.vy = 0; this.speed = 10;
      this.dist = 0; this.score = 0; this.coinsRun = 0;
      this.nextSpawn = 14; this.nextCoin = 8;
      this.obst.forEach(o => this.scene.remove(o.mesh)); this.obst = [];
      this.coins.forEach(cn => this.scene.remove(cn.mesh)); this.coins = [];
      this.dead = false; this.running = false; this.slideT = 0; this.sliding = false;
      this.avatar.scale.y = 1;
      const ov = document.getElementById('runner-over-txt'); if (ov) ov.innerText = '';
    },

    start() {
      this.resetWorld(); this.running = true; this.stopped = false;
      if (this.raf) cancelAnimationFrame(this.raf);
      this.loop();
    },

    spawn(zPos) {
      // 1 à 2 couloirs bloqués (jamais les 3) : tronc bas (saut) ou dalle haute (esquive/glissade)
      const lanesToBlock = Math.random() < 0.35 ? 2 : 1;
      const lanes = [0, 1, 2].sort(() => Math.random() - 0.5).slice(0, lanesToBlock);
      for (const ln of lanes) {
        const high = Math.random() < 0.45;
        const m = new THREE.Mesh(high ? this.geoHigh : this.geoLow, high ? this.matHigh : this.matLow);
        if (high) {
          m.position.set(this.lanes[ln], 1.25, zPos);
          const trim = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.1, 0.46), this.matTrim);
          trim.position.y = 1.25;
          m.add(trim);
        } else {
          m.rotation.z = Math.PI / 2;                       // tronc couché en travers du couloir
          m.position.set(this.lanes[ln], 0.42, zPos);
        }
        this.scene.add(m);
        this.obst.push({ mesh: m, lane: ln, high });
      }
    },

    spawnCoin() {
      const ln = Math.floor(Math.random() * 3);
      const cn = new THREE.Mesh(this.geoCoin, this.matCoin);
      cn.rotation.x = Math.PI / 2;
      cn.position.set(this.lanes[ln], 1.1, -60);
      this.scene.add(cn);
      this.coins.push({ mesh: cn, lane: ln });
    },

    loop() {
      if (this.stopped) return; // chaîne rAF cassée par stop() : plus aucune frame résiduelle
      if (!this.running || document.hidden) { this.raf = requestAnimationFrame(() => this.loop()); return; }
      // Toute erreur WebGL/runtime bascule proprement en version 2D
      try { this.frame(); } catch (e) { console.warn('Runner3D loop:', e); this.fallback2D(); return; }
      this.raf = requestAnimationFrame(() => this.loop());
    },

    frame() {
      const dt = 1 / 60;
      this.t += dt;
      this.speed = Math.min(22, this.speed + 0.003);
      this.dist += this.speed * dt;
      this.score = Math.floor(this.dist) + this.coinsRun * 10;

      // Couloir : interpolation douce vers la position cible
      const targetX = this.lanes[this.lane];
      this.avatar.position.x += (targetX - this.avatar.position.x) * this.LANE_T;
      // Saut : physique simple
      if (this.y > 0 || this.vy > 0) { this.vy -= 22 * dt; this.y += this.vy * dt; if (this.y < 0) { this.y = 0; this.vy = 0; } }
      // Glissade (swipe bas) : avatar aplati, passe sous les dalles hautes
      if (this.slideT > 0) this.slideT -= dt;
      this.sliding = this.slideT > 0 && this.y <= 0.01;
      this.avatar.scale.y = this.sliding ? 0.55 : 1;
      // Animation de course (membres)
      const swing = this.y > 0.05 ? 1.4 : Math.sin(this.t * 14) * 0.75;
      this.parts.legL.rotation.x = swing; this.parts.legR.rotation.x = -swing;
      this.parts.armL.rotation.x = -swing * 0.8; this.parts.armR.rotation.x = swing * 0.8;
      this.avatar.position.y = this.y + (this.y > 0.05 ? 0 : Math.abs(Math.sin(this.t * 14)) * 0.05);

      // Défilement du décor (chaque élément recycle selon sa propre période)
      this.deco.forEach(d => { d.m.position.z += this.speed * dt; if (d.m.position.z > 6) d.m.position.z -= d.span; });

      // Apparitions espacées, mesurées en distance parcourue (meshes à z=-60)
      if (this.dist > this.nextSpawn) { this.spawn(-60); this.nextSpawn = this.dist + 24; }
      if (this.dist > this.nextCoin) { this.spawnCoin(); this.nextCoin = this.dist + 14; }
      this.obst.forEach(o => { o.mesh.position.z += this.speed * dt; });
      this.coins.forEach(cn => { cn.mesh.position.z += this.speed * dt; cn.mesh.rotation.z += 0.1; });

      // Collisions (avatar à z=0)
      const ax = this.avatar.position.x, ay = this.y;
      for (let i = this.obst.length - 1; i >= 0; i--) {
        const o = this.obst[i], z = o.mesh.position.z;
        if (z > 8) { this.scene.remove(o.mesh); this.obst.splice(i, 1); continue; }
        if (z > -0.55 && z < 0.55 && Math.abs(ax - o.mesh.position.x) < 0.85) {
          // Tronc bas : passer en sautant · Dalle haute : passer en glissade ou en changeant de couloir
          const canPass = (o.high === false && ay > 0.85) || (o.high === true && this.sliding);
          if (!canPass) { this.gameOver(); return; }
        }
      }
      for (let i = this.coins.length - 1; i >= 0; i--) {
        const cn = this.coins[i], z = cn.mesh.position.z;
        if (z > 8) { this.scene.remove(cn.mesh); this.coins.splice(i, 1); continue; }
        if (z > -0.7 && z < 0.7 && Math.abs(ax - cn.mesh.position.x) < 0.8 && ay < 1.6) {
          this.coinsRun++; this.score += 10;
          this.scene.remove(cn.mesh); this.coins.splice(i, 1);
        }
      }

      // Caméra poursuite au-dessus de l'épaule (façon Temple Run)
      this.camera.position.set(this.avatar.position.x * 0.4, 4.6, 6.8);
      this.camera.lookAt(this.avatar.position.x * 0.5, 1.5, -8);
      // Ombre au sol sous le joueur
      if (this.shadow) {
        this.shadow.position.set(this.avatar.position.x, 0.03, 0);
        const shScale = Math.max(0.4, 1 - this.y * 0.5);
        this.shadow.scale.set(shScale, shScale, 1);
      }

      this.renderer.render(this.scene, this.camera);
      const sc = document.getElementById('runner-score-3d');
      if (sc) sc.innerText = this.score;
      const cc = document.getElementById('runner-coins-3d');
      if (cc) cc.innerText = '🟡 ' + this.coinsRun;
    },

    renderFrame() { if (this.renderer) this.renderer.render(this.scene, this.camera); },

    // Bascule propre vers la version 2D (échec WebGL / perte de contexte)
    fallback2D() {
      this.stop();
      try { if (this.renderer) this.renderer.dispose(); } catch (e) {}
      this.renderer = null;
      const w = document.getElementById('runner-3d'); if (w) w.classList.add('hidden');
      const c2 = document.getElementById('runner-canvas'); if (c2) c2.style.display = 'block';
      App.showToast(App.t('fallback2d'), true);
      Runner2D.open();
    },

    stop() {
      this.running = false;
      this.stopped = true;
      if (this.raf) { cancelAnimationFrame(this.raf); this.raf = null; }
    },

    gameOver() {
      this.running = false;
      this.best = Math.max(this.best, this.score);
      lsSet('fitia_runner_best', this.best);
      const scores = lsGet('fitia_runner_scores', []);
      scores.unshift({ s: this.score, d: new Date().toISOString().slice(0, 10) });
      lsSet('fitia_runner_scores', scores.slice(0, 5));
      const ov = document.getElementById('runner-over-txt');
      if (ov) ov.innerText = `${App.t('runnerOver')} ${this.score} · ${App.t('runnerBest')} : ${this.best}`;
      const b = document.getElementById('runner-best'); if (b) b.innerText = this.best;
      const l = document.getElementById('runner-last'); if (l) l.innerText = this.score;
      if (navigator.vibrate) { try { navigator.vibrate([60, 40, 60]); } catch (e) {} }
      this.renderFrame();
    }
  };

  // Filet de sécurité 2D si Three.js n'est pas chargé (hors ligne)
  const Runner2D = {
    cv: null, ctx: null, raf: null, running: false,
    y: 0, vy: 0, speed: 3, obst: [], coins: [], dist: 0, score: 0, best: 0, coinsCollected: 0,
    H: 240, W: 358, GROUND: 200, GRAV: 0.45, JUMP: -7.6,
    open() {
      this.cv = document.getElementById('runner-canvas');
      this.ctx = this.cv.getContext('2d');
      this.best = lsGet('fitia_runner_best', 0);
      this.drawIdle();
    },
    start() {
      this.y = this.GROUND - 26; this.vy = 0; this.speed = 3; this.obst = []; this.coins = [];
      this.dist = 0; this.score = 0; this.coinsCollected = 0; this.running = true;
      if (this.raf) cancelAnimationFrame(this.raf);
      this.loop();
    },
    jump() {
      if (!this.running) { this.start(); return; }
      if (this.y >= this.GROUND - 27) this.vy = this.JUMP;
    },
    loop() {
      if (!this.running || document.hidden) { this.raf = requestAnimationFrame(() => this.loop()); return; }
      const ctx = this.ctx, W = this.W, H = this.H;
      this.vy += this.GRAV; this.y += this.vy;
      if (this.y > this.GROUND - 26) { this.y = this.GROUND - 26; this.vy = 0; }
      this.speed += 0.0015; this.dist += this.speed;
      this.score = Math.floor(this.dist) + this.coinsCollected * 10;
      if (Math.random() < 0.012 + this.speed * 0.002) this.obst.push({ x: W + 20, w: 16 + Math.random() * 14, h: 18 + Math.random() * 22 });
      if (Math.random() < 0.02) this.coins.push({ x: W + 20, y: 120 + Math.random() * 60, taken: false });
      this.obst.forEach(o => o.x -= this.speed);
      this.coins.forEach(cn => cn.x -= this.speed);
      this.obst = this.obst.filter(o => o.x > -40);
      this.coins = this.coins.filter(cn => cn.x > -30 && !cn.taken);
      const px = 40, py = this.y, pw = 26, ph = 26;
      for (const o of this.obst) {
        if (px + pw > o.x && px < o.x + o.w && py + ph > this.GROUND - o.h) { this.gameOver(); return; }
      }
      for (const cn of this.coins) {
        if (px + pw > cn.x && px < cn.x + 14 && py < cn.y + 14 && py + ph > cn.y) { cn.taken = true; this.coinsCollected++; this.score += 10; }
      }
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#04070f'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = 'rgba(240,185,11,0.08)'; ctx.fillRect(0, this.GROUND, W, H - this.GROUND);
      ctx.fillStyle = '#22d3ee'; ctx.fillRect(0, this.GROUND, W, 2);
      ctx.fillStyle = '#F0B90B'; ctx.fillRect(px, py, pw, ph);
      ctx.fillStyle = '#04070f'; ctx.fillRect(px + 16, py + 6, 6, 6);
      ctx.fillStyle = '#f43f5e';
      this.obst.forEach(o => ctx.fillRect(o.x, this.GROUND - o.h, o.w, o.h));
      ctx.fillStyle = '#22d3ee';
      this.coins.forEach(cn => { ctx.beginPath(); ctx.arc(cn.x + 7, cn.y + 7, 7, 0, 6.29); ctx.fill(); });
      ctx.fillStyle = '#8ea0bd'; ctx.font = '12px monospace';
      ctx.fillText(this.score, 10, 18);
      this.raf = requestAnimationFrame(() => this.loop());
    },
    gameOver() {
      this.running = false;
      this.best = Math.max(this.best, this.score);
      lsSet('fitia_runner_best', this.best);
      const scores = lsGet('fitia_runner_scores', []);
      scores.unshift({ s: this.score, d: new Date().toISOString().slice(0, 10) });
      lsSet('fitia_runner_scores', scores.slice(0, 5));
      const ov = document.getElementById('runner-over-txt');
      if (ov) ov.innerText = `${App.t('runnerOver')} ${this.score} · ${App.t('runnerBest')} : ${this.best}`;
      this.drawIdle();
    },
    drawIdle() {
      if (!this.ctx) return;
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.W, this.H);
      ctx.fillStyle = '#04070f'; ctx.fillRect(0, 0, this.W, this.H);
      ctx.fillStyle = '#22d3ee'; ctx.fillRect(0, this.GROUND, this.W, 2);
      ctx.fillStyle = '#F0B90B'; ctx.fillRect(40, this.GROUND - 26, 26, 26);
      ctx.fillStyle = '#8ea0bd'; ctx.font = '12px monospace';
      ctx.fillText(App.t('runnerPlay') + ' · ' + App.t('runnerBest') + ' : ' + this.best, 90, 110);
    }
  };

  // ═══════════════ JEU C — PREDICT (quiz + pronostic) ═══════════════
  const Predict = {
    qi: 0, qScore: 0, answered: false,
    open() { show('game-predict'); this.renderHub(); this.renderPrognosis(); const sl = document.getElementById('quiz-streak-lbl'); if (sl) sl.innerText = `${App.t('quizStreak')} : ${lsGet('fitia_quiz_streak', 0)} 🔥`; },
    renderHub() {
      document.getElementById('predict-start').classList.remove('hidden');
      document.getElementById('predict-play').classList.add('hidden');
      const again = document.getElementById('quiz-again'); if (again) again.classList.add('hidden');
    },
    startQuiz() {
      const bank = QUIZ[App.currentLang] || QUIZ.en;
      this.bank = bank.slice(); this.qi = 0; this.qScore = 0;
      document.getElementById('predict-start').classList.add('hidden');
      document.getElementById('predict-play').classList.remove('hidden');
      const again = document.getElementById('quiz-again'); if (again) again.classList.add('hidden');
      this.showQ();
    },
    showQ() {
      const q = this.bank[this.qi];
      document.getElementById('quiz-num').innerText = `${this.qi + 1} / ${this.bank.length}`;
      document.getElementById('quiz-q').innerText = q.q;
      document.getElementById('quiz-feedback').innerText = '';
      const bar = document.getElementById('quiz-progress');
      if (bar) bar.style.width = Math.round((this.qi / this.bank.length) * 100) + '%';
      const box = document.getElementById('quiz-choices');
      box.innerHTML = '';
      const idx = q.c.map((_, i) => i).sort(() => Math.random() - 0.5);
      this.correct = idx.indexOf(q.a);
      idx.forEach((ci, pos) => {
        const b = document.createElement('button');
        b.className = 'quiz-choice';
        b.innerText = q.c[ci];
        b.onclick = () => this.answer(pos, b);
        box.appendChild(b);
      });
      document.getElementById('quiz-next').classList.add('hidden');
      this.answered = false;
    },
    answer(pos, btn) {
      if (this.answered) return;
      this.answered = true;
      const ok = pos === this.correct;
      if (ok) { this.qScore++; btn.classList.add('good'); document.getElementById('quiz-feedback').innerText = App.t('quizGood'); }
      else { btn.classList.add('bad'); document.getElementById('quiz-feedback').innerText = App.t('quizBad'); }
      document.getElementById('quiz-next').classList.remove('hidden');
    },
    nextQ() {
      this.qi++;
      if (this.qi >= this.bank.length) {
        const streak = lsGet('fitia_quiz_streak', 0);
        lsSet('fitia_quiz_streak', this.qScore === this.bank.length ? streak + 1 : 0);
        document.getElementById('quiz-q').innerText = `${App.t('quizFinish')} ${this.qScore}/${this.bank.length}`;
        document.getElementById('quiz-choices').innerHTML = '';
        document.getElementById('quiz-feedback').innerText = `${App.t('quizStreak')} : ${lsGet('fitia_quiz_streak', 0)} 🔥`;
        document.getElementById('quiz-next').classList.add('hidden');
        const again = document.getElementById('quiz-again'); if (again) again.classList.remove('hidden');
        const bar = document.getElementById('quiz-progress'); if (bar) bar.style.width = '100%';
      } else this.showQ();
    },
    recordPrediction(dir) {
      const hist = lsGet('fitia_prog_history', []);
      hist.unshift({ dir, price: App.ftaPriceUsd || 0, at: new Date().toISOString().slice(0, 16).replace('T', ' ') });
      lsSet('fitia_prog_history', hist.slice(0, 8));
      App.showToast(App.t('progRecorded'));
      this.renderPrognosis();
    },
    renderPrognosis() {
      const list = document.getElementById('prog-history');
      if (!list) return;
      const hist = lsGet('fitia_prog_history', []);
      if (!hist.length) { list.innerHTML = `<p class="small-text" style="text-align:center;">${App.t('progNone')}</p>`; return; }
      list.innerHTML = hist.map(h =>
        `<div class="asset-row"><div class="asset-info"><div class="asset-name">${h.dir === 'up' ? '📈' : '📉'} $${h.price.toFixed(4)}</div><div class="asset-detail">${h.at}</div></div></div>`
      ).join('');
    }
  };

  // ═══════════════ JEU D — MEMORY FTA (paires chronométrées) ═══════════════
  const Memory = {
    timer: null, first: null, lock: false, pairs: 0, moves: 0, time: 0,
    open() { show('game-memory'); this.setup(); },
    setup() {
      this.stopTimer();
      const emojis = ['⚡', '🟡', '💎', '🔧', '🔋', '🎮', '⛏️', '🚀'];
      const deck = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
      const grid = document.getElementById('mem-grid');
      grid.innerHTML = '';
      this.first = null; this.lock = false; this.pairs = 0; this.moves = 0; this.time = 0;
      deck.forEach(em => {
        const card = document.createElement('button');
        card.className = 'mem-card';
        card.innerHTML = `<span class="mem-front">❓</span><span class="mem-back">${em}</span>`;
        card.onclick = () => this.flip(card, em);
        grid.appendChild(card);
      });
      this.render();
      const t = document.getElementById('mem-time'); if (t) t.innerText = '0 s';
      this.timer = setInterval(() => {
        this.time++;
        const el = document.getElementById('mem-time'); if (el) el.innerText = this.time + ' s';
      }, 1000);
    },
    stopTimer() { if (this.timer) { clearInterval(this.timer); this.timer = null; } },
    flip(card, em) {
      if (this.lock || card.classList.contains('flipped')) return;
      card.classList.add('flipped');
      if (!this.first) { this.first = { card, em }; return; }
      this.moves++;
      if (this.first.em === em) {
        this.first.card.classList.add('matched'); card.classList.add('matched');
        this.first = null; this.pairs++;
        this.render();
        if (this.pairs === 8) {
          this.stopTimer();
          const score = Math.max(0, 1000 - this.time * 5 - this.moves * 10);
          const best = Math.max(lsGet('fitia_memory_best', 0), score);
          lsSet('fitia_memory_best', best);
          App.showToast(App.t('memWin'));
          this.render();
        }
      } else {
        this.lock = true;
        const f = this.first; this.first = null;
        setTimeout(() => { f.card.classList.remove('flipped'); card.classList.remove('flipped'); this.lock = false; }, 650);
        this.render();
      }
    },
    render() {
      const m = document.getElementById('mem-moves'); if (m) m.innerText = this.moves;
      const b = document.getElementById('mem-best'); if (b) b.innerText = lsGet('fitia_memory_best', 0);
    }
  };

  // ═══════════════ JEU E — ROUE DE LA CHANCE (1 spin gratuit / jour) ═══════════════
  const Wheel = {
    spinning: false, curRot: 0,
    prizes: [
      { label: '+20⚡', type: 'energy', v: 20 },
      { label: '✖', type: 'none' },
      { label: '+100🪙', type: 'credits', v: 100 },
      { label: '✖', type: 'none' },
      { label: 'MAX⚡', type: 'energy', v: 'max' },
      { label: '✖', type: 'none' },
      { label: '+50🪙', type: 'credits', v: 50 },
      { label: '✖', type: 'none' }
    ],
    open() {
      show('game-wheel');
      this.buildLabels();
      const last = lsGet('fitia_wheel_last', 0);
      const left = (Date.now() - last) >= 86400000 ? 1 : 0;
      const el = document.getElementById('wheel-left');
      if (el) el.innerText = `${App.t('wheelFree')} : ${left}`;
      const btn = document.getElementById('wheel-spin');
      if (btn) btn.disabled = left === 0;
    },
    buildLabels() {
      const disc = document.getElementById('wheel-disc');
      if (!disc || disc.dataset.built) return;
      this.prizes.forEach((p, i) => {
        const l = document.createElement('span');
        l.className = 'wheel-label';
        l.innerText = p.label;
        l.style.transform = `rotate(${i * 45 + 22.5}deg) translate(-10px, -95px) rotate(180deg)`;
        disc.appendChild(l);
      });
      disc.dataset.built = '1';
    },
    spin() {
      if (this.spinning) return;
      const now = Date.now(), last = lsGet('fitia_wheel_last', 0);
      if (now - last < 86400000) { App.showToast(App.t('wheelNoSpin'), true); return; }
      lsSet('fitia_wheel_last', now);
      const btn = document.getElementById('wheel-spin'); if (btn) btn.disabled = true;
      const el = document.getElementById('wheel-left'); if (el) el.innerText = `${App.t('wheelFree')} : 0`;
      this.spinning = true;
      const idx = Math.floor(Math.random() * 8);
      const disc = document.getElementById('wheel-disc');
      this.curRot = this.curRot + 360 * 5 + (360 - (idx * 45 + 22.5)) - (this.curRot % 360);
      disc.style.transition = 'transform 4s cubic-bezier(0.15, 0.9, 0.25, 1)';
      disc.style.transform = `rotate(${this.curRot}deg)`;
      disc.removeEventListener('transitionend', this._apply);
      this._apply = () => {
        if (!this.spinning) return; // idempotent : transitionend + timeout de secours ne l'appliquent qu'une fois
        this.spinning = false;
        const p = this.prizes[idx];
        if (p.type === 'energy') {
          Tap.setEnergy(p.v === 'max' ? 100 : Math.min(100, Tap.energy() + p.v));
          App.showToast(`${App.t('wheelWin')} ${p.label}`);
        } else if (p.type === 'credits') {
          Crash.addBal(p.v);
          App.showToast(`${App.t('wheelWin')} ${p.label}`);
        } else {
          App.showToast(App.t('wheelLose'), true);
        }
        disc.removeEventListener('transitionend', this._apply);
      };
      disc.addEventListener('transitionend', this._apply);
      // Garde-fou : si l'onglet est quitté pendant le spin (transition annulée), applique quand même le prix
      clearTimeout(this._safety);
      this._safety = setTimeout(() => { if (this.spinning && this._apply) this._apply(); }, 4400);
    }
  };

  // ─── Vague 3 de traductions : Crash façon Aviator 1Win ───
  const GAME_I18N3 = {
    fr: {
      crashNext: "Prochain vol dans", crashFlying: "EN VOL — encaisse vite !", crashLost: "Perdu ! L'avion s'est envolé.",
      crashFeed: "PARI EN DIRECT", crashBetPlaced: "Mise placée ✅ — bon vol !"
    },
    en: {
      crashNext: "Next flight in", crashFlying: "IN FLIGHT — cash out fast!", crashLost: "Lost! The plane flew away.",
      crashFeed: "LIVE BETS", crashBetPlaced: "Bet placed ✅ — good flight!"
    },
    de: {
      crashNext: "Nächster Flug in", crashFlying: "IM FLUG — schnell auszahlen!", crashLost: "Verloren! Das Flugzeug ist weg.",
      crashFeed: "LIVE-WETTEN", crashBetPlaced: "Einsatz platziert ✅ — guten Flug!"
    },
    zh: {
      crashNext: "下一航班倒计时", crashFlying: "飞行中 — 快点套现！", crashLost: "输了！飞机飞走了。",
      crashFeed: "实时投注", crashBetPlaced: "已下注 ✅ — 一路顺风！"
    },
    sg: {
      crashNext: "Next flight in", crashFlying: "IN FLIGHT — cash out fast!", crashLost: "Lost! The plane flew away.",
      crashFeed: "LIVE BETS", crashBetPlaced: "Bet placed ✅ — good flight!"
    }
  };
  for (const lang in GAME_I18N3) {
    if (i18n[lang]) Object.assign(i18n[lang], GAME_I18N3[lang]);
    else i18n[lang] = { ...GAME_I18N3[lang] };
  }

  // ═══════════════ JEU F — CRASH (façon Aviator 1Win, crédits d'entraînement) ═══════════════
  // Machine à états continue façon 1Win : MISE (5 s) → VOL → CRASH → MISE…
  // Le joueur mise pendant la phase de mise, encaisse pendant le vol.
  const Crash = {
    ctx: null, raf: null, timer: null,
    state: 'idle',            // betting | flying | crashed | idle
    stake: 0, betPlaced: false, cashed: false, playerCashMult: 0,
    mult: 1, cp: 1, pts: [], bots: [], countdown: 0, autoCash: 0, stopped: true,
    bal() { return lsGet('fitia_crash_bal', 1000); },
    addBal(v) { lsSet('fitia_crash_bal', this.bal() + v); const b = document.getElementById('crash-bal'); if (b) b.innerText = this.bal(); this.renderFeed(); },
    renderBal() { const b = document.getElementById('crash-bal'); if (b) b.innerText = this.bal(); },
    renderHist() {
      const el = document.getElementById('crash-hist'); if (!el) return;
      const hist = lsGet('fitia_crash_hist', []);
      el.innerHTML = hist.length
        ? hist.map(h => `<span class="crash-chip ${h >= 2 ? 'g' : 'r'}">${h.toFixed(2)}×</span>`).join('')
        : `<span class="small-text">${App.t('progNone')}</span>`;
    },
    pushHist(cp) {
      const h = lsGet('fitia_crash_hist', []); h.unshift(cp); lsSet('fitia_crash_hist', h.slice(0, 10));
      this.renderHist();
    },
    open() {
      show('game-crash');
      this.ctx = document.getElementById('crash-canvas').getContext('2d');
      this.renderBal(); this.renderHist();
      if (this.stopped) { this.stopped = false; this.startBetting(); }   // boucle continue tant que l'écran est ouvert
    },
    makeBots() {
      // Joueurs simulés pour l'ambiance cagnotte en direct (V2 : vrais joueurs multi)
      const names = ['Kofi***', 'Ama***', 'Yao***', 'Aya***', 'Kwame***', 'Adjo***', 'Sika***', 'Mus***', 'Zey***', 'Nia***'];
      this.bots = [];
      const n = 5 + Math.floor(Math.random() * 4);
      for (let i = 0; i < n; i++) {
        this.bots.push({
          name: names[i % names.length],
          stake: [20, 50, 100, 200, 500][Math.floor(Math.random() * 5)],
          target: 1.15 + Math.random() * 7,   // certains ne s'encaisseront jamais (target > point de crash)
          cashed: 0
        });
      }
    },
    startBetting() {
      this.state = 'betting'; this.betPlaced = false; this.cashed = false; this.playerCashMult = 0;
      this.mult = 1; this.pts = [];
      // Point de crash prétiré : distribution classique type Aviator (plafonnée à 50×)
      this.cp = Math.max(1, Math.min(50, 0.97 / (1 - Math.random())));
      this.countdown = 5;
      this.makeBots();
      const m = document.getElementById('crash-mult'); if (m) { m.innerText = '1.00×'; m.classList.remove('boom'); }
      const st = document.getElementById('crash-status'); if (st) { st.className = 'crash-status'; st.innerText = ''; }
      document.getElementById('crash-launch').classList.remove('hidden');
      document.getElementById('crash-cash').classList.add('hidden');
      this.drawRunway();
      this.renderFeed();
      if (this.timer) { clearInterval(this.timer); this.timer = null; }
      this.timer = setInterval(() => {
        this.countdown--;
        const st = document.getElementById('crash-status');
        if (st) st.innerText = `${App.t('crashNext')} ${this.countdown}s…`;
        if (this.countdown <= 0) { clearInterval(this.timer); this.timer = null; this.launch(); }
      }, 1000);
    },
    placeBet() {
      if (this.state !== 'betting' || this.betPlaced) return;
      const stake = Math.floor(parseFloat(document.getElementById('crash-stake').value) || 0);
      if (stake < 10) { App.showToast(App.t('crashStakeMin'), true); return; }
      if (stake > this.bal()) { App.showToast(App.t('errFta'), true); return; }
      this.addBal(-stake);                    // la mise est verrouillée dès le pari (façon 1Win)
      this.stake = stake; this.betPlaced = true;
      this.autoCash = parseFloat(document.getElementById('crash-auto').value) || 0;
      document.getElementById('crash-launch').classList.add('hidden');
      App.showToast(App.t('crashBetPlaced'));
      this.renderFeed();
    },
    launch() {
      this.state = 'flying'; this.t0 = performance.now();
      const st = document.getElementById('crash-status'); if (st) { st.className = 'crash-status flying'; st.innerText = App.t('crashFlying'); }
      if (this.betPlaced) {
        const cb = document.getElementById('crash-cash');
        cb.classList.remove('hidden');
        cb.innerText = `💰 ${App.t('crashCash')}`;
      }
      if (this.raf) cancelAnimationFrame(this.raf);
      this.loop();
    },
    loop() {
      if (this.state !== 'flying') return;
      const t = (performance.now() - this.t0) / 1000;
      this.mult = Math.floor((1 + 0.25 * t + 0.045 * t * t) * 100) / 100;
      // Bots qui s'encaissent au fil du vol
      this.bots.forEach(b => { if (!b.cashed && this.mult >= b.target) b.cashed = this.mult; });
      // ✅ Correctif revue #4 : le crash est testé AVANT l'auto-encaissement
      // (sinon une frame laggée pouvait payer au-delà du point de crash)
      if (this.mult >= this.cp) { this.crashNow(); return; }
      // Auto-encaissement du joueur
      if (this.betPlaced && !this.cashed && this.autoCash >= 1.01 && this.mult >= this.autoCash) { this.cash(); }
      this.draw(t);
      const m = document.getElementById('crash-mult'); if (m) m.innerText = this.mult.toFixed(2) + '×';
      const cb = document.getElementById('crash-cash');
      if (cb && this.betPlaced && !this.cashed) cb.innerText = `💰 ${App.t('crashCash')} · ${(this.stake * this.mult).toFixed(0)} 🪙`;
      this.raf = requestAnimationFrame(() => this.loop());
    },
    cash() {
      if (this.state !== 'flying' || !this.betPlaced || this.cashed) return;
      // ✅ Correctif revue #4 : le multiplicateur payé ne dépasse jamais le point de crash
      const m = Math.min(this.mult, this.cp);
      const win = Math.floor(this.stake * m);
      this.addBal(win);
      this.cashed = true; this.playerCashMult = m;
      App.showToast(`${App.t('crashWin')} ${win} 🪙`);
      document.getElementById('crash-cash').classList.add('hidden');
      this.renderFeed();
    },
    crashNow() {
      this.state = 'crashed';
      cancelAnimationFrame(this.raf);
      const m = document.getElementById('crash-mult');
      if (m) { m.innerText = this.cp.toFixed(2) + '× 💥'; m.classList.add('boom'); }
      const st = document.getElementById('crash-status');
      if (st) {
        if (this.betPlaced && !this.cashed) { st.className = 'crash-status lost'; st.innerText = App.t('crashLost'); }
        else if (this.cashed) { st.className = 'crash-status won'; st.innerText = `✅ ${App.t('crashWin')} ${Math.floor(this.stake * this.playerCashMult)} 🪙`; }
        else { st.className = 'crash-status'; st.innerText = `💥 ${this.cp.toFixed(2)}×`; }  // ✅ revue #9 : spectateur
      }
      this.drawCrashFlash();
      if (this.betPlaced && !this.cashed && navigator.vibrate) { try { navigator.vibrate([60, 40, 60]); } catch (e) {} }
      this.pushHist(this.cp);
      this.renderFeed();
      this.timer = setTimeout(() => { this.timer = null; if (!this.stopped) this.startBetting(); }, 2200);
    },
    // Quitter le panneau en pleine partie = mise perdue (règle Aviator)
    abort() {
      if (this.state === 'idle') return;
      const lost = this.state === 'flying' && this.betPlaced && !this.cashed;
      // ✅ Correctif revue #5 : abandon pendant la phase de mise → remboursement de la mise
      if (this.state === 'betting' && this.betPlaced) { this.addBal(this.stake); this.betPlaced = false; }
      if (this.raf) cancelAnimationFrame(this.raf);
      if (this.timer) { clearInterval(this.timer); clearTimeout(this.timer); this.timer = null; }
      this.state = 'idle'; this.stopped = true;
      if (lost) App.showToast(App.t('crashLost'), true);
    },
    refill() {
      lsSet('fitia_crash_bal', 1000); this.renderBal();
      App.showToast('♻️ +1000');
    },
    drawRunway() {
      if (!this.ctx) return;
      const ctx = this.ctx, W = 358, H = 220;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#0b0f1a'; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = 'rgba(229,72,77,0.5)'; ctx.setLineDash([2, 6]); ctx.beginPath();
      ctx.moveTo(28, 10); ctx.lineTo(28, H - 20); ctx.lineTo(W - 10, H - 20);
      ctx.stroke(); ctx.setLineDash([]);
      ctx.font = '26px serif'; ctx.fillText('✈️', 34, H - 28);
    },
    draw(t) {
      if (!this.ctx) return;
      const W = 358, H = 220;
      const x = 34 + Math.min(t * 26, 280);
      const y = H - 26 - Math.min(t * 18, 155);
      // ✅ Correctif revue #10 : n'empile pas les points identiques après saturation
      const last = this.pts[this.pts.length - 1];
      if (!last || last[0] !== x || last[1] !== y) this.pts.push([x, y]);
      const ctx = this.ctx;
      ctx.fillStyle = '#0b0f1a'; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = 'rgba(229,72,77,0.5)'; ctx.setLineDash([2, 6]); ctx.beginPath();
      ctx.moveTo(28, 10); ctx.lineTo(28, H - 20); ctx.lineTo(W - 10, H - 20);
      ctx.stroke(); ctx.setLineDash([]);
      ctx.strokeStyle = '#e5484d'; ctx.lineWidth = 3; ctx.beginPath();
      this.pts.forEach((p, i) => { if (i === 0) ctx.moveTo(p[0], p[1]); else ctx.lineTo(p[0], p[1]); });
      ctx.stroke(); ctx.lineWidth = 1;
      ctx.font = '24px serif'; ctx.fillText('✈️', x - 14, y + 8);
    },
    drawCrashFlash() {
      if (!this.ctx) return;
      this.ctx.fillStyle = 'rgba(229,72,77,0.22)'; this.ctx.fillRect(0, 0, 358, 220);
    },
    renderFeed() {
      const el = document.getElementById('crash-feed-list'); if (!el) return;
      const rows = [];
      // Le joueur en tête de liste
      if (this.betPlaced) {
        const cls = this.cashed ? 'win' : (this.state === 'crashed' ? 'lose' : 'me');
        const multTxt = this.cashed ? this.playerCashMult.toFixed(2) + '×' : '—';
        const amt = this.cashed ? '+' + Math.floor(this.stake * this.playerCashMult) : '';
        rows.push(`<div class="feed-row ${cls}"><span class="feed-name">TOI</span><span class="feed-stake">${this.stake}</span><span class="feed-mult">${multTxt}</span><span class="feed-amt">${amt}</span></div>`);
      }
      this.bots.forEach(b => {
        rows.push(`<div class="feed-row ${b.cashed ? 'win' : ''}"><span class="feed-name">${b.name}</span><span class="feed-stake">${b.stake}</span><span class="feed-mult">${b.cashed ? b.cashed.toFixed(2) + '×' : '—'}</span><span class="feed-amt">${b.cashed ? '+' + Math.floor(b.stake * b.cashed) : ''}</span></div>`);
      });
      el.innerHTML = rows.join('');
    }
  };

  // ═══════════════ HUB & BRANCHEMENT ═══════════════
  const GAME = {
    contract: null,
    load() {
      const hub = document.getElementById('game-hub');
      if (!hub) return;
      show('game-hub');
      const training = !ready();
      const note = document.getElementById('game-training-note');
      if (note) note.classList.toggle('hidden', !training);
    }
  };

  function applyGameI18n() {
    const lang = App.currentLang || 'fr';
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const k = el.getAttribute('data-i18n');
      if (GAME_I18N[lang] && GAME_I18N[lang][k] !== undefined) el.innerText = GAME_I18N[lang][k];
      else if (GAME_I18N.en[k] !== undefined) el.innerText = GAME_I18N.en[k];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const k = el.getAttribute('data-i18n-placeholder');
      if (GAME_I18N[lang] && GAME_I18N[lang][k] !== undefined) el.placeholder = GAME_I18N[lang][k];
    });
  }
  applyGameI18n();
  const _prevApply = App.applyTranslations.bind(App);
  App.applyTranslations = function () { _prevApply(); applyGameI18n(); };

  App.loadGame = () => GAME.load();
  App.openGame = (which) => {
    if (which === 'tap') Tap.open();
    else if (which === 'runner') Runner3D.open();
    else if (which === 'memory') Memory.open();
    else if (which === 'wheel') Wheel.open();
    else if (which === 'crash') Crash.open();
    else Predict.open();
  };
  App.wheelSpin = () => Wheel.spin();
  App.memAgain = () => Memory.setup();
  App.crashLaunch = () => Crash.placeBet();   // phase de mise : verrouille la mise, le décollage suit le compte à rebours
  App.crashCash = () => Crash.cash();
  App.crashRefill = () => Crash.refill();
  App.gameBack = () => show('game-hub');
  App.gameTap = (e) => Tap.tap(e);
  App.gameBoostShop = () => Tap.openBoostShop();
  App.gameBuyBoost = (i) => Tap.buyBoost(i);
  App.runnerStart = () => Runner3D.start();
  App.runnerJump = () => Runner3D.jump();
  App.quizStart = () => Predict.startQuiz();
  App.quizNext = () => Predict.nextQ();
  App.predictUp = () => Predict.recordPrediction('up');
  App.predictDown = () => Predict.recordPrediction('down');
})();
