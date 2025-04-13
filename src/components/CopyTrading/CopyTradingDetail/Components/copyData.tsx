import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import styles from '../index.module.scss';
import { LANG } from '@/core/i18n';
import { OVERVIEW_DATA,BRING_DATA } from '@/core/shared/src/copy/types';
export default function CopyTradingData(props: { overviewData: OVERVIEW_DATA,bringData: BRING_DATA,cycle:number}) {
  const copyOverviewData = props.overviewData;
  const copyBringData = props.bringData;
  const tradePercent = useMemo(() => {
    if (!copyOverviewData?.profitOrderNumber || !copyOverviewData?.lossOrderNumber)  return {
      tradeBuy: '50%',
      tradeSell: '50%'
    };
    const total = copyOverviewData?.profitOrderNumber.add(copyOverviewData?.lossOrderNumber);
    const tradeBuy = copyOverviewData.profitOrderNumber?.mul(100).div(total).toFixed(2);
    return {
      tradeBuy: tradeBuy + '%',
      tradeSell: '100'.sub(tradeBuy)+'%',
      victoryRate: copyBringData[`victoryRate${cycle}`],
      profitRate: copyBringData[`profitRate${cycle}`],
    };
  }, [copyOverviewData]);

  return (
    <>
      <div className={`${styles.all24} ${styles.gap24} ${styles.h379}`}>
        <div className={`${styles.performanceTitle}`}>{LANG('带单数据')}</div>
        <div className={`${styles.flexSpace} ${styles.incomeBox}`}>
          <div>
            <p className={`${styles.mb8} ${styles.textTrue}`}>{copyBringData?.profitRate?.mul(100)}%</p>
            <span className={` ${styles.textDashed}`}>{LANG('收益率')}</span>
          </div>
          <div>
            <p className={`${styles.incomeCount} ${styles.mb8}`}>{copyBringData?.profitAmount?.toFormatUnit()}</p>
            <span className={`${styles.textDashed}`}>{LANG('总收益')}(USDT)</span>
          </div>
        </div>
        <div className={`${styles.flexSpace}`}>
          <span className={`${styles.textDashed}`}>{LANG('盈亏比')}</span>
          <span className={styles.textPrimary}>{copyOverviewData?.profitLossRate}/</span>
        </div>
        <div className={`${styles.flexSpace}`}>
          <span className={`${styles.textDashed}`}>{LANG('交易频率')}</span>
          <span className={styles.textPrimary}> {copyOverviewData?.workRate?.mul(100)}%</span>
        </div>
        <div className={`${styles.flexSpace}`}>
          <span className={`${styles.textDashed}`}>{LANG('胜率')}</span>
          <span className={styles.textPrimary}>{tradePercent?.victoryRate?.mul(100)}%</span>
        </div>
        <div>
          <div className={`${styles.flexSpace} ${styles.gap4}`}>
            <div className={`${styles.tradeBox} ${styles.tradeBuy}`} style={{ width: tradePercent.tradeBuy }}></div>
            <div className={`${styles.tradeBox} ${styles.tradeSell}`} style={{ width: tradePercent.tradeBuy  }}></div>
          </div>
          <div className={`${styles.flexSpace} ${styles.mt8}`}>
            <div>
              <p>
                <span>{LANG('盈利笔数')}</span>
                <span className={`${styles.textTrue} ${styles.ml8}`}>{copyOverviewData?.profitOrderNumber}</span>
              </p>
            </div>
            <div>
              <p>
                <span>{LANG('亏损笔数')}</span>
                <span className={`${styles.textError} ${styles.ml8}`}>{copyOverviewData?.lossOrderNumber}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
