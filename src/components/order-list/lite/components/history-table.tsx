import { useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Account, Lite, LiteListItem } from '@/core/shared';
import { DesktopOrTablet, Mobile } from '@/components/responsive';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useMemo } from 'react';
import css from 'styled-jsx/css';
import RecordList from '../../components/record-list';
import Clipboard from './clipboard';
import ShareModal from './share-modal';
import { ItemHeader, ItemStatistics } from './history-item';
import { EmptyComponent } from '@/components/empty';
import { clsx, MediaInfo } from '@/core/utils';

const Position = Lite.Position;
const Trade = Lite.Trade;

const getType = (item: LiteListItem) => {
  if (item.traderUsername !== null) {
    return (
      <>
        <span>{LANG('跟随____1')}:</span>
        <br />
        <span>{item.traderUsername}</span>
      </>
    );
  } else if (item.followCount && item.followCount > 0) {
    return (
      <>
        <span>{LANG('跟随人数')}:</span>
        <br />
        <span>{item.followCount}</span>
      </>
    );
  } else {
    return item.placeSource;
  }
};

const HistoryTable = () => {
  const { historyList, loading, hideOther, marketMap, shareModalData } = Position.state;
  const { id } = Trade.state;
  const { theme } = useTheme();
  const isLogin = Account.isLogin;

  const columns = [
    {
      title: LANG('合约'),
      dataIndex: 'contract',
      minWidth: 100,
      render: (_: any, { commodityName, currency, lever, buy }: LiteListItem) => {
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
        return <span className="liteName">{`${margin}`} USDT</span>;
      }
    },
    {
      title: LANG('仓位'),
      dataIndex: 'volume',
      minWidth: 100,
      render: (val: number) => {
        return <span className="liteName">{`${val}`}</span>;
      }
    },
    {
      title: `${LANG('开仓价')}/${LANG('平仓价')}`,
      dataIndex: 'opPrice',
      minWidth: 100,
      render: (_: any, { opPrice, cpPrice, priceDigit }: LiteListItem) => {
        return (
          <div className="flex">
            <span className="liteName">{opPrice?.toFormat(priceDigit)}</span>
            <span className="liteName gray">{cpPrice?.toFormat(priceDigit)}</span>
          </div>
        );
      }
    },
    {
      title: `${LANG('订单盈亏')}(${LANG('盈亏比')})`,
      dataIndex: 'income',
      minWidth: 100,
      render: (_: any, { income: oldIncome, margin }: LiteListItem) => {
        const income = Number((oldIncome || 0).toFixed(2)) + 0;
        const rate = Number(income.div(margin).mul(100));
        return (
          <div className={income >= 0 ? 'main-raise' : 'main-fall'}>
            <span>
              {income >= 0 ? '+' : ''}
              {income.toFixed(2)}
            </span>

            <p className="gray">
              {rate >= 0 ? '+' : ''}
              {rate.toFixed(2)}%
            </p>
          </div>
        );
      }
    },
    {
      title: `${LANG('止盈')}/${LANG('止损')}`,
      dataIndex: 'takeProfit',
      minWidth: 100,
      render: (_: any, { takeProfit, stopLoss }: LiteListItem) => {
        return (
          <div className="flex">
            <span className="liteName">{takeProfit.toFormat()}</span>
            <span className="liteName StopLoss">{stopLoss.toFormat()}</span>
          </div>
        );
      }
    },
    {
      title: LANG('开仓方式'),
      dataIndex: 'placeSource',
      minWidth: 100,
      render: (_: any, item: LiteListItem) => {
        return <span className="liteName">{`${getType(item)}`}</span>;
      }
    },
    {
      title: `${LANG('开仓时间')}/${LANG('平仓时间')}`,
      minWidth: 130,
      dataIndex: 'opTime',
      render: (_: any, { createTime, tradeTime }: LiteListItem) => {
        return (
          <div className="flex">
            <span className="liteName">{dayjs(createTime).format('MM/DD HH:mm:ss')}</span>
            <span className="gray liteName">{dayjs(tradeTime).format('MM/DD HH:mm:ss')}</span>
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
      title: LANG('操作'),
      align: 'right',
      minWidth: 100,
      render: (item: LiteListItem) => {
        return (
          <Image
            src="/static/images/lite/share.svg"
            className="share"
            width={16}
            height={16}
            alt=""
            onClick={() => {
              Position.setShareModalData(item);
            }}
          />
        );
      }
    }
  ];

  const rate = useMemo(() => {
    if (shareModalData) {
      const { income: oldIncome, margin } = shareModalData;
      const income = Number((oldIncome || 0).toFixed(2)) + 0;
      return Number(income.div(margin).mul(100).toFixed(2));
    }
    return 0;
  }, [shareModalData, marketMap]);

  return (
    <>
      <div className="container">
        <DesktopOrTablet>
          <RecordList
            loading={loading}
            columns={columns}
            data={(isLogin ? historyList || [] : []).filter(({ commodity }) => (hideOther ? commodity === id : true))}
            className={`${theme} lite-history-table`}
          />
        </DesktopOrTablet>
        <Mobile>
          <div className="list-view">
            {loading ? (
              <></>
            ) : historyList.filter(({ commodity }) => (hideOther ? commodity === id : true)).length > 0 ? (
              historyList
                .filter(({ commodity }) => (hideOther ? commodity === id : true))
                .map(item => {
                  const {
                    id,
                    commodityName,
                    currency,
                    buy,
                    lever,
                    income: oldIncome,
                    volume,
                    margin,
                    opPrice,
                    cpPrice,
                    priceDigit,
                    takeProfit,
                    stopLoss,
                    createTime,
                    tradeTime
                  } = item;
                  const income = Number((oldIncome || 0).toFixed(2)) + 0;
                  const rate = Number(income.div(margin).mul(100));
                  return (
                    <div key={id} className="history-item">
                      <ItemHeader
                        name={commodityName}
                        isBuy={buy}
                        lever={lever}
                        income={income}
                        incomeRate={rate}
                        shareItem={() => Position.setShareModalData(item)}
                      />
                      <ItemStatistics
                        id={id}
                        opPrice={opPrice.toFormat(priceDigit)}
                        cpPrice={cpPrice.toFormat(priceDigit)}
                        opTime={dayjs(createTime).format('YYYY-MM-DD HH:mm')}
                        cpTime={dayjs(tradeTime).format('YYYY-MM-DD HH:mm')}
                        volume={volume.toFormat()}
                        margin={margin.toFormat()}
                        stopProfit={takeProfit.toFormat()}
                        stopLoss={stopLoss.toFormat()}
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
      {shareModalData && (
        <ShareModal
          isBuy={shareModalData.buy}
          lever={shareModalData.lever}
          commodityName={shareModalData.commodityName}
          type={LANG('简易合约')}
          incomeRate={rate}
          opPrice={shareModalData.opPrice.toFormat(shareModalData.priceDigit)}
          cpPrice={shareModalData.cpPrice.toFormat(shareModalData.priceDigit)}
        />
      )}
      <style jsx>{styles}</style>
    </>
  );
};

export default HistoryTable;
const styles = css`
  :global(.liteName) {
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    color: var(--text_1);
  }
  :global(.StopLoss) {
    color: var(--color-red);
    margin-top: 8px;
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

  :global(.lite-history-table) {
    :global(.ant-table-fixed-header) {
      background: transparent !important;
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
      :global(.first-td) {
        position: relative;
        padding-left: 20px;
        :global(span) {
          &:last-child {
            font-size: 12px;
            color: var(--skin-primary-color) !important;
            margin-top: 4px;
          }
        }
        &:before {
          position: absolute;
          display: block;
          content: '';
          width: 4px;
          height: 50px;
          left: 1px;
          background: 0 0;
          /* border-top: 2.4px solid transparent;
          border-bottom: 2.4px solid transparent;
          border-right: 2.4px solid transparent; */
        }
      }
      :global(.raise) {
        &:before {
          border-left: 3px solid var(--color-green);
        }
      }
      :global(.fall) {
        &:before {
          border-left: 3px solid var(--color-red);
        }
      }
      :global(.gray) {
        margin-top: 8px;
      }
      :global(.flex) {
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
    }
    :global(.order) {
      padding-left: 30px !important;
    }
    :global(.share) {
      cursor: pointer;
      margin-right: 15px;
      margin-top: 7px;
    }
  }
  :global(.dark) {
    :global(.ant-table-row) {
      :global(td) {
        color: #c7c7c7 !important;
        border-bottom: 1px solid var(--fill_line_1) !important;
      }
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
    }
    .history-item {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
  }
`;
