export enum CURRENT_VIEW {
    TABLE,
    FEEDS,
    ITB,
  }
  export enum CURRENT_TAB {
    FAVORITE = '1',
    SPOT_GOODS = '2',
    PERPETUAL = '3',
    LITE = '4',
    ETF = '5',
  }
  
  //自选二级菜单id
  export enum FAVORITE_OPTION_ID {
    SPOT = '1-1',
    SWAP_USDT = '1-2',
    SWAP_COIN = '1-3',
    LITE = '1-4',
    ETF = '1-5',
  }
  export const FAVORITE_TYPE: any = {
    '1-1': 'spot',
    '1-2': 'swap_usdt',
    '1-3': 'swap_coin',
    '1-4': 'lite',
    '1-5': 'etf',
  };
  export const FAVORITE_TYPE_NAME: { [key: string]: string } = {
    '1-1': 'Spot',
    '1-2': 'Perpetual',
    '1-3': 'Perpetual',
    '1-4': 'Lite',
    '1-5': 'ETF',
  };
  //现货二级菜单id
  export enum SPOT_GOODS_OPTION_ID {
    USDT = '2-1',
    USDC = '2-2',
    FIAT = '2-3',
  }
  //永续合约二级菜单id
  export enum PERPETUAL_OPTION_ID {
    SWAP_USDT = '3-1',
    SWAP_COIN = '3-2',
  }
  //简易合约二级菜单id
  export enum LITE_OPTION_ID {
    ALL = '4-1',
    MAIN_STREAM = '4-2',
    CREATIVE_AREA = '4-3',
    COPY_ORDER = '4-4',
  }
  //杠杆代币二级菜单id
  export enum ETF_OPTION_ID {
    USDT = '5-1',
  }
  