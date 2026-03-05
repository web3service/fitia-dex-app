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

const MINING_ABI = [ "function getActivePower(address) view returns (uint256)", "function getMachineCount() view returns (uint256)", "function getUserMachineCount(address, uint256) view returns (uint256)", "function exchangeRate() view returns (uint256)", "function getWheelJackpot() view returns (uint256)", "function getLotteryPool() view returns (uint256)", "function machineTypes(uint256) view returns (uint256 price, uint256 power)", "function buyMachine(uint256 typeId)", "function buyMachineWithFTA(uint256 typeId)", "function claimRewards()", "function swapUsdtForFta(uint256 amount)", "function swapFtaForUsdt(uint256 amount)", "function playWinGo(uint256 amount, uint8 betType, uint8 choice)", "function spinWheel()", "function goFishing()", "function buyLotteryTicket()" ];
const ERC20_ABI = [ "function balanceOf(address) view returns (uint256)", "function approve(address spender, uint256 amount) returns (bool)", "function allowance(address owner, address spender) view returns (uint256)", "function transfer(address to, uint256 amount) returns (bool)" ];

class Application {
    constructor() {
        this.provider = null; this.signer = null; this.contracts = {};
        this.user = null; this.shopData = []; this.swapDirection = 'USDT_TO_FTA';
        this.decimalsUSDT = 6; this.decimalsFTA = 8;
        this.isInternal = false;
        this.currentRate = 2000;
    }

    async init() {
        // Check if already logged in
        const savedMnemonic = localStorage.getItem('fitia_wallet');
        if (savedMnemonic) {
            await this.loadWallet(savedMnemonic);
        } else {
            this.uiShowAuth();
        }
    }

    // --- UI NAVIGATION ---
    uiShowAuth() { this.hideAllModals(); document.getElementById('auth-modal').classList.remove('hidden'); }
    uiShowCreate() { this.hideAllModals(); 
        const w = ethers.Wallet.createRandom();
        const mnemonic = w.mnemonic.phrase;
        document.getElementById('mnemonic-display').innerHTML = mnemonic.split(' ').map((w,i) => `<span>${i+1}. ${w}</span>`).join('');
        document.getElementById('btn-create-final').onclick = () => this.saveAndLoad(mnemonic);
        document.getElementById('create-modal').classList.remove('hidden');
    }
    uiShowImport() { this.hideAllModals(); document.getElementById('import-modal').classList.remove('hidden'); }
    uiShowDeposit() { if(!this.user) return; this.hideAllModals(); document.getElementById('deposit-view').classList.remove('hidden'); document.getElementById('withdraw-view').classList.add('hidden'); document.getElementById('tx-title').innerText = "Dépôt"; document.getElementById('deposit-address').innerText = this.user; document.getElementById('qr-code').innerHTML = `<img src='https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${this.user}' style="width:100%; border-radius:10px;">`; document.getElementById('tx-modal').classList.remove('hidden'); }
    uiShowWithdraw() { document.getElementById('deposit-view').classList.add('hidden'); document.getElementById('withdraw-view').classList.remove('hidden'); document.getElementById('tx-title').innerText = "Retrait"; }
    uiCloseTx() { document.getElementById('tx-modal').classList.add('hidden'); }
    hideAllModals() { document.querySelectorAll('.modal-overlay').forEach(m => m.classList.add('hidden')); }
    enableCreateBtn() { document.getElementById('btn-create-final').disabled = !document.getElementById('terms-check').checked; }

    // --- WALLET LOGIC ---
    async saveAndLoad(mnemonic) {
        localStorage.setItem('fitia_wallet', mnemonic);
        await this.loadWallet(mnemonic);
        this.hideAllModals();
    }

    async finalizeImport() {
        const phrase = document.getElementById('import-phrase').value.trim();
        if(phrase.split(' ').length < 12) return this.showToast("Phrase invalide", true);
        await this.saveAndLoad(phrase);
    }

