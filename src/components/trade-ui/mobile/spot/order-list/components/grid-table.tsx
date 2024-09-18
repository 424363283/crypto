import CoinLogo from '@/components/coin-logo';
import CommonIcon from '@/components/common-icon';
import { formatZero, getColor } from '@/components/order-list/spot/components/grid-table';
import { StopGridModal } from '@/components/order-list/spot/components/stop-grid-modal';
import { useRouter } from '@/core/hooks';
import { LANG, TrLink } from '@/core/i18n';
import { Account, LoadingType, Spot, SpotTabType } from '@/core/shared';
import { LOCAL_KEY, localStorageApi } from '@/core/store';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { useImmer } from 'use-immer';
const { Position, Strategy } = Spot;

const GridTable = ({ type }: { type: SpotTabType }) => {
  const id = useRouter().query.id as string;
  const { spotGridList, hideOther } = Position.state;
  const { symbolList } = Strategy.state;
  const STOP_STATUS = [
    '',
    LANG('手动停止'),
    LANG('管理员停止'),
    LANG('止盈停止'),
    LANG('止损停止'),
    LANG('到期停止'),
    LANG('异常停止'),
  ];
  const GRID_STATUS = [LANG('待触发'), LANG('新建'), LANG('运行中'), LANG('停止中'), LANG('已结束')];

  const isLogin = Account.isLogin;
  const isRunning = type === SpotTabType.GRID_RUNNING;

  const [state, setState] = useImmer({
    stopGridId: '',
    baseCoin: '',
    quoteCoin: '',
    stopSell: false,
    stopModalVisible: false,
  });

  const filterSpotGridList = useMemo(() => {
    let resultList = spotGridList.filter((item: any) => (isRunning ? item.state < 3 : item.state >= 3));
    if (hideOther) {
      resultList = resultList.filter(({ symbol }) => (hideOther ? symbol === id : true));
    }
    if (!isLogin) {
      return [];
    }
    return resultList;
  }, [id, isLogin, spotGridList, isRunning, hideOther]);

  const onItemStopClicked = (item: any) => {
    setState((draft) => {
      draft.stopGridId = item?.id;
      draft.baseCoin = item?.baseCoin;
      draft.quoteCoin = item?.quoteCoin;
      draft.stopSell = item?.stopSell;
      draft.stopModalVisible = true;
    });
  };

  const now = new Date().getTime();

  const getScale = (symbol: string) => {
    const findItem = symbolList.find((item) => item.symbol === symbol);
    return findItem?.priceScale;
  };

  const renderMyStrategy = () => {
    return (
      <>
        <div className='copy-content'>
          <ul className='grid-wrapper'>
            {filterSpotGridList.map((item: any) => (
              <li key={item.id}>
                <div className='title-wrapper'>
                  <CoinLogo coin={item?.baseCoin} width={20} height={20} alt={item?.baseCoin} className='coin' />
                  <div className='title'>{item?.symbol.replace('_', '/')}</div>
                </div>
                <div className='status-wrapper'>
                  <div>
                    {isRunning ? GRID_STATUS[item.state] : STOP_STATUS[item.stopType]}/{LANG('运行时长')}{' '}
                    <span>
                      {dayjs(now).diff(item.createTime, 'd')}D{dayjs(now).diff(item.createTime, 'h') % 24}h
                      {dayjs(now).diff(item.createTime, 'minute') % 60}m
                    </span>
                  </div>
                  <span>{LANG('现货策略')}</span>
                </div>
                <div className='profit-wrapper'>
                  <div>
                    <div>{LANG('投入金额')}(USDT)</div>
                    <div>{item.initQuote}</div>
                  </div>
                  <div>
                    <div>
                      {LANG('总收益')}/{LANG('总收益率')}
                    </div>
                    <div className={`profit ${getColor(formatZero(item?.totalPnl.toRound(getScale(item.symbol))))}`}>
                      {Number(formatZero(item?.totalPnl.toRound(getScale(item.symbol)))) > 0 ? '+' : ''}
                      {formatZero(item?.totalPnl.toRound(getScale(item.symbol)))}
                      <span className={`${formatZero(item.totalPnl.div(item.initQuote).mul(100).toFixed(2))}`}>
                        {formatZero(item.totalPnl.div(item.initQuote).mul(100).toFixed(2))}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className='item'>
                  <div>{LANG('价格区间')}(USDT)</div>
                  <div>
                    {item?.priceMin} - {item?.priceMax}
                  </div>
                </div>
                <div className='item'>
                  <div>{LANG('网格数量')}(USDT)</div>
                  <div>{item?.gridCount}</div>
                </div>
                <div className='button-wrapper'>
                  <TrLink
                    href='/trading-bot/detail?type=grid'
                    query={{ id: item.id }}
                    onClick={() => {
                      localStorageApi.setItem(LOCAL_KEY.FROM_SPOT_TABLE, id);
                    }}
                    className='link'
                  >
                    {LANG('详情')}
                  </TrLink>
                  {type === SpotTabType.GRID_RUNNING && (
                    <div onClick={() => onItemStopClicked(item)}>
                      <CommonIcon name='common-grid-stop-0' size={20} enableSkin />
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <style jsx>{`
          .copy-content {
            .tab {
              margin: 0;
              padding: 0;
              display: flex;
              align-items: center;
              li {
                margin-right: 4px;
                cursor: pointer;
                padding: 2px 4px;
                color: var(--theme-font-color-1);
                font-size: 12px;
                &.active {
                  background-color: var(--theme-background-color-8);
                  border-radius: 6px;
                }
                span {
                  margin-left: 4px;
                }
              }
            }
            .grid-wrapper {
              margin: 0px;
              padding: 10px;
              max-height: 60vh;
              overflow: auto;
              border-radius: 6px;
              li {
                padding: 16px;
                border-radius: 8px;
                background-color: var(--theme-background-color-3-2);
                margin-bottom: 20px;
                .title-wrapper {
                  display: flex;
                  align-items: center;
                  :global(.coin) {
                    margin-right: 6px;
                  }
                  .title {
                    font-size: 16px;
                    font-weight: 500;
                    color: var(--theme-font-color-1);
                  }
                }
                .status-wrapper {
                  margin-top: 8px;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  font-size: 12px;
                  color: var(--theme-font-color-3);
                }
                .profit-wrapper {
                  background-color: var(--theme-background-color-2-4);
                  padding: 12px;
                  border-radius: 6px;
                  margin-top: 12px;
                  display: flex;
                  justify-content: space-between;
                  font-size: 12px;
                  color: var(--theme-font-color-3);
                  > div {
                    > div {
                      &:last-child {
                        margin-top: 6px;
                        font-size: 14px;
                        font-weight: 500;
                        color: var(--theme-font-color-1);
                      }
                    }
                  }
                  .profit {
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    color: var(--theme-font-color-1);
                    span {
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      height: 23px;
                      margin-left: 4px;
                      border-radius: 6px;
                      background-color: var(--theme-grid-profit-color);
                      color: #313535;
                      font-size: 12px;
                      padding: 0 4px;
                    }
                    :global(span.main-red) {
                      background-color: var(--color-red) !important;
                      color: #fff !important;
                    }
                    :global(span.main-green) {
                      background-color: var(--color-green) !important;
                      color: #fff !important;
                    }
                  }
                }
                .item {
                  margin-top: 12px;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  font-size: 12px;
                  color: var(--theme-font-color-3);
                  > div {
                    &:last-child {
                      color: var(--theme-font-color-1);
                    }
                  }
                }
                .button-wrapper {
                  margin-top: 12px;
                  display: flex;
                  align-items: center;
                  :global(.link) {
                    border: none;
                    border-radius: 6px;
                    height: 36px;
                    color: var(--skin-font-color);
                    font-weight: 500;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background-color: var(--skin-primary-color);
                    cursor: pointer;
                    flex: 1;
                  }
                  > div {
                    margin-left: 20px;
                    cursor: pointer;
                    border: 1px solid var(--theme-border-color-3);
                    border-radius: 6px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 36px;
                    width: 36px;
                    :global(img) {
                      vertical-align: bottom;
                    }
                  }
                }
              }
            }
          }
        `}</style>
      </>
    );
  };

  return (
    <>
      <div className='container'>{renderMyStrategy()}</div>
      {state.stopModalVisible && (
        <StopGridModal
          id={state.stopGridId}
          baseCoin={state.baseCoin}
          quoteCoin={state.quoteCoin}
          stopSell={state.stopSell}
          open={state.stopModalVisible}
          onClose={() =>
            setState((draft) => {
              draft.stopModalVisible = false;
            })
          }
          onSuccess={() => {
            Position.fetchSpotGridPositionList(LoadingType.Show);
            Strategy.getBalance();
          }}
        />
      )}
    </>
  );
};

export default GridTable;
