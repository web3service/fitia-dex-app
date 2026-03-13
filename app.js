/**
 * FITIA ECOSYSTEM PRO - LOGIC
 * Connecté au contrat FitiaEcosystemHub
 */

// Configuration (REMPLACE AVEC TES ADRESSES)
const ADDR = {
    HUB: "0x027579bd6302174b499970955EF534500Cd342Dd", // Adresse du contrat déployé
    USDT: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", // USDT Polygon
    FTA: "0x535bBe393D64a60E14B731b7350675792d501623", // Adresse de ton token FTA
};

const CHAIN = { ID: "0x89", NAME: "Polygon" }; // Polygon Mainnet

// ABI Minimaliste optimisé pour le frontend
const ABI_HUB = [
    // View
    "function getMyBalance(address _token) view returns (uint256)",
    "function positions(uint256) view returns (address trader, uint8 asset, uint8 side, uint256 margin, uint256 leverage, uint256 entryPrice, bool isOpen)",
    "function positionCount() view returns (uint256)",
    "function getAssetPrice(uint8 _asset) view returns (uint256)",
    
    // Write
    "function depositToWallet(address _token, uint256 _amount) external",
    "function withdrawFromWallet(address _token, uint256 _amount) external",
    
    "function openPosition(uint8 _asset, uint8 _side, uint256 _marginUSDT, uint256 _leverage) external",
    "function closePosition(uint256 _posId) external",
    
    "function playAviator(uint256 _ftaBetAmount, uint256 _targetMultiplier) external",
    
    "function stake(uint256 _poolId, uint256 _amount) external",
    "function unstake(uint256 _poolId) external",
    
    "function depositCollateral(uint256 _usdtAmount) external",
    "function borrow(uint256 _ftaAmount) external",
    "function repayLoan() external"
];

const ABI_ERC20 = [
    "function approve(address spender, uint256 amount) external returns (bool)"
];

// State
let provider, signer, contract, user;
let state = { lev: 1, walletMode: 'deposit', finMode: 'stake' };

// DOM Helpers
const $ = id => document.getElementById(id);
const hide = id => $(id).classList.add('hidden');
const show = id => $(id).classList.remove('hidden');

// Notifications
const toast = (msg, type = 'info') => {
    const c = $('toasts');
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.innerText = msg;
    c.appendChild(el);
    setTimeout(() => el.remove(), 4000);
};

// Loader
const load = (show, msg = "Chargement...") => {
    if (show) { $('loader-text').innerText = msg; show('loader'); }
    else hide('loader');
};

// Initialisation
window.addEventListener('load', () => {
    setTimeout(() => {
        $('splash').style.opacity = '0';
        setTimeout(() => $('splash').remove(), 500);
    }, 1500);
});

// Navigation
window.nav = (id) => {
    document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    
    $(`sec-${id}`).classList.remove('hidden');
    $(`n-${id}`).classList.add('active');
    
    if (user) refreshData(id);
};

// Connexion Wallet
async function connect() {
    if (!window.ethereum) return toast("Installez MetaMask ou Trust Wallet", "error");
    
    load(true, "Connexion...");
    try {
        provider = new ethers.BrowserProvider(window.ethereum);
        
        // Switch Network
        try {
            await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: CHAIN.ID }] });
        } catch {
            toast("Veuillez switcher sur " + CHAIN.NAME, "error");
            load(false); return;
        }

        await provider.send("eth_requestAccounts", []);
        signer = await provider.getSigner();
        user = await signer.getAddress();
        
        contract = new ethers.Contract(ADDR.HUB, ABI_HUB, signer);
        
        // UI Update
        hide('btn-connect');
        show('btn-profile');
        $('addr-display').innerText = user.substring(0,6) + "..." + user.substring(38);
        
        refreshData('wallet');
        toast("Connecté avec succès", "success");
    } catch(e) {
        console.error(e);
        toast("Erreur de connexion", "error");
    }
    load(false);
}
 $('btn-connect').onclick = connect;

