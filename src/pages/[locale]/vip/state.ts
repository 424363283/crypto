import { useKycState } from '@/core/hooks';
import { useUserinfoState } from '@/core/hooks/src/use-userinfo-state';
import { LANG } from '@/core/i18n';
import { Account } from '@/core/shared';
import { message } from '@/core/utils';
import React from 'react';
import { useImmer } from 'use-immer';

const State = () => {
  const level = useUserinfoState()?.userInfo?.level || 0;
  const [state, setState] = useImmer({
    levelData: {
      spot: {
        current: 0,
        target: 0,
      },
      swap: {
        current: 0,
        target: 0,
      },
      asset: {
        current: 0,
        target: 0,
      },
    } as any,
    vipData: {} as any,
    vipLevels: {} as any,
    vipLevelsData: [] as any,
    level,
    isLevel: level !== 0,
  });
  const { isKyc } = useKycState();
  React.useEffect(() => {
    setState((draft) => {
      draft.level = level;
      draft.isLevel = level !== 0;
    });
  }, [level]);
  React.useEffect(() => {
    getVipLevels();
    if (Account.isLogin) {
      getVipData();
    }
  }, []);

  React.useEffect(() => {
    const _level = level === 5 ? 5 : level + 1;
    setState((draft) => {
      draft.levelData = {
        spot: {
          current: state.vipData?.spotAmountMonth || 0,
          target: state.vipLevels['spot']?.[_level]?.trading || 0,
        },
        swap: {
          current: state.vipData?.swapUsdtAmountMonth || 0,
          target: state.vipLevels['swap']?.[_level]?.trading || 0,
        },
        asset: {
          current: state.vipData?.lastBalances || 0,
          target: state.vipLevels['swap']?.[_level]?.balance || 0,
        },
      };
    });
  }, [state.vipData, state.vipLevels, level]);

  React.useEffect(() => {
    if (state.vipLevelsData?.length) {
      setState((draft) => {
        draft.vipLevels = {
          spot: state.vipLevelsData.map((o: any) => getData(o, 'spot')),
          swap: state.vipLevelsData.map((o: any) => getData(o, 'swap')),
        };
      });
    }
  }, [state.vipLevelsData, isKyc]);

  const getData = (items: any, type: string) => {
    const item = items[type] || {};
    return {
      trading: item.trading,
      balance: item.balance,
      makerRate: item.makerRate?.mul(100),
      takerRate: item.takerRate?.mul(100),
      // withdrawal: isKyc ? item.withdraw2 : item.withdraw0,
      withdrawal: item.withdraw2,
      withdrawal0: item.withdraw0,
      withdrawal2: item.withdraw2,
      isKyc,
    };
  };

  // 获取VIP等级设置
  const getVipLevels = async () => {
    try {
      const lists: any = await Account.vip.getVipLevels();
      const data = lists.sort((a: any, b: any) => a.level - b.level);
      setState((draft) => {
        draft.vipLevelsData = data;
      });
    } catch (error) {
      message.error(error);
    }
  };

  // 获取VIP等级数据
  const getVipData = async () => {
    try {
      const data: any = await Account.vip.getVipData();
      setState((draft) => {
        draft.vipData = data;
      });
    } catch (error) {
      message.error(error);
    }
  };

  const vipApply = async (
    data: { account: string; contact: string; content: string; images: any },
    callback: () => void
  ) => {
    try {
      const res: any = await Account.vip.vipApply(data);
      if (res.code === 200) {
        callback();
        message.success(LANG('提交成功'));
      } else {
        message.error(res.message);
      }
    } catch (error) {
      message.error(error);
    }
  };

  return { state, vipApply };
};

export default State;
