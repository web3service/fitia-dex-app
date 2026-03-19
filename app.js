// =================================================================================
// CONFIG
// =================================================================================
const ADDR = "0xAfdFb346F819ffF3DdEF77e23E25a34E19c7Cab2";
const ABI = [
    // Views
    "function getAssetPrice(uint8) view returns(uint256)",
    "function internalBalances(address,address) view returns(uint256)",
    "function usdt() view returns(address)",
    "function fta() view returns(address)",
    "function userProfiles(address) view returns(uint256,uint256,uint256,bool,bool,uint256)",
    "function referrals(address) view returns(address,uint256,uint256)",
    "function positionCount() view returns(uint256)",
    "function positions(uint256) view returns(address,uint8,uint8,uint256,uint256,uint256,bool)",
    "function userLoans(address) view returns(uint256,uint256,uint256,bool)",
    // Actions
    "function depositToWallet(address,uint256)",
    "function withdrawFromWallet(address,uint256)",
    "function buyFTA(uint256)",
    "function sellFTA(uint256)",
    "function openPositionWithLimits(uint8,uint8,uint256,uint256,uint256,uint256)",
    "function closePosition(uint256)",
    "function buyMachine(uint256)",
    "function buyBattery(uint256,uint256)",
    "function claimMiningRewards(uint256)",
    "function playAviator(uint256,uint256)",
    "function depositCollateral(uint256)",
    "function borrow(uint256)",
    "function repayLoan()",
    "function stake(uint256,uint256)",
    "function unstake(uint256)",
    "function addLiquidity(uint256,uint256)",
    "function removeLiquidity(uint256)",
    "function registerReferrer(address)"
];
const ERC20_ABI = ["function approve(address,uint256) returns(bool)"];

let provider, signer, contract, user, usdtAddr, ftaAddr;
let chart, candleSeries;
let tradeSide = 0; // 0=Long, 1=Short
let chartInterval;

// =================================================================================
// INIT
// =================================================================================
window.onload = () => {
    initChart();
    if(window.ethereum) {
        window.ethereum.on('accountsChanged', () => location.reload());
        window.ethereum.on('chainChanged', () => location.reload());
        checkWallet();
    }
};

// =================================================================================
// TOAST
// =================================================================================
const toast = (msg, type='inf') => {
    const c = document.getElementById('toast-container');
    const d = document.createElement('div'); d.className = `toast ${type}`; d.innerText = msg;
    c.appendChild(d); setTimeout(()=>d.classList.add('show'),10);
    setTimeout(()=>{d.classList.remove('show'); setTimeout(()=>d.remove(),300)}, 3000);
};

// =================================================================================
// WALLET
// =================================================================================
async function connectWallet() {
    try {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        const net = await provider.getNetwork();
        if(net.chainId !== 137) { toast("Switch vers Polygon", 'inf'); await addPoly(); return; }
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        user = await signer.getAddress();
        contract = new ethers.Contract(ADDR, ABI, signer);
        usdtAddr = await contract.usdt();
        ftaAddr = await contract.fta();
        
        document.getElementById('walletAddress').innerHTML = `<i class="fa-solid fa-check"></i> ${user.substr(0,6)}...`;
        document.getElementById('walletAddress').classList.add('on');
        document.getElementById('myRef').innerText = user.substr(0,6)+"..."+user.substr(-4);
        
        loadUser();
        startChart();
        toast("Connecté", 'succ');
    } catch(e) { toast(e.reason || "Erreur", 'err'); }
}

async function addPoly() {
    try { await window.ethereum.request({ method: 'wallet_addEthereumChain', params: [{ chainId: '0x89', chainName: 'Polygon', nativeCurrency: {name:"MATIC", symbol:"MATIC", decimals:18}, rpcUrls: ["https://polygon-rpc.com"] }] }); } 
    catch(e) {}
}

async function checkWallet() {
    if(window.ethereum) {
        const acc = await window.ethereum.request({method:'eth_accounts'});
        if(acc.length > 0) connectWallet();
    }
}

