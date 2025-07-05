import Image from '@/components/image';
import { BasicModal } from '@/components/modal';
import { useRouter } from '@/core/hooks/src/use-router';
import { LANG } from '@/core/i18n';
import { UserInfo } from '@/core/shared';
import { clsx } from '@/core/utils';
import { useState } from 'react';
import css from 'styled-jsx/css';
import { Button } from '../button';

enum BIND_OPTIONS {
  GA = 'ga',
  EMAIL = 'email',
  PWD = 'pwd',
}
const EnableAuthenticationModal = ({
  visible,
  onClose = () => {},
  user,
  config,
}: {
  visible: boolean;
  onClose?: () => void;
  user: UserInfo | null;
  config?: {
    closeBindPwd?: boolean; // 关闭绑定资金密码验证项
    closeBindEmail?: boolean;
    closeBindGoogle?: boolean;
  };
}) => {
  const { closeBindPwd = false } = config || {};
  const router = useRouter();
  const [active, setActive] = useState(BIND_OPTIONS.GA);
  const goToBind = () => {
    const BIND_URL_MAP: { [key: string]: string } = {
      ga: '/account/dashboard?type=security-setting&option=google-verify',
      pwd: '/account/dashboard?type=security-setting&option=setting-funds-password',
      email: '/account/dashboard?type=security-setting&option=bind-email',
    };
    if (BIND_URL_MAP.hasOwnProperty(active)) {
      router.push(BIND_URL_MAP[active]);
    }
  };
  const { bindGoogle, bindEmail, bindPassword } = user || {};
  return (
    <BasicModal
      open={visible}
      width={580}
      onCancel={onClose}
      title={LANG('安全验证')}
      cancelButtonProps={{ style: { display: 'none' } }}
      okButtonProps={{ style: { display: 'none' } }}
      footer={null}
    >
      <div className='modal'>
        <div className='title'>{LANG('启用双重认证以提高您的账户安全，推荐绑定谷歌验证。')}</div>
        <div className='section'>
          {!bindGoogle && (
            <div className='type'>
              <div
                className={clsx('t-box', active === BIND_OPTIONS.GA && 'active')}
                onClick={() => {
                  setActive(BIND_OPTIONS.GA);
                }}
              >
                <Image src='/static/images/account/ga-verify.svg' className='icon' width='80' height='80' enableSkin />
                <div className='label'>{LANG('开启谷歌验证')}</div>
              </div>
              <div className='tips'>{LANG('推荐')}</div>
            </div>
          )}
          {!bindEmail && (
            <div className='type'>
              <div
                className={clsx('t-box', active === BIND_OPTIONS.EMAIL && 'active')}
                onClick={() => {
                  setActive(BIND_OPTIONS.EMAIL);
                }}
              >
                <Image
                  src='/static/images/account/email-verify.svg'
                  className='icon'
                  width='80'
                  height='80'
                  enableSkin
                />
                <div className='label'>{LANG('开启邮箱验证')}</div>
              </div>
            </div>
          )}
          {!bindPassword && !closeBindPwd && (
            <div className='type'>
              <div
                className={clsx('t-box', active === BIND_OPTIONS.PWD && 'active')}
                onClick={() => {
                  setActive(BIND_OPTIONS.PWD);
                }}
              >
                <Image
                  src='/static/images/account/password-verify.svg'
                  className='icon'
                  width='80'
                  height='80'
                  enableSkin
                />
                <div className='label'>{LANG('开启资金密码')}</div>
              </div>
            </div>
          )}
        </div>
        <Button type='primary' className='button' onClick={goToBind}>
          {LANG('立即设置')}
        </Button>
      </div>
      <style jsx>{styles}</style>
    </BasicModal>
  );
};

export default EnableAuthenticationModal;
const styles = css`
  .modal {
    padding: 0 0px 30px;
    .title {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 80px;
      font-size: 15px;
      font-weight: 500;
      color: var(--theme-font-color-3);
      margin-bottom: 20px;
    }
    .section {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: flex-start;
      .type {
        text-align: center;
        .t-box {
          height: 200px;
          cursor: pointer;
          width: 250px;
          background: var(--theme-background-color-4);
          padding: 10px 16px 8px;
          border-radius: 6px;
          border: 2px solid #ebeef1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          &:hover,
          &.active {
            border-color: var(--skin-primary-color);
          }
        }

        .icon {
          width: 72px;
          height: 72px;
        }
        .label {
          font-size: 14px;
          font-weight: 500;
          color: var(--theme-font-color-1);
          line-height: 21px;
          text-align: center;
        }
        .tips {
          margin-top: 8px;
          height: 17px;
          font-size: 12px;
          font-weight: 500;
          color: var(--theme-font-color-3);
          line-height: 17px;
        }
      }
    }
    :global(.button) {
      cursor: pointer;
      text-align: center;
      width: 100%;
      height: 50px;
      line-height: 50px;
      margin-top: 36px;
    }
  }
`;
