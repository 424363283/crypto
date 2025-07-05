import { Loading } from '@/components/loading';
import { cancelLitePlanOrderApi } from '@/core/api';
import { FORMULAS } from '@/core/formulas';
import { LANG } from '@/core/i18n';
import { PositionSide, TPlanCommission } from '@/core/shared';
import { clsx, message } from '@/core/utils';
import Image from 'next/image';

export const usePlanCommissionColumns = () => {
  const handleAction = async (id: string) => {
    Loading.start();
    const res = await cancelLitePlanOrderApi(id);
    if (res.code === 200) {
      message.success(LANG('撤单委托已提交'));
    }
    Loading.end();
  };
  return [
    {
      width: 240,
      title: LANG('合约'),
      dataIndex: 'code',
      render: (v: any, item: TPlanCommission) => {
        return (
          <div className='code'>
            <Image
              className='icon'
              src={item.buy ? '/static/images/account/fund/long.png' : '/static/images/account/fund/short.png'}
              width={41}
              height={18}
              alt=''
            />
            <div className='text'>{item.commodity}</div>
            <div>{item.lever}x</div>
          </div>
        );
      },
    },
    {
      title: LANG('委托价'),
      dataIndex: 'triggerPrice',
      render: (v: any, item: TPlanCommission) => {
        return v?.toFormat(item.priceDigit);
      },
    },
    {
      title: LANG('委托成交价'),
      dataIndex: 'triggerPrice',
      render: (v: any, item: TPlanCommission) =>
        item?.safetyPrice ? item?.safetyPrice?.toFormat(item.priceDigit) : '--',
    },
    {
      title: LANG('止盈价'),
      dataIndex: 'takeProfit',
      render: (v: any, item: TPlanCommission) => {
        const { buy, triggerPrice, takeProfit, margin, lever, priceDigit } = item;
        const takeProfitRate = Number(takeProfit.div(margin));
        const Fprice = FORMULAS.LITE_POSITION.positionCalculateProfitPrice(
          buy ? PositionSide.LONG : PositionSide.SHORT,
          triggerPrice,
          takeProfitRate,
          lever
        );
        return Fprice.toFormat(priceDigit);
      },
    },
    {
      title: LANG('强平价'),
      dataIndex: 'stopLossPrice',
      render: (v: any, item: TPlanCommission) => {
        const { buy, triggerPrice, stopLoss, margin, lever, priceDigit } = item;
        const stopLossRate = Number(stopLoss.div(margin));
        const Lprice = FORMULAS.LITE_POSITION.positionCalculateStopPrice(
          buy ? PositionSide.LONG : PositionSide.SHORT,
          triggerPrice,
          stopLossRate,
          lever
        );
        return Lprice.toFormat(priceDigit);
      },
    },
    {
      title: LANG('保证金'),
      dataIndex: 'margin',
      render: (v: any) => v?.toFormat('all'),
    },
    {
      width: 220,
      title: LANG('操作'),
      dataIndex: 'actions',
      align: 'right',
      render: (v: any, item: TPlanCommission) => {
        return (
          <div className='action'>
            <div className={clsx('pc-v2-btn-gray', 'action-btn')} onClick={() => handleAction(item.id)}>
              {LANG('撤单')}
            </div>
          </div>
        );
      },
    },
  ];
};
