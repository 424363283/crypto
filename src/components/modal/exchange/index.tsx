import CoinLogo from '@/components/coin-logo';
import SelectCoin from '@/components/select-coin';
import { LANG } from '@/core/i18n';
import { Account } from '@/core/shared';
import { clsx } from '@/core/utils';
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
const Exchange = ({ isModel, coin = 'BTC' }: { isModel?: boolean; coin?: string }) => {
  const { state, setState, submit, item, currencyList, scale } = ConvertState();
  const [focus_1, setFocus_1] = useState(false);
  const [focus_2, setFocus_2] = useState(false);

  useEffect(() => {
    setState((draft) => {
      draft.currency = coin;
      draft.aMoeny = '';
      draft.bMoeny = '';
    });
  }, [currencyList, coin]);

  const _changePayment = (index: number) => {
    const currency = currencyList[index]?.code || state.currency;
    setState((draft) => {
      draft.currency = currency;
      draft.aMoeny = '';
      draft.bMoeny = '';
    });
  };

  const index = currencyList.findIndex((v: any) => v.code === state.currency);
  return (
    <div className={clsx('exchange', isModel && 'isModel')}>
      <div className={clsx('topbox', focus_1 && 'focus')}>
        <div className={'left'}>
          <div className={'title'}>{LANG('卖出____1')}</div>
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
            suffix={
              <div
                className={'all'}
                onClick={() => {
                  const value = item?.balance;
                  setState((draft) => {
                    draft.aMoeny = value;
                    draft.targetFocus = 'a';
                  });
                }}
              >
                {LANG('全部')}
              </div>
            }
          />
        </div>
        <div className={'right'}>
          <div>
            {LANG('可用')}
            <span> {item?.balance?.toFormat(scale) || 0} </span>
            {state?.currency}
          </div>
          <div>
            <SelectCoin values={[index]} options={currencyList} onChange={_changePayment} className={'select-coins'} />
          </div>
        </div>
      </div>
      <div className={'center'}>
        <div>
          <div>
            <Image src={imgUrl + '/arrow-up-down-line.png'} alt='' width={24} height={24} />
          </div>
        </div>
        <div></div>
      </div>
      <div className={clsx('bottombox', focus_2 && 'focus')}>
        <div className={'left'}>
          <div className={'title'}>{LANG('买入____1')}</div>
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
        </div>
        <div className={'right'}>
          <div></div>
          <div style={{ fontSize: '16px' }}>
            <CoinLogo coin='USDT' width={27} height={27} style={{ marginRight: '10px' }} />
            USDT
          </div>
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
        className={clsx('submit', 'fix-v2-btn', (!state.aMoeny || !state.bMoeny) && 'disabled')}
      >
        {LANG('兑换')}
      </div>
      <style jsx>{styles}</style>
    </div>
  );
};

const styles = css`
  :global(.ant-modal-content) {
    background-color: var(--theme-background-color-1) !important;
  }
  .exchange {
    padding: 40px 0 20px;
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 710px;
    min-width: 500px;
    &.isModel {
      margin: 0;
    }
    :global(.ant-input) {
      max-width: 530px;
      width: 100%;
      height: 50px;
      background: var(--theme-background-color-3);
      border-radius: 4px;
      outline: none;
      box-shadow: none;
      border: none;
      padding-left: 20px;
      color: var(--theme-font-color-1);
      &::placeholder {
        color: var(--theme-font-color-3) !important;
      }
      &::-webkit-input-placeholder {
        color: var(--theme-font-color-3) !important;
      }
    }
    .topbox {
      display: flex;
      width: 100%;
      justify-content: space-between;
      :global(.ant-input-affix-wrapper) {
        padding: 0;
        border-color: transparent;
        background: transparent;
      }
      &.focus {
        :global(.ant-input-affix-wrapper) {
          border: 1px solid var(--skin-color-active);
          border-radius: 3px;
          box-shadow: none;
          :global(input) {
            background: transparent;
            font-size: 14px;
          }
        }
      }
      :global(.ant-input) {
        padding-right: 60px;
      }
      :global(.ant-input-suffix) {
        right: 22px;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        color: rgba(0, 0, 0, 0.65);
      }

      .left {
        flex: 1;
        margin-right: 20px;
        .title {
          font-size: 16px;
          font-weight: 500;
          color: var(--theme-font-color-1);
          margin-bottom: 8px;
        }
        .all {
          cursor: pointer;
          color: var(--theme-font-color-1);
        }
      }
      .right {
        width: 160px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        text-align: right;
        color: var(--theme-font-color-1);
        :global(.label) {
          margin-right: 0;
          font-size: 16px;
          font-weight: 500;
        }
        :global(.select-coins) {
          width: 160px;
          height: 50px;
          background: var(--theme-background-color-3);
          border: 1px solid var(--skin-border-color-1);
          border-radius: 4px;
          font-weight: 500;
          color: var(--theme-font-color-1);
          :global(span) {
            font-size: 16px !important;
          }
          :global(img) {
            width: 25px;
            height: 25px;
          }
          :global(.emulate-select-options) {
            border: none;
            background: var(--theme-background-color-1);
            box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.05);
            border-radius: 4px;
            padding-top: 4px;
            :global(span) {
              font-size: 16px;
            }
          }
          :global(.react-dropdown-select) {
            background: transparent;
          }
        }
      }
    }
  }
  .center {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 23px;
    margin-bottom: 8px;
    > div:nth-child(1) {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 530px;
      > div {
        width: 48px;
        height: 48px;
        background: var(--theme-background-color-3);
        border-radius: 4px;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          height: 24px;
          width: 24px;
        }
      }
    }
  }
  .bottombox {
    display: flex;
    width: 100%;
    justify-content: space-between;

    &.focus {
      .left {
        :global(input) {
          border: 1px solid var(--skin-color-active);
          background: transparent;
          font-size: 14px;
        }
      }
    }
    .left {
      flex: 1;
      margin-right: 20px;
      :global(input) {
        border: 1px solid transparent;
      }
      .title {
        font-size: 16px;
        font-weight: 500;
        color: var(--theme-font-color-1);
        margin-bottom: 8px;
      }
    }
    .right {
      width: 160px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      > div:nth-child(1) {
        font-size: 14px;
        font-weight: 500;
        color: var(--theme-font-color-2);
        line-height: 25px;
      }
      > div:nth-child(2) {
        width: 160px;
        height: 50px;
        background: var(--theme-background-color-3);
        border: 1px solid var(--skin-border-color-1);
        border-radius: 4px;
        padding-left: 16px;
        display: flex;
        align-items: center;
        font-size: 15px;
        font-weight: 500;
        color: var(--theme-font-color-1);
      }
    }
  }
  .submit {
    width: 100%;
    height: 50px;
    flex-shrink: 0;
    font-weight: 500;
    color: #333333;
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
    color: var(--theme-font-color-1);
    line-height: 16px;
    span {
      font-weight: 400;
    }
  }
`;

export default Exchange;
