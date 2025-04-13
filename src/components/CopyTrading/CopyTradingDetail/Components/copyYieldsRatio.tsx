import styles from '../index.module.scss';
import React, { PureComponent } from 'react';
import { useResponsive } from '@/core/hooks';
import { Popover } from 'antd';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Svg } from '@/components/svg';
import { LANG } from '@/core/i18n';
export default function CopyYieldsRatio() {
  const { isMobile } = useResponsive();
  const data = [
    {
      name: '2-16',
      uv: 4000,
      pv: 2400,
      amt: 2400
    },
    {
      name: '2-18',
      uv: 3000,
      pv: 1398,
      amt: 2210
    },
    {
      name: '2-20',
      uv: -1000,
      pv: 9800,
      amt: 2290
    },
    {
      name: '2-22',
      uv: 500,
      pv: 3908,
      amt: 2000
    },
    {
      name: '2-24',
      uv: -2000,
      pv: 4800,
      amt: 2181
    },
    {
      name: '2-26',
      uv: -250,
      pv: 3800,
      amt: 2500
    },
    {
      name: '2-28',
      uv: 3490,
      pv: 4300,
      amt: 2100
    }
  ];

  const gradientOffset = () => {
    const dataMax = Math.max(...data.map(i => i.uv));
    const dataMin = Math.min(...data.map(i => i.uv));

    if (dataMax <= 0) {
      return 0;
    }
    if (dataMin >= 0) {
      return 1;
    }

    return dataMax / (dataMax - dataMin);
  };

  const off = gradientOffset();
  const copyDetailTab = {
    day: '165',
    copyTotal: '8,254.98',
    scalePre: '1.09',
    scaleNext: '2',
    scale: '759,837.02',
    follower: '-19,087.98',
    follerCount: 187,
    porfit: '10%'
  };

  return (
    <>
      <div className={`${styles.all24} ${styles.gap24} ${styles.h379}`}>
        <div className={`${styles.performanceTitle} ${styles.flexCenter}`}>
          {LANG('收益率')}
          <Popover content={'收益率解释解释解释解释解释'} title={LANG('收益率')}>
            <div>
              <Svg className={styles.ml4} src={`/static/icons/primary/common/question.svg`} width={20} height={20} />
            </div>
          </Popover>
        </div>
        <div>
          <AreaChart width={isMobile ? 310 : 648} height={290} data={data}>
            <CartesianGrid stroke="var(--line-1)" vertical={false} />
            <XAxis
              dataKey="name"
              stroke={'var(--line-3)'} 
              tick={{ color: 'var(--text-secondary)', fontFamily: 'HarmonyOS Sans SC', fontSize: 12, fontWeight: 400 }}
            />
            <YAxis
            stroke={'var(--line-3)'} 
              tick={{ color: 'var(--text-secondary)', fontFamily: 'HarmonyOS Sans SC', fontSize: 12, fontWeight: 400 }}
            />
            <Tooltip />
            <defs>
              <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset={off} stopColor="#2AB26C" stopOpacity={0.6} />
                <stop offset={off} stopColor="#EF454A" stopOpacity={0.6} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="uv" stroke="url(#splitColor)" fill="url(#splitColor)" />
          </AreaChart>
        </div>
      </div>
    </>
  );
}
