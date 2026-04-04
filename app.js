const CONFIG = {
    MINING: "0xb7555D092b0B30D30552502f8a2674D48601b10F", // VOTRE ADRESSE CONTRAT
    USDT: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    FTA: "0x535bBe393D64a60E14B731b7350675792d501623", // VOTRE ADRESSE FTA
    CHAIN_ID: 137,
    WSS_LIST: [
        "wss://polygon.drpc.org",
        "wss://polygon-mainnet.publicnode.com",
        "wss://rpc.ankr.com/polygon/ws"
    ],
    HTTP_LIST: [
        "https://polygon.drpc.org",
        "https://polygon-mainnet.publicnode.com",
        "https://polygon.llamarpc.com"
    ],
    LOGO_USDT: "https://cryptologos.cc/logos/tether-usdt-logo.png",
    LOGO_FTA: "https://i.ibb.co/vvz2DDK5/20260207-190817.webp",
    WALLET_STORAGE_KEY: "fitia_pro_wallet_v1",
    CUSTOM_RPC_KEY: "fitia_custom_rpc"
};

const MINING_ABI = [
    "function getActivePower(address) view returns (uint256)",
    "function getMachineCount() view returns (uint256)",
    "function getUserMachineCount(address, uint256) view returns (uint256)",
    "function machineTypes(uint256) view returns (uint256 price, uint256 power)",
    "function difficultyMultiplier() view returns (uint256)",
    "function exchangeRate() view returns (uint256)",
    "function getWheelJackpot() view returns (uint256)",
    "function getLotteryPool() view returns (uint256)",
    "function buyMachine(uint256 typeId)",
    "function buyMachineWithFTA(uint256 typeId)",
    "function claimRewards()",
    "function setReferrer(address)",
    "function swapUsdtForFta(uint256 amount)",
    "function swapFtaForUsdt(uint256 amount)",
    "function playWinGo(uint256 amount, uint8 betType, uint8 choice)",
    "function spinWheel()",
    "function goFishing()",
    "function buyLotteryTicket()"
];

const ERC20_ABI = [
    "function balanceOf(address) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function approve(address, uint256) returns (bool)",
    "function allowance(address, address) view returns (uint256)",
    "function transfer(address, uint256) returns (bool)"
];

class Application {
    constructor() {
        this.provider = null; this.signer = null; this.contracts = {}; this.user = null;
        this.wallet = null; this.tempWallet = null; this.mnemonicPhrase = "";
        this.currentRate = 0; this.payMode = 'USDT'; this.swapDirection = 'USDT_TO_FTA';
        this.ftaDecimals = 18; this.currentMultiplier = 1000000000000000000n;
        this.currentRealPower = 0; this.pendingBalance = 0;
        this.miningTimer = null; this.dataInterval = null;
        this.storageKey = "fitia_last_claim_time_v2";
        this.shopData = []; this.isLoadingShop = false;
        this.vizContext = null; this.vizBars = [];
        this.wheelAngle = 0; this.wheelInterval = null;
        this.isSpinning = false; this.wheelCtx = null;
        this.importMode = 'key';
        this.treasuryMode = 'deposit'; this.treasuryToken = 'POL';
        this.treasuryBalances = { POL: '0.00', USDT: '0.00', FTA: '0.00' };
    }

    _safeDestroy(p) {
        if (p && typeof p.destroy === 'function') {
            try { p.destroy(); } catch(e) {}
        }
    }

