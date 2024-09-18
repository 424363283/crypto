import Image from '@/components/image';
import { NoSSR } from '@/components/no-ssr';
import TypeWriter from '@/components/type-writer';
import { useResponsiveClsx } from '@/core/hooks/src/use-responsive';
import { useRouter } from '@/core/hooks/src/use-router';
import { LANG } from '@/core/i18n';
import { TrLink } from '@/core/i18n/src/components/tr-link';
import { useAppContext } from '@/core/store';
import { clsx } from '@/core/utils/src/clsx';
import { MediaInfo } from '@/core/utils/src/media-info';
import { message } from '@/core/utils/src/message';
import { memo, useState } from 'react';
import css from 'styled-jsx/css';

function HeaderBanner() {
  const [email, setEmail] = useState('');
  const { isLogin } = useAppContext();
  const router = useRouter();
  const { setResponsiveClsx } = useResponsiveClsx();

  const register = () => {
    const url = `/register?email=${email}`;
    if (
      /^[a-z0-9A-Z]+([._\\-]*[a-z0-9A-Z_])*@([a-z0-9A-Z]+[-a-z0-9A-Z]*[a-z0-9A-Z]+.){1,63}[a-z0-9A-Z]+$/.test(email)
    ) {
      router.push(url);
    } else {
      message.error(LANG('邮箱格式错误'));
    }
  };
  const renderBannerButton = () => {
    return isLogin ? (
      <TrLink href={`/swap/btc-usdt`} className='trade_link'>
        {LANG('Start Trading Now')}
      </TrLink>
    ) : (
      <div className='email_input'>
        <input
          type='text'
          placeholder={LANG('请输入邮箱')}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          value={email}
        />
        <button onClick={register}>{LANG('注册')}</button>
      </div>
    );
  };
  return (
    <div className='container'>
      <div className={clsx('top', setResponsiveClsx('top-pc', 'top-pad', 'top-phone'))}>
        <i className={clsx('l-border')} />
        <i className={clsx('c-border')} />
        <i className={clsx('r-border')} />
        <div className='top_left'>
          <div className='title'>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <TypeWriter text='YMEX' speed={300} className='buidl-text' />
               一站式
            </div>
            <p>金融娱乐平台</p>
          </div>
          <h1 className='text'>Buy and sell BTC, ETH, LTC, DOGE, and other altcoins</h1>
          <NoSSR>{renderBannerButton()}</NoSSR>
        </div>
        <div className='top_right'>
          {/* <Image src='/static/images/home/bg.png' width={522} height={510} enableSkin /> */}
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}
export default memo(HeaderBanner);
const styles = css`
  .container {
    width: 100%;
    background: var(--theme-secondary-bg-color);
    overflow: hidden;
    p {
      padding: 0;
      margin: 0;
    }
    .top {
      max-width: var(--const-max-page-width);
      margin: 0 auto;
      padding: 30px 0 110px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      position: relative;
      .l-border,
      .c-border,
      .r-border {
        position: absolute;
        width: 1px;
        height: 100%;
        display: none;
        background: var(--skin-border-color-1);
        top: 0;
      }
      .l-border {
        left: -100px;
      }
      .c-border {
        left: 630px;
      }
      .r-border {
        right: -100px;
      }
      .top_right {
        :global(img) {
          width: 522px;
          height: auto;
        }
      }
      .top_left {
        padding-top: 50px;
      }
      .title {
        margin: 0;
        padding: 0;
        font-size: 80px;
        font-weight: 700;
        line-height: 1.2;
        white-space: nowrap;
        color: var(--theme-font-color-1);
        span {
          color: var(--skin-color-active);
        }
        > * {
          font-family: DINPro !important;
        }
      }
      .text {
        margin: 0;
        padding: 0;
        font-size: 25px;
        font-weight: 500;
        line-height: 1.5;
        padding: 28px 0 24px;
        width: 392px;
        color: var(--theme-font-color-1);
      }
      :global(.trade_link) {
        background: var(--skin-primary-color);
        font-weight: 400;
        min-width: 250px;
        border-radius: 6px;
        text-align: center;
        margin-right: 10px;
        font-size: 20px;
        font-weight: 500;
        color: var(--skin-font-color);
        padding: 12px 20px;
        display: inline-block;
        cursor: pointer;
        &:active {
          transform: translateY(1px);
        }
        &:disabled,
        &.disabled {
          opacity: 0.6;
          pointer-events: none;
          cursor: not-allowed;
          opacity: 0.4;
        }
      }
      :global(.email_input) {
        height: 60px;
        display: flex;
        align-items: center;
        border-radius: 6px;
        background: #fff;
        position: relative;
        overflow: hidden;
        :global(input) {
          outline: none;
          border: none;
          background: #fff;
          &:focus {
            border: none;
          }
          flex: 1;
          height: 100%;
          padding: 0 8px 0 24px;
          font-size: 16px;
          font-weight: 500;
          color: #333;
        }
        :global(button) {
          cursor: pointer;
          border: none;
          min-width: 120px;
          border-radius: 6px;
          background: var(--skin-primary-color);
          text-align: center;
          margin-right: 10px;
          font-size: 16px;
          font-weight: 500;
          color: var(--skin-font-color);
          display: inline-block;
          padding: 10px 24px;
        }
      }
      @media ${MediaInfo.tablet} {
        flex-direction: column;
        padding-bottom: 0;
        padding: 0 32px;
        .top_right {
          padding-top: 15px;
          width: 100%;
          :global(img) {
            width: 100%;
            height: auto;
          }
        }
      }
      @media ${MediaInfo.mobile} {
        padding: 0 16px 60px;
        .top_right {
          display: none;
        }
        .top_left {
          padding-top: 30px;
        }
        .title {
          font-size: 35px;
        }
        .text {
          font-size: 14px;
          font-weight: 500;
          width: 210px;
          padding: 15px 0;
        }
        :global(.trade_link) {
          font-size: 12px;
          font-weight: 500;
          min-width: 100px;
          padding: 6px 10px;
        }
        :global(.email_input) {
          height: 38px;
          padding: 0 4px 0 12px;
          :global(input) {
            padding-left: 0;
            font-size: 12px;
          }
          :global(button) {
            min-width: 80px;
            padding: 5px 12px;
            font-size: 12px;
          }
        }
      }
    }
  }
`;
