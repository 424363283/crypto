import styles from '../index.module.scss';
import React, { PureComponent, useEffect, useState } from 'react';
import PreferencePieChart from './preferencePieChart';
import { LANG } from '@/core/i18n';
import { PREFERENCE_DATA } from '@/core/shared/src/copy/types';
import { Copy } from '@/core/shared';
import { useCopyState } from '@/core/hooks/src/use-copy-state';
export default function Preference(props: { preferenceData: PREFERENCE_DATA[] }) {
  const [preferenceeData, setPreferenceeData] = useState([]);
 const { copyUserId } = useCopyState();
  // 币种偏好
  const fetchPreference = async () => {
    const preference = await Copy.fetchCopyTradeUserTradProportion({ uid: copyUserId});
    if (preference.code === 200) {
      const copyPreferenceColor = ['var(--brand)', 'var(--yellow)', 'var(--green)', '#EC8E41'];
      const copyPreferenceData =
        preference.data &&
        preference.data.map((item, idx) => {
          return {
            ...item,
            color: copyPreferenceColor[idx],
            value: item.current,
            name: item?.symbol.replace('_', '')
          };
        });
      setPreferenceeData(copyPreferenceData);
    }
  };
  useEffect(() => {
    fetchPreference();
  }, []);
  const PreferenceSymbol = () => {
    return (
      <>
        <div className={`${styles.preferenceBox} ${styles.gap24}`}>
          {preferenceeData.map((item, idx) => {
            return (
              <div className={`${styles.flexCenter}`} key={item.symbol}>
                <div className={styles.symbolIcon} style={{ background: item.color }}></div>
                <div className={styles.symbol}>{item?.name}</div>
                <div> {item.current}%</div>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  return (
    <>
      <div>
        <div className={`${styles.all24} ${styles.gap24}`}>
          <div className={styles.performanceTitle}>{LANG('币种偏好')}</div>
          <div className={styles.flexSpace}>
            <PreferenceSymbol />
            <PreferencePieChart copyPreferenceData={preferenceeData} />
          </div>
        </div>
      </div>
    </>
  );
}
