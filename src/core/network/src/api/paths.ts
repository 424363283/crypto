// 所有地址存放的位置

export const paths = {
    login: '/api/sso/user_login_check', // 登录接口
    loginValidate:'/api/sso/user_login_check', //登录验证接口
    countryList:'/api/home/country/list',//国家列表（注册或登录时的手机号国际代码）
    logout: '/api/sso/logout', // 退出登录接口
    banners: '/api/public/index/banners', // 轮播图
    notices: '/api/public/index/notices', // 公告
    currency_list: '/api/public/currency/list', // 获取汇率列表
    get_symbols: '/api/public/symbol/list', // 获取商品索引
    spot_trade_list: '/api/spot/product/list', // spot商品详情接口
    lite_trade_list: '/api/lite/symbol/list', // lite商品详情接口
    swap_trade_list: '/swap/public/common/exchangeInfo', // swap商品详情接口
    miniChart: '/api/tv/tradingView/history',
    user_refer: '/api/user/refer', // 邀请信息
    home_country_list: '/api/public/v1/countries', // 国家列表
    get_behavior_state: '/api/geetest/state/web', // 获取验证行为方式
    kaptcha_validate: '/api/kaptcha/validate', // 图形验证
    gt4_validate: '/api/geetest/validate', // 极验验证
    security_options: '/api/security/options', // 获取安全认证项
    security_verify: '/api/security/verify', // 验证验证码
    
    
    system_v2_send_email: '/api/system/v2/send_email', // 发送邮箱验证码 v2
    system_v2_send_sms: '/api/system/v2/send_sms', // 发送手机验证码 v2
    system_v2_check_email: '/api/system/v2/check_email', // 校验邮箱验证码 v2
    system_v2_check_sms: '/api/system/v2/checksms', // 校验手机验证码 v2
    

    system_send_email: '/api/system/sendEmail', // 发送邮箱验证码
    system_check_email: '/api/system/checkEmail', // 校验邮箱验证码
    system_send_sms: '/api/system/sendSMS', // 发送手机验证码
    system_check_sms: '/api/system/checkSMS', // 校验手机验证码

    img_code: '/api/kaptcha/image', // 图形验证码
    register_submit: '/api/register/submit',
    current_airdrop: '/api/variety/airdrop/current', // 当前空投任务
    user_detail: '/api/user/v2/account', // 用户详情
    lottery_blind: '/api/variety/lottery/blind', // 抽奖盲盒活动
    deposit_lucks: '/api/variety/activity/deposit_luckys', // 4周年活动（充值+抵扣金）
    swap_rank: '/api/variety/activity/swap_rank', //4周年活动-永续交易量排名
    mine_union: '/api/private/referral/income',
    exchange_rate_list: '/api/public/currency/rates', // 获取换算汇率列表
    spot_open: '/api/spot/private/order/place', // 现货下单
    forgot_v2_account_verify: '/api/restore/account_verify', // 忘记密码账号验证
    official_validate: '/api/public/official_validate', // 官方配置验证
    forgot_v2_securify_verify: '/api/restore/securify_verify', // 忘记密码验证码验证
    forgot_v2_reset_password: '/api/restore/reset_password', // 忘记密码 重设
    spot_position: '/api/spot/private/order/open_orders', // 现货持仓
    spot_history: '/api/spot/private/order/history_orders', // 现货历史委托
    spot_history_detail: '/api/spot/private/order/history_order_deals', // 现货历史详情
    spot_close: '/api/spot/private/order/cancel', // 现货撤单
    etf_commodity: '/api/spot/product/etf/{id}', // ETF详情
    lite_rule: '/api/public/currency/info', // 规则详情
    currency_intro: '/api/public/currency/intros', // 货币规则介绍
    tax_download_last_record: '/api/spot/private/tax/last_record', // 报税单最近一次下载记录
    tax_download_record: '/api/spot/private/tax/records', // 报税单下载记录
    tax_download_apply: '/api/spot/private/tax/create_record', // 报税单下载申请
    user_amounts: '/api/private/bigdata/amounts', // 费率
    spot_asset: '/api/spot/private/account/assets', // 现货资产
    spot_grid_position_list: '/api/bot/grid/private/strategy/list', // 现货网格持仓列表
    spot_currency_cost: '/api/spot/private/account/currency_cost', // 币种成本
    sum_assets: '/api/private/account/sum_assets', // 资产总额-删除账户用
    delete_account: '/api/private/account/delete', // 删除账户
    delete_check: '/api/private/account/delete_check', // 删除账户效验
    deactivate_check: '/api/private/account/deactivate_check', // 禁用账户效验
    disable_account: '/api/private/account/deactivate', // 禁用账户
    questions_account: '/api/restore/questions', // 获取问题
    account_verify: '/api/restore/account_verify', // 恢复1
    securify_verify: '/api/restore/securify_verify', // 恢复1
    question_verify: '/api/restore/question_verify', // 回答问题
    reactivate: '/api/restore/reactivate', // 启用
    account_profit: '/api/private/bigdata/account_profit', // 账户盈亏
    account_profit_history: '/api/private/bigdata/account_profit_history', // 账户盈亏历史
    account_day_profit: '/api/private/bigdata/account_profit_daily', // 账户盈亏日历
    account_profit_rate: '/api/private/bigdata/account_profit_rate', // 账户盈亏率
    user_v2_unbind_phone: '/api/private/account/unbind_phone', // 解绑手机
    user_v2_bind_phone: '/api/private/account/bind_phone', // 绑定手机
    lite_asset: '/api/lite/private/account/asset', // 差价合约资产 
    lite_position: '/api/lite/private/order/position', // 差价合约持仓
    lite_plan_orders: '/api/lite/private/planorder/orders', // 差价合约挂单
    lite_history: '/api/lite/private/order/history_orders', // 差价合约历史
    lite_add_score: '/api/lite/private/account/add_score', // 简单合约模拟账户充币
    lite_history_margin: '/api/lite/private/order/margin_history', // 差价合约历史-操作记录
    user_v2_bind_email: '/api/private/account/bind_email', // 绑定邮箱
    user_v2_bind_options: '/api/private/account/bind_options', // 已绑定的数据
    lite_history_amount: '/api/lite/private/order/history_amount', // 简单合约历史成交量
    lite_add_margin: '/api/lite/private/order/add_margin', // lite增加保证金
    lite_tpsl: '/api/lite/private/order/tpsl', // lite止盈止损
    user_v2_google_secret: '/api/private/account/google_secret', // 谷歌验证密钥
    get_lite_setting: '/api/lite/private/account/info', // 用户合约设置信息
    get_kyc_support_country: '/api/private/profile/support_country', // KYC设备ID限制
    onfido_initiate_creation: '/api/third/onfido/initiate_creation', // onfido请求
    onfido_check: '/api/third/onfido/check', // onfido请求回执
    get_lite_set_info: '/api/lite/private/account/save', // 用户合约设置信息
    lite_close: '/api/lite/private/order/close', // 平仓
    lite_revoke: '/api/lite/private/planorder/cancel', // lite撤销
    lite_rewards: '/api/private/account/rewards', // 卡券
    user_v2_bind_google: '/api/private/account/bind_google', // 谷歌绑定
    user_v2_unbind_google: '/api/private/account/unbind_google', // 谷歌解绑
    user_v2_update_password: '/api/private/account/update_password', // 修改登录密码
    user_v2_unbind_withdrawPw: '/api/private/account/unbind_withdrawPw', // 关闭资金密码
    user_v2_reset_withdrawPw: '/api/private/account/reset_withdrawPw', // 重置资金密码
    user_init_withdrawPw: '/api/private/account/init_withdrawPw', // 初设资金密码
    user_update_withdrawPw: '/api/private/account/update_withdrawPw', // 修改资金密码
    toggle_withdraw_fast: '/api/spot/private/account/set_withdraw_fast', // 打开/关闭提币免验证
    toggle_withdraw_white: '/api/spot/private/account/set_withdraw_white', // 打开/关闭仅地址簿提币
    get_favorites_list: '/api/private/preference/list', // 获取登录自选列表
    add_favorites: '/api/private/preference/add', // 添加自选
    remove_favorites_list: '/api/private/preference/remove', // 删除自选
    user_v2_set_anti_phishing: '/api/private/account/set_anti_phishing', // 防钓鱼码
    setting_info: '/api/public/setting/info', // 一些基础信息
    lite_fee: '/api/lite/symbol/fee', // 手续费配置
    lite_open: '/api/lite/private/order/place', // 合约下单
    lite_place: '/api/lite/private/planorder/place', // 合约挂单
    update_username: '/api/private/account/update_username', // 修改昵称
    upload_avatar: '/api/private/profile/upload_avatar', // 上传头像
    qrcode_scan: '/api/qrcode/scan', // 登录码是否合法
    qrcode_grant: '/api/qrcode/grant', // 登录码授权
    private_account_preview: '/api/private/account/preview', // 账户数据预览
    lite_follow_trader_income_view: '/api/lite/follow/trader/income_view', // 账户带单数据
    lite_follow_follower_stat: '/api/lite/follow/follower/stat', // 账户跟单数据
    lite_follow_follower_traders: '/api/lite/follow/follower/traders', // 正在跟单
    lite_follow_follower_orders: '/api/lite/follow/follower/orders', // 跟单 交易详情
    lite_follow_trader_set_ratio: '/api/lite/follow/trader/set_ratio', // 设置带单比率
    lite_follow_trader_active: '/api/lite/follow/trader/active', // 设置交易员状态
    lite_follow_trader_save_follow_max: '/api/lite/follow/trader/save_follow_max', // 交易员修改可跟随人数
    lite_follow_trader_sysTags: '/api/lite/follow/trader/sysTags', // 获取所有系统风格
    lite_follow_trader_myTags: '/api/lite/follow/trader/tags', // 获取我的理念
    lite_follow_trader_addTags: '/api/lite/follow/trader/add_tags', // 添加风格
    follow_follower_delTags: '/api/follow/follower/delTags', // 删除风格
    lite_follow_trader_followers: '/api/lite/follow/trader/followers', //  这个id的跟随者
    api_lite_follow_trader_remove: '/api/lite/follow/trader/remove', // 删除跟随者
  
    /// 永续
    swap_delivery_leverage_find: '/swap/private/delivery/leverage', // 永续用户永续信息
    swap_future_leverage_find: '/swap/private/future/leverage',
    // 永续盈亏相关
    swap_feature_profits_reports: '/swap/private/future/pnlReport/getPnlReports', // 永续U本位合约盈亏报表
    swap_delivery_profits_reports: '/swap/private/delivery/pnlReport/getPnlReports', // 永续币本位合约盈亏报表
    swap_feature_total_profits: '/swap/private/future/pnlReport/getIntervalPnl', //  U本位合约盈亏汇总,7日，30日
    swap_delivery_total_profits: '/swap/private/delivery/pnlReport/getIntervalPnl', //  币本位合约盈亏汇总
    // 永续修改保证金模式
    swap_delivery_leverage_userSetting_updateMarginType: '/swap/private/delivery/userSetting/marginType',
    swap_future_leverage_userSetting_updateMarginType: '/swap/private/future/leverage/userSetting/updateMarginType',
    swap_delivery_leverage_update: '/swap/private/delivery/leverage', // 永续修改杠杠
    swap_future_leverage_update: '/swap/private/future/leverage/update',
    swap_contract_contract_risk_list: '/swap/public/common/risk/list', // 永续风险列表
    swap_contract_contractDetail: '/swap/public/common/premiumIndex/{id}', // 永续合约详情
    lite_funding_rate: '/api/lite/symbol/funding_rate/{id}', // 差价合约资金费率
    swap_delivery_account_sumFound: '/swap/private/delivery/account/list/balance', // 永续余额
    swap_future_account_sumFound: '/swap/private/future/account/list/balance',
    swap_delivery_leverage_userSetting_updateUnit: '/swap/private/delivery/userSetting/unit', // 永续修改单位
    swap_future_leverage_userSetting_updateUnit: '/swap/private/future/leverage/userSetting/updateUnit',
    swap_contract_contract_risk_detail: '/swap/public/common/risk/detail', // 永续风险详细
    swap_future_leverage_userSetting_getPositionType: '/swap/private/future/leverage/userSetting/getPositionType', // 永续 获取 单双持仓类型 和 单位类型
    swap_delivery_leverage_userSetting_getPositionType: '/swap/private/delivery/userSetting/getPositionType',
    swap_future_order: '/swap/private/future/order', // 永续下单
    swap_delivery_order: '/swap/private/delivery/order',
    swap_future_position: '/swap/private/future/position', // 永续持仓
    swap_delivery_position: '/swap/private/delivery/position',
    swap_future_order_list: '/swap/private/future/order/list', // 永续委托
    swap_delivery_order_list: '/swap/private/delivery/order/list',
    swap_delivery_order_delete: '/swap/private/delivery/order', // 永续撤销委托单
    swap_future_order_delete: '/swap/private/future/order',
    swap_delivery_order_delete_all: '/swap/private/delivery/wallet/order/all', // 永续撤销全部委托单
    swap_future_order_delete_all: '/swap/private/future/order/all',
    swap_delivery_position_close_all: '/swap/private/delivery/wallet/close/all', // 永续 平仓全部持仓
    swap_future_position_close_all: '/swap/private/future/close/all',
    swap_future_close_position: '/swap/private/future/close', // 永续平仓
    swap_delivery_close_position: '/swap/private/delivery/close',
    // 永续修改双向持仓
    swap_future_leverage_userSetting_updatePositionType: '/swap/private/future/userSetting/updatePositionType',
    swap_delivery_leverage_userSetting_updatePositionType: '/swap/private/delivery/userSetting/positionType',
    swap_delivery_calculateLp: '/swap/private/delivery/calculator', // 永续计算强平
    swap_future_calculateLp: '/swap/private/future/calculator',
    swap_delivery_leverage_userSetting_adjustPositionMargin: '/swap/private/delivery/userSetting/adjustPositionMargin', // 永续 修改持仓保证金
    swap_future_leverage_userSetting_adjustPositionMargin: '/swap/private/future/userSetting/adjustPositionMargin',
    swap_delivery_condition_createBatch: '/swap/private/delivery/order/batchPlaceOrder', // 永续止盈止损
    swap_future_condition_createBatch: '/swap/private/future/order/batchPlaceOrder',
    swap_agreement_getAgreement: '/swap/private/agreement/info', // 永续 协议状态
    swap_agreement_agreement: '/swap/private/agreement/confirm', // 永续 同意协议
    swap_delivery_history_order: '/swap/private/delivery/order/history', // 永续 历史委托
    swap_future_history_order: '/swap/private/future/order/history',
    swap_delivery_order_trade: '/swap/private/delivery/trade', // 永续 历史成交
    swap_future_order_trade: '/swap/private/future/trade',
    swap_delivery_account_ledger_transaction: '/swap/private/delivery/account/ledger/transaction', // 永续 资金记录
    swap_future_account_ledger_transaction: '/swap/private/future/account/ledger/transaction',
    swap_delivery_addOtoco: '/swap/private/delivery/order/otoco', // 永续止盈止损下单
    swap_future_addOtoco: '/swap/private/future/order/otoco', // 永续止盈止损下单
    swap_delivery_userSetting_autoPositionMargin: '/swap/private/delivery/userSetting/autoPositionMargin', // 自动追加保证金
    swap_future_userSetting_autoPositionMargin: '/swap/private/future/userSetting/autoPositionMargin',
    swap_future_order_trace_order: '/swap/private/future/order/trace_order', // 追踪委托下单
    swap_delivery_order_trace_order: '/swap/private/delivery/order/trace_order',
    swap_public_delivery_fundingRate_real: '/swap/public/delivery/fundingRate/real', // 永续币本位资金费率
    swap_public_future_fundingRate_real: '/swap/public/future/fundingRate/real', // 永续U本位资金费率
    swap_public_delivery_fundingRate_days: '/swap/public/delivery/fundingRate/days', // 永续币本位费率历史
    swap_public_future_fundingRate_days: '/swap/public/future/fundingRate/days', //  永续U本位费率历史
    swap_public_delivery_risk_days: '/swap/public/delivery/risk/days', //  永续币本位风险保障基金
    swap_public_future_risk_days: '/swap/public/future/risk/days', //  永续U本位风险保障基金
    swap_private_future_reccerse_position: '/swap/private/future/reccerse_position',
    swap_private_delivery_reccerse_position: '/swap/private/delivery/reccerse_position', // 反向开仓
    swap_delivery_userSetting_priceProtection: '/swap/private/delivery/userSetting/priceProtection',
    swap_future_userSetting_priceProtection: '/swap/private/future/userSetting/priceProtection',
    swap_get_otification_setting: '/swap/private/userWarn/info', // 获取swap通知预警设置
    swap_set_notification_setting: '/swap/private/userWarn/add', // 新增swap通知预警设置
    swap_private_userWarn_open: '/swap/private/userWarn/open',
    swap_private_userWarn_addMarginNotify: '/swap/private/userWarn/addMarginNotify',
    swap_private_userWarn_addLpNotify: '/swap/private/userWarn/addLpNotify',
    swap_private_delivery_trade_positionHistory: '/swap/private/delivery/trade/positionHistory',
    swap_private_future_trade_positionHistory: '/swap/private/future/trade/positionHistory',
    swap_delivery_edit_plan_order: '/swap/private/delivery/edit_plan_order', // 永续编辑止盈止损
    swap_future_edit_plan_order: '/swap/private/future/order/edit_plan_order',
    swap_public_wallet_create_wallet: '/swap/private/wallet/create_wallet',
    swap_public_wallet_update_wallet: '/swap/private/wallet/update_wallet',
    testnet_private_testnet_addCoin: '/testnet/private/testnet/addCoin',
    swap_private_future_order_edit_order: '/swap/private/future/order/edit_order',
    swap_private_delivery_order_edit_order: '/swap/private/delivery/order/edit_order',
  
    swap_public_common_errors: '/swap/public/common/errors',
    swap_kline_u_trade_history_list: '/swap/private/future/trade/getOrderAvgPrice',
    swap_kline_c_trade_history_list: '/swap/private/delivery/trade/getOrderAvgPrice',

    
    //转账 提币  法币
    transfer_chains: '/api/spot/setting/chains', // 转账链信息
    networks_chains: '/api/spot/setting/networks', // 主网链信息
    recharge_currency: '/api/spot/setting/recharge_currencies', // 充币支持列表
    recharge_getAddress: '/api/spot/private/address/deposit_address', // 充币地址信息
    supports: '/api/spot/payment/supports', // 法币配置
    rechargeXXPay: '/api/spot/private/recharge/create', // 法币充值
    supports_payments: '/api/spot/payment/payments', // 法币交易列表
    transfer_withdraw: '/api/spot/private/withdraw/create', //转账
    payment_send: '/api/private/payment/send', //内部转账
    transfer_avaiable: '/api/spot/private/withdraw/avaiable', //可转账
    verify_password: '/api/spot/private/withdraw/verify_password', //效验资金密码
    withdraw_currency: '/api/spot/setting/withdraw_currencies', //查看提币支持币种
    transfer_currency: '/api/spot/setting/transfer_currencies', //查看转账支持币种
    withdraw_address: '/api/spot/private/address/withdraw_address_list', //获取配置地址
    delete_address: '/api/spot/private/address/withdraw_address_delete', //删除地址
    add_address: '/api/spot/private/address/withdraw_address_create', //增加地址
    edit_address: '/api/spot/private/address/withdraw_address_edit', // 编辑地址
    transfer_record: '/api/private/transfer/records', //划转记录
    set_local_currency: '/api/private/account/set_currency', //设置本地货币
    wallet_transfer: '/api/private/transfer/apply', // 划转
    withdraw_sell: '/api/spot/private/withdraw/sell', // 卖币
    deposit_address_list: '/api/spot/private/address/deposit_address_list', // 充值地址列表
    deposit_address_create: '/api/spot/private/address/deposit_address_create', // 创建充币地址
    deposit_address_update: '/api/spot/private/address/deposit_address_update', // 修改充币地址
  
    //兑换
    exchange_currency: '/api/spot/setting/convert_currencies', //闪兑币种
    spreadGear: '/api/spot/private/convert/gear', //闪兑档位
    exchange_rate: '/api/spot/setting/convert_rate', //闪兑汇率
    exchangeApply: '/api/spot/private/convert/apply', //闪兑
  
    //资金记录
    deposit_withdraw: '/api/spot/private/account/withdraw_records', //提币 转账记录
    deposit_records: '/api/spot/private/account/deposit_records', //充值 法币 记录
    exchangeHistory: '/api/spot/private/account/convert_history', //兑换记录
    payments_records: '/api/private/payment/records', //新的转账 - 记录接口
  
    // deposit 导出
    deposit_export: '/api/spot/private/account/deposit_export', //充值记录导出
    spot_history_order_export: '/api/spot/private/order/history_orders_export', // 现货历史记录导出
    spot_withdraw_export: '/api/spot/private/account/withdraw_export', // 提币记录导出
  
    // 跟单相关接口
    copy_trade_list: '/api/lite/follow/trader/list', // 跟单列表
    copy_trade_list_preset: '/api/lite/follow/preset/trader_query', // 跟单列表帅选预设值
    follow_preset_trader_apply: '/api/lite/follow/preset/trader_apply', //交易员申请须知参数查询
    follow_detail: '/api/lite/follow/trader/detail', // 交易员详情
    follow_trader_apply: '/api/private/trader/apply', // 提交申请交易园接口
    add_follow: '/api/private/subscribe/apply', //关注交易员
    cancel_follow: '/api/private/subscribe/cancel', // 取消关注
    follow_stat: '/api/lite/follow/trader/commodity/stat', // 交易统计
    follow_trader_followers: '/api/lite/follow/trader/followers', // 获取跟随我的人
    follow_trader_history: '/api/lite/follow/trader/history', // 获取我的历史持仓
    follow_trader_positions: '/api/lite/follow/trader/position', // 获取当前持仓
    follow_follower_detail: '/api/lite/follow/follower/detail', // 用户跟单详情
    follow_follower_apply: '/api/lite/follow/follower/apply', // 跟单信息修改
    follow_follower_active: '/api/lite/follow/follower/active', // 跟单开关
    follow_follower_cancel: '/api/lite/follow/follower/cancel', // 取消跟单
    follow_preset_follow_apply: '/api/lite/follow/preset/follow_apply', // 跟随订单预设值
    follow_follower_log: '/api/lite/follow/follower/log', // 跟单失败记录
    follow_trader_income_list: '/api/lite/follow/trader/income_list', // 收益明细
    follow_follower_log_unread: '/api/lite/follow/follower/log_unread', // 跟单日志未读数
    follow_trader_process: '/api/private/trader/process', // 交易员申请状态
    follow_trader_income_state: '/api/lite/follow/trader/income/stat', // 交易员合约商品统计(图表)
  
    home_bars: '/api/public/home/bars', // 发现页动态tabs
    setting_global: '/api/public/setting/global', // 维护状态接口
    activity_list: '/api/public/index/varieties', // 活动列表
    activity_missions: '/api/variety/activity/missions', // 活动任务列表
  
    position_symbols: '/api/public/home/position_symbols', // 获取首页持仓币种
  
    profile_last_kyc2: '/api/private/profile/last_kyc2', // kyc详情
  
    profile_submit_kyc2: '/api/private/profile/submit_kyc2', // kyc提交
  
    account: '/api/agent/v1/home/account', // 邀请
  
    private_profile_avatars: '/api/private/profile/avatars', // 可选形象列表
    private_profile_update_avatar: '/api/private/profile/update_avatar', // 设置形象图片
    bind_biometric: '/api/private/account/add_credential', // 绑定生物识别
    login_biometric: '/api/account/oauth/sign/credential', // 生物识别登录
    account_credentials: '/api/private/account/credentials', // 获取绑定情况
    del_credential: '/api/private/account/del_credential', // 解绑
    initiate_creation: '/api/third/jumio/initiate_creation', // 国家验证 kyc
    feedback_submit: '/api/feedback/submit', // 提交反馈
    feedback_records: '/api/feedback/records', // 反馈记录
  
    // affiliate form
    apply_affiliate_agent: '/api/agent/apply',
    // get login qrcode
    login_qrcode: '/api/qrcode/get?random=',
    // check login qrcode
    check_login_qrcode: '/api/qrcode/check',
    private_points: '/api/private/account/points', // 积分
    private_account_points_records: '/api/private/account/points_records', // 积分记录
    variety_lottery_prizes: '/api/variety/lottery/detail', // 抽奖奖品
    variety_lottery_draw: '/api/variety/lottery/draw', // 点击开奖
    variety_sign_info: '/api/variety/sign/info', // 签到信息
    variety_mission_missions: '/api/variety/mission/missions', // 任务列表
    variety_mission_progress: '/api/variety/mission/progress', // 任务进度
    variety_sign_bingo: '/api/variety/sign/bingo', // 点击签到
    variety_lottery_history: '/api/variety/lottery/history', // 抽奖历史
    variety_activity_subsricbe_social: '/api/variety/activity/subsricbe_social', // 加入社区
    variety_activity_collect: '/api/variety/activity/collect', // 领取奖品
    variety_mission_receive: '/api/variety/mission/receive', // 领取任务
    open_lottery: '/api/variety/lottery/open', // 开奖
  
    private_referral_reward_total: '/api/private/referral/reward_total', // 奖励累积
    private_referral_summary: '/api/private/referral/summary', // 推荐总览
    private_referral_resend_email: '/api/private/referral/resend_email', // 重发邮件
    private_referral_send_email: '/api/private/referral/send_email', // 发送邮件
    private_referral_send_records: '/api/private/referral/send_records', // 邀请记录
    private_referral_reward_records: '/api/private/referral/reward_records', // 获取记录
    private_login_history: '/api/private/account/login_history', // 获取记录总数
  
    set_currency: '/api/private/account/set_currency', // 设置汇率
    currency_info: '/api/public/currency/info/{id}', // 商品的介绍
    lite_reverse_open_order: '/api/lite/private/order/reverse_place', // 简单合约反向开仓
    lite_auto_add_margin: '/api/lite/private/order/set_margin_auto', // 简单自动追加保证金
    lite_shift_stop_loss: '/api/lite/private/order/set_trail_offset', // 简单设置移动止损
    common_refer: '/api/common/refer/{ru}', // 获取推荐码信息
    affiliate_summary: '/api/agent/v1/home/summary', // 代理中心——总览
    affiliate_summary_commission: '/api/agent/v1/home/summary_commission', // 代理中心——收入总览
    affiliate_userinfo: '/api/agent/v1/home/account', // 代理中心——用户信息
    affiliate_balance: '/api/agent/v1/asset/wallets', // 代理中心——用户钱包余额
    affiliate_bar_graph: '/api/agent/v1/home/chart_v2', // 代理中心——直属数据/团队数据
    affiliate_trading_data: '/api/agent/v1/home/trading_v2', // 代理中心——获取交易直属数据/团队数据
    affiliate_invite_link_list: '/api/agent/v1/campaign/list', // 代理中心——邀请链接列表
    affiliate_record_list: '/api/agent/v1/commission/list', // 代理中心——获取返佣记录列表
    affiliate_add_invite_link: '/api/agent/v1/campaign/create', // 代理中心——新增邀请链接
    affiliate_share_domains: '/api/agent/v1/campaign/domains', // 代理中心——注册链接
    affiliate_delete_invite_link: '/api/agent/v1/campaign/remove', // 代理中心——删除邀请链接
    affiliate_user_list: '/api/agent/v1/user/list', // 代理中心——获取用户列表
    affiliate_withdraw: '/api/agent/v1/asset/withdraw', // 代理中心——提现
    affiliate_withdraw_history_list: '/api/agent/v1/asset/withdraw_list', // 代理中心——转账历史记录
    affiliate_teams_list: '/api/agent/v1/team/list', // 代理中心——获取团队列表
    affiliate_steps_list: '/api/agent/steps', // 代理中心——获取返佣比例列表
    affiliate_spot_upgrade: '/api/agent/set_rate', // 代理中心——用户现货升点
    affiliate_swap_upgrade: '/api/agent/set_rate', // 代理中心——用户永续升点
    oauth_login: '/api/account/oauth/sign', // 三方账号登录
    oauth_register: '/api/register/third', // 三方账号注册
  
    // vip
    vip_setting_levels: '/api/public/setting/levels', // 系统VIP等级设置
    vip_level_data: '/api/private/account/level_data', // vip等级相关数据
    vip_apply: '/api/public/vip/apply', // 用户vip申请
  
    // activity
    admin_activity_list: '/api/public/popups', // 后台配置活动列表获取
    admin_variety_activity_list: '/api/variety/activity/popups', // 后台配置活动列表获取
    // 余币兑换算力
    convert_point_assets_list: '/api/spot/private/convert_point/assets',
    // 兑换算力
    convert_point_apply: '/api/spot/private/convert_point/apply',
    // 兑换记录
    convert_history: '/api/spot/private/convert_point/convert_history',
    // 网格策略
    grid_symbols: '/api/bot/grid/public/symbols', // 获取网格支持的币对
    grid_square_list: '/api/bot/grid/public/top_ranking', // 策略广场——现货网格列表
    invest_square_list: '/api/bot/auto_invest/public/top_ranking', // 策略广场——定投列表
    grid_article_list: '/api/public/articles', // 获取现货网格文章
    grid_roll_list: '/api/bot/grid/public/get_roll_strategy', // 获取网格策略最新列表
    grid_ai_list: '/api/bot/grid/public/params', // 获取网格策略最新列表
    grid_create_strategy: '/api/bot/grid/private/strategy/place', // 创建网格策略
    grid_stop_by_id: '/api/bot/grid/private/strategy/stop', // 停止网格
    grid_get_detail: '/api/bot/grid/private/strategy/detail', // 获取网格策略详情
    grid_get_strategy_price_list: '/api/bot/grid/private/strategy/open_items', // 获取网格策略价格点位
    grid_get_strategy_deal_list: '/api/bot/grid/private/strategy/open_orders', // 获取网格成交记录
    grid_update_grid: '/api/bot/grid/private/strategy/update', // 修改网格
    grid_max_apy: '/api/bot/grid/public/max_apy', // 获取网格最大年化收益率
  
    // cookie策略
    get_location: '/api/public/location', // 获取用户网络的当前定位
  
    // 定投策略
    invest_max_apy: '/api/bot/auto_invest/public/max_apy', // 获取定投最大年化收益率
    invest_symbols: '/api/bot/auto_invest/public/symbols', // 获取定投支持的币对
    invest_create_strategy: '/api/bot/auto_invest/private/place', // 创建定投策略
    invest_update_strategy: '/api/bot/auto_invest/private/update', // 修改定投策略
    spot_invest_position_list: '/api/bot/auto_invest/private/plans', // 现货定投持仓列表
    invest_stop_by_id: '/api/bot/auto_invest/private/stop', // 停止定投
    invest_get_detail: '/api/bot/auto_invest/private/plan', // 获取定投策略详情
    invest_get_order_list: '/api/bot/auto_invest/private/orders', // 获取定投订单列表

     /** 盲盒活动-活动详情 */
    mysterybox_detail: '/api/variety/promo/mysterybox_detail',
    /** 盲盒活动-邀请记录 */
    mysterybox_invites: '/api/variety/promo/mysterybox_invites',
    /** 盲盒活动-得到盲盒记录 */
    mysterybox_assets: '/api/variety/promo/mysterybox_assets',
    /** 盲盒活动-卡券奖励记录|盲盒奖励记录 */
    mysterybox_rewards: '/api/variety/promo/mysterybox_rewards',
    /** 盲盒活动-打开盲盒 */
    open_mysterybox: '/api/variety/promo/open_mysterybox',
    /** 盲盒活动-领取奖励 */
    collect_mysterybox: '/api/variety/promo/collect_mysterybox',


    
    assist_invite: '/api/variety/promo/assist_invites', // 助力券-邀请记录
  assist_process: '/api/variety/promo/assist_processes', //助力券-助力记录
  join_assist: '/api/variety/promo/join_assist', //助力券-参加活动
  cancel_assist: '/api/variety/promo/cancel_assist', // 助力券-提前结束
  collect_assist: '/api/variety/promo/collect_assist', //助力券-领取奖励
  assist_detail: '/api/variety/promo/assist_detail', //助力券-当前进行中活动详情
  assist_rewards: '/api/variety/promo/assist_rewards', // 助力券-待领取活动奖励

  /**
   * 幸运轮盘
   *
   *
   *
   *
   * 此处分割避免冲突
   */

  /** 邀新活动-数据统计 */
  promo_overview: '/api/public/promo_overview',
  promo_private_overview: '/api/variety/promo/promo_overview',
  /** 邀新活动-数据统计-登录后 */
  /** 邀请记录 */
  luckydraw_invites: '/api/variety/promo/luckydraw_invites',
  /** 奖励记录 */
  luckydraw_rewards: '/api/variety/promo/luckydraw_rewards',
  /** 轮盘进行中详情 */
  luckydraw_detail: '/api/variety/promo/luckydraw_detail',
  /** 参加轮盘 */
  join_luckydraw: '/api/variety/promo/join_luckydraw',
  /** 轮盘 提前结束 */
  cancel_luckydraw: '/api/variety/promo/cancel_luckydraw',
  /** 轮盘 抽奖 */
  draw: '/api/variety/promo/draw',
  /** 幸运轮盘-分享得到抽奖次数 */
  share_luckydraw: '/api/variety/promo/share_luckydraw',
  /** 幸运轮盘-领取奖励 */
  collect_luckydraw: '/api/variety/promo/collect_luckydraw',
 
    

  // 推荐好友
  invite_friends_resend_email: '/api/private/referral/resend_email', // 推荐好友 - 重发邀请邮件
  invite_friends_send_email: '/api/private/referral/send_email', // 推荐好友 - 发送邀请邮件
  invite_friends_summary: '/api/private/referral/summary', // 推荐好友 -  推荐总览
  invite_friends_reward_total: '/api/private/referral/reward_total', // 推荐好友 - 奖励累计
  invite_friends_send_records: '/api/private/referral/send_records', // 推荐好友 - 邀请记录
  invite_friends_reward_records: '/api/private/referral/reward_records', // 推荐好友 - 奖励记录
  // UE 资源位
  ue_publicities: '/api/public/index/publicities', // UE资源位
  // 兑换现金券
  exchange_coupon: '/api/variety/promo/exchange_coupon', // 兑换现金券
  
  };
  

 