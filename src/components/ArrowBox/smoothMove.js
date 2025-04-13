import { useMemoizedFn, useSize } from 'ahooks';
import clsx from 'clsx';
import React, { useEffect, useState, useRef, useMemo } from 'react';
import Tooltip from 'antd/es/tooltip';
import './index.scss';

const ArrowBox = ({
  children,
  childrenId,
  rightArrowIcon,
  leftArrowIcon,
  tipContent,
  propsConfig,
  propsOnClick,
  step = 10
}) => {
  const scrollRef = useRef(null);
  const childrenRef = useRef(null);

  const scrollSize = useSize(scrollRef?.current);
  const childrenSize = useSize(childrenRef?.current);
  const [leftArrow, setLeftArrow] = useState(false);
  const [flag, setFlag] = useState(false);
  const [downX, setDownX] = useState(0);
  // const [scrollLeft, setScrollLeft] = useState(0);
  const [rightArrow, setRightArrow] = useState(false);
  const isNeedArrow = useMemo(() => {
    const contentWindow = document.getElementById(childrenId)?.clientWidth;
    if (childrenId) {
      return scrollSize?.width - contentWindow < 0;
    }
    return scrollSize?.width - childrenSize?.width < 0;
  }, [childrenSize?.width, scrollSize?.width]);
  const onXScroll = useMemoizedFn(dir => {
    const current = scrollRef.current.scrollLeft;
    if (dir === 'right') {
      scrollRef.current.scrollLeft = current + step;
    } else {
      scrollRef.current.scrollLeft = current - step;
    }
  });
  const tipHoverContent = () => {
    return (
      <div className={'tipExtend'}>
        {tipContent.map(item => {
          return (
            <div
              key={item.id}
              className={clsx(propsConfig.activeId == item.id && 'groupListActive')}
              onClick={() => {
                propsOnClick(item, 'tip');
                setRightArrow(false);
              }}
            >
              {item.name}
            </div>
          );
        })}
      </div>
    );
  };
  useEffect(() => {
    handleArrows(scrollRef);
  }, [isNeedArrow, scrollRef]);
  const handleArrows = useMemoizedFn(ref => {
    if (!ref.current) {
      return;
    }
    // const contentWindow = document.getElementById(childrenId)?.clientWidth;
    // const scrollLength = contentWindow - ref.current.scrollWidth;
    const scrollLength = ref.current.scrollWidth - ref.current.offsetWidth;
    if (scrollLength > 0) {
      setLeftArrow(ref.current.scrollLeft !== 0);
      setRightArrow(scrollLength - ref.current.scrollLeft > 20);
    }
  });
  const handleMouseDown = event => {
    setFlag(true);
    setDownX(event.clientX); // 获取到点击的x下标
    // setScrollLeft()
    // this.setState({
    //   flag: true,
    //   downX: event.clientX,
    //   scrollLeft: this.state.scrollLeft
    // });
    // downX = event.clientX;
    // scrollLeft = this.scrollLeft; // 获取当前元素滚动条的偏移量
  };
  const mousemove = event => {
    if (flag) {
      // 判断是否是鼠标按下滚动元素区域
      // 获取移动的x轴
      const moveX = event.clientX;
      // 当前移动的x轴下标减去刚点击下去的x轴下标得到鼠标滑动距离
      const scrollX = moveX - downX;
      // 鼠标按下的滚动条偏移量减去当前鼠标的滑动距离
      //   this.scrollLeft = scrollLeft - scrollX;
      console.log(66789, scrollX);
      const current = scrollRef.current.scrollLeft;
      scrollRef.current.scrollLeft = current + scrollX;
    }
  };
  const onMouseLeave = () => {
    setFlag(false);
  };
  return (
    <div className={'ArrowBox'}>
      <div className={clsx('arrowIcon')} onClick={() => onXScroll('left')}>
        {isNeedArrow &&
          leftArrow &&
          (leftArrowIcon ? (
            typeof leftArrowIcon === 'function' ? (
              leftArrowIcon()
            ) : (
              leftArrowIcon
            )
          ) : (
            <img
              src="/images/ArrowBox/new-right.svg"
              alt="arrow"
              // use="icon-jiantou"
              className={clsx('iconfont', 'icon-jiantou', 'left')}
              onClick={() => onXScroll('left')}
            />
          ))}
      </div>
      <div
        ref={scrollRef}
        className={'scrollWrapper'}
        onScroll={() => {
          handleArrows(scrollRef);
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={mousemove}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseLeave}
      >
        <div ref={childrenRef} className={'children'}>
          {children}
        </div>
      </div>
      <div className={'arrowIcon'} onClick={() => onXScroll('right')}>
        {isNeedArrow &&
          rightArrow &&
          (rightArrowIcon ? (
            typeof rightArrowIcon === 'function' ? (
              rightArrowIcon()
            ) : (
              rightArrowIcon
            )
          ) : (
            <>
              <img
                src={RightBtn}
                alt="arrow"
                // use="icon-jiantou"
                className={clsx('iconfont', 'icon-jiantou', 'right')}
                onClick={() => onXScroll('right')}
              />
            </>
          ))}
      </div>
      {isNeedArrow && !rightArrow && tipContent?.length > 0 && (
        <div className={clsx('arrowIcon', 'arrowIconBottom')}>
          <Tooltip
            interactive={true}
            placement={'bottom-end'}
            classes={{ tooltip: 'coinGrouptooltip' }}
            title={tipHoverContent()}
          >
            <img src={RightBtn} use="icon-jiantou" className={clsx('iconfont', 'icon-jiantou', 'bottom')} />
          </Tooltip>
        </div>
      )}
    </div>
  );
};

export default React.memo(ArrowBox);
