// 定义一个装饰器，将请求数据的重复逻辑提取出来
export function fetchIfNotFetched(target: any, name: string, descriptor: PropertyDescriptor): any {
    const originalMethod = descriptor.value;
    let isFetching = false;
    let cachedData: any;
  
    descriptor.value = async function (...args: any[]) {
      const [forceFetch = false] = args;
      if (forceFetch) {
        // 如果强制刷新，则不使用缓存
        cachedData = undefined;
      }
  
      if (cachedData) {
        return cachedData;
      }
      if (isFetching) {
        return await Promise.resolve(cachedData);
      }
      isFetching = true;
      try {
        const result = await originalMethod.apply(this, args);
        cachedData = result;
  
        return result;
      } catch (e) {
      } finally {
        isFetching = false;
      }
    };
  
    return descriptor;
  }
  