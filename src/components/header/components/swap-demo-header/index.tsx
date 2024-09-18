import CommonIcon from '@/components/common-icon';
import { Desktop } from '@/components/responsive';
import { LANG, TradeLink } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { isSwapDemoTradePage } from '@/core/utils/src/is';
import { Header } from '../../index';
import { TrActiveLink } from '../active-link/index';
import { SwapDemoNavDrawer } from '../drawer/swap-demo-nav-drawer';

export const SwapDemoHeader = () => {
  const { uHref, cHref } = useHref();
  return (
    <Header
      desktopMenus={<DesktopMenus />}
      renderNavDrawer={(props) => {
        return <SwapDemoNavDrawer uHref={uHref} cHref={cHref} onClose={props.onClose} open={props.open || false} />;
      }}
    ></Header>
  );
};

const DesktopMenus = () => {
  const { isUsdtType, isCoinType } = Swap.Trade.base;
  const { uHref, cHref } = useHref();
  const tradePage = isSwapDemoTradePage();
  const usdtActive = isUsdtType && tradePage;
  const coinActive = isCoinType && tradePage;
  return (
    <Desktop forceInitRender={false}>
      <TradeLink native id='btc-usdt'>
        <div className='real-trade'>
          <CommonIcon name='common-prev-icon-theme-0' size={10} className='copy' enableSkin />
          <div className='text'>{LANG('实盘交易')}</div>
        </div>
        <style jsx>{`
          .real-trade {
            display: flex;
            background: var(--skin-primary-color);
            border-radius: 5px;
            align-items: center;
            height: 30px;
            padding: 0 10px;
            margin-right: 10px;
            .text {
              font-size: 12px;
              margin-left: 5px;
              color: var(--skin-font-color);
              font-weight: 500;
            }
          }
        `}</style>
      </TradeLink>
      <TrActiveLink key={'usdt'} href={uHref} active={usdtActive}>
        {LANG('U本位')}
      </TrActiveLink>
      <TrActiveLink key={'coin'} href={cHref} active={coinActive}>
        {LANG('币本位')}
      </TrActiveLink>
      {/* <TrActiveLink href='/swap/btc-usdt'>{LANG('实盘交易')}</TrActiveLink> */}
    </Desktop>
  );
};

const useHref = () => {
  const { quoteId, isUsdtType } = Swap.Trade.base;

  const uHref = isUsdtType
    ? `/swap/demo?id=${(quoteId || 'sbtc-susdt').toLocaleLowerCase()}`
    : '/swap/demo?id=sbtc-susdt';
  const cHref = !isUsdtType
    ? `/swap/demo?id=${(quoteId || 'sbtc-susd').toLocaleLowerCase()}`
    : '/swap/demo?id=sbtc-susd';
  return { uHref, cHref };
};
