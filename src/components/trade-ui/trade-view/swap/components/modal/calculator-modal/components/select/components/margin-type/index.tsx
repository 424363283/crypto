import { LANG } from '@/core/i18n';
import Select from '../..';
import { store } from '../../../../store';
import { Layer } from '@/components/constants';

export const MARGIN_TYPES = {
  ALL: 'all',
  SINGLE: 'single',
};
export const MarginType = (props: any) => {
  return (
    <Select
      layer={Layer.Overlay}
      value={store.marginType}
      onChange={(v) => (store.marginType = v)}
      options={[
        { label: LANG('全仓'), value: MARGIN_TYPES.ALL },
        { label: LANG('逐仓'), value: MARGIN_TYPES.SINGLE },
      ]}
      {...props}
    />
  );
};

export default MarginType;
