import React, { useContext, useEffect, useRef, useState } from 'react';
import styles from '../index.module.scss';
import { LANG } from '@/core/i18n';
import { OVERVIEW_DATA } from '@/core/shared/src/copy/types';
export default function Overview(props: {overviewData:OVERVIEW_DATA}) {
  const copyOverviewData = props.overviewData
  return (
    <>
      <div className={`${styles.all24} ${styles.gap24} ${styles.h346}`}>
        <div className={styles.performanceTitle}>{LANG('带单员总览')}</div>
        <div className={`${styles.flexSpace}`}>
          <span className={`${styles.textDashed}`}>{LANG('带单天数')}</span>
          <span className={styles.textPrimary}>{copyOverviewData.workDays}</span>
        </div>
        <div className={`${styles.flexSpace}`}>
          <span className={`${styles.textDashed}`}>{LANG('资产规模')}</span>
          <div className={styles.textPrimary}>
            <span>{copyOverviewData.userAmount}</span>/<span>{copyOverviewData.userAmount}</span>
          </div>
        </div>
        <div className={`${styles.flexSpace}`}>
          <span className={`${styles.textDashed}`}>{LANG('带单规模')}</span>
          <span className={styles.textPrimary}>{copyOverviewData.settledTotalAmount}</span>
        </div>
        <div className={`${styles.flexSpace}`}>
          <span className={`${styles.textDashed}`}>{LANG('当前跟随者收益')}</span>
          <span className={styles.textPrimary}>{copyOverviewData.settledTotalProfit}</span>
        </div>
        <div className={`${styles.flexSpace}`}>
          <span className={`${styles.textDashed}`}>{LANG('累计跟单人数')}</span>
          <span className={styles.textPrimary}>{copyOverviewData.totalFollowers}</span>
        </div>
        <div className={`${styles.flexSpace}`}>
          <span className={`${styles.textDashed}`}>{LANG('分润比例')}</span>
          <span className={styles.textPrimary}>{copyOverviewData?.profitRate?.mul(100)}%</span>
        </div>
      </div>
    </>
  );
}
