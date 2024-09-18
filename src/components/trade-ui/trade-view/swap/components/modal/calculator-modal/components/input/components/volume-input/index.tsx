import { LANG } from '@/core/i18n';
import Input from '../..';
import { useStore } from '../../../../store';

import { Swap } from '@/core/shared';
import { Unit } from '../unit';

export const VolumeInput = (props: any) => {
  const { isUsdtType, cryptoData } = useStore();
  const baseSymbol = Swap.Trade.getBaseSymbol(cryptoData.id?.toUpperCase());

  let digit = 0;
  let unit = LANG('张');

  if (isUsdtType) {
    digit = cryptoData?.basePrecision;

    unit = baseSymbol;
  }
  return (
    <Input
      type='number'
      label={LANG('成交数量')}
      digit={digit}
      suffix={(res: any) => (
        <Unit className={'unit'} {...res}>
          {unit}
        </Unit>
      )}
      max={9999999999}
      {...props}
    />
  );
};

export default VolumeInput;
