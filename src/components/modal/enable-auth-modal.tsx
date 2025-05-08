import Image from '@/components/image';
import { BasicModal } from '@/components/modal';
import { useRouter } from '@/core/hooks/src/use-router';
import { LANG } from '@/core/i18n';
import { UserInfo } from '@/core/shared';
import { clsx } from '@/core/utils';
import { useState } from 'react';
import css from 'styled-jsx/css';
import { Button } from '../button';
import { Size } from '../constants';
import { useResponsive } from '@/core/hooks';
import { MobileBottomSheet } from '../mobile-modal';

enum BIND_OPTIONS {
  GA = 'ga',
  EMAIL = 'email',
  PWD = 'pwd',
}
const EnableAuthenticationModal = ({
  visible,
  onClose = () => { },
  user,
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
  const router = useRouter();
  const [active, setActive] = useState(BIND_OPTIONS.GA);
  const { isDesktop } = useResponsive();

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


  const _main = () => {
    return <>
       <div className='modal'>
        <div className='section'>
          {!bindGoogle && (
            <div className='type'>
              <div
                className={clsx('t-box', active === BIND_OPTIONS.GA && 'active')}
                onClick={() => {
                  setActive(BIND_OPTIONS.GA);
                }}
              >
                <Image src='/static/images/account/ga-verify.svg' className='icon' width='60' height='60' enableSkin />
              </div>
              <div className='tips'>{LANG('未绑定身份验证器，无法提币和转账，请先绑定后再操作。')}</div>
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
                  width='60'
                  height='60'
                  enableSkin
                />
                <div className='label'>{LANG('开启邮箱验证')}</div>
              </div>
            </div>
          )}
          {/* {!bindPassword && !closeBindPwd && (
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
          )} */}
        </div>
        <Button type='primary' size={Size.LG} rounded className='button' onClick={goToBind}>
          {LANG('去绑定')}
        </Button>
      </div>
      <style jsx>{styles}</style>
    </>
  }

  return (
    isDesktop?
    <BasicModal
      open={visible}
      width={480}
      onCancel={onClose}
      title={LANG('安全验证')}
      footer={null}
      cancelButtonProps={{ style: { display: 'none' } }}
      okButtonProps={{ style: { display: 'none' } }}
    >
      { _main() }
    </BasicModal>
    :
    <MobileBottomSheet
      visible={visible}
      content={_main()}
      close={onClose}
      hasBtn={false}
      title={LANG('安全验证')}
    />
  );
};

export default EnableAuthenticationModal;
const styles = css`
  .modal {
    .section {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: flex-start;
      .type {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 8px;
        align-self: stretch;
        .t-box {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          flex-shrink: 0;
          border-radius: 16px;
          border: 1px solid var(--fill_line_3);
          &:hover,
          &.active {
            border-color: var(--fill_line_3);
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
          width: 196px;
          color: var(--text_3);
          text-align: center;
          font-size: 14px;
          font-weight: 400;
          line-height: 22px;
        }
      }
    }
    :global(.button) {
      width: 100%;
      margin-top: 24px;
    }
  }
  :global(.bottom-sheet-box){
    .modal{
     width:100%;
     :global(.icon){
      margin:0;
     }
     :global(.button){
       width:calc(100% - 30px);
     }
    }
  }  
`;
