import { AlertFunction } from '@/components/modal';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { SWAP_BOUNS_WALLET_KEY } from '@/core/shared/src/swap/modules/assets/constants';
import { SWAP_DEFAULT_WALLET_ID } from '@/core/shared/src/swap/modules/info/constants';

export const showInfoToast = (wallet: any, confirm: () => any) => {
  wallet = Swap.Assets.walletFormat(wallet);
  const _confirm = () => {
    confirm?.();
  };
  if (wallet.wallet === SWAP_DEFAULT_WALLET_ID) {
    AlertFunction({
      v2: true,
      title: LANG('系统默认钱包'),
      okText: LANG('去交易'),
      content: LANG('此钱包为系统默认钱包，当同意合约协议时，系统自动创建的钱包；此钱包支持修改头像和名称。'),
      showCancel: false,
      onOk: _confirm,
    });
  } else if (wallet.wallet === SWAP_BOUNS_WALLET_KEY) {
    AlertFunction({
      v2: true,
      title: wallet.alias,
      okText: LANG('去交易'),
      showCancel: false,
      onOk: _confirm,
      content: (
        <>
          <div className=''>
            <div className='top-content'>
              {LANG(
                '{wallet}为体验金交易专用钱包，活动派发的体验金将会发放至该钱包；若使用体验金交易需切换至该钱包进行操作，且交易平仓已实现盈利部分可转出；体验金钱包头像与名称不支持修改。',
                { wallet: wallet.alias }
              )}
            </div>
            <div className='bottom-content'>
              <div>
                {`1. ${LANG(
                  '获得了体验金后，在未有持仓的前提下，永续合约账户任何资金的划转转出，都会导致体验金失效。'
                )}`}
              </div>
              <div>{`2. ${LANG('有体验金且有持仓时，体验金钱包不可操作划转转出。')}`}</div>
            </div>
          </div>
          <style jsx>{`
            .top-content {
              margin-bottom: 16px;
            }
            .bottom-content {
              padding: 14px 12px;
              border-radius: 5px;
              color: var(--theme-font-color-small-yellow);
              background: var(--color-active-2);
            }
          `}</style>
        </>
      ),
    });
  }
};
