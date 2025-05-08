import { useTheme, useResponsive } from '@/core/hooks';
import { useRouter } from '@/core/hooks/src/use-router';
import { LANG } from '@/core/i18n';
import { EVENT_NAME, EVENT_TRACK } from '@/core/sensorsdata';
import { useAppContext } from '@/core/store';
import { MediaInfo, getUrlQueryParams, isTradePage } from '@/core/utils';
import dynamic from 'next/dynamic';
import { ReactNode, memo, useEffect, useState } from 'react';
import { useImmer } from 'use-immer';
import CommonIcon from '../common-icon';
import { Desktop, DesktopOrTablet, MobileOrTablet, Mobile } from '../responsive';
import { TrActiveLink } from './components/active-link';
import CommonMenuItem from './components/common-menu';
import { ContractMenu } from './components/contract-menu';
import AboutDownload from './components/download';
import {
  NavDrawer
  //  SearchDrawer
} from './components/drawer/';
import { headerSwapDemoGuideStore } from './components/header-swap-demo-guide';
import DownloadIcon from './components/icon/download-icon';
import GlobalIcon from './components/icon/global-config-icon';
import LogoIcon from './components/icon/logo-icon';
import ThemeIcon from './components/icon/theme-icon';
import Menu from './components/menu';
import SKinMenuContent from './components/skin-menu';
import { HEADER_PATH } from './constants';
import SpotCoinContent from './components/spot-coin-content';
import MobileDrawer from '../drawer/mobile-drawer';
import { NavCard } from '@/pages/[locale]/account/dashboard/components/nav-card';
import { NavList } from '@/pages/[locale]/account/fund-management/components/common-layout';
import { useNavMap } from '@/pages/[locale]/account/fund-management/assets-overview/hooks/use-nav-map';
import { useQuoteSearchStore } from '@/store/quote-search';
import { Svg } from '@/components/svg';
import { WalletKey } from '@/core/shared/src/swap/modules/assets/constants';
import { WalletType } from '@/pages/[locale]/account/fund-management/assets-overview/components/types';

const LoginAndRegister = dynamic(() => import('./components/login-register-btn'), { ssr: false });
const DERIVATIVE_PATH = ['spot', 'swap', 'lite'];
const PARTNER_SHIP_PATH = [HEADER_PATH.AFFILIATE, HEADER_PATH.ARMY];
const SPOT_COIN_PATH = ['spot', 'convert'];
const BUY_COIN_PATH = ['fiat-crypto', 'p2p'];

// 添加导入
import { SearchDrawer } from './components/search-drawer';

