// ================= CONFIGURATION =================
const CHAIN_ID = '0x89'; // ID du réseau Polygon Mainnet (137 en hexadécimal)
const CONTRACT_ADDR = "0x027579bd6302174b499970955EF534500Cd342Dd"; // Remplace par ton adresse
const USDT_ADDR = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"; // USDT Officiel Polygon (PoS)
const FTA_ADDR = "0x535bBe393D64a60E14B731b7350675792d501623"; // Remplace par l'adresse de ton token

// ABI
const ERC20_ABI = [
    "function allowance(address owner, address spender) view returns (uint256)",
    "function approve(address spender, uint256 amount) returns (bool)"
];

const CONTRACT_ABI = [
    "function depositToWallet(address _token, uint256 _amount)",
    "function withdrawFromWallet(address _token, uint256 _amount)",
    "function getMyBalance(address _token) view returns (uint256)",
    "function openPosition(uint8 _asset, uint8 _side, uint256 _marginUSDT, uint256 _leverage)",
    "function playAviator(uint256 _ftaBetAmount, uint256 _targetMultiplier)",
    "function depositCollateral(uint256 _usdtAmount)",
    "function borrow(uint256 _ftaAmount)",
    "function repayLoan()",
    "function userLoans(address) view returns (uint256 collateralAmount, uint256 borrowedAmount, uint256 startTime, bool isActive)",
    "function stakingPools(uint256) view returns (address stakeToken, address rewardToken, uint256 apy, bool exists)"
];

let provider, signer, contract, userAddr;
let chartCreated = false; // Variable pour ne créer le graphique qu'une fois

// ================= CORE FUNCTIONS =================

async function connectWallet() {
    if (!window.ethereum) return toast("Installez Trust Wallet ou MetaMask", true);
    try {
        const accs = await window.ethereum.request({ method: 'eth_requestAccounts' });
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        contract = new ethers.Contract(CONTRACT_ADDR, CONTRACT_ABI, signer);
        userAddr = accs[0];
        
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: CHAIN_ID }] 
            });
        } catch(e) {
            toast("Passez sur le réseau Polygon", true);
            return;
        }

        updateUI();
        loadPools();
        // On ne charge pas le graphique ici, on attend que l'utilisateur clique sur Trade
        
    } catch(e) {
        console.error(e);
        toast("Erreur de connexion", true);
    }
}

function updateUI() {
    document.getElementById('btn-connect').style.display = 'none';
    document.getElementById('user-badge').style.display = 'flex';
    document.getElementById('user-addr').innerText = userAddr.substring(0,6) + "..." + userAddr.substring(38);
    loadBalances();
}

// ================= NAVIGATION =================
function switchPage(pageName) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-' + pageName).classList.add('active');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    event.currentTarget.classList.add('active');

    // CORRECTION BUG GRAPHIQUE : On charge le graphique seulement si on va sur Trade
    if(pageName === 'trade' && !chartCreated) {
        initTradingChart();
    }
}

// ================= WALLET LOGIQUE =================

async function checkAndApprove(tokenAddr, amountWei) {
    const tokenContract = new ethers.Contract(tokenAddr, ERC20_ABI, signer);
    const allowance = await tokenContract.allowance(userAddr, CONTRACT_ADDR);
    
    if (allowance.lt(amountWei)) {
        toast("Étape 1 : Veuillez confirmer l'autorisation dans votre Wallet...", false);
        try {
            const tx = await tokenContract.approve(CONTRACT_ADDR, amountWei);
            await tx.wait();
            toast("Autorisation validée !");
        } catch (e) {
            toast("Autorisation refusée", true);
            throw "Approval Failed";
        }
    }
}

async function depositToken(symbol) {
    const id = symbol === 'USDT' ? 'inp-usdt' : 'inp-fta';
    const addr = symbol === 'USDT' ? USDT_ADDR : FTA_ADDR;
    const dec = symbol === 'USDT' ? 6 : 18;
    const amt = document.getElementById(id).value;
    
    if(!amt || amt <= 0) return toast("Entrez un montant valide", true);

    try {
        const amountWei = ethers.utils.parseUnits(amt, dec);
        await checkAndApprove(addr, amountWei);
        
        toast("Étape 2 : Dépôt en cours...");
        const tx = await contract.depositToWallet(addr, amountWei);
        await tx.wait();
        
        toast("Dépôt réussi !");
        document.getElementById(id).value = ""; 
        loadBalances();
    } catch(e) { 
        console.error(e);
        if (e !== "Approval Failed") toast("Erreur de transaction", true);
    }
}

