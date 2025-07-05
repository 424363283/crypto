import { MediaInfo } from '@/core/utils';
import { PasswordInput } from '../../basic-input/password-input';
import { InputPhone } from '../components/input-phone';
import { useBtnStatus } from '../hooks/useBtnStatus';
import { TAB_TYPE } from '../types';
import { LoginButton } from './login-btn';
import { ThirdPartBtns } from '../components/third-part-btns';
import { Desktop, MobileOrTablet } from '@/components/responsive';
import { LoginFooter } from './login-footer';
import { LoginForgetButton } from './login-resetpwd';
import { LoginSwitchLoginReg } from './login-switch-register-reg';
import { useKeyboardScroll } from '@/hooks/useKeyboardScroll';

export const PhoneLogin = ({ onLoginSuccess }: { onLoginSuccess: () => void }) => {
  const [shouldDisableBtn] = useBtnStatus(TAB_TYPE.PHONE_LOGIN);
  useKeyboardScroll();
  return (
    <div>
      <MobileOrTablet forceInitRender={false}>
        <InputPhone showLabel={true} />
        <PasswordInput showLabel={true} />
      </MobileOrTablet>
      <Desktop >
        <InputPhone showLabel={false} />
        <PasswordInput showLabel={false} />
      </Desktop>
      <LoginForgetButton />
      <LoginButton shouldDisableBtn={shouldDisableBtn} onLoginSuccess={onLoginSuccess} />
      <MobileOrTablet forceInitRender={false}>
        <LoginFooter />
      </MobileOrTablet>
      <Desktop >
        <LoginSwitchLoginReg />
      </Desktop>
      <ThirdPartBtns />
    </div>
  );
};
