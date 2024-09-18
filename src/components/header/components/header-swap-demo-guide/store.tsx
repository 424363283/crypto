import { LOCAL_KEY, resso } from '@/core/store';

export const store = resso(
  {
    step: 0,
    showDemoMenu: false,
    setCurrentStep: (v: number) => {
      store.step = v;
    },
  },
  { nameSpace: LOCAL_KEY.HEADER_SWAP_DEMO_GUIDE, whileList: ['step'] }
);
