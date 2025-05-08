import noop from 'lodash/noop';
import { Icon } from '@/components/YIcons';
import { ReactNode, useCallback } from 'react';


function CheckIcon({ name, ...props }: { name: string;[key: string]: any }) {
  const IconsMap = useCallback((name: string, fillColor: string) => {
    let img = null;
    switch (name) {
      case 'checkboxChecked': {
        img = '<path fill-rule="evenodd" clip-rule="evenodd" d="M6 12C9.31371 12 12 9.31371 12 6C12 2.68629 9.31371 0 6 0C2.68629 0 0 2.68629 0 6C0 9.31371 2.68629 12 6 12ZM4.81165 8.70812C4.91693 8.8134 5.05439 8.86632 5.1924 8.86632C5.32987 8.86632 5.46787 8.8134 5.57315 8.70812L9.34249 4.92297C9.5525 4.71186 9.5525 4.36984 9.34249 4.15874C9.13193 3.94709 8.791 3.94709 8.58099 4.15874L5.1924 7.56096L3.41901 5.78048C3.209 5.56938 2.86807 5.56938 2.65751 5.78048C2.4475 5.99158 2.4475 6.33415 2.65751 6.54526L4.81165 8.70812Z" fill="' + fillColor + '"/>'
        break;
      }
      case 'checkbox': {
        img = '<circle cx="6" cy="6" r="5.57143" stroke="#A5A8AC" stroke-width="0.857143"/>'
        break;
      }
      case 'checkboxLight': {
        img = '<circle cx="6" cy="6" r="5.57143" stroke="#787D83" stroke-width="0.857143"/>'
        break;
      }
      default: break;
    }
    return img;
  }, [name, props]);
  const value = IconsMap(name, props.fillColor);
  return !value ? null : <Icon className='check-icon' name={name} value={value} size={20} {...props} />;
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
}) {
  const { labelcolor, checked, disabled = false, label, onChange = noop, theme, large, size = 12, fillColor = 'var(--brand)', ...iconAttrs } = props;
  const iconName = checked ? 'checkboxChecked' : theme && /^light$/gi.test(theme) ? 'checkboxLight' : 'checkbox';

  return (
    <>
      <label className={`icon-radio ${disabled ? 'icon-radio-disabled' : ''}`} onClick={() => onChange(!checked)}>
        {
          large ?
            <CheckIcon name={iconName} viewBox="0 0 14 14" fillColor={fillColor} {...{ width: size, height: size, ...iconAttrs }} /> :
            <CheckIcon name={iconName} viewBox="0 0 12 12" fillColor={fillColor} {...{ width: size, height: size, ...iconAttrs }} />
        }
        {label && <span className='icon-span'>{label}</span>}
      </label>
      <style jsx>
        {`
          .icon-radio {
            display: inline-flex;
            align-items: center;
            border-radius:50%;
            width: fit-content;
            &.icon-radio-disabled {
              opacity: 0.6
            }

            &:not(.icon-radio-disabled) {
              cursor: pointer
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
              }
          }
        `}
      </style>
    </>
  );
}


