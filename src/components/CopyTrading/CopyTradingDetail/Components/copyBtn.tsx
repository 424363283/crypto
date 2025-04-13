import { isNumber } from '@/core/utils';
import { Button } from 'antd';
import { isString } from 'lodash';
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
      color: var(--text-brand) !important;
      border-color: var(--text-brand) !important;
      opacity: 0.8;
    }
  }
  :global(.brand) {
    background: var(--text-brand);
    color: #fff;
    border: 1px solid var(--brand);

    &:hover,
    &:active {
      background: var(--text-brand) !important;
      color: #fff !important;
      border-color: var(--text-brand) !important;
      opacity: 0.8;
    }
  }
  :global(.border) {
    color: var(--text-brand);
    font-family: 'HarmonyOS Sans SC';
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    border-color: var(--text-brand);
    &:hover {
      color: var(--text-brand);
      border-color: var(--text-brand);
      opacity: 0.8;
    }
  }
  :global(.gracy) {
    color: var(--text-secondary);
    font-family: 'HarmonyOS Sans SC';
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    background: var(--fill-3);
    border-color: var(--fill-3);
    &:hover {
      color: var(--text-brand);
      border-color: var(--fill-3);
      opacity: 0.8;
    }
  }
  :global(.gracyLabel) {
    color: var(--text-brand);
    font-family: 'HarmonyOS Sans SC';
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    background: var(--Color-Brand-label, rgba(7, 130, 139, 0.2));
    border-color: var(--Color-Brand-label, rgba(7, 130, 139, 0.2));
    border-radius: 24px;
    background: var(--Color-Brand-label, rgba(7, 130, 139, 0.2));
    &:hover,
    &:active {
      color: var(--text-brand) !important;
      border-color: var(--Color-Brand-label, rgba(7, 130, 139, 0.2)) !important;
    }
  }
  :global(.textSize16) {
    font-size: 16px;
  }
  :global(.textSize14) {
    font-size: 14px;
  }
`;
