import styles from './index.module.scss';
import React, { PureComponent, useEffect, useState } from 'react';
import PreferencePieChart from '../CopyTradingDetail/Components/preferencePieChart';
import { Copy } from '@/core/shared';
import { useCopyState } from '@/core/hooks/src/use-copy-state';
import { LANG } from '@/core/i18n';
export default function Preference() {
  const { copyUserType, copyUserId } = useCopyState();

  const [performanceData, setPerformanceData] = useState([]);
  // 持仓分布
  const fetchPreference = async () => {
    const preference = await Copy.fetchCopyTradeUserTradProportion({ uid: copyUserId });
    const copyPreferenceColor = ['var(--brand)', 'var(--yellow)', 'var(--green)', '#EC8E41'];
    const forMatData =
    preference.data && preference.data.map((item, idx) => {
        return {
          ...item,
          color: copyPreferenceColor[idx],
          value: item.current,
          name: item?.symbol.replace('_', '')
        };
      });
    if (preference.code === 200) {
      setPerformanceData(forMatData);
      
    }
  };
  useEffect(() => {
    fetchPreference();
  }, []);
  
  const PreferenceSymbol = (props: { preferenceData: any }) => {
    return (
      <>
        <div className={`${styles.preferenceBox} ${styles.gap24}`}>
          {performanceData.map((item,idx) => {
            return (
              <div className={`${styles.flexCenter}`} key={idx}>
                <div className={styles.symbolIcon} style={{ background: item.color }}></div>
                <div className={styles.symbol}>{item.name}</div>
                <div> {item.value}%</div>
              </div>
            );
          })}
        </div>
      </>
    );
  };
  return (
    <div className={styles.tradePreferencePie}>
      <div className={`${styles.preferenTitle}`}> {LANG('近{days}日交易偏好',{days: 7})}</div>
      <div className={styles.flexSpace}>
        <PreferenceSymbol preferenceData={performanceData} />
        <PreferencePieChart copyPreferenceData={performanceData} />
      </div>
    </div>
  );
}
