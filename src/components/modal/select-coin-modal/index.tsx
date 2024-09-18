import CoinLogo from '@/components/coin-logo';
import CommonIcon from '@/components/common-icon';
import { BasicModal } from '@/components/modal';
import { RateText } from '@/components/rate-text';
import { LANG } from '@/core/i18n';
import { Account } from '@/core/shared';
import { clsx } from '@/core/utils';
import { Input } from 'antd';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';

const SelectCoinModel = ({ className, onClose, list, coin, onChange, isAssets, ...rest }: any) => {
  const { allSpotAssets } = Account.assets.spotAssetsStore;
  const [value, setValue] = useState('');
  const [focus, setFocus] = useState(false);
  const [arr, setArr] = useState(list);

  const _onClose = () => {
    setValue('');
    onClose();
  };

  const _onChange = (item: any) => {
    onChange(item);
    _onClose();
  };

  useEffect(() => {
    if (isAssets) {
      Account.assets.getAllSpotAssets();
    }
  }, []);

  useEffect(() => {
    const lists = list.filter((item: any) => !value || item.code.includes(value));
    if (isAssets) {
      const assetsList = lists.map((item: any) => {
        const asset = allSpotAssets.find((_: any) => _.code === item.code) || item;
        return { ...asset };
      });
      setArr(assetsList);
    } else {
      setArr(lists);
    }
  }, [value, list, allSpotAssets, isAssets]);

  return (
    <BasicModal
      className={clsx('select-coin-model', className)}
      onCancel={_onClose}
      footer={null}
      width={376}
      {...rest}
    >
      <div className='model'>
        <div className='title'>
          <span>{LANG('选择币种')}</span>
          <div className='close' onClick={_onClose}>
            <CommonIcon name='common-close-filled' size={24} enableSkin />
          </div>
        </div>
        <div className={clsx('search', focus && 'focus')}>
          <Image src={'/static/images/common/search.svg'} alt='search' width='14' height='14' />
          <Input
            value={value}
            placeholder={LANG('搜索')}
            onFocus={() => {
              setFocus(true);
            }}
            onBlur={() => setFocus(false)}
            onChange={({ target: { value } }) => {
              setValue(value.toLocaleUpperCase());
            }}
          />
        </div>
        <ul className='list'>
          {arr?.map((item: any) => {
            return (
              <li
                className={clsx('li', item.code === coin && 'active')}
                key={item.code}
                onClick={() => _onChange(item)}
              >
                {!isAssets ? (
                  <div className='item_1'>
                    <CoinLogo coin={item.code} width='20' height='20' className='icon' />
                    <span>{item.code}</span>
                  </div>
                ) : (
                  <>
                    <div className='item_left'>
                      <CoinLogo coin={item.code} width='20' height='20' className='icon' />
                      <div>
                        <div>{item.code}</div>
                        <div className='text'>{item.fullname}</div>
                      </div>
                    </div>
                    <div className='item_right'>
                      <div>{item.balance}</div>
                      <div className='text'>
                        ≈&nbsp;
                        <RateText money={item.balance} prefix currency={item.code} />
                      </div>
                    </div>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      <style jsx>{styles}</style>
    </BasicModal>
  );
};

const styles = css`
  :global(.select-coin-model) {
    :global(.basic-content) {
      padding: 8px 0 !important;
    }
    color: var(--theme-font-color-1);
    :global(.ant-modal-close) {
      display: none;
    }
    :global(.ant-modal-content) {
      padding: 0;
      background: var(--theme-background-color-2);
    }
    .model {
      .title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 16px;
        font-weight: 500;
        padding: 10px 20px 18px 20px;
      }
      .close {
        border-radius: 50%;
        background: var(--theme-background-color-4);
        height: 24px;
        width: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
      .list {
        padding: 0 10px;
        max-height: 265px;
        overflow: auto;
        display: flex;
        flex-direction: column;
        margin-top: 10px;
        .li {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          padding: 10px;
          border-radius: 6px;
          .item_left {
            display: flex;
            align-items: center;
          }
          .item_right {
            text-align: right;
          }
          .item_left,
          .item_right {
            .text {
              color: var(--theme-font-color-3);
              font-size: 12px;
            }
          }
          .item_1 {
            display: flex;
            align-items: center;
          }
          &.active {
            background: var(--theme-background-color-3);
            color: var(--skin-main-font-color);
          }
          :global(img) {
            width: 20px;
            height: 20px;
            margin-right: 6px;
          }
        }
      }
      .search {
        background: var(--theme-background-color-disabled);
        border-radius: 8px;
        padding: 0 10px;
        height: 38px;
        display: flex;
        align-items: center;
        margin: 0 20px;
        &.focus {
          border: 1px solid var(--skin-color-active);
        }
        :global(img) {
          margin-bottom: -4px;
        }
        :global(.ant-input) {
          width: 100%;
          height: 100%;
          outline: none;
          box-shadow: none;
          border: none;
          padding-left: 0;
          padding-bottom: 0;
          background: transparent;
          font-size: 14px;
          font-weight: 500;
          color: var(--theme-font-color-1);
          margin-left: 6px;
          &::placeholder {
            color: var(--theme-font-color-3) !important;
          }
          &::-webkit-input-placeholder {
            color: var(--theme-font-color-3) !important;
          }
        }
      }
    }
  }
`;
export default SelectCoinModel;
