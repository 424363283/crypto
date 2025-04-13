import CommonIcon from '@/components/common-icon';
import { Loading } from '@/components/loading';
import { kChartEmitter } from '@/core/events';
import { useResponsive, useRouter, useTheme } from '@/core/hooks';
import { WS } from '@/core/network';
import { useAppContext } from '@/core/store';
import { isSwap, isLite, getUrlQueryParams } from '@/core/utils';
import dayjs from 'dayjs';
import { memo, useEffect, useState } from 'react';
import { KHeader } from './components/k-header';
import { KTYPE, getKLinePriceType, kHeaderStore } from './components/k-header/store';
import { OnceRender } from './components/once-render';
import { DeepChart } from './lib/deep-chart';
import { KlineChart } from './lib/kline-chart';
import { TradingView } from './lib/trading-view';
import { getKlineBoxId } from './utils';
import Kline from '@/components/YKLine'
import { Swap, Spot } from '@/core/shared';
import { Group } from '@/core/shared';


export enum TRADINGVIEW_SYMBOL_TYPE {
  SPOT = 'Spot',
  LITE = 'Lite',
  SWAP = 'Swap',
}

const { Trade } = Spot;

const KChartComponent = ({
  symbolType,
  qty = 0,
  klineGroupMode,
}: {
  symbolType: TRADINGVIEW_SYMBOL_TYPE;
  qty?: number;
  klineGroupMode?: boolean;
}) => {
  const { kType, resolution, isLoading, setkType, setting } = kHeaderStore(qty);
  const klinePriceType = getKLinePriceType(qty);
  const router = useRouter();
  let { id, locale } = router.query;
  const { theme } = useTheme();
  const { isLogin } = useAppContext();
  const { isMobile } = useResponsive(false);
  const isSwapId = isSwap(id);
  const isLiteId = isLite(id);
  const code = 'shib-usdt';
  const cryptoData = Swap.Info.getCryptoData(code);
  const { currentPricePrecision, pricePrecision, minChangePrice, settleCoin } = cryptoData;
  const { coin, quoteCoin, quoteCoinBalance, coinBalance, currentSpotContract } = Trade.state;
  const [coinPrecision, setCoinPrecision] = useState(4);


  const showCrosshairOrderBtn = !isMobile && isSwapId && setting.paintOrder && isLogin && klinePriceType == 0;

  useEffect(() => {
    // 如果当前缓存的kType是深度图，但是当前symbolType不是lite，那么就切换到k线图
    // if (kType === KTYPE.DEEP_CHART && symbolType == TRADINGVIEW_SYMBOL_TYPE.LITE) {
    if (kType === KTYPE.DEEP_CHART) {

      setkType(KTYPE.K_LINE_CHART);
    }
  }, [kType]);
  let klineId = id;
  // if (isLiteId) {
  //   const contract = getUrlQueryParams('contract');
  //   klineId = contract;
  // }

  // if (isSwapId) {
  //   switch (klinePriceType) {
  //     // 标记价格
  //     case 1:
  //       klineId = `m${id}`;
  //       break;
  //     // 指数价格
  //     case 2:
  //       klineId = `i${id}`;
  //       break;
  //     case 0:
  //     default:
  //   }
  // }

  const backDate = () => {
    kChartEmitter.emit(kChartEmitter.K_CHART_JUMP_DATE, dayjs().valueOf(), 1000);
  };

  // useEffect(() => {
  //   if (klineId) {
  //     WS.subscribe4001([klineId]);
  //     // if (/^[im]/.test(klineId) && !klineGroupMode) {
  //     //   WS.subscribe4001([klineId, id]);
  //     // } else {
  //     //   WS.subscribe4001([id]);
  //     // }
  //   }
  // }, [klineId, klineId, klineGroupMode]);


  useEffect(() => {
    (async () => {
      if (isLite(id)) {
        const group = await Group.getInstance();
        klineId = group.getLiteQuoteCode(id);
      }
      WS.subscribe4001([klineId]);
    })();

  }, [klineId, klineId, klineGroupMode]);

  useEffect(() => {
    setCoinPrecision(currentSpotContract.digit)
  }, [currentSpotContract.digit]);


  return (
    <>

      <Kline pricePrecision={coinPrecision} />
    </>
  );
};

export const KChart = memo(KChartComponent);

export default KChart;
