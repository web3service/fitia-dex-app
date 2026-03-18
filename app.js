// Fichier app.js

// =================================================================
// 1. CONFIGURATION
// =================================================================
const CONTRACT_ADDRESS = "0xAfdFb346F819ffF3DdEF77e23E25a34E19c7Cab2"; // REMPLACEZ CECI
const USDT_ADDRESS = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"; 
const FTA_ADDRESS = "0x535bBe393D64a60E14B731b7350675792d501623"; // REMPLACEZ CECI
const POLYGON_CHAIN_ID = 137; // ID du réseau Polygon

// ABI Minimale (Remplacez par l'ABI complète de PolygonScan pour toutes les fonctions)
const ABI = [
    "function internalBalances(address,address) view returns(uint256)",
    "function depositToWallet(address,uint256)",
    "function withdrawFromWallet(address,uint256)",
    "function getAssetPrice(uint8) view returns(uint256)",
    "function buyFTA(uint256)",
    "function sellFTA(uint256)",
    "function openPosition(uint8,uint8,uint256,uint256)",
    "function buyMachine(uint256)",
    "function buyBattery(uint256,uint256)",
    "function playAviator(uint256,uint256)"
];

let provider, signer, contract, userAddress;

// ================= CONNEXION =================

// 1. Au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    // On attache les événements aux boutons de navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const section = e.currentTarget.dataset.section;
            if (section) showSection(section);
        });
    });

    // Vérification si MetaMask est là
    if (window.ethereum) {
        console.log("MetaMask détecté");
        // On essaie de se reconnecter automatiquement si l'utilisateur était connecté
        if (localStorage.getItem('connected') === 'true') {
            connectWallet();
        }
    } else {
        showToast("MetaMask non installé !", "error");
    }
});

// 2. Fonction principale de connexion
async function connectWallet() {
    showLoader(true, "Connexion en cours...");
    
    try {
        // A. Création du provider
        provider = new ethers.providers.Web3Provider(window.ethereum);
        
        // B. Vérification du réseau (Polygon ID: 137)
        const network = await provider.getNetwork();
        if (network.chainId !== 137) {
            showLoader(false);
            await switchToPolygon();
            return; // On arrête, la fonction switch va recharger la page ou rappeler la connexion
        }

        // C. Demande d'accès au compte
        await provider.send("eth_requestAccounts", []);
        
        // D. Initialisation
        signer = provider.getSigner();
        userAddress = await signer.getAddress();
        contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
        
        // E. Mise à jour de l'interface
        localStorage.setItem('connected', 'true');
        
        document.getElementById('connect-screen').classList.add('hidden');
        document.getElementById('app-screen').classList.remove('hidden');
        document.getElementById('user-address').innerText = userAddress.substring(0,6) + "..." + userAddress.slice(-4);
        
        await loadDashboard();
        showToast("Bienvenue !", "success");

    } catch (err) {
        console.error(err);
        showToast("Erreur : " + (err.reason || "Connexion refusée"), "error");
    } finally {
        showLoader(false);
    }
}

// 3. Fonction pour changer de réseau automatiquement
async function switchToPolygon() {
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x89' }], // 137 en Hex
        });
        // Si ça marche, on recharge
        window.location.reload();
    } catch (switchError) {
        // Si le réseau n'existe pas (code 4902), on l'ajoute
        if (switchError.code === 4902) {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: '0x89',
                        chainName: 'Polygon Mainnet',
                        nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
                        rpcUrls: ['https://polygon-rpc.com'],
                        blockExplorerUrls: ['https://polygonscan.com'],
                    }],
                });
                window.location.reload();
            } catch (addError) {
                showToast("Impossible d'ajouter Polygon", "error");
            }
        }
    }
}

// ================= DASHBOARD =================
async function loadDashboard() {
    if (!contract) return;
    try {
        const price = await contract.getAssetPrice(2); // FTA
        document.getElementById('fta-price').innerText = "$" + parseFloat(ethers.utils.formatUnits(price, 8)).toFixed(2);

        const balUsdt = await contract.internalBalances(userAddress, USDT_ADDRESS);
        document.getElementById('bal-usdt').innerText = parseFloat(ethers.utils.formatUnits(balUsdt, 6)).toFixed(2);

        const balFta = await contract.internalBalances(userAddress, FTA_ADDRESS);
        document.getElementById('bal-fta').innerText = parseFloat(ethers.utils.formatUnits(balFta, 8)).toFixed(2);

    } catch (e) { console.error("Erreur loadDashboard", e); }
}

