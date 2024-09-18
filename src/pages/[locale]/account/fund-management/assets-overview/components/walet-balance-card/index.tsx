import { TransferModal } from '@/components/modal';
import { useWalletButton } from '../hooks/use-wallet-button';
import { WalletType } from '../types';
import { FundWalletCardUiMemo } from './card-ui';

export const WalletBalanceCard = (props: { type: WalletType; onWalletCreateClick?: any }) => {
  const { type } = props;
  const { transferModalVisible, onTransferModalClose, BUTTON_MAP, sourceAccount, targetAccount } = useWalletButton(
    type,
    { onWalletCreateClick: props.onWalletCreateClick }
  );
  return (
    <>
      <FundWalletCardUiMemo type={type} buttons={BUTTON_MAP} />
      {transferModalVisible && (
        <TransferModal
          defaultSourceAccount={sourceAccount}
          defaultTargetAccount={targetAccount}
          open={transferModalVisible}
          onCancel={onTransferModalClose}
        />
      )}
    </>
  );
};
