import { LANG } from '@/core/i18n';
import { formatNumber2Ceil } from '@/core/utils';

export const ItemLrInfo = ({
  income,
  incomeRate,
  scale,
  openPrice,
  flagPrice,
}: {
  income: any;
  incomeRate: any;
  scale: any;
  openPrice: any;
  flagPrice: any;
}) => {
  return (
    <>
      <div className='item-lr-info'>
        <div className='info'>
          <div>{LANG('回报率')}</div>
          <div className={income >= 0 ? 'green' : 'red'}>
            {income >= 0 ? '+' : ''}
            {formatNumber2Ceil(income, scale, false).toFixed(scale)}({income >= 0 ? '+' : ''}
            {incomeRate?.toFixed(2) + '%'})
          </div>
        </div>
        <div className='info'>
          <div>
            {LANG('标记价格')}/{LANG('开仓价格')}
          </div>
          <div>
            <span>{`${flagPrice} / `}</span>
            <span className='gray'>{openPrice}</span>
          </div>
        </div>
      </div>
      <style jsx>{`
        .item-lr-info {
          margin-top: 11px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .info {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            color: var(--theme-trade-text-color-1);
            &:last-child {
              align-items: flex-end;

              > div:last-child {
                font-size: 12px;
              }
            }
            > div {
              display: flex;
              align-items: center;
            }
            > div:first-child {
              font-size: 12px;
              color: var(--theme-trade-text-color-3);
            }
            > div:last-child {
              margin-top: 2px;
              font-size: 16px;
            }
          }
          .green {
            color: var(--color-green);
          }
          .red {
            color: var(--color-red);
          }
          .gray {
            color: var(--theme-trade-text-color-3);
          }
        }
      `}</style>
    </>
  );
};
