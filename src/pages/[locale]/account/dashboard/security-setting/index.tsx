import { getUrlQueryParams, MediaInfo } from '@/core/utils';
import dynamic from 'next/dynamic';
import css from 'styled-jsx/css';
import BindEmail from '../../bind-email';
import BindPhone from '../../bind-phone';
import ResetEmail from '../../reset-email';
import { ResetFundsPassword } from '../../reset-funds-password';
import { ResetLoginPassword } from '../../reset-login-password';
import ResetPhone from '../../reset-phone';
import ResetType from '../../reset-type';
import { SettingPasswordForm } from '../../setting-funds-password';
import { UpdatePasswordForm } from '../../update-funds-password';
import VerifyPage from '../../verify';
import SettingPanel from './components/setting-panel';
import React from 'react';
const AntiPhishing = dynamic(() => import('../../anti-phishing'));
const GoogleVerify = dynamic(() => import('../../google-verify'));

enum BIND_OPTION_TYPE {
  BIND_PHONE = 'bind-phone',
  BIND_EMAIL = 'bind-email',
  BIND_GA = 'google-verify',
  VERIFY = 'verify',
  ANTI_PHISHING = 'anti-phishing',
  RESET_EMAIL = 'reset-email',
  RESET_PHONE = 'reset-phone',
  RESET_TYPE = 'reset-type',
  RESET_LOGIN_PASSWORD = 'reset-login-password',
  RESET_FUNDS_PASSWORD = 'reset-funds-password',
  SETTINGS_FUNDS_PASSWORD = 'setting-funds-password',
  UPDATE_FUNDS_PASSWORD = 'update-funds-password'
}

const BIND_OPTION_ROUTE: any = {
  [BIND_OPTION_TYPE.BIND_PHONE]: <BindPhone />,
  [BIND_OPTION_TYPE.BIND_EMAIL]: <BindEmail />,
  [BIND_OPTION_TYPE.BIND_GA]: <GoogleVerify />,
  [BIND_OPTION_TYPE.VERIFY]: <VerifyPage />,
  [BIND_OPTION_TYPE.ANTI_PHISHING]: <AntiPhishing />,
  [BIND_OPTION_TYPE.RESET_EMAIL]: <ResetEmail />,
  [BIND_OPTION_TYPE.RESET_PHONE]: <ResetPhone />,
  [BIND_OPTION_TYPE.RESET_TYPE]: <ResetType />,
  [BIND_OPTION_TYPE.RESET_LOGIN_PASSWORD]: <ResetLoginPassword />,
  [BIND_OPTION_TYPE.RESET_FUNDS_PASSWORD]: <ResetFundsPassword />,
  [BIND_OPTION_TYPE.SETTINGS_FUNDS_PASSWORD]: <SettingPasswordForm />,
  [BIND_OPTION_TYPE.UPDATE_FUNDS_PASSWORD]: <UpdatePasswordForm />
};

const SettingPanelOrBindOption = ({type, option}) => {
  if (type === 'security-setting' && !option) {
    return <SettingPanel />;
  }
  return BIND_OPTION_ROUTE[option as BIND_OPTION_TYPE];
};
function SecuritySettingContainer() {
  const type = getUrlQueryParams('type') || 'security-setting';
  const option = getUrlQueryParams('option');

  return (
    <div className="security-setting-container">
      <SettingPanelOrBindOption type={type} option={option} />
      <style jsx>{styles}</style>
    </div>
  );
}
const styles = css`
  .security-setting-container {
    padding-bottom: 20px;
    @media ${MediaInfo.mobile} {
      margin: 0 12px 12px;
    }
  }
`;
export default SecuritySettingContainer;