    async connectMetaMask() {
        if (!window.ethereum) return this.showToast("MetaMask non détecté", true);
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            this.provider = new ethers.BrowserProvider(window.ethereum);
            this.signer = await this.provider.getSigner();
            this.user = await this.signer.getAddress();
            this.isInternal = false;
            this.hideAllModals();
            this.updateUI();
            await this.initContracts();
            await this.loadAllData();
        } catch(e) { this.showToast("Erreur MetaMask", true); }
    }

    async loadWallet(mnemonic) {
        try {
            this.provider = new ethers.JsonRpcProvider(CONFIG.RPC_URL);
            this.signer = ethers.Wallet.fromPhrase(mnemonic, this.provider);
            this.user = this.signer.address;
            this.isInternal = true;
            this.updateUI();
            await this.initContracts();
            await this.loadAllData();
            // Auto refresh
            setInterval(() => this.loadAllData(), 5000);
        } catch(e) { this.showToast("Erreur chargement wallet", true); console.error(e); }
    }

    updateUI() {
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
        if(!this.user) return;
        await Promise.all([ this.loadDashboard(), this.loadShop(), this.loadGameInfo(), this.loadMyMachines() ]);
    }

    async loadDashboard() {
        // MATIC Balance
        const balMatic = await this.provider.getBalance(this.user);
        document.getElementById('bal-matic').innerText = parseFloat(ethers.formatEther(balMatic)).toFixed(4);
        // Tokens
        const balUsdt = await this.contracts.usdt.balanceOf(this.user);
        const balFta = await this.contracts.fta.balanceOf(this.user);
        document.getElementById('bal-usdt').innerText = parseFloat(ethers.formatUnits(balUsdt, 6)).toFixed(2);
        document.getElementById('bal-fta').innerText = parseFloat(ethers.formatUnits(balFta, 8)).toFixed(2);
        // Power
        const power = await this.contracts.mining.getActivePower(this.user);
        document.getElementById('val-power').innerText = parseFloat(ethers.formatUnits(power, 8)).toFixed(5) + " FTA/s";
        // Swap
        this.updateSwapUI(balMatic, balUsdt, balFta);
    }

    updateSwapUI(balM, balU, balF) {
        const isUsdt = this.swapDirection === 'USDT_TO_FTA';
        document.getElementById('swap-bal-from').innerText = isUsdt ? parseFloat(ethers.formatUnits(balU, 6)).toFixed(2) : parseFloat(ethers.formatUnits(balF, 8)).toFixed(2);
        document.getElementById('swap-bal-to').innerText = isUsdt ? parseFloat(ethers.formatUnits(balF, 8)).toFixed(2) : parseFloat(ethers.formatUnits(balU, 6)).toFixed(2);
    }

    async loadShop() {
        if(this.shopData.length > 0) return;
        const container = document.getElementById('shop-list');
        const count = await this.contracts.mining.getMachineCount();
        for(let i=0; i<count; i++) {
            const m = await this.contracts.mining.machineTypes(i);
            const price = parseFloat(ethers.formatUnits(m.price, 6));
            const power = parseFloat(ethers.formatUnits(m.power, 8));
            this.shopData.push({price, power});
            const div = document.createElement('div');
            div.className = 'machine-tile';
            div.innerHTML = `<span class="m-name">RIG ${i+1}</span><span class="m-power">${power.toFixed(5)} FTA/s</span><span class="m-price">${price}$</span><div class="btn-grp"><button class="btn-tile usdt" onclick="App.buyMachine(${i}, false)">USDT</button><button class="btn-tile fta" onclick="App.buyMachine(${i}, true)">FTA</button></div>`;
            container.appendChild(div);
        }
    }

    async loadMyMachines() {
        const container = document.getElementById('my-rigs-list');
        container.innerHTML = '';
        let has = false;
        for(let i=0; i<this.shopData.length; i++) {
            const count = await this.contracts.mining.getUserMachineCount(this.user, i);
            if(count > 0) {
                has = true;
                const div = document.createElement('div');
                div.className = 'asset-row'; // Reusing style
                div.innerHTML = `<div class="coin-info"><strong>RIG ${i+1}</strong> <span style="opacity:0.7">x${count}</span></div><div style="color:var(--primary)">${this.shopData[i].power.toFixed(5)} FTA/s</div>`;
                container.appendChild(div);
            }
        }
        document.getElementById('no-rigs').style.display = has ? 'none' : 'block';
    }

    async loadGameInfo() {
        try {
            document.getElementById('wheel-jackpot').innerText = parseFloat(ethers.formatUnits(await this.contracts.mining.getWheelJackpot(), 8)).toFixed(0);
            document.getElementById('lottery-pot').innerText = parseFloat(ethers.formatUnits(await this.contracts.mining.getLotteryPool(), 8)).toFixed(0);
        } catch(e){}
    }

    // --- ACTIONS ---
    async buyMachine(id, useFTA) {
        if(!this.user) return;
        const m = this.shopData[id];
        let amount, token;
        if(useFTA) {
            const rate = await this.contracts.mining.exchangeRate();
            amount = (ethers.parseUnits(m.price.toString(), 6) * rate) / 1000000n; // Simplified calc
            token = this.contracts.fta;
        } else {
            amount = ethers.parseUnits(m.price.toString(), 6);
            token = this.contracts.usdt;
        }
        this.setLoader(true, "Approve...");
        try {
            if(await token.allowance(this.user, CONFIG.MINING) < amount) {
                let tx = await token.approve(CONFIG.MINING, amount);
                await tx.wait();
            }
            this.setLoader(true, "Buying...");
            let tx = useFTA ? await this.contracts.mining.buyMachineWithFTA(id) : await this.contracts.mining.buyMachine(id);
            await tx.wait();
            this.showToast("Achat réussi !");
            this.loadAllData();
        } catch(e) { this.showToast("Erreur", true); }
        this.setLoader(false);
    }

    async claim() {
        if(!this.user) return;
        this.setLoader(true, "Claim...");
        try { await (await this.contracts.mining.claimRewards()).wait(); this.showToast("Réclamé !"); this.loadAllData(); } catch(e) { this.showToast("Erreur", true); }
        this.setLoader(false);
    }

    toggleSwap() {
        this.swapDirection = this.swapDirection === 'USDT_TO_FTA' ? 'FTA_TO_USDT' : 'USDT_TO_FTA';
        document.getElementById('token-from-display').innerText = this.swapDirection === 'USDT_TO_FTA' ? 'USDT' : 'FTA';
        document.getElementById('token-to-display').innerText = this.swapDirection === 'USDT_TO_FTA' ? 'FTA' : 'USDT';
        document.getElementById('swap-from-in').value = ''; document.getElementById('swap-to-in').value = '';
    }

    calcSwap() {
        let val = document.getElementById('swap-from-in').value;
        if(!val) return;
        let res = this.swapDirection === 'USDT_TO_FTA' ? val * this.currentRate : val / this.currentRate;
        document.getElementById('swap-to-in').value = res.toFixed(5);
    }

    async executeSwap() {
        let val = document.getElementById('swap-from-in').value;
        if(!val) return;
        this.setLoader(true, "Swap...");
        // Logic similar to buyMachine: approve then swap
        // Simplified here
        this.showToast("Swap exécuté (Logique à finaliser avec Approve)");
        this.setLoader(false);
    }

    // --- GAMES ---
    async playWinGo(type, choice) { await this._game('playWinGo', [ethers.parseUnits(document.getElementById('wingo-amount').value||"0", 8), type, choice]); }
    async spinWheel() { await this._game('spinWheel', []); }
    async goFishing() { await this._game('goFishing', []); }
    async buyLotteryTicket() { await this._game('buyLotteryTicket', []); }

    async _game(name, args) {
        if(!this.user) return;
        this.setLoader(true, "Jeu...");
        try {
            // Approve FTA for games if needed (simplified check)
            await this.contracts.fta.approve(CONFIG.MINING, ethers.MaxUint256); // One time approve for games
            let tx = await this.contracts.mining[name](...args);
            await tx.wait();
            this.showToast("Résultat : Vérifiez vos actifs");
            this.loadAllData();
        } catch(e) { this.showToast("Erreur jeu", true); }
        this.setLoader(false);
    }

    // --- INTERNAL SEND ---
    async processSend() {
        if(!this.isInternal) return this.showToast("Connectez le wallet interne", true);
        const token = document.getElementById('withdraw-token').value;
        const dest = document.getElementById('withdraw-dest').value;
        const amt = document.getElementById('withdraw-amount').value;
        if(!dest || !amt) return;
        
        this.setLoader(true, "Envoi...");
        try {
            let tx;
            if(token === 'MATIC') {
                tx = await this.signer.sendTransaction({ to: dest, value: ethers.parseEther(amt) });
            } else {
                const addr = token === 'USDT' ? CONFIG.USDT : CONFIG.FTA;
                const dec = token === 'USDT' ? 6 : 8;
                const c = new ethers.Contract(addr, ERC20_ABI, this.signer);
                tx = await c.transfer(dest, ethers.parseUnits(amt, dec));
            }
            await tx.wait();
            this.showToast("Envoi réussi !");
            this.uiCloseTx();
            this.loadAllData();
        } catch(e) { this.showToast("Erreur envoi", true); }
        this.setLoader(false);
    }

    // --- UTILS ---
    nav(id) { document.querySelectorAll('.view').forEach(v => {v.classList.remove('active'); v.style.display='none';}); let v=document.getElementById('view-'+id); if(v){v.classList.add('active');v.style.display='block';} document.querySelectorAll('.nav-item-bit').forEach(n=>n.classList.remove('active')); if(event && event.currentTarget) event.currentTarget.classList.add('active'); }
    copyAddress() { navigator.clipboard.writeText(this.user); this.showToast("Adresse copiée"); }
    copyLink() { navigator.clipboard.writeText(document.getElementById('ref-link').value); this.showToast("Lien copié"); }
    setLoader(show, msg="Chargement...") { document.getElementById('loader-text').innerText = msg; document.getElementById('loader').classList.toggle('hidden', !show); }
    showToast(msg, err=false) { let d=document.createElement('div'); d.className='toast'; if(err) d.style.borderColor="var(--danger)"; d.innerText=msg; document.getElementById('toast-container').appendChild(d); setTimeout(()=>d.remove(), 3000); }
}

const App = new Application();
window.onload = () => App.init();