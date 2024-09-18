import { LANG } from '@/core/i18n';
import { MediaInfo, clsx } from '@/core/utils';
import css from 'styled-jsx/css';

export const HorizontalStepBar = ({ step }: { step: number }) => {
  return (
    <div className='step-box'>
      <ul className='step-content'>
        <li className='step'>
          <div className={clsx('step-round', 'active', 'step-round-1', step === 1 && 'current')}>
            {step === 1 ? <span className='num'>1</span> : null}
            <span className={clsx('step-text', 'active')}>{LANG('请选择国家')}</span>
          </div>
          <span className={clsx('step-line')}></span>
        </li>
        <li className='step'>
          <div className={clsx('step-round', step > 1 && 'active', 'step-round-2', step === 2 && 'current')}>
            {step === 2 ? <span className='num'>2</span> : null}
            <span className={clsx('step-text', step > 1 && 'active')}>{LANG('Identity of Information')}</span>
          </div>
          <span className={clsx('step-line')}></span>
        </li>
        <li className='step'>
          <div className={clsx('step-round', step > 2 && 'active', 'step-round-3', step === 3 && 'current')}>
            {step === 3 ? <span className='num'>3</span> : null}
            <span className={clsx('step-text', step > 2 && 'active')}>{LANG('Upload a selfie photo')}</span>
          </div>
        </li>
      </ul>
      <style jsx>{styles}</style>
    </div>
  );
};

const styles = css`
  .step-box {
    background-color: var(--theme-sub-button-bg-2);
    height: 64px;
    .step-content {
      display: inline-block;
      vertical-align: middle;
      padding-left: 15px;
      padding-right: 15px;
      padding-top: 10px;
      display: flex;
      width: 100%;
      .step {
        display: flex;
        &:not(:last-child) {
          flex: 1;
        }
        .step-round {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          text-align: center;
          vertical-align: middle;
          line-height: 14px;
          color: var(--skin-font-color);
          position: relative;
          background-color: #c5c5c4;
          box-shadow: 0 0 0 4px #fff, 0 0 0 8px transparent;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: flex-end;
          &.active {
            background-color: var(--skin-primary-color);
            color: var(--skin-font-color);
            border: none;
          }
          &.current {
            width: 20px;
            height: 20px;
            justify-content: center;
          }
          .num {
            font-size: 10px;
            font-weight: 500;
          }
          .step-text {
            font-size: 10px;
            font-weight: 500;
            color: var(--theme-font-color-3);
            position: absolute;
            top: 32px;
            word-break: break-all;
            width: 120px;
            text-align: left;
            @media ${MediaInfo.mobile} {
              width: 70px;
            }
          }
          .step-text.active {
            color: var(--theme-font-color-1);
          }
        }
        .step-round-1 {
          align-items: self-start;
          .num {
            padding-left: 6px;
          }
        }
        .step-round-2 {
          align-items: center;
          .step-text {
            text-align: center;
          }
        }
        .step-round-3 {
          align-items: end;
          .num {
            padding-right: 6px;
          }
          .step-text {
            text-align: right;
          }
        }

        .step-line {
          display: inline-block;
          width: 100%;
          height: 2px;
          background: #f0f0ee;
          margin-top: 10px;
        }
      }
    }
  }
`;
