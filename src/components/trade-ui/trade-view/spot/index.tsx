import CommonIcon from '@/components/common-icon';
import { Loading } from '@/components/loading';
import { ACCOUNT_TYPE, TransferModal } from '@/components/modal';
import { OrderBookEmitter } from '@/core/events';
import { useLocalStorage, useRouter, useTheme } from '@/core/hooks';
import { LANG, TrLink } from '@/core/i18n';
import { SUBSCRIBE_TYPES, useWs } from '@/core/network';
import { Account, SideType, Spot, SpotOrderType } from '@/core/shared';
import { MarketsMap } from '@/core/shared/src/markets/types';
import { LOCAL_KEY } from '@/core/store';
import { getActive, isSpotEtf, message, toMinNumber } from '@/core/utils';
import { useCallback, useEffect, useMemo } from 'react';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';
import EtfTips from './components/etf-tips';
import Input from './components/input';
import SwapLink from './components/swap-link';
import TradeBtn from './components/trade-btn';

const Trade = Spot.Trade;

export type NS = number | string;

function SpotTradeUI() {
  const enableLite = process.env.NEXT_PUBLIC_LITE_ENABLE === 'true';
  const router = useRouter();
  const routerId = router.query.id as string;
  const [tab, setTab] = useLocalStorage(LOCAL_KEY.SPOT_ORDER_TYPE, SpotOrderType.LIMIT);
  const { coin, quoteCoin, quoteCoinBalance, coinBalance, currentSpotContract, coinScale } = Trade.state;
  const { theme } = useTheme();
  const isLogin = Account.isLogin;
  const [state, setState] = useImmer({
    buyPrice: '' as NS,
    sellPrice: '' as NS,
    buyAmount: '' as NS,
    sellAmount: '' as NS,
    buyVolume: '' as NS,
    sellVolume: '' as NS,
    priceTemp: '' as NS,
    marketMap: null as null | MarketsMap,
    initialPrice: false,
    buyRatioActiveTab: 0,
    sellRatioActiveTab: 0,
    transferModalVisible: false,
    minPrice: '' as NS,
    maxPrice: '' as NS,
    newPrice: '' as NS,
  });

  useEffect(() => {
    if (!currentSpotContract.market) {
      setTab(SpotOrderType.LIMIT);
    }
  }, [tab, currentSpotContract.market]);

  useEffect(() => {
    routerId && Trade.init(routerId);
    initialState();
  }, [routerId]);

  const initialState = () => {
    setState((draft) => {
      draft.initialPrice = false;
      draft.buyPrice = '';
      draft.sellPrice = '';
      draft.buyAmount = '';
      draft.sellAmount = '';
      draft.buyVolume = '';
      draft.sellVolume = '';
      draft.buyRatioActiveTab = 0;
      draft.sellRatioActiveTab = 0;
      draft.priceTemp = '';
      draft.minPrice = '';
      draft.maxPrice = '';
      draft.newPrice = '';
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

  const isLimit = tab == SpotOrderType.LIMIT;

  const isEtf = isSpotEtf(routerId);

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
        setTab(tab);
      } else {
        setState((draft) => {
          draft.buyAmount = '';
          draft.sellVolume = '';
        });
        setTab(tab);
      }
      setState((draft) => {
        draft.buyRatioActiveTab = 0;
        draft.sellRatioActiveTab = 0;
      });
    },
    [state.newPrice]
  );

  const setActive = useCallback(
    (isBuy: boolean, index: number) => {
      return (isBuy ? state.buyRatioActiveTab : state.sellRatioActiveTab) === index ? 'btn-active' : '';
    },
    [state.buyRatioActiveTab, state.sellRatioActiveTab]
  );

  const renderRatioBtns = useCallback(
    (onClick: (val: number, isBuy: boolean) => void, isBuy: boolean) => {
      const _onClick = (ratio: number, index: number) => {
        onClick(ratio, isBuy);
        setState((draft) => {
          if (isBuy) {
            draft.buyRatioActiveTab = index;
          } else {
            draft.sellRatioActiveTab = index;
          }
        });
      };
      return (
        <div className='btn-group'>
          <button className={setActive(isBuy, 1)} onClick={() => _onClick(0.25, 1)}>
            25%
          </button>
          <button className={setActive(isBuy, 2)} onClick={() => _onClick(0.5, 2)}>
            50%
          </button>
          <button className={setActive(isBuy, 3)} onClick={() => _onClick(0.75, 3)}>
            75%
          </button>
          <button className={setActive(isBuy, 4)} onClick={() => _onClick(1, 4)}>
            100%
          </button>
        </div>
      );
    },
    [setActive, theme, state.sellRatioActiveTab, state.buyRatioActiveTab]
  );

  const onLimitRatioBtnClicked = useCallback(
    (ratio: number, isBuy: boolean) => {
      setState((draft) => {
        if (isBuy) {
          // 先通过可交易金额去反推可购买数量，但是数量存在小数的精度省略，所以再通过可购买数量来推出本次用于购买的金额
          const amount = (isLogin ? quoteCoinBalance : 0).mul(ratio).toFixed(currentSpotContract.amountDigit);
          const volume = amount.div(state.buyPrice).toFixed(currentSpotContract.volumeDigit);
          draft.buyVolume = isLogin ? volume : 0;
          draft.buyAmount = volume.mul(state.buyPrice).toFixed(currentSpotContract.amountDigit);
        } else {
          draft.sellVolume = isLogin ? coinBalance.mul(ratio).toFixed(currentSpotContract.volumeDigit) : 0;
          draft.sellAmount = (isLogin ? coinBalance.mul(ratio) : 0)
            .mul(state.buyPrice)
            .toFixed(currentSpotContract.amountDigit);
        }
      });
    },
    [quoteCoinBalance, coinBalance, currentSpotContract, state.buyPrice, isLogin]
  );

  const onMarketRatioBtnClicked = useCallback(
    (ratio: number, isBuy: boolean) => {
      setState((draft) => {
        if (isBuy) {
          draft.buyAmount = (isLogin ? quoteCoinBalance : 0).mul(ratio).toFixed(currentSpotContract.amountDigit);
        } else {
          draft.sellVolume = isLogin ? coinBalance.mul(ratio).toFixed(currentSpotContract.volumeDigit) : 0;
        }
      });
    },
    [quoteCoinBalance, coinBalance, currentSpotContract, isLogin]
  );

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

  const renderChargeLink = () => {
    return (
      <TrLink className='charge-link' href={isLogin ? '/account/fund-management/asset-account/recharge' : '/login'}>
        {LANG('充币')}
      </TrLink>
    );
  };

  const ExchangeIconMemo = useMemo(() => {
    return (
      <CommonIcon
        name='common-exchange-0'
        width={12}
        height={13}
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

  const renderBalance = useCallback(
    (isBuy: boolean) => {
      return (
        <>
          <div className={`row ${theme}`}>
            <div className={`left ${isBuy ? 'main-raise' : 'main-fall'} balance`}>{`${
              isBuy ? LANG('购买') : LANG('卖出____2')
            } ${coin}`}</div>
            {isBuy ? (
              <div className='right'>
                {ExchangeIconMemo}
                <span className='label'>{LANG('可用')}:</span>
                <span className='balance'>{`${(isLogin ? quoteCoinBalance : 0).toFormat()} ${quoteCoin}`}</span>
                {renderChargeLink()}
              </div>
            ) : (
              <div className='right'>
                <span className='label'>{LANG('可用')}:</span>
                <span className='balance'>{`${isLogin ? coinBalance.toFormat(coinScale) : 0} ${coin}`}</span>
                {!isEtf && renderChargeLink()}
              </div>
            )}
          </div>
          <style jsx>{tradeStyles}</style>
        </>
      );
    },
    [quoteCoinBalance, coinBalance, theme, isEtf, coin, quoteCoin, isLogin]
  );

  const renderLimitPriceTrade = useCallback(
    (type: SideType) => {
      const isBuy = type === SideType.BUY;
      return (
        <>
          <div className={`${isBuy ? 'buy' : 'sell'} ${theme}`}>
            {renderBalance(isBuy)}
            <div className='row'>
              <Input
                label={LANG('价格')}
                placeholder={LANG('请输入')}
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
                          draft.buyAmount = state.priceTemp
                            .mul(state.buyVolume)
                            .toFixed(currentSpotContract.amountDigit);
                        }
                      });
                    }
                  } else {
                    if (state.sellPrice === '' || state.sellPrice === '0') {
                      setState((draft) => {
                        draft.sellPrice = 0;
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
                placeholder={LANG('请输入')}
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
                      draft.buyRatioActiveTab = 0;
                    } else {
                      draft.sellVolume = val;
                      draft.sellAmount =
                        val === '' ? '' : val.mul(state.sellPrice).toFixed(currentSpotContract.amountDigit);
                      draft.sellRatioActiveTab = 0;
                    }
                  })
                }
                defaultValue={0}
              />
            </div>
            <div className='row'>{renderRatioBtns(onLimitRatioBtnClicked, isBuy)}</div>
            <div className='row'>
              <Input
                label={LANG('交易额')}
                placeholder={LANG('请输入')}
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
                      draft.buyRatioActiveTab = 0;
                    } else {
                      draft.sellAmount = val;
                      draft.sellVolume =
                        val === '' ? '' : val.div(state.sellPrice).toFixed(currentSpotContract.volumeDigit);
                      draft.sellRatioActiveTab = 0;
                    }
                  })
                }
                defaultValue={0}
              />
            </div>
            <div className='row open-order-btns'>
              {isBuy ? (
                <TradeBtn
                  isBuy
                  text={`${LANG('买入____2')} ${coin}`}
                  onClick={() => onOpenOrderClicked(SideType.BUY)}
                />
              ) : (
                <TradeBtn
                  isBuy={false}
                  text={`${LANG('卖出____2')} ${coin}`}
                  onClick={() => onOpenOrderClicked(SideType.SELL)}
                />
              )}
            </div>
          </div>
          <style jsx>{tradeStyles}</style>
        </>
      );
    },
    [
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
      state.sellRatioActiveTab,
      state.buyRatioActiveTab,
      coin,
      quoteCoin,
      isLogin,
    ]
  );

  const minAmount = useMemo(() => {
    return quoteCoinBalance > 0 ? 10 : 0;
  }, [quoteCoinBalance]);

  const minVolume = useMemo(() => {
    return coinBalance > 0 ? toMinNumber(currentSpotContract.volumeDigit) : 0;
  }, [coinBalance, currentSpotContract]);

  const renderMarketPriceTrade = useCallback(
    (type: SideType) => {
      const isBuy = type === SideType.BUY;
      return (
        <>
          <div className={`${isBuy ? 'buy' : 'sell'} ${theme}`}>
            {renderBalance(isBuy)}
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
                      draft.buyRatioActiveTab = 0;
                    } else {
                      draft.sellVolume = val;
                      draft.sellRatioActiveTab = 0;
                    }
                  })
                }
              />
            </div>
            <div className='row'>{renderRatioBtns(onMarketRatioBtnClicked, isBuy)}</div>
            <div className='row' style={{ height: '36px' }} />
            <div className='row open-order-btns'>
              {isBuy ? (
                <TradeBtn
                  isBuy
                  text={`${LANG('买入____2')} ${coin}`}
                  onClick={() => onOpenOrderClicked(SideType.BUY)}
                />
              ) : (
                <TradeBtn
                  isBuy={false}
                  text={`${LANG('卖出____2')} ${coin}`}
                  onClick={() => onOpenOrderClicked(SideType.SELL)}
                />
              )}
            </div>
          </div>
          <style jsx>{tradeStyles}</style>
        </>
      );
    },
    [
      quoteCoinBalance,
      coinBalance,
      currentSpotContract,
      state.buyAmount,
      state.sellVolume,
      coin,
      theme,
      state.sellRatioActiveTab,
      state.buyRatioActiveTab,
      isLogin,
      minAmount,
      minVolume,
    ]
  );

  return (
    <>
      <div className={`container ${theme}`}>
        {isEtf && <EtfTips isLimit={isLimit} />}
        <div className='tabWrapper'>
          <ul>
            <li className={getActive(isLimit)} onClick={() => onTabChanged(SpotOrderType.LIMIT)}>
              {LANG('限价交易')}
            </li>
            {currentSpotContract.market && (
              <li className={getActive(!isLimit)} onClick={() => onTabChanged(SpotOrderType.MARKET)}>
                {LANG('市价交易')}
              </li>
            )}
          </ul>
          <SwapLink />
        </div>
        {isLimit ? (
          <div className='panel'>
            {renderLimitPriceTrade(SideType.BUY)}
            {renderLimitPriceTrade(SideType.SELL)}
          </div>
        ) : (
          <div className='panel'>
            {renderMarketPriceTrade(SideType.BUY)}
            {renderMarketPriceTrade(SideType.SELL)}
          </div>
        )}
      </div>
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
      <style jsx>{styles}</style>
    </>
  );
}

