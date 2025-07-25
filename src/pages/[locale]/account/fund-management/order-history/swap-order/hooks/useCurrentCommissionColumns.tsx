import CommonIcon from '@/components/common-icon';
import { Loading } from '@/components/loading';
import { LeverItem } from '@/components/order-list/swap/media/desktop/components/lever-item';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { MediaInfo, clsx, message } from '@/core/utils';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import css from 'styled-jsx/css';
import { checkIsUsdtType } from '../../../assets-overview/helper';

import { isSwapDemo } from '@/core/utils/src/is';
import ClipboardItem from '@/components/clipboard-item';
import { WalletName } from '@/components/order-list/swap/media/desktop/components/wallet-name';
const _isSwapDemo = isSwapDemo();
export const useCurrentCommissionColumns = ({ onRefresh }: { onRefresh: any }) => {
  const isUsdtType = checkIsUsdtType();
  useEffect(() => {
    Swap.fetchInitData();
    return Swap.fetchInitData();
  }, []);
  Swap.Assets.getWallet({ usdt: isUsdtType });
  Swap.Info.store.cryptoDataMap;
  const onCancelOrder = async (item: any) => {
    Loading.start();
    try {
      const result = await Swap.Order.cancelPending(item, { refreshData: false });
      if (result.code == 200) {
        onRefresh();
        message.success(LANG('撤销成功'));
      } else {
        message.error(result);
      }
    } catch (error: any) {
      message.error(error);
    } finally {
      Loading.end();
    }
  };
  const formatItemVolume = (v: any, item: any) => {
    const isSpslType = ['2', '1'].includes(`${item['strategyType']}`);
    const isLimit = ['1', '4'].includes(item['type']);
    const digit = Swap.Info.getVolumeDigit(item.symbol, { withHooks: false });

    // /* 
    //   当前委托-止盈止损这里委托数据显示0；如果接口返回closePostion=true，
    //   委托数量取positionVolume的值，如果closePostion=false，委托数量取volume的值。 
    // */
    // if (item.closePosition) {
    //   return item.positionVolume
    // }
    return Swap.Calculate.formatPositionNumber({
      usdt: isUsdtType,
      code: item.symbol,
      value: v || 0,
      fixed: isUsdtType ? digit : Number(item.basePrecision),
      flagPrice: isSpslType && !isLimit ? item.triggerPrice : item.price,
    });
  };

  const columns = [

    {
      title: LANG('合约'),
      dataIndex: 'code',
      render: (v: any, item: any) => {
        const positionPattern = item.marginType === 1 ? LANG('全仓') : LANG('逐仓');
        const leverageLevel = item.leverageLevel;
        return (
          <div className='multi-line-item'>
            <div style={{ display: 'flex', alignItems: 'center' }} className='contract'>
              {Swap.Info.getCryptoData(item.symbol, { withHooks: false }).name}
              {!!Number(leverageLevel) && <LeverItem lever={leverageLevel} />}
            </div>
            <span>{positionPattern}</span>
            <style jsx>{styles}</style>
          </div>
        );
      },
    },
    {
      title: LANG('账户'),
      dataIndex: 'subWallet',
      render: (v: any, item: any) => {
        const walletData = Swap.Assets.getWallet({ walletId: item.subWallet, usdt: isUsdtType, withHooks: false });
        return (
          <WalletName> {LANG(walletData?.alias)} </WalletName>
        );
      },
    },
    {
      title: LANG('类型'),
      dataIndex: 'type',
      render: (v: any, item: any) => {
        const data = Swap.Order.formatPendingType(item);
        if (item.orderType === 3) {
          return LANG('追踪委托');
        }
        return [data['type'], data['strategyType'], data['side']].filter((e) => !!e).join('/');
      },
    },
    {
      title: LANG('方向'),
      dataIndex: 'side',
      render: (side: string) => {
        const isBuy = side === '1';
        return <span className={isBuy ? 'raise' : 'fall'}>{isBuy ? LANG('买入') : LANG('卖出')}</span>;
      },
    },
    {
      title: LANG('价格'),
      dataIndex: 'price',
      render: (price: number, item: any) => (price ? Number(price).toFixed(Number(item.baseShowPrecision)) : '--'),
    },
    {
      title: `${LANG('数量')}/${LANG('完成度')}`,
      dataIndex: 'volume',
      render: (v: any, item: any) => {
        const content = (
          <span>
            <span>{formatItemVolume(v, item)}</span>
            /
            <span className={clsx('inline-block')} style={{ color: 'var(--skin-primary-color)' }}>
              ({formatItemVolume(item.dealVolume, item)})
            </span>
            &nbsp;
            {Swap.Info.getUnitText({ symbol: item.symbol, withHooks: false })}
          </span>
        );
        if (item['closePosition'] === true) {
          return LANG('全部平仓');
        }
        return content;
      },
    },

    {
      title: LANG('触发条件'),
      dataIndex: 'orderType',
      render: (orderType: number, item: any) => {
        if (![2, 3].includes(orderType)) {
          return '--';
        }
        let triggerPrice = item.triggerPrice;
        if (item.orderType === 3 && !triggerPrice && item.activationPrice) {
          triggerPrice = item.activationPrice;
        }
        if (!triggerPrice) {
          return '--';
        }
        return `${item.priceType === '1' ? LANG('最新价格') : LANG('标记价格')} ${item.direction === '1' ? '≥' : '≤'
          } ${Number(triggerPrice).toFixed(Number(item.baseShowPrecision))}`;
      },
    },
    {
      title: LANG('平仓'),
      dataIndex: 'closePosition',
      render: (v: any, item: any) => (v ? LANG('是') : LANG('否')),
    },
    {
      title: LANG('只减仓'),
      dataIndex: 'ordFlag',
      render: (v: any, item: any) => (v ? LANG('是') : LANG('否')),
    },
    {
      minWidth: 100,
      title: LANG('订单编号'),
      dataIndex: 'orderId',
      render: (orderId: any, item: any) => {
        return <ClipboardItem text={orderId} />
      }
    },
    {
      title: LANG('委托时间'),
      dataIndex: 'ctime',
      render: (time: string) => (
        <div className='ctime'>
          <div className='date'>{dayjs(time).format('YYYY-MM-DD')}</div>
          <div className='time'>{dayjs(time).format('HH:mm:ss')}</div>
        </div>
      ),
    },
    {
      title: LANG('操作'),
      dataIndex: 'actions',
      align: 'right',
      render: (v: any, item: any) => (
        <div onClick={() => onCancelOrder(item)}>
          <CommonIcon name='common-delete-0' size={16} />
        </div>
      ),
    },
  ];

  return columns;
};
const styles = css`
  :global(.mobile-table-card) {
    :global(.multi-line-item .contract) {
      @media ${MediaInfo.mobileOrTablet} {
        display: flex;
        justify-content: end;
      }
    }
  }
`;
