import { LANG } from '@/core/i18n';
import { Account } from '@/core/shared';

export const useListTabs = ({ positions, pending }: { positions: any; pending: any }) => {
  const isLogin = Account.isLogin;
  // 下标做为顺序
  const tabs = [
    `${LANG('当前仓位')}(${isLogin ? positions.length : 0})`,
    `${LANG('当前委托')}(${isLogin ? pending.length : 0})`,
    LANG('历史委托'),
    LANG('历史成交'),
    LANG('历史仓位'),  
    LANG('资金流水'),
  ];

  return tabs;
};
