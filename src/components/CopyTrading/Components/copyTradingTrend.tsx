import { LANG } from '@/core/i18n';
import { Copy } from '@/core/shared';
import dayjs from 'dayjs';
import { color } from 'html2canvas/dist/types/css/types/color';
import React, { PureComponent } from 'react';
import { AreaChart, Legend, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CopyTradingTrend = (props: {
  chartData: [];
  chartShowKey: string;
  chartShowName: string;
  width?: number;
  height?: number;
  contentStyle?: object;
  idx?: string,
  unit?:string
}) => {
  const {
    chartShowKey = '',
    chartData = [],
    chartShowName = '收益率',
    width = 156,
    height = 63,
    unit = '%',
    contentStyle = { color: 'var(--text_1)' },
    idx = '1'
  } = props;
  const data = chartData.sort((a: any, b: any) => a.ctime - b.ctime).map(item => {
    return {
      ...item,
      showTime: dayjs(item.ctime).format('MM-DD'),
      [chartShowKey]:  chartShowKey === 'incomeAmount' ? Number(item[chartShowKey]?.toFixed(Copy.copyFixed)): Number(item[chartShowKey]?.mul(100).toFixed(Copy.copyFixed))
    };
  });
  const gradientOffset = () => {
    const dataMax = Math.max(...data.map(i => i[chartShowKey]));
    const dataMin = Math.min(...data.map(i => i[chartShowKey]));

    if (dataMax <= 0) {
      return 0;
    }
    if (dataMin >= 0) {
      return 1;
    }

    return dataMax / (dataMax - dataMin);
  };

  const off = gradientOffset();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum, item) => sum + item.value, 0);
      return (
        <div
          style={{
            backgroundColor: 'var(--dropdown-select-bg-color)',
            boxShadow: '0px 4px 16px 0px var(--dropdown-select-shadow-color)',
            borderRadius: 8,
            marginTop: 8,
            marginLeft: 10,
            height: 'auto',
            padding: '4px',
             fontFamily: "Lexend",
            fontWeight: 500,
            fontSize: '12px'
          }}
        >
          <div style={{ marginTop: 0 ,color: 'var(--text_1)'}}>{label}</div>
          <table style={{ width: '100%' }}>
            <tbody>
              {payload.map((entry, idx) => (
                <tr key={`item-${idx}`}>
                  <td style={{ color: 'var(--text_2)', fontWeight: 500 }}>{entry.name}</td>
                  <td style={{ textAlign: 'right', fontWeight: 500 }}>
                    {entry.dataKey === 'profitRate' && (
                      <span
                        style={{
                          color: entry.value > 0 ? 'var(--green)' : 'var(--red)'
                        }}
                      >
                        {entry.value.toLocaleString()}
                        {entry.unit}
                      </span>
                    )}
                    {entry.dataKey !== 'profitRate' && (
                       <span
                       style={{
                         color: 'var(--text_1)'
                       }}
                     >
                        {' '}
                        {entry.value.toLocaleString()}
                        {entry.unit}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    return null;
  };
  return (
    <>
      <AreaChart width={width || 156} height={height || 62} data={data}  >
        <defs>
          <linearGradient id={`splitColor${idx}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset={off} stopColor="rgb(42 178 108 / 30%)" stopOpacity={1} />
            <stop offset={off} stopColor="rgb(239 69 74 / 30%)" stroke="#EF454A" stopOpacity={1} />
          </linearGradient>
        </defs>
        <Tooltip  content={<CustomTooltip />} />
        <XAxis dataKey="showTime" tick={false} axisLine={false}  height={2} />
        <Area
          type="monotone"
          unit={unit}
          name={LANG(chartShowName)}
          dataKey={chartShowKey}
          stroke={`url(#splitColor${idx})`}
          fill={`url(#splitColor${idx})`}
        />
      </AreaChart>
    </>
  );
};

export default CopyTradingTrend;
