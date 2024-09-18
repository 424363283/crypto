import CoinLogo, { SafeNumber } from '@/components/coin-logo';
import { LiteTradeItem, SpotTradeItem, SwapTradeItem, TradeMap } from '@/core/shared';
import { isLite, isSpot, isSwap } from '@/core/utils';
import { memo, useEffect, useState } from 'react';
type CryptoLogoProps = {
  id: string;
  coin?: string;
  width: SafeNumber;
  height: SafeNumber;
  alt?: string;
  style?: React.CSSProperties;
  className?: string;
};
export const CryptoLogo = memo(({ id = '', ...props }: CryptoLogoProps) => {
  let coin = '';
  const [swapMap, setSwapMap] = useState<Map<string, SwapTradeItem>>();
  const [spotMap, setSpotMap] = useState<Map<string, SpotTradeItem>>();
  const [liteMap, setLiteMap] = useState<Map<string, LiteTradeItem>>();
  useEffect(() => {
    if (isSwap(id)) {
      TradeMap.getSwapTradeMap().then((data) => {
        if (data) {
          setSwapMap(data);
        }
      });
    } else if (isSpot(id)) {
      TradeMap.getSpotTradeMap().then((data) => {
        if (data) {
          setSpotMap(data);
        }
      });
    } else if (isLite(id)) {
      TradeMap.getLiteTradeMap().then((data) => {
        if (data) {
          setLiteMap(data);
        }
      });
    }
  }, [id]);
  if (isSwap(id)) {
    coin = swapMap?.get(id)?.iconCoin ?? '';
  } else if (isSpot(id)) {
    coin = spotMap?.get(id)?.iconCoin ?? '';
  } else if (isLite(id)) {
    coin = liteMap?.get(id)?.iconCoin ?? '';
  }
  return <CoinLogo {...props} coin={coin} />;
});
