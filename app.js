const CONFIG = {
    MINING: "0xb7555D092b0B30D30552502f8a2674D48601b10F", // Adresse du contrat
    USDT: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    FTA: "0x535bBe393D64a60E14B731b7350675792d501623",
    CHAIN_ID: 137
};

const MINING_ABI = [
    "function getActivePower(address) view returns (uint256)",
    "function getMachineCount() view returns (uint256)",
    "function getUserMachineCount(address, uint256) view returns (uint256)",
    "function exchangeRate() view returns (uint256)",
    "function getWheelJackpot() view returns (uint256)",
    "function getLotteryPool() view returns (uint256)",
    "function machineTypes(uint256) view returns (uint256 price, uint256 power)",
    "function buyMachine(uint256 typeId)",
    "function buyMachineWithFTA(uint256 typeId)",
    "function claimRewards()",
    "function swapUsdtForFta(uint256 amount)",
    "function swapFtaForUsdt(uint256 amount)",
    "function playWinGo(uint256 amount, uint8 betType, uint8 choice)",
    "function spinWheel()",
    "function goFishing()",
    "function buyLotteryTicket()"
];

const ERC20_ABI = [
    "function balanceOf(address) view returns (uint256)",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function allowance(address owner, address spender) view returns (uint256)"
];

class Application {
    constructor() {
        this.provider = null; this.signer = null; this.contracts = {};
        this.user = null; this.shopData = []; this.swapDirection = 'USDT_TO_FTA';
        this.decimalsUSDT = 6; this.decimalsFTA = 8;
    }

    async init() { console.log("Bitget Style UI Ready"); }

