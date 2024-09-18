import { LANG, TrLink } from '@/core/i18n';
import { MediaInfo } from '@/core/utils';
import css from 'styled-jsx/css';

type TableContentProps = {
  children: React.ReactNode;
  title: string;
  allUrl: string;
  query?: { [key: string]: string };
};

const TableContent = ({ children, title, allUrl, query }: TableContentProps) => {
  return (
    <div className='asset-table-content'>
      <div className='header'>
        <div className='title'>{title}</div>
        <TrLink href={allUrl} query={query} className='all-record'>
          {LANG('全部记录')}
        </TrLink>
      </div>
      {children}
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .asset-table-content {
    margin: 0 auto;
    max-width: 1224px;
    width: 100%;
    margin-top: 30px;
    @media ${MediaInfo.tablet} {
      padding: 0 20px;
    }
    @media ${MediaInfo.mobile} {
      padding: 0 10px;
    }
    :global(.ant-table-tbody .ant-table-row:nth-child(2n)) {
      background: var(--theme-background-color-8) !important;
      :global(td:first-child) {
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
      }
      :global(td:last-child) {
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
      }
    }
    :global(.ant-table-tbody .ant-table-row .ant-table-cell-row-hover) {
      background: transparent !important;
    }
    .header {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      .title {
        font-size: 16px;
        font-weight: 500;
        color: var(--theme-font-color-1);
      }
      :global(.all-record) {
        font-size: 14px;
        font-weight: 500;
        color: var(--skin-main-font-color);
        border-bottom: 1px solid var(--skin-main-font-color);
      }
    }
  }
`;
export default TableContent;
