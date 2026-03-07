// ============================================
// FITIA PRO - Application JavaScript
// Version Production - Polygon Mainnet
// ============================================

const App = {
    state: {
        connected: false,
        address: null,
        provider: null,
        signer: null,
        chainId: null,
        contracts: { mining: null, fta: null, usdt: null },
        payMode: 'USDT',
        swapFrom: 'USDT',
        swapTo: 'FTA',
        balances: { USDT: 0, FTA: 0 },
        power: 0,
        pending: 0,
        exchangeRate: 0,
        referralCode: null,
        detectedRef: null,
        userMachines: [],
        lastClaimTime: 0,
        wheelJackpot: 0,
        lotteryPool: 0,
        refreshInterval: null
    },

    // Initialisation
    async init() {
        console.log('🚀 FITIA PRO - Initialisation...');
        console.log('📍 Contrat Mining:', CONTRACT_ADDRESSES.FITIA_MINING);
        console.log('📍 Token FTA:', CONTRACT_ADDRESSES.FTA_TOKEN);
        
        this.loadState();
        this.checkReferral();
        this.renderShop();
        this.initCanvas();
        this.startAutoRefresh();
        
        // Vérifier MetaMask
        if (typeof window.ethereum !== 'undefined') {
            await this.checkNetwork();
            await this.initContracts();
            await this.loadContractData();
            this.updateBalances();
        } else {
            console.warn('⚠️ MetaMask non installé');
        }
        
        console.log('✅ FITIA PRO Initialisé');
    },

    // Vérifier le réseau
    async checkNetwork() {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const network = await provider.getNetwork();
            const currentChainId = Number(network.chainId);
            
            console.log('Chain ID actuel:', currentChainId);
            console.log('Chain ID requis:', CONFIG.NETWORK.CHAIN_ID);
            
            if (currentChainId !== CONFIG.NETWORK.CHAIN_ID) {
                await this.switchNetwork();
            }
            this.state.chainId = currentChainId;
        } catch (error) {
            console.error('Erreur vérification réseau:', error);
        }
    },

    // Changer de réseau
    async switchNetwork() {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: ethers.toBeHex(CONFIG.NETWORK.CHAIN_ID) }]
            });
            this.showToast('✅ Réseau changé vers Polygon', 'success');
        } catch (error) {
            if (error.code === 4902) {
                await this.addNetwork();
            } else {
                this.showToast('❌ Veuillez changer pour Polygon Manuellement', 'error');
            }
        }
    },

    // Ajouter le réseau Polygon
    async addNetwork() {
        try {
            await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                    chainId: ethers.toBeHex(CONFIG.NETWORK.CHAIN_ID),
                    chainName: CONFIG.NETWORK.NAME,
                    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
                    rpcUrls: [CONFIG.NETWORK.RPC_URL],
                    blockExplorerUrls: [CONFIG.NETWORK.EXPLORER]
                }]
            });
            this.showToast('✅ Polygon ajouté au wallet', 'success');
        } catch (error) {
            console.error('Erreur ajout réseau:', error);
            this.showToast('❌ Échec ajout réseau', 'error');
        }
    },

    // Initialiser les contrats
    async initContracts() {
        // Vérifier les adresses
        if (!CONTRACT_ADDRESSES.FITIA_MINING || 
            CONTRACT_ADDRESSES.FITIA_MINING === '0x0000000000000000000000000000000000000000') {
            console.error('❌ ADRESSE CONTRAT MINING NON CONFIGURÉE!');
            this.showToast('⚠️ Configurez les adresses dans config.js', 'error');
            return;
        }

        if (!CONTRACT_ADDRESSES.FTA_TOKEN || 
            CONTRACT_ADDRESSES.FTA_TOKEN === '0x0000000000000000000000000000000000000000') {
            console.error('❌ ADRESSE TOKEN FTA NON CONFIGURÉE!');
            this.showToast('⚠️ Configurez l\'adresse FTA dans config.js', 'error');
            return;
        }

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            this.state.provider = provider;

            // Contrat Mining
            this.state.contracts.mining = new ethers.Contract(
                CONTRACT_ADDRESSES.FITIA_MINING,
                CONTRACT_ABI.FITIA_MINING,
                provider
            );
            console.log('✅ Contrat Mining initialisé');

            // Token FTA
            this.state.contracts.fta = new ethers.Contract(
                CONTRACT_ADDRESSES.FTA_TOKEN,
                CONTRACT_ABI.ERC20,
                provider
            );
            console.log('✅ Token FTA initialisé');

            // Token USDT
            this.state.contracts.usdt = new ethers.Contract(
                CONTRACT_ADDRESSES.USDT_TOKEN,
                CONTRACT_ABI.ERC20,
                provider
            );
            console.log('✅ Token USDT initialisé');

        } catch (error) {
            console.error('❌ Erreur initialisation contrats:', error);
            this.showToast('❌ Erreur de connexion blockchain', 'error');
        }
    },

    // Charger les données du contrat
    async loadContractData() {
        if (!this.state.contracts.mining) {
            console.warn('⚠️ Contrat mining non initialisé');
            return;
        }
        try {
            const rate = await this.state.contracts.mining.exchangeRate();
            this.state.exchangeRate = parseFloat(ethers.formatUnits(rate, 6));
            document.getElementById('swap-rate').textContent = `1 USDT = ${this.state.exchangeRate.toFixed(2)} FTA`;

            const jackpot = await this.state.contracts.mining.getWheelJackpot();
            this.state.wheelJackpot = parseFloat(ethers.formatUnits(jackpot, 8));
            document.getElementById('wheel-jackpot').textContent = this.state.wheelJackpot.toFixed(2);

            const pool = await this.state.contracts.mining.getLotteryPool();
            this.state.lotteryPool = parseFloat(ethers.formatUnits(pool, 8));
            document.getElementById('lottery-pot').textContent = this.state.lotteryPool.toFixed(2);
        } catch (error) { 
            console.error('Erreur chargement données:', error); 
        }
    },

    // Navigation
    nav(view) {
        document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
        document.getElementById(`view-${view}`).classList.add('active');
        event.currentTarget.classList.add('active');
        if (view === 'my-rigs') this.renderMyRigs();
        if (view === 'games') this.initWheel();
        if (view === 'swap') this.loadContractData();
    },

    // Connexion Wallet
    async connect() {
        this.showLoader('Connexion au wallet...');
        
        try {
            // Vérifier MetaMask
            if (typeof window.ethereum === 'undefined') {
                this.showToast('⚠️ MetaMask non installé', 'error');
                this.hideLoader();
                return;
            }

            // Vérifier les contrats
            if (!this.state.contracts.mining || !this.state.contracts.fta) {
                console.warn('⚠️ Contrats non initialisés, réinitialisation...');
                await this.initContracts();
            }

            const provider = new ethers.BrowserProvider(window.ethereum);
            const accounts = await provider.send("eth_requestAccounts", []);
            
            if (!accounts || accounts.length === 0) {
                this.showToast('❌ Aucun compte trouvé', 'error');
                this.hideLoader();
                return;
            }

            this.state.address = accounts[0];
            this.state.connected = true;
            this.state.signer = await provider.getSigner();
            
            console.log('✅ Wallet connecté:', this.state.address);

            // Connecter les contrats au signer
            this.state.contracts.mining = this.state.contracts.mining.connect(this.state.signer);
            this.state.contracts.fta = this.state.contracts.fta.connect(this.state.signer);
            this.state.contracts.usdt = this.state.contracts.usdt.connect(this.state.signer);
            
            // Charger les données
            await this.loadOnChainData();
            
            this.updateWalletUI();
            this.showToast('✅ Wallet connecté !', 'success');
            this.saveState();

        } catch (error) {
            console.error('Erreur connexion:', error);
            if (error.code === 4001) {
                this.showToast('❌ Connexion refusée', 'error');
            } else {
                this.showToast('❌ Échec de connexion: ' + error.message.substring(0, 50), 'error');
            }
        }
        this.hideLoader();
    },

    // Charger les données on-chain
    async loadOnChainData() {
        if (!this.state.connected) {
            console.log('⚠️ Pas connecté');
            return;
        }

        try {
            console.log('📊 Chargement données pour:', this.state.address);

            // Balance FTA
            const ftaBalance = await this.state.contracts.fta.balanceOf(this.state.address);
            this.state.balances.FTA = parseFloat(ethers.formatUnits(ftaBalance, 8));
            console.log('✅ Balance FTA:', this.state.balances.FTA);

            // Balance USDT
            const usdtBalance = await this.state.contracts.usdt.balanceOf(this.state.address);
            this.state.balances.USDT = parseFloat(ethers.formatUnits(usdtBalance, 6));
            console.log('✅ Balance USDT:', this.state.balances.USDT);

            // Power Mining
            const power = await this.state.contracts.mining.getActivePower(this.state.address);
            this.state.power = parseFloat(ethers.formatUnits(power, 8));
            console.log('✅ Power Mining:', this.state.power);

            // User Info
            const userInfo = await this.state.contracts.mining.users(this.state.address);
            this.state.lastClaimTime = Number(userInfo.lastClaimTime);
            this.state.userMachines = userInfo.machines;
            console.log('✅ Last Claim Time:', this.state.lastClaimTime);

            // Calculer pending rewards
            await this.calculatePendingRewards();

            // Parrain
            const referrer = await this.state.contracts.mining.referrers(this.state.address);
            if (referrer !== ethers.ZeroAddress) {
                this.state.referralCode = referrer;
            }

            await this.loadContractData();
            this.updateBalances();
            this.updateStats();
            this.renderMyRigs();
            this.saveState();

        } catch (error) { 
            console.error('❌ Erreur chargement on-chain:', error);
            this.showToast('⚠️ Erreur de chargement', 'error');
        }
    },

    // Calculer les rewards pending
    async calculatePendingRewards() {
        if (this.state.lastClaimTime === 0 || this.state.power === 0) {
            this.state.pending = 0;
            return;
        }

        const now = Math.floor(Date.now() / 1000);
        const timePassed = now - this.state.lastClaimTime;

        if (timePassed <= 0) {
            this.state.pending = 0;
            return;
        }

        try {
            const difficulty = await this.state.contracts.mining.difficultyMultiplier();
            
            // Formule du contrat: (timePassed * power * difficulty) / 1e18
            const powerWei = BigInt(Math.floor(this.state.power * 1e8));
            const rawRewards = BigInt(timePassed) * powerWei;
            const finalRewards = (rawRewards * difficulty) / BigInt(1e18);
            
            this.state.pending = parseFloat(ethers.formatUnits(finalRewards, 8));
            
            console.log('✅ Pending:', this.state.pending, 'FTA');
            
        } catch (error) {
            console.error('Erreur calcul pending:', error);
            this.state.pending = 0;
        }
    },

    // Auto refresh
    startAutoRefresh() {
        if (this.state.refreshInterval) {
            clearInterval(this.state.refreshInterval);
        }

        this.state.refreshInterval = setInterval(() => {
            if (this.state.connected && this.state.power > 0) {
                this.calculatePendingRewards();
                this.updateStats();
            }
        }, 10000);

        console.log('✅ Auto-refresh activé (10s)');
    },

    // Update Wallet UI
    updateWalletUI() {
        const btn = document.getElementById('btn-connect');
        const status = document.getElementById('wallet-status');
        const addr = document.getElementById('addr-display');
        if (this.state.connected) {
            btn.classList.add('hidden');
            status.classList.remove('hidden');
            addr.textContent = this.state.address.slice(0, 6) + '...' + this.state.address.slice(-4);
            document.getElementById('ref-link').value = `https://fitia.pro/?ref=${this.state.address}`;
        }
    },

    // Vérifier parrainage URL
    checkReferral() {
        const urlParams = new URLSearchParams(window.location.search);
        const ref = urlParams.get('ref');
        if (ref && ethers.isAddress(ref) && ref !== this.state.address) {
            this.state.detectedRef = ref;
            document.getElementById('bind-ref-area').classList.remove('hidden');
            document.getElementById('detected-ref').textContent = ref.slice(0, 10) + '...';
        }
    },

    // Lier parrain
    async bindReferrer() {
        if (!this.state.connected) { 
            this.showToast('⚠️ Connectez votre wallet', 'error'); 
            return; 
        }
        try {
            this.showLoader('Liaison du parrain...');
            const tx = await this.state.contracts.mining.setReferrer(this.state.detectedRef);
            await tx.wait();
            this.showToast('✅ Parrain lié avec succès !', 'success');
            document.getElementById('bind-ref-area').classList.add('hidden');
        } catch (error) { 
            this.showToast(`❌ ${this.getErrorMessage(error)}`, 'error'); 
        }
        this.hideLoader();
    },

    // Copier lien
    copyLink() {
        const input = document.getElementById('ref-link');
        navigator.clipboard.writeText(input.value);
        this.showToast('📋 Lien copié !', 'success');
    },

    // Mode de paiement
    setPayMode(mode) {
        this.state.payMode = mode;
        document.getElementById('btn-pay-usdt').classList.toggle('active', mode === 'USDT');
        document.getElementById('btn-pay-fta').classList.toggle('active', mode === 'FTA');
        this.renderShop();
    },

    // Afficher boutique
    renderShop() {
        const container = document.getElementById('shop-list');
        container.innerHTML = '';
        MACHINE_TYPES.forEach(machine => {
            const priceDisplay = this.state.payMode === 'USDT' 
                ? `${machine.price} ${machine.currency}`
                : `${(machine.price * this.state.exchangeRate).toFixed(0)} FTA`;
            const item = document.createElement('div');
            item.className = 'rig-item';
            item.innerHTML = `
                <div class="rig-name">${machine.name}</div>
                <div class="rig-power">⚡ ${machine.power} FTA/s</div>
                <div class="rig-price">${priceDisplay}</div>
                <button class="btn-primary btn-sm" onclick="App.buyMachine(${machine.id})">ACHETER</button>
            `;
            container.appendChild(item);
        });
    },

    // Acheter machine
    async buyMachine(id) {
        if (!this.state.connected) { 
            this.showToast('⚠️ Connectez votre wallet', 'error'); 
            return; 
        }
        const machine = MACHINE_TYPES.find(m => m.id === id);
        try {
            this.showLoader('Achat en cours...');
            const amount = this.state.payMode === 'USDT'
                ? ethers.parseUnits(machine.price.toString(), TOKEN_DECIMALS.USDT)
                : ethers.parseUnits((machine.price * this.state.exchangeRate).toString(), TOKEN_DECIMALS.FTA);
            const tokenContract = this.state.payMode === 'USDT' ? this.state.contracts.usdt : this.state.contracts.fta;
            
            const balance = await tokenContract.balanceOf(this.state.address);
            if (balance < amount) {
                this.showToast('❌ Solde insuffisant', 'error');
                this.hideLoader();
                return;
            }
            
            const approveTx = await tokenContract.approve(CONTRACT_ADDRESSES.FITIA_MINING, amount);
            this.showToast('📤 Approbation en cours...', 'info');
            await approveTx.wait();
            
            const buyTx = this.state.payMode === 'USDT'
                ? await this.state.contracts.mining.buyMachine(id)
                : await this.state.contracts.mining.buyMachineWithFTA(id);
            this.showToast('📤 Transaction en cours...', 'info');
            await buyTx.wait();
            
            this.showToast(`✅ ${machine.name} acheté !`, 'success');
            await this.loadOnChainData();
        } catch (error) { 
            this.showToast(`❌ ${this.getErrorMessage(error)}`, 'error'); 
        }
        this.hideLoader();
    },

    // Afficher mes rigs
    renderMyRigs() {
        const container = document.getElementById('my-rigs-list');
        const noRigs = document.getElementById('no-rigs');
        if (!this.state.userMachines || this.state.userMachines.length === 0) {
            container.innerHTML = '';
            noRigs.style.display = 'block';
            return;
        }
        noRigs.style.display = 'none';
        container.innerHTML = '';
        const now = Math.floor(Date.now() / 1000);
        const lifespan = CONTRACT_SETTINGS.MACHINE_LIFESPAN;
        const machineCount = {};
        this.state.userMachines.forEach(m => {
            const typeId = Number(m.typeId);
            const isActive = now < Number(m.boughtAt) + lifespan;
            if (isActive) machineCount[typeId] = (machineCount[typeId] || 0) + 1;
        });
        Object.keys(machineCount).forEach(typeId => {
            const machine = MACHINE_TYPES.find(m => m.id === parseInt(typeId));
            if (machine) {
                const card = document.createElement('div');
                card.className = 'my-rig-card active';
                card.innerHTML = `
                    <div class="rig-info">
                        <h4>${machine.name} x${machineCount[typeId]}</h4>
                        <p>⚡ ${(machine.power * machineCount[typeId]).toFixed(2)} FTA/s</p>
                    </div>
                    <span class="rig-status-badge">ACTIF</span>
                `;
                container.appendChild(card);
            }
        });
    },

    // Update stats
    updateStats() {
        document.getElementById('val-power').textContent = this.state.power.toFixed(5);
        document.getElementById('val-pending').textContent = this.state.pending.toFixed(5);
        const vizStatus = document.getElementById('viz-status');
        if (this.state.power > 0) {
            vizStatus.textContent = 'MINING';
            vizStatus.style.color = 'var(--primary)';
        } else {
            vizStatus.textContent = 'EN ATTENTE';
            vizStatus.style.color = 'var(--text-muted)';
        }
    },

    // Claim rewards
    async claim() {
        if (!this.state.connected) { 
            this.showToast('⚠️ Connectez votre wallet', 'error'); 
            return; 
        }
        if (this.state.pending <= 0.00001) { 
            this.showToast('⚠️ Rien à réclamer', 'error'); 
            return; 
        }
        try {
            this.showLoader('Réclamation en cours...');
            const tx = await this.state.contracts.mining.claimRewards();
            this.showToast('📤 Transaction envoyée...', 'info');
            await tx.wait();
            this.showToast('✅ Réclamation réussie !', 'success');
            await this.loadOnChainData();
        } catch (error) { 
            this.showToast(`❌ ${this.getErrorMessage(error)}`, 'error'); 
        }
        this.hideLoader();
    },

    // Update balances
    updateBalances() {
        document.getElementById('bal-usdt').textContent = this.state.balances.USDT.toFixed(2);
        document.getElementById('bal-fta').textContent = this.state.balances.FTA.toFixed(5);
        document.getElementById('swap-bal-from').textContent = this.state.balances[this.state.swapFrom].toFixed(2);
        document.getElementById('swap-bal-to').textContent = this.state.balances[this.state.swapTo].toFixed(5);
    },

    // Toggle swap
    toggleSwap() {
        [this.state.swapFrom, this.state.swapTo] = [this.state.swapTo, this.state.swapFrom];
        document.getElementById('token-from-display').querySelector('span').textContent = this.state.swapFrom;
        document.getElementById('token-to-display').querySelector('span').textContent = this.state.swapTo;
        this.calcSwap();
    },

    // Calc swap
    calcSwap() {
        const fromAmount = parseFloat(document.getElementById('swap-from-in').value) || 0;
        const rate = this.state.swapFrom === 'USDT' ? this.state.exchangeRate : 1 / this.state.exchangeRate;
        const toAmount = fromAmount * rate;
        document.getElementById('swap-to-in').value = toAmount.toFixed(5);
        document.getElementById('swap-rate').textContent = `1 ${this.state.swapFrom} = ${rate.toFixed(4)} ${this.state.swapTo}`;
    },

    // Execute swap
    async executeSwap() {
        if (!this.state.connected) { 
            this.showToast('⚠️ Connectez votre wallet', 'error'); 
            return; 
        }
        const fromAmount = parseFloat(document.getElementById('swap-from-in').value) || 0;
        if (fromAmount <= 0) { 
            this.showToast('⚠️ Montant invalide', 'error'); 
            return; 
        }
        try {
            this.showLoader('Échange en cours...');
            const amountIn = this.state.swapFrom === 'USDT'
                ? ethers.parseUnits(fromAmount.toString(), TOKEN_DECIMALS.USDT)
                : ethers.parseUnits(fromAmount.toString(), TOKEN_DECIMALS.FTA);
            const tokenContract = this.state.swapFrom === 'USDT' ? this.state.contracts.usdt : this.state.contracts.fta;
            const approveTx = await tokenContract.approve(CONTRACT_ADDRESSES.FITIA_MINING, amountIn);
            await approveTx.wait();
            const swapTx = this.state.swapFrom === 'USDT'
                ? await this.state.contracts.mining.swapUsdtForFta(amountIn)
                : await this.state.contracts.mining.swapFtaForUsdt(amountIn);
            await swapTx.wait();
            this.showToast('✅ Échange effectué !', 'success');
            await this.loadOnChainData();
        } catch (error) { 
            this.showToast(`❌ ${this.getErrorMessage(error)}`, 'error'); 
        }
        this.hideLoader();
    },

    // Show game
    showGame(game) {
        document.querySelectorAll('.game-area').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.game-tab').forEach(el => el.classList.remove('active'));
        document.getElementById(`game-${game}`).classList.add('active');
        event.currentTarget.classList.add('active');
        if (game === 'wheel') this.initWheel();
    },

    // Play WinGo
    async playWinGo(multiplier, type) {
        if (!this.state.connected) { 
            this.showToast('⚠️ Connectez votre wallet', 'error'); 
            return; 
        }
        const bet = parseFloat(document.getElementById('wingo-bet').value) || 0;
        if (bet <= 0) { 
            this.showToast('❌ Mise invalide', 'error'); 
            return; 
        }
        try {
            this.showLoader('Jeu en cours...');
            const betAmount = ethers.parseUnits(bet.toString(), TOKEN_DECIMALS.FTA);
            const balance = await this.state.contracts.fta.balanceOf(this.state.address);
            if (balance < betAmount) {
                this.showToast('❌ Solde FTA insuffisant', 'error');
                this.hideLoader();
                return;
            }
            const approveTx = await this.state.contracts.fta.approve(CONTRACT_ADDRESSES.FITIA_MINING, betAmount);
            await approveTx.wait();
            const tx = await this.state.contracts.mining.playWinGo(betAmount, 1, type);
            await tx.wait();
            this.showToast('🎮 Partie terminée !', 'success');
            await this.loadOnChainData();
        } catch (error) { 
            this.showToast(`❌ ${this.getErrorMessage(error)}`, 'error'); 
        }
        this.hideLoader();
    },

    // Spin wheel
    async spinWheel() {
        if (!this.state.connected) { 
            this.showToast('⚠️ Connectez votre wallet', 'error'); 
            return; 
        }
        try {
            this.showLoader('La roue tourne...');
            const ticketPrice = await this.state.contracts.mining.wheelTicketPrice();
            const balance = await this.state.contracts.fta.balanceOf(this.state.address);
            if (balance < ticketPrice) {
                this.showToast('❌ Solde FTA insuffisant (100 FTA requis)', 'error');
                this.hideLoader();
                return;
            }
            const allowance = await this.state.contracts.fta.allowance(this.state.address, CONTRACT_ADDRESSES.FITIA_MINING);
            if (allowance < ticketPrice) {
                this.showToast('📤 Approbation requise...', 'info');
                const approveTx = await this.state.contracts.fta.approve(CONTRACT_ADDRESSES.FITIA_MINING, ticketPrice);
                await approveTx.wait();
            }
            const tx = await this.state.contracts.mining.spinWheel();
            await tx.wait();
            this.showToast('🎡 Tour terminé !', 'success');
            await this.loadOnChainData();
        } catch (error) { 
            this.showToast(`❌ ${this.getErrorMessage(error)}`, 'error'); 
        }
        this.hideLoader();
    },

    // Buy lottery ticket
    async buyLotteryTicket() {
        if (!this.state.connected) { 
            this.showToast('⚠️ Connectez votre wallet', 'error'); 
            return; 
        }
        try {
            this.showLoader('Achat du ticket...');
            const ticketPrice = await this.state.contracts.mining.lotteryTicketPrice();
            const balance = await this.state.contracts.fta.balanceOf(this.state.address);
            if (balance < ticketPrice) {
                this.showToast('❌ Solde FTA insuffisant (50 FTA requis)', 'error');
                this.hideLoader();
                return;
            }
            const approveTx = await this.state.contracts.fta.approve(CONTRACT_ADDRESSES.FITIA_MINING, ticketPrice);
            await approveTx.wait();
            const tx = await this.state.contracts.mining.buyLotteryTicket();
            await tx.wait();
            this.showToast('🎫 Ticket acheté !', 'success');
            await this.loadOnChainData();
        } catch (error) { 
            this.showToast(`❌ ${this.getErrorMessage(error)}`, 'error'); 
        }
        this.hideLoader();
    },

    // Go fishing
    async goFishing() {
        if (!this.state.connected) { 
            this.showToast('⚠️ Connectez votre wallet', 'error'); 
            return; 
        }
        try {
            this.showLoader('Pêche en cours...');
            const ticketPrice = await this.state.contracts.mining.fishingTicketPrice();
            const balance = await this.state.contracts.fta.balanceOf(this.state.address);
            if (balance < ticketPrice) {
                this.showToast('❌ Solde FTA insuffisant (50 FTA requis)', 'error');
                this.hideLoader();
                return;
            }
            const approveTx = await this.state.contracts.fta.approve(CONTRACT_ADDRESSES.FITIA_MINING, ticketPrice);
            await approveTx.wait();
            const tx = await this.state.contracts.mining.goFishing();
            await tx.wait();
            this.showToast('🎣 Pêche terminée !', 'success');
            await this.loadOnChainData();
        } catch (error) { 
            this.showToast(`❌ ${this.getErrorMessage(error)}`, 'error'); 
        }
        this.hideLoader();
    },

    // Init canvas
    initCanvas() {
        const canvas = document.getElementById('mining-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
        resize();
        window.addEventListener('resize', resize);
        const bars = 20;
        const animate = () => {
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            const barWidth = canvas.width / bars;
            for (let i = 0; i < bars; i++) {
                const height = this.state.power > 0 ? Math.random() * canvas.height * 0.8 : 5;
                const x = i * barWidth;
                const y = canvas.height - height;
                const gradient = ctx.createLinearGradient(0, y, 0, canvas.height);
                gradient.addColorStop(0, '#FFC107');
                gradient.addColorStop(1, '#FF9800');
                ctx.fillStyle = gradient;
                ctx.fillRect(x + 2, y, barWidth - 4, height);
            }
            requestAnimationFrame(animate);
        };
        animate();
    },

    // Init wheel
    initWheel() {
        const canvas = document.getElementById('wheel-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const segments = ['100', '200', '500', '1000', 'JACKPOT', '0', '50', '150'];
        const colors = ['#FFC107', '#FF9800', '#FFB300', '#E74C3C', '#F39C12', '#6E7681', '#FFC107', '#FF9800'];
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 10;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        segments.forEach((seg, i) => {
            const angle = (2 * Math.PI / segments.length) * i;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, angle, angle + 2 * Math.PI / segments.length);
            ctx.fillStyle = colors[i];
            ctx.fill();
            ctx.stroke();
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(angle + Math.PI / segments.length);
            ctx.fillStyle = '#000';
            ctx.font = 'bold 14px Inter';
            ctx.fillText(seg, radius - 40, 5);
            ctx.restore();
        });
    },

    // Get error message
    getErrorMessage(error) {
        console.error('Erreur:', error);
        if (error.reason) return error.reason;
        if (error.message) {
            if (error.message.includes('user rejected') || error.message.includes('rejected')) return 'Transaction refusée';
            if (error.message.includes('insufficient funds')) return 'Solde insuffisant en MATIC';
            if (error.message.includes('failed')) return 'Transaction échouée';
            if (error.message.includes('allowance')) return 'Approbation requise';
            return error.message.split('(')[0].trim().substring(0, 100);
        }
        return 'Erreur de transaction';
    },

    // Toast
    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.style.borderLeftColor = type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--danger)' : 'var(--primary)';
        toast.textContent = message;
        container.appendChild(toast);
        setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 3000);
    },

    // Loader
    showLoader(text = 'Chargement...') {
        document.getElementById('loader-text').textContent = text;
        document.getElementById('loader').classList.remove('hidden');
    },

    hideLoader() { 
        document.getElementById('loader').classList.add('hidden'); 
    },

    // Save state
    saveState() {
        const stateToSave = { 
            address: this.state.address, 
            connected: this.state.connected, 
            referralCode: this.state.referralCode,
            lastClaimTime: this.state.lastClaimTime,
            power: this.state.power
        };
        localStorage.setItem('fitiaProState', JSON.stringify(stateToSave));
    },

    // Load state
    loadState() {
        const saved = localStorage.getItem('fitiaProState');
        if (saved) {
            const parsed = JSON.parse(saved);
            this.state.address = parsed.address;
            this.state.connected = parsed.connected;
            this.state.referralCode = parsed.referralCode;
            this.state.lastClaimTime = parsed.lastClaimTime || 0;
            this.state.power = parsed.power || 0;
        }
    }
};

// Démarrage
document.addEventListener('DOMContentLoaded', () => { 
    console.log('📄 DOM Chargé');
    App.init(); 
});