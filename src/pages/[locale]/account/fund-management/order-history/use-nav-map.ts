import { LANG } from '@/core/i18n';
import { isSwapDemo } from '@/core/utils/src/is';

const _isSwapDemo = isSwapDemo();
export const useNavMap = () => {
  const ORDER_NAV_MAP = [
    {
      title: LANG('U本位合约'),
      icon: 'sidebar-u-base-nav-0',
      activeIcon: 'sidebar-u-base-nav-active-0',
      href: !_isSwapDemo
        ? '/account/fund-management/order-history/swap-u-order'
        : '/account/fund-management/order-history/demo/swap-u-order',
      query: {
        type: 'records',
        tab: '0',
      },
    },
    // {
    //   title: LANG('币本位账户'),
    //   icon: 'sidebar-coin-base-nav-0',
    //   activeIcon: 'sidebar-coin-base-nav-active-0',
    //   href: !_isSwapDemo
    //     ? '/account/fund-management/order-history/swap-order'
    //     : '/account/fund-management/order-history/demo/swap-order',
    //   query: {
    //     type: 'records',
    //     tab: '0',
    //   },
    // },
  ];
  if (!_isSwapDemo) {
    ORDER_NAV_MAP.push({
      title: LANG('币币'),
      icon: 'sidebar-spot-nav-0',
      activeIcon: 'sidebar-spot-nav-active-0',
      href: '/account/fund-management/order-history/spot-order',
      query: {
        type: 'records',
        tab: '0',
      },
    });
    // ORDER_NAV_MAP.push({
    //   title: LANG('简单合约'),
    //   icon: 'sidebar-spot-nav-0',
    //   activeIcon: 'sidebar-spot-nav-active-0',
    //   href: '/account/fund-management/order-history/lite-order',
    //   query: {
    //     type: 'records',
    //     tab: '0',
    //   },
    // });
  }
  return {
    ORDER_NAV_MAP,
  };
};
