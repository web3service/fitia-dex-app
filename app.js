// Fichier app.js

// =================================================================
// 1. CONFIGURATION
// =================================================================
const CONTRACT_ADDRESS = "0xAfdFb346F819ffF3DdEF77e23E25a34E19c7Cab2"; // REMPLACEZ CECI
const USDT_ADDRESS = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"; 
const FTA_ADDRESS = "0x535bBe393D64a60E14B731b7350675792d501623"; // REMPLACEZ CECI

// Collez votre ABI complète ici (depuis PolygonScan -> Contract -> ABI)
const ABI = [
    "function depositToWallet(address _token, uint256 _amount) external",
    "function withdrawFromWallet(address _token, uint256 _amount) external",
    "function internalBalances(address, address) view returns (uint256)",
    "function getAssetPrice(uint8) view returns (uint256)",
    "function buyFTA(uint256 _usdtAmount) external",
    "function sellFTA(uint256 _ftaAmount) external",
    "function openPosition(uint8 _asset, uint8 _side, uint256 _marginUSDT, uint256 _leverage) external",
    "function closePosition(uint256 _posId) external",
    "function buyMachine(uint256 _typeId) external",
    "function buyBattery(uint256 _tokenId, uint256 _packId) external",
    "function claimMiningRewards(uint256 _tokenId) external",
    "function addLiquidity(uint256 _amountUSDT, uint256 _amountFTA) external",
    "function removeLiquidity(uint256 _lpAmount) external",
    "function playAviator(uint256 _ftaBetAmount, uint256 _targetMultiplier) external",
    "function stake(uint256 _poolId, uint256 _amount) external",
    "function unstake(uint256 _poolId) external",
    "function borrow(uint256 _ftaAmount) external",
    "function repayLoan() external",
    "function depositCollateral(uint256 _usdtAmount) external"
];

let provider, signer, contract;
let userAddress = null;

// =================================================================
// 2. INITIALISATION
// =================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Vérifier si MetaMask est installé
    if (window.ethereum) {
        setupEventListeners();
    } else {
        showToast("MetaMask non détecté !", "error");
    }
});

function setupEventListeners() {
    // Boutons principaux
    document.getElementById('btn-connect').addEventListener('click', connectWallet);
    
    // Navigation Mobile
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const section = e.currentTarget.getAttribute('data-section');
            if(section) showSection(section);
        });
    });

    // Forms (Ajoutez vos ID dans le HTML pour chaque bouton)
    // Exemple : document.getElementById('btn-deposit').addEventListener('click', deposit);
    // Pour simplifier, nous allons utiliser des appels 'onclick' directs dans le HTML pour cet exemple.
}

async function connectWallet() {
    try {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
        
        userAddress = await signer.getAddress();
        
        // Mise à jour UI
        document.getElementById('btn-connect').classList.add('hidden');
        document.getElementById('user-info').classList.remove('hidden');
        document.getElementById('user-address').innerText = `${userAddress.substring(0,6)}...${userAddress.slice(-4)}`;
        
        showSection('dashboard');
        loadDashboard();
        showToast("Wallet connecté !", "success");
    } catch (err) {
        console.error(err);
        showToast("Échec de la connexion", "error");
    }
}

// =================================================================
// 3. CHARGEMENT DES DONNÉES (DASHBOARD)
// =================================================================
async function loadDashboard() {
    if (!contract) return;
    try {
        // Prix FTA
        const price = await contract.getAssetPrice(2); // 2 = FTA
        document.getElementById('fta-price').innerText = parseFloat(ethers.utils.formatUnits(price, 8)).toFixed(2);

        // Soldes
        const balUsdt = await contract.internalBalances(userAddress, USDT_ADDRESS);
        const balFta = await contract.internalBalances(userAddress, FTA_ADDRESS);

        document.getElementById('bal-usdt').innerText = parseFloat(ethers.utils.formatUnits(balUsdt, 6)).toFixed(2);
        document.getElementById('bal-fta').innerText = parseFloat(ethers.utils.formatUnits(balFta, 8)).toFixed(2);

    } catch (e) { console.error("Erreur chargement data", e); }
}

// =================================================================
// 4. FONCTIONS UTILISATEUR (ACTIONS)
// =================================================================

// --- WALLET ---
async function deposit() {
    const token = document.getElementById('dep-token').value;
    const amount = document.getElementById('dep-amount').value;
    if(!amount) return;
    
    const tokenAddr = token === 'usdt' ? USDT_ADDRESS : FTA_ADDRESS;
    const decimals = token === 'usdt' ? 6 : 8;

    await runTransaction(async () => {
        // 1. Approve
        showToast("1. Approbation en cours...", "info");
        const tokenContract = new ethers.Contract(tokenAddr, ["function approve(address,uint256)"], signer);
        let tx = await tokenContract.approve(CONTRACT_ADDRESS, ethers.utils.parseUnits(amount, decimals));
        await tx.wait();
        
        // 2. Deposit
        showToast("2. Dépôt...", "info");
        tx = await contract.depositToWallet(tokenAddr, ethers.utils.parseUnits(amount, decimals));
        return tx;
    }, loadDashboard);
}

