'use client';

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
import { SUBSCRIBE_TYPES, useWs } from "@/core/network";
import { useParams } from "next/navigation";
import Loading from "@/components/Yloading";
import { Loading as YmexLading } from '@/components/loading';
import { message } from '@/core/utils';
import { LANG } from '@/core/i18n';
import { getLangFromLocalLang, getThemeFromLocalTheme } from "./utils";
import { createSymbolName, Color, ChartRef } from "../types";
import ExchangeChartContext from "../../context";
import IndicatorLimitModal from "../IndicatorLimitModal";
import { kChartEmitter } from "@/core/events";
import { Swap } from '@/core/shared';
import { useRouter } from 'next/router';
import * as Utils from '@/components/trade-ui/order-list/swap/components/modal/stop-profit-stop-loss-modal/utils';
import {
  LiquidationModal,
  ReverseConfirmModal
} from '@/components/trade-ui/order-list/swap/components/modal';
import { useResponsive, useTheme } from '@/core/hooks';

import { useModalProps, usePositionActions } from '@/components/order-list/swap/stores/position-list';


import {
  getSwapAssetsTransactionApi,
  getSwapGetPendingApi,
  getSwapHistoryDealApi,
  getSwapHistoryOrderApi,
} from '@/core/api';


import styles from "./index.module.scss";
import { cancelOrder } from "../OriginalKLine/cancelOrder";

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

  const {
    onVisibleLiquidationModal,
    liquidationModalProps,
    onCloseLiquidationModal,
    onVisibleReverseModal,
    reverseModalProps,
    onCloseReverseModal
  } = useModalProps();
  const { onReverse } = usePositionActions(); // 反向开仓


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
  const { isDark } = useTheme();
  const theme = isDark ? 'dark' : 'light'
  const isLogin = true
  //symbolSwapId



  const [tradingViewReady, setTradingViewReady] = useState(false);

  const [currentPosition, setCurrentPosition] = useState<any>({}); // 一键反手or平仓当前仓位信息
  const [positionProcessing, setPositionProcessing] = useState(false); //仓位处理

  const [loadType, setLoadType] = useState(LoadType.Init);
  const [modalVisible, setModalVisible] = useState(false);
  const YKlineRef = useRef<any>(null);
  // const symbol_info = symbolsMap.all[symbolSwapId] || {};
  // const { minPricePrecision } = symbol_info;

  const [positionList, setPositionList] = useState<string[]>([]); //当前持仓线数据
  let symbolSwapId = window.location.pathname.split('/').pop() || "btc-usdt";
  let indexToken = (window.location.pathname.split('/').pop() || "btc-usdt").toUpperCase();
  /*持仓 结束*/


  let positionUnitType = 2



  const code = symbolSwapId;
  const cryptoData = Swap.Info.getCryptoData(code);
  const { currentPricePrecision, pricePrecision, minChangePrice, settleCoin } = cryptoData;


  let coinUnitLen = pricePrecision?pricePrecision:2;
  const contractMultiplier = ''; //合约系数
  const max_digits = pricePrecision?pricePrecision:2;



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

 
    console.log("进入来了🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥")
    console.log("进入来了🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥",!widgetRef.current)
    console.log("ready",window?.TradingView?.widget )



    // if (!widgetRef.current && ready) {
    if (!widgetRef.current && (ready||window?.TradingView?.widget)) {

     

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
        theme: theme,

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
        // setTradingViewReady(false)
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
  }, [tradingViewReady, widgetRef, positionUnitType, kLinePriceType]);

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
  }, [indexToken, symbolSwapId,max_digits, kLineResolution]);

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
    const newTpSlList = data.flatMap((item: any) =>
      item.tpSlList.map((tpSl: any) => ({
        ...tpSl,
        orginalItem: item.orginalItem
      }))
    );
    setTpSlList(newTpSlList);

  });

  const router = useRouter();
  const isSwapLink = router.asPath.includes('swap'); // 使用 useRouter 获取路径信息


  const getleHistoryList = async () => {
    const params: any = {
      beginDate: '',
      endDate: '',
      page: 1,
      size: 100,
      subWallet: 'all',
    };
    const res = await getSwapHistoryDealApi(params, true);

    if (res && res.code == 200) {
      setHistoryOrderList(res?.data?.pageData)
    }
  }

  useEffect(() => {
    if(isSwapLink){
      getleHistoryList()
    }
  }, [isSwapLink]);

  const [tradingViewColor, setTradingViewColor] = useState({});

  useEffect(() => {
    // kChartEmitter.on(kChartEmitter.K_CHART_SWITCH_CHART_TYPE, val => {
    //   if (widgetRef.current) {
    //     widgetRef.current.chart().setChartType(val);
    //   }
    // });
    const handleColorSwitch = (data: any) => {
      setTradingViewColor(data);
    };
    kChartEmitter.on(kChartEmitter.K_CHART_SWITCH_COLOR, handleColorSwitch);
    return () => {
      kChartEmitter.off(kChartEmitter.K_CHART_SWITCH_COLOR, handleColorSwitch);
    };
  }, []);

  useEffect(() => {
    if (widgetRef.current && tradingViewColor?.upColor) {
      widgetRef.current.setColor(tradingViewColor);
    }
  }, [widgetRef.current, tradingViewColor]);

  // 重新加载 K 线数据的函数
  const reloadKLineData = () => {
    if (widgetRef.current && datafeedRef.current) {
      // setLoadType(LoadType.Loading);
      widgetRef.current.activeChart().resetData();

    }
  };



    // 监听页面可见性变化
    useEffect(() => {
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          console.log('页面可见，重新加载 K 线数据');
          reloadKLineData()
        }
      };
  
      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }, []);


  /** 持仓线模块开始 */
  useEffect(() => {
    if (widgetRef.current && showPositionLine) {
      const backgroundColor = theme === "light" ? "#FFFFFF" : "#1D1D21";
      let flag = true;
      positionList.forEach((position) => {
        if (position?.symbolId === symbolSwapId) {
          let unrealizedPnl = position?.unrealizedPnl;
          let profitRate = position?.profitRate;

          const isLong = position?.side === "1";
          const direction = isLong ? LANG('多') : LANG('空'); //持仓方向
          let total = position?.volume;
          const pnlBorderColor = unrealizedPnl >= 0 ? Color.Green : Color.Red;
          const positionColor = isLong ? Color.Green : Color.Red; //多/空
          const textColor = "#ffffff";
          const quantityBackgroundColor = isLong ? Color.Green : Color.Red;
          const bodyTextColor = unrealizedPnl >= 0 ? Color.Green : Color.Red;

          try {
            widgetRef.current?.createPositionLine({
              id: position?.id,
              text: `${direction} ${unrealizedPnl} (${profitRate}%)`,
              lineLength: 100 - (flag ? 40 : 0),
              lineStyle: 2,
              bodyTextColor: bodyTextColor,
              quantityTextColor: textColor,
              quantityBackgroundColor: quantityBackgroundColor,
              bodyBorderColor: pnlBorderColor,
              bodyBackgroundColor: '#fff',
              reverseButtonIconColor: positionColor,
              reverseButtonBorderColor: positionColor,
              lineColor: positionColor,
              quantityBorderColor: positionColor,
              closeButtonBorderColor: positionColor,
              closeButtonIconColor: positionColor,
              closeButtonBackgroundColor: '#ffff',
              reverseButtonBackgroundColor: '#ffff',
              // tooltip: '附加仓位信息'
              // protectTooltip: '保护仓位'
              closeTooltip: LANG('市价平仓'),
              bodyFont: "normal 14pt Verdana",
              quantityFont: "normal 14pt Verdana",
              reverseTooltip: LANG('反手'),
              quantityText: `${total}`,
              price: +position?.avgPrice,
              extendLeft: false,
              reverse: {
                data: "onReverse called",
                callback: () => {
                  onReverse(position?.orginalItem, ({ onConfirm }) => onVisibleReverseModal(position?.orginalItem, onConfirm));
                },
              },
              onClose: () => {
                onVisibleLiquidationModal(position?.orginalItem, false);
              },
              onMove: async (e) => {
                console.log("拖动api", e)
              }
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
  const [historyOrderList, setHistoryOrderList] = useState<any>([]); //历史成交数据
  useEffect(() => {
    if (widgetRef.current && showHistoryOrderMark) {
      historyOrderList.forEach((order) => {
        if (order.symbol === symbolSwapId) {
          const total = order?.dealVolume;
          const isBuy = /^1/i.test(order?.side);
          const price = order?.dealPrice;
          const directionColor = isBuy ? Color.Green : Color.Red;
          const direction = isBuy ? LANG('买入') : LANG('卖出');
          const directionName = isBuy ? LANG('买入') : LANG('卖出');

          try {
            widgetRef.current?.createHistoryOrderMark({
              id: order?.time,
              tooltip: `${directionName} ${total} @ ${price}`,
              arrowColor: directionColor,
              direction: direction,
              time: order.time / 1000,
              price: order.price,
            });
          } catch (error) {

          }

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
      const backgroundColor = '#FFFFFF';
      let flag = true;
      tpSlList?.forEach((position: any) => {
        const { triggerPrice, orginalItem } = position
        if (position.symbol === symbolSwapId) {
          let unrealizedPnl = position?.unrealizedPnl;
          const isLong = position?.side === "1";
          const isLongProfit = ((isLong && position?.direction != "1") || (!isLong && position?.direction == '1'))
          const pnlBorderColor = unrealizedPnl >= 0 ? Color.Green : Color.Red;
          const positionColor = isLongProfit ? Color.Green : Color.Red; //多/空
          const textColor = "#ffffff";
          const quantityBackgroundColor = isLongProfit ? Color.Green : Color.Red;
          const bodyTextColor = unrealizedPnl >= 0 ? Color.Green : Color.Red;
          let profitLoss = isLongProfit ? "TP" : "SL";
          let closeTooltip = isLongProfit ? LANG('取消止盈') : LANG('取消止损')


          let price = Number(triggerPrice)

          const code = orginalItem?.symbol?.toUpperCase();
          const isUsdtType = Swap?.Info?.getIsUsdtType(code);

          const _calculateIncome = ({
            shouldSet = true,
            profit,
            loss,
          }: {
            shouldSet?: boolean;
            profit?: boolean;
            loss?: boolean;
          }) => {

            if (price) {
              const value = Swap.Calculate.income({
                usdt: isUsdtType,
                code: orginalItem?.symbol?.toUpperCase(),
                isBuy: orginalItem?.side === '1',
                avgCostPrice: Number(orginalItem?.avgCostPrice),
                volume: Number(orginalItem?.availPosition),
                flagPrice: Number(price),
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
            income: isLongProfit ? Number(stopProfitIncome) : Number(stopLossIncome),
          }).toFixed(2)
          // let total = isLongProfit ? `预计止盈(${roe}%)` : `预计止损(${roe}%)`
          let total = isLongProfit ? `${LANG('预计止盈')}(${roe}%)` : `${LANG('预计止损')}(${roe}%)`
          try {
            widgetRef.current?.createPositionTPSLLine({
              id: position.orderId + position.triggerPrice,
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
              onClose: async () => {
                const incomeLoss = isLongProfit ? false : true
                cancelOrder(incomeLoss, position)
              },
              onMove: async (e) => {
                console.log("拖动api", e)
              }


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


  useEffect(() => {
    if (widgetRef.current && showLiquidationLine) {
      const backgroundColor = '#FFFFFF';
      let flag = true;
      positionList.forEach((position) => {
        if (position.symbolId === symbolSwapId) {
          let unrealizedPnl = position.unrealizedPnl;
          let profitRate = position?.profitRate;

          const isLong = position?.side === "1";
          const direction = isLong ? LANG('多') : LANG('空'); //持仓方向
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
              text: `多`,
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
              quantityText: LANG('预估强平价格'),
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
        widgetRef.current.removeAllLiquidationLine();
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


  const onTvInit=async ()=>{
    await setTradingViewReady(true);
  }

  return (
    <div className={styles.kline}>
      <Script
        src="/tradingView/charting_library/charting_library.standalone.js"
        // onReady={() => {
        //   onTvInit()
        // }}
        onLoad={() => {
          onTvInit()
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
      {/* 市价平仓 */}
      {liquidationModalProps.visible && (
        <LiquidationModal {...liquidationModalProps} onClose={onCloseLiquidationModal} />
      )}
      {/* 反手开仓 */}
      {reverseModalProps.visible && <ReverseConfirmModal {...reverseModalProps} onClose={onCloseReverseModal} />}
    </div>
  );
};

export default memo(forwardRef(TradingView));
