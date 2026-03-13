// ================= CONFIGURATION =================
// REMPLACE CES ADRESSES PAR LES TIENNES SUR POLYGON
const CONTRACT_ADDRESS = "0x027579bd6302174b499970955EF534500Cd342Dd"; // Adresse du FitiaEcosystemHub
const USDT_ADDRESS = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"; // USDT sur Polygon
const FTA_ADDRESS = "0x535bBe393D64a60E14B731b7350675792d501623"; // Ton token FTA
const POLYGON_CHAIN_ID = '0x89'; // 137 en hexadécimal

// ABI Complet
const HUB_ABI = [
    "function depositToWallet(address _token, uint256 _amount) external",
    "function withdrawFromWallet(address _token, uint256 _amount) external",
    "function getMyBalance(address _token) view returns (uint256)",
    "function openPosition(uint8 _asset, uint8 _side, uint256 _marginUSDT, uint256 _leverage) external",
    "function closePosition(uint256 _posId) external",
    "function positionCount() view returns (uint256)",
    "function positions(uint256) view returns (address trader, uint8 asset, uint8 side, uint256 margin, uint256 leverage, uint256 entryPrice, bool isOpen)",
    "function getAssetPrice(uint8 _asset) view returns (uint256)",
    "function stake(uint256 _poolId, uint256 _amount) external",
    "function unstake(uint256 _poolId) external",
    "function playAviator(uint256 _ftaBetAmount, uint256 _targetMultiplier) external",
    "function depositCollateral(uint256 _usdtAmount) external",
    "function borrow(uint256 _ftaAmount) external",
    "function repayLoan() external"
];

const ERC20_ABI = [
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function allowance(address owner, address spender) view returns (uint256)"
];

// ================= VARIABLES GLOBALES =================
let provider, signer, contract, userAddress;
let currentTradeSide = 0; // 0 = Long, 1 = Short

// ================= DOM ELEMENTS =================
const el = {
    btnConnect: document.getElementById('btn-connect'),
    userInfo: document.getElementById('user-info'),
    walletAddress: document.getElementById('wallet-address'),
    loader: document.getElementById('loader'),
    loaderText: document.getElementById('loader-text'),
    
    balanceUsdt: document.getElementById('balance-usdt'),
    balanceFta: document.getElementById('balance-fta'),
    positionsList: document.getElementById('positions-list'),
    currentPrice: document.getElementById('current-price'),
    
    // Inputs
    walletAmount: document.getElementById('wallet-amount'),
    tradeMargin: document.getElementById('trade-margin'),
    tradeLev: document.getElementById('trade-lev'),
    levVal: document.getElementById('lev-val'),
    tradeAsset: document.getElementById('trade-asset'),
    aviatorBet: document.getElementById('aviator-bet'),
    aviatorTarget: document.getElementById('aviator-target'),
    stakePoolId: document.getElementById('stake-pool-id'),
    stakeAmount: document.getElementById('stake-amount'),
    lendCollat: document.getElementById('lend-collateral'),
    lendBorrow: document.getElementById('lend-borrow'),
};

// ================= UTILITAIRES =================
function showLoader(show, text = "Transaction en cours...") {
    if (show) {
        el.loaderText.innerText = text;
        el.loader.classList.remove('hidden');
    } else {
        el.loader.classList.add('hidden');
    }
}

function handleErr(e, msg = "Erreur") {
    console.error(e);
    alert(msg + ": " + (e.reason || e.message || "Inconnu"));
    showLoader(false);
}

// ================= NAVIGATION =================
function navigate(name) {
    document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    
    document.getElementById('section-' + name).classList.remove('hidden');
    document.getElementById('nav-' + name).classList.add('active');
    
    if (name === 'trading' && contract) {
        loadPrice(); 
        loadPositions();
    }
}

