import { DEPTH } from '@/constants';

export function isEqualDigit(v: any, d: any) {
  if (!v && v !== 0) return false;
  if (!d && d !== 0) return false;
  const s = `${v}`.split('.')[1] || '';
  if (d - 1 >= 0 || d == 0) {
    if (s.length > 0 || v < d) {
      return false;
    } else {
      return true;
    }
  }
  if (s.length > DEPTH[d]) return false;
  return true;
}
