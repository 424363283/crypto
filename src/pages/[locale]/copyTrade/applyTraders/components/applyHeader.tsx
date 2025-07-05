import { Button } from '@/components/button';
import css from 'styled-jsx/css';
import { MediaInfo } from '@/core/utils';
import ApplyModal from './applyModal';
import { useTheme } from '@/core/hooks';
import { useEffect, useState } from 'react';
import { useResponsive } from '@/core/hooks';
import { useRouter } from '@/core/hooks/src/use-router';
import { LANG } from '@/core/i18n';
import { clsx } from '@/core/utils/src/clsx';
import { Copy } from '@/core/shared';
import { useAppContext } from '@/core/store';
import { Size } from '@/components/constants';
import { useCopyTradingSwapStore } from '@/store/copytrading-swap';
import Image from 'next/image';
export default function ApplyHeader() {
  const { isMobile } = useResponsive();
  const { locale } = useAppContext();
  const router = useRouter();
  const { isDark } = useTheme();
  const [applyShow, setApplyshow] = useState(false);
  const fetchShareTrader = useCopyTradingSwapStore.use.fetchShareTrader();
  const isCopyTrader = useCopyTradingSwapStore.use.isCopyTrader();
  useEffect(() => {
    fetchShareTrader()
  },[])
  return (
    <div className={clsx('apply-trader-box', isDark && 'bgB')}>
      <div className="apply-trade-content">
        <p className="apply-trader-bread" onClick={() => { router.push('/copyTrade') }}>
          <span className='copy-trader'>{LANG('跟单交易')}</span>
          <span>/</span>
          <span>{LANG('申请成为交易员')}</span>
        </p>
        <div className='apply-trader-body vertically-align-center'>
          <div className='apply-slogan'>
            <div className={clsx('apply-tips')}>
              <p>{LANG('成为合约带单交易员，')}</p>
              <p>{LANG('享受最高40%分润')}</p>
            </div>
            <Image className='apply-profit-20-h5' width='240' height='190' src={'/static/images/copy/apply-profit-40.svg'} alt='apply-profit' />
            <div className="tips-btn">
              {
                !isCopyTrader && <Button
                  type="primary"
                  rounded
                  size={Size.XL}
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
              }
            </div>
          </div>
          <Image className='apply-profit-20' width='330' height='260' src={'/static/images/copy/apply-profit-40.svg'} alt='apply-profit' />
        </div>
      </div>
      <ApplyModal isOpen={applyShow} close={() => setApplyshow(false)} />
      <style jsx>{styles}</style>
    </div>
  );
}

const styles = css`
  .apply-trader-box {
    height: 494px;
    width: auto;
    background-image: url(/static/images/copy/apply-banner.svg);
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover !important;
    &.bgB {
      background: url('/static/images/copy/apply-banner-black.svg');
    }
    @media ${MediaInfo.mobile} {
      height: auto;
      padding: 0 24px;
      background: url(/static/images/copy/apply-banner-h5.svg);
      &.bgB {
        background: url('/static/images/copy/apply-banner-h5-black.svg');
      }
    }
    .apply-trade-content {
      position: relative;
      width: 1200px;
      height: 100%;
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
      color: var(--text_brand);
      gap: 8px;
    }
      .copy-trader {
        cursor: pointer;
      }

    .apply-trader-body  {
      display: flex ;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      &.vertically-align-center {
        @media ${MediaInfo.desktop}, ${MediaInfo.tablet} {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
        }
      }
      .apply-slogan {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 64px;
        width: auto;
        @media ${MediaInfo.mobile} {
          width: 100%;
          align-items: center;
          gap: 24px;
        }
        .tips-btn {
          @media ${MediaInfo.mobile} {
            width: 100%;
          }
          :global(button) {
            font-size: 18px;
          }
        }
        .apply-tips {
           font-family: "Lexend";;
          font-weight: 700;
          font-size: 56px;
          color: var(--text_1);
          @media ${MediaInfo.mobile} {
            font-size: 32px;
            margin: 24px 0;
          }
        }
        :global(.apply-profit-20-h5) {
          @media ${MediaInfo.desktop}, ${MediaInfo.tablet} {
            display: none;
          }
        }
      }
      :global(.apply-profit-20) {
        @media ${MediaInfo.mobile} {
          display: none;
        }
      }
    }
  }
`;
