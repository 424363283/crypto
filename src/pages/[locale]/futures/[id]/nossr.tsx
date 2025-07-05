import { Activity2888 } from '@/components/activity/activity2888';
import { Loading } from '@/components/loading';
import { Desktop, Mobile, Tablet } from '@/components/responsive';
import { useRouter } from '@/core/hooks';
import { SUBSCRIBE_TYPES, useWs } from '@/core/network';
import { Account, Swap } from '@/core/shared';
import dynamic from 'next/dynamic';
import { useEffect, useRef } from 'react';

const DesktopNoSSR = dynamic(() => import('./media/desktop'), { ssr: false, loading: () => Loading.tradeView() });
const TabletNoSSR = dynamic(() => import('./media/tablet'), { ssr: false, loading: () => Loading.tradeView() });
const MobileNoSSR = dynamic(() => import('./media/mobile'), { ssr: false, loading: () => Loading.tradeView() });

function SwapPageNoSSR() {
  usePageHook();
  return (
    <>
      <Desktop forceInitRender={false}>
        <DesktopNoSSR />
      </Desktop>
      <Tablet forceInitRender={false}>
        <TabletNoSSR />
      </Tablet>
      <Mobile forceInitRender={false}>
        <MobileNoSSR />
      </Mobile>
      <Activity2888 />
    </>
  );
}

const usePageHook = () => {
  const id = (useRouter().query?.id || '') as string;
  useEffect(() => {
    return Swap.fetchInitData();
  }, []);
  useEffect(() => {
    if (id) {
      Swap.Trade.initQuote(id);
    }
  }, [id]);
  Swap.useListener();
  const _ = useRef({ priceLoaded: false, firstLoaded: false }).current;

  useEffect(() => {
    // 初始化币对
    _.priceLoaded = false;
  }, [id, _]);

  useWs(
    SUBSCRIBE_TYPES.ws4001,
    (data) => {
      if (!_.priceLoaded && data?.id === id?.toUpperCase()) {
        const price = Swap.Utils.getNewPrice(id as string);

        if (price) {
          _.priceLoaded = true;
          Swap.Trade.onPriceChange(Swap.Utils.getNewPrice(id as string));
        }
      }
    },
    [id]
  );
   
  useEffect(() => {
    return Swap.Info.subscribeAgreementIsAllow(() => {
      if (id && Account.isLogin && !_.firstLoaded) {
        _.firstLoaded = true;
        const isUsdtType = Swap.Info.getIsUsdtType(id);
        Swap.Assets.fetchBalance(true, false);
        // Swap.Assets.fetchBalance(false, false);
        Swap.Order.fetchPending(isUsdtType, { forced: true });
        Swap.Order.fetchPosition(isUsdtType, { forced: true });
      }
    });
  }, [id]);
};

export default SwapPageNoSSR;
