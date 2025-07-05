import Table from '@/components/table';
import { getLiteHistoryApi } from '@/core/api';
import { LANG } from '@/core/i18n';
import Image from 'next/image';
import { memo, useCallback, useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';

type HistoryDealItem = {
  bonusId: string;
  buy: boolean;
  chargeLucky: number;
  chargeMoney: number;
  closeSource: string;
  commodity: string;
  commodityName: string;
  commodityType: null;
  contract: string;
  cpPrice: number;
  createTime: number;
  currency: string;
  discount: number;
  followCount: number;
  followId: string;
  followIncome: number;
  fundingFee: number;
  id: string;
  income: number;
  lever: number;
  limit: boolean;
  margin: number;
  opPrice: number;
  placeSource: string;
  price: number;
  priceDigit: number;
  shared: boolean;
  status: number;
  stopLoss: number;
  takeProfit: number;
  tradeTime: number;
  traderId: string;
  traderMoney: number;
  traderUsername: string;
  traderRatio: number;
  uid: string;
  username: string;
  volume: number;
};

const getType = (item: HistoryDealItem) => {
  if (item.traderUsername !== null) {
    return (
      <>
        <span>{LANG('跟随')}:</span>
        <br />
        <span>{item.traderUsername}</span>
      </>
    );
  } else if (item.followCount > 0) {
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
export const HistoryDeal = () => {
  const [page, setPage] = useState(1);
  const [{ loading, data }, setState] = useImmer({
    loading: false,
    data: [] as any[],
  });
  const columns = useColumns();
  const getData = useCallback(async () => {
    setState((draft) => {
      draft.loading = true;
    });
    try {
      const res = await getLiteHistoryApi();
      const history = res.data || [];
      setState((draft) => {
        draft.loading = false;
        draft.data = history.map((item) => {
          const volumePrecision = /^BTCUSD/i.test(item.commodity) ? 4 : 2;
          const volumeFormat = item.volume.toFixed(volumePrecision);
          return {
            ...item,
            volumeFormat: volumeFormat,
          };
        });
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Table
        className='lite-history-table'
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{ pageSize: 10, current: page, onChange: setPage }}
      />
      <style jsx>{styles}</style>
    </>
  );
};
const styles = css`
  :global(.lite-history-table) {
    height: 797px;
    background: #fff;
    :global(.code) {
      display: flex;
      flex-direction: row;
      align-items: center;
      :global(.icon) {
        height: 18px;
        width: 41px;
        margin-right: 4px;
      }
      :global(.text) {
        margin-right: 8px;
      }
    }
    :global(.actions) {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;
    }
  }
`;

const ContractColumn = ({ buy, commodity, lever }: { buy: boolean; commodity: string; lever: number }) => {
  return (
    <div className='code'>
      <Image
        className='icon'
        src={buy ? '/static/images/account/fund/long.png' : '/static/images/account/fund/short.png'}
        alt=''
        width='41'
        height='18'
      />
      <div className='text'>{commodity}</div>
      <div>{lever}x</div>
    </div>
  );
};
const ContractColumnMemo = memo(ContractColumn);
const useColumns = () => {
  return [
    {
      title: LANG('合约'),
      dataIndex: 'code',
      render: (v: any, item: HistoryDealItem) => {
        return <ContractColumnMemo buy={item.buy} commodity={item.commodity} lever={item.lever} />;
      },
    },
    {
      title: LANG('仓位'),
      dataIndex: 'volumeFormat',
    },
    {
      title: LANG('开仓价'),
      dataIndex: 'opPrice',
      render: (v: any, item: HistoryDealItem) => v?.toFormat(item.priceDigit),
    },
    {
      title: LANG('平仓价'),
      dataIndex: 'cpPrice',
      render: (v: any, item: HistoryDealItem) => v?.toFormat(item.priceDigit),
    },
    {
      title: LANG('订单盈亏'),
      dataIndex: 'income',
      render: (v: any, item: HistoryDealItem) => (
        <div style={{ color: `var(${item.income >= 0 ? '--color-green' : '--color-red'})` }}>
          {item.income >= 0 ? '+' : ''}
          {item.income.toFixed(2)}
        </div>
      ),
    },
    {
      title: LANG('盈亏比'),
      dataIndex: 'rate',
      render: (v: any, item: HistoryDealItem) => {
        const rate = item.income.div(item.margin).mul(100);
        return (
          <div style={{ color: `var(${item.income >= 0 ? '--color-green' : '--color-red'})` }}>
            {item.income >= 0 ? '+' : ''}
            {rate.toFixed(2)}%
          </div>
        );
      },
    },
    {
      title: LANG('开仓方式'),
      dataIndex: 'open_reason',
      render: (v: any, item: HistoryDealItem) => <>{getType(item)}</>,
    },
    {
      title: LANG('保证金'),
      dataIndex: 'margin',
      render: (v: any) => v?.toFormat('all'),
    },
  ];
};
