import dynamic from 'next/dynamic';

export const OrderShare = dynamic(() => import('@/components/order-list/components/order-share'), { ssr: false });
