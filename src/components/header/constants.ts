import { LANG } from "@/core/i18n";

export const ORDER_MENU_URL = {
  contract: "/account/fund-management/order-history/swap-u-order",
  spot: "/account/fund-management/order-history/spot-order",
};
export const ORDER_MENU_LIST = [
  { name: LANG("合约"), href: ORDER_MENU_URL.contract },
  { name: LANG("币币"), href: ORDER_MENU_URL.spot },
];
export const ASSETS_MENU_URL = {
  assetsOverview: "/account/fund-management/assets-overview",
  recharge: "/account/fund-management/asset-account/recharge",
  withdraw: "/account/fund-management/asset-account/withdraw",
  // fiatCrypto: '/fiat-crypto',
  transfer: "/account/fund-management/asset-account/transfer",
  coupon: "/account/fund-management/assets-overview?type=coupon",
};
export const ASSETS_MENU_LIST = [
  { name: LANG("我的资产"), href: ASSETS_MENU_URL.assetsOverview },
  { name: LANG("充币"), href: ASSETS_MENU_URL.recharge },
  { name: LANG("提币"), href: ASSETS_MENU_URL.withdraw },
  // { name: LANG('法币充值'), href: ASSETS_MENU_URL.fiatCrypto },
  { name: LANG("内部转账"), href: ASSETS_MENU_URL.transfer },
  { name: LANG("合约卡券"), href: ASSETS_MENU_URL.coupon },
];
export const HEADER_PATH = {
  MARKETS: "/markets",
  SPOT_PRO: "/spot/btc_usdt",
  COIN_CONVERT: "/convert",
  // BUY_CRYPTO: '/fiat-crypto',
  COPY_TRADE: "/copyTrade",
  AFFILIATE: "/partnership/affiliate",
  ARMY: "/partnership/army",
  NEWER_TASK: "/novice-task",
  COPY_TRADING_BOT: "/trading-bot",
  INVITE_FRIENDS: "/invite-friends",
  PARTNERPROGRAM:'/partnerProgram'
};
export const USER_MENU_URL = {
  ACCOUNT_SECURITY: "/account/dashboard",
};
export const cacheHeaderTheme = {
  enablePrimaryHeader: false,
};
