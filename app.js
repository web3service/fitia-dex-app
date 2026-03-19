// --- CONFIGURATION POLYGON ---
// ⚠️ REMPLACE CECI PAR L'ADRESSE DE TON CONTRAT FitiaEcosystemHub DÉPLOYÉ SUR POLYGON
const CONTRACT_ADDRESS = "0xAfdFb346F819ffF3DdEF77e23E25a34E19c7Cab2"; 

// ⚠️ REMPLACE CECI PAR L'ADRESSE DU TOKEN FTA DÉPLOYÉ SUR POLYGON (Si différente du contrat Hub)
// Souvent, le contrat Hub récupère l'adresse du token FTA lui-même, donc cette variable est moins critique 
// mais utile pour les vérifications.
const FTA_TOKEN_ADDRESS = "0x535bBe393D64a60E14B731b7350675792d501623"; 

// ✅ ABI COMPLET (Fonctions Utilisateurs Uniquement)
const CONTRACT_ABI = [
    "event PositionOpened(uint256 indexed id, address indexed trader, uint256 margin, uint256 leverage)",
    "event PositionClosed(uint256 indexed id, int256 pnl, address closedBy)",
    "event AviatorPlayed(address indexed player, uint256 bet, uint256 targetMultiplier)",
    "event AviatorResolved(address indexed player, bool won, uint256 payout, uint256 crashPoint)",
    "event Mined(address indexed user, uint256 indexed tokenId, uint256 amount)",
    "event Deposit(address indexed user, address indexed token, uint256 amount)",
    "event Withdraw(address indexed user, address indexed token, uint256 amount)",
    
    // Core
    "function getAssetPrice(uint8 _asset) external view returns (uint256)",
    "function getMyBalance(address _token) external view returns (uint256)",
    "function usdt() external view returns (address)",
    "function fta() external view returns (address)",
    "function userProfiles(address) external view returns (uint256 level, uint256 xp, uint256 totalVolumeTraded, bool isEarlyAdopter, bool isTopTrader, uint256 feeDiscount)",
    "function referrals(address) external view returns (address referrer, uint256 totalEarnings, uint256 referralCount)",
    "function referrerOf(address) external view returns (address)",
    
    // Wallet
    "function depositToWallet(address _token, uint256 _amount) external",
    "function withdrawFromWallet(address _token, uint256 _amount) external",
    
    // Trading
    "function openPositionWithLimits(uint8 _asset, uint8 _side, uint256 _marginUSDT, uint256 _leverage, uint256 _stopLossPrice, uint256 _takeProfitPrice) external",
    "function closePosition(uint256 _posId) external",
    "function positionCount() external view returns (uint256)",
    "function positions(uint256) external view returns (address trader, uint8 asset, uint8 side, uint256 margin, uint256 leverage, uint256 entryPrice, bool isOpen)",
    "function checkAutoClose(uint256 _posId) external",
    
    // Mining
    "function balanceOf(address owner) external view returns (uint256)",
    "function userMachines(uint256) external view returns (uint256 typeId, uint256 batteryEndTime, uint256 lastClaimTime)",
    "function claimMiningRewards(uint256 _tokenId) external",
    "function buyMachine(uint256 _typeId) external",
    "function buyBattery(uint256 _tokenId, uint256 _packId) external",
    "function machineTypes(uint256) external view returns (string name, uint256 priceUSD, uint256 hashpower, bool exists)",
    
    // Game
    "function playAviator(uint256 _ftaBetAmount, uint256 _targetMultiplier) external",
    
    // Finance
    "function depositCollateral(uint256 _usdtAmount) external",
    "function borrow(uint256 _ftaAmount) external",
    "function repayLoan() external",
    "function userLoans(address) external view returns (uint256 collateralAmount, uint256 borrowedAmount, uint256 startTime, bool isActive)",
    "function stake(uint256 _poolId, uint256 _amount) external",
    "function unstake(uint256 _poolId) external",
    "function stakingPools(uint256) external view returns (address stakeToken, address rewardToken, uint256 apy, bool exists)",
    
    // Swap
    "function buyFTA(uint256 _usdtAmount) external",
    "function sellFTA(uint256 _ftaAmount) external",
    
    // Ref
    "function registerReferrer(address _referrer) external"
];

