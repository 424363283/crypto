import { ScrollXWrap } from '@/components/scroll-x-wrap';
import { Svg } from '@/components/svg';
import { LANG, TrLink } from '@/core/i18n';
import { MediaInfo, clsx } from '@/core/utils';
import css from 'styled-jsx/css';
import { MAIN_NAV_MENU, MAIN_NAV_TYPE } from '../constants';
import { useActiveNavIcon } from '../use-active-nav-icon';

export const MobileNav = ({ className }: { className?: string }) => {
  const { NAV_ICON_MAP, isActive } = useActiveNavIcon();
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
          className={clsx('card', isActive(item.query) && 'nav-active')}
          href={item.href}
          query={{ type: item.query }}
          key={item.query}
        >
          <Svg src={NAV_ICON_MAP[item.query]} width={20} height={20} currentColor='#C5C5C4' />
          <span className='title'>{item.title}</span>
        </TrLink>
      );
    });
  };
  return (
    <ScrollXWrap prevIcon={<></>} nextIcon={<></>} className={className}>
      <div className='mobile-nav-card'>
        {renderNavItems()}
        <style jsx>{styles}</style>
      </div>
    </ScrollXWrap>
  );
};
const styles = css`
  :global(.scroll-wrap) {
    position: absolute;
    width: 100%;
    margin-bottom: -10px;
    @media ${MediaInfo.mobile} {
      padding-left: 10px;
    }
    @media ${MediaInfo.tablet} {
      padding: 0 20px;
    }
  }
  .mobile-nav-card {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 10px;
    margin-bottom: 20px;
    :global(.card) {
      border-radius: 8px;
      display: flex;
      align-items: center;
      color: var(--theme-font-color-3);
      background-color: var(--theme-background-color-2-3);
      padding: 12px 25px 10px 15px;
      :global(.title) {
        margin-left: 5px;
        font-size: 14px;
      }
    }
    :global(.nav-active) {
      :global(.title) {
        color: var(--theme-font-color-1);
      }
    }
  }
`;
