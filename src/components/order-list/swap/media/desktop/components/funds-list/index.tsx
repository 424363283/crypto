import RecordList, { ColSelectTitle } from '@/components/order-list/components/record-list';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';

import { FilterBar } from '@/components/order-list/components/filter-bar';
import { store, useData } from '@/components/order-list/swap/stores/funds-list';
import { SWAP_FUNDS_RECORD_FUNDS_TYPE, SWAP_FUNDS_RECORD_TYPE } from '@/core/shared/src/constants/order';
import { isSwapDemo } from '@/core/utils';
import dayjs from 'dayjs';
import { useCallback, useEffect, useRef } from 'react';
import { CodeSelectTitle } from '../code-select-title';
import { WalletName } from '../wallet-name';
import { clsx, styles } from './styled';

export const FundsList = ({ active }: { active: boolean }) => {
  const { isUsdtType } = Swap.Trade.base;
  const scrollRef = useRef();
  const scrollToTop = useCallback(() => {
    if (scrollRef?.current) {
      (scrollRef?.current as any).scrollTop = 0;
    }
  }, [scrollRef]);
  const { data, loading, onSubmit, onLoadMore } = useData({ isUsdtType, scrollToTop });

  useEffect(() => {
    if (active) {
      onSubmit();
    }
  }, [active, onSubmit]);

  return (
    <>
      <div className={clsx('funds-list')}>
        {
          // <FilterBar onSubmit={onSubmit} defaultWallet={Swap.Info.getWalletId(isUsdtType)} /> 
        }
        <RecordList
          renderRowKey={(v) => v.orderId}
          data={data}
          loading={loading}
          columns={useColumns({ isUsdtType })}
          onLoadMore={onLoadMore}
          rowClassName={(item: any) => (item.status !== '4' ? '' : clsx('cancel-row'))}
          getScrollElement={useCallback((v: any) => (scrollRef.current = v), [])}
          scroll={{ x: 'max-content', y: 500 }}
        />
      </div>
      {styles}
    </>
  );
};

const useColumns = ({ isUsdtType }: any) => {
  const perpetualText = Swap.Info.getContractName(isUsdtType);
  const storeCode = store.code;
  const storeType = store.type;

  const columns = [

    {
      title: LANG('合约'),
      dataIndex: 'symbol',
      minWidth: 150,
      render: (symbol: any, item: any) => {
        return (
          <div className='multi-line-item'>
            <div className={clsx('code-text')}>{Swap.Info.getCryptoData(item.symbol, { withHooks: false }).name} {LANG('永续')}</div>
          </div>
        );
      },
    },
    {
      title: LANG('账户'),
      dataIndex: 'subWallet',
      minWidth: 150,
      render: (v: any, item: any) => {
        const walletData = Swap.Assets.getWallet({ walletId: item.subWallet, usdt: isUsdtType, withHooks: false });
        return (
          <WalletName>
            {LANG(item?.alias || walletData?.alias)}
          </WalletName>
        );
      },
    },
    {
      title: () => {
        const types: any = { ...SWAP_FUNDS_RECORD_TYPE() };
        delete types.maker_fee;
        delete types.transferLiteOutPerpetualIn;
        return (
          <ColSelectTitle options={types} value={storeType} onChange={(type) => (store.type = type)}>
            {LANG('类型')}
          </ColSelectTitle>
        );
      },
      dataIndex: 'type',
      minWidth: 150,
      render: (type: any) => {
        return (SWAP_FUNDS_RECORD_TYPE() as any)[type];
      },
    },
    // {
    //   title: LANG('资金类型'),
    //   dataIndex: 'fundsType',
    //   render: (type: any, item: any) => {
    //     return (SWAP_FUNDS_RECORD_FUNDS_TYPE() as any)[type] || '--';
    //   },
    // },
    {
      title: LANG('总额'),
      dataIndex: 'amount',
      minWidth: 150,
      render: (amount: any, item: any) => {
        const formatNum = isUsdtType ? amount : amount.toFixed(Number(item.scale));
        if (item.type === 'taker_fee' || item.type === 'maker_fee') {
          return formatNum;
        }
        return <span className={Number(amount) > 0 ? 'positive-text' : 'negative-text'}>
          {formatNum}
        </span>;
        // return isUsdtType ? amount : amount.toFixed(Number(item.scale));
      },
    },
    {
      title: isUsdtType
        ? LANG('资产种类')
        : () => {
          return (
            <CodeSelectTitle
              codeOnly
              value={storeCode}
              onChange={(code: any) =>
                (store.code = code?.replace(!isSwapDemo() ? /-usdt?/i : /-s?usdt?/i, '').toUpperCase())
              }
            >
              {LANG('资产种类')}
            </CodeSelectTitle>
          );
        },

      dataIndex: 'currency',
      minWidth: 150,
      render: (v: any) => {
        return v;
      },
    },
    {
      title: LANG('时间'),
      dataIndex: 'time',
      align: 'right',
      minWidth: 150,
      render: (time: any) => dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
    },
    // {
    //   width: 100,
    //   title: () => LANG('合约'),
    //   dataIndex: 'code',
    //   render: (v, item) => {
    //     return (
    //       <div className="multi-line-item">
    //         <div>{item.symbol.replace('-', '').toUpperCase()}</div>
    //         <div>{LANG('永续____1')}</div>
    //       </div>
    //     );
    //   },
    // },
  ];

  return columns;
};
export default FundsList;
