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

const RateHistory = () => {
  const { query }: any = useRouter();
  const isUsdt = query.type === 'usdt';
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
      const res = await getSwapPublicRiskDaysApi(options, isUsdt);
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
    const data: any = (isUsdt ? group.getSwapUsdList : group.getSwapCoinList).map((swap: any) => Trade.get(swap.id)).filter(swap => swap !== undefined);;
    setList(data);
    setContract(data[0]);
  };

  const columns = [
    { title: LANG('时间'), dataIndex: 'date' },
    { title: LANG('风险保障基金余额'), dataIndex: 'balance' },
  ];

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
            chartId='fundCharts'
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
      margin: 0 auto;
    }
    overflow: hidden;
    border-radius: 0;
    flex: 1;
  }

  .chart-card {
    margin: 30px auto;
    min-height: 400px;
  }
  .table-card {
    margin: 0 auto;
    padding-bottom: 30px;
    background: var(--theme-background-color-3-2);
    flex: 1;
    :global(th),
    :global(td) {
      &:nth-child(1) {
        padding-left: 30px;
      }
      &:nth-child(2) {
        text-align: right;
        padding-right: 30px;
      }
    }
  }
`;
export default RateHistory;
