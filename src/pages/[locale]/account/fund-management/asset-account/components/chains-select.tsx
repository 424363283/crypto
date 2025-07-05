import CommonIcon from '@/components/common-icon';
import { LANG } from '@/core/i18n';
import { MediaInfo } from '@/core/utils';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';

type ChainsInputProps = {
  onChange: (cIndex: number) => void;
  chains: {
    network: string;
    networkName: string;
    busy: boolean;
  }[];
  cIndex: number;
  type: string;
  showLabel?: boolean;
};

let time: any = null;
export const ChainsSelect = ({ onChange, chains, cIndex, type, showLabel = true }: ChainsInputProps) => {
  const [showSelect, setShowSelect] = useState(false);
  const [value, setValue] = useState('');
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (cIndex !== null && chains.length > 0) {
      setValue(chains[cIndex]?.networkName || '');
    }
  }, [chains, cIndex]);

  const _onBlur = () => {
    setActive(false);
    time = setTimeout(() => setShowSelect(false), 200);
  };

  const _focus = () => {
    setActive(prev => !prev);
    setShowSelect(prev => !prev);
  };

  const _onChange = (index: number, step: boolean) => {
    if (step) {
      time && clearTimeout(time);
    } else {
      onChange(index);
      setShowSelect(false);
    }
  };

  return (
    <div className='address-input'>
      { showLabel && <div className='label'>{LANG('选择网络')}</div> }
      <div className={`input ${active ? 'active' : ''}`} tabIndex={1} onClick={_focus} onBlur={_onBlur}>
        <input placeholder={LANG('请选择网络')} value={value} readOnly />
        <div className='arrow'>
          <CommonIcon name={'common-tiny-triangle-down'} size={16} />
        </div>
      </div>
      {chains.length > 0 && (
        <div className={`select-view ${showSelect ? 'show' : ''}`}>
          <div className='prompt'>
            {LANG(
              '请注意，这里仅展示了YMEX平台所支持的充币网络，如果您使用YMEX不支持的网络充币，将可能导致资产损失。'
            )}
          </div>
          {chains.map((item: any, index) => {
            const active = cIndex === index;
            const step = item.busy || !item[type];
            return (
              <div key={index} className={`item ${active ? 'active' : ''}`} onClick={() => _onChange(index, step)}>
                <div className='left-value'>
                  <div className='name'>
                    <div className='chain'>{item.network}</div>
                    {step && <div className='tip'>{LANG('网络暂停')}</div>}
                  </div>
                  <div className='network-name'>{item.networkName}</div>
                </div>
                {active && (
                  <div className='selected-value'>
                    <CommonIcon name='common-checked-0' size={18} enableSkin />
                  </div>
                )}
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
    margin-bottom: 24px;
    .label {
      font-size: 16px;
      font-weight: 500;
      color: var(--theme-font-color-1);
      margin-bottom: 15px;
    }
    .input {
      // padding-left: 20px;
      position: relative;
      width: 100%;
      height: 100%;
      border-radius: 16px;
      @media ${MediaInfo.mobile}{
        border-radius: 8px;
        width: auto;
      }
      background: var(--fill_input_1);
      display: flex;
      align-items: center;
      cursor: pointer;
      &:hover,
      &.active {
        box-shadow: 0 0 0 1px var(--brand);
      }
      &.active {
        box-shadow: var(--skin-focus-shadow-1);
      }
      input {
        background: var(--fill_input_1);
        line-height: 56px;
        width: 100%;
        border-radius: 16px;
        padding: 0 48px 0 16px;
        border: 0;
        cursor: pointer;
        color: var(--theme-font-color-1);
        font-size: 14px;
        font-weight: 500;
        @media ${MediaInfo.mobile}{
          height: 40px;
          border-radius: 8px;
          line-height: 40px;
          padding-left: 16px;
        }
      }
      .arrow {
        cursor: text;
        user-select: none;
        position: absolute;
        content: '';
        top: 21px;
        right: 16px;
        width: 12px;
        height: 12px;
        @media ${MediaInfo.mobile}{
          top: 14px;
        }
      }
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
      top: 64px;
      left: 0;
      width: 100%;
      background: var(--fill_pop);
      z-index: 99;
      border-radius: 8px;
      box-shadow: 1px 2px 10px 0px rgba(0, 0, 0, 0.08);
      padding: 0px 6px;
      &.show {
        display: block;
        animation: fadeOut 0.3s;
        animation-fill-mode: forwards;
      }
      @media ${MediaInfo.mobile}{
        top: 42px;
      }
      .prompt {
        border-radius: 3px;
        background: rgba(240, 78, 63, 0.08);
        padding: 14px 15px;
        color: var(--theme-font-color-1);
        font-size: 12px;
        font-weight: 400;
        line-height: 18px;
        margin: 15px 0px 10px;
      }
      .item {
        box-sizing: content-box !important;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.5s;
        padding: 10px 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-radius: 6px;
        &.active {
          background: rgba(var(--skin-primary-color-rgb), 0.2);
        }
        &:hover {
          background: rgba(var(--skin-primary-color-rgb), 0.15);
        }
        .left-value {
          .name {
            display: flex;
            align-items: center;
            justify-content: flex-start;
          }
          .network-name {
            color: var(--theme-font-color-3);
            font-size: 12px;
            font-weight: 500;
            line-height: 20px;
          }
          .chain {
            color: var(--theme-font-color-1);
            font-size: 14px;
            font-weight: 500;
            line-height: 24px;
          }
        }
        .selected-value {
        }

        .tip {
          border-radius: 5px;
          background: transparent;
          color: var(--text_brand);
          font-size: 12px;
          font-weight: 500;
          padding: 0 10px;
          line-height: 24px;
          margin-left: 10px;
        }
      }
    }
  }
`;
