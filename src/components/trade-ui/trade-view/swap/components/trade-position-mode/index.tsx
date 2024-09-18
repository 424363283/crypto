import { useResponsive } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { clsx } from '@/core/utils';
import { memo } from 'react';

const _TradePositionMode = () => {
  const twoWayMode = Swap.Trade.twoWayMode;
  const { isMobile } = useResponsive();
  const { OPEN, CLOSE } = Swap.Trade.POSITION_MODE;
  const positionMode = Swap.Trade.store.positionMode;

  const onChange = (value: string) => {
    Swap.Trade.resetSpslSetting();
    Swap.Trade.clearInputVolume();
    Swap.Trade.setPositionMode(value);
  };

  if (!twoWayMode) return <></>;

  return (
    <>
      <div className={clsx('root')}>
        <div onClick={() => onChange(OPEN)} data-active={positionMode === OPEN}>
          <span>{LANG('开仓')}</span>
        </div>
        <div onClick={() => onChange(CLOSE)} data-active={positionMode === CLOSE}>
          <span>{LANG('平仓')}</span>
        </div>
      </div>
      <style jsx>
        {`
          .root {
            display: flex;
            flex-direction: row;
            margin-bottom: 25px;
            height: 35px;
            border-radius: 8px;
            padding: 3px;
            margin: 0 ${isMobile ? '0' : '10px'} 15px;
            background: var(--theme-trade-bg-color-8);
            > div {
              cursor: pointer;
              position: relative;
              flex: 1;
              display: flex;
              justify-content: center;
              align-items: center;
              cursor: pointer;
              user-select: none;
              border-radius: 8px;
              color: var(--theme-trade-text-color-1);

              &[data-active='true'] {
                color: var(--theme-dark-text-1);
                &:first-child {
                  background: var(--color-green);
                }
                &:last-child {
                  background: var(--color-red);
                }
              }
              span {
                font-size: 12px;
                font-weight: 400;
                color: inherit;
              }
            }
          }
        `}
      </style>
    </>
  );
};

export const TradePositionMode = memo(_TradePositionMode);
