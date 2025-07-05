import { Loading } from '@/components/loading';
import { BasicModal } from '@/components/modal';
import Slider from '@/components/trade-ui/trade-view/components/slider';
import { OrderBookEmitter } from '@/core/events';
import { useRouter, useSettingGlobal, useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Account, SideType, Spot } from '@/core/shared';
import { SESSION_KEY } from '@/core/store';
import { message } from 'antd';
import { useCallback, useEffect, useMemo } from 'react';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';
import { NS } from '../../spot';
import Input from './input';
import { TradeButtonStyle } from './trade-button-style';

const { Trade } = Spot;

const OCOTrade = ({
  isBuy,
  newPrice,
  triggerPriceMin,
  triggerPriceMax,
  minPrice,
  maxPrice,
  priceTemp,
  initState,
  onSuccess,
}: {
  isBuy: boolean;
  newPrice: NS;
  minPrice: NS;
  maxPrice: NS;
  priceTemp: NS;
  initState: () => void;
  onSuccess?: () => void;
  triggerPriceMin?: NS;
  triggerPriceMax?: NS;
}) => {
  const isLogin = Account.isLogin;
  const { isDark } = useTheme();
  const { spotTradeEnable } = useSettingGlobal();
  const router = useRouter();
  const routerId = router.query.id as string;

  const { coin, quoteCoin, quoteCoinBalance, coinBalance, currentSpotContract } = Trade.state;

  const [state, setState] = useImmer({
    limitPrice: '' as NS,
    limitPriceError: false,
    triggerPrice: '' as NS,
    triggerPriceError: false,
    buyPrice: '' as NS,
    sellPrice: '' as NS,
    buyVolume: '' as NS,
    buyAmount: '' as NS,
    sellAmount: '' as NS,
    sellVolume: '' as NS,
    limitPriceIsInit: false,
    triggerPriceIsInit: false,
    confirmModalVisible: false,
    inputIsFocus: false,
  });

  const resetState = () => {
    setState((draft) => {
      draft.limitPrice = '';
      draft.limitPriceError = false;
      draft.limitPriceIsInit = false;
      draft.triggerPrice = '';
      draft.triggerPriceError = false;
      draft.triggerPriceIsInit = false;
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

  useEffect(() => {
    if (!state.inputIsFocus) return;
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
  }, [state.buyAmount, state.inputIsFocus, quoteCoinBalance]);

  useEffect(() => {
    if (!state.inputIsFocus) return;
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
  }, [state.sellVolume, state.inputIsFocus, coinBalance]);

  const onOpenOrderClicked = useCallback(async () => {
    if (!isLogin) {
      const pathname = router.asPath;
      sessionStorage.setItem(SESSION_KEY.LOGIN_REDIRECT, pathname);
      router.push('/login');
    }
    if (state.limitPrice === '') {
      setState((draft) => {
        draft.limitPriceIsInit = true;
        draft.limitPriceError = true;
      });
    }
    if (state.triggerPrice === '') {
      setState((draft) => {
        draft.triggerPriceIsInit = true;
        draft.triggerPriceError = true;
      });
    }
    if (state.limitPrice === '' || state.triggerPrice === '') return;

    if (state.limitPriceError || state.triggerPriceError) return;

    const volume = Number(isBuy ? state.buyVolume : state.sellVolume);

    if (!volume) return;

    setState((draft) => {
      draft.confirmModalVisible = true;
    });
  }, [
    state.limitPrice,
    state.triggerPrice,
    state.limitPriceError,
    state.triggerPriceError,
    isBuy,
    state.buyVolume,
    state.sellVolume,
    isLogin,
  ]);

  const onModalOkClicked = async () => {
    const volume = Number(isBuy ? state.buyVolume : state.sellVolume);
    const price = isBuy ? state.buyPrice : state.sellPrice;
    if (routerId && volume > 0) {
      Loading.start();
      const result = await Trade.openOcoOrder(
        isBuy ? SideType.BUY : SideType.SELL,
        routerId,
        Number(state.triggerPrice),
        Number(state.limitPrice),
        Number(price),
        Number(volume)
      );
      if (result.code === 200) {
        message.success(LANG('委托提交成功'));
        setState((draft) => {
          draft.confirmModalVisible = false;
          draft.limitPriceIsInit = false;
          draft.triggerPriceIsInit = false;
        });
        initState();
        resetState();
        onSuccess && onSuccess();
      } else {
        message.error(result.message);
      }
      Loading.end();
    }
  };

  const [sliderData, setSliderData] = useImmer({
    type: 'range',
    step: 1,
    value: 0,
    min: 0,
    max: 100,
  });

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

  useEffect(() => {
    if (state.limitPriceIsInit) {
      setState((draft) => {
        if (state.limitPrice === '') return;
        if (isBuy) {
          draft.limitPriceError = Number(state.limitPrice) >= Number(newPrice);
        } else {
          draft.limitPriceError = Number(state.limitPrice) <= Number(newPrice);
        }
      });
    }
  }, [newPrice, isBuy, state.limitPrice, state.limitPriceIsInit]);

  useEffect(() => {
    resetState();
  }, [isBuy, routerId]);

  useEffect(() => {
    if (state.triggerPriceIsInit) {
      setState((draft) => {
        if (isBuy) {
          draft.triggerPriceError = Number(state.triggerPrice) <= Number(newPrice);
        } else {
          draft.triggerPriceError = Number(state.triggerPrice) >= Number(newPrice);
        }
      });
    }
  }, [newPrice, isBuy, state.triggerPrice, state.triggerPriceIsInit]);

  const memoBtnText = useMemo(() => {
    if (!isLogin) {
      return LANG('登录');
    }
    return (isBuy ? LANG('买入____2') : LANG('卖出____2')) + ` ${coin}`;
  }, [isBuy, isLogin, coin]);

  return (
    <>
      <div className='trade-wrapper'>
        <div className='label-wrapper'>{LANG('限价单')}</div>
        <div className='row'>
          <Input
            label={LANG('价格')}
            unit={quoteCoin}
            min={isBuy ? minPrice?.toFixed() : 0}
            max={isBuy ? 0 : maxPrice?.toFixed()}
            decimal={currentSpotContract.digit}
            value={state.limitPrice}
            showError={state.limitPriceError}
            onChange={(val) =>
              setState((draft) => {
                draft.limitPrice = val;
                draft.limitPriceIsInit = true;
                draft.limitPriceError = false;
                if (val === '' || val === '0') {
                  draft.limitPriceError = true;
                }
                if (isBuy) {
                  if (Number(val) >= Number(newPrice)) {
                    draft.limitPriceError = true;
                  }
                } else {
                  if (Number(val) <= Number(newPrice)) {
                    draft.limitPriceError = true;
                  }
                }
              })
            }
            errorText={() => {
              if (!state.limitPriceError) return '';
              if (state.limitPriceIsInit && (state.limitPrice === '' || state.limitPrice === '0')) {
                return LANG('限价价格不能为空或0');
              }
              if (isBuy) {
                if (Number(state.limitPrice) >= Number(newPrice)) {
                  return LANG('限价买入价需低于市价');
                }
              } else {
                if (state.limitPrice && Number(state.limitPrice) <= Number(newPrice)) {
                  return LANG('限价卖出价需高于市价');
                }
              }

              return '';
            }}
            allowEmpty
          />
        </div>
        <div className='label-wrapper'>{LANG('止盈止损')}</div>
        <div className='row'>
          <Input
            label={LANG('触发价格')}
            unit={quoteCoin}
            min={triggerPriceMin?.toFixed()}
            max={triggerPriceMax?.toFixed()}
            decimal={currentSpotContract.digit}
            value={state.triggerPrice}
            showError={state.triggerPriceError}
            onChange={(val) =>
              setState((draft) => {
                draft.triggerPrice = val;
                draft.triggerPriceIsInit = true;
                draft.triggerPriceError = false;
                if (val === '' || val === '0') {
                  draft.triggerPriceError = true;
                }
                if (isBuy) {
                  if (Number(val) <= Number(newPrice)) {
                    draft.triggerPriceError = true;
                  }
                } else {
                  if (Number(val) >= Number(newPrice)) {
                    draft.triggerPriceError = true;
                  }
                }
              })
            }
            errorText={() => {
              if (!state.triggerPriceError) return '';
              if (state.triggerPriceIsInit && (state.triggerPrice === '' || state.triggerPrice === '0')) {
                return LANG('触发价格不能为空或0');
              }
              if (isBuy) {
                if (state.triggerPrice && Number(state.triggerPrice) <= Number(newPrice)) {
                  return LANG('触发价需高于市价');
                }
              } else {
                if (Number(state.triggerPrice) >= Number(newPrice)) {
                  return LANG('触发价需低于市价');
                }
              }
              return '';
            }}
            allowEmpty
          />
        </div>
        <div className='row'>
          <Input
            label={LANG('价格')}
            unit={quoteCoin}
            decimal={currentSpotContract.digit}
            min={isBuy ? minPrice?.toFixed() : 0}
            max={isBuy ? 0 : maxPrice?.toFixed()}
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
                    draft.buyPrice = minPrice;
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
        <button
          className={`openOrder ${isBuy ? 'btn-green' : 'btn-red'}`}
          onClick={onOpenOrderClicked}
          disabled={!spotTradeEnable}
        >
          {memoBtnText}
        </button>
      </div>
      <TradeButtonStyle />
      <BasicModal
        width={320}
        open={state.confirmModalVisible}
        onCancel={() =>
          setState((draft) => {
            draft.confirmModalVisible = false;
          })
        }
        cancelButtonProps={{ style: { display: 'none' } }}
        title={LANG('下单确认')}
        className='confirm-modal'
        onOk={onModalOkClicked}
      >
        <div>
          <span>{LANG('限价单')}</span>
          <span>{state.limitPrice.toFormat()} USDT</span>
        </div>
        <div>
          <span>{LANG('触发价格')}</span>
          <span>{state.triggerPrice.toFormat()} USDT</span>
        </div>
        <div>
          <span>{LANG('价格')}</span>
          <span>{(isBuy ? state.buyPrice : state.sellPrice).toFormat()} USDT</span>
        </div>
        <div>
          <span>{LANG('数量')}</span>
          <span>
            {(isBuy ? state.buyVolume : state.sellVolume).toFormat()} {coin}
          </span>
        </div>
      </BasicModal>
      <style jsx>{styles}</style>
    </>
  );
};

export default OCOTrade;

const styles = css`
  :global(.confirm-modal .basic-content) {
    > div {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      span {
        &:first-child {
          color: var(--theme-font-color-2);
        }
        &:last-child {
          color: var(--theme-font-color-1);
        }
      }
    }
  }
`;
