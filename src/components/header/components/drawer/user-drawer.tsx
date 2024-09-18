import CommonIcon from '@/components/common-icon';
import { MobileDrawer } from '@/components/drawer';
import Menu from '@/components/menu';
import { useKycState, useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Account, UserInfo } from '@/core/shared';
import { SESSION_KEY } from '@/core/store';
import { hidePartialOfPhoneOrEmail, message } from '@/core/utils';
import { isSwapDemo } from '@/core/utils/src/is';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useLocation } from 'react-use';
import css from 'styled-jsx/css';
interface UserDrawerProps {
  onClose: () => void;
  open: boolean;
}
const enableLite = process.env.NEXT_PUBLIC_LITE_ENABLE === 'true';

const _isSwapDemo = isSwapDemo();
const menuItems = [
  {
    label: LANG('Dashboard'),
    icon: 'sidebar-dashboard-user-nav-0',
    children: [
      {
        label: LANG('账号与安全'),
        href: '/account/dashboard',
      },
    ].filter((item) => {
      if (item.label === LANG('跟单管理') || item.label === LANG('带单管理')) {
        return enableLite;
      }
      return true;
    }),
  },
  {
    label: LANG('资产'),
    icon: 'sidebar-assets-nav-0',
    children: [
      {
        label: LANG('我的资产'),
        href: '/account/fund-management/assets-overview',
      },
      { label: LANG('我的费率'), href: '/vip?showRate=true' },
      {
        label: LANG('充币'),
        href: '/account/fund-management/asset-account/recharge',
      },
      {
        label: LANG('提币'),
        href: '/account/fund-management/asset-account/withdraw',
      },
      {
        label: LANG('法币充值'),
        href: '/fiat-crypto',
      },
      {
        label: LANG('内部转账'),
        href: '/account/fund-management/asset-account/transfer',
      },
      {
        label: LANG('合约卡券'),
        href: '/account/fund-management/assets-overview?type=coupon',
      },
    ],
  },

  {
    label: LANG('订单'),
    icon: 'sidebar-orders-nav-0',
    children: [
      {
        label: LANG('合约'),
        href: enableLite
          ? '/account/fund-management/order-history/lite-order?id=0'
          : '/account/fund-management/order-history/swap-order?tab=0',
      },
    ],
  },
];
if (!_isSwapDemo)
  menuItems
    .find((v) => v.label === LANG('订单'))
    ?.children.push({
      label: LANG('现货'),
      href: '/account/fund-management/order-history/spot-order?tab=0',
    });

const UserDrawer = (props: UserDrawerProps) => {
  const _isSwapDemo = isSwapDemo(useLocation().pathname);

  const router = useRouter();
  const { isKyc } = useKycState();
  const [user, setUser] = useState<UserInfo | null>(null);
  const { onClose, open } = props;
  const handleLogout = () => {
    const pathname = router.asPath;
    sessionStorage.setItem(SESSION_KEY.LOGIN_REDIRECT, pathname);
    Account.logout();
  };
  const getUser = async () => {
    const users = await Account.getUserInfo();
    setUser(users);
  };

  useEffect(() => {
    getUser();
  }, []);
  return (
    <MobileDrawer className='user-drawer' open={open} onClose={onClose}>
      <div className='top-info'>
        <div className='user-info'>
          <div className='left-info'>
            <span className='account'>{hidePartialOfPhoneOrEmail(user?.email || user?.phone)}</span>
            {user?.uid ? (
              <CopyToClipboard
                text={user?.uid}
                onCopy={(copiedText, success) => {
                  if (user?.uid === copiedText && success) {
                    message.success(LANG('复制成功'));
                  } else {
                    message.error(LANG('复制失败'));
                  }
                }}
              >
                <span className='uid'>
                  UID:{user?.uid}
                  <CommonIcon width={12} height={14} className='copy-icon' name='common-copy-2-yellow-0' enableSkin />
                </span>
              </CopyToClipboard>
            ) : null}
          </div>
          <div className='right-info'>
            {isKyc ? (
              <Image src='/static/images/header/media/verified.svg' width={93} height={32} alt='verified' />
            ) : (
              <Image src='/static/images/header/media/unverified.svg' width={93} height={32} alt='unverified' />
            )}
          </div>
        </div>
        <Menu
          data={menuItems.filter((v) => (!_isSwapDemo ? true : v.label !== LANG('资产')))}
          className='user-nav'
        ></Menu>
      </div>
      <div className='logout-btn'>
        <span onClick={handleLogout}>{LANG('退出登录')}</span>
        <Image src='/static/images/header/media/logout.svg' width={20} height={20} alt='logout' />
      </div>
      <style jsx>{styles}</style>
    </MobileDrawer>
  );
};
const styles = css`
  :global(.user-drawer) {
    .top-info {
      .user-info {
        border-bottom: 1px solid var(--skin-border-color-1);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 28px 25px;
        .left-info {
          display: flex;
          flex-direction: column;
          justify-content: center;
          .account {
            color: var(--theme-font-color-1);
            font-size: 20px;
            font-weight: 500;
          }
          .uid {
            margin-top: 10px;
            color: var(--theme-font-color-3);
            font-size: 12px;
            font-weight: 400;
            display: flex;
            align-items: center;
            :global(img) {
              margin-left: 4px;
            }
          }
        }
      }
      :global(.user-nav) {
        padding: 25px;
      }
    }
    :global(.ant-drawer-body) {
      justify-content: space-between;
      padding: 0;
    }
    .logout-btn {
      background-color: var(--theme-background-color-disabled-light);
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-radius: 8px;
      height: 48px;
      margin: 30px 25px;
      padding: 0 12px;
      span {
        color: var(--theme-font-color-3);
      }
    }
  }
`;
export default UserDrawer;
