import Table from '@/components/table';
import { useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { WS4001 } from '@/core/network';
import { SwapTradeItem, TradeMap, Swap } from '@/core/shared';
import { MediaInfo, clsx } from '@/core/utils';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import Charts from './components/charts';
import { WS } from '@/core/network';

const Exponent = (props: { 0: { isUSDT: boolean }; 1: object }) => {
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState(props[0].isUSDT ? 0 : 1);
  const [tab1, setTab1] = useState(0);
  const [symbol, setSymbol] = useState('');
  const [type, setType] = useState(0);
  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [swapTradeMap, setSwapTradeMap] = useState<Map<string, SwapTradeItem> | undefined>();
  const { quoteId } = Swap.Trade.base;

  useEffect(() => {
    // setSymbol(Swap.Trade.getBaseSymbol(quoteId));
    (async () => {
      const result = await TradeMap.getSwapTradeMap();
      setSwapTradeMap(result);
    })();
    return () => {
      // 關閉指數彈窗重新訂閱當前 quoteId
      WS.subscribe4001([quoteId]);
    };
  }, []);
  // console.log(symbol);

  // 获取价格
  const getPrice = () => {
    const nowTime = Math.floor(new Date().getTime() / 1000);
    const oldTime = 60 * 1001;
    let params = {
      resolution: 1, // 行情数据的分钟间隔 [ 1 ｜ 3 ｜ 5 ｜ 15 ｜ 30 ｜ 60 ｜ 1D ]
      from: nowTime - oldTime, // 开始时间
      to: nowTime // 结束时间
    };
    let url = `/api/tv/tradingView/${/^S.*-SUSD(T)?$/.test(symbol) ? 'testnethistory' : 'history'}`;
    fetch(
      `${url}?symbol=${type ? 'm' : 'i'}${symbol}&from=${params.from}&to=${params.to}&resolution=${params.resolution}`
    )
      .then(response => response.json())
      .then(({ s, o, t }) => {
        setLoading(false);
        if (s === 'ok') {
          const _data = t?.map((key: any, index: number) => {
            return {
              date: dayjs(key * 1000).format('YYYY-MM-DD HH:mm:ss'),
              price: o[index],
              symbol
            };
          });
          setFormData(_data?.reverse());
        }
      });
  };

  // 获取成分
  const getComponent = () => {
    fetch(`/swap/public/common/constituents/${symbol}`)
      .then(response => response.json())
      .then(res => {
        setLoading(false);
        if (res.code === 200) {
          const exchanges = res?.data?.exchanges || [];
          const _data = exchanges.map(({ exchange }: any) => {
            return {
              exchange,
              symbol
            };
          });
          setFormData(_data);
        }
      });
  };

  useEffect(() => {
    if (symbol) {
      switchId();
      setFormData([]);
      setLoading(true);
      if (tab1 === 0) {
        getPrice();
      } else {
        if (type === 0) getComponent();
      }
    }
    if (type === 1) {
      setTab1(0);
    }
  }, [symbol, type, tab1]);

  const switchId = () => {
    // window._indexSymbol = `${type ? 'm' : 'i'}${symbol}`;
    // INTER.Quote.switch(symbol);
  };

  const columns_0 = [
    { title: LANG('时间'), dataIndex: 'date' },
    {
      title: LANG('合约'),
      dataIndex: 'symbol',
      render: (v: string) => swapTradeMap?.get(v)?.name || ''
    },
    {
      title: () => (type ? LANG('标记价格') : LANG('价格指数')),
      dataIndex: 'price',
      render: (v: string) => v + (tab ? ' USD' : ' USDT')
    }
  ];

  const columns_1 = [
    { title: LANG('交易所'), dataIndex: 'exchange' },
    {
      title: LANG('交易对'),
      dataIndex: 'symbol',
      render: (v: string) => swapTradeMap?.get(v)?.name || ''
    }
  ];

  const columns = [columns_0, columns_1];
  return (
    <>
      <div className={'tabs'}>
        <div className={clsx('tab', tab === 0 && 'active')} onClick={() => setTab(0)}>
          {LANG('U本位合约')}
        </div>
        {/* <div className={clsx('tab', tab === 1 && 'active')} onClick={() => setTab(1)}>
          {LANG('币本位合约')}
        </div> */}
      </div>
      <div className={'chart-card'}>
        <Charts isUsdtType={tab === 0} setSymbol={setSymbol} setType={setType} id={symbol} switchId={switchId} />
      </div>
      <div className={'table-card'}>
        <div className="box">
          <div className={clsx('tabs1', type === 1 && 'hide')}>
            <div className={clsx('tab1', tab1 === 0 && 'active')}>
              <span onClick={() => setTab1(0)}>{LANG('价格')}</span>
            </div>
            <div className={clsx('tab1', tab1 === 1 && 'active')}>
              <span onClick={() => setTab1(1)}>{LANG('参考')}</span>
            </div>
          </div>
          <Table
            dataSource={formData}
            columns={columns[tab1]}
            loading={loading}
            pagination={{
              current: page,
              onChange: setPage
            }}
          />
          {tab1 === 1 && (
            <div className={'tips'}>
              <div>
                1.
                {LANG(
                  'Cross Rate (交叉汇率): 对于一些没有直接报价的指数，计算交叉汇率作为综合价格指数。例如：综合LINK/BTC and BTC/USD来计算 LINK/USD。'
                )}
              </div>
              <div>2. {LANG('YMEX 将不时更新价格指数参考。')}</div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{styles}</style>
    </>
  );
};

const styles = css`
  .chart-card {
    max-width: var(--const-max-page-width);
    width: 100%;
    margin: 0 auto;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .tabs {
    max-width: var(--const-max-page-width);
    width: 100%;
    display: flex;
    align-items: center;
    gap: 8px;
    .tab {
      /* background: var(--theme-background-color-3-2); */
      font-size: 12px;
      font-weight: 400;
      color: var(--text_2);
      display: flex;
      align-items: center;
      padding: 4px 1rem;
      cursor: pointer;
      border-radius: 4px;
      border: 0.5px solid var(--fill_line_3);

      &.active {
        color: var(--text_white);
        background: var(--brand);
        border: none;
      }
    }
  }

  .chart-card {
    margin-top: 1.5rem;
  }
  .table-card {
    width: 100%;
    flex: 1;
    margin-top: 1rem;
    background: var(--theme-background-color-3-2);

    .box {
      margin: 0 auto;
      max-width: var(--const-max-page-width);
      width: 100%;
    }

    .tabs1 {
      display: flex;
      align-items: center;
      gap: 2.5rem;
      &.hide {
        display: none;
      }
      .tab1 {
        height: 1.25rem;
        display: flex;
        align-items: center;
        font-size: 16px;
        font-weight: 500;
        color: var(--text_3);
        span {
          display: flex;
          align-items: center;
          height: 100%;
          cursor: pointer;
        }
        &.active {
          span {
            color: var(--brand);
          }
        }
      }
    }
  }

  :global(.ant-table-thead > tr > th) {
    padding: 0;
    color: var(--text_3);
    font-weight: 400;
    font-size: 12px;
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
    font-size: 12px;
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
      width: 1.25rem !important;
      height: 1.25rem !important;
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
      width: 1.25rem !important;
      min-width: 1.25rem !important;
      color: var(--text_3);
      height: 1.25rem !important;
      line-height: 1.25rem !important;
      border-radius: 50%;
      background-color: transparent;
      margin: 0;
      font-size: 12px !important;
      font-weight: 500;
      &:hover {
        background-color: var(--fill_3);
      }
    }
    :global(.ant-pagination-prev),
    :global(.ant-pagination-next) {
      width: 1.25rem !important;
      height: 1.25rem !important;
      min-width: 1.25rem !important;
      margin: 0 !important;
      &:focus,
      &:hover {
      }
    }
    :global(.ant-pagination-item-link) {
      width: 1rem !important;
      height: 1rem !important;
      :global(.ant-pagination-item-link-icon) {
        color: var(--text_brand) !important;
        font-size: 10px !important;
        :global(svg) {
          width: 10px !important;
          height: 10px !important;
        }
      }
      :global(.ant-pagination-item-ellipsis) {
        border-radius: 1.25rem !important;
        color: var(--text_1) !important;
        width: 1rem !important;
        height: 1rem !important;
        font-size: 10px !important;
      }
    }
    :global(.ant-pagination-item-active) {
      background: var(--brand) !important;
      color: var(--text_white) !important;
      font-weight: 500 !important;
    }
  }
  :global(.ant-pagination-jump-next) {
    width: 1.25rem !important;
    min-width: 1.25rem !important;
    height: 1.25rem !important;
    line-height: 1.25rem !important;
  }
  :global(.ant-table-placeholder) {
    :global(.ant-table-cell) {
      border: 0;
    }
  }

  .tips {
    width: 100%;
    position: relative;
    .icon {
      font-size: 1rem;
      color: var(--theme-font-color-3);
      position: absolute;
      top: 5px;
      left: 0;
    }
    div {
      font-size: 12px;
      font-weight: 400;
      color: var(--theme-font-color-1);
      line-height: 1.25rem;
    }
  }
`;

export default WS4001(Exponent);
