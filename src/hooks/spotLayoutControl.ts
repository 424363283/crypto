import { useCallback, useEffect, useMemo, useState } from 'react';
import { getStoreItem, rmStoreItem, setStoreItem } from '@/utils/grid/tradeStore';
import { Object } from '@/constants/gridType';


const layoutStoreKey = 'trade.layout'; // 本地存储布局
const orderModuleSideKey = 'trade.orderModule.side'; // 本地存储 下单面板处于哪里

if (!getStoreItem('resetLayout_new')) {
  rmStoreItem(layoutStoreKey);
  rmStoreItem(orderModuleSideKey);

  setStoreItem('resetLayout_new', true);
}

const headerHeight = 48 + 56; // layout以上高度，头部 + symbolInfo
const footerHeight = 40; // layout以下高度

const minHistoryH = 6; // history最小高度
const maxHistory = 28; // history最大高度 显示 25 * 2 条数据

const initialHistoryH = 14; // history初始高度 13 * 48 - 4，数据条数 13 - 3

const initialFormH = 10; // 表单区初始高度 5 * 48 - 4

export const minWindowWidth = 100; // 页面最小宽度

export const orderModuleWidth =340; // 下单模块宽度

export const rowHeight = 44; // 1单位高度，实际为 44 + 4 = 48px

export const colCount = 20; // 宽度 12等分

export const marginWidth = 2; // 模块间隔

export const rightModuleWidth = orderModuleWidth + marginWidth; // 右侧整体宽度

export const modulePadding = 2; // 模块内padding，计算宽度值时要减去

const getDefaultLayout = () => {
  const rowRealHeight = rowHeight + marginWidth;
  let layoutInitHeight = window.innerHeight - headerHeight - footerHeight; // 窗口可用内初始可用layout高度

  let currentHistoryH = Math.round(layoutInitHeight / rowRealHeight - initialFormH);
  currentHistoryH = currentHistoryH < initialHistoryH ? initialHistoryH : currentHistoryH;
  // currentHistoryH = initialHistoryH;


  return [
    {
      i: 'chart',
      x: 0,
      y: 2,
      w: 14,
      h: currentHistoryH,
      minW: 10,
      minH: minHistoryH,
      maxH: maxHistory,
    },
    {
      i: 'history',
      x: 14,
      y: 2,
      w: 6,
      h: currentHistoryH,
      minW: 4,
      maxW: 8,
      minH: minHistoryH,
      maxH: maxHistory,
      // maxH: 20,

      // maxH: 1,

    },
    {
      i: 'form',
      x: 0,
      y: currentHistoryH,
      w: 20,
      h: initialFormH,
      minW: 16,
      minH: 5,
      maxH: 16,
    },
  ];
};

export const defaultOrderSide = 'right';

type DragStatus = 'init' | 'ing' | 'done';
type OrderSides = 'right' | 'left';

// 获取初始layout配置
export function getInitialLayoutConfig() {
  const storyStr = getStoreItem(layoutStoreKey);
  return storyStr ? storyStr : getDefaultLayout();
}

export function getOrderModuleSide() {
  return getStoreItem(orderModuleSideKey) || defaultOrderSide;
}

export function storeOrderModuleSide(side: OrderSides) {
  setStoreItem(orderModuleSideKey, side);
}

interface LayoutControlOptions {
  windowHeight: number;
  orderModuleDragStatus: DragStatus;
  setOrderModuleDragStatus: (status: DragStatus) => void;
  orderModuleSide: OrderSides;
  setOrderModuleSide: (side: OrderSides) => void;
}

export function useLayoutControl({
  windowHeight,
  orderModuleDragStatus,
  setOrderModuleDragStatus,
  orderModuleSide,
  setOrderModuleSide,
}: LayoutControlOptions) {
  const [layoutConfig, setLayoutConfig] = useState(() => getInitialLayoutConfig()); // grid布局配置
  const [layoutDone, setLayoutDone] = useState(false);

  const historyLayoutH = useMemo(() => {
    // @ts-ignore
    const historyLayout = layoutConfig.find((item: Object) => item.i === 'history');
    // @ts-ignore
    return historyLayout.h;
  }, [layoutConfig]);

  const layoutH = useMemo(() => {
    const rowRealHeight = rowHeight + marginWidth;
    let layoutInitHeight = window.innerHeight - headerHeight - footerHeight; // 窗口可用内初始可用layout高度

    // 计算layout配置内最大高度：y值最大的项 + 该项高度，y值最大项可能有多个，此时取各项的 y+h 最大值
    let layoutH = 0;

    if (layoutConfig) {
      const lowerItemsH: number[] = [];

      layoutConfig.forEach((item: Object) => {
        lowerItemsH.push(item.y + item.h);
      });
      layoutH = Math.max(...lowerItemsH);
    }
    const layoutHeight = layoutH * rowRealHeight + marginWidth;

    layoutInitHeight = Math.floor(layoutInitHeight / rowRealHeight) * rowRealHeight + marginWidth;

    return layoutInitHeight < layoutHeight ? layoutHeight : layoutInitHeight;
  }, [layoutConfig, windowHeight]);

  useEffect(() => {
    const storyStr = getStoreItem(layoutStoreKey);
    if (!storyStr) {
      handleLayoutChange(getDefaultLayout(), 'isAuto');
    }
  }, [windowHeight]);

  // layout变化、初始时也会触发
  const handleLayoutChange = useCallback(
    (layout: any, isAuto?: boolean | string) => {
      if (isAuto) {
        setLayoutConfig(layout);
      } else if (layoutDone) {
        setLayoutConfig(layout);
        setStoreItem(layoutStoreKey, layout);
      }
    },
    [layoutDone]
  );

  // 有拖拽行为触发
  const handleDropLayout = useCallback(() => {
    if (!layoutDone) {
      setLayoutDone(true);
    }
  }, [layoutDone]);


  const handleResetLayout = useCallback(async () => {
    try {
      console.log('Attempting to reset layout');
      
      // Reset layout configuration
      const defaultLayout = getDefaultLayout();
      setLayoutConfig(defaultLayout);
      
      // Reset order module side
      setOrderModuleSide(defaultOrderSide);
      
      // Remove stored items
      await Promise.all([
        rmStoreItem(layoutStoreKey),
        rmStoreItem(orderModuleSideKey)
      ]);
  
      console.log('Layout reset successfully');
    } catch (error) {
      console.error('Failed to reset layout:', error);
    }
  }, []);

  // 下单模块拖拽完成
  useEffect(() => {
    if (orderModuleDragStatus === 'done') {
      const newSide = orderModuleSide === 'right' ? 'left' : 'right';
      setOrderModuleSide(newSide);
      setOrderModuleDragStatus('init');
      storeOrderModuleSide(newSide);
    }
  }, [orderModuleSide, orderModuleDragStatus]);

  return {
    layoutConfig,
    setLayoutConfig,
    layoutH,
    historyLayoutH,
    orderModuleSide,
    layoutDone,
    handleLayoutChange,
    handleDropLayout,
    handleResetLayout,
  };
}

