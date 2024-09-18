import { BottomModal, MobileModal } from '@/components/mobile-modal';

import Modal, { ModalTabsTitle } from '@/components/trade-ui/common/modal';

import { Loading } from '@/components/loading';
import { postSwapAddOtocoApi } from '@/core/api';
import { useResponsive } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { ORDER_TRADE_TYPE, PRICE_TYPE } from '@/core/shared/src/swap/modules/trade/constants';
import { message } from '@/core/utils';
import { useEffect, useState } from 'react';
import { BottomView, useMaxVolume } from './components/bottom-view';
import { Buttons } from './components/buttons';
import { EffectiveTime } from './components/effective-time';
import InputView from './components/input-view';
import { MyFee } from './components/my-fee';
import { OnlyReducePositionCheckbox } from './components/only-reduce-position-checkbox';
import PaintOrderConfirmModal from './components/order-confirm-modal';
import { VolumeView } from './components/volume-view';
import { store } from './store';
import { clsx, styles } from './styled';

export const PaintOrderModal = () => {
  const { isMobile } = useResponsive();
  const { quoteId, isUsdtType } = Swap.Trade.base;
  const onlyReducePosition = store.onlyReducePosition;
  const twoWayMode = Swap.Trade.twoWayMode;

  const visible = Swap.Trade.store.modal.paintOrderVisible;
  const modalData = Swap.Trade.store.modal.paintOrderData;
  const [tabIndex, setTabIndex] = useState(modalData.tabIndex || 0);
  const [modalProps, setModalProps] = useState<any>({ visible: false, data: {} });

  const { getMaxVolume } = useMaxVolume();
  const onClose = () => {
    Swap.Trade.setModal({ paintOrderVisible: false });
  };
  const _onConfirm = async () => {
    // if (await onConfirm()) {
    //   onClose();
    // }
  };
  useEffect(() => {
    store.reset({ price: `${modalData.price || ''}` });
    setTabIndex(modalData.tabIndex || 0);
  }, [visible]);
  useEffect(() => {
    store.orderTradeType = tabIndex === 0 ? ORDER_TRADE_TYPE.LIMIT : ORDER_TRADE_TYPE.LIMIT_SPSL;
  }, [tabIndex]);

  const onOrder = ({
    isBuy,
    volume: value,
    confirmModal = true,
  }: {
    isBuy: boolean;
    volume: number;
    confirmModal?: boolean;
  }) => {
    const { maxVolume } = getMaxVolume(isBuy);
    const orderQty = value;
    const { isSpsl } = Swap.Trade.formatOrderTradeType(store.orderTradeType);
    if (isSpsl) {
      /// 止盈止损触发价为空
      if (!(Number(store.triggerPrice) > 0)) {
        return message.error(LANG('请输入触发价格'), 1);
      }
    }
    if (maxVolume == 0) {
      // 只减仓判断
      if (!twoWayMode && onlyReducePosition) {
        return message.error(
          LANG(
            '平仓委托失败，请检查持仓与挂单。如果您当前合约有挂单，请取消该合约的挂单，并再次尝试平仓。如果您当前合约无持仓，请取消该合约只减仓设置，并再次尝试下单。'
          ),
          1
        );
      }

      if (Swap.Info.leverFindErrorData[quoteId]?.code && Swap.Info.leverFindErrorData[quoteId].message) {
        return message.error(Swap.Info.leverFindErrorData[quoteId].message, 1);
      }

      return message.error(LANG('当前最大可开数量为0，委托失败'), 1);
    }
    if (orderQty <= 0) {
      return message.error(
        LANG('下单数量最少为{volume}', {
          volume: `${Swap.Trade.getMinOrderVolume({ isBuy, code: quoteId })} ${Swap.Trade.getUnitText()}`,
        }),
        1
      );
    }
    const orderConfirm = Swap.Info.getOrderConfirm(isUsdtType);
    const shouldOrderConfirm = {
      [ORDER_TRADE_TYPE.LIMIT]: orderConfirm.limit,
      [ORDER_TRADE_TYPE.LIMIT_SPSL]: orderConfirm.limitSpsl,
      [ORDER_TRADE_TYPE.MARKET]: orderConfirm.market,
      [ORDER_TRADE_TYPE.MARKET_SPSL]: orderConfirm.marketSpsl,
    }[store.orderTradeType];
    // 弹窗确认逻辑

    if (shouldOrderConfirm && confirmModal && !Swap.Trade.store.modal.orderConfirmVisible) {
      setModalProps({
        visible: true,
        data: {
          isBuy: isBuy,
          prevPrice: modalData.price,
          price: store.price,
          triggerPrice: store.triggerPrice,
          isSpsl,
          volume: store.volume,
        },
        onConfirm: () => onOrder({ confirmModal: false, isBuy: isBuy, volume: value }),
      });
      return;
    } else {
      setModalProps({ visible: false, data: {} });
    }
    Loading.start();
    const onDone = (data: any) => {
      if (data && data.code === 200) {
        onClose();
      } else {
        message.error(data.message, 1);
      }
      Swap.Assets.fetchBalance(isUsdtType);
      Loading.end();
    };

    const onFail = function (error: any) {
      message.error(error?.error?.message, 1);
      Loading.end();
    };
    const params: any = {
      orderQty: orderQty,
      side: isBuy ? 1 : 2,
      price: store.price,
      source: Swap.Utils.getSource(),
      symbol: quoteId.toLocaleLowerCase(),
      type: 1,
      future: store.effectiveTime,
    };
    // 平仓模式 默认 传 1
    if (store.onlyReducePosition) {
      params.reduceOnly = 1;
    }
    if (isSpsl) {
      params.opType = 3;
      if (Number(store.triggerPrice) > 0) {
        params['triggerPrice'] = store.triggerPrice;
        params['priceType'] = store.triggerPriceType === PRICE_TYPE.FLAG ? 2 : 1; // 1:市场价格，2:标记价格
      }
    }
    return postSwapAddOtocoApi(isUsdtType, params).then(onDone).catch(onFail);
  };
  const content = (
    <>
      <div className={clsx('paint-order-modal')}>
        <InputView visible={visible} />
        <VolumeView />
        <div className={clsx('row')}>
          <OnlyReducePositionCheckbox />
          <EffectiveTime />
        </div>
        <Buttons onOrder={onOrder} />
        <BottomView />
        <MyFee />
      </div>
      {modalProps.visible && (
        <PaintOrderConfirmModal {...modalProps} onClose={() => setModalProps({ visible: false, data: {} })} />
      )}
      {styles}
    </>
  );

  if (isMobile) {
    return (
      <MobileModal visible={visible} onClose={onClose} type='bottom'>
        <BottomModal
          tabIndex={tabIndex}
          titles={[LANG('限价'), LANG('限价止盈止损')]}
          onChangeIndex={(v: any) => {
            setTabIndex(v);
          }}
          onConfirm={_onConfirm}
          displayConfirm={false}
        >
          {content}
        </BottomModal>
      </MobileModal>
    );
  }
  return (
    <>
      <Modal visible={visible} onClose={onClose} contentClassName={clsx('content-className')}>
        <ModalTabsTitle
          index={tabIndex}
          titles={[LANG('限价'), LANG('限价止盈止损')]}
          onChange={(v: any) => setTabIndex(v)}
          onClose={onClose}
        />
        {content}
        {/* <ModalFooter onConfirm={_onConfirm} onCancel={onClose} /> */}
      </Modal>
    </>
  );
};

export default PaintOrderModal;
