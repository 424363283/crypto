import { useRouter } from '@/core/hooks';
import { useCallback } from 'react';
import { CommonLayout } from '../../components/common-layout';
import SpotHistoryOrder from '../spot-order';
import SwapHistoryOrder from '../swap-order';
import { ORDER_HISTORY_TYPE } from '../types';
import { useNavMap } from '../use-nav-map';

export default function OrderHistoryContainer() {
  const router = useRouter();
  const { ORDER_NAV_MAP } = useNavMap();
  const type = router.query?.id?.toLowerCase() || ORDER_HISTORY_TYPE.SWAP_ORDER;
  const isSwapU = type === ORDER_HISTORY_TYPE.SWAP_U_ORDER;
  const onTabChange = useCallback((url: string, { id }: { id: string }) => {
    router.replace({
      pathname: url,
      query: { tab: id },
    });
  }, []);
  const ORDER_MODULES_MAP: any = {
    [ORDER_HISTORY_TYPE.SPOT_ORDER]: <SpotHistoryOrder onTabChange={onTabChange} />,
    [ORDER_HISTORY_TYPE.SWAP_ORDER]: <SwapHistoryOrder isSwapU={isSwapU} onTabChange={onTabChange} />,
    [ORDER_HISTORY_TYPE.SWAP_U_ORDER]: <SwapHistoryOrder isSwapU={isSwapU} onTabChange={onTabChange} />,
  };

  const SPECIFIC_ORDER_HISTORY_MODULES = () => {
    if (ORDER_MODULES_MAP.hasOwnProperty(type)) {
      return ORDER_MODULES_MAP[type];
    }
    return null;
  };
  return (
    <CommonLayout navItems={ORDER_NAV_MAP}>
      <SPECIFIC_ORDER_HISTORY_MODULES />
    </CommonLayout>
  );
}
