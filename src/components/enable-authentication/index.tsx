import { EnableAuthenticationModal } from '@/components/modal';
import { LANG } from '@/core/i18n';
import { Account, UserInfo } from '@/core/shared';
import { FC, useCallback, useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import CommonIcon from '../common-icon';
interface Props {
  className?: string;
  description?: string;
  onVerifyStateChange: (enable: boolean) => void;
}

const EnableAuthentication: FC<Props> = ({ className, description, onVerifyStateChange }) => {
  const [visible, setVisible] = useState(false);
  const [isRender, setIsRender] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const onClose = useCallback(() => setVisible(false), []);
  const onOpen = useCallback(() => setVisible(true), []);
  const getUserInfo = async () => {
    await Account.refreshUserInfo();
    const user = await Account.getUserInfo();
    setUser(user);
    //  未绑定谷歌验证 并且 未开启资金密码
    if (!user?.bindGoogle && !user?.pw_w) {
      setIsRender(true);
      onVerifyStateChange(true);
    } else {
      onVerifyStateChange(false);
    }
  };
  useEffect(() => {
    getUserInfo();
  }, []);
  if (!isRender) return null;
  return (
    <div className={`enable-authentication ${className}`}>
      <CommonIcon name='common-warning-ring-tips-0' size={58} enableSkin />
      <div className='content'>
        <div className='title'>
          {LANG('启用双重身份验证')} {'(2FA)'}
        </div>
        <div className='description'>
          {description || '为提升您账户安全等级请至少再多绑定一项2FA。至少开启两项2FA验证项才能提币。'}
        </div>
        <div className='button' onClick={onOpen}>
          {LANG('立即设置')}
        </div>
      </div>
      <EnableAuthenticationModal visible={visible} onClose={onClose} user={user} />
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .enable-authentication {
    padding: 43px 0 62px;
    background: var(--theme-background-color-3);
    border-radius: 8px;
    display: flex;
    margin: 0 auto;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    :global(.icon) {
      flex: none;
      width: 58px;
      height: 58px;
      margin-right: 20px;
    }
    .content {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      .title {
        font-size: 14px;
        font-weight: 500;
        color: var(--theme-font-color-1);
        margin-bottom: 3px;
        margin-top: 20px;
      }
      .description {
        font-size: 12px;
        font-weight: 400;
        color: var(--theme-font-color-3);
        margin-bottom: 17px;
        max-width: 700px;
        margin-top: 10px;
      }
      .button {
        min-width: 100px;
        height: 36px;
        line-height: 36px;
        padding: 0 22px;
        background: var(--skin-primary-color);
        color: var(--skin-font-color);
        border-radius: 8px;
        font-size: 15px;
        text-align: center;
      }
    }
  }
`;
export default EnableAuthentication;
