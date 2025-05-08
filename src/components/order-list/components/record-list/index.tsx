import { ConfigProvider, Table, TableProps } from 'antd';
import { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { LANG } from '@/core/i18n';
import { AntdLanguageConfigProvider } from '@/components/antd-config-provider/language-config-provider';
import { EmptyComponent } from '@/components/empty';
import ArrowBox from '@/components/ArrowBox';
import YIcon from '@/components/YIcons';
import { useTheme } from '@/core/hooks';
import { MediaInfo, clsxWithScope, debounce, isSwapDemo } from '@/core/utils';
import css from 'styled-jsx/css';
import { Button } from '@/components/button';
import { createRoot } from 'react-dom/client';
import CommonIcon from '@/components/common-icon';

export { ColSelectTitle } from './components/col-select-title';
export { ColSortTitle } from './components/col-sort-title';
import type { TableLayout } from 'antd/';
import { Swap } from '@/core/shared';


const TableArrowBox = memo(({ selector, dataSource }: { selector: string; dataSource: any[] }) => {
  const prevStep: number = -50;
  const nextStep: number = 50;
  return (
    <>
      <div className={clsx('arrow-left', dataSource?.length === 0 ? 'hidden' : '')} onClick={() => {
        const tableBodyView = document.querySelector<HTMLDivElement>(selector);
        tableBodyView?.scrollBy(prevStep, 0);
        console.log('----tableBodyView?.scrollLeft: ', tableBodyView?.scrollLeft);
      }}>
        <CommonIcon name='common-double-arrow-left-0' size={14} enableSkin />
      </div>
      <div className={clsx('arrow-right', dataSource?.length === 0 ? 'hidden' : '')} onClick={() => {
        const tableBodyView = document.querySelector<HTMLDivElement>(selector);
        tableBodyView?.scrollBy(nextStep, 0);
        console.log('----tableBodyView?.scrollLeft: ', tableBodyView?.scrollLeft);
      }}>
        <CommonIcon name='common-double-arrow-right-0' size={14} enableSkin />
      </div>
    </>

  );
});

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
  tableLayout = 'auto'
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
  scroll?: { x?: number | string; y: number };
  tableLayout?: TableProps<any>['tableLayout']
}) => {
  const { isDark } = useTheme();
  const tableRef = useRef<any>();
  const id = useMemo(() => (Math.random() + '').replace('0.', 'table'), []);
  let tableArrowBoxRoot: any = null;
  const [scrollArrowsRoot, setScrollArrowsRoot] = useState<any>(null)
  const [count, setCount] = useState(0);
  const [dataList, setDataList] = useState([]);
  const { quoteId, isUsdtType } = Swap.Trade.base;
  const unit = Swap.Info.getUnitText({ symbol: quoteId });

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
  const scrollProps = list?.length > 0 ? { ...scroll } : { x: 'max-content' };
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


  useEffect(() => {
    let scrollArrowsNode = document.createElement('div');
    scrollArrowsNode.className = 'table-scroll-arrows';
    document.querySelector(`.${id} .ant-table`)?.appendChild(scrollArrowsNode);
    setScrollArrowsRoot(createRoot(scrollArrowsNode));
    scrollArrowsRoot?.render(
      <TableArrowBox selector={`.${id} .ant-table-body`} dataSource={list || []} />
    );

    return () => {
      let scrollArrowsNode = document.querySelector(`.${id} .ant-table .table-scroll-arrows`);
      if (scrollArrowsNode) {
        document.querySelector(`.${id} .ant-table`)?.removeChild(scrollArrowsNode);
      }
    };

  }, [id]);

  useEffect(() => {
    scrollArrowsRoot?.render(
      <TableArrowBox selector={`.${id} .ant-table-body`} dataSource={list || []} />
    );
  }, [list,unit]);



  return (
    <>

      <AntdLanguageConfigProvider>
        <ConfigProvider renderEmpty={() => (loading ? <></> : <EmptyComponent text={LANG('暂无数据')} active className={clsx('empty')} />)}>
          <Table
            ref={tableRef}
            className={clsx('record-list', !isDark && 'light', className, id)}
            columns={columns}
            dataSource={list}
            pagination={false}
            loading={loading}
            rowClassName={rowClassName}
            tableLayout={tableLayout}
            scroll={scrollProps}
            {...others}
          />
        </ConfigProvider>
      </AntdLanguageConfigProvider>

      {
        // <AntdLanguageConfigProvider>
        //   <ArrowBox
        //     iconContainerStyle={{ backgroundColor: 'transparent' }}
        //     leftArrowIcon={
        //       <div className="arrowCircle">
        //         {/* <YIcon name="arrow-left"} /> */}
        //       </div>
        //     }
        //     rightArrowIcon={
        //       <div className="arrowCircle">
        //         {/* <YIcon name="arrow-right"} /> */}
        //       </div>
        //     }
        //     step={300}>
        //     <ConfigProvider renderEmpty={() => (loading ? <></> : <EmptyComponent text={LANG('暂无数据')} active className={clsx('empty')} />)}>
        //       <Table
        //         ref={tableRef}
        //         className={clsx('record-list', !isDark && 'light', className, id)}
        //         columns={columns}
        //         dataSource={list}
        //         pagination={false}
        //         loading={loading}
        //         rowClassName={rowClassName}
        //         scroll={scroll}
        //         {...others}
        //       />
        //     </ConfigProvider>
        //   </ArrowBox>
        // </AntdLanguageConfigProvider>
      }
      {styles}
    </>
  );
};

