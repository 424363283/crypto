'use client';
import styles from './index.module.scss';
import { UniversalLayout } from '@/components/layouts/universal';
import TradingList from './Components/tradingList';
export default function CopyTradingTraders() {
  return (
    <UniversalLayout bgColor='var(--theme-background-color-2)'>
      <div className={styles.copyTradingTradersContent}>
        <TradingList />
      </div>
    </UniversalLayout>
  );
}