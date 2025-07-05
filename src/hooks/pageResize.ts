import { useCallback, useEffect, useState } from 'react';
import { useThrottle } from '@/hooks/throttle';

function getRightModuleWidth() {
  return window.innerWidth > 1920 ? 482 : 340;
}

export default function usePageSize(resizeHandler?: () => void) {
  const [pageWidth, setPageWidth] = useState(window.innerWidth);
  const [pageHeight, setPageHeight] = useState(window.innerHeight);
  const [rightModuleWidth, setRightModuleWidth] = useState(getRightModuleWidth());

  const handleSetWidth = useCallback(() => {
    if (typeof resizeHandler === 'function') {
      resizeHandler();
    }
    setPageWidth(window.innerWidth);
    setPageHeight(window.innerHeight);
    setRightModuleWidth(getRightModuleWidth());
  }, [resizeHandler]);

  const handleResize = useThrottle(handleSetWidth, 20);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  return { windowWidth: pageWidth, windowHeight: pageHeight, rightModuleWidth };
}
