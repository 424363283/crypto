import CoinLogo from '@/components/coin-logo';
import { SelectCoinModel } from '@/components/modal';
import { LANG } from '@/core/i18n';
import { Account } from '@/core/shared';
import { MediaInfo, clsx } from '@/core/utils';
import { Input } from 'antd';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import ConvertState from './state';

// 判断是否为数字 可用带小数点
const isNumber = (value: string) => {
  const regArr = [/^\d+(\.\d+)?$/, /^\d+\.$/];
  return regArr.map((reg) => reg.test(`${value}`)).includes(true);
};

// 保留几位小数 直接裁剪
const floatNumber = (num: string, digit = 0) => {
  const v = String(num);
  if (v.includes('.')) {
    const [a, b] = String(num).split('.');
    if (b) {
      return a + '.' + b.substr(0, digit);
    } else {
      return a + '.';
    }
  } else {
    return num;
  }
};

const floatVal = (val: string, digit: number) => {
  if (val === '') return '';
  return floatNumber(val, digit);
};

const imgUrl = Account.convert.imgUrl;
const Exchange = ({
  isModel,
  coin = 'BTC',
  setPrice,
  setCoin,
}: {
  isModel?: boolean;
  coin?: string;
  setPrice: Function;
  setCoin: Function;
}) => {
  const { state, setState, submit, item, currencyList, scale, usdt_item } = ConvertState();
  const [focus_1, setFocus_1] = useState(false);
  const [focus_2, setFocus_2] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setState((draft) => {
      draft.currency = coin;
      draft.aMoeny = '';
      draft.bMoeny = '';
    });
  }, [currencyList, coin]);

  useEffect(() => {
    setPrice(state?.currencyPrice || '');
  }, [state?.currencyPrice]);

  const _changePayment = (item: { code: string }) => {
    setState((draft) => {
      draft.currency = item.code;
      draft.aMoeny = '';
      draft.bMoeny = '';
    });
    setCoin(item.code);
  };

  return (
    <div className={clsx('exchange', isModel && 'isModel')}>
      <div className={clsx('topbox', focus_1 && 'focus')}>
        <div className={'top'}>
          <div className={'title'}>
            {LANG('卖出____1')}
            <span
              onClick={() => {
                setState((draft) => {
                  draft.aMoeny = floatVal(item?.balance, scale);
                });
              }}
            >
              {LANG('最大')}
            </span>
          </div>
          <div className='amount'>
            {LANG('可用')}
            <span> {item?.balance?.toFormat(scale) || 0} </span>
            {state?.currency}
          </div>
        </div>
        <div className={'bottom'}>
          <Input
            placeholder={LANG('请输入卖出数量')}
            value={state.aMoeny}
            onChange={({ target: { value } }) => {
              if (!isNumber(value) && value !== '') return;
              setState((draft) => {
                draft.aMoeny = floatVal(value, scale);
              });
            }}
            onFocus={() => {
              setState((draft) => {
                draft.targetFocus = 'a';
              });
              setFocus_1(true);
            }}
            onBlur={() => setFocus_1(false)}
            // suffix={
            //   <div
            //     className={'all'}
            //     onClick={() => {
            //       const value = item?.balance;
            //       setState((draft) => {
            //         draft.aMoeny = value;
            //         draft.targetFocus = 'a';
            //       });
            //     }}
            //   >
            //     {LANG('全部')}
            //   </div>
            // }
          />
          <div className='select-coins' onClick={() => setOpen(true)}>
            <CoinLogo coin={state.currency} width='20' height='20' className='icon' />
            <span>{state.currency}</span>
            <Image src={'/static/images/common/arrow_down.svg'} alt='' width={16} height={16} />
          </div>
        </div>
      </div>
      <div className={'center'}>
        <Image src={imgUrl + '/arrow-up-down-line.svg'} alt='' width={30} height={30} />
      </div>
      <div className={clsx('bottombox', focus_2 && 'focus')}>
        <div className={'top'}>
          <div className={'title'}>{LANG('买入____1')}</div>
          <div className='amount'>
            {LANG('可用')}
            <span> {usdt_item?.balance?.toFormat(2) || 0} </span>
            USDT
          </div>
        </div>
        <div className={'bottom'}>
          <Input
            value={state.bMoeny}
            placeholder={LANG('请输入买入数量')}
            onFocus={() => {
              setState((draft) => {
                draft.targetFocus = 'b';
              });
              setFocus_2(true);
            }}
            onBlur={() => setFocus_2(false)}
            onChange={({ target: { value } }) => {
              if (!isNumber(value) && value !== '') return;
              setState((draft) => {
                draft.bMoeny = floatVal(value, 2);
              });
            }}
          />
          <div className='unit'>USDT</div>
        </div>
      </div>
      <p className={'prompt'}>
        <span>{LANG('价格参考')}：</span>
        <span>
          1{state.currency} = {state?.currencyPrice || '--'}USDT
        </span>
      </p>
      <div
        onClick={() => submit(item || {})}
        className={clsx('submit', 'pc-v2-btn', (!state.aMoeny || !state.bMoeny) && 'disabled')}
      >
        {LANG('兑换')}
      </div>
      <SelectCoinModel
        open={open}
        onClose={() => setOpen(false)}
        list={currencyList}
        coin={state.currency}
        onChange={_changePayment}
        isAssets={true}
      />
      <style jsx>{styles}</style>
    </div>
  );
};

