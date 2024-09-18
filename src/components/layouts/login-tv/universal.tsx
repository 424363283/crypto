import { getOtherLink, isSearchRU } from '@/core/utils';
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
    shouldRender = true,
  }: {
    children: React.ReactNode;
    hideFooter?: boolean;
    hideHeader?: boolean;
    className?: string;
    bgColor?: string;
    hideBorderBottom?: boolean;
    header?: ReactNode;
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

        <main className={clsx('main', className)}>{children}</main>
        <style jsx>{`
          .uni-layout {
            background: #101012;
            .main {
              min-height:'100vh';
              display: flex;
              flex-direction: column;
            }
          }
        `}</style>
      </div>
    );
  }
);

export { UniversalLayout };
