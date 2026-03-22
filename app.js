/**
 * Fitia PRO - Application Web3
 * Gestion complète du contrat FitiaEcosystemHub
 */

// ========================================
// CONFIGURATION
// ========================================
const CONFIG = {
  // Contract addresses (à remplacer par vos adresses réelles)
  CONTRACT_ADDRESS: '0xAfdFb346F819ffF3DdEF77e23E25a34E19c7Cab2',
  MINING_CONTRACT: '0xb7555D092b0B30D30552502f8a2674D48601b10F',
  FTA_TOKEN: '0x535bBe393D64a60E14B731b7350675792d501623',
  USDT_TOKEN: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
  BTC_FEED: '0xDE31F8bFBD8c84b5360CFACCa3539B938dd78ae6',
  ETH_FEED: '0xF9680D99D6C9589e2a93a78A04A279e509205945',
  MATIC_TOKEN: '0x0000000000000000000000000000000000001010', // Polygon native
  
  // Network config
  POLYGON_CHAIN_ID: 137,
  POLYGON_RPC: 'https://polygon-rpc.com',
  
  // App settings
  REFRESH_INTERVAL: 15000, // 15s
  CHART_UPDATE_INTERVAL: 3000, // 3s
};

// ========================================
// GLOBAL STATE
// ========================================
const state = {
  // Web3
  provider: null,
  signer: null,
  contract: null,
  userAddress: null,
  connected: false,
  
  // User data
  balances: { fta: 0, usdt: 0, matic: 0 },
  internalBalances: {},
  userProfile: null,
  
  // Mining
  machines: [],
  claimableRewards: 0,
  miningStats: { totalMined: 0, activeMachines: 0 },
  
  // Trading
  currentPair: 'FTA/USDT',
  positions: [],
  orderSide: 'buy',
  orderType: 'spot',
  
  // UI
  balanceVisible: true,
  darkMode: false,
  notifications: [],
  
  // Chart
  chart: null,
  candleSeries: null,
  candleData: [],
};

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', async () => {
  await initApp();
  setupEventListeners();
  startAutoRefresh();
});

async function initApp() {
  try {
    // Load saved preferences
    loadPreferences();
    
    // Check for existing connection
    if (window.ethereum) {
      await detectWallet();
    }
    
    // Initialize chart
    initTradingChart();
    
    // Load mock data for demo (remove in production)
    loadMockData();
    
    showToast('info', 'Application prête', 'Connectez votre wallet pour commencer');
    
  } catch (error) {
    console.error('Init error:', error);
    showToast('error', 'Erreur', 'Impossible d\'initialiser l\'application');
  }
}

function loadPreferences() {
  const saved = localStorage.getItem('fitia_prefs');
  if (saved) {
    const prefs = JSON.parse(saved);
    state.darkMode = prefs.darkMode || false;
    state.balanceVisible = prefs.balanceVisible !== false;
    
    if (state.darkMode) {
      document.body.classList.add('dark-mode');
    }
  }
}

function savePreferences() {
  localStorage.setItem('fitia_prefs', JSON.stringify({
    darkMode: state.darkMode,
    balanceVisible: state.balanceVisible
  }));
}

// ========================================
// WALLET CONNECTION
// ========================================
async function connectWallet(type) {
  showLoading(true);
  
  try {
    if (type === 'metamask') {
      if (!window.ethereum) {
        window.open('https://metamask.io/download', '_blank');
        throw new Error('MetaMask non installé');
      }
      state.provider = new ethers.providers.Web3Provider(window.ethereum);
    } 
    else if (type === 'walletconnect') {
      // WalletConnect implementation
      const connector = new WalletConnectProvider({
        rpc: { 137: CONFIG.POLYGON_RPC },
        chainId: CONFIG.POLYGON_CHAIN_ID,
      });
      await connector.enable();
      state.provider = new ethers.providers.Web3Provider(connector);
    }
    else if (type === 'bitget') {
      if (!window.bitkeep || !window.bitkeep.ethereum) {
        window.open('https://web3.bitget.com', '_blank');
        throw new Error('Bitget Wallet non installé');
      }
      state.provider = new ethers.providers.Web3Provider(window.bitkeep.ethereum);
    }
    
    await state.provider.send('eth_requestAccounts', []);
    state.signer = state.provider.getSigner();
    state.userAddress = await state.signer.getAddress();
    
    // Switch to Polygon if needed
    await switchToPolygon();
    
    // Initialize contract
    await initContract();
    
    // Load user data
    await loadUserData();
    
    // Update UI
    updateConnectedUI();
    closeConnectModal();
    
    showToast('success', 'Connecté', `Adresse: ${formatAddress(state.userAddress)}`);
    
  } catch (error) {
    console.error('Connection error:', error);
    showToast('error', 'Échec', error.message || 'Erreur de connexion');
  } finally {
    showLoading(false);
  }
}

