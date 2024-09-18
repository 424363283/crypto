import { LANG, TrLink } from '@/core/i18n';
// import { TaskList } from '@/core/shared';
import { MediaInfo } from '@/core/utils';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';

export const RightColumnRewards = () => {
  const [getBonus, setGetBonus] = useState<any>(0);
  const [totalBonus, setTotalBonus] = useState(0);
  const getList = async () => {
    const list = [] as any;// TODO (await TaskList.getTaskList()) || [];
    const get = list?.filter((v: { status: number }) => v.status === 1).length;
    const num = list?.length || 0;
    setGetBonus(get);
    setTotalBonus(num);
  };
  useEffect(() => {
    getList();
  }, []);

  return (
    <div className='rewards-wrapper'>
      <div className='top-container'>
        <div className='left-wrapper'>
          <p className='title'>{LANG('Welcome Rewards Claim up to')}</p>
          <p className='bonus'>$2888 USDT</p>
        </div>
        <div className='right-wrapper'>
          <Image src='/static/images/account/dashboard/coupon-mascot.svg' width={126} height={109} alt='mascot' />
        </div>
      </div>
      <div className='bottom-claimed-progress'>
        <div className='left-area'>
          <p className='claimed-area'>
            {LANG('Claimed')}: <span className='get'>{getBonus}</span>/ <span className='total'>{totalBonus}</span>{' '}
          </p>
          <div className='bar'>
            <div className='bar-inner' style={{ width: `${(getBonus / totalBonus) * 100}%` }} />
          </div>
        </div>
        <div className='right-area'>
          <TrLink href='/novice-task' native target='_blank'>
            {LANG('Check')}
          </TrLink>
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .rewards-wrapper {
    @media ${MediaInfo.tablet} {
      flex: 1;
      height: 212px;
    }
    background-color: var(--theme-background-color-2);
    border-radius: 15px;
    width: 285px;
    padding: 12px 20px;
    @media ${MediaInfo.mobileOrTablet} {
      width: 100%;
    }
    .top-container {
      display: flex;
      .left-wrapper {
        margin-top: 10px;
        .title {
          color: var(--theme-font-color-1);
          font-weight: 500;
          font-size: 12px;
          margin-bottom: 10px;
        }
        .bonus {
          color: var(--skin-main-font-color);
          font-size: 20px;
          font-weight: 700;
        }
      }
      .right-wrapper {
        margin-left: 8px;
      }
    }
    .bottom-claimed-progress {
      height: 70px;
      background-color: var(--theme-background-color-8);
      border-radius: 8px;
      padding: 18px 15px 18px 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .left-area {
        flex: 1;
        .claimed-area {
          color: var(--theme-font-color-1);
          font-size: 14px;
          font-weight: 500;
          .get {
            color: var(--skin-main-font-color);
          }
        }
        .bar {
          width: 100%;
          height: 8px;
          border-radius: 8px;
          background: var(--theme-background-color-disabled-light);
          overflow: hidden;
          margin-top: 20px;
          .bar-inner {
            height: 100%;
            background: var(--skin-primary-color);
          }
        }
      }
      .right-area {
        padding: 9px 16px;
        background-color: var(--skin-primary-color);
        border-radius: 6px;
        margin-left: 16px;
        :global(a) {
          color: var(--skin-font-color);
          font-weight: 500;
          font-size: 12px;
        }
      }
    }
  }
`;
