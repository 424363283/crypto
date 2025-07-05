import { useState } from 'react';
import css from 'styled-jsx/css';

import { Svg } from '@/components/svg';
import { DropdownSelect } from '@/components/trade-ui/common/dropdown';
import { clsxWithScope } from '@/core/utils';
import { Swap } from '@/core/shared';
import { LANG } from '@/core/i18n';
import CommonIcon from '@/components/common-icon';

const Index = ({ value, onChange }: { value?: string; onChange?: any }) => {
  const { LIMIT_SPSL, MARKET_SPSL } = Swap.Trade.ORDER_TRADE_TYPE;
  const options = [LANG('限价'), LANG('市价')];
  const optionValues = [LIMIT_SPSL, MARKET_SPSL];
  return (
    <>
      <DropdownSelect
        data={options}
        value={value === LIMIT_SPSL ? 0 : 1}
        onChange={(item, index) => {
          onChange(optionValues[index]);
        }}
      >
      </DropdownSelect>
    </>
  );
};

export default Index;
