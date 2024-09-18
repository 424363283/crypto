import { clsx } from '@/core/utils/src/clsx';

interface IButtonType {
  primary: ButtonStyles;
  'light-2': ButtonStyles;
  'light-2-3': ButtonStyles;
  'light-sub-1': ButtonStyles;
  'light-sub-2': ButtonStyles;
  'light-border-2': ButtonStyles;
  'light-border-2-hover': ButtonStyles;
}

interface ButtonStyles {
  bgColor: string;
  color: string;
  border?: string;
  hover?: {
    bgColor?: string;
    color?: string;
  };
  fontSize?: string;
  fontWeight?: string;
}

const ButtonType: IButtonType = {
  primary: {
    bgColor: 'var(--skin-primary-color)',
    color: 'var(--skin-font-color)',
    hover: {
      bgColor: 'rgba(var(--skin-primary-color-rgb),0.5)',
    },
    border: 'none',
  },
  'light-2': {
    bgColor: 'var(--theme-background-color-2)', // Header login button
    color: 'var(--theme-font-color-1)',
    border: 'none',
    hover: {
      color: 'var(--skin-color-active)',
    },
  },
  'light-2-3': {
    bgColor: 'var(--theme-background-color-2-3)', // 全球合伙人页面-登录
    color: 'var(--theme-font-color-1)',
    border: 'none',
    hover: {
      color: 'var(--skin-color-active)',
    },
  },
  'light-sub-1': {
    bgColor: 'var(--theme-sub-button-bg-1)', // 首页-行情-Action button
    color: 'var(--theme-font-color-1)',
    border: 'none',
    hover: {} as any,
  },
  'light-sub-2': {
    bgColor: 'var(--theme-sub-button-bg-2)', // 行情-option-2
    color: 'var(--theme-font-color-3)',
    border: 'none',
    hover: {} as any,
    fontSize: '14px',
    fontWeight: '400',
  },
  'light-border-2': {
    bgColor: 'transparent', //行情Action button
    color: 'var(--theme-font-color-1)',
    border: '1px solid var(--theme-border-color-2)',
    hover: {} as any,
  },
  'light-border-2-hover': {
    bgColor: 'transparent', //行情Action button
    color: 'var(--theme-font-color-1)',
    border: '1px solid var(--theme-border-color-2)',
    hover: {
      color: 'var(--skin-color-active)',
    } as any,
  },
};

type ButtonProps = {
  className?: string;
  width?: number | string;
  height?: number | string;
  bgColor?: string;
  type: keyof typeof ButtonType;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'>;

export const Button = (props: ButtonProps) => {
  const { children, className, width, height, bgColor, type, style, disabled, ...rest } = props;
  return (
    <button
      className={clsx('common-button', disabled && 'disabled', type, className)}
      style={{ width: width, height: height, backgroundColor: bgColor, ...style }}
      {...rest}
    >
      {children}
      <style jsx>{`
        .common-button {
          border-radius: 6px;
          text-align: center;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #782CE8;
          color: var(--skin-font-color);
          font-size: 14px;
          font-weight: 500;
        }
        .common-button.disabled {
          opacity: 0.6;
          cursor: not-allowed;
          pointer-events: none;
        }
        .common-button,
        .${[type]} {
          background-color: ${ButtonType[type].bgColor};
          color: ${ButtonType[type].color};
          border: ${ButtonType[type].border};
          ${ButtonType[type]?.fontSize ? `font-size: ${ButtonType[type].fontSize};` : ''}
          ${ButtonType[type]?.fontWeight ? `font-weight: ${ButtonType[type].fontWeight};` : ''}
          &:hover {
            background-color: ${ButtonType[type]?.hover?.bgColor};
            color: ${ButtonType[type]?.hover?.color};
          }
        }
      `}</style>
    </button>
  );
};
