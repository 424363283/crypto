import Table from '@/components/table';
import { MediaInfo } from '@/core/utils';
import css from 'styled-jsx/css';
export default function CopyTradingCompareTable(props: any) {
  return (
    <>
      <Table className='copytrading-compare-table' {...props} />
      <style jsx>{styles}</style>
    </>
  );
}
const styles = css`
  :global(.copytrading-compare-table) {
    :global(.ant-table-content)  {
      :global(.ant-table-tbody)  {
        :global(.ant-table-row td) {
          border-bottom: 1px solid var(--fill_line_2);
        }
      }
    }
    :global(.ant-table.ant-table-bordered ) {
      :global(>.ant-table-container ) {
        border-inline-start: 1px solid var(--fill_line_2);
        border-top: 1px solid var(--fill_line_2);
      }
      :global(>.ant-table-title) {
        border: 1px solid var(--fill_line_2);
        border-bottom: 0;
      }
    }
    
    :global(.ant-table .ant-table-title, .ant-table .ant-table-header) {
      border-radius: 0;
    }
  }
`;
