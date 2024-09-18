import CommonIcon from '@/components/common-icon';
import { Loading } from '@/components/loading';
import { BottomModal, MobileModal } from '@/components/mobile-modal';
import { Svg } from '@/components/svg';
import Slider from '@/components/trade-ui/trade-view/components/slider';
import { NS } from '@/components/trade-ui/trade-view/spot';
import Input from '@/components/trade-ui/trade-view/spot-pro/components/input';
import { BaseModalStyle } from '@/components/trade-ui/trade-view/spot-strategy/components/base-modal-style';
import PositionButton from '@/components/trade-ui/trade-view/spot/components/position-button';
import { OrderBookEmitter } from '@/core/events';
import { useLocalStorage, useRouter, useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { SUBSCRIBE_TYPES, useWs } from '@/core/network';
import { LIST_TYPE, MarketsMap, SideType, Spot, SpotOrderType, TRADE_TAB } from '@/core/shared';
import { LOCAL_KEY, SESSION_KEY, useAppContext } from '@/core/store';
import { getActive, toMinNumber } from '@/core/utils';
import { Tooltip, message } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useImmer } from 'use-immer';
import { GridViewMobile } from './grid-view-mobile';
import { InvestViewMobile } from './invest-view-mobile';

const Trade = Spot.Trade;
const Strategy = Spot.Strategy;

