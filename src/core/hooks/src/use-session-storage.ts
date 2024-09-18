import { SESSION_KEY, SessionStorageApi } from '@/core/store';
import { useEffect, useState } from 'react';

export const useSessionStorage = <T>(key: SESSION_KEY, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    const item = SessionStorageApi.get<T>(key);

    setStoredValue(item ? item : initialValue);
  }, []);

  return [
    storedValue,
    (value: T) => {
      setStoredValue(value);
      SessionStorageApi.set(key, value);
    },
  ] as [T, (value: T) => void];
};
