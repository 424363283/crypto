import { CopyTradeType, CopyTradeSetting } from '@/components/CopyTrading/CopyTradingDetail/Components/types';
import React, { useState } from 'react';
import { useRouter } from '@/core/hooks';
export const useCopyState = () => {
  const userType = (useRouter().query?.userType || '') as string;
  const activeType = (useRouter().query?.copyActiveType || '') as string;
  const [copyUserType, setCopyUserType] = useState(CopyTradeType.traderDetail as string);
  const [copyActiveType, setCopyActiveType] = useState('' as string);
  const [copyUserId, setCopyUserId] = useState(useRouter().query?.id || ('' as any));
  React.useEffect(() => {
    setCopyUserType(userType);
  }, [userType]);

  React.useEffect(() => {
    setCopyActiveType(activeType);
  }, [activeType]);

  React.useEffect(() => {
    setCopyUserId(copyUserId);
  }, [copyUserId]);
  return {
    copyUserType,
    copyActiveType,
    copyUserId
  };
};
