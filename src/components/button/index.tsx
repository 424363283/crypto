import { clsx } from '@/core/utils/src/clsx';
import { Intent, Size } from '../constants';
import { MediaInfo } from '@/core/utils';

interface IButtonType {
  '': ButtonStyles;
  primary: ButtonStyles;
  brand: ButtonStyles;
  brandLabel: ButtonStyles;
  yellow: ButtonStyles;
  secondary: ButtonStyles;
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
  '': {
    bgColor: 'var(--fill_3)',
    color: 'var(--text_1)',
    hover: {
      bgColor: 'var(--fill_pop)'
    },
    border: 'none'
  },
  primary: {
    bgColor: 'var(--brand)',
    color: 'var(--text_white)',
    hover: {
      bgColor: 'var(--btn_brand_hover)'
    },
    border: 'none'
  },
  brand: {
    bgColor: 'none',
    color: 'var(--brand)',
    hover: {
      bgColor: 'var(--btn_brand_hover)'
    },
    border: '1px solid var(--brand)'
  },
  yellow: {
    bgColor: 'var(--yellow_10)',
    color: 'var(--yellow)',
    hover: {
      bgColor: 'var(--btn_brand_hover)'
    },
    border: '1px solid var(--yellow)'
  },
  secondary: {
    bgColor: 'var(--fill_3)',
    color: 'var(--text_2)',
    hover: {
      bgColor: 'var(--btn_brand_hover)'
    },
    border: '1px solid var(--fill_3)'
  },
  brandLabel: {
    color: 'var(--text_brand)',
    bgColor: 'var(--brand_20)',
    border: 'var(--brand_20)',
    hover: {
      color: 'var(--text_brand)'
    }
  },
  'light-2': {
    bgColor: 'var(--theme-background-color-2)', // Header login button
    color: 'var(--theme-font-color-1)',
    border: 'none',
    hover: {
      color: 'var(--skin-color-active)'
    }
  },
  'light-2-3': {
    bgColor: 'var(--theme-background-color-2-3)', // 全球合伙人页面-登录
    color: 'var(--theme-font-color-1)',
    border: 'none',
    hover: {
      color: 'var(--skin-color-active)'
    }
  },
  'light-sub-1': {
    bgColor: 'var(--theme-sub-button-bg-1)', // 首页-行情-Action button
    color: 'var(--theme-font-color-1)',
    border: 'none',
    hover: {} as any
  },
  'light-sub-2': {
    bgColor: 'var(--theme-sub-button-bg-2)', // 行情-option-2
    color: 'var(--theme-font-color-3)',
    border: 'none',
    hover: {} as any,
    fontSize: '14px',
    fontWeight: '400'
  },
  'light-border-2': {
    bgColor: 'transparent', //行情Action button
    color: 'var(--theme-font-color-1)',
    border: '1px solid var(--theme-border-color-2)',
    hover: {} as any
  },
  'light-border-2-hover': {
    bgColor: 'transparent', //行情Action button
    color: 'var(--theme-font-color-1)',
    border: '1px solid var(--theme-border-color-2)',
    hover: {
      color: 'var(--skin-color-active)'
    } as any
  }
};

interface IButtonHeight {
  height: number;
  fontSize?: string;
  fontWeight?: number;
}
const ButtonSizes: { [key in Size]: IButtonHeight } = {
  [Size.XS]: { height: 24, fontSize: '12px', fontWeight: 400 },
  [Size.SM]: { height: 32, fontSize: '12px', fontWeight: 400 },
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
  type?: keyof typeof ButtonType;
  // type?: Intent;
  size?: Size;
  intent?: Intent;
  rounded?: boolean;
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
    ...rest
  } = props;
  const classes = clsx(size && `nui-${size}`, rounded && `nui-rounded`, type && `nui-${type}`, className);
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
          border-radius: 4px;
          text-align: center;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--fill_3);
          color: var(--text_3);
          font-size: 14px;
          font-weight: 400;
          white-space: nowrap;
          padding: 0 16px;
          :global(a) {
            color: inherit;
          }
        }

        .common-button {
          background-color: ${ButtonType[Intent.NONE].bgColor};
          color: ${ButtonType[Intent.NONE].color};
          border: ${ButtonType[Intent.NONE].border};
          height: ${ButtonSizes[size].height + 'px'};
          border-radius: ${(rounded ? ButtonSizes[size].height : 4) + 'px'};
          font-size: ${ButtonSizes[size].fontSize};
          font-weight: ${ButtonSizes[size].fontWeight};
          &:hover {
            background-color: ${ButtonType[type]?.hover?.bgColor};
            color: ${ButtonType[type]?.hover?.color};
          }
        }
        .common-button {
          @include nui-button-sizing($nui-base-height, $nui-base-padding, $nui-font-size);
          @include nui-button-style(
            $nui-base-text-color,
            $nui-base-text-color-hover,
            $nui-base-gradient,
            $nui-base-gradient-hover,
            $nui-base-border-color,
            $nui-base-border-color-hover
          );
          border-radius: #{$nui-border-radius-1};

          @each $size in $nui-sizes {
            &.nui-#{$size} {
              @include nui-button-sizing(
                map-get($nui-height-map, $size),
                map-get($nui-padding-map, $size),
                map-get($nui-font-size-map, $size)
              );
            }
          }

          &.nui-rounded {
            border-radius: $nui-border-radius-rounded;
          }
          &.brand {
            background: none;
            border: 1px solid var(--brand);
            color: var(--brand);
            &:hover {
              background: var(--brand);
              color: var(--text_white);
            }
          }
          &.brandLabel {
            color: var(--text_brand);
            font-family: 'HarmonyOS Sans SC';
            font-style: normal;
            font-weight: 500;
            line-height: normal;
            border-color: var(--brand_20);
            border-radius: 24px;
            background: var(--brand_20);
            &:hover,
            &:active {
              color: var(--text_brand);
              border-color: var(--brand_20);
            }
          }
          &.yellow {
            color: var(--yellow);
            font-family: 'HarmonyOS Sans SC';
            font-style: normal;
            font-weight: 500;
            line-height: normal;
            border-color: var(--yellow_10);
            border-radius: 24px;
            background: var(--yellow_10);
            &:hover,
            &:active {
              color: var(--yellow, rgba(240, 186, 48, 0.1));
              border-color: var(--yellow_10);
            }
          }
          &.secondary {
            color: var(--text_2);
            font-family: 'HarmonyOS Sans SC';
            font-weight: 500;
            font-size: 14px;
            line-height: normal;
            border-color: var(--fill_3);
            border-radius: 24px;
            background: var(--fill_3);
            &:hover,
            &:active {
              color: var(--text_1);
              border-color: var(--secondary);
            }
          }
        }

        @each $intent in $nui-intents {
          .common-button.nui-#{$intent} {
            @include nui-button-style(
              var(--text_white),
              var(--text_white),
              map-get($nui-gradient-map, $intent),
              map-get($nui-gradient-hover-map, $intent),
              map-get($nui-border-color-map, $intent),
              map-get($nui-border-color-hover-map, $intent)
            );
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
