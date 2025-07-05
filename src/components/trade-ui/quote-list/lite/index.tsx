import Collapse from '@/components/collapse';
import { LANG } from '@/core/i18n';
import { SUBSCRIBE_TYPES, useWs } from '@/core/network';
import { Favors, Group, MarketItem, Markets } from '@/core/shared';
import { storeTradeCollapse } from '@/core/store';
import { useCallback, useRef, useState } from 'react';
import { List } from '../components/list';
import { Title } from '../components/title';

interface Props {
  inHeader?: boolean;
  onClickItem?: Function;
}

export const Lite = ({ inHeader = false, onClickItem }: Props) => {
  const [activeIndex, setActiveIndex] = useState(1);
  const [list, setList] = useState<{ [key: string]: MarketItem[] }>({});
  const ids = useRef<{ [key: string]: string[] }>();
  const isLite = window.location?.pathname.indexOf('lite') > -1;
  const collapse = isLite ? !storeTradeCollapse.lite : !storeTradeCollapse.spot;

  const getIdsCallback = useCallback(async () => {
    if (ids.current) return ids.current;
    const group = await Group.getInstance();
    const liteIds = group.getLiteQuoteIds;
    ids.current = { liteIds };
    return ids.current;
  }, []);

  // const getIdsCallback = useCallback(async () => {
  //   if (ids.current) return ids.current;
  //   const group = await Group.getInstance();
  //   const liteMainIds = group.getLiteMainByIds(); // 主流区
  //   const liteInnovateIds = group.getLiteInnovateByIds(); // 创新区
  //   const liteOrderIds = group.getLiteOrderByIds(); // 带单区
  //   ids.current = { liteMainIds, liteInnovateIds, liteOrderIds };
  //   return ids.current;
  // }, []);

  useWs(SUBSCRIBE_TYPES.ws3001, async (data) => {
    const { liteIds } = await getIdsCallback();
    const group = await Group.getInstance();
    const favors = await Favors.getInstance();
    const liteFavorIds = favors.getLiteFavorsList().map(id => group.getLiteQuoteCode(id) || id);
    setList({
      0: Markets.getMarketList(data, liteFavorIds),
      1: Markets.getMarketList(data, liteIds),
    });
    // setList({
    //   0: Markets.getMarketList(data, liteFavorIds),
    //   1: Markets.getMarketList(data, liteMainIds),
    //   2: Markets.getMarketList(data, liteInnovateIds),
    //   3: Markets.getMarketList(data, liteOrderIds),
    // });
  });

  // const tabs = [LANG('自选'), LANG('主流区'), LANG('创新区')];
  const tabs = [LANG('自选'), 'All'];
  if (!collapse && !inHeader) {
    return <Collapse />;
  }
  return (
    <>
      <List
        data={list[activeIndex]}
        onClickItem={onClickItem}
        renderSearchBottom={() =>
          <div className='options'>
            <Title activeIndex={activeIndex} onTabsChange={setActiveIndex} tabs={tabs} />
          </div>
        }
      />
      <style jsx>{`
        :global(.options) {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding-bottom: 16px;
        }
        :global(.search-wrap) {
          margin: 16px 16px 0;
        }
      `}</style>
    </>
  );
};
