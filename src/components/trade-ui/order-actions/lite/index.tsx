import { useState } from 'react';
import { LANG } from '@/core/i18n';
import { Account, Lite, PositionSide } from '@/core/shared';
import { useRouter } from '@/core/hooks';

import { BottomModal, MobileModal } from '@/components/mobile-modal';
import TradeViewLite from '@/components/trade-ui/trade-view/lite';

export const Index = () => {
  const router = useRouter();
  const [buy, setBuy] = useState(false);
  const [visible, setVisible] = useState(false);

  const _onOrder = (buy: boolean) => {
    if (!Account.isLogin) {
      router.push('/login');
      return;
    }
    setBuy(buy);
    setVisible(true);
    Lite.Trade.changePositionSide(buy ? PositionSide.LONG : PositionSide.SHORT);
  };

  return (
    <>
      <div className="order-actions">
        <div
          className="button"
          onClick={() => {
            _onOrder(true);
          }}
        >
          {LANG('买涨')}
        </div>
        <div
          className="button"
          onClick={() => {
            _onOrder(false);
          }}
        >
          {LANG('买跌')}
        </div>
      </div>
      <MobileModal visible={visible} onClose={() => setVisible(false)} type="bottom">
        <BottomModal title={LANG(buy ? '买涨' : '买跌')} displayConfirm={false}>
          <div
            className="hide-scroll-bar"
            style={{ marginTop: -10, maxHeight: '80vh', overflowY: 'auto', overflowX: 'hidden' }}
          >
            <TradeViewLite />
          </div>
        </BottomModal>
      </MobileModal>
      <style jsx>{`
        .order-actions {
          position: relative;
          display: flex;
          align-items: center;
          padding: 0;
          gap: 8px;
          .button {
            color: var(dark-text-1);
            border-radius: 5px;
            flex: 1;
            height: 2.5rem;
            line-height: 2.5rem;
            border-radius: 2.5rem;
            font-size: 14px;
            font-weight: 500;
            color: var(--text_white);
            text-align: center;
            &:nth-child(1) {
              background: var(--green);
            }
            &:nth-child(2) {
              background: var(--red);
            }
          }
        }
      `}</style>
    </>
  );
};

export default Index;
