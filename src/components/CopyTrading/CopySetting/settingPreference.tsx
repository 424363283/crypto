import styles from './index.module.scss';
import React, { PureComponent, useEffect, useState } from 'react';
import PreferencePieChart from '../CopyTradingDetail/Components/preferencePieChart';
import { Copy } from '@/core/shared';
import { LANG } from '@/core/i18n';
import { useRouter } from '@/core/hooks';
import { EmptyComponent } from '@/components/empty';
export default function Preference() {
  const router = useRouter();
  const { id ,userType} = router.query

  const [performanceData, setPerformanceData] = useState([]);
  // 持仓分布
  const fetchPreference = async () => {
    const preference = await Copy.fetchCopyTradeUserTradProportion({ uid: id });

    if (preference?.code === 200) {
      const copyPreferenceColor = ['var(--brand)', '#627EEA', 'var(--yellow)', '#5AB8DB', '#2AB26C', 'var(--red)'];
      const showData =
        preference?.data &&
        preference.data?.sort((a: any, b: any) => Number(b.currentAmount) - Number(a.currentAmount)).slice(0, 5);
      const preTotal = showData?.reduce((total: number, item: any) => total + item.currentAmount, 0);
      const total = preference?.data?.reduce((total: number, item: any) => total + item.currentAmount, 0); // 总的total
      // 前五个综合加起来不等于
      if (preTotal && preTotal !== total && showData?.length > 0) {
        const otherValue = total.sub(preTotal);
        showData.push({
          symbol: LANG('其他'),
          currentAmount: otherValue
        });
      }
      const showTotal = 0;
      let forMatData: any = showData.map((item, idx) => {
        const calValue = item?.currentAmount?.div(total);
        showTotal.add(calValue);
        const calValueRate = calValue.mul(100)?.toRound(2);
        return {
          ...item,
          color: copyPreferenceColor[idx],
          value: calValueRate,
          currentValue: Number(calValueRate),
          name: item?.symbol.replace('-', '')?.toUpperCase()
        };
      });
      const calAddCurrent = forMatData?.reduce((dd: number, item: any) => dd + Number(item.value), 0);
      if (forMatData?.length > 1 && calAddCurrent !== 100) {
        const sliceLastArr = forMatData?.slice(0, forMatData?.length - 1);
        const subLen = forMatData?.length && forMatData?.length - 1;
        const calPreValue = sliceLastArr.reduce((total: number, item: any) => total + Number(item.value), 0);
        const obj = forMatData[subLen] || { value: '' };
        obj.value = (100 - calPreValue.toFixed(2)).toFixed(2);
      }
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
          {performanceData.map((item, idx) => {
            return (
              <div className={`${styles.flexCenter}`} key={idx}>
                <div className={styles.symbolIcon} style={{ background: item.color }}></div>
                <div className={styles.symbol}>{item.name}</div>
                <div> {item?.value}%</div>
              </div>
            );
          })}
        </div>
      </>
    );
  };
  return (
    <div className={styles.tradePreferencePie}>
      <div className={`${styles.preferenTitle}`}> {LANG('近{days}日交易偏好', { days: 7 })}</div>
      <div className={styles.flexSpace}>
        {performanceData?.length > 0 && (
          <>
            <PreferenceSymbol preferenceData={performanceData} />
            <PreferencePieChart showActive={false} copyPreferenceData={performanceData} />
          </>
        )}
        {!performanceData?.length && <EmptyComponent />}
      </div>
    </div>
  );
}
