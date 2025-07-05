import styles from '@/components/CopyTrading/Components/tradingList.module.scss';
import CommonIcon from '@/components/common-icon';
import { LANG, TrLink } from '@/core/i18n';
import { Copy } from '@/core/shared';
import { useEffect, useState } from 'react';
import { useCopyTradingSwapStore } from '@/store/copytrading-swap';
import { CalibrateValue } from '@/core/shared/src/copy/utils';
import { Button } from '@/components/button';
import { Size } from '@/components/constants';
import { useRouter } from '@/core/hooks/src/use-router';
import ActivateModal from './activateModal';
const CopyTradingMyFollow = (props: any) => {
  const [copyTradingData, setCopyTradingData] = useState({} as any);
  const fetchShareTrader = useCopyTradingSwapStore.use.fetchShareTrader();
  const fetchTraderStatistics = useCopyTradingSwapStore.use.fetchTraderStatistics();
  const isCopyTrader = useCopyTradingSwapStore.use.isCopyTrader();
  const traderStatistics = useCopyTradingSwapStore.use.traderStatistics();
  const bringUserData = useCopyTradingSwapStore.use.bringUserData();
  const isOpenU = useCopyTradingSwapStore.use.isOpenU();
  const isOpenCopy = useCopyTradingSwapStore.use.isOpenCopy();
  const router = useRouter();
  const [cancelShow, setCancelShow] = useState(false);

  useEffect(() => {
    fetchShareTrader(true);
    fetchTraderStatistics();
    getAccount();
  }, []);
  const getAccount = async () => {
    const userInfo: any = await Copy.getUserInfo();
    setCopyTradingData({
      ...userInfo
    });
  };


  return (
    <>
      {(bringUserData.nickname || copyTradingData?.username) && (
        <div className={styles.copyMine}>
          {isOpenU && isOpenCopy && (
            <>
              <div className={`${styles.flexSpan} ${styles.copyInfo}`}>
                <div className={styles.flexCenter}>
                  <img src={'/static/images/copy/copy-logo-default.svg'} alt="avatar" className={styles.avatar} />
                  <span className={styles.pl8}>
                    {' '}
                    {isCopyTrader ? bringUserData.nickname : copyTradingData?.username}
                  </span>
                </div>
                <TrLink
                  href={`/copyTrade/${copyTradingData?.uid}`}
                  query={{ userType: isCopyTrader ? 3 : 1 }}
                  className={styles.textPrimary}
                >
                  <span className={`${styles.flexCenter} ${styles.gap4}`}>
                    <span>{isCopyTrader ? LANG('我的带单') : LANG('我的跟单')}</span>
                    <CommonIcon
                      name={'common-mobile-triangle-down'}
                      width={16}
                      height={16}
                      className={styles.arrow}
                      enableSkin
                    />
                  </span>
                </TrLink>
              </div>
            </>
          )}
          {(!isOpenU || !isOpenCopy) && (
            <div className={`${styles.flexSpan} ${styles.copyInfo}`}>
              <div className={`${styles.flexCenter} ${styles.gap8} ${styles.openInfo}`}>
                <CommonIcon name="common-warning-0" size={24} enableSkin />
                <span> {LANG('暂未开通跟单账户')}</span>
              </div>
              <Button size={Size.DEFAULT} type="brand" width={80} rounded onClick={() => {
                setCancelShow(true)
              }}>
                {LANG('开通')}
              </Button>
            </div>
          )}
          <div className={styles.myIncome}>
            <div>
              <p className={styles.myInTitle} style={isOpenCopy&&isOpenU?CalibrateValue(traderStatistics?.profitAmount7).color:{}}>
                {!isOpenCopy||!isOpenU?'--':CalibrateValue(traderStatistics?.profitAmount7, Copy.copyFixed).value}
              </p>
              <p className={styles.myValue}>{LANG('7天总收益')}(USDT)</p>
            </div>
            <div>
              <p className={styles.myInTitle} style={isOpenCopy&&isOpenU?CalibrateValue(traderStatistics?.profitRate7?.mul(100)).color:{}}>
                {!isOpenCopy||!isOpenU?'--':`${CalibrateValue(traderStatistics?.profitRate7?.mul(100), Copy.copyFixed).value}%`}
              </p>
              <p className={styles.myValue}>{LANG('7天总收益率')}</p>
            </div>
            <div className={styles.textRight}>
              <p
                className={styles.myInTitle}
                style={isOpenCopy&&isOpenU?CalibrateValue(traderStatistics?.profitAmount?.add(traderStatistics?.unRealizedPnl)).color:{}}
              >
                {
                  !isOpenCopy||!isOpenU?'--':CalibrateValue(traderStatistics?.profitAmount?.add(traderStatistics?.unRealizedPnl), Copy.copyFixed)
                    .value
                }
              </p>
              <p className={styles.myValue}>{LANG('今日收益')}(USDT)</p>
            </div>
          </div>
        </div>
      )}
      <ActivateModal isOpenU={isOpenU}  title={!isOpenU? '开启跟单交易':'开启跟单账户'} okText={!isOpenU?'去开通':'开通'}
      content={!isOpenU ? '开启跟单交易前，请先确认开通合约交易。':'跟单交易前，请先确认开启跟单账户。'}
        isOpen={cancelShow} close={() => setCancelShow(false)} />
    </>
  );
};

export default CopyTradingMyFollow;
