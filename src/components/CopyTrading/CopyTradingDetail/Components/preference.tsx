import React, { PureComponent, useEffect, useState } from 'react';
import clsx from 'clsx';
import { MediaInfo } from '@/core/utils';
import { Tooltip as TooltipMessage } from '@/components/trade-ui/common/tooltip';
import css from 'styled-jsx/css';
import { Svg } from '@/components/svg';
import { Popover } from 'antd';
import PreferencePieChart from './preferencePieChart';
import { LANG } from '@/core/i18n';
import { PREFERENCE_DATA } from '@/core/shared/src/copy/types';
import { EmptyComponent } from '@/components/empty';
import { findIndexOfMaxByKey } from '@/core/shared/src/copy/utils';

export default function Preference(props: { preferenceData: PREFERENCE_DATA }) {
  const { preferenceData } = props;
  const maxInx: any = findIndexOfMaxByKey(preferenceData, 'currentValue') || 0;

  const [currentIdx, setCurrentIdx] = useState(maxInx);
  const PreferenceSymbol = () => {
    return (
      <>
        <div className={clsx('preferenceBox', 'gap24')}>
          {preferenceData.map((item, idx) => {
            return (
              <div
                className={clsx('flexSpan', 'symbol-item')}
                key={item.symbol}
                onMouseEnter={() => {
                  setCurrentIdx(idx);
                }}
                onMouseLeave={() => {
                  setCurrentIdx(maxInx);
                }}
              >
                <div className={clsx('flexCenter')}>
                  <div className={clsx('symbolIcon')} style={{ background: item.color }}></div>
                  <div className={clsx('symbol')}>{item?.name}</div>
                </div>
                <div> {item?.value}%</div>
              </div>
            );
          })}
        </div>
        <style jsx>{styles}</style>
      </>
    );
  };

  return (
    <>
      <div>
        <div className={clsx('all24', 'gap24')}>
          <div className={clsx('performanceTitle', 'flexCenter', 'gap4')}>
            {LANG('币种偏好')}
            <TooltipMessage title={<p>{LANG('该交易员最经常交易的品种')}</p>}>
              <div className={clsx('pointer')}>
                <Svg src={`/static/icons/primary/common/question.svg`} width={20} height={20} />
              </div>
            </TooltipMessage>
          </div>
          <div className={clsx('flexSpace')}>
            {!preferenceData?.length && <EmptyComponent />}
            {preferenceData?.length > 0 && (
              <>
                <PreferenceSymbol />
                <PreferencePieChart copyPreferenceData={preferenceData} maxInx={currentIdx} />
              </>
            )}
          </div>
        </div>
      </div>
      <style jsx>{styles}</style>
    </>
  );
}
const styles = css`
  .all24 {
    padding: 24px;
    border-radius: 24px;
    border: 1px solid var(--fill_line_2);
  }
  .gap24 {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  .gap4 {
    gap: 4px;
  }

  .performanceTitle {
    color: var(--text_1);
    font-family: 'HarmonyOS Sans SC';
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }
  .ml4 {
    margin-left: 4px;
  }
  .flexCenter {
    display: flex;
    align-items: center;
  }
  .flexSpan {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .preferenceBox {
    color: var(--text_1);
    font-family: 'HarmonyOS Sans SC';
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    grid-column-gap: 24px;
    flex: 1;
    .symbol-item {
      width: 224px;
      padding: 2px 8px;
      &:hover {
        background: var(--gree_10);
        border-radius: 4px;
        cursor: pointer;
      }
      @media ${MediaInfo.mobile} {
        width: auto;
      }
    }
    @media ${MediaInfo.mobile} {
      grid-template-columns: repeat(1, 1fr);
    }

    .symbol {
      margin-left: 16px;
      margin-right: 24px;
      width: 64px;
    }
  }
  .symbolIcon {
    width: 24px;
    height: 8px;
    border-radius: 8px;
  }
  .flexSpace {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .pointer {
    cursor: pointer;
  }
`;
