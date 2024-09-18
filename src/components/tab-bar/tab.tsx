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
    padding-right: 35px;
    height: 60px;
    cursor: pointer;
    color: var(--theme-font-color-3);
    font-size: 16px;
    @media ${MediaInfo.mobile} {
      font-size: 14px;
    }
    > div {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
    }

    &.active {
      > div {
        color: var(--theme-font-color-1);
        font-size: 16px;
        font-weight: 500;
        @media ${MediaInfo.mobile} {
          font-size: 14px;
        }
        &::after {
          content: '';
          display: block;
          position: absolute;
          bottom: 0;
          width: 100%;
          height: 3px;
          background: var(--skin-primary-color);
        }
      }
    }
  }
`;
