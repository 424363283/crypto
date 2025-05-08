import { useRouter, useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Account, HistoryRange, SideType, Spot, SpotPositionListItem } from '@/core/shared';
import { Dropdown, MenuProps } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useMemo } from 'react';
import css from 'styled-jsx/css';
import RecordList from '../../components/record-list';
import { BaseTableStyle } from './base-table-style';
import clsx from 'clsx';
import ClipboardItem from '@/components/clipboard-item';

const { Position } = Spot;

const columns = [


  {
    title: LANG('交易对'),
    dataIndex: 'symbol',
    width: 80,
    render: (symbol: string) => symbol.replace('_', '/')
  },
  {
    title: LANG('方向'),
    dataIndex: 'side',
    width: 80,
    render: (side: SideType) =>
      side === SideType.BUY ? (
        <span className="main-raise">{LANG('买')}</span>
      ) : (
        <span className="main-fall">{LANG('卖')}</span>
      )
  },
  {
    title: LANG('成交均价'),
    dataIndex: 'price',
    width: 80,
    render: (price: number) => price?.toFormat()
  },
  {
    title: LANG('成交数量'),
    dataIndex: 'volume',
    width: 80,
    render: (volume: number) => volume.toFormat()
  },
  {
    title: LANG('手续费'),
    dataIndex: 'fee',
    width: 80,
    render: (_: any, { fee, targetCoin, openType }: SpotPositionListItem) => {
      return `${fee.toFormat()} ${openType === 2 ? 'USDT' : targetCoin}`;
    }
  },
  {
    title: LANG('成交金额'),
    // align: 'right',
    width: 80,
    dataIndex: 'amount',
    render: (_: any, { amount, sourceCoin, side, targetCoin }: SpotPositionListItem) => {
      return <span>{`${amount.toFormat(4)} ${side === SideType.BUY ? sourceCoin : targetCoin}`}</span>;
    }
  },
  {
    title: LANG('订单编号'),
    dataIndex: 'id',
    width: 80,
    render: (id: any, item: any) => {
      return <ClipboardItem text={id} />
    }
  },
  {
    title: LANG('成交时间'),
    width: 80,
    align: 'right',
    dataIndex: 'dealTime',
    render: (dealTime: number) => dayjs(dealTime).format('YYYY/MM/DD HH:mm:ss')
  },

];

const optionsList = [
  {
    value: HistoryRange.DAY,
    label: LANG('本日')
  },
  {
    value: HistoryRange.WEEK,
    label: LANG('本周')
  },
  {
    value: HistoryRange.MONTH,
    label: LANG('本月')
  },
  {
    value: HistoryRange.THREE_MONTH,
    label: LANG('近三月')
  }
];

const items: MenuProps['items'] = optionsList.map(item => {
  return {
    id: item.value,
    key: item.label,
    label: <div onClick={() => Position.changeHistoryRange(item.value)}>{item.label}</div>
  };
});

const TradeHistoryTable = () => {
  const id = useRouter().query.id as string;
  const { theme } = useTheme();
  const { tradeHistoryList, loading, hideOther, historyRange, orderList } = Position.state;
  const isLogin = Account.isLogin;

  const filterTradeHistoryList = useMemo(() => {
    let resultList = tradeHistoryList;
    if (hideOther) {
      resultList = resultList.filter(({ symbol }) => (hideOther ? symbol === id : true));
    }
    if (!isLogin) {
      return [];
    }

    return resultList;
  }, [hideOther, tradeHistoryList, id, isLogin]);

  useEffect(() => {
    Position.resetHistoryRange();
    Position.fetchTradeHistoryList();
    setTimeout(() => Position.pollingTradeHistory.start(), 1000);
    return () => {
      Position.pollingTradeHistory.stop();
    };

  }, []);
  const scrollProps = { y: 500 };

  return (
    <>
      <div className={`container ${theme}`}>
        <div className="filter-wrapper">
          {optionsList.map(item => {
            return (
              <div
                onClick={() => Position.changeHistoryRange(item.value)}
                className={clsx('spot_optionsListLable', historyRange == item.value && 'spot_optionsListLableActive')}
              >
                {item.label}
              </div>
            );
          })}
        </div>

        <RecordList
          loading={loading}
          columns={columns}
          data={filterTradeHistoryList}
          scroll={{ x: 800, y: 500 }}
          className={`${theme} spot-table spot_history_tab`}
        />
      </div>
      <BaseTableStyle />
      <style jsx>{styles}</style>
    </>
  );
};

export default TradeHistoryTable;
const styles = css`

.spot_history_tab{
  :global(.ant-table-content) {
    overflow: hidden !important;
    tr th:last-child{
      padding-left: 48px !important;
    }
  }
}
  .filter-wrapper {
    display: flex;
    align-items: center;
    padding: 12px 20px;
    .spot_optionsListLable {
      padding: 8px 16px;
      border-radius: 6px;
      border: 1px solid var(--fill_3);
      margin-right: 16px;
      color: var(--text_2);
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      cursor: pointer;
    }
    .spot_optionsListLableActive {
      background: var(--fill_3);
      color: var(--text_1);
      border: none;
    }
    .title {
      background: var(--theme-background-color-2-4);
      height: 22px;
      line-height: 22px;
      border-radius: 3px;
      padding: 0 30px 0 8px;
      display: flex;
      justify-content: center;
      color: #232e34;
      font-weight: 500;
      cursor: pointer;
      > span:last-child {
        position: relative;
        &:before {
          content: '';
          display: block;
          position: absolute;
          top: 8px;
          right: -26px;
          width: 0;
          height: 0;
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-top: 6px solid #798296;
        }
      }
    }
  }
  :global(.ant-dropdown-menu) {
    padding: 10px !important;
    :global(li) {
      border-radius: 4px;
      padding: 2px 8px !important;
      color: var(--theme-font-color-1) !important;
      :global(.ant-dropdown-menu-title-content) {
        margin-left: 10px;
      }
      &:hover {
        color: var(--skin-color-active) !important;
      }
    }
    :global(li:hover) {
      color: var(--skin-color-active) !important;
      background: var(--color-active-2) !important;
    }
  }
  :global(.ant-dropdown.dark ul) {
    background: var(--theme-tips-color);
  }
  .btns-group {
    display: flex;
    align-items: center;
    padding: 12px 20px;
    margin-top: 1em;
    button {
      height: 26px;
      border: 1px solid transparent;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 10px;
      background: transparent;
      cursor: pointer;
      color: #717b8f;
      border-radius: 4px;
      font-weight: 500;
      &.active {
        border-color: var(--skin-primary-color);
        color: var(--skin-primary-color);
      }
    }
  }

  .dark {
    .title {
      background: var(--theme-tips-color);
      color: #fff;
    }
    .btns-group {
      border-color: #22304e;
    }
  }
`;
