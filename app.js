// ================= CONFIGURATION =================
const CHAIN_ID = '0x89'; // ID du réseau Polygon Mainnet (137 en hexadécimal)
const CONTRACT_ADDR = "0x027579bd6302174b499970955EF534500Cd342Dd"; // Remplace par ton adresse
const USDT_ADDR = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"; // USDT Officiel Polygon (PoS)
const FTA_ADDR = "0x535bBe393D64a60E14B731b7350675792d501623"; // Remplace par l'adresse de ton token

// ABI - J'AI AJOUTÉ L'ÉVÉNEMENT AviatorResolved

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
    "function stakingPools(uint256) view returns (address stakeToken, address rewardToken, uint256 apy, bool exists)",
    "event AviatorResolved(address indexed player, bool won, uint256 payout, uint256 crashPoint)"
];

let provider, signer, contract, userAddr;
let chart = null;
let candleSeries = null;
let activeWs = null;
let chartCreated = false;

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

    if(pageName === 'trade') {
        setTimeout(() => {
            if(!chartCreated) initTradingChart('BTCUSDT');
        }, 100);
    }
}

// ================= WALLET LOGIQUE =================

async function checkAndApprove(tokenAddr, amountWei) {
    const tokenContract = new ethers.Contract(tokenAddr, ERC20_ABI, signer);
    const allowance = await tokenContract.allowance(userAddr, CONTRACT_ADDR);
    
    if (allowance.lt(amountWei)) {
        toast("Étape 1 : Confirmez l'autorisation...", false);
        try {
            const tx = await tokenContract.approve(CONTRACT_ADDR, amountWei);
            await tx.wait();
            toast("Autorisation OK !");
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
    
    if(!amt || amt <= 0) return toast("Montant invalide", true);

    try {
        const amountWei = ethers.utils.parseUnits(amt, dec);
        await checkAndApprove(addr, amountWei);
        
        toast("Dépôt en cours...");
        const tx = await contract.depositToWallet(addr, amountWei);
        await tx.wait();
        
        toast("Dépôt réussi !");
        document.getElementById(id).value = ""; 
        loadBalances();
    } catch(e) { 
        console.error(e);
        if (e !== "Approval Failed") toast("Erreur", true);
    }
}

async function withdrawToken(symbol) {
    const id = symbol === 'USDT' ? 'inp-usdt' : 'inp-fta';
    const addr = symbol === 'USDT' ? USDT_ADDR : FTA_ADDR;
    const dec = symbol === 'USDT' ? 6 : 18;
    const amt = document.getElementById(id).value;
    
    if(!amt || amt <= 0) return toast("Montant invalide", true);

    try {
        toast("Retrait...");
        const tx = await contract.withdrawFromWallet(addr, ethers.utils.parseUnits(amt, dec));
        await tx.wait();
        toast("Retrait réussi !");
        document.getElementById(id).value = ""; 
        loadBalances();
    } catch(e) { 
        toast("Erreur retrait", true); 
    }
}

async function loadBalances() {
    if(!contract) return;
    try {
        const uBal = await contract.getMyBalance(USDT_ADDR);
        const fBal = await contract.getMyBalance(FTA_ADDR);
        
        document.getElementById('bal-usdt').innerText = parseFloat(ethers.utils.formatUnits(uBal, 6)).toFixed(2);
        document.getElementById('bal-usdt-home').innerText = parseFloat(ethers.utils.formatUnits(uBal, 6)).toFixed(2);
        document.getElementById('bal-fta').innerText = parseFloat(ethers.utils.formatEther(fBal)).toFixed(2);
        document.getElementById('bal-fta-home').innerText = parseFloat(ethers.utils.formatEther(fBal)).toFixed(2);
        
        const loan = await contract.userLoans(userAddr);
        document.getElementById('user-collat').innerText = ethers.utils.formatUnits(loan.collateralAmount, 6) + " USDT";
    } catch(e) {}
}

// ================= TRADING =================

function changeTradingAsset(val) {
    let symbol = 'BTCUSDT';
    let name = 'BTC/USDT';
    if(val == 1) { symbol = 'ETHUSDT'; name = 'ETH/USDT'; }
    document.getElementById('pair-name-display').innerText = name;
    loadChartData(symbol);
}

function initTradingChart(symbol = 'BTCUSDT') {
    const container = document.getElementById('tv-chart-container');
    if (!container || typeof LightweightCharts === 'undefined') return;

    if(!chart) {
        chart = LightweightCharts.createChart(container, {
            layout: { background: { type: 'solid', color: '#13161c' }, textColor: '#d1d4dc' },
            grid: { vertLines: { color: 'rgba(42, 46, 57, 0.5)' }, horzLines: { color: 'rgba(42, 46, 57, 0.5)' } },
            width: container.clientWidth,
            height: container.clientHeight,
            timeScale: { timeVisible: true, secondsVisible: false }
        });
        candleSeries = chart.addCandlestickSeries({
            upColor: '#00c853', downColor: '#ff1744',
            borderUpColor: '#00c853', borderDownColor: '#ff1744',
            wickUpColor: '#00c853', wickDownColor: '#ff1744'
        });
        chartCreated = true;
    }
    loadChartData(symbol);
}

function loadChartData(symbol) {
    if(!candleSeries) return;
    if(activeWs) activeWs.close();

    fetch(`https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&interval=1m&limit=50`)
        .then(r => r.json())
        .then(data => {
            const candles = data.map(d => ({
                time: d[0] / 1000, open: parseFloat(d[1]), high: parseFloat(d[2]),
                low: parseFloat(d[3]), close: parseFloat(d[4])
            }));
            candleSeries.setData(candles);
            if(candles.length > 0) updatePriceUI(candles[candles.length-1].close);
        });

    activeWs = new WebSocket(`wss://fstream.binance.com/ws/${symbol.toLowerCase()}@kline_1m`);
    activeWs.onmessage = event => {
        const k = JSON.parse(event.data).k;
        candleSeries.update({ time: k.t / 1000, open: parseFloat(k.o), high: parseFloat(k.h), low: parseFloat(k.l), close: parseFloat(k.c) });
        updatePriceUI(parseFloat(k.c));
    };
}

function updatePriceUI(price) {
    const el = document.getElementById('live-price');
    el.innerText = "$" + price.toFixed(2);
    const prev = parseFloat(el.getAttribute('data-price') || price);
    el.style.color = price > prev ? '#00c853' : (price < prev ? '#ff1744' : '#fff');
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
        toast("Ouverture...");
        const tx = await contract.openPosition(asset, side, ethers.utils.parseUnits(margin, 6), lev);
        await tx.wait();
        toast("Position ouverte !");
    } catch(e) { toast("Erreur Trade", true); }
}

// ================= LENDING =================
async function depositCollateral() {
    const amt = document.getElementById('inp-collat').value;
    if(!amt) return;
    try {
        const amountWei = ethers.utils.parseUnits(amt, 6);
        await checkAndApprove(USDT_ADDR, amountWei);
        toast("Dépôt...");
        const tx = await contract.depositCollateral(amountWei);
        await tx.wait();
        toast("Collatéral ajouté");
        loadBalances();
    } catch(e) { toast("Erreur", true); }
}

async function borrowFTA() {
    const amt = document.getElementById('inp-borrow').value;
    if(!amt) return;
    try {
        toast("Emprunt...");
        const tx = await contract.borrow(ethers.utils.parseEther(amt));
        await tx.wait();
        toast("Prêt reçu !");
        loadBalances();
    } catch(e) { toast("Erreur Ratio", true); }
}

async function repayLoan() {
    try {
        const loan = await contract.userLoans(userAddr);
        await checkAndApprove(FTA_ADDR, loan.borrowedAmount);
        toast("Remboursement...");
        const tx = await contract.repayLoan();
        await tx.wait();
        toast("Prêt remboursé");
        loadBalances();
    } catch(e) { toast("Erreur", true); }
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
                div.innerHTML = `<h4>Pool #${i} - APY: ${pool.apy}%</h4><p style="font-size:12px; color:var(--text-dim)">Stake & Earn</p><button class="full-btn primary" style="margin-top:10px">Staker</button>`;
                list.appendChild(div);
            }
        } catch(e) { break; }
    }
}

