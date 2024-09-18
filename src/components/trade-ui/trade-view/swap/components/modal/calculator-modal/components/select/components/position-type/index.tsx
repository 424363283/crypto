import { LANG } from '@/core/i18n';
import Select from '../..';

export const POSITION_TYPES = {
  ONE: 'one',
};
export const PositionType = (props: any) => {
  return <Select options={[{ label: LANG('单向持仓'), value: POSITION_TYPES.ONE }]} {...props} />;
};

export default PositionType;
