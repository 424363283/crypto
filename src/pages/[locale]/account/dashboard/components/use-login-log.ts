import { Loading } from '@/components/loading';
import { getLoginHistoryApi } from '@/core/api';
import { formatDate, message } from '@/core/utils';
import { useEffect } from 'react';
import { useImmer } from 'use-immer';

export const useUpdateLoginLog = () => {
  const [state, setState] = useImmer({
    current: 1,
    dataSource: [] as any[],
    total: 0,
    lastLoginLog: { date: '' },
  });
  const { dataSource, lastLoginLog, current, total } = state;
  // 获取登录记录
  const updateLoginLog = async (page: number) => {
    try {
      Loading.start();
      const result = await getLoginHistoryApi({
        page,
        rows: 10,
      });
      if (result.code === 200) {
        const { list, count } = result.data;
        setState((draft) => {
          draft.current = page;
          draft.total = count;
          draft.dataSource = list.map((element, key) => {
            const { time, location, agent, terminal, ip, region } = element;
            return {
              key,
              date: formatDate('y-m-d h:i:s', { date: time }),
              location,
              agent,
              region,
              terminal,
              ip,
            };
          });
        });
      } else {
        message.error(result.message);
      }
    } catch (error: any) {
      setState((draft) => {
        draft.current = page;
      });
      message.error(error.message);
    }
    Loading.end();
  };
  useEffect(() => {
    updateLoginLog(1);
  }, []);
  useEffect(() => {
    if (current === 1) {
      setState((draft) => {
        draft.lastLoginLog = dataSource[0];
      });
    }
  }, [current, dataSource]);

  return {
    updateLoginLog,
    current,
    dataSource,
    total,
    lastLoginLog,
  };
};
