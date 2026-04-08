// ═══════════════════════════════════════
//  TRANSLATIONS
// ═══════════════════════════════════════
const LANG = {
    en: {
        btn_back: '← Back',
        heading_recovery: 'Recovery Phrase',
        warn_recovery: 'Save these 12 words in a safe place. They are the only way to recover your wallet.',
        btn_copy_phrase: '📋 Copy phrase',
        check_saved: 'I have saved my recovery phrase',
        btn_continue: 'Continue',
        heading_protect: 'Protect your wallet',
        desc_protect: 'Set a password to encrypt your wallet locally.',
        btn_create_wallet: 'Create wallet',
        heading_import: 'Import a wallet',
        tab_private_key: 'Private Key',
        tab_phrase: '12-word Phrase',
        btn_import_submit: 'Import',
        label_unlock: 'Enter your password to unlock',
        btn_unlock: 'Unlock',
        btn_delete_wallet: 'Delete this wallet',
        label_wallet_addr: 'Wallet Address',
        btn_treasury: 'Deposit / Withdraw',
        btn_export_key: 'Export private key',
        btn_logout: 'Logout',
        heading_treasury: '💰 Treasury',
        tab_deposit: 'Deposit',
        tab_withdraw: 'Withdraw',
        label_receiving_addr: 'Receiving address',
        label_amount: 'Amount to send',
        label_destination: 'Destination address',
        btn_send: 'SEND',
        heading_export: 'Export private key',
        warn_export: '⚠️ Never share your private key with anyone.',
        btn_show_key: 'Show key',
        btn_copy_key: '📋 Copy key',
        btn_cancel: 'Cancel',
        heading_referral: '👥 Referral System',
        desc_referral: 'Earn commissions on 3 levels.',
        label_your_ref_addr: 'Your referral address:',
        label_bind_referrer_desc: "Enter your referrer's address to bind:",
        ph_ref_addr: 'Paste referrer address (0x...)',
        label_ref_detected: 'Referrer detected: ',
        btn_bind_ref: 'BIND MY REFERRER',
        label_power: 'POWER',
        label_fta_sec: 'FTA / sec',
        label_pending: 'PENDING',
        btn_claim: 'CLAIM',
        heading_shop: '⛏️ Shop',
        heading_my_rigs: '⚙️ My Machines',
        no_rigs_text: "You don't have any active machines yet.",
        heading_games: '🎮 Game Center',
        tab_wingo: 'Win Go',
        tab_wheel: 'Wheel',
        tab_fishing: 'Fishing',
        tab_lottery: 'Lottery',
        info_wingo: 'Guess the number (0-9) or Big/Small.',
        btn_small: 'Small (0-4)',
        btn_big: 'Big (5-9)',
        info_wheel: 'Spin to try to win the Jackpot!',
        label_jackpot: 'Jackpot:',
        btn_spin: 'Spin (100 FTA)',
        info_fishing: 'Cast your line to catch rewards.',
        btn_fish: 'Fish (50 FTA)',
        label_pot: 'Pot:',
        info_lottery: 'Buy a ticket to participate in the draw.',
        btn_lottery: 'Buy Ticket (50 FTA)',
        heading_swap: '💱 Exchange',
        label_you_pay: 'You pay',
        label_balance: 'Balance:',
        label_you_receive: 'You receive',
        btn_swap: 'SWAP',
        nav_home: 'Home',
        nav_shop: 'Shop',
        nav_rigs: 'My Rigs',
        nav_games: 'Games',
        nav_swap: 'Swap',
        ph_password: 'Password (min. 6 characters)',
        ph_confirm: 'Confirm password',
        ph_private_key: 'Paste your private key (0x...)',
        ph_phrase: 'Paste your 12 words separated by spaces',
        ph_password_simple: 'Password',
        ph_confirm_export: 'Confirm your password',
        ph_bet_fta: 'Bet in FTA',
        link_connect_first: 'Connect first...',
        loader_generating: 'Generating...',
        err_mnemonic: 'Mnemonic not generated.',
        err_generation: 'Generation error.',
        err_pwd_short: 'Password too short (min. 6)',
        err_pwd_mismatch: 'Passwords do not match',
        loader_encrypting: 'Encrypting...',
        err_insecure: 'Insecure context. Open via HTTPS or localhost.',
        loader_importing: 'Importing...',
        err_invalid_key: 'Invalid private key',
        err_invalid_phrase: 'Invalid phrase (12 words)',
        err_enter_pwd: 'Enter your password',
        loader_unlocking: 'Unlocking...',
        err_wrong_pwd: 'Wrong password',
        confirm_delete: 'Delete this wallet? Irreversible without your recovery phrase.',
        toast_deleted: 'Wallet deleted',
        toast_phrase_copied: 'Phrase copied!',
        toast_addr_copied: 'Address copied!',
        err_invalid_amount: 'Invalid amount',
        err_invalid_addr: 'Invalid destination address',
        loader_sending: 'Sending...',
        toast_pol_sent: 'POL sent successfully!',
        toast_usdt_sent: 'USDT sent successfully!',
        toast_fta_sent: 'FTA sent successfully!',
        toast_key_copied: 'Key copied!',
        loader_connecting: 'Connecting to mainnet...',
        loader_rpc_saved: 'Testing saved RPC...',
        loader_wss: 'WSS {0}/{1}...',
        loader_rpc: 'RPC {0}/{1}...',
        prompt_rpc: 'No Polygon RPC with write access found.\n\nSOLUTION: Use your own RPC that allows transactions:\n- Alchemy: https://alchemy.com\n- Infura: https://infura.io\n- QuickNode: https://quicknode.com\n\nOr paste a Polygon RPC URL here:',
        err_rpc_required: 'RPC required to continue.',
        loader_test_rpc: 'Testing RPC...',
        err_rpc_no_response: 'This RPC cannot send transactions from browser.',
        toast_connected: 'Connected to Polygon mainnet!',
        err_finalization: 'Finalization error: ',
        viz_mining: 'ACTIVE MINING',
        viz_no_machine: 'NO MACHINE',
        viz_waiting: 'WAITING',
        rate_display: '1 USDT = {0} FTA',
        loader_binding: 'Binding...',
        toast_ref_bound: 'Referrer bound!',
        err_connect_first: 'Connect first',
        toast_link_copied: 'Link copied!',
        rig_name: 'RIG {0}',
        btn_buy: 'BUY',
        err_not_connected: 'Wallet not connected',
        loader_transaction: 'Transaction...',
        toast_purchase: 'Purchase successful!',
        loader_swapping: 'Swapping...',
        toast_swap_success: 'Swap successful!',
        loader_claiming: 'Claiming...',
        toast_claimed: 'Rewards claimed!',
        err_invalid_bet: 'Invalid bet',
        result_number: 'Result: {0}',
        toast_wheel_spun: 'Wheel spun!',
        status_waiting: 'Waiting...',
        status_casting: 'Casting...',
        status_line_cast: 'Line cast...',
        status_bite: 'It bites!',
        toast_fish_success: 'Fishing successful!',
        label_error: 'Error',
        loader_ticket: 'Buying ticket...',
        toast_ticket: 'Ticket purchased!',
        err_self_ref: 'Cannot refer yourself.',
        err_ref_set: 'Referrer already set.',
        status_active: 'ACTIVE',
        label_balance_token: 'Balance {0}',
        label_available_token: 'Available {0}',
        note_deposit: 'Send {0} to this address from your external wallet (MetaMask, Trust Wallet, exchange, etc.).',
        warn_deposit: '⚠️ Only send {0} on the Polygon network. Any other network or token will be lost.',
        nav_history: 'History',
        heading_history: '📜 History',
        filter_all: 'All',
        filter_sends: 'Sends',
        filter_swaps: 'Swaps',
        filter_games: 'Games',
        filter_mining: 'Mining',
        no_history: 'No transactions yet.',
        btn_clear_history: 'Clear',
        tx_send_pol: 'Send POL',
        tx_send_usdt: 'Send USDT',
        tx_send_fta: 'Send FTA',
        tx_buy_machine: 'Machine Purchase',
        tx_swap: 'Token Swap',
        tx_claim: 'Claim Rewards',
        tx_lottery: 'Lottery Ticket',
        tx_wheel: 'Wheel Spin',
        tx_fishing: 'Fishing',
        tx_wingo: 'Win Go Bet',
        tx_referral: 'Referral Bind',
        label_just_now: 'Just now',
        label_min_ago: '{0}m ago',
        label_hr_ago: '{0}h ago',
        label_day_ago: '{0}d ago',
        err_rpc_no_write: 'RPC blocks transactions (CORS). Trying next...'
    },
    fr: {
        btn_back: '← Retour',
        heading_recovery: 'Phrase de récupération',
        warn_recovery: 'Sauvegardez ces 12 mots en lieu sûr. Ils sont la seule façon de récupérer votre wallet.',
        btn_copy_phrase: '📋 Copier la phrase',
        check_saved: "J'ai sauvegardé ma phrase de récupération",
        btn_continue: 'Continuer',
        heading_protect: 'Protéger votre wallet',
        desc_protect: 'Définissez un mot de passe pour chiffrer votre wallet localement.',
        btn_create_wallet: 'Créer le wallet',
        heading_import: 'Importer un wallet',
        tab_private_key: 'Clé privée',
        tab_phrase: 'Phrase 12 mots',
        btn_import_submit: 'Importer',
        label_unlock: 'Entrez votre mot de passe pour déverrouiller',
        btn_unlock: 'Déverrouiller',
        btn_delete_wallet: 'Supprimer ce wallet',
        label_wallet_addr: 'Adresse du Wallet',
        btn_treasury: 'Dépôt / Retrait',
        btn_export_key: 'Exporter la clé privée',
        btn_logout: 'Déconnexion',
        heading_treasury: '💰 Trésorerie',
        tab_deposit: 'Dépôt',
        tab_withdraw: 'Retrait',
        label_receiving_addr: 'Adresse de réception',
        label_amount: 'Montant à envoyer',
        label_destination: 'Adresse de destination',
        btn_send: 'ENVOYER',
        heading_export: 'Exporter la clé privée',
        warn_export: '⚠️ Ne partagez jamais votre clé privée avec personne.',
        btn_show_key: 'Afficher la clé',
        btn_copy_key: '📋 Copier la clé',
        btn_cancel: 'Annuler',
        heading_referral: '👥 Système de Parrainage',
        desc_referral: 'Gagnez des commissions sur 3 niveaux.',
        label_your_ref_addr: 'Votre adresse de parrainage :',
        label_bind_referrer_desc: "Entrez l'adresse de votre parrain pour lier :",
        ph_ref_addr: "Collez l'adresse du parrain (0x...)",
        label_ref_detected: 'Parrain détecté : ',
        btn_bind_ref: 'LIER MON PARRAIN',
        label_power: 'PUISSANCE',
        label_fta_sec: 'FTA / sec',
        label_pending: 'EN ATTENTE',
        btn_claim: 'RÉCLAMER',
        heading_shop: '⛏️ Boutique',
        heading_my_rigs: '⚙️ Mes Machines',
        no_rigs_text: "Vous n'avez pas encore de machines actives.",
        heading_games: '🎮 Game Center',
        tab_wingo: 'Win Go',
        tab_wheel: 'Roue',
        tab_fishing: 'Pêche',
        tab_lottery: 'Loterie',
        info_wingo: 'Deviner le numéro (0-9) ou Grand/Petit.',
        btn_small: 'Petit (0-4)',
        btn_big: 'Grand (5-9)',
        info_wheel: 'Tournez pour tenter de gagner le Jackpot !',
        label_jackpot: 'Jackpot:',
        btn_spin: 'Tourner (100 FTA)',
        info_fishing: 'Lancez votre ligne pour attraper des gains.',
        btn_fish: 'Pêcher (50 FTA)',
        label_pot: 'Pot:',
        info_lottery: 'Achetez un ticket pour participer au tirage.',
        btn_lottery: 'Acheter Ticket (50 FTA)',
        heading_swap: '💱 Échange',
        label_you_pay: 'Vous payez',
        label_balance: 'Solde:',
        label_you_receive: 'Vous recevez',
        btn_swap: 'ÉCHANGER',
        nav_home: 'Home',
        nav_shop: 'Shop',
        nav_rigs: 'Mes Rigs',
        nav_games: 'Jeux',
        nav_swap: 'Swap',
        ph_password: 'Mot de passe (min. 6 caractères)',
        ph_confirm: 'Confirmer le mot de passe',
        ph_private_key: 'Collez votre clé privée (0x...)',
        ph_phrase: 'Collez votre phrase de 12 mots séparées par des espaces',
        ph_password_simple: 'Mot de passe',
        ph_confirm_export: 'Confirmez votre mot de passe',
        ph_bet_fta: 'Mise en FTA',
        link_connect_first: 'Connectez-vous...',
        loader_generating: 'Génération...',
        err_mnemonic: 'Mnemonic non généré.',
        err_generation: 'Erreur de génération.',
        err_pwd_short: 'Mot de passe trop court (min. 6)',
        err_pwd_mismatch: 'Les mots de passe ne correspondent pas',
        loader_encrypting: 'Chiffrement...',
        err_insecure: 'Contexte non sécurisé. Ouvrez via HTTPS ou localhost.',
        loader_importing: 'Import...',
        err_invalid_key: 'Clé privée invalide',
        err_invalid_phrase: 'Phrase invalide (12 mots)',
        err_enter_pwd: 'Entrez votre mot de passe',
        loader_unlocking: 'Déverrouillage...',
        err_wrong_pwd: 'Mot de passe incorrect',
        confirm_delete: 'Supprimer ce wallet ? Irréversible sans votre phrase de récupération.',
        toast_deleted: 'Wallet supprimé',
        toast_phrase_copied: 'Phrase copiée !',
        toast_addr_copied: 'Adresse copiée !',
        err_invalid_amount: 'Montant invalide',
        err_invalid_addr: 'Adresse de destination invalide',
        loader_sending: 'Envoi en cours...',
        toast_pol_sent: 'POL envoyé avec succès !',
        toast_usdt_sent: 'USDT envoyé avec succès !',
        toast_fta_sent: 'FTA envoyé avec succès !',
        toast_key_copied: 'Clé copiée !',
        loader_connecting: 'Connexion mainnet...',
        loader_rpc_saved: 'Test RPC sauvegardé...',
        loader_wss: 'WSS {0}/{1}...',
        loader_rpc: 'RPC {0}/{1}...',
        prompt_rpc: "Aucun RPC Polygon avec accès écriture trouvé.\n\nSOLUTION : Utilisez votre propre RPC :\n- Alchemy: https://alchemy.com\n- Infura: https://infura.io\n- QuickNode: https://quicknode.com\n\nOu collez une URL RPC Polygon ici :",
        err_rpc_required: 'RPC requis pour continuer.',
        loader_test_rpc: 'Test RPC...',
        err_rpc_no_response: "Ce RPC ne peut pas envoyer de transactions depuis le navigateur.",
        toast_connected: 'Connecté au mainnet Polygon !',
        err_finalization: 'Erreur finalisation : ',
        viz_mining: 'MINAGE ACTIF',
        viz_no_machine: 'AUCUNE MACHINE',
        viz_waiting: 'EN ATTENTE',
        rate_display: '1 USDT = {0} FTA',
        loader_binding: 'Liaison...',
        toast_ref_bound: 'Parrain lié !',
        err_connect_first: 'Connectez-vous d\'abord',
        toast_link_copied: 'Lien copié !',
        rig_name: 'RIG {0}',
        btn_buy: 'ACHETER',
        err_not_connected: 'Wallet non connecté',
        loader_transaction: 'Transaction...',
        toast_purchase: 'Achat réussi !',
        loader_swapping: 'Swap...',
        toast_swap_success: 'Échange réussi !',
        loader_claiming: 'Claim...',
        toast_claimed: 'Gains réclamés !',
        err_invalid_bet: 'Mise invalide',
        result_number: 'Résultat : {0}',
        toast_wheel_spun: 'Roue tournée !',
        status_waiting: 'En attente...',
        status_casting: 'Lancer...',
        status_line_cast: 'Ligne lancée...',
        status_bite: 'Ça mord !',
        toast_fish_success: 'Pêche réussie !',
        label_error: 'Erreur',
        loader_ticket: 'Ticket...',
        toast_ticket: 'Ticket acheté !',
        err_self_ref: 'Impossible de vous parrainer vous-même.',
        err_ref_set: 'Parrain déjà défini.',
        status_active: 'ACTIF',
        label_balance_token: 'Solde {0}',
        label_available_token: 'Disponible {0}',
        note_deposit: 'Envoyez des {0} à cette adresse depuis votre wallet externe (MetaMask, Trust Wallet, exchange, etc.).',
        warn_deposit: '⚠️ Envoyez uniquement du {0} sur le réseau Polygon. Tout autre réseau ou token sera perdu.',
        nav_history: 'Historique',
        heading_history: '📜 Historique',
        filter_all: 'Tout',
        filter_sends: 'Envois',
        filter_swaps: 'Échanges',
        filter_games: 'Jeux',
        filter_mining: 'Minage',
        no_history: 'Aucune transaction pour le moment.',
        btn_clear_history: 'Effacer',
        tx_send_pol: 'Envoi POL',
        tx_send_usdt: 'Envoi USDT',
        tx_send_fta: 'Envoi FTA',
        tx_buy_machine: 'Achat Machine',
        tx_swap: 'Échange de tokens',
        tx_claim: 'Réclamation de gains',
        tx_lottery: 'Ticket Loterie',
        tx_wheel: 'Tour de Roue',
        tx_fishing: 'Pêche',
        tx_wingo: 'Pari Win Go',
        tx_referral: 'Lien Parrain',
        label_just_now: "À l'instant",
        label_min_ago: 'il y a {0}m',
        label_hr_ago: 'il y a {0}h',
        label_day_ago: 'il y a {0}j',
        err_rpc_no_write: 'RPC bloque les transactions (CORS). Essai suivant...'
    }
};

