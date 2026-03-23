// ============================================
// CONFIGURATION - MODIFIEZ CES VALEURS
// ============================================

const CONFIG = {
  // Adresse du contrat FitiaEcosystemHub
  CONTRACT_ADDRESS: '0xAfdFb346F819ffF3DdEF77e23E25a34E19c7Cab2',
  
  // Adresse USDT sur Polygon
  USDT_ADDRESS: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
  
  // Adresse du token FTA
  FTA_ADDRESS: '0x535bBe393D64a60E14B731b7350675792d501623',
  
  // Réseau Polygon
  CHAIN_ID: 137,
  CHAIN_ID_HEX: '0x89',
  RPC_URL: 'https://polygon-rpc.com',
  BLOCK_EXPLORER: 'https://polygonscan.com',
  
  // Prix FTA (à récupérer du contrat en prod)
  FTA_PRICE_USD: 1.25
};

// ABI du contrat
const CONTRACT_ABI = [
  "function depositToWallet(address _token, uint256 _amount) external",
  "function withdrawFromWallet(address _token, uint256 _amount) external",
  "function getMyBalance(address _token) external view returns (uint256)",
  "function buyMachine(uint256 _typeId) external",
  "function claimMiningRewards(uint256 _tokenId) external",
  "function buyFTA(uint256 _usdtAmount) external",
  "function sellFTA(uint256 _ftaAmount) external",
  "function openPosition(uint8 _asset, uint8 _side, uint256 _marginUSDT, uint256 _leverage) external",
  "function playAviator(uint256 _ftaBetAmount, uint256 _targetMultiplier) external",
  "function userProfiles(address) external view returns (uint256,uint256,uint256,bool,bool,uint256)",
  "function totalFtaMined() external view returns (uint256)",
  "event Deposit(address indexed user, address indexed token, uint256 amount)",
  "event Withdraw(address indexed user, address indexed token, uint256 amount)",
  "event Mined(address indexed user, uint256 indexed tokenId, uint256 amount)"
];