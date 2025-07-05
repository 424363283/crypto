import { Layer } from '@/components/constants';
import { useResponsive } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { clsx, MediaInfo } from '@/core/utils';
import { memo } from 'react';

const _TradePositionMode = ({ layer = Layer.Default }: { layer?: Layer }) => {
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
      <div className={clsx('position-mode')}>
        <div className={clsx('bar', `layer${layer}`)}>
          <div onClick={() => onChange(OPEN)} data-active={positionMode === OPEN}>
            <span>{LANG('开仓')}</span>
          </div>
          <div onClick={() => onChange(CLOSE)} data-active={positionMode === CLOSE}>
            <span>{LANG('平仓')}</span>
          </div>
        </div>
      </div>
      <style jsx>
        {`
          .position-mode {
            display: flex ;
            align-items: center;
            height: 40px;
            .bar {
              flex: 1 auto;
              display: flex;
              height: 32px;
              gap: 2px;
              justify-content: space-between;
              align-items: center;
              flex-shrink: 0;
              border-radius: 8px;
              &.layer1 {
                background: var(--fill_3);
              }
              &.layer2 {
                background: var(--fill_1);
              }
              @media ${MediaInfo.mobile} {
                margin: 0 0.5rem;
                margin-top: 8px;
                height: 2rem;
                border-radius: 8px;
                // padding: 0 0.5rem;
              }
              > div {
                cursor: pointer;
                display: flex;
                flex: 1 auto;
                height: 30px;
                padding: 10px;
                justify-content: center;
                align-items: center;
                gap: 10px;
                border-radius: 8px;
                color: var(--text_2);
                @media ${MediaInfo.mobile} {
                  padding: 0;
                }
                &[data-active='true'] {
                  color: var(--text_white);
                  border-radius: 8px;
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
          }
        `}
      </style>
    </>
  );
};

export const TradePositionMode = memo(_TradePositionMode);