const CONFIG = {
    MINING: "0xb7555D092b0B30D30552502f8a2674D48601b10F",
    USDT: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    FTA: "0x535bBe393D64a60E14B731b7350675792d501623",
    CHAIN_ID: 137,
    WSS_LIST: [
        "wss://polygon.drpc.org",
        "wss://polygon-mainnet.publicnode.com",
        "wss://rpc.ankr.com/polygon/ws",
        "wss://polygon-bor-rpc.publicnode.com",
        "wss://polygon.gateway.tenderly.co",
        "wss://ws-matic-mainnet.chainstacklabs.com"
    ],
    HTTP_LIST: [
        "https://polygon.drpc.org",
        "https://polygon-rpc.com",
        "https://polygon-mainnet.publicnode.com",
        "https://polygon.llamarpc.com",
        "https://rpc.ankr.com/polygon",
        "https://polygon.gateway.tenderly.co",
        "https://1rpc.io/matic",
        "https://polygon.meowrpc.com",
        "https://polygon-bor-rpc.publicnode.com",
        "https://polygon-mainnet.chainstacklabs.com",
        "https://matic-mainnet.chainstacklabs.com",
        "https://polygon-node.taxi",
        "https://rpc-mainnet.matic.quiknode.pro",
        "https://polygon-bor.publicnode.com"
    ],
    LOGO_USDT: "https://cryptologos.cc/logos/tether-usdt-logo.png",
    LOGO_FTA: "https://i.ibb.co/vvz2DDK5/20260207-190817.webp",
    WALLET_STORAGE_KEY: "fitia_pro_wallet_v1",
    CUSTOM_RPC_KEY: "fitia_custom_rpc",
    LANG_KEY: "fitia_lang"
};

