/**
 * 按规则生成杠杆倍数列表
 * @param {Number} max
 * @param {Number} min
 * @param {Boolean} shouldShowName
 * @returns
 */
export const generateSliderMarks = (
  max: number,
  min: number,
  shouldShowName: boolean = true) => {

  const levelDivisorArr = [50, 40, 25, 20, 15, 10, 5, 2];
  // 如果（50, 40，25，20，15，10，5，2）作为判断都不满足，则仅取头尾作为点


  let count = 2;
  let divisor = max;
  levelDivisorArr.some(curDivisor => {
    // 200/50=4，可以整除，并且结果4>=4
    const curCount = max / curDivisor;
    if (curCount % 1 === 0 && curCount >= 4) {
      count = curCount;
      divisor = curDivisor;
      return true;
    }
    return false;
  });

  const marks: { [key: number]: string } = {};
  for (let i = 0; i <= count; i++) {
    const currentPoint = i * divisor || 1;
    marks[currentPoint] = shouldShowName ? `${currentPoint}x` : ' ';
  }
  marks[min] = shouldShowName ? `${min}x` : ' ';

  for (const i in marks) {
    if (+i > max) delete marks[i];
    if (+i < min) delete marks[i];
  }
  return marks;
};