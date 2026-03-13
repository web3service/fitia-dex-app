/**
 * FITIA ECOSYSTEM PRO - APPLICATION LOGIC
 * Version: 1.0.0
 * Developer: Modele Pro
 */

// ================= CONFIGURATION =================
// REMPLACE CES ADRESSES PAR LES TIENNES SUR POLYGON

const CONFIG = {
    CONTRACT_ADDR: "0x027579bd6302174b499970955EF534500Cd342Dd",
    USDT_ADDR: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    FTA_ADDR: "0x535bBe393D64a60E14B731b7350675792d501623",
    POLYGON_CHAIN_ID: "0x89", // 137
    EXPLORER: "https://polygonscan.com/tx/"
};

// ABI Simplifié et Optimisé
const ABI_HUB = [
    // Read
    "function getMyBalance(address _token) view returns (uint256)",
    "function positions(uint256) view returns (address trader, uint8 asset, uint8 side, uint256 margin, uint256 leverage, uint256 entryPrice, bool isOpen)",
    "function positionCount() view returns (uint256)",
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
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function allowance(address owner, address spender) view returns (uint256)"
];

// ================= STATE =================
let provider, signer, contract, userAddress;
let state = { leverage: 1, walletTab: 'deposit' };

// ================= UTILITIES =================
const $ = id => document.getElementById(id);
const toHex = str => ethers.toBeArray(str).length;

const showToast = (message, type = 'info') => {
    const container = $('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerText = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
};

const showLoader = (show, msg = "Chargement...") => {
    const loader = $('global-loader');
    const msgEl = $('loader-msg');
    if(show) {
        loader.classList.remove('hidden');
        msgEl.innerText = msg;
    } else {
        loader.classList.add('hidden');
    }
};

const formatAddr = addr => addr ? `${addr.substring(0, 6)}...${addr.substring(38)}` : '';

// ================= CORE BLOCKCHAIN =================

async function connectWallet() {
    if (!window.ethereum) return showToast("Installez MetaMask ou Trust Wallet", "error");
    
    showLoader(true, "Connexion au portefeuille...");
    
    try {
        // 1. Connexion Compte
        provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        signer = await provider.getSigner();
        userAddress = await signer.getAddress();
        
        // 2. Vérification Réseau Polygon
        const network = await provider.getNetwork();
        if (network.chainId !== 137) { // 137 = Polygon
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x89' }]
                });
            } catch (switchErr) {
                showToast("Veuillez basculer sur le réseau Polygon", "error");
                showLoader(false);
                return;
            }
        }

        // 3. Init Contrat
        contract = new ethers.Contract(CONFIG.CONTRACT_ADDR, ABI_HUB, signer);
        
        // 4. Mise à jour UI
        $('btn-connect').classList.add('hidden');
        $('user-pill').classList.remove('hidden');
        $('addr-short').innerText = formatAddr(userAddress);
        
        await loadBalances();
        showToast("Connecté avec succès", "success");

    } catch (err) {
        console.error(err);
        showToast("Erreur de connexion: " + err.message, "error");
    } finally {
        showLoader(false);
    }
}

async function loadBalances() {
    if (!contract) return;
    try {
        const bUsdt = await contract.getMyBalance(CONFIG.USDT_ADDR);
        const bFta = await contract.getMyBalance(CONFIG.FTA_ADDR);
        
        $('bal-usdt').innerText = parseFloat(ethers.formatUnits(bUsdt, 6)).toFixed(2);
        $('bal-fta').innerText = parseFloat(ethers.formatUnits(bFta, 18)).toFixed(2);
    } catch (e) {
        console.error("Erreur soldes", e);
    }
}

// ================= HELPERS TRANSACTION =================

async function checkAllowance(tokenAddr, amountWei) {
    const tokenContract = new ethers.Contract(tokenAddr, ABI_ERC20, signer);
    const allowance = await tokenContract.allowance(userAddress, CONFIG.CONTRACT_ADDR);
    
    if (allowance < amountWei) {
        showLoader(true, "Approbation requise (1/2)...");
        try {
            const tx = await tokenContract.approve(CONFIG.CONTRACT_ADDR, amountWei);
            await tx.wait();
            showToast("Approuvé !", "success");
        } catch (e) {
            throw new Error("Approbation refusée");
        }
    }
}

