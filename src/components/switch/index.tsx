import { clsxWithScope } from '@/core/utils';
import { Switch as MySwitch, SwitchProps } from 'antd';
import css from 'styled-jsx/css';

export const Switch = ({ className, bgType = '1', ...props }: SwitchProps & { bgType?: string | number }) => {
  return (
    <>
      <MySwitch className={clsx('my-switch', 'my-switch-bg' + bgType, className)} {...props} />
      {styles}
    </>
  );
};

const { className, styles: _styles } = css.resolve`
  .my-switch {
    &.my-switch-bg1 {
      &.ant-switch {
        background: #fd374b !important;
      }
    }
    &.my-switch-bg2 {
      &.ant-switch {
        background: var(--theme-trade-input-bg) !important;
      }
    }
    &.my-switch-bg3 {
      &.ant-switch {
        background: rgba(121, 130, 150, 0.3) !important;
      }
    }
    &.ant-switch :global(.ant-switch-inner) {
      background: transparent;
    }
    &.ant-switch-checked {
      &.ant-switch {
        background: var(--skin-color-active) !important;
      }
    }
  }
`;

export const styles = _styles;
export const clsx = clsxWithScope(className);
