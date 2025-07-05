import { LOCAL_KEY } from "@/core/store";
import { InfoField } from "./field";

export class Info extends InfoField {

  init({ resso }: any) {
    this.localStore = resso(
      {
        orderConfirm: {
          confirmPlace: true,
          confirmClose: true,
        },
        tradeSettings: {
          tp: 0,
          sl: 0,
          overnight: true,
          deferPref: true
        }
      },
      { nameSpace: LOCAL_KEY.SHARED_LITE_PREFERENCE_LOCAL }
    );
    this.localStore.initCache();
  }
}

export const infoInstance = new Info();
