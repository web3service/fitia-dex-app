// =================================================================================
// CONFIGURATION
// =================================================================================
const CONTRACT_ADDRESS = "0xAfdFb346F819ffF3DdEF77e23E25a34E19c7Cab2"; 
const POLYGON_CHAIN_ID = 137;

// ABI Minimaliste pour la vitesse
const CONTRACT_ABI = [
    "function getAssetPrice(uint8) view returns (uint256)",
    "function internalBalances(address,address) view returns (uint256)",
    "function usdt() view returns (address)",
    "function fta() view returns (address)",
    "function userProfiles(address) view returns (uint256,uint256,uint256,bool,bool,uint256)",
    "function referrals(address) view returns (address,uint256,uint256)",
    "function positionCount() view returns (uint256)",
    "function positions(uint256) view returns (address,uint8,uint8,uint256,uint256,uint256,bool)",
    "function depositToWallet(address,uint256)",
    "function withdrawFromWallet(address,uint256)",
    "function openPositionWithLimits(uint8,uint8,uint256,uint256,uint256,uint256)",
    "function closePosition(uint256)",
    "function buyMachine(uint256)",
    "function buyBattery(uint256,uint256)",
    "function claimMiningRewards(uint256)",
    "function playAviator(uint256,uint256)",
    "function buyFTA(uint256)",
    "function sellFTA(uint256)"
];
const ERC20_ABI = ["function approve(address,uint256) returns (bool)"];

// State
let provider, signer, contract, userAddress;
let usdtAddress, ftaAddress;
let chartInstance;
let currentTradeSide = 0;
let chartIntervalId = null; // Pour gérer l'arrêt du graphique

// =================================================================================
// TOAST SYSTEM
// =================================================================================
function showToast(message, type = 'info') {
    const c = document.getElementById('toast-container');
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerText = message;
    c.appendChild(t);
    setTimeout(() => t.classList.add('show'), 10);
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 3000);
}

// =================================================================================
// INIT
// =================================================================================
document.addEventListener('DOMContentLoaded', () => {
    initChart();
    if (window.ethereum) {
        window.ethereum.on('accountsChanged', () => window.location.reload());
        window.ethereum.on('chainChanged', () => window.location.reload());
        checkConnection();
    }
});

// =================================================================================
// WALLET
// =================================================================================
async function connectWallet() {
    if (!window.ethereum) return showToast("Installez Trust Wallet", "error");
    try {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        const network = await provider.getNetwork();
        
        if (network.chainId !== POLYGON_CHAIN_ID) {
            showToast("Réseau incorrect. Switch vers Polygon...", "info");
            await switchNetwork();
            return;
        }

        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        userAddress = await signer.getAddress();
        contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        
        // Get Addresses ONCE
        usdtAddress = await contract.usdt();
        ftaAddress = await contract.fta();

        // UI Update
        const btn = document.getElementById('walletAddress');
        btn.innerHTML = `<i class="fa-solid fa-check"></i> ${userAddress.substring(0,6)}...`;
        btn.classList.add('connected');
        
        loadUserData();
        startChartUpdates(); // Start live updates
        showToast("Connecté avec succès", "success");

    } catch (e) {
        console.error(e);
        showToast("Erreur: " + (e.reason || "Connexion refusée"), "error");
    }
}

async function switchNetwork() {
    try {
        await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x89' }] });
    } catch (e) {
        if (e.code === 4902) {
            await window.ethereum.request({ method: 'wallet_addEthereumChain', params: [{ chainId: '0x89', chainName: 'Polygon', nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 }, rpcUrls: ["https://polygon-rpc.com"] }] });
        }
    }
}

async function checkConnection() {
    if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) connectWallet();
    }
}

// =================================================================================
// NAVIGATION & LOGIC CONTROL
// =================================================================================
window.showTab = (tabId) => {
    // Stop chart if leaving dashboard
    if (tabId !== 'tab-dashboard') stopChartUpdates();
    
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    
    const map = { 'tab-dashboard': 0, 'tab-trade': 1, 'tab-mining': 2, 'tab-game': 3, 'tab-wallet': 4 };
    if (map[tabId] !== undefined) document.querySelectorAll('.nav-item')[map[tabId]].classList.add('active');
    
    // Reload data for tab
    if(tabId === 'tab-dashboard') { loadUserData(); startChartUpdates(); }
    if(tabId === 'tab-trade') loadPositions();
    
    window.scrollTo(0,0);
};

