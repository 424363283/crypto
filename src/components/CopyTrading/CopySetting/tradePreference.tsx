import styles from './index.module.scss';
import { Svg } from '@/components/svg';
import { LANG, TrLink } from '@/core/i18n';
import SettingPreference from './settingPreference';
import { useEffect, useState } from 'react';
import { Copy } from '@/core/shared';
import { useCopyState } from '@/core/hooks/src/use-copy-state';
const CopyTradingItem = (props: any) => {
  const { copyUserId } = useCopyState();
  const [bringData, setBringData] = useState({});
  const [tradeInfo, setTradeInfo] = useState({});
  // 带单数据
  const fetchBringData = async () => {
    const bringData = await Copy.fetchCopyTradeuserStatisticsSummary({ cycle: 7, uid: copyUserId });
    if (bringData.code === 200) {
      setBringData(bringData.data);
    }
  };
  // 获取交易员或跟单员详情
  const getTraderDetail = async () => {
    if (copyUserId) {
      const res = await Copy.fetchShareTraderDetail({ lUid: copyUserId });
      if (res.code === 200) {
        const result = res.data;
        setTradeInfo({
          ...result
        });
      }
    }
  };
  useEffect(() => {
    fetchBringData();
    getTraderDetail();
  }, []);
  return (
    <>
      <div className={styles.copySettingItem}>
        <div className={`${styles.flexCenter} ${styles.mb24}`}>
          <img src={'/static/images/copy/copy-logo-default.svg'} alt="avatar" className={styles.avatar} />
          <div>
            <div className={`${styles.flexCenter} ${styles.copyName} ${styles.gap4}`}>
              <span>{tradeInfo?.nickname}</span>
              <Svg src={`/static/icons/primary/common/copy-lever-${tradeInfo.traderType}.svg`} width={16} height={16} />
            </div>
            <div className={`${styles.flexCenter} ${styles.gap4}`}>
              <Svg src={`/static/icons/primary/common/copy-user.svg`} width={12} height={12} />
              <div className={styles.ml4}>
                <span className={styles.currentAmount}>{tradeInfo?.currentCopyTraderCount}</span>
                <span>/{tradeInfo?.maxCopyTraderCount}</span>
              </div>
            </div>
          </div>
        </div>
        <SettingPreference />
        <div className={styles.incomeBox}>
          <div className={styles.flexSpace}>
            <label>{LANG('近{days}日收益率', { days: 30 })}</label>
            <span>{bringData?.profitRate30?.mul(100)}%</span>
          </div>
          <div className={styles.flexSpace}>
            <label>{LANG('近30日收益额')}</label>
            <span>{bringData?.profitAmount30}</span>
          </div>
          <div className={styles.flexSpace}>
            <label>{LANG('近30日胜率')}</label>
            <span>{bringData.victoryRate30?.mul(100)}%</span>
          </div>
          <div className={styles.flexSpace}>
            <label>{LANG('带单规模')}</label>
            <span>{tradeInfo.settledTotalAmount}</span>
          </div>
          <div className={styles.flexSpace}>
            <label>{LANG('分润比例')}</label>
            <span>{tradeInfo?.shareRoyaltyRatio?.mul(100)}%</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default CopyTradingItem;
