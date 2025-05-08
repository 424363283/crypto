import CommonIcon from '@/components/common-icon';
import { Svg } from '@/components/svg';
import { Switch } from '@/components/switch';
import Tooltip from '@/components/trade-ui/common/tooltip';
import { clsx } from '@/core/utils';

export const InfoItem = ({
  label,
  value,
  onChange,
  right,
  valueLabel,
  onClick,
  info,
  valueInfo,
}: {
  label?: any;
  value?: any;
  onChange?: any;
  right?: any;
  valueLabel?: any;
  onClick?: any;
  info?: any;
  valueInfo?: any;
}) => {
  const valueEle =
    right ||
    (valueLabel !== undefined ? (
      <div className={clsx('value')} onClick={onClick}>
        {valueLabel}
        {valueInfo ? (
          <Svg className={clsx('icon')} src='/static/images/swap/tips_info.svg' height={12} width={12} />
        ) : (
            <CommonIcon name='common-arrow-more-0' width={24} height={24} enableSkin />
        )}
      </div>
    ) : (
      <Switch bgType={3} checked={value} onChange={onChange} size='small' />
    ));
  return (
    <>
      <div className={clsx('item')}>
        <Tooltip placement='bottomLeft' title={info}>
          <div className={clsx()}>
            {label}
            {info && <Svg className={clsx('icon')} src='/static/images/swap/tips_info.svg' height={12} width={12} />}
          </div>
        </Tooltip>
        {valueInfo ? (
          <Tooltip placement='bottomLeft' title={valueInfo}>
            {valueEle}
          </Tooltip>
        ) : (
          valueEle
        )}
      </div>
      <style jsx>{`
        .item {
          padding: 0 24px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          height: 40px;
          cursor: pointer;
          > *:nth-child(1) {
            display: flex;
            align-items: center;
            font-size: 14px;
            font-weight: 400;
            color: var(--text_2);
          }
          :global(.value) {
            display: flex;
            align-items: center;
            font-size: 14px;
            color: var(--text_1);
            line-height: 12px;
          }
          :global(.icon) {
            margin-left: 5px;
          }
        }
      `}</style>
    </>
  );
};
