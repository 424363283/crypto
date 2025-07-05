/** 简单合约实盘持仓columns */
import { AlertFunction } from '@/components/modal/alert-function';
import { closeLiteOrderApi } from '@/core/api';
import { FORMULAS } from '@/core/formulas';
import { useKycState } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { SUBSCRIBE_TYPES, useWs } from '@/core/network';
import { Lite, LiteListItem, LiteTradeItem, MarketsMap, PositionSide, TradeMap } from '@/core/shared';
import { clsx } from '@/core/utils';
import Image from 'next/image';
import { memo, useEffect, useState } from 'react';

const { Position } = Lite;

interface Props {
  onAddMarginClicked: (item: LiteListItem) => void;
  onSettingClicked: (item: LiteListItem) => void;
}

// 合约
const ContractColumn = ({ buy, commodity, lever }: { buy: boolean; commodity: string; lever: number }) => {
  return (
    <div className='code'>
      <Image
        className='icon'
        src={buy ? '/static/images/account/fund/long.png' : '/static/images/account/fund/short.png'}
        alt=''
        width='41'
        height='18'
      />
      <div className='text'>{commodity}</div>
      <div>{lever}x</div>
    </div>
  );
};
// 盈亏比
const IncomeRateColumn = ({ incomeRate }: { incomeRate: number }) => {
  return (
    <div className={`${incomeRate >= 0 ? 'main-green' : 'main-red'}`}>
      {incomeRate >= 0 ? '+' : ''}
      {incomeRate.toFixed(2)}%
    </div>
  );
};
const IncomeRateColumnMemo = memo(IncomeRateColumn);
const ContractColumnMemo = memo(ContractColumn);
export const usePositionColumns = ({ onAddMarginClicked, onSettingClicked }: Props) => {
  const [marketMap, setMarketMap] = useState<MarketsMap>();
  const [liteMap, setLiteMap] = useState<Map<string, LiteTradeItem>>();
  const { isKyc } = useKycState();

  const onClosePosition = (id: string) => {
    AlertFunction({
      content: LANG('请确认是否平仓？'),
      onOk: async () => {
        const res = await closeLiteOrderApi({ id });
      },
      onCancel: () => {
        console.log('cancel close position');
      },
    });
  };

  useEffect(() => {
    TradeMap.getLiteTradeMap().then(async (list) => {
      setLiteMap(list);
    });
  }, []);

  useWs(SUBSCRIBE_TYPES.ws3001, async (detail) => {
    setMarketMap(detail);
  });

  const columns = [
    {
      width: 240,
      title: LANG('合约'),
      dataIndex: 'code',
      render: (v: any, item: LiteListItem) => {
        return <ContractColumnMemo buy={item.buy} commodity={item.commodity} lever={item.lever} />;
      },
    },
    {
      title: LANG('开仓价'),
      dataIndex: 'opPrice',
    },
    {
      title: LANG('最新价'),
      width: 120,
      dataIndex: 'cpPrice',
      render: (v: any, { commodity, contract, priceDigit }: LiteListItem) => {
        if (marketMap) {
          const price = marketMap[contract]?.price || 0;
          const prevPrice = marketMap[contract]?.prevPrice || 0;
          return (
            <span className={Number(price) >= Number(prevPrice) ? 'main-green' : 'main-red'}>
              {price.toFormat(priceDigit) || '--'}
            </span>
          );
        }
        return '--';
      },
    },
    {
      title: LANG('止盈价'),
      dataIndex: 'stopProfitPrice',
      render: (v: any, item: LiteListItem) => {
        const { buy, opPrice, takeProfit, margin, lever, priceDigit } = item;
        const takeProfitRate = Number(takeProfit.div(margin));
        const Fprice = FORMULAS.LITE_POSITION.positionCalculateProfitPrice(
          buy ? PositionSide.LONG : PositionSide.SHORT,
          opPrice,
          takeProfitRate,
          lever
        );
        return Fprice.toFormat(priceDigit);
      },
    },
    {
      title: LANG('强平价'),
      dataIndex: 'stopLossPrice',
      render: (v: any, item: LiteListItem) => {
        const { buy, opPrice, stopLoss, margin, lever, priceDigit } = item;
        const takeProfitRate = Number(stopLoss.div(margin));
        const Fprice = FORMULAS.LITE_POSITION.positionCalculateStopPrice(
          buy ? PositionSide.LONG : PositionSide.SHORT,
          opPrice,
          takeProfitRate,
          lever
        );
        return Fprice.toFormat(priceDigit);
      },
    },
    {
      title: LANG('订单盈亏'),
      width: 120,
      dataIndex: 'income',
      render: (v: any, item: LiteListItem) => {
        const { income } = Position.calculateIncome(item, marketMap ?? null);
        return (
          <div className={`${income >= 0 ? 'main-green' : 'main-red'}`}>
            {income >= 0 ? '+' : ''}
            {income.toFixed(2)}
          </div>
        );
      },
    },
    {
      title: LANG('盈亏比'),
      dataIndex: 'rate',
      render: (v: any, item: LiteListItem) => {
        const { incomeRate } = Position.calculateIncome(item, marketMap ?? null);
        return <IncomeRateColumnMemo incomeRate={incomeRate} />;
      },
    },
    {
      title: LANG('保证金'),
      dataIndex: 'margin',
      render: (v: any, item: LiteListItem) => {
        const lite = liteMap?.get(item.commodityName);
        const canAddMargin = lite ? item.lever > (isKyc ? lite?.lever2List[0] : lite?.lever0List[0]) : false;
        return (
          <div
            className={clsx('margin', canAddMargin ? '' : 'disabled')}
            onClick={() => {
              canAddMargin && onAddMarginClicked(item);
            }}
          >
            {v?.toFormat('all')}
            <Image src='/static/images/account/fund/add_margin.png' width='15' height='15' alt='' className='icon' />
          </div>
        );
      },
    },
    {
      width: 220,
      title: LANG('操作'),
      dataIndex: 'actions',
      align: 'right',
      render: (v: any, item: LiteListItem) => {
        return (
          <div className='actions'>
            <div
              className={clsx('pc-v2-btn-gray', 'btn')}
              onClick={() => {
                onSettingClicked(item);
              }}
            >
              {LANG('设置')}
            </div>
            <div className={clsx('pc-v2-btn-gray', 'btn')} onClick={() => onClosePosition(item.id)}>
              {LANG('平仓')}
            </div>
          </div>
        );
      },
    },
  ];

  return columns;
};
