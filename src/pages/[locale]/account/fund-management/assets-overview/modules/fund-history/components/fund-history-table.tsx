import Table from '@/components/table';
import { MediaInfo } from '@/core/utils';
import { useEffect } from 'react';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';
import { TableStyle } from '../../../../components/table-style';
import { FUND_HISTORY_TAB_KEY } from '../types';
import { useFiatColumns } from './hooks/use-fiat-columns';
import { useFlashExchangeColumns } from './hooks/use-flash-exchange-columns';
import { useMoveRecordsColumns } from './hooks/use-move-records-columns';
import { useRechargeColumns } from './hooks/use-recharge-columns';
import { useTransferRecordColumns } from './hooks/use-transfer-record-columns';
import { useWithdrawColumns } from './hooks/use-withdraw-columns';

const PAGE_ROWS = 13;
type TableProps = {
  tableData: any[];
  tabKey: FUND_HISTORY_TAB_KEY;
  total: number;
  fetchRecordData: any;
  page: number;
};
export const CommonFundHistoryTable = (props: TableProps) => {
  const { tabKey, tableData, total, fetchRecordData, page } = props;
  const [state, setState] = useImmer({
    subPage: Number(tabKey),
    listPage: 1,
  });
  const { listPage, subPage } = state;

  useEffect(() => {
    setState((draft) => {
      draft.subPage = Number(tabKey);
    });
  }, [tabKey]);
  useEffect(() => {
    if (listPage !== page) {
      setState((draft) => {
        draft.listPage = page;
      });
    }
  }, [page]);

  const TABLE_COLUMN_MAP: any = {
    [FUND_HISTORY_TAB_KEY.MOVE_RECORD]: useMoveRecordsColumns(),
    [FUND_HISTORY_TAB_KEY.FIAT_CURRENCY_RECORD]: useFiatColumns(),
    [FUND_HISTORY_TAB_KEY.RECHARGE_RECORD]: useRechargeColumns(),
    [FUND_HISTORY_TAB_KEY.WITHDRAW_RECORD]: useWithdrawColumns(),
    [FUND_HISTORY_TAB_KEY.TRANSFER_RECORD]: useTransferRecordColumns(),
    [FUND_HISTORY_TAB_KEY.FLASH_EXCHANGE_RECORD]: useFlashExchangeColumns(),
  };

  const handleSearchFundHistory = (value: { code: string; currency: string }, page = 1) => {
    if (!value) return;
    setState((draft) => {
      draft.listPage = page;
    });
    fetchRecordData({
      ...value,
      page,
    });
  };

  const onChangePage = (pagination: number) => {
    handleSearchFundHistory({ code: '', currency: '' }, pagination);
  };
  // console.log('tableData', tableData);
  return (
    <>
      <Table
        className='fund-history-table'
        showTabletTable
        showMobileTable
        columns={TABLE_COLUMN_MAP[subPage]}
        dataSource={tableData}
        rowKey={(record: any) => record?.id}
        scroll={{ x: true }}
        pagination={{
          current: listPage,
          total: total,
          pageSize: PAGE_ROWS,
          onChange: onChangePage,
        }}
      />
      <TableStyle />
      <style jsx>{styles}</style>
    </>
  );
};
const styles = css`
  :global(.fund-history-table) {
    height: 100%;
    margin-bottom: 40px;
    @media ${MediaInfo.mobileOrTablet} {
      padding: 0 14px;
    }
    :global(.ant-table-container .ant-table-content) {
      :global(.empty-img-wrapper) {
        height: calc(100vh - 380px);
      }
    }
  }
`;
