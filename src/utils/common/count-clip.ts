import { format } from './format';

export function countClip(item: string | number) {
  const count = Number(item);
  let result = count;
  let unit = '';

  if (window.localStorage.lang === 'zh-cn') {
    if (count >= 10000 && count < 100000000) {
      result = Math.floor(count / 10000);
      unit = result === count / 10000 ? '万' : '万+';
    } else if (count >= 100000000 && count < 1000000000000) {
      result = Math.floor(count / 100000000);
      unit = result === count / 100000000 ? '亿' : '亿+';
    } else if (count >= 1000000000000) {
      result = Math.floor(count / 100000000);
      unit = '亿+';
    }
    return result + unit;
  } else {
    if (count >= 10000 && count < 1000000) {
      result = Math.floor(count / 1000);
      unit = result === count / 1000 ? 'k' : 'k+';
    } else if (count >= 1000000 && count < 1000000000) {
      result = Math.floor(count / 1000000);
      unit = result === count / 1000000 ? 'm' : 'm+';
    } else if (count >= 1000000000 && count < 1000000000000) {
      result = Math.floor(count / 1000000000);
      unit = result === count / 1000000000 ? 'b' : 'b+';
    } else if (count >= 1000000000000) {
      result = Math.floor(count / 1000000000);
      unit = 'b+';
    }
    return result + unit;
  }
}

export function countClipV2(item: number, d = 3) {
  const count = Number(item);
  let result = count;
  let unit = '';

  if (count >= 1000 && count < 1000000) {
    result = Number(format(count / 1000, d));
    unit = result === count / 1000 ? 'K' : 'K';
  } else if (count >= 1000000 && count < 1000000000) {
    result = Number(format(count / 1000000, d));
    unit = result === count / 1000000 ? 'M' : 'M';
  } else if (count >= 1000000000 && count < 1000000000000) {
    result = Number(format(count / 1000000000, d));
    unit = result === count / 1000000000 ? 'B' : 'B';
  } else if (count >= 1000000000000) {
    result = Number(format(count / 1000000000, d));
    unit = 'B';
  }

  return result + unit;
}
