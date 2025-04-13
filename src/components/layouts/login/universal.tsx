import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { MobileHeaderDownload } from '@/components/header/download';
import { getOtherLink, isSearchRU, MediaInfo } from '@/core/utils';
import { clsx } from '@/core/utils/src/clsx';
import React, { ReactNode, useEffect } from 'react';
import { Mobile } from '../../responsive';

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

    useEffect(() => {
      // 地址命中 并且 带ru参数 隐藏下载
      if (getOtherLink() && isSearchRU()) {
        setShowDownload(false);
      }
    }, []);
    if (!shouldRender) {
      return null;
    }
    return (
      <div className='uni-layout'>
        {showDownload && (
          <Mobile>
            <MobileHeaderDownload />
          </Mobile>
        )}

        {!hideHeader && (header || <Header backgroundColor={headerBgColor} hideBorderBottom={hideBorderBottom} />)}
        <main className={clsx('main', className)}>{children}</main>
        {!hideFooter && <Footer />}
        <style jsx>{`
          .uni-layout {
            background-color: var(--bg-1);
            @media ${MediaInfo.mobile} {
              background-color: var(--fill-3);
            }
            .main {
              min-height: ${hideHeader ? '100vh' : 'calc(100vh - 56px)'};
              display: flex;
              flex-direction: column;
              margin-bottom: 24px;
              @media ${MediaInfo.mobile} {
                  margin: 0 !important;
              }
            }
          }
        `}</style>
      </div>
    );
  }
);

export { UniversalLayout };
