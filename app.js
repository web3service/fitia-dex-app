// ═══════════════════════════════════════════════════════════════════
//  FITIA PRO MINER V5 — Wallet Interne
//  - ZÉRO wallet externe : tout passe par le backend
//  - Inscription = création wallet automatique
//  - Connexion = adresse wallet (pas de MetaMask)
//  - Mode invité = lecture seule
// ═══════════════════════════════════════════════════════════════════

const CONFIG = {
  API_BASE: "https://fitia-dex-app-production.up.railway.app"
};

// ═══ APP ═══════════════════════════════════════════════════════════
class Application {
  constructor() {
    this.user = null;              // Adresse wallet Polygon de l'utilisateur
    this.isAuthenticated = false;
    this.isGuestMode = false;
    this.dbUserId = null;

    // Cache blockchain
    this.polPriceUsd = 0.70;
    this.ftaPriceUsd = 0;
    this.currentRealPower = 0;
    this.pendingBalance = 0;
    this.lastClaimTimestamp = 0;

    // Shop cache
    this.shopMachinesData = [];
    this.shopBatteriesData = [];
    this.batteryTypeDurations = {};
    this.userMachines = [];
    this.batteryInventory = {};

    // Swap
    this.payMode = 'USDT';
    this.shopViewMode = 'machines';
    this.swapDirection = 'USDT_TO_FTA';

    // Config
    this.usdtDecimals = 6;
    this.ftaDecimals = 8;

    // Visualizer
    this.vizContext = null;
    this.vizBars = [];
    this.miningTimer = null;
  }

  // ═══ HELPERS ══════════════════════════════════════════════════════
  async apiCall(endpoint, method = 'GET', body = null) {
    const opts = { method, headers: { 'Content-Type': 'application/json' } };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(`${CONFIG.API_BASE}${endpoint}`, opts);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur API');
    return data;
  }

  formatUsd(v) {
    if (isNaN(v) || v === null) return '$0.00';
    return '$' + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  formatHashrate(h) {
    if (h <= 0) return '0 H/s';
    const units = ['nH/s', 'µH/s', 'mH/s', 'H/s', 'KH/s', 'MH/s', 'GH/s', 'TH/s', 'PH/s'];
    let value = h, ui = 3;
    while (value < 1 && ui > 0) { value *= 1000; ui--; }
    while (value >= 1000 && ui < units.length - 1) { value /= 1000; ui++; }
    return value.toFixed(2) + ' ' + units[ui];
  }

  formatTimeRemaining(s) {
    if (s <= 0) return 'Expiré';
    const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60);
    if (d > 1) return `${d}j ${h}h`; if (d === 1) return `1j ${h}h`; if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  }

  getBatteryDuration(typeId) {
    if (this.batteryTypeDurations[typeId]) return this.batteryTypeDurations[typeId];
    return { 0: 3, 1: 7, 2: 15, 3: 30, 4: 90, 5: 180, 6: 270, 7: 365 }[typeId] || 30;
  }

  setLoader(show, msg = "Traitement...") {
    document.getElementById('loader-text').innerText = msg;
    document.getElementById('loader').classList.toggle('hidden', !show);
  }

  showToast(msg, isError = false) {
    const div = document.createElement('div');
    div.className = 'toast' + (isError ? ' toast-error' : ' toast-success');
    div.innerText = msg;
    document.getElementById('toast-container').appendChild(div);
    setTimeout(() => div.remove(), 4000);
  }

  // ═══ AUTH ════════════════════════════════════════════════════════

  /** Bascule entre les onglets Connexion / Inscription */
  switchAuthTab(tab) {
    document.getElementById('auth-tab-login').classList.toggle('active', tab === 'login');
    document.getElementById('auth-tab-register').classList.toggle('active', tab === 'register');
    document.getElementById('auth-form-login').classList.toggle('active', tab === 'login');
    document.getElementById('auth-form-register').classList.toggle('active', tab === 'register');
  }

  /** Inscription : pseudo + email + mot de passe. Le backend crée le wallet automatiquement. */
  async register() {
    const username = document.getElementById('register-username').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;

    if (!username) return this.showToast('Pseudo requis', true);
    if (!email) return this.showToast('Email requis', true);
    if (!password || password.length < 6) return this.showToast('Mot de passe : 6 caractères minimum', true);

    this.setLoader(true, 'Création du compte...');
    try {
      const data = await this.apiCall('/api/auth/register', 'POST', { username, email, password });
      this.user = data.user.address;
      this.dbUserId = data.user.id;
      localStorage.setItem('fitia_username', data.user.username);

      this.setLoader(false);
      this.showToast('✅ Compte créé ! Wallet financé avec 0.1 POL.');
      await this.enterApp();
    } catch (e) {
      this.showToast(e.message, true);
      this.setLoader(false);
    }
  }

  /** Connexion : pseudo OU email + mot de passe */
  async login() {
    const identifier = document.getElementById('login-identifier').value.trim();
    const password = document.getElementById('login-password').value;

    if (!identifier) return this.showToast('Pseudo ou email requis', true);
    if (!password) return this.showToast('Mot de passe requis', true);

    this.setLoader(true, 'Connexion...');
    try {
      const data = await this.apiCall('/api/auth/login', 'POST', { identifier, password });
      this.user = data.user.address;
      this.dbUserId = data.user.id;
      localStorage.setItem('fitia_username', data.user.username);
      await this.enterApp();
    } catch (e) {
      this.showToast(e.message, true);
      this.setLoader(false);
    }
  }

