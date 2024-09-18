import CoinLogo from '@/components/coin-logo';
import CommonIcon from '@/components/common-icon';
import { Loading } from '@/components/loading';
import { ACCOUNT_TYPE, TransferModal } from '@/components/modal';
import { RateText } from '@/components/rate-text';
import Slider from '@/components/trade-ui/trade-view/components/slider';
import { OrderBookEmitter } from '@/core/events';
import { useResponsive, useRouter, useSettingGlobal, useTheme } from '@/core/hooks';
import { LANG, TrLink } from '@/core/i18n';
import { SUBSCRIBE_TYPES, useWs } from '@/core/network';
import { Account } from '@/core/shared/src/account';
import { LIST_TYPE, SideType, Spot, SpotOrderType, TRADE_TAB } from '@/core/shared/src/spot';
import { MarketsMap } from '@/core/shared/src/markets/types';
import { LOCAL_KEY } from '@/core/store';
import { getActive, message, toMinNumber } from '@/core/utils';
import { Tooltip } from 'antd';
import Image from 'next/image';
import { useCallback, useEffect, useMemo } from 'react';
import { useLocalStorage } from 'react-use';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';
import { NS } from '../spot';
import StrategyView from '../spot-strategy/components/strategy-view';
import PositionButton from '../spot/components/position-button';
import Input from './components/input';

const Trade = Spot.Trade;
const Strategy = Spot.Strategy;

const UNIT: {
  [name: string]: string;
} = {
  USDT: 'Tether',
  USDC: 'USDC',
};

