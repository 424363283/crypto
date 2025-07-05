import dynamic from 'next/dynamic';

export const CopyShare = dynamic(() => import('@/components/CopyTrading/copy-share'), { ssr: false });