async function withdrawToken(symbol) {
    const id = symbol === 'USDT' ? 'inp-usdt' : 'inp-fta';
    const addr = symbol === 'USDT' ? USDT_ADDR : FTA_ADDR;
    const dec = symbol === 'USDT' ? 6 : 18;
    const amt = document.getElementById(id).value;
    
    if(!amt || amt <= 0) return toast("Entrez un montant valide", true);

    try {
        toast("Retrait en cours...");
        const tx = await contract.withdrawFromWallet(addr, ethers.utils.parseUnits(amt, dec));
        await tx.wait();
        toast("Retrait réussi !");
        document.getElementById(id).value = ""; 
        loadBalances();
    } catch(e) { 
        console.error(e);
        toast("Erreur de retrait", true); 
    }
}

async function loadBalances() {
    if(!contract) return;
    try {
        const uBal = await contract.getMyBalance(USDT_ADDR);
        const fBal = await contract.getMyBalance(FTA_ADDR);
        
        const usdt = parseFloat(ethers.utils.formatUnits(uBal, 6)).toFixed(2);
        const fta = parseFloat(ethers.utils.formatEther(fBal)).toFixed(2);
        
        document.getElementById('bal-usdt').innerText = usdt;
        document.getElementById('bal-usdt-home').innerText = usdt;
        document.getElementById('bal-fta').innerText = fta;
        document.getElementById('bal-fta-home').innerText = fta;
        
        const loan = await contract.userLoans(userAddr);
        document.getElementById('user-collat').innerText = ethers.utils.formatUnits(loan.collateralAmount, 6) + " USDT";
    } catch(e) { console.log("Erreur chargement soldes");}
}

// ================= TRADING GRAPHIQUE =================

function initTradingChart() {
    // Vérifie si la librairie est chargée
    if(typeof LightweightCharts === 'undefined') {
        console.error("Librairie graphique non chargée");
        return;
    }

    const container = document.getElementById('tv-chart-container');
    
    // Création du graphique
    const chart = LightweightCharts.createChart(container, {
        layout: { background: { type: 'solid', color: '#13161c' }, textColor: '#d1d4dc' },
        grid: { vertLines: { color: 'rgba(42, 46, 57, 0.5)' }, horzLines: { color: 'rgba(42, 46, 57, 0.5)' } },
        width: container.clientWidth,
        height: container.clientHeight,
    });

    const candleSeries = chart.addCandlestickSeries({
        upColor: '#00c853', downColor: '#ff1744',
        borderUpColor: '#00c853', borderDownColor: '#ff1744',
        wickUpColor: '#00c853', wickDownColor: '#ff1744'
    });

    // 1. Charger l'historique (Binance Futures API)
    fetch('https://fapi.binance.com/fapi/v1/klines?symbol=BTCUSDT&interval=1m&limit=50')
        .then(r => r.json())
        .then(data => {
            const candles = data.map(d => ({
                time: d[0] / 1000,
                open: parseFloat(d[1]),
                high: parseFloat(d[2]),
                low: parseFloat(d[3]),
                close: parseFloat(d[4])
            }));
            candleSeries.setData(candles);
            if(candles.length > 0) updatePriceUI(candles[candles.length-1].close);
        });

    // 2. Connexion WebSocket Temps Réel
    const ws = new WebSocket('wss://fstream.binance.com/ws/btcusdt@kline_1m');
    ws.onmessage = event => {
        const message = JSON.parse(event.data);
        const k = message.k;
        const candle = {
            time: k.t / 1000,
            open: parseFloat(k.o),
            high: parseFloat(k.h),
            low: parseFloat(k.l),
            close: parseFloat(k.c)
        };
        candleSeries.update(candle);
        updatePriceUI(candle.close);
    };
    
    chartCreated = true;
}

function updatePriceUI(price) {
    const el = document.getElementById('live-price');
    el.innerText = "$" + price.toFixed(2);
    const prev = parseFloat(el.getAttribute('data-price') || price);
    if (price > prev) el.style.color = '#00c853';
    else if (price < prev) el.style.color = '#ff1744';
    el.setAttribute('data-price', price);
}