async function switchToPolygon() {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: ethers.utils.hexValue(CONFIG.POLYGON_CHAIN_ID) }],
    });
  } catch (switchError) {
    // Chain not added, add it
    if (switchError.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: ethers.utils.hexValue(CONFIG.POLYGON_CHAIN_ID),
          chainName: 'Polygon Mainnet',
          nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
          rpcUrls: [CONFIG.POLYGON_RPC],
          blockExplorerUrls: ['https://polygonscan.com'],
        }],
      });
    }
  }
}

async function initContract() {
  // ABI simplifié - à remplacer par l'ABI complet généré
  const contractABI = [
    // ERC20 functions
    'function balanceOf(address) view returns (uint256)',
    'function transfer(address,uint256) returns (bool)',
    
    // FitiaEcosystemHub functions
    'function depositToWallet(address,uint256)',
    'function withdrawFromWallet(address,uint256)',
    'function getMyBalance(address) view returns (uint256)',
    
    // Mining
    'function buyMachine(uint256)',
    'function buyBattery(uint256,uint256)',
    'function claimMiningRewards(uint256)',
    'function userMachines(uint256) view returns (uint256,uint256,uint256)',
    
    // Trading
    'function buyFTA(uint256)',
    'function sellFTA(uint256)',
    'function openPosition(uint8,uint8,uint256,uint256)',
    'function openPositionWithLimits(uint8,uint8,uint256,uint256,uint256,uint256)',
    'function closePosition(uint256)',
    'function positions(uint256) view returns (address,uint8,uint8,uint256,uint256,uint256,bool)',
    
    // Prices
    'function getAssetPrice(uint8) view returns (uint256)',
    
    // User profile
    'function userProfiles(address) view returns (uint256,uint256,uint256,bool,bool,uint256)',
    
    // Events
    'event Deposit(address indexed,address indexed,uint256)',
    'event Withdraw(address indexed,address indexed,uint256)',
    'event MachineBought(address indexed,uint256 indexed,uint256)',
    'event Mined(address indexed,uint256 indexed,uint256)',
    'event PositionOpened(uint256 indexed,address indexed,uint256,uint256)',
    'event PositionClosed(uint256 indexed,int256,address)',
  ];
  
  state.contract = new ethers.Contract(CONFIG.CONTRACT_ADDRESS, contractABI, state.signer);
  
  // Setup event listeners
  setupContractEvents();
}

function setupContractEvents() {
  if (!state.contract) return;
  
  state.contract.on('Deposit', (user, token, amount) => {
    if (user.toLowerCase() === state.userAddress.toLowerCase()) {
      refreshBalances();
      showToast('success', 'Dépôt confirmé', `${formatAmount(amount)} déposé`);
    }
  });
  
  state.contract.on('Mined', (user, tokenId, amount) => {
    if (user.toLowerCase() === state.userAddress.toLowerCase()) {
      refreshBalances();
      showToast('success', 'Récompense claimée', `+${formatAmount(amount)} FTA`);
    }
  });
  
  state.contract.on('PositionClosed', (id, pnl, closedBy) => {
    if (closedBy.toLowerCase() === state.userAddress.toLowerCase()) {
      showToast(pnl >= 0 ? 'success' : 'warning', 'Position fermée', 
        `P&L: ${pnl >= 0 ? '+' : ''}${formatAmount(pnl)} USDT`);
      loadPositions();
    }
  });
}

