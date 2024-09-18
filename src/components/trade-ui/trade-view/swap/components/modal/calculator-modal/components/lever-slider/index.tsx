import Slider from '@/components/trade-ui/trade-view/components/slider';
import { useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { clsx } from '@/core/utils';
import { store, useRiskList, useStore } from '../../store';

export const LeverSlider = () => {
  const { isDark } = useTheme();
  const { cryptoData } = useStore();
  const { maxAmount, maxAmountError } = useRiskList();
  const _value = store.lever;
  const max = cryptoData.leverageLevel;
  const percent = _value ? (_value / max) * 100 : 0;
  const leverList = cryptoData.leverageConfig;
  const grid = leverList.length;

  const inputProps = {
    type: 'range',
    step: 1,
    min: 1,
    max: max,
    onChange: (e: any) => (store.lever = e),
    value: _value,
  };

  return (
    <>
      <div className={clsx('wrapper', !isDark && 'light')}>
        <Slider
          isDark={isDark}
          percent={percent}
          grid={grid}
          grids={leverList}
          renderText={() => `${_value}X`}
          {...inputProps}
        />
        <div className={'items'}>
          {leverList.map((v, i, arr) => {
            const active = _value >= v;
            const left = v === inputProps.min ? 0 : ((v + inputProps.min / 2) / max) * 100;

            return (
              <div key={i} style={{ left: `${Math.min(left, 100)}%` }} className={clsx('item', active && 'active')}>
                {v}X
              </div>
            );
          })}
        </div>
        <div className={clsx('info', maxAmountError && 'error')}>
          {LANG('当前杠杆倍数最高可持有头寸')}:{' '}
          <span className={clsx()}>
            {maxAmount} {cryptoData?.settleCoin}
          </span>
        </div>
      </div>
      <style jsx>{`
        .wrapper {
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          height: 100px;
          padding-top: 5px;
          margin-bottom: 19px;
          .items {
            position: relative;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            height: 16px;
            .item {
              position: absolute;
              user-select: none;

              margin-top: -2px;
              width: 16px;
              white-space: nowrap;
              text-align: center;
              font-size: 12px;
              font-weight: 400;
              color: var(--theme-trade-text-color-4);
              display: flex;
              justify-content: center;
              align-items: center;
              &.active {
                color: var(--theme-trade-text-color-3);
              }
              &:nth-child(n + 2) {
                transform: translateX(-50%);
                margin-left: 3px;
              }
              &:last-child {
                margin-left: -3px;
                transform: translateX(-50%);
              }
            }
          }
          .info {
            margin-top: 16px;
            line-height: 12px;
            font-size: 12px;
            font-weight: 400;
            color: var(--theme-trade-text-color-3);
            &.error {
              &,
              span {
                color: var(--color-error) !important;
              }
            }
            span {
              margin-left: 2px;
              color: var(--theme-trade-text-color-1);
            }
          }
        }
      `}</style>
    </>
  );
};

export default LeverSlider;
