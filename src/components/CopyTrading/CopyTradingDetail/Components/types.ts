export enum CopyTradeType {
  myFllow = '1', // 我的跟单
  traderDetail = '2', // 交易员详情
  myBring = '3' // 我的带单
}

export enum CopyTradeSetting {
  followDetial = '1', // 跟单详情
  futures = '2', // 合约跟单设置
  bringSetting = '3' // 带单设置
}

// 状态(0申请跟单，1跟单员移除跟随)
export enum FollowOptionStatus {
  apply = 0, // 申请跟单
  cancel = 1 // 跟单员移除跟随
}

// tab  跟单切换
export enum CopyTabActive {
  performance = 'performance', // 表现
  performanceData = 'performanceData', // 数据
  performanceChart = 'performanceChart', // 图表
  current = 'current', // 当前
  history = 'history', // 历史
  follower = 'follower', // 跟随
  sharingData = 'sharingData', // 分润
  followerSetting = 'followerSetting' // 跟单设置
}

//   合约类型 合约类型 1=币本位 2=U本位
export enum ContractType {
  spot = 1,
  swap = 2
}
