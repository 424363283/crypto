import { getLastPathname, getUrlQueryParams } from '@/core/utils';

export const checkIsUsdtType = () => {
  const type = getUrlQueryParams('type');
  const pathname = getLastPathname();
  const isUsdtType = type?.includes('swap-u') || pathname?.includes('swap-u') || false; // 判断是否U 本位合约
  return isUsdtType;
};
