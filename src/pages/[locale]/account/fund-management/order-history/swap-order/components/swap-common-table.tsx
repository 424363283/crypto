import Table from '@/components/table';
import { MediaInfo } from '@/core/utils';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';

import { TableStyle } from '../../../components/table-style';
import { useAssetsFlowColumns } from '../hooks/useAssetsFlowColumns';
import { useCurrentCommissionColumns } from '../hooks/useCurrentCommissionColumns';
import { useHistoryCommissionColumns } from '../hooks/useHistoryCommissionColumns';
import { useHistoryTransactionColumns } from '../hooks/useHistoryTransactionColumns';
import { SWAP_HISTORY_ORDER_TYPE } from '../types';
import { HistoricalTableStyle } from '../../components/historical-table-style';
import { useHistoryPositionColumns } from '../hooks/useHistoryPositionColumns';
import { ORDER_HISTORY_TYPE } from '@/pages/[locale]/account/fund-management/order-history/types';
import { PositionHistoryShare } from '@/components/order-list/swap/components/position-history-share';

type TableProps = {
  tableData: any[];
  tabKey: SWAP_HISTORY_ORDER_TYPE;
  total: number;
  loading: boolean;

  page: number;
  pageSize: number;
  onPaginationChange: (page: number) => void;
};
export default function CommonFundHistoryTable(props: TableProps) {
  const { tabKey, tableData, total, page, pageSize, loading, onPaginationChange } = props;
  const [state, setState] = useImmer({
    subPage: Number(tabKey),
    listPage: page
  });
  const { listPage, subPage } = state;
  const [shareVisibleData, setShareModalData] = useState({ visible: false, data: {} });

  const onShare = (data: any) => {
    setShareModalData((v) => ({ ...v, visible: true, data }));
  };
  const TABLE_COLUMN_MAP: any = {
    [SWAP_HISTORY_ORDER_TYPE.ASSET_FLOW]: useAssetsFlowColumns(),
    [SWAP_HISTORY_ORDER_TYPE.CURRENT_COMMISSIONS]: useCurrentCommissionColumns({
      onRefresh: () => onPaginationChange(1)
    }),
    [SWAP_HISTORY_ORDER_TYPE.HISTORY_COMMISSIONS]: useHistoryCommissionColumns(),
    [SWAP_HISTORY_ORDER_TYPE.HISTORY_TRANSACTION]: useHistoryTransactionColumns(),
    [SWAP_HISTORY_ORDER_TYPE.HISTORY_POSITION]: useHistoryPositionColumns({ onShare }),
  };

  const handleSearchFundHistory = (page = 1) => {
    setState(draft => {
      draft.listPage = page;
    });
    onPaginationChange(page);
  };

  useEffect(() => {
    setState((draft) => {
      draft.subPage = Number(tabKey);
    });
  }, [tabKey]);

  return (
    <>
      <Table
        className="swap-common-table"
        showTabletTable
        showMobileTable
        loading={loading}
        columns={TABLE_COLUMN_MAP[subPage]}
        dataSource={tableData}
        rowKey={(record: any) => record?.id}
        scroll={{ x: true }}
        pagination={{
          current: page,
          total: total,
          pageSize: pageSize,
          onChange: handleSearchFundHistory,
        }}
        isHistoryList
        historyType={subPage}
        orderType={ORDER_HISTORY_TYPE.SWAP_U_ORDER}
      />
      <PositionHistoryShare
        {...shareVisibleData}
        onClose={() => setShareModalData((v) => ({ ...v, visible: false }))}
      />
      <TableStyle />
      <style jsx>{styles}</style>
      <HistoricalTableStyle />
    </>
  );
}
const styles = css`
  :global(.swap-common-table) {
    height: 100%;
    margin-bottom: 40px;
    @media ${MediaInfo.mobileOrTablet} {
      padding: 0 14px;
    }
    :global(.ant-table-container .ant-table-content) {
      :global(.empty-img-wrapper) {
        height: calc(100vh - 380px);
      }
      :global(.ant-table-expanded-row-fixed) {
        margin: -16px -30px;
      }
    }
    :global(.multi-line-item) {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }
`;
