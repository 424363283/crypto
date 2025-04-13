import dynamic from 'next/dynamic';

export const MobileDrawer = dynamic(() => import('./mobile-drawer'), { ssr: false });
