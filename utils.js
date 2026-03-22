/**
 * Fitia PRO - Utility Functions
 */

const Utils = {
  // Format numbers
  formatNumber: (num, decimals = 2) => {
    if (num === null || num === undefined) return '0';
    const n = typeof num === 'object' ? ethers.utils.formatEther(num) : num;
    return parseFloat(n).toFixed(decimals);
  },
  
  formatCurrency: (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  },
  
  formatCrypto: (amount, symbol, decimals = 4) => {
    return `${Utils.formatNumber(amount, decimals)} ${symbol}`;
  },
  
  // Address formatting
  shortenAddress: (address, chars = 4) => {
    if (!address) return '';
    return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
  },
  
  // Time formatting
  formatDuration: (seconds) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}j ${hours}h`;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  },
  
  formatTimestamp: (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString('fr-FR', {
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
    });
  },
  
  // Percentage calculation
  calculatePercentChange: (oldVal, newVal) => {
    if (!oldVal) return 0;
    return ((newVal - oldVal) / oldVal * 100).toFixed(2);
  },
  
  // Local storage helpers
  save: (key, value) => {
    try {
      localStorage.setItem(`fitia_${key}`, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn('Storage save failed:', e);
      return false;
    }
  },
  
  load: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(`fitia_${key}`);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.warn('Storage load failed:', e);
      return defaultValue;
    }
  },
  
  // Debounce function for performance
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  
  // Copy to clipboard
  copyToClipboard: async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error('Copy failed:', err);
      return false;
    }
  },
  
  // Validate inputs
  isValidAddress: (address) => {
    return ethers.utils.isAddress(address);
  },
  
  isValidAmount: (amount, min = 0) => {
    const num = parseFloat(amount);
    return !isNaN(num) && num >= min;
  },
  
  // Parse big numbers from contract
  parseUnits: (value, decimals) => {
    return ethers.utils.parseUnits(value.toString(), decimals);
  },
  
  formatUnits: (value, decimals) => {
    return ethers.utils.formatUnits(value, decimals);
  },
  
  // Calculate P&L for positions
  calculatePnL: (entryPrice, currentPrice, size, leverage, isLong) => {
    const priceDiff = isLong ? currentPrice - entryPrice : entryPrice - currentPrice;
    const pnl = (priceDiff / entryPrice) * size * leverage;
    return pnl;
  },
  
  // Calculate liquidation price
  calculateLiquidationPrice: (entryPrice, margin, leverage, isLong) => {
    const maintenanceMargin = 0.005; // 0.5%
    const liquidationBuffer = margin * (1 - maintenanceMargin);
    
    if (isLong) {
      return entryPrice * (1 - (liquidationBuffer / (margin * leverage)));
    } else {
      return entryPrice * (1 + (liquidationBuffer / (margin * leverage)));
    }
  }
};

// Make available globally
window.Utils = Utils;