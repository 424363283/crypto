/// <reference path="./prototype.d.ts" />
import { BN } from './bn.conf';

declare global {
  interface String {
    toFixed(digit?: number): string;
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
String.prototype.toFixed = function (digit?: number): string {
  if (isNaN(+this)) return '--';
  try {
    if (digit === undefined) {
      return new BN(+this).toFixed();
    } else {
      return new BN(+this).toFixed(digit, 1);
    }
  } catch {
    return this + '';
  }
};

String.prototype.toRound = function (digit?: number): string {
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
String.prototype.toFormat = function (digit?: number): string {
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
String.prototype.add = function (arg: number | string): string {
  if (isNaN(+this)) return '--';
  try {
    const a = new BN(+this);
    const b = new BN(arg);
    return a.plus(b).toNumber() + '';
  } catch {
    return Number(this) + Number(arg) + '';
  }
};

// @ts-ignore 减法
String.prototype.sub = function (arg: number | string): string {
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
String.prototype.mul = function (arg: number | string): string {
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
String.prototype.div = function (arg: number | string): string {
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
String.prototype.toFormatUnit = function (digit?: number): string {
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
