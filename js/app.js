// ============================================
// ÉTAT GLOBAL
// ============================================
let provider, signer, userAddress, contract;
let balances = { fta: 0, usdt: 0 };

// ============================================
// INITIALISATION
// ============================================
window.addEventListener('load', async () => {
  console.log('✅ FitiaPRO chargé');
  
  if (typeof ethers === 'undefined') {
    showToast('error', 'Erreur', 'ethers.js non chargé');
    return;
  }
  
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        await connectExistingWallet();
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  }
});

// ============================================
// CONNEXION WALLET
// ============================================
async function connectWallet(type) {
  try {
    if (typeof ethers === 'undefined') {
      throw new Error('ethers.js non chargé');
    }

    let ethProvider;
    
    if (type === 'metamask') {
      if (!window.ethereum) {
        window.open('https://metamask.io/download', '_blank');
        throw new Error('MetaMask non installé');
      }
      ethProvider = window.ethereum;
    } else if (type === 'bitget') {
      ethProvider = window.bitkeep?.ethereum || window.bitget?.ethereum;
      if (!ethProvider) {
        window.open('https://web3.bitget.com', '_blank');
        throw new Error('Bitget Wallet non installé');
      }
    }

    const accounts = await ethProvider.request({ method: 'eth_requestAccounts' });
    provider = new ethers.providers.Web3Provider(ethProvider);
    signer = provider.getSigner();
    userAddress = accounts[0];

    await switchToPolygon();

    if (CONFIG.CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000') {
      contract = new ethers.Contract(CONFIG.CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    }

    closeModal();
    updateUI();
    await loadBalances();
    showToast('success', 'Connecté!', formatAddress(userAddress));

  } catch (error) {
    console.error('Erreur connexion:', error);
    showToast('error', 'Erreur', error.message);
  }
}

async function switchToPolygon() {
  try {
    await window.ethereum?.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: CONFIG.CHAIN_ID_HEX }],
    });
  } catch (error) {
    if (error.code === 4902) {
      await window.ethereum?.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: CONFIG.CHAIN_ID_HEX,
          chainName: 'Polygon Mainnet',
          nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
          rpcUrls: [CONFIG.RPC_URL],
          blockExplorerUrls: [CONFIG.BLOCK_EXPLORER],
        }],
      });
    }
  }
}

async function connectExistingWallet() {
  provider = new ethers.providers.Web3Provider(window.ethereum);
  signer = provider.getSigner();
  userAddress = (await provider.listAccounts())[0];
  
  if (CONFIG.CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000') {
    contract = new ethers.Contract(CONFIG.CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  }
  
  updateUI();
  await loadBalances();
}

// ============================================
// FONCTIONS UI
// ============================================
function updateUI() {
  document.getElementById('connectModal').classList.add('hidden');
  document.getElementById('mainApp').style.display = 'block';
  document.getElementById('walletAddress').textContent = userAddress;
}

function closeModal(modalId) {
  if (modalId) {
    document.getElementById(modalId).classList.add('hidden');
  } else {
    document.getElementById('connectModal').classList.add('hidden');
  }
}

function openModal(modalId) {
  document.getElementById(modalId + 'Modal').classList.remove('hidden');
}

function switchTab(tab) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  
  document.getElementById(tab + 'Section').classList.add('active');
  event.target.classList.add('active');
}

function disconnectWallet() {
  provider = null;
  signer = null;
  userAddress = null;
  contract = null;
  document.getElementById('connectModal').classList.remove('hidden');
  document.getElementById('mainApp').style.display = 'none';
  showToast('info', 'Déconnecté', 'Wallet déconnecté');
}

function formatAddress(addr) {
  return addr.slice(0, 6) + '...' + addr.slice(-4);
}

// ============================================
// BALANCES
// ============================================
async function loadBalances() {
  if (!contract) {
    balances = { fta: 125.50, usdt: 500.00 };
    updateBalanceUI();
    return;
  }

  try {
    const ftaBalance = await contract.getMyBalance(CONFIG.FTA_ADDRESS);
    const usdtBalance = await contract.getMyBalance(CONFIG.USDT_ADDRESS);
    
    balances.fta = parseFloat(ethers.utils.formatUnits(ftaBalance, 8));
    balances.usdt = parseFloat(ethers.utils.formatUnits(usdtBalance, 6));
    
    updateBalanceUI();
  } catch (error) {
    console.error('Erreur balance:', error);
    balances = { fta: 125.50, usdt: 500.00 };
    updateBalanceUI();
  }
}

function updateBalanceUI() {
  const ftaPrice = CONFIG.FTA_PRICE_USD;
  
  document.getElementById('ftaBalance').textContent = `${balances.fta.toFixed(2)} FTA`;
  document.getElementById('usdtBalance').textContent = `${balances.usdt.toFixed(2)} USDT`;
  document.getElementById('ftaValue').textContent = `$${(balances.fta * ftaPrice).toFixed(2)}`;
  document.getElementById('usdtValue').textContent = `$${balances.usdt.toFixed(2)}`;
  document.getElementById('totalBalance').textContent = `$${((balances.fta * ftaPrice) + balances.usdt).toFixed(2)}`;
}

