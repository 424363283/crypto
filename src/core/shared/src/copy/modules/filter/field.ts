import { MyData, Store, authKeyIsMatch } from '@/core/store/src/resso';
import { POSITION_MODE, UNIT_MODE } from './constants';

type StoreType = Store<{
  leverFindData: { };
}> &
  MyData;
  type LocalStoreType = Store<{
    ff: {
    };
  }> &
    MyData;

export class FilterField {
  // late
  store: StoreType = {} as StoreType;
  localStore: LocalStoreType = {} as LocalStoreType;
  POSITION_MODE = POSITION_MODE;
  UNIT_MODE = UNIT_MODE;

}
