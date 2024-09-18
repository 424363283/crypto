const _pending = new Map();

export const cachePromise = async <T>(func: () => Promise<T>, { key, period = 1000 * 3600 * 24 }: { key?: any; period?: number } = {}) => {
  key = key || func;
  const data = _pending.get(key);
  const time = +new Date();

  if (data?.promise && time < data?.expired) return data.promise;

  const promise = func();
  _pending.set(key, { promise, expired: time + period });
  await promise;
  _pending.delete(key);

  return promise;
};
