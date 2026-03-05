// ==========================================
// CONFIGURATION
// ==========================================

const CONFIG = {
    MINING: "0xb7555D092b0B30D30552502f8a2674D48601b10F", // Adresse du contrat
    USDT: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    FTA: "0x535bBe393D64a60E14B731b7350675792d501623",
    CHAIN_ID: 137,
    RPC_URL: "https://polygon-rpc.com" // Node RPC Public
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
    "function allowance(address owner, address spender) view returns (uint256)",
    "function transfer(address to, uint256 amount) returns (bool)"
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
        this.decimalsFTA = 8;
        this.isInternal = false;
    }

    async init() {
        // Check existing session
        const savedMn = localStorage.getItem('fitia_wallet_mnemonic');
        if (savedMn) {
            await this.loadInternalWallet(savedMn);
        } else {
            document.getElementById('auth-modal').classList.remove('hidden');
        }
    }

    // --- UI CONTROLLERS ---
    uiShowAuth() {
        document.getElementById('import-modal').classList.add('hidden');
        document.getElementById('auth-modal').classList.remove('hidden');
    }
    uiShowCreateWallet() {
        const wallet = ethers.Wallet.createRandom();
        this.pendingMnemonic = wallet.mnemonic.phrase;
        const display = document.getElementById('mnemonic-display');
        display.innerHTML = wallet.mnemonic.phrase.split(' ').map((w, i) => `<span>${i+1}. ${w}</span>`).join('');
        document.getElementById('auth-modal').classList.add('hidden');
        document.getElementById('create-modal').classList.remove('hidden');
    }
    uiShowImportWallet() {
        document.getElementById('auth-modal').classList.add('hidden');
        document.getElementById('import-modal').classList.remove('hidden');
    }
    
    finalizeWalletCreation() {
        if(!this.pendingMnemonic) return;
        localStorage.setItem('fitia_wallet_mnemonic', this.pendingMnemonic);
        this.loadInternalWallet(this.pendingMnemonic);
        document.getElementById('create-modal').classList.add('hidden');
    }

    finalizeWalletImport() {
        const ph = document.getElementById('import-phrase').value.trim();
        if(!ph) return;
        try {
            ethers.Wallet.fromPhrase(ph); // Validate
            localStorage.setItem('fitia_wallet_mnemonic', ph);
            this.loadInternalWallet(ph);
            document.getElementById('import-modal').classList.add('hidden');
        } catch(e) { this.showToast("Phrase invalide", true); }
    }

    async connectMetaMask() {
        if (!window.ethereum) return this.showToast("MetaMask non installé", true);
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            this.provider = new ethers.BrowserProvider(window.ethereum);
            this.signer = await this.provider.getSigner();
            this.user = await this.signer.getAddress();
            this.isInternal = false;
            this.updateUIForWallet("MetaMask");
            await this.initContracts();
            await this.loadAllData();
        } catch(e) { this.showToast("Erreur MetaMask", true); }
    }

    async loadInternalWallet(mnemonic) {
        this.setLoader(true, "Déverrouillage...");
        try {
            // Connect to Polygon via RPC
            this.provider = new ethers.JsonRpcProvider(CONFIG.RPC_URL);
            // Create Signer
            this.signer = ethers.Wallet.fromPhrase(mnemonic, this.provider);
            this.user = this.signer.address;
            this.isInternal = true;
            
            this.updateUIForWallet("Internal");
            await this.initContracts();
            await this.loadAllData();
        } catch(e) { 
            console.error(e); 
            this.showToast("Erreur chargement wallet", true); 
        }
        this.setLoader(false);
    }

    updateUIForWallet(type) {
        document.getElementById('auth-modal').classList.add('hidden');
        document.getElementById('wallet-badge').classList.remove('hidden');
        document.getElementById('addr-display').innerText = this.user.slice(0,6) + "..." + this.user.slice(38);
        document.getElementById('ref-link').value = window.location.origin + "?ref=" + this.user;
    }

    async initContracts() {
        this.contracts.mining = new ethers.Contract(CONFIG.MINING, MINING_ABI, this.signer);
        this.contracts.usdt = new ethers.Contract(CONFIG.USDT, ERC20_ABI, this.signer);
        this.contracts.fta = new ethers.Contract(CONFIG.FTA, ERC20_ABI, this.signer);
    }

    // --- DATA LOADING ---
    async loadAllData() {
        if (!this.user) return;
        await Promise.all([ this.loadDashboard(), this.loadShop(), this.loadGameInfo(), this.loadMyMachines() ]);
    }

    async loadDashboard() {
        // MATIC Balance
        const balMatic = await this.provider.getBalance(this.user);
        document.getElementById('bal-matic').innerText = parseFloat(ethers.formatEther(balMatic)).toFixed(4);
        
        // USDT & FTA
        const balUsdt = await this.contracts.usdt.balanceOf(this.user);
        const balFta = await this.contracts.fta.balanceOf(this.user);
        document.getElementById('bal-usdt').innerText = parseFloat(ethers.formatUnits(balUsdt, 6)).toFixed(2);
        document.getElementById('bal-fta').innerText = parseFloat(ethers.formatUnits(balFta, 8)).toFixed(2);
        
        // Update Swap
        document.getElementById('swap-bal-from').innerText = this.swapDirection === 'USDT_TO_FTA' ? parseFloat(ethers.formatUnits(balUsdt, 6)).toFixed(2) : parseFloat(ethers.formatUnits(balFta, 8)).toFixed(2);
        document.getElementById('swap-bal-to').innerText = this.swapDirection === 'USDT_TO_FTA' ? parseFloat(ethers.formatUnits(balFta, 8)).toFixed(2) : parseFloat(ethers.formatUnits(balUsdt, 6)).toFixed(2);

        // Power
        const power = await this.contracts.mining.getActivePower(this.user);
        document.getElementById('val-power').innerText = parseFloat(ethers.formatUnits(power, 8)).toFixed(5) + " FTA/s";
    }

    async loadShop() {
        if (this.shopData.length > 0) return;
        const container = document.getElementById('shop-list');
        const count = await this.contracts.mining.getMachineCount();
        for(let i=0; i<count; i++) {
            const m = await this.contracts.mining.machineTypes(i);
            const price = parseFloat(ethers.formatUnits(m.price, 6));
            const power = parseFloat(ethers.formatUnits(m.power, 8));
            this.shopData.push({price, power});
            const div = document.createElement('div');
            div.className = 'machine-tile';
            div.innerHTML = `<span class="m-name">RIG ${i+1}</span><span class="m-power">${power.toFixed(5)} FTA/s</span><span class="m-price">${price}$</span>
            <div class="btn-grp"><button class="btn-tile usdt" onclick="App.buyMachine(${i})">USDT</button><button class="btn-tile fta" onclick="App.buyMachineFTA(${i})">FTA</button></div>`;
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
                div.className = 'asset-row';
                div.innerHTML = `<div class="coin-info"><strong>RIG ${i+1}</strong> <span style="opacity:0.7">x${count}</span></div><div style="color:var(--primary)">${this.shopData[i].power.toFixed(5)} FTA/s</div>`;
                container.appendChild(div);
            }
        }
        document.getElementById('no-rigs').style.display = hasMachines ? 'none' : 'block';
    }

    async loadGameInfo() {
        try {
            const wj = await this.contracts.mining.getWheelJackpot();
            document.getElementById('wheel-jackpot').innerText = parseFloat(ethers.formatUnits(wj, 8)).toFixed(0);
            const lp = await this.contracts.mining.getLotteryPool();
            document.getElementById('lottery-pot').innerText = parseFloat(ethers.formatUnits(lp, 8)).toFixed(0);
        } catch(e) {}
    }

    // --- ACTIONS ---
    async buyMachine(id) { await this._buyLogic(id, false); }
    async buyMachineFTA(id) { await this._buyLogic(id, true); }

    async _buyLogic(id, useFTA) {
        if (!this.user) return;
        const m = this.shopData[id];
        let amount, token;
        
        if (useFTA) {
            const rate = await this.contracts.mining.exchangeRate();
            amount = (ethers.parseUnits(m.price.toString(), 6) * rate) / (10n ** 6n);
            token = this.contracts.fta;
            this.setLoader(true, "Achat FTA...");
        } else {
            amount = ethers.parseUnits(m.price.toString(), 6);
            token = this.contracts.usdt;
            this.setLoader(true, "Achat USDT...");
        }

        try {
            const allowance = await token.allowance(this.user, CONFIG.MINING);
            if (allowance < amount) {
                this.showToast("Approbation...");
                const txa = await token.approve(CONFIG.MINING, amount);
                await txa.wait();
            }
            const tx = useFTA ? await this.contracts.mining.buyMachineWithFTA(id) : await this.contracts.mining.buyMachine(id);
            await tx.wait();
            this.showToast("Achat réussi !");
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
        const rate = 2000; // Fetch from contract ideally
        let res = this.swapDirection === 'USDT_TO_FTA' ? input * rate : input / rate;
        document.getElementById('swap-to-in').value = res.toFixed(5);
    }

    async executeSwap() { this.showToast("Fonction Swap"); }

    // --- GAMES ---
    async playWinGo(bt, ch) {
        const amt = document.getElementById('wingo-amount').value;
        if(!amt) return;
        const val = ethers.parseUnits(amt, 8);
        await this._playGame("playWinGo", [val, bt, ch], val);
    }
    async spinWheel() { await this._playGame("spinWheel", [], ethers.parseUnits("100", 8)); }
    async goFishing() { await this._playGame("goFishing", [], ethers.parseUnits("50", 8)); }
    async buyLotteryTicket() { await this._playGame("buyLotteryTicket", [], ethers.parseUnits("50", 8)); }

    async _playGame(fn, args, amt) {
        if(!this.user) return;
        this.setLoader(true, "Jeu...");
        try {
            const all = await this.contracts.fta.allowance(this.user, CONFIG.MINING);
            if (all < amt) {
                const txa = await this.contracts.fta.approve(CONFIG.MINING, amt);
                await txa.wait();
            }
            const tx = await this.contracts.mining[fn](...args);
            await tx.wait();
            this.showToast("Jeu terminé !");
            this.loadAllData();
        } catch(e) { this.showToast("Erreur", true); }
        this.setLoader(false);
    }

    // --- DEPOSIT / WITHDRAW UI ---
    uiShowDeposit() {
        document.getElementById('tx-modal').classList.remove('hidden');
        document.getElementById('deposit-view').classList.remove('hidden');
        document.getElementById('withdraw-view').classList.add('hidden');
        document.getElementById('tx-title').innerText = "Dépôt";
        document.getElementById('deposit-address').innerText = this.user;
        
        // QR Code
        const qr = document.getElementById('qr-code');
        qr.innerHTML = '';
        const img = document.createElement('img');
        img.src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${this.user}`;
        qr.appendChild(img);
    }
    
    uiShowWithdraw() {
        document.getElementById('tx-modal').classList.remove('hidden');
        document.getElementById('deposit-view').classList.add('hidden');
        document.getElementById('withdraw-view').classList.remove('hidden');
        document.getElementById('tx-title').innerText = "Retrait";
    }
    
    uiCloseTxModal() { document.getElementById('tx-modal').classList.add('hidden'); }

    copyDepositAddress() {
        navigator.clipboard.writeText(this.user);
        this.showToast("Adresse copiée !");
    }

    async processWithdraw() {
        if(!this.isInternal) return this.showToast("Wallet interne requis", true);
        
        const token = document.getElementById('withdraw-token').value;
        const dest = document.getElementById('withdraw-dest').value;
        const amountStr = document.getElementById('withdraw-amount').value;
        
        if(!dest || !amountStr) return;

        this.setLoader(true, "Envoi...");
        try {
            let tx;
            if (token === 'MATIC') {
                const amount = ethers.parseEther(amountStr);
                tx = await this.signer.sendTransaction({ to: dest, value: amount });
            } else {
                const contractAddr = token === 'USDT' ? CONFIG.USDT : CONFIG.FTA;
                const dec = token === 'USDT' ? 6 : 8;
                const amount = ethers.parseUnits(amountStr, dec);
                const contract = new ethers.Contract(contractAddr, ERC20_ABI, this.signer);
                tx = await contract.transfer(dest, amount);
            }
            
            await tx.wait();
            this.showToast("Envoi réussi !");
            this.uiCloseTxModal();
            this.loadAllData();
        } catch(e) {
            console.error(e);
            this.showToast("Erreur envoi", true);
        }
        this.setLoader(false);
    }

    // --- NAV ---
    nav(viewId) {
        document.querySelectorAll('.view').forEach(el => { el.classList.remove('active'); });
        document.getElementById('view-' + viewId).classList.add('active');
        document.querySelectorAll('.nav-item-bit').forEach(el => el.classList.remove('active'));
        if(event && event.currentTarget) event.currentTarget.classList.add('active');
    }

    copyLink() {
        navigator.clipboard.writeText(document.getElementById('ref-link').value);
        this.showToast("Lien copié !");
    }
    
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