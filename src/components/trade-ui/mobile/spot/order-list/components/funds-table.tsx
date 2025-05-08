import { RateText } from '@/components/rate-text';
import { useRouter, useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Account, LoadingType, Spot, SpotListItem } from '@/core/shared';
import { useEffect, useMemo } from 'react';
import CoinLogo, { SafeNumber } from '@/components/coin-logo';
import { ListView } from '@/components/order-list/swap/media/tablet/components/list-view';

const { Position } = Spot;

const Item = ({ data: item }: { data: any }) => {
  return (
    <>
      <div className="container">
        <div className="header">
          <CoinLogo coin={item.currency} width={16} height={16} alt="coin-icon" />
          <span>{item.currency}</span>
        </div>
        <div className="info">
          <div className="row">
            <span className="label">{LANG('总额')}</span>
            <span>{item.balance.add(item.frozen).toFormat()}</span>
          </div>
          <div className="row">
            <span className="label">{LANG('可用资产')}</span>
            <span>{item.balance.toFormat()}</span>
          </div>
          <div className="row">
            <span className="label">{LANG('下单锁定')}</span>
            <span>{item.frozen.toFormat()}</span>
          </div>
          <div className="row">
            <span className="label">{LANG('BTC估值')}</span>
            <span>
              <RateText
                money={item.balance.add(item.frozen)}
                currency={item.currency}
                exchangeRateCurrency="BTC"
                scale={8}
              />
            </span>
          </div>
        </div>
      </div>
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          gap: 12px;
          border-bottom: 1px solid var(--fill_line_1);
          font-size: 14px;
          color: var(--text_1);
          font-weight: 500;
          .header {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            gap: 4px;
            font-size: 1rem;
          }

          .info {
            padding-bottom: 12px;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
            .row {
              display: flex;
              justify-content: space-between;
              width: 100%;
              .label {
                color: var(--text_3);
                font-weight: 400;
              }
            }
          }
        }
      `}</style>
    </>
  );
};

const FundsTable = () => {
  const id = useRouter().query.id as string;
  const { theme } = useTheme();
  const { spotAssetsList, loading, hideMinimal } = Position.state;

  const isLogin = Account.isLogin;

  const filterSpotAssetsList = useMemo(() => {
    let resultList = spotAssetsList;
    if (hideMinimal) {
      resultList = resultList.filter(({ balance, frozen }) => (hideMinimal ? balance.add(frozen) !== '0' : true));
    }
    if (!isLogin) {
      return [];
    }

    return resultList;
  }, [hideMinimal, spotAssetsList, id, isLogin]);

  useEffect(() => {
    Position.fetchSpotAssetsList(LoadingType.Show);
    setTimeout(() => Position.pollingAssets.start(), 1000);
    return () => {
      Position.pollingAssets.stop();
    };
  }, []);

  return (
    <ListView data={filterSpotAssetsList} loading={!filterSpotAssetsList.length && loading}>
      {index => {
        const item = filterSpotAssetsList[index];

        return <Item key={index} data={item} />;
      }}
    </ListView>
  );
};

export default FundsTable;