// Rafraîchir les données
async function refreshData(sec) {
    try {
        // Balances
        const bU = await contract.getMyBalance(ADDR.USDT);
        const bF = await contract.getMyBalance(ADDR.FTA);
        $('bal-usdt').innerText = parseFloat(ethers.formatUnits(bU, 6)).toFixed(2);
        $('bal-fta').innerText = parseFloat(ethers.formatUnits(bF, 18)).toFixed(2);

        if (sec === 'trade') {
            updatePrice();
            loadPositions();
        }
    } catch(e) {
        console.log("Erreur refresh", e);
    }
}

// ================= WALLET LOGIC =================
window.setWalletMode = (mode) => {
    state.walletMode = mode;
    document.querySelectorAll('.tab-w').forEach(t => t.classList.remove('active'));
    
    if (mode === 'deposit') {
        document.querySelector('.tab-w:first-child').classList.add('active');
        $('btn-wallet-action').innerText = "Déposer sur le Wallet Interne";
    } else {
        document.querySelector('.tab-w:last-child').classList.add('active');
        $('btn-wallet-action').innerText = "Retirer vers mon Wallet";
    }
};

window.walletAction = async () => {
    const amt = $('wallet-amount').value;
    const tkn = $('wallet-token').value;
    
    if (!amt || amt <= 0) return toast("Montant invalide", "error");
    
    const addr = tkn === 'usdt' ? ADDR.USDT : ADDR.FTA;
    const dec = tkn === 'usdt' ? 6 : 18;
    const wei = ethers.parseUnits(amt, dec);
    
    load(true, "Transaction en cours...");

    try {
        if (state.walletMode === 'deposit') {
            // 1. Approve
            load(true, "Approbation (1/2)...");
            const erc20 = new ethers.Contract(addr, ABI_ERC20, signer);
            const appTx = await erc20.approve(ADDR.HUB, wei);
            await appTx.wait();
            
            // 2. Deposit
            load(true, "Dépôt (2/2)...");
            const tx = await contract.depositToWallet(addr, wei);
            await tx.wait();
            toast("Dépôt réussi !", "success");
        } else {
            const tx = await contract.withdrawFromWallet(addr, wei);
            await tx.wait();
            toast("Retrait réussi !", "success");
        }
        
        $('wallet-amount').value = "";
        refreshData('wallet');
    } catch(e) {
        console.error(e);
        toast("Erreur: " + (e.reason || "Transaction annulée"), "error");
    }
    load(false);
};

// ================= TRADING LOGIC =================
window.adjLev = (d) => {
    state.lev += d;
    if (state.lev < 1) state.lev = 1;
    if (state.lev > 50) state.lev = 50;
    $('lev-val').innerText = "x" + state.lev;
};

window.updatePrice = async () => {
    try {
        const assetId = $('trade-asset').value;
        const price = await contract.getAssetPrice(assetId);
        // Price is 8 decimals (Chainlink standard)
        const fmt = parseFloat(ethers.formatUnits(price, 8));
        
        $('live-price').innerText = "$" + fmt.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    } catch(e) {
        console.log("Prix non disponible");
    }
};

window.openTrade = async (side) => {
    const margin = $('trade-margin').value;
    const asset = $('trade-asset').value;
    
    if (!margin || margin <= 0) return toast("Marge invalide", "error");
    
    const marginWei = ethers.parseUnits(margin, 6);
    
    load(true, "Ouverture de position...");
    try {
        const tx = await contract.openPosition(asset, side, marginWei, state.lev);
        await tx.wait();
        toast("Position ouverte !", "success");
        $('trade-margin').value = "";
        refreshData('trade');
    } catch(e) {
        toast("Erreur Trade: " + (e.reason || ""), "error");
    }
    load(false);
};

