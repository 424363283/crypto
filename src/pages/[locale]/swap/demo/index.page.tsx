import { Lang } from '@/core/i18n';
import { WS3001, WS4001 } from '@/core/network';

import { SwapPage } from '../[id]/index.page';

export default Lang.SeoHead(
  WS3001(
    WS4001(() => <SwapPage isSwapDemo />),
    { swapSL: true }
  )
);
export const getStaticPaths = Lang.getStaticPathsTradeCallback('swapids');
export const getStaticProps = Lang.getStaticProps({ key: 'swap/demo' });
