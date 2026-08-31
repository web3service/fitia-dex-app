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
    // Économie de batterie : stoppe le rendu 3D quand on quitte le runner
    if (id !== 'game-runner') Runner3D.stop();
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
  App.openGame = (which) => { if (which === 'tap') Tap.open(); else if (which === 'runner') Runner3D.open(); else Predict.open(); };
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
