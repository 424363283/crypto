import dynamic from 'next/dynamic';

export { AlertFunction } from './alert-function';
export type { BasicProps } from './basic-modal';
export { EXPORTS_TYPE } from './export/types';
export { ACCOUNT_TYPE } from './transfer';
export type { DefaultCoin } from './transfer';

export const EnableAuthenticationModal = dynamic(() => import('./enable-auth-modal'), { ssr: false });
export const BasicModal = dynamic(() => import('./basic-modal'), { ssr: false });
export const AlertModal = dynamic(() => import('./alert'), { ssr: false });
export const ExportRecord = dynamic(() => import('./export'), { ssr: false });
export const IdentityVerificationModal = dynamic(() => import('./identity-verification'), { ssr: false });
// export const FollowSettingModal = dynamic(() => import('./modules/follow-setting'), { ssr: false });
// export const NewerRewardModal = dynamic(() => import('./newer-reward-modal'), { ssr: false });
export const SafetyModel = dynamic(() => import('./safety-modal'), { ssr: false });
export const SafetyVerificationModal = dynamic(() => import('./safety-verify-modal'), { ssr: false });
export const SelectCoinModel = dynamic(() => import('./select-coin-modal'), { ssr: false });
export const TransferModal = dynamic(() => import('./transfer'), { ssr: false });
