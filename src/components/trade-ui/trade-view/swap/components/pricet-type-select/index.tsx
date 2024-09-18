import { DropdownSelect, DropdownSelectProps } from '@/components/trade-ui/common/dropdown';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';

export const PriceTypeSelect = ({ value, onChange, ...props }: DropdownSelectProps) => {
  const unitArr = [LANG('标记'), LANG('最新')];
  return (
    <>
      <DropdownSelect
        value={value === Swap.Trade.PRICE_TYPE.FLAG ? 0 : 1}
        data={unitArr}
        onChange={(_, i) => (onChange as any)?.([Swap.Trade.PRICE_TYPE.FLAG, Swap.Trade.PRICE_TYPE.NEW][i])}
        {...props}
      ></DropdownSelect>
    </>
  );
};
