import { LOCAL_KEY, localStorageApi } from '@/core/store';
import { Dispatch, SetStateAction, useCallback, useLayoutEffect, useRef, useState } from 'react';

/**
 *
 * @param key LOCAL_KEY
 * @param initialValue any initial value
 * @param useLatestValue 是否使用最新值，true的话，需要保证获取的值不直接用于DOM，而是等到useEffect执行完毕后再把值更新到DOM。否则会发生“水合”错误
 * @returns
 */
export const useLocalStorage = <T = {}>(key: LOCAL_KEY, initialValue: T, useLatestValue: boolean = false) => {
  const initializer = useRef((key: LOCAL_KEY) => {
    try {
      const localStorageValue = localStorageApi.getItem<T>(key);
      if (localStorageValue !== null) {
        return localStorageValue;
      } else {
        initialValue && localStorageApi.setItem(key, initialValue);
        return initialValue;
      }
    } catch (err) {
      console.error(err);
      return initialValue;
    }
  });
  const [state, setState] = useState<T | undefined>(useLatestValue ? () => initializer.current(key) : initialValue);

  useLayoutEffect(() => setState(initializer.current(key)), [key, JSON.stringify(initializer.current(key))]);

  const set: Dispatch<SetStateAction<T | undefined>> = useCallback(
    (valOrFunc) => {
      try {
        const newState = typeof valOrFunc === 'function' ? (valOrFunc as Function)(state) : valOrFunc;
        if (typeof newState === 'undefined') return;

        localStorageApi.setItem(key, newState);
        setState(newState);
      } catch {}
    },
    [key, setState, state]
  );
  return [state, set] as [T, (value: T) => void];
};
