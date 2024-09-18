import { Loading } from '@/components/loading';
import { AlertFunction } from '@/components/modal/alert-function';
import { cancelLitePlanOrderApi } from '@/core/api';
import { useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Account, AccountType, Lite, LiteTabType } from '@/core/shared';
import { getActive, message } from '@/core/utils';
import { Switch } from 'antd';
import { useCallback, useEffect, useMemo } from 'react';
import css from 'styled-jsx/css';
import FundsTable from './components/funds-table';
import HistoryTable from './components/history-table';
import PendingTable from './components/pending-table';
import PositionTable from './components/position-table';

const Trade = Lite.Trade;
const Position = Lite.Position;

export const Index = () => {
  const { accountType, id, closeConfirm } = Trade.state;
  const { selectedTab, positionList, pendingList, hideOther } = Position.state;
  const { theme } = useTheme();
  const isLogin = Account.isLogin;

  const filterPositionList = useMemo(() => {
    return positionList.filter(({ commodity }) => (hideOther ? commodity === id : true));
  }, [positionList, id, hideOther]);

  const filterPendingList = useMemo(() => {
    return pendingList.filter(({ commodity }) => (hideOther ? commodity === id : true));
  }, [pendingList, id, hideOther]);

  const tabs = useMemo(() => {
    const TABS = [
      {
        label: `${LANG('实盘持仓')}(${isLogin ? filterPositionList.length : 0})`,
        value: LiteTabType.REAL,
      },
      {
        label: `${LANG('模拟持仓')}(${isLogin ? filterPositionList.length : 0})`,
        value: LiteTabType.SIMULATED,
      },
      {
        label: `${LANG('计划委托')}(${isLogin ? filterPendingList.length : 0})`,
        value: LiteTabType.PENDING,
      },
      {
        label: LANG('历史成交'),
        value: LiteTabType.HISTORY,
      },
      {
        label: LANG('资金流水'),
        value: LiteTabType.FUNDS,
      },
    ];
    const immunityTab = TABS.slice(-2);
    switch (accountType) {
      case AccountType.REAL:
        return [TABS[0], TABS[2]].concat(immunityTab);
      case AccountType.SIMULATED:
        return [TABS[1]].concat(immunityTab);
      case AccountType.TRIAL:
        return [TABS[0], TABS[2]].concat(immunityTab);
    }
  }, [accountType, filterPositionList, isLogin]);

  const renderTable = useCallback(() => {
    switch (selectedTab) {
      case LiteTabType.REAL:
      case LiteTabType.SIMULATED:
        return <PositionTable />;
      case LiteTabType.PENDING:
        return <PendingTable />;
      case LiteTabType.HISTORY:
        return <HistoryTable />;
      case LiteTabType.FUNDS:
        return <FundsTable />;
    }
  }, [selectedTab]);

  const isPosition = useMemo(() => {
    return selectedTab === LiteTabType.REAL || selectedTab === LiteTabType.SIMULATED;
  }, [selectedTab]);

  useEffect(() => {
    if (accountType === AccountType.REAL || accountType === AccountType.TRIAL) {
      Position.changeSelectedTab(LiteTabType.REAL);
    } else {
      Position.changeSelectedTab(LiteTabType.SIMULATED);
    }
  }, [accountType]);

  const onBatchClosePositionClicked = useCallback(() => {
    if (closeConfirm) {
      AlertFunction({
        title: LANG('提示'),
        content: LANG('是否一键平仓所有订单'),
        okText: LANG('确认'),
        onOk: async () => {
          Position.batchClosePositionByIds();
        },
        theme,
        v2: true,
      });
    } else {
      Position.batchClosePositionByIds();
    }
  }, [closeConfirm, theme]);

  const onBatchRevokeClicked = useCallback(() => {
    AlertFunction({
      title: LANG('提示'),
      content: LANG('是否一键撤销所有挂单'),
      okText: LANG('确认'),
      v2: true,
      onOk: async () => {
        Loading.start();
        const orderIds = filterPendingList.map((item: any) => item.id);
        const result = await cancelLitePlanOrderApi(orderIds);
        if (result.code === 200) {
          const { successNum, failureNum } = result.data;
          message.success(
            LANG(`撤销成功,成功{successNumber}单，失败{failNumber}单`, {
              successNumber: successNum,
              failNumber: failureNum,
            })
          );
        } else {
          message.error(result.message);
        }
        Loading.end();
      },
      theme,
    });
  }, [theme, filterPendingList]);

  return (
    <>
      <div className={`${theme} container`}>
        <div className='tabWrapper'>
          <ul>
            {tabs.map(({ label, value }) => (
              <li
                key={label}
                className={getActive(value === selectedTab)}
                onClick={() => Position.changeSelectedTab(value)}
              >
                {label}
              </li>
            ))}
          </ul>
          <div className='operationWrapper'>
            <div>
              <Switch
                size='small'
                checked={hideOther}
                onChange={(checked) => {
                  Position.changeHideOrder(checked);
                }}
              />
              <span>{LANG('隐藏其它交易对')}</span>
            </div>
            {isPosition && (
              <button disabled={filterPositionList.length === 0} onClick={onBatchClosePositionClicked}>
                {LANG('一键平仓')}
              </button>
            )}
            {selectedTab === LiteTabType.PENDING && (
              <button disabled={filterPendingList.length === 0} onClick={onBatchRevokeClicked}>
                {LANG('一键撤销')}
              </button>
            )}
          </div>
        </div>
        {renderTable()}
      </div>
      <style jsx>{styles}</style>
    </>
  );
};

export default Index;
const styles = css`
  .container {
    min-height: 400px;
    .tabWrapper {
      display: flex;
      justify-content: space-between;
      height: 42px;
      align-items: center;
      ul {
        padding: 0;
        margin: 0;
        display: flex;
        align-items: center;
        position: relative;
        height: 42px;
        padding-left: 5px;
        li {
          font-weight: bold;
          position: relative;
          margin: 0 15px;
          font-size: 14px;
          user-select: none;
          cursor: pointer;
          color: var(--theme-font-color-2);
          &.active {
            color: var(--skin-primary-color) !important;
            &:after {
              position: absolute;
              content: '';
              width: 100%;
              height: 2px;
              background: var(--skin-primary-color);
              bottom: -12px;
              left: 0;
            }
          }
        }
      }
      .operationWrapper {
        display: flex;
        :global(.ant-switch-checked) {
          background: var(--skin-primary-color) !important;
        }
        div {
          display: flex;
          align-items: center;
          span {
            margin-left: 17px;
            color: #676666;
            user-select: none;
            font-size: 12px;
            cursor: default;
            margin-right: 10px;
            font-weight: 500;
          }
        }
        button {
          background: linear-gradient(90deg, #ffcd6d, #ffb31f);
          cursor: pointer;
          height: 24px;
          text-align: center;
          border-radius: 4px;
          font-weight: 500;
          margin-left: 20px;
          margin-right: 15px;
          color: #fff;
          user-select: none;
          font-size: 12px;
          border: none;
          outline: none;
          :disabled {
            background: #edeff2;
            color: #757575;
            cursor: not-allowed;
          }
        }
      }
      :global(.ant-switch) {
        background: #6f7a8f;
      }
    }
    &.dark {
      .operationWrapper {
        div {
          span {
            color: var(--theme-font-color-1) !important;
          }
        }
        button {
          color: #333 !important;
          :disabled {
            background: var(--theme-trade-tips-color) !important;
            color: #757575 !important;
          }
        }
      }
    }
  }
`;
