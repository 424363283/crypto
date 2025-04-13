import { Loading } from '@/components/loading';
import { BottomModal, MobileModal } from '@/components/mobile-modal';
import Slider from '@/components/Slider';
import { AlertFunction } from '@/components/modal';
import Modal, { ModalFooter, ModalTitle } from '@/components/trade-ui/common/modal';
import { useFormatCryptoName, useResponsive, useTheme } from '@/core/hooks';
import { formatIncomeStandard } from '@/components/trade-ui/trade-view/swap/components/modal/spsl-setting-modal/utils';

import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { formatNumber2Ceil, message } from '@/core/utils';
import { useEffect, useState } from 'react';
import { CloseTips, store as CloseTipsStore } from './components/close-tips';
import { NewCloseTips } from './components/new-close-tips';
import { Info } from './components/info';
import { InputSection } from './components/input-section';

import { InputRoe } from './components/input-roe';
import { InputPrice } from './components/input-price';
import { SwitchPrice } from './components/switch-price';
import BigNumber from 'bignumber.js';
import { clsx, styles } from './styled';
import * as Utils from './utils';
import {
  store,
  useLiquidation,
  setStopLossRoe,
  setStopProfitRoe,
  setStopfitPrice,
  setStopLossPrice,
  setTriggerPriceRoe,
  setTriggerPrice,
  setStopTriggerPrice,
  setStopTriggerPriceRoe,
  setstopLossLimitPrice,
  _calculateIncome,
  resetFormData
} from './utils';
import { DesktopOrTablet, Mobile } from '@/components/responsive';
const TYPES = Utils.TYPES;

