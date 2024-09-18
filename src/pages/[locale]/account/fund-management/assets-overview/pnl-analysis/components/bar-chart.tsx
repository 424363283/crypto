import { EmptyComponent } from '@/components/empty';
import { useResponsive, useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { RootColor } from '@/core/styles/src/theme/global/root';
import dayjs from 'dayjs';
import * as echarts from 'echarts';
import { useEffect, useRef } from 'react';
import { SwapReportPnls } from '../../components/hooks/use-swap-pnl-data';
interface BarChartProps {
  reportPnls: SwapReportPnls[];
  symbolUnit: 'USD' | 'USDT';
}
const BarChart = (props: BarChartProps) => {
  const { isMobile } = useResponsive();
  const { reportPnls, symbolUnit } = props;
  const chartRef = useRef<any>(null);
  const { isDark } = useTheme();
  const colorHex = RootColor.getColorHex;
  const positiveColor = colorHex['up-color-hex'];
  const negativeColor = colorHex['down-color-hex'];
  const chartData = {
    dates: reportPnls.map((item) => dayjs(item.date).format('MM-DD')),
    values: reportPnls.map((item) => {
      return item.pnl;
    }),
  };
  useEffect(() => {
    if (!reportPnls.length || typeof document === 'undefined') return;
    const myChart = echarts.init(chartRef.current);

    // 从数据中提取日期和数值
    const dates = chartData.dates.map((item) => item);
    const values = chartData.values.map((item) => item);

    // 配置 ECharts 选项
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: (params: any) => {
          const currentYear = dayjs().year();
          const date = params[0]?.name;
          const price = params[0]?.data;
          // 获取当前数据点的索引
          const dataIndex = params[0]?.dataIndex;
          // 通过索引获取对应的 transferAmount 值
          const transferAmount = reportPnls[dataIndex].transferAmount?.toFormat();
          return `${currentYear}-${date}<br><span style="font-size: 14px;">${LANG('单日盈亏')} ${price.toFormat(
            2
          )} ${symbolUnit}</span><br><span style="font-size: 14px;">${LANG(
            '净划入'
          )} ${transferAmount} ${symbolUnit}</span>`;
        },
      },
      xAxis: {
        type: 'category',
        data: dates,
        axisLine: {
          lineStyle: {
            color: isDark ? '#515656' : '#e5e5e4', // 设置X轴线条颜色
          },
          onZero: false, // 防止X轴线在柱状图上
        },
        axisLabel: {
          rotate: 0,
          interval: dates.length > 40 ? 6 : dates.length > 20 ? 3 : 0, // 控制日期的显示间隔
        },
        axisTick: { show: false }, // 隐藏刻度线
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          margin: 7, // 设置Y轴标签和底部X轴的间距为7px
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: isDark ? '#404545' : '#F2F2F0',
          },
        },
      },
      series: [
        {
          data: values,
          type: 'bar',
          itemStyle: {
            color: (params: any) => {
              // 根据数据值决定柱子颜色
              const value = params.data;
              return value >= 0 ? positiveColor : negativeColor;
            },
            barBorderRadius: [5, 5, 5, 5], // 设置圆角
          },
          barWidth: dates.length < 30 ? 20 : 10, // 设置柱子宽度为20px
          barGap: 90, // 设置柱子间距为90%
        },
      ],
      grid: {
        left: 2, // Distance from left side
        right: 0,
        bottom: 10, // Distance from bottom
        top: 30,
        containLabel: true,
      },
    };

    myChart.setOption(option);

    return () => {
      myChart.dispose(); // 销毁 ECharts 实例
    };
  }, [isDark, JSON.stringify(reportPnls)]);
  if (!reportPnls.length) {
    return <EmptyComponent />;
  }
  return <div ref={chartRef} style={{ width: isMobile ? '100%' : '757px', height: '334px' }} />;
};

export default BarChart;