// ================= ACTIONS =================

// Gestionnaire de transaction simplifié
async function runTx(callback, successMsg = "Succès !") {
    if (!contract) return showToast("Connectez votre wallet", "error");
    showLoader(true, "Transaction...");
    try {
        const tx = await callback();
        showToast("Confirmation...", "info");
        await tx.wait();
        showToast(successMsg, "success");
        loadDashboard();
    } catch (err) {
        showToast(err.reason || "Erreur", "error");
    } finally {
        showLoader(false);
    }
}

// WALLET
function deposit() {
    const tkn = document.getElementById('dep-token').value;
    const amt = document.getElementById('dep-amount').value;
    if(!amt) return;
    const addr = tkn === 'usdt' ? USDT_ADDRESS : FTA_ADDRESS;
    const dec = tkn === 'usdt' ? 6 : 8;
    runTx(async () => {
        const erc20 = new ethers.Contract(addr, ["function approve(address,uint256)"], signer);
        await (await erc20.approve(CONTRACT_ADDRESS, ethers.utils.parseUnits(amt, dec))).wait();
        return await contract.depositToWallet(addr, ethers.utils.parseUnits(amt, dec));
    }, "Dépôt effectué");
}

function withdraw() {
    const tkn = document.getElementById('wit-token').value;
    const amt = document.getElementById('wit-amount').value;
    if(!amt) return;
    const addr = tkn === 'usdt' ? USDT_ADDRESS : FTA_ADDRESS;
    const dec = tkn === 'usdt' ? 6 : 8;
    runTx(() => contract.withdrawFromWallet(addr, ethers.utils.parseUnits(amt, dec)), "Retrait effectué");
}

// MARKET
function buyFTA() {
    const amt = document.getElementById('buy-amt').value;
    if(!amt) return;
    runTx(() => contract.buyFTA(ethers.utils.parseUnits(amt, 6)), "Achat réussi");
}

function sellFTA() {
    const amt = document.getElementById('sell-amt').value;
    if(!amt) return;
    runTx(() => contract.sellFTA(ethers.utils.parseUnits(amt, 8)), "Vente réussie");
}

// MINING
function buyMachine() { runTx(() => contract.buyMachine(0), "Machine achetée !"); }
function buyBattery() {
    const tid = document.getElementById('bat-token').value;
    const pid = document.getElementById('bat-pack').value;
    if(!tid) return showToast("ID Machine requis", "error");
    runTx(() => contract.buyBattery(tid, pid), "Batterie activée !");
}

// TRADING
function openPosition(side) {
    const asset = document.getElementById('trade-asset').value;
    const margin = document.getElementById('trade-margin').value;
    const lev = document.getElementById('trade-lev').value;
    if(!margin || !lev) return showToast("Remplissez les champs", "error");
    runTx(() => contract.openPosition(asset, side, ethers.utils.parseUnits(margin, 6), lev), "Position ouverte");
}

// AVIATOR
function playAviator() {
    const bet = document.getElementById('aviator-bet').value;
    const mult = document.getElementById('aviator-mult').value;
    if(!bet || !mult) return;
    runTx(() => contract.playAviator(ethers.utils.parseUnits(bet, 8), mult), "Jeu lancé !");
}

// ================= UTILITAIRES =================

function showSection(id) {
    document.querySelectorAll('.app-section').forEach(el => el.classList.add('hidden'));
    document.getElementById('sec-' + id).classList.remove('hidden');
    
    // Update Nav Active
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('text-brand'));
    document.querySelector(`.nav-item[data-section="${id}"]`).classList.add('text-brand');
}

function showLoader(show, text = "Chargement") {
    const loader = document.getElementById('loader');
    const loaderText = document.getElementById('loader-text');
    if (show) {
        loader.classList.remove('hidden');
        loaderText.innerText = text;
    } else {
        loader.classList.add('hidden');
    }
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toast');
    const colors = { success: 'bg-green-500', error: 'bg-red-500', info: 'bg-blue-500' };
    const el = document.createElement('div');
    el.className = `p-3 rounded-lg text-white text-sm font-medium shadow-lg mb-2 ${colors[type]}`;
    el.innerText = message;
    container.appendChild(el);
    setTimeout(() => el.remove(), 4000);
}