import { closeSpotOrderApi } from '@/core/api';
import { useResponsive, useRouter, useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Account, LoadingType, SideType, Spot, SpotOrderType, SpotPositionListItem } from '@/core/shared';
import { message } from '@/core/utils';
import dayjs from 'dayjs';
import { useCallback, useMemo } from 'react';
import { isLimitType } from '..';
import RecordList from '../../components/record-list';
// import RecordList, { ColSortTitle } from '@/components/order-list/components/record-list';
import { BaseTableStyle } from './base-table-style';
import ClipboardItem from '@/components/clipboard-item';

const { Position } = Spot;
// import { clsx, styles } from '@/components/order-list/swap/media/desktop/components/position-list/styled.ts';

const OrderTable = () => {
  const id = useRouter().query.id as string;
  const { theme } = useTheme();
  const { orderList, loading, hideOther, positionCommissionType } = Position.state;
  const { isTablet } = useResponsive();

  const isLogin = Account.isLogin;

  const onRevokePositionClicked = useCallback(async (id: string) => {
    const res = await closeSpotOrderApi([id]);
    if (res.code === 200) {
      message.success(LANG('撤单成功'));
      Position.fetchPositionList(LoadingType.Show);
    } else {
      message.error(res.message);
    }
  }, []);

  const filterOrderList = useMemo(() => {
    let resultList = orderList;
    if (hideOther) {
      resultList = resultList.filter(({ symbol }) => (hideOther ? symbol === id : true));
    }
    if (!isLogin) {
      return [];
    }
    // 隐藏网格委托单
    resultList = resultList.filter(({ openType }) => openType !== 1 && openType !== 4);

    return resultList;
  }, [hideOther, orderList, id, isLogin]);

  const columns = [
    {
      title: LANG('交易对'),
      dataIndex: 'symbol',
      minWidth: 130,
      render: (symbol: string) => symbol.replace('_', '/'),
    },
    {
      // title: () => {
      //   return (
      //     <ColSelectTitle
      //       options={{
      //         0: LANG('限价'),
      //         1: LANG('市价'),
      //       }}
      //       value={positionCommissionType === CommissionType.All ? undefined : positionCommissionType}
      //       onChange={(type) => Position.changePositionCommissionType(type)}
      //     >
      //       {LANG('委托类型')}
      //     </ColSelectTitle>
      //   );
      // },
      title: LANG('委托类型'),
      dataIndex: 'type',
      minWidth: 86,
      render: (type: SpotOrderType) => (isLimitType(type) ? LANG('限价') : LANG('市价')),
    },
    {
      title: LANG('方向'),
      dataIndex: 'side',
      minWidth: 98,
      render: (side: SideType) =>
        side === SideType.BUY ? (
          <span className='main-green'>{LANG('买')}</span>
        ) : (
          <span className='main-red'>{LANG('卖')}</span>
        ),
    },
    {
      title: LANG('委托价'),
      dataIndex: 'price',
      minWidth: 120,
      render: (price: number) => price?.toFormat(),
    },
    {
      title: LANG('委托量'),
      dataIndex: 'volume',
      minWidth: 120,
      render: (price: number) => price?.toFormat(),
    },
    {
      title: LANG('已成交'),
      dataIndex: 'dealVolume',
      minWidth: 81,
      render: (price: number) => price?.toFormat(),
    },
    {
      title: LANG('未成交'),
      dataIndex: 'dealVolume2',
      minWidth: 119,
      render: (_: any, { volume, dealVolume }: SpotPositionListItem) => volume.sub(dealVolume).toFormat(),
    },
    {
      title: LANG('委托金额'),
      dataIndex: 'amount',
      minWidth: 128,
      render: (amount: number) => amount.toFormat(4),
    },
    {
      title: LANG('订单编号'),
      dataIndex: 'id',
      minWidth: 128,
      render: (id: any, item: any) => {
        return <ClipboardItem text={id} />
      }
    },
    {
      title: LANG('时间'),
      // width: 160,
      dataIndex: 'orderTime',
      minWidth: 128,
      render: (orderTime: number) => dayjs(orderTime).format('YYYY/MM/DD HH:mm:ss'),
    },
    {
      title: LANG('操作'),
      align: 'right',
      dataIndex: 'id',
      fixed: isTablet ? 'right' : 'none',
      render: (id: string) => (
        <div className='operationWrapper'>
          <button className='revoke-btn' onClick={() => onRevokePositionClicked(id)}>
            {LANG('撤单')}
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className='container'>   
        <RecordList
          loading={loading}
          columns={columns}
          data={filterOrderList}
          className={`${theme} spot-table`}
          scroll={isTablet && filterOrderList.length > 0 ? { x: 900, y: 500 } : undefined}
        />
      </div>
      <BaseTableStyle />
    </>
  );
};

export default OrderTable;
