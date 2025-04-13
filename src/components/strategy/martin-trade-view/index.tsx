import CommonIcon from '@/components/common-icon';
import { NS } from '@/components/trade-ui/trade-view/spot';
import ExchangeIcon from '@/components/trade-ui/trade-view/spot-pro/components/exchange-icon';
import Input from '@/components/trade-ui/trade-view/spot-pro/components/input';
import { FORMULAS } from '@/core/formulas';
import { LANG } from '@/core/i18n';
import { Account, Spot } from '@/core/shared';
import { formatDefaultText, getActive } from '@/core/utils';
import { useEffect, useMemo, useState } from 'react';
import css from 'styled-jsx/css';
import { Updater } from 'use-immer';

interface Props {
  price: NS;
  setData: Updater<any>;
  setCreateDisabled: (disabled: boolean) => void;
}

const { Strategy, Martin } = Spot;

export const MartinTradeView = ({ price, setData, setCreateDisabled }: Props) => {
  const { balance } = Strategy.state;
  const {
    symbolInfo,
    investAmount,
    advancedVisible,
    martinData: {
      triggerRate,
      tpRate,
      initQuote,
      safetyQuote,
      safetyCount,
      safetyQuoteRate,
      triggerPrice,
      safetyPriceRate,
      slRate,
    },
  } = Martin.state;
  const [isEditing, setIsEditing] = useState(false);

  const isLogin = Account.isLogin;

  useEffect(() => {
    Martin.setAdvancedVisible(
      Number(triggerPrice) > 0 || safetyPriceRate !== 1 || safetyQuoteRate !== 1 || Number(slRate) > 0
    );
  }, []);

  const showInvestAmount = useMemo(() => {
    if (Number(initQuote) < Number(symbolInfo?.initQuoteMin) || Number(initQuote) > Number(symbolInfo?.initQuoteMax)) {
      return false;
    } else if (Number(safetyQuote) < Number(symbolInfo?.safetyQuoteMin)) {
      return false;
    } else if (Number(safetyCount) < 1) {
      return false;
    } else if (
      Number(safetyQuoteRate) < Number(symbolInfo?.safetyQuoteRateMin) ||
      Number(safetyQuoteRate) > Number(symbolInfo?.safetyQuoteRateMax)
    ) {
      return false;
    }
    return true;
  }, [
    initQuote,
    safetyQuote,
    safetyCount,
    safetyQuoteRate,
    symbolInfo?.initQuoteMin,
    symbolInfo?.initQuoteMax,
    symbolInfo?.safetyQuoteMin,
    symbolInfo?.safetyQuoteRateMin,
    symbolInfo?.safetyQuoteRateMax,
  ]);

  const showInvestAmountError = useMemo(() => {
    if (!isLogin || !showInvestAmount) {
      return false;
    }
    return Number(investAmount) > balance;
  }, [showInvestAmount, balance, isLogin, investAmount]);

  const minRateMemo = useMemo(() => {
    return Number(
      FORMULAS.SPOT_MARTIN.getMartinMinRate(Number(triggerRate?.div(100)), Number(safetyPriceRate), Number(safetyCount))
    );
  }, [triggerRate, safetyPriceRate, safetyCount]);

  const showMinRateError = useMemo(() => {
    return minRateMemo >= 1;
  }, [minRateMemo]);

  const showError = useMemo(() => {
    if (!slRate) return false;
    if (Number(slRate) < Number(symbolInfo?.slRateMin.mul(100))) return false;
    return Number(slRate) <= Number(minRateMemo.mul(100));
  }, [minRateMemo, slRate]);

  useEffect(() => {
    let disabled = false;
    if (symbolInfo) {
      const {
        triggerRateMin,
        triggerRateMax,
        tpRateMin,
        initQuoteMin,
        initQuoteMax,
        safetyQuoteMin,
        safetyPriceRateMin,
        safetyPriceRateMax,
        safetyQuoteRateMin,
        safetyQuoteRateMax,
        slRateMin,
        slRateMax,
      } = symbolInfo;
      if (Number(investAmount) > balance) {
        disabled = true;
      } else if (Number(triggerRate) < Number(triggerRateMin.mul(100))) {
        disabled = true;
      } else if (Number(triggerRate) > Number(triggerRateMax.mul(100))) {
        disabled = true;
      } else if (Number(tpRate) < Number(tpRateMin.mul(100))) {
        disabled = true;
      } else if (Number(tpRate) > 300) {
        disabled = true;
      } else if (Number(initQuote) < Number(initQuoteMin)) {
        disabled = true;
      } else if (Number(initQuote) > Number(initQuoteMax)) {
        disabled = true;
      } else if (Number(safetyQuote) < Number(safetyQuoteMin)) {
        disabled = true;
      } else if (Number(safetyCount) < 1) {
        disabled = true;
      } else if (triggerPrice && Number(triggerPrice) >= Number(price)) {
        disabled = true;
      } else if (safetyPriceRate && Number(safetyPriceRate) < Number(safetyPriceRateMin)) {
        disabled = true;
      } else if (safetyPriceRate && Number(safetyPriceRate) > Number(safetyPriceRateMax)) {
        disabled = true;
      } else if (safetyQuoteRate && Number(safetyQuoteRate) < Number(safetyQuoteRateMin)) {
        disabled = true;
      } else if (safetyQuoteRate && Number(safetyQuoteRate) > Number(safetyQuoteRateMax)) {
        disabled = true;
      } else if (slRate && Number(slRate) < Number(slRateMin.mul(100))) {
        disabled = true;
      } else if (slRate && Number(slRate) > Number(slRateMax.mul(100))) {
        disabled = true;
      }

      if (Number(minRateMemo) >= 1) {
        disabled = true;
      }
      if (showError) {
        disabled = true;
      }

      if (safetyQuoteRate === '' || safetyPriceRate === '') {
        disabled = true;
      }

      if (!isLogin) {
        disabled = false;
      }
      setCreateDisabled(disabled);
    }
  }, [
    investAmount,
    balance,
    triggerRate,
    tpRate,
    initQuote,
    safetyQuote,
    safetyCount,
    triggerPrice,
    price,
    safetyPriceRate,
    safetyQuoteRate,
    slRate,
    symbolInfo,
    minRateMemo,
    showError,
    isLogin,
  ]);

  const onSafetyCountMaxBlur = () => {
    setIsEditing(false);
    if (Number(safetyCount) === 1) {
      setData({ safetyPriceRate: 1, safetyQuoteRate: 1 });
    }
  };

  return (
    <>
      <div className='martin-setting'>
        <div className='label'>{LANG('触发条件')}</div>
        <div className='item'>
          <Input
            label={LANG('跌多少加仓')}
            unit='%'
            decimal={2}
            placeholder={`${symbolInfo?.triggerRateMin.mul(100)}-${symbolInfo?.triggerRateMax.mul(100)}`}
            value={triggerRate}
            showError={showError || showMinRateError}
            onChange={(val) => setData({ triggerRate: val })}
            errorText={() => {
              if (Number(triggerRate) < Number(symbolInfo?.triggerRateMin.mul(100))) {
                return (
                  LANG('{name}应大于或等于{num}', {
                    name: LANG('跌多少加仓'),
                    num: symbolInfo?.triggerRateMin.mul(100),
                  }) + '%'
                );
              } else if (Number(triggerRate) > Number(symbolInfo?.triggerRateMax.mul(100))) {
                return (
                  LANG('{name}应小于或等于{num}', {
                    name: LANG('跌多少加仓'),
                    num: symbolInfo?.triggerRateMax.mul(100),
                  }) + '%'
                );
              }
              return '';
            }}
          />
        </div>
        <div className='item'>
          <Input
            label={LANG('赚多少止盈')}
            unit='%'
            decimal={2}
            placeholder={`${symbolInfo?.tpRateMin.mul(100)}-300`}
            value={tpRate}
            onChange={(val) => setData({ tpRate: val })}
            errorText={() => {
              if (Number(tpRate) < Number(symbolInfo?.tpRateMin.mul(100))) {
                return (
                  LANG('{name}应大于或等于{num}', {
                    name: LANG('赚多少止盈'),
                    num: symbolInfo?.tpRateMin.mul(100),
                  }) + '%'
                );
              } else if (Number(tpRate) > 300) {
                return LANG('{name}应小于或等于{num}', { name: LANG('赚多少止盈'), num: 300 }) + '%';
              }
              return '';
            }}
          />
        </div>
        <div className='label amount'>{LANG('投入金额')}</div>
        <div className='item'>
          <Input
            label={LANG('首单金额')}
            unit='USDT'
            decimal={symbolInfo?.priceScale}
            placeholder={`${symbolInfo?.initQuoteMin}-${symbolInfo?.initQuoteMax}`}
            value={initQuote}
            onChange={(val) => setData({ initQuote: val })}
            errorText={() => {
              if (Number(initQuote) < Number(symbolInfo?.initQuoteMin)) {
                return (
                  LANG('{name}应大于或等于{num}', {
                    name: LANG('首单金额'),
                    num: symbolInfo?.initQuoteMin,
                  }) + 'USDT'
                );
              } else if (Number(initQuote) > Number(symbolInfo?.initQuoteMax)) {
                return (
                  LANG('{name}应小于或等于{num}', {
                    name: LANG('首单金额'),
                    num: symbolInfo?.initQuoteMax,
                  }) + 'USDT'
                );
              }
              return '';
            }}
          />
        </div>
        <div className='item'>
          <Input
            label={LANG('加仓单金额')}
            unit='USDT'
            decimal={symbolInfo?.priceScale}
            placeholder={`≥${symbolInfo?.safetyQuoteMin}`}
            value={safetyQuote}
            onChange={(val) => setData({ safetyQuote: val })}
            errorText={() => {
              if (Number(safetyQuote) < Number(symbolInfo?.safetyQuoteMin)) {
                return (
                  LANG('{name}应大于或等于{num}', {
                    name: LANG('加仓单金额'),
                    num: symbolInfo?.safetyQuoteMin,
                  }) + 'USDT'
                );
              }
              return '';
            }}
          />
        </div>
        <div className='item'>
          <Input
            max={Number(symbolInfo?.safetyCountMax)}
            label={LANG('最大加仓次数')}
            showError={showError || showMinRateError}
            placeholder={`1-${symbolInfo?.safetyCountMax}`}
            value={safetyCount}
            onFocus={() => setIsEditing(true)}
            onChange={(val) => setData({ safetyCount: val })}
            onBlur={onSafetyCountMaxBlur}
            errorText={() => {
              if (Number(safetyCount) < 1) {
                return LANG('{name}应大于或等于{num}', {
                  name: LANG('最大加仓次数'),
                  num: 1,
                });
              }
              return '';
            }}
          />
        </div>
      </div>
      <div className='balance-wrapper'>
        <span className='text'>{LANG('当前投入')}</span>
        {showInvestAmount && (
          <div>
            <span>{formatDefaultText(investAmount)} USDT</span>
          </div>
        )}
      </div>
      {showInvestAmountError && <div className='error-tips'>{LANG('已超出可用资金')}</div>}
      <div className='balance-wrapper'>
        <span className='text'>{LANG('可用')}</span>
        <div>
          <span>{`${(isLogin ? balance : 0)?.toFormat()} USDT`}</span>
          <ExchangeIcon onTransferDone={() => Strategy.getBalance()} />
        </div>
      </div>
      <div
        className={`balance-wrapper advanced-text ${getActive(advancedVisible)}`}
        onClick={() => Martin.setAdvancedVisible(!advancedVisible)}
      >
        <span className='text'>
          {LANG('高级参数(选填)')}
          <CommonIcon name='common-tiny-triangle-down' size={12} />
        </span>
      </div>
      {advancedVisible && (
        <div className='advanced-wrapper'>
          <Input
            label={LANG('触发价格')}
            unit='USDT'
            decimal={symbolInfo?.priceScale}
            value={triggerPrice}
            onChange={(val) => setData({ triggerPrice: val })}
            errorText={() => {
              if (Number(triggerPrice) >= Number(price)) {
                return (
                  LANG('{name}必须低于{num}', {
                    name: LANG('触发价格'),
                    num: price,
                  }) + 'USDT'
                );
              }
              return '';
            }}
          />
          <Input
            label={LANG('加仓单价差倍数')}
            unit={LANG('倍')}
            decimal={2}
            showError={showError || showMinRateError || safetyPriceRate === ''}
            disabled={safetyCount == 1 && !isEditing}
            placeholder={`${symbolInfo?.safetyPriceRateMin}-${symbolInfo?.safetyPriceRateMax}`}
            value={safetyPriceRate}
            onChange={(val) => setData({ safetyPriceRate: val })}
            allowEmpty
            errorText={() => {
              if (safetyPriceRate === '') {
                return LANG('请输入加仓单价差倍数');
              } else if (Number(safetyPriceRate) < Number(symbolInfo?.safetyPriceRateMin)) {
                return LANG('{name}应大于或等于{num}', {
                  name: LANG('加仓单价差倍数'),
                  num: symbolInfo?.safetyPriceRateMin,
                });
              } else if (Number(safetyPriceRate) > Number(symbolInfo?.safetyPriceRateMax)) {
                return LANG('{name}应小于或等于{num}', {
                  name: LANG('加仓单价差倍数'),
                  num: symbolInfo?.safetyPriceRateMax,
                });
              }
              return '';
            }}
          />
          <Input
            label={LANG('加仓单金额倍数')}
            unit={LANG('倍')}
            decimal={2}
            disabled={safetyCount == 1 && !isEditing}
            placeholder={`${symbolInfo?.safetyQuoteRateMin}-${symbolInfo?.safetyQuoteRateMax}`}
            value={safetyQuoteRate}
            onChange={(val) => setData({ safetyQuoteRate: val })}
            allowEmpty
            showError={safetyQuoteRate === ''}
            errorText={() => {
              if (safetyQuoteRate === '') {
                return LANG('请输入加仓单金额倍数');
              } else if (Number(safetyQuoteRate) < Number(symbolInfo?.safetyQuoteRateMin)) {
                return LANG('{name}应大于或等于{num}', {
                  name: LANG('加仓单金额倍数'),
                  num: symbolInfo?.safetyQuoteRateMin,
                });
              } else if (Number(safetyQuoteRate) > Number(symbolInfo?.safetyQuoteRateMax)) {
                return LANG('{name}应小于或等于{num}', {
                  name: LANG('加仓单金额倍数'),
                  num: symbolInfo?.safetyQuoteRateMax,
                });
              }
              return '';
            }}
          />
          <Input
            label={LANG('亏多少止损')}
            unit='%'
            decimal={2}
            placeholder={`${symbolInfo?.slRateMin.mul(100)}-${symbolInfo?.slRateMax.mul(100)}`}
            value={slRate}
            showError={showError}
            onChange={(val) => setData({ slRate: val })}
            errorText={() => {
              if (Number(slRate) < Number(symbolInfo?.slRateMin.mul(100))) {
                return LANG('{name}应大于或等于{num}', {
                  name: LANG('亏多少止损'),
                  num: symbolInfo?.slRateMin.mul(100) + '%',
                });
              } else if (Number(slRate) > Number(symbolInfo?.slRateMax.mul(100))) {
                return LANG('{name}应小于或等于{num}', {
                  name: LANG('亏多少止损'),
                  num: symbolInfo?.slRateMax.mul(100) + '%',
                });
              }
              const rate = Number(minRateMemo.mul(100));
              if (showError) {
                return LANG('亏多少止损低于目前加仓单之间价格总偏差({rate})，请适当调高止损比列或减少加仓单数量', {
                  rate: rate.toFixed(2) + '%',
                });
              }
              return '';
            }}
          />
          {showMinRateError && (
            <div className='error-tips'>
              {LANG('加仓单之间价格总偏差为{num}%，已超过100%，请适当减小被标记的参数', {
                num: minRateMemo.mul(100).toFixed(2),
              })}
            </div>
          )}
        </div>
      )}
      <style jsx>{styles}</style>
    </>
  );
};
const styles = css`
  .martin-setting {
    padding: 15px;
    border-radius: 6px;
    background-color: var(--theme-background-color-8);
    .label {
      color: var(--theme-font-color-1);
      &.amount {
        margin-top: 10px;
      }
    }
    .item {
      margin-top: 10px;
      :global(.container) {
        border-radius: 6px;
        :global(.input-wrapper) {
          background-color: var(--theme-background-color-disabled-light);
          font-size: 12px;
        }
        :global(input) {
          background-color: var(--theme-background-color-disabled-light);
        }
        :global(.label) {
          color: var(--theme-font-color-3);
        }
      }
      :global(.input-wrapper input) {
        min-width: 50px;
      }
    }
  }
  .balance-wrapper {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--theme-font-color-1);
    &.advanced-text {
      cursor: pointer;
    }
    &.active {
      :global(img) {
        transform: rotate(180deg);
      }
    }
    .text {
      color: var(--theme-font-color-3);
      display: flex;
      align-items: center;
    }
    :global(img) {
      margin-left: 4px;
      cursor: pointer;
      transition: 0.2s;
    }
  }
  .advanced-wrapper {
    padding-bottom: 20px;
    font-size: 12px;
    :global(.container) {
      margin-top: 10px;
      :global(.label) {
        color: var(--theme-font-color-3) !important;
      }
    }
    :global(.input-wrapper input) {
      min-width: 50px !important;
    }
  }
  .error-tips {
    margin-top: 5px;
    color: var(--const-color-error);
  }
`;
