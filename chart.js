/**
 * Fitia PRO - Trading Chart Module
 * Gestion des bougies en temps réel type Binance
 */

class FitiaChart {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.chart = null;
    this.candleSeries = null;
    this.volumeSeries = null;
    this.data = [];
    this.updateInterval = null;
    
    this.defaultOptions = {
      width: this.container.clientWidth,
      height: 280,
      layout: {
        backgroundColor: 'transparent',
        textColor: '#B0B0C0',
        fontSize: 12,
      },
      grid: {
        vertLines: { color: 'rgba(42, 42, 63, 0.3)', style: 1 },
        horzLines: { color: 'rgba(42, 42, 63, 0.3)', style: 1 },
      },
      crosshair: {
        mode: LightweightCharts.CrosshairMode.Normal,
        vertLine: {
          labelBackgroundColor: '#F7B500',
          color: '#F7B500',
          style: LightweightCharts.LineStyle.Dotted,
          width: 1,
        },
        horzLine: {
          labelBackgroundColor: '#F7B500',
          color: '#F7B500',
          style: LightweightCharts.LineStyle.Dotted,
          width: 1,
        },
      },
      timeScale: {
        borderColor: 'rgba(42, 42, 63, 0.8)',
        timeVisible: true,
        secondsVisible: false,
        fixLeftEdge: true,
        fixRightEdge: true,
        lockVisibleTimeRangeOnResize: true,
      },
      rightPriceScale: {
        borderColor: 'rgba(42, 42, 63, 0.8)',
        autoScale: true,
        scaleMargins: { top: 0.1, bottom: 0.1 },
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: true,
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true,
      },
    };
    
