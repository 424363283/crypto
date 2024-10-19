
export function getUpDownColor(
  /** 值 */
  value: any,
  /** 是否为? 🟩涨 🟥跌 */
  isGreenUpRedDown = true)
  /** 'green' | 'red' | '' */ {
  let colorIdx = -1;
  if (value > 0) colorIdx = 0;
  else if (value < 0) colorIdx = 1;

  let colors = ['green', 'red'];
  if (!isGreenUpRedDown) colors = colors.reverse();

  return colorIdx == -1 ? '' : colors[colorIdx];
}
