import { debounce } from '@/core/utils/src/debounce';
import { MediaInfo } from '@/core/utils/src/media-info';
import { useEffect, useState } from 'react';

/**
 * 请谨慎用于memo组件，貌似不会得到正确值
 * @param forceInitRender
 */
const useResponsive = (forceInitRender = true) => {
  const [isMobile, setIsMobile] = useState(forceInitRender);
  const [isTablet, setIsTablet] = useState(forceInitRender);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(forceInitRender);
  const [isDesktop, setIsDesktop] = useState(forceInitRender);
  const [isSmallDesktop, setIsSmallDesktop] = useState(forceInitRender);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const handleResize = (): void => {
      const { isMobile, isTablet, isMobileOrTablet, isDesktop, isSmallDesktop, windowWidth } = MediaInfo;
      setIsMobile(isMobile);
      setIsTablet(isTablet);
      setIsMobileOrTablet(isMobileOrTablet);
      setIsDesktop(isDesktop);
      setIsSmallDesktop(isSmallDesktop);
      setWidth(windowWidth);
    };
    handleResize();
    window.addEventListener('resize', debounce(handleResize, 300));
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return { isMobile, isTablet, isDesktop, isMobileOrTablet, windowWidth: width, isSmallDesktop };
};

//设置不同设备下的className
const useResponsiveClsx = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const setResponsiveClsx = (desktopClsName: string = '', tabletClsName: string = '', mobileClsName: string = '') => {
    if (isDesktop) {
      return desktopClsName;
    } else if (isTablet) {
      return tabletClsName;
    } else if (isMobile) {
      return mobileClsName;
    }
  };
  return {
    setResponsiveClsx
  };
};

const useWindowWidthByValue = ({ forceInitRender, width }: { forceInitRender?: boolean; width: number }) => {
  const [isMatch, setIsmatch] = useState(forceInitRender ?? true);

  useEffect(() => {
    const handleResize = (): void => {
      const _isMatch = MediaInfo.windowWidth ? MediaInfo.windowWidth >= width : false;
      setIsmatch(_isMatch);
    };
    handleResize();
    window.addEventListener('resize', debounce(handleResize, 300));
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [width]);
  return { isMatch };
};

export { useResponsive, useResponsiveClsx, useWindowWidthByValue };
