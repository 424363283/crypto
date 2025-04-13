/// <reference path="./prototype.d.ts" />
import BigNumber from 'bignumber.js';
import { BN } from './bn.conf';

declare global {
  interface Number {
    toFixed(digit?: number, roundingMode?: BigNumber.RoundingMode): string;
    toRound(digit?: number): string;
    toFormat(digit?: number): string;
    add(arg: number | string): string;
    sub(arg: number | string): string;
    mul(arg: number | string): string;
    div(arg: number | string): string;
    toFormatUnit(digit?: number): string;
  }
}


// 正确获取小数位数
Number.prototype.toFixed = function(digit?: number, roundingMode?: BigNumber.RoundingMode): string {
  if (isNaN(+this)) return '--';
  try {
    if (digit === undefined) {
      return new BN(+this).toFixed();
    } else {
      return new BN(+this).toFixed(digit, roundingMode ?? BN.ROUND_DOWN);
    }
  } catch {
    return this + '';
  }
};

// 四舍五入
Number.prototype.toRound = function(digit?: number): string {
  if (isNaN(+this)) return '--';
  try {
    if (digit === undefined) {
      return Math.round(+this).toFixed();
    } else {
      return (Math.round(+this * Math.pow(10, digit)) / Math.pow(10, digit)).toFixed(digit);
    }
  } catch {
    return this + '';
  }
};

// 格式化千分位
Number.prototype.toFormat = function(digit?: number): string {
  if (isNaN(+this)) return '--';
  try {
    if (digit === undefined) {
      return new BN(+this).toFormat();
    } else {
      return new BN(+this).toFormat(digit, 1);
    }
  } catch {
    if (digit === undefined) {
      return Number(this).toFixed();
    } else {
      return Number(this).toFixed(digit);
    }
  }
};

// 加法
Number.prototype.add = function(arg: number | string): string {
  if (isNaN(+this)) return '--';
  try {
    const a = new BN(+this);
    const b = new BN(arg);
    return a.plus(b).toNumber() + '';
  } catch {
    return Number(this) + Number(arg) + '';
  }
};

// 减法
Number.prototype.sub = function(arg: number | string): string {
  if (isNaN(+this)) return '--';
  try {
    const a = new BN(+this);
    const b = new BN(arg);
    return a.minus(b).toNumber() + '';
  } catch {
    return Number(this) - Number(arg) + '';
  }
};

// 乘法
Number.prototype.mul = function(arg: number | string): string {
  if (isNaN(+this)) return '--';
  try {
    const a = new BN(+this);
    const b = new BN(arg);
    return a.times(b).toNumber() + '';
  } catch {
    return Number(this) * Number(arg) + '';
  }
};

// 除法
Number.prototype.div = function(arg: number | string): string {
  if (isNaN(+this)) return '--';
  try {
    const a = new BN(+this);
    const b = new BN(arg);
    return a.div(b).toNumber() + '';
  } catch {
    return Number(this) / Number(arg) + '';
  }
};

// 格式化千分位&带单位
Number.prototype.toFormatUnit = function(digit?: number): string {
  if (isNaN(+this)) return '--';
  // 如果大于一百万 用M单位  || 千位符
  const trillion = 1000000000000;
  const billion = 1000000000;
  const million = 1000000;
  const thousand = 1000;
  if (+this > trillion) {
    return this.div(trillion).toFormat(2) + 'T';
  } else if (+this > billion) {
    return this.div(billion).toFormat(2) + 'B';
  } else if (+this > million) {
    return this.div(million).toFormat(2) + 'M';
  } else if (+this > thousand) {
    return this.div(thousand).toFormat(2) + 'K';
  } else {
    return this.toFormat(digit);
  }
};
