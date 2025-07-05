import styles from './index.module.scss';
import { Svg } from '@/components/svg';
import { LANG, TrLink } from '@/core/i18n';
import CommonIcon from '@/components/common-icon';
import SettingPreference from './settingPreference';
import { useEffect, useState } from 'react';
import { Copy } from '@/core/shared';
import { CalibrateValue } from '@/core/shared/src/copy/utils';
import { useRouter } from '@/core/hooks/src/use-router';
const CopyTradingItem = (props: any) => {
    const router = useRouter();
    const {id} = router.query
  const [bringData, setBringData] = useState({});
  const [tradeInfo, setTradeInfo] = useState({});
  // 带单数据
  const fetchBringData = async () => {
    const bringData = await Copy.fetchCopyTradeuserStatisticsSummary({ cycle: 7, uid: id });
    if (bringData.code === 200) {
      const copyBringData:any = bringData.data
      const total = copyBringData[`profitOrderNumber30`]?.add(copyBringData[`lossOrderNumber30`]);
      const win:any =  copyBringData[`profitOrderNumber30`]?.div(total) || 0
      copyBringData.percentWin = win
      setBringData(copyBringData);
    }
  };
  // 获取交易员或跟单员详情
  const getTraderDetail = async () => {
       if (id) {
         const res = await Copy.fetchShareTraderDetail({ lUid: id });
         if (res?.code === 200) {
           const result = res.data;
           const base = await Copy.fetchCopyTradeuserBase({ uid: id });
           if (base.code === 200) {
             setTradeInfo({
               ...result,
               ...base.data
             });
           } else {
             setTradeInfo({
               ...result,
             });
           }
   
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
              <Svg src={`/static/icons/primary/common/copy-lever-${tradeInfo.traderType || 1}.svg`} width={16} height={16} />
            </div>
            <div className={`${styles.flexCenter} ${styles.gap4}`}>
             <CommonIcon name="common-copy-user" width={16} height={16} />
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
            <span style={CalibrateValue(bringData?.profitRate30).color}>{CalibrateValue(bringData?.profitRate30?.mul(100),Copy.copyFixed)?.value}%</span>
          </div>
          <div className={styles.flexSpace}>
            <label>{LANG('近30日收益额')}</label>
            <span style={CalibrateValue(bringData?.profitAmount30).color}>{CalibrateValue(bringData?.profitAmount30,Copy.copyFixed)?.value} USDT</span>
          </div>
          <div className={styles.flexSpace}>
            <label>{LANG('近30日胜率')}</label>
            <span>{bringData.victoryRate30?bringData.percentWin?.mul(100)?.toFixed(Copy.copyFixed):'0'}%</span>
          </div>
          <div className={styles.flexSpace}>
            <label>{LANG('带单规模')}</label>
            <span>{tradeInfo?.settledTotalAmount?tradeInfo?.settledTotalAmount?.toFormat(Copy.copyFixed):'0'} USDT</span>
          </div>
          <div className={styles.flexSpace}>
            <label>{LANG('分润比例')}</label>
            <span>{tradeInfo?.shareRoyaltyRatio?tradeInfo?.shareRoyaltyRatio?.mul(100).toFixed(Copy.copyFixed):'0'}%</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default CopyTradingItem;