const MINING_ABI = [
    "function getActivePower(address) view returns (uint256)",
    "function getMachineCount() view returns (uint256)",
    "function getUserMachineCount(address, uint256) view returns (uint256)",
    "function machineTypes(uint256) view returns (uint256 price, uint256 power)",
    "function difficultyMultiplier() view returns (uint256)",
    "function exchangeRate() view returns (uint256)",
    "function getWheelJackpot() view returns (uint256)",
    "function getLotteryPool() view returns (uint256)",
    "function buyMachine(uint256 typeId)",
    "function buyMachineWithFTA(uint256 typeId)",
    "function claimRewards()",
    "function setReferrer(address)",
    "function swapUsdtForFta(uint256 amount)",
    "function swapFtaForUsdt(uint256 amount)",
    "function playWinGo(uint256 amount, uint8 betType, uint8 choice)",
    "function spinWheel()",
    "function goFishing()",
    "function buyLotteryTicket()"
];

const ERC20_ABI = [
    "function balanceOf(address) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function approve(address, uint256) returns (bool)",
    "function allowance(address, address) view returns (uint256)",
    "function transfer(address, uint256) returns (bool)"
];

class Application {
    constructor() {
        this.provider = null; this.signer = null; this.contracts = {}; this.user = null;
        this.wallet = null; this.tempWallet = null; this.mnemonicPhrase = "";
        this.currentRate = 0; this.payMode = 'USDT';
        this.ftaDecimals = 18; this.currentMultiplier = 1000000000000000000n;
        this.currentRealPower = 0; this.pendingBalance = 0;
        this.miningTimer = null; this.dataInterval = null;
        this.storageKey = "fitia_last_claim_time_v2";
        this.shopData = []; this.isLoadingShop = false;
        this.vizContext = null; this.vizBars = [];
        this.wheelAngle = 0; this.wheelInterval = null;
        this.isSpinning = false; this.wheelCtx = null;
        this.importMode = 'key';
        this.treasuryMode = 'deposit'; this.treasuryToken = 'POL';
        this.treasuryBalances = { POL: '0.00', USDT: '0.00', FTA: '0.00' };
        this.lang = 'en';
        this.polPrice = 0;
        this.priceInterval = null;
        this.rigImages = [
            "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=400&h=250&fit=crop&q=80",
            "https://images.unsplash.com/photo-1597852074816-d933c7d2b988?w=400&h=250&fit=crop&q=80",
            "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=250&fit=crop&q=80",
            "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=250&fit=crop&q=80",
            "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=250&fit=crop&q=80",
            "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=250&fit=crop&q=80",
            "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=250&fit=crop&q=80",
            "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=250&fit=crop&q=80"
        ];
    }

    t(key, args) {
        var str = (LANG[this.lang] && LANG[this.lang][key]) || (LANG['en'] && LANG['en'][key]) || key;
        if (args !== undefined) { str = str.replace('{0}', args); }
        return str;
    }

    toggleLang() {
        this.lang = this.lang === 'en' ? 'fr' : 'en';
        localStorage.setItem(CONFIG.LANG_KEY, this.lang);
        document.getElementById('lang-btn').innerText = this.lang.toUpperCase();
        this.applyLang();
        if (this.user) this._updateTreasuryUI();
    }

    applyLang() {
        var self = this;
        document.querySelectorAll('[data-i18n]').forEach(function(el) {
            var key = el.dataset.i18n;
            var val = self.t(key);
            if (val !== key) el.textContent = val;
        });
        document.querySelectorAll('[data-i18n-ph]').forEach(function(el) {
            var key = el.dataset.i18nPh;
            var val = self.t(key);
            if (val !== key) el.placeholder = val;
        });
    }

    _safeDestroy(p) {
        if (p && typeof p.destroy === 'function') { try { p.destroy(); } catch(e) {} }
    }

    _withTimeout(promise, timeoutMs) {
        timeoutMs = timeoutMs || 20000;
        return Promise.race([
            promise,
            new Promise(function(_, reject) {
                setTimeout(function() { reject(new Error("Request timeout")); }, timeoutMs);
            })
        ]);
    }

    _safeWait(tx, timeoutMs) {
        timeoutMs = timeoutMs || 120000;
        return Promise.race([
            tx.wait(),
            new Promise(function(_, reject) {
                setTimeout(function() { reject(new Error("Transaction timeout – check on-chain")); }, timeoutMs);
            })
        ]);
    }

    _rebuildSignerAndContracts() {
        this.signer = this.wallet.connect(this.provider);
        this.contracts.usdt = new ethers.Contract(CONFIG.USDT, ERC20_ABI, this.signer);
        this.contracts.fta = new ethers.Contract(CONFIG.FTA, ERC20_ABI, this.signer);
        this.contracts.mining = new ethers.Contract(CONFIG.MINING, MINING_ABI, this.signer);
    }

    async init() {
        var savedLang = localStorage.getItem(CONFIG.LANG_KEY);
        if (savedLang && LANG[savedLang]) this.lang = savedLang;
        document.getElementById('lang-btn').innerText = this.lang.toUpperCase();
        this.applyLang();
        var stored = localStorage.getItem(CONFIG.WALLET_STORAGE_KEY);
        if (stored) {
            try {
                var parsed = JSON.parse(stored);
                document.getElementById('unlock-addr-display').innerText = parsed.address.slice(0,8) + "..." + parsed.address.slice(-6);
                this.showStep('step-unlock');
            } catch(e) {
                localStorage.removeItem(CONFIG.WALLET_STORAGE_KEY);
                this.showStep('step-welcome');
            }
        } else {
            this.showStep('step-welcome');
        }
    }

    beginCreate() {
        var self = this;
        this.setLoader(true, this.t('loader_generating'));
        setTimeout(function() {
            try {
                self.tempWallet = ethers.Wallet.createRandom();
                if (!self.tempWallet.mnemonic || !self.tempWallet.mnemonic.phrase) throw new Error(self.t('err_mnemonic'));
                self.mnemonicPhrase = self.tempWallet.mnemonic.phrase;
                var words = self.mnemonicPhrase.split(' ');
                var grid = document.getElementById('mnemonic-grid');
                grid.innerHTML = '';
                words.forEach(function(w, i) {
                    var div = document.createElement('div');
                    div.className = 'mnemonic-word';
                    div.innerHTML = '<span class="word-num">' + String(i+1).padStart(2,'0') + '</span><span class="word-text">' + w + '</span>';
                    grid.appendChild(div);
                });
                document.getElementById('mnemonic-saved-check').checked = false;
                document.getElementById('btn-after-mnemonic').disabled = true;
                self.setLoader(false);
                self.showStep('step-mnemonic');
            } catch(e) {
                console.error(e);
                self.setLoader(false);
                self.showToast(self.t('err_generation'), true);
            }
        }, 500);
    }

