import React, { useContext, useEffect, useRef, useState } from 'react';
import styles from '../index.module.scss';
import LeverType from './leverType';
import { LANG } from '@/core/i18n';
import { FOLLOWERS_DATA,OVERVIEW_DATA } from '@/core/shared/src/copy/types';
export default function Overview(props: {followersData:FOLLOWERS_DATA[],overviewData:OVERVIEW_DATA}) {
  const copyFollowersData = props.followersData

  const LeverContainer = () => {
    return (
      <>
        <div className={`${styles.followerContainer}  ${styles.gap24}`}>
          {copyFollowersData.map((item,idx) => {
            return (
              <div className={`${styles.flexSpace}`} key={item.id}>
                <div className={styles.flexCenter}>
                  <LeverType leverType={idx+1} />
                  <div className={`${styles.leverInfo} ${styles.flexCenter} `}>
                    <img src={`/static/images/copy/copy-logo-default.svg`} alt="avatar" className={styles.avatar} />
                    <span> {item.fUid} </span>
                  </div>
                </div>
                <div className={`${item.totalProfit > 0 ? styles.textTrue : styles.textError}`}>{item?.totalProfit?.toFormatUnit()}</div>
              </div>
            );
          })}
        </div>
      </>
    );
  };
  return (
    <>
      <div className={`${styles.all24} ${styles.gap24}`}>
        <div className={styles.performanceTitle}>{LANG('跟随者')}</div>
        <div className={`${styles.flexSpace} ${styles.incomeBox}`}>
          <span className={`${styles.textDashed}`}>{LANG('当前跟随者')}</span>
          <div className={styles.textPrimary}>
            <span>{props.overviewData.currentFollowers}</span>
            <span>/{props.overviewData.totalFollowers}</span>
          </div>
        </div>
        <LeverContainer />
      </div>
    </>
  );
}