function HeaderComponent({
  hideBorderBottom,
  desktopMenus,
  renderNavDrawer,
  backgroundColor
}: {
  exData?: any;
  hideBorderBottom?: boolean;
  desktopMenus?: ReactNode;
  renderNavDrawer?: (props: { onClose: () => void; open?: boolean }) => ReactNode;
  backgroundColor?: string;
}) {
  const router = useRouter();
  // const { isLogin } = useAppContext();
  // const enableLite = process.env.NEXT_PUBLIC_LITE_ENABLE === 'true';
  const [openNav, setOpenNav] = useState(false);
  const [bgColor, setBgColor] = useState(backgroundColor || 'var(--fill_bg_1)');
  const pathname = router.asPath;
  // const isZh = router.query.locale === 'zh';
  const [activeState, setActiveState] = useImmer({
    isDerivativeActive: false,
    isSpotCoinActive: false,
    isPartnerShipActive: false,
    isBuyCoinActive: false
  });
  const searchTerm = useQuoteSearchStore(state => state.searchTerm);
  const setSearchTerm = useQuoteSearchStore(state => state.setSearchTerm);
  const { showDemoMenu } = headerSwapDemoGuideStore;
  const { isDerivativeActive, isSpotCoinActive, isPartnerShipActive, isBuyCoinActive } = activeState;

  const [downloadIconActive, setDownloadIconActive] = useState(false);
  const [contractMenuHoverIndex, setContractMenuHoverIndex] = useState(0);
  const [skinIconActive, setSkinIconActive] = useState(false);
  const { isDark } = useTheme();
  const [searchVisible, setSearchVisible] = useState(false);
  const [urlType, setUrlType] = useState('');
  const account: keyof typeof WalletKey = getUrlQueryParams('account')?.toUpperCase();
  const wallet = WalletKey[account] || (urlType === 'swap-u' ? WalletKey.SWAP_U : '');

  const onMouseEnterDownload = () => {
    setDownloadIconActive(true);
  };
  const onMouseLeaveDownload = () => {
    setDownloadIconActive(false);
  };

  //显示侧边栏
  const showNav = () => {
    setOpenNav(true);
  };

  //关闭侧边栏
  const onCloseNavDrawer = () => {
    setOpenNav(false);
  };

  useEffect(() => {
    // 衍生品
    function checkIsDerivativePath(path: string) {
      const splitPath = path.split('/');
      return DERIVATIVE_PATH.some(key => {
        if (key === 'spot') {
          const index = splitPath.indexOf(key);
          const lastPathname = splitPath[splitPath.length - 1];
          return (index > -1 && lastPathname?.includes('3l')) || lastPathname?.includes('3s');
        }
        return splitPath.includes(key);
      });
    }
    // 币币交易
    const checkIsSpotCoin = () => {
      if (pathname.includes('spot/') || pathname.includes('convert')) {
        return !pathname.includes('3l') && !pathname.includes('3s');
      }
      return false;
    };
    const isDerivativeActive = checkIsDerivativePath(pathname);

    const isSpot = checkIsSpotCoin();
    const isSpotCoinActive = isSpot && SPOT_COIN_PATH.some(path => pathname.includes(path));
    const isPartnerShipActive = PARTNER_SHIP_PATH.some(path => pathname.includes(path));
    const isBuyCoinActive = BUY_COIN_PATH.some(path => pathname.includes(path));
    setActiveState(draft => {
      draft.isDerivativeActive = isDerivativeActive;
      draft.isSpotCoinActive = isSpotCoinActive;
      draft.isPartnerShipActive = isPartnerShipActive;
      draft.isBuyCoinActive = isBuyCoinActive;
    });

    const type = getUrlQueryParams('type');
    setUrlType(type);
  }, [pathname]);

  useEffect(() => {
    // const handleScroll = () => {
    //   if (window?.scrollY > 0) {
    //     setBgColor(!isDark ? '#fff' : 'var(--fill_bg_1)');
    //   } else {
    //     setBgColor(hasBgColor ?'var(--fill_2)': 'var(--fill_bg_1)');
    //   }
    // };
    // window.addEventListener('scroll', handleScroll);
    // return () => {
    //   window.removeEventListener('scroll', handleScroll);
    // };
  }, [isDark]);

  let dividedLine = isDark ? '/static/images/header/dark-icon-line.svg' : '/static/images/header/icon-line.svg';
  const onContractLeftMenuHover = (id: number) => {
    setContractMenuHoverIndex(id);
  };
  // const renderBuyCrypto = () => {
  //   if (!isZh) {
  //     return (
  //       <Menu
  //         showArrow
  //         width='235px'
  //         height='157px'
  //         position='left:0'
  //         content={
  //           <CommonMenuItem
  //             menuList={[
  //               {
  //                 name: LANG('快捷买币'),
  //                 tips: LANG('一件买币，快捷交易'),
  //                 href: HEADER_PATH.BUY_CRYPTO,
  //                 newTag: false,
  //               },
  //               {
  //                 name: 'P2P',
  //                 tips: LANG('多种方式，0手续费交易'),
  //                 newTag: true,
  //                 href: HEADER_PATH.P2P_ADVERTISE_LIST,
  //               },
  //             ]}
  //           />
  //         }
  //         isActive={isBuyCoinActive}
  //       >
  //         {LANG('买币')}
  //       </Menu>
  //     );
  //   }
  //   return <TrActiveLink href={HEADER_PATH.BUY_CRYPTO}>{LANG('快捷买币')}</TrActiveLink>;
  // };
  const titleList: any = {
    overview: '账户总览',
    'security-setting': '安全中心',
    address: '地址管理',
    setting: '设置',
    spot: '现货账户',
    'swap-u': {
      [WalletKey.SWAP_U]: LANG('U本位账户'),
      [WalletKey.COPY]: LANG('跟单账户')
    },
    records: '订单记录',
    'fund-history': '资金记录'
  };

  const [navShow, setNavShow] = useState(false);
  const [searchShow, setSearchShow] = useState(false);
  const typeList = ['overview', 'security-setting', 'address', 'setting', 'spot', 'swap-u', 'records', 'fund-history'];
  const getTitle = (type?: any, wallet?: WalletKey) => {
    if (pathname.includes('account/fund-management/assets-overview') && (!type || type == 'overview'  )) return '资产总览'
    if (pathname.includes('account/dashboard') && (!type || type == 'overview'  )) return '账户总览'
    return wallet ? titleList[type][wallet] : titleList[type];
  }
  const { NAV_MAP } = useNavMap(false);
  const lang = router.query?.locale || 'en';

  return (
    <>
      <header className="headerSwap">
        <div className="left">
          <TrActiveLink className="logo-brand" aria-label="home" href="">
            <LogoIcon />
          </TrActiveLink>
          {desktopMenus || (
            <Desktop>
              <TrActiveLink
                href={HEADER_PATH.MARKETS}
                onClick={() => {
                  EVENT_TRACK(EVENT_NAME.PC_TopButtonClick, {
                    first_button: '行情'
                  });
                }}
              >
                {LANG('行情')}
              </TrActiveLink>
              {
                <Menu
                  showArrow
                  width="235px"
                  height="auto"
                  position="left:0"
                  content={<SpotCoinContent />}
                  isActive={isSpotCoinActive}
                >
                  {LANG('币币交易')}
                </Menu>
              }
              <Menu
                itemClassName="header-guide-swap-demo-step-1"
                showArrow
                width={contractMenuHoverIndex === 4 ? '220px' : '620px'}
                hot={false}
                height="480px"
                position="left:0"
                isCommodity
                content={<ContractMenu onContractLeftMenuHover={onContractLeftMenuHover} />}
                isActive={isDerivativeActive}
                openContent={showDemoMenu}
                boxRadius="24px"
              >
                {LANG('衍生品')}
              </Menu>
              <TrActiveLink
                href={HEADER_PATH.COPY_TRADE}
                onClick={() => {
                  EVENT_TRACK(EVENT_NAME.PC_TopButtonClick, {
                    first_button: '跟单'
                  });
                }}
              >
                {LANG('跟单')}
              </TrActiveLink>
              {/* <TrActiveLink
                href={HEADER_PATH.PARTNERPROGRAM}
                onClick={() => {
                  EVENT_TRACK(EVENT_NAME.PC_TopButtonClick, {
                    first_button: '合伙人计划'
                  });
                }}
              >
                {LANG('合伙人计划')}
              </TrActiveLink> */}
              {/* <TrActiveLink
                href={HEADER_PATH.COPY_TRADING_BOT}
                onClick={() => {
                  EVENT_TRACK(EVENT_NAME.PC_TopButtonClick, {
                    first_button: '策略交易',
                  });
                }}
              >
                {LANG('策略交易')}
              </TrActiveLink> */}
              {/* {enableLite && <TrActiveLink href={HEADER_PATH.COPY_TRADE}>{LANG('跟单大厅')}</TrActiveLink>} */}
              <Menu
                className="hidden"
                showArrow
                width="235px"
                height="224px"
                position="left:0"
                content={
                  <CommonMenuItem
                    menuList={[
                      {
                        name: LANG('全球合伙人'),
                        tips: LANG('将你的流量转换为加密货币佣金'),
                        href: HEADER_PATH.AFFILIATE
                      },

                      { name: LANG('成为YMEX ARMY'), tips: LANG('推广YMEX并获得奖励'), href: HEADER_PATH.ARMY }
                      // {
                      //   name: LANG('邀请好友'),
                      //   tips: LANG('邀请好友 一起赚钱'),
                      //   href: isLogin ? HEADER_PATH.INVITE_FRIENDS : HEADER_PATH.LOGIN
                      // }
                    ]}
                  />
                }
                isActive={isPartnerShipActive}
              >
                {LANG('邀请计划')}
              </Menu>
              <TrActiveLink
                className="hidden"
                href={HEADER_PATH.NEWER_TASK}
                onClick={() => {
                  EVENT_TRACK(EVENT_NAME.PC_TopButtonClick, {
                    first_button: '新手奖励'
                  });
                }}
              >
                {LANG('新手奖励')}
              </TrActiveLink>
            </Desktop>
          )}
        </div>
        <div className="right">
          <Desktop>
            <LoginAndRegister />
          </Desktop>
          {/* {isLogin ? <Image src={dividedLine} height='20' width={1} alt='' className='icon-line' /> : null} */}
          <MobileOrTablet>
            {/* <LoginAndRegister /> */}
            {(pathname === `/${lang}` || pathname === `/${lang}/markets`) && (
              <Svg
                src="/static/images/header/search.svg"
                width={22}
                height={22}
                onClick={() => setSearchVisible(true)}
                className={'icon'}
              />
            )}
            <CommonIcon name="header-menu" size={24} onClick={showNav} className="icon" />
            <SearchDrawer
              open={searchVisible}
              onClose={() => setSearchVisible(false)}
              onSearch={value => setSearchTerm(value)}
            />
          </MobileOrTablet>
          {isTradePage(pathname) ? (
            <div className="icon-area">
              <Desktop>
                <GlobalIcon className="icon" />
                <Menu
                  className="hidden"
                  width="174px"
                  height="260px"
                  isIcon
                  position="right:0; top: 62px !important"
                  content={
                    <AboutDownload
                      onMouseLeaveDownload={onMouseLeaveDownload}
                      onMouseEnterDownload={onMouseEnterDownload}
                    />
                  }
                >
                  <DownloadIcon iconActive={downloadIconActive} />
                </Menu>
                <ThemeIcon className="icon theme-icon" />
              </Desktop>
            </div>
          ) : (
            <div className="icon-area">
              <Desktop>
                <GlobalIcon className="icon" />
                <Menu
                  className="hidden"
                  isIcon
                  width="174px"
                  height="260px"
                  position="right:0; top: 62px !important"
                  content={
                    <AboutDownload
                      onMouseLeaveDownload={onMouseLeaveDownload}
                      onMouseEnterDownload={onMouseEnterDownload}
                    />
                  }
                >
                  <DownloadIcon iconActive={downloadIconActive} />
                </Menu>
                <Menu
                  isIcon
                  width="238px"
                  height="58px"
                  position="right:0; top: 62px !important"
                  content={
                    <SKinMenuContent
                      onMouseLeaveDownload={() => setSkinIconActive(false)}
                      onMouseEnterDownload={() => setSkinIconActive(true)}
                    />
                  }
                >
                  <ThemeIcon className="theme-icon" />
                </Menu>
              </Desktop>
            </div>
          )}
        </div>
        {openNav &&
          (!renderNavDrawer ? (
            <NavDrawer onClose={onCloseNavDrawer} open={openNav} />
          ) : (
            renderNavDrawer({ onClose: onCloseNavDrawer, open: openNav })
          ))}
      </header>
      <Mobile>
        {(typeList.includes(urlType) ||
          pathname.includes('account/dashboard') ||
          pathname.includes('account/fund-management/assets-overview')) && (
          <div className="mobile-title" onClick={() => setNavShow(true)}>
            <CommonIcon name="header-more-option" size={20} className="icon" />
            <div className='title'>{LANG(getTitle(urlType, wallet))}</div>
          </div>
        )}
        <MobileDrawer onClose={() => setNavShow(false)} open={navShow} className="nav-drawer" direction="left">
          {pathname.includes('assets') || urlType == 'records' ? (
            <NavList navItems={NAV_MAP} close={() => setNavShow(false)} />
          ) : (
            <NavCard close={() => setNavShow(false)} />
          )}
        </MobileDrawer>
        {/* <SearchDrawer onClose={() => setSearchShow(false)} open={searchShow} /> */}
      </Mobile>
      <style jsx>
        {`
          header {
            position: sticky;
            top: 0;
            z-index: 999;
            height: 56px;
            width: 100%;
            display: flex;
            z-index: var(--zindex-header);
            justify-content: space-between;
            align-items: center;
            max-width: 100vw;
            background-color: var(--fill_bg_1);
            @media ${MediaInfo.mobile} {
              height: 2.75rem;
              background:var(--fill_bg_1);
            }
            .left {
              height: 100%;
              display: flex;
              align-items: center;
              &::-webkit-scrollbar {
                display: none;
              }
              :global(.header-item) {
                &:hover {
                  color: var(--text_brand);
                }
              }
              :global(.logo-brand) {
                padding-left: 24px;
                @media ${MediaInfo.mobile} {
                  padding-left: 1rem;
                }
              }
            }

            .right {
              height: 100%;
              display: flex;
              align-items: center;
              margin-right: 40px;
              @media ${MediaInfo.mobile} {
                margin-right: 1rem;
              }
              :global(.login-btn) {
                border-radius: 20px;
                width: 80px;
                height: 32px;
                min-height: 32px;
                line-height: 32px;
                background-color: var(--fill_bg_1);
                border: 1px solid var(--brand);
                color: var(--brand);
                margin-right: 24px;
                &:hover {
                  color: var(--text_white);
                  background: var(--brand);
                }
              }
              :global(.line) {
                margin-left: 12px;
              }
              :global(.deposit-btn) {
                background-color: var(--brand);
                padding: 8px 14px;
                border-radius: 6px;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 14px;
                font-weight: 500;
                color: var(--skin-font-color);
                &:hover {
                  opacity: 0.8;
                }
              }
              :global(.config-icon) {
                margin-left: 16px;
                cursor: pointer;
              }
              .icon-area {
                height: 100%;
                display: flex;
                align-items: center;
                :global(.menu) {
                  :global(.item) {
                    padding: 0;
                  }
                }

                :global(.sun-icon) {
                  cursor: pointer;
                  height: 100%;
                }
              }
            }
            :global(.icon) {
              cursor: pointer;
              margin-left: 24px;
              height: 100%;
              @media ${MediaInfo.mobile} {
                margin-left: 16px;
              }
              :global(svg) {
                fill: var(--text_1);
                &:hover {
                  fill: var(--brand);
                }
              }
            }
            :global(.theme-icon),
            :global(.user-icon) {
              :global(svg) {
                fill: var(--text_1);
                &:hover {
                  fill: var(--brand);
                }
              }
            }

            :global(.btn) {
              display: block;
              padding: 0 15px;
              min-width: 81px;
              height: 36px;
              line-height: 36px;
              border-radius: 5px;
              text-align: center;
              color: var(--theme-font-color-1-reverse);
              font-size: 16px;
              font-weight: 400;
              white-space: nowrap;
            }
            :global(.header-item) {
              cursor: pointer;
              display: flex;
              justify-content: center;
              align-items: center;
              margin: 0 12px;
              white-space: nowrap;
              transition: all 0.3s;
              font-size: 14px;
              font-weight: 500;
              color: var(--text_1);
              @media ${MediaInfo.mobile} {
                margin: 0;
              }
            }
            :global(.header-item.active) {
              color: var(--skin-hover-font-color);
              height: 100%;
              border-bottom: 2px solid var(--skin-primary-color);
            }
          }
          .mobile-title {
            position: sticky;
            top: 44px;
            z-index: 999;
            height: 48px;
            background: var(--fill_3);
            display: flex;
            justify-content: flex-start;
            align-items: center;
            padding-left: 10px;
            .title {
              font-size: 16px;
              font-weight: 500;
              margin-left: 12px;
              color:var(--text_1);
            }
          }
        `}
      </style>
    </>
  );
}
const Header = memo(HeaderComponent);
export { Header };
