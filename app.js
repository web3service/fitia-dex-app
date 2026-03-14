// ================= CONFIGURATION =================
const CONTRACT_ADDR = "0x027579bd6302174b499970955EF534500Cd342Dd";
const USDT_ADDR = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"; // Polygon USDT
const FTA_ADDR = "0x535bBe393D64a60E14B731b7350675792d501623";

const ABI = [
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

// ================= CORE FUNCTIONS =================

async function connectWallet() {
    if (!window.ethereum) return toast("Installez Trust Wallet ou MetaMask", true);
    try {
        const accs = await window.ethereum.request({ method: 'eth_requestAccounts' });
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        contract = new ethers.Contract(CONTRACT_ADDR, ABI, signer);
        userAddr = accs[0];
        
        // Force Polygon Network
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x89' }] // Polygon
            });
        } catch(e) {
            toast("Passez sur le réseau Polygon", true);
            return;
        }

        updateUI();
        loadPools();
        initChart();
        
    } catch(e) {
        console.error(e);
        toast("Erreur de connexion", true);
    }
}

function updateUI() {
    // Header Button
    document.getElementById('btn-connect').style.display = 'none';
    document.getElementById('user-badge').style.display = 'flex';
    document.getElementById('user-addr').innerText = userAddr.substring(0,6) + "..." + userAddr.substring(38);
    
    loadBalances();
}

// ================= NAVIGATION =================
function switchPage(pageName) {
    // Hide all
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    // Show one
    document.getElementById('page-' + pageName).classList.add('active');
    
    // Update Menu
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    // Find button that calls this page and activate it
    event.currentTarget.classList.add('active');
}

// ================= WALLET =================
async function loadBalances() {
    if(!contract) return;
    const uBal = await contract.getMyBalance(USDT_ADDR);
    const fBal = await contract.getMyBalance(FTA_ADDR);
    
    const usdt = parseFloat(ethers.utils.formatUnits(uBal, 6)).toFixed(2);
    const fta = parseFloat(ethers.utils.formatEther(fBal)).toFixed(2);
    
    document.getElementById('bal-usdt').innerText = usdt;
    document.getElementById('bal-usdt-home').innerText = usdt;
    document.getElementById('bal-fta').innerText = fta;
    document.getElementById('bal-fta-home').innerText = fta;
    
    // Loan Info
    const loan = await contract.userLoans(userAddr);
    document.getElementById('user-collat').innerText = ethers.utils.formatUnits(loan.collateralAmount, 6) + " USDT";
}

async function depositToken(symbol) {
    const id = symbol === 'USDT' ? 'inp-usdt' : 'inp-fta';
    const addr = symbol === 'USDT' ? USDT_ADDR : FTA_ADDR;
    const dec = symbol === 'USDT' ? 6 : 18;
    const amt = document.getElementById(id).value;
    if(!amt) return toast("Entrez un montant", true);

    try {
        toast("Approbation...");
        const token = new ethers.Contract(addr, ["function approve(address,uint256)"], signer);
        let tx = await token.approve(CONTRACT_ADDR, ethers.utils.parseUnits(amt, dec));
        await tx.wait();
        
        toast("Dépôt...");
        tx = await contract.depositToWallet(addr, ethers.utils.parseUnits(amt, dec));
        await tx.wait();
        
        toast("Dépôt réussi !");
        loadBalances();
    } catch(e) { toast("Erreur", true); }
}

async function withdrawToken(symbol) {
    const id = symbol === 'USDT' ? 'inp-usdt' : 'inp-fta';
    const addr = symbol === 'USDT' ? USDT_ADDR : FTA_ADDR;
    const dec = symbol === 'USDT' ? 6 : 18;
    const amt = document.getElementById(id).value;
    if(!amt) return toast("Entrez un montant", true);

    try {
        toast("Retrait...");
        const tx = await contract.withdrawFromWallet(addr, ethers.utils.parseUnits(amt, dec));
        await tx.wait();
        toast("Retrait réussi !");
        loadBalances();
    } catch(e) { toast("Erreur", true); }
}

// ================= TRADING =================
const ctx = document.getElementById('priceChart').getContext('2d');
let chartData = [];
const chart = new Chart(ctx, {
    type: 'line',
    data: { labels: [], datasets: [{ data: [], borderColor: '#f0b90b', borderWidth: 2, fill: false, tension: 0.4, pointRadius: 0 }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } } }
});

function initChart() {
    setInterval(async () => {
        try {
            const res = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
            const data = await res.json();
            const price = parseFloat(data.price);
            document.getElementById('live-price').innerText = "$" + price.toFixed(2);
            
            if (chartData.length > 20) chartData.shift();
            chartData.push(price);
            chart.data.datasets[0].data = chartData;
            chart.update('none');
        } catch(e) {}
    }, 2000);
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
        const token = new ethers.Contract(USDT_ADDR, ["function approve(address,uint256)"], signer);
        toast("Approve...");
        let tx = await token.approve(CONTRACT_ADDR, ethers.utils.parseUnits(amt, 6));
        await tx.wait();
        
        toast("Dépôt...");
        tx = await contract.depositCollateral(ethers.utils.parseUnits(amt, 6));
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
    } catch(e) { toast("Erreur (Ratio insuffisant?)", true); }
}

async function repayLoan() {
    try {
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
    list.innerHTML = '';
    for(let i=0; i<4; i++) {
        try {
            const pool = await contract.stakingPools(i);
            if(pool.exists) {
                const div = document.createElement('div');
                div.className = 'info-card';
                div.innerHTML = `
                    <h4>Pool #${i} - APY: ${pool.apy}%</h4>
                    <p style="font-size:12px; color:var(--text-dim)">Earn Rewards</p>
                    <button class="full-btn primary" style="margin-top:10px" onclick="toast('Use Wallet to Stake')">Staker</button>
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
        // Approve
        const token = new ethers.Contract(FTA_ADDR, ["function approve(address,uint256)"], signer);
        toast("Approbation...");
        let tx = await token.approve(CONTRACT_ADDR, ethers.utils.parseEther(bet));
        await tx.wait();

        toast("Lancement...");
        startAnim();
        
        const targetFormatted = Math.floor(parseFloat(target) * 100);
        tx = await contract.playAviator(ethers.utils.parseEther(bet), targetFormatted);
        await tx.wait();
        
        stopAnim();
        toast("Résultat reçu !");
        loadBalances();
    } catch(e) { 
        stopAnim(); 
        toast("Erreur", true); 
    }
}

// Animation
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
    setTimeout(() => t.style.display = 'none', 3000);
}