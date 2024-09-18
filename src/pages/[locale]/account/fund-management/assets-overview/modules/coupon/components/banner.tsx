import CommonIcon from '@/components/common-icon';
import { LANG, TrLink } from '@/core/i18n';
import Image from 'next/image';
import css from 'styled-jsx/css';

type ItemProps = {
  type: string;
  number: number;
  setTab: () => void;
};

const Item = ({ type = '', number = 0, setTab = () => {} }: ItemProps) => {
  return (
    <div className='item' onClick={setTab}>
      <div className='main-content'>
        <div className='left'>
          <span className='type'>{type}</span>
          <CommonIcon name='common-next-icon-0' size={12} className='icon' />
        </div>
        <div className='rewards'>
          <span className='number'>{number}</span>
          <span className='name'>{LANG('Rewards')}</span>
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
};

type BannerProps = {
  setTab: (tab: number) => void;
  normalLen: number;
  usedLen: number;
  invalidLen: number;
};

const Banner = ({ setTab, normalLen, usedLen, invalidLen }: BannerProps) => {
  return (
    <div className='coupon-banner'>
      <div className='box'>
        <div className='content'>
          <div className='info'>
            <div className='inner-container'>
              <Item type={LANG('可使用卡券')} number={normalLen} setTab={() => setTab(0)} />
              <Item type={LANG('已使用卡券')} number={usedLen} setTab={() => setTab(1)} />
              <Item type={LANG('已过期卡券')} number={invalidLen} setTab={() => setTab(2)} />
            </div>
          </div>
          <TrLink href='/novice-task' target='_blank'>
            <Image src='/static/images/account/dashboard/new-user-rewards.png' width={382} height={110} alt='coupon' />
          </TrLink>
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
};

export default Banner;
const styles = css`
  .coupon-banner {
    display: flex;
    align-items: center;
    justify-content: center;
    .box {
      width: 100%;
      height: 110px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      .content {
        width: 100%;
        display: flex;
        align-items: center;
        .info {
          padding: 20px;
          background-color: var(--theme-background-color-2);
          display: flex;
          height: 110px;
          border-radius: 15px;
          margin-right: 20px;
          width: 100%;
          .inner-container {
            width: 100%;
            max-width: 964px;
            display: flex;
            align-items: center;
          }
        }
        .item {
          flex: 1;
          display: flex;
          align-items: flex-start;
          justify-content: flex-start;
          flex-direction: column;
          cursor: pointer;
          &:nth-child(2) {
            align-items: center;
          }
          &:last-child {
            align-items: flex-end;
          }
          :global(.icon) {
            margin-left: 8px;
          }
          .left {
            display: flex;
            align-items: center;
          }
          .type {
            font-size: 16px;
            font-weight: 500;
            color: var(--theme-font-color-1);
          }
          .rewards {
            margin-top: 10px;
            .number {
              font-size: 32px;
              font-weight: 700;
              color: var(--skin-color-active);
            }
            .name {
              font-size: 12px;
              color: var(--theme-font-color-3);
              margin-left: 6px;
            }
          }
        }
      }
    }
  }
`;
