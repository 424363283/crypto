// 可滚动容器,目前用户交易页面行情图heade描述
import { clsx } from '@/core/utils';
import React, { useEffect, useRef } from 'react';

interface ScrollXWrapProps {
  children: React.ReactNode;
  className?: string;
  height?: string | number;
  left?: string;
  right?: string;
  color?: string;
  prevIcon?: React.ReactNode;
  nextIcon?: React.ReactNode;
  prevNumber?: number;
  nextNumber?: number;
  nextWidth?: number;
  wrapClassName?: string;
}
export const ScrollXWrap = ({
  children,
  className,
  wrapClassName,
  height,
  left,
  right,
  color,
  prevIcon,
  nextIcon,
  prevNumber,
  nextNumber,
  nextWidth,
}: ScrollXWrapProps) => {
  const dom = useRef(null);
  const prev = useRef(null);
  const next = useRef(null);
  const handleScroll = () => {
    if (dom.current && prev.current && next.current && children) {
      const content = dom.current as HTMLElement;
      const _prev = prev.current as HTMLElement;
      const _next = next.current as HTMLElement;
      if (content.scrollWidth <= content.clientWidth) {
        _prev.style.display = 'none';
        _next.style.display = 'none';
      } else {
        if (content.scrollLeft === 0) {
          _prev.style.display = 'none';
        } else {
          _prev.style.display = 'flex';
        }
        if (content.scrollLeft + content.clientWidth === content.scrollWidth) {
          _next.style.display = 'none';
        } else {
          _next.style.display = 'flex';
        }
      }
      content.onscroll = (e) => {
        const scrollLeft = (e.target as HTMLElement).scrollLeft;
        const clientWidth = (e.target as HTMLElement).clientWidth;
        const scrollMax = scrollLeft + clientWidth;
        if (scrollLeft === 0) {
          _prev.style.display = 'none';
        } else {
          _prev.style.display = 'flex';
        }
        if (scrollMax + 1 >= content.scrollWidth) {
          _next.style.display = 'none';
        } else {
          _next.style.display = 'flex';
        }
      };
    }
  };

  useEffect(() => {
    if (prevNumber) {
      handlePrevClick();
    }
  }, [prevNumber]);

  useEffect(() => {
    if (nextNumber) {
      handleNextClick();
    }
  }, [nextNumber]);

  useEffect(() => {
    requestAnimationFrame(handleScroll);
  }, [dom.current, prev.current, next.current, children]);

  useEffect(() => {
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const handlePrevClick = () => {
    if (dom.current) {
      const content = dom.current as HTMLElement;
      const width = content.scrollLeft - (nextWidth || content.clientWidth / 2);
      content.scrollTo({
        left: width < 0 ? 0 : width,
        behavior: 'smooth',
      });
    }
  };

  const handleNextClick = () => {
    if (dom.current) {
      const content = dom.current as HTMLElement;
      const width = content.clientWidth / 2;
      content.scrollTo({
        left: content.scrollLeft + (nextWidth || width),
        behavior: 'smooth',
      });
    }
  };
  return (
    <>
      <div className={clsx('scroll-wrap', className)} style={{ height }}>
        <div className='prev' onClick={handlePrevClick} ref={prev}>
          {prevIcon ? (
            prevIcon
          ) : (
            <svg
              viewBox='64 64 896 896'
              focusable='false'
              data-icon='left'
              width='1em'
              height='1em'
              fill='currentColor'
              aria-hidden='true'
            >
              <path d='M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 000 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z'></path>
            </svg>
          )}
        </div>
        <div className={clsx(wrapClassName, 'scroll-current')} ref={dom}>
          {children}
        </div>
        <div className='next' ref={next} onClick={handleNextClick}>
          {nextIcon ? (
            nextIcon
          ) : (
            <svg
              viewBox='64 64 896 896'
              focusable='false'
              data-icon='right'
              width='1em'
              height='1em'
              fill='currentColor'
              aria-hidden='true'
            >
              <path d='M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z'></path>
            </svg>
          )}
        </div>
      </div>
      <style jsx>
        {`
          .scroll-wrap {
            flex: 1;
            overflow: auto;
            position: relative;
            white-space: nowrap;
            &::-webkit-scrollbar {
              width: 0; /* 设置滚动条宽度 */
            }
            &::-webkit-scrollbar-track {
              background-color: transparent; /* 设置滚动条背景颜色 */
            }
            &::-webkit-scrollbar-thumb {
              background-color: transparent; /* 设置滚动条滑块颜色 */
            }
            &::-webkit-scrollbar-thumb:hover {
              background-color: transparent; /* 设置鼠标悬停时滚动条滑块颜色 */
            }
            * {
              &::-webkit-scrollbar {
                width: 0; /* 设置滚动条宽度 */
              }
              &::-webkit-scrollbar-track {
                background-color: transparent; /* 设置滚动条背景颜色 */
              }
              &::-webkit-scrollbar-thumb {
                background-color: transparent; /* 设置滚动条滑块颜色 */
              }
              &::-webkit-scrollbar-thumb:hover {
                background-color: transparent; /* 设置鼠标悬停时滚动条滑块颜色 */
              }
            }
            &::-webkit-scrollbar {
              display: none;
            }
            .scroll-current {
              overflow: auto;
              &::-webkit-scrollbar {
                display: none;
              }
            }
            .prev {
              position: absolute;
              left: ${left || '20px'};
              top: 0;
              width: 20px;
              height: 100%;
              background-color: var(--theme-background-scroll-color);
              display: flex;
              justify-content: center;
              align-items: center;
              cursor: pointer;
              opacity: 0.7;
              display: none;
              color: ${color};
            }
            .next {
              position: absolute;
              right: ${right || '20px'};
              top: 0;
              width: 20px;
              height: 100%;
              background-color: var(--theme-background-scroll-color);
              display: flex;
              justify-content: center;
              align-items: center;
              cursor: pointer;
              opacity: 0.7;
              display: none;
              color: ${color};
            }
          }
        `}
      </style>
    </>
  );
};
