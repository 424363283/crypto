import CoinLogo from '@/components/coin-logo';
import { EmptyComponent } from '@/components/empty';
import { RateText } from '@/components/rate-text';
import { getSpotCurrencyCostApi } from '@/core/api';
import { LANG } from '@/core/i18n';
import { MediaInfo, clsx } from '@/core/utils';
import { useEffect } from 'react';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';
import { HidePrice } from './hide-price';

interface CurrencyData {
  currency: string;
  cost: string;
  profit: string;
  profitRatio: string;
}
export const PnlRank = ({ eyeOpen }: { eyeOpen: boolean }) => {
  const [state, setState] = useImmer({
    subTabId: 1,
    currencyData: [] as CurrencyData[],
  });
  const { subTabId, currencyData } = state;
  useEffect(() => {
    const getCurrencyCost = async () => {
      const res = await getSpotCurrencyCostApi();
      if (res.code === 200) {
        setState((draft) => {
          draft.currencyData = res.data || [];
        });
      }
    };
    getCurrencyCost();
  }, []);
  const onTabChange = (id: number) => {
    setState((draft) => {
      draft.subTabId = id;
    });
  };
  const Top5PnlList = ({ id }: { id: number }) => {
    let data = [...currencyData];
    let top5Data: CurrencyData[] = [];
    if (id === 1) {
      // 对数组按 profit 降序排列
      data.sort((a, b) => Number(b.profit) - Number(a.profit));
      // 筛选出前 5 个正数的 profit
      const positiveProfits = data.filter((item) => Number(item.profit) > 0);
      top5Data = positiveProfits.slice(0, 5);
    } else if (id === 2) {
      // 对数组按 profit 升序排列
      data.sort((a, b) => Number(a.profit) - Number(b.profit));
      // 筛选出前 5 个负数的 profit
      const negativeProfits = data.filter((item) => Number(item.profit) < 0);
      top5Data = negativeProfits.slice(0, 5);
    }
    if (top5Data.length === 0) return <EmptyComponent />;
    return (
      <>
        {top5Data.map((item, idx) => {
          const prefixSymbol = +item.profit < 0 ? '-' : '+';
          return (
            <div className='pnl-item' key={item.currency}>
              <div className='left-value'>
                <span className='indicator'>{idx + 1}</span>
                <CoinLogo coin={item.currency} width={20} height={20} />
                <span className='name'>{item.currency}</span>
              </div>
              <div
                className='right-value'
                style={+item.profit < 0 ? { color: 'var(--color-red)' } : { color: 'var(--color-green)' }}
              >
                <HidePrice eyeOpen={eyeOpen}>
                  {prefixSymbol}
                  <RateText money={Math.abs(+item.profit)} prefix scale={4} />
                </HidePrice>
              </div>
              <style jsx>{styles}</style>
            </div>
          );
        })}
      </>
    );
  };
  return (
    <div className='pnl-rank-card'>
      <p className='title'>{LANG('盈亏排行')}</p>
      <div className='tab'>
        <div className={clsx('tab-item', subTabId === 1 && 'active')} onClick={() => onTabChange(1)}>
          {LANG('盈利')}Top5
        </div>
        <div className={clsx('tab-item', subTabId === 2 && 'active')} onClick={() => onTabChange(2)}>
          {LANG('亏损')}Top5
        </div>
      </div>
      <div className='rank-wrap'>
        <span className='name'>{LANG('排名/币种')}</span>
        <span className='change'>{subTabId === 1 ? LANG('涨幅') : LANG('亏损')}</span>
      </div>
      <Top5PnlList id={subTabId} />
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .pnl-rank-card {
    margin-top: 30px;
    @media ${MediaInfo.mobile} {
      margin-top: 15px;
    }
    @media ${MediaInfo.tablet} {
      margin-top: 20px;
    }
    .title {
      font-size: 16px;
      font-weight: 500;
      color: var(--theme-font-color-1);
      margin-bottom: 16px;
    }
    .tab {
      background-color: var(--theme-background-color-3);
      border-radius: 8px;
      display: flex;
      align-items: center;
      height: 26px;
      width: 100%;
      margin-bottom: 25px;
      .tab-item {
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 50%;
        font-size: 12px;
        color: var(--theme-font-color-3);
        border-radius: 8px;
        font-weight: 500;
      }
      .tab-item.active {
        height: 26px;
        background-color: var(--skin-primary-color);
        color: var(--skin-font-color);
      }
    }
    .rank-wrap {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      span {
        font-size: 12px;
        color: var(--theme-font-color-3);
      }
    }
    .pnl-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 21px;
      font-size: 14px;
      font-weight: 500;
      color: var(--theme-font-color-1);
      .left-value {
        display: flex;
        align-items: center;

        .name {
          margin-left: 8px;
        }
        .indicator {
          margin-right: 25px;
        }
      }
    }
  }
`;