// ================= AVIATOR (LOGIQUE CORRIGEE) =================

async function playAviator() {
    const bet = document.getElementById('bet-amt').value;
    const target = document.getElementById('target-x').value;
    
    if(!bet || !target) return toast("Mise et cible requises", true);

    const btn = document.getElementById('aviator-btn');
    const multiText = document.getElementById('multiplier');
    const plane = document.getElementById('plane-icon');
    const bg = document.getElementById('aviator-bg');

    try {
        // 1. Préparation
        const amountWei = ethers.utils.parseEther(bet);
        await checkAndApprove(FTA_ADDR, amountWei);
        
        // 2. Reset UI
        btn.disabled = true;
        multiText.className = "multiplier";
        bg.className = "sky-bg";
        plane.className = "plane";
        multiText.innerText = "0.00x";
        
        toast("Lancement...");

        // 3. Envoi Transaction
        const targetFormatted = Math.floor(parseFloat(target) * 100);
        const tx = await contract.playAviator(amountWei, targetFormatted);
        
        // 4. Attente
        toast("Vol en cours...", false);
        const receipt = await tx.wait();
        
        // 5. Lecture du résultat (Event)
        let crashPoint = 0;
        let won = false;
        let payoutVal = 0;
        
        for(let event of receipt.events) {
            if(event.event === 'AviatorResolved') {
                won = event.args.won;
                crashPoint = event.args.crashPoint;
                payoutVal = event.args.payout;
                break;
            }
        }

        if(crashPoint == 0) {
            toast("Erreur lecture résultat", true);
            btn.disabled = false;
            return;
        }

        // 6. Animation jusqu'au crash
        // crashPoint est uint256 dans l'event. Ton contrat emit crashPoint / 1e18.
        // Donc crashPoint est un entier (ex: 250 pour 2.50x).
        await animateResult(crashPoint, parseFloat(target));

        // 7. Affichage final
        if(won) {
            toast("GAGNÉ ! + " + ethers.utils.formatEther(payoutVal) + " FTA", false);
            multiText.classList.add("win");
        } else {
            toast("CRASH ! Perdu", true);
            multiText.classList.add("lose");
            bg.classList.add("crash");
            plane.classList.add("crash");
        }

        loadBalances();
        btn.disabled = false;

    } catch(e) { 
        console.error(e);
        toast("Erreur ou Annulé", true);
        btn.disabled = false;
        document.getElementById('multiplier').innerText = "ERREUR";
    }
}

