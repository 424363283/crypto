'use client';

import {
  useEffect,
  useRef,
  useContext,
  ForwardRefRenderFunction,
  forwardRef,
  useImperativeHandle,
  useState,
  memo
} from 'react';
import { Loading as YmexLoading } from '@/components/loading';

// import { CandleType, registerLocale } from "klinecharts";
import { CandleType, registerLocale } from './index.esm';

import { useSize } from 'ahooks';

import Loading from '@/components/Yloading';

import { message } from '@/core/utils';
import { LANG } from '@/core/i18n';
import { Swap, Spot, TradeMap } from '@/core/shared';

import Widget, { IndicatorType } from './Widget';

import Datafeed from '../Datafeed';
import { ChartRef, createSymbolName } from '../types';
import ExchangeChartContext from '../../context';
import { SUBSCRIBE_TYPES, useWs } from '@/core/network';
import { kChartEmitter } from '@/core/events';
import { useResponsive, useTheme } from '@/core/hooks';
import { RootColor } from '@/core/styles/src/theme/global/root';
import { useRouter } from 'next/router';
import { getKineState, setPositionLineTpSl,setPositionTpSlFun } from '@/store/kline';

import * as Utils from '@/components/trade-ui/order-list/swap/components/modal/stop-profit-stop-loss-modal/utils';

// import { Color } from "../types";

import { HistoryOrderMarkArrowDirection } from './extension/historyOrderMark';

import IndicatorModal, { IndicatorOperateType } from './indicator-modal';

import { LiquidationModal, ReverseConfirmModal } from '@/components/trade-ui/order-list/swap/components/modal';

import { useModalProps, usePositionActions } from '@/components/order-list/swap/stores/position-list';
import { useOrderData } from '@/components/order-list/swap/hooks/use-order-data';
import { store } from '@/components/order-list/swap/store';
import styles from './index.module.scss';

import {
  getSwapAssetsTransactionApi,
  getSwapGetPendingApi,
  getSwapHistoryDealApi,
  getSwapHistoryOrderApi
} from '@/core/api';
import { cancelOrder } from './cancelOrder';

const intlPrefix = 'system.common.klinechart.';

const { Trade } = Spot;
/** 仓位单位*/
export enum PositionUnitTypes {
  /** 0 张 */
  CONT = 0,
  /** 1 币(BTC/ETH etc.) */
  COIN,
  /** 2 USDT */
  USDT
}

