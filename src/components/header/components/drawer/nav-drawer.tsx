import { Button } from '@/components/button';
import CommonIcon from '@/components/common-icon';
import { MobileDrawer } from '@/components/drawer';
import Menu from '@/components/menu';
import { Mobile } from '@/components/responsive';
import { useTheme } from '@/core/hooks';
import { LANG, TrLink } from '@/core/i18n';
import { useAppContext } from '@/core/store';
import css from 'styled-jsx/css';
import { HEADER_PATH } from '../../constants';
import { ThemeModeSwitch } from '../switch';
export interface NavDrawerProps {
  onClose: () => void;
  open: boolean;
  menuItems?: any[];
}
const enableLite = process.env.NEXT_PUBLIC_LITE_ENABLE === 'true';

const menuItems = [
  // {
  //   label: LANG('快捷买币'),
  //   children: [],
  //   href: HEADER_PATH.BUY_CRYPTO,
  //   icon: 'header-buy-crypto-0',
  // },
  {
    label: LANG('币币交易'),
    icon: 'header-spot-0',
    children: [
      {
        label: LANG('专业版'),
        href: '/spot/btc_usdt',
      },
      {
        label: LANG('币币闪兑'),
        href: '/convert',
      },
    ],
  },
  {
    label: LANG('衍生品'),
    icon: 'header-derivatives-0',
    suffixIcon: 'common-hot-0',
    children: [
      {
        label: LANG('U本位合约'),
        href: '/swap/btc-usdt',
        suffixIcon: 'common-hot-0',
      },
      {
        label: LANG('币本位合约'),
        href: '/swap/btc-usd',
        // suffixIcon: 'common-hot-0',
      },
      {
        label: LANG('简单合约'),
        href: '/lite/btcusdt',
      },
      {
        label: LANG('杠杆代币'),
        href: '/spot/btc3l_usdt',
        // suffixIcon: 'common-hot-0',
      },
      {
        label: LANG('模拟交易'),
        href: '/swap/demo?id=sbtc-susdt',
        // suffixIcon: 'common-hot-0',
      },
    ].filter((item) => {
      if (item.label === LANG('简单合约')) {
        return enableLite;
      }
      return true;
    }),
  },
  {
    label: LANG('策略交易'),
    children: [],
    href: HEADER_PATH.COPY_TRADING_BOT,
    icon: 'header-spot-0',
  },
  {
    label: LANG('跟单大厅'),
    icon: '/header/media/copy-trading.svg',
    href: HEADER_PATH.COPY_TRADE,
  },
  {
    label: LANG('邀请计划'),
    icon: 'header-affiliate-0',
    children: [
      {
        label: LANG('全球合伙人'),
        href: HEADER_PATH.AFFILIATE,
      },
      {
        label: LANG('成为Y-MEX ARMY'),
        href: HEADER_PATH.ARMY,
      },
    ],
  },
  {
    label: LANG('新手奖励'),
    icon: 'header-welcome-rewards-0',
    href: HEADER_PATH.NEWER_TASK,
  },
].filter((item) => {
  if (item.label === LANG('跟单大厅')) {
    return enableLite;
  }
  return true;
});

const NavDrawer = (props: NavDrawerProps) => {
  const { onClose, open } = props;
  const { isLogin } = useAppContext();
  const { isDark, toggleTheme } = useTheme();
  if (!open) return null;
  return (
    <MobileDrawer onClose={onClose} open={open} className='nav-drawer'>
      {!isLogin ? (
        <div className='login-register-wrapper'>
          <TrLink href='/login' className='login-btn'>
            {LANG('登录')}
          </TrLink>
          <TrLink href='/register' native={false} className='register-btn'>
            <Button type='primary' className='nav-register-btn right-line' style={{ minWidth: 80 }}>
              {LANG('注册')}
            </Button>
          </TrLink>
        </div>
      ) : null}
      <Menu data={props.menuItems || menuItems} className='nav-list'></Menu>
      <Mobile>
        <div className='theme-mode'>
          <div className='title'>
            <CommonIcon size={24} name='header-theme-moon-filled-icon' />
            <span style={{ marginLeft: 10 }}>{LANG('主题模式')}</span>
          </div>
          <ThemeModeSwitch onChange={toggleTheme} checked={isDark} />
        </div>
      </Mobile>
      <style jsx>{styles}</style>
    </MobileDrawer>
  );
};
const styles = css`
  :global(.nav-drawer) {
    :global(.ant-drawer-content) {
      background-color: var(--theme-background-color-2);
    }
    .login-register-wrapper {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-bottom: 32px;
      :global(.login-btn) {
        color: var(--skin-main-font-color);
        font-weight: 500;
        font-size: 14px;
      }
      :global(.register-btn) {
        width: 100%;
        :global(.nav-register-btn) {
          margin-top: 15px;
          padding: 12px 0;
          width: 100%;
          color: var(--skin-font-color);
        }
      }
    }
    :global(.ant-drawer-body) {
      :global(.nav-list) {
        margin-top: 40px;
        margin-bottom: 25px;
        :global(.ant-drawer-header) {
          border-bottom: none;
          padding: 16px 4px 0;
          :global(.ant-drawer-header-title) {
            justify-content: end;
          }
        }
      }
      :global(.theme-mode) {
        padding-top: 25px;
        border-top: 1px solid var(--skin-border-color-1);
        display: flex;
        align-items: center;
        justify-content: space-between;
        :global(.title) {
          font-weight: 500;
          font-size: 16px;
          display: flex;
          align-items: center;
          color: var(--const-color-grey);
        }
      }
    }
  }
`;
export default NavDrawer;
