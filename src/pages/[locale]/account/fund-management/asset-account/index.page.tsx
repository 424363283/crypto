import { UniversalLayout } from '@/components/layouts/universal';
import Table from '@/components/table';
import { getDepositRecordsApi, getPaymentsRecordsApi, getWithdrawRecordsApi } from '@/core/api';
import { useLastPathname } from '@/core/hooks';
import { LANG, Lang } from '@/core/i18n';
import { getUrlQueryParams, MediaInfo, message } from '@/core/utils';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';
import { useRechargeColumns } from '../assets-overview/modules/fund-history/components/hooks/use-recharge-columns';
import { useTransferRecordColumns } from '../assets-overview/modules/fund-history/components/hooks/use-transfer-record-columns';
import { useWithdrawColumns } from '../assets-overview/modules/fund-history/components/hooks/use-withdraw-columns';
import TableContent from './components/table-content';
import { Recharge } from './recharge/components/recharge';
import { TransferEntry } from './transfer/components/transfer-entry';
import { WithdrawEntry } from './withdraw/components/withdraw-entry';
import { StepsStyle } from '../asset-account/components/steps-style';
import Nav from '@/components/nav';

export enum TAB_KEY {
  RECHARGE = 'recharge',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer',
}
function AssetAccount() {
  const lastPathname = useLastPathname<TAB_KEY>();
  const [curTab, setCurTab] = useState<TAB_KEY>(lastPathname);
  const [hasQueryCode, setHasQueryCode] = useState(false);
  const withdrawColumns = useWithdrawColumns();
  const rechargeColumns = useRechargeColumns();
  const transferColumns = useTransferRecordColumns();
  transferColumns.splice(1, 1);

  const [state, setState] = useImmer({
    tableData: [] as any[],
  });
  const { tableData } = state;
  const queryCode = getUrlQueryParams('code');
  const startDate = dayjs().add(-29, 'd').startOf('day').format('YYYY-MM-DD H:m:s');
  const endDate = dayjs().endOf('day').format('YYYY-MM-DD H:m:s');

  const getWithdrawHistoryData = async () => {
    const res = await getWithdrawRecordsApi({
      page: 1,
      rows: 10,
      createTimeGe: startDate,
      createTimeLe: endDate,
      transfer: false,
    });
    return res;
  };
  const getTransferHistoryData = async () => {
    const res = await getPaymentsRecordsApi({
      page: 1,
      rows: 10,
      startTime: dayjs(startDate).valueOf(),
      endTime: dayjs(endDate).valueOf(),
      fund: 'ASSET',
      source: 'SPOT',
      target: 'SPOT',
    });
    return res;
  };
  const getRechargeWithdrawHistory = async () => {
    const res = await getDepositRecordsApi({
      page: 1,
      rows: 10,
      createTimeGe: startDate,
      createTimeLe: endDate,
      coin: true,
    });
    return res;
  };
  const TABLE_CONTENT_MAP = {
    [TAB_KEY.RECHARGE]: getRechargeWithdrawHistory,
    [TAB_KEY.WITHDRAW]: getWithdrawHistoryData,
    [TAB_KEY.TRANSFER]: getTransferHistoryData,
  };
  const fetchTableData = TABLE_CONTENT_MAP[lastPathname];
  const fetchData = async () => {
    const res = await fetchTableData();
    if (res.code === 200) {
      setState((draft) => {
        draft.tableData = res.data.list;
      });
    } else {
      message.error(res.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, [lastPathname]);
  useEffect(() => {
    setCurTab(lastPathname);
    if (queryCode) {
      setHasQueryCode(true);
    }
  }, [lastPathname, queryCode]);
  const renderTabContent = () => {
    const TAB_CONTENT_MAP = {
      [TAB_KEY.RECHARGE]: <Recharge hasQueryCode={hasQueryCode} />,
      [TAB_KEY.WITHDRAW]: <WithdrawEntry hasQueryCode={hasQueryCode} getWithdrawHistoryData={fetchData} />,
      [TAB_KEY.TRANSFER]: <TransferEntry hasQueryCode={hasQueryCode} getTransferHistoryData={fetchData} />,
    };
    return TAB_CONTENT_MAP[curTab];
  };
  const TABLE_COLUMN_MAP = {
    [TAB_KEY.RECHARGE]: rechargeColumns,
    [TAB_KEY.WITHDRAW]: withdrawColumns,
    [TAB_KEY.TRANSFER]: transferColumns,
  };
  const TABLET_TITLE_MAP = {
    [TAB_KEY.RECHARGE]: LANG('近期充币记录'),
    [TAB_KEY.WITHDRAW]: LANG('近期提币记录'),
    [TAB_KEY.TRANSFER]: LANG('近期内部转账记录'),
  };
  const FUND_HISTORY_LINK_ID = {
    [TAB_KEY.RECHARGE]: '2',
    [TAB_KEY.WITHDRAW]: '3',
    [TAB_KEY.TRANSFER]: '4',
  };
  const NAV_TITLE_MAP = {
    [TAB_KEY.RECHARGE]: LANG('充币'),
    [TAB_KEY.WITHDRAW]: LANG('提币'),
    [TAB_KEY.TRANSFER]: LANG('内部转账'),
  };
  console.log(TABLE_COLUMN_MAP[lastPathname]);
  console.log(tableData, 111);
  
  return (
    <UniversalLayout className='asset-count-container' bgColor='var(--fill-2)' headerBgColor='var(--fill-2)'>
      <div className='asset-account-header'>
        <Nav title={NAV_TITLE_MAP[curTab]} />
      </div>
      {renderTabContent()}
      <TableContent
        title={TABLET_TITLE_MAP[curTab]}
        allUrl='/account/fund-management/assets-overview'
        query={{ type: 'fund-history', tab: FUND_HISTORY_LINK_ID[curTab] }}
      >
         <Table
            dataSource={tableData}
            columns={TABLE_COLUMN_MAP[lastPathname]}
            pagination={false}
            showTabletTable
            showMobileTable
            isHistoryList
          />
      </TableContent>
      <style jsx>{styles}</style>
      <StepsStyle />
    </UniversalLayout>
  );
}
const styles = css`
  :global(.uni-layout .main) {
    min-height: 100% !important;
    margin-bottom: 24px;
  }
  :global(.common-table) {
    position: relative;
    min-height: 300px;
  }

  :global(.asset-count-container) {
    :global(table) {
      padding: 0;
    }
    background-color: var(--bg-1);
    @media ${MediaInfo.mobile} {
      padding: 0 12px;
      background-color: transparent;
    }
    .asset-account-header {
      position: sticky;
      top: 56px;
      z-index: 10;
      @media ${MediaInfo.mobile} {
        background-color:transparent;
        top: 44px;
        z-index: 99;
      }
    }
    .asset-account-card {
      background-color: #fff;
      width: 100%;
      padding: 0;
      border-radius: 4px;
    }
  }
`;
export default Lang.SeoHead(AssetAccount);
export const getStaticPaths = Lang.getStaticPaths;
export const getStaticProps = Lang.getStaticProps({ auth: true, key: 'account/fund-management/asset-account' });
