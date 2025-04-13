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
    height: 40px;
    border-radius: 8px;
    background-color: var(--fill-3);
    padding: 2px;
    div {
      cursor: pointer;
      flex: 1;
      line-height: 28px;
      font-size: 14px;
      font-weight: 400;
      color: var(--text-secondary);
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      &.active {
        color: var(--text-white);
        border-color: transparent;
        border-radius: 8px;
      }
      &.active.green {
        background-color: var(--green);
      }
      &.active.red {
        background-color: var(--red);
      }
    }
  }
`;

export default TradeTypeBar;
