import { Loading } from '@/components/loading';
import { AlertFunction } from '@/components/modal/alert-function';
import { GradienScrollRow } from '@/components/gradien-scroll-row';
import Radio from '@/components/Radio';
import YIcon from '@/components/YIcons';
import { cancelLitePlanOrderApi } from '@/core/api';
import { useTheme, useResponsive, useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Account, AccountType, Lite, LiteTabType } from '@/core/shared';
import { getActive, MediaInfo, message } from '@/core/utils';
import { resso } from '@/core/resso';

import { useCallback, useEffect, useMemo } from 'react';
import { useImmer } from 'use-immer';
import css from 'styled-jsx/css';
import FundsTable from './components/funds-table';
import HistoryTable from './components/history-table';
import PendingTable from './components/pending-table';
import PositionTable from './components/position-table';
import { Button } from '@/components/button';
import { Size } from '@/components/constants';
import { BottomModal, MobileModal } from '@/components/mobile-modal';
import { UnLoginView } from '../components/un-login-view';

const Trade = Lite.Trade;
const Position = Lite.Position;

export const Index = () => {
  const id = useRouter().query.id as string;
  const { accountType, closeConfirm } = Trade.state;
  const { selectedTab, positionList, pendingList, hideOther } = Position.state;
  const { theme } = useTheme();
  const { isMobile } = useResponsive();
  const [mobileModalState, setMobileModalState] = useImmer({
    closeModalVisible: false,
    revokeModalVisible: false
  });
  const isLogin = Account.isLogin;
  useEffect(() => {
    return () => {
      if (isMobile && isLogin) {
        Trade.destroy();
        Position.destroy();
      }
    };
  }, [id]);

  useEffect(() => {
    if (isMobile && isLogin) {
      Trade.init(id);
      Position.init();
      Lite.Info.init({ resso });
    }
  }, [id, isMobile, isLogin]);

  const isPosition = useMemo(() => {
    return selectedTab === LiteTabType.REAL || selectedTab === LiteTabType.SIMULATED;
  }, [selectedTab]);

  const filterPositionList = useMemo(() => {
    return positionList.filter(({ commodity }) => (isPosition && hideOther ? commodity === id : true));
  }, [positionList, id, isPosition, hideOther]);

  const filterPendingList = useMemo(() => {
    return pendingList.filter(({ commodity }) =>
      selectedTab === LiteTabType.PENDING && hideOther ? commodity === id : true
    );
  }, [pendingList, id, hideOther]);

  const tabs = useMemo(() => {
    const TABS = [
      {
        label: `${LANG('实盘持仓')}(${isLogin ? filterPositionList.length : 0})`,
        value: LiteTabType.REAL
      },
      {
        label: `${LANG('模拟持仓')}(${isLogin ? filterPositionList.length : 0})`,
        value: LiteTabType.SIMULATED
      },
      {
        label: `${LANG(isMobile ? '计划委托' : '当前委托')}(${isLogin ? filterPendingList.length : 0})`,
        value: LiteTabType.PENDING
      },
      {
        label: LANG('历史成交'),
        value: LiteTabType.HISTORY
      },
      {
        label: LANG('资金流水'),
        value: LiteTabType.FUNDS
      }
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
  }, [accountType, filterPositionList, filterPendingList, isLogin]);

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

  useEffect(() => {
    if (accountType === AccountType.REAL || accountType === AccountType.TRIAL) {
      Position.changeSelectedTab(LiteTabType.REAL);
    } else {
      Position.changeSelectedTab(LiteTabType.SIMULATED);
    }
  }, [accountType]);

  const onBatchClosePositionClicked = useCallback(() => {
    if (closeConfirm) {
      if (!isMobile) {
        AlertFunction({
          title: LANG('一键平仓'),
          okText: LANG('确认'),
          className: 'batchCustomAlert',
          hideHeaderIcon: true,
          cancelText: '',
          closable: true,
          cancelButtonProps: { style: { display: 'none' } },
          description: (
            <div className={theme}>
              <div className="reverse-title">
                <YIcon.warningIcon />
                {LANG('是否一键平仓所有订单')}
              </div>
            </div>
          ),
          onOk: async () => {
            Position.batchClosePositionByIds();
          },
          theme,
          v2: true
        });
      } else {
        setMobileModalState(draft => {
          draft.closeModalVisible = true;
        });
      }
    } else {
      Position.batchClosePositionByIds();
    }
  }, [closeConfirm, theme, isMobile]);

  const onBatchRevokeClicked = useCallback(() => {
    if (!isMobile) {
      AlertFunction({
        title: LANG('一键撤销'),
        className: 'batchCustomAlert',
        hideHeaderIcon: true,
        cancelText: '',
        closable: true,
        cancelButtonProps: { style: { display: 'none' } },
        okText: LANG('确认'),
        description: (
          <div className={theme}>
            <div className="reverse-title">
              <YIcon.warningIcon />
              {LANG('是否一键撤销所有挂单')}
            </div>
          </div>
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
                failNumber: failureNum
              })
            );
          } else {
            message.error(result.message);
          }
          Loading.end();
        },
        theme
      });
    } else {
      setMobileModalState(draft => {
        draft.revokeModalVisible = true;
      });
    }
  }, [theme, filterPendingList, isMobile]);

  return (
    <>
      <div className={`${theme} container`}>
        <div className="tabWrapper">
          <GradienScrollRow>
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
          </GradienScrollRow>
          <div className="operationWrapper">
            {selectedTab != 4 || isMobile ? (
              <div className="liteHeaderRightBtn">
                <Radio
                  label={LANG(hideOther ? '展示其他交易对' : '隐藏其它交易对')}
                  checked={hideOther}
                  width={18}
                  height={18}
                  onChange={checked => {
                    Position.changeHideOrder(checked);
                  }}
                />
              </div>
            ) : null}
            {/* <div>
              <Switch
                size='small'
                checked={hideOther}
                onChange={(checked) => {
                  Position.changeHideOrder(checked);
                }}
              />
              <span>{LANG('隐藏其它交易对')}</span>
            </div> */}
            {isPosition && filterPositionList.length > 0 ? (
              // <button disabled={filterPositionList.length === 0} onClick={onBatchClosePositionClicked}>
              //   {LANG('一键全平')}
              // </button>
              <Button
                type="brand"
                size={isMobile ? Size.XS : Size.SM}
                hover={false}
                outlined
                rounded
                onClick={onBatchClosePositionClicked}
              >
                {LANG('一键全平')}
              </Button>
            ) : null}
            {selectedTab === LiteTabType.PENDING && filterPendingList.length > 0 ? (
              <Button
                type="brand"
                size={isMobile ? Size.XS : Size.SM}
                hover={false}
                outlined
                rounded
                onClick={onBatchRevokeClicked}
              >
                {LANG('一键撤销')}
              </Button>
            ) : null}
          </div>
        </div>
        {isLogin ? renderTable() : <UnLoginView />}
        {isMobile && (
          <>
            <MobileModal
              visible={mobileModalState.closeModalVisible}
              onClose={() =>
                setMobileModalState(draft => {
                  draft.closeModalVisible = false;
                })
              }
              type="bottom"
            >
              <BottomModal
                title={LANG('一键平仓')}
                confirmText={LANG('确认')}
                onConfirm={async () => {
                  Position.pollingPosition.stop();
                  Position.batchClosePositionByIds().finally(() => {
                    Position.pollingPosition.start();
                    setMobileModalState(draft => {
                      draft.closeModalVisible = false;
                    });
                  });
                }}
              >
                <div className="reverse-title">
                  <YIcon.warningIcon />
                  {LANG('是否一键平仓所有订单')}?
                </div>
              </BottomModal>
            </MobileModal>
            <MobileModal
              visible={mobileModalState.revokeModalVisible}
              onClose={() =>
                setMobileModalState(draft => {
                  draft.revokeModalVisible = false;
                })
              }
              type="bottom"
            >
              <BottomModal
                title={LANG('一键撤销')}
                confirmText={LANG('确认')}
                onConfirm={async () => {
                  Position.pollingPending.stop();
                  Loading.start();
                  const orderIds = filterPendingList.map((item: any) => item.id);
                  const result = await cancelLitePlanOrderApi(orderIds);
                  setMobileModalState(draft => {
                    draft.revokeModalVisible = false;
                  });
                  if (result.code === 200) {
                    await Trade.getBalance();
                    const { successNum, failureNum } = result.data;
                    message.success(
                      LANG(`撤销成功,成功{successNumber}单，失败{failNumber}单`, {
                        successNumber: successNum,
                        failNumber: failureNum
                      })
                    );
                    Position.pollingPending.start();
                  } else {
                    message.error(result.message);
                  }
                  Loading.end();
                }}
              >
                <div className="reverse-title">
                  <YIcon.warningIcon />
                  {LANG('是否一键撤销所有挂单')}?
                </div>
              </BottomModal>
            </MobileModal>
          </>
        )}
      </div>
      <style jsx>{styles}</style>
    </>
  );
};

