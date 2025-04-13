import { clsx, MediaInfo } from '@/core/utils';
import css from 'styled-jsx/css';

interface StepContentProps {
  className?: string;
  active?: boolean;
  line?: boolean;
  childrenSpace?: boolean;
  children: JSX.Element | React.ReactElement | JSX.Element[];
}

const StepContent: React.FC<StepContentProps> = ({
  className,
  active,
  line = true,
  childrenSpace = false,
  children,
}) => (
  <div
    className={clsx('step-content', childrenSpace && 'children-space', active && 'active', className, line && 'line')}
  >
    {children}
    <style jsx>{styles}</style>
  </div>
);
const styles = css`
  .step-content {
    position: relative;
    @media ${MediaInfo.mobile}{
      // width: calc(100% - 24px);
    }
    &.children-space {
      padding-bottom: 0;
      > * {
        margin-bottom: 25px;
        &:nth-child(n-2) {
          margin-bottom: 30px;
        }
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
    &.line {
      &::before {
        content: '';
        display: block;
        position: absolute;
        top: 6%;
        left: 12px;
        height: 88%;
        width: 1px;
        background-color: #f0f0f0;
      }
    }
    &.active {
      &::before {
        background-color: var(--skin-primary-color);
      }
    }
  }
`;
export default StepContent;
