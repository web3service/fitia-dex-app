// ═══════════════════════════════════════════════════════════════════
//  FITIA PRO MINER — WalletManager
//  Wallet intégré à l'app (pas besoin de MetaMask/WalletConnect)
//  • BIP-39 mnemonic (12 mots) générée localement via ethers v6
//  • Chiffrement AES-GCM 256 bits avec PBKDF2 (200 000 itérations)
//  • Stockage localStorage (base64) — compatible migration future
//  • Prêt pour brancher un RPC custom (CONFIG.RPC_URL) quand ta
//    propre chain sera déployée
// ═══════════════════════════════════════════════════════════════════
(function () {
  'use strict';

  // ─── Constantes de stockage ────────────────────────────────────
  const STORAGE_MNEMONIC = 'fitia_wallet_mnemonic';   // mnemonic chiffrée (base64)
  const STORAGE_SALT     = 'fitia_wallet_salt';        // sel PBKDF2 (base64)
  const STORAGE_IV       = 'fitia_wallet_iv';          // IV AES-GCM (base64)
  const STORAGE_VERSION  = 'fitia_wallet_v';            // version schema (future-proof)
  const STORAGE_LOCKOUT  = 'fitia_wallet_lockout';     // rate-limiting : {count, until}
  const SCHEMA_VERSION  = '1';

  // ─── Paramètres cryptographiques ───────────────────────────────
  const PBKDF2_ITERATIONS = 200000;                    // KDF forte (~250 ms sur mobile)
  const PBKDF2_HASH       = 'SHA-256';
  const AES_KEY_LENGTH     = 256;                       // AES-GCM 256
  const DERIVATION_PATH    = "m/44'/60'/0'/0/0";        // chemin BIP-44 standard Ethereum

  // ─── Sécurité : rate-limiting unlock ───────────────────────────
  const MAX_ATTEMPTS    = 5;       // max 5 essais avant lockout
  const LOCKOUT_DURATION = 60000;  // 60 secondes de lockout
  const PASSWORD_MIN_LEN = 12;     // 12 caractères minimum (was 8)

  // ─── Objet WalletManager (singleton exposé en window.WalletManager) ───
  const WalletManager = {
    _wallet: null,  // ethers.HDNodeWallet en mémoire quand déverrouillé

    // ─── État ────────────────────────────────────────────────────

    /** true si un wallet chiffré existe déjà en localStorage */
    isInitialized() {
      return !!localStorage.getItem(STORAGE_MNEMONIC);
    },

    /** true si le wallet est actuellement déverrouillé en mémoire */
    isUnlocked() {
      return this._wallet !== null;
    },

    // ─── Sécurité : validation politique de mot de passe forte ────
    /**
     * Valide un mot de passe selon la politique :
     *  - 12+ caractères
     *  - Au moins 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial
     *  - Entropie minimale (pas un mot du dictionnaire commun)
     * @param {string} password
     * @returns {{valid: boolean, errors: string[], strength: number}} — strength = 0-100
     */
    validatePassword(password) {
      const errors = [];
      if (!password || typeof password !== 'string') {
        return { valid: false, errors: ['Mot de passe requis'], strength: 0 };
      }
      if (password.length < PASSWORD_MIN_LEN) {
        errors.push(`Le mot de passe doit faire au moins ${PASSWORD_MIN_LEN} caractères`);
      }
      if (!/[A-Z]/.test(password)) errors.push('Au moins une majuscule requise');
      if (!/[a-z]/.test(password)) errors.push('Au moins une minuscule requise');
      if (!/[0-9]/.test(password)) errors.push('Au moins un chiffre requis');
      if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password)) errors.push('Au moins un caractère spécial requis (!@#$...)');

      // Détection des mots de passe faibles courants
      const weak = ['password', 'motdepasse', '123456789', 'qwerty', 'azerty', 'fitia', 'polygon'];
      const lower = password.toLowerCase();
      if (weak.some(w => lower.includes(w))) {
        errors.push('Mot de passe trop prévisible');
      }

      // Calcul d'entropie (Shannon, simplifié)
      let charset = 0;
      if (/[a-z]/.test(password)) charset += 26;
      if (/[A-Z]/.test(password)) charset += 26;
      if (/[0-9]/.test(password)) charset += 10;
      if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password)) charset += 32;
      const entropy = password.length * Math.log2(charset || 1);
      const strength = Math.min(100, Math.round(entropy / 80 * 100)); // 80 bits = 100%

      return { valid: errors.length === 0 && strength >= 40, errors, strength };
    },

    // ─── Sécurité : rate-limiting sur unlock() ─────────────────────
    /**
     * Retourne l'état du rate-limiting.
     * @returns {{blocked: boolean, attemptsLeft: number, unblockInMs: number}}
     */
    getLockoutState() {
      try {
        const data = JSON.parse(localStorage.getItem(STORAGE_LOCKOUT) || '{}');
        const now = Date.now();
        if (data.until && data.until > now) {
          return { blocked: true, attemptsLeft: 0, unblockInMs: data.until - now };
        }
        const count = data.count || 0;
        return { blocked: false, attemptsLeft: Math.max(0, MAX_ATTEMPTS - count), unblockInMs: 0 };
      } catch (e) {
        return { blocked: false, attemptsLeft: MAX_ATTEMPTS, unblockInMs: 0 };
      }
    },

    _recordFailedAttempt() {
      try {
        const data = JSON.parse(localStorage.getItem(STORAGE_LOCKOUT) || '{}');
        data.count = (data.count || 0) + 1;
        if (data.count >= MAX_ATTEMPTS) {
          data.until = Date.now() + LOCKOUT_DURATION;
          data.count = 0; // reset count, le lockout prend le relais
        }
        localStorage.setItem(STORAGE_LOCKOUT, JSON.stringify(data));
      } catch (e) {}
    },

    _resetAttempts() {
      localStorage.removeItem(STORAGE_LOCKOUT);
    },

    /** Retourne l'adresse 0x... du wallet déverrouillé, ou null */
    getAddress() {
      return this._wallet?.address || null;
    },

    /** Retourne le signer ethers v6 (HDNodeWallet connecté au provider) */
    getSigner() {
      return this._wallet;
    },

    // ─── Cycle de vie du wallet ──────────────────────────────────

    /**
     * Crée un nouveau wallet : génère une mnemonic 12 mots, la chiffre
     * avec le mot de passe, la stocke, et garde le wallet déverrouillé en mémoire.
     * @param {string} password - mot de passe utilisateur (min 8 caractères)
     * @returns {Promise<{mnemonic: string, address: string}>} - mnemonic en clair pour affichage unique
     */
    async createWallet(password) {
      this._validatePassword(password);
      // Génération aléatoire via ethers v6 (CSRNG)
      const mnemonic = ethers.Mnemonic.fromEntropy(ethers.randomBytes(16));
      const phrase = mnemonic.phrase;
      // Chiffrement + stockage
      await this._storeMnemonic(phrase, password);
      // Dérivation du wallet et keep en mémoire
      const wallet = ethers.HDNodeWallet.fromMnemonic(mnemonic, DERIVATION_PATH);
      this._wallet = wallet;
      return { mnemonic: phrase, address: wallet.address };
    },

    /**
     * Importe un wallet existant à partir d'une mnemonic.
     * @param {string} phrase - 12 ou 24 mots séparés par des espaces
     * @param {string} password - mot de passe pour chiffrer localement
     * @returns {Promise<{address: string}>}
     */
    async importWallet(phrase, password) {
      this._validatePassword(password);
      const trimmed = phrase.trim().toLowerCase();
      // Validation mnemonic via ethers (jette si invalide)
      const mnemonic = ethers.Mnemonic.fromPhrase(trimmed);
      await this._storeMnemonic(mnemonic.phrase, password);
      const wallet = ethers.HDNodeWallet.fromMnemonic(mnemonic, DERIVATION_PATH);
      this._wallet = wallet;
      return { address: wallet.address };
    },

    /**
     * Déverrouille le wallet depuis localStorage en utilisant le mot de passe.
     * @param {string} password
     * @returns {Promise<string>} - adresse 0x...
     * @throws {Error} 'No wallet found' ou 'Invalid password'
     */
    async unlock(password) {
      // Sécurité : vérifier le rate-limiting avant toute chose
      const state = this.getLockoutState();
      if (state.blocked) {
        const sec = Math.ceil(state.unblockInMs / 1000);
        throw new Error(`LOCKED:${sec}`);  // format spécial pour différencier du mauvais mdp
      }
      try {
        const phrase = await this._loadMnemonic(password);
        const mnemonic = ethers.Mnemonic.fromPhrase(phrase);
        const wallet = ethers.HDNodeWallet.fromMnemonic(mnemonic, DERIVATION_PATH);
        this._wallet = wallet;
        // Succès : reset le compteur d'essais
        this._resetAttempts();
        return wallet.address;
      } catch (e) {
        // Si c'est une erreur "Invalid password", on enregistre l'échec
        if (e.message === 'Invalid password') {
          this._recordFailedAttempt();
        }
        throw e;
      }
    },

    /**
     * Verrouille le wallet : efface la clé privée de la mémoire.
     * Le wallet chiffré reste en localStorage pour le prochain unlock.
     */
    lock() {
      this._wallet = null;
    },

    /**
     * Affiche la mnemonic (pour vérification ou backup).
     * @param {string} password
     * @returns {Promise<string>} - mnemonic en clair
     */
    async exportMnemonic(password) {
      return await this._loadMnemonic(password);
    },

    /**
     * Connecte le wallet en mémoire à un provider RPC.
     * @param {string} rpcUrl - URL du RPC (ex: https://polygon-rpc.com)
     * @returns {ethers.HDNodeWallet} - wallet connecté (utilisable comme signer)
     */
    connectToRpc(rpcUrl) {
      if (!this._wallet) throw new Error('Wallet not unlocked');
      const provider = new ethers.JsonRpcProvider(rpcUrl);
      // .connect() retourne un nouveau wallet lié au provider (non-mutant sur l'original)
      this._wallet = this._wallet.connect(provider);
      return this._wallet;
    },

    /**
     * Efface définitivement le wallet chiffré de cet appareil.
     * À n'utiliser qu'après confirmation utilisateur + vérification mnemonic.
     */
    async erase() {
      localStorage.removeItem(STORAGE_MNEMONIC);
      localStorage.removeItem(STORAGE_SALT);
      localStorage.removeItem(STORAGE_IV);
      localStorage.removeItem(STORAGE_VERSION);
      localStorage.removeItem(STORAGE_LOCKOUT);  // reset rate-limiting aussi
      this._wallet = null;
    },

    // ─── Internes : chiffrement / déchiffrement ─────────────────

    /**
     * Valide le mot de passe selon la politique forte (12+ chars, complexité).
     * @param {string} password
     * @throws {Error} la première erreur trouvée, ou un résumé si plusieurs
     */
    _validatePassword(password) {
      const result = this.validatePassword(password);
      if (!result.valid) {
        throw new Error(result.errors[0] || 'Mot de passe trop faible');
      }
    },

    /**
     * Chiffre la mnemonic avec le mot de passe et stocke tout en localStorage.
     * Schéma : PBKDF2(password, salt, 200k iter, SHA-256) → AES-GCM-256 key
     *          AES-GCM(key, iv, mnemonic) → ciphertext (avec tag auth)
     */
    async _storeMnemonic(phrase, password) {
      // Vérifie que l'API Web Crypto est dispo (HTTPS ou localhost)
      if (!crypto?.subtle) {
        throw new Error('Web Crypto API indisponible. Utilise HTTPS ou localhost.');
      }
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const key = await this._deriveKey(password, salt);
      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        new TextEncoder().encode(phrase)
      );
      localStorage.setItem(STORAGE_MNEMONIC, this._bytesToBase64(new Uint8Array(encrypted)));
      localStorage.setItem(STORAGE_SALT, this._bytesToBase64(salt));
      localStorage.setItem(STORAGE_IV, this._bytesToBase64(iv));
      localStorage.setItem(STORAGE_VERSION, SCHEMA_VERSION);
    },

    /**
     * Déchiffre la mnemonic depuis localStorage.
     * @throws {Error} 'No wallet found' si rien en stockage
     * @throws {Error} 'Invalid password' si le mot de passe est incorrect (AES-GCM tag mismatch)
     */
    async _loadMnemonic(password) {
      if (!crypto?.subtle) {
        throw new Error('Web Crypto API indisponible. Utilise HTTPS ou localhost.');
      }
      const encB64 = localStorage.getItem(STORAGE_MNEMONIC);
      const saltB64 = localStorage.getItem(STORAGE_SALT);
      const ivB64 = localStorage.getItem(STORAGE_IV);
      if (!encB64 || !saltB64 || !ivB64) {
        throw new Error('No wallet found');
      }
      const salt = this._base64ToBytes(saltB64);
      const iv = this._base64ToBytes(ivB64);
      const enc = this._base64ToBytes(encB64);
      const key = await this._deriveKey(password, salt);
      try {
        const decrypted = await crypto.subtle.decrypt(
          { name: 'AES-GCM', iv },
          key,
          enc
        );
        return new TextDecoder().decode(decrypted);
      } catch (e) {
        // AES-GCM tag mismatch = mauvais mot de passe (ou données corrompues)
        throw new Error('Invalid password');
      }
    },

    /**
     * Dérive une clé AES-256 à partir du mot de passe via PBKDF2.
     * ~250 ms sur mobile — acceptable pour un unlock occasionnel.
     */
    async _deriveKey(password, salt) {
      const enc = new TextEncoder();
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        enc.encode(password),
        'PBKDF2',
        false,
        ['deriveKey']
      );
      return crypto.subtle.deriveKey(
        { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: PBKDF2_HASH },
        keyMaterial,
        { name: 'AES-GCM', length: AES_KEY_LENGTH },
        false,
        ['encrypt', 'decrypt']
      );
    },

    // ─── Helpers base64 ──────────────────────────────────────────

    _bytesToBase64(bytes) {
      let bin = '';
      for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
      return btoa(bin);
    },

    _base64ToBytes(b64) {
      const bin = atob(b64);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      return bytes;
    }
  };

  // Exposition globale
  window.WalletManager = WalletManager;
})();
