import { useRouter } from '@/core/hooks';
import { Group, GroupItem } from '@/core/shared';
import { getUrlQueryParams,isLite } from '@/core/utils';
import { useLayoutEffect } from 'react';

type MapType = {
  swap: {
    ids: GroupItem[];
    action: () => void;
  };

  spot: {
    ids: GroupItem[];
    action: () => void;
  };


  lite: {
    ids: GroupItem[];
    action: () => void;
  };
  
};

/**
 * Description: 无币对跳转兼容
 * @param {key} key: keyof MapType
 * @returns {void}
 */
export const useGroupidsDiffRedirect = (key: keyof MapType): void => {
  const router = useRouter();
  useLayoutEffect(() => {
    (async () => {
      const _id = getUrlQueryParams('id') || '';
      const id = router.query.id || _id?.toLocaleUpperCase();
      const group = await Group.getInstance(true);
      const MAP: MapType = {
        swap: {
          ids: group.getSwapList,
          action: () => {
            if (MAP[key].ids.find((item) => item.id === 'BTC-USDT')) {
              router.push(`/${key}/btc-usdt`);
            } else {
              router.push(`/${key}/${MAP[key].ids[0]?.id?.toLocaleLowerCase()}`);
            }
          },
        },
        spot: {
          ids: group.getSpotList,
          action: () => {
            if (MAP[key].ids.find((item) => item.id === 'BTC_USDT')) {
              router.push(`/${key}/btc_usdt`);
            } else {
              router.push(`/${key}/${MAP[key].ids[0]?.id?.toLocaleLowerCase()}`);
            }
          },
        },
        lite: {
          ids: group.getLiteList,
          action: () => {
            let klineId = group.getLiteQuoteCode(id);
            if(klineId){
              router.push(`/${key}/${id.toLocaleLowerCase()}`);
              // router.push(`/${key}/${id.toLocaleLowerCase()}?contract=${klineId}`);
            }else{
              let _id = '';
              if (MAP[key].ids.find((item) => item.id === 'BTCUSDT')) {
                _id = 'btcusdt';
              } else {
                _id = MAP[key].ids[0]?.id?.toLocaleLowerCase();
              }
              klineId = group.getLiteQuoteCode(id) || id;
              router.push(`/${key}/${_id}`);
              // router.push(`/${key}/${_id}?contract=${klineId}`);
            }
          },
        },
      };
      const findData = MAP[key].ids.find((item) => item.id === id);
      if (isLite(id) || (!findData && id)) {
        MAP[key].action();
      }
    })();
  }, []);
};
