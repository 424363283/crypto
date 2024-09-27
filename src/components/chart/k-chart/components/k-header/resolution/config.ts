export type ResolutionType = {
    key: string; // 用于标记或者判断逻辑的值 例如Line 那么这次的行情图就是面积图
    value: string; // 用于显示的值
    resolution: string; // 用于请求的值
    active?: boolean; // 是否选中
    show?: boolean; // 是否显示
  };
  
  export const config = <ResolutionType[]>[
    {
      key: 'Line',
      value: 'Line',
      resolution: '1',
    },
    {
      key: '1m',
      value: '1m',
      resolution: '1',
    },
    {
      key: '3m',
      value: '3m',
      resolution: '3',
    },
    {
      key: '5m',
      value: '5m',
      resolution: '5',
    },
    {
      key: '15m',
      value: '15m',
      resolution: '15',
    },
    {
      key: '30m',
      value: '30m',
      resolution: '30',
    },
    {
      key: '1H',
      value: '1H',
      resolution: '60',
    },
    {
      key: '2H',
      value: '2H',
      resolution: '120',
    },
    {
      key: '4H',
      value: '4H',
      resolution: '240',
    },
    {
      key: '6H',
      value: '6H',
      resolution: '360',
    },
    {
      key: '12H',
      value: '12H',
      resolution: '720',
    },
    {
      key: '1D',
      value: '1D',
      resolution: '1D',
    },
    {
      key: '1W',
      value: '1W',
      resolution: '1W',
    },
    {
      key: '1M',
      value: '1M',
      resolution: '1M',
    },
  ];
  
  export const configFiatCrypto = <ResolutionType[]>[
    {
      key: 'Line',
      value: '1H',
      resolution: '60',
    },
  
    {
      key: 'Line',
      value: '1D',
      resolution: '1D',
    },
  
    {
      key: 'Line',
      value: '1M',
      resolution: '1M',
    },
  ];
  
  // 交易页面行情图的K线头部配置
  export class KlineHeaders {
    private static readonly cacheKey: string = 'CONFIG_KLINE_HEADERS';
  
    private static CONFIG_KLINE_HEADERS = <ResolutionType[]>[
      {
        key: 'Line',
        value: 'Line',
        resolution: '1',
        active: true,
        show: true,
      },
      {
        key: '1m',
        value: '1m',
        resolution: '1',
        active: false,
        show: true,
      },
      {
        key: '3m',
        value: '3m',
        resolution: '3',
        active: false,
        show: true,
      },
      {
        key: '5m',
        value: '5m',
        resolution: '5',
        active: false,
      },
      {
        key: '15m',
        value: '15m',
        resolution: '15',
        active: false,
        show: true,
      },
      {
        key: '30m',
        value: '30m',
        resolution: '30',
        active: false,
        show: true,
      },
      {
        key: '1H',
        value: '1H',
        resolution: '60',
        active: false,
        show: false,
      },
      {
        key: '2H',
        value: '2H',
        resolution: '120',
        active: false,
        show: false,
      },
      {
        key: '4H',
        value: '4H',
        resolution: '240',
        active: false,
        show: false,
      },
      {
        key: '6H',
        value: '6H',
        resolution: '360',
        active: false,
        show: false,
      },
      {
        key: '12H',
        value: '12H',
        resolution: '720',
        active: false,
        show: false,
      },
      {
        key: '1D',
        value: '1D',
        resolution: '1D',
        active: false,
        show: false,
      },
      {
        key: '1W',
        value: '1W',
        resolution: '1W',
        active: false,
        show: false,
      },
      {
        key: '1M',
        value: '1M',
        resolution: '1M',
        active: false,
        show: false,
      },
    ];
  
    // 设置只能选取最多5个
    public static count: number = 5;
  
    // 获取缓存的配置
    public static get getConfig() {
      try {
        const cacheConfig = localStorage.getItem(this.cacheKey);
        if (cacheConfig) {
          this.CONFIG_KLINE_HEADERS = JSON.parse(cacheConfig);
        }
        return this.CONFIG_KLINE_HEADERS;
      } catch (e) {
        return this.CONFIG_KLINE_HEADERS;
      }
    }
  
    // 获取配置的active
    public static get getActiveItem(): ResolutionType {
      return this.getConfig.find((v) => v.active) as ResolutionType;
    }
  
    // 设置缓存的active
    public static setActiveItem(item: ResolutionType) {
      try {
        const config = this.getConfig;
        config.forEach((v) => {
          v.active = v.key === item.key;
        });
        this.setConfig(config);
        localStorage.setItem(this.cacheKey, JSON.stringify(config));
      } catch (e) {
        // console.log(e);
      }
    }
  
    // 设置缓存的配置
    public static setConfig(item: ResolutionType | ResolutionType[]) {
      try {
        let config = this.getConfig;
        if (Array.isArray(item)) {
          item.forEach((v) => {
            const index = config.findIndex((item) => item.key === v.key);
            if (index !== -1) {
              config[index] = v;
            }
          });
        } else {
          const index = config.findIndex((v) => v.key === item.key);
          if (index !== -1) {
            config[index] = item;
          }
        }
        localStorage.setItem(this.cacheKey, JSON.stringify(config));
      } catch (e) {
        console.log(e);
      }
    }
  
    // 获取show为true的配置
    public static get getShowConfig() {
      return this.getConfig.filter((v) => v.show);
    }
  
    // 获取show为false的配置
    public static get getHideConfig() {
      return this.getConfig.filter((v) => !v.show);
    }
  }
  