// ================= CONNEXION WALLET =================
async function connectWallet() {
    if (!window.ethereum) {
        alert("Aucun portefeuille détecté. Installez MetaMask, SafePal ou Trust Wallet.");
        return;
    }

    showLoader(true, "Connexion...");

    try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: POLYGON_CHAIN_ID }],
            });
        } catch (switchError) {
            if (switchError.code === 4902) {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: POLYGON_CHAIN_ID,
                        chainName: 'Polygon Mainnet',
                        nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
                        rpcUrls: ['https://polygon-rpc.com/'],
                        blockExplorerUrls: ['https://polygonscan.com/']
                    }]
                });
            } else {
                throw switchError;
            }
        }

        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
        userAddress = await signer.getAddress();
        
        contract = new ethers.Contract(CONTRACT_ADDRESS, HUB_ABI, signer);

        el.btnConnect.classList.add('hidden');
        el.userInfo.classList.remove('hidden');
        el.walletAddress.innerText = userAddress.substring(0, 6) + "..." + userAddress.substring(38);

        await loadBalances();

    } catch (e) {
        handleErr(e, "Connexion échouée");
    } finally {
        showLoader(false);
    }
}

// ================= CHARGEMENT DONNÉES =================
async function loadBalances() {
    if (!contract) return;
    try {
        const bUsdt = await contract.getMyBalance(USDT_ADDRESS);
        const bFta = await contract.getMyBalance(FTA_ADDRESS);
        
        el.balanceUsdt.innerText = parseFloat(ethers.formatUnits(bUsdt, 6)).toFixed(2);
        el.balanceFta.innerText = parseFloat(ethers.formatUnits(bFta, 18)).toFixed(2);
    } catch (e) {
        console.log("Erreur chargement soldes", e);
    }
}

async function loadPositions() {
    if (!contract) return;
    try {
        const count = await contract.positionCount();
        el.positionsList.innerHTML = '';
        
        const start = count > 10 ? count - 10n : 0n;
        
        for (let i = count - 1n; i >= start; i--) {
            const p = await contract.positions(i);
            if (p.isOpen && p.trader.toLowerCase() === userAddress.toLowerCase()) {
                const sideText = p.side === 0 ? "LONG" : "SHORT";
                const color = p.side === 0 ? "#22c55e" : "#ef4444";
                
                const div = document.createElement('div');
                div.style.cssText = "background: #0f172a; padding: 10px; margin-bottom: 8px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; border-left: 4px solid " + color;
                div.innerHTML = `
                    <div>
                        <div style="font-weight:bold; color:${color}">${sideText} x${p.leverage}</div>
                        <small style="color:#94a3b8">Marge: ${ethers.formatUnits(p.margin, 6)} USDT</small>
                    </div>
                    <button onclick="closePos(${i})" style="background:#334155; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Fermer</button>
                `;
                el.positionsList.appendChild(div);
            }
        }
        
        if (el.positionsList.innerHTML === '') {
            el.positionsList.innerHTML = '<p class="empty-msg">Aucune position ouverte.</p>';
        }
    } catch (e) {
        console.error(e);
    }
}

async function loadPrice() {
    if (!contract) return;
    try {
        const assetId = el.tradeAsset.value;
        const price = await contract.getAssetPrice(assetId); 
        const formattedPrice = ethers.formatUnits(price, 8);
        el.currentPrice.innerText = parseFloat(formattedPrice).toFixed(2) + " $";
    } catch (e) {
        console.log("Erreur prix", e);
    }
}

// ================= ACTIONS WALLET =================
async function approveToken(tokenAddr, amount, decimals) {
    const tokenContract = new ethers.Contract(tokenAddr, ERC20_ABI, signer);
    const allowance = await tokenContract.allowance(userAddress, CONTRACT_ADDRESS);
    
    if (allowance < amount) {
        showLoader(true, "Approbation requise...");
        const tx = await tokenContract.approve(CONTRACT_ADDRESS, amount);
        await tx.wait();
        showLoader(true, "Transaction en cours...");
    }
}

async function deposit() {
    if (!contract) return alert("Connectez-vous");
    const amt = el.walletAmount.value;
    if (!amt) return alert("Entrez un montant");
    
    showLoader(true, "Dépôt...");
    try {
        const wei = ethers.parseUnits(amt, 6);
        await approveToken(USDT_ADDRESS, wei, 6);
        
        const tx = await contract.depositToWallet(USDT_ADDRESS, wei);
        await tx.wait();
        
        alert("Dépôt réussi !");
        el.walletAmount.value = "";
        loadBalances();
    } catch (e) { handleErr(e); }
    showLoader(false);
}

