import { GradienScrollRow } from '@/components/gradien-scroll-row';
import { TabContent } from '@/components/order-list/swap/components/tab-content';
import { useListTabs } from '@/components/order-list/swap/hooks/use-list-tabs';
import { useOrderData } from '@/components/order-list/swap/hooks/use-order-data';
import { usePageListener } from '@/components/order-list/swap/hooks/use-page-listener';
import { store } from '@/components/order-list/swap/store';
import { Account } from '@/core/shared';
import { clsx, MediaInfo } from '@/core/utils';
import dynamic from 'next/dynamic';
import { UnLoginView } from '../../../components/un-login-view';

const PositionList = dynamic(() => import('./components/position-list'), { ssr: false, loading: () => <div /> });
const PendingList = dynamic(() => import('./components/pending-list'), { ssr: false, loading: () => <div /> });
const HistoryList = dynamic(() => import('./components/history-list'), { ssr: false, loading: () => <div /> });
const FundsList = dynamic(() => import('./components/funds-list'), { ssr: false, loading: () => <div /> });
const FinishedList = dynamic(() => import('./components/finished-list'), { ssr: false, loading: () => <div /> });
const PositionHistory = dynamic(() => import('./components/position-history'), { ssr: false, loading: () => <div /> });

export const Index = () => {
  const { tabIndex, hide } = store;
  const { positions, pending } = useOrderData({ hide });
  const isLogin = Account.isLogin;
  const tabs = useListTabs({ positions, pending });
  usePageListener();

  return (
    <>
      <div className="order-list">
        <div className="tabbar">
          <GradienScrollRow>
            <div className="content">
              {tabs.map((v, index) => {
                const active = tabIndex === index;
                return (
                  <div
                    key={index}
                    className={clsx('tab')}
                    data-active={active}
                    onClick={() => (store.tabIndex = index)}
                  >
                    {v}
                  </div>
                );
              })}
            </div>
          </GradienScrollRow>
        </div>
        {isLogin ? (
          <div className="tab-content">
            <ListContent tabIndex={tabIndex} />
          </div>
        ) : (
          <UnLoginView />
        )}
      </div>
      <style jsx>{`
        .order-list {
          .tabbar {
            border-bottom: 1px solid rgba(var(--theme-trade-border-color-1-rgb), 0.5);
            .content {
              padding: 0 15px;
              height: 42px;
              white-space: nowrap;
              @media ${MediaInfo.mobile} {
                padding: 0 1rem;
                height: 2.5rem;
              }
              .tab {
                display: inline-block;
                user-select: none;
                cursor: pointer;
                position: relative;
                height: 100%;
                line-height: 42px;
                font-size: 14px;
                font-weight: 500;
                white-space: nowrap;
                color: var(--theme-trade-text-color-3);
                margin-right: 25px;
                &:last-child {
                  margin-right: 15px;
                }
                @media ${MediaInfo.mobile} {
                  font-size: 12px;
                  line-height: 2.5rem;
                }
              }
              .tab[data-active='true'] {
                color: var(--theme-trade-text-color-1);
                &::before {
                  position: absolute;
                  bottom: 0;
                  content: '';
                  display: block;
                  width: 100%;
                  height: 2px;
                  background: var(--skin-primary-color);
                }
                @media ${MediaInfo.mobile} {
                  color: var(--brand);
                  &::before {
                    display: none;
                  }
                }
              }
            }
          }
          .tab-content {
            min-height: 50vh;
          }
        }
      `}</style>
    </>
  );
};

const ListContent = ({ tabIndex }: { tabIndex: number }) => {
  const contents: any = [
    <PositionList key="1" />,
    <PendingList key="2" />,
    <HistoryList key="3" active={tabIndex == 2} />,
    <FinishedList key="4" active={tabIndex == 3} />,
    // <PositionHistory key='5' active={tabIndex == 4} />, // TODO
    <FundsList key="5" active={tabIndex == 4} />
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
