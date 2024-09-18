import { LANG } from '@/core/i18n';
import { useAppContext, useResso } from '@/core/store';
import React, { ReactNode, useContext, useLayoutEffect, useRef, useState } from 'react';
import { Popover } from './popover';

import { swapTradeStore } from '@/components/trade-ui/trade-view/swap/utils';
import { isSwapDemo } from '@/core/utils';
import dynamic from 'next/dynamic';
import { store } from './store';

const Tour = dynamic(() => import('reactour'), {
  ssr: false,
  loading: () => <div />,
});
export const headerSwapDemoGuideStore = store;
export const useHeaderSwapDemoTour = () => useContext(HeaderSwapDemoTourContext);
const HeaderSwapDemoTourContext = React.createContext({
  step: 0,
  setIsOpen: (v: boolean) => {},
  setCurrentStep: (v: number) => {},
});
export const HeaderSwapDemoGuide = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { step, setCurrentStep } = useResso(store);

  const _ = useRef({ prevOverflow: '' });
  const disableBody = (target: any) => {
    _.current.prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  };
  const enableBody = (target: any) => {
    document.body.style.overflow = _.current.prevOverflow;
  };

  const { isLogin } = {isLogin:true};//useAppContext();

  const { _initCached, step: headerSwapDemoGuideStoreStep } = headerSwapDemoGuideStore;
  useLayoutEffect(() => {
    if (_initCached && isLogin && !isSwapDemo()) {
      if (headerSwapDemoGuideStoreStep == 0) {
        setCurrentStep(0);
        setIsOpen(true);
      } else {
        swapTradeStore.headerSwapDemoGuide = false;
      }
    }
  }, [_initCached, isLogin]);

  return (
    <>
      <Tour
        steps={steps}
        startAt={step}
        onAfterOpen={(e) => {
          disableBody(e);
        }}
        onBeforeClose={enableBody}
        onRequestClose={() => {
          setIsOpen(false);
          swapTradeStore.headerSwapDemoGuide = false;
          headerSwapDemoGuideStore.showDemoMenu = false;
        }}
        isOpen={isOpen}
        badgeContent={() => null}
        showCloseButton={false}
        showButtons={false}
        showNavigation={false}
        showNavigationNumber={false}
        showNumber={false}
        rounded={8}
        disableInteraction
      />

      <HeaderSwapDemoTourContext.Provider value={{ setIsOpen: setIsOpen, step, setCurrentStep }}>
        {children}
      </HeaderSwapDemoTourContext.Provider>
    </>
  );
};

const defaultStepType = {
  position: 'bottom',
  style: {
    background: 'var(--skin-primary-color)',
    borderRadius: 8,
    padding: 0,
    width: 169,
  },
};

const defaultStep: any = defaultStepType;

export const steps: any[] = [
  {
    ...defaultStep,
    selector: '.header-guide-swap-demo-step-1',
    content: () => ({
      content: [LANG('发现一个新功能。')],
      arrow: 'top',
    }),
    style: {
      ...defaultStep.style,
    },
  },
  {
    ...defaultStep,
    selector: '.header-guide-swap-demo-step-2',
    content: () => ({
      content: [LANG('去试试。')],
      arrow: 'left',
    }),
    position: 'right',
    style: {
      ...defaultStep.style,
      marginLeft: 5,
    },
  },
].map((v) => ({
  ...v,
  content: (({ close, goTo }: any) => {
    const params: any = v.content();
    return <Popover content={params.content} onClose={close} goTo={goTo} arrow={params.arrow} />;
  }) as any,
}));

export default HeaderSwapDemoGuide;
