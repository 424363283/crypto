import { RefObject, useCallback, useState } from 'react';

import { AddIcon } from './components/icon/add';
import { MinuIcon } from './components/icon/minus';

import { clsx } from './styled';

export const useFocus = () => {
  const [isFocus, setIsFocus] = useState(false);

  const onFocus = useCallback(() => {
    setIsFocus(true);
  }, []);

  const onBlur = useCallback(() => {
    setIsFocus(false);
  }, []);

  return { isFocus, onFocus, onBlur };
};

export const useButtonController = ({
  renderAdd,
  renderMinus,
  inputInstance,
  controllerReverse,
}: {
  renderAdd?: any;
  renderMinus?: any;
  inputInstance?: RefObject<{ handleMinus?: () => {}; handleAdd?: () => {}; handleClear?: () => {} }>;
  controllerReverse?: boolean;
}) => {
  const _renderAdd = () => {
    const onClick = _onAdd;

    return (
      renderAdd?.({ onClick }) || (
        <div onClick={onClick} className={clsx('add')}>
          <AddIcon
            className={clsx('btn')}
            src={'/static/images/common/numeric-input/add_1.svg'}
            width={18}
            height={18}
          />
        </div>
      )
    );
  };

  const _renderMinus = () => {
    const onClick = _onMinus;

    return (
      renderMinus?.({ onClick }) || (
        <div onClick={onClick} className={clsx('minus')}>
          <MinuIcon
            className={clsx('btn')}
            src={'/static/images/common/numeric-input/minus_1.svg'}
            width={18}
            height={18}
          />
        </div>
      )
    );
  };

  const _onMinus = () => {
    const instance = inputInstance?.current;

    if (!controllerReverse) {
      instance?.handleMinus?.();
    } else {
      instance?.handleAdd?.();
    }
  };

  const _onAdd = () => {
    const instance = inputInstance?.current;

    if (!controllerReverse) {
      instance?.handleAdd?.();
    } else {
      instance?.handleMinus?.();
    }
  };

  const _onClear = () => {
    const instance = inputInstance?.current;
    instance?.handleClear?.();
  };

  return {
    onAdd: _onAdd,
    onMinus: _onMinus,
    renderAdd: _renderAdd,
    renderMinus: _renderMinus,
    onClear: _onClear,
  };
};
