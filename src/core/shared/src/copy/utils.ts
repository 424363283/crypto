import { LANG } from '@/core/i18n';
/**
 * ≥0 颜色：绿色 值：增加+
 * <0 颜色：红色 值：增加-
 */

export const CalibrateValue = (item: any, fixD?: number) => {
  if (!item)
    return {
      color: { color: 'var(--color-red)' },
      value: 0
    };
  const negative = (item + '').includes('-');
  const positive = (item + '').includes('+');
  const hasMark = negative || positive;
  let judgeValue = item;
  let gt = Number(item) > 0;
  let gt0 = Number(item) === 0;
  const formatValue = item && item.toFixed(fixD) || 0;

  judgeValue = `${gt ? `+${formatValue}` : gt0 ? formatValue : `-${formatValue}`}`;
  const formatColor = {
    color: gt || gt0 ? { color: 'var(--color-green)' } : { color: 'var(--color-red)' },
    value: hasMark ? formatValue : judgeValue
  };
  return formatColor;
};


export const findCommonIds = (array1 = [], array2 = [], key: string) => {
  const ids1 = new Set(array1.map(item => item[key]));
  return array2.filter(item => ids1.has(item[key]));
}


export const formatTimeDiff = (ms) => {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  const parts = [];
  if (days > 0) parts.push(`${days}${LANG('天')}`);
  if (hours > 0) parts.push(`${hours}${LANG('小时')}`);
  if (minutes > 0) parts.push(`${minutes}${LANG('分钟')}`);
  if (seconds > 0) parts.push(`${seconds}${LANG('秒')}`);
  return parts.join(' ') || `0${LANG('秒')}`;
}

export const findIndexOfMaxByKey = (jsonArray: any, key:string) => {
  if (!Array.isArray(jsonArray) || jsonArray.length === 0) return -1;
  
  let maxIndex = 0;
  let maxValue = jsonArray[0]?.[key];
  
  if (maxValue === undefined) return -1;
  
  for (let i = 1; i < jsonArray.length; i++) {
      const currentValue = jsonArray[i]?.[key];
      if (currentValue !== undefined && currentValue > maxValue) {
          maxValue = currentValue;
          maxIndex = i;
      }
  }
  
  return maxIndex;
}

// 是否所有的值 都相同
export const allKeysEqual = (arr:any)  => {
  if (arr.length === 0) return true;
  const firstKeys = arr[0];
  const firstKeysStr = JSON.stringify(firstKeys);
  for (let i = 1; i < arr.length; i++) {
    const currentKeysStr = JSON.stringify(arr[i]);
    if (currentKeysStr !== firstKeysStr) {
      return false;
    }
  }
  return true;
}

export const sortSwapList = (list: any[], topList: string[]) => {
  const sortedList = [...list];
  
  sortedList.sort((a, b) => {
    const aInTopList = topList.includes(a.name);
    const bInTopList = topList.includes(b.name);
    
    if (aInTopList && bInTopList) {
      return topList.indexOf(a.name) - topList.indexOf(b.name);
    }
    
    if (aInTopList) {
      return -1;
    }
    
    if (bInTopList) {
      return 1;
    }
    
    return a.name.localeCompare(b.name);
  });
  
  return sortedList;
}
