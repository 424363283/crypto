import { useResponsive } from '@/core/hooks';
import { LANG } from '@/core/i18n';

export const useNavMap = (verifiedDeveloped: boolean) => {
  const { isMobile } = useResponsive();
  const NAV_MAP = [
    {
      query: {
        type: 'overview',
      },
      title: LANG('资产总览'),
      icon: 'sidebar-overview-nav-0',
      activeIcon: 'sidebar-overview-nav-active-0',
      href: '/account/fund-management/assets-overview',
    },
    // {
    //   query: {
    //     type: 'spot',
    //   },
    //   title: LANG('现货账户'),
    //   icon: 'sidebar-spot-nav-0',
    //   activeIcon: 'sidebar-spot-nav-active-0',
    //   href: '/account/fund-management/assets-overview',
    // },
    {
      query: {
        type: 'swap',
      },
      title: LANG('币本位账户'),
      icon: 'sidebar-coin-base-nav-0',
      activeIcon: 'sidebar-coin-base-nav-active-0',
      href: '/account/fund-management/assets-overview',
    },
    {
      query: {
        type: 'swap-u',
      },
      title: LANG('U本位账户'),
      icon: 'sidebar-u-base-nav-0',
      activeIcon: 'sidebar-u-base-nav-active-0',
      href: '/account/fund-management/assets-overview',
    },
    {
      query: {
        type: 'fund-history',
      },
      title: LANG('资金记录'),
      icon: 'sidebar-fund-record-nav-0',
      activeIcon: 'sidebar-fund-record-nav-active-0',
      href: '/account/fund-management/assets-overview',
    },
    {
      query: {
        type: 'coupon',
      },
      title: LANG('合约卡券'),
      icon: 'sidebar-coupon-nav-0',
      activeIcon: 'sidebar-coupon-nav-active-0',
      href: '/account/fund-management/assets-overview',
    },
    {
      query: {
        type: 'tax',
      },
      title: LANG('税务报表'),
      icon: 'sidebar-tax-nav-0',
      activeIcon: 'sidebar-tax-nav-active-0',
      href: '/account/fund-management/assets-overview',
    },
  ];
  if (isMobile || !verifiedDeveloped) {
    NAV_MAP.pop();
  }
  return {
    NAV_MAP,
  };
};
