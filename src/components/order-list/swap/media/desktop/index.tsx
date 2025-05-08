import { TabContent } from '@/components/order-list/swap/components/tab-content';
import { store } from '@/components/order-list/swap/store';
import { Account } from '@/core/shared';
import dynamic from 'next/dynamic';
import { UnLoginView } from '../../../components/un-login-view';
import { useListTabs } from '../../hooks/use-list-tabs';
import { useOrderData } from '../../hooks/use-order-data';
import { usePageListener } from '../../hooks/use-page-listener';
import { PositionHistory } from './components/position-history';
import { clsx, styles } from './styled';
import { kChartEmitter } from '@/core/events';
import { useCopyTradingSwapStore } from '@/store/copytrading-swap';
import { WalletKey } from '@/core/shared/src/swap/modules/assets/constants';
import { useEffect } from 'react';
import { Swap } from '@/core/shared';
const PositionList = dynamic(() => import('./components/position-list'), { ssr: false, loading: () => <div /> });
const PendingList = dynamic(() => import('./components/pending-list'), { ssr: false, loading: () => <div /> });
const HistoryList = dynamic(() => import('./components/history-list'), { ssr: false, loading: () => <div /> });
const FundsList = dynamic(() => import('./components/funds-list'), { ssr: false, loading: () => <div /> });
const FinishedList = dynamic(() => import('./components/finished-list'), { ssr: false, loading: () => <div /> });
const HeaderRight = dynamic(() => import('./components/header-right'), { ssr: false, loading: () => <div /> });

export const Index = () => {
  const fetchShareTrader = useCopyTradingSwapStore.use.fetchShareTrader();
  const isCopyTrader = useCopyTradingSwapStore.use.isCopyTrader();
  const { tabIndex, hide, showAllOrders } = store;
  const { positions, pending } = useOrderData({ hide });
  const filterPositions = positions.filter(item => isCopyTrader || item.subWallet !== WalletKey.COPY); 
  const isLogin = Account.isLogin;
  const tabs = useListTabs({ positions: filterPositions, pending });

  usePageListener();
  useEffect(() => {
    fetchShareTrader();
  }, []);


  useEffect(() => {
    Swap.Info.setIsShareTrader(isCopyTrader)
  }, [isCopyTrader]);

  return (
    <>
      <div className={clsx('record-view')}>
        <div className={clsx('tab-bar')}>
          <div className={clsx('left-part')}>
            {tabs.map((v, index) => {
              const active = tabIndex === index;
              return (
                <div key={index} className={clsx('tab')} data-active={active} onClick={() => (store.tabIndex = index)}>
                  {v}
                </div>
              );
            })}
          </div>
          {isLogin && (
            <HeaderRight
              positions={filterPositions}
              pending={pending}
              tabIndex={tabIndex}
              showAllOrders={showAllOrders}
              hide={hide}
              onChangeHide={(v) => (store.hide = v)}
              onChangeShowAllOrders={(v) => (store.showAllOrders = v)}
            />
          )}
        </div>
        {isLogin ? <ListContent tabIndex={tabIndex} /> : <UnLoginView />}
      </div>
      {styles}
    </>
  );
};

const ListContent = ({ tabIndex }: { tabIndex: number }) => {
  const contents: any = [
    <PositionList key='1' />, // 语言切换时刷新
    <PendingList key='2' />, //listRef={_pendingListRef}
    <HistoryList key='3' active={tabIndex === 2} />,
    <FinishedList key='4' active={tabIndex === 3} />,
    <PositionHistory key='5' active={tabIndex === 4} />, 
    <FundsList key='5' active={tabIndex === 5} />,
  ];

  return (
    <>
      {contents.map((child: any, i: number) => {
        return (
          <TabContent key={i} active={tabIndex === i}>
            {child}
          </TabContent>
        );
      })}
    </>
  );
};
export default Index;
