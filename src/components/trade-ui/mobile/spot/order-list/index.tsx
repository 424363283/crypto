import CheckboxV2 from '@/components/checkbox-v2';
import { Loading } from '@/components/loading';
import { AlertFunction } from '@/components/modal';
import { UnLoginView } from '@/components/order-list/components/un-login-view';
import { closeSpotOrderApi } from '@/core/api';
import { useRouter, useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { LIST_TYPE, LoadingType, Spot, SpotTabType } from '@/core/shared';
import { useAppContext } from '@/core/store';
import { getActive, message } from '@/core/utils';
import { useCallback, useEffect, useMemo } from 'react';
import { useImmer } from 'use-immer';
import GridTable from './components/grid-table';
import InvestTable from './components/invest-table';
import OrderHistoryTable from './components/order-history-table';
import OrderTable from './components/order-table';
import TradeHistoryTable from './components/trade-history-table';

const { Position, Strategy, Trade } = Spot;

const OrderList = () => {
  const id = useRouter().query.id as string;
  const { selectType } = Strategy.state;
  const { tradeTab } = Trade.state;
  const { orderList, hideOther, hideRevoke, spotGridList, spotInvestList } = Position.state;
  const { theme } = useTheme();

  const [state, setState] = useImmer({
    tableSelectedTab: SpotTabType.ORDER,
  });

  useEffect(() => {
    switch (selectType) {
      case null:
        Position.pollingPosition.start();
        Position.pollingGrid.stop();
        Position.pollingInvest.stop();
        setState((draft) => {
          draft.tableSelectedTab = SpotTabType.ORDER;
        });
        break;
      case LIST_TYPE.GRID:
        setTimeout(() => {
          Position.pollingPosition.stop();
          Position.pollingInvest.stop();
        }, 0);
        Position.pollingGrid.start();
        setState((draft) => {
          draft.tableSelectedTab = SpotTabType.GRID_RUNNING;
        });
        break;
      case LIST_TYPE.INVEST:
        setTimeout(() => {
          Position.pollingPosition.stop();
          Position.pollingGrid.stop();
        }, 0);
        Position.pollingInvest.start();
        setState((draft) => {
          draft.tableSelectedTab = SpotTabType.INVEST_RUNNING;
        });
        break;
    }
    return () => {
      Position.pollingPosition.stop();
      Position.pollingGrid.stop();
      Position.pollingInvest.stop();
    };
  }, [selectType, tradeTab]);

  const { isLogin } = useAppContext();

  const filterOrderList = useMemo(() => {
    switch (selectType) {
      case null:
        return orderList
          .filter(({ symbol }) => (hideOther ? symbol === id : true))
          .filter(({ openType }) => openType !== 1 && openType !== 4);
      case LIST_TYPE.GRID:
        return spotGridList.filter(({ symbol }) => (hideOther ? symbol === id : true));
      case LIST_TYPE.INVEST:
        return spotInvestList;
    }
  }, [hideOther, orderList, id, selectType, spotGridList, spotInvestList]);

  const tabs = useMemo(() => {
    switch (selectType) {
      case null:
        return [
          {
            label: `${LANG('当前委托')}(${isLogin ? filterOrderList.length : 0})`,
            value: SpotTabType.ORDER,
          },
          {
            label: LANG('历史委托'),
            value: SpotTabType.ORDER_HISTORY,
          },
          {
            label: LANG('历史成交'),
            value: SpotTabType.TRADE_HISTORY,
          },
        ];
      case LIST_TYPE.GRID:
        return [
          {
            label: `${LANG('运行中')}(${isLogin ? filterOrderList.filter((item) => item.state <= 2).length : 0})`,
            value: SpotTabType.GRID_RUNNING,
          },
          {
            label: `${LANG('已停止')}(${isLogin ? filterOrderList.filter((item) => item.state === 4).length : 0})`,
            value: SpotTabType.GRID_STOP,
          },
        ];
      case LIST_TYPE.INVEST:
        return [
          {
            label: `${LANG('运行中')}(${isLogin ? filterOrderList.filter((item) => item.state <= 2).length : 0})`,
            value: SpotTabType.INVEST_RUNNING,
          },
          {
            label: `${LANG('已停止')}(${isLogin ? filterOrderList.filter((item) => item.state === 5).length : 0})`,
            value: SpotTabType.INVEST_STOP,
          },
        ];
    }
  }, [filterOrderList, isLogin, selectType, tradeTab]);

  const renderTable = useCallback(() => {
    switch (state.tableSelectedTab) {
      case SpotTabType.ORDER:
        return <OrderTable />;
      case SpotTabType.ORDER_HISTORY:
        return <OrderHistoryTable />;
      case SpotTabType.TRADE_HISTORY:
        return <TradeHistoryTable />;
      case SpotTabType.GRID_RUNNING:
      case SpotTabType.GRID_STOP:
        return <GridTable type={state.tableSelectedTab} />;
      case SpotTabType.INVEST_RUNNING:
      case SpotTabType.INVEST_STOP:
        return <InvestTable type={state.tableSelectedTab} />;
    }
  }, [state.tableSelectedTab]);

  const onBatchRevokeClicked = useCallback(() => {
    AlertFunction({
      title: LANG('提示'),
      content: LANG('是否一键撤销所有挂单'),
      okText: LANG('确认'),
      v2: true,
      onOk: async () => {
        Loading.start();
        const orderIds = filterOrderList.map((item: any) => item.id);
        const result = await closeSpotOrderApi(orderIds);
        if (result.code === 200) {
          message.success(LANG('撤单成功'));
          Position.fetchPositionList(LoadingType.Show);
        } else {
          message.error(result.message);
        }
        Loading.end();
      },
      theme,
    });
  }, [theme, filterOrderList]);

  return (
    <>
      <div className='container'>
        <ul className='tab-wrapper'>
          {tabs &&
            tabs.map(({ label, value }) => (
              <li
                key={label}
                className={getActive(value === state.tableSelectedTab)}
                onClick={() => {
                  setState((draft) => {
                    draft.tableSelectedTab = value;
                  });
                }}
              >
                {label}
              </li>
            ))}
        </ul>
        <div className='table-wrapper'>
          {isLogin && (
            <div className='switch-wrapper'>
              {selectType !== LIST_TYPE.INVEST && (
                <div className='switch-item'>
                  <CheckboxV2 checked={hideOther} onClick={() => Position.changeHideOrder(!hideOther)} />
                  <span>{LANG('隐藏其它交易对')}</span>
                </div>
              )}

              {state.tableSelectedTab === SpotTabType.ORDER_HISTORY && (
                <div className='switch-item'>
                  <CheckboxV2 checked={hideRevoke} onClick={() => Position.changeHideRevoke(!hideRevoke)} />
                  <span>{LANG('隐藏所有已撤销')}</span>
                </div>
              )}
              {state.tableSelectedTab === SpotTabType.ORDER && (
                <button disabled={filterOrderList.length === 0} onClick={onBatchRevokeClicked}>
                  {LANG('一键撤销')}
                </button>
              )}
            </div>
          )}
          {isLogin ? renderTable() : <UnLoginView />}
        </div>
      </div>
      <style jsx>{`
        .container {
          .tab-wrapper {
            padding: 0;
            margin: 0;
            display: flex;
            padding-left: 16px;
            color: var(--theme-font-color-3);
            border-bottom: 1px solid var(--theme-trade-border-color-1);
            overflow-x: auto;
            white-space: nowrap;
            align-items: center;
            padding-bottom: 0;
            height: 37px;
            li {
              font-weight: 500;
              margin-right: 20px;
              padding: 7px 0;
              &.active {
                color: var(--theme-font-color-1);
                border-bottom: 2px solid var(--skin-hover-font-color);
              }
            }
          }
          .table-wrapper {
            margin-top: 13px;
            .switch-wrapper {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 15px;
              padding-top: 0;
              .switch-item {
                display: flex;
                align-items: center;
                span {
                  margin-left: 5px;
                  color: var(--theme-font-color-2);
                }
                :global(.ant-switch-checked) {
                  background: var(--skin-primary-color) !important;
                }
                :global(.ant-switch) {
                  background: var(--theme-background-color-disabled);
                }
              }
              button {
                background: var(--skin-primary-color);
                color: #141717;
                cursor: pointer;
                height: 24px;
                text-align: center;
                border-radius: 4px;
                margin-left: 20px;
                user-select: none;
                font-size: 12px;
                border: none;
                outline: none;
                :disabled {
                  color: #757575;
                  cursor: not-allowed;
                }
              }
            }
          }
        }
      `}</style>
    </>
  );
};

export default OrderList;
