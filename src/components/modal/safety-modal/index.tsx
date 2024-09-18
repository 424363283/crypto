import Image from '@/components/image';
import { BasicModal } from '@/components/modal';
import { useRouter } from '@/core/hooks/src/use-router';
import { LANG } from '@/core/i18n';
import { MediaInfo, clsx } from '@/core/utils';
import { useState } from 'react';
import css from 'styled-jsx/css';

const SafetyModel = ({ open, onCancel }: { open: boolean; onCancel: () => void }) => {
  const [active, setActive] = useState('ga');
  const router = useRouter();

  // 跳转绑定
  const _goToSet = () => {
    if (active === 'ga') {
      router.push({
        pathname: '/account/dashboard',
        query: {
          type: 'security-setting',
          option: 'google-verify',
        },
      });
    } else if (active === 'pwd') {
      router.push({
        pathname: '/account/dashboard',
        query: {
          type: 'security-setting',
          option: 'setting-funds-password',
        },
      });
    }
  };

  return (
    <BasicModal width={520} open={open} title={LANG('安全验证')} footer={null} onCancel={onCancel}>
      <div className={'modal'}>
        <div className={'title'}>{LANG('启用双重认证以提高您的账户安全，推荐绑定谷歌验证。')}</div>
        <div className={'section'}>
          <div className={'type'}>
            <div className={clsx('t-box', active === 'ga' && 'active')} onClick={() => setActive('ga')}>
              <Image
                src={'/static/images/common/type_google.png'}
                className={'icon'}
                alt='type_google'
                width={72}
                height={72}
                enableSkin
              />
              <div className={'label'}>{LANG('开启谷歌验证')}</div>
            </div>
            <div className={'tips'}>{LANG('推荐')}</div>
          </div>
          <div className={'type'}>
            <div className={clsx('t-box', active === 'pwd' && 'active')} onClick={() => setActive('pwd')}>
              <Image
                src={'/static/images/common/type_password.png'}
                className={'icon'}
                alt='type_password'
                width={72}
                height={72}
                enableSkin
              />
              <div className={'label'}>{LANG('开启资金密码')}</div>
            </div>
          </div>
        </div>
        <div className={'button'} onClick={_goToSet}>
          {LANG('立即设置')}
        </div>
        <style jsx> {styles}</style>
      </div>
    </BasicModal>
  );
};

const styles = css`
  .modal {
    padding: 0 30px 30px;
    .title {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      width: 100%;
      font-size: 15px;
      font-weight: 500;
      color: var(--theme-font-color-3);
      margin-bottom: 20px;
    }
    .section {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: flex-start;
      max-width: 350px;
      margin: 0 auto;
      .type {
        text-align: center;
        .t-box {
          cursor: pointer;
          background: var(--theme-background-color-1);
          padding: 10px 16px 8px;
          border-radius: 6px;
          border: 2px solid var(--theme-border-color-3);
          &:hover,
          &.active {
            border-color: var(--skin-color-active);
          }
        }
        :global(.icon) {
          width: auto;
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
          line-height: 16px;
        }
      }
    }
    .button {
      cursor: pointer;
      text-align: center;
      width: 100%;
      height: 50px;
      line-height: 50px;
      background: var(--skin-color-active);
      border-radius: 4px;
      color: var(--skin-font-color);
      border-radius: 2px;
      margin-top: 36px;
      font-size: 15px;
      font-weight: 500;
    }
    @media ${MediaInfo.mobile} {
      padding: 0 16px 16px;
      :global(.icon) {
        width: auto !important;
        height: 50px !important;
      }
    }
  }
`;
export default SafetyModel;
