import { useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

import { InfoRow } from '../volume-view';

import { store, useCalc } from '../../store';
export const useMaxVolume = () => {
  const { quoteId, isUsdtType } = Swap.Trade.base;
  const { calcMax } = useCalc();
  const twoWayMode = Swap.Trade.twoWayMode;
  const { onlyReducePosition } = store;
  const positionData = Swap.Order.getPosition(isUsdtType);

  const getMaxVolume = (isBuy: boolean) => {
    let maxVolume = calcMax({ isBuy: isBuy });

    if (!twoWayMode && onlyReducePosition) {
      const item = positionData.find((v: any) => {
        if (v.symbol.toUpperCase() === quoteId) {
          return v;
        }
      });

      if (item != null) {
        const itemBuy = item?.['side'] === '1';

        maxVolume = itemBuy == isBuy ? 0 : Number(item?.currentPosition || 0);
      } else {
        maxVolume = 0;
      }
    }
    const maxVolumeFormat = Swap.Calculate.formatPositionNumber({
      usdt: isUsdtType,
      code: quoteId,
      value: maxVolume,
      fixed: Swap.Info.getVolumeDigit(quoteId, { withHooks: false }),
    });
    return { maxVolume, maxVolumeFormat };
  };

  return { getMaxVolume };
};
export const BottomView = ({ wrapperClassName }: { wrapperClassName?: string }) => {
  const { isDark } = useTheme();
  const { quoteId } = Swap.Trade.base;
  const cryptoData = Swap.Info.getCryptoData(quoteId);
  let volumeUnit = Swap.Trade.getUnitText();
  volumeUnit = /^[0-9]/.test(volumeUnit) ? ` ${volumeUnit}` : volumeUnit;
  const volFormat = (v: any) => v?.toFixed(Swap.Info.getVolumeDigit(quoteId, { withHooks: false }));
  const { calcMargin, calcMax, getInputVolume } = useCalc();
  const { getMaxVolume } = useMaxVolume();
  const { maxVolume: buyMaxVolume, maxVolumeFormat: buyMaxVolumeFormat } = getMaxVolume(true);
  const { maxVolume: sellMaxVolume, maxVolumeFormat: sellMaxVolumeFormat } = getMaxVolume(false);

  const buyInputVolume = getInputVolume({ isBuy: true, maxVolume: buyMaxVolume });
  const sellInputVolume = getInputVolume({ isBuy: false, maxVolume: sellMaxVolume });
  const buyMargin = calcMargin({ isBuy: true, maxVolume: buyMaxVolume, inputVolume: buyInputVolume });
  const sellMargin = calcMargin({ isBuy: false, maxVolume: sellMaxVolume, inputVolume: sellInputVolume });

  return (
    <>
      <div className={clsx('bottom-view', !isDark && 'light')}>
        <InfoRow
          label1={LANG('保证金')}
          value1={buyMargin}
          label2={LANG('保证金')}
          value2={sellMargin}
          tips={LANG('提交此委托所需的保证金。减仓不需要保证金')}
          unit={cryptoData.settleCoin}
        />
        <InfoRow
          label1={LANG('可开')}
          value1={volFormat(buyMaxVolumeFormat)}
          label2={LANG('可开')}
          value2={volFormat(sellMaxVolumeFormat)}
          unit={volumeUnit}
        />
      </div>
      {styles}
    </>
  );
};

const { className, styles } = css.resolve`
  .bottom-view {
    flex: 1;
    display: flex;
    flex-direction: column;
    > :global(*) {
      margin-bottom: 15px;
    }
  }
  .label-color {
    color: var(--theme-trade-text-color-2);
  }
  .line {
    margin: 15px 0;
    height: 1px;
    background-color: var(--theme-trade-border-color-2);
    width: 100%;
  }
`;
const clsx = clsxWithScope(className);
