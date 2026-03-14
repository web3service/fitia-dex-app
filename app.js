// CONFIGURATION FITIA FINANCE
const ADDRESSES = {
    HUB: "0x027579bd6302174b499970955EF534500Cd342Dd",
    FTA: "0x535bBe393D64a60E14B731b7350675792d501623",
    USDT: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"
};

const ABI = [
    "function internalBalances(address, address) view returns (uint256)",
    "function depositToWallet(address _token, uint256 _amount) external",
    "function withdrawFromWallet(address _token, uint256 _amount) external",
    "function playAviator(uint256 _ftaBetAmount, uint256 _targetMultiplier) external",
    "function openPosition(uint8 _asset, uint8 _side, uint256 _marginUSDT, uint256 _leverage) external",
    "event AviatorResolved(address indexed player, bool won, uint256 payout, uint256 crashPoint)"
];

let provider, signer, hubContract, account;

async function connect() {
    // Sécurité anti-crash
    if (typeof ethers === 'undefined') {
        alert("Chargement en cours... réessayez dans 3 secondes.");
        return;
    }

    if (window.ethereum) {
        try {
            provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            signer = provider.getSigner();
            account = await signer.getAddress();
            hubContract = new ethers.Contract(ADDR.HUB, ABI, signer);
            
            document.getElementById('user-addr').innerText = account.slice(0,6)+"..."+account.slice(-4);
            document.getElementById('connectBtn').innerText = "Connecté";
            updateUI();
        } catch (e) { alert("Erreur: " + e.message); }
    } else {
        alert("Ouvrez FITIA Finance dans Trust Wallet ou MetaMask.");
    }
}

async function updateUI() {
    const f = await hubContract.internalBalances(account, ADDR.FTA);
    const u = await hubContract.internalBalances(account, ADDR.USDT);
    document.getElementById('ui-fta').innerText = ethers.utils.formatUnits(f, 18);
    document.getElementById('ui-usdt').innerText = ethers.utils.formatUnits(u, 6);
}

function switchTab(id, el) {
    document.querySelectorAll('.tab-content').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    el.classList.add('active');
    if(id === 'trade') initTV();
}

async function deposit() {
    const t = document.getElementById('in-token').value === 'FTA' ? ADDR.FTA : ADDR.USDT;
    const a = ethers.utils.parseUnits(document.getElementById('in-amount').value, t === ADDR.FTA ? 18 : 6);
    const tx = await hubContract.depositToWallet(t, a);
    await tx.wait(); updateUI();
}

async function playAviator() {
    const m = ethers.utils.parseUnits(document.getElementById('av-mise').value, 18);
    const c = Math.floor(document.getElementById('av-target').value * 100);
    const tx = await hubContract.playAviator(m, c);
    
    let screen = document.getElementById('aviator-screen');
    let val = 1.00;
    let t = setInterval(() => { val += 0.08; screen.innerText = val.toFixed(2) + "x"; }, 100);

    const r = await tx.wait();
    clearInterval(t);
    const ev = r.events.find(e => e.event === "AviatorResolved");
    screen.innerText = (ev.args.crashPoint / 100).toFixed(2) + "x";
    updateUI();
}

function initTV() {
    new TradingView.widget({
        "autosize": true, "symbol": "BINANCE:BTCUSDT", "interval": "15",
        "theme": "dark", "container_id": "tradingview_chart", "hide_top_toolbar": true
    });
}

// Liaison du bouton dès que la page est chargée
window.onload = () => {
    document.getElementById('connectBtn').onclick = connect;
};