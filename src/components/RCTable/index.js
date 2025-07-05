import React, { useContext, useEffect, useMemo, useRef } from 'react';
import { Table } from 'antd';
import { injectIntl } from 'react-intl';
import clsx from 'clsx';
import BvIndicator from '../public/bvIndicator';

import styles from './RCTable.module.scss';
import isFunction from 'lodash/isFunction';
import isArray from 'lodash/isArray';
import get from 'lodash/get';

import { useInfiniteScroll } from 'ahooks';
import { ThemeContext } from '@/context';
import BVEmpty from '../BVEmpty';

function TradingTab(props) {
  const {
    columns,
    data,
    antTabContentClasses,
    getMore,
    fixheader,
    antTabContentStyle,
    loading,
    showNoMoreData,
    threshold = 200,
    /** 是否使用表头内容填充一行数据, 修复表格数据不允许换行,表头宽度>列宽度导致表头重叠问题 */
    fillTitleRow = false,
    hasMore = true,
    hasBorder = false,
    ...otherProps
  } = props;

  const themeContext = useContext(ThemeContext);
  const theme = useMemo(() => props.theme || themeContext.theme, [props, themeContext]);

  const dataSource = useMemo(() => {
    let results = [];
    if (data?.length && fillTitleRow) {
      results.push({ isFillTitleRow: true });
    }
    results = results.concat(data);

    if (showNoMoreData && !hasMore && !loading) {
      // 暂无更多数据
      results.push({
        hasNoData: true
      });
    } else if (loading) {
      results.push({
        isLoading: true
      });
    }
    return results;
  }, [data, fillTitleRow, showNoMoreData, hasMore, loading]);

  const tblColumns = useMemo(() => {
    return [...columns].map((item, columnIdx) => {
      const rawRender = item.render;

      item.render = (text, record, index) => {
        const { title, dataIndex } = columns[columnIdx];
        if (record.hasNoData || record.isLoading) {
          return record.hasNoData ? (
            <div className={styles.noMoreData}>
              {props.intl.formatMessage({
                id: '无更多数据'
              })}
            </div>
          ) : (
            <BvIndicator overrideClasses={styles.partialIndicator} />
          );
        }

        return record?.isFillTitleRow ? (
          // 使用表头标题填充
          <p className="fill-title-row">{title}</p>
        ) : isFunction(rawRender) ? (
          // 默认渲染函数
          rawRender(text, record, index)
        ) : isArray(dataIndex) ? (
          // 如果dataIndex为数组
          get(record, dataIndex)
        ) : (
          // 使用dataIndex
          record?.[dataIndex]
        );
      };

      item.onCell = record => {
        if (record.hasNoData || record.isLoading) {
          return {
            colSpan: columnIdx == 0 ? columns.length : 0
          };
        }
        return {};
      };
      return item;
    });
  }, [columns]);

  /** 无限加载 */
  const containerRef = useRef();
  const scrollRef = useRef();
  const timeRef = useRef(0);
  useInfiniteScroll(
    () => {
      const now = Date.now();
      if (now - timeRef.current < 800) return;
      timeRef.current = now;
      if (getMore) getMore();
    },
    {
      target: scrollRef,
      isNoMore: () => false,
      threshold,
      manual: true
    }
  );

  useEffect(() => {
    const scrollEl = containerRef.current.querySelector('.ant-table-body');
    if (scrollEl) {
      scrollRef.current = scrollEl;
    }
  }, [scrollRef]);

  return (
    <div
      ref={containerRef}
      className={clsx(
        'rc-table-wrap',
        styles.antTabContent,
        hasBorder ? styles.borderTable : '',
        antTabContentClasses,
        fixheader ? styles.fixheaderTable : ''
      )}
      style={antTabContentStyle}
    >
      <div style={{ width: '100%' }}>
        <Table
          showSorterTooltip={false}
          pagination={false}
          dataSource={dataSource}
          columns={tblColumns}
          locale={{
            emptyText: loading ? <div></div> : <BVEmpty theme={theme} />
          }}
          rowClassName={record => {
            if (record.isFillTitleRow) return styles.fillColumnTitle;
          }}
          {...otherProps}
        />
        {/* {showNoMoreData && !hasMore && !loading ? (
          <div className={styles.showNoMoreData}>
            {props.intl.formatMessage({
              id: '无更多数据'
            })}
          </div>
        ) : null} */}
        {/* {loading ? <BvIndicator /> : null} */}
      </div>
    </div>
  );
}

export default injectIntl(TradingTab);