async function withdraw() {
    if (!contract) return;
    const amt = el.walletAmount.value;
    if (!amt) return;
    
    showLoader(true, "Retrait...");
    try {
        const wei = ethers.parseUnits(amt, 6);
        const tx = await contract.withdrawFromWallet(USDT_ADDRESS, wei);
        await tx.wait();
        
        alert("Retrait réussi !");
        el.walletAmount.value = "";
        loadBalances();
    } catch (e) { handleErr(e); }
    showLoader(false);
}

// ================= TRADING LOGIC =================
function setTradeType(type) {
    currentTradeSide = type;
    const btnLong = document.getElementById('tab-long');
    const btnShort = document.getElementById('tab-short');
    const confirmBtn = document.getElementById('btn-confirm-trade');

    if (type === 0) {
        btnLong.classList.add('active-long');
        btnShort.classList.remove('active-short');
        confirmBtn.innerText = "Ouvrir Long";
        confirmBtn.style.background = "#22c55e";
        confirmBtn.classList.remove('short-active');
    } else {
        btnShort.classList.add('active-short');
        btnLong.classList.remove('active-long');
        confirmBtn.innerText = "Ouvrir Short";
        confirmBtn.style.background = "#ef4444";
        confirmBtn.classList.add('short-active');
    }
}

function changeLev(delta) {
    const slider = document.getElementById('trade-lev');
    let val = parseInt(slider.value) + delta;
    if (val < 1) val = 1;
    if (val > 50) val = 50;
    slider.value = val;
    updateLevDisplay();
}

function updateLevDisplay() {
    const val = document.getElementById('trade-lev').value;
    document.getElementById('lev-val').innerText = "x" + val;
    updateFeeDisplay();
}

function setMargin(amount) {
    document.getElementById('trade-margin').value = amount;
    updateFeeDisplay();
}

function updateFeeDisplay() {
    const margin = parseFloat(document.getElementById('trade-margin').value) || 0;
    const fee = margin * 0.001; 
    document.getElementById('fee-display').innerText = fee.toFixed(2) + " USDT";
}

async function confirmTrade() {
    if (!contract) return alert("Connectez-vous");
    
    const margin = el.tradeMargin.value;
    const lev = el.tradeLev.value;
    const asset = el.tradeAsset.value;
    
    if (!margin || margin <= 0) return alert("Entrez une marge valide");

    showLoader(true, "Ouverture de position...");
    try {
        const marginWei = ethers.parseUnits(margin, 6);
        const tx = await contract.openPosition(asset, currentTradeSide, marginWei, lev);
        await tx.wait();
        
        alert("Position ouverte avec succès !");
        loadPositions();
        loadBalances();
        el.tradeMargin.value = "";
        updateFeeDisplay();
    } catch (e) { handleErr(e); }
    showLoader(false);
}

window.closePos = async (id) => {
    showLoader(true, "Fermeture position...");
    try {
        const tx = await contract.closePosition(id);
        await tx.wait();
        alert("Position fermée");
        loadPositions();
        loadBalances();
    } catch(e) { handleErr(e); }
    showLoader(false);
};

// ================= AUTRES ACTIONS (Aviator, Staking, Lending) =================
// (J'ai condensé pour la clarté, mais tout est fonctionnel comme avant)

async function playAviator() {
    if (!contract) return;
    const bet = el.aviatorBet.value;
    const target = el.aviatorTarget.value;
    if (!bet || !target) return alert("Remplissez tous les champs");
    
    showLoader(true, "Jeu Aviator...");
    try {
        const betWei = ethers.parseUnits(bet, 18);
        await approveToken(FTA_ADDRESS, betWei, 18);
        
        const targetInt = Math.floor(parseFloat(target) * 100);
        const tx = await contract.playAviator(betWei, targetInt);
        await tx.wait();
        
        alert("Jeu terminé ! Vérifiez votre solde.");
        loadBalances();
    } catch(e) { handleErr(e); }
    showLoader(false);
}

