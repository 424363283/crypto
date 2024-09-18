import { PositionList } from '@/components/order-list/swap/media/desktop/components/position-list';
import { PositionList as TabletPositionList } from '@/components/order-list/swap/media/tablet/components/position-list';
import { Desktop, MobileOrTablet } from '@/components/responsive';
import { TableStyle } from '../../../../components/table-style';

export const HoldPosition = ({ onWalletClick }: { onWalletClick?: any }) => {
  return (
    <>
      <Desktop forceInitRender={false}>
        <PositionList assetsPage onWalletClick={onWalletClick} />
      </Desktop>
      <MobileOrTablet forceInitRender={false}>
        <TabletPositionList assetsPage onWalletClick={onWalletClick} />
      </MobileOrTablet>
      <TableStyle />
    </>
  );
};
