import { HistoryList } from '@/components/order-list/swap/media/desktop/components/history-list';
import { HistoryList as TabletHistoryList } from '@/components/order-list/swap/media/tablet/components/history-list';
import { Desktop, MobileOrTablet } from '@/components/responsive';
import { TableStyle } from '../../../../components/table-style';

// 历史委托
export const HistoricalCommission = () => {
  return (
    <>
      <Desktop>
        <HistoryList active />
      </Desktop>

      <MobileOrTablet>
        <TabletHistoryList active />
      </MobileOrTablet>
      <TableStyle />
    </>
  );
};
