import { useEffect, useState } from 'react';

interface WindowSize {
  width: number;
  height: number;
  widthType: string;
  isMobile: boolean;
}

function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 0,
    height: 0,
    widthType: 'xl',
    isMobile: false
  });

  const matchWithType = (width: number) => {
    let text = '';
    if (width >= 1200) {
      text = 'xl'; //大电脑
    } else if (width >= 992 && width < 1200) {
      text = 'lg'; //中等电脑
    } else if (width >= 768 && width < 992) {
      text = 'sm'; //平板到电脑
    } else {
      text = 'xs'; //手机
    }
    return text;
  };

  useEffect(() => {
    if (typeof window === 'undefined') {
      return () => {};
    }

    const handler = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
        widthType: matchWithType(window.innerWidth),
        isMobile: window.innerWidth > 980 ? false : true
      });
    };
    handler();
    window?.addEventListener('resize', handler);
    return () => {
      window?.removeEventListener('resize', handler);
    };
  }, []);

  return windowSize;
}

export default useWindowSize;
