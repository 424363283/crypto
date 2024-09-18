import { resso } from '@/core/store';

export const store = resso({
  hideBalance: false, // 隐藏余额
  selectedCoin: 'USD', // 选中的币种
});
