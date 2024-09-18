import CoinLogo from '@/components/coin-logo';
import CommonIcon from '@/components/common-icon';
import Image from '@/components/image';
import { SelectCoinModel } from '@/components/modal';
import { LANG, TrLink } from '@/core/i18n';
import { Account, Rate } from '@/core/shared';
import { useAppContext } from '@/core/store';
import { clsx } from '@/core/utils';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import css from 'styled-jsx/css';
import InputSection from './components/input-section';

const bankImages = Account.fiatCrypto.bankImages;

const SelectCoin = ({ value, onClick }: { value: string; onClick: () => void }) => {
  return (
    <div className='select-content-box' onClick={onClick}>
      <CoinLogo width={18} height={18} className='icon' coin={value || ''} />
      <span className='text'> {value || ''}</span>
      <Image src={'/static/images/common/arrow_down.svg'} alt='' width={18} height={18} />
      <style jsx>{selectStyles}</style>
    </div>
  );
};

const selectStyles = css`
  .select-content-box {
    font-size: 16px;
    color: var(--theme-font-color-1);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px 2px 6px 8px;
    background: var(--theme-sub-button-bg-1);
    border-radius: 5px;
    cursor: pointer;
    .icon {
      width: 20px;
      height: auto;
    }
    .text {
      font-weight: 500;
      font-size: 14px;
      margin-left: 5px;
    }
  }
`;

