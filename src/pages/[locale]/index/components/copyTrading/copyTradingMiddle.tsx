import { memo, useEffect, useState } from 'react';
import MiniChart from '@/components/chart/mini-chart';
import YIcon from '@/components/YIcons';
import { LANG } from '@/core/i18n/src/page-lang';
import { clsx } from '@/core/utils/src/clsx';
import css from 'styled-jsx/css';
import { NEW_DEFAULT_KLINE_BUTTONS } from '@/constants';

export default function CopyTradingMiddle({ imgUrl, roe, name, desc, isShowLine }: { imgUrl: string; roe: number; name: string; desc: string, isShowLine: boolean }) {
  const chartData = [
    98118,
    98092.5,
    98042.3,
    98073.2,
    98144,
    98084.4,
    98076,
    98081.5,
    98117.6,
    98047.6,
    98078.5,
    98115.5,
    98080.9,
    98072.3,
    98038.9,
    98035.6,
    98091.5,
    98047.5,
    98088.7,
    98126.1,
    98100.4,
    98126.3,
    98053.2,
    98010.3,
    97989.4,
    97984.8,
    98007.3,
    97947.7,
    97963.5,
    97927.2
  ]
  return (
    <div className={clsx('copy-trading-item')}>
      <div className={clsx('copy-trading-info')}>
        <div className={clsx('trader-avator')}>
          {imgUrl && <img src={imgUrl} />}
        </div>
        <div className={clsx('copy-trading-right')}>
          <div className={clsx('trader-name')}>
            {name}
          </div>
          <div className={clsx('trader-desc')}>
            {desc}
          </div>
        </div>
      </div>
      <div className={clsx('trader-detail')}>
        <div className={clsx('item-info')}>
          <div className={clsx('label')}>{LANG('总收益')}</div>
          <div className={clsx('value')}>$9,305.29</div>
        </div>
        <div className={clsx('item-info')}>
          <div className={clsx('label')}>{LANG('胜率')}</div>
          <div className={clsx('value')}>56.20%</div>
        </div>
        <div className={clsx('item-info')}>
          <div className={clsx('label')}>{LANG('跟单人数')}</div>
          <div className={clsx('value')}><span>60</span>/100</div>
        </div>
      </div>
      <div className={clsx('roe-line')}>
        {isShowLine ? <MiniChart
          symbol='trader'
          data={chartData}
          showLine={false}
          style={{ width: 396, height: 80 }}
          lineWidth={1.5}
          areaColor={true ? 'var(--text-true)' : 'var(--text-error)'}
          lineColor={true ? 'var(--text-true)' : 'var(--text-error)'}
          areaColorOpacity={50}
        /> : null
        }
      </div>
      <div className={clsx('trader-roe')}>
        <div className={clsx('trader-roe-left')}>
          <h5>{LANG('收益率')}</h5>
          <p>{roe > 0 ? '+' : roe < 0 ? '-' : ''}{roe}</p>
        </div>
        <YIcon.Arrow />
      </div>
      <style jsx>{styles}</style>
    </div>

  )
}

const styles = css`
  .copy-trading{
    &-item{
      display: flex;
      width: 100%;
      padding: 24px;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      background: var(--fill-1);
      border-radius: 24px;
      gap:20px;
    }
    &-info{
      width:100%;
      display: flex;
      height: 40px;
      align-items: center;
      gap: 8px;
      .trader-avator{
        width: 40px;
        height: 40px;
        flex-shrink: 0;
        border-radius:50%;
        border:1px solid #ccc;
      }

      .trade-name{
        color: var(--text-primary);
        font-size: 16px;
        font-weight: 500;
      }
      .trade-desc{
        color: var(--text-tertiary);
        font-size: 12px;
        font-weight: 400;
      }
    }
  }
  .trader-detail{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    align-self: stretch;
    .item-info{
      display: flex;
      justify-content: space-between;
      align-items: center;
      align-self: stretch;
    }
    .label{
      color: var(--text-tertiary);
      font-size: 14px;
      font-weight: 400;
    }
    .value{
      color: var(--text-primary);
      font-size: 14px;
      font-weight: 400;
    }
  }
  .roe-line{
    padding:0 20px;
  }
  .trader-roe{
      display: flex;
      justify-content: space-between;
      align-items: center;
      align-self: stretch;
      height:100%;
      &-left{
        font-size:20px;
        h5{
          color: var(--text-tertiary);
          font-size: 14px;
          font-weight: 400;
        }
        p{
          color: var(--text-true);
          font-size: 24px;
          font-weight: 700;
        }
      }
    }
  
`;
