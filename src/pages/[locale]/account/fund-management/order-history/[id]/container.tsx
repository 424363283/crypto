import { useResponsive, useRouter } from '@/core/hooks';
import { useCallback, useEffect, useState } from 'react';
import { CommonLayout } from '../../components/common-layout';
import SpotHistoryOrder from '../spot-order';
import SwapHistoryOrder from '../swap-order';
import { ORDER_HISTORY_TYPE } from '../types';
import { LANG } from '@/core/i18n';
import css from 'styled-jsx/css';
import { useNavMap } from '../../assets-overview/hooks/use-nav-map';
import { Account } from '@/core/shared';
import { ASSET_TYPE } from '../../assets-overview/types';
import TabBar, { TAB_TYPE } from '@/components/tab-bar';
import { Size } from '@/components/constants';
import LiteHistoryOrder from '../lite-order';

export default function OrderHistoryContainer() {
  const [verifiedDeveloped, setVerifiedDeveloped] = useState(false);
  const router = useRouter();
  const { NAV_MAP } = useNavMap(verifiedDeveloped);
  const { isMobile } = useResponsive();
  const type = router.query?.id?.toLowerCase() || ORDER_HISTORY_TYPE.SWAP_U_ORDER;
  const isSwapU = type === ORDER_HISTORY_TYPE.SWAP_U_ORDER;
  const onTabChange = useCallback((url: string, { id }: { id: string }) => {
    router.replace({
      pathname: url,
      query: {
        type: 'records',
        tab: id,
      },
    });
  }, []);

  const onOrderTabChange = (selectedTab: any) => {
    if (type !== selectedTab) {
      if (selectedTab === ORDER_HISTORY_TYPE.SPOT_ORDER) {
        router.replace({
          pathname: '/account/fund-management/order-history/spot-order',
          query: {
            type: 'records',
            tab: 0,
          },
        })
      } else if (selectedTab === ORDER_HISTORY_TYPE.SWAP_U_ORDER) {
        router.replace({
          pathname: '/account/fund-management/order-history/swap-u-order',
          query: {
            type: 'records',
            tab: 0,
          },
        })
      } else if (selectedTab === ORDER_HISTORY_TYPE.LITE_ORDER) {
        router.replace({
          pathname: '/account/fund-management/order-history/lite-order',
          query: {
            type: 'records',
            tab: 0,
          },
        })
      }
    }
  };
  const ORDER_MODULES_MAP: any = {
    [ORDER_HISTORY_TYPE.SPOT_ORDER]: <SpotHistoryOrder onTabChange={onTabChange} />,
    [ORDER_HISTORY_TYPE.SWAP_ORDER]: <SwapHistoryOrder isSwapU={isSwapU} onTabChange={onTabChange} />,
    [ORDER_HISTORY_TYPE.SWAP_U_ORDER]: <SwapHistoryOrder isSwapU={isSwapU} onTabChange={onTabChange} />,
    [ORDER_HISTORY_TYPE.LITE_ORDER]: <LiteHistoryOrder onTabChange={onTabChange} />,
  };

  const SPECIFIC_ORDER_HISTORY_MODULES = () => {
    if (ORDER_MODULES_MAP.hasOwnProperty(type)) {
      return ORDER_MODULES_MAP[type];
    }
    return null;
  };
  const fetchUserInfo = async () => {
    const userInfo = await Account.getUserInfo();
    setVerifiedDeveloped(userInfo?.verifiedDeveloped || false);
    if (!userInfo?.verifiedDeveloped && type === ASSET_TYPE.TAX_REPORT) {
      router.replace('/account/fund-management/assets-overview', '', { query: { type: 'overview' } });
    }
  };
  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <>
      <CommonLayout navItems={NAV_MAP}>
        <div className='order-history-common border-1 rounded-1'>
          <TabBar
            type={TAB_TYPE.TEXT}
            size = {isMobile? Size.LG : Size.XL}
            options={[
              { label: LANG('U本位合约'), value: ORDER_HISTORY_TYPE.SWAP_U_ORDER },
              { label: LANG('币币'), value: ORDER_HISTORY_TYPE.SPOT_ORDER },
              { label: LANG('简易合约'), value: ORDER_HISTORY_TYPE.LITE_ORDER },
            ]}
            value={type}
            onChange={onOrderTabChange}
          />
          <SPECIFIC_ORDER_HISTORY_MODULES />
        </div>
      </CommonLayout>
      <style jsx>{styles}</style>
    </>
   
  );

}

const styles = css`
 .order-history-common {
    background-color:var(--bg-1);
  }
`;

