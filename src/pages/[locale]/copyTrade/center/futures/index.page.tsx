'use client';

import CopyTradingTraders from '@/components/CopyTrading/index';
import styles from './index.module.scss';
import UserInformation from '@/components/CopyTrading/Components/userInformation'
import TradeTab from '@/components/CopyTrading/Components/tradeTab'
//我的带单-合约
export default function CopyTradingPage() {
  return (
    <>
      <UserInformation />
      <TradeTab />
    </>

  )
}
