// Fichier app.js

// =================================================================
// 1. CONFIGURATION
// =================================================================
const CONTRACT_ADDRESS = "0xAfdFb346F819ffF3DdEF77e23E25a34E19c7Cab2"; // REMPLACEZ CECI
const USDT_ADDRESS = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"; 
const FTA_ADDRESS = "0x535bBe393D64a60E14B731b7350675792d501623"; // REMPLACEZ CECI

const POLYGON_CHAIN_ID = 137;
const POLYGON_CHAIN_ID_HEX = '0x89';

// ABI COMPLET (Remplacez par l'ABI complète de PolygonScan pour être sûr)
const ABI = [
    // Views
    "function internalBalances(address,address) view returns(uint256)",
    "function getAssetPrice(uint8) view returns(uint256)",
    "function positions(uint256) view returns(address,uint8,uint8,uint256,uint256,uint256,bool)",
    "function calculatePnL(tuple(address,uint8,uint8,uint256,uint256,uint256,bool),uint256) pure returns(int256)",
    // Wallet
    "function depositToWallet(address,uint256)",
    "function withdrawFromWallet(address,uint256)",
    // Market
    "function buyFTA(uint256)",
    "function sellFTA(uint256)",
    // Mining
    "function buyMachine(uint256)",
    "function buyBattery(uint256,uint256)",
    "function claimMiningRewards(uint256)",
    // Trading
    "function openPosition(uint8,uint8,uint256,uint256)",
    "function closePosition(uint256)",
    "function liquidatePosition(uint256)",
    // Farming
    "function addLiquidity(uint256,uint256)",
    "function removeLiquidity(uint256)",
    "function claimFarmRewards()",
    // Staking
    "function stake(uint256,uint256)",
    "function unstake(uint256)",
    // Lending
    "function depositCollateral(uint256)",
    "function borrow(uint256)",
    "function repayLoan()",
    // Games
    "function playAviator(uint256,uint256)",
    // Governance
    "function createProposal(string)",
    "function vote(uint256,bool)"
];

let provider, signer, contract, userAddress;

// ================= INITIALISATION =================
window.onload = function() {
    // Navigation
    document.querySelectorAll('.nav-item[data-section]').forEach(item => {
        item.addEventListener('click', (e) => {
            const section = e.currentTarget.dataset.section;
            if (section) showSection(section);
            document.getElementById('more-menu').classList.add('hidden'); // Ferme le menu
        });
    });
};

// ================= CONNEXION =================
async function connectWallet() {
    showLoader(true, "Connexion...");
    try {
        if (!window.ethereum) throw new Error("Pas de wallet détecté.");
        if (typeof ethers === 'undefined') throw new Error("Erreur de chargement.");

        provider = new ethers.providers.Web3Provider(window.ethereum);
        
        const network = await provider.getNetwork();
        if (network.chainId !== POLYGON_CHAIN_ID) {
            showLoader(true, "Switch Polygon...");
            await switchToPolygon();
            return;
        }

        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        userAddress = await signer.getAddress();
        contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
        
        document.getElementById('connect-screen').classList.add('hidden');
        document.getElementById('app-screen').classList.remove('hidden');
        document.getElementById('user-address').innerText = userAddress.substring(0,6) + "..." + userAddress.slice(-4);
        
        loadDashboard(); // Non bloquant
        showToast("Connecté !", "success");
    } catch (err) {
        showLoader(false);
        showToast(err.reason || err.message, "error");
    }
}

async function switchToPolygon() {
    try {
        await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: POLYGON_CHAIN_ID_HEX }] });
    } catch (switchError) {
        if (switchError.code === 4902) {
            await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{ chainId: POLYGON_CHAIN_ID_HEX, chainName: 'Polygon', nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 }, rpcUrls: ['https://polygon-rpc.com'], blockExplorerUrls: ['https://polygonscan.com'] }],
            });
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

// ================= ACTIONS GLOBALES =================
async function runTx(callback, msg = "Succès") {
    if (!contract) return showToast("Non connecté", "error");
    showLoader(true, "Transaction...");
    try {
        const tx = await callback();
        showToast("En attente confirmation...", "info");
        await tx.wait();
        showToast(msg, "success");
        loadDashboard();
    } catch (err) {
        showToast(err.reason || "Erreur", "error");
    } finally { showLoader(false); }
}

// ================= FONCTIONS SPECIFIQUES =================

// Wallet
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