  /** Mode invité */
  async enterGuestMode() {
    this.isGuestMode = true;
    this.isAuthenticated = false;
    this.user = null;
    document.getElementById('auth-screen').classList.add('hidden');
    document.getElementById('app-screen').classList.remove('hidden');
    document.getElementById('wallet-status').classList.add('hidden');
    document.getElementById('btn-connect-header').classList.remove('hidden');
    document.getElementById('btn-logout-header').classList.add('hidden');
    this.showToast('🧭 Mode invité');
    this.initVisualizer();
    // Charger la boutique
    await this.loadShopData();
    setInterval(() => { if (this.isGuestMode) this.loadShopData(); }, 30000);
  }

  async showAuthToConnect() {
    document.getElementById('app-screen').classList.add('hidden');
    document.getElementById('auth-screen').classList.remove('hidden');
  }

  async enterApp() {
    this.isAuthenticated = true;
    this.isGuestMode = false;
    document.getElementById('auth-screen').classList.add('hidden');
    document.getElementById('app-screen').classList.remove('hidden');
    document.getElementById('wallet-status').classList.remove('hidden');
    document.getElementById('addr-display').innerText = this.user.slice(0, 6) + "..." + this.user.slice(-4);
    document.getElementById('btn-connect-header').classList.add('hidden');
    document.getElementById('btn-logout-header').classList.remove('hidden');
    this.initVisualizer();
    await this.loadAllData();
    setInterval(() => { if (!this.isGuestMode) this.loadAllData(); }, 15000);
    this.setLoader(false);
  }

  logout() {
    this.stopMiningCounter();
    this.user = null;
    this.isAuthenticated = false;
    this.isGuestMode = false;
    localStorage.removeItem('fitia_username');
    document.getElementById('app-screen').classList.add('hidden');
    document.getElementById('auth-screen').classList.remove('hidden');
    this.showToast('Déconnecté');
  }

  // ═══ CHARGEMENT DONNÉES (tout via l'API backend) ═════════════════

  async loadShopData() {
    try {
      const data = await this.apiCall('/api/blockchain/shop');
      this.shopMachinesData = data.mTypes.map(m => ({
        price: parseFloat(ethers.formatUnits(m.price, 6)),
        power: m.power,
        shopExpiry: m.shopExpiry
      }));
      this.shopBatteriesData = data.bTypes.map(b => ({
        price: parseFloat(ethers.formatUnits(b.price, 6)),
        days: Number(b.dur) / 86400
      }));
      for (let i = 0; i < data.bTypes.length; i++) {
        this.batteryTypeDurations[i] = Number(data.bTypes[i].dur) / 86400;
      }
      // Taux FTA
      try {
        const rateData = await this.apiCall('/api/blockchain/rate');
        this.ftaPriceUsd = parseFloat(ethers.formatUnits(rateData.rate, 6));
        document.getElementById('price-fta').innerText = this.formatUsd(this.ftaPriceUsd);
        document.getElementById('swap-rate').innerText = '1 FTA = ' + this.ftaPriceUsd.toFixed(6) + ' USDT';
      } catch (e) {
        console.error('Shop rate error:', e);
        document.getElementById('swap-rate').innerText = 'Indisponible';
      }
      document.getElementById('price-pol').innerText = this.formatUsd(this.polPriceUsd);
      document.getElementById('price-usdt').innerText = this.formatUsd(1);
      this.renderShop();
    } catch (e) {
      console.error('Shop error:', e);
      this.showToast('⚠️ Boutique inaccessible. Vérifiez la connexion.', true);
    }
  }

