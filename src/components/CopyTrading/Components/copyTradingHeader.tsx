import styles from './tradingList.module.scss';
import CopyTradingSwiper from './copyTradingSwiper';
import { LANG, TrLink } from '@/core/i18n';
import CommonIcon from '@/components/common-icon';
import { useResponsive } from '@/core/hooks';
import CopyTradingMyFollow from './copyTradingMyFollow';
import { Copy } from '@/core/shared';
import { useEffect, useMemo } from 'react';
import { useRouter } from '@/core/hooks/src/use-router';
import { useCopyTradingSwapStore } from '@/store/copytrading-swap';
import { INTRODUTION_LINK } from '@/core/shared/src/copy/constants';
const CopyTradingHeader = (props: any) => {
  const { isMobile } = useResponsive();
  const router = useRouter();
  const fetchShareTrader = useCopyTradingSwapStore.use.fetchShareTrader();
  const isCopyTrader = useCopyTradingSwapStore.use.isCopyTrader();
  useEffect(() => {
    Copy.init();
    fetchShareTrader();
  }, []);
  const isShowMobile = useMemo(() => {
    setTimeout(() => {
      return isMobile;
    }, 200);
    return false;
  }, [isMobile]);
  const ApplyModule = () => {
    return (
      <div className={`${styles.flexCenter}  ${isMobile ? `${styles.becomeTrade} ${styles.gap4}`: styles.gap4 }`}>
        <CommonIcon name={'common-copy-apply'} size={16} />
        <TrLink href="/copyTrade/applyTraders" className={`${styles.textPrimary} ${styles.font16}`}>
          {LANG('成为交易员')}
        </TrLink>
      </div>
    );
  };
  const NoLogin = () => {
    return (
      <div className={styles.noLoginBox}>
        <div className={styles.noLoginItem}>
          <p>168,000+</p>
          <label>{LANG('专业交易员')}</label>
        </div>
        <div className={styles.noLoginItem}>
          <p>900,000+</p>
          <label>{LANG('跟单用户')}</label>
        </div>
        <div className={styles.noLoginItem}>
          <p>$240,000,000+</p>
          <label>{LANG('跟单总收益')}</label>
        </div>
      </div>
    );
  };
  const handleToIntrodution = () => {
    const locale = router.query?.locale;
    const link = INTRODUTION_LINK[locale];
    window.open(link);
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
            {!isMobile && Copy.isLogin() && <CopyTradingMyFollow />}
            {!isMobile && !Copy.isLogin() && <NoLogin />}
          </div>
          <div className={styles.headerRight}>
            {!isMobile && (
              <div className={styles.copyApply}>
                {!isCopyTrader && <ApplyModule />}
                <div className={`${styles.flexCenter} ${styles.gap4}`}>
                  <CommonIcon name={'common-copy-quetion'} size={16} />
                  <span
                    onClick={() => handleToIntrodution()}
                    className={`${styles.textPrimary} ${styles.font16} ${styles.pointer}`}
                  >
                    {LANG('跟单教程')}
                  </span>
                </div>
              </div>
            )}
            <div>
              <CopyTradingSwiper />
            </div>
            {isMobile && !isCopyTrader && (
              <div className={styles.copyApply}>
                {!isCopyTrader && <ApplyModule />}
                <div className={`${styles.flexCenter} ${styles.gap4}`}>
                  <CommonIcon name={'common-copy-quetion'} size={16} />
                  <span
                    onClick={() => handleToIntrodution()}
                    className={`${styles.textPrimary} ${styles.font16} ${styles.pointer}`}
                  >
                    {LANG('跟单教程')}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {isMobile && !Copy.isLogin() && <NoLogin />}
    </>
  );
};

export default CopyTradingHeader;
