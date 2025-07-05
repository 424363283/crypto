import React from 'react';
import clsx from 'clsx';
import css from 'styled-jsx/css';
import LeverType from './leverType';
import { LANG } from '@/core/i18n';
import { FOLLOWERS_DATA, OVERVIEW_DATA } from '@/core/shared/src/copy/types';
import { Copy } from '@/core/shared';

export default function Overview(props: { followersData: FOLLOWERS_DATA[]; overviewData: OVERVIEW_DATA }) {
  const copyFollowersData = props.followersData;
  const LeverContainer = () => {
    return (
      <>
        <div className={clsx('followerContainer', 'gap24')}>
          {copyFollowersData.map((item, idx) => {
            return (
              <div className={clsx('flexSpace')} key={item.id}>
                <div className={clsx('flexCenter')}>
                  <LeverType leverType={idx + 1} />
                  <div className={clsx('leverInfo', 'flexCenter')}>
                    <img src={`/static/images/copy/copy-logo-default.svg`} alt="avatar" className={clsx('avatar')} />
                    <span> {item.nickName} </span>
                  </div>
                </div>
                <div className={`${item.totalPnl > 0 ? clsx('textTrue') : clsx('textError')}`}>
                  {item?.totalPnl?.toFixed(Copy.copyFixed)}
                </div>
              </div>
            );
          })}
        </div>
        <style jsx>{styles}</style>
      </>
    );
  };
  return (
    <>
      <div className={clsx('all24', 'gap24')}>
        <div className={clsx('performanceTitle')}>{LANG('跟随者')}</div>
        <div className={clsx('flexSpace', 'incomeBox')}>
          <span >{LANG('当前跟随者')}</span>
          <div className={clsx('textPrimary')}>
            <span>{props.overviewData.currentFollowers}</span>
            <span>/{props.overviewData.maxCopyTraderCount}</span>
          </div>
        </div>
        <LeverContainer />
      </div>
      <style jsx>{styles}</style>
    </>
  );
}

const styles = css`
  .all24 {
    padding: 24px;
    border-radius: 24px;
    border: 1px solid var(--fill_line_3);
  }
  .gap24 {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  .gap4 {
    gap: 4px;
  }
  .incomeBox {
    border-bottom: 1px solid var(--fill_line_2);
    padding-bottom: 24px;
    color: var(--text_1);
  }
  .textTrue {
    color: var(--text_green);
  }
  .textError {
    color: var(--text_red);
  }

  .performanceTitle {
    color: var(--text_1);
     font-family: "Lexend";
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }

  .flexCenter {
    display: flex;
    align-items: center;
  }

  .flexSpace {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .leverInfo {
    margin-left: 24px;
      color: var(--text_1);
    .avatar {
      margin-right: 16px;
      width: 32px;
      height: 32px;
    }
  }
  .textDashed {
    border-bottom: 1px dashed var(--fill_line_2);
  }
`;
