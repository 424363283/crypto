import { useEffect, useMemo, useRef } from 'react';

import { resso } from '@/core/store';
import { useFunction, usePlaceholder } from './hooks';

/**
 * @prop {string} type                输入类型  text | number
 * @prop {Ref} inputRef               input的ref
 * @prop {string} placeholder
 * @prop {boolean} disabled           禁用
 * @prop {number} step
 * @prop {number} min
 * @prop {number} max
 * @prop {number} digit               小数位数
 * @prop {boolean} isNegative         是否可能负数
 * @prop {Element} renderPlaceholder
 * @prop {string} blankDisplayValue   空白字符显示值 默认显示最小值
 * @state {boolean} showPlaceholder   控制是否显示placeholder
 * @state {boolean} isFocus           input聚焦状态
 * @state {string} stateValue         input value
 */
export const DecimalInput = (rootProps: {
  step?: any;
  digit?: any;
  value?: any;
  className?: any;
  type?: any;
  placeholder?: any;
  disabled?: any;
  inputRef?: any;
  onChange?: any;
  onBlur?: (event: any, origin: () => {}) => any;
  onFocus?: any;
  renderPlaceholder?: any;
  rootOnBlur?: any;
  rootOnFocus?: any;
  blankDisplayValue?: any;
  min?: any;
  max?: any;
  isNegative?: boolean;
  inputMode?: string;
  myInputRef?: any;
  onKeyDown?: any;
}) => {
  const {
    step = 1,
    digit = 0,
    value,
    type,
    placeholder,
    disabled,
    inputRef,
    onChange,
    onBlur,
    onFocus,
    renderPlaceholder,
    rootOnBlur,
    rootOnFocus,
    blankDisplayValue,
    min,
    max,
    isNegative,
    inputMode,
    myInputRef,
    onKeyDown,
    ...props
  } = rootProps;
  const _ = useRef<any>({ prevState: {} }).current; // 维持变量

  const [state, setState] = useMemo(() => {
    const store = resso({
      isFocus: false,
      stateValue: value || '',
      showPlaceholder: ['', null, undefined].includes(value),
    });

    return [store, (func: (store: any) => any) => func(store)];
  }, []);
  const { isFocus, stateValue, showPlaceholder } = state;
  _.prevState = { isFocus, stateValue, showPlaceholder };
  const { checkShowPlaceholder } = usePlaceholder({ value, isFocus, setState });
  const { _onChange, _onBlur, _onFocus, _valueDisplay, handleMinus, handleAdd, handleClear, _onKeyDown } = useFunction({
    value,
    isFocus,
    onChange,
    digit,
    max,
    type,
    min,
    isNegative,
    setState,
    step,
    onBlur,
    rootOnBlur,
    blankDisplayValue,
    checkShowPlaceholder,
    rootOnFocus,
    onFocus,
    onKeyDown,
  });
  if (myInputRef) {
    myInputRef.current = { handleMinus, handleAdd, handleClear };
  }

  const numberType = type === 'number';
  const otherProps: any = {
    value: _valueDisplay(isFocus && numberType ? stateValue : value),
  };
  if (numberType) {
    otherProps.inputMode = 'decimal'; // 手机数字键盘
  }

  useEffect(() => {
    const nextProps = { value };
    const { isFocus } = _.prevState;
    let stateValue = _.prevState.stateValue;
    if (nextProps.value !== undefined && !isFocus) {
      stateValue = nextProps.value;
    }
    setState((draft) => {
      draft.stateValue = stateValue;
    });
  }, [value]);

  return (
    <>
      <input
        {...otherProps}
        ref={inputRef}
        placeholder={placeholder}
        type='text'
        autoComplete={numberType ? 'off' : ''}
        disabled={disabled}
        onChange={_onChange}
        onBlur={_onBlur}
        onKeyDown={_onKeyDown}
        onFocus={_onFocus}
        {...props}
      />
      {/* {showPlaceholder && renderPlaceholder} */}
    </>
  );
};
export default DecimalInput;