// --- CONFIGURATION RÉSEAU POLYGON ---
const POLYGON_CHAIN_ID = 137; // Hex: 0x89
const POLYGON_CHAIN_ID_HEX = "0x89";
const POLYGON_RPC = "https://polygon-rpc.com";
const POLYGON_CURRENCY = {
    name: "MATIC",
    symbol: "MATIC",
    decimals: 18
};

// Constantes Tokens
const USDT_DECIMALS = 6; // USDT sur Polygon a 6 décimales
const FTA_DECIMALS = 8;  // Ton token FTA a 8 décimales
const ASSET_FTA = 2; 
const ASSET_BTC = 0;
const ASSET_ETH = 1;

let provider, signer, contract, userAddress;
let chartInstance = null;
let currentTradeSide = 0; 
let gameInterval = null;

// --- INITIALISATION ---
document.addEventListener('DOMContentLoaded', () => {
    initChart();
    checkConnection();
    setInterval(updatePriceDisplay, 10000);
});

// --- CONNEXION & CHANGEMENT DE RÉSEAU ---
async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            provider = new ethers.providers.Web3Provider(window.ethereum);
            
            // 1. Vérifier le réseau actuel
            const network = await provider.getNetwork();
            if (network.chainId !== POLYGON_CHAIN_ID) {
                await switchToPolygon();
                return; // Reconnecter après le switch
            }

            await provider.send("eth_requestAccounts", []);
            signer = provider.getSigner();
            userAddress = await signer.getAddress();
            
            contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
            
            const shortAddr = `${userAddress.substring(0,6)}...${userAddress.substring(38)}`;
            const btn = document.getElementById('walletAddress');
            btn.innerHTML = `<i class="fa-solid fa-check"></i> ${shortAddr}`;
            btn.onclick = null;
            btn.style.borderColor = "#00c087";
            btn.style.color = "#00c087";
            
            document.getElementById('myRefCode').innerText = shortAddr;
            
            loadUserData();
            loadMiningData();
            listenToEvents();
            
            alert("✅ Connecté au réseau Polygon avec succès !");
        } catch (error) {
            console.error(error);
            if (error.code === 4902) {
                // Réseau non ajouté, on essaie de l'ajouter
                await switchToPolygon();
            } else {
                alert("❌ Erreur de connexion : " + error.message);
            }
        }
    } else {
        alert("⚠️ Veuillez installer MetaMask !");
    }
}

// Fonction pour basculer ou ajouter le réseau Polygon
async function switchToPolygon() {
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: POLYGON_CHAIN_ID_HEX }],
        });
        // Recharger la page ou reconnecter après le switch
        window.location.reload(); 
    } catch (switchError) {
        // Si le réseau n'est pas ajouté, on l'ajoute
        if (switchError.code === 4902) {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            chainId: POLYGON_CHAIN_ID_HEX,
                            chainName: 'Polygon Mainnet',
                            nativeCurrency: POLYGON_CURRENCY,
                            rpcUrls: [POLYGON_RPC],
                            blockExplorerUrls: ['https://polygonscan.com/'],
                        },
                    ],
                });
                window.location.reload();
            } catch (addError) {
                alert("❌ Impossible d'ajouter le réseau Polygon. Veuillez l'ajouter manuellement dans MetaMask.");
                console.error(addError);
            }
        } else {
            alert("❌ Veuillez changer de réseau pour Polygon dans MetaMask.");
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
                document.getElementById('walletAddress').innerText = "Changer vers Polygon";
                document.getElementById('walletAddress').onclick = switchToPolygon;
            }
        }
    }
}

