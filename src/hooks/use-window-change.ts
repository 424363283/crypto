import { useEffect, useState } from 'react';

/**
 * 获取浏览器窗口大小
 */
export function useWindowChange() {
  const [isLayoutSwitch, setIsLayoutSwitch] = useState(false);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      const { innerWidth, innerHeight } = window;
      setWidth(innerWidth);
      setHeight(innerHeight);
      setIsLayoutSwitch(innerWidth <= 1100);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return {
    isMobile: (
      innerWidth <= 768 ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    ),
    isLayoutSwitch,
    width,
    height,
  };
}