const TradeView = () => {
  const router = useRouter();
  const routerId = router.query.id as string;
  const { isDark } = useTheme();
  const [tab, setTab] = useLocalStorage(LOCAL_KEY.SPOT_ORDER_TYPE, SpotOrderType.LIMIT);
  const { coin, quoteCoin, quoteCoinBalance, coinBalance, currentSpotContract } = Trade.state;
  const { selectType } = Strategy.state;
  const [visible, setVisible] = useState(false);
  const { isLogin } = useAppContext();
  const [showGrid, setShowGrid] = useState(false);

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
  });

  const [sliderData, setSliderData] = useImmer({
    type: 'range',
    step: 1,
    value: 0,
    min: 0,
    max: 100,
  });

  useEffect(() => {
    if (!currentSpotContract.market) {
      setTab(SpotOrderType.LIMIT);
    }
  }, [tab, currentSpotContract.market]);

  useEffect(() => {
    routerId && Trade.init(routerId);
    routerId && Strategy.init(routerId);
    Trade.changeTradeTab(TRADE_TAB.SPOT);
    initialState();
  }, [routerId]);

  useEffect(() => {
    initialState();
  }, [tab, state.sideType]);

  const initialState = () => {
    setState((draft) => {
      draft.initialPrice = false;
      draft.buyPrice = '';
      draft.sellPrice = '';
      draft.buyAmount = '';
      draft.sellAmount = '';
      draft.buyVolume = '';
      draft.sellVolume = '';
      draft.minPrice = '';
      draft.maxPrice = '';
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
    if (state.marketMap) {
      const marketItem = state.marketMap[routerId];
      setState((draft) => {
        if (!state.initialPrice && Number(marketItem?.price) > 0) {
          draft.buyPrice = marketItem?.price;
          draft.sellPrice = marketItem?.price;
          draft.priceTemp = marketItem?.price;
          draft.initialPrice = true;
        }
      });
    }
  }, [state.marketMap, routerId, state.initialPrice]);

  const isLimit = tab == SpotOrderType.LIMIT;
  const isBuy = state.sideType == SideType.BUY;

  const onTabChanged = useCallback(
    (tab: SpotOrderType) => {
      if (tab === SpotOrderType.LIMIT) {
        setState((draft) => {
          draft.buyAmount = '';
          draft.sellAmount = '';
          draft.buyVolume = '';
          draft.sellVolume = '';
          draft.buyPrice = state.priceTemp;
          draft.sellPrice = state.priceTemp;
        });
        setTab(tab);
      } else {
        setState((draft) => {
          draft.buyAmount = '';
          draft.sellVolume = '';
        });
        setTab(tab);
      }
    },
    [state.priceTemp]
  );

  const ExchangeIconMemo = useMemo(() => {
    return (
      <CommonIcon
        name='common-exchange-0'
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

  const onBottomBtnClicked = (type: SideType) => {
    if (!isLogin) {
      const pathname = router.asPath;
      sessionStorage.setItem(SESSION_KEY.LOGIN_REDIRECT, pathname);
      router.push('/login');
      return;
    }
    setState((draft) => {
      draft.sideType = type;
    });
    setVisible(true);
  };

  const minAmount = useMemo(() => {
    return quoteCoinBalance > 0 ? 10 : 0;
  }, [quoteCoinBalance]);

  const minVolume = useMemo(() => {
    return coinBalance > 0 ? toMinNumber(currentSpotContract.volumeDigit) : 0;
  }, [coinBalance, currentSpotContract]);

  const percent = useMemo(() => {
    const { value, min, max } = sliderData;
    return value ? ((value - min) / (max - min)) * 100 : 0;
  }, [sliderData]);

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

  const renderMarketPriceTrade = useCallback(() => {
    return (
      <>
        <div className='container'>
          <div className='row'>
            <div className='input'>
              <span>{LANG('价格')}</span>
              <span>
                {isBuy ? LANG('以市场上最优价格买入') : LANG('以市场上最优价格卖出')} {quoteCoin}
              </span>
            </div>
          </div>
          <div className='row'>
            <Input
              label={isBuy ? LANG('成交额') : LANG('数量')}
              placeholder={LANG('请输入')}
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
              onChange={(val: number) => onSliderChanged(val, true)}
              renderText={() => `${sliderData.value}%`}
              {...sliderData}
            />
          </div>
        </div>
        <style jsx>{`
          .container {
            margin-top: 25px;
            .row {
              height: 36px;
              color: var(--theme-font-color-2);
              margin-bottom: 11px;
              .input {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0 12px;
                line-height: 36px;
                background: var(--theme-tips-color);
                border-radius: 8px;
              }
            }
          }
        `}</style>
      </>
    );
  }, [
    quoteCoinBalance,
    coinBalance,
    currentSpotContract,
    state.buyAmount,
    state.sellVolume,
    coin,
    isLogin,
    minAmount,
    minVolume,
    isBuy,
    sliderData.value,
  ]);

  const renderLimitPriceTrade = useCallback(() => {
    return (
      <>
        <div className='container'>
          <div className='row'>
            <Input
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
        <style jsx>{`
          .container {
            margin-top: 25px;
            .row {
              height: 36px;
              color: var(--theme-font-color-2);
              margin-bottom: 11px;
              .input {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0 12px;
                line-height: 36px;
                background: var(--theme-tips-color);
                border-radius: 8px;
              }
            }
          }
        `}</style>
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
    isBuy,
    isLimit,
    sliderData.value,
    coin,
    quoteCoin,
    isLogin,
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
          setVisible(false);
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

  const onCreateGridClicked = () => {
    if (isLogin) {
      Strategy.changeMobileStrategyModalVisible(true);
    } else {
      router.push('/login');
    }
  };

  const onQuitClicked = () => {
    Strategy.changeSelectType(null);
    setShowGrid(false);
  };

  return (
    <>
      <div className='container'>
        {showGrid ? (
          <>
            <button className='back' onClick={onQuitClicked}>
              {LANG('退出策略')}
            </button>
            <button className='create' onClick={onCreateGridClicked}>
              {LANG('创建策略')}
            </button>
          </>
        ) : (
          <>
            <div className='bot' onClick={() => setShowGrid(true)}>
              <CommonIcon name='common-grid-robot-active-0' size={23} className='robot-icon' enableSkin />
              Bots
            </div>
            <button className='buy' onClick={() => onBottomBtnClicked(SideType.BUY)}>
              {LANG('买入____2')}
            </button>
            <button className='sell' onClick={() => onBottomBtnClicked(SideType.SELL)}>
              {LANG('卖出____2')}
            </button>
          </>
        )}
      </div>
      <MobileModal visible={visible} onClose={() => setVisible(false)} type='bottom'>
        <BottomModal
          title={LANG('币币交易')}
          confirmText={`${isBuy ? LANG('买入____2') : LANG('卖出____2')} ${coin}`}
          onConfirm={() => onOpenOrderClicked(isBuy ? SideType.BUY : SideType.SELL)}
        >
          <div className='trade-view-modal'>
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
            <ul className='tab-wrapper'>
              <li className={getActive(isLimit)} onClick={() => onTabChanged(SpotOrderType.LIMIT)}>
                {LANG('限价交易')}
              </li>
              {currentSpotContract.market && (
                <li className={getActive(!isLimit)} onClick={() => onTabChanged(SpotOrderType.MARKET)}>
                  {LANG('市价交易')}
                </li>
              )}
              <li>
                <Tooltip
                  color='#fff'
                  placement='topRight'
                  trigger={'click'}
                  arrow={false}
                  title={
                    isLimit
                      ? LANG('限价委托是指以特定或更优价格进行买卖，限价单不能保证执行。')
                      : LANG('市价委托是指按照目前市场价格进行快速买卖。')
                  }
                >
                  <Svg src={'/static/images/trade/tips.svg'} width='17' height='17' />
                </Tooltip>
              </li>
            </ul>
            <div className='balance-wrapper'>
              <span className='label'>{LANG('可用')}</span>
              {isBuy ? (
                <span className='balance'>{`${(isLogin ? quoteCoinBalance : 0).toFormat()} ${quoteCoin}`}</span>
              ) : (
                <span className='balance'>{`${isLogin ? coinBalance : 0} ${coin}`}</span>
              )}
              {ExchangeIconMemo}
            </div>
            <div className='input-wrapper'>{isLimit ? renderLimitPriceTrade() : renderMarketPriceTrade()}</div>
          </div>
        </BottomModal>
      </MobileModal>
      {(selectType === null || selectType === LIST_TYPE.GRID) && <GridViewMobile />}
      {selectType === LIST_TYPE.INVEST && <InvestViewMobile />}
      <BaseModalStyle />
      <style jsx>{`
        .container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .bot {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            margin: 0 20px;
            color: var(--theme-font-color-3);
          }
          button {
            flex: 1;
            margin: 10px 8px;
            height: 36px;
            border-radius: 6px;
            border: none;
            color: #fff;
            outline: none;
            font-weight: 500;
            &.buy {
              background: var(--color-green);
            }
            &.sell {
              background: var(--color-red);
            }
            &.back {
              background-color: var(--theme-background-color-8);
              color: var(--theme-font-color-3);
            }
            &.create {
              background-color: var(--skin-primary-color);
              color: var(--skin-font-color);
            }
          }
        }
        :global(.trade-view-modal) {
          .tab-wrapper {
            padding: 0;
            margin: 0;
            margin-top: 25px;
            li {
              display: inline-block;
              margin-right: 17px;
              color: var(--theme-font-color-2);
              &:last-child {
                margin-right: 0;
                float: right;
                margin-top: 2px;
              }
              &.active {
                color: var(--skin-main-font-color);
                font-weight: 500;
              }
            }
          }
          .balance-wrapper {
            margin-top: 25px;
            font-size: 12px;
            display: flex;
            align-items: center;
            .label {
              color: var(--theme-font-color-2);
              margin-right: 3px;
            }
            .balance {
              color: var(--theme-font-color-1);
              margin-right: 3px;
            }
          }
        }
        :global(.ant-tooltip-inner),
        :global(.ant-tooltip-arrow:before) {
          background: var(--theme-background-color-2-3) !important;
          color: var(--theme-font-color-1) !important;
        }
      `}</style>
    </>
  );
};

export default TradeView;
