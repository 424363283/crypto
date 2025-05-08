'use client';
import CoinLogo from '@/components/coin-logo';
import styles from './tradingList.module.scss';
import { Size } from '@/components/constants';
import { Svg } from '@/components/svg';
import CommonIcon from '@/components/common-icon';
import CopyTradingTrend from './copyTradingTrend';
import { LANG, TrLink } from '@/core/i18n';
import { CopyTradeType, CopyTradeSetting } from '../CopyTradingDetail/Components/types';
import { useCopyTradingSwapStore } from '@/store/copytrading-swap';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from '@/core/hooks'
import { Button } from '@/components/button';
import { Copy } from '@/core/shared';
import { CalibrateValue } from '@/core/shared/src/copy/utils';
import clsx from 'clsx';
const CopyTradingItem = (props: any) => {
  const router = useRouter();
  const item = props?.copyItem;
  const filterInfo = useCopyTradingSwapStore.use.filterInfo();
  const copyTradeInfo = useCopyTradingSwapStore.use.copyTradeInfo();
  const isCopyTrader = useCopyTradingSwapStore.use.isCopyTrader();
  const selectDays = filterInfo.timeType;
  const total =  item.copyTradeUserStatisticsSummaryVo && item.copyTradeUserStatisticsSummaryVo[`profitOrderNumber${selectDays}`]?.add( item.copyTradeUserStatisticsSummaryVo[`lossOrderNumber${selectDays}`]);
  const percentWin = item.copyTradeUserStatisticsSummaryVo && item.copyTradeUserStatisticsSummaryVo[`profitOrderNumber${selectDays}`]?.div(total) || 0;
  const amount = useMemo(() => {
    return {
      profitRate: item.copyTradeUserStatisticsSummaryVo[`profitRate${selectDays}`]?.mul(100) || 0,
      profitAmount: item.copyTradeUserStatisticsSummaryVo[`profitAmount${selectDays}`]?.toFormatUnit() || 0,
      victoryRate: item.copyTradeUserStatisticsSummaryVo[`victoryRate${selectDays}`]?.mul(100) || 0,
      percentWin:  percentWin?.mul(100)
    };
  }, [selectDays]);
  const [chartData, setChartData] = useState([] as any);
  //   useEffect(() => {
  //   console.log(copyTradeInfo.klineStatistics,'copyTradeInfo.klineStatistics=====')
  //   const copyTrade =  copyTradeInfo.klineStatistics.find((kline:any) =>kline.uid === item.uid) || {list:[]}
  //   setChartData(copyTrade.list)
  // },[copyTradeInfo.klineStatistics])


  const handleCopyTrader = () => {
    router.push(`/copyTrade/setting/${item.uid}?userType=${CopyTradeType.traderDetail}&copyActiveType=${CopyTradeSetting.futures}`)
    return
  }
  return (
    <>
      <div className={clsx('copyItem1', styles.copyItem)}  >
        <div className={`${styles.flexCenter} ${styles.mb24}`}>
          <img src={'/static/images/copy/copy-logo-default.svg'} alt="avatar" className={styles.avatar} />
          <div>
            <div className={`${styles.flexCenter} ${styles.copyName} ${styles.gap4}`}>
              <span>{item.nickname}</span>
              {/* <Svg
                src={`/static/icons/primary/common/copy-lever-${item.traderType}.svg`}
                currentColor="var(--text_1)"
                width={16}
                height={16}
              /> */}
            </div>
            <div className={`${styles.flexCenter} ${styles.gap4}`}>
              <CommonIcon name="common-copy-user" width={12} height={12} />
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
              <p className={styles.copyTitle}>{LANG('近{days}日收益率', { days: selectDays })}</p>
              <div className={styles.copyIncome} style={CalibrateValue(amount.profitRate).color}>{CalibrateValue(amount.profitRate,Copy.copyFixed).value}%</div>
            </div>
            <CopyTradingTrend chartData={item?.list || []} chartShowKey={'profitRate'} idx={item.id} />
          </div>
        </div>
        <div className={`${styles.mb24} ${styles.copyLine}`}>
          <p className={`${styles.flexSpan}`}>
            <span>{LANG('{days}日胜率', { days: selectDays })}</span>
            <span className={styles.copyCount}>{CalibrateValue(amount.percentWin, Copy.copyFixed).value}%</span>
          </p>
          <p className={`${styles.flexSpan} ${styles.my16}`}>
            <span>{LANG('{days}日收益额', { days: selectDays })}</span>
            <span className={styles.copyCount}>{CalibrateValue(amount.profitAmount, Copy.copyFixed).value}</span>
          </p>
          <p className={styles.flexSpan}>
            <span>{LANG('带单规模')}</span>
            <span className={styles.copyCount}>{item.settledTotalAmount ? item.settledTotalAmount?.toFormat(Copy.copyFixed) : '0'}</span>
          </p>
        </div>
        <div className={`${styles.flexSpan} ${!isCopyTrader && styles.mb24}`}>
          <div className={`${styles.flexCenter} ${styles.symbolBox}`}>
            {item.symbolList &&
              item.symbolList.map((symbol: string) => {
                return (
                  <CoinLogo key={symbol} width="28" height="28" coin={symbol} alt="" className={styles.copySymbol} />
                );
              })}
          </div>
          <div className={`${styles.flexCenter} ${styles.gap4}`}>
            <Svg src={`/static/icons/primary/common/copy-assets.svg`} width={20} height={20} />
            {item?.shareRoyaltyRatio?.mul(100)}%
          </div>
        </div>
        {

          !isCopyTrader &&
          <>
            <Button type={item.isCopy ? 'brandLabel' : 'brand'} size={Size.MD} disabled={!item.isCopy && item.currentCopyTraderCount === item.maxCopyTraderCount} rounded onClick={(e) => {
              e.stopPropagation()
              handleCopyTrader()
            }} width={'100%'}>
              {item.isCopy ? LANG('已跟随') : item.currentCopyTraderCount === item.maxCopyTraderCount ? LANG('已满员') : LANG('跟单')}
            </Button>
          </>
        }
        <style jsx>{`
          .copyItem1 {
            &:hover {
              :global(.common-button.brand) {
                background: var(--brand);
                color: #fff
              }
              :global(.nui-brandLabel) {
                border:1px solid var(--text_brand)
              }
              :global(.common-button.disabled.brand) {
                border-color: var(--text_brand);
                background: var(--fill_3);
                color: var(--text_3);
              }
            }
            }
      `}</style>
      </div>

    </>
  );
};

export default CopyTradingItem;