    async finishCreate() {
        var pwd = document.getElementById('create-pwd').value;
        var pwdC = document.getElementById('create-pwd-confirm').value;
        if (pwd.length < 6) return this.showToast(this.t('err_pwd_short'), true);
        if (pwd !== pwdC) return this.showToast(this.t('err_pwd_mismatch'), true);
        this.setLoader(true, this.t('loader_encrypting'));
        try {
            if (!window.crypto || !window.crypto.subtle) throw new Error(this.t('err_insecure'));
            var encrypted = await this.tempWallet.encrypt(pwd);
            localStorage.setItem(CONFIG.WALLET_STORAGE_KEY, encrypted);
            this.wallet = this.tempWallet;
            this.tempWallet = null;
            this.mnemonicPhrase = "";
            await this._connect();
        } catch(e) {
            console.error(e);
            this.showToast(e.message || "Error", true);
        }
        this.setLoader(false);
    }

    setImportMode(mode) {
        this.importMode = mode;
        document.getElementById('tab-key').classList.toggle('active', mode === 'key');
        document.getElementById('tab-mnemonic').classList.toggle('active', mode === 'mnemonic');
        document.getElementById('import-key-area').style.display = mode === 'key' ? 'block' : 'none';
        document.getElementById('import-mnemonic-area').style.display = mode === 'mnemonic' ? 'block' : 'none';
    }

    async doImport() {
        var pwd = document.getElementById('import-pwd').value;
        var pwdC = document.getElementById('import-pwd-confirm').value;
        if (pwd.length < 6) return this.showToast(this.t('err_pwd_short'), true);
        if (pwd !== pwdC) return this.showToast(this.t('err_pwd_mismatch'), true);
        this.setLoader(true, this.t('loader_importing'));
        try {
            if (!window.crypto || !window.crypto.subtle) throw new Error(this.t('err_insecure'));
            var wallet;
            if (this.importMode === 'key') {
                var key = document.getElementById('import-key').value.trim();
                if (!key || !key.startsWith('0x') || key.length < 64) return this.showToast(this.t('err_invalid_key'), true);
                wallet = new ethers.Wallet(key);
            } else {
                var phrase = document.getElementById('import-mnemonic').value.trim();
                if (!phrase || phrase.split(' ').length < 12) return this.showToast(this.t('err_invalid_phrase'), true);
                wallet = ethers.Wallet.fromPhrase(phrase);
            }
            var encrypted = await wallet.encrypt(pwd);
            localStorage.setItem(CONFIG.WALLET_STORAGE_KEY, encrypted);
            this.wallet = wallet;
            await this._connect();
        } catch(e) {
            console.error(e);
            this.showToast(e.message || "Error", true);
        }
        this.setLoader(false);
    }

    async unlockWallet() {
        var pwd = document.getElementById('unlock-pwd').value;
        if (!pwd) return this.showToast(this.t('err_enter_pwd'), true);
        this.setLoader(true, this.t('loader_unlocking'));
        try {
            var encrypted = localStorage.getItem(CONFIG.WALLET_STORAGE_KEY);
            var wallet = await ethers.Wallet.fromEncryptedJson(encrypted, pwd);
            this.wallet = wallet;
            await this._connect();
        } catch(e) {
            this.showToast(this.t('err_wrong_pwd'), true);
        }
        this.setLoader(false);
    }

    logout() {
        this.wallet = null; this.user = null; this.contracts = {};
        this.stopMiningCounter();
        if (this.dataInterval) { clearInterval(this.dataInterval); this.dataInterval = null; }
        if (this.priceInterval) { clearInterval(this.priceInterval); this.priceInterval = null; }
        this._safeDestroy(this.provider);
        this.provider = null;
        document.getElementById('wallet-status').classList.add('hidden');
        document.getElementById('wallet-auth').classList.remove('hidden');
        this.hideTreasury(); this.hideWalletPanel();
        this.showStep('step-unlock');
        this.pendingBalance = 0;
        document.getElementById('val-pending').innerText = '0.00000';
        document.getElementById('val-power').innerText = '0.00000';
        document.getElementById('viz-status').innerText = this.t('viz_waiting');
        document.getElementById('viz-status').style.color = 'var(--surface-highest)';
        document.getElementById('unlock-pwd').value = '';
    }

    deleteWallet() {
        if (confirm(this.t('confirm_delete'))) {
            localStorage.removeItem(CONFIG.WALLET_STORAGE_KEY);
            this.logout();
            this.showStep('step-welcome');
            this.showToast(this.t('toast_deleted'));
        }
    }

    showStep(stepId) {
        document.querySelectorAll('.auth-step').forEach(function(s) { s.classList.remove('active'); });
        document.getElementById(stepId).classList.add('active');
    }

    copyMnemonic() {
        if (!this.mnemonicPhrase) return;
        navigator.clipboard.writeText(this.mnemonicPhrase);
        this.showToast(this.t('toast_phrase_copied'));
    }

    showWalletPanel() {
        if (!this.wallet) return;
        document.getElementById('panel-full-addr').innerText = this.wallet.address;
        document.getElementById('wallet-panel').classList.remove('hidden');
        this._refreshTreasuryBalances();
    }

    hideWalletPanel() {
        document.getElementById('wallet-panel').classList.add('hidden');
        document.getElementById('export-modal').classList.add('hidden');
        document.getElementById('export-key-result').classList.add('hidden');
        document.getElementById('export-pwd').value = '';
    }

    copyAddress() {
        if (!this.wallet) return;
        navigator.clipboard.writeText(this.wallet.address);
        this.showToast(this.t('toast_addr_copied'));
    }

    copyRefAddr() {
        if (!this.wallet) return this.showToast(this.t('err_connect_first'), true);
        navigator.clipboard.writeText(this.wallet.address);
        this.showToast(this.t('toast_addr_copied'));
    }

    async bindReferrerManual() {
        var input = document.getElementById('bind-ref-input');
        var addr = input ? input.value.trim() : '';
        if (!addr || !ethers.isAddress(addr)) return this.showToast(this.t('err_invalid_addr'), true);
        if (this.user && addr.toLowerCase() === this.user.toLowerCase()) return this.showToast(this.t('err_self_ref'), true);
        this.setLoader(true, this.t('loader_binding'));
        try {
            var tx = await this._withTimeout(this.contracts.mining.setReferrer(addr), 20000);
            await this._safeWait(tx);
            this.showToast(this.t('toast_ref_bound'));
            if (input) input.value = '';
        } catch(e) { this.showError(e); }
        this.setLoader(false);
    }

    showTreasury() {
        this.hideWalletPanel();
        document.getElementById('treasury-modal').classList.remove('hidden');
        this.setTreasuryToken(this.treasuryToken);
        this.setTreasuryMode(this.treasuryMode);
        this._refreshTreasuryBalances();
    }

    hideTreasury() { document.getElementById('treasury-modal').classList.add('hidden'); }

    setTreasuryMode(mode) {
        this.treasuryMode = mode;
        document.getElementById('ttab-deposit').classList.toggle('active', mode === 'deposit');
        document.getElementById('ttab-withdraw').classList.toggle('active', mode === 'withdraw');
        document.getElementById('treasury-deposit').classList.toggle('active', mode === 'deposit');
        document.getElementById('treasury-withdraw').classList.toggle('active', mode === 'withdraw');
    }

    setTreasuryToken(token) {
        this.treasuryToken = token;
        document.getElementById('ttoken-pol').classList.toggle('active', token === 'POL');
        document.getElementById('ttoken-usdt').classList.toggle('active', token === 'USDT');
        document.getElementById('ttoken-fta').classList.toggle('active', token === 'FTA');
        this._updateTreasuryUI();
    }

    _updateTreasuryUI() {
        var t = this.treasuryToken;
        var b = this.treasuryBalances[t] || '0.00';
        document.getElementById('t-deposit-label').innerText = this.t('label_balance_token', t);
        document.getElementById('t-deposit-bal').innerText = b;
        document.getElementById('t-deposit-addr').innerText = this.wallet ? this.wallet.address : '0x...';
        document.getElementById('t-withdraw-label').innerText = this.t('label_available_token', t);
        document.getElementById('t-withdraw-bal').innerText = b;
        var noteEl = document.querySelector('.deposit-note');
        if (noteEl) noteEl.innerHTML = this.t('note_deposit', '<span style="color:var(--accent-deep);font-weight:600">' + t + '</span>');
        var warnEl = document.querySelector('.deposit-warning');
        if (warnEl) warnEl.innerHTML = this.t('warn_deposit', '<span style="color:var(--danger)">' + t + '</span>');
    }

    async _refreshTreasuryBalances() {
        if (!this.provider || !this.wallet) return;
        try {
            var polBal = await this.provider.getBalance(this.wallet.address);
            this.treasuryBalances.POL = parseFloat(ethers.formatUnits(polBal, 18)).toFixed(4);
        } catch(e) {}
        try {
            var usdtBal = await this.contracts.usdt.balanceOf(this.wallet.address);
            this.treasuryBalances.USDT = usdtBal ? parseFloat(ethers.formatUnits(usdtBal, 6)).toFixed(2) : '0.00';
        } catch(e) {}
        try {
            var ftaBal = await this.contracts.fta.balanceOf(this.wallet.address);
            this.treasuryBalances.FTA = ftaBal ? parseFloat(ethers.formatUnits(ftaBal, this.ftaDecimals)).toFixed(2) : '0.00';
        } catch(e) {}
        this._updateTreasuryUI();
        document.getElementById('panel-pol-bal').innerText = this.treasuryBalances.POL;
        document.getElementById('panel-usdt-bal').innerText = this.treasuryBalances.USDT;
        document.getElementById('panel-fta-bal').innerText = this.treasuryBalances.FTA;
    }

