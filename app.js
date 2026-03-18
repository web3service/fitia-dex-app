// Fichier app.js

// =================================================================
// 1. CONFIGURATION
// =================================================================
const CONTRACT_ADDRESS = "0xAfdFb346F819ffF3DdEF77e23E25a34E19c7Cab2"; // REMPLACEZ CECI
const USDT_ADDRESS = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"; 
const FTA_ADDRESS = "0x535bBe393D64a60E14B731b7350675792d501623"; // REMPLACEZ CECI
const POLYGON_CHAIN_ID = 137; // ID du réseau Polygon

// ABI MINIMALE (Copiez l'ABI complète depuis PolygonScan pour toutes les fonctions)
const ABI = [
    "function depositToWallet(address _token, uint256 _amount) external",
    "function withdrawFromWallet(address _token, uint256 _amount) external",
    "function internalBalances(address, address) view returns (uint256)",
    "function getAssetPrice(uint8) view returns (uint256)",
    "function buyFTA(uint256 _usdtAmount) external",
    "function sellFTA(uint256 _ftaAmount) external",
    "function openPosition(uint8 _asset, uint8 _side, uint256 _marginUSDT, uint256 _leverage) external",
    "function buyMachine(uint256 _typeId) external",
    "function buyBattery(uint256 _tokenId, uint256 _packId) external",
    "function playAviator(uint256 _ftaBetAmount, uint256 _targetMultiplier) external",
    // Ajoutez ici les autres fonctions que vous utilisez...
];

let provider, signer, contract, userAddress;

// =================================================================
// 2. INITIALISATION
// =================================================================
window.addEventListener('load', () => {
    // Vérifier si MetaMask existe
    if (typeof window.ethereum !== 'undefined') {
        setupButtons();
        // Écouter les changements de compte
        window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts.length > 0) {
                connectWallet(); // Reconnecter automatiquement
            } else {
                resetApp(); // Déconnecter
            }
        });
        // Écouter les changements de réseau
        window.ethereum.on('chainChanged', () => {
            window.location.reload();
        });
    } else {
        document.getElementById('btn-connect').innerText = "Installez MetaMask";
        document.getElementById('btn-connect').disabled = true;
    }
});

function setupButtons() {
    // Boutons navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const section = e.currentTarget.getAttribute('data-section');
            if(section) showSection(section);
        });
    });
}

// =================================================================
// 3. CONNEXION WALLET (CORRIGÉE)
// =================================================================
async function connectWallet() {
    try {
        showLoader(true);
        
        // 1. Initialiser Provider
        provider = new ethers.providers.Web3Provider(window.ethereum);
        
        // 2. Vérifier le réseau
        const network = await provider.getNetwork();
        if (network.chainId !== POLYGON_CHAIN_ID) {
            showLoader(false);
            showToast("Veuillez basculer sur le réseau Polygon!", "error");
            await switchToPolygon();
            return;
        }

        // 3. Demander la connexion
        await provider.send("eth_requestAccounts", []);
        
        // 4. Initialiser Signer et Contract
        signer = provider.getSigner();
        contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
        
        userAddress = await signer.getAddress();
        
        // 5. Mise à jour UI
        document.getElementById('btn-connect').classList.add('hidden');
        document.getElementById('user-btn').classList.remove('hidden');
        document.getElementById('user-btn').innerHTML = `<i class="fas fa-check-circle text-brand mr-2"></i>${userAddress.substring(0,6)}...${userAddress.slice(-4)}`;
        
        showSection('dashboard');
        await loadDashboard();
        showToast("Connecté avec succès !", "success");

    } catch (error) {
        console.error(error);
        showToast("Erreur de connexion: " + error.message, "error");
    } finally {
        showLoader(false);
    }
}

async function switchToPolygon() {
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x89' }], // 137 en hex
        });
    } catch (switchError) {
        // Si le réseau n'est pas ajouté
        if (switchError.code === 4902) {
            await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                    chainId: '0x89',
                    chainName: 'Polygon Mainnet',
                    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
                    rpcUrls: ['https://polygon-rpc.com/'],
                    blockExplorerUrls: ['https://polygonscan.com/'],
                }],
            });
        }
    }
}

function resetApp() {
    userAddress = null;
    document.getElementById('btn-connect').classList.remove('hidden');
    document.getElementById('user-btn').classList.add('hidden');
    showSection('welcome');
}

// =================================================================
// 4. DASHBOARD DATA
// =================================================================
async function loadDashboard() {
    if (!contract) return;
    try {
        // Prix FTA (ID 2)
        const price = await contract.getAssetPrice(2);
        document.getElementById('fta-price').innerText = parseFloat(ethers.utils.formatUnits(price, 8)).toFixed(2);

        // Soldes
        const balUsdt = await contract.internalBalances(userAddress, USDT_ADDRESS);
        const balFta = await contract.internalBalances(userAddress, FTA_ADDRESS);

        document.getElementById('bal-usdt').innerText = parseFloat(ethers.utils.formatUnits(balUsdt, 6)).toFixed(2);
        document.getElementById('bal-fta').innerText = parseFloat(ethers.utils.formatUnits(balFta, 8)).toFixed(4);

    } catch (e) { 
        console.error("Erreur chargement data", e); 
        showToast("Erreur de chargement des données", "error");
    }
}

