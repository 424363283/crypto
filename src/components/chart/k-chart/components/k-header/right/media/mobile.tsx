import { Svg } from '@/components/svg';
import { kChartEmitter } from '@/core/events';
import { LANG } from '@/core/i18n';
import { clsx, isLite } from '@/core/utils';
import { Popover } from 'antd';
import { useState } from 'react';
import { KTYPE, kHeaderStore } from '../../store';

export const MobileLayout = ({ id, qty }: any) => {
  const { kType } = kHeaderStore(qty);
  const [fullScreen, setFullScreen] = useState(false);
  const [open, setOpen] = useState(false);

  return (
      <>
        <div className='m-r'>
          <Popover
              overlayInnerStyle={{
                backgroundColor: 'var(--bg-1)',
                padding: 0,
                border: '1px solid var(--theme-trade-border-color-2)',
              }}
              placement='bottomLeft'
              arrow={false}
              trigger='hover'
              open={open}
              onOpenChange={setOpen}
              content={<Content id={id} open={open} qty={qty} setOpen={setOpen} />}
          >
            <div className='p-c'>
            <span style={{ color: 'var(--color-active)' }}>
              {kType == KTYPE.K_LINE_CHART
                  ? LANG('基础版')
                  : kType == KTYPE.TRADING_VIEW
                      ? 'Trading View'
                      : !isLite(id)
                          ? LANG('深度图')
                          : ''}
            </span>
              <Svg
                  className='kline-arrow'
                  src='/static/images/trade/kline/triangle-down.svg'
                  width={14}
                  height={14}
                  currentColor={'var(--theme-kline-header-color)'}
              />
            </div>
          </Popover>

          <div
              className='full-screen'
              onClick={() => {
                setFullScreen(!fullScreen);
                document.getElementById(`k-box-${qty}`)?.classList.toggle('k-full-screen');
                kChartEmitter.emit(kChartEmitter.K_CHART_FULL_SCREEN);
              }}
          >
            <Svg
                src={`/static/images/trade/kline/${fullScreen ? 'close-full-screen' : 'full-screen'}.svg`}
                width={14}
                height={14}
                currentColor={'var(--theme-kline-header-color)'}
            />
          </div>
        </div>

        <style jsx>{`
        .m-r {
          display: flex;
          align-items: center;
          .full-screen {
            margin-left: 15px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          :global(.p-c) {
            display: flex;
            align-items: center;
            font-weight: 400;
            font-size: 12px;
            :global(.kline-arrow) {
              transition: transform 0.3s;
            }
          }
        }
      `}</style>
      </>
  );
};

const Content = ({ id, open, setOpen, qty }: any) => {
  const { kType, setkType } = kHeaderStore(qty);
  const hanldeClick = (k: KTYPE) => {
    setkType(k);
    setOpen(false);
  };
  return (
      <>
        <div className='c'>
        <span className={clsx(kType == KTYPE.K_LINE_CHART && 'active')} onClick={() => hanldeClick(KTYPE.K_LINE_CHART)}>
          {LANG('基础版')}
        </span>
          <span className={clsx(kType == KTYPE.TRADING_VIEW && 'active')} onClick={() => hanldeClick(KTYPE.TRADING_VIEW)}>
          Trading View
        </span>
          {isLite(id) ? null : (
              <span className={clsx(kType == KTYPE.DEEP_CHART && 'active')} onClick={() => hanldeClick(KTYPE.DEEP_CHART)}>
            {LANG('深度图')}
          </span>
          )}
        </div>
        <style jsx>
          {`
          .c {
            display: flex;
            flex-direction: column;
            padding: 10px;
            span {
              padding: 5px 0;
              cursor: pointer;
              color: var(--theme-trade-text-color-1);
              font-size: 10px;
              font-weight: 400;
              &:hover {
                color: var(--color-active);
              }
              &.active {
                color: var(--color-active);
              }
            }
          }
        `}
        </style>
      </>
  );
};
