import CommonIcon from '@/components/common-icon';
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
  const isActive = (param: string | undefined, url?: string) => {
    const type = getUrlQueryParams('type');
    const lastPathname = router.query.id;
    if (!type && param === 'overview') return true;
    if (url?.includes(lastPathname?.toLowerCase())) return true;
    return param === type;
  }
  const active = isActive(item.query?.type || item.query?.id, item.href);
  const currentIcon = active ? (item.activeIcon || item.icon) : item.icon;
  return (
    <>
      <li
        className={clsx('nav-list-item', isActive(item.query?.type, item.href) && 'nav-list-item-active')}
        onClick={()=> item.click?.()}
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
  line-height: 68px;
  padding: 0 8px;
  .title {
    margin-left: 8px;
  }
  :global(.nav-list-item-content) {
    display: flex;
    color: var(--text-secondary);
    align-items: center;
    width: 100%;
    font-size: 16px;
    font-weight: 500;
    margin-right: 10px;
  }
  &.nav-list-item-active {
    .title {
      color: var(--text-brand);
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
              click={()=> close?.()}
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
    width: 308px;
    @media ${MediaInfo.mobileOrTablet} {
      width:auto;
    }
    .nav-list {
      margin: 0;
      @media ${MediaInfo.mobileOrTablet} {
        padding: 0;
      }
      :global(.nav-list-item) {
        &:hover {
          color: var(--text-brand);
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
    background-color: var(--bg-1);
    @media ${MediaInfo.mobileOrTablet} {
      background:var(--fill-3);
    }
    @media ${MediaInfo.desktop} {
      display: flex;
      flex-direction: row;
      background-color: unset;
    }
    .left-column {
      height: 100%;
      width: 308px;
      position:sticky;
      top: 56px;
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
      padding: 8px;
      overflow-x: hidden;
      overflow-y: auto;
      @media ${MediaInfo.tablet} {
        padding: 0 20px;
      }
      @media ${MediaInfo.mobile} {
        padding: 0 10px 20px;
        margin-left: 0;
        width: auto;
      }
      :global(.asset-account-header) {
        background-color: var(--fill-2);
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
