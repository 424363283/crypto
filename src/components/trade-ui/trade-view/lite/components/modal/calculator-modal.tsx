import { ModalClose } from '@/components/trade-ui/common/modal';
import Slider from '@/components/trade-ui/trade-view/components/slider';
import { FORMULAS } from '@/core/formulas';
import { useRouter, useTheme, useResponsive } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { SUBSCRIBE_TYPES, useWs } from '@/core/network';
import { Account, LiteTradeItem, MarketsMap, PositionSide, TradeMap } from '@/core/shared';
import { Modal as AntModal } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';
import CalculatorResult, { ResultItem } from '../calculator-result';
import CalculatorInput from '../input/calculator-input';
import QuoteSelect from '../input/quote-select';
import TransactionTypeButton from '../transaction-type-button';
import Modal, { ModalFooter, ModalTitle } from '@/components/trade-ui/common/modal';
import { Button } from '@/components/button';
import { Layer, Size } from '@/components/constants';
import { BottomModal, MobileModal } from '@/components/mobile-modal';

import { MediaInfo } from '@/core/utils';

interface Props {
  open: boolean;
  onClose: () => void;
}

const CalculatorModal = ({ open, onClose }: Props) => {
  const { theme, isDark } = useTheme();
  const { isMobile } = useResponsive();

  const [sliderData, setSliderData] = useImmer({
    type: 'range',
    step: 1,
    value: 10,
    min: 5,
    max: 50
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
    incomeRate: '--'
  });

  useWs(SUBSCRIBE_TYPES.ws3001, async detail => {
    setMarketMap(detail);
  });

  useEffect(() => {
    if (id) {
      TradeMap.getLiteTradeMap().then(async list => {
        setLiteMap(list);
        const data = list?.get(id);
        if (data) {
          setState(draft => {
            draft.selectList = [...list.values()]
              .sort((a, b) => a.id.charCodeAt(0) - b.id.charCodeAt(0))
              .map(item => {
                return {
                  id: item.id,
                  name: item.name
                };
              });
            draft.selectValue = data?.name;
            draft.selectId = data?.quoteCode;
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
    setState(draft => {
      draft.positionSide = PositionSide.LONG;
      draft.margin = '';
      draft.opPrice = '';
      draft.cpPrice = '';
      draft.income = '--';
      draft.incomeRate = '--';
    });
    setSliderData(draft => {
      draft.value = state.leverRange[0];
    });
  }, [state.leverRange]);

  const onQuoteSelectChange = async (selectId: string) => {
    initUIState();
    const data = liteMap?.get(selectId);
    setLiteItem(data);
    if (data) {
      const { lever0List, lever2List, margin0List, margin2List, maxAmountOne } = data;
      const { identityPhotoValid } = (await Account.getUserInfo()) || {};
      const leverList = identityPhotoValid ? lever2List : lever0List;
      const marginList = identityPhotoValid ? margin0List : margin2List;
      setSliderData(draft => {
        draft.value = leverList[0];
        draft.min = leverList[0];
        draft.max = leverList[leverList.length - 1];
      });
      setState(draft => {
        draft.leverRange = leverList;
        draft.marginRange = [marginList[0], marginList[1]];
        draft.opPrice = '';
      });
      setState(draft => {
        draft.selectValue = data?.name;
        draft.selectId = data?.quoteCode;
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
    setSliderData(draft => {
      draft.value = val;
    });
    if (liteItem) {
      setState(draft => {
        const { margin0List, leverList } = liteItem;
        const max = FORMULAS.LITE.maxLevelMargin(margin0List, leverList, val);
        draft.marginRange = [state.marginRange[0], max];
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
    setState(draft => {
      draft.income = income.toFixed(2);
      draft.incomeRate = incomeRate.toFixed(2);
    });
  }, [isBuy, state.cpPrice, state.opPrice, sliderData.value, state.margin]);

  const results: ResultItem[] = useMemo(() => {
    return [
      [LANG('收益'), `${state.income} USDT`],
      [LANG('回报率'), `${state.incomeRate} %`]
    ];
  }, [state.income, state.incomeRate, state.positionSide]);
  const handleChangeSide = (positionSide: any) => {
    initUIState();
    setState(draft => {
      draft.positionSide = positionSide;
    });
  };
  const content = (
    <div className={`calculator-content ${theme}`}>
      <div className="content">
        <div className="left">
          <QuoteSelect
            layer={Layer.Overlay}
            value={state.selectValue}
            list={state.selectList}
            onChange={onQuoteSelectChange}
            label=""
          />
          <TransactionTypeButton
            positionSide={state.positionSide}
            greenText={LANG('买多')}
            redText={LANG('卖空')}
            onChange={handleChangeSide}
          />
          <div className={'slider-container'}>
            <Slider
              railBgColor="var(--fill_3)"
              percent={percent}
              isDark={isDark}
              grid={state.leverRange.length - 1 > 0 ? state.leverRange.length - 1 : 0}
              grids={state.leverRange}
              onChange={(val: number) => onLeverChanged(val)}
              renderText={() => `${sliderData.value}x`}
              renderMarkText={(value: number | string) => `${value}x`}
              {...sliderData}
            />
            {/* <div className='slider-label'>
              {state.leverRange.map((v, i) => {
                const active = sliderData.value >= v;
                const left = 100 / (state.leverRange.length - 1);
                return (
                  <div key={i} style={{ left: `${i * left}%` }} className={`item ${active && 'active'}`}>
                    {v}X
                  </div>
                );
              })}
            </div> */}
          </div>
          <div className="inputContainer">
            <CalculatorInput
              isNegative
              decimal={2}
              value={state.margin}
              label={LANG('保证金')}
              placeholder={`${state.marginRange[0]}~${state.marginRange[1]}`}
              max={state.marginRange[1]}
              suffix={<div className="unit">USDT</div>}
              onChange={val => {
                setState(draft => {
                  draft.margin = val;
                });
              }}
              onBlur={() => {
                if (Number(state.margin) < state.marginRange[0]) {
                  setState(draft => {
                    draft.margin = state.marginRange[0];
                  });
                }
              }}
            />
            <CalculatorInput
              decimal={(liteItem && liteItem?.digit) || 4}
              value={state.opPrice}
              label={LANG('开仓价')}
              max={9999999999}
              suffix={
                <>
                  <div
                    className="new"
                    onClick={() =>
                      setState(draft => {
                        draft.opPrice =
                          (marketMap && Number(marketMap[state.selectId]?.price.toFixed(liteItem?.digit))) || 0;
                      })
                    }
                  >
                    {LANG('最新价格')}
                  </div>
                  <div className="unit">USDT</div>
                </>
              }
              onChange={val => {
                setState(draft => {
                  draft.opPrice = val;
                });
              }}
              onBlur={() => {
                if (state.opPrice === '-') {
                  setState(draft => {
                    draft.opPrice = '';
                  });
                }
              }}
            />
            <CalculatorInput
              decimal={(liteItem && liteItem?.digit) || 4}
              value={state.cpPrice}
              label={LANG('平仓价格')}
              max={9999999999}
              suffix={<div className="unit">USDT</div>}
              onChange={val => {
                setState(draft => {
                  draft.cpPrice = val;
                });
              }}
              onBlur={() => {
                if (state.opPrice === '-') {
                  setState(draft => {
                    draft.cpPrice = '';
                  });
                }
              }}
            />
          </div>
          {!isMobile && (
            <Button type="primary" rounded size={Size.LG} disabled={!canSubmit} onClick={onCalculateBtnClicked}>
              {LANG('计算')}
            </Button>
          )}
        </div>
        <CalculatorResult results={results} />
      </div>
      <style jsx>{styles}</style>
    </div>
  );
  if (isMobile) {
    return (
      <MobileModal visible={open} onClose={onClose} type="bottom">
        <BottomModal
          title={LANG('计算器')}
          confirmText={LANG('计算')}
          onConfirm={onCalculateBtnClicked}
          disabledConfirm={!canSubmit}
        >
          {content}
        </BottomModal>
      </MobileModal>
    );
  }
  return (
    <>
      <Modal
        visible={open}
        className="modal"
        contentClassName={'calculator-modal'}
        modalContentClassName={'calculator-modal-content'}
        onClose={onClose}
      >
        <ModalTitle title={LANG('计算器')} onClose={onModalClosed} />
        {content}
      </Modal>
    </>
  );
  return (
    <>
      <AntModal
        open={open}
        footer={null}
        closeIcon={null}
        onCancel={onModalClosed}
        className="modal"
        closable={false}
        destroyOnClose
      >
        <div className={`calculator-content ${theme}`}>
          <div className="title">
            {LANG('计算器')}
            <ModalClose className="close-icon" onClose={onClose} />
          </div>
          <div className="content">
            <div className="left">
              <QuoteSelect
                layer={Layer.Overlay}
                value={state.selectValue}
                list={state.selectList}
                onChange={onQuoteSelectChange}
              />
              <TransactionTypeButton
                positionSide={state.positionSide}
                greenText={LANG('买多')}
                redText={LANG('卖空')}
                onChange={positionSide =>
                  setState(draft => {
                    draft.positionSide = positionSide;
                  })
                }
              />
              <div className={'slider-container'}>
                <Slider
                  layer={Layer.Overlay}
                  railBgColor="var(--fill_3)"
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
                <div className="slider-label">
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
              <div className="inputContainer">
                <CalculatorInput
                  isNegative
                  decimal={2}
                  value={state.margin}
                  label={LANG('保证金')}
                  placeholder={`${state.marginRange[0]}~${state.marginRange[1]}`}
                  max={state.marginRange[1]}
                  suffix={<div className="unit">USDT</div>}
                  onChange={val => {
                    setState(draft => {
                      draft.margin = val;
                    });
                  }}
                  onBlur={() => {
                    if (Number(state.margin) < state.marginRange[0]) {
                      setState(draft => {
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
                        className="new"
                        onClick={() =>
                          setState(draft => {
                            draft.opPrice =
                              (marketMap && marketMap[state.selectId]?.price.toFixed(liteItem?.digit)) || 0;
                          })
                        }
                      >
                        {LANG('最新价格')}
                      </div>
                      <div className="unit">USDT</div>
                    </>
                  }
                  onChange={val => {
                    setState(draft => {
                      draft.opPrice = val;
                    });
                  }}
                  onBlur={() => {
                    if (state.opPrice === '-') {
                      setState(draft => {
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
                  suffix={<div className="unit">USDT</div>}
                  onChange={val => {
                    setState(draft => {
                      draft.cpPrice = val;
                    });
                  }}
                  onBlur={() => {
                    if (state.opPrice === '-') {
                      setState(draft => {
                        draft.cpPrice = '';
                      });
                    }
                  }}
                />
              </div>
              <Button type="primary" rounded size={Size.XL} disabled={!canSubmit} onClick={onCalculateBtnClicked}>
                {LANG('计算')}
              </Button>
            </div>
            <CalculatorResult results={results} />
          </div>
        </div>
      </AntModal>
      <style jsx>{styles}</style>
    </>
  );
};

export default CalculatorModal;

const styles = css`
  :global(.modal) {
    :global(.calculator-modal) {
      width: 720px !important;
      display: flex;
      flex-direction: column;
      gap: 24px;
      :global(.calculator-modal-content) {
        align-self: stretch;
        padding: 0 !important;
      }
    }
    .calculator-content {
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
        align-items: flex-start;
        gap: 24px;
        @media ${MediaInfo.mobile} {
          flex-direction: column;
          padding: 0 8px;
          gap: 0;
        }
        .left {
          display: flex;
          width: 324px;
          flex-direction: column;
          justify-content: center;
          align-items: stretch;
          gap: 24px;
          @media ${MediaInfo.mobile} {
            width: 100%;
            gap: 1rem;
            :global(.title) {
              padding: 0 16px;
            }
          }
          .slider-container {
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            @media ${MediaInfo.mobile} {
              :global(.slider) {
                margin: 0;
              }
              :global(.ant-slider-horizontal.ant-slider-with-marks.slider-with-marks-label) {
                margin-bottom: 1rem;
              }
            }
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
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            flex-shrink: 0;
            gap: 24px;
            @media ${MediaInfo.mobile} {
              gap: 1rem;
            }
            .unit {
              color: var(--text_2);
              text-align: right;
              font-size: 12px;
              font-style: normal;
              font-weight: 400;
              line-height: normal;
            }
            .new {
              user-select: none;
              cursor: pointer;
              color: var(--text_brand);
              text-align: right;
              font-size: 12px;
              font-style: normal;
              font-weight: 400;
              line-height: normal;
              margin-right: 16px;
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
