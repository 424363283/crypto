import { Svg } from '@/components/svg';
import { kChartEmitter } from '@/core/events';
import { LANG } from '@/core/i18n';
import { clsx, isLite } from '@/core/utils';
import { useState } from 'react';
import { KTYPE, kHeaderStore } from '../../store';

export const DesktopLayout = ({ id, qty }: any) => {
  const { kType, setkType } = kHeaderStore(qty);
  const [fullScreen, setFullScreen] = useState(false);
  const hanldeClick = (k: KTYPE) => setkType(k);

  return (
      <>
        <div className='d-r'>
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
        .d-r {
          display: flex;
          align-items: center;
          .full-screen {
            margin-left: 15px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          span {
            cursor: pointer;
            margin-left: 15px;
            color: var(--theme-kline-header-color);
            font-weight: 400;
            font-size: 12px;
            &:hover {
              color: var(--color-active);
            }
            &.active {
              color: var(--color-active);
            }
          }
        }
      `}</style>
      </>
  );
};
