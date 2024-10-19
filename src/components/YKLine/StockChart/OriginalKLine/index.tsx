import {
  useEffect,
  useRef,
  useContext,
  ForwardRefRenderFunction,
  forwardRef,
  useImperativeHandle,
  useState,
  memo,
} from "react";

import { CandleType, registerLocale } from "klinecharts";

import { useSize } from "ahooks";

import Loading from "@/components/Yloading";

import { useSlugSymbol } from "@/hooks";

import { useFutureOrderStore } from "@/store/future-order";

import { ThemeContext, ConfigContext, UserContext } from "@/context";

import Widget, { IndicatorType } from "./Widget";

import Datafeed from "../Datafeed";
import { DEPTH } from "@/constants";
import { ChartRef, createSymbolName } from "../types";
import ExchangeChartContext from "../../context";
// import { useKLineSource } from '../useKLineSource';
import { useKLineHistoryOrder } from "../useKLineHistoryOrder";
import { useFutureStore, usePositionStore } from "@/store";
import { SUBSCRIBE_TYPES, useWs } from "@/core/network";
import { kChartEmitter } from "@/core/events";

import { ChooseTypes, PositionUnitTypes, PriceTypes } from "@/utils/futures";

import { digits, format } from "@/utils/index";

import { Color, volumeConversion } from "../types";

import { HistoryOrderMarkArrowDirection } from "./extension/historyOrderMark";

import IndicatorModal, { IndicatorOperateType } from "./indicator-modal";

import styles from "./index.module.scss";

const intlPrefix = "system.common.klinechart.";

const OriginalKLine: ForwardRefRenderFunction<
  ChartRef,
  { containerId?: string }
