import { CopyTradeType, CopyTradeSetting } from '@/components/CopyTrading/CopyTradingDetail/Components/types';
import React, { useState } from 'react';
import { useRouter } from '@/core/hooks';
import { Copy } from '@/core/shared';
import { useCopyTradingSwapStore } from '@/store/copytrading-swap';
export const useCopyState = () => {
  const router = useRouter();
  const userType = (useRouter().query?.userType || '') as string;
  const activeType = (useRouter().query?.copyActiveType || '') as string;
  const userId =  (useRouter().query?.id || '') as string;
  const [copyUserType, setCopyUserType] = useState(CopyTradeType.traderDetail as string);
  const [copyActiveType, setCopyActiveType] = useState('' as string);
  const [copyUserId, setCopyUserId] = useState();
   const isCopyTrader = useCopyTradingSwapStore.use.isCopyTrader();
    const isFetchCopyTrader = useCopyTradingSwapStore.use.isFetchCopyTrader();
  React.useEffect(() => {
    setCopyUserType(userType);
  }, [userType]);

  React.useEffect(() => {
    setCopyActiveType(activeType);
  }, [activeType]);

  React.useEffect(() => {
    setCopyUserId(copyUserId);
  }, [copyUserId]);


  // React.useEffect(async () => {
  //   const userInfo: any = await Copy.getUserInfo();
  //   if (!Copy.isLogin() && (userType === CopyTradeType.myFllow || userType === CopyTradeType.myBring)) {
  //     router.push(`/login`);
  //   }  else if (Copy.isLogin() && isFetchCopyTrader && userType === CopyTradeType.myFllow && !isCopyTrader) {
  //      router.replace({
  //         pathname: `/copyTrade/${copyUserId}`,
  //         query: {
  //           userType: CopyTradeType.myBring
  //         }
  //       },undefined, { shallow: true });
  //   }
  // }, [userId,userType,activeType,isFetchCopyTrader,isCopyTrader]);
  return {
    copyUserType,
    copyActiveType,
    copyUserId
  };
};
