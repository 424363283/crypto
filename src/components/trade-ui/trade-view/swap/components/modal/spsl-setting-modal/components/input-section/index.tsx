import { Svg } from '@/components/svg';
import { DropdownSelect } from '@/components/trade-ui/common/dropdown';
import Input from '@/components/trade-ui/trade-view/components/input';

import MinChangeInput from '@/components/trade-ui/trade-view/components/input/min-change-input';
import {
  showPriceOptionInfo,
  usePriceOptionOnChange,
  usePriceOptionTexts,
} from '@/components/trade-ui/trade-view/swap/utils';
import { useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { clsx, renderTextByKey } from '@/core/utils';
import { useRef, useState } from 'react';
import { formatIncomeStandard } from '../../utils';
import { SliderSingleProps } from 'antd';
import Slider from '@/components/Slider';

const InputSection = ({
  label,
  onEnableChange,
  price,
  roe,
  onRoeChange,
  onPriceChange,
  isBuy,
  priceType,
  onPriceTypeChange,
  placeholder,
  error,
  minChange,
  incomeLoss = false,
  incomeStandard,
  setIncomeStandard,
  incomeLossNegative,
  data,
  displayPriceInfo,
}: {
  label: string;
  onEnableChange: Function;
  price: any;
  roe: any;
  onRoeChange: Function;
  onPriceChange: Function;
  isBuy: boolean;
  priceType: any;
  onPriceTypeChange: Function;
  placeholder: string;
  error: any;
  minChange: boolean;
  incomeLoss?: boolean;
  incomeStandard: number;
  setIncomeStandard: Function;
  incomeLossNegative?: boolean;
  data: any;
  displayPriceInfo?: boolean;
}) => {
  const ref = useRef<any>();
  const [_value, _setValue] = useState(price);
  const [_roe, _setRoe] = useState(roe);
  const { isDark } = useTheme();
  const { quoteId, priceUnitText, isUsdtType } = Swap.Trade.base;
  const { minChangePrice, baseShowPrecision, settleCoin, priceOrderPrecision } = Swap.Info.getCryptoData(quoteId);
  const { incomeStandardRoe, incomeStandardIncome } = formatIncomeStandard(incomeStandard);
  const marks: SliderSingleProps['marks'] = {
    0: '0%',
    50: '50%',
    100: '100%',
    150: '150%',
    200: '200%'
  };
  const [percent, setPercent] = useState(0);
  const _getIncome = () => {
    let income: any = '0';

    if (Number(price) > 0) {
      income = Swap.Trade.getCalculateIncome({
        isBuy: isBuy,
        flagPrice: Number(price),
      });
    }

    return income;
  };

  const onChange = usePriceOptionOnChange({
    incomeLoss,
    incomeLossNegative,
    incomeStandard,
    setValue: _setValue,
    data,
    priceType,
    onPriceChange,
  });
  // const onRoeChange = usePriceOptionOnChange({
  //   incomeLoss,
  //   incomeLossNegative,
  //   incomeStandard,
  //   setValue: _setRoe,
  //   data,
  //   priceType,
  //   onPriceChange,
  // });
  const { incomeStandardOpts, placeholderOpts } = usePriceOptionTexts({ placeholder });
  const income = incomeStandardIncome ? _value : _getIncome();

  const onIncomeStandardChange = (i: number) => {
    setIncomeStandard(i);
    onChange('');
  };

  let digit = Number(baseShowPrecision || 0);
  if (incomeStandardIncome) {
    digit = Number(data.basePrecision);
  } else if (incomeStandardRoe) {
    digit = 2;
  }
  const allowClearInput = String(_value).length > 0;
  const _onClearInput = () => {
    if (!allowClearInput) {
      return;
    }
    onChange('');
  };
  return (
    <>
      <div className={clsx('input-section2 hidden')}>
        <span className={clsx('label')}>{label}</span>
        <div className={clsx('trigger')}>
          <Input
            inputRef={ref}
            // controller
            className={clsx('input price')}
            focusActive
            enableMinChange={minChange}
            inputComponent={MinChangeInput}
            placeholder={placeholder}
            value={_value}
            onChange={onChange}
            digit={digit}
            minChangePrice={Number(minChangePrice || 0)}
            step={Number(minChangePrice || 1)}
            suffix={() => (
              <DropdownSelect
                data={[LANG('标记'), LANG('最新')]}
                onChange={(item, i) => {
                  onPriceTypeChange(i)
                }}
                isActive={(v, i) => i === priceType}
                formatOptionLabel={(v) => v}
                value={priceType === Swap.Trade.PRICE_TYPE.FLAG ? 0 : 1}
              >
              </DropdownSelect>
            )}
            isNegative={incomeLossNegative}
          />
          <Input
            inputRef={ref}
            // controller
            className={clsx('input profit')}
            focusActive
            enableMinChange={minChange}
            inputComponent={MinChangeInput}
            placeholder={placeholderOpts[incomeStandard ?? 0]}
            value={_roe}
            onChange={onChange}
            digit={digit}
            minChangePrice={Number(minChangePrice || 0)}
            step={Number(minChangePrice || 1)}
            suffix={() => (
              <div className={clsx('suffix')} onClick={() => ref.current?.focus()}>
                {!incomeStandardRoe ? (incomeStandardIncome ? settleCoin : priceUnitText || 'USD') : '%'}
              </div>
            )}
            isNegative={incomeLossNegative}
          />
        </div>
        <Slider marks={marks} step={5} value={percent} min={0} max={200} onChange={(value: any) => {
          setPercent(value);
          console.log(value);
        }} />
        <div className={clsx('order')}>
          <div className={clsx('price')}>
            <span>委托价格</span>
          </div>
          <div className={clsx('type')}>
            <span>限价</span>
          </div>
        </div>
        {error && <div className={'error'}>{error}</div>}
        {!error && (
          <div className={'info'}>
            {renderTextByKey(
              // LANG('当{pricetype}触达{price}时，将会触发{type}委托，预期盈亏将会是{value}'),
              incomeLoss
                ? LANG('当{type}达到{price}时，将会触发市价止盈委托平仓当前仓位。预计盈利为{income}是 (收益率为{rate})')
                : LANG(
                  '当{type}达到{price}时，将会触发市价止损委托平仓当前仓位。预计盈利为{income}是 (收益率为{rate})'
                ),
              ['{price}', '{type}', '{income}', '{rate}'],
              (key, matched) => {
                switch (key) {
                  case '{type}':
                    return (
                      <span>{priceType === Swap.Trade.PRICE_TYPE.FLAG ? LANG('标记价格') : LANG('最新价格')}</span>
                    );
                  case '{price}':
                    return <span className={'value'}>{`${price}`.length === 0 ? '--' : price}</span>;
                  // case '{type}':
                  //   return <span className={'value'}>{LANG('市价单')}</span>;
                  case '{income}':
                    return (
                      <span className={clsx(Number(income) >= 0 ? 'main-raise' : 'main-fall')}>
                        {`${income}`.toFixed(Number(data.basePrecision))} {settleCoin}
                      </span>
                    );
                  case '{rate}':
                    return (
                      <span className={clsx(Number(income) >= 0 ? 'main-raise' : 'main-fall')}>
                        {(incomeStandardRoe
                          ? _value
                          : Swap.Calculate.positionROE({
                            usdt: isUsdtType,
                            data: data,
                            income: income,
                          })
                        ).toFixed(2)}
                        %
                      </span>
                    );
                }
                return <span>{key}</span>;
              }
            )}
          </div>
        )}
      </div>
      <div className={clsx('input-section', !isDark && 'light')}>
        {/* <div className={'label'}>
          <CheckboxV2
            className={clsx('checkbox', enable && 'active')}
            checked={enable}
            onClick={() => onEnableChange(!enable)}
          />
          {label}
        </div> */}
        <div className={clsx('input-row')}>
          <div>
            <div className={clsx('label')}>
              { 
              // <DropdownSelect
              //   data={incomeStandardOpts}
              //   onChange={(item, i) => onIncomeStandardChange(i)}
              //   isActive={(v, i) => i === incomeStandard}
              //   formatOptionLabel={(v) => v}
              //   align={{ offset: [20, 0] }}
              // >
              //   <div>
              //     {label}-{incomeStandardOpts[incomeStandard]}
              //     <Svg src='/static/images/common/arrow_down.svg' width={12} height={12} className={'arrow'} />
              //   </div>
              // </DropdownSelect>
              }
              {
              // displayPriceInfo && (
              //   <div className={clsx('icon')} onClick={showPriceOptionInfo}>
              //     <Svg src='/static/images/swap/tips_info.svg' height={12} width={12} />
              //   </div>
              // )
              }
            </div>
            <Input
              inputRef={ref}
              // controller
              className={clsx('input')}
              focusActive
              enableMinChange={minChange}
              inputComponent={MinChangeInput}
              placeholder={placeholderOpts[incomeStandard ?? 0]}
              value={_value}
              onChange={onChange}
              digit={digit}
              minChangePrice={Number(minChangePrice || 0)}
              step={Number(minChangePrice || 1)}
              // suffix={() => (
              //   <div className={clsx('suffix')} onClick={() => ref.current?.focus()}>
              //     {!incomeStandardRoe ? (incomeStandardIncome ? settleCoin : priceUnitText || 'USD') : '%'}
              //   </div>
              // )}
              isNegative={incomeLossNegative}
            />
          </div>
          <div>
            { 
            // <div className={clsx('cancel', allowClearInput && 'active')} onClick={_onClearInput}>
            //   {LANG('取消')}
            // </div> 
            }
            <DropdownSelect
              data={[LANG('标记价格'), LANG('最新价格')]}
              onChange={(item, i) => onPriceTypeChange(i)}
              isActive={(v, i) => i === priceType}
              formatOptionLabel={(v) => v}
            >
              <div className={clsx('select')}>
                {priceType === Swap.Trade.PRICE_TYPE.FLAG ? LANG('标记价格') : LANG('最新价格')}
                <Svg src='/static/images/common/arrow_down.svg' width={12} height={12} className={'arrow'} />
              </div>
            </DropdownSelect>
          </div>
        </div>
        {error && <div className={'error'}>{error}</div>}
        {!error && (
          <div className={'info hidden'}>
            {renderTextByKey(
              // LANG('当{pricetype}触达{price}时，将会触发{type}委托，预期盈亏将会是{value}'),
              incomeLoss
                ? LANG('当{type}达到{price}时，将会触发市价止盈委托平仓当前仓位。预计盈利为{income}是 (收益率为{rate})')
                : LANG(
                  '当{type}达到{price}时，将会触发市价止损委托平仓当前仓位。预计盈利为{income}是 (收益率为{rate})'
                ),
              ['{price}', '{type}', '{income}', '{rate}'],
              (key, matched) => {
                switch (key) {
                  case '{type}':
                    return (
                      <span>{priceType === Swap.Trade.PRICE_TYPE.FLAG ? LANG('标记价格') : LANG('最新价格')}</span>
                    );
                  case '{price}':
                    return <span className={'value'}>{`${price}`.length === 0 ? '--' : price}</span>;
                  // case '{type}':
                  //   return <span className={'value'}>{LANG('市价单')}</span>;
                  case '{income}':
                    return (
                      <span className={clsx(Number(income) >= 0 ? 'main-raise' : 'main-fall')}>
                        {`${income}`.toFixed(Number(data.basePrecision))} {settleCoin}
                      </span>
                    );
                  case '{rate}':
                    return (
                      <span className={clsx(Number(income) >= 0 ? 'main-raise' : 'main-fall')}>
                        {(incomeStandardRoe
                          ? _value
                          : Swap.Calculate.positionROE({
                            usdt: isUsdtType,
                            data: data,
                            income: income,
                          })
                        ).toFixed(2)}
                        %
                      </span>
                    );
                }
                return <span>{key}</span>;
              }
            )}
          </div>
        )}
      </div>
      <style jsx>
        {`
          .input-section2 {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
            flex: 1 0 0;
            .label {
              color: var(--text_3);
              font-size: 14px;
              font-weight: 500;
            }
            .trigger {
              display: flex;
              align-items: flex-start;
              gap: 8px;
              align-self: stretch;
              :global(.price) {
                display: flex;
                height: 40px;
                flex: 1 auto;

              }
              :global(.profit) {
                display: flex;
                min-width: 120px;
                height: 40px;

              }
            }
            :global(.slider) {
              :global(.ant-slider-horizontal.ant-slider-with-marks) {
                margin: 5px 5px 20px;
              }
            }
            .order {
              display: flex;
              align-items: flex-start;
              gap: 8px;
              align-self: stretch;
              .price {
                display: flex;
                height: 40px;
                padding: 0px 16px;
                justify-content: space-between;
                align-items: center;
                flex: 1 0 0;
                border-radius: 8px;
                background: var(--fill_3);
              }
              .type {
                display: flex;
                width: 120px;
                height: 40px;
                padding: 0px 16px;
                align-items: center;
                gap: 8px;
                border-radius: 8px;
                background: var(--fill_3);
              }
            }
          }
          .input-section {
            margin-top: 10px;
            margin-bottom: 15px;
            .label {
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: space-between;
              font-size: 12px;
              font-weight: 400;
              color: var(--theme-trade-text-color-1);

              > div {
                cursor: pointer;
                display: flex;
                flex-direction: row;
                padding-bottom: 10px;
                align-items: center;
              }
              > :global(*):first-child {
                margin-right: 5px;
              }
              :global(.checkbox) {
                margin-top: -1px;
                margin-right: 10px;
                &.active {
                  border: none;
                }
              }
              :global(.arrow) {
                padding-left: 5px;
              }
              .icon {
                width: 20px;
                display: flex;
                justify-content: flex-end;
              }
            }
            .cancel {
              color: var(--theme-trade-text-color-2);
              font-size: 12px;
              font-weight: 400;
              padding-bottom: 8px;
              &.active {
                color: var(--theme-font-color-small-yellow);
                cursor: pointer;
              }
            }
            :global(.suffix) {
              font-size: 14px;
              font-weight: 500;
              color: var(--theme-trade-text-color-3);
            }
            .input-row {
              display: flex;
              :global(> *:first-child) {
                flex: 1;
                margin-right: 9px;
              }
              :global(> *:last-child) {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                min-width: 124px;
              }
              :global(.input) {
                margin-top: 0;
                margin-bottom: 15px;
                height: 40px;
                background: var(--fill_3);
                border-radius: 5px;

                :global(input) {
                  text-indent: 0;
                }
              }
              .select {
                width: 100%;
                position: relative;
                cursor: pointer;
                display: flex;
                align-items: center;
                padding-left: 15px;
                border-radius: 5px;
                height: 40px;
                background: var(--fill_3);
                color: var(--text_1);
                :global(.arrow) {
                  position: absolute;
                  right: 10px;
                  margin-bottom: 1px;
                }
              }
            }
            .info {
              font-size: 13px;
              font-weight: 400;
              color: var(--theme-trade-text-color-2);
              :global(.price-type) {
                cursor: pointer;
                display: inline-block;
                color: var(--theme-primary-color);
                &::after {
                  margin: 0 1px;
                  position: relative;
                  top: 2px;
                  content: '';
                  display: inline-block;
                  border-left: 3px solid transparent;
                  border-right: 3px solid transparent;
                  border-top: 4px solid var(--theme-primary-color);
                  border-bottom: 4px solid transparent;
                }
              }
              .value {
                color: var(--theme-trade-text-color-1);
              }
            }
            .error {
              font-size: 13px;
              font-weight: 400;
              color: var(--text_red);
            }
          }
        `}
      </style>
    </>
  );
};

export default InputSection;
