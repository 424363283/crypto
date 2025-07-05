import XLocalStore from '@/utils/grid/localStore';
// import XLocalStore from '@/u/localStore';

const localKey = 'yemx.trade.stores';

const tradeStore = new XLocalStore(localKey);

export const setStoreItem = tradeStore.setStoreItem;
export const getStoreItem = tradeStore.getStoreItem;
export const rmStoreItem = tradeStore.rmStoreItem;
