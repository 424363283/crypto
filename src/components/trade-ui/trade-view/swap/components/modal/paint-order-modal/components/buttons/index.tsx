import { OrderTypeButton } from '@/components/id-button';
import { useSettingGlobal } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { clsx } from '@/core/utils';
import { MaintButton } from '../../../../bottom-view/components/maint-button';
import { useCalc } from '../../store';

export const Buttons = ({ onOrder }: { onOrder: (data: { isBuy: boolean; volume: number }) => any }) => {
  const { swapTradeEnable } = useSettingGlobal();
  const { calcMax, getInputVolume } = useCalc();
  const buyMaxVolume = calcMax({ isBuy: true });
  const sellMaxVolume = calcMax({ isBuy: false });

  let buyInputVolume = getInputVolume({ isBuy: true, maxVolume: buyMaxVolume });
  let sellInputVolume = getInputVolume({ isBuy: false, maxVolume: sellMaxVolume });
  return (
    <>
      <div className='buttons'>
        {swapTradeEnable ? (
          <OrderTypeButton
            buy
            className={clsx('pc-v2-btn-green', 'buy')}
            onClick={() => onOrder({ isBuy: true, volume: buyInputVolume })}
          >
            {LANG('买多')}
          </OrderTypeButton>
        ) : (
          <MaintButton className={clsx('pc-v2-btn-green', 'buy')} />
        )}
        {swapTradeEnable ? (
          <OrderTypeButton
            sell
            className={clsx('pc-v2-btn-red', 'sell')}
            onClick={() => onOrder({ isBuy: false, volume: sellInputVolume })}
          >
            {LANG('卖空')}
          </OrderTypeButton>
        ) : (
          <MaintButton className={clsx('pc-v2-btn-red', 'sell')} />
        )}
      </div>
      <style jsx>{`
        .buttons {
          display: flex;
          flex-direction: row;
          margin-bottom: 16px;
          :global(.buy) {
            margin-right: 10px;
          }
          :global(.buy),
          :global(.sell) {
            height: 40px;
            line-height: 40px;
            color: #fff !important;
            flex: 1;
          }
        }
      `}</style>
    </>
  );
};
