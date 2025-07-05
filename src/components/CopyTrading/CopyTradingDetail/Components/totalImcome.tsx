import clsx from 'clsx';
import css from 'styled-jsx/css';
import {Tooltip as TooltipMessage}   from '@/components/trade-ui/common/tooltip';
import React, { PureComponent } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Svg } from '@/components/svg';
import { Popover } from 'antd';
import { useResponsive } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { EmptyComponent } from '@/components/empty';
export default function CopyYieldsRatio(props: { profitAmountList: any }) {
  const { isMobile } = useResponsive();
  const { profitAmountList = [] } = props;
  const gradientOffset = () => {
    const dataMax = profitAmountList && Math.max(...profitAmountList.map(i => i.incomeAmount.toFixed(0)));
    const dataMin = profitAmountList && Math.min(...profitAmountList.map(i => i.incomeAmount.toFixed(0)));

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
            marginLeft: 70,
            height: 'auto',
            padding: '16px',
             fontFamily: "Lexend",
            fontWeight: 500,
            fontSize: '12px'
          }}
        >
          <div style={{ marginTop: 0, color: 'var(--text_1)' }}>{label}</div>
          <table style={{ width: '100%' }}>
            <tbody>
              {payload.map((entry, idx) => (
                <tr key={`item-${idx}`}>
                  <td style={{ color: 'var(--text_2)', fontWeight: 500 }}>{entry.name}</td>
                  <td style={{ textAlign: 'right', fontWeight: 500 }}>
                    {entry.dataKey === 'incomeAmount' && (
                      <span
                        style={{
                          color: entry.value > 0 ? 'var(--green)' : 'var(--red)'
                        }}
                      >
                        {entry.value.toLocaleString()}
                        {entry.unit}
                      </span>
                    )}
                    {entry.dataKey !== 'incomeAmount' && (
                      <>
                        {' '}
                        {entry.value.toLocaleString()}
                        {entry.unit}
                      </>
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
      <div className={clsx('all24', 'gap24')}>
        <div className={clsx('performanceTitle', 'flexCenter', 'gap4')}>
          {LANG('总收益')}
          <TooltipMessage title={<p>{LANG('成为交易员以来，历史带单的所有订单收益总和')}</p>}>
          <div className={clsx('pointer')}>
              <Svg src={`/static/icons/primary/common/question.svg`} width={20} height={20} />
            </div>
          </TooltipMessage>
        </div>
        {!profitAmountList?.length && <EmptyComponent />}
        {profitAmountList?.length > 0 && (
          <div>
            <AreaChart width={isMobile ? 310 : 648} height={242} data={profitAmountList}>
              <CartesianGrid stroke="var(--fill_line_1)" vertical={false} />
              <XAxis
                dataKey="ctime"
                stroke={'var(--fill_line_4)'}
                tick={{
                  color: 'var(--text_2)',
                   fontFamily: "Lexend",
                  fontSize: 12,
                  fontWeight: 400
                }}
                strokeWidth={1.2}
              />
              <YAxis
                stroke={'var(--fill_line_4)'}
                tick={{
                  color: 'var(--text_2)',
                   fontFamily: "Lexend",
                  fontSize: 12,
                  fontWeight: 400
                }}
                strokeWidth={1}
              />
              <Tooltip content={<CustomTooltip />} />
              <defs>
                <linearGradient id="splitIncomeColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset={off} stopColor="#2AB26C" stopOpacity={0.6} />
                  <stop offset={off} stopColor="#EF454A" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                name={LANG('总收益')}
                dataKey="incomeAmount"
                stroke="url(#splitIncomeColor)"
                fill="url(#splitIncomeColor)"
                unit={'USDT'}
              />
            </AreaChart>
          </div>
        )}
      </div>
      <style jsx>{styles}</style>
    </>
  );
}

const styles = css`
  .all24 {
    padding: 24px;
    border-radius: 24px;
    border: 1px solid var(--fill_line_3);
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
     font-family: "Lexend";
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
