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
    height: 36px;
    overflow: hidden;
    display: flex;
    flex-direction: row;
    border-radius: 8px;
    background-color: var(--fill_input_2);
    > div {
      cursor: pointer;
      flex: 1;
      line-height: 36px;
      font-size: 16px;
      font-weight: 400;
      color: var(--text_2);
      text-align: center;
      &.active {
        border-radius: 8px;
        border-color: transparent;
        color: #fff;
      }
      &.buy {
        border-right: 0;
      }
      &.buy.active {
        background-color: var(--color-green);
      }
      &.sell {
        border-left: 0;
        &.active {
          background-color: var(--color-red);
        }
      }
    }
  }
`;
