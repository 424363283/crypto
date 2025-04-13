import { useRouter } from '@/core/hooks';
import { useEffect, useState } from 'react';
import { store } from '../../store';
import {
  CURRENT_TAB,
  ETF_OPTION_ID,
  FAVORITE_OPTION_ID,
  LITE_OPTION_ID,
  PERPETUAL_OPTION_ID,
  SPOT_GOODS_OPTION_ID,
} from '../../types';

const useDefaultOptions = () => {
  const router = useRouter();
  const { query } = router;
  const { currentId, secondItem, thirdItem } = store;
  const tab = query?.tab;
  const TAB_ID_MAP = {
    [CURRENT_TAB.PERPETUAL]: PERPETUAL_OPTION_ID.SWAP_USDT, // 永续
    [CURRENT_TAB.FAVORITE]: FAVORITE_OPTION_ID.SWAP_USDT, // 自选
    [CURRENT_TAB.SPOT_GOODS]: SPOT_GOODS_OPTION_ID.USDT, // 现货
    [CURRENT_TAB.LITE]: LITE_OPTION_ID.ALL, //简单合约
    [CURRENT_TAB.ETF]: ETF_OPTION_ID.USDT, // 杠杆代币
  };
  const handleRouterJumpTab = () => {
    const ROUTER_TAB_MAP = {
      swapCoin: CURRENT_TAB.PERPETUAL,
      swapUsdt: CURRENT_TAB.PERPETUAL,
      lite: CURRENT_TAB.LITE,
      spot: CURRENT_TAB.SPOT_GOODS,
      etf: CURRENT_TAB.ETF,
    };
    // @ts-ignore
    const currentTab = ROUTER_TAB_MAP[tab];
    store.currentId = currentTab;
    store.secondItem = {
      ...secondItem,
      id: tab === 'swapCoin' ? `${currentTab}-2` : `${currentTab}-1`,
    };
  };
  const [isTabSet, setIsTabSet] = useState(!!tab);

  useEffect(() => {
    if (tab && isTabSet) {
      handleRouterJumpTab();
      setIsTabSet(true);
    }
  }, [tab, isTabSet]);
  const setDefaultOptions = () => {
    store.secondItem = {
      ...secondItem,
      id: TAB_ID_MAP[currentId],
    };
    store.thirdItem = {
      ...thirdItem,
      id: '2-1-1',
    };
  };
  useEffect(() => {
    // 不监听isTabSet，当下一次currentId变化时，拿到的isTabSet就是最新值
    if (!isTabSet || tab) {
      setDefaultOptions();
    }
  }, [currentId]);
};
export default useDefaultOptions;
