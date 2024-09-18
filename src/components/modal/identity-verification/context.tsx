import React, { createContext, useContext } from 'react';
import { useImmer } from 'use-immer';
import { IDENTITY_TYPE } from './types';

// 定义context的类型
type PageState = 'result' | 'init' | 'select-country' | 'onfido-verify' | 'upload-identify' | 'upload-selfie';
interface ApiContextType {
  apiState: {
    pageStep: PageState;
    showUploadPage: boolean;
    sdk_token: string;
    workflow_run_id: string;
    identityNumber: string;
    identityName: string;
    countryId: string;
    identityType: IDENTITY_TYPE;
    img_0: string;
    img_1: string;
    img_2: string;
    verifyState: number;
  };
  setApiState: (f: (draft: ApiContextType['apiState']) => void | ApiContextType['apiState']) => void;
}

// 创建context
const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const useApiContext = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApiContext must be used within a ApiProvider');
  }
  return context;
};

// Provider组件
export const ApiProvider = ({ children }: { children: React.ReactNode }) => {
  const [apiState, setApiState] = useImmer({
    pageStep: 'init' as PageState,
    showUploadPage: false,
    sdk_token: '',
    workflow_id: '',
    identityNumber: '',
    identityType: IDENTITY_TYPE.PASSPORT,
    countryId: '',
    identityName: '',
    img_0: '',
    img_1: '',
    img_2: '',
    verifyState: -1, // [LANG('暂未认证'), LANG('审核中'), LANG('认证失败'), LANG('认证成功')];
  });

  return <ApiContext.Provider value={{ apiState, setApiState }}>{children}</ApiContext.Provider>;
};
