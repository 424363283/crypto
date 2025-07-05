import CommonIcon from '@/components/common-icon';
import AppInput, { DecimalInput } from '@/components/numeric-input';
import { Svg } from '@/components/svg';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { useAppContext } from '@/core/store';
import { useRef, useState, useEffect } from 'react';
import { useDrag } from './use-drag';

export const LightningOrder = () => {
  const dragRef = useRef<any>();
  const inputRef = useRef<any>();
  const { locale } = useAppContext();
  const { ref, state, onMouseDown, onMouseUp } = useDrag({
    dragElement: dragRef.current,
    topHeight: 64,
    bottomHeight: 38
  });
  const [value, setValue] = useState('');
  const { quoteId, priceUnitText, isUsdtType } = Swap.Trade.base;
  const { sell1Price, buy1Price } = Swap.Info.store.depth;
  let eleWidth = 370;
  if (locale === 'id') {
    eleWidth = 388;
  }
  const max = Swap.Trade.formatPositionNumber(
    Math.max(
      Swap.Trade.getMaxVolume({ isBuy: true, onlyOpenPosition: true }),
      Swap.Trade.getMaxVolume({ isBuy: false, onlyOpenPosition: true })
    ),
    Swap.Info.getVolumeDigit(quoteId)
  );
  const onOrder = (isBuy: boolean) => {
    // setValue('');
    // Swap.Trade.onLightningOrder({ isBuy: isBuy, value: value });

    Swap.Trade.onPlaceAnOrder({ buy: isBuy, inputVolume: value, direct: true });
  };
  useEffect(() => {
    setValue('');
  }, [Swap.Info.getUnitText({ symbol: quoteId })]);

  const changeValFun = e => {
    setValue(e);
    // if (Number(e) <= Number(max)) {
    //   setValue(e)
    // } else {
    //   setValue(max)
    // }
  };
  return (
    <>
      <div
        className="lightning-order"
        style={{
          left: state.pos.x,
          top: state.pos.y
        }}
        ref={dragRef}
      >
        <div className="btn" ref={ref} onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
          <Svg src="/static/images/swap/lightning_order/menu.svg" width={12} />
        </div>
        <div className="content">
          <div className="price buy" onClick={() => onOrder(true)}>
            <span>{LANG('做多')}</span>
            {sell1Price}
          </div>
          <div
            className="ipnut-wrapper"
            onClick={() => {
              inputRef.current?.focus();
              setValue('');
            }}
          >
            <div
              className="label"
              onClick={async () => {
                await Swap.Trade.setModal({ selectUnitVisible: true });
                setValue('');
              }}
            >
              {LANG('数量')}({Swap.Info.getUnitText({ symbol: quoteId })})
              <CommonIcon className="icon" name="common-tiny-triangle-down" size={16} />
            </div>
            <AppInput
              inputRef={inputRef}
              type="text"
              // component={DecimalInput}
              className={'my-input'}
              onChange={e => changeValFun(e?.target?.value)}
              placeholder={LANG('请输入数量')}
              // placeholder={Swap.Info.getUnitText({ symbol: quoteId })}
              max={Number(max)}
              min={0}
              digit={Swap.Info.getVolumeDigit(quoteId)}
              blankDisplayValue=""
              value={value}
            />
          </div>
          <div className="price sell" onClick={() => onOrder(false)}>
            <span>{LANG('做空')}</span>
            {buy1Price}
          </div>
        </div>
        <div className="btn" onClick={() => Swap.Info.setTradePreference(isUsdtType, { lightningOrder: false })}>
          <Svg src="/static/images/swap/lightning_order/close.svg" width={12} />
        </div>
      </div>
      <style jsx>{`
        .lightning-order {
          z-index: var(--zindex-trade-swap-lightning-order);
          background-color: var(--theme-trade-bg-color-3);
          position: absolute;
          height: 41px;
          left: '10%';
          display: flex;
          flex-direction: row;
          align-items: center;
          border-radius: 3px;
          box-shadow: var(--theme-trade-select-shadow);
          width: ${eleWidth}px;
          &,
          & :global(*) {
            user-select: none;
          }
          .btn {
            flex: none;
            height: inherit;
            width: 20px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          }
          .content {
            height: inherit;
            display: flex;
            flex-direction: row;
            align-items: center;

            .ipnut-wrapper {
              padding: 0 5px;
              padding-top: 5px;
              height: inherit;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              .label {
                font-size: 12px;
                color: var(--theme-trade-text-color-1);
                cursor: pointer;
                :global(.icon) {
                  position: relative;
                  top: 2px;
                }
              }
            }
            :global(> * > .my-input) {
              width: 109px;
              flex: 1;
              padding-right: 8px;
              margin: 0;
            }
            :global(input) {
              text-align: center;
              color: var(--theme-trade-text-color-1);
              font-size: 12px;
            }

            .price {
              cursor: pointer;
              width: 116px;
              height: inherit;
              flex: 1;
              position: relative;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              font-size: 12px;
              color: var(--theme-trade-text-color-1);

              span {
                color: var(--theme-trade-text-color-3);
              }
              &::before {
                content: '';
                display: block;
                position: absolute;
                width: 100%;
                height: 100%;
              }
              &:hover {
                &::before {
                  opacity: 0.5;
                }
              }
              &.buy {
                border-top: 2px solid var(--color-green);
                &::before {
                  background-color: var(--color-green);
                  opacity: 0.15;
                }
              }
              &.sell {
                border-top: 2px solid var(--color-red);
                &::before {
                  opacity: 0.15;
                  background-color: var(--color-red);
                }
              }
            }
          }
        }
      `}</style>
    </>
  );
};

export default LightningOrder;
