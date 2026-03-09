const AppState = {
    isConnected: false, account: null, currentTab: 'dashboard', paymentCurrency: 'USDT',
    swapDirection: 'USDT_TO_FTA', exchangeRate: 0, claimFee: 3, swapFee: 4,
    gameStats: { played: 0, won: 0, wagered: 0, totalWon: 0 }, dailyStreak: 0, lastClaimDate: null
};

document.addEventListener('DOMContentLoaded', async () => {
    initializeEventListeners(); loadLocalStorage(); updateDailyRewardsUI();
    const wasConnected = localStorage.getItem('walletConnected');
    if (wasConnected === 'true') { await connectWallet(); }
});

function initializeEventListeners() {
    document.getElementById('connectWallet').addEventListener('click', connectWallet);
    document.getElementById('disconnectWallet').addEventListener('click', disconnectWallet);
    document.querySelectorAll('.nav-item').forEach(item => { item.addEventListener('click', (e) => switchTab(e.currentTarget.dataset.tab)); });
    document.getElementById('payUSDT').addEventListener('click', () => setPaymentCurrency('USDT'));
    document.getElementById('payFTA').addEventListener('click', () => setPaymentCurrency('FTA'));
    document.getElementById('swapDirection1').addEventListener('click', () => setSwapDirection('USDT_TO_FTA'));
    document.getElementById('swapDirection2').addEventListener('click', () => setSwapDirection('FTA_TO_USDT'));
    document.getElementById('swapInput').addEventListener('input', calculateSwap);
    document.getElementById('swapButton').addEventListener('click', executeSwap);
    document.getElementById('claimDailyReward').addEventListener('click', claimDailyReward);
    document.getElementById('leaderboardPeriod').addEventListener('change', (e) => loadLeaderboard(e.target.value));
    document.getElementById('languageSelect').addEventListener('change', (e) => { localStorage.setItem('language', e.target.value); location.reload(); });
}

