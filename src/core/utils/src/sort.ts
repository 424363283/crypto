interface RankMap {
    [key: string]: number;
  }
  
  const RANK_MAP: RankMap = {
    BTC: 1,
    ETH: 2,
    BCH: 3,
    XRP: 4,
    DOT: 5,
    FIL: 6,
    UNI: 7,
    LINK: 8,
    DOGE: 9,
    SHIB: 10,
  };
  // 按照上述顺序排序
  function sortCoinBySpecificRank(a: string, b: string, rankMap: RankMap = RANK_MAP) {
    let aMatch = a;
    let bMatch = b;
    const separators = /[_-]/; // 匹配 _ 和 -
    if (a.match(separators)) aMatch = a.split(separators)[0];
    if (b.match(separators)) bMatch = b.split(separators)[0];
  
    if (!aMatch.match(/[A-Z]+/)) aMatch = a.slice(0, 3);
    if (!bMatch.match(/[A-Z]+/)) bMatch = b.slice(0, 3);
  
    const aRank = rankMap[aMatch.toUpperCase()];
    const bRank = rankMap[bMatch.toUpperCase()];
    if (aRank && bRank) return aRank - bRank;
    if (!aRank && !bRank) return 0;
    if (aRank) return -1;
    if (bRank) return 1;
    return 1;
  }
  export { sortCoinBySpecificRank };
  