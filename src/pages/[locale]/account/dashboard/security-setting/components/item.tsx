import { Button } from '@/components/button';
import CommonIcon from '@/components/common-icon';
import { useResponsive } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { MediaInfo } from '@/core/utils';
import { Switch } from 'antd';
import Image from 'next/image';
import css from 'styled-jsx/css';

interface ItemProps {
  title: string;
  prompt: string | JSX.Element;
  logo?: string;
  account?: string;
  showSwitch?: boolean;
  checked?: boolean;
  isManage?: boolean;
  onCheckChange?: () => void;
  modifyClick?: any;
}
const Item = ({
  title,
  prompt,
  logo,
  account,
  showSwitch,
  checked,
  onCheckChange,
  modifyClick = undefined,
}: ItemProps) => {
  const { isMobile } = useResponsive();
  const shouldShowVerifiedIcon = title === LANG('邮箱验证') || title === LANG('手机号') ? !!account && checked : false;
  const ListRight = () => {
    return (
      <div className='list-right' key={logo}>
        {shouldShowVerifiedIcon && (
          <span className='list-account'>
            <Image src='/static/images/account/security-setting/verified-green.svg' width={14} height={14} alt='icon' />
            {account}
          </span>
        )}
        {showSwitch && <Switch checked={checked} onChange={onCheckChange} />}
        {modifyClick && (
          <Button type='light-sub-2' onClick={modifyClick} className='modify-btn'>
            {LANG('编辑')}
          </Button>
        )}
        <style jsx>{listRightStyles}</style>
      </div>
    );
  };

  const renderMobileListItem = () => {
    return (
      <li className='mobile-list-item'>
        <div className='list-top'>
          <div className='list-left'>
            {logo ? (
              <CommonIcon name={`common-${logo}`} size={30} className='list-logo' />
            ) : (
              <div className='list-logo' />
            )}
            <div className='list-box'>
              <p className='list-title'>{title}</p>
            </div>
          </div>
          <ListRight />
        </div>
        <div className='list-bottom'>
          <p className='list-prompt'>{prompt}</p>
        </div>
        <style jsx>{listLeftStyles}</style>
        <style jsx>{mobileStyles}</style>
      </li>
    );
  };
  if (isMobile) {
    return renderMobileListItem();
  }

  return (
    <li className='list-item'>
      <div className='list-left'>
        {logo ? <CommonIcon name={`common-${logo}`} size={30} className='list-logo' /> : <div className='list-logo' />}
        <div className='list-box'>
          <p className='list-title'>{title}</p>
          <p className='list-prompt'>{prompt}</p>
        </div>
      </div>
      <ListRight />
      <style jsx>{listLeftStyles}</style>

      <style jsx>{styles}</style>
    </li>
  );
};

export default Item;

const listLeftStyles = css`
  .list-left {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .list-logo {
      width: 32px;
      height: 32px;
      cursor: pointer;
    }
    .list-box {
      margin-left: 14px;
      position: relative;
      .list-title {
        font-size: 14px;
        font-weight: 500;
        color: var(--theme-font-color-1);
      }
      .list-prompt {
        margin-top: 10px;
        font-size: 12px;
        font-weight: 400;
        color: var(--theme-font-color-3);
        line-height: 17px;
        :global(.yellow) {
          color: var(--skin-color-active);
          border-bottom: 1px solid var(--skin-color-active);
        }
      }
    }
  }
`;
const listRightStyles = css`
  .list-right {
    display: flex;
    align-items: center;
    .list-account {
      display: flex;
      align-items: center;
      font-size: 12px;
      font-weight: 500;
      color: var(--theme-font-color-6);
      :global(img) {
        margin-right: 4px;
      }
    }
    :global(.modify-btn) {
      padding: 7px 23px;
      font-size: 12px;
      @media ${MediaInfo.mobile} {
        padding: 3px 17px;
      }
      margin-left: 16px;
      color: var(--theme-font-color-1);
      background-color: var(--theme-background-color-disabled-dark);
    }
    .s-list-btn {
      display: inline-block;
      margin-left: 14px;
      border-radius: 2px;
      border: 1px solid #dddfe4;
      height: 30px;
      line-height: 28px;
      min-width: 68px;
      text-align: center;
      font-size: 14px;
      font-weight: 500;
      color: #798296;
      &.yellow {
        color: var(--skin-main-font-color);
        border-color: var(--skin-primary-color);
      }
    }
    :global(.ant-switch) {
      margin-left: 20px;
    }
  }
`;
const mobileStyles = css`
  .mobile-list-item {
    display: flex;
    padding: 15px 0;
    flex-direction: column;
    &:not(:last-child) {
      border-bottom: 1px solid var(--theme-border-color-2);
    }
    .list-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .list-prompt {
      margin-top: 10px;
      font-size: 12px;
      font-weight: 400;
      color: var(--theme-font-color-3);
      line-height: 17px;
      margin-left: 44px;
      :global(.yellow) {
        color: var(--skin-main-font-color);
        border-bottom: 1px solid var(--skin-main-font-color);
      }
    }
  }
`;
const styles = css`
  .list-item {
    padding: 25px 0;
    border-bottom: 1px solid var(--theme-border-color-2);
    display: flex;
    align-items: center;
    justify-content: space-between;
    @media ${MediaInfo.mobile} {
      padding-bottom: 50px;
    }
    &:last-child {
      border: none;
    }
  }
`;
