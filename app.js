// =================================================================================
// CONFIG
// =================================================================================
const ADDR = "0xAfdFb346F819ffF3DdEF77e23E25a34E19c7Cab2";
const ABI = [
    "function getAssetPrice(uint8) view returns(uint256)",
    "function internalBalances(address,address) view returns(uint256)",
    "function usdt() view returns(address)",
    "function fta() view returns(address)",
    "function userProfiles(address) view returns(uint256,uint256,uint256,bool,bool,uint256)",
    "function referrals(address) view returns(address,uint256,uint256)",
    "function positionCount() view returns(uint256)",
    "function positions(uint256) view returns(address,uint8,uint8,uint256,uint256,uint256,bool)",
    "function userLoans(address) view returns(uint256,uint256,uint256,bool)",
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
let tradeSide = 0;
let chartInterval;
let currentAsset = 2; 

// =================================================================================
// INIT
// =================================================================================
window.onload = () => {
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
    document.querySelectorAll('.tab-content').forEach(e => e.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(e => e.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    const map = {'tab-home':0,'tab-trade':1,'tab-mining':2,'tab-game':3,'tab-wallet':4};
    if(map[id] !== undefined) document.querySelectorAll('.nav-item')[map[id]].classList.add('active');

    // Chart Logic
    if(id === 'tab-trade') {
        initChart();
        startChart(); 
    } else {
        stopChart();
    }
    window.scrollTo(0,0);
};
window.setSide = (s) => {
    tradeSide = s;
    document.querySelectorAll('.t-tab').forEach(e => e.classList.remove('active'));
    event.target.classList.add('active');
};

// =================================================================================
// DATA LOADING
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
        // Home & Wallet Balances
        const uTxt = parseFloat(ethers.utils.formatUnits(uBal, 6)).toFixed(2);
        const fTxt = parseFloat(ethers.utils.formatUnits(fBal, 8)).toFixed(2);
        
        document.getElementById('balUsdt').innerText = uTxt;
        document.getElementById('balFta').innerText = fTxt;
        document.getElementById('headerBalance').innerText = uTxt + " USDT";
        document.getElementById('userLvl').innerText = prof[0].toString();
        document.getElementById('refCount').innerText = ref[2].toString();
        
        document.getElementById('wBalUsdt').innerText = uTxt;
        document.getElementById('wBalFta').innerText = fTxt;
        
        // Price in Home
        const pRaw = await contract.getAssetPrice(2);
        document.getElementById('ftaPrice').innerText = "$" + parseFloat(ethers.utils.formatUnits(pRaw, 8)).toFixed(4);

        // Finance Debt
        document.getElementById('lDebt').innerText = parseFloat(ethers.utils.formatUnits((await contract.userLoans(user))[1], 8)).toFixed(2);
    } catch(e) {}
}

// =================================================================================
// CHART SYSTEM (Auto-Update)
// =================================================================================
function initChart() {
    if(chart) return;
    const container = document.getElementById('tvchart');
    if(!container) return;
    
    // Force Dark Background
    container.style.backgroundColor = '#131722';
    
    chart = LightweightCharts.createChart(container, { 
        width: container.clientWidth, height: 300, 
        layout: { background: { color: '#131722' }, textColor: '#848E9C' },
        grid: { vertLines: { color: 'rgba(42, 46, 57, 0.3)' }, horzLines: { color: 'rgba(42, 46, 57, 0.3)' } },
        timeScale: { timeVisible: true, secondsVisible: false }
    });
    candleSeries = chart.addCandlestickSeries({ upColor: '#0ECB81', downColor: '#F6465D', borderUpColor: '#0ECB81', borderDownColor: '#F6465D', wickUpColor: '#0ECB81', wickDownColor: '#F6465D' });
    
    // Generate random initial history to make it look populated immediately
    const now = Math.floor(Date.now()/1000);
    let data = [];
    let base = 1.25;
    for(let i=0; i<60; i++) { 
        base += (Math.random()-0.5)*0.02;
        let o = base; let c = o + (Math.random()-0.5)*0.01; let h = Math.max(o,c)+0.005; let l = Math.min(o,c)-0.005; 
        data.push({ time: now - (60-i)*60, open: o, high: h, low: l, close: c }); 
    }
    candleSeries.setData(data);
}

window.switchAsset = async () => {
    currentAsset = document.getElementById('tradeAsset').value;
    const names = ["BTC", "ETH", "FTA"];
    document.getElementById('chartTitle').innerText = names[currentAsset] + " / USD";
    // Reset Chart Data
    candleSeries.setData([]);
    initChart(); // Re-init with new random data for demo
};

function startChart() {
    if(chartInterval) clearInterval(chartInterval);
    
    // Immediate update
    updateChartLogic();

    chartInterval = setInterval(updateChartLogic, 2000);
}

async function updateChartLogic() {
    if(!contract) return;
    try {
        const pRaw = await contract.getAssetPrice(currentAsset);
        const price = parseFloat(ethers.utils.formatUnits(pRaw, 8));
        
        // Update Price Text
        document.getElementById('tradePrice').innerText = "$" + price.toFixed(4);
        
        // Update Chart
        const time = Math.floor(Date.now()/1000);
        // Simulate OHLC for visual effect (real app would fetch history)
        const lastClose = price;
        const open = lastClose + (Math.random()-0.5)*0.01;
        const close = price;
        const high = Math.max(open, close) + 0.005;
        const low = Math.min(open, close) - 0.005;
        
        candleSeries.update({ time, open, high, low, close });
    } catch(e) {}
}

function stopChart() { if(chartInterval) clearInterval(chartInterval); chartInterval = null; }

// =================================================================================
// ACTIONS
// =================================================================================
async function appr(token, amount, dec) {
    const tk = new ethers.Contract(token, ERC20_ABI, signer);
    await (await tk.approve(ADDR, ethers.utils.parseUnits(amount, dec))).wait();
}

// --- HOME ACTIONS ---
window.buyFTA = async () => {
    const v = document.getElementById('sIn').value; if(!v) return toast("Montant requis", 'err');
    try { await (await contract.buyFTA(ethers.utils.parseUnits(v, 6))).wait(); toast("Achat effectué", 'succ'); loadUser(); } catch(e) { toast(e.reason, 'err'); }
};
window.sellFTAUI = async () => {
    const v = prompt("Montant FTA à vendre"); if(!v) return;
    try { await (await contract.sellFTA(ethers.utils.parseUnits(v, 8))).wait(); toast("Vente effectuée", 'succ'); loadUser(); } catch(e) { toast(e.reason, 'err'); }
};
window.depositUI_Home = async () => {
    const v = document.getElementById('hDep').value; if(!v) return;
    try { await appr(usdtAddr, v, 6); await (await contract.depositToWallet(usdtAddr, ethers.utils.parseUnits(v, 6))).wait(); toast("Dépôt réussi", 'succ'); document.getElementById('hDep').value=""; loadUser(); } catch(e) { toast(e.reason, 'err'); }
};
window.withdrawUI_Home = async () => {
    const v = document.getElementById('hWit').value; if(!v) return;
    try { await (await contract.withdrawFromWallet(usdtAddr, ethers.utils.parseUnits(v, 6))).wait(); toast("Retrait réussi", 'succ'); document.getElementById('hWit').value=""; loadUser(); } catch(e) { toast(e.reason, 'err'); }
};

// --- TRADING ---
window.openTrade = async () => {
    const m = document.getElementById('tMargin').value;
    const l = document.getElementById('tLev').innerText.replace('x','');
    const a = document.getElementById('tradeAsset').value;
    if(!m) return toast("Marge requise", 'err');
    try {
        const tx = await contract.openPositionWithLimits(a, tradeSide, ethers.utils.parseUnits(m, 6), l, 0, 0);
        toast("Envoi...", 'inf'); await tx.wait(); toast("Position ouverte", 'succ'); loadUser();
    } catch(e) { toast(e.reason, 'err'); }
};
window.closePos = async (id) => { try { await (await contract.closePosition(id)).wait(); toast("Fermée", 'succ'); loadUser(); } catch(e) { toast(e.reason, 'err'); } };
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
            html += `<div class="pos-item ${cls}"><div class="pos-h"><span>#${i} ${type}</span><button class="btn-sm" onclick="closePos(${i})">X</button></div><div class="pos-d"><span>Marge: ${m}</span></div></div>`;
        }
    }
    document.getElementById('posList').innerHTML = html || '<div class="empty-state">Aucune</div>';
}

