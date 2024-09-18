import Table from '@/components/table';
import { MediaInfo } from '@/core/utils';
import css from 'styled-jsx/css';
export default function HistoricalTable(props: any) {
  return (
    <>
      <Table className='historical-table' {...props} />
      <style jsx>{styles}</style>
    </>
  );
}

const styles = css`
  :global(.historical-table) {
    min-height: calc(100vh - 216px);
    @media ${MediaInfo.mobile} {
      padding: 0 10px 20px;
    }
    @media ${MediaInfo.tablet} {
      padding: 0 20px;
    }
    :global(.ant-table-empty) {
      :global(.ant-table-placeholder) {
        height: 760px;
        :global(.ant-table-cell) {
          border-top: 0;
          border-bottom: 0;
        }
      }
    }
    :global(.mobile-table-card) {
      :global(.multi-line-item .lever) {
        @media ${MediaInfo.mobile} {
          width: unset;
        }
      }
      :global(.multi-line-item .contract) {
        @media ${MediaInfo.mobileOrTablet} {
          display: flex;
          justify-content: end;
        }
      }
    }

    :global(.ant-table-thead) {
      :global(.ant-table-cell) {
        font-size: 12px;
        font-weight: 400;
        color: var(--theme-font-color-2);
      }
    }
  }
`;
