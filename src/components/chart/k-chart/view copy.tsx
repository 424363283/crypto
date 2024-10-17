import CommonIcon from '@/components/common-icon';
import { Loading } from '@/components/loading';
import { kChartEmitter } from '@/core/events';
import { useResponsive, useRouter, useTheme } from '@/core/hooks';
import { WS } from '@/core/network';
import { useAppContext } from '@/core/store';
import { isSwap } from '@/core/utils';
import dayjs from 'dayjs';
import { memo, useEffect } from 'react';
import { KHeader } from './components/k-header';
import { KTYPE, getKLinePriceType, kHeaderStore } from './components/k-header/store';
import { OnceRender } from './components/once-render';
import { DeepChart } from './lib/deep-chart';
import { KlineChart } from './lib/kline-chart';
import { TradingView } from './lib/trading-view';
import { getKlineBoxId } from './utils';

export enum TRADINGVIEW_SYMBOL_TYPE {
  SPOT = 'Spot',
  LITE = 'Lite',
  SWAP = 'Swap',
}

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
  const showCrosshairOrderBtn = !isMobile && isSwapId && setting.paintOrder && isLogin && klinePriceType == 0;

  useEffect(() => {
    // 如果当前缓存的kType是深度图，但是当前symbolType不是lite，那么就切换到k线图
    if (kType === KTYPE.DEEP_CHART && symbolType == TRADINGVIEW_SYMBOL_TYPE.LITE) {
      setkType(KTYPE.K_LINE_CHART);
    }
  }, [kType]);
  let klineId = id;
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

  useEffect(() => {
    if (id) {
      if (/^[im]/.test(klineId) && !klineGroupMode) {
        WS.subscribe4001([klineId, id]);
      } else {
        WS.subscribe4001([id]);
      }
    }
  }, [id, klineId, klineGroupMode]);

  return (
    <>
      <div className='k-box' id={getKlineBoxId(qty)}>
        <KHeader id={id as string} qty={qty} klineGroupMode={klineGroupMode} />
        <Loading.wrap
          style={{ position: 'relative', flex: 1 }}
          isLoading={isLoading}
          background={'var(--theme-trade-bg-color-2)'}
        >
          <OnceRender render={kType === KTYPE.K_LINE_CHART}>
            {id && (
              <KlineChart
                showCrosshairOrderBtn={showCrosshairOrderBtn}
                qty={qty}
                id={klineId as string}
                theme={theme as string}
                resolution={resolution}
                isReverse={!isMobile ? setting.revesePreview : false}
                showOrdebok={!isMobile ? setting.orderBookPrice : false}
                showCountdown={!isMobile ? setting.countdown : false}
                showPriceLine={!isMobile ? setting.newPrice : false}
                vol
                holc
              />
            )}
            <CommonIcon onClick={backDate} className='double-right' name='kline-doubleRight' size={26} />
          </OnceRender>
          <OnceRender render={kType === KTYPE.TRADING_VIEW}>
            {id && (
              <TradingView
                qty={qty}
                symbolType={symbolType}
                id={id}
                theme={theme}
                resolution={resolution}
                language={locale}
              />
            )}
          </OnceRender>
          <OnceRender render={kType === KTYPE.DEEP_CHART}>
            {id && <DeepChart id={id} theme={theme} qty={qty} />}
          </OnceRender>
        </Loading.wrap>
      </div>
      <style jsx>
        {`
          .k-box {
            flex: 1;
            position: relative;
            display: flex;
            flex-direction: column;
            color: var(--theme-trade-text-color-1);
            overflow: hidden;
            background-color: var(--theme-background-color-1);
          }
          .k-box.k-full-screen {
            position: fixed;
          }

          :global(.double-right) {
            position: absolute;
            right: 66px;
            bottom: 35px;
            cursor: pointer;
            z-index: 9999;
          }
        `}
      </style>
    </>
  );
};

export const KChart = memo(KChartComponent);

export default KChart;
