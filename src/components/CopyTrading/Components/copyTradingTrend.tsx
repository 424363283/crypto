import React, { PureComponent } from 'react';
import { AreaChart,Legend, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CopyTradingTrend = (props: {chartData:[],chartShowKey:'profitRate',width?: 156}) => {
  const {chartShowKey,chartData = []} = props
  const data = chartData.map((item: any) => {
    return {
      name: '收益率',
      profitRate: item[chartShowKey]
    }
  })
  const gradientOffset = () => {
    const dataMax = Math.max(...data.map((i) => i[chartShowKey]));
    const dataMin = Math.min(...data.map((i) => i[chartShowKey]));
  
    if (dataMax <= 0) {
      return 0;
    }
    if (dataMin >= 0) {
      return 1;
    }
  
    return dataMax / (dataMax - dataMin);
  };
  
  
  const off = gradientOffset();
  return (
    <>
        <AreaChart
          width={props.width||156}
          height={62}
          data={data}
        >
          <Tooltip />
          <defs>
            <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
             <stop offset={off} stopColor="rgb(42 178 108 / 30%)" stopOpacity={1} />
              <stop offset={off} stopColor="rgb(239 69 74 / 30%)" stroke="#EF454A" stopOpacity={1} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey={chartShowKey} stroke="url(#splitColor)" fill="url(#splitColor)" />
        </AreaChart>
    </>
  );
};

export default CopyTradingTrend;
