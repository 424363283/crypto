import { LANG } from '@/core/i18n';
import { MediaInfo, clsx } from '@/core/utils';
import css from 'styled-jsx/css';

export const HorizontalStepBar = ({ step }: { step: number }) => {
  return (
    <div className="step-box">
      <ul className="step-content">
        <li className="step">
          <div className={clsx('step-round', 'active', 'step-round-1', step === 1 && 'current')}>
            <span className="num">1</span>
            <span className={clsx('step-text', 'active')}>{LANG('请选择国家/地区')}</span>
          </div>
        </li>
        <li className="step">
          <div className={clsx('step-round', step > 1 && 'active', 'step-round-2', step === 2 && 'current')}>
            <span className="num">2</span>
            <span className={clsx('step-text', step > 1 && 'active')}>{LANG('身份信息')}</span>
          </div>
        </li>
        <li className="step">
          <div className={clsx('step-round', step > 2 && 'active', 'step-round-3', step === 3 && 'current')}>
            <span className="num">3</span>
            <span className={clsx('step-text', step > 2 && 'active')}>{LANG('Upload a selfie photo')}</span>
          </div>
        </li>
      </ul>
      <div className={clsx('step-line')}></div>
      <style jsx>{styles}</style>
    </div>
  );
};

const styles = css`
  .step-box {
    position: relative;
    margin: 24px 0 0;
    .step-content {
      display: flex;
      width: 100%;
      justify-content: space-between;
      align-items: flex-start;
      width: 100%;
      padding: 0;
      .step {
        flex: 1;
        position: relative;
        z-index: 10;
        &:nth-child(2) {
          text-align: center;
          .step-round {
            align-items: center;
            .step-text {
              text-align: center;
            }
          }
        }
        &:last-child {
          text-align: right;
          .step-round {
            align-items: flex-end;
            .step-text {
              text-align: right;
            }
          }
        }
        .step-round {
          position: relative;
          display: flex;
          flex-direction: column;
          &.active {
            border: none;
            .num {
              background-color: var(--brand);
              color: var(--text_white);
            }
            .step-text {
              color: var(--text_1);
            }
          }

          .num {
            background-color: var(--fill_1);
            width: 24px;
            height: 24px;
            border-radius: 50%;

            display: flex;
            align-items: center;
            justify-content: center;

             font-family: "Lexend";
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 14px; /* 100% */

            color: var(--text_3);
          }
          .step-text {
            padding: 12px 0 0;
            color: var(--text_3);
             font-family: "Lexend";
            font-size: 12px;
            font-style: normal;
            font-weight: 400;
            line-height: 12px; /* 100% */

            @media ${MediaInfo.mobile} {
              line-height: 150%; /* 18px */
            }
          }
          .step-text.active {
            color: var(--theme-font-color-1);
          }
        }
      }
    }
    .step-line {
      position: absolute;
      z-index: 2;
      top: 50%;
      width: 100%;
      height: 1px;
      background: var(--fill_line_1);
      top: 12px;
    }
  }
`;