    copyTreasuryAddr() {
        if (!this.wallet) return;
        navigator.clipboard.writeText(this.wallet.address);
        this.showToast(this.t('toast_addr_copied'));
    }

    setWithdrawMax() {
        var bal = parseFloat(this.treasuryBalances[this.treasuryToken] || '0');
        if (this.treasuryToken === 'POL' && bal > 0) {
            var maxSend = Math.max(0, bal - 0.01);
            document.getElementById('t-withdraw-amount').value = maxSend.toFixed(4);
        } else {
            document.getElementById('t-withdraw-amount').value = bal;
        }
    }

    updateWithdrawMax() {}

    async executeWithdraw() {
        var amountStr = document.getElementById('t-withdraw-amount').value;
        var toAddr = document.getElementById('t-withdraw-to').value.trim();
        if (!amountStr || parseFloat(amountStr) <= 0) return this.showToast(this.t('err_invalid_amount'), true);
        if (!toAddr || !ethers.isAddress(toAddr)) return this.showToast(this.t('err_invalid_addr'), true);
        this.setLoader(true, this.t('loader_sending'));
        try {
            var amount;
            if (this.treasuryToken === 'POL') {
                amount = ethers.parseEther(amountStr);
                var bal = await this.provider.getBalance(this.user);
                try {
                    var feeData = await this.signer.getFeeData();
                    var gasEst = await this.signer.estimateGas({ to: toAddr, value: amount });
                    var gasCost = gasEst * (feeData.gasPrice || 30000000000n);
                    if (amount + gasCost > bal) {
                        amount = bal - gasCost;
                        if (amount <= 0n) { this.setLoader(false); return this.showToast("Insufficient POL for gas fees", true); }
                    }
                } catch(e) {}
                var tx = await this._withTimeout(this.signer.sendTransaction({ to: toAddr, value: amount }), 20000);
                await this._safeWait(tx);
                this.showToast(this.t('toast_pol_sent'));
            } else if (this.treasuryToken === 'USDT') {
                amount = ethers.parseUnits(amountStr, 6);
                var tx = await this._withTimeout(this.contracts.usdt.transfer(toAddr, amount), 20000);
                await this._safeWait(tx);
                this.showToast(this.t('toast_usdt_sent'));
            } else if (this.treasuryToken === 'FTA') {
                amount = ethers.parseUnits(amountStr, this.ftaDecimals);
                var tx = await this._withTimeout(this.contracts.fta.transfer(toAddr, amount), 20000);
                await this._safeWait(tx);
                this.showToast(this.t('toast_fta_sent'));
            }
            document.getElementById('t-withdraw-amount').value = '';
            document.getElementById('t-withdraw-to').value = '';
            await this._refreshTreasuryBalances();
            this.updateData();
        } catch(e) { this.showError(e); }
        this.setLoader(false);
    }

    showExportModal() {
        this.hideWalletPanel();
        document.getElementById('export-modal').classList.remove('hidden');
        document.getElementById('export-key-result').classList.add('hidden');
        document.getElementById('export-pwd').value = '';
    }

    hideExportModal() { document.getElementById('export-modal').classList.add('hidden'); }

    async doExportKey() {
        var pwd = document.getElementById('export-pwd').value;
        if (!pwd) return this.showToast(this.t('err_enter_pwd'), true);
        try {
            var encrypted = localStorage.getItem(CONFIG.WALLET_STORAGE_KEY);
            var wallet = await ethers.Wallet.fromEncryptedJson(encrypted, pwd);
            document.getElementById('export-key-value').innerText = wallet.privateKey;
            document.getElementById('export-key-result').classList.remove('hidden');
        } catch(e) { this.showToast(this.t('err_wrong_pwd'), true); }
    }

    copyExportedKey() {
        navigator.clipboard.writeText(document.getElementById('export-key-value').innerText);
        this.showToast(this.t('toast_key_copied'));
    }

    async _tryConnect(url) {
        var isWss = url.startsWith("wss://") || url.startsWith("ws://");
        var tempProvider;
        try {
            if (isWss) {
                tempProvider = new ethers.WebSocketProvider(url);
            } else {
                tempProvider = new ethers.JsonRpcProvider(url, undefined, { staticNetwork: true });
            }
            var network;
            try {
                network = await Promise.race([
                    tempProvider.getNetwork(),
                    new Promise(function(_, reject) { setTimeout(function() { reject(new Error("Timeout RPC")); }, 10000); })
                ]);
            } catch(e) {
                this._safeDestroy(tempProvider);
                return { success: false, error: "Network exception" };
            }
            if (Number(network.chainId) !== CONFIG.CHAIN_ID) {
                this._safeDestroy(tempProvider);
                return { success: false, error: "Wrong network" };
            }
            try {
                await Promise.race([
                    tempProvider.estimateGas({ to: "0x000000000000000000000000000000000000dEaD", value: 0n }).catch(function() { return 1n; }),
                    new Promise(function(_, reject) { setTimeout(function() { reject(new Error("POST blocked")); }, 10000); })
                ]);
                this.provider = tempProvider;
                return { success: true };
            } catch(e) {
                this._safeDestroy(tempProvider);
                return { success: false, error: "No write access" };
            }
        } catch(e) {
            this._safeDestroy(tempProvider);
            return { success: false, error: e.message };
        }
    }

    async _connect() {
        this._safeDestroy(this.provider);
        this.provider = null;
        this.setLoader(true, this.t('loader_connecting'));
        var customRpc = localStorage.getItem(CONFIG.CUSTOM_RPC_KEY);
        if (customRpc) {
            this.setLoader(true, this.t('loader_rpc_saved'));
            var r = await this._tryConnect(customRpc);
            if (r.success) return this._finalizeConnection();
            localStorage.removeItem(CONFIG.CUSTOM_RPC_KEY);
        }
        for (var i = 0; i < CONFIG.HTTP_LIST.length; i++) {
            this.setLoader(true, this.t('loader_rpc', i+1, CONFIG.HTTP_LIST.length));
            if ((await this._tryConnect(CONFIG.HTTP_LIST[i])).success) return this._finalizeConnection();
        }
        for (var i = 0; i < CONFIG.WSS_LIST.length; i++) {
            this.setLoader(true, this.t('loader_wss', i+1, CONFIG.WSS_LIST.length));
            if ((await this._tryConnect(CONFIG.WSS_LIST[i])).success) return this._finalizeConnection();
        }
        this.setLoader(false);
        var customUrl = prompt(this.t('prompt_rpc'), "");
        if (!customUrl || (!customUrl.startsWith("http") && !customUrl.startsWith("wss"))) {
            this.showToast(this.t('err_rpc_required'), true);
            return;
        }
        this.setLoader(true, this.t('loader_test_rpc'));
        if ((await this._tryConnect(customUrl.trim())).success) {
            localStorage.setItem(CONFIG.CUSTOM_RPC_KEY, customUrl.trim());
            return this._finalizeConnection();
        }
        this.setLoader(false);
        this.showToast(this.t('err_rpc_no_response'), true);
    }

    async _finalizeConnection() {
        try {
            this.signer = this.wallet.connect(this.provider);
            this.user = this.wallet.address;
            this.contracts.usdt = new ethers.Contract(CONFIG.USDT, ERC20_ABI, this.signer);
            this.contracts.fta = new ethers.Contract(CONFIG.FTA, ERC20_ABI, this.signer);
            this.contracts.mining = new ethers.Contract(CONFIG.MINING, MINING_ABI, this.signer);
            try { this.ftaDecimals = await this.contracts.fta.decimals(); } catch(e) { this.ftaDecimals = 18; }
            document.getElementById('wallet-auth').classList.add('hidden');
            document.getElementById('wallet-status').classList.remove('hidden');
            document.getElementById('addr-display').innerText = this.user.slice(0,6) + "..." + this.user.slice(-4);
            document.getElementById('ref-addr').value = this.user;
            var ftaLogoEl = document.getElementById('logo-fta-bal');
            if(ftaLogoEl) ftaLogoEl.src = CONFIG.LOGO_FTA;
            if (!localStorage.getItem(this.storageKey)) localStorage.setItem(this.storageKey, Math.floor(Date.now() / 1000));
            this.setLoader(false);
            await this.updateData();
            if (this.dataInterval) clearInterval(this.dataInterval);
            this.dataInterval = setInterval(function() { App.updateData(); }, 5000);
            this.initVisualizer();
            window.addEventListener('resize', function() { App.resizeCanvas(); });
            this.initWheel();
            this._fetchPolPrice();
            if (this.priceInterval) clearInterval(this.priceInterval);
            this.priceInterval = setInterval(function() { App._fetchPolPrice(); }, 60000);
            this.showToast(this.t('toast_connected'));
        } catch(e) {
            console.error(e);
            this.setLoader(false);
            this.showToast(this.t('err_finalization') + (e.message || ""), true);
        }
    }

