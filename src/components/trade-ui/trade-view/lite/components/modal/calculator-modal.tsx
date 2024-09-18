import { ModalClose } from '@/components/trade-ui/common/modal';
import Slider from '@/components/trade-ui/trade-view/components/slider';
import { FORMULAS } from '@/core/formulas';
import { useRouter, useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { SUBSCRIBE_TYPES, useWs } from '@/core/network';
import { Account, LiteTradeItem, MarketsMap, PositionSide, TradeMap } from '@/core/shared';
import { Modal } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';
import CalculatorResult, { ResultItem } from '../calculator-result';
import CalculatorInput from '../input/calculator-input';
import QuoteSelect from '../input/quote-select';
import TransactionTypeButton from '../transaction-type-button';

interface Props {
  open: boolean;
  onClose: () => void;
}

const CalculatorModal = ({ open, onClose }: Props) => {
  const { theme, isDark } = useTheme();

  const [sliderData, setSliderData] = useImmer({
    type: 'range',
    step: 1,
    value: 10,
    min: 5,
    max: 50,
  });

  const [liteMap, setLiteMap] = useState<Map<string, LiteTradeItem>>();
  const [liteItem, setLiteItem] = useState<LiteTradeItem>();
  const [marketMap, setMarketMap] = useState<MarketsMap>();

  const id = useRouter().query.id as string;

  const [state, setState] = useImmer({
    selectList: [] as { id: string; name: string }[],
    selectValue: '',
    selectId: '',
    positionSide: PositionSide.LONG,
    margin: '' as number | string,
    opPrice: '' as number | string,
    cpPrice: '' as number | string,
    leverRange: [] as number[],
    marginRange: [] as number[],
    income: '--',
    incomeRate: '--',
  });

  useWs(SUBSCRIBE_TYPES.ws3001, async (detail) => {
    setMarketMap(detail);
  });

  useEffect(() => {
    if (id) {
      TradeMap.getLiteTradeMap().then(async (list) => {
        setLiteMap(list);
        const data = list.get(id);
        if (data) {
          setState((draft) => {
            draft.selectList = [...list.values()]
              .sort((a, b) => a.id.charCodeAt(0) - b.id.charCodeAt(0))
              .map((item) => {
                return {
                  id: item.id,
                  name: item.name,
                };
              });
            draft.selectValue = data?.name;
            draft.selectId = data?.id;
          });
        }
      });
    }
  }, [id]);

  useEffect(() => {
    if (open) {
      onQuoteSelectChange(id);
    }
  }, [open]);

  const initUIState = useCallback(() => {
    setState((draft) => {
      draft.positionSide = PositionSide.LONG;
      draft.margin = '';
      draft.opPrice = '';
      draft.cpPrice = '';
      draft.income = '--';
      draft.incomeRate = '--';
    });
    setSliderData((draft) => {
      draft.value = state.leverRange[0];
    });
  }, [state.leverRange]);

  const onQuoteSelectChange = async (selectId: string) => {
    const data = liteMap?.get(selectId);
    setLiteItem(data);

    if (data) {
      const { lever0List, lever2List, margin0List, margin2List, maxAmountOne } = data;
      const { identityPhotoValid } = (await Account.getUserInfo()) || {};
      const leverList = identityPhotoValid ? lever2List : lever0List;
      const marginList = identityPhotoValid ? margin0List : margin2List;
      setSliderData((draft) => {
        draft.value = leverList[0];
        draft.min = leverList[0];
        draft.max = leverList[leverList.length - 1];
      });
      setState((draft) => {
        draft.leverRange = leverList;
        draft.marginRange = [marginList[0], Math.trunc(Number(maxAmountOne.div(leverList[0])))];
        draft.opPrice = '';
      });
      setState((draft) => {
        draft.selectValue = data?.name;
        draft.selectId = data?.id;
      });
    }
  };

  const isBuy = useMemo(() => {
    return state.positionSide === PositionSide.LONG;
  }, [state.positionSide]);

  const percent = useMemo(() => {
    const { value, min, max } = sliderData;
    return value ? ((value - min) / (max - min)) * 100 : 0;
  }, [sliderData]);

  const onLeverChanged = (val: number) => {
    setSliderData((draft) => {
      draft.value = val;
    });
    if (liteItem) {
      setState((draft) => {
        draft.marginRange = [state.marginRange[0], Math.trunc(Number(liteItem.maxAmountOne.div(val)))];
      });
    }
  };

  const onModalClosed = () => {
    initUIState();
    onClose();
  };

  const canSubmit = useMemo(() => {
    return state.cpPrice && state.opPrice && state.margin;
  }, [state.cpPrice, state.opPrice, state.margin]);

  const onCalculateBtnClicked = useCallback(() => {
    let income = FORMULAS.LITE_POSITION.positionProfitAndLoss(
      isBuy ? PositionSide.LONG : PositionSide.SHORT,
      state.cpPrice,
      state.opPrice,
      sliderData.value,
      state.margin
    );
    const incomeRate = income.div(state.margin).mul(100) || 0;
    setState((draft) => {
      draft.income = income.toFixed(2);
      draft.incomeRate = incomeRate.toFixed(2);
    });
  }, [isBuy, state.cpPrice, state.opPrice, sliderData.value, state.margin]);

  const results: ResultItem[] = useMemo(() => {
    return [
      [LANG('收益'), `${state.income} USDT`],
      [LANG('回报率'), `${state.incomeRate} %`],
    ];
  }, [state.income, state.incomeRate]);

  return (
    <>
      <Modal
        open={open}
        footer={null}
        closeIcon={null}
        onCancel={onModalClosed}
        className='modal'
        closable={false}
        destroyOnClose
      >
        <div className={`modal-content ${theme}`}>
          <div className='title'>
            {LANG('计算器')}
            <ModalClose className='close-icon' onClose={onClose} />
          </div>
          <div className='content'>
            <div className='left'>
              <QuoteSelect
                value={state.selectValue}
                list={state.selectList}
                onChange={onQuoteSelectChange}
                label={LANG('简单合约')}
              />
              <TransactionTypeButton
                positionSide={state.positionSide}
                greenText={LANG('买多')}
                redText={LANG('卖空')}
                onChange={(positionSide) =>
                  setState((draft) => {
                    draft.positionSide = positionSide;
                  })
                }
              />
              <div className={'slider-container'}>
                <Slider
                  percent={percent}
                  isDark={isDark}
                  grid={state.leverRange.length - 1 > 0 ? state.leverRange.length - 1 : 0}
                  grids={state.leverRange}
                  onChange={(val: number) => onLeverChanged(val)}
                  renderText={() => `${sliderData.value}X`}
                  {...sliderData}
                  min={state.leverRange[0]}
                  max={state.leverRange[state.leverRange.length - 1]}
                />
                <div className='slider-label'>
                  {state.leverRange.map((v, i) => {
                    const active = sliderData.value >= v;
                    const left = 100 / (state.leverRange.length - 1);
                    return (
                      <div key={i} style={{ left: `${i * left}%` }} className={`item ${active && 'active'}`}>
                        {v}X
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className='inputContainer'>
                <CalculatorInput
                  isNegative
                  decimal={2}
                  value={state.margin}
                  label={LANG('保证金')}
                  placeholder={`${state.marginRange[0]}~${state.marginRange[1]}`}
                  max={state.marginRange[1]}
                  suffix={<div className='unit'>USDT</div>}
                  onChange={(val) => {
                    setState((draft) => {
                      draft.margin = val;
                    });
                  }}
                  onBlur={() => {
                    if (Number(state.margin) < state.marginRange[0]) {
                      setState((draft) => {
                        draft.margin = state.marginRange[0];
                      });
                    }
                  }}
                />
                <CalculatorInput
                  decimal={4}
                  value={state.opPrice}
                  label={LANG('开仓价')}
                  max={9999999999}
                  suffix={
                    <>
                      <div
                        className='new'
                        onClick={() =>
                          setState((draft) => {
                            draft.opPrice =
                              (marketMap && marketMap[state.selectId]?.price.toFixed(liteItem?.digit)) || 0;
                          })
                        }
                      >
                        {LANG('最新价格')}
                      </div>
                      <div className='unit'>USDT</div>
                    </>
                  }
                  onChange={(val) => {
                    setState((draft) => {
                      draft.opPrice = val;
                    });
                  }}
                  onBlur={() => {
                    if (state.opPrice === '-') {
                      setState((draft) => {
                        draft.opPrice = '';
                      });
                    }
                  }}
                />
                <CalculatorInput
                  decimal={4}
                  value={state.cpPrice}
                  label={LANG('平仓价格')}
                  max={9999999999}
                  suffix={<div className='unit'>USDT</div>}
                  onChange={(val) => {
                    setState((draft) => {
                      draft.cpPrice = val;
                    });
                  }}
                  onBlur={() => {
                    if (state.opPrice === '-') {
                      setState((draft) => {
                        draft.cpPrice = '';
                      });
                    }
                  }}
                />
              </div>
              <button className='btn' disabled={!canSubmit} onClick={onCalculateBtnClicked}>
                {LANG('计算')}
              </button>
            </div>
            <CalculatorResult results={results} />
          </div>
        </div>
      </Modal>
      <style jsx>{styles}</style>
    </>
  );
};

export default CalculatorModal;

const styles = css`
  :global(.modal) {
    width: min-content !important;
    :global(.ant-modal-content) {
      padding: 0;
    }
    .modal-content {
      width: 684px !important;
      padding: 0 !important;
      background: var(--theme-trade-modal-color);
      .title {
        color: var(--theme-font-color-1);
        border-bottom: 1px solid var(--theme-trade-border-color-1);
        padding: 0 30px;
        position: relative;
        white-space: nowrap;
        height: 60px;
        line-height: 60px;
        font-size: 16px;
        font-weight: 500;
        text-align: center;
        :global(.close-icon) {
          cursor: pointer;
          position: absolute;
          top: 10px;
          right: 15px;
        }
      }
      .content {
        display: flex;
        min-height: 402px;
        padding: 18px 30px 32px;
        .left {
          display: flex;
          flex-direction: column;
          width: 315px;
          margin-right: 28px;
          .slider-container {
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            height: 100px;
            .slider-label {
              position: relative;
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              height: 16px;
              .item {
                position: absolute;
                user-select: none;
                margin-left: -3px;
                margin-top: -2px;
                width: 16px;
                white-space: nowrap;
                text-align: center;
                font-size: 12px;
                font-weight: 400;
                color: #656e80;
                display: flex;
                justify-content: center;
                align-items: center;
                &:nth-child(n + 2) {
                  transform: translateX(-50%);
                }
                &:last-child {
                  transform: translateX(-50%);
                }
              }
            }
          }
          .inputContainer {
            margin-top: 19px;
            :global(> input) {
              margin-bottom: 14px;
            }
            .unit {
              white-space: nowrap;
              line-height: 14px;
              font-size: 14px;
              font-weight: 400;
              color: var(--theme-font-color-3);
            }
            .new {
              user-select: none;
              cursor: pointer;
              color: var(--skin-primary-color);
              margin-right: 3px;
            }
          }
          .btn {
            cursor: pointer;
            width: 100%;
            outline: 0;
            border: 0;
            background: var(--skin-primary-color);
            color: var(--theme-font-color-1);
            height: 40px;
            border-radius: 3px;
            line-height: 40px;
            text-align: center;
            font-size: 14px;
            font-weight: 500;
            &:disabled {
              opacity: 0.5;
              cursor: not-allowed;
            }
          }
        }
      }
    }
  }
`;
