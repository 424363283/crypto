import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { SWAP_DEFAULT_WALLET_ID } from '@/core/shared/src/swap/modules/info/constants';
import dayjs from 'dayjs';
import { useEffect } from 'react';

interface Item {
  createTime: string;
  money: number;
  currency: string;
  source: string;
  target: string;
  status: number;
  sourceId?: string;
  targetId?: string;
}

export const useMoveRecordsColumns = () => {
  useEffect(() => {
    Swap.Assets.fetchBalance(true);
    Swap.Assets.fetchBalance(false);
  }, []);
  Swap.Assets.getWallet({ usdt: true });
  Swap.Assets.getWallet({ usdt: false });
  const LITE_TRANSFER_TYPES: (source?: string, target?: string) => { [key: string]: string } = (
    source?: string,
    target?: string
  ) => ({
    // SPOT_LITE: LANG('现货转简易合约'),
    // LITE_SPOT: LANG('简易合约转币币'),
    // SWAP_LITE: LANG('永续转入简易合约'),
    // LITE_SWAP: LANG('简易合约转入永续'),
    SWAP_SPOT: LANG('永续{source}转现货', { source }),
    SPOT_SWAP: LANG('现货转永续{target}', { target }),
    SWAP_SWAP: LANG('永续{source}转入永续{target}', { source, target }),
    SPOT_FUND: LANG('币币转C2C'),
    FUND_SPOT: LANG('C2C转币币'),
    FUND_LITE: LANG('C2C转简易合约'),
    LITE_FUND: LANG('简易合约转C2C'),
    SWAP_FUND: LANG('永续{source}转C2C', { source }),
    FUND_SWAP: LANG('C2C转永续{target}', { target }),
  });
  return [
    {
      title: LANG('时间'),
      dataIndex: 'createTime',
      align: 'left',
      render: (v: string) => dayjs(v).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: LANG('金额'),
      dataIndex: 'amount',
      render: (v: number, item: Item) => {
        return `${v} ${item?.currency}`;
      },
    },
    {
      title: LANG('类型'),
      dataIndex: 'srcWallet',
      render: (v: string, item: Item) => {
        const source = Swap.Assets.getWallet({
          usdt: item.currency === 'USDT',
          walletId: item.sourceId || SWAP_DEFAULT_WALLET_ID,
          withHooks: false,
        })?.alias;
        const target = Swap.Assets.getWallet({
          usdt: item.currency === 'USDT',
          walletId: item.targetId || SWAP_DEFAULT_WALLET_ID,
          withHooks: false,
        })?.alias;
        return LITE_TRANSFER_TYPES(source, target)[`${item?.source}_${item?.target}`];
      },
    },
    {
      title: LANG('状态'),
      dataIndex: 'status',
      align: 'right',
      render: (v: number) => {
        return { '-1': LANG('等待'), 2: LANG('等待'), 0: LANG('失败'), 1: LANG('成功') }[v];
      },
    },
  ];
};
