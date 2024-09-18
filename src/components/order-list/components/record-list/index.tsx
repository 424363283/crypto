import { ConfigProvider, Table, TableProps } from 'antd';
import { useLayoutEffect, useMemo, useRef } from 'react';

import { AntdLanguageConfigProvider } from '@/components/antd-config-provider/language-config-provider';
import { EmptyComponent } from '@/components/empty';
import { useTheme } from '@/core/hooks';
import { MediaInfo, clsxWithScope, debounce, isSwapDemo } from '@/core/utils';
import css from 'styled-jsx/css';

export { ColSelectTitle } from './components/col-select-title';
export { ColSortTitle } from './components/col-sort-title';

export const formatListData = (data: any[], value: any, key = 'symbol') => {
  const reg = !isSwapDemo() ? /-usdt?/i : /s?-s?usdt?/i;
  const format = (v: any) => v?.replace(reg, '').toUpperCase();
  return data?.filter((v: any) => (value === undefined ? true : format(v[key]) === format(value))) || [];
};

const RecordList = ({
  className,
  data,
  columns,
  loading,
  renderRowKey,
  rowClassName,
  onLoadMore,
  onRowClick,
  getScrollElement,
  scroll = { y: 500 },
}: {
  className?: string;
  data?: any[];
  columns?: any[];
  onLoadMore?: Function;
  loading?: boolean;
  renderRowKey?: (v: any, i: any) => any;
  rowClassName?: TableProps<any>['rowClassName'];
  onRowClick?: (item: any) => any;
  getScrollElement?: (ele: any) => any;
  scroll?: { x?: number; y: number };
}) => {
  const { isDark } = useTheme();
  const tableRef = useRef<any>();
  const id = useMemo(() => (Math.random() + '').replace('0.', 'table'), []);

  useLayoutEffect(() => {
    const parent = document.getElementsByClassName(`${id}`)?.[0];
    const scroll: any = parent?.getElementsByClassName('ant-table-body')?.[0];

    if (scroll) {
      getScrollElement?.(scroll);
      const onScroll = debounce(() => {
        if (scroll.scrollHeight - scroll.scrollTop - 10 <= scroll.clientHeight) {
          // 滚动到最底
          onLoadMore?.();
        }
      }, 100);
      scroll.addEventListener('scroll', onScroll);
      return () => {
        scroll?.removeEventListener('scroll', onScroll);
      };
    }
  }, [id, tableRef.current, onLoadMore, loading, getScrollElement]);

  const list = data;
  // const list = useMemo(
  //   () =>
  //     !hide
  //       ? data
  //       : data.filter(
  //           (item) => item.symbol?.toUpperCase() === quoteId || quoteId?.indexOf(item.currency?.toUpperCase()) !== -1
  //         ),
  //   [data, hide, quoteId]
  // );

  const others = useMemo(() => {
    return {
      rowKey: renderRowKey || ((v: any) => `${v.id}`), // 函数的形式不支持第二个参数了
      onRow: (record: any) => ({
        onClick: () => {
          onRowClick?.(record);
          // onCryptoChange?.(id, { replace: false });
        },
      }),
    };
  }, [onRowClick, renderRowKey]);

  return (
    <>
      <AntdLanguageConfigProvider>
        <ConfigProvider renderEmpty={() => (loading ? <></> : <EmptyComponent active className={clsx('empty')} />)}>
          <Table
            ref={tableRef}
            className={clsx('record-list', !isDark && 'light', className, id)}
            columns={columns}
            dataSource={list}
            pagination={false}
            loading={loading}
            rowClassName={rowClassName}
            scroll={scroll}
            {...others}
          />
        </ConfigProvider>
      </AntdLanguageConfigProvider>
      {styles}
    </>
  );
};

const { className, styles } = css.resolve`
  .record-list {
    :global(.ant-table) {
      background: transparent;
      font-size: 12px;
    }
    :global(.ant-table-thead) {
      :global(tr) {
        :global(th),
        :global(td) {
          height: 30px;
          padding-bottom: 0;
          padding-top: 10px;
          padding-left: 0px;
          padding-right: 9px;
          background: var(--theme-background-color-1);
          font-size: 12px;
          font-weight: 500;
          color: var(--theme-font-color-2);
          transition: none;
        }
      }
    }
    :global(tr) {
      :global(th),
      :global(td) {
        border: 0;
        vertical-align: middle;
        &:first-child {
          padding-left: 20px;
        }
        &:last-child {
          padding-right: 10px;
        }
        &::before {
          display: none !important;
        }
        :gloabl(div) {
          white-space: nowrap;
        }
      }
      :global(td) {
        padding: 10px 5px;
        padding-left: 2px;
        color: var(--theme-font-color-1);
      }
      @media ${MediaInfo.desktop} {
        :global(td.ant-table-cell-row-hover) {
          background: transparent !important;
        }
      }
    }
    :global(.ant-table-thead)
      > :global(tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected))
      > :global(td),
    :global(.ant-table-tbody)
      > :global(tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected))
      > :global(td),
    :global(.ant-table-thead)
      > :global(tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected))
      > :global(td),
    :global(.ant-table-tbody)
      > :global(tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected))
      > :global(td) {
      background: var(--theme-background-color-1);
    }

    // loading
    :global(.ant-spin-blur) {
      opacity: 1;
    }
    :global(.ant-table-placeholder) {
      background: transparent !important;
      border: 0;
      :global(tr),
      :global(tr):hover,
      :global(tr):active {
        background: transparent !important;
      }
    }
    :global(.ant-table-hide-scrollbar) {
      margin-bottom: 0px !important;
      &::-webkit-scrollbar {
        display: none;
      }
    }

    :global(.ant-table-cell-scrollbar) {
      box-shadow: none;
    }

    :global(.ant-table-header),
    :global(.ant-spin-container::after) {
      background: transparent !important;
    }
    :global(.ant-spin-nested-loading) > :global(div) > :global(.ant-spin) {
      height: 150px;
    }
    :global(.ant-table-body) {
      background: transparent !important;
    }
    // 自定义样式
    :global(.multi-line-item) {
      line-height: 16px;
      font-size: 12px;
      font-weight: 400;
      color: var(--theme-font-color-1);
    }
  }

  .empty {
    height: 229px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
`;
const clsx = clsxWithScope(className);
export default RecordList;
