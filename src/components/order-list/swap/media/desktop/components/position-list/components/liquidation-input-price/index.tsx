import { useState, useMemo, useEffect, useCallback } from 'react';
import { Popover } from 'antd';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { formatNumber2Ceil } from '@/core/utils';
import InputPrice from '@/components/trade-ui/order-list/swap/components/modal/stop-profit-stop-loss-modal/components/input-price';
import { SubButton } from '@/components/trade-ui/trade-view/components/button';
import { submitClosePosition } from '@/components/trade-ui/order-list/swap/components/modal/liquidation-modal/store';
import { clsx, styles } from './styled';
import Tooltip from '@/components/trade-ui/common/tooltip';
import { InfoHover } from '@/components/trade-ui/common/info-hover';
import Slider from '@/components/Slider';
import { message } from '@/core/utils';
import { getCryptoData } from '@/core/shared/src/swap/modules/calculate/utils';
import BigNumber from 'bignumber.js';
import { POSITION_TYPE } from '@/core/shared/src/constants/order';
// import { Slider } from 'antd';
import { WalletKey } from '@/core/shared/src/swap/modules/assets/constants';
import { useCopyTradingSwapStore } from '@/store/copytrading-swap';
import { UsingAccountType } from '@/core/shared/src/copy/types';
/** 数字转字符串 */
export const numberToString = (_num: string | number) => {
  let num = Number(_num);
  let numStr = String(_num);

  if (Math.abs(num) < 1) {
    const e = parseInt(num.toString().split('e-')[1]);

    if (e) {
      const negative = num < 0;
      if (negative) num *= -1;
      num *= Math.pow(10, e - 1);
      const temp = Number(num.toFixed(e));
      numStr = '0.' + new Array(e).join('0') + temp.toString().substring(2);

      if (negative) {
        numStr = '-' + numStr;
      }
    }
  } else {
    let e = parseInt(num.toString().split('+')[1]);

    if (e > 20) {
      e -= 20;
      num /= Math.pow(10, e);
      numStr = num.toString() + new Array(e + 1).join('0');
    }
  }
  return numStr;
};

/** 截取位数 */
export const cutFloatDecimal = (_value: any, dec: number) => {
  const value = _value || 0;
  const regStr = `^(-?[0-9]+.[0-9]{${dec}})[0-9]*$`;
  const _dec = dec >= 0 && dec <= 100 ? dec : 0;
  if (value.toString().indexOf('e-') >= 0) {
    const str = numberToString(value).replace(new RegExp(regStr), '$1');
    const parts = str.split('.');
    let float = parts[1];
    if (float.length < _dec) {
      float += new Array(_dec - float.length).fill(0).join('');
      return parts[0] + '.' + float;
    }
    return str;
  } else {
    const str = value.toString().replace(new RegExp(regStr), '$1');
    return Number(str).toFixed(_dec);
  }
};

