// ================= CONFIGURATION =================
// REMPLACE CES ADRESSES PAR LES TIENNES SUR POLYGON
const CONTRACT_ADDRESS = "0x027579bd6302174b499970955EF534500Cd342Dd"; // Adresse du FitiaEcosystemHub
const USDT_ADDRESS = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"; // USDT sur Polygon
const FTA_ADDRESS = "0x535bBe393D64a60E14B731b7350675792d501623"; // Ton token FTA

// ABI Complet pour toutes les fonctions
const HUB_ABI = [
    // Wallet
    "function depositToWallet(address _token, uint256 _amount) external",
    "function withdrawFromWallet(address _token, uint256 _amount) external",
    "function getMyBalance(address _token) external view returns (uint256)",
    
    // Trading
    "function openPosition(uint8 _asset, uint8 _side, uint256 _marginUSDT, uint256 _leverage) external",
    "function closePosition(uint256 _posId) external",
    "function positionCount() view returns (uint256)",
    "function positions(uint256) view returns (address trader, uint8 asset, uint8 side, uint256 margin, uint256 leverage, uint256 entryPrice, bool isOpen)",
    "function getAssetPrice(uint8 _asset) public view returns (uint256)",

    // Staking
    "function stake(uint256 _poolId, uint256 _amount) external",
    "function unstake(uint256 _poolId) external",
    
    // Aviator
    "function playAviator(uint256 _ftaBetAmount, uint256 _targetMultiplier) external",
    
    // Lending
    "function depositCollateral(uint256 _usdtAmount) external",
    "function borrow(uint256 _ftaAmount) external",
    "function repayLoan() external"
];

const ERC20_ABI = [
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function allowance(address owner, address spender) external view returns (uint256)"
];

// ================= VARIABLES GLOBALES =================
let provider, signer, contract, userAddress;

// ================= DOM ELEMENTS =================
const elements = {
    btnConnect: document.getElementById('btn-connect'),
    userInfo: document.getElementById('user-info'),
    walletAddress: document.getElementById('wallet-address'),
    loader: document.getElementById('loader'),
    
    // Balances
    balanceUsdt: document.getElementById('balance-usdt'),
    balanceFta: document.getElementById('balance-fta'),
    
    // Inputs
    walletAmount: document.getElementById('wallet-amount'),
    tradeMargin: document.getElementById('trade-margin'),
    tradeLev: document.getElementById('trade-lev'),
    levVal: document.getElementById('lev-val'),
    tradeAsset: document.getElementById('trade-asset'),
    
    // Buttons
    btnDeposit: document.getElementById('btn-deposit'),
    btnWithdraw: document.getElementById('btn-withdraw'),
    btnLong: document.getElementById('btn-long'),
    btnShort: document.getElementById('btn-short'),
    btnPlayAviator: document.getElementById('btn-play-aviator'),
    btnStake: document.getElementById('btn-stake'),
    btnUnstake: document.getElementById('btn-unstake'),
    btnDepositCollat: document.getElementById('btn-deposit-collat'),
    btnBorrow: document.getElementById('btn-borrow'),
    btnRepay: document.getElementById('btn-repay')
};

// ================= FONCTIONS UTILITAIRES =================
const showLoader = (show) => elements.loader.classList.toggle('hidden', !show);
const logError = (e) => { console.error(e); alert("Erreur: " + (e.reason || e.message)); };

// ================= NAVIGATION =================
window.openSection = (name) => {
    // Cache tout
    document.querySelectorAll('.section').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    
    // Affiche le bon
    document.getElementById('section-' + name).classList.remove('hidden');
    document.getElementById('nav-' + name).classList.add('active');
    
    // Rafraîchit les données si besoin
    if (name === 'trading' && userAddress) loadPositions();
};

// ================= CONNEXION =================
async function connectWallet() {
    if (!window.ethereum) return alert("Installe MetaMask !");
    
    try {
        provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = await provider.getSigner();
        userAddress = await signer.getAddress();
        
        contract = new ethers.Contract(CONTRACT_ADDRESS, HUB_ABI, signer);
        
        // UI Update
        elements.btnConnect.classList.add('hidden');
        elements.userInfo.classList.remove('hidden');
        elements.walletAddress.innerText = userAddress.substring(0, 6) + "..." + userAddress.substring(38);
        
        await loadBalances();
    } catch (e) { logError(e); }
}

