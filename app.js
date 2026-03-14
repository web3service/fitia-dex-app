// CONFIGURATION FITIA FINANCE
const ADDRESSES = {
    HUB: "0x027579bd6302174b499970955EF534500Cd342Dd",
    FTA: "0x535bBe393D64a60E14B731b7350675792d501623",
    USDT: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"
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

// --- FONCTION DE CONNEXION ---
async function connectWallet() {
    console.log("Tentative de connexion..."); // Pour le debug

    if (typeof window.ethereum !== 'undefined') {
        try {
            // Demander l'accès aux comptes
            provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            
            signer = provider.getSigner();
            account = await signer.getAddress();
            hubContract = new ethers.Contract(ADDRESSES.HUB, HUB_ABI, signer);
            
            // Mise à jour de l'interface
            document.getElementById('user-addr').innerText = account.slice(0,6) + "..." + account.slice(-4);
            document.getElementById('connectBtn').innerText = "Connecté ✅";
            document.getElementById('connectBtn').style.background = "#0ecb81";
            
            // Charger les données
            updateUI();
            initTradingView();
            
            console.log("Connecté avec succès :", account);
        } catch (error) {
            console.error("Erreur de connexion :", error);
            alert("Connexion annulée ou erreur : " + error.message);
        }
    } else {
        alert("MetaMask ou un navigateur Web3 n'est pas détecté. Veuillez utiliser l'application MetaMask ou Trust Wallet.");
    }
}

// --- INITIALISATION AU CHARGEMENT ---
window.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('connectBtn');
    if (btn) {
        btn.onclick = connectWallet; // Lie la fonction au bouton
        console.log("Bouton Connect prêt.");
    } else {
        console.error("Bouton connectBtn introuvable dans le HTML !");
    }
});

// --- AUTRES FONCTIONS (GARDER TEL QUEL) ---

async function updateUI() {
    try {
        const ftaBal = await hubContract.internalBalances(account, ADDRESSES.FTA);
        const usdtBal = await hubContract.internalBalances(account, ADDRESSES.USDT);
        document.getElementById('ui-fta').innerText = ethers.utils.formatUnits(ftaBal, 18);
        document.getElementById('ui-usdt').innerText = ethers.utils.formatUnits(usdtBal, 6);
    } catch (e) {
        console.error("Erreur de mise à jour solde:", e);
    }
}

function switchTab(tabId, el) {
    document.querySelectorAll('.tab-content').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    el.classList.add('active');
    
    // Recharge le graphique si onglet Trade activé
    if(tabId === 'trade') {
        setTimeout(initTradingView, 200);
    }
}

async function deposit() {
    const token = document.getElementById('in-token').value === 'FTA' ? ADDRESSES.FTA : ADDRESSES.USDT;
    const amountVal = document.getElementById('in-amount').value;
    if(!amountVal) return alert("Entrez un montant");
    
    const amount = ethers.utils.parseUnits(amountVal, token === ADDRESSES.FTA ? 18 : 6);
    try {
        const tx = await hubContract.depositToWallet(token, amount);
        await tx.wait(); 
        updateUI();
        alert("Dépôt validé !");
    } catch (e) { 
        alert("Erreur de dépôt. Avez-vous approuvé le token ?"); 
    }
}

async function playAviator() {
    const miseVal = document.getElementById('av-mise').value;
    const targetVal = document.getElementById('av-target').value;
    if(!miseVal || !targetVal) return alert("Remplissez les champs");

    const mise = ethers.utils.parseUnits(miseVal, 18);
    const target = Math.floor(targetVal * 100);
    
    try {
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
    } catch (e) { 
        alert("Erreur Aviator : " + e.message); 
    }
}

function initTradingView() {
    if(document.getElementById('tradingview_chart').innerHTML === "") {
        new TradingView.widget({
            "autosize": true, "symbol": "BINANCE:BTCUSDT", "interval": "15",
            "theme": "dark", "style": "1", "container_id": "tradingview_chart",
            "hide_top_toolbar": true, "locale": "fr"
        });
    }
}