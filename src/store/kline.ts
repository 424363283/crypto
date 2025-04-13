import { StoreApi, UseBoundStore, create } from 'zustand';

type kLineStore = {
  KineData: any;
  disableKlinePointEvent: any;
  OrderBookList: any;
  isHoverTPSL:false;
  TpSlInfo:any;
  positionTpSLInfo:any

};

const kLineStore: UseBoundStore<StoreApi<kLineStore>> = create(() => {
  return {
    OrderBookList: {},
    disableKlinePointEvent: false, //k线内拖拽快捷下单
    isHoverTPSL:{
      
    },
    TpSlInfo:{

    },
    positionTpSLInfo:[], //当前币对的持仓止盈止损信息
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



export function getKineState() {
  return kLineStore.getState();
}
