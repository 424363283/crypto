export interface FAVORS_LIST {
    type: FAVORITE_TYPE;
    list: string[];
  }
  
  export enum FAVORITE_TYPE {
    SPOT = 'spot',
    LITE = 'lite',
    ETF = 'etf', // 杠杆代币和lvts
    SWAP_COIN = 'swap_coin',
    SWAP_USDT = 'swap_usdt',
    SWAP_COIN_TESTNET = 'swap_coin_testnet',
    SWAP_USDT_TESTNET = 'swap_usdt_testnet',
  }
  