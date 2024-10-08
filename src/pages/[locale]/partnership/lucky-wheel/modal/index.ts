import dynamic from 'next/dynamic';

export const JoinModal = dynamic(() => import('./join-modal'), { ssr: false });
// export const NotDrawModal = dynamic(() => import('./not-draw-modal'), { ssr: false });
// export const ShareAdd = dynamic(() => import('./share-add'), { ssr: false });
export const CoinModal = dynamic(() => import('./coin-modal'), { ssr: false });
// export const ReceiveModal = dynamic(() => import('./receive-modal'), { ssr: false });
// export const NextModal = dynamic(() => import('./next-modal'), { ssr: false });
