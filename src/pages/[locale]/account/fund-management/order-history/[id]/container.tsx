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
import { MediaInfo } from '@/core/utils';
const ORDER_HISTORY_TYPE_LIST = [
  { label: LANG('U本位合约'), value: ORDER_HISTORY_TYPE.SWAP_U_ORDER },
  { label: LANG('币币'), value: ORDER_HISTORY_TYPE.SPOT_ORDER },
  { label: LANG('简易合约'), value: ORDER_HISTORY_TYPE.LITE_ORDER }
];
export default function OrderHistoryContainer() {
  const [verifiedDeveloped, setVerifiedDeveloped] = useState(false);
  const router = useRouter();
  const { NAV_MAP } = useNavMap(verifiedDeveloped);
  const { isMobile } = useResponsive();
  const type = router.query?.id?.toLowerCase() || ORDER_HISTORY_TYPE.SWAP_U_ORDER;
  const isSwapU = type === ORDER_HISTORY_TYPE.SWAP_U_ORDER;
  const enableH5Lite = process.env.NEXT_PUBLIC_MOBILE_LITE_ENABLE === 'true';

  const onTabChange = useCallback((url: string, { id }: { id: string }) => {
    router.replace({
      pathname: url,
      query: {
        type: 'records',
        tab: id
      }
    });
  }, []);

  const onOrderTabChange = (selectedTab: any) => {
    if (type !== selectedTab) {
      if (selectedTab === ORDER_HISTORY_TYPE.SPOT_ORDER) {
        router.replace({
          pathname: '/account/fund-management/order-history/spot-order',
          query: {
            type: 'records',
            tab: 0
          }
        });
      } else if (selectedTab === ORDER_HISTORY_TYPE.SWAP_U_ORDER) {
        router.replace({
          pathname: '/account/fund-management/order-history/swap-u-order',
          query: {
            type: 'records',
            tab: 0
          }
        });
      } else if (selectedTab === ORDER_HISTORY_TYPE.LITE_ORDER) {
        router.replace({
          pathname: '/account/fund-management/order-history/lite-order',
          query: {
            type: 'records',
            tab: 0
          }
        });
      }
    }
  };
  const ORDER_MODULES_MAP: any = {
    [ORDER_HISTORY_TYPE.SPOT_ORDER]: <SpotHistoryOrder onTabChange={onTabChange} />,
    [ORDER_HISTORY_TYPE.SWAP_ORDER]: <SwapHistoryOrder isSwapU={isSwapU} onTabChange={onTabChange} />,
    [ORDER_HISTORY_TYPE.SWAP_U_ORDER]: <SwapHistoryOrder isSwapU={isSwapU} onTabChange={onTabChange} />,
    [ORDER_HISTORY_TYPE.LITE_ORDER]: <LiteHistoryOrder onTabChange={onTabChange} />
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
        <div className="order-history-common rounded-1">
          <TabBar
            type={TAB_TYPE.TEXT}
            size={isMobile ? Size.LG : Size.XL}
            options={ORDER_HISTORY_TYPE_LIST.filter(item => item.label !== LANG('简易合约') || !isMobile || enableH5Lite )}
            value={type}
            onChange={onOrderTabChange}
            className="order-history-tab"
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
    background-color:var(--fill_bg_1);
    padding: 24px;
    @media ${MediaInfo.mobile} {
      padding: 16px;
    }
    :global(.order-history-tab) {
      width: auto;
      padding: 0;
      :global(.tabs) {
        width: 100%;
        gap: 24px;
      }
      :global(.tab) {
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding-top: 0 !important;
      }
    }
  }
`;
