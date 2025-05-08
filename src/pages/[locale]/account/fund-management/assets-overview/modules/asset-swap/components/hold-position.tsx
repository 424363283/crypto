import { PositionList } from '@/components/order-list/swap/media/desktop/components/position-list';
import { PositionList as TabletPositionList } from '@/components/order-list/swap/media/tablet/components/position-list';
import { Desktop, MobileOrTablet } from '@/components/responsive';
import { TableStyle } from '../../../../components/table-style';
import { WalletKey } from '@/core/shared/src/swap/modules/assets/constants';
import { getUrlQueryParams } from '@/core/utils';
import { WalletType } from '../../../components/types';
import { useEffect } from 'react';
import { useCopyTradingSwapStore } from '@/store/copytrading-swap';

export const HoldPosition = ({ onWalletClick }: { onWalletClick?: any }) => {
  const type = getUrlQueryParams('type');
  const account: keyof typeof WalletKey = getUrlQueryParams('account')?.toUpperCase();
  const wallet = WalletKey[account] || (type === 'swap-u' ? WalletKey.SWAP_U : '');
  const fetchShareTrader = useCopyTradingSwapStore.use.fetchShareTrader();

  useEffect(() => {
    fetchShareTrader()
  }, []);
  return (
    <>
      <Desktop forceInitRender={false}>
        <PositionList wallet={wallet} assetsPage onWalletClick={onWalletClick} />
      </Desktop>
      <MobileOrTablet forceInitRender={false}>
        <TabletPositionList wallet={wallet} assetsPage onWalletClick={onWalletClick} />
      </MobileOrTablet>
      <TableStyle />
    </>
  );
};
