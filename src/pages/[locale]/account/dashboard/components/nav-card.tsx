import CommonIcon from '@/components/common-icon';
import { Desktop } from '@/components/responsive';
import { useRouter } from '@/core/hooks';
import { LANG, Lang, TrLink } from '@/core/i18n';
import { clsx } from '@/core/utils';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import { MAIN_NAV_MENU, MAIN_NAV_TYPE } from '../constants';
import { useActiveNavIcon } from '../use-active-nav-icon';
import { RecentRecordCard } from './record-card';

export const NavCard = () => {
  const [currentYear, setCurrentYear] = useState('');
  const router = useRouter();
  const { locale: lang } = router.query;
  const { NAV_ICON_MAP, isActive } = useActiveNavIcon();
  const language = Lang.getLanguageHelp(lang);

  useEffect(() => {
    setCurrentYear(dayjs().format('YYYY'));
  }, []);

  const TERMS_URL = `https://support.y-mex.com/hc/${language}/articles/5691838199183-Terms-of-Use`;
  const PRIVACY_URL = `https://support.y-mex.com/hc/${language}/articles/5691793917839-Privacy-Terms`;

  const NAV_ITEMS = [
    {
      href: MAIN_NAV_MENU.DASHBOARD,
      query: MAIN_NAV_TYPE.OVERVIEW,
      title: LANG('总览'),
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
          key={item.query}
          className={clsx('nav-item', isActive(item.query) && 'nav-active')}
          query={{ type: item.query }}
          href={item.href}
        >
          {/* <Svg src={NAV_ICON_MAP[item.query]} width={24} height={24} currentColor='#C5C5C4' /> */}
          <CommonIcon name={NAV_ICON_MAP[item.query]} size={24} enableSkin />
          <span className='title'>{item.title}</span>
        </TrLink>
      );
    });
  };
  return (
    <div className='nav-card-container'>
      <div className='top-nav'>
        <Desktop forceInitRender={false}>{renderNavItems()}</Desktop>
      </div>
      <div className='recent-withdraw-record'>
        <RecentRecordCard />
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
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .nav-card-container {
    width: 260px;
    height: calc(100vh - 310px);
    .top-nav {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 10px;
      padding: 20px 30px 30px 22px;
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
    .recent-withdraw-record {
      padding: 0 20px 20px;
    }
    .nav-footer {
      text-align: center;
      margin-top: 10px;
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
