import { ResolutionType, config } from '@/components/chart/k-chart/components/k-header/resolution/config';
import { KlineChart } from '@/components/chart/k-chart/lib/kline-chart';
import { LANG } from '@/core/i18n';
import { WS } from '@/core/network';
import { Group, SwapTradeItem, TradeMap } from '@/core/shared';
import { clsx } from '@/core/utils';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import Select from '../select';

const Charts = ({ isUsdtType, setSymbol, setType, id, switchId }: any) => {
  const [crypto, setCrypto] = useState(0);
  const [index, setIndex] = useState(0);
  const [cryptoList, setCryptoList] = useState([]);
  const [usdtList, setUsdtList] = useState([] as any);
  const [coinList, setCoinList] = useState([] as any);
  const [resolution, setResolution] = useState<ResolutionType>(config[1]); // 切换K线周期

  useEffect(() => {
    _getList();
  }, []);

  const _getList = async () => {
    const Trade: any = await TradeMap.getSwapTradeMap();
    const group = await Group.getInstance();
    setUsdtList(group.getSwapUsdList.map((swap: any) => Trade.get(swap.id)));
    setCoinList(group.getSwapCoinList.map((swap: any) => Trade.get(swap.id)));
  };

  useEffect(() => {
    let idx: number = 0;
    if(isUsdtType) {
      idx = usdtList.findIndex(( item: SwapTradeItem  ) => item.id === id?.toUpperCase());
    } else {
      idx = coinList.findIndex(( item: SwapTradeItem ) => item.id === id?.toUpperCase());
    }
    setCrypto(idx < 0 ? 0 : idx);
  }, [usdtList, coinList, isUsdtType]);

  useEffect(() => {
    if (isUsdtType) {
      setCryptoList(usdtList.map((item: any) => item?.name));
    } else {
      setCryptoList(coinList.map((item: any) => item?.name));
    }
  }, [usdtList, coinList, isUsdtType]);

  useEffect(() => {
    setCrypto(0);
  }, [isUsdtType]);

  useEffect(() => {
    const data = isUsdtType ? usdtList : coinList;
    const symbol = data[crypto]?.id?.toUpperCase();
    symbol && setSymbol(symbol);
  }, [crypto, isUsdtType, usdtList, coinList]);

  const _setIndex = (v: any) => {
    setIndex(v);
    setType(v);
  };

  const indexPrices = [LANG('价格指数'), LANG('标记价格')];

  const klineId = `${index === 0 ? 'i' : 'm'}${id}`;

  useEffect(() => {
    id && WS.subscribe4001([klineId]);
  }, [klineId]);

  return (
    <div className={'charts'}>
      <div className='top'>
        <div className={'select'}>
          <Select
            value={crypto}
            options={cryptoList.map((item: any) => item?.replace('-', ''))}
            onChange={setCrypto}
            label='合约'
            screen
          />
          <div style={{ width: '30px' }}></div>
          <Select value={index} options={indexPrices} onChange={_setIndex} label='指数' />
        </div>
      </div>
      <div className='r'>
        {config.map((item: ResolutionType) => {
          return (
            <span
              className={clsx(item.value == resolution.value && 'active')}
              key={item.value}
              onClick={() => setResolution(item)}
            >
              {item.value}
            </span>
          );
        })}
      </div>
      <div className={'trading-view'}>
        {id && <KlineChart id={klineId as string} theme={'light'} resolution={resolution} holc />}
      </div>
      <style jsx>{styles}</style>
    </div>
  );
};

const styles = css`
  .charts {
    padding: 30px;
    display: flex;
    flex-direction: column;
    flex: 1;
    .top {
      display: flex;
      justify-content: space-between;
      .select {
        display: flex;
        align-items: center;
      }
    }
    .r {
      display: flex;
      /* border: 1px solid var(--theme-border-color-3); */
      border-radius: 5px;
      padding: 5px 5px;
      justify-content: space-between;
      max-width: 400px;
      width: 100%;
      margin-top: 15px;
      span {
        width: 45px;
        height: 20px;
        display: flex;
        justify-content: center;
        font-size: 12px;
        font-weight: 500;
        align-items: center;
        cursor: pointer;
        color: var(--theme-font-color-3);
        &.active {
          background: var(--theme-background-color-3-2);
          border-radius: 3px;
          color: var(--theme-font-color-1);
        }
      }
    }

    .trading-view {
      margin-top: 5px;
      height: 400px;
      position: relative;
      display: flex;
      flex-direction: column;
    }
  }
`;
export default Charts;
