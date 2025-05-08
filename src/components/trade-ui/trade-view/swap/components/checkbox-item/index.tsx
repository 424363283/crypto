import Radio from '@/components/Radio';
import { InfoHover } from '@/components/trade-ui/common/info-hover';
import Tooltip from '@/components/trade-ui/common/tooltip';
import { clsxWithScope, MediaInfo } from '@/core/utils';
import { ReactNode } from 'react';
import css from 'styled-jsx/css';

export const CheckboxItem = ({
  label,
  info,
  value = false,
  renderRight,
  onChange,
  className,
  radioAttrs,
  ...props
}: {
  label?: ReactNode;
  info?: string;
  value?: boolean;
  renderRight?: any;
  onChange?: (v: boolean) => any;
  className?: string;
  radioAttrs?: any;
}) => {
  return (
    <>
      <div className={clsx('item', className)}>
        <div className={clsx('label')}>
          <Radio
            label={
              <Tooltip placement="top" title={info}>
                <InfoHover className={clsx(value && 'checked')} hoverColor={false}>
                  {label}
                </InfoHover>
              </Tooltip>
            }
            checked={value}
            onChange={checked => onChange?.(!!checked)}
            {...radioAttrs}
          />
        </div>
        {renderRight?.() || <div />}
      </div>
      {styles}
    </>
  );
};

const { className, styles } = css.resolve`
  .item {
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
      color: var(--text_2);
      :global(.icon-radio) {
        :global(.info-hover.checked) {
          color: var(--text_1);
        }
        @media ${MediaInfo.mobile} {
          :global(.info-hover) {
            border-bottom: 0;
          }
        }
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
