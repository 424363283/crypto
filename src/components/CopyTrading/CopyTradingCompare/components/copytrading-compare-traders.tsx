import { LeadTrader, useCopyTradingSwapStore } from '@/store/copytrading-swap';
import styles from './copytrading-compare-traders.module.scss';
import Radio from '@/components/Radio';
import CommonIcon from '@/components/common-icon';
import LeadTraderAvator from './leadtrader-avator';
import AddLeadTraderButton from './add-leadtrader-btn';
import LeadTraderCompareBox from './leadtrader-compare-box';
import { LANG } from '@/core/i18n';
export default function CopyTradingCompareTraders({
  traders,
  showBest,
  onChecked,
  onAddClick,
  onRemoveClick
}: {
  traders: LeadTrader[],
  showBest: boolean,
  onChecked: (value: boolean) => void,
  onAddClick: () => void,
  onRemoveClick: (value: number) => void,
}) {
  const maxCompareCount = useCopyTradingSwapStore.use.maxCompareCount();
  const leftCompareCount = Math.max(0, maxCompareCount - traders.length);

  return (
    <>
      <div className={styles.copyTradingCompareBox} >
        <div className={styles.compareBoxItem}>
          <Radio
            size={14}
            label={LANG('突出显示最佳数据')}
            checked={showBest}
            onChange={() => onChecked(!showBest)}
          />
        </div>
        {traders?.map((item, index) => {
          return (
            <div key={index} className={styles.compareBoxItem}>
                <LeadTraderCompareBox copyItem={item} onClose={() => onRemoveClick(item.id)} />
            </div>
          );
        })}
        {Array(leftCompareCount).fill('').map((item, index) => {
          return (
            <div key={index} className={styles.compareBoxItem}>
              {index === 0 && <AddLeadTraderButton type="inner" onClick={onAddClick} />}
            </div>
          )
        })}
      </div>
    </>
  );
}

