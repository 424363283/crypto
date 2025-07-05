import CommonIcon from '@/components/common-icon';
import { Loading } from '@/components/loading';
import { BottomModal, MobileModal } from '@/components/mobile-modal';
import Modal, { ModalFooter, ModalTitle } from '@/components/trade-ui/common/modal';
import Input from '@/components/trade-ui/trade-view/components/input';
import MinChangeInput from '@/components/trade-ui/trade-view/components/input/min-change-input';
import { OrderConfirmModal } from '@/components/trade-ui/trade-view/swap/components/modal/order-confirm-modal';
import { postSwapOrderTraceOrderApi } from '@/core/api';
import { useResponsive } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { SUBSCRIBE_TYPES, useWs } from '@/core/network';
import { Swap } from '@/core/shared';
import { resso } from '@/core/store';
import { message } from '@/core/utils';
import { useEffect, useState } from 'react';
import { DealInfo } from './components/deal-info';
import { InputLabel } from './components/input-label';
import { PriceInfos } from './components/price-infos';
import { TypeSelect } from './components/type-select';
import { PRICE_TYPE } from './components/type-select-modal';
import { WhatIsTrack } from './components/what-is-track';
import { clsx, styles } from './styled';

const store = resso({
  inputPrice: '',
  inputRate: '0',
  inputTriggerPrice: '',
  enableTrigger: false,
  confirmVisible: false,
  setConfirmVisible: (v: boolean) => (store.confirmVisible = v),
  priceType: PRICE_TYPE.PRICE,
});