async function loadUserData() {
  if (!state.contract || !state.userAddress) return;
  
  try {
    // Load balances
    await refreshBalances();
    
    // Load user profile
    const profile = await state.contract.userProfiles(state.userAddress);
    state.userProfile = {
      level: profile[0].toNumber(),
      xp: profile[1].toNumber(),
      totalVolume: profile[2],
      isEarlyAdopter: profile[3],
      isTopTrader: profile[4],
      feeDiscount: profile[5].toNumber()
    };
    updateUserProfileUI();
    
    // Load mining data
    await loadMiningData();
    
    // Load positions
    await loadPositions();
    
  } catch (error) {
    console.error('Load user data error:', error);
  }
}

async function refreshBalances() {
  if (!state.contract) return;
  
  try {
    // Internal wallet balances
    const [ftaBal, usdtBal] = await Promise.all([
      state.contract.getMyBalance(CONFIG.FTA_TOKEN),
      state.contract.getMyBalance(CONFIG.USDT_TOKEN)
    ]);
    
    state.balances.fta = ethers.utils.formatUnits(ftaBal, 8);
    state.balances.usdt = ethers.utils.formatUnits(usdtBal, 6);
    
    updateBalanceUI();
    
  } catch (error) {
    console.error('Balance refresh error:', error);
  }
}

function updateConnectedUI() {
  document.getElementById('connectOverlay').classList.remove('active');
  document.getElementById('app').classList.remove('hidden');
  
  const addrEl = document.getElementById('walletAddress');
  addrEl.querySelector('span').textContent = formatAddress(state.userAddress);
  
  // Update network
  document.getElementById('currentNetwork').textContent = 'Polygon';
}

function closeConnectModal() {
  document.getElementById('connectOverlay').classList.remove('active');
}

// ========================================
// UI FUNCTIONS
// ========================================
function switchTab(tabId) {
  // Update tab buttons
  document.querySelectorAll('.tab-btn, .nav-item').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.tab === tabId) {
      btn.classList.add('active');
    }
  });
  
  // Show content
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });
  document.getElementById(tabId).classList.add('active');
  
  // Special handling for trade tab
  if (tabId === 'trade') {
    resizeChart();
  }
}

function toggleBalanceVisibility() {
  state.balanceVisible = !state.balanceVisible;
  document.getElementById('eyeIcon').className = 
    `fas fa-${state.balanceVisible ? 'eye' : 'eye-slash'}`;
  updateBalanceUI();
  savePreferences();
}

function updateBalanceUI() {
  const hide = !state.balanceVisible;
  
  document.getElementById('totalBalance').textContent = 
    hide ? '$••••' : formatUSD(calculateTotalBalance());
  
  document.getElementById('ftaBalance').textContent = 
    hide ? '•••• FTA' : `${parseFloat(state.balances.fta).toFixed(2)} FTA`;
  document.getElementById('ftaValue').textContent = 
    hide ? '$••••' : formatUSD(state.balances.fta * getFTAPrice());
    
  document.getElementById('usdtBalance').textContent = 
    hide ? '•••• USDT' : `${parseFloat(state.balances.usdt).toFixed(2)} USDT`;
  document.getElementById('usdtValue').textContent = 
    hide ? '$••••' : formatUSD(state.balances.usdt);
}

function calculateTotalBalance() {
  return (state.balances.fta * getFTAPrice()) + parseFloat(state.balances.usdt);
}

function formatAddress(addr) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function formatAmount(amount, decimals = 2) {
  const num = typeof amount === 'object' ? ethers.utils.formatEther(amount) : amount;
  return parseFloat(num).toFixed(decimals);
}

function formatUSD(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

function showToast(type, title, message) {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', warning: 'fa-exclamation-triangle', info: 'fa-info-circle' };
  
  toast.innerHTML = `
    <i class="fas ${icons[type] || icons.info}"></i>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close" onclick="this.parentElement.remove()">
      <i class="fas fa-times"></i>
    </button>
  `;
  
  container.appendChild(toast);
  
  // Auto remove after 5s
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-20px)';
    setTimeout(() => toast.remove(), 300);
  }, 5000);
}

