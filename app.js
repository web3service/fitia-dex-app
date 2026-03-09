// ============================================
// FITIA PRO - Application Production
// Version: 2.0.0 - Polygon Mainnet
// ============================================

class Application {
    constructor() {
        this.provider = null;
        this.signer = null;
        this.contracts = {};
        this.user = null;
        this.currentRate = 0;
        this.payMode = 'USDT';
        this.swapDirection = 'USDT_TO_FTA';
        this.ftaDecimals = 8;
        this.currentMultiplier = 1000000000000000000n;
        this.currentRealPower = 0;
        this.pendingBalance = 0;
        this.miningTimer = null;
        this.storageKey = "fitia_last_claim_time_v2";
        this.shopData = [];
        this.isLoadingShop = false;
        this.vizContext = null;
        this.vizBars = [];
        this.wheelAngle = 0;
        this.wheelInterval = null;
        this.isSpinning = false;
        this.wheelCtx = null;
        this.lastTransactionHash = null;
    }

    // ==========================================
    // INITIALISATION
    // ==========================================
    async init() {
        console.log('🚀 FITIA PRO - Initialisation...');
        
        // Vérifier MetaMask
        if (typeof window.ethereum !== 'undefined') {
            this.provider = new ethers.BrowserProvider(window.ethereum);
            
            // Écouteurs d'événements
            window.ethereum.on('accountsChanged', (accounts) => {
                console.log('📍 Accounts changed:', accounts);
                window.location.reload();
            });
            
            window.ethereum.on('chainChanged', (chainId) => {
                console.log('📍 Chain changed:', chainId);
                window.location.reload();
            });
            
            console.log('✅ MetaMask détecté');
        } else {
            console.error('❌ MetaMask non installé');
            this.showToast("⚠️ Installez MetaMask pour continuer", true);
        }
    }

    // ==========================================
    // CONNEXION WALLET
    // ==========================================
    async connect() {
        if (typeof window.ethereum === 'undefined') {
            this.showToast("❌ MetaMask non installé", true);
            return;
        }

        this.setLoader(true, "Connexion au wallet...");

        try {
            // Demander connexion
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            
            // Récupérer signer
            this.signer = await this.provider.getSigner();
            this.user = await this.signer.getAddress();
            
            console.log('✅ Wallet connecté:', this.user);

            // Vérifier réseau
            const network = await this.provider.getNetwork();
            const currentChainId = Number(network.chainId);
            console.log('📍 Chain ID actuel:', currentChainId);

            if (currentChainId !== CONFIG.CHAIN_ID) {
                console.warn('⚠️ Mauvais réseau, switch vers Polygon...');
                await this.switchNetwork();
            }

            // Initialiser contrats
            this.contracts.usdt = new ethers.Contract(CONFIG.USDT, ERC20_ABI, this.signer);
            this.contracts.fta = new ethers.Contract(CONFIG.FTA, ERC20_ABI, this.signer);
            this.contracts.mining = new ethers.Contract(CONFIG.MINING, MINING_ABI, this.signer);

            // Récupérer décimales FTA
            try {
                this.ftaDecimals = await this.contracts.fta.decimals();
                console.log('📍 FTA Decimals:', this.ftaDecimals);
            } catch(e) {
                console.warn('⚠️ Impossible de lire decimals FTA, utilisation de 18');
                this.ftaDecimals = 18;
            }

            // Mettre à jour UI
            document.getElementById('btn-connect').classList.add('hidden');
            document.getElementById('wallet-status').classList.remove('hidden');
            document.getElementById('addr-display').innerText = 
                this.user.slice(0,6) + "..." + this.user.slice(-4);

            // Lien de parrainage
            this.checkReferral();
            document.getElementById('ref-link').value = window.location.origin + "?ref=" + this.user;

            // Logo FTA
            const ftaLogoEl = document.getElementById('logo-fta-bal');
            if(ftaLogoEl) ftaLogoEl.src = CONFIG.LOGO_FTA;

            // Initialiser storage
            if (!localStorage.getItem(this.storageKey)) {
                localStorage.setItem(this.storageKey, Math.floor(Date.now() / 1000));
            }

            // Charger données
            await this.updateData();
            setInterval(() => this.updateData(), 5000);
            
            // Visualizer
            this.initVisualizer();
            window.addEventListener('resize', () => this.resizeCanvas());
            
            // Wheel
            this.initWheel();

            this.showToast("✅ Wallet connecté avec succès!");

        } catch (error) {
            console.error('❌ Erreur connexion:', error);
            this.showError(error);
        }

        this.setLoader(false);
    }

