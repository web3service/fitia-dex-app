class Web3Manager {
    constructor() {
        this.provider = null;
        this.signer = null;
        this.account = null;
        this.contract = null;
        this.isConnected = false;
        this.chainId = 137;
    }
    
    async connect() {
        try {
            if (typeof window.ethereum === 'undefined') { throw new Error('MetaMask non installé'); }
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            this.account = accounts[0];
            this.provider = new ethers.providers.Web3Provider(window.ethereum);
            this.signer = this.provider.getSigner();
            await this.checkNetwork();
            this.contract = new FitiaMiningContract(this.provider, this.signer);
            this.isConnected = true;
            this.setupEventListeners();
            return { success: true, account: this.account };
        } catch (error) { return { success: false, error: error.message }; }
    }
    
    async checkNetwork() {
        const network = await this.provider.getNetwork();
        if (network.chainId !== this.chainId) {
            try {
                await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: `0x${this.chainId.toString(16)}` }], });
            } catch (switchError) {
                if (switchError.code === 4902) { await this.addPolygonNetwork(); } else { throw switchError; }
            }
        }
    }
    
    async addPolygonNetwork() {
        await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
                chainId: `0x${this.chainId.toString(16)}`,
                chainName: 'Polygon Mainnet',
                nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
                rpcUrls: ['https://polygon-rpc.com'],
                blockExplorerUrls: ['https://polygonscan.com']
            }],
        });
    }
    
    setupEventListeners() {
        window.ethereum.on('accountsChanged', this.handleAccountsChanged.bind(this));
        window.ethereum.on('chainChanged', this.handleChainChanged.bind(this));
    }
    
    handleAccountsChanged(accounts) {
        if (accounts.length === 0) { this.disconnect(); }
        else if (accounts[0] !== this.account) {
            this.account = accounts[0];
            this.signer = this.provider.getSigner();
            this.contract = new FitiaMiningContract(this.provider, this.signer);
            location.reload();
        }
    }
    
    handleChainChanged() { location.reload(); }
    
    async disconnect() {
        this.account = null; this.signer = null; this.contract = null; this.isConnected = false;
        localStorage.removeItem('walletConnected');
        location.reload();
    }
    
    async getBalance(token = 'FTA') {
        if (!this.contract || !this.account) return '0';
        try {
            if (token === 'FTA') { const balance = await this.contract.getFtaBalance(this.account); const decimals = await this.contract.getFtaDecimals(); return this.contract.formatToken(balance, decimals); }
            else if (token === 'USDT') { const balance = await this.contract.getUsdtBalance(this.account); const decimals = await this.contract.getUsdtDecimals(); return this.contract.formatToken(balance, decimals); }
            else if (token === 'MATIC') { const balance = await this.contract.getMaticBalance(this.account); return this.contract.formatToken(balance, 18); }
        } catch (error) { return '0'; }
    }
    
    async approve(token, amount) {
        if (!this.contract) return false;
        if (token === 'USDT') { return await this.contract.checkAndApproveUsdt(amount); }
        else if (token === 'FTA') { return await this.contract.checkAndApproveFta(amount); }
    }
}

window.web3Manager = new Web3Manager();