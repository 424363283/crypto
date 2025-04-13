'use client';
import styles from '../index.module.scss';
import React, { PureComponent } from 'react';
import { useResponsive } from '@/core/hooks';
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  Scatter,
  Dot,
  DotProps,
  Rectangle
} from 'recharts';
import { LANG } from '@/core/i18n';
export default function PositionDistribution() {
  const { isMobile } = useResponsive();
  const data = [
    {
      name: '1分钟',
      uv: 590,
      pv: 800,
      amt: 1400,
      cnt: 490
    },
    {
      name: '24小时',
      uv: 868,
      pv: 967,
      amt: 1506,
      cnt: 590
    },
    {
      name: '5天',
      uv: 1397,
      pv: 1098,
      amt: 989,
      cnt: 350
    },
    {
      name: '15天',
      uv: 1480,
      pv: 1200,
      amt: 1228,
      cnt: 480
    }
  ];
  const RenderRectangle = ({ cx, cy,fill }) => {
    return (
      <Rectangle x={cx} y={cy} fill={fill} radius={16} width={30} height={10}   />
    )
  }
  const style = {
    top: '-10%',
    right: 0,
    lineHeight: '24px'
  };

  const LenderLegend = (props: any) => {
    const { payload } = props;
    return (
      <ul className={`${styles.flexEnd}`}>
        {payload.map((entry, index) => (
          <li key={`item-${index}`} className={styles.mr24} >
            <svg width="24" height="9" viewBox="0 0 24 9" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect y="0.488037" width="24" height="8" rx="4" fill={`${entry.value === 'cnt'?'var(--green)':'var(--red)'}`} />
            </svg>
            <span className={styles.ml8}> {entry.value !== 'cnt' ? LANG('亏损'):LANG('盈利')}</span>
          </li>
        ))}
      </ul>
    );
  };
  return (
    <>
      <div className={``}>
        <div className={`${styles.all24} ${styles.gap24}`}>
          <div className={styles.performanceTitle}>{LANG('持仓分布')}</div>
          <div className={``}>
            <ComposedChart width={isMobile?310:682} height={280} data={data}>
             <CartesianGrid stroke="var(--line-1)" vertical={false} />
              <XAxis
                dataKey="name"
                scale="band"
                stroke={'var(--line-3)'} 
                tick={{
                  color: 'var(--text-secondary)',
                  fontFamily: 'HarmonyOS Sans SC',
                  fontSize: 12,
                  fontWeight: 400
                }}
                tickLine={false}
                padding={{ left: 8, right: 20 }}
              />
              <YAxis
                tickLine={false}
                stroke={'var(--line-3)'} 
                tick={{
                  color: 'var(--text-secondary)',
                  fontFamily: 'HarmonyOS Sans SC',
                  fontSize: 12,
                  fontWeight: 400
                }}
              />
              <Tooltip />
              <Legend
                iconSize={10}
                verticalAlign="top"
                content={<LenderLegend />}
                iconType="rect"
                wrapperStyle={style}
                align="right"
              />
              <Scatter dataKey="cnt" fill="var(--green)"  shape={<RenderRectangle />} />
              <Scatter dataKey="amt" fill="var(--red)" shape={<RenderRectangle />}  />
            </ComposedChart>
          </div> 
        </div>
      </div>
    </>
  );
}
