import { useState } from 'react';

import { PriceInput, VolumeInput } from '../../input';
import { LeverSlider } from '../../lever-slider';
import { Result, ResultLayout } from '../../result';
import { QuoteSelect } from '../../select';
import { TradeTypeBar } from '../../trade-type-bar';

import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { formatNumber2Ceil } from '@/core/utils';
import { useStore } from '../../../store';
import css from 'styled-jsx/css';
import clsx from 'clsx';

export const IncomeView = () => {
  const { quoteId, isUsdtType, lever, cryptoData, initMargins, isBuy } = useStore();
  const [result, setResult] = useState<any>({ margin: '--', income: '--', rate: 0 });

  // inputs
  const [openPrice, setOpenPrice] = useState('');
  const [liquidationPrice, setLiquidationPrice] = useState('');
  const [volume, setVolume] = useState('');

  const { basePrecision, settleCoin } = cryptoData;

  const _resetInputs = () => {
    setOpenPrice('');
    setLiquidationPrice('');
    setVolume('');
  };
  const _onSubmit = () => {
    const code = quoteId;
    let next: any = volume;
    if (isUsdtType) {
      next = Swap.Calculate.amountToVolume({
        usdt: isUsdtType,
        isVolUnit: false,
        value: Number(next),
        code,
        flagPrice: Number(liquidationPrice)
      });
    }
    const bond = Swap.Calculate.IPM({
      usdt: isUsdtType,
      volume: next,
      code,
      avgCostPrice: Number(openPrice),
      initMargins
    });
    const income = Swap.Calculate.income({
      usdt: isUsdtType,
      code,
      isBuy,
      flagPrice: Number(liquidationPrice),
      avgCostPrice: Number(openPrice),
      volume: next
    });

    const ROE = Swap.Calculate.ROE({ usdt: isUsdtType, income, ipm: bond });

    const fixed = isUsdtType ? 2 : basePrecision;
    setResult({
      margin: formatNumber2Ceil(bond, fixed),
      income: formatNumber2Ceil(income, fixed, false),
      rate: `${ROE * 100}`?.toRound(2)
    });
  };

  const results = [
    [
      LANG('起始保证金'),
      `${result.margin} ${settleCoin}`,
      {
        info: LANG(
          '起始保证金有时会小于下单所需的保证金。下单所需保证金=起始保证金+开仓亏损，其中开仓亏损考虑了盘口最新情况于标记价格之前的差异'
        )
      }
    ],
    [LANG('收益'), `${result.income} ${settleCoin}`],
    [LANG('回报率'), `${result.rate}%`]
  ];

  return (
    <>
      <ResultLayout disabled={!openPrice || !liquidationPrice || !volume} onSubmit={_onSubmit}>
        <div className={'income-view'}>
          <QuoteSelect
            onChange={() => {
              _resetInputs();
            }}
          />
          <TradeTypeBar />
          <LeverSlider />
          <div className={'input-item'}>
            <div className={'label'}>{LANG('开仓价格')}</div>
            <PriceInput label={null} value={openPrice} onChange={setOpenPrice} />
          </div>
          <div className={'input-item'}>
            <div className={'label'}>{LANG('平仓价格')}</div>
            <PriceInput label={null} value={liquidationPrice} onChange={setLiquidationPrice} />
          </div>
          <div className={'input-item'}>
            <div className={'label'}>{LANG('成交数量')}</div>
            <VolumeInput label={null} value={volume} onChange={setVolume} />
          </div>
        </div>
        <Result results={results} />
      </ResultLayout>
      <style jsx>{styles}</style>
    </>
  );
};

const styles = css`
  .income-view {
    .input-item {
      > .label {
        color: var(--text-tertiary);
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 16px;
      }
    }
  }
`;