const LiquidationInputPrice = ({ getFormData, item, isUsdtType, onReverse }: any) => {
  const isCopyTrader = useCopyTradingSwapStore.use.isCopyTrader();
  const [formData, setFormData] = useState({
    price: LANG('市价'),
    volume: item.currentPositionFormat,
    quantity: item.currentPositionFormat,
    isLimit: false
  });

  const [priceData, setPriceData] = useState({
    price: LANG('市价'),
    isLimit: false
  });

  const [quantityData, setQuantityData] = useState({
    volume: item.currentPositionFormat,
    quantity: item.currentPositionFormat
  });

  const [isShowMarketPrice, setIsShowMarketPrice] = useState(true);
  const getMarketPrice = useCallback(() => {
    return Swap.Socket.getFlagPrice(item.symbol, { withHooks: false });
  }, [item.symbol]);
  const isVolUnit = Swap.Info.getIsVolUnit(isUsdtType);
  const volumeUnit = Swap.Info.getUnitText({ symbol: item?.symbol });
  const { settleCoin, pricePrecision } = Swap.Info.getCryptoData(item.symbol, {
    withHooks: false
  });
  const scale = isUsdtType ? 2 : Number(item.basePrecision);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [stopProfitRoe, setStopProfitRoe] = useState(100);
  const typeList = [
    {
      label: '市价',
      value: '0'
    },
    {
      label: '限价',
      value: 'newsetPrice'
    }
  ];

  useEffect(() => {
    setFormData({
      ...formData,
      price: formData.isLimit ? (isShowMarketPrice ? Swap.Utils.getNewPrice(code) : formData.price) : LANG('市价'),
      volume: item.currentPositionFormat ? item.currentPositionFormat : ''
    });
  }, [formData.isLimit, isUsdtType, Swap.Socket.getFlagPrice(item.symbol, { withHooks: false })]);
  const code = item?.symbol?.toUpperCase();

  useEffect(() => {
    const digit = Swap.Info.getVolumeDigit(item.symbol, { withHooks: false });
    const currentPositionFormat = Number(
      Swap.Calculate.formatPositionNumber({
        usdt: isUsdtType,
        code: code,
        value: Number(item.currentPosition),
        fixed: isUsdtType ? digit : Number(Swap.Info.getCryptoData(item.symbol, { withHooks: false }).basePrecision),
        flagPrice: item.avgCostPrice
      })
    );
    changeQuantity(stopProfitRoe, currentPositionFormat);
  }, [isVolUnit, isUsdtType]);

  useEffect(() => {
    setPriceData(prev => ({
      ...prev,
      price: prev.isLimit ? (isShowMarketPrice ? Swap.Utils.getNewPrice(code) : prev.price) : LANG('市价')
    }));
    setQuantityData(prev => ({
      ...prev,
      volume: item.currentPositionFormat ? item.currentPositionFormat : ''
    }));
  }, [isUsdtType, code, item.currentPositionFormat, isShowMarketPrice]);

  const onPerSelect = (option: any) => {
    const newPrice = option.value === 'newsetPrice' ? Swap.Utils.getNewPrice(code) || 0 : LANG(option.label);
    const newPriceData = {
      ...priceData,
      price: newPrice,
      isLimit: option.value != 0
    };
    setPriceData(newPriceData);
    setIsShowMarketPrice(true);
    getFormData?.({ ...newPriceData, ...quantityData });
    setPopoverVisible(false);
  };

  const marks = {
    0: '0%',
    25: '25%',
    50: '50%',
    75: '75%',
    100: '100%'
  };

  let volumeDigit = Swap.Info.getVolumeDigit(code);
  const isMarginUnit = Swap.Info.getIsMarginUnit(isUsdtType);
  const balanceDigit = Swap.Assets.getBalanceDigit({ code: code });

  if (isMarginUnit) {
    volumeDigit = balanceDigit;
  }
  function roundUpToNearestHundred(value: number, multiple: any): number {
    return Math.ceil(value / multiple) * multiple;
  }
  function isPositiveInteger(value: number): boolean {
    return Number.isInteger(value) && value > 0;
  }
  function roundUpToPrecision(value: number, precision: number): number {
    const multiplier = Math.pow(10, precision);
    return Math.ceil(value * multiplier) / multiplier;
  }

  const changeQuantity = (val: any, currentPositionFormat?: any) => {
    let maxQuantity = currentPositionFormat || item.currentPositionFormat;
    let preciseQuantity = (val / 100) * maxQuantity;

    // let getUSD = Number(
    //   new BigNumber(getCryptoData(item.symbol.toUpperCase()).contractFactor)
    //     .multipliedBy(Swap.Utils.getNewPrice(code))
    //     .toString()
    // );
    const getCoin = getCryptoData(item.symbol.toUpperCase()).contractFactor;
    const getMin = Number(val <= 0) ? 0 : !isVolUnit ? getCoin : roundUpToPrecision(preciseQuantity, 3);

    // if (!isVolUnit) {
    //   preciseQuantity = isPositiveInteger(getCryptoData(item.symbol.toUpperCase()).contractFactor)
    //     ? roundUpToNearestHundred(preciseQuantity, getCoin)
    //     : preciseQuantity;
    // }
    const newQuantityData = {
      volume: roundUpToPrecision(preciseQuantity, volumeDigit),
      quantity: cutFloatDecimal(roundUpToPrecision(preciseQuantity, volumeDigit), volumeDigit)
    };

    setQuantityData(newQuantityData);
    getFormData?.({ ...priceData, ...newQuantityData });
  };

  const mode = Swap.Info.getUnitMode(isUsdtType);

  const content = (
    <div className={clsx('select-list')}>
      {typeList.map((item: any, index: number) => {
        return (
          <div key={index} onClick={() => onPerSelect(item)} className={clsx('select-item')}>
            {LANG(item.label)}
          </div>
        );
      })}
    </div>
  );
  const quantitycontent = (
    <div>
      <Slider
        min={0}
        max={100}
        onChange={(val: number) => {
          setStopProfitRoe(val);
          changeQuantity(val);
        }}
        value={stopProfitRoe}
        marks={marks}
      />
    </div>
  );
  let isLimit = true;
  const income = useMemo(() => {
    let value = quantityData.quantity;
    if (isUsdtType ? true : !isVolUnit) {
      value =
        mode !== 'coin' && quantityData.quantity < 1
          ? 0
          : priceData.price > 0
            ? Swap.Calculate.amountToVolume({
              usdt: isUsdtType,
              value: Number(quantityData.quantity),
              code: item.symbol,
              flagPrice: Number(priceData.price)
            })
            : 0;
    }
    const res = Swap.Calculate.income({
      usdt: isUsdtType,
      code: item.symbol,
      isBuy: item.side === '1',
      flagPrice: isLimit ? priceData.price : getMarketPrice(),
      avgCostPrice: Number(item.avgCostPrice),
      volume: value || 0
    });
    return formatNumber2Ceil(res, scale, false)?.toFixed(scale);
  }, [priceData.price, quantityData.quantity, item, isUsdtType, isLimit, getMarketPrice, isVolUnit, scale]);
  const value = Swap.Trade.twoWayMode;
  const handlePopoverClick = () => {
    setPopoverVisible(!popoverVisible);
  };

  return (
    <div className={clsx('button-actions', 'flex-end')}>
      <div className={clsx(`ipt-action ${formData.isLimit ? '' : 'limit-input'}`)}>
        <div className={clsx('ipt-form')}>
          <Popover
            overlayClassName={clsx('custom-popover')}
            placement="bottom"
            content={content}
            arrow={false}
            open={popoverVisible}
            onClick={handlePopoverClick}
            trigger="click"
            onVisibleChange={visible => setPopoverVisible(visible)}
          >
            <InputPrice
              digit={pricePrecision}
              value={priceData.price}
              showSuffix={false}
              placeholder={LANG('价格')}
              onChange={(val: any) => {
                const newPriceData = {
                  ...priceData,
                  price: val,
                  isLimit: true
                };
                setPriceData(newPriceData);
                getFormData?.({ ...newPriceData, ...quantityData });
                setIsShowMarketPrice(false);
              }}
            />
          </Popover>
        </div>
        <div className={clsx('ipt-form')}>
          <Popover
            overlayClassName={clsx('quantityCustom-popover')}
            placement="bottom"
            content={quantitycontent}
            arrow={false}
            trigger="click"
          >
            <InputPrice
              value={quantityData.quantity}
              showSuffix={true}
              select={false}
              placeholder={LANG('数量')}
              max={item.currentPositionFormat}
              unit={volumeUnit}
              digit={volumeDigit}
              onChange={(val: any) => {
                const newQuantityData = {
                  volume: val,
                  quantity: val
                };
                setQuantityData(newQuantityData);
                getFormData?.({ ...priceData, ...newQuantityData });
              }}
            />
          </Popover>
        </div>
      </div>
      {Number(income) != 0 ? (
        <div className={clsx('expected-return')}>
          <Tooltip
            title={LANG(
              '预计收益是根据委托价格估算的平仓收益,不包含手续费。平仓时产生的实际收益由实际成交价决定,可能与预计收益不一致。'
            )}
          >
            <InfoHover componnet={'span'} className={clsx()}>
              <span className={clsx('expected-return-label')}> {LANG('预计收益')} </span>
            </InfoHover>
          </Tooltip>
          <span className={clsx(Number(income) >= 0 ? 'main-green' : 'main-red')}>
            {income} {settleCoin}
          </span>
        </div>
      ) : null}
      <div className={clsx('button-group')}>
        <SubButton
          className="sub-button"
          onClick={() => {
            if (!priceData.price) {
              message.error(LANG('请输入价格'), 1);
              return;
            } else {
              submitClosePosition({
                isUsdtType,
                isLimit: priceData.isLimit,
                value: quantityData.quantity,
                data: {
                  ...item,
                  usingAccountType: item.subWallet === WalletKey.COPY ? (isCopyTrader ? UsingAccountType.trader : UsingAccountType.follower ): UsingAccountType.ordinary,
                },
                inputPrice: priceData.isLimit ? priceData.price : ''
              });
              setStopProfitRoe(0);
            }
          }}
        >
          {LANG('平仓')}
        </SubButton>
        <SubButton
          className="sub-button"
          onClick={() => {
            submitClosePosition({
              isUsdtType,
              isLimit: false,
              value: item.currentPositionFormat,
              data: {
                ...item,
                usingAccountType: item.subWallet === WalletKey.COPY ? (isCopyTrader ? UsingAccountType.trader : UsingAccountType.follower ): UsingAccountType.ordinary,
              },
              inputPrice: '',
             
            });
            setStopProfitRoe(0);
            setFormData({
              ...formData,
              volume: ''
            });
          }}
        >
          {LANG('市价全平')}
        </SubButton>
        {item.posType === POSITION_TYPE.ONE && (
          <SubButton className="sub-button" onClick={() => onReverse?.()}>
            {LANG('反手')}
          </SubButton>
        )}
      </div>
      {styles}
    </div>
  );
};

export default LiquidationInputPrice;
