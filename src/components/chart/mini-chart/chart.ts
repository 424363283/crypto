export default class MiniChart {
    symbol = '';
    resolution = 5;
    lineWidth = 1;
    lineColor = 'red';
    areaColor = 'red';
    container = '';
    minisvg = '';
    from = '';
    to = '';
    data = [];
    background = '#000000';
    dottedLineColor = '';
    isHistoryData = true; // 是否获取最新的历史数据
    _h = 0;
    isShowLine = true;
    areaColorOpacity = 0;
    _data: any;
    h: any;
    w: any;
  
    constructor(options: any) {
      if (options.symbol) {
        this.symbol = options.symbol;
      } else {
        console.log('缺少symbol合约号');
      }
      if (typeof options.isShowLine === 'boolean') {
        this.isShowLine = options.isShowLine;
      }
      if (options.resolution) {
        this.resolution = options.resolution;
      }
      if (options.container) {
        this.container = options.container;
        this.minisvg = options.container + '_SVG';
      } else {
        console.log('缺少container行情图容器id');
      }
      if (options.lineColor) {
        this.lineColor = options.lineColor;
      }
      if (options.areaColorOpacity) {
        this.areaColorOpacity = options.areaColorOpacity;
      }
      if (options.lineWidth) {
        this.lineWidth = options.lineWidth;
      }
      if (options.areaColor) {
        this.areaColor = options.areaColor;
      }
      if (options.from) {
        this.from = options.from;
      }
      if (options.to) {
        this.to = options.to;
      }
      if (options.background) {
        this.background = options.background;
      }
      if (options.dottedLineColor) {
        this.dottedLineColor = options.dottedLineColor;
      }
      if (options.data) {
        this._data = options.data;
      }
  
      this.init();
    }
  
    init() {
      const containers = document.getElementsByClassName(this.container);
      if (containers) {
        [...containers].forEach((el) => {
          el.innerHTML = `<svg id="${this.minisvg}" class=${this.minisvg} style="display:block;background:${this.background};width:0;height:0"></svg>`;
          this.fetchData(this._data);
        });
        window.addEventListener('resize', () => this.autoSize(this.data));
      }
    }
    setData(data: any[] | undefined) {
      this.fetchData(data);
    }
    // 计算数据
    getPath = (data = [], width = 375, height = 150) => {
      if (data.length) {
        const min = Math.min.apply(null, data);
        const max = Math.max.apply(null, data);
        let d = ''; // 面积图
        let p = ''; // 线的位置
        data.forEach((item, index, arr) => {
          const poinit = (max - item) * (height / (max - min));
          const result = `${(index + 1) * (width / arr.length)},${poinit}`;
          if (index === 0) {
            d += ` M0,${poinit}`;
            p += ` 0,${poinit}`;
          } else {
            d += ` L${result}`;
            p += ` ${result}`;
          }
          // 最后一个点
          if (arr.length - 1 === index) {
            this._h = poinit;
          }
        });
        // 补全最高最低
        d += ` L${data.length * (width / data.length)},${height} L0,${height} Z`;
        return { d, p };
      }
    };
  
    // 自动计算适配
    autoSize = (data: string | any[] | undefined) => {
      const mini = document.getElementsByClassName(this.minisvg);
      if (mini?.length > 0 && data && data.length) {
        [...mini].forEach((el: any) => {
          const parent = el.parentElement;
          const h = parent?.clientHeight;
          const w = parent?.clientWidth;
          el.style.height = h;
          el.style.width = w;
          this.h = h;
          this.w = w;
          const { d, p } = this.getPath(data as any, w, h) as any;
          this.renderHtml({
            d,
            p,
            lineColor: this.lineColor,
            lineWidth: this.lineWidth,
            areaColor: this.areaColor,
            areaColorOpacity: this.areaColorOpacity,
          });
        });
      }
    };
    // 添加实时数据行情
    _time = Date.now();
  
    // 修改属性
    // areaColor: 'rgba(38,198,218, 1)', // 面积的颜色
    // lineColor: 'rgba(38,198,218, 1)', // 线的颜色
    // lineWidth: 1, // 线的宽度
    // background: '#131722',//背景颜色
    set = (props: { [s: string]: unknown } | ArrayLike<unknown>) => {
      if (typeof props === 'object') {
        // @ts-ignore
        for (let [key, value] of Object.entries(props)) {
          if (key === 'background') {
            // const container = document.getElementById(this.minisvg);
            // if (container) {
            //   container.style.background = value;
            // }
          }
          // @ts-ignore
          if (key === 'areaColor' || key === 'lineColor' || key === 'lineWidth' || key === 'dottedLineColor') {
            // @ts-ignore
            this[key] = value;
          }
        }
        if (this.data && this.data.length) {
          this.autoSize(this.data);
        }
      }
    };
    // 获取时间
    getTime = () => {
      if (this.from && this.to) {
        return { from: this.from, to: this.to };
      } else {
        const from = new Date(new Date().setHours(0, 0, 0, 0)).getTime().toString().substr(0, 10);
        const to = new Date().getTime().toString().substr(0, 10);
        return { from, to };
      }
    };
  
    // 获取接口数据
    fetchData = (_data: any) => {
      // let newContainerId = document.getElementsByClassName('chart-container')[0].id;
      if (_data?.length) {
        this.data = _data;
        // localStorage.setItem(this.symbol, JSON.stringify(_data));
        this.autoSize(_data);
      } else {
        const mock = [1, 1, 1];
        this.autoSize(mock);
        // if (localStorage[this.symbol] && newContainerId === this.container) {
        //   this.autoSize(JSON.parse(localStorage[this.symbol]));
        // } else {
        //   const mock = [1, 1, 1];
        //   localStorage[this.symbol] = JSON.stringify(mock);
        //   this.autoSize(mock);
        // }
      }
    };
  
    // 渲染页面
    renderHtml({ d, p, lineColor, lineWidth, areaColor, areaColorOpacity } = {} as any) {
      const parentElements = document.getElementsByClassName(this.minisvg);
      if (d.includes('NaN') || p.includes('NaN')) {
        const html = `
        <g>
          <line style="opacity:0.3" x1="0" x2="${this.w + 3}" y1="${this.h / 2}" y2="${
          this.h / 2
        }" stroke-dasharray="3" stroke="${this.dottedLineColor}"/>
        </g>
        `;
  
        return [...parentElements].forEach((el) => (el.innerHTML = html));
      }
  
      const html = `
      <g>
        <path d="${d}" fill="url(#${this.minisvg}-area)" />
        <polyline points="${p}" fill="none" stroke="${lineColor}" stroke-width="${lineWidth}" />
       ${
         this.isShowLine
           ? `<line style="opacity:0.3" x1="0" x2="${this.w + 3}" y1="${this.h / 2}" y2="${
               this.h / 2
             }" stroke-dasharray="3" stroke="${this.dottedLineColor}"/>`
           : ''
       } 
      </g>
      <defs>
        <linearGradient id="${this.minisvg}-area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="${areaColorOpacity}%" stop-opacity="0.2" stop-color="${areaColor}"></stop>
          <stop offset="100%" stop-opacity="0.01" stop-color="${areaColor}"></stop>
        </linearGradient>
      </defs>
      `;
  
      [...parentElements].forEach((el) => (el.innerHTML = html));
    }
  }
  