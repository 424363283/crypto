import { EnableAuthenticationModal } from '@/components/modal';
import { LANG } from '@/core/i18n';
import { Account, UserInfo } from '@/core/shared';
import { FC, useCallback, useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import CommonIcon from '../common-icon';
import { Button } from '../button';
import { Size } from '../constants';

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
      <CommonIcon name='common-warning-ring-tips-0' size={32} enableSkin />
      <div className='content'>
        <div className='title'>
          {LANG('启用双重身份验证')} {'(2FA)'}
        </div>
        <div className='description'>
          {description || LANG('为提升您账户安全等级请至少再多绑定一项2FA。至少开启两项2FA验证项才能提现和转账。')}
        </div>
      </div>
      <Button type='primary' rounded size={Size.SM} width={100} onClick={onOpen}>
        {LANG('立即设置')}
      </Button>
      <EnableAuthenticationModal visible={visible} onClose={onClose} user={user} />
      <style jsx>{styles}</style>
    </div>
  );
};

const styles = css`
  .enable-authentication {
    display: flex;
    flex-shrink: 0;
    padding: 16px;
    flex-direction: column;
    align-items: center;
    just-content: center;
    border-radius: 16px;
    background: var(--fill_3);
    gap: 13px;
    :global(.icon) {
      width: 32px;
      height: 32px;
      flex-shrink: 0;
    }
    .content {
      display: flex;
      width: 261px;
      flex-shrink: 0;
      flex-direction: column;
      gap: 8px;
      .title {
        color: var(--text_1);
        text-align: center;
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: 14px; /* 100% */
      }
      .description {
        color: var(--text_3);
        text-align: center;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 18px; /* 150% */
      }
    }
  }
`;

export default EnableAuthentication;
