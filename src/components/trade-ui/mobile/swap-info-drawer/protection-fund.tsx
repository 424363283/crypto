import PerpetualInfoCharts from '@/components/swap-info-charts';
import Table from '@/components/table';
import { getSwapPublicRiskDaysApi } from '@/core/api';
import { useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Group, TradeMap } from '@/core/shared';
import { MediaInfo, message } from '@/core/utils';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';

const ProtectionFund = ({ isUSDT }: { isUSDT: boolean }) => {
  const [list, setList] = useState([]);
  const [contract, setContract] = useState({} as any);
  const [data, setData] = useState([] as any);
  const [page, setPage] = useState(1);
  const [xData, setXData] = useState([]);
  const [yData, setYData] = useState([]);
  const [limit, setLimit] = useState(7);

  useEffect(() => {
    _getList();
  }, []);

  useEffect(() => {
    contract?.symbol && _getData();
  }, [contract, limit]);

  const _getData = async () => {
    try {
      const options = { limit, symbol: contract?.id.toLowerCase() };
      const res = await getSwapPublicRiskDaysApi(options, isUSDT);
      if (res.code != 200) return message.error(res.message);
      const myData = res?.data?.pageData
        ?.map((item: any) => {
          item.xData = dayjs(item.time).format('MM-DD');
          item.yData = item.balance;
          item.date = dayjs(item.time).format('YYYY-MM-DD HH:mm:ss');
          item.balance = item.balance + ' ' + item.symbol;
          return item;
        })
        .reverse();
      setData(myData);
      setXData(
        myData?.map((o: any) => {
          return o.xData;
        })
      );
      setYData(
        myData?.map((o: any) => {
          return o.yData;
        })
      );
    } catch (e) {
      message.error(e);
    }
  };

  const yFormatter = (v: any) => {
    return v?.toFixed(2);
  };

  const _getList = async () => {
    const Trade: any = await TradeMap.getSwapTradeMap();
    const group = await Group.getInstance();
    const data: any = (isUSDT ? group.getSwapUsdList : group.getSwapCoinList)
      .map((swap: any) => Trade.get(swap.id))
      .filter(swap => swap !== undefined);
    setList(data);
    setContract(data[0]);
  };

  const columns = [
    { title: LANG('时间'), dataIndex: 'date' },
    { title: LANG('风险保障基金余额'), dataIndex: 'balance' }
  ];

  return (
    <>
      <div className={'chart-card'}>
        <div className="box">
          <PerpetualInfoCharts
            cryptoOptions={list}
            cryptoValue={contract?.symbol}
            onCryptoChange={(v: any) => {
              setContract(v);
              setPage(1);
            }}
            chartId="fundCharts"
            xData={xData}
            data={yData}
            yFormatter={yFormatter}
            fundRate={(contract?.fundRate * 100)?.toFixed(4) || 0}
            title={
              <>
                {LANG('风险保障基金余额')}: {data[data.length - 1]?.balance}
              </>
            }
            setLimit={setLimit}
            limitArr={[7, 30]}
            tFormatter='{b}<br /><span style="color:#f8bb37">{c}</span>'
          />
        </div>
      </div>
			<div className="line" />
      <div className={'table-card'}>
        <div className="box">
          <Table
            dataSource={[...data].reverse()}
            columns={columns}
            pagination={{
              current: page,
              onChange: setPage
            }}
          />
        </div>
      </div>
      <style jsx>{styles}</style>
    </>
  );
};

const styles = css`
  .chart-card,
  .table-card {
    width: 100%;

    .box {
      max-width: var(--const-max-page-width);
      margin: 0 auto;
    }
  }

  .chart-card {
    padding-top: 1rem;
  }
  .line {
    margin: 1.5rem 0;
    height: 1px;
    width: 100%;
    background: var(--fill_line_2);
  }
  .table-card {
    padding-bottom: 1rem;
    margin: 0 auto;
    .box {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    :global(.ant-table-thead > tr > th) {
      padding: 0;
      color: var(--text_3);
      font-weight: 400;
      font-size: 14px;
      border: 0;
      width: 5.5rem;
      padding-right: 1rem;
      &:last-child {
        text-align: right;
        padding-right: 0;
      }
    }
    :global(.ant-table-row) {
      height: 2.5rem;
    }
    :global(td.ant-table-cell) {
      padding: 0;
      font-size: 14px;
      color: var(--text_1);
      font-weight: 500;
      &:last-child {
        text-align: right;
      }
    }
    :global(.bottom-pagination) {
      justify-content: center;
      padding: 0;
      :global(.ant-pagination) {
        gap: 8px;
      }
      :global(.page-button) {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 1.25rem;
        height: 1.25rem;
        background: transparent;
        border-radius: 5px;
        font-weight: 500;
        :global(> img) {
          width: 14px;
          height: 14px;
        }
      }
      :global(.ant-pagination-item) {
        border: none;
        width: 1.25rem;
        min-width: 1.25rem;
        color: var(--text_3);
        height: 1.25rem;
        line-height: 1.25rem;
        border-radius: 50%;
        background-color: transparent;
        margin: 0;
        font-size: 12px;
        font-weight: 500;
        &:hover {
          background-color: var(--fill_3);
        }
      }
      :global(.ant-pagination-prev),
      :global(.ant-pagination-next) {
        width: 1.25rem;
        height: 1.25rem !important;
        min-width: 1.25rem;
        margin: 0;
        &:focus,
        &:hover {
        }
      }
      :global(.ant-pagination-item-link) {
        width: 1rem;
        height: 1rem !important;
        :global(.ant-pagination-item-link-icon) {
          color: var(--text_brand) !important;
          font-size: 10px;
          :global(svg) {
            width: 10px;
            height: 10px;
          }
        }
        :global(.ant-pagination-item-ellipsis) {
          border-radius: 1.25rem;
          color: var(--text_1);
          width: 1.25rem;
          height: 1.25rem;
          font-size: 10px;
        }
      }
      :global(.ant-pagination-item-active) {
        background: var(--brand);
        color: var(--text_white);
        font-weight: 500;
      }
    }
    :global(.ant-table-placeholder) {
      :global(.ant-table-cell) {
        border: 0;
      }
    }
  }
`;
export default ProtectionFund;
