import { Loading } from '@/components/loading';
import { AlertFunction } from '@/components/modal';
import { kChartEmitter } from '@/core/events';
import { LANG } from '@/core/i18n';
import { SUBSCRIBE_TYPES, useWs } from '@/core/network';
import { DetailMap, MarkteDetail } from '@/core/shared';
import { LOCAL_KEY, THEME, localStorageApi } from '@/core/store';
import { MediaInfo } from '@/core/utils';
import Image from 'next/image';
import { memo, useEffect, useRef } from 'react';
import { ResolutionType } from '../../components/k-header/resolution/config';
import { Kline } from './chart';
import { ChartSetting, MyKlineData } from './types';
const KlineChartUI = ({
  id,
  theme,
  resolution,
  vol,
  swapIndex,
  qty = 0,
  elementId = 'k-line-chart',
  holc,
  showCrosshairOrderBtn,
  isReverse,
  showOrdebok,
  showPriceLine = true,
  showCountdown = false,
  showOrderMarking = false,
}: {
  id: string;
  theme: string;
  resolution: ResolutionType;
  vol?: boolean;
  swapIndex?: boolean;
  qty?: number;
  elementId?: string;
  holc?: boolean;
  showCrosshairOrderBtn?: boolean;
  isReverse?: boolean;
  showOrdebok?: boolean;
  showPriceLine?: boolean;
  showCountdown?: boolean;
  showOrderMarking?: boolean;
}) => {
  const chart = useRef<Kline | null>(null);
  const ref = useRef<boolean>(true);
  const klineData = useRef<MyKlineData>({
    data: {} as DetailMap,
    orderBook: {},
  });
  // 初始化
  useEffect(() => {
    if (!chart.current && id && resolution && ref.current) {
      ref.current = false;
      MarkteDetail.getGroupList().then((tradeList) => {
        chart.current = new Kline({
          id,
          elementId: elementId + qty,
          resolution: resolution,
          theme,
          vol,
          tradeList,
          swapIndex,
          'candle.tooltip.showRule': holc ? (MediaInfo.isMobileOrTablet ? 'follow_cross' : 'always') : 'none',
          'candle.tooltip.showType': MediaInfo.isMobileOrTablet ? 'rect' : 'standard',
          showCrosshairOrderBtn,
          isReverse,
          showOrdebok,
          showPriceLine,
          showCountdown,
          showOrderMarking,
        });
        // console.log('基础班初始化');
        kChartEmitter.on(kChartEmitter.K_CHART_SCREENSHOT + qty, () => {
          Loading.start();

          const open = (base64: string) =>
            AlertFunction({
              hideHeaderIcon: true,
              theme: localStorageApi.getItem(LOCAL_KEY.THEME) as THEME,
              className: 'save-picture-modal',
              children: (
                <div>
                  <div style={{ color: 'var(--theme-font-color-1)', textAlign: 'left' }}>{LANG('截图保存')}</div>
                  <br />
                  <Image
                    src={base64}
                    alt='K_CHART_SCREENSHOT'
                    width='100'
                    height='100'
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>
              ),
              onOk: () => {
                const a = document.createElement('a');
                a.href = base64;
                a.download = 'kline.png';
                a.click();
              },
            });

          import('html2canvas').then((html2canvas) => {
            html2canvas
              .default(document.getElementById(elementId + qty) as HTMLElement)
              .then(function (canvas) {
                // console.log(canvas);
                const base64 = canvas.toDataURL('image/png');
                open(base64);
              })
              .catch((err) => {
                const base64 = chart.current?.screenshot();
                if (base64) open(base64);
              })
              .finally(() => {
                Loading.end();
              });
          });
        });
        kChartEmitter.on(kChartEmitter.K_CHART_SWITCH_COLOR, (data: any) => {
          chart.current?.setColor(data['up-color-rgb'], data['down-color-rgb']);
        });
        kChartEmitter.on(kChartEmitter.K_CHART_POSITION_UPDATE, (data: any) => {
          chart.current?.setPositionOrder(data);
        });
        kChartEmitter.on(kChartEmitter.K_CHART_JUMP_DATE, (timestamp: number, animationDuration: number) => {
          chart.current?.getKlineHistory(
            '',
            Date.now(),
            true,
            () => {
              chart.current?.scrollToTimestamp(timestamp, animationDuration);
            },
            undefined,
            Math.floor(timestamp / 1000)
          );
        });
        kChartEmitter.on(kChartEmitter.K_CHART_SET_THEME, (theme: THEME) => {
          chart.current?.setTheme(theme);
        });
        kChartEmitter.on(kChartEmitter.K_CHART_POSITION_VISIBLE, (visible: boolean) => {
          chart.current?.setPositionOrderVisible(visible);
        });
        kChartEmitter.on(kChartEmitter.K_CHART_COMMISSION_VISIBLE, (visible: boolean) => {
          chart.current?.setCommissionOrderVisible(visible);
        });
        kChartEmitter.on(kChartEmitter.K_CHART_COMMISSION_UPDATE, (data: any) => {
          chart.current?.setCommissionOrder(data);
        });
        kChartEmitter.on(kChartEmitter.K_CHART_SET_ORDER_MARKING_DATA, (data: any) => {
          chart.current?.setLOrderMarkingData(data);
        });
        kChartEmitter.on(kChartEmitter.K_CHART_REFETCH_ORDER_MARKING_DATA, () => {
          chart.current?.getTradeHistory();
        });
        kChartEmitter.on(kChartEmitter.K_CHART_UPDATE_SETTING, (setting: ChartSetting) => {
          chart.current?.updateChartSetting(setting);
        });
        kChartEmitter.emit(kChartEmitter.K_CHART_INIT_FINISHED);
        setTimeout(() => {
          // 主动触发一次 resize，让图表主动适应大小变化
          window.dispatchEvent(new Event('resize'));
        }, 0);
      });
    }
  }, [id, resolution, theme, showOrderMarking]);

  useEffect(() => {
    if (!chart.current) return;
    chart.current?.getKlineHistory(id, Date.now(), true, () => {}, resolution);
  }, [id, resolution]);

  useEffect(() => {
    if (!chart.current) return;
    chart.current?.setShowCrosshairOrderBtn(!!showCrosshairOrderBtn);
  }, [showCrosshairOrderBtn]);

  useEffect(() => {
    if (!chart.current) return;
    chart.current?.setReverseView(!!isReverse);
  }, [isReverse]);

  useEffect(() => {
    if (!chart.current) return;
    chart.current?.setShowOrderbook(!!showOrdebok);
  }, [showOrdebok]);

  useEffect(() => {
    if (!chart.current) return;
    chart.current?.setShowPriceMark(!!showPriceLine);
  }, [showPriceLine]);

  useEffect(() => {
    if (!chart.current) return;
    chart.current?.setShowCountdown(!!showCountdown);
  }, [showCountdown]);

  useEffect(() => {
    if (!chart.current) return;
    chart.current?.setLOrderMarkingVisible(!!showOrderMarking);
  }, [showOrderMarking]);

  // 实时数据
  useWs(
    SUBSCRIBE_TYPES.ws4001,
    (data) => {
      if (data.id != id) {
        return;
      }
      klineData.current.data = data;
      chart.current?.updateData(klineData.current);
    },
    [id]
  );
  // 实时数据
  useWs(
    SUBSCRIBE_TYPES.ws4001,
    (data) => {
      if (data.id != id) {
        return;
      }
      klineData.current.data = data;
      chart.current?.updateData(klineData.current);
    },
    [id]
  );

  useWs(SUBSCRIBE_TYPES.ws7001, (data) => {
    try {
      klineData.current.orderBook = {
        buyPrice: data.bids?.[0].price,
        sellPrice: data.asks?.[0]?.price,
      };
      chart.current?.updateData(klineData.current);
    } catch (e) {
      // console.log('kline ws7001', e);
    }
  });

  return (
    <>
      <div id={elementId + qty}></div>
      <style jsx>{`
        #${elementId + qty} {
          flex: 1;
          background-color: var(--bg-1);
          /* background-image: url('/static/images/trade/kline/logo.svg'); */
          background-repeat: no-repeat;
          background-position: center;
          background-size: 250px;
          overflow: hidden;
          @media ${MediaInfo.mobile} {
            background-size: 150px;
          }
        }
        :global(.save-picture-modal .ant-modal-body) {
          margin-top: 0 !important;
        }
        :global(.save-picture-modal .ant-btn:nth-child(2)) {
          background-color: var(--const-color-orange) !important;
          color: var(--spec-font-color-1) !important;
        }
      `}</style>
    </>
  );
};

export const KlineChart = memo(KlineChartUI, (prev, next) => {
  return JSON.stringify(prev) === JSON.stringify(next);
});
