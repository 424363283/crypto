import { LANG } from '@/core/i18n';
import { SUBSCRIBE_TYPES, useWs } from '@/core/network';
import { Favors, Group, MarketItem, Markets } from '@/core/shared';
import { storeTradeCollapse } from '@/core/store';
import { isSpotEtf } from '@/core/utils';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { List } from '../components/list';
import { Title } from '../components/title';
import SecondaryTitle from './secondary-title';

interface Props {
  inHeader?: boolean;
}

export const Spot = ({ inHeader = false }: Props) => {
  const [list, setList] = useState<{ [key: number | string]: MarketItem[] }>({});
  const tabsRef = useRef<string[]>([]);
  const router = useRouter();
  const id = router.query.id as string;
  const collapse = storeTradeCollapse.spot;

  // 一级标题
  const [activeIndex, setActiveIndex] = useState(1);
  const [tabs, setTabs] = useState<string[]>([]);
  // 二级标题
  const [secondaryActiveIndex, setSecondaryActiveIndex] = useState(0);
  const [secondaryTabs, setSecondaryTabs] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const group = await Group.getInstance();
      const tabs = group.getSpotUnits();
      const secondaryTabs = group.getSpotZones();
      tabsRef.current = [LANG('自选'), ...tabs];
      setTabs(tabsRef.current);
      setSecondaryTabs(['All', ...secondaryTabs]);
    })();
  }, []);

  useEffect(() => {
    const isEtf = isSpotEtf(id);
    isEtf && setSecondaryActiveIndex(1);
  }, []);

  useWs(SUBSCRIBE_TYPES.ws3001, async (data) => {
    const favors = await Favors.getInstance();
    const spotFavorIds = favors.getSpotAndEtfFavorsList(); // 自选
    const _data: { [key: number | string]: MarketItem[] } = {};
    tabsRef.current.forEach(async (item: string, index: number) => {
      if (index === 0) {
        _data[0] = Markets.getMarketList(data, spotFavorIds);
      } else {
        const group = await Group.getInstance();
        const ids = group.getSpotUnits(item);
        _data[index] = Markets.getMarketList(data, ids);
      }
    });
    setList(_data);
  });

  const handleSetActiveIndex = (val: number) => {
    setActiveIndex(val);
    setSecondaryActiveIndex(0);
  };

  return (
    <>
      <Title activeIndex={activeIndex} onTabsChange={handleSetActiveIndex} tabs={tabs} />
      {activeIndex !== 0 && (
        <SecondaryTitle
          activeIndex={secondaryActiveIndex}
          onTabsChange={setSecondaryActiveIndex}
          tabs={secondaryTabs}
        />
      )}
      <List data={list[activeIndex]} zone={secondaryTabs[secondaryActiveIndex]} />
    </>
  );
};
