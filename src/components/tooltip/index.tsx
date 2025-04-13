import { clsx } from '@/core/utils';
import type { TooltipProps } from 'antd';
import { Tooltip } from 'antd';
import css from 'styled-jsx/css';

type ProTooltipProps = {
  className?: string;
  children: React.ReactNode | React.ReactNode[] | null;
} & Omit<TooltipProps, 'overlayClassName' | 'title'> & { title?: React.ReactNode | string };

const ProTooltip = ({ className, title, children, ...props }: ProTooltipProps): JSX.Element | null => {
  return title ? (
    <>
      <Tooltip overlayClassName={clsx('pro-tooltip', className)} className='tooltip-text' title={title} arrow={false} {...props}>
        {children}
      </Tooltip>
      <style jsx>{styles}</style>
    </>
  ) : (
    <>{children}</>
  );
};

export default ProTooltip;
const styles = css`
  :global(.pro-tooltip) {
    :global(.ant-tooltip-inner) {
      min-height: unset;
      max-width: 314px;
      width: max-content;
      word-break: break-word;
      white-space: unset;
      font-weight: 400;
      padding: 16px;
      background: var(--dropdown-select-bg-color) !important;
      box-shadow: 0px 4px 16px 0px var(--dropdown-select-shadow-color) !important;
      color: var(--text-tertiary) !important;
      font-size: 12px;
      line-height: 1.5;
      border-radius: 16px;
    }
    :global(.ant-tooltip-arrow::before) {
      background: var(--theme-background-color-2-3);
    }
  }
  :global(.tooltip-text) {
    cursor: pointer;
  }
`;
