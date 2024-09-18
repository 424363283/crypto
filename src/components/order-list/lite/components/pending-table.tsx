import { Loading } from '@/components/loading';
import { ScaleText } from '@/components/scale-text';
import { cancelLitePlanOrderApi } from '@/core/api';
import { FORMULAS } from '@/core/formulas';
import { useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Account, Lite, LoadingType, PositionSide, TPlanCommission } from '@/core/shared';
import { message } from '@/core/utils';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import css from 'styled-jsx/css';
import RecordList from '../../components/record-list';
import Clipboard from './clipboard';

const Position = Lite.Position;

const PendingTable = () => {
  const { pendingList, loading } = Position.state;
  const { theme } = useTheme();
  const isLogin = Account.isLogin;
  const onRevokeBtnClicked = async (id: string) => {
    Loading.start();
    const res = await cancelLitePlanOrderApi(id);
    if (res.code === 200) {
      Position.fetchPendingList(LoadingType.Show);
      message.success(LANG('撤单委托已提交'));
    }
    Loading.end();
  };

  const columns = useMemo(() => {
    return [
      {
        title: LANG('合约'),
        dataIndex: 'contract',
        render: (_: any, { commodityName, currency, lever, buy }: TPlanCommission) => {
          return (
            <div className={`first-td flex ${buy ? 'raise' : 'fall'}`}>
              <span>{commodityName?.replace(currency, '')}</span>
              <span className='yellow'>{lever}X</span>
            </div>
          );
        },
      },
      {
        title: LANG('保证金'),
        dataIndex: 'margin',
      },
      {
        title: LANG('杠杆'),
        dataIndex: 'lever',
        render: (lever: number) => {
          return lever.toFixed(2);
        },
      },
      {
        title: LANG('委托价'),
        dataIndex: 'triggerPrice',
        render: (triggerPrice: number, { currency }: TPlanCommission) => {
          return <ScaleText money={triggerPrice} currency={currency} />;
        },
      },
      {
        title: LANG('委托成交价'),
        dataIndex: 'safetyPrice',
        render: (v: any, item: TPlanCommission) =>
          item?.safetyPrice ? item?.safetyPrice?.toFormat(item.priceDigit) : '--',
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
            <div className='flex'>
              <span>{Fprice.toFormat(priceDigit)}</span>
              <span className='gray'>{Lprice.toFormat(priceDigit)}</span>
            </div>
          );
        },
      },
      {
        title: LANG('挂单时间'),
        dataIndex: 'opTime',
        render: (_: any, { createTime }: TPlanCommission) => {
          return (
            <div className='flex'>
              <span>{dayjs(createTime).format('MM/DD HH:mm:ss')}</span>
            </div>
          );
        },
      },
      {
        title: LANG('订单号'),
        dataIndex: 'id',
        render: (id: string) => {
          return (
            <div>
              <span style={{ marginRight: '10px' }}>
                {id.slice(0, 5)}...
                {id.slice(id.length - 5)}
              </span>
              <Clipboard text={id} />
            </div>
          );
        },
      },
      {
        title: LANG('操作'),
        width: 270,
        align: 'right',
        render: (_: any, { id }: TPlanCommission) => {
          return (
            <div className='operationWrapper'>
              <button className='operationBtn settingBtn fix-v2-btn' onClick={() => onRevokeBtnClicked(id)}>
                {LANG('撤单')}
              </button>
            </div>
          );
        },
      },
    ];
  }, []);

  return (
    <>
      <div className='container'>
        <RecordList
          loading={loading}
          columns={columns}
          data={isLogin ? pendingList : []}
          className={`${theme} lite-pending-table`}
        />
      </div>
      <style jsx>{styles}</style>
    </>
  );
};

export default PendingTable;
const styles = css`
  :global(.lite-pending-table) {
    :global(.ant-table-fixed-header) {
      background: transparent !important;
    }
    :global(.ant-table-row) {
      :global(td) {
        padding: 2px 5px !important;
        padding-left: 0 !important;
        font-size: 14px;
        color: #666 !important;
        font-weight: 500;
        height: 48px;
        &:first-child {
          padding-top: 0 !important;
          padding-bottom: 0 !important;
        }
      }
    }
    :global(.first-td) {
      position: relative;
      padding-left: 20px;
      :global(span) {
        &:last-child {
          font-size: 12px;
          margin-top: 4px;
        }
      }
      &:before {
        position: absolute;
        display: block;
        content: '';
        width: 3px;
        height: 24px;
        left: 1px;
        background: 0 0;
        border-top: 2.4px solid transparent;
        border-bottom: 2.4px solid transparent;
        border-right: 2.4px solid transparent;
      }
    }
    :global(.first-td.raise) {
      color: inherit;
      &:before {
        border-left: 3px solid var(--const-raise-color);
      }
    }
    :global(.first-td.fall) {
      color: inherit;
      &:before {
        border-left: 3px solid var(--const-fall-color);
      }
    }
    :global(.flex) {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    :global(.gray) {
      color: #798296;
    }
    :global(.yellow) {
      color: var(--skin-primary-color);
    }
    :global(.operationWrapper) {
      float: right;
      display: flex;
      jusitify-conent: flex-end;
      align-items: center;
      :global(.operationBtn) {
        height: 20px;
        line-height: 19px;
        min-width: 50px;
        text-align: center;
        font-size: 12px;
        padding: 0 12px;
        border-radius: 2px;
        cursor: pointer;
        font-weight: 500;
        margin-right: 12px;
      }
      :global(.settingBtn) {
        background: linear-gradient(91deg, #f7d54f, #eebd54);
        border: none;
        color: #fff;
      }
    }
  }
  :global(.dark .ant-table-row) {
    :global(td) {
      color: #c7c7c7 !important;
    }
    :global(.settingBtn) {
      color: #333 !important;
    }
  }
`;
