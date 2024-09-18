import { LANG } from '@/core/i18n';
import { Account, Assets } from '@/core/shared';
import { MediaInfo, Polling } from '@/core/utils';
import { useEffect } from 'react';
import css from 'styled-jsx/css';

export const TopInfoCard = ({ currency }: { currency: string }) => {
  const { spotAssetsStore } = Account.assets;
  const { allSpotAssets } = spotAssetsStore;
  const itemAssets = allSpotAssets.filter((item) => item.code === currency)?.[0];

  useEffect(() => {
    const polling = new Polling({
      interval: 2000,
      callback: () => Account.assets.getAllSpotAssets(true),
    });
    polling.start();
    Assets.dispatchWsListener();
    return () => {
      polling.stop();
      Assets.destroyWsListener();
    };
  }, []);

  return (
    <div className='top-info-card'>
      <div className='card'>
        <p className='name'>{LANG('总资产')} </p>
        <p className='num'>
          {itemAssets?.total.toFormat(2)} {currency}
        </p>
      </div>
      <div className='card'>
        <p className='name'>{LANG('可用')}</p>
        <p className='num'>{`${itemAssets?.balance.toFormat(2) || 0} ${currency || ''}`}</p>
      </div>
      <div className='card'>
        <p className='name'>{LANG('下单冻结')}</p>
        <p className='num'>{`${itemAssets?.frozen?.toFormat(2) || 0} ${currency}`}</p>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .top-info-card {
    display: flex;
    align-items: center;
    @media ${MediaInfo.desktop} {
      margin-left: 30px;
    }
    @media ${MediaInfo.mobileOrTablet} {
      margin-top: 20px;
    }
    width: 100%;
    .card {
      &:not(:last-child) {
        border-right: 1px solid var(--skin-border-color-1);
        margin-right: 20px;
      }
      flex: 1;
      .name {
        font-size: 12px;
        font-weight: 500;
        color: var(--theme-font-color-3);
      }
      .num {
        font-size: 12px;
        font-weight: 500;
        color: var(--theme-font-color-1);
        margin-top: 10px;
      }
    }
  }
`;
