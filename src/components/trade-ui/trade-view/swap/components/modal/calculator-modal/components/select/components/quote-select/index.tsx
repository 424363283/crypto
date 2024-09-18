import { Swap } from '@/core/shared';
import { clsx } from '@/core/utils';
import css from 'styled-jsx/css';
import Select from '../..';
import { store } from '../../../../store';

export const QuoteSelect = ({ className, onChange, ...props }: any) => {
  const options = Swap.Info.getContractList(Swap.Trade.base.isUsdtType).reduce<any[]>((r, item) => {
    return [...r, { label: item.name, value: item.id }];
  }, []);

  return (
    <>
      <Select
        options={options}
        value={store.quoteId}
        className={clsx('quote-select', resolveClassName, className)}
        {...props}
        onChange={(v) => {
          onChange?.(v);
          store.quoteId = v;
        }}
      />
      {styles}
    </>
  );
};

const { styles, className: resolveClassName } = css.resolve`
  .quote-select {
    margin-bottom: 14px;
  }
`;
export default QuoteSelect;
