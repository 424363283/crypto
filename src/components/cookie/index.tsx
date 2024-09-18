import dynamic from 'next/dynamic';

export const Cookie = dynamic(() => import('./cookie'), { ssr: false, loading: () => null });
