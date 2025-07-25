import { MediaInfo, clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';
import { Agreement } from './components/agreement';
import { BottomView } from './components/bottom-view';
import { EffectiveTime } from './components/effective-time';
import { InputView } from './components/input-view';
import { InputViewHeader } from './components/input-view-header';
import { OnlyReducePositionCheckbox } from './components/only-reduce-position-checkbox';
import { OrderListener } from './components/order-listener';
import { SpslCheckbox, SpslContent } from './components/spsl-checkbox';
import { SpslInputs } from './components/spsl-inputs';
import { ToolBar } from './components/tool-bar';
import { TradePositionMode } from './components/trade-position-mode';
import { VolumeSlider } from './components/volume-slider';
// modal
import { Desktop } from '@/components/responsive';
import { Account, Swap } from '@/core/shared';
import { isSwapDemo } from '@/core/utils/src/is';
import { useEffect } from 'react';

import { kChartEmitter } from '@/core/events';
import dynamic from 'next/dynamic';
import { Layer } from '@/components/constants';

const CalculatorModal = dynamic(() => import('./components/modal/calculator-modal'), { ssr: false });
const LeverModal = dynamic(() => import('./components/modal/lever-modal'), { ssr: false });
const OrderConfirmModal = dynamic(() => import('./components/modal/order-confirm-modal'), { ssr: false });
const EffectiveTimeModal = dynamic(() => import('./components/modal/effective-time-modal'), { ssr: false });
const MarginTypeModal = dynamic(() => import('./components/modal/margin-type-modal'), { ssr: false });
const RechargeDemoModal = dynamic(() => import('./components/modal/recharge-demo-modal'), { ssr: false });
const SelectUnitModal = dynamic(() => import('./components/modal/select-unit-modal'), { ssr: false });
const SpslSettingModal = dynamic(() => import('./components/modal/spsl-setting-modal'), { ssr: false });
const PaintOrderModal = dynamic(() => import('./components/modal/paint-order-modal'), { ssr: false });
const PaintOrderOptionsModal = dynamic(() => import('./components/modal/paint-order-options-modal'), { ssr: false });
const ModifyPositionMriceModal = dynamic(() => import('./components/modal/modify-position-price-modal') as never, {
  ssr: false
});
const TransferModal = dynamic(() => import('./components/modal/transfer-modal'), { ssr: false });
const WalletSelectModal = dynamic(() => import('./components/modal/wallet-select-modal'), { ssr: false });
const WalletSelectModalInTrade = dynamic(() => import('./components/modal/wallet-select-modal-in-trade'), {
  ssr: false
});
const WelcomeDemoModal = dynamic(() => import('./components/modal/welcome-demo-modal'), { ssr: false });
const BounsUseModal = dynamic(() => import('./components/modal/bouns-use-modal'), { ssr: false });
const WalleViewGuideGuide = dynamic(() => import('./components/bouns-guide/components/wallet-view-guide'), {
  ssr: false
});
const LightningOrder = dynamic(() => import('@/components/trade-ui/trade-view/swap/components/lightning-order'), {
  ssr: false
});
const OpenContractModal = dynamic(() => import('./components/modal/open-contract-modal'), { ssr: false });

export const SwapTradeViewContent = ({ layer = Layer.Default }: { layer?: Layer }) => {
  const { isUsdtType, quoteId } = Swap.Trade.base;

  useEffect(() => {
    const unsubscribe = Swap.Assets.getAssetStore(isUsdtType).subscribe('wallets', () => {
      const walletId = Swap.Info.getWalletId(isUsdtType, { withHooks: false });
      const wallets = Swap.Assets.getWallets({ usdt: isUsdtType, withHooks: false });

      // 钱包id不存在 设置第一个
      if (wallets?.length > 0 && wallets.findIndex(v => v.wallet === walletId) === -1) {
        Swap.Info.setWalletId(isUsdtType, wallets[0].wallet);
      }
    });

    return () => unsubscribe();
  }, [isUsdtType]);
  useEffect(() => {
    const func = (price: any) => {
      price &&
        Swap.Trade.setModal({
          paintOrderOptionsVisible: true,
          paintOrderOptionsData: {
            price: Swap.Utils.minChangeFormat(
              Swap.Info.getCryptoData(quoteId, { withHooks: false }).minChangePrice,
              `${price}`
            )
          }
        });
    };
    kChartEmitter.addListener(kChartEmitter.K_CHART_CLICK_CROSSHAIR_PRICE, func);
    return () => {
      kChartEmitter.removeListener(kChartEmitter.K_CHART_CLICK_CROSSHAIR_PRICE, func);
    };
  }, [quoteId]);
  return (
    <WalleViewGuideGuide>
      <ToolBar wrapperClassName={clsx('order-view-padding')} />
      <TradePositionMode layer={layer} />
      <InputViewHeader />
      <div className={clsx('order-placer-panel order-view-padding')}>
        <div className="swap-guide-step-3">
          <InputView layer={layer} />
          <VolumeSlider layer={layer} />
        </div>
        <div className="line"></div>
        <div className={clsx('advanced-setting')}>
          <SpslContent>
            <div className={clsx('order-spsl-setting')}>
              <SpslCheckbox />
              <SpslInputs layer={layer}/>
            </div>
          </SpslContent>
          {/* TO-DO 组合成一个组件*/}
          <div className={clsx('order-dealwith-type')}>
            <OnlyReducePositionCheckbox />
            <EffectiveTime />
          </div>
        </div>
      </div>
      <BottomView wrapperClassName={clsx('order-view-padding')} />
      {styles}
    </WalleViewGuideGuide>
  );
};

// Description: Swap page
const SwapComponent = () => {
  const { lightningOrder } = Swap.Info.getTradePreference(Swap.Trade.base.isUsdtType);
  const demo = isSwapDemo();

  const {
    marginTypeVisible,
    leverVisible,
    effectiveTimeVisible,
    calculatorVisible,
    spslVisible,
    orderConfirmVisible,
    transferVisible,
    walletSelectVisible,
    walletFormVisible,
    rechargeVisible,
    welcomeDemoVisible,
    selectUnitVisible,
    paintOrderVisible,
    paintOrderOptionsVisible,
    modifyPositionMriceModalVisible,
    openContractVisible
  } = Swap.Trade.store.modal;

  return (
    <>
      {!demo ? (
        <Agreement>
          <SwapTradeViewContent />
        </Agreement>
      ) : (
        <SwapTradeViewContent />
      )}
      {/* <Desktop>{Account.isLogin && lightningOrder && <LightningOrder />}</Desktop> */}
      {/* modal */}
      {marginTypeVisible && <MarginTypeModal />}
      {leverVisible && <LeverModal />}
      {spslVisible && <SpslSettingModal />}
      {effectiveTimeVisible && <EffectiveTimeModal />}
      {transferVisible && <TransferModal />}
      {orderConfirmVisible && <OrderConfirmModal />}
      {calculatorVisible && <CalculatorModal />}
      {walletFormVisible && <WalletSelectModalInTrade />}
      {walletSelectVisible && <WalletSelectModal />}
      {rechargeVisible && <RechargeDemoModal />}
      {selectUnitVisible && <SelectUnitModal />}
      {demo && Account.isLogin && <WelcomeDemoModal />}
      <BounsUseModal />
      {paintOrderVisible && <PaintOrderModal />}
      {paintOrderOptionsVisible && <PaintOrderOptionsModal />}
      {modifyPositionMriceModalVisible && <ModifyPositionMriceModal />}
      {openContractVisible && <OpenContractModal />}
      {/* other */}
      <OrderListener />
    </>
  );
};
export const SwapMobileModals = () => {
  const demo = isSwapDemo();
  const {
    marginTypeVisible,
    leverVisible,
    effectiveTimeVisible,
    calculatorVisible,
    spslVisible,
    orderConfirmVisible,
    transferVisible,
    walletSelectVisible,
    walletFormVisible,
    rechargeVisible,
    welcomeDemoVisible,
    selectUnitVisible,
    paintOrderVisible,
    paintOrderOptionsVisible,
    openContractVisible
  } = Swap.Trade.store.modal;
  return (
    <>
      {marginTypeVisible && <MarginTypeModal />}
      {orderConfirmVisible && <OrderConfirmModal />}
      {spslVisible && <SpslSettingModal />}
      {leverVisible && <LeverModal />}
      {effectiveTimeVisible && <EffectiveTimeModal />}
      {transferVisible && <TransferModal />}
      {walletFormVisible && <WalletSelectModalInTrade />}
      {walletSelectVisible && <WalletSelectModal />}
      {rechargeVisible && <RechargeDemoModal />}
      {selectUnitVisible && <SelectUnitModal />}
      <BounsUseModal />
      {paintOrderVisible && <PaintOrderModal />}
      {paintOrderOptionsVisible && <PaintOrderOptionsModal />}
      {paintOrderVisible && <PaintOrderModal />}
      {paintOrderOptionsVisible && <PaintOrderOptionsModal />}
      {demo && Account.isLogin && <WelcomeDemoModal />}
      {openContractVisible && <OpenContractModal />}
      {calculatorVisible && <CalculatorModal />}
    </>
  );
};

const { className, styles } = css.resolve`
  .order-view-padding {
    padding: 0 16px;
    @media ${MediaInfo.mobile} {
      padding: 0;
      margin: 0 0.5rem;
      :global(.swap-guide-step-3) {
        padding-bottom: 1.5rem;
      }
    }
  }
  .advanced-setting {
    display: flex;
    flex-direction: column;
    gap: 16px;
    .order-spsl-setting {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .order-dealwith-type {
      display: flex;
      align-items: center;
      justify-content: space-between;
      @media ${MediaInfo.mobile} {
        margin: 0;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--fill_line_1);
      }
    }
  }
  :global(.tool-bar) {
    margin: 0 16px;
  }
  :global(.position-mode) {
    margin: 0 16px;
  }
  .order-placer-panel {
    padding-top: 8px;
    padding-bottom: 8px;
  }
`;
const clsx = clsxWithScope(className);

export default SwapComponent;
