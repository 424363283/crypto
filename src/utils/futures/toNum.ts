import { isNumber } from '@/utils/validator';

/** 下单区域数量/价格/百分比 值格式化 */
export function toNum(
  /** 值 event | value */
  value: any,
  /** 精度 */
  minLimit: number = 2
) {
  let v = String(value?.target?.value || value).replace(/-+/, '-');
  const s = v.charAt(0);
  v = v
    .replace(/[^\d\.\-]|\.(?=[^\.]*\.)/g, '')
    .replace(/^0+(?=\d)/, '')
    .replace(/^\./, '0.');

  if (isNumber(v)) {
    if (s === '-') v = s + v.slice(1);
    const d = v.split('.');
    if (d[0] && d[0].length > 7) {
      v = d[0].slice(0, 7);
    }
    if (d[1] && d[1].length > minLimit) {
      v = v.split('.')[0] + '.' + d[1].slice(0, minLimit);
    }
    return v;
  }
  return '';
}
