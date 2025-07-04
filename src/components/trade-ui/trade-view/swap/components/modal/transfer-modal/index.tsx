import { ACCOUNT_TYPE, DefaultCoin, TransferModal as TransferModalComponent } from '@/components/modal';
import { useResponsive } from '@/core/hooks';
import { Swap } from '@/core/shared';
import { SWAP_COPY_WALLET_KEY } from '@/core/shared/src/swap/modules/assets/constants';

export const TransferModal = () => {
  const { isUsdtType, quoteId } = Swap.Trade.base;
  const { isMobile } = useResponsive(false);
  const visible = Swap.Trade.store.modal.transferVisible;
  const transferData = Swap.Trade.store.modal.transferData;

  let walletId = Swap.Info.getWalletId(isUsdtType);
  let usdt = isUsdtType;

  if (transferData.wallet) {
    walletId = transferData.wallet;
    usdt = transferData.isUsdtType;
  }
  return (
    <TransferModalComponent
      defaultSourceAccount={ACCOUNT_TYPE.SPOT}
      defaultTargetAccount={usdt ? (walletId === SWAP_COPY_WALLET_KEY ? ACCOUNT_TYPE.COPY : ACCOUNT_TYPE.SWAP_U) : ACCOUNT_TYPE.SWAP}

      open={visible}
      defaultCoin={(usdt ? 'BTC-USD' : quoteId) as DefaultCoin}
      // defaultTargetWallet={walletId}
      onCancel={() => Swap.Trade.setModal({ transferVisible: false })}
      onTransferDone={({ accounts }) => {
        accounts.forEach((v) => {
          if (v === ACCOUNT_TYPE.SWAP) {
            Swap.Assets.fetchBalance(false);
          } else if (v === ACCOUNT_TYPE.SWAP_U || v === ACCOUNT_TYPE.COPY) {
            Swap.Assets.fetchBalance(true);
          }
        });
        Swap.Trade.clearInputVolume();
      }}
      inMobile={isMobile}
    />
  );
};

export default TransferModal;
