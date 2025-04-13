import noop from 'lodash/noop';
import { Icon } from '@/components/YIcons';
import { ReactNode } from 'react';

const IconsMap = {
  checkboxChecked:
    '<path fill-rule="evenodd" clip-rule="evenodd" d="M6 12C9.31371 12 12 9.31371 12 6C12 2.68629 9.31371 0 6 0C2.68629 0 0 2.68629 0 6C0 9.31371 2.68629 12 6 12ZM4.81165 8.70812C4.91693 8.8134 5.05439 8.86632 5.1924 8.86632C5.32987 8.86632 5.46787 8.8134 5.57315 8.70812L9.34249 4.92297C9.5525 4.71186 9.5525 4.36984 9.34249 4.15874C9.13193 3.94709 8.791 3.94709 8.58099 4.15874L5.1924 7.56096L3.41901 5.78048C3.209 5.56938 2.86807 5.56938 2.65751 5.78048C2.4475 5.99158 2.4475 6.33415 2.65751 6.54526L4.81165 8.70812Z" fill="#07828B"/>',
  checkbox: '<circle cx="6" cy="6" r="5.6" stroke="#A5A8AC" stroke-width="0.8"/>',
  checkboxLight: '<rect x="3.40796" y="2.54816" width="11" height="11" rx="1.5" stroke="#717171"/>'
};

function CheckIcon({ name, ...props }: { name: string;[key: string]: any }) {
  if (!IconsMap[name as keyof typeof IconsMap]) return null;

  return <Icon name={name} value={IconsMap[name as keyof typeof IconsMap]} size={12} {...props} />;
}

export default function CheckBox(props: {
  checked: boolean;
  disabled?: boolean;
  label: ReactNode;
  onChange?: (val?: boolean) => void;
  theme?: string;
}) {
  const { checked, disabled = false, label, onChange = noop, theme } = props;
  const iconName = checked ? 'checkboxChecked' : theme && /^light$/gi.test(theme) ? 'checkboxLight' : 'checkbox';

  return (
    <>
      <label className={`icon-checkbox ${disabled ? 'icon-checkbox-disabled' : ''}`} onClick={() => onChange(!checked)}>
        <CheckIcon name={iconName} width="12" height="12" viewBox="0 0 12 12" />
        <span>{label}</span>
      </label>
      <style jsx>
        {`
       .icon-checkbox {
  display: inline-flex;
  align-items: center;
  

  &.icon-checkbox-disabled {
    opacity: 0.6
  }

  &:not(.icon-checkbox-disabled) {
    cursor: pointer
  }

  & span {
    white-space: nowrap;
    margin-left: 8px;
    color: var(--text-primary);
    font-size: 12px;
    font-weight: 500;
  }
}
          `}
      </style>
    </>
  );
}


