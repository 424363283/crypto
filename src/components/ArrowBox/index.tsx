'use client';

import { memo, useEffect, useState, useRef, FC, CSSProperties, MouseEvent, ReactNode } from 'react';
import classnames from 'clsx';

import { useSize } from 'ahooks';
import isFunction from 'lodash/isFunction';

import YIcon from '@/components/YIcons';

interface ArrowBoxProps {
  iconContainerClassName?: string;
  iconContainerStyle?: CSSProperties;
  rightArrowIcon?: ReactNode;
  leftArrowIcon?: ReactNode;
  step: number;
  children: ReactNode;
}

enum ScrollDirection {
  Left,
  Right
}

const ArrowBox: FC<ArrowBoxProps> = ({
  iconContainerClassName,
  iconContainerStyle,
  children,
  rightArrowIcon,
  leftArrowIcon,
  step = 10
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollSize = useSize(scrollRef?.current);
  const [flag, setFlag] = useState(false);
  const [downX, setDownX] = useState(0);
  const [leftArrowVisible, setLeftArrowVisible] = useState(true);
  const [rightArrowVisible, setRightArrowVisible] = useState(true);

  const scroll = (dir: ScrollDirection) => {
    if (scrollRef.current) {
      let left = scrollRef.current.scrollLeft;
      if (dir === ScrollDirection.Left) {
        left -= step;
        left = Math.max(0, left);
      } else {
        const width = scrollRef.current.clientWidth;
        const totalWidth = scrollRef.current.scrollWidth;
        left += step;
        left = Math.min(totalWidth - width, left);
      }
      scrollRef.current.scrollTo({ left, behavior: 'smooth' });
      setTimeout(() => {
        handleArrowIconVisible();
      }, 300);
    }
  };

  const handleArrowIconVisible = () => {
    if (scrollRef.current) {
      const left = scrollRef.current?.scrollLeft ?? 0;
      const width = scrollRef.current?.clientWidth ?? 0;
      const totalWidth = scrollRef.current?.scrollWidth ?? 0;
      if (left > 0) {
        setLeftArrowVisible(true);
      } else {
        setLeftArrowVisible(false);
      }
      if (Math.round(left + width) + 2 < totalWidth && totalWidth > width) {
        setRightArrowVisible(true);
      } else {
        setRightArrowVisible(false);
      }
    }
  };

  useEffect(() => {
    handleArrowIconVisible();
  });

  useEffect(() => {
    if (scrollSize?.width) {
      handleArrowIconVisible();
    }
  }, [scrollSize?.width]);

  const handleMouseDown = (event: MouseEvent) => {
    setFlag(true);
    // 获取到点击的x下标
    setDownX(event.clientX);
  };

  const mousemove = (event: MouseEvent) => {
    if (flag) {
      // 判断是否是鼠标按下滚动元素区域
      // 获取移动的x轴
      const moveX = event.clientX;
      // 当前移动的x轴下标减去刚点击下去的x轴下标得到鼠标滑动距离
      const scrollX = moveX - downX;
      // 鼠标按下的滚动条偏移量减去当前鼠标的滑动距离
      const current = scrollRef.current?.scrollLeft || 0;
      if (scrollRef.current) {
        scrollRef.current.scrollLeft = current + scrollX;
      }
    }
  };

  const onMouseLeave = () => setFlag(false);

  return (
    <div className="arrow-box">
      {leftArrowVisible && (
        <div
          style={{ ...iconContainerStyle, left: 0 }}
          className={classnames('arrow-icon', iconContainerClassName)}
          onClick={() => {
            scroll(ScrollDirection.Left);
          }}
        >
          {leftArrowIcon ? (
            isFunction(leftArrowIcon) ? (
              leftArrowIcon()
            ) : (
                leftArrowIcon
              )
          ) : (
              <span>arrow Left</span>
              // <YIcon.ArrowBoxRightIcon className="arrow-icon-left" />
            )}
        </div>
      )}

      <div
        ref={scrollRef}
        className="scroll-wrapper"
        onMouseMove={mousemove}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseLeave}
        onMouseDown={handleMouseDown}
      >
        <div style={{ width: 'fit-content', whiteSpace: 'nowrap' }}>{children}</div>
      </div>
      {rightArrowVisible && (
        <div
          style={{ ...iconContainerStyle, right: 0 }}
          className={classnames('arrow-icon', iconContainerClassName)}
          onClick={() => {
            scroll(ScrollDirection.Right);
          }}
        >
          {rightArrowIcon ? (
            isFunction(rightArrowIcon) ? (
              rightArrowIcon()
            ) : (
                rightArrowIcon
              )
          ) : (
              <span>arrow Right</span>
              // <YIcon.ArrowBoxRightIcon className="arrow-icon-right" />
            )}
        </div>
      )}
    </div>
  );
};


<style jsx>
  {
    `
    .arrow-box {
      display: flex;
      align-items: center;
      position: relative;
      overflow: hidden;
      .arrow-icon {
        position: absolute;
        z-index: 100;
        top: 0;
        height: 100%;
        display: flex;
        align-items: center;
        cursor: pointer;
        background-color: var(--fill-page-primary);
        .arrow-icon-left,
        .arrow-icon-right {
          width: 22px;
          height: 22px;
          cursor: pointer;
          color: var(--text-text-secondary);
    
          &:hover {
            color: var(--theme, #FF8F34);
          }
        }
    
        .arrow-icon-right {
          transform: rotateY(180deg);
        }
      }
      .scroll-wrapper {
        overflow: hidden;
        box-sizing: border-box;
      }
    }
    `
  }
</style>






export default memo(ArrowBox);
