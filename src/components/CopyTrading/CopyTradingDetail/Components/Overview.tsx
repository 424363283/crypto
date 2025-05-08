import React, { useContext, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import css from 'styled-jsx/css';
import { LANG } from '@/core/i18n';
import { MediaInfo } from '@/core/utils';
import { OVERVIEW_DATA } from '@/core/shared/src/copy/types';
import Tooltip from '@/components/trade-ui/common/tooltip';
import { Copy } from '@/core/shared';
export default function Overview(props: { overviewData: OVERVIEW_DATA }) {
  const copyOverviewData = props.overviewData;
  return (
    <>
      <div className={clsx('all24', 'gap24', 'h346')}>
        <div className={clsx('performanceTitle')}>{LANG('带单员总览')}</div>
        <div className={clsx('flexSpace')}>
          <Tooltip title={<p>{LANG('有带单交易及持仓的天数')}</p>}>
            <span className={clsx('textDashed')}>{LANG('带单天数')}</span>
          </Tooltip>
          <span className={clsx('textPrimary')}>{copyOverviewData.workDays}</span>
        </div>
        <div className={clsx('flexSpace')}>
          <Tooltip title={<p>{LANG('交易员在跟单账户的总权益')}</p>}>
            <span className={clsx('textDashed')}>{LANG('资产规模')}</span>
          </Tooltip>
          <div className={clsx('textPrimary')}>
            <span>{copyOverviewData?.userAmount?.toFormat(Copy.copyFixed)}</span>
          </div>
        </div>
        <div className={clsx('flexSpace')}>
          <Tooltip title={<p>{LANG('交易员名下当前所有跟随者跟单账户的总资产')}</p>}>
            <span className={clsx('textDashed')}>{LANG('带单规模')}</span>
          </Tooltip>
          <span className={clsx('textPrimary')}>{copyOverviewData?.settledTotalAmount?.toFormat(Copy.copyFixed)}</span>
        </div>
        <div className={clsx('flexSpace')}>
          <Tooltip title={<p>{LANG('当前所有跟随者跟随此交易员获得的收益总和')}</p>}>
            <span className={clsx('textDashed')}>{LANG('当前跟随者收益')}</span>
          </Tooltip>

          <span className={clsx('textPrimary')}>{copyOverviewData.settledTotalProfit?.toFormat(Copy.copyFixed)}</span>
        </div>
        <div className={clsx('flexSpace')}>
          <Tooltip title={<p>{LANG('累计跟单过此交易员的人数，同一人多次跟单不会重复计入。')}</p>}>
            <span className={clsx('textDashed')}>{LANG('累计跟单人数')}</span>
          </Tooltip>

          <span className={clsx('textPrimary')}>{copyOverviewData.totalFollowers}</span>
        </div>
        <div className={clsx('flexSpace')}>
          <Tooltip title={<p>{LANG('跟随此交易员盈利时需要贡献的利润比例。')}</p>}>
            <span className={clsx('textDashed')}>{LANG('分润比例')}</span>
          </Tooltip>
          <span className={clsx('textPrimary')}>{copyOverviewData?.shareRoyaltyRatio?.mul(100)}%</span>
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
  .h346 {
    height: 346px;
    @media ${MediaInfo.mobile} {
      height: 'auto';
    }
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

  .flexSpace {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .textPrimary {
    color: var(--text_1);
    font-weight: 500;
  }
  .textDashed {
    border-bottom: 1px dashed var(--fill_line_2);
    cursor: pointer;
  }
`;
