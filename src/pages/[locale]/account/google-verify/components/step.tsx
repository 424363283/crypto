import { LANG } from '@/core/i18n';
import { MediaInfo, clsx } from '@/core/utils';
import css from 'styled-jsx/css';

export const Step = ({ step }: { step: number }) => {
  return (
    <div className='step-box'>
      <ul className='step-content'>
        <li className='step'>
          <div className={clsx('step-round', 'active')}>
            1<span className='step-text'>{LANG('下载APP')}</span>
          </div>
          <span className={clsx('step-line', step > 0 && 'active')}></span>
          <div className={clsx('step-round', step > 0 && 'active')}>
            2<span className='step-text'>{LANG('添加密钥')}</span>
          </div>
        </li>
        <li className='step'>
          <span className={clsx('step-line', step > 1 && 'active')}></span>
          <div className={clsx('step-round', step > 1 && 'active')}>
            3<span className='step-text'>{LANG('备份密钥')}</span>
          </div>
        </li>
        <li className='step'>
          <span className={clsx('step-line', step > 2 && 'active')}></span>
          <div className={clsx('step-round', step > 2 && 'active')}>
            4<span className='step-text'>{LANG('安全验证')}</span>
          </div>
        </li>
        <li className='step'>
          <span className={clsx('step-line', step > 3 && 'active')}></span>
          <div className={clsx('step-round', step > 3 && 'active')}>
            5<span className='step-text'>{LANG('启用谷歌验证')}</span>
          </div>
        </li>
      </ul>
      <style jsx>{styles}</style>
    </div>
  );
};

const styles = css`
  .step-box {
    text-align: left;
    padding: 0 10px 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: nowrap;
    @media ${MediaInfo.desktop} {
      width: 1100px;
    }
    .step-content {
      display: inline-block;
      vertical-align: middle;
      padding-left: 10px;
      .step {
        display: inline-block;
        .step-round {
          display: inline-block;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          text-align: center;
          vertical-align: middle;
          line-height: 32px;
          color: var(--theme-font-color-3);
          position: relative;
          border: 1px solid #e5e5e4;
          font-size: 16px;
          font-weight: 500;
          &.active {
            background-color: var(--skin-primary-color);
            color: var(--skin-font-color);
            border: none;
          }
          .step-text {
            position: absolute;
            bottom: -40px;
            left: 18px;
            display: inline-block;
            white-space: nowrap;
            font-size: 14px;
            font-weight: 400;
            color: var(--theme-font-color-6);
            transform: translateX(-50%);
          }
        }
        .step-line {
          display: inline-block;
          width: 84px;
          height: 2px;
          background: #f5f5f3;
          margin: 0 50px;
          margin-bottom: -10px;
          &.active {
            background: var(--skin-primary-color);
          }
        }
      }
    }
  }
`;
