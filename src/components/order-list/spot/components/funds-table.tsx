import { RateText } from '@/components/rate-text';
import { useRouter, useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Account, LoadingType, Spot, SpotListItem } from '@/core/shared';
import { useEffect, useMemo } from 'react';
import RecordList from '../../components/record-list';
import { BaseTableStyle } from './base-table-style';
import CoinLogo, { SafeNumber } from '@/components/coin-logo';
const { Position } = Spot;

const columns = [
  {
    title: LANG('币种'),
    dataIndex: 'fullname',
    minWidth: 100,
    // render: (_: any, { fullname }: SpotListItem) => fullname,
    render: (_: any, { fullname, frozen, currency }: SpotListItem) => {
      console.log;
      return (
        <div className="spot_fundsContent">
          <CoinLogo coin={currency} width={16} height={16} alt="coin-icon" />
          <span style={{ marginLeft: '8px' }}>{currency}</span>
        </div>
      );
    }
  },
  {
    title: LANG('总额'),
    dataIndex: 'total',
    minWidth: 100,
    render: (_: any, { balance, frozen }: SpotListItem) => balance.add(frozen).toFormat()
  },
  {
    title: LANG('可用资产'),
    dataIndex: 'balance',
    minWidth: 100,
    render: (balance: number) => balance.toFormat()
  },
  {
    title: LANG('下单锁定'),
    dataIndex: 'frozen',
    minWidth: 100,
    render: (frozen: number) => frozen.toFormat()
  },
  {
    title: LANG('BTC估值'),
    align: 'right',
    dataIndex: 'value',
    minWidth: 100,
    render: (_: any, { balance, frozen, currency }: SpotListItem) => {
      return (
        <span style={{ marginRight: '4px' }}>
          <RateText money={balance.add(frozen)} currency={currency} exchangeRateCurrency="BTC" scale={8} />
        </span>
      );
    }
  }
];

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
    <>
      <div className="container">
        <RecordList
          loading={loading}
          columns={columns}
          data={filterSpotAssetsList}
          className={`${theme} spot-table`}
          renderRowKey={(v, index) => v.fullname + index}
        />
      </div>
      <BaseTableStyle />
    </>
  );
};

export default FundsTable;
