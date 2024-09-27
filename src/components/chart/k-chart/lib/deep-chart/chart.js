import { kChartEmitter } from '@/core/events';
import { rootColor } from '@/core/styles/src/theme/global/root';

export class DepthChart {
  color1 = rootColor['up-color-rgb'];
  color2 = rootColor['down-color-rgb'];
  ratio = window.devicePixelRatio || window.webkitDevicePixelRatio || window.mozDevicePixelRatio || 1;

  constructor({ container, textList = { 买: '', 卖: '' }, fillBottomColor }) {
    if (!container) return console.warn('请传入container');

    this.textList = textList;

    this.fillBottomColor = fillBottomColor;

    this.init(container);
    this._event(container);
  }

  setColor(color1, color2) {
    this.color1 = color1;
    this.color2 = color2;
    this.update();
  }

  _updateEvent(container) {
    this.setContainerSize(container);
    if (this.data) this.update(this.data);
  }

  _event(container) {
    try {
      const func = this._updateEvent.bind(this, container);
      window.addEventListener('resize', func);
      kChartEmitter.on(kChartEmitter.K_CHART_FULL_SCREEN, func);
    } catch (e) {
      // console.log(e);
    }
  }

  setTheme(theme) {
    const color = getComputedStyle(document.documentElement).getPropertyValue('--theme-trade-bg-color-2');
    this.fillBottomColor = color;
    this.update();
  }

  init(container) {
    const _canvas = (this._canvas = document.createElement('canvas'));
    this.ctx = _canvas.getContext('2d');
    const _container = document.getElementById(container);
    _container.appendChild(_canvas);
    this.setContainerSize(container);
  }

  setContainerSize(container) {
    const _container = document.getElementById(container);
    if (_container) {
      this._canvas.height = _container.clientHeight * this.ratio;
      this._canvas.width = _container.clientWidth * this.ratio;
      this.h = this._canvas.height - this.calc(20);
      this.w = this._canvas.width;
      this._canvas.style.height = _container.clientHeight + 'px';
      this._canvas.style.width = _container.clientWidth + 'px';
    }
  }

  update(data) {
    if (!this.data && !data) return;

    if (data) {
      this.data = data;
    } else {
      data = this.data;
    }

    this.ctx.clearRect(0, 0, this.w, this.h);
    let { bids, asks } = data;

    let bids1 = 0;
    bids = bids.map((item, i) => {
      if (i === 0) {
        bids1 = +item.amount;
        return [+item.price, item.amount];
      } else {
        bids1 += +item.amount;
        return [+item.price, +item.amount + bids1];
      }
    });

    let asks1 = 0;
    asks = asks.map((item, i) => {
      if (i === 0) {
        asks1 = +item.amount;
        return [+item.price, item.amount];
      } else {
        asks1 += +item.amount;
        return [+item.price, +item.amount + asks1];
      }
    });

    const asksMax = Math.max(...asks.map(([, b]) => b));
    const bidsMax = Math.max(...bids.map(([, b]) => b));
    const startPoint = Math.min(asksMax, bidsMax);

    const list = [...bids, ...asks];
    const volumeList = list.reduce((a, b) => [...a, b[1]], []);
    const max = Math.max(...volumeList);
    const min = Math.min(...volumeList);

    const priceList = list.map(([a]) => a);
    const oneList = [bids[0], asks[0]]; // 买卖一档
    const { latestPrice } = data;
    this.fillLeftChart([...bids], max, min, this.color2, startPoint);
    this.fillRightChart([...asks], max, min, this.color1, startPoint);
    this.fillLeftVolume(volumeList);
    this.fillBottomPrice(priceList, latestPrice);
    this.fillTopDetail(oneList, this.textList);
  }