    async connect() {
        if (!window.ethereum) return alert("Installez MetaMask");
        this.setLoader(true, "Connexion...");
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            this.provider = new ethers.BrowserProvider(window.ethereum);
            this.signer = await this.provider.getSigner();
            this.user = await this.signer.getAddress();

            this.contracts.mining = new ethers.Contract(CONFIG.MINING, MINING_ABI, this.signer);
            this.contracts.usdt = new ethers.Contract(CONFIG.USDT, ERC20_ABI, this.signer);
            this.contracts.fta = new ethers.Contract(CONFIG.FTA, ERC20_ABI, this.signer);

            document.getElementById('btn-connect').classList.add('hidden');
            document.getElementById('wallet-status').classList.remove('hidden');
            document.getElementById('addr-display').innerText = this.user.slice(0,6) + "..." + this.user.slice(38);
            document.getElementById('ref-link').value = window.location.origin + "?ref=" + this.user;

            await this.loadAllData();
            setInterval(() => this.loadAllData(), 5000);
        } catch (e) { this.showToast("Erreur de connexion", true); }
        this.setLoader(false);
    }

    async loadAllData() {
        if (!this.user) return;
        await Promise.all([ this.loadDashboard(), this.loadShop(), this.loadGameInfo(), this.loadMyMachines() ]);
    }

    async loadDashboard() {
        const balUsdt = await this.contracts.usdt.balanceOf(this.user);
        const balFta = await this.contracts.fta.balanceOf(this.user);
        document.getElementById('bal-usdt').innerText = parseFloat(ethers.formatUnits(balUsdt, this.decimalsUSDT)).toFixed(2);
        document.getElementById('bal-fta').innerText = parseFloat(ethers.formatUnits(balFta, this.decimalsFTA)).toFixed(2);
        
        // Swap
        document.getElementById('swap-bal-from').innerText = this.swapDirection === 'USDT_TO_FTA' ? parseFloat(ethers.formatUnits(balUsdt, this.decimalsUSDT)).toFixed(2) : parseFloat(ethers.formatUnits(balFta, this.decimalsFTA)).toFixed(2);
        document.getElementById('swap-bal-to').innerText = this.swapDirection === 'USDT_TO_FTA' ? parseFloat(ethers.formatUnits(balFta, this.decimalsFTA)).toFixed(2) : parseFloat(ethers.formatUnits(balUsdt, this.decimalsUSDT)).toFixed(2);

        const power = await this.contracts.mining.getActivePower(this.user);
        document.getElementById('val-power').innerText = parseFloat(ethers.formatUnits(power, this.decimalsFTA)).toFixed(5) + " FTA/s";
    }

    async loadShop() {
        if (this.shopData.length > 0) return;
        const container = document.getElementById('shop-list');
        const count = await this.contracts.mining.getMachineCount();
        for(let i=0; i<count; i++) {
            const m = await this.contracts.mining.machineTypes(i);
            const price = parseFloat(ethers.formatUnits(m.price, this.decimalsUSDT));
            const power = parseFloat(ethers.formatUnits(m.power, this.decimalsFTA));
            this.shopData.push({price, power});
            const div = document.createElement('div');
            div.className = 'machine-tile';
            div.innerHTML = `
                <span class="m-name">RIG ${i+1}</span>
                <span class="m-power">${power.toFixed(5)} FTA/s</span>
                <span class="m-price">${price}$</span>
                <div class="btn-grp">
                    <button class="btn-tile usdt" onclick="App.buyMachine(${i})">USDT</button>
                    <button class="btn-tile fta" onclick="App.buyMachineFTA(${i})">FTA</button>
                </div>
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
                div.className = 'rig-row'; // Utiliser style asset-row ou custom
                div.innerHTML = `
                    <div style="flex:1"><strong>RIG ${i+1}</strong> <span style="opacity:0.7">x${count}</span></div>
                    <div style="color:var(--primary)">${this.shopData[i].power.toFixed(5)} FTA/s</div>
                `;
                container.appendChild(div);
            }
        }
        document.getElementById('no-rigs').style.display = hasMachines ? 'none' : 'block';
    }

    async loadGameInfo() {
        try {
            const wheelJP = await this.contracts.mining.getWheelJackpot();
            document.getElementById('wheel-jackpot').innerText = parseFloat(ethers.formatUnits(wheelJP, this.decimalsFTA)).toFixed(0);
            const lotteryPot = await this.contracts.mining.getLotteryPool();
            document.getElementById('lottery-pot').innerText = parseFloat(ethers.formatUnits(lotteryPot, this.decimalsFTA)).toFixed(0);
        } catch(e) {}
    }

    async buyMachine(id) { await this._buyLogic(id, false); }
    async buyMachineFTA(id) { await this._buyLogic(id, true); }

    async _buyLogic(id, useFTA) {
        if (!this.user) return this.connect();
        const m = this.shopData[id];
        let amount, tokenContract;
        
        if (useFTA) {
            const rate = await this.contracts.mining.exchangeRate();
            const priceBN = ethers.parseUnits(m.price.toString(), this.decimalsUSDT);
            amount = (priceBN * rate) / (10n ** 6n);
            tokenContract = this.contracts.fta;
            this.setLoader(true, "Achat FTA...");
        } else {
            amount = ethers.parseUnits(m.price.toString(), this.decimalsUSDT);
            tokenContract = this.contracts.usdt;
            this.setLoader(true, "Achat USDT...");
        }

        try {
            const allowance = await tokenContract.allowance(this.user, CONFIG.MINING);
            if (allowance < amount) {
                this.showToast("Approbation...");
                const txApp = await tokenContract.approve(CONFIG.MINING, amount);
                await txApp.wait();
            }
            const tx = useFTA ? await this.contracts.mining.buyMachineWithFTA(id) : await this.contracts.mining.buyMachine(id);
            await tx.wait();
            this.showToast("Machine achetée !");
            this.loadAllData();
        } catch(e) { this.showToast("Erreur", true); }
        this.setLoader(false);
    }

    async claim() {
        if(!this.user) return;
        this.setLoader(true, "Claim...");
        try {
            const tx = await this.contracts.mining.claimRewards();
            await tx.wait();
            this.showToast("Réclamé !");
            this.loadAllData();
        } catch(e) { this.showToast("Erreur", true); }
        this.setLoader(false);
    }

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
        const rate = 2000; // Idéalement fetch rate
        let result = this.swapDirection === 'USDT_TO_FTA' ? input * rate : input / rate;
        document.getElementById('swap-to-in').value = result.toFixed(5);
    }

    async playWinGo(betType, choice) {
        const amountStr = document.getElementById('wingo-amount').value;
        if(!amountStr) return this.showToast("Montant requis", true);
        const amount = ethers.parseUnits(amountStr, this.decimalsFTA);
        await this._playGame("playWinGo", [amount, betType, choice], amount);
    }
    async spinWheel() { await this._playGame("spinWheel", [], ethers.parseUnits("100", this.decimalsFTA)); }
    async goFishing() { await this._playGame("goFishing", [], ethers.parseUnits("50", this.decimalsFTA)); }
    async buyLotteryTicket() { await this._playGame("buyLotteryTicket", [], ethers.parseUnits("50", this.decimalsFTA)); }

    async _playGame(funcName, args, amount) {
        if(!this.user) return this.connect();
        this.setLoader(true, "Jeu...");
        try {
            const allowance = await this.contracts.fta.allowance(this.user, CONFIG.MINING);
            if (allowance < amount) {
                const txApp = await this.contracts.fta.approve(CONFIG.MINING, amount);
                await txApp.wait();
            }
            const tx = await this.contracts.mining[funcName](...args);
            await tx.wait();
            this.showToast("Jeu terminé !");
            this.loadAllData();
        } catch(e) { this.showToast("Erreur Jeu", true); }
        this.setLoader(false);
    }

    nav(viewId) {
        document.querySelectorAll('.view').forEach(el => { el.classList.remove('active'); el.style.display = 'none'; });
        const activeView = document.getElementById('view-' + viewId);
        if(activeView) { activeView.classList.add('active'); activeView.style.display = 'block'; }
        
        document.querySelectorAll('.nav-item-bit').forEach(el => el.classList.remove('active'));
        if(event && event.currentTarget) event.currentTarget.classList.add('active');
    }

    copyLink() { navigator.clipboard.writeText(document.getElementById('ref-link').value); this.showToast("Lien copié !"); }
    setLoader(show, msg="Chargement...") { document.getElementById('loader-text').innerText = msg; document.getElementById('loader').classList.toggle('hidden', !show); }
    showToast(msg, isError=false) {
        const div = document.createElement('div');
        div.className = 'toast';
        if (isError) div.style.borderColor = "var(--danger)";
        div.innerText = msg;
        document.getElementById('toast-container').appendChild(div);
        setTimeout(() => div.remove(), 3000);
    }
}

const App = new Application();
window.onload = () => App.init();