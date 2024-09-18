import { EmptyComponent } from '@/components/empty';
import { clsx } from '@/core/utils';
import { memo, useEffect, useState } from 'react';
import css from 'styled-jsx/css';

type MobileTableProps = {
  columns: { hideColumn: boolean; title: string; dataIndex: string; hideTitle: boolean; hideContent: boolean }[]; // hideColumn 是否隐藏某个字段 hideTitle:隐藏标题;hideContent: 隐藏内容
  dataSource: [];
  className?: string;
  pagination?: { pageSize: number; current: number; onChange: () => void; showQuickJumper: boolean };
};

const TableCard = memo(({ content, columns }: any) => {
  if (!content) return null;
  return (
    <div className='mobile-table-card'>
      {columns.map((item: any, key: number) => {
        if (item?.hideColumn) return null;
        return (
          <div className='mobile-card-item' key={key}>
            <>
              {item.hideTitle ? null : <div className='card-item-title'>{item.title || content[item?.dataIndex]}</div>}
              {item?.hideContent ? null : (
                <div className='card-item-content'>
                  {item?.render ? item.render(content[item?.dataIndex], content) : content[item?.dataIndex]}
                </div>
              )}
            </>
          </div>
        );
      })}
    </div>
  );
});
export const MobileTable = memo((props: MobileTableProps) => {
  const { columns, dataSource, className, pagination } = props;
  const [data, setData] = useState([]);

  useEffect(() => {
    const current = pagination?.current ? pagination.current + '' : '';
    if (pagination?.current) {
      setData(
        dataSource?.slice(Number(current.sub(1).mul(pagination?.pageSize)), Number(current.mul(pagination?.pageSize)))
      );
    } else {
      setData(dataSource);
    }
  }, [dataSource, pagination?.current, pagination?.pageSize]);

  const renderAllTableCard = () => {
    if (!data.length) {
      return <EmptyComponent />;
    }
    return data.map((item: any, key: number) => {
      return <TableCard key={key} content={item} columns={columns} />;
    });
  };
  return (
    <div className={clsx('common-mobile-table', className)}>
      {renderAllTableCard()}
      <style jsx>{styles}</style>
    </div>
  );
});
const styles = css`
  .common-mobile-table {
    :global(.mobile-table-card) {
      &:not(:last-child) {
        border-bottom: 1px solid var(--theme-border-color-2);
      }
      margin-top: 7px;
      :global(.mobile-card-item) {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        padding-top: 4px;
        :global(.card-item-title) {
          flex: 1;
          color: var(--theme-font-color-1);
          font-size: 12px;
        }
        :global(.card-item-content) {
          flex: 1;
          text-align: right;
          color: var(--theme-font-color-1);
          font-size: 12px;
          word-break: break-all;
        }
      }
    }
  }
`;
