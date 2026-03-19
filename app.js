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
    "function playAviator(uint256,uint256)",
    "function claimMiningRewards(uint256)"
];

let provider, signer, contract, userAddress;

// ================= INITIALISATION =================
window.onload = function() {
    console.log("Fitia Pro Loaded.");
    document.querySelectorAll('.nav-item[data-section]').forEach(item => {
        item.addEventListener('click', (e) => {
            const section = e.currentTarget.dataset.section;
            if (section) showSection(section);
        });
    });
};

// ================= CONNEXION =================
async function connectWallet() {
    // 1. Nettoyer l'état précédent
    showLoader(false); 
    showLoader(true, "Connexion...");

    try {
        // 2. Vérifier Wallet
        if (!window.ethereum) throw new Error("Aucun wallet détecté.");
        if (typeof ethers === 'undefined') throw new Error("Erreur librairie.");

        provider = new ethers.providers.Web3Provider(window.ethereum);
        
        // 3. Vérifier Réseau Polygon
        const network = await provider.getNetwork();
        if (network.chainId !== POLYGON_CHAIN_ID) {
            showToast("Passage sur Polygon requis", "info");
            await switchToPolygon();
            // Après le switch, on arrête ici car la page va recharger ou l'utilisateur doit cliquer à nouveau.
            // On laisse le loader visible pour indiquer l'attente.
            return;
        }

        // 4. Connexion Compte
        await provider.send("eth_requestAccounts", []);
        
        signer = provider.getSigner();
        userAddress = await signer.getAddress();
        contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
        
        // 5. Succès - Masquer le loader AVANT d'afficher l'UI
        showLoader(false); 

        document.getElementById('connect-screen').classList.add('hidden');
        document.getElementById('app-screen').classList.remove('hidden');
        document.getElementById('user-address').innerText = userAddress.substring(0,6) + "..." + userAddress.slice(-4);
        
        showToast("Connecté !", "success");

        // 6. Charger les données
        loadDashboard();

    } catch (err) {
        showLoader(false); // Masquer le loader en cas d'erreur
        const msg = err.message.includes("user rejected") ? "Connexion refusée." : (err.reason || err.message);
        showToast(msg, "error");
    }
}

async function switchToPolygon() {
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: POLYGON_CHAIN_ID_HEX }],
        });
        // Souvent, le switch recharge pas la page sur Trust Wallet, on réessaie de connecter
        // Mais pour être sûr, on peut juste recharger.
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
                showToast("Impossible d'ajouter Polygon", "error");
            }
        } else {
            showLoader(false);
            showToast("Erreur réseau", "error");
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
    } catch (e) { 
        console.error("Erreur loadDashboard", e); 
    }
}

// ================= ACTIONS =================
async function runTx(callback, msg = "OK") {
    if (!contract) return showToast("Non connecté", "error");
    showLoader(true, "Transaction...");
    try {
        const tx = await callback();
        showToast("Confirmation...", "info");
        await tx.wait();
        showToast(msg, "success");
        loadDashboard();
    } catch (err) {
        showToast(err.reason || "Erreur", "error");
    } finally { showLoader(false); }
}

function deposit() { 
    const t = document.getElementById('dep-token').value, a = document.getElementById('dep-amount').value;
    if(!a) return; const addr = t==='usdt'?USDT_ADDRESS:FTA_ADDRESS; const d = t==='usdt'?6:8;
    runTx(async () => {
        const tk = new ethers.Contract(addr, ["function approve(address,uint256)"], signer);
        await (await tk.approve(CONTRACT_ADDRESS, ethers.utils.parseUnits(a, d))).wait();
        return await contract.depositToWallet(addr, ethers.utils.parseUnits(a, d));
    }, "Dépôt effectué");
}
function withdraw() { 
    const t = document.getElementById('wit-token').value, a = document.getElementById('wit-amount').value;
    if(!a) return; const addr = t==='usdt'?USDT_ADDRESS:FTA_ADDRESS; const d = t==='usdt'?6:8;
    runTx(() => contract.withdrawFromWallet(addr, ethers.utils.parseUnits(a, d)), "Retrait effectué");
}

function buyFTA() { const a = document.getElementById('buy-amt').value; if(!a) return; runTx(() => contract.buyFTA(ethers.utils.parseUnits(a, 6)), "Achat réussi"); }
function sellFTA() { const a = document.getElementById('sell-amt').value; if(!a) return; runTx(() => contract.sellFTA(ethers.utils.parseUnits(a, 8)), "Vente réussie"); }
function buyMachine() { runTx(() => contract.buyMachine(0), "Machine achetée"); }
function buyBattery() { const t = document.getElementById('bat-token').value; if(!t) return; runTx(() => contract.buyBattery(t, 0), "Batterie activée"); }
function claimMining() { const t = document.getElementById('bat-token').value; if(!t) return; runTx(() => contract.claimMiningRewards(t), "Récompenses réclamées"); }
function openPosition(s) { const a=document.getElementById('trade-asset').value,m=document.getElementById('trade-margin').value,l=document.getElementById('trade-lev').value; if(!m||!l) return; runTx(() => contract.openPosition(a, s, ethers.utils.parseUnits(m, 6), l), "Position ouverte"); }
function playAviator() { const b=document.getElementById('aviator-bet').value,m=document.getElementById('aviator-mult').value; if(!b||!m) return; runTx(() => contract.playAviator(ethers.utils.parseUnits(b, 8), m), "Jeu lancé"); }

// ================= UTILS =================
function showSection(id) {
    document.querySelectorAll('.app-section').forEach(el => el.classList.add('hidden'));
    document.getElementById('sec-' + id).classList.remove('hidden');
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    document.querySelector(`.nav-item[data-section="${id}"]`)?.classList.add('active');
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