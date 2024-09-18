import { formatCoinName } from './helper';

export const hotList = ['BTC', 'ETH', 'XRP', 'DOT', 'LINK'];
const etfHotList = [
  'XRP3L',
  'XRP3S',
  'BTC3L',
  'BTC3S',
  'ETH3L',
  'ETH3S',
  'ADA3L',
  'ADA3S',
  'LINK3L',
  'LINK3S',
  'DOT3L',
  'DOT3S',
  'UNI3L',
  'UNI3S',
];
export interface Coin {
  coin: string;
}

const getName = (item: Coin) => {
  let name = formatCoinName(item.coin);
  if (name) {
    name = name.toUpperCase().replace(/-\w+/, '').replace(/3L|3S/g, '');
  }
  return name;
};
export const getEtfName = (item: Coin) => {
  let name = formatCoinName(item.coin);
  if (name) {
    name = name.toUpperCase().replace(/-\w+/, '');
  }
  return name;
};

export const sortCoinItem = (data: any[], isEtf: boolean): any[] => {
  const list1: Coin[] = [];
  const list2: Coin[] = [];
  const hotObject: any = {};
  const _hotList = isEtf ? etfHotList : hotList;
  _hotList.forEach((item, key) => {
    hotObject[item] = key;
  });

  data.forEach((item) => {
    if (item) {
      const name = isEtf ? getEtfName(item) : getName(item);
      if (_hotList.includes(name)) {
        list1.push(item);
      } else {
        list2.push(item);
      }
    }
  });

  list1.sort((a, b) => {
    const aName = isEtf ? getEtfName(a) : getName(a);
    const bName = isEtf ? getEtfName(b) : getName(b);
    let aIndex = _hotList.findIndex((name) => name === aName) + '1';
    let bIndex = _hotList.findIndex((name) => name === bName) + '1';

    if (a.coin.includes('3L')) aIndex.add(1);
    if (a.coin.includes('3S')) aIndex.add(2);
    if (b.coin.includes('3L')) bIndex.add(1);
    if (b.coin.includes('3S')) bIndex.add(2);

    return Number(aIndex) - Number(bIndex);
  });

  list2.sort((a, b) => a.coin.localeCompare(b.coin));

  return [...list1, ...list2];
};

// 排序函数
function customSpotCoinSort(a: any, b: any, sortOrder: string[]) {
  const indexA = sortOrder.indexOf(a.id);
  const indexB = sortOrder.indexOf(b.id);

  if (indexA !== -1 && indexB !== -1) {
    return indexA - indexB;
  } else if (indexA !== -1) {
    return -1;
  } else if (indexB !== -1) {
    return 1;
  } else {
    return a.id.localeCompare(b.id);
  }
}
export { customSpotCoinSort };
