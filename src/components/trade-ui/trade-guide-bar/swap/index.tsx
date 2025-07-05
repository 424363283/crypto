import CommonIcon from '@/components/common-icon';
import { useTheme } from '@/core/hooks';
import { LANG, TrLink } from '@/core/i18n';
import { LOCAL_KEY, resso, useResso } from '@/core/store';
import { clsx } from '@/core/utils';
import { isSwapDemo } from '@/core/utils/src/is';
import Image from 'next/image';
import { useState } from 'react';
import Tooltip from '../../common/tooltip';
import { useSwapTour } from '../../trade-guide/swap';

const store = resso(
  { show: true },
  { nameSpace: !isSwapDemo() ? LOCAL_KEY.TRADE_UI_SWAP_TRADE_GUIDE_BAR : LOCAL_KEY.TRADE_UI_SWAP_DEMO_TRADE_GUIDE_BAR }
);

const Index = ({}: {}) => {
  const { setIsOpen, setCurrentStep: _setCurrentStep } = useSwapTour();
  const { isDark, skin } = useTheme();
  const { show } = useResso(store);
  const setShow = (v: boolean) => {
    store.show = v;
  };
  const [step, setStep] = useState(0);
  const stepBgColor = `${isDark ? '#363a3a' : '#f2f4f6'}`;
  let stepActiveBgColor = isDark ? '#413e25' : '#fbf2d3';
  if (skin === 'blue') {
    stepActiveBgColor = 'var(--skin-primary-bg-color-opacity-3)';
  }

  const setCurrentStep = (v: number) => {
    setStep(v);
    _setCurrentStep(v);
  };

  return (
    <>
      <div className='swap-trade-guide-bar'>
        <div className='header'>
          <div>
            <div className='title'>{LANG('下单指引')}</div>
            <TrLink className='gift' href='/novice-task'>
              <CommonIcon name='common-guide-gift-0' width={16} height={16} enableSkin />
              <div>{LANG('新人福利最高可得$2,888 ')}</div>
              <CommonIcon name='common-arrow-right-active-0' width={24} height={24} enableSkin />
            </TrLink>
          </div>
          <div className='arrow' onClick={() => setShow(!show)}>
            <Image src='/static/images/common/arrow_down.png' width={12} height={7} alt='arrow-down' />
          </div>
        </div>
        {show && (
          <div className='steps hide-scroll-bar'>
            <div className={clsx('step', step === 0 && 'active')}>
              <div>
                <div className='title'>{`1. ${LANG('划转资金')}`}</div>
                <Tooltip placement='bottomLeft' title={LANG('确保有资金用来交易')}>
                  <div className='info'>{LANG('确保有资金用来交易')}</div>
                </Tooltip>
              </div>
              <div className='links'>
                <div
                  onClick={() => {
                    setCurrentStep(0);
                    setIsOpen(true);
                  }}
                >
                  {LANG('如何划转?')}
                </div>
              </div>
              <div className='right-arrow' />
            </div>
            <div className={clsx('step', [1, 2].includes(step) && 'active')}>
              <div className='left-arrow' />
              <div>
                <div className='title'>{`2. ${LANG('填价格/数量')}`}</div>
                <Tooltip placement='bottomLeft' title={LANG('你想在什么价格多少数量买入该币种')}>
                  <div className='info'>{LANG('你想在什么价格多少数量买入该币种')}</div>
                </Tooltip>
              </div>
              <div className='links'>
                <div
                  onClick={() => {
                    setCurrentStep(1);
                    setIsOpen(true);
                  }}
                >
                  {LANG('如何选择杠杆？')}
                </div>
                <div
                  onClick={() => {
                    setCurrentStep(2);
                    setIsOpen(true);
                  }}
                >
                  {LANG('如何填入价格/数量？')}
                </div>
              </div>
              <div className='right-arrow' />
            </div>
            <div className={clsx('step', step === 3 && 'active')}>
              <div className='left-arrow' />
              <div>
                <div className='title'>{`3. ${LANG('下单')}`}</div>
                <Tooltip placement='bottomLeft' title={LANG('成功买入')}>
                  <div className='info'>{LANG('成功买入')}</div>
                </Tooltip>
              </div>
              <div className='links'>
                <div
                  onClick={() => {
                    setCurrentStep(3);
                    setIsOpen(true);
                  }}
                >
                  {LANG('如何选择看涨/看跌？')}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <style jsx>{`
        .swap-trade-guide-bar {
          background-color: var(--fill_bg_1);
          border-radius: var(--theme-trade-layout-radius);
          margin-bottom: var(--theme-trade-layout-gap);
          padding: 0 10px;

          .arrow {
            cursor: pointer;
            width: 40px;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: flex-end;
          }
          .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 43px;
            display: flex;
            align-items: center;
            color: var(--theme-trade-text-color-1);
            > div {
              display: flex;
              align-items: center;
            }
            .title {
              font-size: 14px;
              font-weight: 500;
              margin-right: 4px;
            }
            :global(.gift) {
              display: flex;
              align-items: center;
              font-size: 12px;
              color: var(--skin-main-font-color);
              > div {
                margin-right: 3px;
              }
            }
          }
          .steps {
            display: flex;
            align-items: center;
            width: 100%;
            overflow-x: scroll;
            overflow-y: hidden;
            padding-bottom: 10px;

            .step {
              flex: none;
              position: relative;
              display: flex;
              align-items: center;
              justify-content: space-between;
              height: 57px;
              background-color: ${stepBgColor};
              > div {
                position: relative;
                z-index: 1;
                overflow: hidden;
                flex: 1;
              }
              &.active {
                background: ${stepActiveBgColor};

                :global(> div.right-arrow) {
                  border-right-color: ${stepActiveBgColor};
                }
              }
              :global(> div.left-arrow) {
                z-index: 0;
                position: absolute;
                left: -57px;
                top: 22px;
                transform: rotate(-45deg);
                border-top: 42px solid transparent;
                border-left: 42px solid transparent;
                border-right: 42px solid var(--fill_bg_1);
              }
              :global(> div.right-arrow) {
                z-index: 0;
                position: absolute;
                right: -26px;
                top: 22px;
                transform: rotate(-45deg);
                border-top: 42px solid transparent;
                border-left: 42px solid transparent;
                border-right: 42px solid ${stepBgColor};
              }
              &:nth-child(1) {
                flex: 424;
                min-width: 424px;
                padding-left: 20px;
                padding-right: 5px;
                margin-right: 21px;
                border-top-left-radius: 8px;
                border-bottom-left-radius: 8px;
                z-index: 3;
              }
              &:nth-child(2) {
                flex: 526;
                min-width: 526px;
                padding-left: 37px;
                padding-right: 5px;
                margin-right: 21px;
                z-index: 2;
              }
              &:nth-child(3) {
                flex: 422;
                min-width: 422px;
                padding-left: 37px;
                padding-right: 20px;
                margin-right: 2px;
                border-top-rught-radius: 8px;
                border-bottom-rught-radius: 8px;
              }
            }
            .title {
              font-size: 14px;
              color: var(--theme-trade-text-color-1);
            }
            .info {
              cursor: pointer;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              font-size: 12px;
              color: var(--theme-trade-text-color-3);
            }
            .links {
              display: flex;
              align-items: center;
              justify-content: flex-end;
              margin-left: 5px;
              > div {
                cursor: pointer;
                text-decoration: underline;
                font-size: 12px;
                color: var(--theme-trade-text-color-3);
                margin-left: 3px;
              }
            }
          }
        }
      `}</style>
    </>
  );
};

export default Index;
