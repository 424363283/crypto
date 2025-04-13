import { LANG } from '@/core/i18n';
import { TrLink } from '@/core/i18n/src/components/tr-link';
import { clsx } from '@/core/utils/src/clsx';
import { memo } from 'react';
import { MediaInfo } from '@/core/utils';
import css from 'styled-jsx/css';

import YIcon from '@/components/YIcons';
import { LOCAL_KEY, useLoginUser } from '@/core/store';

function HeaderBanner() {
  const { user } = useLoginUser();
  let isLogin = user?.uid;

  return (
    <div className="container">
      <div className={clsx('banner')}>
        <div className={clsx('banner-content')}>
          <div className={clsx('slogon')}>
            <h1>{LANG('让你成为巨鲸')}</h1>
          </div>

          <div className={clsx('register-tips')}>
            <p>{LANG('买卖比特币、以太币、泰达币、狗狗币等热门加密货币')}</p>
          </div>
          <div className={clsx('register-tips')}>
            <p>
              <YIcon.giftsIcon />
              {LANG('免费注册, 完成任务, 领取高达8,888美元新用户礼金')}
            </p>
          </div>
          <div className={clsx('button-groups')}>
            <TrLink href={`/account/fund-management/asset-account/recharge`} className={clsx('button-item')}>
              {LANG('充值')}
            </TrLink>

            {isLogin ? (
              <TrLink href={`/swap/btc-usdt`} className={clsx('button-item')}>
                {LANG('去交易')}
              </TrLink>
            ) : (
              <TrLink href={`/register`} className={clsx('button-item')}>
                {LANG('注册')}
              </TrLink>
            )}
          </div>
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}
export default memo(HeaderBanner);
const styles = css`
  .banner {
    background: url('/static/images/home/banner_bg.jpg') top center no-repeat;
    background-size: cover;
    height: 560px;
    display: flex;
    align-items: center;
    justify-content: center;
    @media ${MediaInfo.mobile} {
      background: url('/static/images/home/h5/banner_bg.png') top center no-repeat;
      background-size: 100% 100%;
      height: 320px;
    }
    &-content {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      h1 {
        color: var(--text-black, #000);
        text-align: center;
        font-size: 64px;
        font-weight: 700;
        @media ${MediaInfo.mobile} {
          font-size: 32px;
        }
      }
      .slogon {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 16px;
        align-self: stretch;
        color: var(--text-black);
        font-size: 18px;
        font-weight: 500;
        padding: 0 0 16px;

        @media ${MediaInfo.mobile} {
          font-size: 14px;
        }
      }
      .register-tips {
        color: var(--text-black);
        font-size: 16px;
        font-weight: 500;
        display: flex;
        padding: 0 0 40px;

        @media ${MediaInfo.mobile} {
          font-size: 14px;
          padding: 0 40px 20px;
          p {
            line-height: 24px;
            :global(svg) {
              vertical-align: middle;
            }
          }
        }
        svg {
          margin: 0 8px 0 0;
        }
      }
      .button-groups {
        display: flex;
        align-items: flex-start;
        justify-content: center;
        gap: 16px;
        width: 100%;
        @media ${MediaInfo.mobile} {
          padding: 0 40px;
          box-sizing: border-box;
        }
        :global(.button-item) {
          display: flex;
          min-width: 200px;
          height: 48px;
          padding: 0 40px;
          align-items: center;
          justify-content: center;
          border-radius: 24px;
          border: 1px solid var(--text-black);
          color: var(--text-black);
          font-size: 18px;
          font-weight: 500;

          &:last-child {
            background: var(--text-black);
            color: var(--text-white);
          }
          @media ${MediaInfo.mobile} {
            width: 50%;
            min-width: auto;
            white-space: nowrap;
            overflow: hidden;
          }
        }
      }
    }
  }
`;