  async loadAllData() {
    if (!this.user) return;

    // Étape 1 : infos blockchain (avec gestion d'erreur visible)
    try {
      const data = await this.apiCall(`/api/blockchain/info/${this.user}`);
      if (!data || !data.balances) throw new Error('Données invalides');

      // Balances
      const uB = parseFloat(ethers.formatUnits(data.balances.usdt || '0', 6));
      const fB = parseFloat(ethers.formatUnits(data.balances.fta || '0', 8));
      const pB = parseFloat(ethers.formatUnits(data.balances.pol || '0', 18));
      document.getElementById('bal-usdt').innerText = uB.toFixed(2);
      document.getElementById('bal-fta').innerText = fB.toFixed(4);
      document.getElementById('bal-pol').innerText = pB.toFixed(4);
      document.getElementById('bal-usdt-usd').innerText = '≈ ' + this.formatUsd(uB);
      document.getElementById('bal-fta-usd').innerText = '≈ ' + this.formatUsd(fB * this.ftaPriceUsd);
      document.getElementById('bal-pol-usd').innerText = '≈ ' + this.formatUsd(pB * this.polPriceUsd);
      document.getElementById('val-total-usd').innerText = this.formatUsd(uB + fB * this.ftaPriceUsd + pB * this.polPriceUsd);

      // Bannière POL
      const polBanner = document.getElementById('pol-info-banner');
      if (polBanner) { polBanner.classList.toggle('hidden', pB >= 0.05); }

      // Taux FTA
      if (data.rate && data.rate !== '0') {
        this.ftaPriceUsd = parseFloat(ethers.formatUnits(data.rate, 6));
        document.getElementById('price-fta').innerText = this.formatUsd(this.ftaPriceUsd);
        document.getElementById('swap-rate').innerText = '1 FTA = ' + this.ftaPriceUsd.toFixed(6) + ' USDT';
      } else {
        document.getElementById('swap-rate').innerText = 'Taux indisponible';
      }
      document.getElementById('price-pol').innerText = this.formatUsd(this.polPriceUsd);
      document.getElementById('price-usdt').innerText = this.formatUsd(1);

      // Puissance
      const powerNum = Number(data.power || 0);
      const diffNum = Number(data.difficulty || 0);
      this.currentRealPower = powerNum > 0 && diffNum > 0 ? (powerNum * diffNum) / 1e18 : 0;
      document.getElementById('val-power').innerText = this.formatHashrate(this.currentRealPower);

      // Pending
      this.lastClaimTimestamp = parseInt(localStorage.getItem('fitia_last_claim_' + this.user) || '0');
      if (!this.lastClaimTimestamp) {
        this.lastClaimTimestamp = Math.floor(Date.now() / 1000);
        localStorage.setItem('fitia_last_claim_' + this.user, this.lastClaimTimestamp);
      }
      const elapsed = Math.floor(Date.now() / 1000) - this.lastClaimTimestamp;
      const pendingFtaRaw = this.currentRealPower * elapsed;
      document.getElementById('val-pending').innerText = (pendingFtaRaw / 1e8).toFixed(8);

      // Viz status
      if (this.currentRealPower > 0) {
        if (!this.miningTimer) { this.pendingBalance = (pendingFtaRaw / 1e8); this.startMiningCounter(); }
        document.getElementById('viz-status').innerText = 'MINAGE ACTIF';
        document.getElementById('viz-status').style.color = 'var(--primary)';
      } else {
        this.stopMiningCounter();
        document.getElementById('viz-status').innerText = 'AUCUNE MACHINE';
        document.getElementById('viz-status').style.color = '#666';
      }

      // Swap balances
      document.getElementById('swap-bal-from').innerText = uB.toFixed(4);
      document.getElementById('swap-bal-to').innerText = fB.toFixed(4);

      // Machines
      this.userMachines = data.machines || [];
      this.renderActiveMachines();
      this.renderUserMachines();

      // Batteries
      this.batteryInventory = data.batteries || {};
      this.renderUserBatteries();

      // Données shop depuis l'endpoint info (fallback si shop dédié échoue)
      if (data.mTypes && data.mTypes.length > 0) {
        this.shopMachinesData = data.mTypes.map(m => ({
          price: parseFloat(ethers.formatUnits(m.price, 6)),
          power: m.power,
          shopExpiry: m.shopExpiry
        }));
      }
      if (data.bTypes && data.bTypes.length > 0) {
        this.shopBatteriesData = data.bTypes.map(b => ({
          price: parseFloat(ethers.formatUnits(b.price, 6)),
          days: Number(b.dur) / 86400
        }));
        for (let i = 0; i < data.bTypes.length; i++) {
          this.batteryTypeDurations[i] = Number(data.bTypes[i].dur) / 86400;
        }
      }
      this.renderShop();

      if (document.getElementById('swap-from-in').value) this.calcSwap();
    } catch (e) {
      console.error('Load data error:', e);
      this.showToast('⚠️ Données blockchain temporairement indisponibles. Nouvelle tentative dans 15s...', true);
    }

    // Étape 2 : toujours tenter le shop dédié (plus frais que les données de l'endpoint info)
    this.loadShopData();
  }

  startMiningCounter() {
    if (this.miningTimer) return;
    this.miningTimer = setInterval(() => {
      if (this.currentRealPower > 0) {
        this.pendingBalance += this.currentRealPower / 1e8;
        document.getElementById('val-pending').innerText = this.pendingBalance.toFixed(8);
      }
    }, 1000);
  }

  stopMiningCounter() {
    if (this.miningTimer) { clearInterval(this.miningTimer); this.miningTimer = null; }
  }

  // ═══ ACTIONS (toutes via API backend) ═════════════════════════════

  async deposit() {
    if (!this.user) return this.showToast('Connectez-vous', true);
    const token = document.getElementById('deposit-token-select').value;
    const amount = parseFloat(document.getElementById('deposit-amount').value);
    if (!amount || amount <= 0) return this.showToast('Montant invalide', true);

    this.setLoader(true, 'Dépôt...');
    try {
      await this.apiCall('/api/blockchain/deposit', 'POST', { address: this.user, token, amount });
      this.showToast('Dépôt réussi !');
      document.getElementById('deposit-amount').value = '';
      this.loadAllData();
    } catch (e) { this.showToast(e.message, true); }
    this.setLoader(false);
  }

  async withdraw() {
    if (!this.user) return this.showToast('Connectez-vous', true);
    const token = document.getElementById('deposit-token-select').value;
    const amount = parseFloat(document.getElementById('deposit-amount').value);
    if (!amount || amount <= 0) return this.showToast('Montant invalide', true);

    this.setLoader(true, 'Retrait...');
    try {
      await this.apiCall('/api/blockchain/withdraw', 'POST', { address: this.user, token, amount });
      this.showToast('Retrait réussi !');
      document.getElementById('deposit-amount').value = '';
      this.loadAllData();
    } catch (e) { this.showToast(e.message, true); }
    this.setLoader(false);
  }

