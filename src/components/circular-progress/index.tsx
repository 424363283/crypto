import { drawText } from 'canvas-txt'; // 解决 canvas text safari 显示不到问题
import { useEffect, useRef } from 'react';

import { useTheme } from '@/core/hooks';

export function CircularProgress({ rate, buy, size = 36 }: { rate: number; buy: boolean; size: number }) {
  const percent = parseInt(`${rate * 100}`);
  let angle = parseInt(`${rate * 360}`);
  const ref = useRef<HTMLCanvasElement | null>(null);

  const { isDark } = useTheme();
  const greenColor = getComputedStyle(document.documentElement).getPropertyValue('--color-green');
  const redColor = getComputedStyle(document.documentElement).getPropertyValue('--color-red');

  useEffect(() => {
    let dom = ref.current;

    let ctx = dom?.getContext('2d');
    if (!dom || !ctx) return;
    if (dom) {
      prepare(ctx, dom);
      const width = dom.offsetWidth;
      const height = dom.offsetHeight;
      ctx.clearRect(0, 0, width, height);
      const radius = width * 0.43;
      let color = buy ? greenColor : redColor;
      ctx.beginPath();
      ctx.arc(width / 2, width / 2, radius, changeAngle(-90), changeAngle(angle - 90)); //弧度是顺时针算的
      ctx.lineWidth = 2;
      ctx.strokeStyle = color;
      ctx.stroke();
      ctx.closePath();
      ctx.beginPath();
      ctx.arc(width / 2, width / 2, radius, changeAngle(angle - 90), changeAngle(270)); //弧度是顺时针算的
      ctx.lineWidth = 2;
      ctx.strokeStyle = isDark ? '#515656' : '#E5E5E4';
      ctx.stroke();

      ctx.fillStyle = redColor; //red color text
      //百分比文字
      (drawText as any)(ctx, percent + '%', {
        x: width * 0.05,
        y: width * 0.35,
        width: width,
        justify: false,
        height: 11,
        fontSize: 11,
        font: 'y-mex',
        align: 'center',
      });
    }
  }, [angle, percent, isDark]);

  const changeAngle = (angle: any) => {
    return (Math.PI / 180) * angle;
  };
  return (
    <>
      <div className={'box'}>
        <canvas ref={ref} height='38' width='38'></canvas>
      </div>
      <style jsx>{`
        .box {
          position: relative;
          height: ${size}px;
          width: ${size}px;
        }
      `}</style>
    </>
  );
}

const prepare = (ctx: any, ref: any) => {
  const ratio = getPixelRatio(ctx);
  const width = ref.offsetWidth;
  const height = ref.offsetHeight;

  ref.style.width = `${width}px`;
  ref.style.height = `${height}px`;
  ref.width = width * ratio;
  ref.height = height * ratio;
  ctx.scale(ratio, ratio);
  ctx.clearRect(0, 0, width, height);
  ctx.width = width;
  ctx.height = height;
};

const getPixelRatio = (context: any) => {
  const backingStore =
    context.backingStorePixelRatio ||
    context.webkitBackingStorePixelRatio ||
    context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio ||
    context.backingStorePixelRatio ||
    1;
  return (window.devicePixelRatio || 1) / backingStore;
};