const { className, styles } = css.resolve`
  .record-list {
    
      
    :global(.table-scroll-arrows) {
      width: 100%;
      position: absolute;
      top: 50%;
      z-index: 100;
      transform: translate(0, -50%);
      :global(.arrow-left) {
        position: absolute;
        display:none;
        cursor: pointer;
        left: 0;
        transform: translateX(50%);
      }
      :global(.arrow-right) {
        position: absolute;
        display:none;
        cursor: pointer;
        right: 0;
        transform: translateX(-50%);
      }

    }
    :global(.ant-table-ping-left) {
      :global(.table-scroll-arrows) {
        :global(.arrow-left) {
          display:block;
        }
      }
    }

    :global(.ant-table-ping-right) {
      :global(.table-scroll-arrows) {
        :global(.arrow-right) {
          display:block;
        }
      }
    }
    :global(.ant-table) {
      background: transparent;
      font-size: 12px;
    }
    :global(.ant-table-cell-row-hover){
      background: var(--fill_bg_1) !important;
    }
    :global(.ant-table-thead) {
      :global(tr) {
        :global(th),
        :global(td) {
          height: 14px;
          line-height: 14px;
          padding-bottom: 8px;
          padding-top: 8px;
          padding-left: 0px;
          padding-right: 8px;
          background: var(--fill_bg_1);
          font-size: 12px;
          font-weight: 400;
          color: var(--text_3);
          transition: none;
          white-space: nowrap;
        }
      }
    }
    :global(.ant-table-thead){
      :global(tr) {
        :global(th),
        :global(td) {
          border-bottom:none !important;
        }
      }
    }
    :global(tr) {
      :global(th),
      :global(td) {
        // border-bottom: 1px solid var(--fill_line_1);
        border-bottom: none;

        vertical-align: middle;
        &:first-child {
          padding-left: 24px;
        }
        &:last-child {
          padding-right: 24px;
        }
        &::before {
          display: none !important;
        }
        :gloabl(div) {
          white-space: nowrap;
        }
      }


     
      :global(td) {
        line-height: 14px;
        padding: 8px 5px;
        padding-left: 2px;
        font-weight: 500;
        color: var(--text_1);
        font-size:12px;
      }
      @media ${MediaInfo.desktop} {
        :global(td.ant-table-cell-row-hover) {
          // background: transparent !important;
        }
      }
    }

    :global(.ant-table-cell-fix-left),
    :global(.ant-table-cell-fix-right) {
      background: var(--fill_bg_1);
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
      background: var(--fill_1);
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
          :global(.ant-table-cell) {

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
      line-height: 14px;
      font-size: 12px;
      font-weight: 500;
      color: var(--theme-font-color-1);
    }
  }

  .empty {
    height: 229px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .arrowCircle {
    width: 24px;
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--fill-tertiary-bg);
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.1);
    color: #6e7278;

    .left {
      transform: rotate(180deg);
    }

    & svg {
      pointer-events: none;
    }

    &:hover {
      color: #ff7800;
    }
  }
`;
const clsx = clsxWithScope(className);
export default RecordList;
