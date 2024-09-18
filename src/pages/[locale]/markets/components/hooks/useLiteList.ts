/* 获取简单合约的主流区，创新区和带单区的数据 */
import { useState, useEffect } from 'react';
import { Group } from '@/core/shared';
import { store } from '../../store';
import { CURRENT_TAB } from '../../types';

interface LITE_LIST_STATE {
  mainListIds: string[];
  liteInnovateListIds: string[];
  liteOrderListIds: string[];
}
const useLiteList = () => {
  const { currentId } = store;
  const [liteList, setLiteList] = useState<LITE_LIST_STATE>({
    mainListIds: [],
    liteInnovateListIds: [],
    liteOrderListIds: [],
  });
  useEffect(() => {
    const getLiteData = async () => {
      const group = await Group.getInstance();
      const mainListIds = group.getLiteMainByIds();
      const liteInnovateListIds = group.getLiteInnovateByIds();
      const liteOrderListIds = group.getLiteOrderByIds();
      setLiteList({
        mainListIds,
        liteInnovateListIds,
        liteOrderListIds,
      });
    };
    if (currentId === CURRENT_TAB.LITE) {
      getLiteData();
    }
  }, [currentId]);
  return liteList;
};
export default useLiteList;
