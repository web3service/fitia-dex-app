const CONFIG = {
    MINING: "0xb7555D092b0B30D30552502f8a2674D48601b10F", // Adresse du contrat
    USDT: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    FTA: "0x535bBe393D64a60E14B731b7350675792d501623",
    CHAIN_ID: 137,
    RPC_URL: "https://polygon-rpc.com"
};

const MINING_ABI = [
    "function getActivePower(address) view returns (uint256)",
    "function getMachineCount() view returns (uint256)",
    "function getUserMachineCount(address, uint256) view returns (uint256)",
    "function machineTypes(uint256) view returns (uint256 price, uint256 power)",
    "function exchangeRate() view returns (uint256)",
    "function getWheelJackpot() view returns (uint256)",
    "function getLotteryPool() view returns (uint256)",
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
        this.decimalsUSDT = 6;
        this.decimalsFTA = 8;
        this.swapDirection = 'USDT_TO_FTA';
        this.keystoreString = null;
        this.pinCode = "";
        this.isUnlocking = false;
    }

    async init() {
        try {
            if (typeof ethers === 'undefined') return alert("Ethers.js non chargé.");
            this.provider = new ethers.JsonRpcProvider(CONFIG.RPC_URL);
            const storedKeystore = localStorage.getItem('fitia_keystore');
            
            if (storedKeystore) {
                this.keystoreString = storedKeystore;
                document.getElementById('auth-setup').style.display = 'none';
                document.getElementById('auth-unlock').style.display = 'block';
                document.getElementById('auth-title').innerText = "Déverrouillage";
            } else {
                document.getElementById('auth-setup').style.display = 'block';
                document.getElementById('auth-unlock').style.display = 'none';
                document.getElementById('auth-title').innerText = "Bienvenue";
            }
        } catch (e) { console.error(e); }
    }

    // --- WALLET MANAGEMENT ---
    showCreateModal() {
        const html = `
            <p style="color:var(--text-dim); margin-bottom:15px;">Code PIN (6 chiffres min)</p>
            <input type="password" id="new-pin" class="input-seed" placeholder="Nouveau PIN" inputmode="numeric">
            <input type="password" id="confirm-pin" class="input-seed" placeholder="Confirmer PIN" inputmode="numeric">
            <button class="btn-gold" onclick="App.createWallet()">Créer</button>
        `;
        document.getElementById('modal-body').innerHTML = html;
        document.getElementById('modal-title').innerText = "Nouveau Portefeuille";
        document.getElementById('modal-overlay').classList.remove('hidden');
    }

    showImportModal() {
        const html = `
            <p style="color:var(--text-dim); margin-bottom:15px;">Phrase secrète (12 ou 24 mots)</p>
            <textarea id="import-seed" class="input-seed" rows="2" placeholder="word1 word2 ..."></textarea>
            <input type="password" id="import-pin" class="input-seed" placeholder="Définir un PIN" inputmode="numeric">
            <button class="btn-gold" onclick="App.importWallet()">Importer</button>
        `;
        document.getElementById('modal-body').innerHTML = html;
        document.getElementById('modal-title').innerText = "Importer";
        document.getElementById('modal-overlay').classList.remove('hidden');
    }

    closeModal() { document.getElementById('modal-overlay').classList.add('hidden'); }

    async createWallet() {
        try {
            const pin = document.getElementById('new-pin').value;
            const confirm = document.getElementById('confirm-pin').value;
            if (pin.length < 4) return this.showToast("PIN trop court (4 min)", true);
            if (pin !== confirm) return this.showToast("Les PINs ne correspondent pas", true);

            this.setLoader(true, "Génération...");
            const wallet = ethers.Wallet.createRandom();
            const keystoreJson = await wallet.encrypt(pin);
            localStorage.setItem('fitia_keystore', keystoreJson);
            this.keystoreString = keystoreJson;
            this.setLoader(false);
            
            const html = `
                <p class="seed-warning"><i class="fas fa-exclamation-triangle"></i> SAUVEGARDEZ CES MOTS C'EST VOTRE SEULE CLÉ !</p>
                <div id="seed-display" style="background:#000; padding:15px; border-radius:8px; margin-bottom:15px; color:var(--primary); font-weight:bold; font-family:monospace; word-break:break-all; user-select:all;">
                    ${wallet.mnemonic.phrase}
                </div>
                <button class="btn-copy-seed" onclick="App.copySeed()"><i class="fas fa-copy"></i> Copier la phrase</button>
                <button class="btn-gold" onclick="App.finalizeSetup()" style="margin-top:10px;">J'ai sauvegardé</button>
            `;
            document.getElementById('modal-body').innerHTML = html;
            document.getElementById('modal-title').innerText = "Sauvegarde";
        } catch (e) {
            this.setLoader(false);
            this.showToast("Erreur: " + e.message, true);
        }
    }

    copySeed() {
        const text = document.getElementById('seed-display').innerText;
        navigator.clipboard.writeText(text);
        this.showToast("Phrase copiée !");
    }

    async importWallet() {
        try {
            const seed = document.getElementById('import-seed').value.trim();
            const pin = document.getElementById('import-pin').value;
            if (!seed) return this.showToast("Phrase vide", true);
            if (pin.length < 4) return this.showToast("PIN court", true);

            this.setLoader(true, "Import...");
            const wallet = ethers.Wallet.fromPhrase(seed);
            const keystoreJson = await wallet.encrypt(pin);
            localStorage.setItem('fitia_keystore', keystoreJson);
            this.keystoreString = keystoreJson;
            this.setLoader(false);
            this.closeModal();
            this.init();
        } catch (e) {
            this.setLoader(false);
            this.showToast("Erreur: " + (e.reason || "Phrase invalide"), true);
        }
    }

    finalizeSetup() { this.closeModal(); location.reload(); }

    // --- PIN PAD ---
    enterPin(num) {
        if (this.pinCode.length >= 6) return;
        this.pinCode += num;
        this.updatePinDots();
        if (this.pinCode.length === 6) setTimeout(() => this.submitPin(), 300);
    }
    clearPin() { this.pinCode = this.pinCode.slice(0, -1); this.updatePinDots(); document.getElementById('pin-error').innerText = ""; }
    updatePinDots() {
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, i) => dot.classList.toggle('active', i < this.pinCode.length));
    }

    async submitPin() {
        if (this.isUnlocking) return;
        this.isUnlocking = true;
        this.setLoader(true, "Déverrouillage...");
        
        try {
            this.signer = await ethers.Wallet.fromEncryptedJson(this.keystoreString, this.pinCode);
            this.signer = this.signer.connect(this.provider);
            this.user = this.signer.address;

            this.contracts.mining = new ethers.Contract(CONFIG.MINING, MINING_ABI, this.signer);
            this.contracts.usdt = new ethers.Contract(CONFIG.USDT, ERC20_ABI, this.signer);
            this.contracts.fta = new ethers.Contract(CONFIG.FTA, ERC20_ABI, this.signer);

            document.getElementById('addr-display').innerText = this.user.slice(0,6) + "..." + this.user.slice(38);
            document.getElementById('auth-screen').style.display = 'none';
            document.getElementById('main-app').style.display = 'flex';
            document.getElementById('ref-link').value = window.location.origin + "?ref=" + this.user;

            await this.loadAllData();
            setInterval(() => this.loadAllData(), 5000);
        } catch(e) {
            document.getElementById('pin-error').innerText = "Code PIN incorrect";
            this.pinCode = "";
            this.updatePinDots();
        }
        this.isUnlocking = false;
        this.setLoader(false);
    }

    lockWallet() {
        this.pinCode = ""; this.signer = null; this.user = null;
        document.getElementById('main-app').style.display = 'none';
        document.getElementById('auth-screen').style.display = 'flex';
        document.getElementById('auth-setup').style.display = 'none';
        document.getElementById('auth-unlock').style.display = 'block';
        document.getElementById('pin-error').innerText = "";
        this.updatePinDots();
    }

    // --- DEPOSIT / WITHDRAW ---
    
    showDepositModal() {
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${this.user}`;
        const html = `
            <p style="color:var(--text-dim); margin-bottom:5px;">Votre adresse de dépôt</p>
            <div class="network-badge">POLYGON NETWORK</div>
            <div style="text-align:center;">
                <div class="qr-container"><img src="${qrUrl}" alt="QR Code"></div>
            </div>
            <div class="address-box">${this.user}</div>
            <button class="btn-gold" onclick="App.copyAddress()"><i class="fas fa-copy"></i> Copier l'adresse</button>
            <p style="font-size:0.8rem; color:var(--text-dim); margin-top:15px;">
                Envoyez uniquement des MATIC, USDT ou FTA sur le réseau Polygon.
            </p>
        `;
        document.getElementById('modal-body').innerHTML = html;
        document.getElementById('modal-title').innerText = "Dépôt";
        document.getElementById('modal-overlay').classList.remove('hidden');
    }

    copyAddress() {
        navigator.clipboard.writeText(this.user);
        this.showToast("Adresse copiée !");
    }

    showWithdrawModal() {
        const html = `
            <div style="margin-bottom:15px;">
                <label class="label-dim">Sélectionner le token</label>
                <select id="withdraw-token" class="input-seed" style="height:50px; cursor:pointer;">
                    <option value="MATIC">MATIC (POL)</option>
                    <option value="USDT">USDT (Tether)</option>
                    <option value="FTA">FTA (Fitia)</option>
                </select>
            </div>
            <div style="margin-bottom:15px;">
                <label class="label-dim">Adresse de destination</label>
                <input type="text" id="withdraw-addr" class="input-seed" placeholder="0x...">
            </div>
            <div style="margin-bottom:15px;">
                <label class="label-dim">Montant</label>
                <input type="number" id="withdraw-amount" class="input-seed" placeholder="0.00">
            </div>
            <button class="btn-gold" onclick="App.executeWithdraw()">Envoyer</button>
            <p style="font-size:0.8rem; color:var(--warning); margin-top:10px;">
                <i class="fas fa-exclamation-circle"></i> Assurez-vous d'avoir du MATIC pour les frais de réseau (Gas).
            </p>
        `;
        document.getElementById('modal-body').innerHTML = html;
        document.getElementById('modal-title').innerText = "Retrait";
        document.getElementById('modal-overlay').classList.remove('hidden');
    }

    async executeWithdraw() {
        const tokenSymbol = document.getElementById('withdraw-token').value;
        const toAddress = document.getElementById('withdraw-addr').value;
        const amountStr = document.getElementById('withdraw-amount').value;

        if (!ethers.isAddress(toAddress)) return this.showToast("Adresse invalide", true);
        if (!amountStr || parseFloat(amountStr) <= 0) return this.showToast("Montant invalide", true);

        this.setLoader(true, "Transaction...");
        this.closeModal();

        try {
            let tx;
            // Si c'est du MATIC (Native)
            if (tokenSymbol === "MATIC") {
                const amount = ethers.parseUnits(amountStr, 18);
                const balance = await this.provider.getBalance(this.user);
                if (balance < amount) { this.setLoader(false); return this.showToast("Solde MATIC insuffisant", true); }
                
                tx = await this.signer.sendTransaction({ to: toAddress, value: amount });
            } 
            // Si c'est un Token (USDT ou FTA)
            else {
                let contract, decimals;
                if (tokenSymbol === "USDT") {
                    contract = this.contracts.usdt;
                    decimals = this.decimalsUSDT;
                } else {
                    contract = this.contracts.fta;
                    decimals = this.decimalsFTA;
                }

                const amount = ethers.parseUnits(amountStr, decimals);
                const balance = await contract.balanceOf(this.user);
                if (balance < amount) { this.setLoader(false); return this.showToast("Solde insuffisant", true); }

                tx = await contract.transfer(toAddress, amount);
            }

            this.showToast("Transaction envoyée...");
            await tx.wait();
            this.showToast("Retrait réussi !");
            this.loadAllData();

        } catch(e) {
            console.error(e);
            this.showToast("Erreur: " + (e.reason || "Transaction échouée"), true);
        }
        this.setLoader(false);
    }

    // --- DATA LOADERS ---
    async loadAllData() {
        if (!this.user) return;
        try {
            // 1. MATIC Balance (Native)
            const balMatic = await this.provider.getBalance(this.user);
            document.getElementById('bal-matic').innerText = parseFloat(ethers.formatUnits(balMatic, 18)).toFixed(4);

            // 2. Token Balances
            const balUsdt = await this.contracts.usdt.balanceOf(this.user);
            const balFta = await this.contracts.fta.balanceOf(this.user);
            document.getElementById('bal-usdt').innerText = parseFloat(ethers.formatUnits(balUsdt, this.decimalsUSDT)).toFixed(2);
            document.getElementById('bal-fta').innerText = parseFloat(ethers.formatUnits(balFta, this.decimalsFTA)).toFixed(2);

            document.getElementById('swap-bal-from').innerText = this.swapDirection === 'USDT_TO_FTA' ? parseFloat(ethers.formatUnits(balUsdt, this.decimalsUSDT)).toFixed(2) : parseFloat(ethers.formatUnits(balFta, this.decimalsFTA)).toFixed(2);
            document.getElementById('swap-bal-to').innerText = this.swapDirection === 'USDT_TO_FTA' ? parseFloat(ethers.formatUnits(balFta, this.decimalsFTA)).toFixed(2) : parseFloat(ethers.formatUnits(balUsdt, this.decimalsUSDT)).toFixed(2);

            const power = await this.contracts.mining.getActivePower(this.user);
            document.getElementById('val-power').innerText = parseFloat(ethers.formatUnits(power, this.decimalsFTA)).toFixed(5) + " FTA/s";
            
            if (this.shopData.length === 0) await this.loadShop();
            await this.loadMyMachines();
            await this.loadGameInfo();
        } catch(e) { console.error(e); }
    }

    async loadShop() {
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
        let has = false;
        for(let i=0; i<this.shopData.length; i++) {
            const count = await this.contracts.mining.getUserMachineCount(this.user, i);
            if (count > 0) {
                has = true;
                const div = document.createElement('div');
                div.className = 'rig-row';
                div.innerHTML = `<div><strong>RIG ${i+1}</strong> <span style="opacity:0.7">x${count}</span></div><div style="color:var(--primary)">${this.shopData[i].power.toFixed(5)} FTA/s</div>`;
                container.appendChild(div);
            }
        }
        document.getElementById('no-rigs').style.display = has ? 'none' : 'block';
    }

    async loadGameInfo() {
        try {
            const jp = await this.contracts.mining.getWheelJackpot();
            document.getElementById('wheel-jackpot').innerText = parseFloat(ethers.formatUnits(jp, this.decimalsFTA)).toFixed(0);
            const lp = await this.contracts.mining.getLotteryPool();
            document.getElementById('lottery-pot').innerText = parseFloat(ethers.formatUnits(lp, this.decimalsFTA)).toFixed(0);
            const rate = await this.contracts.mining.exchangeRate();
            document.getElementById('swap-rate').innerText = `1 USDT = ${parseFloat(ethers.formatUnits(rate, 8)).toFixed(0)} FTA`;
        } catch(e){}
    }

    // --- ACTIONS ---
    async buyMachine(id) { await this._buyLogic(id, false); }
    async buyMachineFTA(id) { await this._buyLogic(id, true); }

    async _buyLogic(id, useFTA) {
        if (!this.user) return;
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
            this.showToast("Achat réussi !");
            this.loadAllData();
        } catch(e) { this.showToast("Erreur", true); }
        this.setLoader(false);
    }

    async claim() {
        if(!this.user) return;
        this.setLoader(true, "Claim...");
        try { await (await this.contracts.mining.claimRewards()).wait(); this.showToast("Réclamé !"); this.loadAllData(); } 
        catch(e) { this.showToast("Erreur", true); }
        this.setLoader(false);
    }

    // --- GAMES ---
    async playWinGo(betType, choice) {
        const amt = document.getElementById('wingo-amount').value;
        if(!amt) return this.showToast("Montant requis", true);
        await this._playGame("playWinGo", [ethers.parseUnits(amt, this.decimalsFTA), betType, choice], ethers.parseUnits(amt, this.decimalsFTA));
    }
    async spinWheel() { await this._playGame("spinWheel", [], ethers.parseUnits("100", this.decimalsFTA)); }
    async goFishing() { await this._playGame("goFishing", [], ethers.parseUnits("50", this.decimalsFTA)); }
    async buyLotteryTicket() { await this._playGame("buyLotteryTicket", [], ethers.parseUnits("50", this.decimalsFTA)); }

    async _playGame(funcName, args, amount) {
        if(!this.user) return;
        this.setLoader(true, "Jeu...");
        try {
            const allowance = await this.contracts.fta.allowance(this.user, CONFIG.MINING);
            if (allowance < amount) await (await this.contracts.fta.approve(CONFIG.MINING, amount)).wait();
            await (await this.contracts.mining[funcName](...args)).wait();
            this.showToast("Jeu terminé !"); this.loadAllData();
        } catch(e) { this.showToast("Erreur", true); }
        this.setLoader(false);
    }

    // --- SWAP & NAV ---
    toggleSwap() {
        this.swapDirection = this.swapDirection === 'USDT_TO_FTA' ? 'FTA_TO_USDT' : 'USDT_TO_FTA';
        document.getElementById('token-from-display').innerText = this.swapDirection === 'USDT_TO_FTA' ? 'USDT' : 'FTA';
        document.getElementById('token-to-display').innerText = this.swapDirection === 'USDT_TO_FTA' ? 'FTA' : 'USDT';
        document.getElementById('swap-from-in').value = ''; document.getElementById('swap-to-in').value = '';
        this.loadAllData();
    }
    async calcSwap() {
        const input = document.getElementById('swap-from-in').value;
        if(!input) return;
        const rate = await this.contracts.mining.exchangeRate();
        let result = this.swapDirection === 'USDT_TO_FTA' ? input * parseFloat(ethers.formatUnits(rate, 8)) : input / parseFloat(ethers.formatUnits(rate, 8));
        document.getElementById('swap-to-in').value = result.toFixed(5);
    }
    async executeSwap() { 
        this.showToast("Fonction swap à implémenter avec allowance"); 
    }

    nav(viewId) {
        document.querySelectorAll('.view').forEach(el => { el.classList.remove('active'); el.style.display = 'none'; });
        const activeView = document.getElementById('view-' + viewId);
        if(activeView) { activeView.classList.add('active'); activeView.style.display = 'block'; }
        document.querySelectorAll('.nav-item-bit').forEach(el => el.classList.remove('active'));
        if(event && event.currentTarget) event.currentTarget.classList.add('active');
    }

    copyLink() { navigator.clipboard.writeText(document.getElementById('ref-link').value); this.showToast("Copié !"); }
    
    setLoader(show, msg="Chargement...") { 
        document.getElementById('loader-text').innerText = msg; 
        document.getElementById('loader').classList.toggle('hidden', !show); 
    }
    
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