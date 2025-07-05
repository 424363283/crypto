import { LANG } from '@/core/i18n';
import { clsx, MediaInfo } from '@/core/utils';
import { Dropdown } from 'antd';
import { useState } from 'react';
import css from 'styled-jsx/css';

/**
 * @prop {boolean} autoDefaultValue 自动赋予默认值
 * @returns
 */
const CryptoSelect = ({ options: data, value, onChange }: any) => {
  const [visible, setVisible] = useState(false);
  let focus = false;
  const overlay = (
    <div className={'crypto-select-menus'}>
      {data.map((item: any, index: number) => {
        const active = item.symbol === value;
        return (
          <div key={item.symbol} className={clsx('menu', active && 'active')} onClick={() => onChange?.(item)}>
            <div className={'text'}>{item?.symbol}</div>
          </div>
        );
      })}
      <style jsx>{styles}</style>
    </div>
  );

  const _focus = () => {
    setVisible(true);
  };

  const _blur = () => {
    const time = setTimeout(() => {
      if (!focus) setVisible(false);
      clearTimeout(time);
    }, 200);
  };

  return (
    <div className={'content'}>
      {/* <div className={'label'}>{LANG('合约')}</div> */}
      <Dropdown
        dropdownRender={menu => overlay}
        open={visible}
        // open={true}
      >
        <div className={'select'} tabIndex={1} onFocus={_focus} onBlur={_blur}>
          {value}
        </div>
      </Dropdown>
      <style jsx>{styles}</style>
    </div>
  );
};

const styles = css`
  .crypto-select-menus {
    border-radius: 4px;
    min-width: 100px;
    width: 100%;
    max-height: 250px;
    overflow: scroll;
    background: var(--theme-background-color-3-2);
    /* margin-left: -10px; */
    .menu {
      cursor: pointer;
      text-align: center;
      line-height: 12px;
      font-size: 14px;
      font-weight: 400;
      padding: 10px 5px;
      color: var(--text_2);
      background: var(--fill_3);
    }
    .active {
      color: var(--text_brand) !important;
      font-weight: 500;
    }
  }

  .content {
    display: flex;
    flex-direction: row;
    align-items: center;
    background: var(--theme-background-color-3-2);
    border-radius: 3px;
    .label {
      font-size: 14px;
      color: var(--theme-font-color-1);
    }
    .select {
      position: relative;
      cursor: pointer;
      padding: 0 30px 0 15px;
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      color: var(--text_1);
      min-width: 100px;
      background: var(--fill_3);
      border-radius: 8px;

      &::after {
        content: '';
        display: block;
        position: absolute;
        top: 18px;
        right: 10px;
        width: 0;
        height: 0;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-top: 5px solid var(--text_3);
      }
    }
  }
  @media ${MediaInfo.mobile} {
    .crypto-select-menus {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      gap: 4px;
      border-radius: 8px;
      background: var(--fill_pop);
      box-shadow: 0px 0px 8px 0px var(--fill_shadow);
      padding: 4px 0;
      .menu {
        height: 1.5rem;
        line-height: 1.5rem;
        font-size: 12px;
        font-weight: 500;
        color: var(--text_2);
        padding: 0;
        background: none;
        &.active {
          color: var(--brand);
        }
      }
    }
  }
`;

export default CryptoSelect;
