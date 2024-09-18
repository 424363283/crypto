import EventEmitter from 'eventemitter3';

export const FavorEmitter = new (class extends EventEmitter {
  public Update = 'Update'; // 全屏
})();
