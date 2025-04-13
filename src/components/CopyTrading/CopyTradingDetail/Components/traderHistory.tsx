import React, { useEffect, useMemo, useState } from 'react';
import styles from '../index.module.scss';
import { useRouter } from '@/core/hooks';
import { CopyTradeType } from './types';
import Image from '@/components/image';
import CopyToClipboard from 'react-copy-to-clipboard';
import { LANG } from '@/core/i18n';
import { message } from '@/core/utils';
import { useCopyState } from '@/core/hooks/src/use-copy-state';
import { EmptyComponent } from '@/components/empty';
import { useResponsive } from '@/core/hooks';
import dayjs from 'dayjs';
import { Copy } from '@/core/shared';
export default function TraderHistory() {
  const { isMobile } = useResponsive();
  const { copyUserType } = useCopyState();
  const router = useRouter();
  const [historyData, setHistoryData] = useState([]);
  const isMybring = useMemo(() => {
    return copyUserType === CopyTradeType.myBring;
  }, [copyUserType]);

  const fetchHistoryList = async () => {
    const now = Date.now();
    const user: any = Copy.getUserInfo();
    const { id } = router.query;
    const params: any = {
      // beginDate: dayjs(now).toDate().getTime(),
      // endDate: dayjs(now).toDate().getTime(),
      lUid: id,
      page: 1,
      size: 20
    };
    const res: any = await Copy.getPageCopyTradePositionHistory(params);
    console.log(res, 'res=======');
    setHistoryData(res?.data?.pageData || []);
  };
  useEffect(() => {
    fetchHistoryList();
  }, []);
  return (
    <>
      <div className={styles.tradeHistory}>
        <div>
          {historyData &&
            historyData.map((item: any, index) => {
              return (
                <div
                  key={item.id}
                  className={`${historyData.length !== index + 1 && styles.historyBox} ${styles.currentItem}`}
                >
                  <div className={`${styles.historyHeader} ${styles.flexCenter} ${styles.gap8}`}>
                    <div className={`${styles.flexCenter} ${styles.gap8}`}>
                      <img src={item.url} alt="avatar" className={styles.avatar} />
                      <div className={`${styles.symbolBox} ${styles.flexCenter}`}>
                        <span>{item.symbol}</span>
                        <span>{item.symbolType}</span>
                      </div>
                    </div>
                    <div className={`${styles.flexCenter} ${styles.gap8}`}>
                      <span className={`${styles.paddingBox} ${styles.coinName}`}>{item.coinName}</span>
                      <span
                        className={`${styles.paddingBox} ${item.sellType === 'BUY' ? styles.buyBox : styles.sellBox}`}
                      >
                        <span>{item.sellName}</span>
                        <span>{item.leverageLevel}</span>
                      </span>
                      <span className={styles.label}>{item.openTime}</span>
                    </div>
                  </div>
                  <div
                    className={`${styles.historyContainer} ${
                      !isMybring ? styles.tradeRow : isMobile ? styles.tradeRow3 : styles.tradeRow4
                    }`}
                  >
                    <div className={`${styles.gap8} ${styles.lineGap}`}>
                      <label className={styles.label}>{LANG('开仓时间')}</label>
                      <span className={styles.value}>{item.ctime}</span>
                    </div>
                    <div className={`${styles.gap8} ${styles.lineGap}`}>
                      <label className={styles.label}>{LANG('开仓均价')}</label>
                      <span className={styles.value}>{item.avgPrice}</span>
                    </div>
                    <div className={`${styles.gap8} ${styles.lineGap}`}>
                      <label className={styles.label}>{LANG('已实现盈亏')}</label>
                      <span
                        className={`${styles.value} ${Number(item.profit) > 0 ? styles.textTrue : styles.textError}`}
                      >
                        {item.profit}
                      </span>
                    </div>
                    <div className={`${styles.gap8} ${styles.lineGap}`}>
                      <label className={styles.label}>{LANG('平仓时间')}</label>
                      <span className={styles.value}>{item.mtime}</span>
                    </div>
                    <div className={`${styles.gap8} ${styles.lineGap}`}>
                      <label className={styles.label}>{LANG('平仓均价')}</label>
                      <span className={styles.value}>{item.positionAvgPrice}</span>
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
                    <div className={`${styles.gap8} ${styles.lineGap}`}>
                      <label className={styles.label}>{LANG('平仓量')}</label>
                      <span className={styles.value}>{item.dealVolume}</span>
                    </div>
                    {isMybring && (
                      <div className={`${styles.gap8} ${styles.lineGap}`}>
                        <label className={styles.label}>{LANG('订单编号')}</label>
                        <span className={`${styles.value} ${styles.flexInline}`}>
                          {item.orderId}
                          <CopyToClipboard text={item.orderId} onCopy={() => message.success(LANG('复制成功'))}>
                            <Image
                              src="/static/icons/primary/common/copy-brand.svg"
                              className="copy"
                              width={20}
                              height={20}
                            />
                          </CopyToClipboard>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          {!historyData.length && <EmptyComponent />}
        </div>
      </div>
    </>
  );
}
