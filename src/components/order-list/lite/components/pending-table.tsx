import { Loading } from '@/components/loading';
import { ScaleText } from '@/components/scale-text';
import { cancelLitePlanOrderApi } from '@/core/api';
import { FORMULAS } from '@/core/formulas';
import { useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Account, Lite, LoadingType, PositionSide, TPlanCommission } from '@/core/shared';
import { MediaInfo, message } from '@/core/utils';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import css from 'styled-jsx/css';
import RecordList from '../../components/record-list';
import Clipboard from './clipboard';
import ClipboardItem from '@/components/clipboard-item';
import { useLiteDeferState } from '@/core/hooks/src/use-lite-defer-state';
import { DesktopOrTablet, Mobile } from '@/components/responsive';
import { EmptyComponent } from '@/components/empty';
import { clsx } from '@/components/modal/wallet-form-modal/styled';
import { ItemHeader, ItemStatistics } from './pending-item';

const Position = Lite.Position;
const Trade = Lite.Trade;
const PendingTable = () => {
  const { pendingList, loading, hideOther } = Position.state;
  const { liteMap, showDeferStatus } = useLiteDeferState();
  const { id } = Trade.state;
  const { theme } = useTheme();
  const isLogin = Account.isLogin;
  const onRevokeBtnClicked = async (id: string) => {
    Position.pollingPending.stop();
    Loading.start();
    const res = await cancelLitePlanOrderApi(id);
    if (res.code === 200) {
      Position.fetchPendingList(LoadingType.Show).finally(() => {
        Position.pollingPending.start();
      });
      message.success(LANG('撤单委托已提交'));
    }
    await Trade.getBalance();
    Loading.end();
  };

  const tableList = useMemo(() => {
    if (isLogin) {
      return pendingList.filter(({ commodity }) => (hideOther ? commodity === id : true));
    }
    return [];
  }, [pendingList, hideOther, isLogin, id]);

  const columns = useMemo(() => {
    const col = [
      {
        title: LANG('合约'),
        dataIndex: 'contract',
        minWidth: 100,
        render: (_: any, { commodityName, currency, lever, buy }: TPlanCommission) => {
          return (
            <div className={`first-td flex ${buy ? 'raise' : 'fall'}`}>
              <span className="liteName">{commodityName?.replace(currency, '')}</span>
              <span className="liteMultiple">{lever}x</span>
            </div>
          );
        }
      },
      {
        title: LANG('保证金'),
        dataIndex: 'margin',
        minWidth: 100,
        render: (margin: number) => {
          return <span className="liteName">{margin} USDT</span>;
        }
      },
      {
        title: LANG('委托价'),
        minWidth: 100,
        dataIndex: 'triggerPrice',
        render: (triggerPrice: number, { currency }: TPlanCommission) => {
          return <span className="liteName">{triggerPrice}</span>;
        }
      },
      {
        title: LANG('委托成交价'),
        dataIndex: 'safetyPrice',
        minWidth: 100,
        render: (v: any, item: TPlanCommission) => {
          return (
            <span className={`liteSafetyPrice ${item.buy ? 'liteSafetyPricebuy' : 'liteSafetyPricesell'}`}>
              {item?.safetyPrice ? item?.safetyPrice?.toFormat(item.priceDigit) : '--'}
            </span>
          );
        }
        // ,
      },
      {
        title: `${LANG('止盈价')}/${LANG('强平价')}`,
        dataIndex: 'opPrice',
        minWidth: 100,
        render: (_: any, item: TPlanCommission) => {
          const { buy, triggerPrice, takeProfit, stopLoss, margin, lever, priceDigit } = item;
          const takeProfitRate = Number(takeProfit.div(margin));
          const stopLossRate = Number(stopLoss.div(margin));
          const Fprice = FORMULAS.LITE_POSITION.positionCalculateProfitPrice(
            buy ? PositionSide.LONG : PositionSide.SHORT,
            triggerPrice,
            takeProfitRate,
            lever
          );
          const Lprice = FORMULAS.LITE_POSITION.positionCalculateStopPrice(
            buy ? PositionSide.LONG : PositionSide.SHORT,
            triggerPrice,
            stopLossRate,
            lever
          );
          return (
            <div className="flex">
              <span className="liteName">{Fprice.toFormat(priceDigit)}</span>
              <span className="gray">{Lprice.toFormat(priceDigit)}</span>
            </div>
          );
        }
      },
      {
        title: LANG('挂单时间'),
        dataIndex: 'opTime',
        minWidth: 100,
        render: (_: any, { createTime }: TPlanCommission) => {
          return (
            <div className="flex">
              <span className="liteName">{dayjs(createTime).format('MM/DD HH:mm:ss')}</span>
            </div>
          );
        }
      },
      {
        title: LANG('订单号'),
        dataIndex: 'id',
        minWidth: 100,
        render: (id: string) => {
          return (
            <div className="liteOrderid">
              <span style={{}}>
                {id.slice(0, 5)}...
                {id.slice(id.length - 5)}
              </span>
              <Clipboard text={id} />
            </div>
          );
        }
      },
      {
        title: LANG('是否递延'),
        dataIndex: 'defer',
        minWidth: 100,
        render: (defer: boolean) => {
          return <span className="liteName">{defer ? LANG('是') : LANG('否')}</span>;
        }
      },
      {
        title: LANG('操作'),
        minWidth: 100,
        align: 'right',
        render: (_: any, { id }: TPlanCommission) => {
          return (
            <div className="operationWrapper">
              <button className="operationBtn settingBtn fix-v2-btn" onClick={() => onRevokeBtnClicked(id)}>
                {LANG('撤单')}
              </button>
            </div>
          );
        }
      }
    ];

    if (!showDeferStatus()) {
      const index = col.findIndex(item => item.dataIndex === 'defer');
      if (index >= 0) {
        col.splice(index, 1);
      }
    }
    return col;
  }, [liteMap]);

  return (
    <>
      <div className="container">
        <DesktopOrTablet>
          <RecordList
            loading={loading}
            columns={columns}
            data={isLogin ? tableList : []}
            className={`${theme} lite-pending-table`}
          />
        </DesktopOrTablet>
        <Mobile>
          <div className="list-view">
            {loading ? (
              <></>
            ) : tableList.length > 0 ? (
              tableList.map(item => {
                const {
                  id,
                  commodityName,
                  currency,
                  buy,
                  defer,
                  lever,
                  stopLoss,
                  margin,
                  triggerPrice,
                  takeProfit,
                  priceDigit,
                  safetyPrice,
                  createTime
                } = item;
                const takeProfitRate = Number(takeProfit.div(margin));
                const stopLossRate = Number(stopLoss.div(margin));
                const fPrice = FORMULAS.LITE_POSITION.positionCalculateProfitPrice(
                  buy ? PositionSide.LONG : PositionSide.SHORT,
                  triggerPrice,
                  takeProfitRate,
                  lever
                );
                const lPrice = FORMULAS.LITE_POSITION.positionCalculateStopPrice(
                  buy ? PositionSide.LONG : PositionSide.SHORT,
                  triggerPrice,
                  stopLossRate,
                  lever
                );
                return (
                  <div key={id} className="pending-item">
                    <ItemHeader
                      name={commodityName}
                      isBuy={buy}
                      lever={lever}
                      revokeOrder={() => onRevokeBtnClicked(id)}
                    />
                    <ItemStatistics
                      id={id}
                      triggerPrice={triggerPrice.toFormat(priceDigit)}
                      safetyPrice={safetyPrice ? safetyPrice.toFormat(priceDigit) : '--'}
                      margin={margin.toFormat(0)}
                      currency={currency}
                      opTime={dayjs(createTime).format('YYYY-MM-DD HH:mm')}
                      lPrice={lPrice.toFormat(priceDigit)}
                      fPrice={fPrice.toFormat(priceDigit)}
                      defer={defer}
                    />
                  </div>
                );
              })
            ) : (
              <EmptyComponent text={LANG('暂无数据')} active className={clsx('empty')} />
            )}
          </div>
        </Mobile>
      </div>
      <style jsx>{styles}</style>
    </>
  );
};

