import { LANG } from '@/core/i18n';
import NavDrawer, { NavDrawerProps } from '../nav-drawer';

export const SwapDemoNavDrawer = ({ uHref, cHref, ...props }: { uHref: string; cHref: string } & NavDrawerProps) => {
  const menuItems = [
    {
      label: LANG('U本位'),
      children: [],
      href: uHref,
      icon: 'header-buy-crypto-0',
    },
    {
      label: LANG('币本位'),
      children: [],
      href: cHref,
      icon: 'header-buy-crypto-0',
    },
    {
      label: LANG('实盘交易'),
      children: [],
      href: '/swap/btc-usdt',
      icon: 'header-buy-crypto-0',
    },
  ];

  return <NavDrawer menuItems={menuItems} {...props}></NavDrawer>;
};
