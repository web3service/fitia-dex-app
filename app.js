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
    // Views
    "function getAssetPrice(uint8 _asset) external view returns (uint256)",
    "function internalBalances(address,address) external view returns (uint256)",
    "function usdt() external view returns (address)",
    "function fta() external view returns (address)",
    "function userProfiles(address) external view returns (uint256 level, uint256 xp, uint256 totalVolumeTraded, bool isEarlyAdopter, bool isTopTrader, uint256 feeDiscount)",
    "function referrals(address) external view returns (address referrer, uint256 totalEarnings, uint256 referralCount)",
    "function positionCount() external view returns (uint256)",
    "function positions(uint256) external view returns (address trader, uint8 asset, uint8 side, uint256 margin, uint256 leverage, uint256 entryPrice, bool isOpen)",
    "function userMachines(uint256) external view returns (uint256 typeId, uint256 batteryEndTime, uint256 lastClaimTime)",
    "function balanceOf(address owner) external view returns (uint256)",
    "function userLoans(address) external view returns (uint256 collateralAmount, uint256 borrowedAmount, uint256 startTime, bool isActive)",
    
    // Wallet
    "function depositToWallet(address _token, uint256 _amount) external",
    "function withdrawFromWallet(address _token, uint256 _amount) external",
    
    // Trading
    "function openPositionWithLimits(uint8 _asset, uint8 _side, uint256 _marginUSDT, uint256 _leverage, uint256 _stopLossPrice, uint256 _takeProfitPrice) external",
    "function closePosition(uint256 _posId) external",
    "function liquidatePosition(uint256 _posId) external",
    
    // Mining
    "function claimMiningRewards(uint256 _tokenId) external",
    "function buyMachine(uint256 _typeId) external",
    "function buyBattery(uint256 _tokenId, uint256 _packId) external",
    
    // Game
    "function playAviator(uint256 _ftaBetAmount, uint256 _targetMultiplier) external",
    
    // Finance
    "function depositCollateral(uint256 _usdtAmount) external",
    "function borrow(uint256 _ftaAmount) external",
    "function repayLoan() external",
    "function stake(uint256 _poolId, uint256 _amount) external",
    "function unstake(uint256 _poolId) external",
    
    // Swap
    "function buyFTA(uint256 _usdtAmount) external",
    "function sellFTA(uint256 _ftaAmount) external",
    
    // Ref
    "function registerReferrer(address _referrer) external"
];

// Minimal ERC20 ABI for Approve
const ERC20_ABI = [
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function allowance(address owner, address spender) external view returns (uint256)"
];

// Global Vars
let provider, signer, contract, userAddress;
let usdtTokenAddress, ftaTokenAddress;
let chartInstance = null;
let currentTradeSide = 0; 
let gameInterval = null;

// =================================================================================
// INITIALISATION
// =================================================================================
document.addEventListener('DOMContentLoaded', () => {
    initChart();
    checkConnection();
    setInterval(updatePriceDisplay, 10000);
});

// =================================================================================
// WALLET & NETWORK
// =================================================================================
async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            provider = new ethers.providers.Web3Provider(window.ethereum);
            const network = await provider.getNetwork();
            
            if (network.chainId !== POLYGON_CHAIN_ID) {
                await switchToPolygon();
                return;
            }

            await provider.send("eth_requestAccounts", []);
            signer = provider.getSigner();
            userAddress = await signer.getAddress();
            
            contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
            
            // Get Token Addresses
            usdtTokenAddress = await contract.usdt();
            ftaTokenAddress = await contract.fta();
            
            // UI Updates
            const shortAddr = `${userAddress.substring(0,6)}...${userAddress.substring(38)}`;
            const btn = document.getElementById('walletAddress');
            btn.innerHTML = `<i class="fa-solid fa-check"></i> ${shortAddr}`;
            btn.classList.add('connected');
            btn.onclick = null;
            
            document.getElementById('myRefCode').innerText = shortAddr;
            
            loadUserData();
            loadPositions();
            
            alert("✅ Connecté au réseau Polygon !");
        } catch (error) {
            console.error(error);
            alert("❌ Erreur de connexion : " + (error.reason || error.message));
        }
    } else {
        alert("⚠️ Veuillez installer MetaMask ou Trust Wallet !");
    }
}