function showLoading(show) {
  document.getElementById('loadingOverlay').classList.toggle('hidden', !show);
}

// ========================================
// MINING FUNCTIONS
// ========================================
async function buyMachine(typeId) {
  if (!state.contract) {
    showToast('error', 'Non connecté', 'Veuillez connecter votre wallet');
    return;
  }
  
  showLoading(true);
  try {
    const tx = await state.contract.buyMachine(typeId);
    showToast('info', 'Transaction', 'Confirmation en cours...');
    
    const receipt = await tx.wait();
    showToast('success', 'Succès', 'Machine achetée avec succès!');
    
    await loadMiningData();
    
  } catch (error) {
    console.error('Buy machine error:', error);
    showToast('error', 'Échec', error.reason || 'Transaction échouée');
  } finally {
    showLoading(false);
  }
}

async function buyBattery(tokenId, packId) {
  if (!state.contract) return;
  
  showLoading(true);
  try {
    const tx = await state.contract.buyBattery(tokenId, packId);
    await tx.wait();
    showToast('success', 'Batterie achetée', 'Durée étendue avec succès');
    await loadMiningData();
  } catch (error) {
    showToast('error', 'Erreur', error.reason);
  } finally {
    showLoading(false);
  }
}

async function claimMiningRewards(tokenId) {
  if (!state.contract) return;
  
  showLoading(true);
  try {
    const tx = await state.contract.claimMiningRewards(tokenId);
    await tx.wait();
    showToast('success', 'Récompenses claimées', 'FTA ajoutés à votre wallet');
    await refreshBalances();
  } catch (error) {
    showToast('error', 'Erreur', error.reason);
  } finally {
    showLoading(false);
  }
}

async function claimAllRewards() {
  // Claim for all user machines
  const machineIds = state.machines.map(m => m.tokenId);
  
  for (const tokenId of machineIds) {
    await claimMiningRewards(tokenId);
    // Small delay between transactions
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

async function loadMiningData() {
  if (!state.contract) return;
  
  try {
    // Load mining stats
    const totalMined = await state.contract.totalFtaMined();
    state.miningStats.totalMined = ethers.utils.formatUnits(totalMined, 8);
    
    // Load user machines (simplified - in production, query events or use subgraph)
    // This is a demo implementation
    state.machines = []; // Would populate from contract
    
    updateMiningUI();
    
  } catch (error) {
    console.error('Load mining error:', error);
  }
}

function updateMiningUI() {
  document.getElementById('totalMined').textContent = 
    `${parseFloat(state.miningStats.totalMined).toFixed(0)} FTA`;
  document.getElementById('activeMachines').textContent = state.machines.length;
  document.getElementById('claimableRewards').textContent = 
    `${state.claimableRewards.toFixed(2)} FTA`;
}

// ========================================
// TRADING FUNCTIONS
// ========================================
function setOrderSide(side) {
  state.orderSide = side;
  
  document.querySelectorAll('.order-tab[data-side]').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.side === side);
  });
  
  const btn = document.getElementById('orderButton');
  btn.className = `order-btn ${side}`;
  btn.textContent = side === 'buy' ? 'Acheter FTA' : 'Vendre FTA';
}

function setOrderType(type) {
  state.orderType = type;
  document.querySelectorAll('.order-tab[data-type]').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.type === type);
  });
  updateOrderForm();
}

function updateOrderForm() {
  const type = document.getElementById('orderType').value;
  document.getElementById('priceGroup').classList.toggle('hidden', type === 'market');
  document.getElementById('stopLossGroup').classList.toggle('hidden', type !== 'stoplimit');
  document.getElementById('takeProfitGroup').classList.toggle('hidden', type !== 'stoplimit');
}

function updateLeverage() {
  const value = document.getElementById('leverageSlider').value;
  document.getElementById('leverageValue').textContent = `${value}x`;
}

function setAmountPercent(percent) {
  const maxBalance = state.orderSide === 'buy' 
    ? state.balances.usdt 
    : state.balances.fta;
  
  const amount = (parseFloat(maxBalance) * percent / 100).toFixed(4);
  document.getElementById('orderAmount').value = amount;
  updateOrderTotal();
}

