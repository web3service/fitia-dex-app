// ==========================================
// CONFIGURATION
// ==========================================
const CONFIG = {
    // --- VOS ADRESSES ICI ---
    MINING: "0xcD718eCb9e46f474E28508E07b692610488a4Ba4", 
    FTA: "0x535bBe393D64a60E14B731b7350675792d501623",          
    USDT: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", 
    CHAIN_ID: 137 
};

// ABI (V2 AVEC ÉVÉNEMENTS POUR L'HISTORIQUE)
const MINING_ABI = [
    "function buyMachine(uint256 typeId)",
    "function claimRewards()",
    "function swapUsdtForFta(uint256 amount)",
    "function swapFtaForUsdt(uint256 amount)",
    "function setReferrer(address _referrer)",
    "function getActivePower(address) view returns (uint256)",
    "function exchangeRate() view returns (uint256)",
    "function machineTypes(uint256) view returns (uint256 price, uint256 power)",
    "function getMachineCount() view returns (uint256)",
    "function difficultyMultiplier() view returns (uint256)",
    "event MachineBought(address indexed user, uint256 machineId, uint256 price)",
    "event RewardsClaimed(address indexed user, uint256 amount)"
];

const ERC20_ABI = [
    "function balanceOf(address) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function approve(address, uint256) returns (bool)",
    "function allowance(address, address) view returns (uint256)",
    "function transferFrom(address, address, uint256) returns (bool)",
    "function symbol() view returns (string)"
];

// --- LOGIQUE PRINCIPALE ---
class Application {
    constructor() {
        this.provider = null;
        this.signer = null;
        this.contracts = {};
        this.user = null;
        this.currentRate = 0;
        this.swapDirection = 'USDT_TO_FTA';
    }

    async init() {
        console.log("FITIA V2 Mode (Compatible Historique)");
        this.checkReferral();
        
        if (window.ethereum) {
            this.provider = new ethers.BrowserProvider(window.ethereum);
            window.ethereum.on('accountsChanged', () => window.location.reload());
            window.ethereum.on('chainChanged', () => window.location.reload());
        } else {
            this.showToast("Wallet non détecté", true);
        }
    }

    checkReferral() {
        const params = new URLSearchParams(window.location.search);
        const ref = params.get('ref');
        if (ref && ethers.isAddress(ref)) {
            this.tempReferrer = ref;
        }
    }

