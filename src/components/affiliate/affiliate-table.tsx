import { AntdLanguageConfigProvider } from '@/components/antd-config-provider/language-config-provider';
import { LANG } from '@/core/i18n';
import { ConfigProvider, Table, TableProps } from 'antd';
import { ExpandableConfig } from 'antd/es/table/interface';
import { SizeType } from 'antd/lib/config-provider/SizeContext';
import { useMemo } from 'react';
import css from 'styled-jsx/css';
import { EmptyComponent } from '../empty';

interface Props {
  dataSource: any[];
  columns?: any[];
  total?: number;
  pageSize?: number;
  page?: number;
  showQuickJumper?: boolean;
  isCurrent?: boolean;
  size?: SizeType;
  paginationOnChange?: (page: number, rows: number) => void;
  loading?: boolean;
  onChange?: TableProps<any>['onChange'];
  expandable?: ExpandableConfig<any>;
  renderRowKey?: (v: any, i: any) => any;
  onRowClick?: (item: any) => any;
  scroll?: { x?: number; y: number };
}

const AffiliateTable = ({
  dataSource,
  columns,
  total,
  showQuickJumper = true,
  paginationOnChange,
  pageSize = 10,
  page = 1,
  loading,
  onChange,
  renderRowKey,
  expandable,
  onRowClick,
  size,
  scroll,
}: Props) => {
  const others = useMemo(() => {
    let result: any = {
      rowKey: renderRowKey || ((v: any) => `${v.id}`), // 函数的形式不支持第二个参数了
      onRow: (record: any) => ({
        onClick: () => {
          onRowClick?.(record);
        },
      }),
    };
    if (scroll) {
      result = {
        ...result,
        scroll,
      };
    }
    return result;
  }, [onRowClick, renderRowKey, scroll]);

  return (
    <>
      <div className='container'>
        <AntdLanguageConfigProvider>
          <ConfigProvider renderEmpty={() => (loading ? <></> : <EmptyComponent active className='empty' />)}>
            <Table
              dataSource={dataSource}
              columns={columns}
              showSorterTooltip={false}
              size={size}
              pagination={
                paginationOnChange
                  ? {
                      total: total,
                      showSizeChanger: false,
                      showQuickJumper,
                      onChange: paginationOnChange,
                      showTotal: (total) =>
                        `${LANG('共')} ${total} ${LANG('条记录')} ${LANG('第')} ${page}/${Math.ceil(
                          total / pageSize
                        )} ${LANG('页')}`,
                      showTitle: false,
                      current: page,
                      pageSize: pageSize,
                      size: 'default',
                    }
                  : false
              }
              onChange={onChange}
              expandable={expandable}
              {...others}
            />
          </ConfigProvider>
        </AntdLanguageConfigProvider>
      </div>
      <style jsx>{styles}</style>
    </>
  );
};

export default AffiliateTable;

const styles = css`
  .container {
    :global(.ant-table) {
      background-color: var(--theme-background-color-2) !important;
    }
    :global(.ant-table-cell) {
      background-color: var(--theme-background-color-2) !important;
      color: var(--theme-font-color-1);
      border-color: var(--theme-deep-border-color-1);
      font-weight: 500;
    }
    :global(.ant-table-expanded-row .ant-table-cell) {
      background-color: var(--theme-background-color-8) !important;
      border-radius: 15px;
      padding: 29px 24px;
    }
    :global(.ant-empty-description) {
      color: var(--theme-font-color-1);
    }
    :global(.ant-table-thead) {
      :global(.ant-table-cell) {
        font-weight: 400;
        color: var(--theme-font-color-3);
        border-color: var(--theme-deep-border-color-1);
        &:before {
          width: 0 !important;
        }
      }
    }
    :global(.ant-table-tbody .ant-table-row) {
      :global(.ant-table-column-sort) {
        background-color: var(--theme-background-color-2) !important;
      }
      :global(td.ant-table-cell-row-hover) {
        background: var(--theme-background-color-2) !important;
      }
    }
    :global(.ant-pagination-total-text) {
      margin-right: auto;
      color: var(--theme-font-color-3);
    }
    :global(.ant-pagination-item-active) {
      border-color: var(--skin-primary-color);
      background: var(--skin-primary-color) !important;
      :global(a) {
        color: var(--skin-font-color) !important;
      }
    }
    :global(.ant-pagination-item) {
      border-color: var(--theme-border-color-2);
      background: inherit;
      :global(a) {
        color: var(--const-color-grey);
      }
    }
    :global(.ant-pagination-item-link) {
      color: var(--theme-font-color-1);
    }
    :global(.ant-pagination-options-quick-jumper) {
      color: var(--theme-font-color-1);
      :global(input) {
        background: var(--theme-background-color-2-4) !important;
        border: none;
        &:hover,
        &:focus {
          border-color: var(--skin-primary-color);
          box-shadow: none;
        }
      }
    }
    .empty {
      height: 229px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }
`;