const styles = css`
  .exchange {
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    @media ${MediaInfo.desktop} {
      width: 436px;
      flex: none;
    }
    .select-coins {
      display: flex;
      align-items: center;
      height: 32px;
      padding: 0 10px;
      border-radius: 16px;
      background: var(--theme-sub-button-bg-1);
      box-shadow: 1px 2px 10px 0px rgba(0, 0, 0, 0.08);
      color: var(--theme-font-color-1);
      font-size: 14px;
      font-weight: 500;
      gap: 5px;
      cursor: pointer;
    }
    &.isModel {
      margin: 0;
    }
    :global(.ant-input) {
      width: 100%;
      height: 50px;
      outline: none;
      box-shadow: none;
      border: none;
      padding-left: 0;
      padding-bottom: 0;
      background: transparent;
      font-size: 20px;
      font-weight: 500;
      color: var(--theme-font-color-1);
      &::placeholder {
        color: var(--theme-font-color-3) !important;
      }
      &::-webkit-input-placeholder {
        color: var(--theme-font-color-3) !important;
      }
    }
    .topbox {
      :global(.ant-input-affix-wrapper) {
        padding: 0;
        border-color: transparent;
      }

      :global(.ant-input-suffix) {
        right: 22px;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        color: rgba(0, 0, 0, 0.65);
      }
    }
  }
  .center {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 15px 0;
    :global(img) {
      border-radius: 50%;
      padding: 7px;
      background: var(--theme-background-color-3);
    }
  }
  .bottombox,
  .topbox {
    width: 100%;
    background: var(--theme-background-color-8);
    border: 1px solid transparent;
    padding: 16px 15px 4px;
    border-radius: 8px;
    &.focus {
      border: 1px solid var(--skin-color-active);
    }
    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .title {
        font-size: 12px;
        font-weight: 500;
        color: var(--theme-font-color-3);
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        gap: 4px;
        span {
          cursor: pointer;
          color: var(--skin-primary-color);
        }
      }
      .all {
        cursor: pointer;
      }
    }
    .bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      :global(.label) {
        margin-right: 0;
      }
    }
    .unit {
      font-size: 20px;
      font-weight: 500;
      color: var(--theme-font-color-1);
      text-align: right;
    }
    .amount {
      font-size: 12px;
      font-weight: 400;
      color: var(--theme-font-color-3);
    }
  }
  .submit {
    width: 100%;
    height: 50px;
    flex-shrink: 0;
    font-weight: 500;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 12px;
    cursor: pointer;
    font-size: 16px;
  }
  .prompt {
    width: 100%;
    text-align: left;
    margin-top: 35px;
    font-size: 13px;
    color: var(--theme-font-color-3);
    line-height: 16px;
    span {
      font-weight: 400;
    }
  }
`;

export default Exchange;
