import React, { useEffect, useRef, useState } from 'react';
import MiniChart from './chart';

interface ChartPropsType {
  symbol: string; // 必参
  container?: string; //  标签的id
  resolution?: number; // 行情数据的分钟间隔 [ 1 ｜ 3 ｜ 5 ｜ 15 ｜ 30 ｜ 60 ｜ 1D ]
  lineColor?: string; // 线的颜色
  areaColor?: string; // 面积的颜色
  lineWidth?: number; // 线的宽度
  background?: string; //背景颜色
  from?: number; // 开始时间
  to?: number; // 结束时间
  price?: number | null; // 当前价格
  areaColorOpacity?: number; // 面积的透明度
  showLine?: boolean; // 是否显示当前价格的线
  style?: React.CSSProperties;
  data?: any[];
  id?: string; // 用于区分一个页面有多个相同symbol的情况
}

function Chart(props: ChartPropsType) {
  const [chart, setChart] = useState<any>(null);
  const prevProps = useRef(props);
  const [sign, setSign] = useState('');
  const {
    price = null,
    container = 'BTCUSDT',
    symbol = 'BTCUSDT',
    resolution = 1,
    lineColor = 'red',
    areaColor = 'transparent',
    lineWidth = 1,
    background = 'transparent',
    from = Date.parse(new Date() as any) / 1000 - 1800,
    to = Date.parse(new Date() as any) / 1000,
    areaColorOpacity = 0,
    showLine,
    style,
    data,
    id,
  } = props;

  useEffect(() => {
    // const _symbol = symbol;
    const containerId = id ? symbol + id : `${symbol}_`;
    let _chart = new MiniChart({
      container: containerId, // 必参 标签的id
      symbol: symbol, // 必参
      resolution: resolution, // 行情数据的分钟间隔 [ 1 ｜ 3 ｜ 5 ｜ 15 ｜ 30 ｜ 60 ｜ 1D ]
      lineColor: lineColor, // 线的颜色
      areaColor: areaColor, // 面积的颜色
      lineWidth: lineWidth, // 线的宽度
      background: background, //背景颜色
      from: from, // 开始时间
      to: to, // 结束时间
      data: data, // 是否使用外部数据
      dottedLineColor: '#9E9E9D',
      isShowLine: showLine,
      areaColorOpacity: areaColorOpacity,
    });
    setSign(containerId);
    if (prevProps.current.lineColor !== lineColor && chart) {
      _chart.set({ lineColor: lineColor });
    }
    if (prevProps.current.data !== data || !prevProps.current.data?.length || !data?.length) {
      _chart.setData(data);
    }
    if (prevProps.current.areaColor !== areaColor) {
      _chart.set({ areaColor: areaColor });
    }
    setChart(_chart);
  }, [props]);

  return <div className={`chart-container ${sign}`} id={sign} style={style} />;
}

export default React.memo(Chart);
