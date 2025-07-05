import { Loading } from '@/components/loading';
import { Svg } from '@/components/svg';
import { useCurrencyScale, useRouter, useSettingGlobal, useTheme, useResponsive } from '@/core/hooks';
import { LANG, TrLink } from '@/core/i18n';
import { Account, AccountType, Lite, OrderType, PositionSide, StopType } from '@/core/shared';
import { formatDefaultText, getActive, MediaInfo, message, toMinNumber } from '@/core/utils';
import Image from 'next/image';
import { useCallback, useEffect, useMemo } from 'react';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';
import { withLayoutWrap } from '../components/layout-wrap';
import { LoginWrap } from '../components/login-wrap';
import PriceInput from './components/input/price-input';
import RatioInput from './components/input/ratio-input';
import LeverView from './components/lever-view';
import CalculatorModal from './components/modal/calculator-modal';
import ConfirmModal from './components/modal/confirm-modal';
import CouponModal from './components/modal/coupon-modal';
import TransactionSettingModal from './components/modal/transaction-setting-modal';
import PositionButton from './components/position-button';
import { TradeWrap } from './trade-wrap';
import { Button } from '@/components/button';
import CommonIcon from '@/components/common-icon';
import Radio from '@/components/Radio';
import Tooltip from '@/components/trade-ui/common/tooltip';
import DeferCheckbox from './components/defer-checkbox';
import { FORMULAS } from '@/core/formulas';
import { DesktopOrTablet, Mobile } from '@/components/responsive';
import { useModalTools } from '@/components/mobile-modal/mobile-modal';

const Trade = Lite.Trade;

type UIStateTypes = {
  calculatorModalVisible: boolean;
  settingModalVisible: boolean;
  couponModalVisible: boolean;
  confirmModalVisible: boolean;
  showSetting: null | StopType;
  showStopProfitSetting: boolean;
  showStopLossSetting: boolean;
  settingType: SettingType;
  isFocus: boolean;
  inputIsEmpty: boolean;
  showDealPrice: boolean;
};

enum SettingType {
  PERCENT,
  PRICE
}

const swapIcon1 = '/static/images/lite/type_1.png';
const swapIcon2 = '/static/images/lite/type_2.png';

