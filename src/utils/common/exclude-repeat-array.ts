/**
 * 数组排重
 * @param key 根据key进行排重
 * @param ar  数组
 * @param time 如果重复，根据time进行保留最新
 */
export function excludeRepeatArray(key: string, ar: any[], time: string | Date | '') {
  const obj: { [key: string]: any } = {};
  const newArr: any[] = [];

  if (!key || !ar || !Array.isArray(ar)) {
    return newArr;
  }

  ar.forEach(item => {
    if (obj[item[key] as keyof typeof obj]) {
      // 如果重复，保留time最新的数据
      if (time && item[time as keyof typeof item] - obj[item[key] as keyof typeof obj][time as keyof typeof obj] >= 0) {
        obj[item[key]] = item;
      }
    } else {
      obj[item[key]] = item;
    }
  });

  for (const k in obj) {
    newArr.push(obj[k as keyof typeof obj]);
  }

  return newArr;
}
