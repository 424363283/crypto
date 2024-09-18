import { Button } from '@/components/button';
import Chart from '@/components/chart/mini-chart';
import CoinLogo from '@/components/coin-logo';
import CommonIcon from '@/components/common-icon';
import Image from '@/components/image';
import { Loading } from '@/components/loading';
import { DesktopOrTablet } from '@/components/responsive';
import { getCommonSymbolsApi } from '@/core/api';
import { useMiniChartData } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { FAVORS_LIST, Favors, MarketItem } from '@/core/shared';
import { RootColor } from '@/core/styles/src/theme/global/root';
import { MediaInfo, clsx, isTablet, message } from '@/core/utils';
import { memo, useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import { store } from '../../../store';
import { FAVORITE_TYPE, FAVORITE_TYPE_NAME } from '../../../types';
import { formatSpotCoinName } from '../table/helper';

export const Wait2AddFavorsList = memo(({ onAddAllCallback }: { onAddAllCallback: () => void }) => {
  const [favorsListIds, setFavorsListIds] = useState<string[]>([]);
  const { miniChartData, setSymbols, isLoading } = useMiniChartData();
  const { secondItem, marketDetailList } = store;
  const [coinDetailList, setCoinDetailList] = useState<{ [key: string]: MarketItem }>({});
  const { id: secondId } = secondItem;
  const type = FAVORITE_TYPE[secondId];
  const label = FAVORITE_TYPE_NAME[secondId];
  const [chartCardList, setChartCardList] = useState<MarketItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [favorsData, setFavorsData] = useState<FAVORS_LIST[]>([]);
  const colorHex = RootColor.getColorHex;
  useEffect(() => {
    setCoinDetailList(marketDetailList);
  }, [marketDetailList]);
  useEffect(() => {
    const getList = async () => {
      const res = await getCommonSymbolsApi();
      if (res.code === 200) {
        const favList = res.data.favors;
        setFavorsData(favList);
      } else {
        message.error(res.message);
      }
    };
    getList();
  }, []);

  useEffect(() => {
    const listItem = favorsData.filter((item: any) => item.type === type)[0] as any;
    const list = (listItem?.list as string[]) || [];
    setFavorsListIds(list);
    if (list.length) {
      setSelectedIds(list);
    }
  }, [type, favorsData]);
  useEffect(() => {
    if (favorsListIds.length) {
      setSymbols(favorsListIds);
      const chartData = favorsListIds.map((item: string) => coinDetailList[item]).filter(Boolean);
      setChartCardList(chartData);
    }
  }, [type, favorsListIds, coinDetailList]);
  const onCardItemClick = (item: MarketItem) => {
    const copySelectedIds = [...selectedIds];
    if (copySelectedIds.includes(item.id)) {
      const index = copySelectedIds.indexOf(item.id);
      copySelectedIds.splice(index, 1);
    } else {
      copySelectedIds.push(item.id);
    }
    setSelectedIds([...copySelectedIds]);
  };
  const onAddAllClick = async () => {
    Loading.start();
    const favors = await Favors.getInstance();
    await favors.addFavors(selectedIds, type);
    await onAddAllCallback?.();
    Loading.end();
  };
  const chartSize = MediaInfo.isMobile
    ? { width: 146, height: 34 }
    : isTablet
    ? { width: window.innerWidth / 2 - 80, height: 110 }
    : { width: 245, height: 110 };
  const renderFavorsCardList = () => {
    return chartCardList.map((item: MarketItem) => {
      const isSelected = selectedIds.includes(item.id);
      return (
        <div
          className={clsx('card-item', isSelected && 'selected-item')}
          key={item.id}
          onClick={() => onCardItemClick(item)}
        >
          {isSelected && (
            <Image
              src='/static/images/markets/selected-icon.svg'
              width={40}
              height={40}
              className='selected-icon'
              enableSkin
            />
          )}
          <div className='title-info'>
            <CoinLogo coin={item.coin} alt='y-mex' width='24' height='24' />
            <h2 className='coin-name'>{formatSpotCoinName(item)}</h2>
            <DesktopOrTablet>
              <span className='type'>{label}</span>
            </DesktopOrTablet>
          </div>
          <div className='middle-info'>
            <p className='price'>{item.price}</p>
            <p style={{ color: `var(${item.isUp ? '--color-green' : '--color-red'})` }} className='change-rate'>
              {item.rate}%
            </p>
          </div>
          <div className='charts'>
            <Chart
              id={'_favors_card'}
              showLine={false}
              style={chartSize}
              data={miniChartData[item.id]}
              symbol={item.coin}
              lineWidth={1.5}
              areaColor={item?.isUp ? colorHex['up-color-hex'] : colorHex['down-color-hex']}
              lineColor={item?.isUp ? colorHex['up-color-hex'] : colorHex['down-color-hex']}
              areaColorOpacity={50}
            />
          </div>
        </div>
      );
    });
  };
  return (
    <Loading.wrap isLoading={isLoading} small top={120}>
      <div className='favors-list-wrapper'>
        <div className='title-area'>
          <DesktopOrTablet>
            <p className='left-title'>{LANG('添加心仪交易对')}</p>
          </DesktopOrTablet>
          <Button className='add-all-btn' onClick={onAddAllClick} type='primary' style={{ padding: '12px 90px' }}>
            <CommonIcon name='common-add-all-round-0' size={16} enableSkin />
            <span className='txt'> {LANG('Add all')}</span>
          </Button>
        </div>
        <div className='wait2-add-favors-list'>{renderFavorsCardList()}</div>
        <style jsx>{styles}</style>
      </div>
    </Loading.wrap>
  );
});
const styles = css`
  .favors-list-wrapper {
    padding: 36px 0;
    @media ${MediaInfo.mobile} {
      padding: 0 0 30px;
    }
    .title-area {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left-title {
        color: var(--theme-font-color-1);
        font-weight: 600;
        font-size: 24px;
      }
      :global(.add-all-btn) {
        :global(img) {
          padding-right: 4px;
        }
        @media ${MediaInfo.mobile} {
          position: absolute;
          bottom: -15px;
          width: 100%;
        }
        background-color: var(--skin-primary-color);
        padding: 12px 90px;
        color: var(--skin-font-color);
        border-radius: 6px;
        font-weight: 500;
        font-size: 14px;
        cursor: pointer;
      }
    }
    .wait2-add-favors-list {
      margin-top: 40px;
      display: grid;
      @media ${MediaInfo.desktop} {
        grid-template-columns: repeat(4, 1fr);
      }
      grid-gap: 20px;
      @media ${MediaInfo.mobileOrTablet} {
        grid-template-columns: repeat(2, 1fr);
      }
      @media ${MediaInfo.mobile} {
        grid-gap: 10px;
        margin-top: 30px;
        margin-bottom: 30px;
      }
      :global(.card-item) {
        cursor: pointer;
        position: relative;
        padding: 30px 20px;
        @media ${MediaInfo.mobile} {
          padding: 12px;
          height: 142px;
        }
        border-radius: 15px;
        border: 1px solid var(--skin-border-color-1);
        @media ${MediaInfo.mobileOrTablet} {
        }
        :global(.selected-icon) {
          position: absolute;
          right: -1px;
          top: -1px;
        }
        :global(.title-info) {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          :global(.coin-name) {
            margin: 0 5px;
            color: var(--theme-font-color-1);
            font-size: 20px;
            @media ${MediaInfo.mobile} {
              font-size: 12px;
            }
          }
          @media ${MediaInfo.mobile} {
            margin-bottom: 6px;
          }
          :global(.type) {
            background-color: var(--theme-background-color-3);
            padding: 4px 10px;
            border-radius: 5px;
            color: var(--theme-font-color-2);
          }
        }
        :global(.middle-info) {
          :global(.price) {
            color: var(--theme-font-color-1);
            font-size: 24px;
            font-weight: 500;
            margin-bottom: 5px;
            @media ${MediaInfo.mobile} {
              font-size: 16px;
            }
          }
          :global(.change-rate) {
            margin-bottom: 20px;
            @media ${MediaInfo.mobile} {
              margin-bottom: 6px;
            }
          }
        }
      }
      :global(.selected-item) {
        border: 1px solid var(--skin-color-active);
        :global(img) {
          @media ${MediaInfo.mobile} {
            width: 28px;
            height: 28px;
          }
        }
      }
    }
  }
`;
