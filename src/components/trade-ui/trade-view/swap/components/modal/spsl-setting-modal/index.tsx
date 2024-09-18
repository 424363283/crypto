import { BottomModal, MobileModal } from '@/components/mobile-modal';
import Modal, { ModalFooter, ModalTitle } from '@/components/trade-ui/common/modal';
import { useResponsive } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { SUBSCRIBE_TYPES, useWs } from '@/core/network';
import { MarketsMap, Swap } from '@/core/shared';
import { clsxWithScope, isNumber, message } from '@/core/utils';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import { Infos } from './components/infos';
import InputSection from './components/input-section';
import TradeType from './components/trade-type';

export const SpslSettingModal = () => {
  const [ckey, setCkey] = useState(() => +new Date());
  const [incomeStandard1, setIncomeStandard1] = useState(0);
  const [incomeStandard2, setIncomeStandard2] = useState(0);
  const visible = Swap.Trade.store.modal.spslVisible;
  const spslMode = Swap.Trade.store.spslMode;
  const onClose = () => {
    Swap.Trade.setModal({ spslVisible: false });
  };
  const [stopProfitEnable, setStopProfitEnable] = useState(spslMode.stopProfitEnable);
  const [stopProfitPrice, setStopProfitPrice] = useState(spslMode.stopProfitPrice);
  const [stopProfitPriceType, setStopProfitPriceType] = useState(spslMode.stopProfitPriceType);
  const [stopLossEnable, setStopLossEnable] = useState(spslMode.stopLossEnable);
  const [stopLossPrice, setStopLossPrice] = useState(spslMode.stopLossPrice);
  const [stopLossPriceType, setStopLossPriceType] = useState(spslMode.stopLossPriceType);
  const { quoteId, quoteName, priceUnitText, isUsdtType } = Swap.Trade.base;
  const { minChangePrice, basePrecision } = Swap.Info.getCryptoData(quoteId);
  const [isBuy, setIsBuy] = useState(spslMode.isBuy);
  const { isMobile } = useResponsive();
  const { leverageLevel } = Swap.Info.getLeverFindData(Swap.Trade.store.quoteId);
  const { isMarket: isMarketType } = Swap.Trade.orderTradeType;

  useEffect(() => {
    if (visible) {
      setCkey(+new Date());
      setIncomeStandard1(0);
      setIncomeStandard2(0);
      setStopProfitPrice(spslMode.stopProfitPrice);
      setStopProfitPriceType(spslMode.stopProfitPriceType);
      setStopLossPrice(spslMode.stopProfitPrice);
      setStopLossPriceType(spslMode.stopLossPriceType);
    }
  }, [visible]);
  const onConfirm = () => {
    if (stopProfitEnable) {
      if (validatePrice(true)) return;
      if (!stopProfitPrice) {
        message.error(LANG('请输入止盈价'));
        return;
      }
    }
    if (stopLossEnable) {
      if (validatePrice(false)) return;
      if (!stopLossPrice) {
        message.error(LANG('请输入止损价'));
        return;
      }
    }
    Swap.Trade.onChangeSpslSetting({
      enable: true,
      isBuy,
      editEnable: true,
      stopProfitEnable,
      stopProfitPrice,
      stopProfitPriceType,
      stopLossEnable,
      stopLossPrice,
      stopLossPriceType,
    });
    onClose();
  };
  const validatePrice = (isSp: boolean) => {
    const openPrice = Swap.Trade.getOrderPrice(isBuy);
    const spPrice = Number(stopProfitPrice || 0);
    const slPrice = Number(stopLossPrice || 0);
    let text = '';
    if (isSp) {
      if (!isNumber(stopProfitPrice)) {
        return null;
      }
      if (isBuy && spPrice < openPrice) {
        text = LANG('触发价格应高于开仓价格');
      } else if (!isBuy && spPrice > openPrice) {
        text = LANG('触发价格应低于开仓价格');
      }
    } else {
      if (!isNumber(stopLossPrice)) {
        return null;
      }
      if (isBuy && slPrice > openPrice) {
        text = LANG('触发价格应低于开仓价格');
      } else if (!isBuy && slPrice < openPrice) {
        text = LANG('触发价格应高于开仓价格');
      }
    }

    return text;
  };
  const storePrice = Swap.Trade.store.price;
  const [marketMaps, setMarketMaps] = useState<MarketsMap | undefined>();

  const marketPrice = Swap.Info.getMarketPrice(isBuy);
  const volPrice = isMarketType ? marketPrice : storePrice;
  const currentPosition = Swap.Trade.getInputVolume({ isBuy, flagPrice: Number(volPrice) });
  // 行情数据
  useWs(SUBSCRIBE_TYPES.ws3001, async (detail) => {
    setMarketMaps(detail);
  });
  const newPrice = marketMaps?.[quoteId]?.price || 0;
  const volume_display = Swap.Trade.store.volume;
  // const volume = Swap.Calculate.formatPositionNumber({
  //   usdt: isUsdtType,
  //   code: quoteId,
  //   // flagPrice: avgCostPrice,
  //   fixed: Swap.Info.getVolumeDigit(quoteId, { withHooks: false }),
  //   value: currentPosition,
  // });
  const buyCommissionCost = Swap.Trade.buyCommissionCost;
  const sellCommissionCost = Swap.Trade.sellCommissionCost;

  const data = {
    side: isBuy ? '1' : '2',
    symbol: quoteId,
    avgCostPrice: volPrice,
    margin: isBuy ? buyCommissionCost : sellCommissionCost,
    basePrecision: isUsdtType ? 2 : basePrecision,
    currentPosition: currentPosition,
  };
  const content = (
    <div className={clsx('content')}>
      <Infos
        data={[
          [
            LANG('合约'),
            `${quoteName} ${Swap.Info.getContractName(isUsdtType)} / ${
              !isBuy ? LANG('卖') : LANG('买')
            } ${leverageLevel}X`,
          ],
          [LANG('委托价格'), !isMarketType ? `${storePrice} ${priceUnitText}` : LANG('市价')],
          [LANG('委托数量'), `${volume_display} ${Swap.Info.getUnitText({ symbol: quoteId })}`],
          [LANG('最新价格'), `${newPrice} ${priceUnitText}`],
        ]}
      />
      <TradeType isBuy={isBuy} onChange={setIsBuy} />
      <InputSection
        key={`${ckey}_1`}
        label={LANG('止盈')}
        placeholder={LANG('请输入止盈价')}
        onEnableChange={setStopProfitEnable}
        price={stopProfitPrice}
        onPriceChange={setStopProfitPrice}
        isBuy={isBuy}
        priceType={stopProfitPriceType}
        onPriceTypeChange={(index: number) => {
          const value = [Swap.Trade.PRICE_TYPE.FLAG, Swap.Trade.PRICE_TYPE.NEW][index];
          if (value == Swap.Trade.PRICE_TYPE.NEW && stopProfitPrice) {
            setStopProfitPrice(`${Swap.Utils.minChangeFormat(minChangePrice, stopProfitPrice)}`);
          }
          setStopProfitPriceType(value);
        }}
        error={validatePrice(true)}
        minChange={incomeStandard1 === 0 ? stopProfitPriceType == Swap.Trade.PRICE_TYPE.NEW : false}
        incomeStandard={incomeStandard1}
        setIncomeStandard={setIncomeStandard1}
        data={data}
        displayPriceInfo
      />
      <InputSection
        key={`${ckey}_2`}
        incomeLossNegative
        incomeLoss
        label={LANG('止损')}
        placeholder={LANG('请输入止损价')}
        onEnableChange={setStopLossEnable}
        price={stopLossPrice}
        onPriceChange={setStopLossPrice}
        isBuy={isBuy}
        priceType={stopLossPriceType}
        onPriceTypeChange={(index: number) => {
          const value = [Swap.Trade.PRICE_TYPE.FLAG, Swap.Trade.PRICE_TYPE.NEW][index];
          if (value == Swap.Trade.PRICE_TYPE.NEW && stopLossPrice) {
            setStopLossPrice(`${Swap.Utils.minChangeFormat(minChangePrice, stopLossPrice)}`);
          }
          setStopLossPriceType(value);
        }}
        error={validatePrice(false)}
        minChange={incomeStandard2 === 0 ? stopLossPriceType == Swap.Trade.PRICE_TYPE.NEW : false}
        incomeStandard={incomeStandard2}
        setIncomeStandard={setIncomeStandard2}
        data={data}
      />
    </div>
  );
  if (isMobile) {
    return (
      <MobileModal visible={visible} onClose={onClose} type='bottom'>
        <BottomModal
          title={LANG('止盈/止损')}
          onConfirm={onConfirm}
          disabledConfirm={!stopProfitEnable && !stopLossEnable}
        >
          {content}
        </BottomModal>
      </MobileModal>
    );
  }
  return (
    <>
      <Modal visible={visible} onClose={onClose} contentClassName={clsx('modal-content')}>
        <ModalTitle title={LANG('止盈/止损')} onClose={onClose} />
        {content}
        <ModalFooter onCancel={onClose} onConfirm={onConfirm} disabledConfirm={!stopProfitEnable && !stopLossEnable} />
      </Modal>
      {styles}
    </>
  );
};
const { className, styles } = css.resolve`
  .content {
    min-height: 250px;
    padding-bottom: 15px;
  }
  .modal-content {
    width: 465px !important;
  }
`;
const clsx = clsxWithScope(className);

export default SpslSettingModal;
