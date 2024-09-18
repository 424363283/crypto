import Tooltip from '@/components/trade-ui/common/tooltip';
import { useKycState } from '@/core/hooks';
import { useUserinfoState } from '@/core/hooks/src/use-userinfo-state';
import { LANG } from '@/core/i18n';
import { Account } from '@/core/shared';
import React, { useEffect } from 'react';
import { useImmer } from 'use-immer';
import { MyFeeView } from './components/my-fee-view';

export const MyFee = () => {
  const { isKyc } = useKycState();
  const level = useUserinfoState()?.userInfo?.level || 0;
  const [state, setState] = useImmer({
    vipLevels: {} as any,
    vipLevelsData: [] as any,
  });

  // 获取VIP等级设置
  const getVipLevels = async () => {
    try {
      const lists: any = await Account.vip.getVipLevels();
      const data = lists.sort((a: any, b: any) => a.level - b.level);
      setState((draft) => {
        draft.vipLevelsData = data;
      });
    } catch (error) {}
  };
  useEffect(() => {
    getVipLevels();
  }, []);
  const getData = (items: any, type: string) => {
    const item = items[type];
    return {
      trading: item.trading,
      balance: item.balance,
      makerRate: item.makerRate.mul(100),
      takerRate: item.takerRate.mul(100),
      // withdrawal: isKyc ? item.withdraw2 : item.withdraw0,
      withdrawal: item.withdraw2,
      withdrawal0: item.withdraw0,
      withdrawal2: item.withdraw2,
      isKyc,
    };
  };

  React.useEffect(() => {
    if (state.vipLevelsData?.length) {
      setState((draft) => {
        draft.vipLevels = {
          swap: state.vipLevelsData.map((o: any) => getData(o, 'swap')),
        };
      });
    }
  }, [state.vipLevelsData, isKyc]);
  const item = state.vipLevels?.swap?.[level];

  return (
    <>
      <div className='my-fee'>
        <div></div>
        <Tooltip title={<MyFeeView item={item} level={level} />}>
          <div className='text'>{LANG('手续费等级')}</div>
        </Tooltip>
      </div>
      <style jsx>{`
        .my-fee {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          padding-bottom: 16px;
          .text {
            cursor: pointer;
            color: var(--skin-color-active);
          }
        }
      `}</style>
    </>
  );
};
