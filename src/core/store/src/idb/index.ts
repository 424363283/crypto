import { createStore, get, set } from 'idb-keyval';

export class IDB_STORE_KEYS {
  public static TRADE_SPOT_QUOTE_LIST: string = 'TRADE_SPOT_QUOTE_LIST_v1';
  public static HOME_BANNER_QUOTE_LIST: string = 'HOME_BANNER_QUOTE_LIST_v1';
  public static HOME_MAIN_QUOTE_LIST: string = 'HOME_MAIN_QUOTE_LIST_v1';
  public static GLOBAL_3001: string = 'GLOBAL_3001_v1';

  public static TRADE_ORDER_BOOK = (id: string): string => 'TRADE_ORDER_BOOK_' + id;
  public static TRADE_RECENTTRADES = (id: string): string => 'TRADE_RECENT_TRADES_' + id;
  public static K_LINE_CHART_HISTORY = (id: string, resolution: string): string => 'K_LINE_CHART_HISTORY_' + id + '_' + resolution;

  public static HOME_MARKETS_SWIPER_LIST = 'HOME_MARKETS_SWIPER_LIST';
  public static HOME_BANNER_LIST = 'HOME_BANNER_LIST'; // 首页banner轮播图
  public static FIAT_CRYPTO_PAYMENTS = 'FIAT_CRYPTO_PAYMENTS'; // 快捷买币市商
  public static MARKET_THIRD_CONFIG_OPTION = 'MARKET_THIRD_CONFIG_OPTION'; // 市场行情第三配置项
  public static MARKET_SECOND_CONFIG_OPTION = 'MARKET_SECOND_CONFIG_OPTION'; // 市场行情第2配置项
  public static MARKET_DETAIL_CMC_LIST = 'MARKET_DETAIL_CMC_LIST'; // 市场行情按钮

  public static MARKETS_DATA_SPOT_USDT_LIST = 'MARKETS_DATA_SPOT_USDT_LIST'; // 现货USDT交易对
  public static MARKETS_DATA_SPOT_USDC_LIST = 'MARKETS_DATA_SPOT_USDC_LIST'; // 现货usdc交易对
  public static MARKETS_DATA_SWAP_FEATURE_LIST = 'MARKETS_DATA_SWAP_FEATURE_LIST'; // 永续U本位
  public static MARKETS_DATA_SWAP_COIN_LIST = 'MARKETS_DATA_SWAP_COIN_LIST'; // 永续币本位
  public static MARKETS_DATA_ETF_LIST = 'MARKETS_DATA_ETF_LIST'; // 杠杆代币交易对
}

export class IDB {
  private static appName: string = process.env.NEXT_PUBLIC_APP_NAME!;
  private static version: string = '1.0.0';
  private static store = () => createStore(IDB.appName + IDB.version, 'store');

  public static set = <T>(key: string, value: T): Promise<void> => set(key, value, IDB.store());
  public static get = <T>(key: string): Promise<T | undefined> => get<T>(key, IDB.store());
}