  async buyMachine(typeId) {
    if (!this.user) return this.showToast('Connectez-vous', true);
    this.setLoader(true, 'Achat machine...');
    try {
      await this.apiCall('/api/blockchain/buy-machine', 'POST', { address: this.user, typeId, payMode: this.payMode });
      this.showToast('Machine achetée !');
      this.loadAllData();
    } catch (e) { this.showToast(e.message, true); }
    this.setLoader(false);
  }

  async buyBattery(typeId) {
    if (!this.user) return this.showToast('Connectez-vous', true);
    this.setLoader(true, 'Achat batterie...');
    try {
      await this.apiCall('/api/blockchain/buy-battery', 'POST', { address: this.user, typeId, payMode: this.payMode });
      this.showToast('Batterie achetée !');
      this.loadAllData();
    } catch (e) { this.showToast(e.message, true); }
    this.setLoader(false);
  }

  async plugInMachine() {
    if (!this.user) return this.showToast('Connectez-vous', true);
    const mi = document.getElementById('plug-machine-id').value;
    const bi = document.getElementById('plug-battery-type').value;
    if (mi === "" || mi < 0) return this.showToast('Index invalide', true);
    this.setLoader(true, 'Branchement...');
    try {
      await this.apiCall('/api/blockchain/plug', 'POST', { address: this.user, machineIndex: Number(mi), batteryTypeId: Number(bi) });
      this.showToast('Machine branchée ! ⚡');
      this.loadAllData();
    } catch (e) { this.showToast(e.message, true); }
    this.setLoader(false);
  }

  async claim() {
    if (!this.user) return this.showToast('Connectez-vous', true);
    this.stopMiningCounter();
    this.setLoader(true, 'Claim...');
    try {
      await this.apiCall('/api/blockchain/claim', 'POST', { address: this.user });
      this.pendingBalance = 0;
      document.getElementById('val-pending').innerText = '0.00000000';
      localStorage.setItem('fitia_last_claim_' + this.user, Math.floor(Date.now() / 1000));
      this.showToast('✅ Gains réclamés !');
      await this.loadAllData();
      if (this.currentRealPower > 0) this.startMiningCounter();
    } catch (e) { this.showToast(e.message, true); if (this.currentRealPower > 0) this.startMiningCounter(); }
    this.setLoader(false);
  }

  async executeSwap() {
    if (!this.user) return this.showToast('Connectez-vous', true);
    const val = document.getElementById('swap-from-in').value;
    if (!val || val <= 0) return this.showToast('Montant invalide', true);
    this.setLoader(true, 'Swap...');
    try {
      await this.apiCall('/api/blockchain/swap', 'POST', { address: this.user, amount: Number(val), direction: this.swapDirection });
      this.showToast('✅ Swap réussi !');
      document.getElementById('swap-from-in').value = '';
      document.getElementById('swap-to-in').value = '';
      this.loadAllData();
    } catch (e) { this.showToast(e.message, true); }
    this.setLoader(false);
  }

  // ═══ SEND / RECEIVE ══════════════════════════════════════════════

  openSend() {
    document.getElementById('send-to-address').value = '';
    document.getElementById('send-amount').value = '';
    document.getElementById('modal-send').classList.add('active');
    this.updateSendBalance();
  }

  updateSendBalance() {
    const token = document.getElementById('send-token-select').value;
    const id = token === 'USDT' ? 'bal-usdt' : token === 'FTA' ? 'bal-fta' : 'bal-pol';
    document.getElementById('send-bal').innerText = document.getElementById(id)?.innerText || '0';
  }

  openReceive() {
    if (!this.user) return this.showToast('Connectez-vous', true);
    document.getElementById('receive-addr-display').innerText = this.user;
    document.getElementById('modal-receive').classList.add('active');
  }

  closeModals() {
    document.getElementById('modal-send').classList.remove('active');
    document.getElementById('modal-receive').classList.remove('active');
  }

  copyReceiveAddress() {
    navigator.clipboard.writeText(this.user);
    this.showToast('✅ Adresse copiée !');
  }

  async executeSend() {
    if (!this.user) return this.showToast('Connectez-vous', true);
    const to = document.getElementById('send-to-address').value;
    const amt = document.getElementById('send-amount').value;
    if (!ethers.isAddress(to)) return this.showToast('Adresse invalide', true);
    if (!amt || Number(amt) <= 0) return this.showToast('Montant invalide', true);

    this.setLoader(true, 'Envoi...');
    try {
      const token = document.getElementById('send-token-select').value;
      if (token === 'POL') {
        // Envoi direct de POL via le wallet interne (signé par le backend)
        const wallet = await this.apiCall('/api/blockchain/send-pol', 'POST', {
          address: this.user,
          to,
          amount: Number(amt)
        });
        this.showToast('✅ ' + amt + ' POL envoyé !');
      } else {
        // Envoi de tokens via le wallet interne
        await this.apiCall('/api/blockchain/send-token', 'POST', {
          address: this.user,
          to,
          token,
          amount: Number(amt)
        });
      }
      this.closeModals();
      this.loadAllData();
    } catch (e) { this.showToast(e.message, true); }
    this.setLoader(false);
  }

