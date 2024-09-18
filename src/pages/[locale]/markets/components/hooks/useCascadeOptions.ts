/* 行情页面二级菜单和三级菜单选项 */
import { Group } from '@/core/shared';
import { useEffect, useState } from 'react';
import { store } from '../../store';
import { CURRENT_TAB } from '../../types';
import { FAVORITE_OPTIONS, LITE_OPTIONS, PERPETUAL_OPTIONS } from './constants';
import useDefaultOptions from './useDefaultOption';
// 1、根据currentId判断当前是哪个tab，然后获取对应的二级菜单和三级菜单
// 2、如果是现货，需要根据二级菜单id获取对应的三级菜单
import { LANG } from '@/core/i18n';
import { ETF_OPTION_ID, SPOT_GOODS_OPTION_ID } from '../../types';
import { OptionMap, Options } from './types';

const useCascadeOptions = () => {
  useDefaultOptions();
  const { currentId, secondItem } = store;
  const { id: secondId } = secondItem;
  const [options, setOptions] = useState<{ secondOptions: Options[]; thirdOptions: Options[] }>({
    secondOptions: [],
    thirdOptions: [],
  });
  const getSpotGoodsOptions = async () => {
    const group = await Group.getInstance();
    const spotUnits = group?.getSpotUnits() || []; //  现货二级菜单
    const spotZones = group?.getSpotZones()?.slice() || []; // 现货三级菜单
    const spotUnitConfigs = spotUnits.map((item, idx: number) => {
      return {
        id: `2-${Number(idx) + 1}`,
        name: item,
      };
    });
    if (!spotZones.includes(LANG('全部'))) {
      spotZones.unshift(LANG('全部'));
    }
    if (secondId === SPOT_GOODS_OPTION_ID.FIAT) {
      spotZones.splice(2, 1);
    }
    // 非USDT现货，不显示Assessment 和lvts
    let newSpotZones = spotZones;
    if (secondId !== SPOT_GOODS_OPTION_ID.USDT) {
      newSpotZones = spotZones.filter((element) => {
        return element !== 'LVTs' && element !== 'Assessment';
      });
    }
    const spotZonesConfigs = newSpotZones.map((item, idx: number) => {
      return {
        id: `2-1-${Number(idx) + 1}`,
        name: item === 'Assessment' ? LANG('观察区') : item,
      };
    });
    return {
      thirdOptions: spotZonesConfigs,
      secondOptions: spotUnitConfigs,
    };
  };
  const getSwapGoodsOptions = async () => {
    const group = await Group.getInstance();
    // const spotUnits = group?.getSpotUnits() || []; //  现货二级菜单
    const swapZones = group?.getSwapZones()?.slice() || []; // 现货三级菜单
    // const swapUnitConfigs: {
    //   id: string;
    //   name: string;
    // }[] = [];
    if (!swapZones.includes(LANG('全部'))) {
      swapZones.unshift(LANG('全部'));
    }
    const swapZonesConfigs = swapZones.map((item, idx: number) => {
      return {
        id: `2-1-${Number(idx) + 1}`,
        name: item,
      };
    });
    return {
      thirdOptions: swapZonesConfigs,
      secondOptions: PERPETUAL_OPTIONS,
      // secondOptions: swapUnitConfigs,
    };
  };
  useEffect(() => {
    const fetchOptions = async (currentId: string) => {
      if (currentId === CURRENT_TAB.PERPETUAL) {
        const result = await getSwapGoodsOptions();
        setOptions(result);
        return;
      }
      const result = await getSpotGoodsOptions();
      setOptions(result);
    };
    if ([CURRENT_TAB.SPOT_GOODS, CURRENT_TAB.PERPETUAL].includes(currentId)) {
      fetchOptions(currentId);
    }
  }, [currentId, secondId]);
  const OPTION_MAP: OptionMap = {
    [CURRENT_TAB.PERPETUAL]: options,
    [CURRENT_TAB.FAVORITE]: {
      secondOptions: FAVORITE_OPTIONS,
    },
    [CURRENT_TAB.SPOT_GOODS]: options,
    [CURRENT_TAB.LITE]: {
      secondOptions: LITE_OPTIONS,
    },
    [CURRENT_TAB.ETF]: {
      secondOptions: [{ name: 'USDT', id: ETF_OPTION_ID.USDT }],
    },
  };
  return OPTION_MAP[currentId];
};
export default useCascadeOptions;
