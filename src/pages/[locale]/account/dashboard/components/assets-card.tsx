import { Button } from '@/components/button';
import CommonIcon from '@/components/common-icon';
import { DesktopOrTablet, Mobile } from '@/components/responsive';
import { LANG, TrLink } from '@/core/i18n';
import { MediaInfo, clsx } from '@/core/utils';
import Image from 'next/image';
import { Suspense, lazy, useState } from 'react';
import css from 'styled-jsx/css';
import { AssetsBalance, WalletType } from './assets-balance';
import { AssetsTrendCard } from './assets-trend-card';
const AssetsDistributedModal = lazy(() => import('./assets-distributed-modal'));

const ButtonArea = () => {
  return (
    <div className='button-area'>
      <Button type='primary' className='btn'>
        <TrLink href='/account/fund-management/asset-account/recharge' query={{ code: 'USDT' }}>
          {LANG('充币')}
        </TrLink>
      </Button>
      <Button type='light-sub-2' className='btn sub-btn'>
        <TrLink href='/account/fund-management/asset-account/withdraw' query={{ code: 'USDT' }}>
          {LANG('提币')}
        </TrLink>
      </Button>
      <Button type='light-sub-2' className='btn sub-btn'>
        <TrLink href='/fiat-crypto'>{LANG('买币')}</TrLink>
      </Button>
      <style jsx>{buttonStyles}</style>
    </div>
  );
};
const buttonStyles = css`
  .button-area {
    display: flex;
    align-items: center;
    :global(.btn) {
      padding: 6px 28px;
      &:not(:first-child) {
        margin-left: 10px;
      }
      :global(a) {
        text-align: center;
        color: var(--theme-font-color-1);
        font-size: 12px;
      }
    }
    :global(.sub-btn) {
      background-color: var(--theme-background-color-14);
    }
    @media ${MediaInfo.mobile} {
      margin-top: 40px;
      margin-left: 0;
    }
    :global(.primary.btn) {
      :global(a) {
        color: var(--skin-font-color);
      }
    }
  }
`;
export const AssetsCard = () => {
  const [showAssetsModal, setShowAssetsModal] = useState(false);
  const [dateRange, setDateRange] = useState<number>(7);
  const SecondOptionBar = () => {
    return (
      <div className='option2-bar'>
        <div className='left-option-bar'>
          <div className={clsx('option-item', dateRange === 7 && 'active-date')} onClick={() => setDateRange(7)}>
            {LANG('7日')}
          </div>
          <div className={clsx('option-item', dateRange === 30 && 'active-date')} onClick={() => setDateRange(30)}>
            {LANG('30日')}
          </div>
        </div>
        <div className='right-option-bar'>
          <div className='assets-item option-item' onClick={() => setShowAssetsModal(true)}>
            <Image
              src='/static/images/account/dashboard/assets-distributed.svg'
              width={16}
              height={16}
              alt='icon'
              className='icon'
            />
            {LANG('资产分布')}
          </div>
          <TrLink className='option-item' href='/account/fund-management/assets-overview'>
            <CommonIcon name='common-overview-0' size={16} className='icon' />
            {LANG('钱包总览')}
          </TrLink>
        </div>
        <style jsx>{secondOptionBarStyles}</style>
      </div>
    );
  };

  return (
    <div className='assets-card-container'>
      <div className='header-area'>
        <div className='title'>{LANG('总资产估值')}</div>
        <DesktopOrTablet>
          <ButtonArea />
        </DesktopOrTablet>
      </div>
      <AssetsBalance type={WalletType.ASSET_TOTAL} />
      <Mobile>
        <ButtonArea />
      </Mobile>
      <SecondOptionBar />
      {showAssetsModal && (
        <Suspense fallback={<></>}>
          <AssetsDistributedModal open={showAssetsModal} onCancel={() => setShowAssetsModal(false)} />
        </Suspense>
      )}
      <AssetsTrendCard dateRange={dateRange} />
      <style jsx>{styles}</style>
    </div>
  );
};
const secondOptionBarStyles = css`
  :global(.assets-card-container) {
    .option2-bar {
      margin-top: 15px;
      display: flex;
      justify-content: space-between;
      .left-option-bar,
      .right-option-bar {
        display: flex;
        align-items: center;
      }
      .left-option-bar {
        .option-item {
          color: var(--theme-font-color-3);
          cursor: pointer;
          font-size: 14px;
          &:nth-child(1) {
            margin-right: 15px;
          }
        }
        .active-date {
          color: var(--theme-font-color-1);
        }
      }
      .right-option-bar {
        font-size: 12px;
        color: var(--theme-font-color-3);
        .assets-item {
          margin-right: 25px;
        }
        :global(.option-item) {
          display: flex;
          cursor: pointer;
          align-items: center;
          font-size: 12px;
          color: var(--theme-font-color-3);
          :global(.icon) {
            margin-right: 5px;
          }
          :global(.arrow-icon) {
            margin-left: 8px;
          }
        }
      }
    }
  }
`;
const styles = css`
  .assets-card-container {
    .header-area {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      .title {
        font-size: 16px;
        font-weight: 500;
        color: var(--theme-font-color-6);
      }
    }
  }
  :global(.ant-dropdown .ant-dropdown-menu) {
    background-color: var(--theme-background-color-2-3);
    :global(.ant-dropdown-menu-item) {
      font-size: 12px;
      color: var(--theme-font-color-6);
      &:hover {
        background-color: var(--skin-primary-bg-color-opacity-1);
        color: var(--skin-main-font-color);
      }
    }
  }
  :global(.assets-distributed-modal) {
    :global(.assets-distributed) {
      position: relative;
      display: flex;
      margin-top: 20px;
      margin-left: 10px;
      @media ${MediaInfo.mobile} {
        flex-direction: column;
        align-items: center;
      }
      :global(.assets-lis) {
        display: flex;
        flex-direction: column;
        margin-left: 110px;
        width: 100%;
        margin-top: 2px;
        @media ${MediaInfo.mobile} {
          margin-left: 0px;
          padding: 0;
          margin-top: 140px;
        }
        :global(.list-item) {
          display: flex;
          justify-content: space-between;
          margin-bottom: 25px;
          align-items: center;
          :global(.left-title) {
            :global(.dot) {
              width: 10px;
              height: 10px;
              display: inline-block;
              margin-right: 5px;
            }
            :global(.title) {
              font-size: 12px;
              color: var(--theme-font-color-1);
            }
          }
          :global(.right-amount) {
            font-size: 12px;
            text-align: right;
            :global(.percentage) {
              color: var(--theme-font-color-1);
            }
            :global(.amount) {
              color: var(--theme-font-color-3);
            }
          }
        }
      }
    }
  }
`;
