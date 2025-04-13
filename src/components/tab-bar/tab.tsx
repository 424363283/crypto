import { MediaInfo, clsx } from '@/core/utils';
import { useCallback } from 'react';
import css from 'styled-jsx/css';

interface Props {
  active: boolean;
  value: any;
  onClick: (value: any) => void;
  className?: string | string[];
  children: React.ReactNode | JSX.Element;
}

const Tab = ({ active, value, children, onClick, className }: Props) => {
  const _onClick = useCallback(() => {
    onClick?.(value);
  }, [onClick, value]);

  return (
    <div className={clsx('tab', className, active && 'active')} onClick={_onClick}>
      <div>{children}</div>
      <style jsx>{styles}</style>
    </div>
  );
};

export default Tab;

const styles = css`
  .tab {
    position: relative;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    color: var(--text-secondary);
    height: 40px;
    font-size: 14px;
    &.xs {
      height: 30px;
      font-size: 12px;
    }
    &.sm {
      height: 30px;
      font-size: 14px;
    }
    &.lg {
      height: 48px;
      font-size: 14px;
    }
    &.xl {
      height: 58px;
      font-size: 16px;
    }
    @media ${MediaInfo.mobile} {
      height: 34px;
      font-size: 14px;
    }
    > div {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      @media ${MediaInfo.mobile} {
        height: auto;
      }
    }
    &.active {
      > div {
        color: var(--text-brand);
      }
    }
    &.line.active {
      > div {
        &::after {
          content: '';
          display: block;
          position: absolute;
          bottom: 0;
          width: 37.5%;
          height: 3px;
          background: var(--text-brand);
          @media ${MediaInfo.mobile} {
            bottom: -5px;
          }
        }
      }
    }
    &.card {
      > div{
        padding: 8px 16px;
        border-radius: 6px;
        border: 1px solid var(--line-3);
        @media ${MediaInfo.mobile} {
           padding: 5px 8px;
           border: none;
           background: var(--fill-3);
        }
      }
    }
    &.card.active {
      > div {
        color: var(--text-primary);
        background: var(--fill-3);
        border: 1px solid var(--fill-3);
        @media ${MediaInfo.mobile} {
          color: var(--brand);
          background: var(--fill-3);
          border: 1px solid var(--brand);
        }
      }
    }
  }
`;
