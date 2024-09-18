import { ScaleText } from '@/components/scale-text';
import MarginInput from '@/components/trade-ui/trade-view/lite/components/input/margin-input';
import { FORMULAS } from '@/core/formulas';
import { useKycState } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Lite, LiteListItem, TradeMap } from '@/core/shared';
import { THEME } from '@/core/store';
import { Modal, Switch } from 'antd';
import { useCallback, useEffect } from 'react';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';
import { BaseModalStyle } from './base-modal-style';

const { Position } = Lite;

const AddMarginModal = ({ theme, balance, isReal = false }: { theme: THEME; balance: number; isReal?: boolean }) => {
  const { addMarginModalData: _ } = Position.state;
  const addMarginModalData = _ as LiteListItem;
  const { margin, lever, volume, opPrice, takeProfit, stopLoss, id, commodity, priceDigit, addMarginAuto } =
    addMarginModalData;
  const { isKyc } = useKycState();

  const [state, setState] = useImmer({
    addMargin: '' as number | string,
    maxMargin: 0,
    Fprice: 0,
    Lprice: 0,
    tempMargin: margin,
    tempLever: lever,
    tempFprice: 0,
    tempLprice: 0,
    addMarginAuto: addMarginAuto,
  });

  const initData = useCallback(async () => {
    const { Fprice, Lprice } = Position.calculateProfitAndLoss(addMarginModalData);
    setState((draft) => {
      draft.Fprice = Fprice;
      draft.Lprice = Lprice;
      draft.tempFprice = Fprice;
      draft.tempLprice = Lprice;
      draft.addMarginAuto = addMarginAuto;
    });
    updateMaxMargin();
  }, [addMarginModalData, balance, isKyc]);

  const updateMaxMargin = useCallback(async () => {
    TradeMap.getLiteTradeMap().then(async (list) => {
      const lite = list.get(commodity);
      if (lite) {
        const leverList = isKyc ? lite.lever2List : lite.lever0List;
        const marginList = isKyc ? lite.margin2List : lite.margin0List;
        const m = await Position.calculateMaxMargin(addMarginModalData, leverList[0], marginList[1]);
        setState((draft) => {
          draft.maxMargin = Math.min(m, balance);
        });
      }
    });
  }, [balance]);

  useEffect(() => {
    initData();
  }, []);

  useEffect(() => {
    const newMargin = margin + Number(state.addMargin);
    const newLever =
      newMargin === margin ? lever : FORMULAS.LITE_POSITION.positionCalculateLeverByMargin(volume, opPrice, newMargin);

    const takeProfitRate = Number(takeProfit.div(margin));
    const stopLossRate = Number(stopLoss.div(margin));
    const { Fprice, Lprice } = Position.calculateProfitAndLoss(
      addMarginModalData,
      takeProfitRate,
      stopLossRate,
      newLever
    );
    setState((draft) => {
      draft.tempMargin = newMargin;
      draft.tempLever = newLever;
      draft.tempFprice = Fprice;
      draft.tempLprice = Lprice;
    });
  }, [state.addMargin]);

  const onOKClicked = useCallback(async () => {
    if (state.addMarginAuto !== addMarginAuto) {
      Position.autoAddMargin(id, state.addMarginAuto, Number(state.addMargin));
    }
    if (Number(state.addMargin) > 0) {
      await Position.addMargin(id, Number(state.addMargin));
    }
    Position.setAddMarginModalData(null);
  }, [state.addMargin, state.addMarginAuto, addMarginAuto]);

  return (
    <>
      <Modal
        title={LANG('追加保证金')}
        open={addMarginModalData !== null}
        className={`${theme} addMarginModal baseModal`}
        okText={LANG('确认')}
        cancelText={LANG('取消')}
        width={400}
        onCancel={() => Position.setAddMarginModalData(null)}
        onOk={onOKClicked}
        okButtonProps={{
          disabled: Number(state.addMargin) <= 0 && state.addMarginAuto === addMarginAuto,
        }}
        closable={false}
      >
        <MarginInput
          value={state.addMargin}
          onChange={(val) =>
            setState((draft) => {
              draft.addMargin = val;
            })
          }
          min={0}
          max={state.maxMargin}
          placeholder={`0 ~ ${state.maxMargin}`}
          decimal={2}
          addStep={0.01}
          minusStep={0.01}
          isPrice
          theme={theme}
        />
        <div className='balanceWrapper'>
          <span className='smallLabel'>{LANG('可用余额')}</span>
          <span className='value'>
            <ScaleText money={balance} currency='USDT' /> USDT
          </span>
          <span
            className='setMaxBtn'
            onClick={() =>
              setState((draft) => {
                draft.addMargin = state.maxMargin;
              })
            }
          >
            {LANG('最大')}
          </span>
        </div>
        <div className='grid-box'>
          <div className='grid'>
            <label className='label'>{LANG('保证金')}</label>
            <div>
              <span className='label'>{margin.toFixed(2)}</span>
              <span className='arrow'>→</span>
              <span className='value'>{state.tempMargin.toFixed(2)}</span>
            </div>
          </div>
          <div className='grid'>
            <label className='label'>{LANG('杠杆')}</label>
            <div>
              <span className='label'>{lever.toFixed(2)}</span>
              <span className='arrow'>→</span>
              <span className='value'>{state.tempLever.toFixed(2)}</span>
            </div>
          </div>
          <div className='grid'>
            <label className='label'>{LANG('止盈价')}</label>
            <div>
              <span className='label'>{state.Fprice.toFixed(priceDigit)}</span>
              <span className='arrow'>→</span>
              <span className='value'>{state.tempFprice.toFixed(priceDigit)}</span>
            </div>
          </div>
          <div className='grid'>
            <label className='label'>{LANG('强平价')}</label>
            <div>
              <span className='label'>{state.Lprice.toFixed(priceDigit)}</span>
              <span className='arrow'>→</span>
              <span className='value'>{state.tempLprice.toFixed(priceDigit)}</span>
            </div>
          </div>
        </div>
        <div className='result'>
          <div>
            <span className='label'>{LANG('追加手续费')}</span>
            <span className='value'>0.00 USDT</span>
          </div>
          <div>
            <span className='label'>{LANG('合计')}</span>
            <span className='value'>{state.addMargin === '' ? 0 : state.addMargin} USDT</span>
          </div>
          {isReal && (
            <div>
              <span className='label'>{LANG('自动追加保证金')}</span>
              <Switch
                checked={state.addMarginAuto}
                onChange={(checked) => {
                  setState((draft) => {
                    draft.addMarginAuto = checked;
                  });
                }}
              />
            </div>
          )}
        </div>
      </Modal>
      <BaseModalStyle />
      <style jsx>{styles}</style>
    </>
  );
};