  // ═══ SHOP RENDER ══════════════════════════════════════════════════

  setPayMode(mode) {
    this.payMode = mode;
    document.getElementById('btn-pay-usdt').classList.toggle('active', mode === 'USDT');
    document.getElementById('btn-pay-fta').classList.toggle('active', mode === 'FTA');
    this.renderShop();
  }

  setShopView(v) {
    this.shopViewMode = v;
    document.querySelectorAll('.shop-tab').forEach(t => t.classList.remove('active'));
    event.currentTarget.classList.add('active');
    this.renderShop();
  }

  getMachineMiniSVG(tier) {
    const c = ['#64748b', '#3b82f6', '#8b5cf6', '#F0B90B', '#f97316', '#ef4444', '#06b6d4', '#eab308'];
    const a = ['#94a3b8', '#60a5fa', '#a78bfa', '#FFD43B', '#fb923c', '#f87171', '#22d3ee', '#facc15'];
    return `<svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" class="machine-svg-mini"><rect x="2" y="2" width="46" height="46" rx="6" fill="#1e293b" stroke="${c[tier%8]}" stroke-width="1"/><rect x="2" y="2" width="46" height="3" rx="1.5" fill="${c[tier%8]}" opacity="0.6"/><rect x="8" y="10" width="14" height="20" rx="2" fill="#080c18" stroke="${a[tier%8]}" stroke-width="0.5"/><rect x="28" y="10" width="14" height="20" rx="2" fill="#080c18" stroke="${a[tier%8]}" stroke-width="0.5"/></svg>`;
  }

  renderShop() {
    const container = document.getElementById('shop-list');
    if (!container) return;
    if (this.shopViewMode === 'machines') {
      this._renderShopMachinesHTML(container);
    } else {
      this._renderShopBatteriesHTML(container);
    }
  }

  _renderShopMachinesHTML(container) {
    container.innerHTML = '';
    container.style.gridTemplateColumns = '1fr 1fr';
    const names = ['STARTER', 'STANDARD', 'ADVANCED', 'PRO', 'ELITE', 'ULTRA', 'SUPREME', 'LEGEND'];
    for (let i = 0; i < this.shopMachinesData.length; i++) {
      const d = this.shopMachinesData[i];
      const div = document.createElement('div');
      div.className = 'rig-item';
      div.innerHTML = `${this.getMachineMiniSVG(i)}
        <span class="rig-name">RIG ${i + 1}</span>
        <span class="rig-power">${this.formatHashrate(d.power)}</span>
        <span class="rig-price">${d.price.toFixed(2)} $</span>
        <button class="btn-primary" style="padding:8px;font-size:0.75rem;margin-top:6px;" onclick="App.buyMachine(${i})">ACHETER (${this.payMode})</button>`;
      container.appendChild(div);
    }
  }

  _renderShopBatteriesHTML(container) {
    container.innerHTML = '';
    container.style.gridTemplateColumns = '1fr 1fr';
    for (let i = 0; i < this.shopBatteriesData.length; i++) {
      const d = this.shopBatteriesData[i];
      const div = document.createElement('div');
      div.className = 'battery-shop-item';
      div.innerHTML = `<div class="real-battery"><div class="battery-cap"></div><div class="battery-body"><div class="battery-level" style="width:70%"></div><div class="battery-charge-indicator">${d.days}J</div></div></div>
        <div class="battery-name">${d.days} Jours</div>
        <div class="battery-price">${d.price.toFixed(2)} $</div>
        <button class="btn-primary" style="padding:6px;font-size:0.75rem" onclick="App.buyBattery(${i})">ACHETER (${this.payMode})</button>`;
      container.appendChild(div);
    }
  }

  renderActiveMachines() {
    const container = document.getElementById('active-machines-list');
    if (!container) return;
    const now = Math.floor(Date.now() / 1000);
    const active = this.userMachines.filter(m => m.exp > now);
    if (!active.length) {
      container.innerHTML = '<p class="small-text" style="text-align:center;">Aucune machine active</p>';
      return;
    }
    const tierNames = ['MK-I', 'MK-II', 'MK-III', 'MK-IV', 'MK-V', 'MK-VI', 'MK-VII', 'MK-VIII'];
    container.innerHTML = active.map(m => {
      const rem = m.exp - now;
      return `<div class="asset-row">${this.getMachineMiniSVG(m.tid)}
        <div class="asset-info"><div class="asset-name">${tierNames[m.tid%8]} <span class="status-pill active">● Actif</span></div>
        <div class="battery-bar-wrap"><div class="battery-bar-header"><span class="battery-bar-label">Restant</span><span class="battery-bar-time green">${this.formatTimeRemaining(rem)}</span></div>
        <div class="battery-bar"><div class="battery-bar-fill green" style="width:50%"></div></div></div></div></div>`;
    }).join('');
  }

