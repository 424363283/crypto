import { useResponsive, useRouter } from '@/core/hooks';
import { storeTradeCollapse } from '@/core/store';
import React from 'react';
import CommonIcon from '../common-icon';

const Collapse = () => {
  const mode = useRouter().query?.mode as string;
  const isLite = window.location?.pathname.indexOf('lite') > -1;
  const collapse = isLite ? !storeTradeCollapse.lite : !storeTradeCollapse.spot;
  const { isSmallDesktop, isTablet } = useResponsive();
  const onClick = () =>
      isLite
          ? (storeTradeCollapse.lite = !storeTradeCollapse.lite)
          : (storeTradeCollapse.spot = !storeTradeCollapse.spot);
  const isShow = window.location?.pathname.indexOf('lite') > -1 || window.location?.pathname.indexOf('spot') > -1;
  if (!isShow || mode === 'pro' || isSmallDesktop || isTablet) return null;
  return (
      <>
        <CommonIcon
            name='common-collapse-0'
            size={20}
            className={`collapse-icon ${collapse ? 'reverse' : ''}`}
            onClick={onClick}
        />
        <style jsx global>{`
        .collapse-icon {
          cursor: pointer;
          margin-right: 10px;
        }
        .reverse {
          transform: rotate(180deg);
        }
      `}</style>
      </>
  );
};

export default React.memo(Collapse);
