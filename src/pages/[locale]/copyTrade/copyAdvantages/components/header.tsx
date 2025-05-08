import { Button } from '@/components/button';
import css from 'styled-jsx/css';
import { MediaInfo } from '@/core/utils';
import { useState } from 'react';
import { useResponsive, useTheme, useRouter } from '@/core/hooks';
import { clsx } from '@/core/utils/src/clsx';
import { LANG, TrLink } from '@/core/i18n';
export default function Header() {
  const { isDark } = useTheme();
  const router = useRouter();
  const { isMobile } = useResponsive();
  const [applyShow, setApplyshow] = useState(false);
  return (
    <div className={clsx('advantages-trader-box', isDark && 'bgB')}>
      <div className="advantages-trade-content">
        <p className="advantages-trader-bread">
          <span className='pointer' onClick={() => {
            router.push('/copyTrade')
          }} >{LANG('跟单交易')}</span>
          <span>/</span>
          <span>{LANG('跟单优势')}</span>
        </p>
        <div className="advantages-tips">
          <p>{LANG('YMEX 跟单，交易如此简单')}！</p>
        </div>
        <p className="advantages-sub-tips">{LANG('专业交易员、精准策略，让资产在市场波动中不断增值')}</p>
        <div className={`${!isMobile && 'mt24'}`}>
          <Button type="primary" rounded width={isMobile ? '100%' : 200} onClick={() => {
            router.push('/copyTrade')
          }} >
            {
              LANG('一键跟单')
            }
          </Button>
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}

const styles = css`
  .advantages-trader-box {
    height: 490px;
      background-size: cover; /* 图片覆盖整个区域 */
    background-position: center; /* 图片居中 */
    background-repeat: no-repeat; /* 不重复 */
    background-size: cover !important;
     background-image: url('/static/images/copy/advantages-banner.svg');
    // background: url(/static/images/copy/advantages-banner.svg) 100% 100% no-repeat;
    &.bgB {
      // background: url(/static/images/copy/advantages-banner-black.svg) 100% 100% no-repeat;
       background-image: url('/static/images/copy/advantages-banner-black.svg');
    }
    @media ${MediaInfo.mobile} {
      background: url(/static/images/copy/advantages-banner-h5.svg);
      height: 490px;
      padding: 0 24px;
      &.bgB {
        background: url(/static/images/copy/advantages-banner-h5-black.svg);
      }
    }
    .advantages-trade-content {
      width: 1200px;
      margin: 0 auto;
      @media ${MediaInfo.mobile} {
        width: 100%;
        padding: 0 0 24px;
      }
    }
    .advantages-trader-bread {
      padding-top: 30px;
      display: flex;
      align-items: center;
      color: var(--text_brand);
      gap: 8px;
    }
    .pointer {
      cursor: pointer;
    }  
    .mt24 {
      margin-top: 24px;
    }
    .advantages-tips {
      font-family: HarmonyOS Sans SC;
      font-weight: 700;
      font-size: 56px;
      color: var(--text_1);
      margin-top: 80px;
      width: 480px;
      @media ${MediaInfo.mobile} {
        font-size: 32px;
        margin: 24px 0;
        width: 100%;
      }
    }
    .advantages-sub-tips {
      font-family: HarmonyOS Sans SC;
      font-weight: 500;
      font-size: 18px;
      line-height: 21.1px;
      padding: 40px 0;
      color: var(--text_1);
      @media ${MediaInfo.mobile} {
        font-size: 16px;
        padding: 24px 0;
        margin-bottom: 180px;
      }
    }
  }
`;
