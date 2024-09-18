import { useEffect, useState } from 'react';

import { BalanceInput, PriceInput, VolumeInput } from '../../input';
import { LeverSlider } from '../../lever-slider';
import { Result, ResultLayout } from '../../result';
import { MARGIN_TYPES, MarginType, QuoteSelect } from '../../select';
import { TradeTypeBar } from '../../trade-type-bar';

import { LANG } from '@/core/i18n';
import { useRiskList, useStore } from '../../../store';

import { Swap } from '@/core/shared';
import { clsx, styles } from './styled';

export const LiquidationPriceView = () => {
  const { maxAmount, setMaxAmountError, getMaintenanceMargins } = useRiskList();
  const { quoteId, isUsdtType, lever, cryptoData, marginType, initMargins, isBuy } = useStore();
  const [result, setResult] = useState<any>({
    liquidationPriceView: '--',
    balanceTooSmallError: false,
  });
  const [disabled, setDisabled] = useState(false);

  // inputs
  const [openPrice, setOpenPrice] = useState('');
  const [balance, setBalance] = useState('');
  const [volume, setVolume] = useState('');

  const { contractFactor, baseShowPrecision } = cryptoData;
  const isCross = marginType === MARGIN_TYPES.ALL;
  const _resetInputs = () => {
    setOpenPrice('');
    setBalance('');
    setVolume('');
  };

  const results = [[LANG('强平价格'), `${result.liquidationPriceView} ${isUsdtType ? 'USDT' : 'USD'}`]];

  useEffect(() => {
    let _number: any = volume;
    if (isUsdtType) {
      _number = Swap.Calculate.amountToVolume({
        usdt: isUsdtType,
        isVolUnit: false,
        value: _number,
        code: cryptoData?.id,
        flagPrice: Number(openPrice),
      });
    }
    if (openPrice && volume && (isCross ? balance : true)) {
      let _amount = _number.mul(contractFactor).div(openPrice);
      if (isUsdtType) {
        _amount = _number.mul(contractFactor).mul(openPrice);
      }
      if (_amount > maxAmount) {
        setDisabled(true);

        setMaxAmountError(true);
      } else {
        setDisabled(false);

        setMaxAmountError(false);
      }
    } else {
      setDisabled(true);

      setMaxAmountError(false);
    }
  }, [openPrice, volume, balance, contractFactor, maxAmount, isCross]);

  const _onSubmit = () => {
    let next = Number(volume);
    const code = cryptoData?.id;
    // const PMI = FCR(((Vol * S) / HP) * initMargins); // vol*s/hp*imr+addMargin （注: 这里的IMR=1/杠杆，addmargin为逐仓手工增加+减少的金额）
    if (isUsdtType) {
      next = Swap.Calculate.amountToVolume({
        usdt: isUsdtType,
        isVolUnit: false,
        value: next,
        code,
        flagPrice: Number(openPrice),
      });
    }
    const maintenanceMargins = getMaintenanceMargins(openPrice, next);

    // 保证金
    const margin = Swap.Calculate.commissionCost({
      usdt: isUsdtType,
      code,
      inputVolume: next,
      initMargins,
      isBuy,
      isLimitType: true,
      lever,
      flagPrice: Number(openPrice),
      inputPrice: Number(openPrice),
      maxVolume: next,
      positionMode: true,
    });
    let price = Swap.Calculate.liquidationPrice({
      usdt: isUsdtType,
      code,
      volume: next,
      lever,
      openPrice: Number(openPrice),
      accb: 0,
      margin: isCross ? Number(balance) : Number(margin),
      mmr: maintenanceMargins,
      isBuy,
      isCross,
      fixed: baseShowPrecision,
    });

    const _balanceTooSmallError = isCross ? Number(balance) < Number(margin) : false;
    setResult({
      liquidationPriceView: _balanceTooSmallError
        ? 0
        : price <= 0 || price > 1000000
        ? 0
        : price.toFormat(baseShowPrecision),
      balanceTooSmallError: _balanceTooSmallError,
    });
  };
  return (
    <>
      <ResultLayout disabled={disabled} onSubmit={_onSubmit}>
        <div>
          <div className={clsx('select-row')}>
            <QuoteSelect
              onChange={() => {
                _resetInputs();
              }}
            />
            <MarginType />
          </div>
          <TradeTypeBar />
          <LeverSlider />
          <PriceInput value={openPrice} onChange={setOpenPrice} newPriceEnable />
          <VolumeInput value={volume} onChange={setVolume} />
          {isCross && (
            <div className={clsx('balance-input-wrapper')}>
              <BalanceInput value={balance} onChange={setBalance} className={clsx('balance-input')} />
              {result.balanceTooSmallError && (
                <div className={clsx('error')}>{LANG('钱包余额不满足开此仓位最少起始保证金')}</div>
              )}
            </div>
          )}
        </div>
        <Result
          results={results}
          tips={LANG('強平價格的計算考慮了您現有的持倉，持有倉位的未實現盈虧和占用保證金將影響強平價格計算。')}
        />
      </ResultLayout>
      {styles}
    </>
  );
};

export default LiquidationPriceView;
