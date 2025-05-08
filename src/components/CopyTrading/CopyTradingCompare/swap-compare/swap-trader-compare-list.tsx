import { useCopyTradingSwapStore } from '@/store/copytrading-swap';
import styles from './swap-trader-compare-list.module.scss';
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import CopyTradingCompareTraders from '../components/copytrading-compare-traders';
import { LANG } from '@/core/i18n';
import DateRangeGroup from '../components/date-range-group';
import { useRouter } from '@/core/hooks';
import LeadTraderSelectModal from '../components/leadtrader-select-modal';
import { findCommonIds,allKeysEqual } from '@/core/shared/src/copy/utils';
import { Copy } from '@/core/shared';
const SwapCopyTradingCompare = forwardRef((props, ref) => {
  const router = useRouter();
  const maxCompareCount = useCopyTradingSwapStore.use.maxCompareCount();
  const fetchRanks = useCopyTradingSwapStore.use.fetchRanks();
  const ranks = useCopyTradingSwapStore.use.copyTradeInfo().ranks;
  const [showBest, setShowBest] = useState(false);
  const [date, setDate] = useState(7);
  const [queryIds, setQueryIds] = useState(router.query?.ids);
  const idsSet = new Set(queryIds?.split('-'));
  const [compareIds, setCompareIds] = useState([]); //id003-id002-id001
  const compareTraders = useMemo(() => {
    const findItem = findCommonIds(compareIds, ranks, 'id');
    return findItem || {};
  }, [compareIds]);
  const [leadTraderSelectModalVisible, setLeadTraderSelectModalVisible] = useState(false);
  //
  const findMaxAndPosition = (formatArr: any) => {
    const arr = formatArr.map(item => (!item || item === 'Infinity' || item === "NaN"? 0 : Number(item)));
    const isSame = allKeysEqual(arr)
    console.log(isSame,'isSame====',formatArr)
    if (isSame) {
      return { maxValue: '', position:  -1 }; // 返回从 1 开始的位置
    }
    console.log(arr, 'arr=====');
    if (!arr || arr.length === 0) {
      return { maxValue: null, position: -1 }; // 处理空数组的情况
    }
    let maxValue = arr[0];
    let position = 0; // 默认从 0 开始计数
    console.log(maxValue, 'maxValue====');
    for (let i = 1; i < arr.length; i++) {
      console.log(arr[i] > maxValue, '====arr[i] > maxValue', arr[i], maxValue);
      if (arr[i] > maxValue) {
        maxValue = arr[i];
        position = i;
      }
    }
    console.log(position + 1, 'position====');
    return { maxValue, position: position + 1 }; // 返回从 1 开始的位置
  };

  //基本信息
  const baseData = [
    {
      key: '1',
      property: LANG('资产规模'),
      trader1: compareTraders[0]?.userAmount?.toFormat(Copy.copyFixed) || '',
      trader2: compareTraders[1]?.userAmount?.toFormat(Copy.copyFixed) || '',
      trader3: compareTraders[2]?.userAmount?.toFormat(Copy.copyFixed) || '',
      trader4: compareTraders[3]?.userAmount?.toFormat(Copy.copyFixed) || '',
      highlightIndex:
        showBest &&
        findMaxAndPosition([
          compareTraders[0]?.userAmount,
          compareTraders[1]?.userAmount,
          compareTraders[2]?.userAmount,
          compareTraders[3]?.userAmount
        ])
    },
    {
      key: '2',
      property: LANG('带单规模'),
      trader1: compareTraders[0]?.settledTotalAmount?.toFormat(Copy.copyFixed) || '',
      trader2: compareTraders[1]?.settledTotalAmount?.toFormat(Copy.copyFixed) || '',
      trader3: compareTraders[2]?.settledTotalAmount?.toFormat(Copy.copyFixed) || '',
      trader4: compareTraders[3]?.settledTotalAmount?.toFormat(Copy.copyFixed) || '',
      highlightIndex:
        showBest &&
        findMaxAndPosition([
          compareTraders[0]?.settledTotalAmount,
          compareTraders[1]?.settledTotalAmount,
          compareTraders[2]?.settledTotalAmount,
          compareTraders[3]?.settledTotalAmount
        ])
    },
    {
      key: '3',
      property: LANG('入驻天数'),
      trader1: compareTraders[0]?.settledDays || '',
      trader2: compareTraders[1]?.settledDays || '',
      trader3: compareTraders[2]?.settledDays || '',
      trader4: compareTraders[3]?.settledDays || '',
      highlightIndex:
        showBest &&
        findMaxAndPosition([
          compareTraders[0]?.settledDays,
          compareTraders[1]?.settledDays,
          compareTraders[2]?.settledDays,
          compareTraders[3]?.settledDays
        ])
    },
    {
      key: '4',
      property: LANG('带单天数'),
      trader1: compareTraders[0]?.workDays || '',
      trader2: compareTraders[1]?.workDays || '',
      trader3: compareTraders[2]?.workDays || '',
      trader4: compareTraders[3]?.workDays || '',
      highlightIndex:
        showBest &&
        findMaxAndPosition([
          compareTraders[0]?.workDays,
          compareTraders[1]?.workDays,
          compareTraders[2]?.workDays,
          compareTraders[3]?.workDays
        ])
    },
    {
      key: '5',
      property: LANG('当前跟单人数'),
      trader1: compareTraders[0]?.currentCopyTraderCount || '',
      trader2: compareTraders[1]?.currentCopyTraderCount || '',
      trader3: compareTraders[2]?.currentCopyTraderCount || '',
      trader4: compareTraders[3]?.currentCopyTraderCount || '',
      highlightIndex:
        showBest &&
        findMaxAndPosition([
          compareTraders[0]?.currentCopyTraderCount,
          compareTraders[1]?.currentCopyTraderCount,
          compareTraders[2]?.currentCopyTraderCount,
          compareTraders[3]?.currentCopyTraderCount
        ])
    },
    {
      key: '6',
      property: LANG('当前跟随者收益'),
      trader1: compareTraders[0]?.settledTotalProfit?.toFormat(Copy.copyFixed) || '',
      trader2: compareTraders[1]?.settledTotalProfit?.toFormat(Copy.copyFixed) || '',
      trader3: compareTraders[2]?.settledTotalProfit?.toFormat(Copy.copyFixed) || '',
      trader4: compareTraders[3]?.settledTotalProfit?.toFormat(Copy.copyFixed) || '',
      highlightIndex:
        showBest &&
        findMaxAndPosition([
          compareTraders[0]?.settledTotalProfit,
          compareTraders[1]?.settledTotalProfit,
          compareTraders[2]?.settledTotalProfit,
          compareTraders[3]?.settledTotalProfit
        ])
    },
    {
      key: '7',
      property: LANG('累计跟单人数'),
      trader1: compareTraders[0]?.totalFollowers?.toFormat() || '',
      trader2: compareTraders[1]?.totalFollowers?.toFormat() || '',
      trader3: compareTraders[2]?.totalFollowers?.toFormat() || '',
      trader4: compareTraders[3]?.totalFollowers?.toFormat() || '',
      highlightIndex:
        showBest &&
        findMaxAndPosition([
          compareTraders[0]?.totalFollowers,
          compareTraders[1]?.totalFollowers,
          compareTraders[2]?.totalFollowers,
          compareTraders[3]?.totalFollowers
        ])
    },
    {
      key: '8',
      property: LANG('分润比例'),
      trader1:
        (compareTraders[0]?.shareRoyaltyRatio &&
          compareTraders[0]?.shareRoyaltyRatio?.mul(100)?.toFixed(Copy.copyFixed) + '%') ||
        '',
      trader2:
        (compareTraders[1]?.shareRoyaltyRatio &&
          compareTraders[1]?.shareRoyaltyRatio?.mul(100)?.toFixed(Copy.copyFixed) + '%') ||
        '',
      trader3:
        (compareTraders[2]?.shareRoyaltyRatio &&
          compareTraders[2]?.shareRoyaltyRatio?.mul(100)?.toFixed(Copy.copyFixed) + '%') ||
        '',
      trader4:
        (compareTraders[3]?.shareRoyaltyRatio &&
          compareTraders[3]?.shareRoyaltyRatio?.mul(100)?.toFixed(Copy.copyFixed) + '%') ||
        '',
      highlightIndex:
        showBest &&
        findMaxAndPosition([
          compareTraders[0]?.shareRoyaltyRatio?.mul(100),
          compareTraders[1]?.shareRoyaltyRatio?.mul(100),
          compareTraders[2]?.shareRoyaltyRatio?.mul(100),
          compareTraders[3]?.shareRoyaltyRatio?.mul(100)
        ])
    }
  ];
  //交易数据
  const transactionData = [
    {
      key: '1',
      property: LANG('收益率'),
      showColor: true,
      trader1:
        (compareTraders[0]?.copyTradeUserStatisticsSummaryVo &&
          compareTraders[0]?.copyTradeUserStatisticsSummaryVo[`profitRate${date}`].mul(100)?.toFixed(Copy.copyFixed) +
            '%') ||
        '',
      trader2:
        (compareTraders[1]?.copyTradeUserStatisticsSummaryVo &&
          compareTraders[1]?.copyTradeUserStatisticsSummaryVo[`profitRate${date}`].mul(100)?.toFixed(Copy.copyFixed) +
            '%') ||
        '',
      trader3:
        (compareTraders[2]?.copyTradeUserStatisticsSummaryVo &&
          compareTraders[2]?.copyTradeUserStatisticsSummaryVo[`profitRate${date}`].mul(100)?.toFixed(Copy.copyFixed) +
            '%') ||
        '',
      trader4:
        (compareTraders[3]?.copyTradeUserStatisticsSummaryVo &&
          compareTraders[3]?.copyTradeUserStatisticsSummaryVo[`profitRate${date}`].mul(100)?.toFixed(Copy.copyFixed) +
            '%') ||
        '',
      highlightIndex:
        showBest &&
        findMaxAndPosition([
          compareTraders[0]?.copyTradeUserStatisticsSummaryVo[`profitRate${date}`],
          compareTraders[1]?.copyTradeUserStatisticsSummaryVo[`profitRate${date}`],
          compareTraders[2]?.copyTradeUserStatisticsSummaryVo[`profitRate${date}`],
          compareTraders[3]?.copyTradeUserStatisticsSummaryVo[`profitRate${date}`]
        ])
    },
    {
      key: '2',
      property: LANG('收益额'),
      trader1:
        (compareTraders[0]?.copyTradeUserStatisticsSummaryVo &&
          compareTraders[0]?.copyTradeUserStatisticsSummaryVo[`profitAmount${date}`]?.toFormat(Copy.copyFixed)) ||
        '',
      trader2:
        (compareTraders[1]?.copyTradeUserStatisticsSummaryVo &&
          compareTraders[1]?.copyTradeUserStatisticsSummaryVo[`profitAmount${date}`]?.toFormat(Copy.copyFixed)) ||
        '',
      trader3:
        (compareTraders[2]?.copyTradeUserStatisticsSummaryVo &&
          compareTraders[2]?.copyTradeUserStatisticsSummaryVo[`profitAmount${date}`]?.toFormat(Copy.copyFixed)) ||
        '',
      trader4:
        (compareTraders[3]?.copyTradeUserStatisticsSummaryVo &&
          compareTraders[3]?.copyTradeUserStatisticsSummaryVo[`profitAmount${date}`]?.toFormat(Copy.copyFixed)) ||
        '',
      highlightIndex:
        showBest &&
        findMaxAndPosition([
          compareTraders[0]?.copyTradeUserStatisticsSummaryVo[`profitAmount${date}`],
          compareTraders[1]?.copyTradeUserStatisticsSummaryVo[`profitAmount${date}`],
          compareTraders[2]?.copyTradeUserStatisticsSummaryVo[`profitAmount${date}`],
          compareTraders[3]?.copyTradeUserStatisticsSummaryVo[`profitAmount${date}`]
        ])
    },
    {
      key: '3',
      property: LANG('胜率'),
      trader1:
        (compareTraders[0]?.copyTradeUserStatisticsSummaryVo[`profitOrderNumber${date}`] &&
          compareTraders[0]?.copyTradeUserStatisticsSummaryVo[`profitOrderNumber${date}`]
            ?.div(
              compareTraders[0]?.copyTradeUserStatisticsSummaryVo[`profitOrderNumber${date}`].add(
                compareTraders[0]?.copyTradeUserStatisticsSummaryVo[`lossOrderNumber${date}`]
              )
            )
            .mul(100)
            .toFixed(Copy.copyFixed) + '%') ||
        '',
      trader2:
        (compareTraders[1]?.copyTradeUserStatisticsSummaryVo[`profitOrderNumber${date}`] &&
          compareTraders[1]?.copyTradeUserStatisticsSummaryVo[`profitOrderNumber${date}`]
            ?.div(
              compareTraders[1]?.copyTradeUserStatisticsSummaryVo[`profitOrderNumber${date}`].add(
                compareTraders[1]?.copyTradeUserStatisticsSummaryVo[`lossOrderNumber${date}`]
              )
            )
            .mul(100)
            .toFixed(Copy.copyFixed) + '%') ||
        '',
      trader3:
        (compareTraders[2]?.copyTradeUserStatisticsSummaryVo[`profitOrderNumber${date}`] &&
          compareTraders[2]?.copyTradeUserStatisticsSummaryVo[`profitOrderNumber${date}`]
            ?.div(
              compareTraders[2]?.copyTradeUserStatisticsSummaryVo[`profitOrderNumber${date}`].add(
                compareTraders[2]?.copyTradeUserStatisticsSummaryVo[`lossOrderNumber${date}`]
              )
            )
            .mul(100)
            .toFixed(Copy.copyFixed) + '%') ||
        '',
      trader4:
        (compareTraders[3]?.copyTradeUserStatisticsSummaryVo[`profitOrderNumber${date}`] &&
          compareTraders[3]?.copyTradeUserStatisticsSummaryVo[`profitOrderNumber${date}`]
            ?.div(
              compareTraders[3]?.copyTradeUserStatisticsSummaryVo[`profitOrderNumber${date}`].add(
                compareTraders[3]?.copyTradeUserStatisticsSummaryVo[`lossOrderNumber${date}`]
              )
            )
            .mul(100)
            .toFixed(Copy.copyFixed) + '%') ||
        '',
      highlightIndex:
        showBest &&
        findMaxAndPosition([
          compareTraders[0]?.copyTradeUserStatisticsSummaryVo[`profitOrderNumber${date}`]?.div(
            compareTraders[0]?.copyTradeUserStatisticsSummaryVo[`profitOrderNumber${date}`].add(
              compareTraders[0]?.copyTradeUserStatisticsSummaryVo[`lossOrderNumber${date}`]
            )
          ) || 0,
          compareTraders[1]?.copyTradeUserStatisticsSummaryVo[`profitOrderNumber${date}`]?.div(
            compareTraders[1]?.copyTradeUserStatisticsSummaryVo[`profitOrderNumber${date}`].add(
              compareTraders[1]?.copyTradeUserStatisticsSummaryVo[`lossOrderNumber${date}`]
            )
          ) || 0,
          compareTraders[2]?.copyTradeUserStatisticsSummaryVo[`profitOrderNumber${date}`]?.div(
            compareTraders[2]?.copyTradeUserStatisticsSummaryVo[`profitOrderNumber${date}`].add(
              compareTraders[2]?.copyTradeUserStatisticsSummaryVo[`lossOrderNumber${date}`]
            )
          ) || 0,
          compareTraders[3]?.copyTradeUserStatisticsSummaryVo[`profitOrderNumber${date}`]?.div(
            compareTraders[3]?.copyTradeUserStatisticsSummaryVo[`profitOrderNumber${date}`].add(
              compareTraders[3]?.copyTradeUserStatisticsSummaryVo[`lossOrderNumber${date}`]
            )
          ) || 0
        ])
    },
    {
      key: '4',
      property: LANG('盈亏比'),
      trader1: `${
        compareTraders[0]?.copyTradeUserStatisticsSummaryVo[`avgProfit${date}`]?.toFixed(Copy.copyFixed) || ''
      } / ${compareTraders[0]?.copyTradeUserStatisticsSummaryVo[`avgLoss${date}`]?.toFixed(Copy.copyFixed) || ''}`,
      trader2: `${
        compareTraders[1]?.copyTradeUserStatisticsSummaryVo[`avgProfit${date}`]?.toFixed(Copy.copyFixed) || ''
      } / ${compareTraders[1]?.copyTradeUserStatisticsSummaryVo[`avgLoss${date}`]?.toFixed(Copy.copyFixed) || ''}`,
      trader3: `${
        compareTraders[2]?.copyTradeUserStatisticsSummaryVo[`avgProfit${date}`]?.toFixed(Copy.copyFixed) || ''
      } / ${compareTraders[2]?.copyTradeUserStatisticsSummaryVo[`avgLoss${date}`]?.toFixed(Copy.copyFixed) || ''}`,
      trader4: `${
        compareTraders[3]?.copyTradeUserStatisticsSummaryVo[`avgProfit${date}`]?.toFixed(Copy.copyFixed) || ''
      } / ${compareTraders[3]?.copyTradeUserStatisticsSummaryVo[`avgLoss${date}`]?.toFixed(Copy.copyFixed) || ''}`,
      highlightIndex:
        showBest &&
        findMaxAndPosition([
          compareTraders[0]?.copyTradeUserStatisticsSummaryVo[`avgProfit${date}`]?.toFixed(Copy.copyFixed)?.div(
            compareTraders[0]?.copyTradeUserStatisticsSummaryVo[`avgLoss${date}`]?.toFixed(Copy.copyFixed)
          ),
          compareTraders[1]?.copyTradeUserStatisticsSummaryVo[`avgProfit${date}`]?.toFixed(Copy.copyFixed)?.div(
            compareTraders[1]?.copyTradeUserStatisticsSummaryVo[`avgLoss${date}`]?.toFixed(Copy.copyFixed)
          ),
          compareTraders[2]?.copyTradeUserStatisticsSummaryVo[`avgProfit${date}`]?.toFixed(Copy.copyFixed)?.div(
            compareTraders[2]?.copyTradeUserStatisticsSummaryVo[`avgLoss${date}`]?.toFixed(Copy.copyFixed)
          ),
          compareTraders[3]?.copyTradeUserStatisticsSummaryVo[`avgProfit${date}`]?.toFixed(Copy.copyFixed)?.div(
            compareTraders[3]?.copyTradeUserStatisticsSummaryVo[`avgLoss${date}`]?.toFixed(Copy.copyFixed)
          )
        ])
    },
    {
      key: '5',
      property: LANG('交易笔数'),
      trader1:
        compareTraders[0]?.copyTradeUserStatisticsSummaryVo[`profitOrderNumber${date}`]?.add(
          compareTraders[0]?.copyTradeUserStatisticsSummaryVo[`lossOrderNumber${date}`]
        ) || '',
      trader2:
        compareTraders[1]?.copyTradeUserStatisticsSummaryVo[`profitOrderNumber${date}`]?.add(
          compareTraders[1]?.copyTradeUserStatisticsSummaryVo[`lossOrderNumber${date}`]
        ) || '',
      trader3:
        compareTraders[2]?.copyTradeUserStatisticsSummaryVo[`profitOrderNumber${date}`]?.add(
          compareTraders[2]?.copyTradeUserStatisticsSummaryVo[`lossOrderNumber${date}`]
        ) || '',
      trader4:
        compareTraders[3]?.copyTradeUserStatisticsSummaryVo[`profitOrderNumber${date}`]?.add(
          compareTraders[3]?.copyTradeUserStatisticsSummaryVo[`lossOrderNumber${date}`]
        ) || '',
      highlightIndex:
        showBest &&
        findMaxAndPosition([
          compareTraders[0]?.copyTradeUserStatisticsSummaryVo[`profitOrderNumber${date}`]?.add(
            compareTraders[0]?.copyTradeUserStatisticsSummaryVo[`lossOrderNumber${date}`]
          ),
          compareTraders[1]?.copyTradeUserStatisticsSummaryVo[`profitOrderNumber${date}`]?.add(
            compareTraders[1]?.copyTradeUserStatisticsSummaryVo[`lossOrderNumber${date}`]
          ),
          compareTraders[2]?.copyTradeUserStatisticsSummaryVo[`profitOrderNumber${date}`]?.add(
            compareTraders[2]?.copyTradeUserStatisticsSummaryVo[`lossOrderNumber${date}`]
          ),
          compareTraders[3]?.copyTradeUserStatisticsSummaryVo[`profitOrderNumber${date}`]?.add(
            compareTraders[3]?.copyTradeUserStatisticsSummaryVo[`lossOrderNumber${date}`]
          )
        ])
    },
    {
      key: '6',
      property: LANG('交易频率'),
      trader1:
        (compareTraders[0]?.copyTradeUserStatisticsSummaryVo[`victoryRate${date}`]?.mul(100) &&
          compareTraders[0]?.copyTradeUserStatisticsSummaryVo[`victoryRate${date}`]?.mul(100)?.toFixed(Copy.copyFixed) +
            '%') ||
        '',
      trader2:
        (compareTraders[1]?.copyTradeUserStatisticsSummaryVo[`victoryRate${date}`]?.mul(100) &&
          compareTraders[1]?.copyTradeUserStatisticsSummaryVo[`victoryRate${date}`]?.mul(100)?.toFixed(Copy.copyFixed) +
            '%') ||
        '',
      trader3:
        (compareTraders[2]?.copyTradeUserStatisticsSummaryVo[`victoryRate${date}`]?.mul(100) &&
          compareTraders[2]?.copyTradeUserStatisticsSummaryVo[`victoryRate${date}`]?.mul(100)?.toFixed(Copy.copyFixed) +
            '%') ||
        '',
      trader4:
        (compareTraders[3]?.copyTradeUserStatisticsSummaryVo[`victoryRate${date}`]?.mul(100) &&
          compareTraders[3]?.copyTradeUserStatisticsSummaryVo[`victoryRate${date}`]?.mul(100)?.toFixed(Copy.copyFixed) +
            '%') ||
        '',
      highlightIndex:
        showBest &&
        findMaxAndPosition([
          compareTraders[0]?.copyTradeUserStatisticsSummaryVo[`victoryRate${date}`],
          compareTraders[1]?.copyTradeUserStatisticsSummaryVo[`victoryRate${date}`],
          compareTraders[2]?.copyTradeUserStatisticsSummaryVo[`victoryRate${date}`],
          compareTraders[3]?.copyTradeUserStatisticsSummaryVo[`victoryRate${date}`]
        ])
    }
  ];
  useEffect(() => {
    fetchRanks({ page: 1, size: 1000 });
  }, []);

  const onShowBestChange = (value: boolean) => {
    setShowBest(value);
  };
  const selectTraderHandler = (id: Array<any>) => {
    // if (compareIds.length < maxCompareCount) {
    setCompareIds([...id]);
  };
  const addTraderHandler = () => {
    setLeadTraderSelectModalVisible(true);
  };
  const removeTraderHandler = (id: number) => {
    const delArr = compareIds.filter(item => item.id != id);
    setCompareIds(delArr);
  };
  const cleanupTradersHandler = () => {
    setCompareIds([]);
  };
  const replaceUrl = (ids: string) => {
    // setQueryIds(ids);
    router.replace(`/copyTrade/compare/${ids}`);
  };
  const onDateChange = (value: number) => {
    setDate(value);
  };
  useImperativeHandle(
    ref,
    () => ({
      cleanupTradersHandler,
      addTraderHandler
    }),
    [queryIds]
  );

  useEffect(() => {
    setQueryIds(router.query?.ids);
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
        <div className={styles.tradeContainer}>
          <div className={styles.tradeTitle}>{LANG('基本信息')}</div>
          <div>
            {baseData.map(base => {
              return (
                <div key={base.key} className={styles.swapTraderRow5}>
                  <div className={`${styles.swapTraderItem}`}>
                    <p className={styles.swapTradeTitle}>{base.property}</p>
                  </div>
                  <div
                    className={`${styles.swapTraderItem} ${
                      1 === base?.highlightIndex?.position && styles.swapTraderhight
                    }`}
                  >
                    {base?.trader1}
                  </div>
                  <div
                    className={`${styles.swapTraderItem} ${
                      2 === base?.highlightIndex?.position && styles.swapTraderhight
                    }`}
                  >
                    {base.trader2}
                  </div>
                  <div
                    className={`${styles.swapTraderItem} ${
                      3 === base?.highlightIndex?.position && styles.swapTraderhight
                    }`}
                  >
                    {base.trader3}
                  </div>
                  <div
                    className={`${styles.swapTraderItem} ${
                      4 === base?.highlightIndex?.position && styles.swapTraderhight
                    }`}
                  >
                    {base.trader4}
                  </div>
                </div>
              );
            })}
          </div>
          <div className={`${styles.tradeTitle} ${styles.flexSpace} ${styles.noBorder}`}>
            <span className={styles.tradeData}> {LANG('交易数据')}</span>
            <DateRangeGroup value={date} onSelect={onDateChange} />
          </div>
          <div>
            <div>
              {transactionData.map((base, idx) => {
                return (
                  <div key={base.key} className={styles.swapTraderRow5}>
                    <div className={`${styles.swapTraderItem}`}>{base.property}</div>
                    <div
                      className={`${styles.swapTraderItem} ${
                        idx === 0 ? (base.trader1 > 0 ? styles.swapTraderGreen : styles.swapTraderRed) : ''
                      }  ${1 === base?.highlightIndex?.position && styles.swapTraderhight}`}
                    >
                      {base.trader1}
                    </div>
                    <div
                      className={`${styles.swapTraderItem} ${
                        idx === 0 ? (base.trader1 > 0 ? styles.swapTraderGreen : styles.swapTraderRed) : ''
                      } ${2 === base?.highlightIndex?.position && styles.swapTraderhight}`}
                    >
                      {base.trader2}
                    </div>
                    <div
                      className={`${styles.swapTraderItem} ${
                        idx === 0 ? (base.trader1 > 0 ? styles.swapTraderGreen : styles.swapTraderRed) : ''
                      } ${3 === base?.highlightIndex?.position && styles.swapTraderhight}`}
                    >
                      {base.trader3}
                    </div>
                    <div
                      className={`${styles.swapTraderItem} ${
                        idx === 0 ? (base.trader1 > 0 ? styles.swapTraderGreen : styles.swapTraderRed) : ''
                      } ${4 === base?.highlightIndex?.position && styles.swapTraderhight}`}
                    >
                      {base.trader4}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <LeadTraderSelectModal
          selectLeadTraderSelect={compareIds}
          open={leadTraderSelectModalVisible}
          onSelect={selectTraderHandler}
          onClose={() => setLeadTraderSelectModalVisible(false)}
        />
      </div>
    </>
  );
});
export default SwapCopyTradingCompare;
