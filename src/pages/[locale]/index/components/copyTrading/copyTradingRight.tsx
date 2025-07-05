import YIcon from '@/components/YIcons';
import { LANG } from '@/core/i18n/src/page-lang';
import { clsx } from '@/core/utils/src/clsx';
import css from 'styled-jsx/css';

export default function CopyTradingRight({ imgUrl, roe, name, desc }: { imgUrl: string; roe: number; name: string; desc: string; }) {
  // const { imgUrl, roe, name, desc } = props;
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
      padding: 24px;
      flex-direction: row;
      align-items: flex-start;
      gap: 40px;
      align-self: stretch;
      border-radius: 24px;
      background: var(--fill_1);
      justify-content:space-between;
    }
    &-info{
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
        color: var(--text_1);
        font-size: 16px;
        font-weight: 500;
      }
      .trade-desc{
        color: var(--text_3);
        font-size: 12px;
        font-weight: 400;
      }
    }
  }
  .trader-roe{
      display: flex;
      justify-content: space-between;
      align-items: center;
      align-self: stretch;
      gap:40px;
      &-left{
        font-size:20px;
        h5{
          color: var(--text_3);
          font-size: 14px;
          font-weight: 400;
        }
        p{
          color: var(--text_green);
          font-size: 24px;
          font-weight: 700;
        }
      }
    }
  
`;
