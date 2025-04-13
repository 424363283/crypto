import { LANG } from '@/core/i18n/src/page-lang';
import { clsx } from '@/core/utils/src/clsx';
import css from 'styled-jsx/css';
import CopyTradingRight from './copyTradingRight';
import CopyTradingItem from './copyTradingItem';
import CopyTradingMiddle from './copyTradingMiddle';

export default function CopyTrading() {
  return (
    <div className={clsx('copy-trading')}>
      <div className={clsx('copy-trading-wrap')}>
        <div className={clsx('copy-trading-title')}>
          <h2>{LANG('跟单')}</h2>
          <p>{LANG('一键跟单, 长久收益')}</p>
        </div>
        <div className={clsx('trader-list')}>
          <div className={clsx('trader-list-left')}>
            <CopyTradingItem
              name="风起云涌"
              roe={0.1208}
              desc="忙着赚钱, 什么也没说"
              imgUrl=""
            />
            <CopyTradingItem
              name="风起云涌"
              roe={0.1208}
              desc="忙着赚钱, 什么也没说"
              imgUrl=""
            />
          </div>

          <div className={clsx('trader-list-middle')}>
            <CopyTradingMiddle
              name="风起云涌"
              roe={0.1208}
              desc="忙着赚钱, 什么也没说"
              imgUrl=""
              isShowLine={true}
            />
          </div>


          <div className={clsx('trader-list-right')}>
            <CopyTradingRight
              name="风起云涌"
              roe={0.1208}
              desc="忙着赚钱, 什么也没说"
              imgUrl=""
            />
            <CopyTradingMiddle
              name="风起云涌"
              roe={0.1208}
              desc="忙着赚钱, 什么也没说"
              imgUrl=""
              isShowLine={false}
            />
          </div>


        </div>
      </div>
      <style jsx>{styles}</style>
    </div>

  )
}

const styles = css`
  .copy-trading{
    background: var(--fill-2);
    padding:80px 0;
    &-wrap{
      width:1200px;
      margin:0 auto;
    }
    &-title{
      display: flex;
      width: 1200px;
      height: 73px;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      h1{
        color: var(--text-tertiary);
        font-size: 32px;
        font-weight: 700;
      }
      p{
        color: var(--text-tertiary);
        font-size: 16px;
        font-weight: 400;
      }
    
    }
  }
  .trader-list{
    display: flex;
    align-items: center;
    gap: 16px;
    align-self: stretch;
    &-left{
      display: flex;
      width: 284px;
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }
    &-middle{
      display: flex;
      width: 436px;
      height: 376px;
    }
    &-right{
      display: flex;
      width:448px;
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }
  }
`;
