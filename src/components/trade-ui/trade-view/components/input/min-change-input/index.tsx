import AppInput, { DecimalInput } from '@/components/numeric-input';

import { Swap } from '@/core/shared';

// https://zt.ttms.io/zentao/bug-view-1308.html###
// 用来处理 最小跳数字 价格会是最小跳的倍数 minChangePrice
export const MinChangeInput = ({
  onChange,
  minChangePrice,
  enableMinChange = true,
  ...props
}: {
  onChange?: any;
  minChangePrice?: any;
  enableMinChange?: any;
}) => {
  const _minChangePrice = Swap.Info.getCryptoData(Swap.Trade.base.quoteId).minChangePrice;
  const change = minChangePrice || _minChangePrice;

  return (
    <AppInput
      component={DecimalInput}
      onChange={(value: any, { isBlur, ...res }: any) => {
        if (isBlur && change && enableMinChange) {
          value = Swap.Utils.minChangeFormat(change, value);
        }
        onChange(value, { isBlur, ...res });
      }}
      {...props}
    />
  );
};

export default MinChangeInput;