async function switchToPolygon() {
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: POLYGON_CHAIN_ID_HEX }],
        });
        connectWallet(); // Reconnect after switch
    } catch (switchError) {
        if (switchError.code === 4902) {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: POLYGON_CHAIN_ID_HEX,
                        chainName: 'Polygon Mainnet',
                        nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
                        rpcUrls: [POLYGON_RPC],
                        blockExplorerUrls: ['https://polygonscan.com/'],
                    }],
                });
                connectWallet();
            } catch (addError) {
                alert("❌ Impossible d'ajouter le réseau Polygon.");
            }
        }
    }
}

async function checkConnection() {
    if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
            const network = await window.ethereum.request({ method: 'eth_chainId' });
            if (parseInt(network, 16) === POLYGON_CHAIN_ID) {
                connectWallet();
            } else {
                document.getElementById('walletAddress').innerText = "Switch Polygon";
                document.getElementById('walletAddress').onclick = switchToPolygon;
            }
        }
    }
}

// =================================================================================
// NAVIGATION & UI
// =================================================================================
window.showTab = (tabId) => {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    
    const navMap = { 'tab-dashboard': 0, 'tab-trade': 1, 'tab-mining': 2, 'tab-game': 3, 'tab-wallet': 4 };
    if (navMap[tabId] !== undefined) {
        document.querySelectorAll('.nav-item')[navMap[tabId]].classList.add('active');
    }
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
    if(!contract || !userAddress) return;
    try {
        const usdtBalRaw = await contract.internalBalances(userAddress, usdtTokenAddress);
        const ftaBalRaw = await contract.internalBalances(userAddress, ftaTokenAddress);
        
        document.getElementById('userUsdtBalance').innerText = parseFloat(ethers.utils.formatUnits(usdtBalRaw, USDT_DECIMALS)).toFixed(2);
        document.getElementById('userFtaBalance').innerText = parseFloat(ethers.utils.formatUnits(ftaBalRaw, FTA_DECIMALS)).toFixed(2);
        document.getElementById('headerBalance').innerText = parseFloat(ethers.utils.formatUnits(usdtBalRaw, USDT_DECIMALS)).toFixed(2) + " USDT";

        const profile = await contract.userProfiles(userAddress);
        document.getElementById('userLevel').innerText = profile.level.toString();
        
        const refData = await contract.referrals(userAddress);
        document.getElementById('refCount').innerText = refData.referralCount.toString();

        updatePriceDisplay();
    } catch (e) { console.error("Erreur chargement données", e); }
}

async function updatePriceDisplay() {
    try {
        const priceRaw = await contract.getAssetPrice(2); // FTA
        const price = ethers.utils.formatUnits(priceRaw, 8);
        const el = document.getElementById('ftaPrice');
        el.innerText = `$${parseFloat(price).toFixed(4)}`;
        el.style.color = '#00c087';
        setTimeout(() => el.style.color = '#fcd535', 500);
        return parseFloat(price);
    } catch (e) { console.error("Erreur Prix", e); return 1.25; }
}

// =================================================================================
// WALLET ACTIONS (Deposit/Withdraw)
// =================================================================================
// Helper for Approve
async function approveToken(tokenAddress, amount, decimals) {
    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
    const tx = await tokenContract.approve(CONTRACT_ADDRESS, ethers.utils.parseUnits(amount, decimals));
    await tx.wait();
}

