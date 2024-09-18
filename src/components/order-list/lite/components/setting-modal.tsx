import { ModalClose } from '@/components/trade-ui/common/modal';
import PercentInput from '@/components/trade-ui/trade-view/lite/components/input/percent-input';
import { LANG } from '@/core/i18n';
import { Lite, LiteListItem, TradeMap } from '@/core/shared';
import { THEME } from '@/core/store';
import { getActive, toMinNumber } from '@/core/utils';
import { Modal } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';
import { BaseModalStyle } from './add-margin-modal/base-modal-style';

const Position = Lite.Position;
const Trade = Lite.Trade;

export enum TabType {
  /**
   * 比例
   */
  RATIO,
  /**
   * 价格
   */
  PRICE,
  /**
   * 金额
   */
  AMOUNT,
}

interface Props {
  tab: number;
  setTab: (index: TabType) => void;
  theme: THEME;
}

const SettingModal = ({ tab, setTab, theme }: Props) => {
  const { settingModalData: _, marketMap } = Position.state;
  const [stopProfitRange, setStopProfitRange] = useState([0, 0]);
  const [stopLossRange, setStopLossRange] = useState([0, 0]);

  const settingModalData = _ as LiteListItem;

  const { opPrice, commodity, margin, lever, buy, priceDigit, commodityName } = settingModalData;

  const [realFRate, setRealFRate] = useState(Number(settingModalData.takeProfit.div(margin)));
  const [realLRate, setRealLRate] = useState(Number(settingModalData.stopLoss.div(margin)));
  const [state, setState] = useImmer({
    takeProfitRate: realFRate,
    stopLossRate: realLRate,
    takeProfitPrice: 0,
    stopLossPrice: 0,
    takeProfitAmount: 0,
    stopLossAmount: 0,
  });

  const { maxFprice, minFprice, maxLprice, minLprice } = Position.calculatePriceRange(
    settingModalData,
    stopProfitRange,
    stopLossRange
  );
  const { maxFAmount, minFAmount, maxLAmount, minLAmount } = Position.calculateAmountRange(
    settingModalData.margin,
    stopProfitRange,
    stopLossRange
  );

  useEffect(() => {
    TradeMap.getLiteTradeMap().then(async (list) => {
      const lite = list?.get(commodity);
      if (lite) {
        setStopProfitRange(lite.takeProfitList);
        setStopLossRange(lite.stopLossList);
      }
    });
  }, []);

  const renderTitle = useMemo(() => {
    return (
      <div className='modalTitle'>
        <span>{commodityName}</span>
        <span>{lever}X</span>
        {buy ? <span className='main-green'>{LANG('买涨')}</span> : <span className='main-red'>{LANG('买跌')}</span>}
      </div>
    );
  }, [settingModalData]);

  const income = useMemo(() => {
    const { income } = Position.calculateIncome(settingModalData, marketMap);
    return income;
  }, [settingModalData, marketMap]);

  const renderPercentBtns = (Range: number[], n: number, onClick: (c: number) => void) => {
    return (
      <ul>
        {Range.map((num) => (
          <li key={num} className={getActive(n === Number(num))} onClick={() => onClick(Number(num))}>
            {num.mul(100)}%
          </li>
        ))}
      </ul>
    );
  };

  useEffect(() => {
    onTabClicked(tab);
  }, []);

  const onTabClicked = (index: TabType) => {
    if (index === TabType.RATIO) {
      const [fixed2realFRate, fixed2realLRate] = [Number(realFRate.toFixed(2)), Number(realLRate.toFixed(2))];
      setRealFRate(fixed2realFRate);
      setRealLRate(fixed2realLRate);
      setState((draft) => {
        draft.takeProfitRate = fixed2realFRate;
        draft.stopLossRate = fixed2realLRate;
      });
      setTab(TabType.RATIO);
    } else if (index === TabType.PRICE) {
      if (tab === TabType.AMOUNT) {
        setState((draft) => {
          draft.takeProfitPrice = cachePriceInAmount.Fprice;
          draft.stopLossPrice = cachePriceInAmount.Lprice;
        });
      } else {
        setState((draft) => {
          draft.takeProfitPrice = cachePriceInRatio.Fprice;
          draft.stopLossPrice = cachePriceInRatio.Lprice;
        });
      }
      setTab(TabType.PRICE);
    } else {
      setState((draft) => {
        draft.takeProfitAmount = Number(margin.mul(realFRate).toFixed(2));
        draft.stopLossAmount = Number(margin.mul(realLRate).toFixed(2));
      });
      setTab(TabType.AMOUNT);
    }
  };

  const cachePriceInRatio = useMemo(() => {
    return Position.calculateProfitAndLoss(settingModalData, state.takeProfitRate, state.stopLossRate);
  }, [state.takeProfitRate, state.stopLossRate, settingModalData]);

  const cachePriceInAmount = useMemo(() => {
    return Position.calculateProfitAndLoss(settingModalData, realFRate, realLRate);
  }, [realFRate, realLRate, settingModalData]);

  const onTakeProfitPriceChanged = useCallback((val: number) => {
    setState((draft) => {
      draft.takeProfitPrice = val;
    });
    const { FRate } = Position.calculateFRateByFPrice(settingModalData, val, state.stopLossPrice);
    setRealFRate(FRate);
  }, []);

  const onStopLossPriceChanged = useCallback(
    (val: number) => {
      setState((draft) => {
        draft.stopLossPrice = val;
      });
      const maxStopLoss = stopLossRange[stopLossRange.length - 1];
      let { LRate } = Position.calculateFRateByFPrice(settingModalData, state.takeProfitPrice, val);

      // 避免小数点误差导致穿仓
      if (LRate < maxStopLoss) {
        LRate = maxStopLoss;
      }
      setRealLRate(LRate);
    },
    [stopLossRange]
  );

  const onTakeProfitAmountChanged = useCallback((val: number) => {
    setState((draft) => {
      draft.takeProfitAmount = val;
    });
    const FRate = Number(val.div(margin));
    setRealFRate(FRate);
  }, []);

  const onStopLossAmountChanged = useCallback((val: number) => {
    setState((draft) => {
      draft.stopLossAmount = val;
    });
    const LRate = Number(val.div(margin));
    setRealLRate(LRate);
  }, []);

  const onOKClicked = useCallback(async () => {
    const [fixed2realFRate, fixed2realLRate] = [Number(realFRate.toFixed(4)), Number(realLRate.toFixed(4))];
    await Position.updateTPSL(settingModalData.id, fixed2realFRate, fixed2realLRate);
    Position.setSettingModalData(null);
  }, [realFRate, realLRate, settingModalData]);

  return (
    <>
      <Modal
        title={renderTitle}
        className={`${theme} baseModal settingModal`}
        open={settingModalData !== null}
        okText={LANG('确认')}
        cancelText={LANG('取消')}
        width={400}
        onCancel={() => Position.setSettingModalData(null)}
        onOk={onOKClicked}
        closable={false}
      >
        <ModalClose className='close-icon' onClose={() => Position.setSettingModalData(null)} />
        <div className='setting-modal-header'>
          <div className='row'>
            <div>
              {LANG('开仓价')}&{LANG('当前价')}
            </div>
            <div>{LANG('收益')}</div>
          </div>
          <div className='row price'>
            <div>
              {opPrice} → {marketMap[commodity]?.price || 0}
            </div>
            <div className={income >= 0 ? 'main-green' : 'main-red'}>
              <span>
                {income >= 0 ? '+' : ''}
                {Number(income.toFixed(2))}
              </span>
            </div>
          </div>
        </div>
        <div className='switch-type'>
          <div className={`tabs ${getActive(tab === 0)}`} onClick={() => onTabClicked(0)}>
            {LANG('比例')}
          </div>
          <div className={`tabs ${getActive(tab === 1)}`} onClick={() => onTabClicked(1)}>
            {LANG('价格')}
          </div>
          <div className={`tabs ${getActive(tab === 2)}`} onClick={() => onTabClicked(2)}>
            {LANG('金额')}
          </div>
        </div>
        {tab === TabType.RATIO && (
          <div>
            <div className='fake'>
              <PercentInput
                label={`${LANG('止盈')}:`}
                value={state.takeProfitRate.mul(100)}
                onChange={(val) => {
                  setState((draft) => {
                    draft.takeProfitRate = Number(val.div(100));
                  });
                  setRealFRate(Number(val.div(100)));
                }}
                max={Number(stopProfitRange[stopProfitRange.length - 1]?.mul(100))}
                min={Number(stopProfitRange[0]?.mul(100))}
                theme={theme}
              />
              {renderPercentBtns(stopProfitRange.slice(1), state.takeProfitRate, (val) => {
                setState((draft) => {
                  draft.takeProfitRate = val;
                });
                setRealFRate(val);
              })}
            </div>
            <div className='row'>
              <div>
                {LANG('盈利金额')}：{Number(margin.mul(state.takeProfitRate).toFixed(2))}
              </div>
              <div>
                {LANG('止盈价')}：{cachePriceInRatio.Fprice.toFixed(priceDigit)}
              </div>
            </div>
            <div className='fake'>
              <PercentInput
                label={`${LANG('止损')}:`}
                value={state.stopLossRate.mul(100)}
                onChange={(val) => {
                  setState((draft) => {
                    draft.stopLossRate = Number(val.div(100));
                  });
                  setRealLRate(Number(val.div(100)));
                }}
                max={Number(stopLossRange[0]?.mul(100))}
                min={Number(stopLossRange[stopLossRange.length - 1]?.mul(100))}
                isNegative={false}
                theme={theme}
              />
              {renderPercentBtns(stopLossRange.slice(1), state.stopLossRate, (val) => {
                setState((draft) => {
                  draft.stopLossRate = val;
                });
                setRealLRate(val);
              })}
            </div>
            <div className='row'>
              <div>
                {LANG('亏损金额')}：{Number(margin.mul(state.stopLossRate).toFixed(2))}
              </div>
              <div>
                {LANG('强平价')}：{cachePriceInRatio.Lprice.toFixed(priceDigit)}
              </div>
            </div>
          </div>
        )}
        {tab === TabType.PRICE && (
          <div>
            <div className='fake'>
              <PercentInput
                label={`${LANG('止盈')}:`}
                value={state.takeProfitPrice}
                onChange={(val) => onTakeProfitPriceChanged(Number(val))}
                max={Number(maxFprice.toFixed(priceDigit))}
                min={Number(minFprice.toFixed(priceDigit))}
                placeholder={`${minFprice.toFixed(priceDigit)}~${maxFprice.toFixed(priceDigit)}`}
                addStep={toMinNumber(priceDigit)}
                minusStep={toMinNumber(priceDigit)}
                decimal={priceDigit}
                isPrice
                theme={theme}
              />
            </div>
            <div className='row'>
              <div>
                {LANG('盈利金额')}：{Number(margin.mul(realFRate).toFixed(2))}
              </div>
              <div>
                {LANG('盈利百分比')}：{realFRate.mul(100).toFixed(2)}%
              </div>
            </div>
            <div className='fake'>
              <PercentInput
                label={`${LANG('止损')}:`}
                value={state.stopLossPrice}
                onChange={(val) => onStopLossPriceChanged(Number(val))}
                max={Number(minLprice.toFixed(priceDigit))}
                min={Number(maxLprice.toFixed(priceDigit))}
                placeholder={`${maxLprice.toFixed(priceDigit)}~${minLprice.toFixed(priceDigit)}`}
                addStep={toMinNumber(priceDigit)}
                minusStep={toMinNumber(priceDigit)}
                decimal={priceDigit}
                isPrice
                theme={theme}
              />
            </div>
            <div className='row'>
              <div>
                {LANG('亏损金额')}：{Number(margin.mul(realLRate).toFixed(2))}
              </div>
              <div>
                {LANG('亏损百分比')}：{realLRate.mul(100).toFixed(2)}%
              </div>
            </div>
          </div>
        )}
        {tab === TabType.AMOUNT && (
          <div>
            <div className='fake'>
              <PercentInput
                label={`${LANG('止盈')}:`}
                value={state.takeProfitAmount}
                onChange={(val) => onTakeProfitAmountChanged(Number(val))}
                max={maxFAmount}
                min={minFAmount}
                placeholder={`${minFprice.toFixed(priceDigit)}~${maxFprice.toFixed(priceDigit)}`}
                addStep={0.01}
                minusStep={0.01}
                decimal={2}
                isPrice
                theme={theme}
              />
            </div>
            <div className='row'>
              <div>
                {LANG('止盈价')}：{cachePriceInAmount.Fprice.toFixed(priceDigit)}
              </div>
              <div>
                {LANG('盈利百分比')}：{realFRate.mul(100).toFixed(2)}%
              </div>
            </div>
            <div className='fake'>
              <PercentInput
                label={`${LANG('止损')}:`}
                value={state.stopLossAmount}
                onChange={(val) => onStopLossAmountChanged(Number(val))}
                max={maxLAmount}
                min={minLAmount}
                placeholder={`${maxLAmount}~${minLAmount}`}
                addStep={0.01}
                minusStep={0.01}
                decimal={2}
                isNegative={false}
                isPrice
                theme={theme}
              />
            </div>
            <div className='row'>
              <div>
                {LANG('强平价')}：{cachePriceInAmount.Lprice.toFixed(priceDigit)}
              </div>
              <div>
                {LANG('亏损百分比')}：{realLRate.mul(100).toFixed(2)}%
              </div>
            </div>
          </div>
        )}
      </Modal>
      <BaseModalStyle />
      <style jsx>{styles}</style>
    </>
  );
};

