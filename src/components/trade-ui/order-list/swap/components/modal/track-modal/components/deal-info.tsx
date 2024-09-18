import { LANG } from '@/core/i18n';
import { clsx } from '../styled';

export const DealInfo = ({ price, cbPrice }: { price?: string; cbPrice: string }) => {
  // if(price||)
  return (
    <>
      <div className='deal-info'>
        {price !== undefined ? (
          <div className={clsx('text', price !== undefined && 'first')}>
            {LANG('最新成交价达到{price}时，追踪出场订单将被激活', { price: price || 0 })}
          </div>
        ) : undefined}
        <div className='text'>
          {LANG('最新成交价从最优价格回撤{price}时，将触发追踪出场，执行市价平仓。', { price: cbPrice })}
        </div>
      </div>
      <style jsx>{`
        .deal-info {
          font-size: 12px;
          color: var(--theme-trade-text-color-1);
          margin-bottom: 10px;
          .text-first {
            padding-bottom: 10px;
          }
          > .text {
            position: relative;
            z-index: 2;
            display: flex;

            &::before {
              margin-top: 5px;
              content: '';
              display: block;
              height: 5px;
              width: 5px;
              background-color: var(--skin-primary-color);
              transform: rotate(45deg);
              margin-right: 15px;
              flex: none;
              position: relative;
              z-index: 2;
            }
            &.first:nth-child(1) {
              &::after {
                content: '';
                display: block;
                z-index: 1;
                position: absolute;
                left: 2px;
                top: 8px;
                height: 90%;
                border-left: 1px dashed var(--theme-deep-border-color-1);
              }
            }
          }
        }
      `}</style>
    </>
  );
};