function updateOrderTotal() {
  const price = parseFloat(document.getElementById('orderPrice').value) || getFTAPrice();
  const amount = parseFloat(document.getElementById('orderAmount').value) || 0;
  const total = price * amount;
  const fee = total * 0.001; // 0.1%
  
  document.getElementById('orderTotal').textContent = `${formatUSD(total)}`;
  document.getElementById('orderFee').textContent = `${formatUSD(fee)}`;
}

async function placeOrder() {
  if (!state.contract) {
    showToast('error', 'Non connecté', 'Connectez votre wallet');
    return;
  }
  
  const amount = parseFloat(document.getElementById('orderAmount').value);
  const price = parseFloat(document.getElementById('orderPrice').value) || getFTAPrice();
  const leverage = parseInt(document.getElementById('leverageSlider').value);
  const stopLoss = parseFloat(document.getElementById('stopLoss').value) || 0;
  const takeProfit = parseFloat(document.getElementById('takeProfit').value) || 0;
  
  if (!amount || amount <= 0) {
    showToast('warning', 'Montant invalide', 'Veuillez entrer une quantité valide');
    return;
  }
  
  showLoading(true);
  try {
    const asset = 2; // FTA enum value
    const side = state.orderSide === 'buy' ? 0 : 1; // LONG/SHORT
    const margin = ethers.utils.parseUnits((amount * price).toString(), 6); // USDT 6 decimals
    
    let tx;
    if (stopLoss > 0 || takeProfit > 0) {
      tx = await state.contract.openPositionWithLimits(
        asset, side, margin, leverage,
        ethers.utils.parseUnits(stopLoss.toString(), 8),
        ethers.utils.parseUnits(takeProfit.toString(), 8)
      );
    } else {
      tx = await state.contract.openPosition(asset, side, margin, leverage);
    }
    
    showToast('info', 'Ordre placé', 'Confirmation en cours...');
    await tx.wait();
    
    showToast('success', 'Position ouverte', `ID: #${Math.floor(Math.random() * 10000)}`);
    await loadPositions();
    
  } catch (error) {
    console.error('Place order error:', error);
    showToast('error', 'Échec', error.reason || 'Transaction échouée');
  } finally {
    showLoading(false);
  }
}

async function loadPositions() {
  if (!state.contract) return;
  
  try {
    // Load open positions for user
    // Simplified demo - in production, query events or use subgraph
    state.positions = [];
    
    const container = document.getElementById('openPositions');
    if (state.positions.length === 0) {
      container.innerHTML = '<div class="empty-state">Aucune position ouverte</div>';
      return;
    }
    
    // Render positions
    container.innerHTML = state.positions.map(pos => `
      <div class="position-item">
        <div class="position-header">
          <span class="position-pair">${pos.asset}/USDT</span>
          <span class="position-side ${pos.side}">${pos.side}</span>
        </div>
        <div class="position-details">
          <div>Size: ${formatAmount(pos.size)} | Lev: ${pos.leverage}x</div>
          <div>Entry: $${pos.entryPrice} | Liq: $${pos.liquidationPrice}</div>
          <div class="position-pnl ${pos.pnl >= 0 ? 'positive' : 'negative'}">
            P&L: ${pos.pnl >= 0 ? '+' : ''}${formatUSD(pos.pnl)}
          </div>
        </div>
        <button class="action-mini-btn" onclick="closePosition(${pos.id})">Fermer</button>
      </div>
    `).join('');
    
  } catch (error) {
    console.error('Load positions error:', error);
  }
}

async function closePosition(posId) {
  if (!state.contract) return;
  
  showLoading(true);
  try {
    const tx = await state.contract.closePosition(posId);
    await tx.wait();
    showToast('success', 'Position fermée', 'P&L réalisé');
    await loadPositions();
    await refreshBalances();
  } catch (error) {
    showToast('error', 'Erreur', error.reason);
  } finally {
    showLoading(false);
  }
}

// ========================================
// AVIATOR GAME
// ========================================
let aviatorGame = {
  active: false,
  multiplier: 1.00,
  target: 2.00,
  bet: 10,
  animationFrame: null,
  crashPoint: null
};