// ============================================
// DÉPÔT / RETRAIT
// ============================================
async function confirmDeposit() {
  const token = document.getElementById('depositToken').value;
  const amount = document.getElementById('depositAmount').value;
  
  if (!contract) {
    showToast('error', 'Erreur', 'Mode démo - Contrat non configuré');
    return;
  }

  try {
    const tokenAddress = token === 'USDT' ? CONFIG.USDT_ADDRESS : CONFIG.FTA_ADDRESS;
    const decimals = token === 'USDT' ? 6 : 8;
    const amountWei = ethers.utils.parseUnits(amount, decimals);
    
    const tx = await contract.depositToWallet(tokenAddress, amountWei);
    showToast('info', 'Dépôt', 'Transaction en cours...');
    await tx.wait();
    
    showToast('success', 'Succès', `Dépôt de ${amount} ${token} confirmé!`);
    closeModal('depositModal');
    await loadBalances();
  } catch (error) {
    showToast('error', 'Erreur', error.reason || error.message);
  }
}

async function confirmWithdraw() {
  const token = document.getElementById('withdrawToken').value;
  const amount = document.getElementById('withdrawAmount').value;
  
  if (!contract) {
    showToast('error', 'Erreur', 'Mode démo - Contrat non configuré');
    return;
  }

  try {
    const tokenAddress = token === 'USDT' ? CONFIG.USDT_ADDRESS : CONFIG.FTA_ADDRESS;
    const decimals = token === 'USDT' ? 6 : 8;
    const amountWei = ethers.utils.parseUnits(amount, decimals);
    
    const tx = await contract.withdrawFromWallet(tokenAddress, amountWei);
    showToast('info', 'Retrait', 'Transaction en cours...');
    await tx.wait();
    
    showToast('success', 'Succès', `Retrait de ${amount} ${token} confirmé!`);
    closeModal('withdrawModal');
    await loadBalances();
  } catch (error) {
    showToast('error', 'Erreur', error.reason || error.message);
  }
}

// ============================================
// TRADING
// ============================================
async function executeTrade() {
  const type = document.getElementById('tradeType').value;
  const amount = document.getElementById('tradeAmount').value;
  
  if (!contract) {
    showToast('error', 'Erreur', 'Mode démo - Contrat non configuré');
    return;
  }

  try {
    if (type === 'buy') {
      const tx = await contract.buyFTA(ethers.utils.parseUnits(amount, 6));
      showToast('info', 'Achat', 'Transaction en cours...');
      await tx.wait();
      showToast('success', 'Succès', 'FTA achetés!');
    }
    await loadBalances();
  } catch (error) {
    showToast('error', 'Erreur', error.reason || error.message);
  }
}

// ============================================
// MINING
// ============================================
async function buyMachine(typeId) {
  if (!contract) {
    showToast('error', 'Erreur', 'Mode démo - Contrat non configuré');
    return;
  }

  try {
    const tx = await contract.buyMachine(typeId);
    showToast('info', 'Achat', 'Machine en cours...');
    await tx.wait();
    showToast('success', 'Succès', 'Machine achetée!');
  } catch (error) {
    showToast('error', 'Erreur', error.reason || error.message);
  }
}

async function claimRewards() {
  if (!contract) {
    showToast('error', 'Erreur', 'Mode démo - Contrat non configuré');
    return;
  }

  try {
    const tx = await contract.claimMiningRewards(0);
    showToast('info', 'Claim', 'Récompenses en cours...');
    await tx.wait();
    showToast('success', 'Succès', 'Récompenses claimées!');
    await loadBalances();
  } catch (error) {
    showToast('error', 'Erreur', error.reason || error.message);
  }
}

// ============================================
// AVIATOR GAME
// ============================================
async function playAviator() {
  const bet = document.getElementById('aviatorBet').value;
  const target = document.getElementById('aviatorTarget').value;
  
  if (!contract) {
    // Mode démo
    let multiplier = 1.00;
    const interval = setInterval(() => {
      multiplier += 0.1;
      document.getElementById('aviatorMultiplier').textContent = multiplier.toFixed(2) + 'x';
      
      if (multiplier >= target) {
        clearInterval(interval);
        const win = (bet * multiplier).toFixed(2);
        showToast('success', 'Gagné!', `+${win} FTA`);
      }
      
      if (multiplier >= 5) {
        clearInterval(interval);
        showToast('error', 'Crash!', `@ ${multiplier.toFixed(2)}x`);
      }
    }, 200);
    return;
  }

  try {
    const tx = await contract.playAviator(
      ethers.utils.parseUnits(bet, 8),
      Math.floor(target * 100)
    );
    showToast('info', 'Jeu', 'Partie en cours...');
    await tx.wait();
  } catch (error) {
    showToast('error', 'Erreur', error.reason || error.message);
  }
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================
function showToast(type, title, message) {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<strong>${title}</strong><br><small>${message}</small>`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ============================================
// WALLET LISTENERS
// ============================================
if (window.ethereum) {
  window.ethereum.on('accountsChanged', (accounts) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else {
      userAddress = accounts[0];
      updateUI();
    }
  });
  
  window.ethereum.on('chainChanged', () => {
    window.location.reload();
  });
}