window.setTradeSide = (side) => {
    currentTradeSide = side;
    document.querySelectorAll('.t-tab').forEach(el => el.classList.remove('active'));
    event.target.classList.add('active');
};

// =================================================================================
// DATA LOADING (Safe)
// =================================================================================
async function loadUserData() {
    if(!contract) return;
    try {
        const [usdtBal, ftaBal, profile, ref] = await Promise.all([
            contract.internalBalances(userAddress, usdtAddress),
            contract.internalBalances(userAddress, ftaAddress),
            contract.userProfiles(userAddress),
            contract.referrals(userAddress)
        ]);
        
        document.getElementById('userUsdtBalance').innerText = parseFloat(ethers.utils.formatUnits(usdtBal, 6)).toFixed(2);
        document.getElementById('userFtaBalance').innerText = parseFloat(ethers.utils.formatUnits(ftaBal, 8)).toFixed(2);
        document.getElementById('headerBalance').innerText = parseFloat(ethers.utils.formatUnits(usdtBal, 6)).toFixed(2);
        document.getElementById('userLevel').innerText = profile[0].toString();
        document.getElementById('refCount').innerText = ref[2].toString();
    } catch(e) { console.error("Load Data Error", e); }
}

// =================================================================================
// TRADING
// =================================================================================
window.executeTrade = async () => {
    const margin = document.getElementById('tradeMargin').value;
    const lev = document.getElementById('tradeLeverage').value;
    const asset = document.getElementById('tradeAsset').value;
    const sl = document.getElementById('tradeSL').value || 0;
    const tp = document.getElementById('tradeTP').value || 0;

    if(!margin || margin <= 0) return showToast("Marge invalide", "error");
    
    const btn = document.getElementById('btnOpenPosition');
    btn.disabled = true; btn.innerText = "Envoi...";

    try {
        const tx = await contract.openPositionWithLimits(
            asset, currentTradeSide, 
            ethers.utils.parseUnits(margin, 6), 
            lev, 
            sl, tp
        );
        showToast("Transaction envoyée", "info");
        await tx.wait();
        showToast("Position ouverte !", "success");
    } catch(e) {
        showToast(e.reason || "Erreur", "error");
    }
    btn.disabled = false; btn.innerText = "Ouvrir Position";
};

async function loadPositions() {
    const list = document.getElementById('positionsList');
    list.innerHTML = '<div class="empty-state">Chargement...</div>';
    try {
        const count = await contract.positionCount();
        if(count == 0) { list.innerHTML = '<div class="empty-state">Aucune position</div>'; return; }
        let html = '';
        // Check last 5 only
        for(let i = Number(count); i > Math.max(0, Number(count) - 5); i--) {
            const p = await contract.positions(i);
            if(p[0].toLowerCase() === userAddress.toLowerCase() && p[6]) { // isOpen
                const type = p[2] == 0 ? "LONG" : "SHORT";
                const cls = p[2] == 0 ? "" : "short";
                const m = parseFloat(ethers.utils.formatUnits(p[3], 6)).toFixed(2);
                html += `<div class="position-item ${cls}">
                    <div class="pos-header"><strong>#${i} ${type}</strong><button class="btn-sm" onclick="closePos(${i})">X</button></div>
                    <div class="pos-details"><span>Marge: ${m}</span><span>Lev: ${p[4]}x</span></div>
                </div>`;
            }
        }
        list.innerHTML = html || '<div class="empty-state">Aucune position</div>';
    } catch(e) { list.innerHTML = '<div class="empty-state">Erreur</div>'; }
}
window.closePos = async (id) => {
    try { await contract.closePosition(id); await tx.wait(); showToast("Fermée", "success"); loadPositions(); } 
    catch(e) { showToast(e.reason, "error"); }
};

// =================================================================================
// MINING
// =================================================================================
window.buyMachine = async (id) => { try { await contract.buyMachine(id); showToast("Acheté !", "success"); } catch(e) { showToast(e.reason, "error"); } };
window.buyBatteryUI = async () => {
    const id = document.getElementById('miningTokenId').value;
    if(!id) return showToast("ID requis", "error");
    try { await contract.buyBattery(id, 0); showToast("Chargé !", "success"); } catch(e) { showToast(e.reason, "error"); }
};
window.claimRewards = async () => {
    const id = document.getElementById('miningTokenId').value;
    if(!id) return showToast("ID requis", "error");
    try { const tx = await contract.claimMiningRewards(id); await tx.wait(); showToast("Récolté !", "success"); loadUserData(); } catch(e) { showToast(e.reason, "error"); }
};

