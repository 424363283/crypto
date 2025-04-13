'use client';
import styles from './leadtrader-avator.module.scss';
import { Svg } from '@/components/svg';
import { Key, ReactNode } from 'react';
import { TrLink } from '@/core/i18n';
import CopyTradingTrend from '../../Components/copyTradingTrend';
import { CopyTradeType, CopyTradeSetting } from '../../CopyTradingDetail/Components/types';
import { Button } from '@/components/button';
import { Size } from '@/components/constants';
import FollowButton from './follow-btn';
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
const LeadTraderAvator = (props: { copyItem: CopyItem, children: ReactNode }) => {
  const item = props?.copyItem;
  const children = props?.children;
  return (
    <>
      <div className={styles.leadTraderAvator}>
        <img src={item.url} alt="avatar" className={styles.avatar} />
        <div>
          <div className={styles.copyName}>
            <span>{item.name}</span>
            <Svg src={`/static/icons/primary/common/copy-lever-${item.leverType}.svg`} width={16} height={16} />
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default LeadTraderAvator;
