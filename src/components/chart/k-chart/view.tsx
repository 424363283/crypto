import { Loading } from '@/components/loading';
import { useResponsive, useRouter, useTheme } from '@/core/hooks';
import { useAppContext } from '@/core/store';
import { memo, useEffect } from 'react';
import { KHeader } from './components/k-header';
import { KTYPE, kHeaderStore } from './components/k-header/store';
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

const KChartComponent = ({ symbolType, qty = 0 }: { symbolType: TRADINGVIEW_SYMBOL_TYPE; qty?: number }) => {
  const { kType, resolution, isLoading, setkType, setting } = kHeaderStore(qty);
  const router = useRouter();
  const { id, locale } = router.query;
  const { theme } = useTheme();
  const { isLogin } = useAppContext();
  const { isMobile } = useResponsive(false);

  const showCrosshairOrderBtn =
    !isMobile && symbolType == TRADINGVIEW_SYMBOL_TYPE.SWAP && setting.paintOrder && isLogin;
  useEffect(() => {
    // 如果当前缓存的kType是深度图，但是当前symbolType不是lite，那么就切换到k线图
    if (kType === KTYPE.DEEP_CHART && symbolType == TRADINGVIEW_SYMBOL_TYPE.LITE) {
      setkType(KTYPE.K_LINE_CHART);
    }
  }, [kType]);

  return (
    <>
      <div className='k-box' id={getKlineBoxId(qty)}>
        <KHeader id={id as string} qty={qty} />
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
                id={id as string}
                theme={theme as string}
                resolution={resolution}
                isReverse={!isMobile ? setting.revesePreview : false}
                showOrdebok={!isMobile ? setting.orderBookPrice : false}
                showCountdown={!isMobile ? setting.countdown : false}
                showPriceLine={!isMobile ? setting.newPrice : true}
                vol
                holc
              />
            )}
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
        `}
      </style>
    </>
  );
};

export const KChart = memo(KChartComponent);

export default KChart;