async function playAviator() {
  if (!state.contract) {
    showToast('error', 'Non connecté', 'Connectez votre wallet');
    return;
  }
  
  const betInput = document.getElementById('aviatorBet');
  const targetInput = document.getElementById('aviatorTarget');
  const btn = document.getElementById('aviatorActionBtn');
  
  const bet = parseFloat(betInput.value);
  const target = parseFloat(targetInput.value);
  
  if (bet > parseFloat(state.balances.fta)) {
    showToast('error', 'Solde insuffisant', 'Vous n\'avez pas assez de FTA');
    return;
  }
  
  if (aviatorGame.active) {
    // Cash out
    cashOutAviator();
    return;
  }
  
  // Place bet
  showLoading(true);
  try {
    const betAmount = ethers.utils.parseUnits(bet.toString(), 8);
    const targetMultiplier = Math.floor(target * 100); // 2.00 -> 200
    
    const tx = await state.contract.playAviator(betAmount, targetMultiplier);
    showToast('info', 'Partie en cours', 'L\'avion décolle...');
    
    await tx.wait();
    
    // Start game animation
    startAviatorAnimation(target);
    
  } catch (error) {
    showToast('error', 'Erreur', error.reason);
  } finally {
    showLoading(false);
  }
}

function startAviatorAnimation(target) {
  aviatorGame = {
    active: true,
    multiplier: 1.00,
    target: target,
    bet: parseFloat(document.getElementById('aviatorBet').value),
    crashPoint: null
  };
  
  const btn = document.getElementById('aviatorActionBtn');
  btn.className = 'aviator-btn cashout';
  btn.querySelector('.btn-text').textContent = 'CASH OUT';
  btn.disabled = false;
  
  const plane = document.getElementById('plane');
  const multiplierEl = document.getElementById('multiplier');
  
  let startTime = Date.now();
  const duration = 3000 + Math.random() * 7000; // Random flight time
  
  function animate() {
    if (!aviatorGame.active) return;
    
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Exponential growth for multiplier
    aviatorGame.multiplier = 1 + (Math.pow(2, progress * 3) - 1) * 2;
    
    // Update UI
    multiplierEl.textContent = `${aviatorGame.multiplier.toFixed(2)}x`;
    
    // Move plane along curve
    const x = progress * 400;
    const y = 180 - (progress * 160);
    plane.setAttribute('cx', x);
    plane.setAttribute('cy', y);
    
    // Check for crash or cashout
    if (progress >= 1) {
      crashAviator(aviatorGame.multiplier);
      return;
    }
    
    if (aviatorGame.multiplier >= aviatorGame.target) {
      // Auto cashout at target
      cashOutAviator();
      return;
    }
    
    aviatorGame.animationFrame = requestAnimationFrame(animate);
  }
  
  animate();
}

function cashOutAviator() {
  if (!aviatorGame.active) return;
  
  aviatorGame.active = false;
  cancelAnimationFrame(aviatorGame.animationFrame);
  
  const winnings = aviatorGame.bet * aviatorGame.multiplier;
  
  // Update UI
  document.getElementById('aviatorActionBtn').className = 'aviator-btn bet';
  document.getElementById('aviatorActionBtn').querySelector('.btn-text').textContent = 'Placer la mise';
  
  // Show win
  showToast('success', 'Cash Out!', `+${formatAmount(winnings)} FTA`);
  
  // Add to history
  addToAviatorHistory(aviatorGame.multiplier, true);
  
  // Refresh balance (in production, wait for event)
  setTimeout(() => refreshBalances(), 2000);
}

function crashAviator(crashAt) {
  aviatorGame.active = false;
  cancelAnimationFrame(aviatorGame.animationFrame);
  
  // Show crash
  const crashIndicator = document.getElementById('crashIndicator');
  document.getElementById('crashValue').textContent = `${crashAt.toFixed(2)}x`;
  crashIndicator.classList.remove('hidden');
  
  // Reset button
  const btn = document.getElementById('aviatorActionBtn');
  btn.className = 'aviator-btn bet';
  btn.querySelector('.btn-text').textContent = 'Placer la mise';
  
  // Hide crash indicator after delay
  setTimeout(() => {
    crashIndicator.classList.add('hidden');
  }, 3000);
  
  // Add to history
  addToAviatorHistory(crashAt, false);
  
  if (crashAt < aviatorGame.target) {
    showToast('error', 'Crash!', `@ ${crashAt.toFixed(2)}x`);
  }
}

