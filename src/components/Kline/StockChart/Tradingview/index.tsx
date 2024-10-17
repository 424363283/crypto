import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  ForwardRefRenderFunction,
  useImperativeHandle,
  forwardRef,
  memo
} from 'react';
import Script from 'next/script';

import { ResolutionString } from '../../../../../public/tradingView/charting_library/charting_library';

import { WidgetApi } from './Widget';

import Datefeed from '../Datafeed';

// import { useSlugSymbol } from '@/hooks';
import { ConfigContext, ThemeContext } from '@/context';

// import { useIntlMsg } from '@/hooks/use-intl-msg';

import {  format } from '@/utils/index';
// import { useFutureStore, usePositionStore } from '@/store';
// import { useFutureOrderStore } from '@/store/future-order';
// import ShortcutReverse from '@/components/Position/ShortcutReverse';
import { UserContext } from '@/context';
import { useParams } from 'next/navigation';
// import CreateOrder from '@/components/CreateOrder';
import  Loading  from '@/components/Yloading';
// import { ChooseTypes, PositionUnitTypes, PriceTypes } from '@/utils/futures';
import { getLangFromLocalLang, getThemeFromLocalTheme } from './utils';

// import { DEPTH } from '@/constants';
import { createSymbolName, Color, ChartRef, volumeConversion } from '../types';
import ExchangeChartContext from '../../context';
import { useKLineSource } from '../useKLineSource';
import { useKLineHistoryOrder } from '../useKLineHistoryOrder';
import IndicatorLimitModal from '../IndicatorLimitModal';

import styles from './index.module.scss';

/**
 * 开平仓类型
 * 开仓 OPEN 0
 * 平仓 CLOSE 1
 */
export enum ChooseTypes {
  OPEN = 0,
  CLOSE
}

/**
 * 下单类型
 *
 *  INPUT 限价
 *
 *  MARKET_PRICE 市价
 *
 *  PLAN 计划委托
 *
 *  MAKER 只做Maker
 *
 */
export enum PriceTypes {
  INPUT,
  MARKET_PRICE,
  PLAN,
  MAKER
}
enum LoadType {
  // 0: 表示初始化
  Init = 0,
  // 1: 表示初始化成功，在加载数据
  Loading = 1,
  // 2: 表示加载完成
  End = 2
}

