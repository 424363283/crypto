import React, { useEffect, useState } from 'react';
import styles from '@/components/CopyTrading/CopyTradingDetail/index.module.scss';
import { CopyTradeType, CopyTradeSetting } from './types';
import CopyBtn from './copyBtn';
// import { useCopyState } from '@/core/hooks/src/use-copy-state';
import { useResponsive, useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Copy } from '@/core/shared';
import dayjs from 'dayjs';
import { useCopyTradingSwapStore } from '@/store/copytrading-swap';
import { maginModelOpts, leverModelOpts, copyStyleObj } from '@/components/CopyTrading/CopyTradingDetail/meta';
export default function TraderFollowerSetting() {
  const router = useRouter();
  const localLang = router.query.locale || 'en';
  const { id } = router.query as any;
  const isRefresh = useCopyTradingSwapStore.use.isRefresh();
  const { isMobile } = useResponsive();
  const [followData, setFollowData] = useState({} as any);

  const PreIcon = () => {
    return (
      <>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M9.99984 3.99996L11.9998 5.99996M8.6665 13.3333H13.9998M3.33317 10.6666L2.6665 13.3333L5.33317 12.6666L13.0572 4.94263C13.3071 4.69259 13.4476 4.35351 13.4476 3.99996C13.4476 3.64641 13.3071 3.30733 13.0572 3.05729L12.9425 2.94263C12.6925 2.69267 12.3534 2.55225 11.9998 2.55225C11.6463 2.55225 11.3072 2.69267 11.0572 2.94263L3.33317 10.6666Z"
            stroke="white"
            stroke-width="1.33333"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </>
    );
  };

  const fetchConfig = async () => {
    let { id } = router.query;
    const user: any = await Copy.getUserInfo();
    const res: any = await Copy.fetchCopyTraderConfigDetail({
      lUid: id,
      fUid: user?.uid
    });
    if (res?.code === 200) {
      setFollowData({
        ...res.data,
        contractString: showContract(res.data.contractInfo),
        showMarginMode: marginModeFun(res.data.marginMode),
        showPositionLeverage: positionLeverageFun(res.data)
      });
    }
  };
  const showContract = (contractInfo: string) => {
    if (!contractInfo) return '';
    const contract = contractInfo && JSON.parse(contractInfo);
    return (
      contract &&
      Object.values(contract)
        .map((key: any, idx) => key.replace('-', '').toUpperCase())
        .join(',')
    );
  };
  const marginModeFun = (margin: string) => {
    if (!margin) return '';
    return maginModelOpts.find(m => m.value === margin)?.label;
  };
  const positionLeverageFun = (leverage: object) => {
    if (!leverage) return '';
    const findObj = leverModelOpts.find(m => m.value === leverage.positionLeverage);
    if (!findObj) return '';
    if (leverage.positionLeverage === 2) return `${findObj?.label || ''} ${leverage?.leverageLevel || ''}X`;
    return `${findObj?.label} `;
  };
  useEffect(() => {
    if (isRefresh) {
      fetchConfig();
    }
  }, [isRefresh]);

  useEffect(() => {
    fetchConfig();
  }, []);
  return (
    <div className={`${styles.all24} ${styles.settingTrade}`}>
      <div className={styles.flexSpace}>
        <div className={`${isMobile ? styles.flexCol : ''}`}>
          <label className={`${styles.label} ${localLang === 'en' && styles.labelEN}`}>{LANG('设置时间')}</label>
          <span className={`${styles.textPrimary} ${styles.showTime}`}>{followData?.followStatus === 0 ? dayjs(followData.mtime).format('YYYY-MM-DD HH:mm:ss') : ''}</span>
        </div>
        <CopyBtn
          onClick={() => {
            router.push(
              `/copyTrade/setting/${id}?userType=${CopyTradeType.traderDetail}&copyActiveType=${CopyTradeSetting.futures}`
            );
          }}
          btnTxt={LANG('编辑')}
          preIcon={<PreIcon />}
          width={120}
        />
      </div>
      <div>
        <div className={styles.title}>{LANG('基础设置')}</div>
        <div className={styles.tradeRow}>
          <div>
            <label className={`${localLang === 'en' && styles.labelEN}`}>{LANG('跟单方式')}</label>
            <span>
              {copyStyleObj[followData.copyStyle]}{' '}
              {followData.copyStyle === 1 && <span>{followData.fixedQuota} USDT</span>}
              {followData.copyStyle === 2 && <span>{followData.magnification}</span>}
            </span>
          </div>
          {/* <div>
            <label>{LANG('跟单额度')}</label>
            <span>100 USDT</span>
          </div> */}
          <div className={`${styles.flexCenter}`}>
            <label className={`${localLang === 'en' && styles.labelEN}`}>{LANG('跟单合约')}</label>
            <span className={styles.textOverflow}>{followData?.contractString}</span>
          </div>
          <div>
            <label className={`${localLang === 'en' && styles.labelEN}`}>{LANG('保证金模式')}</label>
            <span>{followData.showMarginMode}</span>
          </div>
          <div>
            <label className={`${localLang === 'en' && styles.labelEN}`}>{LANG('杠杆模式')}</label>
            <span>{followData?.showPositionLeverage}</span>
          </div>
        </div>
      </div>
      {/* <div className={styles.title}>{LANG('风控设置')}</div>
      <div className={styles.tradeRow}>
        <div>
          <label>{LANG('止盈/止损比例')}</label>
          <span>
            <span>100%</span>
            <span>/</span>
            <span>100%</span>
          </span>
        </div>
        <div>
          <label>{LANG('最大跟单金额')}</label>
          <span>--</span>
        </div>
        <div>
          <label>{LANG('跟单止损')}</label>
          <span>500.00 USDT</span>
        </div>
      </div> */}
    </div>
  );
}
