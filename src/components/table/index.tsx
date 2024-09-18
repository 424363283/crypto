import { EmptyComponent } from '@/components/empty';
import { LANG } from '@/core/i18n';
import { clsx } from '@/core/utils';
import { Table as AntdTable } from 'antd';
import css from 'styled-jsx/css';
import CommonIcon from '../common-icon';
import { Desktop, Mobile, Tablet } from '../responsive';
import { MobileTable } from './mobile-table';
import { Pagination } from './pagination';

export const Table = (props: any): JSX.Element => {
  const {
    columns,
    dataSource = [],
    pagination,
    className,
    showMobileTable = false,
    showTabletTable = false,
    ...rest
  } = props;
  const columnWithCustomSortIcon = columns?.map((item: any) => {
    return {
      ...item,
      sortIcon: ({ sortOrder }: { sortOrder: 'ascend' | 'descend' }) => {
        if (sortOrder === 'ascend') {
          return <CommonIcon name='common-sort-up-active-icon-0' size={14} enableSkin />;
        }
        if (sortOrder === 'descend') {
          return <CommonIcon name='common-sort-down-active-icon-0' size={14} enableSkin />;
        }
        return <CommonIcon name='common-sort-icon-0' size={14} />;
      },
    };
  });
  const renderAntdWithoutPaginationTable = () => {
    return (
      <>
        <style jsx>{tableStyles}</style>
        <AntdTable
          className={clsx('common-table', className)}
          showSorterTooltip={false}
          columns={columnWithCustomSortIcon}
          showSizeChanger={false}
          dataSource={dataSource}
          virtualScroll={true}
          locale={{ emptyText: <EmptyComponent active={false} /> }}
          pagination={false}
          {...rest}
        ></AntdTable>
      </>
    );
  };
  if (pagination === false || !dataSource?.length) {
    return (
      <>
        <Desktop forceInitRender={false}>{renderAntdWithoutPaginationTable()}</Desktop>
        <Mobile forceInitRender={false}>
          {showMobileTable ? (
            <MobileTable className={className} columns={columns} dataSource={dataSource} pagination={pagination} />
          ) : (
            renderAntdWithoutPaginationTable()
          )}
        </Mobile>
        <Tablet forceInitRender={false}>
          {showTabletTable ? (
            <MobileTable className={className} columns={columns} dataSource={dataSource} pagination={pagination} />
          ) : (
            renderAntdWithoutPaginationTable()
          )}
        </Tablet>
      </>
    );
  }
  const _total = pagination?.total || dataSource?.length;
  const renderWithPaginationTable = () => {
    return (
      <AntdTable
        virtualScroll={true}
        className={clsx('common-table', className)}
        showSorterTooltip={false}
        columns={columnWithCustomSortIcon}
        locale={{ emptyText: <EmptyComponent active={false} /> }}
        pagination={pagination}
        dataSource={dataSource}
        {...rest}
        expandable={{
          expandIconColumnIndex: columns?.length, // 将展开图标放在最后一列
          expandIcon: ({ expanded, onExpand, record }) =>
            expanded ? (
              <div className='expand-btn' onClick={(e) => onExpand(record, e)}>
                <span>{LANG('详情')}</span>
                <CommonIcon name='common-expanded-icon-0' size={12} style={{ cursor: 'pointer' }} enableSkin />
              </div>
            ) : (
              <div className='expand-btn' onClick={(e) => onExpand(record, e)}>
                <span>{LANG('详情')}</span>
                <CommonIcon name='common-expand-icon-0' size={12} style={{ cursor: 'pointer' }} enableSkin />
              </div>
            ),
          ...props.expandable,
        }}
      />
    );
  };
  return (
    <>
      <Desktop>{renderWithPaginationTable()}</Desktop>
      <Mobile>
        {showMobileTable ? (
          <MobileTable className={className} columns={columns} dataSource={dataSource} pagination={pagination} />
        ) : (
          renderWithPaginationTable()
        )}
      </Mobile>
      <Tablet>
        {showTabletTable ? (
          <MobileTable className={className} columns={columns} dataSource={dataSource} pagination={pagination} />
        ) : (
          renderWithPaginationTable()
        )}
      </Tablet>
      <Pagination {...pagination} showSizeChanger={false} dataSource={dataSource} total={_total} />
      <style jsx>{tableStyles}</style>
    </>
  );
};
export { Pagination };
const tableStyles = css`
  :global(.common-table) {
    :global(.ant-spin-container::after) {
      background: transparent !important;
    }
    :global(.ant-table) {
      background: transparent !important;
      :global(.ant-table-content) {
        :global(th),
        :global(td) {
          color: var(--theme-font-color-1);
          border-color: var(--theme-border-color-1);
        }
        :global(.ant-table-cell-row-hover) {
          background: var(--theme-background-color-2-5) !important;
        }
        :global(.ant-table-row-expand-icon-cell) {
          background-color: unset;
          border-bottom: none;
          :global(.expand-btn) {
            display: flex;
            align-items: center;
            cursor: pointer;
            color: var(--skin-main-font-color);
            font-size: 14px;
            min-width: 50px;
            max-width: 100px;
            :global(span) {
              margin-right: 7px;
            }
          }
        }
        :global(.ant-table-expanded-row) {
          background-color: var(--theme-background-color-3);
          :global(td) {
            border-radius: 8px;
          }
        }
        :global(.ant-table-thead .ant-table-cell) {
          &:before {
            background-color: unset !important;
          }
        }
      }
    }
    :global(.ant-pagination) {
      display: none;
    }
    :global(.ant-table-column-sorters) {
      justify-content: flex-start;
      :global(.ant-table-column-title) {
        flex: none;
      }
    }
    :global(td.ant-table-column-sort) {
      background: white;
    }
    :global(th.ant-table-cell) {
      background: transparent !important;
      &::before {
        position: static !important;
        background-color: transparent !important;
      }
    }
    :global(.ant-table-column-sorter-down.active, .ant-table-column-sorter-up.active) {
      color: var(--skin-primary-color) !important;
    }
    :global(.ant-table-column-title) {
      flex: none;
      margin-right: 6px;
    }
  }
`;

export default Table;
