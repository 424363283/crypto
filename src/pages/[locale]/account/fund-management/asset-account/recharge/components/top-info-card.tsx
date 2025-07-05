import { LANG } from '@/core/i18n';
import { Account, Assets } from '@/core/shared';
import { MediaInfo, Polling } from '@/core/utils';
import { useEffect } from 'react';
import css from 'styled-jsx/css';

export const TopInfoCard = ({ currency }: { currency: string }) => {
  const { allSpotAssets } = Account.assets.spotAssetsStore;
  const itemAssets = allSpotAssets.filter((item: { code: string }) => item.code === currency)?.[0];
  const liteAssets = (itemAssets?.lite?.planMargin || 0).add(itemAssets?.lite?.positionMargin || 0);
  const assetsAll = itemAssets?.total?.add(liteAssets);
  const freezeAll = itemAssets?.frozen?.add(liteAssets);

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
          {assetsAll?.toFormat(2)} {currency}
        </p>
      </div>
      <div className='card'>
        <p className='name'>{LANG('可用')}</p>
        <p className='num'>{`${itemAssets?.balance.toFormat(2) || 0} ${currency || ''}`}</p>
      </div>
      <div className='card'>
        <p className='name'>{LANG('下单冻结')}</p>
        <p className='num'>{`${freezeAll?.toFormat(2) || 0} ${currency}`}</p>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .top-info-card {
    display: flex;
    align-items: center;
    width: 100%;
    border-radius: 8px;
    padding: 24px 0 ;
    border: 1px solid var(--fill_3);
    box-sizing: border-box;
    @media ${MediaInfo.mobile}{
      padding: 8px;
    }
    .card {
      &:not(:last-child) {
          border-right: 1px solid var(--fill_line_1);
          margin-right: 20px;
      }
      &:first-child {
        .num{
          color:var(--brand);
        }
      }
      @media ${MediaInfo.mobile} {
        &:first-child {
          .num{
            color:var(--brand);
          }
        }
      }
      flex: 1;
      .name {
        font-size: 12px;
        font-weight: 400;
        color: var(--text_2);
        @media ${MediaInfo.mobile}{
          font-weight:400;
        }
      }
      .num {
        font-size: 14px;
        font-weight: 500;
        color: var(--text_1);
        margin-top: 10px;
      }
    }
  }
`;
