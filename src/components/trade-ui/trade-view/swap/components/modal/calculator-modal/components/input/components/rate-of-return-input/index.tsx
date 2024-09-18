import { LANG } from '@/core/i18n';
import Input from '../..';

import { Unit } from '../unit';

export const RateOfReturnInput = (props: any) => {
  return (
    <Input
      type='number'
      label={LANG('回报率')}
      digit={2}
      suffix={(res: any) => (
        <Unit className={'unit'} {...res}>
          %
        </Unit>
      )}
      max={100000}
      min={-100000}
      isNegative
      {...props}
    />
  );
};

export default RateOfReturnInput;
