import CommonIcon from '@/components/common-icon';
import GradienScrollRow from '@/components/gradien-scroll-row';
import { Svg } from '@/components/svg';
import { FavorEmitter } from '@/core/events';
import { TradeLink } from '@/core/i18n';
import { SUBSCRIBE_TYPES, useWs } from '@/core/network';
import { FAVORITE_TYPE, FAVORS_LIST, Favors, MarketsMap } from '@/core/shared';
import { useResso } from '@/core/store';
import { clsx } from '@/core/utils';
import { isSwapDemo } from '@/core/utils/src/is';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-use';
import { store as SortModalStore } from './components/sort-modal/store';

const SortModal = dynamic(() => import('./components/sort-modal'), { ssr: false, loading: () => <div /> });

export const Index = () => {
  const { sorts } = useResso(SortModalStore);
  const [marketsDetail, setMarketDetail] = useState<MarketsMap>();
  const [totalFavorsList, setFavorsList] = useState<FAVORS_LIST[]>([]);
  const [visible, setVisible] = useState(false);
  const fetchFavorsList = async () => {
    const favors = await Favors.getInstance();
    const favList = [] as any;// TODO favors.getFavorsList();
    setFavorsList(favList || []);
  };
  // 行情数据
  useWs(SUBSCRIBE_TYPES.ws3001, async (detail) => {
    setMarketDetail(detail);
  });

  useEffect(() => {
    const callback = () => {
      fetchFavorsList();
    };
    callback();
    FavorEmitter.addListener(FavorEmitter.Update, callback);
    return () => {
      FavorEmitter.removeListener(FavorEmitter.Update, callback);
    };
  }, []);
  const isDemo = isSwapDemo(useLocation().pathname);
  const favorsList = totalFavorsList
    // .find((v) => v.type === (isUsdtType ? FAVORITE_TYPE.SWAP_USDT : FAVORITE_TYPE.SWAP_COIN))
    .reduce<any>(
      (r, v) => [
        ...r,
        ...((!isDemo
          ? [FAVORITE_TYPE.SWAP_USDT, FAVORITE_TYPE.SWAP_COIN]
          : [FAVORITE_TYPE.SWAP_USDT_TESTNET, FAVORITE_TYPE.SWAP_COIN_TESTNET]
        ).includes(v.type)
          ? v.list
          : []),
      ],
      []
    )
    .map((v: string, i: number) => [v, sorts[v] !== undefined ? sorts[v] : i])
    .sort((a: any, b: any) => a[1] - b[1])
    .map((v: any) => v[0]);

  return (
    <>
      <div className='header-favorite'>
        <CommonIcon name='common-fav-star-0' width={12} height={15} enableSkin />
        <GradienScrollRow>
          <div className='list'>
            {favorsList?.map((id: any) => {
              const item = marketsDetail?.[id];
              return (
                <TradeLink key={id} id={id}>
                  <div>
                    <span>{item?.name}</span>
                    <span className={clsx('price', item?.isUp ? 'green' : 'red')}>
                      {item?.rate !== undefined ? `${item?.rate}%` : ''}
                    </span>
                  </div>
                </TradeLink>
              );
            })}
          </div>
        </GradienScrollRow>
        <div className='more' onClick={() => setVisible(true)}>
          <Svg src='/static/images/swap/vertical_more.svg' width={12} height={12} />
        </div>
      </div>
      {visible && <SortModal visible={visible} onClose={() => setVisible(false)} />}
      <style jsx>{`
        .header-favorite {
          display: flex;
          align-items: center;
          padding-left: 18px;
          font-size: 12px;
          height: 100%;
          .list {
            height: 100%;
            display: flex;
            align-items: center;

            div {
              display: flex;
              align-items: center;
              margin-left: 10px;
              > span:first-child {
                color: var(--theme-trade-text-color-1);
              }
              &:last-child {
                padding-right: 18px;
              }
            }
            .price {
              white-space: nowrap;
              margin-left: 5px;
            }
            .green {
              color: var(--color-green);
            }
            .red {
              color: var(--color-red);
            }
          }
          .more {
            padding: 0 10px;
            cursor: pointer;
          }
        }
      `}</style>
    </>
  );
};
export default Index;
