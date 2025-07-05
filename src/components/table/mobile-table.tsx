import { EmptyComponent } from '@/components/empty';
import { clsx, MediaInfo } from '@/core/utils';
import { memo, useEffect, useState } from 'react';
import { useRouter } from '@/core/hooks/src/use-router';
import css from 'styled-jsx/css';
import { Svg } from '@/components/svg';
import { useTradeHrefData } from '@/core/i18n/src/components/trade-link';
import CommonIcon from '../common-icon';

type MobileTableProps = {
  columns: { hideColumn: boolean; title: string; dataIndex: string; hideTitle: boolean; hideContent: boolean }[]; // hideColumn 是否隐藏某个字段 hideTitle:隐藏标题;hideContent: 隐藏内容
  dataSource: [];
  className?: string;
  pagination?: { pageSize: number; current: number; onChange: () => void; showQuickJumper: boolean };
  isHeaderColumn?: boolean;
  sortOrder?: { columnKey: string; order: string };
  onChange?: (...params: never) => void;
};

const TableCard = memo(({ content, columns }: any) => {
  if (!content) return null;
  return (
    <div className="mobile-table-card">
      {columns.map((item: any, key: number) => {
        if (item?.hideColumn) return null;
        return (
          <div className="mobile-card-item" key={key}>
            <>
              {item.hideTitle ? null : <div className="card-item-title">{item.title || content[item?.dataIndex]}</div>}
              {item?.hideContent ? null : (
                <div className="card-item-content">
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
  const { columns, dataSource, className, pagination, isHeaderColumn, sortOrder, onChange } = props;
  const router = useRouter();
  const { getHrefAndQuery } = useTradeHrefData();
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

  const _goToTrade = (id: string) => {
    const { href, query }: any = getHrefAndQuery(id.toUpperCase());
    router.push({
      pathname: href,
      query
    });
  };

  if (isHeaderColumn) {
    return (
      <>
        <div className="mobile-header-wrapper">
          {columns.map(item => (
            <div
              className="mobile-header-item"
              key={item.key}
              onClick={() => {
                const order =
                  item.key !== sortOrder?.columnKey && sortOrder?.order !== ''
                    ? sortOrder?.order
                    : sortOrder?.order === ''
                      ? 'ascend'
                      : sortOrder?.order === 'ascend'
                        ? 'descend'
                        : '';
                onChange('', '', { columnKey: item.key, order });
              }}
            >
              <span>{item.title}</span>
              <CommonIcon
                name={sortOrder?.columnKey !== item.key || sortOrder?.order === '' ? 'common-sort-icon' : (sortOrder?.order === 'descend' ? 'common-sort-down-active-icon' : 'common-sort-up-active-icon')}
                width={12}
                height={12}
                enableSkin
              />
            </div>
          ))}
        </div>
        {data.map((item: any, key: number) => (
          <div key={key} className="mobile-item" onClick={() => _goToTrade(item.id)}>
            {columns.map(obj => (
              <div key={obj.key}> {obj?.render ? obj.render(item[obj?.dataIndex], item) : item[obj?.dataIndex]}</div>
            ))}
          </div>
        ))}
        <style jsx>{styles}</style>
      </>
    );
  }
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
        border-bottom: 1px solid var(--fill_line_1);
      }
      margin-top: 12px;
      :global(.mobile-card-item) {
        display: flex;
        justify-content: space-between;
        margin-bottom: 16px;

        :global(.card-item-title) {
          flex: 1;
          color: var(--text_1);
          font-size: 14px;
          font-weight: 400;
        }
        :global(.card-item-content) {
          flex: 1;
          display: flex;
          justify-content: flex-end;
          text-align: right;
          color: var(--text_1);
          font-size: 14px;
          word-break: break-all;
          font-weight: 500;
        }
      }
    }
  }
  .mobile-header-wrapper,
  .mobile-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .mobile-header-wrapper {
    position: sticky;
    top: 11.5rem;
    z-index: 100;
    padding: 8px 0;
    margin-bottom: 8px;
  }
  .mobile-header-item {
    display: flex;
    align-items: center;
    cursor: pointer;
    span {
      font-size: 12px;
      color: var(--text_3);
    }
    .sort-icons {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 1rem;
      height: 1rem;
      :global(.down) {
        transform: rotate(-180deg);
      }
      :global(svg) {
        fill: var(--text_3);
      }
      :global(.selected) {
        :global(svg) {
          fill: var(--brand);
        }
      }
    }
  }
  .mobile-item {
    margin-bottom: 1.5rem;
    :global(.trade_pair) {
      gap: 8px;
    }
    :global(.trade_pair_name) {
      font-weight: 700;
    }
    :global(.latest-price) {
      font-size: 14px;
      font-weight: 500;
      text-align: right;
    }
    :global(.change-rate) {
      font-size: 12px;
      font-weight: 500;
      text-align: right;
    }
    :global(> div:last-child) {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
  }
`;
