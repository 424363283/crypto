import { useTheme } from '@/core/hooks';
import { useRouter } from '@/core/hooks/src/use-router';
import { LANG } from '@/core/i18n';
import { EVENT_NAME, EVENT_TRACK } from '@/core/sensorsdata';
import { useAppContext } from '@/core/store';
import { MediaInfo, isTradePage } from '@/core/utils';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { ReactNode, memo, useEffect, useState } from 'react';
import { useImmer } from 'use-immer';
import CommonIcon from '../common-icon';
import { Desktop, DesktopOrTablet, MobileOrTablet } from '../responsive';
import { TrActiveLink } from './components/active-link';
import CommonMenuItem from './components/common-menu';
import { ContractMenu } from './components/contract-menu';
import AboutDownload from './components/download';
import { NavDrawer } from './components/drawer/';
import { headerSwapDemoGuideStore } from './components/header-swap-demo-guide';
import ConfigIcon from './components/icon/config-icon';
import DownloadIcon from './components/icon/download-icon';
import GlobalIcon from './components/icon/global-config-icon';
import LogoIcon from './components/icon/logo-icon';
import ThemeIcon from './components/icon/theme-icon';
import Menu from './components/menu';
import SKinMenuContent from './components/skin-menu';
import { HEADER_PATH } from './constants';
const LoginAndRegister = dynamic(() => import('./components/login-register-btn'), { ssr: false });
const DERIVATIVE_PATH = ['spot', 'swap', 'lite'];
const PARTNER_SHIP_PATH = [HEADER_PATH.AFFILIATE, HEADER_PATH.ARMY];
const SPOT_COIN_PATH = ['spot', 'convert'];
const BUY_COIN_PATH = ['fiat-crypto', 'p2p'];

