import CommonIcon from '@/components/common-icon';
import { LANG, TrLink } from '@/core/i18n';
import { clsx, MediaInfo } from '@/core/utils';
import css from 'styled-jsx/css';
import { MAIN_NAV_MENU, MAIN_NAV_TYPE } from '../constants';
import { useActiveNavIcon } from '../use-active-nav-icon';

export const NavCard:React.FC<{close?:()=>void}> = ({close}) => {
  const { NAV_ICON_MAP, isActive } = useActiveNavIcon();
 
  const NAV_ITEMS = [
    {
      href: MAIN_NAV_MENU.DASHBOARD,
      query: MAIN_NAV_TYPE.OVERVIEW,
      title: LANG('账户总览'),
    },
    {
      href: MAIN_NAV_MENU.DASHBOARD,
      query: MAIN_NAV_TYPE.SECURITY_SETTING,
      title: LANG('安全中心'),
    },
    {
      href: MAIN_NAV_MENU.DASHBOARD,
      query: MAIN_NAV_TYPE.ADDRESS,
      title: LANG('提币地址'),
    },
    {
      href: MAIN_NAV_MENU.DASHBOARD,
      query: MAIN_NAV_TYPE.SETTING,
      title: LANG('设置'),
    },
  ];

  const renderNavItems = () => {
    return NAV_ITEMS.map((item) => {
      return (
        <TrLink
          native
          key={item.query}
          className={clsx('nav-item', isActive(item.query) && 'nav-active')}
          query={{ type: item.query }}
          href={item.href}
          onClick={()=>close?.()}
        >
          <CommonIcon name={NAV_ICON_MAP[item.query]} size={20} enableSkin />
          <span className='title'>{item.title}</span>
        </TrLink>
      );
    });
  };

  return (
    <div className='nav-card-container'>
      <div className='top-nav'>
        {renderNavItems()}
      </div>
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .nav-card-container {
    width: 100%;
    padding: 24px 0;
    position: sticky;
    top: 56px;
    .top-nav {
      @media ${MediaInfo.mobileOrTablet} {
        padding: 0px 30px 30px 20px;
      }
      :global(.nav-item) {
        display: flex;
        align-items: center;
        text-align: center;
        justify-content: left;
        cursor: pointer;
        line-height: 16px;
        padding: 24px;
        @media ${MediaInfo.mobileOrTablet} {
          padding: 0;
          height: 58px;
        }
        :global(.title) {
          font-size: 16px;
          font-weight: 500;
          color: var(--text_2);
          text-align: left;
          margin-left: 8px;
        }
      }
      :global(.nav-active) {
        color: var(--theme-font-color-1);
        border-radius: 15px;
        :global(.title) {
          color: var(--brand);
        }
      }
    }
  }
`;
