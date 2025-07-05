import { BottomModal, MobileBottomSheet, MobileModal } from '@/components/mobile-modal';
import Modal, { ModalFooter, ModalTitle } from '@/components/trade-ui/common/modal';
import InputPrice from '@/components/trade-ui/order-list/swap/components/modal/stop-profit-stop-loss-modal/components/input-price';
import Slider from '@/components/Slider';
import SwitchPrice from '@/components/trade-ui/order-list/swap/components/modal/stop-profit-stop-loss-modal/components/switch-price';
import InputRoe from '@/components/trade-ui/order-list/swap/components/modal/stop-profit-stop-loss-modal/components/input-roe';
import { useResponsive } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { SUBSCRIBE_TYPES, useWs } from '@/core/network';
import { MarketsMap, Swap } from '@/core/shared';
import { clsxWithScope, isNumber, MediaInfo, message } from '@/core/utils';
import { useEffect, useRef, useState } from 'react';
import css from 'styled-jsx/css';
import { Infos } from './components/infos';
import InputSection from './components/input-section';
import TradeType from './components/trade-type';
import { Layer } from '@/components/constants';
const TYPES = {
  NEWS_PRICE: 'news',
  FLAG_PRICE: 'flag'
};
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
  const [stopProfitRoe, setStopProfitRoe] = useState(spslMode.stopProfitRoe);
  const [stopLossRoe, setStopLossRoe] = useState(spslMode.stopLossRoe);
  const { quoteId, quoteName, priceUnitText, isUsdtType } = Swap.Trade.base;
  const { minChangePrice, basePrecision, pricePrecision, settleCoin } = Swap.Info.getCryptoData(quoteId);
  const [isBuy, setIsBuy] = useState(spslMode.isBuy);

  const [stopProfitLimitPrice, setStopProfitLimitPrice] = useState(spslMode.stopProfitLimitPrice);
  const [stopLossLimitPrice, setStopLossLimitPrice] = useState(spslMode.stopLossLimitPrice);

  const [stopProfitLimitPriceType, setStopProfitLimitPriceType] = useState(spslMode.stopProfitLimitPriceType);
  const [stopLossLimitPriceType, setStopLossLimitPriceType] = useState(spslMode.stopLossLimitPriceType);

  const { isMobile } = useResponsive();
  const { leverageLevel, marginType } = Swap.Info.getLeverFindData(Swap.Trade.store.quoteId);
  const { isMarket: isMarketType } = Swap.Trade.orderTradeType;
  const isInitialMount = useRef(true); // 标记是否初次渲染

  useEffect(() => {
    if (visible) {
      setCkey(+new Date());
      setIncomeStandard1(0);
      setIncomeStandard2(0);
      setStopProfitPrice(spslMode.stopProfitPrice);
      setStopProfitPriceType(spslMode.stopProfitPriceType);
      setStopLossPrice(spslMode.stopLossPrice);
      setStopLossPriceType(spslMode.stopLossPriceType);
    }
  }, [visible,isBuy]);

  useEffect(() => {
    setRoe(spslMode.stopProfitRoe,'stopProfit')
    setRoe(spslMode.stopLossRoe,'stopLoss')
  },[isBuy])
  const onConfirm = () => {
    const openPrice = Swap.Trade.getOrderPrice(isBuy);
    const spPrice = Number(stopProfitPrice || 0);
    const slPrice = Number(stopLossPrice || 0);

    if (!spPrice && !slPrice) {
      if (!spPrice) {
        message.error(LANG('请输入止盈价'));
        return;
      }

      if (!slPrice) {
        message.error(LANG('请输入止损价'));
        return;
      }
    }

    // if (stopProfitEnable) {
    //   if (validatePrice(true)) return;
    //   if (!stopProfitPrice) {
    //     message.error(LANG('请输入止盈价'));
    //     return;
    //   }
    // }
    // if (stopLossEnable) {
    //   if (validatePrice(false)) return;
    //   if (!stopLossPrice) {
    //     message.error(LANG('请输入止损价'));
    //     return;
    //   }
    // }
    // let text = ''
    // if (isBuy && spPrice < openPrice) {
    //   text = LANG('触发价格应高于开仓价格');
    // } else if (!isBuy && spPrice > openPrice) {
    //   text = LANG('触发价格应低于开仓价格');
    // }

    // if (isBuy && slPrice > openPrice) {
    //   text = LANG('触发价格应低于开仓价格');
    // } else if (!isBuy && slPrice < openPrice) {
    //   text = LANG('触发价格应高于开仓价格');
    // }
    // if (text) {
    //   return message.error(text);
    // }

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
      stopProfitLimitPrice,
      stopProfitLimitPriceType,
      stopLossLimitPrice,
      stopLossLimitPriceType,
      stopProfitRoe,
      stopLossRoe
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
  useWs(SUBSCRIBE_TYPES.ws3001, async detail => {
    setMarketMaps(detail);
  });
  // const newPrice = marketMaps?.[quoteId]?.price || 0;
  const newPrice = Swap.Utils.getNewPrice(quoteId);
  const flagPrice = Swap.Socket.getFlagPrice(quoteId);
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

  const marks = {
    0: '0%',
    25: '25%',
    50: '50%',
    75: '75%',
    100: '100%'
  };

  /* 输入或者滑杆设置收益率百分比 */
  const setRoe = (val: any, type: string) => {
    const isStopProfit = (isBuy && type === 'stopProfit') || (!isBuy && type === 'stopLoss');
    if (type === 'stopProfit') {
      setStopProfitRoe(val);
    } else {
      setStopLossRoe(val);
    }
    const percent = isStopProfit ? Number(String(val).div(100)) : -Number(String(val).div(100));
    const price = (1 + percent).mul(newPrice).toFixed(pricePrecision);

    if (type === 'stopProfit') {
      setStopProfitPrice(price);
    } else {
      setStopLossPrice(price);
    }
  };

  const setPrice = (val: any, type: string) => {
    const priceType = type === 'stopProfit' ? stopProfitPriceType : stopLossPriceType;
    const currentPrice = priceType === 'flag' ? flagPrice : newPrice;
    const spred = isBuy ? val.sub(currentPrice) : currentPrice.sub(val);
    const percent = spred.div(currentPrice).mul(100).toFixed(2);
    if (type === 'stopProfit') {
      setStopProfitPrice(val);
      setStopProfitRoe(percent);
    } else {
      setStopLossPrice(val);
      setStopLossRoe(percent);
    }
  }

  const data = {
    side: isBuy ? '1' : '2',
    symbol: quoteId,
    avgCostPrice: volPrice,
    margin: isBuy ? buyCommissionCost : sellCommissionCost,
    basePrecision: isUsdtType ? 2 : basePrecision,
    currentPosition: currentPosition
  };
  const content = (
    <div className={clsx('content')}>
      <TradeType isBuy={isBuy} onChange={setIsBuy} />
      <Infos
        quoteId={quoteId}
        marginType={marginType}
        leverageLevel={leverageLevel}
        isBuy={isBuy}
        data={[
          // [
          //   LANG('合约'),
          //   `${quoteName} ${Swap.Info.getContractName(isUsdtType)} / ${!isBuy ? LANG('卖') : LANG('买')
          //   } ${leverageLevel}X`,
          // ],
          // [LANG('最新价格'), !isMarketType ? `${newPrice} ${priceUnitText}` : LANG('市价')],
          [LANG('最新价格'), `${newPrice}`],
          [LANG('标记价格'), `${flagPrice}`],
          [LANG('委托价格'), !isMarketType ? `${storePrice}` : LANG('市价')]

          //
        ]}
      />
      <div className={clsx('line')}></div>
      {/* <div className={clsx('input-sections')}>
        <InputSection
          key={`${ckey}_1`}
          label={LANG('止盈')}
          placeholder={LANG('请输入止盈价')}
          onEnableChange={setStopProfitEnable}
          price={stopProfitPrice}
          roe={stopProfitRoe}
          onRoeChange={(value: any) => {
            setStopProfitRoe(value);
          }}
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
        {

          <InputSection
            key={`${ckey}_2`}
            incomeLossNegative
            incomeLoss
            label={LANG('止损')}
            placeholder={LANG('请输入止损价')}
            onEnableChange={setStopLossEnable}
            price={stopLossPrice}
            onPriceChange={setStopLossPrice}
            roe={stopLossRoe}
            onRoeChange={(value: any) => {
              setStopLossRoe(value);
            }}
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
        }
      </div> */}

      <div className={clsx('liquidation-action')}>
        <div className={clsx('liquidation-pannel')}>
          <div className={clsx('liquidation-label')}>{LANG('止盈')}</div>
          <div className={clsx('liquidation-form')}>
            <InputPrice
              layer={Layer.Overlay}
              digit={pricePrecision}
              showSuffix
              select
              placeholder={LANG('触发价')}
              value={stopProfitPrice}
              type={stopProfitPriceType}
              onTypeChange={(val: string) => {
                setStopProfitPriceType(val);
              }}
              onChange={(v: any) => {
                setPrice(v, 'stopProfit');
                // const isStopProfit = isBuy; // 做多并且止盈
                // const currentPrice = stopProfitPriceType === 'flag' ? flagPrice : newPrice;
                // const spred = isStopProfit ? v.sub(currentPrice) : currentPrice.sub(v);
                // const percent = spred.div(currentPrice).mul(100).toFixed(2);
                // setStopProfitPrice(v);
                // setStopProfitRoe(percent);
              }}
            />
            <InputRoe
              placeholder={LANG('涨跌幅')}
              value={stopProfitRoe}
              onChange={(val: number) => setRoe(val, 'stopProfit')}
              type="stopProfit"
              positionSide={isBuy ? 'LONG' : 'SHORT'}
              avgCostPrice={newPrice}
              inputPrice={stopProfitPrice}
            />
          </div>
          <Slider
            min={1}
            max={100}
            onChange={(val: number) => {
              setRoe(val, 'stopProfit');
            }}
            value={stopProfitRoe}
            marks={marks}
            type="stopProfit"
            layer={Layer.Overlay}
          />

          <div
            className={clsx(`liquidation-form switch-price ${!stopProfitLimitPriceType ? 'market-price-input' : ''}`)}
          >
            <InputPrice
              layer={Layer.Overlay}
              digit={pricePrecision}
              showSuffix={false}
              placeholder={!stopProfitLimitPriceType ? LANG('市价') : LANG('请输入价格')}
              disabled={!stopProfitLimitPriceType}
              value={!stopProfitLimitPriceType ? '' : stopProfitLimitPrice}
              onChange={(v: any) => setStopProfitLimitPrice(v)}
              className={clsx()}
            />
            <SwitchPrice
              type={!stopProfitLimitPriceType ? TYPES.NEWS_PRICE : TYPES.FLAG_PRICE}
              options={[LANG('市价'), LANG('限价')]}
              onChange={(v: any) => {
                setStopProfitLimitPriceType(v === TYPES.FLAG_PRICE);
              }}
            />
          </div>

          {/* <div className={clsx('tips')}>
            <NewCloseTips
              {...{
                isLimit: true,
                price: 0,
                triggerPrice: stopProfitPrice,
                triggerPriceType: stopProfitPriceType,
                isUsdtType,
                data,
                settleCoin,
                incomeStandard: 0,
              }}
            />
          </div> */}
        </div>
        <div className={clsx('liquidation-pannel')}>
          <div className={clsx('liquidation-label')}>{LANG('止损')}</div>
          <div className={clsx('liquidation-form')}>
            <InputPrice
              layer={Layer.Overlay}
              digit={pricePrecision}
              select
              placeholder={LANG('触发价')}
              // income={income}
              // incomeStandard={incomeStandard3}
              unit={priceUnitText}
              value={stopLossPrice}
              onChange={(v: any) => {
                setPrice(v, 'stopLoss');
                // const isStopProfit = isBuy; // 做多并且止盈
                // const currentPrice = stopLossPriceType === 'flag' ? flagPrice : newPrice;
                // const spred = isStopProfit ? v.sub(currentPrice) : currentPrice.sub(v);
                // const percent = spred.div(currentPrice).mul(100).toFixed(2);
                // setStopLossPrice(v);
                // setStopLossRoe(percent);
              }}
              type={stopLossPriceType}
              data={data}
              onTypeChange={(val: string) => {
                // setStopProfitPriceType(val);
                setStopLossPriceType(val);
              }}
            />
            <InputRoe
              placeholder={LANG('涨跌幅')}
              onChange={(val: number) => {
                setRoe(val, 'stopLoss');
              }}
              value={stopLossRoe}
              type="stopLoss"
              positionSide={isBuy ? 'LONG' : 'SHORT'}
              avgCostPrice={newPrice}
              inputPrice={stopLossPrice}
            />
          </div>
          <Slider
            min={1}
            max={100}
            onChange={(val: number) => {
              setRoe(val, 'stopLoss');
            }}
            value={stopLossRoe}
            marks={marks}
            type="stopLoss"
            layer={Layer.Overlay}
          />
          <div className={clsx(`liquidation-form switch-price ${!stopLossLimitPriceType ? 'market-price-input' : ''}`)}>
            <InputPrice
              layer={Layer.Overlay}
              digit={pricePrecision}
              showSuffix={false}
              placeholder={!stopLossLimitPriceType ? LANG('市价') : LANG('请输入价格')}
              disabled={!stopLossLimitPriceType}
              value={!stopLossLimitPriceType ? '' : stopLossLimitPrice}
              onChange={(v: any) => setStopLossLimitPrice(v)}
              className={clsx(!stopLossLimitPriceType ? 'market-price-input' : '')}
            />
            <SwitchPrice
              type={!stopLossLimitPriceType ? TYPES.NEWS_PRICE : TYPES.FLAG_PRICE}
              options={[LANG('市价'), LANG('限价')]}
              onChange={(v: any) => {
                setStopLossLimitPriceType(v === TYPES.FLAG_PRICE);
              }}
            />
          </div>
          {/* <div className={clsx('tips')}>
            <NewCloseTips
                      {...{
                        isLimit,
                        price,
                        triggerPrice: store.stopTriggerPrice,
                        triggerPriceType,
                        isUsdtType,
                        data,
                        settleCoin,
                        incomeStandard: incomeStandard3,
                      }}
                    />
          </div> */}
        </div>
      </div>
    </div>
  );

  // 只在初始化时监听 price 变化
  useEffect(() => {
    if (isInitialMount.current) {
      if (!flagPrice && !newPrice) {
        return;
      }
      if (stopProfitPrice) {
        setPrice(stopProfitPrice, 'stopProfit');
      }
      if (stopLossPrice) {
        setPrice(stopLossPrice, 'stopLoss');
      }
      isInitialMount.current = false;
    }
  }, [stopLossPrice, stopProfitPrice, flagPrice, newPrice]);

  if (isMobile) {
    return (
      <>
        <MobileModal visible={visible} onClose={onClose} type="bottom">
          <BottomModal
            title={LANG('高级止盈止损')}
            onConfirm={onConfirm}
            disabledConfirm={!stopProfitEnable && !stopLossEnable}
          >
            {content}
            {styles}
          </BottomModal>
        </MobileModal>
      </>
    );
  }
  return (
    <>
      <Modal visible={visible} onClose={onClose} contentClassName={clsx('modal-content')}>
        <ModalTitle title={LANG('高级止盈止损')} onClose={onClose} />
        {content}
        <ModalFooter onCancel={onClose} onConfirm={onConfirm} disabledConfirm={!stopProfitEnable && !stopLossEnable} />
      </Modal>
      {styles}
    </>
  );
};
const { className, styles } = css.resolve`
  .content {
    display: flex;
    flex-direction: column;
    min-height: 250px;
    gap: 24px;

    .line {
      height: 1px;
      width: 100%;
      background-color: var(--fill_line_1);
      @media ${MediaInfo.mobile} {
        margin: 0 0.5rem;
      }
    }
    .input-sections {
      display: flex;
      align-items: flex-start;
      gap: 40px;
      align-self: stretch;
    }
  }
  .modal-content {
    width: auto !important;
    padding: 16px 24px !important;
  }
  .liquidation-action {
    display: flex;
    align-items: flex-start;
    gap: 40px;
    overflow: hidden;
    // padding:24px 0;
    // &:last-child{
    //   padding:24px 0 0;
    // }
  }
  .liquidation-pannel {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    flex: 1 0 0;
  }
  .liquidation-label {
    color: var(--text_3);
    font-size: 14px;
    font-weight: 500;
  }
  .liquidation-form {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 8px;
    :global(.liquidation-ipt) {
      min-width: 185px;
      max-width: 200px;
    }
    :global(.input-roe, .liquidation-switch) {
      flex-shrink: 0;
    }
  }
  .market-price-input {
    :global(.ant-input) {
      background: var(--fill_shadow) !important;
    }
  }
  .switch-price {
    :global(.ant-input) {
      background: var(--fill_3) !important;
    }
  }

  :global(.custom-dropdown) {
    min-width: 50px;
    background: var(--fill_3);
    :global(.ant-select-item) {
      color: var(--text_2) !important;
      text-align: center;
      padding: 0 !important;
      height: 24px !important;
      line-height: 24px !important;
      font-size: 12px !important;
    }
    :global(.ant-select-item-option-selected) {
      background: transparent !important;
      color: var(--text_brand) !important;
    }
  }
  @media ${MediaInfo.mobile} {
    .content {
      height: 30rem;
      .line {
        margin: 0 0.5rem;
      }
    }
    :global(.slider) {
      padding: 0;
      margin: 0;
      :global(.ant-slider-horizontal.ant-slider-with-marks.slider-with-marks-label) {
        margin-bottom: 1rem !important;
      }
    }
    :global(.custom-dropdown) {
      background: var(--fill_pop);
      padding: 4px 0;
      min-width: 5rem;
      border-radius: 8px;
      box-shadow: 0px 0px 8px 0px var(--fill_shadow);
      :global(.rc-virtual-list-holder-inner) {
        gap: 4px;
        padding: 4px 0px;
      }
      :global(.ant-select-item) {
        line-height: normal !important;
        display: flex;
        align-items: center;
        height: 1.5rem !important;
        min-height: 1.5rem;
      }
    }
    .liquidation-pannel {
      width: 100%;
    }
    :global(.liquidation-action) {
      flex-direction: column;
      gap: 1.5rem;
      padding: 0 0.5rem;
      overflow-y: auto!important;
      justify-content: space-between;
    }
    .liquidation-form {
      width: 100%;
      &.market-price-input {
        :global(.ant-input) {
          background: var(--fill_input_2) !important;
        }
        :global(.liquidation-switch) {
          background: var(--fill_input_2);
        }
      }
      :global(.liquidation-ipt) {
        max-width: none;
      }
      :global(.liquidation-switch) {
        box-sizing: border-box;
      }
    }
  }
`;
const clsx = clsxWithScope(className);

export default SpslSettingModal;
