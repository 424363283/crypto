import { SideType } from '@/core/shared';
import React from 'react';
import css from 'styled-jsx/css';

interface Props {
  greenText: string;
  redText: string;
  onChange: (val: SideType) => void;
  positionSide: SideType;
}
const PositionButton = ({ greenText, redText, onChange, positionSide }: Props) => {
  return (
    <>
      <div className='trade-type-bar'>
        <div
          className={`buy-wrapper ${positionSide === SideType.BUY && 'active'}`}
          onClick={() => onChange(SideType.BUY)}
        >
          {greenText}
        </div>
        <div
          className={`sell-wrapper ${positionSide === SideType.SELL && 'active'}`}
          onClick={() => onChange(SideType.SELL)}
        >
          {redText}
        </div>
      </div>
      <style jsx>{styles}</style>
    </>
  );
};
export default React.memo(PositionButton);
const styles = css`
  .trade-type-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--text-secondary);
    background-color: var(--fill-3);
    border-radius: 8px;
    height: 30px;
    .buy-wrapper,
    .sell-wrapper {
      flex: 1;
      height: 30px;
      position: relative;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 8px;
    }
    .buy-wrapper.active {
      background-color: var(--color-green);
      color: var(--text-white);
    }
    .sell-wrapper.active {
      background-color: var(--color-red);
      color: var(--text-white);
    }
  }
`;
