import { localStorageApi, LOCAL_KEY } from '@/core/store';
import { useEffect, useState } from 'react';

export const useLocalCountdown = (type: LOCAL_KEY, time = 90) => {
  const [countdown, setCountdown] = useState(time);
  const [isActive, setIsActive] = useState(false);

  const startCountdown = () => {
    setIsActive(true);
  };

  const resetCountdown = () => {
    setCountdown(time);
    setIsActive(false);
    localStorageApi.removeItem(type);
  };

  useEffect(() => {
    const localTime = Number(localStorageApi.getItem(type));
    if (localTime && localTime > 0 && localTime < time) {
      setCountdown(localTime);
      setIsActive(true);
    } else {
      localStorageApi.setItem(type, time);
    }
  }, []);

  useEffect(() => {
    let interval: any;
    if (isActive) {
      interval = setInterval(() => {
        setCountdown((countdown) => {
          const newCountdown = countdown - 1;
          localStorageApi.setItem(type, newCountdown);
          return newCountdown;
        });
      }, 1000);
    }

    if (countdown === 0) {
      clearInterval(interval);
      setIsActive(false);
      localStorageApi.removeItem(type);
      resetCountdown();
    }

    return () => clearInterval(interval);
  }, [isActive, countdown, type, time]);
  return { countdown, isActive, startCountdown, resetCountdown };
};