    this.options = { ...this.defaultOptions, ...options };
    this.init();
  }
  
  init() {
    this.chart = LightweightCharts.createChart(this.container, this.options);
    
    this.candleSeries = this.chart.addCandlestickSeries({
      upColor: '#00C853',
      downColor: '#FF1744',
      borderVisible: false,
      wickUpColor: '#00C853',
      wickDownColor: '#FF1744',
      priceFormat: { type: 'price', precision: 4, minMove: 0.0001 },
    });
    
    // Add volume series (optional)
    this.volumeSeries = this.chart.addHistogramSeries({
      color: '#26a69a',
      priceFormat: { type: 'volume' },
      priceScaleId: '',
      scaleMargins: { top: 0.8, bottom: 0 },
    });
    this.volumeSeries.priceScale().applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } });
    
    // Add resize observer
    this.resizeObserver = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      this.chart.applyOptions({ width, height: 280 });
    });
    this.resizeObserver.observe(this.container);
    
    // Setup price line
    this.priceLine = this.candleSeries.createPriceLine({
      price: 0,
      color: '#F7B500',
      lineWidth: 1,
      lineStyle: LightweightCharts.LineStyle.Dotted,
      axisLabelVisible: true,
      title: 'Prix actuel',
    });
  }
  
  async loadData(timeframe = '15m', count = 100) {
    try {
      // In production: fetch from your API or subgraph
      // const response = await fetch(`/api/candles?symbol=FTAUSDT&interval=${timeframe}&limit=${count}`);
      // const data = await response.json();
      
      // Demo: generate mock data
      const data = this.generateMockCandles(count, timeframe);
      this.data = data;
      this.candleSeries.setData(data);
      
      // Update price line
      if (data.length > 0) {
        this.updatePriceLine(data[data.length - 1].close);
      }
      
      return data;
    } catch (error) {
      console.error('Failed to load chart data:', error);
      throw error;
    }
  }
  
  generateMockCandles(count, timeframe) {
    const candles = [];
    let time = Math.floor(Date.now() / 1000) - (count * this.getIntervalSeconds(timeframe));
    let price = 1.25;
    const volatility = this.getVolatility(timeframe);
    
    for (let i = 0; i < count; i++) {
      const change = (Math.random() - 0.48) * volatility;
      const open = price;
      const close = Math.max(0.0001, price + change);
      const high = Math.max(open, close) + Math.random() * volatility * 0.5;
      const low = Math.max(0.0001, Math.min(open, close) - Math.random() * volatility * 0.5);
      
      candles.push({
        time,
        open: parseFloat(open.toFixed(4)),
        high: parseFloat(high.toFixed(4)),
        low: parseFloat(low.toFixed(4)),
        close: parseFloat(close.toFixed(4)),
      });
      
      price = close;
      time += this.getIntervalSeconds(timeframe);
    }
    
    return candles;
  }
  
  getIntervalSeconds(timeframe) {
    const intervals = {
      '1m': 60,
      '5m': 300,
      '15m': 900,
      '30m': 1800,
      '1h': 3600,
      '4h': 14400,
      '1d': 86400,
    };
    return intervals[timeframe] || 900;
  }
  
  getVolatility(timeframe) {
    const vols = {
      '1m': 0.002,
      '5m': 0.005,
      '15m': 0.01,
      '1h': 0.02,
      '4h': 0.04,
      '1d': 0.08,
    };
    return vols[timeframe] || 0.01;
  }
  
  startRealTimeUpdates(symbol = 'FTA/USDT') {
    // Stop existing interval
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    
    // Update every 3 seconds for demo
    this.updateInterval = setInterval(() => {
      this.updateLastCandle();
    }, 3000);
  }
  
  updateLastCandle() {
    if (!this.data || this.data.length === 0) return;
    
    const last = this.data[this.data.length - 1];
    const volatility = 0.002;
    const change = (Math.random() - 0.5) * volatility;
    
    const newClose = Math.max(0.0001, last.close + change);
    const updated = {
      ...last,
      close: parseFloat(newClose.toFixed(4)),
      high: parseFloat(Math.max(last.high, newClose).toFixed(4)),
      low: parseFloat(Math.min(last.low, newClose).toFixed(4)),
    };
    
    // Update chart
    this.candleSeries.update(updated);
    this.data[this.data.length - 1] = updated;
    
    // Update price display callbacks
    if (this.onPriceUpdate) {
      this.onPriceUpdate(newClose);
    }
    
    // Update price line
    this.updatePriceLine(newClose);
  }
  
  updatePriceLine(price) {
    this.priceLine.applyOptions({
      price: price,
      title: `$${price.toFixed(4)}`,
    });
  }
  
  stopRealTimeUpdates() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }
  
  addTechnicalIndicator(type, options = {}) {
    // Add MA, EMA, RSI, MACD etc.
    switch(type) {
      case 'MA':
        return this.addMovingAverage(options.period || 20, options.color || '#2196F3');
      case 'EMA':
        return this.addMovingAverage(options.period || 20, options.color || '#9C27B0', true);
      case 'RSI':
        return this.addRSI(options.period || 14);
      default:
        return null;
    }
  }
  
  addMovingAverage(period, color, exponential = false) {
    const maData = this.calculateMA(this.data, period, exponential);
    
    const lineSeries = this.chart.addLineSeries({
      color: color,
      lineWidth: 1,
      priceFormat: { type: 'price', precision: 4 },
      lastValueVisible: false,
      priceLineVisible: false,
    });
    
    lineSeries.setData(maData);
    return lineSeries;
  }
  
  calculateMA(data, period, exponential) {
    const result = [];
    let sum = 0;
    const k = 2 / (period + 1);
    
    for (let i = 0; i < data.length; i++) {
      if (exponential) {
        if (i === 0) {
          sum = data[i].close;
        } else {
          sum = data[i].close * k + sum * (1 - k);
        }
      } else {
        sum += data[i].close;
        if (i >= period - 1) {
          if (i > period - 1) {
            sum -= data[i - period].close;
          }
          result.push({
            time: data[i].time,
            value: parseFloat((sum / Math.min(i + 1, period)).toFixed(4)),
          });
        }
      }
    }
    
    return result;
  }
  
  setTheme(isDark) {
    this.chart.applyOptions({
      layout: {
        textColor: isDark ? '#B0B0C0' : '#191919',
        backgroundColor: isDark ? 'transparent' : '#ffffff',
      },
      grid: {
        vertLines: { color: isDark ? 'rgba(42, 42, 63, 0.3)' : 'rgba(0, 0, 0, 0.1)' },
        horzLines: { color: isDark ? 'rgba(42, 42, 63, 0.3)' : 'rgba(0, 0, 0, 0.1)' },
      },
    });
  }
  
  destroy() {
    this.stopRealTimeUpdates();
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.chart) {
      this.chart.remove();
      this.chart = null;
    }
  }
}

// Export for use
window.FitiaChart = FitiaChart;