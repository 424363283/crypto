import { resso } from '@/core/resso';

const _state = {
  ruleModal: false, // 活动规则弹框
  showShareModal: false, // 扫码注册弹框
  showJoinModal: false, // 加入引导
  showNotDraw: false, // 无次数
  showShare: false, // 分享
  showShareAdd: false, // 分享 + 1
  showCoinModal: false,
  showReceiveModal: false, // 领取
  showNextModal: false,
};

export const store = resso(_state);
