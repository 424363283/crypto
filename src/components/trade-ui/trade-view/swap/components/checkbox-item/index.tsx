import CheckboxV2 from '@/components/checkbox-v2';
import { InfoHover } from '@/components/trade-ui/common/info-hover';
import Tooltip from '@/components/trade-ui/common/tooltip';
import { clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

export const CheckboxItem = ({
  label,
  info,
  value,
  renderRight,
  onChange,
  className,
  ...props
}: {
  label?: string;
  info?: string;
  value?: boolean;
  renderRight?: any;
  onChange?: (v: boolean) => any;
  className?: string;
}) => {
  return (
    <>
      <div className={clsx('item', className)}>
        <div className={clsx('label')}>
          <CheckboxV2
            {...props}
            className={clsx('checkbox', value && 'active')}
            checked={value}
            onClick={() => onChange?.(!value)}
          />
          <Tooltip placement='top' title={info}>
            <InfoHover>{label}</InfoHover>
          </Tooltip>
        </div>
        {renderRight?.() || <div />}
      </div>
      {styles}
    </>
  );
};

const { className, styles } = css.resolve`
  .item {
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    .label {
      display: flex;
      flex-direction: row;
      align-items: center;
      font-size: 12px;
      font-weight: 400;
      color: var(--theme-trade-text-color-2);
      > *:first-child {
        margin-right: 5px;
      }
    }
    .checkbox {
      margin-top: -1px;
      &.active {
        border: none;
      }
    }
  }
`;
const clsx = clsxWithScope(className);
export default CheckboxItem;
