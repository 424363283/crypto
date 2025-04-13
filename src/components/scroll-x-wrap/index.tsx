// 可滚动容器,目前用户交易页面行情图heade描述
import { clsx } from '@/core/utils';
import React, { useEffect, useRef } from 'react';
import CommonIcon from '../common-icon';

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
            <CommonIcon name='common-scroll-x-prev-0' size={20} />
          )}
        </div>
        <div className={clsx(wrapClassName, 'scroll-current')} ref={dom}>
          {children}
        </div>
        <div className='next' ref={next} onClick={handleNextClick}>
          {nextIcon ? (
            nextIcon
          ) : (
            <CommonIcon name='common-scroll-x-next-0' size={20} />
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
              background-color: var(--bg-1);
              display: flex;
              justify-content: center;
              align-items: center;
              cursor: pointer;
              display: none;
              color: ${color};
            }
            .next {
              position: absolute;
              right: ${right || '20px'};
              top: 0;
              width: 20px;
              height: 100%;
              background-color: var(--bg-1);
              display: flex;
              justify-content: center;
              align-items: center;
              cursor: pointer;
              display: none;
              color: ${color};
            }
          }
        `}
      </style>
    </>
  );
};
