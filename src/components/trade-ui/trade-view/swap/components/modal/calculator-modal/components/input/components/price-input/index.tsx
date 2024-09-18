import { LANG } from '@/core/i18n';
import Input from '../..';
import { useStore } from '../../../../store';

import { Swap } from '@/core/shared';
import { useCallback } from 'react';
import { Unit } from '../unit';
import { clsx, styles } from './styled';

export const PriceInput = ({
  onChange,
  newPriceEnable,
  ...props
}: {
  onChange: (value: number) => {};
  newPriceEnable?: boolean;
} & any) => {
  const { isUsdtType, cryptoData, quoteId } = useStore();
  const _getNewprice = useCallback(async () => {
    onChange(Swap.Utils.getNewPrice(quoteId) || 0);
  }, [onChange, quoteId]);

  return (
    <>
      <Input
        isNegative
        type='number'
        label={LANG('开仓价格')}
        digit={cryptoData?.baseShowPrecision || 0}
        suffix={(res: any) => (
          <div className={clsx('suffix')}>
            {newPriceEnable && (
              <div className={clsx('new')} onClick={_getNewprice}>
                {LANG('最新价格')}
              </div>
            )}
            <Unit {...res}>{isUsdtType ? 'USDT' : 'USD'}</Unit>
          </div>
        )}
        onChange={onChange}
        max={9999999999}
        {...props}
      />
      {styles}
    </>
  );
};

export default PriceInput;
