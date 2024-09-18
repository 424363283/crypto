import dynamic from 'next/dynamic';

export const HeaderFavorite = {
  Swap: dynamic(() => import('./swap'), { ssr: false, loading: () => <div /> }),
};
