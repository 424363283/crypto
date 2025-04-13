import { Button } from '@/components/button';
import { LANG } from '@/core/i18n';

export const GoVerifyBtn = ({
  onBtnClick,
  disabled,
  btnText
}: {
  onBtnClick: () => void;
  disabled: boolean;
  btnText?: string;
}) => {
  return (
    <div className="footer-button">
      <Button type="primary" onClick={onBtnClick} className="ok-button" disabled={disabled}>
        {LANG(btnText || '去认证')}
      </Button>
    </div>
  );
};
