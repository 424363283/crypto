import { DesktopOrTablet } from '@/components/responsive';
import { OrderSwitch } from './order-switch';

export const OrderWrap = ({
  children,
  activeIndex,
  OrderBookGroupBtn,
  setActiveIndex,
  isSwap,
}: {
  children: React.ReactNode;
  OrderBookGroupBtn?: React.ReactNode;
  isSwap?: boolean;
  activeIndex: number;
  setActiveIndex: (type: 0 | 1 | 2) => void;
}) => {
  return (
    <>
      <div className='order-book-wrap'>
        <DesktopOrTablet>
          <div className='order-book-active'>
            <div className='order-book-active-list'>
              <OrderSwitch value={activeIndex} onChange={setActiveIndex} />
              {OrderBookGroupBtn}
            </div>
          </div>
        </DesktopOrTablet>
        {children}
      </div>
      <style jsx>
        {`
          .order-book-wrap {
            flex: 1;
            display: flex;
            flex-direction: column;
            > .order-book-title {
              height: 35px;
              padding: 0 12px;
              display: flex;
              align-items: center;
              flex-shrink: 0;

              > span {
                color: var(--theme-trade-text-color-1);
                font-size: 14px;
                font-weight: 700;
              }
            }
            > .order-book-active {
              display: flex;
              align-items: center;
              flex-shrink: 0;
              padding: 0 12px;
              .order-book-active-list {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 1px;
              }
            }
          }
        `}
      </style>
    </>
  );
};
