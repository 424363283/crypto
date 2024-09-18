import { Svg } from '@/components/svg';
import { DropdownSelect } from '@/components/trade-ui/common/dropdown';
import Input from '@/components/trade-ui/trade-view/components/input';
import MinChangeInput from '@/components/trade-ui/trade-view/components/input/min-change-input';
import { formatIncomeStandard } from '@/components/trade-ui/trade-view/swap/components/modal/spsl-setting-modal/utils';
import {
  showPriceOptionInfo,
  usePriceOptionOnChange,
  usePriceOptionTexts,
} from '@/components/trade-ui/trade-view/swap/utils';
import { useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { useEffect, useRef, useState } from 'react';
import * as Utils from '../../utils';
import { clsx, styles } from './styled';
const TYPES = Utils.TYPES;

export const InputSection = ({
  label,
  selectLabel,
  value: price,
  onChange: onPriceChange,
  type,
  onTypeChange,
  disabled,
  disabledInput,
  options,
  placeholder,
  select = true,
  unit,
  tips,
  displayPriceInfo,
  incomeLoss = false,
  incomeStandard,
  setIncomeStandard,
  minChangeFormat,
  incomeLossNegative,
  data,
  income: propIncome,
  onClearInput,
  clearable = true,
  cancelEnable = false,
  onIncomeStandardTextChange,
  ...props
}: any) => {
  const code = data?.symbol?.toUpperCase();
  const isUsdtType = Swap.Info.getIsUsdtType(code);
  const { priceOrderPrecision, settleCoin } = Swap.Info.getCryptoData(code);
  const inputRef = useRef<any>({});
  let [_value, _setValue] = useState(price);
  const { isDark } = useTheme();
  const _disabledInput = disabledInput || disabled;
  const { incomeStandardRoe, incomeStandardIncome, haveIncomeStandard } = formatIncomeStandard(incomeStandard);
  const _minChangeFormat = (text: any) => {
    if (type === Swap.Trade.PRICE_TYPE.NEW) return minChangeFormat(text);
    return text;
  };
  _value = !incomeStandard ? price : _value;
  const priceOptionOnChange = usePriceOptionOnChange({
    incomeLoss,
    incomeLossNegative,
    incomeStandard,
    setValue: _setValue,
    data,
    priceType: type,
    onPriceChange,
  });
  const onChange = !incomeStandard ? onPriceChange : priceOptionOnChange;
  const { incomeStandardOpts, placeholderOpts } = usePriceOptionTexts({ placeholder });
  const income = incomeStandardIncome ? _value : propIncome;

  const onIncomeStandardChange = (i: number) => {
    setIncomeStandard(i);
    if (!i) {
      onPriceChange('');
    } else {
      priceOptionOnChange('');
    }
  };

  let digit = Number(data?.baseShowPrecision || 0);
  if (incomeStandardIncome) {
    digit = Number(data?.basePrecision);
  } else if (incomeStandardRoe) {
    digit = 2;
  }
  const allowClearInput = String(_value).length > 0;
  const _onClearInput = () => {
    if (!allowClearInput) {
      return;
    }
    if (onClearInput) {
      onClearInput();
    } else {
      onChange('');
    }
  };
  const negative = haveIncomeStandard && incomeLoss && (incomeStandardRoe || incomeStandardIncome);
  const roe = (
    incomeStandardRoe
      ? _value
      : Swap.Calculate.positionROE({
          usdt: isUsdtType,
          data: data,
          income: income,
        })
  ).toFixed(2);
  const incomeText = Number(income)?.toFixed(isUsdtType ? 2 : Number(data?.basePrecision));
  useEffect(() => {
    if (onIncomeStandardTextChange) {
      onIncomeStandardTextChange({
        _value,
      });
    }
  }, [_value]);
  const langIncomeStandardParams = {
    type: `<span class="text">${type === TYPES.NEWS_PRICE ? LANG('最新价格') : LANG('标记价格')}</span>`,
    price: `<span class="text">${price ? price : '--'}</span>`,
    income: `<span  class="${Number(income) >= 0 ? 'main-raise' : 'main-fall'}" >${incomeText} ${settleCoin}</span>`,
    rate: `<span class="${Number(income) >= 0 ? 'main-raise' : 'main-fall'}" >${roe}%</span>`,
  };
  return (
    <>
      <div className={clsx('input-section', !isDark && 'light', !tips && 'no-tips')}>
        <div className={clsx('wrapper', _disabledInput && 'disabled-input', disabled && 'disabled')}>
          <div className={clsx('input-row')}>
            <div>
              {label && (
                <div className={clsx('label')}>
                  {disabled || !haveIncomeStandard ? (
                    <div>{label}</div>
                  ) : (
                    <DropdownSelect
                      data={incomeStandardOpts}
                      onChange={(item, i) => onIncomeStandardChange(i)}
                      isActive={(v, i) => i === incomeStandard}
                      formatOptionLabel={(v) => v}
                      align={{ offset: [20, 0] }}
                    >
                      <div>
                        {label}-{incomeStandardOpts[incomeStandard]}
                        <Svg
                          src='/static/images/common/arrow_down.svg'
                          width={12}
                          height={12}
                          className={clsx('arrow')}
                        />
                      </div>
                    </DropdownSelect>
                  )}
                  {displayPriceInfo && (
                    <div className={clsx('icon')} onClick={showPriceOptionInfo}>
                      <Svg src='/static/images/swap/tips_info.svg' height={12} width={12} />
                    </div>
                  )}
                </div>
              )}
              <Input
                inputComponent={MinChangeInput}
                disabled={_disabledInput}
                className={clsx('input')}
                focusActive={!_disabledInput}
                type='number'
                placeholder={incomeStandard === undefined ? placeholder || label : placeholderOpts[incomeStandard ?? 0]}
                value={_value}
                onChange={onChange}
                // min={0}
                max={9999999999}
                digit={digit}
                blankDisplayValue=''
                suffix={() => (
                  <div className={clsx('suffix')} onClick={() => inputRef.current?.focus()}>
                    {!incomeStandardRoe ? (incomeStandardIncome ? settleCoin : unit || 'USD') : '%'}
                  </div>
                )}
                inputRef={inputRef}
                clearable={clearable}
                incomeLoss
                isNegative={negative}
                {...props}
              />
            </div>
            {select && (
              <div className={clsx('select-wrapper')}>
                <div className={clsx('select-labels')}>
                  <div className={clsx('label')}>{selectLabel}</div>
                  {cancelEnable ? (
                    <div className={clsx('cancel', allowClearInput && 'active')} onClick={_onClearInput}>
                      {LANG('取消')}
                    </div>
                  ) : (
                    <div />
                  )}
                </div>
                <TypeSelect disabled={disabled} value={type} onChange={onTypeChange} options={options} />
              </div>
            )}
          </div>
        </div>
        {((incomeStandard != undefined && tips != false) || tips) &&
          (tips ? (
            tips({ value: _value, income, className: clsx('tips') })
          ) : (
            <div
              className={clsx('tips')}
              dangerouslySetInnerHTML={{
                __html: incomeLoss
                  ? LANG(
                      '当{type}达到{price}时，将会触发市价止盈委托平仓当前仓位。预计盈利为{income}是 (收益率为{rate})',
                      langIncomeStandardParams
                    )
                  : LANG(
                      '当{type}达到{price}时，将会触发市价止损委托平仓当前仓位。预计盈利为{income}是 (收益率为{rate})',
                      langIncomeStandardParams
                    ),
              }}
            ></div>
          ))}
      </div>
      {styles}
    </>
  );
};

const TypeSelect = ({ value, onChange, disabled, options }: any) => {
  const opts = [
    [options?.[0] || LANG('最新价格'), TYPES.NEWS_PRICE],
    [options?.[1] || LANG('标记价格'), TYPES.FLAG_PRICE],
  ];
  const label = opts.find((v) => v[1] === value)?.[0];
  if (disabled) {
    return <div className={clsx('type-select', 'disabled')}>{label as string}</div>;
  }
  return (
    <DropdownSelect
      data={opts.map((v) => v[0])}
      onChange={(item, i) => {
        onChange(opts[i][1]);
      }}
      isActive={(v, i) => opts[i][1] === value}
      formatOptionLabel={(v) => v}
      align={{ offset: [0, -2] }}
    >
      <span className={clsx('type-select')}>
        {opts.find((v) => v[1] === value)?.[0]}
        <Svg src='/static/images/common/arrow_down.svg' width={12} height={12} className={clsx('arrow')} />
      </span>
    </DropdownSelect>
  );
};

export default InputSection;
