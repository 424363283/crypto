import { Object } from '@/constants/gridType';

export default class XLocalStore {
  private globalStoreMap: Object | null = null;
  private readonly localKey: string = '';

  constructor(key: string) {
    this.localKey = key;
  }

  private initStore() {
    if (!this.globalStoreMap) {
      const localStoreStr = window.localStorage.getItem(this.localKey);
      this.globalStoreMap = localStoreStr ? JSON.parse(localStoreStr) : {};
    }
  }

  setStoreItem = (key: string, value: any) => {
    this.initStore();
    if (this.globalStoreMap) {
      this.globalStoreMap[key] = value;
      window.localStorage.setItem(this.localKey, JSON.stringify(this.globalStoreMap));
    }
  };

  getStoreItem = (key: string) => {
    this.initStore();
    // @ts-ignore
    return this.globalStoreMap[key];
  };

  rmStoreItem = (key: string) => {
    this.initStore();
    if (this.globalStoreMap && this.globalStoreMap[key]) {
      delete this.globalStoreMap[key];
      window.localStorage.setItem(this.localKey, JSON.stringify(this.globalStoreMap));
    }
  };
}
