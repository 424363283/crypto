import { Button } from '@/components/button';
import { Size } from '@/components/constants';
import { Svg } from '@/components/svg';
import { useResponsive } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { MediaInfo } from '@/core/utils';
import { Switch } from 'antd';
import Image from 'next/image';
import css from 'styled-jsx/css';
import { Desktop, Mobile } from '@/components/responsive';
interface ItemProps {
  title: string;
  prompt: string | JSX.Element;
  logo?: string;
  account?: string;
  status?: boolean;
  click?: () => void;
  btnText?: string;
  showSwitch?: boolean | null;
  onCheckChange?: () => void | null;
}
const Item = ({
  title,
  prompt,
  logo,
  account,
  status,
  showSwitch,
  onCheckChange,
  click,
  btnText,
}: ItemProps) => {
  const { isMobile } = useResponsive();
  const showSubTitleList = [LANG('邮箱验证'), LANG('手机号'), LANG('防钓鱼码'), LANG('手机号'), LANG('谷歌验证')];
  const shouldShowVerifiedIcon = showSubTitleList.includes(title);
  const ListRight = () => {
    return (
      <div className='list-right' key={logo}>
        
        {shouldShowVerifiedIcon &&
            <span className='list-account'>
              <Desktop>
                {
                  status ? <Svg src='/static/icons/primary/common/color-select.svg' width={13} height={13} style={{ marginRight: '8px' }} color='#2AB26C' /> : <Image src='/static/icons/primary/common/warning-tips.svg' width={14} height={14} alt='icon' />
                }
              </Desktop>
              <div>{status ? !!account ? account : LANG('已绑定') : LANG('未绑定')}</div>
              <Mobile>
                {
                  status ? <Svg src='/static/icons/primary/common/color-select.svg' width={13} height={13} style={{ marginLeft: '8px' }} color='#2AB26C' /> : <Image src='/static/icons/primary/common/warning-tips.svg' width={14} height={14} alt='icon' />
                }
              </Mobile>
            </span>
          }
        
        {(showSwitch && status) && <Switch checked={status} onChange={onCheckChange} />}
        {/* {showSwitch && <Switch checked={status} onChange={onCheckChange} />} */}
        {/* {modifyClick && (
          <Button onClick={modifyClick} className='modify-btn'>
            {LANG('编辑')}
          </Button>
        )} */}
        {
          !isMobile && ((logo !== 'email' && !showSwitch) &&
            <Button onClick={click} className='modify-btn'>
              {btnText != null ? btnText : status ? LANG('编辑') : LANG('绑定')}
            </Button>)
        }
        {
          !isMobile && ((logo === 'email' && !status && !showSwitch) &&
            <Button onClick={click} className='modify-btn'>
              {LANG('绑定')}
            </Button>)
        }
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
              <Svg src={`/static/icons/primary/common/${logo}.svg`} width={20} height={20} color={'var(--text_1)'} className='list-logo' />
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
        {
          (!showSwitch &&
            <Button onClick={click} size={Size.SM} rounded className='modify-btn'>
              {btnText != null ? btnText : status ? LANG('编辑') : LANG('绑定')}
            </Button>)
        }
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
        {logo ? <Svg src={`/static/icons/primary/common/${logo}.svg`} width={20} height={20} color={'var(--text_1)'} className='list-logo' /> : <div className='list-logo' />}
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
    width: 550px;
    align-items: center;
    justify-content: start;
    .list-logo {
      width: 20px;
      height: 20px;
      cursor: pointer;
      div{
        svg{
          fill: var(--text_1) !important;
        }
      }
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
        margin-top: 5px;
        font-size: 12px;
        font-weight: 400;
        color: var(--text_3);
        line-height: 17px;
        :global(.yellow) {
          color: var(--brand);
          border-bottom: 1px solid var(--brand);
        }
      }
    }
  }
`;
const listRightStyles = css`
  .list-right {
    display: flex;
    flex:1;
    justify-content:flex-end;
    align-items: center;
    .list-account {
      display: flex;
      align-items: center;
      font-size: 14px;
      font-weight: 500;
      color: var(--text_1);
      flex: 1 auto;
      :global(img) {
        margin-right: 8px;
      }
      @media ${MediaInfo.mobile} {
         min-width: 67px;
          :global(img) {
            margin:0;
            margin-left: 5px;
          }
      }
    }
    :global(.modify-btn) {
      width: 72px;
      height: 32px;
      min-height: 32px;
      line-height: 32px;
      border-radius: 16px;
      font-size: 14px;
      coursor: pointer;
      margin-left: 16px;
      color: var(--text_1);
      background-color: var(--fill_3);
      @media ${MediaInfo.mobile} {
        padding: 3px 17px;
        margin-top:5px;
      }
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
    @media ${MediaInfo.mobile}{
      padding: 12px 0;
    }
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
      margin-left: 34px;
      :global(.yellow) {
        color: var(--skin-main-font-color);
        border-bottom: 1px solid var(--skin-main-font-color);
      }
    }
    :global(.modify-btn) {
      @media ${MediaInfo.mobile} {
        padding: 3px 17px;
        margin-top: 10px;
      }
    }
  }
`;


const styles = css`
  .list-item {
    padding: 25px 0;
    // border-bottom: 1px solid var(--theme-border-color-2);
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
