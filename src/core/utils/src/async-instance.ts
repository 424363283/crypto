class InstanceFactory {
    private instances: Map<Function | string, any> = new Map();
    private loading: Map<Function | string, boolean> = new Map();
    private queue: Map<Function | string, { resolve: (value: any | PromiseLike<any>) => void; reject?: (reason?: any) => void }[]> = new Map();
  
    public async getInstance<T>(callback: () => Promise<T>, subclass: Function | string): Promise<any> {
      let instance = this.instances.get(subclass);
      if (!instance) {
        if (!this.loading.get(subclass)) {
          this.loading.set(subclass, true);
          try {
            instance = await callback();
          } catch (e) {
            console.error('error', instance, e);
          }
          console.log('instance', instance);
          this.instances.set(subclass, instance);
          this.loading.set(subclass, false);
          const queue = this.queue.get(subclass) || [];
          for (const promise of queue) promise.resolve(instance);
          this.queue.set(subclass, []);
        } else {
          return new Promise<T>((resolve) => {
            const queue = this.queue.get(subclass) || [];
            queue.push({ resolve });
            this.queue.set(subclass, queue);
          });
        }
      }
      return instance;
    }
  }
  
  export const asyncFactory = new InstanceFactory();
  