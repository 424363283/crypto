import { EmptyComponent } from '@/components/empty';
import { Loading } from '@/components/loading';
import { getAccountProfitRateApi } from '@/core/api';
import { useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { RootColor } from '@/core/styles/src/theme/global/root';
import { message } from '@/core/utils';
import dayjs, { Dayjs } from 'dayjs';
import * as echarts from 'echarts';
import React, { useEffect, useRef } from 'react';
import { useImmer } from 'use-immer';
interface Props {
  startDate: string | Dayjs;
  endDate: string | Dayjs;
  width?: string;
  height?: string;
  bottom?: number;
}
interface ProfitRates {
  date: number;
  rate: number;
  btcRate: number;
}
// 现货收益率走势
const YieldTrendChart: React.FC<Props> = ({ startDate, endDate, bottom = 30, width = '330px', height = '216px' }) => {
  const [state, setState] = useImmer({
    profitRates: [] as ProfitRates[],
  });
  const { isDark, skin } = useTheme();
  const { profitRates } = state;
  const colorRgb = RootColor.getColorRGB;
  // 现货账户盈亏收益率曲线
  const getAccountProfitRate = async () => {
    Loading.start();
    if (startDate && endDate) {
      const res = await getAccountProfitRateApi({
        type: 2,
        startTime: dayjs(startDate).valueOf(),
        endTime: dayjs(endDate).valueOf(),
      });
      if (res.code === 200) {
        setState((draft) => {
          draft.profitRates = res.data || [];
        });
        Loading.end();
      } else {
        message.error(res.message);
        Loading.end();
      }
    }
  };
  useEffect(() => {
    getAccountProfitRate();
  }, [startDate, endDate]);
  const chartRef = useRef<HTMLDivElement | null>(null);
  const data = profitRates;
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (chartRef.current) {
      const myChart = echarts.init(chartRef.current);
      const xInterval = data.length > 21 ? Math.floor(data.length / 7) : Math.floor(data.length / 10);
      const startBtcColor = `rgba(${colorRgb['up-color-rgb']}, 0.5)`;
      const endBtcColor = `rgba(${colorRgb['down-color-rgb']},0)`;
      const bgColorBTC = skin === 'blue' ? '#1772F8' : '#FFD30F'; // BTC涨跌幅背景色

      const option = {
        tooltip: {
          trigger: 'axis',
          formatter: function (params: any) {
            const bgColorRate = '#F04E3F'; // 收益率背景色

            const formatBTC = (value: string, bgColor: string) => {
              return `<span style="display:inline-block;margin-right:5px;border-radius:50%;width:8px;height:8px;background-color:${bgColor}"></span>${value}%`;
            };

            return `${LANG('日期')}: ${params[0].axisValueLabel}<br/>${LANG('收益率')}: ${formatBTC(
              params[0].value,
              bgColorRate
            )}<br/>BTC ${LANG('涨跌幅')}: ${formatBTC(params[1].value, bgColorBTC)}`;
          },
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisTick: {
            show: false, // 隐藏刻度线
          },
          axisLabel: {
            rotate: 0,
            interval: xInterval, // 控制日期的显示间隔
          },
          axisLine: {
            show: false, // Hide xAxis line
          },
          data: data.map((item) => {
            const date = new Date(item.date);
            return `${date.getMonth() + 1}-${date.getDate()}`;
          }),
        },
        yAxis: {
          offset: 12,
          type: 'value',
          min: (value: any) => {
            // 均分刻度
            const maxValue = Math.max(Math.abs(value.min), Math.abs(value.max));
            return Math.floor(-maxValue);
          }, // 设置一个较小的值
          max: (value: any) => {
            const maxValue = Math.max(Math.abs(value.min), Math.abs(value.max));
            return Math.ceil(maxValue);
          }, // 设置一个较大的值
          splitNumber: 4, // Number of intervals
          axisLine: {
            show: false, // Hide yAxis line
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: isDark ? '#404545' : '#F2F2F0',
            },
          },
          axisLabel: {
            formatter: '{value}%',
            margin: 0,
            align: 'right', // 设置 Y 轴文字左对齐
          },
        },
        series: [
          {
            name: 'Rate',
            type: 'line',
            data: data.map((item) => item.rate?.mul(100)?.toFixed(2)),
            showSymbol: false,
            animation: true,
            smooth: true,
            emphasis: {
              focus: 'series', // Only show the line when hovering
            },
            lineStyle: {
              color: '#F04E3F', // 更改颜色为#F04E3F
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
                    color: 'rgba(240,78,63, 0.5)', // Gradient start color
                  },
                  {
                    offset: 1,
                    color: 'rgba(240,78,63, 0)',
                  },
                ],
              },
            },
          },
          {
            name: 'BTC Rate',
            type: 'line',
            data: data.map((item) => item.btcRate?.mul(100)?.toFixed(2)),
            animation: true,
            showSymbol: false,
            smooth: true,
            lineStyle: {
              color: bgColorBTC,
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
                    color: startBtcColor, // Gradient start color
                  },
                  {
                    offset: 1,
                    color: endBtcColor,
                  },
                ],
              },
            },
          },
        ],
        grid: {
          left: 14, // Distance from left side
          right: 16,
          bottom: bottom, // Distance from bottom
          top: 10,
          containLabel: true,
        },
      };

      myChart.setOption(option);

      // 在组件卸载时销毁图表
      return () => {
        myChart.dispose();
      };
    }
  }, [data, isDark, skin]);
  if (!data?.length) return <EmptyComponent />;
  return <div ref={chartRef} style={{ width: width, height: height, margin: '0 auto' }} />;
};
export default YieldTrendChart;
