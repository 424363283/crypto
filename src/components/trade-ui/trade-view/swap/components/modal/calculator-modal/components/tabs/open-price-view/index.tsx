import { useState } from 'react';

import { PriceInput, VolumeInput } from '../../input';
import { Result, ResultLayout } from '../../result';
import { QuoteSelect } from '../../select';
import { TradeTypeBar } from '../../trade-type-bar';

import { LANG } from '@/core/i18n';
import { useStore } from '../../../store';

import { Svg } from '@/components/svg';
import { Swap } from '@/core/shared';
import { formatNumber2Ceil } from '@/core/utils';
import { useImmer } from 'use-immer';
import { clsx, styles } from './styled';

export const OpenPriceView = () => {
  const { quoteId, isUsdtType, cryptoData } = useStore();
  const [result, setResult] = useState({ openPrice: '--' });

  // inputs
  const [positionArr, setPositionArr] = useImmer(() => [getDefaultPosition()]);

  const priceUnit = isUsdtType ? 'USDT' : 'USD';
  const { baseShowPrecision } = cryptoData;

  const _resetInputs = () => {
    setPositionArr([getDefaultPosition()]);
  };
  // 增加
  const _addPosition = () => {
    let arr = [...positionArr];
    arr.push(getDefaultPosition());
    setPositionArr(arr);
  };

  // 删除
  const _delPosition = (index: number) => {
    let arr = [...positionArr];
    arr.splice(index, 1);
    setPositionArr(arr);
  };

  // 价格改变
  const _changePrice = (index: number, value: any) => {
    setPositionArr((draft) => {
      draft[index].price = value;
    });
  };

  // 数量改变
  const _changeVolume = (index: number, value: any) => {
    setPositionArr((draft) => {
      draft[index].volume = value;
    });
  };

  const _onSubmit = () => {
    const price = Swap.Calculate.openAveragePrice({
      usdt: isUsdtType,
      code: cryptoData?.id,
      data: positionArr.map((v: any) => ({
        ...v,
        cryptoNumber: v.volume,
        number: v.volume,
      })),
    });
    setResult({ openPrice: `${formatNumber2Ceil(price, baseShowPrecision)}` });
  };

  const results = [[`${LANG('开仓均价')}(${priceUnit})`, `${result.openPrice} ${priceUnit}`]];

  const disabled = !positionArr.length || positionArr.some((position) => !position.price || !position.volume);
  const baseSymbol = Swap.Trade.getBaseSymbol(quoteId);

  return (
    <>
      <ResultLayout disabled={disabled} onSubmit={_onSubmit}>
        <div>
          <QuoteSelect
            onChange={() => {
              _resetInputs();
            }}
          />
          <TradeTypeBar />
          {/* <LeverSlider maxAmount={maxAmount} value={lever} onChange={onLeverChange} max={maxLever} /> */}
          <div className={clsx('position-title')}>
            <div className={clsx()}>
              {LANG('开仓价格')}({priceUnit})
            </div>
            <div className={clsx()}>
              {LANG('成交数量')}({!isUsdtType ? LANG('张') : baseSymbol})
            </div>
            <div className={clsx()}>{LANG('操作')}</div>
          </div>
          <div className={clsx('list-view')}>
            {positionArr.map(({ price, volume, id }, index) => {
              return (
                <div className={clsx('position')} key={id}>
                  <PriceInput
                    className={clsx('input')}
                    onlyInput
                    value={price}
                    onChange={(v: any) => _changePrice(index, v)}
                    placeholder={
                      '0.' +
                      Array(baseShowPrecision)
                        .fill('')
                        .map((v) => '0')
                        .join('')
                    }
                  />
                  <VolumeInput
                    className={clsx('input')}
                    onlyInput
                    value={volume}
                    onChange={(v: any) => _changeVolume(index, v)}
                    placeholder={'0'}
                  />
                  <div className={clsx('delete')} onClick={() => _delPosition(index)}>
                    <Svg className={clsx()} src={'/static/images/trade/claculator/delete.svg'} width={16} height={16} />
                  </div>
                  <div className={clsx('border')}></div>
                </div>
              );
            })}
            <div className={clsx('add-button')}>
              <div className={clsx()} onClick={_addPosition}>
                +{LANG('增加仓位')}
              </div>
            </div>
          </div>
        </div>
        <Result results={results} />
      </ResultLayout>
      {styles}
    </>
  );
};

const getDefaultPosition = () => ({
  price: '',
  volume: '',
  id: new Date().getTime(),
});

export default OpenPriceView;
