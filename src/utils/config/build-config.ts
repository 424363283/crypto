export function buildConfig(appConfig: any) {
  const {
    token = [],
    symbol = [],
    optionSymbol = [],
    futuresSymbol = [],
    marginSymbol = [],
  } = appConfig || {};

  const tokens = token.reduce((acc: any, cur: any) => {
    const token = { [cur.tokenId]: cur };

    if (cur.tokenId === 'USDT' && cur.chainTypes && cur.chainTypes.length) {
      token[cur.tokenId]['chainTypes'] = cur.chainTypes.sort((a: any, b: any) => {
        if (a.chainType === 'ERC20') {
          return -1;
        }
        if (b.chainType === 'ERC20') {
          return 1;
        }
        if (a.chainType === 'TRC20') {
          return -1;
        }
        if (b.chainType === 'TRC20') {
          return 1;
        }
        return a.chainType.toUpperCase() >= b.chainType.toUpperCase() ? 1 : -1;
      });
    }

    return {
      ...acc,
      ...token,
    };
  }, {});

  const symbols = symbol.reduce((acc: any, cur: any) => ({ ...acc, [cur.symbolId]: cur }), {});

  const symbolsMap = {
    coin: {},
    option: {},
    futures: {},
    lever: {},
    all: {},
  };

  symbol.forEach((item: any) => {
    (symbolsMap as any).coin[item.symbolId] = item;
    (symbolsMap as any).all[item.symbolId] = item;
  });

  optionSymbol.map((item: any) => {
    (symbolsMap as any).option[item.symbolId] = item;
    (symbolsMap as any).all[item.symbolId] = item;
  });

  futuresSymbol.forEach((item: any) => {
    (symbolsMap as any).futures[item.symbolId] = item;
    (symbolsMap as any).all[item.symbolId] = item;
  });

  marginSymbol.forEach((item: any) => {
    if (item.allowMargin) {
      (symbolsMap as any).lever[item.symbolId] = item;
      // 杠杆id与币币id相同，放入all，会覆盖币币的，杠杠币对不放入all
      //symbols_obj.all[item.symbolId] = item;
    }
  });

  return {
    tokens,
    symbols,
    symbolsMap,
  };
}
