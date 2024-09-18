import CommonIcon from '@/components/common-icon';
import { ScrollXWrap } from '@/components/scroll-x-wrap';
import Star from '@/components/star';
import { Svg } from '@/components/svg';
import { useRouter } from '@/core/hooks';
import { LANG, TradeLink } from '@/core/i18n';
import { SUBSCRIBE_TYPES, useWs } from '@/core/network';
import { DEFAULT_ORDER, FAVORITE_TYPE, Favors, Group, MarketItem, Markets } from '@/core/shared';
import {
  MediaInfo,
  clsx,
  formatDefaultText,
  getActive,
  isLite,
  isSpot,
  isSpotCoin,
  isSpotEtf,
  isSwapCoin,
  isSwapSLCoin,
  isSwapSLUsdt,
  isSwapUsdt,
} from '@/core/utils';
import { Drawer } from 'antd';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import css from 'styled-jsx/css';
import QuoteSearch from '../../quote-list/components/search';

enum SORT_TYPE {
  'NAME' = 'name',
  'PRICE' = 'price',
  'CHANGE' = 'change',
}

interface Props {
  onClose: () => void;
  open: boolean;
  isSpotPage: boolean;
}

const CloseIcon = () => {
  return (
    <div>
      <CommonIcon name='common-close-filled' size={24} enableSkin />
    </div>
  );
};
const QuoteListDrawer = ({ onClose, open, isSpotPage }: Props) => {
  const id = useRouter().query?.id as string;
  const [list, setList] = useState<{ [key: number | string]: MarketItem[] }>({});
  const [search, setSearch] = useState('');
  const [zone, setZone] = useState('All');
  const [sort, setSort] = useState<{ [key: string]: 1 | -1 }>({});

  // 一级标题
  const [activeIndex, setActiveIndex] = useState(1);
  const [tabs, setTabs] = useState<string[]>([]);
  const tabsRef = useRef<string[]>([]);

  // 二级标题
  const [secondaryActiveIndex, setSecondaryActiveIndex] = useState(0);
  const [secondaryTabs, setSecondaryTabs] = useState<string[]>([]);

  useEffect(() => {
    const isEtf = isSpotEtf(id);
    isEtf && setSecondaryActiveIndex(1);
  }, []);

  const clickSort = useCallback(
    (type: SORT_TYPE) => {
      if (!sort[type]) setSort({ [type]: 1 });
      if (sort[type] === 1) setSort({ [type]: -1 });
      if (sort[type] === -1) setSort({});
    },
    [sort]
  );

  useEffect(() => {
    setSecondaryActiveIndex(0);
  }, [activeIndex]);

  useEffect(() => {
    (async () => {
      const group = await Group.getInstance();
      if (isSpotPage) {
        const tabs = group.getSpotUnits();
        const secondaryTabs = group.getSpotZones();
        tabsRef.current = [LANG('自选'), ...tabs];
        setSecondaryTabs(['All', ...secondaryTabs]);
      } else {
        tabsRef.current = [LANG('自选'), LANG('U本位合约'), LANG('币本位合约')];
      }
      setTabs(tabsRef.current);
    })();
  }, [id, isSpotPage]);

  useWs(SUBSCRIBE_TYPES.ws3001, async (data) => {
    const favors = await Favors.getInstance();
    const _data: { [key: number | string]: MarketItem[] } = {};
    if (isSpotPage) {
      const spotFavorIds = favors.getSpotAndEtfFavorsList(); // 自选
      tabsRef.current.forEach(async (item: string, index: number) => {
        if (index === 0) {
          _data[0] = Markets.getMarketList(data, spotFavorIds);
        } else {
          const group = await Group.getInstance();
          const ids = group.getSpotUnits(item);
          _data[index] = Markets.getMarketList(data, ids);
        }
      });
    } else {
      const swapFavorIds = favors.getSwapFavorsList(); // 自选
      tabsRef.current.forEach(async (item: string, index: number) => {
        if (index === 0) {
          _data[0] = Markets.getMarketList(data, swapFavorIds);
        } else {
          if (index === 1) {
            _data[index] = data.getSwapUsdtList();
          }
          if (index === 2) {
            _data[index] = data.getSwapCoinList();
          }
        }
      });
    }

    setList(_data);
  });

  const getStarType = useCallback((id: string): FAVORITE_TYPE => {
    if (isLite(id)) return FAVORITE_TYPE.LITE;
    if (isSpotCoin(id)) return FAVORITE_TYPE.SPOT;
    if (isSpotEtf(id)) return FAVORITE_TYPE.ETF;
    if (isSwapCoin(id)) return FAVORITE_TYPE.SWAP_COIN;
    if (isSwapUsdt(id)) return FAVORITE_TYPE.SWAP_USDT;
    if (isSwapSLCoin(id)) return FAVORITE_TYPE.SWAP_COIN_TESTNET;
    if (isSwapSLUsdt(id)) return FAVORITE_TYPE.SWAP_USDT_TESTNET;
    return FAVORITE_TYPE.SPOT;
  }, []);

  const onSearchInputChange = useCallback((value: string) => setSearch(value), []);

  const TitleMemo = useMemo(() => {
    return (
      <>
        <div className='title'>
          <div className='title-item' onClick={clickSort.bind(this, SORT_TYPE.NAME)}>
            {LANG('名称')}
            <span>
              <i className={clsx('up', sort[SORT_TYPE.NAME] == 1 && 'active')} />
              <i className={clsx('down', sort[SORT_TYPE.NAME] == -1 && 'active')} />
            </span>
          </div>
          <div className='title-item' onClick={clickSort.bind(this, SORT_TYPE.PRICE)}>
            <span>
              <i className={clsx('up', sort[SORT_TYPE.PRICE] == 1 && 'active')} />
              <i className={clsx('down', sort[SORT_TYPE.PRICE] == -1 && 'active')} />
            </span>
            {LANG('最新价')}
          </div>
          <div className='title-item' onClick={clickSort.bind(this, SORT_TYPE.CHANGE)}>
            <span>
              <i className={clsx('up', sort[SORT_TYPE.CHANGE] == 1 && 'active')} />
              <i className={clsx('down', sort[SORT_TYPE.CHANGE] == -1 && 'active')} />
            </span>
            {LANG('涨跌幅')}
          </div>
        </div>
        <style jsx>{`
          .title {
            display: flex;
            height: 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            white-space: nowrap;
            > div {
              color: var(--theme-font-color-2);
              cursor: pointer;
              flex: 3;
              display: flex;
              align-items: center;
              user-select: none;
              span {
                display: flex;
                flex-direction: column;
                margin-left: 2px;
                .up {
                  width: 0;
                  height: 0;
                  border-bottom: 4px solid var(--theme-trade-text-color-2);
                  border-left: 3px solid transparent;
                  border-right: 3px solid transparent;
                  margin-bottom: 1px;
                  &.active {
                    border-bottom: 4px solid var(--skin-hover-font-color);
                  }
                }
                .down {
                  margin-top: 1px;
                  width: 0;
                  height: 0;
                  border-top: 4px solid var(--theme-trade-text-color-2);
                  border-left: 3px solid transparent;
                  border-right: 3px solid transparent;
                  &.active {
                    border-top: 4px solid var(--skin-hover-font-color);
                  }
                }
              }
            }
            > div:nth-child(1) {
              padding-left: 18px;
            }
            > div:nth-child(2) {
              padding-right: 4px;
              flex-flow: row-reverse;
            }
            > div:nth-child(3) {
              padding-right: 20px;
              flex-flow: row-reverse;
              flex: 2;
            }
          }
        `}</style>
      </>
    );
  }, [sort]);

  const sortData = useCallback(
    (data: MarketItem[]) => {
      if (zone && zone !== 'All') {
        data = data?.filter((item) => item.zone?.includes(zone));
        let lvtsList: MarketItem[] = [];
        // LVTs固定排序
        if (zone === 'LVTs') {
          DEFAULT_ORDER.forEach((key) => {
            const findRes = data.find((item) => item?.coin === key);
            findRes && lvtsList.push(findRes);
          });
          data = [...new Set(lvtsList.concat(data))];
        }
      }
      if (search) {
        data = data.filter((item) => (isSpotPage ? item.coin : item.name)?.includes(search));
      }
      if (sort[SORT_TYPE.NAME]) {
        data.sort((a, b) => {
          if (sort[SORT_TYPE.NAME] === 1) return a.name.localeCompare(b.name);
          if (sort[SORT_TYPE.NAME] === -1) return b.name.localeCompare(a.name);
          return 0;
        });
      }

      if (sort[SORT_TYPE.PRICE]) {
        data.sort((a, b) => {
          if (!+a.price) return 1;
          if (!+b.price) return -1;
          if (sort[SORT_TYPE.PRICE] === 1) return +a.price - +b.price;
          if (sort[SORT_TYPE.PRICE] === -1) return +b.price - +a.price;
          return 0;
        });
      }

      if (sort[SORT_TYPE.CHANGE]) {
        data.sort((a, b) => {
          if (!+a.rate) return 1;
          if (!+b.rate) return -1;
          if (sort[SORT_TYPE.CHANGE] === 1) return +a.rate - +b.rate;
          if (sort[SORT_TYPE.CHANGE] === -1) return +b.rate - +a.rate;
          return 0;
        });
      }
      return data;
    },
    [sort, zone, search, isSpotPage]
  );

  const PrevIcon = () => {
    return (
      <div className='mobile-arrow'>
        <Svg src='/static/images/header/media/arrow-left.svg' width={14} height={14} />
      </div>
    );
  };
  const NextIcon = () => {
    return (
      <div className='mobile-arrow'>
        <Svg src='/static/images/header/media/arrow-right.svg' width={14} height={14} />
      </div>
    );
  };

  return (
    <Drawer
      placement='right'
      onClose={onClose}
      open={open}
      closeIcon={<CloseIcon />}
      keyboard
      style={{ position: 'relative' }}
      rootClassName='quote-list-drawer-container'
    >
      <div className='title'>{LANG('选择')}</div>
      <QuoteSearch onChange={onSearchInputChange} />
      <div className='tab-wrapper'>
        <ul>
          {tabs.map((tab, index) => (
            <li key={tab} className={getActive(index === activeIndex)} onClick={() => setActiveIndex(index)}>
              {tab}
            </li>
          ))}
        </ul>
      </div>
      {isSpotPage && (
        <div className='type-wrapper'>
          <ScrollXWrap prevIcon={<PrevIcon />} wrapClassName='mobile-list' nextIcon={<NextIcon />}>
            <div className='type-container'>
              {secondaryTabs.map((item, index) => (
                <button
                  key={item}
                  onClick={() => {
                    setSecondaryActiveIndex(index);
                    setZone(item);
                  }}
                  className={getActive(index === secondaryActiveIndex)}
                >
                  {item}
                  {item === 'LVTs' && <span>3X</span>}
                </button>
              ))}
            </div>
          </ScrollXWrap>
        </div>
      )}
      {TitleMemo}
      <div className='list-wrapper'>
        <ul>
          {sortData(list[activeIndex])?.map((item) => (
            <li key={item.id}>
              <TradeLink id={item.id}>
                <div className={`item ${getActive(item.id === id)}`} onClick={onClose}>
                  <div className='name'>
                    <div className='star-wrapper'>
                      <Star code={item.id} type={getStarType(item.id)} inQuoteList />
                    </div>
                    {isSpot(item.id) ? (
                      <>
                        <span>{item.coin}</span>
                        <span className='quoteCoin'>/{item.quoteCoin}</span>
                      </>
                    ) : (
                      item.name
                    )}
                  </div>
                  <div className='price' style={{ color: `var(${item.isUp ? '--color-green' : '--color-red'})` }}>
                    {formatDefaultText(item.price.toFormat(item.digit))}
                  </div>
                  <div className='rate'>
                    <span style={{ color: `var(${item.isUp ? '--color-green' : '--color-red'})` }}>{item.rate}%</span>
                  </div>
                </div>
              </TradeLink>
            </li>
          ))}
        </ul>
      </div>
      <style jsx>{styles}</style>
    </Drawer>
  );
};

