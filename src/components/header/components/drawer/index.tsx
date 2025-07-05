import dynamic from 'next/dynamic';

export const GlobalConfigDrawer = dynamic(() => import('./global-config'), { ssr: false });
export const NavDrawer = dynamic(() => import('./nav-drawer'), { ssr: false });
export const TradeConfigDrawer = dynamic(() => import('./trade-config'), { ssr: false });
export const UserDrawer = dynamic(() => import('./user-drawer'), { ssr: false });
export const SearchDrawer = dynamic(() => import('./search-drawer'), { ssr: false });

