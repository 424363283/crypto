import { StoreApi, UseBoundStore, create } from 'zustand';

type kLineStore = {
  KineData: any;
  disableKlinePointEvent: any;
  OrderBookList: any;
};

const kLineStore: UseBoundStore<StoreApi<kLineStore>> = create(() => {
  return {
    OrderBookList: {},
    disableKlinePointEvent: false, //k线内拖拽快捷下单
    KineData: []
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
export function getKineState() {
  return kLineStore.getState();
}