// --- NAVIGATION ---
window.showTab = (tabId) => {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    
    const navMap = {
        'tab-dashboard': 0, 'tab-trade': 1, 'tab-mining': 2, 'tab-game': 3, 'tab-wallet': 4
    };
    if (navMap[tabId] !== undefined) {
        document.querySelectorAll('.nav-item')[navMap[tabId]].classList.add('active');
    }

    if(tabId === 'tab-trade') loadPositions();
    if(tabId === 'tab-finance') loadFinanceData();
    window.scrollTo(0,0);
};

window.setTradeSide = (side) => {
    currentTradeSide = side === 'LONG' ? 0 : 1;
    document.querySelectorAll('.t-tab').forEach(el => el.classList.remove('active'));
    event.target.classList.add('active');
};

// --- DONNÉES UTILISATEUR ---
async function loadUserData() {
    if(!contract || !userAddress) return;
    try {
        const usdtAddr = await contract.usdt();
        const ftaAddr = await contract.fta();
        
        const usdtBalRaw = await contract.internalBalances(userAddress, usdtAddr);
        const ftaBalRaw = await contract.internalBalances(userAddress, ftaAddr);
        
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
        // Le contrat va chercher le prix BTC sur l'oracle Polygon et calcule le FTA
        const priceRaw = await contract.getAssetPrice(ASSET_FTA);
        const price = ethers.utils.formatUnits(priceRaw, 8);
        const el = document.getElementById('ftaPrice');
        el.innerText = `$${parseFloat(price).toFixed(4)}`;
        
        // Animation visuelle
        el.style.color = '#00c087';
        setTimeout(() => el.style.color = '#fcd535', 500);
        
        return parseFloat(price);
    } catch (e) { 
        console.error("Erreur Prix", e);
        return 1.25; 
    }
}

// --- TRADING ---
async function executeTrade() {
    const margin = document.getElementById('tradeMargin').value;
    const leverage = document.getElementById('tradeLeverage').value;
    const sl = document.getElementById('tradeSL').value || 0;
    const tp = document.getElementById('tradeTP').value || 0;

    if(!margin || margin <= 0) return alert("⚠️ Veuillez entrer une marge valide.");

    const btn = document.getElementById('btnOpenPosition');
    const originalText = btn.innerText;
    btn.disabled = true;
    btn.innerText = "Traitement...";

    try {
        const marginWei = ethers.utils.parseUnits(margin, USDT_DECIMALS);
        const slWei = sl > 0 ? ethers.utils.parseUnits(sl.toString(), 8) : 0;
        const tpWei = tp > 0 ? ethers.utils.parseUnits(tp.toString(), 8) : 0;

        const tx = await contract.openPositionWithLimits(
            ASSET_FTA, currentTradeSide, marginWei, leverage, slWei, tpWei
        );
        
        btn.innerText = "Confirmation...";
        await tx.wait();
        
        alert("✅ Position ouverte avec succès sur Polygon !");
        btn.disabled = false;
        btn.innerText = originalText;
        document.getElementById('tradeMargin').value = '';
        loadPositions();
        showTab('tab-dashboard');
    } catch (e) {
        console.error(e);
        let msg = e.reason || e.message;
        if(msg.includes("Insufficient")) msg = "Solde insuffisant. Déposez des USDT dans le Hub.";
        alert("❌ Erreur: " + msg);
        btn.disabled = false;
        btn.innerText = originalText;
    }
}

async function loadPositions() {
    const list = document.getElementById('positionsList');
    list.innerHTML = '<div style="text-align:center; padding:20px; color:#666;"><i class="fa-solid fa-circle-notch fa-spin"></i></div>';
    try {
        const count = await contract.positionCount();
        if(count == 0) { 
            list.innerHTML = '<div class="empty-state">Aucune position ouverte</div>'; 
            return; 
        }

        let html = '';
        const start = count > 10 ? count - 10 : 1;
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
                        <button class="btn-sm" style="width:auto; background:#ff4d4f; color:white; border:none;" onclick="closePos(${i})">Clôturer</button>
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
    } catch (e) { 
        list.innerHTML = '<div class="empty-state">Erreur de chargement</div>'; 
    }
}

