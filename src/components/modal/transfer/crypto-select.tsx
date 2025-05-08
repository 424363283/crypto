import { BasicInput, INPUT_TYPE } from '@/components/basic-input';
import CoinLogo from '@/components/coin-logo';
import { useResponsive, useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { clsx, MediaInfo } from '@/core/utils';
import { Dropdown } from 'antd';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';

const stopPropagation = (e: any) => {
  if (e.cancelable) {
    e.preventDefault();
  }
  e.stopPropagation();
};
const Item = ({
  data,
  className,
  onClick,
  children,
}: {
  data: { crypto: string; price: any; id: string };
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}) => {
  return (
    <div className={clsx('crypto-item', className)} onClick={onClick}>
      <div className='left'>
        <CoinLogo className='icon' coin={data?.crypto || 'USDT'} width={16} height={16} />
        <div className='name'>{data?.crypto || 'USDT'}</div>
      </div>
      {children}
      <style jsx>{styles}</style>
    </div>
  );
};
const CryptoSelect = ({
  options,
  value,
  onChange,
}: {
  options: { crypto: string; price: any; id: string }[];
  value?: string;
  onChange: (value: string) => void;
}) => {
  const [visible, setVisible] = useState(false);
  const [keyword, setKeyword] = useState('');
  const { isDark } = useTheme();
  const { isMobile } = useResponsive();
  const data = options.filter((v) => (keyword ? v.crypto.indexOf(keyword.toUpperCase()) !== -1 : true));
  const allowSelect = options.length > 1;
  const overlayItems = data.map((item, index) => {
    return {
      key: item.id,
      label: (
        <Item key={index} data={item} onClick={() => onChange(item.id)}>
          <div className='price'>{item?.price?.toFormat(3)}</div>
        </Item>
      ),
    };
  });
  const getOverlayMenus = () => {
    if (data.length === 0) {
      return [
        {
          key: 'empty',
          label: <div className='empty'>{LANG('暂无数据')}</div>,
        },
      ];
    }
    return overlayItems;
  };
  const overlay = [
    {
      key: 'search-input',
      label: <SearchInput value={keyword} isDark={isDark} onChange={(value) => setKeyword(value)} />,
    },
    ...getOverlayMenus(),
  ];
  const option = options?.find((v) => v.crypto === value) as any;
  const content = (
    <Item data={option} className={clsx('crypto-selected-content', !isDark && 'transfer-modal-light')}>
      {allowSelect && (
        <Image
          className={'arrow'}
          src={visible ? '/static/images/common/modal/arrow_up.png' : '/static/images/common/modal/arrow_down.png'}
          alt=''
          width='12'
          height='7'
        />
      )}
    </Item>
  );
  useEffect(() => {
    visible && setKeyword('');
  }, [visible]);
  if (!allowSelect) {
    return content;
  }
  return (
    <Dropdown
      menu={{ items: overlay }}
      autoAdjustOverflow
      destroyPopupOnHide
      autoFocus
      overlayClassName={clsx('transfer-modal-menus', !isDark && 'transfer-modal-light', 'base-drop-view')}
      trigger={['click']}
      placement={isMobile ? 'top' : 'bottom'}
      onOpenChange={() => setVisible(!visible)}
    >
      <div onClick={stopPropagation}>
        {content}
        <style jsx>{styles}</style>
      </div>
    </Dropdown>
  );
};

const SearchInput = ({
  value,
  onChange,
  isDark,
}: {
  value: string;
  onChange: (value: string) => void;
  isDark: boolean;
}) => {
  return (
    <div className={'search-input-wrapper'} onClick={stopPropagation}>
      <BasicInput
        className={clsx('search-coin-input', !isDark && 'transfer-modal-light')}
        onClick={stopPropagation}
        type={INPUT_TYPE.NORMAL_TEXT}
        label=''
        prefix={
          <Image
            className='search-icon'
            alt=''
            width='16'
            height='16'
            src='/static/images/common/modal/search.svg'
            onClick={stopPropagation}
          />
        }
        value={value?.toUpperCase()}
        withBorder
        placeholder={LANG('搜索')}
        onInputChange={onChange}
      />
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  @import 'src/core/styles/src/design.scss';
  .crypto-selected-content {
    width: 100%;
    height: 48px;
    background: var(--fill_3);
    border-radius: 8px;
    display: flex;
    align-items: center;
    @media ${MediaInfo.mobile}{
      padding: 0 12px;
      width: calc(100% - 24px);
    }
    &.transfer-modal-light {
      background: #f5f5f5;
    }
    .arrow {
      width: 12px;
      height: auto;
    }
  }

  :global(.transfer-modal-menus) {
    padding: 0;
    width: 300px;
    :global(.ant-dropdown-menu) {
      background: var(--theme-background-color-3-2);
    }
    :global(.ant-dropdown-menu-item) {
      &:hover {
        :first-child {
          background-color: unset !important;
        }
      }
    }
    :global(.empty) {
      display: flex;
      justify-content: center;
      align-items: center;
      color: var(--theme-font-color-1);
    }
  }
  :global(.transfer-modal-menus.transfer-modal-light) {
    :global(.ant-dropdown-menu) {
      background-color: #fff;
      :global(.ant-dropdown-menu-item) {
        &:hover {
          background-color: #f5f5f5;
        }
      }
    }
  }
  :global(.crypto-item) {
    display: flex;
    cursor: pointer;
    padding: 8px 15px;
    justify-content: space-between;
    :global(.left) {
      line-height: 0;
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    :global(.icon) {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      margin-right: 6px;
    }
    :global(.name) {
      line-height: 18px;
      font-size: 14px;
      font-weight: 400;
      color: var(--text_1);
      margin-right: 4px;
    }
    :global(.subname) {
      line-height: 17px;
      align-self: flex-end;
      font-size: 12px;
      font-weight: 400;
      color: #798296;
    }
    :global(.price) {
      font-size: 14px;
      font-weight: 400;
      color: #fff;
      margin-right: 4px;
    }
  }
  .search-input-wrapper {
    margin-bottom: 10px;
    :global(.search-icon) {
      margin-left: 10px;
    }
    :global(.search-coin-input) {
      border-radius: 5px;
      border: 1px solid var(--theme-border-color-1);
      :global(.basic-input-bordered) {
        border-radius: 5px;
      }
      :global(.basic-input) {
        height: 36px;
        background: #2d3546;
        color: #fff;
      }
      input {
        font-size: 14px;
        color: #fff;
      }
      .icon {
        width: 16px;
      }
    }
    :global(.search-coin-input.transfer-modal-light) {
      :global(.basic-input) {
        background-color: #fff;
        color: $font2;
      }
    }
  }
  :global(.transfer-modal-light.crypto-item),
  :global(.transfer-modal-menus.transfer-modal-light .crypto-item) {
    :global(.name) {
      color: #333333;
    }
    :global(.price) {
      color: #333333;
    }
  }
`;
export default CryptoSelect;
