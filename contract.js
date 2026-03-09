class FitiaMiningContract {
    constructor(provider, signer) {
        this.provider = provider;
        this.signer = signer;
        this.contract = null;
        this.usdtContract = null;
        this.ftaContract = null;
        this.initialize();
    }
    
    async initialize() {
        this.contract = new ethers.Contract(CONTRACT_CONFIG.address, CONTRACT_ABI, this.signer);
        this.usdtContract = new ethers.Contract(CONTRACT_CONFIG.usdtAddress, ['function balanceOf(address) view returns (uint256)', 'function approve(address,uint256) returns (bool)', 'function allowance(address,address) view returns (uint256)', 'function decimals() view returns (uint8)'], this.signer);
        this.ftaContract = new ethers.Contract(CONTRACT_CONFIG.ftaAddress, ['function balanceOf(address) view returns (uint256)', 'function approve(address,uint256) returns (bool)', 'function allowance(address,address) view returns (uint256)', 'function decimals() view returns (uint8)'], this.signer);
    }
    
    async getExchangeRate() { return await this.contract.exchangeRate(); }
    async getActivePower(user) { return await this.contract.getActivePower(user); }
    async getUserInfo(user) { return await this.contract.users(user); }
    async getMachineCount() { return await this.contract.getMachineCount(); }
    async getMachineType(typeId) { return await this.contract.machineTypes(typeId); }
    async getWheelJackpot() { return await this.contract.getWheelJackpot(); }
    async getLotteryPool() { return await this.contract.getLotteryPool(); }
    async getReferrer(user) { return await this.contract.referrers(user); }
    async getClaimFee() { return await this.contract.claimFee(); }
    async getSwapFee() { return await this.contract.swapFee(); }
    async getWheelTicketPrice() { return await this.contract.wheelTicketPrice(); }
    async getLotteryTicketPrice() { return await this.contract.lotteryTicketPrice(); }
    async getFishingTicketPrice() { return await this.contract.fishingTicketPrice(); }
    
    async getUsdtBalance(user) { return await this.usdtContract.balanceOf(user); }
    async getFtaBalance(user) { return await this.ftaContract.balanceOf(user); }
    async getUsdtDecimals() { return await this.usdtContract.decimals(); }
    async getFtaDecimals() { return await this.ftaContract.decimals(); }
    
    async checkAndApproveUsdt(amount) {
        const allowance = await this.usdtContract.allowance(this.signer.getAddress(), CONTRACT_CONFIG.address);
        if (allowance.lt(amount)) { const tx = await this.usdtContract.approve(CONTRACT_CONFIG.address, ethers.constants.MaxUint256); await tx.wait(); return true; }
        return false;
    }
    
    async checkAndApproveFta(amount) {
        const allowance = await this.ftaContract.allowance(this.signer.getAddress(), CONTRACT_CONFIG.address);
        if (allowance.lt(amount)) { const tx = await this.ftaContract.approve(CONTRACT_CONFIG.address, ethers.constants.MaxUint256); await tx.wait(); return true; }
        return false;
    }
    
    async buyMachine(typeId, useFTA = false) { const tx = useFTA ? await this.contract.buyMachineWithFTA(typeId) : await this.contract.buyMachine(typeId); return await tx.wait(); }
    async claimRewards() { const tx = await this.contract.claimRewards(); return await tx.wait(); }
    async swapUsdtForFta(amount) { const tx = await this.contract.swapUsdtForFta(amount); return await tx.wait(); }
    async swapFtaForUsdt(amount) { const tx = await this.contract.swapFtaForUsdt(amount); return await tx.wait(); }
    async playWinGo(amount, betType, choice) { const tx = await this.contract.playWinGo(amount, betType, choice); return await tx.wait(); }
    async spinWheel() { const tx = await this.contract.spinWheel(); return await tx.wait(); }
    async buyLotteryTicket() { const tx = await this.contract.buyLotteryTicket(); return await tx.wait(); }
    async goFishing() { const tx = await this.contract.goFishing(); return await tx.wait(); }
    async setReferrer(referrer) { const tx = await this.contract.setReferrer(referrer); return await tx.wait(); }
    
    formatToken(amount, decimals = 18) { return ethers.utils.formatUnits(amount, decimals); }
    parseToken(amount, decimals = 18) { return ethers.utils.parseUnits(amount.toString(), decimals); }
    async getMaticBalance(user) { return await this.provider.getBalance(user); }
}

window.FitiaMiningContract = FitiaMiningContract;