function setLev(l) {
    document.getElementById('trade-lev').value = l;
    document.querySelectorAll('.leverage-btns button').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
}

async function openTrade(side) {
    const asset = document.getElementById('trade-asset').value;
    const margin = document.getElementById('trade-margin').value;
    const lev = document.getElementById('trade-lev').value;
    if(!margin) return toast("Entrez une marge", true);

    try {
        toast("Ouverture position...");
        const tx = await contract.openPosition(asset, side, ethers.utils.parseUnits(margin, 6), lev);
        await tx.wait();
        toast("Position ouverte !");
    } catch(e) { toast("Erreur Trade", true); }
}

// ================= LENDING =================
async function depositCollateral() {
    const amt = document.getElementById('inp-collat').value;
    if(!amt || amt <= 0) return toast("Entrez un montant", true);
    try {
        const amountWei = ethers.utils.parseUnits(amt, 6);
        await checkAndApprove(USDT_ADDR, amountWei);
        toast("Dépôt collatéral...");
        const tx = await contract.depositCollateral(amountWei);
        await tx.wait();
        toast("Collatéral ajouté");
        loadBalances();
    } catch(e) { toast("Erreur", true); }
}

async function borrowFTA() {
    const amt = document.getElementById('inp-borrow').value;
    if(!amt || amt <= 0) return toast("Entrez un montant", true);
    try {
        toast("Emprunt...");
        const tx = await contract.borrow(ethers.utils.parseEther(amt));
        await tx.wait();
        toast("Prêt reçu !");
        loadBalances();
    } catch(e) { toast("Erreur (Ratio insuffisant?)", true); }
}

async function repayLoan() {
    try {
        const loan = await contract.userLoans(userAddr);
        const debt = loan.borrowedAmount;
        await checkAndApprove(FTA_ADDR, debt);
        toast("Remboursement...");
        const tx = await contract.repayLoan();
        await tx.wait();
        toast("Prêt remboursé");
        loadBalances();
    } catch(e) { toast("Erreur Remboursement", true); }
}

// ================= STAKING =================
async function loadPools() {
    const list = document.getElementById('pools-list');
    if(!list) return;
    list.innerHTML = '';
    for(let i=0; i<4; i++) {
        try {
            const pool = await contract.stakingPools(i);
            if(pool.exists) {
                const div = document.createElement('div');
                div.className = 'info-card';
                div.innerHTML = `
                    <h4>Pool #${i} - APY: ${pool.apy}%</h4>
                    <p style="font-size:12px; color:var(--text-dim)">Stake & Earn</p>
                    <button class="full-btn primary" style="margin-top:10px" onclick="toast('Fonction Staking Active')">Staker</button>
                `;
                list.appendChild(div);
            }
        } catch(e) { break; }
    }
}

// ================= AVIATOR =================
async function playAviator() {
    const bet = document.getElementById('bet-amt').value;
    const target = document.getElementById('target-x').value;
    if(!bet || !target) return toast("Mise et cible requises", true);

    try {
        const amountWei = ethers.utils.parseEther(bet);
        await checkAndApprove(FTA_ADDR, amountWei);

        toast("Lancement...");
        startAnim();
        
        const targetFormatted = Math.floor(parseFloat(target) * 100);
        const tx = await contract.playAviator(amountWei, targetFormatted);
        await tx.wait();
        
        stopAnim();
        toast("Résultat reçu ! Vérifiez votre solde.");
        loadBalances();
    } catch(e) { 
        stopAnim(); 
        toast("Erreur ou Annulé", true); 
    }
}

let anim;
function startAnim() {
    const m = document.getElementById('multiplier');
    const p = document.getElementById('plane-icon');
    let x = 1.00;
    let pos = 0;
    anim = setInterval(() => {
        x += 0.02;
        pos += 1;
        m.innerText = x.toFixed(2) + "x";
        p.style.transform = `translate(${pos}px, ${-pos/2}px) rotate(-20deg)`;
    }, 50);
}
function stopAnim() { clearInterval(anim); }

// ================= UTILS =================
function toast(msg, isErr = false) {
    const t = document.getElementById('toast');
    t.innerText = msg;
    t.style.background = isErr ? '#ff1744' : '#fff';
    t.style.color = isErr ? '#fff' : '#000';
    t.style.display = 'block';
    setTimeout(() => t.style.display = 'none', 3500);
}