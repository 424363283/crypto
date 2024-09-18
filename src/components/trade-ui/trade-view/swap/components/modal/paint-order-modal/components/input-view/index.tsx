import { DecimalInput } from '@/components/numeric-input';
import MinChangeInput from '@/components/trade-ui/trade-view/components/input/min-change-input';
import { useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';

import Input from '@/components/trade-ui/trade-view/components/input';

import { VolUnitSelect } from './components/vol_unit_select';
import { clsx, styles } from './styled';

import { PriceTypeSelect } from '../../../../pricet-type-select';
import { store, useCalc } from '../../store';

export const InputView = ({ visible }: { visible: boolean }) => {
  const { isDark } = useTheme();
  const { quoteId, priceUnitText, isUsdtType } = Swap.Trade.base;
  // const isBuy = Swap.Trade.store.isBuy;
  const isMarginUnit = Swap.Info.getIsMarginUnit(isUsdtType);
  const cryptoData = Swap.Info.getCryptoData(quoteId);
  const flagPrice = Swap.Socket.getFlagPrice(quoteId);
  const { isMarket: isMarketType, isSpsl } = Swap.Trade.formatOrderTradeType(store.orderTradeType);
  const { minChangePrice, baseShowPrecision } = cryptoData;
  // const baseSymbol = Swap.Trade.getBaseSymbol(quoteId);
  const { buyMinPrice, buyMaxPrice, sellMinPrice, sellMaxPrice } = Swap.Utils.formatCryptoPriceRange(
    flagPrice,
    cryptoData
  );

  const { volume: inputVolume, volumeRate, price: inputPrice, triggerPrice, triggerPriceType } = store;
  const triggerPriceIsFlagPriceType = Swap.Trade.getPriceTypeIsFlag(triggerPriceType);
  const { calcMax } = useCalc();
  let volumeDigit = Swap.Info.getVolumeDigit(quoteId);

  const buyMaxVolume = Swap.Calculate.formatPositionNumber({
    usdt: isUsdtType,
    code: quoteId,
    value: calcMax({ isBuy: true }) || 0,
    fixed: volumeDigit,
    flagPrice,
  });
  const sellMaxVolume = Swap.Calculate.formatPositionNumber({
    usdt: isUsdtType,
    code: quoteId,
    value: calcMax({ isBuy: false }) || 0,
    fixed: volumeDigit,
    flagPrice,
  });

  // let buyInputVolume = (Number(inputVolume) > Number(buyMaxVolume) ? buyMaxVolume : inputVolume).toFixed(volumeDigit);
  // let sellInputVolume = (Number(inputVolume) > Number(sellMaxVolume) ? sellMaxVolume : inputVolume).toFixed(
  //   volumeDigit
  // );
  let volumeMax = Number(buyMaxVolume > sellMaxVolume ? buyMaxVolume : sellMaxVolume);
  const balance = Swap.Assets.getDisplayBalance({ code: quoteId, walletId: Swap.Info.getWalletId(isUsdtType) });
  let balanceDigit = Swap.Assets.getBalanceDigit({ code: quoteId });
  if (isMarginUnit) {
    volumeDigit = balanceDigit;
    volumeMax = Number(balance.toFixed(balanceDigit));
  }
  return (
    <>
      <div className={clsx('input-view', !isDark && 'light')}>
        {isSpsl && (
          <Input
            aria-label={LANG('触发价格')}
            className={clsx('swap-input')}
            inputComponent={MinChangeInput}
            label={LANG('触发价格')}
            type='number'
            value={triggerPrice}
            onChange={(v: any) => {
              store.triggerPrice = `${v || ''}`;
            }}
            max={sellMaxPrice}
            min={buyMinPrice}
            step={minChangePrice || 1}
            digit={baseShowPrecision}
            blankDisplayValue=''
            enableMinChange={!triggerPriceIsFlagPriceType}
            suffix={() => (
              <PriceTypeSelect
                onChange={(v) => {
                  const triggerPrice = store.triggerPrice;
                  const cryptoData = Swap.Info.getCryptoData(quoteId);

                  if (!Swap.Trade.getPriceTypeIsFlag(v) && Number(triggerPrice) > 0) {
                    store.triggerPrice = `${Swap.Utils.minChangeFormat(cryptoData.minChangePrice, triggerPrice) || ''}`;
                  }

                  store.triggerPriceType = v;
                }}
                value={triggerPriceType}
              />
            )}
          />
        )}
        {!isMarketType && (
          <Input
            aria-label={LANG('价格')}
            className={clsx('swap-input')}
            inputComponent={MinChangeInput}
            label={LANG('价格')}
            type='number'
            value={inputPrice}
            onChange={(v: any) => {
              store.price = `${v || ''}`;
            }}
            onBlur={(e: any, next: any) => {
              if (!Swap.Trade.store.price) {
                store.price = `${Swap.Utils.getNewPrice(quoteId) || ''}`;
              } else {
                next();
              }
            }}
            max={sellMaxPrice}
            min={buyMinPrice}
            step={minChangePrice || 1}
            digit={baseShowPrecision}
            suffix={() => (
              <div className={clsx('price-suffix')}>
                <div className={clsx('unit')}>{priceUnitText}</div>
              </div>
            )}
          />
        )}
        <Input
          aria-label={LANG('数量')}
          className={clsx('swap-input')}
          component={DecimalInput}
          label={isMarginUnit ? LANG('保证金') : LANG('数量')}
          type='number'
          value={inputVolume}
          onChange={(v: any) => {
            store.volume = `${v || ''}`;
            store.volumeRate = 0;
          }}
          max={volumeMax}
          min={0}
          digit={volumeDigit}
          blankDisplayValue=''
          suffix={() => <VolUnitSelect />}
        />
        <div className={clsx('lever-list')}>
          {[1, 2, 3, 4].map((v: any, i: number) => {
            const value = v * 25;
            return (
              <div
                className={clsx(value <= volumeRate && 'active')}
                onClick={() => {
                  store.volume = (volumeMax * (value / 100)).toFixed(volumeDigit);
                  store.volumeRate = value;
                }}
                key={i}
              >
                <div className={clsx()}></div>
                <span className={clsx()}>{value}%</span>
              </div>
            );
          })}
        </div>
      </div>
      {styles}
    </>
  );
};

export default InputView;
