'use client';
import CommonIcon from '@/components/common-icon';
import FollowButton from './follow-btn';
import LeadTraderAvator from './leadtrader-avator';
import styles from './leadtrader-compare-box.module.scss';

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
}
const LeadTraderCompareBox = (props: { copyItem: CopyItem, onClose: (id: number) => void }) => {
  const item = props?.copyItem;
  const onClose = props?.onClose;
  return (
    <>
      <div className={styles.leadTraderCompareBox}>
        <CommonIcon className={styles.closeBtn} name='common-compare-close-0' size={12} onClick={() => { onClose(item.id) }} />
        <LeadTraderAvator copyItem={item} >
          <FollowButton status={0} onClick={(id: number) => { }} />
        </LeadTraderAvator>
      </div>
    </>
  );
};

export default LeadTraderCompareBox;
