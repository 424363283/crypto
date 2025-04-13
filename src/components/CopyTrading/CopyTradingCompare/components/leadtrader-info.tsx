'use client';
import styles from './leadtrader-info.module.scss';
import { Svg } from '@/components/svg';
import CommonIcon from '@/components/common-icon';
import Radio from '@/components/Radio';
import { LANG } from '@/core/i18n';
import CopyTradingTrend from '../../Components/copyTradingTrend';
interface CopyItem {
  id: number;
  name: string;
  url: string;
  leverType: number;
  currentCount: number;
  totalCount: number;
  income: number;
  win: number;
  amount: number;
  scale: number;
  symbolList: Array<any>;
  wiRadio: number;
  isChecked?: Boolean
}

const LeadTraderItem = (props: {
  copyItem: CopyItem;
  onAdd: (id: number,isCheck:boolean) => void;
}) => {
  const item = props?.copyItem;
  const onAdd = props?.onAdd;
  const showBest = props.copyItem?.isChecked;
  return (
    <>
      <div className={`${styles.copyItem}`}>
        <div className={styles.flexSpan}>
          <div className={`${styles.flexCenter} ${styles.mb24}`}>
            <img src={item.url} alt="avatar" className={styles.avatar} />
            <div >
              <div className={`${styles.flexCenter} ${styles.copyName} ${styles.gap4}`}>
                <span>{item.name}</span>
                <Svg src={`/static/icons/primary/common/copy-lever-${item.leverType}.svg`} width={16} height={16} />
              </div>
              <div className={`${styles.flexCenter} ${styles.gap4}`}>
                <CommonIcon name="common-copy-user" width={12} height={12} />
                <div>
                  {' '}
                  <span className={styles.currentAmount}>{item.currentCount}</span>
                  <span>/{item.totalCount}</span>
                </div>
              </div>
            </div>
          </div>
          <Radio
              size={14}
              label={''}
              checked={showBest}
              onChange={() => onAdd(item.id,!showBest)}
            />
        </div>
        <div className={styles.flexSpan}>
          <div className={styles.assetCol}>
            <p className={styles.assetItem}>
              <span className={styles.assetLabel}>{LANG('资产规模')}</span>
              <span className={styles.copyCount}>{item.win}</span>
            </p>
            <p className={styles.assetItem}>
              <span>{LANG('近30日收益额')}</span>
              <span className={styles.copyCount}>{item.income}</span>
            </p>
            <p className={styles.assetItem}>
              <span>{LANG('近{days}日收益率')}</span>
              <span className={styles.copyCount}>{item.scale}</span>
            </p>
            <p className={styles.assetItem}>
              <span>{LANG('带单规模')}</span>
              <span className={styles.copyCount}>{item.scale}</span>
            </p>
            <p className={styles.assetItem}>
              <span>{LANG('近30日跟随者收益')}</span>
              <span className={styles.copyCount}>{item.scale}</span>
            </p>
            <p className={styles.assetItem}>
              <span>{LANG('近30日胜率')}</span>
              <span className={styles.copyCount}>{item.scale}</span>
            </p>
          </div>
          <div>
            <CopyTradingTrend height={104} width={136} />
          </div>
        </div>
      </div>
    </>
  );
};

export default LeadTraderItem;
