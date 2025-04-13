import styles from './tradingList.module.scss';
import CopyTradingSwiper from './copyTradingSwiper';
import { LANG, TrLink } from '@/core/i18n';
import CommonIcon from '@/components/common-icon';
import { useResponsive } from '@/core/hooks';
import CopyTradingMyFollow from './copyTradingMyFollow';
import { Copy } from '@/core/shared';
import { useEffect } from 'react';
const CopyTradingHeader = (props: any) => {
  const { isMobile } = useResponsive();
  useEffect(() => {
    Copy.init()
  },[])
  const ApplyModule = () => {
    return (
      <>
        <div className={`${styles.flexCenter} ${styles.gap4} ${isMobile && styles.becomeTrade}`}>
          <CommonIcon name={'common-copy-apply'} size={14} />
          <TrLink href="/copyTrade/applyTraders" className={styles.textPrimary}>
            {LANG('成为交易员')}
          </TrLink>
        </div>
      </>
    );
  };
  const NoLogin = () => {
    return (
      <div className={styles.noLoginBox}>
        <div>
          <p>168,000+</p>
          <label>专业交易员</label>
        </div>
        <div>
          <p>900,000+</p>
          <label>跟单用户</label>
        </div>
        <div>
          <p>$240,000,000+</p>
          <label>跟单总收益</label>
        </div>
      </div>
    );
  };
  return (
    <>
      <div className={styles.copyHeader}>
        <div
          className={`${styles.container} ${isMobile ? styles.flexCol : styles.flexSpan} ${styles.copyHeaderContainer}`}
        >
          <div className={styles.headerLeft}>
            <div className={`${styles.title} ${styles.mb24}`}>
              {LANG('实盘跟单')}
              <br />
              {LANG('与最优秀的交易者同行')}
            </div>
            {!isMobile && Copy.isLogin()&& <CopyTradingMyFollow />}
            {!isMobile && !Copy.isLogin() && <NoLogin />}
          </div>
          <div className={styles.headerRight}>
            {!isMobile && (
              <div className={styles.copyApply}>
                <ApplyModule />
                <div className={`${styles.flexCenter} ${styles.gap4}`}>
                  <CommonIcon name={'common-copy-quetion'} size={14} />
                  <TrLink href="/copyTrade/applyTraders" className={styles.textPrimary}>
                    {LANG('跟单教程')}
                  </TrLink>
                </div>
              </div>
            )}
            <div>
              <CopyTradingSwiper />
            </div>
            {isMobile && <ApplyModule />}
          </div>
        </div>
      </div>
    </>
  );
};

export default CopyTradingHeader;
