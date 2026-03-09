// ============================================
// FITIA PRO - Configuration Blockchain
// Version Production - Polygon Mainnet
// ============================================

const CONFIG = {
    NETWORK: {
        CHAIN_ID: 137,
        NAME: 'Polygon Mainnet',
        RPC_URL: 'https://polygon-rpc.com',
        EXPLORER: 'https://polygonscan.com',
        CURRENCY: 'MATIC'
    },

    // ⚠️ REMPLACEZ CES ADRESSES PAR LES VÔTRES
    CONTRACTS: {
        FITIA_MINING: '0x0000000000000000000000000000000000000000',
        FTA_TOKEN: '0x0000000000000000000000000000000000000000',
        USDT_TOKEN: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F'
    },

    DECIMALS: {
        USDT: 6,
        FTA: 8
    },

    SETTINGS: {
        MACHINE_LIFESPAN: 7776000,
        DIFFICULTY_MULTIPLIER: '1000000000000000000',
        DEV_FEE_MACHINE: 5,
        SWAP_FEE: 4,
        CLAIM_FEE: 3,
        COMMISSION_RATES: [3, 2, 1],
        MAX_BET_PERCENTAGE: 5,
        WHEEL_TICKET_PRICE: 100,
        LOTTERY_TICKET_PRICE: 50,
        FISHING_TICKET_PRICE: 50
    },

    MACHINE_TYPES: [
        { id: 0, name: 'Miner S1', price: 3, power: 0.5, currency: 'USDT' },
        { id: 1, name: 'Miner S2', price: 5, power: 0.9, currency: 'USDT' },
        { id: 2, name: 'Miner M1', price: 10, power: 2.0, currency: 'USDT' },
        { id: 3, name: 'Miner M2', price: 15, power: 3.2, currency: 'USDT' },
        { id: 4, name: 'Miner L1', price: 20, power: 4.5, currency: 'USDT' },
        { id: 5, name: 'Miner L2', price: 30, power: 7.0, currency: 'USDT' },
        { id: 6, name: 'Miner X1', price: 40, power: 9.5, currency: 'USDT' },
        { id: 7, name: 'Miner X2', price: 50, power: 12.5, currency: 'USDT' },
        { id: 8, name: 'Miner Pro1', price: 75, power: 19.5, currency: 'USDT' },
        { id: 9, name: 'Miner Pro2', price: 100, power: 27.0, currency: 'USDT' }
    ],

    UI: {
        APP_NAME: 'FITIA PRO',
        APP_VERSION: '2.0.0',
        SUPPORT_EMAIL: 'support@fitia.pro'
    }
};

window.CONTRACT_ADDRESSES = CONFIG.CONTRACTS;
window.NETWORK_CONFIG = CONFIG.NETWORK;
window.TOKEN_DECIMALS = CONFIG.DECIMALS;
window.MACHINE_TYPES = CONFIG.MACHINE_TYPES;
window.CONTRACT_SETTINGS = CONFIG.SETTINGS;
window.APP_CONFIG = CONFIG;