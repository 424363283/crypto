import { isScientificNotation } from '@/core/utils';
import { useEffect, useRef } from 'react';
import { getIsDigitNumber } from '../common';

export const usePlaceholder = ({
  value: propsValue,
  isFocus,
  setState,
}: {
  value: any;
  isFocus: any;
  setState: any;
}) => {
  // 检查是否显示placeholder
  const checkShowPlaceholder = (event: any) => {
    let value;
    if (typeof event === 'string') {
      // 非事件检查
      value = event;
    } else {
      value = event.target.value || propsValue;
    }
    const showPlaceholder = ['', null, undefined].includes(value);
    setState((v: any) => {
      v.showPlaceholder = showPlaceholder;
    });
  };
  useEffect(() => {
    if (!isFocus && propsValue !== undefined) {
      checkShowPlaceholder(String(propsValue));
    }
  }, [isFocus, propsValue]);

  return { checkShowPlaceholder };
};

export const useFunction = ({
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
}: {
  value?: any;
  isFocus?: any;
  onChange?: any;
  digit?: any;
  max?: any;
  type?: any;
  min?: any;
  isNegative?: any;
  setState: any;
  step: any;
  onBlur?: any;
  onFocus?: any;
  rootOnBlur?: any;
  rootOnFocus?: any;
  blankDisplayValue?: any;
  checkShowPlaceholder?: any;
  onKeyDown?: any;
}) => {
  const _ = useRef<any>({});
  /**
   * @param {object} inputState
   *      @key {boolean} isBlur 是否是失去焦点时改变的值
   */
  const _changeValue = (value: string, inputState = {}) => {
    const change = (next: string) => {
      setState((v: any) => {
        v.stateValue = next;
        if (isFocus) {
          v.showPlaceholder = ['', null, undefined].includes(next);
        }

        const _inputState = { ...inputState, onChange: _onChange, onKeyDownKey: _.current.onKeyDownKey };

        if (next !== '') {
          const trueValue = Number((next + '').replace(/\D$/, ''));
          onChange?.(Number.isNaN(trueValue) ? min || 0 : trueValue, _inputState);
        } else {
          onChange?.('', _inputState);
        }
      });
    };
    const checkMax = (next: string) => {
      // 检测最大值
      if (max !== undefined && Number(next) > max) {
        change(max);
      } else {
        change(next);
      }
    };

    if (type === 'number') {
      value = (value + '').replace(/。/g, '.');
      if (value === '') {
        change('');
      } else if (_digitEnable()) {
        // 需要检测小数位数
        const isDigitNumber = getIsDigitNumber(digit, isNegative);
        //  小数位数超出则不修改值
        if (isDigitNumber(value)) {
          checkMax(value);
        }
      }
    } else {
      change(value);
    }
  };

  const _onChange = (event: any) => {
    const nextValue = typeof event === 'string' ? event : event.target.value;
    _changeValue(nextValue);
  };

  /* public */
  const handleMinus = () => _onMinus();

  /* public */
  const handleAdd = () => _onAdd();

  /* public */
  const handleClear = () => _changeValue('');

  const _onMinus = () => {
    let next: any = Number((value + '')?.replace(/\D$/, ''))
      .sub(step)
      .toFixed();
    next = _maxMinFormat(Number.isNaN(next) ? 0 : next);
    _changeValue(next);
  };

  const _onAdd = () => {
    let next: any = Number((value + '')?.replace(/\D$/, ''))
      .add(step)
      .toFixed();
    next = _maxMinFormat(Number.isNaN(next) ? 0 : next);
    _changeValue(next);
  };

  const _maxMinFormat = (v: string) => {
    return v > max && max !== undefined ? max : v < min && min !== undefined ? min : v;
  };

  const _onBlur = (event: any) => {
    const targetValue = event.target.value;
    let nextValue = targetValue;

    const change = (v: string) => _changeValue(v, { isBlur: true });

    const originLogic = () => {
      /* type === 'number' start */
      if (type === 'number') {
        if (nextValue === '') {
          change(blankDisplayValue === undefined ? min : blankDisplayValue);
        } else {
          nextValue = parseFloat(nextValue); // parseValue
          /* 如果是NaN，则清空          --- 值检测 */
          if (Number.isNaN(nextValue)) {
            nextValue = '';
            change(nextValue); /*《修改值》*/
          } else {
            const formatValue = _maxMinFormat(nextValue);

            /* 是否小于最小值           --- 值检测 */
            if (formatValue !== nextValue) {
              change(formatValue); /*《修改值》*/
            } else {
              /* 是否和原本的值 不一样    --- 值检测 */
              // if (targetValue + '' !== nextValue + '') {
              //   _setInputElementValue(event.target, nextValue); // 处理小数前面没有0的情况  eg: ".2112"
              // }
              nextValue = _digitFormat(nextValue); // 小数位格式化
              _setInputElementValue(event.target, nextValue); // 处理小数前面或后面没有数字的情况  eg: ".2112" "12."
              change(nextValue); /*《修改值》*/
            }
          }
        }
      }
    };
    rootOnBlur?.(event);
    /* 如果不传入onBlur 使用组件blur逻辑 */
    if (!onBlur) {
      originLogic();
      /* type === 'number' end */
    } else {
      onBlur(event, originLogic);
    }
    /* 固定 blur 逻辑 */
    checkShowPlaceholder(event);
    setState((v: any) => {
      v.isFocus = false;
    });
    // 处理numebr类型input，输入框有内容 但是target.value是'‘的情况，重新设置target.value
    if (type === 'number' && nextValue === '') {
      _setInputElementValue(event.target);
    }
  };

  const _onFocus = (event: any) => {
    rootOnFocus?.(event);
    if (!onFocus) {
      // 如果不传入onFocus 使用组件blur逻辑
    } else {
      onFocus(event);
    }
    /* 固定 focus 逻辑 */
    setState((v: any) => {
      v.isFocus = true;
    });
    // this.setState({
    //   isFocus: true,
    //   // showPlaceholder: false, // 聚焦隐藏placeholder
    // });
  };

  // 是否启用小数位数检测
  const _digitEnable = () => {
    return type === 'number' && typeof digit === 'number' && !Number.isNaN(digit);
  };
  const _digitFormat = (value: any) => {
    let formatValue = value;
    if (_digitEnable()) {
      formatValue = parseFloat(formatValue.toFixed(digit));
    }

    return formatValue;
  };
  // 设置input dom标签的值
  const _setInputElementValue = (target: any, value?: any) => {
    target.value = '';
  };
  const _valueDisplay = (value: any) => {
    let next = type === 'number' && isScientificNotation(value) ? Number(value)?.toFixed?.() : value;

    return isScientificNotation(next) ? 0 : next;
  };
  const _onKeyDown = (e: any) => {
    const key = e.key;

    _.current.onKeyDownKey = key;
    // // 删除
    // if (key === 'Backspace') {
    // }
    onKeyDown?.(e);
  };
  return {
    handleMinus,
    handleAdd,
    handleClear,
    _changeValue,
    _onChange,
    _onMinus,
    _onAdd,
    _maxMinFormat,
    _onBlur,
    _onFocus,
    _digitEnable,
    _digitFormat,
    _setInputElementValue,
    _valueDisplay,
    _onKeyDown,
  };
};