export default Index;
const styles = css`
  .container {
    min-height: 400px;
    @media ${MediaInfo.mobile} {
      min-height: auto;
    }
    .tabWrapper {
      display: flex;
      justify-content: space-between;
      height: 48px;
      align-items: center;
      padding: 0 24px 0 0;
      border: 1px solid var(--fill_line_1);
      @media ${MediaInfo.mobile} {
        width: 100%;
        padding: 0;
        flex-direction: column;
        align-items: stretch;
        border: 0;
        height: auto;
      }
      ul {
        padding: 0;
        margin: 0;
        display: flex;
        align-items: center;
        position: relative;
        height: 48px;
        gap: 24px;
        padding: 0 24px;
        @media ${MediaInfo.mobile} {
          display: -webkit-box;
          height: 2.5rem;
          padding: 0 1rem;
          border-bottom: 1px solid var(--fill_line_1);
        }
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
          @media ${MediaInfo.mobile} {
            font-weight: 500;
            color: var(--text_2);
            margin-right: 1.25rem;
            &:last-child {
              margin-right: 0;
              padding-right: 1rem;
            }
          }
        }
      }
      .operationWrapper {
        display: flex;
        align-items: center;
        gap: 24px;
        :global(.ant-switch-checked) {
          background: var(--skin-primary-color) !important;
        }
        @media ${MediaInfo.mobile} {
          justify-content: space-between;
          padding: 8px 1rem;
          border-bottom: 1px solid var(--fill_line_1);
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
        :global(.cancelAll) {
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
          margin: 0 0 0 24px;
          @media ${MediaInfo.mobile} {
            width: 5rem;
            margin: 0;
            flex: none;
            border: 1px solid var(--brand);
            color: var(--text_brand);
            background: var(--text_white);
          }
        }
        .cancelAll {
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
          margin: 0 0 0 24px;
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
  :global(.batchCustomAlert) {
    :global(.alert-title, .reverse-title, .reverse-description, .reverse-tips) {
      text-align: left !important;
    }
    :global(.ant-modal-close) {
      color: var(--text_2);
      width: 24px;
      height: 24px;
      top: 24px;
      right: 24px;
      &:hover {
        color: var(--text_2);
        background: transparent !important;
      }
    }
    :global(.ant-modal-content) {
      padding: 24px !important;
      border-radius: 24px !important;
    }
    :global(.ant-modal-body) {
      background: transparent !important;
    }
    :global(.alert-content) {
      padding: 0 !important;
      margin: 0 auto !important;
      width: 100%;
    }
    :global(.reverse-title) {
      padding: 40px 0;
      color: var(--text_1);
      font-size: 14px;
      font-weight: 400;
      display: flex;
      display: flex;
      align-items: center;
      gap: 4px;
      justify-content: center;
    }
    :global(.reverse-description) {
      margin: 0;
      color: var(--text_2);
      font-size: 14px;
      font-weight: 400;
      line-height: 150%; /* 21px */
    }
    :global(.reverse-tips) {
      color: var(--yellow);
      font-size: 12px;
      font-weight: 400;
      line-height: 150%; /* 18px */
      margin: 24px 0;
      :global(span) {
        margin: 3px 0 0;
        display: inline-block;
        vertical-align: middle;
      }
    }
    :global(.alert-description) {
      padding: 0;
      text-align: center !important;
      color: var(--text_1);
      font-size: 14px;
      font-weight: 400;
      line-height: 150%; /* 21px */
    }
    :global(.ant-modal-footer) {
      margin-top: 0 !important;
      background: transparent !important;
    }
    :global(.ant-btn-primary) {
      border-radius: 40px;
      background: var(--text_brand);
      color: var(--text_white);
      font-size: 16px;
      font-weight: 500;
    }
  }
  @media ${MediaInfo.mobile} {
    :global(.reverse-title) {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 1rem 0;
      gap: 4px;
      color: var(--text_1);
      font-size: 14px;
      font-weight: 400;
    }
  }
`;
