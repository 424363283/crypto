import { List } from '@/components/trade-ui/quote-list/components/list';
import { useRouter } from '@/core/hooks';
import { SUBSCRIBE_TYPES, useWs } from '@/core/network';
import { Group, Swap } from '@/core/shared';
import { SWAP_BOUNS_WALLET_KEY } from '@/core/shared/src/swap/modules/assets/constants';
import { isSwapCoin, isSwapDemo, isSwapSLCoin } from '@/core/utils';
import { useEffect, useMemo, useRef, useState } from 'react';
import SecondaryTitle from './secondary-title';

enum SwapType {
  coin = 'coin',
  usdt = 'usdt',
}

export const QuoteList = ({
  visible,
  onClickItem,
  toast,
}: {
  visible?: boolean;
  onClickItem?: Function;
  toast?: boolean;
}) => {
  const [list, setList] = useState<any>([]);
  const id = useRouter().query.id as string;
  const swapType = useRef<SwapType>();
  const isDemoSwap = isSwapDemo();
  const { isUsdtType } = Swap.Trade.base;
  const walletId = Swap.Info.getWalletId(isUsdtType);
  const [zone, setZone] = useState<string | undefined>();
  // 二级标题
  const [secondaryActiveIndex, setSecondaryActiveIndex] = useState(0);
  const [secondaryTabs, setSecondaryTabs] = useState<string[]>([]);
  swapType.current = (!isDemoSwap ? isSwapCoin : isSwapSLCoin)(id) ? SwapType.coin : SwapType.usdt;

  useEffect(() => {
    (async () => {
      const group = await Group.getInstance();
      const secondaryTabs = group.getSwapZones();
      setSecondaryTabs(['All', ...secondaryTabs]);
    })();
  }, []);
  useWs(SUBSCRIBE_TYPES.ws3001, (data) => {
    if (swapType.current === SwapType.coin) {
      setList(data.getSwapCoinList());
    }
    if (swapType.current === SwapType.usdt) {
      setList(data.getSwapUsdtList());
    }
  });
  const filterList = useMemo(() => {
    if (walletId === SWAP_BOUNS_WALLET_KEY) {
      return list.filter((v: any) => {
        const data = Swap.Info.getCryptoData(v.id, { withHooks: false });
        return data.supportBouns;
      });
    }
    return list;
  }, [list, walletId]);
  return (
    <>
      <div className='quote-list'>
        <List
          toast={toast}
          data={[...filterList]}
          isSwap
          zone={zone}
          visible={visible}
          onClickItem={onClickItem}
          renderSearchBottom={() =>
            isUsdtType ? (
              <SecondaryTitle
                activeIndex={secondaryActiveIndex}
                onTabsChange={(v) => {
                  const key = secondaryTabs[v];
                  if (key === 'All') {
                    setZone(undefined);
                  } else {
                    setZone(key);
                  }
                  setSecondaryActiveIndex(v);
                }}
                tabs={secondaryTabs}
              />
            ) : (
              <></>
            )
          }
        />
      </div>
      <style jsx>{`
        .quote-list {
          width: 348px;
          height: 497px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
      `}</style>
    </>
  );
};
