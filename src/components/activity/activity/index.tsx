import dynamic from 'next/dynamic';

export const Activity = dynamic(() => import('./activity'), { ssr: false, loading: () => null });
