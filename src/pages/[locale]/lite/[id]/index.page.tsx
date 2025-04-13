import { Activity2888 } from '@/components/activity/activity2888';
import { UniversalLayout } from '@/components/layouts/universal';
import { Loading } from '@/components/loading'; 
import { Desktop, Mobile, Tablet } from '@/components/responsive';
import { useGroupidsDiffRedirect } from '@/core/hooks';
import { Lang } from '@/core/i18n';
import { WS3001, WS4001 } from '@/core/network';
import { TradeThemeProvider } from '@/core/styles';
import { RootColor } from '@/core/styles/src/theme/global/root';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { MetaKey } from '@/core/i18n/types';
// import { LOCAL_KEY, localStorageApi } from '@/core/store';
import { useRouter } from '@/core/hooks';
import {  TradeMap } from '@/core/shared';
import { Group, GroupItem } from '@/core/shared';

const DesktopSSR = dynamic(() => import('./media/desktop'), { ssr: false, loading: () => Loading.tradeView() });
const TabletNoSSR = dynamic(() => import('./media/tablet'), { ssr: false, loading: () => Loading.tradeView() });
const MobileNoSSR = dynamic(() => import('./media/mobile'), { ssr: false, loading: () => Loading.tradeView() });

function LitePage() {
  useGroupidsDiffRedirect('lite');

  useEffect(() => {
    if (!localStorage[RootColor.MANUAL_TRIGGER]) {
      const isKo = document.querySelector('html')?.getAttribute('lang') === 'ko';
      RootColor.setColorRGB(isKo ? 3 : 1, false);
    }
  }, []); 
  return (
    <UniversalLayout hideFooter bgColor='var(--theme-background-color-9)' hideBorderBottom>
      <TradeThemeProvider>
        <Desktop forceInitRender={false}>
          <DesktopSSR />
        </Desktop>
        <Tablet forceInitRender={false}>
          <TabletNoSSR />
        </Tablet>
        <Mobile forceInitRender={false}>
          <MobileNoSSR />
        </Mobile>
        <Activity2888 />
      </TradeThemeProvider>
    </UniversalLayout>
  );
}

export default Lang.SeoHead(WS3001(WS4001(LitePage), { lite: true }));
export const getStaticPaths = Lang.getStaticPathsTradeCallback('liteids');
export const getStaticProps = Lang.getStaticProps({ key: MetaKey.lite });