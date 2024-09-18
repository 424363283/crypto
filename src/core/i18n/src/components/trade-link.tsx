import { isLite, isSpot, isSwap } from '@/core/utils/src/is';
import { useRouter } from 'next/router';
import { memo, useMemo } from 'react';
import liteids from '../coin/liteids.json';
import spotids from '../coin/spotids.json';
import swapids from '../coin/swapids.json';
import { TrLink } from './tr-link';

export const useTradeHrefData = () => {
  const router = useRouter();
  const getHrefAndQuery = useMemo(
    () => (id: string) => {
      const query: any = {};
      let href = '';
      id = id.toLowerCase();
      if (isSpot(id)) {
        if (spotids.includes(id)) {
          href = `/spot/${id}`;
        } else {
          href = `/spot`;
          query['id'] = id;
        }
        if (router.query?.mode) {
          query['mode'] = router.query.mode;
        }
      }
      if (isLite(id)) {
        if (liteids.includes(id)) {
          href = `/lite/${id}`;
        } else {
          href = `/lite`;
          query['id'] = id;
        }
      }
      if (isSwap(id)) {
        const isTestNet = /-SUSDT?$/i.test(id);
        const path = !isTestNet ? '/swap' : '/swap/demo';
        if (swapids.includes(id)) {
          href = `${path}/${id}`;
        } else {
          href = `${path}`;
          query['id'] = id;
        }
      }
      href = href.toLowerCase();
      return { href, query };
    },
    [router.query?.mode]
  );

  return {
    getHrefAndQuery,
  };
};

/**
 * 实现动静结合的路由跳转
 */
const TradeLinkMemo = ({ children, id, ...props }: any) => {
  const { getHrefAndQuery } = useTradeHrefData();
  const { href, query }: any = getHrefAndQuery(id.toUpperCase());
  return (
    <TrLink href={href} query={query} {...props}>
      {children}
    </TrLink>
  );
};

export const TradeLink = memo(TradeLinkMemo);
