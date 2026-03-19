// =================================================================================
// CONFIGURATION
// =================================================================================
const CONTRACT_ADDRESS = "0xAfdFb346F819ffF3DdEF77e23E25a34E19c7Cab2"; 
const FTA_TOKEN_ADDRESS = "0x535bBe393D64a60E14B731b7350675792d501623"; 

// POLYGON MAINNET CONFIG
const POLYGON_CHAIN_ID = 137;
const POLYGON_CHAIN_ID_HEX = "0x89";
const POLYGON_RPC = "https://polygon-rpc.com";

// DECIMALS
const USDT_DECIMALS = 6;
const FTA_DECIMALS = 8;

// ABI (Fonctions Utilisateurs)
const CONTRACT_ABI = [
    "function getAssetPrice(uint8 _asset) external view returns (uint256)",
    "function internalBalances(address,address) external view returns (uint256)",
    "function usdt() external view returns (address)",
    "function fta() external view returns (address)",
    "function userProfiles(address) external view returns (uint256 level, uint256 xp, uint256 totalVolumeTraded, bool isEarlyAdopter, bool isTopTrader, uint256 feeDiscount)",
    "function referrals(address) external view returns (address referrer, uint256 totalEarnings, uint256 referralCount)",
    "function positionCount() external view returns (uint256)",
    "function positions(uint256) external view returns (address trader, uint8 asset, uint8 side, uint256 margin, uint256 leverage, uint256 entryPrice, bool isOpen)",
    "function balanceOf(address owner) external view returns (uint256)",
    "function userLoans(address) external view returns (uint256 collateralAmount, uint256 borrowedAmount, uint256 startTime, bool isActive)",
    "function depositToWallet(address _token, uint256 _amount) external",
    "function withdrawFromWallet(address _token, uint256 _amount) external",
    "function openPositionWithLimits(uint8 _asset, uint8 _side, uint256 _marginUSDT, uint256 _leverage, uint256 _stopLossPrice, uint256 _takeProfitPrice) external",
    "function closePosition(uint256 _posId) external",
    "function claimMiningRewards(uint256 _tokenId) external",
    "function buyMachine(uint256 _typeId) external",
    "function buyBattery(uint256 _tokenId, uint256 _packId) external",
    "function playAviator(uint256 _ftaBetAmount, uint256 _targetMultiplier) external",
    "function depositCollateral(uint256 _usdtAmount) external",
    "function borrow(uint256 _ftaAmount) external",
    "function repayLoan() external",
    "function stake(uint256 _poolId, uint256 _amount) external",
    "function unstake(uint256 _poolId) external",
    "function buyFTA(uint256 _usdtAmount) external",
    "function sellFTA(uint256 _ftaAmount) external",
    "function registerReferrer(address _referrer) external"
];
const ERC20_ABI = ["function approve(address spender, uint256 amount) external returns (bool)"];

let provider, signer, contract, userAddress;
let usdtTokenAddress, ftaTokenAddress;
let chartInstance;
let currentTradeSide = 0;
let gameInterval;

// =================================================================================
// TOAST SYSTEM (Messages Pro)
// =================================================================================
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerText = message;
    container.appendChild(toast);
    // Force reflow
    void toast.offsetWidth;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// =================================================================================
// INIT & WALLET
// =================================================================================
document.addEventListener('DOMContentLoaded', () => {
    initChart();
    checkConnection();
});

async function connectWallet() {
    if (!window.ethereum) return showToast("Installez MetaMask ou Trust Wallet", "error");
    try {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        const network = await provider.getNetwork();
        
        if (network.chainId !== POLYGON_CHAIN_ID) {
            showToast("Veuillez basculer sur le réseau Polygon", "info");
            await switchToPolygon();
            return;
        }

        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        userAddress = await signer.getAddress();
        contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        
        // Get Token Addresses automatically
        usdtTokenAddress = await contract.usdt();
        ftaTokenAddress = await contract.fta();

        const shortAddr = `${userAddress.substring(0,6)}...${userAddress.substring(38)}`;
        const btn = document.getElementById('walletAddress');
        btn.innerHTML = `<i class="fa-solid fa-check"></i> ${shortAddr}`;
        btn.classList.add('connected');
        document.getElementById('myRefCode').innerText = shortAddr;
        
        loadUserData();
        startChartUpdates();
        showToast("Connecté avec succès", "success");
    } catch (error) {
        console.error(error);
        showToast("Erreur: " + (error.reason || "Connexion refusée"), "error");
    }
}

