import { Button } from '@/components/button';
import css from 'styled-jsx/css';
import { MediaInfo } from '@/core/utils';
import ApplyModal from './applyModal';
import { useTheme } from '@/core/hooks';
import { useState } from 'react';
import { useResponsive } from '@/core/hooks';
import { useRouter } from '@/core/hooks/src/use-router';
import { LANG } from '@/core/i18n';
import { clsx } from '@/core/utils/src/clsx';
import { Copy } from '@/core/shared';
export default function ApplyHeader() {
  const { isMobile } = useResponsive();
  const router = useRouter();
  const { isDark } = useTheme();
  const [applyShow, setApplyshow] = useState(false);
  return (
    <div className={clsx('apply-trader-box', isDark && 'bgB')}>
      <div className="apply-trade-content">
        <p className="apply-trader-bread">
          <span>{LANG('跟单交易')}</span>
          <span>/</span>
          <span>{LANG('申请成为交易员')}</span>
        </p>
        <div className="apply-tips">
          <p>{LANG('成为合约带单交易员，')}</p>
          <p>{LANG('享受最高20%分润')}</p>
        </div>
        <div className="tips-btn">
          <Button
            type="primary"
            rounded
            width={isMobile ? '100%' : 200}
            onClick={() => {
              if (!Copy.isLogin()) {
                router.push({
                  pathname: '/login'
                });
              } else {
                setApplyshow(true);
              }
            }}
          >
            {LANG('立即加入')}
          </Button>
        </div>
      </div>
      <ApplyModal isOpen={applyShow} close={() => setApplyshow(false)} />
      <style jsx>{styles}</style>
    </div>
  );
}

const styles = css`
  .apply-trader-box {
    height: 490px;
    background: url('/static/images/copy/apply-banner.svg') 100% 100% no-repeat;
    &.bgB {
      background: url('/static/images/copy/apply-banner-black.svg') 100% 100% no-repeat;
    }
    @media ${MediaInfo.mobile} {
      height: 402px;
      padding: 0 24px;
      background: url(/static/images/copy/apply-banner-h5.svg);
      &.bgB {
        background: url('/static/images/copy/apply-banner-h5-black.svg');
      }
    }
    .apply-trade-content {
      width: 1200px;
      margin: 0 auto;
      @media ${MediaInfo.mobile} {
        width: 100%;
        padding: 0 0 24px;
      }
    }
    .apply-trader-bread {
      padding-top: 30px;
      display: flex;
      align-items: center;
      color: var(--text-brand);
      gap: 8px;
    }
    .tips-btn {
      margin-top: 24px;
      @media ${MediaInfo.mobile} {
        margin-top: 236px;
      }
    }
    .apply-tips {
      font-family: HarmonyOS Sans SC;
      font-weight: 700;
      font-size: 56px;
      color: var(--text-primary);
      margin-top: 97px;
      margin-bottom: 64px;
      @media ${MediaInfo.mobile} {
        font-size: 32px;
        margin: 24px 0;
      }
    }
  }
`;
