import EventEmitter from 'eventemitter3';

export const SwapOrderEmitter = new (class extends EventEmitter {
  public SwapOrder = 'swap-order';
})();
