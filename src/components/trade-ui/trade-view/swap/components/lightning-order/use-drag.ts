import { LOCAL_KEY, resso, useResso } from '@/core/store';
import { isSwapDemo } from '@/core/utils';
import { useEffect, useLayoutEffect, useRef } from 'react';

const store = resso(
  {
    pos: { x: 0, y: 0 },
    dragging: false,
    rel: { x: 0, y: 0 }, // position relative to the cursor
  },

  { nameSpace: !isSwapDemo() ? LOCAL_KEY.TRADE_UI_SWAP_LIGHTNNG_ORDER : LOCAL_KEY.TRADE_UI_SWAP_DEMO_LIGHTNNG_ORDER }
);
export const useDrag = ({
  dragElement,
  topHeight = 0,
  bottomHeight = 0,
}: {
  dragElement?: any;
  topHeight?: any;
  bottomHeight?: any;
}) => {
  const ref = useRef<any>();
  const state = useResso(store);

  const getElementMax = () => {
    const eleHeight = dragElement?.clientHeight || 0;
    const eleWidht = dragElement?.clientWidth || 0;
    // const maxY = window.innerHeight - eleHeight;
    const maxY = window.document.body.scrollHeight - eleHeight - bottomHeight;
    const maxX = window.innerWidth - eleWidht - 1;
    return { maxY, maxX };
  };

  useLayoutEffect(() => {
    if (dragElement) {
      const { maxX, maxY } = getElementMax();
      if (state.pos.x === 0 && state.pos.y === 0) {
        state.pos = { y: 220, x: maxX - 750 };
      }
    }
  }, [dragElement]);

  // calculate relative position to the mouse and set dragging=true
  const onMouseDown = (e: any) => {
    // only left mouse button
    if (e.button !== 0) return;
    const mask = document.createElement('div');
    mask.style.cssText = 'position: absolute;top: 0;left: 0;width: 100vw;height: 100vh;z-index: 9999;';
    mask.setAttribute('id', 'swap-lightning-order-mousemoveMask');
    document.body.append(mask);

    var pos = ref.current.getBoundingClientRect();

    const rel = {
      x: e.pageX - pos.left,
      y: e.pageY - pos.top - window.document.documentElement.scrollTop,
    };
    // rel.x = initialPos.x;
    // rel.y = initialPos.y;
    state.dragging = true;
    state.rel = rel;
    // e.stopPropagation();
    // e.preventDefault();
  };
  const onMouseUp = (e: any) => {
    const mask = document.getElementById('swap-lightning-order-mousemoveMask');
    mask && mask.remove();
    state.dragging = false;
    // e.stopPropagation();
    // e.preventDefault();
  };
  const onMouseMove = (e: any) => {
    if (!state.dragging) return;

    const { maxX, maxY } = getElementMax();

    const pos = {
      x: e.pageX - state.rel.x,
      y: e.pageY - state.rel.y,
    };
    const min = topHeight;
    if (pos.x < 0) {
      pos.x = 0;
    } else if (pos.x > maxX) {
      pos.x = maxX;
    }
    if (pos.y < min) {
      pos.y = min;
    } else if (pos.y > maxY) {
      pos.y = maxY;
    }
    state.pos = pos;
    // e.stopPropagation();
    // e.preventDefault();
  };
  useEffect(() => {
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [state.dragging]);

  return { ref, state, onMouseDown, onMouseUp };
};