export default SpotTradeUI;

const styles = css`
  .container {
    .tabWrapper {
      display: flex;
      justify-content: space-between;
      height: 36px;
      align-items: center;
      border-bottom: 1px solid var(--skin-border-color-1);
      color: var(--theme-font-color-3);
      margin: 0 19px;
      ul {
        padding: 0;
        margin: 0;
        display: flex;
        li {
          display: flex;
          align-items: center;
          margin-right: 30px;
          height: 36px;
          cursor: pointer;
          position: relative;
          &.active {
            color: var(--theme-font-color-1);
            font-weight: 500;
            &:after {
              position: absolute;
              content: '';
              width: 100%;
              height: 2px;
              background: var(--skin-primary-color);
              bottom: 0;
              left: 0;
            }
          }
        }
      }
    }
    .panel {
      padding: 0 19px;
      display: flex;
    }
  }
`;

const tradeStyles = css`
  .buy,
  .sell {
    flex: 1;
  }
  .buy {
    margin-right: 18px;
  }
  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    margin-top: 12px;
    &.open-order-btns {
      margin-top: 32px;
    }
    .left {
      width: 80px;
      font-weight: 500;
      &.balance {
        flex: 1;
      }
    }
    .right {
      font-size: 12px;
      font-weight: bold;
      display: flex;
      align-items: center;
      :global(.exchange) {
        margin-right: 6px;
        cursor: pointer;
      }
      :global(a) {
        color: var(--skin-hover-font-color);
        margin-left: 3px;
      }
      .label {
        color: var(--theme-font-color-3);
      }
      .balance {
        display: inline-block;
        color: var(--theme-font-color-1);
      }
      span {
        margin-right: 6px;
      }
      :global(.charge-link) {
        border-left: 1px solid var(--skin-border-color-1);
        padding-left: 9px;
      }
    }
    .input {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--theme-background-color-disabled-light);
      color: var(--theme-font-color-3);
      height: 36px;
      line-height: 36px;
      padding-left: 10px;
      padding-right: 17px;
      cursor: default;
      border-radius: 5px;
      font-weight: 500;
    }
  }
  :global(.btn-group) {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    :global(button) {
      flex: 1;
      user-select: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 5px;
      margin-right: 9px;
      border: none;
      font-size: 12px;
      font-weight: 500;
      height: 20px;
      transition: all 0.1s ease-in;
      background: var(--theme-background-color-2-4);
      color: #737473;
      &:last-child {
        margin-right: 0;
      }
    }
    :global(.btn-active) {
      background: var(--skin-primary-color);
      color: #141717;
    }
  }
`;
