import { LANG } from '@/core/i18n';
import { Pagination as AntdPagination } from 'antd';
import CommonIcon from '../common-icon';

const Pagination = (props: any): JSX.Element => {
  const { pagination, total, className } = props;
  const current = pagination?.pageIndex;

  return (
    <div className={`page_container ${className ? className : ''}`}>
      <p className='notice'>{LANG('共{total}条记录，第{current}页', { total, current })}</p>
      <AntdPagination
        itemRender={(page: any, type: any, originalElement: any) => {
          if (['prev', 'next'].includes(type)) {
            return (
              <div className='page_item'>
                <CommonIcon name={`${type === 'prev' ? 'common-prev-icon-0' : 'common-next-icon-0'}`} size={14} />
              </div>
            );
          } else if (type === 'page') {
            return (
              <div className={`page_item ${page === pagination.pageIndex ? 'page_item_active' : undefined}`}>
                {page as number}
              </div>
            );
          }
          return originalElement;
        }}
        showSizeChanger={false}
        defaultCurrent={pagination?.pageIndex}
        total={total}
        {...(pagination || {})}
      />
      <style jsx>{`
        :global(.ant-pagination) {
          margin-top: 5px !important;
        }
        :global(.ant-pagination-prev),
        :global(.ant-pagination-next),
        :global(.ant-pagination-item) {
          min-height: 32px;
          line-height: 32px !important;
          height: 32px !important;
          background: transparent !important;
          transition: all 0.3s;
          &:hover {
            background: var(--theme-background-color-3) !important;
          }
        }
        :global(.ant-pagination-item) {
          border: none !important;
        }
        :global(.ant-pagination-prev),
        :global(.ant-pagination-next) {
          background: transparent !important;
        }
        :global(.ant-pagination-item-active) {
          border: none !important;
        }
        :global(.ant-pagination-item-link-icon) {
          color: var(--skin-main-font-color) !important;
        }
        :global(.ant-pagination-item-ellipsis) {
          color: var(--theme-font-color-3) !important;
          border-radius: 4px;
          // border: 1px solid var(--theme-border-color-2);
        }
        .page_container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          > p {
            color: var(--theme-font-color-3);
          }
          .page_item_active {
            border: none !important;
            color: var(--skin-font-color) !important;
            background: var(--skin-primary-color) !important;
          }
          .page_item {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 32px;
            height: 32px;
            border-radius: 4px;
            border: 1px solid var(--theme-border-color-2);
            color: var(--text_3);
            font-weight: 400;
          }
        }
      `}</style>
    </div>
  );
};
export default Pagination;
