export class Debounce {
    private timer: any = null;
  
    constructor(private fn?: Function, private delay = 500) {}
  
    public run(func?: Function) {
      this.fn = func ?? this.fn;
      const args = arguments;
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.fn?.apply(null, args);
      }, this.delay);
    }
  }
  
  export const debounce = <T extends any[]>(fn: (...args: T) => any, delay: number = 500) => {
    let timerId: ReturnType<typeof setTimeout> | null;
    let isRunning = false;
  
    return async (...args: T) => {
      if (isRunning) return;
  
      if (timerId) {
        clearTimeout(timerId);
      }
  
      try {
        isRunning = true;
        const result = await fn(...args);
        return result;
      } finally {
        isRunning = false;
        timerId = null;
      }
    };
  };
  