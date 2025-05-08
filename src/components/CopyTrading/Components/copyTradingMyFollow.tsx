import styles from '@/components/CopyTrading/Components/tradingList.module.scss';
import CommonIcon from '@/components/common-icon';
import { LANG, TrLink } from '@/core/i18n';
import { Copy } from '@/core/shared';
import { useEffect, useState } from 'react';
import { useCopyTradingSwapStore } from '@/store/copytrading-swap';
import { CalibrateValue } from '@/core/shared/src/copy/utils';
const CopyTradingMyFollow = (props: any) => {
  const [copyTradingData, setCopyTradingData] = useState({} as any);
  const fetchShareTrader = useCopyTradingSwapStore.use.fetchShareTrader();
  const fetchTraderStatistics = useCopyTradingSwapStore.use.fetchTraderStatistics();
  const isCopyTrader = useCopyTradingSwapStore.use.isCopyTrader();
  const traderStatistics = useCopyTradingSwapStore.use.traderStatistics();
  const bringUserData = useCopyTradingSwapStore.use.bringUserData();
  useEffect(() => {
    fetchShareTrader(true);
    fetchTraderStatistics();
    getAccount()
  }, []);
 const getAccount= async ()=> {
  const userInfo: any = await Copy.getUserInfo();
    setCopyTradingData({
      ...userInfo
    });
 }

  return (
    <>
      {(bringUserData.nickname || copyTradingData?.username) && (
        <div className={styles.copyMine}>
          <div className={`${styles.flexSpan} ${styles.copyInfo}`}>
            <div className={styles.flexCenter}>
              <img src={'/static/images/copy/copy-logo-default.svg'} alt="avatar" className={styles.avatar} />
              <span className={styles.pl8}> {isCopyTrader ? bringUserData.nickname : copyTradingData?.username}</span>
            </div>
            <TrLink
              href={`/copyTrade/${copyTradingData?.uid}`}
              query={{ userType: isCopyTrader ? 3 : 1 }}
              className={styles.textPrimary}
            >
              <span className={styles.flexCenter}>
                {isCopyTrader ? LANG('我的带单') : LANG('我的跟单')}
                <CommonIcon name={'common-arrow-right-0'} width={20} height={20} className="arrow" enableSkin />
              </span>
            </TrLink>
          </div>
          <div className={styles.myIncome}>
            <div>
              <p className={styles.myInTitle} style={CalibrateValue(traderStatistics?.profitAmount7).color}>
                {CalibrateValue(traderStatistics?.profitAmount7,Copy.copyFixed).value}
              </p>
              <p>{LANG('7天总收益')}(USDT)</p>
            </div>
            <div>
              <p className={styles.myInTitle} style={CalibrateValue(traderStatistics?.profitRate7?.mul(100)).color}>
                {CalibrateValue(traderStatistics?.profitRate7?.mul(100),Copy.copyFixed).value}%
              </p>
              <p>{LANG('7天总收益率')}</p>
            </div>
            <div className={styles.textRight}>
              <p className={styles.myInTitle} style={CalibrateValue(traderStatistics?.profitAmount).color}>
                {CalibrateValue(traderStatistics?.profitAmount,Copy.copyFixed).value}
              </p>
              <p>{LANG('今日收益')}(USDT)</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CopyTradingMyFollow;
