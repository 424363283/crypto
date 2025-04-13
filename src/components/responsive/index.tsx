import { useResponsive } from '@/core/hooks/src/use-responsive';
import React from 'react';

interface IProps {
  children: React.ReactNode | JSX.Element[];
  /**
   * 响应式时，尚未判断设备前，是否强制渲染组件，default: true;
   * false: 会等js判断用户设备再决定渲染哪个
   */
  forceInitRender?: boolean;
}
interface IResponsiveProps {
  breakpoint: 'desktop' | 'tablet' | 'mobile' | 'mobile-tablet' | 'desktop-tablet';
  children: React.ReactNode;
  forceInitRender?: boolean;
}

const Responsive: React.FC<IResponsiveProps> = ({ breakpoint, children, forceInitRender }) => {
  const { isDesktop, isTablet, isMobile, isMobileOrTablet } = useResponsive(forceInitRender);
  const newChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      const originalClassName = child.props.className || '';
      const newClassName = `${originalClassName} ${breakpoint}`;
      return React.cloneElement<any>(child, { className: newClassName });
    }
    return child;
  });
  const BREAK_POINTS_MAP = {
    desktop: isDesktop ? <>{newChildren}</> : null,
    tablet: isTablet ? <>{newChildren}</> : null,
    mobile: isMobile ? <>{newChildren}</> : null,
    'mobile-tablet': isMobileOrTablet ? <>{newChildren}</> : null,
    'desktop-tablet': isDesktop || isTablet ? <>{newChildren}</> : null,
  };
  return BREAK_POINTS_MAP[breakpoint];
};

const Desktop: React.FC<IProps> = ({ children, forceInitRender = true }: IProps) => {
  return (
    <Responsive breakpoint='desktop' forceInitRender={forceInitRender}>
      {children}
    </Responsive>
  );
};

const Tablet: React.FC<IProps> = ({ children, forceInitRender = true }: IProps) => {
  return (
    <Responsive breakpoint='tablet' forceInitRender={forceInitRender}>
      {children}
    </Responsive>
  );
};

const Mobile: React.FC<IProps> = ({ children, forceInitRender = true }: IProps) => {
  return (
    <Responsive breakpoint='mobile' forceInitRender={forceInitRender}>
      {children}
    </Responsive>
  );
};
// 手机或平板的情况下显示
const MobileOrTablet: React.FC<IProps> = ({ children, forceInitRender = true }: IProps) => {
  return (
    <Responsive breakpoint='mobile-tablet' forceInitRender={forceInitRender}>
      {children}
    </Responsive>
  );
};

// 桌面或平板的情况下显示
const DesktopOrTablet: React.FC<IProps> = ({ children, forceInitRender = true }: IProps) => {
  return (
    <Responsive breakpoint='desktop-tablet' forceInitRender={forceInitRender}>
      {children}
    </Responsive>
  );
};

export { Desktop, DesktopOrTablet, Mobile, MobileOrTablet, Tablet };