function animateResult(targetCrash, userTarget) {
    return new Promise(resolve => {
        const el = document.getElementById('multiplier');
        const plane = document.getElementById('plane-icon');
        
        let current = 1.00;
        // CrashPoint est un entier (ex: 250 pour 2.50x).
        // Si le contrat emit crashPoint (uint), ethers nous donne un BigNumber.
        // On le convertit en nombre JS.
        let endValue = parseFloat(ethers.utils.formatUnits(targetCrash, 0)); 
        // formatUnits avec 0 décimales convertit le BigNumber 250 -> chaine "250" -> float 250.
        // On divise par 100 pour avoir 2.50.
        let end = endValue / 100.0;

        // Sécurité si crash à 0 (ne devrait pas arriver)
        if(end < 1.00) end = 1.00;

        const interval = setInterval(() => {
            current += 0.05; // Incrément vitesse
            
            if(current >= end) {
                current = end;
                clearInterval(interval);
                resolve();
            }

            el.innerText = current.toFixed(2) + "x";
            
            let x = (current * 20) - 80;
            let y = -(current * 15) + 50;
            plane.style.transform = `translate(${x}px, ${y}px) rotate(-20deg)`;

            // Si on dépasse la cible utilisateur -> Vert (Gagnant potentiel)
            if(current >= userTarget) {
                el.classList.add("win");
            }

        }, 50);
    });
}

// ================= UTILS =================
function toast(msg, isErr = false) {
    const t = document.getElementById('toast');
    t.innerText = msg;
    t.style.background = isErr ? '#ff1744' : '#fff';
    t.style.color = isErr ? '#fff' : '#000';
    t.style.display = 'block';
    setTimeout(() => t.style.display = 'none', 3000);
}