export default AddMarginModal;

const styles = css`
  :global(.addMarginModal) {
    :global(.container) {
      background: var(--theme-trade-tips-color);
      :global(input) {
        background: var(--theme-trade-tips-color);
      }
    }
    :global(.btn-control) {
      background: var(--theme-font-color-3);
      :global(svg) {
        height: 9px;
        width: 9px;
        fill: #fff;
      }
    }
    .balanceWrapper {
      height: 43px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid rgba(121, 130, 150, 0.15);
    }
    .smallLabel {
      color: var(--theme-font-color-2);
      font-size: 12px;
      font-weight: 500;
      margin-right: 10px;
    }
    .label {
      color: var(--theme-font-color-2);
      font-size: 14px;
      font-weight: 600;
    }
    .arrow {
      color: var(--theme-font-color-2);
    }
    .value {
      font-weight: 500;
      color: var(--theme-font-color-1);
    }
    .setMaxBtn {
      color: var(--skin-primary-color);
      padding-left: 10px;
      cursor: pointer;
    }
    .grid-box {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      border-bottom: 1px solid rgba(121, 130, 150, 0.15);
      padding-bottom: 16px;
      .grid {
        width: 50%;
        &:nth-child(odd) {
          padding-right: 14px;
        }
        &:nth-child(even) {
          padding-left: 14px;
        }
        label {
          display: block;
          margin-top: 20px;
          margin-bottom: 5px;
        }
        div {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
      }
    }
    .result {
      div {
        margin-top: 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
  }
`;
