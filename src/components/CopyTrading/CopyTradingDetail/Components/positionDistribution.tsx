import clsx from 'clsx';
import css from 'styled-jsx/css';
import { Svg } from '@/components/svg';
import { Popover } from 'antd';
import { useResponsive } from '@/core/hooks';
import React, { useEffect, useMemo, useState } from 'react';
import { formatTimeDiff } from '@/core/shared/src/copy/utils';
import { EmptyComponent } from '@/components/empty';
import { Tooltip as TooltipMessage } from '@/components/trade-ui/common/tooltip';
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
  ScatterChart,
  Dot,
  DotProps,
  Rectangle,
  ResponsiveContainer
} from 'recharts';
import { LANG } from '@/core/i18n';
export default function PositionDistribution(props: { data: {}; configInfoY?: { min: 0, max: 100 } }) {
  const { isMobile } = useResponsive();
  const historyData = props.data;
  // 处理数据函数
  const processData = (data) => {
    return data.map(item => ({
      ...item,
      tradePnl: Number(item.tradePnl) // 确保盈亏是数字
    }));
  };

  // 使用处理后的数据
  const positiveData = processData(historyData.positiveList || []);
  const negativeData = processData(historyData.negativeList || []);
  const ymin = props.configInfoY.min;
  const yMax = props.configInfoY.max;
  const RenderRectangle = ({ cx, cy, fill }) => {
    return <Rectangle x={cx - 15} y={cy} fill={fill} radius={16} width={30} height={10} />;
  };
  const style = {
    top: '-10%',
    right: 0,
    lineHeight: '24px'
  };
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const diffTime = payload[0].payload.diffTime;
      const holdTime = payload[0].payload.holdTime; // 原始时间字符串
      return (
        <div
          style={{
            backgroundColor: 'var(--dropdown-select-bg-color)',
            boxShadow: '0px 4px 16px 0px var(--dropdown-select-shadow-color)',
            borderRadius: 8,
            marginTop: 8,
            marginLeft: 20,
            height: 'auto',
            padding: '16px',
            fontFamily: 'HarmonyOS Sans SC',
            fontWeight: 500,
            fontSize: '12px'
          }}
        >
          {/* <div style={{ marginTop: 0, color: 'var(--text_1)' }}>{label}</div> */}
          <table style={{ width: '100%' }}>
            <tbody>
              {payload.map((entry, idx) => (
                <tr key={`item-${idx}`}>
                  <td style={{ color: 'var(--text_1)', fontWeight: 500 }}>{entry.name}</td>
                  <td style={{ textAlign: 'right', fontWeight: 500 }}>
                    {entry.dataKey === 'tradePnl' && (
                      <span
                        style={{
                          color: entry.value > 0 ? 'var(--green)' : 'var(--red)'
                        }}
                      >
                        {entry.value.toLocaleString()}
                        {'USDT'}
                      </span>
                    )}
                    {entry.dataKey !== 'tradePnl' && (
                      <div style={{ color: 'var(--text_2)' }}>
                        {' '}
                        {formatTimeDiff(diffTime)}
                        {entry.unit}
                      </div>
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

  const LenderLegend = (props: any) => {
    const { payload } = props;
    return (
      <ul className={clsx('flexEnd')}>
        {payload.map((entry, index) => (
          <li key={`item-${index}`} className={clsx('mr24')}>
            <svg width="24" height="9" viewBox="0 0 24 9" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect
                y="0.488037"
                width="24"
                height="8"
                rx="4"
                fill={`${entry.value === 'positive' ? 'var(--green)' : 'var(--red)'}`}
              />
            </svg>
            <span className={clsx('ml8','text-primary')}> {entry.value === 'positive' ? LANG('盈利') : LANG('亏损')}</span>
          </li>
        ))}
        <style jsx>{`
          .flexEnd {
            display: flex;
            align-items: center;
            justify-content: flex-end;
          }
          .ml8 {
            margin-left: 8px;
          }
          .mr24 {
            margin-right: 24px;
          }
          .text-primary {
            color:var(--text_1);
          }
        `}</style>
      </ul>
    );
  };
  return (
    <>
      <div className={clsx('all24', 'gap24')}>
        <div className={clsx('performanceTitle', 'flexCenter', 'gap4')}>
          {LANG('持仓分布')}
          <TooltipMessage title={<p>{LANG('交易员在时间段内平仓的历史仓位的持仓时长和盈亏分布')}</p>}>
            <div className={clsx('pointer')}>
              <Svg
                src={`/static/icons/primary/common/question.svg`}
                width={20}
                height={20}
              />
            </div>
          </TooltipMessage>
        </div>
        <div style={{ width: isMobile ? 310 :680, height: 280 }} >
          {!historyData?.negativeList?.length && !historyData?.positiveList?.length && <EmptyComponent />}
          {(historyData?.negativeList?.length > 0 || historyData?.positiveList?.length > 0) && (
            <ResponsiveContainer width={'100%'} height={'100%'}>
              <ScatterChart>
                <CartesianGrid stroke="var(--fill_line_1)" vertical={false} />
                <Tooltip content={<CustomTooltip />} />
                <XAxis
                  domain={['dataMin', 'auto']}
                  dataKey="diffTime" // 使用数值化的时间字段
                  type="number" // 必须声明为数值类型
                  tickFormatter={(seconds) => {
                    const timeForMat = formatTimeDiff(seconds)
                    return timeForMat
                  }}
                  stroke={'var(--line-3)'}
                  tick={{
                    color: 'var(--text_2)',
                    fontFamily: 'HarmonyOS Sans SC',
                    fontSize: 12,
                    fontWeight: 400
                  }}
                  tickLine={false}
                  padding={{ left: 8, right: 20 }}
                  name={LANG('持仓时间')}
                />
                <YAxis
                  domain={[ymin, yMax]}
                  tickLine={false}
                  stroke={'var(--line-3)'}
                  tick={{
                    color: 'var(--text_2)',
                    fontFamily: 'HarmonyOS Sans SC',
                    fontSize: 12,
                    fontWeight: 400
                  }}
                  dataKey="tradePnl"
                  name={LANG('盈利')}
                // unit="USDT"
                />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Legend
                  iconSize={10}
                  verticalAlign="top"
                  content={<LenderLegend />}
                  iconType="rect"
                  wrapperStyle={style}
                  align="right"
                />
                <Scatter
                  name="positive"
                  data={positiveData || []}
                  fill="var(--green)"
                  shape={<RenderRectangle />}
                />
                <Scatter
                  name="negative"
                  data={negativeData || []}
                  fill="var(--red)"
                  shape={<RenderRectangle />}
                />
              </ScatterChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
      <style jsx>{styles}</style>
    </>
  );
}

const styles = css`
  .all24 {
    padding: 24px;
    border-radius: 24px;
    border: 1px solid var(--fill_line_2);
  }
  .gap24 {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  .gap4 {
    gap: 4px;
  }

  .performanceTitle {
    color: var(--text_1);
    font-family: 'HarmonyOS Sans SC';
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }
  .ml4 {
    margin-left: 4px;
  }
  .flexCenter {
    display: flex;
    align-items: center;
  }
  .pointer {
    cursor: pointer;
  }
`;