  renderUserMachines() {
    const container = document.getElementById('my-machines-list');
    if (!container) return;
    if (!this.userMachines.length) {
      container.innerHTML = '<p class="small-text" style="text-align:center;">Aucune machine</p>';
      return;
    }
    const now = Math.floor(Date.now() / 1000);
    const tierNames = ['MK-I', 'MK-II', 'MK-III', 'MK-IV', 'MK-V', 'MK-VI', 'MK-VII', 'MK-VIII'];
    container.innerHTML = this.userMachines.map((m, i) => {
      let status = 'Inactif', cls = 'inactive';
      if (m.exp > now) { status = 'Actif'; cls = 'active'; }
      else if (m.exp > 0 && m.exp <= now) { status = 'Expiré'; cls = 'expired'; }
      return `<div class="asset-row">${this.getMachineMiniSVG(m.tid)}
        <div class="asset-info"><div class="asset-name">#${i} ${tierNames[m.tid%8]} <span class="status-pill ${cls}">● ${status}</span></div></div></div>`;
    }).join('');
  }

  renderUserBatteries() {
    const container = document.getElementById('my-batteries-list');
    if (!container) return;
    const entries = Object.entries(this.batteryInventory).filter(([,q]) => q > 0);
    if (!entries.length) {
      container.innerHTML = '<p class="small-text" style="text-align:center;">Aucune batterie</p>';
      return;
    }
    container.innerHTML = entries.map(([tid, qty]) => {
      const dur = this.getBatteryDuration(Number(tid));
      return `<div class="asset-row"><div class="asset-info"><div class="asset-name">${dur} Jours <span class="status-pill available">● Disponible</span></div><div class="asset-detail">Qté: ${qty}</div></div></div>`;
    }).join('');
  }

  // ═══ SWAP ════════════════════════════════════════════════════════

  toggleSwap() {
    this.swapDirection = this.swapDirection === 'USDT_TO_FTA' ? 'FTA_TO_USDT' : 'USDT_TO_FTA';
    document.getElementById('token-from-display').innerText = this.swapDirection === 'USDT_TO_FTA' ? 'USDT' : 'FTA';
    document.getElementById('token-to-display').innerText = this.swapDirection === 'USDT_TO_FTA' ? 'FTA' : 'USDT';
    document.getElementById('swap-from-in').value = '';
    document.getElementById('swap-to-in').value = '';
    this.loadAllData();
  }

  calcSwap() {
    const val = document.getElementById('swap-from-in').value;
    if (!val || val <= 0) { document.getElementById('swap-to-in').value = ''; return; }
    const inputVal = parseFloat(val);
    const fee = inputVal * 0.04;
    const netInput = inputVal - fee;
    let netOutput = 0;
    if (this.ftaPriceUsd > 0) netOutput = this.swapDirection === 'USDT_TO_FTA' ? (netInput / this.ftaPriceUsd) : (netInput * this.ftaPriceUsd);
    document.getElementById('swap-to-in').value = netOutput > 0 ? netOutput.toFixed(6) : '';
  }

  // ═══ MON COMPTE ═══════════════════════════════════════════════════

  accountHistoryPage = 0;

  /** Charge toutes les infos du compte */
  async loadAccount() {
    if (!this.user) {
      document.getElementById('account-user-id').innerText = '—';
      document.getElementById('account-ref-id').innerText = '—';
      document.getElementById('account-wallet-addr').innerText = '—';
      return;
    }

    // ID & wallet
    document.getElementById('account-user-id').innerText = '#' + this.escapeHtml(String(this.dbUserId || '—'));
    document.getElementById('account-ref-id').innerText = '#' + this.escapeHtml(String(this.dbUserId || '—'));
    document.getElementById('account-wallet-addr').innerText = this.escapeHtml(this.user);

    // Historique complet
    this.loadAccountHistory();

    // Notifications
    this.loadNotifications();
  }

  /** Charge l'historique complet (avec filtre) */
  async loadAccountHistory() {
    const container = document.getElementById('account-history-list');
    if (!this.user) {
      container.innerHTML = '<p class="small-text" style="text-align:center;padding:10px;">Connectez-vous</p>';
      return;
    }
    container.innerHTML = '<p class="small-text" style="text-align:center;padding:10px;">Chargement...</p>';
    try {
      const filter = document.getElementById('account-history-filter')?.value || '';
      let url = '/api/transactions/' + this.user + '?limit=50&offset=' + (this.accountHistoryPage * 50);
      if (filter) url += '&type=' + encodeURIComponent(filter);
      const data = await this.apiCall(url);
      this.renderAccountHistory(data.transactions);
    } catch (e) {
      container.innerHTML = '<p class="small-text" style="text-align:center;padding:10px;">Erreur chargement</p>';
    }
  }

  /** Filtre l'historique du compte */
  filterAccountHistory() {
    this.accountHistoryPage = 0;
    this.loadAccountHistory();
  }

