import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { debounce } from '@/core/utils';

import { Svg } from '../svg';
import { clsx, styles } from './styled';

export const GradienScrollRow = ({ children, color }: { children: any, color?: string }) => {
  const ref = useRef<any>(null);
  const [button, setButton] = useState({ left: false, right: false });
  const _onScroll = useMemo(
      () =>
          debounce((event) => {
            const ele = event.target;
            const offsetWidth = ele.offsetWidth;
            const scrollWidth = ele.scrollWidth;
            const scrollMax = scrollWidth - offsetWidth; // 滚动最大值
            const scrollLeft = ele.scrollLeft; // 滚动值
            if (offsetWidth < scrollWidth) {
              // 可滚动
              if (scrollLeft === 0) {
                setButton({ left: false, right: true });
              } else if (scrollLeft >= scrollMax - 1) {
                setButton({ left: true, right: false });
              } else {
                setButton({ left: true, right: true });
              }
            } else {
              setButton({ left: false, right: false });
            }
          }, 30),
      []
  );

  useLayoutEffect(() => {
    ref.current && _onScroll({ target: ref.current });
  }, [ref.current, children]);

  const onLeftClick = useCallback(() => {
    const ele = ref.current;

    if (ele) {
      ele.scrollLeft -= 30;
    }
  }, []);

  const onRightClick = useCallback(() => {
    const ele = ref.current;

    if (ele) {
      ele.scrollLeft += 30;
    }
  }, []);

  return (
      <>
        <div className={clsx('gradien-scroll-row view')}>
          {button.left && (
              <div className={clsx('left')} onClick={onLeftClick}>
                <Svg src={'/static/images/common/arrow-right.svg'} />
              </div>
          )}
          <div ref={ref} className={clsx('scroll')} onScroll={_onScroll}>
            {children}
          </div>
          {button.right && (
              <div className={clsx('right')} onClick={onRightClick}>
                <Svg src={'/static/images/common/arrow-right.svg'} />
              </div>
          )}
        </div>
        {styles}
      <style jsx>{`
        .view {
          .left {
            background: linear-gradient(to right, ${ color ?? 'var(--fill_bg_1)' } 42.24%, transparent 95.69%);
          }
          .right {
            background: linear-gradient(to left, ${ color ?? 'var(--fill_bg_1)' } 42.24%, transparent 95.69%);
          }
        }
      `}</style>
      </>
  );
};

export default GradienScrollRow;
