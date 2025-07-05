import React, { useContext, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import styles from './positionsList.module.scss';
import { LANG } from '@/core/i18n';

export default function CopyTradingTradingList() {
  return (
    <div className={styles.copyTradingTradingList}>
      <div className={styles.symbolList}>
        <div className={styles.symbolHeaderItem}>
          <img
            className={styles.symbolLogoImg}
            src="https://www.okx.com/cdn/oksupport/asset/currency/icon/btc.png?x-oss-process=image/format,webp"
          />
          <span className={styles.symbolName}>BTCUSDT</span>
          <span className={styles.symbolType}>{LANG('永续')}</span>
          <span className={styles.symbolTadingType}>{LANG('全仓')}</span>
          <span className={styles.symbolLeverage}>
            <span className={styles.symbolLeverageUp}>{LANG('多')}</span>
            <span>125.00x</span>
          </span>
          <span className={styles.symbolTadingTime}>2024-12-26 19:09:45</span>
        </div>
        <div className={styles.symbolItem}>
        <div className={styles.symbolItemContent}>
          <div className={styles.symbolListware}>
            <div className={styles.symbolListTitleInfo}>
              <p className={styles.symbolListTitle}>{LANG('持仓量')}</p>
              <p className={styles.symbolListTitle}>{LANG('仓位保证金')}</p>
            </div>
            <div className={styles.symbolListInfo}>
              <p className={styles.symbolListDesc}>0.06 BTC</p>
              <p className={styles.symbolListDesc}>279.0832 USDT</p>
            </div>
          </div>
          <div className={styles.symbolListware}>
            <div className={styles.symbolListTitleInfo}>
              <p className={styles.symbolListTitle}>持仓量</p>
              <p className={styles.symbolListTitle}>仓位保证金</p>
            </div>
            <div className={styles.symbolListInfo}>
              <p className={styles.symbolListDesc}>0.06 BTC</p>
              <p className={styles.symbolListDesc}>279.0832 USDT</p>
            </div>
          </div>
          <div className={styles.symbolListware}>
            <div className={styles.symbolListTitleInfo}>
              <p className={styles.symbolListTitle}>持仓量</p>
              <p className={styles.symbolListTitle}>仓位保证金</p>
            </div>
            <div className={styles.symbolListInfo}>
              <p className={styles.symbolListDesc}>0.06 BTC</p>
              <p className={styles.symbolListDesc}>279.0832 USDT</p>
            </div>
          </div>
        </div>
        <div className={styles.symbolTradingBtn}>
        平仓
        </div>
        </div>
   
      </div>
    </div>
  );
}
