import { LANG } from '@/core/i18n/src/page-lang';
import { SENCE } from '@/core/shared';
import { LOCAL_KEY } from '@/core/store';
import { clsx } from '@/core/utils/src/clsx';
import { MediaInfo } from '@/core/utils/src/media-info';
import { useEffect } from 'react';
import css from 'styled-jsx/css';
import { useSendCaptchaCode } from '../hooks/useSendCaptcha';
interface CaptchaButtonProps {
  scene: SENCE;
  type: LOCAL_KEY;
  autoSend?: boolean;
}
export const CaptchaButton = (props: CaptchaButtonProps) => {
  const { scene, type, autoSend = false } = props;
  const { countdown, isActive, getVerificationCode, isValid = false } = useSendCaptchaCode(type, scene);
  useEffect(() => {
    if (autoSend) {
      getVerificationCode();
    }
  }, [autoSend]);
  return (
    <span
      onClick={getVerificationCode}
      className={clsx('init-btn-status', isValid ? 'verify-btn' : '', isActive ? 'verify-btn-active' : '')}
    >
      {isActive ? countdown + 's' : LANG('获取验证码')}
      <style jsx>{styles}</style>
    </span>
  );
};
const styles = css`
  .init-btn-status {
    border-radius: 5px;
    color: var(--text-brand);
    font-size: 14px;
    padding: 6px 0 6px 16px;
    font-weight: 400;
    flex-shrink: 0;
    text-align: center;
  }
  .verify-btn {
    cursor: pointer;
    color: var(--text-brand);
    border-radius: 5px;
    font-weight: 500;
    display: inline-block;
  }
  .verify-btn-active {
    cursor: not-allowed;
    color: var(--text-brand);
    border: none;
  }
`;
