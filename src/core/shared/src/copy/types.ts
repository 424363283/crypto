export interface USER_BENEFITS {
  profitAmount7: number; //收益额 7 天内
  profitRate7: number; // 收益率 7 天内
  profitAmount: number; // 收益额 当天的数据
}

// 搜索
export interface FILTER_INFO {
  selectDate: object; // 过滤时间类型 下拉框
  timeType: number; // 过滤时间类型(1(7日),2(30日)，3(90日),4(180日))
  traderType: number; // 交易员类型：1，初级2,中级，3高级，4资深
  hideTrader: boolean; // 隐藏满员的交易员：0，隐藏 1，不隐藏
  contractInfo: string[]; // 带单合约
  followAssetMin: any; // 交易员资产规模最小值
  followAssetMax: any; // 交易员资产规模最大值
  traderAssetMin: any; // 交易员资产规模最小值
  traderAssetMax: any; // 交易员资产规模最大值
  profitAmount: any; // 收益额
  profitRate: any; // 收益率
  victoryRateMin: any; //  最小胜率
  victoryRateMax: any; // 最大胜率
  settledDays: number; // 入驻天数
  userTag: string; // 交易员标签
  page: number; // 当前页码
  size: number; //每页数量
  sortType: string; // 排序类型(1(30日收益率),2(30日收益额),3(30日胜率)，4(带单规模),5(当前跟单人数))
  nikename: string; // 昵称
}
//带单交易员
export interface LEAD_TRADER {
  id: number;
  uid:string,
  name: string; //头像
  url: string; //昵称
  leverType: number; //战绩登录
  currentCount: number; //当前跟单人数
  totalCount: number; //跟单最大人数
  income: number; //近{days}日收益率
  win: number; //30日胜率
  amount: number;
  scale: number; //带单规模
  symbolList: string[]; //交易对列表
  wiRadio: number; //分润比例
  totalAssets: number; //资产规模
  registeredDays: number; // 入驻天数
  tradingDays: number; // 带单天数
  followers: number; // 当前跟单人数
  followersPnL: number; // 当前跟随者收益
  totalFollowers: number; // 累计跟单人数
  copytRatio: number; //收益率
  copyTotal: number; //收益额
  winRatio: number; //胜率
  profitTotal: number; //盈利总额
  lossTotal: number; //亏损总额
  // 盈亏比: profitTotal/lossTotal
  profitCount: number; // 盈利笔数
  lossCount: number; //亏损笔数
  tradeTimes: number; // 交易频率
  isChecked?: boolean; // 是否选择
}

// 带单数据
export interface BRING_DATA {
  profitAmount: number; // 收益额
  profitRate: number; // 收益率
  orderNumber: number; // 带单笔数
  profitOrderNumber: number; // 盈利笔数
  lossOrderNumber: number; // 亏损笔数
  victoryRate: number; // 胜率
  profitLossRate: number; // 盈亏比
  workDays: number; // 带单天数
  workRate: number; // 交易频率
  profitAmount7: number; // 收益额 7 天内
  profitRate7: number; // 收益率 7 天内
  profitLossRate7: number; // 盈亏比 7 天内
  victoryRate7: number; // 胜率 7 天内
  profitAmount30: number; // 收益额 30 天内
  profitRate30: number; // 收益率 30 天内
  profitLossRate30: number; // 盈亏比 30 天内
  victoryRate30: number; // 胜率 30 天内
  profitAmount90: number; // 收益额 90 天内
  profitRate90: number; // 盈亏比 90 天内
  victoryRate90: number; // 胜率 90 天内
  profitRate180: number; // 收益率 180 天内
  profitLossRate180: number; // 收益率 180 天内
  victoryRate180: number; // 胜率 180 天内
}
// 带单员总览
export interface OVERVIEW_DATA {
  workDays: number; // 从入驻开始 有交易的日期天数
  settledDays: number; // 从入驻开始到当前日期的天数
  currentFollowers: number; // 当前跟单人数
  totalFollowers: number; // 累计跟单人数
  maxCopyTraderCount: number; // 最大跟单人数
  userAmount: number; // 交易员带单资产
  profitRate: number; //总收益率
  settledTotalAmount: number; //带单规模
  settledTotalProfit: number; // 当前跟随者收益
  workRate: number; // 交易频率
  shareRoyaltyRatio: number; // 分润比例
}
// 跟随者
export interface FOLLOWERS_DATA {
  id: string;
  fUid: string; // 带单员id
  lUid: string; // 跟单员id
  contractInfo: string; // 带单合约列表
  followStatus: number; // 跟单状态：0跟单中，1跟单员移除跟随，2带单员移除跟随，3管理员移除跟随
  shareRoyaltyRatio: number; // 分润比例
  totalFollowers: number; // 累计跟单人数
  positionType: number; // 持仓类型(1,全仓,2,逐仓)
  leverageLevel: number; //杠杆倍数
  fixedQuota: number; //固定额度
  magnification: number; // 倍率
  maxPositionAmount: number; // 最大持仓金额
  totalPnl: number; // 总收益
  dayPnl: number; // 当日的收益
  totalMargin: number; // 总保证金
  nickName:string, // 昵称
}

// 品种偏好
export interface PREFERENCE_DATA {
  symbol: string; // 币种名称
  total: number; // 当前币种交易的次数
  current: number; // 所有币种交易的次数
}

// 带单设置
export interface BRING_SETING_DATA {
  contractInfo: string; // 带单币种
  shareStatus: number; // 带单状态：0关闭，1开启，2禁止带单
  shareRoyaltyRatio: number; // 分润比例
  maxCopyTraderCount: number; // 最大跟单人数
  copyMinAvailableMargin: number; // 跟单员最低可用保证金
  nickname: string; // 昵称
  description: string; // 带单备注
  contractList: Array<any>; // 合约列表
  status:number; // 昵称审核状态
}

// 跟单账户
export interface COPY_ACCOUNT_ASSET {
  totalPnl:number, //净收益
  dayPnl:number, //今日收益
  unrealisedPNL: number; // 未实现盈亏
  equity: number, // 保证余额
  availableBalance: number; //可用保证金
  accb: number; // 账户余额
  positionMargin: number; // 持仓保证金？保证金余额
  profitRate: number; // 收益率
  profitAmount: number; // 收益额
  totalCopyTradingProfit: number; // 跟单总收益
  totalTradePnl: number; // 跟单净收益收益
  unRealizedPnl: number; // 未实现盈亏
  positinMargin: number; // 持仓占用 [跟单占用]
}

// 不同用户选择不同类型账户下单
export enum UsingAccountType {
  ordinary = 0, // 普通用户 选择非跟单账户下单
  trader= 1, // 带单员下单 选择跟单账户下单
  follower = 2 // 跟单员下单 选择跟单账户下单
}