export function isNumber(num: number | string) {
  if (num === 0 || num === '0') {
    return true;
  }

  if (num && !Number.isNaN(+num)) {
    return true;
  }

  return false;
}
