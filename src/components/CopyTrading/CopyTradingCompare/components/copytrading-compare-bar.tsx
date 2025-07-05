import Table from '@/components/table';
import { MediaInfo } from '@/core/utils';
import styles from './copytrading-compare-bar.module.scss';
import TabBar, { TAB_TYPE } from '@/components/tab-bar';
import { Size } from '@/components/constants';
import { LANG } from '@/core/i18n';
import { useState } from 'react';
import { Button } from '@/components/button';
import { useResponsive } from '@/core/hooks'
import AddLeadTraderButton from './add-leadtrader-btn';
import ClearLeadTraderButton from './clear-leadtrader-btn';

export enum COPYTRADING_TYPE {
  SPOT = '1',
  SWAP = '2'
}

export default function CopyTradingCompareBar({
  tabValue = COPYTRADING_TYPE.SWAP,
  onChangeTab,
  onAddClick,
  onCleanupClick
}: {
  tabValue: string,
  onChangeTab: (value: string) => void,
  onAddClick: () => void,
  onCleanupClick: () => void
}) {
  const [type, setType] = useState(tabValue);
  const { isMobile} = useResponsive()
  const onChangeType = (value: string) => {
    setType(value);
    if (onChangeTab) {
      onChangeTab(value);
    }
  };
  return (
    <>
      <div className={styles.copyTradingCompareBar} >
        <TabBar
          type={TAB_TYPE.TEXT}
          size={!isMobile?Size.XL:Size.DEFAULT}
          options={[
            // { label: LANG('币币'), value: COPYTRADING_TYPE.SPOT},
            { label: LANG('合约'), value: COPYTRADING_TYPE.SWAP },
          ]}
          value={type}
          onChange={onChangeType}
        />
        <div className={styles.left}>
          <AddLeadTraderButton onClick={onAddClick} />
          <ClearLeadTraderButton onClick={onCleanupClick} />
        </div>
      </div>
    </>
  );
}