  /** Rendu de l'historique dans Mon Compte */
  renderAccountHistory(txs) {
    const container = document.getElementById('account-history-list');
    if (!txs?.length) {
      container.innerHTML = '<p class="small-text" style="text-align:center;padding:10px;">Aucune transaction</p>';
      return;
    }
    const icons = { buy_machine: '⛏️', buy_battery: '🔋', deposit: '📥', withdraw: '📤', claim: '🎁', swap: '💱', plug: '🔌', referral: '👥', gas_funded: '⛽', wallet_created: '🆕', send: '📤' };
    const labels = { buy_machine: 'Achat Machine', buy_battery: 'Achat Batterie', deposit: 'Dépôt', withdraw: 'Retrait', claim: 'Claim', swap: 'Swap', plug: 'Branchement', referral: 'Parrainage', gas_funded: 'Gas Offert', wallet_created: 'Création', send: 'Envoi' };
    const positive = ['deposit', 'claim', 'gas_funded'];

    container.innerHTML = txs.map(tx => {
      const dt = new Date(tx.created_at + 'Z');
      const dateStr = dt.toLocaleDateString('fr') + ' ' + dt.toLocaleTimeString('fr', { hour:'2-digit', minute:'2-digit' });
      const isPos = positive.includes(tx.tx_type);
      const amt = tx.amount ? `${isPos ? '+' : '-'}${tx.amount.toFixed(tx.token === 'USDT' ? 2 : 4)} ${this.escapeHtml(tx.token || '')}` : '—';
      return `<div class="history-item">
        <div class="history-item-left"><div class="history-icon">${this.escapeHtml(icons[tx.tx_type] || '📋')}</div>
        <div class="history-details"><div class="history-detail-type">${this.escapeHtml(labels[tx.tx_type] || tx.tx_type)}</div>
        <div class="history-detail-date">${dateStr}</div></div></div>
        <div class="history-item-right"><div class="history-amount ${isPos ? 'positive' : 'negative'}">${amt}</div></div></div>`;
    }).join('');
  }

  /** Charge les notifications (basées sur les transactions récentes) */
  async loadNotifications() {
    const container = document.getElementById('account-notifications');
    const noNotif = document.getElementById('account-no-notifs');
    if (!this.user) {
      container.innerHTML = '';
      noNotif.classList.remove('hidden');
      return;
    }
    try {
      const data = await this.apiCall('/api/transactions/' + this.user + '?limit=5&offset=0&status=confirmed');
      const notifs = (data.transactions || []).filter(tx => tx.tx_type !== 'wallet_created');
      if (!notifs.length) {
        container.innerHTML = '';
        noNotif.classList.remove('hidden');
        return;
      }
      noNotif.classList.add('hidden');
      const icons = { gas_funded: '⛽', deposit: '📥', buy_machine: '⛏️', claim: '🎁', swap: '💱' };
      const msgs = {
        gas_funded: '0.1 POL offert pour vos transactions',
        deposit: 'Dépôt confirmé',
        buy_machine: 'Nouvelle machine achetée !',
        buy_battery: 'Nouvelle batterie achetée !',
        claim: 'Gains réclamés avec succès',
        swap: 'Swap effectué',
        plug: 'Machine branchée et active'
      };
      container.innerHTML = notifs.slice(0, 5).map(tx => {
        const dt = new Date(tx.created_at + 'Z');
        const timeAgo = this.timeAgo(dt);
        return `<div class="notif-item">
          <span class="notif-icon">${icons[tx.tx_type] || '📋'}</span>
          <div class="notif-body">
            <span class="notif-msg">${msgs[tx.tx_type] || this.escapeHtml(tx.tx_type)}</span>
            <span class="notif-time">${timeAgo}</span>
          </div>
        </div>`;
      }).join('');
    } catch (e) {
      noNotif.classList.remove('hidden');
    }
  }

  /** Efface les notifications de l'affichage (pas de la DB) */
  clearNotifications() {
    document.getElementById('account-notifications').innerHTML = '';
    document.getElementById('account-no-notifs').classList.remove('hidden');
    this.showToast('Notifications effacées');
  }

  /** Temps relatif ("il y a 5 min") */
  timeAgo(date) {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'À l\'instant';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `Il y a ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Il y a ${hours}h`;
    const days = Math.floor(hours / 24);
    return `Il y a ${days}j`;
  }

  /** Copie le lien de parrainage */
  copyRefLink() {
    const refId = this.dbUserId || '—';
    const link = `https://fitia-dex-app-production.up.railway.app/?ref=${refId}`;
    navigator.clipboard.writeText(link);
    this.showToast('✅ Lien de parrainage copié !');
  }

  /** Copie l'adresse wallet */
  copyWalletAddr() {
    navigator.clipboard.writeText(this.user);
    this.showToast('✅ Adresse copiée !');
  }

  /** Lie un parrain depuis la page Mon Compte */
  async bindReferrerAccount() {
    const input = document.getElementById('account-ref-input').value.trim();
    if (!input) return this.showToast('Adresse ou ID requis', true);
    if (!this.user) return this.showToast('Connectez-vous', true);
    this.setLoader(true, 'Liaison...');
    try {
      await this.apiCall('/api/blockchain/set-referrer', 'POST', { address: this.user, referrer: input });
      this.showToast('✅ Parrain lié !');
      document.getElementById('account-ref-input').value = '';
    } catch (e) { this.showToast(e.message, true); }
    this.setLoader(false);
  }

  /** Assistant chat : réponses prédéfinies FAQ */
  sendChatMsg() {
    const input = document.getElementById('account-chat-input');
    const msg = input.value.trim();
    if (!msg) return;

    const container = document.getElementById('account-chat-messages');
    container.innerHTML += `<div class="chat-msg user">${this.escapeHtml(msg)}</div>`;
    input.value = '';

    // Réponse automatique basée sur la FAQ
    const reply = this.getChatReply(msg.toLowerCase());
    setTimeout(() => {
      container.innerHTML += `<div class="chat-msg assistant">${reply}</div>`;
      container.scrollTop = container.scrollHeight;
    }, 500);
    container.scrollTop = container.scrollHeight;
  }

