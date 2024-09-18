import { GroupItem } from '@/core/shared/src/group/item';
import * as Comlink from 'comlink';
import '../../prototype';

export interface WsWorkerApi {
  parse: (data: any) => any;
  mergeMarkets: (message: any, markets: any) => any;
  processSymbols: (data: any) => any;
}

const formatDefaultText = (text: any, online?: boolean): string => {
  if (!!text == false || ['undefined', 'null', 'NaN'].includes(text) || online === false) {
    return '--';
  }
  return String(text);
};
const calculateRate = (price: string | number, prevPrice: string | number): string => {
  const rate = price.sub(prevPrice).div(prevPrice).mul(100).toFixed(2);
  const prefix: string = +rate > 0 ? '+' : '';
  return prefix + rate;
};

const wsWorkerApi: WsWorkerApi = {
  parse: (data) => JSON.parse(data),
  mergeMarkets: (message = {}, markets) => {
    if (!message.data) return;
    const _data = message.data.split(';');
    const prevData: any = {};

    if (message.preData) {
      try {
        const _prevData = message.preData.split(';');
        _prevData.forEach((data: any) => {
          data = data.split(',');
          const id = data[0];
          const price = data[1];
          if (id && price) {
            prevData[id] = price;
          }
        });
      } catch {}
    }

    _data.forEach((data: any) => {
      data = data.split(',');
      const id = data[0] || '';
      const price = data[2] || '--';
      const prevPrice = prevData[id] || data[3] || '--';
      const isUp = Number(price) >= Number(prevPrice) ? 1 : 0;
      const volume = data[data.length - 1] || '--';
      const minPrice = data[data.length - 2] || '--';
      const maxPrice = data[data.length - 3] || '--';
      const item = markets[id];
      if (item && price !== '--') {
        item.isOpen = Date.now() > item.onlineTime;
        const isOpenData = (data: any) => formatDefaultText(data, item.isOpen);
        item.onLine = true;
        item.price = isOpenData(price.toFixed(item.digit));
        item.maxPrice = isOpenData(maxPrice.toFixed(item.digit));
        item.minPrice = isOpenData(minPrice.toFixed(item.digit));
        item.prevPrice = isOpenData(prevPrice.toFixed(item.digit));
        item.rate = isOpenData(calculateRate(price, prevPrice));
        item.volume = isOpenData(volume.toFixed());
        item.total = isOpenData(volume.mul(price).toFixed(item.digit));
        item.isUp = isUp == 1;
      }
    });
    return markets;
  },
  processSymbols: (data) => {
    const { lite_symbols = [], swap_testnet_symbols = [], spot_symbols = [], swap_symbols = [], spot_quote_domain = '', swap_quote_domain = '', swap_testnet = '', spot_units = [], spot_zones = [], swap_zones = [], new_symbols = [], hot_symbols = [] } = data;

    const getNewIds = [];
    const getHotIds = [];

    const spotQuoteCoinList = new Set();
    const swapQuoteCoinList = new Set();
    const liteQuoteCoinList = new Set();
    const swapSLQuoteCoinList = new Set();

    const spot_list = [];
    const swap_list = [];
    const lite_list = [];
    const swapSL_list = [];
    const swapIM_list = [];

    const getSpotIds = [];
    const getSwapIds = [];
    const getLiteIds = [];
    const getSwapSLIds = [];

    const priceDigit: any = {};
    const volumeDigit: any = {};

    // 新币
    for (const item of new_symbols) {
      for (const id of item?.list) {
        getNewIds.push(id?.toLocaleUpperCase());
      }
    }

    // 热门币
    for (const item of hot_symbols) {
      for (const id of item?.list) {
        getHotIds.push(id?.toLocaleUpperCase());
      }
    }

    // 简单合约
    for (const item of lite_symbols) {
      const { code, name, digit, zone, unit, type, copy, volumeScale: volDigit, onlineTime, fullname } = item as any;
      // TODO: 临时处理!! 简单合约计价单位USDT,后续如果存在 那么请增加，或者后续接口提供 baseCoin 和 quoteCoin
      const quoteCoin = 'USDT';
      const coin = code.replace(RegExp(`${quoteCoin}$`), '');
      liteQuoteCoinList.add(quoteCoin);
      lite_list.push(new GroupItem({ id: code, name, digit, volumeDigit: volDigit, coin, zone, unit, type, copy, onlineTime, fullname, symbolType: 'Lite' }));
      getLiteIds.push(code);
      priceDigit[code] = digit;
      volumeDigit[code] = volDigit;
    }

    // 现货合约
    for (const item of spot_symbols) {
      const { code, name, baseCoin, quoteCoin, digit, type, zone, unit, volumeScale: volDigit, onlineTime, fullname } = item as any;
      spotQuoteCoinList.add(quoteCoin);
      if (type === 'ETF') {
        let str = code.match(/\d+(L|S)_/)[0];
        // const coin = baseCoin.replace(/\d+(L|S)$/, '');
        let lever;
        let isBuy;
        if (str) {
          const _str = str.split('_')[0];
          lever = Number(_str.substring(0, 1));
          isBuy = _str.substring(1, 2) == 'L';
        }
        spot_list.push(new GroupItem({ id: code, name, digit, volumeDigit: volDigit, coin: baseCoin, quoteCoin, lever, isBuy, type, zone, unit, onlineTime, fullname, symbolType: 'Spot' }));
      } else {
        spot_list.push(new GroupItem({ id: code, name, digit, volumeDigit: volDigit, coin: baseCoin, quoteCoin, type, zone, unit, onlineTime, fullname, symbolType: 'Spot' }));
      }
      getSpotIds.push(code);
      priceDigit[code] = digit;
      volumeDigit[code] = volDigit;
    }

    //  永续合约
    for (const item of swap_symbols) {
      let { code, name, digit, volumeScale: volDigit, onlineTime, fullname } = item as any;
      code = code.toUpperCase();
      const [coin, quoteCoin] = code.split('-');
      swapQuoteCoinList.add(quoteCoin);
      swap_list.push(new GroupItem({ id: code, name, digit, volumeDigit: volDigit, coin, quoteCoin, onlineTime, fullname, symbolType: 'Swap' }));
      swapIM_list.push(new GroupItem({ id: 'i' + code, name, digit, volumeDigit: volDigit, coin, quoteCoin, onlineTime, fullname, symbolType: 'Swap' }));
      swapIM_list.push(new GroupItem({ id: 'm' + code, name, digit, volumeDigit: volDigit, coin, quoteCoin, onlineTime, fullname, symbolType: 'Swap' }));
      getSwapIds.push(code);
      priceDigit[code] = digit;
      volumeDigit[code] = volDigit;
    }

    // 永续模拟盘
    for (const item of swap_testnet_symbols) {
      let { code, name, digit, volumeScale: volDigit, onlineTime, fullname } = item as any;
      code = code.toUpperCase();
      const [coin, quoteCoin] = code.split('-');
      swapSLQuoteCoinList.add(quoteCoin);
      swapSL_list.push(new GroupItem({ id: code, name, digit, volumeDigit: volDigit, coin, quoteCoin, onlineTime, fullname, symbolType: 'Swap' }));
      getSwapSLIds.push(code);
      priceDigit[code] = digit;
      volumeDigit[code] = volDigit;
    }

    return {
      spot_list,
      swap_list,
      lite_list,
      swapSL_list,
      swapIM_list,
      spotQuoteCoinList,
      swapQuoteCoinList,
      liteQuoteCoinList,
      swapSLQuoteCoinList,
      getSpotIds,
      getSwapIds,
      getLiteIds,
      getSwapSLIds,
      getNewIds,
      getHotIds,
      spot_quote_domain,
      swap_quote_domain,
      swapSL_quote_domain: swap_testnet,
      spot_units,
      spot_zones,
      swap_zones,
      priceDigit,
      volumeDigit,
    };
  },
};

Comlink.expose(wsWorkerApi);
