import { useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { clsx } from '@/core/utils';

const TradeType = ({ isBuy, onChange }: { isBuy: boolean; onChange: Function }) => {
  const { isDark } = useTheme();

  return (
    <>
      <div className={clsx('trade-type', !isDark && 'light')}>
        <div className={clsx('green', isBuy && 'active')} onClick={() => onChange(true)}>
          {LANG('开多')}
        </div>
        <div className={clsx('red', !isBuy && 'active')} onClick={() => onChange(false)}>
          {LANG('开空')}
        </div>
      </div>
      <style jsx>
        {`
          .trade-type {
            border: 1px solid var(--theme-trade-border-color-1);
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            margin-bottom: 16px;
            border-radius: 5px;
            div {
              cursor: pointer;
              height: 32px;
              width: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
              color: var(--theme-trade-text-color-1);
              background-size: cover;
              &:nth-child(1) {
                border-right: 0;
                border-top-left-radius: 5px;
                border-bottom-left-radius: 5px;
              }
              &:nth-child(2) {
                border-left: 0;
                border-top-right-radius: 5px;
                border-bottom-right-radius: 5px;
              }
              &.active.green {
                background-color: var(--color-green);
              }
              &.active.red {
                background-color: var(--color-red);
              }
            }
          }
        `}
      </style>
    </>
  );
};

export default TradeType;
