import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  ForwardRefRenderFunction,
  useImperativeHandle,
  forwardRef,
  memo,
} from "react";
import Script from "next/script";

import { ResolutionString } from "../../../../../public/tradingView/charting_library/charting_library";

import { WidgetApi } from "./Widget";

import Datefeed from "../Datafeed";

import { useSlugSymbol } from "@/hooks";
import { ConfigContext, ThemeContext } from "@/context";
import { SUBSCRIBE_TYPES, useWs } from "@/core/network";

import { digits, format } from "@/utils/index";
import { useFutureStore, usePositionStore } from "@/store";
import { useFutureOrderStore } from "@/store/future-order";
// import ShortcutReverse from '@/components/Position/ShortcutReverse';
import { UserContext } from "@/context";
import { useParams } from "next/navigation";
// import CreateOrder from '@/components/CreateOrder';
import Loading from "@/components/Yloading";
import { ChooseTypes, PositionUnitTypes, PriceTypes } from "@/utils/futures";
import { getLangFromLocalLang, getThemeFromLocalTheme } from "./utils";

import { DEPTH } from "@/constants";
import { createSymbolName, Color, ChartRef, volumeConversion } from "../types";
import ExchangeChartContext from "../../context";
// import { useKLineSource } from '../useKLineSource';
import { useKLineHistoryOrder } from "../useKLineHistoryOrder";
import IndicatorLimitModal from "../IndicatorLimitModal";
import { kChartEmitter } from "@/core/events";

import styles from "./index.module.scss";

enum LoadType {
  // 0: 表示初始化
  Init = 0,
  // 1: 表示初始化成功，在加载数据
  Loading = 1,
  // 2: 表示加载完成
  End = 2,
}

