import { useState } from 'react';

import { PriceInput, RateOfReturnInput } from '../../input';
import { LeverSlider } from '../../lever-slider';
import { Result, ResultLayout } from '../../result';
import { QuoteSelect } from '../../select';
import { TradeTypeBar } from '../../trade-type-bar';

import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { useStore } from '../../../store';
import css from 'styled-jsx/css';

export const TargetPriceView = () => {
  const { isUsdtType, cryptoData, initMargins, isBuy } = useStore();
  const [result, setResult] = useState({ targetPrice: '--' });
  // inputs
  const [openPrice, setOpenPrice] = useState('');
  const [rate, setRate] = useState('');

  const _resetInputs = () => {
    setOpenPrice('');
    setRate('');
  };

  const _onSubmit = () => {
    const price = Swap.Calculate.targetPrice({
      usdt: isUsdtType,
      code: cryptoData?.id,
      isBuy,
      openPrice: Number(openPrice),
      roe: Number(rate),
      initMargins,
    });
    const targetPrice = Number(rate) <= 100000 ? price?.toFormat(Number(cryptoData?.baseShowPrecision)) : '-';

    setResult({ targetPrice });
  };

  const results = [[LANG('目标价格'), `${result.targetPrice} ${isUsdtType ? 'USDT' : 'USD'}`]];

  return (
    <>
      <ResultLayout disabled={!openPrice || !rate} onSubmit={_onSubmit}>
        <div className={'target-price-view'}>
          <QuoteSelect
            onChange={() => {
              _resetInputs();
            }}
          />
          <TradeTypeBar />
          <LeverSlider />
          <div className={'input-item'}>
            <div className={'label'}>{LANG('开仓价格')}</div>
            <PriceInput label = {null} value={openPrice} onChange={setOpenPrice} newPriceEnable />
          </div>
          <div className={'input-item'}>
            <div className={'label'}>{LANG('回报率')}</div>
            <RateOfReturnInput label={null} value={rate} onChange={setRate} />
          </div>
        </div>
        <Result results={results} />
      </ResultLayout>
      <style jsx>{styles}</style>
    </>
  );
};

const styles = css`
  .target-price-view {
    .input-item {
      >.label {
        color: var(--text_3);
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 16px;
      }

    }

  }
`;
export default TargetPriceView;
