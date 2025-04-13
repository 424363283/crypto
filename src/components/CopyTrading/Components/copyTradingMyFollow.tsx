import styles from './tradingList.module.scss';
import CommonIcon from '@/components/common-icon';
import { LANG, TrLink } from '@/core/i18n';
import { Copy } from '@/core/shared';
import { useEffect, useState } from 'react';
import { useCopyTradingSwapStore } from '@/store/copytrading-swap';
const CopyTradingMyFollow = (props: any) => {
  const [copyTradingData, setCopyTradingData] = useState({} as any)
   const fetchShareTrader = useCopyTradingSwapStore.use.fetchShareTrader();
   const fetchTraderStatistics = useCopyTradingSwapStore.use.fetchTraderStatistics();
   const isCopyTrader = useCopyTradingSwapStore.use.isCopyTrader();
   const traderStatistics = useCopyTradingSwapStore.use.traderStatistics();
  useEffect(() => {
    fetchShareTrader()
    fetchTraderStatistics()
    const userInfo = Copy.getUserInfo()
    const user: any = userInfo
    setCopyTradingData({
      ...user?.user
    })
  },[])
  return (
    <>
      <div className={styles.copyMine}>
        <div className={`${styles.flexSpan} ${styles.copyInfo}`}>
          <div className={styles.flexCenter}>
            <img src={'/static/images/copy/copy-logo-default.svg'} alt="avatar" className={styles.avatar} />
            <span className={styles.pl8}> {copyTradingData?.username}</span>
          </div>
          <TrLink href={`/copyTrade/${copyTradingData.uid}`} query={{ userType: isCopyTrader? 3 : 1 }} className={styles.textPrimary}>
            <span className={styles.flexCenter}>
              {isCopyTrader ? LANG('我的带单') : LANG('我的跟单')}
              <CommonIcon name={'common-arrow-right-0'} width={20} height={20} className="arrow" enableSkin />
            </span>
          </TrLink>
        </div>
        <div className={styles.myIncome}>
          <div>
            <p className={styles.myInTitle}>{traderStatistics?.profitAmount7.toFormatUnit()}</p>
            <p>{LANG('7天总收益')}(USDT)</p>
          </div>
          <div>
            <p className={styles.myInTitle}>{traderStatistics?.profitRate?.mul(100) }%</p>
            <p>{LANG('7天总收益率')}</p>
          </div>
          <div className={styles.textRight}>
            <p className={styles.myInTitle}>{traderStatistics?.profitAmount7.toFormatUnit()}</p>
            <p>{LANG('今日收益')}(USDT)</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CopyTradingMyFollow;
