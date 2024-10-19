import { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { isServerSideRender, GlobalConfiguration } from '@/utils';
import { useWebSocket } from './use-websocket';
import { usePositionStore, useFutureStore } from '@/store';
import { getPositionOrder } from '@/store/tradingTab/positionOrder';
import { api, http } from '@/service';
import { ConfigContext, UserContext } from '@/context';
import { getUnrealizedPnlRoi, PositionTypes } from '@/utils/futures';
import { MSGDATATYPE } from '@/constants';
import { useFuturePrices } from './use-future-prices';

/** 当前持仓列表 */
export function useFuturePositions() {
  const { appConfig, symbolsMap } = useContext(ConfigContext);
  const { isLogin } = useContext(UserContext);

  const [calcPositionList, setCalcPositionList] = useState<any[]>([]);

  const { setPositionList, setTempPositionList, setUnrealisedPnl } = usePositionStore();
  const { futureBalances: balances } = useFutureStore();

  useEffect(() => {
    let timer = 0;
    const set = () => {
      timer = window.setTimeout(() => {
        const positions = [...getPositionOrder().tempPositionList];
        setCalcPositionList(positions);
        if (positions.length === 0) {
          setUnrealisedPnl(0, 0);
          setPositionList([]);
        }
        set();
      }, 500);
    };
    set();
    return () => { clearTimeout(timer); };
  }, []);

  const { lastPrices, markedPrices } = useFuturePrices();
  const getPositionList = async () => {
    try {
      const result = await http({
        url: api.futuresOptionList,
        method: 'get'
      });
      const dataList = result?.data ?? [];
      let crossUnrealisedPnl = 0;
      let isolatedUnrealisedPnl = 0;
      dataList.forEach((position: any) => {
        if (position.positionType === PositionTypes.CROSS) {
          crossUnrealisedPnl += (+(position.unrealisedPnl ?? 0));
        } else {
          isolatedUnrealisedPnl += (+(position.unrealisedPnl ?? 0));
        }
      });
      setUnrealisedPnl(crossUnrealisedPnl, isolatedUnrealisedPnl);
      setTempPositionList(dataList);
      // positionListTemp.current = dataList;
      // setPositionList(dataList);
    } catch {
    }
  };

  const wsFilter = ({ source }: any) => {
    const dataList = source?.data;
    if (dataList) {
      if (source?.msgDataType === MSGDATATYPE.ALL) {
        // setTempPositionList(dataList);
        setTempPositionList(dataList);
        // positionListTemp.current = dataList;
      } else {
        const positions = [...(getPositionOrder().tempPositionList)];
        dataList.forEach((data: any) => {
          const index = positions.findIndex(item => item.symbolId === data.symbolId && item.isLong === data.isLong);
          if ((+data.total) > 0) {
            if (index > -1) {
              const fundingRecords = positions[index].fundingRecords ??  [];
              const pnl = +(positions[index].pnl ?? 0);
              const fee = +(positions[index].fee ?? 0);
              const funding = +(positions[index].funding ?? 0);
              positions[index] = data;
              positions[index].fundingRecords = [...data.fundingRecords, ...fundingRecords];
              positions[index].fundingRecords.sort((r1: any, r2: any) => r2.T - r1.T);
              if (positions[index].fundingRecords.length > 2) {
                positions[index].fundingRecords = positions[index].fundingRecords.slice(0, 3);
              }
              // @ts-expect-error
              positions[index].pnl = pnl + (+(data.pnl ?? 0));
              // @ts-expect-error
              positions[index].fee = fee + (+(data.fee ?? 0));
              // @ts-expect-error
              positions[index].funding = funding + (+(data.funding ?? 0));
            } else {
              positions.push(data);
            }
          } else {
            if (index > -1) {
              positions.splice(index, 1);
            }
          }
        });
        setTempPositionList(positions);
        // positionListTemp.current = positions;
        // setTempPositionList(positions);
        // if (positions.length === 0) {
        //   setUnrealisedPnl(0, 0);
        //   setPositionList([]);
        // }
      }
    }
    return source?.data;
  };

  useEffect(() => {
    if (calcPositionList.length === 0) {
      return;
    }
    const symbols = symbolsMap.futures ?? {};
    const balance = balances[0];
    let crossUnrealisedPnl = 0;
    let isolatedUnrealisedPnl = 0;
    let crossMaintainMargin = 0;
    let isolatedMargin = 0;

    const tempSymbolCrossPosition: Record<string, any> = {};

    const positionList = calcPositionList.map(position => {
      const symbol = symbols[position.symbolId];
      const contractMultiplier = symbol?.baseTokenFutures?.contractMultiplier;
      if (contractMultiplier) {
        const multiplier = +contractMultiplier;
        const avgPrice = +position.avgPrice;
        const leverage = +position.leverage;
        const total = +position.total;
        const margin = +position.margin;
        const pnl = +position.pnl;
        const fee = +position.fee;
        const funding = +position.funding;
        const maintainMarginRate = +position.maintainMargin;
        const { symbolId, positionType, isLong } = position;

        const precision = Number(
          GlobalConfiguration.depth[symbol.minPricePrecision as keyof typeof GlobalConfiguration.depth]
        );

        const markedPrice = markedPrices[position.symbolName];
        position.indices = markedPrice;
        if (markedPrice) {
          const { orgPnl, orgRoi } = getUnrealizedPnlRoi({
            price: +markedPrice,
            avgPrice,
            positionSide: isLong,
            contAmount: total,
            contractMultiplier: multiplier,
            margin,
            pricePrecision: precision
          });

          position.unrealisedPnl = orgPnl;
          position.profitRate = orgRoi;
          position.maintainMarginValue = maintainMarginRate * total * multiplier * (+markedPrice);

          position.minMargin = Math.max(0, Math.min(margin - position.maintainMarginValue, margin + position.unrealisedPnl - avgPrice * total * multiplier / leverage));
        }
        const lastPrice = lastPrices[position.symbolId];
        if (lastPrice) {
          const { orgPnl, orgRoi } = getUnrealizedPnlRoi({
            price: +lastPrice,
            avgPrice,
            positionSide: isLong,
            contAmount: total,
            contractMultiplier: multiplier,
            margin,
            pricePrecision: precision
          });
          position.unrealisedPnlLatest = orgPnl;
          position.profitRateLatest = orgRoi;
        }
        position.realisedPnl = pnl + fee + funding;

        if (positionType === PositionTypes.CROSS) {
          crossUnrealisedPnl += (position.unrealisedPnl ?? 0);
          crossMaintainMargin += (position.maintainMarginValue ?? 0);
          if (!tempSymbolCrossPosition[symbolId]) {
            tempSymbolCrossPosition[symbolId] = {
              longUnrealisedPnl: 0,
              shortUnrealisedPnl: 0,
              longMaintainMargin: 0,
              shortMaintainMargin: 0,
              longAvgPrice: 0,
              shortAvgPrice: 0,
              longTotal: 0,
              shortTotal: 0
            };
          }
          if (isLong === '1') {
            tempSymbolCrossPosition[symbolId].longUnrealisedPnl = position.unrealisedPnl ?? 0;
            tempSymbolCrossPosition[symbolId].longMaintainMargin = position.maintainMarginValue ?? 0;
            tempSymbolCrossPosition[symbolId].longAvgPrice = avgPrice;
            tempSymbolCrossPosition[symbolId].longTotal = total;
          } else {
            tempSymbolCrossPosition[symbolId].shortUnrealisedPnl = position.unrealisedPnl ?? 0;
            tempSymbolCrossPosition[symbolId].shortMaintainMargin = position.maintainMarginValue ?? 0;
            tempSymbolCrossPosition[symbolId].shortAvgPrice = avgPrice;
            tempSymbolCrossPosition[symbolId].shortTotal = total;
          }
        } else {
          isolatedUnrealisedPnl += (position.unrealisedPnl ?? 0);
          isolatedMargin += margin;
        }
      }
      return position;
    });
    // 计算保证金率和强平价
    let crossMarginRate = 0;
    let available = 0;
    if (balance) {
      // total = 0
      // 全仓保证金余额 = 冻结金额 + 可用余额 + 全仓未实现盈亏 + 负债 - 逐仓保证金
      // total !== 0
      // 全仓保证金余额 = 钱包余额 + 全仓未实现盈亏 + 负债 - 逐仓保证金
      const total = +balance.total;
      const originTotal = +balance.originTotal;
      const locked = +balance.locked;
      const availableMargin = +balance.availableMargin;
      const indebted = +balance.indebted;
      if (total === 0) {
        available = locked + availableMargin + indebted - isolatedMargin;
      } else {
        available = originTotal + indebted - isolatedMargin;
      }
      crossMarginRate = crossMaintainMargin / (available + crossUnrealisedPnl);
    }

    positionList.forEach(position => {
      // const total = +position.total;
      const margin = +position.margin;
      // const avgPrice = +position.avgPrice;
      const { symbolId, isLong, unrealisedPnl = 0, positionType, maintainMargin, maintainMarginValue = 0 } = position;
      const symbol = symbols[symbolId];
      const contractMultiplier = symbol?.baseTokenFutures?.contractMultiplier;
      if (contractMultiplier) {
        const multiplier = +contractMultiplier;
        if (positionType === PositionTypes.CROSS) {
          position.marginRate = crossMarginRate;
          const symbolPosition = tempSymbolCrossPosition[symbolId];
          if (symbolPosition && balance) {
            const {
              longMaintainMargin, shortMaintainMargin,
              longUnrealisedPnl, shortUnrealisedPnl,
              longAvgPrice, shortAvgPrice,
              longTotal, shortTotal
            } = symbolPosition;
            // 全仓强平价=(全仓钱包余额-TMM1+UPNL1-合约1多仓开仓均价*合约1多仓持仓张数*合约乘数+合约1空仓开仓均价*合约1空仓持仓张数*合约乘数)/(合约1多仓维持保证金比率*合约1多仓持仓张数*合约乘数+合约1空仓维持持保证金比率*合约1空仓持仓张数*合约乘数+合约1空仓持仓张数*合约乘数-合约1多仓持仓张数*合约乘数)
            // UPNL1为其它全仓合約下的全部的未实现盈亏(除合约1外)
            // TMM1为其它全仓合約下的全部的维持保证金(除合约1外)
            const tmm1 = crossMaintainMargin - longMaintainMargin - shortMaintainMargin;
            const upnl1 = crossUnrealisedPnl - longUnrealisedPnl - shortUnrealisedPnl;
            const numerator = available - tmm1 + upnl1 - longAvgPrice * longTotal * multiplier + shortAvgPrice * shortTotal * multiplier;
            const denominator = maintainMargin * longTotal * multiplier + maintainMargin * shortTotal * multiplier + shortTotal * multiplier - longTotal * multiplier;
            let liquidationPrice = numerator / denominator;
            const precision = Number(
              GlobalConfiguration.depth[symbol.minPricePrecision as keyof typeof GlobalConfiguration.depth]
            );
            const pow = Math.pow(10, precision);
            if (isLong === '1') {
              liquidationPrice = Math.ceil(liquidationPrice * pow) / pow;
            } else {
              liquidationPrice = Math.floor(liquidationPrice * pow) / pow;
            }
            position.liquidationPrice = liquidationPrice;
          }
        } else {
          position.marginRate = maintainMarginValue / (margin + unrealisedPnl);
          // 取服务端的值
          // 逐仓强平价格=(逐仓钱包余额-持仓方向*开仓均价*持仓张数*合约乘数)/(维持保证金比率*持仓张数*合约乘数-持仓方向*持仓张数*合约乘数)
          // const direction = isLong === '1' ? 1 : -1;
          // position.liquidationPrice = (margin - direction * avgPrice * total * multiplier) / (maintainMargin * total * multiplier - direction * total * multiplier);
        }
      }
    });
    setUnrealisedPnl(crossUnrealisedPnl, isolatedUnrealisedPnl);
    setPositionList(positionList);
  }, [symbolsMap, calcPositionList, markedPrices, lastPrices, balances]);

  const wsDataFormat = useCallback(({ current }: any) => {
    return current?.data;
  }, []);

  const subscription = useMemo(() => {
    return {
      id: 'futures_position',
      topic: 'futures_position',
      event: 'sub',
      params: {
        org: appConfig.orgId,
        realtimeInterval: '24h',
        binary: isServerSideRender() ? false : !Boolean(window.localStorage.ws_binary)
      }
    };
  }, []);
  useWebSocket({
    name: 'future_position_source',
    path: isLogin ? api.ws : '',
    status: 'loading',
    format: wsDataFormat,
    filter: wsFilter,
    httpAction: getPositionList,
    subscription
  });

  useEffect(() => {
    if (isLogin) {
      getPositionList();
    } else {
      setPositionList([]);
    }
  }, [isLogin]);

  return {
    getPositionList
  };
}
