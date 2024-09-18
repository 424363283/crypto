import { IDB } from '@/core/store';
import { useEffect, useState } from 'react';

export const useIndexedDB = <T>(key: string, initialValue: T, isSet: boolean = true) => {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    IDB.get<T>(key).then((value) => setStoredValue(value ? value : initialValue));
  }, []);

  return [
    storedValue,
    (value: T): void => {
      setStoredValue(value);
      if (isSet) IDB.set<T>(key, value);
    },
  ] as [T, (value: T) => void];
};
