import { Swap } from '@/core/shared';
import { useState } from 'react';
import { WalletFormModal } from '../../../../../../modal/wallet-form-modal';

export const WalletSelectModalInTrade = () => {
  const { walletFormVisible, walletFormData } = Swap.Trade.store.modal;
  const [update, setUpdate] = useState('');
  const [usdt, setUsdt] = useState<boolean | null>(null);
  const tradeIsUsdtType = Swap.Trade.base.isUsdtType;
  const _setUpdate = () => {
    setUpdate(new Date().toISOString());
  };
  return (
    <WalletFormModal
      visible={walletFormVisible}
      onClose={() => {
        setUsdt(null);
        Swap.Trade.setModal({ walletFormVisible: false });
      }}
      data={walletFormData?.data}
      isUsdtType={usdt === null ? tradeIsUsdtType : usdt}
      onWalletItemClick={({ walletData, isUsdtType }) => {
        setUsdt(isUsdtType);
        Swap.Trade.setModal({ walletFormData: { data: walletData } });
        _setUpdate();
      }}
      update={update}
      onTransferNow={({ wallet, isUsdtType }) => Swap.Trade.setTransferModalVisible({ wallet, isUsdtType })}
    />
  );
};

export default WalletSelectModalInTrade;
