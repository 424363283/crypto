import { Loading } from '@/components/loading';
import { AlertFunction } from '@/components/modal/alert-function';
import Radio from '@/components/Radio';
import { SubButton } from '@/components/trade-ui/trade-view/components/button';
import YIcon from '@/components/YIcons';
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
        title: LANG('一键平仓'),
        okText: LANG('确认'),
        className: "batchCustomAlert",
        hideHeaderIcon: true,
        cancelText: "",
        closable: true,
        cancelButtonProps: { style: { display: 'none' } },
        description: (
          <div className={theme}>
            <div className='reverse-title'>
              <YIcon.warningIcon />
              {LANG('是否一键平仓所有订单')}
            </div>
          </div >
        ),
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
      title: LANG('一键撤销'),
      className: "batchCustomAlert",
      hideHeaderIcon: true,
      cancelText: "",
      closable: true,
      cancelButtonProps: { style: { display: 'none' } },
      okText: LANG('确认'),
      description: (
        <div className={theme}>
          <div className='reverse-title'>
            <YIcon.warningIcon />
            {LANG('是否一键撤销所有挂单')}
          </div>
        </div >
      ),
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
            {selectedTab !=4 ?
              <div className='liteHeaderRightBtn'>
                <Radio
                  label={LANG(hideOther? '展示其他交易对' : '隐藏其它交易对')}
                  checked={hideOther}
                  onChange={(checked) => {
                    Position.changeHideOrder(checked);
                  }}
                />
              </div>
              :null}  
            <div>
              {/* <Switch
                size='small'
                checked={hideOther}
                onChange={(checked) => {
                  Position.changeHideOrder(checked);
                }}
              />
              <span>{LANG('隐藏其它交易对')}</span> */}
            </div>
            {isPosition && filterPositionList.length ?
              // <button disabled={filterPositionList.length === 0} onClick={onBatchClosePositionClicked}>
              //   {LANG('一键全平')}
              // </button>

              <SubButton className={'cancelAll'} onClick={onBatchClosePositionClicked}>
                {LANG('一键全平')}
              </SubButton>
              : null
            }
            {selectedTab === LiteTabType.PENDING && filterPendingList.length > 0 ?
              <SubButton className={'cancelAll'} onClick={onBatchRevokeClicked}>
                {LANG('一键撤销')}
              </SubButton>
              : null}
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
      height: 48px;
      align-items: center;
      padding:0 24px 0 0;
      border:1px solid  var(--fill_line_1);
      ul {
        padding: 0;
        margin: 0;
        display: flex;
        align-items: center;
        position: relative;
        height: 48px;
        gap:24px;
        padding:0 24px;
        li {
          font-weight: bold;
          position: relative;
          margin: 0 1px;
          font-size: 14px;
          user-select: none;
          cursor: pointer;
          color: var(--theme-font-color-2);
          font-weight: 400;
          &.active {
            color: var(--text_brand) !important;


            /* &:after {
              position: absolute;
              content: '';
              width: 100%;
              height: 2px;
              background: var(--skin-primary-color);
              bottom: -12px;
              left: 0;
            } */
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
            color: #fff;
            cursor: not-allowed;
          }
        }
        :global(.cancelAll){
          cursor: pointer;
          display: flex;
          height: 24px;
          justify-content: center;
          align-items: center;
          border-radius: 24px;
          background: var(--text_brand);
          color: var(--text_white);
          font-size: 12px;
          font-weight: 400;
          margin:0 0 0 24px;
        }
        .cancelAll{
          cursor: pointer;
          display: flex;
          height: 24px;
          justify-content: center;
          align-items: center;
          border-radius: 24px;
          background: var(--text_brand);
          color: var(--text_white);
          font-size: 12px;
          font-weight: 400;
          margin:0 0 0 24px;
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
  :global(.batchCustomAlert){
    :global(.alert-title,.reverse-title,.reverse-description,.reverse-tips){
      text-align:left !important;
    }
    :global(.ant-modal-close){
      color:var(--text_2);
      width:24px;
      height:24px;
      top:24px;
      right:24px;
      &:hover{
        color:var(--text_2);
        background:transparent !important;
      }
    }
    :global(.ant-modal-content){
      padding:24px !important;
      border-radius: 24px !important;
    }
    :global(.ant-modal-body){
      background:transparent !important;
    }
    :global(.alert-content){
      padding:0 !important;
      margin:0 auto !important;
      width:100%;
    }
    :globla(.reverse-title){
      padding:40px 0;
      color: var(--text_1);
      font-size: 14px;
      font-weight: 400;
      display:flex;
      display: flex;
      align-items: center;
      gap: 4px;
      justify-content: center;
    }
    :global(.reverse-description){
      margin:0;
      color: var(--text_2);
      font-size: 14px;
      font-weight: 400;
      line-height: 150%; /* 21px */
    }
    :global(.reverse-tips){
      color: var(--yellow);
      font-size: 12px;
      font-weight: 400;
      line-height: 150%; /* 18px */
      margin:24px 0;
      :global(span){
        margin:3px 0 0;
        display:inline-block;
        vertical-align:middle;
      
      }
    }
    :global(.alert-description){
      padding: 0;
      text-align:center !important;
      color: var(--text_1);
      font-size: 14px;
      font-weight: 400;
      line-height: 150%; /* 21px */
    }
    :global(.ant-modal-footer){
      margin-top:0 !important;
      background:transparent !important;
    }
    :global(.ant-btn-primary){
      border-radius: 40px;
      background: var(--text_brand);
      color: var(--text_white);
      font-size: 16px;
      font-weight: 500;
    }
  }
`;
