import { getUrlQueryParams } from '@/core/utils';
import dynamic from 'next/dynamic';
import AddressTable from '../address';
import { MAIN_NAV_TYPE } from '../constants';
import SecuritySettingContainer from '../security-setting';
import GlobalSetting from './global-setting';
import { OverviewCard } from './overview-card';
const IdCard = dynamic(() => import('./id-card'), { ssr: false });

const MiddleComponent = () => {
  const type = getUrlQueryParams('type');
  const MiddleColumnMap: any = {
    [MAIN_NAV_TYPE.OVERVIEW]: (
      <>
        <IdCard />
        <OverviewCard />
      </>
    ),
    [MAIN_NAV_TYPE.SECURITY_SETTING]: <SecuritySettingContainer />,
    [MAIN_NAV_TYPE.ADDRESS]: <AddressTable />,
    [MAIN_NAV_TYPE.SETTING]: <GlobalSetting />,
  };
  if (!type) {
    return MiddleColumnMap[MAIN_NAV_TYPE.OVERVIEW];
  }
  return MiddleColumnMap[type];
};
export default MiddleComponent;
