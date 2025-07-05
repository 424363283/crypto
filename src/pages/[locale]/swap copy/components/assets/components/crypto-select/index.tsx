import { ReactNode, useEffect } from 'react';

import { DropdownSelect } from '@/components/trade-ui/common/dropdown';
import { Swap, SwapTradeItem } from '@/core/shared';

/**
 * @prop {boolean} autoDefaultValue 自动赋予默认值
 * @returns
 */
export const CryptoSelect = ({
  children,
  value,
  onChange,
  autoDefaultValue = true,
}: {
  children?: ReactNode;
  value?: any;
  onChange: (v: any) => void;
  autoDefaultValue?: boolean;
}) => {
  const { quoteId, isUsdtType } = Swap.Trade.base;
  const defaultContractList = Swap.Info.getContractList(isUsdtType);
  const data = defaultContractList;
  const defaultContractId = quoteId;

  const formatOptionLabel = (v: SwapTradeItem) => v.coin;

  useEffect(() => {
    if (autoDefaultValue && data.length && !value) {
      onChange?.(defaultContractId);
    }
  }, [autoDefaultValue, data, value, defaultContractId]);

  return (
    <DropdownSelect
      data={data}
      value={value}
      onChange={(item) => {
        onChange?.(item.id);
      }}
      formatOptionLabel={formatOptionLabel}
    >
      {children}
    </DropdownSelect>
  );
};

export default CryptoSelect;
