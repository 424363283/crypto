import { Tooltip as AntdTooltip, TooltipProps } from 'antd';
import { memo } from 'react';

import { useTheme } from '@/core/hooks';
import { clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

const Index = ({ className, ...props }: { className?: string } & TooltipProps) => {
  const { isDark } = useTheme();
  const overlayClassName = clsx('tooltip', !isDark && 'light', className);

  return (
    <>
      <AntdTooltip overlayClassName={overlayClassName} {...props} />
      {styles}
    </>
  );
};

export const Tooltip = memo(Index);
const { className, styles } = css.resolve`
  .tooltip {
    max-width: unset;
    z-index: 10001;
    :global(.ant-tooltip-inner) {
      min-height: unset !important;
      max-width: 314px;
      word-break: break-word;
      white-space: unset !important;
      padding: 6px 12px !important;
      font-size: 14px !important;
      font-weight: 400 !important;
      color: var(--theme-font-color-1) !important;
      line-height: 18px !important;
      background: var(--theme-tips-color-2) !important;
    }
    :global(.ant-tooltip-arrow::before) {
      background-image: url(/static/images/trade/tip_arrow.svg) !important;
      height: 13px;
      width: 15px;
      clip-path: unset;
      bottom: -4px;
      background-color: unset;
      background-color: transparent !important;
    }
    &.light {
      :global(.ant-tooltip-arrow::before) {
        background-image: url(/static/images/trade/tip_arrow_light.svg) !important;
      }
    }
  }
`;

const clsx = clsxWithScope(className);

export default Tooltip;
