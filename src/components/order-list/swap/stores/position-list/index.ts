import { Loading } from '@/components/loading';
import { Swap } from '@/core/shared';
import { resso } from '@/core/store';
import { message } from '@/core/utils';
import { useState } from 'react';

export const store: any = resso({
  sort: {
    key: null,
    value: null,
  },
  incomeType: 0,
  getSortValue: (key: string, sort: any) => (sort.key === key ? sort.value : null),
  sortTypeChangeEvent: (key: string) => {
    return (value: number) => {
      store.sort = { key, value } as any;
    };
  },
});

export const useSortData = (data: any) => {
  const { sort } = store;
  const key = sort.key;

  if (sort.key && sort.value >= 0) {
    return [...data].sort((a, b) => {
      let aValue = a[key];
      let bValue = b[key];

      if (typeof aValue === 'string') {
        aValue = a[key].charCodeAt();
        bValue = b[key].charCodeAt();
      }

      return sort.value ? aValue - bValue : bValue - aValue;
    });
  }

  return data;
};

export const useModalProps = () => {
  const [liquidationModalProps, setLiquidationModalProps] = useState({
    visible: false,
    data: { symbol: '' },
    isLimit: false,
  });
  const [marginModalProps, setMarginModalProps] = useState({
    visible: false,
    data: { symbol: '' },
  });
  const [trackModalProps, setTrackModalProps] = useState({
    visible: false,
    data: { symbol: '' },
  });
  const [spslModalProps, setSpslModalProps] = useState({
    visible: false,
    data: { symbol: '' },
    tab:0,
  });

  const [reverseModalProps, setReverseModalProps] = useState({
    visible: false,
    data: { symbol: '' },
    onConfirm: () => {},
  });

  const onVisiblesSpslModal = (item: any,tab?:any) => {
    setSpslModalProps({ visible: true, data: item,tab:tab || 0});
  };
  const onCloseSpslModal = () => setSpslModalProps((v) => ({ ...v, visible: false }));

  const onVisibleTrackModal = (item: any) => {
    setTrackModalProps({ visible: true, data: item });
  };
  const onCloseTrackModal = () => setTrackModalProps((v) => ({ ...v, visible: false }));

  const onVisibleMarginModal = (item: any) => {
    setMarginModalProps({ visible: true, data: item });
  };
  const onCloseMarginModal = () => setMarginModalProps((v) => ({ ...v, visible: false }));

  const onVisibleLiquidationModal = (item: any, isLimit: any) => {
    setLiquidationModalProps({ visible: true, data: item, isLimit });
  };
  const onCloseLiquidationModal = () => setLiquidationModalProps((v) => ({ ...v, visible: false }));
  const onVisibleReverseModal = (item: any, onConfirm: any) => {
    setReverseModalProps({ visible: true, data: item, onConfirm });
  };
  const onCloseReverseModal = () => setReverseModalProps((v) => ({ ...v, visible: false }));

  return {
    liquidationModalProps,
    onVisibleLiquidationModal,
    onCloseLiquidationModal,
    marginModalProps,
    onVisibleMarginModal,
    onCloseMarginModal,
    trackModalProps,
    onVisibleTrackModal,
    onCloseTrackModal,
    spslModalProps,
    onVisiblesSpslModal,
    onCloseSpslModal,
    reverseModalProps,
    onCloseReverseModal,
    onVisibleReverseModal,
  };
};

export const usePositionActions = () => {
  const onReverse = (item: any, callback: (args: { onConfirm: Function }) => any) => {
    const isUsdtType = Swap.Info.getIsUsdtType(item.symbol);
    const { reverse } = Swap.Info.getOrderConfirm(isUsdtType);
    const onOk = async () => {
      Loading.start();
      try {
        const result = await Swap.Order.reverseOpenPosition(isUsdtType, item);
        if (result.code != 200) {
          message.error(result);
        }
      } catch (error: any) {
        message.error(error);
      } finally {
        Loading.end();
      }
    };
    if (reverse) {
      callback({ onConfirm: onOk });
    } else {
      onOk();
    }
  };

  return { onReverse };
};
