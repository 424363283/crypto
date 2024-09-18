import { InfoHover } from '@/components/trade-ui/common/info-hover';
import Tooltip from '@/components/trade-ui/common/tooltip';
import { useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';
import { store } from '../../store';

import { useCalc } from '../../store';

export const VolumeView = () => {
  const { isDark } = useTheme();
  const { quoteId, isUsdtType } = Swap.Trade.base;
  let volumeUnit = Swap.Trade.getUnitText();
  let digit = Swap.Info.getVolumeDigit(quoteId);
  volumeUnit = /^[0-9]/.test(volumeUnit) ? ` ${volumeUnit}` : volumeUnit;
  const { calcMax, getInputVolume } = useCalc();
  const { volume } = store;

  const buyMaxVolume = calcMax({ isBuy: true });
  const sellMaxVolume = calcMax({ isBuy: false });

  let buyInputVolume = Swap.Calculate.formatPositionNumber({
    usdt: isUsdtType,
    code: quoteId,
    value: getInputVolume({ isBuy: true, maxVolume: buyMaxVolume }),
    fixed: digit,
  }).toFixed(digit);
  let sellInputVolume = Swap.Calculate.formatPositionNumber({
    usdt: isUsdtType,
    code: quoteId,
    value: getInputVolume({ isBuy: false, maxVolume: sellMaxVolume }),
    fixed: digit,
  }).toFixed(digit);

  return (
    <>
      <div className={clsx('bottom-view', !isDark && 'light')}>
        <InfoRow
          label1={LANG('买入')}
          value1={buyInputVolume}
          label2={LANG('卖出')}
          value2={sellInputVolume}
          tips={LANG('提交此委托所需的保证金。减仓不需要保证金')}
          unit={volumeUnit}
        />
      </div>
      {styles}
    </>
  );
};

export const InfoRow = ({
  label1,
  value1,
  label2,
  value2,
  tips,
  unit,
  unit2,
}: {
  label1: string;
  value1: any;
  label2?: string;
  value2?: any;
  tips?: string;
  unit: string;
  unit2?: string;
}) => {
  const renderLabel = (label?: string, tips?: string) =>
    !tips ? (
      <div className={clsx('label', 'label-color')}>{label}</div>
    ) : (
      <Tooltip placement='topLeft' title={tips}>
        <InfoHover className={clsx('label', 'label-color')}>{label}</InfoHover>
      </Tooltip>
    );

  return (
    <>
      <div className={clsx('info-row')}>
        <div className={clsx()}>
          {renderLabel(label1, tips)}
          <div className={clsx('value')}>
            <span className={clsx()}>{value1}</span>
            <span className={clsx()}>{unit}</span>
          </div>
        </div>
        <div className={clsx()}>
          {renderLabel(label2, tips)}
          <div className={clsx('value')}>
            <span className={clsx()}>{value2}</span>
            <span className={clsx()}>{unit2 || unit}</span>
          </div>
        </div>
      </div>
      <style jsx>{`
        .info-row {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;

          :global(.label-color) {
            color: var(--theme-trade-text-color-2);
          }
          .line {
            margin: 15px 0;
            height: 1px;
            background-color: var(--theme-trade-border-color-2);
            width: 100%;
          }
          > div {
            display: flex;
            flex-direction: row;
            align-items: center;
            &:last-child {
              flex-direction: row-reverse;
              align-items: center;
              .value {
                margin-right: 4px;
              }
            }
            .label {
              line-height: 16px;
              font-size: 14px;
              font-weight: 400;
              white-space: nowrap;
            }
            .value {
              line-height: 16px;
              font-size: 14px;
              font-weight: 400;
              margin-left: 4px;
              color: var(--theme-trade-text-color-1);
            }
            &:first-child {
              margin-right: 10px;
            }
            &:last-child {
              justify-content: flex-end;
              * {
                text-align: right;
              }
            }
          }
        }
      `}</style>
    </>
  );
};

export const { className, styles } = css.resolve`
  .bottom-view {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-top: 14px;
  }
`;
const clsx = clsxWithScope(className);
