import Tooltip from '@/components/trade-ui/common/tooltip';
import Radio from '@/components/Radio';
import { LANG } from '@/core/i18n';
import { Lite } from '@/core/shared';
import React, { ReactNode, useEffect, useState } from 'react';
import { InfoHover } from '@/components/trade-ui/common/info-hover';
import css from 'styled-jsx/css';

const Trade = Lite.Trade;

interface Props {
  style?: React.CSSProperties;
  checked: boolean;
  onChange: (val: boolean) => void;

}
const DeferCheckbox = ({ style, checked: initialChecked = false, onChange }: Props) => {
  const {
    name,
    deferDays,
    deferFee,
  } = Trade.state;
  const [checked, setChecked] = useState(initialChecked);
  const handleChange = (val?: boolean) => {
    const isChecked = !!val;
    setChecked(isChecked);
    if (onChange) {
      onChange(isChecked);
    }
  };

  useEffect(() => {
    setChecked(initialChecked);
  }, [initialChecked])

  return (
    <>
      <Radio
        size={14}
        label={
          <Tooltip placement='bottom' title={(
            <>
              <p>{LANG('简易合约存在交割日期，持仓会在每天5:55:00（UTC+8）自动平仓。递延是指到期不自动平仓，以收取递延费形式继续持仓，直到到达递延最大次数为止。当到达递延最大次数后，仓位会被自动平仓。')}</p>
              <p>{LANG('{symbol}递延最大次数：{deferDays}', { symbol: name, deferDays: deferDays || LANG('不限制递延') })}</p>
              <p>{LANG('{symbol}递延费率：{deferFee}%', { symbol: name, deferFee: deferFee.mul(100) })}</p>
            </>
          )}>
            <InfoHover style={{ fontSize: 12, color: 'var(--text-primary)', ...style }} >{LANG('是否递延')}</InfoHover>
          </Tooltip>
        }
        checked={checked}
        onChange={handleChange}
      />
    </>
  );
};
export default DeferCheckbox;
