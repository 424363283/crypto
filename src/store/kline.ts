import { StoreApi, UseBoundStore, create } from 'zustand';

type kLineStore = {
  KineData: any;
  disableKlinePointEvent: any;
  OrderBookList: any;
  isHoverTPSL: any;
  TpSlInfo: any;
  positionTpSLInfo: any;
  dragOverlayData: any;
  isH5CreateAnOrder: boolean;
};

const kLineStore: UseBoundStore<StoreApi<kLineStore>> = create(() => {
  return {
    OrderBookList: {},
    disableKlinePointEvent: false, //k线内拖拽快捷下单
    isHoverTPSL: {},
    TpSlInfo: {},
    positionTpSLInfo: [], //当前币对的持仓止盈止损信息
    KineData: [],
    isH5CreateAnOrder: false,
    dragOverlayData: {}
  };
});

//设置拖拽方式
export function setDraggType(disableKlinePointEvent: boolean) {
  kLineStore.setState(state => ({
    ...state,
    disableKlinePointEvent
  }));
}
//设置当前盘口
export function setOrderBookList(OrderBookList: any) {
  kLineStore.setState(state => ({
    ...state,
    OrderBookList
  }));
}
//设置当前获取k线类型
export function setCurrentKlineType(currentKlineType: any) {
  kLineStore.setState(state => ({
    ...state,
    currentKlineType
  }));
}

//是否hover 持仓先
export function setPositionLineTpSl(isHoverTPSL: any) {
  kLineStore.setState(state => ({
    ...state,
    isHoverTPSL
  }));
}

//当前币对的持仓止盈止损信息
export function setPositionTpSlFun(positionTpSLInfo: any) {
  kLineStore.setState(state => ({
    ...state,
    positionTpSLInfo
  }));
}

//设置止盈止损的价格
export function setPositionTpSLInfoFun(TpSlInfo: any) {
  kLineStore.setState(state => ({
    ...state,
    TpSlInfo
  }));
}

//h5 模式点击打开下单
export function setIsH5CreateAnOrderFun(isH5CreateAnOrder: boolean) {
  kLineStore.setState(state => ({
    ...state,
    isH5CreateAnOrder
  }));
}





//设置十字线数据
export function setDragOverlayDataFun(dragOverlayData: any) {
  // const { x, y } = dragOverlayData;
  console.log(dragOverlayData)
  kLineStore.setState(state => ({
    ...state,
    dragOverlayData: {
      tag: dragOverlayData.tag,
      x: 60,
      y: dragOverlayData.y,
      tradeType: dragOverlayData.tradeType,
      volume: dragOverlayData.volume,
      price: dragOverlayData.price
    }
  }));
}


export function getKineState() {
  return kLineStore.getState();
}
