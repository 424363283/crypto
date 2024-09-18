import { Svg } from '@/components/svg';
import { clsx } from '@/core/utils';
import { useMemo, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

export const Item = ({
  item,
  i: id,
  onDragTop,
  onDragItem,
}: {
  i: any;
  item: any;
  onDragTop: any;
  onDragItem: any;
}) => {
  const ref = useRef(null);
  const [{ isDragging, handlerId }, connectDrag, preview] = useDrag({
    type: 'card',
    item: { id },
    collect: (monitor) => {
      const result = {
        handlerId: monitor.getHandlerId(),
        isDragging: monitor.isDragging(),
      };
      return result;
    },
  });
  const [{ canDrop, isOver }, connectDrop] = useDrop({
    accept: 'card',
    drop({ id: draggedId }: any) {
      if (draggedId !== id) {
        onDragItem(draggedId, id, item);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });
  connectDrag(ref);
  connectDrop(ref);
  const isActive = isOver;
  const opacity = isDragging || isActive ? 0.3 : 1;
  const containerStyle = useMemo(() => ({ opacity }), [opacity]);
  return (
    <>
      <div
        ref={preview}
        className={clsx('item', isActive && 'active')}
        style={containerStyle}
        data-handler-id={handlerId}
      >
        <div>{item}</div>
        <div onClick={() => onDragTop(item)}>
          <Svg src='/static/images/swap/fav/drag_top.svg' height={16} width={16} />
        </div>
        <div ref={ref}>
          <Svg src='/static/images/swap/fav/drag_action.svg' height={16} width={16} />
        </div>
      </div>
      <style jsx>
        {`
          .item {
            border-radius: 6px;
            padding: 0 15px;
            display: flex;
            align-items: center;
            height: 46px;
            border-bottom: 1px solid var(--theme-trade-border-color-1);

            > div {
              display: flex;
              align-items: center;
              font-size: 12px;
              color: var(--theme-trade-text-color-3);
              &:nth-child(1) {
                text-align: left;
                flex: 1.4;
              }
              &:nth-child(2) {
                cursor: pointer;
                justify-content: center;
                flex: 1;
              }
              &:nth-child(3) {
                justify-content: flex-end;
                flex: 1;
                cursor: pointer;
              }
            }
          }
          .item {
            border: 0;
            &.active {
              > div {
                &:nth-child(1) {
                  color: var(--skin-primary-color) !important;
                }
              }
            }
            > div {
              &:nth-child(1) {
                font-size: 14px;
                font-weight: 500;
                color: var(--theme-trade-text-color-1);
              }
            }
          }
        `}
      </style>
    </>
  );
};