async function executeTx(promise, successMsg) {
    showLoader(true, "Transaction en cours...");
    try {
        const tx = await promise;
        showLoader(true, "Confirmation blockchain...");
        await tx.wait();
        showToast(successMsg, "success");
        return true;
    } catch (e) {
        const reason = e.reason || e.message;
        showToast(`Erreur: ${reason}`, "error");
        return false;
    } finally {
        showLoader(false);
    }
}

// ================= WALLET ACTIONS =================

window.switchWalletTab = (tab) => {
    state.walletTab = tab;
    const btns = document.querySelectorAll('.tab-min');
    btns.forEach(b => b.classList.remove('active'));
    
    if(tab === 'deposit') {
        btns[0].classList.add('active');
        $('btn-action-wallet').innerText = "Déposer des USDT";
        $('btn-action-wallet').onclick = depositUSDT;
    } else {
        btns[1].classList.add('active');
        $('btn-action-wallet').innerText = "Retirer des USDT";
        $('btn-action-wallet').onclick = withdrawUSDT;
    }
};

async function depositUSDT() {
    const amt = $('input-amount').value;
    if (!amt || amt <= 0) return showToast("Montant invalide", "error");
    
    const wei = ethers.parseUnits(amt, 6);
    
    showLoader(true, "Vérification...");
    try {
        await checkAllowance(CONFIG.USDT_ADDR, wei);
        const success = await executeTx(contract.depositToWallet(CONFIG.USDT_ADDR, wei), "Dépôt réussi !");
        if (success) {
            $('input-amount').value = "";
            loadBalances();
        }
    } catch (e) {
        showLoader(false);
        showToast(e.message, "error");
    }
}

async function withdrawUSDT() {
    const amt = $('input-amount').value;
    if (!amt || amt <= 0) return showToast("Montant invalide", "error");
    
    const wei = ethers.parseUnits(amt, 6);
    const success = await executeTx(contract.withdrawFromWallet(CONFIG.USDT_ADDR, wei), "Retrait réussi !");
    if (success) {
        $('input-amount').value = "";
        loadBalances();
    }
}

// ================= TRADING =================

window.adjustLev = (dir) => {
    state.leverage += dir;
    if (state.leverage < 1) state.leverage = 1;
    if (state.leverage > 50) state.leverage = 50;
    $('lev-display').innerText = state.leverage;
};

async function openPosition(side) {
    const margin = $('input-margin').value;
    const asset = $('select-asset').value; // 0, 1, 2
    
    if (!margin || margin <= 0) return showToast("Marge invalide", "error");
    
    const marginWei = ethers.parseUnits(margin, 6);
    
    // Contrat: openPosition(uint8 _asset, uint8 _side, uint256 _marginUSDT, uint256 _leverage)
    const success = await executeTx(
        contract.openPosition(asset, side, marginWei, state.leverage), 
        `Position ${side === 0 ? 'LONG' : 'SHORT'} ouverte !`
    );
    
    if (success) {
        $('input-margin').value = "";
        loadPositions();
        loadBalances();
    }
}

async function loadPositions() {
    if (!contract) return;
    const container = $('positions-container');
    container.innerHTML = '<div class="empty-state">Chargement...</div>';
    
    try {
        const count = await contract.positionCount();
        let html = '';
        
        // On boucle sur les 10 dernières positions
        const start = count > 10 ? count - 10n : 0n;
        
        for (let i = start; i < count; i++) {
            const p = await contract.positions(i);
            if (p.isOpen && p.trader.toLowerCase() === userAddress.toLowerCase()) {
                const sideText = p.side === 0 ? "LONG" : "SHORT";
                const color = p.side === 0 ? "var(--primary)" : "var(--danger)";
                const marginFmt = ethers.formatUnits(p.margin, 6);
                
                html += `
                    <div class="pos-item">
                        <div class="pos-meta">
                            <span class="type" style="color:${color}">${sideText} x${p.leverage} <small>Asset #${p.asset}</small></span>
                            <span class="amt">Marge: ${parseFloat(marginFmt).toFixed(2)} USDT</span>
                        </div>
                        <button class="btn-close-pos" onclick="closePos(${i})">Fermer</button>
                    </div>
                `;
            }
        }
        
        container.innerHTML = html || '<div class="empty-state">Aucune position ouverte.</div>';
        
    } catch (e) {
        container.innerHTML = '<div class="empty-state">Erreur de chargement.</div>';
    }
}

