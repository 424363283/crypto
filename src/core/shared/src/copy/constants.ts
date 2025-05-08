import { LANG } from '@/core/i18n';
// 过滤条件 filterInfo
export const FILTERINFO_DEFAULT = {
  selectDate: { label: LANG('{days}日', { days: 30 }), value: 30 },
  timeType: 30,
  // traderType: 3,
  hideTrader: false,
  contractInfo: '',
  followAssetMin: '',
  followAssetMax: '',
  traderAssetMin: '',
  traderAssetMax: '',
  profitAmount: '',
  profitRate: '',
  victoryRateMin: '',
  victoryRateMax: '',
  settledDays: '',
  userTag: '',
  page: 1,
  size: 6,
  sortType: '',
  nikeName: '',
  contractSetting:''
};

export  const AGREEMENT_LINK = {
  'zh':'https://support.y-mex.com/hc/zh-cn/articles/12269727256975-%E8%B7%9F%E5%8D%95%E6%9C%8D%E5%8A%A1%E5%8D%8F%E8%AE%AE',
  'en':'https://support.y-mex.com/hc/en-us/articles/12269727256975-Copy-Trading-Terms',
  'zh-tw':'https://support.y-mex.com/hc/zh-tw/articles/12269727256975-%E8%B7%9F%E5%96%AE%E6%9C%8D%E5%8B%99%E5%8D%94%E8%AD%B0'
}


export  const INTRODUTION_LINK= {
  'zh':'https://support.y-mex.com/hc/zh-cn/sections/12323184890639-%E8%B7%9F%E5%8D%95%E4%BA%A4%E6%98%93',
  'en':'https://support.y-mex.com/hc/en-us/sections/12323184890639-Copy-Trading',
  'zh-tw':'https://support.y-mex.com/hc/zh-tw/sections/12323184890639-%E8%B7%9F%E5%96%AE%E4%BA%A4%E6%98%93'
}

export  const APPLY_TRADER_LINK= {
  'zh':'https://support.y-mex.com/hc/zh-cn/articles/12434880368271-YMEX%E4%BA%A4%E6%98%93%E5%91%98%E5%8D%8F%E8%AE%AE',
  'en':'https://support.y-mex.com/hc/en-us/articles/12434920443279-YMEX-Trader-Agreement',
  'zh-tw':'https://support.y-mex.com/hc/zh-tw/articles/12434933041423-YMEX%E4%BA%A4%E6%98%93%E5%93%A1%E5%8D%94%E8%AD%B0'
}
