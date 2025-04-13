'use client';
import CoinLogo from '@/components/coin-logo';
import styles from './tradingList.module.scss';
import { Svg } from '@/components/svg';
import CommonIcon from '@/components/common-icon';
import CopyTradingTrend from './copyTradingTrend';
import { LANG, TrLink } from '@/core/i18n';
import { CopyTradeType, CopyTradeSetting } from '../CopyTradingDetail/Components/types';
import { useCopyTradingSwapStore } from '@/store/copytrading-swap';
import { useEffect, useMemo, useState } from 'react';
const CopyTradingItem = (props: any) => {
  const item = props?.copyItem;
  const filterInfo =  useCopyTradingSwapStore.use.filterInfo();
  const copyTradeInfo =  useCopyTradingSwapStore.use.copyTradeInfo();
  const selectDays = filterInfo.timeType
  const amount =  useMemo(() => {
    return {
      profitRate: item[`profitRate${selectDays}`]?.mul(100) || 0,
      profitAmount: item[`profitAmount${selectDays}`]?.toFormatUnit() || 0,
      victoryRate: item[`victoryRate${selectDays}`] || 0,
    }
  },[selectDays])
  const [chartData,setChartData] = useState([] as any)
  //   useEffect(() => {
  //   console.log(copyTradeInfo.klineStatistics,'copyTradeInfo.klineStatistics=====')
  //   const copyTrade =  copyTradeInfo.klineStatistics.find((kline:any) =>kline.uid === item.uid) || {list:[]}
  //   setChartData(copyTrade.list)
  // },[copyTradeInfo.klineStatistics])
  return (
    <>
      <div className={styles.copyItem}>
        <div className={`${styles.flexCenter} ${styles.mb24}`}>
          <img src={'/static/images/copy/copy-logo-default.svg'}  alt="avatar" className={styles.avatar} />
          <div>
            <div className={`${styles.flexCenter} ${styles.copyName} ${styles.gap4}`}>
              <span>{item.nickname}</span>
              <Svg src={`/static/icons/primary/common/copy-lever-${item.traderType}.svg`} currentColor='var(--text-primary)' width={16} height={16} />
            </div>
            <div className={`${styles.flexCenter} ${styles.gap4}`}>
              <CommonIcon name='common-copy-user' width={12} height={12}/>
              <div>
                {' '}
                <span className={styles.currentAmount}>{item.currentCopyTraderCount}</span>
                <span>/{item.maxCopyTraderCount}</span>
              </div>
            </div>
          </div>
        </div>
        <div className={`${styles.mb24}`}>
          <div className={styles.flexSpan}>
            <div>
              <p className={styles.copyTitle}>{LANG('近{days}日收益率',{days:selectDays})}</p>
              <div className={styles.copyIncome}>{amount.profitRate}%</div>
            </div>
            <CopyTradingTrend chartData={item.list || []} chartShowKey={'profitRate'} />
          </div>
        </div>
        <div className={`${styles.mb24} ${styles.copyLine}`}>
          <p className={`${styles.flexSpan}`}>
            <span>{LANG('{days}日胜率',{days: selectDays})}</span>
            <span className={styles.copyCount}>{amount.victoryRate}%</span>
          </p>
          <p className={`${styles.flexSpan} ${styles.my16}`}>
            <span>{LANG('{days}日收益额',{days: selectDays})}</span>
            <span className={styles.copyCount}>{amount.profitAmount}</span>
          </p>
          <p className={styles.flexSpan}>
            <span>{LANG('带单规模')}</span>
            <span className={styles.copyCount}>{item.settledTotalAmount?.toFormatUnit()}</span>
          </p>
        </div>
        <div className={`${styles.flexSpan} ${styles.mb24}`}>
          <div className={`${styles.flexCenter} ${styles.symbolBox}`}>
           {item.symbolList && item.symbolList.map((symbol:string) => {
            return  <>
            <CoinLogo key={symbol} width='28' height='28' coin={symbol} alt='' className={styles.copySymbol} />
            </>
           })}
          </div>
          <div className={`${styles.flexCenter} ${styles.gap4}`}>
            <Svg src={`/static/icons/primary/common/copy-assets.svg`} width={20} height={20} />
            {item?.shareRoyaltyRatio?.mul(100)}%
          </div>
        </div>
          <TrLink
            href={`/copyTrade/setting/${item.id}`}
            query={{
              userType: CopyTradeType.traderDetail,
              copyActiveType: CopyTradeSetting.futures
            }}
            className={styles.copyItemSubmit}
          >
            {LANG('跟单')}
          </TrLink>
      </div>
    </>
  );
};

export default CopyTradingItem;