export default PendingTable;
const styles = css`
  :global(.liteName) {
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    color: var(--text_1);
  }
  :global(.liteMultiple) {
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    color: var(--text_1);
  }
  :global(.liteSafetyPrice) {
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    color: var(--color-green);
  }
  :global(.liteSafetyPricebuy) {
    color: var(--color-green);
  }
  :global(.liteSafetyPricesell) {
    color: var(--color-red);
  }

  :global(.liteOrderid) {
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    color: var(--text_1);
    display: flex;
    align-items: end;
    gap: 8px;
  }

  :global(.copyIcon) {
    margin-left: 8px;
  }

  :global(.lite-pending-table) {
    :global(.ant-table-fixed-header) {
      background: transparent !important;
    }
    :global(.ant-table-cell) {
      color: var(--text_3) !important;
      border-bottom: 1px solid var(--fill_line_1) !important;
    }
    :global(.ant-table-row) {
      :global(td) {
        padding: 2px 5px !important;
        padding-left: 0 !important;
        font-size: 14px;
        color: #666 !important;
        font-weight: 500;
        height: 52px;
        &:first-child {
          padding-top: 0 !important;
          padding-bottom: 0 !important;
        }
      }
    }
    :global(.first-td) {
      position: relative;
      padding-left: 20px;
      :global(span) {
        &:last-child {
          font-size: 12px;
          margin-top: 4px;
        }
      }
      &:before {
        position: absolute;
        display: block;
        content: '';
        width: 3px;
        height: 24px;
        left: 1px;
        background: 0 0;
        border-top: 2.4px solid transparent;
        border-bottom: 2.4px solid transparent;
        border-right: 2.4px solid transparent;
      }
    }
    :global(.first-td.raise) {
      color: inherit;
      &:before {
        border-left: 3px solid var(--color-green);
      }
    }
    :global(.first-td.fall) {
      color: inherit;
      &:before {
        border-left: 3px solid var(--color-red);
      }
    }
    :global(.flex) {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    :global(.gray) {
      color: var(--Color-Brand-yellow, #f0ba30);
      margin-top: 8px;
    }
    :global(.yellow) {
      color: var(--skin-primary-color);
    }
    :global(.operationWrapper) {
      float: right;
      display: flex;
      jusitify-conent: flex-end;
      align-items: center;
      :global(.operationBtn) {
        width: 52px;
        height: 24px;
        padding: 0px 8px;
        margin-right: 17px;
        cursor: pointer;
        border-radius: 22px;
        background: var(--Color-Brand-brand, #07828b);
        color: var(--text_1);
        min-width: 50px;
      }
      :global(.settingBtn) {
        background: var(--Color-Brand-brand, #07828b);
        border: none;
        color: var(--text_white);
      }
    }
  }
  :global(.dark .ant-table-row) {
    :global(td) {
      color: #c7c7c7 !important;
      border-bottom: 1px solid var(--fill_line_1);
    }
  }
  @media ${MediaInfo.mobile} {
    .list-view {
      padding: 12px 1rem;
      height: auto;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding-bottom: 4.5rem;
      .pending-item {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
    }
  }
`;
