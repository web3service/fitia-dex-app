// ============================================
// FITIA MINING V2 - ABI Complet
// Compatible avec votre contrat déployé
// ============================================

const MINING_ABI = [
    // === VIEW FUNCTIONS ===
    "function usdtToken() view returns (address)",
    "function ftaToken() view returns (address)",
    "function owner() view returns (address)",
    "function MACHINE_LIFESPAN() view returns (uint256)",
    "function difficultyMultiplier() view returns (uint256)",
    "function exchangeRate() view returns (uint256)",
    "function devFeeMachine() view returns (uint256)",
    "function swapFee() view returns (uint256)",
    "function claimFee() view returns (uint256)",
    "function maxBetPercentage() view returns (uint256)",
    "function wheelTicketPrice() view returns (uint256)",
    "function lotteryTicketPrice() view returns (uint256)",
    "function fishingTicketPrice() view returns (uint256)",
    "function getWheelJackpot() view returns (uint256)",
    "function getLotteryPool() view returns (uint256)",
    "function lotteryActive() view returns (bool)",
    "function lotteryTicketCount() view returns (uint256)",
    "function getMachineCount() view returns (uint256)",
    "function machineTypes(uint256) view returns (uint256 price, uint256 power)",
    "function getActivePower(address _user) view returns (uint256)",
    "function getUserMachineCount(address _user, uint256 _typeId) view returns (uint256)",
    "function users(address) view returns (tuple(uint256 typeId, uint256 boughtAt)[] machines, uint256 lastClaimTime)",
    "function referrers(address) view returns (address)",
    "function commissionRates(uint256) view returns (uint256)",
    
    // === TRANSACTION FUNCTIONS ===
    "function buyMachine(uint256 _typeId) external",
    "function buyMachineWithFTA(uint256 _typeId) external",
    "function claimRewards() external",
    "function setReferrer(address _referrer) external",
    "function swapUsdtForFta(uint256 _usdtAmount) external",
    "function swapFtaForUsdt(uint256 _ftaAmount) external",
    "function playWinGo(uint256 _ftaAmount, uint8 _betType, uint8 _choice) external",
    "function spinWheel() external",
    "function buyLotteryTicket() external",
    "function goFishing() external",
    
    // === ADMIN FUNCTIONS ===
    "function pause() external",
    "function unpause() external",
    "function setExchangeRate(uint256 _val) external",
    "function setDifficulty(uint256 _val) external",
    "function setFees(uint256 _devMachine, uint256 _swap, uint256 _claim) external",
    "function setGameSettings(uint256 _maxBetPct, uint256 _wheelPrice, uint256 _lotteryPrice, uint256 _fishingPrice) external",
    "function depositFtaLiquidity(uint256 _amount) external",
    "function withdrawTokens(address _token, uint256 _amount) external",
    
    // === EVENTS ===
    "event MachineBought(address indexed user, uint256 machineId, uint256 price, string currency)",
    "event RewardsClaimed(address indexed user, uint256 amount, uint256 fee)",
    "event Swapped(address indexed user, string direction, uint256 amountIn, uint256 amountOut, uint256 fee)",
    "event GamePlayed(address indexed user, string gameType, uint256 betAmount, uint256 payout)",
    "event ReferrerBound(address indexed user, address indexed referrer)",
    "event Transfer(address indexed from, address indexed to, uint256 value)"
];

const ERC20_ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address account) view returns (uint256)",
    "function transfer(address to, uint256 amount) returns (bool)",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function allowance(address owner, address spender) view returns (uint256)",
    "function transferFrom(address from, address to, uint256 amount) returns (bool)",
    "event Transfer(address indexed from, address indexed to, uint256 value)",
    "event Approval(address indexed owner, address indexed spender, uint256 value)"
];

window.MINING_ABI = MINING_ABI;
window.ERC20_ABI = ERC20_ABI;