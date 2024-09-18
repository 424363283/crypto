import { LANG } from '@/core/i18n';
import { useAppContext } from '@/core/store';
import dynamic from 'next/dynamic';
import React, { ReactNode, useContext, useRef, useState } from 'react';
import { Popover } from './popover';

const Tour = dynamic(() => import('reactour'), {
  ssr: false,
  loading: () => <div />,
});
export const useSwapTour = () => useContext(SwapTourContext);
const SwapTourContext = React.createContext({ setIsOpen: (v: boolean) => {}, setCurrentStep: (v: number) => {} });
const Index = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setCurrentStep] = useState(0);

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
        onRequestClose={() => setIsOpen(false)}
        isOpen={isOpen}
        badgeContent={() => null}
        showCloseButton={false}
        showButtons={false}
        showNavigation={false}
        showNavigationNumber={false}
        showNumber={false}
        rounded={8}
        disableInteraction
      ></Tour>
      <SwapTourContext.Provider value={{ setIsOpen, setCurrentStep }}>{children}</SwapTourContext.Provider>
    </>
  );
};

const defaultStep = {
  position: 'bottom',
  style: {
    background: 'var(--theme-background-color-8)',
    borderRadius: 8,
    padding: 10,
    width: 280,
  },
};
export const steps: any[] = [
  {
    selector: '.swap-guide-step-1',
    content: () => ({
      title: LANG('划转'),
      content: [LANG('立即从现货账户划转资金至合约账户，开始合约交易')],
      video: '/mp4/trade-swap-guide-step1/',
    }),
    ...defaultStep,
  },
  {
    selector: '.swap-guide-step-2',
    content: () => ({
      title: LANG('什么是合约杠杆'),
      content: [
        LANG('槓桿會放大您的最大購買力，如果10X做多，當前價格若上漲1%，盈利將達到10%；當前價格下跌1%，虧損將達到10%'),
      ],
      dangerInfo: `(${LANG('新手建議使用低倍槓桿')})`,
      video: '/mp4/trade-swap-guide-step2/',
    }),
    ...defaultStep,
  },
  {
    selector: '.swap-guide-step-3',
    content: () => ({
      title: LANG('填入價格/數量'),
      content: [
        `1. ${LANG('填入你預期的開倉價格，如果市價單則會以最優價成交')}`,
        `2. ${LANG('填入你預期的開倉數量，其中最大可開數量為當前槓桿下的最大購買力')}`,
      ],
      video: '/mp4/trade-swap-guide-step3/',
    }),
    ...defaultStep,
  },
  {
    selector: '.swap-guide-step-4',
    content: () => ({
      title: LANG('开仓'),
      content: [
        LANG('根據您對漲跌的判斷在填寫價格和數量之後，可選擇開多或是開空。'),
        'space',
        `1. ${LANG('開多（我認為該幣種會漲 ↑）')}`,
        `2. ${LANG('開空（我認為該幣種會跌 ↓）')}`,
      ],
      video: '/mp4/trade-swap-guide-step4/',
    }),
    ...defaultStep,
  },
].map((v) => ({
  ...v,
  content: (({ close }: any) => {
    const params: any = v.content();
    return (
      <VideoLangeFormat>
        {(lang) => (
          <Popover
            title={params.title}
            content={params.content}
            dangerInfo={params.dangerInfo}
            onClose={close}
            defaultVideo={`${params.video}en.mp4`}
            video={`${params.video}${lang}.mp4`}
          />
        )}
      </VideoLangeFormat>
    );
  }) as any,
}));

const VideoLangeFormat = ({ children }: { children: (lang: string) => ReactNode }) => {
  const { locale } = useAppContext();
  return <>{children(locale)}</>;
};

export default Index;
