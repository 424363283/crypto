import { useRouter } from '@/core/hooks';
import { Account, Swap } from '@/core/shared';
import { getUrlQueryParams } from '@/core/utils';
import { useEffect, useState } from 'react';
import { CommonLayout } from '../components/common-layout';
import { useNavMap } from './hooks/use-nav-map';
import AssetLitePage from './modules/asset-lite';
import AssetOverViewPage from './modules/asset-overview';
import AssetSpot from './modules/asset-spot';
import AssetSwapPage from './modules/asset-swap';
import Coupon from './modules/coupon';
import ExchangeRecord from './modules/exchange-record';
import FundHistory from './modules/fund-history';
import PowerExchange from './modules/power-exchange';
import { ASSET_TYPE, SUB_MODULE_TYPE } from './types';
import OpenContractModal from '@/components/trade-ui/trade-view/swap/components/modal/open-contract-modal';

export default function AssetsOverviewContainer() {
  const [verifiedDeveloped, setVerifiedDeveloped] = useState(false);
  const router = useRouter();

  const fetchUserInfo = async () => {
    const userInfo = await Account.getUserInfo();
    setVerifiedDeveloped(userInfo?.verifiedDeveloped || false);
    if (!userInfo?.verifiedDeveloped && type === ASSET_TYPE.TAX_REPORT) {
      router.replace('/account/fund-management/assets-overview', '', { query: { type: 'overview' } });
    }
  };
  
  const type = getUrlQueryParams('type') as ASSET_TYPE;
  const subModule = getUrlQueryParams('module') as SUB_MODULE_TYPE;
  const { NAV_MAP } = useNavMap(verifiedDeveloped);
  const { openContractVisible } = Swap.Trade.store.modal;
  
  useEffect(() => {
    fetchUserInfo();
  }, []);

  const ASSET_MODULES_MAP: any = {
    [ASSET_TYPE.ASSETS_SPOT]: () => {
      return <AssetSpot />;
    },
    [ASSET_TYPE.ASSETS_SWAP]: () => {
      return <AssetSwapPage key={'c' + type} />;
    },
    [ASSET_TYPE.ASSETS_SWAP_U]: () => {
      return <AssetSwapPage key={'u' + type} />;
    },
    [ASSET_TYPE.ASSETS_LITE]: () => <AssetLitePage />,
    [ASSET_TYPE.ASSETS_FUND]: () => <FundHistory />,
    [ASSET_TYPE.CONTRACTS_COUPON]: () => <Coupon />,
  };
  
  const renderAssetsModules = () => {
    if (subModule === SUB_MODULE_TYPE.POWER_EXCHANGE) {
      return <PowerExchange />;
    }
    if (subModule === SUB_MODULE_TYPE.POWER_EXCHANGE_RECORD) {
      return <ExchangeRecord />;
    }
    if (ASSET_MODULES_MAP.hasOwnProperty(type)) {
      return ASSET_MODULES_MAP[type]();
    }
    return <AssetOverViewPage />;
  };

  return <CommonLayout navItems={NAV_MAP}>
    <>
      {renderAssetsModules()}
      {openContractVisible && <OpenContractModal />}
    </>
  </CommonLayout>;
}
