import CommonIcon from '@/components/common-icon';
import { clsx } from '@/core/utils';

export const OrderSwitch = ({ value, onChange }: { value: number; onChange: (value: 0 | 1 | 2) => any }) => {
  return (
    <>
      <div className='order-book-active-list-wrap'>
        <div className={clsx('order-book-active-item', value === 0 && 'active')} onClick={() => onChange(0)}>
          <CommonIcon name='common-red-green-0' width={16} height={14} enableSkin />
        </div>
        <div className={clsx('order-book-active-item', value === 1 && 'active')} onClick={() => onChange(1)}>
          <CommonIcon name='common-green-0' width={16} height={14} enableSkin />
        </div>
        <div className={clsx('order-book-active-item', value === 2 && 'active')} onClick={() => onChange(2)}>
          <CommonIcon name='common-red-0' width={16} height={14} enableSkin />
        </div>
      </div>
      <style jsx>{`
        .order-book-active-list-wrap {
          display: flex;
        }
        .order-book-active-item {
          flex: 1;
          height: 20px;
          width: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-right: 9px;
          cursor: pointer;
          border-radius: 5px;
          background: var(--theme-trade-sub-button-bg);
          border: 1px solid transparent;
          &.active {
            border-color: var(--skin-primary-color);
          }
        }
      `}</style>
    </>
  );
};
