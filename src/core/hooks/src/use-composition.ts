import React, { useEffect } from 'react';

type TInputElement = HTMLInputElement | HTMLTextAreaElement;

export interface CompositionsResult {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  onChange: (event: React.ChangeEvent<TInputElement>) => void;
  onComposition: (event: React.CompositionEvent<TInputElement>) => void;
}

function useCompositions(defaultValue: string, onInputCallback?: (value: string) => void): CompositionsResult {
  const [value, setValue] = React.useState<string>(defaultValue);
  const compositionLockRef = React.useRef<boolean>(false);

  const handleChange = (value: string) => {
    onInputCallback && onInputCallback(value);
  };

  const onChange = (event: React.ChangeEvent<TInputElement>) => {
    const newValue = event.target.value;
    setValue(newValue);
    if (compositionLockRef.current) return; // 允许输入中文时更新视图 value，但不触发数据逻辑
    handleChange(newValue);
  };

  const onComposition = (event: React.CompositionEvent<TInputElement>) => {
    if (event.type === 'compositionend') {
      compositionLockRef.current = false;
      handleChange(event.currentTarget.value);
    } else {
      compositionLockRef.current = true;
    }
  };
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  return {
    value,
    setValue,
    onChange,
    onComposition,
  };
}

export { useCompositions };
