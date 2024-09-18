import { useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Account, Lite, LiteListItem } from '@/core/shared';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useMemo } from 'react';
import css from 'styled-jsx/css';
import RecordList from '../../components/record-list';
import Clipboard from './clipboard';
import ShareModal from './share-modal';

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
      render: (_: any, { commodityName, currency, lever, buy }: LiteListItem) => {
        return (
          <div className={`first-td flex ${buy ? 'raise' : 'fall'}`}>
            <span>{commodityName.replace(currency, '')}</span>
            <span>{lever}X</span>
          </div>
        );
      },
    },
    {
      title: LANG('保证金'),
      dataIndex: 'margin',
    },
    {
      title: LANG('仓位'),
      dataIndex: 'volume',
      render: (val: number) => val.toFixed(4),
    },
    {
      title: `${LANG('开仓价')}/${LANG('平仓价')}`,
      dataIndex: 'opPrice',
      render: (_: any, { opPrice, cpPrice, priceDigit }: LiteListItem) => {
        return (
          <div className='flex'>
            <span className='gray'>{opPrice?.toFormat(priceDigit)}</span>
            <span>{cpPrice?.toFormat(priceDigit)}</span>
          </div>
        );
      },
    },
    {
      title: `${LANG('订单盈亏')}(${LANG('盈亏比')})`,
      dataIndex: 'income',
      render: (_: any, { income: oldIncome, margin }: LiteListItem) => {
        const income = Number((oldIncome || 0).toFixed(2)) + 0;
        const rate = Number(income.div(margin).mul(100));
        return (
          <div className={income >= 0 ? 'main-raise' : 'main-fall'}>
            <span>
              {income >= 0 ? '+' : ''}
              {income.toFixed(2)}
            </span>
            (
            <span>
              {rate >= 0 ? '+' : ''}
              {rate.toFixed(2)}%
            </span>
            )
          </div>
        );
      },
    },
    {
      title: `${LANG('止盈')}/${LANG('止损')}`,
      dataIndex: 'takeProfit',
      render: (_: any, { takeProfit, stopLoss }: LiteListItem) => (
        <div>{`${takeProfit.toFormat()} / ${stopLoss.toFormat()}`}</div>
      ),
    },
    {
      title: LANG('开仓方式'),
      dataIndex: 'placeSource',
      render: (_: any, item: LiteListItem) => getType(item),
    },
    {
      title: `${LANG('开仓时间')}/${LANG('平仓时间')}`,
      width: 160,
      dataIndex: 'opTime',
      render: (_: any, { createTime, tradeTime }: LiteListItem) => {
        return (
          <div className='flex'>
            <span className='gray'>{dayjs(createTime).format('MM/DD HH:mm:ss')}</span>
            <span>{dayjs(tradeTime).format('MM/DD HH:mm:ss')}</span>
          </div>
        );
      },
    },
    {
      title: LANG('订单号'),
      dataIndex: 'id',
      render: (id: string) => {
        return (
          <div>
            <span style={{ marginRight: '10px' }}>
              {id.slice(0, 5)}...
              {id.slice(id.length - 5)}
            </span>
            <Clipboard text={id} />
          </div>
        );
      },
    },
    {
      title: LANG('操作'),
      align: 'right',
      render: (item: LiteListItem) => {
        return (
          <Image
            src='/static/images/lite/share.png'
            className='share'
            width={20}
            height={20}
            alt=''
            onClick={() => {
              Position.setShareModalData(item);
            }}
          />
        );
      },
    },
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
      <div className='container'>
        <RecordList
          loading={loading}
          columns={columns}
          data={(isLogin ? historyList : []).filter(({ commodity }) => (hideOther ? commodity === id : true))}
          className={`${theme} lite-history-table`}
        />
      </div>
      {shareModalData && (
        <ShareModal
          isBuy={shareModalData.buy}
          lever={shareModalData.lever}
          commodityName={shareModalData.commodityName}
          type={LANG('Contract ID')}
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
          width: 3px;
          height: 24px;
          left: 1px;
          background: 0 0;
          border-top: 2.4px solid transparent;
          border-bottom: 2.4px solid transparent;
          border-right: 2.4px solid transparent;
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
        color: #798296;
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
    }
  }
  :global(.dark) {
    :global(.ant-table-row) {
      :global(td) {
        color: #c7c7c7 !important;
      }
    }
  }
`;
