import { LANG } from '@/core/i18n';

import { clsx } from '@/core/utils';
import css from 'styled-jsx/css';
import { store } from '../../store';

export const TradeTypeBar = () => {
  const isBuy = store.isBuy;
  return (
    <>
      <div className={'trade-type-bar'}>
        <div className={clsx(isBuy && 'active', 'green')} onClick={() => (store.isBuy = true)}>
          {LANG('买多')}
        </div>
        <div className={clsx(!isBuy && 'active', 'red')} onClick={() => (store.isBuy = false)}>
          {LANG('卖空')}
        </div>
      </div>
      <style jsx>{styles}</style>
    </>
  );
};
const styles = css`
  .trade-type-bar {
    width: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: row;
    height: 30px;
    div {
      cursor: pointer;
      border: 1px solid var(--theme-trade-border-color-1);
      flex: 1;
      line-height: 28px;
      font-size: 14px;
      font-weight: 400;
      color: var(--theme-trade-text-color-1);
      text-align: center;
      &.active {
        color: var(--theme-trade-dark-text-1);
        border-color: transparent;
      }
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
`;

export default TradeTypeBar;
