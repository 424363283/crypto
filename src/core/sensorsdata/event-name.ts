/**
 * 事件名称枚举
 */
export enum EVENT_NAME {
    /**
     * 进入注册/登录页面
     */
    RegisterSignPageEnter = 'RegisterSignPageEnter',
    /**
     * 点击忘记密码
     */
    ForgotPasswordClick = 'ForgotPasswordClick',
    /**
     * 进入kyc认证
     */
    KycAuth = 'KycAuth',
    /**
     * 认证按钮点击
     */
    KycButton = 'KycButton',
    /**
     * 提交kyc认证信息
     */
    KycInfoSubmit = 'KycInfoSubmit',
    /**
     * 提交注册/登录信息
     */
    SubRegisteSign = 'SubRegisteSign',
    /**
     * 合约_委托提交
     */
    FUTURES_INFO_SUBMIT = 'Futures_Info_Submit',
    /**
     * 合约_开通按钮点击
     */
    FUTURES_OPEN_CLICK = 'Futures_Open_Click',
    /**
     * 模拟交易_开通按钮点击
     */
    MOCK_TRADING_OPEN_CLICK = 'Mock_Trading_Open_Click',
    /**
     * 现货_委托提交
     */
    SPOT_INFO_SUBMIT = 'Spot_Info_Submit',
    /**
     * 现货_LVTs_委托提交
     */
    LVTS_INFO_SUBMIT = 'LVTs_Info_Submit',
    /**
     * 官网_顶部导航栏按钮点击
     */
    PC_TopButtonClick = 'PC_TopButtonClick',
    /**
     * 搜索点击
     */
    SearchClick = 'SearchClick',
    /**
     * 搜索结果
     */
    SearchResult = 'SearchResult',
    /**
     * 搜索结果页浏览
     */
    SearchResultView = 'SearchResultView',
    /**
     * 点击搜索结果
     */
    SearchResultClick = 'SearchResultClick',
    /** 充币详情页浏览 */
    DepositDetailView = 'DepositDetailView',
    /** 进入充币 */
    DepositEnter = 'DepositEnter',
    /** 充币详情页点击 */
    DepositDetailClick = 'DepositDetailClick',
    /**
     * 策略广场_浏览
     */
    STRATEGY_CHANNEL_VIEW = 'StrategyChannelView',
    /**
     * 策略广场_按钮点击事件
     */
    STRATEGY_CHANNEL_CLICK = 'StrategyChannelClick',
    /**
     * 现货_网格创建
     */
    SPOT_GRID_SUBMIT = 'SpotGridSubmit',
    /**
     * 现货_定投创建
     */
    SPOT_INVEST_SUBMIT = 'FixedInvestStrategy_Submit',
    /**
     * 现货_定投创建详情
     */
    SPOT_INVEST_SUBMIT_DETAIL = 'FixedInvestStrategy_SubmitDetail',
    /** 提币按钮点击 */
    WithdrawClick = 'WithdrawClick',
    /** 提币提交 */
    WithdrawSubmit = 'WithdrawSubmit',
    /** 划转点击 */
    TransferClick = 'TransferClick',
    /** 划转提交 */
    TransferSubmit = 'TransferSubmit',
    // 快捷买币提交
    BuyCryptoDetailSubmit = 'BuyCryptoDetailSubmit',
    // 奖励中心页面浏览
    RewardCenterView = 'RewardCenterView',
    // 奖励中心按钮点击
    RewardCenterClick = 'RewardCenterClick',
    /** 官网_banner点击 */
    PC_BannerClick = 'PC_BannerClick',
    /** 官网首页交易对点击 */
    PC_TradePairClick = 'PC_TradePairClick',
    /** 点击退出 */
    QuitClick = 'QuitClick',
    /** 点击帮助中心 */
    HelpClick = 'HelpClick',
    FeedbackClick = 'FeedbackClick',
    FeedbackSubmit = 'FeedbackSubmit',
    /** 点击在线客服 */
    Online_Click = 'OnlineClick',
    /** 对话结束 */
    Talk_End = 'Talkend',
    /** 资源位点击 */
    OperationClick = 'OperationClick',
    /** 收藏按钮点击 */
    Collect = 'Collect',
  }
  
