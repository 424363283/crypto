import { useCallback, useEffect, useRef, useState } from 'react';

interface DragXOptions {
  side?: 'to-right' | 'to-left';
  maxX?: number;
}

export function useDragX({ side, maxX }: DragXOptions) {
  const draggableRef = useRef(false);
  const moveStartPointRef = useRef(0);

  const [dragMoveX, setDragMoveX] = useState(0);
  const [dragStatus, setDragStatus] = useState<'init' | 'ing' | 'done'>('ing');

  const handleMouseDown = useCallback(ev => {
    draggableRef.current = true;
    moveStartPointRef.current = ev.pageX;
    setDragStatus('ing');
  }, []);

  const handleMouseMove = useCallback(
    ev => {
      if (draggableRef.current) {
        let moveX = ev.pageX - moveStartPointRef.current;
        switch (true) {
          case side === 'to-left':
            moveX = moveX < 0 ? moveX : 0;
            break;
          case side === 'to-right':
            moveX = moveX > 0 ? moveX : 0;
            break;
        }
        setDragMoveX(moveX);
        if (maxX && Math.abs(moveX) >= maxX) {
          setDragStatus('done');
          draggableRef.current = false;
        }
      }
    },
    [maxX, side]
  );

  const handleDragOver = useCallback(() => {
    if (draggableRef.current) {
      setTimeout(() => {
        if (maxX) {
          setDragMoveX(0);
          setDragStatus(dragMoveX >= maxX ? 'done' : 'init');
        } else {
          setDragStatus('done');
        }
      }, 0);
      draggableRef.current = false;
    }
  }, [dragMoveX, maxX]);

  useEffect(() => {
    setDragMoveX(0);
    setDragStatus('init');
  }, [side]);

  return {
    dragMoveX,
    dragStatus,
    handleMouseDown,
    handleMouseMove,
    handleDragOver,
    setDragStatus,
  };
}
