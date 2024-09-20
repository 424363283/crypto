import AffiliateSelect from '@/components/affiliate/select';
import CoinLogo from '@/components/coin-logo';
import CommonIcon from '@/components/common-icon';
// import { CreateInvestConfirmModal } from '@/components/create-invest-confirm-modal';
import { BottomModal, MobileModal } from '@/components/mobile-modal';
import { ACCOUNT_TYPE, TransferModal } from '@/components/modal';
// import { ResultModal } from '@/components/spot-strategy-result-modal';
import { BaseModalStyle } from '@/components/trade-ui/trade-view/spot-strategy/components/base-modal-style';
import Input from '@/components/trade-ui/trade-view/spot-strategy/components/input';
// import { INVEST_TIME, INVEST_TIME_MAP } from '@/components/trade-ui/trade-view/spot-strategy/components/invest-view';
import { useCurrencyScale, useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { LIST_TYPE, LoadingType, Spot } from '@/core/shared';
import { useAppContext } from '@/core/store';
import { message } from 'antd';
import { useMemo, useState } from 'react';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';
import { StrategySelect } from './strategy-select';

const { Strategy, Trade, Position } = Spot;

export const InvestViewMobile = () => {
  const enableLite = process.env.NEXT_PUBLIC_LITE_ENABLE === 'true';
  const { isLogin } = useAppContext();
  const router = useRouter();
  const { scale } = useCurrencyScale('USDT');

  const { selectType, mobileStrategyModalVisible, balance, investSymbolList, investSymbolMap } = Strategy.state;
  const [transferModalVisible, setTransferModalVisible] = useState(false);
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [success, setSuccess] = useState(false);

  const [editModalData, setEditModalData] = useImmer({
    visible: false,
    transferModalVisible: false,
    symbols: [] as {
      symbol: string;
      amount: number | string;
    }[],
    symbolStringList: [] as string[],
    title: '',
    period: 4,
  });

  const modalTitle = useMemo(() => {
    switch (selectType) {
      case LIST_TYPE.GRID:
        return LANG('现货网格');
      case LIST_TYPE.INVEST:
        return LANG('现货定投');
    }
    return '';
  }, [selectType]);

  const oneCycleTotal = useMemo(() => {
    return editModalData.symbols.reduce((total, item) => {
      return total + Number(item.amount);
    }, 0);
  }, [editModalData.symbols]);

  const onCreateClicked = () => {
    if (editModalData.symbols.length === 0) {
      message.error(LANG('请选择定投币种'));
      return;
    } else if (editModalData.symbols.some((item) => Number(item.amount) === 0)) {
      message.error(LANG('请输入定投金额'));
      return;
    } else if (oneCycleTotal > balance) {
      message.error(LANG('余额不足'));
    }
    setConfirmModalVisible(true);
  };

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

  const onConfirmClicked = async () => {
    const { title, period, symbols, symbolStringList } = editModalData;
    if (symbols.length === 0) {
      message.error(LANG('请选择定投币种'));
      return;
    } else if (symbols.some((item) => Number(item.amount) === 0)) {
      message.error(LANG('请输入定投金额'));
      return;
    } else if (oneCycleTotal > balance) {
      message.error(LANG('余额不足'));
      return;
    }

    const stringList = symbolStringList.map((str) => str.split('_')[0]);
    let newTitle = '';
    if (stringList.length <= 2) {
      newTitle = `${stringList.join(',')}${LANG('定投策略')}`;
    }
    if (stringList.length > 2) {
      newTitle = `${stringList.slice(0, 3).join(',')}...${LANG('定投组合')}`;
    }

    const payload = {
      title: title ? title : newTitle,
      period,
      symbols,
    };

    const result = await Strategy.createInvest(payload);
    if (result.code === 200) {
      setSuccess(true);
      Strategy.getBalance();
      Position.fetchSpotInvestPositionList(LoadingType.Hide);
    } else {
      setSuccess(false);
    }
    setConfirmModalVisible(false);
    setResultModalVisible(true);
    Strategy.changeMobileStrategyModalVisible(false);
  };

  const onDeleteCoinClicked = (index: number) => {
    setEditModalData((draft) => {
      draft.symbols.splice(index, 1);
      draft.symbolStringList.splice(index, 1);
    });
  };

  const onAddCoinClicked = () => {
    const list = investSymbolList.filter((item: any) => !editModalData.symbolStringList.includes(item.symbol));
    setEditModalData((draft) => {
      draft.symbols.push({
        symbol: list[0].symbol,
        amount: '',
      });
      draft.symbolStringList.push(list[0].symbol);
    });
  };

  const renderContent = () => {
    return (
      <>
        <div className='copy-content'>
          <div className='invest-setting'>
            <div className='base-coin-wrapper'>
              <CoinLogo coin='USDT' width={18} height={18} alt='base-coin' />
              USDT
            </div>
            <div className='balance-wrapper'>
              <span className='text'>{LANG('可用')}</span>
              <div>
                <span>{`${(isLogin ? balance : 0)?.toFormat()} USDT`}</span>
                {ExchangeIconMemo}
              </div>
            </div>
            <div className='select-coin-wrapper'>
              <div className='title'>{LANG('选择币种')}</div>
              <ul className='invest-coin-list'>
                {editModalData.symbols.map((item, index: number) => (
                  <li key={item.symbol + index}>
                    <AffiliateSelect
                      value={item.symbol}
                      onChange={(val) =>
                        setEditModalData((draft) => {
                          draft.symbols[index].symbol = val as string;
                          draft.symbols[index].amount = '';
                          draft.symbolStringList[index] = val as string;
                        })
                      }
                      list={investSymbolList
                        .filter((i) => !editModalData.symbolStringList.includes(i.symbol) || i.symbol === item.symbol)
                        .map((i: any) => ({ value: i.symbol, label: i?.baseCoin }))}
                      renderItem={(item2) => (
                        <>
                          <CoinLogo coin={item2.label} width='18' height='18' alt={item2.label} />
                          <span>{item2.label}</span>
                        </>
                      )}
                    />
                    <div className='amount-wrapper'>
                      <Input
                        max={investSymbolMap.get(item.symbol)?.amountMax}
                        decimal={scale}
                        onChange={(val) =>
                          setEditModalData((draft) => {
                            draft.symbols[index].amount = val;
                          })
                        }
                        placeholder={`${investSymbolMap.get(item.symbol)?.amountMin} - ${
                          investSymbolMap.get(item.symbol)?.amountMax
                        }`}
                        value={item.amount}
                        onBlur={() => {
                          const min = investSymbolMap.get(item.symbol)?.amountMin || 0;
                          if (Number(editModalData.symbols[index].amount) < min) {
                            setEditModalData((draft) => {
                              draft.symbols[index].amount = min;
                            });
                          }
                        }}
                      />
                      <span>USDT</span>
                    </div>
                    <button className='delete-btn' onClick={() => onDeleteCoinClicked(index)}>
                      <CommonIcon name='common-delete-0' size={16} />
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    className='add-coin'
                    onClick={onAddCoinClicked}
                    disabled={editModalData?.symbols.length >= 10}
                  >
                    <CommonIcon
                      name={editModalData?.symbols.length >= 10 ? 'common-plus-round-0' : 'common-wallet-create-0'}
                      size={12}
                      enableSkin
                    />
                    {LANG('添加币种')}
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className='invest-info-wrapper'>
            <div className='cycle-title'>{LANG('定投间隔')}</div>
            <AffiliateSelect
              value={editModalData.period}
              onChange={(val) =>
                setEditModalData((draft) => {
                  draft.period = val as number;
                })
              }
              list={[]}
            />
            <div className='label'>
              {LANG('每期总额')}
              <span>{oneCycleTotal} USDT</span>
            </div>
            <div className='label'>
              {LANG('预计可投次数')}
              <span>{oneCycleTotal === 0 ? '--' : Math.floor(Number(balance.div(oneCycleTotal)))}</span>
            </div>
            <div className='title-wrapper'>
              <div className='title'>
                {LANG('策略标题')}
                <span>({LANG('选填')})</span>
              </div>
              <input
                type='text'
                maxLength={20}
                placeholder={LANG('最多{num}个字符', { num: 20 })}
                value={editModalData.title}
                onChange={(e) => {
                  setEditModalData((draft) => {
                    draft.title = e.target.value;
                  });
                }}
              />
            </div>
          </div>
        </div>
        <style jsx>{`
          .copy-content {
            padding-top: 14px;
            max-height: 60vh;
            overflow: auto;
            .invest-setting {
              .base-coin-wrapper {
                margin-top: 6px;
                height: 38px;
                display: flex;
                align-items: center;
                background-color: var(--theme-background-color-disabled-light);
                padding: 0 12px;
                font-weight: 600;
                color: var(--theme-font-color-1);
                border-radius: 6px;
                :global(img) {
                  margin-right: 6px;
                }
              }
              .balance-wrapper {
                margin-top: 10px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                color: var(--theme-font-color-1);
                .text {
                  color: var(--theme-font-color-2);
                }
                :global(img) {
                  margin-left: 4px;
                  cursor: pointer;
                }
              }
              .select-coin-wrapper {
                .title {
                  color: var(--theme-font-color-1);
                  margin-top: 10px;
                  margin-bottom: 6px;
                }
                .invest-coin-list {
                  padding: 0;
                  margin-top: 16px;
                  margin-bottom: 0;
                  li {
                    display: flex;
                    align-items: center;
                    margin-top: 10px;
                    :global(.input-wrapper) {
                      background-color: transparent;
                      :global(input) {
                        background-color: transparent;
                        border: none;
                      }
                    }
                    .amount-wrapper {
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                      flex: 1;
                      background-color: var(--theme-background-color-disabled-light);
                      height: 38px;
                      margin-left: 12px;
                      border-radius: 6px;
                      padding-left: 8px;
                      padding-right: 18px;
                      color: var(--theme-font-color-1);
                    }
                    .delete-btn {
                      margin-left: 12px;
                      height: 38px;
                      width: 40px;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      border: 1px solid var(--theme-border-color-1);
                      border-radius: 6px;
                      cursor: pointer;
                      background-color: transparent;
                    }
                    .add-coin {
                      width: 100%;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      border: 1px solid var(--skin-main-font-color);
                      height: 38px;
                      cursor: pointer;
                      background-color: transparent;
                      border-radius: 6px;
                      color: var(--skin-main-font-color);
                      &:disabled {
                        cursor: not-allowed;
                        border-color: var(--theme-border-color-1);
                        color: var(--theme-font-color-2);
                      }
                      :global(img) {
                        margin-right: 3px;
                      }
                    }
                  }
                }
              }
            }
            .invest-info-wrapper {
              margin-top: 10px;
              .cycle-title {
                color: var(--theme-font-color-1);
                margin-bottom: 8px;
              }
              :global(.ant-select-single) {
                width: 100%;
              }
              :global(.ant-select-selector) {
                width: 100%;
              }
              .label {
                color: var(--theme-font-color-3);
                margin-top: 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                span {
                  color: var(--theme-font-color-1);
                }
                &:last-child {
                  margin-top: 8px;
                }
              }
              .title-wrapper {
                margin-top: 19px;
                margin-bottom: 10px;
                .title {
                  color: var(--theme-font-color-1);
                  span {
                    color: var(--theme-font-color-3);
                  }
                }
                input {
                  margin-top: 8px;
                  height: 38px;
                  width: 100%;
                  background-color: var(--theme-background-color-disabled-light);
                  border: none;
                  padding: 0 12px;
                  border-radius: 8px;
                  color: var(--theme-font-color-1);
                }
              }
            }
            :global(.container) {
              padding-left: 0;
            }
            :global(.ant-select-single) {
              height: 38px;
            }
            :global(.ant-select-selector) {
              width: 100px;
              background-color: var(--theme-background-color-disabled-light);
              height: 38px;
            }
          }
        `}</style>
      </>
    );
  };

  return (
    <>
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
      {/* <ResultModal
        type='invest'
        open={resultModalVisible}
        onClose={() => setResultModalVisible(false)}
        isSuccess={success}
        onOk={success ? () => {} : () => setResultModalVisible(false)}
      /> */}
      {/* <CreateInvestConfirmModal
        open={confirmModalVisible}
        onClose={() => setConfirmModalVisible(false)}
        onOk={onConfirmClicked}
        periodLabel={[][editModalData.period]}
        symbols={editModalData.symbols}
        oneCycleTotal={oneCycleTotal}
      /> */}
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
          confirmText={isLogin ? LANG('创建定投') : LANG('登录后创建')}
          className='strategy-modal'
          onConfirm={onCreateClicked}
        >
          <StrategySelect />
          {selectType === LIST_TYPE.INVEST && renderContent()}
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
`;
