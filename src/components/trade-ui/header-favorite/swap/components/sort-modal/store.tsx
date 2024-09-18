import { LOCAL_KEY, resso } from '@/core/store';
import { isSwapDemo } from '@/core/utils/src/is';
export const store = resso<{ sorts: Record<string, number> }>(
  {
    sorts: {},
  },
  { nameSpace: !isSwapDemo() ? LOCAL_KEY.SWAP_COMPONENTS_SORT_MODAL : LOCAL_KEY.SWAP_DEMO_COMPONENTS_SORT_MODAL }
);
