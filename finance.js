// ═══════════════════════════════════════════════════════════════════
//  Fitia-Finance — Module Staking (chargé après app.js)
//  Dépend des globales : App, CONFIG, i18n, ethers (v6)
//  Contrat : FitiaStakingV1.sol (voir staking/ et docs/DESIGN_FitiaFinance.md)
// ═══════════════════════════════════════════════════════════════════
(function () {
  'use strict';

  // ─── ABI minimale de FitiaStakingV1 ──────────────────────────────
  const STAKING_ABI = [
    "function poolCount() view returns (uint256)",
    "function poolInfo(uint256) view returns (uint64 dur, uint16 apyBps, uint128 minAmt, bool active, uint256 totalStaked)",
    "function myPositions(address) view returns (uint256[] poolIds, uint256[] amounts, uint64[] starts, uint16[] apys, bool[] open, uint256[] pendings)",
    "function pendingReward(address,uint256) view returns (uint256)",
    "function totalPending(address) view returns (uint256)",
    "function rewardsBalance() view returns (uint256)",
    "function stake(uint256,uint256)",
    "function claimRewards(uint256)",
    "function unstake(uint256)"
  ];

  // ─── Traductions du module (fusionnées dans i18n au chargement) ──
  const FIN_I18N = {
    fr: {
      finTitle: "📈 Finance", finConnect: "Connecte ton wallet pour accéder au staking 📈",
      finSoon: "Le module Finance s'activera après le déploiement du contrat de staking.",
      finTotalStaked: "Total Staké", finPending: "Récompenses en attente",
      finClaimAll: "TOUT RÉCLAMER", finPools: "🏦 Pools de staking",
      finMyPos: "📜 Mes positions", finNoPos: "Aucune position de staking pour le moment.",
      finLocked: "Verrouillé", finReady: "Disponible", finClosed: "Terminé",
      finUnlock: "DÉBLOCKER", finClaim: "RÉCLAMER", finReserve: "Réserve de récompenses",
      finMin: "Min", finDays: "j", finStakeBtn: "STAKER", finAmount: "Montant en FTA",
      finEstDay: "Par jour", finEstTerm: "Rendement à terme", finConfirm: "CONFIRMER LE STAKE",
      finErrMin: "Montant inférieur au minimum du pool.", finErrBal: "Solde FTA insuffisant.",
      finOkStake: "Stake confirmé ! Ton FTA est verrouillé 🔒",
      finOkClaim: "Récompenses envoyées dans ton wallet 🎉",
      finOkUnlock: "Principal débloqué et retourné dans ton solde ✅",
      finNothing: "Aucune récompense à réclamer pour le moment.",
      finErrLoad: "Impossible de charger le module Finance."
    },
    en: {
      finTitle: "📈 Finance", finConnect: "Connect your wallet to access staking 📈",
      finSoon: "The Finance module will activate after the staking contract is deployed.",
      finTotalStaked: "Total Staked", finPending: "Pending rewards",
      finClaimAll: "CLAIM ALL", finPools: "🏦 Staking pools",
      finMyPos: "📜 My positions", finNoPos: "No staking position yet.",
      finLocked: "Locked", finReady: "Available", finClosed: "Closed",
      finUnlock: "UNLOCK", finClaim: "CLAIM", finReserve: "Rewards reserve",
      finMin: "Min", finDays: "d", finStakeBtn: "STAKE", finAmount: "Amount in FTA",
      finEstDay: "Per day", finEstTerm: "Estimated at term", finConfirm: "CONFIRM STAKE",
      finErrMin: "Amount below the pool minimum.", finErrBal: "Insufficient FTA balance.",
      finOkStake: "Stake confirmed! Your FTA is locked 🔒",
      finOkClaim: "Rewards sent to your wallet 🎉",
      finOkUnlock: "Principal unlocked and returned to your balance ✅",
      finNothing: "No rewards to claim yet.",
      finErrLoad: "Unable to load the Finance module."
    },
    de: {
      finTitle: "📈 Finance", finConnect: "Verbinde deine Wallet, um Staking zu nutzen 📈",
      finSoon: "Das Finanz-Modul wird nach dem Einsatz des Staking-Vertrags aktiviert.",
      finTotalStaked: "Insgesamt gestakt", finPending: "Ausstehende Belohnungen",
      finClaimAll: "ALLES ABHOLEN", finPools: "🏦 Staking-Pools",
      finMyPos: "📜 Meine Positionen", finNoPos: "Noch keine Staking-Position.",
      finLocked: "Gesperrt", finReady: "Verfügbar", finClosed: "Beendet",
      finUnlock: "ENTSPERREN", finClaim: "ABHOLEN", finReserve: "Belohnungsreserve",
      finMin: "Min", finDays: "T", finStakeBtn: "STAKEN", finAmount: "Betrag in FTA",
      finEstDay: "Pro Tag", finEstTerm: "Ertrag bei Fälligkeit", finConfirm: "STAKE BESTÄTIGEN",
      finErrMin: "Betrag unter dem Pool-Minimum.", finErrBal: "Unzureichender FTA-Saldo.",
      finOkStake: "Stake bestätigt! Dein FTA ist gesperrt 🔒",
      finOkClaim: "Belohnungen an deine Wallet gesendet 🎉",
      finOkUnlock: "Kapital freigegeben und deinem Guthaben zurückgegeben ✅",
      finNothing: "Noch keine Belohnungen zum Abholen.",
      finErrLoad: "Finanz-Modul konnte nicht geladen werden."
    },
    zh: {
      finTitle: "📈 理财", finConnect: "请连接钱包以使用质押功能 📈",
      finSoon: "质押合约部署后，理财模块将启用。",
      finTotalStaked: "总质押量", finPending: "待领取奖励",
      finClaimAll: "全部领取", finPools: "🏦 质押池",
      finMyPos: "📜 我的仓位", finNoPos: "暂无质押仓位。",
      finLocked: "锁定中", finReady: "可解锁", finClosed: "已结束",
      finUnlock: "解锁", finClaim: "领取", finReserve: "奖励储备金",
      finMin: "最低", finDays: "天", finStakeBtn: "质押", finAmount: "FTA 数量",
      finEstDay: "每日", finEstTerm: "到期预计收益", finConfirm: "确认质押",
      finErrMin: "金额低于质押池最低限额。", finErrBal: "FTA 余额不足。",
      finOkStake: "质押成功！你的 FTA 已锁定 🔒",
      finOkClaim: "奖励已发送至你的钱包 🎉",
      finOkUnlock: "本金已解锁并退回余额 ✅",
      finNothing: "暂无可领取的奖励。",
      finErrLoad: "理财模块加载失败。"
    },
    sg: {
      finTitle: "📈 Finance", finConnect: "Connect your wallet to access staking 📈",
      finSoon: "The Finance module will activate after the staking contract is deployed.",
      finTotalStaked: "Total Staked", finPending: "Pending rewards",
      finClaimAll: "CLAIM ALL", finPools: "🏦 Staking pools",
      finMyPos: "📜 My positions", finNoPos: "No staking position yet.",
      finLocked: "Locked", finReady: "Available", finClosed: "Closed",
      finUnlock: "UNLOCK", finClaim: "CLAIM", finReserve: "Rewards reserve",
      finMin: "Min", finDays: "d", finStakeBtn: "STAKE", finAmount: "Amount in FTA",
      finEstDay: "Per day", finEstTerm: "Estimated at term", finConfirm: "CONFIRM STAKE",
      finErrMin: "Amount below the pool minimum.", finErrBal: "Insufficient FTA balance.",
      finOkStake: "Stake confirmed! Your FTA is locked 🔒",
      finOkClaim: "Rewards sent to your wallet 🎉",
      finOkUnlock: "Principal unlocked and returned to your balance ✅",
      finNothing: "No rewards to claim yet.",
      finErrLoad: "Unable to load the Finance module."
    }
  };
  for (const lang in FIN_I18N) {
    if (i18n[lang]) Object.assign(i18n[lang], FIN_I18N[lang]);
    else i18n[lang] = { ...FIN_I18N[lang] };
  }

  // ─── Métadonnées des pools (badges du même style que la boutique) ─
  const POOL_META = [
    { name: 'STARTER',  badge: 'background:#64748b;color:#fff' },
    { name: 'GROWER',   badge: 'background:#10b981;color:#000' },
    { name: 'BOOSTER',  badge: 'background:#3b82f6;color:#fff' },
    { name: 'ADVANCED', badge: 'background:#8b5cf6;color:#fff' },
    { name: 'ELITE',    badge: 'background:#F0B90B;color:#000' },
    { name: 'ULTRA',    badge: 'background:#f97316;color:#fff' },
    { name: 'DIAMOND',  badge: 'background:#22d3ee;color:#000' }
  ];

  // ─── Module Finance ──────────────────────────────────────────────
  const FIN = {
    contract: null,
    _poolId: 0,
    _minAmt: 0n,
    _dur: 0,
    _apyBps: 0,

    // Adresse du contrat configurée ? (placeholder "0x..." → non)
    ready() {
      const a = (CONFIG.STAKING || '').trim();
      return /^0x[a-fA-F0-9]{40}$/.test(a);
    },

    // Instance du contrat (signer si connecté, provider sinon)
    c() {
      if (!this.contract) {
        this.contract = new ethers.Contract(CONFIG.STAKING, STAKING_ABI, App.signer || App.provider);
      }
      return this.contract;
    },

    // FTA = 8 décimales
    fmtFta(raw) { return Number(ethers.formatUnits(raw, 8)); },
    fmtFtaStr(raw, dec = 2) { return this.fmtFta(raw).toFixed(dec); },

    fmtDays(sec) {
      const d = Math.floor(sec / 86400);
      const h = Math.floor((sec % 86400) / 3600);
      return d > 0 ? `${d}${App.t('finDays')}${h}h` : `${h}h`;
    },

    // ─── Chargement de l'écran Finance ───
    async load() {
      const grid = document.getElementById('fin-pool-grid');
      const posList = document.getElementById('fin-pos-list');
      if (!grid || !posList) return;

      // Non connecté → invitation à se connecter
      if (!App.user) {
        grid.innerHTML = `<p class="small-text" style="grid-column:1/-1;text-align:center;">${App.t('finConnect')}</p>`;
        posList.innerHTML = '';
        document.getElementById('fin-total-staked').innerText = '—';
        document.getElementById('fin-pending').innerText = '—';
        document.getElementById('fin-reserve').innerText = '—';
        return;
      }
      // Contrat pas encore déployé/configuré → message d'attente
      if (!this.ready()) {
        grid.innerHTML = `<p class="small-text" style="grid-column:1/-1;text-align:center;">${App.t('finSoon')}</p>`;
        posList.innerHTML = `<p class="small-text" style="text-align:center;">${App.t('finSoon')}</p>`;
        return;
      }

      try {
        App.setLoader(true, 'Finance...');
        const c = this.c();
        const nPools = Number(await c.poolCount());
        const poolReads = [];
        for (let i = 0; i < nPools; i++) poolReads.push(c.poolInfo(i));
        const pools = await Promise.all(poolReads);
        const [ids, amts, starts, apys, opens, pends] = await c.myPositions(App.user);
        const reserve = await c.rewardsBalance();

        // ── Rendu des pools (cartes du même style que la boutique) ──
        grid.innerHTML = pools.map((p, i) => {
          const meta = POOL_META[i % POOL_META.length];
          const apy = Number(p.apyBps) / 100;
          const durD = Math.round(Number(p.dur) / 86400);
          const min = this.fmtFta(p.minAmt);
          return `<div class="rig-item" onclick="App.openStakeModal(${i})">
            <span class="tier-badge" style="${meta.badge}">${meta.name}</span>
            <div class="fin-apy">${apy}%</div>
            <div class="rig-power">${durD} ${App.t('finDays')}</div>
            <div class="small-text">${App.t('finMin')} : ${min} FTA</div>
            <button class="btn-primary" style="padding:8px;font-size:0.75rem;margin-top:6px;" onclick="event.stopPropagation();App.openStakeModal(${i})">${App.t('finStakeBtn')}</button>
          </div>`;
        }).join('');

        // ── Rendu des positions ──
        const now = Math.floor(Date.now() / 1000);
        if (ids.length === 0) {
          posList.innerHTML = `<p class="small-text" style="text-align:center;">${App.t('finNoPos')}</p>`;
        } else {
          let html = '';
          for (let i = 0; i < ids.length; i++) {
            const poolIdx = Number(ids[i]);
            const meta = POOL_META[poolIdx % POOL_META.length];
            const dur = Number(pools[poolIdx].dur);
            const start = Number(starts[i]);
            const elapsed = Math.max(0, Math.min(now - start, dur));
            const pct = Math.min(100, Math.round((elapsed / dur) * 100));
            const end = start + dur;
            const unlocked = now >= end;
            // État : ouvert + échu = disponible ; ouvert + non échu = verrouillé ; fermé = terminé
            const pill = !opens[i]
              ? `<span class="status-pill available">${App.t('finClosed')}</span>`
              : (unlocked
                ? `<span class="status-pill active">${App.t('finReady')}</span>`
                : `<span class="status-pill inactive">${App.t('finLocked')} · ${this.fmtDays(end - now)}</span>`);
            html += `<div class="asset-row">
              <div class="asset-info">
                <div class="asset-name">${meta.name} ${pill}</div>
                <div class="asset-detail">${this.fmtFtaStr(amts[i], 2)} FTA · APY ${Number(apys[i]) / 100}%</div>
                <div class="battery-bar-wrap"><div class="battery-bar"><div class="battery-bar-fill green" style="width:${pct}%"></div></div></div>
              </div>
              <div class="fin-pos-right">
                <div class="fin-pending-val">+${this.fmtFtaStr(pends[i], 4)} FTA</div>
                <button class="btn-sm btn-full" style="padding:6px 10px;font-size:0.68rem;" onclick="App.claimStakePos(${i})">${App.t('finClaim')}</button>
                ${(opens[i] && unlocked) ? `<button class="btn-sm btn-wallet-withdraw" style="padding:6px 10px;font-size:0.68rem;margin-top:4px;border-radius:8px;" onclick="App.unstakePos(${i})">${App.t('finUnlock')}</button>` : ''}
              </div>
            </div>`;
          }
          posList.innerHTML = html;
        }

        // ── Carte héro + réserve ──
        let totalStaked = 0, totalPending = 0;
        for (let i = 0; i < ids.length; i++) {
          if (opens[i]) totalStaked += this.fmtFta(amts[i]);
          totalPending += this.fmtFta(pends[i]);
        }
        document.getElementById('fin-total-staked').innerText = totalStaked.toFixed(2) + ' FTA';
        document.getElementById('fin-pending').innerText = totalPending.toFixed(6) + ' FTA';
        document.getElementById('fin-reserve').innerText = this.fmtFtaStr(reserve, 2) + ' FTA';
      } catch (e) {
        console.error('Finance load:', e);
        grid.innerHTML = `<p class="small-text" style="grid-column:1/-1;text-align:center;">${App.t('finErrLoad')}</p>`;
      } finally {
        App.setLoader(false);
      }
    },

    // ─── Modale de stake ───
    async openStakeModal(poolId) {
      if (!App.user) { App.showToast(App.t('finConnect'), true); return; }
      if (!this.ready()) { App.showToast(App.t('finSoon'), true); return; }
      try {
        const p = await this.c().poolInfo(poolId);
        this._poolId = poolId;
        this._minAmt = p.minAmt;
        this._dur = Number(p.dur);
        this._apyBps = Number(p.apyBps);
        const meta = POOL_META[poolId % POOL_META.length];
        document.getElementById('stake-pool-title').innerText =
          `${meta.name} · ${this._apyBps / 100}% · ${Math.round(this._dur / 86400)}${App.t('finDays')}`;
        const fBalRaw = await App.core.fBal(App.user);
        document.getElementById('fin-stake-bal').innerText = this.fmtFtaStr(fBalRaw, 4);
        document.getElementById('stake-amount').value = '';
        document.getElementById('stake-est-day').innerText = '—';
        document.getElementById('stake-est-term').innerText = '—';
        document.getElementById('modal-stake').classList.add('active');
      } catch (e) { App.showError(e); }
    },

    // Estimation live : intérêts/jour + rendement total à terme
    updateStakeEst() {
      const v = parseFloat(document.getElementById('stake-amount').value || '0');
      const dayEl = document.getElementById('stake-est-day');
      const termEl = document.getElementById('stake-est-term');
      if (!v || v <= 0) { dayEl.innerText = '—'; termEl.innerText = '—'; return; }
      const perDay = v * (this._apyBps / 10000) / 365;
      const term = v * (this._apyBps / 10000) * (this._dur / 86400 / 365);
      dayEl.innerText = perDay.toFixed(4) + ' FTA';
      termEl.innerText = term.toFixed(4) + ' FTA';
    },

    async setMaxStake() {
      try {
        const fBalRaw = await App.core.fBal(App.user);
        document.getElementById('stake-amount').value = this.fmtFtaStr(fBalRaw, 4);
        this.updateStakeEst();
      } catch (e) { App.showError(e); }
    },

    async confirmStake() {
      const val = parseFloat(document.getElementById('stake-amount').value || '0');
      if (!val || val <= 0) return;
      // Garde frontend : minimum du pool (en unités brutes 8 décimales)
      if (BigInt(Math.round(val * 1e8)) < this._minAmt) { App.showToast(App.t('finErrMin'), true); return; }
      try {
        App.setLoader(true, 'Stake...');
        const raw = ethers.parseUnits(val.toString(), 8);
        const fBalRaw = await App.core.fBal(App.user);
        if (raw > fBalRaw) { App.setLoader(false); App.showToast(App.t('finErrBal'), true); return; }
        const tx = await this.c().stake(this._poolId, raw);
        await tx.wait();
        App.setLoader(false);
        App.closeModals();
        App.showToast(App.t('finOkStake'));
        this.load();
      } catch (e) {
        App.setLoader(false);
        App.showError(e);
      }
    },

    async claimStakePos(posId) {
      try {
        App.setLoader(true);
        const tx = await this.c().claimRewards(posId);
        await tx.wait();
        App.setLoader(false);
        App.showToast(App.t('finOkClaim'));
        this.load();
      } catch (e) { App.setLoader(false); App.showError(e); }
    },

    async unstakePos(posId) {
      try {
        App.setLoader(true);
        const tx = await this.c().unstake(posId);
        await tx.wait();
        App.setLoader(false);
        App.showToast(App.t('finOkUnlock'));
        this.load();
      } catch (e) { App.setLoader(false); App.showError(e); }
    },

    // Réclame toutes les positions qui ont du pending (séquentiel : 1 tx par position)
    async claimAllStake() {
      if (!App.user) { App.showToast(App.t('finConnect'), true); return; }
      if (!this.ready()) { App.showToast(App.t('finSoon'), true); return; }
      try {
        App.setLoader(true);
        const pends = (await this.c().myPositions(App.user))[5];
        let done = 0;
        for (let i = 0; i < pends.length; i++) {
          if (pends[i] > 0n) {
            try {
              const tx = await this.c().claimRewards(i);
              await tx.wait();
              done++;
            } catch (e) { /* position suivante */ }
          }
        }
        App.setLoader(false);
        App.showToast(done > 0 ? App.t('finOkClaim') : App.t('finNothing'));
        this.load();
      } catch (e) { App.setLoader(false); App.showError(e); }
    }
  };

  // ─── Branchement sur l'application (App est global) ──────────────
  App.loadFinance   = () => FIN.load();
  App.openStakeModal = (i) => FIN.openStakeModal(i);
  App.updateStakeEst = () => FIN.updateStakeEst();
  App.setMaxStake    = () => FIN.setMaxStake();
  App.confirmStake   = () => FIN.confirmStake();
  App.claimStakePos  = (i) => FIN.claimStakePos(i);
  App.unstakePos     = (i) => FIN.unstakePos(i);
  App.claimAllStake  = () => FIN.claimAllStake();
})();
