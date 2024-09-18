import { InputEmail } from '../components/input-email';
import { useBtnStatus } from '../hooks/useBtnStatus';
import { TAB_TYPE } from '../types';
import { ForgetButton } from './forget-btn';
export const EmailForget = () => {
  const [shouldDisableBtn] = useBtnStatus(TAB_TYPE.EMAIL_FORGET);
  return (
    <>
      <InputEmail />
      <ForgetButton shouldDisableBtn={shouldDisableBtn} />
    </>
  );
};
