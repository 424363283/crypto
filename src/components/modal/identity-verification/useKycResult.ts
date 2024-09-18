import { useKycState } from '@/core/hooks';
import { isEmpty } from '@/core/utils';
import { useEffect } from 'react';
import { useImmer } from 'use-immer';

export const useKycResult = () => {
  const [state, setState] = useImmer({
    filePage: true,
  });
  const { filePage } = state;
  const { kycState, isKyc } = useKycState();
  const { ready, last } = kycState;

  useEffect(() => {
    if (ready) {
      setState((draft) => {
        draft.filePage = !isKyc && !isEmpty(last);
      });
    }
  }, [ready, isKyc, last]);

  // 重新上传
  const resetFilePage = (showFilePage: boolean = true) => {
    setState((draft) => {
      draft.filePage = showFilePage;
    });
  };
  const showUploadFile = ready && filePage;
  return {
    showUploadFile,
    resetFilePage,
  };
};
