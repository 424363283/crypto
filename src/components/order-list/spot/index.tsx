import { Loading } from '@/components/loading';
import { AlertFunction } from '@/components/modal';
import { ScrollXWrap } from '@/components/scroll-x-wrap';
import { closeSpotOrderApi } from '@/core/api';
import { useRouter, useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Account, LIST_TYPE, LoadingType, Spot, SpotTabType, TRADE_TAB } from '@/core/shared';
import { getActive, message } from '@/core/utils';
import { Switch } from 'antd';
import { useState ,   useCallback, useEffect, useMemo } from 'react';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';
import { UnLoginView } from '../components/un-login-view';
import FundsTable from './components/funds-table';
import GridTable from './components/grid-table';
import InvestTable from './components/invest-table';
import OrderHistoryTable from './components/order-history-table';
import OrderTable from './components/order-table';
import TradeHistoryTable from './components/trade-history-table';
import Radio from '@/components/Radio';
import YModal from '@/components/YModal';
import YIcon from '@/components/YIcons';
import Image from 'next/image';
import { SpotCancelAllModal } from './components/spot-cancel-all-modal';

// Lester: 临时 hack 一下委托类型
export const isLimitType = (type: number) => {
  return type === 0 || type === 2;
};

const { Position, Strategy, Trade } = Spot;

export const Index = () => {
  const id = useRouter().query.id as string;
  const { theme } = useTheme();
  const [state, setState] = useImmer({
    tableSelectedTab: SpotTabType.ORDER
  });

  const isLogin = Account.isLogin;

  const { orderList, hideOther, hideRevoke, hideMinimal, spotGridList, spotInvestList } = Position.state;
  const { selectType } = Strategy.state;
  const { tradeTab } = Trade.state;

  const [modelVisble, setModelVisble] = useState(false);

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
    if (tradeTab === TRADE_TAB.SPOT) {
      setState(draft => {
        draft.tableSelectedTab = SpotTabType.ORDER;
      });
      Strategy.changeSelectType(null);
    }
    return () => {
      Position.pollingPosition.stop();
      Position.pollingGrid.stop();
      Position.pollingInvest.stop();
    };
  }, [selectType, tradeTab]);

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
        return <TradeHistoryTable />;
      case SpotTabType.FUNDS:
        return <FundsTable />;
      case SpotTabType.GRID_RUNNING:
      case SpotTabType.GRID_STOP:
        return <GridTable type={state.tableSelectedTab} />;
      case SpotTabType.INVEST_RUNNING:
      case SpotTabType.INVEST_STOP:
        return <InvestTable type={state.tableSelectedTab} />;
    }
  }, [state.tableSelectedTab]);


  const submit= async ()=>{
    Loading.start();
    const orderIds = filterOrderList.map((item: any) => item.id);
    const result = await closeSpotOrderApi(orderIds);
    if (result.code === 200) {
      message.success(LANG('撤单成功'));
      Position.fetchPositionList(LoadingType.Show);
      setModelVisble(false)
    } else {
      message.error(result.message);
    }
    Loading.end();
  }

  return (
    <>
      <div className={`${theme} container`}>
        <ScrollXWrap wrapClassName="tabWrapper">
          <ul>
            {tabs.map(({ label, value }) => (
              <li
                key={label}
                className={getActive(value === state.tableSelectedTab)}
                onClick={() => {
                  setState(draft => {
                    draft.tableSelectedTab = value;
                  });
                  Position.resetCommissionType();
                }}
              >
                {label}
              </li>
            ))}
          </ul>
          {isLogin && (
            <div className="operationWrapper">
              {state.tableSelectedTab === SpotTabType.ORDER_HISTORY && (
                <div>
                  <Radio
                    label={LANG(hideRevoke ? '展示所有已撤销' : '隐藏所有已撤销')}
                    checked={hideRevoke ?? false}
                    onChange={checked => Position.changeHideRevoke(checked)}
                  />

                  {/* <span>{LANG('隐藏所有已撤销')}</span> */}
                </div>
              )}
              {selectType !== LIST_TYPE.INVEST && (
                <>
                  {state.tableSelectedTab !== SpotTabType.FUNDS ? (
                    <div>
                      <Radio
                        label={LANG(hideOther ? '展示其他交易对' : '隐藏其他交易对')}
                        checked={hideOther ?? false}
                        onChange={checked => Position.changeHideOrder(checked)}
                      />
                    </div>
                  ) : (
                    <div>
                      <Radio
                        label={LANG(hideMinimal ? '展示小额币种' : '隐藏小额币种')}
                        checked={hideMinimal ?? false}
                        onChange={checked => Position.changeHideMinimal(checked)}
                      />
                    </div>
                  )}
                </>
              )}
              {state.tableSelectedTab === SpotTabType.ORDER && (
                <button disabled={filterOrderList.length === 0} 
                // onClick={onBatchRevokeClicked}

                onClick={
                  ()=>{
                    setModelVisble(true)
                  }
                }
                >
                  {LANG('一键撤销')}
                </button>
              )}
            </div>
          )}
        </ScrollXWrap>
        {isLogin ? renderTable() : <UnLoginView />}

        <div>
          <SpotCancelAllModal open={modelVisble} onClose={()=>setModelVisble(false)} submit={submit} />
          {/* <YModal
            open={modelVisble}
            width={480}
            header={
              <>
                <div className="spot_YModalHeader" >
                  <div className="spot_YModalHeaderTitle">
                    {
                      LANG('提示')
                    }
                  </div>
                  <YIcon.CloseOutlined className="close-btn" 
                  
                  onClick={
                    ()=>{
                      setModelVisble(false)
                    }
                  }
              
                  
                  />
                </div>
              </>
            }
            content={
              <>
                <div className="spot_YModalContent">
                  <Image
                    className="spot_YModalImg"
                    src="/static/images/common/v2_alert_warning.png"
                    alt=""
                    width={60}
                    height={60}
                  />

                  <p className="spot_YModalDes">{LANG('是否一键撤销所有挂单')}</p>
                </div>
              </>
            }
            footer={
              <>
                <div className="spot_YModalFooterBtn" 
                   onClick={
                    ()=>{
                      submit()
                    }
                  }
                
                >{LANG('确认')}</div>
              </>
            }
          /> */}
        </div>
      </div>
      <style jsx>{styles}</style>
    </>
  );
};
export default Index;

