const CONFIG = {
    MINING: "0xb7555D092b0B30D30552502f8a2674D48601b10F", // Adresse du contrat
    USDT: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    FTA: "0x535bBe393D64a60E14B731b7350675792d501623",
    CHAIN_ID: 137,
};

const MINING_ABI = [
    // Views
    "function getActivePower(address) view returns (uint256)",
    "function getMachineCount() view returns (uint256)",
    "function getUserMachineCount(address, uint256) view returns (uint256)",
    "function exchangeRate() view returns (uint256)",
    "function getWheelJackpot() view returns (uint256)",
    "function getLotteryPool() view returns (uint256)",
    "function wheelTicketPrice() view returns (uint256)",
    "function fishingTicketPrice() view returns (uint256)",
    "function lotteryTicketPrice() view returns (uint256)",
    
    // Machine
    "function machineTypes(uint256) view returns (uint256 price, uint256 power)",
    "function buyMachine(uint256 typeId)",
    "function buyMachineWithFTA(uint256 typeId)",
    "function claimRewards()",
    
    // Swap
    "function swapUsdtForFta(uint256 amount)",
    "function swapFtaForUsdt(uint256 amount)",
    
    // Games
    "function playWinGo(uint256 amount, uint8 betType, uint8 choice)",
    "function spinWheel()",
    "function goFishing()",
    "function buyLotteryTicket()",
    
    // Referral
    "function setReferrer(address referrer)"
];

const ERC20_ABI = [
    "function balanceOf(address) view returns (uint256)",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function allowance(address owner, address spender) view returns (uint256)"
];

class Application {
    constructor() {
        this.provider = null;
        this.signer = null;
        this.contracts = {};
        this.user = null;
        this.shopData = [];
        this.swapDirection = 'USDT_TO_FTA';
        this.decimalsUSDT = 6;
        this.decimalsFTA = 8; // Ajustez selon votre token FTA réel
    }

    async init() {
        console.log("FITIA PRO App Ready");
    }

