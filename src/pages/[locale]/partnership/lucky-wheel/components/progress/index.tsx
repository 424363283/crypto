import CommonIcon from '@/components/common-icon';
import { LANG, renderLangContent } from '@/core/i18n';
import { MediaInfo } from '@/core/utils';
import { Progress } from 'antd';
import React from 'react';

import css from 'styled-jsx/css';

const ProgressBox: React.FC<{
  amount: number | null;
  mini?: boolean;
  prizeValue?: number;
  isShowCount?: boolean;
}> = ({ amount, mini, prizeValue, isShowCount }) => {
  if (mini) {
    return (
      <div className='progress'>
        {isShowCount && (
          <span style={{ left: `${amount || 0}%` }} className='count-progress'>
            {amount || 0}
          </span>
        )}
        <Progress
          strokeColor='var(--skin-primary-color)'
          trailColor='var(--spec-border-level-2)'
          showInfo={false}
          percent={amount || 0}
          size={['100%', 5]}
        />
        <div className='progress-scale' style={{ top: 9 }}>
          <div>
            <CommonIcon name='common-progresshook-0' size={19} enableSkin />
          </div>
          <div>
            <CommonIcon name='common-progresshook-0' size={19} enableSkin />
          </div>
          <div>
            <CommonIcon name='common-progresshook-0' size={19} enableSkin />
          </div>
          <div>
            <CommonIcon name='common-progresshook-0' size={19} enableSkin />
          </div>
          <div>
            <CommonIcon name='common-pr-coin-0' className='last-coin' size={19} enableSkin />
          </div>
        </div>
        <style jsx>{styles}</style>
      </div>
    );
  }

  return (
    <div className='box'>
      <p className='tip1'>
        {renderLangContent(LANG('邀请好友，赢取 {usdt}，可交易可提现'), {
          usdt: <span className='text-main'>{prizeValue} USDT</span>,
        })}
      </p>
      <div className='tip2'>
        <p> {LANG('领奖进度')}</p>
        <p>
          {renderLangContent(LANG('距离 {text} 到账仅差{count}个幸运币'), {
            text: <span className='text-main'>{prizeValue} USDT</span>,
            count: Number(100).sub(Number(amount || 0)),
          })}
        </p>
      </div>

      <div className='progress'>
        <Progress
          strokeColor='var(--skin-primary-color)'
          trailColor='var(--spec-border-level-2)'
          showInfo={false}
          percent={amount || 0}
          size={['100%', 5]}
        />
        <div className='progress-scale'>
          <div>
            <CommonIcon name='common-progresshook-0' size={19} enableSkin />
            <span>0</span>
          </div>
          <div>
            <CommonIcon name='common-progresshook-0' size={19} enableSkin />
            <span>25</span>
          </div>
          <div>
            <CommonIcon name='common-progresshook-0' size={19} enableSkin />
            <span>50</span>
          </div>
          <div>
            <CommonIcon name='common-progresshook-0' size={19} enableSkin />
            <span>75</span>
          </div>
          <div className='last-coin'>
            <CommonIcon name='common-pr-coin-0' size={19} enableSkin />
            <span>100</span>
          </div>
        </div>
      </div>

      <style jsx>{styles}</style>
    </div>
  );
};

const styles = css`
  .box {
    background-color: var(--spec-background-color-2);
    width: 100%;
    padding: 19px;
    border-radius: 15px;
    box-shadow: 2px 2px 4px 4px rgba(0, 0, 0, 0.11);
    min-height: 147px;
    margin-bottom: 20px;
    @media ${MediaInfo.mobileOrTablet} {
      margin: 0px 16px;
      margin-bottom: 20px;
      width: calc(100vw - 32px);
    }

    .tip1 {
      font-size: 20px;
      margin-bottom: 10px;
      white-space: nowrap;
      overflow: hidden;
      @media ${MediaInfo.mobile} {
        font-size: 14px;
      }
    }
    .tip2 {
      font-size: 14px;
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;

      @media ${MediaInfo.mobile} {
        font-size: 12px;
        & p:nth-child(1) {
          width: 40%;
        }
        & p:nth-child(2) {
          max-width: 60%;
        }
      }
    }
  }
  .progress {
    position: relative;
    .count-progress {
      position: absolute;
      bottom: 25px;
      font-size: 12px;
    }
    :global(.ant-progress-inner) {
      border: 4px solid rgba(255, 255, 255, 0.18);
    }

    .last-coin {
      margin-right: -5px;
    }
    .progress-scale {
      left: 0;
      top: 2px;
      width: 100%;
      display: flex;
      justify-content: space-between;
      position: absolute;
      > div {
        display: flex;
        flex-direction: column;
        align-items: center;
        > span {
          margin-top: 10px;
        }
      }
    }
  }
`;

export default ProgressBox;
