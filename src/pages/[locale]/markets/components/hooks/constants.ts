import { LANG } from '@/core/i18n';
import { FAVORITE_OPTION_ID, LITE_OPTION_ID, PERPETUAL_OPTION_ID } from '../../types';

// 获取环境变量
const enableLite = process.env.NEXT_PUBLIC_LITE_ENABLE === 'true';

const PERPETUAL_OPTIONS = [
  {
    name: LANG('U本位合约'),
    id: PERPETUAL_OPTION_ID.SWAP_USDT,
    key: 'perpetual.usdt',
  },
  {
    name: LANG('币本位合约'),
    id: PERPETUAL_OPTION_ID.SWAP_COIN,
    key: 'perpetual.crypto',
  },
];
const LITE_OPTIONS = [
  {
    name: LANG('全部'),
    id: LITE_OPTION_ID.ALL,
    key: 'contract.crypto',
  },
  {
    name: LANG('主流区'),
    id: LITE_OPTION_ID.MAIN_STREAM,
    key: 'contract.mainstream',
  },
  {
    name: LANG('创新区'),
    id: LITE_OPTION_ID.CREATIVE_AREA,
    key: 'contract.innovation',
  },
  {
    name: LANG('带单区'),
    id: LITE_OPTION_ID.COPY_ORDER,
    key: 'contract.copy',
  },
];
const FAVORITE_OPTIONS = [
  {
    name: LANG('现货'),
    id: FAVORITE_OPTION_ID.SPOT,
    key: 'favorites.spot',
  },
  {
    name: LANG('U本位合约'),
    id: FAVORITE_OPTION_ID.SWAP_USDT,
    key: 'favorites.swap_usdt',
  },
  {
    name: LANG('币本位合约'),
    id: FAVORITE_OPTION_ID.SWAP_COIN,
    key: 'favorites.swap_coin',
  },
  {
    name: LANG('简易合约'),
    id: FAVORITE_OPTION_ID.LITE,
    key: 'favorites.contract',
  },
  {
    name: 'LVTs',
    id: FAVORITE_OPTION_ID.ETF,
    key: 'favorites.etf',
  },
].filter((item) => {
  if (item.id === FAVORITE_OPTION_ID.LITE) {
    return enableLite;
  }
  return true;
});
export { FAVORITE_OPTIONS, LITE_OPTIONS, PERPETUAL_OPTIONS };
