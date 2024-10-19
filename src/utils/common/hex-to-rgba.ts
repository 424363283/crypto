/**
 * bex颜色转为rgba
 * @param String #ff00ff #f0f
 * @param Number a 0-1
 * @return String rgba(r,g,b,a)
 */
export function hexToRgba(hex: string, a: number) {
  const defaultColor = 'rgba(0,0,0,0)';
  if (!hex || hex.indexOf('#') === -1) {
    return defaultColor;
  }
  if (hex.length != 7 && hex.length != 4) {
    console.error(`${hex} is not hex color`);
    return defaultColor;
  }

  const s = hex.replace('#', '').match(/^(..?)(..?)(..?)/);

  if (!s || !s.length) {
    return defaultColor;
  }

  return `rgba(${parseInt('0x' + s[1] + (s[1].length == 1 ? s[1] : ''))},${parseInt(
    '0x' + s[2] + (s[2].length == 1 ? s[2] : '')
  )},${parseInt('0x' + s[3] + (s[3].length == 1 ? s[3] : ''))},${Number(a) || 1})`;
}