function addToAviatorHistory(multiplier, won) {
  const history = document.getElementById('aviatorHistory');
  const item = document.createElement('span');
  item.className = `history-item ${won ? 'win' : 'lose'}`;
  item.textContent = `${multiplier.toFixed(2)}x`;
  
  history.insertBefore(item, history.firstChild);
  
  // Keep only last 20
  while (history.children.length > 20) {
    history.removeChild(history.lastChild);
  }
}

function adjustBet(amount) {
  const input = document.getElementById('aviatorBet');
  let value = parseFloat(input.value) || 10;
  value = Math.max(1, Math.min(10000, value + amount));
  input.value = value.toFixed(2);
}

// ========================================
// CHART FUNCTIONS (See chart.js for full implementation)
// ========================================
function initTradingChart() {
  const container = document.getElementById('tradingChart');
  
  state.chart = LightweightCharts.createChart(container, {
    width: container.clientWidth,
    height: 280,
    layout: {
      backgroundColor: 'transparent',
      textColor: '#B0B0C0',
    },
    grid: {
      vertLines: { color: 'rgba(42, 42, 63, 0.5)' },
      horzLines: { color: 'rgba(42, 42, 63, 0.5)' },
    },
    crosshair: { mode: LightweightCharts.CrosshairMode.Normal },
    timeScale: {
      borderColor: 'rgba(42, 42, 63, 0.8)',
      timeVisible: true,
      secondsVisible: false,
    },
    rightPriceScale: {
      borderColor: 'rgba(42, 42, 63, 0.8)',
    },
  });
  
  state.candleSeries = state.chart.addCandlestickSeries({
    upColor: '#00C853',
    downColor: '#FF1744',
    borderVisible: false,
    wickUpColor: '#00C853',
    wickDownColor: '#FF1744',
  });
  
  // Load initial data
  loadCandleData();
  
  // Handle resize
  window.addEventListener('resize', resizeChart);
}

function resizeChart() {
  const container = document.getElementById('tradingChart');
  if (state.chart) {
    state.chart.applyOptions({
      width: container.clientWidth,
      height: 280,
    });
  }
}

async function loadCandleData() {
  // Demo data - in production, fetch from API or subgraph
  const data = generateDemoCandles(100);
  state.candleSeries.setData(data);
  state.candleData = data;
  
  // Start real-time updates
  startCandleUpdates();
}

function generateDemoCandles(count) {
  const candles = [];
  let time = Math.floor(Date.now() / 1000) - (count * 900); // 15min intervals
  let price = 1.25;
  
  for (let i = 0; i < count; i++) {
    const change = (Math.random() - 0.48) * 0.05;
    const open = price;
    const close = price + change;
    const high = Math.max(open, close) + Math.random() * 0.02;
    const low = Math.min(open, close) - Math.random() * 0.02;
    
    candles.push({ time, open, high, low, close });
    
    price = close;
    time += 900;
  }
  
  return candles;
}

function startCandleUpdates() {
  // Simulate real-time price updates
  setInterval(() => {
    if (!state.candleData.length) return;
    
    const last = state.candleData[state.candleData.length - 1];
    const change = (Math.random() - 0.5) * 0.002;
    const newClose = Math.max(0.01, last.close + change);
    
    // Update last candle
    const updated = {
      ...last,
      close: newClose,
      high: Math.max(last.high, newClose),
      low: Math.min(last.low, newClose)
    };
    
    state.candleSeries.update(updated);
    state.candleData[state.candleData.length - 1] = updated;
    
    // Update price display
    updatePriceDisplay(newClose);
    
  }, CONFIG.CHART_UPDATE_INTERVAL);
}