    async init() {
        const stored = localStorage.getItem(CONFIG.WALLET_STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                document.getElementById('unlock-addr-display').innerText = parsed.address.slice(0,8) + "..." + parsed.address.slice(-6);
                this.showStep('step-unlock');
            } catch(e) {
                localStorage.removeItem(CONFIG.WALLET_STORAGE_KEY);
                this.showStep('step-welcome');
            }
        } else {
            this.showStep('step-welcome');
        }
    }

    beginCreate() {
        this.setLoader(true, "Génération...");
        setTimeout(() => {
            try {
                this.tempWallet = ethers.Wallet.createRandom();
                if (!this.tempWallet.mnemonic || !this.tempWallet.mnemonic.phrase) throw new Error("Mnemonic non généré.");
                this.mnemonicPhrase = this.tempWallet.mnemonic.phrase;
                const words = this.mnemonicPhrase.split(' ');
                const grid = document.getElementById('mnemonic-grid');
                grid.innerHTML = '';
                words.forEach((w, i) => {
                    const div = document.createElement('div');
                    div.className = 'mnemonic-word';
                    div.innerHTML = `<span class="word-num">${String(i+1).padStart(2,'0')}</span><span class="word-text">${w}</span>`;
                    grid.appendChild(div);
                });
                document.getElementById('mnemonic-saved-check').checked = false;
                document.getElementById('btn-after-mnemonic').disabled = true;
                this.setLoader(false);
                this.showStep('step-mnemonic');
            } catch(e) {
                console.error(e);
                this.setLoader(false);
                this.showToast("Erreur de génération.", true);
            }
        }, 500);
    }

    async finishCreate() {
        const pwd = document.getElementById('create-pwd').value;
        const pwdC = document.getElementById('create-pwd-confirm').value;
        if (pwd.length < 6) return this.showToast("Mot de passe trop court (min. 6)", true);
        if (pwd !== pwdC) return this.showToast("Les mots de passe ne correspondent pas", true);
        this.setLoader(true, "Chiffrement...");
        try {
            if (!window.crypto || !window.crypto.subtle) throw new Error("Contexte non sécurisé. Ouvrez via HTTPS ou localhost.");
            const encrypted = await this.tempWallet.encrypt(pwd);
            localStorage.setItem(CONFIG.WALLET_STORAGE_KEY, encrypted);
            this.wallet = this.tempWallet;
            this.tempWallet = null;
            this.mnemonicPhrase = "";
            await this._connect();
        } catch(e) {
            console.error(e);
            let msg = e.message || "Erreur inconnue";
            this.showToast(msg, true);
        }
        this.setLoader(false);
    }

    setImportMode(mode) {
        this.importMode = mode;
        document.getElementById('tab-key').classList.toggle('active', mode === 'key');
        document.getElementById('tab-mnemonic').classList.toggle('active', mode === 'mnemonic');
        document.getElementById('import-key-area').style.display = mode === 'key' ? 'block' : 'none';
        document.getElementById('import-mnemonic-area').style.display = mode === 'mnemonic' ? 'block' : 'none';
    }

    async doImport() {
        const pwd = document.getElementById('import-pwd').value;
        const pwdC = document.getElementById('import-pwd-confirm').value;
        if (pwd.length < 6) return this.showToast("Mot de passe trop court (min. 6)", true);
        if (pwd !== pwdC) return this.showToast("Les mots de passe ne correspondent pas", true);
        this.setLoader(true, "Import...");
        try {
            if (!window.crypto || !window.crypto.subtle) throw new Error("Contexte non sécurisé. Ouvrez via HTTPS ou localhost.");
            let wallet;
            if (this.importMode === 'key') {
                const key = document.getElementById('import-key').value.trim();
                if (!key || !key.startsWith('0x') || key.length < 64) return this.showToast("Clé privée invalide", true);
                wallet = new ethers.Wallet(key);
            } else {
                const phrase = document.getElementById('import-mnemonic').value.trim();
                if (!phrase || phrase.split(' ').length < 12) return this.showToast("Phrase invalide (12 mots)", true);
                wallet = ethers.Wallet.fromPhrase(phrase);
            }
            const encrypted = await wallet.encrypt(pwd);
            localStorage.setItem(CONFIG.WALLET_STORAGE_KEY, encrypted);
            this.wallet = wallet;
            await this._connect();
        } catch(e) {
            console.error(e);
            let msg = e.message || "Erreur inconnue";
            this.showToast(msg, true);
        }
        this.setLoader(false);
    }

    async unlockWallet() {
        const pwd = document.getElementById('unlock-pwd').value;
        if (!pwd) return this.showToast("Entrez votre mot de passe", true);
        this.setLoader(true, "Déverrouillage...");
        try {
            const encrypted = localStorage.getItem(CONFIG.WALLET_STORAGE_KEY);
            const wallet = await ethers.Wallet.fromEncryptedJson(encrypted, pwd);
            this.wallet = wallet;
            await this._connect();
        } catch(e) {
            this.showToast("Mot de passe incorrect", true);
        }
        this.setLoader(false);
    }

    logout() {
        this.wallet = null; this.user = null; this.contracts = {};
        this.stopMiningCounter();
        if (this.dataInterval) { clearInterval(this.dataInterval); this.dataInterval = null; }
        this._safeDestroy(this.provider);
        this.provider = null;
        document.getElementById('wallet-status').classList.add('hidden');
        document.getElementById('wallet-auth').classList.remove('hidden');
        this.hideTreasury(); this.hideWalletPanel();
        this.showStep('step-unlock');
        this.pendingBalance = 0;
        document.getElementById('val-pending').innerText = '0.00000';
        document.getElementById('val-power').innerText = '0.00000';
        document.getElementById('viz-status').innerText = 'EN ATTENTE';
        document.getElementById('viz-status').style.color = 'var(--surface-highest)';
        document.getElementById('unlock-pwd').value = '';
    }

    deleteWallet() {
        if (confirm("Supprimer ce wallet ? Irréversible sans votre phrase de récupération.")) {
            localStorage.removeItem(CONFIG.WALLET_STORAGE_KEY);
            this.logout();
            this.showStep('step-welcome');
            this.showToast("Wallet supprimé");
        }
    }

    showStep(stepId) {
        document.querySelectorAll('.auth-step').forEach(s => s.classList.remove('active'));
        document.getElementById(stepId).classList.add('active');
    }

    copyMnemonic() {
        if (!this.mnemonicPhrase) return;
        navigator.clipboard.writeText(this.mnemonicPhrase);
        this.showToast("Phrase copiée !");
    }

    showWalletPanel() {
        if (!this.wallet) return;
        document.getElementById('panel-full-addr').innerText = this.wallet.address;
        document.getElementById('wallet-panel').classList.remove('hidden');
        this._refreshTreasuryBalances();
    }

    hideWalletPanel() {
        document.getElementById('wallet-panel').classList.add('hidden');
        document.getElementById('export-modal').classList.add('hidden');
        document.getElementById('export-key-result').classList.add('hidden');
        document.getElementById('export-pwd').value = '';
    }

    copyAddress() {
        if (!this.wallet) return;
        navigator.clipboard.writeText(this.wallet.address);
        this.showToast("Adresse copiée !");
    }

    showTreasury() {
        this.hideWalletPanel();
        document.getElementById('treasury-modal').classList.remove('hidden');
        this.setTreasuryToken(this.treasuryToken);
        this.setTreasuryMode(this.treasuryMode);
        this._refreshTreasuryBalances();
    }

    hideTreasury() {
        document.getElementById('treasury-modal').classList.add('hidden');
    }

    setTreasuryMode(mode) {
        this.treasuryMode = mode;
        document.getElementById('ttab-deposit').classList.toggle('active', mode === 'deposit');
        document.getElementById('ttab-withdraw').classList.toggle('active', mode === 'withdraw');
        document.getElementById('treasury-deposit').classList.toggle('active', mode === 'deposit');
        document.getElementById('treasury-withdraw').classList.toggle('active', mode === 'withdraw');
    }

    setTreasuryToken(token) {
        this.treasuryToken = token;
        document.getElementById('ttoken-pol').classList.toggle('active', token === 'POL');
        document.getElementById('ttoken-usdt').classList.toggle('active', token === 'USDT');
        document.getElementById('ttoken-fta').classList.toggle('active', token === 'FTA');
        this._updateTreasuryUI();
    }

    _updateTreasuryUI() {
        const t = this.treasuryToken;
        const b = this.treasuryBalances[t] || '0.00';
        document.getElementById('t-deposit-label').innerText = `Solde ${t}`;
        document.getElementById('t-deposit-bal').innerText = b;
        document.getElementById('t-deposit-addr').innerText = this.wallet ? this.wallet.address : '0x...';
        document.getElementById('t-deposit-note-token').innerText = t;
        document.getElementById('t-deposit-warn-token').innerText = t;
        document.getElementById('t-withdraw-label').innerText = `Disponible ${t}`;
        document.getElementById('t-withdraw-bal').innerText = b;
    }

    async _refreshTreasuryBalances() {
        if (!this.provider || !this.wallet) return;
        try {
            const polBal = await this.provider.getBalance(this.wallet.address);
            this.treasuryBalances.POL = parseFloat(ethers.formatUnits(polBal, 18)).toFixed(4);
        } catch(e) {}
        try {
            const usdtBal = await this.contracts.usdt?.balanceOf(this.wallet.address);
            this.treasuryBalances.USDT = usdtBal ? parseFloat(ethers.formatUnits(usdtBal, 6)).toFixed(2) : '0.00';
        } catch(e) {}
        try {
            const ftaBal = await this.contracts.fta?.balanceOf(this.wallet.address);
            this.treasuryBalances.FTA = ftaBal ? parseFloat(ethers.formatUnits(ftaBal, this.ftaDecimals)).toFixed(2) : '0.00';
        } catch(e) {}
        this._updateTreasuryUI();
        document.getElementById('panel-pol-bal').innerText = this.treasuryBalances.POL;
        document.getElementById('panel-usdt-bal').innerText = this.treasuryBalances.USDT;
        document.getElementById('panel-fta-bal').innerText = this.treasuryBalances.FTA;
    }

    copyTreasuryAddr() {
        if (!this.wallet) return;
        navigator.clipboard.writeText(this.wallet.address);
        this.showToast("Adresse copiée !");
    }

    setWithdrawMax() {
        document.getElementById('t-withdraw-amount').value = this.treasuryBalances[this.treasuryToken] || '0';
    }

    updateWithdrawMax() {}

    async executeWithdraw() {
        const amountStr = document.getElementById('t-withdraw-amount').value;
        const toAddr = document.getElementById('t-withdraw-to').value.trim();
        if (!amountStr || parseFloat(amountStr) <= 0) return this.showToast("Montant invalide", true);
        if (!toAddr || !ethers.isAddress(toAddr)) return this.showToast("Adresse de destination invalide", true);

        this.setLoader(true, "Envoi en cours...");
        try {
            if (this.treasuryToken === 'POL') {
                const amount = ethers.parseEther(amountStr);
                const tx = await this.signer.sendTransaction({ to: toAddr, value: amount });
                await tx.wait();
                this.showToast("POL envoyé avec succès !");
            } else if (this.treasuryToken === 'USDT') {
                const amount = ethers.parseUnits(amountStr, 6);
                const tx = await this.contracts.usdt.transfer(toAddr, amount);
                await tx.wait();
                this.showToast("USDT envoyé avec succès !");
            } else if (this.treasuryToken === 'FTA') {
                const amount = ethers.parseUnits(amountStr, this.ftaDecimals);
                const tx = await this.contracts.fta.transfer(toAddr, amount);
                await tx.wait();
                this.showToast("FTA envoyé avec succès !");
            }
            document.getElementById('t-withdraw-amount').value = '';
            document.getElementById('t-withdraw-to').value = '';
            await this._refreshTreasuryBalances();
            this.updateData();
        } catch(e) { this.showError(e); }
        this.setLoader(false);
    }

    showExportModal() {
        this.hideWalletPanel();
        document.getElementById('export-modal').classList.remove('hidden');
        document.getElementById('export-key-result').classList.add('hidden');
        document.getElementById('export-pwd').value = '';
    }

    hideExportModal() { document.getElementById('export-modal').classList.add('hidden'); }

    async doExportKey() {
        const pwd = document.getElementById('export-pwd').value;
        if (!pwd) return this.showToast("Entrez votre mot de passe", true);
        try {
            const encrypted = localStorage.getItem(CONFIG.WALLET_STORAGE_KEY);
            const wallet = await ethers.Wallet.fromEncryptedJson(encrypted, pwd);
            document.getElementById('export-key-value').innerText = wallet.privateKey;
            document.getElementById('export-key-result').classList.remove('hidden');
        } catch(e) { this.showToast("Mot de passe incorrect", true); }
    }

    copyExportedKey() {
        navigator.clipboard.writeText(document.getElementById('export-key-value').innerText);
        this.showToast("Clé copiée !");
    }

    // ═════════════════════════════════
    //  RPC MAINNET — CORRIGÉ
    // ═════════════════════════════════

    async _tryConnect(url) {
        const isWss = url.startsWith("wss://") || url.startsWith("ws://");
        let tempProvider;
        try {
            if (isWss) {
                tempProvider = new ethers.WebSocketProvider(url);
            } else {
                tempProvider = new ethers.JsonRpcProvider(url, undefined, { staticNetwork: true });
            }
            let network;
            try {
                network = await Promise.race([
                    tempProvider.getNetwork(),
                    new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout RPC")), 12000))
                ]);
            } catch(e) {
                this._safeDestroy(tempProvider);
                return { success: false, error: "Exception réseau" };
            }
            if (Number(network.chainId) === CONFIG.CHAIN_ID) {
                this.provider = tempProvider;
                return { success: true };
            } else {
                this._safeDestroy(tempProvider);
                return { success: false, error: "Mauvais réseau détecté" };
            }
        } catch(e) {
            this._safeDestroy(tempProvider);
            return { success: false, error: e.message };
        }
    }

    async _connect() {
        this._safeDestroy(this.provider);
        this.provider = null;
        this.setLoader(true, "Connexion mainnet...");

        // 1. RPC custom sauvegardé
        const customRpc = localStorage.getItem(CONFIG.CUSTOM_RPC_KEY);
        if (customRpc) {
            this.setLoader(true, "Test RPC sauvegardé...");
            const r = await this._tryConnect(customRpc);
            if (r.success) return this._finalizeConnection();
            localStorage.removeItem(CONFIG.CUSTOM_RPC_KEY);
        }

        // 2. WebSocket RPCs
        for (let i = 0; i < CONFIG.WSS_LIST.length; i++) {
            this.setLoader(true, `WSS ${i+1}/${CONFIG.WSS_LIST.length}...`);
            if ((await this._tryConnect(CONFIG.WSS_LIST[i])).success) return this._finalizeConnection();
        }

        // 3. HTTP RPCs
        for (let i = 0; i < CONFIG.HTTP_LIST.length; i++) {
            this.setLoader(true, `RPC ${i+1}/${CONFIG.HTTP_LIST.length}...`);
            if ((await this._tryConnect(CONFIG.HTTP_LIST[i])).success) return this._finalizeConnection();
        }

        this.setLoader(false);
        const customUrl = prompt(
            "Aucun RPC Polygon accessible.\n\n" +
            "SOLUTION : Lancez un serveur local :\n" +
            "- VS Code : Extension 'Live Server' puis 'Go Live'\n" +
            "- Terminal : npx serve .\n" +
            "- Terminal : python -m http.server 8000\n\n" +
            "Ou collez ici un RPC Polygon :",
            ""
        );
        if (!customUrl || (!customUrl.startsWith("http") && !customUrl.startsWith("wss"))) {
            this.showToast("RPC requis pour continuer.", true);
            return;
        }
        this.setLoader(true, "Test RPC...");
        if ((await this._tryConnect(customUrl.trim())).success) {
            localStorage.setItem(CONFIG.CUSTOM_RPC_KEY, customUrl.trim());
            return this._finalizeConnection();
        }
        this.setLoader(false);
        this.showToast("Ce RPC ne répond pas.", true);
    }

    async _finalizeConnection() {
        try {
            this.signer = this.wallet.connect(this.provider);
            this.user = this.wallet.address;
            this.contracts.usdt = new ethers.Contract(CONFIG.USDT, ERC20_ABI, this.signer);
            this.contracts.fta = new ethers.Contract(CONFIG.FTA, ERC20_ABI, this.signer);
            this.contracts.mining = new ethers.Contract(CONFIG.MINING, MINING_ABI, this.signer);

            try { this.ftaDecimals = await this.contracts.fta.decimals(); } catch(e) { this.ftaDecimals = 18; }

            document.getElementById('wallet-auth').classList.add('hidden');
            document.getElementById('wallet-status').classList.remove('hidden');
            document.getElementById('addr-display').innerText = this.user.slice(0,6) + "..." + this.user.slice(-4);

            this.checkReferral();
            document.getElementById('ref-link').value = window.location.origin + window.location.pathname + "?ref=" + this.user;
            const ftaLogoEl = document.getElementById('logo-fta-bal');
            if(ftaLogoEl) ftaLogoEl.src = CONFIG.LOGO_FTA;

            if (!localStorage.getItem(this.storageKey)) localStorage.setItem(this.storageKey, Math.floor(Date.now() / 1000));

            this.setLoader(false);
            await this.updateData();
            if (this.dataInterval) clearInterval(this.dataInterval);
            this.dataInterval = setInterval(() => this.updateData(), 5000);
            this.initVisualizer();
            window.addEventListener('resize', () => this.resizeCanvas());
            this.initWheel();
            this.showToast("Connecté au mainnet Polygon !");
        } catch(e) {
            console.error(e);
            this.setLoader(false);
            this.showToast("Erreur finalisation : " + (e.message || "inconnue"), true);
        }
    }

    resizeCanvas() {
        if(this.vizContext) {
            const canvas = this.vizContext.canvas;
            canvas.width = canvas.offsetWidth * 2;
            canvas.height = canvas.offsetHeight * 2;
        }
    }

    async updateData() {
        if (!this.user || !this.provider) return;
        try {
            const rawPower = await this.contracts.mining.getActivePower(this.user);
            try { this.currentMultiplier = await this.contracts.mining.difficultyMultiplier(); } catch(e) { this.currentMultiplier = 1000000000000000000n; }
            const realPowerBN = (rawPower * this.currentMultiplier) / 1000000000000000000n;
            this.currentRealPower = parseFloat(ethers.formatUnits(realPowerBN, 8));
            const lastClaim = parseInt(localStorage.getItem(this.storageKey));
            const timePassed = Math.floor(Date.now() / 1000) - lastClaim;
            if (this.currentRealPower > 0) {
                if (!this.miningTimer) { this.pendingBalance = this.currentRealPower * timePassed; document.getElementById('val-pending').innerText = this.pendingBalance.toFixed(5); }
                document.getElementById('viz-status').innerText = "MINAGE ACTIF"; document.getElementById('viz-status').style.color = "var(--primary)";
                this.updateVisualizerIntensity(this.currentRealPower);
                if (!this.miningTimer) this.startMiningCounter();
            } else {
                this.stopMiningCounter();
                document.getElementById('viz-status').innerText = "AUCUNE MACHINE"; document.getElementById('viz-status').style.color = "var(--surface-highest)";
                this.pendingBalance = 0; document.getElementById('val-pending').innerText = '0.00000';
            }
            document.getElementById('val-power').innerText = this.currentRealPower.toFixed(5);

            const polBal = await this.provider.getBalance(this.user);
            const usdtBal = await this.contracts.usdt.balanceOf(this.user);
            const ftaBal = await this.contracts.fta.balanceOf(this.user);
            document.getElementById('bal-pol').innerText = parseFloat(ethers.formatUnits(polBal, 18)).toFixed(4);
            document.getElementById('bal-usdt').innerText = parseFloat(ethers.formatUnits(usdtBal, 6)).toFixed(2);
            document.getElementById('bal-fta').innerText = parseFloat(ethers.formatUnits(ftaBal, this.ftaDecimals)).toFixed(2);

            this.treasuryBalances.POL = parseFloat(ethers.formatUnits(polBal, 18)).toFixed(4);
            this.treasuryBalances.USDT = parseFloat(ethers.formatUnits(usdtBal, 6)).toFixed(2);
            this.treasuryBalances.FTA = parseFloat(ethers.formatUnits(ftaBal, this.ftaDecimals)).toFixed(2);
            this._updateTreasuryUI();

            const rate = await this.contracts.mining.exchangeRate();
            this.currentRate = parseFloat(ethers.formatUnits(rate, 8));
            document.getElementById('swap-rate').innerText = `1 USDT = ${this.currentRate.toFixed(2)} FTA`;
            const fromBal = this.swapDirection === 'USDT_TO_FTA' ? usdtBal : ftaBal;
            const toBal = this.swapDirection === 'USDT_TO_FTA' ? ftaBal : usdtBal;
            document.getElementById('swap-bal-from').innerText = parseFloat(ethers.formatUnits(fromBal, this.swapDirection === 'USDT_TO_FTA' ? 6 : this.ftaDecimals)).toFixed(2);
            document.getElementById('swap-bal-to').innerText = parseFloat(ethers.formatUnits(toBal, this.swapDirection === 'USDT_TO_FTA' ? this.ftaDecimals : 6)).toFixed(2);

            await this.renderShop(false);
            try {
                document.getElementById('wheel-jackpot').innerText = parseFloat(ethers.formatUnits(await this.contracts.mining.getWheelJackpot(), this.ftaDecimals)).toFixed(2);
                document.getElementById('lottery-pot').innerText = parseFloat(ethers.formatUnits(await this.contracts.mining.getLotteryPool(), this.ftaDecimals)).toFixed(2);
            } catch(e) {}
        } catch (e) { console.error("Refresh Error", e); }
    }

    startMiningCounter() {
        if (this.miningTimer) return;
        this.miningTimer = setInterval(() => {
            if (this.currentRealPower > 0) {
                this.pendingBalance += this.currentRealPower;
                document.getElementById('val-pending').innerText = this.pendingBalance.toFixed(5);
                document.getElementById('val-pending').style.color = 'var(--primary)';
                setTimeout(() => document.getElementById('val-pending').style.color = 'var(--text)', 500);
            }
        }, 1000);
    }

    stopMiningCounter() { if (this.miningTimer) { clearInterval(this.miningTimer); this.miningTimer = null; } }

    checkReferral() {
        const params = new URLSearchParams(window.location.search);
        const ref = params.get('ref');
        if (ref && ethers.isAddress(ref)) {
            document.getElementById('bind-ref-area').style.display = 'block';
            document.getElementById('detected-ref').innerText = ref;
        }
    }

    async bindReferrer() {
        const addr = document.getElementById('detected-ref').innerText;
        if (!ethers.isAddress(addr)) return;
        this.setLoader(true, "Liaison...");
        try {
            const tx = await this.contracts.mining.setReferrer(addr);
            await tx.wait();
            this.showToast("Parrain lié !");
            document.getElementById('bind-ref-area').style.display = 'none';
        } catch(e) { this.showError(e); }
        this.setLoader(false);
    }

    copyLink() {
        const val = document.getElementById('ref-link').value;
        if (!val || val === "Connectez-vous...") return this.showToast("Connectez-vous d'abord", true);
        navigator.clipboard.writeText(val);
        this.showToast("Lien copié !");
    }

    setPayMode(mode) {
        this.payMode = mode;
        document.getElementById('btn-pay-usdt').classList.toggle('active', mode === 'USDT');
        document.getElementById('btn-pay-fta').classList.toggle('active', mode === 'FTA');
        this.renderShop(false);
    }

    async renderShop(forceFetch = false) {
        if (this.isLoadingShop) return;
        const container = document.getElementById('shop-list');
        if (this.shopData.length > 0 && !forceFetch) { this._renderShopHTML(container); return; }
        this.isLoadingShop = true;
        try {
            const count = await this.contracts.mining.getMachineCount();
            const promises = [];
            for(let i=0; i<count; i++) promises.push(this.contracts.mining.machineTypes(i));
            const results = await Promise.all(promises);
            this.shopData = [];
            for(let i=0; i<count; i++) {
                const data = results[i];
                const priceUsdt = parseFloat(ethers.formatUnits(data.price, 6));
                const priceFta = priceUsdt * this.currentRate;
                const powerBN = BigInt(data.power.toString());
                const effectivePowerBN = (powerBN * this.currentMultiplier) / 1000000000000000000n;
                const power = parseFloat(ethers.formatUnits(effectivePowerBN, 8));
                this.shopData.push({ price: priceUsdt, power: power, priceFta: priceFta });
            }
            this._renderShopHTML(container);
        } catch(e) { console.error("Shop Error", e); }
        this.isLoadingShop = false;
    }

    _renderShopHTML(container) {
        container.innerHTML = '';
        for(let i=0; i<this.shopData.length; i++) {
            const data = this.shopData[i];
            const div = document.createElement('div');
            div.className = 'rig-item';
            div.innerHTML = `
                <div>
                    <span class="rig-name">RIG ${i+1}</span>
                    <span class="rig-power">${data.power.toFixed(5)} FTA/s</span>
                </div>
                <div>
                    <span class="rig-price">${this.payMode === 'USDT' ? data.price.toFixed(2) + ' $' : data.priceFta.toFixed(2) + ' FTA'}</span>
                    <button class="btn-primary" style="padding:8px; font-size:0.8rem" onclick="App.buyMachine(${i})">ACHETER</button>
                </div>
            `;
            container.appendChild(div);
        }
    }

    async buyMachine(id) {
        if (!this.user) return this.showToast("Wallet non connecté", true);
        this.setLoader(true, "Transaction...");
        try {
            const m = await this.contracts.mining.machineTypes(id);
            if (this.payMode === 'USDT') {
                const allow = await this.contracts.usdt.allowance(this.user, CONFIG.MINING);
                if (allow < m.price) { await (await this.contracts.usdt.approve(CONFIG.MINING, m.price)).wait(); }
                await (await this.contracts.mining.buyMachine(id)).wait();
            } else {
                const rate = await this.contracts.mining.exchangeRate();
                const ftaPrice = (m.price * rate) / 1000000n;
                const allow = await this.contracts.fta.allowance(this.user, CONFIG.MINING);
                if (allow < ftaPrice) { await (await this.contracts.fta.approve(CONFIG.MINING, ftaPrice)).wait(); }
                await (await this.contracts.mining.buyMachineWithFTA(id)).wait();
            }
            this.showToast("Achat réussi !");
            this.isLoadingShop = false;
            await this.renderShop(true);
            await this.checkMyMachines();
            this.updateData();
        } catch (e) { this.showError(e); }
        this.setLoader(false);
    }

    toggleSwap() {
        this.swapDirection = this.swapDirection === 'USDT_TO_FTA' ? 'FTA_TO_USDT' : 'USDT_TO_FTA';
        document.getElementById('token-from-display').innerText = this.swapDirection === 'USDT_TO_FTA' ? 'USDT' : 'FTA';
        document.getElementById('token-to-display').innerText = this.swapDirection === 'USDT_TO_FTA' ? 'FTA' : 'USDT';
        document.getElementById('swap-from-in').value = '';
        document.getElementById('swap-to-in').value = '';
        this.updateData();
    }

    calcSwap() {
        const val = document.getElementById('swap-from-in').value;
        if (!val) return document.getElementById('swap-to-in').value = '';
        const res = this.swapDirection === 'USDT_TO_FTA' ? val * this.currentRate : val / this.currentRate;
        document.getElementById('swap-to-in').value = res.toFixed(5);
    }

    async executeSwap() {
        const val = document.getElementById('swap-from-in').value;
        if (!val || val <= 0) return this.showToast("Montant invalide", true);
        this.setLoader(true, "Swap...");
        const isUsdtTo = this.swapDirection === 'USDT_TO_FTA';
        const decimals = isUsdtTo ? 6 : this.ftaDecimals;
        const amount = ethers.parseUnits(val, decimals);
        try {
            const tokenContract = isUsdtTo ? this.contracts.usdt : this.contracts.fta;
            const allowance = await tokenContract.allowance(this.user, CONFIG.MINING);
            if (allowance < amount) { await (await tokenContract.approve(CONFIG.MINING, amount)).wait(); }
            const tx = isUsdtTo ? await this.contracts.mining.swapUsdtForFta(amount) : await this.contracts.mining.swapFtaForUsdt(amount);
            await tx.wait();
            this.showToast("Échange réussi !");
            document.getElementById('swap-from-in').value = '';
            document.getElementById('swap-to-in').value = '';
            this.updateData();
        } catch(e) { this.showError(e); }
        this.setLoader(false);
    }

    async claim() {
        if (!this.user) return;
        this.stopMiningCounter();
        this.setLoader(true, "Claim...");
        try {
            await (await this.contracts.mining.claimRewards()).wait();
            this.pendingBalance = 0;
            localStorage.setItem(this.storageKey, Math.floor(Date.now() / 1000));
            this.showToast("Gains réclamés !");
            this.updateData();
            if (this.currentRealPower > 0) this.startMiningCounter();
        } catch(e) { this.showError(e); this.startMiningCounter(); }
        this.setLoader(false);
    }

    showGame(id) {
        document.querySelectorAll('.game-area').forEach(el => el.classList.remove('active'));
        document.getElementById('game-' + id).classList.add('active');
        document.querySelectorAll('.game-tab').forEach(btn => btn.classList.remove('active'));
        event.currentTarget.classList.add('active');
    }

    showGameResult(elementId, message, isWin) {
        const el = document.getElementById(elementId);
        el.className = "game-result-box " + (isWin ? "win" : "lose");
        el.innerText = message;
        el.classList.remove('hidden');
        setTimeout(() => el.classList.add('hidden'), 5000);
    }

    async playWinGo(type, choice) {
        const betVal = document.getElementById('wingo-bet').value;
        if (!betVal || betVal <= 0) return this.showToast("Mise invalide", true);
        const amount = ethers.parseUnits(betVal, this.ftaDecimals);
        const buttons = document.querySelectorAll('#game-wingo .game-options button');
        buttons.forEach(b => b.disabled = true);
        const reel = document.getElementById('slot-reel');
        reel.classList.add('spinning');
        try {
            const allow = await this.contracts.fta.allowance(this.user, CONFIG.MINING);
            if (allow < amount) await (await this.contracts.fta.approve(CONFIG.MINING, amount)).wait();
            const tx = await this.contracts.mining.playWinGo(amount, type, choice);
            await tx.wait();
            reel.classList.remove('spinning');
            const randomNum = Math.floor(Math.random() * 10);
            reel.style.transform = `translateY(${-80 * randomNum}px)`;
            this.showGameResult('wingo-result', `Résultat: ${randomNum}`, true);
            this.updateData();
        } catch(e) { reel.classList.remove('spinning'); reel.style.transform = 'translateY(0px)'; this.showError(e); }
        buttons.forEach(b => b.disabled = false);
    }

    initWheel() {
        const canvas = document.getElementById('wheel-canvas');
        if(!canvas) return;
        this.wheelCtx = canvas.getContext('2d');
        this.drawWheel(0);
    }

    drawWheel(rotation) {
        const ctx = this.wheelCtx; if(!ctx) return;
        const seg = ["10x", "2x", "5x", "1x", "50x", "0x", "3x", "WIN"];
        const colors = ["#f0b90b", "#b1e4ff", "#ffd87f", "#56ceff", "#ffb4ab", "#282a2e", "#c4c7ca", "#f0b90b"];
        ctx.clearRect(0, 0, 300, 300);
        ctx.save(); ctx.translate(150, 150); ctx.rotate(rotation); ctx.translate(-150, -150);
        const step = (2 * Math.PI) / seg.length;
        for(let i=0; i<seg.length; i++) {
            ctx.beginPath(); ctx.moveTo(150, 150); ctx.arc(150, 150, 140, i * step, (i + 1) * step); ctx.closePath();
            ctx.fillStyle = colors[i]; ctx.fill();
            ctx.save(); ctx.translate(150, 150); ctx.rotate(i * step + step / 2);
            ctx.textAlign = "right"; ctx.fillStyle = "#111417"; ctx.font = "bold 14px 'Space Grotesk', sans-serif";
            ctx.fillText(seg[i], 115, 5); ctx.restore();
        }
        ctx.beginPath(); ctx.arc(150, 150, 20, 0, 2 * Math.PI); ctx.fillStyle = "#0c0e12"; ctx.fill();
        ctx.restore();
    }

    async spinWheel() {
        if(this.isSpinning) return;
        this.isSpinning = true;
        const btn = document.querySelector('#game-wheel .btn-game'); btn.disabled = true;
        if (this.wheelInterval) clearInterval(this.wheelInterval);
        this.wheelInterval = setInterval(() => { this.wheelAngle += 0.2; this.drawWheel(this.wheelAngle); }, 20);
        try {
            const price = ethers.parseUnits("100", this.ftaDecimals);
            const allow = await this.contracts.fta.allowance(this.user, CONFIG.MINING);
            if (allow < price) await (await this.contracts.fta.approve(CONFIG.MINING, price)).wait();
            const tx = await this.contracts.mining.spinWheel(); await tx.wait();
            clearInterval(this.wheelInterval);
            this.wheelAngle += 5;
            this.drawWheel(this.wheelAngle);
            this.showGameResult('wheel-result', "Roue tournée !", true);
            this.updateData();
        } catch(e) { clearInterval(this.wheelInterval); this.showError(e); }
        this.isSpinning = false; btn.disabled = false;
    }

    async goFishing() {
        const line = document.getElementById('fishing-line');
        const hook = document.getElementById('fishing-hook');
        const status = document.getElementById('fishing-status');
        const btn = document.querySelector('#game-fishing .btn-game'); btn.disabled = true;
        line.style.height = '0px'; hook.style.top = '0px'; status.innerText = "Lancer...";
        try {
            const price = ethers.parseUnits("50", this.ftaDecimals);
            const allow = await this.contracts.fta.allowance(this.user, CONFIG.MINING);
            if (allow < price) await (await this.contracts.fta.approve(CONFIG.MINING, price)).wait();
            setTimeout(() => { line.style.height = '120px'; hook.style.top = '120px'; status.innerText = "Ligne lancée..."; }, 500);
            const tx = await this.contracts.mining.goFishing(); await tx.wait();
            status.innerText = "Ça mord !"; hook.style.fontSize = "3rem";
            setTimeout(() => hook.style.fontSize = "2rem", 500);
            this.showGameResult('fish-result', "Pêche réussie !", true);
            this.updateData();
        } catch(e) { line.style.height = '0px'; hook.style.top = '0px'; status.innerText="Erreur"; this.showError(e); }
        btn.disabled = false;
    }

    async buyLotteryTicket() {
        this.setLoader(true, "Ticket...");
        try {
            const price = ethers.parseUnits("50", this.ftaDecimals);
            const allow = await this.contracts.fta.allowance(this.user, CONFIG.MINING);
            if (allow < price) await (await this.contracts.fta.approve(CONFIG.MINING, price)).wait();
            await (await this.contracts.mining.buyLotteryTicket()).wait();
            this.showToast("Ticket acheté !"); this.updateData();
        } catch(e) { this.showError(e); }
        this.setLoader(false);
    }

    nav(viewId) {
        document.querySelectorAll('.view').forEach(el => { el.classList.remove('active'); el.style.display = 'none'; });
        const activeView = document.getElementById('view-' + viewId);
        if(activeView) { activeView.classList.add('active'); activeView.style.display = 'block'; }
        document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
        if(event && event.currentTarget) event.currentTarget.classList.add('active');
        if (viewId === 'my-rigs') this.checkMyMachines();
    }

    async checkMyMachines() {
        const container = document.getElementById('my-rigs-list');
        const noRigs = document.getElementById('no-rigs');
        container.innerHTML = '';
        if(!this.user) return;
        try {
            const count = await this.contracts.mining.getMachineCount();
            const promises = [];
            for(let i=0; i<count; i++) promises.push(this.contracts.mining.getUserMachineCount(this.user, i));
            const results = await Promise.all(promises);
            let found = false;
            for(let i=0; i<count; i++) {
                const machineCount = results[i];
                if (machineCount > 0) {
                    found = true;
                    let powerDisplay = "N/A";
                    if (this.shopData[i]) powerDisplay = this.shopData[i].power.toFixed(5);
                    const div = document.createElement('div');
                    div.className = 'my-rig-card active';
                    div.innerHTML = `<div class="rig-info"><h4>RIG ${i+1} <span style="opacity:0.5">x${machineCount.toString()}</span></h4><p>${powerDisplay} FTA/s</p></div><span class="rig-status-badge status-active">ACTIF</span>`;
                    container.appendChild(div);
                }
            }
            noRigs.style.display = found ? 'none' : 'block';
        } catch(e) { console.error("Erreur chargement machines", e); }
    }

    initVisualizer() {
        const canvas = document.getElementById('mining-canvas');
        if (!canvas) return;
        this.resizeCanvas();
        this.vizContext = canvas.getContext('2d');
        this.vizBars = [];
        for(let i=0; i<20; i++) this.vizBars.push({ height: 0, targetHeight: 0 });
        this.animateVisualizer();
    }

    updateVisualizerIntensity(p) {
        let intensity = p > 0 ? Math.min((p * 500) + 10, 100) : 0;
        this.vizBars.forEach(bar => bar.targetHeight = (this.vizContext.canvas.height * (intensity/100)) * Math.random());
    }

    animateVisualizer() {
        if(!this.vizContext) return;
        const ctx = this.vizContext;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = "#f0b90b";
        const w = ctx.canvas.width / 20;
        this.vizBars.forEach((bar, i) => {
            bar.height += (bar.targetHeight - bar.height) * 0.1;
            ctx.fillRect(i * w + 2, ctx.canvas.height - bar.height, w - 4, bar.height);
            bar.targetHeight += (Math.random() - 0.5) * 10;
        });
        requestAnimationFrame(() => this.animateVisualizer());
    }

    setLoader(show, msg="Chargement...") {
        const l = document.getElementById('loader');
        document.getElementById('loader-text').innerText = msg;
        show ? l.classList.remove('hidden') : l.classList.add('hidden');
    }

    showError(e) {
        console.error(e);
        let msg = "Erreur";
        if(e.reason) msg = e.reason;
        if(msg.includes("Cannot refer yourself")) msg = "Impossible de vous parrainer vous-même.";
        if(msg.includes("Referrer already set")) msg = "Parrain déjà défini.";
        if(msg.includes("Invalid bet amount")) msg = "Mise invalide";
        this.showToast(msg, true);
    }

    showToast(msg, isError=false) {
        const div = document.createElement('div');
        div.className = 'toast';
        if (isError) div.style.borderLeftColor = 'var(--danger)';
        div.innerText = msg;
        document.getElementById('toast-container').appendChild(div);
        setTimeout(() => div.remove(), 4000);
    }
}

const App = new Application();
window.onload = () => App.init();