window.closePos = async (id) => {
    if(!confirm("Voulez-vous vraiment clôturer cette position ?")) return;
    try {
        const tx = await contract.closePosition(id);
        await tx.wait();
        alert("✅ Position clôturée !");
        loadPositions();
        loadUserData();
    } catch(e) { 
        alert("❌ Erreur: " + (e.reason || e.message)); 
    }
};

// --- MINING ---
async function loadMiningData() {
    if(!userAddress) return;
    try {
        const balance = await contract.balanceOf(userAddress);
        const statusDiv = document.getElementById('miningVisual');
        
        if(balance > 0) {
            const machine = await contract.userMachines(balance);
            const now = Math.floor(Date.now() / 1000);
            const batteryLeft = machine.batteryEndTime > now ? machine.batteryEndTime - now : 0;
            const hoursLeft = Math.floor(batteryLeft / 3600);
            
            statusDiv.innerHTML = `
                <i class="fa-solid fa-server" style="color:var(--primary)"></i>
                <p>Machine Active (ID: #${balance})</p>
                <small style="color:#00c087">Batterie : ${hoursLeft}h restantes</small>
            `;
            document.getElementById('hashPower').innerText = "150"; 
            document.getElementById('batteryLevel').innerText = hoursLeft > 0 ? "Active" : "Vide";
        } else {
            statusDiv.innerHTML = `
                <i class="fa-solid fa-microchip" style="color:#444"></i>
                <p>Aucune machine détenue</p>
                <button class="btn-sm" style="margin-top:10px;" onclick="showTab('tab-wallet')">Acheter USDT</button>
            `;
        }
    } catch(e) {}
}

window.buyMachine = async (typeId) => {
    try {
        const mType = await contract.machineTypes(typeId);
        // Attention au format du prix selon ton contrat (ici supposé USD brut ou avec décimales)
        // Si le prix est stocké en "cents" ou avec 18 décimales, ajuster le formatUnits
        const priceUSD = ethers.utils.formatUnits(mType.priceUSD, 0); 
        
        if(confirm(`Acheter cette machine pour ${priceUSD} USDT ?`)) {
            const tx = await contract.buyMachine(typeId);
            await tx.wait();
            alert("✅ Machine achetée !");
            loadMiningData();
        }
    } catch(e) { alert("❌ Erreur: " + (e.reason || e.message)); }
};

window.buyBattery = async (packId) => {
    const tokenId = prompt("Entrez l'ID de votre machine NFT :");
    if(!tokenId) return;
    try {
        const tx = await contract.buyBattery(tokenId, packId);
        await tx.wait();
        alert("✅ Batterie chargée !");
        loadMiningData();
    } catch(e) { alert("❌ Erreur: " + (e.reason || e.message)); }
};

window.claimRewards = async () => {
    const tokenId = prompt("Entrez l'ID de votre machine :");
    if(!tokenId) return;
    try {
        const tx = await contract.claimMiningRewards(tokenId);
        await tx.wait();
        alert("✅ Récompenses récoltées !");
        loadUserData();
    } catch(e) { alert("❌ Erreur: " + (e.reason || e.message)); }
};

