import { MediaInfo } from '@/core/utils';
import { PasswordInput } from '../../basic-input/password-input';
import { InputPhone } from '../components/input-phone';
import { useBtnStatus } from '../hooks/useBtnStatus';
import { TAB_TYPE } from '../types';
import { LoginButton } from './login-btn';
import { ThirdPartBtns } from '../components/third-part-btns';
import { Desktop, Mobile, MobileOrTablet } from '@/components/responsive';
import { LoginFooter } from './login-footer';
import { AutoLogin } from './auto-login';

export const PhoneLogin = ({ onLoginSuccess }: { onLoginSuccess: () => void }) => {
  const [shouldDisableBtn] = useBtnStatus(TAB_TYPE.PHONE_LOGIN);
  return (
    <div>
    <MobileOrTablet forceInitRender={false}>
      <InputPhone showLabel={true} />
      <PasswordInput showLabel={true} />
    </MobileOrTablet>
    <Desktop >
      <InputPhone showLabel={false} />
      <PasswordInput showLabel={false} />
      <AutoLogin />
    </Desktop>
      <LoginButton shouldDisableBtn={shouldDisableBtn} onLoginSuccess={onLoginSuccess} />
      <ThirdPartBtns />
      <MobileOrTablet forceInitRender={false}>
        <LoginFooter />
      </MobileOrTablet>
    </div>
  );
};
