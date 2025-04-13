import ProTooltip from '@/components/tooltip';
import { LANG } from '@/core/i18n';
import { clsx, getUrlQueryParams } from '@/core/utils';
import css from 'styled-jsx/css';
import { WalletType } from '../../components/types';
import { HidePrice } from './hide-price';
interface PnlListItemProps {
  tooltips: string;
  name: string;
  value: string;
  eyeOpen: boolean;
}
export const PnlListItem = (props: PnlListItemProps) => {
  const { name, value, tooltips, eyeOpen } = props;
  const isSwapU = getUrlQueryParams('type') === WalletType.ASSET_SWAP_U;
  const unit = isSwapU ? 'USDT' : 'USD';
  // 亏损 红色；盈利 绿色
  const shouldHighLight = name === LANG('平均盈利') || name === LANG('平均亏损');
  const formatValueSymbol = value?.startsWith('-') ? '' : '+';
  return (
    <div className='pnl-list-item'>
      <ProTooltip title={tooltips}>
        <span className='name'>{name}</span>
      </ProTooltip>
      <span className={clsx('value', shouldHighLight && (value.startsWith('-') ? 'red' : 'green'))}>
        <HidePrice eyeOpen={eyeOpen}>
          {shouldHighLight ? formatValueSymbol + value : value} {shouldHighLight && unit}
        </HidePrice>
      </span>
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .pnl-list-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    .name {
      border-bottom: 1px dashed var(--line-3);
      color: var(--text-secondary);
      padding-bottom: 4px;
    }
    .value {
      color: var(--text-primary);
      font-size: 14px;
      font-weight: 500;
    }
    .green {
      color: var(-text-true);
    }
    .red {
      color: var(--text-error);
    }
  }
`;
