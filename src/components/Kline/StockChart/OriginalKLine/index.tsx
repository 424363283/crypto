import { useEffect, useRef, useContext, ForwardRefRenderFunction, forwardRef, useImperativeHandle, useState, memo} from 'react';

import { CandleType, registerLocale } from 'klinecharts';

import { useSize } from 'ahooks';


import  Loading  from '@/components/Yloading';

// import { useSlugSymbol } from '@/hooks';

// import { useFutureOrderStore } from '@/store/future-order';

import { ThemeContext, ConfigContext, UserContext } from '@/context';

import Widget, { IndicatorType } from './Widget';
// import ShortcutReverse from '@/components/Position/ShortcutReverse';
// import CreateOrder from '@/components/CreateOrder';

import Datafeed from '../Datafeed';
// import { DEPTH } from '@/constants';
import { ChartRef, createSymbolName } from '../types';
import ExchangeChartContext from '../../context';
import { useKLineSource } from '../useKLineSource';
// import { useKLineHistoryOrder } from '../useKLineHistoryOrder';
// import { useFutureStore, usePositionStore } from '@/store';

// import { ChooseTypes, PositionUnitTypes, PriceTypes } from '@/utils/futures';

// import { digits, format } from '@/utils/index';

import { Color, volumeConversion } from '../types';

import { HistoryOrderMarkArrowDirection } from './extension/historyOrderMark';

import IndicatorModal, { IndicatorOperateType } from './indicator-modal';

import styles from './index.module.scss';

const intlPrefix = 'system.common.klinechart.';



