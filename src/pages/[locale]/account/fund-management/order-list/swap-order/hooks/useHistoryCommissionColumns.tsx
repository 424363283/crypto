import { LeverItem } from '@/components/order-list/swap/media/desktop/components/lever-item';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { MediaInfo } from '@/core/utils';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import css from 'styled-jsx/css';
import { checkIsUsdtType } from '../../../assets-overview/helper';
import { SWAP_HISTORY_ORDER_STATUS, SWAP_HISTORY_ORDER_TYPES } from '../constants';

export const useHistoryCommissionColumns = () => {
  const isUsdtType = checkIsUsdtType();
  useEffect(() => {
    return Swap.fetchInitData();
  }, []);
  Swap.Assets.getWallet({ usdt: isUsdtType });
  const columns = [
    {
      title: LANG('时间'),
      dataIndex: 'ctime',
      render: (time: number) => (
        <div className='ctime'>
          <div className='date'>{dayjs(time).format('YYYY-MM-DD')}</div>
          <div className='time'>{dayjs(time).format('HH:mm:ss')}</div>
        </div>
      ),
    },
    {
      title: LANG('合约'),
      dataIndex: 'code',
      render: (v: any, item: any) => {
        const positionPattern = item.marginType === 1 ? LANG('全仓') : LANG('逐仓');
        const leverageLevel = item.leverageLevel;
        return (
          <div className='multi-line-item'>
            <div style={{ alignItems: 'center' }} className='contract'>
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
      title: LANG('类型'),
      dataIndex: 'type',
      render: (type: string, v: any) => {
        type = type === '5' ? '2' : type;
        // orderType
        // 1：委托单 2：条件单
        // strategyType
        // 策略类型：1=止盈 2=止损
        const map: any = { 1: LANG('市价止盈'), 2: LANG('市价止损') };
        const key = v.orderType === 2 ? map[v.strategyType] : SWAP_HISTORY_ORDER_TYPES[type];
        return key;
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
      title: LANG('平均价格'),
      dataIndex: 'avgPrice',
      render: (avgPrice: string, item: any) => {
        return avgPrice ? Number(avgPrice).toFormat(Number(item.baseShowPrecision)) : '--';
      },
    },
    {
      title: LANG('价格'),
      dataIndex: 'price',
      render: (price: string, item: any) => {
        return price ? Number(price).toFormat(Number(item.baseShowPrecision)) : '--';
      },
    },
    {
      title: LANG('成交数量') + '/' + LANG('数量'),
      dataIndex: 'dealVolume',
      width: 160,
      render: (v: any, item: any) => {
        const digit = Swap.Info.getVolumeDigit(item.symbol, { withHooks: false });
        return (
          <div style={{ whiteSpace: 'nowrap' }}>
            <span style={{ color: 'var(--skin-primary-color)' }}>
              {Swap.Calculate.formatPositionNumber({
                usdt: checkIsUsdtType(),
                code: item.symbol,
                value: item.dealVolume || 0,
                fixed: digit,
                flagPrice: Number(item.avgPrice) || Number(item.price),
              })}
            </span>
            /
            <span>
              {Swap.Calculate.formatPositionNumber({
                usdt: checkIsUsdtType(),
                code: item.symbol,
                value: item.volume || 0,
                fixed: digit,
                flagPrice: Number(item.avgPrice) || Number(item.price),
              })}
              &nbsp;
              {Swap.Info.getUnitText({ symbol: item.symbol, withHooks: false })}
            </span>
          </div>
        );
      },
    },
    {
      title: LANG('触发条件'),
      align: 'right',
      dataIndex: 'orderType',
      render: (orderType: number, item: any) => {
        if (orderType !== 2) {
          return '--';
        }
        return `${item.priceType === '1' ? LANG('市场价格') : LANG('标记价格')} ${
          item.direction === '1' ? '≥' : '≤'
        } ${Number(item.triggerPrice).toFixed(4)}`;
      },
    },
    {
      title: LANG('状态'),
      dataIndex: 'status',
      align: 'right',
      render: (status: string) => {
        return SWAP_HISTORY_ORDER_STATUS[status];
      },
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
