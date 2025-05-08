import { LANG } from '@/core/i18n';
import { formatNumber2Ceil } from '@/core/utils';

export const ItemLrInfo = ({ income, incomeRate, scale }: { income: any; incomeRate: any; scale: any }) => {
  return (
    <>
      <div className="item-lr-info">
        <div className="info">
          <div className={`large ${income >= 0 ? 'green' : 'red'}`}>
            {income >= 0 ? '+' : ''}
            {formatNumber2Ceil(income, scale, false).toFixed(scale)}
          </div>
          <div className={income >= 0 ? 'green' : 'red'}>
            ({income >= 0 ? '+' : ''}
            {incomeRate?.toFixed(2) + '%'})
          </div>
        </div>
        {/* <div className='info'>
          <div>
            {LANG('标记价格')}/{LANG('开仓价格')}
          </div>
          <div>
            <span>{`${flagPrice} / `}</span>
            <span className='gray'>{openPrice}</span>
          </div>
        </div> */}
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
            justify-content: center;
            align-items: flex-end;
            gap: 4px;
            font-size: 14px;
            font-weight: 400;
            line-height: normal;
            .large {
              font-size: 1rem;
              font-weight: 500;
            }
          }
          .green {
            color: var(--text_green);
          }
          .red {
            color: var(--text_red);
          }
          .gray {
            color: var(--text_2);
          }
        }
      `}</style>
    </>
  );
};
