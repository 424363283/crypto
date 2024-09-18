import { Swap } from '@/core/shared';

import { DefaultSelectView } from '@/components/trade-ui/common/dropdown/select';

export const VolUnitSelect = ({ children }: { children?: (args: { onClick: () => any }) => {} }) => {
  const { quoteId, isUsdtType } = Swap.Trade.base;
  // const isVolUnit = Swap.Info.getIsVolUnit(isUsdtType);
  // const priceUnit = Swap.Info.getPriceUnitText(true);
  // const baseSymbol = Swap.Trade.getBaseSymbol(quoteId);
  const onClick = () => Swap.Trade.setModal({ selectUnitVisible: true });
  const unit = Swap.Info.getUnitText({ symbol: quoteId });
  if (children) {
    return <>{children({ onClick })}</>;
  }
  return <DefaultSelectView onClick={onClick}>{unit}</DefaultSelectView>;
  // return (
  //   <DropdownSelect
  //     value={isVolUnit ? 0 : 1}
  //     data={[isUsdtType ? priceUnit : LANG('张'), baseSymbol]}
  //     onChange={async (_, i) => {
  //       const value = i === 0;
  //       if (value === isVolUnit) {
  //         return;
  //       }
  //       Loading.start();
  //       try {
  //         const result = await Swap.Info.updateIsVolUnit(isUsdtType, value);
  //         if (result.code !== 200) {
  //           return message.error(result);
  //         }
  //         Swap.Trade.clearInputVolume();
  //       } catch (e) {
  //         message.error(e);
  //       } finally {
  //         Loading.end();
  //       }
  //     }}
  //   >
  //     {children}
  //   </DropdownSelect>
  // );
};
