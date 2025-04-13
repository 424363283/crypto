import React, { useContext, useEffect, useRef, useState } from 'react';
import styles from '../index.module.scss';
import CopyBtn from './copyBtn';
import { CopyTradeType } from './types';
import { EmptyComponent } from '@/components/empty';
import { useCopyState } from '@/core/hooks/src/use-copy-state';
import { useResponsive } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Copy } from '@/core/shared';
import { Loading } from '@/components/loading';
import { message } from '@/core/utils';
export default function TraderCurrent() {
  const { copyUserType,copyUserId } = useCopyState();
  const { isMobile } = useResponsive();
  const [positionList, setPositionList] = useState([]);
  const fetchCurrentPosition = async () => {
    const res: any = Copy.fetchSwapPositiont({
      uid: copyUserId
    });
    if (res.code === 200) {
      setPositionList(res.data);
    }
  };
  useEffect(() => {
    fetchCurrentPosition();
  }, []);
  const handleClose = async (data: any) => {
    const params = {
      subWallet: data.subWallet,
      positionId: data['positionId'],
      side: data['side'] == '1' ? 1 : 2,
      symbol: data['symbol'].toUpperCase(),
      source: 1,
      ...data
    };
    Loading.start();
    const res = await Copy.fetchPostSwapPositionClose({ params });
    Loading.end();
    if (res.code === 200) {
      fetchCurrentPosition();
    } else {
      message.error(res.message);
    }
  };
  const CopyPlain = (props: { item: any }) => {
    return (
      <div className={isMobile ? styles.mt24 : ''}>
        {copyUserType === CopyTradeType.myBring && (
          <CopyBtn width={isMobile ? '100%' : ''} btnTxt={LANG('平仓')} onClick={handleClose(props.item)} />
        )}
      </div>
    );
  };
  return (
    <>
      <div className={styles.tradeHistory}>
        <div>
          {positionList.map((item: any, index) => {
            return (
              <div
                key={item.id}
                className={`${positionList.length !== index + 1 && styles.historyBox} ${styles.currentItem}`}
              >
                <div className={`${styles.historyHeader} ${styles.flexCenter} ${styles.gap8} `}>
                  <div className={`${styles.flexCenter} ${styles.gap8}`}>
                    <img src={item.url} alt="avatar" className={styles.avatar} />
                    <div className={`${styles.symbolBox} ${styles.flexCenter}`}>
                      <span>{item.symbol}</span>
                      <span>{item.symbolType}</span>
                    </div>
                  </div>
                  <div className={`${styles.flexCenter} ${styles.gap8}`}>
                    <span className={`${styles.paddingBox} ${styles.coinName}`}>{item.coinName}</span>
                    <span className={`${styles.paddingBox} ${item.side === 1 ? styles.buyBox : styles.sellBox}`}>
                      <span>{item.positionSide === 'LONG' ? LANG('多') : LANG('空')}</span>
                      <span>{item.leverage}</span>
                    </span>
                    <span className={styles.label}>{item.openTime}</span>
                  </div>
                </div>
                <div>
                  <div className={`${styles.flexCenter}`}>
                    <div className={`${styles.historyContainer}  ${styles.flex1} ${styles.tradeRow}`}>
                      <div className={`${styles.gap8} ${styles.lineGap}`}>
                        <label className={styles.label}>{LANG('持仓量')}</label>
                        <span className={styles.value}>{item.currentPosition}</span>
                      </div>
                      <div className={`${styles.gap8} ${styles.lineGap}`}>
                        <label className={styles.label}>{LANG('持仓均价')}</label>
                        <span className={styles.value}>{item.avgCostPrice}</span>
                      </div>
                      <div className={`${styles.gap8} ${styles.lineGap}`}>
                        <label className={styles.label}>{LANG('未实现盈亏')}</label>
                        <span
                          className={`${styles.value} ${
                            Number(item.realizedPnl) > 0 ? styles.textTrue : styles.textError
                          }`}
                        >
                          {item.realizedPnl}
                        </span>
                      </div>
                      <div className={`${styles.gap8} ${styles.lineGap}`}>
                        <label className={styles.label}>{LANG('仓位保证金')}</label>
                        <span className={styles.value}>{item.margin}</span>
                      </div>
                      <div className={`${styles.gap8} ${styles.lineGap}`}>
                        <label className={styles.label}>{LANG('标记价格')}</label>
                        <span className={styles.value}>{item.markPrice}</span>
                      </div>
                      <div className={`${styles.gap8} ${styles.lineGap}`}>
                        <label className={styles.label}>{LANG('收益率')}</label>
                        <span
                          className={`${styles.value} ${
                            Number(item.profitRadio) > 0 ? styles.textTrue : styles.textError
                          }`}
                        >
                          {item.profitRadio}
                        </span>
                      </div>
                    </div>
                    {!isMobile && <CopyPlain item={item} />}
                  </div>
                  {isMobile && <CopyPlain item={item} />}
                </div>
              </div>
            );
          })}
          {!positionList.length && <EmptyComponent />}
        </div>
      </div>
    </>
  );
}
