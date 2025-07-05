import { LANG } from '@/core/i18n/src/page-lang';
import { clsx } from '@/core/utils/src/clsx';
import { TrLink } from '@/core/i18n/src/components/tr-link';
import css from 'styled-jsx/css';
import YIcon from '@/components/YIcons';
import { useAppContext, useLoginUser } from '@/core/store';
import { useParams } from 'next/navigation';
import { Button } from '@/components/button';
import { Size } from '@/components/constants';
import { MediaInfo } from '@/core/utils';
export default function Trade() {
  const { locale } = useAppContext();
  // const locale = Array.isArray(locales) ? locales[0] : locales;
  const isChinese = locale.includes('zh');
  const { user } = useLoginUser();
  const backgroundImage = isChinese ? '/static/images/home/trade_pc.png' : '/static/images/home/entrade_pc.svg';
  let isLogin = user?.uid;

  return (
    <div className={clsx('trade-anytime')}>
      <div className={clsx('trade-anytime-wrap')}>
        <div className={clsx('download')}>
          <div className={clsx('logo')}>
            <YIcon.LOGO width="83" height="60" />
          </div>
          <h2>{LANG('随时交易, 轻松高效')}</h2>
          {isLogin ? (
            <TrLink href={`/swap/btc-usdt`} >
              <Button type='white' rounded outlined size={Size.LG} hover={false} width={200}>
                {LANG('去交易')}
              </Button>
            </TrLink>
          ) : (
            <TrLink href={`/register`} >
              <Button type='white' rounded outlined size={Size.LG} hover={false} width={200}>
                {LANG('注册')}
              </Button>
            </TrLink>
          )}
        </div>
      </div>
      <style jsx>{`
        .trade-anytime {
          background: url('/static/images/home/trade_bg.png') top center no-repeat;
          background-size: cover;
          @media ${MediaInfo.mobile} {
            background: url('/static/images/home/h5/trade_bg.png') center no-repeat;
            background-size: 100% 400px;
          }
          &-wrap {
            width: 1200px;
            margin: 0 auto;
            background: url(${backgroundImage}) right bottom / 560px 330px no-repeat;
            height: 400px;
            padding: 60px 0 0;
            box-sizing: border-box;
            @media ${MediaInfo.mobile} {
              display: flex;
              flex-direction: center;
              align-items: center;
              width: 100%;
              background: none;
              padding: 0 30px;
            }
          }
          .download {
            display: inline-flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 24px;
            width: 437px;
            @media ${MediaInfo.mobile} {
              width: 100%;
              align-items: center;
            }
            :global(.register-btn) {
              display: flex;
              height: 56px;
              padding: 16px 40px;
              min-width: 200px;
              justify-content: center;
              align-items: center;
              border-radius: 40px;
              background: #fff;
              color: var(--text_brand);
              text-align: center;
              font-size: 18px;
              font-weight: 500;
              letter-spacing: 4px;
            }
            :global(.common-button) {
              font-size: 16px;
              :global(a) {
               width: 100%;
              }
            }
          }
          .logo {
            width: 104px;
            height: 104px;
            background: var(--text_white);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          h2 {
            color: var(--text_white);
            font-size: 48px;
            font-weight: 600;
            line-height: 100%;
            @media ${MediaInfo.mobile} {
              font-size: 32px;
              padding: 0 auto;
              text-align: center;
              line-height: 48px;
            }
          }
        }
      `}</style>
    </div>
  );
}