  fillLeftChart(bids, max, min, color, startPoint) {
    bids = bids.sort((a, b) => b[1] - a[1]);

    const h = this.h - (max - startPoint) * (this.h / (max - min));

    let bidsData = bids.map(([, item], index, arr) => {
      const x = (index + 1) * ((this.w / 2 - this.calc(1)) / arr.length);
      const y = (max - item) * (h / (max - min));
      return [x, y];
    });

    const minY = Math.min(...bidsData.map(([, y]) => y));

    bidsData = [[this.calc(-1), this.h], [this.calc(-1), minY], ...bidsData, [this.w / 2 - this.calc(1), this.h]];

    this.ctx.beginPath();
    bidsData.forEach(([x, y], index) => {
      if (index === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    });
    this.ctx.closePath();

    this.ctx.fillStyle = `rgba(${color},0.3)`;
    this.ctx.lineWidth = this.calc(1);
    this.ctx.strokeStyle = `rgba(${color},1)`;
    this.ctx.fill();
    this.ctx.stroke();
  }

  fillRightChart(asks, max, min, color, startPoint) {
    asks = asks.sort((a, b) => a[1] - b[1]);

    const h = this.h - (max - startPoint) * (this.h / (max - min));

    let asksData = asks.map(([,], index, arr) => {
      const x = (index + 1) * ((this.w / 2 + this.calc(1)) / arr.length);
      const y = (max - arr[arr.length - index - 1][1]) * (h / (max - min));
      return [this.w + this.calc(2) - x, y];
    });

    const minY = Math.min(...asksData.map(([, y]) => y));

    asksData = [
      [this.w + this.calc(1), this.h],
      [this.w + this.calc(1), minY],
      ...asksData,
      [this.w / 2 + this.calc(1), this.h],
    ];

    this.ctx.beginPath();
    asksData.forEach(([x, y], index) => {
      if (index === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    });
    this.ctx.closePath();

    this.ctx.fillStyle = `rgba(${color},0.3)`;
    this.ctx.lineWidth = this.calc(1);
    this.ctx.strokeStyle = `rgba(${color},1)`;
    this.ctx.fill();
    this.ctx.stroke();
  }
  //  画y轴刻度
  fillLeftVolume(volumeList, count = 5) {
    const min = Math.min(...volumeList);
    const max = Math.max(...volumeList);
    const diff = max - min;
    const step = diff / count;

    const result = [...new Array(count + 1)].map((a, i) => i * step + min).sort((a, b) => b - a);

    const h = this.h / count - this.calc(5);

    this.ctx.fillStyle = '#81929D';
    this.ctx.font = `${this.calc(10)}px DINPro`;

    this.ctx.textAlign = 'start';
    result.forEach((item, i) => {
      this.ctx.fillText(item.toFormat(0), this.calc(10), h * i + this.calc(13));
    });
  }

  // 计算一个精度的单位
  getDigit(num) {
    return String(num)?.split('.')?.[1]?.toString()?.length || 0;
  }

  // 画x轴价格
  fillBottomPrice(priceList, latestPrice) {
    const max = Math.max(...priceList);
    const min = Math.min(...priceList);
    const digit = Math.max(this.getDigit(min), this.getDigit(max));

    const list = [min.toFixed(digit), latestPrice?.toFixed(digit), max.toFixed(digit)];
    const gap = this.calc(14);

    this.ctx.fillStyle = this.fillBottomColor;
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.h - this.calc(1));
    this.ctx.lineTo(this.w, this.h - this.calc(1));
    this.ctx.lineTo(this.w, this.h + this.calc(20));
    this.ctx.lineTo(0, this.h + this.calc(20));
    this.ctx.closePath();
    this.ctx.fill();

    this.ctx.fillStyle = '#81929D';
    this.ctx.font = `${this.calc(10)}px DINPro`;

    this.ctx.textAlign = 'start';
    this.ctx.fillText(list[0].toFormat('all'), this.calc(10), this.h + gap);

    this.ctx.textAlign = 'center';
    this.ctx.fillText(list[1]?.toFormat('all'), this.w / 2, this.h + gap);

    this.ctx.textAlign = 'right';
    this.ctx.fillText(list[2]?.toFormat('all'), this.w - this.calc(10), this.h + gap);
  }

  //  画中间的显示
  fillTopDetail(data) {
    const priceList = data.map((v) => v?.[0] || 0);

    this.ctx.strokeStyle = '#798296';
    this.ctx.beginPath();
    this.ctx.moveTo(this.w / 2 - this.calc(25), this.calc(37.33));
    this.ctx.lineTo(this.w / 2 - this.calc(25), this.calc(33.33));
    this.ctx.lineTo(this.w / 2 + this.calc(25), this.calc(33.33));
    this.ctx.lineTo(this.w / 2 + this.calc(25), this.calc(37.33));
    this.ctx.stroke();

    // 左金额
    this.ctx.fillStyle = '#81929D';
    this.ctx.font = `${this.calc(10)}px DINPro`;
    this.ctx.textAlign = 'right';
    this.ctx.fillText(priceList[0].toFormat('all'), this.w / 2 - this.calc(20), this.calc(30));

    // 右金额
    this.ctx.fillStyle = '#81929D';
    this.ctx.font = `${this.calc(10)}px DINPro`;
    this.ctx.textAlign = 'left';
    this.ctx.fillText(priceList[1].toFormat('all'), this.w / 2 + this.calc(20), this.calc(30));

    // 买方块
    this.ctx.fillStyle = `rgb(${this.color2})`;
    this.ctx.fillRect(this.w / 2 - this.calc(43.33), this.calc(43.3), this.calc(10), this.calc(10));

    this.ctx.fillStyle = '#81929D';
    this.ctx.font = `${this.calc(10)}px DINPro`;
    this.ctx.fillText(this.textList['买'], this.w / 2 - this.calc(30), this.calc(51.66));

    // 卖方块
    this.ctx.fillStyle = `rgb(${this.color1})`;
    this.ctx.fillRect(this.w / 2 + this.calc(20), this.calc(43.3), this.calc(10), this.calc(10));

    this.ctx.fillStyle = '#81929D';
    this.ctx.font = `${this.calc(10)}px DINPro`;
    this.ctx.fillText(this.textList['卖'], this.w / 2 + this.calc(33.33), this.calc(51.66));
  }

  // 分辨率计算转换
  calc = (num) => num * this.ratio;
}
