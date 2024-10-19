import * as math from 'mathjs';
import { GlobalConfiguration } from '@/utils/index';
import { isInt, isNumber } from '@/utils/validator/index';
import { toNonExponentialOld } from '@/utils/common/format';

/**
 * 数字小数位截取
 * 精度以外全部舍弃
 * d -3,-2,-1,0,1,2,3,4
 */
export function digits(v: number | string, d: number = 0) {
  const num = Number(d);
  const a = ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'];

  if (!v && v !== 0) {
    if (!d) return v;
    a.length = num;
    return '0.' + a.join('');
  }

  if (num === 0 || !Number(num)) {
    return Math.floor(Number(v));
  }

  // 整数截取
  if (num <= 0) {
    const r = Math.floor(
      parseFloat(
        math
          .chain(Number(v))
          .multiply(math.bignumber(d).pow(10))
          .format({ notation: 'fixed' })
          .done()
      )
    );
    return math
      .chain(r)
      .divide(math.pow(10, math.bignumber(d)))
      .format({ notation: 'fixed' })
      .done();
  }

  const c = `${v}`.split('.');

  if (!c[1]) {
    c[1] = '';
  }

  if (c[1].length == num) {
    return v;
  }

  if (c[1].length < num) {
    a.length = num - c[1].length;
    return c[1] ? v + a.join('') : a.length ? v + '.' + a.join('') : v;
  }
  if (c[1].length > num) {
    return c[0] + '.' + c[1].split('').slice(0, num).join('');
  }

  return v;
}

/**
 * 精度截取，精度以外的值按照，0舍去，> 0 向上进一位
 * 12.10 -> 12.1
 * 12.11 -> 12.2
 * @param {Number} value
 * @param {Number} 位数
 */
export function digits2(v: number, d: number) {
  const num = Number(d);

  if (!v && v !== 0) {
    return digits(v, num);
  }

  if (!num || !Number(num)) {
    return Math.ceil(Number(v));
  }

  const s = Math.ceil(
    parseFloat(
      math
        .chain(math.bignumber(Number(v)))
        .multiply(math.pow(10, math.bignumber(num)))
        .format({ notation: 'fixed' })
        .done()
    )
  );
  const res = math
    .chain(math.bignumber(Number(s)))
    .divide(math.pow(10, math.bignumber(num)))
    .format({ notation: 'fixed' })
    .done();

  if (num <= 0) {
    return res;
  }

  return digits(parseFloat(res), num);
}

/**
 * 处理精度
 * 如果输入的数量的小数位个数 小于 digits，不处理
 * 如果输入的数量的小数位个数 大于 digits，按digits进行截位
 * @param {String} v v=number时，传入999. , 返回的数值会被忽略.
 * @param {Number} digits   -10,-1,1,2,3,4
 */
export function fixDigits(v: number, digits?: number) {
  if (!digits) {
    return v ? Math.floor(v) : v;
  }

  if (!v && v !== 0) return v;

  if (digits <= 0) {
    return Math.floor(v);
  }

  const string_v = `${v}`;
  const d = string_v.split('.');

  if (!d[1] || d[1].length <= digits) {
    return string_v;
  }

  return d[0] + '.' + d[1].split('').slice(0, digits).join('');
}

export function equalDigit(v: number, d: number) {
  if (!v && v !== 0) return false;
  if (!d && d !== 0) return false;
  let s: any = `${v}`.split('.');
  s = s[1] || '';
  if (d - 1 >= 0 || d == 0) {
    if (s.length > 0 || v < d) {
      return false;
    } else {
      return true;
    }
  }
  if (s.length > GlobalConfiguration['depth'][d as unknown as keyof typeof GlobalConfiguration.depth]) return false;
  return true;
}

// 是否为精度整倍数
// d  100，10，1，0.1，0.01，0.001
export function multipleDigit(v: number, d: number) {
  if (!v && v !== 0) return false;
  if (!d && d !== 0) return false;
  const r = math
    .chain(math.bignumber(v))
    .divide(d)
    .format({ notation: 'fixed' })
    .done();
  if (isInt(r)) {
    return false;
  }
  return true;
}

// 小数截取 非数字返回对应
export function substrDigit(value: string, digits: number = 0): string {
  if (isNumber(value)) {
    value = '' + toNonExponentialOld(Number(value));
    const matched = value.match(new RegExp(`^-?\\d{1,}.\\d{${digits}}`));

    if (matched) value = matched[0];
  } else value = '0';
  return Number(value).toFixed(digits);
}

/**
// substrDigit TEST
console.log(substrDigit('0.2343', 2));  // 0.23
console.log(substrDigit('-0.2343', 2)); // -0.23
console.log(substrDigit('-111110.233939393943', 2)); // -111110.23
console.log(substrDigit('1e9', 2));  // 1000000000.00
console.log(substrDigit('1e-9', 2)); // 0.00
console.log(substrDigit('300', 2)); // 300.00
*/
