import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { MediaInfo } from '@/core/utils';
import css from 'styled-jsx/css';
import { LANG } from '@/core/i18n';
import { Copy } from '@/core/shared';
import Tooltip from '@/components/trade-ui/common/tooltip';
import { OVERVIEW_DATA, BRING_DATA } from '@/core/shared/src/copy/types';
import { CalibrateValue } from '@/core/shared/src/copy/utils';
export default function CopyTradingData(props: { overviewData: OVERVIEW_DATA; bringData: BRING_DATA; cycle: number }) {
  const copyOverviewData = props.overviewData;
  const copyBringData = props.bringData;
  console.log(copyBringData,'copyBringData----')
  const cycle = props.cycle;
  const tradePercent = useMemo(() => {
    const isSame = !copyBringData[`profitOrderNumber${cycle}`] && !copyBringData[`lossOrderNumber${cycle}`];
    const total = copyBringData[`profitOrderNumber${cycle}`]?.add(copyBringData[`lossOrderNumber${cycle}`]);
    const tradeBuy = copyBringData[`profitOrderNumber${cycle}`]?.mul(100).div(total).toFixed(2);
    const percentWin = copyBringData[`profitOrderNumber${cycle}`]?.div(total) || 0;
    return {
      tradeBuy: isSame ? '50%' : tradeBuy + '%',
      tradeSell: isSame ? '50%' : '100'.sub(tradeBuy) + '%',
      victoryRate: copyBringData[`victoryRate${cycle}`],
      profitRate: copyBringData[`profitRate${cycle}`],
      profitOrderNumber: copyBringData[`profitOrderNumber${cycle}`],
      lossOrderNumber: copyBringData[`lossOrderNumber${cycle}`],
      profitLossRate: copyBringData[`profitLossRate${cycle}`],
      avgLoss: copyBringData[`avgLoss${cycle}`],
      avgProfit: copyBringData[`avgProfit${cycle}`],
      profitAmount: copyBringData[`profitAmount${cycle}`],
      winRate: percentWin?.mul(100)
    };
  }, [copyOverviewData]);
  return (
    <>
      <div className={clsx('all24', 'gap24', 'h379')}>
        <div className={clsx('performanceTitle')}>{LANG('带单数据')}</div>
        <div className={clsx('flexSpace', 'incomeBox')}>
          <div>
            <p className={clsx('incomeCount', 'mb8')} style={CalibrateValue(copyBringData?.profitRate).color}>
              {CalibrateValue(tradePercent?.profitRate?.mul(100), Copy.copyFixed).value}%
            </p>
            <Tooltip title={<p>{LANG('期末收益率=期间收益率+期初收益率')}</p>}>
              <span className={clsx('textDashed')}>{LANG('copyROI')}</span>
            </Tooltip>
          </div>
          <div>
            <p className={clsx('incomeCount', 'mb8')} style={CalibrateValue(copyBringData?.profitAmount).color}>
              {CalibrateValue(tradePercent?.profitAmount, Copy.copyFixed).value}
            </p>
            <Tooltip title={<p>{LANG('成为交易员以来，历史带单的所有订单收益总和')}</p>}>
              <span className={clsx('textDashed')}>{LANG('总收益')}(USDT)</span>
            </Tooltip>
          </div>
        </div>
        <div className={clsx('flexSpace')}>
          <Tooltip title={<p>{LANG('平均盈利/平均亏损')}</p>}>
            <span className={clsx('textDashed')}>{LANG('ProfitLoss')}</span>
          </Tooltip>
          <span className={clsx('textPrimary')}>
            {tradePercent?.avgProfit?.toFixed(Copy.copyFixed)}/{tradePercent?.avgLoss?.toFixed(Copy.copyFixed)}
          </span>
        </div>
        <div className={clsx('flexSpace')}>
          <Tooltip title={<p>{LANG('交易笔数/期间带单天数。此交易员的平均交易笔数。')}</p>}>
            <span className={clsx('textDashed')}>{LANG('交易频率')}</span>
          </Tooltip>
          <span className={clsx('textPrimary')}> {tradePercent?.victoryRate?.mul(100)?.toFixed(Copy.copyFixed)}%</span>
        </div>
        <div className={clsx('flexSpace')}>
          <Tooltip title={<p>{LANG('盈利笔数/带单笔数')}</p>}>
            <span className={clsx('textDashed')}>{LANG('胜率')}</span>
          </Tooltip>
          <span className={clsx('textPrimary')}>{tradePercent?.winRate?.toFixed(Copy.copyFixed)}%</span>
        </div>
        <div>
          <div className={clsx('flexSpace', 'gap4')}>
            <div className={clsx('tradeBox', 'tradeBuy')} style={{ width: tradePercent.tradeBuy }}></div>
            <div className={clsx('tradeBox', 'tradeSell')} style={{ width: tradePercent.tradeSell }}></div>
          </div>
          <div className={clsx('flexSpace', 'mt8', 'trader-num')}>
            <div>
              <p>
                <Tooltip title={<p>{LANG('成为交易员以来，历史带单的所有订单收益总和')}</p>}>
                  <span>{LANG('盈利笔数')}</span>
                </Tooltip>
                <span className={clsx('textTrue', 'ml8')}>{tradePercent?.profitOrderNumber}</span>
              </p>
            </div>
            <div>
              <p>
                <span>{LANG('亏损笔数')}</span>
                <span className={clsx('textError', 'ml8')}>{tradePercent?.lossOrderNumber}</span>
              </p>
            </div>
          </div>
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
  .gap4 {
    gap: 4px;
  }
  .gap24 {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  .h379 {
    height: 379px;
    width: 480px;
    @media ${MediaInfo.mobile} {
      height: auto;
    }
  }
  .incomeBox {
    border-bottom: 1px solid var(--fill_line_2);
    padding-bottom: 24px;
  }

  .performanceTitle {
    color: var(--text_1);
    font-family: 'HarmonyOS Sans SC';
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }
  .flexSpace {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .tradeBox {
    height: 6px;
    border-radius: 5px;
  }
  .incomeCount {
    color: var(--text_1);
    text-align: right;
    font-family: 'HarmonyOS Sans SC';
    font-size: 28px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }

  .tradeBuy {
    background: var(--green);
  }

  .tradeSell {
    background: var(--red);
  }

  .mt8 {
    margin-top: 8px;
  }
  .ml8 {
    margin-left: 8px;
  }

  .mb8 {
    margin-bottom: 8px;
  }

  .textDashed {
    border-bottom: 1px dashed var(--fill_line_2);
    cursor: pointer;
  }

  .textTrue {
    color: var(--text_green);
  }

  .textError {
    color: var(--text_red);
  }

  .textPrimary {
    color: var(--text_1);
    font-weight: 500;
  }
  .trader-num {
    font-size: 14px;
  }
`;