async function switchToPolygon() {
    try {
        await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x89' }] });
        // Listen for chain change event instead of reload to avoid popup blockers
        window.ethereum.on('chainChanged', () => window.location.reload());
    } catch (switchError) {
        if (switchError.code === 4902) {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{ chainId: '0x89', chainName: 'Polygon', nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 }, rpcUrls: ["https://polygon-rpc.com"] }],
                });
            } catch (e) { showToast("Impossible d'ajouter Polygon", "error"); }
        }
    }
}

function checkConnection() {
    if (window.ethereum) {
        window.ethereum.request({ method: 'eth_accounts' }).then(accounts => {
            if (accounts.length > 0) connectWallet();
        });
        window.ethereum.on('accountsChanged', () => window.location.reload());
    }
}

// =================================================================================
// NAVIGATION
// =================================================================================
window.showTab = (tabId) => {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    const map = { 'tab-dashboard': 0, 'tab-trade': 1, 'tab-mining': 2, 'tab-game': 3, 'tab-wallet': 4 };
    if (map[tabId] !== undefined) document.querySelectorAll('.nav-item')[map[tabId]].classList.add('active');
    window.scrollTo(0,0);
};
window.setTradeSide = (side) => {
    currentTradeSide = side;
    document.querySelectorAll('.t-tab').forEach(el => el.classList.remove('active'));
    event.target.classList.add('active');
};

// =================================================================================
// DATA LOADING
// =================================================================================
async function loadUserData() {
    if(!contract) return;
    try {
        const usdtBalRaw = await contract.internalBalances(userAddress, usdtTokenAddress);
        const ftaBalRaw = await contract.internalBalances(userAddress, ftaTokenAddress);
        
        document.getElementById('userUsdtBalance').innerText = parseFloat(ethers.utils.formatUnits(usdtBalRaw, 6)).toFixed(2);
        document.getElementById('userFtaBalance').innerText = parseFloat(ethers.utils.formatUnits(ftaBalRaw, 8)).toFixed(2);
        document.getElementById('headerBalance').innerText = parseFloat(ethers.utils.formatUnits(usdtBalRaw, 6)).toFixed(2) + " USDT";

        const profile = await contract.userProfiles(userAddress);
        document.getElementById('userLevel').innerText = profile.level.toString();
        const refData = await contract.referrals(userAddress);
        document.getElementById('refCount').innerText = refData.referralCount.toString();
    } catch (e) { console.error(e); }
}

// =================================================================================
// TRADING
// =================================================================================
window.updateTradeUI = async () => {
    const assetId = document.getElementById('tradeAsset').value;
    const price = await contract.getAssetPrice(assetId);
    // Could update a mini price display here
};

window.executeTrade = async () => {
    const margin = document.getElementById('tradeMargin').value;
    const leverage = document.getElementById('tradeLeverage').value;
    const assetId = document.getElementById('tradeAsset').value; // Read from select
    const sl = document.getElementById('tradeSL').value || 0;
    const tp = document.getElementById('tradeTP').value || 0;

    if(!margin || margin <= 0) return showToast("Marge invalide", "error");

    const btn = document.getElementById('btnOpenPosition');
    btn.disabled = true;
    btn.innerText = "Confirmation...";

    try {
        const marginWei = ethers.utils.parseUnits(margin, 6);
        const slWei = sl > 0 ? ethers.utils.parseUnits(sl.toString(), 8) : 0;
        const tpWei = tp > 0 ? ethers.utils.parseUnits(tp.toString(), 8) : 0;

        const tx = await contract.openPositionWithLimits(assetId, currentTradeSide, marginWei, leverage, slWei, tpWei);
        await tx.wait();
        
        showToast("Position ouverte !", "success");
        btn.disabled = false;
        btn.innerText = "Ouvrir Position";
        loadPositions();
    } catch (e) {
        let msg = e.reason || e.message;
        if(msg.includes("insufficient funds")) msg = "Fonds insuffisants (USDT)";
        showToast(msg, "error");
        btn.disabled = false;
        btn.innerText = "Ouvrir Position";
    }
};

