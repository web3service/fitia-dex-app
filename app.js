// ==========================================
// CONFIGURATION
// ==========================================
const CONTRACT_ADDRESS = "0x027579bd6302174b499970955EF534500Cd342Dd"; // REMPLACE CECI
const USDT_ADDRESS = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"; 
const FTA_ADDRESS = "0x535bBe393D64a60E14B731b7350675792d501623"; // REMPLACE CECI

// ABI Simplifié (Pour le Lending, inclure userLoans)
const CONTRACT_ABI = [
    "function depositToWallet(address _token, uint256 _amount)",
    "function withdrawFromWallet(address _token, uint256 _amount)",
    "function getMyBalance(address _token) view returns (uint256)",
    
    // Trading
    "function openPosition(uint8 _asset, uint8 _side, uint256 _marginUSDT, uint256 _leverage)",
    
    // Lending
    "function depositCollateral(uint256 _usdtAmount)",
    "function borrow(uint256 _ftaAmount)",
    "function repayLoan()",
    "function userLoans(address) view returns (uint256 collateralAmount, uint256 borrowedAmount, uint256 startTime, bool isActive)",
    
    // Staking & Aviator
    "function stake(uint256 _poolId, uint256 _amount)",
    "function unstake(uint256 _poolId)",
    "function stakingPools(uint256) view returns (address stakeToken, address rewardToken, uint256 apy, bool exists)",
    "function playAviator(uint256 _ftaBetAmount, uint256 _targetMultiplier)"
];

let provider, signer, contract, userAddress;

// ==========================================
// CONNEXION
// ==========================================
document.getElementById('btn-connect').addEventListener('click', async () => {
    if (window.ethereum) {
        try {
            await ethereum.request({ method: 'eth_requestAccounts' });
            provider = new ethers.providers.Web3Provider(ethereum);
            signer = provider.getSigner();
            contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
            userAddress = await signer.getAddress();
            
            // UI
            document.getElementById('btn-connect').style.display = 'none';
            document.getElementById('user-info').style.display = 'block';
            document.getElementById('user-address').innerText = userAddress.substring(0,6) + "..." + userAddress.substring(38);
            
            await switchNetwork();
            loadBalances();
            loadLoanInfo(); // Charge info prêt
            loadPools();
            startPriceFeed();
        } catch (e) { console.error(e); }
    } else { alert("Installe MetaMask"); }
});

