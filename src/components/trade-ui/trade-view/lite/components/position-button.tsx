import { PositionSide } from '@/core/shared';
import React from 'react';
import css from 'styled-jsx/css';
import BuySvg from './buy-svg';
import SellSvg from './sell-svg';

interface Props {
  greenText: string;
  redText: string;
  onChange: (val: PositionSide) => void;
  positionSide: PositionSide;
  type?: 'pc' | 'pad' | 'phone';
}
const PositionButton = ({ greenText, redText, onChange, positionSide, type = 'pc' }: Props) => {
  return (
    <>
      <div className='trade-type-bar'>
        <div
          className={`buy-wrapper ${positionSide === PositionSide.LONG && 'active'}`}
          onClick={() => onChange(PositionSide.LONG)}
        >
          <BuySvg width='132' height='30' />
          <span>{greenText}</span>
        </div>
        <div
          className={`sell-wrapper ${positionSide === PositionSide.SHORT && 'active'}`}
          onClick={() => onChange(PositionSide.SHORT)}
        >
          <SellSvg width='132' height='30' />
          <span>{redText}</span>
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
    align-items: center;
    justify-content: center;
    color: var(--theme-font-color-2);
    :global(path) {
      fill: var(--theme-background-color-3);
    }
    .buy-wrapper.active {
      color: #fff;
      :global(path) {
        fill: var(--color-green);
      }
    }
    .sell-wrapper.active {
      color: #fff;
      :global(path) {
        fill: var(--color-red);
      }
    }
    .buy-wrapper {
      width: 156px;
    }
    .buy-wrapper,
    .sell-wrapper {
      height: 40px;
      position: relative;
      cursor: pointer;
      span {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
`;
