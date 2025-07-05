'use client';
import styles from './leadtrader-info.module.scss';
import { Svg } from '@/components/svg';
import CommonIcon from '@/components/common-icon';
import Radio from '@/components/Radio';
import { LANG } from '@/core/i18n';
import { Copy } from '@/core/shared';
import CopyTradingTrend from '../../Components/copyTradingTrend';
import { CalibrateValue } from '@/core/shared/src/copy/utils';
import { useResponsive } from '@/core/hooks';
interface CopyItem {
  id: number;
  name: string;
  url: string;
  nickname: string;
  traderType: number;
  currentCount: number;
  totalCount: number;
  income: number;
  win: number;
  amount: number;
  scale: number;
  symbolList: Array<any>;
  wiRadio: number;
  isChecked?: Boolean;
  currentCopyTraderCount: number;
  maxCopyTraderCount: number;
  settledTotalAmount: number;
  victoryRate30: number;
  profitAmount30: number;
  profitRate30: number;
  followAssetMax: number;
}

const LeadTraderItem = (props: { copyItem: CopyItem; onAdd: (id: number, isCheck: boolean) => void }) => {
  const item = props?.copyItem;
  const onAdd = props?.onAdd;
  const showBest = props.copyItem?.isChecked;
  const { isMobile } = useResponsive();
  return (
    <>
      <div className={`${styles.copyItem}`}>
        <div className={styles.userInfo}>
          <div className={`${styles.flexCenter} ${styles.mb24}`}>
            <img src={'/static/images/copy/copy-logo-default.svg'} alt="avatar" className={styles.avatar} />
            <div>
              <div className={`${styles.flexCenter} ${styles.copyName} ${styles.gap4}`}>
                <span>{item.nickname}</span>
                {/* <Svg src={`/static/icons/primary/common/copy-lever-${item.traderType}.svg`} width={16} height={16} /> */}
              </div>
              <div className={`${styles.flexCenter} ${styles.gap4}`}>
                <CommonIcon name="common-copy-user" width={16} height={16} />
                <div>
                  <span className={styles.currentAmount}>{item.currentCopyTraderCount}</span>
                  <span>/{item.maxCopyTraderCount}</span>
                </div>
              </div>
            </div>
          </div>
          <span className={styles.mt10}>
            <Radio size={20} label={''} checked={showBest} onChange={() => onAdd(item.id, !showBest)} />
          </span>
        </div>
        <div className={`${styles.flexSpan} ${styles.leadtraderItem}`}>
          <div className={styles.assetCol}>
            <p className={styles.assetItem}>
              <span className={styles.assetLabel}>{LANG('资产规模')}</span>
              <span className={styles.copyCount}>{item.userAmount?.toFormat(Copy.copyFixed)}</span>
            </p>
            <p className={styles.assetItem}>
              <span>{LANG('近30日收益额')}</span>
              <span className={styles.copyCount}>
                {CalibrateValue(item?.copyTradeUserStatisticsSummaryVo?.profitAmount30, Copy.copyFixed).value}
              </span>
            </p>
            <p className={styles.assetItem}>
              <span>{LANG('近{days}日收益率', { days: 30 })}</span>
              <span className={styles.copyCount}>
                {CalibrateValue(item?.copyTradeUserStatisticsSummaryVo?.profitRate30?.mul(100),Copy.copyFixed).value}%
              </span>
            </p>
            <p className={styles.assetItem}>
              <span>{LANG('带单规模')}</span>
              <span className={styles.copyCount}>{item?.settledTotalAmount?.toFormat(Copy.copyFixed)}</span>
            </p>
            <p className={styles.assetItem}>
              <span>{LANG('近30日跟随者收益')}</span>
              <span className={styles.copyCount}>{item?.settledTotalProfit?.toFormat(Copy.copyFixed)}</span>
            </p>
            <p className={styles.assetItem}>
              <span>{LANG('近30日胜率')}</span>
              <span className={styles.copyCount}>{
                item?.copyTradeUserStatisticsSummaryVo[`profitOrderNumber${30}`] && (item?.copyTradeUserStatisticsSummaryVo[`profitOrderNumber${30}`]?.div(item?.copyTradeUserStatisticsSummaryVo[`profitOrderNumber${30}`].add(item?.copyTradeUserStatisticsSummaryVo[`lossOrderNumber${30}`])).mul(100).toFixed(Copy.copyFixed))
                } %</span>
            </p>
          </div>
          <div>
            <CopyTradingTrend
              chartData={item.list}
              chartShowKey={'profitRate'}
              height={isMobile ? 50 : 104}
              width={isMobile ? 306 : 136}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default LeadTraderItem;