async function switchNetwork() {
    try { await ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x89' }] }); } 
    catch (e) { console.log("Erreur réseau"); }
}

// ==========================================
// WALLET
// ==========================================
async function loadBalances() {
    try {
        const bU = await contract.getMyBalance(USDT_ADDRESS);
        document.getElementById('bal-usdt').innerText = parseFloat(ethers.utils.formatUnits(bU, 6)).toFixed(2);
        
        const bF = await contract.getMyBalance(FTA_ADDRESS);
        document.getElementById('bal-fta').innerText = parseFloat(ethers.utils.formatEther(bF)).toFixed(2);
    } catch(e) { console.log("Erreur loadBal", e); }
}

async function depositToken(symbol) {
    const id = symbol === 'USDT' ? 'input-usdt-amount' : 'input-fta-amount';
    const address = symbol === 'USDT' ? USDT_ADDRESS : FTA_ADDRESS;
    const dec = symbol === 'USDT' ? 6 : 18;
    const amt = document.getElementById(id).value;
    if(!amt) return;

    try {
        showNotif("Approbation...", "info");
        const erc20 = new ethers.Contract(address, ["function approve(address spender, uint256 amount)"], signer);
        const tx1 = await erc20.approve(CONTRACT_ADDRESS, ethers.utils.parseUnits(amt, dec));
        await tx1.wait();

        showNotif("Dépôt...", "info");
        const tx2 = await contract.depositToWallet(address, ethers.utils.parseUnits(amt, dec));
        await tx2.wait();
        
        showNotif("Dépôt confirmé!", "success");
        loadBalances();
    } catch(e) { showNotif("Erreur", "error"); console.error(e); }
}

async function withdrawToken(symbol) {
    // Même logique inverse...
    // Pour l'exemple, je simplifie, mais tu dois coder le retrait similaire au dépôt
}

// ==========================================
// LENDING
// ==========================================
async function loadLoanInfo() {
    try {
        const loan = await contract.userLoans(userAddress);
        if(loan.isActive) {
            document.getElementById('loan-collateral').innerText = ethers.utils.formatUnits(loan.collateralAmount, 6);
            document.getElementById('loan-borrowed').innerText = ethers.utils.formatEther(loan.borrowedAmount);
        } else {
            document.getElementById('loan-collateral').innerText = "0.00";
            document.getElementById('loan-borrowed').innerText = "0.00";
        }
    } catch(e) { console.error(e); }
}

async function depositCollateral() {
    const amt = document.getElementById('collateral-amount').value;
    if(!amt) return;
    
    try {
        showNotif("Approve USDT...", "info");
        const erc20 = new ethers.Contract(USDT_ADDRESS, ["function approve(address spender, uint256 amount)"], signer);
        const tx1 = await erc20.approve(CONTRACT_ADDRESS, ethers.utils.parseUnits(amt, 6));
        await tx1.wait();

        showNotif("Dépôt collatéral...", "info");
        const tx2 = await contract.depositCollateral(ethers.utils.parseUnits(amt, 6));
        await tx2.wait();

        showNotif("Collatéral déposé!", "success");
        loadLoanInfo();
        loadBalances();
    } catch(e) { showNotif("Erreur", "error"); }
}

async function borrowFTA() {
    const amt = document.getElementById('borrow-amount').value;
    if(!amt) return;
    
    try {
        showNotif("Emprunt en cours...", "info");
        const tx = await contract.borrow(ethers.utils.parseEther(amt));
        await tx.wait();
        showNotif("Prêt reçu!", "success");
        loadLoanInfo();
        loadBalances();
    } catch(e) { showNotif("Erreur Emprunt (Vérifiez ratio 150%)", "error"); }
}

async function repayMyLoan() {
    if(!confirm("Rembourser le prêt + intérêts ?")) return;
    
    try {
        showNotif("Approve FTA pour remboursement...", "info");
        // Estimer le montant à rembourser (Loan + 5% interest approximation)
        // Pour simplifier, on approuve un gros montant ou on calcule exact
        const loan = await contract.userLoans(userAddress);
        const interest = loan.borrowedAmount.mul(5).div(100); // Approximation simple
        const totalRepay = loan.borrowedAmount.add(interest);

        const erc20 = new ethers.Contract(FTA_ADDRESS, ["function approve(address spender, uint256 amount)"], signer);
        const tx1 = await erc20.approve(CONTRACT_ADDRESS, totalRepay);
        await tx1.wait();

        showNotif("Remboursement...", "info");
        const tx2 = await contract.repayLoan();
        await tx2.wait();
        
        showNotif("Prêt remboursé!", "success");
        loadLoanInfo();
        loadBalances();
    } catch(e) { showNotif("Erreur Remboursement", "error"); console.error(e); }
}

// ==========================================
// TRADING
// ==========================================
// (Code Chart et Price Feed identique à la version précédente)
const ctx = document.getElementById('priceChart').getContext('2d');
const priceChart = new Chart(ctx, {
    type: 'line', data: { labels: [], datasets: [{ label: 'Prix', data: [], borderColor: '#f0b90b', borderWidth: 2, pointRadius: 0, tension: 0.1 }] },
    options: { responsive: true, maintainAspectRatio: false, scales: { y: { display: false }, x: { display: false } }, legend: { display: false } }
});

async function startPriceFeed() {
    setInterval(async () => {
        try {
            const res = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
            const data = await res.json();
            const price = parseFloat(data.price).toFixed(2);
            document.getElementById('live-price').innerText = "$" + price;
            
            priceChart.data.labels.push('');
            priceChart.data.datasets[0].data.push(price);
            if(priceChart.data.labels.length > 30) { priceChart.data.labels.shift(); priceChart.data.datasets[0].data.shift(); }
            priceChart.update();
        } catch(e) {}
    }, 2000);
}

function setLeverage(l) {
    document.querySelectorAll('.lev-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById('trade-leverage').value = l;
    document.getElementById('lev-display').innerText = "x" + l;
}

async function openTrade(side) {
    const asset = document.getElementById('trade-asset').value;
    const margin = document.getElementById('trade-margin').value;
    const lev = document.getElementById('trade-leverage').value;
    if(!margin) return;

    try {
        showNotif("Ouverture position x" + lev + "...", "info");
        const tx = await contract.openPosition(asset, side, ethers.utils.parseUnits(margin, 6), lev);
        await tx.wait();
        showNotif("Position ouverte !", "success");
    } catch(e) { showNotif("Erreur Trading", "error"); console.error(e); }
}

// ==========================================
// STAKING & AVIATOR
// ==========================================
async function loadPools() {
    const container = document.getElementById('pools-container');
    container.innerHTML = '';
    // Boucle simplifiée pour 7 pools
    for(let i=0; i<7; i++) {
        try {
            const p = await contract.stakingPools(i);
            if(p.exists) {
                const div = document.createElement('div');
                div.className = 'card';
                div.innerHTML = `
                    <h3>Pool #${i} - ${p.apy}% APY</h3>
                    <input type="number" id="stk-amt-${i}" placeholder="Montant" />
                    <div class="btn-row">
                        <button onclick="stakeInPool(${i})" class="btn-green">Stake</button>
                        <button onclick="unstakeFromPool(${i})" class="btn-red">Unstake</button>
                    </div>
                `;
                container.appendChild(div);
            }
        } catch(e) { break; }
    }
}

async function playAviator() {
    const amt = document.getElementById('bet-amount').value;
    const target = document.getElementById('target-mult').value;
    if(!amt || !target) return alert("Remplissez tout");

    const targetFmt = Math.floor(parseFloat(target) * 100);
    
    try {
        // Approve
        showNotif("Approbation FTA...", "info");
        const erc20 = new ethers.Contract(FTA_ADDRESS, ["function approve(address spender, uint256 amount)"], signer);
        const tx1 = await erc20.approve(CONTRACT_ADDRESS, ethers.utils.parseEther(amt));
        await tx1.wait();

        // Play
        showNotif("Lancement du vol...", "info");
        const tx2 = await contract.playAviator(ethers.utils.parseEther(amt), targetFmt);
        
        // Animation simple
        startAnim();
        
        await tx2.wait();
        
        stopAnim();
        showNotif("Résultat traité !", "success");
        loadBalances();

    } catch(e) {
        stopAnim();
        showNotif("Erreur jeu", "error");
    }
}

function startAnim() {
    const p = document.getElementById('plane-icon');
    const m = document.getElementById('multiplier-display');
    p.style.transform = "translate(100px, -100px) rotate(0deg)";
    let x = 1.00;
    window.aviatorInt = setInterval(() => { m.innerText = (x += 0.05).toFixed(2) + "x"; }, 50);
}

function stopAnim() {
    clearInterval(window.aviatorInt);
    document.getElementById('plane-icon').style.transform = "rotate(-45deg)";
    document.getElementById('multiplier-display').innerText = "1.00x";
}

// ==========================================
// UTILS
// ==========================================
function showSection(id) {
    document.querySelectorAll('.content-section').forEach(el => el.classList.remove('active'));
    document.getElementById('section-' + id).classList.add('active');
    document.querySelectorAll('nav li').forEach(el => el.classList.remove('active'));
    event.target.closest('li').classList.add('active');
    
    if(id === 'lending') loadLoanInfo();
}

function showNotif(msg, type) {
    const n = document.getElementById('notification');
    n.innerText = msg;
    n.style.display = 'block';
    n.style.borderLeftColor = type === 'error' ? 'red' : (type === 'success' ? 'green' : 'var(--primary)');
    setTimeout(() => n.style.display = 'none', 4000);
}