    // ==========================================
    // CHANGEMENT DE RÉSEAU
    // ==========================================
    async switchNetwork() {
        try {
            console.log('🔄 Switch vers Polygon...');
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: CONFIG.CHAIN_ID_HEX }]
            });
            this.showToast("✅ Réseau changé vers Polygon", 'success');
        } catch (error) {
            if (error.code === 4902) {
                console.log('📝 Ajout de Polygon au wallet...');
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: CONFIG.CHAIN_ID_HEX,
                            chainName: CONFIG.NETWORK_NAME,
                            nativeCurrency: {
                                name: 'MATIC',
                                symbol: 'MATIC',
                                decimals: 18
                            },
                            rpcUrls: [CONFIG.RPC_URL],
                            blockExplorerUrls: [CONFIG.EXPLORER_URL]
                        }]
                    });
                    this.showToast("✅ Polygon ajouté au wallet", 'success');
                } catch (addError) {
                    console.error('❌ Erreur ajout réseau:', addError);
                    this.showToast("❌ Impossible d'ajouter Polygon", true);
                }
            } else {
                console.error('❌ Erreur switch réseau:', error);
                this.showToast("❌ Veuillez changer manuellement pour Polygon", true);
            }
        }
    }

    // ==========================================
    // MISE À JOUR DES DONNÉES
    // ==========================================
    async updateData() {
        if (!this.user) return;

        try {
            // Power
            const rawPower = await this.contracts.mining.getActivePower(this.user);
            
            try {
                this.currentMultiplier = await this.contracts.mining.difficultyMultiplier();
            } catch(e) {
                console.warn('⚠️ difficultyMultiplier non disponible');
                this.currentMultiplier = 1000000000000000000n;
            }

            const realPowerBN = (rawPower * this.currentMultiplier) / 1000000000000000000n;
            this.currentRealPower = parseFloat(ethers.formatUnits(realPowerBN, 8));

            // Pending
            const lastClaim = parseInt(localStorage.getItem(this.storageKey));
            const timePassed = Math.floor(Date.now() / 1000) - lastClaim;

            if (this.currentRealPower > 0) {
                if (!this.miningTimer) {
                    this.pendingBalance = this.currentRealPower * timePassed;
                    document.getElementById('val-pending').innerText = this.pendingBalance.toFixed(5);
                }
                document.getElementById('viz-status').innerText = "MINAGE ACTIF";
                document.getElementById('viz-status').style.color = "var(--primary)";
                this.updateVisualizerIntensity(this.currentRealPower);
                if (!this.miningTimer) this.startMiningCounter();
            } else {
                this.stopMiningCounter();
                document.getElementById('viz-status').innerText = "AUCUNE MACHINE";
                document.getElementById('viz-status').style.color = "#666";
                this.pendingBalance = 0;
                document.getElementById('val-pending').innerText = "0.00000";
            }

            document.getElementById('val-power').innerText = this.currentRealPower.toFixed(5);

            // Balances
            const usdtBal = await this.contracts.usdt.balanceOf(this.user);
            const ftaBal = await this.contracts.fta.balanceOf(this.user);
            document.getElementById('bal-usdt').innerText = parseFloat(ethers.formatUnits(usdtBal, 6)).toFixed(2);
            document.getElementById('bal-fta').innerText = parseFloat(ethers.formatUnits(ftaBal, this.ftaDecimals)).toFixed(2);

            // Exchange Rate
            const rate = await this.contracts.mining.exchangeRate();
            this.currentRate = parseFloat(ethers.formatUnits(rate, 6));
            document.getElementById('swap-rate').innerText = `1 USDT = ${this.currentRate.toFixed(2)} FTA`;

            // Swap balances
            const fromBal = this.swapDirection === 'USDT_TO_FTA' ? usdtBal : ftaBal;
            const toBal = this.swapDirection === 'USDT_TO_FTA' ? ftaBal : usdtBal;
            document.getElementById('swap-bal-from').innerText = parseFloat(
                ethers.formatUnits(fromBal, this.swapDirection === 'USDT_TO_FTA' ? 6 : this.ftaDecimals)
            ).toFixed(2);
            document.getElementById('swap-bal-to').innerText = parseFloat(
                ethers.formatUnits(toBal, this.swapDirection === 'USDT_TO_FTA' ? this.ftaDecimals : 6)
            ).toFixed(2);

            // Shop
            await this.renderShop(false);

            // Jackpots
            try {
                const jackpot = await this.contracts.mining.getWheelJackpot();
                document.getElementById('wheel-jackpot').innerText = 
                    parseFloat(ethers.formatUnits(jackpot, this.ftaDecimals)).toFixed(2);
                
                const pool = await this.contracts.mining.getLotteryPool();
                document.getElementById('lottery-pot').innerText = 
                    parseFloat(ethers.formatUnits(pool, this.ftaDecimals)).toFixed(2);
            } catch(e) {
                console.warn('⚠️ Jackpots non disponibles');
            }

        } catch (error) {
            console.error("❌ Refresh Error:", error);
        }
    }

    // ==========================================
    // MINING COUNTER
    // ==========================================
    startMiningCounter() {
        if (this.miningTimer) return;
        this.miningTimer = setInterval(() => {
            if (this.currentRealPower > 0) {
                this.pendingBalance += this.currentRealPower;
                document.getElementById('val-pending').innerText = this.pendingBalance.toFixed(5);
                document.getElementById('val-pending').style.color = 'var(--primary)';
                setTimeout(() => {
                    document.getElementById('val-pending').style.color = 'var(--text)';
                }, 500);
            }
        }, 1000);
    }

    stopMiningCounter() {
        if (this.miningTimer) {
            clearInterval(this.miningTimer);
            this.miningTimer = null;
        }
    }

    // ==========================================
    // PARRAINAGE
    // ==========================================
    checkReferral() {
        const params = new URLSearchParams(window.location.search);
        const ref = params.get('ref');
        if (ref && ethers.isAddress(ref)) {
            document.getElementById('bind-ref-area').style.display = 'block';
            document.getElementById('detected-ref').innerText = ref.slice(0,10) + '...';
        }
    }

    async bindReferrer() {
        const addr = document.getElementById('detected-ref').innerText;
        if (!ethers.isAddress(addr)) {
            this.showToast("❌ Adresse invalide", true);
            return;
        }

        this.setLoader(true, "Liaison du parrain...");
        try {
            const tx = await this.contracts.mining.setReferrer(addr);
            await tx.wait();
            this.showToast("✅ Parrain lié avec succès!");
            document.getElementById('bind-ref-area').style.display = 'none';
        } catch(error) {
            this.showError(error);
        }
        this.setLoader(false);
    }

    copyLink() {
        const val = document.getElementById('ref-link').value;
        if (!val || val.includes("Connectez-vous")) {
            this.showToast("⚠️ Connectez-vous d'abord", true);
            return;
        }
        navigator.clipboard.writeText(val);
        this.showToast("📋 Lien copié!");
    }

    // ==========================================
    // SHOP
    // ==========================================
    setPayMode(mode) {
        this.payMode = mode;
        document.getElementById('btn-pay-usdt').classList.toggle('active', mode === 'USDT');
        document.getElementById('btn-pay-fta').classList.toggle('active', mode === 'FTA');
        this.renderShop(false);
    }

    async renderShop(forceFetch = false) {
        if (this.isLoadingShop) return;
        const container = document.getElementById('shop-list');

        if (this.shopData.length > 0 && !forceFetch) {
            this._renderShopHTML(container);
            return;
        }

        this.isLoadingShop = true;
        try {
            const count = await this.contracts.mining.getMachineCount();
            const promises = [];
            for(let i=0; i<count; i++) {
                promises.push(this.contracts.mining.machineTypes(i));
            }
            const results = await Promise.all(promises);

            this.shopData = [];
            for(let i=0; i<count; i++) {
                const data = results[i];
                const priceUsdt = parseFloat(ethers.formatUnits(data.price, 6));
                const priceFta = priceUsdt * this.currentRate;
                const powerBN = BigInt(data.power.toString());
                const effectivePowerBN = (powerBN * this.currentMultiplier) / 1000000000000000000n;
                const power = parseFloat(ethers.formatUnits(effectivePowerBN, 8));

                this.shopData.push({ 
                    id: i,
                    price: priceUsdt, 
                    power: power, 
                    priceFta: priceFta 
                });
            }
            this._renderShopHTML(container);
        } catch(error) {
            console.error("❌ Shop Error:", error);
            this.showToast("⚠️ Erreur chargement boutique", true);
        }
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
                    <span class="rig-price">${
                        this.payMode === 'USDT' 
                            ? data.price.toFixed(2) + ' USDT' 
                            : data.priceFta.toFixed(2) + ' FTA'
                    }</span>
                    <button class="btn-primary" style="padding:8px; font-size:0.8rem" 
                        onclick="App.buyMachine(${i})">ACHETER</button>
                </div>
            `;
            container.appendChild(div);
        }
    }

    async buyMachine(id) {
        if (!this.user) {
            this.showToast("⚠️ Connectez votre wallet", true);
            return this.connect();
        }

        this.setLoader(true, "Préparation transaction...");
        try {
            const machine = await this.contracts.mining.machineTypes(id);
            
            if (this.payMode === 'USDT') {
                // Vérifier solde USDT
                const balance = await this.contracts.usdt.balanceOf(this.user);
                if (balance < machine.price) {
                    this.showToast("❌ Solde USDT insuffisant", true);
                    this.setLoader(false);
                    return;
                }

                // Approve
                const allow = await this.contracts.usdt.allowance(this.user, CONFIG.MINING);
                if (allow < machine.price) {
                    this.showToast("📤 Approbation USDT...", 'info');
                    const approveTx = await this.contracts.usdt.approve(CONFIG.MINING, machine.price);
                    await approveTx.wait();
                    console.log('✅ USDT approved');
                }

                // Buy
                this.showToast("📤 Achat en cours...", 'info');
                const tx = await this.contracts.mining.buyMachine(id);
                await tx.wait();
                console.log('✅ Machine achetée:', tx.hash);
                this.lastTransactionHash = tx.hash;

            } else {
                // FTA
                const rate = await this.contracts.mining.exchangeRate();
                const ftaPrice = (machine.price * rate) / 1000000n;

                const balance = await this.contracts.fta.balanceOf(this.user);
                if (balance < ftaPrice) {
                    this.showToast("❌ Solde FTA insuffisant", true);
                    this.setLoader(false);
                    return;
                }

                const allow = await this.contracts.fta.allowance(this.user, CONFIG.MINING);
                if (allow < ftaPrice) {
                    this.showToast("📤 Approbation FTA...", 'info');
                    const approveTx = await this.contracts.fta.approve(CONFIG.MINING, ftaPrice);
                    await approveTx.wait();
                }

                this.showToast("📤 Achat en cours...", 'info');
                const tx = await this.contracts.mining.buyMachineWithFTA(id);
                await tx.wait();
                console.log('✅ Machine achetée:', tx.hash);
                this.lastTransactionHash = tx.hash;
            }

            this.showToast("✅ Achat réussi!");
            this.isLoadingShop = false;
            await this.renderShop(true);
            await this.checkMyMachines();
            this.updateData();

        } catch (error) {
            console.error('❌ Buy Error:', error);
            this.showError(error);
        }
        this.setLoader(false);
    }

    // ==========================================
    // SWAP
    // ==========================================
    toggleSwap() {
        this.swapDirection = this.swapDirection === 'USDT_TO_FTA' ? 'FTA_TO_USDT' : 'USDT_TO_FTA';
        document.getElementById('token-from-display').querySelector('span').innerText = 
            this.swapDirection === 'USDT_TO_FTA' ? 'USDT' : 'FTA';
        document.getElementById('token-to-display').querySelector('span').innerText = 
            this.swapDirection === 'USDT_TO_FTA' ? 'FTA' : 'USDT';
        this.updateData();
    }

    calcSwap() {
        const val = document.getElementById('swap-from-in').value;
        if (!val) {
            document.getElementById('swap-to-in').value = '';
            return;
        }
        const res = this.swapDirection === 'USDT_TO_FTA' 
            ? val * this.currentRate 
            : val / this.currentRate;
        document.getElementById('swap-to-in').value = res.toFixed(5);
    }

    async executeSwap() {
        const val = document.getElementById('swap-from-in').value;
        if (!val || val <= 0) {
            this.showToast("⚠️ Montant invalide", true);
            return;
        }

        this.setLoader(true, "Préparation échange...");
        const isUsdtTo = this.swapDirection === 'USDT_TO_FTA';
        const decimals = isUsdtTo ? 6 : this.ftaDecimals;
        const amount = ethers.parseUnits(val, decimals);

        try {
            const tokenContract = isUsdtTo ? this.contracts.usdt : this.contracts.fta;
            
            // Vérifier solde
            const balance = await tokenContract.balanceOf(this.user);
            if (balance < amount) {
                this.showToast("❌ Solde insuffisant", true);
                this.setLoader(false);
                return;
            }

            // Approve
            const allowance = await tokenContract.allowance(this.user, CONFIG.MINING);
            if (allowance < amount) {
                this.showToast("📤 Approbation...", 'info');
                const approveTx = await tokenContract.approve(CONFIG.MINING, amount);
                await approveTx.wait();
            }

            // Swap
            this.showToast("📤 Échange en cours...", 'info');
            const tx = isUsdtTo 
                ? await this.contracts.mining.swapUsdtForFta(amount) 
                : await this.contracts.mining.swapFtaForUsdt(amount);
            await tx.wait();
            console.log('✅ Swap réussi:', tx.hash);
            this.lastTransactionHash = tx.hash;

            this.showToast("✅ Échange réussi!");
            document.getElementById('swap-from-in').value = '';
            this.updateData();

        } catch(error) {
            console.error('❌ Swap Error:', error);
            this.showError(error);
        }
        this.setLoader(false);
    }

    // ==========================================
    // CLAIM
    // ==========================================
    async claim() {
        if (!this.user) {
            this.showToast("⚠️ Connectez votre wallet", true);
            return;
        }

        if (this.pendingBalance <= 0) {
            this.showToast("⚠️ Rien à réclamer", true);
            return;
        }

        this.stopMiningCounter();
        this.setLoader(true, "Réclamation en cours...");

        try {
            this.showToast("📤 Transaction en cours...", 'info');
            const tx = await this.contracts.mining.claimRewards();
            await tx.wait();
            console.log('✅ Claim réussi:', tx.hash);
            this.lastTransactionHash = tx.hash;

            this.pendingBalance = 0;
            localStorage.setItem(this.storageKey, Math.floor(Date.now() / 1000));
            this.showToast("✅ Gains réclamés avec succès!");
            this.updateData();

            if (this.currentRealPower > 0) {
                this.startMiningCounter();
            }

        } catch(error) {
            console.error('❌ Claim Error:', error);
            this.showError(error);
            this.startMiningCounter();
        }
        this.setLoader(false);
    }

    // ==========================================
    // NAVIGATION
    // ==========================================
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
        
        if (viewId === 'my-rigs') this.checkMyMachines();
    }

    showGame(id) {
        document.querySelectorAll('.game-area').forEach(el => el.classList.remove('active'));
        document.getElementById('game-' + id).classList.add('active');
        document.querySelectorAll('.game-tab').forEach(btn => btn.classList.remove('active'));
        event.currentTarget.classList.add('active');
    }

    // ==========================================
    // MES MACHINES
    // ==========================================
    async checkMyMachines() {
        const container = document.getElementById('my-rigs-list');
        const noRigs = document.getElementById('no-rigs');
        container.innerHTML = '';
        
        if(!this.user) {
            noRigs.style.display = 'block';
            return;
        }

        try {
            const count = await this.contracts.mining.getMachineCount();
            const promises = [];
            for(let i=0; i<count; i++) {
                promises.push(this.contracts.mining.getUserMachineCount(this.user, i));
            }
            const results = await Promise.all(promises);
            
            let found = false;
            
            for(let i=0; i<count; i++) {
                const machineCount = results[i];
                if (machineCount > 0n || machineCount > 0) {
                    found = true;
                    let powerDisplay = "N/A";
                    if (this.shopData[i]) {
                        powerDisplay = this.shopData[i].power.toFixed(5);
                    }
                    
                    const div = document.createElement('div');
                    div.className = 'my-rig-card active';
                    div.innerHTML = `
                        <div class="rig-info">
                            <h4>RIG ${i+1} <span style="opacity:0.5">x${machineCount.toString()}</span></h4>
                            <p>${powerDisplay} FTA/s</p>
                        </div>
                        <span class="rig-status-badge">ACTIF</span>
                    `;
                    container.appendChild(div);
                }
            }
            
            noRigs.style.display = found ? 'none' : 'block';

        } catch(error) {
            console.error("❌ Erreur chargement machines:", error);
            noRigs.style.display = 'block';
        }
    }

    // ==========================================
    // JEUX
    // ==========================================
    showGameResult(elementId, message, isWin) {
        const el = document.getElementById(elementId);
        el.className = "game-result-box " + (isWin ? "win" : "lose");
        el.innerText = message;
        el.classList.remove('hidden');
        setTimeout(() => el.classList.add('hidden'), 5000);
    }

    async playWinGo(type, choice) {
        const betVal = document.getElementById('wingo-bet').value;
        if (!betVal || betVal <= 0) {
            this.showToast("⚠️ Mise invalide", true);
            return;
        }

        const amount = ethers.parseUnits(betVal, this.ftaDecimals);
        const buttons = document.querySelectorAll('#game-wingo .game-options button');
        buttons.forEach(b => b.disabled = true);

        const reel = document.getElementById('slot-reel');
        reel.classList.add('spinning');

        try {
            // Vérifier solde
            const balance = await this.contracts.fta.balanceOf(this.user);
            if (balance < amount) {
                this.showToast("❌ Solde FTA insuffisant", true);
                reel.classList.remove('spinning');
                buttons.forEach(b => b.disabled = false);
                return;
            }

            // Approve
            const allow = await this.contracts.fta.allowance(this.user, CONFIG.MINING);
            if (allow < amount) {
                this.showToast("📤 Approbation FTA...", 'info');
                await (await this.contracts.fta.approve(CONFIG.MINING, amount)).wait();
            }

            // Play
            this.showToast("📤 Partie en cours...", 'info');
            const tx = await this.contracts.mining.playWinGo(amount, type, choice);
            await tx.wait();
            console.log('✅ WinGo joué:', tx.hash);
            this.lastTransactionHash = tx.hash;

            reel.classList.remove('spinning');
            const randomNum = Math.floor(Math.random() * 10);
            const finalOffset = -70 * randomNum;
            reel.style.transform = `translateY(${finalOffset}px)`;

            this.showGameResult('wingo-result', `Résultat: ${randomNum}`, true);
            this.updateData();

        } catch(error) {
            console.error('❌ WinGo Error:', error);
            reel.classList.remove('spinning');
            reel.style.transform = 'translateY(0px)';
            this.showError(error);
        }
        buttons.forEach(b => b.disabled = false);
    }

    initWheel() {
        const canvas = document.getElementById('wheel-canvas');
        if(!canvas) return;
        this.wheelCtx = canvas.getContext('2d');
        this.drawWheel(0);
    }

    drawWheel(rotation) {
        const ctx = this.wheelCtx;
        if(!ctx) return;
        const seg = ["10x", "2x", "5x", "1x", "50x", "0x", "3x", "WIN"];
        const colors = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ef4444", "#1e293b", "#ec4899", "#fbbf24"];

        ctx.clearRect(0, 0, 300, 300);
        ctx.save();
        ctx.translate(150, 150);
        ctx.rotate(rotation);
        ctx.translate(-150, -150);

        const step = (2 * Math.PI) / seg.length;
        for(let i=0; i<seg.length; i++) {
            ctx.beginPath();
            ctx.moveTo(150, 150);
            ctx.arc(150, 150, 140, i * step, (i + 1) * step);
            ctx.closePath();
            ctx.fillStyle = colors[i];
            ctx.fill();
            ctx.strokeStyle = "#fff";
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.save();
            ctx.translate(150, 150);
            ctx.rotate(i * step + step / 2);
            ctx.textAlign = "right";
            ctx.fillStyle = "#fff";
            ctx.font = "bold 14px sans-serif";
            ctx.fillText(seg[i], 110, 5);
            ctx.restore();
        }
        ctx.beginPath();
        ctx.arc(150, 150, 20, 0, 2 * Math.PI);
        ctx.fillStyle = "#000";
        ctx.fill();
        ctx.restore();
    }

    async spinWheel() {
        if(this.isSpinning) return;
        this.isSpinning = true;

        const btn = document.querySelector('#game-wheel .btn-game');
        btn.disabled = true;

        if (this.wheelInterval) clearInterval(this.wheelInterval);
        this.wheelInterval = setInterval(() => {
            this.wheelAngle += 0.2;
            this.drawWheel(this.wheelAngle);
        }, 20);

        try {
            const price = ethers.parseUnits(CONFIG.GAMES.WHEEL.toString(), this.ftaDecimals);

            // Vérifier solde
            const balance = await this.contracts.fta.balanceOf(this.user);
            if (balance < price) {
                this.showToast(`❌ Solde insuffisant (${CONFIG.GAMES.WHEEL} FTA requis)`, true);
                clearInterval(this.wheelInterval);
                this.isSpinning = false;
                btn.disabled = false;
                return;
            }

            // Approve
            const allow = await this.contracts.fta.allowance(this.user, CONFIG.MINING);
            if (allow < price) {
                this.showToast("📤 Approbation FTA...", 'info');
                await (await this.contracts.fta.approve(CONFIG.MINING, price)).wait();
            }

            // Spin
            this.showToast("📤 La roue tourne...", 'info');
            const tx = await this.contracts.mining.spinWheel();
            await tx.wait();
            console.log('✅ Wheel joué:', tx.hash);
            this.lastTransactionHash = tx.hash;

            clearInterval(this.wheelInterval);
            this.wheelAngle += 5;
            this.drawWheel(this.wheelAngle);

            this.showGameResult('wheel-result', "✅ Tour terminé!", true);
            this.updateData();

        } catch(error) {
            console.error('❌ Wheel Error:', error);
            clearInterval(this.wheelInterval);
            this.showError(error);
        }

        this.isSpinning = false;
        btn.disabled = false;
    }

    async goFishing() {
        const line = document.getElementById('fishing-line');
        const hook = document.getElementById('fishing-hook');
        const status = document.getElementById('fishing-status');
        const btn = document.querySelector('#game-fishing .btn-game');
        btn.disabled = true;

        line.style.height = '0px';
        hook.style.top = '0px';
        status.innerText = "Préparation...";

        try {
            const price = ethers.parseUnits(CONFIG.GAMES.FISHING.toString(), this.ftaDecimals);

            // Vérifier solde
            const balance = await this.contracts.fta.balanceOf(this.user);
            if (balance < price) {
                this.showToast(`❌ Solde insuffisant (${CONFIG.GAMES.FISHING} FTA requis)`, true);
                btn.disabled = false;
                return;
            }

            // Approve
            const allow = await this.contracts.fta.allowance(this.user, CONFIG.MINING);
            if (allow < price) {
                this.showToast("📤 Approbation FTA...", 'info');
                await (await this.contracts.fta.approve(CONFIG.MINING, price)).wait();
            }

            // Animation
            setTimeout(() => {
                line.style.height = '120px';
                hook.style.top = '120px';
                status.innerText = "Ligne lancée...";
            }, 500);

            // Play
            this.showToast("📤 Pêche en cours...", 'info');
            const tx = await this.contracts.mining.goFishing();
            await tx.wait();
            console.log('✅ Fishing joué:', tx.hash);
            this.lastTransactionHash = tx.hash;

            status.innerText = "✅ Ça mord!";
            hook.style.fontSize = "3rem";
            setTimeout(() => hook.style.fontSize = "2rem", 500);

            this.showGameResult('fish-result', "Pêche réussie!", true);
            this.updateData();

        } catch(error) {
            console.error('❌ Fishing Error:', error);
            line.style.height = '0px';
            hook.style.top = '0px';
            status.innerText = "❌ Erreur";
            this.showError(error);
        }
        btn.disabled = false;
    }

    async buyLotteryTicket() {
        this.setLoader(true, "Achat ticket...");
        try {
            const price = ethers.parseUnits(CONFIG.GAMES.LOTTERY.toString(), this.ftaDecimals);

            // Vérifier solde
            const balance = await this.contracts.fta.balanceOf(this.user);
            if (balance < price) {
                this.showToast(`❌ Solde insuffisant (${CONFIG.GAMES.LOTTERY} FTA requis)`, true);
                this.setLoader(false);
                return;
            }

            // Approve
            const allow = await this.contracts.fta.allowance(this.user, CONFIG.MINING);
            if (allow < price) {
                this.showToast("📤 Approbation FTA...", 'info');
                await (await this.contracts.fta.approve(CONFIG.MINING, price)).wait();
            }

            // Buy
            this.showToast("📤 Achat en cours...", 'info');
            const tx = await this.contracts.mining.buyLotteryTicket();
            await tx.wait();
            console.log('✅ Lottery ticket acheté:', tx.hash);
            this.lastTransactionHash = tx.hash;

            this.showToast("✅ Ticket acheté!");
            this.updateData();

        } catch(error) {
            console.error('❌ Lottery Error:', error);
            this.showError(error);
        }
        this.setLoader(false);
    }

    // ==========================================
    // VISUALIZER
    // ==========================================
    resizeCanvas() {
        if(this.vizContext) {
            const canvas = this.vizContext.canvas;
            canvas.width = canvas.offsetWidth * 2;
            canvas.height = canvas.offsetHeight * 2;
        }
    }

    initVisualizer() {
        const canvas = document.getElementById('mining-canvas');
        if (!canvas) return;
        this.resizeCanvas();
        this.vizContext = canvas.getContext('2d');
        this.vizBars = [];
        for(let i=0; i<20; i++) {
            this.vizBars.push({ height: 0, targetHeight: 0 });
        }
        this.animateVisualizer();
    }

    updateVisualizerIntensity(p) {
        let intensity = p > 0 ? Math.min((p * 500) + 10, 100) : 0;
        this.vizBars.forEach(bar => {
            bar.targetHeight = (this.vizContext.canvas.height * (intensity/100)) * Math.random();
        });
    }

    animateVisualizer() {
        if(!this.vizContext) return;
        const ctx = this.vizContext;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = "#10b981";
        const w = ctx.canvas.width / 20;
        this.vizBars.forEach((bar, i) => {
            bar.height += (bar.targetHeight - bar.height) * 0.1;
            ctx.fillRect(i * w + 2, ctx.canvas.height - bar.height, w - 4, bar.height);
            bar.targetHeight += (Math.random() - 0.5) * 10;
        });
        requestAnimationFrame(() => this.animateVisualizer());
    }

    // ==========================================
    // UTILITAIRES
    // ==========================================
    setLoader(show, msg="Chargement...") {
        const l = document.getElementById('loader');
        document.getElementById('loader-text').innerText = msg;
        show ? l.classList.remove('hidden') : l.classList.add('hidden');
    }

    showError(error) {
        console.error('❌ Error:', error);
        let msg = "❌ Erreur de transaction";
        
        if (error.reason) msg = error.reason;
        if (error.message) {
            if (error.message.includes('user rejected')) msg = "❌ Transaction refusée";
            if (error.message.includes('insufficient funds')) msg = "❌ Solde MATIC insuffisant pour les frais";
            if (error.message.includes('failed')) msg = "❌ Transaction échouée";
            if (error.message.includes('allowance')) msg = "❌ Approbation requise";
            if (error.message.includes('coalesce')) msg = "❌ Erreur réseau - Réessayez";
        }
        if (error.code === 'ACTION_REJECTED') msg = "❌ Transaction refusée";
        if (error.code === 'INSUFFICIENT_FUNDS') msg = "❌ Solde insuffisant";

        this.showToast(msg, true);
    }

    showToast(msg, isError=false) {
        const container = document.getElementById('toast-container');
        const div = document.createElement('div');
        div.className = 'toast';
        div.style.borderLeftColor = isError ? 'var(--danger)' : 'var(--success)';
        div.innerText = msg;
        container.appendChild(div);
        setTimeout(() => {
            div.style.opacity = '0';
            setTimeout(() => div.remove(), 300);
        }, 4000);
    }
}

// ============================================
// INITIALISATION
// ============================================
const App = new Application();

document.addEventListener('DOMContentLoaded', () => {
    console.log('📱 FITIA PRO - DOM Ready');
    App.init();
});

window.App = App;