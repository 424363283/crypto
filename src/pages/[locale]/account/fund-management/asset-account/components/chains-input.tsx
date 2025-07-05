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
export const ChainsInput = ({ onChange, chains, cIndex, type, showLabel = true }: ChainsInputProps) => {
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
                <div className='name'>
                  <div className='chain'>{item.network}</div>
                  {step && <div className='tip'>{LANG('网络暂停')}</div>}
                </div>
                <div className='divider'>{item.networkName}</div>
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
    @media ${MediaInfo.mobile}{
      margin-bottom: 0px;
    }
    .label {
      font-size: 16px;
      font-weight: 500;
      color: var(--theme-font-color-1);
      margin-bottom: 15px;
    }
    .input {
      padding-left: 20px;
      position: relative;
      width: 100%;
      height: 100%;
      border-radius: 16px;
      background: var(--fill_input_1);
      display: flex;
      align-items: center;
      cursor: pointer;
      @media ${MediaInfo.mobile}{
        border-radius: 8px;
        width:auto;
      }
      &:hover,
      &.active {
        box-shadow: 0 0 0 1px var(--brand);
      }
      input {
        background: var(--fill_input_1);
        line-height: 56px;
        width: 100%;
        border-radius: 8px;
        padding-right: 48px;
        border: 0;
        cursor: pointer;
        color: var(--theme-font-color-1);
        font-size: 14px;
        font-weight: 500;
        border-radius: 16px;
        @media ${MediaInfo.mobile}{
          height: 40px;
          border-radius: 12px;
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
            top: 15px;
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
      top: 62px;
      left: 0;
      width: 100%;
      background: var(--fill_3);
      z-index: 99;
      border-radius: 8px;
      box-shadow: 1px 2px 10px 0px rgba(0, 0, 0, 0.08);
      overflow: hidden;
      &.show {
        display: block;
        animation: fadeOut 0.3s;
        animation-fill-mode: forwards;
      }
      .prompt {
        border-radius: 3px;
        background: rgba(240, 78, 63, 0.08);
        padding: 14px 15px;
        color: var(--theme-font-color-1);
        font-size: 12px;
        font-weight: 400;
        line-height: 18px;
        margin: 15px 20px 10px;
      }
      .item {
        box-sizing: content-box !important;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.5s;
        padding: 10px 20px;
        &.active {
          background: rgba(var(--skin-primary-color-rgb), 0.2);
        }
        &:hover {
          background: rgba(var(--skin-primary-color-rgb), 0.15);
        }
        .name {
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }

        .divider {
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
        .tip {
          border-radius: 5px;
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
