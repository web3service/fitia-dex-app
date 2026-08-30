// ═══════════════════════════════════════════════════════════════════
//  Fitia-Game — Hub des 3 jeux (chargé après app.js et finance.js)
//  Dépend des globales : App, CONFIG, i18n, ethers (v6)
//  Contrat : game/FitiaGameV1.sol (boosts, tickets, cagnottes)
//  SANS contrat déployé : les 3 jeux sont jouables en « mode entraînement »
//  (scores locaux, achats FTA désactivés proprement).
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
      runnerName: "🏃 Fitia Runner", runnerDesc: "Cours, collecte des FTA, évite les blocs",
      predictName: "🧠 Fitia Predict", predictDesc: "Quiz crypto et pronostics quotidiens",
      tapTitle: "⚡ Tap Miner", tapInfo: "Chaque tape charge ton overclocking. Énergie max 100, +1 toutes les 10 s.",
      tapEnergy: "Énergie", tapScore: "Score", tapTap: "TAPE !", tapBoostShop: "🚀 BOUTIQUE DE BOOSTS",
      tapCharges: "Charges", runnerTitle: "🏃 Fitia Runner", runnerInfo: "Tape pour sauter. Collecte les pièces 🟡, évite les blocs rouges.",
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
      ticketBuy: "ACHETER L'ENTRÉE", entryBought: "Entrée enregistrée ! 🎟️", loadErr: "Impossible de charger le Game."
    },
    en: {
      gameNav: "Game", gameTitle: "🎮 Fitia Game", gameHub: "Pick your game",
      tapName: "⚡ Tap Miner", tapDesc: "Tap to overclock your real mining",
      runnerName: "🏃 Fitia Runner", runnerDesc: "Run, collect FTA, dodge blocks",
      predictName: "🧠 Fitia Predict", predictDesc: "Crypto quiz and daily predictions",
      tapTitle: "⚡ Tap Miner", tapInfo: "Each tap charges your overclocking. Max 100 energy, +1 every 10 s.",
      tapEnergy: "Energy", tapScore: "Score", tapTap: "TAP!", tapBoostShop: "🚀 BOOST SHOP",
      tapCharges: "Charges", runnerTitle: "🏃 Fitia Runner", runnerInfo: "Tap to jump. Collect 🟡 coins, dodge red blocks.",
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
      ticketBuy: "BUY ENTRY", entryBought: "Entry recorded! 🎟️", loadErr: "Unable to load the Game."
    },
    de: {
      gameNav: "Game", gameTitle: "🎮 Fitia Game", gameHub: "Wähle dein Spiel",
      tapName: "⚡ Tap Miner", tapDesc: "Tippe, um dein echtes Mining zu übertakten",
      runnerName: "🏃 Fitia Runner", runnerDesc: "Laufe, sammle FTA, weiche Blöcken aus",
      predictName: "🧠 Fitia Predict", predictDesc: "Crypto-Quiz und tägliche Prognosen",
      tapTitle: "⚡ Tap Miner", tapInfo: "Jeder Tipp lädt dein Overclocking. Max 100 Energie, +1 alle 10 s.",
      tapEnergy: "Energie", tapScore: "Punkte", tapTap: "TIPP!", tapBoostShop: "🚀 BOOST-SHOP",
      tapCharges: "Ladungen", runnerTitle: "🏃 Fitia Runner", runnerInfo: "Tippe zum Springen. Sammle 🟡 Münzen, weiche roten Blöcken aus.",
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
      ticketBuy: "EINTRITT KAUFEN", entryBought: "Eintritt gespeichert! 🎟️", loadErr: "Game konnte nicht geladen werden."
    },
    zh: {
      gameNav: "游戏", gameTitle: "🎮 Fitia Game", gameHub: "选择你的游戏",
      tapName: "⚡ 点击矿工", tapDesc: "点击以超频你的真实挖矿",
      runnerName: "🏃 Fitia 跑酷", runnerDesc: "奔跑、收集 FTA、躲避障碍",
      predictName: "🧠 Fitia 预测", predictDesc: "加密问答与每日预测",
      tapTitle: "⚡ 点击矿工", tapInfo: "每次点击为超频充能。能量上限 100，每 10 秒 +1。",
      tapEnergy: "能量", tapScore: "分数", tapTap: "点！", tapBoostShop: "🚀 强化商店",
      tapCharges: "充能", runnerTitle: "🏃 Fitia 跑酷", runnerInfo: "点击跳跃。收集 🟡 金币，躲避红色方块。",
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
      ticketBuy: "购买入场券", entryBought: "入场成功！🎟️", loadErr: "游戏加载失败。"
    },
    sg: {
      gameNav: "Game", gameTitle: "🎮 Fitia Game", gameHub: "Pick your game",
      tapName: "⚡ Tap Miner", tapDesc: "Tap to overclock your real mining",
      runnerName: "🏃 Fitia Runner", runnerDesc: "Run, collect FTA, dodge blocks",
      predictName: "🧠 Fitia Predict", predictDesc: "Crypto quiz and daily predictions",
      tapTitle: "⚡ Tap Miner", tapInfo: "Each tap charges your overclocking. Max 100 energy, +1 every 10 s.",
      tapEnergy: "Energy", tapScore: "Score", tapTap: "TAP!", tapBoostShop: "🚀 BOOST SHOP",
      tapCharges: "Charges", runnerTitle: "🏃 Fitia Runner", runnerInfo: "Tap to jump. Collect 🟡 coins, dodge red blocks.",
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
      ticketBuy: "BUY ENTRY", entryBought: "Entry recorded! 🎟️", loadErr: "Unable to load the Game."
    }
  };
  for (const lang in GAME_I18N) {
    if (i18n[lang]) Object.assign(i18n[lang], GAME_I18N[lang]);
    else i18n[lang] = { ...GAME_I18N[lang] };
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
    ['game-hub', 'game-tap', 'game-runner', 'game-predict'].forEach(p => {
      const el = document.getElementById(p);
      if (el) el.classList.toggle('hidden', p !== id);
    });
  }

  // ═══════════════ JEU A — TAP MINER ═══════════════
  const Tap = {
    score: 0, charges: 0, timer: null,
    energy() { return lsGet('fitia_tap_energy', 100); },
    setEnergy(v) { lsSet('fitia_tap_energy', Math.max(0, Math.min(100, v))); },
    lastTick() { return lsGet('fitia_tap_tick', Date.now()); },
    // Régénère l'énergie : +1 toutes les 10 s depuis la dernière visite
    regen() {
      const now = Date.now(), last = this.lastTick();
      const gained = Math.floor((now - last) / 10000);
      if (gained > 0) { this.setEnergy(this.energy() + gained); lsSet('fitia_tap_tick', last + gained * 10000); }
      if (this.energy() >= 100) lsSet('fitia_tap_tick', now);
    },
    open() {
      show('game-tap');
      this.regen(); this.score = 0; this.charges = 0;
      this.render(); this.startRegenTick();
    },
    startRegenTick() {
      clearInterval(this.timer);
      this.timer = setInterval(() => { this.regen(); const e = document.getElementById('tap-energy-bar'); if (e) { e.style.width = this.energy() + '%'; const t = document.getElementById('tap-energy-txt'); if (t) t.innerText = this.energy() + ' / 100'; } }, 2000);
    },
    tap() {
      if (this.energy() <= 0) return;
      this.setEnergy(this.energy() - 1);
      this.score += 1;
      // Toutes les 25 tapes : +1 charge (10 charges = boost prêt)
      if (this.score % 25 === 0) { this.charges++; }
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
        document.getElementById('tap-boost-list').innerHTML = html + `<p class="small-text" style="margin-top:8px;">🔥 30 % ${App.t('tapCharges') === '充能' ? '燃烧' : 'burn'} · 70 % ${App.t('progHistory') === '历史' ? '奖池' : 'cagnotte'}</p>`;
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

  // ═══════════════ JEU B — RUNNER (canvas) ═══════════════
  const Runner = {
    cv: null, ctx: null, raf: null, running: false,
    y: 0, vy: 0, speed: 3, obst: [], coins: [], dist: 0, score: 0, best: 0, hidden: false,
    H: 240, W: 358, GROUND: 200, GRAV: 0.45, JUMP: -7.6,
    open() {
      show('game-runner');
      this.cv = document.getElementById('runner-canvas');
      this.ctx = this.cv.getContext('2d');
      this.best = lsGet('fitia_runner_best', 0);
      const b = document.getElementById('runner-best'); if (b) b.innerText = this.best;
      const scores = lsGet('fitia_runner_scores', []);
      const l = document.getElementById('runner-last'); if (l) l.innerText = scores.length ? scores[0].s : 0;
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
      // PERFORMANCE : pause complète quand l'écran est caché ou le jeu arrêté
      if (!this.running || document.hidden) { this.raf = requestAnimationFrame(() => this.loop()); return; }
      const ctx = this.ctx, W = this.W, H = this.H;
      // Physique
      this.vy += this.GRAV; this.y += this.vy;
      if (this.y > this.GROUND - 26) { this.y = this.GROUND - 26; this.vy = 0; }
      this.speed += 0.0015; this.dist += this.speed;
      this.score = Math.floor(this.dist) + this.coinsCollected * 10;
      // Apparition d'obstacles / pièces
      if (Math.random() < 0.012 + this.speed * 0.002) this.obst.push({ x: W + 20, w: 16 + Math.random() * 14, h: 18 + Math.random() * 22 });
      if (Math.random() < 0.02) this.coins.push({ x: W + 20, y: 120 + Math.random() * 60, taken: false });
      // Déplacement
      this.obst.forEach(o => o.x -= this.speed);
      this.coins.forEach(cn => cn.x -= this.speed);
      this.obst = this.obst.filter(o => o.x > -40);
      this.coins = this.coins.filter(cn => cn.x > -30 && !cn.taken);
      // Collisions
      const px = 40, py = this.y, pw = 26, ph = 26;
      for (const o of this.obst) {
        if (px + pw > o.x && px < o.x + o.w && py + ph > this.GROUND - o.h) { this.gameOver(); return; }
      }
      for (const cn of this.coins) {
        if (px + pw > cn.x && px < cn.x + 14 && py < cn.y + 14 && py + ph > cn.y) { cn.taken = true; this.coinsCollected++; this.score += 10; }
      }
      // ── Rendu (formes simples, pas de dégradés par frame) ──
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#04070f'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = 'rgba(240,185,11,0.08)'; ctx.fillRect(0, this.GROUND, W, H - this.GROUND);
      ctx.fillStyle = '#22d3ee'; ctx.fillRect(0, this.GROUND, W, 2);
      // Joueur : bot doré
      ctx.fillStyle = '#F0B90B';
      ctx.fillRect(px, py, pw, ph);
      ctx.fillStyle = '#04070f'; ctx.fillRect(px + 16, py + 6, 6, 6);
      // Obstacles rouges
      ctx.fillStyle = '#f43f5e';
      this.obst.forEach(o => ctx.fillRect(o.x, this.GROUND - o.h, o.w, o.h));
      // Pièces cyan
      ctx.fillStyle = '#22d3ee';
      this.coins.forEach(cn => { ctx.beginPath(); ctx.arc(cn.x + 7, cn.y + 7, 7, 0, 6.29); ctx.fill(); });
      // Score
      ctx.fillStyle = '#8ea0bd'; ctx.font = '12px monospace';
      ctx.fillText(this.score, 10, 18);
      this.raf = requestAnimationFrame(() => this.loop());
    },
    coinsCollected: 0,
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
    },
    startQuiz() {
      const bank = QUIZ[App.currentLang] || QUIZ.en;
      this.bank = bank.slice(); this.qi = 0; this.qScore = 0;
      document.getElementById('predict-start').classList.add('hidden');
      document.getElementById('predict-play').classList.remove('hidden');
      this.showQ();
    },
    showQ() {
      const q = this.bank[this.qi];
      document.getElementById('quiz-num').innerText = `${this.qi + 1} / ${this.bank.length}`;
      document.getElementById('quiz-q').innerText = q.q;
      document.getElementById('quiz-feedback').innerText = '';
      const box = document.getElementById('quiz-choices');
      box.innerHTML = '';
      // Mélange les choix tout en gardant l'indice de la bonne réponse
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
      } else this.showQ();
    },
    // ─── Pronostic quotidien (V1 local, résolution on-chain en V2) ───
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

  // Traductions statiques du module + suivi des langues (comme finance.js)
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

  // Branchement sur l'application
  App.loadGame = () => GAME.load();
  App.openGame = (which) => { if (which === 'tap') Tap.open(); else if (which === 'runner') Runner.open(); else Predict.open(); };
  App.gameBack = () => show('game-hub');
  App.gameTap = () => Tap.tap();
  App.gameBoostShop = () => Tap.openBoostShop();
  App.gameBuyBoost = (i) => Tap.buyBoost(i);
  App.runnerStart = () => Runner.start();
  App.runnerJump = () => Runner.jump();
  App.quizStart = () => Predict.startQuiz();
  App.quizNext = () => Predict.nextQ();
  App.predictUp = () => Predict.recordPrediction('up');
  App.predictDown = () => Predict.recordPrediction('down');
})();
