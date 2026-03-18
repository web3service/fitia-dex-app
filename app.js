// Fichier app.js

// =================================================================
// 1. CONFIGURATION
// =================================================================
const CONTRACT_ADDRESS = "0xAfdFb346F819ffF3DdEF77e23E25a34E19c7Cab2"; // REMPLACEZ CECI
const USDT_ADDRESS = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"; 
const FTA_ADDRESS = "0x535bBe393D64a60E14B731b7350675792d501623"; // REMPLACEZ CECI

const POLYGON_CHAIN_ID = 137;
const POLYGON_CHAIN_ID_HEX = '0x89';

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

// ================= INITIALISATION =================
// On attend que TOUT la page soit chargée (scripts inclus)
window.onload = function() {
    console.log("Page chargée.");
    
    // Configuration des boutons navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const section = e.currentTarget.dataset.section;
            if (section) showSection(section);
        });
    });
};

// ================= CONNEXION =================
async function connectWallet() {
    showLoader(true, "Connexion...");

    try {
        // 1. Vérifier Trust Wallet / MetaMask
        if (!window.ethereum) {
            throw new Error("Aucun wallet détecté. Ouvrez ce site dans l'application Trust Wallet.");
        }

        // 2. Vérifier Ethers.js
        if (typeof ethers === 'undefined') {
            throw new Error("Bibliothèque non chargée. Vérifiez votre connexion internet.");
        }

        // 3. Connexion
        provider = new ethers.providers.Web3Provider(window.ethereum);
        
        // 4. Vérifier Réseau
        const network = await provider.getNetwork();
        if (network.chainId !== POLYGON_CHAIN_ID) {
            showLoader(true, "Switch vers Polygon...");
            await switchToPolygon();
            return;
        }

        // 5. Demande compte
        await provider.send("eth_requestAccounts", []);
        
        signer = provider.getSigner();
        userAddress = await signer.getAddress();
        contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
        
        // 6. Succès
        document.getElementById('connect-screen').classList.add('hidden');
        document.getElementById('app-screen').classList.remove('hidden');
        document.getElementById('user-address').innerText = userAddress.substring(0,6) + "..." + userAddress.slice(-4);
        
        await loadDashboard();
        showToast("Connecté !", "success");

    } catch (err) {
        showLoader(false);
        // Message simple pour l'utilisateur
        const msg = err.message.includes("user rejected") ? "Connexion refusée dans le wallet." : (err.reason || err.message);
        showToast(msg, "error");
    }
}

async function switchToPolygon() {
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: POLYGON_CHAIN_ID_HEX }],
        });
        window.location.reload();
    } catch (switchError) {
        if (switchError.code === 4902) {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: POLYGON_CHAIN_ID_HEX,
                        chainName: 'Polygon Mainnet',
                        nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
                        rpcUrls: ['https://polygon-rpc.com'],
                        blockExplorerUrls: ['https://polygonscan.com'],
                    }],
                });
                window.location.reload();
            } catch (addError) {
                showLoader(false);
                showToast("Erreur ajout réseau", "error");
            }
        } else {
            showLoader(false);
            showToast("Veuillez sélectionner Polygon manuellement", "error");
        }
    }
}

// ================= DASHBOARD =================
async function loadDashboard() {
    if (!contract) return;
    try {
        const price = await contract.getAssetPrice(2); 
        document.getElementById('fta-price').innerText = "$" + parseFloat(ethers.utils.formatUnits(price, 8)).toFixed(2);

        const balUsdt = await contract.internalBalances(userAddress, USDT_ADDRESS);
        document.getElementById('bal-usdt').innerText = parseFloat(ethers.utils.formatUnits(balUsdt, 6)).toFixed(2);

        const balFta = await contract.internalBalances(userAddress, FTA_ADDRESS);
        document.getElementById('bal-fta').innerText = parseFloat(ethers.utils.formatUnits(balFta, 8)).toFixed(2);
    } catch (e) { console.error(e); }
}

// ================= ACTIONS =================
async function runTx(callback, msg = "OK") {
    if (!contract) return showToast("Non connecté", "error");
    showLoader(true, "Transaction...");
    try {
        const tx = await callback();
        showToast("En attente...", "info");
        await tx.wait();
        showToast(msg, "success");
        loadDashboard();
    } catch (err) {
        showToast(err.reason || "Erreur", "error");
    } finally { showLoader(false); }
}

function deposit() {
    const tkn = document.getElementById('dep-token').value;
    const amt = document.getElementById('dep-amount').value;
    if(!amt) return;
    const addr = tkn === 'usdt' ? USDT_ADDRESS : FTA_ADDRESS;
    const dec = tkn === 'usdt' ? 6 : 8;
    runTx(async () => {
        const tk = new ethers.Contract(addr, ["function approve(address,uint256)"], signer);
        await (await tk.approve(CONTRACT_ADDRESS, ethers.utils.parseUnits(amt, dec))).wait();
        return await contract.depositToWallet(addr, ethers.utils.parseUnits(amt, dec));
    }, "Dépôt validé");
}

function withdraw() {
    const tkn = document.getElementById('wit-token').value;
    const amt = document.getElementById('wit-amount').value;
    if(!amt) return;
    const addr = tkn === 'usdt' ? USDT_ADDRESS : FTA_ADDRESS;
    const dec = tkn === 'usdt' ? 6 : 8;
    runTx(() => contract.withdrawFromWallet(addr, ethers.utils.parseUnits(amt, dec)), "Retrait validé");
}

function buyFTA() { const amt = document.getElementById('buy-amt').value; if(!amt) return; runTx(() => contract.buyFTA(ethers.utils.parseUnits(amt, 6)), "Achat validé"); }
function sellFTA() { const amt = document.getElementById('sell-amt').value; if(!amt) return; runTx(() => contract.sellFTA(ethers.utils.parseUnits(amt, 8)), "Vente validée"); }
function buyMachine() { runTx(() => contract.buyMachine(0), "Machine achetée"); }
function buyBattery() { const t = document.getElementById('bat-token').value; if(!t) return; runTx(() => contract.buyBattery(t, 0), "Batterie activée"); }
function openPosition(side) { const a=document.getElementById('trade-asset').value,m=document.getElementById('trade-margin').value,l=document.getElementById('trade-lev').value; if(!m||!l) return; runTx(() => contract.openPosition(a, side, ethers.utils.parseUnits(m, 6), l), "Position ouverte"); }
function playAviator() { const b=document.getElementById('aviator-bet').value,m=document.getElementById('aviator-mult').value; if(!b||!m) return; runTx(() => contract.playAviator(ethers.utils.parseUnits(b, 8), m), "Jeu lancé"); }

// ================= UTILS =================
function showSection(id) {
    document.querySelectorAll('.app-section').forEach(el => el.classList.add('hidden'));
    document.getElementById('sec-' + id).classList.remove('hidden');
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('text-brand'));
    document.querySelector(`.nav-item[data-section="${id}"]`).classList.add('text-brand');
}

function showLoader(show, text = "Chargement") {
    const l = document.getElementById('loader'); const t = document.getElementById('loader-text');
    if (show) { l.classList.remove('hidden'); t.innerText = text; } else { l.classList.add('hidden'); }
}

function showToast(message, type = 'info') {
    const c = document.getElementById('toast'); 
    const cl = { success: 'bg-green-500', error: 'bg-red-500', info: 'bg-blue-500' };
    const el = document.createElement('div');
    el.className = `p-3 rounded-lg text-white text-sm font-medium shadow-lg mb-2 ${cl[type]}`;
    el.innerText = message; c.appendChild(el); setTimeout(() => el.remove(), 4000);
}