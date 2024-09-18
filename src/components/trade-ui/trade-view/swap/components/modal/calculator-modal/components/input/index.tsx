import AppInput, { DecimalInput } from '@/components/numeric-input';
import { useRef } from 'react';

import { useTheme } from '@/core/hooks';
import { clsx, styles } from './styled';

export * from './components/balance-input';
export * from './components/price-input';
export * from './components/rate-of-return-input';
export * from './components/volume-input';

const Index = ({
  className,
  label,
  suffix,
  onlyInput,
  ...props
}: {
  className?: string;
  label?: any;
  suffix?: any;
  onlyInput?: boolean;
}) => {
  const inputRef = useRef<any>({});
  const { isDark } = useTheme();
  const focusInput = () => inputRef.current?.focus();
  let inputs: any = {
    prefix: label
      ? () => (
          <div className={clsx('label')} onClick={focusInput}>
            {label}
          </div>
        )
      : undefined,
    suffix: () => suffix?.({ onClick: focusInput }),
  };

  if (onlyInput) {
    inputs = {};
  }
  return (
    <>
      <AppInput
        focusActive
        component={DecimalInput}
        className={clsx('input', !isDark && 'light', className)}
        inputRef={inputRef}
        {...inputs}
        {...props}
      />
      {styles}
    </>
  );
};

export default Index;