export default QuoteListDrawer;

const styles = css`
  :global(.quote-list-drawer-container) {
    .title {
      color: var(--theme-font-color-1);
      position: absolute;
      top: 18px;
      left: 19px;
      font-size: 16px;
      font-weight: 500;
    }
    :global(.search-wrap) {
      margin: 18px;
      margin-bottom: 10px;
      :global(.search-input) {
        height: 38px !important;
      }
    }
    .tab-wrapper {
      ul {
        margin: 0;
        color: var(--theme-font-color-3);
        display: flex;
        align-items: center;
        padding: 0px 18px;
        border-bottom: 1px solid var(--skin-border-color-1);
        li {
          padding: 8px 0;
          margin-right: 24px;
          height: 36px;
          &.active {
            font-weight: 500;
            color: var(--skin-hover-font-color);
            border-bottom: 2px solid var(--skin-hover-font-color);
          }
        }
      }
    }
    .list-wrapper {
      height: calc(100vh - 190px);
      overflow-y: auto;
      ul {
        margin: 0;
        padding: 0;
        li {
          height: 40px;
        }
        .item {
          padding: 0 18px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          line-height: 40px;
          color: var(--theme-font-color-1);
          font-weight: 500;
          &.active {
            background: var(--theme-background-color-3);
          }
          .name {
            display: flex;
            align-items: center;
            .star-wrapper {
              margin-right: 4px;
            }
          }
          .price,
          .rate {
            display: flex;
            flex-flow: row-reverse;
          }
          > div {
            flex: 3;
          }
          .rate {
            flex: 2 !important;
          }
        }
      }
    }
    .type-wrapper {
      padding: 0 20px;
      margin-top: 20px;
      :global(.mobile-list) {
        display: flex;
        align-items: center;
        .type-container {
          button {
            border: none;
            outline: none;
            padding: 5px 12px;
            font-size: 12px;
            color: var(--theme-font-color-3);
            background: none;
            &.active {
              color: var(--theme-font-color-1);
              background: var(--theme-sub-button-bg);
              border-radius: 5px;
            }
            span {
              display: inline-block;
              margin-left: 2px;
              height: 14px;
              padding: 0 4px;
              border-radius: 4px;
              background: #f04e3f;
              line-height: 14px;
              color: #fff;
            }
          }
        }
      }
      :global(.mobile-arrow) {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 9px;
        background-color: var(--theme-background-color-disabled-light);
        height: 24px;
        width: 24px;
      }
      :global(.prev),
      :global(.next) {
        background: none;
        opacity: 1;
        height: 24px;
        width: 24px;
      }
      :global(.prev) {
        left: 0;
      }
      :global(.next) {
        right: 0;
      }
    }
    :global(.ant-drawer-content-wrapper) {
      @media ${MediaInfo.mobile} {
        width: 100% !important;
      }
      :global(.ant-drawer-header) {
        border-bottom: none;
        padding: 16px 4px 0;
        :global(.ant-drawer-header-title) {
          justify-content: end;
        }
      }
      :global(.ant-drawer-body) {
        padding: 0;
      }
      :global(.ant-drawer-content) {
        background-color: var(--theme-background-color-2);
      }
    }
  }
`;