const OriginalKLine: ForwardRefRenderFunction<ChartRef, { containerId?: string }> = (props, ref) => {
  const {
    onVisibleLiquidationModal,
    liquidationModalProps,
    onCloseLiquidationModal,
    onVisibleReverseModal,
    reverseModalProps,
    onCloseReverseModal
  } = useModalProps();

  const { coinPricePrecision } = props;

  const { onReverse } = usePositionActions(); // 反向开仓

  const rootEl = useRef<HTMLDivElement>(null);
  const size = useSize(rootEl.current);

  const widgetRef = useRef<Widget>();

  const datafeedRef = useRef<Datafeed>();

  const orderRef = useRef<any>();
  let containerId = 'bv_kline_chart';

  const {
    originalKLineStyle,
    kLineResolution,
    showPositionLine,
    showHistoryOrderMark,
    kLinePriceType,
    showLiquidationLine,
    showPositionTPSLLine,
    showCurrentEntrustLine,
    showCountdown
  } = useContext(ExchangeChartContext);

  // const theme = 'light'
  const { isDark } = useTheme();
  const theme = isDark ? 'dark' : 'light';

  const [loading, setLoading] = useState(true);

  const isLogin = true;

  const [indicatorModalVisible, setIndicatorModalVisible] = useState(false);

  const [mainIndicators, setMainIndicators] = useState<string[]>([]);

  const [subIndicators, setSubIndicators] = useState<string[]>([]);

  const [newColor, setNewColor] = useState<any>({
    1: { 'up-color-rgb': '#2AB26C', 'down-color-rgb': '#EF454A', 'active-color-rgb': '#7F828B' }, // 绿涨红跌
    2: { 'up-color-rgb': '#EF454A', 'down-color-rgb': '#2AB26C', 'active-color-rgb': '#7F828B' }, // 红涨绿跌
    3: { 'up-color-rgb': '#FD374B', 'down-color-rgb': '#2C66D1', 'active-color-rgb': '#7F828B' }, // 红涨蓝跌 韩国品牌色
    4: { 'up-color-rgb': '#CC783C', 'down-color-rgb': '#4A96EE', 'active-color-rgb': '#7F828B' } // 视觉障碍
  });

  const [Color, setColor] = useState<any>({
    Red: '#EF454A',
    Green: '#2AB26C'
  });

  const [positionList, setPositionList] = useState<any>([]); //当前持仓线数据
  const [tpSlList, setTpSlList] = useState<any>([]); //止盈止损列表数据
  const [historyOrderList, setHistoryOrderList] = useState<any>([]); //历史成交数据
  // const [currentEntrustOrderList, setCurrentEntrustOrderList] = useState<any>([]); //当前委托订单

  // const isSwapLink = window.location.href.includes('swap');// 是否是合约模块，
  const router = useRouter();
  const isSwapLink = router.asPath.includes('swap'); // 使用 useRouter 获取路径信息

  let symbolSwapId = window.location.pathname.split('/').pop() || 'btc-usdt';
  let indexToken = (window.location.pathname.split('/').pop() || 'btc-usdt').toUpperCase();

  let isLite = window.location.pathname.includes('lite');

  let pathname = window.location.pathname;

  let positionUnitType = 2;

  const YKlineRef = useRef<any>(null);

  const cryptoData = Swap.Info.getCryptoData(symbolSwapId, { withHooks: isLite ? false : true });

  const { coin, quoteCoin, quoteCoinBalance, coinBalance, currentSpotContract } = Trade.state;
  let { currentPricePrecision, pricePrecision, minChangePrice, settleCoin } = cryptoData;

  const [litePricePrecision, setLitePricePrecision] = useState(0);

  useEffect(() => {
    if (isLite) {
      TradeMap.getLiteTradeMap().then(res => {
        if (res) {
          const indexToken = res.get(symbolSwapId.toUpperCase());
          if (indexToken) {
            setLitePricePrecision(indexToken?.positionPrecision);
          }
        }
      });
    }
  }, [isLite, symbolSwapId]);
  let coinUnitLen = litePricePrecision || pricePrecision;

  const contractMultiplier = ''; //合约系数
  let max_digits = litePricePrecision || pricePrecision;

  const isSpotLink = router.asPath.includes('spot');

  if (isSpotLink) {
    coinUnitLen = currentSpotContract?.digit;
    max_digits = currentSpotContract?.digit;
  }

  // 获取历史成交数据
  const getleHistoryList = async () => {
    const params: any = {
      beginDate: '',
      endDate: '',
      page: 1,
      size: 100,
      subWallet: 'all'
    };
    const res = await getSwapHistoryDealApi(params, true);

    if (res && res.code == 200) {
      setHistoryOrderList(res?.data?.pageData);
    }
  };

  useEffect(() => {
    if (isSwapLink) {
      getleHistoryList();
    }
  }, [isSwapLink]);

  useImperativeHandle(
    ref,
    () => ({
      openIndicatorModal: () => {
        setIndicatorModalVisible(true);
      },
      openSettingModal: () => {}
    }),
    []
  );

  useEffect(() => {
    if (size) {
      widgetRef.current?.chart()?.resize();
    }
  }, [size]);

  useEffect(() => {
    if (widgetRef.current && coinUnitLen) {
      let resetData = false;
      let reloadData = false;
      if (datafeedRef.current) {
        if (datafeedRef.current.setPriceType(kLinePriceType)) {
          resetData = true;
        }
        if (datafeedRef.current.setVolumeUnit(positionUnitType)) {
          resetData = true;
        }
      }
      const isTimeLine = kLineResolution === 'Time';
      const { symbol: ticker, interval } = widgetRef.current.symbolInterval();
      if (ticker !== indexToken || interval !== kLineResolution) {
        reloadData = true;
      }
      if (reloadData || resetData) {
        datafeedRef.current?.cancel();
      }
      if (reloadData) {
        const symbol = createSymbolName(indexToken, symbolSwapId, max_digits, coinUnitLen, contractMultiplier);
        widgetRef.current.setSymbol(symbol, isTimeLine ? '1' : kLineResolution);
      }
      if (!reloadData && resetData) {
        widgetRef.current.resetData();
      }
    }
    return () => {
      datafeedRef.current?.cancel();
    };
  }, [indexToken, max_digits, coinUnitLen, symbolSwapId, kLineResolution, pathname, positionUnitType, kLinePriceType]);

  useEffect(() => {
    if (widgetRef.current && coinUnitLen) {
      let resetData = false;
      let reloadData = false;
      if (datafeedRef.current) {
        if (datafeedRef.current.setPriceType(kLinePriceType)) {
          resetData = true;
        }
        if (datafeedRef.current.setVolumeUnit(positionUnitType)) {
          resetData = true;
        }
      }

      const isTimeLine = kLineResolution === 'Time';
      const { symbol: ticker, interval } = widgetRef.current.symbolInterval();
      if (ticker !== indexToken || interval !== kLineResolution) {
        reloadData = true;
      }
      if (reloadData) {
        const symbol = createSymbolName(indexToken, symbolSwapId, max_digits, coinUnitLen, contractMultiplier);
        widgetRef.current.setSymbol(symbol, isTimeLine ? '1' : kLineResolution);
      }
      if (!reloadData && resetData) {
        widgetRef.current.resetData();
      }
    }
    return () => {
      datafeedRef.current?.cancel();
    };
  }, [indexToken, symbolSwapId, max_digits, coinUnitLen, kLineResolution, pathname, positionUnitType, kLinePriceType]);

  useEffect(() => {
    if (widgetRef.current) {
      widgetRef.current.setChartType(kLineResolution === 'Time' ? CandleType.Area : originalKLineStyle);
    }
  }, [originalKLineStyle, kLineResolution]);

  useEffect(() => {
    const locale = localStorage.getItem('lang') || 'en-US';
    const locales = {
      time: LANG('klinechart_time'),
      open: LANG('klinechart_open'),
      high: LANG('spot_klinechart_high'),
      low: LANG('klinechart_low'),
      close: LANG('spot_klinechart_close'),
      volume: LANG('klinechart_volume'),
      turnover: '--',
      change: LANG('spot_klinechart_changes'),
      amplitude: LANG('klinechart_range')
    };
    registerLocale(locale, locales);
    const datafeed = new Datafeed({
      priceType: kLinePriceType,
      volumeUnit: positionUnitType,
      getTimezone: () => widgetRef.current?.chart()?.getTimezone() ?? 'Asia/Shanghai',
      brokenNotify: () => {
        widgetRef.current?.resetData();
      },
      onDataLoading: () => {
        setLoading(true);
      },
      onDataLoadEnd: () => {
        setLoading(false);
      }
    });

    datafeed.setVolumeUnit(positionUnitType);
    datafeed.setPriceType(kLinePriceType);
    YKlineRef.current = datafeed;
    datafeedRef.current = datafeed;
    widgetRef.current = new Widget({
      container: containerId,
      symbol: createSymbolName(indexToken, symbolSwapId, max_digits, coinUnitLen, contractMultiplier),
      theme,
      locale,
      interval: kLineResolution === 'Time' ? '1' : kLineResolution,
      datafeed: datafeed
    });
    widgetRef.current.setChartType(kLineResolution === 'Time' ? CandleType.Area : originalKLineStyle);
    return () => {
      if (widgetRef.current) {
        datafeedRef.current?.cancel();
        widgetRef.current.remove();
        widgetRef.current = undefined;
      }
    };
  }, [max_digits]);

  useEffect(() => {
    if (widgetRef.current && indexToken) {
      const cacheIndicators = widgetRef.current.getCacheIndicators();
      const indicators = cacheIndicators[indexToken];
      let mainIndicators: string[] = [];
      let subIndicators: string[] = [];
      widgetRef.current.removeAllIndicator();
      if (indicators) {
        indicators.forEach(indicator => {
          if (indicator.type === IndicatorType.Main) {
            mainIndicators.push(indicator.name);
          } else {
            subIndicators.push(indicator.name);
          }
          widgetRef.current?.createIndicator(indicator);
        });
      } else {
        widgetRef.current?.createIndicator({
          name: 'MA',
          type: IndicatorType.Main
        });
        widgetRef.current?.createIndicator({
          name: 'VOL',
          type: IndicatorType.Sub
        });
        mainIndicators = ['MA'];
        subIndicators = ['VOL'];
      }
      setMainIndicators(mainIndicators);
      setSubIndicators(subIndicators);
    }
  }, [indexToken, coinUnitLen]);

  useEffect(() => {
    if (widgetRef.current) {
      widgetRef.current.changeTheme(theme);
    }
  }, [theme]);
  useEffect(() => {
    if (widgetRef.current) {
      widgetRef.current.setShowCountdown(showCountdown);
    }
  }, [showCountdown]);

  //切换k线主题色
  useEffect(() => {
    kChartEmitter.on(kChartEmitter.K_CHART_SWITCH_COLOR, (data: any) => {
      if (widgetRef.current) {
        widgetRef.current.setColor(data['up-color-rgb'], data['down-color-rgb']);
      }
    });
  }, []);

  useEffect(() => {
    const index = RootColor.getColorIndex;
    RootColor.setColorRGB(index, false);
  }, []);

  const index = RootColor.getColorIndex;
  useEffect(() => {
    if (index) {
      setColor({
        Red: newColor[index]['down-color-rgb'],
        Green: newColor[index]['up-color-rgb']
      });
    }
  }, [index]);

  useWs(SUBSCRIBE_TYPES.ws4001, data => YKlineRef.current?.updateData?.(data));

  kChartEmitter.on(kChartEmitter.K_CHART_POSITION_UPDATE, (data: any) => {
    setPositionList(data);

    const newTpSlList = data.flatMap((item: any) =>
      item.tpSlList.map((tpSl: any) => ({
        ...tpSl,
        orginalItem: item.orginalItem
      }))
    );
    setTpSlList(newTpSlList);
  });
  const { tabIndex, hide } = store;
  const { positions, pending } = useOrderData({ hide });

  const currentEntrustOrderList = pending.filter(item => item?.type == 1);

  // 绘制持仓线
  useEffect(() => {
    if (widgetRef.current && showPositionLine && isSwapLink) {
      positionList.forEach(position => {
        if (position?.symbolId === symbolSwapId) {
          let unrealizedPnl = position.unrealizedPnl;
          const isLong = position?.side === '1';
          const direction = isLong ? LANG('多') : LANG('空'); //持仓方向
          let total = position.volume;
          const profitLossColor = unrealizedPnl >= 0 ? Color.Green : Color.Red;
          const openDirectionBg = unrealizedPnl >= 0 ? Color.Green : Color.Red; //开仓内容背景色
          const directionColor = '#399BA2'; //多/空
          const isLight = theme === 'light';
          const tooltipColor = isLight ? '#3B3C45' : '#3B3C45';
          const backgroundColor = isLight ? '#FFFFFF' : '#FFFFFF';
          widgetRef.current?.createPositionLine({
            direction,
            directionColor,
            openDirectionBg,
            profitLoss: `${direction} ${unrealizedPnl} (${position?.profitRate})`,
            profitLossColor,
            price: +position?.avgPrice,
            volume: `${total}`,
            tooltipColor,
            backgroundColor,
            showStopProfitLoss:false,
            closeTooltip: LANG('市价平仓'),
            reverseTooltip: LANG('反手'),
            onOrderdrag: e => {
              console.log('eeeee', e);
            },
            onReverseClick: () => {
              onReverse(position.orginalItem, ({ onConfirm }) =>
                onVisibleReverseModal(position.orginalItem, onConfirm)
              );
              console.log('点击反手开仓');
            },
            onCloseClick: () => {
              onVisibleLiquidationModal(position.orginalItem, false);
            }
          });
        }
      });
    }

    return () => {
      if (widgetRef.current) {
        widgetRef.current.removeAllPositionLine();
      }
    };
  }, [
    theme,
    isLogin,
    showPositionLine,
    positionList,
    symbolSwapId,
    contractMultiplier,
    coinUnitLen,
    currentSpotContract?.digit,
    positionUnitType
  ]);

  // 绘制止盈止损
  useEffect(() => {
    if (widgetRef.current && showPositionTPSLLine && isSwapLink) {
      tpSlList?.forEach((position: any) => {
        const { triggerPrice, orginalItem } = position;
        if (position?.symbol === symbolSwapId) {
          let unrealizedPnl = position.unrealizedPnl;
          const isLong = position?.side === '1';
          const direction = isLong ? LANG('多') : LANG('空'); //持仓方向
          const isLongProfit = (isLong && position?.direction != '1') || (!isLong && position?.direction == '1');
          let profitLoss = isLongProfit ? 'TP' : 'SL';

          let closeTooltip = isLongProfit ? LANG('取消止盈') : LANG('取消止损');
          const profitLossColor = unrealizedPnl >= 0 ? Color.Green : Color.Red;
          const directionColor = isLongProfit ? Color.Green : Color.Red; //多/空
          const openDirectionColor = isLongProfit ? Color.Green : Color.Red; //开仓方向颜色
          const openDirectionBg = isLongProfit ? '#324D45' : '#47363D'; //开仓内容背景色
          const closeBg = isLongProfit ? '#34343B' : '#34343B'; //关闭按钮内容背景色
          const closeColor = isLongProfit ? '#A5A8AC' : '#A5A8AC'; //关闭按钮色

          const isLight = theme === 'light';
          const tooltipColor = isLight ? '#3B3C45' : '#3B3C45';
          const backgroundColor = isLight ? '#FFFFFF' : '#FFFFFF';
          let price = Number(triggerPrice);

          const code = orginalItem?.symbol?.toUpperCase();
          const isUsdtType = Swap.Info.getIsUsdtType(code);

          const _calculateIncome = ({
            shouldSet = true,
            profit,
            loss
          }: {
            shouldSet?: boolean;
            profit?: boolean;
            loss?: boolean;
          }) => {
            if (price) {
              const value = Swap.Calculate.income({
                usdt: isUsdtType,
                code: orginalItem.symbol?.toUpperCase(),
                isBuy: orginalItem.side === '1',
                avgCostPrice: Number(orginalItem.avgCostPrice),
                volume: Number(orginalItem.availPosition),
                flagPrice: Number(price)
              });
              return `${value}`;
            } else {
              return '';
            }
          };
          const stopProfitIncome = _calculateIncome({ profit: true });
          const stopLossIncome = _calculateIncome({ loss: true });

          const roe = Swap.Calculate.positionROE({
            usdt: isUsdtType,
            data: orginalItem,
            income: isLongProfit ? Number(stopProfitIncome) : Number(stopLossIncome)
          }).toFixed(2);

          let total = isLongProfit ? `${LANG('预计止盈')}(${roe}%)` : `${LANG('预计止损')}(${roe}%)`;

          widgetRef.current?.createPositionTPSLLine({
            direction,
            directionColor,
            openDirectionColor,
            closeColor,
            openDirectionBg,
            closeBg,
            profitLoss: profitLoss,
            profitLossColor,
            price: price,
            volume: `${total}`,
            tooltipColor,
            backgroundColor,
            closeTooltip: closeTooltip,
            reverseTooltip: LANG('反手'),
            onOrderdragEnd: async e => {
              let stopProfit = '--'; // 止盈价格
              let stopLoss = '--'; // 止损价格
              const price = e.overlay.points[0].value.toFixed(2);
              if (price <= 0) {
                return;
              }

              const data = position.orginalItem;
              const baseShowPrecision = Number(data.baseShowPrecision);
              const flagPrice = Swap.Socket.getFlagPrice(code);
              const priceNow = Swap.Utils.getNewPrice(code);
              data.orders.forEach((o: any) => {
                if (o.strategyType === '1') stopProfit = Number(o.triggerPrice).toFixed(baseShowPrecision);
                if (o.strategyType === '2') stopLoss = Number(o.triggerPrice).toFixed(baseShowPrecision);
              });
              const params: any[] = [
                {
                  priceType: 1,
                  triggerPrice: stopProfit,
                  strategyType: 1
                }, // 止盈
                {
                  priceType: 1,
                  triggerPrice: stopLoss,
                  strategyType: 2
                } // 止损
              ];
              YmexLoading.start();
              // 更新止盈止损价格
              if (isLongProfit) {
                params[0].triggerPrice = price;
              } else {
                params[1].triggerPrice = price;
              }
              const result = await Utils.SubmitStopProfitStopLoss({
                position: data,
                params: params,
                edit: true,
                flagPrice,
                priceNow,
                stopProfit: price,
                stopLoss: price,
                isUsdtType,
                balanceData: Swap.Assets.getBalanceData({ code: data.symbol, walletId: data.subWallet }),
                subWallet: data['subWallet']
              });
              if (result) {
                try {
                  if (result?.code === 200) {
                    Swap.Order.fetchPending(isUsdtType);
                    Swap.Order.fetchPosition(isUsdtType);
                    message.success(LANG('修改成功'), 1);
                  } else {
                    message.error(result?.message || LANG('失败'), 1);
                  }
                } catch (e: any) {
                  console.log('xxxx', e);
                  message.error(e?.error?.message || LANG('失败'), 1);
                } finally {
                }
              }
              YmexLoading.end();
            },
            onMoveStart: e => {
              console.log('反手开仓', e);
            },
            onCloseClick: async e => {
              const incomeLoss = isLongProfit ? false : true;
              cancelOrder(incomeLoss, position);
            }
          });
        }
      });
    }

    return () => {
      if (widgetRef.current) {
        widgetRef.current.removeAllPositionTPSLLine();
      }
    };
  }, [theme, isLogin, showPositionTPSLLine, tpSlList, symbolSwapId, contractMultiplier, coinUnitLen, positionUnitType]);

  // // 创建历史订单标记
  useEffect(() => {
    if (widgetRef.current && showHistoryOrderMark && isSwapLink) {
      historyOrderList.forEach(order => {
        if (order.symbol === symbolSwapId) {
          const total = order.dealVolume;
          const isBuy = /^1/i.test(order.side);
          const price = order?.dealPrice;
          const color = isBuy ? Color.Green : Color.Red;
          const direction = isBuy ? HistoryOrderMarkArrowDirection.Up : HistoryOrderMarkArrowDirection.Down;
          const tooltipColor = theme === 'light' ? '#3B3C45' : '#3B3C45';
          const directionName = isBuy ? LANG('买入') : LANG('卖出');
          widgetRef.current?.createHistoryOrderMark({
            direction,
            tooltip: `${directionName} ${LANG('价格')}：${order.dealPrice} ${total}`,
            color,
            tooltipColor,
            point: { timestamp: +order.time }
          });
        }
      });
    }
    return () => {
      if (widgetRef.current) {
        widgetRef.current.removeAllHistoryOrderMark();
      }
    };
  }, [
    historyOrderList,
    isLogin,
    showHistoryOrderMark,
    positionUnitType,
    contractMultiplier,
    coinUnitLen,
    currentSpotContract?.digit,
    symbolSwapId
  ]);

  // 创建强平线
  useEffect(() => {
    if (widgetRef.current && showLiquidationLine && isSwapLink) {
      positionList.forEach(position => {
        if (position.symbolId === symbolSwapId) {
          try {
            const isLong = position?.side === '1';
            const direction = isLong ? LANG('多') : LANG('空'); //持仓方向
            const directionBg = isLong ? Color.Green : Color.Red; //持仓方向

            widgetRef.current?.createLiquidationLine({
              id: position.id,
              direction,
              directionColor: '#F0BA30',
              profitLoss: direction,
              profitLossColor: '##F0BA30',
              price: +position.liquidationPrice,
              volume: LANG('预估强平价格'),
              backgroundColor: directionBg
            });
          } catch (error) {}
        }
      });
    }
    return () => {
      if (widgetRef.current) {
        widgetRef.current.removeAllLiquidationLine();
      }
    };
  }, [historyOrderList, isLogin, contractMultiplier, coinUnitLen, symbolSwapId, positionList, showLiquidationLine]);

  // 创建当前委托
  useEffect(() => {
    // if (widgetRef.current && showPositionTPSLLine) {
    if (widgetRef.current && showCurrentEntrustLine && isSwapLink) {
      currentEntrustOrderList?.forEach((position: any) => {
        if (position?.symbol === symbolSwapId) {
          let unrealizedPnl = position.unrealizedPnl;
          const isLong = position?.side === '1';
          const direction = isLong ? LANG('委托开多') : LANG('委托开空'); //持仓方向
          const isLongProfit = (isLong && position?.direction != '1') || (!isLong && position?.direction == '1');
          let profitLoss = isLongProfit ? LANG('委托开多') : LANG('委托开空');
          let closeTooltip = isLongProfit ? LANG('取消委托') : LANG('取消委托');
          const profitLossColor = unrealizedPnl >= 0 ? Color.Green : Color.Red;
          const directionColor = isLongProfit ? Color.Green : Color.Red; //多/空
          const isLight = theme === 'light';
          const tooltipColor = isLight ? '#3B3C45' : '#3B3C45';
          const backgroundColor = isLight ? '#FFFFFF' : '#FFFFFF';
          let price = Number(position.price);
          let total = position.volume;
          widgetRef.current?.createCurrentEntrustLine({
            direction,
            directionColor,
            profitLoss: profitLoss,
            profitLossColor,
            price: price,
            volume: `${total}`,
            tooltipColor,
            backgroundColor,
            closeTooltip: closeTooltip,
            reverseTooltip: LANG('反手'),
            onOrderdrag: e => {},
            onMoveStart: e => {
              console.log('反手开仓', e);
            },
            onCloseClick: async e => {}
          });
        }
      });
    }

    return () => {
      if (widgetRef.current) {
        widgetRef.current.removeCurrentEntrusLine();
      }
    };
  }, [
    theme,
    isLogin,
    showCurrentEntrustLine,
    tpSlList,
    symbolSwapId,
    contractMultiplier,
    coinUnitLen,
    positionUnitType
  ]);

  const operateIndicator = (name: string, operateType: IndicatorOperateType, indicatorType: IndicatorType) => {
    let indicators: string[];
    let operate;
    if (indicatorType === IndicatorType.Main) {
      indicators = [...mainIndicators];
      operate = setMainIndicators;
    } else {
      indicators = [...subIndicators];
      operate = setSubIndicators;
    }
    if (operateType === IndicatorOperateType.Create) {
      widgetRef.current?.createIndicator({ name, type: indicatorType });
      indicators.push(name);
    } else {
      widgetRef.current?.removeIndicator({ name, type: indicatorType });
      const index = indicators.findIndex(item => item === name);
      if (index > -1) {
        indicators.splice(index, 1);
      }
    }
    operate(indicators);
  };

  //拖动止盈止损
  const { TpSlInfo } = getKineState();




  useEffect(() => {
    console.log("拖动当前的止盈止损🔥🔥🔥🔥🔥🔥🔥===========",)
    console.log("拖动当前的止盈止损",TpSlInfo)
  }, [TpSlInfo]);


  return (
    <div ref={rootEl} style={{ height: '100%', position: 'relative' }}>
      <div id={containerId} className={styles.klineChart}></div>
      {loading && <Loading />}
      {indicatorModalVisible && (
        <IndicatorModal
          mainIndicators={mainIndicators}
          subIndicators={subIndicators}
          onMainIndicatorChange={(name, type) => {
            operateIndicator(name, type, IndicatorType.Main);
          }}
          onSubIndicatorChange={(name, type) => {
            operateIndicator(name, type, IndicatorType.Sub);
          }}
          onReset={() => {
            if (widgetRef.current) {
              widgetRef.current.removeAllIndicator();
              widgetRef.current.createIndicator({
                name: 'MA',
                type: IndicatorType.Main
              });
              widgetRef.current.createIndicator({
                name: 'VOL',
                type: IndicatorType.Sub
              });
              setMainIndicators(['MA']);
              setSubIndicators(['VOL']);
            }
          }}
          onClose={() => {
            setIndicatorModalVisible(false);
          }}
        />
      )}

      {/* 市价平仓 */}
      {liquidationModalProps.visible && (
        <LiquidationModal {...liquidationModalProps} onClose={onCloseLiquidationModal} />
      )}
      {/* 反手开仓 */}
      {reverseModalProps.visible && <ReverseConfirmModal {...reverseModalProps} onClose={onCloseReverseModal} />}
    </div>
  );
};

export default memo(forwardRef(OriginalKLine));
