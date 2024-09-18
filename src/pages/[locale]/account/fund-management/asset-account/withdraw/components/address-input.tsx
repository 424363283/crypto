import CommonIcon from '@/components/common-icon';
import { getAssetsListApi } from '@/core/api';
import { LANG, TrLink } from '@/core/i18n';
import { message } from '@/core/utils';
import { useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import css from 'styled-jsx/css';

export type TAddressItem = {
  id?: string;
  type?: number;
  currency?: string;
  chain?: string;
  network?: string;
  address: string;
  addressTag: string;
  common?: boolean;
  remark?: string;
  white?: boolean;
  count?: number;
  createTime?: number;
  withdraw?: null;
};

type AddressInputProps = {
  onChange: (address: TAddressItem) => void;
  currency: string;
  chains: {
    network: string;
  }[];
  cIndex: number;
  readOnly?: boolean;
  remoteAddress: string;
};

export const AddressInput = ({ onChange, currency, chains, cIndex, readOnly, remoteAddress }: AddressInputProps) => {
  const [list, setList] = useState<TAddressItem[]>([]);
  const [showSelect, setShowSelect] = useState(false);
  const [selectIndex, setSelectIndex] = useState<number | null>(null);
  const [value, setValue] = useState(remoteAddress);
  const [active, setActive] = useState(false);
  const [error, setError] = useState(false);

  const _onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue(e.target.value);
    onChange({
      address: value,
      addressTag: '',
    });
  };
  const getAssetsList = async () => {
    const res = await getAssetsListApi();
    if (res.code === 200) {
      setList(res.data);
    } else {
      message.error(res.message);
    }
  };

  // 获取地址列表
  useEffect(() => {
    setSelectIndex(null);
    getAssetsList();
  }, [chains]);

  const addresses = list?.filter((item) => {
    if (chains?.[cIndex]?.network === item.network && item.common) return true;
    if (item.currency !== currency || chains?.[cIndex]?.network !== item.network) return false;
    return true;
  });

  const _onBlur = () => {
    setActive(false);
    setTimeout(() => setShowSelect(false), 200);
    const addressList = addresses?.filter((item) => item.address === value);
    if (addressList?.length) {
      onChange(addressList[0]);
    }
  };

  const _setError = () => {
    if (!value) return setError(false);
    const chain = chains?.[cIndex]?.network;
    if (currency === 'USDT') {
      if (chain === 'OMNI' && !/^(1|3)/.test(value)) {
        setError(true);
      } else if (chain === 'ERC20' && !/^(0|x)/.test(value)) {
        setError(true);
      } else if (chain === 'TRC20' && !/^T/.test(value)) {
        setError(true);
      } else {
        setError(false);
      }
    } else {
      setError(false);
    }
  };

  useEffect(() => {
    _setError();
  }, [chains, cIndex, currency, value]);
  useEffect(() => {
    setValue(remoteAddress);
  }, [remoteAddress]);
  return (
    <div className='address-input'>
      <div className='header'>
        <div className='label'>{LANG('提币地址')}</div>
        <TrLink className='manage' href='/account/dashboard' query={{ type: 'address' }} native>
          {LANG('地址管理')}
        </TrLink>
      </div>
      <div className={`input ${active ? 'active' : ''}`}>
        <input
          value={value}
          onChange={_onChange}
          placeholder={LANG('请选择提币地址')}
          onFocus={() => {
            setActive(true);
            setShowSelect(true);
          }}
          onBlur={_onBlur}
          readOnly={readOnly}
        />
        <CopyToClipboard
          text={value}
          onCopy={(copiedText, success) => {
            if (value === copiedText && success && value) {
              message.success(LANG('复制成功'));
            } else {
              message.error(LANG('复制失败'));
            }
          }}
        >
          <CommonIcon size={16} name='common-copy-2-grey-0' className='copy-icon' />
        </CopyToClipboard>
        <div className='arrow'></div>
      </div>
      {error ? <div className='error'>{LANG('提币地址不符合所选链类型')}</div> : null}
      {addresses.length > 0 && (
        <div className={`select-view ${showSelect ? 'show' : ''}`}>
          {addresses.map((item, index) => {
            const active = selectIndex === index;
            const address = item.address;
            return (
              <div
                key={index}
                className={`item ${active ? 'active' : ''}`}
                onClick={() => {
                  setValue(address);
                  onChange(item);
                  setSelectIndex(index);
                  setShowSelect(false);
                }}
              >
                <div className='name'>
                  {item.remark && (
                    <div className='remark' title={item.remark}>
                      {item.remark}
                    </div>
                  )}
                  <div className='chain'>{item.network}</div>
                  {item?.white && <div className='tag'>{LANG('已验证')}</div>}
                  {item?.common && <div className='tag'>{LANG('已通用')}</div>}
                </div>
                <div className='divider'>
                  <div className='address'>{address}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <style jsx>{styles}</style>
    </div>
  );
};

const styles = css`
  .address-input {
    position: relative;
    .header {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 14px;
      .label {
        font-size: 16px;
        font-weight: 500;
        color: var(--theme-font-color-1);
      }

      :global(.manage) {
        line-height: 20px;
        font-size: 14px;
        font-weight: 500;
        color: var(--skin-primary-color);
      }
    }
    .input {
      background: var(--theme-background-color-8);
      padding-left: 20px;
      position: relative;
      width: 100%;
      height: 100%;
      border-radius: 8px;
      display: flex;
      align-items: center;
      &:hover,
      &.active {
        border-color: var(--skin-primary-color);
      }
      &.active {
        box-shadow: var(--skin-focus-shadow-1);
      }
      input {
        background: var(--theme-background-color-8);
        width: 100%;
        color: var(--theme-font-color-1);
        font-size: 14px;
        font-weight: 500;
        padding-right: 48px;
        border: 0;
      }
      input,
      label {
        line-height: 48px;
        font-size: 14px;
        font-weight: 500;
      }
      label {
        cursor: text;
        user-select: none;
        position: absolute;
        left: 20px;
        color: #bcc0ca;
      }
      :global(.copy-icon) {
        margin-right: 15px;
        cursor: pointer;
      }
      .arrow {
        cursor: text;
        user-select: none;
        position: absolute;
        content: '';
        top: 21px;
        right: 20px;
        width: 0;
        height: 0;
        background-image: url('/static/images/common/dropdown-2.png');
      }
    }
    .error {
      font-size: 14px;
      color: #ff6960;
      padding-top: 4px;
    }
    @keyframes fadeOut {
      from {
        opacity: 0;
      }

      to {
        opacity: 1;
      }
    }
    .select-view {
      display: none;
      position: absolute;
      transition: all 0.3s;
      opacity: 0;
      top: 90px;
      left: 0;
      width: 100%;
      background: var(--theme-background-color-2-3);
      z-index: 99;
      border-radius: 8px;
      overflow: hidden;
      &.show {
        display: block;
        animation: fadeOut 0.3s;
        animation-fill-mode: forwards;
      }
      .item {
        box-sizing: content-box !important;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.5s;
        padding: 15px 20px;
        &:last-child {
          border: none;
        }
        &.active {
          span {
            color: #a7a8ac;
          }
        }
        &:hover {
          background: rgba(var(--skin-primary-color-rgb), 0.15);
        }
        .name {
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }
        .remark {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          font-size: 14px;
          color: var(--theme-font-color-3);
          font-weight: 400;
          margin-right: 6px;
        }
        .divider {
          display: flex;
          align-items: center;
          margin-top: 10px;
        }
        .chain {
          background: var(--skin-primary-bg-color-opacity-1);
          border-radius: 2px;
          padding: 0 6px;
          font-size: 12px;
          font-weight: 400;
          color: var(--skin-primary-color);
          line-height: 16px;
        }
        .tag {
          background: rgba(67, 188, 156, 0.08);
          border-radius: 2px;
          font-weight: 400;
          font-size: 12px;
          line-height: 16px;
          color: #43bc9c;
          margin-left: 6px;
          padding: 0 6px;
        }
        .address {
          font-size: 14px;
          font-weight: 500;
          color: var(--theme-font-color-1);
          flex: 1;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        span {
          font-family: 'Myriad Pro' !important;
          color: var(--skin-primary-color);
          font-weight: 500;
        }
      }
    }
  }
`;
