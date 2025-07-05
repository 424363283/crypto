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
import { useRouter } from '@/core/hooks';
import { Button } from '@/components/button';
import { Copy } from '@/core/shared';
import { CalibrateValue } from '@/core/shared/src/copy/utils';
import ActivateModal from './activateModal';
import clsx from 'clsx';
const CopyTradingItem = (props: any) => {
  const router = useRouter();
  const item = props?.copyItem;
  const filterInfo = useCopyTradingSwapStore.use.filterInfo();
  const copyTradeInfo = useCopyTradingSwapStore.use.copyTradeInfo();
  const isCopyTrader = useCopyTradingSwapStore.use.isCopyTrader();
  const isOpenU = useCopyTradingSwapStore.use.isOpenU();
  const isOpenCopy = useCopyTradingSwapStore.use.isOpenCopy();
  const [cancelShow, setCancelShow] = useState(false);
  const selectDays = filterInfo.timeType || 30;
  const total =
    (item.copyTradeUserStatisticsSummaryVo &&
      item.copyTradeUserStatisticsSummaryVo[`lossOrderNumber${selectDays}`] &&
      item.copyTradeUserStatisticsSummaryVo[`profitOrderNumber${selectDays}`] &&
      item.copyTradeUserStatisticsSummaryVo[`profitOrderNumber${selectDays}`] &&
      item.copyTradeUserStatisticsSummaryVo[`profitOrderNumber${selectDays}`]?.add(
        item.copyTradeUserStatisticsSummaryVo[`lossOrderNumber${selectDays}`]
      )) ||
    0;
  const percentWin =
    (item.copyTradeUserStatisticsSummaryVo &&
      total &&
      item.copyTradeUserStatisticsSummaryVo[`profitOrderNumber${selectDays}`]?.div(total)) ||
    0;
  const amount = useMemo(() => {
    return {
      profitRate: item.copyTradeUserStatisticsSummaryVo[`profitRate${selectDays}`]?.mul(100) || 0,
      profitAmount: item.copyTradeUserStatisticsSummaryVo[`profitAmount${selectDays}`]?.toFormatUnit() || 0,
      victoryRate: item.copyTradeUserStatisticsSummaryVo[`victoryRate${selectDays}`]?.mul(100) || 0,
      percentWin: !percentWin || percentWin === 'NaN' ? 0 : percentWin?.mul(100)?.toFixed(Copy.copyFixed)
    };
  }, [selectDays]);
  const handleCopyTrader = () => {
    if (!isOpenCopy || !isOpenU) {
      setCancelShow(true)
      return
    } else {
      router.push(
        `/copyTrade/setting/${item.uid}?userType=${CopyTradeType.traderDetail}&copyActiveType=${CopyTradeSetting.futures}`
      );
      return;
    }
   
  };
  return (
    <>
      <div className={clsx('copyItem1', styles.copyItem)}>
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
              <CommonIcon name="common-copy-user" width={16} height={16} />
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
              <div className={styles.copyIncome} style={CalibrateValue(amount.profitRate).color}>
                {CalibrateValue(amount.profitRate, Copy.copyFixed).value}%
              </div>
            </div>
            <CopyTradingTrend chartData={item?.list || []} chartShowKey={'profitRate'} idx={item.id} />
          </div>
        </div>
        <div className={`${styles.mb24} ${styles.copyLine}`}>
          <p className={`${styles.flexSpan}`}>
            <span>{LANG('{days}日胜率', { days: selectDays })}</span>
            <span className={styles.copyCount}>{amount.percentWin}%</span>
          </p>
          <p className={`${styles.flexSpan} ${styles.my16}`}>
            <span>{LANG('{days}日收益额', { days: selectDays })}</span>
            <span className={styles.copyCount}>{CalibrateValue(amount?.profitAmount, Copy.copyFixed).value}</span>
          </p>
          <p className={styles.flexSpan}>
            <span>{LANG('带单规模')}</span>
            <span className={styles.copyCount}>
              {item.settledTotalAmount ? item.settledTotalAmount?.toFormat(Copy.copyFixed) : '0'}
            </span>
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
        {!isCopyTrader && (
          <>
            <Button
              type={item.isCopy ? 'brand20' : 'brand0'}
              size={Size.MD}
              disabled={!item.isCopy && item.currentCopyTraderCount === item.maxCopyTraderCount}
              rounded
              onClick={e => {
                e.stopPropagation();
                handleCopyTrader();
              }}
              width={'100%'}
            >
              {item.isCopy
                ? LANG('已跟随')
                : item.currentCopyTraderCount === item.maxCopyTraderCount
                ? LANG('已满员')
                : LANG('跟单')}
            </Button>
          </>
        )}

        <style jsx>{`
          .copyItem1 {
            &:hover {
              :global(.nui-brand0),
              :global(.nui-brand20) {
                :not([disabled]) {
                  border: 1px solid var(--text_brand);
                }
              }
              :global(.nui-brand0) {
                color: var(--text_white);
                background: var(--brand);
              }
              :global(.common-button.disabled.brand0),
              :global(.common-button.disabled.brand20) {
                // border-color: var(--text_brand);
                background: var(--fill_3);
                color: var(--text_3);
              }
            }
          }
        `}</style>
      </div>
      <ActivateModal isOpenU={isOpenU} title={!isOpenU? '开启跟单交易':'开启跟单账户'} okText={!isOpenU?'去开通':'开通'}
      content={!isOpenU ? '开启跟单交易前，请先确认开通合约交易。':'跟单交易前，请先确认开启跟单账户。'}
        isOpen={cancelShow} close={() => setCancelShow(false)} />
    </>
  );
};

export default CopyTradingItem;