    async connect() {
        if (!window.ethereum) return alert("Installez MetaMask");
        
        this.setLoader(true, "Connexion...");
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            this.provider = new ethers.BrowserProvider(window.ethereum);
            this.signer = await this.provider.getSigner();
            this.user = await this.signer.getAddress();

            // Check Network (Polygon)
            const network = await this.provider.getNetwork();
            if (Number(network.chainId) !== CONFIG.CHAIN_ID) {
                this.showToast("Veuillez basculer sur Polygon (MATIC)", true);
                // Ajouter logique switch network ici si besoin
            }

            // Init Contracts
            this.contracts.mining = new ethers.Contract(CONFIG.MINING, MINING_ABI, this.signer);
            this.contracts.usdt = new ethers.Contract(CONFIG.USDT, ERC20_ABI, this.signer);
            this.contracts.fta = new ethers.Contract(CONFIG.FTA, ERC20_ABI, this.signer);

            // UI Updates
            document.getElementById('btn-connect').classList.add('hidden');
            document.getElementById('wallet-status').classList.remove('hidden');
            document.getElementById('addr-display').innerText = this.user.slice(0,6) + "..." + this.user.slice(38);
            document.getElementById('ref-link').value = window.location.origin + "?ref=" + this.user;

            await this.loadAllData();
            setInterval(() => this.loadAllData(), 5000);

        } catch (e) {
            console.error(e);
            this.showToast("Erreur de connexion", true);
        }
        this.setLoader(false);
    }

    async loadAllData() {
        if (!this.user) return;
        try {
            await Promise.all([
                this.loadDashboard(),
                this.loadShop(),
                this.loadGameInfo(),
                this.loadMyMachines()
            ]);
        } catch(e) {
            console.error("Data refresh error", e);
        }
    }

    async loadDashboard() {
        // Balances
        const balUsdt = await this.contracts.usdt.balanceOf(this.user);
        const balFta = await this.contracts.fta.balanceOf(this.user);
        
        document.getElementById('bal-usdt').innerText = parseFloat(ethers.formatUnits(balUsdt, this.decimalsUSDT)).toFixed(2);
        document.getElementById('bal-fta').innerText = parseFloat(ethers.formatUnits(balFta, this.decimalsFTA)).toFixed(2);
        
        // Swap specific
        document.getElementById('swap-bal-from').innerText = this.swapDirection === 'USDT_TO_FTA' ? 
            parseFloat(ethers.formatUnits(balUsdt, this.decimalsUSDT)).toFixed(2) : 
            parseFloat(ethers.formatUnits(balFta, this.decimalsFTA)).toFixed(2);
        document.getElementById('swap-bal-to').innerText = this.swapDirection === 'USDT_TO_FTA' ? 
            parseFloat(ethers.formatUnits(balFta, this.decimalsFTA)).toFixed(2) : 
            parseFloat(ethers.formatUnits(balUsdt, this.decimalsUSDT)).toFixed(2);

        // Power
        const power = await this.contracts.mining.getActivePower(this.user);
        document.getElementById('val-power').innerText = parseFloat(ethers.formatUnits(power, this.decimalsFTA)).toFixed(5);
        
        // Pending (Simulation côté client car pas de view dans contrat, ou estimé)
        // Pour cet exemple on laisse à 0 ou on peut calculer côté JS si on stocke lastClaimTime
        // Simplification: On affiche 0, l'utilisateur doit Claim pour voir.
        // Note: Pour un vrai projet, ajoutez une view function getLastClaimTime dans le contrat.
        document.getElementById('val-pending').innerText = "0.00"; 
    }

    async loadShop() {
        const container = document.getElementById('shop-list');
        if (this.shopData.length > 0) return; // Déjà chargé

        const count = await this.contracts.mining.getMachineCount();
        container.innerHTML = '';
        
        for(let i=0; i<count; i++) {
            const m = await this.contracts.mining.machineTypes(i);
            const price = parseFloat(ethers.formatUnits(m.price, this.decimalsUSDT));
            const power = parseFloat(ethers.formatUnits(m.power, this.decimalsFTA));
            
            this.shopData.push({price, power});

            const div = document.createElement('div');
            div.className = 'rig-item';
            div.innerHTML = `
                <div>
                    <span class="rig-name">RIG ${i+1}</span>
                    <span class="rig-power">${power.toFixed(5)} FTA/s</span>
                    <span class="rig-price">${price}$</span>
                </div>
                <button class="btn-primary" onclick="App.buyMachine(${i})">USDT</button>
                <button class="btn-secondary" onclick="App.buyMachineFTA(${i})">FTA</button>
            `;
            container.appendChild(div);
        }
    }

    async loadMyMachines() {
        const container = document.getElementById('my-rigs-list');
        container.innerHTML = '';
        let hasMachines = false;

        for(let i=0; i<this.shopData.length; i++) {
            const count = await this.contracts.mining.getUserMachineCount(this.user, i);
            if (count > 0) {
                hasMachines = true;
                const div = document.createElement('div');
                div.className = 'my-rig-card';
                div.innerHTML = `
                    <div class="rig-info">
                        <h4>RIG ${i+1} <span style="opacity:0.7">x${count}</span></h4>
                        <p>${this.shopData[i].power.toFixed(5)} FTA/s par unité</p>
                    </div>
                    <span class="rig-status-badge status-active">ACTIF</span>
                `;
                container.appendChild(div);
            }
        }
        
        document.getElementById('no-rigs').style.display = hasMachines ? 'none' : 'block';
    }

    async loadGameInfo() {
        try {
            const wheelJP = await this.contracts.mining.getWheelJackpot();
            document.getElementById('wheel-jackpot').innerText = parseFloat(ethers.formatUnits(wheelJP, this.decimalsFTA)).toFixed(2);

            const lotteryPot = await this.contracts.mining.getLotteryPool();
            document.getElementById('lottery-pot').innerText = parseFloat(ethers.formatUnits(lotteryPot, this.decimalsFTA)).toFixed(2);

            // Prix fixes (pour cet exemple, on pourrait les lire via des view functions si elles existent dans le contrat)
            // Le contrat les a en variables publiques, mais pas forcément view. 
            // Supposons qu'on les connaisse ou qu'on lit les variables publiques.
            // Pour simplifier, on les met en dur ou on lit :
            if(this.contracts.mining.wheelTicketPrice) {
                const wp = await this.contracts.mining.wheelTicketPrice();
                document.getElementById('wheel-price').innerText = parseFloat(ethers.formatUnits(wp, this.decimalsFTA));
            }
        } catch(e) {
            // Ignore errors for game info
        }
    }

    // --- ACTIONS ---

    async buyMachine(id) {
        await this._buyLogic(id, false);
    }

    async buyMachineFTA(id) {
        await this._buyLogic(id, true);
    }

    async _buyLogic(id, useFTA) {
        if (!this.user) return this.connect();
        
        const m = this.shopData[id];
        let amount, tokenAddr, tokenContract, decimals;

        if (useFTA) {
            // Calcul prix en FTA
            const rate = await this.contracts.mining.exchangeRate(); // FTA par USDT
            // Prix USDT * Rate / 10^6
            const priceBN = ethers.parseUnits(m.price.toString(), this.decimalsUSDT);
            amount = (priceBN * rate) / (10n ** 6n); 
            tokenAddr = CONFIG.FTA;
            tokenContract = this.contracts.fta;
            decimals = this.decimalsFTA;
            this.setLoader(true, "Achat avec FTA...");
        } else {
            amount = ethers.parseUnits(m.price.toString(), this.decimalsUSDT);
            tokenAddr = CONFIG.USDT;
            tokenContract = this.contracts.usdt;
            decimals = this.decimalsUSDT;
            this.setLoader(true, "Achat avec USDT...");
        }

        try {
            // Approve
            const allowance = await tokenContract.allowance(this.user, CONFIG.MINING);
            if (allowance < amount) {
                this.showToast("Approbation requise...");
                const txApp = await tokenContract.approve(CONFIG.MINING, amount);
                await txApp.wait();
            }

            // Buy
            const tx = useFTA ? 
                await this.contracts.mining.buyMachineWithFTA(id) :
                await this.contracts.mining.buyMachine(id);
                
            await tx.wait();
            this.showToast("Machine achetée !");
            this.loadAllData();
        } catch(e) {
            console.error(e);
            this.showToast("Erreur achat", true);
        }
        this.setLoader(false);
    }

    async claim() {
        if(!this.user) return;
        this.setLoader(true, "Réclamation...");
        try {
            const tx = await this.contracts.mining.claimRewards();
            await tx.wait();
            this.showToast("Gains réclamés !");
            this.loadAllData();
        } catch(e) {
            this.showToast("Erreur claim", true);
        }
        this.setLoader(false);
    }

    // --- SWAP LOGIC ---
    toggleSwap() {
        this.swapDirection = this.swapDirection === 'USDT_TO_FTA' ? 'FTA_TO_USDT' : 'USDT_TO_FTA';
        document.getElementById('token-from-display').innerText = this.swapDirection === 'USDT_TO_FTA' ? 'USDT' : 'FTA';
        document.getElementById('token-to-display').innerText = this.swapDirection === 'USDT_TO_FTA' ? 'FTA' : 'USDT';
        document.getElementById('swap-from-in').value = '';
        document.getElementById('swap-to-in').value = '';
        this.loadDashboard();
    }

    async calcSwap() {
        const input = document.getElementById('swap-from-in').value;
        if(!input) return;
        
        // Taux simple pour l'exemple. Le contrat a un taux fixe ou variable.
        // Ici on suppose un taux stocké dans le contrat ou 2000 par défaut.
        const rate = 2000; // Idéalement await this.contracts.mining.exchangeRate();
        
        let result;
        if (this.swapDirection === 'USDT_TO_FTA') {
            result = input * rate;
        } else {
            result = input / rate;
        }
        document.getElementById('swap-to-in').value = result.toFixed(5);
    }

    setMax() {
        const bal = document.getElementById('swap-bal-from').innerText;
        document.getElementById('swap-from-in').value = bal;
        this.calcSwap();
    }

    async executeSwap() {
        // Similaire à buyMachine, vérifier allowance et appeler swap...
        this.showToast("Fonction Swap à finaliser avec Allowance");
    }

    // --- GAMES LOGIC ---

    async playWinGo(betType, choice) {
        const amountStr = document.getElementById('wingo-amount').value;
        if(!amountStr) return this.showToast("Entrez un montant", true);
        
        const amount = ethers.parseUnits(amountStr, this.decimalsFTA);
        await this._playGame("playWinGo", [amount, betType, choice], amount);
    }

    async spinWheel() {
        const price = ethers.parseUnits("100", this.decimalsFTA); // Lire du contrat idéalement
        await this._playGame("spinWheel", [], price);
    }

    async goFishing() {
        const price = ethers.parseUnits("50", this.decimalsFTA);
        await this._playGame("goFishing", [], price);
    }

    async buyLotteryTicket() {
        const price = ethers.parseUnits("50", this.decimalsFTA);
        await this._playGame("buyLotteryTicket", [], price);
    }

    async _playGame(funcName, args, amount) {
        if(!this.user) return this.connect();
        this.setLoader(true, "Jeu en cours...");
        
        try {
            // Check Allowance
            const allowance = await this.contracts.fta.allowance(this.user, CONFIG.MINING);
            if (allowance < amount) {
                this.showToast("Approbation FTA...");
                const txApp = await this.contracts.fta.approve(CONFIG.MINING, amount);
                await txApp.wait();
            }

            // Play
            const tx = await this.contracts.mining[funcName](...args);
            const receipt = await tx.wait();
            
            // Check Events
            const iface = new ethers.Interface(MINING_ABI);
            let resultMsg = "Jeu terminé !";
            
            for(let log of receipt.logs) {
                try {
                    const parsed = iface.parseLog(log);
                    if(parsed.name === "GamePlayed") {
                        const payout = parsed.args[3]; // payout est le 4ème arg
                        if(payout > 0) {
                            resultMsg = `Bravo ! Gagné: ${ethers.formatUnits(payout, this.decimalsFTA)} FTA`;
                        } else {
                            resultMsg = "Dommage, réessayez !";
                        }
                    }
                } catch(e){}
            }
            
            this.showToast(resultMsg);
            this.loadAllData();

        } catch(e) {
            console.error(e);
            this.showToast("Erreur Jeu", true);
        }
        this.setLoader(false);
    }

    // --- NAV & UI ---
    nav(viewId) {
        document.querySelectorAll('.view').forEach(el => {
            el.classList.remove('active');
            el.style.display = 'none';
        });
        const activeView = document.getElementById('view-' + viewId);
        if(activeView) {
            activeView.classList.add('active');
            activeView.style.display = 'block';
        }
        document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
        if(event && event.currentTarget) event.currentTarget.classList.add('active');
        
        if (viewId === 'my-rigs') this.loadMyMachines(); // Refresh on view
    }

    copyLink() {
        const val = document.getElementById('ref-link').value;
        navigator.clipboard.writeText(val);
        this.showToast("Lien copié !");
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