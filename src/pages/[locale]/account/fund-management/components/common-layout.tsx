import CommonIcon from '@/components/common-icon';
import { Desktop, MobileOrTablet } from '@/components/responsive';
import { ScrollXWrap } from '@/components/scroll-x-wrap';
import { useRouter } from '@/core/hooks';
import { LANG, Lang, TrLink } from '@/core/i18n';
import { MediaInfo, clsx, getUrlQueryParams } from '@/core/utils';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import AvatarCard from '../../dashboard/components/avatar-card';

type NavProps = {
  navItems: {
    query: any;
    icon: string;
    title: string;
    href: string;
  }[];
};

const NavItems = (props: any) => {
  const { navItems } = props;
  const router = useRouter();
  const isActive = (param: string | undefined, url?: string) => {
    const type = getUrlQueryParams('type');
    const lastPathname = router.query.id;
    if (!type && param === 'overview') return true;
    if (url?.includes(lastPathname?.toLowerCase())) return true;
    return param === type;
  };
  return navItems.map((item: any) => {
    const active = isActive(item.query?.type || item.query?.id, item.href);
    const currentIcon = active ? item.activeIcon : item.icon;
    return (
      <TrLink
        key={item.title}
        className={clsx('nav-item', isActive(item.query?.type, item.href) && 'nav-active')}
        query={{ ...item.query }}
        href={item.href}
      >
        <CommonIcon key={item.query} name={currentIcon} size={24} enableSkin={active} />
        <span className='title'>{item.title}</span>
      </TrLink>
    );
  });
};

const MobileNavCard = (props: any) => {
  const { navItems } = props;
  return (
    <MobileOrTablet>
      <ScrollXWrap prevIcon={<></>} nextIcon={<></>}>
        <div className='mobile-nav-card'>
          <NavItems navItems={navItems} />
        </div>
      </ScrollXWrap>
      <style jsx>{mobileStyles}</style>
    </MobileOrTablet>
  );
};
const mobileStyles = css`
  :global(.common-layout .scroll-wrap) {
    :global(.prev) {
      display: none !important;
    }
    :global(.next) {
      display: none !important;
    }
  }
  .mobile-nav-card {
    display: flex;
    align-items: center;
    padding: 20px 18px 0;
    position: relative;
    z-index: 99;
    @media ${MediaInfo.mobile} {
      padding: 10px;
    }
    :global(.nav-item) {
      padding: 10px 15px;
      min-width: 174px;
      background-color: var(--theme-background-color-2);
      border-radius: 8px;
      display: flex;
      align-items: center;
      color: var(--theme-font-color-3);
      font-size: 14px;
      margin-right: 10px;
      :global(.title) {
        margin-left: 5px;
      }
    }
  }
`;
const NavCard = (props: NavProps) => {
  const { navItems } = props;
  const [currentYear, setCurrentYear] = useState('');
  const router = useRouter();
  const { locale: lang } = router.query;
  const language = Lang.getLanguageHelp(lang);

  useEffect(() => {
    setCurrentYear(dayjs().format('YYYY'));
  }, []);

  const TERMS_URL = `https://support.y-mex.com/hc/${language}/articles/5691838199183-Terms-of-Use`;
  const PRIVACY_URL = `https://support.y-mex.com/hc/${language}/articles/5691793917839-Privacy-Terms`;
  return (
    <div className='nav-card-container'>
      <div className='top-nav'>
        <NavItems navItems={navItems} />
      </div>
      <div className='border-bottom'>
        <p className='line'></p>
      </div>
      <div className='nav-footer'>
        <div className='left-area'>{`© 2020-${currentYear} y-mex.com. All rights reserved.`}</div>
        <div className='advocate'>
          <a href={TERMS_URL} target='_blank' className='link'>
            {LANG('Terms of Service')}
          </a>
          &nbsp;|&nbsp;&nbsp;
          <a href={PRIVACY_URL} target='_blank' className='link'>
            {LANG('Privacy Terms')}
          </a>
        </div>
      </div>
      <style jsx>{navCardStyles}</style>
    </div>
  );
};
const navCardStyles = css`
  .nav-card-container {
    width: 260px;
    height: calc(100vh - 310px);
    .top-nav {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 10px;
      padding: 20px 30px 16px 22px;
      :global(.nav-item) {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        width: 100px;
        height: 94px;
        justify-content: center;
        cursor: pointer;
        :global(.title) {
          margin-top: 10px;
          font-size: 12px;
          font-weight: 400;
          color: var(--theme-font-color-3);
        }
      }
      :global(.nav-active) {
        color: var(--theme-font-color-1);
        border-radius: 15px;
        background: var(--theme-background-color-2-3);
        box-shadow: rgba(0, 0, 0, 0.08) 1px 0px 10px 0px;
        :global(.title) {
          color: var(--theme-font-color-1);
          font-size: 14px;
          font-weight: 500;
          width: 90px;
        }
      }
    }
    .border-bottom {
      padding: 0 20px;
      .line {
        border: 1px solid var(--skin-border-color-1);
      }
    }
    .nav-footer {
      text-align: center;
      margin-top: 13px;
      .left-area {
        color: var(--theme-font-color-3);
        font-size: 12px;
      }
      .advocate {
        margin-top: 10px;
        color: var(--theme-font-color-3);
        .link {
          font-size: 12px;
          font-weight: 400;
          color: var(--theme-font-color-3);
          &:hover {
            color: var(--theme-font-color-1);
          }
        }
      }
    }
  }
`;
type CommonLayoutProps = {
  children: JSX.Element;
  navItems: NavProps['navItems'];
};
export const CommonLayout = (props: CommonLayoutProps) => {
  const { children, navItems } = props;
  return (
    <div className='common-layout'>
      <MobileOrTablet>
        <AvatarCard hideEdit />
      </MobileOrTablet>
      <Desktop>
        <div className='left-column'>
          <div className='top-banner'>
            <AvatarCard hideEdit />
          </div>
          <div className='bottom'>
            <NavCard navItems={navItems} />
          </div>
        </div>
      </Desktop>
      <MobileNavCard navItems={navItems} />
      <div className='common-content'>{children}</div>
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .common-layout {
    overflow-y: scroll;
    position: relative;
    display: flex;
    flex-direction: column;
    @media ${MediaInfo.desktop} {
      display: flex;
      flex-direction: row;
    }
    height: 100%;
    min-height: calc(100vh - 64px);
    background-color: var(--theme-background-color-5);
    .left-column {
      height: 100%;
      width: 258px;
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
      margin-top: 20px;
      overflow-x: hidden;
      @media ${MediaInfo.desktop} {
        padding-right: 20px;
      }
      @media ${MediaInfo.tablet} {
        padding: 0 20px;
      }
      @media ${MediaInfo.mobile} {
        padding: 0 10px 20px;
        margin-top: 0px;
      }
      overflow-y: auto;
    }
  }
`;
