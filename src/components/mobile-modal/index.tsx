import dynamic from 'next/dynamic';

export const MobileModal = dynamic(() => import('./mobile-modal'), { ssr: false });

export { BottomModal, 
    // ButtonModal, DefaultModal, 
    DrawerModal, ModalClose } from './components/';
