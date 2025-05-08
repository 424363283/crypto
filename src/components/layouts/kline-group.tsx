import { getUrlQueryParams } from '@/core/utils';
import { KChart, TRADINGVIEW_SYMBOL_TYPE } from '../chart/k-chart';

export const KlineGroupLayout = () => {
  let qty = Number(getUrlQueryParams('qty'));
  qty = [1, 2, 3, 4, 5, 6].includes(qty) ? qty : 2;

  return (
    <>
      <div id='kline-group-layout' className={'g-' + qty}>
        {[...new Array(qty)].map((_, i) => (
          <div key={i} className={'item-' + (i + 1)} style={{ gridArea: 'item-' + (i + 1) }}>
            <KChart qty={i + 1} symbolType={TRADINGVIEW_SYMBOL_TYPE.SPOT} />
          </div>
        ))}
      </div>

      <style jsx>{`
        #kline-group-layout {
          min-height: calc(100vh - var(--const-header-height));
          display: grid;
          grid-gap: 4px;
          background-color: var(--theme-trade-bg-color-1);
          padding: 4px;
          overflow: hidden;
          > div {
            background-color: var(--fill_bg_1);
            display: flex;
            color: var(--theme-trade-text-color-1);
            flex: 1;
            overflow: hidden;
          }
          &.g-1 {
            grid-template-columns: repeat(1, 1fr);
            grid-template-areas: 'item-1';
          }
          &.g-2 {
            grid-template-columns: repeat(2, 1fr);
            grid-template-areas: 'item-1 item-2';
          }
          &.g-3 {
            grid-template-columns: repeat(2, 1fr);
            grid-template-areas:
              'item-1 item-1'
              'item-2 item-3';
          }
          &.g-4 {
            grid-template-columns: repeat(2, 1fr);
            grid-template-areas:
              'item-1 item-2'
              'item-3 item-4';
          }
          &.g-5 {
            grid-template-columns: repeat(4, 1fr);
            grid-template-areas:
              'item-1 item-2 item-2 item-3'
              'item-4 item-4 item-5 item-5';
          }
          &.g-6 {
            grid-template-columns: repeat(3, 1fr);
            grid-template-areas:
              'item-1 item-2 item-3'
              'item-4 item-5 item-6';
          }
        }
      `}</style>
    </>
  );
};