const QuicklyBuyCoins = ({
  state,
  setState,
  onChangeCrypto,
  onChangeCurrencyAmount,
  onChangeCurrency,
  onRefresh,
  onChangeCoinAmount,
  setType,
  setPayModal,
  onQuery,
}: any) => {
  const { isLogin } = useAppContext();

  const {
    currencyOptions: _currencyOptions,
    currencySelected,
    cryptoOptions: _cryptoOptions,
    cryptoSelected,
    loading,
    type,
    currencyData,
    coinData,
    sellAmountMax,
    sellAmountMin,
    sellQuotas,
    isBuy,
    amountMax,
    amountMin,
    rate: _rate,
    payData,
  } = state;
  const beforeInputRef = useRef<any>();
  const afterInputRef = useRef<any>();

  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);

  const cryptoOptions = useMemo(() => (isBuy ? _cryptoOptions : coinData), [isBuy, _cryptoOptions, coinData]);
  const currencyOptions = useMemo(
    () => (isBuy ? _currencyOptions : currencyData),
    [isBuy, _currencyOptions, currencyData]
  );
  const max = useMemo(() => (isBuy ? amountMax : sellAmountMax), [isBuy, amountMax, sellAmountMax]);
  const min = useMemo(() => (isBuy ? amountMin : sellAmountMin), [isBuy, amountMin, sellAmountMin]);

  const cryptoCode = cryptoSelected?.code || '';
  const currencyCode = currencySelected?.code || '';
  const rate = payData?.price || 0;
  const [proposedPriceReverse, setProposedPriceReverse] = useState(false);
  const { before, setBefore, after, setAfter, cryptoScale, currencyScale, cryptoMin, cryptoMax }: any =
    usePriceConversion({
      cryptoCode,
      currencyCode,
      onChangeCurrencyAmount,
      onChangeCoinAmount,
      rate,
      amountMax: max,
      amountMin: min,
      loading,
      isBuy,
    });
  useEffect(() => {
    _getCurrencyData();
  }, []);

  useEffect(() => {
    _setSellData();
  }, [cryptoCode]);

  useEffect(() => {
    if (!isBuy) {
      _onChangeCrypto();
      _onChangeCurrency();
      _setSellData();
    }
  }, [isBuy]);

  // 设置卖出数据
  const _setSellData = () => {
    const item: any = sellQuotas.find((q: any) => q.source === cryptoCode);
    setState((draft: any) => {
      draft.sellAmountMin = item?.sourceMin || 0;
      draft.sellAmountMax = item?.sourceMax || 0;
    });
  };

  // 设置卖出币种
  const _onChangeCrypto = () => {
    const index = coinData.findIndex(({ code }: any) => cryptoCode === code);
    if (index !== -1) {
      onChangeCrypto(coinData[index]);
    } else {
      onChangeCrypto(coinData[0]);
    }
  };

  // 设置卖出法币币种
  const _onChangeCurrency = () => {
    const index = currencyData.findIndex(({ code }: any) => currencyCode === code);
    if (index !== -1) {
      onChangeCurrency(currencyData[index]);
    } else {
      onChangeCurrency(currencyData[0]);
    }
  };

  // 获取卖币数据
  const _getCurrencyData = async () => {
    try {
      const result: any = await Account.fiatCrypto.getSupports(2);
      const { source = [], target = [], quotas = [] } = result?.data || {};
      setState((draft: any) => {
        draft.coinData = source.map((v: any) => {
          return {
            code: v,
            currency: v,
          };
        });
        draft.currencyData = target.map((v: any) => {
          return {
            code: v,
            currency: v,
          };
        });
        draft.sellQuotas = quotas;
      });
    } catch (error) {}
  };
  const img = payData?.logo || bankImages.methods[payData?.code?.toLocaleLowerCase()] || bankImages.methods['bank'];

  return (
    <div className={'quickly-buy-coins'}>
      <div className='header'>
        <div className={'tabs'}>
          <div className={clsx('tab', type === 1 && 'active')} onClick={() => setType(1)}>
            <span>{LANG('买入____2')}</span>
          </div>
          <div className={clsx('tab', type === 2 && 'active')} onClick={() => setType(2)}>
            <span>{LANG('卖出____2')}</span>
          </div>
        </div>
      </div>
      {isBuy ? (
        <div className={'content'}>
          <InputSection
            inputRef={afterInputRef}
            label={LANG('我要支付')}
            placeholder={LANG('请输入购买金额')}
            labelRight={
              <TrLink
                className={'history'}
                native
                href={`/account/fund-management/assets-overview`}
                query={{ type: 'fund-history', tab: isBuy ? 1 : 3 }}
                rel='nofollow'
              >
                <CommonIcon name='sidebar-fund-record-nav-active-0' width='14' height='16' enableSkin />
                <span className={'span'}>{LANG('历史记录')}</span>
              </TrLink>
            }
            min={amountMin}
            max={amountMax}
            value={after}
            onChange={setAfter}
            digit={currencyScale}
            type='number'
            renderRight={<SelectCoin value={currencyCode} onClick={() => setOpen1(true)} />}
            onBlur={onRefresh}
          />
          <InputSection
            inputRef={beforeInputRef}
            label={LANG('我会收到') + '≈'}
            placeholder={LANG('请输入购买数量')}
            min={cryptoMin}
            max={cryptoMax}
            value={before}
            onChange={setBefore}
            digit={cryptoScale}
            type='number'
            renderRight={<SelectCoin value={cryptoCode} onClick={() => setOpen(true)} />}
            onBlur={onRefresh}
          />
        </div>
      ) : (
        <div className={'content'}>
          <InputSection
            inputRef={beforeInputRef}
            labelRight={
              <TrLink
                className={'history'}
                native
                href={`/account/fund-management/assets-overview`}
                query={{ type: 'fund-history', tab: isBuy ? 1 : 3 }}
                rel='nofollow'
              >
                <CommonIcon name='sidebar-fund-record-nav-active-0' width='14' height='16' enableSkin />
                <span className={'span'}>{LANG('历史记录')}</span>
              </TrLink>
            }
            label={LANG('我要出售')}
            placeholder={LANG('请输入出售数量')}
            min={cryptoMin}
            max={cryptoMax}
            value={before}
            onChange={setBefore}
            digit={cryptoScale}
            type='number'
            renderRight={<SelectCoin value={cryptoCode} onClick={() => setOpen(true)} />}
            onBlur={onRefresh}
          />
          <InputSection
            inputRef={afterInputRef}
            label={LANG('我会收到') + '≈'}
            placeholder={LANG('请输入出售金额')}
            min={amountMin}
            max={amountMax}
            value={after}
            onChange={setAfter}
            digit={currencyScale}
            type='number'
            renderRight={<SelectCoin value={currencyCode} onClick={() => setOpen1(true)} />}
            onBlur={onRefresh}
          />
        </div>
      )}

      <div className={'info'} key={loading ? 0 : 1}>
        <div className={'label'}>{LANG('参考价格')}:</div>
        <div className={'amount'}>
          {proposedPriceReverse
            ? `${'1'.div(rate)?.toFormat(cryptoScale)} ${cryptoCode}/${currencyCode}`
            : `${rate?.toFormat(currencyScale)} ${currencyCode}/${cryptoCode}`}
        </div>
        <div
          className={'switch'}
          onClick={() => {
            setProposedPriceReverse((v) => {
              const next = !v;
              (!next ? beforeInputRef : afterInputRef)?.current?.focus();
              return next;
            });
          }}
        ></div>
      </div>
      <div className='pay'>
        <div className='p-title'>{LANG('支付方式')}</div>
        <div className={clsx('pc-v2-input')} tabIndex={1} onClick={() => setPayModal(true)}>
          <div className='pay-name'>
            <Image src={img} width='22' height='22' alt='logo' />
            <span>{payData?.name}</span>
          </div>
          <Image src='/static/images/common/arrow_down_1.png' width='16' height='16' alt='arrow_down' />
        </div>
      </div>
      <div className={clsx('pc-v2-btn')} onClick={onQuery}>
        {isLogin ? LANG('查询') : LANG('登录')}
      </div>
      <SelectCoinModel
        open={open}
        onClose={() => setOpen(false)}
        list={cryptoOptions}
        coin={cryptoCode}
        onChange={onChangeCrypto}
        isAssets={true}
      />
      <SelectCoinModel
        open={open1}
        onClose={() => setOpen1(false)}
        list={currencyOptions}
        coin={currencyCode}
        onChange={onChangeCurrency}
      />
      <style jsx>{styles}</style>
    </div>
  );
};
const usePriceConversion = ({
  cryptoCode,
  currencyCode,
  onChangeCurrencyAmount,
  amountMin: _amountMin,
  amountMax: _amountMax,
  rate,
  loading,
  onChangeCoinAmount,
  isBuy,
}: any) => {
  const rateScaleMap = Rate.store.rateScaleMap;
  const cryptoScale = rateScaleMap[cryptoCode] || 2;
  const currencyScale = rateScaleMap[currencyCode] || 2;
  const [before, _setBefore] = useState('');
  const [after, _setAfter] = useState('100');
  const amountMin = useMemo(() => {
    if (isBuy) {
      return _amountMin;
    }
    return rate ? rate.mul(_amountMin).toFixed(currencyScale) : 0;
  }, [_amountMin, rate, currencyScale, isBuy]);

  const amountMax = useMemo(() => {
    if (isBuy) {
      return _amountMax;
    }
    return rate ? rate.mul(_amountMax).toFixed(currencyScale) : 0;
  }, [_amountMax, rate, currencyScale, isBuy]);

  const cryptoMin = useMemo(() => {
    if (isBuy) {
      return rate ? '1'.div(rate).mul(_amountMin).toFixed(cryptoScale) : 0;
    }
    return _amountMin;
  }, [_amountMin, rate, cryptoScale, isBuy]);

  const cryptoMax = useMemo(() => {
    if (isBuy) {
      return rate ? '1'.div(rate).mul(_amountMax).toFixed(cryptoScale) : 0;
    }
    return _amountMax;
  }, [_amountMax, rate, cryptoScale, isBuy]);

  const changeDepos = [cryptoCode, currencyCode, cryptoMin, rate, cryptoMax, amountMax, amountMin];

  const setBefore = useCallback(
    (value: any) => {
      if (cryptoCode && currencyCode) {
        let nextAfter = Number(value.mul(rate)?.toFixed(currencyScale));
        // 大小值判断
        nextAfter = nextAfter > amountMax ? amountMax : nextAfter < amountMin ? amountMin : nextAfter;
        value = value > cryptoMax ? cryptoMax : value < cryptoMin ? cryptoMin : value;
        _setBefore(value?.toFixed());
        _setAfter(nextAfter?.toFixed());
        onChangeCurrencyAmount(nextAfter?.toFixed());
        onChangeCoinAmount(value?.toFixed());
      }
    },
    [...changeDepos, currencyScale]
  );

  const setAfter = useCallback(
    (value: any) => {
      if (cryptoCode && currencyCode) {
        let nextBefore: any = Number(value.mul('1'.div(rate))?.toFixed(cryptoScale));
        // 大小值判断
        nextBefore = nextBefore > cryptoMax ? cryptoMax : nextBefore < cryptoMin ? cryptoMin : nextBefore;
        value = value > amountMax ? amountMax : value < amountMin ? amountMin : value;
        _setAfter(value?.toFixed());
        _setBefore(nextBefore?.toFixed());
        onChangeCurrencyAmount(value);
        onChangeCoinAmount(nextBefore?.toFixed());
      }
    },
    [...changeDepos, onChangeCurrencyAmount, cryptoScale]
  );

  // 币种切换时，汇率重新计算
  useEffect(() => {
    (before || cryptoMin) && setBefore(Number((before || cryptoMin)?.toFixed(cryptoScale)));

    // if (isBuy) {
    //   (after || amountMin) && setAfter(Number((after || amountMin)?.toFixed(currencyScale)));
    // } else {
    //   (before || cryptoMin) && setBefore(Number((before || cryptoMin)?.toFixed(cryptoScale)));
    // }
  }, [rate, isBuy, amountMin, cryptoMin, loading]);

  return {
    before,
    setBefore,
    after,
    setAfter,
    cryptoScale,
    currencyScale,
    cryptoMin,
    cryptoMax,
  };
};

