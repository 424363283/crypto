import { Mobile } from '@/components/responsive';
import Overview from '@/components/trade-ui/kline-header/components/overview';
import { getCommonCommodityInfoApi, getCommonEtfCommodityApi } from '@/core/api';
import { useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Group, TradeMap } from '@/core/shared';
import { MediaInfo, clsx, isSpotEtf } from '@/core/utils';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';

const KlineViewRight = ({
  Chart,
  OrderBook,
  RecentTrades,
}: {
  Chart?: React.ReactNode;
  OrderBook: React.ReactNode;
  RecentTrades: React.ReactNode;
}) => {
  const [tab, setTab] = useState(Chart ? 0 : 1);
  const [data, setData] = useState<any>();
  const id = useRouter().query?.id as string;

  useEffect(() => {
    (async () => {
      let item: any = null;
      const group = await Group.getInstance();
      item = await TradeMap.getSpotById(id);
      const spotList = group.getSpotList;
      const spotItem = spotList.find((item) => item.id === id);
      spotItem && item && (item.fullname = spotItem.fullname);
      if (item) {
        const resultCommodityInfo = await getCommonCommodityInfoApi(item.coin);
        if (isSpotEtf(id)) {
          const resultEtfCommodityInfo = await getCommonEtfCommodityApi(id);
          setData({ ...resultCommodityInfo.data, ...resultEtfCommodityInfo.data, ...item, isEtf: true });
        } else {
          setData({ ...resultCommodityInfo.data, ...item, isEtf: false });
        }
      }
    })();
  }, [id]);

  return (
    <div className='kline-view-right'>
      <div className={clsx('right-title')}>
        {Chart && (
          <span className={tab === 0 ? 'active' : ''} onClick={() => setTab(0)}>
            {LANG('Chart')}
          </span>
        )}
        <span className={tab === 1 ? 'active' : ''} onClick={() => setTab(1)}>
          {LANG('盘口')}
        </span>
        <span className={tab === 2 ? 'active' : ''} onClick={() => setTab(2)}>
          {LANG('交易')}
        </span>
        <Mobile>
          <span className={tab === 3 ? 'active' : ''} onClick={() => setTab(3)}>
            {LANG('概述')}
          </span>
        </Mobile>
      </div>
      {Chart && (
        <div className={clsx('right-box', tab === 0 && 'show')}>
          <>{Chart}</>
        </div>
      )}
      <div className={clsx('right-box', tab === 1 && 'show')} style={{ paddingTop: '10px' }}>
        <>{OrderBook}</>
      </div>
      <div className={clsx('right-box', tab === 2 && 'show')} style={{ paddingTop: '10px' }}>
        <>{RecentTrades}</>
      </div>
      <div className={clsx('right-box', tab === 3 && 'show')}>{data && <Overview data={data} isMobile />}</div>
      <style jsx>{styles}</style>
    </div>
  );
};

const styles = css`
  .kline-view-right {
    border-radius: var(--theme-trade-layout-radius);
    display: flex;
    background-color: var(--theme-trade-bg-color-2);
    flex-direction: column;
    overflow: hidden;
    height: 100%;
  }
  .right-title {
    height: 44px;
    border-bottom: 1px solid var(--theme-trade-bg-color-1);
    padding: 0 12px;
    font-size: 14px;
    font-weight: 500;
    display: flex;
    align-items: center;
    width: max-content;
    min-width: 100vw;
    color: var(--theme-trade-text-color-3);
    @media ${MediaInfo.mobile} {
      border-bottom: 1px solid var(--theme-trade-border-color-1);
    }
    span {
      cursor: pointer;
      margin-right: 20px;
      display: inline-block;
      height: 44px;
      line-height: 44px;
      &:last-child {
        margin-right: 0px;
      }
    }
    .active {
      font-weight: 500;
      color: var(--theme-font-color-1);
      border-bottom: 2px solid var(--skin-hover-font-color);
    }
  }
  .right-box {
    flex: 1;
    display: none;
    flex-direction: column;
    overflow: hidden;
    &.show {
      display: flex;
    }
  }
`;

export default KlineViewRight;
