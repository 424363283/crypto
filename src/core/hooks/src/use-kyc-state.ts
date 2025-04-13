import { Account } from '@/core/shared';
import React from 'react';
import { useImmer } from 'use-immer';

interface Last {
  id: string;
  level: number;
  country: string;
  identityName: string | null;
  identityType: number;
  identityNumber: string;
  images: string[];
  state: number;
  remark: string;
  auditTime: number;
  createTime: number;
}
export const useKycState = (isRefresh = false) => {
  const [kycState, setState] = useImmer({
    isLoadingKycState: true,
    kyc: 0, // 暂未认证
    last: {} as Last,
    ready: false
  });

  // 获取kyc状态
  const updateKYCAsync = async (isRefresh = false) => {
    try {
      const result = isRefresh ? await Account.refreshKycStatus() : await Account.getKycStatus();
      const userInfo = await Account.getUserInfo();
      const { last } = result || {};
      setState(draft => {
        draft.last = last;
        draft.ready = true;
      });
      if (userInfo?.verified) {
        setState(draft => {
          draft.kyc = 3; // 认证成功
        });
      } else {
        if (last === null) {
          setState(draft => {
            draft.kyc = 0; // 暂未认证
          });
        } else if (last.state === 0) {
          setState(draft => {
            draft.kyc = 1; // 审核中
          });
        } else if (last.state === 2) {
          setState(draft => {
            draft.kyc = 2; // 认证失败
          });
        }
      }
      setState(draft => {
        draft.isLoadingKycState = false;
      });
    } catch (error) {
      setState(draft => {
        draft.ready = true;
        draft.isLoadingKycState = false;
      });
    }
  };
  React.useEffect(() => {
    updateKYCAsync(isRefresh);
  }, []);
  const isKyc = kycState.kyc === 3; // 认证成功
  let { state } = kycState?.last || {};
  state = isKyc ? 1 : state;
  const disabled = state === 1 || state === 0; // 审核中或已通过时禁用按钮
  return {
    isLoadingKycState: kycState.isLoadingKycState,
    isKyc,
    kycState,
    updateKYCAsync,
    disabled,
    state
  };
};
