import Table from '@/components/table';
import { LANG } from '@/core/i18n';
import dayjs from 'dayjs';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';
import { TableStyle } from '../../../components/table-style';
import { SwapReportPnls } from '../../components/hooks/use-swap-pnl-data';
interface SwapDetailProps {
  reportPnls: SwapReportPnls[];
  symbolUnit: 'USD' | 'USDT';
}
export default function SwapDetailCard(props: SwapDetailProps) {
  const { reportPnls, symbolUnit } = props;
  const shadowPnls = [...reportPnls];
  shadowPnls.sort((a, b) => {
    return b.date - a.date;
  });
  const [state, setState] = useImmer({
    page: 1,
  });
  const { page } = state;
  const _onChange = (page: number) => {
    setState((draft) => {
      draft.page = page;
    });
  };
  const columns = [
    {
      title: LANG('日期'),
      width: '20%',
      align: 'left',
      dataIndex: 'date',
      render: (value: string) => {
        return <span style={{ color: 'var(--const-color-grey)' }}>{dayjs(value).format('YYYY/MM/DD')}</span>;
      },
    },
    {
      title: LANG('单日盈亏'),
      align: 'left',
      width: '20%',
      dataIndex: 'pnl',
      render: (value: string) => {
        return (
          <span>
            {value.toFormat(2)} {symbolUnit}
          </span>
        );
      },
    },
    {
      title: LANG('累计盈亏'),
      dataIndex: 'totalPnl',
      width: '20%',
      align: 'left',
      render: (value: string) => {
        return (
          <span>
            {value?.toFixed(2)} {symbolUnit}
          </span>
        );
      },
    },
    {
      title: LANG('累计盈亏率%'),
      dataIndex: 'totalPnlRate',
      align: 'left',
      width: '20%',
      render: (value: string) => {
        return (
          <span style={+value < 0 ? { color: 'var(--color-red)' } : { color: 'var(--color-green)' }}>
            {value?.mul(100)?.toFixed(2)}%
          </span>
        );
      },
    },
    {
      title: LANG('净划入'),
      dataIndex: 'transferAmount',
      width: '20%',
      align: 'right',
      render: (value: string) => {
        return (
          <span>
            {value?.mul(100)?.toFixed(2)} {symbolUnit}
          </span>
        );
      },
    },
  ];
  return (
    <div className='swap-pnl-detail'>
      <Table
        dataSource={shadowPnls}
        columns={columns}
        showMobileTable
        className='swap-detail-table'
        pagination={{ current: page, pageSize: 10, onChange: _onChange, showSizeChanger: false }}
      />
      <TableStyle />
      <style jsx>{styles}</style>
    </div>
  );
}
const styles = css`
  :global(.swap-pnl-detail) {
    :global(.swap-detail-table .ant-table-tbody) {
      :global(.ant-table-row:nth-child(2n)) {
        background: var(--theme-background-color-8-1) !important;
        :global(td:first-child) {
          border-top-left-radius: 5px;
          border-bottom-left-radius: 5px;
        }
        :global(td:last-child) {
          border-top-right-radius: 5px;
          border-bottom-right-radius: 5px;
        }
      }
      :global(.ant-table-row td) {
        border-bottom: none;
      }
      :global(.ant-table-row .ant-table-cell-row-hover) {
        background: transparent !important;
      }
      :global(.ant-table-cell .green) {
        color: var(--color-green);
        font-size: 14px;
        font-weight: 500;
      }
      :global(.ant-table-cell .red) {
        color: var(--color-red);
        font-size: 14px;
        font-weight: 500;
      }
    }
    :global(.bottom-pagination) {
      padding: 30px 0;
    }
  }
`;
