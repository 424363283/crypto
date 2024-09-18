import { BasicInput, INPUT_TYPE } from '@/components/basic-input';
import { Button } from '@/components/button';
import CommonIcon from '@/components/common-icon';
import { EnableAuthenticationModal } from '@/components/modal';
import { useRouter } from '@/core/hooks/src/use-router';
import { LANG } from '@/core/i18n';
import { MediaInfo, isPhishing } from '@/core/utils';
import { memo, useCallback, useState } from 'react';
import css from 'styled-jsx/css';
import Code from './code';
import { store } from './store';

export const Home = ({ next }: { next: () => void }) => {
  const router = useRouter();
  const { state } = router;
  const user = state.user;
  const [visible, setVisible] = useState(false);
  const antiPhishing = user?.antiPhishing;
  const _next = () => {
    if (user?.bindEmail || user?.bindGoogle) {
      next();
    } else {
      setVisible(true);
    }
  };

  // 关闭弹窗
  const _onClose = () => {
    setVisible(false);
  };
  const ChangeAntiPhishingCode = memo(() => {
    const [value, setValue] = useState('');
    const onInputChange = useCallback((value: string) => {
      store.antiPhishingCode = value;
      setValue(value);
    }, []);
    return (
      <div className='change-anti-phishing'>
        <Code title={LANG('旧防钓鱼码')} code={antiPhishing} />
        <BasicInput
          type={INPUT_TYPE.ANTI_PHISHING_CODE}
          key='ANTI_PHISHING_CODE'
          label={LANG('新防钓鱼码')}
          placeholder={LANG('请输入防钓鱼码')}
          withBorder
          autoFocus
          maxLength={20}
          value={value}
          onInputChange={onInputChange}
        />
        <Button onClick={_next} type='primary' className='btn' disabled={!isPhishing(value)}>
          {LANG('更改防钓鱼码')}
        </Button>
        <div className='divided-line' />
        <div className='bottom-tips-content'>
          <p className='title'>{LANG('什么是防钓鱼码?')}</p>
          <p className='description'>
            {LANG('防钓鱼码是你自己设置的一串字符，能够帮助你识别仿冒 YMEX 的网站或者邮件')}
          </p>
          <p className='title'>{LANG('防钓鱼码会出现在哪？')}</p>
          <p className='description'>{LANG('设置好防钓鱼码后，每一封 YMEX 发给您的邮件都会带有这串字符。')}</p>
        </div>
        <style jsx>{styles}</style>
      </div>
    );
  });
  const SetAntiPhishingCode = () => {
    const [value, setValue] = useState('');
    const onInputChange = useCallback((value: string) => {
      store.antiPhishingCode = value;
      setValue(value);
    }, []);
    return (
      <div className='setting-anti-phishing'>
        <div className='create-anti-phishing'>
          <BasicInput
            type={INPUT_TYPE.ANTI_PHISHING_CODE}
            label={LANG('新防钓鱼码')}
            placeholder={LANG('请输入防钓鱼码')}
            withBorder
            maxLength={20}
            value={value}
            onInputChange={onInputChange}
          />
          <Button onClick={_next} type='primary' className='btn' disabled={!isPhishing(value)}>
            {LANG('创建防钓鱼码')}
          </Button>
        </div>
        <div className='divided-line' />
        <div className='item'>
          <div className='title'>{LANG('什么是防钓鱼码？')}</div>
          <div className='text'>{LANG('防钓鱼码是你自己设置的一串字符，能够帮助你识别仿冒 YMEX 的网站或者邮件')}</div>
        </div>
        <div className='item'>
          <div className='title'>{LANG('防钓鱼码会出现在哪？')}</div>
          <div className='text'>{LANG('设置好防钓鱼码后，每一封 YMEX 发给您的邮件都会带有这串字符。')}</div>
        </div>
        <style jsx>{styles}</style>
      </div>
    );
  };
  return (
    <div className='home'>
      <div className='prompt'>
        <CommonIcon name='common-warning-tips-0' size={12} />
        <span>{LANG('请勿向任何人揭露你的密码或验证码，包括 YMEX 客服。')}</span>
      </div>
      {!!antiPhishing ? <ChangeAntiPhishingCode /> : <SetAntiPhishingCode />}
      <EnableAuthenticationModal visible={visible} onClose={_onClose} user={user} config={{ closeBindPwd: true }} />
      <style jsx>{styles}</style>
    </div>
  );
};

const styles = css`
  .home {
    margin: 0 auto;
    .prompt {
      display: flex;
      align-items: center;
      font-size: 12px;
      font-weight: 400;
      color: var(--theme-font-color-1);
      line-height: 20px;
      background: rgba(240, 78, 63, 0.08);
      padding: 10px 28px;
      border-radius: 5px;
      :global(img) {
        margin-right: 10px;
      }
    }
    :global(.btn) {
      margin-top: 30px;
      display: block;
      height: 44px;
      line-height: 44px;
      width: 100%;
      margin-bottom: 30px;
    }
    .tips {
      text-align: right;
      span {
        font-size: 14px;
        font-weight: 400;
        color: var(--skin-primary-color);
        line-height: 20px;
        cursor: pointer;
      }
    }
  }
  .change-anti-phishing,
  .setting-anti-phishing {
    width: 530px;
    @media ${MediaInfo.mobile} {
      width: 100%;
    }
    .item {
      .title {
        font-size: 16px;
        font-weight: 500;
        color: var(--theme-font-color-1);
        padding: 30px 0 12px;
      }
      .text {
        font-size: 14px;
        font-weight: 400;
        color: #707a8a;
        line-height: 20px;
      }
    }
    .divided-line {
      width: 100%;
      border: 1px solid var(--skin-border-color-1);
    }
    .bottom-tips-content {
      .title {
        color: var(--theme-font-color-1);
        font-size: 16px;
        font-weight: 500;
        margin-top: 30px;
      }
      .description {
        font-size: 14px;
        font-weight: 500;
        color: var(--const-color-grey);
        margin-top: 15px;
      }
    }
    .create-anti-phishing {
      margin-top: 30px;
    }
  }

  :global(.modal) {
    padding: 30px;
    .btn {
      margin-top: 30px;
    }
    :global(.modal-tips) {
      margin-left: 12px;
    }
  }
`;
