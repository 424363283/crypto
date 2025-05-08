import { TransferModal } from '@/components/modal';
import { useWalletButton } from '../hooks/use-wallet-button';
import { WalletType } from '../types';
import { FundWalletCardUiMemo } from './card-ui';
import { WalletKey } from '@/core/shared/src/swap/modules/assets/constants';

export const WalletBalanceCard = (props: { type: WalletType; wallet?: WalletKey | ''; onWalletCreateClick?: any }) => {
  const { type, wallet } = props;
  const { transferModalVisible, onTransferModalClose, BUTTON_MAP, sourceAccount, targetAccount } = useWalletButton(
    type,
    wallet,
    { onWalletCreateClick: props.onWalletCreateClick }
  );
  return (
    <>
      <FundWalletCardUiMemo type={type} wallet={wallet} buttons={BUTTON_MAP} />
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
