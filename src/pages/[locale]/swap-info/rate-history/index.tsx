import PerpetualInfoCharts from '@/components/swap-info-charts';
import Table from '@/components/table';
import { getSwapsFundingRateHistoryApi } from '@/core/api';
import { useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Group, TradeMap } from '@/core/shared';
import { MediaInfo, message } from '@/core/utils';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';

const RateHistory = () => {
  const { query }: any = useRouter();
  const isUsdt = query.type === 'usdt';
  const [list, setList] = useState([]);
  const [contract, setContract] = useState({} as any);
  const [data, setData] = useState([]);
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
      const res = await getSwapsFundingRateHistoryApi(options, isUsdt);
      if (res.code != 200) return message.error(res.message);
      const myData = res?.data?.pageData
        ?.map((item: any) => {
          const ooo: any = list.find((k: any) => k.id.toUpperCase() === item.symbol.toUpperCase());
          item.date = dayjs(item.feeTime).format('YYYY-MM-DD HH:mm:ss');
          item.rate = (item.fundRate * 100)?.toFixed(4) + '%';
          item.fundRatePeriod = (ooo['fundRatePeriod'] || 0) + LANG('小时');
          item.xData = dayjs(item.feeTime).format('MM-DD');
          item.yData = (item.fundRate * 100)?.toFixed(4);
          item.symbol = ooo.name?.toUpperCase();
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

  const _getList = async () => {
    const Trade: any = await TradeMap.getSwapTradeMap();
    const group = await Group.getInstance();
    const data: any = (isUsdt ? group.getSwapUsdList : group.getSwapCoinList).map((swap: any) => Trade.get(swap.id)).filter(swap => swap !== undefined);
    // console.log('data', data);
    setList(data);
    setContract(data[0]);
  };

  const columns = [
    { title: LANG('时间'), dataIndex: 'date' },
    {
      title: LANG('合约'),
      dataIndex: 'symbol',
    },
    { title: LANG('资金费率时间间隔'), dataIndex: 'fundRatePeriod' },
    { title: LANG('资金费率'), dataIndex: 'rate' },
  ];

  const yFormatter = (v: any) => {
    return v?.toFixed(2) + '%';
  };

  return (
    <>
      <div className={'chart-card'}>
        <div className='box'>
          <PerpetualInfoCharts
            cryptoOptions={list}
            cryptoValue={contract?.symbol}
            onCryptoChange={(v: any) => {
              setContract(v);
              setPage(1);
            }}
            chartId='historyCharts'
            xData={xData}
            data={yData}
            yFormatter={yFormatter}
            title={
              <>
                {LANG('资金费率')}: {(yData[yData.length - 1] || 0) + '%'}
              </>
            }
            setLimit={setLimit}
            limitArr={[7, 14]}
            tFormatter='{b}<br /><span style="color:#f8bb37">{c}%</span>'
          />
        </div>
      </div>
      <div className={'table-card'}>
        <div className='box'>
          <Table
            dataSource={[...data].reverse()}
            columns={columns}
            pagination={{
              current: page,
              onChange: setPage,
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
    @media ${MediaInfo.tablet} {
      padding: 0 32px;
    }
    @media ${MediaInfo.mobile} {
      padding: 0 16px;
    }
    .box {
      max-width: var(--const-max-page-width);
      width: 100%;
      margin: 0 auto;
      user-select: none;
    }
  }

  .chart-card {
    margin: 30px auto;
    min-height: 400px;
  }
  .table-card {
    padding-bottom: 30px;
    margin: 0 auto;
    background: var(--theme-background-color-3-2);
    :global(th),
    :global(td) {
      &:nth-child(1) {
        padding-left: 30px;
      }
      &:nth-child(4) {
        text-align: right;
        padding-right: 30px;
      }
    }
  }
`;
export default RateHistory;
