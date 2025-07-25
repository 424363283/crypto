import CommonIcon from '@/components/common-icon';
import { ACCOUNT_TYPE } from '@/components/modal';
import { Desktop } from '@/components/responsive';
import { useRouter } from '@/core/hooks';
import { TrLink } from '@/core/i18n';
import { MediaInfo, clsx, getUrlQueryParams } from '@/core/utils';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';

type NavItemProps = {
  query: any;
  title: string;
  href: string;
  icon: string;
  activeIcon?: string;
  click?: () => void;
}

type NavProps = {
  navItems: NavItemProps[];
  close?: () => void;
};

const NavListItem = (props: NavItemProps) => {
  const router = useRouter();
  const item = props;
  const isActive = (menuItem: NavItemProps) => {
    const currentType = getUrlQueryParams('type');
    const currentAccount = getUrlQueryParams('account');
    const lastPathname = router.query.id;
    if (!currentType && menuItem.query?.type === 'overview') return true;
    if (menuItem.href?.includes(lastPathname?.toLowerCase())) return true;
    if (menuItem.query?.type !== currentType) return false;
    if (menuItem.query?.account) {
      return menuItem.query?.account === currentAccount;
    } else if (currentAccount) {
      return false;
    }
    return true;
  }
  // const active = isActive(item.query?.type || item.query?.id, item.query.account, item.href);
  const active = isActive(item);
  const currentIcon = active ? (item.activeIcon || item.icon) : item.icon;
  return (
    <>
      <li
        className={clsx('nav-list-item', active && 'nav-list-item-active')}
        onClick={() => item.click?.()}
      >
        <TrLink
          className='nav-list-item-content'
          query={{ ...item.query }}
          href={item.href}
        >
          <CommonIcon key={item.query} name={currentIcon} size={20} enableSkin={active} />
          <span className='title'>{item.title}</span>
        </TrLink>
      </li>
      <style jsx>{navListItemStyles}</style>
    </>
  )
}
const navListItemStyles = css`
.nav-list-item {
    line-height: 16px;
    padding: 24px;
  @media ${MediaInfo.mobileOrTablet} {
    padding: 24px 8px;
  }
  .title {
    margin-left: 8px;
  }
  :global(.nav-list-item-content) {
    display: flex;
    color: var(--text_2);
    align-items: center;
    width: 100%;
    font-size: 16px;
    font-weight: 500;
    margin-right: 10px;
  }
  &.nav-list-item-active {
    .title {
      color: var(--text_brand);
    }
  }
}
`;
export const NavList = (props: NavProps) => {
  const { navItems, close } = props;
  return (
    <div className='nav-list-container'>
      <ul className='nav-list'>
        {navItems.map((item: NavItemProps) => {
          return (
            <NavListItem
              key={item.title}
              query={item.query}
              icon={item.icon}
              activeIcon={item.activeIcon}
              title={item.title}
              href={item.href}
              click={() => close?.()}
            />
          )
        })}
      </ul>
      <style jsx>{navListStyles}</style>
    </div>
  );
}

const navListStyles = css`
  .nav-list-container {
    width: 100%;
    padding: 24px 0;
    position: sticky;
    top: 56px;
    @media ${MediaInfo.mobileOrTablet} {
      position: block;
      top: 0;
      width:auto;
      padding: 0;
    }
    .nav-list {
      margin: 0;
      padding: 0;
      :global(.nav-list-item) {
        &:hover {
          color: var(--text_brand);
        }
      }
      :global(.nav-active) {
        color: var(--theme-font-color-1);
        :global(.title) {
          color: var(--theme-font-color-1);
          font-size: 14px;
          font-weight: 500;
          width: 90px;
        }
      }
    }
  }
`;
type CommonLayoutProps = {
  children: JSX.Element;
  navItems?: NavProps['navItems'];
};



export const CommonLayout = (props: CommonLayoutProps) => {
  const { children, navItems } = props;
  const [type, setType] = useState('overview');

  useEffect(() => {
    setType(getUrlQueryParams('type'));
  }, [getUrlQueryParams('type')]);

  return (
    <div className='common-layout'>
      {
        navItems && <Desktop>
          <div className='left-column'>
            <NavList navItems={navItems} />
          </div>
        </Desktop>
      }
      <div className='common-content'>{children}</div>
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .common-layout {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: calc(100vh - 64px);

    @media ${MediaInfo.desktop} {
      display: flex;
      flex-direction: row;
    }
    .left-column {
      height: auto;
      width: 260px;
      background: var(--fill_bg_1);
      flex-shrink: 0;
      .top-banner {
        padding: 20px;
        height: 246px;
        width: 100vw;
        background-color: var(--theme-secondary-bg-color);
      }
      .bottom {
        height: 100%;
        width: 100vw;
      }
    }
    .common-content {
      width: 100%;
      height: 100%;
      padding: 8px 8px 0;
      overflow-x: hidden;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 8px;
      @media ${MediaInfo.mobile} {
        margin-left: 0;
        width: auto;
        padding: 8px;
      }
      :global(.asset-account-header) {
        background-color: var(--fill_2);
        :global(.nav-title) {
          max-width: 1224px;
          line-height: 20px;
          padding: 36px 0;
          margin: 0 auto;
          @media ${MediaInfo.tablet} {
            padding: 36px 20px;
          }
          @media ${MediaInfo.mobile} {
            padding: 36px 0;
          }
        }
      }
    }
  }
`;
