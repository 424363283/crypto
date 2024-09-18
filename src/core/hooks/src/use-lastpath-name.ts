import { useRouter } from '@/core/hooks';

// 去除id和query，取最后一个pathname
export const useLastPathname = <T extends string = string>(): T => {
  const router = useRouter();
  const parts = router?.pathname.split('/');
  let lastPart = parts[parts.length - 1];
  if (lastPart === '[id]') {
    lastPart = parts[parts.length - 2];
  }
  const queryIndex = lastPart.indexOf('?');
  if (queryIndex !== -1) {
    return lastPart.substring(0, queryIndex) as T;
  }
  return lastPart as T;
};