// =================================================================
// 5. FONCTIONS TRANSACTIONS
// =================================================================

// Helper pour les transactions
async function runTransaction(callback, onSuccess) {
    if(!contract) return showToast("Veuillez connecter votre wallet", "error");
    
    showLoader(true);
    try {
        const tx = await callback();
        showToast("Transaction envoyée...", "info");
        await tx.wait();
        showToast("Transaction réussie !", "success");
        if(onSuccess) await onSuccess();
    } catch (err) {
        console.error(err);
        // Essayer d'extraire le message d'erreur lisible
        const msg = err.reason || err.message || "Transaction échouée";
        showToast(msg, "error");
    } finally {
        showLoader(false);
    }
}

// --- WALLET ---
async function deposit() {
    const token = document.getElementById('dep-token').value;
    const amount = document.getElementById('dep-amount').value;
    if(!amount) return showToast("Entrez un montant", "error");
    
    const addr = token === 'usdt' ? USDT_ADDRESS : FTA_ADDRESS;
    const dec = token === 'usdt' ? 6 : 8;

    await runTransaction(async () => {
        showToast("Approbation...", "info");
        const tokenContract = new ethers.Contract(addr, ["function approve(address,uint256)"], signer);
        let tx = await tokenContract.approve(CONTRACT_ADDRESS, ethers.utils.parseUnits(amount, dec));
        await tx.wait();
        
        return await contract.depositToWallet(addr, ethers.utils.parseUnits(amount, dec));
    }, loadDashboard);
}

async function withdraw() {
    const token = document.getElementById('wit-token').value;
    const amount = document.getElementById('wit-amount').value;
    if(!amount) return showToast("Entrez un montant", "error");

    const addr = token === 'usdt' ? USDT_ADDRESS : FTA_ADDRESS;
    const dec = token === 'usdt' ? 6 : 8;

    await runTransaction(async () => {
        return await contract.withdrawFromWallet(addr, ethers.utils.parseUnits(amount, dec));
    }, loadDashboard);
}

// --- MARKET ---
async function buyFTA() {
    const amount = document.getElementById('buy-amt').value;
    if(!amount) return showToast("Entrez un montant", "error");
    await runTransaction(async () => contract.buyFTA(ethers.utils.parseUnits(amount, 6)), loadDashboard);
}

async function sellFTA() {
    const amount = document.getElementById('sell-amt').value;
    if(!amount) return showToast("Entrez un montant", "error");
    await runTransaction(async () => contract.sellFTA(ethers.utils.parseUnits(amount, 8)), loadDashboard);
}

// --- MINING ---
async function buyMachine() {
    const type = document.getElementById('machine-type').value;
    await runTransaction(async () => contract.buyMachine(type), loadDashboard);
}

async function buyBattery() {
    const token = document.getElementById('bat-token').value;
    const pack = document.getElementById('bat-pack').value;
    if(!token) return showToast("Entrez l'ID de la machine", "error");
    await runTransaction(async () => contract.buyBattery(token, pack), loadDashboard);
}

// --- TRADING ---
async function openPosition(side) {
    const asset = document.getElementById('trade-asset').value;
    const margin = document.getElementById('trade-margin').value;
    const leverage = document.getElementById('trade-lev').value;
    
    if(!margin || !leverage) return showToast("Remplissez tous les champs", "error");
    await runTransaction(async () => contract.openPosition(asset, side, ethers.utils.parseUnits(margin, 6), leverage));
}

// --- GAMES ---
async function playAviator() {
    const bet = document.getElementById('aviator-bet').value;
    const mult = document.getElementById('aviator-mult').value;
    if(!bet || !mult) return showToast("Remplissez mise et multiplicateur", "error");
    await runTransaction(async () => contract.playAviator(ethers.utils.parseUnits(bet, 8), mult), loadDashboard);
}

// =================================================================
// 6. UTILITAIRES UI
// =================================================================
function showSection(id) {
    document.querySelectorAll('main > section').forEach(el => el.classList.add('hidden'));
    const section = document.getElementById('section-' + id);
    if (section) section.classList.remove('hidden');

    // Nav Active State
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active-nav');
        if(btn.getAttribute('data-section') === id) btn.classList.add('active-nav');
    });
    
    // Close mobile menu if open
    document.getElementById('mobile-menu').classList.add('hidden');
}

function toggleMobileMenu() {
    document.getElementById('mobile-menu').classList.toggle('hidden');
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    
    let bgColor = 'bg-gray-700'; // default
    if(type === 'success') bgColor = 'bg-green-600';
    if(type === 'error') bgColor = 'bg-red-600';
    if(type === 'info') bgColor = 'bg-blue-600';

    toast.className = `p-4 rounded-lg shadow-lg text-white text-sm font-medium mb-2 ${bgColor}`;
    toast.innerText = message;
    container.appendChild(toast);
    
    setTimeout(() => { toast.remove(); }, 5000);
}

function showLoader(show) {
    const loader = document.getElementById('global-loader');
    if(show) loader.classList.remove('hidden');
    else loader.classList.add('hidden');
}