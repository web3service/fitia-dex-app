const CONTRACT_CONFIG = {
    address: '0x0000000000000000000000000000000000000000',
    usdtAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    ftaAddress: '0x0000000000000000000000000000000000000000',
    chainId: 137,
    chainName: 'Polygon Mainnet',
    rpcUrl: 'https://polygon-rpc.com',
    blockExplorer: 'https://polygonscan.com'
};

const CONTRACT_ABI = [
    'function exchangeRate() view returns (uint256)',
    'function getActivePower(address) view returns (uint256)',
    'function users(address) view returns (tuple(tuple(uint256 typeId, uint256 boughtAt)[] machines, uint256 lastClaimTime))',
    'function getMachineCount() view returns (uint256)',
    'function machineTypes(uint256) view returns (uint256 price, uint256 power)',
    'function getWheelJackpot() view returns (uint256)',
    'function getLotteryPool() view returns (uint256)',
    'function referrers(address) view returns (address)',
    'function claimFee() view returns (uint256)',
    'function swapFee() view returns (uint256)',
    'function wheelTicketPrice() view returns (uint256)',
    'function lotteryTicketPrice() view returns (uint256)',
    'function fishingTicketPrice() view returns (uint256)',
    'function buyMachine(uint256 _typeId) external',
    'function buyMachineWithFTA(uint256 _typeId) external',
    'function claimRewards() external',
    'function swapUsdtForFta(uint256 _usdtAmount) external',
    'function swapFtaForUsdt(uint256 _ftaAmount) external',
    'function playWinGo(uint256 _ftaAmount, uint8 _betType, uint8 _choice) external',
    'function spinWheel() external',
    'function buyLotteryTicket() external',
    'function goFishing() external',
    'function setReferrer(address _referrer) external',
    'function balanceOf(address) view returns (uint256)',
    'function approve(address spender, uint256 amount) returns (bool)',
    'function allowance(address owner, address spender) view returns (uint256)',
    'function decimals() view returns (uint8)',
    'event MachineBought(address indexed user, uint256 machineId, uint256 price, string currency)',
    'event RewardsClaimed(address indexed user, uint256 amount, uint256 fee)',
    'event Swapped(address indexed user, string direction, uint256 amountIn, uint256 amountOut, uint256 fee)',
    'event GamePlayed(address indexed user, string gameType, uint256 betAmount, uint256 payout)'
];

window.CONTRACT_CONFIG = CONTRACT_CONFIG;
window.CONTRACT_ABI = CONTRACT_ABI;