const StopProfitStopLossModal = ({
  data = {},
  onClose,
  visible,
  tab = 0
}: {
  data: any;
  onClose: any;
  visible: any;
  tab?: number;
}) => {
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
    stopLossLimitPrice
  } = store;
  const [_value, _setValue] = useState(price);
  const [ckey, setCkey] = useState(() => +new Date());
  const [ckey1, setCkey1] = useState(() => +new Date());
  const [ckey2, setCkey2] = useState(() => +new Date());
  const [editMode, setEditMode] = useState(false);
  const setIncomeStandard1 = (v: any) => (store.incomeStandard1 = v);
  const setIncomeStandard2 = (v: any) => (store.incomeStandard2 = v);
  const setIncomeStandard3 = (v: any) => (store.incomeStandard3 = v);
  const [tabIndex, setTabIndex] = useState(tab);
  const { isMobile } = useResponsive();
  const [stopProfitLossTab, setStopProfitLossTab] = useState(isMobile ? 'PROFIT' : '');
  const isCloseType = tabIndex === 1;

  const { formatSwapCryptoName } = useFormatCryptoName();
  const isBuy = data.side === '1';
  const code = data.symbol?.toUpperCase();
  const { isDark } = useTheme();
  const { priceUnitText } = Swap.Trade.base;
  const isUsdtType = Swap.Info.getIsUsdtType(code);
  const flagPrice = Swap.Socket.getFlagPrice(code);
  const cryptoData = Swap.Info.getCryptoData(code);
  const { currentPricePrecision, pricePrecision, minChangePrice, settleCoin } = cryptoData;
  const name = `${formatSwapCryptoName(code)} ${LANG('永续____1')} / ${isBuy ? LANG('买') : LANG('卖')} ${
    data.leverage
  }X`;
  const disabledStopProfit = false;
  const disabledStopLoss = false;
  const scale = isUsdtType ? 2 : Number(data.basePrecision);
  let volumeDigit = Swap.Info.getVolumeDigit(code);
  const isMarginUnit = Swap.Info.getIsMarginUnit(isUsdtType);
  const balanceDigit = Swap.Assets.getBalanceDigit({ code: code });
  if (isMarginUnit) {
    volumeDigit = balanceDigit;
  }

  const volumeUnit = Swap.Info.getUnitText({ symbol: code });
  const { formatPositionNumber, maxVolume, onChangePrice, onChangeVolume, calculateIncome } = useLiquidation({
    data
  });
  const income = calculateIncome();
  const maxEntrustNum = Swap.Info.getMaxEntrustNum(data?.symbol, isLimit);
  const maxEntrustNumError = Number(volume) > maxEntrustNum;
  const maxStopVolumeNumError = Number(store.stopVolume) > maxEntrustNum;
  const isVolUnit = Swap.Info.getIsVolUnit(isUsdtType);
  const { incomeStandardRoe } = formatIncomeStandard(incomeStandard1);
  const theme = useTheme().theme;

  const optionFormat = (v?: any, fixed?: any, flagPrice?: any, isRoundup?: boolean) => {
    let value = formatPositionNumber(v, fixed, flagPrice, isRoundup);

    if (isVolUnit && Number(value) < 1) {
      value = 0;
    }

    return Number(value);
  };

  const stopProfitIncome = _calculateIncome({ data, profit: true });
  const stopLossIncome = _calculateIncome({ data, loss: true });
  const _onStopProfitTypeChange = (v: any) => (store.stopProfitType = v);
  const _onStopLossTypeChange = (v: any) => (store.stopLossType = v);

  const _onStopProfitLimitTypeChange = (v: any) => (store.stopProfitLimitType = v);
  const _onStopLossLimitTypeChange = (v: any) => (store.stopLossLimitType = v);

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
          strategyType: 1
        });
      }
      if (Number(stopLoss) > 0) {
        params.push({
          priceType: stopLossType === TYPES.NEWS_PRICE ? '1' : '2',
          triggerPrice: stopLoss,
          strategyType: 2
        });
      }
      if (!editMode && params.length === 0) {
        return;
      }

      // if (!_validate()) return;
    }
    const flagPrice = Swap.Socket.getFlagPrice(code);
    const priceNow = Swap.Utils.getNewPrice(code);

    const { triggerPrice, stopTriggerPrice } = store;
    const positionSide = data.positionSide;
    /* 部分仓位止盈止损 */
    if (isCloseType) {
      /* 
        方向为多:
        止盈:触发价格>最新价或标记价，
        止损:触发价<最新价或标记价,错误提示“价格设置错误，请重试”:非以上两种情况都错误提示。
      */
      if (triggerPrice && stopTriggerPrice) {
        const isLong = positionSide === 'LONG';

        const checkTriggerPrice = isLong
          ? Number(triggerPrice) > flagPrice && Number(triggerPrice) > priceNow
          : Number(triggerPrice) < flagPrice && Number(triggerPrice) < priceNow;

        const checkStopTriggerPrice = isLong
          ? Number(stopTriggerPrice) < flagPrice && Number(stopTriggerPrice) < priceNow
          : Number(stopTriggerPrice) > flagPrice && Number(stopTriggerPrice) > priceNow;

        if (!checkTriggerPrice || !checkStopTriggerPrice) {
          return message.error(LANG('价格设置错误，请重试'), 1);
        }
      }
    } else {
      /* 全仓止盈止损 */
      // stopProfit 止盈
      // stopLoss 止损
      if (stopProfit && stopLoss) {
        const isLong = positionSide === 'LONG';

        const checkStopProfit = isLong
          ? Number(stopProfit) > flagPrice && Number(stopProfit) > priceNow
          : Number(stopProfit) < flagPrice && Number(stopProfit) < priceNow;

        const checkStopLoss = isLong
          ? Number(stopLoss) < flagPrice && Number(stopLoss) < priceNow
          : Number(stopLoss) > flagPrice && Number(stopLoss) > priceNow;

        if (!checkStopProfit || !checkStopLoss) {
          return message.error(LANG('价格设置错误，请重试'), 1);
        }
      }
    }
    // const getProfitUSD = Number(
    //   new BigNumber(cryptoData.contractFactor).multipliedBy(getAvgPrice()).toString()
    // ).toFixed(2, 1); //获取当前的最小下单usdt 数量
    // const getStopLossUSD = Number(
    //   new BigNumber(cryptoData.contractFactor).multipliedBy(getAvgPrice()).toString()
    // ).toFixed(2, 1);
    // let getProfitUSD = Number(
    //   new BigNumber(cryptoData.contractFactor).multipliedBy(Swap.Utils.getNewPrice(code)).toString()
    // ); //获取当前的最小下单usdt 数量
    // let getStopLossUSD = Number(
    //   new BigNumber(cryptoData.contractFactor).multipliedBy(Swap.Utils.getNewPrice(code)).toString()
    // );
    // const getCoin = cryptoData.contractFactor; //获取当前最小下单币的数量

    let orderQty: any =
      Number(store.volumePercent) > 100
        ? formatPositionNumber(data?.availPosition, volumeDigit, getAvgPrice()).toFixed(2, 1)
        : volume;
    /* 止损 */
    let stopVolume: any =
      Number(store.stopVolumePercent) > 100
        ? formatPositionNumber(data?.availPosition, volumeDigit, getAvgPrice()).toFixed(2, 1)
        : store.stopVolume;
    // if (isCloseType) {
    //   if (stopVolume != '') {
    //     const getMin = !isVolUnit ? getCoin : getStopLossUSD;
    //     if (Number(stopVolume) < Number(getMin)) {
    //       return message.error(LANG('止损') + LANG('最小下单数量') + getMin.toFixed(volumeDigit, 1) + volumeUnit, 1);
    //     }
    //   }

    //   if (orderQty != '') {
    //     const getMin = !isVolUnit ? getCoin : getProfitUSD;
    //     if (Number(orderQty) < Number(getMin)) {
    //       return message.error(LANG('止盈') + LANG('最小下单数量') + getMin.toFixed(volumeDigit, 1) + volumeUnit, 1);
    //     }
    //   }
    // }
    if (isUsdtType ? true : !isVolUnit) {
      orderQty = Swap.Calculate.amountToVolume({
        usdt: isUsdtType,
        value: orderQty,
        code: data.symbol,
        shouldCeil: true
      });
      if (isCloseType) {
        orderQty = Swap.Calculate.amountToVolume({
          usdt: isUsdtType,
          value: volume,
          code: data.symbol,
          flagPrice: getAvgPrice(),
          shouldCeil: true
        });
      }
      if (volume && isVolUnit && orderQty < 1) {
        orderQty = 1;
      }
    }

    if (isUsdtType ? true : !isVolUnit) {
      stopVolume = Swap.Calculate.amountToVolume({
        usdt: isUsdtType,
        value: stopVolume,
        code: data.symbol,
        flagPrice: getAvgPrice(),
        shouldCeil: true
      });
      if (store.stopVolume && isVolUnit && stopVolume < 1) {
        stopVolume = 1;
      }
    }

    Loading.start();

    // 公共逻辑提取函数
    const handleResponse = async (response: any, successMessage: string) => {
      try {
        resetFormData();
        if (response?.code === 200) {
          await Promise.all([Swap.Order.fetchPending(isUsdtType), Swap.Order.fetchPosition(isUsdtType)]);
          message.success(successMessage, 1);
          onClose?.();
        } else {
          message.error(response?.message || LANG('失败'), 1);
        }
      } catch (e: any) {
        resetFormData();
        message.error(e?.error?.message || LANG('失败'), 1);
      }
    };
    // 提交请求
    const requestParams = {
      subWallet: data['subWallet'],
      price: store.stopIsLimit && stopLossLimitPrice > 0 ? stopLossLimitPrice : 0,
      orderQty: stopVolume,
      side: !isBuy ? 1 : 2,
      symbol: code,
      type: store.stopIsLimit ? 4 : 5,
      reduceOnly: 1,
      opType: 3,
      triggerPrice: stopTriggerPrice,
      priceType: store.stopProfitLimitType === TYPES.FLAG_PRICE ? 2 : 1
    };
    const [result, result2] = await Promise.all([
      !isCloseType
        ? Utils.SubmitStopProfitStopLoss({
            position: data,
            edit: editMode,
            params,
            flagPrice,
            priceNow,
            stopProfit,
            stopLoss,
            defaultStopProfit,
            defaultStopLoss,
            stopProfitType,
            stopLossType,
            isUsdtType,
            balanceData: Swap.Assets.getBalanceData({
              code: data.symbol,
              walletId: data.subWallet
            }),
            cryptoData,
            subWallet: data['subWallet']
          })
        : orderQty > 0 && Number(triggerPrice) > 0
        ? Swap.Trade.submitSpslOrder({
            ...requestParams,
            orderQty,
            triggerPrice,
            price: isLimit && price > 0 ? price : 0,
            type: isLimit ? 4 : 5
          })
        : null,
      isCloseType
        ? stopVolume > 0 && Number(stopTriggerPrice) > 0
          ? Swap.Trade.submitSpslOrder({
              ...requestParams,
              priceType: store.stopLossLimitType === TYPES.FLAG_PRICE ? 2 : 1
            })
          : null
        : null
    ]);

    // 处理响应
    if (result) {
      await handleResponse(result, LANG('修改成功'));
    }

    if (result2) {
      await handleResponse(result2, LANG('修改成功'));
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

    const stopProfit = null;
    const stopLoss = null;
    const stopProfitType = TYPES.NEWS_PRICE;
    const stopLossType = TYPES.NEWS_PRICE;

    setEditMode(data.orders.length > 0);
    Utils.setDefaultSpsl({ data, incomeLoss: false });
    Utils.setDefaultSpsl({ data, incomeLoss: true });

    store.triggerPrice = '';
    store.triggerPriceType = TYPES.NEWS_PRICE;
    store.price = '';
    // store.volume = `${Number(formatPositionNumber(data.availPosition))}`; // 张数默认100%
    store.isLimit = false;
    // store.volumeIndex = 4 as any;

    setCkey(+new Date());
  }, [visible]);
  const { stopTriggerPrice, stopVolume } = store;
  const checkStopProfitInput =
    Number(triggerPrice || 0) > 0 && Number(volume || 0) > 0 && (isLimit ? Number(price || 0) > 0 : true);
  const checkStopLossInput =
    Number(stopTriggerPrice || 0) > 0 &&
    Number(stopVolume || 0) > 0 &&
    (store.stopIsLimit ? Number(stopLossLimitPrice) > 0 : true);
  const isLimitAndNoPrice = (isLimit && price <= 0) || (store.stopIsLimit && Number(stopLossLimitPrice) <= 0);
  const disabledConfirm = !isCloseType
    ? Number(stopProfit || 0) <= 0 && Number(stopLoss || 0) <= 0
    : !(checkStopProfitInput || checkStopLossInput) || isLimitAndNoPrice;

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
          orders: nextOrders
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
  const marks = {
    0: '0%',
    25: '25%',
    50: '50%',
    75: '75%',
    100: '100%'
  };

  const getAvgPrice = () => data.avgCostPrice;

  /* 输入或者滑杆设置收益率百分比 */
  const setRoe = (val: any, type: string, key: string, priceType: string) => {
    const isStopProfit =
      (data.positionSide === 'LONG' && type === 'stopProfit') || (data.positionSide === 'SHORT' && type === 'stopLoss');
    const newPrice = priceType === 'flag' ? Swap.Socket.getFlagPrice(code) : Swap.Utils.getNewPrice(code);
    if (key === 'stopProfit') {
      setStopProfitRoe(val);
    } else if (key === 'triggerPriceRoe') {
      setTriggerPriceRoe(val);
    } else if (key === 'stopTriggerPriceRoe') {
      setStopTriggerPriceRoe(val);
    } else {
      setStopLossRoe(val);
    }
    const percent = isStopProfit ? Number(String(val).div(100)) : -Number(String(val).div(100));
    const price = (1 + percent).mul(newPrice).toFixed(pricePrecision);

    if (key === 'stopProfit') {
      setStopfitPrice(price);
    } else if (key === 'triggerPriceRoe') {
      setTriggerPrice(price);
    } else if (key === 'stopTriggerPriceRoe') {
      setStopTriggerPrice(price);
    } else {
      setStopLossPrice(price);
    }
  };

  const handleClose = () => {
    resetFormData();
    onClose?.();
  };

  const content = (
    <>
      <div className={clsx('content')}>
        <div className={clsx('symbol-info')}>
          <div className={clsx('symbol-name')}>
            {formatSwapCryptoName(code)}
            <div className={clsx(`side side-bg ${data.positionSide === 'LONG' ? 'green' : 'red'}`)}>
              {LANG(data.positionSide === 'LONG' ? '多' : '空')}
            </div>
            <div className={clsx('leverage')}>{data.marginType === 1 ? LANG('全仓') : LANG('逐仓')}</div>
            <div className={clsx('leverage')}>
              {data.leverage}
              <span>X</span>
            </div>
          </div>

          <div className={clsx('price-group')}>
            <div className={clsx('price-item')}>
              <div className={clsx('price-label')}>{LANG('持仓均价')}:</div>
              <div className={clsx('price-value')}>
                {formatNumber2Ceil(data.avgCostPrice, Number(data.baseShowPrecision), data.side === '1').toFormat(
                  Number(data.baseShowPrecision)
                )}
              </div>
            </div>
            <div className={clsx('price-item')}>
              <div className={clsx('price-label')}>{LANG('最新价格')}:</div>
              <div className={clsx('price-value')}>{Swap.Utils.getNewPrice(code)}</div>
            </div>
            <div className={clsx('price-item')}>
              <div className={clsx('price-label')}>{LANG('预估强平价')}:</div>
              <div className={clsx('price-value')}>
                {formatNumber2Ceil(data.liquidationPrice, Number(data.baseShowPrecision), data.side === '1').toFormat(
                  Number(data.baseShowPrecision)
                )}
              </div>
            </div>
          </div>
        </div>
        <div className={clsx('tabbar')}>
          {[LANG('全部仓位'), LANG('部分仓位')].map((v, i) => (
            <div key={i} className={clsx(tabIndex === i && 'active')} onClick={() => setTabIndex(i)}>
              {v}
            </div>
          ))}
        </div>
        <div className={clsx('scroll')}>
          {isCloseType ? (
            <div className={clsx('liquidation-action')}>
              <Mobile>
                <div>
                  <div className={clsx('liquidation-tab')}>
                    <div onClick={() => setStopProfitLossTab('PROFIT')} data-active={stopProfitLossTab === 'PROFIT'}>
                      <span>{LANG('止盈')}</span>
                    </div>
                    <div onClick={() => setStopProfitLossTab('LOSS')} data-active={stopProfitLossTab === 'LOSS'}>
                      <span>{LANG('止损')}</span>
                    </div>
                  </div>
                  {stopProfitLossTab === 'PROFIT' ? (
                    <div className={clsx('liquidation-pannel')}>
                      <div className={clsx('liquidation-label')}>{LANG('止盈')}</div>
                      <div className={clsx('liquidation-form')}>
                        <InputPrice
                          digit={pricePrecision}
                          select
                          unit={priceUnitText}
                          placeholder={LANG('触发价格')}
                          value={triggerPrice}
                          data={data}
                          income={income}
                          incomeStandard={incomeStandard3}
                          onTypeChange={_onStopProfitLimitTypeChange}
                          type={store.stopProfitLimitType}
                          onChange={(v: any) => {
                            const newPrice =
                              store.stopProfitLimitType === 'flag'
                                ? Swap.Socket.getFlagPrice(code)
                                : Swap.Utils.getNewPrice(code);
                            const isStopProfit = data.positionSide === 'LONG'; // 做多并且止盈
                            const spred = isStopProfit ? v.sub(newPrice) : newPrice.sub(v);
                            const percent = v && spred ? spred.div(newPrice).mul(100).toFixed(2) : '';

                            store.triggerPrice = v;
                            setTriggerPriceRoe(percent);
                          }}
                        />

                        <InputRoe
                          placeholder={LANG('涨跌幅')}
                          value={store.triggerPriceRoe}
                          onChange={(val: number) =>
                            setRoe(val, 'stopProfit', 'triggerPriceRoe', store.stopProfitLimitType)
                          }
                          type="stopProfit"
                          positionSide={data.positionSide}
                          avgCostPrice={Swap.Utils.getNewPrice(code)}
                          inputPrice={triggerPrice}
                        />
                      </div>
                      <Slider
                        min={1}
                        max={100}
                        onChange={(val: number) => {
                          setRoe(val, 'stopProfit', 'triggerPriceRoe', store.stopProfitLimitType);
                        }}
                        value={store.triggerPriceRoe}
                        marks={marks}
                        type="stopProfit"
                      />

                      <div className={clsx('liquidation-form', !isLimit ? 'disabled' : '')}>
                        <InputPrice
                          digit={pricePrecision}
                          // select
                          showSuffix={false}
                          placeholder={!isLimit ? LANG('市价') : LANG('请输入价格')}
                          unit={volumeUnit}
                          disabled={!isLimit}
                          value={!isLimit ? '' : price > 0 ? price : ''}
                          data={data}
                          income={stopProfitIncome}
                          onTypeChange={_onStopProfitLimitTypeChange}
                          type={store.stopProfitLimitType}
                          onChange={(v: any) => onChangePrice(v)}
                          className={clsx(!isLimit ? 'market-price-input' : '')}
                        />
                        <SwitchPrice
                          type={!isLimit ? TYPES.NEWS_PRICE : TYPES.FLAG_PRICE}
                          options={[LANG('市价'), LANG('限价')]}
                          onChange={(v: any) => {
                            store.isLimit = v === TYPES.FLAG_PRICE;
                          }}
                        />
                      </div>
                      <InputPrice
                        placeholder={LANG('请输入数量')}
                        digit={volumeDigit}
                        select={false}
                        unit={volumeUnit}
                        value={volume}
                        data={data}
                        income={stopProfitIncome}
                        max={formatPositionNumber(data?.availPosition, volumeDigit)}
                        onChange={(v: any) => {
                          onChangeVolume(v, null);
                        }}
                      />
                      <Slider
                        min={1}
                        max={100}
                        onChange={(rate: number) => {
                          const value = optionFormat((rate / 100) * data.availPosition, volumeDigit, getAvgPrice());
                          onChangeVolume(value, null, rate);
                        }}
                        value={store.volumePercent}
                        marks={marks}
                        type="stopProfit"
                      />

                      <div className={clsx('tips')}>
                        <p>
                          <span className={clsx('title')}> {LANG('可止盈量')} </span>
                          {formatPositionNumber(data?.availPosition)} {volumeUnit}
                        </p>
                        {/* <NewCloseTips
                          {...{
                            isLimit,
                            price,
                            triggerPrice,
                            triggerPriceType: store.stopProfitLimitType,
                            isUsdtType,
                            data,
                            settleCoin,
                            incomeStandard: incomeStandard3,
                            availPosition: volume,
                            isCloseType: false
                          }}
                        /> */}
                      </div>
                    </div>
                  ) : (
                    <div className={clsx('liquidation-pannel')}>
                      <div className={clsx('liquidation-label')}>{LANG('止损')}</div>
                      <div className={clsx('liquidation-form')}>
                        <InputPrice
                          digit={pricePrecision}
                          select
                          placeholder={LANG('触发价格')}
                          income={income}
                          incomeStandard={incomeStandard3}
                          unit={priceUnitText}
                          value={store.stopTriggerPrice}
                          onChange={(v: any) => {
                            const newPrice =
                              store.stopLossLimitType === 'flag'
                                ? Swap.Socket.getFlagPrice(code)
                                : Swap.Utils.getNewPrice(code);
                            const isStopProfit = data.positionSide === 'LONG'; // 做多并且止盈
                            const spred = isStopProfit ? v.sub(newPrice) : newPrice.sub(v);
                            const percent = v && spred ? spred.div(newPrice).mul(100).toFixed(2) : '';
                            store.stopTriggerPrice = v;
                            setStopTriggerPriceRoe(percent);
                          }}
                          data={data}
                          type={store.stopLossLimitType}
                          onTypeChange={_onStopLossLimitTypeChange}
                        />
                        <InputRoe
                          placeholder={LANG('涨跌幅')}
                          onChange={(val: number) => {
                            setRoe(val, 'stopLoss', 'stopTriggerPriceRoe', store.stopLossLimitType);
                          }}
                          value={store.stopTriggerPriceRoe}
                          type="stopLoss"
                          positionSide={data.positionSide}
                          avgCostPrice={Swap.Utils.getNewPrice(code)}
                          inputPrice={stopLoss}
                        />
                      </div>
                      <Slider
                        min={1}
                        max={100}
                        onChange={(val: number) => {
                          setRoe(val, 'stopLoss', 'stopTriggerPriceRoe', store.stopLossLimitType);
                        }}
                        value={store.stopTriggerPriceRoe}
                        marks={marks}
                        type="stopLoss"
                      />
                      <div className={clsx('liquidation-form', !store.stopIsLimit ? 'disabled' : '')}>
                        <InputPrice
                          digit={pricePrecision}
                          showSuffix={false}
                          // select
                          placeholder={!store.stopIsLimit ? LANG('市价') : LANG('请输入价格')}
                          unit={priceUnitText}
                          disabled={!store.stopIsLimit}
                          value={!store.stopIsLimit ? '' : stopLossLimitPrice > 0 ? stopLossLimitPrice : ''}
                          onChange={(v: any) => setstopLossLimitPrice(v)}
                          data={data}
                          income={stopLossIncome}
                          onTypeChange={_onStopLossLimitTypeChange}
                          type={store.stopLossLimitType}
                          className={clsx(!store.stopIsLimit ? 'market-price-input' : '')}
                        />
                        <SwitchPrice
                          type={!store.stopIsLimit ? TYPES.NEWS_PRICE : TYPES.FLAG_PRICE}
                          options={[LANG('市价'), LANG('限价')]}
                          onChange={(v: any) => {
                            store.stopIsLimit = v === TYPES.FLAG_PRICE;
                          }}
                        />
                      </div>
                      <InputPrice
                        placeholder={LANG('请输入数量')}
                        digit={volumeDigit}
                        select={false}
                        unit={volumeUnit}
                        value={store.stopVolume}
                        onChange={(v: any) => {
                          onChangeVolume(v, null, undefined, 'partialPositionStop');
                        }}
                        data={data}
                        income={stopLossIncome}
                        onTypeChange={_onStopLossTypeChange}
                        max={formatPositionNumber(data?.availPosition)}
                      />
                      <Slider
                        min={1}
                        max={100}
                        onChange={(rate: number) => {
                          const value = optionFormat((rate / 100) * data.availPosition, getAvgPrice());
                          onChangeVolume(value, null, rate, 'partialPositionStop');
                        }}
                        value={store.stopVolumePercent}
                        marks={marks}
                        type="stopLossRoe"
                      />
                      <div className={clsx('tips')}>
                        <p>
                          <span className={clsx('title')}> {LANG('可止损量')} </span>
                          {formatPositionNumber(data?.availPosition)} {volumeUnit}
                        </p>
                        {/* <NewCloseTips
                          {...{
                            isLimit,
                            price,
                            triggerPrice: store.stopTriggerPrice,
                            triggerPriceType: store.stopLossLimitType,
                            isUsdtType,
                            data,
                            settleCoin,
                            incomeStandard: incomeStandard3,
                            availPosition: store.stopVolume,
                            isCloseType: false
                          }}
                        /> */}
                      </div>
                    </div>
                  )}
                </div>
              </Mobile>
              <DesktopOrTablet>
                <div className={clsx('liquidation-pannel')}>
                  <div className={clsx('liquidation-label')}>{LANG('止盈')}</div>
                  <div className={clsx('liquidation-form')}>
                    <InputPrice
                      digit={pricePrecision}
                      select
                      unit={priceUnitText}
                      placeholder={LANG('触发价格')}
                      value={triggerPrice}
                      data={data}
                      income={income}
                      incomeStandard={incomeStandard3}
                      onTypeChange={_onStopProfitLimitTypeChange}
                      type={store.stopProfitLimitType}
                      onChange={(v: any) => {
                        const newPrice =
                          store.stopProfitLimitType === 'flag'
                            ? Swap.Socket.getFlagPrice(code)
                            : Swap.Utils.getNewPrice(code);
                        const isStopProfit = data.positionSide === 'LONG'; // 做多并且止盈
                        const spred = isStopProfit ? v.sub(newPrice) : newPrice.sub(v);
                        const percent = v && spred ? spred.div(newPrice).mul(100).toFixed(2) : '';

                        store.triggerPrice = v;
                        setTriggerPriceRoe(percent);
                      }}
                    />

                    <InputRoe
                      placeholder={LANG('涨跌幅')}
                      value={store.triggerPriceRoe}
                      onChange={(val: number) =>
                        setRoe(val, 'stopProfit', 'triggerPriceRoe', store.stopProfitLimitType)
                      }
                      type="stopProfit"
                      positionSide={data.positionSide}
                      avgCostPrice={Swap.Utils.getNewPrice(code)}
                      inputPrice={triggerPrice}
                    />
                  </div>
                  <Slider
                    min={1}
                    max={100}
                    onChange={(val: number) => {
                      setRoe(val, 'stopProfit', 'triggerPriceRoe', store.stopProfitLimitType);
                    }}
                    value={store.triggerPriceRoe}
                    marks={marks}
                    type="stopProfit"
                  />
                  <div className={clsx('liquidation-form')}>
                    <InputPrice
                      digit={pricePrecision}
                      // select
                      showSuffix={false}
                      placeholder={!isLimit ? LANG('市价') : LANG('请输入价格')}
                      unit={volumeUnit}
                      disabled={!isLimit}
                      value={!isLimit ? '' : price ? price : ''}
                      data={data}
                      income={stopProfitIncome}
                      onTypeChange={_onStopProfitLimitTypeChange}
                      type={store.stopProfitLimitType}
                      onChange={(v: any) => onChangePrice(v)}
                      className={clsx(!isLimit ? 'market-price-input' : '')}
                    />
                    <SwitchPrice
                      type={!isLimit ? TYPES.NEWS_PRICE : TYPES.FLAG_PRICE}
                      options={[LANG('市价'), LANG('限价')]}
                      onChange={(v: any) => {
                        store.isLimit = v === TYPES.FLAG_PRICE;
                      }}
                    />
                  </div>
                  <InputPrice
                    placeholder={LANG('请输入数量')}
                    digit={volumeDigit}
                    select={false}
                    unit={volumeUnit}
                    value={volume}
                    data={data}
                    income={stopProfitIncome}
                    max={formatPositionNumber(data?.availPosition, volumeDigit, getAvgPrice())}
                    onChange={(v: any) => {
                      onChangeVolume(v, null);
                    }}
                  />
                  <Slider
                    min={0}
                    max={100}
                    onChange={(rate: number) => {
                      const value = optionFormat((rate / 100) * data.availPosition, volumeDigit, getAvgPrice(), true);
                      // const getUSD = Number(
                      //   new BigNumber(cryptoData.contractFactor).multipliedBy(Swap.Utils.getNewPrice(code)).toString()
                      // );
                      const getCoin = cryptoData.contractFactor;
                      const getMin = !isVolUnit ? getCoin : value;
                      // onChangeVolume(
                      //   Number(value) < Number(getMin) ? getMin : value,
                      //   null,
                      //   rate,
                      //   'partialPositionStop'
                      // );
                      onChangeVolume(value, null, rate);
                    }}
                    value={store.volumePercent}
                    marks={marks}
                    type="stopProfit"
                  />
                  <div className={clsx('tips')}>
                    <p>
                      <span className={clsx('title')}> {LANG('可止盈量')} </span>
                      {formatPositionNumber(data?.availPosition, volumeDigit, getAvgPrice())} {volumeUnit}
                    </p>
                    <NewCloseTips
                      {...{
                        isLimit,
                        price,
                        triggerPrice,
                        triggerPriceType: store.stopProfitLimitType,
                        isUsdtType,
                        data,
                        settleCoin,
                        incomeStandard: incomeStandard3,
                        availPosition: volume,
                        isCloseType: false
                      }}
                    />
                  </div>
                </div>
                <div className={clsx('liquidation-pannel')}>
                  <div className={clsx('liquidation-label')}>{LANG('止损')}</div>
                  <div className={clsx('liquidation-form')}>
                    <InputPrice
                      digit={pricePrecision}
                      select
                      placeholder={LANG('触发价格')}
                      income={income}
                      incomeStandard={incomeStandard3}
                      unit={priceUnitText}
                      value={store.stopTriggerPrice}
                      onChange={(v: any) => {
                        const newPrice =
                          store.stopLossLimitType === 'flag'
                            ? Swap.Socket.getFlagPrice(code)
                            : Swap.Utils.getNewPrice(code);
                        const isStopProfit = data.positionSide === 'LONG'; // 做多并且止盈
                        const spred = isStopProfit ? v.sub(newPrice) : newPrice.sub(v);
                        const percent = v && spred ? spred.div(newPrice).mul(100).toFixed(2) : '';
                        store.stopTriggerPrice = v;
                        setStopTriggerPriceRoe(percent);
                      }}
                      data={data}
                      type={store.stopLossLimitType}
                      onTypeChange={_onStopLossLimitTypeChange}
                    />
                    <InputRoe
                      placeholder={LANG('涨跌幅')}
                      onChange={(val: number) => {
                        setRoe(val, 'stopLoss', 'stopTriggerPriceRoe', store.stopLossLimitType);
                      }}
                      value={store.stopTriggerPriceRoe}
                      type="stopLoss"
                      positionSide={data.positionSide}
                      avgCostPrice={Swap.Utils.getNewPrice(code)}
                      inputPrice={stopLoss}
                    />
                  </div>
                  <Slider
                    min={1}
                    max={100}
                    onChange={(val: number) => {
                      setRoe(val, 'stopLoss', 'stopTriggerPriceRoe', store.stopLossLimitType);
                    }}
                    value={store.stopTriggerPriceRoe}
                    marks={marks}
                    type="stopLoss"
                  />
                  <div className={clsx('liquidation-form')}>
                    <InputPrice
                      digit={pricePrecision}
                      showSuffix={false}
                      // select
                      placeholder={!store.stopIsLimit ? LANG('市价') : LANG('请输入价格')}
                      unit={priceUnitText}
                      disabled={!store.stopIsLimit}
                      value={!store.stopIsLimit ? '' : stopLossLimitPrice ? stopLossLimitPrice : ''}
                      onChange={(v: any) => setstopLossLimitPrice(v)}
                      data={data}
                      income={stopLossIncome}
                      onTypeChange={_onStopLossLimitTypeChange}
                      type={store.stopLossLimitType}
                      className={clsx(!store.stopIsLimit ? 'market-price-input' : '')}
                    />
                    <SwitchPrice
                      type={!store.stopIsLimit ? TYPES.NEWS_PRICE : TYPES.FLAG_PRICE}
                      options={[LANG('市价'), LANG('限价')]}
                      onChange={(v: any) => {
                        store.stopIsLimit = v === TYPES.FLAG_PRICE;
                      }}
                    />
                  </div>
                  <InputPrice
                    placeholder={LANG('请输入数量')}
                    digit={volumeDigit}
                    select={false}
                    unit={volumeUnit}
                    value={store.stopVolume}
                    onChange={(v: any) => {
                      onChangeVolume(v, null, undefined, 'partialPositionStop');
                    }}
                    data={data}
                    income={stopLossIncome}
                    onTypeChange={_onStopLossTypeChange}
                    max={formatPositionNumber(data?.availPosition, volumeDigit, getAvgPrice())}
                  />
                  <Slider
                    min={0}
                    max={100}
                    onChange={(rate: number) => {
                      const value = optionFormat((rate / 100) * data.availPosition, volumeDigit, getAvgPrice(), true);
                      // const getUSD = Number(
                      //   new BigNumber(cryptoData.contractFactor).multipliedBy(Swap.Utils.getNewPrice(code)).toString()
                      // );
                      const getCoin = cryptoData.contractFactor;
                      const getMin = !isVolUnit ? getCoin : value;
                      onChangeVolume(value, null, rate, 'partialPositionStop');
                    }}
                    value={store.stopVolumePercent}
                    marks={marks}
                    type="stopLossRoe"
                  />
                  <div className={clsx('tips')}>
                    <p>
                      <span className={clsx('title')}> {LANG('可止损量')} </span>
                      {formatPositionNumber(data?.availPosition, volumeDigit, getAvgPrice())} {volumeUnit}
                    </p>
                    <NewCloseTips
                      {...{
                        isLimit: store.stopIsLimit,
                        price: stopLossLimitPrice,
                        triggerPrice: store.stopTriggerPrice,
                        triggerPriceType: store.stopLossLimitType,
                        isUsdtType,
                        data,
                        settleCoin,
                        incomeStandard: incomeStandard3,
                        availPosition: store.stopVolume,
                        isCloseType: false
                      }}
                    />
                  </div>
                </div>
              </DesktopOrTablet>
            </div>
          ) : (
            <div className={clsx('liquidation-action')}>
              <div className={clsx('liquidation-pannel')}>
                <div className={clsx('liquidation-label')}>{LANG('止盈')}</div>
                <div className={clsx('liquidation-form')}>
                  <InputPrice
                    digit={pricePrecision}
                    placeholder={LANG('触发价格')}
                    type={stopProfitType}
                    select={true}
                    unit={priceUnitText}
                    value={stopProfit}
                    data={data}
                    income={stopProfitIncome}
                    onTypeChange={_onStopProfitTypeChange}
                    onChange={(v: any) => {
                      const newPrice =
                        stopProfitType === 'flag' ? Swap.Socket.getFlagPrice(code) : Swap.Utils.getNewPrice(code);
                      const spred = data.positionSide === 'SHORT' ? newPrice.sub(v) : v.sub(newPrice);
                      const percent = v && spred ? spred.div(newPrice).mul(100).toFixed(2) : '';
                      store.stopProfit = v;
                      setStopProfitRoe(percent);
                    }}
                  />
                  <InputRoe
                    placeholder={LANG('涨跌幅')}
                    value={store.stopProfitRoe}
                    onChange={(val: number) => setRoe(val, 'stopProfit', 'stopProfit', stopProfitType)}
                    type="stopProfit"
                    inputPrice={stopProfit}
                    avgCostPrice={Swap.Utils.getNewPrice(code)}
                    positionSide={data.positionSide}
                  />
                  {/* <NewCloseTips
                    {...{
                      isLimit,
                      price,
                      triggerPrice: stopProfit,
                      triggerPriceType: stopProfitType,
                      isUsdtType,
                      data,
                      settleCoin,
                      incomeStandard: incomeStandard3,
                      availPosition: data.availPosition,
                      isCloseType: true,
                    }}
                  /> */}
                </div>
                <Slider
                  min={1}
                  max={100}
                  onChange={(val: number) => {
                    setRoe(val, 'stopProfit', 'stopProfit', stopProfitType);
                  }}
                  value={store.stopProfitRoe}
                  marks={marks}
                  type="stopProfit"
                />
                <DesktopOrTablet>
                  {stopProfit ? (
                    <NewCloseTips
                      {...{
                        isLimit: false,
                        price,
                        triggerPrice: stopProfit,
                        triggerPriceType: stopProfitType,
                        isUsdtType,
                        data,
                        settleCoin,
                        incomeStandard: incomeStandard3,
                        availPosition: data.availPosition,
                        isCloseType: true
                      }}
                    />
                  ) : null}
                </DesktopOrTablet>
              </div>
              <div className={clsx('liquidation-pannel')}>
                <div className={clsx('liquidation-label')}>{LANG('止损')}</div>
                <div className={clsx('liquidation-form')}>
                  <InputPrice
                    digit={pricePrecision}
                    placeholder={LANG('触发价格')}
                    type={stopLossType}
                    select={true}
                    unit={priceUnitText}
                    value={stopLoss}
                    onChange={(v: any) => {
                      const newPrice =
                        stopLossType === 'flag' ? Swap.Socket.getFlagPrice(code) : Swap.Utils.getNewPrice(code);
                      const spred = data.positionSide === 'SHORT' ? newPrice.sub(v) : v.sub(newPrice);
                      const percent = v && spred ? spred.div(newPrice).mul(100).toFixed(2) : '';
                      store.stopLoss = v;
                      setStopLossRoe(percent);
                    }}
                    data={data}
                    income={stopLossIncome}
                    onTypeChange={_onStopLossTypeChange}
                  />
                  <InputRoe
                    placeholder={LANG('涨跌幅')}
                    onChange={(val: number) => {
                      setRoe(val, 'stopLoss', 'stopLoss', stopLossType);
                    }}
                    value={store.stopLossRoe}
                    type="stopLoss"
                    inputPrice={stopLoss}
                    positionSide={data.positionSide}
                    avgCostPrice={Swap.Utils.getNewPrice(code)}
                  />
                  {/* <NewCloseTips
                    {...{
                      isLimit,
                      price,
                      triggerPrice: stopLoss,
                      triggerPriceType: stopLossType,
                      isUsdtType,
                      data,
                      settleCoin,
                      incomeStandard: incomeStandard3,
                      availPosition: data.availPosition,
                      isCloseType: true,
                    }}
                  /> */}
                </div>
                <Slider
                  min={1}
                  max={100}
                  onChange={(val: number) => {
                    setRoe(val, 'stopLoss', 'stopLoss', stopLossType);
                  }}
                  value={store.stopLossRoe}
                  marks={marks}
                  type="stopLossRoe"
                />
                <DesktopOrTablet>
                  {stopLoss ? (
                    <NewCloseTips
                      {...{
                        isLimit: false,
                        price,
                        triggerPrice: stopLoss,
                        triggerPriceType: stopLossType,
                        isUsdtType,
                        data,
                        settleCoin,
                        incomeStandard: incomeStandard3,
                        availPosition: data.availPosition,
                        isCloseType: true
                      }}
                    />
                  ) : null}
                </DesktopOrTablet>
              </div>
            </div>
          )}
        </div>
      </div>
      {styles}
    </>
  );

  const titleInfo = () => {
    AlertFunction({
      title: LANG('止盈止损生效范围'),
      content: (
        <>
          <div className="title">{LANG('全部仓位')}</div>
          <div>
            {LANG('仅允许设置一个应用于整个仓位的止盈止损委托。当价格达到止盈或止损触发价格时，将以市价全部平仓。')}
          </div>
          <div className="line" />
          <div className="title">{LANG('部分仓位')}</div>
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
      onOk: () => {},
      theme: theme,
      v3: true,
      zIndex: 10001
    });
  };
  if (isMobile) {
    return (
      <MobileModal visible={visible} onClose={onClose} type="bottom">
        <BottomModal
          onConfirm={_onConfirm}
          disabledConfirm={disabledConfirm}
          title={LANG('止盈止损')}
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
          title={LANG('止盈止损')}
          titleInfo={titleInfo}
          // titles={[LANG('止盈/止损'), LANG('仓位止盈止损')]}
          // index={tabIndex}
          // onChange={setTabIndex}
          onClose={handleClose}
        />
        {content}
        <ModalFooter onConfirm={_onConfirm} onCancel={onClose} disabledConfirm={disabledConfirm} />
      </Modal>
    </>
  );
};

export default StopProfitStopLossModal;