async function stake() {
    if (!contract) return;
    const pid = el.stakePoolId.value;
    const amt = el.stakeAmount.value;
    if(!pid || !amt) return;
    showLoader(true, "Staking...");
    try {
        const wei = ethers.parseUnits(amt, 18);
        const tx = await contract.stake(pid, wei);
        await tx.wait();
        alert("Staké !");
        loadBalances();
    } catch(e) { handleErr(e); }
    showLoader(false);
}

async function unstake() {
    if (!contract) return;
    const pid = el.stakePoolId.value;
    if(!pid) return;
    showLoader(true, "Unstaking...");
    try {
        const tx = await contract.unstake(pid);
        await tx.wait();
        alert("Unstaké !");
        loadBalances();
    } catch(e) { handleErr(e); }
    showLoader(false);
}

async function depositCollateral() {
    if(!contract) return;
    const amt = el.lendCollat.value;
    if(!amt) return;
    showLoader(true, "Dépôt collatéral...");
    try {
        const wei = ethers.parseUnits(amt, 6);
        const tx = await contract.depositCollateral(wei);
        await tx.wait();
        alert("Collatéral déposé");
        loadBalances();
    } catch(e) { handleErr(e); }
    showLoader(false);
}

async function borrow() {
    if(!contract) return;
    const amt = el.lendBorrow.value;
    if(!amt) return;
    showLoader(true, "Emprunt...");
    try {
        const wei = ethers.parseUnits(amt, 18);
        const tx = await contract.borrow(wei);
        await tx.wait();
        alert("Emprunt réussi");
        loadBalances();
    } catch(e) { handleErr(e); }
    showLoader(false);
}

async function repay() {
    if(!contract) return;
    showLoader(true, "Remboursement...");
    try {
        const tx = await contract.repayLoan();
        await tx.wait();
        alert("Prêt remboursé");
        loadBalances();
    } catch(e) { handleErr(e); }
    showLoader(false);
}

// ================= EVENT LISTENERS =================
document.addEventListener('DOMContentLoaded', () => {
    // Nav
    document.getElementById('nav-wallet').addEventListener('click', () => navigate('wallet'));
    document.getElementById('nav-trading').addEventListener('click', () => navigate('trading'));
    document.getElementById('nav-aviator').addEventListener('click', () => navigate('aviator'));
    document.getElementById('nav-staking').addEventListener('click', () => navigate('staking'));
    document.getElementById('nav-lending').addEventListener('click', () => navigate('lending'));
    
    // Wallet
    el.btnConnect.addEventListener('click', connectWallet);
    document.getElementById('btn-deposit').addEventListener('click', deposit);
    document.getElementById('btn-withdraw').addEventListener('click', withdraw);
    
    // Trading
    document.getElementById('tab-long').addEventListener('click', () => setTradeType(0));
    document.getElementById('tab-short').addEventListener('click', () => setTradeType(1));
    document.getElementById('btn-lev-minus').addEventListener('click', () => changeLev(-1));
    document.getElementById('btn-lev-plus').addEventListener('click', () => changeLev(1));
    document.getElementById('btn-quick-10').addEventListener('click', () => setMargin(10));
    document.getElementById('btn-quick-50').addEventListener('click', () => setMargin(50));
    document.getElementById('btn-quick-100').addEventListener('click', () => setMargin(100));
    document.getElementById('btn-confirm-trade').addEventListener('click', confirmTrade);
    document.getElementById('btn-refresh-pos').addEventListener('click', loadPositions);
    el.tradeLev.addEventListener('input', updateLevDisplay);
    el.tradeMargin.addEventListener('input', updateFeeDisplay);
    el.tradeAsset.addEventListener('change', loadPrice);
    
    // Others
    document.getElementById('btn-play-aviator').addEventListener('click', playAviator);
    document.getElementById('btn-stake').addEventListener('click', stake);
    document.getElementById('btn-unstake').addEventListener('click', unstake);
    document.getElementById('btn-deposit-collat').addEventListener('click', depositCollateral);
    document.getElementById('btn-borrow').addEventListener('click', borrow);
    document.getElementById('btn-repay').addEventListener('click', repay);
    
    // Intervalle prix
    setInterval(() => {
        if (contract && !document.getElementById('section-trading').classList.contains('hidden')) {
            loadPrice();
        }
    }, 5000);
});