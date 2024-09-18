import { InputPhone } from '../components/input-phone';
import { useBtnStatus } from '../hooks/useBtnStatus';
import { TAB_TYPE } from '../types';
import { ForgetButton } from './forget-btn';

export const PhoneForget = () => {
  const [shouldDisableBtn] = useBtnStatus(TAB_TYPE.PHONE_FORGET);
  return (
    <>
      <InputPhone />
      <ForgetButton shouldDisableBtn={shouldDisableBtn} />
    </>
  );
};
