import { Button } from '@/components/button';
import ClipboardItem from '@/components/clipboard-item';
import { Size } from '@/components/constants';
import { ScaleText } from '@/components/scale-text';
import { cancelLitePlanOrderApi } from '@/core/api';
import { FORMULAS } from '@/core/formulas';
import { LANG } from '@/core/i18n';
import { Lite, LoadingType, PositionSide, TPlanCommission } from '@/core/shared';
import { message } from '@/core/utils';
import dayjs from 'dayjs';
import { Loading } from '@/components/loading';
import Clipboard from '@/components/order-list/lite/components/clipboard';

const Position = Lite.Position;
const onRevokeBtnClicked = async (id: string) => {
  Loading.start();
  const res = await cancelLitePlanOrderApi(id);
  if (res.code === 200) {
    Position.fetchPendingList(LoadingType.Show);
    message.success(LANG('撤单委托已提交'));
  }
  Loading.end();
}

const columns0 = [
  {
    title: LANG('合约'),
    dataIndex: 'contract',
    
    render: (_: any, { commodityName, currency, lever, buy }: TPlanCommission) => {
      return (
        <div className={`first-td flex multi-line `}>
          <span className="liteName">{commodityName?.replace(currency, '')}</span>
          <span className="liteMultiple lever">{lever}x</span>
        </div>
      );
    }
  },
  {
    title: LANG('方向'),
    dataIndex: 'contract',
    
    render: (_: any, { buy }: TPlanCommission) => {
      return (
        <div className={`first-td flex ${buy ? 'raise' : 'fall'}`}>
          <span className="liteName">{buy ? LANG('买入') : LANG('卖出')}</span>
        </div>
      );
    }
  },
  {
    title: LANG('保证金'),
    dataIndex: 'margin',
    
    render: (margin: number) => {
      return <span className="liteName">{margin}</span>;
    }
  },
  {
    title: LANG('委托价'),
    
    dataIndex: 'triggerPrice',
    render: (triggerPrice: number, { currency }: TPlanCommission) => {
      return (
        <span className="liteName">
          {triggerPrice}
        </span>
      );
    }
  },
  {
    title: LANG('委托成交价'),
    dataIndex: 'safetyPrice',
    
    render: (v: any, item: TPlanCommission) => {
      return (
        <span className={`${item.buy ? 'positive-text' : 'negative-text'}`}>
          {item?.safetyPrice ? item?.safetyPrice?.toFormat(item.priceDigit) : '--'}
        </span>
      );
    }
    // ,
  },
  {
    title: `${LANG('止盈价')}/${LANG('强平价')}`,
    dataIndex: 'opPrice',
    
    render: (_: any, item: TPlanCommission) => {
      const { buy, triggerPrice, takeProfit, stopLoss, margin, lever, priceDigit } = item;
      const takeProfitRate = Number(takeProfit.div(margin));
      const stopLossRate = Number(stopLoss.div(margin));
      const Fprice = FORMULAS.LITE_POSITION.positionCalculateProfitPrice(
        buy ? PositionSide.LONG : PositionSide.SHORT,
        triggerPrice,
        takeProfitRate,
        lever
      );
      const Lprice = FORMULAS.LITE_POSITION.positionCalculateStopPrice(
        buy ? PositionSide.LONG : PositionSide.SHORT,
        triggerPrice,
        stopLossRate,
        lever
      );
      return (
        <div className="flex multi-line">
          <span className="liteName ">{Fprice.toFormat(priceDigit)}</span>
          <span className="accent-text">{Lprice.toFormat(priceDigit)}</span>
        </div>
      );
    }
  },
  {
    title: LANG('挂单时间'),
    dataIndex: 'opTime',
    
    render: (_: any, { createTime }: TPlanCommission) => {
      return (
        <div className="flex">
          <span className="liteName">{dayjs(createTime).format('MM/DD HH:mm:ss')}</span>
        </div>
      )
    }
  },
  {
    title: LANG('订单号'),
    dataIndex: 'id',
    
    render: (id: string) => {
      return (
        <div className="liteOrderid">
          <span style={{}}>
            {id.slice(0, 5)}...
            {id.slice(id.length - 5)}
          </span>
          <Clipboard text={id} />
        </div>
      );
    }
  },
  {
    title: LANG('是否递延'),
    dataIndex: 'defer',
    render: (defer: boolean) => {
      return (
        <span className="liteName" >
          {defer ? LANG('是') : LANG('否')}
        </span>
      );
    }
  },
  {
    title: LANG('操作'),
    
    align: 'right',
    render: (_: any, { id }: TPlanCommission) => {
      return (
        <div className="operationWrapper">
          <Button
            rounded
            width={72}
            size={Size.SM}
            style={{ margin: 'auto', marginRight: 0 }}
            onClick={() => onRevokeBtnClicked(id)}
          >
            {LANG('撤单')}
          </Button>
        </div>
      );
    }
  }
];
export { columns0 };
