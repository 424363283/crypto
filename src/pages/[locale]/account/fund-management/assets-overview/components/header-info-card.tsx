import { RateText } from '@/components/rate-text';
import ProTooltip from '@/components/tooltip';
import { MediaInfo, clsx } from '@/core/utils';
import css from 'styled-jsx/css';
import { store } from './store';
import { TooltipPlacement } from 'antd/es/tooltip';
import Tooltip from '@/components/trade-ui/common/tooltip';

const InfoCard = ({
  title,
  titleTips,
  amount = '0.00',
  amountClass,
  direction,
}: {
  title: string;
  titleTips?: JSX.Element | React.ReactNode;
  amount: any;
  sub?: boolean;
  amountClass?: string;
  direction?: TooltipPlacement;
}) => {
  const { hideBalance } = store;
  return (
    <div className='info-card'>
      <div className='content'>
        <div className='title'>
          <Tooltip placement={direction ?? 'left'} title={titleTips}>
            <span className={clsx(titleTips && 'text-tips')}>{title}</span>
          </Tooltip>
        </div>
        <div className='money-row'>
          <div className={clsx('label', amountClass)}>{hideBalance ? '****' : amount.toFormat(2)}</div>
          {!hideBalance && (
            <div className='value'>
              ≈ <RateText money={amount} prefix showCurrencySymbol={false} useFormat />
            </div>
          )}
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
};

export default InfoCard;
const styles = css`
  .info-card {
    display: flex;
    flex-direction: column;
    border-right: 1px solid var(--fill_line_1);
    flex-grow: 1;
    text-align: center;
    align-items: center;
    .content {
      text-align: left;
    }
    &:first-child {
      text-align: left;
      align-items: flex-start;
      @media ${MediaInfo.mobile} {
        padding-left: 0px;
      }
    }
    &:last-child {
      text-align: right;
      padding-right: 0;
      border-right: none;
      align-items: flex-end;
      @media ${MediaInfo.mobile} {
        text-align: left;
        align-items: flex-start;
      }
    }
    @media ${MediaInfo.mobile} {
      align-items: flex-start;
      padding: 0;
      &:nth-child(2) {
        align-items: flex-end;
        border-right: none;
      }
      &:nth-child(4) {
        align-items: flex-end;
      }
    }
    .title {
      font-size: 14px;
      font-weight: 400;
      color: var(--text_2);
      margin-bottom: 16px;
      @media ${MediaInfo.mobile} {
        font-size: 12px;
        margin-bottom: 8px;
      }
      .text-tips {
        cursor: pointer;
        border-bottom: 1px dashed var(--text_2);
      }
    }
    .money-row {
      word-break: break-all;
      display: flex;
      align-items: center;
      color: var(--text_1);
      gap: 8px;
      @media ${MediaInfo.desktop} {
        flex-direction: column;
        align-items: flex-start;
      }
      .label {
        font-size: 18px;
        font-weight: 500;
        margin-right: 5px;
        @media ${MediaInfo.mobile} {
          font-size: 14px;
        }
      }
      .value {
        font-size: 14px;
        font-weight: 500;
        color: var(--text_3);
        @media ${MediaInfo.mobile} {
          font-size: 12px;
        }
      }
    }
  }
`;
