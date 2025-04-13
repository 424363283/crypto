import {} from '@/core/api';
import { FilterField } from './field';
import { LANG } from '@/core/i18n';
export class Filter extends FilterField {
  init({ resso }: any) {
    this.store = resso(
      {
        leverFindData: {
          // 设置信息
          selectDate: { label: LANG('{days}日', { days: 7 }), value: 7 },
          timeType: 7,
          traderType: 3,
          hideTrader: true,
          contractInfo: '',
          followAssetMin: 0,
          followAssetMax: 99,
          traderAssetMin: 0,
          traderAssetMax: 99,
          profitAmount: 50,
          profitRate: 30,
          victoryRateMin: 2,
          victoryRateMax: 40,
          settledDays: 7,
          userTag: ''
        }
      },
      { auth: true, nameSpace: 'Copy' }
    );
    this.localStore = resso({}, { nameSpace: 'Copy' });
    this.store.initCache();
    this.localStore.initCache();
  }

  async fetchLeverageFind(usdt: boolean, code: string) {
    const id = code.toUpperCase();
  }
  getLeverFindData() {
    console.log(this.store, 'this.store.leverFindData;=====');
    return this.store.leverFindData;
  }
}

export const FilterInstance = new Filter();
