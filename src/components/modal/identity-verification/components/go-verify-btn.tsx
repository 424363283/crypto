import { Button } from '@/components/button';
import { LANG } from '@/core/i18n';

export const GoVerifyBtn = ({ onBtnClick, disabled }: { onBtnClick: () => void; disabled: boolean }) => {
  return (
    <div className='footer-button'>
      <Button type='primary' onClick={onBtnClick} className='ok-button' disabled={disabled}>
        {LANG('去认证')}
      </Button>
    </div>
  );
};
