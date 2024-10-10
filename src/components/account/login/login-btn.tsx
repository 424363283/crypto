import { Button } from '@/components/button';
import { LANG } from '@/core/i18n/src/page-lang';
import { memo } from 'react';
import { useLogin } from '../hooks/useLogin';
export const LoginButton = memo((props: { shouldDisableBtn: boolean; onLoginSuccess: () => void }) => {
  const { onLoginSuccess } = props;
  const [handleLogin] = useLogin(onLoginSuccess);
  const { shouldDisableBtn } = props;
  return (
    <Button
      type='primary'
      className={shouldDisableBtn ? 'disabled' : ''}
      height={50}
      style={{ width: '100%' }}
      onClick={handleLogin}
    >
      {LANG('登录')}
    </Button>
  );
});
