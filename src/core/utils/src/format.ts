// 格式化成交量
const formatVolume = (num: string) => {
  if (!num) return;
  const base = 1000000;
  if (Number(num) > base) {
    return num.div(base)?.toFormat(0) + 'M';
  } else {
    return num?.toFormat(0);
  }
};
/**
 * 将传入的字符串或数字值保留两位小数并返回一个数字。如果传入的是空字符串或者未定义的值，则返回数字0
 * @param value
 * @returns number
 */
function truncateToTwoDecimals(value: string | number): number {
  if (value === '' || !value) return 0;
  const truncated = Math.trunc(Number(value) * 100) / 100;
  const str = String(value);
  if (str.includes('.') && str.split('.')[1].length > 2) {
    return truncated;
  } else {
    return Number(truncated);
  }
}
// 相当于老代码的RESTRICT.float
function roundToNDigits(value: number | string, digits: number = 2): number {
  if (typeof value === 'number') {
    value = value.toString();
  }
  if (value === '') return 0;
  const [integer, decimal] = String(value).split('.');
  if (decimal !== undefined && decimal.length > digits) {
    const roundedDecimal = decimal.substr(0, digits);
    return Number(`${integer}.${roundedDecimal}`);
  } else {
    return Number(value);
  }
}
function formatDate(format: string, options: { date?: Date | number; isUTC?: boolean } = {}): string | null {
  let { date, isUTC } = options;

  /***新旧接口兼容 旧接口返回nunber类型 新接口返回string类型 string类型时间戳无法直接转化为时间对象 */
  date = Number(date) || date;
  /** */

  if (!format) return null;

  if (!date) {
    date = new Date();
  } else {
    date = new Date(date);
  }

  let y: string, m: string, d: string, h: string, i: string, s: string;

  if (isUTC) {
    y = date.getFullYear().toString();
    m = completeNum(date.getUTCMonth() + 1).toString();
    d = completeNum(date.getUTCDate()).toString();
    h = completeNum(date.getUTCHours()).toString();
    i = completeNum(date.getUTCMinutes()).toString();
    s = completeNum(date.getUTCSeconds()).toString();
  } else {
    y = date.getFullYear().toString();
    m = completeNum(date.getMonth() + 1).toString();
    d = completeNum(date.getDate()).toString();
    h = completeNum(date.getHours()).toString();
    i = completeNum(date.getMinutes()).toString();
    s = completeNum(date.getSeconds()).toString();
  }

  return format.replace('y', y).replace('m', m).replace('d', d).replace('h', h).replace('i', i).replace('s', s);
}

function completeNum(num: number): string {
  return num < 10 ? '0' + num : num.toString();
}
// 小数向上取精度 @param {boolean} isUp 是否向上取
function formatNumber2Ceil(v: any, fixed: number, isUp = true) {
  const x = Math.pow(10, fixed);
  const next = Number(Number(v).mul(x).toFixed(1));
  return Number((isUp ? Math.ceil : Math.floor)(next).div(x)) + 0 || 0;
}

const formatDefaultText = (text: any, online?: boolean): string => {
  if (!!text == false || ['undefined', 'null', 'NaN'].includes(text) || online === false) {
    return '--';
  }
  return String(text);
};

const Precision = 8;

// 计算结果处理
export const formatCalculationResult = (result: string | number) => {
  let next = Number(result);

  if (Number.isNaN(next)) {
    return 0;
  }
  return Number(next.toRound(Precision)) + 0; // + 0 解决 -0的情况
};

const FCR = formatCalculationResult;

/**
 * 将rgb字符串转成16进制的色值
 */
function formatRgbStringToHex(rgb: string): string {
  const [r, g, b] = rgb.split(',').map(Number);
  // 将数值转换为两位数的十六进制字符串
  const toHex = (n: number) => {
    const hex = n.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  // 使用toHex函数将r, g, b转换为十六进制，然后拼接起来
  return '#' + toHex(r) + toHex(g) + toHex(b);
}

export { FCR, completeNum, formatDate, formatDefaultText, formatNumber2Ceil, formatRgbStringToHex, formatVolume, roundToNDigits, truncateToTwoDecimals };
