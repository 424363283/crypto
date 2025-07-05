import dynamic from 'next/dynamic';

export const MobileModal = dynamic(() => import('./mobile-modal'), { ssr: false });
export const MobileBottomSheet = dynamic(() => import('./mobile-action-sheet'), { ssr: false });
export const MobileDateRangePicker = dynamic(() => import('../mobile-date-range-picker'), { ssr: false });

export { BottomModal, 
    // ButtonModal, DefaultModal, 
    DrawerModal, ModalClose
} from './components/';
    
