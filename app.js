// ==========================================
// CONFIGURATION DEX (QuickSwap / Polygon)
// ==========================================
const ROUTER_ADDRESS = "0xa5E0829CaCEd8fFDD4De3c38D11B08C52c64C841"; 
const FACTORY_ADDRESS = "0x5757371414417b8C6CAad45bAeF941aBc7d3Ab0c";

// VOS ADRESSES DE CONTRATS
const TOKENS = {
    // Token Natif
    FTA: { 
        address: "0x535bBe393D64a60E14B731b7350675792d501623", // METTEZ VOTRE ADRESSE ICI
        decimals: 8, symbol: "FTA", name: "Fitia Token", 
        logo: "https://i.imgur.com/YourLogo.png"
    },
    // Tokens Populaires Polygon
    USDT: { address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", decimals: 6, symbol: "USDT", name: "Tether USD", logo: "https://cryptologos.cc/logos/tether-usdt-logo.png" },
    WMATIC: { address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270", decimals: 18, symbol: "WMATIC", name: "Wrapped Matic", logo: "https://cryptologos.cc/logos/polygon-matic-logo.png" },
    WETH: { address: "0x7ceB23fD6bC0adD59E62acC2559D6B7E8B1e4E2d", decimals: 18, symbol: "WETH", name: "Wrapped Ether", logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png" },
    WBTC: { address: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9Bf6C", decimals: 8, symbol: "WBTC", name: "Wrapped Bitcoin", logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.png" },
    DAI:  { address: "0x8f3Cf7ad23Cd3CaDbD9735AFf926023Fe9B6eA6f", decimals: 18, symbol: "DAI", name: "Dai Stablecoin", logo: "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png" }
};

// ADRESSE DU CONTRAT DE STAKING (Si vous en avez un, sinon laissez comme exemple)
const STAKING_CONTRACT = "0x0000000000000000000000000000000000000000"; 

const ROUTER_ABI = [
    "function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)",
    "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
    "function addLiquidity(address tokenA, address tokenB, uint amountADesired, uint amountBDesired, uint amountAMin, uint amountBMin, address to, uint deadline) external returns (uint amountA, uint amountB, uint liquidity)",
    "function removeLiquidity(address tokenA, address tokenB, uint liquidity, uint amountAMin, uint amountBMin, address to, uint deadline) external returns (uint amountA, uint amountB)"
];

const ERC20_ABI = [
    "function balanceOf(address) view returns (uint256)",
    "function approve(address, uint256) returns (bool)",
    "function allowance(address, address) view returns (uint256)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function name() view returns (string)"
];

const PAIR_ABI = [
    "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
    "function token0() external view returns (address)",
    "function token1() external view returns (address)",
    "function balanceOf(address) external view returns (uint256)",
    "function totalSupply() external view returns (uint256)"
];

const FACTORY_ABI = ["function getPair(address, address) external view returns (address)"];

// ABI Simplifié pour Staking (Exemple MasterChef)
const STAKING_ABI = [
    "function deposit(uint256 _pid, uint256 _amount) public",
    "function withdraw(uint256 _pid, uint256 _amount) public",
    "function pendingRewards(uint256 _pid, address _user) view returns (uint256)",
    "function userInfo(uint256 _pid, address _user) view returns (uint256 amount, uint256 rewardDebt)"
];

// ==========================================
// LOGIQUE DEX
// ==========================================
class DEX {
    constructor() {
        this.p = null; this.s = null; this.u = null;
        this.router = null; this.factory = null;
        
        this.tFrom = TOKENS.FTA;
        this.tTo = TOKENS.USDT;
        
        this.lpToken1 = TOKENS.FTA;
        this.lpToken2 = TOKENS.USDT;
        
        this.modalTarget = null;
        this.decimalBuffer = {};
        this.knownTokens = Object.values(TOKENS); // Liste dynamique
    }

    async init() {
        if (window.ethereum) {
            this.p = new ethers.BrowserProvider(window.ethereum);
            window.ethereum.on('accountsChanged', () => location.reload());
        }
    }

    async connect() {
        this.setL(true, "Connexion...");
        try {
            await ethereum.request({ method: 'eth_requestAccounts' });
            this.s = await this.p.getSigner();
            this.u = await this.s.getAddress();
            this.router = new ethers.Contract(ROUTER_ADDRESS, ROUTER_ABI, this.s);
            this.factory = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, this.s);

            // UI Update
            $('#btn-connect').classList.add('hidden');
            $('#wallet-status').classList.remove('hidden');
            $('#addr-display').innerText = this.u.slice(0,6) + "..." + this.u.slice(38);

            // Init views
            await this.loadBalances();
            await this.loadPortfolio();
            await this.loadPools();
            await this.loadStakes();
            
        } catch(e) { this.t("Erreur: " + (e.reason || e.message), 1); console.error(e); }
        this.setL(false);
    }

    // --- VIEWS ---
    setView(id) {
        $$('.view-section').forEach(e => e.classList.remove('active'));
        $('#view-'+id).classList.add('active');
        $$('.nav-dex-btn').forEach(b => b.classList.remove('active'));
        // Highlight nav
        if(id==='trade') $$('.nav-dex-btn')[0].classList.add('active');
        if(id==='pool') $$('.nav-dex-btn')[1].classList.add('active');
        if(id==='stake') $$('.nav-dex-btn')[2].classList.add('active');
        if(id==='wallet') $$('.nav-dex-btn')[3].classList.add('active');
    }

    // --- WALLET (PORTFOLIO) ---
    async loadPortfolio() {
        if(!this.u) return;
        const list = $('#wallet-list');
        list.innerHTML = '';
        
        for(let t of this.knownTokens) {
            try {
                const bal = await this.getBal(t.address);
                if(parseFloat(bal) > 0.001 || t.symbol === 'FTA') {
                    const div = document.createElement('div');
                    div.className = 'wallet-row';
                    div.innerHTML = `
                        <img src="${t.logo}" onerror="this.src='https://via.placeholder.com/32'">
                        <div><div class="symbol">${t.symbol}</div><small style="color:var(--text-muted)">${t.name}</small></div>
                        <div class="balance">${bal}</div>
                    `;
                    list.appendChild(div);
                }
            } catch(e) {}
        }
    }

    // --- SWAP ---
    async loadBalances() {
        if(!this.u) return;
        const b1 = await this.getBal(this.tFrom.address);
        const b2 = await this.getBal(this.tTo.address);

        $('#bal-from').innerText = b1;
        $('#bal-to').innerText = b2;
        
        $('#sym-from').innerText = this.tFrom.symbol;
        $('#sym-to').innerText = this.tTo.symbol;
        
        this.setImg('img-from', this.tFrom);
        this.setImg('img-to', this.tTo);
        
        if($('#amount-in').value) this.calcRate();
        else $('#rate-info').innerText = "Entrez un montant";
    }

    async getBal(addr) {
        if(addr === ethers.ZeroAddress) return "0";
        const c = new ethers.Contract(addr, ERC20_ABI, this.p);
        const raw = await c.balanceOf(this.u);
        const dec = await this.getDecimals(addr);
        return parseFloat(ethers.formatUnits(raw, dec)).toFixed(2);
    }

    async getDecimals(addr) {
        if(this.decimalBuffer[addr]) return this.decimalBuffer[addr];
        try {
            const c = new ethers.Contract(addr, ERC20_ABI, this.p);
            const d = await c.decimals();
            this.decimalBuffer[addr] = d;
            return d;
        } catch(e) { return 18; }
    }

    setImg(id, token) {
        const el = $(id);
        if(token.logo) { el.src = token.logo; el.classList.remove('hidden'); el.onerror=()=>el.classList.add('hidden'); }
        else { el.classList.add('hidden'); }
    }

    async calcRate() {
        const amtIn = $('#amount-in').value;
        if (!amtIn || !this.tFrom || !this.tTo) return;
        try {
            const decIn = await this.getDecimals(this.tFrom.address);
            const decOut = await this.getDecimals(this.tTo.address);
            const amtWei = ethers.parseUnits(amtIn, decIn);
            const path = [this.tFrom.address, this.tTo.address];
            const amounts = await this.router.getAmountsOut(amtWei, path);
            const out = ethers.formatUnits(amounts[1], decOut);
            $('#amount-out').value = parseFloat(out).toFixed(6);
            const rate = parseFloat(out) / parseFloat(amtIn);
            $('#rate-info').innerText = `1 ${this.tFrom.symbol} ≈ ${rate.toFixed(4)} ${this.tTo.symbol}`;
        } catch(e) {
            $('#rate-info').innerText = "Pas de liquidité";
            $('#amount-out').value = "0";
        }
    }

    async executeSwap() {
        if(!this.u) return this.t("Connectez-vous", 1);
        const amt = $('#amount-in').value;
        if (!amt) return;
        
        this.setL(true, "Swap...");
        try {
            const decIn = await this.getDecimals(this.tFrom.address);
            const amtWei = ethers.parseUnits(amt, decIn);
            
            // Approve
            const tContract = new ethers.Contract(this.tFrom.address, ERC20_ABI, this.s);
            const allow = await tContract.allowance(this.u, ROUTER_ADDRESS);
            if(allow < amtWei) {
                this.setL(true, "Approve...");
                await (await tContract.approve(ROUTER_ADDRESS, amtWei)).wait();
            }

            // Swap
            this.setL(true, "Confirmation...");
            const deadline = Math.floor(Date.now()/1000) + 1200;
            const path = [this.tFrom.address, this.tTo.address];
            const tx = await this.router.swapExactTokensForTokens(amtWei, 0, path, this.u, deadline);
            await tx.wait();

            this.t("Échange réussi !");
            $('#amount-in').value = ''; $('#amount-out').value = '';
            this.loadBalances();
            this.loadPortfolio();
        } catch(e) { this.t("Erreur: " + (e.reason || e.message), 1); }
        this.setL(false);
    }

    switchTokens() {
        let temp = this.tFrom; this.tFrom = this.tTo; this.tTo = temp;
        $('#amount-in').value = ''; $('#amount-out').value = '';
        this.loadBalances();
    }
    
    setMax() { /* Could implement max balance logic */ }

    // --- POOLS ---
    async loadPools() {
        const list = $('#lp-list');
        list.innerHTML = '';
        
        // Check FTA/USDT
        try {
            const pairAddr = await this.factory.getPair(TOKENS.FTA.address, TOKENS.USDT.address);
            if(pairAddr !== ethers.ZeroAddress) {
                const pair = new ethers.Contract(pairAddr, PAIR_ABI, this.p);
                const lpBal = this.u ? await pair.balanceOf(this.u) : 0;
                
                const div = document.createElement('div');
                div.className = 'lp-position';
                div.innerHTML = `
                    <div class="flex-between">
                        <div><strong>FTA / USDT</strong><br><small style="color:var(--text-muted)">Liquidité QuickSwap</small></div>
                        <div style="text-align:right">
                            <small>LP: ${this.u ? parseFloat(ethers.formatUnits(lpBal, 18)).toFixed(4) : '0'}</small><br>
                            <div style="margin-top:5px; display:flex; gap:5px; justify-content:flex-end">
                                <button class="btn-glass" style="padding:4px 8px; font-size:0.7rem" onclick="App.prepAddLp('FTA', 'USDT')">+</button>
                                ${lpBal > 0 ? `<button class="btn-glass" style="padding:4px 8px; font-size:0.7rem; color:var(--danger)" onclick="App.removeLiquidity('${pairAddr}')">-</button>` : ''}
                            </div>
                        </div>
                    </div>`;
                list.appendChild(div);
            }
        } catch(e) { console.error(e); }
        
        if(list.innerHTML === '') list.innerHTML = '<p style="color:var(--text-muted); text-align:center">Aucun pool actif.</p>';
    }

    prepAddLp(s1, s2) {
        this.lpToken1 = TOKENS[s1];
        this.lpToken2 = TOKENS[s2];
        $('#lp-sym1').innerText = s1;
        $('#lp-sym2').innerText = s2;
        this.setView('add');
        this.loadLpBalances();
    }

    async loadLpBalances() {
        if(!this.u) return;
        $('#lp-bal1').innerText = await this.getBal(this.lpToken1.address);
        $('#lp-bal2').innerText = await this.getBal(this.lpToken2.address);
    }

    async addLiquidity() {
        const a1 = $('#lp-amt1').value; const a2 = $('#lp-amt2').value;
        if(!a1 || !a2) return this.t("Montants invalides", 1);

        this.setL(true, "Ajout...");
        try {
            const d1 = await this.getDecimals(this.lpToken1.address);
            const d2 = await this.getDecimals(this.lpToken2.address);
            const amt1 = ethers.parseUnits(a1, d1);
            const amt2 = ethers.parseUnits(a2, d2);

            const c1 = new ethers.Contract(this.lpToken1.address, ERC20_ABI, this.s);
            const c2 = new ethers.Contract(this.lpToken2.address, ERC20_ABI, this.s);
            
            if(await c1.allowance(this.u, ROUTER_ADDRESS) < amt1) await (await c1.approve(ROUTER_ADDRESS, amt1)).wait();
            if(await c2.allowance(this.u, ROUTER_ADDRESS) < amt2) await (await c2.approve(ROUTER_ADDRESS, amt2)).wait();

            const deadline = Math.floor(Date.now()/1000) + 1200;
            const tx = await this.router.addLiquidity(this.lpToken1.address, this.lpToken2.address, amt1, amt2, 0, 0, this.u, deadline);
            await tx.wait();

            this.t("Liquidité ajoutée !");
            this.setView('pool');
            this.loadPools();
            this.loadPortfolio();
        } catch(e) { this.t("Erreur: " + (e.reason || e.message), 1); }
        this.setL(false);
    }

    async removeLiquidity(pairAddr) {
        this.setL(true, "Retrait...");
        try {
            const pair = new ethers.Contract(pairAddr, PAIR_ABI, this.s);
            const lpBal = await pair.balanceOf(this.u);
            if(lpBal <= 0) return;
            
            if(await pair.allowance(this.u, ROUTER_ADDRESS) < lpBal) await (await pair.approve(ROUTER_ADDRESS, lpBal)).wait();

            const deadline = Math.floor(Date.now()/1000) + 1200;
            const tx = await this.router.removeLiquidity(TOKENS.FTA.address, TOKENS.USDT.address, lpBal, 0, 0, this.u, deadline);
            await tx.wait();

            this.t("Retiré !");
            this.loadPools();
            this.loadPortfolio();
        } catch(e) { this.t("Erreur: " + (e.reason || e.message), 1); }
        this.setL(false);
    }

    // --- STAKING ---
    async loadStakes() {
        const list = $('#stake-list');
        list.innerHTML = '';
        
        // Exemple de pool de staking (FTF/USDT LP)
        const stakeItem = document.createElement('div');
        stakeItem.className = 'stake-position';
        stakeItem.innerHTML = `
            <div class="flex-between">
                <div><strong>🏦 FTA Pool</strong><br><small>Gagnez des FTA en stakant vos LP</small></div>
                <div style="text-align:right">
                    <div style="color:var(--primary); font-weight:bold">APY: 120%</div>
                    <button class="btn-glass" style="padding:4px 10px; margin-top:5px" onclick="App.stakeAction()">Stacker</button>
                </div>
            </div>
            <div style="margin-top:10px; font-size:0.8rem; color:var(--text-muted)">
                Récompenses: <span style="color:white">0.00 FTA</span>
            </div>
        `;
        list.appendChild(stakeItem);
    }

    stakeAction() {
        this.t("Fonction Staking bientôt disponible (Contrat Staking requis).");
    }

    // --- MODAL & UI ---
    openModal(target) {
        this.modalTarget = target;
        const list = $('#token-list');
        list.innerHTML = '';
        
        this.knownTokens.forEach(t => {
            const div = document.createElement('div');
            div.className = 'token-row';
            div.innerHTML = `
                <img src="${t.logo || 'https://via.placeholder.com/32'}" alt="">
                <div><span>${t.symbol}</span><br><small>${t.name}</small></div>
                <small id="bal-${t.symbol}">-</small>
            `;
            div.onclick = () => this.selectToken(t);
            list.appendChild(div);
            
            // Load balance asynchronously
            if(this.u) {
                this.getBal(t.address).then(bal => {
                    const sp = $('#bal-' + t.symbol);
                    if(sp) sp.innerText = bal;
                });
            }
        });
        
        $('#modal-tokens').classList.remove('hidden');
    }

    selectToken(t) {
        if (this.modalTarget === 'from') this.tFrom = t;
        else if (this.modalTarget === 'to') this.tTo = t;
        else if (this.modalTarget === 'lp1') { this.lpToken1 = t; $('#lp-sym1').innerText = t.symbol; }
        else if (this.modalTarget === 'lp2') { this.lpToken2 = t; $('#lp-sym2').innerText = t.symbol; }
        
        this.closeModal();
        this.loadBalances();
        if(this.modalTarget && this.modalTarget.startsWith('lp')) this.loadLpBalances();
    }

    closeModal() { $('#modal-tokens').classList.add('hidden'); }
    
    filterTokens() {
        const search = $('#search-token').value.toLowerCase();
        $$('.token-row').forEach(row => {
            const symbol = row.querySelector('span').innerText.toLowerCase();
            const name = row.querySelector('small').innerText.toLowerCase();
            const addr = row.getAttribute('data-addr') || ""; // If we had addr data
            row.style.display = (symbol.includes(search) || name.includes(search)) ? 'flex' : 'none';
        });
    }

    setL(s, m="") { 
        const l = $('#loader'); 
        $('#loader-text').innerText = m;
        s ? l.classList.remove('hidden') : l.classList.add('hidden');
    }
    t(m, e=false) {
        const d = document.createElement('div');
        d.className = 'toast';
        if(e) d.style.borderColor = 'var(--danger)';
        d.innerText = m;
        $('#toast-container').appendChild(d);
        setTimeout(() => d.remove(), 4000);
    }
}

const App = new DEX();
window.onload = () => App.init();
let $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);