import dynamic from 'next/dynamic';

export const LiquidationModal = dynamic(() => import('./liquidation-modal'), { ssr: false });
export const ModifyMarginModal = dynamic(() => import('./modify-margin-modal'), { ssr: false });
export const StopProfitStopLossModal = dynamic(() => import('./stop-profit-stop-loss-modal'), { ssr: false });
export const TrackModal = dynamic(() => import('./track-modal'), { ssr: false });
export const ReverseConfirmModal = dynamic(() => import('./reverse-confirm-modal'), { ssr: false });
export const PendingDetailModal = dynamic(() => import('./pending-detail-modal'), { ssr: false });
export const EditOrderSpslModal = dynamic(() => import('./edit-order-spsl-modal'), { ssr: false });