window.closePos = async (id) => {
    const success = await executeTx(contract.closePosition(id), "Position fermée !");
    if (success) {
        loadPositions();
        loadBalances();
    }
};

// ================= AVIATOR =================

async function playAviator() {
    const bet = $('aviator-bet').value;
    const target = $('aviator-target').value;
    
    if (!bet || !target) return showToast("Remplissez la mise et la cible", "error");
    
    const betWei = ethers.parseUnits(bet, 18);
    // La cible dans le contrat est x100 (ex: 2.0x -> 200)
    const targetInt = Math.floor(parseFloat(target) * 100);
    
    showLoader(true, "Vérification tokens...");
    try {
        await checkAllowance(CONFIG.FTA_ADDR, betWei);
        const success = await executeTx(contract.playAviator(betWei, targetInt), "Jeu terminé !");
        if (success) {
            loadBalances();
            // Animation simple
            $('aviator-result').innerText = "?";
            setTimeout(() => $('aviator-result').innerText = "Voir Solde", 1000);
        }
    } catch (e) {
        showLoader(false);
        showToast(e.message, "error");
    }
}

// ================= FINANCE (STAKE & LEND) =================

window.openFinTab = (tab) => {
    document.querySelectorAll('.tab-fin').forEach(b => b.classList.remove('active'));
    document.getElementById('fin-stake').classList.add('hidden');
    document.getElementById('fin-lend').classList.add('hidden');
    
    if(tab === 'stake') {
        document.querySelector('.tab-fin:first-child').classList.add('active');
        document.getElementById('fin-stake').classList.remove('hidden');
    } else {
        document.querySelector('.tab-fin:last-child').classList.add('active');
        document.getElementById('fin-lend').classList.remove('hidden');
    }
};

async function stakeTokens() {
    const id = $('stake-id').value;
    const amt = $('stake-amt').value;
    if(!id || !amt) return showToast("Remplissez tous les champs", "error");
    
    const wei = ethers.parseUnits(amt, 18); // Suppose 18 decimales
    const success = await executeTx(contract.stake(id, wei), "Staking réussi !");
    if (success) loadBalances();
}

async function unstakeTokens() {
    const id = $('stake-id').value;
    if(!id) return showToast("Entrez l'ID du pool", "error");
    
    const success = await executeTx(contract.unstake(id), "Unstake réussi !");
    if (success) loadBalances();
}

async function depositCollateral() {
    const amt = $('lend-coll').value;
    if(!amt) return;
    const wei = ethers.parseUnits(amt, 6);
    await checkAllowance(CONFIG.USDT_ADDR, wei);
    const success = await executeTx(contract.depositCollateral(wei), "Collatéral déposé !");
    if (success) loadBalances();
}

async function borrowTokens() {
    const amt = $('lend-borrow-amt').value;
    if(!amt) return;
    const wei = ethers.parseUnits(amt, 18);
    const success = await executeTx(contract.borrow(wei), "Emprunt effectué !");
    if (success) loadBalances();
}

// ================= NAVIGATION =================

window.navigate = (view) => {
    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    
    $(`view-${view}`).classList.remove('hidden');
    $(`nav-${view}`).classList.add('active');
    
    // Refresh data on navigation
    if (contract) {
        loadBalances();
        if (view === 'trading') loadPositions();
    }
};

// ================= INITIALIZATION =================

document.addEventListener('DOMContentLoaded', () => {
    // Remove Splash
    setTimeout(() => {
        $('splash-screen').style.opacity = '0';
        setTimeout(() => $('splash-screen').remove(), 500);
    }, 1500);

    // Event Listeners
    $('btn-connect').onclick = connectWallet;
    
    // Wallet
    $('btn-action-wallet').onclick = depositUSDT; // Default
    
    // Trading
    $('btn-long').onclick = () => openPosition(0);
    $('btn-short').onclick = () => openPosition(1);
    
    // Aviator
    $('btn-aviator').onclick = playAviator;
    
    // Finance
    $('btn-stake').onclick = stakeTokens;
    $('btn-unstake').onclick = unstakeTokens;
    $('btn-deposit-coll').onclick = depositCollateral;
    $('btn-borrow').onclick = borrowTokens;
    $('btn-repay').onclick = async () => {
        const success = await executeTx(contract.repayLoan(), "Prêt remboursé !");
        if(success) loadBalances();
    };
});