const styles = css`
  .spot_YModalHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
    width: 100%;
    .spot_YModalHeaderTitle {
      flex: 1;
      display: block;
    }
    .close-btn {
      font-size: 16px;
    }
  }
  .spot_YModalContent {
    display: flex;
    flex-direction: column;
    align-items: center; // Center horizontally
    justify-content: center; // Center vertically
    width: 100%;
    img {
      margin: auto;
      display: block;
    }
    .spot_YModalDes {
      text-align: center;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      color: var(--text-secondary);
      margin-top: 16px;
    }
  }
  .spot_YModalFooterBtn {
    width: 100%;
    height: 48px;
    border-radius: 40px;
    background: var(--text-brand);
    color: #fff;
    text-align: center;
    line-height: 48px;
    cursor: pointer;
  }
  .spot_YModalImg {
    width: 60px;
    height: 60px;
    margin: auto;
    display: block;
  }
  .container {
    height: 100%;
    :global(.tabWrapper) {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--line-1);
      padding: 10px;
      padding-left: 20px;
      height: 48px;
      ul {
        padding: 0;
        margin: 0;
        display: flex;
        align-items: center;
        position: relative;
        li {
          font-weight: 400;
          position: relative;
          font-size: 14px;
          user-select: none;
          cursor: pointer;
          color: var(--text-secondary);
          margin-right: 25px;
          &.active {
            color: var(--brand) !important;
            font-weight: 500;
            &:after {
              /* position: absolute;
              content: '';
              width: 100%;
              height: 2px;
              background: var(--skin-primary-color);
              bottom: -15px;
              left: 0; */
            }
          }
        }
      }
      .operationWrapper {
        display: flex;
        :global(.ant-switch-checked) {
          background: var(--skin-color-active) !important;
        }
        div {
          display: flex;
          align-items: center;
          margin-left: 10px;
          span {
            margin-left: 5px;
            color: var(--theme-font-color-3);
            user-select: none;
            font-size: 14px;
            cursor: default;
            font-weight: 400;
          }
        }
        button {
          background: var(--text-brand);
          color: #fff;
          cursor: pointer;
          padding: 5px 16px;
          text-align: center;
          border-radius: 4px;
          font-size: 12px;
          font-style: normal;
          font-weight: 400;
          margin-left: 24px;
          border: none;
          border-radius: 24px;

          outline: none;
          :disabled {
            color: #fff;
            cursor: not-allowed;
          }
        }
      }
      :global(.ant-switch) {
        background: var(--theme-background-color-disabled);
      }
    }
  }
`;
