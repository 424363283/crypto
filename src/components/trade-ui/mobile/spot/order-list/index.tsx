import CheckboxV2 from '@/components/checkbox-v2';
import { Loading } from '@/components/loading';
import { AlertFunction } from '@/components/modal';
import { UnLoginView } from '@/components/order-list/components/un-login-view';
import { closeSpotOrderApi } from '@/core/api';
import { useRouter, useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { LIST_TYPE, LoadingType, Spot, SpotTabType } from '@/core/shared';
import { useAppContext } from '@/core/store';
import { clsx, getActive, MediaInfo, message } from '@/core/utils';
import { useCallback, useEffect, useMemo } from 'react';
import { useImmer } from 'use-immer';
import GridTable from './components/grid-table';
import InvestTable from './components/invest-table';
import OrderHistoryTable from './components/order-history-table';
import OrderTable from './components/order-table';
import TradeHistoryTable from './components/trade-history-table';
import FundsTable from './components/funds-table';
import { Svg } from '@/components/svg';
import CheckboxItem from '@/components/trade-ui/trade-view/swap/components/checkbox-item';
import Image from 'next/image';

const { Position, Strategy, Trade } = Spot;

const RevokeContent = () => (
  <>
    <div className="revoke-confirm-wrapper">
      <Svg src="/static/icons/primary/common/tips.svg" width={16} height={16} color="var(--text_1)" />
      <span>{LANG('是否一键撤销所有挂单')}</span>
    </div>
    <style jsx>{`
      .revoke-confirm-wrapper {
        display: flex;
        gap: 4px;
        align-items: center;
        height: 1.5rem;
        span {
          color: var(--text_2);
          font-size: 14px;
          line-height: normal;
          font-weight: 400;
        }
      }
    `}</style>
  </>
);

const OrderList = () => {
  const id = useRouter().query.id as string;
  const { selectType } = Strategy.state;
  const { tradeTab } = Trade.state;
  const { orderList, hideOther, hideRevoke, hideMinimal, spotGridList, spotInvestList } = Position.state;
  const { theme } = useTheme();

  const [state, setState] = useImmer({
    tableSelectedTab: SpotTabType.ORDER,
    showFilterTab: false
  });

  useEffect(() => {
    switch (selectType) {
      case null:
        Position.pollingPosition.start();
        Position.pollingGrid.stop();
        Position.pollingInvest.stop();
        setState(draft => {
          draft.tableSelectedTab = SpotTabType.ORDER;
        });
        break;
      case LIST_TYPE.GRID:
        setTimeout(() => {
          Position.pollingPosition.stop();
          Position.pollingInvest.stop();
        }, 0);
        Position.pollingGrid.start();
        setState(draft => {
          draft.tableSelectedTab = SpotTabType.GRID_RUNNING;
        });
        break;
      case LIST_TYPE.INVEST:
        setTimeout(() => {
          Position.pollingPosition.stop();
          Position.pollingGrid.stop();
        }, 0);
        Position.pollingInvest.start();
        setState(draft => {
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
            value: SpotTabType.ORDER
          },
          {
            label: LANG('历史委托'),
            value: SpotTabType.ORDER_HISTORY
          },
          {
            label: LANG('历史成交'),
            value: SpotTabType.TRADE_HISTORY
          },
          {
            label: LANG('资产管理'),
            value: SpotTabType.FUNDS
          }
        ];
      case LIST_TYPE.GRID:
        return [
          {
            label: `${LANG('运行中')}(${isLogin ? filterOrderList.filter(item => item.state <= 2).length : 0})`,
            value: SpotTabType.GRID_RUNNING
          },
          {
            label: `${LANG('已停止')}(${isLogin ? filterOrderList.filter(item => item.state === 4).length : 0})`,
            value: SpotTabType.GRID_STOP
          }
        ];
      case LIST_TYPE.INVEST:
        return [
          {
            label: `${LANG('运行中')}(${isLogin ? filterOrderList.filter(item => item.state <= 2).length : 0})`,
            value: SpotTabType.INVEST_RUNNING
          },
          {
            label: `${LANG('已停止')}(${isLogin ? filterOrderList.filter(item => item.state === 5).length : 0})`,
            value: SpotTabType.INVEST_STOP
          }
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
        return <TradeHistoryTable showFilter={state.showFilterTab} />;
      case SpotTabType.FUNDS:
        return <FundsTable />;
      case SpotTabType.GRID_RUNNING:
      case SpotTabType.GRID_STOP:
        return <GridTable type={state.tableSelectedTab} />;
      case SpotTabType.INVEST_RUNNING:
      case SpotTabType.INVEST_STOP:
        return <InvestTable type={state.tableSelectedTab} />;
    }
  }, [state.tableSelectedTab, state.showFilterTab]);

  const onBatchRevokeClicked = useCallback(() => {
    AlertFunction({
      title: LANG('一键撤销'),
      content: <RevokeContent />,
      okText: LANG('确定'),
      v4: true,
      className: 'revoke-wrapper',
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
      theme
    });
  }, [theme, filterOrderList]);

  return (
    <>
      <div className="container">
        <ul className="tab-wrapper">
          {tabs &&
            tabs.map(({ label, value }) => (
              <li
                key={label}
                className={getActive(value === state.tableSelectedTab)}
                onClick={() => {
                  setState(draft => {
                    draft.tableSelectedTab = value;
                  });
                }}
              >
                {label}
              </li>
            ))}
        </ul>
        <div className="table-wrapper">
          {isLogin && (
            <div className="switch-wrapper">
              {selectType !== LIST_TYPE.INVEST && (
                <div className="switch-item">
                  <CheckboxItem
                    label={LANG(
                      state.tableSelectedTab !== SpotTabType.FUNDS
                        ? hideOther
                          ? '展示其他交易对'
                          : '隐藏其他交易对'
                        : hideMinimal
                        ? '展示小额币种'
                        : '隐藏小额币种'
                    )}
                    info=""
                    value={state.tableSelectedTab !== SpotTabType.FUNDS ? hideOther : hideMinimal}
                    onChange={value =>
                      state.tableSelectedTab !== SpotTabType.FUNDS
                        ? Position.changeHideOrder(value)
                        : Position.changeHideMinimal(value)
                    }
                  />
                </div>
              )}

              {state.tableSelectedTab === SpotTabType.ORDER_HISTORY && (
                <div className="switch-item">
                  <CheckboxItem
                    label={LANG(hideRevoke ? '展示所有已撤销' : '隐藏所有已撤销')}
                    info=""
                    value={hideRevoke}
                    onChange={value => Position.changeHideRevoke(value)}
                  />
                </div>
              )}
              {state.tableSelectedTab === SpotTabType.TRADE_HISTORY && (
                <div
                  className={clsx('switch-item', state.showFilterTab && 'active')}
                  onClick={() =>
                    setState(draft => {
                      draft.showFilterTab = !draft.showFilterTab;
                    })
                  }
                >
                  <Svg
                    src="/static/images/common/filter.svg"
                    width={14}
                    height={14}
                    color={`var(--text-${state.showFilterTab ? 'brand' : 'secondary'})`}
                  />
                  <span>{LANG('筛选')}</span>
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
            margin: 0;
            display: flex;
            align-items: center;
            padding: 0 1rem;
            color: var(--theme-font-color-3);
            border-bottom: 1px solid var(--fill_line_1);
            overflow-x: auto;
            overflow-y: hidden;
            white-space: nowrap;
            align-items: center;
            padding-bottom: 0;
            height: 2.5rem;
            li {
              font-weight: 500;
              margin-right: 20px;
              // padding: 7px 0;
              &.active {
                color: var(--brand);
                border: 0;
              }
              font-size: 12px;
              line-height: 2.5rem;
            }
          }
          .table-wrapper {
            margin-top: 0;
            .switch-wrapper {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 8px 1rem;
              border-bottom: 1px solid var(--fill_line_1);
              .switch-item {
                display: flex;
                align-items: center;

                span {
                  margin-left: 4px;
                  color: var(--text_2);
                  font-size: 12px;
                }
                :global(.checkbox) {
                  border: 1px solid var(--text_2);
                }
                :global(.ant-switch-checked) {
                  background: var(--skin-primary-color) !important;
                }
                :global(.ant-switch) {
                  background: var(--theme-background-color-disabled);
                }

                &.active {
                  span {
                    color: var(--text_brand);
                  }
                }
              }
              button {
                background: var(--text-white);
                color: var(--text_brand);
                cursor: pointer;
                height: 24px;
                text-align: center;
                border-radius: 1.5rem;
                // margin-left: 20px;
                user-select: none;
                font-size: 12px;
                border: 0.5px solid var(--text_brand);
                outline: none;
                padding: 0 1rem;
                :disabled {
                  color: #757575;
                  border: 0.5px solid #757575;
                  cursor: not-allowed;
                }
              }
            }
          }
          :global(.list-view .empty) {
            height: auto !important;
            :global(.empty-img-wrapper) {
              margin: 24px auto;
            }
          }
        }
        :global(.revoke-wrapper) {
          :global(.ant-modal-content),
          :global(.ant-modal-header),
          :global(.ant-modal-body),
          :global(.ant-modal-footer) {
            background: var(--fill_pop)!important;
          }
        }
      `}</style>
    </>
  );
};

export default OrderList;