> = (props, ref) => {
  const rootEl = useRef<HTMLDivElement>(null);
  const size = useSize(rootEl.current);

  const widgetRef = useRef<Widget>();

  const datafeedRef = useRef<Datafeed>();

  const orderRef = useRef<any>();
  let containerId = "bv_kline_chart";

  const {
    originalKLineStyle,
    kLineResolution,
    showPositionLine,
    showHistoryOrderMark,
    kLinePriceType,
  } = useContext(ExchangeChartContext);

  const { theme } = useContext(ThemeContext);
  //symbolSwapId 下面内容
  const { indexToken, coinUnitLen, max_digits, contractMultiplier } =
    useSlugSymbol();

  const { unrealisedPnlPriceType } = useFutureStore();

  // 仓位单位
  const { positionUnitType } = useFutureOrderStore();

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

  const [positionList, setPositionList] = useState<any>([]); //当前持仓线数据
  const [historyOrderList, setHistoryOrderList] = useState<any>([
    {
      dealPrice: "68318.5",
      dealVolume: 475,
      entrustId: "9125134864863549214",
      execType: "1",
      fee: "19.47077250",
      id: "1847547644196147200",
      liqPrice: null,
      marginType: 1,
      priceScale: "1",
      scale: "6",
      side: "1",
      symbol: "btc-usdt",
      time: 1729324659000,
      tradePnl: "-0.09500000",
      type: "2"
    },
  ]); //历史成交数据

  let symbolSwapId = "btc-usdt";

  const YKlineRef = useRef<any>(null);

  // const symbol_info = symbolsMap.all[symbolSwapId] || {};
  // const { minPricePrecision } = symbol_info;

  // useKLineSource({ symbolSwapId, kLineResolution, kLinePriceType, indexToken });

  useImperativeHandle(
    ref,
    () => ({
      openIndicatorModal: () => {
        setIndicatorModalVisible(true);
      },
      openSettingModal: () => {},
    }),
    []
  );

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
      const isTimeLine = kLineResolution === "Time";
      const { symbol: ticker, interval } = widgetRef.current.symbolInterval();
      if (ticker !== indexToken || interval !== kLineResolution) {
        reloadData = true;
      }
      if (reloadData || resetData) {
        datafeedRef.current?.cancel();
      }
      if (reloadData) {
        const symbol = createSymbolName(
          indexToken,
          symbolSwapId,
          max_digits,
          coinUnitLen,
          contractMultiplier
        );
        widgetRef.current.setSymbol(symbol, isTimeLine ? "1" : kLineResolution);
      }
      if (!reloadData && resetData) {
        widgetRef.current.resetData();
      }
    }
    return () => {
      datafeedRef.current?.cancel();
    };
  }, [
    indexToken,
    symbolSwapId,
    kLineResolution,
    positionUnitType,
    kLinePriceType,
  ]);

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

      const isTimeLine = kLineResolution === "Time";
      const { symbol: ticker, interval } = widgetRef.current.symbolInterval();
      if (ticker !== indexToken || interval !== kLineResolution) {
        reloadData = true;
      }
      if (reloadData) {
        const symbol = createSymbolName(
          indexToken,
          symbolSwapId,
          max_digits,
          coinUnitLen,
          contractMultiplier
        );
        widgetRef.current.setSymbol(symbol, isTimeLine ? "1" : kLineResolution);
      }
      if (!reloadData && resetData) {
        widgetRef.current.resetData();
      }
    }
    return () => {
      datafeedRef.current?.cancel();
    };
  }, [
    indexToken,
    symbolSwapId,
    kLineResolution,
    positionUnitType,
    kLinePriceType,
  ]);

  useEffect(() => {
    if (widgetRef.current) {
      widgetRef.current.setChartType(
        kLineResolution === "Time" ? CandleType.Area : originalKLineStyle
      );
    }
  }, [originalKLineStyle, kLineResolution]);

  useEffect(() => {
    const locale = localStorage.getItem("lang") || "en-US";
    const locales = {
      time: "时间：",
      open: "开：",
      high: "高：",
      low: "低：",
      close: "收：",
      volume: "成交量：",
      turnover: "--",
      change: "涨幅：",
      amplitude: "振幅：",
    };
    registerLocale(locale, locales);
    const datafeed = new Datafeed({
      priceType: kLinePriceType,
      volumeUnit: positionUnitType,
      getTimezone: () =>
        widgetRef.current?.chart()?.getTimezone() ?? "Asia/Shanghai",
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
    YKlineRef.current = datafeed;
    datafeedRef.current = datafeed;
    widgetRef.current = new Widget({
      container: containerId,
      symbol: createSymbolName(
        indexToken,
        symbolSwapId,
        max_digits,
        coinUnitLen,
        contractMultiplier
      ),
      theme,
      locale,
      interval: kLineResolution === "Time" ? "1" : kLineResolution,
      datafeed: datafeed,
    });
    widgetRef.current.setChartType(
      kLineResolution === "Time" ? CandleType.Area : originalKLineStyle
    );
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
        indicators.forEach((indicator) => {
          if (indicator.type === IndicatorType.Main) {
            mainIndicators.push(indicator.name);
          } else {
            subIndicators.push(indicator.name);
          }
          widgetRef.current?.createIndicator(indicator);
        });
      } else {
        widgetRef.current?.createIndicator({
          name: "MA",
          type: IndicatorType.Main,
        });
        widgetRef.current?.createIndicator({
          name: "VOL",
          type: IndicatorType.Sub,
        });
        mainIndicators = ["MA"];
        subIndicators = ["VOL"];
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

  useWs(SUBSCRIBE_TYPES.ws4001, (data) =>
    YKlineRef.current?.updateData?.(data)
  );

  kChartEmitter.on(kChartEmitter.K_CHART_POSITION_UPDATE, (data: any) => {
    // console.log("获取当前持仓",data)
    setPositionList(data);
    // chart.current?.setPositionOrder(data);
  });

  // 绘制持仓线
  useEffect(() => {
    if (widgetRef.current && showPositionLine) {
      positionList.forEach((position) => {
        if (position?.symbolId === symbolSwapId) {
          let unrealizedPnl = position.unrealizedPnl;
          const isLong = position?.side === "1";
          const direction = isLong ? "LONG " : "SHORT "; //持仓方向
          let total = position.volume;
          const profitLossColor = unrealizedPnl >= 0 ? Color.Green : Color.Red;
          const directionColor = isLong ? Color.Green : Color.Red; //多/空
          const isLight = theme === "light";
          const tooltipColor = isLight ? "#3B3C45" : "#3B3C45";
          const backgroundColor = isLight ? "#FFFFFF" : "#1D1D21";
          widgetRef.current?.createPositionLine({
            direction,
            directionColor,
            profitLoss: `${direction} ${format(unrealizedPnl, 4)} (${
              position?.profitRate
            }%)`,
            profitLossColor,
            price: +position?.avgPrice,
            volume: `${total}`,
            tooltipColor,
            backgroundColor,
            closeTooltip: "市价平仓",
            reverseTooltip: "反手开仓",
            onReverseClick: () => {
              console.log("点击反手开仓");
            },
            onCloseClick: () => {
              console.log("点击平仓");
            },
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
    positionUnitType,
  ]);

  // // 创建历史订单标记
  useEffect(() => {
    if (widgetRef.current && showHistoryOrderMark) {
  
      historyOrderList.forEach(order => {

        if (order.symbol === symbolSwapId) {

          const total = order.dealVolume
          const isBuy = /^BUY/i.test(order.side);
          const price=order?.dealPrice
          const color = isBuy ? Color.Green : Color.Red;
          const direction = isBuy ?  HistoryOrderMarkArrowDirection.Up : HistoryOrderMarkArrowDirection.Down;
          const tooltipColor = theme === 'light' ? '#3B3C45' : '#3B3C45';
          widgetRef.current?.createHistoryOrderMark({
            direction,
            tooltip: `${(isBuy ? '买入' : '卖出')} ${total} @ ${price}`,
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
  }, [historyOrderList, isLogin, showHistoryOrderMark, positionUnitType, contractMultiplier, coinUnitLen, symbolSwapId]);

  const operateIndicator = (
    name: string,
    operateType: IndicatorOperateType,
    indicatorType: IndicatorType
  ) => {
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
      const index = indicators.findIndex((item) => item === name);
      if (index > -1) {
        indicators.splice(index, 1);
      }
    }
    operate(indicators);
  };

  return (
    <div ref={rootEl} style={{ height: "100%", position: "relative" }}>
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
                name: "MA",
                type: IndicatorType.Main,
              });
              widgetRef.current.createIndicator({
                name: "VOL",
                type: IndicatorType.Sub,
              });
              setMainIndicators(["MA"]);
              setSubIndicators(["VOL"]);
            }
          }}
          onClose={() => {
            setIndicatorModalVisible(false);
          }}
        />
      )}
    </div>
  );
};

export default memo(forwardRef(OriginalKLine));
