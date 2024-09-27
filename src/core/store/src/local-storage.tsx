enum LOCAL_KEY {
    FAVORS_TOKEN = 'favors_token',
    SHARED_RECOMMENDED_FRIENDS = 'shared_recommended_friends',
    SHARED_SWAP_ORDER_LIST = 'shared_swap_order_list_v2',
    SHARED_SWAP_INFO = 'shared_swap_info',
    SHARED_SWAP_INFO_LOCAL = 'shared_swap_info_local',
    SHARED_SWAP_DEMO_ORDER_LIST = 'shared_swap_demo_order_list_v2',
    SHARED_SWAP_DEMO_INFO = 'shared_swap_demo_info',
    SHARED_SWAP_DEMO_INFO_LOCAL = 'shared_swap_demo_info_local',
    LOGIN_USER = 'login_user',
    INPUT_VERIFICATION_EMAIL = 'input_verification_email',
    INPUT_VERIFICATION_PHONE = 'input_verification_phone',
    INPUT_REGISTER_EMAIL = 'input_register_email',
    INPUT_REGISTER_PHONE = 'input_register_phone',
    PAGE_PUSH_STATE = 'page_push_state',
    TRADE_UI_NETWORK_INFO = 'trade_ui_network_info',
    TRADE_UI_SWAP_HEADER_ANNOUNCEMENT = 'trade_ui_swap_hedaer_announcement',
    TRADE_UI_SWAP_TRADE_GUIDE_BAR = 'trade-ui-swap-trade-guide-bar',
    TRADE_UI_SWAP_LIGHTNNG_ORDER = 'trade-ui-swap-lightning-order',
    TRADE_UI_SWAP_BOUNS_USE_MODAL = 'trade-ui-swap-bouns-use-modal',
    TRADE_UI_SWAP_DEMO_LIGHTNNG_ORDER = 'trade-ui-swap-demo-lightning-order',
    TRADE_UI_SWAP_DEMO_HEADER_ANNOUNCEMENT = 'trade_ui_swap_demo_hedaer_announcement',
    TRADE_UI_SWAP_DEMO_TRADE_GUIDE_BAR = 'trade-ui-swap-demo-trade-guide-bar',
  
    TRADE_UI_QUOTE_LIST_LIST = 'trade-ui/quote-list/components/list',
    SWAP_COMPONENTS_SORT_MODAL = 'swap_components_sort_modal',
    SWAP_DEMO_COMPONENTS_SORT_MODAL = 'swap_components_demo_sort_modal',
  
    HEADER_SWAP_DEMO_GUIDE = 'header-swap-demo-guide',
  
    TRADE_SPOT_TABS_1 = 'trade_spot_tabs_1',
    TRADE_SPOT_TABS_2 = 'trade_spot_tabs_2',
    /**
     * 缓存用户操作的汇率货币
     */
    RATE_DEFAULT_CURRENCY = 'RATE_DEFAULT_CURRENCY',
    // 缓存充币列表  历史币种
    HISTORY_COIN = 'history_coin',
    // 首次注册
    FIRST_REGISTER_MODAL_VISIBLE = 'first_register_modal_visible',
    // 主题
    THEME = 'theme',
    SPOT_ORDER_TYPE = 'spot_order_type',
    // countryCode
    COUNTRY_CODE = 'country_code',
    // 设置Header 主题
    HEADER_THEME = 'header_theme',
    CONFIG_KLINE_HEADERS = 'CONFIG_KLINE_HEADERS',
    // tradingview.current_theme.name
    TRADINGVIEW_CURRENT_THEME_NAME = 'tradingview.current_theme.name',
    // TIME_OFFSET_KEY
    TIME_OFFSET_KEY = 'time_offset_key',
    // 资产币种
    ASSETS_COIN_UNIT = 'assets_coin_unit',
    // 行情mini-chart
    MARKET_MINI_CHART_DATA = 'MARKET_MINI_CHART_DATA',
    // 是否使用黄色主题
    ENABLE_PRIMARY_HEADER = 'ENABLE_PRIMARY_HEADER',
    // 皮肤
    DATA_SKIN = 'data-skin',
    // 200美金kyc认证mask显示
    KYC_MASK_VISIBLE = 'kyc_mask_visible',
    // 网格复制数据
    COPY_DATA = 'copy_data',
    // 网格详情页——判断是否来自于网格持仓列表
    FROM_SPOT_TABLE = 'from_spot_table',
    // 网格详情页——判断是否来自于网格持仓列表
    COOKIE_MODAL_VISIBLE = 'cookie_modal_visible',
      // 设置皮肤色
  GLOBAL_SKIN = 'global_skin',

  ROOT_COLOR_INDEX = 'root-color-index-v1',

  }
  // 定义 LocalStorage API 类
  class LocalStorageApi {
    private storage: any;
  
    constructor() {
      if (typeof localStorage !== 'undefined') {
        this.storage = localStorage;
      }
    }
    private _stringifyValue = (value: any) => {
      try {
        value = JSON.stringify(value);
      } catch (e) {
        console.error(`setItem failed, value: ${value} is not serializable`);
      }
      return value;
    };
    // 将数据保存到本地存储
    public setItem<T>(key: LOCAL_KEY, value: T): void {
      const serializedData: string = typeof value === 'string' ? value : this._stringifyValue(value);
      this.storage?.setItem(key, serializedData);
    }
  
    // 从本地存储中获取数据
    public getItem<T>(key: LOCAL_KEY): T | null {
      const serializedData: string | null = this.storage?.getItem(key);
      if (!serializedData) {
        return null;
      }
      let data: T;
      try {
        data = JSON.parse(serializedData) as T;
      } catch (error) {
        data = serializedData as T;
      }
      return data;
    }
  
    // 从本地存储中删除指定的数据
    public removeItem(key: LOCAL_KEY): void {
      this.storage?.removeItem(key);
    }
  
    // 清空本地存储中的所有数据
    public clear(): void {
      this.storage.clear();
    }
  }
  
  // 使用示例
  const localStorageApi = new LocalStorageApi();
  
  export { LOCAL_KEY, localStorageApi };
  