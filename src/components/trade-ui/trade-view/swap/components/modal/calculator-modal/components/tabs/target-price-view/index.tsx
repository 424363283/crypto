import { useState } from 'react';

import { PriceInput, RateOfReturnInput } from '../../input';
import { LeverSlider } from '../../lever-slider';
import { Result, ResultLayout } from '../../result';
import { QuoteSelect } from '../../select';
import { TradeTypeBar } from '../../trade-type-bar';

import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { useStore } from '../../../store';

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
    <ResultLayout disabled={!openPrice || !rate} onSubmit={_onSubmit}>
      <div>
        <QuoteSelect
          onChange={() => {
            _resetInputs();
          }}
        />
        <TradeTypeBar />
        <LeverSlider />
        <PriceInput value={openPrice} onChange={setOpenPrice} newPriceEnable />
        <RateOfReturnInput value={rate} onChange={setRate} />
      </div>
      <Result results={results} />
    </ResultLayout>
  );
};

export default TargetPriceView;