export default SettingModal;

const styles = css`
  :global(.settingModal) {
    font-weight: 600;
    :global(.close-icon) {
      cursor: pointer;
      position: absolute;
      top: 7px;
      right: 11px;
    }
    :global(.modalTitle) {
      text-align: center;
      font-size: 16px;
      font-weight: 500;
      line-height: 22px;
      :global(span) {
        margin: 0 3px;
      }
    }
    .setting-modal-header {
      padding: 10px 0;
      border-bottom: 1px solid rgba(121, 130, 150, 0.15);
    }
    .row {
      display: flex;
      justify-content: space-between;
      color: var(--theme-font-color-3);
      font-size: 12px;
      font-weight: 600;
      &.price {
        color: #333;
        font-size: 16px;
        > div:last-child {
          font-size: 18px;
        }
      }
    }
    .switch-type {
      border-bottom: 1px solid rgba(121, 130, 150, 0.15);
      display: flex;
      margin: 10px 0 15px;
      padding-bottom: 10px;
      .tabs {
        text-align: center;
        cursor: pointer;
        margin-right: 40px;
        font-size: 14px;
        color: var(--theme-font-color-3);
        &.active {
          color: var(--skin-primary-color) !important;
          position: relative;
          &:after {
            position: absolute;
            content: ' ';
            width: 100%;
            height: 2px;
            background-color: var(--skin-primary-color);
            bottom: -10px;
            left: 0;
          }
        }
      }
    }
    .fake {
      :global(ul) {
        display: flex;
        align-items: center;
        margin-top: 15px;
        padding: 0;
        :global(li) {
          user-select: none;
          cursor: pointer;
          flex: 1;
          margin: 0 5px;
          text-align: center;
          font-size: 12px;
          height: 25px;
          line-height: 24px;
          border-radius: 3px;
          background: var(--theme-trade-tips-color);
          color: var(--theme-font-color-1);
          &:first-child {
            margin-left: 0;
          }
          &:last-child {
            margin-right: 0;
          }
        }
      }
      :global(.active) {
        color: var(--skin-primary-color) !important;
        border-color: var(--skin-primary-color) !important;
      }
    }
  }
`;
