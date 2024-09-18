import dynamic from 'next/dynamic';

export const BottomModal = dynamic(() => import('./bottom-modal'), { ssr: false });
// export const ButtonModal = dynamic(() => import('./button-modal'), { ssr: false });
// export const DefaultModal = dynamic(() => import('./default-modal'), { ssr: false });
export const DrawerModal = dynamic(() => import('./drawer-modal'), { ssr: false });
export const ModalClose = dynamic(() => import('./modal-close'), { ssr: false });