const SPSLSetting = ({
  type,
  priceStep = 0.1,
  onSettingTypeClicked,
  onPriceChange,
  onRateChange
}: {
  type: StopType;
  priceStep?: number;
  onSettingTypeClicked: (type: SettingType) => void;
  onPriceChange: (num: number, type: StopType) => void;
  onRateChange: (num: number, type: StopType) => void;
}) => {
  const isStopProfit = type === StopType.STOP_PROFIT;
  const {
    stopProfitPrice,
    stopLossPrice,
    stopProfitRange,
    stopLossRange,
    stopProfit,
    stopLoss,
    LMargin,
    FMargin,
    FPriceRange,
    LPriceRange,
    currentCommodityDigit
  } = Trade.state;
  const { isMobile } = useResponsive();
  const [data, setData] = useImmer<{
    [key: string]: any;
  }>({
    stopProfitRate: 3,
    stopLossRate: -1,
    stopProfitPrice: 0,
    stopLossPrice: 0
  });
  const [UIState, setUIState] = useImmer({
    isFocus: false,
    inputIsEmpty: false,
    settingType: SettingType.PERCENT
  });
  useEffect(() => {
    setData(draft => {
      draft.stopProfitRate = Number(stopProfit);
      draft.stopLossRate = Number(stopLoss);
    });
  }, [stopProfit, stopLoss, setData]);
  useEffect(() => {
    setData(draft => {
      if (!UIState.isFocus) {
        draft.stopProfitPrice = stopProfitPrice;
        draft.stopLossPrice = stopLossPrice;
      }
    });
  }, [UIState.isFocus, stopProfitPrice, stopLossPrice, setData]);
  const isPrice = UIState.settingType === SettingType.PRICE;

  const _onSettingTypeClicked = (type: SettingType) => {
    setUIState(draft => {
      draft.settingType = type === SettingType.PRICE ? SettingType.PERCENT : SettingType.PRICE;
    });
    if (onSettingTypeClicked) {
      onSettingTypeClicked(type);
    }
  };

  const _onRateChange = (num: number, type: StopType) => {
    if (type === StopType.STOP_PROFIT) {
      num >= stopProfitRange[0] && Trade.changeStopRate(num, type);
    } else {
      num <= stopLossRange[0] && Trade.changeStopRate(num, type);
    }
    setData(draft => {
      if (type === StopType.STOP_PROFIT) {
        draft.stopProfitRate = num;
      } else {
        draft.stopLossRate = num;
      }
    });
    // if (onRateChange) {
    //   onRateChange(num, type);
    // }
  };

  const _onPriceChange = (num: number, type: StopType) => {
    Trade.changeStopPrice(num, type);
    setData(draft => {
      if (isStopProfit) {
        num !== undefined && (draft.stopProfitPrice = num);
      } else {
        num !== undefined && (draft.stopLossPrice = num);
      }
    });
    // if (onPriceChange) {
    //   onPriceChange(num, type);
    // }
  };

  return (
    <div className="tpsl-setting">
      <div className="top">
        <div className="price-wrapper">
          <span>{isStopProfit ? LANG('止盈价') : LANG('强平价')}：</span>
          <span className={isStopProfit ? 'main-green' : 'main-red'}>
            {isStopProfit
              ? UIState.isFocus && !UIState.inputIsEmpty
                ? data.stopProfitPrice
                : stopProfitPrice
              : UIState.isFocus && !UIState.inputIsEmpty
              ? data.stopLossPrice
              : stopLossPrice}
          </span>
        </div>
        <div
          className="setting-wrapper"
          onClick={() => {
            _onSettingTypeClicked(UIState.settingType);
          }}
        >
          <CommonIcon name="common-exchange-0" size={16} />
          <span>{isPrice ? LANG('按价格设置') : LANG('按比例设置')}</span>
        </div>
      </div>
      <div className="bottom">
        {isPrice ? (
          <>
            <RatioInput
              value={isStopProfit ? data.stopProfitPrice : data.stopLossPrice}
              min={isStopProfit ? Number(FPriceRange[0]) : Number(LPriceRange[1])}
              max={isStopProfit ? Number(FPriceRange[1]) : Number(LPriceRange[0])}
              addStep={undefined}
              minusStep={undefined}
              decimal={currentCommodityDigit}
              placeholder={LANG('请输入')}
              onFocus={() => {
                setUIState(draft => {
                  draft.isFocus = true;
                });
              }}
              onBlur={() => {
                _onPriceChange(
                  isStopProfit ? data.stopProfitPrice : data.stopLossPrice,
                  isStopProfit ? StopType.STOP_PROFIT : StopType.STOP_LOSS
                );
                setUIState(draft => {
                  draft.isFocus = false;
                });
              }}
              onChange={val => {
                _onPriceChange(Number(val), isStopProfit ? StopType.STOP_PROFIT : StopType.STOP_LOSS);
              }}
              onOriginValueChange={val => {
                setUIState(draft => {
                  draft.inputIsEmpty = val === '';
                });
              }}
            />
            <div className="price-wrapper">
              <span>{isStopProfit ? LANG('预估收益') : LANG('预估亏损')}：</span>
              <span className={isStopProfit ? 'main-green' : 'main-red'} style={{ fontSize: '12px' }}>
                {isStopProfit ? Math.abs(Number(FMargin)) : Math.abs(Number(LMargin))} USDT (
                {(isStopProfit ? data.stopProfitRate : data.stopLossRate).mul(100).toFixed(0)}%)
              </span>
            </div>
          </>
        ) : (
          <>
            <RatioInput
              value={isStopProfit ? data.stopProfitRate.mul(100) : data.stopLossRate.mul(100)}
              min={Number((isStopProfit ? stopProfitRange[0] : stopLossRange[stopLossRange.length - 1])?.mul(100))}
              max={Number((isStopProfit ? stopProfitRange[stopProfitRange.length - 1] : stopLossRange[0])?.mul(100))}
              addStep={undefined}
              minusStep={undefined}
              isPercent
              isNegative={isStopProfit}
              least={isStopProfit ? 1 : 0}
              onBlur={() => {
                if (data.stopLossRate < 0 && data.stopLossRate > stopLossRange[0]) {
                  _onRateChange(stopLossRange[0], type);
                }
              }}
              onChange={val => {
                _onRateChange(Number(val.div(100)), type);
              }}
              placeholder={LANG('请输入')}
            />
            <div className="group">
              {(isStopProfit ? stopProfitRange : stopLossRange).map((num, index) => (
                <div
                  key={index}
                  className={getActive((isStopProfit ? data.stopProfitRate : data.stopLossRate) === num)}
                  onClick={() => {
                    _onRateChange(num, type);
                  }}
                >
                  {num * 100}%
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <style jsx>{`
        .tpsl-setting {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 16px;
          .top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            .setting-wrapper {
              color: var(--text_2);
              display: flex;
              align-items: center;
              cursor: pointer;
              :global(img) {
                margin-right: 4px;
              }
              span {
                font-size: 12px;
                font-weight: 400;
                color: var(--brand);
              }
            }
          }
          .bottom {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          .price-wrapper {
            > span {
              &:first-child {
                font-size: 12px;
                font-weight: 500;
                color: var(--text_2) !important;
                padding-right: 4px;
                @media ${MediaInfo.mobile} {
                  font-weight: 400;
                }
              }
              &:last-child {
                font-size: 14px;
                font-weight: 500;
                color: var(--theme-font-color-1);
                @media ${MediaInfo.mobile} {
                  font-size: 12px;
                }
              }
              &.green {
                color: var(--const-raise-color) !important;
              }
              &.red {
                color: var(--const-fall-color) !important;
              }
            }
          }
        }
      `}</style>
      <style jsx>{groupStyles}</style>
    </div>
  );
};
function LiteTradeUI() {
  const { isDark, theme } = useTheme();
  const routerId = useRouter().query.id as string;
  const cid = useRouter().query?.cid as string;
  const { liteTradeEnable } = useSettingGlobal();
  const { isMobile } = useResponsive();
  const { onClose: closeBottomModal } = useModalTools();
  const {
    feex,
    marketBuyPrice,
    marketSellPrice,
    stopProfitPrice,
    stopLossPrice,
    stopProfitRange,
    stopLossRange,
    stopProfit,
    stopLoss,
    LMargin,
    FMargin,
    marginRange,
    marginAddList,
    margin,
    position,
    positionCurrency,
    positionSide,
    accountType,
    tradeFee,
    deductionAmount,
    totalMargin,
    FPriceRange,
    LPriceRange,
    limitPrice,
    limitPriceRange,
    limitPriceDeal,
    limitFinalPrice,
    orderConfirm,
    bonusId,
    orderType,
    currentCommodityDigit,
    bonusList,
    defer,
    deferFee,
    deferOrderChecked,
    volumeDigit,
    isPriceRangeLimited,
    isMarginRangeLimited,
    amountRange,
    leverageRange,
    leverage,
    balance
  } = Trade.state;
  const { scale } = useCurrencyScale(positionCurrency);
  const { scale: USDTScale } = useCurrencyScale('USDT');

  const [data, setData] = useImmer<{
    [key: string]: any;
  }>({
    stopProfitRate: 3,
    stopLossRate: -1,
    stopProfitPrice: 0,
    stopLossPrice: 0
  });

  const [UIState, setUIState] = useImmer<UIStateTypes>({
    calculatorModalVisible: false,
    settingModalVisible: false,
    couponModalVisible: false,
    showSetting: null,
    showStopProfitSetting: false,
    showStopLossSetting: false,
    settingType: SettingType.PERCENT,
    isFocus: false,
    inputIsEmpty: false,
    showDealPrice: false,
    confirmModalVisible: false
  });

  useEffect(() => {
    setData(draft => {
      draft.stopProfitRate = Number(stopProfit);
      draft.stopLossRate = Number(stopLoss);
    });
  }, [stopProfit, stopLoss, setData]);

  const resetPrice = () => {
    Trade.changeMargin('');
    Trade.changePrice1('');
    Trade.changePrice2('');
    Trade.changeFee('');
    Trade.state.position = 0;
    Trade.state.totalMargin = 0;
    Trade.state.marketBuyPrice = 0;
    Trade.state.marketSellPrice = 0;
  };
  useEffect(() => {
    resetPrice();
  }, [routerId]);

  useEffect(() => {
    if (cid) {
      Trade.changeAccount(AccountType.TRIAL);
    }
  }, [cid]);

  useEffect(() => {
    if (cid) {
      const selectCoupon = bonusList.find(item => item.id === cid);
      selectCoupon && Trade.changeSelectCard(selectCoupon?.id);
    }
  }, [cid, bonusList]);

  useEffect(() => {
    setData(draft => {
      if (!UIState.isFocus) {
        draft.stopProfitPrice = stopProfitPrice;
        draft.stopLossPrice = stopLossPrice;
      }
    });
  }, [UIState.isFocus, stopProfitPrice, stopLossPrice, setData]);

  const onTabClicked = useCallback(
    (tab: OrderType) => {
      Trade.changeOrderType(tab);
      Trade.changePrice2('');
      setUIState(draft => {
        draft.showDealPrice = false;
      });
    },
    [setUIState]
  );

  const isPrice = UIState.settingType === SettingType.PRICE;

  const isLimit = orderType === OrderType.LIMIT;

  const isTrial = accountType === AccountType.TRIAL;

  const isReal = accountType === AccountType.REAL;

  const isBuy = positionSide === PositionSide.LONG;

  const isStopProfitInvalid = UIState.showSetting === StopType.STOP_PROFIT;

  const onSettingTypeClicked = (type: SettingType) => {
    setUIState(draft => {
      draft.settingType = type === SettingType.PRICE ? SettingType.PERCENT : SettingType.PRICE;
    });
  };

  const onRateChange = (num: number, type: StopType) => {
    if (type === StopType.STOP_PROFIT) {
      num >= stopProfitRange[0] && Trade.changeStopRate(num, type);
    } else {
      num <= stopLossRange[0] && Trade.changeStopRate(num, type);
    }
    setData(draft => {
      if (type === StopType.STOP_PROFIT) {
        draft.stopProfitRate = num;
      } else {
        draft.stopLossRate = num;
      }
    });
  };
  const btnText = isBuy ? LANG(isMobile ? '确定买涨' : '买涨') : LANG(isMobile ? '确定买跌' : '买跌');

  const onPriceChange = (num: number, type: StopType) => {
    Trade.changeStopPrice(num, type);
    setData(draft => {
      // if (isStopProfitInvalid) {
      if (type === StopType.STOP_PROFIT) {
        num !== undefined && (draft.stopProfitPrice = num);
      } else {
        num !== undefined && (draft.stopLossPrice = num);
      }
    });
  };

  const onSubmitClicked = async () => {
    if (!Account.isLogin) {
      return message.error(LANG('请先登录'));
    }
    if (!margin) {
      return message.error(LANG('请输入保证金'));
    }
    if (orderConfirm) {
      setUIState(draft => {
        draft.confirmModalVisible = true;
      });
    } else {
      openOrder();
    }
  };

  const openOrder = async () => {
    Loading.start();
    const data = await Trade.openOrder();
    if (data.code == 200) {
      message.success(LANG('提交成功'));
      setUIState(draft => {
        draft.confirmModalVisible = false;
      });
      resetPrice();
      if (isMobile) {
        closeBottomModal?.();
      }
    } else {
      message.error(data.message || LANG('系统繁忙，请稍后再试'));
    }
    Loading.end();
  };

  const renderTab = useCallback(() => {
    const max = FORMULAS.LITE.maxLevelMargin(amountRange, leverageRange, leverage);
    const marginRangePlaceholder = [Trade.state.marginRange[0], max];
    return (
      <div className="tab-container">
        <div className="header">
          <ul>
            {isReal && (
              <li className={getActive(isLimit)} onClick={() => onTabClicked(OrderType.LIMIT)}>
                {LANG(isMobile ? '计划委托' : '限价')}
              </li>
            )}
            <li
              className={`${getActive(!isLimit)} ${!isReal && 'not-pointer'}`}
              onClick={() => onTabClicked(OrderType.MARKET)}
            >
              {LANG('市价')}
            </li>
          </ul>
          <div className="sub">
            <span className="sub-title">{LANG('仓位')}: </span>
            <span className="volume">
              {formatDefaultText(position.toFixed(volumeDigit))} {positionCurrency}
            </span>
          </div>
        </div>
        <div className="content">
          {isLimit && (
            <div className="price-input-group">
              <PriceInput
                value={limitPrice}
                decimal={currentCommodityDigit}
                label={`${LANG('委托价')}：`}
                placeholder={isPriceRangeLimited ? `${limitPriceRange[0]} ~ ${limitPriceRange[1]}` : LANG('请输入价格')}
                onChange={val => Trade.changePrice1(val)}
                min={isPriceRangeLimited ? Number(limitPriceRange[0]) : 0}
                max={isPriceRangeLimited ? Number(limitPriceRange[1]) : Number.MAX_SAFE_INTEGER}
                addStep={toMinNumber(currentCommodityDigit)}
                minusStep={toMinNumber(currentCommodityDigit)}
                onBlur={() => Trade.changeBlurPrice1()}
              />
              {UIState.showDealPrice ? (
                <PriceInput
                  value={limitFinalPrice}
                  decimal={currentCommodityDigit}
                  placeholder={limitPriceDeal as string}
                  onChange={val => Trade.changePrice2(val)}
                  max={isBuy ? 0 : Number(limitPriceDeal)}
                  min={isBuy ? Number(limitPriceDeal) : 0}
                  addStep={toMinNumber(currentCommodityDigit)}
                  minusStep={toMinNumber(currentCommodityDigit)}
                  isNegative
                  labelRender={() => (
                    <span className="labelRender">
                      {LANG('委托成交价')}:<span>{isBuy ? '≤' : '≥'}</span>
                    </span>
                  )}
                  // canEmpty
                />
              ) : (
                <div className="deal-price-wrapper">
                  {/* <Mobile>
                    <div>
                      {LANG('成交价')}： <span>{LANG('不限')}</span>
                    </div>
                    <div
                      onClick={() =>
                        setUIState(draft => {
                          draft.showDealPrice = true;
                        })
                      }
                    >
                      {LANG('设置')}
                    </div>
                  </Mobile> */}
                </div>
              )}
            </div>
          )}
          <PriceInput
            value={margin}
            decimal={USDTScale}
            label={`${LANG('保证金')}：`}
            placeholder={`${marginRangePlaceholder[0]} ~ ${marginRangePlaceholder[1]}`}
            onChange={val => Trade.changeMargin(val)}
            min={isMarginRangeLimited ? marginRange[0] : 0}
            max={marginRange[1]}
            addStep={2}
            minusStep={2}
            isCoupon={isTrial}
            bonusId={bonusId}
            onCouponClick={() =>
              setUIState(draft => {
                draft.couponModalVisible = true;
              })
            }
            labelClass="marginInput"
            onBlur={() => {
              if (isMarginRangeLimited) {
                Trade.changeMarginBlur();
              }
            }}
          />
          {/* 体验金账户不显示追加保证金按钮 */}
          {!isTrial && (
            <div className="group">
              {marginAddList.map(item => (
                <div key={item} onClick={() => Trade.changeAddMargin(item)}>
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>
        <style jsx>{tabStyles}</style>
        <style jsx>{groupStyles}</style>
      </div>
    );
  }, [
    margin,
    marginRange,
    marginAddList,
    position,
    positionCurrency,
    isTrial,
    limitPrice,
    UIState.showDealPrice,
    limitFinalPrice,
    limitPriceDeal,
    isBuy,
    isLimit,
    accountType,
    bonusId,
    isReal,
    limitPriceRange,
    onTabClicked,
    setUIState,
    theme,
    scale,
    USDTScale,
    currentCommodityDigit
  ]);

  const FeexIconMemo = useMemo(() => {
    return <Svg src="/static/images/lite/wallet.svg" width={14} height={14} />;
  }, []);

  const SettingIconMemo = useMemo(() => {
    return (
      <div className="settings">
        <CommonIcon
          style={{ cursor: 'pointer' }}
          name="swap-calculator-0"
          size={16}
          onClick={() =>
            setUIState(draft => {
              draft.calculatorModalVisible = true;
            })
          }
        />
        <CommonIcon
          style={{ cursor: 'pointer' }}
          name="trade-config-0"
          size={16}
          onClick={() =>
            setUIState(draft => {
              draft.settingModalVisible = true;
            })
          }
        />
        <style jsx>{`
          .settings {
            display: flex;
            align-items: center;
            gap: 16px;
          }
        `}</style>
      </div>
    );
  }, []);

  const PositionButtonMemo = useMemo(() => {
    return (
      <PositionButton
        positionSide={positionSide}
        greenText={LANG('买涨')}
        redText={LANG('买跌')}
        onChange={positionSide => Trade.changePositionSide(positionSide)}
      />
    );
  }, [positionSide]);

  const ArrowIconMemo = useMemo(() => {
    return <Image src="/static/images/lite/arrow.svg" width={13} height={12} alt="" />;
  }, []);

  const TooltipContentMemo = useMemo(() => {
    return (
      <>
        <Tooltip
          className="order-total-tips"
          placement="bottomLeft"
          title={
            <div className={'tooltips-order'}>
              <div className={'row'}>
                <span>{LANG('保证金')}:</span>
                <span>{margin.toFixed(USDTScale)} USDT</span>
              </div>
              <div className={'row'}>
                <span>{LANG('手续费')}:</span>
                <span>{tradeFee.toFixed(USDTScale)} USDT</span>
              </div>
              {/* {(isReal || isTrial) && (
                <div className={'row'}>
                  <span>{LANG('抵扣金额')}:</span>
                  <span>{deductionAmount.toFixed(USDTScale)} USDT</span>
                </div>
              )} */}
            </div>
          }
        >
          <div className="tooltip-label">
            <DesktopOrTablet>
              {' '}
              <CommonIcon name="common-info-0" size={14} />
            </DesktopOrTablet>
            <span className="total">
              {LANG('合计')}：
              <Mobile>
                {' '}
                <CommonIcon name="common-info-0" size={14} />
              </Mobile>
            </span>
            <span className={'mix'}>
              <span>{margin.add(tradeFee).toFixed(USDTScale)}</span>
              <span>&nbsp;USDT&nbsp;</span>
            </span>
          </div>
        </Tooltip>
        <style jsx>{`
          :global(.order-total-tips.tooltip .ant-tooltip-inner) {
            padding: 16px !important;
            width: auto;
          }
          .tooltip-label {
            display: flex;
            align-items: flex-start;
            cursor: pointer;
            gap: 4px;
            @media ${MediaInfo.mobile} {
              justify-content: space-between;
              align-items: center;
            }
            .total {
              color: var(--text_2);
              font-size: 12px;
              font-style: normal;
              font-weight: 400;
              line-height: normal;
              @media ${MediaInfo.mobile} {
                display: flex;
                align-items: center;
                height: 1rem;
                color: var(--text_3);
              }
            }
            .mix {
              color: var(--text_1);
              font-size: 12px;
              font-style: normal;
              font-weight: 400;
              line-height: normal;
            }
          }
          .tooltips-order {
            display: inline-flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
            .row {
              display: flex;
              align-items: flex-start;
              color: var(--text_2);
              line-height: 8px;
              gap: 8px;
            }
          }
        `}</style>
      </>
    );
  }, [isDark, totalMargin, USDTScale, theme, margin, tradeFee, isReal, isTrial, deductionAmount]);

  return (
    <>
      <div className={`${theme} element-order`}>
        <div className={'title-section'}>
          <div className={'left'}>
            {FeexIconMemo}
            <span>{LANG('手续费费率')}:</span>
            <span className={'rate'}>{feex?.mul(100)}%</span>
          </div>
          <div className="right">{SettingIconMemo}</div>
        </div>
        <div className="main-section">
          <LeverView />
          {!isMobile && PositionButtonMemo}
          {renderTab()}
          <div className="trade-setting-group">
            <Radio
              size={isMobile ? 16 : 20}
              label={<span style={{ fontSize: 12, color: 'var(--text_1)' }}>{LANG('默认止盈比例')}</span>}
              checked={!UIState.showStopProfitSetting}
              onChange={(val?: boolean) => {
                setUIState(draft => {
                  draft.showStopProfitSetting = !val;
                });
              }}
            />
            {UIState.showStopProfitSetting && (
              <SPSLSetting
                type={StopType.STOP_PROFIT}
                priceStep={Math.pow(10, -scale)}
                onSettingTypeClicked={onSettingTypeClicked}
                onPriceChange={onPriceChange}
                onRateChange={onRateChange}
              />
            )}
            {(UIState.showStopProfitSetting || (isMobile && UIState.showStopLossSetting)) && <div className="line" />}
            <Radio
              size={isMobile ? 16 : 20}
              label={<span style={{ fontSize: 12, color: 'var(--text_1)' }}>{LANG('默认止损比例')}</span>}
              checked={!UIState.showStopLossSetting}
              onChange={(val?: boolean) => {
                setUIState(draft => {
                  draft.showStopLossSetting = !val;
                });
              }}
            />
            {UIState.showStopLossSetting && (
              <SPSLSetting
                type={StopType.STOP_LOSS}
                priceStep={Math.pow(10, -scale)}
                onSettingTypeClicked={onSettingTypeClicked}
                onPriceChange={onPriceChange}
                onRateChange={onRateChange}
              />
            )}
            <DesktopOrTablet>
              {defer && deferFee > 0 && (
                <DeferCheckbox checked={deferOrderChecked} onChange={Trade.changeDeferOrderSetting} />
              )}
            </DesktopOrTablet>
          </div>
          <Mobile>
            <div className="balance-wrapper">
              <div className={'balance-section'}>
                <span>{LANG('可用')}:</span>
                <span>{balance.toFixed(USDTScale)} USDT</span>
              </div>

              <div className={'stat-section'}>{TooltipContentMemo}</div>
            </div>{' '}
          </Mobile>

          {/* <div className='drawer'>
            <div className='drawer-tab'>
              <div
                className={getActive(isStopProfit)}
                onClick={() =>
                  setUIState((draft) => {
                    draft.showSetting = isStopProfit ? null : StopType.STOP_PROFIT;
                  })
                }
              >
                <span>{LANG('默认止盈比例')}</span>
                {ArrowIconMemo}
              </div>
              <div
                className={getActive(UIState.showSetting === StopType.STOP_LOSS)}
                onClick={() =>
                  setUIState((draft) => {
                    draft.showSetting = draft.showSetting === StopType.STOP_LOSS ? null : StopType.STOP_LOSS;
                  })
                }
              >
                <span>{LANG('默认止损比例')}</span>
                {ArrowIconMemo}
              </div>
            </div>
            {UIState.showSetting !== null && (
              <div className='drawer-content'>
                <div className='top'>
                  <div className='price-wrapper'>
                    <span>{isStopProfit ? LANG('止盈价') : LANG('强平价')}：</span>
                    <span className={isStopProfit ? 'green' : 'red'}>
                      {isStopProfit
                        ? UIState.isFocus && !UIState.inputIsEmpty
                          ? data.stopProfitPrice
                          : stopProfitPrice
                        : UIState.isFocus && !UIState.inputIsEmpty
                          ? data.stopLossPrice
                          : stopLossPrice}
                    </span>
                  </div>
                  <div className='setting-wrapper' onClick={() => onSettingTypeClicked(UIState.settingType)}>
                    <Image src={isPrice ? swapIcon1 : swapIcon2} width={12} height={11} alt='' />
                    <span>{isPrice ? LANG('按价格设置') : LANG('按比例设置')}</span>
                  </div>
                </div>
                <div className='bottom'>
                  {isPrice ? (
                    <>
                      <RatioInput
                        value={isStopProfit ? data.stopProfitPrice : data.stopLossPrice}
                        min={isStopProfit ? Number(FPriceRange[0]) : Number(LPriceRange[1])}
                        max={isStopProfit ? Number(FPriceRange[1]) : Number(LPriceRange[0])}
                        addStep={0.1}
                        minusStep={0.1}
                        decimal={currentCommodityDigit}
                        placeholder={LANG('请输入')}
                        onFocus={() => {
                          setUIState((draft) => {
                            draft.isFocus = true;
                          });
                        }}
                        onBlur={() => {
                          onPriceChange(isStopProfit ? data.stopProfitPrice : data.stopLossPrice, isStopProfit ? StopType.STOP_PROFIT : StopType.STOP_LOSS);
                          setUIState((draft) => {
                            draft.isFocus = false;
                          });
                        }}
                        onChange={(val) => onPriceChange(Number(val), isStopProfit ? StopType.STOP_PROFIT : StopType.STOP_LOSS)}
                        onOriginValueChange={(val) => {
                          setUIState((draft) => {
                            draft.inputIsEmpty = val === '';
                          });
                        }}
                      />
                      <div className='price-wrapper'>
                        <span>{isStopProfit ? LANG('预估收益') : LANG('预估亏损')}：</span>
                        <span style={{ fontSize: '13px' }}>
                          {isStopProfit ? Math.abs(Number(FMargin)) : Math.abs(Number(LMargin))}&nbsp;USDT&nbsp;(
                          {(isStopProfit ? data.stopProfitRate : data.stopLossRate).mul(100).toFixed(0)}%)
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <RatioInput
                        value={isStopProfit ? data.stopProfitRate.mul(100) : data.stopLossRate.mul(100)}
                        min={Number(
                          (isStopProfit ? stopProfitRange[0] : stopLossRange[stopLossRange.length - 1])?.mul(100)
                        )}
                        max={Number(
                          (isStopProfit ? stopProfitRange[stopProfitRange.length - 1] : stopLossRange[0])?.mul(100)
                        )}
                        addStep={5}
                        minusStep={5}
                        isPercent
                        isNegative={isStopProfit}
                        least={isStopProfit ? 1 : 0}
                        onBlur={() => {
                          if (data.stopLossRate < 0 && data.stopLossRate > stopLossRange[0]) {
                            onRateChange(stopLossRange[0], isStopProfit ? StopType.STOP_PROFIT : StopType.STOP_LOSS);
                          }
                        }}
                        onChange={(val) => onRateChange(Number(val.div(100)), isStopProfit ? StopType.STOP_PROFIT : StopType.STOP_LOSS)}
                        placeholder={LANG('请输入')}
                      />
                      <div className='group'>
                        {(isStopProfit ? stopProfitRange.slice(1) : stopLossRange.slice(1)).map((num) => (
                          <div
                            key={num}
                            className={getActive((isStopProfit ? data.stopProfitRate : data.stopLossRate) === num)}
                            onClick={() => onRateChange(num, isStopProfit ? StopType.STOP_PROFIT : StopType.STOP_LOSS)}
                          >
                            {num * 100}%
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div> */}
          <DesktopOrTablet>
            {liteTradeEnable ? (
              Account.isLogin ? (
                <Button
                  rounded
                  className={`operation-btn ${isBuy ? 'btn-green' : 'btn-red'}`}
                  onClick={onSubmitClicked}
                >
                  {isLimit ? (
                    <>
                      <span>{btnText}</span>
                      <DesktopOrTablet>
                        {' '}
                        <b>{isBuy ? marketBuyPrice : marketSellPrice}</b>
                      </DesktopOrTablet>
                    </>
                  ) : (
                    <>
                      <span>{btnText}</span>
                      <DesktopOrTablet>
                        {' '}
                        <b>{isBuy ? marketBuyPrice : marketSellPrice}</b>
                      </DesktopOrTablet>
                    </>
                  )}
                </Button>
              ) : (
                <Button rounded type="brand">
                  <TrLink href={`/login`} style={{ width: '100%' }}>
                    {LANG('登录')}/{LANG('注册')}
                  </TrLink>
                </Button>
              )
            ) : (
              <Button disabled className="maintain-btn">
                {LANG('维护中')}
              </Button>
            )}
            <div className={'stat-section'}>{TooltipContentMemo}</div>
          </DesktopOrTablet>
        </div>
        <Mobile>
          <div className="mobile-btn">
            {liteTradeEnable ? (
              Account.isLogin ? (
                <Button
                  rounded
                  className={`operation-btn ${isBuy ? 'btn-green' : 'btn-red'}`}
                  onClick={onSubmitClicked}
                >
                  {isLimit ? (
                    <>
                      <span>{btnText}</span>
                      <DesktopOrTablet>
                        {' '}
                        <b>{isBuy ? marketBuyPrice : marketSellPrice}</b>
                      </DesktopOrTablet>
                    </>
                  ) : (
                    <>
                      <span>{btnText}</span>
                      <DesktopOrTablet>
                        {' '}
                        <b>{isBuy ? marketBuyPrice : marketSellPrice}</b>
                      </DesktopOrTablet>
                    </>
                  )}
                </Button>
              ) : (
                <Button rounded type="brand">
                  <TrLink href={`/login`} style={{ width: '100%' }}>
                    {LANG('登录')}/{LANG('注册')}
                  </TrLink>
                </Button>
              )
            ) : (
              <Button disabled className="maintain-btn">
                {LANG('维护中')}
              </Button>
            )}
          </div>
        </Mobile>
        <CalculatorModal
          open={UIState.calculatorModalVisible}
          onClose={() =>
            setUIState(draft => {
              draft.calculatorModalVisible = false;
            })
          }
        />
        <TransactionSettingModal
          open={UIState.settingModalVisible}
          onClose={() =>
            setUIState(draft => {
              draft.settingModalVisible = false;
            })
          }
        />
        <CouponModal
          open={UIState.couponModalVisible}
          onClose={() =>
            setUIState(draft => {
              draft.couponModalVisible = false;
            })
          }
        />
        <ConfirmModal
          open={UIState.confirmModalVisible}
          title={LANG('下单确认')}
          onOk={openOrder}
          onClose={() =>
            setUIState(draft => {
              draft.confirmModalVisible = false;
            })
          }
        />
      </div>
      <style jsx>{styles}</style>
      <style jsx>{groupStyles}</style>
    </>
  );
}

export default withLayoutWrap(LoginWrap, TradeWrap(LiteTradeUI));
const styles = css`
  .element-order {
    position: relative;
    border-radius: 0;
    @media ${MediaInfo.mobile} {
      padding-bottom: 4rem;
      .mobile-btn {
        position: fixed;
        bottom: 1rem;
        left: 1.5rem;
        right: 1.5rem;
        :global(.common-button) {
          width: 100%;
          border: 0;
        }
        :global(.operation-btn.btn-green) {
          background: var(--color-green);
        }
        :global(.operation-btn.btn-red) {
          background: var(--color-red);
        }
        :global(.operation-btn) {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          margin-top: 8px;
          gap: 8px;
          span,
          b {
            color: var(--text_white);
            font-size: 14px;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
          }
        }
      }
    }
    .title-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--fill_bg_1);
      height: 48px;
      padding: 16px;
      > .left {
        display: flex;
        align-items: center;
        gap: 4px;
        > span {
          color: var(--text_2);
          leading-trim: both;
          text-edge: cap;
          font-size: 14px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
          &.rate {
            color: var(--text_1);
          }
        }
      }
      @media ${MediaInfo.mobile} {
        padding: 0 8px;
        height: 2.5rem;
        background: var(--common-modal-bg);
      }
    }
    .main-section {
      display: flex;
      flex-direction: column;
      background: var(--fill_bg_1);
      margin-top: var(--theme-trade-layout-spacing);
      padding: 16px;
      gap: 8px;
      .drawer {
        display: flex;
        flex-direction: column;
        gap: 16px;
        .drawer-tab {
          display: flex;
          align-items: center;
          justify-content: space-between;
          > div {
            cursor: pointer;
            color: var(--text_2);
            border-bottom: 2px dashed transparent;
            span {
              margin-right: 10px;
              font-size: 12px;
              font-weight: 500;
            }
            :global(img) {
              transform-origin: center;
              transform: rotate(180deg);
              transition: all 0.3s;
            }
            &.active {
              border-bottom-color: var(--skin-primary-color);
              :global(img) {
                transform: rotate(0);
              }
            }
          }
        }
      }
      .drawer-content {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 16px;
        .top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          .setting-wrapper {
            color: var(--text_2);
            display: flex;
            align-items: center;
            cursor: pointer;
            :global(img) {
              margin-right: 10px;
            }
            span {
              font-size: 12px;
              font-weight: 500;
            }
          }
        }
        .bottom {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .price-wrapper {
          > span {
            &:first-child {
              font-size: 12px;
              font-weight: 500;
              color: var(--text_2) !important;
              padding-right: 4px;
            }
            &:last-child {
              font-size: 14px;
              font-weight: 500;
              color: var(--theme-font-color-1);
            }
            &.green {
              color: var(--const-raise-color) !important;
            }
            &.red {
              color: var(--const-fall-color) !important;
            }
          }
        }
      }
      .trade-setting-group {
        display: flex;
        flex-direction: column;
        padding: 8px 0;
        gap: 16px;
        .line {
          height: 1px;
          background: var(--fill_line_1);
        }
      }
      :global(.operation-btn) {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        margin-top: 8px;
        gap: 8px;
        span,
        b {
          color: var(--text_white);
          font-size: 14px;
          font-style: normal;
          font-weight: 500;
          line-height: normal;
        }
      }
      :global(.operation-btn.btn-green) {
        background: var(--color-green);
      }
      :global(.operation-btn.btn-red) {
        background: var(--color-red);
      }
      :global(.maintain-btn) {
        width: 100%;
      }
      @media ${MediaInfo.mobile} {
        padding: 0 8px;
        background: var(--common-modal-bg);
        .balance-wrapper {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding-top: 1rem;
          margin-top: 8px;
          border-top: 1px solid var(--fill_line_1);
        }
        .balance-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          span {
            &:first-child {
              color: var(--text_3);
            }
            &:last-child {
              color: var(--text_1);
            }
          }
        }
      }
    }
  }
  :global(.total-wrapper) {
    :global(.ant-tooltip-inner) {
      background: #e9e7ee !important;
      padding: 0;
      min-height: 0;
      box-shadow: 1px 0 8px 0 rgba(0, 0, 0, 0.08);
      border-radius: 6px;
      margin-top: 5px;
      overflow: hidden;
      color: #333;
      white-space: nowrap;
      word-break: keep-all;
      .tooltips-order {
        .row {
          display: flex;
          justify-content: space-between;
          justify-content: space-between;
          width: 240px;
          font-weight: 500;
        }
      }
    }
  }
  .divider {
    height: 1px;
    width: 100%;
    margin-top: 15px;
    background: var(--skin-border-color-1);
  }
`;

const tabStyles = css`
  .tab-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
    .header {
      display: flex;
      height: 40px;
      font-size: 14px;
      line-height: 14px;
      font-weight: 400;
      color: var(--text_2);
      justify-content: space-between;
      ul {
        padding: 0;
        margin: 0;
        display: flex;
        align-items: center;
        gap: 24px;
        li {
          cursor: pointer;
          color: var(--text_2);
          font-size: 14px;
          font-style: normal;
          font-weight: 500;
          line-height: normal;
          &.active {
            color: var(--text_brand);
          }
          &.not-pointer {
            cursor: default;
            color: inherit;
          }
        }
      }
      .sub {
        display: flex;
        align-items: center;
        color: var(--text_1);
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        gap: 8px;
        .sub-title {
          color: var(--text_3);
        }
        .volume {
          color: var(--text_1);
        }
      }
    }
    .content {
      display: flex;
      flex-direction: column;
      gap: 8px;
      .price-input-group {
        display: flex;
        flex-direction: column;
        :global(.trade-input) {
          margin-bottom: 8px;
        }
        :global(.trade-input:not(:first-child)) {
          margin-top: 8px;
        }
        .deal-price-wrapper {
          display: none;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
          @media ${MediaInfo.mobile} {
            display: flex;
          }
          > div {
            &:first-child {
              font-size: 12px;
              font-weight: 400;
              color: var(--text_2);
              @media ${MediaInfo.mobile} {
                span {
                  color: var(--text_1);
                  font-weight: 500;
                }
              }
            }
            &:last-child {
              cursor: pointer;
              font-size: 12px;
              font-weight: 400;
              color: var(--skin-primary-color);
            }
          }
        }
      }
    }
  }
  :global(.labelRender) {
    font-size: 12px;
    font-weight: 500;
    color: var(--theme-font-color-placeholder);
    span {
      margin-right: 2px;
      color: var(--theme-font-color-placeholder);
    }
  }
  :global(.marginInput) {
    color: var(--theme-font-color-placeholder);
  }
  @media ${MediaInfo.mobile} {
    :global(.trade-input) {
      :global(.container),
      :global(input) {
        background: var(--fill_3) !important;
      }
    }
  }
`;

const groupStyles = css`
  .group {
    display: flex;
    align-items: center;
    justify-content: space-between;
    overflow: hidden;
    width: 100%;
    color: var(--text_2);
    > div {
      background: var(--fill_1);
      color: var(--text_2);
      cursor: pointer;
      width: 52px;
      height: 24px;
      margin-right: 2px;
      line-height: 24px;
      font-size: 12px;
      font-weight: 400;
      text-align: center;
      border-radius: 6px;
      margin: 0 3px;
      flex: 1 auto;
      &:first-child {
        margin-left: 0;
      }
      &:last-child {
        margin-right: 0;
      }
      &:hover,
      &.active {
        color: var(--text_brand);
      }
      @media ${MediaInfo.mobile} {
        height: auto;
        padding: 6px 0;
        line-height: 12px;
      }
    }
  }
`;
