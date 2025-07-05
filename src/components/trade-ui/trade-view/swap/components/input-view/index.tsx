import { DecimalInput } from '@/components/numeric-input';
import MinChangeInput from '@/components/trade-ui/trade-view/components/input/min-change-input';
import { useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';

import Input from '@/components/trade-ui/trade-view/components/input';
import { PriceTypeSelect } from '@/components/trade-ui/trade-view/swap/components/pricet-type-select';

import { OrderBookEmitter } from '@/core/events';
import { useEffect } from 'react';
import { VolUnitSelect } from './components/vol_unit_select';
import { clsx, styles } from './styled';
import OrderTypeSelect from '../input-view-header/components/order-type-select';
import { useSwapMinOrderVolumeState } from '@/core/hooks/src/use-swap-min-order-state';
import { Layer } from '@/components/constants';

export const InputView = ({ layer = Layer.Default }: { layer: Layer }) => {
  const { isDark } = useTheme();
  const { quoteId, priceUnitText, isUsdtType } = Swap.Trade.base;
  const inputPrice = Swap.Trade.store.price;
  const inputVolume = Swap.Trade.store.volume;
  const triggerPrice = Swap.Trade.store.triggerPrice;
  const triggerPriceType = Swap.Trade.store.triggerPriceType;
  // const isBuy = Swap.Trade.store.isBuy;
  const isMarginUnit = Swap.Info.getIsMarginUnit(isUsdtType);
  const cryptoData = Swap.Info.getCryptoData(quoteId);
  const flagPrice = Swap.Socket.getFlagPrice(quoteId);
  const { isMarket: isMarketType, isSpsl } = Swap.Trade.orderTradeType;
  const orderTradeType = Swap.Trade.store.orderTradeType;
  const { minChangePrice, baseShowPrecision } = cryptoData;
  // const baseSymbol = Swap.Trade.getBaseSymbol(quoteId);
  const { buyMinPrice, buyMaxPrice, sellMinPrice, sellMaxPrice } = Swap.Utils.formatCryptoPriceRange(
    flagPrice,
    cryptoData
  );

  const triggerPriceIsFlagPriceType = Swap.Trade.getPriceTypeIsFlag(triggerPriceType);
  let volumeMax = Number(Swap.Trade.maxVolumeNumber);
  let volumeDigit = Swap.Info.getVolumeDigit(quoteId);
  const balance = Swap.Assets.getDisplayBalance({ code: quoteId, walletId: Swap.Info.getWalletId(isUsdtType) });
  let balanceDigit = Swap.Assets.getBalanceDigit({ code: quoteId });
  if (isMarginUnit) {
    volumeDigit = balanceDigit;
    volumeMax = Number(balance.toFixed(balanceDigit));
  }

  const { minOrderVolume, volumeUnitText } = useSwapMinOrderVolumeState();

  useEffect(() => {
    const event = (price: string) => {
      Swap.Trade.onPriceChange(Swap.Utils.minChangeFormat(cryptoData.minChangePrice, price));
    };
    const emitter = OrderBookEmitter.on(OrderBookEmitter.ORDER_BOOK_ITEM_PRICE, event);
    return () => {
      emitter.off(OrderBookEmitter.ORDER_BOOK_ITEM_PRICE, event);
    };
  }, [cryptoData]);
  useEffect(() => {
    return () => {
      Swap.Trade.clearInputVolume();
    };
  }, []);
  return (
    <>
      <div className={clsx('input-view', !isDark && 'light')}>
        {isSpsl && (
          <>
            <div className={clsx('title')}>{LANG('触发价格')}</div>
            <Input
              layer={layer}
              aria-label={LANG('触发价格')}
              className={clsx('swap-input')}
              inputComponent={MinChangeInput}
              // label={LANG('触发价格')}
              type="number"
              value={triggerPrice}
              onChange={(v: any) => Swap.Trade.onTriggerPriceChange(v)}
              max={sellMaxPrice}
              min={buyMinPrice}
              step={minChangePrice || 1}
              digit={baseShowPrecision}
              blankDisplayValue=""
              enableMinChange={!triggerPriceIsFlagPriceType}
              controllerV3
              suffix={() => (
                <div className={clsx('price-suffix ')}>
                  <PriceTypeSelect onChange={v => Swap.Trade.onTriggerPriceTypeChange(v)} value={triggerPriceType} />
                </div>
              )}
            />
            <div className={clsx('title')}>{isMarketType ? LANG('市价') : LANG('限价')}</div>
            <Input
              layer={layer}
              aria-label={LANG('价格')}
              className={clsx('swap-input')}
              inputComponent={MinChangeInput}
              label={isMarketType ? LANG('市价') : ''}
              type="number"
              value={inputPrice}
              disabled={isMarketType}
              onChange={(v: any) => Swap.Trade.onPriceChange(v)}
              onBlur={(e: any, next: any) => {
                if (isMarketType) return;
                if (!Swap.Trade.store.price) {
                  Swap.Trade.onPriceChange(Swap.Utils.getNewestPrice());
                } else {
                  next();
                }
              }}
              max={sellMaxPrice}
              min={buyMinPrice}
              step={minChangePrice || 1}
              digit={baseShowPrecision}
              suffix={() => (
                <div className={clsx('price-suffix ')}>
                  <OrderTypeSelect
                    value={orderTradeType}
                    onChange={(type: any) => {
                      Swap.Trade.store.orderTradeType = type;
                      Swap.Trade.onPriceChange('');
                      Swap.Trade.clearInputVolume();
                    }}
                  />
                </div>
              )}
            />
          </>
        )}
        {!isSpsl && !isMarketType && (
          <>
            <div className={clsx('title')}>{LANG('价格')}</div>
            <Input
              layer={layer}
              controllerV3
              aria-label={LANG('价格')}
              className={clsx('swap-input')}
              inputComponent={MinChangeInput}
              // label={LANG('价格')}
              type="number"
              value={inputPrice}
              onChange={(v: any) => Swap.Trade.onPriceChange(v)}
              onBlur={(e: any, next: any) => {
                if (!Swap.Trade.store.price) {
                  Swap.Trade.onPriceChange(Swap.Utils.getNewestPrice());
                } else {
                  next();
                }
              }}
              // max={sellMaxPrice}
              // min={buyMinPrice}
              max={Number.MAX_SAFE_INTEGER}
              min={0}
              step={minChangePrice || 1}
              digit={baseShowPrecision}
              suffix={() => (
                <div className={clsx('price-suffix ')}>
                  <div
                    className={clsx('newest')}
                    onClick={() =>
                      Swap.Trade.onPriceChange(
                        Swap.Utils.minChangeFormat(cryptoData.minChangePrice, Swap.Utils.getNewestPrice())
                      )
                    }
                  >
                    {LANG('最新价')}
                  </div>
                  {
                    // <div className={clsx('unit')}>{priceUnitText}</div>
                  }
                </div>
              )}
            />
          </>
        )}
        <div className={clsx('title')}>{LANG('数量')}</div>
        <Input
          layer={layer}
          placeholder={`${LANG('最小')} ${minOrderVolume}`}
          aria-label={LANG('数量')}
          className={clsx('swap-input')}
          component={DecimalInput}
          // label={isMarginUnit ? LANG('保证金') : LANG('数量')}
          type="number"
          value={inputVolume}
          onChange={(v: any) => Swap.Trade.onVolumeChange(v)}
          // max={volumeMax}
          max={Number.MAX_SAFE_INTEGER}
          min={0}
          digit={volumeDigit}
          blankDisplayValue=""
          suffix={() => <VolUnitSelect />}
        />
      </div>
      {styles}
    </>
  );
};

export default InputView;