async function withdraw() {
    const token = document.getElementById('wit-token').value;
    const amount = document.getElementById('wit-amount').value;
    if(!amount) return;

    const tokenAddr = token === 'usdt' ? USDT_ADDRESS : FTA_ADDRESS;
    const decimals = token === 'usdt' ? 6 : 8;

    await runTransaction(async () => {
        return await contract.withdrawFromWallet(tokenAddr, ethers.utils.parseUnits(amount, decimals));
    }, loadDashboard);
}

// --- MARKET ---
async function buyFTA() {
    const amount = document.getElementById('buy-amt').value;
    if(!amount) return;
    await runTransaction(async () => {
        return await contract.buyFTA(ethers.utils.parseUnits(amount, 6));
    }, loadDashboard);
}

async function sellFTA() {
    const amount = document.getElementById('sell-amt').value;
    if(!amount) return;
    await runTransaction(async () => {
        return await contract.sellFTA(ethers.utils.parseUnits(amount, 8));
    }, loadDashboard);
}

// --- MINING ---
async function buyMachine() {
    const typeId = document.getElementById('machine-type').value;
    await runTransaction(async () => {
        return await contract.buyMachine(typeId);
    });
}

async function buyBattery() {
    const tokenId = document.getElementById('bat-token').value;
    const packId = document.getElementById('bat-pack').value;
    if(!tokenId) return showToast("Entrez l'ID de votre machine", "error");
    
    await runTransaction(async () => {
        return await contract.buyBattery(tokenId, packId);
    });
}

async function claimMining(tokenId) {
    await runTransaction(async () => {
        return await contract.claimMiningRewards(tokenId);
    }, loadDashboard);
}

// --- TRADING ---
async function openPosition(side) {
    const asset = document.getElementById('trade-asset').value;
    const margin = document.getElementById('trade-margin').value;
    const leverage = document.getElementById('trade-lev').value;
    
    if(!margin || !leverage) return showToast("Remplissez tous les champs", "error");

    await runTransaction(async () => {
        return await contract.openPosition(asset, side, ethers.utils.parseUnits(margin, 6), leverage);
    });
}

// --- FARMING ---
async function addLiquidity() {
    const amtU = document.getElementById('farm-usdt').value;
    const amtF = document.getElementById('farm-fta').value;
    if(!amtU || !amtF) return;

    await runTransaction(async () => {
        // Approves nécessaires avant...
        return await contract.addLiquidity(ethers.utils.parseUnits(amtU, 6), ethers.utils.parseUnits(amtF, 8));
    });
}

// --- AVIATOR ---
async function playAviator() {
    const bet = document.getElementById('aviator-bet').value;
    const mult = document.getElementById('aviator-mult').value;
    if(!bet || !mult) return;

    await runTransaction(async () => {
        return await contract.playAviator(ethers.utils.parseUnits(bet, 8), mult);
    });
}

// =================================================================
// 5. UTILITAIRES UI
// =================================================================

// Gestionnaire de transaction générique (Gère le loading et les erreurs)
async function runTransaction(callback, onSuccess) {
    const loader = document.getElementById('global-loader');
    try {
        loader.classList.remove('hidden');
        const tx = await callback();
        showToast("Transaction envoyée...", "info");
        await tx.wait();
        showToast("Transaction réussie !", "success");
        if(onSuccess) onSuccess();
    } catch (err) {
        console.error(err);
        showToast("Erreur : " + (err.reason || "Transaction rejetée"), "error");
    } finally {
        loader.classList.add('hidden');
    }
}

function showSection(sectionId) {
    // Cacher tout
    document.querySelectorAll('main > section').forEach(el => el.classList.add('hidden'));
    // Afficher la section
    const sec = document.getElementById('section-' + sectionId);
    if (sec) sec.classList.remove('hidden');

    // Gérer la navigation active
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active-nav');
        if(btn.getAttribute('data-section') === sectionId) btn.classList.add('active-nav');
    });

    // Fermer le menu mobile si ouvert
    document.getElementById('mobile-menu').classList.add('hidden');
}

function toggleMobileMenu() {
    document.getElementById('mobile-menu').classList.toggle('hidden');
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `p-4 rounded-lg shadow-lg flex items-center space-x-2 animate-fade-in;
        ${type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'}`;
    toast.innerHTML = `<span class="text-white font-medium">${message}</span>`;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 4000);
}