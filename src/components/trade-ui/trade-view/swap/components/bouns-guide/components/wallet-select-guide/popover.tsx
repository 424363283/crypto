import { Button } from '@/components/button';
import Image from '@/components/image';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { SWAP_BOUNS_WALLET_KEY } from '@/core/shared/src/swap/modules/assets/constants';
import { clsx } from '@/core/utils';
import { showInfoToast } from '../../../modal/wallet-select-modal/components/info-alert';

export const Popover = ({
  content,
  onClose,
  goTo,
  arrow = 'top',
}: {
  content: string[];
  onClose?: () => any;
  goTo: (step: number) => void;
  arrow: string;
}) => {
  const _onClose = () => {
    onClose?.();
  };
  return (
    <>
      <div className={clsx('guide-popover', 'arrow', `arrow-${arrow}`)}>
        <div className='title'>
          {LANG('提示')}
          <Image
            className='close'
            onClick={_onClose}
            alt='close'
            src='/static/images/img-code/close.svg'
            width={10}
            height={10}
          />
        </div>
        <div className='content'>
          {content.map((v, i) => {
            if (v === 'space') {
              return <div key={i} className='space'></div>;
            }
            return <div key={i}>{v}</div>;
          })}
        </div>
        <div className='bottom'>
          <Button
            type='primary'
            className='button'
            onClick={() => {
              _onClose?.();
              showInfoToast(Swap.Assets.getWallet({ usdt: true, walletId: SWAP_BOUNS_WALLET_KEY }), () => {
                Swap.Trade.setModal({ walletSelectVisible: false, walletSelectData: {} });
                Swap.Info.setWalletId(true, SWAP_BOUNS_WALLET_KEY);
              });
            }}
          >
            {LANG('知道了')}
          </Button>
        </div>
      </div>
      <style jsx>{`
        .guide-popover {
          padding-top: 14px;
          padding-left: 15px;
          padding-right: 10px;
          padding-bottom: 10px;
          color: var(--skin-font-color);
          position: relative;
          &.arrow {
            &::before {
              content: '';
              display: block;
              position: absolute;
              border-top: 5px solid transparent;
              border-bottom: 5px solid transparent;
              border-right: 8px solid var(--skin-primary-color);
            }
            &.arrow-top::before {
              top: -8px;
              transform: rotate(90deg);
            }
            &.arrow-left::before {
              top: 38px;
              left: -8px;
            }
          }

          .title {
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-right: 5px;
            .close {
              cursor: pointer;
            }
          }
          .content {
            margin-bottom: 10px;
            > div {
              font-size: 12px;
            }
            .space {
              height: 20px;
            }
          }

          .bottom {
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            margin-top: 4px;

            :global(.button) {
              background-color: var(--theme-trade-bg-color-2);
              color: var(--theme-font-color-1);
              height: 24px;
              font-size: 12px;
              min-width: 53px;
            }
          }
        }
      `}</style>
    </>
  );
};
