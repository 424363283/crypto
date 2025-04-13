import { useCopyTradingSwapStore } from '@/store/copytrading-swap';
import styles from './index.module.scss';
import { useEffect, useRef, useState } from 'react';
import CopyTradingCompareBar, { COPYTRADING_TYPE } from './components/copytrading-compare-bar';
import SwapCopyTradingCompare from './swap-compare/swap-trader-compare-list';
import Image from 'next/image';
import { LANG, TrLink } from '@/core/i18n';
import { Breadcrumb } from 'antd';
import { useResponsive } from '@/core/hooks';

export default function CopyTradingCompare() {
  const tradersRef = useRef(null);
  const { isMobile } = useResponsive();
  const fetchRanks = useCopyTradingSwapStore.use.fetchRanks();
  const ranks = useCopyTradingSwapStore.use.copyTradeInfo().ranks;
  const [tabValue, setTabValue] = useState(COPYTRADING_TYPE.SWAP);
  const COMPARE_LIST_MAP = {
    [COPYTRADING_TYPE.SPOT]: <div></div>,
    [COPYTRADING_TYPE.SWAP]: <SwapCopyTradingCompare ref={tradersRef} />
  };

  useEffect(() => {
    // fetchRanks();
  }, []);

  const addTraderHandler = () => {
    tradersRef.current?.addTraderHandler(0);
  };

  const cleanupTraderHandler = () => {
    tradersRef.current?.cleanupTradersHandler();
  };

  const onChangeTab = (v: string) => {
    setTabValue(v as COPYTRADING_TYPE);
  };
  return (
    <>
      <div style={{ color: 'white' }} className={styles.copyTradingCompare}>
        <div
          className={styles.topInfo}
          style={{
            backgroundImage: 'url(/static/images/copytrading/compare-header-bg.png)', // 图片路径
            backgroundSize: 'cover', // 背景图覆盖整个 div
            backgroundPosition: 'center', // 背景图居中
            width: '100%',
            height: isMobile ? '120px' : '200px' // 设置 div 的高度
          }}
        >
          <div className={styles.header}>
            <Breadcrumb
              items={[
                {
                  title: (
                    <TrLink native href="/copyTrade">
                      {LANG('跟单交易')}
                    </TrLink>
                  )
                },
                {
                  title: LANG('交易员PK')
                }
              ]}
            />
            <h1 className={'title'}>{LANG('交易员PK')}</h1>
          </div>
        </div>
        <div className={styles.bottomInfo}>
          <CopyTradingCompareBar
            tabValue={tabValue}
            onChangeTab={onChangeTab}
            onAddClick={addTraderHandler}
            onCleanupClick={cleanupTraderHandler}
          />
          {COMPARE_LIST_MAP[tabValue]}
        </div>
      </div>
    </>
  );
}
