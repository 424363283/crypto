import { INPUT_TYPE } from '@/components/basic-input/types';
import { LANG } from '@/core/i18n/src/page-lang';
import { clsx } from '@/core/utils/src/clsx';

interface ErrorProps {
  showErrors: boolean;
  hideErrorTips?: boolean;
  type: INPUT_TYPE;
  customErrorTips?: string;
}
export const ErrorTips = (props: ErrorProps) => {
  const { showErrors, hideErrorTips = false, type, customErrorTips } = props;
  if (hideErrorTips) return null;
  const ERROR_TIPS_MAP = {
    [INPUT_TYPE.PASSWORD]: LANG('6-16位由字母、数字和符号组成的密码，不能为纯数字或字母'),
    [INPUT_TYPE.CAPTCHA]: LANG('请输入6位验证码'),
    [INPUT_TYPE.EMAIL]: LANG('邮箱格式错误'),
    [INPUT_TYPE.PHONE]: LANG('手机号码格式错误'),
    [INPUT_TYPE.NORMAL_TEXT]: '',
    [INPUT_TYPE.RESET_PASSWORD]: LANG('6-16位由字母、数字和符号组成的密码，不能为纯数字或字母'),
    [INPUT_TYPE.ANTI_PHISHING_CODE]: LANG('请输入 4-20 个字符，不包括特殊符号。'),
    [INPUT_TYPE.USER_ID]: LANG('UID错误'),
  };
  const isErrorTipsTooLong =
    (customErrorTips && customErrorTips.length > 20) ||
    type === INPUT_TYPE.PASSWORD ||
    type === INPUT_TYPE.RESET_PASSWORD;
  return (
    <div className={clsx('error-input-tips')} style={{ minHeight: isErrorTipsTooLong ? '24px' : '24px' }}>
      {showErrors && <p className='error-info'>{customErrorTips || ERROR_TIPS_MAP[type]}</p>}
    </div>
  );
};
