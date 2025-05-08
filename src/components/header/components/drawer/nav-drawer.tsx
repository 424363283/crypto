import { Switch } from 'antd';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';

import { Button } from '@/components/button';
import CommonIcon from '@/components/common-icon';
import { MobileDrawer } from '@/components/drawer';
import Menu from '@/components/menu';
import { Mobile } from '@/components/responsive';
import { useRouter, useTheme } from '@/core/hooks';
import { LANG, TrLink, Lang } from '@/core/i18n';
import { useAppContext } from '@/core/store';

import { clsx, isTradePage, setCookie } from '@/core/utils';
import { RootColor } from '@/core/styles/src/theme/global/root';

import { HEADER_PATH } from '../../constants';
import { ThemeModeSwitch } from '../switch';

export interface NavDrawerProps {
  onClose: () => void;
  open: boolean;
  menuItems?: any[];
}
const enableLite = process.env.NEXT_PUBLIC_LITE_ENABLE === 'true';

const menuItems = [
  {
    label: LANG('资产'),
    href: '/account/fund-management/assets-overview?type=overview'
  },
  {
    label: LANG('行情'),
    href: '/markets'
  },
  {
    label: LANG('衍生品'),
    suffixIcon: 'common-hot-0',
    children: [
      // {
      //   label: LANG('现货'),
      //   href: '/lite/btcusdt'
      // },
      {
        label: LANG('U本位合约'),
        href: '/swap/btc-usdt'
        // suffixIcon: 'common-hot-0'
      },
      // {
      //   label: LANG('币本位合约'),
      //   href: '/swap/btc-usd',
      //   // suffixIcon: 'common-hot-0',
      // },
      {
        label: LANG('简易合约'),
        href: '/lite/btcusdt'
      }

      // {
      //   label: LANG('杠杆代币'),
      //   href: '/spot/btc3l_usdt',
      //   // suffixIcon: 'common-hot-0',
      // },
      // {
      //   label: LANG('模拟交易'),
      //   href: '/swap/demo?id=sbtc-susdt',
      //   // suffixIcon: 'common-hot-0',
      // },
    ].filter(item => {
      if (item.label === LANG('简单合约')) {
        return enableLite;
      }
      return true;
    })
  },
  {
    label: LANG('币币交易'),
    children: [
      {
        label: LANG('专业版'),
        href: '/spot/btc_usdt'
      },
      // {
      //   label: LANG('币币闪兑'),
      //   href: '/convert'
      // }
    ]
  },
  {
    label: LANG('跟单'),
    href: '/copyTrade'
  },
  {
    label: LANG('合伙人计划'),
    href: '/partnerProgram'
  },
  // {
  //   label: LANG('策略交易'),
  //   children: [],
  //   href: HEADER_PATH.COPY_TRADING_BOT,
  //   icon: 'header-spot-0'
  // },
  // {
  //   label: LANG('跟单大厅'),
  //   icon: '/header/media/copy-trading.svg',
  //   href: HEADER_PATH.COPY_TRADE
  // },
  // {
  //   label: LANG('邀请计划'),
  //   icon: 'header-affiliate-0',
  //   children: [
  //     {
  //       label: LANG('全球合伙人'),
  //       href: HEADER_PATH.AFFILIATE
  //     },
  //     {
  //       label: LANG('成为YMEX ARMY'),
  //       href: HEADER_PATH.ARMY
  //     }
  //   ]
  // },
  // {
  //   label: LANG('新手奖励'),
  //   icon: 'header-welcome-rewards-0',
  //   href: HEADER_PATH.NEWER_TASK
  // }
].filter(item => {
  if (item.label === LANG('跟单大厅')) {
    return enableLite;
  }
  return true;
});

// const MenuItem = ({ item }: any) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const handleToggle = () => {
//     setIsOpen(!isOpen);
//   };
// };