async function loadPositions() {
    const cont = $('pos-container');
    cont.innerHTML = "";
    
    try {
        const count = await contract.positionCount();
        let html = "";
        
        // Check last 20 positions
        const start = count > 20 ? count - 20 : 0;
        
        for (let i = start; i < count; i++) {
            const p = await contract.positions(i);
            if (p.isOpen && p.trader.toLowerCase() === user.toLowerCase()) {
                const sideT = p.side === 0 ? "LONG" : "SHORT";
                const color = p.side === 0 ? "var(--accent)" : "var(--danger)";
                const marg = parseFloat(ethers.formatUnits(p.margin, 6)).toFixed(2);
                
                html += `
                    <div class="pos-item">
                        <div class="pos-meta">
                            <span class="type" style="color:${color}">${sideT} x${p.leverage} <small>Asset #${p.asset}</small></span>
                            <span class="amt">Marge: ${marg} USDT</span>
                        </div>
                        <button class="btn-close" onclick="closePos(${i})">Fermer</button>
                    </div>
                `;
            }
        }
        cont.innerHTML = html || '<div class="empty">Aucune position ouverte.</div>';
    } catch(e) {
        console.error(e);
    }
}

window.closePos = async (id) => {
    load(true, "Fermeture...");
    try {
        const tx = await contract.closePosition(id);
        await tx.wait();
        toast("Position fermée", "success");
        refreshData('trade');
    } catch(e) {
        toast("Erreur fermeture", "error");
    }
    load(false);
};

// ================= AVIATOR LOGIC =================
window.playAviator = async () => {
    const bet = $('avi-bet').value;
    const target = $('avi-target').value;
    
    if (!bet || !target) return toast("Remplissez tous les champs", "error");
    
    const betWei = ethers.parseUnits(bet, 18);
    const targetInt = Math.floor(parseFloat(target) * 100);
    
    load(true, "Jeu en cours...");
    try {
        // Le contrat utilise internalBalances, pas besoin de approve ici si déjà déposé
        const tx = await contract.playAviator(betWei, targetInt);
        await tx.wait();
        
        toast("Jeu terminé ! Vérifiez votre solde FTA.", "success");
        $('avi-bet').value = "";
        refreshData('wallet');
    } catch(e) {
        toast("Erreur Jeu: " + (e.reason || ""), "error");
    }
    load(false);
};

// ================= FINANCE LOGIC =================
window.setFinMode = (mode) => {
    state.finMode = mode;
    document.querySelectorAll('.tab-fin').forEach(t => t.classList.remove('active'));
    
    if (mode === 'stake') {
        document.querySelector('.tab-fin:first-child').classList.add('active');
        show('fin-stake');
        hide('fin-lend');
    } else {
        document.querySelector('.tab-fin:last-child').classList.add('active');
        hide('fin-stake');
        show('fin-lend');
    }
};

window.stakeAction = async (isStake) => {
    const id = $('stake-id').value;
    const amt = $('stake-amt').value;
    
    if (id === "" || !amt) return toast("Remplissez ID et Montant", "error");
    
    const wei = ethers.parseUnits(amt, 18); // Supposé 18 decimales pour tokens stake
    
    load(true, "Staking...");
    try {
        let tx;
        if (isStake) tx = await contract.stake(id, wei);
        else tx = await contract.unstake(id);
        
        await tx.wait();
        toast(isStake ? "Staké !" : "Unstaké !", "success");
        refreshData('wallet');
    } catch(e) {
        toast("Erreur Staking", "error");
    }
    load(false);
};

window.lendAction = async (type) => {
    load(true, "Transaction Lending...");
    try {
        let tx;
        if (type === 'coll') {
            const amt = $('lend-coll').value;
            if (!amt) return;
            const wei = ethers.parseUnits(amt, 6);
            tx = await contract.depositCollateral(wei);
        } else if (type === 'borrow') {
            const amt = $('lend-borrow').value;
            if (!amt) return;
            const wei = ethers.parseUnits(amt, 18);
            tx = await contract.borrow(wei);
        } else { // repay
            tx = await contract.repayLoan();
        }
        
        await tx.wait();
        toast("Opération réussie", "success");
        refreshData('wallet');
    } catch(e) {
        toast("Erreur Lending: " + (e.reason || ""), "error");
    }
    load(false);
};