// --- JEU AVIATOR ---
window.playAviator = async () => {
    const bet = document.getElementById('gameBet').value;
    const target = document.getElementById('gameTarget').value;
    
    if(!bet || bet <= 0) return alert("Mise invalide");
    if(!target || target <= 1) return alert("Cible > 1.00x");
    
    const btn = document.getElementById('btnPlayAviator');
    const display = document.getElementById('gameMultiplier');
    const plane = document.getElementById('gamePlane');
    const resultDiv = document.getElementById('gameResult');
    
    btn.disabled = true;
    btn.innerText = "EN VOL...";
    resultDiv.innerText = "";
    display.classList.remove('crashed');
    
    let multiplier = 1.00;
    plane.style.transition = "all 0.1s linear";
    plane.style.bottom = "20px";
    plane.style.left = "20px";
    plane.style.opacity = "1";
    
    gameInterval = setInterval(() => {
        multiplier += 0.05 + (multiplier * 0.01);
        display.innerText = multiplier.toFixed(2) + "x";
        let move = Math.min((multiplier - 1) * 30, 140);
        plane.style.bottom = (20 + move) + "px";
        plane.style.left = (20 + move) + "px";
        if(Math.random() > 0.96 && multiplier > 1.2) {
            endGame(multiplier, false, btn, display, plane, resultDiv);
        }
    }, 100);

    try {
        const betWei = ethers.utils.parseUnits(bet, FTA_DECIMALS);
        const targetRaw = Math.floor(parseFloat(target) * 100); 
        
        const tx = await contract.playAviator(betWei, targetRaw);
        const receipt = await tx.wait();
        
        setTimeout(() => {
            if(btn.disabled) endGame(multiplier, true, btn, display, plane, resultDiv);
        }, 5000);

    } catch(e) {
        clearInterval(gameInterval);
        btn.disabled = false;
        btn.innerText = "PARIER";
        alert("❌ Erreur Jeu: " + (e.reason || e.message));
    }
};

function endGame(finalMult, won, btn, display, plane, resultDiv) {
    clearInterval(gameInterval);
    btn.disabled = false;
    btn.innerText = "PARIER";
    
    if (!won) {
        display.classList.add('crashed');
        display.innerText = "CRASH @ " + finalMult.toFixed(2) + "x";
        plane.style.opacity = "0";
        resultDiv.innerText = `Perdu ! Crash à ${finalMult.toFixed(2)}x`;
        resultDiv.style.color = "var(--danger)";
    } else {
        resultDiv.innerText = `Gagné ! (Transaction confirmée)`;
        resultDiv.style.color = "var(--success)";
        loadUserData();
    }
    
    setTimeout(() => {
        plane.style.transition = "none";
        plane.style.bottom = "20px";
        plane.style.left = "20px";
        plane.style.opacity = "1";
        display.classList.remove('crashed');
        display.innerText = "1.00x";
    }, 3000);
}

// --- FINANCE ---
async function loadFinanceData() {
    if(!userAddress) return;
    try {
        const loan = await contract.userLoans(userAddress);
        const debt = parseFloat(ethers.utils.formatUnits(loan.borrowedAmount, FTA_DECIMALS)).toFixed(2);
        document.getElementById('currentDebt').innerText = debt > 0 ? debt : "0.00";
    } catch(e) {}
}

window.depositCollateral = async () => {
    const amount = document.getElementById('loanCollateral').value;
    if(!amount || amount <= 0) return alert("Montant invalide");
    try {
        const tx = await contract.depositCollateral(ethers.utils.parseUnits(amount, USDT_DECIMALS));
        await tx.wait();
        alert("✅ Collatéral déposé !");
        loadFinanceData();
    } catch(e) { alert("❌ Erreur: " + (e.reason || e.message)); }
};

window.borrowFTA = async () => {
    const amount = document.getElementById('loanBorrow').value;
    if(!amount || amount <= 0) return alert("Montant invalide");
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
    const poolId = document.getElementById('stakePoolId').value;
    const amount = document.getElementById('stakeAmount').value;
    if(!amount || amount <= 0) return alert("Montant invalide");
    try {
        const tx = await contract.stake(poolId, ethers.utils.parseUnits(amount, FTA_DECIMALS));
        await tx.wait();
        alert("✅ Tokens stakés !");
    } catch(e) { alert("❌ Erreur: " + (e.reason || e.message)); }
};

