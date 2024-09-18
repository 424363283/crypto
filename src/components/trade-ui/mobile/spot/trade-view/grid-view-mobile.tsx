import CommonIcon from '@/components/common-icon';
import { BottomModal, MobileModal } from '@/components/mobile-modal';
import { ACCOUNT_TYPE, TransferModal } from '@/components/modal';
import { ResultModal } from '@/components/spot-strategy-result-modal';
import Slider from '@/components/trade-ui/trade-view/components/slider';
import { NS } from '@/components/trade-ui/trade-view/spot';
import { BaseModalStyle } from '@/components/trade-ui/trade-view/spot-strategy/components/base-modal-style';
import { CreateConfirmModal } from '@/components/trade-ui/trade-view/spot-strategy/components/create-grid-confirm-modal';
import GridInput from '@/components/trade-ui/trade-view/spot-strategy/components/input';
import { postTradeCreateGridStrategyApi } from '@/core/api';
import { FORMULAS } from '@/core/formulas';
import { useRouter, useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { SUBSCRIBE_TYPES, useWs } from '@/core/network';
import { CREATE_TYPE, GridAiItem, LIST_TYPE, Spot } from '@/core/shared';
import { useAppContext } from '@/core/store';
import { getActive, toFixedCeil } from '@/core/utils';
import { Dropdown, Switch, Tooltip, message } from 'antd';
import { MenuProps } from 'antd/lib';
import { useCallback, useEffect, useMemo, useState } from 'react';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';
import { StrategySelect } from './strategy-select';

const Strategy = Spot.Strategy;
const Trade = Spot.Trade;

export const GridViewMobile = () => {
  const enableLite = process.env.NEXT_PUBLIC_LITE_ENABLE === 'true';
  const {
    selectType,
    createType,
    currentQuoteInfo,
    balance,
    aiList,
    baseCoin,
    symbolList,
    mobileStrategyModalVisible,
  } = Strategy.state;
  const { quoteCoin } = Trade.state;

  const router = useRouter();
  const routerId = router.query.id as string;
  const { isLogin } = useAppContext();
  const { isDark } = useTheme();

  const [transferModalVisible, setTransferModalVisible] = useState(false);

  const [strategyState, setStrategyState] = useImmer({
    price: '' as NS,
    minPrice: '' as NS,
    maxPrice: '' as NS,
    lowPrice: '' as NS,
    highPrice: '' as NS,
    gridCount: '' as NS,
    gridLowProfit: '' as NS,
    gridHighProfit: '' as NS,
    investmentMinMoney: 0 as NS,
    amount: '' as NS,
    collapse: false,
    triggerPrice: '',
    slPrice: '' as NS,
    tpPrice: '' as NS,
    stopSell: true,
    dayIndex: 0,
    gridAiLowProfit: '' as NS,
    gridAiHighProfit: '' as NS,
    aiInvestmentMinMoney: 0 as NS,
    createModalVisible: false,
    confirmModalVisible: false,
    payload: null as any,
    success: false,
  });

  const aiListMemo = useMemo(() => {
    const count = currentQuoteInfo?.countMax || 99;
    return aiList.map((item) => {
      item.gridCount = item.gridCount > count ? count : item.gridCount;
      return item;
    });
  }, [aiList, currentQuoteInfo]);

  const [gridSliderData, setGridSliderData] = useImmer({
    type: 'range',
    step: 1,
    value: 0,
    min: 0,
    max: 100,
  });

  // 实时数据
  useWs(SUBSCRIBE_TYPES.ws4001, (data) => {
    if (data) {
      setStrategyState((draft) => {
        draft.price = data.price;
      });
    }
  });

  useEffect(() => {
    if (aiListMemo.length > 0) {
      const { lowProfit, highProfit } = FORMULAS.SPOT_GRID.getGridProfitRate(
        aiListMemo[strategyState.dayIndex].priceMin,
        aiListMemo[strategyState.dayIndex].priceMax,
        aiListMemo[strategyState.dayIndex].gridCount,
        currentQuoteInfo?.makerRate || 0,
        currentQuoteInfo?.priceScale || 2
      );
      const investmentMinMoney = FORMULAS.SPOT_GRID.getInvestmentMinMoney(
        strategyState.triggerPrice ? strategyState.triggerPrice : strategyState.price,
        aiListMemo[strategyState.dayIndex].priceMin,
        aiListMemo[strategyState.dayIndex].priceMax,
        aiListMemo[strategyState.dayIndex].gridCount,
        currentQuoteInfo?.factor || 0,
        currentQuoteInfo?.priceScale || 2
      );

      setStrategyState((draft) => {
        draft.gridAiLowProfit = lowProfit.mul(100).toFormat(2) + '%';
        draft.gridAiHighProfit = highProfit.mul(100).toFormat(2) + '%';
        draft.aiInvestmentMinMoney = investmentMinMoney;
      });
    }
  }, [aiListMemo, strategyState.dayIndex, currentQuoteInfo, strategyState.price, strategyState.triggerPrice]);

  useEffect(() => {
    if (strategyState.lowPrice !== '' && strategyState.highPrice !== '' && strategyState.gridCount !== '') {
      const { lowProfit, highProfit } = FORMULAS.SPOT_GRID.getGridProfitRate(
        strategyState.lowPrice,
        strategyState.highPrice,
        Number(strategyState.gridCount),
        currentQuoteInfo?.makerRate || 0,
        currentQuoteInfo?.priceScale || 2
      );

      setStrategyState((draft) => {
        draft.gridLowProfit = lowProfit;
        draft.gridHighProfit = highProfit;
      });
    } else {
      setStrategyState((draft) => {
        draft.gridLowProfit = '';
        draft.gridHighProfit = '';
      });
    }
  }, [strategyState.gridCount, strategyState.lowPrice, strategyState.highPrice, currentQuoteInfo]);

  useEffect(() => {
    if (strategyState.lowPrice !== '' && strategyState.highPrice !== '' && strategyState.gridCount !== '') {
      const investmentMinMoney = FORMULAS.SPOT_GRID.getInvestmentMinMoney(
        strategyState.triggerPrice ? strategyState.triggerPrice : strategyState.price,
        strategyState.lowPrice,
        strategyState.highPrice,
        Number(strategyState.gridCount),
        currentQuoteInfo?.factor || 0,
        currentQuoteInfo?.priceScale || 2
      );

      setStrategyState((draft) => {
        if (currentQuoteInfo) {
          draft.investmentMinMoney =
            Number(investmentMinMoney) > Number(currentQuoteInfo?.amountMin)
              ? investmentMinMoney
              : currentQuoteInfo?.amountMin;
        } else {
          draft.investmentMinMoney = investmentMinMoney;
        }
      });
    }
  }, [
    strategyState.price,
    strategyState.gridCount,
    strategyState.lowPrice,
    strategyState.highPrice,
    currentQuoteInfo,
    strategyState.triggerPrice,
  ]);

  const onGridSliderChanged = useCallback(
    (val: number) => {
      setGridSliderData((draft) => {
        draft.value = val;
      });

      if (isLogin) {
        setStrategyState((draft) => {
          draft.amount = balance.mul(val).div(100);
        });
      }
    },
    [balance, isLogin]
  );

  const items: MenuProps['items'] = useMemo(() => {
    return symbolList.map((item) => {
      return {
        id: item.symbol,
        key: item.symbol,
        label: (
          <div
            className={getActive(item.symbol === routerId)}
            onClick={() => {
              setStrategyState((draft) => {
                draft.lowPrice = '';
                draft.highPrice = '';
                draft.gridCount = '';
                draft.amount = '';
                draft.triggerPrice = '';
                draft.tpPrice = '';
                draft.slPrice = '';
                draft.investmentMinMoney = '';
              });
              setGridSliderData((draft) => {
                draft.value = 0;
              });
              router.replace(`/spot/${item.symbol.toLocaleLowerCase()}?from=trading-bot-grid`);
            }}
          >
            <span>{item.symbol.replace('_', '/')}</span>
            {item.symbol === routerId && <CommonIcon name='common-checked-0' size={14} enableSkin />}
          </div>
        ),
      };
    });
  }, [symbolList, routerId]);

  const ExchangeIconMemo = useMemo(() => {
    return (
      <CommonIcon
        name='common-exchange-0'
        width={11}
        height={12}
        className='exchange'
        enableSkin
        onClick={() => {
          if (isLogin) {
            setTransferModalVisible(true);
          } else {
            router.push('/login');
          }
        }}
      />
    );
  }, [isLogin]);

  const gridPercent = useMemo(() => {
    const { value, min, max } = gridSliderData;
    return value ? ((value - min) / (max - min)) * 100 : 0;
  }, [gridSliderData]);

  useEffect(() => {
    setStrategyState((draft) => {
      draft.minPrice = strategyState.price
        .mul(currentQuoteInfo?.priceMinRate || 0)
        .toFixed(currentQuoteInfo?.priceScale);
      draft.maxPrice = strategyState.price
        .mul(currentQuoteInfo?.priceMaxRate || 0)
        .toFixed(currentQuoteInfo?.priceScale);
    });
  }, [strategyState.price, currentQuoteInfo]);

  const onCopyClicked = useCallback(() => {
    Strategy.changeCreateType(CREATE_TYPE.MANUAL);
    setStrategyState((draft) => {
      draft.gridCount = aiListMemo[strategyState.dayIndex]?.gridCount;
      draft.lowPrice = aiListMemo[strategyState.dayIndex]?.priceMin;
      draft.highPrice = aiListMemo[strategyState.dayIndex]?.priceMax;
    });
  }, [aiListMemo, strategyState.dayIndex]);

  const minInvestmentMoney = useMemo(() => {
    const money = createType === CREATE_TYPE.AI ? strategyState.aiInvestmentMinMoney : strategyState.investmentMinMoney;

    return toFixedCeil(money as number, currentQuoteInfo?.priceScale || 3);
  }, [createType, strategyState.aiInvestmentMinMoney, strategyState.investmentMinMoney, currentQuoteInfo]);

  const showProfitError = useMemo(() => {
    if (currentQuoteInfo && strategyState.gridLowProfit) {
      return !(currentQuoteInfo && currentQuoteInfo.profitRate < Number(strategyState.gridLowProfit));
    }
    return false;
  }, [currentQuoteInfo, strategyState.gridHighProfit, strategyState.gridLowProfit]);

  const createDisabled = useMemo(() => {
    if (!isLogin) {
      return true;
    }
    if (createType === CREATE_TYPE.AI) {
      if (Number(strategyState.triggerPrice) >= Number(strategyState?.price)) {
        return false;
      } else if (
        strategyState.tpPrice &&
        (Number(strategyState.tpPrice) < Number(aiListMemo[strategyState.dayIndex]?.priceMax) ||
          Number(strategyState.tpPrice) < Number(strategyState?.price))
      ) {
        return false;
      } else if (
        strategyState.slPrice &&
        (Number(strategyState.slPrice) > Number(aiListMemo[strategyState.dayIndex]?.priceMin) ||
          Number(strategyState.slPrice) > Number(strategyState?.price))
      ) {
        return false;
      } else if (
        strategyState.slPrice &&
        strategyState.triggerPrice &&
        Number(strategyState.slPrice) > Number(strategyState.triggerPrice)
      ) {
        return false;
      } else if (Number(strategyState.amount) < Number(minInvestmentMoney)) {
        return false;
      }
      return strategyState.amount !== '' && Number(strategyState.amount) > Number(minInvestmentMoney);
    } else {
      if (!strategyState.lowPrice || !strategyState.highPrice || !strategyState.gridCount) {
        return false;
      } else if (Number(strategyState.lowPrice) < Number(strategyState.minPrice)) {
        return false;
      } else if (!strategyState.lowPrice && Number(strategyState.highPrice) < Number(strategyState.minPrice)) {
        return false;
      } else if (strategyState.lowPrice && Number(strategyState.highPrice) <= Number(strategyState.lowPrice)) {
        return false;
      } else if (Number(strategyState.triggerPrice) > Number(strategyState?.price)) {
        return false;
      } else if (
        strategyState.tpPrice &&
        (Number(strategyState.tpPrice) < Number(strategyState.highPrice) ||
          Number(strategyState.tpPrice) < Number(strategyState?.price))
      ) {
        return false;
      } else if (
        strategyState.slPrice &&
        (Number(strategyState.slPrice) > Number(strategyState.lowPrice) ||
          Number(strategyState.slPrice) > Number(strategyState?.price))
      ) {
        return false;
      } else if (
        strategyState.slPrice &&
        strategyState.triggerPrice &&
        Number(strategyState.slPrice) > Number(strategyState.triggerPrice)
      ) {
        return false;
      } else if (Number(strategyState.amount) < Number(minInvestmentMoney)) {
        return false;
      } else if (showProfitError) {
        return false;
      }

      return true;
    }
  }, [
    isLogin,
    createType,
    strategyState.amount,
    strategyState.lowPrice,
    strategyState.minPrice,
    strategyState.highPrice,
    strategyState.triggerPrice,
    strategyState.price,
    strategyState.slPrice,
    strategyState.tpPrice,
    minInvestmentMoney,
    showProfitError,
  ]);

  const onCreateClicked = () => {
    if (!isLogin) {
      router.push('/login');
    } else {
      let params: any = {
        symbol: routerId,
        type: 1,
        amount: Number(strategyState.amount),
        stopSell: strategyState.stopSell,
      };
      if (createType === CREATE_TYPE.AI) {
        params.gridCount = aiListMemo[strategyState.dayIndex]?.gridCount;
        params.priceMin = aiListMemo[strategyState.dayIndex]?.priceMin;
        params.priceMax = aiListMemo[strategyState.dayIndex]?.priceMax;
      } else {
        params.gridCount = Number(strategyState.gridCount);
        params.priceMin = Number(strategyState.lowPrice);
        params.priceMax = Number(strategyState.highPrice);
      }

      if (Number(params.priceMax) <= Number(params.priceMin)) {
        message.error(LANG('最高价格必须高于最低价格'));
        return;
      }

      if (Number(params.amount) > Number(balance)) {
        message.error(LANG('可用余额不足'));
        return;
      }

      if (strategyState.slPrice) {
        params.slPrice = strategyState.slPrice;
      }
      if (strategyState.tpPrice) {
        params.tpPrice = strategyState.tpPrice;
      }
      if (strategyState.triggerPrice) {
        params.triggerPrice = strategyState.triggerPrice;
      }
      setStrategyState((draft) => {
        draft.createModalVisible = true;
        draft.payload = { ...params };
      });
    }
  };

  const onConfirmCreate = () => {
    try {
      postTradeCreateGridStrategyApi(strategyState?.payload).then(({ code, message: msg }) => {
        if (code === 200) {
          setStrategyState((draft) => {
            draft.createModalVisible = false;
            draft.confirmModalVisible = true;
            draft.success = true;
          });
          Strategy.getBalance();
          Strategy.changeMobileStrategyModalVisible(false);
        } else {
          message.error(msg);
          setStrategyState((draft) => {
            draft.createModalVisible = false;
            draft.confirmModalVisible = true;
            draft.success = false;
          });
        }
      });
    } catch (err) {}
  };

  const onCreateModalClose = () => {
    setStrategyState((draft) => {
      draft.createModalVisible = false;
    });
  };

  const onConfirmModalClose = () => {
    setStrategyState((draft) => {
      draft.confirmModalVisible = false;
    });
  };

  const maxInvestmentMoney = useMemo(() => {
    return Math.min(currentQuoteInfo?.amountMax || 0, Number(balance));
  }, [currentQuoteInfo, balance]);

  const modalTitle = useMemo(() => {
    switch (selectType) {
      case LIST_TYPE.GRID:
        return LANG('现货网格');
      case LIST_TYPE.INVEST:
        return LANG('现货定投');
    }
    return '';
  }, [selectType]);

  return (
    <>
      <CreateConfirmModal
        open={strategyState.createModalVisible}
        onClose={onCreateModalClose}
        onOk={onConfirmCreate}
        baseCoin={baseCoin}
        quoteCoin={quoteCoin}
        priceMin={strategyState.payload?.priceMin}
        priceMax={strategyState.payload?.priceMax}
        scale={currentQuoteInfo?.priceScale || 2}
        gridCount={strategyState.payload?.gridCount}
        gridLowProfit={
          createType === CREATE_TYPE.AI
            ? strategyState.gridAiLowProfit
            : strategyState.gridLowProfit.mul(100).toFixed(2) + '%'
        }
        gridHighProfit={
          createType === CREATE_TYPE.AI
            ? strategyState.gridAiHighProfit
            : strategyState.gridHighProfit.mul(100).toFixed(2) + '%'
        }
        triggerPrice={strategyState.payload?.triggerPrice}
        tpPrice={strategyState.payload?.tpPrice}
        slPrice={strategyState.payload?.slPrice}
        stopSell={strategyState.payload?.stopSell}
        amount={strategyState.payload?.amount}
      />
      {transferModalVisible && (
        <TransferModal
          defaultSourceAccount={ACCOUNT_TYPE.SPOT}
          defaultTargetAccount={enableLite ? ACCOUNT_TYPE.LITE : ACCOUNT_TYPE.SWAP_U}
          open={transferModalVisible}
          onCancel={() => setTransferModalVisible(false)}
          onTransferDone={() => Trade.getBalance()}
          inMobile
        />
      )}
      <ResultModal
        open={strategyState.confirmModalVisible}
        onClose={onConfirmModalClose}
        isSuccess={strategyState.success}
        onOk={strategyState.success ? () => {} : onConfirmModalClose}
        type='grid'
      />
      <MobileModal
        visible={mobileStrategyModalVisible}
        onClose={() => Strategy.changeMobileStrategyModalVisible(false)}
        type='bottom'
      >
        <BottomModal
          renderTitle={() =>
            selectType === null ? (
              LANG('策略')
            ) : (
              <button className='btn' onClick={() => Strategy.changeSelectType(null)}>
                <CommonIcon name='common-grid-arrow-left-0' size={12} />
                {modalTitle}
              </button>
            )
          }
          displayConfirm={selectType !== null}
          confirmText={isLogin ? LANG('创建网格') : LANG('登录后创建')}
          disabledConfirm={!createDisabled}
          className='strategy-modal'
          onConfirm={onCreateClicked}
        >
          <StrategySelect />
          {selectType === LIST_TYPE.GRID && (
            <div className='strategy-container'>
              <div className='quote-select-container'>
                <Dropdown
                  menu={{ items }}
                  trigger={['click']}
                  placement='bottom'
                  autoAdjustOverflow={false}
                  overlayClassName='quote-select-menu'
                >
                  <div className='quote-select'>
                    <span>{routerId.replace('_', '/')}</span>
                    <CommonIcon name='common-arrow-down-0' size={14} />
                  </div>
                </Dropdown>
              </div>
              <div className='type-group'>
                <button
                  className={getActive(createType === CREATE_TYPE.AI)}
                  onClick={() => Strategy.changeCreateType(CREATE_TYPE.AI)}
                >
                  {LANG('AI策略')}
                </button>
                <button
                  className={getActive(createType === CREATE_TYPE.MANUAL)}
                  onClick={() => Strategy.changeCreateType(CREATE_TYPE.MANUAL)}
                >
                  {LANG('手动创建')}
                </button>
              </div>
              {createType === CREATE_TYPE.AI ? (
                <div className='ai-wrapper'>
                  <div className='tips'>
                    <CommonIcon name='common-spot-tips-0' size={12} enableSkin />
                    {LANG('AI推荐参数，是通过行情数据回测产生的，请您谨慎使用！')}
                  </div>
                  <div className='time-group'>
                    <div className='label'>{LANG('回测时长')}</div>
                    <div className='time-btns'>
                      {aiListMemo.map((item: GridAiItem, index) => (
                        <button
                          key={item.id}
                          className={getActive(strategyState.dayIndex === index)}
                          onClick={() =>
                            setStrategyState((draft) => {
                              draft.dayIndex = index;
                              draft.amount = '';
                            })
                          }
                        >
                          {item.days}
                          {LANG('天')}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className='label-item'>
                    <div>{LANG('最低价格')}</div>
                    <div>
                      {aiListMemo[strategyState.dayIndex]?.priceMin.toFormat(currentQuoteInfo?.priceScale)} {quoteCoin}
                    </div>
                  </div>
                  <div className='label-item'>
                    <div>{LANG('最高价格')}</div>
                    <div>
                      {aiListMemo[strategyState.dayIndex]?.priceMax.toFormat(currentQuoteInfo?.priceScale)} {quoteCoin}
                    </div>
                  </div>
                  <div className='label-item'>
                    <div>{LANG('网格数量')}</div>
                    <div>{aiListMemo[strategyState.dayIndex]?.gridCount}</div>
                  </div>
                  <div className='label-item'>
                    <div>{LANG('每格利润(已扣除费用)')}</div>
                    {strategyState.gridAiLowProfit !== '' && (
                      <div className='grid-profit'>
                        {strategyState.gridAiLowProfit}-{strategyState.gridAiHighProfit}
                      </div>
                    )}
                  </div>
                  <button className='copy' onClick={onCopyClicked}>
                    {LANG('免费复制到手动创建')}
                  </button>
                </div>
              ) : (
                <>
                  <div className='create-content'>
                    <div className='item'>
                      <div className='label'>{LANG('价格区间')}</div>
                      <div className='price-wrapper'>
                        <GridInput
                          disabled={!isLogin}
                          placeholder={LANG('最低价格')}
                          decimal={currentQuoteInfo?.priceScale}
                          min={Number(strategyState.minPrice)}
                          max={Number(strategyState.maxPrice)}
                          value={strategyState.lowPrice}
                          onChange={(val) =>
                            setStrategyState((draft) => {
                              draft.lowPrice = val;
                            })
                          }
                          errorText={
                            Number(strategyState.lowPrice) <= Number(strategyState.minPrice)
                              ? LANG('最低价格不能低于{price}USDT', { price: strategyState.minPrice })
                              : ''
                          }
                        />
                        <GridInput
                          disabled={!isLogin}
                          placeholder={LANG('最高价格')}
                          decimal={currentQuoteInfo?.priceScale}
                          min={Number(strategyState.minPrice)}
                          max={Number(strategyState.maxPrice)}
                          value={strategyState.highPrice}
                          onChange={(val) =>
                            setStrategyState((draft) => {
                              draft.highPrice = val;
                            })
                          }
                          errorText={() => {
                            if (
                              !strategyState.lowPrice &&
                              Number(strategyState.highPrice) < Number(strategyState.minPrice)
                            ) {
                              return LANG('最高价格不能低于{price}USDT', { price: strategyState.minPrice });
                            } else if (
                              strategyState.lowPrice &&
                              Number(strategyState.highPrice) <= Number(strategyState.lowPrice)
                            ) {
                              return LANG('最高价格必须高于最低价格');
                            }
                            return '';
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className='create-content'>
                    <div className='item'>
                      <div className='label'>{LANG('网格数量')}</div>
                      <div className='price-wrapper grid'>
                        <GridInput
                          disabled={!isLogin}
                          placeholder={`${currentQuoteInfo?.countMin}-${currentQuoteInfo?.countMax}`}
                          min={Number(currentQuoteInfo?.countMin)}
                          max={Number(currentQuoteInfo?.countMax)}
                          value={strategyState.gridCount}
                          onChange={(val) =>
                            setStrategyState((draft) => {
                              draft.gridCount = val;
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className='profit-wrapper'>
                    <div className='tips'>
                      <Tooltip color='#fff' placement='top' title={LANG('每格收益率的估值，已扣除手续费')}>
                        {LANG('每格利润率')}
                      </Tooltip>
                    </div>
                    {strategyState.gridLowProfit !== '' && (
                      <div className='grid-profit'>
                        {strategyState.gridLowProfit.mul(100).toFixed(2)}%-
                        {strategyState.gridHighProfit.mul(100).toFixed(2)}%
                      </div>
                    )}
                  </div>
                  {showProfitError && (
                    <div className='profit-error'>
                      {LANG('每格利润率必须大于{profit}%，请减少网格数量或增大价格区间', {
                        profit: currentQuoteInfo?.profitRate.mul(100),
                      })}
                    </div>
                  )}
                  <div className='divider' />
                </>
              )}
              <div className='amount-wrapper'>
                <div className='label'>{LANG('投入金额')}</div>
                <div className='amount'>
                  <span className='text'>{LANG('可用')}:</span>
                  <div>
                    <span>{`${(isLogin ? balance : 0)?.toFormat()} ${quoteCoin}`}</span>
                    {ExchangeIconMemo}
                  </div>
                </div>
                <div className='amount-input'>
                  <GridInput
                    disabled={!isLogin}
                    placeholder={`${
                      createType === CREATE_TYPE.AI
                        ? strategyState.aiInvestmentMinMoney?.toRound(currentQuoteInfo?.priceScale)
                        : strategyState.investmentMinMoney?.toRound(currentQuoteInfo?.priceScale)
                    } ${LANG('起投')}`}
                    decimal={currentQuoteInfo?.priceScale}
                    max={maxInvestmentMoney}
                    value={strategyState.amount}
                    onChange={(val) => {
                      setStrategyState((draft) => {
                        draft.amount = val;
                      });
                      setGridSliderData((draft) => {
                        draft.value = Number(val.div(maxInvestmentMoney).mul(100).toFixed(0));
                      });
                    }}
                    maxText={LANG('最大')}
                    onMaxTextClicked={() => {
                      setStrategyState((draft) => {
                        draft.amount = maxInvestmentMoney;
                      });
                      setGridSliderData((draft) => {
                        draft.value = 100;
                      });
                    }}
                    errorText={
                      Number(strategyState.amount) < Number(minInvestmentMoney)
                        ? LANG('投入金额应大于或等于{price}USDT', { price: minInvestmentMoney })
                        : ''
                    }
                  />
                </div>
                <div className='slider-wrapper'>
                  <Slider
                    percent={gridPercent}
                    isDark={isDark}
                    grid={5}
                    grids={[0, 25, 50, 75, 100]}
                    onChange={(val: number) => onGridSliderChanged(val)}
                    renderText={() => `${gridSliderData.value}%`}
                    {...gridSliderData}
                  />
                </div>
              </div>
              <div className='divider' />
              <div className='advanced-wrapper'>
                <div
                  className='collapse'
                  onClick={() => {
                    setStrategyState((draft) => {
                      draft.collapse = !draft.collapse;
                    });
                  }}
                >
                  {LANG('高级参数(选填)')}
                  <CommonIcon name='common-sort-down-0' className={getActive(strategyState.collapse)} size={6} />
                </div>
                {strategyState.collapse && (
                  <div>
                    <div className='create-content'>
                      <div className='item'>
                        <div className='label'>{LANG('触发价格')}</div>
                        <div className='price-wrapper'>
                          <GridInput
                            disabled={!isLogin}
                            min={0}
                            decimal={currentQuoteInfo?.priceScale}
                            value={strategyState.triggerPrice}
                            onChange={(val) =>
                              setStrategyState((draft) => {
                                draft.triggerPrice = val;
                              })
                            }
                            errorText={
                              Number(strategyState.triggerPrice) >= Number(strategyState?.price)
                                ? LANG('触发价格必须低于{price}USDT', { price: Number(strategyState?.price) })
                                : ''
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className='create-content'>
                      <div className='item'>
                        <div className='price-label'>
                          <div className='label'>{LANG('止盈价格')}</div>
                          <div className='label'>{LANG('止损价格')}</div>
                        </div>
                        <div className='price-wrapper'>
                          <GridInput
                            placeholder={LANG('止盈价格')}
                            min={0}
                            decimal={currentQuoteInfo?.priceScale}
                            value={strategyState.tpPrice}
                            onChange={(val) =>
                              setStrategyState((draft) => {
                                draft.tpPrice = val;
                              })
                            }
                            errorText={() => {
                              const highPrice =
                                createType === CREATE_TYPE.AI
                                  ? aiListMemo[strategyState.dayIndex]?.priceMax
                                  : strategyState.highPrice;
                              if (
                                strategyState.tpPrice &&
                                (Number(strategyState.tpPrice) <= Number(highPrice) ||
                                  Number(strategyState.tpPrice) <= Number(strategyState?.price))
                              ) {
                                return LANG('止盈价格必须高于最高价和最新价');
                              }
                              return '';
                            }}
                          />
                          <GridInput
                            placeholder={LANG('止损价格')}
                            min={0}
                            decimal={currentQuoteInfo?.priceScale}
                            value={strategyState.slPrice}
                            onChange={(val) =>
                              setStrategyState((draft) => {
                                draft.slPrice = val;
                              })
                            }
                            errorText={() => {
                              const lowPrice =
                                createType === CREATE_TYPE.AI
                                  ? aiListMemo[strategyState.dayIndex]?.priceMin
                                  : strategyState.lowPrice;
                              if (
                                strategyState.slPrice &&
                                (Number(strategyState.slPrice) >= Number(lowPrice) ||
                                  Number(strategyState.slPrice) >= Number(strategyState?.price))
                              ) {
                                return LANG('止损价格必须低于最低价和最新价');
                              } else if (
                                strategyState.slPrice &&
                                strategyState.triggerPrice &&
                                Number(strategyState.slPrice) >= Number(strategyState.triggerPrice)
                              ) {
                                return LANG('止损价格必须低于触发价格');
                              }
                              return '';
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className='divider' />
                    <div className='radio-wrapper'>
                      <div className='text'>{LANG('停止时卖出所有基础币')}</div>
                      <Switch
                        checked={strategyState.stopSell}
                        onChange={(checked) => {
                          setStrategyState((draft) => {
                            draft.stopSell = checked;
                          });
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </BottomModal>
      </MobileModal>
      <BaseModalStyle />
      <style jsx>{styles}</style>
    </>
  );
};

const styles = css`
  :global(.strategy-modal) {
    .btn {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 26px;
      border-radius: 8px;
      background-color: var(--theme-background-color-3-2);
      border: none;
      color: var(--theme-font-color-3);
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
      :global(img) {
        margin-right: 5px;
      }
    }
  }
  .strategy-container {
    max-height: 60vh;
    overflow: auto;
    .quote-select-container {
      margin: 10px 0;
      margin-top: 14px;
      cursor: pointer;
      :global(.quote-select) {
        height: 38px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: var(--theme-tips-color);
        border-radius: 8px;
        padding: 0 10px;
        color: var(--theme-font-color-1);
      }
    }
  }
  .type-group {
    margin-top: 14px;
    height: 30px;
    display: flex;
    align-items: center;
    padding: 2px 3px;
    border-radius: 8px;
    background-color: var(--theme-background-color-2-3);
    button {
      flex: 1;
      background-color: transparent;
      border: none;
      color: var(--theme-font-color-3);
      font-size: 12px;
      font-weight: 500;
      height: 24px;
      border-radius: 8px;
      cursor: pointer;
      &.active {
        background-color: var(--skin-primary-color);
        color: var(--skin-font-color);
      }
    }
  }
  .ai-wrapper {
    .tips {
      margin-top: 10px;
      margin-bottom: 18px;
      display: flex;
      align-items: center;
      color: var(--theme-font-color-3);
      :global(img) {
        margin-right: 5px;
      }
    }
    .time-group {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      .label {
        font-size: 12px;
        color: var(--theme-font-color-3);
      }
      .time-btns {
        display: flex;
        align-items: center;
        button {
          height: 24px;
          padding: 0 12px;
          border-radius: 6px;
          margin-left: 6px;
          background-color: var(--theme-background-color-2-3);
          color: var(--theme-font-color-3);
          cursor: pointer;
          font-size: 12px;
          border: 0;
          &.active {
            background-color: var(--skin-primary-color);
            color: var(--skin-font-color);
          }
        }
      }
    }
    .label-item {
      line-height: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      > div {
        &:first-child {
          color: var(--theme-font-color-3);
        }
        &:last-child {
          color: var(--theme-font-color-1);
        }
      }
    }
    .copy {
      margin-bottom: 16px;
      border: 0;
      color: var(--skin-main-font-color);
      font-weight: 500;
      background-color: transparent;
      cursor: pointer;
      padding: 0;
    }
  }
  .create-content {
    margin-top: 15px;
    .item {
      .price-label {
        display: flex;
        align-items: center;
      }
      .label {
        flex: 1;
        font-size: 12px;
        font-weight: 500;
        color: var(--theme-font-color-1);
        margin-bottom: 8px;
      }
      .price-wrapper:not(.grid) {
        display: flex;
        width: 100%;
        :global(.container:first-child) {
          margin-right: 6px;
        }
      }
    }
  }
  .profit-wrapper {
    margin: 12px 0;
    color: var(--theme-font-color-3);
    display: flex;
    align-items: center;
    .tips {
      border-bottom: 1px dashed var(--theme-font-color-2);
    }
    .grid-profit {
      flex: 1;
      text-align: right;
    }
  }
  .profit-error {
    font-size: 12px;
    color: var(--color-red);
  }
  .divider {
    height: 1px;
    background-color: var(--theme-border-color-2);
    margin: 12px 0;
  }
  .amount-wrapper {
    .label {
      font-size: 12px;
      font-weight: 500;
      color: var(--theme-font-color-1);
      margin-bottom: 12px;
    }
    .amount {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: var(--theme-font-color-1);
      .text {
        font-size: 12px;
        color: var(--theme-font-color-3);
      }
      :global(img) {
        margin-left: 4px;
        cursor: pointer;
      }
    }
  }
  .amount-input {
    margin-top: 6px;
  }
  .slider-wrapper {
    margin-top: 6px;
  }
  .amount-wrapper + .divider {
    margin-top: 6px;
  }
  .advanced-wrapper {
    .collapse {
      color: var(--theme-font-color-1);
      display: flex;
      align-items: center;
      cursor: pointer;
      width: fit-content;
      :global(img) {
        margin-left: 4px;
        transition: 0.2s;
        transform: rotate(-180deg);
      }
      :global(img.active) {
        transform: rotate(0deg);
      }
    }
  }
  .radio-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .text {
      color: var(--theme-font-color-3);
    }
    :global(.ant-switch-checked) {
      background: var(--skin-color-active) !important;
    }
  }
  :global(.quote-select-menu) {
    :global(ul) {
      max-height: 190px;
      overflow: auto;
      :global(li) {
        height: 38px;
        display: flex;
        align-items: center;
        margin-bottom: 4px !important;
        :global(div) {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      }
      :global(li:has(.active)) {
        color: var(--skin-primary-color) !important;
        background-color: var(--skin-primary-bg-color-opacity-1);
      }
    }
  }
`;
