// ============================================
// FITIA PRO - Configuration Production
// ⚠️ REMPLACEZ LES ADRESSES CI-DESSOUS
// ============================================

const CONFIG = {
    // ==========================================
    // ⚠️ REMPLACEZ PAR VOS VRAIES ADRESSES
    // ==========================================
    MINING: '0xb7555D092b0B30D30552502f8a2674D48601b10F',  // Votre contrat FitiaMiningV2 DÉPLOYÉ
    FTA: '0x535bBe393D64a60E14B731b7350675792d501623',     // Votre token FTA DÉPLOYÉ
    USDT: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',  // USDT Polygon (NE PAS CHANGER)
    
    // ==========================================
    // RÉSEAU POLYGON MAINNET
    // ==========================================
    CHAIN_ID: 137,
    CHAIN_ID_HEX: '0x89',
    NETWORK_NAME: 'Polygon Mainnet',
    RPC_URL: 'https://polygon-rpc.com',
    EXPLORER_URL: 'https://polygonscan.com',
    
    // ==========================================
    // LOGOS
    // ==========================================
    LOGO_USDT: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
    LOGO_FTA: 'https://i.ibb.co/vvz2DDK5/20260207-190817.webp',
    
    // ==========================================
    // PARAMÈTRES
    // ==========================================
    DECIMALS: {
        USDT: 6,
        FTA: 8  // Ajustez selon votre token FTA (18 ou 8)
    },
    
    // ==========================================
    // FRAIS ET LIMITES
    // ==========================================
    FEES: {
        SWAP: 4,        // 4%
        CLAIM: 3,       // 3%
        DEV: 5          // 5%
    },
    
    // ==========================================
    // PRIX DES JEUX (en FTA)
    // ==========================================
    GAMES: {
        WHEEL: 100,
        FISHING: 50,
        LOTTERY: 50
    }
};

// Export global
window.CONFIG = CONFIG;

// ============================================
// VALIDATION AU DÉMARRAGE
// ============================================
console.log('🔍 FITIA PRO - Vérification Configuration...');
console.log('📍 Mining Contract:', CONFIG.MINING);
console.log('📍 FTA Token:', CONFIG.FTA);
console.log('📍 USDT Token:', CONFIG.USDT);
console.log('📍 Network: Polygon (Chain ID:', CONFIG.CHAIN_ID + ')');

if (CONFIG.MINING === '0x0000000000000000000000000000000000000000' || 
    CONFIG.FTA === '0x0000000000000000000000000000000000000000') {
    console.warn('⚠️ ATTENTION: Adresses de contrat non configurées!');
    console.warn('⚠️ Modifiez config.js avec vos vraies adresses déployées');
}