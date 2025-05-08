import { useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { SUBSCRIBE_TYPES, useWs } from '@/core/network';
import { LIST_TYPE, SideType, Spot, SpotOrderType, TRADE_TAB } from '@/core/shared';
import { MarketsMap } from '@/core/shared/src/markets/types';
import { LOCAL_KEY } from '@/core/store';
import { useCallback, useEffect, useMemo } from 'react';
import { useLocalStorage } from 'react-use';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';
import { NS } from '../spot';
import StrategyView from '../spot-strategy/components/strategy-view';
import PositionButton from '../spot/components/position-button';
import Asset from './components/asset';
import Balance from './components/balance';
import EtfTips from './components/etf-tips';
import LimitTrade from './components/limit-trade';
import MarketTrade from './components/market-trade';
import OCOTrade from './components/oco-trade';
import SpotHeader from './components/spot-header';
import TradeSelect from './components/trade-select';

const { Trade, Strategy, Invest, Grid, Martin } = Spot;

export const SpotProTradeUI = () => {
  const router = useRouter();
  const routerId = router.query.id as string;
  const from = router.query.from as string;

  const [tab, setTab] = useLocalStorage(LOCAL_KEY.SPOT_ORDER_TYPE, SpotOrderType.LIMIT);
  const { currentSpotContract, tradeTab, downMenuValue } = Trade.state;

  const [state, setState] = useImmer({
    sideType: SideType.BUY,
    marketMap: null as null | MarketsMap,
    initialPrice: false,
    newPrice: '' as NS,
    priceTemp: '' as NS,
    minPrice: '' as NS,
    maxPrice: '' as NS,
    triggerPriceMin: '' as NS,
    triggerPriceMax: '' as NS,
  });

  const initState = () => {
    setState((draft) => {
      draft.initialPrice = false;
      draft.priceTemp = '';
      draft.minPrice = '';
      draft.maxPrice = '';
      draft.triggerPriceMax = '';
      draft.triggerPriceMin = '';
      draft.newPrice = '';
    });
  };

  useWs(SUBSCRIBE_TYPES.ws3001, (marketMap) => {
    setState((draft) => {
      draft.marketMap = { ...marketMap };
    });
  });

  useEffect(() => {
    const minPrice = state.priceTemp
      ?.mul(1?.sub(currentSpotContract.limitBidPriceRate))
      ?.toFixed(currentSpotContract.digit);
    const maxPrice = state.priceTemp
      ?.mul(1?.add(currentSpotContract.limitAskPriceRate))
      ?.toFixed(currentSpotContract.digit);
    const triggerPriceMax = state.priceTemp
      ?.mul(1?.add(currentSpotContract.triggerPriceMax))
      ?.toFixed(currentSpotContract.digit);
    const triggerPriceMin = state.priceTemp
      ?.mul(1?.sub(currentSpotContract.triggerPriceMin))
      ?.toFixed(currentSpotContract.digit);
    setState((draft) => {
      draft.minPrice = minPrice;
      draft.maxPrice = maxPrice;
      draft.triggerPriceMax = triggerPriceMax;
      draft.triggerPriceMin = triggerPriceMin;
    });
  }, [state.priceTemp, currentSpotContract]);

  useEffect(() => {
    routerId && Trade.init(routerId);
    // routerId && Grid.init(routerId);
    // Invest.init();
    Martin.init();
    initState();
  }, [routerId]);

  useEffect(() => {
    initState();
  }, [tab, state.sideType]);

  useEffect(() => {
    if (
      !currentSpotContract.market &&
      !currentSpotContract.limitPlan &&
      !currentSpotContract.marketPlan &&
      !currentSpotContract.oco
    ) {
      setTab(SpotOrderType.LIMIT);
    }
    if (
      (tab === SpotOrderType.MARKET && !currentSpotContract.market) ||
      (tab === SpotOrderType.LIMIT_PLAN && !currentSpotContract.limitPlan) ||
      (tab === SpotOrderType.MARKET_PLAN && !currentSpotContract.marketPlan) ||
      (tab === SpotOrderType.OCO && !currentSpotContract.oco)
    ) {
      setTab(SpotOrderType.LIMIT);
      Trade.changeDownMenuValue(SpotOrderType.LIMIT_PLAN);
    }
  }, [tab, currentSpotContract]);

  useEffect(() => {
    if (state.marketMap) {
      const marketItem = state.marketMap[routerId];
      setState((draft) => {
        if (Number(marketItem?.price) > 0) {
          draft.newPrice = marketItem?.price;
          if (!state.initialPrice) {
            draft.priceTemp = marketItem?.price;
            draft.initialPrice = true;
          }
        }
      });
    }
  }, [state.marketMap, routerId, state.initialPrice]);

  const isBuy = state.sideType == SideType.BUY;

  const isPlan = tab == SpotOrderType.LIMIT_PLAN || tab == SpotOrderType.MARKET_PLAN || tab == SpotOrderType.OCO;

  const onTabChanged = useCallback((tab: SpotOrderType) => {
    initState();
    setTab(tab);
    if (tab >= SpotOrderType.LIMIT_PLAN) {
      Trade.changeDownMenuValue(tab);
    }
  }, []);

  useEffect(() => {
    switch (from) {
      case 'trading-bot-grid':
        setTimeout(() => {
          Trade.changeTradeTab(TRADE_TAB.STRATEGY);
          Strategy.changeSelectType(LIST_TYPE.GRID);
        }, 0);
        break;
      case 'trading-bot-invest':
        setTimeout(() => {
          Trade.changeTradeTab(TRADE_TAB.STRATEGY);
          Strategy.changeSelectType(LIST_TYPE.INVEST);
        }, 0);
        break;
      case 'trading-bot-martin':
        setTimeout(() => {
          Trade.changeTradeTab(TRADE_TAB.STRATEGY);
          Strategy.changeSelectType(LIST_TYPE.MARTIN);
        }, 0);
        break;
    }
  }, [from]);

  const TradeMemo = useMemo(() => {
    switch (tab) {
      case SpotOrderType.LIMIT:
      case SpotOrderType.LIMIT_PLAN:
        return (
          <LimitTrade
            isPlan={isPlan}
            isBuy={isBuy}
            minPrice={state.minPrice}
            maxPrice={state.maxPrice}
            priceTemp={state.priceTemp}
            newPrice={state.newPrice}
            triggerPriceMin={state.triggerPriceMin}
            triggerPriceMax={state.triggerPriceMax}
            initState={initState}
          />
        );
      case SpotOrderType.MARKET:
      case SpotOrderType.MARKET_PLAN:
        return (
          <MarketTrade
            isPlan={isPlan}
            isBuy={isBuy}
            priceTemp={state.priceTemp}
            triggerPriceMin={state.triggerPriceMin}
            triggerPriceMax={state.triggerPriceMax}
            initState={initState}
          />
        );
      case SpotOrderType.OCO:
        return (
          <OCOTrade
            newPrice={state.newPrice}
            isBuy={isBuy}
            minPrice={state.minPrice}
            maxPrice={state.maxPrice}
            triggerPriceMin={Number(state.triggerPriceMin)}
            triggerPriceMax={Number(state.triggerPriceMax)}
            priceTemp={state.priceTemp}
            initState={initState}
          />
        );
    }
  }, [
    tab,
    state.newPrice,
    isBuy,
    state.minPrice,
    state.maxPrice,
    state.priceTemp,
    isPlan,
    state.triggerPriceMin,
    state.triggerPriceMax,
  ]);

  useEffect(() => {
    if (!Grid.isSupportSymbol(routerId) && !Martin.isSupportSymbol(routerId)) {
      Trade.changeTradeTab(TRADE_TAB.SPOT);
    }
  }, [routerId]);

  const RateText = () => {
    const { makerRate, takerRate } = currentSpotContract;
    const formattedMakerRate = makerRate?.toFixed(3);
    const formattedTakerRate = takerRate?.toFixed(3);
    let text = '';
    if (makerRate === 0 && takerRate === 0) {
      text = `Maker ${formattedMakerRate}%/Taker ${formattedTakerRate}%`;
    } else if (makerRate === 0) {
      text = `Maker ${formattedMakerRate}%`;
    } else if (takerRate === 0) {
      text = `Taker ${formattedTakerRate}%`;
    }

    if (!text) return null;

    return <div className='rate'>{text}</div>;
  };

  return (
    <>
      <div className='container'>
        <SpotHeader />
        {tradeTab === TRADE_TAB.SPOT ? (
          <>
            <div className='body'>
              <PositionButton
                positionSide={state.sideType}
                greenText={LANG('买入____2')}
                redText={LANG('卖出____2')}
                onChange={(positionSide) =>
                  setState((draft) => {
                    draft.sideType = positionSide;
                  })
                }
              />
              <TradeSelect tab={tab} downMenuValue={downMenuValue} onTabChanged={onTabChanged} />
              {TradeMemo}
              <Balance isBuy={isBuy} />
              {RateText()}
              <EtfTips />
            </div>
            <Asset />
          </>
        ) : (
          <StrategyView />
        )}
      </div>
      <style jsx>{styles}</style>
    </>
  );
};

export default SpotProTradeUI;

const styles = css`
  .container {
    display: flex;
    flex-direction: column;
    height: 100%;
    .body {
      background: var(--fill_bg_1);
    }
    .body {
      padding: 16px 16px 24px 16px;
      :global(.trade-type-bar) {
        margin-bottom: 16px;
      }
      :global(.order-type-btns) {
        margin-bottom: 8px;
      }
      :global(.trade-wrapper) {
        margin-bottom: 16px;
      }
      :global(.rate) {
        margin-top: 16px;
        background-color: var(--fill_bg_1);
        padding: 4px 10px;
        border-radius: 5px;
        color: var(--skin-main-font-color);
        display: inline-block;
      }
    }
  }
`;