const TrackModal = ({ data, visible, onClose }: { data?: any; visible?: any; onClose?: any }) => {
  const { inputPrice, inputRate, confirmVisible, inputTriggerPrice, setConfirmVisible, enableTrigger } = store;
  const { priceUnitText, isUsdtType } = Swap.Trade.base;
  const { isMobile } = useResponsive();
  const { minChangePrice, maxCallBackRate } = Swap.Info.getCryptoData(data?.symbol);
  const { track } = Swap.Info.getOrderConfirm(isUsdtType);
  const isBuy = data?.side === '1';
  const [marketList, setMarketList] = useState<any>([]);
  const baseShowPrecision = Number(data.baseShowPrecision) || 0;
  useWs(SUBSCRIBE_TYPES.ws3001, (data) => {
    setMarketList(isUsdtType ? data.getSwapUsdtList() : data.getSwapCoinList());
  });
  const checkboxProps = {
    checked: store.enableTrigger,
    onClick: () => {
      store.inputTriggerPrice = '';
      store.enableTrigger = !store.enableTrigger;
    },
  };
  const isPriceType = store.priceType === PRICE_TYPE.PRICE;
  const marketPrice = marketList.find((v: any) => v.id === data.symbol.toUpperCase())?.price || 0;
  const priceMaxFlag = enableTrigger ? inputTriggerPrice : marketPrice; // 激活价格

  useEffect(() => {
    if (visible) {
      const isPriceType = !(Number(data.callbackRate) > 0);
      store.priceType = isPriceType ? PRICE_TYPE.PRICE : PRICE_TYPE.RATE;

      if (isPriceType) {
        store.inputPrice = data.callbackValue || '';
        store.inputRate = '';
      } else {
        store.inputPrice = '';
        store.inputRate = `${data.callbackRate}`.mul(100);
      }
      store.enableTrigger = !!Number(data.activationPrice);
      if (store.enableTrigger) {
        store.inputTriggerPrice = data.activationPrice;
      } else {
        store.inputTriggerPrice = '';
      }
    }
  }, [visible]);
  const _onConfirm = () => {
    // 做多：激活价格需>开仓价和最新价
    // 做空：激活价格需<开仓价和最新价
    if (enableTrigger) {
      if (isBuy) {
        if (
          Number(inputTriggerPrice) <= Number(data.avgCostPrice) ||
          Number(inputTriggerPrice) <= Number(marketPrice)
        ) {
          return message.error(LANG('做多方向的激活价格必须大于开仓价和最新价'));
        }
      } else {
        if (
          Number(inputTriggerPrice) >= Number(data.avgCostPrice) ||
          Number(inputTriggerPrice) >= Number(marketPrice)
        ) {
          return message.error(LANG('做空方向的激活价格必须小于开仓价和最新价'));
        }
      }
    }

    if (track) {
      return setConfirmVisible(true);
    }
    _onOrder();
  };
  const _onOrder = async () => {
    Loading.start();
    const params: any = {
      side: data['side'] == '1' ? '2' : '1',
      symbol: data['symbol'],
      priceType: 1,
      opType: 4,
      closePosition: 1,
      source: Swap.Utils.getSource(),
      subWallet: data['subWallet'],
    };
    if (enableTrigger) {
      params.activationPrice = inputTriggerPrice;
    }
    if (isPriceType) {
      params.callbackValue = inputPrice;
    } else {
      params.callbackRate = inputRate.div(100);
    }
    try {
      const result = await postSwapOrderTraceOrderApi(params, isUsdtType);
      if (result && result.code === 200) {
        Swap.Order.fetchPending(isUsdtType);
        Swap.Order.fetchPosition(isUsdtType);
        onClose();
      } else {
        message.error(result?.message || LANG('操作失败'));
      }
    } catch (e) {
      message.error(e);
    } finally {
      Loading.end();
    }
  };

  const content = (
    <>
      <OrderConfirmModal
        trackData={{ ...data, trackPrice: inputPrice, trackRate: inputRate }}
        visible={confirmVisible}
        onClose={() => setConfirmVisible(false)}
        onConfirm={({ dontShouldAgain }: any) => {
          setConfirmVisible(false);
          _onOrder();
          dontShouldAgain &&
            Swap.Info.setOrderConfirm(isUsdtType, {
              track: false,
            });
        }}
      />
      <div className={clsx('track-modal')}>
        <div className={clsx('input-label')}>
          {LANG('回撤价差')} ({priceUnitText})
        </div>
        <PriceInfos
          data={[
            [LANG('开仓价'), data.avgCostPrice?.toFormat(Number(baseShowPrecision))],
            [LANG('最新价格'), marketPrice?.toFormat(Number(baseShowPrecision))],
            [LANG('强平价格'), data.liquidationPrice?.toFormat(Number(baseShowPrecision))],
          ]}
        ></PriceInfos>
        <InputLabel
          prefix={
            <>
              <div onClick={checkboxProps.onClick} className={clsx('checkbox', checkboxProps.checked && 'active')}>
                {checkboxProps.checked && <CommonIcon name='common-checkbox-rect-active-0' size={14} enableSkin />}
              </div>
            </>
          }
          label={LANG('激活价格')}
          info={LANG(
            '激活价格是追踪出场的激活条件，当市场最新成交价达到或超过激活价格，追踪出场委托就会被激活。激活后系统开始计算追踪出场的实际触发价格。'
          )}
        />
        {!checkboxProps.checked ? (
          <div className={clsx('trigger-price-info')}>
            {LANG('当最新成交价从最优价格回撤时，将出发追踪出场，执行市价平仓。')}
          </div>
        ) : (
          <Input
            inputComponent={MinChangeInput}
            className={clsx('input')}
            placeholder={LANG('请输入价格')}
            value={inputTriggerPrice}
            onChange={(v: any) => (store.inputTriggerPrice = v)}
            digit={Number(baseShowPrecision || 0)}
            minChangePrice={Number(minChangePrice || 0)}
            step={Number(minChangePrice || 1)}
            max={999999999}
            clearable
            // controller
          />
        )}
        <InputLabel
          label={LANG('回撤幅度')}
          info={LANG(
            '回撤幅度是计算实际触发价格的要条件。实际价格会根据历史最高/最低和回撤幅度计算得出。例如，设置回撤幅度 5%的追踪出场，历史最高价20,000，则当前实际触发市价平仓的价格为20,000*(1-5%)=19,000。'
          )}
          suffix={
            <TypeSelect
              value={store.priceType}
              onChange={(v) => {
                store.priceType = v;
                store.inputRate = '0';
                store.inputPrice = '0';
              }}
            />
          }
        />
        <Input
          inputComponent={isPriceType ? MinChangeInput : undefined}
          className={clsx('input')}
          placeholder={isPriceType ? LANG('请输入价格') : LANG('请输入比例')}
          value={isPriceType ? inputPrice : inputRate}
          onChange={(v: any) => {
            if (isPriceType) {
              store.inputPrice = v;
            } else {
              store.inputRate = `${Number(v) || 0}`;
              // store.inputPrice = marketPrice.mul(store.inputRate.div(100)).toFixed(baseShowPrecision);
            }
          }}
          digit={isPriceType ? Number(baseShowPrecision || 0) : 2}
          minChangePrice={isPriceType ? Number(minChangePrice || 0) : undefined}
          step={isPriceType ? Number(minChangePrice || 1) : undefined}
          max={
            maxCallBackRate != 0
              ? isPriceType
                ? Number(`${priceMaxFlag}`.mul(maxCallBackRate).toFixed(Number(baseShowPrecision || 0)))
                : maxCallBackRate.mul(100)
              : undefined
          }
          clearable
          // controller
        />
        <DealInfo
          price={store.enableTrigger ? inputTriggerPrice.toFixed(baseShowPrecision) : undefined}
          cbPrice={`${(isPriceType ? inputPrice : marketPrice.div(100).mul(inputRate)).toFixed(
            Number(baseShowPrecision)
          )}${priceUnitText}`}
        />
        <WhatIsTrack />
        {/* <div className={clsx('info')}>
          {LANG('最新成交价格回撤{price}时将激活止损订单', {
            price: `${(isPriceType ? inputPrice : marketPrice.mul(inputRate)).toFixed(
              Number(baseShowPrecision)
            )}${priceUnitText}`,
          })}
        </div> */}
      </div>
      {styles}
    </>
  );
  const disabledConfirm = !Number(isPriceType ? inputPrice : inputRate) || (enableTrigger ? !inputTriggerPrice : false);

  if (isMobile) {
    return (
      <MobileModal visible={visible} onClose={onClose} type='bottom'>
        <BottomModal title={LANG('追踪出场')} onConfirm={_onConfirm} disabledConfirm={disabledConfirm}>
          {content}
        </BottomModal>
      </MobileModal>
    );
  }

  return (
    <>
      <Modal visible={visible} onClose={onClose}>
        <ModalTitle title={LANG('追踪出场')} onClose={onClose} />
        <div className={clsx('content')}>{content}</div>
        <ModalFooter onConfirm={_onConfirm} onCancel={onClose} disabledConfirm={disabledConfirm} />
      </Modal>
    </>
  );
};
export default TrackModal;