const TradingView: ForwardRefRenderFunction<any> = (props, ref) => {
  const widgetRef = useRef<WidgetApi>();
  const datafeedRef = useRef<Datefeed>();

  /* 市价平仓 - START */
  const orderRef = useRef<any>();

  // const { intl } = props;

  const { kLineResolution, showPositionLine, showHistoryOrderMark, kLinePriceType } = useContext(ExchangeChartContext);

  const { locale: locales } = useParams();

  const locale = Array.isArray(locales) ? locales[0] : locales;
  // const intlMsg = useIntlMsg(intl);

  const { symbolsMap } = useContext(ConfigContext);

  // const { positionList } = usePositionStore();

  const { isLogin } = useContext(UserContext);

  // const { coinUnitLen, contractMultiplier, symbolSwapId, indexToken, max_digits } = useSlugSymbol();

  const [tradingViewReady, setTradingViewReady] = useState(false);

  const [currentPosition, setCurrentPosition] = useState<any>({}); // 一键反手or平仓当前仓位信息
  const [positionProcessing, setPositionProcessing] = useState(false); //仓位处理

  const [loadType, setLoadType] = useState(LoadType.Init);
  const [modalVisible, setModalVisible] = useState(false);

  // const symbol_info = symbolsMap.all[symbolSwapId] || {};
  // const { minPricePrecision } = symbol_info;

  /*持仓 结束*/
  // const { unrealisedPnlPriceType } = useFutureStore();
  // const { positionUnitType } = useFutureOrderStore();

  // useKLineSource({ symbolSwapId, kLineResolution, kLinePriceType, indexToken });
  const symbolSwapId = 'BTC-SWAP-USDT'; //当前交易对
  const indexToken ='BTCUSDT'; //当前交易对
  const max_digits =8 
  const theme = 'drak';
  const positionUnitType = 2; //张币u 单位
  const coinUnitLen=2
  let contractMultiplier=0



  useImperativeHandle(ref, () => {
    return {
      openSettingModal: () => {
        if (widgetRef.current) {
          widgetRef.current.chart().executeActionById('chartProperties');
        }
      },
      openIndicatorModal: () => {
        if (widgetRef.current) {
          widgetRef.current.chart().executeActionById('insertIndicator');
        }
      }
    };
  });

  const initWidget = (ready: boolean) => {
    if (!widgetRef.current && ready) {
      const symbol = createSymbolName(indexToken, symbolSwapId, max_digits, coinUnitLen, contractMultiplier);
      const datafeed = new Datefeed({
        priceType: kLinePriceType,
        volumeUnit: positionUnitType,
        getTimezone: () => widgetRef.current?.activeChart().getTimezoneApi().getTimezone().id ?? 'Asia/Shanghai',
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
        }
      });
      datafeed.setPriceType(kLinePriceType);
      datafeed.setVolumeUnit(positionUnitType);
      datafeedRef.current = datafeed;
      const createWidget = require('./Widget').default;
      const chart = createWidget({
        symbol: symbol,
        theme: getThemeFromLocalTheme(theme),
        locale: getLangFromLocalLang(locale),
        interval: ((kLineResolution ?? '15') === 'Time' ? '1' : kLineResolution) as ResolutionString,
        datafeed: datafeed,
        onIndicatorCountLimit: () => {
          setModalVisible(true);
        }
      });
      chart.onChartReady(() => {
        chart.activeChart().setChartType(kLineResolution === 'Time' ? 3 : 1);
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
      const symbol = createSymbolName(indexToken, symbolSwapId, max_digits, coinUnitLen, contractMultiplier);
      const isTimeLine = kLineResolution === 'Time';
      widgetRef.current.activeChart().setChartType(isTimeLine ? 3 : 1);
      widgetRef.current.setSymbolResolution(symbol, (isTimeLine ? '1' : kLineResolution) as ResolutionString);
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
  /** 持仓线模块开始 */
  // useEffect(() => {
  //   if (widgetRef.current && isLogin && showPositionLine) {
  //     const backgroundColor = theme === 'light' ? '#FFFFFF' : '#1D1D21';
  //     let flag = true;
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
  //         const pnlBorderColor = unrealizedPnl >= 0 ? Color.Green : Color.Red;
  //         const positionColor = isLong ? Color.Green : Color.Red; //多/空
  //         const textColor = '#ffffff';
  //         const quantityBackgroundColor = isLong ? Color.Green : Color.Red;
  //         const bodyTextColor = unrealizedPnl >= 0 ? Color.Green : Color.Red;

  //         try {
  //           widgetRef.current?.createPositionLine({
  //             id: position.createdAt,
  //             reverse: {
  //               data: 'onReverse called',
  //               callback: () => {
  //                 setPositionProcessing(true);
  //                 setCurrentPosition(position);
  //               }
  //             },
  //             text: `${direction} ${format(unrealizedPnl, 4)} (${profitRate}%)`,
  //             lineLength: 100 - (flag ? 40 : 0),
  //             lineStyle: 2,
  //             bodyTextColor: bodyTextColor,
  //             quantityTextColor: textColor,
  //             quantityBackgroundColor: quantityBackgroundColor,
  //             bodyBorderColor: pnlBorderColor,
  //             bodyBackgroundColor: backgroundColor,
  //             reverseButtonIconColor: positionColor,
  //             reverseButtonBorderColor: positionColor,
  //             lineColor: positionColor,
  //             quantityBorderColor: positionColor,
  //             closeButtonBorderColor: positionColor,
  //             closeButtonIconColor: positionColor,
  //             closeButtonBackgroundColor: backgroundColor,
  //             reverseButtonBackgroundColor: backgroundColor,
  //             // tooltip: '附加仓位信息'
  //             // protectTooltip: '保护仓位'
  //             closeTooltip: '市价平仓',
  //             bodyFont: 'normal 14pt Verdana',
  //             quantityFont: 'normal 14pt Verdana',
  //             reverseTooltip: '反手开仓',
  //             quantityText: `${total}`,
  //             price: +position.avgPrice,
  //             extendLeft: false,
  //             onClose: () => {
  //               orderRef.current?.onSubmit({
  //                 symbolSwapId: position.symbolId,
  //                 orderChoose: ChooseTypes.CLOSE,
  //                 orderSide: isLong ? 'SELL' : 'BUY',
  //                 priceType: PriceTypes.MARKET_PRICE,
  //                 positionType: position.positionType,
  //                 positionUnitType: PositionUnitTypes.CONT,
  //                 quantity: position.total,
  //                 cont: position.total,
  //                 maxCont: position.total,
  //                 leverage: position.leverage,
  //                 hasTpsl: false,
  //                 timeInForce: 'GTC',
  //                 saveConfig: true
  //               });
  //             }
  //           });
  //           flag = false;
  //         } catch (error) {}
  //       }
  //     });
  //   }

  //   return () => {
  //     if (widgetRef.current) {
  //       widgetRef.current.removeAllPositionLine();
  //     }
  //   };
  // }, [
  //   theme,
  //   isLogin,
  //   showPositionLine,
  //   positionList,
  //   symbolSwapId,
  //   contractMultiplier,
  //   coinUnitLen,
  //   theme,
  //   positionUnitType
  // ]);

  /******************* 历史标记-功能模块 START *******************/
  // 历史订单(普通委托和预估强平价)数据
  // const historyOrderList = useKLineHistoryOrder();
  // useEffect(() => {
  //   if (widgetRef.current && showHistoryOrderMark && isLogin) {
  //     historyOrderList.forEach(order => {
  //       if (order.symbolId === symbolSwapId) {
  //         const total = volumeConversion(positionUnitType, contractMultiplier, +order.total, +order.price, coinUnitLen);

  //         const isBuy = /^BUY/i.test(order.side);
  //         const price = digits(order.price, DEPTH[minPricePrecision]);
  //         const directionColor = isBuy ? Color.Green : Color.Red;
  //         const direction = isBuy ? 'buy' : 'sell';
  //         const directionName = isBuy ? '买入' : '卖出';

  //         widgetRef.current?.createHistoryOrderMark({
  //           id: order.time,
  //           tooltip: `${directionName} ${total} @ ${price}`,
  //           arrowColor: directionColor,
  //           direction: direction,
  //           time: order.updateTime / 1000,
  //           price: order.price
  //         });
  //       }
  //     });
  //   }
  //   return () => {
  //     if (widgetRef.current) {
  //       widgetRef.current.removeAllHistoryOrderMark();
  //     }
  //   };
  // }, [
  //   historyOrderList,
  //   isLogin,
  //   showHistoryOrderMark,
  //   positionUnitType,
  //   contractMultiplier,
  //   coinUnitLen,
  //   symbolSwapId
  // ]);

  /******************* 历史标记-功能模块 END *******************/

  return (
    <div className={styles.kline}>
      <Script
        src="/tradingView/charting_library/charting_library.standalone.js"
        onReady={() => {
          setTradingViewReady(true);
        }}
      />
      <div id="tv_chart_container" className={styles.TVChartContainer}></div>
      {loadType !== LoadType.End && <Loading className={loadType === LoadType.Init ? styles.tvLoading : ''} />}
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
