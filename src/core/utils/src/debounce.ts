export class Debounce {
    private timer: any = null;
  
    constructor(private fn?: Function, private delay = 500) {}
  
    public run(func?: Function) {
      this.fn = func ?? this.fn;
      let args = arguments;
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.fn?.apply(null, args);
      }, this.delay);
    }
  }
  
  export const debounce = <T extends any[]>(fn: (...args: T) => void, delay: number = 500) => {
    let timerId: ReturnType<typeof setTimeout> | null;
  
    return (...args: T) => {
      if (timerId) {
        clearTimeout(timerId);
      }
  
      timerId = setTimeout(() => {
        fn(...args);
        timerId = null;
      }, delay);
    };
  };
  