const OriginalKLine: ForwardRefRenderFunction<any> = (props, ref) => {
  const rootEl = useRef<HTMLDivElement>(null);
  const size = useSize(rootEl.current);

  const widgetRef = useRef<Widget>();

  const datafeedRef = useRef<Datafeed>();

  const orderRef = useRef<any>();

  let containerId='yemx_kline_chart'
  // const {  containerId = 'bv_kline_chart' } = props;


  const { originalKLineStyle, kLineResolution, showPositionLine, showHistoryOrderMark, kLinePriceType } = useContext(ExchangeChartContext);

  // const { theme } = useContext(ThemeContext);

  // const { symbolSwapId, indexToken, coinUnitLen, max_digits, contractMultiplier } = useSlugSymbol();

  // const { unrealisedPnlPriceType } = useFutureStore();

  // 仓位单位
  // const { positionUnitType } = useFutureOrderStore();
  const symbolSwapId = 'BTC-SWAP-USDT'; //当前交易对
  const indexToken ='BTCUSDT'; //当前交易对
  const max_digits =8 
  const theme = 'drak';
  const positionUnitType = 2; //张币u 单位
  const coinUnitLen=2
  let contractMultiplier=0


  const [loading, setLoading] = useState(true);

  const [currentPosition, setCurrentPosition] = useState<any>({}); // 一键反手or平仓当前仓位信息
  const [positionProcessing, setPositionProcessing] = useState(false); //仓位处理

  const { symbolsMap } = useContext(ConfigContext);
  // const { positionList } = usePositionStore();

  // const historyOrderList = useKLineHistoryOrder();

  const { isLogin } = useContext(UserContext);

  const [indicatorModalVisible, setIndicatorModalVisible] = useState(false);

  const [mainIndicators, setMainIndicators] = useState<string[]>([]);

  const [subIndicators, setSubIndicators] = useState<string[]>([]);

  // const symbol_info = symbolsMap.all[symbolSwapId] || {};
  // const { minPricePrecision } = symbol_info;

  // useKLineSource({ symbolSwapId, kLineResolution, kLinePriceType, indexToken });

  useImperativeHandle(ref, () => ({
    openIndicatorModal: () => {
      setIndicatorModalVisible(true);
    },
    openSettingModal: () => {},
  }), []);

  useEffect(() => {
    if (size) {
      widgetRef.current?.chart()?.resize();
    }
  }, [size]);

  useEffect(() => {
    if (widgetRef.current) {
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
    return () => { datafeedRef.current?.cancel(); };
  }, [indexToken, symbolSwapId, kLineResolution, positionUnitType, kLinePriceType]);

  useEffect(() => {
    if (widgetRef.current) {
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
    return () => { datafeedRef.current?.cancel(); };
  }, [indexToken, symbolSwapId, kLineResolution, positionUnitType, kLinePriceType]);

  useEffect(() => {
    if (widgetRef.current) {
      widgetRef.current.setChartType(kLineResolution === 'Time' ? CandleType.Area : originalKLineStyle);
    }
  }, [originalKLineStyle, kLineResolution]);





  useEffect(() => {
    // const locale = localStorage.getItem('lang') || 'en-US';
    const locale = 'zh-CN';

    const locales = {
      time: '时间：',
      open: '开：',
      high: '高：',
      low: '低：',
      close: '收：',
      volume: '成交量：',
      // turnover: '----未知',
      change: '涨幅：',
      amplitude: '振幅：'

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
      },
    });
    datafeed.setVolumeUnit(positionUnitType);
    datafeed.setPriceType(kLinePriceType);
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
  }, []);

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
        widgetRef.current?.createIndicator({ name: 'MA', type: IndicatorType.Main });
        widgetRef.current?.createIndicator({ name: 'VOL', type: IndicatorType.Sub });
        mainIndicators = ['MA'];
        subIndicators = ['VOL'];
      }
      setMainIndicators(mainIndicators);
      setSubIndicators(subIndicators);
    }
  }, [indexToken]);

  useEffect(() => {
    if (widgetRef.current) {
      widgetRef.current.changeTheme(theme);
    }
  }, [theme]);

  // // 绘制持仓线
  // useEffect(() => {
  //   if (widgetRef.current && isLogin && showPositionLine) {
  //     positionList.forEach(position => {
  //       if (position.symbolId === symbolSwapId) {
  //         const unrealizedPnl = Number(
  //           unrealisedPnlPriceType == 1 ? position.unrealisedPnl : position.unrealisedPnlLatest
  //         );
  //         let profitRate = unrealisedPnlPriceType == 1 ? position.profitRate : position.profitRateLatest;
  //         profitRate = format(profitRate, 2);

  //         const isLong = position.isLong === '1';
  //         const direction = isLong ? 'LONG ' : 'SHORT '; //持仓方向
  //         const total = volumeConversion(
  //           positionUnitType,
  //           contractMultiplier,
  //           +position.total,
  //           +position.avgPrice,
  //           coinUnitLen
  //         );

  //         const profitLossColor = unrealizedPnl >= 0 ? Color.Green : Color.Red;
  //         const directionColor = isLong ?  Color.Green : Color.Red; //多/空

  //         const isLight = theme === 'light';
  //         const tooltipColor = isLight ? '#3B3C45' : '#3B3C45';
  //         const backgroundColor = isLight ? '#FFFFFF' : '#1D1D21';
          
  //         widgetRef.current?.createPositionLine({
  //           direction,
  //           directionColor,
  //           profitLoss: `${direction} ${format(unrealizedPnl, 4)} (${profitRate}%)`,
  //           profitLossColor,
  //           price: +position.avgPrice,
  //           volume: `${total}`,
  //           tooltipColor,
  //           backgroundColor,
  //           closeTooltip: '市价平仓',
  //           reverseTooltip: '反手开仓',
  //           onReverseClick: () => {
  //             setPositionProcessing(true);
  //             setCurrentPosition(position);
  //           },
  //           onCloseClick: () => {
  //             orderRef.current?.onSubmit({
  //               symbolSwapId: position.symbolId,
  //               orderChoose: ChooseTypes.CLOSE,
  //               orderSide: isLong ? 'SELL' : 'BUY',
  //               priceType: PriceTypes.MARKET_PRICE,
  //               positionType: position.positionType,
  //               positionUnitType: PositionUnitTypes.CONT,
  //               quantity: position.total,
  //               cont: position.total,
  //               maxCont: position.total,
  //               leverage: position.leverage,
  //               hasTpsl: false,
  //               timeInForce: 'GTC',
  //               saveConfig: true
  //             });
  //           }
  //         });
  //       }
  //     });
  //   }
    
  //   return () => {
  //     if (widgetRef.current) {
  //       widgetRef.current.removeAllPositionLine();
  //     }
  //   };
  // }, [theme, isLogin, showPositionLine, positionList, symbolSwapId, contractMultiplier, coinUnitLen, positionUnitType]);


  // // 创建历史订单标记
  // useEffect(() => {
  //   if (widgetRef.current && showHistoryOrderMark && isLogin) {
  //     historyOrderList.forEach(order => {
  //       if (order.symbolId === symbolSwapId) {
  //         const total = volumeConversion(
  //           positionUnitType, contractMultiplier, +order.total, +order.price, coinUnitLen
  //         );
  //         const isBuy = /^BUY/i.test(order.side);
  //         const price = digits(order.price, DEPTH[minPricePrecision]);
  //         const color = isBuy ? Color.Green : Color.Red;
  //         const direction = isBuy ?  HistoryOrderMarkArrowDirection.Up : HistoryOrderMarkArrowDirection.Down;
  //         const tooltipColor = theme === 'light' ? '#3B3C45' : '#3B3C45';
  //         widgetRef.current?.createHistoryOrderMark({
  //           direction,
  //           tooltip: `${isBuy?'买入':'卖出'} ${total} @ ${price}`,
  //           color,
  //           tooltipColor,
  //           point: { timestamp: +order.updateTime }
  //         });
  //       }
  //     });
  //   }
  //   return () => {
  //     if (widgetRef.current) {
  //       widgetRef.current.removeAllHistoryOrderMark();
  //     }
  //   };
  // }, [historyOrderList, isLogin, showHistoryOrderMark, positionUnitType, contractMultiplier, coinUnitLen, symbolSwapId]);


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

  return (
    <div ref={rootEl} style={{ height: '100%', position: 'relative' }}>
      <div id={containerId} className={styles.klineChart}></div>
      {loading && <Loading/>}

      {/* 一键反手 */}
      {/* <ShortcutReverse
        positionInfo={currentPosition}
        isVisible={positionProcessing}
        closeFun={() => {
          setPositionProcessing(false);
        }}
      /> */}

      {/* 市价平仓 */}
      {/* <CreateOrder ref={orderRef as any} /> */}

      {/* {
        indicatorModalVisible &&
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
              widgetRef.current.createIndicator({ name: 'MA', type: IndicatorType.Main });
              widgetRef.current.createIndicator({ name: 'VOL', type: IndicatorType.Sub });
              setMainIndicators(['MA']);
              setSubIndicators(['VOL']);
            }
          }}
          onClose={() => { setIndicatorModalVisible(false); }}
        />
      } */}
    </div>
  );
};

const WrappedOriginalKLine = forwardRef(OriginalKLine);

export default memo(WrappedOriginalKLine);