    async connect() {
        if (!window.ethereum) return;
        
        this.setLoader(true, "Connexion...");
        
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            this.signer = await this.provider.getSigner();
            this.user = await this.signer.getAddress();

            const network = await this.provider.getNetwork();
            if (Number(network.chainId) !== CONFIG.CHAIN_ID) {
                await this.switchNetwork();
            }

            this.contracts.usdt = new ethers.Contract(CONFIG.USDT, ERC20_ABI, this.signer);
            this.contracts.fta = new ethers.Contract(CONFIG.FTA, ERC20_ABI, this.signer);
            this.contracts.mining = new ethers.Contract(CONFIG.MINING, MINING_ABI, this.signer);

            document.getElementById('btn-connect').classList.add('hidden');
            const ws = document.getElementById('wallet-status');
            ws.classList.remove('hidden');
            document.getElementById('addr-display').innerText = this.user.slice(0,6) + "..." + this.user.slice(38);
            
            if (this.tempReferrer) {
                await this.bindReferrerInternal(this.tempReferrer);
            }

            this.updateData();
            setInterval(() => this.updateData(), 5000);

        } catch (e) {
            console.error(e);
            this.showToast("Erreur connexion", true);
        }
        this.setLoader(false);
    }

    async switchNetwork() {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x' + CONFIG.CHAIN_ID.toString(16) }],
            });
        } catch (e) {
            if (e.code === 4902) {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{ chainId: '0x' + CONFIG.CHAIN_ID.toString(16), chainName: 'Polygon Mainnet', nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 }, rpcUrls: ['https://polygon-rpc.com/'], blockExplorerUrls: ['https://polygonscan.com/'] }],
                });
            }
        }
    }

    async updateData() {
        if (!this.user) return;
        try {
            const usdtBal = await this.contracts.usdt.balanceOf(this.user);
            const ftaBal = await this.contracts.fta.balanceOf(this.user);
            const power = await this.contracts.mining.getActivePower(this.user);
            const rate = await this.contracts.mining.exchangeRate();
            this.currentRate = parseFloat(ethers.formatUnits(rate, 8));

            document.getElementById('val-power').innerText = parseFloat(ethers.formatUnits(power, 8)).toFixed(4);
            document.getElementById('bal-usdt').innerText = parseFloat(ethers.formatUnits(usdtBal, 6)).toFixed(2);
            document.getElementById('bal-fta').innerText = parseFloat(ethers.formatUnits(ftaBal, 8)).toFixed(2);
            
            // Swap UI
            document.getElementById('swap-bal-from').innerText = this.swapDirection === 'USDT_TO_FTA' ? parseFloat(ethers.formatUnits(usdtBal, 6)).toFixed(2) : parseFloat(ethers.formatUnits(ftaBal, 8)).toFixed(2);
            document.getElementById('swap-bal-to').innerText = this.swapDirection === 'USDT_TO_FTA' ? parseFloat(ethers.formatUnits(ftaBal, 8)).toFixed(2) : parseFloat(ethers.formatUnits(usdtBal, 6)).toFixed(2);
            document.getElementById('swap-rate').innerText = `1 USDT = ${this.currentRate} FTA`;

            if (document.getElementById('shop-list').children.length === 0) {
                await this.renderShop();
            }
            
            // Chargement Historique (Si on est sur l'onglet historique)
            if (document.getElementById('view-inventory').classList.contains('active')) {
                await this.renderHistory();
            }

        } catch (e) {
            console.error("Erreur refresh:", e);
        }
    }

    async renderShop() {
        const container = document.getElementById('shop-list');
        const count = await this.contracts.mining.getMachineCount();
        const icons = ["💾", "💚", "💜", "💙", "💚"]; // 5 Machines seulement
        container.innerHTML = '';
        
        for(let i=0; i<count; i++) {
            const data = await this.contracts.mining.machineTypes(i);
            const price = parseFloat(ethers.formatUnits(data.price, 6)).toFixed(2);
            const power = parseFloat(ethers.formatUnits(data.power, 8)).toFixed(4);
            
            const div = document.createElement('div');
            div.className = 'rig-item';
            div.innerHTML = `
                <span class="rig-name">RIG NIVEAU ${i+1}</span>
                <span class="rig-power">${power} FTA/s</span>
                <span class="rig-price">${price} USDT</span>
                <button class="btn-primary" style="padding:10px; font-size:0.9rem" onclick="App.buyMachine(${i})">ACHETER</button>
            `;
            container.appendChild(div);
        }
    }

    // --- NOUVEAU : HISTORIQUE (COMPATIBLE ANCIEN CONTRAT) ---
    async renderHistory() {
        const list = document.getElementById('history-list');
        list.innerHTML = '<h4 style="margin-bottom:10px;">Historique (Ancien Contrat)</h4>';
        
        try {
            // 1. Récupérer les achats
            const buyFilter = this.contracts.mining.filters.MachineBought(this.user);
            const buyLogs = await this.contracts.mining.queryFilter(buyFilter);
            
            // 2. Récupérer les réclamations
            const claimFilter = this.contracts.mining.filters.RewardsClaimed(this.user);
            const claimLogs = await this.contracts.mining.queryFilter(claimFilter);

            // 3. Fusionner
            const allLogs = [...buyLogs, ...claimLogs].sort((a, b) => b.blockNumber - a.blockNumber);

            // 4. Afficher
            if (allLogs.length === 0) {
                list.innerHTML += '<p style="text-align:center; color:#666; padding:20px">Aucun historique.</p>';
                return;
            }

            allLogs.forEach(log => {
                let type, msg, val;
                if (log.eventName === 'MachineBought') {
                    type = 'type-buy';
                    msg = `Achat Rig #${log.args[1]}`; // args[1] est l'id de la machine
                    const price = parseFloat(ethers.formatUnits(log.args[2], 6)).toFixed(2);
                    val = price + ' USDT';
                } else {
                    type = 'type-claim';
                    msg = `Réclamation`;
                    val = parseFloat(ethers.formatUnits(log.args[1], 8)).toFixed(4) + ' FTA';
                }
                const date = new Date(log.blockNumber * 1000).toLocaleString();
                
                const li = document.createElement('div');
                li.className = 'history-item';
                li.innerHTML = `<span>${date}</span> <span class="${type}">${msg}</span> <small>${val}</small>`;
                list.appendChild(li);
            });
        } catch (e) {
            console.error("Erreur historique (Le RPC public peut limiter les résultats) :", e);
        }
    }

    async buyMachine(id) {
        if (!this.user) return this.connect();
        this.setLoader(true, "Achat...");
        try {
            const m = await this.contracts.mining.machineTypes(id);
            const allowance = await this.contracts.usdt.allowance(this.user, CONFIG.MINING);
            if (allowance < m.price) {
                const txApp = await this.contracts.usdt.approve(CONFIG.MINING, m.price);
                await txApp.wait();
            }
            const txBuy = await this.contracts.mining.buyMachine(id);
            await txBuy.wait();
            this.showToast("Achat réussi !");
            document.getElementById('shop-list').innerHTML = ''; 
            document.getElementById('inventory-list').innerHTML = ''; // Force re-render
            this.updateData();
        } catch (e) { this.showToast("Erreur Achat", true); }
        this.setLoader(false);
    }

    async claim() {
        if (!this.user) return this.connect();
        this.setLoader(true, "Réclamation...");
        try {
            const tx = await this.contracts.mining.claimRewards();
            await tx.wait();
            this.showToast("Gains réceptionnés !");
            this.updateData();
        } catch (e) { this.showToast("Erreur Réclamation", true); }
        this.setLoader(false);
    }

    async bindReferrerInternal(addr) {
        try {
            const tx = await this.contracts.mining.setReferrer(addr);
            await tx.wait();
            this.showToast("Parrain lié !");
        } catch (e) { console.log("Déjà lié"); }
    }

    // ... (Swap, Nav, Utils sont identiques) ...
    toggleSwap() {
        this.swapDirection = this.swapDirection === 'USDT_TO_FTA' ? 'FTA_TO_USDT' : 'USDT_TO_FTA';
        const fromDisplay = document.getElementById('token-from-display');
        const toDisplay = document.getElementById('token-to-display');
        if (this.swapDirection === 'USDT_TO_FTA') {
            fromDisplay.innerText = 'USDT'; toDisplay.innerText = 'FTA';
        } else {
            fromDisplay.innerText = 'FTA'; toDisplay.innerText = 'USDT';
        }
        this.updateData();
    }

    async executeSwap() {
        const inputVal = document.getElementById('swap-from-in').value;
        if (!inputVal || parseFloat(inputVal) <= 0) return this.showToast("Montant invalide", true);
        this.setLoader(true, "Échange...");
        const decimals = this.swapDirection === 'USDT_TO_FTA' ? 6 : 8;
        const amount = ethers.parseUnits(inputVal, decimals);
        try {
            if (this.swapDirection === 'USDT_TO_FTA') {
                const allowance = await this.contracts.usdt.allowance(this.user, CONFIG.MINING);
                if (allowance < amount) {
                    const txApp = await this.contracts.usdt.approve(CONFIG.MINING, amount);
                    await txApp.wait();
                }
                const tx = await this.contracts.mining.swapUsdtForFta(amount);
                await tx.wait();
            } else {
                const allowance = await this.contracts.fta.allowance(this.user, CONFIG.MINING);
                if (allowance < amount) {
                    const txApp = await this.contracts.fta.approve(CONFIG.MINING, amount);
                    await txApp.wait();
                }
                const tx = await this.contracts.mining.swapFtaForUsdt(amount);
                await tx.wait();
            }
            this.showToast("Échange réussi !");
            document.getElementById('swap-from-in').value = '';
            this.updateData();
        } catch (e) { this.showToast("Erreur Swap", true); }
        this.setLoader(false);
    }

    nav(viewId) {
        document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
        document.getElementById('view-' + viewId).classList.add('active');
        document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
        event.currentTarget.classList.add('active');
    }

    copyLink() {
        const val = window.location.origin + "?ref=" + this.user;
        navigator.clipboard.writeText(val);
        this.showToast("Lien copié");
    }

    setLoader(show, msg="Chargement...") {
        const l = document.getElementById('loader');
        document.getElementById('loader-text').innerText = msg;
        show ? l.classList.remove('hidden') : l.classList.add('hidden');
    }

    showToast(msg, isError=false) {
        const div = document.createElement('div');
        div.className = 'toast';
        if (isError) div.style.borderLeftColor = 'var(--danger)';
        div.innerText = msg;
        document.getElementById('toast-container').appendChild(div);
        setTimeout(() => div.remove(), 3000);
    }
}

const App = new Application();
window.onload = () => App.init();