// Session Tab Functions
function showMiningTab(tab) {
    document.querySelectorAll('.mining-tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('#mining .section-tab').forEach(t => t.classList.remove('active'));
    document.getElementById(`mining-${tab}`).classList.add('active');
    event.currentTarget.classList.add('active');
}

function showGamesTab(tab) {
    document.querySelectorAll('.games-tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('#games .section-tab').forEach(t => t.classList.remove('active'));
    document.getElementById(`games-${tab}`).classList.add('active');
    event.currentTarget.classList.add('active');
}

function showAnalyticsTab(tab) {
    document.querySelectorAll('.analytics-tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('#analytics .section-tab').forEach(t => t.classList.remove('active'));
    document.getElementById(`analytics-${tab}`).classList.add('active');
    event.currentTarget.classList.add('active');
    if (tab === 'charts') { loadAnalytics(); } else if (tab === 'leaderboard') { loadLeaderboard(); }
}

function showProfileTab(tab) {
    document.querySelectorAll('.profile-tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('#profile .section-tab').forEach(t => t.classList.remove('active'));
    document.getElementById(`profile-${tab}`).classList.add('active');
    event.currentTarget.classList.add('active');
}

async function connectWallet() {
    showLoading(true);
    const result = await window.web3Manager.connect();
    if (result.success) {
        AppState.isConnected = true; AppState.account = result.account;
        localStorage.setItem('walletConnected', 'true');
        updateWalletUI(); await loadAllData();
        showToast('Portefeuille connecté sur Polygon!');
        addActivity('wallet', 'Portefeuille connecté', AppState.account);
    } else { showToast(result.error, 'error'); }
    showLoading(false);
}

async function disconnectWallet() { localStorage.removeItem('walletConnected'); await window.web3Manager.disconnect(); }

function updateWalletUI() {
    document.getElementById('connectWallet').classList.add('hidden');
    document.getElementById('walletInfo').classList.remove('hidden');
    document.getElementById('walletInfo').classList.add('flex');
    document.getElementById('walletAddress').textContent = `${AppState.account.substring(0, 6)}...${AppState.account.substring(38)}`;
    document.getElementById('profileAddress').textContent = AppState.account;
    updateBalances();
}

async function updateBalances() {
    if (!AppState.isConnected) return;
    const ftaBalance = await window.web3Manager.getBalance('FTA');
    const usdtBalance = await window.web3Manager.getBalance('USDT');
    document.getElementById('walletBalance').textContent = `${parseFloat(ftaBalance).toFixed(2)} FTA`;
    document.getElementById('swapInputBalance').textContent = AppState.swapDirection === 'USDT_TO_FTA' ? `${parseFloat(usdtBalance).toFixed(2)} USDT` : `${parseFloat(ftaBalance).toFixed(2)} FTA`;
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    document.querySelectorAll('.nav-item').forEach(item => { item.classList.toggle('active', item.dataset.tab === tabName); });
    AppState.currentTab = tabName; loadTabData(tabName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function loadTabData(tabName) {
    switch(tabName) {
        case 'dashboard': loadDashboardData(); break;
        case 'mining': loadMachinesGrid(); loadUserMachines(); showMiningTab('buy'); break;
        case 'analytics': showAnalyticsTab('charts'); break;
        case 'games': loadGamesData(); showGamesTab('all'); break;
        case 'profile': loadProfileData(); showProfileTab('info'); break;
        case 'swap': loadSwapData(); break;
    }
}

async function loadDashboardData() {
    if (!AppState.isConnected) return;
    const power = await window.web3Manager.contract.getActivePower(AppState.account);
    document.getElementById('totalPower').textContent = formatNumber(power);
    const jackpot = await window.web3Manager.contract.getWheelJackpot();
    document.getElementById('jackpotPool').textContent = formatNumber(jackpot) + ' FTA';
    await loadUserMachinesCount();
}

async function loadUserMachinesCount() {
    const userInfo = await window.web3Manager.contract.getUserInfo(AppState.account);
    document.getElementById('machineCount').textContent = userInfo.machines.length;
}

async function loadMachinesGrid() {
    const grid = document.getElementById('machinesGrid'); grid.innerHTML = '';
    const machineCount = await window.web3Manager.contract.getMachineCount();
    for (let i = 0; i < machineCount; i++) {
        const machine = await window.web3Manager.contract.getMachineType(i);
        grid.appendChild(createMachineCard(i, machine));
    }
}

function createMachineCard(typeId, machine) {
    const card = document.createElement('div'); card.className = 'machine-card';
    card.innerHTML = `<div class="machine-header"><span class="machine-name">Machine ${typeId + 1}</span><span class="machine-price">${formatNumber(machine.price)} USDT</span></div><div class="machine-power"><i class="fas fa-bolt text-yellow-400 mr-1"></i>${formatNumber(machine.power)} FTA/jour</div><button onclick="buyMachine(${typeId})" class="btn-primary w-full"><i class="fas fa-shopping-cart mr-2"></i>Acheter</button>`;
    return card;
}

function setPaymentCurrency(currency) {
    AppState.paymentCurrency = currency;
    document.getElementById('payUSDT').classList.toggle('active', currency === 'USDT');
    document.getElementById('payFTA').classList.toggle('active', currency === 'FTA');
}

async function buyMachine(typeId) {
    if (!AppState.isConnected) { showToast('Connectez votre portefeuille', 'error'); return; }
    showConfirmModal(`Confirmer l'achat de la machine ${typeId + 1}?`, async () => {
        showLoading(true);
        try {
            const useFTA = AppState.paymentCurrency === 'FTA';
            if (useFTA) {
                const machine = await window.web3Manager.contract.getMachineType(typeId);
                const exchangeRate = await window.web3Manager.contract.getExchangeRate();
                await window.web3Manager.approve('FTA', machine.price.mul(exchangeRate).div(1000000));
            } else {
                const machine = await window.web3Manager.contract.getMachineType(typeId);
                await window.web3Manager.approve('USDT', machine.price);
            }
            await window.web3Manager.contract.buyMachine(typeId, useFTA);
            showToast('Machine achetée avec succès!');
            addActivity('machine', `Machine ${typeId + 1} achetée`, AppState.paymentCurrency);
            await loadAllData();
        } catch (error) { showToast(error.reason || 'Erreur lors de l\'achat', 'error'); }
        showLoading(false);
    });
}

async function loadUserMachines() {
    const list = document.getElementById('myMachinesList');
    if (!AppState.isConnected) { list.innerHTML = '<div class="text-center text-gray-400 py-8">Connectez votre portefeuille</div>'; return; }
    const userInfo = await window.web3Manager.contract.getUserInfo(AppState.account);
    if (userInfo.machines.length === 0) { list.innerHTML = '<div class="text-center text-gray-400 py-8"><i class="fas fa-box-open text-3xl mb-2 opacity-50"></i><p>Aucune machine</p><button onclick="switchTab(\'mining\')" class="btn-primary mt-4 text-sm py-2"><i class="fas fa-shopping-cart mr-2"></i>Acheter</button></div>'; return; }
    list.innerHTML = '';
    for (let i = 0; i < userInfo.machines.length; i++) {
        const m = userInfo.machines[i];
        const item = document.createElement('div'); item.className = 'activity-item';
        item.innerHTML = `<div class="activity-icon bg-indigo-500/20"><i class="fas fa-microchip text-indigo-400"></i></div><div class="activity-details"><div class="activity-title">Machine ${m.typeId + 1}</div><div class="activity-time">${formatDate(m.boughtAt.toNumber() * 1000)}</div></div>`;
        list.appendChild(item);
    }
}

async function claimRewards() {
    if (!AppState.isConnected) { showToast('Connectez votre portefeuille', 'error'); return; }
    showConfirmModal('Confirmer la réclamation des récompenses?', async () => {
        showLoading(true);
        try { await window.web3Manager.contract.claimRewards(); showToast('Récompenses réclamées avec succès!'); addActivity('claim', 'Récompenses réclamées', '+ FTA'); await loadAllData(); }
        catch (error) { showToast(error.reason || 'Rien à réclamer pour le moment', 'error'); }
        showLoading(false);
    });
}

function setSwapDirection(direction) {
    AppState.swapDirection = direction;
    document.getElementById('swapDirection1').classList.toggle('active', direction === 'USDT_TO_FTA');
    document.getElementById('swapDirection2').classList.toggle('active', direction === 'FTA_TO_USDT');
    document.getElementById('swapInputToken').textContent = direction === 'USDT_TO_FTA' ? 'USDT' : 'FTA';
    document.getElementById('swapOutputToken').textContent = direction === 'USDT_TO_FTA' ? 'FTA' : 'USDT';
    calculateSwap(); updateBalances();
}

function swapDirections() { setSwapDirection(AppState.swapDirection === 'USDT_TO_FTA' ? 'FTA_TO_USDT' : 'USDT_TO_FTA'); }

function setMaxAmount() {
    const balance = document.getElementById('swapInputBalance').textContent.split(' ')[0];
    document.getElementById('swapInput').value = balance;
    calculateSwap();
}

function calculateSwap() {
    const input = parseFloat(document.getElementById('swapInput').value) || 0;
    const feeRate = AppState.swapFee / 100;
    const exchangeRate = AppState.exchangeRate / 1000000;
    let out = 0, fee = 0;
    if (AppState.swapDirection === 'USDT_TO_FTA') { fee = input * feeRate; out = (input - fee) * exchangeRate; }
    else { const gross = input / exchangeRate; fee = gross * feeRate; out = gross - fee; }
    document.getElementById('swapOutput').value = out.toFixed(4);
    document.getElementById('swapFeeDisplay').textContent = fee.toFixed(2);
    document.getElementById('swapRateDisplay').textContent = `1:${exchangeRate.toFixed(4)}`;
}

async function executeSwap() {
    if (!AppState.isConnected) { showToast('Connectez votre portefeuille', 'error'); return; }
    const inputAmount = parseFloat(document.getElementById('swapInput').value);
    if (inputAmount <= 0) { showToast('Montant invalide', 'error'); return; }
    showConfirmModal(`Confirmer l'échange de ${inputAmount}?`, async () => {
        showLoading(true);
        try {
            const token = AppState.swapDirection === 'USDT_TO_FTA' ? 'USDT' : 'FTA';
            const decimals = token === 'USDT' ? 6 : 8;
            await window.web3Manager.approve(token, ethers.utils.parseUnits(inputAmount.toString(), decimals));
            if (AppState.swapDirection === 'USDT_TO_FTA') { await window.web3Manager.contract.swapUsdtForFta(ethers.utils.parseUnits(inputAmount.toString(), 6)); }
            else { await window.web3Manager.contract.swapFtaForUsdt(ethers.utils.parseUnits(inputAmount.toString(), 8)); }
            showToast('Échange effectué avec succès!');
            addActivity('swap', 'Token échangé', AppState.swapDirection);
            await updateBalances();
        } catch (error) { showToast(error.reason || 'Erreur lors de l\'échange', 'error'); }
        showLoading(false);
    });
}

async function loadSwapData() {
    const rate = await window.web3Manager.contract.getExchangeRate();
    AppState.exchangeRate = rate.toNumber();
    AppState.claimFee = (await window.web3Manager.contract.getClaimFee()).toNumber();
    AppState.swapFee = (await window.web3Manager.contract.getSwapFee()).toNumber();
    document.getElementById('exchangeRateDisplay').textContent = `1 USDT = ${(AppState.exchangeRate / 1000000).toFixed(4)} FTA`;
    calculateSwap();
}

async function loadGamesData() {
    document.getElementById('wheelJackpotDisplay').textContent = formatNumber(await window.web3Manager.contract.getWheelJackpot()) + ' FTA';
    document.getElementById('lotteryPoolDisplay').textContent = formatNumber(await window.web3Manager.contract.getLotteryPool()) + ' FTA';
    loadGameStats();
}

function openGameModal(gameType) {
    if (!AppState.isConnected) { showToast('Connectez votre portefeuille', 'error'); return; }
    document.getElementById('gameModal').classList.remove('hidden');
    document.getElementById('modalTitle').textContent = gameType.toUpperCase();
    document.getElementById('modalBody').innerHTML = `<div class="text-center"><button onclick="playGame('${gameType}')" class="btn-primary w-full py-4">Jouer</button></div>`;
}

function closeGameModal() { document.getElementById('gameModal').classList.add('hidden'); }

async function playGame(game) {
    showLoading(true);
    try {
        if (game === 'wingo') await window.web3Manager.contract.playWinGo(ethers.utils.parseUnits('100', 8), 0, 5);
        else if (game === 'wheel') await window.web3Manager.contract.spinWheel();
        else if (game === 'lottery') await window.web3Manager.contract.buyLotteryTicket();
        else if (game === 'fishing') await window.web3Manager.contract.goFishing();
        showToast('Partie jouée avec succès!');
        closeGameModal();
    } catch (error) { showToast(error.reason || 'Erreur', 'error'); }
    showLoading(false);
}

function loadGameStats() {
    const stats = JSON.parse(localStorage.getItem('gameStats') || '{"played":0,"won":0,"wagered":0,"totalWon":0}');
    document.getElementById('gamesPlayed').textContent = stats.played;
    document.getElementById('gamesWon').textContent = stats.won;
    document.getElementById('totalWagered').textContent = formatNumber(stats.wagered);
    document.getElementById('totalWon').textContent = formatNumber(stats.totalWon);
}

async function loadProfileData() {
    if (!AppState.isConnected) return;
    const referrer = await window.web3Manager.contract.getReferrer(AppState.account);
    document.getElementById('referrerAddress').textContent = referrer !== '0x0000000000000000000000000000000000000000' ? `${referrer.substring(0, 6)}...${referrer.substring(38)}` : 'Non défini';
    document.getElementById('referralLink').value = `${window.location.origin}/?ref=${AppState.account}`;
    document.getElementById('memberSince').textContent = formatDate(Date.now());
}

async function setReferrer() {
    const referrer = document.getElementById('referrerInput').value;
    if (!referrer || !ethers.utils.isAddress(referrer)) { showToast('Adresse invalide', 'error'); return; }
    showConfirmModal('Confirmer ce parrain?', async () => {
        showLoading(true);
        try { await window.web3Manager.contract.setReferrer(referrer); showToast('Parrain défini avec succès!'); await loadProfileData(); }
        catch (error) { showToast(error.reason || 'Erreur', 'error'); }
        showLoading(false);
    });
}

function copyReferralLink() { document.getElementById('referralLink').select(); document.execCommand('copy'); showToast('Lien copié dans le presse-papier!'); }

function updateDailyRewardsUI() {
    const stored = localStorage.getItem('dailyStreak');
    if (stored) { const d = JSON.parse(stored); AppState.dailyStreak = d.streak; AppState.lastClaimDate = d.lastClaim; }
    document.getElementById('streakCount').textContent = `${AppState.dailyStreak} jours`;
    const btn = document.getElementById('claimDailyReward');
    btn.disabled = !canClaimToday();
    btn.innerHTML = canClaimToday() ? '<i class="fas fa-gift mr-2"></i>Réclamer' : '<i class="fas fa-check mr-2"></i>Déjà réclamé';
}

function canClaimToday() {
    if (!AppState.lastClaimDate) return true;
    return new Date().toDateString() !== new Date(AppState.lastClaimDate).toDateString();
}

async function claimDailyReward() {
    if (!canClaimToday()) { showToast('Déjà réclamé aujourd\'hui!', 'error'); return; }
    showLoading(true);
    AppState.dailyStreak++; AppState.lastClaimDate = Date.now();
    localStorage.setItem('dailyStreak', JSON.stringify({ streak: AppState.dailyStreak, lastClaim: AppState.lastClaimDate }));
    const rewards = [10,20,30,50,80,100,200];
    showToast(`+${rewards[Math.min(AppState.dailyStreak,6)]} FTA réclamés!`);
    updateDailyRewardsUI();
    showLoading(false);
}

function addActivity(type, title, amount) {
    const activities = JSON.parse(localStorage.getItem('activities') || '[]');
    activities.unshift({ id: Date.now(), type, title, amount, timestamp: Date.now() });
    activities.splice(50);
    localStorage.setItem('activities', JSON.stringify(activities));
    renderActivity();
}

function renderActivity() {
    const list = document.getElementById('activityList');
    const activities = JSON.parse(localStorage.getItem('activities') || '[]');
    if (activities.length === 0) { list.innerHTML = '<div class="text-center text-gray-400 py-8"><i class="fas fa-inbox text-3xl mb-2 opacity-50"></i><p class="text-sm">Aucune activité récente</p></div>'; return; }
    list.innerHTML = '';
    activities.slice(0, 10).forEach(act => {
        const item = document.createElement('div'); item.className = 'activity-item';
        item.innerHTML = `<div class="activity-details"><div class="activity-title">${act.title}</div><div class="activity-time">${formatTimeAgo(act.timestamp)}</div></div><div class="activity-amount">${act.amount}</div>`;
        list.appendChild(item);
    });
}

function clearActivity() { localStorage.removeItem('activities'); renderActivity(); showToast('Activité effacée!'); }

function loadAnalytics() {
    document.getElementById('roiPercentage').textContent = '+24.5%';
    document.getElementById('avgDailyEarnings').textContent = '175';
    document.getElementById('totalInvested').textContent = '500';
    document.getElementById('profitLoss').textContent = '+125';
}

function loadLeaderboard() {
    const mockData = [{ address: '0x1234567890123456789012345678901234567890', power: 15000, earnings: 45000 }, { address: '0x2345678901234567890123456789012345678901', power: 12000, earnings: 38000 }, { address: '0x3456789012345678901234567890123456789012', power: 10000, earnings: 32000 }];
    if (mockData[0]) document.getElementById('rank1Earnings').textContent = formatNumber(mockData[0].earnings) + ' FTA';
    if (mockData[1]) document.getElementById('rank2Earnings').textContent = formatNumber(mockData[1].earnings) + ' FTA';
    if (mockData[2]) document.getElementById('rank3Earnings').textContent = formatNumber(mockData[2].earnings) + ' FTA';
}

function formatNumber(num) { if (typeof num === 'object' && num._isBigNumber) num = ethers.utils.formatEther(num); return parseFloat(num).toLocaleString('fr-FR', { maximumFractionDigits: 2 }); }
function formatDate(ts) { return new Date(ts).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }); }
function formatTimeAgo(ts) { const d = Math.floor((Date.now() - ts) / 60000); return d < 1 ? 'À l\'instant' : d < 60 ? `Il y a ${d} min` : d < 1440 ? `Il y a ${Math.floor(d/60)}h` : `Il y a ${Math.floor(d/1440)}j`; }

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.className = `toast ${type}`;
    document.getElementById('toastMessage').textContent = message;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 3000);
    if (window.notificationManager) { window.notificationManager.add(type, type === 'success' ? 'Succès' : 'Erreur', message); }
}

function showLoading(show) { document.getElementById('loadingOverlay').classList.toggle('hidden', !show); }

function showConfirmModal(message, onConfirm) {
    document.getElementById('confirmMessage').textContent = message;
    document.getElementById('confirmModal').classList.remove('hidden');
    document.getElementById('confirmAction').onclick = () => { closeConfirmModal(); onConfirm(); };
}

function closeConfirmModal() { document.getElementById('confirmModal').classList.add('hidden'); }
function closeErrorModal() { document.getElementById('errorModal').classList.add('hidden'); }

function loadLocalStorage() { const s = localStorage.getItem('gameStats'); if (s) AppState.gameStats = JSON.parse(s); }

async function loadAllData() { await loadDashboardData(); await loadProfileData(); await loadSwapData(); await loadGamesData(); renderActivity(); updateBalances(); }

function exportData() {
    const data = { account: AppState.account, gameStats: AppState.gameStats, exportDate: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `fitia-data-${Date.now()}.json`; a.click();
    showToast('Données exportées avec succès!');
}

function clearData() {
    showConfirmModal('Êtes-vous sûr de vouloir effacer toutes les données locales?', () => {
        localStorage.removeItem('gameStats'); localStorage.removeItem('activities'); localStorage.removeItem('dailyStreak'); localStorage.removeItem('notifications');
        showToast('Données effacées!'); location.reload();
    });
}

function toggleNotifications() { document.getElementById('notificationPanel').classList.toggle('hidden'); }

async function enablePushNotifications() {
    if ('Notification' in window) {
        const p = await Notification.requestPermission();
        showToast(p === 'granted' ? 'Notifications activées!' : 'Permission refusée', p === 'granted' ? 'success' : 'error');
    }
}

class NotificationManager {
    constructor() { this.notifications = JSON.parse(localStorage.getItem('notifications') || '[]'); this.updateBadge(); }
    add(type, title, message) {
        this.notifications.unshift({ id: Date.now(), type, title, message, timestamp: Date.now(), read: false });
        this.notifications.splice(50);
        localStorage.setItem('notifications', JSON.stringify(this.notifications));
        this.updateBadge();
    }
    updateBadge() {
        const badge = document.getElementById('notificationBadge');
        const count = this.notifications.filter(n => !n.read).length;
        if (count > 0) { badge.textContent = count > 9 ? '9+' : count; badge.classList.remove('hidden'); }
        else { badge.classList.add('hidden'); }
    }
}
window.notificationManager = new NotificationManager();