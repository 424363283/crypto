import { Input } from "antd";
import { LANG } from '@/core/i18n';
import * as Utils from '../../utils';
import { clsx, styles } from './styled';
const TYPES = Utils.TYPES;
export const SwitchPrice = ({
  value,
  onChange,
  type,
  options,
}: any) => {
  return (
    <>
      <div className={clsx('liquidation-switch')} onClick={() => onChange(type === TYPES.NEWS_PRICE ? TYPES.FLAG_PRICE : TYPES.NEWS_PRICE)}>
        {type === TYPES.NEWS_PRICE ? LANG('市价') : LANG('限价')}
      </div>
      {styles}
    </>
  )
}



export default SwitchPrice;
