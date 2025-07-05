import { ScaleText } from '@/components/scale-text';
import MarginInput from '@/components/trade-ui/trade-view/lite/components/input/margin-input';
import { FORMULAS } from '@/core/formulas';
import { useKycState, useResponsive } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Lite, LiteListItem, TradeMap } from '@/core/shared';
import { THEME } from '@/core/store';
import { Modal, Switch } from 'antd';
import { useCallback, useEffect } from 'react';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';
import { BaseModalStyle } from './base-modal-style';
import YIcon from '@/components/YIcons';
import { BottomModal, MobileModal } from '@/components/mobile-modal';
import { MediaInfo } from '@/core/utils';

const { Position } = Lite;

const AddMarginModal = ({ theme, balance, isReal = false }: { theme: THEME; balance: number; isReal?: boolean }) => {
  const { addMarginModalData: _ } = Position.state;
  const addMarginModalData = _ as LiteListItem;
  const { margin, lever, volume, opPrice, takeProfit, stopLoss, id, commodity, priceDigit, addMarginAuto } =
    addMarginModalData;
  const { isKyc } = useKycState();
  const { isMobile } = useResponsive();

  const [state, setState] = useImmer({
    addMargin: '' as number | string,
    maxMargin: 0,
    Fprice: 0,
    Lprice: 0,
    tempMargin: margin,
    tempLever: lever,
    tempFprice: 0,
    tempLprice: 0,
    addMarginAuto: addMarginAuto
  });

  const initData = useCallback(async () => {
    const { Fprice, Lprice } = Position.calculateProfitAndLoss(addMarginModalData);
    setState(draft => {
      draft.Fprice = Fprice;
      draft.Lprice = Lprice;
      draft.tempFprice = Fprice;
      draft.tempLprice = Lprice;
      draft.addMarginAuto = addMarginAuto;
    });
    updateMaxMargin();
  }, [addMarginModalData, balance, isKyc]);

  const updateMaxMargin = useCallback(async () => {
    TradeMap.getLiteTradeMap().then(async list => {
      const lite = list.get(commodity);
      if (lite) {
        const leverList = isKyc ? lite.lever2List : lite.lever0List;
        const marginList = isKyc ? lite.margin2List : lite.margin0List;
        const m = await Position.calculateMaxMargin(addMarginModalData, leverList[0], marginList[1]);
        setState(draft => {
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
    setState(draft => {
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

  const content = (
    <>
      <div className="modal-content">
        <MarginInput
          value={state.addMargin}
          onChange={val =>
            setState(draft => {
              draft.addMargin = val;
            })
          }
          min={0}
          max={Number(state.maxMargin.toFixed(2))}
          placeholder={`0 ~ ${state.maxMargin.toFixed(2)}`}
          decimal={2}
          addStep={0.01}
          minusStep={0.01}
          isPrice
          theme={theme}
        />
        <div className="balanceWrapper">
          <span className="smallLabel">{LANG('可用余额')}</span>
          <span className="value">
            <ScaleText money={balance} currency="USDT" /> USDT
          </span>
          <span
            className="setMaxBtn"
            onClick={() =>
              setState(draft => {
                draft.addMargin = state.maxMargin.toFixed(2);
              })
            }
          >
            {LANG('最大')}
          </span>
        </div>
        <div className="grid-box">
          <div className="grid">
            <label className="label">{LANG('保证金')}</label>
            <div>
              <span className="label">{margin.toFixed(2)} USDT</span>
              <span className="arrow">
                <YIcon.arrorLeft />
              </span>
              <span className="value">{state.tempMargin.toFixed(2)} USDT</span>
            </div>
          </div>
          <div className="grid">
            <label className="label">{LANG('杠杆')}</label>
            <div>
              <span className="label">{lever.toFixed(2)} x</span>
              <span className="arrow">
                <YIcon.arrorLeft />
              </span>
              <span className="value">{state.tempLever.toFixed(2)} x</span>
            </div>
          </div>
          <div className="grid">
            <label className="label">{LANG('止盈价')}</label>
            <div>
              <span className="label">{state.Fprice.toFixed(priceDigit)}</span>
              <span className="arrow">
                <YIcon.arrorLeft />
              </span>
              <span className="value">{state.tempFprice.toFixed(priceDigit)}</span>
            </div>
          </div>
          <div className="grid">
            <label className="label">{LANG('强平价')}</label>
            <div>
              <span className="label">{state.Lprice.toFixed(priceDigit)}</span>
              <span className="arrow">
                <YIcon.arrorLeft />
              </span>
              <span className="value">{state.tempLprice.toFixed(priceDigit)}</span>
            </div>
          </div>
        </div>
        <div className="result">
          <div>
            <span className="label">{LANG('追加手续费')}</span>
            <span className="value">0.00 USDT</span>
          </div>
          <div>
            <span className="label">{LANG('合计')}</span>

            <span className="value">{state.addMargin === '' ? '0.00' : state.addMargin.toFixed(2)} USDT</span>
          </div>
          {false && isReal && (
            <div>
              <span className="label">{LANG('自动追加保证金')}</span>
              <Switch
                checked={state.addMarginAuto}
                onChange={checked => {
                  setState(draft => {
                    draft.addMarginAuto = checked;
                  });
                }}
              />
            </div>
          )}
        </div>
      </div>
      <style jsx>{styles}</style>
    </>
  );

  if (isMobile) {
    return (
      <MobileModal
        visible={addMarginModalData !== null}
        onClose={() => Position.setAddMarginModalData(null)}
        type="bottom"
      >
        <BottomModal
          title={LANG('追加保证金')}
          confirmText={LANG('确认')}
          onConfirm={onOKClicked}
          disabledConfirm={Number(state.addMargin) <= 0 && state.addMarginAuto === addMarginAuto}
        >
          {content}
        </BottomModal>
      </MobileModal>
    );
  }

  return (
    <>
      <Modal
        title={LANG('追加保证金')}
        open={addMarginModalData !== null}
        className={`${theme} addMarginModal baseModal`}
        okText={LANG('确认')}
        cancelText={LANG('取消')}
        width={480}
        onOk={onOKClicked}
        onCancel={() => Position.setAddMarginModalData(null)}
        okButtonProps={{
          disabled: Number(state.addMargin) <= 0 && state.addMarginAuto === addMarginAuto
        }}
        cancelButtonProps={{ style: { display: 'none' } }}
        closable={true}
      >
        {content}
      </Modal>
      <BaseModalStyle />
      {/* <style jsx>{styles}</style> */}
    </>
  );
};

export default AddMarginModal;

const styles = css`
  :global(.addMarginModal) {
    :global(.container) {
      border-radius: 8px;
      background: var(--fill_3);
      margin: 0;
      :global(input) {
        border-radius: 8px;
        background: var(--fill_3);

        color: var(--text_1) !important;
        font-family: 'Lexend';
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        &::placeholder {
          color: var(--text_3);
          font-family: 'Lexend';
          font-size: 14px;
          font-style: normal;
          font-weight: 500;
          line-height: normal;
        }
      }
    }
    :global(.btn-control) {
      background: var(--theme-font-color-3);
      :global(svg) {
        height: 24px;
        width: 12px;
        fill: #fff;
      }
    }
    :glabal(.ant-modal-footer) {
      padding: 24px 16px !important;
      margin: 0;
    }
    :global(.ant-btn-primary) {
      border-radius: 40px !important;
      background: var(--text_brand) !important;
      color: var(--text_white) !important;
      font-size: 16px !important;
      font-weight: 500 !important;
      width: 100% !important;
    }
    .balanceWrapper {
      display: flex;
      align-items: center;
      padding: 16px 0 24px;
      gap: 8px;
    }
    .smallLabel {
      color: var(--text_2);
      font-family: 'Lexend';
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 150%; /* 21px */
    }
    .label {
      color: var(--text_2);
      font-family: 'Lexend';
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
    }
    .arrow {
      height: 16px;
    }
    .value {
      font-weight: 500;
      color: var(--text_1);
      font-family: 'Lexend';
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
    }
    .setMaxBtn {
      color: var(--text_brand);
      font-family: 'Lexend';
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      cursor: pointer;
    }
    .grid-box {
      display: flex;
      padding: 16px;
      gap: 16px;
      align-items: flex-start;
      align-self: stretch;
      border-radius: 12px;
      background: var(--fill_3);
      flex-direction: column;

      .grid {
        width: 100%;
        display: flex;
        justify-content: space-between;

        label {
          display: block;
          color: var(--text_2);
          font-family: 'Lexend';
          font-size: 14px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
        }
        div {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
      }
    }
    .result {
      margin-top: 24px;
      border-top: 1px solid var(--fill_line_1);
      padding: 24px 0 0;
      display: flex;
      gap: 24px;
      flex-direction: column;
      div {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 24px;
      }
      .label {
        color: var(--text_2);
        font-family: 'Lexend';
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
      }
      .value {
        color: var(--text_1);
        font-family: 'Lexend';
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 150%; /* 21px */
      }
    }
  }
  @media ${MediaInfo.mobile} {
    :global(.modal-content) {
      display: flex;
      flex-direction: column;
      padding: 0 8px;
      :global(.balanceWrapper) {
        display: flex;
        align-items: center;
        padding: 0;
        margin-top: 1rem;
        gap: 8px;
        font-size: 14px;
        font-weight: 500;
        line-height: 150%; /* 21px */
        font-family: 'Lexend';
        font-style: normal;
        :global(.smallLabel) {
          color: var(--text_2);
          font-weight: 400;
        }
        :global(.value) {
          color: var(--text_1);
        }
        :global(.setMaxBtn) {
          color: var(--text_brand);
        }
      }
    }

    :global(.grid-box) {
      display: flex;
      padding: 1rem;
      gap: 1rem;
      margin-top: 1.5rem;
      align-items: flex-start;
      align-self: stretch;
      border-radius: 12px;
      background: var(--fill_3);
      flex-direction: column;
      :global(.label) {
        font-size: 14px;
        color: var(--text_2);
        font-weight: 400;
      }
      :global(.grid) {
        width: 100%;
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        :global(label) {
          width: 4rem;
          display: block;
          color: var(--text_2);
          font-family: 'Lexend';
          font-size: 14px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
        }
        :global(div) {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          flex: 1;
          :global(.label),
          :global(.value) {
            flex: 1;
          }
          :global(.label) {
            text-align: right;
          }
          :global(.value) {
            color: var(--text_1);
          }
        }
      }
    }
    :global(.result) {
      margin-top: 1.5rem;
      border-top: 1px solid var(--fill_line_1);
      padding: 1.5rem 0 0;
      display: flex;
      gap: 1.5rem;
      flex-direction: column;
      :global(div) {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 24px;
        font-family: 'Lexend';
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 150%; /* 21px */
      }
      :global(.label) {
        color: var(--text_2);
      }
      :global(.value) {
        color: var(--text_1);
      }
    }
  }
`;
