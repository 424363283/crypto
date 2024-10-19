import { UserContext } from '@/context';
import { api, http } from '@/service';
import { useInterval } from 'ahooks';
import { useContext, useEffect, useState } from 'react';
/**
 * 
 * @param loopTimer 定时任务时间 >5000 (防止太频繁)
 * @returns 
 */
export function useCopyTradingUserInfo(loopTimer?: number) {
  const { isLogin } = useContext(UserContext);
  const [ctUser, setCtUser] = useState<Trader>();

  const fetchUserInfo = () => {
    if (isLogin) {
      http({
        url: api.ctUserInfo,
        timeout: 0,
        method: 'GET'
      }).then(({ data }) => {
        const trader: Trader = data?.data;
        if (trader && ctUser?.accountId !== trader?.accountId) {
          setCtUser(trader);
        }
      });
    } else {
      setCtUser(undefined);
    }
  };


  const cancelInterval = useInterval(() => {
    if (isLogin) fetchUserInfo();
  }, loopTimer && loopTimer > 5000 ? loopTimer : undefined, { immediate: true });


  useEffect(() => cancelInterval, []);
  useEffect(() => { fetchUserInfo(); }, [isLogin]);

  return {
    ctUser,
    fetchUserInfo,
  };
}