    async _fetchPolPrice() {
        var apis = [
            { url: 'https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd', parse: function(d) { return d && d.matic_network && d.matic_network.usd ? d.matic_network.usd : 0; } },
            { url: 'https://api.coincap.io/v2/assets/polygon', parse: function(d) { return d && d.data && d.data.priceUsd ? parseFloat(d.data.priceUsd) : 0; } },
            { url: 'https://min-api.cryptocompare.com/data/price?fsym=MATIC&tsyms=USD', parse: function(d) { return d && d.USD ? d.USD : 0; } }
        ];
        for (var i = 0; i < apis.length; i++) {
            try {
                var ctrl = new AbortController();
                var timer = setTimeout(function() { ctrl.abort(); }, 8000);
                var res = await fetch(apis[i].url, { signal: ctrl.signal });
                clearTimeout(timer);
                if (!res.ok) continue;
                var data = await res.json();
                var price = apis[i].parse(data);
                if (price && price > 0) { this.polPrice = price; return; }
            } catch(e) { continue; }
        }
    }

    resizeCanvas() {
        if(this.vizContext) {
            var canvas = this.vizContext.canvas;
            canvas.width = canvas.offsetWidth * 2;
            canvas.height = canvas.offsetHeight * 2;
        }
    }

    async updateData() {
        if (!this.user || !this.provider) return;
        try {
            var rawPower = await this.contracts.mining.getActivePower(this.user);
            try { this.currentMultiplier = await this.contracts.mining.difficultyMultiplier(); } catch(e) { this.currentMultiplier = 1000000000000000000n; }
            var realPowerBN = (rawPower * this.currentMultiplier) / 1000000000000000000n;
            this.currentRealPower = parseFloat(ethers.formatUnits(realPowerBN, 8));
            var lastClaim = parseInt(localStorage.getItem(this.storageKey));
            var timePassed = Math.floor(Date.now() / 1000) - lastClaim;
            if (this.currentRealPower > 0) {
                if (!this.miningTimer) {
                    this.pendingBalance = this.currentRealPower * timePassed;
                    document.getElementById('val-pending').innerText = this.pendingBalance.toFixed(5);
                }
                document.getElementById('viz-status').innerText = this.t('viz_mining');
                document.getElementById('viz-status').style.color = "var(--primary)";
                this.updateVisualizerIntensity(this.currentRealPower);
                if (!this.miningTimer) this.startMiningCounter();
            } else {
                this.stopMiningCounter();
                document.getElementById('viz-status').innerText = this.t('viz_no_machine');
                document.getElementById('viz-status').style.color = "var(--surface-highest)";
                this.pendingBalance = 0;
                document.getElementById('val-pending').innerText = '0.00000';
            }
            document.getElementById('val-power').innerText = this.currentRealPower.toFixed(5);
            var polBal = await this.provider.getBalance(this.user);
            var usdtBal = await this.contracts.usdt.balanceOf(this.user);
            var ftaBal = await this.contracts.fta.balanceOf(this.user);
            var polBalVal = parseFloat(ethers.formatUnits(polBal, 18));
            var usdtBalVal = parseFloat(ethers.formatUnits(usdtBal, 6));
            var ftaBalVal = parseFloat(ethers.formatUnits(ftaBal, this.ftaDecimals));
            var ftaPrice = this.currentRate > 0 ? (1 / this.currentRate) : 0;
            document.getElementById('bal-pol').innerText = polBalVal.toFixed(4);
            document.getElementById('bal-usdt').innerText = usdtBalVal.toFixed(2);
            document.getElementById('bal-fta').innerText = ftaBalVal.toFixed(2);
            document.getElementById('bal-pol-usd').innerText = '≈ $' + (polBalVal * this.polPrice).toFixed(2);
            document.getElementById('bal-usdt-usd').innerText = '≈ $' + usdtBalVal.toFixed(2);
            document.getElementById('bal-fta-usd').innerText = '≈ $' + (ftaBalVal * ftaPrice).toFixed(2);
            this.treasuryBalances.POL = polBalVal.toFixed(4);
            this.treasuryBalances.USDT = usdtBalVal.toFixed(2);
            this.treasuryBalances.FTA = ftaBalVal.toFixed(2);
            this._updateTreasuryUI();
            var rate = await this.contracts.mining.exchangeRate();
            this.currentRate = parseFloat(ethers.formatUnits(rate, 8));
            await this.renderShop(false);
            try {
                document.getElementById('wheel-jackpot').innerText = parseFloat(ethers.formatUnits(await this.contracts.mining.getWheelJackpot(), this.ftaDecimals)).toFixed(2);
                document.getElementById('lottery-pot').innerText = parseFloat(ethers.formatUnits(await this.contracts.mining.getLotteryPool(), this.ftaDecimals)).toFixed(2);
            } catch(e) {}
        } catch (e) { console.error("Refresh Error", e); }
    }

    startMiningCounter() {
        if (this.miningTimer) return;
        this.miningTimer = setInterval(function() {
            if (App.currentRealPower > 0) {
                App.pendingBalance += App.currentRealPower;
                document.getElementById('val-pending').innerText = App.pendingBalance.toFixed(5);
                document.getElementById('val-pending').style.color = 'var(--primary)';
                setTimeout(function() { document.getElementById('val-pending').style.color = 'var(--text)'; }, 500);
            }
        }, 1000);
    }

    stopMiningCounter() {
        if (this.miningTimer) { clearInterval(this.miningTimer); this.miningTimer = null; }
    }

    setPayMode(mode) {
        this.payMode = mode;
        document.getElementById('btn-pay-usdt').classList.toggle('active', mode === 'USDT');
        document.getElementById('btn-pay-fta').classList.toggle('active', mode === 'FTA');
        this.renderShop(false);
    }

    async renderShop(forceFetch) {
        if (this.isLoadingShop) return;
        var container = document.getElementById('shop-list');
        if (this.shopData.length > 0 && !forceFetch) { this._renderShopHTML(container); return; }
        this.isLoadingShop = true;
        try {
            var count = await this.contracts.mining.getMachineCount();
            var promises = [];
            for(var i=0; i<count; i++) promises.push(this.contracts.mining.machineTypes(i));
            var results = await Promise.all(promises);
            this.shopData = [];
            for(var i=0; i<count; i++) {
                var data = results[i];
                var priceUsdt = parseFloat(ethers.formatUnits(data.price, 6));
                var priceFta = priceUsdt * this.currentRate;
                var powerBN = BigInt(data.power.toString());
                var effectivePowerBN = (powerBN * this.currentMultiplier) / 1000000000000000000n;
                var power = parseFloat(ethers.formatUnits(effectivePowerBN, 8));
                this.shopData.push({ price: priceUsdt, power: power, priceFta: priceFta });
            }
            this._renderShopHTML(container);
        } catch(e) { console.error("Shop Error", e); }
        this.isLoadingShop = false;
    }

    _renderShopHTML(container) {
        container.innerHTML = '';
        for(var i=0; i<this.shopData.length; i++) {
            var data = this.shopData[i];
            var imgUrl = this.rigImages[i % this.rigImages.length];
            var div = document.createElement('div');
            div.className = 'rig-item';
            div.innerHTML = '<img class="rig-image" src="' + imgUrl + '" alt="' + this.t('rig_name', i+1) + '" loading="lazy" onerror="this.style.display=\'none\'">' +
                '<div><span class="rig-name">' + this.t('rig_name', i+1) + '</span><span class="rig-power">' + data.power.toFixed(5) + ' FTA/s</span></div>' +
                '<div><span class="rig-price">' + (this.payMode === 'USDT' ? data.price.toFixed(2) + ' $' : data.priceFta.toFixed(2) + ' FTA') + '</span>' +
                '<button class="btn-primary" style="padding:8px; font-size:0.8rem" onclick="App.buyMachine(' + i + ')">' + this.t('btn_buy') + '</button></div>';
            container.appendChild(div);
        }
    }

