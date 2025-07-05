import { useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { ACCOUNT_CAN_TRANSFER_TYPES, ACCOUNT_TYPE } from './types';
import { SWAP_COPY_WALLET_KEY } from '@/core/shared/src/swap/modules/assets/constants';
import { Swap } from '@/core/shared';

export const useOptions = ({
  positiveTransfer,
  positiveAccount,
}: {
  positiveTransfer: boolean;
  positiveAccount: ACCOUNT_TYPE;
}) => {
  const enableLite = process.env.NEXT_PUBLIC_LITE_ENABLE === 'true';
  const { isDark } = useTheme();
  const getIconPath = (subPath: string) => `/static/images/common/modal/${subPath}`;
  const walletCopy = Swap.Assets.getWallet({ usdt: true, walletId: SWAP_COPY_WALLET_KEY });
  const enableCopy = !!walletCopy;
  const options = [
    {
      label: LANG('现货账户'),
      value: ACCOUNT_TYPE.SPOT,
      icon: isDark ? getIconPath('spot.png') : getIconPath('spot_light.png'),
    },
    // {
    //   label: LANG('币本位合约账户'),
    //   value: ACCOUNT_TYPE.SWAP,
    //   icon: isDark ? getIconPath('pp_crypto.png') : getIconPath('pp_crypto_light.png'),
    // },
    {
      label: LANG('U本位合约'),
      value: ACCOUNT_TYPE.SWAP_U,
      icon: isDark ? getIconPath('pp_usdt.png') : getIconPath('pp_usdt_light.png'),
    },
    {
      label: LANG('跟单账户'),
      value: ACCOUNT_TYPE.COPY,
      icon: isDark ? getIconPath('pp_usdt.png') : getIconPath('pp_usdt_light.png'),
    },
    // {
    //   label: LANG('简易合约账户'),
    //   value: ACCOUNT_TYPE.LITE,
    //   icon: isDark ? getIconPath('lite.png') : getIconPath('lite_light.png'),
    // },
  ].filter((item) => {
    if (item.value === ACCOUNT_TYPE.LITE) {
      return enableLite;
    }
    if(item.value === ACCOUNT_TYPE.COPY) {
      return enableCopy;
    }
    return true;
  });

  const getTypes = (types: any) => options.filter((v) => types.includes(v.value));

  let formatOptions = [];

  if (positiveTransfer) {
    formatOptions = options;
  } else {
    formatOptions = getTypes(ACCOUNT_CAN_TRANSFER_TYPES[positiveAccount]);
  }
  return formatOptions;
};
