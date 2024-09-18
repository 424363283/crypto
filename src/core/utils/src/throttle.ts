export class Throttle {
    private prevDate: number = +new Date();
    private timer: any = null;
  
    constructor(private func?: Function, private wait = 500) {}
  
    public clean() {
      this.timer !== null && clearTimeout(this.timer);
      this.timer = null;
    }
  
    public run(func?: Function) {
      this.func = func ?? this.func;
      const newDate = +new Date();
      this.clean();
      if (newDate - this.prevDate > this.wait) {
        /* 距离上次执行时间大于等待时间 立即执行 */
        this.prevDate = newDate;
        this.func?.();
      } else {
        /* 距离上次执行时间小于等待时间 延迟执行 */
        this.timer = setTimeout(() => {
          this.prevDate = newDate;
          this.func?.();
        }, this.wait);
      }
    }
  }
  
  export const throttle = (func: Function, wait = 500) => {
    const t = new Throttle(func, wait);
    return t.run.bind(t);
  };
  