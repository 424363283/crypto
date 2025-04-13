import { ModalClose } from '@/components/trade-ui/common/modal';
import PercentInput from '@/components/trade-ui/trade-view/lite/components/input/percent-input';
import { LANG } from '@/core/i18n';
import { Lite, LiteListItem, TradeMap } from '@/core/shared';
import { THEME } from '@/core/store';
import { getActive, toMinNumber } from '@/core/utils';
import { Modal, Button } from 'antd';
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
  AMOUNT
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

  const { opPrice, commodity, contract, margin, lever, buy, priceDigit, commodityName } = settingModalData;

  const [realFRate, setRealFRate] = useState(Number(settingModalData.takeProfit.div(margin)));
  const [realLRate, setRealLRate] = useState(Number(settingModalData.stopLoss.div(margin)));
  const [state, setState] = useImmer({
    takeProfitRate: realFRate,
    stopLossRate: realLRate,
    takeProfitPrice: 0,
    stopLossPrice: 0,
    takeProfitAmount: 0,
    stopLossAmount: 0
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
    TradeMap.getLiteTradeMap().then(async list => {
      const lite = list?.get(commodity);
      if (lite) {
        setStopProfitRange(lite.takeProfitList);
        setStopLossRange(lite.stopLossList);
      }
    });
  }, []);

  const income = useMemo(() => {
    const { income } = Position.calculateIncome(settingModalData, marketMap);
    return income;
  }, [settingModalData, marketMap]);

  const renderPercentBtns = (Range: number[], n: number, onClick: (c: number) => void) => {
    return (
      <ul>
        {Range.map((num, index) => (
          <li key={index} className={getActive(n === Number(num))} onClick={() => onClick(Number(num))}>
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
      setState(draft => {
        draft.takeProfitRate = fixed2realFRate;
        draft.stopLossRate = fixed2realLRate;
      });
      setTab(TabType.RATIO);
    } else if (index === TabType.PRICE) {
      if (tab === TabType.AMOUNT) {
        setState(draft => {
          draft.takeProfitPrice = cachePriceInAmount.Fprice;
          draft.stopLossPrice = cachePriceInAmount.Lprice;
        });
      } else {
        setState(draft => {
          draft.takeProfitPrice = cachePriceInRatio.Fprice;
          draft.stopLossPrice = cachePriceInRatio.Lprice;
        });
      }
      setTab(TabType.PRICE);
    } else {
      setState(draft => {
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
    setState(draft => {
      draft.takeProfitPrice = val;
    });
    const { FRate } = Position.calculateFRateByFPrice(settingModalData, val, state.stopLossPrice);
    setRealFRate(FRate);
  }, []);

  const onStopLossPriceChanged = useCallback(
    (val: number) => {
      setState(draft => {
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
    setState(draft => {
      draft.takeProfitAmount = val;
    });
    const FRate = Number(val.div(margin));
    setRealFRate(FRate);
  }, []);

  const onStopLossAmountChanged = useCallback((val: number) => {
    setState(draft => {
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
        title={LANG('设置')}
        className={`${theme} baseModal settingModal`}
        open={settingModalData !== null}
        okText={LANG('确认')}
        width={480}
        onOk={onOKClicked}
        cancelText={null}
        cancelButtonProps={{ style: { display: 'none' } }}
        closable={false}
        centered
      >
        <ModalClose className="close-icon" onClose={() => Position.setSettingModalData(null)} />
        <div className="modalTitle">
          <span className="symbolName">{commodityName}</span>
          <span className="leverage">{lever}x</span>
          <div className="position-side">
            {buy ? (
              <span className="main-green">{LANG('买涨')}</span>
            ) : (
              <span className="main-red">{LANG('买跌')}</span>
            )}
          </div>
        </div>
        <div className="setting-modal-header">
          <div className="item-info">
            <p>{LANG('开仓价')}</p>
            <span>{opPrice}</span>
          </div>
          <div className="item-info">
            <p>{LANG('当前价')}</p>
            <span>{marketMap[contract]?.price || 0}</span>
          </div>
          <div className="item-info">
            <p>{LANG('收益')}</p>
            <div className={income >= 0 ? 'main-green' : 'main-red'}>
              <span>
                {income >= 0 ? '+' : ''}
                {Number(income.toFixed(2))}
              </span>
            </div>
          </div>
        </div>
        <div className="switch-type">
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
            <div className="fake">
              <PercentInput
                label={`${LANG('止盈')}:`}
                value={state.takeProfitRate.mul(100)}
                onChange={val => {
                  setState(draft => {
                    draft.takeProfitRate = Number(val.div(100));
                  });
                  setRealFRate(Number(val.div(100)));
                }}
                max={Number(stopProfitRange[stopProfitRange.length - 1]?.mul(100))}
                min={Number(stopProfitRange[0]?.mul(100))}
                theme={theme}
              />
              {renderPercentBtns(stopProfitRange, state.takeProfitRate, val => {
                setState(draft => {
                  draft.takeProfitRate = val;
                });
                setRealFRate(val);
              })}
            </div>
            <div className="row">
              <div>
                {LANG('盈利金额')}：<span>{Number(margin.mul(state.takeProfitRate).toFixed(2))}</span>
              </div>
              <div>
                {LANG('止盈价')}：<span>{cachePriceInRatio.Fprice.toFixed(priceDigit)}</span>
              </div>
            </div>
            <div className="form-line"></div>
            <div className="fake">
              <PercentInput
                label={`${LANG('止损')}:`}
                value={state.stopLossRate.mul(100)}
                onChange={val => {
                  setState(draft => {
                    draft.stopLossRate = Number(val.div(100));
                  });
                  setRealLRate(Number(val.div(100)));
                }}
                max={Number(stopLossRange[0]?.mul(100))}
                min={Number(stopLossRange[stopLossRange.length - 1]?.mul(100))}
                isNegative={false}
                theme={theme}
              />
              {renderPercentBtns(stopLossRange, state.stopLossRate, val => {
                setState(draft => {
                  draft.stopLossRate = val;
                });
                setRealLRate(val);
              })}
            </div>
            <div className="row">
              <div>
                {LANG('亏损金额')}：<span>{Number(margin.mul(state.stopLossRate).toFixed(2))}</span>
              </div>
              <div>
                {LANG('强平价')}：<span>{cachePriceInRatio.Lprice.toFixed(priceDigit)}</span>
              </div>
            </div>
          </div>
        )}
        {tab === TabType.PRICE && (
          <div>
            <div className="fake">
              <PercentInput
                inputType={'price'}
                label={`${LANG('止盈')}:`}
                value={state.takeProfitPrice}
                onChange={val => onTakeProfitPriceChanged(Number(val))}
                min={
                  buy
                    ? Number(Math.abs(minFprice).toFixed(priceDigit))
                    : Number(Math.abs(maxFprice).toFixed(priceDigit))
                }
                max={
                  buy
                    ? Number(Math.abs(maxFprice).toFixed(priceDigit))
                    : Number(Math.abs(minFprice).toFixed(priceDigit))
                }
                placeholder={
                  buy
                    ? `${Math.abs(minFprice).toFixed(priceDigit)}~${Math.abs(maxFprice).toFixed(priceDigit)}`
                    : `${Math.abs(maxFprice).toFixed(priceDigit)}~${Math.abs(minFprice).toFixed(priceDigit)}`
                }
                addStep={toMinNumber(priceDigit)}
                minusStep={toMinNumber(priceDigit)}
                decimal={priceDigit}
                isPrice
                theme={theme}
              />
            </div>
            <div className="row">
              <div>
                {LANG('盈利金额')}：<span>{Number(margin.mul(realFRate).toFixed(2))}</span>
              </div>
              <div>
                {LANG('盈利百分比')}：<span>{realFRate.mul(100).toFixed(2)}%</span>
              </div>
            </div>
            <div className="form-line"></div>
            <div className="fake">
              <PercentInput
                inputType={'price'}
                label={`${LANG('止损')}:`}
                value={state.stopLossPrice}
                onChange={val => onStopLossPriceChanged(Number(val))}
                max={buy ? Number(minLprice.toFixed(priceDigit)) : Number(maxLprice.toFixed(priceDigit))}
                min={buy ? Number(maxLprice.toFixed(priceDigit)) : Number(minLprice.toFixed(priceDigit))}
                placeholder={
                  buy
                    ? `${maxLprice.toFixed(priceDigit)}~${minLprice.toFixed(priceDigit)}`
                    : `${minLprice.toFixed(priceDigit)}~${maxLprice.toFixed(priceDigit)}`
                }
                addStep={toMinNumber(priceDigit)}
                minusStep={toMinNumber(priceDigit)}
                decimal={priceDigit}
                isPrice
                theme={theme}
              />
            </div>
            <div className="row">
              <div>
                {LANG('亏损金额')}：<span>{Number(margin.mul(realLRate).toFixed(2))}</span>
              </div>
              <div>
                {LANG('亏损百分比')}：<span>{realLRate.mul(100).toFixed(2)}%</span>
              </div>
            </div>
          </div>
        )}
        {tab === TabType.AMOUNT && (
          <div>
            <div className="fake">
              <PercentInput
                inputType={'price'}
                label={`${LANG('止盈')}:`}
                value={state.takeProfitAmount}
                onChange={val => onTakeProfitAmountChanged(Number(val))}
                max={maxFAmount}
                min={minFAmount}
                placeholder={`${minFAmount.toFixed(priceDigit)}~${maxFAmount.toFixed(priceDigit)}`}
                addStep={0.01}
                minusStep={0.01}
                decimal={2}
                isPrice
                theme={theme}
              />
            </div>
            <div className="row">
              <div>
                {LANG('止盈价')}：<span>{cachePriceInAmount.Fprice.toFixed(priceDigit)}</span>
              </div>
              <div>
                {LANG('盈利百分比')}：<span>{realFRate.mul(100).toFixed(2)}%</span>
              </div>
            </div>
            <div className="form-line"></div>
            <div className="fake">
              <PercentInput
                inputType={'price'}
                label={`${LANG('止损')}:`}
                value={state.stopLossAmount}
                onChange={val => onStopLossAmountChanged(Number(val))}
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
            <div className="row">
              <div>
                {LANG('强平价')}：<span>{cachePriceInAmount.Lprice.toFixed(priceDigit)}</span>
              </div>
              <div>
                {LANG('亏损百分比')}：<span>{realLRate.mul(100).toFixed(2)}%</span>
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
  :global(.ant-modal.baseModal.settingModal) {
    :global(.close-icon) {
      cursor: pointer;
      position: absolute;
      top: 16px;
      right: 11px;
    }
    :global(.ant-modal-content) {
      padding: 24px !important;
      border-radius: 24px !important;
    }
    :global(.ant-modal-header) {
      border-bottom: none;
      background: transparent;
      padding: 0;
      :global(.ant-modal-title) {
        text-align: left !important;
        color: var(--text-primary, #2b2f33);
        font-size: 16px;
        font-weight: 500;
      }
    }
    :global(.ant-modal-body) {
      padding: 24px 0 0 !important;
    }

    :global(.ant-btn-primary) {
      width: 100% !important;
      padding: 0 !important;
    }

    :global(.ant-modal-footer) {
      margin: 24px 0 0;
    }

    .modalTitle {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .symbolName {
      color: var(--text-primary);
      font-size: 16px;
      font-weight: 500;
      padding: 0 4px 0 0;
    }
    .leverage {
      border-radius: 4px;
      background: var(--fill-3);
      min-width: 48px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-secondary);
    }

    .row {
      color: var(--text-secondary);
      font-size: 14px;
      font-weight: 400;
      span {
        color: var(--text-primary);
        font-weight: 500;
      }
    }

    .form-line {
      margin: 24px 0;
      width: 100%;
      border-top: 1px solid var(--line-1);
    }

    .position-side {
      border-radius: 4px;
      background: var(--green_light);
      min-width: 48px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      span {
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
      }
    }

    .setting-modal-header {
      padding: 24px 0;
      border-bottom: 1px solid var(--line-1);
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      align-self: stretch;
    }
    .item-info {
      color: var(--text-primary);
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      display: flex;
      gap: 4px;
      flex-direction: column;
    }
    .row {
      display: flex;
      justify-content: space-between;
      color: var(--text-secondary);
      font-size: 14px;
      font-weight: 400;
      &.price {
        color: #333;
        font-size: 16px;
        > div:last-child {
          font-size: 18px;
        }
      }
    }
    .switch-type {
      display: flex;
      margin: 24px 0;
      gap: 24px;
      .tabs {
        text-align: center;
        cursor: pointer;
        color: var(--text-secondary);
        text-align: center;
        font-size: 16px;
        font-weight: 500;

        &.active {
          color: var(--text-brand) !important;
          position: relative;
        }
      }
    }
    .fake {
      :global(ul) {
        display: flex;
        align-items: center;
        padding: 0;
        :global(li) {
          user-select: none;
          cursor: pointer;
          flex: 1;
          margin: 0 8px;
          text-align: center;
          font-size: 12px;
          height: 26px;
          line-height: 26px;
          border-radius: 4px;
          background: var(--fill-3);
          color: var(--text-secondary);
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
      :global(.container) {
        margin: 16px 0;
      }
    }
  }
`;
