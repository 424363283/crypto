import { useResponsive, useRouter, useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Account, SideType, Spot, SpotOrderType, SpotPositionListItem, SpotTradeItem, TradeMap } from '@/core/shared';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { isLimitType } from '..';
import RecordList from '../../components/record-list';
import { BaseTableStyle } from './base-table-style';
import ClipboardItem from '@/components/clipboard-item';

const { Position } = Spot;

export const getStatus = (state: number) => {

  switch (state) {
    case 1:
      return <div className="spot_ordercancellation">{LANG('等待委托')}</div>;
    case 2:
      return <div className="spot_success">{LANG('委托失败')}</div>;

    case 3:
      return <div className="spot_success">{LANG('已委托')}</div>;
    case 4:
      return <div className="spot_ordercancellation">{LANG('等待撤单')}</div>;
    case 5:
      return <div className="spot_Cancelallorders">{LANG('正在撤单')}</div>;
    case 6:
      return <div className="spot_entrustError">{LANG('全部撤单')}</div>;
    case 7:
      return <div className="spot_entrustError">{LANG('部分成交')}</div>;

    case 8:
      return <div className="spot_success">{LANG('全部成交')}</div>;
  }
};

const OrderHistoryTable = () => {
  const id = useRouter().query.id as string;
  const { theme } = useTheme();
  const { orderHistoryList, loading, hideOther, hideRevoke } = Position.state;
  const isLogin = Account.isLogin;
  const { isTablet } = useResponsive();

  const [spotMap, setSpotMap] = useState<Map<string, SpotTradeItem> | null>(null);

  const filterOrderHistoryList = useMemo(() => {
    let resultList = orderHistoryList;

    if (spotMap) {
      resultList = resultList.map(item => {
        const spotItem = spotMap.get(item.symbol);
        item.dealPrice = item.dealPrice.toFormat(spotItem?.digit);
        item.dealAmount = item.dealAmount.toFormat(4);
        return item;
      });
    }

    if (hideOther) {
      resultList = resultList.filter(({ symbol }) => (hideOther ? symbol === id : true));
    }
    if (hideRevoke) {
      resultList = resultList.filter(({ state }) => (hideRevoke ? state !== 6 : true));
    }
    if (!isLogin) {
      return [];
    }

    return resultList;
  }, [hideOther, hideRevoke, orderHistoryList, id, isLogin, spotMap]);

  const columns = [
    {
      width: 140,
      title: LANG('交易对'),
      dataIndex: 'symbol',
      render: (symbol: string) => symbol.replace('_', '/')
    },
    {
      // title: () => {
      //   return (
      //     <ColSelectTitle
      //       options={{
      //         0: LANG('限价'),
      //         1: LANG('市价'),
      //       }}
      //       value={historyCommissionType === CommissionType.All ? undefined : historyCommissionType}
      //       onChange={(type) => Position.changeHistoryCommissionType(type)}
      //     >
      //       {LANG('委托类型')}
      //     </ColSelectTitle>
      //   );
      // },
      title: LANG('委托类型'),
      dataIndex: 'type',
      width: 100,
      render: (type: SpotOrderType) => (isLimitType(type) ? LANG('限价') : LANG('市价'))
    },
    {
      title: LANG('方向'),
      dataIndex: 'side',
      width: 100,
      render: (side: SideType) =>
        side === SideType.BUY ? (
          <span className="main-raise">{LANG('买')}</span>
        ) : (
          <span className="main-fall">{LANG('卖')}</span>
        )
    },
    {
      title: LANG('平均价格'),
      width: 100,
      dataIndex: 'dealPrice'
    },
    {
      title: LANG('委托价'),
      width: 100,
      dataIndex: 'price',
      render: (_: any, { type, price }: SpotPositionListItem) =>
        type === SpotOrderType.LIMIT ? price?.toFormat() : '-'
    },
    {
      title: LANG('成交数量'),
      width: 100,
      dataIndex: 'dealVolume',
      render: (dealVolume: number) => dealVolume.toFormat()
    },
    {
      title: LANG('数量'),
      width: 100,
      dataIndex: 'volume',
      render: (_: any, { volume }: SpotPositionListItem) => (volume?.toFormat() || '--')
      // render: (_: any, { volume, amount }: SpotPositionListItem) => (volume ? volume.toFormat() : amount.toFormat())
    },
    {
      title: LANG('成交额'),
      width: 100,
      dataIndex: 'dealAmount'
    },
    {
      title: LANG('金额'),
      width: 100,
      dataIndex: 'amount',
      render: (_: any, { amount }: SpotPositionListItem) => (amount?.toFormat() || '--')
    },
    {
      title: LANG('订单编号'),
      dataIndex: 'id',
      width: 100,
      render: (id: any, item: any) => {
        return <ClipboardItem text={id} />
      }
    },
    {
      title: LANG('委托时间'),
      width: 160,
      dataIndex: 'orderTime',
      render: (orderTime: number) => dayjs(orderTime).format('YYYY/MM/DD HH:mm:ss')
    },
    {
      title: LANG('状态'),
      align: 'right',
      width: 120,
      dataIndex: 'state',
      fixed: isTablet ? 'right' : 'none',
      render: (_: any, { volume, dealVolume, state }: SpotPositionListItem) => {
        if (dealVolume > 0 && dealVolume < volume) {
          return LANG('部分成交');
        }
        return getStatus(state);
      }
    }
  ];

  useEffect(() => {
    Position.fetchOrderHistoryList();
    initSpotList();
    setTimeout(() => Position.pollingOrderHistory.start(), 1000);
    return () => {
      Position.pollingOrderHistory.stop();
    };

  }, []);

  const initSpotList = async () => {
    const map = await TradeMap.getSpotTradeMap();
    setSpotMap(map);
  };
  return (
    <>
      <div className="container">
        <RecordList
          loading={loading}
          columns={columns}
          data={filterOrderHistoryList}
          className={`${theme} spot-table`}
          scroll={isTablet && filterOrderHistoryList.length > 0 ? { x: 900, y: 500 } : undefined}
        />
      </div>
      <BaseTableStyle />
    </>
  );
};

export default OrderHistoryTable;
