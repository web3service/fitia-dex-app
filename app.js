// CONFIGURATION FITIA FINANCE
const ADDRESSES = {
    HUB: "0xVOTRE_CONTRAT_HUB",
    FTA: "0xVOTRE_TOKEN_FTA",
    USDT: "0xVOTRE_TOKEN_USDT"
};

const HUB_ABI = [
    "function internalBalances(address, address) view returns (uint256)",
    "function depositToWallet(address _token, uint256 _amount) external",
    "function withdrawFromWallet(address _token, uint256 _amount) external",
    "function playAviator(uint256 _ftaBetAmount, uint256 _targetMultiplier) external",
    "function openPosition(uint8 _asset, uint8 _side, uint256 _marginUSDT, uint256 _leverage) external",
    "function stake(uint256 _poolId, uint256 _amount) external",
    "function depositCollateral(uint256 _usdtAmount) external",
    "function borrow(uint256 _ftaAmount) external",
    "event AviatorResolved(address indexed player, bool won, uint256 payout, uint256 crashPoint)"
];

let provider, signer, hubContract, account;

// Connexion Wallet
async function connect() {
    if (window.ethereum) {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        account = await signer.getAddress();
        hubContract = new ethers.Contract(ADDRESSES.HUB, HUB_ABI, signer);
        
        document.getElementById('user-addr').innerText = account.slice(0,6) + "..." + account.slice(-4);
        document.getElementById('connectBtn').style.display = 'none';
        updateUI();
        initTradingView();
    } else {
        alert("Veuillez ouvrir cette application dans le navigateur de MetaMask ou TrustWallet.");
    }
}

async function updateUI() {
    const ftaBal = await hubContract.internalBalances(account, ADDRESSES.FTA);
    const usdtBal = await hubContract.internalBalances(account, ADDRESSES.USDT);
    document.getElementById('ui-fta').innerText = ethers.utils.formatUnits(ftaBal, 18);
    document.getElementById('ui-usdt').innerText = ethers.utils.formatUnits(usdtBal, 6);
}

// Navigation
function switchTab(tabId, el) {
    document.querySelectorAll('.tab-content').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    el.classList.add('active');
}

// Modules Logic
async function deposit() {
    const token = document.getElementById('in-token').value === 'FTA' ? ADDRESSES.FTA : ADDRESSES.USDT;
    const amount = ethers.utils.parseUnits(document.getElementById('in-amount').value, token === ADDRESSES.FTA ? 18 : 6);
    try {
        const tx = await hubContract.depositToWallet(token, amount);
        await tx.wait(); updateUI();
    } catch (e) { alert("Erreur: Vérifiez l'approbation du token."); }
}

async function trade(side) {
    const margin = ethers.utils.parseUnits(document.getElementById('tr-marge').value, 6);
    const lev = document.getElementById('tr-lev').value;
    const tx = await hubContract.openPosition(0, side, margin, lev);
    await tx.wait(); alert("Position ouverte !");
}

async function playAviator() {
    const mise = ethers.utils.parseUnits(document.getElementById('av-mise').value, 18);
    const target = Math.floor(document.getElementById('av-target').value * 100);
    const tx = await hubContract.playAviator(mise, target);
    
    let screen = document.getElementById('aviator-screen');
    let val = 1.00;
    let timer = setInterval(() => { val += 0.09; screen.innerText = val.toFixed(2) + "x"; }, 100);

    const receipt = await tx.wait();
    clearInterval(timer);
    const event = receipt.events.find(e => e.event === "AviatorResolved");
    screen.innerText = (event.args.crashPoint / 100).toFixed(2) + "x";
    alert(event.args.won ? "GAGNÉ !" : "CRASH !");
    updateUI();
}

function initTradingView() {
    new TradingView.widget({
        "autosize": true, "symbol": "BINANCE:BTCUSDT", "interval": "15",
        "theme": "dark", "style": "1", "container_id": "tradingview_chart",
        "hide_top_toolbar": true, "locale": "fr"
    });
}

document.getElementById('connectBtn').onclick = connect;