window.depositToHub = async () => {
    const amount = document.getElementById('depAmount').value;
    if(!amount || amount <= 0) return alert("Montant invalide");
    
    try {
        // 1. Approve USDT
        await approveToken(usdtTokenAddress, amount, USDT_DECIMALS);
        // 2. Deposit
        const tx = await contract.depositToWallet(usdtTokenAddress, ethers.utils.parseUnits(amount, USDT_DECIMALS));
        await tx.wait();
        alert("✅ Dépôt réussi !");
        loadUserData();
    } catch(e) { alert("❌ Erreur: " + (e.reason || e.message)); }
};

window.withdrawFromHub = async () => {
    const amount = document.getElementById('witAmount').value;
    if(!amount || amount <= 0) return alert("Montant invalide");
    try {
        const tx = await contract.withdrawFromWallet(usdtTokenAddress, ethers.utils.parseUnits(amount, USDT_DECIMALS));
        await tx.wait();
        alert("✅ Retrait réussi !");
        loadUserData();
    } catch(e) { alert("❌ Erreur: " + (e.reason || e.message)); }
};

// =================================================================================
// TRADING
// =================================================================================
window.executeTrade = async () => {
    const margin = document.getElementById('tradeMargin').value;
    const leverage = document.getElementById('tradeLeverage').value;
    const sl = document.getElementById('tradeSL').value || 0;
    const tp = document.getElementById('tradeTP').value || 0;

    if(!margin || margin <= 0) return alert("⚠️ Marge invalide.");

    const btn = document.getElementById('btnOpenPosition');
    btn.disabled = true;
    btn.innerText = "Confirmation...";

    try {
        const marginWei = ethers.utils.parseUnits(margin, USDT_DECIMALS);
        const slWei = sl > 0 ? ethers.utils.parseUnits(sl.toString(), 8) : 0;
        const tpWei = tp > 0 ? ethers.utils.parseUnits(tp.toString(), 8) : 0;

        const tx = await contract.openPositionWithLimits(2, currentTradeSide, marginWei, leverage, slWei, tpWei);
        await tx.wait();
        
        alert("✅ Position ouverte !");
        btn.disabled = false;
        btn.innerText = "Ouvrir Position";
        loadPositions();
    } catch (e) {
        alert("❌ Erreur: " + (e.reason || e.message));
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
        // Load last 5 positions
        const start = count > 5 ? count - 5 : 1;
        let found = false;

        for(let i = count; i >= start; i--) {
            const pos = await contract.positions(i);
            if(pos.isOpen && pos.trader.toLowerCase() === userAddress.toLowerCase()) {
                found = true;
                const type = pos.side == 0 ? "LONG 🟢" : "SHORT 🔴";
                const cssClass = pos.side == 0 ? "" : "short";
                const margin = parseFloat(ethers.utils.formatUnits(pos.margin, USDT_DECIMALS)).toFixed(2);
                const entry = parseFloat(ethers.utils.formatUnits(pos.entryPrice, 8)).toFixed(4);
                
                html += `
                <div class="position-item ${cssClass}">
                    <div class="pos-header">
                        <strong>#${i} - FTA ${type}</strong>
                        <button class="btn-sm" style="background:#ff4d4f; color:white; border:none;" onclick="closePos(${i})">Clôturer</button>
                    </div>
                    <div class="pos-details">
                        <span>Marge: ${margin} USDT</span>
                        <span>Lev: ${pos.leverage}x</span>
                        <span>Entry: $${entry}</span>
                    </div>
                </div>`;
            }
        }
        list.innerHTML = found ? html : '<div class="empty-state">Aucune position ouverte</div>';
    } catch (e) { list.innerHTML = '<div class="empty-state">Erreur chargement</div>'; }
}

window.closePos = async (id) => {
    if(!confirm("Clôturer ?")) return;
    try {
        const tx = await contract.closePosition(id);
        await tx.wait();
        alert("✅ Position clôturée !");
        loadPositions();
        loadUserData();
    } catch(e) { alert("❌ Erreur: " + (e.reason || e.message)); }
};

