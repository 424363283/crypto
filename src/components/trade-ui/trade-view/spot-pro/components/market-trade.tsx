import { Loading } from '@/components/loading';
import Slider from '@/components/trade-ui/trade-view/components/slider';
import { useRouter, useSettingGlobal, useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Account, SideType, Spot, SpotOrderType } from '@/core/shared';
import { SESSION_KEY } from '@/core/store';
import { toMinNumber } from '@/core/utils';
import { message } from 'antd';
import { useCallback, useEffect, useMemo } from 'react';
import { useImmer } from 'use-immer';
import { NS } from '../../spot';
import Input from './input';
import { TradeButtonStyle } from './trade-button-style';
import { Button } from '@/components/button';
import clsx from 'clsx';

const { Trade } = Spot;

const MarketTrade = ({
  isBuy,
  isPlan,
  triggerPriceMin,
  triggerPriceMax,
  priceTemp,
  initState,
  onSuccess,
}: {
  isBuy: boolean;
  isPlan: boolean;
  triggerPriceMin: NS;
  triggerPriceMax: NS;
  priceTemp: NS;
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
    buyAmount: '' as NS,
    sellVolume: '' as NS,
    inputIsFocus: false,
  });

  const resetState = () => {
    setState((draft) => {
      draft.triggerPrice = '';
      draft.triggerPriceError = false;
      draft.buyPrice = '';
      draft.sellPrice = '';
      draft.buyAmount = '';
      draft.sellVolume = '';
    });
    setSliderData((draft) => {
      draft.value = 0;
    });
  };

  useEffect(() => {
    resetState();
  }, [isBuy, coin]);

  const [sliderData, setSliderData] = useImmer({
    type: 'range',
    step: 1,
    value: 0,
    min: 0,
    max: 100,
  });

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

            draft.buyAmount = volume
              .mul(state.buyPrice)
              .toFixed(currentSpotContract.digit)
              .toFixed(currentSpotContract.amountDigit);
          } else {
            const volume = coinBalance.mul(val.div(100)).toFixed(currentSpotContract.volumeDigit);
            draft.sellVolume = Number(volume) === 0 ? '' : volume;
          }
        });
      }
    },
    [isBuy, coinBalance, quoteCoinBalance, currentSpotContract, state.buyPrice, isLogin]
  );

  const minAmount = quoteCoinBalance > 0 ? currentSpotContract.amountMin : 0;

  // const minVolume = coinBalance > 0 ? toMinNumber(currentSpotContract.volumeDigit) : 0;
  const minVolume = coinBalance > 0 ? currentSpotContract.volumeMin : 0;

  const onOpenOrderClicked = useCallback(async () => {
    if (!isLogin) {
      const pathname = router.asPath;
      sessionStorage.setItem(SESSION_KEY.LOGIN_REDIRECT, pathname);
      router.push('/login');
    }
    const volume = Number(isBuy ? state.buyAmount : state.sellVolume);
    if (isPlan && !state.triggerPrice) {
      setState((draft) => {
        draft.triggerPriceError = true;
      });
      return;
    }
    if (volume <= 0) {
      if (isBuy) {
        return message.error(LANG("交易额需大于{volume}", { volume: `${currentSpotContract.amountMin} ${quoteCoin}` }), 1);
      } else {
        return message.error(LANG("最小下单数量{volume}", { volume: `${currentSpotContract.volumeMin} ${coin}` }), 1);
      }
    }
    if (routerId && volume > 0) {
      Loading.start();
      const result = isPlan
        ? await Trade.openStopOrder(
          isBuy ? SideType.BUY : SideType.SELL,
          SpotOrderType.MARKET,
          routerId,
          Number(state.triggerPrice),
          0,
          Number(volume),
          sliderData.value
        )
        : await Trade.openOrder(
          isBuy ? SideType.BUY : SideType.SELL,
          SpotOrderType.MARKET,
          routerId,
          0,
          Number(volume),
          sliderData.value
        );
      if (result.code === 200) {
        message.success(LANG('委托提交成功'));
        initState();
        resetState();
        onSuccess && onSuccess();
      } else {
        message.error(result.message);
      }
      Loading.end();
    }
  }, [routerId, isBuy, isPlan, state.buyAmount, state.sellVolume, state.triggerPrice, isLogin, coin]);

  const memoBtnText = useMemo(() => {
    if (!isLogin) {
      return `${LANG('登录')}/${LANG('注册')}`;
    }
    return (isBuy ? LANG('买入____2') : LANG('卖出____2')) + ` ${coin}`;
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
          <Button className='priceWrapper disabled'>
            <span>
              {isBuy ? `${LANG('以市场上最优价格买入')}` : `${LANG('以市场上最优价格卖出')}`} {quoteCoin}
            </span>
          </Button>
        </div>
        <div className='row'>
          <span className='label'>{isBuy ? LANG('交易额') : LANG('数量')}</span>
          <Input
            label=''
            unit={isBuy ? quoteCoin : coin}
            decimal={isBuy ? currentSpotContract.amountDigit : currentSpotContract.volumeDigit}
            // min={isBuy ? minAmount : minVolume}
            min={0}
            value={isBuy ? state.buyAmount : state.sellVolume}
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

export default MarketTrade;
