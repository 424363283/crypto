import { HistoryList } from '@/components/order-list/swap/media/desktop/components/history-list';
import { HistoryList as TabletHistoryList } from '@/components/order-list/swap/media/tablet/components/history-list';
import { Desktop, MobileOrTablet } from '@/components/responsive';
import { TableStyle } from '../../../../components/table-style';
import { useResponsive } from '@/core/hooks';

// 历史委托
export const HistoricalCommission = () => {
  const { isDesktop, isMobileOrTablet } = useResponsive(false);
  return (
    <>
      {isDesktop && !isMobileOrTablet ? (
        <Desktop>
          <HistoryList active />
        </Desktop>) : ''
      }

      {!isDesktop && isMobileOrTablet ? (
        <MobileOrTablet>
          <TabletHistoryList active />
        </MobileOrTablet>) : ''
      }
      <TableStyle />
    </>
  );
};
