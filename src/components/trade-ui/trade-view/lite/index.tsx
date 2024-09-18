import { Loading } from '@/components/loading';
import { Svg } from '@/components/svg';
import { useCurrencyScale, useRouter, useSettingGlobal, useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { AccountType, Lite, OrderType, PositionSide, StopType } from '@/core/shared';
import { formatDefaultText, getActive, message, toMinNumber } from '@/core/utils';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
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
const Trade = Lite.Trade;

type UIStateTypes = {
  calculatorModalVisible: boolean;
  settingModalVisible: boolean;
  couponModalVisible: boolean;
  confirmModalVisible: boolean;
  showSetting: null | StopType;
  settingType: SettingType;
  isFocus: boolean;
  inputIsEmpty: boolean;
  showDealPrice: boolean;
};

enum SettingType {
  PERCENT,
  PRICE,
}

const swapIcon1 = '/static/images/lite/type_1.png';
const swapIcon2 = '/static/images/lite/type_2.png';

function LiteTradeUI() {
  const { isDark, theme } = useTheme();
  const routerId = useRouter().query.id as string;
  const cid = useRouter().query?.cid as string;
  const { liteTradeEnable } = useSettingGlobal();
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
  } = Trade.state;
  const { scale } = useCurrencyScale(positionCurrency);
  const { scale: USDTScale } = useCurrencyScale('USDT');

  const [data, setData] = useImmer<{
    [key: string]: any;
  }>({
    stopProfitRate: 3,
    stopLossRate: -1,
    stopProfitPrice: 0,
    stopLossPrice: 0,
  });

  const [UIState, setUIState] = useImmer<UIStateTypes>({
    calculatorModalVisible: false,
    settingModalVisible: false,
    couponModalVisible: false,
    showSetting: null,
    settingType: SettingType.PERCENT,
    isFocus: false,
    inputIsEmpty: false,
    showDealPrice: false,
    confirmModalVisible: false,
  });

  useEffect(() => {
    setData((draft) => {
      draft.stopProfitRate = Number(stopProfit);
      draft.stopLossRate = Number(stopLoss);
    });
  }, [stopProfit, stopLoss, setData]);

  useEffect(() => {
    Trade.changeMargin('');
    Trade.changePrice2('');
  }, [routerId]);

  useEffect(() => {
    if (cid) {
      Trade.changeAccount(AccountType.TRIAL);
    }
  }, [cid]);

  useEffect(() => {
    if (cid) {
      const selectCoupon = bonusList.find((item) => item.id === cid);
      selectCoupon && Trade.changeSelectCard(selectCoupon?.id);
    }
  }, [cid, bonusList]);

  useEffect(() => {
    setData((draft) => {
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
      setUIState((draft) => {
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

  const isStopProfit = UIState.showSetting === StopType.STOP_PROFIT;

  const onSettingTypeClicked = () => {
    setUIState((draft) => {
      draft.settingType = draft.settingType === SettingType.PRICE ? SettingType.PERCENT : SettingType.PRICE;
    });
  };

  const onRateChange = (num: number) => {
    if (isStopProfit) {
      num >= stopProfitRange[0] && Trade.changeStopRate(num, StopType.STOP_PROFIT);
    } else {
      num <= stopLossRange[0] && Trade.changeStopRate(num, StopType.STOP_LOSS);
    }
    setData((draft) => {
      if (isStopProfit) {
        draft.stopProfitRate = num;
      } else {
        draft.stopLossRate = num;
      }
    });
  };

  const btnText = isBuy ? LANG('买涨') : LANG('买跌');

  const onPriceChange = (num: number) => {
    Trade.changeStopPrice(num, isStopProfit ? StopType.STOP_PROFIT : StopType.STOP_LOSS);
    setData((draft) => {
      if (isStopProfit) {
        num !== undefined && (draft.stopProfitPrice = num);
      } else {
        num !== undefined && (draft.stopLossPrice = num);
      }
    });
  };

  const onSubmitClicked = async () => {
    if (orderConfirm) {
      setUIState((draft) => {
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
      message.success(LANG('下单成功'));
      setUIState((draft) => {
        draft.confirmModalVisible = false;
      });
    } else {
      message.error(data.message || LANG('系统繁忙，请稍后再试'));
    }
    Loading.end();
  };

  const renderTab = useCallback(() => {
    return (
      <div className='tab-container'>
        <div className='header'>
          <ul>
            {isReal && (
              <li className={getActive(isLimit)} onClick={() => onTabClicked(OrderType.LIMIT)}>
                {LANG('计划委托')}
              </li>
            )}
            <li
              className={`${getActive(!isLimit)} ${!isReal && 'not-pointer'}`}
              onClick={() => onTabClicked(OrderType.MARKET)}
            >
              {LANG('市价')}
            </li>
          </ul>
          <div className='sub'>
            <span className='sub-title'>{LANG('仓位')}: </span>
            <span className='volume'>
              {formatDefaultText(position.toFixed(scale))} {positionCurrency}
            </span>
          </div>
        </div>
        <div className='content'>
          {isLimit && (
            <div>
              <PriceInput
                value={limitPrice}
                decimal={currentCommodityDigit}
                label={`${LANG('委托价')}：`}
                placeholder={`${limitPriceRange[0]} ~ ${limitPriceRange[1]}`}
                onChange={(val) => Trade.changePrice1(val)}
                min={Number(limitPriceRange[0])}
                max={Number(limitPriceRange[1])}
                addStep={toMinNumber(currentCommodityDigit)}
                minusStep={toMinNumber(currentCommodityDigit)}
                onBlur={() => Trade.changeBlurPrice1()}
              />
              {UIState.showDealPrice ? (
                <PriceInput
                  value={limitFinalPrice}
                  decimal={currentCommodityDigit}
                  placeholder={limitPriceDeal as string}
                  onChange={(val) => Trade.changePrice2(val)}
                  max={isBuy ? 0 : Number(limitPriceDeal)}
                  min={isBuy ? Number(limitPriceDeal) : 0}
                  addStep={toMinNumber(currentCommodityDigit)}
                  minusStep={toMinNumber(currentCommodityDigit)}
                  isNegative
                  labelRender={() => (
                    <span className='labelRender'>
                      {LANG('委托成交价')}:<span>{isBuy ? '≤' : '≥'}</span>
                    </span>
                  )}
                  canEmpty
                />
              ) : (
                <div className='deal-price-wrapper'>
                  <div>
                    {LANG('成交价')}：{LANG('不限')}
                  </div>
                  <div
                    onClick={() =>
                      setUIState((draft) => {
                        draft.showDealPrice = true;
                      })
                    }
                  >
                    {LANG('设置')}
                  </div>
                </div>
              )}
            </div>
          )}
          <PriceInput
            value={margin}
            decimal={USDTScale}
            label={`${LANG('保证金')}：`}
            placeholder={`${marginRange[0]} ~ ${marginRange[1]}`}
            onChange={(val) => Trade.changeMargin(val)}
            min={marginRange[0]}
            max={marginRange[1]}
            addStep={2}
            minusStep={2}
            isCoupon={isTrial}
            bonusId={bonusId}
            onCouponClick={() =>
              setUIState((draft) => {
                draft.couponModalVisible = true;
              })
            }
            labelClass='marginInput'
            onBlur={() => Trade.changeMarginBlur()}
          />
          {/* 体验金账户不显示追加保证金按钮 */}
          {!isTrial && (
            <div className='group'>
              {marginAddList.map((item) => (
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
    currentCommodityDigit,
  ]);

  const FeexIconMemo = useMemo(() => {
    return <Svg src='/static/images/lite/wallet.svg' width={16} height={18} />;
  }, []);

  const SettingIconMemo = useMemo(() => {
    return (
      <>
        <Svg
          src='/static/images/lite/calculator.svg'
          width={16}
          height={14}
          style={{ marginRight: '10px' }}
          onClick={() =>
            setUIState((draft) => {
              draft.calculatorModalVisible = true;
            })
          }
        />
        <Svg
          src='/static/images/lite/trade_setting.svg'
          width={16}
          height={18}
          onClick={() =>
            setUIState((draft) => {
              draft.settingModalVisible = true;
            })
          }
        />
      </>
    );
  }, []);

  const PositionButtonMemo = useMemo(() => {
    return (
      <PositionButton
        positionSide={positionSide}
        greenText={LANG('买涨')}
        redText={LANG('买跌')}
        onChange={(positionSide) => Trade.changePositionSide(positionSide)}
      />
    );
  }, [positionSide]);

  const ArrowIconMemo = useMemo(() => {
    return <Image src='/static/images/lite/arrow.svg' width={13} height={12} alt='' />;
  }, []);

  const TooltipContentMemo = useMemo(() => {
    return (
      <>
        <Tooltip
          placement='left'
          arrow={false}
          overlayClassName={`${theme} total-wrapper`}
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
              {(isReal || isTrial) && (
                <div className={'row'}>
                  <span>{LANG('抵扣金额')}:</span>
                  <span>{deductionAmount.toFixed(USDTScale)} USDT</span>
                </div>
              )}
            </div>
          }
        >
          <div className='tooltip-label'>
            <ExclamationCircleOutlined
              style={{ fontSize: '13px', marginRight: '3px', height: '13px', color: isDark ? '#757e91' : '#333' }}
            />
            <span>{LANG('合计')}：</span>
            <span className={'mix'}>
              <span>{totalMargin.toFixed(USDTScale)}</span>
              <span>&nbsp;USDT&nbsp;</span>
            </span>
          </div>
        </Tooltip>
        <style jsx>{`
          .tooltip-label {
            display: flex;
            align-items: center;
            font-size: 12px;
            color: #333;
            font-weight: 500;
            width: max-content;
            .mix {
              display: flex;
              justify-content: space-between;
            }
          }
          :global(.dark) {
            .tooltip-label {
              color: #757e91 !important;
              .mix {
                color: #fff;
              }
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
            <span>{LANG('手续费费率')}:</span>&nbsp;
            <span className={'rate'}>{feex?.mul(100)}%</span>
          </div>
          <div className='right'>{SettingIconMemo}</div>
        </div>
        <div className='main-section'>
          <LeverView />
          {PositionButtonMemo}
          {renderTab()}
          <div className='drawer'>
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
                  <div className='setting-wrapper' onClick={onSettingTypeClicked}>
                    <Image src={isPrice ? swapIcon1 : swapIcon2} width={12} height={11} alt='' />
                    <span>{isPrice ? LANG('按价格设置') : LANG('按比例设置')}</span>
                  </div>
                </div>
                <div>
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
                          onPriceChange(isStopProfit ? data.stopProfitPrice : data.stopLossPrice);
                          setUIState((draft) => {
                            draft.isFocus = false;
                          });
                        }}
                        onChange={(val) => onPriceChange(Number(val))}
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
                          (isStopProfit ? stopProfitRange[0] : stopLossRange[stopLossRange.length - 1]).mul(100)
                        )}
                        max={Number(
                          (isStopProfit ? stopProfitRange[stopProfitRange.length - 1] : stopLossRange[0]).mul(100)
                        )}
                        addStep={5}
                        minusStep={5}
                        isPercent
                        isNegative={isStopProfit}
                        least={isStopProfit ? 1 : 0}
                        onBlur={() => {
                          if (data.stopLossRate < 0 && data.stopLossRate > stopLossRange[0]) {
                            onRateChange(stopLossRange[0]);
                          }
                        }}
                        onChange={(val) => onRateChange(Number(val.div(100)))}
                        placeholder={LANG('请输入')}
                      />
                      <div className='group'>
                        {(isStopProfit ? stopProfitRange.slice(1) : stopLossRange.slice(1)).map((num) => (
                          <div
                            key={num}
                            className={getActive((isStopProfit ? data.stopProfitRate : data.stopLossRate) === num)}
                            onClick={() => onRateChange(num)}
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
            {liteTradeEnable ? (
              <div className={`operation-btn ${isBuy ? 'btn-green' : 'btn-red'}`} onClick={onSubmitClicked}>
                {isLimit ? (
                  <span>{btnText}</span>
                ) : (
                  <>
                    <span>{btnText}:</span>
                    <b>{isBuy ? marketBuyPrice : marketSellPrice}</b>
                  </>
                )}
              </div>
            ) : (
              <button disabled className='maintain-btn'>
                {LANG('维护中')}
              </button>
            )}

            <div className={'stat-section'}>{TooltipContentMemo}</div>
          </div>
        </div>
        <CalculatorModal
          open={UIState.calculatorModalVisible}
          onClose={() =>
            setUIState((draft) => {
              draft.calculatorModalVisible = false;
            })
          }
        />
        <TransactionSettingModal
          open={UIState.settingModalVisible}
          onClose={() =>
            setUIState((draft) => {
              draft.settingModalVisible = false;
            })
          }
        />
        <CouponModal
          open={UIState.couponModalVisible}
          onClose={() =>
            setUIState((draft) => {
              draft.couponModalVisible = false;
            })
          }
        />
        <ConfirmModal
          open={UIState.confirmModalVisible}
          title={LANG('确认下单')}
          onOk={openOrder}
          onClose={() =>
            setUIState((draft) => {
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
    background: var(--theme-background-color-2-1);
    padding: 15px 10px;
    border-radius: var(--theme-trade-layout-radius);
    .title-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--skin-border-color-1);
      padding-bottom: 15px;
      > .left {
        display: flex;
        align-items: center;
        > span {
          font-size: clamp(14px, 16px, 16px);
          font-size: 14px;
          text-wrap: nowrap;
          margin-left: 4px;
          color: var(--theme-font-color-2);
          &.rate {
            color: var(--theme-font-color-1);
          }
        }
      }
      > .right {
        display: flex;
        align-items: center;
      }
    }
    .main-section {
      .drawer {
        .drawer-tab {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 22px;
          margin-bottom: 5px;
          > div {
            cursor: pointer;
            color: var(--theme-font-color-2);
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
              border-bottom-color: var(--skin-color-active);
              :global(img) {
                transform: rotate(0);
              }
            }
          }
        }
      }
      .drawer-content {
        position: relative;
        padding: 15px;
        margin: 0 -15px;
        .top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding-bottom: 18px;
          .setting-wrapper {
            color: var(--theme-font-color-2);
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
        .price-wrapper {
          > span {
            &:first-child {
              font-size: 12px;
              font-weight: 500;
              color: var(--theme-font-color-2) !important;
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
      .operation-btn {
        display: flex;
        justify-content: center;
        margin: 15px 0;
        color: white;
        height: 38px;
        line-height: 38px;
        border-radius: 6px;
        span {
          font-size: 14px;
          margin-right: 4.5px;
          font-weight: 500;
        }
        b {
          font-size: 18px;
          font-weight: 600;
          letter-spacing: -1.5px;
        }
        &.btn-green {
          background: var(--color-green);
        }
        &.btn-red {
          background: var(--color-red);
        }
      }
      .maintain-btn {
        display: block;
        text-align: center;
        user-select: none;
        text-decoration: none;
        outline: none;
        border: none;
        width: 100%;
        margin-top: 10px;
        margin-bottom: 16px;
        height: 38px;
        line-height: 38px;
        border-radius: 5px;
        &:disabled {
          color: var(--theme-trade-text-2) !important;
          cursor: not-allowed !important;
          background-color: var(--theme-trade-bg-color-4);
          &:hover {
            background-color: var(--theme-trade-bg-color-4);
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
    .header {
      margin-top: 10px;
      margin-bottom: 15px;
      color: var(--theme-font-color-2);
      font-size: 14px;
      line-height: 14px;
      font-weight: 400;
      display: flex;
      justify-content: space-between;
      ul {
        padding: 0;
        margin: 0;
        display: flex;
        align-items: center;
        li {
          cursor: pointer;
          padding: 9px 0;
          margin-right: 26px;
          text-wrap: nowrap;
          &.active {
            font-weight: 500;
            color: var(--skin-color-active);
          }
          &.not-pointer {
            cursor: default;
            color: inherit;
          }
        }
      }
      .sub {
        display: flex;
        font-size: 12px;
        align-items: center;
        justify-content: flex-end;
        flex-wrap: wrap;
        .sub-title {
          color: var(--theme-font-color-2);
          margin-right: 6px;
        }
        .volume {
          color: var(--theme-font-color-1);
        }
      }
    }
    .deal-price-wrapper {
      margin-top: -18px;
      height: 40px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      > div {
        &:first-child {
          font-size: 12px;
          font-weight: 400;
          color: var(--theme-font-color-2);
        }
        &:last-child {
          cursor: pointer;
          font-size: 12px;
          font-weight: 400;
          color: var(--skin-color-active);
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
`;

const groupStyles = css`
  .group {
    display: flex;
    align-items: center;
    justify-content: space-between;
    overflow: hidden;
    width: 100%;
    color: var(--theme-font-color-2);
    margin-top: -8px;
    > div {
      background: var(--theme-trade-tips-color);
      color: var(--theme-font-color-2);
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
      &:first-child {
        margin-left: 0;
      }
      &:last-child {
        margin-right: 0;
      }
      &:hover,
      &.active {
        background: rgba(235, 179, 14, 0.1);
        color: var(--skin-color-active);
      }
    }
  }
`;
