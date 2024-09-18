import { resso } from '@/core/store';

export const store = resso({
  step: 0,
  setCurrentStep: (v: number) => {
    store.step = v;
  },
  isOpen: false,
  setIsOpen: (v: boolean) => {
    store.isOpen = v;
  },
});
