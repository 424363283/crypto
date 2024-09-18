import { LANG } from '@/core/i18n';
import { useResso } from '@/core/store';
import React, { ReactNode, useContext, useRef } from 'react';
import { Popover } from './popover';

import dynamic from 'next/dynamic';
import { store } from './store';

const Tour = dynamic(() => import('reactour'), {
  ssr: false,
  loading: () => <div />,
});
export const walleViewGuideGuideStore = store;
export const useWalleViewGuideTour = () => useContext(WalleViewGuideTourContext);
const WalleViewGuideTourContext = React.createContext({
  step: 0,
  setIsOpen: (v: boolean) => {},
  setCurrentStep: (v: number) => {},
});
export const WalleViewGuideGuide = ({ children }: { children: ReactNode }) => {
  const { step, setCurrentStep, isOpen, setIsOpen } = useResso(store);

  const _ = useRef({ prevOverflow: '' });
  const disableBody = (target: any) => {
    _.current.prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  };
  const enableBody = (target: any) => {
    document.body.style.overflow = _.current.prevOverflow;
  };

  return (
    <>
      <Tour
        steps={steps}
        startAt={step}
        onAfterOpen={disableBody}
        onBeforeClose={enableBody}
        onRequestClose={() => {
          setIsOpen(false);
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

      <WalleViewGuideTourContext.Provider value={{ setIsOpen: setIsOpen, step, setCurrentStep }}>
        {children}
      </WalleViewGuideTourContext.Provider>
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
    selector: '.wallet-view-guide-step-1',
    content: () => ({
      content: [LANG('点击此处，查看体验金钱包介绍')],
      arrow: 'top',
    }),
    style: {
      ...defaultStep.style,
    },
  },
].map((v) => ({
  ...v,
  content: (({ close, goTo }: any) => {
    const params: any = v.content();
    return <Popover content={params.content} onClose={close} goTo={goTo} arrow={params.arrow} />;
  }) as any,
}));

export default WalleViewGuideGuide;