async function loadPositions() {
    const list = document.getElementById('positionsList');
    list.innerHTML = '';
    try {
        const count = await contract.positionCount();
        if(count == 0) { list.innerHTML = '<div class="empty-state">Aucune position</div>'; return; }
        let html = '';
        const start = count > 5 ? count - 5 : 1;
        for(let i = count; i >= start; i--) {
            const pos = await contract.positions(i);
            if(pos.isOpen && pos.trader.toLowerCase() === userAddress.toLowerCase()) {
                const type = pos.side == 0 ? "LONG" : "SHORT";
                const cssClass = pos.side == 0 ? "" : "short";
                const margin = parseFloat(ethers.utils.formatUnits(pos.margin, 6)).toFixed(2);
                html += `<div class="position-item ${cssClass}">
                    <div class="pos-header"><strong>#${i} - ${type}</strong><button class="btn-sm" onclick="closePos(${i})">X</button></div>
                    <div class="pos-details"><span>Marge: ${margin}</span><span>Lev: ${pos.leverage}x</span></div>
                </div>`;
            }
        }
        list.innerHTML = html || '<div class="empty-state">Aucune position</div>';
    } catch (e) { list.innerHTML = '<div class="empty-state">Erreur</div>'; }
}
window.closePos = async (id) => {
    try {
        const tx = await contract.closePosition(id);
        await tx.wait();
        showToast("Position fermée", "success");
        loadPositions(); loadUserData();
    } catch(e) { showToast(e.reason, "error"); }
};

// =================================================================================
// MINING
// =================================================================================
window.buyMachine = async (typeId) => {
    try { const tx = await contract.buyMachine(typeId); await tx.wait(); showToast("Machine achetée !", "success"); } 
    catch(e) { showToast(e.reason, "error"); }
};
window.buyBatteryUI = async () => {
    const tokenId = document.getElementById('miningTokenId').value;
    if(!tokenId) return showToast("Entrez l'ID", "error");
    try { const tx = await contract.buyBattery(tokenId, 0); await tx.wait(); showToast("Batterie chargée !", "success"); } 
    catch(e) { showToast(e.reason, "error"); }
};
window.claimRewards = async () => {
    const tokenId = document.getElementById('miningTokenId').value;
    if(!tokenId) return showToast("Entrez l'ID", "error");
    try { const tx = await contract.claimMiningRewards(tokenId); await tx.wait(); showToast("Récompenses récoltées !", "success"); loadUserData(); } 
    catch(e) { showToast(e.reason, "error"); }
};

// =================================================================================
// GAME
// =================================================================================
window.playAviator = async () => {
    const bet = document.getElementById('gameBet').value;
    const target = document.getElementById('gameTarget').value;
    if(!bet) return showToast("Mise invalide", "error");
    
    const btn = document.getElementById('btnPlayAviator');
    btn.disabled = true;
    startGameAnimation();

    try {
        const betWei = ethers.utils.parseUnits(bet, 8);
        const targetRaw = Math.floor(parseFloat(target) * 100);
        const tx = await contract.playAviator(betWei, targetRaw);
        await tx.wait();
        stopGameAnimation(true);
    } catch(e) {
        stopGameAnimation(false);
        showToast(e.reason, "error");
    }
};
function startGameAnimation() {
    const display = document.getElementById('gameMultiplier');
    let mult = 1.00;
    gameInterval = setInterval(() => { mult += 0.05; display.innerText = mult.toFixed(2) + "x"; }, 100);
}
function stopGameAnimation(won) {
    clearInterval(gameInterval);
    const btn = document.getElementById('btnPlayAviator');
    const display = document.getElementById('gameMultiplier');
    const resultDiv = document.getElementById('gameResult');
    btn.disabled = false; btn.innerText = "PARIER";
    
    if (won) { resultDiv.innerText = "GAGNÉ !"; resultDiv.style.color = "var(--success)"; loadUserData(); }
    else { display.innerText = "CRASH"; display.classList.add('crashed'); resultDiv.innerText = "PERDU"; resultDiv.style.color = "var(--danger)"; }
    
    setTimeout(() => { display.classList.remove('crashed'); display.innerText = "1.00x"; resultDiv.innerText = ""; }, 3000);
}

// =================================================================================
// FINANCE & WALLET
// =================================================================================
window.depositToHub = async () => {
    const amount = document.getElementById('depAmount').value;
    if(!amount) return;
    try {
        // Approve
        const tk = new ethers.Contract(usdtTokenAddress, ERC20_ABI, signer);
        let appTx = await tk.approve(CONTRACT_ADDRESS, ethers.utils.parseUnits(amount, 6));
        await appTx.wait();
        // Deposit
        const tx = await contract.depositToWallet(usdtTokenAddress, ethers.utils.parseUnits(amount, 6));
        await tx.wait();
        showToast("Dépôt réussi", "success");
        loadUserData();
    } catch(e) { showToast(e.reason, "error"); }
};
window.withdrawFromHub = async () => {
    const amount = document.getElementById('witAmount').value;
    if(!amount) return;
    try {
        const tx = await contract.withdrawFromWallet(usdtTokenAddress, ethers.utils.parseUnits(amount, 6));
        await tx.wait();
        showToast("Retrait réussi", "success");
        loadUserData();
    } catch(e) { showToast(e.reason, "error"); }
};

