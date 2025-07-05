import { isNumber } from '@/core/utils';
import { Button } from 'antd';
import isString from 'lodash/isString';
import css from 'styled-jsx/css';
export default function CopyBtn(props: {
  btnTxt: string;
  width?: any;
  preIcon?: any;
  classNames?: any;
  btnType?: string;
  textSize?: string;
  onClick?: () => void;
}) {
  const { btnTxt, width = 136, preIcon, btnType = 'brand', textSize = 'textSize14', onClick } = props;
  return (
    <>
      <Button
        onClick={onClick}
        className={`gloe ${btnType} ${textSize}`}
        style={{ width: isString(width) ? width : width + 'px' }}
        icon={preIcon}
      >
        {btnTxt}
      </Button>
      <style jsx>{styles}</style>
    </>
  );
}
const styles = css`
  :global(.gloe) {
    display: flex;
    width: 136px;
    justify-content: center;
    align-items: center;
    height: 40px;
    border-radius: 24px;
    &:hover,
    &:active {
      color: var(--text_brand) !important;
      border-color: var(--text_brand) !important;
      opacity: 0.8;
    }
  }
  :global(.brand) {
    background: var(--text_brand);
    color: #fff;
    border: 1px solid var(--brand);

    &:hover,
    &:active {
      background: var(--text_brand) !important;
      color: #fff !important;
      border-color: var(--text_brand) !important;
      opacity: 0.8;
    }
  }
  :global(.border) {
    color: var(--text_brand);
     font-family: "Lexend";
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    border-color: var(--text_brand);
    &:hover {
      color: var(--text_brand);
      border-color: var(--text_brand);
      opacity: 0.8;
    }
  }
  :global(.gracy) {
    color: var(--text_2);
     font-family: "Lexend";
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    background: var(--fill_3);
    border-color: var(--fill_3);
    &:hover {
      color: var(--text_brand);
      border-color: var(--fill_3);
      opacity: 0.8;
    }
  }
  :global(.gracyLabel) {
    color: var(--text_brand);
     font-family: "Lexend";
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    background: var(--brand_20);
    border-color: var(--brand_20);
    border-radius: 24px;
    background: var(--brand_20);
    &:hover,
    &:active {
      color: var(--text_brand) !important;
      border-color: var(--brand_20) !important;
    }
  }
  :global(.textSize16) {
    font-size: 16px;
    font-weight: 500;
  }
  :global(.textSize14) {
    font-size: 14px;

  }
`;
