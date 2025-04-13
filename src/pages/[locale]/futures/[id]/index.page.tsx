import { SwapDemoHeader } from '@/components/header/components/swap-demo-header';
import { UniversalLayout } from '@/components/layouts/login/universal';
import { Lang } from '@/core/i18n';
import { WS3001, WS4001 } from '@/core/network';
import { TradeThemeProvider } from '@/core/styles';

import { RootColor } from '@/core/styles/src/theme/global/root';
import { useEffect } from 'react';
import MainNoSSR from './nossr';

export const SwapPage = ({ isSwapDemo }: { isSwapDemo?: boolean }) => {
  useEffect(() => {
    if (!localStorage[RootColor.MANUAL_TRIGGER]) {
      const isKo = document.querySelector('html')?.getAttribute('lang') === 'ko';
      RootColor.setColorRGB(isKo ? 3 : 1, false);
    }
  }, []);
  const page = (
    <UniversalLayout
      hideFooter
      bgColor='var(--theme-background-color-9)'
      hideBorderBottom
      header={isSwapDemo ? <SwapDemoHeader /> : undefined}
    >
      <TradeThemeProvider>
        <MainNoSSR />
      </TradeThemeProvider>
    </UniversalLayout>
  );

  return page;
};

export default Lang.SeoHead(WS3001(WS4001(SwapPage), { swap: true }));
export const getStaticPaths = Lang.getStaticPathsTradeCallback('swapids');
export const getStaticProps = Lang.getStaticProps({ key: 'swap' });
