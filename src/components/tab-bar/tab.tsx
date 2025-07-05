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
    color: var(--text_2);
    line-height: 14px;
    font-size: 14px;
    font-weight: 400;
    &.xs {
      line-height: 12px;
      font-size: 12px;
    }
    &.xs:not(.card) {
      padding: 8px 0;
    }
    &.sm {
      line-height: 14px;
      font-size: 14px;
    }
    &.sm:not(.card) {
      padding: 8px 0;
    }
    &.lg {
      line-height: 14px;
      font-size: 14px;
    }
    &.lg:not(.card) {
      padding: 12px 0;
    }
    &.xl {
      line-height: 16px;
      font-size: 16px;
    }
    &.xl:not(.card) {
        padding: 16px 0;
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
      font-weight: 500;
      > div {
        color: var(--text_1);
      }
    }
    &.line.active {
      &::after {
        content: '';
        display: block;
        position: absolute;
        bottom: 0;
        width: 37.5%;
        height: 3px;
        background: var(--text_brand);
      }
    }
    &.card {
      > div{
        padding: 8px 16px;
        border-radius: 6px;
        border: 1px solid var(--fill_line_1);
        @media ${MediaInfo.mobile} {
           padding: 5px 8px;
        }
      }
    }
    &.card.active {
      > div {
        color: var(--text_1);
        background: var(--fill_1);
        border: 1px solid var(--fill_1);
      }
    }
  }
  .tab:not(.card) {
    padding: 12px 0;
  }
`;
