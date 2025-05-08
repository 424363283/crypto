import { useMemo, useState, useEffect } from 'react';
import { Input, Select } from 'antd';
import YIcon from '@/components/YIcons';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import * as Utils from '../../utils';
import { clsx, styles } from './styled';
import { formatIncomeStandard } from '@/components/trade-ui/trade-view/swap/components/modal/spsl-setting-modal/utils';
import { getIsDigitNumber } from '@/components/numeric-input/components/common';
import { throttle } from 'lodash';
const { Option } = Select;
const TYPES = Utils.TYPES;

export const InputPrice = ({
  onChange,
  value,
  onComputerRoe,
  data,
  income,
  incomeStandard,
  onTypeChange,
  select = true,
  unit,
  type,
  digit,
  showSuffix = true,
  max = 99999999,
  ...props
}: any) => {
  const code = data?.symbol?.toUpperCase();
  const { incomeStandardIncome } = formatIncomeStandard(incomeStandard);
  const { settleCoin } = Swap.Info.getCryptoData(code);
  let addonAfter = null;
  if (showSuffix) {
    if (select) {
      addonAfter = (
        <Select
          popupClassName={clsx('custom-dropdown')}
          placement='bottomRight'
          popupMatchSelectWidth={false}
          suffixIcon={<YIcon.arrowDown className={clsx('editIcon')} />}
          value={type}
          onChange={val => onTypeChange(val)}
        >
          <Option value={TYPES.NEWS_PRICE}>{LANG('最新')}</Option>
          <Option value={TYPES.FLAG_PRICE}>{LANG('标记')}</Option>
        </Select>
      );
    } else {
      addonAfter = <div className={clsx('suffix')}>{incomeStandardIncome ? settleCoin : unit || 'USD'}</div>;
    }
  }

  const handleChange = (e: any) => {
    let value = e.target.value;
    // 当 digit 为 0 时，只允许输入整数
    const reg = digit === 0 ? /^\d*$/ : /^(\d+(\.\d{0,9})?)?$/;

    if (reg.test(value) || value === '') {
      // 处理多个0开头的情况
      if (/^0+$/.test(value)) {
        value = '0';
      } else if (/^0+[1-9]/.test(value)) {
        // 如果是0开头后面跟其他数字，去掉前面的0
        value = value.replace(/^0+/, '');
      }
    } else {
      value = value.slice(0, -1);
    }

    if (Number(value) > Number(max)) {
      value = max;
    }

    // 需要检测小数位数
    if (digit && Number(digit) > 0) {
      const isDigitNumber = getIsDigitNumber(digit);
      if (isDigitNumber(value)) {
        onChange?.(value);
      }
      return;
    }

    onChange(value);
  };

  const memoizedHandleChange = useMemo(
    () => (e: any) => {
      handleChange(e);
    },
    [max, digit, onChange]
  );

  return (
    <>
      <div className={clsx('liquidation-ipt')}>
        <Input addonAfter={addonAfter} value={value} onChange={memoizedHandleChange} {...props} />
      </div>
      {styles}
    </>
  );
};

export default InputPrice;