  getChatReply(msg) {
    const faq = [
      { q: ['comment', 'miner', 'minage', 'fonctionne'], a: '⚡ Le minage fonctionne avec des <b>machines</b> et des <b>batteries</b>. Achetez une machine dans la boutique, branchez-la avec une batterie, et vos gains FTA s\'accumulent automatiquement. Cliquez sur <b>RÉCLAMER</b> pour les récupérer.' },
      { q: ['machine', 'acheter'], a: '⛏️ Allez dans l\'onglet <b>Boutique</b>, choisissez une machine (STARTER → LEGEND) et payez en USDT ou FTA. Les prix et puissances sont visibles sur chaque carte.' },
      { q: ['batterie', 'durée', 'expire'], a: '🔋 Les batteries déterminent la durée d\'activité de votre machine : 3, 7, 15, 30, 90, 180, 270 ou 365 jours. Quand la batterie expire, la machine s\'arrête.' },
      { q: ['parrain', 'parrainage', 'commission'], a: '👥 Parrainez d\'autres utilisateurs avec votre lien (visible dans <b>Mon Compte</b>). Vous gagnez des commissions sur leurs achats : 3% niveau 1, 2% niveau 2, 1% niveau 3.' },
      { q: ['swap', 'échanger', 'fta', 'usdt'], a: '💱 Dans l\'onglet <b>Swap</b>, échangez USDT ↔ FTA au taux du marché. Les frais sont de 4%. Le taux évolue selon la <b>courbe de liaison</b> (bonding curve).' },
      { q: ['déposer', 'deposit', 'envoyer'], a: '📥 Pour déposer des USDT ou FTA, allez dans <b>Wallet</b>, choisissez le token, entrez le montant et cliquez sur <b>DÉPOSER</b>. Les fonds sont transférés vers le smart contract.' },
      { q: ['retirer', 'withdraw'], a: '📤 Pour retirer, même procédure que le dépôt mais cliquez sur <b>RETIRER</b>. Les fonds retournent vers votre adresse wallet Polygon.' },
      { q: ['id', 'adresse', 'wallet'], a: '📋 Votre adresse wallet Polygon est visible dans <b>Mon Compte</b>. Vous pouvez la copier pour recevoir des fonds. Votre ID de parrainage est aussi affiché.' },
      { q: ['gas', 'pol', 'frais'], a: '⛽ Chaque nouveau compte reçoit <b>0.1 POL</b> offert pour payer les frais de transaction (~10-20 transactions). Pensez à recharger votre wallet si besoin !' }
    ];

    let bestMatch = null, bestScore = 0;
    for (const entry of faq) {
      const score = entry.q.filter(kw => msg.includes(kw)).length;
      if (score > bestScore) { bestScore = score; bestMatch = entry; }
    }

    if (bestMatch && bestScore > 0) return bestMatch.a;
    return '🤔 Je ne suis pas sûr de comprendre. Essayez de me parler de : <b>minage, machines, batteries, swap, parrainage, dépôt, retrait, wallet</b>.';
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ═══ VISUALIZER ═══════════════════════════════════════════════════

  initVisualizer() {
    const c = document.getElementById('mining-canvas');
    if (!c) return;
    c.width = c.offsetWidth * 2;
    c.height = c.offsetHeight * 2;
    this.vizContext = c.getContext('2d');
    this.vizBars = [];
    for (let i = 0; i < 20; i++) this.vizBars.push({ height: 0, targetHeight: 0 });
    this.animateVisualizer();
  }

  animateVisualizer() {
    if (!this.vizContext) return;
    const ctx = this.vizContext;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = '#F0B90B';
    const w = ctx.canvas.width / 20;
    this.vizBars.forEach((b, i) => {
      b.height += (b.targetHeight - b.height) * 0.1;
      ctx.fillRect(i * w + 2, ctx.canvas.height - b.height, w - 4, b.height);
      b.targetHeight += (Math.random() - 0.5) * 10;
    });
    requestAnimationFrame(() => this.animateVisualizer());
  }

  // ═══ NAVIGATION ═══════════════════════════════════════════════════

  nav(viewId) {
    document.querySelectorAll('.view').forEach(el => { el.classList.remove('active'); el.style.display = 'none'; });
    const v = document.getElementById('view-' + viewId);
    if (v) { v.classList.add('active'); v.style.display = 'block'; }
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    const idx = { dashboard: 0, shop: 1, 'my-rigs': 2, swap: 3, account: 4 }[viewId];
    if (idx !== undefined) document.querySelectorAll('.nav-item')[idx]?.classList.add('active');
    if (viewId === 'account') this.loadAccount();
  }

  setLanguage(lang) {
    // Simplifié — garde la langue FR
  }
}

// ─── DÉMARRAGE ─────────────────────────────────────────────────────
const App = new Application();
App.init = function () {
  // Auto-fill pseudo si déjà utilisé
  const saved = localStorage.getItem('fitia_username');
  if (saved) {
    document.getElementById('login-identifier').value = saved;
  }
};
App.init();
