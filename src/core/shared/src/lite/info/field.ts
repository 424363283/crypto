import { MyData, Store } from '@/core/store/src/resso';
type LocalStoreType = Store<{
  orderConfirm: {
    confirmPlace: boolean;
    confirmClose: boolean;
  },
  tradeSettings: {
    tp: number;
    sl: number;
    overnight: boolean,
    deferPref: boolean,
  }
}> & MyData;

export class InfoField {
  localStore: LocalStoreType = {} as LocalStoreType;

  getTradePreference() {
    return { ...this.localStore.orderConfirm, ...this.localStore.tradeSettings };
  }
  setTradePreference(data: any) {
    const {confirmPlace, confirmClose, ...tradeSettings} = data;
    this.localStore.orderConfirm = { ...this.localStore.orderConfirm, confirmPlace, confirmClose };
    this.localStore.tradeSettings = { ...this.localStore.tradeSettings, ...tradeSettings };
  }
}
