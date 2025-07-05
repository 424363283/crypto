import { List } from '@/components/trade-ui/quote-list/components/list';
import { useRouter } from '@/core/hooks';
import { SUBSCRIBE_TYPES, useWs } from '@/core/network';
import { Group, Swap, Favors } from '@/core/shared';
import { SWAP_BOUNS_WALLET_KEY } from '@/core/shared/src/swap/modules/assets/constants';
import { isSwapCoin, isSwapDemo, isSwapSLCoin } from '@/core/utils';
import { useEffect, useMemo, useRef, useState } from 'react';
import SecondaryTitle from './secondary-title';
import { LANG } from '@/core/i18n';
import { sortSwapList } from '@/core/shared/src/copy/utils';

enum SwapType {
  coin = 'coin',
  usdt = 'usdt'
}

export const QuoteList = ({
  visible,
  onClickItem,
  toast
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
  const [favorIds, setFavorIds] = useState<string[]>([]);

  // 二级标题
  const [secondaryActiveIndex, setSecondaryActiveIndex] = useState(1);
  const [secondaryTabs, setSecondaryTabs] = useState<string[]>([]);
  swapType.current = (!isDemoSwap ? isSwapCoin : isSwapSLCoin)(id) ? SwapType.coin : SwapType.usdt;
  const sortList = sortSwapList(list, ['BTCUSDT', 'ETHUSDT']);

  useEffect(() => {
    (async () => {
      const group = await Group.getInstance();
      const secondaryTabs = group.getSwapZones();
      setSecondaryTabs([LANG('自选'), 'All', ...secondaryTabs]);
    })();
  }, []);
  useWs(SUBSCRIBE_TYPES.ws3001, async data => {
    const favors = await Favors.getInstance();
    setFavorIds(favors.getSwapFavorsList());
    if (swapType.current === SwapType.coin) {
      setList(data.getSwapCoinList());
    }
    if (swapType.current === SwapType.usdt) {
      setList(data.getSwapUsdtList());
    }
  });
  const filterList = useMemo(() => {
    if (walletId === SWAP_BOUNS_WALLET_KEY) {
      return sortList.filter((v: any) => {
        const data = Swap.Info.getCryptoData(v.id, { withHooks: false });
        return data.supportBouns;
      });
    }
    return sortList;
  }, [list, walletId]);
  return (
    <>
      <div className="quote-list">
        <List
          toast={toast}
          data={[...filterList].filter(item => {
            if (secondaryActiveIndex === 0) {
              return favorIds.includes(item.id);
            }
            return true;
          })}
          isSwap
          zone={zone}
          visible={visible}
          onClickItem={onClickItem}
          renderSearchBottom={() =>
            isUsdtType ? (
              <div className="options">
                <SecondaryTitle
                  className="secondary-title"
                  activeIndex={secondaryActiveIndex}
                  onTabsChange={v => {
                    const key = secondaryTabs[v];
                    if (key === LANG('自选') || key === 'All') {
                      setZone(undefined);
                    } else {
                      setZone(key);
                    }
                    setSecondaryActiveIndex(v);
                  }}
                  tabs={secondaryTabs}
                />
              </div>
            ) : (
              <></>
            )
          }
        />
      </div>
      <style jsx>{`
        .quote-list {
          width: 340px;
          height: 374px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        :global(.quote-wrapper) {
          padding: 0 16px;
          margin: 16px 0;
        }
        :global(.secondary-title) {
          margin: 0 16px;
          :global(.list) {
            justify-content: flex-start;
          }
        }
        :global(.options) {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding-bottom: 16px;
        }
      `}</style>
    </>
  );
};
