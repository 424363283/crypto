import { useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { clsx, MediaInfo } from '@/core/utils';

const TradeType = ({ isBuy, onChange }: { isBuy: boolean; onChange: Function }) => {
  const { isDark } = useTheme();

  return (
    <>
      <div className={clsx('trade-type', !isDark && 'light')}>
        <div className={clsx('green', isBuy && 'active')} onClick={() => onChange(true)}>
          {LANG('买多')}
        </div>
        <div className={clsx('red', !isBuy && 'active')} onClick={() => onChange(false)}>
          {LANG('卖空')}
        </div>
      </div>
      <style jsx>
        {`
          .trade-type {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            border-radius: 8px;
            background: var(--fill-3);
            @media ${MediaInfo.mobile} {
              padding: 0;
              margin: 0 0.5rem;
            }
            div {
              cursor: pointer;
              height: 36px;
              width: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
              color: var(--text-secondary);
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
                border-radius: 8px;
                color: var(--text-white);
                background: var(--color-green);
              }
              &.active.red {
                border-radius: 8px;
                color: var(--text-white);
                background: var(--color-red);
              }
            }
          }
        `}
      </style>
    </>
  );
};

export default TradeType;
