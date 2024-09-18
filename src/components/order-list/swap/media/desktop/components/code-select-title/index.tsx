import { ColSelectTitle } from '@/components/order-list/components/record-list/components/col-select-title';
import { Swap } from '@/core/shared';
import { isSwapDemo } from '@/core/utils';

export const CodeSelectTitle = ({ codeOnly, ...props }: { codeOnly?: boolean } | any) => {
  const options = Swap.Info.getContractList(Swap.Trade.base.isUsdtType).reduce((r, item) => {
    const reg = !isSwapDemo() ? /-usdt?/i : /-s?usdt?/i;
    const code = item.id.replace(codeOnly ? reg : '-', '').toUpperCase();
    return { ...r, [codeOnly ? code : item.id.toUpperCase()]: code };
  }, {});

  return <ColSelectTitle options={options} {...props} />;
};
