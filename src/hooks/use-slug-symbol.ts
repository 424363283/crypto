import { DEPTH } from '@/constants';
import { getFutureSymbolInfo } from '@/utils';
import { U_Precision } from '@/utils/futures';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';

export function useSlugSymbol() {
  const { slug } = useParams();

  const slugSymbol = useMemo(() => {
    // BTCUSDT
    const symbolId = slug?.[slug?.length - 1];

    // BTC-SWAP-USDT
    const lSymbolSwapId = symbolId?.replace(/USDT/, '-SWAP-$&');

    const futureSymbolInfo = getFutureSymbolInfo(lSymbolSwapId);
    // console.log('lSymbolSwapId::::', lSymbolSwapId, symbolId);

    if (futureSymbolInfo?.symbolId) {
      const contractMultiplier = futureSymbolInfo.baseTokenFutures!.contractMultiplier; //合约系数
      let unitLen: number = 0;

      const multipliers = ('' + contractMultiplier).split('.');
      if (multipliers[1]) {
        unitLen = multipliers[0] != '0' ? 0 : multipliers[1].length || 0;
      }

      const max_digits = DEPTH[futureSymbolInfo.minPricePrecision];
      const priceUnitLen = DEPTH[futureSymbolInfo.minPricePrecision]; //价格精度
      const coinUnitLen = DEPTH[contractMultiplier]; // 币精度
      const usdtUnitLen = U_Precision; // U精度

      return Object.assign({}, futureSymbolInfo, {
        contractMultiplier,
        unitLen,
        symbol_id: symbolId,
        symbolSwapId: lSymbolSwapId,
        indexToken: futureSymbolInfo.baseTokenFutures?.indexToken,
        max_digits,
        priceUnitLen,
        coinUnitLen,
        usdtUnitLen
      });
    }
    return {
      symbol_id: symbolId,
      symbolSwapId: lSymbolSwapId,
      indexToken: symbolId,
      minPricePrecision: '0'
    };
  }, [slug]);

  return slugSymbol as GlobalStore;
}
