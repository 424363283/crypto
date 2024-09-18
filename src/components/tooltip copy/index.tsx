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
      <Tooltip overlayClassName={clsx('pro-tooltip', className)} className='tooltip-text' title={title} {...props}>
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
      background-color: var(--theme-background-color-2-3);
      color: var(--theme-font-color-6);
      font-size: 12px;
    }
    :global(.ant-tooltip-arrow::before) {
      background: var(--theme-background-color-2-3);
    }
  }
  :global(.tooltip-text) {
    cursor: pointer;
  }
`;
