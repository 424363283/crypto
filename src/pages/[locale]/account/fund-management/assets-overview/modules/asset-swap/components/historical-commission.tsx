import { HistoryList } from '@/components/order-list/swap/media/desktop/components/history-list';
import { HistoryList as TabletHistoryList } from '@/components/order-list/swap/media/tablet/components/history-list';
import { Desktop, MobileOrTablet } from '@/components/responsive';
import { TableStyle } from '../../../../components/table-style';
import { useResponsive } from '@/core/hooks';
import { getUrlQueryParams } from '@/core/utils';
import { WalletType } from '../../../components/types';
import { WalletKey } from '@/core/shared/src/swap/modules/assets/constants';

// 历史委托
export const HistoricalCommission = () => {
  const type = getUrlQueryParams('type');
  const account: keyof typeof WalletKey = getUrlQueryParams('account')?.toUpperCase();
  const wallet = WalletKey[account] || (type === 'swap-u' ? WalletKey.SWAP_U : '');
  const { isDesktop, isMobileOrTablet } = useResponsive(false);
  return (
    <>
      {isDesktop && !isMobileOrTablet ? (
        <Desktop>
          <HistoryList wallet={wallet} active />
        </Desktop>) : ''
      }

      {!isDesktop && isMobileOrTablet ? (
        <MobileOrTablet>
          <TabletHistoryList wallet={wallet} active />
        </MobileOrTablet>) : ''
      }
      <TableStyle />
    </>
  );
};
