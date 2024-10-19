/**
 * isInt 是否为整数
 * @param {Number} num
 */
export function isInt(num: any) {
  return /^(?:[-+]?(?:0|[1-9][0-9]*))$/.test(num);
}
