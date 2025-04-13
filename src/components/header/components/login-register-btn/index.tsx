import { Button } from '@/components/button';
import { Desktop, DesktopOrTablet, MobileOrTablet } from '@/components/responsive';
import { useResponsive, useRouter } from '@/core/hooks';
import { LANG, TrLink } from '@/core/i18n';
import { SESSION_KEY, useAppContext } from '@/core/store';
import { isSwapDemo } from '@/core/utils/src/is';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-use';
import { ASSETS_MENU_URL, ORDER_MENU_URL, USER_MENU_URL } from '../../constants';
import HeaderAssets from '../assets';
import { UserDrawer } from '../drawer/';
import Menu from '../menu';
import HeaderOrder from '../order';
import HeaderUser from '../user';
import { Size } from '@/components/constants';
const UserIcon = dynamic(() => import('../icon/user-icon'));

const ASSETS_PATH = Object.values(ASSETS_MENU_URL);
const ORDER_PATH = Object.values(ORDER_MENU_URL);
const USER_PATH = Object.values(USER_MENU_URL);
const LoggedArea = () => {
  const router = useRouter();
  const pathname = router.asPath;
  const [userIconActive, setUserIconActive] = useState(false);
  const [userDrawerOpen, setUserDrawerOpen] = useState(false);
  const isAssetsPathActive = ASSETS_PATH.some((path) => {
    return pathname?.includes(path);
  });
  const isOrderPathActive = ORDER_PATH.some((path) => {
    return pathname?.includes(path);
  });
  useEffect(() => {
    const isUserActive = USER_PATH.some((path) => {
      return pathname?.includes(path);
    });
    setUserIconActive(isUserActive);
  }, [pathname]);
  const _isSwapDemo = isSwapDemo(useLocation().pathname);

  return (
    <>
      {!_isSwapDemo && (
        <DesktopOrTablet>
          <Button type='primary' style={{ padding: `0`, margin: '0 12px', borderRadius: 24, width: 80 }} size={Size.SM}>
            <TrLink
              style={{ minWidth: 72, color: 'var(--skin-font-color)' }}
              href='/account/fund-management/asset-account/recharge'
            >
              {LANG('充值')}
            </TrLink>
          </Button>
        </DesktopOrTablet>
      )}
      <Desktop>
        {
          !_isSwapDemo && (
            <Menu
              width='160px'
              height='250px'
              position='right:0'
              content={<HeaderAssets />}
              showArrow
              isActive={isAssetsPathActive}
            >
              {LANG('资产')}
            </Menu>
          )
        }
        {
          <Menu
            width='160px'
            height={'auto'}
            position='right:0'
            content={<HeaderOrder />}
            showArrow
            isActive={isOrderPathActive}
          >
            {LANG('订单')}
          </Menu>
        }
      </Desktop>
      <Desktop>
        <Menu
          menuType="user"
          width='352px'
          height={process.env.NEXT_PUBLIC_LITE_ENABLE === 'true' ? '220px' : '311px'}
          position='right:0'
          content={
            <HeaderUser onMouseEnter={() => setUserIconActive(true)} onMouseLeave={() => setUserIconActive(false)} />
          }
          boxRadius='24px'
        >
          <UserIcon className='user-icon' iconActive={false} />
        </Menu>
      </Desktop>
      <MobileOrTablet>
        <UserIcon iconActive={userIconActive} className='user-icon' onClick={() => setUserDrawerOpen(true)} />
        <UserDrawer open={userDrawerOpen} onClose={() => setUserDrawerOpen(false)} />
      </MobileOrTablet>
    </>
  );
};

const LoginAndRegister = () => {
  const { isLogin } = useAppContext();
  const { isMobileOrTablet } = useResponsive();
  const router = useRouter();
  const handleLogin = () => {
    const pathname = router.asPath;
    sessionStorage.setItem(SESSION_KEY.LOGIN_REDIRECT, pathname);
    router.push('/login');
  };
  if (!isLogin) {
    return (
      <>
        <Desktop>
          <Button className='login-btn' style={{ minWidth: 112 }} onClick={handleLogin} >
            {LANG('登录')}
          </Button>
        </Desktop>
        <Button type='primary' size={Size.SM} rounded>
          <TrLink href='/register' style={{ minWidth: isMobileOrTablet ? 44 : 80 }} data-name='register-btn'>
            {LANG('注册')}
          </TrLink>
        </Button>
      </>
    );
  }
  return isMobileOrTablet ? '' : <LoggedArea />;
};



export default LoginAndRegister;
