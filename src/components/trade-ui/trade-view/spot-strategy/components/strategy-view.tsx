import CommonIcon from '@/components/common-icon';
import { getTradeGridMaxApyApi, getTradeInvestMaxApyApi } from '@/core/api';
import { LANG } from '@/core/i18n';
import { LIST_TYPE, Spot } from '@/core/shared';
import { MediaInfo } from '@/core/utils';
import React, { useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import { ScrollStatus } from '../../spot/components/scroll-status';
import { GridView } from './grid-view';
import InvestView from './invest-view';

const Strategy = Spot.Strategy;

const StrategyView = () => {
  const { selectType } = Strategy.state;
  const [maxGridApy, setMaxGridApy] = useState(0);
  const [maxInvestApy, setMaxInvestApy] = useState(0);

  useEffect(() => {
    try {
      getTradeGridMaxApyApi().then((res) => {
        if (res.code === 200) {
          setMaxGridApy(res.data?.mul(100));
        }
      });
    } catch (err) {}
    try {
      getTradeInvestMaxApyApi().then((res) => {
        if (res.code === 200) {
          setMaxInvestApy(res.data?.mul(100));
        }
      });
    } catch (err) {}
  }, []);

  return (
    <>
      <div
        className={`container ${selectType !== null ? 'inStrategy' : 'inSelect'} ${
          MediaInfo.isSmallDesktop ? 'small-desktop' : ''
        }`}
      >
        {selectType === null && (
          <>
            <ScrollStatus />
            <div className='card' onClick={() => Strategy.changeSelectType(LIST_TYPE.GRID)}>
              <div className='header'>
                <CommonIcon name='common-trading-grid-1-0' size={20} enableSkin />
                {LANG('现货网格')}
              </div>
              <div className='divider' />
              <div className='description'>
                <div>
                  <div className='title'>
                    <span>+{maxGridApy.toFixed(2)}%</span>
                    {LANG('当前最高年化收益率')}
                  </div>
                  <div>{LANG('全天侯低买高卖')}</div>
                </div>
                <CommonIcon name='common-arrow-right-0' size={12} />
              </div>
            </div>
            <div className='card' onClick={() => Strategy.changeSelectType(LIST_TYPE.INVEST)}>
              <div className='header'>
                <CommonIcon name='common-trading-grid-3-0' size={20} enableSkin />
                {LANG('现货定投')}
              </div>
              <div className='divider' />
              <div className='description'>
                <div>
                  <div className='title'>
                    <span>+{maxInvestApy.toFixed(2)}%</span>
                    {LANG('当前最高年化收益率')}
                  </div>
                  <div>{LANG('积累加密货币')}</div>
                </div>
                <CommonIcon name='common-arrow-right-0' size={12} />
              </div>
            </div>
          </>
        )}
        {selectType === LIST_TYPE.GRID && <GridView />}
        {selectType === LIST_TYPE.INVEST && <InvestView />}
      </div>
      <style jsx>{styles}</style>
    </>
  );
};
export default React.memo(StrategyView);
const styles = css`
  .container {
    padding: 10px;
    background: var(--theme-background-color-2-2);
    border-bottom-left-radius: var(--theme-trade-layout-radius);
    border-bottom-right-radius: var(--theme-trade-layout-radius);
    &.inSelect {
      flex: 1;
      height: auto;
    }
    &.inStrategy {
      padding: 0 !important;
      background: transparent !important;
      display: flex;
      flex-direction: column;
    }
    &.small-desktop {
      height: 929px;
      overflow: auto;
    }
    .card {
      border-radius: 8px;
      padding: 10px;
      background-color: var(--theme-grid-card-color);
      margin-top: 17px;
      cursor: pointer;
      &:hover {
        background-color: var(--theme-grid-card-hover-color);
        .divider {
          background-color: var(--theme-grid-card-hover-divider-color);
        }
      }
      .header {
        display: flex;
        align-items: center;
        color: var(--theme-font-color-1);
        :global(img) {
          margin-right: 10px;
        }
      }
      .divider {
        height: 1px;
        background-color: var(--theme-border-color-2);
        margin: 15px 0;
      }
      .description {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: var(--theme-font-color-1);
        .title {
          font-weight: 500;
          line-height: 19px;
          > span {
            color: var(--color-green);
            margin-right: 4px;
          }
        }
        .title + div {
          color: var(--theme-font-color-3);
          margin-top: 5px;
        }
      }
    }
  }
`;
