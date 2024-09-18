import { Swap } from '@/core/shared';

import { Loading } from '@/components/loading';
import { LANG } from '@/core/i18n';
import { UNIT_MODE } from '@/core/shared/src/swap/modules/info/constants';
import { message } from '@/core/utils';
import { DropdownSelect } from '../../common/dropdown';

export const VolUnitSelect = ({ children }: { children?: any }) => {
  const { quoteId, isUsdtType } = Swap.Trade.base;
  const isVolUnit = Swap.Info.getIsVolUnit(isUsdtType);
  const isMarginUnit = Swap.Info.getIsMarginUnit(isUsdtType);
  const priceUnit = Swap.Info.getPriceUnitText(true);
  const baseSymbol = Swap.Trade.getBaseSymbol(quoteId);
  const value = isVolUnit ? 0 : 1;
  return (
    <DropdownSelect
      value={value}
      data={[isUsdtType ? priceUnit : LANG('张'), baseSymbol]}
      onChange={async (_, i) => {
        const value = i === 0;
        if (value === isVolUnit) {
          return;
        }
        Loading.start();
        try {
          const result = await Swap.Info.updateIsVolUnit(
            isUsdtType,
            value ? (isMarginUnit ? UNIT_MODE.MARGIN : UNIT_MODE.VOL) : UNIT_MODE.COIN
          );
          if (result.code !== 200) {
            return message.error(result);
          }
          message.success(LANG('修改成功'));
          Swap.Trade.clearInputVolume();
        } catch (e) {
          message.error(e);
        } finally {
          Loading.end();
        }
      }}
    >
      {children}
    </DropdownSelect>
  );
};
