import { getUrlQueryParams } from '@/core/utils';
import dynamic from 'next/dynamic';
import { message } from 'antd';
import AddressTable from '../address';
import { MAIN_NAV_TYPE } from '../constants';
import SecuritySettingContainer from '../security-setting';
import GlobalSetting from './setting/global-setting';
import { OverviewCard } from './overview-card';
import { useEffect,useState } from 'react';
const UserInfoCard = dynamic(() => import('./user-info-card'), { ssr: false });
import { IdentityVerificationModal } from '@/components/modal';
import { getKycConfigApi } from '@/core/network/src/api/account';
import { LOCAL_KEY, localStorageApi } from '@/core/store';
import { useKycState } from '@/core/hooks';

const MiddleComponent = () => {

  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [remainAmount, setRemainAmount] = useState(0);
  const [unit, setUnit] = useState('BTC');


  const { updateKYCAsync,kycState } = useKycState();
  const type = getUrlQueryParams('type');


  useEffect(() => {
    fetchTodayRemainWithdrawLimit();
    updateKYCAsync(true);
    localStorageApi.removeItem(LOCAL_KEY.COUNTRY_INDEX);
  }, [type]);
  
  const  showVerifyModalFn = () => {
    setShowVerifyModal(true);
  };

    // 今日剩余提币限额
    const fetchTodayRemainWithdrawLimit = async () => {
     
      let result = await getKycConfigApi();
    
      if (result.code === 200) {
        const avaiable = result.data;
        const kyc2 = avaiable[2] || {}
        const { amount,currency } = kyc2?.digital || {}
        setRemainAmount(amount || 0);
        setUnit(currency || 'BTC');
      } else {
        message.error(result.message);
      }
    };
  
    const onVerifiedDone = () => {
      setShowVerifyModal(false);
      updateKYCAsync(true);
      window.location.reload();
    };
  
    const onCloseModal = (evt: any) => {
      evt?.preventDefault();
      evt?.stopPropagation();
      setShowVerifyModal(false);
    };

  const MiddleColumnMap: any = {
    [MAIN_NAV_TYPE.OVERVIEW]: (
      <>
        <UserInfoCard kycState={kycState} showCardPopFn={() => showVerifyModalFn()} />
        <OverviewCard kycState={kycState} showCardPopFn={() => showVerifyModalFn()} />

        <IdentityVerificationModal
          open={showVerifyModal}
          remainAmount={remainAmount}
          unit={unit}
          onCancel={onCloseModal}
          onVerifiedDone={onVerifiedDone}
        />
      </>
    ),
    [MAIN_NAV_TYPE.SECURITY_SETTING]: <SecuritySettingContainer />,
    [MAIN_NAV_TYPE.ADDRESS]: <AddressTable />,
    [MAIN_NAV_TYPE.SETTING]: <GlobalSetting />
  };
  if (!type) {
    return MiddleColumnMap[MAIN_NAV_TYPE.OVERVIEW];
  }
  return MiddleColumnMap[type];
};
export default MiddleComponent;
