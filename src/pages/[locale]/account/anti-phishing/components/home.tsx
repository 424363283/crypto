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
          label={LANG('设置防钓鱼码')}
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
        <div className='bottom-tips-content'>
          <p className='title'>{LANG('什么是防钓鱼码?')}</p>
          <p className='description'>
            {LANG('防钓鱼码是你自己设置的一串字符，能够帮助你识别仿冒 YMEX 的网站或者邮件')}
          </p>
          <div className='line' />
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
          <div className="title">{ LANG('设置防钓鱼码') }</div>
          <BasicInput
            type={INPUT_TYPE.ANTI_PHISHING_CODE}
            label={''}
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
        <div className='bottom-tips-content'>
          <p className='title'>{LANG('什么是防钓鱼码?')}</p>
          <p className='description'>
            {LANG('防钓鱼码是你自己设置的一串字符，能够帮助你识别仿冒 YMEX 的网站或者邮件')}
          </p>
          <div className='line' />
          <p className='title'>{LANG('防钓鱼码会出现在哪？')}</p>
          <p className='description'>{LANG('设置好防钓鱼码后，每一封 YMEX 发给您的邮件都会带有这串字符。')}</p>
        </div>
        <style jsx>{styles}</style>
      </div>
    );
  };
  return (
    <div className='home'>
      <div className="prompt-box">
        <div className='prompt'>
          <CommonIcon name='common-warning-tips-0' size={12} />
          <span>{LANG('请勿向任何人揭露你的密码或验证码，包括 YMEX 客服。')}</span>
        </div>
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
    .prompt-box{
      display: flex;
      align-items: center;
      font-size: 12px;
      font-weight: 400;
      color: var(--theme-font-color-1);
      line-height: 20px;
      background: rgba(240, 78, 63, 0.08);
      padding: 10px 28px;
      @media ${MediaInfo.mobile} {
        margin-bottom: 15px;
      }
      .prompt {
        width:1400px;
        margin:auto;
        :global(img) {
          margin-right: 10px;
        }
        @media ${MediaInfo.mobile} {
          width: auto;
        }
      }
    }
    
    :global(.btn) {
      margin-top: 30px;
      display: block;
      height:56px;
      line-height: 56px;
      width: 100%;
      margin-bottom: 30px;
      border-radius: 28px;
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
    margin: auto;
    @media ${MediaInfo.mobile} {
      width: 100%;
    }
    .bottom-tips-content {
      border:1px solid var(--fill-3);
      border-radius: 5px;
      padding: 15px;
      .line{
        height: 1px;
        width: 100%;
        background: var(--fill-3);
        margin:20px 0;
      }
      .title {
        color: var(--theme-font-color-1);
        font-size: 16px;
        font-weight: 500;
      }
      .description {
        font-size: 14px;
        font-weight: 500;
        color: var(--const-color-grey);
        margin-top: 15px;
      }
    }
    .create-anti-phishing {
      .title{
      font-size:20px;
      color:var(--text-primary);
      font-weight:700;
      margin: 50px 0 30px 0;
      }
      :global(.basic-input-box){
        height: 56px;
        border-input{
          height: 56px;
          line-height: 56px;
        }
        @media ${MediaInfo.mobile} {
          height: 48px;
          border-input{
            height: 48px;
            line-height: 48px;
          }
        }
      }
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