const OtherConfig = () => {
  const router = useRouter();
  const [lang, setLang] = useState<string>('en');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const localLang = router.query.locale || 'en';
    setLang(localLang);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const onLanguageChange = (key: string) => {
    setCookie('lang', key, 365);
    const theme = router.query?.theme as string;
    const id = router.query?.id?.toLowerCase() as string;
    const tab = router.query?.tab?.toLowerCase() as string;
    let href: string = (router as any).pathname
      .replace('[locale]', key)
      .replace('[theme]', theme)
      .replace('[id]', id)
      .replace('[tab]', tab);
    if (isTradePage(href)) {
      href = href.toLowerCase();
    }
    if (href === '/') {
      href += key + location.search;
    } else {
      href += location.search;
    }

    if (key === 'ko') {
      if (!localStorage[RootColor.MANUAL_TRIGGER]) {
        localStorage[RootColor.KEY] = 3;
      }
    } else {
      if (!localStorage[RootColor.MANUAL_TRIGGER]) {
        localStorage[RootColor.KEY] = 1;
      }
    }
    location.replace(href);
  };
  return (
    <ul className="nav-list">
      <li>
        <div className="menu-item">
          <div className="title-wrap">
            <div className="menu-title" onClick={handleToggle}>
              <span className="title">{Lang.getLanguageMap[lang]}</span>
              <div className="triangle">
                <CommonIcon name={`common-mobile-triangle-${isOpen ? 'up' : 'down'}`} size={10} />
              </div>
            </div>
          </div>
          {isOpen && (
            <ul className="menu-items">
              {Object.entries(Lang.getLanguageMap).map(([key, value]) => (
                <li>
                  <span className={clsx(key === lang && 'active-menu-item')} onClick={() => onLanguageChange(key)}>
                    {value}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </li>
      {/* <li>
        <div className="menu-item">
          <div className="title-wrap">
            <div className="menu-title">
              <span className="title">USD-$</span>
              <div className="triangle">
                <CommonIcon name={'common-mobile-triangle-down'} size={10} />
              </div>
            </div>
          </div>
        </div>
      </li> */}
    </ul>
  );
};

const NavDrawer = (props: NavDrawerProps) => {
  const { onClose, open } = props;
  const { isLogin } = useAppContext();
  const { isDark, toggleTheme } = useTheme();

  if (!open) return null;
  return (
    <MobileDrawer onClose={onClose} open={open} className="nav-drawer">
      {!isLogin ? (
        <div className="login-register-wrapper">
          <TrLink href="/login" className="login-btn">
            {LANG('登录')}
          </TrLink>
          <TrLink href="/register" native={false} className="register-btn">
            <Button type="primary" className="nav-register-btn right-line">
              {LANG('注册')}
            </Button>
          </TrLink>
        </div>
      ) : (
        <TrLink href="/account/dashboard" query={{type:'overview'}} native={false} className="account-btn">
          {LANG('账号与安全')}
          <CommonIcon name="common-arrow-more-0" width={24} height={24} enableSkin />
        </TrLink>
      )}
      <Menu data={props.menuItems || menuItems} className="nav-list"></Menu>
      <OtherConfig />
      <div className="theme-mode">
        <div className="title">
          <span>{LANG('夜间模式')}</span>
        </div>
        <Switch onChange={toggleTheme} checked={isDark} className="theme-mode-switch" />
        {/* <ThemeModeSwitch onChange={toggleTheme} checked={isDark} /> */}
      </div>

      <style jsx>{styles}</style>
    </MobileDrawer>
  );
};

const styles = css`
  :global(.nav-drawer) {
    :global(.ant-drawer-header) {
      border-bottom: 1px solid var(--fill_line_1) !important;
    }

    :global(.ant-drawer-content) {
      background-color: var(--theme-background-color-2);
    }
    .login-register-wrapper {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 8px 0;
      :global(.login-btn) {
        color: var(--brand);
        font-weight: 500;
        font-size: 14px;
        border: 1px solid var(--brand);
        margin-bottom: 8px;
      }
      :global(.register-btn) {
        color: var(--text_white);
        background: var(--brand);
      }
      :global(.login-btn),
      :global(.register-btn) {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 2.75rem;
        border-radius: 2.75rem;
      }
    }
    :global(.account-btn) {
      padding: 8px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-height: 2.5rem;
      border-bottom: 1px solid var(--fill_line_1);
      color: var(--text_1);
    }
    :global(.ant-drawer-body) {
      :global(.nav-list) {
        padding: 8px 0;
        margin: 0;

        :global(.menu-item) {
          display: flex;
          align-items: flex-start;
          justify-content: center;
          flex-direction: column;
          min-height: 2.5rem;
          :global(.title-wrap) {
            width: 100%;
            height: 2.5rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: relative;
          }
          :global(.menu-title) {
            flex-grow: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          :global(.title) {
            font-size: 14px;
            font-weight: 400;
            color: var(--text_1);
          }
          :global(.triangle) {
            width: 1.5rem;
            height: 1.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
        :global(.menu-items) {
          width: calc(100% - 2rem);
          position: relative;
          top: 0;
          margin: 0;
          padding: 0 1rem;
          background-color: transparent;
        }
        :global(.menu-items li) {
          display: flex;
          align-items: center;
          margin: 0;
          height: 2.75rem;
          :global(a),
          :global(span) {
            font-size: 14px;
            font-weight: 400;
            color: var(--text_2);
            width: 100%;
          }
          :global(.active-menu-item) {
            color: var(--brand);
          }
        }
        border-bottom: 1px solid var(--skin-border-color-1);
      }
      :global(.direct) {
        padding: 0;
        padding-top: 8px;
        border: 0;
      }
      :global(.theme-mode) {
        margin-top: 8px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 2.75rem;
        :global(.title) {
          font-size: 14px;
          font-weight: 400;
          color: var(--text_1);
          display: flex;
          align-items: center;
        }
        :global(.theme-mode-switch) {
          min-width: 2rem;
          height: 1.25rem;
          :global(.ant-switch-handle) {
            top: 0.125rem;
            width: 1rem;
            height: 1rem;
            inset-inline-start: 0.125rem;
          }
          :global(.ant-switch-inner) {
            padding: 0;
            background: var(--text_2);
          }
        }
        :global(.ant-switch-checked .ant-switch-handle) {
          inset-inline-start: calc(100% - 1.125rem);
          &:before {
            background: var(--text_2);
          }
        }
        :global(.ant-switch-checked .ant-switch-inner) {
          background: var(--brand);
        }
      }
    }
  }
`;
export default NavDrawer;