// =================================================================================
// AVIATOR
// =================================================================================
window.playAviator = async () => {
    const bet = document.getElementById('gameBet').value;
    const target = document.getElementById('gameTarget').value;
    if(!bet) return showToast("Mise invalide", "error");

    const btn = document.getElementById('btnPlayAviator');
    btn.disabled = true;
    let mult = 1.00;
    const display = document.getElementById('gameMultiplier');
    
    // Animation locale
    const anim = setInterval(() => { mult += 0.1; display.innerText = mult.toFixed(2) + "x"; }, 100);

    try {
        const tx = await contract.playAviator(ethers.utils.parseUnits(bet, 8), Math.floor(target*100));
        await tx.wait();
        clearInterval(anim);
        display.innerText = "GAGNÉ !";
        display.style.color = "var(--success)";
        showToast("Gagné !", "success");
    } catch(e) {
        clearInterval(anim);
        display.innerText = "CRASH";
        display.classList.add('crashed');
        showToast("Perdu...", "error");
    }
    setTimeout(() => { display.innerText = "1.00x"; display.style.color="white"; display.classList.remove('crashed'); }, 2000);
    btn.disabled = false;
};

// =================================================================================
// WALLET ACTIONS
// =================================================================================
window.depositToHub = async () => {
    const amount = document.getElementById('depAmount').value;
    if(!amount) return;
    try {
        // Approve
        const tk = new ethers.Contract(usdtAddress, ERC20_ABI, signer);
        await (await tk.approve(CONTRACT_ADDRESS, ethers.utils.parseUnits(amount, 6))).wait();
        // Deposit
        await (await contract.depositToWallet(usdtAddress, ethers.utils.parseUnits(amount, 6))).wait();
        showToast("Dépôt OK", "success");
        loadUserData();
    } catch(e) { showToast(e.reason, "error"); }
};
window.withdrawFromHub = async () => {
    const amount = document.getElementById('witAmount').value;
    if(!amount) return;
    try {
        await (await contract.withdrawFromWallet(usdtAddress, ethers.utils.parseUnits(amount, 6))).wait();
        showToast("Retrait OK", "success");
        loadUserData();
    } catch(e) { showToast(e.reason, "error"); }
};
window.buyFTA = async () => {
    const amount = document.getElementById('swapAmountIn').value;
    if(!amount) return;
    try { await (await contract.buyFTA(ethers.utils.parseUnits(amount, 6))).wait(); showToast("Achat OK", "success"); loadUserData(); } 
    catch(e) { showToast(e.reason, "error"); }
};
window.sellFTAUI = async () => {
    const amount = prompt("Montant FTA ?");
    if(!amount) return;
    try { await (await contract.sellFTA(ethers.utils.parseUnits(amount, 8))).wait(); showToast("Vente OK", "success"); loadUserData(); } 
    catch(e) { showToast(e.reason, "error"); }
};

// =================================================================================
// CHART SYSTEM (Bulletproof)
// =================================================================================
function initChart() {
    const ctx = document.getElementById('marketChart');
    if(!ctx) return;
    chartInstance = new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            labels: Array(20).fill(""),
            datasets: [{ data: Array(20).fill(1.25), borderColor: '#fcd535', borderWidth: 2, fill: false, tension: 0.4, pointRadius: 0 }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } } }
    });
}

function startChartUpdates() {
    if(chartIntervalId) clearInterval(chartIntervalId);
    chartIntervalId = setInterval(async () => {
        if(!contract) return;
        try {
            const priceRaw = await contract.getAssetPrice(2); // FTA
            const price = parseFloat(ethers.utils.formatUnits(priceRaw, 8));
            
            document.getElementById('ftaPrice').innerText = `$${price.toFixed(4)}`;
            
            // Update Chart Data
            chartInstance.data.datasets[0].data.shift();
            chartInstance.data.datasets[0].data.push(price);
            chartInstance.update('none'); // 'none' for performance
        } catch(e) { console.log("Chart update skipped"); }
    }, 3000); // Refresh every 3 seconds
}

function stopChartUpdates() {
    if(chartIntervalId) clearInterval(chartIntervalId);
    chartIntervalId = null;
}