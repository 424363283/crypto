import { BottomModal, MobileModal } from '@/components/mobile-modal';
import { Switch } from '@/components/switch';
import Modal, { ModalFooter, ModalTitle } from '@/components/trade-ui/common/modal';
import { Info } from '@/components/trade-ui/order-list/swap/components/modal/stop-profit-stop-loss-modal/components/info';
import InputSection from '@/components/trade-ui/order-list/swap/components/modal/stop-profit-stop-loss-modal/components/input-section';
import * as Utils from '@/components/trade-ui/order-list/swap/components/modal/stop-profit-stop-loss-modal/utils';
import { useResponsive } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { resso } from '@/core/store';
import { clsx } from '@/core/utils';
import { useEffect, useState } from 'react';
import { useEditOrder } from './hook';

export const TYPES = Utils.TYPES;
const store = resso({
  stopProfit: '',
  stopProfitType: TYPES.NEWS_PRICE,
  stopLoss: '',
  stopLossType: TYPES.NEWS_PRICE,
  // 平仓
  incomeStandard1: 0,
  incomeStandard2: 0,

  price: '',
  triggerPrice: '',
  triggerPriceType: TYPES.NEWS_PRICE,
  volume: '',
  isLimit: false,
  volumeIndex: null,
});
const EditOrderSpslModal = ({
  data = {},
  onClose,
  visible,
  editSpsl,
}: {
  data: any;
  onClose: any;
  visible: any;
  editSpsl?: boolean;
}) => {
  const {
    stopProfit,
    stopLoss,
    stopProfitType,
    stopLossType,
    incomeStandard1,
    incomeStandard2,
    triggerPrice,
    triggerPriceType,
    price,
    volume,
    isLimit,
    volumeIndex,
  } = store;
  const { isMobile } = useResponsive();
  const [showSpsl, setShowSpsl] = useState(false);
  const [ckey, setCkey] = useState(() => +new Date());
  const [ckey1, setCkey1] = useState(() => +new Date());
  const [ckey2, setCkey2] = useState(() => +new Date());
  const isBuy = data?.side === '1';
  const isSpslType = ['2', '1'].includes(`${data['strategyType']}`);

  const code = data.symbol;

  const { priceUnitText, isUsdtType } = Swap.Trade.base;
  const cryptoData = Swap.Info.getCryptoData(code);
  const { currentPricePrecision, pricePrecision, minChangePrice, settleCoin } = cryptoData;
  const disabledConfirm = false;
  const disabledStopProfit = false;
  const disabledStopLoss = false;
  const flagPrice = Swap.Socket.getFlagPrice(code);
  const lever = data.leverageLevel;
  const riskDetail = Swap.Info.getRiskDetailData(code, lever);
  const marketPrice = Swap.Info.getMarketPrice(code);
  const inputVolume = Number(data.availPosition);
  const isVolUnit = Swap.Info.getIsVolUnit(isUsdtType);
  const volumeUnit = Swap.Info.getUnitText({ symbol: code });
  const { buyMinPrice, buyMaxPrice, sellMinPrice, sellMaxPrice } = Swap.Utils.formatCryptoPriceRange(
    Swap.Socket.getFlagPrice(code),
    cryptoData
  );
  const avgPrice = isSpslType && !isLimit ? data.triggerPrice : data.price;
  const priceMax = isBuy ? buyMaxPrice : sellMaxPrice;
  const priceMin = isBuy ? buyMinPrice : sellMinPrice;

  const { editOrder } = useEditOrder();
  const volumeDigit = Swap.Info.getVolumeDigit(code);

  const onChangePrice = (e: any) => {
    store.price = e;
  };
  const formatPositionNumber = (num?: any, fixed?: any, flagPrice?: any) => {
    return data
      ? Swap.Calculate.formatPositionNumber({
          usdt: isUsdtType,
          code: data.symbol,
          value: num || 0,
          fixed: fixed || volumeDigit,
          flagPrice: avgPrice,
        })
      : 0;
  };
  const onChangeVolume = (e: any, index: any) => {
    const max = Number(formatPositionNumber(data?.availPosition));
    if (e * 1 > max) {
      e = max;
    }
    store.volume = e;
    store.volumeIndex = index;
  };
  const optionFormat = (v?: any) => {
    let value = formatPositionNumber(v);

    if (isVolUnit && Number(value) < 1) {
      value = 0;
    }

    return Number(value);
  };

  const maxVolume = Number(formatPositionNumber(Number(data.availPosition || 0)));
  useEffect(() => {
    if (!visible) {
      return;
    }
    data.otocoOrder?.triggerOrders?.forEach((element: any) => {
      if (element['status'] !== 4) {
        if (element['strategyType'] == '1') {
          store.stopProfit = element['triggerPrice'];
          store.stopProfitType = element['priceType'] != '1' ? TYPES.FLAG_PRICE : TYPES.NEWS_PRICE;
        } else {
          store.stopLoss = element['triggerPrice'];
          store.stopLossType = element['priceType'] != '1' ? TYPES.FLAG_PRICE : TYPES.NEWS_PRICE;
        }
      }
    });
    if (editSpsl) {
      setShowSpsl(true);
    } else {
      setShowSpsl(data.otocoOrder?.triggerOrders?.length > 0);
    }

    store.incomeStandard1 = 0;
    store.incomeStandard2 = 0;

    store.incomeStandard1 = 0;
    store.incomeStandard2 = 0;

    setCkey(+new Date());

    store.triggerPrice = `${data.triggerPrice}`.toFixed();
    store.triggerPriceType = data['priceType'] == '1' ? TYPES.NEWS_PRICE : TYPES.FLAG_PRICE;
    store.price = `${data.price || 0}`.toFixed();
    store.volume = `${Number(formatPositionNumber(data.availPosition))}`; // 张数默认100%
    store.isLimit = ['1', '4'].includes(data['type']);
    store.volumeIndex = 4 as any;
  }, [visible]);
  const calcMargin = () => {
    let value = Swap.Calculate.commissionCost({
      usdt: isUsdtType,
      code: code,
      isBuy,
      // isLimitType: isLimit,
      isLimitType: true,
      lever,
      flagPrice,
      sell1Price: marketPrice,
      buy1Price: marketPrice,
      inputPrice: isLimit ? Number(data.price || 0) : marketPrice,
      inputVolume: inputVolume,
      initMargins: riskDetail.initMargins,
      maxVolume: inputVolume,
    });
    return value;
  };

  const margin = calcMargin();

  const setIncomeStandard1 = (v: any) => (store.incomeStandard1 = v);
  const setIncomeStandard2 = (v: any) => (store.incomeStandard2 = v);
  const _onStopProfitChange = (v: any) => {
    if (disabledStopProfit) {
      return;
    }
    store.stopProfit = v;
  };
  const _onStopLossChange = (v: any) => {
    if (disabledStopLoss) {
      return;
    }
    store.stopLoss = v;
  };
  const _calculateIncome = ({ profit, loss }: { profit?: boolean; loss?: boolean }) => {
    const price = loss ? store.stopLoss : profit ? store.stopProfit : 0;
    if (price) {
      const value = Swap.Calculate.income({
        usdt: isUsdtType,
        code: data.symbol?.toUpperCase(),
        isBuy: data.side === '1',
        avgCostPrice: Number(data.avgCostPrice),
        volume: Number(data.availPosition),
        flagPrice: Number(price),
      });
      return `${value}`;
    } else {
      return '';
    }
  };
  // const onClearInput = async (incomeLoss: boolean) => {
  //   if (incomeLoss) {
  //     store.stopLoss = '';
  //   } else {
  //     store.stopProfit = '';
  //   }
  // };
  const stopProfitIncome = _calculateIncome({ profit: true });
  const stopLossIncome = _calculateIncome({ loss: true });

  const _onStopProfitTypeChange = (v: any) => (store.stopProfitType = v);
  const _onStopLossTypeChange = (v: any) => (store.stopLossType = v);
  const _onConfirm = () => {
    const calculateAmountToVolume = Swap.Calculate.amountToVolume({
      usdt: isUsdtType,
      value: Number(store.volume),
      code: code,
      flagPrice: avgPrice,
    });
    let editParams: any = {
      price: Number(store.price),
      volume: Number(calculateAmountToVolume),
      triggerPrice: Number(store.triggerPrice),
      triggerPriceType: store.triggerPriceType == TYPES.NEWS_PRICE ? 1 : 2, // 1:市场价格，2:标记价格，
    };
    if (showSpsl) {
      editParams = {
        ...editParams,
        stopProfit: store.stopProfit,
        stopProfitType: store.stopProfitType == TYPES.NEWS_PRICE ? 1 : 2, // 1:市场价格，2:标记价格，
        stopLoss: store.stopLoss,
        stopLossType: store.stopLossType == TYPES.NEWS_PRICE ? 1 : 2,
      };
    }

    editOrder({
      onDone: () => {
        onClose();
      },
      data,
      editParams,
      isLimit: store.isLimit,
    });
  };
  const content = (
    <>
      <div className={clsx('edit-order-spsl-modal', isMobile && 'mobile')}>
        <div>
          <Info label={LANG('合约')} value={name} className={clsx(isBuy ? 'green' : 'red')} />
          <Info
            label={`${LANG('开仓价格')} (${priceUnitText})`}
            value={(data.positionAvgPrice || data.price)?.toFormat(Number(currentPricePrecision))}
          />
          <Info
            label={`${LANG('标记价格')} (${priceUnitText})`}
            value={flagPrice.toFormat(Number(currentPricePrecision))}
          />
        </div>
        {!editSpsl && (
          <>
            {isSpslType && (
              <InputSection
                key={`${ckey}_5`}
                label={LANG('触发价格')}
                placeholder={LANG('触发价格')}
                selectLabel={LANG('触发类型')}
                value={triggerPrice}
                onChange={(v: any) => {
                  store.triggerPrice = v;
                }}
                digit={pricePrecision}
                minChangePrice={minChangePrice}
                type={triggerPriceType}
                unit={priceUnitText}
                tips={false}
                onTypeChange={(v: any) => (store.triggerPriceType = v)}
                data={data}
                min={priceMin}
                max={priceMax}
              />
            )}
            <InputSection
              key={`${ckey}_4`}
              label={LANG('价格')}
              placeholder={!isLimit ? LANG('市价') : null}
              disabledInput={!isLimit}
              selectLabel={LANG('委托类型')}
              value={!isLimit ? '' : price}
              options={[LANG('市价'), LANG('限价')]}
              onChange={onChangePrice}
              digit={pricePrecision}
              minChangePrice={minChangePrice}
              unit={priceUnitText}
              type={!isLimit ? TYPES.NEWS_PRICE : TYPES.FLAG_PRICE}
              onTypeChange={(v: any) => {
                store.isLimit = v === TYPES.FLAG_PRICE;
              }}
              select={isSpslType}
              min={priceMin}
              max={priceMax}
              data={data}
            />
            <InputSection
              key={`${ckey}_3`}
              label={LANG('数量')}
              value={volume}
              enableMinChange={false}
              onChange={(v: any) => {
                onChangeVolume(v, null);
              }}
              digit={volumeDigit}
              max={maxVolume}
              select={false}
              unit={volumeUnit}
              data={data}
            />
            <div className={clsx('rates')}>
              {Array(4)
                .fill('')
                .map((v, index) => {
                  const rate = (index + 1) * 25;
                  const value = optionFormat((rate / 100) * data.availPosition);
                  const _volumeIndex = volumeIndex as any;
                  const active = _volumeIndex != null && _volumeIndex >= index;
                  return (
                    <div
                      key={index}
                      className={clsx('item', active && 'active')}
                      onClick={() => {
                        onChangeVolume(value, index);
                      }}
                    >
                      {rate}%
                    </div>
                  );
                })}
            </div>
            {data['reduceOnly'] != true && (
              <div className={clsx('spsl-bar')}>
                <div>{LANG('止盈止损')}</div>
                <Switch checked={showSpsl} onChange={() => setShowSpsl((v) => !v)} bgType={2} />
              </div>
            )}
          </>
        )}
        {showSpsl && data['reduceOnly'] != true && (
          <>
            <div className={clsx('active-info')}>
              {LANG('由于行情变动快，止损触发价不宜设置离强平价格过近，避免触发失败。')}
            </div>
            <InputSection
              key={`${ckey}_${ckey1}_1`}
              // disabled={disabledStopProfit}
              label={LANG('止盈')}
              value={stopProfit}
              placeholder={LANG('止盈触发价格')}
              onChange={_onStopProfitChange}
              digit={pricePrecision}
              minChangePrice={minChangePrice}
              unit={priceUnitText}
              income={stopProfitIncome}
              type={stopProfitType}
              onTypeChange={_onStopProfitTypeChange}
              minChange={incomeStandard1 === 0 ? stopProfitType == Swap.Trade.PRICE_TYPE.NEW : false}
              incomeStandard={incomeStandard1}
              setIncomeStandard={setIncomeStandard1}
              data={{ ...data, margin }}
              displayPriceInfo
              clearable={false}
              cancelEnable
            />
            <div style={{ height: 15 }}></div>
            <InputSection
              key={`${ckey}_${ckey2}_2`}
              // disabled={disabledStopLoss}
              label={LANG('止损')}
              placeholder={LANG('止损触发价格')}
              value={stopLoss}
              onChange={_onStopLossChange}
              unit={priceUnitText}
              digit={pricePrecision}
              minChangePrice={minChangePrice}
              income={stopLossIncome}
              type={stopLossType}
              onTypeChange={_onStopLossTypeChange}
              incomeLossNegative
              incomeLoss
              minChange={incomeStandard2 === 0 ? stopLossType == Swap.Trade.PRICE_TYPE.NEW : false}
              incomeStandard={incomeStandard2}
              setIncomeStandard={setIncomeStandard2}
              data={{ ...data, margin }}
              clearable={false}
              cancelEnable
            />
            {!isMobile && <div style={{ height: 20 }}></div>}
          </>
        )}
      </div>
      <style jsx>{`
        .edit-order-spsl-modal.mobile {
          overflow: scroll;
          max-height: 70vh;
          .spsl-bar {
            padding: 10px 0;
          }
        }
        .active-info {
          padding-bottom: 10px;
          font-size: 12px;
          color: var(--skin-main-font-color);
        }
        .spsl-bar {
          color: var(--theme-font-color-1);
          border-top: 1px solid var(--skin-border-color-1);
          padding: 10px 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .rates {
          margin-bottom: 15px;
          display: flex;
          flex-direction: row;

          .item {
            cursor: pointer;
            flex: 1;
            margin-right: 10px;
            &:last-child {
              margin-right: 0;
            }
            display: flex;
            flex-direction: column;
            align-items: center;
            font-size: 12px;
            font-weight: 400;
            color: var(--theme-trade-text-color-3);
            &::before {
              margin-bottom: 5px;
              content: '';
              width: 100%;
              height: 10px;
              border-radius: 4px;
              display: block;
              background-color: var(--theme-trade-sub-button-bg);
            }
            &.active {
              &::before {
                background-color: var(--skin-primary-color);
              }
            }
          }
        }
      `}</style>
    </>
  );
  if (isMobile) {
    return (
      <MobileModal visible={visible} onClose={onClose} type='bottom'>
        <BottomModal title={LANG('修改订单')} onConfirm={_onConfirm} disabledConfirm={disabledConfirm}>
          {content}
        </BottomModal>
      </MobileModal>
    );
  }

  return (
    <>
      <Modal visible={visible} onClose={onClose}>
        <ModalTitle title={LANG('修改订单')} onClose={onClose} />
        <div className={clsx('content')}>{content}</div>
        <ModalFooter onConfirm={_onConfirm} onCancel={onClose} disabledConfirm={disabledConfirm} />
      </Modal>
    </>
  );
};

export default EditOrderSpslModal;