// =================================================================================
// MINING
// =================================================================================
window.buyMachine = async (typeId) => {
    try {
        const tx = await contract.buyMachine(typeId);
        await tx.wait();
        alert("✅ Machine achetée ! Allez sur Polygonscan pour voir votre NFT.");
    } catch(e) { alert("❌ Erreur: " + (e.reason || e.message)); }
};

window.buyBatteryUI = async () => {
    const tokenId = document.getElementById('miningTokenId').value;
    if(!tokenId) return alert("Entrez l'ID de la machine");
    try {
        const tx = await contract.buyBattery(tokenId, 0);
        await tx.wait();
        alert("✅ Batterie chargée !");
    } catch(e) { alert("❌ Erreur: " + (e.reason || e.message)); }
};

window.claimRewards = async () => {
    const tokenId = document.getElementById('miningTokenId').value;
    if(!tokenId) return alert("Entrez l'ID de la machine");
    try {
        const tx = await contract.claimMiningRewards(tokenId);
        await tx.wait();
        alert("✅ Récompenses récoltées !");
        loadUserData();
    } catch(e) { alert("❌ Erreur: " + (e.reason || e.message)); }
};

// =================================================================================
// GAME
// =================================================================================
window.playAviator = async () => {
    const bet = document.getElementById('gameBet').value;
    const target = document.getElementById('gameTarget').value;
    if(!bet || bet <= 0) return alert("Mise invalide");
    
    const btn = document.getElementById('btnPlayAviator');
    btn.disabled = true;
    btn.innerText = "EN VOL...";
    
    // Animation logic simplified for production safety
    startGameAnimation();

    try {
        const betWei = ethers.utils.parseUnits(bet, FTA_DECIMALS);
        const targetRaw = Math.floor(parseFloat(target) * 100); 
        
        const tx = await contract.playAviator(betWei, targetRaw);
        await tx.wait();
        
        stopGameAnimation(true);
    } catch(e) {
        stopGameAnimation(false);
        alert("❌ Erreur Jeu: " + (e.reason || e.message));
    }
};

function startGameAnimation() {
    const display = document.getElementById('gameMultiplier');
    const plane = document.getElementById('gamePlane');
    let mult = 1.00;
    plane.style.opacity = "1";
    plane.style.bottom = "20px";
    gameInterval = setInterval(() => {
        mult += 0.05;
        display.innerText = mult.toFixed(2) + "x";
    }, 100);
}

function stopGameAnimation(won) {
    clearInterval(gameInterval);
    const btn = document.getElementById('btnPlayAviator');
    const display = document.getElementById('gameMultiplier');
    const resultDiv = document.getElementById('gameResult');
    
    btn.disabled = false;
    btn.innerText = "PARIER";
    
    if (won) {
        resultDiv.innerText = "Gagné !";
        resultDiv.style.color = "var(--success)";
        loadUserData();
    } else {
        display.innerText = "CRASH";
        display.classList.add('crashed');
        resultDiv.innerText = "Perdu...";
        resultDiv.style.color = "var(--danger)";
    }
    
    setTimeout(() => {
        display.classList.remove('crashed');
        display.innerText = "1.00x";
    }, 3000);
}

// =================================================================================
// FINANCE
// =================================================================================
window.depositCollateral = async () => {
    const amount = document.getElementById('loanCollateral').value;
    if(!amount) return alert("Montant invalide");
    try {
        // Approve USDT
        await approveToken(usdtTokenAddress, amount, USDT_DECIMALS);
        const tx = await contract.depositCollateral(ethers.utils.parseUnits(amount, USDT_DECIMALS));
        await tx.wait();
        alert("✅ Collatéral déposé !");
        loadFinanceData();
    } catch(e) { alert("❌ Erreur: " + (e.reason || e.message)); }
};