// --- MINING ---
window.buyMachine = async (id) => { try { await (await contract.buyMachine(id)).wait(); toast("Acheté", 'succ'); } catch(e) { toast(e.reason, 'err'); } };
window.buyBatteryUI = async () => {
    const id = document.getElementById('mId').value; if(!id) return toast("ID requis", 'err');
    try { await (await contract.buyBattery(id, 0)).wait(); toast("Chargé", 'succ'); } catch(e) { toast(e.reason, 'err'); }
};
window.claimMining = async () => {
    const id = document.getElementById('mId').value; if(!id) return;
    try { await (await contract.claimMiningRewards(id)).wait(); toast("Récolté", 'succ'); loadUser(); } catch(e) { toast(e.reason, 'err'); }
};

// --- GAME ---
window.playGame = async () => {
    const b = document.getElementById('gBet').value; const t = document.getElementById('gTarget').value;
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

// --- FINANCE ---
window.depositCollateralUI = async () => {
    const v = document.getElementById('lCol').value; if(!v) return;
    try { await appr(usdtAddr, v, 6); await (await contract.depositCollateral(ethers.utils.parseUnits(v, 6))).wait(); toast("Collatéral OK", 'succ'); } catch(e) { toast(e.reason, 'err'); }
};
window.borrowUI = async () => {
    const b = prompt("Montant FTA à emprunter"); if(!b) return;
    try { await (await contract.borrow(ethers.utils.parseUnits(b, 8))).wait(); toast("Emprunt OK", 'succ'); loadUser(); } catch(e) { toast(e.reason, 'err'); }
};
window.repayUI = async () => { try { await (await contract.repayLoan()).wait(); toast("Remboursé", 'succ'); loadUser(); } catch(e) { toast(e.reason, 'err'); } };
window.stakeUI = async () => {
    const v = document.getElementById('stAmt').value; if(!v) return;
    try { await (await contract.stake(0, ethers.utils.parseUnits(v, 8))).wait(); toast("Staké", 'succ'); } catch(e) { toast(e.reason, 'err'); }
};
window.unstakeUI = async () => { try { await (await contract.unstake(0)).wait(); toast("Unstaké", 'succ'); loadUser(); } catch(e) { toast(e.reason, 'err'); } };
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