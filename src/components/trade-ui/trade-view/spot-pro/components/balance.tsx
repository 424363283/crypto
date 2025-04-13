import { LANG } from '@/core/i18n';
import { Account, Spot } from '@/core/shared';

import css from 'styled-jsx/css';
import ExchangeIcon from './exchange-icon';

const { Trade } = Spot;

const Balance = ({ isBuy }: { isBuy: boolean }) => {
  const { coin, quoteCoin, quoteCoinBalance, coinBalance, quoteCoinScale, coinScale } = Trade.state;
  const isLogin = Account.isLogin;

  return (
    <>
      <div className='balance-wrapper'>
        <span className='label'>{LANG('可用')}</span>
        {isBuy ? (
          <span className='balance'>
            {(isLogin ? quoteCoinBalance : 0).toFormat(quoteCoinScale)} {quoteCoin}
          </span>
        ) : (
          <span className='balance'>{`${coinBalance.toFormat(coinScale)} ${coin}`}</span>
        )}
        <ExchangeIcon onTransferDone={() => Trade.getBalance()} />
      </div>
      <style jsx>{styles}</style>
    </>
  );
};

export default Balance;
const styles = css`
  .balance-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1 0 0;
    .label {
      color: var(--text-tertiary);
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
    }
    .balance {
      color: var(--text-primary);
      text-align: right;
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      flex: 1 0 0;
    }
    :global(.exchange) {
      cursor: pointer;
    }
  }
`;
