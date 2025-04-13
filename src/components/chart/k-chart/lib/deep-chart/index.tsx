import { kChartEmitter } from '@/core/events';
import { LANG } from '@/core/i18n';
import { SUBSCRIBE_TYPES, useWs } from '@/core/network';
import { MediaInfo } from '@/core/utils';
import { useEffect, useRef, useState } from 'react';
import { DepthChart } from './chart';

export const DeepChart = ({ id, theme, qty }: any) => {
  const chart = useRef<DepthChart | null>(null);
  const [latestPrice, setLatestPrice] = useState<number>(0);
  const [deepData, setDeepData] = useState<any>({ asks: [], bids: [] });

  useEffect(() => {
    const getColor = (data: any) => {
      const color1 = data['up-color-rgb'];
      const color2 = data['down-color-rgb'];
      chart.current?.setColor(color1, color2);
    };
    if (!chart.current) {
      const color = getComputedStyle(document.documentElement).getPropertyValue('--theme-trade-bg-color-2');
      chart.current = new DepthChart({
        container: 'depth-chart' + qty,
        textList: { 买: LANG('买'), 卖: LANG('卖') },
        fillBottomColor: color,
      });
      kChartEmitter.on(kChartEmitter.K_CHART_SWITCH_COLOR, getColor);
    }
    return () => {
      kChartEmitter.off(kChartEmitter.K_CHART_SWITCH_COLOR, getColor);
    };
  }, []);
  useWs(SUBSCRIBE_TYPES.ws4001, (markDetail) => setLatestPrice(markDetail?.c));

  useWs(SUBSCRIBE_TYPES.ws7001, (data) => setDeepData(data));
  useEffect(() => {
    const mergedData = {
      ...deepData,
      latestPrice,
    };
    if (deepData?.asks?.length > 0 && deepData?.bids?.length > 0) {
      chart.current?.update(mergedData);
    }
  }, [deepData, latestPrice]);
  // 修改主题
  useEffect(() => {
    chart.current?.setTheme(theme);
  }, [theme]);

  return (
    <>
      <div id={'depth-chart' + qty} style={{ flex: 1, overflow: 'hidden' }}></div>
      <style jsx>{`
        #${'depth-chart' + qty} {
          background-color: var(--bg-1);
          background-image: url('/static/images/trade/kline/logo.webp');
          background-repeat: no-repeat;
          background-position: center;
          background-size: 250px;
          @media ${MediaInfo.mobile} {
            background-size: 150px;
          }
        }
      `}</style>
    </>
  );
};
