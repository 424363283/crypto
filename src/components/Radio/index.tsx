import noop from 'lodash/noop';
import { Icon } from '@/components/YIcons';
import { ReactNode, useCallback } from 'react';
import { useTheme, useResponsive } from '@/core/hooks';

function CheckIcon({ name, ...props }: { name: string; [key: string]: any }) {
  const { isMobile } = useResponsive();
  const IconsMap = useCallback(
    (name: string, fillColor: string, pathColor: string) => {
      let img = null;
      switch (name) {
        case 'checkboxChecked': {
          img = isMobile
            ? `<circle cx="12" cy="12" r="9" fill="${fillColor}" stroke="${fillColor}" stroke-width="2"/><path d="M15.142 9.98299L10.875 14.25L9.42049 12.7955" stroke="${pathColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`
            : `<path d="M15.142 9.98299L10.875 14.25L9.42049 12.7955M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3Z" stroke="${fillColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
          break;
        }
        case 'checkbox': {
          img =
            '<path d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
          break;
        }
        case 'checkboxLight': {
          img =
            '<path d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z" stroke="#CCCCCC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
          break;
        }
        default:
          break;
      }
      return img;
    },
    [name, props]
  );
  const value = IconsMap(name, props.fillColor, props.pathColor);
  return !value ? null : <Icon className="check-icon" name={name} value={value} size={20} {...props} />;
}

export default function Radio(props: {
  checked: boolean;
  disabled?: boolean;
  label: ReactNode;
  onChange?: (val?: boolean) => void;
  theme?: string;
  large?: boolean;
  size?: number;
  fillColor?: string;
  labelcolor?: string;
  pathColor?: string;
  width?: number;
  height?: number;
}) {
  const { isDark, skin } = useTheme();
  const {
    labelcolor,
    checked,
    disabled = false,
    label,
    onChange = noop,
    theme,
    large,
    size = 12,
    fillColor = 'var(--brand)',
    pathColor = `var(--text_${isDark ? 'black' : 'white'})`,
    ...iconAttrs
  } = props;
  // const iconName = checked ? 'checkboxChecked' : theme && /^light$/gi.test(theme) ? 'checkboxLight' : 'checkbox';
  const iconName = checked ? 'checkboxChecked' : isDark ? 'checkbox' : 'checkboxLight';

  return (
    <>
      <label className={`icon-radio ${disabled ? 'icon-radio-disabled' : ''}`} onClick={() => onChange(!checked)}>
        {large ? (
          <CheckIcon
            name={iconName}
            viewBox="0 0 28 28"
            fillColor={fillColor}
            pathColor={pathColor}
            {...{ width: size, height: size, ...iconAttrs }}
          />
        ) : (
          <CheckIcon
            name={iconName}
            viewBox="0 0 24 24"
            fillColor={fillColor}
            pathColor={pathColor}
            {...{ width: size, height: size, ...iconAttrs }}
          />
        )}
        {label && <span className="icon-span">{label}</span>}
      </label>
      <style jsx>
        {`
          .icon-radio {
            display: inline-flex;
            align-items: center;
            border-radius: 50%;
            width: fit-content;
            &.icon-radio-disabled {
              opacity: 0.6;
            }

            &:not(.icon-radio-disabled) {
              cursor: pointer;
            }

            :global(.check-icon) {
              flex: 0 0 auto;
            }

            & span {
              margin-left: 8px;
              color: ${!labelcolor ? 'var(--text_2)' : labelcolor};
              font-size: ${size}px;
              font-weight: 400;
            }
            .icon-span {
              margin-left: 8px;
              color: ${!labelcolor ? 'var(--text_2)' : labelcolor};
              font-size: ${size}px;
              font-weight: 400;
              line-height: 1rem;
            }
          }
        `}
      </style>
    </>
  );
}
