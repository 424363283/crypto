import { LANG } from '@/core/i18n';
import Input from '../..';
import { useStore } from '../../../../store';

import { Unit } from '../unit';

export const BalanceInput = (props: any) => {
  const { isUsdtType, cryptoData } = useStore();

  return (
    <Input
      type='number'
      label={LANG('钱包余额')}
      digit={isUsdtType ? 2 : cryptoData?.basePrecision}
      suffix={(res: any) => <Unit {...res}>{cryptoData?.settleCoin}</Unit>}
      max={9999999999}
      {...props}
    />
  );
};

export default BalanceInput;
