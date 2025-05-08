import { Loading } from '@/components/loading';
import Slider from '@/components/trade-ui/trade-view/components/slider';
import { OrderBookEmitter } from '@/core/events';
import { useRouter, useSettingGlobal, useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Account, SideType, Spot, SpotOrderType } from '@/core/shared';
import { SESSION_KEY } from '@/core/store';
import { message } from 'antd';
import { useCallback, useEffect, useMemo } from 'react';
import { useImmer } from 'use-immer';
import { NS } from '../../spot';
import Input from './input';
import { TradeButtonStyle } from './trade-button-style';
import { Button } from '@/components/button';
import clsx from 'clsx';
import TradeInput from '@/components/trade-ui/trade-view/components/input';

const { Trade } = Spot;

const LimitTrade = ({
  isBuy,
  isPlan,
  minPrice,
  maxPrice,
  triggerPriceMin,
  triggerPriceMax,
  priceTemp,
  newPrice,
  initState,
  onSuccess,
}: {
  isBuy: boolean;
  isPlan: boolean;
  minPrice: NS;
  maxPrice: NS;
  triggerPriceMin: NS;
  triggerPriceMax: NS;
  priceTemp: NS;
  newPrice: NS;
  initState: () => void;
  onSuccess?: () => void;
}) => {
  const isLogin = Account.isLogin;
  const { isDark } = useTheme();
  const { spotTradeEnable } = useSettingGlobal();
  const router = useRouter();
  const routerId = router.query.id as string;

  const { coin, quoteCoin, quoteCoinBalance, coinBalance, currentSpotContract } = Trade.state;

  const [state, setState] = useImmer({
    triggerPrice: '' as NS,
    triggerPriceError: false,
    buyPrice: '' as NS,
    sellPrice: '' as NS,
    buyVolume: '' as NS,
    buyAmount: '' as NS,
    sellAmount: '' as NS,
    sellVolume: '' as NS,
    inputIsFocus: false,
  });

  const [sliderData, setSliderData] = useImmer({
    type: 'range',
    step: 1,
    value: 0,
    min: 0,
    max: 100,
  });

  const resetState = () => {
    setState((draft) => {
      draft.triggerPrice = '';
      draft.triggerPriceError = false;
      draft.buyPrice = '';
      draft.sellPrice = '';
      draft.buyVolume = '';
      draft.buyAmount = '';
      draft.sellAmount = '';
      draft.sellVolume = '';
    });
    setSliderData((draft) => {
      draft.value = 0;
    });
  };

  useEffect(() => {
    resetState();
  }, [isBuy]);

  useEffect(() => {
    const event = (price: string) => {
      setState((draft) => {
        draft.buyPrice = price;
        state.buyVolume && (draft.buyAmount = price.mul(state.buyVolume).toFixed(currentSpotContract.amountDigit));
        draft.sellPrice = price;
        state.sellVolume && (draft.sellAmount = price.mul(state.sellVolume).toFixed(currentSpotContract.amountDigit));
      });
    };
    const emitter = OrderBookEmitter.on(OrderBookEmitter.ORDER_BOOK_ITEM_PRICE, event);
    return () => {
      emitter.off(OrderBookEmitter.ORDER_BOOK_ITEM_PRICE, event);
    };
  }, []);

  useEffect(() => {
    setState((draft) => {
      draft.buyPrice = priceTemp;
      draft.sellPrice = priceTemp;
    });
  }, [priceTemp]);

  const calculateSliderValue = (amount: NS, balance: number) => {
    if (!amount || balance <= 0) return 0;
    if (Number(amount) >= balance) return 100;

    const percentage = amount.div(balance).toFixed(2).mul(100);
    return Number(percentage);
  };

  useEffect(() => {
    if (!state.inputIsFocus) return;
    setSliderData((draft) => {
      draft.value = calculateSliderValue(state.buyAmount, quoteCoinBalance);
    });
  }, [state.buyAmount, state.inputIsFocus, quoteCoinBalance]);

  useEffect(() => {
    if (!state.inputIsFocus) return;
    setSliderData((draft) => {
      draft.value = calculateSliderValue(state.sellVolume, coinBalance);
    });
  }, [state.sellVolume, state.inputIsFocus, coinBalance]);

  const percent = useMemo(() => {
    const { value, min, max } = sliderData;
    return value ? ((value - min) / (max - min)) * 100 : 0;
  }, [sliderData]);

  const onSliderChanged = useCallback(
    (val: number) => {
      if (isLogin) {
        setSliderData((draft) => {
          draft.value = val;
        });
        setState((draft) => {
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
        });
      }
    },
    [isBuy, coinBalance, quoteCoinBalance, currentSpotContract, state.buyPrice, isLogin]
  );

  const onOpenOrderClicked = useCallback(async () => {
    if (!isLogin) {
      const pathname = router.asPath;
      sessionStorage.setItem(SESSION_KEY.LOGIN_REDIRECT, pathname);
      router.push('/login');
    }
    const volume = Number(isBuy ? state.buyVolume : state.sellVolume);
    const price = isBuy ? state.buyPrice : state.sellPrice;
    if (isPlan && !state.triggerPrice) {
      setState((draft) => {
        draft.triggerPriceError = true;
      });
      return;
    }
    if (volume <= 0) {
      return message.error(
        LANG("最小下单数量{volume}", {
          volume: `${currentSpotContract.volumeMin} ${coin}`,
        }),
        1
      )
      return;
    }
    if (routerId && volume > 0) {
      Loading.start();
      const result = isPlan
        ? await Trade.openStopOrder(
          isBuy ? SideType.BUY : SideType.SELL,
          SpotOrderType.LIMIT,
          routerId,
          Number(state.triggerPrice),
          Number(price),
          Number(volume),
          sliderData.value
        )
        : await Trade.openOrder(
          isBuy ? SideType.BUY : SideType.SELL,
          SpotOrderType.LIMIT,
          routerId,
          Number(price),
          Number(volume),
          sliderData.value
        );
      if (result.code === 200) {
        message.success(LANG('委托提交成功'));
        resetState();
        initState();
        onSuccess && onSuccess();
      } else {
        message.error(result.message);
      }
      Loading.end();
    }
  }, [
    routerId,
    isBuy,
    isPlan,
    state.buyVolume,
    state.sellVolume,
    state.buyPrice,
    state.sellPrice,
    state.triggerPrice,
    isLogin,
  ]);

  const memoBtnText = useMemo(() => {
    if (!isLogin) {
      return `${LANG('登录')}/${LANG('注册')}`;
    }
    return (isBuy ? LANG('买入____2') : LANG('卖出____2')) + ` / ${coin}`;
  }, [isBuy, isLogin, coin]);

  return (
    <>
      <div className='trade-wrapper'>
        {isPlan && (
          <div className='row'>
            <Input
              label={LANG('触发价格')}
              unit={quoteCoin}
              decimal={currentSpotContract.digit}
              value={state.triggerPrice}
              showError={state.triggerPriceError}
              onChange={(val) =>
                setState((draft) => {
                  draft.triggerPrice = val;
                  draft.triggerPriceError = false;
                })
              }
              min={Number(triggerPriceMin)}
              max={Number(triggerPriceMax)}
              errorText={() => {
                if (state.triggerPriceError && !state.triggerPrice) {
                  return LANG('触发价格不能为空或0');
                }
                return '';
              }}
              allowEmpty
            />
          </div>
        )}
        <div className='row'>
          <span className='label'>{LANG('价格')}</span>
          {<TradeInput
            controllerV3
            aria-label={LANG('价格')}
            className={clsx('trade-input')}
            // label={LANG('价格')}
            type='number'
            value={isBuy ? state.buyPrice : state.sellPrice}
            // min={minPrice.toFixed()}
            // max={Number(maxPrice)}
            min={0}
            max={Number.MAX_SAFE_INTEGER}
            step={1 / Math.pow(10, currentSpotContract.digit > 0 ? currentSpotContract.digit : 0)}
            digit={currentSpotContract.digit}
            onChange={(val) =>
              setState((draft) => {
                if (isBuy) {
                  draft.buyPrice = val;
                  state.buyVolume &&
                    (draft.buyAmount = val.mul(state.buyVolume).toFixed(currentSpotContract.amountDigit));
                } else {
                  draft.sellPrice = String(val);
                  state.sellVolume &&
                    (draft.sellAmount = val.mul(state.sellVolume).toFixed(currentSpotContract.amountDigit));
                }
              })
            }
            onBlur={(e: any, next: any) => {
              if (isBuy) {
                if (!state.buyPrice) {
                  setState((draft) => {
                    draft.buyPrice = String(newPrice);
                    if (state.buyVolume) {
                      draft.buyAmount = priceTemp.mul(state.buyVolume).toFixed(currentSpotContract.amountDigit);
                    }
                  });
                } else {
                  next();
                }
              } else {
                if (!state.sellPrice) {
                  setState((draft) => {
                    draft.sellPrice = String(newPrice);
                    if (state.sellVolume) {
                      draft.sellAmount = priceTemp.mul(state.sellVolume).toFixed(currentSpotContract.amountDigit);
                    }
                  });
                } else {
                  next();
                }
              }

              // if (isBuy) {
              //   if (state.buyPrice === '' || state.buyPrice === '0') {
              //     setState((draft) => {
              //       draft.buyPrice = String(minPrice);
              //       if (state.buyVolume) {
              //         draft.buyAmount = priceTemp.mul(state.buyVolume).toFixed(currentSpotContract.amountDigit);
              //       }
              //     });
              //   }
              // } else {
              //   if (state.sellPrice === '' || state.sellPrice === '0') {
              //     setState((draft) => {
              //       draft.sellPrice = '';
              //       if (state.sellVolume) {
              //         draft.sellAmount = priceTemp.mul(state.sellVolume).toFixed(currentSpotContract.amountDigit);
              //       }
              //     });
              //   }
              // }
            }}
            suffix={() => (
              <div className={clsx('price-suffix ')}>
                <div
                  style={{ color: 'var(--text_brand)', cursor: 'pointer', userSelect: 'none', whiteSpace:'nowrap' }}
                  className={clsx('newest')}
                  onClick={() => {
                    setState((draft) => {
                      if (isBuy) {
                        draft.buyPrice = newPrice;
                        state.buyVolume &&
                          (draft.buyAmount = newPrice.mul(state.buyVolume).toFixed(currentSpotContract.amountDigit));
                      } else {
                        draft.sellPrice = String(newPrice);
                        state.sellVolume &&
                          (draft.sellAmount = newPrice.mul(state.sellVolume).toFixed(currentSpotContract.amountDigit));
                      }
                    })
                  }}
                >
                  {LANG('最新价')}
                </div>

              </div>
            )}
          />}
          {/* <Input
            label=''
            unit={quoteCoin}
            decimal={currentSpotContract.digit}
            min={isBuy ? minPrice.toFixed() : 0}
            max={isBuy ? 0 : Number(maxPrice)}
            value={isBuy ? state.buyPrice : state.sellPrice}
            onChange={(val) =>
              setState((draft) => {
                if (isBuy) {
                  draft.buyPrice = val;
                  state.buyVolume &&
                    (draft.buyAmount = val.mul(state.buyVolume).toFixed(currentSpotContract.amountDigit));
                } else {
                  draft.sellPrice = String(val);
                  state.sellVolume &&
                    (draft.sellAmount = val.mul(state.sellVolume).toFixed(currentSpotContract.amountDigit));
                }
              })
            }
            onBlur={() => {
              if (isBuy) {
                if (state.buyPrice === '' || state.buyPrice === '0') {
                  setState((draft) => {
                    draft.buyPrice = String(minPrice);
                    if (state.buyVolume) {
                      draft.buyAmount = priceTemp.mul(state.buyVolume).toFixed(currentSpotContract.amountDigit);
                    }
                  });
                }
              } else {
                if (state.sellPrice === '' || state.sellPrice === '0') {
                  setState((draft) => {
                    draft.sellPrice = '';
                    if (state.sellVolume) {
                      draft.sellAmount = priceTemp.mul(state.sellVolume).toFixed(currentSpotContract.amountDigit);
                    }
                  });
                }
              }
            }}
          /> */}
        </div>
        <div className='row'>
          <span className='label'>{LANG('数量')}</span>
          <Input
            label=''
            unit={coin}
            decimal={currentSpotContract.volumeDigit}
            // min={currentSpotContract.volumeMin}
            min={0}
            value={isBuy ? state.buyVolume : state.sellVolume}
            onChange={(val) =>
              setState((draft) => {
                if (isBuy) {
                  draft.buyVolume = val;
                  draft.buyAmount = val === '' ? '' : val.mul(state.buyPrice).toFixed(currentSpotContract.amountDigit);
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
          <span className='label'>{LANG('交易额')}</span>
          <Input
            label=''
            unit={quoteCoin}
            decimal={currentSpotContract.amountDigit}
            // min={currentSpotContract.amountMin}
            min={0}
            value={isBuy ? state.buyAmount : state.sellAmount}
            onChange={(val) =>
              setState((draft) => {
                if (isBuy) {
                  draft.buyAmount = val;
                  draft.buyVolume = val === '' ? '' : val.div(state.buyPrice).toFixed(currentSpotContract.volumeDigit);
                } else {
                  draft.sellAmount = val;
                  draft.sellVolume =
                    val === '' ? '' : val.div(state.sellPrice).toFixed(currentSpotContract.volumeDigit);
                }
              })
            }
            onFocus={() =>
              setState((draft) => {
                draft.inputIsFocus = true;
              })
            }
            onBlur={() =>
              setState((draft) => {
                draft.inputIsFocus = false;
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
            onChange={(val: number) => onSliderChanged(val)}
            renderText={() => `${sliderData.value}%`}
            tooltip={{ formatter: (value) => `${value}%` }}
            {...sliderData}
          />
        </div>
        <Button
          className={clsx(isLogin ? 'openOrder' : 'login-btn', isBuy ? 'btn-green' : 'btn-red')}
          onClick={onOpenOrderClicked}
          disabled={!spotTradeEnable}
          rounded
        >
          {memoBtnText}
        </Button>
      </div>
      <TradeButtonStyle />
    </>
  );
};

export default LimitTrade;