// ================= CHARGEMENT DONNÉES =================
async function loadBalances() {
    try {
        const bUsdt = await contract.getMyBalance(USDT_ADDRESS);
        const bFta = await contract.getMyBalance(FTA_ADDRESS);
        
        elements.balanceUsdt.innerText = parseFloat(ethers.formatUnits(bUsdt, 6)).toFixed(2);
        elements.balanceFta.innerText = parseFloat(ethers.formatUnits(bFta, 18)).toFixed(2);
    } catch (e) { console.log("Erreur loadBalances", e); }
}

async function loadPositions() {
    try {
        const count = await contract.positionCount();
        const list = document.getElementById('positions-list');
        list.innerHTML = '';
        
        // Boucle simplifiée (on affiche les 5 dernières positions pour la démo)
        const start = count > 5 ? count - 5n : 0n;
        
        for (let i = start; i < count; i++) {
            const p = await contract.positions(i);
            if (p.isOpen && p.trader === userAddress) {
                const sideText = p.side === 0 ? "LONG" : "SHORT";
                const colorClass = p.side === 0 ? "color: #22c55e" : "color: #ef4444";
                
                const div = document.createElement('div');
                div.className = 'list-item';
                div.style.cssText = "background: #0f172a; padding: 10px; margin-bottom: 5px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;";
                div.innerHTML = `
                    <div>
                        <span style="${colorClass}; font-weight: bold;">${sideText} x${p.leverage}</span>
                        <br>
                        <small>Marge: ${ethers.formatUnits(p.margin, 6)} USDT</small>
                    </div>
                    <button onclick="closePos(${i})" class="btn secondary" style="padding: 5px 10px; font-size: 0.8rem;">Fermer</button>
                `;
                list.appendChild(div);
            }
        }
        
        if (list.innerHTML === '') list.innerHTML = '<p class="empty-msg">Aucune position ouverte.</p>';
    } catch (e) { console.log("Erreur loadPositions", e); }
}

window.closePos = async (id) => {
    showLoader(true);
    try {
        const tx = await contract.closePosition(id);
        await tx.wait();
        alert("Position fermée !");
        loadPositions();
        loadBalances();
    } catch(e) { logError(e); }
    showLoader(false);
};

// ================= ACTIONS WALLET =================
async function deposit() {
    const amt = elements.walletAmount.value;
    if (!amt) return;
    showLoader(true);
    try {
        const wei = ethers.parseUnits(amt, 6);
        const usdtContract = new ethers.Contract(USDT_ADDRESS, ERC20_ABI, signer);
        
        // Approve
        const allow = await usdtContract.allowance(userAddress, CONTRACT_ADDRESS);
        if (allow < wei) {
            const appTx = await usdtContract.approve(CONTRACT_ADDRESS, wei);
            await appTx.wait();
        }
        
        const tx = await contract.depositToWallet(USDT_ADDRESS, wei);
        await tx.wait();
        alert("Dépôt OK");
        elements.walletAmount.value = "";
        loadBalances();
    } catch(e) { logError(e); }
    showLoader(false);
}

async function withdraw() {
    const amt = elements.walletAmount.value;
    if (!amt) return;
    showLoader(true);
    try {
        const wei = ethers.parseUnits(amt, 6);
        const tx = await contract.withdrawFromWallet(USDT_ADDRESS, wei);
        await tx.wait();
        alert("Retrait OK");
        elements.walletAmount.value = "";
        loadBalances();
    } catch(e) { logError(e); }
    showLoader(false);
}

// ================= TRADING =================
async function openTrade(side) {
    const margin = elements.tradeMargin.value;
    const lev = elements.tradeLev.value;
    const asset = elements.tradeAsset.value;
    
    if (!margin) return;
    showLoader(true);
    try {
        const marginWei = ethers.parseUnits(margin, 6);
        const tx = await contract.openPosition(asset, side, marginWei, lev);
        await tx.wait();
        alert("Position ouverte !");
        openSection('trading'); // Refresh
    } catch(e) { logError(e); }
    showLoader(false);
}

