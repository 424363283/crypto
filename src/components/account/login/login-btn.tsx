import { Button} from '@/components/button';
import { LANG } from '@/core/i18n/src/page-lang';
import { memo } from 'react';
import { useLogin } from '../hooks/useLogin';
import { Size } from '@/components/constants';
import { useResponsive } from '@/core/hooks';
export const LoginButton = memo((props: { shouldDisableBtn: boolean; onLoginSuccess: () => void }) => {
  const { onLoginSuccess } = props;
  const [handleLogin] = useLogin(onLoginSuccess);
  const { shouldDisableBtn } = props;
  const { isMobile } = useResponsive();

  return (
    <Button
      className={shouldDisableBtn ? 'disabled' : ''}
      style={{ width: '100%'}}
      size={isMobile? Size.LG : Size.XL}
      type='primary'
      rounded
      onClick={handleLogin}
    >
      {LANG('登录')}
    </Button>
  );
});
