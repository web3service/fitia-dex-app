const translations = {
    fr: { connect: 'Connecter', disconnect: 'Déconnecter', mining: 'Mining', swap: 'Échanger', games: 'Jeux', profile: 'Profil', stats: 'Stats', home: 'Accueil' },
    en: { connect: 'Connect', disconnect: 'Disconnect', mining: 'Mining', swap: 'Swap', games: 'Games', profile: 'Profile', stats: 'Stats', home: 'Home' },
    es: { connect: 'Conectar', disconnect: 'Desconectar', mining: 'Minería', swap: 'Intercambiar', games: 'Juegos', profile: 'Perfil', stats: 'Estadísticas', home: 'Inicio' }
};

class I18nManager {
    constructor() { this.currentLang = localStorage.getItem('language') || 'fr'; this.applyTranslations(); }
    t(key) { return translations[this.currentLang][key] || key; }
    applyTranslations() { document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = this.t(el.dataset.i18n); }); }
}
window.i18n = new I18nManager();