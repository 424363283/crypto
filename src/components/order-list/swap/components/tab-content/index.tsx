import { clsx } from '@/core/utils';
import { useEffect, useState } from 'react';

export const TabContent = ({ children, active, cacheLoad = true }: any) => {
  const [loaded, setLoaded] = useState(cacheLoad ? active : true);

  useEffect(() => {
    if (cacheLoad) {
      if (!loaded && active) {
        setLoaded(true);
      }
    }
  }, [loaded, active, cacheLoad]);

  if (!loaded) {
    return <></>;
  }

  return (
    <>
      <div className={clsx('tab-content', active && 'active')}>{children}</div>
      <style jsx>{`
        .tab-content {
          display: none;
          &.active {
            display: block;
          }
        }
      `}</style>
    </>
  );
};
