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
import { Size } from '@/components/constants';
import { Svg } from '@/components/svg';
const AssetsDistributedModal = lazy(() => import('./assets-distributed-modal'));

const ButtonArea = () => {
  return (
    <div className='button-area'>
      <Button type='primary' className='btn' size={Size.SM}>
        <TrLink href='/account/fund-management/asset-account/recharge' query={{ code: 'USDT' }}>
          {LANG('充币')}
        </TrLink>
      </Button>
      <Button className='btn sub-btn' size={Size.SM}>
        <TrLink href='/account/fund-management/asset-account/withdraw' query={{ code: 'USDT' }}>
          {LANG('提币')}
        </TrLink>
      </Button>
      {/* <Button className='btn sub-btn' size={Size.SM}>
        <TrLink href='/fiat-crypto'>{LANG('买币')}</TrLink>
      </Button> */}
      <style jsx>{buttonStyles}</style>
    </div>
  );
};
const buttonStyles = css`
  .button-area {
    display: flex;
    align-items: center;
    gap:24px;
    :global(.btn) {
      padding: 6px 24px;
      border-radius: 16px;
      &:not(:first-child) {
        margin-left: 10px;
      }
      @media ${MediaInfo.mobile} {
        padding:0;
        flex: 1;
        height:32px;
        &:not(:first-child) {
          margin-left: 0;
        }
      }
      :global(a) {
        text-align: center;
        color: var(--theme-font-color-1);
        font-size: 14px;
        @media ${MediaInfo.mobile} {
          font-weight: 400;
        }
      }
    }
    @media ${MediaInfo.mobile} {
      margin-top: 0;
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
  const [assetShow, setAssetShow] = useState(true);
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
          <div className={clsx('option-item', dateRange === 90 && 'active-date')} onClick={() => setDateRange(90)}>
            {LANG('90日')}
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
        <div className="assets-balance">
          <div className='title'>
            <span>{LANG('总资产估值')}</span>
            <Svg src={!assetShow ? `/static/icons/primary/common/eyes-open.svg` : `/static/icons/primary/common/eyes-close.svg`}
              width={16}
              height={16}
              color={'var(--text_1)'}
              onClick={()=>setAssetShow(!assetShow)}
            />
          </div>
          <AssetsBalance type={WalletType.ASSET_TOTAL} enableHideBalance={assetShow} />
        </div>
        <ButtonArea />
      </div>
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
    background: var(--fill_bg_1);
    .option2-bar {
      display: flex;
      justify-content: space-between;
      gap: 24px;
      @media ${MediaInfo.mobile} {
        flex-direction: column;
        gap: 12px;
      }
      .left-option-bar,
      .right-option-bar {
        display: flex;
        align-items: center;
      }
      .left-option-bar {
        border:1px  solid  var(--fill_line_1);
        border-radius: 4px;
        padding: 3px;
        flex: 1 0 0;
        .option-item {
          color: var(--theme-font-color-3);
          cursor: pointer;
          font-size: 14px;
          height: 32px;
          line-height: 32px;
          border-radius:8px;
          text-align: center;
          color:var(--text_2);
          flex: 1 0 0;
          &:nth-child(1) {
            margin-right: 15px;
          }
          @media ${MediaInfo.mobile} {
            height: 24px;
            line-height: 24px;
            width:50px;
            padding:0;
          }
        }
        .active-date {
          background:var(--fill_3);
          color:var(--text_1);
          border-radius:4px;
        }
      }
      .right-option-bar {
        color: var(--theme-font-color-3);
        .assets-item {
          margin-right: 25px;
          @media ${MediaInfo.mobile} {
            margin-right: 10px;
          }
        }
        :global(.option-item) {
          display: flex;
          cursor: pointer;
          align-items: center;
          font-size: 14px;
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
    border-radius:8px;
    padding: 24px;
    @media ${MediaInfo.mobile} {
      padding: 16px;
    }
    flex:1;
    .header-area {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      @media ${MediaInfo.mobile} {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        gap: 24px;
      }
      .assets-balance {
        display:flex;
        flex-direction: column;
        gap: 24px;
        .title {
          font-size: 16px;
          font-weight: 500;
          color: var(--text_1);
          display:flex;
          align-items: center;
          span{
            padding: 0 8px 0 0;
          }
          @media ${MediaInfo.mobile} {
            color: var(--text_2);
            font-size: 14px;
            span {
              padding: 0 10px 0 0;
            }
          } 
        }
      }
    }
  }

  :global(.assets-distributed) {
    position: relative;
    display: flex;
    margin-left: 16px;
    gap: 48px;
    align-items: center;
    @media ${MediaInfo.mobile} {
      flex-direction: row;
      align-items: center;
      margin: 0;
      gap: 16px;
    }
  }
  :global(.assets-lis) {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items:space-between;
      padding: 0;
      margin:0;
      gap: 24px;
      @media ${MediaInfo.mobile} {
        margin-left: 0px;
        padding: 0;
        gap: 16px;
      }
      :global(.list-item) {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 48px;
        margin: 0;
        @media ${MediaInfo.mobile} {
          gap: 12px;
        }
        :global(.left-title) {
          width: 100px;
          :global(.dot) {
            width: 10px;
            height: 10px;
            display: inline-block;
            margin-right: 5px;
            border-radius:5px;
          }
          :global(.title) {
            font-size: 14px;
            color: var(--text_1);
            @media ${MediaInfo.mobile} {
              font-size:12px;
            }
          }
        }
        :global(.right-amount) {
          flex: 1;
          font-size: 12px;
          font-weight: 400;
          text-align: right;
          display: flex;
          flex-direction: column;
          align-items: start;
          gap: 8px;
          :global(.percentage) {
            font-size: 14px;
            font-weight: 500;
            line-height: 14px;
            color: var(--text_1);
          }
          :global(.amount) {
            line-height: 12px;
            color: var(--text_3);
          }
        }
      }
    }
`;
