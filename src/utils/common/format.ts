/**
 * 数字格式化
 * @param {Number} n 待格式的数字
 * @param {Number} f 保留小数位数，0=不展示小数位，默认0
 */
export function format(digit: number | string, form: number = 0) {
  const n = Number(digit);

  if (!Number.isFinite(n)) return '';

  let num = `${n}`;
  let isNegativeNum = false;

  if (num[0] === '-') {
    isNegativeNum = true;
    num = num.substring(1, num.length);
  }

  const s = num.split('.');
  const zero = s[0]
    .split('')
    .reverse()
    .join('')
    .replace(/(\d{3})/g, $1 => $1 + ',')
    .replace(/\,$/, '')
    .split('')
    .reverse()
    .join('');
  const one = s[1] ? s[1] : 0;

  if (Number.isFinite(form)) {
    const ones = (one ? one + '000000000000000000000' : '000000000000000000000')
      .split('')
      .slice(0, Math.max(0, Math.min(Math.floor(form), 16)))
      .join('');
    s[1] = ones;

    if (isNegativeNum) {
      return form < 1 || form > 16 ? '-' + zero : '-' + zero + '.' + s[1];
    }
    return form < 1 || form > 16 ? zero : zero + '.' + s[1];
  } else {
    if (isNegativeNum) {
      return s[1] ? '-' + zero + '.' + s[1] : '-' + zero;
    }

    return s[1] ? zero + '.' + s[1] : zero;
  }
}

/**
 * 数字千位逗号分隔
 * 支持逗号和点（土耳其语言 千分位是通过的 .）
 * 其中 土耳其 小数点用逗号 千分位用句号
 * @param {Number | String} num
 * @param {Boole} isKeepDec 默认true；是否保留全部小数（已经通过cutFloatDecimal方法处理了精度的必须设置）；如果false采用toLocaleString根据语言决定保留小数位数，例如中文最大3位
 * @returns {String}
 */
export function numberToMoneyFormat(_num: string | number, locale = 'en-US', isKeepDec = true) {
  if (!_num) {
    return _num;
  }
  // 保留全部小数
  if (isKeepDec) {
    let num = _num + '';
    if (typeof _num === 'number') {
      num = numberToString(_num);
    }
    if (!num.includes('.')) {
      num += '.';
    }
    const value = num
      .replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
        return $1 + ',';
      })
      .replace(/\.$/, '');
    /** 如果是土耳其语言 则 把逗号替换成点 把 点 替换成 逗号 */
    if (locale === 'tr-TR') {
      return value.replace(/\./gi, 'k').replace(/,/gi, '.').replace('k', ',');
    }
    return value;
  }

  const numStr: string = numberToString(_num);
  return numStr.indexOf('.') !== -1
    ? Number(_num).toLocaleString()
    : numStr.replace(/(\d)(?=(?:\d{3})+$)/g, locale === 'tr-TR' ? '$1.' : '$1,');
}
/** 数字转字符串 */
export const numberToString = (_num: string | number) => {
  let num = Number(_num);
  let numStr = String(_num);

  if (Math.abs(num) < 1) {
    const e = parseInt(num.toString().split('e-')[1]);

    if (e) {
      const negative = num < 0;
      if (negative) num *= -1;
      num *= Math.pow(10, e - 1);
      const temp = Number(num.toFixed(e));
      numStr = '0.' + new Array(e).join('0') + temp.toString().substring(2);

      if (negative) {
        numStr = '-' + numStr;
      }
    }
  } else {
    let e = parseInt(num.toString().split('+')[1]);

    if (e > 20) {
      e -= 20;
      num /= Math.pow(10, e);
      numStr = num.toString() + new Array(e + 1).join('0');
    }
  }
  return numStr;
};

/** 截取位数 */
export const cutFloatDecimal = (_value: any, dec: number) => {
  const value = _value || 0;
  const regStr = `^(-?[0-9]+.[0-9]{${dec}})[0-9]*$`;
  const _dec = dec >= 0 && dec <= 100 ? dec : 0;
  if (value.toString().indexOf('e-') >= 0) {
    const str = numberToString(value).replace(new RegExp(regStr), '$1');
    const parts = str.split('.');
    let float = parts[1];
    if (float.length < _dec) {
      float += new Array(_dec - float.length).fill(0).join('');
      return parts[0] + '.' + float;
    }
    return str;
  } else {
    const str = value.toString().replace(new RegExp(regStr), '$1');
    return Number(str).toFixed(_dec);
  }
};

// 乘法
export function floatMultiply(arg1: any, arg2: any) {
  if (arg1 === null || arg2 === null) {
    return null;
  }
  let r1;
  let r2;
  // 小数位数
  try {
    r1 = arg1.toString().split('.')[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split('.')[1].length;
  } catch (e) {
    r2 = 0;
  }
  const n1 = Number(arg1.toString().replace('.', ''));
  const n2 = Number(arg2.toString().replace('.', ''));
  return (n1 * n2) / Math.pow(10, r1 + r2);
}
// 保留小数点
export const toFixedPro = (value: any, dec: any) => {
  if (dec >= 0) {
    return +value.toFixed(dec);
  } else {
    const pow = Math.pow(10, -1 * dec);

    return Math.floor(value / pow) * pow;
  }
};
export function textFormat(i: number) {
  return i > 9 ? i : '0' + i;
}

export function deadlineFormat(input: number | string) {
  const n = Number(input);
  if (!n) {
    return ['0', '00', '00', '00'];
  }

  const d = Math.floor(n / (24 * 60 * 60 * 1000));
  const h = Math.floor((n - d * 24 * 60 * 60 * 1000) / (60 * 60 * 1000));
  const m = Math.floor((n - d * 24 * 60 * 60 * 1000 - h * 60 * 60 * 1000) / (60 * 1000));
  const s = Math.floor((n - d * 24 * 60 * 60 * 1000 - h * 60 * 60 * 1000 - m * 60 * 1000) / 1000);
  return [d, textFormat(h), textFormat(m), textFormat(s)];
}

/**
 * 整数部分添加千分撇
 *
 * @param  {[type]} num [description]
 * @return {[type]}     [description]
 */
export function formatThousandth(item: number | string) {
  let num = `${item}`;
  let isNegativeNum = false;

  if (num[0] === '-') {
    isNegativeNum = true;
    num = num.substring(1, num.length);
  }

  const priceDecimalArr = num.split('.');
  const decimalPart = priceDecimalArr[0] || '';
  const floatPart = priceDecimalArr[1] || '';
  const parts = [];

  if (decimalPart) {
    let i = decimalPart.length;
    while (i > 0) {
      i -= 3;
      let item = '';

      if (i <= 0) {
        item = decimalPart.substring(0, i + 3);
      } else {
        item = decimalPart.substring(i, 3);
      }
      parts.unshift(item);
    }
  }

  const intResult = parts.join(',');

  if (floatPart) {
    if (isNegativeNum) {
      return `-${intResult}.${floatPart}`;
    }

    return `${intResult}.${floatPart}`;
  }

  if (isNegativeNum) {
    return `-${intResult}`;
  }

  return intResult;
}

// 取消科学计数法
export function toNonExponentialOld(num: number) {
  if (typeof num !== 'number') return num;
  const m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
  if (m) num.toFixed(Math.max(0, (m[1] || '').length - +m[2]));
  return num;
}
