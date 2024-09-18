import React from 'react';

interface ChartPropsType {
  id: string;
  width: number;
  height: number;
  data: number[];
  upColor: string;
  downColor: string;
  lineWidth: number;
}

const MiniChartPro = (props: ChartPropsType) => {
  const ref = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      const ctx = ref.current.getContext('2d');
      if (ctx) {
        const { width, height, data, upColor, downColor } = props;
        // 设置画布的宽高和修复模糊(使用缩放和dpr来修复模糊)
        const dpr = window.devicePixelRatio || 1;
        ref.current.width = width * dpr;
        ref.current.height = height * dpr;
        ref.current.style.width = `${width}px`;
        ref.current.style.height = `${height}px`;
        ctx.scale(dpr, dpr);

        const len = data.length;
        const space = width / len;
        const max = Math.max(...data);
        const min = Math.min(...data);

        const diff = max - min;
        // 算出0轴的位置
        const zeroY = diff === 0 ? 0 : (max / diff) * height;

        ctx.beginPath();
        ctx.moveTo(0, zeroY);

        // 添加渐变颜色停止点
        const gradient = ctx.createLinearGradient(0, 0, 0, zeroY);
        gradient.addColorStop(0, colorRgba(upColor, 0.7));
        gradient.addColorStop(1, colorRgba(upColor, 0.3));

        ctx.fillStyle = gradient;

        for (let i = 0; i < len; i++) {
          ctx.lineTo(i * space, data[i] <= 0 ? zeroY : zeroY - (data[i] / diff) * height);
          if (i === len - 1) {
            ctx.lineTo(i * space, zeroY);
          }
        }
        ctx.fill();

        ctx.closePath();

        ctx.beginPath();
        ctx.moveTo(0, zeroY);

        // 添加渐变颜色停止点
        const gradient2 = ctx.createLinearGradient(0, zeroY, 0, height);
        gradient2.addColorStop(1, colorRgba(downColor, 0.7));
        gradient2.addColorStop(0, colorRgba(downColor, 0.3));

        ctx.fillStyle = gradient2;
        for (let i = 0; i < len; i++) {
          ctx.lineTo(i * space, data[i] >= 0 ? zeroY : zeroY - (data[i] / diff) * height);
          if (i === len - 1) {
            ctx.lineTo(i * space, zeroY);
          }
        }
        ctx.fill();
        ctx.closePath();
      }
    }
  }, [props]);

  return <canvas ref={ref} />;
};

function colorRgba(color: string, a: number) {
  var sColor = color.toLowerCase();
  //十六进制颜色值的正则表达式
  var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  // 如果是16进制颜色
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      var sColorNew = '#';
      for (var i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
      }
      sColor = sColorNew;
    }
    //处理六位的颜色值
    var sColorChange = [];
    for (var i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)));
    }
    return `rgba(${sColorChange.join(',')},${a})`;
  }
  return sColor;
}

export default React.memo(MiniChartPro);
