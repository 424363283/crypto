import { useState } from 'react';

import { BalanceInput, PriceInput } from '../../input';
import { LeverSlider } from '../../lever-slider';
import { Result, ResultLayout } from '../../result';
import { QuoteSelect } from '../../select';
import { TradeTypeBar } from '../../trade-type-bar';

import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { useRiskList, useStore } from '../../../store';

export const CanBeOpenedView = () => {
  const [result, setResult] = useState({ openBalance: '--', openVolume: '--' });
  const { quoteId, isUsdtType, lever, cryptoData } = useStore();
  // inputs
  const [openPrice, setOpenPrice] = useState('');
  const [balance, setBalance] = useState('');
  const { basePrecision } = cryptoData;
  const baseSymbol = Swap.Trade.getBaseSymbol(quoteId);
  const unit = Swap.Info.getUnitText({
    symbol: cryptoData.id,
    isVolUnit: true,
    volume: LANG('张'),
  });
  const { maxAmount } = useRiskList();
  const _resetInputs = () => {
    setOpenPrice('');
    setBalance('');
  };
  const _onSubmit = () => {
    const { value, volume } = Swap.Calculate.canBeOpened({
      usdt: isUsdtType,
      code: cryptoData?.id,
      maxAmount,
      openPrice: Number(openPrice ?? 0),
      balance: Number(balance ?? 0),
      lever,
    });

    setResult({
      openBalance: value?.toFormat(basePrecision),
      openVolume: volume?.toFormat(0),
    });
  };

  const results = [
    [`${LANG('可开')}(${baseSymbol})`, `${result.openBalance} ${baseSymbol}`],
    [`${LANG('可开')}(${unit})`, `${result.openVolume} ${unit}`],
  ];

  return (
    <ResultLayout disabled={!openPrice || !balance} onSubmit={_onSubmit}>
      <div>
        <QuoteSelect
          onChange={() => {
            _resetInputs();
          }}
        />
        <TradeTypeBar />
        <LeverSlider />
        <PriceInput value={openPrice} onChange={setOpenPrice} newPriceEnable />
        <BalanceInput value={balance} onChange={setBalance} />
      </div>
      <Result results={results} tips={LANG('在计算最大可开数量时将不考虑您的开仓损失。')} />
    </ResultLayout>
  );
};

export default CanBeOpenedView;
