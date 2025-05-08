import { Button } from '@/components/button';
import Chart from '@/components/chart/mini-chart';
import CoinLogo from '@/components/coin-logo';
import CommonIcon from '@/components/common-icon';
import Image from '@/components/image';
import { Loading } from '@/components/loading';
import { DesktopOrTablet } from '@/components/responsive';
import { getCommonSymbolsApi } from '@/core/api';
import { useMiniChartData, useResponsive } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { FAVORS_LIST, Favors, MarketItem, Account } from '@/core/shared';
import { RootColor } from '@/core/styles/src/theme/global/root';
import { MediaInfo, clsx, isTablet, message } from '@/core/utils';
import { memo, useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import { store } from '../../../store';
import { FAVORITE_TYPE, FAVORITE_TYPE_NAME } from '../../../types';
import { formatSpotCoinName } from '../table/helper';
import { isLite } from '@/core/utils';
import Radio from '@/components/Radio';
import { Size } from '@/components/constants';


export const Wait2AddFavorsList = memo(({ onAddAllCallback }: { onAddAllCallback: () => void }) => {
  const [favorsListIds, setFavorsListIds] = useState<string[]>([]);
  const { miniChartData, setSymbols, isLoading } = useMiniChartData();
  const { secondItem, marketDetailList } = store;
  const [coinDetailList, setCoinDetailList] = useState<{ [key: string]: MarketItem }>({});
  const [liteDetailList, setLiteDetailList] = useState<{ [key: string]: MarketItem }>({});
  const { id: secondId } = secondItem;
  const type = FAVORITE_TYPE[secondId];
  const label = FAVORITE_TYPE_NAME[secondId];
  const [chartCardList, setChartCardList] = useState<MarketItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [favorsData, setFavorsData] = useState<FAVORS_LIST[]>([]);
  const { isMobile } = useResponsive();
  const colorHex = RootColor.getColorHex;
  useEffect(() => {
    setCoinDetailList(marketDetailList);
    // let liteDetailList = {};
    const liteDetailList: { [key: string]: MarketItem } = {};

    for (var quoteCode in marketDetailList) {
      if (isLite(marketDetailList[quoteCode].id)) {
        liteDetailList[marketDetailList[quoteCode].id] = marketDetailList[quoteCode];
      }
    }
    setLiteDetailList(liteDetailList);
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
      // 请求mini chart数据
      let chartSymbols: string[] = [];
      if (type == 'lite') {
        for (const item of favorsListIds) {
          if (liteDetailList[item]) {
            chartSymbols.push(liteDetailList[item].quoteCode);
          }
        }
      } else {
        chartSymbols = favorsListIds;
      }
      setSymbols(chartSymbols);
      const chartData = chartSymbols
        .map((item: string) => {
          // 下方卡片筛选
          return coinDetailList[item];
        })
        .filter(Boolean);
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
    if (!Account.isLogin) {
      message.error(LANG('请先登录'));
      return;
    }
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
          <div className="left">
            <div className="title-info">
              <CoinLogo coin={item.coin} alt="YMEX" width={isMobile ? 20 : 32} height={isMobile ? 20 : 32} />
              <h2 className="coin-name">{formatSpotCoinName(item)}</h2>
              {/* <DesktopOrTablet>
                <span className='type'>{label}</span>
              </DesktopOrTablet> */}
            </div>
            <div className="change-info">
              <p className="price">{item.price}</p>
              <p className={clsx('change-rate', item.isUp ? 'positive-text' : 'negative-text')}>{item.rate}%</p>
            </div>
          </div>
          <div className="right">
            <Radio label={''} checked={isSelected} {...{ width: isMobile ? 16 : 24, height: isMobile ? 16 : 24 }} />
          </div>
          {/* <div className='charts'>
            <Chart
              id={'_favors_card'}
              showLine={false}
              style={chartSize}
              data={miniChartData[item.quoteCode]}
              symbol={item.coin}
              lineWidth={1.5}
              areaColor={item?.isUp ? colorHex['up-color-hex'] : colorHex['down-color-hex']}
              lineColor={item?.isUp ? colorHex['up-color-hex'] : colorHex['down-color-hex']}
              areaColorOpacity={50}
            />
          </div> */}
        </div>
      );
    });
  };
  return (
    <Loading.wrap isLoading={isLoading} top={120}>
      <div className="favors-list-wrapper">
        {/* <div className='title-area'>
            <DesktopOrTablet>
              <p className='left-title'>{LANG('添加心仪交易对')}</p>
            </DesktopOrTablet>
          </div>
          */}
        <div className="wait2-add-favors-list">{renderFavorsCardList()}</div>
        {chartCardList.length ? (
          <Button
            disabled={!selectedIds.length}
            className="add-all-btn"
            onClick={onAddAllClick}
            type="primary"
            size={Size.LG}
            width={320}
            rounded
          >
            <CommonIcon name={`common-add-all-round${!selectedIds.length ? '-disabled' : ''}-0`} size={24} enableSkin />
            <span className="txt"> {LANG('添加自选')}</span>
          </Button>
        ) : null}
        <style jsx>{styles}</style>
      </div>
    </Loading.wrap>
  );
});
const styles = css`
  .favors-list-wrapper {
    display: flex;
    width: 1200px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 80px;
    @media ${MediaInfo.mobile} {
      width: auto;
      gap: 0;
      padding: 0 1.5rem;
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
    }
    .wait2-add-favors-list {
      margin-top: 40px;
      display: grid;
      align-items: flex-start;
      gap: 16px;
      align-self: stretch;

      @media ${MediaInfo.desktop} {
        grid-template-columns: repeat(4, 1fr);
      }
      grid-gap: 20px;
      @media ${MediaInfo.mobileOrTablet} {
        grid-template-columns: repeat(2, 1fr);
      }
      @media ${MediaInfo.mobile} {
        margin-top: 16px;
        margin-bottom: 40px;
        flex-wrap: wrap;
        grid-gap: 16px;
        // padding: 0 1.5rem;
      }
      :global(.card-item) {
        cursor: pointer;
        display: flex;
        padding: 16px 24px;
        align-items: flex-end;
        gap: 10px;
        flex: 1 0 0;
        border-radius: 16px;
        border: 0.5px solid var(--text_3);
        @media ${MediaInfo.mobile} {
          padding: 0;
          gap: 0;
        }
        @media ${MediaInfo.mobileOrTablet} {
        }
        :global(.left) {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 16px;
          flex: 1 0 0;
          @media ${MediaInfo.mobile} {
            padding: 8px 0;
            padding-left: 16px;
          }
        }
        :global(.right) {
          @media ${MediaInfo.mobile} {
            padding: 8px 0;
            padding-right: 16px;
          }
        }
        :global(.selected-icon) {
          position: absolute;
          right: -1px;
          top: -1px;
        }
        :global(.title-info) {
          display: flex;
          align-items: center;
          gap: 8px;
          align-self: stretch;
          :global(.coin-name) {
            color: var(--text_1);
            leading-trim: both;
            text-edge: cap;
            font-size: 16px;
            font-style: normal;
            font-weight: 700;
            line-height: normal;
          }
          @media ${MediaInfo.mobile} {
            margin-bottom: 0;
          }
          :global(.type) {
            background-color: var(--theme-background-color-3);
            padding: 4px 10px;
            border-radius: 5px;
            color: var(--theme-font-color-2);
          }
        }
        :global(.change-info) {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          gap: 8px;
          :global(.price) {
            color: var(--text_1);
            font-size: 16px;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
            @media ${MediaInfo.mobile} {
              font-size: 14px;
            }
          }
          :global(.change-rate) {
            font-size: 14px;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
            @media ${MediaInfo.mobile} {
              margin-bottom: 0px;
            }
          }
        }
      }
      :global(.selected-item) {
        :global(img) {
          @media ${MediaInfo.mobile} {
            width: 20px;
            height: 20px;
          }
        }
      }
    }
    :global(.add-all-btn) {
      display: flex;
      width: 320px;
      height: 48px;
      padding: 16px 40px;
      justify-content: center;
      align-items: center;
      gap: 16px;
      @media ${MediaInfo.mobile} {
      }
      text-align: center;
      font-size: 18px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
    }
  }
`;
