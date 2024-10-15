import { Loading } from '@/components/loading';
import { BottomModal, MobileModal } from '@/components/mobile-modal';
import { AlertFunction } from '@/components/modal';
import Modal, { ModalFooter, ModalTitle } from '@/components/trade-ui/common/modal';
import { useFormatCryptoName, useResponsive, useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { formatNumber2Ceil, message } from '@/core/utils';
import { useEffect, useState } from 'react';
import { CloseTips, store as CloseTipsStore } from './components/close-tips';
import { Info } from './components/info';
import { InputSection } from './components/input-section';
import { clsx, styles } from './styled';
import * as Utils from './utils';
import { store, useLiquidation } from './utils';
const TYPES = Utils.TYPES;

const StopProfitStopLossModal = ({ data = {}, onClose, visible }: { data: any; onClose: any; visible: any }) => {
  const {
    stopProfit,
    stopLoss,
    stopProfitType,
    stopLossType,
    defaultStopProfit,
    defaultStopLoss,
    triggerPrice,
    triggerPriceType,
    price,
    volume,
    isLimit,
    volumeIndex,
    incomeStandard1,
    incomeStandard2,
    incomeStandard3,
  } = store;
  const [ckey, setCkey] = useState(() => +new Date());
  const [ckey1, setCkey1] = useState(() => +new Date());
  const [ckey2, setCkey2] = useState(() => +new Date());
  const [editMode, setEditMode] = useState(false);
  const setIncomeStandard1 = (v: any) => (store.incomeStandard1 = v);
  const setIncomeStandard2 = (v: any) => (store.incomeStandard2 = v);
  const setIncomeStandard3 = (v: any) => (store.incomeStandard3 = v);
  const [tabIndex, setTabIndex] = useState(0);
  const isCloseType = tabIndex === 1;
  const { isMobile } = useResponsive();
  const { formatSwapCryptoName } = useFormatCryptoName();
  const isBuy = data.side === '1';
  const code = data.symbol?.toUpperCase();
  const { isDark } = useTheme();
  const { priceUnitText } = Swap.Trade.base;
  const isUsdtType = Swap.Info.getIsUsdtType(code);
  const flagPrice = Swap.Socket.getFlagPrice(code);
  const cryptoData = Swap.Info.getCryptoData(code);
  const { currentPricePrecision, pricePrecision, minChangePrice, settleCoin } = cryptoData;
  const name = `${formatSwapCryptoName(code)} ${LANG('永续____1')} / ${isBuy ? LANG('买') : LANG('卖')} ${data.leverage
    }X`;
  const disabledStopProfit = false;
  const disabledStopLoss = false;
  const scale = isUsdtType ? 2 : Number(data.basePrecision);
  const volumeDigit = Swap.Info.getVolumeDigit(code);
  const volumeUnit = Swap.Info.getUnitText({ symbol: code });
  const { formatPositionNumber, maxVolume, onChangePrice, onChangeVolume, calculateIncome } = useLiquidation({
    data,
  });
  const income = calculateIncome();
  const maxEntrustNum = Swap.Info.getMaxEntrustNum(data?.symbol, isLimit);
  const maxEntrustNumError = Number(volume) > maxEntrustNum;
  const isVolUnit = Swap.Info.getIsVolUnit(isUsdtType);
  const optionFormat = (v?: any) => {
    let value = formatPositionNumber(v);

    if (isVolUnit && Number(value) < 1) {
      value = 0;
    }

    return Number(value);
  };
  const _calculateIncome = ({
    shouldSet = true,
    profit,
    loss,
  }: {
    shouldSet?: boolean;
    profit?: boolean;
    loss?: boolean;
  }) => {
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
  const stopProfitIncome = _calculateIncome({ profit: true });
  const stopLossIncome = _calculateIncome({ loss: true });
  const _onStopProfitTypeChange = (v: any) => (store.stopProfitType = v);
  const _onStopLossTypeChange = (v: any) => (store.stopLossType = v);
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

  const _onConfirm = async () => {
    const params: any[] = [];

    // if (!defaultStopProfit && stopProfit) {
    //   params.push(SubmitStopProfit({ stopProfit, stopProfitType, position }));
    // }
    // if (!defaultStopLoss && stopLoss) {
    //   params.push(SubmitStopLoss({ stopLoss, stopLossType, position }));
    // }
    // if (!params.length) {
    //   return;
    // }
    if (!isCloseType) {
      if (Number(stopProfit) > 0) {
        params.push({
          priceType: stopProfitType === TYPES.NEWS_PRICE ? '1' : '2',
          triggerPrice: stopProfit,
          strategyType: 1,
        });
      }
      if (Number(stopLoss) > 0) {
        params.push({
          priceType: stopLossType === TYPES.NEWS_PRICE ? '1' : '2',
          triggerPrice: stopLoss,
          strategyType: 2,
        });
      }
      if (!editMode && params.length === 0) {
        return;
      }

      // if (!_validate()) return;
    }
    const flagPrice = Swap.Socket.getFlagPrice(code);
    const priceNow = Swap.Utils.getNewPrice(code);

    Loading.start();

    let orderQty: any = volume;
    if (volumeIndex === 4) {
      // 100% 等于仓位数量
      orderQty = Number(data.availPosition);
    } else if (isUsdtType ? true : !isVolUnit) {
      orderQty = Swap.Calculate.amountToVolume({
        usdt: isUsdtType,
        value: orderQty,
        code: data.symbol,
      });
    }
    console.log("isCloseType", isCloseType)

    const result = !isCloseType
      ? await Utils.SubmitStopProfitStopLoss({
        position: data,
        edit: editMode,
        params: params,
        flagPrice,
        priceNow,
        stopProfit,
        stopLoss,
        defaultStopProfit,
        defaultStopLoss,
        stopProfitType,
        stopLossType,
        isUsdtType,
        balanceData: Swap.Assets.getBalanceData({ code: data.symbol, walletId: data.subWallet }),
        cryptoData,
        subWallet: data['subWallet'],
      })
      : await Swap.Trade.submitSpslOrder({
        price: isLimit ? price : '',
        orderQty: orderQty,
        side: !isBuy ? 1 : 2,
        symbol: code,
        type: isLimit ? 4 : 5,
        reduceOnly: 1,
        opType: 3,
        triggerPrice: triggerPrice,
        priceType: triggerPriceType === TYPES.FLAG_PRICE ? 2 : 1,
        subWallet: data['subWallet'],
      });

    if (result) {
      try {
        if (result?.code === 200) {
          Swap.Order.fetchPending(isUsdtType);
          Swap.Order.fetchPosition(isUsdtType);
          if (!isCloseType) {
            message.success(LANG('修改成功'), 1);
          }
          onClose?.();
        } else {
          message.error(result?.message || LANG('失败'), 1);
        }
      } catch (e: any) {
        message.error(e?.error?.message || LANG('失败'), 1);
      } finally {
      }
    }
    Loading.end();
  };

  useEffect(() => {
    if (!visible) {
      return;
    }

    setIncomeStandard1(0);
    setIncomeStandard2(0);
    setIncomeStandard3(0);

    let stopProfit = null;
    let stopLoss = null;
    let stopProfitType = TYPES.NEWS_PRICE;
    let stopLossType = TYPES.NEWS_PRICE;

    setEditMode(data.orders.length > 0);
    Utils.setDefaultSpsl({ data, incomeLoss: false });
    Utils.setDefaultSpsl({ data, incomeLoss: true });

    store.triggerPrice = '';
    store.triggerPriceType = TYPES.NEWS_PRICE;
    store.price = '';
    store.volume = `${Number(formatPositionNumber(data.availPosition))}`; // 张数默认100%
    store.isLimit = false;
    store.volumeIndex = 4 as any;

    setCkey(+new Date());
  }, [visible]);
  const disabledConfirm = !isCloseType
    ? (Number(stopProfit || 0) <= 0 ||
      Number(stopLoss || 0) <= 0)
    : maxEntrustNumError ||
    Number(triggerPrice || 0) <= 0 ||
    Number(volume || 0) <= 0 ||
    (isLimit ? Number(price || 0) <= 0 : false);


  const onClearInput = async (incomeLoss: boolean) => {
    const onDone = (_data: any) => {
      Utils.setDefaultSpsl({ data: _data, incomeLoss });
      if (!incomeLoss) {
        setCkey1(+new Date());
      } else {
        setCkey2(+new Date());
      }
    };
    const orders = data.orders;
    const item = data.orders?.filter((item: any) => {
      const type = item['strategyType'];
      if (type === '1' && !incomeLoss) {
        return true;
      } else if (type === '2' && incomeLoss) {
        return true;
      }
      return false;
    })[0];
    Loading.start();
    try {
      const result = await Swap.Order.cancelPending(item);
      if (result.code == 200) {
        message.success(LANG('撤销成功'));
        const nextOrders = orders?.filter((e: any) => e['strategyType'] == (!incomeLoss ? '2' : '1'));
        onDone({
          ...data,
          orders: nextOrders,
        });
        setEditMode(nextOrders.length > 0);
      } else {
        message.error(result);
      }
    } catch (error: any) {
      message.error(error);
    } finally {
      Loading.end();
    }
  };
  const content = (
    <>
      <div className={clsx('content')}>
        <div className={clsx('tabbar')}>
          {[LANG('全部仓位'), LANG('部分仓位')].map((v, i) => (
            <div key={i} className={clsx(tabIndex === i && 'active')} onClick={() => setTabIndex(i)}>
              {v}
            </div>
          ))}
        </div>
        <div className={clsx('scroll')}>
          <div>
            <Info label={LANG('合约')} value={name} className={clsx(isBuy ? 'green' : 'red')} />
            <Info
              label={`${LANG('开仓价格')} (${priceUnitText})`}
              value={formatNumber2Ceil(data.avgCostPrice, Number(data.baseShowPrecision), data.side === '1').toFormat(
                Number(data.baseShowPrecision)
              )}
            />
            <Info
              label={`${LANG('标记价格')} (${priceUnitText})`}
              value={flagPrice.toFormat(Number(currentPricePrecision))}
            />
          </div>
          <div className={clsx('active-info')}>
            {LANG('由于行情变动快，止损触发价不宜设置离强平价格过近，避免触发失败。')}
          </div>
          {isCloseType ? (
            <>
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
                income={income}
                onTypeChange={(v: any) => (store.triggerPriceType = v)}
                data={data}
                incomeLoss
                minChange={incomeStandard3 === 0 ? triggerPriceType == Swap.Trade.PRICE_TYPE.NEW : false}
                incomeStandard={incomeStandard3}
                setIncomeStandard={setIncomeStandard3}
                onIncomeStandardTextChange={({ _value }: any) => {
                  CloseTipsStore.value = _value;
                }}
              />
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
                income={income}
                type={!isLimit ? TYPES.NEWS_PRICE : TYPES.FLAG_PRICE}
                onTypeChange={(v: any) => {
                  store.isLimit = v === TYPES.FLAG_PRICE;
                }}
                data={data}
                tips={({ className }: any) => {
                  return (
                    <CloseTips
                      {...{
                        isLimit,
                        price,
                        triggerPrice,
                        className,
                        triggerPriceType,
                        isUsdtType,
                        data,
                        settleCoin,
                        incomeStandard: incomeStandard3,
                      }}
                    />
                  );
                }}
              />
              <InputSection
                key={`${ckey}_3`}
                // label={LANG('数量')}
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
              {maxEntrustNumError && (
                <div className={clsx('error-text')}>
                  {LANG('已超出单笔最大委托数量{value} {symbol}', { value: maxEntrustNum, symbol: volumeUnit })}
                </div>
              )}
              <Info label={`${LANG('数量')}`} value={`${volume} ${volumeUnit}`} />
              <Info
                label={LANG('预计盈亏')}
                value={`${income} ${settleCoin}`}
                className={clsx(Number(income) >= 0 ? 'green' : 'red')}
                info={
                  <>
                    <div>
                      {LANG(
                        '预期盈亏为平仓的估算盈亏，手续费和实际成交的价格差异会使得预估值和实际值有较大差异，请仅供参考。'
                      )}
                    </div>
                    <div>
                      {LANG('市价止盈止损委托根据触发价格估算预期盈亏。限价止盈止损根据限价价格估算预期盈亏。')}
                    </div>
                  </>
                }
              />
            </>
          ) : (
              <>
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
                  data={data}
                  displayPriceInfo
                  onClearInput={!!defaultStopProfit ? () => onClearInput(false) : undefined}
                  clearable={false}
                  cancelEnable
                />
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
                  data={data}
                  clearable={false}
                  cancelEnable
                  onClearInput={!!defaultStopLoss ? () => onClearInput(true) : undefined}
                />
                <div style={{ height: 10 }}></div>
              </>
            )}
          {/* <div className={clsx('description')}>
    *{' '}
    {LANG(
      '该止盈止损针对整个仓位(无论加仓或者减仓）。平仓后该止盈止损将被自动取消。当价格到达设定的触发价格时，将执行市价平仓委托。如果仓位数量超过市价委托单笔最大数量限制时，委托将被拒绝。'
    )}
  </div> */}
        </div>
      </div>
      {styles}
    </>
  );
  const theme = useTheme().theme;
  const titleInfo = () => {
    AlertFunction({
      title: LANG('止盈止损生效范围'),
      content: (
        <>
          <div className='title'>{LANG('全部仓位')}</div>
          <div>
            {LANG('仅允许设置一个应用于整个仓位的止盈止损委托。当价格达到止盈或止损触发价格时，将以市价全部平仓。')}
          </div>
          <div className='line' />
          <div className='title'>{LANG('部分仓位')}</div>
          <div>
            {LANG(
              '允许设置多个应用于部分仓位的止盈止损委托。达到部分止盈或止损触发价格时，将通过市价单或限价单平仓对应的止盈或止损委托数量。'
            )}
          </div>
          <style jsx>{`
            .title {
              font-size: 13px;
              font-weight: 500;
            }
            .line {
              height: 10px;
            }
          `}</style>
        </>
      ),
      okText: LANG('确认'),
      onOk: () => { },
      theme: theme,
      v3: true,
      zIndex: 10001,
    });
  };
  if (isMobile) {
    return (
      <MobileModal visible={visible} onClose={onClose} type='bottom'>
        <BottomModal
          onConfirm={_onConfirm}
          disabledConfirm={disabledConfirm}
          title={LANG('设置止盈止损')}
          titleInfo={titleInfo}
          contentClassName={clsx('stop-profit-stop-loss-mobile-content')}
        // titles={[LANG('止盈/止损'), LANG('仓位止盈止损')]}
        // tabIndex={tabIndex}
        // onChangeIndex={setTabIndex}
        >
          {content}
        </BottomModal>
      </MobileModal>
    );
  }

  return (
    <>
      <Modal
        visible={visible}
        onClose={onClose}
        className={clsx('stop-profit-stop-loss', !isDark && 'light')}
        contentClassName={clsx('stop-profit-stop-loss-content')}
        modalContentClassName={clsx('stop-profit-stop-loss-modal-content')}
      >
        <ModalTitle
          title={LANG('设置止盈止损')}
          titleInfo={titleInfo}
          // titles={[LANG('止盈/止损'), LANG('仓位止盈止损')]}
          // index={tabIndex}
          // onChange={setTabIndex}
          onClose={onClose}
        />
        {content}
        <ModalFooter onConfirm={_onConfirm} onCancel={onClose} disabledConfirm={disabledConfirm} />
      </Modal>
    </>
  );
};

export default StopProfitStopLossModal;
