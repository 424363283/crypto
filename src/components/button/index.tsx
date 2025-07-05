import { clsx } from '@/core/utils/src/clsx';
import { Intent, Size } from '../constants';
import { MediaInfo } from '@/core/utils';

interface IButtonType {
  '': ButtonStyles;
  primary: ButtonStyles;
  brand: ButtonStyles;
  brand0: ButtonStyles;
  brand20: ButtonStyles;
  green: ButtonStyles,
  red: ButtonStyles,
  orange: ButtonStyles,
  yellow: ButtonStyles;
  yellow10: ButtonStyles;
  blue: ButtonStyles;
  reverse: ButtonStyles;
  black: ButtonStyles;
  white: ButtonStyles;
}

interface ButtonStyles {
  bgColor?: string;
  color?: string;
  border?: string;
  hover?: {
    bgColor?: string;
    color?: string;
  };
  fontSize?: string;
  fontWeight?: string;
}

interface IButtonHeight {
  height: number;
  fontSize?: string;
  fontWeight?: number;
}
const ButtonSizes: { [key in Size]: IButtonHeight } = {
  [Size.XS]: { height: 24, fontSize: '12px', fontWeight: 400 },
  [Size.SM]: { height: 32, fontSize: '14px', fontWeight: 400 },
  [Size.DEFAULT]: { height: 40, fontSize: '14px', fontWeight: 500 },
  [Size.LG]: { height: 48, fontSize: '14px', fontWeight: 500 },
  [Size.MD]: { height: 48, fontSize: '16px', fontWeight: 500 },
  [Size.XL]: { height: 56, fontSize: '16px', fontWeight: 500 }
};
type ButtonProps = {
  className?: string;
  width?: number | string;
  height?: number | string;
  bgColor?: string;
  type?: keyof IButtonType;
  // type?: Intent;
  size?: Size;
  intent?: Intent;
  rounded?: boolean;
  hover?: boolean;
  outlined?: boolean;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'>;

export const Button = (props: ButtonProps) => {
  const {
    children,
    className,
    width,
    height,
    bgColor,
    type = '',
    style,
    disabled,
    size = Size.DEFAULT,
    rounded,
    outlined = false,
    hover = true,
    ...rest
  } = props;
  const classes = clsx(size && `nui-${size}`, rounded && `nui-rounded`, type && `nui-${type}`, outlined && 'nui-outlined' ,!hover && 'nui-nohover', className);
  return (
    <button
      className={clsx('common-button', disabled && 'disabled', type, classes)}
      style={{ width: width, height: height, backgroundColor: bgColor, ...style }}
      {...rest}
    >
      {children}
      <style jsx>{`
        @import './index.module.scss';
        .common-button {
          box-sizing: border-box;
          text-align: center;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: ${ButtonSizes[size].fontWeight};
          white-space: nowrap;
          :global(a) {
            color: inherit;
          }
        }
        .common-button.disabled {
          background-color: var(--fill_3);
          color: var(--text_3);
          cursor: not-allowed;
          pointer-events: none;
          border-color:var(--fill_3);
        }
      `}</style>
    </button>
  );
};

