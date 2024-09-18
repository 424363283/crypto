import { resso } from '@/core/resso';
import { BarGraphDataItem, BarGraphDataType, BarGraphType, TradeListItem, TradeTab } from './types';

const _state = {
  /**
   * 今日佣金收入
   */
  todayIncome: 0,
  /**
   * 昨日佣金收入
   */
  yesterdayIncome: 0,
  /**
   * 总佣金收入
   */
  totalIncome: 0,
  /**
   * 总佣金收入
   */
  totalIncomeArray: [] as { currency: string; hcommissionValue: number }[],
  /**
   * 用户名
   */
  username: '',
  /**
   * 用户头像url
   */
  avatar: '',
  /**
   * uid
   */
  uid: '',
  /**
   * 邀请码
   */
  refer: '',
  /**
   * 总邀请人数
   */
  invites: 0,
  /**
   * 永续合约返佣比例
   */
  swapRatio: 0,
  /**
   * 现货合约返佣比例
   */
  spotRatio: 0,
  /**
   * 分享弹窗是否打开
   */
  shareModalOpen: false,
  /**
   * 余额对象
   */
  balanceMap: new Map(),
  /**
   * 可划转余额对象
   */
  withdrawableBalanceMap: new Map(),
  /**
   * 柱状图币种
   */
  barGraphCurrency: 'USDT',
  /**
   * 柱状图日期选择范围
   */
  barGraphDateRangeValue: 7,
  /**
   * 柱状图数据类型
   */
  barGraphType: BarGraphType.Invite,
  /**
   * 柱状图日期选择——起始日期
   */
  barGraphDateRangeStart: null as string | null,
  /**
   * 柱状图日期选择——终止日期
   */
  barGraphDateRangeEnd: null as string | null,
  /**
   * 柱状图数据
   */
  barGraphData: [] as BarGraphDataItem[],
  /**
   * 柱状图直属类型统计
   */
  barGraphDirectSum: 0,
  /**
   * 柱状图团队类型统计
   */
  barGraphAllSum: 0,
  /**
   * 交易 Tab value
   */
  tradeTabValue: TradeTab.Swap,
  /**
   * 交易币种
   */
  tradeCurrency: 'USDT',
  /**
   * 交易日期选择范围
   */
  tradeDateRangeValue: 7,
  /**
   * 交易日期选择——起始日期
   */
  tradeDateRangeStart: null as string | null,
  /**
   * 交易日期选择——终止日期
   */
  tradeDateRangeEnd: null as string | null,
  /**
   * 交易折线图数据
   */
  tradeData: [] as BarGraphDataItem[],
  /**
   * 交易详情类型
   */
  tradeDetailType: BarGraphDataType.Direct,
  /**
   * 交易详情——直属数据List
   */
  directList: [] as TradeListItem[],
  /**
   * 交易详情——团队数据List
   */
  teamList: [] as TradeListItem[],
  /**
   * 交易详情——list page
   */
  tradeListPage: 1,
  /**
   * 转账弹窗是否打开
   */
  transferModalOpen: false,
  /**
   * 转账弹窗选择币种
   */
  transferCurrency: 'USDT',
  /**
   * 转账弹窗转账金额
   */
  transferValue: '',
  /**
   * 转账弹窗——当前所选币种可用余额
   */
  transferCurrentCurrencyBalance: 0,
  /**
   * 转账弹窗——当前所选币种可划转金额
   */
  transferWithdrawableBalance: 0,
  /**
   * 历史记录弹窗是否打开
   */
  historyModalOpen: false,
  /**
   * 历史记录数组
   */
  historyList: [],
  /**
   * 历史记录页码
   */
  historyPage: 1,
  /**
   * 历史记录总条数
   */
  historyListTotal: 0,
  /**
   * 邀请链接类型
   */
  inviteType: '/register',
};

export const state = resso(_state);
