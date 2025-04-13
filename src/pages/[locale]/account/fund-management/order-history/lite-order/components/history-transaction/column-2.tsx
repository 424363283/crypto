import ClipboardItem from '@/components/clipboard-item';
import Clipboard from '@/components/order-list/lite/components/clipboard';
import { LANG } from '@/core/i18n';
import { Lite, LiteListItem } from '@/core/shared';
import dayjs from 'dayjs';
import Image from 'next/image';

const Position = Lite.Position;

const getType = (item: LiteListItem) => {
  if (item.traderUsername !== null) {
    return (
      <>
        <span>{LANG('跟随____1')}:</span>
        <br />
        <span>{item.traderUsername}</span>
      </>
    );
  } else if (item.followCount && item.followCount > 0) {
    return (
      <>
        <span>{LANG('跟随人数')}:</span>
        <br />
        <span>{item.followCount}</span>
      </>
    );
  } else {
    return item.placeSource;
  }
}

export const column3 = [
  {
    title: LANG('合约'),
    dataIndex: 'contract',
    render: (_: any, { commodityName, currency, lever, buy }: LiteListItem) => {
      return (
        <div className={`first-td flex multi-line`}>
          <span className="liteName">{commodityName?.replace(currency, '')}</span>
          <span className="liteMultiple">{lever}X</span>
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
      return <span className="liteName">{`${margin}`}</span>;
    }
  },
  {
    title: LANG('仓位'),
    dataIndex: 'volume',
    render: (val: number) => {
      return <span className="liteName">{`${val}`}</span>;
    }
  },
  {
    title: `${LANG('开仓价')}/${LANG('平仓价')}`,
    dataIndex: 'opPrice',
    render: (_: any, { opPrice, cpPrice, priceDigit }: LiteListItem) => {
      return (
        <div className="flex multi-line">
          <span className="liteName">{opPrice?.toFormat(priceDigit)}</span>
          <span className="liteName gray">{cpPrice?.toFormat(priceDigit)}</span>
        </div>
      );
    }
  },
  {
    title: `${LANG('订单盈亏')}(${LANG('盈亏比')})`,
    dataIndex: 'income',
    render: (_: any, { income: oldIncome, margin }: LiteListItem) => {
      const income = Number((oldIncome || 0).toFixed(2)) + 0;
      const rate = Number(income.div(margin).mul(100));
      return (
        <div className={`multi-line ${income >= 0 ? 'main-raise' : 'main-fall'}`}>
          <span>
            {income >= 0 ? '+' : ''}
            {income.toFixed(2)}
          </span>

          <p className="gray">
            {rate >= 0 ? '+' : ''}
            {rate.toFixed(2)}%
          </p>
        </div>
      );
    }
  },
  {
    title: `${LANG('止盈')}/${LANG('止损')}`,
    dataIndex: 'takeProfit',
    render: (_: any, { takeProfit, stopLoss }: LiteListItem) => {
      return (
        <div className="flex multi-line">
          <span className="liteName">{takeProfit.toFormat()}</span>
          <span className="liteName negative-text">{stopLoss.toFormat()}</span>
        </div>
      );
    }
  },
  {
    title: LANG('开仓方式'),
    dataIndex: 'placeSource',
    render: (_: any, item: LiteListItem) => {
      return <span className="liteName">{`${getType(item)}`}</span>;
    }
  },
  {
    title: `${LANG('开仓时间')}/${LANG('平仓时间')}`,
    dataIndex: 'opTime',
    render: (_: any, { createTime, tradeTime }: LiteListItem) => {
      return (
        <div className="flex multi-line">
          <span className="liteName" >{dayjs(createTime).format('MM/DD HH:mm:ss')}</span>
          <span className="gray liteName">{dayjs(tradeTime).format('MM/DD HH:mm:ss')}</span>
        </div>
      );
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
  }
  
];