window.unstakeTokens = async () => {
    const poolId = document.getElementById('stakePoolId').value;
    try {
        const tx = await contract.unstake(poolId);
        await tx.wait();
        alert("✅ Unstake effectué !");
        loadUserData();
    } catch(e) { alert("❌ Erreur: " + (e.reason || e.message)); }
};

// --- SWAP & WALLET ---
window.buyFTA = async () => {
    const amount = document.getElementById('swapAmountIn').value;
    if(!amount || amount <= 0) return alert("Montant invalide");
    try {
        const tx = await contract.buyFTA(ethers.utils.parseUnits(amount, USDT_DECIMALS));
        await tx.wait();
        alert("✅ Achat FTA réussi !");
        loadUserData();
    } catch(e) { alert("❌ Erreur: " + (e.reason || e.message)); }
};

window.sellFTA = async () => {
    const amount = prompt("Montant FTA à vendre :");
    if(!amount || amount <= 0) return;
    try {
        const tx = await contract.sellFTA(ethers.utils.parseUnits(amount, FTA_DECIMALS));
        await tx.wait();
        alert("✅ Vente FTA réussie !");
        loadUserData();
    } catch(e) { alert("❌ Erreur: " + (e.reason || e.message)); }
};

window.depositToHub = async () => {
    const amount = prompt("Montant USDT à déposer :");
    if(!amount || amount <= 0) return;
    try {
        const usdtAddr = await contract.usdt();
        // Note: Assurez-vous d'avoir fait l'approve du token USDT avant si nécessaire
        const tx = await contract.depositToWallet(usdtAddr, ethers.utils.parseUnits(amount, USDT_DECIMALS));
        await tx.wait();
        alert("✅ Dépôt réussi !");
        loadUserData();
    } catch(e) { alert("❌ Erreur: " + (e.reason || e.message)); }
};

window.withdrawFromHub = async () => {
    const amount = prompt("Montant USDT à retirer :");
    if(!amount || amount <= 0) return;
    try {
        const usdtAddr = await contract.usdt();
        const tx = await contract.withdrawFromWallet(usdtAddr, ethers.utils.parseUnits(amount, USDT_DECIMALS));
        await tx.wait();
        alert("✅ Retrait réussi !");
        loadUserData();
    } catch(e) { alert("❌ Erreur: " + (e.reason || e.message)); }
};

window.registerReferrer = async () => {
    const addr = document.getElementById('referrerAddr').value;
    if(!addr || addr.length < 40) return alert("Adresse invalide");
    try {
        const tx = await contract.registerReferrer(addr);
        await tx.wait();
        alert("✅ Parrain enregistré !");
    } catch(e) { alert("❌ Erreur: " + (e.reason || e.message)); }
};

// --- GRAPHIQUE ---
function initChart() {
    const ctx = document.getElementById('marketChart').getContext('2d');
    let gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(252, 213, 53, 0.5)');
    gradient.addColorStop(1, 'rgba(252, 213, 53, 0.0)');

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['10:00', '10:05', '10:10', '10:15', '10:20', '10:25'],
            datasets: [{
                label: 'Prix FTA (USD)',
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
            scales: {
                x: { display: false },
                y: { grid: { color: '#333' }, ticks: { color: '#888' } }
            },
            animation: { duration: 0 }
        }
    });
}

function updateChart() {
    if(!chartInstance) return;
    const newData = chartInstance.data.datasets[0].data;
    newData.shift();
    const last = newData[newData.length - 1];
    newData.push(last + (Math.random() - 0.5) * 0.05);
    chartInstance.update();
}

function listenToEvents() {
    contract.on("PositionOpened", (id, trader) => {
        if(trader.toLowerCase() === userAddress.toLowerCase()) {
            console.log("Nouvelle position #" + id);
            loadPositions();
        }
    });
}