import { WalletAvatar } from '@/components/wallet-avatar';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { clsx } from '@/core/utils';
import { isSwapDemo } from '@/core/utils/src/is';
import { useLocation } from 'react-use';

export const ItemWallet = ({ wallet }: { wallet: any }) => {
  const location = useLocation();
  const isDemo = isSwapDemo(location.pathname);
  return (
    <>
      {!isDemo && (
        <WalletAvatar
          className='wallet-avatar'
          type={!isDemo ? wallet?.pic : null}
          size={14}
          walletData={Swap.Assets.walletFormat(wallet)}
        />
      )}
      <div className={clsx(!isDemo && 'text')}>
        {!isDemo ? Swap.Assets.walletFormat(wallet)?.alias : LANG('模拟交易账户')}
      </div>
      <style jsx>
        {`
          .text {
            margin-left: 4px;
          }
        `}
      </style>
    </>
  );
};