function HeaderComponent({
  hideBorderBottom,
  desktopMenus,
  renderNavDrawer,
}: {
  exData?: any;
  hideBorderBottom?: boolean;
  desktopMenus?: ReactNode;
  renderNavDrawer?: (props: { onClose: () => void; open?: boolean }) => ReactNode;
}) {
  const router = useRouter();
  const { isLogin } = useAppContext();
  const enableLite = process.env.NEXT_PUBLIC_LITE_ENABLE === 'true';
  const [openNav, setOpenNav] = useState(false);
  const [bgColor, setBgColor] = useState('transparent');
  const pathname = router.asPath;
  const isZh = router.query.locale === 'zh';
  const [activeState, setActiveState] = useImmer({
    isDerivativeActive: false,
    isSpotCoinActive: false,
    isPartnerShipActive: false,
    isBuyCoinActive: false,
  });
  const { showDemoMenu } = headerSwapDemoGuideStore;
  const { isDerivativeActive, isSpotCoinActive, isPartnerShipActive, isBuyCoinActive } = activeState;

  const [downloadIconActive, setDownloadIconActive] = useState(false);
  const [contractMenuHoverIndex, setContractMenuHoverIndex] = useState(0);
  const [skinIconActive, setSkinIconActive] = useState(false);
  const { isDark } = useTheme();

  const onMouseEnterDownload = () => {
    setDownloadIconActive(true);
  };
  const onMouseLeaveDownload = () => {
    setDownloadIconActive(false);
  };

  const showNav = () => {
    setOpenNav(true);
  };
  const onCloseNavDrawer = () => {
    setOpenNav(false);
  };
  useEffect(() => {
    // 衍生品
    function checkIsDerivativePath(path: string) {
      const splitPath = path.split('/');
      return DERIVATIVE_PATH.some((key) => {
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
    const isSpotCoinActive = isSpot && SPOT_COIN_PATH.some((path) => pathname.includes(path));
    const isPartnerShipActive = PARTNER_SHIP_PATH.some((path) => pathname.includes(path));
    const isBuyCoinActive = BUY_COIN_PATH.some((path) => pathname.includes(path));
    setActiveState((draft) => {
      draft.isDerivativeActive = isDerivativeActive;
      draft.isSpotCoinActive = isSpotCoinActive;
      draft.isPartnerShipActive = isPartnerShipActive;
      draft.isBuyCoinActive = isBuyCoinActive;
    });
  }, [pathname]);
  useEffect(() => {
    const handleScroll = () => {
      if (window?.scrollY > 0) {
        setBgColor(!isDark ? '#fff' : 'var(--theme-background-color-2)');
      } else {
        setBgColor('transparent');
      }
    };
    if (window?.scrollY > 0) {
      setBgColor(!isDark ? '#fff' : 'var(--theme-background-color-2)');
    }
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isDark]);
  let dividedLine = isDark ? '/static/images/header/dark-icon-line.svg' : '/static/images/header/icon-line.svg';
  const onContractLeftMenuHover = (id: number) => {
    setContractMenuHoverIndex(id);
  };
  const renderBuyCrypto = () => {
    if (!isZh) {
      return (
        <Menu
          showArrow
          width='235px'
          height='157px'
          position='left:0'
          content={
            <CommonMenuItem
              menuList={[
                {
                  name: LANG('快捷买币'),
                  tips: LANG('一件买币，快捷交易'),
                  href: HEADER_PATH.BUY_CRYPTO,
                  newTag: false,
                },
                {
                  name: 'P2P',
                  tips: LANG('多种方式，0手续费交易'),
                  newTag: true,
                  href: HEADER_PATH.P2P_ADVERTISE_LIST,
                },
              ]}
            />
          }
          isActive={isBuyCoinActive}
        >
          {LANG('买币')}
        </Menu>
      );
    }
    return <TrActiveLink href={HEADER_PATH.BUY_CRYPTO}>{LANG('快捷买币')}</TrActiveLink>;
  };
  return (
    <>
      <header style={{ backgroundColor: bgColor }}>
        <div className='left'>
          <TrActiveLink aria-label='home' href='' style={{ paddingRight: 20, paddingLeft: 18 }}>
          <Image
            src='/static/images/header/media/logo_fill.svg'
            className='logo'
            alt='logo'
            width={120}
            height={50}  />
            
          </TrActiveLink>
          {desktopMenus || (
            <Desktop>
              <TrActiveLink
                href={HEADER_PATH.MARKETS}
                onClick={() => {
                  EVENT_TRACK(EVENT_NAME.PC_TopButtonClick, {
                    first_button: '行情',
                  });
                }}
              >
                {LANG('行情')}
              </TrActiveLink>
              {renderBuyCrypto()}
              <Menu
                showArrow
                width='235px'
                height='157px'
                position='left:0'
                content={
                  <CommonMenuItem
                    menuList={[
                      {
                        name: LANG('专业版'),
                        tips: LANG('所有操作可在一个荧幕完成'),
                        href: HEADER_PATH.SPOT_PRO,
                      },
                      { name: LANG('币币闪兑'), tips: LANG('一键兑换不同数字货币'), href: HEADER_PATH.COIN_CONVERT },
                    ]}
                  />
                }
                isActive={isSpotCoinActive}
              >
                {LANG('币币交易')}
              </Menu>
              <Menu
                itemClassName='header-guide-swap-demo-step-1'
                showArrow
                width={contractMenuHoverIndex === 4 ? '220px' : '620px'}
                hot
                height='480px'
                position='left:0'
                isCommodity
                content={<ContractMenu onContractLeftMenuHover={onContractLeftMenuHover} />}
                isActive={isDerivativeActive}
                openContent={showDemoMenu}
              >
                {LANG('衍生品')}
              </Menu>
              <TrActiveLink
                href={HEADER_PATH.COPY_TRADING_BOT}
                onClick={() => {
                  EVENT_TRACK(EVENT_NAME.PC_TopButtonClick, {
                    first_button: '策略交易',
                  });
                }}
              >
                {LANG('策略交易')}
              </TrActiveLink>
              {enableLite && <TrActiveLink href={HEADER_PATH.COPY_TRADE}>{LANG('跟单大厅')}</TrActiveLink>}
              <Menu
                showArrow
                width='235px'
                height='224px'
                position='left:0'
                content={
                  <CommonMenuItem
                    menuList={[
                      {
                        name: LANG('全球合伙人'),
                        tips: LANG('将你的流量转换为加密货币佣金'),
                        href: HEADER_PATH.AFFILIATE,
                      },

                      { name: LANG('成为YMEX ARMY'), tips: LANG('推广YMEX并获得奖励'), href: HEADER_PATH.ARMY },
                      {
                        name: LANG('邀请好友'),
                        tips: LANG('邀请好友 一起赚钱'),
                        href: isLogin ? HEADER_PATH.INVITE_FRIENDS : HEADER_PATH.LOGIN,
                      },
                    ]}
                  />
                }
                isActive={isPartnerShipActive}
              >
                {LANG('邀请计划')}
              </Menu>
              <TrActiveLink
                href={HEADER_PATH.NEWER_TASK}
                onClick={() => {
                  EVENT_TRACK(EVENT_NAME.PC_TopButtonClick, {
                    first_button: '新手奖励',
                  });
                }}
              >
                {LANG('新手奖励')}
              </TrActiveLink>
            </Desktop>
          )}
        </div>
        <div className='right'>
          <LoginAndRegister />
          {isLogin ? <Image src={dividedLine} height='20' width={1} alt='' className='icon-line' /> : null}
          <MobileOrTablet>
            <CommonIcon name='header-more-option' size={24} onClick={showNav} className='icon' />
          </MobileOrTablet>
          {isTradePage(pathname) ? (
            <div className='icon-area'>
              <GlobalIcon className='icon' />
              <Desktop>
                <Menu
                  width='174px'
                  height='260px'
                  isIcon
                  position='right:0; top: 62px !important'
                  content={
                    <AboutDownload
                      onMouseLeaveDownload={onMouseLeaveDownload}
                      onMouseEnterDownload={onMouseEnterDownload}
                    />
                  }
                >
                  <DownloadIcon iconActive={downloadIconActive} />
                </Menu>
              </Desktop>
              <ConfigIcon className='icon' />
            </div>
          ) : (
            <div className='icon-area'>
              <GlobalIcon className='icon' />
              <DesktopOrTablet>
                <Menu
                  isIcon
                  width='174px'
                  height='260px'
                  position='right:0; top: 62px !important'
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
                  width='238px'
                  height='158px'
                  position='right:0; top: 62px !important'
                  content={
                    <SKinMenuContent
                      onMouseLeaveDownload={() => setSkinIconActive(false)}
                      onMouseEnterDownload={() => setSkinIconActive(true)}
                    />
                  }
                >
                  <ThemeIcon className='theme-icon' iconActive={skinIconActive} />
                </Menu>
              </DesktopOrTablet>
            </div>
          )}
        </div>
        {openNav &&
          (!renderNavDrawer ? (
            <NavDrawer onClose={onCloseNavDrawer} open={openNav} />
          ) : (
            renderNavDrawer({
              onClose: onCloseNavDrawer,
              open: openNav,
            })
          ))}
      </header>
      <style jsx>
        {`
          header {
            position: sticky;
            top: 0;
            height: 64px;
            width: 100%;
            display: flex;
            z-index: var(--zindex-header);
            border-bottom: ${hideBorderBottom ? 'none' : '0.5px solid var(--theme-border-color-1-1)'};
            justify-content: space-between;
            align-items: center;
            max-width: 100vw;
            .left {
              height: 100%;
              display: flex;
              align-items: center;
              &::-webkit-scrollbar {
                display: none;
              }
              :global(.header-item) {
                &:hover {
                  color: 'var(--skin-hover-font-color)';
                }
              }
            }
            .right {
              height: 100%;
              display: flex;
              align-items: center;
              margin-right: 32px;
              @media ${MediaInfo.mobile} {
                margin-right: 16px;
              }
              :global(.user-icon) {
                margin: 0 16px;
              }
              :global(.login-btn) {
                padding: 8px 14px;
                border-radius: 6px;
                background-color: var(--theme-background-color-2);
                &:hover {
                  color: var(--skin-hover-font-color);
                }
              }
              :global(.icon-line) {
                margin: 0;
              }
              :global(.line) {
                margin-left: 12px;
              }
              :global(.deposit-btn) {
                background-color: var(--skin-primary-color);
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
              margin-left: 16px;
              height: 100%;
            }
            :global(.theme-icon) {
              margin-right: -10px;
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
              @media ${MediaInfo.mobile} {
                margin: 0;
              }
              white-space: nowrap;
              transition: all 0.3s;
              font-size: 14px;
              font-weight: 500;
              color: var(--theme-font-color-1);
            }
            :global(.header-item.active) {
              color: var(--skin-hover-font-color);
              height: 100%;
              border-bottom: 2px solid var(--skin-primary-color);
            }
          }
        `}
      </style>
    </>
  );
}
const Header = memo(HeaderComponent);
export { Header };