const styles = css`
  .quickly-buy-coins {
    position: relative;
    height: 100%;
    background: var(--theme-background-color-2);
    width: 100%;
    color: var(--theme-font-color-1);
    border-radius: 15px;
    padding: 20px;

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .loading {
      margin-top: 58px;
      height: calc(100% - 58px);
    }
    :global(.history) {
      cursor: pointer;
      display: flex;
      flex-direction: row;
      align-items: center;
      .span {
        font-size: 14px;
        font-weight: 400;
        margin-left: 5px;
        color: var(--skin-primary-color);
      }
    }
    .content {
      padding: 34px 0 0;
      :global(> *) {
        margin-bottom: 26px;
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
    .info {
      height: 48px;
      display: flex;
      flex-direction: row;
      align-items: center;
      border-bottom: 1px solid var(--theme-border-color-3);
      .label,
      .amount {
        font-size: 14px;
        font-weight: 500;
        color: var(--theme-font-color-3);
        margin-right: inherit;
      }
      .amount {
        margin-left: 7px;
        margin-right: 8px;
      }
      .switch {
        cursor: pointer;
        width: 16px;
        height: 16px;
        background: url('/static/images/fiat-crypto/change.svg');
        background-size: 100% 100%;
      }
    }
  }
  .tabs {
    display: flex;
    align-items: center;
    width: 100%;
    overflow: hidden;
    border-radius: 8px;
    .tab {
      font-size: 20px;
      font-weight: 400;
      color: var(--theme-font-color-3);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 48px;
      flex: 1;
      border-radius: 8px;
      background: var(--theme-background-color-8);
      &:nth-child(1) {
        transform: skew(-20deg);
        transform-origin: top right;
        span {
          transform: skew(20deg);
          transform-origin: top right;
        }
      }
      &:nth-child(2) {
        transform: skew(-20deg);
        transform-origin: bottom left;
        span {
          transform: skew(20deg);
          transform-origin: bottom left;
        }
      }
      &.active {
        font-weight: 500;
        color: white;
        &:nth-child(1) {
          background: var(--color-green);
        }
        &:nth-child(2) {
          background: var(--color-red);
        }
      }
    }
  }
  .pay {
    padding-bottom: 30px;
    .p-title {
      font-size: 14px;
      font-weight: 500;
      line-height: 40px;
    }
    .pay-name {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
      font-weight: 500;
    }
    :global(.pc-v2-input) {
      height: 48px;
      border-color: transparent;
      border-radius: 5px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 10px;
      background: var(--theme-background-color-8);
      color: var(--theme-font-color-1);
      cursor: pointer;
      &:hover {
        border-color: var(--skin-primary-color);
      }
    }
  }
`;

export default QuicklyBuyCoins;