    async buyMachine(id) {
        if (!this.user) return this.showToast(this.t('err_not_connected'), true);
        this.setLoader(true, this.t('loader_transaction'));
        try {
            var m = await this.contracts.mining.machineTypes(id);
            if (this.payMode === 'USDT') {
                var allow = await this.contracts.usdt.allowance(this.user, CONFIG.MINING);
                if (allow < m.price) { await this._safeWait(await this._withTimeout(this.contracts.usdt.approve(CONFIG.MINING, m.price), 20000)); }
                await this._safeWait(await this._withTimeout(this.contracts.mining.buyMachine(id), 20000));
            } else {
                var rate = await this.contracts.mining.exchangeRate();
                var ftaPrice = (m.price * rate) / 1000000n;
                var allow = await this.contracts.fta.allowance(this.user, CONFIG.MINING);
                if (allow < ftaPrice) { await this._safeWait(await this._withTimeout(this.contracts.fta.approve(CONFIG.MINING, ftaPrice), 20000)); }
                await this._safeWait(await this._withTimeout(this.contracts.mining.buyMachineWithFTA(id), 20000));
            }
            this.showToast(this.t('toast_purchase'));
            this.isLoadingShop = false;
            await this.renderShop(true);
            await this.checkMyMachines();
            this.updateData();
        } catch (e) { this.showError(e); }
        this.setLoader(false);
    }

    async claim() {
        if (!this.user) return;
        this.stopMiningCounter();
        this.setLoader(true, this.t('loader_claiming'));
        try {
            await this._safeWait(await this._withTimeout(this.contracts.mining.claimRewards(), 20000));
            this.pendingBalance = 0;
            localStorage.setItem(this.storageKey, Math.floor(Date.now() / 1000));
            this.showToast(this.t('toast_claimed'));
            this.updateData();
            if (this.currentRealPower > 0) this.startMiningCounter();
        } catch(e) { this.showError(e); this.startMiningCounter(); }
        this.setLoader(false);
    }

    showGame(id) {
        document.querySelectorAll('.game-area').forEach(function(el) { el.classList.remove('active'); });
        document.getElementById('game-' + id).classList.add('active');
        document.querySelectorAll('.game-tab').forEach(function(btn) { btn.classList.remove('active'); });
        event.currentTarget.classList.add('active');
    }

    showGameResult(elementId, message, isWin) {
        var el = document.getElementById(elementId);
        el.className = "game-result-box " + (isWin ? "win" : "lose");
        el.innerText = message;
        el.classList.remove('hidden');
        setTimeout(function() { el.classList.add('hidden'); }, 5000);
    }

    async playWinGo(type, choice) {
        var betVal = document.getElementById('wingo-bet').value;
        if (!betVal || betVal <= 0) return this.showToast(this.t('err_invalid_bet'), true);
        var amount = ethers.parseUnits(betVal, this.ftaDecimals);
        var buttons = document.querySelectorAll('#game-wingo .game-options button');
        buttons.forEach(function(b) { b.disabled = true; });
        var reel = document.getElementById('slot-reel');
        reel.classList.add('spinning');
        try {
            var allow = await this.contracts.fta.allowance(this.user, CONFIG.MINING);
            if (allow < amount) await this._safeWait(await this._withTimeout(this.contracts.fta.approve(CONFIG.MINING, amount), 20000));
            var tx = await this._withTimeout(this.contracts.mining.playWinGo(amount, type, choice), 20000);
            await this._safeWait(tx);
            reel.classList.remove('spinning');
            var randomNum = Math.floor(Math.random() * 10);
            reel.style.transform = 'translateY(' + (-80 * randomNum) + 'px)';
            this.showGameResult('wingo-result', this.t('result_number', randomNum), true);
            this.updateData();
        } catch(e) {
            reel.classList.remove('spinning');
            reel.style.transform = 'translateY(0px)';
            this.showError(e);
        }
        buttons.forEach(function(b) { b.disabled = false; });
    }

    initWheel() {
        var canvas = document.getElementById('wheel-canvas');
        if(!canvas) return;
        this.wheelCtx = canvas.getContext('2d');
        this.drawWheel(0);
    }

    drawWheel(rotation) {
        var ctx = this.wheelCtx;
        if(!ctx) return;
        var seg = ["10x", "2x", "5x", "1x", "50x", "0x", "3x", "WIN"];
        var colors = ["#f0b90b", "#b1e4ff", "#ffd87f", "#56ceff", "#ffb4ab", "#282a2e", "#c4c7ca", "#f0b90b"];
        ctx.clearRect(0, 0, 300, 300);
        ctx.save(); ctx.translate(150, 150); ctx.rotate(rotation); ctx.translate(-150, -150);
        var step = (2 * Math.PI) / seg.length;
        for(var i=0; i<seg.length; i++) {
            ctx.beginPath(); ctx.moveTo(150, 150); ctx.arc(150, 150, 140, i * step, (i + 1) * step); ctx.closePath();
            ctx.fillStyle = colors[i]; ctx.fill();
            ctx.save(); ctx.translate(150, 150); ctx.rotate(i * step + step / 2);
            ctx.textAlign = "right"; ctx.fillStyle = "#111417"; ctx.font = "bold 14px 'Space Grotesk', sans-serif";
            ctx.fillText(seg[i], 115, 5); ctx.restore();
        }
        ctx.beginPath(); ctx.arc(150, 150, 20, 0, 2 * Math.PI); ctx.fillStyle = "#0c0e12"; ctx.fill();
        ctx.restore();
    }

    async spinWheel() {
        if(this.isSpinning) return;
        this.isSpinning = true;
        var btn = document.querySelector('#game-wheel .btn-game'); btn.disabled = true;
        if (this.wheelInterval) clearInterval(this.wheelInterval);
        this.wheelInterval = setInterval(function() { App.wheelAngle += 0.2; App.drawWheel(App.wheelAngle); }, 20);
        try {
            var price = ethers.parseUnits("100", this.ftaDecimals);
            var allow = await this.contracts.fta.allowance(this.user, CONFIG.MINING);
            if (allow < price) await this._safeWait(await this._withTimeout(this.contracts.fta.approve(CONFIG.MINING, price), 20000));
            var tx = await this._withTimeout(this.contracts.mining.spinWheel(), 20000);
            await this._safeWait(tx);
            clearInterval(this.wheelInterval);
            this.wheelAngle += 5;
            this.drawWheel(this.wheelAngle);
            this.showGameResult('wheel-result', this.t('toast_wheel_spun'), true);
            this.updateData();
        } catch(e) { clearInterval(this.wheelInterval); this.showError(e); }
        this.isSpinning = false; btn.disabled = false;
    }

    async goFishing() {
        var line = document.getElementById('fishing-line');
        var hook = document.getElementById('fishing-hook');
        var status = document.getElementById('fishing-status');
        var btn = document.querySelector('#game-fishing .btn-game'); btn.disabled = true;
        line.style.height = '0px'; hook.style.top = '0px'; status.innerText = this.t('status_casting');
        try {
            var price = ethers.parseUnits("50", this.ftaDecimals);
            var allow = await this.contracts.fta.allowance(this.user, CONFIG.MINING);
            if (allow < price) await this._safeWait(await this._withTimeout(this.contracts.fta.approve(CONFIG.MINING, price), 20000));
            setTimeout(function() { line.style.height = '120px'; hook.style.top = '120px'; status.innerText = App.t('status_line_cast'); }, 500);
            var tx = await this._withTimeout(this.contracts.mining.goFishing(), 20000);
            await this._safeWait(tx);
            status.innerText = this.t('status_bite'); hook.style.fontSize = "3rem";
            setTimeout(function() { hook.style.fontSize = "2rem"; }, 500);
            this.showGameResult('fish-result', this.t('toast_fish_success'), true);
            this.updateData();
        } catch(e) {
            line.style.height = '0px'; hook.style.top = '0px'; status.innerText = this.t('label_error'); this.showError(e);
        }
        btn.disabled = false;
    }

    async buyLotteryTicket() {
        this.setLoader(true, this.t('loader_ticket'));
        try {
            var price = ethers.parseUnits("50", this.ftaDecimals);
            var allow = await this.contracts.fta.allowance(this.user, CONFIG.MINING);
            if (allow < price) await this._safeWait(await this._withTimeout(this.contracts.fta.approve(CONFIG.MINING, price), 20000));
            await this._safeWait(await this._withTimeout(this.contracts.mining.buyLotteryTicket(), 20000));
            this.showToast(this.t('toast_ticket')); this.updateData();
        } catch(e) { this.showError(e); }
        this.setLoader(false);
    }

    nav(viewId) {
        document.querySelectorAll('.view').forEach(function(el) { el.classList.remove('active'); el.style.display = 'none'; });
        var activeView = document.getElementById('view-' + viewId);
        if(activeView) { activeView.classList.add('active'); activeView.style.display = 'block'; }
        document.querySelectorAll('.nav-item').forEach(function(el) { el.classList.remove('active'); });
        if(event && event.currentTarget) event.currentTarget.classList.add('active');
        if (viewId === 'my-rigs') this.checkMyMachines();
    }

