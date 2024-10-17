import noop from 'lodash/noop';
import { Icon } from '@/components/YIcons';
import { ReactNode } from 'react';

const IconsMap = {
  checkboxChecked:
    '<path fill-rule="evenodd" clip-rule="evenodd" d="M2 4.77543C2 3.2692 3.22104 2.04816 4.72727 2.04816H11.2727C12.779 2.04816 14 3.2692 14 4.77543V11.3209C14 12.8271 12.779 14.0482 11.2727 14.0482H4.72727C3.22104 14.0482 2 12.8271 2 11.3209V4.77543ZM4.52875 8.65979C4.42224 8.55328 4.42224 8.3806 4.52875 8.27409L5.30014 7.5027C5.40664 7.3962 5.57933 7.3962 5.68583 7.5027L7.03576 8.85263L10.3142 5.57423C10.4207 5.46772 10.5934 5.46772 10.6999 5.57423L11.4713 6.34562C11.5778 6.45213 11.5778 6.62481 11.4713 6.73131L8 10.2026L7.22861 10.974C7.1221 11.0805 6.94942 11.0805 6.84292 10.974L6.07153 10.2026L4.52875 8.65979Z" fill="#FF8F34"/>',
  checkbox: '<rect x="2.52911" y="2.54816" width="11" height="11" rx="1.5" stroke="#9FA1A6"/>',
  checkboxLight: '<rect x="3.40796" y="2.54816" width="11" height="11" rx="1.5" stroke="#717171"/>'
};

function CheckIcon({ name, ...props }: { name: string;[key: string]: any }) {
  if (!IconsMap[name as keyof typeof IconsMap]) return null;

  return <Icon name={name} value={IconsMap[name as keyof typeof IconsMap]} size={20} {...props} />;
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
        <CheckIcon name={iconName} width="16" height="17" viewBox="0 0 16 17" />
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
    margin-left: 2px;
    color: var(--text-primary, #FFF);
    font-size: 12px;
    font-weight: 500;
  }
}
          `}
      </style>
    </>
  );
}


