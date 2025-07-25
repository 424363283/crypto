import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { MobileHeaderDownload } from '@/components/header/download';
import { useNativeAPP, useRouter } from '@/core/hooks';
import { getOtherLink, isSearchRU, MediaInfo } from '@/core/utils';
import { clsx } from '@/core/utils/src/clsx';
import React, { ReactNode, useEffect } from 'react';
import { Mobile } from '../responsive';

const UniversalLayout = React.memo(
  ({
    children,
    hideHeader = false,
    hideFooter = false,
    className = '',
    bgColor = '#fff',
    hideBorderBottom = false,
    header,
    headerBgColor,
    shouldRender = true,
  }: {
    children: React.ReactNode;
    hideFooter?: boolean;
    hideHeader?: boolean;
    className?: string;
    bgColor?: string;
    hideBorderBottom?: boolean;
    header?: ReactNode;
    headerBgColor?: string;
    shouldRender?: boolean;
  }) => {
    const [showDownload, setShowDownload] = React.useState(true);
    const { isNativeAPP } = useNativeAPP();
    const router = useRouter();
    useEffect(() => {
      // 地址命中 并且 带ru参数 隐藏下载
      if (getOtherLink() && isSearchRU()) {
        setShowDownload(false);
      }
      const pathname = router.pathname;
      if (pathname.includes('/register') || pathname.includes('/login') || pathname.includes('/forget')) {
        setShowDownload(false);
      }
    }, []);
    if (!shouldRender) {
      return null;
    }
    return (
      <div className='uni-layout'>
        {showDownload && !isNativeAPP && (
          <Mobile>
            <MobileHeaderDownload />
          </Mobile>
        )}

        {!hideHeader && !isNativeAPP && (header || <Header backgroundColor={headerBgColor} hideBorderBottom={hideBorderBottom} />)}
        <main className={clsx('main', className)}>{children}</main>
        {!hideFooter && !isNativeAPP && <Footer />}
        <style jsx>{`
          .uni-layout {
            background-color: var(--fill_bg_2);
            .main {
              display: flex;
              flex-direction: column;
              min-height: calc(100vh - 56px);
              min-height: 100% !important;
              margin-bottom: 24px;
              @media ${MediaInfo.mobile} {
               margin: 0 !important;
               gap: 8px;
              }
            }
          }
        `}</style>
      </div>
    );
  }
);

export { UniversalLayout };
