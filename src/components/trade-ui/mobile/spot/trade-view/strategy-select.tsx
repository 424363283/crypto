import CommonIcon from '@/components/common-icon';
import { ScrollStatus } from '@/components/trade-ui/trade-view/spot/components/scroll-status';
import { getTradeGridMaxApyApi, getTradeInvestMaxApyApi } from '@/core/api';
import { LANG } from '@/core/i18n';
import { LIST_TYPE } from '@/core/shared';
import { Strategy } from '@/core/shared/src/spot/strategy';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';

export const StrategySelect = () => {
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

  if (selectType !== null) {
    return null;
  }

  return (
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
              {LANG('近3个月最高年化收益率')}
            </div>
            <div>{LANG('全天侯低买高卖')}</div>
          </div>
          <CommonIcon name='common-arrow-right-0' size={24} />
        </div>
      </div>
      <div className='card' onClick={() => Strategy.changeSelectType(LIST_TYPE.INVEST)}>
        <div className='header'>
          <CommonIcon name='common-trading-grid-1-0' size={20} enableSkin />
          {LANG('现货定投')}
        </div>
        <div className='divider' />
        <div className='description'>
          <div>
            <div className='title'>
              <span>+{maxInvestApy.toFixed(2)}%</span>
              {LANG('近3个月最高年化收益率')}
            </div>
            <div>{LANG('积累加密货币')}</div>
          </div>
          <CommonIcon name='common-arrow-right-0' size={24} />
        </div>
      </div>
      <style jsx>{styles}</style>
    </>
  );
};

const styles = css`
  .card {
    border-radius: 8px;
    padding: 10px;
    background-color: var(--theme-grid-card-color);
    margin-top: 17px;
    cursor: pointer;
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
`;