window.borrowFTA = async () => {
    const amount = document.getElementById('loanBorrow').value;
    if(!amount) return alert("Montant invalide");
    try {
        const tx = await contract.borrow(ethers.utils.parseUnits(amount, FTA_DECIMALS));
        await tx.wait();
        alert("✅ FTA empruntés !");
        loadFinanceData();
        loadUserData();
    } catch(e) { alert("❌ Erreur: " + (e.reason || e.message)); }
};

window.repayLoan = async () => {
    try {
        const tx = await contract.repayLoan();
        await tx.wait();
        alert("✅ Prêt remboursé !");
        loadFinanceData();
        loadUserData();
    } catch(e) { alert("❌ Erreur: " + (e.reason || e.message)); }
};

window.stakeTokens = async () => {
    const amount = document.getElementById('stakeAmount').value;
    if(!amount) return alert("Montant invalide");
    try {
        const tx = await contract.stake(0, ethers.utils.parseUnits(amount, FTA_DECIMALS));
        await tx.wait();
        alert("✅ Tokens stakés !");
    } catch(e) { alert("❌ Erreur: " + (e.reason || e.message)); }
};

window.unstakeTokens = async () => {
    try {
        const tx = await contract.unstake(0);
        await tx.wait();
        alert("✅ Unstake effectué !");
        loadUserData();
    } catch(e) { alert("❌ Erreur: " + (e.reason || e.message)); }
};

async function loadFinanceData() {
    if(!userAddress) return;
    try {
        const loan = await contract.userLoans(userAddress);
        const debt = parseFloat(ethers.utils.formatUnits(loan.borrowedAmount, FTA_DECIMALS)).toFixed(2);
        document.getElementById('currentDebt').innerText = debt > 0 ? debt : "0.00";
    } catch(e) {}
}

// =================================================================================
// SWAP
// =================================================================================
window.buyFTA = async () => {
    const amount = document.getElementById('swapAmountIn').value;
    if(!amount) return alert("Montant invalide");
    try {
        const tx = await contract.buyFTA(ethers.utils.parseUnits(amount, USDT_DECIMALS));
        await tx.wait();
        alert("✅ Achat FTA réussi !");
        loadUserData();
    } catch(e) { alert("❌ Erreur: " + (e.reason || e.message)); }
};

window.sellFTA = async () => {
    const amount = prompt("Montant FTA à vendre :");
    if(!amount) return;
    try {
        const tx = await contract.sellFTA(ethers.utils.parseUnits(amount, FTA_DECIMALS));
        await tx.wait();
        alert("✅ Vente réussie !");
        loadUserData();
    } catch(e) { alert("❌ Erreur: " + (e.reason || e.message)); }
};

window.registerReferrer = async () => {
    const addr = document.getElementById('referrerAddr').value;
    if(!addr) return alert("Adresse invalide");
    try {
        const tx = await contract.registerReferrer(addr);
        await tx.wait();
        alert("✅ Parrain enregistré !");
    } catch(e) { alert("❌ Erreur: " + (e.reason || e.message)); }
};

// =================================================================================
// CHART.JS
// =================================================================================
function initChart() {
    const ctx = document.getElementById('marketChart').getContext('2d');
    let gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(252, 213, 53, 0.5)');
    gradient.addColorStop(1, 'rgba(252, 213, 53, 0.0)');

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['', '', '', '', '', ''],
            datasets: [{
                data: [1.25, 1.26, 1.24, 1.27, 1.28, 1.27],
                borderColor: '#fcd535',
                backgroundColor: gradient,
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { x: { display: false }, y: { display: false } }
        }
    });
}

// Update Chart with new price
function updateChart(newPrice) {
    if(!chartInstance) return;
    const newData = chartInstance.data.datasets[0].data;
    newData.shift();
    newData.push(newPrice);
    chartInstance.update();
}