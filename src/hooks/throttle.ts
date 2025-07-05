import { useCallback, useRef } from 'react';

export function useThrottle(fn: Function, delay?: number) {
  const throttleRef = useRef<Function | null>(null);

  const throttle = useCallback((fn, delay = 60) => {
    let timer: undefined | NodeJS.Timer;
    let last: number;

    // @ts-ignore
    return function (...argv) {
      const now = performance.now();
      if (!last || last + delay <= now) {
        last = now;
        timer && clearTimeout(timer);
        // @ts-ignore
        fn.apply(this, argv);
      } else {
        timer && clearTimeout(timer);
        timer = setTimeout(() => {
          last = now;
          timer = undefined;
          // @ts-ignore
          fn.apply(this, argv);
        }, delay);
      }
    };
  }, []);

  return useCallback(
    (...argv) => {
      if (!throttleRef.current) {
        throttleRef.current = throttle(fn, delay);
      }

      if (typeof throttleRef.current === 'function') {
        throttleRef.current(...argv);
      }
    },
    [delay, fn, throttle]
  );
}
