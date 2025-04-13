import Input from '@/components/trade-ui/trade-view/components/input';
import MinChangeInput from '@/components/trade-ui/trade-view/components/input/min-change-input';
import { PriceTypeSelect } from '@/components/trade-ui/trade-view/swap/components/pricet-type-select';
import { useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { clsx, MediaInfo } from '@/core/utils';
import css from 'styled-jsx/css';

export const SpslInputs = () => {
  const spslMode = Swap.Trade.store.spslMode;
  const { stopProfitPrice, stopLossPrice, stopProfitPriceType, stopLossPriceType, editEnable } = spslMode;

  const { isDark } = useTheme();

  const { quoteId, priceUnitText } = Swap.Trade.base;
  const cryptoData = Swap.Info.getCryptoData(quoteId);
  const { minChangePrice, baseShowPrecision } = cryptoData;
  const _minChangePrice = minChangePrice || 1;

  if (!spslMode.enable) {
    return <></>;
  }
  return (
    <>
      <div className="spsl-section">
        {editEnable ? (
          <div className={clsx('spsl-info', !isDark && 'light')}>
            {spslMode.stopProfitEnable && (
              <div>
                <div>{LANG('止盈')}</div>
                <div>
                  {stopProfitPrice} {priceUnitText}
                </div>
              </div>
            )}
            {spslMode.stopLossEnable && (
              <div>
                <div>{LANG('止损')}</div>
                <div>
                  {stopLossPrice} {priceUnitText}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className={clsx('spsl-inputs')}>
            <Input
              aria-label={LANG('止盈')}
              inputComponent={MinChangeInput}
              label={LANG('止盈')}
              type="number"
              value={stopProfitPrice}
              onChange={(stopProfitPrice: any) => Swap.Trade.onChangeSpslSetting({ stopProfitPrice })}
              min={0}
              step={_minChangePrice}
              digit={baseShowPrecision}
              blankDisplayValue=""
              enableMinChange={stopProfitPriceType == Swap.Trade.PRICE_TYPE.NEW}
              suffix={() => (
                <PriceTypeSelect
                  onChange={stopProfitPriceType => {
                    const next: any = { stopProfitPriceType };
                    if (stopProfitPriceType == Swap.Trade.PRICE_TYPE.NEW && Number(stopProfitPrice) > 0) {
                      next.stopProfitPrice = Swap.Utils.minChangeFormat(_minChangePrice, stopProfitPrice);
                    }
                    Swap.Trade.onChangeSpslSetting(next);
                  }}
                  value={stopProfitPriceType}
                />
              )}
            />
            <Input
              aria-label={LANG('止损')}
              inputComponent={MinChangeInput}
              label={LANG('止损')}
              type="number"
              value={stopLossPrice}
              onChange={(stopLossPrice: any) => Swap.Trade.onChangeSpslSetting({ stopLossPrice })}
              min={0}
              step={_minChangePrice}
              digit={baseShowPrecision}
              blankDisplayValue=""
              enableMinChange={stopLossPriceType == Swap.Trade.PRICE_TYPE.NEW}
              suffix={() => (
                <PriceTypeSelect
                  onChange={stopLossPriceType => {
                    const next: any = { stopLossPriceType };
                    if (stopLossPriceType == Swap.Trade.PRICE_TYPE.NEW && Number(stopLossPrice) > 0) {
                      next.stopLossPrice = Swap.Utils.minChangeFormat(_minChangePrice, stopLossPrice);
                    }
                    Swap.Trade.onChangeSpslSetting(next);
                  }}
                  value={stopLossPriceType}
                />
              )}
            />
          </div>
        )}
      </div>
      <style jsx>{styles}</style>
    </>
  );
};

const styles = css`
  .spsl-section {
    .spsl-inputs {
      margin-top: 10px;

      & > *:last-child {
        margin-bottom: 0;
      }
      :global(input) {
        padding-left: 10px;
      }
    }
    .spsl-info {
      margin-top: 5px;
      > div {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        > div:first-child {
          font-size: 14px;
          font-weight: 400;
          color: var(--theme-trade-text-color-2);
        }
        > div:last-child {
          font-size: 14px;
          font-weight: 400;
          color: var(--theme-trade-text-color-1);
        }
      }
    }
  }
`;
