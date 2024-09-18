import EventEmitter from 'eventemitter3';

export const OrderBookEmitter = new (class extends EventEmitter {
  public ORDER_BOOK_ITEM_PRICE = 'ORDER_BOOK_ITEM_PRICE';
})();