window.buyFTA = async () => {
    const amount = document.getElementById('swapAmountIn').value;
    if(!amount) return;
    try {
        const tx = await contract.buyFTA(ethers.utils.parseUnits(amount, 6));
        await tx.wait();
        showToast("Achat effectué", "success");
        loadUserData();
    } catch(e) { showToast(e.reason, "error"); }
};
window.sellFTAUI = async () => {
    const amount = prompt("Montant FTA à vendre :");
    if(!amount) return;
    try {
        const tx = await contract.sellFTA(ethers.utils.parseUnits(amount, 8));
        await tx.wait();
        showToast("Vente effectuée", "success");
        loadUserData();
    } catch(e) { showToast(e.reason, "error"); }
};

window.depositCollateral = async () => {
    const amount = document.getElementById('loanCollateral').value;
    if(!amount) return;
    try {
        const tk = new ethers.Contract(usdtTokenAddress, ERC20_ABI, signer);
        await (await tk.approve(CONTRACT_ADDRESS, ethers.utils.parseUnits(amount, 6))).wait();
        const tx = await contract.depositCollateral(ethers.utils.parseUnits(amount, 6));
        await tx.wait();
        showToast("Collatéral déposé", "success");
    } catch(e) { showToast(e.reason, "error"); }
};
window.borrowFTA = async () => {
    const amount = document.getElementById('loanBorrow').value;
    if(!amount) return;
    try {
        const tx = await contract.borrow(ethers.utils.parseUnits(amount, 8));
        await tx.wait();
        showToast("Emprunt validé", "success");
        loadUserData();
    } catch(e) { showToast(e.reason, "error"); }
};
window.repayLoan = async () => {
    try { const tx = await contract.repayLoan(); await tx.wait(); showToast("Prêt remboursé", "success"); loadUserData(); } 
    catch(e) { showToast(e.reason, "error"); }
};
window.stakeTokens = async () => {
    const amount = document.getElementById('stakeAmount').value;
    if(!amount) return;
    try { const tx = await contract.stake(0, ethers.utils.parseUnits(amount, 8)); await tx.wait(); showToast("Staké", "success"); }
    catch(e) { showToast(e.reason, "error"); }
};
window.unstakeTokens = async () => {
    try { const tx = await contract.unstake(0); await tx.wait(); showToast("Unstaké", "success"); loadUserData(); } 
    catch(e) { showToast(e.reason, "error"); }
};
window.registerReferrer = async () => {
    const addr = document.getElementById('referrerAddr').value;
    if(!addr) return;
    try { const tx = await contract.registerReferrer(addr); await tx.wait(); showToast("Parrain enregistré", "success"); } 
    catch(e) { showToast(e.reason, "error"); }
};

// =================================================================================
// CHART SYSTEM
// =================================================================================
function initChart() {
    const ctx = document.getElementById('marketChart').getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(252, 213, 53, 0.5)');
    gradient.addColorStop(1, 'rgba(252, 213, 53, 0.0)');

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array(20).fill(""),
            datasets: [{
                data: [1.25, 1.25, 1.24, 1.26, 1.25, 1.27, 1.26, 1.28, 1.27, 1.29, 1.28, 1.30, 1.29, 1.31, 1.30, 1.32, 1.31, 1.33, 1.32, 1.34],
                borderColor: '#fcd535',
                backgroundColor: gradient,
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 0
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } } }
    });
}

function startChartUpdates() {
    setInterval(async () => {
        if(!contract) return;
        try {
            const priceRaw = await contract.getAssetPrice(2); // FTA
            const price = parseFloat(ethers.utils.formatUnits(priceRaw, 8));
            
            document.getElementById('ftaPrice').innerText = `$${price.toFixed(4)}`;
            
            // Update Chart
            const data = chartInstance.data.datasets[0].data;
            data.shift();
            data.push(price);
            chartInstance.update();
        } catch(e) {}
    }, 2000);
}