import { useCopyTradingSwapStore } from '@/store/copytrading-swap';
import styles from './swap-trader-compare-list.module.scss';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import CopyTradingCompareTable from '../components/copytrading-compare-table';
import { columns } from './swap-trader-compare-columns';
import CopyTradingCompareTraders from '../components/copytrading-compare-traders';
import { LANG } from '@/core/i18n';
import DateRangeGroup from '../components/date-range-group';
import { useRouter } from '@/core/hooks';
import LeadTraderSelectModal from '../components/leadtrader-select-modal';

const SwapCopyTradingCompare = forwardRef((props, ref) => {
  const router = useRouter();
  const maxCompareCount = useCopyTradingSwapStore.use.maxCompareCount();
  const fetchRanks = useCopyTradingSwapStore.use.fetchRanks();
  const ranks = useCopyTradingSwapStore.use.copyTradeInfo().ranks;
  const [showBest, setShowBest] = useState(false);
  const [date, setDate] = useState(7);
  const [queryIds, setQueryIds] = useState(router.query?.ids);
  const idsSet = new Set(queryIds?.split('-'));
  const compareIds = Array.from(idsSet).map(Number).filter(Boolean).slice(0, maxCompareCount); //id003-id002-id001
  const compareTraders = ranks.filter(item => compareIds?.includes(item.id));
  const [leadTraderSelectModalVisible, setLeadTraderSelectModalVisible] = useState(false);
  //基本信息
  const baseData = [
    {
      key: '1',
      property: LANG('资产规模'),
      trader1: compareTraders[0]?.totalAssets || '',
      trader2: compareTraders[1]?.totalAssets || '',
      trader3: compareTraders[2]?.totalAssets || '',
      trader4: compareTraders[3]?.totalAssets || '',
    },
    {
      key: '2',
      property: LANG('带单规模'),
      trader1: compareTraders[0]?.scale || '',
      trader2: compareTraders[1]?.scale || '',
      trader3: compareTraders[2]?.scale || '',
      trader4: compareTraders[3]?.scale || '',
    },
    {
      key: '3',
      property: LANG('入驻天数'),
      trader1: compareTraders[0]?.registeredDays || '',
      trader2: compareTraders[1]?.registeredDays || '',
      trader3: compareTraders[2]?.registeredDays || '',
      trader4: compareTraders[3]?.registeredDays || '',
    },
    {
      key: '4',
      property: LANG('带单天数'),
      trader1: compareTraders[0]?.tradingDays || '',
      trader2: compareTraders[1]?.tradingDays || '',
      trader3: compareTraders[2]?.tradingDays || '',
      trader4: compareTraders[3]?.tradingDays || '',
    },
    {
      key: '5',
      property: LANG('当前跟单人数'),
      trader1: compareTraders[0]?.followers || '',
      trader2: compareTraders[1]?.followers || '',
      trader3: compareTraders[2]?.followers || '',
      trader4: compareTraders[3]?.followers || '',
    },
    {
      key: '6',
      property: LANG('当前跟随者收益'),
      trader1: compareTraders[0]?.followersPnL || '',
      trader2: compareTraders[1]?.followersPnL || '',
      trader3: compareTraders[2]?.followersPnL || '',
      trader4: compareTraders[3]?.followersPnL || '',
    },
    {
      key: '7',
      property: LANG('累计跟单人数'),
      trader1: compareTraders[0]?.totalFollowers || '',
      trader2: compareTraders[1]?.totalFollowers || '',
      trader3: compareTraders[2]?.totalFollowers || '',
      trader4: compareTraders[3]?.totalFollowers || '',
    },
    {
      key: '8',
      property: LANG('分润比例'),
      trader1: compareTraders[0]?.wiRadio || '',
      trader2: compareTraders[1]?.wiRadio || '',
      trader3: compareTraders[2]?.wiRadio || '',
      trader4: compareTraders[3]?.wiRadio || '',
    }
  ]
  //交易数据
  const transactionData = [
    {
      key: '1',
      property: LANG('收益率'),
      trader1: compareTraders[0]?.copytRatio || '',
      trader2: compareTraders[1]?.copytRatio || '',
      trader3: compareTraders[2]?.copytRatio || '',
      trader4: compareTraders[3]?.copytRatio || '',
    },
    {
      key: '2',
      property: LANG('收益额'),
      trader1: compareTraders[0]?.copyTotal || '',
      trader2: compareTraders[1]?.copyTotal || '',
      trader3: compareTraders[2]?.copyTotal || '',
      trader4: compareTraders[3]?.copyTotal || '',
    },
    {
      key: '3',
      property: LANG('胜率'),
      trader1: compareTraders[0]?.winRatio || '',
      trader2: compareTraders[1]?.winRatio || '',
      trader3: compareTraders[2]?.winRatio || '',
      trader4: compareTraders[3]?.winRatio || '',
    },
    {
      key: '4',
      property: LANG('盈亏比'),
      trader1: !compareTraders[0]?.lossTotal ? '' : compareTraders[0]?.profitTotal / compareTraders[0]?.lossTotal,
      trader2: !compareTraders[1]?.lossTotal ? '' : compareTraders[1]?.profitTotal / compareTraders[1]?.lossTotal,
      trader3: !compareTraders[2]?.lossTotal ? '' : compareTraders[2]?.profitTotal / compareTraders[2]?.lossTotal,
      trader4: !compareTraders[3]?.lossTotal ? '' : compareTraders[3]?.profitTotal / compareTraders[3]?.lossTotal,
    },
    {
      key: '5',
      property: LANG('交易笔数'),
      trader1: (compareTraders[0]?.profitCount + compareTraders[0]?.lossCount) || '',
      trader2: (compareTraders[1]?.profitCount + compareTraders[1]?.lossCount) || '',
      trader3: (compareTraders[2]?.profitCount + compareTraders[2]?.lossCount) || '',
      trader4: (compareTraders[3]?.profitCount + compareTraders[3]?.lossCount) || '',
    },
    {
      key: '6',
      property: LANG('交易频率'),
      trader1: compareTraders[0]?.tradeTimes || '',
      trader2: compareTraders[1]?.tradeTimes || '',
      trader3: compareTraders[2]?.tradeTimes || '',
      trader4: compareTraders[3]?.tradeTimes || '',
    }
  ];
  useEffect(() => {
    fetchRanks({page: 1, size:6 });
  }, []);

  const onShowBestChange = (value: boolean) => {
    setShowBest(value);

  }
  const selectTraderHandler = (id:Array<any>) => {
    if (compareIds.length < maxCompareCount) {
      replaceUrl([...compareIds, ...id].join('-'));
    }
  }
  const addTraderHandler = () => {
    setLeadTraderSelectModalVisible(true);
  }
  const removeTraderHandler = (id: number) => {
    replaceUrl(compareIds.filter(item => item != id).join('-') || '-');
  }
  const cleanupTradersHandler = () => {
    replaceUrl('-');
  }
  const replaceUrl = (ids: string) => {
    // setQueryIds(ids);
    router.replace(`/copyTrade/compare/${ids}`);
  }
  const onDateChange = (value: number) => {
    setDate(value);
  }
  useImperativeHandle(ref, () => ({
    cleanupTradersHandler,
    addTraderHandler
  }), [queryIds]);

  useEffect(() => {
    setQueryIds(router.query?.ids)
  }, [router.query?.ids]);
  return (
    <>
      <div className={styles.swapTraderCompareList}>
        <CopyTradingCompareTraders
          showBest={showBest}
          traders={compareTraders}
          onChecked={onShowBestChange}
          onAddClick={addTraderHandler}
          onRemoveClick={removeTraderHandler}
        />
        <CopyTradingCompareTable
          title={() => (<div style={{ color: 'var(--text-brand)' }}>{LANG('基本信息')}</div>)}
          bordered={true}
          loading={false}
          showHeader={false}
          showTabletTable
          columns={columns}
          dataSource={baseData}
          pagination={false}
        />
        <CopyTradingCompareTable
          title={() => (
            <div className={styles.compareTableTile}>
              <div style={{ color: 'var(--text-brand)' }}>{LANG('交易数据')}</div>
              <DateRangeGroup value={date} onSelect={onDateChange} />
            </div>
          )}
          bordered={true}
          loading={false}
          showHeader={false}
          showTabletTable
          columns={columns}
          dataSource={transactionData}
          pagination={false}
        />
        <LeadTraderSelectModal
          open={leadTraderSelectModalVisible}
          onSelect={selectTraderHandler}
          onClose={() => setLeadTraderSelectModalVisible(false)}
        />
      </div>
    </>
  );
});
export default SwapCopyTradingCompare;
