import AppInput, { DecimalInput } from '@/components/numeric-input';

import { useTheme } from '@/core/hooks';
import { useCallback, useMemo, useRef } from 'react';
import InputController from './controller';

import { clsx, styles } from './styled';

const Input = ({ inputComponent, className, label, controller = false, ...props }: any) => {
  const { isDark } = useTheme();
  const inputRef = useRef<any>({});
  const Comp = inputComponent || AppInput;
  const renderAdd = useCallback((props: any) => <InputController.Add {...props} />, []);
  const renderMinus = useCallback((props: any) => <InputController.Minus {...props} />, []);
  const prefix = useMemo(
    () =>
      label
        ? () => (
            <span className={clsx('label')} onClick={() => inputRef.current?.focus()}>
              {label}
            </span>
          )
        : undefined,
    [label]
  );

  return (
    <>
      <Comp
        inputRef={inputRef}
        type='number'
        className={clsx('trade-view-input', isDark ? 'dark' : 'light', className)}
        component={DecimalInput}
        controller={controller}
        renderAdd={renderAdd}
        renderMinus={renderMinus}
        controllerClassName={InputController.style}
        prefix={prefix}
        {...props}
      />
      {styles}
    </>
  );
};

export default Input;
