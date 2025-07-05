export interface PollingOptions {
    interval: number;
    callback: Function;
  }
  
  interface PollingInterface extends PollingOptions {
    timer: ReturnType<typeof setTimeout> | null;
    once: boolean;
    start(): void;
    stop(): void;
  }
  
  class Polling implements PollingInterface {
    public interval: number;
    public callback: Function;
    public timer: ReturnType<typeof setTimeout> | null;
    public once: boolean = false;
  
    constructor(options: PollingOptions) {
      this.interval = options.interval;
      this.callback = options.callback;
      this.timer = null;
    }
    private loop() {
      if(this.once) {
        this.timer = setTimeout(async () => {
          try{
            await this.callback();

          } catch(err) {
            console.log(err);

          } finally {
            this.loop();
          }
        }, this.interval);
      }
    }
    // 开启
    public async start(): Promise<void> {
      if (!this.once) {
        this.once = true;
        try {
          await this.callback();

        } catch(err) {
          console.log(err);

        } finally {
          this.loop();
        }
      }
    }
  
    public stop = (): void => {
      this.once = false;
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
    };
  }
  
  export { Polling };
  
