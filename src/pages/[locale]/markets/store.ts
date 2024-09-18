import { resso } from '@/core/store';
import { CURRENT_TAB, CURRENT_VIEW } from './types';

export const store = resso({
  currentId: CURRENT_TAB.SPOT_GOODS,
  secondItem: { id: '2-1', name: 'USDT' },
  thirdItem: { id: '2-1-1', name: 'All' },
  currentView: CURRENT_VIEW.TABLE,
  searchValue: '',
  marketDetailList: {} as { [key: string]: any },
});
export { CURRENT_TAB, CURRENT_VIEW };