// ================= AVIATOR =================
async function playAviator() {
    const bet = document.getElementById('aviator-bet').value;
    const target = document.getElementById('aviator-target').value;
    if (!bet || !target) return alert("Remplissez mise et cible");
    
    showLoader(true);
    try {
        const betWei = ethers.parseUnits(bet, 18); // FTA 18 decimales
        const targetWei = Math.floor(parseFloat(target) * 100); // Convertir 2.00 en 200
        
        // Approve FTA nécessaire
        const ftaContract = new ethers.Contract(FTA_ADDRESS, ERC20_ABI, signer);
        const allow = await ftaContract.allowance(userAddress, CONTRACT_ADDRESS);
        if (allow < betWei) {
            const appTx = await ftaContract.approve(CONTRACT_ADDRESS, betWei);
            await appTx.wait();
        }
        
        const tx = await contract.playAviator(betWei, targetWei);
        await tx.wait();
        
        // Simulation simple du résultat (car le hasard est dans le contrat)
        alert("Jeu terminé ! Vérifiez votre solde.");
        loadBalances();
    } catch(e) { logError(e); }
    showLoader(false);
}

// ================= STAKING =================
async function stake() {
    const poolId = document.getElementById('stake-pool-id').value;
    const amount = document.getElementById('stake-amount').value;
    if (!poolId || !amount) return;
    
    showLoader(true);
    try {
        // Le contrat utilise le solde interne, donc pas besoin de approve ici si déjà déposé
        // Mais si on stake de l'USDT, il faut qu'il soit dans le wallet interne
        const tx = await contract.stake(poolId, ethers.parseUnits(amount, 18)); // Attention aux décimales selon le pool
        await tx.wait();
        alert("Staké !");
        loadBalances();
    } catch(e) { logError(e); }
    showLoader(false);
}

async function unstake() {
    const poolId = document.getElementById('stake-pool-id').value;
    if (!poolId) return;
    showLoader(true);
    try {
        const tx = await contract.unstake(poolId);
        await tx.wait();
        alert("Unstaké !");
        loadBalances();
    } catch(e) { logError(e); }
    showLoader(false);
}

// ================= LENDING =================
async function depositCollateral() {
    const amt = document.getElementById('lend-collateral').value;
    if(!amt) return;
    showLoader(true);
    try {
        const wei = ethers.parseUnits(amt, 6);
        const tx = await contract.depositCollateral(wei);
        await tx.wait();
        alert("Collatéral déposé");
        loadBalances();
    } catch(e) { logError(e); }
    showLoader(false);
}

async function borrow() {
    const amt = document.getElementById('lend-borrow').value;
    if(!amt) return;
    showLoader(true);
    try {
        const wei = ethers.parseUnits(amt, 18);
        const tx = await contract.borrow(wei);
        await tx.wait();
        alert("Prêt obtenu");
        loadBalances();
    } catch(e) { logError(e); }
    showLoader(false);
}

async function repay() {
    showLoader(true);
    try {
        const tx = await contract.repayLoan();
        await tx.wait();
        alert("Prêt remboursé");
        loadBalances();
    } catch(e) { logError(e); }
    showLoader(false);
}

// ================= EVENT LISTENERS =================
elements.btnConnect.addEventListener('click', connectWallet);
elements.btnDeposit.addEventListener('click', deposit);
elements.btnWithdraw.addEventListener('click', withdraw);

elements.btnLong.addEventListener('click', () => openTrade(0));
elements.btnShort.addEventListener('click', () => openTrade(1));

elements.tradeLev.addEventListener('input', (e) => elements.levVal.innerText = "x" + e.target.value);

elements.btnPlayAviator.addEventListener('click', playAviator);
elements.btnStake.addEventListener('click', stake);
elements.btnUnstake.addEventListener('click', unstake);
elements.btnDepositCollat.addEventListener('click', depositCollateral);
elements.btnBorrow.addEventListener('click', borrow);
elements.btnRepay.addEventListener('click', repay);

// PAS DE CONNEXION AUTOMATIQUE