import CommonIcon from '@/components/common-icon';
import TradeSettingIcon from '@/components/header/components/icon/trade-setting-icon';
import { useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Spot, TRADE_TAB } from '@/core/shared';
import { useCallback } from 'react';
import css from 'styled-jsx/css';

const { Trade, Grid, Martin } = Spot;

const SpotHeader = () => {
  const { tradeTab } = Trade.state;
  const router = useRouter();
  const routerId = router.query.id as string;

  const onStrategyTabClicked = useCallback(() => {
    Trade.changeTradeTab(TRADE_TAB.STRATEGY);
    if (!Grid.isSupportSymbol(routerId) && !Martin.isSupportSymbol(routerId)) {
      router.push(`/spot/btc_usdt`);
    }
  }, [routerId]);

  return (
    <>
      <div className={`header ${tradeTab === TRADE_TAB.SPOT ? '' : 'bg'}`}>
        <div onClick={() => Trade.changeTradeTab(TRADE_TAB.SPOT)} className='spot-tab'>
          {LANG('币币交易')}
        </div>
        <TradeSettingIcon />
        {/* <div className='strategy-tab' onClick={onStrategyTabClicked}>
          <CommonIcon
            name={tradeTab === TRADE_TAB.STRATEGY ? 'common-grid-robot-active-0' : 'common-grid-robot-0'}
            size={24}
            className='robot-icon'
            enableSkin
          />
          <CommonIcon
            name={tradeTab === TRADE_TAB.SPOT ? 'common-spot-grid-0' : 'common-spot-grid-active'}
            width={83}
            height={46}
          />
        </div> */}
      </div>
      <style jsx>{styles}</style>
    </>
  );
};

export default SpotHeader;
const styles = css`
  .header {
    display: flex;
    height: 40px;
    padding: 16px;
    justify-content: space-between;
    align-items: center;
    align-self: stretch;
    color: var(--theme-font-color-1);
    background: var(--bg-1);
    &.bg {
      background-color: var(---bg-1);
    }
    > div {
      display: flex;
      align-items: center;
      height: 46px;
    }
    .spot-tab {
      cursor: pointer;
      flex: 1;
    }
    .strategy-tab {
      width: 83px;
      position: relative;
      :global(.robot-icon) {
        position: absolute;
        right: 17px;
        cursor: pointer;
      }
    }
  }
`;