export const SpotProTradeUI = () => {
  const enableLite = process.env.NEXT_PUBLIC_LITE_ENABLE === 'true';
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const routerId = router.query.id as string;
  const from = router.query.from as string;

  const [tab, setTab] = useLocalStorage(LOCAL_KEY.SPOT_ORDER_TYPE, SpotOrderType.LIMIT);
  const { coin, quoteCoin, quoteCoinBalance, coinBalance, currentSpotContract, quoteCoinScale, coinScale, tradeTab } =
    Trade.state;
  const { spotTradeEnable } = useSettingGlobal();
  const { isSmallDesktop, isTablet } = useResponsive();

  const [sliderData, setSliderData] = useImmer({
    type: 'range',
    step: 1,
    value: 0,
    min: 0,
    max: 100,
  });

  const [state, setState] = useImmer({
    sideType: SideType.BUY,
    transferModalVisible: false,
    marketMap: null as null | MarketsMap,
    buyPrice: '' as NS,
    sellPrice: '' as NS,
    buyAmount: '' as NS,
    sellAmount: '' as NS,
    buyVolume: '' as NS,
    sellVolume: '' as NS,
    initialPrice: false,
    priceTemp: '' as NS,
    minPrice: '' as NS,
    maxPrice: '' as NS,
    newPrice: '' as NS,
  });

  const isLogin = Account.isLogin;

  const initialState = () => {
    setState((draft) => {
      draft.initialPrice = false;
      draft.buyPrice = '';
      draft.sellPrice = '';
      draft.buyAmount = '';
      draft.sellAmount = '';
      draft.buyVolume = '';
      draft.sellVolume = '';
      draft.priceTemp = '';
      draft.minPrice = '';
      draft.maxPrice = '';
      draft.newPrice = '';
    });
    setSliderData((draft) => {
      draft.value = 0;
    });
  };

  useWs(SUBSCRIBE_TYPES.ws3001, (marketMap) => {
    setState((draft) => {
      draft.marketMap = { ...marketMap };
    });
  });

  useEffect(() => {
    const event = (price: string) => {
      setState((draft) => {
        draft.buyPrice = price;
        state.buyVolume && (draft.buyAmount = price.mul(state.buyVolume).toFixed(currentSpotContract.amountDigit));
        draft.sellPrice = price;
        state.sellVolume && (draft.sellAmount = price.mul(state.sellVolume).toFixed(currentSpotContract.amountDigit));
        draft.priceTemp = price;
      });
    };
    const emitter = OrderBookEmitter.on(OrderBookEmitter.ORDER_BOOK_ITEM_PRICE, event);
    return () => {
      emitter.off(OrderBookEmitter.ORDER_BOOK_ITEM_PRICE, event);
    };
  }, []);

  useEffect(() => {
    const minPrice = state.priceTemp
      ?.mul(1?.sub(currentSpotContract.limitBidPriceRate))
      ?.toFixed(currentSpotContract.digit);
    const maxPrice = state.priceTemp
      ?.mul(1?.add(currentSpotContract.limitAskPriceRate))
      ?.toFixed(currentSpotContract.digit);
    setState((draft) => {
      draft.minPrice = minPrice;
      draft.maxPrice = maxPrice;
    });
  }, [state.priceTemp, currentSpotContract]);

  useEffect(() => {
    routerId && Trade.init(routerId);
    routerId && Strategy.init(routerId);
    initialState();
  }, [routerId]);

  useEffect(() => {
    initialState();
  }, [tab, state.sideType]);

  useEffect(() => {
    if (!currentSpotContract.market) {
      setTab(SpotOrderType.LIMIT);
    }
  }, [tab, currentSpotContract.market]);

  useEffect(() => {
    if (state.marketMap) {
      const marketItem = state.marketMap[routerId];
      setState((draft) => {
        if (Number(marketItem?.price) > 0) {
          draft.newPrice = marketItem?.price;
          if (!state.initialPrice) {
            draft.buyPrice = marketItem?.price;
            draft.sellPrice = marketItem?.price;
            draft.priceTemp = marketItem?.price;
            draft.initialPrice = true;
          }
        }
      });
    }
  }, [state.marketMap, routerId, state.initialPrice]);

  const percent = useMemo(() => {
    const { value, min, max } = sliderData;
    return value ? ((value - min) / (max - min)) * 100 : 0;
  }, [sliderData]);

  const isBuy = state.sideType == SideType.BUY;

  const isLimit = tab == SpotOrderType.LIMIT;

  const onTabChanged = useCallback(
    (tab: SpotOrderType) => {
      if (tab === SpotOrderType.LIMIT) {
        setState((draft) => {
          draft.buyAmount = '';
          draft.sellAmount = '';
          draft.buyVolume = '';
          draft.sellVolume = '';
          draft.buyPrice = state.newPrice;
          draft.sellPrice = state.newPrice;
          draft.priceTemp = state.newPrice;
        });
        setTab(SpotOrderType.LIMIT);
      } else {
        setState((draft) => {
          draft.buyAmount = '';
          draft.sellVolume = '';
        });
        setTab(SpotOrderType.MARKET);
      }
    },
    [state.newPrice]
  );

  const onSliderChanged = useCallback(
    (val: number, isLimit: boolean) => {
      setSliderData((draft) => {
        draft.value = val;
      });
      if (isLogin) {
        setState((draft) => {
          if (isLimit) {
            if (isBuy) {
              // 先通过可交易金额去反推可购买数量，但是数量存在小数的精度省略，所以再通过可购买数量来推出本次用于购买的金额
              const amount = quoteCoinBalance.mul(val.div(100)).toFixed(currentSpotContract.amountDigit);
              const volume = amount.div(state.buyPrice).toFixed(currentSpotContract.volumeDigit);

              draft.buyVolume = Number(volume) === 0 ? '' : volume;
              draft.buyAmount = volume
                .mul(state.buyPrice)
                .toFixed(currentSpotContract.digit)
                .toFixed(currentSpotContract.amountDigit);
            } else {
              const volume = coinBalance.mul(val.div(100)).toFixed(currentSpotContract.volumeDigit);
              draft.sellVolume = Number(volume) === 0 ? '' : volume;
              draft.sellAmount = volume
                .mul(state.buyPrice)
                .toFixed(currentSpotContract.digit)
                .toFixed(currentSpotContract.amountDigit);
            }
          } else {
            if (isBuy) {
              const result = quoteCoinBalance.mul(val.div(100)).toFixed(currentSpotContract.amountDigit);
              draft.buyAmount = Number(result) > 0 ? result : '';
            } else {
              const result = coinBalance.mul(val.div(100)).toFixed(currentSpotContract.volumeDigit);
              draft.sellVolume = Number(result) > 0 ? result : '';
            }
          }
        });
      }
    },
    [isBuy, coinBalance, quoteCoinBalance, currentSpotContract, state.buyPrice, isLogin]
  );

  const renderLimitPriceTrade = useCallback(() => {
    return (
      <>
        <div className='tradeWrapper'>
          <div className='row'>
            <Input
              disabled={!isLogin}
              label={LANG('价格')}
              unit={quoteCoin}
              decimal={currentSpotContract.digit}
              min={isBuy ? Number(state.minPrice) : 0}
              max={isBuy ? 0 : Number(state.maxPrice)}
              value={isBuy ? state.buyPrice : state.sellPrice}
              onChange={(val) =>
                setState((draft) => {
                  if (isBuy) {
                    draft.buyPrice = val;
                    state.buyVolume &&
                      (draft.buyAmount = val.mul(state.buyVolume).toFixed(currentSpotContract.amountDigit));
                  } else {
                    draft.sellPrice = val;
                    state.sellVolume &&
                      (draft.sellAmount = val.mul(state.sellVolume).toFixed(currentSpotContract.amountDigit));
                  }
                })
              }
              onBlur={() => {
                if (isBuy) {
                  if (state.buyPrice === '' || state.buyPrice === '0') {
                    setState((draft) => {
                      draft.buyPrice = state.minPrice;
                      if (state.buyVolume) {
                        draft.buyAmount = state.priceTemp.mul(state.buyVolume).toFixed(currentSpotContract.amountDigit);
                      }
                    });
                  }
                } else {
                  if (state.sellPrice === '' || state.sellPrice === '0') {
                    setState((draft) => {
                      draft.sellPrice = '';
                      if (state.sellVolume) {
                        draft.sellAmount = state.priceTemp
                          .mul(state.sellVolume)
                          .toFixed(currentSpotContract.amountDigit);
                      }
                    });
                  }
                }
              }}
            />
          </div>
          <div className='row'>
            <Input
              disabled={!isLogin}
              label={LANG('数量')}
              unit={coin}
              decimal={currentSpotContract.volumeDigit}
              min={0}
              value={isBuy ? state.buyVolume : state.sellVolume}
              onChange={(val) =>
                setState((draft) => {
                  if (isBuy) {
                    draft.buyVolume = val;
                    draft.buyAmount =
                      val === '' ? '' : val.mul(state.buyPrice).toFixed(currentSpotContract.amountDigit);
                  } else {
                    draft.sellVolume = val;
                    draft.sellAmount =
                      val === '' ? '' : val.mul(state.sellPrice).toFixed(currentSpotContract.amountDigit);
                  }
                })
              }
            />
          </div>
          <div className='row'>
            <Input
              disabled={!isLogin}
              label={LANG('交易额')}
              unit={quoteCoin}
              decimal={currentSpotContract.amountDigit}
              min={0}
              value={isBuy ? state.buyAmount : state.sellAmount}
              onChange={(val) =>
                setState((draft) => {
                  if (isBuy) {
                    draft.buyAmount = val;
                    draft.buyVolume =
                      val === '' ? '' : val.div(state.buyPrice).toFixed(currentSpotContract.volumeDigit);
                  } else {
                    draft.sellAmount = val;
                    draft.sellVolume =
                      val === '' ? '' : val.div(state.sellPrice).toFixed(currentSpotContract.volumeDigit);
                  }
                })
              }
            />
          </div>
          <div className='sliderWrapper row'>
            <Slider
              percent={percent}
              isDark={isDark}
              grid={5}
              grids={[0, 25, 50, 75, 100]}
              onChange={(val: number) => onSliderChanged(val, true)}
              renderText={() => `${sliderData.value}%`}
              {...sliderData}
            />
          </div>
        </div>
        <style jsx>{tradeStyles}</style>
      </>
    );
  }, [
    quoteCoinBalance,
    coinBalance,
    currentSpotContract,
    state.buyPrice,
    state.sellPrice,
    state.buyAmount,
    state.sellAmount,
    state.buyVolume,
    state.sellVolume,
    state.minPrice,
    state.maxPrice,
    theme,
    isBuy,
    isLimit,
    sliderData.value,
    coin,
    quoteCoin,
    isLogin,
  ]);

  useEffect(() => {
    if (state.buyAmount && quoteCoinBalance > 0) {
      if (Number(state.buyAmount) >= quoteCoinBalance) {
        setSliderData((draft) => {
          draft.value = 100;
        });
      } else {
        const value = state.buyAmount.div(quoteCoinBalance).toFixed(2).mul(100);
        setSliderData((draft) => {
          draft.value = Number(value);
        });
      }
    } else {
      setSliderData((draft) => {
        draft.value = 0;
      });
    }
  }, [state.buyAmount, quoteCoinBalance]);

  useEffect(() => {
    if (state.sellVolume && coinBalance > 0) {
      if (Number(state.sellVolume) >= coinBalance) {
        setSliderData((draft) => {
          draft.value = 100;
        });
      } else {
        const value = state.sellVolume.div(coinBalance).toFixed(2).mul(100);
        setSliderData((draft) => {
          draft.value = Number(value);
        });
      }
    } else {
      setSliderData((draft) => {
        draft.value = 0;
      });
    }
  }, [state.sellVolume, coinBalance]);

  useEffect(() => {
    switch (from) {
      case 'trading-bot-grid':
        setTimeout(() => {
          Strategy.changeSelectType(LIST_TYPE.GRID);
          Trade.changeTradeTab(TRADE_TAB.GRID);
        }, 0);
        break;
      case 'trading-bot-invest':
        setTimeout(() => {
          Strategy.changeSelectType(LIST_TYPE.INVEST);
          Trade.changeTradeTab(TRADE_TAB.GRID);
        }, 0);
        break;
    }
  }, [from]);

  const minAmount = useMemo(() => {
    return quoteCoinBalance > 0 ? 10 : 0;
  }, [quoteCoinBalance]);

  const minVolume = useMemo(() => {
    return coinBalance > 0 ? toMinNumber(currentSpotContract.volumeDigit) : 0;
  }, [coinBalance, currentSpotContract]);

  const renderMarketPriceTrade = useCallback(() => {
    return (
      <>
        <div className={`tradeWrapper ${theme}`}>
          <div className='priceWrapper row'>
            <span>{LANG('价格')}</span>
            <span>
              {isBuy ? `${LANG('以市场上最优价格买入')}` : `${LANG('以市场上最优价格卖出')}`} {quoteCoin}
            </span>
          </div>
          <div className='row'>
            <Input
              disabled={!isLogin}
              label={isBuy ? LANG('成交额') : LANG('数量')}
              unit={isBuy ? quoteCoin : coin}
              decimal={isBuy ? currentSpotContract.amountDigit : currentSpotContract.volumeDigit}
              min={isBuy ? minAmount : minVolume}
              value={isBuy ? state.buyAmount : state.sellVolume}
              onChange={(val) =>
                setState((draft) => {
                  if (isBuy) {
                    draft.buyAmount = val;
                  } else {
                    draft.sellVolume = val;
                  }
                })
              }
            />
          </div>
          <div className='sliderWrapper row'>
            <Slider
              percent={percent}
              isDark={isDark}
              grid={5}
              grids={[0, 25, 50, 75, 100]}
              onChange={(val: number) => setTimeout(() => onSliderChanged(val, false), 0)}
              renderText={() => `${sliderData.value}%`}
              {...sliderData}
            />
          </div>
        </div>
        <style jsx>{tradeStyles}</style>
      </>
    );
  }, [
    isBuy,
    state.buyAmount,
    state.sellVolume,
    sliderData.value,
    theme,
    coin,
    quoteCoin,
    isLogin,
    minAmount,
    minVolume,
  ]);

  const onOpenOrderClicked = useCallback(
    async (side: SideType) => {
      const isBuy = side === SideType.BUY;
      const volume = Number(
        isLimit ? (isBuy ? state.buyVolume : state.sellVolume) : isBuy ? state.buyAmount : state.sellVolume
      );

      const price = isLimit ? (isBuy ? state.buyPrice : state.sellPrice) : 0;
      if (routerId && volume > 0) {
        Loading.start();
        const result = await Trade.openOrderByMarketPrice(
          side,
          isLimit ? SpotOrderType.LIMIT : SpotOrderType.MARKET,
          routerId,
          Number(price),
          Number(volume)
        );
        if (result.code === 200) {
          message.success(LANG('委托提交成功'));
          initialState();
        } else {
          message.error(result.message);
        }
        Loading.end();
      }
    },
    [state.buyVolume, state.sellVolume, state.buyPrice, state.sellPrice, routerId, isLimit, state.buyAmount]
  );

  const ToolTipMemo = useMemo(() => {
    return (
      <Tooltip
        color='#fff'
        placement='topRight'
        title={
          isLimit
            ? LANG('限价委托是指以特定或更优价格进行买卖，限价单不能保证执行。')
            : LANG('市价委托是指按照目前市场价格进行快速买卖。')
        }
      >
        <Image src='/static/images/trade/tips.svg' className='exchange' width={18} height={18} alt='' />
      </Tooltip>
    );
  }, [isLimit]);

  const ExchangeIconMemo = useMemo(() => {
    return (
      <CommonIcon
        name='common-spot-exchange-0'
        width={11}
        height={12}
        className='exchange'
        enableSkin
        onClick={() => {
          if (isLogin) {
            setState((draft) => {
              draft.transferModalVisible = true;
            });
          } else {
            router.push('/login');
          }
        }}
      />
    );
  }, [isLogin]);

  const onGridTabClicked = useCallback(() => {
    Trade.changeTradeTab(TRADE_TAB.GRID);
    if (!Strategy.isSupportSymbol(routerId)) {
      router.push(`/spot/btc_usdt?from=other-quote`);
    }
  }, [routerId]);

  useEffect(() => {
    if (!Strategy.isSupportSymbol(routerId)) {
      Trade.changeTradeTab(TRADE_TAB.SPOT);
    }
  }, [routerId]);

  return (
    <>
      <div className={`container ${theme}`}>
        <div className={`header ${tradeTab === TRADE_TAB.SPOT ? '' : 'bg'}`}>
          <div onClick={() => Trade.changeTradeTab(TRADE_TAB.SPOT)} className='spot-tab'>
            {LANG('币币交易')}
          </div>
          <div className='grid-tab' onClick={onGridTabClicked}>
            <CommonIcon
              name={tradeTab === TRADE_TAB.GRID ? 'common-grid-robot-active-0' : 'common-grid-robot-0'}
              size={24}
              className='robot-icon'
              enableSkin
            />
            <CommonIcon
              name={tradeTab === TRADE_TAB.SPOT ? 'common-spot-grid' : 'common-spot-grid-active'}
              width={83}
              height={46}
            />
          </div>
        </div>
        {tradeTab === TRADE_TAB.SPOT ? (
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
            <div className='order-type-btns'>
              <div>
                <button className={getActive(isLimit)} onClick={() => onTabChanged(SpotOrderType.LIMIT)}>
                  {LANG('限价')}
                </button>
                {currentSpotContract.market && (
                  <button className={getActive(!isLimit)} onClick={() => onTabChanged(SpotOrderType.MARKET)}>
                    {LANG('市价')}
                  </button>
                )}
              </div>
              {ToolTipMemo}
            </div>
            <div className='balance-wrapper'>
              <div>
                <span className='label'>{LANG('可用')}</span>
                {isBuy ? (
                  <span className='balance'>
                    {(isLogin ? quoteCoinBalance : 0).toFormat(quoteCoinScale)} {quoteCoin}
                  </span>
                ) : (
                  <span className='balance'>{`${coinBalance.toFormat(coinScale)} ${coin}`}</span>
                )}
              </div>
              {ExchangeIconMemo}
            </div>
            {isLimit ? renderLimitPriceTrade() : renderMarketPriceTrade()}
            <button
              className={`openOrder ${isBuy ? 'btn-green' : 'btn-red'}`}
              onClick={() => onOpenOrderClicked(isBuy ? SideType.BUY : SideType.SELL)}
              disabled={!spotTradeEnable}
            >
              {isBuy ? LANG('买入____2') : LANG('卖出____2')} {coin}
            </button>
          </div>
        ) : (
          <StrategyView />
        )}
        {tradeTab === TRADE_TAB.SPOT && (
          <div className={`footer ${isSmallDesktop ? 'small-layout-footer' : ''} ${isTablet ? 'hide' : ''}`}>
            <div className='title'>{LANG('资产')}</div>
            {isLogin ? (
              <>
                <div className='content'>
                  <div>
                    <CoinLogo coin={coin} width={24} height={24} alt='coin-icon' />
                    <div className='coinName'>
                      <div>{coin}</div>
                      <div>{currentSpotContract.fullname}</div>
                    </div>
                    <div className='money'>
                      <div>{coinBalance.toFormat(coinScale)}</div>
                      <div>
                        ≈ <RateText money={coinBalance} prefix currency={coin} />
                      </div>
                    </div>
                  </div>
                  <div>
                    <CoinLogo coin={quoteCoin} width={24} height={24} alt='coin-icon' />
                    <div className='coinName'>
                      <div>{quoteCoin}</div>
                      <div>{UNIT[quoteCoin]}</div>
                    </div>
                    <div className='money'>
                      <div>{quoteCoinBalance.toFormat(quoteCoinScale)}</div>
                      <div>
                        ≈ <RateText money={quoteCoinBalance} prefix currency={quoteCoin} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className='links'>
                  <TrLink href='/account/fund-management/asset-account/recharge'>{LANG('充币')}</TrLink>
                  <TrLink href='/fiat-crypto'>{LANG('买币')}</TrLink>
                  <TrLink href='/account/fund-management/asset-account/withdraw'>{LANG('提币')}</TrLink>
                </div>
              </>
            ) : (
              <div className='links disabled'>
                <button>{LANG('充币')}</button>
                <button>{LANG('买币')}</button>
                <button>{LANG('提币')}</button>
              </div>
            )}
          </div>
        )}
      </div>
      {state.transferModalVisible && (
        <TransferModal
          defaultSourceAccount={ACCOUNT_TYPE.SWAP_U}
          defaultTargetAccount={enableLite ? ACCOUNT_TYPE.LITE : ACCOUNT_TYPE.SPOT}
          open={state.transferModalVisible}
          onCancel={() => {
            setState((draft) => {
              draft.transferModalVisible = false;
            });
          }}
          onTransferDone={() => Trade.getBalance()}
        />
      )}
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
    border-bottom-left-radius: var(--theme-trade-layout-radius);
    border-bottom-right-radius: var(--theme-trade-layout-radius);
    .header,
    .body {
      background: var(--theme-background-color-2-2);
    }
    .header {
      flex: none;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top-left-radius: var(--theme-trade-layout-radius);
      border-top-right-radius: var(--theme-trade-layout-radius);
      color: var(--theme-font-color-1);
      &.bg {
        background-color: var(--theme-background-color-9);
      }
      > div {
        display: flex;
        align-items: center;
        height: 46px;
      }
      .spot-tab {
        padding-left: 10px;
        cursor: pointer;
      }
      .grid-tab {
        width: 83px;
        position: relative;
        :global(.robot-icon) {
          position: absolute;
          right: 17px;
          cursor: pointer;
        }
      }
    }
    .body {
      flex: 1;
      padding: 0 10px;
      padding-top: 17px;
      height: 437px;
      border-bottom-left-radius: var(--theme-trade-layout-radius);
      border-bottom-right-radius: var(--theme-trade-layout-radius);
      .order-type-btns {
        margin-top: 13px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        button {
          border: none;
          background: transparent;
          padding: 0;
          font-size: 16px;
          color: var(--theme-font-color-placeholder);
          cursor: pointer;
          &:first-child {
            margin-right: 17px;
          }
          &.active {
            color: var(--skin-color-active);
          }
        }
      }
      .balance-wrapper {
        display: flex;
        align-items: center;
        margin-top: 20px;
        .label {
          color: var(--theme-font-color-placeholder);
          margin-right: 6px;
        }
        .balance {
          color: var(--theme-font-color-1);
        }
        :global(.exchange) {
          cursor: pointer;
          margin-left: 3px;
        }
      }
      .openOrder {
        border: none;
        outline: none;
        height: 36px;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        border-radius: 5px;
        cursor: pointer;
        &:disabled {
          color: var(--theme-trade-text-2) !important;
          cursor: not-allowed !important;
          background-color: var(--theme-trade-bg-color-4);
          &:hover {
            background-color: var(--theme-trade-bg-color-4);
          }
        }
        &.btn-red {
          background: var(--color-red);
        }
        &.btn-green {
          background: var(--color-green);
        }
      }
    }
    :global(.footer) {
      background-color: var(--theme-background-color-1);
      border-top-left-radius: var(--theme-trade-layout-radius);
      border-top-right-radius: var(--theme-trade-layout-radius);
      padding: 13px 10px;
      margin-top: var(--theme-trade-layout-spacing);
      flex: 1;
      &.small-layout-footer {
        border-radius: var(--theme-trade-layout-radius);
      }
      &.hide {
        display: none;
        flex: auto;
      }
      .title {
        font-size: 14px;
        font-weight: 500;
        color: var(--theme-font-color-1);
        margin-bottom: 14px;
      }
      .links {
        display: flex;
        margin-top: 10px;
        :global(a),
        button {
          display: inline-block;
          flex: 1;
          background-color: var(--theme-sub-button-bg);
          color: var(--theme-font-color-1);
          height: 29px;
          line-height: 29px;
          border-radius: 8px;
          margin-right: 9px;
          text-align: center;
          white-space: nowrap;
          border: none;
        }
        &.disabled {
          button {
            cursor: not-allowed;
          }
        }
      }
      .content {
        > div {
          display: flex;
          align-items: center;
          padding: 15px 0;
          color: var(--theme-font-color-1);
          &:first-child {
            border-bottom: 1px solid var(--theme-border-color-1);
          }
          :global(img) {
            margin-right: 12px;
          }
          .coinName {
            flex: 1;
          }
          .coinName,
          .money {
            display: flex;
            flex-direction: column;
            font-size: 14px;
            font-weight: 500;
            > div:last-child {
              font-size: 12px;
              font-weight: 400;
              color: var(--theme-font-color-2);
            }
          }
          .money {
            text-align: right;
          }
        }
      }
    }
  }
  :global(.ant-tooltip-inner),
  :global(.ant-tooltip-arrow:before) {
    background: var(--theme-background-color-2-3) !important;
    color: var(--theme-font-color-1) !important;
  }
`;

const tradeStyles = css`
  .tradeWrapper {
    padding: 30px 0 0;
    .priceWrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-left: 10px;
      padding-right: 15px;
      height: 36px;
      background: var(--theme-tips-color);
      border-radius: 8px;
      color: var(--theme-font-color-placeholder);
    }
    .sliderWrapper {
      padding: 16px 0;
    }
    .row {
      margin-bottom: 9px;
    }
  }
`;
