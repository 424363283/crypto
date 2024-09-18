import { EmptyComponent } from '@/components/empty';
import { useTheme } from '@/core/hooks';
import { RootColor } from '@/core/styles/src/theme/global/root';
import * as echarts from 'echarts';
import { useLayoutEffect, useRef } from 'react';

type PriceChartProps = {
  data: {
    dates: string[];
    prices: number[];
  };
  width?: string;
  height?: string;
  lineColor?: string;
  startColor?: string; // 图表背景渐变色起始颜色
  endColor?: string; // 图表背景渐变色结束颜色
  xInterval?: number; // x轴刻度显示间隔
  splitLine?: any;
};
// // Sample data
const MockData = {
  dates: ['08-01', '08-02', '08-03', '08-04', '08-05', '08-06', '08-07'],
  prices: [100, 110, 105, 120, 130, 125, 140],
};
const PriceChart = (props: PriceChartProps) => {
  const { isDark } = useTheme();
  const colorRgb = RootColor.getColorRGB;
  const colorHex = RootColor.getColorHex;
  const {
    data = MockData,
    width = '100%',
    height = '200px',
    lineColor = colorHex['active-color-hex'],
    startColor = `rgba(${colorRgb['active-color-rgb']},0.5)`,
    endColor = `rgba(${colorRgb['active-color-rgb']},0)`,
    xInterval = 0,
    splitLine = {
      show: true, // Hide horizontal grid lines
      lineStyle: {
        type: 'dashed',
        color: isDark ? '#404545' : '#F2F2F0',
      },
    },
  } = props;

  const chartRef = useRef<HTMLDivElement | null>(null);
  useLayoutEffect(() => {
    let chartInstance: echarts.ECharts | null = null;
    if (!chartRef.current || typeof document === 'undefined') return;
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
            const date = params[0]?.name;
            const price = params[0]?.data;
            return `${date}<br><span style="font-size: 16px;font-weight: 500;color: #141717">$${price.toFormat(
              2
            )}</span>`;
          },
        },
        xAxis: {
          type: 'category',
          data: data.dates,
          boundaryGap: false,
          axisLabel: {
            rotate: 0,
            interval: xInterval || (dateLength > 30 ? 4 : dateLength > 20 ? 4 : 0), // 控制日期的显示间隔
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
          splitNumber: 3, // Number of intervals
          interval: tickInterval,
          max: Math.max(...data.prices),
          min: Math.min(...data.prices),
          axisLabel: {
            margin: 20,
            formatter: (value: number) => {
              return value.toFormat(2);
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
            symbol: 'none', // Remove hollow symbols
            emphasis: {
              focus: 'series', // Only show the line when hovering
            },
            areaStyle: {
              color: {
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: startColor, // Gradient start color
                  },
                  {
                    offset: 1,
                    color: endColor, // Gradient end color
                  },
                ],
              }, // Background gradient color below the line
            },
          },
        ],
        graphic: {
          elements: [], // Initialize with an empty array
        },
        grid: {
          left: 10, // Distance from left side
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
  }, [JSON.stringify(data), splitLine]);

  if (!data.prices?.length) return <EmptyComponent />;
  return <div ref={chartRef} style={{ width: width, height: height, margin: '0 auto', overflow: 'hidden' }}></div>;
};
export default PriceChart;
