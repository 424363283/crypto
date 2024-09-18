import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { zIndexMap } from '@/core/styles/src/theme/global/z-index';
import { AlertFunction } from '../../alert-function';

export const showBounsDisappearAlert = async ({
  isUsdtType,
  crypto,
  wallet,
}: {
  crypto: string;
  isUsdtType: boolean;
  wallet: string;
}) => {
  const balance = Swap.Assets.getBalanceData({ withHooks: false, usdt: isUsdtType, code: crypto, walletId: wallet });
  const digit = Swap.Assets.getBalanceDigit({ withHooks: false, usdt: isUsdtType });
  return new Promise((res) => {
    if (balance.bonusAmount > 0) {
      AlertFunction({
        v2: true,
        zIndex: zIndexMap['--zindex-trade-pc-modal'] + 1,
        title: LANG('提示'),
        onOk: () => res(true),
        onCancel: () => res(false),
        content: LANG('您当前的划转操作会导致剩余的{amount} {cryoto}的体验金失效。请确认是否需要继续操作！', {
          cryoto: balance.currency,
          amount: balance.bonusAmount.toFixed(digit),
        }),
      });
    } else {
      res(true);
    }
  });
};
// export const BounsDisappearModal = ({ visible }: { visible: boolean }) => {
//   useEffect(() => {
//     if (visible) {
//     }
//   }, [visible]);

//   return <></>;
// };

// export default BounsDisappearModal;
