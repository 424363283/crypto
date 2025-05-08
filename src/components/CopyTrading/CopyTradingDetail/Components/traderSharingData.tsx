import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { MediaInfo } from '@/core/utils';
import css from 'styled-jsx/css';
import { LANG } from '@/core/i18n';
import { Copy } from '@/core/shared';
import { CalibrateValue } from '@/core/shared/src/copy/utils';
export default function traderSharingData() {
  return (
    <>
      <div>
        <div className={clsx('flexSpan')}>
          <div className={clsx('share-lable')}>{LANG('预计待分润')}(USDT)</div>
          <div className={clsx('share-value')}>93.98</div>
        </div>
        <div className={clsx('flexSpan')}>
          <div className={clsx('share-lable')}>{LANG('昨日分润')}(USDT)</div>
          <div className={clsx('share-value')}>93.98</div>
        </div>
        <div className={clsx('flexSpan')}>
          <div className={clsx('share-lable')}>{LANG('累计已分润')}(USDT)</div>
          <div className={clsx('share-value')}>93.98</div>
        </div>
      </div>
      <style jsx>{styles}</style>
    </>
  );
}
const styles = css`
  .flexSpan {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding:22px 0;
  }
  .share-lable {
    font-family: HarmonyOS Sans SC;
    font-weight: 500;
    font-size: 16px;
    color: var(--text_1);
  }
  .share-value {
    font-family: HarmonyOS Sans SC;
    font-weight: 700;
    font-size: 20px;
    color: var(--text_1);
  }
`;