    async checkMyMachines() {
        var container = document.getElementById('my-rigs-list');
        var noRigs = document.getElementById('no-rigs');
        container.innerHTML = '';
        if(!this.user) return;
        try {
            var count = await this.contracts.mining.getMachineCount();
            var promises = [];
            for(var i=0; i<count; i++) promises.push(this.contracts.mining.getUserMachineCount(this.user, i));
            var results = await Promise.all(promises);
            var found = false;
            for(var i=0; i<count; i++) {
                var machineCount = results[i];
                if (machineCount > 0) {
                    found = true;
                    var powerDisplay = "N/A";
                    if (this.shopData[i]) powerDisplay = this.shopData[i].power.toFixed(5);
                    var div = document.createElement('div');
                    div.className = 'my-rig-card active';
                    div.innerHTML = '<div class="rig-info"><h4>' + this.t('rig_name', i+1) + ' <span style="opacity:0.5">x' + machineCount.toString() + '</span></h4><p>' + powerDisplay + ' FTA/s</p></div><span class="rig-status-badge status-active">' + this.t('status_active') + '</span>';
                    container.appendChild(div);
                }
            }
            noRigs.style.display = found ? 'none' : 'block';
        } catch(e) { console.error("Machines error", e); }
    }

    initVisualizer() {
        var canvas = document.getElementById('mining-canvas');
        if (!canvas) return;
        this.resizeCanvas();
        this.vizContext = canvas.getContext('2d');
        this.vizBars = [];
        for(var i=0; i<20; i++) this.vizBars.push({ height: 0, targetHeight: 0 });
        this.animateVisualizer();
    }

    updateVisualizerIntensity(p) {
        var intensity = p > 0 ? Math.min((p * 500) + 10, 100) : 0;
        this.vizBars.forEach(function(bar) { bar.targetHeight = (App.vizContext.canvas.height * (intensity/100)) * Math.random(); });
    }

    animateVisualizer() {
        if(!this.vizContext) return;
        var ctx = this.vizContext;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = "#f0b90b";
        var w = ctx.canvas.width / 20;
        this.vizBars.forEach(function(bar, i) {
            bar.height += (bar.targetHeight - bar.height) * 0.1;
            ctx.fillRect(i * w + 2, ctx.canvas.height - bar.height, w - 4, bar.height);
            bar.targetHeight += (Math.random() - 0.5) * 10;
        });
        requestAnimationFrame(function() { App.animateVisualizer(); });
    }

    setLoader(show, msg) {
        var l = document.getElementById('loader');
        document.getElementById('loader-text').innerText = msg || "Processing...";
        show ? l.classList.remove('hidden') : l.classList.add('hidden');
    }

    showError(e) {
        console.error(e);
        var msg = this.t('label_error');
        if(e.reason) msg = e.reason;
        if(msg.includes("Cannot refer yourself")) msg = this.t('err_self_ref');
        if(msg.includes("Referrer already set")) msg = this.t('err_ref_set');
        if(msg.includes("Invalid bet amount")) msg = this.t('err_invalid_bet');
        if(msg.includes("Request timeout")) msg = "RPC timeout – cannot send transaction";
        this.showToast(msg, true);
    }

    showToast(msg, isError) {
        var div = document.createElement('div');
        div.className = 'toast';
        if (isError) div.style.borderLeftColor = 'var(--danger)';
        div.innerText = msg;
        document.getElementById('toast-container').appendChild(div);
        setTimeout(function() { div.remove(); }, 4000);
    }
}

// ═══════════════════════════════════════
//  TRANSACTION TRACKER (HISTORY)
// ═══════════════════════════════════════
var TxTracker = {
    STORAGE_KEY: 'fitia_tx_history_v1',
    MAX_ITEMS: 100,
    currentFilter: 'all',
    _lastAmounts: {},

    _getLang: function() { return (typeof App !== 'undefined' && App.lang) ? App.lang : 'en'; },
    _t: function(key, args) {
        var lang = this._getLang();
        var str = (LANG[lang] && LANG[lang][key]) || (LANG['en'] && LANG['en'][key]) || key;
        if (args !== undefined) { str = str.replace('{0}', args); }
        return str;
    },

    _getTxList: function() {
        try { return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || []; }
        catch(e) { return []; }
    },

    _saveTxList: function(list) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list.slice(0, this.MAX_ITEMS)));
    },

    _mapToastToTx: function(text) {
        var t = function(key) { return TxTracker._t(key); };
        var map = [
            { keys: ['toast_pol_sent', 'POL envoyé'], type: 'send_pol', cat: 'sends', icon: '📤', dir: 'out' },
            { keys: ['toast_usdt_sent', 'USDT envoyé'], type: 'send_usdt', cat: 'sends', icon: '📤', dir: 'out' },
            { keys: ['toast_fta_sent', 'FTA envoyé'], type: 'send_fta', cat: 'sends', icon: '📤', dir: 'out' },
            { keys: ['toast_purchase', 'Achat réussi'], type: 'buy_machine', cat: 'mining', icon: '⛏️', dir: 'out' },
            { keys: ['toast_claimed', 'Gains réclamés'], type: 'claim', cat: 'mining', icon: '💰', dir: 'in' },
            { keys: ['toast_ticket', 'Ticket acheté'], type: 'lottery', cat: 'games', icon: '🎟️', dir: 'neutral' },
            { keys: ['toast_ref_bound', 'Parrain lié'], type: 'referral', cat: 'mining', icon: '👥', dir: 'neutral' }
        ];
        for (var i = 0; i < map.length; i++) {
            for (var j = 0; j < map[i].keys.length; j++) {
                var translated = t(map[i].keys[j]);
                if (text === translated || text.indexOf(translated) !== -1) return map[i];
            }
        }
        return null;
    },

    record: function(text) {
        var mapping = this._mapToastToTx(text);
        if (!mapping) return;
        var tx = {
            id: Date.now() + Math.random(),
            type: mapping.type,
            category: mapping.cat,
            icon: mapping.icon,
            direction: mapping.dir,
            title: this._t('tx_' + mapping.type),
            amount: '',
            unit: '',
            timestamp: Date.now()
        };
        var list = this._getTxList();
        list.unshift(tx);
        this._saveTxList(list);
    },

    _formatTime: function(ts) {
        var diff = Math.floor((Date.now() - ts) / 1000);
        if (diff < 60) return this._t('label_just_now');
        if (diff < 3600) return this._t('label_min_ago', Math.floor(diff / 60));
        if (diff < 86400) return this._t('label_hr_ago', Math.floor(diff / 3600));
        return this._t('label_day_ago', Math.floor(diff / 86400));
    },

    _getCatClass: function(cat) {
        var map = { sends: 'send', games: 'game', mining: 'mining', referral: 'referral' };
        return map[cat] || 'mining';
    },

    _getDirClass: function(dir) {
        var map = { out: 'out', in: 'in', neutral: 'neutral' };
        return map[dir] || 'neutral';
    },

    setFilter: function(filter) {
        this.currentFilter = filter;
        document.querySelectorAll('.hfilter').forEach(function(btn) {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        this.render();
    },

    render: function() {
        var list = this._getTxList();
        var filtered = this.currentFilter === 'all' ? list : list.filter(function(tx) { return tx.category === TxTracker.currentFilter; });
        var container = document.getElementById('history-list');
        var empty = document.getElementById('history-empty');
        if (!container) return;
        if (filtered.length === 0) {
            container.classList.add('hidden');
            empty.classList.remove('hidden');
            return;
        }
        container.classList.remove('hidden');
        empty.classList.add('hidden');
        container.innerHTML = filtered.map(function(tx) {
            var amountDisplay = tx.amount ? tx.amount + (tx.unit ? ' ' + tx.unit : '') : '';
            var prefix = amountDisplay ? (tx.direction === 'out' ? '-' : tx.direction === 'in' ? '+' : '') : '';
            var finalAmount = amountDisplay ? prefix + amountDisplay : '—';
            return '<div class="tx-card">' +
                '<div class="tx-icon ' + TxTracker._getCatClass(tx.category) + '">' + tx.icon + '</div>' +
                '<div class="tx-info"><div class="tx-title">' + tx.title + '</div></div>' +
                '<div class="tx-right"><div class="tx-amount ' + TxTracker._getDirClass(tx.direction) + '">' + finalAmount + '</div>' +
                '<div class="tx-time">' + TxTracker._formatTime(tx.timestamp) + '</div></div></div>';
        }).join('');
    },

    clearAll: function() {
        if (confirm(this._getLang() === 'fr' ? 'Effacer tout l\'historique ?' : 'Clear all history?')) {
            localStorage.removeItem(this.STORAGE_KEY);
            this.render();
        }
    },

    setupToastObserver: function() {
        var container = document.getElementById('toast-container');
        if (!container) return;
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1 && node.classList && node.classList.contains('toast')) {
                        var isError = node.style.borderLeftColor === 'var(--danger)' ||
                                        getComputedStyle(node).borderLeftColor === 'rgb(255, 180, 171)';
                        if (!isError) {
                            TxTracker.record(node.innerText || node.textContent);
                        }
                    }
                });
            });
        });
        observer.observe(container, { childList: true });
    },

    setup: function() {
        this.setupToastObserver();
    }
};

document.addEventListener('DOMContentLoaded', function() {
    TxTracker.setup();
});

var App = new Application();
window.onload = function() { App.init(); };