import { ACCOUNT_TYPE, DefaultCoin, TransferModal } from '@/components/modal';
import { useResponsive } from '@/core/hooks';

import { DEFAULT_QUOTE_ID } from '@/core/shared/src/swap/modules/trade/constants';
import { useState } from 'react';
import { CalcSwapAsset } from '../../../../hooks/use-swap-balance';
import { Desktop } from './desktop';
import { Tablet } from './tablet';
import { WalletKey } from '@/core/shared/src/swap/modules/assets/constants';

export const AllAsset2 = ({
  isSwapU,
  walletId,
  wallets,
  onOpenWalletFormModal,
}: {
  isSwapU: boolean;
  walletId: WalletKey;
  wallets: CalcSwapAsset[];
  onOpenWalletFormModal: any;
}) => {
  const [transferModalVisible, setTransferModalVisible] = useState(false);

  const [{ code, wallet }, setModalData] = useState<{ code: any; wallet: string }>({
    code: isSwapU ? DEFAULT_QUOTE_ID.SWAP_U : DEFAULT_QUOTE_ID.SWAP,
    wallet: '',
  });

  const onCloseTransferModal = () => {
    setTransferModalVisible(false);
  };
  const onOpenTransferModal = (code: DefaultCoin, wallet: string) => {
    setTransferModalVisible(true);
    setModalData({ code, wallet });
  };
  const { isDesktop, isMobileOrTablet } = useResponsive(false);
  return (
    <>
      {isDesktop && !isMobileOrTablet ? (
        <Desktop
          data={wallets}
          isSwapU={isSwapU}
          wallet={walletId}
          onOpenTransferModal={onOpenTransferModal}
          onOpenWalletFormModal={onOpenWalletFormModal}
        />
      ) : ''}
      {!isDesktop && isMobileOrTablet ? (
        <Tablet
          data={wallets}
          isSwapU={isSwapU}
          wallet={walletId}
          onOpenTransferModal={onOpenTransferModal}
          onOpenWalletFormModal={onOpenWalletFormModal}
        />
      ) : ''}
      {transferModalVisible && (
        <TransferModal
          open={transferModalVisible}
          defaultTargetAccount={isSwapU ? (walletId === WalletKey.COPY ? ACCOUNT_TYPE.COPY : ACCOUNT_TYPE.SWAP_U) : ACCOUNT_TYPE.SWAP}

          onCancel={onCloseTransferModal}
          defaultCoin={code}
          defaultTargetWallet={wallet}
        />
      )}
    </>
  );
};
