import { PositionSide } from '@/core/shared';
import React from 'react';
import css from 'styled-jsx/css';

interface Props {
  greenText: string;
  redText: string;
  onChange: (val: PositionSide) => void;
  positionSide: PositionSide;
}

const TransactionTypeButton = ({ greenText, redText, onChange, positionSide }: Props) => {
  return (
    <>
      <div className='trade-type-bar'>
        <div
          className={`buy ${positionSide === PositionSide.LONG && 'active'}`}
          onClick={() => onChange(PositionSide.LONG)}
        >
          {greenText}
        </div>
        <div
          className={`sell ${!(positionSide === PositionSide.LONG) && 'active'}`}
          onClick={() => onChange(PositionSide.SHORT)}
        >
          {redText}
        </div>
      </div>
      <style jsx>{styles}</style>
    </>
  );
};
export default React.memo(TransactionTypeButton);
const styles = css`
  .trade-type-bar {
    width: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: row;
    height: 30px;
    > div {
      cursor: pointer;
      border: 1px solid rgba(121, 130, 150, 0.3);
      flex: 1;
      line-height: 28px;
      font-size: 14px;
      font-weight: 400;
      color: var(--theme-font-color-2);
      text-align: center;
      &.active {
        border-color: transparent;
        color: #fff;
      }
      &.buy {
        border-right: 0;
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
      }
      &.buy.active {
        background-color: var(--color-green);
      }
      &.sell {
        border-left: 0;
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        &.active {
          background-color: var(--color-red);
        }
      }
    }
  }
`;
