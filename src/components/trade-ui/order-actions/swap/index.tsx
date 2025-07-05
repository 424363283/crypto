import { BottomModal, MobileModal } from '@/components/mobile-modal';
import { LANG } from '@/core/i18n';
import { Account, Swap } from '@/core/shared';
import { useState, useEffect } from 'react';

import { SwapMobileModals, SwapTradeViewContent } from '@/components/trade-ui/trade-view/swap';
import { OrderListener } from '@/components/trade-ui/trade-view/swap/components/order-listener';
import { useRouter } from '@/core/hooks';
import { Agreement, useAgreement } from '../../trade-view/swap/components/agreement';
import { MobileTradeViewContext } from './components/order-actions-provider';
import { MediaInfo } from '@/core/utils';
import { Layer } from '@/components/constants';
import { getKineState, setIsH5CreateAnOrderFun } from '@/store/kline';
import { useAppContext } from '@/core/store';
import clsx from 'clsx';
import { Button } from '@/components/button';

export const Index = () => {
  const { onArgee, allow } = useAgreement();
  const [visible, setVisible] = useState(false);
  const [visibleAgreement, setVisibleAgreement] = useState(false);
  const [buy, setBuy] = useState(false);
  const router = useRouter();
  const isOpenPosition = Swap.Trade.isOpenPositionMode;
  const twoWayMode = Swap.Trade.twoWayMode;

  const { OPEN, CLOSE } = Swap.Trade.POSITION_MODE;
  const positionMode = Swap.Trade.store.positionMode;
  const { isH5CreateAnOrder } = getKineState();
  const { isLogin } = useAppContext();

  const onChange = (value: string) => {
    Swap.Trade.resetSpslSetting();
    Swap.Trade.setPositionMode(value);
  };
  const buyText = isOpenPosition ? LANG('买多') : LANG('平多');
  const sellText = isOpenPosition ? LANG('卖空') : LANG('平空');


  console.log("isH5CreateAnOrder",isH5CreateAnOrder)

  useEffect(() => {
    if (isH5CreateAnOrder) {
      _onOrder(true);
    }
  }, [isH5CreateAnOrder]);

  useEffect(() => {
    if (!visible) {
      setIsH5CreateAnOrderFun(false);
    }
  }, [visible]);

  const _onOrder = (buy: boolean) => {
    if (!Account.isLogin) {
      router.push('/login');
      return;
    }
    setBuy(buy);
    if (allow) {
      setVisible(true);
    } else {
      setVisibleAgreement(true);
    }
  };

  return (
    <>
      <div className="order-actions">
        {!isLogin ? (
          <>
            <Button
              rounded
              type='reverse'
              className="sign-button"
              onClick={() => router.push('/register')}
            >
              {LANG('注册')}
            </Button>
            <Button type="primary" rounded className="login-button" onClick={() => router.push('/login')}>
              {LANG('登录')}
            </Button>
          </>
        ) : (
          <>
            <Button
              rounded
              type='green'
              onClick={() => {
                _onOrder(true);
              }}
            >
              {buyText}
            </Button>
            <Button
              rounded
              type='red'
              onClick={() => {
                _onOrder(false);
              }}
            >
              {sellText}
            </Button>
          </>
        )}
        
      </div>
      <MobileModal visible={visible} onClose={() => setVisible(false)} type="bottom">
        <BottomModal
          title={buy ? buyText : sellText}
          // titles={twoWayMode ? [LANG('开仓'), LANG('平仓')] : undefined}
          tabIndex={positionMode === OPEN ? 0 : 1}
          onChangeIndex={v => onChange(v === 0 ? OPEN : CLOSE)}
          onConfirm={async () => {
            try {
              const result = Swap.Trade.onPlaceAnOrder({ buy: buy, onOrderConfirm: () => setVisible(false) });
              if (result instanceof Promise) {
                await result;
                setVisible(false);
              }
            } catch (e) {}
          }}
        >
          <MobileTradeViewContext.Provider value={{ isBuy: buy }}>
            <div
              className="hide-scroll-bar"
              style={{ marginTop: !twoWayMode ? -10 : 0, maxHeight: '70vh', overflowY: 'auto' }}
            >
              <SwapTradeViewContent layer={Layer.Overlay} />
            </div>
          </MobileTradeViewContext.Provider>
        </BottomModal>
      </MobileModal>
      <MobileModal visible={visibleAgreement} onClose={() => setVisibleAgreement(false)} type="bottom">
        <BottomModal
          title={LANG('开通合约账户')}
          onConfirm={async () => {
            await onArgee();
            setVisibleAgreement(false);
            setVisible(true);
          }}
        >
          <div>
            <Agreement allow={false}>
              <div />
            </Agreement>
          </div>
        </BottomModal>
      </MobileModal>
      <SwapMobileModals />
      {/* <PreferenceMenu /> */}
      <OrderListener />
      <style jsx>{`
        .order-actions {
          position: relative;
          display: flex;
          align-items: center;
          padding: 10px 8px 0;
          @media ${MediaInfo.mobile} {
            padding: 0;
            gap: 8px;
          }
          :global(button) {
            flex: 1;
          }
        }
      `}</style>
    </>
  );
};
export default Index;