const TradingView: ForwardRefRenderFunction<ChartRef> = (props, ref) => {
  const widgetRef = useRef<WidgetApi>();
  const datafeedRef = useRef<Datefeed>();

  /* 市价平仓 - START */
  const orderRef = useRef<any>();

  const {
    kLineResolution,
    showPositionLine,
    showHistoryOrderMark,
    showLiquidationLine,
    showPositionTPSLLine,
    kLinePriceType,
  } = useContext(ExchangeChartContext);

  const { locale: locales } = useParams();

  const locale = Array.isArray(locales) ? locales[0] : locales;

  const { symbolsMap } = useContext(ConfigContext);

  // const { positionList } = usePositionStore();

  const { theme } = useContext(ThemeContext);
  const { isLogin } = useContext(UserContext);
  //symbolSwapId
  const { coinUnitLen, contractMultiplier, indexToken, max_digits } =
    useSlugSymbol();

  const [tradingViewReady, setTradingViewReady] = useState(false);

  const [currentPosition, setCurrentPosition] = useState<any>({}); // 一键反手or平仓当前仓位信息
  const [positionProcessing, setPositionProcessing] = useState(false); //仓位处理

  const [loadType, setLoadType] = useState(LoadType.Init);
  const [modalVisible, setModalVisible] = useState(false);
  const YKlineRef = useRef<any>(null);
  // const symbol_info = symbolsMap.all[symbolSwapId] || {};
  // const { minPricePrecision } = symbol_info;

  const [positionList, setPositionList] = useState<string[]>([]); //当前持仓线数据
  let symbolSwapId = "btc-usdt";

  /*持仓 结束*/
  const { unrealisedPnlPriceType } = useFutureStore();
  const { positionUnitType } = useFutureOrderStore();

  // useKLineSource({ symbolSwapId, kLineResolution, kLinePriceType, indexToken });

  useImperativeHandle(ref, () => {
    return {
      openSettingModal: () => {
        if (widgetRef.current) {
          widgetRef.current.chart().executeActionById("chartProperties");
        }
      },
      openIndicatorModal: () => {
        if (widgetRef.current) {
          widgetRef.current.chart().executeActionById("insertIndicator");
        }
      },
    };
  });

  const initWidget = (ready: boolean) => {
    if (!widgetRef.current && ready) {
      const symbol = createSymbolName(
        indexToken,
        symbolSwapId,
        max_digits,
        coinUnitLen,
        contractMultiplier
      );
      const datafeed = new Datefeed({
        priceType: kLinePriceType,
        volumeUnit: positionUnitType,
        getTimezone: () =>
          widgetRef.current?.activeChart().getTimezoneApi().getTimezone().id ??
          "Asia/Shanghai",
        brokenNotify: () => {
          datafeedRef.current?.cancel();
          // widgetRef.current?.activeChart().resetData();
          setLoadType(LoadType.Init);
          datafeedRef.current?.cancel();
          widgetRef.current?.remove();
          widgetRef.current = undefined;

          initWidget(ready);
        },
        onDataLoading: () => {
          setLoadType(LoadType.Loading);
        },
        onDataLoadEnd: () => {
          setLoadType(LoadType.End);
        },
      });
      datafeed.setPriceType(kLinePriceType);
      datafeed.setVolumeUnit(positionUnitType);
      datafeedRef.current = datafeed;
      YKlineRef.current = datafeed;
      const createWidget = require("./Widget").default;
      const chart = createWidget({
        symbol: symbol,
        // theme: getThemeFromLocalTheme(theme),
        theme: 'light',

        locale: getLangFromLocalLang(locale),
        interval: ((kLineResolution ?? "15") === "Time"
          ? "1"
          : kLineResolution) as ResolutionString,
        datafeed: datafeed,
        onIndicatorCountLimit: () => {
          setModalVisible(true);
        },
      });
      chart.onChartReady(() => {
        chart.activeChart().setChartType(kLineResolution === "Time" ? 3 : 1);
        widgetRef.current = chart;
      });
    }
  };

  useEffect(() => {
    initWidget(tradingViewReady);
    return () => {
      if (widgetRef.current) {
        setLoadType(LoadType.Init);
        datafeedRef.current?.cancel();
        widgetRef.current.remove();
        widgetRef.current = undefined;
      }
    };
  }, [tradingViewReady, positionUnitType, kLinePriceType]);

  useEffect(() => {
    // 切换当前币对
    if (widgetRef.current) {
      const symbol = createSymbolName(
        indexToken,
        symbolSwapId,
        max_digits,
        coinUnitLen,
        contractMultiplier
      );
      const isTimeLine = kLineResolution === "Time";
      widgetRef.current.activeChart().setChartType(isTimeLine ? 3 : 1);
      widgetRef.current.setSymbolResolution(
        symbol,
        (isTimeLine ? "1" : kLineResolution) as ResolutionString
      );
    }
    return () => {
      datafeedRef.current?.cancel();
    };
  }, [indexToken, symbolSwapId, kLineResolution]);

  useEffect(() => {
    if (widgetRef.current) {
      const widgetTheme = widgetRef.current.getTheme().toLowerCase();
      if (widgetTheme && theme !== widgetTheme) {
        widgetRef.current.changeTheme(getThemeFromLocalTheme(theme));
      }
    }
  }, [theme]);

  /*
   *  k线功能模块
   */
  kChartEmitter.on(kChartEmitter.K_CHART_POSITION_UPDATE, (data: any) => {
    // console.log("获取当前持仓",data)
    setPositionList(data);
    const newTpSlList = data.flatMap(item => item.tpSlList || []);
    setTpSlList(newTpSlList);

  });

  /** 持仓线模块开始 */
  useEffect(() => {
    if (widgetRef.current && showPositionLine) {
      const backgroundColor = theme === "light" ? "#FFFFFF" : "#1D1D21";
      let flag = true;
      positionList.forEach((position) => {
        if (position.symbolId === symbolSwapId) {
          let unrealizedPnl = position.unrealizedPnl;
          let profitRate = position?.profitRate;

          const isLong = position?.side === "1";
          const direction = isLong ? "LONG " : "SHORT "; //持仓方向
          let total = position.volume;
          const pnlBorderColor = unrealizedPnl >= 0 ? Color.Green : Color.Red;
          const positionColor = isLong ? Color.Green : Color.Red; //多/空
          const textColor = "#ffffff";
          const quantityBackgroundColor = isLong ? Color.Green : Color.Red;
          const bodyTextColor = unrealizedPnl >= 0 ? Color.Green : Color.Red;

          try {
            widgetRef.current?.createPositionLine({
              id: position.positionId,
              text: `${direction} ${format(unrealizedPnl, 4)} (${profitRate}%)`,
              lineLength: 100 - (flag ? 40 : 0),
              lineStyle: 2,
              bodyTextColor: bodyTextColor,
              quantityTextColor: textColor,
              quantityBackgroundColor: quantityBackgroundColor,
              bodyBorderColor: pnlBorderColor,
              bodyBackgroundColor: backgroundColor,
              reverseButtonIconColor: positionColor,
              reverseButtonBorderColor: positionColor,
              lineColor: positionColor,
              quantityBorderColor: positionColor,
              closeButtonBorderColor: positionColor,
              closeButtonIconColor: positionColor,
              closeButtonBackgroundColor: backgroundColor,
              reverseButtonBackgroundColor: backgroundColor,
              // tooltip: '附加仓位信息'
              // protectTooltip: '保护仓位'
              closeTooltip: "市价平仓",
              bodyFont: "normal 14pt Verdana",
              quantityFont: "normal 14pt Verdana",
              reverseTooltip: "反手开仓",
              quantityText: `${total}`,
              price: +position.avgPrice,
              extendLeft: false,
              reverse: {
                data: "onReverse called",
                callback: () => {
                  console.log("点击反手");
                },
              },
              onClose: () => {
                console.log("点击平仓");
              },
            });
            flag = false;
          } catch (error) { }
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
    theme,
    positionUnitType,
  ]);

  /******************* 历史标记-功能模块 START *******************/
  // 历史订单(普通委托和预估强平价)数据
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
      type: "2",
    },
  ]); //历史成交数据
  useEffect(() => {
    if (widgetRef.current && showHistoryOrderMark) {
      historyOrderList.forEach((order) => {
        if (order.symbol === symbolSwapId) {
          const total = order.dealVolume;
          const isBuy = /^BUY/i.test(order.side);
          const price = order?.dealPrice;
          const directionColor = isBuy ? Color.Green : Color.Red;
          const direction = isBuy ? "buy" : "sell";
          const directionName = isBuy ? "买入" : "卖出";

          widgetRef.current?.createHistoryOrderMark({
            id: order.time,
            tooltip: `${directionName} ${total} @ ${price}`,
            arrowColor: directionColor,
            direction: direction,
            time: order.time / 1000,
            price: order.price,
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
    symbolSwapId,
  ]);

  /******************* 历史标记-功能模块 END *******************/

  /******************* 止盈止损-功能模块 START *******************/
  const [tpSlList, setTpSlList] = useState<any>([]); //止盈止损列表数据

  useEffect(() => {
    if (widgetRef.current && showPositionTPSLLine) {
      const backgroundColor = theme === "light" ? "#FFFFFF" : "#1D1D21";
      let flag = true;

      tpSlList?.forEach((position) => {
        if (position.symbol === symbolSwapId) {
          console.log("tpSlList获取止盈止损",position)
          let unrealizedPnl = position.unrealizedPnl;
          const isLong = position?.side === "1";
          const pnlBorderColor = unrealizedPnl >= 0 ? Color.Green : Color.Red;
          const positionColor = isLong ? Color.Green : Color.Red; //多/空
          const textColor = "#ffffff";
          const quantityBackgroundColor = isLong ? Color.Green : Color.Red;
          const bodyTextColor = unrealizedPnl >= 0 ? Color.Green : Color.Red;
          let profitLoss = position?.direction === "1" ? "止盈" : "止损";
          let total =
            position?.direction === "1" ? "预计止盈(---)" : "预计止损(---)";
          let closeTooltip =
            position?.direction === "1" ? "取消止盈" : "取消止损";
          try {
            widgetRef.current?.createPositionTPSLLine({
              id: position.orderId+position.triggerPrice,
              text: profitLoss,
              lineLength: 100 - (flag ? 40 : 0),
              lineStyle: 2,
              bodyTextColor: bodyTextColor,
              quantityTextColor: textColor,
              quantityBackgroundColor: quantityBackgroundColor,
              bodyBorderColor: pnlBorderColor,
              bodyBackgroundColor: backgroundColor,
              reverseButtonIconColor: positionColor,
              reverseButtonBorderColor: positionColor,
              lineColor: positionColor,
              quantityBorderColor: positionColor,
              closeButtonBorderColor: positionColor,
              closeButtonIconColor: positionColor,
              closeButtonBackgroundColor: backgroundColor,
              reverseButtonBackgroundColor: backgroundColor,
              // tooltip: '附加仓位信息'
              // protectTooltip: '保护仓位'
              closeTooltip: closeTooltip,
              bodyFont: "normal 14pt Verdana",
              quantityFont: "normal 14pt Verdana",
              quantityText: `${total}`,
              price: position.triggerPrice,
              extendLeft: false,
              onClose: () => {
                console.log("点击止盈或者止损");
              },
            });
            flag = false;
          } catch (error) { }
        }
      });
    }

    return () => {
      if (widgetRef.current) {
        widgetRef.current.removeAllPositionTPSLLine();
      }
    };
  }, [
    theme,
    isLogin,
    showPositionTPSLLine,
    positionList,
    symbolSwapId,
    contractMultiplier,
    coinUnitLen,
    theme,
    positionUnitType,
  ]);
  /******************* 止盈止损-功能模块 end *******************/




  /******************* 爆仓线-功能模块 START *******************/

  console.log("showLiquidationLine",showLiquidationLine)

  useEffect(() => {
    if (widgetRef.current && showLiquidationLine) {
      const backgroundColor = theme === "light" ? "#FFFFFF" : "#1D1D21";
      let flag = true;
      positionList.forEach((position) => {
        if (position.symbolId === symbolSwapId) {
          let unrealizedPnl = position.unrealizedPnl;
          let profitRate = position?.profitRate;

          const isLong = position?.side === "1";
          const direction = isLong ? "LONG " : "SHORT "; //持仓方向
          let total = position.volume;
          const pnlBorderColor = '#f07f1a';
          const positionColor = '#f07f1a'; //多/空
          const textColor = "#ffffff";
          const quantityBackgroundColor = '#f07f1a';
          const bodyTextColor = '#f07f1a';

          try {
            widgetRef.current?.createLiquidationLine({
              // id:`${position.positionId}-${position.liquidationPrice}`,
              id: position.id,
              text: `预估强平价`,
              lineLength: 100,
              lineStyle: 2,
              bodyTextColor: bodyTextColor,
              quantityTextColor: textColor,
              quantityBackgroundColor: quantityBackgroundColor,
              bodyBorderColor: pnlBorderColor,
              bodyBackgroundColor: backgroundColor,
              reverseButtonIconColor: positionColor,
              reverseButtonBorderColor: positionColor,
              lineColor: positionColor,
              quantityBorderColor: positionColor,
              closeButtonBorderColor: positionColor,
              closeButtonIconColor: positionColor,
              closeButtonBackgroundColor: backgroundColor,
              reverseButtonBackgroundColor: backgroundColor,
              bodyFont: "normal 14pt Verdana",
              quantityFont: "normal 14pt Verdana",
              quantityText: `${direction}`,
              price: +position.liquidationPrice,
              extendLeft: false,

            });
            flag = false;
          } catch (error) { }
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
    positionList,
    symbolSwapId,
    contractMultiplier,
    coinUnitLen,
    theme,
    positionUnitType,
    showLiquidationLine
  ]);





  useWs(SUBSCRIBE_TYPES.ws4001, (data) =>
    YKlineRef.current?.updateData?.(data)
  );

  return (
    <div className={styles.kline}>
      <Script
        src="/tradingView/charting_library/charting_library.standalone.js"
        onReady={() => {
          setTradingViewReady(true);
        }}
      />
      <div id="tv_chart_container" className={styles.TVChartContainer}></div>
      {loadType !== LoadType.End && (
        <Loading
          className={loadType === LoadType.Init ? styles.tvLoading : ""}
        />
      )}
      {modalVisible && (
        <IndicatorLimitModal
          onClose={() => {
            setModalVisible(false);
          }}
        />
      )}
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
    </div>
  );
};

export default memo(forwardRef(TradingView));
