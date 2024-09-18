import { Store } from '@/core/store/src/resso';
import { infoInstance as Info } from '../info';

type StoreType = Store<{
  data1050: { [key: string]: { currentPrice: number; indexPrice: number; fundRate: number } };
}>;

export class SocketField {
  // late
  store: StoreType = {} as StoreType;

  getData1050(id: string, { withHooks = true }: { withHooks?: boolean } = {}) {
    const code = id?.toUpperCase();
    return (withHooks ? this.store.data1050 : this.store.getSnapshot('data1050'))[code];
  }
  getFlagPrice(id: string, { withHooks = true }: { withHooks?: boolean } = {}) {
    const defaultPrice = Info.getCryptoData(id, { withHooks })?.flagPrice;
    let price = this.getData1050(id, { withHooks })?.currentPrice;
    if (price === undefined) {
      price = defaultPrice;
    }
    return price;
  }
  getIndexPirce(id: string, { withHooks = true }: { withHooks?: boolean } = {}) {
    const defaultPrice = Info.getCryptoData(id).indexPrice;
    let price = this.getData1050(id, { withHooks })?.indexPrice;
    if (price === undefined) {
      price = defaultPrice;
    }
    return price;
  }
}
