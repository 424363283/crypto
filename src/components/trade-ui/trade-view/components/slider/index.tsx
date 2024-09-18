import { useMemo, useRef, useState } from 'react';
import useScratch from 'react-use/lib/useScratch';

import { LANG } from '@/core/i18n';
import { clsx, styles } from './styled';
const Slider = ({
  percent,
  grid = 4,
  grids,
  disabled,
  onChange,
  className,
  itemClassName,
  isDark,
  renderText,
  renderDots,
  trackClassName,
  ...props
}: {
  percent?: any;
  grid?: any;
  grids?: any;
  disabled?: any;
  onChange?: any;
  className?: any;
  itemClassName?: any;
  isDark?: any;
  renderText?: any;
  renderDots?: any;
  trackClassName?: any;
  min?: any;
  max?: any;
}) => {
  const [ref, state] = useScratch();
  const [inputWidth, setInputWidth] = useState(0);
  const inputRef: any = useRef();
  const itemRef: any = useRef();
  const percentText = `${percent >= 100 ? 100 : parseInt(percent)}%`;

  const items = useMemo(
    () =>
      renderDots ? (
        renderDots({
          wrapperClassName: clsx('items'),
          itemClassName: clsx('item'),
          activeItemClassName: clsx('active'),
          firstRef: itemRef,
          grid,
        })
      ) : (
        <div className={clsx('items')}>
          <div ref={itemRef} className={clsx('item', 'active')} />
          {Array(grids?.length ? grids?.length - 1 : grid)
            .fill('')
            .map((v, i, arr) => {
              const step = 100?.div(arr?.length || 4);
              const left = i?.add(1)?.mul(step);
              const active = Number(percent) >= Number(left);

              return (
                <div
                  key={i}
                  style={{
                    left: i !== arr.length - 1 ? `${Math.min(Number(left), 100)}%` : 'unset',
                    right: i === arr.length - 1 ? '0' : '',
                  }}
                  className={clsx('item', itemClassName, active && 'active')}
                />
              );
            })}
        </div>
      ),
    [props.max, percent, renderDots, itemRef.current, grid]
  );

  /* percent text */
  const _isBeyondY = false; // !isBeyondY(state.y + state.dy, state.elH); // 是否超出y轴
  const showPercentText = state.isScratching && !_isBeyondY && state.x && disabled !== true;
  let tagLeft = 0;
  // 计算left
  if (showPercentText) {
    tagLeft = state.x ? state.x + (state?.dx || 0) : 0;
    const space = (itemRef.current.clientWidth / 8) * 7;
    const leftMin = 0 + space;
    const leftMax = (state?.elW || 0) - space;
    tagLeft = tagLeft < leftMin ? leftMin : tagLeft > leftMax ? leftMax : tagLeft;
  }

  /* events */
  const _onChange = (event: any, ...args: any) => {
    // 超出y轴 不执行
    !_isBeyondY && disabled !== true && onChange(event.target.value, event, ...args);
  };

  return (
    <>
      <div ref={ref} className={clsx('choose-rate', !isDark && 'light', className)}>
        <input
          aria-label={LANG('数量')}
          className={clsx('range-input', 'float')}
          style={{ width: inputRef.current?.clientWidth || 0 }}
          onChange={_onChange}
          {...props}
        />
        <div className={clsx('range-wrapper')}>
          <div style={{ left: tagLeft }} className={clsx('tag', showPercentText && 'show')}>
            <div className={clsx()}>{renderText ? renderText() : percentText}</div>
          </div>
          <div className={clsx('raise')} style={{ width: percentText }} />
          <div className={clsx('track', trackClassName)} />
          {items}
          <input
            aria-label={LANG('数量')}
            ref={inputRef}
            className={clsx('range-input')}
            onChange={_onChange}
            {...props}
          />
        </div>
      </div>
      {styles}
    </>
  );
};

export default Slider;
