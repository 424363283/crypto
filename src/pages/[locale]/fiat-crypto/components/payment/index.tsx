import { useIndexedDB } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { IDB_STORE_KEYS } from '@/core/store';
import { clsx } from '@/core/utils';
import css from 'styled-jsx/css';
import Item from './item';

const Payment = ({
  isBuy,
  currencyCode,
  cryptoCode,
  rate: rateText,
  setAmountIndex,
  setBankIndex,
  setKey,
  state,
  setPayModal,
}: any) => {
  const { paymentMethods, refreshKey, currencyAmount, coinAmount, amountIndex, bankIndex, key } = state;
  const [localPaymentData] = useIndexedDB(IDB_STORE_KEYS.FIAT_CRYPTO_PAYMENTS, paymentMethods);

  return (
    <div className={clsx('payment')}>
      {localPaymentData?.length ? (
        <>
          <div className='item-list'>
            {localPaymentData?.map((method: any, index: any) => (
              <div
                className='item-box'
                key={`${index}_${refreshKey}`}
                onClick={() => {
                  setKey(index);
                  setTimeout(() => {
                    setPayModal(false);
                  }, 200);
                }}
              >
                {/* {index === 0 && (
                  <div className='pay-min' style={{ background: isBuy ? 'var(--color-green)' : 'var(--color-red)' }}>
                    {LANG('价格最低')}
                  </div>
                )} */}
                <Item
                  data={method}
                  price={method.price || rateText}
                  amount={isBuy ? currencyAmount : coinAmount}
                  currencyCode={currencyCode}
                  cryptoCode={cryptoCode}
                  isBuy={isBuy}
                  active={key === index}
                  setAmountIndex={setAmountIndex}
                  setBankIndex={setBankIndex}
                  amountIndex={amountIndex}
                  bankIndex={bankIndex}
                />
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className='noData'>{LANG('暂无数据')}</div>
      )}
      <div className='linear-gradient' />
      <style jsx>{styles}</style>
    </div>
  );
};

export default Payment;

const styles = css`
  .payment {
    max-height: 330px;
    overflow: auto;
    .linear-gradient {
      width: 100%;
      height: 60px;
      background: var(--theme-linear-gradient-fiat-crypto);
      position: absolute;
      bottom: 10px;
      left: 0;
    }
    .item-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
      padding-top: 10px;
      .item-box {
        position: relative;
        cursor: pointer;
        .pay-min {
          font-size: 12px;
          font-weight: 500;
          border-radius: 8px;
          display: inline-block;
          padding: 0 10px;
          line-height: 22px;
          color: white;
          position: absolute;
          left: 10px;
          top: -10px;
          z-index: 1;
        }
      }
    }
    .noData {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 50px;
      color: var(--theme-font-color-1);
      background: var(--theme-background-color-1);
    }
  }
`;