// Market
function buyFTA() { const a = document.getElementById('buy-amt').value; if(!a) return; runTx(() => contract.buyFTA(ethers.utils.parseUnits(a, 6)), "Achat réussi"); }
function sellFTA() { const a = document.getElementById('sell-amt').value; if(!a) return; runTx(() => contract.sellFTA(ethers.utils.parseUnits(a, 8)), "Vente réussie"); }

// Mining
function buyMachine() { runTx(() => contract.buyMachine(0), "Machine achetée"); }
function buyBattery() { const t = document.getElementById('bat-token').value; if(!t) return; runTx(() => contract.buyBattery(t, 0), "Batterie activée"); }
function claimMining() { const t = document.getElementById('bat-token').value; if(!t) return; runTx(() => contract.claimMiningRewards(t), "Récompenses réclamées"); }

// Trading
function openPosition(s) { const a=document.getElementById('trade-asset').value,m=document.getElementById('trade-margin').value,l=document.getElementById('trade-lev').value; if(!m||!l) return; runTx(() => contract.openPosition(a, s, ethers.utils.parseUnits(m, 6), l), "Position ouverte"); }
function closePosition() { const p = document.getElementById('pos-id').value; if(!p) return; runTx(() => contract.closePosition(p), "Position fermée"); }
function liquidatePosition() { const p = document.getElementById('pos-id').value; if(!p) return; runTx(() => contract.liquidatePosition(p), "Position liquidée"); }

// Farming
function addLiquidity() { const u=document.getElementById('farm-usdt').value,f=document.getElementById('farm-fta').value; if(!u||!f) return; runTx(() => contract.addLiquidity(ethers.utils.parseUnits(u, 6), ethers.utils.parseUnits(f, 8)), "Liquidité ajoutée"); }
function removeLiquidity() { const l=document.getElementById('rmv-lp').value; if(!l) return; runTx(() => contract.removeLiquidity(ethers.utils.parseUnits(l, 18)), "Liquidité retirée"); }
function claimFarmRewards() { runTx(() => contract.claimFarmRewards(), "Récompenses farming réclamées"); }

// Staking
function stakeTokens() { const p=document.getElementById('stake-pool').value,a=document.getElementById('stake-amt').value; if(!p||!a) return; runTx(() => contract.stake(p, ethers.utils.parseUnits(a, 18)), "Tokens stakés"); } // Note: décimales à adapter
function unstakeTokens() { const p=document.getElementById('stake-pool').value; if(!p) return; runTx(() => contract.unstake(p), "Tokens unstakés"); }

// Lending
function depositCollateral() { const a=document.getElementById('lend-coll').value; if(!a) return; runTx(() => contract.depositCollateral(ethers.utils.parseUnits(a, 6)), "Collatéral déposé"); }
function borrow() { const a=document.getElementById('lend-borrow').value; if(!a) return; runTx(() => contract.borrow(ethers.utils.parseUnits(a, 8)), "Emprunt effectué"); }
function repayLoan() { runTx(() => contract.repayLoan(), "Prêt remboursé"); }

// Games
function playAviator() { const b=document.getElementById('aviator-bet').value,m=document.getElementById('aviator-mult').value; if(!b||!m) return; runTx(() => contract.playAviator(ethers.utils.parseUnits(b, 8), m), "Jeu lancé"); }

// Governance
function createProposal() { const d = document.getElementById('gov-desc').value; if(!d) return; runTx(() => contract.createProposal(d), "Proposition créée"); }
function vote(support) { const id = document.getElementById('gov-id').value; if(!id) return; runTx(() => contract.vote(id, support), "Vote enregistré"); }

// ================= UTILITAIRES =================
function showSection(id) {
    document.querySelectorAll('.app-section').forEach(el => el.classList.add('hidden'));
    document.getElementById('sec-' + id).classList.remove('hidden');
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    document.querySelector(`.nav-item[data-section="${id}"]`)?.classList.add('active');
}

function toggleMoreMenu() {
    document.getElementById('more-menu').classList.toggle('hidden');
}

function showLoader(show, text = "Chargement") {
    const l = document.getElementById('loader'), t = document.getElementById('loader-text');
    if (show) { l.classList.remove('hidden'); t.innerText = text; } else { l.classList.add('hidden'); }
}

function showToast(message, type = 'info') {
    const c = document.getElementById('toast'); 
    const cl = { success: 'bg-green-500', error: 'bg-red-500', info: 'bg-blue-500' };
    const el = document.createElement('div');
    el.className = `p-3 rounded-lg text-white text-sm font-medium shadow-lg mb-2 ${cl[type]}`;
    el.innerText = message; c.appendChild(el); setTimeout(() => el.remove(), 4000);
}