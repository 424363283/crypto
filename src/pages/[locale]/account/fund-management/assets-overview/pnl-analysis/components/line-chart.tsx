import { EmptyComponent } from '@/components/empty';
import { useResponsive, useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import dayjs from 'dayjs';
import * as echarts from 'echarts';
import { useLayoutEffect, useRef } from 'react';
import { SwapReportPnls } from '../../components/hooks/use-swap-pnl-data';

type PriceChartProps = {
  lineColor?: string;
  xInterval?: number; // x轴刻度显示间隔
  splitLine?: any;
  reportPnls: SwapReportPnls[];
  chartId: 'totalPnl' | 'totalPnlRate';
  symbolUnit: 'USD' | 'USDT';
};
// // Sample data

const LineChart = (props: PriceChartProps) => {
  const { isDark } = useTheme();
  const { isMobile } = useResponsive();
  const {
    reportPnls,
    chartId,
    lineColor = '#782CE8',
    symbolUnit,
    splitLine = {
      show: true, // Hide horizontal grid lines
      lineStyle: {
        type: 'dashed',
        color: isDark ? '#404545' : '#F2F2F0',
      },
    },
  } = props;

  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartData = {
    dates: reportPnls.map((item) => dayjs(item.date).format('MM-DD')),
    prices: reportPnls.map((item) => {
      const OPTION_ID_DATA: any = {
        totalPnl: item.totalPnl,
        totalPnlRate: item.totalPnlRate?.mul(100).toFormat(4),
      };
      return OPTION_ID_DATA[chartId];
    }),
  };
  const data = chartData;
  useLayoutEffect(() => {
    let chartInstance: echarts.ECharts | null = null;
    if (typeof document === 'undefined' || !chartRef.current) return;
    if (chartRef.current) {
      chartInstance = echarts.init(chartRef.current);
      const dateLength = data.dates.length;
      const maxPrice = Math.max(...data.prices);
      const minPrice = Math.min(...data.prices);
      const priceRange = maxPrice - minPrice;
      const tickInterval = priceRange / 4;
      const option: echarts.EChartsOption = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
          },
          formatter: (params: any) => {
            const currentYear = dayjs().year();
            const date = params[0]?.name;
            const price = params[0]?.data;
            const dataIndex = params[0]?.dataIndex;
            const transferAmount = reportPnls[dataIndex].transferAmount?.toFormat();
            const totalPnl =
              chartId === 'totalPnl'
                ? `${LANG('累计盈亏')} ${price.toFormat(2)} ${symbolUnit}</span>`
                : `${LANG('累计盈亏率')} ${price.toFormat(2)} %</span>`;
            return `${currentYear}-${date}<br><span style="font-size: 14px;">${totalPnl}<br><span style="font-size: 14px;">${LANG(
              '净划入'
            )} ${transferAmount} ${symbolUnit}</span>`;
          },
        },
        xAxis: {
          type: 'category',
          data: data.dates,
          boundaryGap: false,
          axisLabel: {
            rotate: 0,
            interval: dateLength > 40 ? 6 : dateLength > 20 ? 3 : 0, // 控制日期的显示间隔
          },
          axisLine: {
            show: false, // Hide xAxis line
          },
          axisTick: {
            show: false, // 隐藏刻度线
          },
        },
        yAxis: {
          data: data.prices,
          type: 'value',
          boundaryGap: false,
          splitNumber: 3, // Number of intervals
          interval: tickInterval,
          max: Math.max(...data.prices),
          min: Math.min(...data.prices),
          axisLabel: {
            margin: 20,
            formatter: (value: number) => {
              return chartId === 'totalPnl' ? value.toFormat(2) : value.toFormat(2) + '%';
            },
          },
          axisLine: {
            show: false, // Hide yAxis line
          },
          splitLine: splitLine,
        },
        series: [
          {
            type: 'line',
            data: data.prices,
            animation: true,
            name: 'Price',
            lineStyle: {
              color: lineColor, // Line color
            },
            symbol: 'emptyCircle', // 如果需要是空心圆
            itemStyle: {
              color: lineColor, // Symbol color
            },
            symbolSize: 8,
            emphasis: {
              focus: 'series', // Only show the line when hovering
            },
          },
        ],
        graphic: {
          elements: [], // Initialize with an empty array
        },
        grid: {
          left: 14, // Distance from left side
          right: 20,
          bottom: 10, // Distance from bottom
          top: 30,
          containLabel: true,
        },
        hoverLayerThreshold: 0,
      };

      chartInstance.setOption(option);
      // 自适应窗口大小变化
      const resizeHandler = () => {
        chartInstance?.resize();
      };

      window.addEventListener('resize', resizeHandler);
      // Cleanup when unmounting
      return () => {
        if (chartInstance) {
          window.removeEventListener('resize', resizeHandler);

          chartInstance.dispose();
        }
      };
    }
  }, [JSON.stringify(reportPnls), splitLine]);

  if (!data.prices?.length) return <EmptyComponent />;
  return <div ref={chartRef} style={{ width: isMobile ? '100%' : '757px', height: '236px', margin: '0 auto' }}></div>;
};
export default LineChart;