function updatePriceDisplay(price) {
  const priceEl = document.getElementById('chartPrice');
  const changeEl = document.getElementById('chartChange');
  
  priceEl.textContent = `$${price.toFixed(4)}`;
  
  const firstPrice = state.candleData[0]?.close || price;
  const change = ((price - firstPrice) / firstPrice * 100).toFixed(2);
  
  changeEl.textContent = `${change >= 0 ? '+' : ''}${change}%`;
  changeEl.className = `price-change ${change >= 0 ? 'positive' : 'negative'}`;
  
  // Update header price
  document.getElementById('ftaPrice').textContent = `$${price.toFixed(2)}`;
  document.getElementById('marketFtaPrice').textContent = `$${price.toFixed(2)}`;
}

function changeTimeframe() {
  const timeframe = document.getElementById('timeframe').value;
  // In production: fetch new data based on timeframe
  showToast('info', 'Timeframe', `Passage en ${timeframe}`);
  loadCandleData();
}

// ========================================
// HELPER & UTILS
// ========================================
function getFTAPrice() {
  // In production: fetch from contract or oracle
  return 1.25; // Demo price
}

function copyAddress() {
  navigator.clipboard.writeText(state.userAddress);
  showToast('success', 'Copié', 'Adresse copiée dans le presse-papier');
}

function copyReferralLink() {
  const link = document.getElementById('referralLink').value;
  navigator.clipboard.writeText(link);
  showToast('success', 'Lien copié', 'Partagez avec vos amis!');
}

function openModal(modalId) {
  document.getElementById('modalOverlay').classList.remove('hidden');
  document.getElementById(`${modalId}Modal`).classList.remove('hidden');
}

function closeModal(modalId) {
  document.getElementById(`${modalId}Modal`).classList.add('hidden');
  // Close overlay if no other modals open
  const openModals = document.querySelectorAll('.modal:not(.hidden)');
  if (openModals.length === 0) {
    document.getElementById('modalOverlay').classList.add('hidden');
  }
}

function setupEventListeners() {
  // Order form updates
  document.getElementById('orderAmount')?.addEventListener('input', updateOrderTotal);
  document.getElementById('orderPrice')?.addEventListener('input', updateOrderTotal);
  
  // Dark mode toggle
  document.getElementById('darkModeToggle')?.addEventListener('change', (e) => {
    state.darkMode = e.target.checked;
    document.body.classList.toggle('dark-mode', state.darkMode);
    savePreferences();
  });
  
  // Close modals on overlay click
  document.getElementById('modalOverlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'modalOverlay') {
      document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
      document.getElementById('modalOverlay').classList.add('hidden');
    }
  });
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal('deposit');
      closeModal('withdraw');
    }
  });
}

function startAutoRefresh() {
  // Refresh balances every 15s if connected
  setInterval(() => {
    if (state.connected && state.contract) {
      refreshBalances();
    }
  }, CONFIG.REFRESH_INTERVAL);
}

// Demo data loader (remove in production)
function loadMockData() {
  // Simulate some initial data for demo purposes
  state.balances = { fta: '125.50', usdt: '500.00', matic: '10.25' };
  state.miningStats = { totalMined: '1250', activeMachines: 3 };
  state.claimableRewards = 12.45;
  
  updateBalanceUI();
  updateMiningUI();
  updateUserProfileUI();
}

function updateUserProfileUI() {
  if (!state.userProfile) return;
  
  document.getElementById('userLevel').textContent = state.userProfile.level;
  document.getElementById('userXp').textContent = state.userProfile.xp.toLocaleString();
  document.getElementById('nextLevelXp').textContent = 
    (state.userProfile.level * 1000).toLocaleString();
  
  const xpPercent = (state.userProfile.xp % 1000) / 10;
  document.getElementById('xpFill').style.width = `${xpPercent}%`;
  
  document.getElementById('totalVolume').textContent = 
    formatUSD(ethers.utils.formatUnits(state.userProfile.totalVolume, 6));
  document.getElementById('feeDiscount').textContent = 
    `${state.userProfile.feeDiscount / 100}%`;
}

// Export for use in other files
window.FitiaApp = {
  state,
  connectWallet,
  buyMachine,
  buyBattery,
  claimMiningRewards,
  placeOrder,
  playAviator,
  showToast,
  formatUSD,
  formatAmount
};