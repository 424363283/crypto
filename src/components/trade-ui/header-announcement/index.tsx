import dynamic from 'next/dynamic';

export const HeaderAnnouncement = {
  Swap: dynamic(() => import('./swap'), { ssr: false, loading: () => <div /> }),
};
