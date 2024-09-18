import { createRef, useMemo } from 'react';

import { useButtonController, useFocus } from './hooks';

import CommonIcon from '../common-icon';
import { clsx, styles } from './styled';

export { DecimalInput } from './components/decimal-input';

/**
 * @prop {Ref} inputRef               input ref
 * @prop {Component} component        组件
 * @prop {boolean} controller         是否显示 + - 按钮
 * @prop {boolean} controllerReverse  + - 事件反转
 * @prop {function} renderAdd         渲染增加按钮
 * @prop {function} renderMinus       渲染减少按钮
 * @prop {function} prefix            前缀
 * @prop {function} suffix            后缀
 * @prop {string} className           classname
 * @prop {string} inputClassName      classname
 * @prop {string} controllerClassName classname
 * @prop {boolean} focusActive        聚焦样式
 */
export const NumericInput = ({
  inputRef,
  component,
  controller,
  controllerV2,
  controllerReverse,
  className,
  inputClassName,
  controllerClassName,
  prefix,
  suffix,
  placeholder,
  children,
  focusActive,
  renderAdd: propsRenderAdd,
  renderMinus: propsRenderMinus,
  clearable,
  disabled,
  fullWidth = true,
  ...props
}: {
  inputRef?: any;
  component?: any;
  controller?: any;
  controllerV2?: any;
  controllerReverse?: any;
  className?: any;
  inputClassName?: any;
  controllerClassName?: any;
  prefix?: any;
  suffix?: any;
  renderAdd?: any;
  renderMinus?: any;
  placeholder?: any;
  children?: any;
  focusActive?: any;
  onChange?: any;
  clearable?: any;
  disabled?: any;
  digit?: any;
  value?: any;
  type?: any;
  max?: any;
  min?: any;
  blankDisplayValue?: any;
  fullWidth?: boolean;
}) => {
  const { isFocus, onFocus: _onFocus, onBlur: _onBlur } = useFocus();
  const inputInstance = createRef<{ handleMinus?: () => {}; handleAdd?: () => {}; handleClear?: () => {} }>();
  const { renderAdd, renderMinus, onClear } = useButtonController({
    renderAdd: propsRenderAdd,
    renderMinus: propsRenderMinus,
    inputInstance,
    controllerReverse,
  });

  const Input = useMemo(() => component || 'input', [component]);
  const others: any = {};

  if (typeof Input !== 'string') {
    others.rootOnFocus = _onFocus;
    others.rootOnBlur = _onBlur;
    others.inputRef = inputRef;
    others.renderPlaceholder = <label>{placeholder}</label>;
  } else {
    others.ref = inputRef;
  }
  return (
    <>
      <div
        className={clsx(
          'components-numeric-input',
          focusActive && 'focus-active',
          focusActive && isFocus && 'focus',
          controllerV2 && 'text-center',
          fullWidth && 'full-width',
          className
        )}
      >
        {useMemo(() => (typeof prefix === 'function' ? prefix?.() : prefix), [prefix])}
        <Input
          myInputRef={inputInstance}
          className={clsx(inputClassName)}
          placeholder={placeholder}
          disabled={disabled}
          {...props}
          {...others}
        />
        {!disabled && !controller && clearable && <ClearButton onClick={onClear} />}
        {useMemo(() => (typeof suffix === 'function' ? suffix?.() : suffix), [suffix])}
        {controller && (
          <div className={clsx('controller', controllerClassName)}>
            {clearable && <ClearButton onClick={onClear} />}
            {renderAdd()}
            {renderMinus()}
          </div>
        )}
        {controllerV2 && (
          <div className={clsx('controller', 'v2', controllerClassName)}>
            {renderMinus()}
            {renderAdd()}
          </div>
        )}
        {children}
      </div>
      {styles}
    </>
  );
};
export const ClearButton = ({ onClick }: { onClick: any }) => (
  <div className={clsx('clear')} onClick={onClick}>
    <CommonIcon name='common-numeric_input_edit-0' size={16} enableSkin />
  </div>
);

export default NumericInput;
