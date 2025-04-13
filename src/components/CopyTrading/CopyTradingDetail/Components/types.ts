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
