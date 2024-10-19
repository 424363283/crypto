/**
 * isFloat 是否为浮点数
 * @param {Number} num
 */
export function isFloat(num: any) {
  if (num === '' || num === '.') {
    return false;
  }
  // /^(?:[-+]?(?:[0-9]+))?(?:\.[0-9]*)?(?:[eE][\+\-]?(?:[0-9]+))?$/
  return /^(?:[-+]?(?:[0-9]+))?(?:\.[0-9]*)?(?:[eE][\+\-]?(?:[0-9]+))?$/.test(num);
}