// =================================================================================
// NAVIGATION
// =================================================================================
window.showTab = (id) => {
    if(id !== 'tab-home') stopChart(); else startChart();
    document.querySelectorAll('.tab-content').forEach(e => e.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(e => e.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    const map = {'tab-home':0,'tab-trade':1,'tab-mining':2,'tab-game':3,'tab-finance':4};
    if(map[id] !== undefined) document.querySelectorAll('.nav-item')[map[id]].classList.add('active');
    window.scrollTo(0,0);
};
window.setSide = (s) => {
    tradeSide = s;
    document.querySelectorAll('.t-tab').forEach(e => e.classList.remove('active'));
    event.target.classList.add('active');
};

// =================================================================================
// DATA
// =================================================================================
async function loadUser() {
    if(!contract) return;
    try {
        const [uBal, fBal, prof, ref] = await Promise.all([
            contract.internalBalances(user, usdtAddr),
            contract.internalBalances(user, ftaAddr),
            contract.userProfiles(user),
            contract.referrals(user)
        ]);
        document.getElementById('balUsdt').innerText = parseFloat(ethers.utils.formatUnits(uBal, 6)).toFixed(2);
        document.getElementById('balFta').innerText = parseFloat(ethers.utils.formatUnits(fBal, 8)).toFixed(2);
        document.getElementById('headerBalance').innerText = parseFloat(ethers.utils.formatUnits(uBal, 6)).toFixed(2) + " USDT";
        document.getElementById('userLvl').innerText = prof[0].toString();
        document.getElementById('refCount').innerText = ref[2].toString();
        document.getElementById('lDebt').innerText = parseFloat(ethers.utils.formatUnits((await contract.userLoans(user))[1], 8)).toFixed(2);
    } catch(e) {}
}

// =================================================================================
// CHART (CANDLESTICK)
// =================================================================================
function initChart() {
    const container = document.getElementById('tvchart');
    if(!container) return;
    chart = LightweightCharts.createChart(container, { 
        width: container.clientWidth, height: 250, 
        layout: { background: { color: 'transparent' }, textColor: '#848E9C' },
        grid: { vertLines: { color: 'rgba(42, 46, 57, 0.5)' }, horzLines: { color: 'rgba(42, 46, 57, 0.5)' } },
        timeScale: { timeVisible: true, secondsVisible: false }
    });
    candleSeries = chart.addCandlestickSeries({ upColor: '#0ECB81', downColor: '#F6465D', borderUpColor: '#0ECB81', borderDownColor: '#F6465D', wickUpColor: '#0ECB81', wickDownColor: '#F6465D' });
    // Fake initial data
    const now = Math.floor(Date.now()/1000);
    let data = [];
    for(let i=0; i<50; i++) { let o = 1.2 + Math.random()*0.1; let c = o + (Math.random()-0.5)*0.05; let h = Math.max(o,c)+0.01; let l = Math.min(o,c)-0.01; data.push({ time: now - (50-i)*60, open: o, high: h, low: l, close: c }); }
    candleSeries.setData(data);
}

function startChart() {
    if(chartInterval) clearInterval(chartInterval);
    chartInterval = setInterval(async () => {
        if(!contract) return;
        try {
            const pRaw = await contract.getAssetPrice(2); // FTA
            const price = parseFloat(ethers.utils.formatUnits(pRaw, 8));
            document.getElementById('ftaPrice').innerText = "$" + price.toFixed(4);
            
            // Generate fake candle from current price for visual effect
            const time = Math.floor(Date.now()/1000);
            const lastBar = { time, open: price, high: price, low: price, close: price }; 
            // In reality, you'd fetch historical bars, here we just update the current tick
            candleSeries.update(lastBar);
        } catch(e) {}
    }, 2000);
}

function stopChart() { if(chartInterval) clearInterval(chartInterval); }

// =================================================================================
// TRADING ACTIONS
// =================================================================================
window.openTrade = async () => {
    const m = document.getElementById('tMargin').value;
    const l = document.getElementById('tLev').innerText.replace('x','');
    const a = document.getElementById('tradeAsset').value;
    if(!m) return toast("Marge requise", 'err');
    try {
        const tx = await contract.openPositionWithLimits(a, tradeSide, ethers.utils.parseUnits(m, 6), l, 0, 0);
        toast("Envoi...", 'inf'); await tx.wait(); toast("Position ouverte", 'succ');
        loadUser();
    } catch(e) { toast(e.reason, 'err'); }
};

window.closePos = async (id) => {
    try { await (await contract.closePosition(id)).wait(); toast("Fermée", 'succ'); loadPos(); loadUser(); } catch(e) { toast(e.reason, 'err'); }
};

async function loadPos() {
    if(!contract) return;
    const c = await contract.positionCount();
    if(c==0) return;
    let html = '';
    for(let i=c; i>Math.max(0, c-5); i--) {
        const p = await contract.positions(i);
        if(p[0].toLowerCase()===user.toLowerCase() && p[6]) {
            const type = p[2]==0 ? "LONG" : "SHORT";
            const cls = p[2]==0 ? "" : "sh";
            const m = parseFloat(ethers.utils.formatUnits(p[3],6)).toFixed(2);
            html += `<div class="pos-item ${cls}"><div class="pos-h"><span>#${i} ${type}</span><button class="btn-sm" onclick="closePos(${i})">X</button></div><div class="pos-d"><span>Marge: ${m}</span><span>Lev: ${p[4]}x</span></div></div>`;
        }
    }
    document.getElementById('posList').innerHTML = html || '<div class="empty-state">Aucune</div>';
}

// =================================================================================
// MINING
// =================================================================================
window.buyMachine = async (id) => { try { await (await contract.buyMachine(id)).wait(); toast("Acheté", 'succ'); } catch(e) { toast(e.reason, 'err'); } };
window.buyBatteryUI = async () => {
    const id = document.getElementById('mId').value; if(!id) return toast("ID requis", 'err');
    try { await (await contract.buyBattery(id, 0)).wait(); toast("Chargé", 'succ'); } catch(e) { toast(e.reason, 'err'); }
};
window.claimMining = async () => {
    const id = document.getElementById('mId').value; if(!id) return;
    try { await (await contract.claimMiningRewards(id)).wait(); toast("Récolté", 'succ'); loadUser(); } catch(e) { toast(e.reason, 'err'); }
};

// =================================================================================
// GAME
// =================================================================================
window.playGame = async () => {
    const b = document.getElementById('gBet').value;
    const t = document.getElementById('gTarget').value;
    if(!b) return toast("Mise requise", 'err');
    const d = document.getElementById('gMult');
    let m = 1.00;
    const int = setInterval(()=>{ m+=0.1; d.innerText=m.toFixed(2)+"x"; }, 100);
    try {
        await (await contract.playAviator(ethers.utils.parseUnits(b,8), Math.floor(t*100))).wait();
        clearInterval(int); d.innerText="GAGNÉ"; d.style.color="var(--succ)"; toast("Gagné!", 'succ');
    } catch(e) {
        clearInterval(int); d.innerText="CRASH"; d.style.color="var(--dan)"; toast("Perdu", 'err');
    }
    setTimeout(()=>{ d.innerText="1.00x"; d.style.color="#fff"; }, 2000);
};

// =================================================================================
// FINANCE & WALLET
// =================================================================================
// Helper Approve
async function appr(token, amount, dec) {
    const tk = new ethers.Contract(token, ERC20_ABI, signer);
    await (await tk.approve(ADDR, ethers.utils.parseUnits(amount, dec))).wait();
}

window.depositUI = async () => {
    const v = document.getElementById('wDep').value; if(!v) return;
    try { await appr(usdtAddr, v, 6); await (await contract.depositToWallet(usdtAddr, ethers.utils.parseUnits(v, 6))).wait(); toast("Dépôt OK", 'succ'); loadUser(); } catch(e) { toast(e.reason, 'err'); }
};
window.withdrawUI = async () => {
    const v = document.getElementById('wWit').value; if(!v) return;
    try { await (await contract.withdrawFromWallet(usdtAddr, ethers.utils.parseUnits(v, 6))).wait(); toast("Retrait OK", 'succ'); loadUser(); } catch(e) { toast(e.reason, 'err'); }
};
window.buyFTA = async () => {
    const v = document.getElementById('sIn').value; if(!v) return;
    try { await (await contract.buyFTA(ethers.utils.parseUnits(v, 6))).wait(); toast("Achat OK", 'succ'); loadUser(); } catch(e) { toast(e.reason, 'err'); }
};
window.sellFTAUI = async () => {
    const v = prompt("Montant FTA"); if(!v) return;
    try { await (await contract.sellFTA(ethers.utils.parseUnits(v, 8))).wait(); toast("Vente OK", 'succ'); loadUser(); } catch(e) { toast(e.reason, 'err'); }
};
window.depositCollateralUI = async () => {
    const v = document.getElementById('lCol').value; if(!v) return;
    try { await appr(usdtAddr, v, 6); await (await contract.depositCollateral(ethers.utils.parseUnits(v, 6))).wait(); toast("Collatéral OK", 'succ'); } catch(e) { toast(e.reason, 'err'); }
};
window.borrowUI = async () => {
    const v = document.getElementById('lBor').value; if(!v) return;
    try { await (await contract.borrow(ethers.utils.parseUnits(v, 8))).wait(); toast("Emprunt OK", 'succ'); loadUser(); } catch(e) { toast(e.reason, 'err'); }
};
window.repayUI = async () => {
    try { await (await contract.repayLoan()).wait(); toast("Remboursé", 'succ'); loadUser(); } catch(e) { toast(e.reason, 'err'); }
};
window.stakeUI = async () => {
    const v = document.getElementById('stAmt').value; if(!v) return;
    try { await (await contract.stake(0, ethers.utils.parseUnits(v, 8))).wait(); toast("Staké", 'succ'); } catch(e) { toast(e.reason, 'err'); }
};
window.unstakeUI = async () => {
    try { await (await contract.unstake(0)).wait(); toast("Unstaké", 'succ'); loadUser(); } catch(e) { toast(e.reason, 'err'); }
};
window.addLiquidityUI = async () => {
    const u = document.getElementById('fUsdt').value; const f = document.getElementById('fFta').value;
    if(!u || !f) return toast("Remplissez les 2", 'err');
    try { 
        await appr(usdtAddr, u, 6); await appr(ftaAddr, f, 8); 
        await (await contract.addLiquidity(ethers.utils.parseUnits(u, 6), ethers.utils.parseUnits(f, 8))).wait(); 
        toast("LP Ajouté", 'succ'); 
    } catch(e) { toast(e.reason, 'err'); }
};
window.removeLiquidityUI = async () => {
    const v = prompt("Montant LP à retirer"); if(!v) return;
    try { await (await contract.removeLiquidity(ethers.utils.parseUnits(v, 18))).wait(); toast("LP Retiré", 'succ'); } catch(e) { toast(e.reason, 'err'); }
};
window.regRefUI = async () => {
    const a = document.getElementById('refIn').value; if(!a) return;
    try { await (await contract.registerReferrer(a)).wait(); toast("Parrain OK", 'succ'); } catch(e) { toast(e.reason, 'err'); }
};